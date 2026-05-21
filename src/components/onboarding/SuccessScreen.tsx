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
  const sub = existing
    ? `${inviter.fullName} and ${operator.teammateCount} teammates have been added to your contacts. Nothing else changed.`
    : `You're connected to ${operator.name}. ${inviter.fullName} and ${operator.teammateCount} teammates have been added to your contacts.`;

  return (
    <OnboardingShell chrome={false}>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center">
          <div className="relative mb-7 h-16 w-16">
            <span className="absolute inset-0 rounded-pill bg-brand-gradient-4 opacity-90" />
            <span className="absolute inset-0 grid place-items-center text-white">
              <Check size={28} strokeWidth={2.5} />
            </span>
          </div>

          <h1 className="t-h1 mb-3 text-balance">{headline}</h1>
          <p className="t-body-lg max-w-[44ch] text-ink-subtitle">{sub}</p>

          <button
            type="button"
            onClick={() => setShowDetails((s) => !s)}
            className="mt-5 inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
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

          {showDetails && (
            <ConnectionSummary />
          )}
        </div>

        <div className="mt-6 space-y-3">
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
