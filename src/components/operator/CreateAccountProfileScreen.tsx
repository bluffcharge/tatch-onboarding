"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatorShell } from "./OperatorShell";
import { PhoneField, AddressField } from "./inputs";

const COMMON_DOMAINS = ["gmail", "outlook", "yahoo", "hotmail", "icloud", "proton", "me"];

/** Smart-default the company name from a work-email domain (acme.com → Acme). */
function companyFromEmail(email: string): string {
  const root = (email.split("@")[1] || "").split(".")[0] || "";
  if (!root || COMMON_DOMAINS.includes(root.toLowerCase())) return "";
  return root.charAt(0).toUpperCase() + root.slice(1);
}

/* Step 2 of the create-account flow — profile + the downstream-critical adds
   (phone, address). Email/company pre-fill from step 1; name pre-fills when
   the operator came in via Google. */
export function CreateAccountProfileScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const viaGoogle = sp.get("via") === "google";
  const seedEmail = viaGoogle ? "jane.doe@gmail.com" : sp.get("email") || "jane@acme.com";

  const [first, setFirst] = useState(viaGoogle ? "Jane" : "");
  const [last, setLast] = useState(viaGoogle ? "Doe" : "");
  const [email, setEmail] = useState(seedEmail);
  const [company, setCompany] = useState(companyFromEmail(seedEmail));
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <OperatorShell step={1} backHref="/operator/account">
      <h1 className="op-h1">A few business details.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        {viaGoogle
          ? "We pulled what we could from Google — fill in the rest."
          : "We'll use these to set up your workspace and reach you."}
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
        <span className="op-field-label">Work email</span>
        <input className="op-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className="op-field">
        <span className="op-field-label">Company name</span>
        <input className="op-input" placeholder="Acme Roofing" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>

      <PhoneField
        value={phone}
        onChange={setPhone}
        helper="We'll text you a link to set up the mobile app — so you land on your phone, ready to go."
      />

      <AddressField
        value={address}
        onChange={setAddress}
        helper="Your primary business location."
      />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={() => router.push("/operator/plan")}>
        Continue
      </button>
    </OperatorShell>
  );
}
