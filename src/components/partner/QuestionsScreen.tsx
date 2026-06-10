"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Hammer,
  Home,
  Minus,
  MoreHorizontal,
  Plus,
  Sun,
  TreePine,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PartnerShell } from "./PartnerShell";
import { useInvite } from "@/lib/useInvite";
import { useTestMode } from "@/lib/testMode";
import { DISCOVERY_QUESTIONS } from "@/lib/discoveryQuestions";

/* Step 4 — "Your team": the partner-only questions the operator flow doesn't
   have. Technician count + service traits drive referral routing. Each
   question reads top-down: question, hint, then the control directly below
   it (the old layout floated the technician stepper in the page header,
   disconnected from its question). */

const TECH_PRESET = 4;
const TECH_MIN = 1;
const TECH_MAX = 999;

const SERVICE_ICON: Record<string, LucideIcon> = {
  roofing: Home,
  hvac: Wind,
  plumbing: Wrench,
  solar: Sun,
  electrical: Zap,
  landscaping: TreePine,
  general: Hammer,
  other: MoreHorizontal,
};

const techQ = DISCOVERY_QUESTIONS.find((q) => q.id === "technician_count");
const servicesQ = DISCOVERY_QUESTIONS.find((q) => q.id === "services");

export function QuestionsScreen() {
  const router = useRouter();
  const invite = useInvite();
  const testMode = useTestMode();

  const [techs, setTechs] = useState(TECH_PRESET);
  const [services, setServices] = useState<string[]>([]);
  const [specify, setSpecify] = useState("");

  const serviceOptions = servicesQ?.type === "multi_select_chips" ? servicesQ.options : [];
  const specifyOn = services.includes("other");
  const ready =
    testMode ||
    (techs >= TECH_MIN && services.length >= 1 && (!specifyOn || specify.trim().length > 0));

  const clamp = (n: number) => Math.max(TECH_MIN, Math.min(TECH_MAX, n));
  const toggle = (v: string) =>
    setServices((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  return (
    <PartnerShell step={4} backHref="/partner/account/business">
      <h1 className="op-h1">About your team.</h1>
      <p className="op-sub" style={{ marginBottom: 28 }}>
        Two quick questions — this is how {invite.operator.name} routes the
        right referrals to you.
      </p>

      {/* Q1 — technician count. The stepper sits below the question. */}
      <div className="op-question">
        <span className="op-q">{techQ?.prompt ?? "How many technicians do you have?"}</span>
        <span className="op-q-hint">
          {(techQ?.type === "short_text" && techQ.helperText) || "Including yourself, owners, and 1099 partners."}
        </span>
        <div className="op-stepper" role="group" aria-label="Number of technicians">
          <button
            type="button"
            className="op-step-btn"
            aria-label="Decrease"
            onClick={() => setTechs((v) => clamp(v - 1))}
            disabled={techs <= TECH_MIN}
          >
            <Minus size={15} strokeWidth={2} />
          </button>
          <input
            className="op-step-input"
            type="text"
            inputMode="numeric"
            aria-label="Number of technicians"
            value={techs}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
              setTechs(digits === "" ? TECH_MIN : clamp(parseInt(digits, 10)));
            }}
          />
          <button
            type="button"
            className="op-step-btn"
            aria-label="Increase"
            onClick={() => setTechs((v) => clamp(v + 1))}
            disabled={techs >= TECH_MAX}
          >
            <Plus size={15} strokeWidth={2} />
          </button>
          <span className="op-stepper-hint">You can type a number too.</span>
        </div>
      </div>

      {/* Q2 — service traits. Multi-select chips below the question. */}
      <div className="op-question">
        <span className="op-q">{servicesQ?.prompt ?? "What services do you provide?"}</span>
        <span className="op-q-hint">
          {(servicesQ?.type === "multi_select_chips" && servicesQ.helperText) || "Pick all that apply. You can edit this later."}
        </span>
        <div className="op-chips" role="group" aria-label="Services you provide">
          {serviceOptions.map((o) => {
            const on = services.includes(o.value);
            const Icon = on ? Check : SERVICE_ICON[o.value] ?? MoreHorizontal;
            return (
              <button
                key={o.value}
                type="button"
                className={`op-chip${on ? " is-on" : ""}`}
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(o.value)}
              >
                <Icon size={15} strokeWidth={2} />
                {o.label}
              </button>
            );
          })}
        </div>

        {specifyOn && (
          <label className="op-field">
            <span className="op-field-label">What other services?</span>
            <input
              className="op-input"
              placeholder="e.g. Pool service, fencing, gutters"
              value={specify}
              onChange={(e) => setSpecify(e.target.value)}
              autoFocus
            />
          </label>
        )}
      </div>

      <button
        className="op-btn op-btn--primary"
        disabled={!ready}
        onClick={() => router.push("/partner/team")}
      >
        Continue
      </button>
    </PartnerShell>
  );
}
