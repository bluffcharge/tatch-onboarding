"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";

type Props = {
  length?: number;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
  error?: string;
  helper?: React.ReactNode;
};

/**
 * 6-cell OTP input. Auto-advances on entry, accepts paste, handles backspace
 * to step backward. Announces a sensible label per cell for screen readers.
 */
export function OtpInput({
  length = 6,
  onComplete,
  autoFocus = true,
  error,
  helper,
}: Props) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function setAt(i: number, v: string) {
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (next.every((d) => d !== "") && next.join("").length === length) {
      onComplete?.(next.join(""));
    }
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) {
      setAt(i, "");
      return;
    }
    setAt(i, digit);
    if (i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.padEnd(length, "").split("").slice(0, length);
    while (next.length < length) next.push("");
    setValues(next);
    const lastFilled = Math.min(pasted.length, length - 1);
    refs.current[lastFilled]?.focus();
    if (pasted.length === length) onComplete?.(pasted);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            value={v}
            aria-label={`Verification code digit ${i + 1} of ${length}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            onPaste={handlePaste}
            className={[
              "h-12 w-full max-w-[48px] rounded-[12px] border bg-card text-center text-[18px] font-semibold text-ink-title",
              "transition-colors duration-fast ease-snap",
              "focus:outline-none focus:border-[color:var(--focus-border)] focus:shadow-[var(--focus-ring)]",
              error ? "border-error" : "border-border",
            ].join(" ")}
          />
        ))}
      </div>
      {error && <p className="text-[12px] text-error">{error}</p>}
      {!error && helper && <p className="text-[12px] text-ink-caption">{helper}</p>}
    </div>
  );
}
