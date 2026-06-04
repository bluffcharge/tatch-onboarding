"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { OperatorShell } from "./OperatorShell";
import { pricing, buildQuery, money, readWizard } from "./wizardParams";

export function PaymentScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const state = readWizard(sp);
  const p = pricing(state);
  const [method, setMethod] = useState<"card" | "ach">(sp.get("method") === "ach" ? "ach" : "card");

  const query = buildQuery({ branches: state.branches, seats: state.seats, billing: state.billing, invites: state.invites });
  const branchLabel = `${state.branches} branch${state.branches === 1 ? "" : "es"}`;
  const seatLabel = `${p.billedSeats} user${p.billedSeats === 1 ? "" : "s"}`;

  return (
    <OperatorShell step={4} backHref={`/operator/team${query}`} query={query} wide>
      <h1 className="op-h1">Payment information.</h1>
      <p className="op-sub" style={{ marginBottom: 24 }}>
        Your card will be charged after your trial ends.
      </p>

      <div className="op-pay-grid">
        <div>
          <div className="op-seg" style={{ marginBottom: 22 }}>
            <button className={`op-seg-opt${method === "card" ? " is-active" : ""}`} onClick={() => setMethod("card")}>
              <CreditCard size={15} /> Card
            </button>
            <button className={`op-seg-opt${method === "ach" ? " is-active" : ""}`} onClick={() => setMethod("ach")}>
              <Landmark size={15} /> ACH
            </button>
          </div>

          {method === "card" ? (
            <>
              <label className="op-field">
                <span className="op-field-label">Card number</span>
                <input className="op-input" placeholder="1234 1234 1234 1234" inputMode="numeric" />
              </label>
              <div className="op-row">
                <label className="op-field">
                  <span className="op-field-label">Expiration</span>
                  <input className="op-input" placeholder="MM / YY" inputMode="numeric" />
                </label>
                <label className="op-field">
                  <span className="op-field-label">CVC</span>
                  <input className="op-input" placeholder="123" inputMode="numeric" />
                </label>
              </div>
            </>
          ) : (
            <>
              <label className="op-field">
                <span className="op-field-label">Account number</span>
                <input className="op-input" placeholder="000123456789" inputMode="numeric" />
              </label>
              <label className="op-field">
                <span className="op-field-label">Routing number</span>
                <input className="op-input" placeholder="110000000" inputMode="numeric" />
              </label>
            </>
          )}

          <div className="op-row">
            <label className="op-field">
              <span className="op-field-label">Country</span>
              <select className="op-select" defaultValue="us">
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
              </select>
            </label>
            <label className="op-field">
              <span className="op-field-label">ZIP code</span>
              <input className="op-input" placeholder="12345" inputMode="numeric" />
            </label>
          </div>
        </div>

        <aside className="op-order">
          <div className="op-order-h">Your plan</div>
          <div className="op-order-plan">
            Tatch Connect
            <span className="op-order-cycle">{state.billing === "annual" ? "Annual" : "Monthly"}</span>
          </div>
          <div className="op-order-line"><span>Platform ({branchLabel})</span><b>{money(p.platform)}/mo</b></div>
          <div className="op-order-line"><span>Seats ({seatLabel})</span><b>{money(p.seatCost)}/mo</b></div>
          {p.extraSeats > 0 && (
            <div className="op-order-subnote">Includes {p.extraSeats} extra seat{p.extraSeats === 1 ? "" : "s"} from invites</div>
          )}
          <div className="op-order-line"><span>Usage fees</span><span>per lead</span></div>
          {state.billing === "annual" && (
            <div className="op-order-line op-order-discount"><span>Annual discount</span><b>−10%</b></div>
          )}
          <div className="op-order-total">
            <span className="l">Total</span>
            <span className="v"><b>{money(p.perMonth)}</b><span>/mo</span></span>
          </div>
          {state.billing === "annual" && (
            <div className="op-order-annual">Billed annually at {money(p.annualTotal)}</div>
          )}
          <div className="op-secure">
            <ShieldCheck size={15} /> Guaranteed safe &amp; secure. All transactions protected.
          </div>
          <button
            className="op-btn op-btn--primary"
            onClick={() => router.push(`/operator/activating${buildQuery({ invites: state.invites })}`)}
          >
            Confirm &amp; subscribe
          </button>
        </aside>
      </div>
    </OperatorShell>
  );
}
