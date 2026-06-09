"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Box, Users, Zap, Minus, Plus, ArrowRight, Check } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { PLATFORM_FEE, SEAT_FEE, pricing, buildQuery, money, readWizard, type Billing } from "./wizardParams";

const FEATURES = [
  "Partner Portal",
  "Partner Directory",
  "Lead Management Workflow",
  "Reward Config Engine",
  "Reward Distribution Rails",
  "Built-in 1099 & tax handling",
  "Dispute Resolution Workflow",
  "Partner Application & Onboarding",
  "Multi-branch & multi-region support",
  "Lead Routing Rules",
  "Operator User Roles & Permissions",
  "Email & SMS Notifications",
  "Mobile App",
  "Intra-company Mode",
  "Webhook & API access",
  "Integrations",
];

export function ChoosePlanScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const seed = readWizard(sp);
  const [billing, setBilling] = useState<Billing>(seed.billing);
  const [branches, setBranches] = useState(seed.branches);
  const [seats, setSeats] = useState(seed.seats);

  const state = { branches, seats, billing, invites: 0 };
  const p = pricing(state);
  const query = buildQuery({ branches, seats, billing });

  return (
    <OperatorShell step={4} backHref={`/operator/account/business`} query={query} wide>
      <h1 className="op-h1">Tatch Connect.</h1>
      <p className="op-sub" style={{ marginBottom: 22 }}>
        Everything you need to launch and manage your referral partner program.
      </p>

      <div className="op-seg" role="tablist" aria-label="Billing cycle" style={{ marginBottom: 22 }}>
        <button
          className={`op-seg-opt${billing === "monthly" ? " is-active" : ""}`}
          onClick={() => setBilling("monthly")}
          role="tab"
          aria-selected={billing === "monthly"}
        >
          Monthly
        </button>
        <button
          className={`op-seg-opt${billing === "annual" ? " is-active" : ""}`}
          onClick={() => setBilling("annual")}
          role="tab"
          aria-selected={billing === "annual"}
        >
          Annual <span className="op-seg-badge">Save 10%</span>
        </button>
      </div>

      <div className="op-card-grid">
        <Tile
          icon={<Box size={17} />}
          label="Platform fee"
          price={PLATFORM_FEE}
          unit="/branch/mo"
          stepperLabel="Branches"
          value={branches}
          onDec={() => setBranches((v) => Math.max(1, v - 1))}
          onInc={() => setBranches((v) => v + 1)}
        />
        <Tile
          icon={<Users size={17} />}
          label="Operator seats"
          price={SEAT_FEE}
          unit="/user/mo"
          stepperLabel="Seats"
          value={seats}
          onDec={() => setSeats((v) => Math.max(1, v - 1))}
          onInc={() => setSeats((v) => v + 1)}
        />
      </div>

      <div className="op-note">
        <span className="op-note-icon"><Zap size={17} /></span>
        <span>
          <span className="op-note-title">Usage fee</span>
          <span className="op-note-body">
            $10 per lead <b>or</b> 10% of the reward amount, whichever is greater. Partner portal access
            is always free — partners are never billed.
          </span>
        </span>
      </div>

      <div className="op-features">
        <p className="op-section-label" style={{ margin: 0 }}>Everything included</p>
        <div className="op-features-grid">
          {FEATURES.map((f) => (
            <span className="op-feature" key={f}>
              <span className="op-feature-check"><Check size={11} strokeWidth={3} /></span>
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="op-summary-bar">
        <div>
          <div className="op-summary-label">Estimated monthly</div>
          <div className="op-summary-val">
            <b>{money(p.perMonth)}</b><span>/mo</span>
          </div>
          <div className="op-summary-note">
            {billing === "annual"
              ? `Billed annually at ${money(p.annualTotal)} · + usage fees per lead`
              : "+ usage fees per lead"}
          </div>
        </div>
        <button
          className="op-btn op-btn--primary op-btn--inline"
          onClick={() => router.push(`/operator/payment${buildQuery({ branches, seats, billing })}`)}
        >
          Continue <ArrowRight size={17} />
        </button>
      </div>
    </OperatorShell>
  );
}

function Tile({
  icon, label, price, unit, stepperLabel, value, onDec, onInc,
}: {
  icon: React.ReactNode; label: string; price: number; unit: string;
  stepperLabel: string; value: number; onDec: () => void; onInc: () => void;
}) {
  return (
    <div className="op-card-tile">
      <div className="op-tile-head">{icon}{label}</div>
      <div className="op-price"><b>${price}</b><span>{unit}</span></div>
      <div className="op-stepper-label">{stepperLabel}</div>
      <div className="op-stepper">
        <button className="op-step-btn" onClick={onDec} aria-label={`Fewer ${stepperLabel.toLowerCase()}`}><Minus size={15} /></button>
        <span className="op-step-val">{value}</span>
        <button className="op-step-btn" onClick={onInc} aria-label={`More ${stepperLabel.toLowerCase()}`}><Plus size={15} /></button>
      </div>
    </div>
  );
}
