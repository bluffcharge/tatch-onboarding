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
    <div className="safe-pb pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-pill border border-border bg-card/95 px-1 py-1 shadow-md backdrop-blur-[8px]">
        <Link
          href="/"
          aria-label="Back to route gallery"
          className="inline-flex h-9 items-center gap-2 rounded-pill px-3 text-[12.5px] font-medium text-ink-body hover:bg-subtle"
        >
          <LayoutGrid size={14} strokeWidth={1.75} />
          Gallery
        </Link>
        <div className="h-5 w-px bg-border-subtle" aria-hidden="true" />
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="inline-flex h-9 items-center gap-2 rounded-pill px-3 text-[12.5px] font-medium text-ink-body hover:bg-subtle"
        >
          <ThemeIcon size={14} strokeWidth={1.75} />
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
}
