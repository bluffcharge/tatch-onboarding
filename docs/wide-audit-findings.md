# Wide-viewport audit findings — 2026-05-27

Stage 2 of the audit. Per-screen audit against the
`tatch-wide-reference` skill's `patterns/`, `principles.md`, and
`anti-patterns.md`. Capped at **top 3 issues per screen** by impact. Ends
with a prioritized worklist for Stage 3.

## Resolved direction (from Rob, 2026-05-27)

- **Audit posture:** per-screen judgment — flip "earn the real estate" to
  cap-and-center wherever the current stance doesn't defend itself; at
  Wide the canvas absorbs the extra width as margin, not as a wider column.
- **Journey rail:** keep on P2/P3/P4/P5. The sidebar anti-pattern is
  waived for this flow — the rail is *progress*, not tips/preview.
- **P3 operator-preview pane:** cut. Not essential to onboarding.
- **O1 Operator invite:** narrower scope — already capped at 1180px;
  light polish only (typography + optical centering), no structural change.
- **Theme naming:** the reference pack's "Atmospheric / Tatch light /
  Tatch dark" maps to this repo's two themes — light is **DIS** (white
  canvas, glass-card surfaces, blue accent), dark is **NeuroSync** (ink
  canvas, purple accent). Findings below use repo names.
- **Mechanic for flipping a screen to cap-and-center (approach B):**
  *don't* touch the `OnboardingShell`'s `wide` prop. Instead, add or
  tighten an inner `2xl:max-w-[…]` cap on the screen's content column.
  The shell's outer column may still resolve to 1800px at 2xl, but
  nothing inside it grows that wide — the difference becomes intentional
  margin around the focal stack. Smaller blast radius, easier to revert
  per screen, and if `wide` ends up unused after this pass we can drop
  the prop in a separate cleanup.

---

## P1 — Welcome ([WelcomeScreen.tsx](../src/components/onboarding/WelcomeScreen.tsx))

**Pattern match:** [01-hero-welcome](../../tatch-wide-reference/patterns/01-hero-welcome.md)

**Top 3 issues at Wide:**

