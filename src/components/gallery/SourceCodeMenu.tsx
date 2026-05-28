"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Code2, Download, ExternalLink } from "lucide-react";

/* Manifest of "interesting" animations + the source files developers
   typically need to copy out of this repo. Annotate routes in
   `src/app/page.tsx` with one of these keys via `animations: [...]`
   and the gallery exposes them in the per-route source menu.

   When adding a new animation:
     1. Add a new entry below with a short title, what it does, and
        the file paths developers should grab.
     2. Reference the key on the route(s) where it lives in
        `src/app/page.tsx`. */
export type AnimationKey =
  | "ticket-flip"
  | "activating-spinner"
  | "brand-ribbons";

export type AnimationManifestEntry = {
  title: string;
  description: string;
  /** Repo-relative paths (no leading slash) of the source files devs
   *  need to copy out. The menu links to the GitHub blob (rendered
   *  view) and offers a raw download per file. */
  files: string[];
};

export const ANIMATION_MANIFEST: Record<AnimationKey, AnimationManifestEntry> = {
  "ticket-flip": {
    title: "Hang-tag ticket — 3D flip + cursor tilt",
    description:
      "Two-faced card with `preserve-3d` + `backface-visibility`. Front holds the invite + die-cut CTA, back holds the code-entry form. Cursor parallax tilt on the outer wrapper composes with the flip rotation. `inert` on the offscreen face keeps focus + pointer events out of hidden content.",
    files: [
      "src/components/onboarding/TicketWelcomeScreen.tsx",
      "src/components/ui/TicketPrimaryCTA.tsx",
    ],
  },
  "activating-spinner": {
    title: "Activating — two-beat transition",
    description:
      "Spinner with a layered `animate-ping` halo + `animate-spin` ring. Copy advances on a two-beat timer (1.2s each) so the second beat is actually perceived before routing forward at ~2.4s.",
    files: ["src/components/onboarding/ActivatingScreen.tsx"],
  },
  "brand-ribbons": {
    title: "Brand ribbons — animated SVG sweep + pluck",
    description:
      "SVG bouquet that paints on via `stroke-dashoffset` (left → right reveal), then breathes via a slow vertical shimmer (≤0.6px, ~18s cycle, phase-offset per path so they don't move in lockstep). Easter-egg `pluck` hit zone in the bottom-left fires a one-shot wobble plus a WebAudio sine pluck.",
    files: [
      "src/components/onboarding/BrandRibbons.tsx",
      "src/app/globals.css",
    ],
  },
};

const REPO_BLOB = "https://github.com/bluffcharge/tatch-onboarding/blob/main";
const REPO_RAW = "https://raw.githubusercontent.com/bluffcharge/tatch-onboarding/main";

/**
 * Dropdown that lists the animation source files for the active route.
 * Renders nothing when the active route has no `animations` annotation.
 *
 * One "View" link per file (GitHub blob, syntax-highlighted) plus a
 * raw download chip. The repo is public so no auth handling needed —
 * developers can pull the files directly with curl / wget if they want
 * to script it.
 */
export function SourceCodeMenu({
  animations,
}: {
  animations?: AnimationKey[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cross-origin `<a download>` is ignored by browsers — clicking it
  // just opens the raw text in a new tab instead of saving. Fetch the
  // raw bytes ourselves and trigger the save via a Blob URL, which is
  // same-origin and respects the download attribute.
  const downloadRaw = useCallback(async (path: string) => {
    try {
      const res = await fetch(`${REPO_RAW}/${path}`);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = path.split("/").pop() ?? "source";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke after the browser has had a chance to start the download.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // Fallback: open the raw URL in a new tab (the original behavior).
      window.open(`${REPO_RAW}/${path}`, "_blank", "noreferrer");
    }
  }, []);

  // Close on click-outside + Escape so the dropdown behaves like a
  // native menu without requiring a focus trap.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!animations || animations.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
        title="View animation source code"
      >
        <Code2 size={12} strokeWidth={1.75} />
        Source
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-20 w-[360px] overflow-hidden rounded-[14px] border border-border bg-card shadow-lg"
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="t-mono-label">Animation source</p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink-caption">
              Open or download the files driving this screen&apos;s motion.
            </p>
          </div>
          <ul role="list" className="divide-y divide-border-subtle">
            {animations.map((key) => {
              const entry = ANIMATION_MANIFEST[key];
              return (
                <li key={key} className="px-4 py-3">
                  <p className="text-[12.5px] font-semibold text-ink-title">
                    {entry.title}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-ink-caption">
                    {entry.description}
                  </p>
                  <ul role="list" className="mt-2.5 space-y-1.5">
                    {entry.files.map((path) => (
                      <li
                        key={path}
                        className="flex items-center justify-between gap-2 rounded-md bg-subtle/60 px-2 py-1.5"
                      >
                        <code className="truncate font-mono text-[11px] text-ink-body">
                          {path}
                        </code>
                        <span className="flex shrink-0 items-center gap-1">
                          <a
                            href={`${REPO_BLOB}/${path}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Open in GitHub"
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-caption hover:bg-card hover:text-ink-body"
                          >
                            <ExternalLink size={11} strokeWidth={1.85} />
                          </a>
                          <button
                            type="button"
                            onClick={() => downloadRaw(path)}
                            title="Download raw"
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-caption hover:bg-card hover:text-ink-body"
                          >
                            <Download size={11} strokeWidth={1.85} />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border-subtle bg-subtle/40 px-4 py-2.5 text-[10.5px] uppercase tracking-[0.12em] text-ink-caption">
            <a
              href="https://github.com/bluffcharge/tatch-onboarding"
              target="_blank"
              rel="noreferrer"
              className="font-medium hover:text-ink-body"
            >
              bluffcharge / tatch-onboarding ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
