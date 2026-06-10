"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { PartnerShell } from "./PartnerShell";
import { GoogleButton } from "./bits";

/* Returning-partner sign-in — minimal (email/Google only), mirroring the
   operator SignInScreen. Reached from the P1 welcome's "Sign in" link and
   the used-invite edge screen. */
export function SignInScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const demoError = sp.get("error") === "1";

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(demoError ? "jordan@northwindroofing.com" : "");
  const [password, setPassword] = useState(demoError ? "••••••••" : "");
  const [error, setError] = useState(demoError);
  const [forgot, setForgot] = useState(false);

  const signIn = () => {
    if (!email || !password) { setError(true); return; }
    router.push("/partner/done?existing=1");
  };

  return (
    <PartnerShell variant="center">
      <h1 className="op-h1">Sign in to Tatch.</h1>
      <p className="op-sub" style={{ marginBottom: 24 }}>
        Use the email or Google account you signed up with.
      </p>

      <GoogleButton onClick={() => router.push("/partner/done?existing=1")} />

      <div className="op-or">or continue with email</div>

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
            Password reset is coming soon. For now, contact your operator and
            we&apos;ll get you back in.
          </span>
        </div>
      )}

      <button className="op-btn op-btn--primary" onClick={signIn}>Sign in</button>

      <p className="op-meta-line">
        New to Tatch?{" "}
        <button className="op-link" onClick={() => router.push("/j/abc123")} style={{ background: "none", border: 0, cursor: "pointer" }}>
          Open your invite
        </button>
      </p>
    </PartnerShell>
  );
}

function CheckTiny() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
