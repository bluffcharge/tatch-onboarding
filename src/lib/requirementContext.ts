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
};

const SAME_AUTH: Pick<RequirementContext, "flowRefs" | "storyRefs"> = {
  flowRefs: [
    { flow: "Flow 2 — new partner via link", step: "Step 2: create account" },
    { flow: "Flow 3 — existing partner", step: "Step 2: log in (or auto-detect)" },
    { flow: "Flow 4 — sign up with code", step: "Step 4: standard account creation" },
  ],
  storyRefs: ["Story 2", "Story 4", "Story 5"],
};

export const REQUIREMENT_CONTEXT: Record<string, RequirementContext> = {
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
  "/partner/account": {
    oneLine: "Create login — step 1; Google first, or email + password.",
    ...SAME_AUTH,
    reqs: [
      "Support email + password registration and Gmail OAuth.",
      "Pre-fill the work email from the operator's invite when present.",
      "Invite chip keeps the inviting company in view while committing credentials.",
      "Email path verifies the address next; Google skips verification.",
    ],
  },
  "/partner/account/verify": {
    oneLine: "Verify email — 6-digit code, still part of step 1.",
    ...SAME_AUTH,
    reqs: [
      "6-digit code sent to the address; resend with cooldown copy.",
      "Google arrivals never see this screen (address already verified).",
      "Mirrors the operator signup's verification exactly.",
    ],
  },
  "/partner/signin": {
    oneLine: "Sign in — returning partner, minimal (email or Google only).",
    ...SAME_AUTH,
    reqs: [
      "Support email + password and Gmail OAuth sign-in.",
      "Keep it minimal — no profile fields, just the two methods.",
      "Offer a path back to the invite for new partners.",
    ],
  },
  "/partner/account/about": {
    oneLine: "About you — name + mobile; the app-link phone ask lives here.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 3: enters profile info" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "First/last name pre-filled from Google when available.",
      "Login email shown read-only (verified).",
      "Mobile number: we text the app-download link here.",
    ],
  },
  "/partner/account/business": {
    oneLine: "Your business — company name, phone, address.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 4: enters business info" },
      { flow: "Flow 4 — sign up with code",    step: "Step 5: completes onboarding if needed" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "Business name pre-filled from the invite (fallback: email domain).",
      "Address autocomplete preferred; manual entry as fallback.",
      "Linked-company invites (?co=) swap the form for a join confirmation.",
    ],
  },
  "/partner/questions": {
    oneLine: "Partner questions — technicians count + services provided.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 5: answers one or more questions" },
    ],
    storyRefs: ["Story 2"],
    reqs: [
      "Q1: 'How many technicians do you have?' — stepper directly below the question.",
      "Q2: 'What services do you provide?' (multi-select chips). 'Other' prompts to specify.",
      "Questions stay a typed array — additional questions are config, not screens.",
    ],
  },
  "/partner/team": {
    oneLine: "Team invites — optional, phone-or-email rows.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 6: invites additional team members" },
    ],
    storyRefs: ["Story 2", "Story 5"],
    reqs: [
      "Invite teammates by phone or email during onboarding.",
      "Optional role per invitee (Admin / Manager / Member).",
      "Validate each row before redirecting; message under the offending row with PRD-exact copy (invalid email/phone + already-associated duplicates).",
      "Success: 'Your team member will receive an invitation shortly'.",
      "Skip is equal-weight to Send — never block activation on team invites.",
    ],
  },
  "/partner/activating": {
    oneLine: "Transition — linkage and contact propagation happen here.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 6→7 (transition)" },
    ],
    storyRefs: ["Story 3"],
    reqs: [
      "Auto-link partner company to inviting operator.",
      "Add all operator contacts to all activated partner users.",
    ],
  },
  "/partner/done": {
    oneLine: "Success — new partner is connected, contacts added.",
    flowRefs: [
      { flow: "Flow 2 — new partner via link", step: "Step 7: completes onboarding" },
    ],
    storyRefs: ["Story 2", "Story 3"],
    reqs: [
      "Partner company auto-linked to inviting operator.",
      "All operator contacts added to all activated partner user accounts.",
      "Copy confirms the contact propagation ('Sara and 4 teammates added to your contacts').",
      "Resolved-record contract tile (TATCH-416) for cross-team reference.",
    ],
  },
  "/partner/done?existing=1": {
    oneLine: "Short-circuit success — existing partner, new operator linkage.",
    flowRefs: [
      { flow: "Flow 3 — existing partner", step: "Step 5: sees confirmation" },
    ],
    storyRefs: ["Story 3", "Story 4"],
    reqs: [
      "Skip the company-setup flow for existing partners.",
      "Create the operator-partner linkage automatically.",
      "Add all operator contacts (not just the BDM) to existing partner users.",
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
