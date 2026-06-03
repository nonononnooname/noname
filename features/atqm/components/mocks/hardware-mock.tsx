import Image from "next/image";

/**
 * Hardware Wallet — the real product render exported from Figma (POST frame),
 * sat on a soft brand glow. Decorative (the adjacent copy carries meaning).
 */
export function HardwareMock() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md select-none">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 50%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 72%)",
        }}
      />
      <Image
        src="/products/atqm-wallet.png"
        alt=""
        width={793}
        height={399}
        sizes="(max-width: 1024px) 90vw, 480px"
        className="h-auto w-full"
      />
    </div>
  );
}
