import { Atom, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Shared chrome + primitives for the product-interface mocks, matched to the
 * Figma `Qvanta` product screens. The DEX / Staking / Bridge mocks are now
 * interactive front-end demos (type an amount, submit, see a Success status) —
 * no backend. The wallet/hardware mocks stay decorative. Everything runs through
 * brand tokens (monochrome + yellow), never raw hex.
 */

const NAV_TABS = [
  "Bridge",
  "Governance",
  "Dex",
  "Staking",
  "Leaderboard",
] as const;

/** Compact ATOM dApp window: top bar (logo + nav + address) wrapping a screen. */
export function MockWindow({
  active,
  interactive = false,
  children,
}: {
  active: (typeof NAV_TABS)[number];
  /** Interactive mocks are real controls — not aria-hidden, text stays selectable. */
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={interactive ? undefined : true}
      className={cn(
        "w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40",
        !interactive && "select-none",
      )}
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

/**
 * Large editable amount field, styled as the screen's display number. Controlled
 * by the parent mock; keeps only digits, a dot, and a comma. The focus ring is
 * dropped here because the wrapping field shows focus via `focus-within`.
 */
export function AmountInput({
  value,
  onChange,
  label,
  placeholder = "0.00",
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  placeholder?: string;
}) {
  return (
    <Input
      type="text"
      inputMode="decimal"
      aria-label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ""))}
      className="h-auto min-h-11 border-0 bg-transparent p-0 font-display text-2xl font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}

/** Full-width interactive action button for the mock flows. */
export function MockButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl"
    >
      {children}
    </Button>
  );
}

/**
 * Always-mounted screen-reader live region. Kept persistent (not toggled with
 * the success card) so assistive tech reliably announces the status when the
 * message changes.
 */
export function MockLiveStatus({ message }: { message: string }) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {message}
    </p>
  );
}

/** In-place "Success" confirmation shown after a mock action, with a reset. */
export function MockSuccess({
  title,
  detail,
  onReset,
}: {
  title: string;
  detail: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/40 bg-background px-4 py-5 text-center">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="size-5" />
      </span>
      <span className="font-display text-base">{title}</span>
      <span className="font-ui text-xs text-muted-foreground">{detail}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="mt-1"
      >
        Done
      </Button>
    </div>
  );
}

/** Full-width decorative button (non-interactive) for screens kept as visuals. */
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
