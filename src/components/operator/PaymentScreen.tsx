"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { OperatorShell } from "./OperatorShell";

export function PaymentScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const [method, setMethod] = useState<"card" | "ach">(sp.get("method") === "ach" ? "ach" : "card");

  return (
    <OperatorShell step={4} backHref="/operator/team" wide>
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
          <div className="op-order-plan">Tatch Connect</div>
          <div className="op-order-line"><span>Platform (1 branch)</span><b>$223/mo</b></div>
          <div className="op-order-line"><span>Seats (1 user)</span><b>$45/mo</b></div>
          <div className="op-order-line"><span>Usage fees</span><span>per lead</span></div>
          <div className="op-order-total">
            <span className="l">Total</span>
            <span className="v"><b>$268</b><span>/mo</span></span>
          </div>
          <div className="op-secure">
            <ShieldCheck size={15} /> Guaranteed safe &amp; secure. All transactions protected.
          </div>
          <button className="op-btn op-btn--primary" onClick={() => router.push("/operator/activating")}>
            Confirm &amp; subscribe
          </button>
        </aside>
      </div>
    </OperatorShell>
  );
}
