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
        // At 2xl+ (Desktop+Wide, the in-scope viewports for this audit
        // pass), the footer reverts to a vertical CTA-on-top stack with
        // the skip link below — per pattern 03-form-as-conversation.
        // Laptop (lg) keeps its horizontal lockup so out-of-scope
        // viewports are untouched.
        <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:space-y-0 2xl:flex-col 2xl:items-stretch 2xl:gap-3 2xl:space-y-0">
          <button
            type="button"
            onClick={() => router.push("/onboarding/activating")}
            className="block w-full text-center text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline lg:order-1 lg:w-auto 2xl:order-2 2xl:w-full"
          >
            Skip — I&apos;ll add teammates later
          </button>
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push("/onboarding/activating")}
            className="lg:order-2 lg:w-auto 2xl:order-1 2xl:w-full"
          >
            {filled > 0
              ? `Send ${filled} invite${filled === 1 ? "" : "s"} & finish`
              : "Finish setup"}
          </Button>
        </div>
      }
    >
      {/* `mx-auto` + a form-shaped cap so the content centers in the
          right pane next to the journey rail rather than skewing left
          of the pane's center. Same pattern as AuthScreen but wider at
          lg to give the table room to breathe. At 2xl+ (Desktop +
          Wide) the table layout is hidden in favor of stacked cards
          (pattern 03 — form-as-conversation), so the column tightens
          back to 520px so the cards sit in cap-and-center geometry. */}
      <div className="mt-2 md:mx-auto md:mt-0 md:max-w-[400px] lg:max-w-[696px] 2xl:max-w-[520px]">
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          Invite your team.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          Add anyone who&apos;ll be sending referrals or managing this account.
          They&apos;ll get an SMS to set up their own login.
        </p>

        {/* Mobile / tablet: stacked card per row. Laptop (lg): table
            layout (kept for out-of-scope laptop viewport). Desktop +
            Wide (2xl+): back to stacked cards per pattern 03
            (form-as-conversation; vertical rhythm > horizontal density).
            Card width cap is the parent's max-w; the row container
            stretches to fill it. */}
        <div className="space-y-3 lg:hidden 2xl:block">
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

        {/* Laptop table (lg only; hidden at 2xl+ where the stacked cards
            return per pattern 03). Kept here so the laptop viewport
            stays out of scope of this audit pass. */}
        <div className="hidden lg:block 2xl:hidden">
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
      className="inline-flex rounded-pill border border-border bg-subtle p-0.5"
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
              "inline-flex h-7 items-center rounded-pill px-3.5 text-[12px] font-semibold",
              "transition-[background-color,color,box-shadow] duration-fast ease-snap",
              // Selected reads as an unmistakable ink pill (matches the
              // gallery's ViewportSwitcher), with a glass top-edge
              // highlight as the specular cue. Unselected stays a quiet
              // caption that promotes to a ghost-glass tint on hover.
              on
                ? "bg-[color:var(--btn-ink-bg)] text-[color:var(--btn-ink-fg)] shadow-[inset_0_1px_0_0_var(--glass-btn-hover-highlight)]"
                : "text-ink-caption hover:bg-[color:var(--glass-btn-ghost-hover-bg)] hover:text-ink-body",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
