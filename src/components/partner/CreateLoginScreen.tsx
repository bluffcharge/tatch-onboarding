"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PartnerShell } from "./PartnerShell";
import { GoogleButton } from "./bits";
import { useInvite } from "@/lib/useInvite";
import { useTestMode } from "@/lib/testMode";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_RE = /[^A-Za-z0-9]/;

/* Step 1 — "Create login": just the credentials, mirroring the operator
   signup. Google sits ABOVE the email fields (one-click path first). The
   invite chip keeps the operator context in view while the partner commits
   real credentials. Profile details move to step 2. */
export function CreateLoginScreen() {
  const router = useRouter();
  const invite = useInvite();

  const invitedEmail =
    invite.prefill?.email ??
    (invite.invitedRecipient?.kind === "email" ? invite.invitedRecipient.value : "");

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(invitedEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailErr = email && !EMAIL_RE.test(email) ? "Enter a valid email address." : "";
  const pwErr =
    password && (password.length < 8 || !SPECIAL_RE.test(password))
      ? "At least 8 characters, with one special character."
      : "";
  const confirmErr =
    confirm && confirm !== password
      ? "Passwords don't match."
      : submitted && password && !confirm
        ? "Re-enter your password to confirm."
        : "";
  const valid = !emailErr && !!email && !pwErr && !confirmErr && !!password && !!confirm;
  const showErr = (msg: string) => submitted && !!msg;

  // Confirm-password stays hidden until they start typing a password — the
  // shorter initial card keeps the CTA + legal line above the fold. It also
  // stays visible while it still holds text, so clearing the password
  // mid-edit doesn't vanish a field they're using.
  const confirmRevealed = password.length > 0 || confirm.length > 0;

  const testMode = useTestMode();

  // Email logins verify the address next; Google arrivals skip straight to
  // the profile step (the address is already verified).
  const next = () => {
    if (testMode) {
      router.push(`/partner/account/verify${email ? `?email=${encodeURIComponent(email)}` : ""}`);
      return;
    }
    setSubmitted(true);
    if (valid) router.push(`/partner/account/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <PartnerShell step={1} backHref="/j/abc123">
      <div className="op-invite-chip">
        <span className="op-invite-avatar" aria-hidden="true">
          {invite.inviter.firstName[0]}
        </span>
        <span>
          Joining <b>{invite.operator.name}</b> · invited by {invite.inviter.fullName}
        </span>
      </div>

      <h1 className="op-h1">Create your login.</h1>
      <p className="op-sub" style={{ marginBottom: 24 }}>
        Sign up with Google, or use your email and a password.
      </p>

      <GoogleButton onClick={() => router.push("/partner/account/about?via=google")} />

      <div className="op-or">or continue with email</div>

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
        {showErr(emailErr) ? (
          <span className="op-field-error">{emailErr}</span>
        ) : (
          invitedEmail && email === invitedEmail && (
            <span className="op-field-hint">Pre-filled from your invite — edit if you&apos;d rather use another address.</span>
          )
        )}
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

      {confirmRevealed && (
        <label className="op-field op-reveal">
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
      )}

      <button className="op-btn op-btn--primary" style={{ marginTop: 6 }} onClick={next}>
        Continue
      </button>

      <p className="op-legal">
        By signing up you agree to our <a className="op-link" href="#privacy">Privacy Policy</a> and{" "}
        <a className="op-link" href="#terms">Terms of Service</a>.
      </p>

      {/* Alternative entry point (PRD Story 6): partners without a working
          invite link can connect via a Company or BDM code. */}
      <p className="op-meta-line">
        No invite link?{" "}
        <button
          type="button"
          className="op-link"
          style={{ background: "none", border: 0, cursor: "pointer" }}
          onClick={() => router.push("/join")}
        >
          Sign up with Code
        </button>
      </p>
    </PartnerShell>
  );
}
