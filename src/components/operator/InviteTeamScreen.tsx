"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import { OperatorShell } from "./OperatorShell";

const INCLUDED_SEATS = 1;
const SEAT_PRICE = 45;

export function InviteTeamScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const seeded = sp.get("seeded") === "1";
  const [role, setRole] = useState<"member" | "admin">(seeded ? "admin" : "member");

  // seeded → one teammate already invited, pushing usage past the included seat.
  const invited = seeded ? 1 : 0;
  const used = INCLUDED_SEATS + invited; // includes you
  const overage = Math.max(0, used - INCLUDED_SEATS);
  const fill = Math.min(100, (INCLUDED_SEATS / used) * 100);

  return (
    <OperatorShell step={3} backHref="/operator/plan">
      <h1 className="op-h1">Invite your team.</h1>
      <p className="op-sub" style={{ marginBottom: 26 }}>
        Add anyone who&apos;ll be managing referrals or operating this account. They&apos;ll get an email
        to set up their own login.
      </p>

      <div className="op-seat">
        <div className="op-seat-head">
          <span className="op-seat-icon"><Users size={18} /></span>
          <span>
            <div className="op-seat-title">
              {INCLUDED_SEATS} operator seat included
              {overage > 0 && (
                <span className="op-seat-chip">+{overage} seat · ${overage * SEAT_PRICE}/mo</span>
              )}
            </div>
            <div className="op-seat-sub">1 for you · ${SEAT_PRICE}/user/mo</div>
          </span>
        </div>
        <div className="op-seat-track">
          <div className="op-seat-fill" style={{ width: `${fill}%` }} />
        </div>
        <div className="op-seat-meta">
          {used} of {INCLUDED_SEATS} seat{INCLUDED_SEATS === 1 ? "" : "s"} used (including you)
          {overage > 0 && " — extra seats are added to your plan"}
        </div>
      </div>

      {seeded && (
        <div className="op-invitee">
          <span className="op-invitee-avatar">M</span>
          <span className="op-invitee-main">
            <span className="op-invitee-name">maria@acmeroofing.com</span>
            <span className="op-invitee-meta">Invite will be emailed · Admin</span>
          </span>
          <button className="op-invitee-x" aria-label="Remove invitee" type="button"><X size={15} /></button>
        </div>
      )}

      <div className="op-invite-row">
        <label className="op-field" style={{ marginBottom: 0 }}>
          <span className="op-field-label">Phone number or email</span>
          <input className="op-input" placeholder="name@business.com or (555) 014-9912" />
        </label>
        <div className="op-field" style={{ marginBottom: 0 }}>
          <span className="op-field-label">Role</span>
          <div className="op-seg">
            <button className={`op-seg-opt${role === "member" ? " is-active" : ""}`} onClick={() => setRole("member")}>Member</button>
            <button className={`op-seg-opt${role === "admin" ? " is-active" : ""}`} onClick={() => setRole("admin")}>Admin</button>
          </div>
        </div>
      </div>

      <button className="op-add-another" type="button">
        <Plus size={16} /> Add another
      </button>

      <button className="op-btn op-btn--primary" onClick={() => router.push("/operator/payment")}>
        Continue to payment
      </button>

      <button className="op-tertiary" onClick={() => router.push("/operator/payment")}>
        Skip — I&apos;ll add teammates later
      </button>
    </OperatorShell>
  );
}
