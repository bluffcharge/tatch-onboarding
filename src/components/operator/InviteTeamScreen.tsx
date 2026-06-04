"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Users, Plus } from "lucide-react";
import { OperatorShell } from "./OperatorShell";

export function InviteTeamScreen() {
  const router = useRouter();
  const [role, setRole] = useState<"member" | "admin">("member");

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
            <div className="op-seat-title">1 operator seat included</div>
            <div className="op-seat-sub">1 for you · $45/user/mo</div>
          </span>
        </div>
        <div className="op-seat-track"><div className="op-seat-fill" style={{ width: "100%" }} /></div>
        <div className="op-seat-meta">1 of 1 seats used (including you)</div>
      </div>

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
