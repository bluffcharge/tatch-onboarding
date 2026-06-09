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
    oneLine: "Step 1 of 7 — Create login (Google first, or email + password).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1 of 7: Create login" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "Redesign 2026-06-09: credentials are their own step — no profile fields mixed in.",
      "Google sits ABOVE the email path so the one-click option is seen before any typing.",
      "Email path: email + password + confirm, then a 6-digit email verification.",
      "Google path skips passwords AND verification (Google already verified the address).",
      "Client-side validation: email format + password rule (≥ 8, one special) + confirm match.",
    ],
    links: [
      { label: "Next — verify email ↗", href: "/operator/account/verify?email=jane%40acmeroofing.com" },
      { label: "Google path (lands on About you) ↗", href: "/operator/account/about?via=google" },
      { label: "Validation-error state ↗", href: "/operator/account?error=1" },
    ],
  },
  "/operator/account/verify?email=jane%40acmeroofing.com": {
    oneLine: "Step 1, part two — prove the email with a 6-digit code.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1 of 7: Create login (verify email)" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "Code sent to the entered address; 6 cells auto-advance, accept paste, backspace steps back.",
      "Verify & continue stays disabled until all 6 digits are in.",
      "Resend swaps to a confirmation line (one resend per visit in the prototype).",
      "Still 'Step 1 of 7' — verification is part of creating the login, not a rail step.",
      "Google arrivals never see this screen.",
    ],
    links: [
      { label: "Wrong-code state ↗", href: "/operator/account/verify?email=jane%40acmeroofing.com&error=1" },
      { label: "Next — About you ↗", href: "/operator/account/about" },
    ],
  },
  "/operator/account/verify?email=jane%40acmeroofing.com&error=1": {
    oneLine: "Verify-email edge — the entered code doesn't match.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1: failed verification" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "Error banner + error-styled cells; typing any digit clears the error.",
      "Continue blocked while the error stands; resend clears the code and the error.",
      "Expiry framed in copy (10 minutes) — matches the PRD's open question on verification.",
    ],
    links: [{ label: "Default verify screen ↗", href: "/operator/account/verify?email=jane%40acmeroofing.com" }],
  },
  "/operator/account/about": {
    oneLine: "Step 2 of 7 — About you (the primary account owner's profile).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 2 of 7: About you" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "Collects first/last name, phone, your address — credentials already captured on step 1.",
      "Login email shown read-only (pulled from Google or the verified step-1 address).",
      "Phone enables texting an app-download link, so the operator lands on their phone.",
      "Auto-fills from Google where possible (?via=google).",
    ],
    links: [
      { label: "Via Google (name pre-filled) ↗", href: "/operator/account/about?via=google" },
      { label: "Next — your business ↗", href: "/operator/account/business" },
    ],
  },
  "/operator/account/about?via=google": {
    oneLine: "Step 2 — About you, arrived via Google (name pre-filled).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 2 of 7: About you (Google)" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "First/last name pulled from Google; no password existed on step 1 (Google handles auth).",
      "Still collects phone + your address.",
    ],
    links: [{ label: "Email path ↗", href: "/operator/account/about" }],
  },
  "/operator/account/business": {
    oneLine: "Step 3 of 7 — Your business (the company).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 3 of 7: Your business" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "A distinct step for the business — business name, business phone, business address.",
      "Distinct from the owner's phone/address captured on step 2 (two phones, two addresses).",
      "Business name smart-defaults from the work-email domain (acme.com → Acme).",
      "Continue advances to Choose plan.",
    ],
    links: [{ label: "Back — About you ↗", href: "/operator/account/about" }],
  },
  "/operator/account?error=1": {
    oneLine: "Step 1 edge — Create login client-side validation errors.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 1: invalid submission" }],
    storyRefs: ["US2 · Create account"],
    reqs: [
      "NFR1: password validated client-side (length + special char).",
      "NFR2: email format validated client-side.",
      "Confirm-password mismatch flagged; advance blocked until all valid.",
    ],
    links: [{ label: "Default create-login ↗", href: "/operator/account" }],
  },
  "/operator/plan": {
    oneLine: "Step 4 — configure the Tatch Connect plan (Monthly).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 of 7: Choose plan" }],
    storyRefs: ["US3 · Configure plan"],
    reqs: [
      "FR1: single product, 16-feature list · FR2: monthly/annual, Save 10%.",
      "FR3/FR4: branch + seat steppers, min 1 · $223/branch, $45/user.",
      "FR5: usage fee — $10/lead or 10% of reward, whichever greater; portal free.",
      "FR7/AC1: monthly = (223 × branches) + (45 × seats); recomputes live.",
      "AC4: selected seat count carries forward to Payment + Invite Team.",
    ],
    links: [
      { label: "Armen's plan screen ↗", href: ARMEN_PROTOTYPE },
      { label: "Annual billing variant ↗", href: "/operator/plan?billing=annual" },
      { label: "Scaled — 3 branches, 8 seats ↗", href: "/operator/plan?branches=3&seats=8" },
    ],
  },
  "/operator/plan?billing=annual": {
    oneLine: "Step 4 variant — Annual billing (10% off the annual sum).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 of 7: Choose plan (annual)" }],
    storyRefs: ["US3 · Configure plan"],
    reqs: [
      "FR6/AC2: summary shows discounted /mo + 'billed annually at $X'.",
      "AC2 example: 2 branches, 3 seats → $523/mo, billed annually $6,275.",
      "Same line items; only the rate + annual total change.",
    ],
    links: [{ label: "Monthly billing ↗", href: "/operator/plan" }],
  },
  "/operator/plan?branches=3&seats=8": {
    oneLine: "Step 4 variant — a scaled account (3 branches, 8 seats).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 4 of 7: Choose plan (scaled)" }],
    storyRefs: ["US3 · Configure plan"],
    reqs: [
      "FR7: 223 × 3 + 45 × 8 = $1,029/mo estimate, live.",
      "AC3: steppers cannot go below 1.",
      "Usage fees still stack per lead on top of platform + seat total.",
    ],
    links: [{ label: "Default (1 branch / 1 seat) ↗", href: "/operator/plan" }],
  },
  "/operator/team?seats=3": {
    oneLine: "Step 6 — post-payment invite step; license badge reflects 3 seats.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 6 of 7: Invite team (post-payment)" }],
    storyRefs: ["US4 · Invite team"],
    reqs: [
      "Redesign 2026-06-09: moved AFTER payment so inviting never gates checkout.",
      "FR1: license badge = selected seats ('1 for you, 2 for teammates') + meter.",
      "FR2/FR3: per-row phone/email + Admin/Member; Add another / trash (min 1).",
      "FR8: Skip is equal-weight — teammates can be set up later from settings.",
    ],
    links: [
      { label: "Over-seat warning state ↗", href: "/operator/team?seats=3&invites=4" },
      { label: "Armen's invite screen ↗", href: ARMEN_PROTOTYPE },
    ],
  },
  "/operator/team?seats=3&invites=4": {
    oneLine: "Step 6 edge — invites exceed seats → dynamic license upgrade.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 6: seat overage (US4 AC1)" }],
    storyRefs: ["US4 · Invite team"],
    reqs: [
      "FR4/AC1: 3 seats + 4 invites (5 users) → warning at $225/mo, finish disabled.",
      "FR5/AC2: Confirm upgrade → green banner, badge → 5 seats, finish enabled.",
      "FR9/AC5: Remove extras trims invites back to fit, warning clears.",
      "FR7: finishing stays disabled while an upgrade is unconfirmed.",
    ],
    links: [{ label: "Default (within seats) ↗", href: "/operator/team?seats=3" }],
  },
  "/operator/payment?branches=2&seats=4&billing=annual": {
    oneLine: "Step 5 — payment + order summary reflecting the live config.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 5 of 7: Payment" }],
    storyRefs: ["US5 · Payment"],
    reqs: [
      "FR1: card number / expiry / CVC / country / ZIP · FR2: Card/ACH toggle.",
      "FR3/AC1: summary = platform×branches + seat×billedSeats, −10% annual, total.",
      "AC1 example: 2 branches, 4 seats, annual → $446 + $180, −10%, $563/mo, $6,7xx/yr.",
      "FR5/FR6: security line; Confirm & subscribe → Invite team (post-payment).",
    ],
    links: [
      { label: "ACH variant ↗", href: "/operator/payment?method=ach" },
      { label: "Armen's payment screen ↗", href: ARMEN_PROTOTYPE },
    ],
  },
  "/operator/payment?method=ach": {
    oneLine: "Step 5 variant — ACH bank transfer (non-functional in v1 per PRD).",
    flowRefs: [{ flow: OP_FLOW, step: "Step 5 of 7: Payment (ACH)" }],
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
    flowRefs: [{ flow: OP_FLOW, step: "Step 6 → 7 (transition)" }],
    storyRefs: ["US7 · Activation"],
    reqs: [
      "FR1: gradient orb + 'Setting up your account…' for ~2–3s, then success.",
      "Carries the invite count forward to the success screen.",
      "The one gradient moment in the flow.",
    ],
    links: [{ label: "Armen's success screen ↗", href: ARMEN_PROTOTYPE }],
  },
  "/operator/done?invites=3": {
    oneLine: "Step 7 — account ready; success reports the invite count.",
    flowRefs: [{ flow: OP_FLOW, step: "Step 7 of 7: You're all set" }],
    storyRefs: ["US7 · Activation"],
    reqs: [
      "FR2/AC1: gradient check, 'You're all set.', + 'N teammates have been invited'.",
      "AC2: with zero invites, the count is omitted.",
      "FR3/FR4: full-width centered (no sidebar); 'Go to dashboard' CTA.",
    ],
    links: [{ label: "Armen's success screen ↗", href: ARMEN_PROTOTYPE }],
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
