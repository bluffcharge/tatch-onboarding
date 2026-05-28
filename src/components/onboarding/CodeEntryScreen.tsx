"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";

export function CodeEntryScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialError = sp.get("bad") === "1";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(
    initialError ? "This code doesn't look right or it's expired." : null
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .slice(0, 12);
    setCode(next);
    if (error) setError(null);
  }

  function handleSubmit() {
    if (code.length < 4) {
      setError("Codes are 6–12 characters.");
      return;
    }
    // mock: pretend "BAD" prefix is invalid; everything else routes to P1
    if (code.startsWith("BAD")) {
      setError("This code doesn't look right or it's expired. Ask your operator to send a new TatchLink.");
      return;
    }
    router.push("/j/abc123");
  }

  return (
    <OnboardingShell chrome={false} center>
      {/* Brand mark pinned to the canvas top-left so it stays put while the
          focal card centers in the viewport. */}
      <div className="safe-pt absolute left-0 top-0 flex items-center gap-2 p-4 md:p-6 lg:p-8">
        <Image
          src="/logo/tatch-logomark.svg"
          alt="Tatch"
          width={22}
          height={22}
          priority
        />
        <span className="text-[15px] font-semibold tracking-tight text-ink-title">
          tatch
        </span>
      </div>

      {/* Single-input-focus per pattern 02. On mobile the card fills the
          screen (full-bleed on the glass canvas, no floating margins); at
          md+ it becomes a 480px frosted panel centered in the viewport so
          the sparse screen reads as a focal card with intentional margin
          rather than a top-left stack. Input stays narrower than the card. */}
      <div className="flex min-h-[100dvh] w-full flex-col justify-center px-6 py-10 md:min-h-0 md:w-[480px] md:rounded-3xl md:border md:border-border md:bg-card md:px-8 md:py-8 md:shadow-lg">
        <p className="t-mono-label mb-3">Have a code?</p>
        <h1 className="t-h1 mb-3 text-balance">Enter your TatchLink code</h1>
        <p className="t-body-lg text-ink-subtitle">
          Your operator may have given you a 6–8 character code. Type or paste
          it below.
        </p>

        <div className="mt-7">
          <div
            className={[
              "flex h-14 items-center rounded-lg border bg-canvas px-4 transition-colors duration-fast ease-snap",
              error
                ? "border-error"
                : "border-border focus-within:border-royal-400 focus-within:shadow-[0_0_0_2px_var(--royal-100)]",
            ].join(" ")}
          >
            <input
              autoFocus
              value={code}
              onChange={handleChange}
              placeholder="ABC123"
              aria-label="TatchLink code"
              inputMode="text"
              autoComplete="one-time-code"
              className="w-full bg-transparent text-[22px] font-semibold tracking-[0.18em] text-ink-title outline-none placeholder:text-ink-disabled placeholder:tracking-[0.18em]"
            />
          </div>
          {error && (
            <p role="alert" className="mt-2 text-[12.5px] text-error">
              {error}
            </p>
          )}
        </div>

        <p className="t-caption mt-5">
          No code?{" "}
          <button
            type="button"
            onClick={() => router.push("/j/abc123")}
            className="font-medium text-ink-body hover:text-ink-title hover:underline"
          >
            I have a link instead →
          </button>
        </p>

        <div className="mt-8">
          <Button fullWidth size="lg" onClick={handleSubmit} disabled={code.length < 4}>
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
