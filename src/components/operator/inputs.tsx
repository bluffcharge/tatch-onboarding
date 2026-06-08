"use client";

import { useState } from "react";
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
