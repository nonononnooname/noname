import { ArrowDown, Fuel } from "lucide-react";

import { FakeButton, MiniPill, MockWindow, TokenChip } from "./mock-ui";

/** DEX — swap card (Figma: From ETH → To ATOM, rate + gas, Swap). */
export function SwapMock() {
  return (
    <MockWindow active="Dex">
      <div className="space-y-2">
        <div className="rounded-xl border border-border bg-background p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-2xl font-light">5,000.00</span>
            <TokenChip symbol="ETH" />
          </div>
          <div className="mt-2 flex items-center gap-2 font-ui text-[11px] text-muted-foreground">
            <MiniPill>Max</MiniPill>
            <span>Balance: 250 ETH</span>
          </div>
        </div>

        <div className="relative z-10 -my-3 flex justify-center">
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card">
            <ArrowDown className="size-4 text-muted-foreground" />
          </span>
        </div>

        <div className="rounded-xl border border-border bg-background p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-2xl font-light text-muted-foreground">
              78,678.00
            </span>
            <TokenChip symbol="ATOM" />
          </div>
        </div>

        <div className="pt-1">
          <FakeButton>Swap</FakeButton>
        </div>

        <div className="flex items-center justify-between pt-1 font-ui text-[11px] text-muted-foreground">
          <span>1 USDT = 0.0026 QANT</span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="size-3" />
            {"<$0.01"}
          </span>
        </div>
      </div>
    </MockWindow>
  );
}
