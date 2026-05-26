"use client";

import type { ReactNode } from "react";

/**
 * The white "die-cut" pill that lives inside a dark ticket surface.
 * Reads as the paper-white page showing *through* the dark card:
 *   - inset ring marks the cut edge
 *   - inset top shadow reads as card material above casting inward
 *   - faint inset bottom highlight catches the cut lip
 *
 * Originally inlined in TicketWelcomeScreen; pulled out so the same
 * recipe can be used by the inset ticket frames that carry the motif
 * through later onboarding steps.
 */
export function TicketPrimaryCTA({
  icon,
  children,
  onClick,
  disabled,
  type = "button",
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={(e) => e.stopPropagation()}
      className="group relative inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-white px-5 text-[13.5px] font-semibold text-[color:var(--grey-950)] ring-1 ring-inset ring-black/15 shadow-[inset_0_2px_3px_rgba(0,0,0,0.18),inset_0_-1px_0_rgba(255,255,255,0.9),0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-fast ease-snap hover:bg-white active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100"
    >
      <span className="relative z-[2] inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}
