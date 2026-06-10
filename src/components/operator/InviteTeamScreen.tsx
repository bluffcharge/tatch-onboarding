"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Users, Plus, Trash2, Info } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { SEAT_FEE, buildQuery, money, pricing, readWizard } from "./wizardParams";

type Role = "admin" | "manager" | "bdm" | "member";
type Invite = { id: number; value: string; role: Role };

const ROLES: { key: Role; label: string }[] = [
  { key: "admin", label: "Admin" },
  { key: "manager", label: "Manager" },
  { key: "bdm", label: "BDM" },
  { key: "member", label: "Member" },
];

const SAMPLE = ["maria@acmeroofing.com", "devon@acmeroofing.com", "priya@acmeroofing.com", "sam@acmeroofing.com", "lee@acmeroofing.com"];
/* Seeded rows walk the role ladder so deep-linked demos show the selector range. */
const SAMPLE_ROLES: Role[] = ["admin", "manager", "bdm", "member", "member"];

let _id = 100;
const newRow = (value = "", role: Role = "member"): Invite => ({ id: _id++, value, role });

export function InviteTeamScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const seed = readWizard(sp);
  const planSeats = seed.seats;

  // Seed pre-filled invite rows from ?invites=N (deep-link into the auto-upgrade state).
  const [rows, setRows] = useState<Invite[]>(() => {
    const n = Math.min(seed.invites, SAMPLE.length);
    if (n > 0) return Array.from({ length: n }, (_, i) => newRow(SAMPLE[i], SAMPLE_ROLES[i]));
    return [newRow()];
  });

  const filled = useMemo(() => rows.filter((r) => r.value.trim().length > 0).length, [rows]);
  const totalUsers = 1 + filled; // including you

  /* Design call 2026-06-09: inviting past the plan's seat count never blocks.
     The plan auto-grows — the seat badge, the cost note, and the CTA's
     running total carry the price change; no confirm step. */
  const billedSeats = Math.max(planSeats, totalUsers);
  const extra = billedSeats - planSeats;
  const overage = extra > 0;
  const wiz = { branches: seed.branches, seats: planSeats, billing: seed.billing };
  const base = pricing({ ...wiz, invites: 0 });
  const upgraded = pricing({ ...wiz, invites: filled });

  /* An empty row already IS the "another" — gate the add until every row is
     filled, so stacking blanks can't desync the list from the seat pricing. */
  const canAdd = rows.every((r) => r.value.trim().length > 0);

  const setRow = (id: number, patch: Partial<Invite>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, newRow()]);
  const removeRow = (id: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));

  // Post-payment step: finishing (or skipping) goes straight to activation.
  const proceed = () => router.push(`/operator/activating${buildQuery({ invites: filled })}`);
  const skip = () => router.push("/operator/activating");

  const query = buildQuery(wiz);

  return (
    <OperatorShell step={6} backHref={`/operator/payment${query}`} query={query} wide>
      <h1 className="op-h1">Invite your team.</h1>
      <p className="op-sub" style={{ marginBottom: 26 }}>
        Add anyone who&apos;ll be managing referrals or operating this account. They&apos;ll get an email
        to set up their own login.
      </p>

      {/* License badge — grows with the invite list (US4, auto-upgrade) */}
      <div className="op-seat">
        <div className="op-seat-head">
          <span className="op-seat-icon"><Users size={18} /></span>
          <span>
            <div className="op-seat-title">
              {billedSeats} operator seat{billedSeats === 1 ? "" : "s"} included
              {overage && (
                <span className="op-seat-chip">+{extra} · {money(extra * SEAT_FEE)}/mo</span>
              )}
            </div>
            <div className="op-seat-sub">
              1 for you · {billedSeats - 1} for teammate{billedSeats - 1 === 1 ? "" : "s"} · {money(SEAT_FEE)}/user/mo
            </div>
          </span>
        </div>
        <div className="op-seat-track">
          <div className="op-seat-fill" style={{ width: `${(totalUsers / billedSeats) * 100}%` }} />
        </div>
        <div className="op-seat-meta">
          {totalUsers} of {billedSeats} seat{billedSeats === 1 ? "" : "s"} used (including you)
        </div>
      </div>

      {/* Invite rows (US4 FR2/FR3) */}
      <div className="op-invites">
        {rows.map((r) => (
          <div className="op-invite-row" key={r.id}>
            <label className="op-field" style={{ marginBottom: 0 }}>
              <span className="op-field-label">Phone number or email</span>
              <input
                className="op-input"
                placeholder="name@business.com or (555) 014-9912"
                value={r.value}
                onChange={(e) => setRow(r.id, { value: e.target.value })}
              />
            </label>
            <div className="op-field" style={{ marginBottom: 0 }}>
              <span className="op-field-label">Role</span>
              <div className="op-seg">
                {ROLES.map((role) => (
                  <button
                    key={role.key}
                    className={`op-seg-opt${r.role === role.key ? " is-active" : ""}`}
                    onClick={() => setRow(r.id, { role: role.key })}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="op-row-trash"
              aria-label="Remove invite"
              type="button"
              disabled={rows.length === 1}
              onClick={() => removeRow(r.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        className="op-add-another"
        type="button"
        onClick={addRow}
        disabled={!canAdd}
        title={canAdd ? undefined : "Fill in the empty invite above first"}
      >
        <Plus size={16} /> Add another
      </button>

      {/* Cost disclosure — the plan change rides along, spelled out plainly. */}
      {overage && (
        <div className="op-note" role="status" style={{ margin: "0 0 18px" }}>
          <span className="op-note-icon"><Info size={16} /></span>
          <div className="op-note-body">
            Your plan cost will increase to <b>{money(upgraded.perMonth)}/mo</b> from{" "}
            {money(base.perMonth)}/mo with the addition of {extra} extra seat{extra === 1 ? "" : "s"}.
            You can adjust seats anytime in settings.
          </div>
        </div>
      )}

      <button className="op-btn op-btn--primary op-btn--centered" onClick={proceed}>
        Send invites &amp; finish{overage && <> · {money(upgraded.perMonth)}/mo</>}
      </button>

      <button className="op-tertiary" onClick={skip}>
        Skip — I&apos;ll add teammates later
      </button>
    </OperatorShell>
  );
}
