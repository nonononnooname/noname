import {
  Signal,
  Wifi,
  BatteryFull,
  Wallet as WalletIcon,
  ArrowLeftRight,
  LineChart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CoinBadge, Sparkline } from "./mock-ui";

const ASSETS = [
  { name: "Bitcoin", sym: "BTC", chg: "+0.67%", up: true, amt: "12.014" },
  { name: "Ethereum", sym: "ETH", chg: "-0.39%", up: false, amt: "40.681" },
  { name: "Neo", sym: "NEO", chg: "+1.14%", up: true, amt: "68.501" },
  { name: "Dogecoin", sym: "DOGE", chg: "-0.39%", up: false, amt: "114.29" },
] as const;

const TABS = [
  { label: "Crypto", active: true },
  { label: "NFTs", active: false },
  { label: "Qubits", active: false },
] as const;

/** Wallet — mobile portfolio screen (Figma: APP / APP W). */
export function WalletMock() {
  return (
    <div
      aria-hidden
      className="mx-auto w-[280px] select-none overflow-hidden rounded-[2.25rem] border border-border bg-background p-3 shadow-2xl shadow-black/50"
    >
      <div className="overflow-hidden rounded-[1.75rem] bg-card">
        {/* status bar */}
        <div className="flex items-center justify-between px-5 pt-3 font-ui text-[11px] font-medium">
          <span>9:41</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <BatteryFull className="size-3.5" />
          </span>
        </div>

        {/* header + balance */}
        <div className="flex items-center justify-between px-5 pt-3 font-ui text-[10px] text-muted-foreground">
          <span>Protected</span>
          <span>023c0…b349</span>
        </div>
        <div className="px-5 pt-3 text-center">
          <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
            Current balance
          </div>
          <div className="font-display text-3xl font-light">$17,220.10</div>
          <div className="font-ui text-[11px] text-primary">↑ 0.23% (1d)</div>
        </div>

        {/* assets */}
        <div className="mt-3 rounded-t-2xl bg-background px-4 pb-4 pt-4">
          <div className="font-display text-base">My assets</div>
          <div className="mt-2 flex gap-1.5 font-ui text-[10px]">
            {TABS.map((t) => (
              <span
                key={t.label}
                className={cn(
                  "rounded-pill px-2 py-1",
                  t.active
                    ? "bg-primary font-medium text-primary-foreground"
                    : "border border-border text-muted-foreground",
                )}
              >
                {t.label}
              </span>
            ))}
          </div>
          <ul className="mt-2 space-y-1">
            {ASSETS.map((a, i) => (
              <li key={a.sym} className="flex items-center gap-2 py-1.5">
                <CoinBadge label={a.sym.slice(0, 1)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{a.name}</div>
                  <div
                    className={cn(
                      "font-ui text-[10px]",
                      a.up ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {a.chg}
                  </div>
                </div>
                <Sparkline up={a.up} variant={i} />
                <div className="text-right">
                  <div className="text-xs">{a.amt}</div>
                  <div className="font-ui text-[10px] text-muted-foreground">
                    {a.sym}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* bottom nav */}
        <div className="flex items-center justify-around border-t border-border bg-card py-2 font-ui text-[9px]">
          <span className="flex flex-col items-center gap-0.5 text-foreground">
            <WalletIcon className="size-4" />
            My wallet
          </span>
          <span className="flex flex-col items-center gap-0.5 text-muted-foreground">
            <ArrowLeftRight className="size-4" />
            Transfer
          </span>
          <span className="flex flex-col items-center gap-0.5 text-muted-foreground">
            <LineChart className="size-4" />
            Market
          </span>
        </div>
      </div>
    </div>
  );
}
