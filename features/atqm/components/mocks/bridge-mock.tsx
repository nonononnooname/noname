import { ArrowRight } from "lucide-react";

import { FakeButton, MiniPill, MockWindow, TokenChip } from "./mock-ui";

/** Bridge — from/to chain, amount, address, review (Figma: Ethereum → BASE). */
export function BridgeMock() {
  return (
    <MockWindow active="Bridge">
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
                From
              </div>
              <div className="mt-1.5">
                <TokenChip symbol="Ethereum" />
              </div>
            </div>
            <ArrowRight className="mb-2 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1 text-right">
              <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
                To
              </div>
              <div className="mt-1.5">
                <TokenChip symbol="BASE" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
            You send
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-display text-2xl font-light">5,000.00</span>
            <TokenChip symbol="QANT" />
          </div>
          <div className="mt-2 flex items-center justify-between font-ui text-[11px] text-muted-foreground">
            <span>$42,238.09</span>
            <span className="flex items-center gap-2">
              Balance: 15,000.00 <MiniPill>Max</MiniPill>
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-ui text-[11px] text-muted-foreground">
            <span>To address</span>
            <span className="font-mono text-foreground">0x103D…7FC0</span>
          </div>
        </div>

        <FakeButton>Review transaction</FakeButton>
      </div>
    </MockWindow>
  );
}
