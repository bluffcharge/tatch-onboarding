"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import { defaultInvite } from "@/lib/mockInvite";

export function SuccessScreen() {
  const sp = useSearchParams();
  const existing = sp.get("existing") === "1";
  const [showDetails, setShowDetails] = useState(false);
  const { inviter, operator } = defaultInvite;

  const headline = existing
    ? `${operator.name} is now connected to your account.`
    : "You're all set.";
  // Name the human as the only semibold line (pattern 05).
  const attribution = existing
    ? `Invited by ${inviter.fullName}`
    : `With ${inviter.fullName} at ${operator.name}`;
  const sub = existing
    ? `${operator.teammateCount} teammates added to your contacts. Nothing else changed.`
    : `${operator.teammateCount} teammates have been added to your contacts.`;

  return (
    <OnboardingShell chrome={false} center>
      <div className="flex w-full max-w-[600px] flex-col items-center px-6 text-center">
        <div className="relative mb-7 h-16 w-16">
          <span className="absolute inset-0 rounded-pill bg-brand-gradient-4 opacity-90" />
          <span className="absolute inset-0 grid place-items-center text-white">
            <Check size={28} strokeWidth={2.5} />
          </span>
        </div>

        <h1 className="t-h1 mb-2 text-balance 2xl:text-[52px] 2xl:leading-[1.05]">{headline}</h1>
        <p className="text-[18px] font-semibold text-ink-title md:text-[20px]">{attribution}</p>
        <p className="t-body-lg mt-2 max-w-[44ch] text-ink-subtitle">{sub}</p>

        <button
          type="button"
          onClick={() => setShowDetails((s) => !s)}
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
          aria-expanded={showDetails}
        >
          View connection details
          <ChevronDown
            size={14}
            strokeWidth={1.75}
            className={[
              "transition-transform duration-fast ease-snap",
              showDetails ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {showDetails && <ConnectionSummary />}

        {/* Single CTA — capped per pattern 05 (160–220px, never full-bleed). */}
        <div className="mt-8 w-full max-w-[220px]">
          <Button
            fullWidth
            size="lg"
            onClick={() => alert("(prototype) — would land on the partner home")}
          >
            Go to home
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

function ConnectionSummary() {
  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-4 shadow-xs">
      <Row label="Operator">{defaultInvite.operator.name}</Row>
      <Row label="Invited by">
        {defaultInvite.inviter.fullName} · {defaultInvite.inviter.title}
      </Row>
      <Row label="Linked at">{new Date().toLocaleString()}</Row>
      <Row label="Teammates added">{defaultInvite.operator.teammateCount}</Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-2.5 last:border-b-0">
      <span className="t-mono-label">{label}</span>
      <span className="text-right text-[13px] font-medium text-ink-title">
        {children}
      </span>
    </div>
  );
}
