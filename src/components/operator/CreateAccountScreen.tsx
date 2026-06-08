"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { GoogleButton } from "./bits";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_RE = /[^A-Za-z0-9]/;

/* Step 1 of the create-account flow — just credentials. Profile details
   (name, company, phone, address) are collected on step 2. */
export function CreateAccountScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const demoError = sp.get("error") === "1";

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(demoError ? "jane.acme.com" : "");
  const [password, setPassword] = useState(demoError ? "letmein" : "");
  const [submitted, setSubmitted] = useState(demoError);

  const emailErr = email && !EMAIL_RE.test(email) ? "Enter a valid email address." : "";
  const pwErr =
    password && (password.length < 8 || !SPECIAL_RE.test(password))
      ? "At least 8 characters, with one special character."
      : "";
  const valid = !emailErr && !pwErr && !!email && !!password;
  const showErr = (msg: string) => submitted && !!msg;

  const next = () => {
    setSubmitted(true);
    if (valid) router.push(`/operator/account/profile?email=${encodeURIComponent(email)}`);
  };

  return (
    <OperatorShell step={1} backHref="/operator/signin">
      <h1 className="op-h1">Create your account.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        Start with your work email — we&apos;ll grab the rest in a second.
      </p>

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
          <button
            type="button"
            className="op-input-affix"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
        {showErr(pwErr) ? (
          <span className="op-field-error">{pwErr}</span>
        ) : (
          <span className="op-field-hint">Must be at least 8 characters with one special character.</span>
        )}
      </label>

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={next}>
        Continue
      </button>

      <div className="op-or">or</div>
      <GoogleButton onClick={() => router.push("/operator/account/profile?via=google")} />

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