1. **Hero content has no inner column cap → it inherits the shell's
   `wide` outer width (up to 1800px at 2xl).** For a hero/welcome screen
   the pack caps the hero text column at 760–840px and lets margins
   absorb the rest. Today the headline, sub, CTA, *and* the feature-card
   row all share the 1800px-wide canvas, which pulls the focal lockup
   apart and reads as a stretched marketing page, not a calm trust
   moment. **Violates** `01-hero-welcome.md` ("Single column, capped and
   centered. Hero text column: max-width ≈ 760–840px") and
   `principles.md` ("the content cap stays fixed and the margins grow").
   *High impact.*

2. **"What you're signing up for" feature-card row competes with the CTA
   for focal attention.** Four cards × the full canvas width is the
   "stretched, under-furnished room" the principles warn about, and the
   row's pattern is the Amie/Reflect product-screenshot anchor that
   `anti-patterns.md` calls out by name ("Don't replicate product-
   screenshot anchors. Tatch is the product; partners are *in* it, not
   browsing for it"). **Violates** the one-focal-element rule. *High
   impact.*

3. **H1 stepped at `2xl:text-[72px]` is at-cap but isn't fluid.** The
   pack recommends `clamp(40px, 4.5vw, 72px)` so the headline tracks the
   canvas continuously rather than snapping at 1536. At 2560 the 72px
   value is exactly the ceiling, so the visual result is fine — the gap
   is in the recipe, which matters once we add other Wide-specific
   styling. *Medium impact.*

**Suggested treatment:**
Add a `2xl:max-w-[840px]` cap on the hero content column (the
`<div className="mx-auto flex w-full flex-1 flex-col items-center text-center">`
wrapper). Leave the shell's `wide` prop alone — the empty space inside
the shell becomes intentional margin. Position the stack at ~28% from
the top (not vertically centered). **Cut the feature-card cluster from
the Wide viewport** (keep it on phone/tablet/laptop where it earns its
keep), or — if Rob wants to preserve the cards — let them render inside
the 840px cap below the CTA, not spread across the shell width. Move the
H1 to `clamp(40px, 4.5vw, 72px)`.

**Anti-pattern check (sampled from `anti-patterns.md`):**
- [ ] Hero text ≤ 80px
- [ ] No decorative side panels
- [ ] Content column ≤ 840px (hero archetype)
- [ ] No product-screenshot anchor
- [ ] No marketing footer treatment

---

## P0/B — Code entry ([CodeEntryScreen.tsx](../src/components/onboarding/CodeEntryScreen.tsx))

**Pattern match:** [02-single-input-focus](../../tatch-wide-reference/patterns/02-single-input-focus.md)

**Top 3 issues at Wide:**

1. **Stack is left-aligned at the top of a 1280px column.** The pack's
   single-input-focus recipe is a *centered* focal card geometry,
   vertically positioned at 45–55% of the canvas. Today the brand
   lockup, helper, headline, and input all sit pinned to the top-left,
   so at Wide there's an oversized empty rectangle below the input.
   *High impact.*

2. **Input pill capped at 320px (lg) — slightly under-spec.** Pack
   recommends 440–520px for code/email inputs, narrower than the card
   that frames them. 320px is fine for OTP but a 6–12-char alphanumeric
   code wants closer to 400–440px so the placeholder + value have room
   to breathe at scale. *Low impact* (still readable, just tight).

3. **No focal card framing — flat on the canvas.** Pack OK's an implicit
   centered column (no card), but the screen needs to *act* like a
   focal card: vertical center, soft elevation/glow allowed. Today
   nothing signals "this is the focal moment." *Medium impact.*

**Suggested treatment:**
Recompose the stack as a centered focal column: vertically center at
~50% of the viewport, horizontally center in the canvas, cap the input
pill at ~440px, keep the "I have a link instead" link below the CTA.
Soft radial atmosphere behind the column is allowed on both DIS and
NeuroSync themes per the pattern.

**Anti-pattern check:**
- [ ] Input width ≤ 520px
- [ ] No decorative side panels
- [ ] Single focal element
- [ ] No animated input border

---

## P2 — Auth (phone) ([AuthScreen.tsx](../src/components/onboarding/AuthScreen.tsx))

**Pattern match:** [02-single-input-focus](../../tatch-wide-reference/patterns/02-single-input-focus.md)

**Top 3 issues at Wide:**

1. **Right-pane stack is top-anchored, not vertically centered.** With
   the journey rail on the left and the form column constrained to
   400px on the right, the form sits near the top of a tall right pane
   and leaves ~50% of the pane empty below. Single-input-focus wants
   the column vertically centered (45–55% from top). *High impact.*

2. **H1 stops at 32px @lg with no Wide bump.** Pattern recommends
   `clamp(28px, 2.5vw, 40px)` — at Wide the headline should land near
   the top of that range (~36–40px) so it doesn't feel undersized
   relative to the canvas. *Medium impact.*

3. **Operator-context breadcrumb above the form is small but
   load-bearing.** It's the only trust signal on the screen and it
   sits at 11px (`t-caption`). On Wide the trust signal earns a touch
   more weight — bump to 13–14px and align typography with the
   pattern's "operator name as single semibold word" rhythm. *Low impact.*

**Suggested treatment:**
Vertically center the form stack within the right pane (use a flex
container with `md:items-center md:min-h-[80vh]` or similar). Lift the
H1 to `clamp(28px, 2.5vw, 40px)`. Keep the form column at 400px and
keep the journey rail.

**Anti-pattern check:**
- [ ] Single focal element
- [ ] Input width ≤ 520px
- [ ] No animated input border
- [ ] No "Save and exit" button

---

## P2 — Auth (email) ([AuthScreen.tsx](../src/components/onboarding/AuthScreen.tsx))

**Pattern match:** [02-single-input-focus](../../tatch-wide-reference/patterns/02-single-input-focus.md)

Same shell, same right-pane geometry, same three issues as the phone
branch above. The two-stacked-field layout (email + password) is fine —
both fields stay within the 400px column.

**Suggested treatment:** identical to P2 phone. Address them together
in the same screen-pass.

---

## P3 — Business profile ([BusinessProfileScreen.tsx](../src/components/onboarding/BusinessProfileScreen.tsx))

**Pattern match:** [03-form-as-conversation](../../tatch-wide-reference/patterns/03-form-as-conversation.md)

**Top 3 issues at Wide:**

1. **`OperatorPreviewCard` side-pane is decorative.** Per Rob's
   direction, cut it. Pack: "Don't add a sidebar with 'tips' or
   'preview' panels." The card is preview *of operator UI*, not progress
   — it's exactly the case the rule was written for. *High impact.*

2. **2-column grid wrapper widens the form's neighborhood at lg/2xl
   even though the form column itself already caps at 520px.** Once the
   aside is cut, the wrapping `lg:grid lg:grid-cols-[minmax(0,1fr)_320px]`
   becomes dead structure that anchors the form to the left of the
   shell. Drop the grid wrapper after cutting the aside and the 520px
   form column sits in the shell's outer cap as intentional margin —
   no need to touch the `wide` prop. *High impact.*

3. **Content stack sits near the top of the right pane with no Wide-
   specific positioning.** Pattern 03 places the page title at ~12–15%
   from the top of the canvas, with the form starting ~24–32px below.
   Today the H1 + body + form all stack at the natural top of the
   content area — fine at Desktop, looks pinned-up at Wide. *Medium
   impact.*

**Suggested treatment:**
Cut the entire `<aside aria-label="Operator preview">` block (and its
`OperatorPreviewCard` definition). Drop the `lg:grid lg:grid-cols-[...]
2xl:grid-cols-[...]` wrapper that the aside used to occupy. Leave the
shell's `wide` prop alone. The inner form column already caps at
`lg:max-w-[520px]` so it'll sit inside the shell's outer width as
intentional margin. Keep the inline city/state/zip 3-up (well under
520px combined) and the contact `grid-cols-[140px_1fr]` row.

**Anti-pattern check:**
- [ ] No sidebar with "tips" or "preview"
- [ ] Form column ≤ 520px
- [ ] No 2-/3-column layouts for single-task screen
- [ ] No grid count change between breakpoints

---

## P4 — Discovery ([DiscoveryScreen.tsx](../src/components/onboarding/DiscoveryScreen.tsx))

**Pattern match:** [03-form-as-conversation](../../tatch-wide-reference/patterns/03-form-as-conversation.md)

**Top 3 issues at Wide:**

1. **8-up tile grid at 2xl** (`grid-cols-4 2xl:grid-cols-8`). Direct
   anti-pattern violation: "Don't change the grid count between
   breakpoints. A 3-up grid at Desktop stays 3-up at Wide. More margin,
   same grid." Lock the service tiles to 4-up at all viewports ≥ lg.
   *High impact.*

2. **`TechCountSlider` pinned top-right of the header is a side-panel
   pattern on a form-as-conversation screen.** Visually it's an inset
   card that creates a 2-column header — exactly what pattern 03 argues
   against ("Don't introduce 2- or 3-column layouts… Vertical rhythm >
   horizontal density"). Defensible *only* if you read the slider as
   part of the conversation rather than as a sidebar; pack's strict
   read is "move inline." *Medium impact, depends on Rob's call.*

3. **Form column has no explicit cap inside the right pane.** Each
   question (`<h2>` + helper + chips/tiles/text input) floods the
   right pane edge-to-edge at Wide — readable but doesn't match the
   "form column capped at ~520px, column floats in a large rectangle
   of intentional emptiness" geometry. *Medium impact.*

**Suggested treatment:**
Drop the `2xl:grid-cols-8` half of the `TileGroup` cols expression so
service tiles stay 4-up at Wide; the margins around the 4-up grid
expand. Constrain the body column with `max-w-[640–720px]` (a touch
wider than 520 because each tile is 88px tall and 4-up needs the
horizontal room — pattern says ≤ 520 for *inputs*, the tile grid is a
beat that can earn more width, but still capped). Decide on the
tech-slider: move it inline as its own beat at Wide, or keep the
top-right inset (defensible) but explicitly justify it in the
implementation commit.

**Anti-pattern check:**
- [ ] Grid count stable across breakpoints
- [ ] No sidebar with "tips" or "preview"
- [ ] Vertical rhythm > horizontal density
- [ ] Input width ≤ 520px

---

## P5 — Invite team ([TeamInviteScreen.tsx](../src/components/onboarding/TeamInviteScreen.tsx))

**Pattern match:** [03-form-as-conversation](../../tatch-wide-reference/patterns/03-form-as-conversation.md)

**Top 3 issues at Wide:**

1. **Table layout at lg+ (`grid-cols-[1fr_220px_40px]`, max-w 696px).**
   Pattern 03: "P3/P4/P5 are conversational forms, not data-entry
   grids. Vertical rhythm > horizontal density." The mobile design
   (stacked card per row, role toggle inside the card, "Add another"
   below) already *is* form-as-conversation done right — promoting it
   to a table for laptop+ is the regression. *High impact.*

2. **Content cap grows 400 → 696px at lg.** Pattern wants the form
   column ~520px and a typed-array growing *downward, not outward*.
   Bringing the cap down to 520 lets the stacked-card layout work at
   every viewport. *High impact.*

3. **Footer flips skip-link + CTA to a horizontal lockup at lg.**
   Pattern: "single-CTA stack with skip-link below." The horizontal
   lockup reads as a dashboard footer, not an onboarding hand-off.
   *Medium impact.*

**Suggested treatment:**
Kill the `<div className="hidden lg:block">` table branch entirely;
let the stacked-card layout render at all viewports. Cap the column
at 520px. Footer: stack the skip-link below the primary CTA at all
viewports (or above — both work, but vertical).

**Anti-pattern check:**
- [ ] No 2-/3-column layouts for single-task screen
- [ ] Form column ≤ 520px
- [ ] Vertical rhythm > horizontal density
- [ ] No grid count change between breakpoints

---

## P6 — Activating ([ActivatingScreen.tsx](../src/components/onboarding/ActivatingScreen.tsx))

**Pattern match:** [04-transitional-states](../../tatch-wide-reference/patterns/04-transitional-states.md)

**Top 3 issues at Wide:**

1. **Spinner.** Pattern 04 is unambiguous: "No spinner. No progress
   bar. No checklist. The atmosphere carries the wait." The current
   screen has a conic-spin ring (`animate-spin` 1.1s) wrapped around a
   `animate-ping` halo and a brand-gradient inner pill. Replace with a
   single focal element — the inner brand-gradient pill (or a Tatch
   glyph) with a slow breathing pulse (scale 100% → 102% → 100% over
   1.4s, ease-in-out, loop). *High impact.*

2. **Beat timing is 1.2s + 1.2s = 2.4s total.** Pack recommends
   ~0.6s + 0.6s with a 60ms hold gap between beats. Today the beats
   read as "two separate waits" rather than "one calm transition."
   *Medium impact* — small change, large feel difference.

3. **No reduced-motion treatment.** Pattern: "replace the breathing
   pulse with a static focal element; keep the copy cross-fade." The
   current screen will spin even with `prefers-reduced-motion: reduce`.
   *Medium impact.*

**Suggested treatment:**
Replace the conic-spin + ping with a single focal element (the
brand-gradient pill, no rotation; or a Tatch glyph), apply the
breathing pulse via a CSS keyframe scoped to the element. Tighten beat
timing to ~0.6s with a small hold. Add a `@media (prefers-reduced-motion: reduce)`
block to drop the pulse and shorten the crossfade.

**Anti-pattern check:**
- [ ] No persistent ambient motion outside the transition window
- [ ] Single focal element
- [ ] Reduced-motion fallback
- [ ] Copy is present-continuous + calm, no exclamation

---

## P7 — Connected (new) ([SuccessScreen.tsx](../src/components/onboarding/SuccessScreen.tsx))

**Pattern match:** [05-success-and-confirmation](../../tatch-wide-reference/patterns/05-success-and-confirmation.md)

**Top 3 issues at Wide:**

1. **H1 stays at `.t-h1` (36px) at all viewports — no Wide lift.**
   Pattern: `clamp(36px, 3vw, 56px)`. At 2560 the headline should land
   in the 48–56px range so it reads as a confirmation moment, not as a
   default screen title. *High impact* (this is the most visible Wide
   defect on a success screen).

2. **"View connection details" disclosure + `ConnectionSummary` table.**
   Pattern: "Resist explaining mechanics. The partner doesn't need to
   know that an account was provisioned, an email was sent, and a row
   was added." The summary table is mechanic-leaning — Operator name +
   Invited-by + Linked-at + Teammates-count is exactly that
   inventory. Either cut the disclosure entirely or move it to a
   smaller, quieter footer treatment. *Medium impact.*

3. **No operator-name semibold line on the screen.** Pattern: "the
   operator's name is the only semibold element on the screen,
   18–20px, 'With Sarah at Maple Capital.'" Today the operator name
   appears *inside* the sub paragraph, not as a dedicated line. *Low
   impact* — copy nuance, not architecture.

**Suggested treatment:**
Lift the H1 with `clamp(36px, 3vw, 56px)`. Promote the operator
attribution to its own 18–20px semibold line below the headline ("With
{inviter.fullName} at {operator.name}"). Demote or cut the
ConnectionSummary disclosure — if kept, render at low weight as a
small footer detail, not as the primary discoverable below the CTA.
Keep the gradient pill + checkmark (it's in-spec at 64px).

**Anti-pattern check:**
- [ ] No celebration headline / no exclamation / no emoji
- [ ] Single CTA, 160–220px wide (currently 320 — pull tighter)
- [ ] No "what's next" sidebar
- [ ] No marketing footer

---

## P7 — Short-circuit ([SuccessScreen.tsx?existing=1](../src/components/onboarding/SuccessScreen.tsx))

Same component, same three issues as P7 (new). The `?existing=1` branch
only swaps copy. Bundle with P7 in the same screen-pass.

---

## O1 — Operator invite ([OperatorInviteScreen.tsx](../src/components/operator/OperatorInviteScreen.tsx))

**Pattern match:** doesn't cleanly map to one of the six archetypes —
this is the only "settings panel" screen in scope. Closest analogues
are the hero header (`01-hero-welcome`) for the title block and the
form-as-conversation pattern (`03-form-as-conversation`) for the
send-invite card. Per Rob: scope is narrower since the screen already
caps at 1180px.

**Top 3 issues at Wide (narrow scope):**

1. **H1 sits at `.t-h1` (36px) with no Wide lift.** Same defect as P7.
   At 2560 the page title should grow into the 40–48px range so the
   "From your account menu" → "Invite a partner" lockup reads as the
   page anchor it's supposed to be. *Medium impact.*

2. **Faux nav row ("Dash · Leads · Records · Wallet") is decorative
   at Wide.** The reference pack's "no full product nav on onboarding
   screens" rule is for partner-onboarding; this is an *operator*
   screen, so the rule doesn't transfer directly. But the row is
   styled as muted neutral text with no hover states or active state
   — at Wide it reads as inert chrome. Either commit to it (give it
   active styling, treat as a real nav) or quiet it further. *Low
   impact* — judgment call.

3. **`SendInviteCard` + `CodesCard` 2-column grid (`1fr_360px`) is
   in-spec, but the codes column at Wide reads as a sidebar.** Same
   trick as P3 with the operator-preview, except here the codes ARE
   the operational content. Defensible — but at Wide the gap between
   the two cards (`gap-5`) could grow to `gap-8` or `gap-10` so the
   layout reads as "two cards on a settings page" rather than "form
   + sidebar." *Low impact.*

**Suggested treatment:**
Lift the H1 with `clamp(28px, 2.5vw, 44px)`. Bump grid gap at 2xl
(`2xl:gap-8` or `2xl:gap-10`). Leave the faux nav alone (decide later
whether to invest in real nav). No structural change.

**Anti-pattern check (sampled, narrower):**
- [ ] No marketing footer
- [ ] No celebration headline
- [ ] Type breathes at Wide

---

## Edge — Invalid code (CodeEntryScreen with `?bad=1`)

**Pattern match:** [06-error-and-edge](../../tatch-wide-reference/patterns/06-error-and-edge.md)

The route reuses `CodeEntryScreen.tsx` with an initial error message —
so the architectural audit is identical to P0/B Code entry above. The
error treatment itself (red border tint on the input, `text-error` at
12.5px below) is in-spec per `06-error-and-edge.md` ("Red is allowed
as a *thin* inline accent at low saturation, never as a fill").

**Coupled to P0/B's screen-pass** — fixing P0/B fixes this one. No
separate audit entry.

---

## Edge — Used invite ([AlreadyUsedScreen.tsx](../src/components/onboarding/AlreadyUsedScreen.tsx))

**Pattern match:** [06-error-and-edge](../../tatch-wide-reference/patterns/06-error-and-edge.md)

**Top 3 issues at Wide:**

1. **Stack is left-aligned in the standard shell column (1280px @2xl)
   and starts at the top.** Pattern: "single centered column… stack
   sits 32–40% from the top — slightly higher than the standard hero
   so the empty space below doesn't feel like 'we're hiding the
   problem.'" Today the stack pins top-left of an oversized canvas.
   *High impact.*

2. **Headline is H2 (24px).** Pattern: 32–40px (`clamp(28px, 2.6vw, 40px)`),
   same scale as a regular screen title. H2 at 24 reads as undersized
   for an edge-state moment. *Medium impact.*

3. **Glyph + headline + body + buttons stack is OK but the headline-
   to-body spacing (`mt-3`) is tight for Wide.** Pattern wants
   generous vertical rhythm so the screen reads as deliberate rather
   than apologetic. *Low impact.*

**Suggested treatment:**
Center the stack horizontally; vertically position at ~32–40% from
the top of the canvas. Lift the headline to `clamp(28px, 2.6vw, 40px)`.
Keep the glyph as-is (calm, monochrome, no red — spec-correct). Keep
microcopy as-is ("ask your operator to send a fresh TatchLink" — names
the human, no error code, no apology essay). Optionally add the small
"Tatch · powered by {operator}" microcopy line pinned 32px from the
bottom for consistency with the rest of the flow.

**Anti-pattern check:**
- [ ] No red background or panel
- [ ] No error code in primary copy
- [ ] Headline ≤ 40px
- [ ] No apology essay

---

## Prioritized worklist for Stage 3

Ordered by impact × confidence. **Cap at 4 screens** for the first
implementation pass; everything below can be a second pass once Rob's
seen the first four land.

1. **P5 — Invite team** *(largest visible defect)*
   Kill the table layout, drop to the stacked-card composition at all
   viewports, cap form column at 520px, stack the footer. This is the
   most acute violation of form-as-conversation and the change with
   the highest "before/after" delta at Wide.

2. **P1 — Welcome** *(sets the tone for the flow)*
   Add a `2xl:max-w-[840px]` cap on the hero column wrapper, decide on
   the feature-card row (cut at Wide is the cleanest read; cap-and-stack
   inside the 840 is the fallback), move H1 to fluid clamp. This is the
   first screen reviewers see — getting the cap-and-center posture right
   here makes the rest of the flow read as deliberate.

3. **P3 — Business profile** *(direct user instruction + structural cleanup)*
   Cut `OperatorPreviewCard` and the `lg:grid lg:grid-cols-[...]`
   wrapper around it; the form's existing 520px cap then sits inside the
   shell's outer margin. Position H1 ~12–15% from top. Easy to verify
   because the side-pane disappears entirely.

4. **P4 — Discovery** *(grid-count violation)*
   Lock service tiles to 4-up at all viewports ≥ lg (drop the
   `2xl:grid-cols-8`), decide on the tech-slider placement, cap form
   column. This is a small diff with a meaningful posture shift.

### Held for second pass (in this order)

5. **P6 — Activating** — replace spinner with breathing focal element,
   tighten beat timing, add reduced-motion. Self-contained but
   touches motion choices Rob may want to review separately.
6. **P7 — Connected (both branches)** — lift H1 with clamp, promote
   operator-attribution line, demote/cut ConnectionSummary.
7. **P0/B — Code entry + Edge: Invalid code** — center the focal
   column vertically + horizontally, lift input cap toward 440px.
8. **P2 — Auth (phone + email)** — vertical-center within the right
   pane, lift H1 with clamp.
9. **Edge — Used invite** — center the stack, bump headline to
   32–40px.
10. **O1 — Operator invite** — H1 lift + grid-gap bump only.

Stopping here for Rob's review. After approval (and any re-ordering),
Stage 3 implements one screen per commit, pushes to
`claude/wide-viewport-pass`, returns a Vercel preview URL per screen,
and waits for confirmation before the next.
