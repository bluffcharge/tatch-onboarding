"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { OnboardingShell } from "./OnboardingShell";

type Role = "admin" | "member";
type Row = { id: string; recipient: string; role: Role };

const emptyRow = (): Row => ({
  id: Math.random().toString(36).slice(2, 9),
  recipient: "",
  role: "member",
});

export function TeamInviteScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(() => [emptyRow()]);

  const filled = rows.filter((r) => r.recipient.trim().length > 3).length;

  return (
    <OnboardingShell
      step={{ current: 3, total: 3 }}
      backHref="/onboarding/discovery"
      journey={{ currentKey: "team" }}
      footer={
        <div className="space-y-3">
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push("/onboarding/activating")}
          >
            {filled > 0
              ? `Send ${filled} invite${filled === 1 ? "" : "s"} & finish`
              : "Finish setup"}
          </Button>
          <button
            type="button"
            onClick={() => router.push("/onboarding/activating")}
            className="block w-full text-center text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
          >
            Skip — I&apos;ll add teammates later
          </button>
        </div>
      }
    >
      <div className="mt-2">
        <h1 className="t-h2 mb-2">Invite your team.</h1>
        <p className="t-body mb-6 text-ink-subtitle">
          Add anyone who&apos;ll be sending referrals or managing this account.
          They&apos;ll get an SMS to set up their own login.
        </p>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className="rounded-lg border border-border bg-card p-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <TextField
                    label={i === 0 ? "Phone number (or email)" : undefined}
                    placeholder="(555) 014-9912 or name@business.com"
                    inputMode="tel"
                    value={row.recipient}
                    onChange={(e) =>
                      setRows((rs) =>
                        rs.map((r) =>
                          r.id === row.id ? { ...r, recipient: e.target.value } : r
                        )
                      )
                    }
                  />
                </div>
                {rows.length > 1 && (
                  <button
                    type="button"
                    aria-label="Remove invitee"
                    onClick={() =>
                      setRows((rs) => rs.filter((r) => r.id !== row.id))
                    }
                    className="mt-7 inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-caption hover:bg-subtle"
                  >
                    <X size={16} strokeWidth={1.75} />
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <p className="t-mono-label">Role</p>
                <RoleToggle
                  value={row.role}
                  onChange={(role) =>
                    setRows((rs) =>
                      rs.map((r) => (r.id === row.id ? { ...r, role } : r))
                    )
                  }
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, emptyRow()])}
            className="inline-flex items-center gap-2 rounded-md py-2 text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
          >
            <Plus size={14} strokeWidth={1.75} />
            Add another
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}

function RoleToggle({
  value,
  onChange,
}: {
  value: Role;
  onChange: (v: Role) => void;
}) {
  const opts: { value: Role; label: string }[] = [
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Role"
      className="inline-flex rounded-pill border border-border bg-canvas p-0.5"
    >
      {opts.map((o) => {
        const on = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={[
              "inline-flex h-7 items-center rounded-pill px-3 text-[12px] font-medium",
              "transition-colors duration-fast ease-snap",
              on
                ? "bg-card text-ink-title shadow-xs"
                : "text-ink-caption hover:text-ink-body",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
