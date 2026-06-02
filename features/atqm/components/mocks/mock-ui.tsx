import { Atom, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Shared chrome + primitives for the product-interface mocks. These are
 * decorative replicas of the Figma `Qvanta` product screens — purely visual, so
 * the mock roots are marked aria-hidden and the adjacent copy carries meaning.
 * Everything runs through brand tokens (monochrome + yellow), never raw hex.
 */

const NAV_TABS = ["Bridge", "Dex", "Staking", "Leaderboard"] as const;

/** Compact ATOM dApp window: top bar (logo + nav + address) wrapping a screen. */
export function MockWindow({
  active,
  children,
}: {
  active: (typeof NAV_TABS)[number];
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className="w-full max-w-md select-none overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Atom className="size-4 text-primary" strokeWidth={1.5} />
          <span className="font-display text-sm tracking-wide">ATOM</span>
        </div>
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_TABS.map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-pill px-2.5 py-1 font-ui text-[11px]",
                t === active
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t}
            </span>
          ))}
        </nav>
        <span className="rounded-pill border border-border px-2.5 py-1 font-ui text-[11px] text-muted-foreground">
          0x18a7…8499
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/** Token / chain selector chip: mono dot + symbol + chevron. */
export function TokenChip({ symbol }: { symbol: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-border bg-background px-2.5 py-1.5">
      <span className="size-4 rounded-full bg-gradient-to-br from-white/40 to-white/5" />
      <span className="font-ui text-sm font-medium">{symbol}</span>
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </span>
  );
}

/** Pill button label used inside fields (e.g. "Max"). */
export function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-white/10 px-1.5 py-0.5 font-ui text-foreground">
      {children}
    </span>
  );
}

const SPARKS = [
  "2,18 10,12 18,15 26,7 34,11 42,4 50,9 58,3",
  "2,5 10,10 18,7 26,13 34,9 42,15 50,11 58,16",
  "2,14 10,9 18,12 26,6 34,13 42,8 50,11 58,5",
  "2,8 10,13 18,9 26,15 34,11 42,16 50,12 58,17",
];

/** Small inline sparkline; `up` selects the yellow (accent) vs muted stroke. */
export function Sparkline({ up, variant = 0 }: { up: boolean; variant?: number }) {
  return (
    <svg
      viewBox="0 0 60 20"
      className="h-6 w-16 shrink-0"
      fill="none"
      preserveAspectRatio="none"
    >
      <polyline
        points={SPARKS[variant % SPARKS.length]}
        className={up ? "stroke-primary" : "stroke-muted-foreground"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Circular monochrome asset badge with a ticker letter. */
export function CoinBadge({ label }: { label: string }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/5 font-ui text-xs font-semibold">
      {label}
    </span>
  );
}

/** Full-width fake action button (non-interactive; mocks are decorative). */
export function FakeButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "light";
}) {
  return (
    <div
      className={cn(
        "w-full rounded-xl py-2.5 text-center font-ui text-sm font-semibold",
        variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-foreground text-background",
      )}
    >
      {children}
    </div>
  );
}
