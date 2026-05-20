"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-ink-body transition-colors duration-fast ease-snap hover:bg-subtle " +
        className
      }
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}
