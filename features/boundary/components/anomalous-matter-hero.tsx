"use client";

import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/features/atqm/components/reveal";

import { HERO } from "../data";

// Lazy + client-only: keeps three.js out of the server bundle and the initial
// paint. The copy below still renders immediately (SSR), the figure hydrates in.
const AnomalousMatterScene = dynamic(
  () =>
    import("./anomalous-matter-scene").then((m) => m.AnomalousMatterScene),
  { ssr: false, loading: () => <div aria-hidden className="absolute inset-0" /> },
);

export function AnomalousMatterHero() {
  return (
    <section
      className="relative isolate flex min-h-[calc(100vh-4rem)] items-end justify-center overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pb-28 lg:px-8"
    >
      {/* Transparent so the page-wide ambient smoke (fixed, -z-10) shows through
          the hero just like every other section — only the bottom scrim darkens
          the copy. The morphing mesh renders on a transparent canvas above it. */}
      {/* Morphing icosahedron behind the copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <AnomalousMatterScene />
      </div>
      {/* Scrim so the copy stays legible over the figure. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-transparent"
      />

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-ui text-xs uppercase tracking-[0.3em] text-primary">
            {HERO.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-extralight tracking-tight sm:text-7xl lg:text-8xl">
            {HERO.title}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {HERO.lede}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 font-display text-lg font-light text-foreground sm:text-xl">
            {HERO.tagline}
          </p>
        </Reveal>
        <Reveal delay={260}>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {HERO.primitives.map((p) => (
              <li key={p}>
                <Badge variant="outline">{p}</Badge>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
