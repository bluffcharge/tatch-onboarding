/**
 * Per-route mapping into the PRD that lives in
 * ~/Desktop/SUX/Tatch-Onboarding-Plan.md (and the founder-pasted spec).
 * Powers the left rail on the gallery — keeps reviewers anchored to the
 * "what is this trying to satisfy?" while clicking through screens.
 */

export type RequirementContext = {
  /** Short one-liner for the rail header. */
  oneLine: string;
  /** Which flows (and which steps) this screen sits in. */
  flowRefs: { flow: string; step?: string }[];
  /** Which user stories this screen serves. */
  storyRefs: string[];
  /** 2–5 bullet points lifted from the PRD's "Key Requirements" for this screen. */
  reqs: string[];
  /** Deeper references — source prototype, spec sections, sibling screens. */
  links?: { label: string; href: string }[];
};

/* Source-of-truth references shared across the operator flow. */
const ARMEN_PROTOTYPE = "https://tatch-operator-onboarding.vercel.app";
const ROADMAP_BRAND = "https://tatch-field-brand.vercel.app";

const SAME_AUTH: Pick<RequirementContext, "flowRefs" | "storyRefs"> = {
  flowRefs: [
    { flow: "Flow 2 — new partner via link", step: "Step 2: create account" },
    { flow: "Flow 3 — existing partner", step: "Step 2: log in (or auto-detect)" },
    { flow: "Flow 4 — sign up with code", step: "Step 4: standard account creation" },
  ],
  storyRefs: ["Story 2", "Story 4", "Story 5"],
};

/* Shared flow ref for the operator signup wizard (Armen's prototype,
   tatch-operator-onboarding.vercel.app). */
const OP_FLOW = "Operator signup — self-serve Tatch Connect";

