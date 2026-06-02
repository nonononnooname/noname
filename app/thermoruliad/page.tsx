import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "ThermoRuliad Labs // Soon",
};

// Disabled stage. The lab (thermodynamic processor R&D) is not part of the first
// generation — the nav entry is non-clickable, this route only states "soon".
export default function ThermoRuliadPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-6 text-center">
      <Badge variant="muted">soon</Badge>
      <h1 className="font-display text-4xl font-light tracking-tight sm:text-6xl">
        ThermoRuliad <span className="text-primary">Labs</span>
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The lab building the Thermodynamic Processor. This stage is under
        construction.
      </p>
    </main>
  );
}
