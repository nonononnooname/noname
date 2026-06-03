import { Check } from "lucide-react";

// Atom Boundary Labs reuses the ATQM design system as-is: the styled primitives
// and the scroll-in Reveal are imported directly, never duplicated or restyled.
import { Reveal } from "@/features/atqm/components/reveal";
import {
  Section,
  SectionHeader,
  Stat,
  Card,
  CompareTable,
  DefinitionTable,
  Caveat,
} from "@/features/atqm/components/primitives";

import { AnomalousMatterHero } from "./components/anomalous-matter-hero";
import {
  PROBLEM,
  THESIS,
  ECOSYSTEM,
  STREAMS,
  COMPARISON,
  HOW_IT_WORKS,
  SCIENCE,
  MATURITY,
  ROADMAP,
  PITCH,
} from "./data";

/* 01 — Hero (animated "anomalous matter" morphing icosahedron, brand-adapted) */
export function Hero() {
  return <AnomalousMatterHero />;
}

/* 02 — The problem */
export function Problem() {
  return (
    <Section id="problem">
      <SectionHeader
        index="02"
        topic="Three walls"
        title={
          <>
            Classical computing is hitting
            <br className="hidden sm:block" /> three walls at once.
          </>
        }
        intro={PROBLEM.intro}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {PROBLEM.walls.map((w, i) => (
          <Reveal key={w.title} delay={i * 80}>
            <Card className="h-full">
              <h3 className="font-display text-xl font-light">{w.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {w.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 grid gap-8 border-t border-border/60 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEM.context.map((c, i) => (
          <Reveal key={c.label} delay={i * 80}>
            <Stat value={c.value} label={c.label} accent />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 03 — The thesis (A · T · Q · M) */
export function Thesis() {
  return (
    <Section id="thesis">
      <SectionHeader
        index="03"
        topic="The thesis"
        title={
          <>
            Stop fighting physics.{" "}
            <span className="text-primary">Let it compute.</span>
          </>
        }
        intro={THESIS.intro}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {THESIS.letters.map((a, i) => (
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

/* 04 — Ecosystem (one atomic core, four streams) */
export function Ecosystem() {
  return (
    <Section id="ecosystem">
      <SectionHeader
        index="04"
        topic="One core, many surfaces"
        title={
          <>
            One <span className="text-primary">atomic core</span>, four streams.
          </>
        }
        intro={ECOSYSTEM.intro}
      />
      <Reveal>
        <div className="flex flex-col items-center gap-8">
          <div className="rounded-card border border-border bg-card px-10 py-8 text-center">
            <p className="font-display text-2xl font-light">
              {ECOSYSTEM.core.label}
            </p>
            <p className="mt-2 font-ui text-xs uppercase tracking-wider text-muted-foreground">
              {ECOSYSTEM.core.sub}
            </p>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ECOSYSTEM.streams.map((s, i) => (
              <Reveal key={s} delay={i * 70}>
                <div className="rounded-card border border-border bg-card/40 px-5 py-4 text-center text-sm text-foreground/90">
                  {s}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* 05 — The four streams */
export function Streams() {
  return (
    <Section id="streams">
      <SectionHeader
        index="05"
        topic="Four surfaces, one physical spine"
        title="The four streams."
        intro={STREAMS.intro}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {STREAMS.items.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 80}>
            <Card className="flex h-full flex-col">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-light text-primary">
                  {s.id}
                </span>
                <h3 className="font-display text-xl font-light">{s.name}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {s.summary}
              </p>
              <ul className="mt-6 space-y-3">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 text-sm text-foreground/90"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Caveat>{s.maturity}</Caveat>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 06 — Comparison vs classical / GPU */
export function Comparison() {
  return (
    <Section id="comparison">
      <SectionHeader
        index="06"
        topic="Physics vs brute force"
        title="Let the physics settle into the answer."
        intro={COMPARISON.intro}
      />
      <Reveal>
        <CompareTable headers={COMPARISON.headers} rows={COMPARISON.rows} />
      </Reveal>
    </Section>
  );
}

/* 07 — How it works (one core, four cargoes) */
export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        index="07"
        topic="One core, four cargoes"
        title="How it works."
        intro={HOW_IT_WORKS.intro}
      />
      <Reveal>
        <div className="rounded-card border border-border bg-card p-6 sm:p-8">
          <p className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
            Shared core
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            {HOW_IT_WORKS.sharedCore}
          </p>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-8">
          <DefinitionTable
            headers={["Stream", "What we run on the core"]}
            rows={HOW_IT_WORKS.rows.map((r) => ({
              key: r.stream,
              value: r.detail,
            }))}
          />
        </div>
      </Reveal>
    </Section>
  );
}

/* 08 — The science (mechanisms + real anchors) */
export function Science() {
  return (
    <Section id="science">
      <SectionHeader
        index="08"
        topic="The science"
        title="Stated precisely, with real anchors."
        intro={SCIENCE.intro}
      />
      <Reveal>
        <DefinitionTable
          headers={["Stream", "Mechanism & anchor"]}
          rows={SCIENCE.rows.map((r) => ({
            key: r.stream,
            value: (
              <span>
                <span className="text-foreground">{r.mechanism}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {r.anchor}
                </span>
              </span>
            ),
          }))}
        />
      </Reveal>
    </Section>
  );
}

/* 09 — Maturity map */
export function Maturity() {
  return (
    <Section id="maturity">
      <SectionHeader
        index="09"
        topic="The honest map"
        title="Different streams, different stages."
        intro={MATURITY.intro}
      />
      <Reveal>
        <DefinitionTable
          headers={["Stream", "Status & horizon"]}
          rows={MATURITY.rows.map((r) => ({
            key: r.stream,
            value: (
              <span>
                <span className="text-foreground">{r.status}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {r.horizon}
                </span>
              </span>
            ),
          }))}
        />
      </Reveal>
    </Section>
  );
}

/* 10 — Roadmap */
export function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHeader
        index="10"
        topic="Roadmap"
        title="From cloud pilots to the moonshot."
      />
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
                {s.detail}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>
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
