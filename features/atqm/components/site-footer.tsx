import { Atom } from "lucide-react";

import { HERO } from "../data";

const EXPLORE: { label: string; href: string }[] = [
  { label: "The threat", href: "#problem" },
  { label: "How it compares", href: "#comparison" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Products", href: "#products" },
  { label: "Hardware Wallet", href: "#hardware" },
  { label: "Roadmap", href: "#roadmap" },
];

/** Page-closing footer for /atqm — brand, section nav, network status. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2">
              <Atom className="size-5 text-primary" strokeWidth={1.5} />
              <span className="font-display text-xl font-light tracking-tight">
                Atom Quantum
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {HERO.lede} {HERO.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {HERO.primitives.map((p) => (
                <span
                  key={p}
                  className="rounded-pill border border-border px-3 py-1 font-ui text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* section nav */}
          <nav aria-label="Sections">
            <h3 className="font-ui text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-sm text-sm text-foreground/80 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* network */}
          <div>
            <h3 className="font-ui text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Network
            </h3>
            <ul className="mt-4 space-y-2.5 font-mono text-sm text-muted-foreground">
              <li>Finality &lt; 1.0 s</li>
              <li>Testnet — June 2026</li>
              <li>
                <a
                  href="https://areth.network"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
                >
                  {HERO.domain} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-ui text-xs uppercase tracking-wider text-muted-foreground">
            © 2026 Atom Quantum (ATQM)
          </span>
          <span className="text-xs text-muted-foreground/70">
            Figures are illustrative · pending external audit
          </span>
        </div>
      </div>
    </footer>
  );
}
