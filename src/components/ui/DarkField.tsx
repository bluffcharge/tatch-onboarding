"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

/* ----------------- Primitives used by the dark ticket frame -----------
   The standalone Tatch TextField is tuned for the light glass surface
   (white-translucent fill, zinc neutrals). When the form lives inside
   the dark ticket frame it needs the inverse recipe: white text, white/15
   border, white/55 on focus, near-transparent fill, mono-uppercase
   labels that echo the ticket's eyebrow + serial language.
   These primitives are inline-style descendants of the back-of-ticket
   code input — same surface treatment, generalized so the rest of the
   onboarding flow can compose forms inside the dark frame.            */

export function DarkFieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
      {children}
    </p>
  );
}

export function DarkFieldHelper({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1.5 text-[11.5px] leading-snug text-white/45">{children}</p>
  );
}

export function DarkFieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 text-[11.5px] leading-snug text-rose-300/90">
      {children}
    </p>
  );
}

export function DarkFieldWrapper({
  children,
  error,
  className = "",
}: {
  children: ReactNode;
  error?: boolean;
  className?: string;
}) {
  const border = error
    ? "border-rose-300/60"
    : "border-white/15 focus-within:border-white/55";
  return (
    <div
      className={`flex h-11 items-center gap-2 rounded-[10px] border bg-white/[0.04] px-3 transition-colors duration-fast ease-snap ${border} ${className}`}
    >
      {children}
    </div>
  );
}

/* High-level DarkTextField. Label + wrapper + input + helper/error all
   in one — matches the API of the light TextField for easy parity. */
type DarkTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: ReactNode;
  error?: string;
  leadingAdornment?: ReactNode;
  trailingAdornment?: ReactNode;
};

export const DarkTextField = forwardRef<HTMLInputElement, DarkTextFieldProps>(
  function DarkTextField(
    { label, helper, error, leadingAdornment, trailingAdornment, className = "", id, ...rest },
    ref
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label htmlFor={inputId}>
            <DarkFieldLabel>{label}</DarkFieldLabel>
          </label>
        )}
        <DarkFieldWrapper error={Boolean(error)}>
          {leadingAdornment && (
            <span className="flex shrink-0 items-center text-white/70">
              {leadingAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error) || undefined}
            className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
            {...rest}
          />
          {trailingAdornment && (
            <span className="flex shrink-0 items-center text-white/70">
              {trailingAdornment}
            </span>
          )}
        </DarkFieldWrapper>
        {error ? (
          <DarkFieldError>{error}</DarkFieldError>
        ) : helper ? (
          <DarkFieldHelper>{helper}</DarkFieldHelper>
        ) : null}
      </div>
    );
  }
);

/* Small "USE PHONE INSTEAD →" tertiary link styled to echo the ticket's
   mono-uppercase voice. */
export function DarkTertiaryLink({
  onClick,
  children,
  type = "button",
}: {
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/55 hover:text-white"
    >
      {children}
    </button>
  );
}

/* "Joining Summit Builders · invited by Sara" badge — dark variant of
   the OperatorContext chip we used on the light AuthScreen. */
export function DarkInviterBadge({
  initial,
  operatorName,
  inviterName,
}: {
  initial: string;
  operatorName: string;
  inviterName: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.04] px-2.5 py-2">
      <span
        aria-hidden="true"
        className="grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-white text-[10px] font-semibold text-[color:var(--grey-950)]"
      >
        {initial}
      </span>
      <p className="text-[11.5px] leading-snug text-white/75">
        Joining{" "}
        <span className="font-semibold text-white">{operatorName}</span>
        <span className="text-white/45"> · invited by {inviterName}</span>
      </p>
    </div>
  );
}
