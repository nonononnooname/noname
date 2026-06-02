import { FakeButton, MockWindow, TokenChip } from "./mock-ui";

const STATS = [
  ["Staking APR", "4.61%"],
  ["Max slashing", "50.00%"],
  ["Wallet balance", "0"],
] as const;

/** Staking — stake panel + staked-position panel (Figma: QANT). */
export function StakeMock() {
  return (
    <MockWindow active="Staking">
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <TokenChip symbol="QANT" />
            <div className="text-right">
              <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
                Total staked
              </div>
              <div className="font-ui text-xs">
                <span className="text-foreground">2.85M</span>{" "}
                <span className="text-muted-foreground">($349.08M)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {STATS.map(([label, value]) => (
              <div key={label}>
                <div className="font-display text-base">{value}</div>
                <div className="mt-0.5 font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <FakeButton>Stake</FakeButton>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 font-ui text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            QANT
          </div>
          <div className="mt-1 font-display text-2xl font-light">5,000.00</div>
          <div className="font-ui text-xs text-muted-foreground">$3,812.50</div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-ui text-[11px] text-muted-foreground">
            <span>Cooldown period</span>
            <span className="text-foreground">20d</span>
          </div>
          <div className="mt-3">
            <FakeButton variant="light">Cooldown to unstake</FakeButton>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
