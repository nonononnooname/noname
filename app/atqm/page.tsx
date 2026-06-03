import type { Metadata } from "next";

import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import {
  Hero,
  Problem,
  AtqmBrand,
  Architecture,
  PqPrimitives,
  Transactions,
  Performance,
  Ecosystem,
  Products,
  Roadmap,
  Pitch,
} from "@/features/atqm/sections";
import { HardwareShowcase } from "@/features/atqm/components/hardware-showcase";

export const metadata: Metadata = {
  title: "ATQM // Atom Quantum — post-quantum Layer 1",
  description:
    "Atom Quantum (ATQM): a post-quantum Layer 1. ML-DSA, ML-KEM, HotStuff finality — EVM where it counts, new cryptography everywhere else.",
};

export default function AtqmPage() {
  return (
    <>
      {/* Ambient smoke behind the whole page. The hero and section 02 (which has
          its own entropy field) are opaque and cover it; the other sections are
          transparent, so the smoke fills their empty space. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
      >
        <SmokeBackground smokeColor="#7c7c7c" />
      </div>
      <main>
        <Hero />
        <Problem />
        <AtqmBrand />
        <Architecture />
        <PqPrimitives />
        <Transactions />
        <Performance />
        <Ecosystem />
        <Products />
        <HardwareShowcase />
        <Roadmap />
        <Pitch />
      </main>
    </>
  );
}
