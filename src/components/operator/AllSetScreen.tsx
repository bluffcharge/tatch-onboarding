"use client";

import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { useWizard } from "./wizardParams";

export function AllSetScreen() {
  const sp = useSearchParams();
  const { invites } = useWizard(sp);

  return (
    <OperatorShell variant="center">
      <div className="op-terminal">
        <span className="op-orb" aria-hidden="true">
          <Check size={34} strokeWidth={3} />
        </span>
        <h1 className="op-h1">You&apos;re all set.</h1>
        <p className="op-sub">
          Your Tatch Connect account is ready.
          {invites > 0 && (
            <>
              {" "}
              {invites} teammate{invites === 1 ? "" : "s"} {invites === 1 ? "has" : "have"} been invited.
            </>
          )}
        </p>
        <a className="op-btn op-btn--primary" href="https://tatch-half-mvp.vercel.app" target="_top">
          Go to dashboard
        </a>
      </div>
    </OperatorShell>
  );
}
