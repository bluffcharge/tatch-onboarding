"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { OperatorShell } from "./OperatorShell";
import { buildQuery, useWizard } from "./wizardParams";

export function ActivatingScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const { invites } = useWizard(sp);

  useEffect(() => {
    const t = setTimeout(() => router.push(`/operator/done${buildQuery({ invites })}`), 2200);
    return () => clearTimeout(t);
  }, [router, invites]);

  return (
    <OperatorShell variant="center">
      <div className="op-terminal">
        <span className="op-orb is-spin" aria-hidden="true" />
        <h1 className="op-h1">Setting up your account…</h1>
        <p className="op-sub">This will only take a moment.</p>
      </div>
    </OperatorShell>
  );
}
