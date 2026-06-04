"use client";

import { Check } from "lucide-react";
import { OperatorShell } from "./OperatorShell";

export function AllSetScreen() {
  return (
    <OperatorShell variant="center">
      <span className="op-orb" aria-hidden="true">
        <Check size={34} strokeWidth={3} />
      </span>
      <h1 className="op-h1">You&apos;re all set.</h1>
      <p className="op-sub">Your Tatch Connect account is ready.</p>
      <a className="op-btn op-btn--primary" href="https://tatch-half-mvp.vercel.app" target="_top">
        Go to dashboard
      </a>
    </OperatorShell>
  );
}
