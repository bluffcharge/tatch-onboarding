"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { GoogleButton } from "./bits";
import { PhoneField, AddressField } from "./inputs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_RE = /[^A-Za-z0-9]/;

/* Step 1 — "About you": the primary account owner. Name, email, phone, your
   address, and password (credentials live here, matching the PM prototype).
   Business details are the separate next step. */
export function CreateAccountScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const demoError = sp.get("error") === "1";
  const viaGoogle = sp.get("via") === "google";

  const [show, setShow] = useState(false);
  const [first, setFirst] = useState(viaGoogle ? "Jane" : "");
  const [last, setLast] = useState(viaGoogle ? "Doe" : "");
  const [email, setEmail] = useState(viaGoogle ? "jane.doe@gmail.com" : demoError ? "jane.acme.com" : "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(demoError ? "letmein" : "");
  const [confirm, setConfirm] = useState(demoError ? "letmein2" : "");
  const [submitted, setSubmitted] = useState(demoError);

  const emailErr = email && !EMAIL_RE.test(email) ? "Enter a valid email address." : "";
  const pwErr =
    password && (password.length < 8 || !SPECIAL_RE.test(password))
      ? "At least 8 characters, with one special character."
      : "";
  const confirmErr = confirm && confirm !== password ? "Passwords don't match." : "";
  const valid =
    !emailErr && !!email && (viaGoogle || (!pwErr && !confirmErr && !!password && !!confirm));
  const showErr = (msg: string) => submitted && !!msg;

  const next = () => {
    setSubmitted(true);
    if (valid) router.push(`/operator/account/business?email=${encodeURIComponent(email)}`);
  };

  return (
    <OperatorShell step={1} backHref="/operator/signin">
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
        <input
          className={`op-input${showErr(emailErr) || (submitted && !email) ? " is-error" : ""}`}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {showErr(emailErr) && <span className="op-field-error">{emailErr}</span>}
      </label>

      <PhoneField
        value={phone}
        onChange={setPhone}
        helper="We'll text you a link to set up the mobile app — so you land on your phone, ready to go."
      />

      <AddressField value={address} onChange={setAddress} label="Your address" helper="Where we can reach you." />

      {!viaGoogle && (
        <>
          <label className="op-field">
            <span className="op-field-label">Password</span>
            <span className="op-input-wrap">
              <input
                className={`op-input${showErr(pwErr) ? " is-error" : ""}`}
                type={show ? "text" : "password"}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="op-input-affix" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
            {showErr(pwErr) ? (
              <span className="op-field-error">{pwErr}</span>
            ) : (
              <span className="op-field-hint">Must be at least 8 characters with one special character.</span>
            )}
          </label>

          <label className="op-field">
            <span className="op-field-label">Confirm password</span>
            <input
              className={`op-input${showErr(confirmErr) ? " is-error" : ""}`}
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {showErr(confirmErr) && <span className="op-field-error">{confirmErr}</span>}
          </label>
        </>
      )}

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={next}>
        Continue
      </button>

      {!viaGoogle && (
        <>
          <div className="op-or">or</div>
          <GoogleButton onClick={() => router.push("/operator/account?via=google")} />
        </>
      )}

      <p className="op-legal">
        By signing up you agree to our <a className="op-link" href="#privacy">Privacy Policy</a> and{" "}
        <a className="op-link" href="#terms">Terms of Service</a>.
      </p>
      <p className="op-meta-line" style={{ marginTop: 12 }}>
        Already have an account?{" "}
        <button className="op-link" onClick={() => router.push("/operator/signin")} style={{ background: "none", border: 0, cursor: "pointer" }}>
          Sign in
        </button>
      </p>
    </OperatorShell>
  );
}
