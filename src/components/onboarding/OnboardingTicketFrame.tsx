"use client";

import type { ReactNode } from "react";

type Props = {
  /** Mono-uppercase eyebrow above the headline (e.g. "Step 2 · Identity"). */
  eyebrow?: string;
  /** Main content of the ticket — headline, helper, form fields. */
  children: ReactNode;
  /** Primary CTA — typically the white die-cut pill. Lives inside the
   *  ticket so the action visually belongs to the card the user is
   *  filling in. */
  footer?: ReactNode;
  /** Small monospaced bottom band — mirrors the front face's serial line
   *  on the P1 ticket. Use it for step provenance ("0001 · STEP 02"). */
  serial?: ReactNode;
};

/**
 * Inset dark ticket card carrying the P1 ticket motif (hole punch,
 * perforations, dark surface, gradient outline, die-cut CTA) into the
 * later steps of the onboarding flow.
 *
 * Different from the P1 hero ticket in three ways:
 *   - no cord (it doesn't hang — it's inset on the form page)
 *   - no 3D cursor tilt (this is a focused-task moment, not a hero)
 *   - height is content-driven (it grows with the form, doesn't sit at
 *     a fixed 460–520px like the welcome variant)
 *
 * Same surface recipe as the P1 ticket so the two read as the same
 * physical object the user has been carrying through the flow.
 */
export function OnboardingTicketFrame({
  eyebrow,
  children,
  footer,
  serial,
}: Props) {
  return (
    // `.gradient-outline` paints the conic brand ring via mask-composite.
    // Force `position: relative` inline because `.absolute` would lose to
    // the class's `position: relative` declaration in the cascade — same
    // gotcha the flip card hit.
    <div
      className="gradient-outline rounded-[12px]"
      style={{ position: "relative" }}
    >
      <div className="relative overflow-hidden rounded-[12px] bg-[color:var(--grey-950)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(0,0,0,0.55),0_30px_60px_-20px_rgba(0,0,0,0.55)]">
        {/* Hole punch — sized + positioned to echo the P1 ticket so the
            card reads as the same physical object. */}
        <div className="absolute left-1/2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-pill bg-[color:var(--surface-canvas)] ring-1 ring-white/15" />

        {/* Perforation line just below the hole — top edge of the
            content zone. */}
        <div className="absolute left-6 right-6 top-12 border-t border-dashed border-white/8" />

        {/* Body: eyebrow + children + footer + serial. Padding starts
            below the perforation line. Roomier horizontal padding on
            lg+ so the wider card has visible margins inside the
            gradient outline. */}
        <div className="px-6 pb-4 pt-[68px] md:px-8 lg:px-10">
          {eyebrow && (
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">
              {eyebrow}
            </p>
          )}

          {children}

          {footer && (
            <div className="mt-8">
              {/* Perforation echoes the rhythm above the stub on the P1
                  ticket — visually anchors the CTA. */}
              <div className="mb-5 border-t border-dashed border-white/10" />
              {footer}
            </div>
          )}

          {serial && (
            <p className="mt-4 text-center font-mono text-[9.5px] tracking-[0.3em] text-white/55">
              {serial}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
