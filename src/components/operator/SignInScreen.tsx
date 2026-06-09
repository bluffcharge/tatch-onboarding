"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, TriangleAlert, Mail, ArrowLeft } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { GoogleButton } from "./bits";

const DASHBOARD = "https://tatch-half-mvp.vercel.app";
// Magic-link sign-in is parked for now — flip to true to bring it back.
const SHOW_MAGIC_LINK = false;

export function SignInScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const demoError = sp.get("error") === "1";
  const demoMagic = sp.get("magic") === "1";

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(demoError || demoMagic ? "jane@acme.com" : "");
  const [password, setPassword] = useState(demoError ? "••••••••" : "");
  const [error, setError] = useState(demoError);
  const [forgot, setForgot] = useState(false);
  const [magicSent, setMagicSent] = useState(demoMagic);

  const signIn = () => {
    if (!email || !password) { setError(true); return; }
    window.top!.location.href = DASHBOARD;
  };

  if (SHOW_MAGIC_LINK && magicSent) {
    return (
      <OperatorShell variant="center">
        <div className="op-terminal">
          <span className="op-mail-badge" aria-hidden="true"><Mail size={26} /></span>
          <h1 className="op-h1">Check your inbox.</h1>
          <p className="op-sub">
            We sent a sign-in link to <b>{email || "your email"}</b>. Click it and you&apos;re in — no password needed.
          </p>
          <button className="op-tertiary" onClick={() => setMagicSent(false)} style={{ marginTop: 18 }}>
            <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
            Back to sign in
          </button>
        </div>
      </OperatorShell>
    );
  }

  return (
    <OperatorShell variant="center">
      <h1 className="op-h1">Sign in to Tatch.</h1>
      <p className="op-sub" style={{ marginBottom: 24 }}>
        Enter your credentials to access your account.
      </p>

      {error && (
        <div className="op-banner op-banner--error" style={{ marginBottom: 18 }}>
          <span className="op-banner-icon"><TriangleAlert size={16} /></span>
          <div className="op-banner-body">
            <div className="op-banner-title">We couldn&apos;t sign you in.</div>
            <p className="op-banner-text">That email and password don&apos;t match an account. Check them and try again.</p>
          </div>
        </div>
      )}

      <label className="op-field">
        <span className="op-field-label">Email</span>
        <input
          className={`op-input${error ? " is-error" : ""}`}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(false); }}
        />
      </label>

      <label className="op-field" style={{ marginBottom: 10 }}>
        <span className="op-field-label">Password</span>
        <span className="op-input-wrap">
          <input
            className={`op-input${error ? " is-error" : ""}`}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
          />
          <button type="button" className="op-input-affix" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>

      <div className="op-inline-row">
        <label className="op-check">
          <input type="checkbox" />
          <span className="op-check-box"><CheckTiny /></span>
          Remember me
        </label>
        <button className="op-link" style={{ background: "none", border: 0, cursor: "pointer", fontSize: 13.5 }} onClick={() => setForgot((f) => !f)}>
          Forgot password?
        </button>
      </div>

      {forgot && (
        <div className="op-note" style={{ marginBottom: 18 }}>
          <span className="op-note-body">
            Password reset is coming soon. For now, contact your Tatch rep and we&apos;ll get you back in.
          </span>
        </div>
      )}

      <button className="op-btn op-btn--primary" onClick={signIn}>Sign in</button>

      <div className="op-or">or</div>
      <GoogleButton onClick={() => { window.top!.location.href = DASHBOARD; }} />

      {SHOW_MAGIC_LINK && (
        <button className="op-btn op-btn--secondary" style={{ marginTop: 10 }} onClick={() => setMagicSent(true)}>
          <Mail size={16} /> Email me a sign-in link
        </button>
      )}

      <p className="op-meta-line">
        Don&apos;t have an account?{" "}
        <button className="op-link" onClick={() => router.push("/operator/account")} style={{ background: "none", border: 0, cursor: "pointer" }}>
          Sign up
        </button>
      </p>
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
