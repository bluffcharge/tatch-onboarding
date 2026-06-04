"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OperatorShell } from "./OperatorShell";

export function ActivatingScreen() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/operator/done"), 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <OperatorShell variant="center">
      <span className="op-orb is-spin" aria-hidden="true" />
      <h1 className="op-h1">Setting up your account…</h1>
      <p className="op-sub">This will only take a moment.</p>
    </OperatorShell>
  );
}
