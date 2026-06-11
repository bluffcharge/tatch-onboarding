"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PartnerShell } from "./PartnerShell";

/* Step 5 — invite teammates. Optional; phone-or-email rows with an optional
   role per row (PRD Story 2). Each row validates on its own and the exact
   PRD messages render UNDER the offending row — Send never redirects while
   any filled row is invalid (Flow 2 step 4). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Prototype stand-ins for the server-side duplicate check — these two
   values simulate contacts already registered on Tatch. */
const TAKEN_EMAIL = "jordan@northwindroofing.com";
const TAKEN_PHONE = "5550142207";

const ROLES = ["Admin", "Manager", "Member"] as const;
type Role = (typeof ROLES)[number];

type RowT = { id: number; value: string; role: Role };

/** PRD-exact validation messages, or null when the row is fine/empty.
 *  Anything containing a letter or @ is judged as an email attempt
 *  ("jane.acme.com" should fail as an email, not as a phone number);
 *  digit-and-punctuation entries are judged as phone numbers. */
function rowError(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/[A-Za-z@]/.test(t)) {
    if (!EMAIL_RE.test(t)) return "Please enter a valid email address";
    if (t.toLowerCase() === TAKEN_EMAIL) return "This email is already associated with an existing account";
    return null;
  }
  const digits = t.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return "Please enter a valid phone number";
  if (digits === TAKEN_PHONE) return "This phone number is already associated with an existing account";
  return null;
}

export function InviteTeamScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<RowT[]>([
    { id: 1, value: "", role: "Member" },
    { id: 2, value: "", role: "Member" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const filled = rows.filter((r) => r.value.trim().length > 0);
  const hasErrors = filled.some((r) => rowError(r.value) !== null);

  const setRow = (id: number, patch: Partial<RowT>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeRow = (id: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  const addRow = () => {
    setRows((rs) => [...rs, { id: nextId, value: "", role: "Member" }]);
    setNextId((n) => n + 1);
  };

  const skip = () => router.push("/partner/activating?invites=0");

  const send = () => {
    if (filled.length === 0 || sent) return;
    setSubmitted(true);
    if (hasErrors) return; // surface per-row messages; do NOT redirect
    // All rows valid — show the PRD success line under each sent row for a
    // beat, then move to the activation transition.
    setSent(true);
    setTimeout(() => router.push(`/partner/activating?invites=${filled.length}`), 1300);
  };

  return (
    // `wide` — the input + 3-role segment + trash row needs the 860 measure
    // (same as the operator flow's invite-team); 440 truncates the email.
    <PartnerShell step={5} wide backHref="/partner/questions">
      <h1 className="op-h1">Invite your team.</h1>
      <p className="op-sub" style={{ marginBottom: 26 }}>
        Teammates get a text or email with a link to the Tatch app. Optional —
        you can always add people later from settings.
      </p>

      <div className="op-invites">
        {rows.map((row, i) => {
          const err = submitted && !sent ? rowError(row.value) : null;
          const ok = sent && row.value.trim().length > 0;
          return (
            <div key={row.id}>
              <div className="op-invite-row">
                <label className="op-field" style={{ marginBottom: 0 }}>
                  <span className="op-field-label">Teammate {i + 1}</span>
                  <input
                    className={`op-input${err ? " is-error" : ""}`}
                    placeholder="Phone or email"
                    autoComplete="off"
                    value={row.value}
                    disabled={sent}
                    onChange={(e) => setRow(row.id, { value: e.target.value })}
                  />
                </label>
                <div className="op-field" style={{ marginBottom: 0 }}>
                  <span className="op-field-label">
                    Role <span style={{ color: "var(--op-faint)", fontWeight: 500 }}>· optional</span>
                  </span>
                  <div className="op-seg" role="radiogroup" aria-label={`Role for teammate ${i + 1}`}>
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        role="radio"
                        aria-checked={row.role === role}
                        className={`op-seg-opt${row.role === role ? " is-active" : ""}`}
                        disabled={sent}
                        onClick={() => setRow(row.id, { role })}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="op-row-trash"
                  aria-label={`Remove teammate ${i + 1}`}
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1 || sent}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {/* PRD: the validation / success message renders under the row
                  it belongs to. */}
              {err && (
                <p role="alert" className="op-row-msg is-error">{err}</p>
              )}
              {ok && (
                <p role="status" className="op-row-msg is-ok">
                  Your team member will receive an invitation shortly
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="op-add-another" onClick={addRow} disabled={sent}>
        <Plus size={15} strokeWidth={2.5} /> Add another
      </button>

      <button
        className="op-btn op-btn--primary"
        disabled={filled.length === 0 || sent}
        onClick={send}
      >
        {sent
          ? "Sending invites…"
          : `Send ${filled.length > 0 ? `${filled.length} ` : ""}invite${filled.length === 1 ? "" : "s"} & continue`}
      </button>
      <button className="op-tertiary" onClick={skip} disabled={sent}>
        Skip for now
      </button>

      <p className="op-legal" style={{ marginTop: 14 }}>
        Prototype: {TAKEN_EMAIL} or (555) 014-2207 simulate an already-registered contact.
      </p>
    </PartnerShell>
  );
}
