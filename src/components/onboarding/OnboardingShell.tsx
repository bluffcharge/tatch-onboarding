"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { StepperBar } from "./StepperBar";

type Props = {
  step?: { current: number; total: number };
  backHref?: string;
  onBack?: () => void;
  /** sticky footer CTAs (button or div) — pin to bottom on mobile */
  footer?: ReactNode;
  /** whether to show the lock-up at top (logo + theme toggle). default true */
  chrome?: boolean;
  children: ReactNode;
};

export function OnboardingShell({
  step,
  backHref,
  onBack,
  footer,
  chrome = true,
  children,
}: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink">
      {chrome && (
        <header className="safe-pt sticky top-0 z-10 bg-canvas/85 backdrop-blur-[6px]">
          <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3 px-4 pb-3 pt-2">
            <div className="flex items-center gap-2">
              {(backHref || onBack) && (
                <BackControl backHref={backHref} onBack={onBack} />
              )}
              <Wordmark />
            </div>
            <ThemeToggle />
          </div>
          {step && (
            <div className="mx-auto w-full max-w-[480px] px-4 pb-3">
              <StepperBar current={step.current} total={step.total} />
            </div>
          )}
        </header>
      )}

      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pb-6 pt-2">
        {children}
      </main>

      {footer && (
        <footer className="safe-pb sticky bottom-0 z-10 bg-canvas/95 backdrop-blur-[6px]">
          <div className="mx-auto w-full max-w-[480px] border-t border-border-subtle px-4 pt-4 pb-2">
            {footer}
          </div>
        </footer>
      )}
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
