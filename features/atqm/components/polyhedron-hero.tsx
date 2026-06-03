"use client";

import { useEffect, useRef } from "react";

import { HERO } from "../data";

/**
 * Hero figure: a slowly tumbling glowing wireframe icosahedron (12 vertices,
 * 30 edges) rendered with a real bloom pipeline (downsampled offscreen buffer →
 * blurred halo → additive composite) so edges read as soft glowing tubes and
 * vertices as luminous orbs. Depth-of-field swells off-focus vertices into soft
 * bokeh; energy packets pulse along the edges. Brand tokens only (--primary on
 * black). The surrounding layout is the original ATQM "interface grid" hero —
 * the icosahedron simply replaces the old topographic background figure.
 */

const PHI = (1 + Math.sqrt(5)) / 2;
const NORM = Math.hypot(1, PHI);
const VERTS: Array<[number, number, number]> = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
].map(([x, y, z]) => [x / NORM, y / NORM, z / NORM]);
const EDGES: Array<[number, number]> = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9],
  [10, 11],
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(n || "fbbf24", 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

// Render the mesh at this fraction of CSS size, then upscale. The downsample
// keeps the per-frame blur cheap and adds a soft, premium falloff on upscale
// (the lower the scale, the more "frosted glass" the cores read).
const SCALE = 0.62;
// Focal plane in normalized depth: vertices near it stay sharp, vertices far
// from it swell into larger, dimmer bokeh blobs (depth-of-field).
const FOCAL_Z = 0.35;

export function PolyhedronHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const accent = hexToRgb(root.getPropertyValue("--primary").trim() || "#fbbf24");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const rgba = (a: number) => `rgba(${accent[0]},${accent[1]},${accent[2]},${a})`;

    // soft radial glow sprite stamped for vertex nodes, pulses + ambient core
    const glow = document.createElement("canvas");
    glow.width = 128;
    glow.height = 128;
    const glowCtx = glow.getContext("2d");
    if (glowCtx) {
      const g = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, rgba(0.95));
      g.addColorStop(0.18, rgba(0.55));
      g.addColorStop(0.45, rgba(0.14));
      g.addColorStop(1, rgba(0));
      glowCtx.fillStyle = g;
      glowCtx.fillRect(0, 0, 128, 128);
    }

    // offscreen buffers (scene = crisp mesh, bloom = blurred halo), downsampled
    const scene = document.createElement("canvas");
    const sceneCtx = scene.getContext("2d");
    const bloom = document.createElement("canvas");
    const bloomCtx = bloom.getContext("2d");
    if (!sceneCtx || !bloomCtx) return;

    let width = 0;
    let height = 0;
    let sw = 0;
    let sh = 0;
    let dpr = 1;
    let R = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      sw = Math.max(1, Math.round(width * SCALE));
      sh = Math.max(1, Math.round(height * SCALE));
      scene.width = sw;
      scene.height = sh;
      bloom.width = sw;
      bloom.height = sh;
      // R is in scene-space pixels (projection happens in the downsampled buffer)
      R = Math.min(sw, sh) * (width < 768 ? 0.42 : 0.38);
    }

    const CAM = 3.4;

    function frame(now: number) {
      const t = now / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // centered, matching the original hero's centered background figure
      const cx = sw * 0.5;
      const cy = sh * 0.5;
      const ax = (reduce ? 0.7 : t * 0.16) + mouse.y * 0.5;
      const ay = (reduce ? 0.4 : t * 0.24) + mouse.x * 0.7;
      const cosx = Math.cos(ax), sinx = Math.sin(ax);
      const cosy = Math.cos(ay), siny = Math.sin(ay);

      const proj = VERTS.map(([x0, y0, z0]) => {
        const y1 = y0 * cosx - z0 * sinx;
        const z1 = y0 * sinx + z0 * cosx;
        const x2 = x0 * cosy + z1 * siny;
        const z2 = -x0 * siny + z1 * cosy;
        const persp = CAM / (CAM - z2);
        return { x: cx + x2 * R * persp, y: cy + y1 * R * persp, z: z2, persp };
      });

      // ---- 1. crisp mesh into the downsampled scene buffer ----
      sceneCtx!.setTransform(1, 0, 0, 1, 0, 0);
      sceneCtx!.clearRect(0, 0, sw, sh);
      sceneCtx!.globalCompositeOperation = "lighter";
      sceneCtx!.lineCap = "round";
      sceneCtx!.lineJoin = "round";

      // ambient core glow
      sceneCtx!.globalAlpha = reduce ? 0.5 : 0.4 + 0.08 * Math.sin(t * 0.9);
      const cr = R * 1.6;
      sceneCtx!.drawImage(glow, cx - cr, cy - cr, cr * 2, cr * 2);

      // edges — faint soft body + bright thin core (the bloom turns these into tubes)
      sceneCtx!.strokeStyle = rgba(1);
      for (const [a, b] of EDGES) {
        const pa = proj[a];
        const pb = proj[b];
        const f = ((pa.z + pb.z) / 2 + 1) / 2; // 0 back .. 1 front
        sceneCtx!.globalAlpha = 0.04 + f * 0.16;
        sceneCtx!.lineWidth = 1.1 + f * 2.0;
        sceneCtx!.beginPath();
        sceneCtx!.moveTo(pa.x, pa.y);
        sceneCtx!.lineTo(pb.x, pb.y);
        sceneCtx!.stroke();
        sceneCtx!.globalAlpha = 0.14 + f * 0.55;
        sceneCtx!.lineWidth = 0.5 + f * 0.9;
        sceneCtx!.beginPath();
        sceneCtx!.moveTo(pa.x, pa.y);
        sceneCtx!.lineTo(pb.x, pb.y);
        sceneCtx!.stroke();
      }

      // vertex nodes — luminous orbs with depth-of-field bokeh: vertices off
      // the focal plane swell into larger, dimmer soft blobs; in-focus ones
      // stay tight and bright.
      for (const p of proj) {
        const f = (p.z + 1) / 2;
        const defocus = Math.min(1, Math.abs(p.z - FOCAL_Z) / 1.3);
        const r = (5 + f * 13) * p.persp * (1 + defocus * 1.5);
        sceneCtx!.globalAlpha = (0.26 + f * 0.74) * (1 - defocus * 0.5);
        sceneCtx!.drawImage(glow, p.x - r, p.y - r, r * 2, r * 2);
      }

      // pulsing energy travelling along each edge — a bright packet that fades
      // in near one vertex, peaks mid-edge, and fades out at the other.
      if (!reduce) {
        for (let i = 0; i < EDGES.length; i++) {
          const pa = proj[EDGES[i][0]];
          const pb = proj[EDGES[i][1]];
          const f = ((pa.z + pb.z) / 2 + 1) / 2;
          const u = (t * (0.16 + (i % 3) * 0.05) + i * 0.137) % 1;
          const env = Math.sin(u * Math.PI);
          if (env <= 0.03) continue;
          const px = pa.x + (pb.x - pa.x) * u;
          const py = pa.y + (pb.y - pa.y) * u;
          const pr = (2.5 + f * 7) * env;
          sceneCtx!.globalAlpha = (0.35 + f * 0.55) * env;
          sceneCtx!.drawImage(glow, px - pr, py - pr, pr * 2, pr * 2);
        }
      }

      // ---- 2. bloom buffer: three additive blurred copies of the scene ----
      const bBig = width < 768 ? 12 : 18;
      const bMid = width < 768 ? 4 : 6;
      bloomCtx!.setTransform(1, 0, 0, 1, 0, 0);
      bloomCtx!.clearRect(0, 0, sw, sh);
      bloomCtx!.globalCompositeOperation = "lighter";
      // widest pass = soft "frosted glass" haze that wraps the whole mesh
      bloomCtx!.filter = `blur(${Math.round(bBig * 1.8)}px)`;
      bloomCtx!.globalAlpha = 0.5;
      bloomCtx!.drawImage(scene, 0, 0);
      bloomCtx!.filter = `blur(${bBig}px)`;
      bloomCtx!.globalAlpha = 0.8;
      bloomCtx!.drawImage(scene, 0, 0);
      bloomCtx!.filter = `blur(${bMid}px)`;
      bloomCtx!.globalAlpha = 0.9;
      bloomCtx!.drawImage(scene, 0, 0);
      bloomCtx!.filter = "none";
      bloomCtx!.globalAlpha = 1;

      // ---- 3. composite onto the visible canvas: soft cores + bloom halo ----
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";
      // cores get a whisper of blur so nothing reads razor-sharp (frosted feel)
      ctx!.filter = "blur(1px)";
      ctx!.globalAlpha = 0.8;
      ctx!.drawImage(scene, 0, 0, width, height);
      ctx!.filter = "none";
      ctx!.globalAlpha = 0.92;
      ctx!.drawImage(bloom, 0, 0, width, height);
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    let raf = 0;
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(performance.now());
    });
    ro.observe(wrap);
    resize();
    if (reduce) frame(performance.now());
    else raf = requestAnimationFrame(frame);

    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.6s ease";
    const fade = setTimeout(() => {
      canvas.style.opacity = "1";
    }, 60);

    let onMove: ((e: MouseEvent) => void) | undefined;
    if (finePointer && !reduce) {
      onMove = (e: MouseEvent) => {
        mouse.tx = e.clientX / window.innerWidth - 0.5;
        mouse.ty = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("mousemove", onMove);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fade);
      ro.disconnect();
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section className="relative flex h-[calc(100vh-4rem)] min-h-[600px] items-center justify-center overflow-hidden bg-background">
      <div className="ah-scope" ref={wrapRef}>
        <style>{`
          .ah-scope {
            --bg: #000000;
            --silver: #e6e6e6;
            --accent: var(--brand-yellow, #ffd803);
            --grain-opacity: 0.12;
            position: absolute;
            inset: 0;
            background: var(--bg);
            color: var(--silver);
          }
          .ah-figure { position: absolute; inset: 0; z-index: 0; }
          .ah-grain {
            position: absolute; inset: 0; pointer-events: none;
            z-index: 20; opacity: var(--grain-opacity);
          }
          .ah-grid {
            position: absolute; inset: 0; z-index: 10;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto 1fr auto;
            gap: 1rem; padding: 1.5rem;
            pointer-events: none;
          }
          @media (min-width: 640px) { .ah-grid { padding: 3rem; } }
          @media (min-width: 1024px) { .ah-grid { padding: 4rem; } }
          .ah-tag { font-family: var(--font-ui); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
          .ah-readout { text-align: right; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.68rem; line-height: 1.6; color: var(--accent); }
          .ah-headline { grid-column: 1 / -1; align-self: center; }
          .ah-title {
            font-size: clamp(2.75rem, 11vw, 9rem);
            line-height: 0.85; letter-spacing: -0.04em; font-weight: 200;
            mix-blend-mode: difference;
          }
          .ah-lede {
            margin-top: 1.25rem; max-width: 42ch;
            font-family: var(--font-ui);
            font-size: clamp(0.8rem, 1.6vw, 1rem); letter-spacing: 0.02em;
            color: rgba(230,230,230,0.72);
          }
          .ah-foot { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem; }
          .ah-meta { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.7rem; line-height: 1.7; color: rgba(230,230,230,0.7); }
          .ah-cta {
            pointer-events: auto; display: inline-flex; align-items: center;
            min-height: 44px; padding: 0.85rem 1.6rem;
            background: var(--silver); color: #000;
            font-family: var(--font-ui); font-weight: 700; font-size: 0.78rem;
            letter-spacing: 0.06em; text-transform: uppercase;
            clip-path: polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%);
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .ah-cta:hover, .ah-cta:focus-visible { background: var(--accent); transform: translateY(-4px); outline: none; }
          .ah-scroll {
            position: absolute; bottom: 1.25rem; left: 50%; width: 1px; height: 54px;
            background: linear-gradient(to bottom, var(--silver), transparent);
            animation: ah-flow 2s infinite ease-in-out;
          }
          @keyframes ah-flow {
            0%, 100% { transform: scaleY(0); transform-origin: top; }
            50% { transform: scaleY(1); transform-origin: top; }
            51% { transform: scaleY(1); transform-origin: bottom; }
          }
          @media (prefers-reduced-motion: reduce) {
            .ah-scroll { animation: none; }
          }
        `}</style>

        {/* SVG grain filter */}
        <svg aria-hidden style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id="atqm-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {/* glowing icosahedron figure (replaces the old topographic background) */}
        <canvas ref={canvasRef} className="ah-figure" />

        <div className="ah-grain" style={{ filter: "url(#atqm-grain)" }} />

        {/* Interface grid */}
        <div className="ah-grid">
          <div className="ah-tag">ATQM</div>
          <div className="ah-readout">
            <div>{HERO.primitives.join(" · ")}</div>
            <div>FINALITY &lt; 1.0 s</div>
          </div>

          <div className="ah-headline">
            <h1 className="ah-title font-display">
              ATOM
              <br />
              QUANTUM
            </h1>
            <p className="ah-lede">{HERO.lede}</p>
          </div>

          <div className="ah-foot">
            <div className="ah-meta">
              <p>[ {HERO.eyebrow.toUpperCase()} · 2026 ]</p>
              <p>{HERO.tagline.toUpperCase()}</p>
            </div>
            <a href="#problem" className="ah-cta">
              Explore the stack
            </a>
          </div>
        </div>

        <div className="ah-scroll" />
      </div>
    </section>
  );
}
