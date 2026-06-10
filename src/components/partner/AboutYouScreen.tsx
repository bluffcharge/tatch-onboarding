"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PartnerShell } from "./PartnerShell";
import { PhoneField } from "./inputs";
import { useInvite } from "@/lib/useInvite";
import { mockGoogleProfile } from "@/lib/mockInvite";

/* Step 2 — "About you": the person joining. Credentials were captured on
   step 1; the Google path lands here with the name pre-filled (?via=google),
   the email path arrives verified. Mobile number is the important ask — we
   text the app-download link there so the partner lands on their phone,
   already in-flow. */
export function AboutYouScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const invite = useInvite();
  const viaGoogle = sp.get("via") === "google";

  const email =
    sp.get("email") ||
    (viaGoogle
      ? mockGoogleProfile.email
      : invite.prefill?.email ??
        (invite.invitedRecipient?.kind === "email" ? invite.invitedRecipient.value : ""));

  const [first, setFirst] = useState(
    viaGoogle ? mockGoogleProfile.firstName : invite.prefill?.firstName ?? "",
  );
  const [last, setLast] = useState(
    viaGoogle ? mockGoogleProfile.lastName : invite.prefill?.lastName ?? "",
  );
  const [phone, setPhone] = useState(invite.prefill?.phone ?? "");

  const next = () =>
    router.push(`/partner/account/business${email ? `?email=${encodeURIComponent(email)}` : ""}`);

  return (
    <PartnerShell step={2} backHref="/partner/account">
      <h1 className="op-h1">About you.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        {viaGoogle
          ? "We pulled what we could from Google — fill in the rest."
          : "Tell us a bit about yourself — the person your operator will work with."}
      </p>

      <div className="op-row">
        <label className="op-field">
          <span className="op-field-label">First name</span>
          <input className="op-input" placeholder="Jordan" autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} />
        </label>
        <label className="op-field">
          <span className="op-field-label">Last name</span>
          <input className="op-input" placeholder="Avery" autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} />
        </label>
      </div>

      <label className="op-field">
        <span className="op-field-label">Email</span>
        <input className="op-input is-readonly" value={email} readOnly tabIndex={-1} />
        <span className="op-field-hint">
          {viaGoogle ? "Pulled from your Google account — this is your login email." : "Verified — this is your login email."}
        </span>
      </label>

      <PhoneField
        value={phone}
        onChange={setPhone}
        label="Mobile number"
        helper="We'll text you a link to set up the mobile app — so you land on your phone, ready to go."
      />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={next}>
        Continue
      </button>
    </PartnerShell>
  );
}
