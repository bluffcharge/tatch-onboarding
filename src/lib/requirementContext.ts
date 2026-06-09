/**
 * Per-route mapping into the PRD that lives in
 * ~/Desktop/SUX/Tatch-Onboarding-Plan.md (partner P1–P7) and the Operator
 * Onboarding & Sign-In PRD (operator flow). Powers the left rail on the
 * gallery — keeps reviewers anchored to "what is this trying to satisfy?"
 * while clicking through screens.
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
const OP_FLOW = "Operator signup — self-serve Tatch Connect";

const SAME_AUTH: Pick<RequirementContext, "flowRefs" | "storyRefs"> = {
  flowRefs: [
    { flow: "Flow 2 — new partner via link", step: "Step 2: create account" },
    { flow: "Flow 3 — existing partner", step: "Step 2: log in (or auto-detect)" },
    { flow: "Flow 4 — sign up with code", step: "Step 4: standard account creation" },
  ],
  storyRefs: ["Story 2", "Story 4", "Story 5"],
};

export const REQUIREMENT_CONTEXT: Record<string, RequirementContext> = {
  /* ============================ Operator signup ============================ */
  "/operator/signin": {
    oneLine: "Entry — existing operator signs in (email, Google, or magic link).",
    flowRefs: [{ flow: OP_FLOW, step: "Flow 2: existing operator signs in → dashboard" }],
    storyRefs: ["US1 · Sign in"],
    reqs: [
      "Design call: email + password (+ Remember me, Forgot password) — the most-used path.",
      "Continue with Google as the alternate; NO phone method on operator.",
      "Magic-link option is PARKED for now (flag in SignInScreen) — bring back later.",
      "Floating-card frame (partner-onboarding); separate from create-account.",
    ],
    links: [
      { label: "Invalid-credentials state ↗", href: "/operator/signin?error=1" },
      { label: "Frame reference (partner onboarding) ↗", href: "https://tatch-onboarding.vercel.app/onboarding/auth" },
    ],
  },
  "/operator/signin?error=1": {
    oneLine: "Sign-in edge — credentials don't match an account.",
    flowRefs: [{ flow: OP_FLOW, step: "Flow 2: failed sign-in" }],
    storyRefs: ["US1 · Sign in"],
    reqs: [
      "Inline error banner + error-styled fields; non-destructive, re-tryable.",
      "Clearing either field dismisses the error (no premature blocking).",
      "Forgot-password link reveals a 'coming soon' note (PRD open question).",
    ],
    links: [{ label: "Default sign-in ↗", href: "/operator/signin" }],
  },
  "/operator/account": {
    oneLine: "Step 1 of 6 — About you (the primary account owner).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1 of 6: About you" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "Matches the PM prototype: About you + Your business are distinct wizard steps.",
      "Collects name, email, phone, your address, password + confirm (credentials live here).",
      "Phone enables texting an app-download link, so the operator lands on their phone.",
      "Google path pre-fills name + email and drops the password fields.",
      "Client-side validation: email format + password rule (≥ 8, one special) + confirm match.",
    ],
    links: [
      { label: "Via Google (name pre-filled) ↗", href: "/operator/account?via=google" },
      { label: "Next — your business ↗", href: "/operator/account/business" },
      { label: "Validation-error state ↗", href: "/operator/account?error=1" },
    ],
  },
  "/operator/account?via=google": {
    oneLine: "Step 1 — About you, arrived via Google (name + email pre-filled).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1 of 6: About you (Google)" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "First/last name + email pulled from Google; password fields drop (Google handles auth).",
      "Still collects phone + your address.",
    ],
    links: [{ label: "Email path ↗", href: "/operator/account" }],
  },
  "/operator/account/business": {
    oneLine: "Step 2 of 6 — Your business (the company).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 2 of 6: Your business" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "PM prototype: a distinct step for the business — business name, business phone, business address.",
      "Distinct from the owner's phone/address captured on step 1 (two phones, two addresses).",
      "Business name smart-defaults from the work-email domain (acme.com → Acme).",
      "Continue advances to Choose plan.",
    ],
    links: [{ label: "Back — About you ↗", href: "/operator/account" }],
  },
  "/operator/account?error=1": {
    oneLine: "Step 1 edge — About you client-side validation errors.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1: invalid submission" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "NFR1: password validated client-side (length + special char).",
      "NFR2: email format validated client-side.",
      "Confirm-password mismatch flagged; advance blocked until all valid.",
    ],
    links: [{ label: "Default create-account ↗", href: "/operator/account" }],
  },
  "/operator/plan": {
    oneLine: "Step 3 — configure the Tatch Connect plan (Monthly).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3 of 6: Choose plan" }],
    storyRefs: ["US3 · Configure plan"],
    reqs: [
      "FR1: single product, 16-feature list · FR2: monthly/annual, Save 10%.",
      "FR3/FR4: branch + seat steppers, min 1 · $223/branch, $45/user.",
      "FR5: usage fee — $10/lead or 10% of reward, whichever greater; portal free.",
      "FR7/AC1: monthly = (223 × branches) + (45 × seats); recomputes live.",
      "AC4: selected seat count carries forward to Invite Team.",
    ],
    links: [
      { label: "Armen's plan screen ↗", href: ARMEN_PROTOTYPE },
      { label: "Annual billing variant ↗", href: "/operator/plan?billing=annual" },
      { label: "Scaled — 3 branches, 8 seats ↗", href: "/operator/plan?branches=3&seats=8" },
    ],
  },
  "/operator/plan?billing=annual": {
    oneLine: "Step 2 variant — Annual billing (10% off the annual sum).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3 of 6: Choose plan (annual)" }],
    storyRefs: ["US3 · Configure plan"],
    reqs: [
      "FR6/AC2: summary shows discounted /mo + 'billed annually at $X'.",
      "AC2 example: 2 branches, 3 seats → $523/mo, billed annually $6,275.",
      "Same line items; only the rate + annual total change.",
    ],
    links: [{ label: "Monthly billing ↗", href: "/operator/plan" }],
  },
  "/operator/plan?branches=3&seats=8": {
    oneLine: "Step 2 variant — a scaled account (3 branches, 8 seats).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3 of 6: Choose plan (scaled)" }],
    storyRefs: ["US3 · Configure plan"],
    reqs: [
      "FR7: 223 × 3 + 45 × 8 = $1,029/mo estimate, live.",
      "AC3: steppers cannot go below 1.",
      "Usage fees still stack per lead on top of platform + seat total.",
    ],
    links: [{ label: "Default (1 branch / 1 seat) ↗", href: "/operator/plan" }],
  },
  "/operator/team?seats=3": {
    oneLine: "Step 4 — invite operators; license badge reflects 3 seats.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 of 6: Invite team" }],
    storyRefs: ["US4 · Invite team"],
    reqs: [
      "FR1: license badge = selected seats ('1 for you, 2 for teammates') + meter.",
      "FR2/FR3: per-row phone/email + Admin/Member; Add another / trash (min 1).",
      "FR6: under-filling seats still bills the selected count.",
      "FR8: Skip is equal-weight — never blocks activation.",
    ],
    links: [
      { label: "Over-seat warning state ↗", href: "/operator/team?seats=3&invites=4" },
      { label: "Armen's invite screen ↗", href: ARMEN_PROTOTYPE },
    ],
  },
  "/operator/team?seats=3&invites=4": {
    oneLine: "Step 3 edge — invites exceed seats → dynamic license upgrade.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3: seat overage (US4 AC1)" }],
    storyRefs: ["US4 · Invite team"],
    reqs: [
      "FR4/AC1: 3 seats + 4 invites (5 users) → warning at $225/mo, Continue disabled.",
      "FR5/AC2: Confirm upgrade → green banner, badge → 5 seats, Continue enabled.",
      "FR9/AC5: Remove extras trims invites back to fit, warning clears.",
      "FR7: Continue stays disabled while an upgrade is unconfirmed.",
    ],
    links: [{ label: "Default (within seats) ↗", href: "/operator/team?seats=3" }],
  },
  "/operator/payment?branches=2&seats=4&billing=annual": {
    oneLine: "Step 5 — payment + order summary reflecting the live config.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 5 of 6: Payment" }],
    storyRefs: ["US5 · Payment"],
    reqs: [
      "FR1: card number / expiry / CVC / country / ZIP · FR2: Card/ACH toggle.",
      "FR3/AC1: summary = platform×branches + seat×billedSeats, −10% annual, total.",
      "AC1 example: 2 branches, 4 seats, annual → $446 + $180, −10%, $563/mo, $6,7xx/yr.",
      "FR4: upgraded seats note ('Includes N extra seats from invites').",
      "FR5/FR6: security line; Confirm & subscribe → activation.",
    ],
    links: [
      { label: "ACH variant ↗", href: "/operator/payment?method=ach" },
      { label: "Armen's payment screen ↗", href: ARMEN_PROTOTYPE },
    ],
  },
  "/operator/payment?method=ach": {
    oneLine: "Step 4 variant — ACH bank transfer (non-functional in v1 per PRD).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 5 of 6: Payment (ACH)" }],
    storyRefs: ["US5 · Payment"],
    reqs: [
      "FR2: ACH toggle present; PRD defers ACH implementation to v2.",
      "Order summary + total identical to the card path.",
      "Country / ZIP still captured for billing.",
    ],
    links: [{ label: "Card path ↗", href: "/operator/payment?branches=2&seats=4&billing=annual" }],
  },
  "/operator/activating": {
    oneLine: "Transition — provisioning the Tatch Connect account.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 5 → 6 (transition)" }],
    storyRefs: ["US7 · Activation"],
    reqs: [
      "FR1: gradient orb + 'Setting up your account…' for ~2–3s, then success.",
      "Carries the invite count forward to the success screen.",
      "The one gradient moment in the flow.",
    ],
    links: [{ label: "Armen's success screen ↗", href: ARMEN_PROTOTYPE }],
  },
  "/operator/done?invites=3": {
    oneLine: "Step 6 — account ready; success reports the invite count.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 6 of 6: You're all set" }],
    storyRefs: ["US7 · Activation"],
    reqs: [
      "FR2/AC1: gradient check, 'You're all set.', + 'N teammates have been invited'.",
      "AC2: with zero invites, the count is omitted.",
      "FR3/FR4: full-width centered (no sidebar); 'Go to dashboard' CTA.",
    ],
    links: [{ label: "Armen's success screen ↗", href: ARMEN_PROTOTYPE }],
  },

  /* ============================== Brand A/B ============================== */
  "/operator/account?brand=prd": {
    oneLine: "Same screen, PRD/partner-system skin — for the brand decision.",
    flowRefs: [{ flow: "Brand decision — roadmap vs PRD", step: "Create account, PRD skin" }],
    storyRefs: ["Decision · brand direction"],
    reqs: [
      "PRD UX spec: DM Sans, lavender #F2F0F5 canvas, white card, dark #1E1E1E buttons.",
      "Inputs 10px radius, 1.5px #E8E8EE borders, #1E1E1E focus.",
      "Drops the roadmap field-brand signature (eyebrow pill, violet now-accents, spine).",
      "Conflict: PRD references the OLD partner system; Rob's newer direction is the roadmap brand.",
    ],
    links: [{ label: "Roadmap-brand version ↗", href: "/operator/account" }],
  },
  "/operator/plan?brand=prd": {
    oneLine: "Choose Plan in the PRD/partner skin — compare to the roadmap.",
    flowRefs: [{ flow: "Brand decision — roadmap vs PRD", step: "Choose plan, PRD skin" }],
    storyRefs: ["Decision · brand direction"],
    reqs: [
      "Identical layout + logic; only tokens + typeface swap.",
      "DM Sans body/headings vs Urbanist's heavy 800 display.",
      "Lavender-on-lavender vs ink-on-white foundation.",
    ],
    links: [{ label: "Roadmap-brand version ↗", href: "/operator/plan" }],
  },
  "/operator/team?seats=3&invites=4&brand=prd": {
    oneLine: "Dynamic license (over-seat) in the PRD skin — same behavior.",
    flowRefs: [{ flow: "Brand decision — roadmap vs PRD", step: "Invite team overage, PRD skin" }],
    storyRefs: ["Decision · brand direction"],
    reqs: [
      "Shows the US4 warning/upgrade flow re-skinned — logic is brand-agnostic.",
      "Demonstrates that the brand swap is a token change, not a rebuild.",
    ],
    links: [{ label: "Roadmap-brand version ↗", href: "/operator/team?seats=3&invites=4" }],
  },

  /* ========================= Partner onboarding (P1–P7) ========================= */
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
  "/join": {
    oneLine: "Code-based entry — no email link required.",
    flowRefs: [{ flow: "Flow 4 — sign up with code", step: "Step 2: enters a Company or BDM Code" }],
    storyRefs: ["Story 6"],
    reqs: [
      "Provide an alternative entry point: 'Sign up with Code'.",
      "Input supports pasting codes; case-insensitive if feasible.",
      "Codes validated server-side; invalid/expired codes show a clear error.",
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
  "/onboarding/business": {
    oneLine: "Business profile — name, address, primary contact.",
    flowRefs: [{ flow: "Flow 2 — new partner via link", step: "Step 3: enters business info" }],
    storyRefs: ["Story 2"],
    reqs: [
      "Collects: business name, business address, primary contact info.",
      "Address autocomplete preferred; manual fallback when API unreliable.",
      "Pre-fill phone from the auth step ('change if you'd like').",
    ],
  },
  "/onboarding/done": {
    oneLine: "Success — new partner is connected, contacts added.",
    flowRefs: [{ flow: "Flow 2 — new partner via link", step: "Step 6: completes onboarding" }],
    storyRefs: ["Story 2", "Story 3"],
    reqs: [
      "Partner company auto-linked to inviting operator.",
      "All operator contacts added to all activated partner user accounts.",
      "Confirm the linkage in copy ('Sara and 4 teammates have been added').",
    ],
  },
};

export function getContextFor(href: string): RequirementContext | null {
  return REQUIREMENT_CONTEXT[href] ?? null;
}
