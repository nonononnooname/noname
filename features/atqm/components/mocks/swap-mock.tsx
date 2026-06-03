"use client";

import { useState } from "react";
import { ArrowDown, Fuel } from "lucide-react";

import {
  AmountInput,
  MiniPill,
  MockButton,
  MockLiveStatus,
  MockSuccess,
  MockWindow,
  TokenChip,
} from "./mock-ui";

/** DEX — swap card (Figma: From TEKI → To ATQM, rate + gas, Swap). Interactive. */
export function SwapMock() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isValid = Number(amount.replace(",", ".")) > 0;

  const handleChange = (next: string) => {
    setAmount(next);
    setSubmitted(false);
  };

  return (
    <MockWindow active="Dex" interactive>
      <MockLiveStatus
        message={submitted ? `Swap submitted, ${amount} TEKI to ATQM` : ""}
      />
      <div className="space-y-2">
        <div className="rounded-xl border border-border bg-background p-3 transition-colors focus-within:border-primary">
          <div className="flex items-center justify-between gap-2">
            <AmountInput
              label="Amount to swap"
              value={amount}
              onChange={handleChange}
            />
            <TokenChip symbol="TEKI" />
          </div>
          <div className="mt-2 flex items-center gap-2 font-ui text-[11px] text-muted-foreground">
            <MiniPill>Max</MiniPill>
            <span>Balance: 250 ATQM</span>
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
              {amount || "0.00"}
            </span>
            <TokenChip symbol="ATQM" />
          </div>
        </div>

        <div className="pt-1">
          {submitted ? (
            <MockSuccess
              title="Swap submitted"
              detail={`${amount} TEKI → ATQM`}
              onReset={() => {
                setSubmitted(false);
                setAmount("");
              }}
            />
          ) : (
            <MockButton onClick={() => setSubmitted(true)} disabled={!isValid}>
              Swap
            </MockButton>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 font-ui text-[11px] text-muted-foreground">
          <span>1 TEKI = 0.026 ATQM ($5.33)</span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="size-3" />
            {"<$0.01"}
          </span>
        </div>
      </div>
    </MockWindow>
  );
}
