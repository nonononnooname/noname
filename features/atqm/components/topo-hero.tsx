"use client";

import { useEffect, useRef } from "react";

import { HERO } from "../data";

/**
 * 3D topographic parallax hero (adapted "halide topo" technique), re-skinned to
 * the ATQM brand: black canvas, single yellow accent, Geologica display type.
 * Layout is scoped to this section (absolute inset-0, no position:fixed / 100vw)
 * so it sits cleanly below the sticky header without breaking the page.
 */
export function TopoHero() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const layers = Array.from(
      canvas.querySelectorAll<HTMLDivElement>(".ah-layer"),
    );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const FINAL = "rotateX(55deg) rotateZ(-25deg) scale(1)";

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reduce) {
      canvas.style.opacity = "1";
      canvas.style.transform = FINAL;
    } else {
      // Grand entrance: rise + settle into the isometric plane.
      canvas.style.opacity = "0";
      canvas.style.transform = "rotateX(90deg) rotateZ(0deg) scale(0.8)";
      timers.push(
        setTimeout(() => {
          canvas.style.transition =
            "opacity 2.2s cubic-bezier(0.16,1,0.3,1), transform 2.2s cubic-bezier(0.16,1,0.3,1)";
          canvas.style.opacity = "1";
          canvas.style.transform = FINAL;
        }, 300),
      );
      // After the entrance, shorten the transition so parallax feels responsive.
      timers.push(
        setTimeout(() => {
          canvas.style.transition =
            "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
        }, 300 + 2200),
      );
    }

    let onMove: ((e: MouseEvent) => void) | undefined;
    if (finePointer && !reduce) {
      onMove = (e: MouseEvent) => {
        const x = (window.innerWidth / 2 - e.pageX) / 25;
        const y = (window.innerHeight / 2 - e.pageY) / 25;
        canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;
        layers.forEach((layer, index) => {
          const depth = (index + 1) * 15;
          const moveX = x * (index + 1) * 0.2;
          const moveY = y * (index + 1) * 0.2;
          layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
        });
      };
      window.addEventListener("mousemove", onMove);
    }

    return () => {
      if (onMove) window.removeEventListener("mousemove", onMove);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative flex h-[calc(100vh-4rem)] min-h-[600px] items-center justify-center overflow-hidden bg-background">
      <div className="ah-scope">
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
          .ah-viewport {
            position: absolute; inset: 0;
            perspective: 2000px;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; z-index: 0;
          }
          .ah-canvas {
            position: relative;
            width: min(800px, 86vw);
            height: min(500px, 54vw);
            transform-style: preserve-3d;
            transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
            will-change: transform, opacity;
          }
          .ah-layer {
            position: absolute; inset: 0;
            border: 1px solid rgba(224,224,224,0.1);
            background-size: cover; background-position: center;
            transition: transform 0.5s ease;
          }
          .ah-layer-1 { background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'); filter: grayscale(1) contrast(1.2) brightness(0.5); }
          .ah-layer-2 { background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200'); filter: grayscale(1) contrast(1.1) brightness(0.7); opacity: 0.6; mix-blend-mode: screen; }
          .ah-layer-3 { background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200'); filter: grayscale(1) contrast(1.3) brightness(0.8); opacity: 0.4; mix-blend-mode: overlay; }
          .ah-contours {
            position: absolute; width: 200%; height: 200%; top: -50%; left: -50%;
            background-image: repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(255,216,3,0.06) 41px, transparent 42px);
            transform: translateZ(120px); pointer-events: none;
          }
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
            .ah-canvas { transition: none; }
            .ah-scroll { animation: none; }
          }
        `}</style>

        {/* SVG grain filter */}
        <svg
          aria-hidden
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <filter id="atqm-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {/* 3D topographic canvas */}
        <div className="ah-viewport">
          <div className="ah-canvas" ref={canvasRef}>
            <div className="ah-layer ah-layer-1" />
            <div className="ah-layer ah-layer-2" />
            <div className="ah-layer ah-layer-3" />
            <div className="ah-contours" />
          </div>
        </div>

        <div className="ah-grain" style={{ filter: "url(#atqm-grain)" }} />

        {/* Interface grid */}
        <div className="ah-grid">
          <div className="ah-tag">ATOM QUANTUM</div>
          <div className="ah-readout">
            <div>{HERO.primitives.join(" · ")}</div>
            <div>FINALITY &lt; 1.0 s</div>
            <div>{HERO.domain}</div>
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
