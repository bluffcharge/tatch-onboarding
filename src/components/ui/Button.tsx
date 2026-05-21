"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-fast ease-snap disabled:opacity-40 disabled:cursor-not-allowed " +
  "select-none whitespace-nowrap";

const sizes: Record<Size, string> = {
  sm: "h-9  px-4  text-[13px]",
  md: "h-11 px-5  text-[14px]",
  lg: "h-12 px-6  text-[15px]",
};

// Primary CTAs use pill geometry to match the design.md Save button. Other
// variants stay rectangular so they read as supporting actions.
const variants: Record<Variant, string> = {
  primary:
    "rounded-pill bg-[color:var(--btn-ink-bg)] text-[color:var(--btn-ink-fg)] shadow-sm " +
    "hover:bg-[color:var(--btn-ink-bg-hover)] active:bg-[color:var(--btn-ink-bg-active)]",
  // Brand-violet variant — reserve for moments where the brand color is
  // the right tool (rare). Default to `primary` (ink) for CTAs.
  accent:
    "rounded-pill bg-royal-400 text-white shadow-sm " +
    "hover:bg-royal-500 active:bg-royal-600",
  secondary:
    "rounded-[12px] bg-card text-ink border border-border " +
    "hover:bg-subtle active:bg-subtle",
  ghost:
    "rounded-[12px] bg-transparent text-ink-body hover:bg-subtle",
  danger:
    "rounded-pill bg-error text-white hover:opacity-90",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth,
    leadingIcon,
    trailingIcon,
    loading,
    className = "",
    children,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? "button"}
      disabled={disabled || loading}
      className={[
        base,
        sizes[size],
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        leadingIcon
      )}
      <span>{children}</span>
      {!loading && trailingIcon}
    </button>
  );
});
