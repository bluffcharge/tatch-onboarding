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
      footer={
        <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:space-y-0">
          <button
            type="button"
            onClick={() => router.push("/onboarding/activating")}
            className="block w-full text-center text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline lg:order-1 lg:w-auto"
          >
            Skip — I&apos;ll add teammates later
          </button>
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push("/onboarding/activating")}
            className="lg:order-2 lg:w-auto"
          >
            {filled > 0
              ? `Send ${filled} invite${filled === 1 ? "" : "s"} & finish`
              : "Finish setup"}
          </Button>
        </div>
      }
    >
      <div className="mt-2 md:mt-0">
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          Invite your team.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          Add anyone who&apos;ll be sending referrals or managing this account.
          They&apos;ll get an SMS to set up their own login.
        </p>

        {/* Mobile / tablet: stacked card per row. Desktop (lg+): table layout. */}
        <div className="space-y-3 lg:hidden">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className="rounded-2xl border border-border bg-card p-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <TextField
                    label={i === 0 ? "Phone number (or email)" : undefined}
                    placeholder="(555) 014-9912 or name@business.com"
                    inputMode="tel"
                    value={row.recipient}
                    onChange={(e) => updateRow(row.id, { recipient: e.target.value })}
                  />
                </div>
                {rows.length > 1 && (
                  <RemoveButton onClick={() => removeRow(row.id)} className={i === 0 ? "mt-7" : ""} />
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <p className="t-mono-label">Role</p>
                <RoleToggle
                  value={row.role}
                  onChange={(role) => updateRow(row.id, { role })}
                />
              </div>
            </div>
          ))}
          <AddAnother onClick={addRow} />
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid grid-cols-[1fr_220px_40px] items-center gap-3 border-b border-border-subtle bg-subtle/40 px-4 py-2.5">
              <p className="t-mono-label">Phone or email</p>
              <p className="t-mono-label">Role</p>
              <span aria-hidden="true" />
            </div>
            <ul role="list">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="grid grid-cols-[1fr_220px_40px] items-center gap-3 border-b border-border-subtle px-4 py-3 last:border-b-0"
                >
                  <input
                    type="text"
                    inputMode="tel"
                    placeholder="(555) 014-9912 or name@business.com"
                    value={row.recipient}
                    onChange={(e) => updateRow(row.id, { recipient: e.target.value })}
                    className="h-10 w-full rounded-[12px] border border-border bg-canvas px-4 text-[14px] text-ink-title outline-none placeholder:text-ink-disabled focus:border-[color:var(--focus-border)] focus:shadow-[var(--focus-ring)]"
                  />
                  <RoleToggle
                    value={row.role}
                    onChange={(role) => updateRow(row.id, { role })}
                  />
                  {rows.length > 1 ? (
                    <RemoveButton onClick={() => removeRow(row.id)} />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </li>
              ))}
              <li className="px-4 py-2.5">
                <AddAnother onClick={addRow} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

function RemoveButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label="Remove invitee"
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-[12px] text-ink-caption hover:bg-subtle hover:text-ink-body",
        className,
      ].join(" ")}
    >
      <X size={16} strokeWidth={1.75} />
    </button>
  );
}

function AddAnother({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md py-2 text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
    >
      <Plus size={14} strokeWidth={1.75} />
      Add another
    </button>
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
