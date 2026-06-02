"use client";

import * as React from "react";

/** Returns true once the page is scrolled past `threshold` pixels. */
export function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial read, deferred out of the effect body.
    const id = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return scrolled;
}
