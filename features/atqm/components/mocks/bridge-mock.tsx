"use client";

import { useState } from "react";
import { ArrowRight, Fuel } from "lucide-react";

import {
  AmountInput,
  MiniPill,
  MockButton,
  MockLiveStatus,
  MockSuccess,
  MockWindow,
  TokenChip,
} from "./mock-ui";

/** Bridge — from/to chain, amount, address, review (Figma: Ethereum → Areth, rendered as Atom Quantum). Interactive. */
export function BridgeMock() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isValid = Number(amount.replace(",", ".")) > 0;

  const handleChange = (next: string) => {
    setAmount(next);
    setSubmitted(false);
  };

  return (
    <MockWindow active="Bridge" interactive>
      <MockLiveStatus
        message={
          submitted ? `Bridge submitted, ${amount} ATQM to Atom Quantum` : ""
        }
      />
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
                <TokenChip symbol="Atom Quantum" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 transition-colors focus-within:border-primary">
          <div className="font-ui text-[10px] uppercase tracking-wide text-muted-foreground">
            You send
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <AmountInput
              label="Amount to bridge"
              value={amount}
              onChange={handleChange}
            />
            <TokenChip symbol="ATQM" />
          </div>
          <div className="mt-2 flex items-center justify-between font-ui text-[11px] text-muted-foreground">
            <span>$42,238.09</span>
            <span className="flex items-center gap-2">
              Balance: 15,000.00 ATQM <MiniPill>Max</MiniPill>
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-ui text-[11px] text-muted-foreground">
            <span>To address</span>
            <span className="font-mono text-foreground">0x103D…fFC0</span>
          </div>
        </div>

        {submitted ? (
          <MockSuccess
            title="Bridge submitted"
            detail={`${amount} ATQM → Atom Quantum`}
            onReset={() => {
              setSubmitted(false);
              setAmount("");
            }}
          />
        ) : (
          <MockButton onClick={() => setSubmitted(true)} disabled={!isValid}>
            Review transaction
          </MockButton>
        )}

        <div className="flex items-center justify-between pt-1 font-ui text-[11px] text-muted-foreground">
          <span>Crosschain</span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="size-3" />
            {"<$0.01"}
          </span>
        </div>
      </div>
    </MockWindow>
  );
}
