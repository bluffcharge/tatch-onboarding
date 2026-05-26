"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StepperBar } from "./StepperBar";
import { JourneyTimeline } from "./JourneyTimeline";
import { BrandRibbons } from "./BrandRibbons";
import type { JourneyKey } from "@/lib/journey";

type Props = {
  step?: { current: number; total: number };
  backHref?: string;
  onBack?: () => void;
  /** sticky footer CTAs (button or div) — pin to bottom on mobile */
  footer?: ReactNode;
  /** whether to show the lock-up at top (logo + theme toggle). default true */
  chrome?: boolean;
  /** when provided, renders a vertical step rail on md+ viewports. The
   *  slim top stepper still shows on mobile only (md:hidden). */
  journey?: { currentKey: JourneyKey };
  /** Hero / split-screen mode — widens the content column on lg+ so the
   *  screen can host a 2-column layout (e.g. P1's feature-card cluster).
   *  Mobile is unaffected. */
  wide?: boolean;
  /** Brand-gradient ribbon ornament sweeping the lower-left of the canvas
   *  on lg+ viewports. Defaults on — opt out on screens that have their
   *  own dominant motion (e.g. P6 Activating's spinner). */
  ornament?: boolean;
  children: ReactNode;
};

export function OnboardingShell({
  step,
  backHref,
  onBack,
  footer,
  chrome = true,
  journey,
  wide = false,
  ornament = true,
  children,
}: Props) {
  // Width classes for header / main / footer wrappers. Standard form pages
  // grow 480→640→760→860→1280. Hero / split-screen pages get a wider band
  // starting at lg and stretch to 1800 at 2xl so modules actually fill the
  // canvas at Wide viewport (2560 native) instead of centering with margins.
  const widthCls = wide
    ? "max-w-[480px] md:max-w-[720px] lg:max-w-[1120px] xl:max-w-[1320px] 2xl:max-w-[1800px]"
    : "max-w-[480px] md:max-w-[640px] lg:max-w-[760px] xl:max-w-[920px] 2xl:max-w-[1280px]";
  const xPadCls = wide
    ? "px-4 md:px-10 lg:px-14 2xl:px-20"
    : "px-4 md:px-10 lg:px-12 2xl:px-16";

  // When a journey rail is present and the screen isn't using the wide
  // multi-column band, the right pane has plenty of room around a
  // form-shaped content cap. Center the header chrome (back arrow) so
  // it aligns with the dark ticket frame's left edge. Wide screens opt
  // out — they own their own multi-column layouts.
  const centerInRail = !!journey && !wide;
  // Widened to 760/920 so the dark ticket frame reads as a poster-shaped
  // rectangle (~16:9 at lg) rather than a vertical card — more canvas
  // commitment, content has horizontal room to breathe.
  const formCapCls = "md:max-w-[760px] lg:max-w-[920px]";
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-canvas text-ink md:flex-row">
      {/* Ornament layer — absolute, behind everything. lg:block gated inside
          the component, so phone/tablet stay clean by default. */}
      {ornament && <BrandRibbons />}

      {/* Wide-viewport left rail: timeline of the full journey. */}
      {journey && (
        <aside
          className="relative z-10 hidden shrink-0 border-r border-border-subtle bg-subtle/40 md:flex md:w-[300px] md:flex-col xl:w-[340px] 2xl:w-[400px]"
          aria-label="Onboarding progress"
        >
          <JourneyTimeline currentKey={journey.currentKey} />
        </aside>
      )}

      {/* Mobile-first content column. On md+ this becomes the right pane.
          Stays above the ornament via z-10 so the ribbons read as background. */}
      <div className="relative z-10 flex min-h-[100dvh] flex-1 flex-col md:min-h-0">
        {chrome && (
          <header className="safe-pt sticky top-0 z-10 bg-canvas/85 backdrop-blur-[6px] md:static md:bg-transparent md:backdrop-blur-none">
            <div className={`mx-auto flex w-full items-center gap-2 pb-3 pt-2 md:pt-10 lg:pt-14 ${widthCls} ${xPadCls}`}>
              {/* Center the back arrow with the dark ticket frame on
                  rail-paired screens so it sits at the form's left edge
                  rather than the right pane's. */}
              <div
                className={`flex w-full items-center gap-2 ${centerInRail ? `mx-auto ${formCapCls}` : ""}`}
              >
                {(backHref || onBack) && (
                  <BackControl backHref={backHref} onBack={onBack} />
                )}
                <span className="md:hidden">
                  <Wordmark />
                </span>
              </div>
            </div>
            {step && (
              <div className="mx-auto w-full max-w-[480px] px-4 pb-3 md:hidden">
                <StepperBar current={step.current} total={step.total} />
              </div>
            )}
          </header>
        )}

        {/* main grows on mobile (so the sticky footer stays pinned to the
            viewport bottom and any inner `flex-1` push-down works), then
            shrinks to its content on md+ so the CTA sits with the form
            instead of floating at the bottom of a 100dvh canvas. */}
        <main className={`mx-auto flex w-full flex-1 flex-col pb-6 pt-2 md:flex-none md:pt-4 lg:pt-6 ${widthCls} ${xPadCls}`}>
          {children}
        </main>

        {footer && (
          <footer className="safe-pb sticky bottom-0 z-10 bg-canvas/95 backdrop-blur-[6px] md:static md:bg-transparent md:backdrop-blur-none">
            <div className={`mx-auto w-full border-t border-border-subtle pt-4 pb-2 md:border-t-0 md:pb-10 md:pt-6 lg:pb-14 ${widthCls} ${xPadCls}`}>
              {/* Cap CTA widths on wide canvases — a full-bleed button at
                  1800px reads as a banner, not an action. Keeps the footer
                  legible at all sizes while still left-aligning to the form. */}
              <div className="md:max-w-[280px] lg:max-w-[320px]">
                {footer}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

function BackControl({
  backHref,
  onBack,
}: {
  backHref?: string;
  onBack?: () => void;
}) {
  const className =
    "inline-flex h-9 w-9 -ml-2 items-center justify-center rounded-md text-ink-body hover:bg-subtle transition-colors duration-fast ease-snap";
  const icon = <ChevronLeft size={20} strokeWidth={1.75} />;
  if (backHref) {
    return (
      <Link aria-label="Back" href={backHref} className={className}>
        {icon}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onBack}
      className={className}
    >
      {icon}
    </button>
  );
}

function Wordmark() {
  return (
    <span
      aria-label="Tatch"
      className="select-none text-[15px] font-semibold tracking-tight text-ink-title"
    >
      tatch
    </span>
  );
}
