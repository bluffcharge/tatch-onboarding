/**
 * Per-screen mapping into the operator-platform product spec. Powers the
 * left rail on the canvas — keeps reviewers anchored to "what is this
 * screen trying to satisfy?" while clicking through the half-MVP.
 *
 * Sourced from the half-MVP design docs and the Wallet & Payments PRD
 * (May 2026, PRD v3 — Opportunities eliminated). These are reference
 * notes for review, not build instructions — the screens themselves live
 * in the half-MVP prototype (bluffcharge/tatch-partner-portal).
 *
 * Keys MUST match the `href` values in `ALL_ROUTES` (page.tsx) exactly,
 * including the absolute origin and query string, since `getContextFor`
 * looks up by href.
 */

const CONSOLE_BASE = "https://tatch-half-mvp.vercel.app";

export type RequirementContext = {
  /** Short one-liner for the rail header. */
  oneLine: string;
  /** Which flows (and which steps) this screen sits in. */
  flowRefs: { flow: string; step?: string }[];
  /** Which user stories / PRD sections this screen serves. */
  storyRefs: string[];
  /** 2–5 bullet points lifted from the spec's key requirements. */
  reqs: string[];
};

export const REQUIREMENT_CONTEXT: Record<string, RequirementContext> = {
  [`${CONSOLE_BASE}/?page=Dash&theme=light`]: {
    oneLine:
      "Operator home — welcome hero, revenue dial, and KPI strip in one glance.",
    flowRefs: [
      { flow: "Daily check-in", step: "Lands on Dash; reads revenue + KPI movement" },
    ],
    storyRefs: ["Half-MVP · Dash"],
    reqs: [
      "Hero card carries the welcome copy and revenue headline; pointer-tracked tilt + specular sheen on hover.",
      "KPI strip is toggleable from the Tweaks panel (edit mode).",
      "Theme auto-selects by local time of day — pinned light in this canvas so reviews look the same at any hour.",
      "Top nav: Dash · Leads · Records · Wallet, with 44pt touch halos on tablet.",
    ],
  },
  [`${CONSOLE_BASE}/?page=Leads&theme=light`]: {
    oneLine:
      "Every lead in one pipeline table — stage filters, search, and a detail rail.",
    flowRefs: [
      { flow: "Track Leads", step: "Narrows the table with search + stage filters" },
      { flow: "Lead Detail", step: "Opens a row into the detail rail" },
    ],
    storyRefs: ["Half-MVP · Leads"],
    reqs: [
      "Stage and sub-stage filters with per-bucket toggles; filters reset pagination.",
      "Search spans contact, company, and address.",
      "Pagination bar with page-size control sits under the table.",
    ],
  },
  [`${CONSOLE_BASE}/?page=Records&theme=light`]: {
    oneLine:
      "Contacts and companies behind the pipeline — switchable views with detail pages.",
    flowRefs: [
      { flow: "Records Overview", step: "Contacts view by default; header toggles to Companies" },
      { flow: "Record Detail", step: "Opens contact / company / lead detail pages" },
    ],
    storyRefs: ["Half-MVP · Records", "Records PRD v3"],
    reqs: [
      "Same table engine as Leads (shared RecordsPage) scoped to contacts + companies.",
      "Detail pages: KPI lockup, activity feed, files, and fee terms per record.",
      "Body grid follows the Records content-tile recipe from the design system.",
    ],
  },
  [`${CONSOLE_BASE}/?page=Wallet&theme=light`]: {
    oneLine:
      "The operator's money view — balances, payout approvals, and partner flows.",
    flowRefs: [
      { flow: "Approve Payouts", step: "Admin reviews and approves pending partner payouts" },
      { flow: "KYB Setup", step: "Business verification before money can move" },
    ],
    storyRefs: ["Wallet & Payments PRD · Operator"],
    reqs: [
      "Operator admin approves payouts and reaches Operations settings.",
      "BDM sub-role sees only assigned partners' transactions and cannot approve payouts.",
      "Tables fit portrait tablet without horizontal scroll.",
    ],
  },
  [`${CONSOLE_BASE}/?page=Wallet&role=partner&theme=light`]: {
    oneLine:
      "The partner's money view — business and personal earnings with a claim flow.",
    flowRefs: [
      { flow: "Claim Earnings", step: "Partner claims earned balance to a linked account" },
      { flow: "Commission Splits", step: "Business vs personal split per reward" },
    ],
    storyRefs: ["Wallet & Payments PRD · Partner"],
    reqs: [
      "Business and personal wallets render side by side with earned + pending balances.",
      "Linked account (e.g. Chase Business ****3847) gates the claim flow.",
      "Partner sub-roles (admin / manager / member) scope what is visible.",
    ],
  },
  [`${CONSOLE_BASE}/?page=Settings&theme=light`]: {
    oneLine:
      "Settings, reached from the avatar menu — sections vary by role and sub-role.",
    flowRefs: [
      { flow: "Exit Settings", step: "Back button returns to the last non-Settings page" },
    ],
    storyRefs: ["Half-MVP · Settings"],
    reqs: [
      "Operator vs partner role (and sub-roles) decide which sections render.",
      "Operations settings are admin-only on the operator side.",
    ],
  },
  [`${CONSOLE_BASE}/?page=Dash&theme=dark`]: {
    oneLine:
      "Dark-theme parity pass on the home surface.",
    flowRefs: [
      { flow: "Evening use", step: "The app auto-selects dark 19:00–07:00 local" },
    ],
    storyRefs: ["Half-MVP · Theming"],
    reqs: [
      "Dark theme is a first-class surface, not an inversion — its own backdrop, tile shadows, and inset highlights.",
      "Check hero, dial, tables, and nav indicator for contrast at every breakpoint.",
    ],
  },
};

export function getContextFor(href: string): RequirementContext | null {
  return REQUIREMENT_CONTEXT[href] ?? null;
}
