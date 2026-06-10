/**
 * Operator wizard state, threaded through the URL so it (a) survives
 * step-to-step navigation per the PRD ("seat count carried forward",
 * "navigation preserves data") and (b) stays deep-linkable for every
 * canvas filmstrip tile. No global store needed.
 *
 * Params: branches, seats (plan-selected), billing, invites (filled count).
 * Final billed seats = max(planSeats, 1 + invites) — the dynamic-license
 * upgrade from the Invite Team step (US4).
 */

import type { ReadonlyURLSearchParams } from "next/navigation";

export type Billing = "monthly" | "annual";

export const PLATFORM_FEE = 223; // $/branch/mo
export const SEAT_FEE = 45; // $/user/mo

export type WizardState = {
  branches: number;
  seats: number;
  billing: Billing;
  invites: number;
};

function intParam(sp: ReadonlyURLSearchParams, key: string, dflt: number, min: number): number {
  const n = parseInt(sp.get(key) ?? "", 10);
  return Number.isFinite(n) ? Math.min(99, Math.max(min, n)) : dflt;
}

/* Session continuity (standalone flow only). The wizard threads state via
   URL params; any hop that drops the query — a refresh, a bare link, a
   test-mode jump — used to silently reset the plan to 1 seat, making one
   invite read as an overage. The chosen plan shape now also lives in
   sessionStorage as a FALLBACK: explicit params always win, the canvas
   iframe is excluded (its demo tiles must stay pure functions of their
   URLs), and invites are never persisted (they seed demo rows and would
   resurrect after a skip). */
const STORE_KEY = "tatch-op-wizard";
type PlanShape = Pick<WizardState, "branches" | "seats" | "billing">;

function outsideCanvas(): boolean {
  return typeof window !== "undefined" && window.self === window.top;
}

function saneInt(n: unknown, min: number): number | undefined {
  return typeof n === "number" && Number.isFinite(n)
    ? Math.min(99, Math.max(min, Math.round(n)))
    : undefined;
}

function storedShape(): Partial<PlanShape> {
  if (!outsideCanvas()) return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "{}") as Partial<PlanShape>;
  } catch {
    return {};
  }
}

function persistShape({ branches, seats, billing }: WizardState) {
  if (!outsideCanvas()) return;
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify({ branches, seats, billing }));
  } catch {}
}

export function readWizard(sp: ReadonlyURLSearchParams): WizardState {
  const stored = storedShape();
  // `cycle` kept as a legacy alias for older deep-links.
  const billingParam = sp.get("billing") ?? sp.get("cycle");
  const state: WizardState = {
    branches: intParam(sp, "branches", saneInt(stored.branches, 1) ?? 1, 1),
    seats: intParam(sp, "seats", saneInt(stored.seats, 1) ?? 1, 1),
    billing: billingParam !== null
      ? (billingParam === "annual" ? "annual" : "monthly")
      : (stored.billing === "annual" ? "annual" : "monthly"),
    invites: intParam(sp, "invites", 0, 0),
  };
  persistShape(state);
  return state;
}

export function buildQuery(s: Partial<WizardState>): string {
  const p = new URLSearchParams();
  if (s.branches && s.branches !== 1) p.set("branches", String(s.branches));
  if (s.seats && s.seats !== 1) p.set("seats", String(s.seats));
  if (s.billing && s.billing !== "monthly") p.set("billing", s.billing);
  if (s.invites && s.invites > 0) p.set("invites", String(s.invites));
  const q = p.toString();
  return q ? `?${q}` : "";
}

export type Pricing = {
  billedSeats: number;
  extraSeats: number;
  platform: number;
  seatCost: number;
  grossMonthly: number;
  perMonth: number; // discounted if annual
  annualTotal: number; // billed-annually figure
};

export function pricing(s: WizardState): Pricing {
  const billedSeats = Math.max(s.seats, 1 + s.invites);
  const extraSeats = Math.max(0, billedSeats - s.seats);
  const platform = PLATFORM_FEE * s.branches;
  const seatCost = SEAT_FEE * billedSeats;
  const grossMonthly = platform + seatCost;
  const perMonth = s.billing === "annual" ? Math.round(grossMonthly * 0.9) : grossMonthly;
  // Annual total discounts the full annual sum (matches PRD US3 AC2: 581→6,275).
  const annualTotal = Math.round(grossMonthly * 0.9 * 12);
  return { billedSeats, extraSeats, platform, seatCost, grossMonthly, perMonth, annualTotal };
}

export const money = (n: number) => `$${n.toLocaleString()}`;
