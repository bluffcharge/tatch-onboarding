"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: ReactNode;
  error?: string;
  leadingAdornment?: ReactNode;
  trailingAdornment?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  {
    label,
    helper,
    error,
    leadingAdornment,
    trailingAdornment,
    className = "",
    id,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const hasError = Boolean(error);

  return (
    <div className={"flex w-full flex-col gap-1.5 " + className}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-ink-body"
        >
          {label}
        </label>
      )}
      <div
        className={[
          "flex h-11 w-full items-center gap-2 rounded-[12px] border bg-card px-4 transition-colors duration-fast ease-snap",
          hasError
            ? "border-error"
            : "border-border hover:border-strong focus-within:border-[color:var(--focus-border)]",
          "focus-within:shadow-[var(--focus-ring)]",
        ].join(" ")}
      >
        {leadingAdornment && (
          <span className="flex shrink-0 items-center text-ink-caption">
            {leadingAdornment}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          aria-describedby={helper || error ? helperId : undefined}
          // 16px below md so iOS Safari doesn't zoom the focused input now
          // that pinch-zoom is re-enabled (no maximumScale); desktop keeps
          // the original 14px.
          className="h-full w-full bg-transparent text-[16px] text-ink-title outline-none placeholder:text-ink-disabled md:text-[14px]"
          {...rest}
        />
        {trailingAdornment && (
          <span className="flex shrink-0 items-center text-ink-caption">
            {trailingAdornment}
          </span>
        )}
      </div>
      {(helper || error) && (
        <p
          id={helperId}
          className={
            "text-[12px] " + (hasError ? "text-error" : "text-ink-caption")
          }
        >
          {error || helper}
        </p>
      )}
    </div>
  );
});
