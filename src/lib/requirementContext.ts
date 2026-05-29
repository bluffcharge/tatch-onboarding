/**
 * Per-screen mapping into the partner-side product spec. Powers the left
 * rail on the canvas — keeps reviewers anchored to "what is this screen
 * trying to satisfy?" while clicking through the operator platform.
 *
 * Sourced from the Leads Module and Records Module partner stories
 * (Notion: "Leads Module - Partner", "Records Module - Partner"). These
 * are reference links to the relevant stories, not build instructions —
 * the screens themselves live in the partner prototype.
 *
 * Keys MUST match the `href` values in `ALL_ROUTES` (page.tsx) exactly,
 * including the absolute origin, since `getContextFor` looks up by href.
 */

const PARTNER_BASE = "https://tatch-partner-prototype.vercel.app";

export type RequirementContext = {
  /** Short one-liner for the rail header. */
  oneLine: string;
  /** Which flows (and which steps) this screen sits in. */
  flowRefs: { flow: string; step?: string }[];
  /** Which user stories this screen serves. */
  storyRefs: string[];
  /** 2–5 bullet points lifted from the spec's key requirements. */
  reqs: string[];
};

export const REQUIREMENT_CONTEXT: Record<string, RequirementContext> = {
  [`${PARTNER_BASE}/leads`]: {
    oneLine:
      "Every submitted lead in one table — filter by submitted-by and stage, sort by any column.",
    flowRefs: [
      { flow: "Track Leads (Overview)", step: "Lands on Leads, narrows with search + filters" },
      { flow: "Bulk Assign", step: "Select rows → floating action bar → reassign" },
    ],
    storyRefs: ["Leads · Story 2", "Leads · Story 3"],
    reqs: [
      "Sentence-style header ({count} leads to All Partners from all Submitted by) with inline dropdown filters.",
      "Filter bar: search, submitted-by dropdown, stage dropdown — no separate sort button.",
      "Columns sort by clicking the header; bulk-select shows a floating 'Assign to' action bar.",
      "Search matches contact name, operator, or address.",
    ],
  },
  [`${PARTNER_BASE}/leads/marcus-rivera`]: {
    oneLine:
      "Full lifecycle of one lead — activities, files, dates, details, contacts, and financials.",
    flowRefs: [
      { flow: "View Lead Detail", step: "Opens a lead from the overview table" },
      { flow: "Upload a File", step: "Drag onto Documents — immediately visible to the operator" },
    ],
    storyRefs: ["Leads · Story 4", "Leads · Story 5", "Leads · Story 6", "Leads · Story 7"],
    reqs: [
      "Two-column layout: activities + (files | dates) on the left, details / contacts / financials on the right.",
      "Unified activity feed of curated lifecycle events only — no internal operator noise.",
      "Timeline dates per stage (Received → Contacted → Working → Qualified → Lost); unreached stages read 'Not set'.",
      "Drag-and-drop file upload, max 250 MB per file; partner and operator files are mutually visible.",
    ],
  },
  [`${PARTNER_BASE}/records?view=contacts`]: {
    oneLine:
      "All contacts you refer leads for — searchable and filterable by company.",
    flowRefs: [
      { flow: "Records Overview", step: "Contacts view active by default; toggle to Companies" },
    ],
    storyRefs: ["Records · Story 1"],
    reqs: [
      "Columns: Contact, Title, Company, Phone, Email, BDM — all sortable. No checkboxes or bulk actions.",
      "Search by name, company, or email; company filter is a multiselect with in-dropdown search + Clear all.",
      "One BDM per company; all contacts inherit that company's BDM.",
      "Permission scoping: Admin sees all, Manager sees own + team, Member sees own.",
    ],
  },
  [`${PARTNER_BASE}/records?view=companies`]: {
    oneLine:
      "All companies you refer leads to — with per-company lead counts.",
    flowRefs: [
      { flow: "Records Overview", step: "Toggle the header to the Companies view" },
    ],
    storyRefs: ["Records · Story 3"],
    reqs: [
      "Columns: Company, Street, City, State, ZIP, Phone, Email, Industry, BDM, Leads — all sortable.",
      "Search only (no filter button); matches name, industry, or city.",
      "Leads column shows the count of leads submitted to that company.",
      "No Total Revenue column; permission scoping applies (Admin / Manager / Member).",
    ],
  },
  [`${PARTNER_BASE}/records/contacts/marisa-waters`]: {
    oneLine:
      "A contact's performance, history, files, referrals, and fee terms on one page.",
    flowRefs: [
      { flow: "Contact Detail", step: "Opens a contact; company name links to the parent company" },
      { flow: "Cross-Navigation", step: "Breadcrumbs + company link move between records" },
    ],
    storyRefs: ["Records · Story 2", "Records · Story 5", "Records · Story 6"],
    reqs: [
      "Seven-KPI metrics card: Leads Sent, Sold, Lost, Conversion Rate, Rewards Earned, Last Lead Sent, Days Since.",
      "KPIs scoped to leads where the contact is BDM (Admin sees all; Member sees only their own).",
      "Activities + (Files | Referral Summary) on the left; Record Details + Fee Structure on the right.",
      "Fee structure is inherited from the parent company and read-only for the partner.",
    ],
  },
  [`${PARTNER_BASE}/records/companies/acme-roofing`]: {
    oneLine:
      "A company's performance, history, files, referrals, and fee terms on one page.",
    flowRefs: [
      { flow: "Company Detail", step: "Opens a company from the Companies table" },
    ],
    storyRefs: ["Records · Story 4", "Records · Story 5", "Records · Story 6"],
    reqs: [
      "Same seven KPIs as contact detail; Admin sees company-level totals, Member sees only their submissions.",
      "Two-column layout: Activities + (Files | Referral Summary) left, Details + Fee Structure right.",
      "Fee structure is flat or tiered, read-only, set by the operator during onboarding.",
      "No Related Contacts tile on the company view.",
    ],
  },
};

export function getContextFor(href: string): RequirementContext | null {
  return REQUIREMENT_CONTEXT[href] ?? null;
}
