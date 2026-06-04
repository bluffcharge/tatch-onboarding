"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { GoogleButton } from "./bits";

export function SignInScreen() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <OperatorShell variant="center">
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h1 className="op-h1">Sign in to Tatch.</h1>
        <p className="op-sub" style={{ marginBottom: 26 }}>
          Enter your credentials to access your account.
        </p>

        <label className="op-field">
          <span className="op-field-label">Email</span>
          <input className="op-input" type="email" placeholder="you@company.com" autoComplete="email" />
        </label>

        <label className="op-field" style={{ marginBottom: 10 }}>
          <span className="op-field-label">Password</span>
          <span className="op-input-wrap">
            <input
              className="op-input"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              autoComplete="current-password"
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
        </label>

        <div className="op-inline-row">
          <label className="op-check">
            <input type="checkbox" />
            <span className="op-check-box">
              <CheckTiny />
            </span>
            Remember me
          </label>
          <a className="op-link" href="#forgot" style={{ fontSize: 13.5 }}>
            Forgot password?
          </a>
        </div>

        <button className="op-btn op-btn--primary" onClick={() => router.push("/operator/account")}>
          Sign in
        </button>

        <div className="op-or">or</div>
        <GoogleButton onClick={() => router.push("/operator/account")} />

        <p className="op-meta-line">
          Don&apos;t have an account?{" "}
          <button className="op-link" onClick={() => router.push("/operator/account")} style={{ background: "none", border: 0, cursor: "pointer" }}>
            Sign up
          </button>
        </p>
      </div>
    </OperatorShell>
  );
}

function CheckTiny() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
