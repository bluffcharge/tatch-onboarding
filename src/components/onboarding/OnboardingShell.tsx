"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StepperBar } from "./StepperBar";
import { JourneyTimeline } from "./JourneyTimeline";
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
  children: ReactNode;
};

export function OnboardingShell({
  step,
  backHref,
  onBack,
  footer,
  chrome = true,
  journey,
  children,
}: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink md:flex-row">
      {/* Wide-viewport left rail: timeline of the full journey. */}
      {journey && (
        <aside
          className="hidden shrink-0 border-r border-border-subtle bg-subtle/40 md:flex md:w-[300px] md:flex-col"
          aria-label="Onboarding progress"
        >
          <JourneyTimeline currentKey={journey.currentKey} />
        </aside>
      )}

      {/* Mobile-first content column. On md+ this becomes the right pane. */}
      <div className="flex min-h-[100dvh] flex-1 flex-col md:min-h-0">
        {chrome && (
          <header className="safe-pt sticky top-0 z-10 bg-canvas/85 backdrop-blur-[6px] md:static md:bg-transparent md:backdrop-blur-none">
            <div className="mx-auto flex w-full max-w-[480px] items-center gap-2 px-4 pb-3 pt-2 md:max-w-[560px] md:px-8 md:pt-8">
              {(backHref || onBack) && (
                <BackControl backHref={backHref} onBack={onBack} />
              )}
              {/* Wordmark hides on md+ since the rail already shows it. */}
              <span className="md:hidden">
                <Wordmark />
              </span>
            </div>
            {step && (
              <div className="mx-auto w-full max-w-[480px] px-4 pb-3 md:hidden">
                <StepperBar current={step.current} total={step.total} />
              </div>
            )}
          </header>
        )}

        <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pb-6 pt-2 md:max-w-[560px] md:px-8 md:pt-4">
          {children}
        </main>

        {footer && (
          <footer className="safe-pb sticky bottom-0 z-10 bg-canvas/95 backdrop-blur-[6px] md:static md:bg-transparent md:backdrop-blur-none">
            <div className="mx-auto w-full max-w-[480px] border-t border-border-subtle px-4 pt-4 pb-2 md:max-w-[560px] md:border-t-0 md:px-8 md:pb-8 md:pt-6">
              {footer}
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
