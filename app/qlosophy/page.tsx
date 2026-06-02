import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QLOSOPHY // The Attention Engine",
};

// QLOSOPHY is the finished legacy experience. It is served verbatim from
// public/qlosophy/index.html (vanilla JS, canvases, gifs — untouched) and
// embedded as-is inside an iframe. The site header sits above it for navigation.
export default function QlosophyPage() {
  return (
    <iframe
      src="/qlosophy/index.html"
      title="QLOSOPHY // The Attention Engine"
      className="h-[calc(100vh-4rem)] w-full border-0"
    />
  );
}
