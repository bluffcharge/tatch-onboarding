"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatorShell } from "./OperatorShell";
import { PhoneField, AddressField } from "./inputs";

const COMMON_DOMAINS = ["gmail", "outlook", "yahoo", "hotmail", "icloud", "proton", "me"];

/** Smart-default the business name from a work-email domain (acme.com → Acme). */
function bizFromEmail(email: string): string {
  const root = (email.split("@")[1] || "").split(".")[0] || "";
  if (!root || COMMON_DOMAINS.includes(root.toLowerCase())) return "";
  return root.charAt(0).toUpperCase() + root.slice(1);
}

/* Step 3 — "Your business": the company. Business name, business phone,
   business address (distinct from the owner's phone/address on step 2). */
export function CreateAccountBusinessScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const email = sp.get("email") || "jane@acme.com";

  const [name, setName] = useState(bizFromEmail(email));
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <OperatorShell step={3} backHref="/operator/account/about">
      <h1 className="op-h1">Your business.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        Tell us about your company so we can set up your account.
      </p>

      <label className="op-field">
        <span className="op-field-label">Business name</span>
        <input className="op-input" placeholder="Acme Roofing" autoComplete="organization" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <PhoneField value={phone} onChange={setPhone} label="Business phone" helper="Your main business line." />

      <AddressField value={address} onChange={setAddress} label="Business address" helper="Your primary business location." />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={() => router.push("/operator/plan")}>
        Continue
      </button>
    </OperatorShell>
  );
}
