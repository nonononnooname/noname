"use client";

import { useEffect, useRef } from "react";

import { HERO } from "../data";

/**
 * Hero background: an animated post-quantum *lattice field*. ML-KEM / ML-DSA are
 * lattice-based cryptography, so the visual is the project's actual math — a mesh
 * of drifting nodes with yellow "signature" pulses propagating along the edges
 * (finality spreading through the network). Canvas 2D, DPR-aware, parallax on a
 * fine pointer, and fully static under prefers-reduced-motion. Colours are read
 * from brand tokens (--foreground / --primary), never hard-coded.
 */

type Node = { bx: number; by: number; z: number; phase: number; x: number; y: number };
type Pulse = { from: number; to: number; t: number; speed: number; hops: number; dead?: boolean };

const MAX_PULSES = 6;
const MAX_HOPS = 12;

export function LatticeHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const fg = root.getPropertyValue("--foreground").trim() || "#ffffff";
    const accent = root.getPropertyValue("--primary").trim() || "#ffd803";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let connectDist = 0;
    let nodes: Node[] = [];
    let edges: Array<[number, number]> = [];
    let neighbors: number[][] = [];
    let pulses: Pulse[] = [];
    const mouse = { x: 0, y: 0 };
    const rnd = () => Math.random();

    function build() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = width < 640 ? 90 : 78;
      connectDist = spacing * 1.7;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const jit = spacing * 0.34;

      nodes = [];
      const grid: number[][] = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          nodes.push({
            bx: (c - 1) * spacing + (rnd() - 0.5) * jit,
            by: (r - 1) * spacing + (rnd() - 0.5) * jit,
            z: 0.35 + rnd() * 0.65,
            phase: rnd() * Math.PI * 2,
            x: 0,
            y: 0,
          });
          grid[r][c] = nodes.length - 1;
        }
      }

      edges = [];
      neighbors = nodes.map(() => []);
      const addEdge = (a: number, b: number) => {
        edges.push([a, b]);
        neighbors[a].push(b);
        neighbors[b].push(a);
      };
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = grid[r][c];
          if (c + 1 < cols) addEdge(i, grid[r][c + 1]);
          if (r + 1 < rows) addEdge(i, grid[r + 1][c]);
        }
      }
      pulses = [];
    }

    function spawnPulse() {
      if (pulses.length >= MAX_PULSES || edges.length === 0) return;
      const [a, b] = edges[Math.floor(rnd() * edges.length)];
      pulses.push({ from: a, to: b, t: 0, speed: 0.012 + rnd() * 0.01, hops: 0 });
    }

    let raf = 0;
    let last = 0;
    let spawnAcc = 0;
    const start = performance.now();

    function frame(now: number) {
      const time = (now - start) / 1000;
      const dt = last ? Math.min(now - last, 50) : 16;
      last = now;
      const step = dt / 16.67;

      ctx!.clearRect(0, 0, width, height);
      const amp = reduce ? 0 : 7;

      for (const n of nodes) {
        n.x = n.bx + Math.sin(time * 0.5 + n.phase) * amp + mouse.x * n.z * 26;
        n.y = n.by + Math.cos(time * 0.42 + n.phase) * amp + mouse.y * n.z * 26;
      }

      // lattice edges
      ctx!.strokeStyle = fg;
      ctx!.lineWidth = 1;
      for (const [a, b] of edges) {
        const na = nodes[a];
        const nb = nodes[b];
        const d = Math.hypot(na.x - nb.x, na.y - nb.y);
        if (d > connectDist) continue;
        ctx!.globalAlpha = (1 - d / connectDist) * 0.16 * Math.min(na.z, nb.z);
        ctx!.beginPath();
        ctx!.moveTo(na.x, na.y);
        ctx!.lineTo(nb.x, nb.y);
        ctx!.stroke();
      }

      // lattice nodes
      ctx!.fillStyle = fg;
      for (const n of nodes) {
        ctx!.globalAlpha = n.z * 0.5;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.z * 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      // signature pulses
      if (!reduce) {
        for (const p of pulses) {
          p.t += p.speed * step;
          while (p.t >= 1) {
            p.t -= 1;
            p.hops += 1;
            const nbrs = neighbors[p.to];
            const next = nbrs.length ? nbrs[Math.floor(rnd() * nbrs.length)] : -1;
            if (next < 0 || p.hops > MAX_HOPS) {
              p.dead = true;
              break;
            }
            p.from = p.to;
            p.to = next;
          }
        }
        pulses = pulses.filter((p) => !p.dead);

        ctx!.shadowColor = accent;
        for (const p of pulses) {
          const a = nodes[p.from];
          const b = nodes[p.to];
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          ctx!.globalAlpha = 0.5;
          ctx!.strokeStyle = accent;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(x, y);
          ctx!.stroke();
          ctx!.globalAlpha = 1;
          ctx!.fillStyle = accent;
          ctx!.shadowBlur = 10;
          ctx!.beginPath();
          ctx!.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }

        spawnAcc += dt;
        if (spawnAcc > 850) {
          spawnAcc = 0;
          spawnPulse();
        }
      }

      ctx!.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) frame(performance.now());
    });
    ro.observe(wrap);

    build();
    if (reduce) {
      frame(performance.now());
    } else {
      spawnPulse();
      spawnPulse();
      raf = requestAnimationFrame(frame);
    }

    // entrance fade
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.4s ease";
    const fadeTimer = setTimeout(() => {
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
      clearTimeout(fadeTimer);
      ro.disconnect();
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section
      className="relative flex h-[calc(100vh-4rem)] min-h-[600px] items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <style>{`@keyframes lh-flow{0%,100%{transform:translateX(-50%) scaleY(0);transform-origin:top}50%{transform:translateX(-50%) scaleY(1);transform-origin:top}51%{transform:translateX(-50%) scaleY(1);transform-origin:bottom}}`}</style>

      {/* animated lattice */}
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 38%, color-mix(in oklab, var(--primary) 7%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 120% at 50% 50%, transparent 52%, var(--background) 100%)",
          }}
        />
      </div>

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
            className="inline-flex min-h-11 items-center bg-foreground px-6 py-3 font-ui text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-primary focus-visible:bg-primary focus-visible:outline-none"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
          >
            Explore the stack
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 h-14 w-px bg-gradient-to-b from-foreground to-transparent [animation:lh-flow_2s_ease-in-out_infinite] motion-reduce:hidden"
      />
    </section>
  );
}
