"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatorShell } from "./OperatorShell";
import { PhoneField, AddressField } from "./inputs";

/* Create account · step 2 — YOUR details (the person setting up the account):
   name, email, phone, address. Business info is collected on the next step. */
export function CreateAccountDetailsScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const viaGoogle = sp.get("via") === "google";
  const seedEmail = viaGoogle ? "jane.doe@gmail.com" : sp.get("email") || "jane@acme.com";

  const [first, setFirst] = useState(viaGoogle ? "Jane" : "");
  const [last, setLast] = useState(viaGoogle ? "Doe" : "");
  const [email, setEmail] = useState(seedEmail);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const next = () => router.push(`/operator/account/business?email=${encodeURIComponent(email)}`);

  return (
    <OperatorShell step={1} backHref="/operator/account">
      <h1 className="op-h1">Your details.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        {viaGoogle
          ? "We pulled what we could from Google — fill in the rest."
          : "How we'll reach you and set up your account."}
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
        <input className="op-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <PhoneField
        value={phone}
        onChange={setPhone}
        helper="We'll text you a link to set up the mobile app — so you land on your phone, ready to go."
      />

      <AddressField
        value={address}
        onChange={setAddress}
        label="Address"
        helper="Where we can reach you."
      />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={next}>
        Continue
      </button>
    </OperatorShell>
  );
}
