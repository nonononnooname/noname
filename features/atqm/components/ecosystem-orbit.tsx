import {
  Atom,
  Repeat,
  Coins,
  Waypoints,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ECOSYSTEM, PRODUCTS, type Product } from "../data";

/** Product key → icon. Kept here so data.ts stays presentation-free. */
export const PRODUCT_ICONS: Record<Product["key"], LucideIcon> = {
  dex: Repeat,
  staking: Coins,
  bridge: Waypoints,
  hardware: ShieldCheck,
  wallet: Smartphone,
};

/** Node orbit radius, as a % of the square container (ring diameter = 2 × R). */
const R = 40;

/**
 * Position of node `i` of `n`, on the ring, clockwise from the top. `labelAbove`
 * flips bottom-half labels up so they never clip the container edge.
 */
function nodeAt(i: number, n: number) {
  const t = (i * 2 * Math.PI) / n;
  const x = 50 + R * Math.sin(t);
  const y = 50 - R * Math.cos(t);
  return { x, y, labelAbove: y > 60 };
}

/**
 * Ecosystem diagram: the ATQM post-quantum core at the centre with the product
 * surfaces orbiting it. Square + viewBox-driven so it scales cleanly from 375px
 * up; node count adapts to PRODUCTS.items. Animation is CSS-only and disabled
 * under prefers-reduced-motion.
 */
export function EcosystemOrbit() {
  const items = PRODUCTS.items;
  const nodes = items.map((_, i) => nodeAt(i, items.length));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      {/* connector lines (behind everything) */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute inset-0 -z-10 size-full"
      >
        <defs>
          <filter
            id="orbit-glow"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* spokes */}
        {nodes.map((node) => (
          <line
            key={`${node.x}-${node.y}`}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            className="stroke-border"
            strokeWidth="0.4"
          />
        ))}

        {/* energy pulses — the core powering each surface (staggered) */}
        {nodes.map((node, i) => (
          <circle
            key={`pulse-${node.x}-${node.y}`}
            r="0.9"
            opacity="0"
            filter="url(#orbit-glow)"
            className="orbit-motion fill-primary"
          >
            <animateMotion
              dur="3.2s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
              path={`M50,50 L${node.x},${node.y}`}
            />
            <animate
              attributeName="opacity"
              dur="3.2s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
              values="0;1;1;0"
              keyTimes="0;0.4;0.85;1"
            />
          </circle>
        ))}

        {/* a quantum electron on an inner shell */}
        <circle
          r="1.1"
          filter="url(#orbit-glow)"
          className="orbit-motion fill-primary"
        >
          <animateMotion
            dur="16s"
            repeatCount="indefinite"
            path="M50,27 a23,23 0 1,0 0,46 a23,23 0 1,0 0,-46"
          />
        </circle>
      </svg>

      {/* concentric rings */}
      <Ring className="w-[80%] border-border/50" />
      <Ring className="w-[46%] border-border/40" />
      <Ring className="w-[80%] animate-[spin_48s_linear_infinite] border-dashed border-border/40 motion-reduce:animate-none" />

      {/* core */}
      <div className="absolute left-1/2 top-1/2 flex aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/40 bg-card text-center glow-yellow">
        <Atom className="size-6 text-primary sm:size-8" strokeWidth={1.25} />
        <span className="mt-1.5 font-display text-base font-light leading-none sm:text-xl">
          {ECOSYSTEM.core.label}
        </span>
        <span className="mt-1 px-2 font-ui text-[9px] uppercase leading-tight tracking-wider text-muted-foreground sm:text-[10px]">
          {ECOSYSTEM.core.sub}
        </span>
      </div>

      {/* product nodes */}
      {items.map((product, i) => {
        const node = nodes[i];
        const Icon = PRODUCT_ICONS[product.key];
        return (
          <div
            key={product.key}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="group relative flex flex-col items-center">
              <div className="flex size-14 items-center justify-center rounded-full border border-border bg-background transition-colors duration-300 group-hover:border-primary sm:size-[4.5rem]">
                <Icon
                  className="size-5 text-foreground transition-colors duration-300 group-hover:text-primary sm:size-7"
                  strokeWidth={1.25}
                />
              </div>
              <span
                className={cn(
                  "absolute whitespace-nowrap font-ui text-[11px] font-medium tracking-wide text-muted-foreground transition-colors duration-300 group-hover:text-foreground sm:text-sm",
                  node.labelAbove ? "bottom-full mb-2" : "top-full mt-2",
                )}
              >
                {product.short ?? product.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** A centred, square ring overlay sized as a % of the diagram. */
function Ring({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border",
        className,
      )}
    />
  );
}
