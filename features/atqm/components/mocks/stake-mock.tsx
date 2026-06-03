"use client";

import { useState } from "react";

import {
  AmountInput,
  FakeButton,
  MiniPill,
  MockButton,
  MockLiveStatus,
  MockSuccess,
  MockWindow,
  TokenChip,
} from "./mock-ui";

const STATS = [
  ["Staking APR", "4.61%"],
  ["Wallet balance", "3500 ATQM"],
] as const;

/** Staking — stake panel + staked-position panel (Figma: ATQM). Interactive. */
export function StakeMock() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isValid = Number(amount.replace(",", ".")) > 0;

  const handleChange = (next: string) => {
    setAmount(next);
    setSubmitted(false);
  };

  return (
    <MockWindow active="Staking" interactive>
      <MockLiveStatus
        message={submitted ? `Stake submitted, ${amount} ATQM` : ""}
      />
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <TokenChip symbol="ATQM" />
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

          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            {STATS.map(([label, value]) => (
              <div key={label}>
                <div className="font-display text-base">{value}</div>
                <div className="mt-0.5 font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-3 transition-colors focus-within:border-primary">
            <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
              Amount to stake
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <AmountInput
                label="Amount to stake"
                value={amount}
                onChange={handleChange}
              />
              <MiniPill>Max</MiniPill>
            </div>
          </div>

          <div className="mt-4">
            {submitted ? (
              <MockSuccess
                title="Stake submitted"
                detail={`${amount} ATQM`}
                onReset={() => {
                  setSubmitted(false);
                  setAmount("");
                }}
              />
            ) : (
              <MockButton onClick={() => setSubmitted(true)} disabled={!isValid}>
                Stake
              </MockButton>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 font-ui text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            ATQM
          </div>
          <div className="mt-1 font-display text-2xl font-light">5,000.00</div>
          <div className="font-ui text-xs text-muted-foreground">$10,812.50</div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-ui text-[11px] text-muted-foreground">
            <span>Cooldown period</span>
            <span className="text-foreground">1 d</span>
          </div>
          <div className="mt-3">
            <FakeButton variant="light">Cooldown to unstake</FakeButton>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
