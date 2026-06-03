import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Entropy } from "@/components/ui/entropy";

import {
  PROBLEM,
  ATQM_ACRONYM,
  ARCHITECTURE,
  PRIMITIVES,
  TRANSACTIONS,
  PERFORMANCE,
  ECOSYSTEM,
  PRODUCTS,
  ROADMAP,
  PITCH,
} from "./data";
import { Reveal } from "./components/reveal";
import { PolyhedronHero } from "./components/polyhedron-hero";
import { EcosystemOrbit } from "./components/ecosystem-orbit";
import { PRODUCT_MOCKS } from "./components/mocks";
import {
  Section,
  SectionHeader,
  CodeBlock,
  Stat,
  Card,
  DefinitionTable,
  Caveat,
} from "./components/primitives";

/* 01 — Hero (rotating glowing wireframe icosahedron, ATQM-branded) */
export function Hero() {
  return <PolyhedronHero />;
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

/* 03 — What ATQM stands for */
export function AtqmBrand() {
  return (
    <Section id="brand">
      <SectionHeader
        index="03"
        topic="The name"
        title="What ATQM stands for."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ATQM_ACRONYM.map((a, i) => (
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

/* 04 — Architecture */
export function Architecture() {
  return (
    <Section id="architecture">
      <SectionHeader
        index="04"
        topic="Three roles, one transport"
        title="Every node speaks the same encrypted transport."
        intro={ARCHITECTURE.intro}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {ARCHITECTURE.roles.map((r, i) => (
          <Reveal key={r.name} delay={i * 80}>
            <Card className="h-full">
              <h3 className="font-display text-lg">{r.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal delay={160}>
        <div className="mt-8">
          <CodeBlock className="text-center text-primary">
            {ARCHITECTURE.transport}
          </CodeBlock>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {ARCHITECTURE.transportNotes.map((n) => (
              <li
                key={n}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

/* 05 — PQ primitives */
export function PqPrimitives() {
  return (
    <Section id="primitives">
      <SectionHeader
        index="05"
        topic="Post-quantum primitives"
        title="NIST-standardized where it counts."
        intro={PRIMITIVES.intro}
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <DefinitionTable
            headers={["Layer", "Primitive"]}
            rows={PRIMITIVES.rows.map((r) => ({
              key: r.layer,
              value: (
                <span>
                  <span className="text-foreground">{r.primitive}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {r.status}
                  </span>
                </span>
              ),
            }))}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-4">
            {PRIMITIVES.standards.map((s) => (
              <Card key={s.name} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg">{s.name}</span>
                  <Badge variant={s.final ? "default" : "outline"}>
                    {s.fips}
                    {s.final ? " ✓" : " · draft"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
              </Card>
            ))}
            <p className="text-xs leading-relaxed text-muted-foreground">
              Threshold-of-N accounts are first-class today: multi-device
              authorization with no smart-contract gymnastics.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 06 — Transaction model */
export function Transactions() {
  return (
    <Section id="transactions">
      <SectionHeader
        index="06"
        topic="Transaction model"
        title="Same EVM. Different signature. Cleaner surface."
        intro={TRANSACTIONS.intro}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {TRANSACTIONS.features.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <Card className="h-full">
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal delay={120}>
        <div className="mt-10">
          <p className="mb-4 font-ui text-xs uppercase tracking-wider text-muted-foreground">
            Signature size, the honest trade-off
          </p>
          <div className="grid gap-px overflow-hidden rounded-card border border-border sm:grid-cols-3">
            {TRANSACTIONS.sizes.map((s) => (
              <div key={s.algo} className="bg-card px-5 py-5">
                <div className="font-display text-2xl font-light text-foreground">
                  {s.sig}
                </div>
                <div className="mt-1 font-ui text-xs uppercase tracking-wider text-muted-foreground">
                  {s.algo}
                </div>
              </div>
            ))}
          </div>
          <Caveat>{TRANSACTIONS.sizeNote}</Caveat>
        </div>
      </Reveal>
    </Section>
  );
}

/* 07 — Performance */
export function Performance() {
  return (
    <Section id="performance">
      <SectionHeader
        index="07"
        topic="Performance"
        title="How fast is finalized?"
      />
      <Reveal>
        <div className="rounded-card border border-border bg-card p-8 sm:p-12">
          <div className="font-display text-6xl font-extralight tracking-tight text-primary sm:text-8xl">
            {PERFORMANCE.headline}
          </div>
          <p className="mt-2 font-ui text-sm uppercase tracking-wider text-muted-foreground">
            {PERFORMANCE.headlineLabel}
          </p>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
            {PERFORMANCE.stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </Reveal>
      <Caveat>{PERFORMANCE.caveat}</Caveat>
    </Section>
  );
}

/* 08 — Ecosystem (the orbital "circle": ATQM core + product surfaces) */
export function Ecosystem() {
  return (
    <Section id="ecosystem">
      <SectionHeader
        index="08"
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

/* 09 — Products (faithful interface mocks from Figma + descriptions) */
export function Products() {
  return (
    <Section id="products">
      <SectionHeader
        index="09"
        topic="Built on the post-quantum core"
        title="The product surfaces."
        intro={PRODUCTS.intro}
      />
      <div className="space-y-16 sm:space-y-28">
        {PRODUCTS.items
          .filter((p) => p.key !== "hardware")
          .map((p, i) => {
            const Mock = PRODUCT_MOCKS[p.key];
            const flip = i % 2 === 1;
            return (
              <Reveal key={p.key}>
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div
                    className={cn("flex justify-center", flip && "lg:order-2")}
                  >
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

/* 10 — Roadmap & wallets */
export function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHeader
        index="10"
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

/* 11 — The pitch */
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
