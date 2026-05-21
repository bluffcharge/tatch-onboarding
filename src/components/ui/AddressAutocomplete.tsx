"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { MapPin } from "lucide-react";

/**
 * Prototype address autocomplete — looks live, no API spend.
 * Matches the typed prefix against a hardcoded suggestion list. In
 * production this swaps to a Google Places (or HERE / Mapbox) backend
 * without changing the consumer API.
 */

export type StructuredAddress = {
  line1: string;
  city: string;
  state: string;
  zip: string;
};

type Suggestion = StructuredAddress & {
  /** Single-line display string for the suggestion row. */
  display: string;
};

const SUGGESTIONS: Suggestion[] = [
  { line1: "123 Main St",        city: "Phoenix",    state: "AZ", zip: "85001", display: "123 Main St, Phoenix, AZ 85001" },
  { line1: "456 Oak Ave",        city: "Tempe",      state: "AZ", zip: "85281", display: "456 Oak Ave, Tempe, AZ 85281"   },
  { line1: "789 Pine Rd",        city: "Scottsdale", state: "AZ", zip: "85251", display: "789 Pine Rd, Scottsdale, AZ 85251" },
  { line1: "1011 Cedar Ln",      city: "Mesa",       state: "AZ", zip: "85201", display: "1011 Cedar Ln, Mesa, AZ 85201"  },
  { line1: "2200 W Camelback Rd", city: "Phoenix",   state: "AZ", zip: "85015", display: "2200 W Camelback Rd, Phoenix, AZ 85015" },
];

type Props = {
  label?: string;
  helper?: string;
  value: string;
  onTextChange: (v: string) => void;
  /** Fires when a suggestion is picked. Use this to lock the structured
   *  fields underneath. */
  onSelect: (addr: StructuredAddress) => void;
  /** Fired when the user clears or significantly edits the input after a
   *  selection — lets the consumer reset the structured-address state. */
  onClear?: () => void;
};

export function AddressAutocomplete({
  label = "Business address",
  helper,
  value,
  onTextChange,
  onSelect,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;

  const trimmed = value.trim().toLowerCase();
  const matches = trimmed.length === 0
    ? SUGGESTIONS
    : SUGGESTIONS.filter((s) => s.display.toLowerCase().includes(trimmed));

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onTextChange(e.target.value);
    onClear?.();
    setOpen(true);
    setActiveIdx(0);
  }

  function pick(s: Suggestion) {
    onTextChange(s.display);
    onSelect({ line1: s.line1, city: s.city, state: s.state, zip: s.zip });
    setOpen(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(matches.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && open && matches[activeIdx]) {
      e.preventDefault();
      pick(matches[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex w-full flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-ink-body">
        {label}
      </label>
      <div
        className={[
          "flex h-11 w-full items-center gap-2 rounded-md border bg-card px-3 transition-colors duration-fast ease-snap",
          "border-border hover:border-strong focus-within:border-royal-400",
          "focus-within:shadow-[0_0_0_2px_var(--royal-100)]",
        ].join(" ")}
      >
        <span className="flex shrink-0 items-center text-ink-caption">
          <MapPin size={14} strokeWidth={1.75} />
        </span>
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          value={value}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Start typing your address…"
          className="h-full w-full bg-transparent text-[14px] text-ink-title outline-none placeholder:text-ink-disabled"
        />
      </div>
      {helper && <p className="text-[12px] text-ink-caption">{helper}</p>}

      {open && matches.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-md border border-border bg-card shadow-lg"
        >
          {matches.map((s, i) => {
            const active = i === activeIdx;
            return (
              <li key={s.display}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => pick(s)}
                  className={[
                    "flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]",
                    active ? "bg-subtle" : "bg-card",
                  ].join(" ")}
                >
                  <span className="mt-0.5 text-ink-caption">
                    <MapPin size={13} strokeWidth={1.75} />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-medium text-ink-title">{s.line1}</span>
                    <span className="text-[12px] text-ink-caption">
                      {s.city}, {s.state} {s.zip}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
