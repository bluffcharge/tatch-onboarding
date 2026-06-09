"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatorShell } from "./OperatorShell";
import { AddressField } from "./inputs";

const COMMON_DOMAINS = ["gmail", "outlook", "yahoo", "hotmail", "icloud", "proton", "me"];

/** Smart-default the company name from a work-email domain (acme.com → Acme). */
function companyFromEmail(email: string): string {
  const root = (email.split("@")[1] || "").split(".")[0] || "";
  if (!root || COMMON_DOMAINS.includes(root.toLowerCase())) return "";
  return root.charAt(0).toUpperCase() + root.slice(1);
}

/* Create account · step 3 — YOUR business: company name + business address.
   Company pre-fills from the work-email domain captured earlier. */
export function CreateAccountBusinessScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const email = sp.get("email") || "jane@acme.com";

  const [company, setCompany] = useState(companyFromEmail(email));
  const [address, setAddress] = useState("");

  return (
    <OperatorShell step={1} backHref="/operator/account/details">
      <h1 className="op-h1">Your business.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        The company you&apos;re setting up on Tatch Connect.
      </p>

      <label className="op-field">
        <span className="op-field-label">Company name</span>
        <input className="op-input" placeholder="Acme Roofing" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>

      <AddressField
        value={address}
        onChange={setAddress}
        label="Business address"
        helper="Your primary business location."
      />

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={() => router.push("/operator/plan")}>
        Continue
      </button>
    </OperatorShell>
  );
}
