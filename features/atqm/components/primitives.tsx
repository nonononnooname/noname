import { cn } from "@/lib/utils";

import { Reveal } from "./reveal";

/** Full-width section with consistent vertical rhythm + centered content well. */
export function Section({
  id,
  className,
  background,
  children,
}: {
  id?: string;
  className?: string;
  /** Optional decorative layer rendered behind the content (absolute inset-0). */
  background?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate scroll-mt-20 border-t border-border/60 px-4 py-20 sm:px-6 sm:py-28 lg:px-8",
        className,
      )}
    >
      {background ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {background}
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Kicker (NN / Topic) + display heading + optional intro paragraph. */
export function SectionHeader({
  index,
  topic,
  title,
  intro,
}: {
  index: string;
  topic: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <header className="mb-12 max-w-3xl sm:mb-16">
      <Reveal>
        <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span className="text-primary">{index}</span> / {topic}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-5 font-display text-3xl font-light leading-[1.1] tracking-tight sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={160}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}

/** Monospace code / primitive block on a dark card. */
export function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-card px-5 py-4 font-ui text-sm text-foreground/90",
        className,
      )}
    >
      <code className="whitespace-pre">{children}</code>
    </div>
  );
}

/** Large figure + caption. */
export function Stat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "font-display text-4xl font-light tracking-tight sm:text-5xl",
          accent && "text-primary",
        )}
      >
        {value}
      </div>
      <div className="mt-2 font-ui text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/** Card surface used across grids. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Generic two-column comparison table. */
export function CompareTable({
  headers,
  rows,
}: {
  headers: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="overflow-hidden rounded-card border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-card">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-4 font-ui text-xs uppercase tracking-wider text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={a} className={cn(i % 2 === 1 && "bg-card/40")}>
              <td className="border-t border-border px-5 py-4 align-top text-muted-foreground line-through decoration-muted-foreground/40">
                {a}
              </td>
              <td className="border-t border-border px-5 py-4 align-top font-medium text-foreground">
                {b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Key/value table (label → value) for crate maps, primitives, etc. */
export function DefinitionTable({
  headers,
  rows,
}: {
  headers: [string, string];
  rows: { key: string; value: React.ReactNode }[];
}) {
  return (
    <div className="overflow-hidden rounded-card border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-card">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-4 font-ui text-xs uppercase tracking-wider text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key} className={cn(i % 2 === 1 && "bg-card/40")}>
              <td className="w-1/3 border-t border-border px-5 py-4 align-top font-ui text-foreground">
                {row.key}
              </td>
              <td className="border-t border-border px-5 py-4 align-top text-muted-foreground">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Honest-qualifier note — used wherever the docs insist on a caveat. */
export function Caveat({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 border-l-2 border-primary/60 pl-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
