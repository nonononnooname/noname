"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { NAV_ITEMS } from "@/features/shared/nav";
import { AtqmLogo } from "@/features/shared/components/atqm-logo";

function NavLinks({
  pathname,
  variant,
  onNavigate,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const base =
    variant === "desktop"
      ? "flex min-h-11 items-center px-3 font-ui text-xs uppercase tracking-wider transition-colors"
      : "flex min-h-12 items-center justify-between border-b border-border/60 font-ui text-sm uppercase tracking-wider transition-colors";

  return (
    <>
      {NAV_ITEMS.map((item) => {
        if (item.disabled) {
          return (
            <span
              key={item.href}
              aria-disabled
              className={cn(base, "cursor-not-allowed text-muted-foreground/60")}
            >
              {item.label}
              <Badge variant="muted" className="ml-2">
                soon
              </Badge>
            </span>
          );
        }

        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              base,
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const pathname = usePathname();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-lg md:border md:border-transparent md:transition-all md:ease-out",
        scrolled &&
          !open &&
          "border-border bg-background/80 backdrop-blur-lg md:top-4 md:max-w-3xl md:border-border md:shadow-lg",
        open && "bg-background/90",
      )}
    >
      <nav
        className={cn(
          "flex h-16 w-full items-center justify-between px-4 md:h-14 md:transition-all md:ease-out",
          scrolled && "md:px-3",
        )}
      >
        <Link
          href="/atqm"
          aria-label="ATQM home"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <AtqmLogo className="h-5 w-auto text-foreground" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLinks pathname={pathname} variant="desktop" />
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-50 flex-col border-t border-border bg-background/95 backdrop-blur-lg md:hidden",
          open ? "flex" : "hidden",
        )}
      >
        <nav className="flex flex-col p-4">
          <NavLinks
            pathname={pathname}
            variant="mobile"
            onNavigate={() => setOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
