"use client";

import Link from "next/link";
import { LayoutGrid, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

/**
 * Floating prototype controls — theme toggle + back to route gallery.
 * Visible on every page for reviewers. Remove from the layout to ship.
 */
export function DevPalette() {
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  return (
    <div className="safe-pt pointer-events-none fixed right-2 top-2 z-50">
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-pill border border-border bg-card/90 p-0.5 shadow-sm backdrop-blur-[8px]">
        <Link
          href="/"
          aria-label="Back to route gallery"
          title="Back to route gallery"
          className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <LayoutGrid size={13} strokeWidth={1.75} />
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <ThemeIcon size={13} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
