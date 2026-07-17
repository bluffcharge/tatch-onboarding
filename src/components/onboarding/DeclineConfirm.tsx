"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

/* Inline decline confirmation — swaps in for the CTA cluster on the
   invite screens (P1 welcome, existing-account connect) when the quiet
   "Decline" affordance is clicked. Deliberately not a modal: it's one
   lightweight, in-place question that states the consequence rather
   than a generic are-you-sure. "Keep the invite" stays the visually
   primary action so the accept path keeps its dominance even here. */

type Props = {
  /** Consequence copy — who gets told, and that the door stays open. */
  consequence: string;
  onDecline: () => void;
  onKeep: () => void;
};

export function DeclineConfirm({ consequence, onDecline, onKeep }: Props) {
  // Focus lands on the non-destructive action when the confirm appears,
  // so an accidental Enter keeps the invite rather than declining it.
  const keepRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    keepRef.current?.focus();
  }, []);

  return (
    <div
      role="group"
      aria-labelledby="decline-confirm-title"
      className="invite-reveal w-full max-w-[380px] rounded-2xl border border-border bg-card p-5 text-left shadow-xs"
    >
      <p
        id="decline-confirm-title"
        className="text-[14.5px] font-semibold text-ink-title"
      >
        Decline this invite?
      </p>
      <p className="mt-1.5 text-pretty text-[13px] leading-relaxed text-ink-subtitle">
        {consequence}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
        <Button ref={keepRef} fullWidth size="md" onClick={onKeep}>
          Keep the invite
        </Button>
        <Button fullWidth size="md" variant="secondary" onClick={onDecline}>
          Decline invite
        </Button>
      </div>
    </div>
  );
}
