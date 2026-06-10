"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PartnerShell } from "./PartnerShell";

/* Step 5 — invite teammates. Optional; phone-or-email rows, no seat math
   (partner accounts aren't seat-billed like operator plans). Each invitee
   gets a text/email with an app-download link. */
export function InviteTeamScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<string[]>(["", ""]);

  const filled = rows.filter((r) => r.trim().length > 2);

  const setRow = (i: number, v: string) =>
    setRows((rs) => rs.map((r, j) => (j === i ? v : r)));
  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : rs));

  const go = (invites: number) => router.push(`/partner/activating?invites=${invites}`);

  return (
    <PartnerShell step={5} backHref="/partner/questions">
      <h1 className="op-h1">Invite your team.</h1>
      <p className="op-sub" style={{ marginBottom: 26 }}>
        Teammates get a text with a link to the Tatch app. Optional — you can
        always add people later from settings.
      </p>

      <div className="op-invites">
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <label className="op-field" style={{ flex: 1, marginBottom: 0 }}>
              <span className="op-field-label">Teammate {i + 1}</span>
              <input
                className="op-input"
                placeholder="Phone or email"
                autoComplete="off"
                value={r}
                onChange={(e) => setRow(i, e.target.value)}
              />
            </label>
            <button
              type="button"
              className="op-row-trash"
              aria-label={`Remove teammate ${i + 1}`}
              onClick={() => removeRow(i)}
              disabled={rows.length <= 1}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="op-add-another" onClick={() => setRows((rs) => [...rs, ""])}>
        <Plus size={15} strokeWidth={2.5} /> Add another
      </button>

      <button
        className="op-btn op-btn--primary"
        disabled={filled.length === 0}
        onClick={() => go(filled.length)}
      >
        Send {filled.length > 0 ? `${filled.length} ` : ""}invite{filled.length === 1 ? "" : "s"} &amp; continue
      </button>
      <button className="op-tertiary" onClick={() => go(0)}>
        Skip for now
      </button>
    </PartnerShell>
  );
}
