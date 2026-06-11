"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlaskConical, LayoutGrid, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { setTestMode, useTestMode } from "@/lib/testMode";

/**
 * Floating prototype controls — theme toggle + back to route gallery.
 * Visible on every page for reviewers. Hidden when the page is rendered
 * inside the gallery's iframe (parent owns the controls there) or when
 * ?embed=1 is on the URL. On /partner/* a flask toggles test mode:
 * every Continue works without validation so the sequence can be
 * click-tested with empty forms.
 */
export function DevPalette() {
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const [hidden, setHidden] = useState(true);
  const pathname = usePathname();
  const testMode = useTestMode();
  const showFlask = pathname?.startsWith("/partner");
  // The wizard is locked to the light design target (white cards), so the
  // theme toggle would be a dead control there — hide it on /partner/*.
  const showTheme = !pathname?.startsWith("/partner");

  useEffect(() => {
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    const embed =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("embed") === "1";
    const isGallery =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/gallery");
    setHidden(inIframe || embed || isGallery);
  }, []);

  if (hidden) return null;

  return (
    <div className="safe-pt pointer-events-none fixed right-2 top-2 z-50">
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-pill border border-border bg-card/90 p-0.5 shadow-sm backdrop-blur-[8px]">
        <Link
          href="/gallery"
          aria-label="Back to route gallery"
          title="Back to route gallery"
          className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <LayoutGrid size={13} strokeWidth={1.75} />
        </Link>
        {showFlask && (
          <button
            type="button"
            onClick={() => setTestMode(!testMode)}
            aria-label={testMode ? "Turn off test mode" : "Turn on test mode (skip validation)"}
            aria-pressed={testMode}
            title={testMode ? "Test mode ON — every Continue skips validation" : "Test mode: click through without filling forms"}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-pill",
              testMode
                ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                : "text-ink-caption hover:bg-subtle hover:text-ink-body",
            ].join(" ")}
          >
            <FlaskConical size={13} strokeWidth={1.75} />
          </button>
        )}
        {showTheme && (
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink-caption hover:bg-subtle hover:text-ink-body"
          >
            <ThemeIcon size={13} strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
