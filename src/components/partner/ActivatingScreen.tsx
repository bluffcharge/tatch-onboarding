"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PartnerShell } from "./PartnerShell";
import { useInvite } from "@/lib/useInvite";

export function ActivatingScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const invite = useInvite();
  const invites = parseInt(sp.get("invites") ?? "0", 10) || 0;

  useEffect(() => {
    const t = setTimeout(() => router.push(`/partner/done?invites=${invites}`), 2200);
    return () => clearTimeout(t);
  }, [router, invites]);

  return (
    <PartnerShell variant="center">
      <div className="op-terminal">
        <span className="op-orb is-spin" aria-hidden="true" />
        <h1 className="op-h1">Connecting you to {invite.operator.name}…</h1>
        <p className="op-sub">This will only take a moment.</p>
      </div>
    </PartnerShell>
  );
}
