import Image from "next/image";

import { HARDWARE } from "../data";
import { Reveal } from "./reveal";

/** A tick-marked copy block (yellow vertical mark + uppercase muted text). */
function TickCopy({
  text,
  align = "left",
}: {
  text: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex gap-3 ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""}`}
    >
      <span aria-hidden className="mt-0.5 h-9 w-0.5 shrink-0 bg-primary" />
      <p className="max-w-xs font-ui text-[11px] uppercase leading-relaxed tracking-wider text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

/**
 * Hardware Wallet — full-bleed hero recreating the Figma "POST" frame: ghosted
 * "TECHNOLOGY" backdrop + faint ring, the device render flanked by two copy
 * blocks, and the big ATOM wordmark with tagline overlapping the device base.
 * Responsive: the three columns stack (device first) below `lg`.
 */
export function HardwareShowcase() {
  return (
    <section
      id="hardware"
      className="relative isolate overflow-hidden border-t border-border/60 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* ghosted backdrop word */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-4 -z-10 select-none text-center font-display font-light leading-none tracking-tighter text-foreground/[0.04]"
        style={{ fontSize: "clamp(3rem, 17vw, 14rem)" }}
      >
        {HARDWARE.ghost}
      </span>

      {/* faint orbital ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[78vmin] max-w-[740px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/40"
      />

      <Reveal className="mx-auto max-w-6xl">
        <p className="text-center font-ui text-xs uppercase tracking-[0.3em] text-primary">
          {HARDWARE.eyebrow}
        </p>

        <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[1fr_minmax(0,1.7fr)_1fr] lg:gap-4">
          <div className="order-2 lg:order-none">
            <TickCopy text={HARDWARE.left} align="left" />
          </div>
          <div className="order-1 lg:order-none">
            <Image
              src="/products/atqm-wallet.png"
              alt="ATQM Wallet hardware device"
              width={793}
              height={399}
              sizes="(max-width: 1024px) 92vw, 620px"
              className="mx-auto h-auto w-full max-w-[620px]"
            />
          </div>
          <div className="order-3 lg:order-none">
            <TickCopy text={HARDWARE.right} align="right" />
          </div>
        </div>

        <div className="relative z-10 -mt-4 flex flex-col items-center sm:-mt-10 lg:-mt-14">
          {/* The exported wordmark already bakes in the tagline below ATOM. */}
          <Image
            src="/products/atom-wordmark.png"
            alt={`ATOM — ${HARDWARE.tagline}`}
            width={760}
            height={180}
            sizes="(max-width: 640px) 78vw, 560px"
            className="h-auto w-full max-w-[260px] sm:max-w-[440px] lg:max-w-[560px]"
          />
        </div>
      </Reveal>
    </section>
  );
}
