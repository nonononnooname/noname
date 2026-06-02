import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/features/shared/components/site-header";

// Self-hosted brand fonts (latin, variable 200–600 / 400–600) — removes the
// build-time dependency on fonts.gstatic.com. Source: Google Fonts.
const geologica = localFont({
  src: "./fonts/Geologica-latin.woff2",
  variable: "--font-geologica",
  weight: "200 600",
  display: "swap",
});

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  variable: "--font-jakarta",
  weight: "400 600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATQM // Atom Quantum",
  description:
    "A post-quantum Layer 1 for the world after secp256k1. EVM where it counts, new cryptography everywhere else.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions (password managers,
          Grammarly, Dark Reader, …) inject attributes on <html>/<body> before
          React hydrates. This only suppresses attribute mismatches on these two
          elements — real mismatches inside the app still surface. */}
      <body
        suppressHydrationWarning
        className={`${geologica.variable} ${jakarta.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
