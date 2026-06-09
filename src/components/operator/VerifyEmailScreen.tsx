"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { CodeInput } from "./inputs";
import { useTestMode } from "@/lib/testMode";

/* Step 1, part two — verify the email address before it becomes the login.
   Still "Step 1 of 7" in the rail: proving the address is part of creating
   the login, not a separate milestone. The Google path skips this screen
   entirely (Google has already verified the address). */
export function VerifyEmailScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const email = sp.get("email") || "jane@acmeroofing.com";
  const demoError = sp.get("error") === "1";

  const [code, setCode] = useState(demoError ? "000000" : "");
  const [error, setError] = useState(demoError);
  const [resent, setResent] = useState(false);

  const testMode = useTestMode();
  const complete = code.length === 6;
  const ready = testMode || (complete && !error);

  const verify = () => {
    if (!ready) return;
    router.push(`/operator/account/about?email=${encodeURIComponent(email)}`);
  };

  return (
    <OperatorShell step={1} backHref="/operator/account">
      <h1 className="op-h1">Verify your email.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        We sent a 6-digit code to <b>{email}</b>. Enter it below and you&apos;re
        on your way.
      </p>

      {error && (
        <div className="op-banner op-banner--error" style={{ marginBottom: 22 }}>
          <span className="op-banner-icon"><TriangleAlert size={16} /></span>
          <div className="op-banner-body">
            <div className="op-banner-title">That code didn&apos;t match.</div>
            <p className="op-banner-text">
              Codes expire after 10 minutes. Re-enter it, or resend a fresh one below.
            </p>
          </div>
        </div>
      )}

      <div className="op-field">
        <span className="op-field-label">Verification code</span>
        <CodeInput
          value={code}
          onChange={(c) => { setCode(c); setError(false); }}
          hasError={error}
        />
        <span className="op-field-hint">Prototype: any 6-digit code works.</span>
      </div>

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} disabled={!ready} onClick={verify}>
        Verify &amp; continue
      </button>

      {resent ? (
        <p className="op-meta-line">Code re-sent to {email} — give it a minute, and check spam.</p>
      ) : (
        <button className="op-tertiary" onClick={() => { setResent(true); setError(false); setCode(""); }}>
          Didn&apos;t get it? Resend code
        </button>
      )}
    </OperatorShell>
  );
}
