"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { GoogleButton } from "./bits";

export function CreateAccountScreen() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <OperatorShell step={1} backHref="/operator/signin">
      <h1 className="op-h1">Create your account.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        Set up your operator account on Tatch.
      </p>

      <div className="op-row">
        <label className="op-field">
          <span className="op-field-label">First name</span>
          <input className="op-input" placeholder="Jane" autoComplete="given-name" />
        </label>
        <label className="op-field">
          <span className="op-field-label">Last name</span>
          <input className="op-input" placeholder="Doe" autoComplete="family-name" />
        </label>
      </div>

      <label className="op-field">
        <span className="op-field-label">Email</span>
        <input className="op-input" type="email" placeholder="you@company.com" autoComplete="email" />
      </label>

      <label className="op-field">
        <span className="op-field-label">Company name</span>
        <input className="op-input" placeholder="Acme Corp" autoComplete="organization" />
      </label>

      <label className="op-field">
        <span className="op-field-label">Password</span>
        <span className="op-input-wrap">
          <input
            className="op-input"
            type={show ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
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
        <span className="op-field-hint">Must be at least 8 characters with one special character.</span>
      </label>

      <label className="op-field">
        <span className="op-field-label">Confirm password</span>
        <input className="op-input" type="password" placeholder="Re-enter password" autoComplete="new-password" />
      </label>

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={() => router.push("/operator/plan")}>
        Create account
      </button>

      <div className="op-or">or</div>
      <GoogleButton onClick={() => router.push("/operator/plan")} />

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
