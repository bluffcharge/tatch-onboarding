"use client";

import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { PartnerShell } from "./PartnerShell";
import { useInvite } from "@/lib/useInvite";

const PARTNER_APP = "https://tatch-half-mvp.vercel.app";

export function AllSetScreen() {
  const sp = useSearchParams();
  const invite = useInvite();
  const existing = sp.get("existing") === "1";
  const invites = parseInt(sp.get("invites") ?? "0", 10) || 0;

  return (
    <PartnerShell variant="center">
      <div className="op-terminal">
        <span className="op-orb" aria-hidden="true">
          <Check size={34} strokeWidth={3} />
        </span>
        <h1 className="op-h1">{existing ? "Welcome back." : "You're connected."}</h1>
        <p className="op-sub">
          {existing ? (
            <>Your account is already set up — you&apos;re good to go.</>
          ) : (
            <>
              {invite.operator.name} can now send referrals your way.
              {invites > 0 && (
                <>
                  {" "}
                  {invites} teammate{invites === 1 ? "" : "s"} {invites === 1 ? "has" : "have"} been invited.
                </>
              )}
            </>
          )}
        </p>
        <a className="op-btn op-btn--primary" href={PARTNER_APP} target="_top">
          Open Tatch
        </a>
      </div>
    </PartnerShell>
  );
}
