import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Entropy } from "@/components/ui/entropy";
import { CrateCarousel } from "./components/crate-carousel";

import {
  PROBLEM,
  ATQM_VS_ARETH,
  SUBSTRATE,
  ARCHITECTURE,
  CONSENSUS,
  PRIMITIVES,
  TRANSACTIONS,
  PERFORMANCE,
  EXPANSION,
  ROADMAP,
  PITCH,
} from "./data";
import { Reveal } from "./components/reveal";
import { TopoHero } from "./components/topo-hero";
import {
  Section,
  SectionHeader,
  CodeBlock,
  Stat,
  Card,
  CompareTable,
  DefinitionTable,
  Caveat,
} from "./components/primitives";

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

/* 04 — Substrate */
export function Substrate() {
  return (
    <Section id="substrate">
      <SectionHeader
        index="04"
        topic="Kept vs replaced"
        title="A fork-descendant of Reth — not Reth with patches."
        intro={SUBSTRATE.intro}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="mb-4 font-ui text-xs uppercase tracking-wider text-muted-foreground">
              Kept from Reth
            </p>
            <ul className="space-y-px overflow-hidden rounded-card border border-border">
              {SUBSTRATE.kept.map((k) => (
                <li
                  key={k}
                  className="border-b border-border bg-card px-5 py-3.5 text-sm text-foreground last:border-b-0"
                >
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div>
            <p className="mb-4 font-ui text-xs uppercase tracking-wider text-primary">
              Replaced with PQ-secure equivalents
            </p>
            <CompareTable
              headers={["Ethereum", "Areth"]}
              rows={SUBSTRATE.replaced}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 05 — Architecture */
export function Architecture() {
  return (
    <Section id="architecture">
      <SectionHeader
        index="05"
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

/* 06 — Crate map (interactive carousel over the nine areth-* crates) */
export function CrateMap() {
  return (
    <Section id="crates">
      <SectionHeader
        index="06"
        topic="Engineering scope"
        title={
          <>
            The <span className="text-primary">areth-*</span> crate map.
          </>
        }
        intro="Nine focused crates, each replacing one Ethereum protocol surface — with Reth's runtime and storage doing the heavy lifting underneath."
      />
      <Reveal>
        <CrateCarousel />
      </Reveal>
    </Section>
  );
}

/* 07 — Consensus */
export function Consensus() {
  return (
    <Section id="consensus">
      <SectionHeader
        index="07"
        topic="HotStuff finality, signed in ML-DSA"
        title="Block-bound and deterministic. Never probabilistic."
        intro={CONSENSUS.intro}
      />
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {CONSENSUS.pipeline.map((step, i) => (
            <span key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-pill border border-border bg-card px-4 py-2 font-ui text-xs uppercase tracking-wider">
                {step}
              </span>
              {i < CONSENSUS.pipeline.length - 1 && (
                <span aria-hidden className="text-primary">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </Reveal>
      <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-border sm:grid-cols-2">
        {CONSENSUS.stats.map((s) => (
          <div
            key={s.key}
            className="flex items-baseline justify-between bg-card px-5 py-4"
          >
            <span className="text-sm text-muted-foreground">{s.key}</span>
            <span className="font-display text-lg text-foreground">
              {s.value}
            </span>
          </div>
        ))}
      </div>
      <Caveat>{CONSENSUS.caveat}</Caveat>
    </Section>
  );
}

/* 08 — PQ primitives */
export function PqPrimitives() {
  return (
    <Section id="primitives">
      <SectionHeader
        index="08"
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
              Threshold-of-N accounts are first-class today — multi-device
              authorization with no smart-contract gymnastics.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 09 — Transaction model */
export function Transactions() {
  return (
    <Section id="transactions">
      <SectionHeader
        index="09"
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
            Signature size — the honest trade-off
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

/* 10 — Performance */
export function Performance() {
  return (
    <Section id="performance">
      <SectionHeader
        index="10"
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

/* 11 — Modular expansion */
export function Expansion() {
  return (
    <Section id="expansion">
      <SectionHeader
        index="11"
        topic="Modular expansion — M1–M4"
        title="Four modules for four different jobs."
        intro={EXPANSION.intro}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {EXPANSION.modules.map((m, i) => (
          <Reveal key={m.id} delay={i * 70}>
            <Card className="h-full">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-light text-primary">
                  {m.id}
                </span>
                <h3 className="font-display text-lg">{m.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m.body}
              </p>
              <p className="mt-4 font-ui text-xs uppercase tracking-wider text-foreground/70">
                {m.maturity}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-border">
        {EXPANSION.tiers.map((t) => (
          <div
            key={t.tier}
            className="flex flex-col gap-1 bg-card px-5 py-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <span className="font-display text-xl font-light text-primary sm:w-8">
              {t.tier}
            </span>
            <span className="text-sm font-medium text-foreground sm:w-80">
              {t.label}
            </span>
            <span className="text-sm text-muted-foreground">{t.example}</span>
          </div>
        ))}
      </div>
      <Caveat>{EXPANSION.driver}</Caveat>
    </Section>
  );
}

/* 12 — Roadmap & wallets */
export function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHeader
        index="12"
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

/* 13 — The pitch */
export function Pitch() {
  return (
    <Section
      id="pitch"
      className="border-t-0"
    >
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