export const REQUIREMENT_CONTEXT: Record<string, RequirementContext> = {
  /* ----------------------------- Operator signup ----------------------------- */
  "/operator/signin": {
    oneLine: "Entry point — sign in, or toggle to sign-up to start the wizard.",
    flowRefs: [{ flow: OP_FLOW, step: "Entry: returning operator signs in" }],
    storyRefs: ["Operator self-serve onboarding"],
    reqs: [
      "Email + password with show/hide, Remember me, Forgot password.",
      "Google OAuth as an alternate path; same destination as email.",
      "Sign-up toggle drops straight into Step 1 (Create account).",
      "Black CTA (--op-ink); violet reserved for links only.",
    ],
    links: [
      { label: "Armen's signup prototype ↗", href: ARMEN_PROTOTYPE },
      { label: "Roadmap brand reference ↗", href: ROADMAP_BRAND },
    ],
  },
  "/operator/account": {
    oneLine: "Step 1 — create the operator account (your details).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1 of 5: Create account" }],
    storyRefs: ["Operator self-serve onboarding"],
    reqs: [
      "Collects first/last name, work email, company name, password.",
      "Password rule: ≥ 8 chars with one special character (shown inline).",
      "Google OAuth shortcut bypasses the password fields.",
      "Legal consent line links Privacy Policy + Terms of Service.",
    ],
    links: [
      { label: "Armen's signup prototype ↗", href: ARMEN_PROTOTYPE },
    ],
  },
  "/operator/plan": {
    oneLine: "Step 2 — configure the Tatch Connect plan (Monthly).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 2 of 5: Choose plan" }],
    storyRefs: ["Transparent self-serve pricing"],
    reqs: [
      "Platform fee $223 / branch / mo · Operator seats $45 / user / mo.",
      "Branches + seats are steppers; estimate recomputes live.",
      "Usage fee: $10 per lead OR 10% of the reward, whichever is greater.",
      "Partner portal access is always free — partners are never billed.",
      "Estimate is platform + seats; usage billed per lead on top.",
    ],
    links: [
      { label: "Armen's plan screen ↗", href: ARMEN_PROTOTYPE },
      { label: "Scaled example — 3 branches, 8 seats ↗", href: "/operator/plan?branches=3&seats=8" },
      { label: "Annual billing variant ↗", href: "/operator/plan?cycle=annual" },
    ],
  },
  "/operator/plan?cycle=annual": {
    oneLine: "Step 2 variant — Annual billing applies a 10% discount.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 2 of 5: Choose plan (annual)" }],
    storyRefs: ["Transparent self-serve pricing"],
    reqs: [
      "Annual toggle discounts the monthly-equivalent by 10%.",
      "Same line items; only the per-month rate changes.",
      "Label clarifies 'monthly (billed yearly)' so the cadence is unambiguous.",
    ],
  },
  "/operator/team": {
    oneLine: "Step 3 — invite operators; seat math drives the meter.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3 of 5: Invite team" }],
    storyRefs: ["Multi-operator accounts"],
    reqs: [
      "Seat meter reflects seats purchased in Step 2 (1 of 1 used incl. you).",
      "Invite by phone OR email; per-invite Member / Admin role.",
      "Add another stacks rows; adding past the seat count implies a seat add.",
      "Skip is equal-weight — never block activation on team invites.",
    ],
    links: [
      { label: "Armen's invite screen ↗", href: ARMEN_PROTOTYPE },
      { label: "Seat-overage variant — 2 invited ↗", href: "/operator/team?seeded=1" },
    ],
  },
  "/operator/team?seeded=1": {
    oneLine: "Step 3 variant — a teammate added past the included seat (overage).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3 of 5: Invite team (seat overage)" }],
    storyRefs: ["Multi-operator accounts"],
    reqs: [
      "Adding past the 1 included seat surfaces a '+1 seat · $45/mo' line.",
      "Meter goes 2 of 1 — the overage reads clearly, not silently.",
      "Each invitee keeps an independent Member / Admin role.",
      "Estimate from Step 2 should reconcile with the added seat at checkout.",
    ],
    links: [
      { label: "Default invite screen ↗", href: "/operator/team" },
    ],
  },
  "/operator/plan?branches=3&seats=8": {
    oneLine: "Step 2 variant — a scaled account (3 branches, 8 seats).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 2 of 5: Choose plan (scaled)" }],
    storyRefs: ["Transparent self-serve pricing"],
    reqs: [
      "Platform $223 × 3 branches + seats $45 × 8 = $1,029/mo estimate.",
      "Steppers drive the total live; no plan tiers, pure usage-based config.",
      "Usage fees still stack per lead on top of the platform + seat total.",
    ],
    links: [
      { label: "Default (1 branch / 1 seat) ↗", href: "/operator/plan" },
    ],
  },
  "/operator/payment": {
    oneLine: "Step 4 — payment + order summary (Card).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 of 5: Payment" }],
    storyRefs: ["Self-serve checkout"],
    reqs: [
      "Card or ACH; card collects number / expiry / CVC / country / ZIP.",
      "Order summary mirrors the plan: platform + seats + usage = total.",
      "Card is charged after the trial ends (stated up front).",
      "Trust line: guaranteed safe & secure, all transactions protected.",
    ],
    links: [
      { label: "Armen's payment screen ↗", href: ARMEN_PROTOTYPE },
      { label: "ACH variant ↗", href: "/operator/payment?method=ach" },
    ],
  },
  "/operator/payment?method=ach": {
    oneLine: "Step 4 variant — ACH bank transfer instead of a card.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 of 5: Payment (ACH)" }],
    storyRefs: ["Self-serve checkout"],
    reqs: [
      "ACH collects account + routing number in place of card fields.",
      "Order summary + total are identical to the card path.",
      "Country / ZIP still captured for billing.",
    ],
  },
  "/operator/activating": {
    oneLine: "Transition — provisioning the Tatch Connect account.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 → 5 (transition)" }],
    storyRefs: ["Self-serve checkout"],
    reqs: [
      "Brand-gradient orb is the one gradient moment in the flow.",
      "Auto-advances to the success screen after a short beat (~2s).",
      "Copy ('This will only take a moment') makes the setup feel substantial.",
    ],
  },
  "/operator/done": {
    oneLine: "Step 5 — account ready; hand off to the dashboard.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 5 of 5: You're all set" }],
    storyRefs: ["Operator self-serve onboarding"],
    reqs: [
      "Confirms the Tatch Connect account is provisioned.",
      "Single black CTA routes into the operator dashboard.",
      "Gradient check-badge closes the loop opened by the activating orb.",
    ],
    links: [
      { label: "Armen's success screen ↗", href: ARMEN_PROTOTYPE },
    ],
  },

  /* ----------------------------- Partner onboarding (P1–P7) ----------------------------- */
  "/j/abc123": {
    oneLine: "Personalized welcome for a partner clicking an SMS/email invite link.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 1: lands on the onboarding screen" },
      { flow: "Flow 3 — existing partner",     step: "Step 1: clicks invite link" },
    ],
    storyRefs: ["Story 2", "Story 4"],
    reqs: [
      "Invite link lands on a registration/onboarding page.",
      "Auto-detect existing accounts and skip the company-setup flow.",
      "Personalize the welcome with the inviting operator + BDM (trust signal).",
    ],
  },
  "/onboarding/ticket": {
    oneLine: "P1 — Ticket exploration: hang-tag take on the invite with an ink ticket + accent slip behind.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 1 (alt visual): lands on the ticket hero" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "Visualize the invite as a physical Tatch pass: ink ticket, inviter context, stylized barcode, Tatch wordmark.",
      "Accent slip behind picks up --royal-400 (DIS blue) — no orange, no brand violet on the chrome.",
      "Hover: subtle 3D tilt that tracks the cursor; reduced-motion + touch get a flat ticket.",
    ],
  },
  "/join": {
    oneLine: "Code-based entry — no email link required.",
    flowRefs: [
      { flow: "Flow 4 — sign up with code", step: "Step 2: enters a Company or BDM Code" },
    ],
    storyRefs: ["Story 6"],
    reqs: [
      "Provide an alternative entry point: 'Sign up with Code'.",
      "Input supports pasting codes; case-insensitive if feasible.",
      "Codes validated server-side; invalid/expired codes show a clear error.",
    ],
  },
  "/join?bad=1": {
    oneLine: "Edge state — partner entered an invalid or expired code.",
    flowRefs: [
      { flow: "Flow 4 — sign up with code", step: "Step 3: server-side validation failed" },
    ],
    storyRefs: ["Story 6"],
    reqs: [
      "Invalid/expired codes show a clear error.",
      "Don't reveal whether the code format is wrong vs. expired vs. unknown.",
      "Suggest next steps (ask operator for a new TatchLink).",
    ],
  },
  "/j/used": {
    oneLine: "Edge state — invite link was already claimed.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 1: link is single-use after first claim" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "Once-claimed invite links can't be reused.",
      "Offer sign-in as the next step (likely already has an account).",
      "Provide an easy contact path back to the operator.",
    ],
  },
  "/onboarding/auth?via=phone": {
    oneLine: "Phone-OTP authentication — primary path, SMS-first posture.",
    ...SAME_AUTH,
    reqs: [
      "Support email + password and Gmail OAuth.",
      "Phone OTP is the default for SMS-first comms (operator preference).",
      "Operator-context breadcrumb keeps the inviting company in view.",
    ],
  },
  "/onboarding/auth?via=email": {
    oneLine: "Email + password authentication — secondary path.",
    ...SAME_AUTH,
    reqs: [
      "Support email + password registration.",
      "Support Gmail OAuth as an alternative signup method.",
      "Pre-fill email when invited by partner admin during onboarding.",
    ],
  },
  "/onboarding/business": {
    oneLine: "Business profile — name, address, primary contact.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 3: enters business info" },
      { flow: "Flow 4 — sign up with code",    step: "Step 5: completes onboarding if needed" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "Collects: business name, business address, primary contact info.",
      "Address autocomplete preferred; manual fallback when API unreliable.",
      "Pre-fill phone from the auth step ('change if you'd like').",
    ],
  },
  "/onboarding/discovery": {
    oneLine: "Discovery questions — technicians count + services provided.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 5: answers one or more questions" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "Q1: 'How many technicians do you have?' (short text, numeric).",
      "Q2: 'What services do you provide?' (multi-select). If 'Other' is selected, prompt to specify.",
      "Designed as a typed array — additional questions are config, not screens.",
    ],
  },
  "/onboarding/team": {
    oneLine: "Team invites — optional, SMS-first, role assignment.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 4: invites additional team members" },
    ],
    storyRefs: ["Story 2", "Story 5"],
    reqs: [
      "Invite teammates by email and/or SMS during onboarding.",
      "Role assignment optional (Admin / Member for V1).",
      "Skip is equal-weight to Send — never block activation on team invites.",
    ],
  },
  "/onboarding/activating": {
    oneLine: "Transition — linkage and contact propagation happen here.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 6→7 (transition)" },
    ],
    storyRefs: ["Story 3"],
    reqs: [
      "Auto-link partner company to inviting operator.",
      "Add all operator contacts to all activated partner users.",
      "Two-beat micro-copy makes the system feel substantial.",
    ],
  },
  "/onboarding/done": {
    oneLine: "Success — new partner is connected, contacts added.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 6: completes onboarding" },
    ],
    storyRefs: ["Story 2", "Story 3"],
    reqs: [
      "Partner company auto-linked to inviting operator.",
      "All operator contacts added to all activated partner user accounts.",
      "Confirm the linkage in copy ('Sara and 4 teammates have been added').",
    ],
  },
  "/onboarding/done?existing=1": {
    oneLine: "Short-circuit success — existing partner, new operator linkage.",
    flowRefs: [
      { flow: "Flow 3 — existing partner", step: "Step 5: sees confirmation" },
    ],
    storyRefs: ["Story 3", "Story 4"],
    reqs: [
      "Skip the company-setup flow for existing partners.",
      "Create the operator-partner linkage automatically.",
      "Add all operator contacts (not just the BDM) to existing partner users.",
      "Show a confirmation summarizing the new connection ('Nothing else changed').",
    ],
  },
  "/partner-admin/invite": {
    oneLine: "Operator UI — invite partners via TatchLink + manage codes.",
    flowRefs: [
      { flow: "Flow 1 — operator sends invite", step: "All 5 steps" },
    ],
    storyRefs: ["Story 1", "Story 6"],
    reqs: [
      "Lives under the avatar menu → Invite Partner.",
      "Supports multiple emails/phones in a single batch invite.",
      "Generates a unique invite link per recipient (SMS or email).",
      "Company Code + BDM Code panels with copy, share, rotate; rotation doesn't break existing linkages.",
    ],
  },
};

export function getContextFor(href: string): RequirementContext | null {
  return REQUIREMENT_CONTEXT[href] ?? null;
}
