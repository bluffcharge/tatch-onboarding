"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatorShell } from "./OperatorShell";
import { PhoneField, AddressField } from "./inputs";

/* Step 2 — "About you": the primary account owner's profile. Credentials
   were captured on step 1; the Google path lands here with the name
   pre-filled (?via=google). */
export function AboutYouScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const viaGoogle = sp.get("via") === "google";
  const email = sp.get("email") || (viaGoogle ? "jane.doe@gmail.com" : "jane@acmeroofing.com");

  const [first, setFirst] = useState(viaGoogle ? "Jane" : "");
  const [last, setLast] = useState(viaGoogle ? "Doe" : "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const next = () =>
    router.push(`/operator/account/business${email ? `?email=${encodeURIComponent(email)}` : ""}`);

  return (
    <OperatorShell step={2} backHref="/operator/account">
      <h1 className="op-h1">About you.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        {viaGoogle
          ? "We pulled what we could from Google — fill in the rest."
          : "Tell us a bit about yourself — the primary account owner."}
      </p>

      <div className="op-row">
        <label className="op-field">
          <span className="op-field-label">First name</span>
          <input className="op-input" placeholder="Jane" autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} />
        </label>
        <label className="op-field">
          <span className="op-field-label">Last name</span>
          <input className="op-input" placeholder="Doe" autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} />
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
        helper="We'll text you a link to set up the mobile app — so you land on your phone, ready to go."
      />

      <AddressField value={address} onChange={setAddress} label="Your address" helper="Where we can reach you." />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={next}>
        Continue
      </button>
    </OperatorShell>
  );
}
