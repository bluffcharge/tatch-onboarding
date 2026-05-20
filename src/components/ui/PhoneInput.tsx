"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { AsYouType, type CountryCode } from "libphonenumber-js";
import { TextField } from "./TextField";

type Props = {
  label?: string;
  defaultValue?: string;
  onChange?: (value: string, isValid: boolean) => void;
  country?: CountryCode;
  helper?: string;
  error?: string;
  autoFocus?: boolean;
};

/**
 * Lightweight phone input: country prefix on the left, formatted national
 * number on the right. For the prototype we hold the country fixed to US
 * but expose it on props so swapping in a country selector later is easy.
 */
export function PhoneInput({
  label = "Mobile number",
  defaultValue = "",
  onChange,
  country = "US",
  helper,
  error,
  autoFocus,
}: Props) {
  // The country chip already shows "+1", so strip the leading country prefix
  // from any pre-filled value before formatting.
  const seed = defaultValue.replace(/^\s*\+?1[\s\-.]?/, "");
  const initial = seed ? new AsYouType(country).input(seed) : "";
  const [value, setValue] = useState(initial);

  // Emit initial validity once on mount so a pre-filled value enables the CTA.
  useEffect(() => {
    if (!initial) return;
    const digits = initial.replace(/\D/g, "");
    onChange?.(initial, digits.length >= 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = new AsYouType(country).input(e.target.value);
    setValue(next);
    const digits = next.replace(/\D/g, "");
    onChange?.(next, digits.length >= 10);
  }

  return (
    <TextField
      label={label}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="(555) 014-2207"
      value={value}
      onChange={handleChange}
      autoFocus={autoFocus}
      helper={helper}
      error={error}
      leadingAdornment={
        <span className="select-none rounded-sm bg-subtle px-2 py-1 text-[12.5px] font-semibold text-ink-body">
          +1
        </span>
      }
    />
  );
}
