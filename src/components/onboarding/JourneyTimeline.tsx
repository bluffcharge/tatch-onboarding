"use client";

import { Check } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  PARTNER_JOURNEY,
  getStepIndex,
  type JourneyKey,
} from "@/lib/journey";

type Props = {
  currentKey: JourneyKey;
};

/**
 * Vertical step rail rendered on the left of OnboardingShell at md+
 * viewports. Mobile still gets the slim StepperBar at the top — this is
 * an additive context surface for laptop/tablet/desktop users.
 */
export function JourneyTimeline({ currentKey }: Props) {
  const currentIdx = getStepIndex(currentKey);
  return (
    <div className="flex h-full flex-col px-7 py-8">
      {/* Brand lockup */}
      <div className="mb-8 flex items-center">
        <Wordmark className="h-[17px]" />
      </div>

      <p className="t-mono-label mb-4">Get set up</p>

      <ol className="relative space-y-1.5">
        {PARTNER_JOURNEY.map((step, i) => {
          const completed = i < currentIdx;
          const current = i === currentIdx;
          const Icon = step.icon;
          const isLast = i === PARTNER_JOURNEY.length - 1;

          return (
            <li key={step.key} className="relative">
              {/* Connecting line below this row, except on the last */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute left-[18px] top-[36px] h-[calc(100%-12px)] w-px",
                    completed ? "bg-ink-title" : "bg-border",
                  ].join(" ")}
                />
              )}

              <div className="flex items-start gap-3 py-1.5">
                {/* Badge */}
                <span
                  aria-hidden="true"
                  className={[
                    "z-10 grid h-9 w-9 shrink-0 place-items-center rounded-pill border transition-colors duration-fast ease-snap",
                    completed
                      ? "border-[color:var(--text-title)] bg-[color:var(--text-title)] text-[color:var(--surface-canvas)]"
                      : current
                      ? "border-[color:var(--text-title)] bg-card text-ink-title"
                      : "border-border bg-canvas text-ink-disabled",
                  ].join(" ")}
                >
                  {completed ? (
                    <Check size={14} strokeWidth={2.25} />
                  ) : (
                    <Icon size={15} strokeWidth={1.75} />
                  )}
                </span>

                {/* Label + description */}
                <div className="min-w-0 pt-1">
                  <p
                    className={[
                      "text-[13px] font-semibold leading-tight",
                      current || completed ? "text-ink-title" : "text-ink-caption",
                    ].join(" ")}
                  >
                    {step.label}
                  </p>
                  <p
                    className={[
                      "mt-0.5 text-[11.5px] leading-snug",
                      current ? "text-ink-subtitle" : "text-ink-caption",
                    ].join(" ")}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Footer wordmark / context — small, quiet. */}
      <div className="mt-auto pt-8">
        <p className="text-[11px] leading-relaxed text-ink-disabled">
          About 90 seconds end-to-end. You can come back to anything later.
        </p>
      </div>
    </div>
  );
}
