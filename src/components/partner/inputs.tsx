"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { MapPin } from "lucide-react";

/* Roadmap-styled phone + address inputs for the create-account profile step.
   Both are prototype-grade — phone formats client-side, address matches a
   hardcoded suggestion list (looks live, no API spend). */

/** Format a US phone progressively: (555) 014-9912 */
function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function PhoneField({
  value,
  onChange,
  label = "Phone number",
  helper,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  helper?: string;
}) {
  return (
    <label className="op-field">
      <span className="op-field-label">{label}</span>
      <input
        className="op-input"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(555) 014-9912"
        value={value}
        onChange={(e) => onChange(formatPhone(e.target.value))}
      />
      {helper && <span className="op-field-hint">{helper}</span>}
    </label>
  );
}

const ADDRESSES = [
  "2200 W Camelback Rd, Phoenix, AZ 85015",
  "123 Main St, Phoenix, AZ 85001",
  "456 Oak Ave, Tempe, AZ 85281",
  "789 Pine Rd, Scottsdale, AZ 85251",
  "1011 Cedar Ln, Mesa, AZ 85201",
];

export function AddressField({
  value,
  onChange,
  label = "Business address",
  helper,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  helper?: string;
}) {
  const [open, setOpen] = useState(false);
  const matches =
    value.trim().length > 1
      ? ADDRESSES.filter((a) => a.toLowerCase().includes(value.toLowerCase())).slice(0, 4)
      : ADDRESSES.slice(0, 4);
  const showList = open && matches.length > 0 && !ADDRESSES.includes(value);

  return (
    <label className="op-field">
      <span className="op-field-label">{label}</span>
      <span className="op-input-wrap">
        <input
          className="op-input"
          autoComplete="off"
          placeholder="Start typing your address…"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
        />
        <span className="op-input-affix" aria-hidden="true" style={{ pointerEvents: "none" }}>
          <MapPin size={17} />
        </span>
        {showList && (
          <ul className="op-suggest" role="listbox">
            {matches.map((a) => (
              <li key={a}>
                <button
                  type="button"
                  className="op-suggest-row"
                  onMouseDown={(e) => { e.preventDefault(); onChange(a); setOpen(false); }}
                >
                  <MapPin size={14} />
                  <span>{a}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </span>
      {helper && <span className="op-field-hint">{helper}</span>}
    </label>
  );
}

/** Roadmap-styled 6-cell verification-code input. Interaction model ported
    from the DIS onboarding OtpInput (auto-advance, paste, backspace-steps-
    back) but controlled by a single string and dressed in operator tokens. */
export function CodeInput({
  value,
  onChange,
  length = 6,
  hasError = false,
}: {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  hasError?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const commit = (next: string[]) => onChange(next.join("").slice(0, length));

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    commit(next);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="op-otp">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={d}
          aria-label={`Verification code digit ${i + 1} of ${length}`}
          className={hasError ? "is-error" : undefined}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
