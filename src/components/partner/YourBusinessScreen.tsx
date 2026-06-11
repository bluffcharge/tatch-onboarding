"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Building2, Check, MapPin, Users } from "lucide-react";
import { PartnerShell } from "./PartnerShell";
import { PhoneField, AddressField } from "./inputs";
import { useInvite } from "@/lib/useInvite";
import { useTestMode } from "@/lib/testMode";

const COMMON_DOMAINS = ["gmail", "outlook", "yahoo", "hotmail", "icloud", "proton", "me"];

/** Smart-default the business name from a work-email domain (acme.com → Acme). */
function bizFromEmail(email: string): string {
  const root = (email.split("@")[1] || "").split(".")[0] || "";
  if (!root || COMMON_DOMAINS.includes(root.toLowerCase())) return "";
  return root.charAt(0).toUpperCase() + root.slice(1);
}

/* Step 3 — "Your business": the company. Pre-fills the name the operator
   typed on the invite (fall back to the email domain). When the operator
   linked the invite to an existing company on Tatch (`?co=`), the form is
   replaced by a join confirmation — the invitee rolls up under that record
   instead of creating a new one. */
export function YourBusinessScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const invite = useInvite();
  const email = sp.get("email") || "";

  const [name, setName] = useState(invite.partnerCompany ?? bizFromEmail(email));
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // The default form REQUIRES the details — we may not know the business
  // yet, and downstream matching/records need name + address. (The linked
  // variant below skips this: the record already exists.) Phone optional.
  const testMode = useTestMode();
  const ready = testMode || (name.trim().length > 1 && address.trim().length > 3);

  const next = () => router.push("/partner/questions");

  if (invite.linkedCompany) {
    const co = invite.linkedCompany;
    return (
      <PartnerShell step={3} backHref="/partner/account/about">
        <h1 className="op-h1">You&apos;re joining {co.name}.</h1>
        <p className="op-sub" style={{ marginBottom: 26 }}>
          {invite.operator.name} attached this invite to an existing company on
          Tatch, so there&apos;s nothing to fill in here — your account rolls up
          under {co.name}&apos;s record.
        </p>

        <div className="op-card-tile" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span className="op-seat-icon" aria-hidden="true"><Building2 size={20} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{co.name}</div>
              {co.industry && (
                <div style={{ fontSize: 12, color: "var(--op-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {co.industry}
                </div>
              )}
            </div>
            <span className="op-invite-avatar" title="Verified by operator" aria-label="Verified by operator">
              <Check size={13} strokeWidth={2.5} />
            </span>
          </div>
          <div style={{ borderTop: "1px solid var(--op-line)", marginTop: 14, paddingTop: 14, display: "grid", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "var(--op-muted)" }}>
              <MapPin size={14} /> {co.address.line1}, {co.address.city}, {co.address.state} {co.address.zip}
            </span>
            {typeof co.teammateCount === "number" && (
              <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "var(--op-muted)" }}>
                <Users size={14} /> {co.teammateCount} teammate{co.teammateCount === 1 ? "" : "s"} already on Tatch
              </span>
            )}
          </div>
        </div>

        <p className="op-field-hint" style={{ margin: "14px 0 0" }}>
          Wrong company? Ask {invite.operator.name} to send a fresh invite
          without a company attached and you can set up your own.
        </p>

        <button className="op-btn op-btn--primary" style={{ marginTop: 26 }} onClick={next}>
          Continue
        </button>
      </PartnerShell>
    );
  }

  return (
    <PartnerShell step={3} backHref="/partner/account/about">
      <h1 className="op-h1">Your business.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        We use this to match you to nearby operators and label referrals correctly.
      </p>

      <label className="op-field">
        <span className="op-field-label">Business name</span>
        <input className="op-input" placeholder="Northwind Roofing" autoComplete="organization" value={name} onChange={(e) => setName(e.target.value)} />
        {invite.partnerCompany && name === invite.partnerCompany && (
          <span className="op-field-hint">Pre-filled from your invite — edit if it&apos;s off.</span>
        )}
      </label>

      <PhoneField value={phone} onChange={setPhone} label="Business phone" helper="Your main business line." />

      <AddressField value={address} onChange={setAddress} label="Business address" helper="Your primary business location." />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} disabled={!ready} onClick={next}>
        Continue
      </button>
    </PartnerShell>
  );
}
