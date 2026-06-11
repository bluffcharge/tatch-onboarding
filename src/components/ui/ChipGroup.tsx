"use client";

import { Check } from "lucide-react";

type Option = { value: string; label: string };

type SingleProps = {
  mode: "single";
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  ariaLabel?: string;
};

type MultiProps = {
  mode: "multi";
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  ariaLabel?: string;
};

type Props = SingleProps | MultiProps;

export function ChipGroup(props: Props) {
  const isMulti = props.mode === "multi";
  return (
    <div
      role={isMulti ? "group" : "radiogroup"}
      aria-label={props.ariaLabel}
      className="flex flex-wrap gap-2"
    >
      {props.options.map((o) => {
        const selected = isMulti
          ? props.value.includes(o.value)
          : props.value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            role={isMulti ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => {
              if (isMulti) {
                const next = selected
                  ? props.value.filter((v) => v !== o.value)
                  : [...props.value, o.value];
                props.onChange(next);
              } else {
                props.onChange(o.value);
              }
            }}
            className={[
              "inline-flex h-9 items-center gap-1.5 rounded-pill border px-3.5 text-[13px] font-medium",
              "transition-colors duration-fast ease-snap",
              selected
                ? "border-royal-400 bg-royal-50 text-royal-700 dark:bg-royal-900 dark:text-white"
                : "border-border bg-card text-ink-body hover:border-border-strong hover:bg-subtle",
            ].join(" ")}
          >
            {selected && <Check size={13} strokeWidth={2.25} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
