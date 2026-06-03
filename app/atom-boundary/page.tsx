import type { Metadata } from "next";

import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import {
  Hero,
  Problem,
  Thesis,
  Ecosystem,
  Streams,
  Comparison,
  HowItWorks,
  Science,
  Maturity,
  Roadmap,
  Pitch,
} from "@/features/boundary/sections";

export const metadata: Metadata = {
  title: "Atom Boundary Labs // Physics-native computing & energy",
  description:
    "Atom Boundary Labs: one neutral-atom core feeding four streams — a Rydberg-atom optimizer, a topological machine, a thermodynamic AI accelerator, and a vacuum-energy chip. The computer is the physics. So is the battery.",
};

export default function AtomBoundaryPage() {
  return (
    <>
      {/* Ambient smoke behind the whole page, matching the ATQM page. The hero and
          the pitch carry their own opaque gradient; the transparent sections in
          between let the smoke fill their empty space. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
      >
        <SmokeBackground smokeColor="#7c7c7c" />
      </div>
      <main>
        <Hero />
        <Problem />
        <Thesis />
        <Ecosystem />
        <Streams />
        <Comparison />
        <HowItWorks />
        <Science />
        <Maturity />
        <Roadmap />
        <Pitch />
      </main>
    </>
  );
}
