"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface EntropyProps {
  className?: string;
  /** Fixed square size (px) when not in fill mode. */
  size?: number;
  /** Fill the parent container instead of a fixed square. */
  fill?: boolean;
  particleColor?: string;
  accentColor?: string;
}

/**
 * "Order vs chaos" particle field — an ordered grid on the left bleeds into a
 * chaotic swarm on the right. Adapted to the ATQM brand: white particles with a
 * yellow accent seam. Honors prefers-reduced-motion (renders a settled static
 * frame). In `fill` mode it sizes to the largest parent dimension and centers,
 * so it can sit behind content as an ambient backdrop.
 */
export function Entropy({
  className = "",
  size = 400,
  fill = false,
  particleColor = "#ffffff",
  accentColor = "#ffd803",
}: EntropyProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dim, setDim] = useState(size);

  // Measure the container in fill mode.
  useEffect(() => {
    if (!fill) {
      setDim(size);
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () =>
      setDim(Math.max(el.clientWidth, el.clientHeight, 1));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fill, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = dim;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = s * dpr;
    canvas.height = s * dpr;
    canvas.style.width = `${s}px`;
    canvas.style.height = `${s}px`;
    ctx.scale(dpr, dpr);

    const withAlpha = (hex: string, alpha: number) =>
      `${hex}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;

    // Keep the original density/connectivity at any canvas size: pick a grid so
    // particle spacing stays tight, then scale every distance threshold by how
    // much bigger the spacing is than the reference (400px / 25 = 16px).
    const gridSize = Math.max(22, Math.min(40, Math.round(s / 34)));
    const spacing = s / gridSize;
    const scale = spacing / 16;
    const neighborRadius = 100 * scale;
    const lineRadius = 50 * scale;

    class Particle {
      x: number;
      y: number;
      size: number;
      order: boolean;
      velocity: { x: number; y: number };
      originalX: number;
      originalY: number;
      influence = 0;
      neighbors: Particle[] = [];

      constructor(x: number, y: number, order: boolean) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.order = order;
        this.size = scale;
        this.velocity = {
          x: (Math.random() - 0.5) * 2 * scale,
          y: (Math.random() - 0.5) * 2 * scale,
        };
      }

      update() {
        if (this.order) {
          const dx = this.originalX - this.x;
          const dy = this.originalY - this.y;
          const chaos = { x: 0, y: 0 };
          this.neighbors.forEach((n) => {
            if (n.order) return;
            const distance = Math.hypot(this.x - n.x, this.y - n.y);
            const strength = Math.max(0, 1 - distance / neighborRadius);
            chaos.x += n.velocity.x * strength;
            chaos.y += n.velocity.y * strength;
            this.influence = Math.max(this.influence, strength);
          });
          this.x += dx * 0.05 * (1 - this.influence) + chaos.x * this.influence;
          this.y += dy * 0.05 * (1 - this.influence) + chaos.y * this.influence;
          this.influence *= 0.99;
        } else {
          this.velocity.x += (Math.random() - 0.5) * 0.5 * scale;
          this.velocity.y += (Math.random() - 0.5) * 0.5 * scale;
          this.velocity.x *= 0.95;
          this.velocity.y *= 0.95;
          this.x += this.velocity.x;
          this.y += this.velocity.y;
          if (this.x < s / 2 || this.x > s) this.velocity.x *= -1;
          if (this.y < 0 || this.y > s) this.velocity.y *= -1;
          this.x = Math.max(s / 2, Math.min(s, this.x));
          this.y = Math.max(0, Math.min(s, this.y));
        }
      }

      draw(c: CanvasRenderingContext2D) {
        const alpha = this.order ? 0.8 - this.influence * 0.5 : 0.8;
        c.fillStyle = withAlpha(particleColor, alpha);
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = spacing * i + spacing / 2;
        const y = spacing * j + spacing / 2;
        particles.push(new Particle(x, y, x < s / 2));
      }
    }

    const updateNeighbors = () => {
      particles.forEach((p) => {
        p.neighbors = particles.filter(
          (o) => o !== p && Math.hypot(p.x - o.x, p.y - o.y) < neighborRadius,
        );
      });
    };

    const renderFrame = () => {
      ctx.clearRect(0, 0, s, s);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
        p.neighbors.forEach((n) => {
          const distance = Math.hypot(p.x - n.x, p.y - n.y);
          if (distance >= lineRadius) return;
          ctx.strokeStyle = withAlpha(
            particleColor,
            0.5 * (1 - distance / lineRadius),
          );
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        });
      });
      // Brand accent: the order/chaos seam.
      ctx.strokeStyle = withAlpha(accentColor, 0.18);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(s / 2, 0);
      ctx.lineTo(s / 2, s);
      ctx.stroke();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      updateNeighbors();
      for (let k = 0; k < 90; k++) particles.forEach((p) => p.update());
      renderFrame();
      return;
    }

    let time = 0;
    let animationId = 0;
    const animate = () => {
      if (time % 30 === 0) updateNeighbors();
      renderFrame();
      time++;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [dim, particleColor, accentColor]);

  return (
    <div
      ref={wrapperRef}
      className={cn(fill ? "absolute inset-0 overflow-hidden" : "relative", className)}
      style={fill ? undefined : { width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
