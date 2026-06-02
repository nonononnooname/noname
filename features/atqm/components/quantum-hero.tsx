"use client";

import { useEffect, useRef } from "react";

import { HERO } from "../data";

/**
 * Premium hero background: a luminous quantum "atom" — a glowing nucleus with
 * three rotating electron orbits — over a depth-of-field cloud of softly blooming
 * particles. Everything is drawn with additive blending so light accumulates into
 * real bloom (the thing flat dot-grids lack). Colours come from brand tokens
 * (--primary / --foreground); motion is parallax-aware and disabled under
 * prefers-reduced-motion.
 */

type Particle = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  phase: number;
  vx: number;
  vy: number;
  yellow: boolean;
};

const ORBITS = [
  { baseRot: 0, ry: 0.34, spin: 0.05, ePhase: 0, eSpeed: 0.55 },
  { baseRot: Math.PI / 3, ry: 0.46, spin: -0.04, ePhase: 2.1, eSpeed: 0.43 },
  { baseRot: (2 * Math.PI) / 3, ry: 0.28, spin: 0.06, ePhase: 4.2, eSpeed: 0.66 },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(n || "ffffff", 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function QuantumHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const accent = hexToRgb(root.getPropertyValue("--primary").trim() || "#ffd803");
    const white = hexToRgb(root.getPropertyValue("--foreground").trim() || "#ffffff");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    /** Pre-rendered soft radial glow sprite for additive bloom. */
    function glow(color: [number, number, number]): HTMLCanvasElement {
      const size = 128;
      const s = document.createElement("canvas");
      s.width = size;
      s.height = size;
      const c = s.getContext("2d");
      if (c) {
        const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, rgba(color, 0.85));
        g.addColorStop(0.18, rgba(color, 0.45));
        g.addColorStop(0.45, rgba(color, 0.1));
        g.addColorStop(1, rgba(color, 0));
        c.fillStyle = g;
        c.fillRect(0, 0, size, size);
      }
      return s;
    }
    const glowW = glow(white);
    const glowY = glow(accent);

    let width = 0;
    let height = 0;
    let R = 0;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0 };
    const rnd = () => Math.random();

    function build() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(width, height) * 0.34;

      const count = Math.min(160, Math.round((width * height) / 13000));
      particles = Array.from({ length: count }, () => ({
        x: rnd() * width,
        y: rnd() * height,
        r: 3 + rnd() * 16,
        a: 0.04 + rnd() * 0.22,
        tw: 0.3 + rnd() * 1.2,
        phase: rnd() * Math.PI * 2,
        vx: (rnd() - 0.5) * 0.12,
        vy: (rnd() - 0.5) * 0.12,
        yellow: rnd() < 0.14,
      }));
    }

    function frame(now: number) {
      const time = now / 1000;
      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";

      const cx = width * 0.6 + mouse.x * 46;
      const cy = height * 0.42 + mouse.y * 46;

      // particle cloud (depth + twinkle)
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx + Math.sin(time * 0.25 + p.phase) * 0.12;
          p.y += p.vy + Math.cos(time * 0.22 + p.phase) * 0.12;
          if (p.x < -40) p.x = width + 40;
          if (p.x > width + 40) p.x = -40;
          if (p.y < -40) p.y = height + 40;
          if (p.y > height + 40) p.y = -40;
        }
        const tw = reduce ? p.a : p.a * (0.55 + 0.45 * Math.sin(time * p.tw + p.phase));
        ctx!.globalAlpha = Math.max(0, tw);
        ctx!.drawImage(p.yellow ? glowY : glowW, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }

      // nucleus glow + hot core
      ctx!.globalAlpha = reduce ? 0.5 : 0.5 + 0.08 * Math.sin(time * 0.8);
      const cr = R * 1.15;
      ctx!.drawImage(glowY, cx - cr, cy - cr, cr * 2, cr * 2);
      ctx!.globalAlpha = 0.9;
      ctx!.drawImage(glowW, cx - 34, cy - 34, 68, 68);

      // electron orbits
      for (const o of ORBITS) {
        const rot = o.baseRot + (reduce ? 0 : time * o.spin);
        const rx = R;
        const ry = R * o.ry;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);

        ctx!.globalAlpha = 1;
        ctx!.strokeStyle = rgba(white, 0.1);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
        ctx!.stroke();

        // glowing electron + trail
        const a = o.ePhase + (reduce ? 0 : time * o.eSpeed);
        for (let t = 0; t < 7; t++) {
          const aa = a - t * 0.14;
          const ex = rx * Math.cos(aa);
          const ey = ry * Math.sin(aa);
          const px = cx + ex * cos - ey * sin;
          const py = cy + ex * sin + ey * cos;
          const r = t === 0 ? 24 : 16;
          ctx!.globalAlpha = (t === 0 ? 1 : 0.45) * (1 - t / 7);
          ctx!.drawImage(glowY, px - r, py - r, r * 2, r * 2);
        }
      }

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    let raf = 0;
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) frame(performance.now());
    });
    ro.observe(wrap);
    build();
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
        mouse.x = e.clientX / window.innerWidth - 0.5;
        mouse.y = e.clientY / window.innerHeight - 0.5;
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
    <section
      className="relative flex h-[calc(100vh-4rem)] min-h-[600px] items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <style>{`@keyframes qh-flow{0%,100%{transform:translateX(-50%) scaleY(0);transform-origin:top}50%{transform:translateX(-50%) scaleY(1);transform-origin:top}51%{transform:translateX(-50%) scaleY(1);transform-origin:bottom}}`}</style>

      {/* quantum field */}
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
        {/* film grain for premium texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ filter: "url(#qh-grain)" }}
        />
        {/* edge vignette into the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 125% at 60% 42%, transparent 45%, var(--background) 100%)",
          }}
        />
      </div>

      <svg aria-hidden className="absolute size-0">
        <filter id="qh-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* interface overlay */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground">
            ATQM // ARETH
          </p>
          <div className="text-right font-mono text-[0.68rem] leading-relaxed text-primary">
            <div>{HERO.primitives.join(" · ")}</div>
            <div>FINALITY &lt; 1.0 s</div>
            <div>{HERO.domain}</div>
          </div>
        </div>

        <div className="max-w-4xl">
          <h1
            className="font-display font-extralight leading-[0.85] tracking-[-0.04em] text-foreground"
            style={{ fontSize: "clamp(2.75rem, 11vw, 9rem)" }}
          >
            ATOM
            <br />
            QUANTUM
          </h1>
          <p className="mt-5 max-w-[42ch] font-ui text-sm leading-relaxed text-muted-foreground sm:text-base">
            {HERO.lede}
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
            <p>[ {HERO.eyebrow.toUpperCase()} · 2026 ]</p>
            <p>{HERO.tagline.toUpperCase()}</p>
          </div>
          <a
            href="#problem"
            className="inline-flex min-h-11 items-center bg-foreground px-6 py-3 font-ui text-xs font-bold uppercase tracking-wider text-background transition-[background-color,box-shadow] duration-300 hover:bg-primary hover:glow-yellow focus-visible:bg-primary focus-visible:glow-yellow focus-visible:outline-none"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
          >
            Explore the stack
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 h-14 w-px bg-gradient-to-b from-foreground to-transparent [animation:qh-flow_2s_ease-in-out_infinite] motion-reduce:hidden"
      />
    </section>
  );
}
