"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { TicketPrimaryCTA } from "@/components/ui/TicketPrimaryCTA";
import {
  DarkFieldLabel,
  DarkFieldWrapper,
  DarkTertiaryLink,
} from "@/components/ui/DarkField";
import { OnboardingShell } from "./OnboardingShell";
import { OnboardingTicketFrame } from "./OnboardingTicketFrame";

type Role = "admin" | "member";
type Row = { id: string; recipient: string; role: Role };

const emptyRow = (): Row => ({
  id: Math.random().toString(36).slice(2, 9),
  recipient: "",
  role: "member",
});

/**
 * P5 — Invite teammates. Folded into the dark ticket frame. The
 * previous mobile-card vs lg+ table split collapses into one stacked
 * invitee-row layout — the dark frame is form-shaped, not table-wide,
 * and the table form was the larger of the two anyway.
 */
export function TeamInviteScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(() => [emptyRow()]);

  const filled = rows.filter((r) => r.recipient.trim().length > 3).length;

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }
  function addRow() {
    setRows((rs) => [...rs, emptyRow()]);
  }

  return (
    <OnboardingShell
      step={{ current: 3, total: 3 }}
      backHref="/onboarding/discovery"
      journey={{ currentKey: "team" }}
    >
      <div className="mt-2 md:mx-auto md:max-w-[380px] lg:max-w-[460px]">
        <OnboardingTicketFrame
          eyebrow="Step 5 · Team"
          serial="PASS · TEAM · COLLABORATORS"
          footer={
            <div className="space-y-3">
              <TicketPrimaryCTA
                icon={<ArrowRight size={15} strokeWidth={1.85} />}
                onClick={() => router.push("/onboarding/activating")}
              >
                {filled > 0
                  ? `Send ${filled} invite${filled === 1 ? "" : "s"} & finish`
                  : "Finish setup"}
              </TicketPrimaryCTA>
              <div className="text-center">
                <DarkTertiaryLink
                  onClick={() => router.push("/onboarding/activating")}
                >
                  Skip — I&apos;ll add teammates later
                </DarkTertiaryLink>
              </div>
            </div>
          }
        >
          <h1 className="text-[22px] font-semibold leading-[1.15] text-white lg:text-[26px]">
            Invite your team.
          </h1>
          <p className="mt-2 text-[13px] leading-snug text-white/55 lg:text-[13.5px]">
            Add anyone who&apos;ll be sending referrals or managing this account.
            They&apos;ll get an SMS to set up their own login.
          </p>

          <div className="mt-5 space-y-3">
            {rows.map((row, i) => (
              <div
                key={row.id}
                className="rounded-[10px] border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    {i === 0 && (
                      <DarkFieldLabel>Phone number (or email)</DarkFieldLabel>
                    )}
                    <DarkFieldWrapper>
                      <input
                        placeholder="(555) 014-9912 or name@business.com"
                        inputMode="tel"
                        value={row.recipient}
                        onChange={(e) =>
                          updateRow(row.id, { recipient: e.target.value })
                        }
                        className="h-full w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/35"
                      />
                    </DarkFieldWrapper>
                  </div>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remove invitee"
                      onClick={() => removeRow(row.id)}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-white/55 hover:bg-white/[0.06] hover:text-white ${i === 0 ? "mt-6" : ""}`}
                    >
                      <X size={16} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-white/55">
                    Role
                  </p>
                  <DarkRoleToggle
                    value={row.role}
                    onChange={(role) => updateRow(row.id, { role })}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-white/55 hover:text-white"
            >
              <Plus size={12} strokeWidth={2} />
              Add another
            </button>
          </div>
        </OnboardingTicketFrame>
      </div>
    </OnboardingShell>
  );
}

function DarkRoleToggle({
  value,
  onChange,
}: {
  value: Role;
  onChange: (v: Role) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-pill border border-white/15 bg-white/[0.04] p-0.5">
      {(["member", "admin"] as Role[]).map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={
              active
                ? "rounded-pill bg-white px-3 py-1 text-[11.5px] font-semibold capitalize text-[color:var(--grey-950)]"
                : "rounded-pill px-3 py-1 text-[11.5px] font-medium capitalize text-white/70 hover:text-white"
            }
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
