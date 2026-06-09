"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Users, Plus, Trash2, TriangleAlert, Check } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { SEAT_FEE, buildQuery, money, readWizard } from "./wizardParams";

type Invite = { id: number; value: string; role: "member" | "admin" };

const SAMPLE = ["maria@acmeroofing.com", "devon@acmeroofing.com", "priya@acmeroofing.com", "sam@acmeroofing.com", "lee@acmeroofing.com"];

let _id = 100;
const newRow = (value = "", role: "member" | "admin" = "member"): Invite => ({ id: _id++, value, role });

export function InviteTeamScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const seed = readWizard(sp);
  const planSeats = seed.seats;

  // Seed pre-filled invite rows from ?invites=N (deep-link into the overage state).
  const [rows, setRows] = useState<Invite[]>(() => {
    const n = Math.min(seed.invites, SAMPLE.length);
    if (n > 0) return Array.from({ length: n }, (_, i) => newRow(SAMPLE[i], i === 0 ? "admin" : "member"));
    return [newRow()];
  });
  const [confirmed, setConfirmed] = useState(false);

  const filled = useMemo(() => rows.filter((r) => r.value.trim().length > 0).length, [rows]);
  const totalUsers = 1 + filled; // including you
  const overage = totalUsers > planSeats;
  const billedSeats = overage && confirmed ? totalUsers : planSeats;
  const extra = Math.max(0, totalUsers - planSeats);
  const blocked = overage && !confirmed; // FR7: Continue disabled until resolved

  const setRow = (id: number, patch: Partial<Invite>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, newRow()]);
  const removeRow = (id: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  // FR9: trim filled invites back to fit the plan seats (leave you + room).
  const removeExtras = () => {
    setConfirmed(false);
    setRows((rs) => {
      let keptFilled = 0;
      const cap = planSeats - 1; // teammate seats available
      const out: Invite[] = [];
      for (const r of rs) {
        const isFilled = r.value.trim().length > 0;
        if (isFilled) {
          if (keptFilled < cap) { out.push(r); keptFilled++; }
        } else {
          out.push(r);
        }
      }
      return out.length ? out : [newRow()];
    });
  };

  // Post-payment step: finishing (or skipping) goes straight to activation.
  const proceed = () => {
    if (blocked) return;
    router.push(`/operator/activating${buildQuery({ invites: filled })}`);
  };
  const skip = () => router.push("/operator/activating");

  const query = buildQuery({ branches: seed.branches, seats: planSeats, billing: seed.billing });

  return (
    <OperatorShell step={6} backHref={`/operator/payment${query}`} query={query} roomy>
      <h1 className="op-h1">Invite your team.</h1>
      <p className="op-sub" style={{ marginBottom: 26 }}>
        Add anyone who&apos;ll be managing referrals or operating this account. They&apos;ll get an email
        to set up their own login.
      </p>

      {/* License badge — reflects plan seats, upgrades on confirm (US4 FR1) */}
      <div className={`op-seat${blocked ? " is-warn" : ""}`}>
        <div className="op-seat-head">
          <span className="op-seat-icon"><Users size={18} /></span>
          <span>
            <div className="op-seat-title">
              {billedSeats} operator seat{billedSeats === 1 ? "" : "s"} included
              {confirmed && extra > 0 && (
                <span className="op-seat-chip">+{extra} · {money(extra * SEAT_FEE)}/mo</span>
              )}
            </div>
            <div className="op-seat-sub">
              1 for you · {Math.max(0, billedSeats - 1)} for teammate{billedSeats - 1 === 1 ? "" : "s"} · {money(SEAT_FEE)}/user/mo
            </div>
          </span>
        </div>
        <div className="op-seat-track">
          <div
            className={`op-seat-fill${blocked ? " is-warn" : ""}`}
            style={{ width: `${Math.min(100, (totalUsers / Math.max(billedSeats, totalUsers)) * 100)}%` }}
          />
        </div>
        <div className="op-seat-meta">
          {totalUsers} of {billedSeats} seat{billedSeats === 1 ? "" : "s"} used (including you)
        </div>
      </div>

      {/* Over-seat warning (US4 FR4) → Confirm upgrade / Remove extras */}
      {blocked && (
        <div className="op-banner op-banner--warn">
          <span className="op-banner-icon"><TriangleAlert size={17} /></span>
          <div className="op-banner-body">
            <div className="op-banner-title">
              You&apos;ve invited {filled} teammate{filled === 1 ? "" : "s"} — that needs {totalUsers} seats.
            </div>
            <p className="op-banner-text">
              That&apos;s {extra} more than your plan. Seats will increase to {money(totalUsers * SEAT_FEE)}/mo
              ({extra > 0 ? `+${money(extra * SEAT_FEE)}` : ""}). Confirm to continue, or trim back to {planSeats}.
            </p>
            <div className="op-banner-actions">
              <button className="op-btn op-btn--primary op-btn--inline" onClick={() => setConfirmed(true)}>
                Confirm upgrade
              </button>
              <button className="op-btn op-btn--secondary op-btn--inline" onClick={removeExtras}>
                Remove extras
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed upgrade (US4 FR5) */}
      {overage && confirmed && (
        <div className="op-banner op-banner--ok">
          <span className="op-banner-icon"><Check size={17} strokeWidth={3} /></span>
          <div className="op-banner-body">
            <div className="op-banner-title">
              Upgraded to {totalUsers} seats — {money(totalUsers * SEAT_FEE)}/mo.
            </div>
            <p className="op-banner-text">
              {extra} extra seat{extra === 1 ? "" : "s"} added to your plan. You can change this anytime in settings.
            </p>
          </div>
        </div>
      )}

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
                onChange={(e) => { setRow(r.id, { value: e.target.value }); setConfirmed(false); }}
              />
            </label>
            <div className="op-field" style={{ marginBottom: 0 }}>
              <span className="op-field-label">Role</span>
              <div className="op-seg">
                <button className={`op-seg-opt${r.role === "member" ? " is-active" : ""}`} onClick={() => setRow(r.id, { role: "member" })}>Member</button>
                <button className={`op-seg-opt${r.role === "admin" ? " is-active" : ""}`} onClick={() => setRow(r.id, { role: "admin" })}>Admin</button>
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

      <button className="op-add-another" type="button" onClick={addRow}>
        <Plus size={16} /> Add another
      </button>

      <button className="op-btn op-btn--primary" disabled={blocked} onClick={proceed}>
        Send invites &amp; finish
      </button>

      <button className="op-tertiary" onClick={skip}>
        Skip — I&apos;ll add teammates later
      </button>
    </OperatorShell>
  );
}
