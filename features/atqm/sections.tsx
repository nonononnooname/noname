import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Entropy } from "@/components/ui/entropy";

import {
  PROBLEM,
  ATQM_VS_ARETH,
  ECOSYSTEM,
  PRODUCTS,
  ROADMAP,
  PITCH,
} from "./data";
import { Reveal } from "./components/reveal";
import { TopoHero } from "./components/topo-hero";
import { EcosystemOrbit } from "./components/ecosystem-orbit";
import { PRODUCT_MOCKS } from "./components/mocks";
import { Section, SectionHeader, Stat, Card } from "./components/primitives";

/* 01 — Hero (3D topographic parallax, ATQM-branded) */
export function Hero() {
  return <TopoHero />;
}

/* 02 — The Problem (keeps the order/chaos entropy field as its backdrop) */
export function Problem() {
  return (
    <Section
      id="problem"
      className="bg-background"
      background={<Entropy fill className="opacity-20" />}
    >
      <SectionHeader
        index="02"
        topic="The threshold of Q-Day"
        title={
          <>
            secp256k1 and BLS are no longer
            <br className="hidden sm:block" /> safe assumptions.
          </>
        }
        intro={PROBLEM.intro}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {PROBLEM.vectors.map((v, i) => (
          <Reveal key={v.title} delay={i * 80}>
            <Card className="h-full">
              <h3 className="font-display text-xl font-light">{v.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 grid gap-8 border-t border-border/60 pt-12 sm:grid-cols-3">
        {PROBLEM.context.map((c, i) => (
          <Reveal key={c.label} delay={i * 80}>
            <Stat value={c.value} label={c.label} accent />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 03 — ATQM vs Areth */
export function AtqmVsAreth() {
  return (
    <Section id="atqm-vs-areth">
      <SectionHeader
        index="03"
        topic="Two names, one stack"
        title="ATQM is the brand. Areth is the chain."
      />
      <div className="overflow-hidden rounded-card border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-card">
              <th className="px-5 py-4 font-ui text-xs uppercase tracking-wider text-muted-foreground" />
              <th className="px-5 py-4 font-ui text-xs uppercase tracking-wider text-primary">
                ATQM (Atom Quantum)
              </th>
              <th className="px-5 py-4 font-ui text-xs uppercase tracking-wider text-foreground">
                Areth
              </th>
            </tr>
          </thead>
          <tbody>
            {ATQM_VS_ARETH.rows.map((r, i) => (
              <tr key={r.key} className={cn(i % 2 === 1 && "bg-card/40")}>
                <td className="border-t border-border px-5 py-4 align-top font-ui text-foreground">
                  {r.key}
                </td>
                <td className="border-t border-border px-5 py-4 align-top text-muted-foreground">
                  {r.atqm}
                </td>
                <td className="border-t border-border px-5 py-4 align-top text-muted-foreground">
                  {r.areth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ATQM_VS_ARETH.acronym.map((a, i) => (
          <Reveal key={a.letter} delay={i * 70}>
            <Card className="h-full p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-light text-primary">
                  {a.letter}
                </span>
                <span className="font-display text-lg">{a.word}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {a.note}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 04 — Ecosystem (the orbital "circle": Areth core + product surfaces) */
export function Ecosystem() {
  return (
    <Section id="ecosystem">
      <SectionHeader
        index="04"
        topic="One core, many surfaces"
        title={
          <>
            The <span className="text-primary">ATOM</span> ecosystem.
          </>
        }
        intro={ECOSYSTEM.intro}
      />
      <Reveal>
        <EcosystemOrbit />
      </Reveal>
    </Section>
  );
}

/* 05 — Products (faithful interface mocks from Figma + descriptions) */
export function Products() {
  return (
    <Section id="products">
      <SectionHeader
        index="05"
        topic="Built on the post-quantum core"
        title="The product surfaces."
        intro={PRODUCTS.intro}
      />
      <div className="space-y-16 sm:space-y-28">
        {PRODUCTS.items.map((p, i) => {
          const Mock = PRODUCT_MOCKS[p.key];
          const flip = i % 2 === 1;
          return (
            <Reveal key={p.key}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={cn("flex justify-center", flip && "lg:order-2")}>
                  <Mock />
                </div>
                <div className={cn(flip && "lg:order-1")}>
                  <p className="font-ui text-xs uppercase tracking-[0.25em] text-primary">
                    {p.tagline}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-light tracking-tight sm:text-4xl">
                    {p.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-foreground/90"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* 06 — Roadmap & wallets */
export function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHeader
        index="06"
        topic="Roadmap & wallets"
        title="From PQ L1 to consumer-grade wallets."
      />
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <ol className="relative space-y-6 border-l border-border pl-6">
            {ROADMAP.steps.map((s) => (
              <li key={s.phase} className="relative">
                <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-medium text-foreground">{s.phase}</span>
                  <span className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
                    {s.when}
                  </span>
                </div>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {s.status}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-4">
            <p className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Post-quantum wallets that feel like consumer apps
            </p>
            {ROADMAP.wallets.map((w) => (
              <Card key={w.platform} className="p-6">
                <h3 className="font-display text-lg">{w.platform}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {w.body}
                </p>
              </Card>
            ))}
            <p className="text-xs text-muted-foreground">
              Crypto core: ML-DSA-65 default, FN-DSA-512 for compact signatures,
              threshold-of-N first-class, 20-byte addresses everywhere.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 07 — The pitch */
export function Pitch() {
  return (
    <Section id="pitch" className="border-t-0">
      <div
        className="rounded-card border border-border p-8 sm:p-16"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Reveal>
          <blockquote className="font-display text-2xl font-light leading-snug tracking-tight sm:text-4xl">
            {PITCH.quote}
          </blockquote>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 font-ui text-sm uppercase tracking-wider text-muted-foreground">
            {PITCH.tagline}
          </p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-10 font-ui text-xs uppercase tracking-[0.3em] text-primary">
            {PITCH.domain}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
