# Wide-viewport discovery — 2026-05-27

Stage 1 of the audit. Read-only inventory of how the `tatch-onboarding`
prototype currently behaves at the gallery's **Wide** preset (2560 × 1440).
No source edits in this stage.

## Repo confirmation

- **Repo:** `tatch-onboarding` (bluffcharge/tatch-onboarding · ships to
  `tatch-onboarding.vercel.app`).
- **Working branch:** `claude/wide-viewport-pass` (claimed via
  `.coordination/claim wide-viewport-pass`). Worktree at
  `.claude/worktrees/wide-viewport-pass`.
- **Base commit (HEAD):** `7ca3f59 Gallery: per-route Source dropdown for animated screens (#28)`
- **Last 3 commits:**
  - `7ca3f59` Gallery: per-route Source dropdown for animated screens (#28)
  - `21714f6` Gallery: stash the P1 ticket variant via a `hidden` route flag (#27)
  - `364eab2` next.config: tree-shake lucide-react via optimizePackageImports (#26)

> **Setup note for Rob:** the `tatch-wide-reference` skill lives at
> `/Users/rob/Claude CoWork/Tatch/tatch-wide-reference/` (the parent Tatch
> design-exploration repo), **not** at the audit prompt's preferred path
> `./.claude/skills/tatch-wide-reference/` inside this repo. The reference
> files are all readable and I've consulted them — flagging the path
> mismatch so the skill isn't surprised when it doesn't auto-trigger.

## Viewport mechanism

- The gallery shell ([`src/app/page.tsx`](../src/app/page.tsx))
  defines five viewport presets in a `VIEWPORTS` record (lines 113–119).
  **Wide = `width: 2560, height: 1440`** ("27\" QHD"). Order:
  phone (390) → tablet (820) → laptop (1440) → desktop (1920) → wide (2560).
- The inner screens render in an `<iframe>` sized at the **native** preset
  width (`spec.width × spec.height`), then a CSS `transform: scale()` fits
  the iframe to the available stage area (lines 480–544). That means
  responsive breakpoints inside each screen fire as if the user genuinely
  had a 2560-wide monitor — there is no media-query trickery between the
  harness and the previewed page.
- Each route is loaded with `?embed=1&t=<resetTick>` so the screen knows
  it's inside the gallery (currently unused as a styling hook; just
  reserved for future iframe-only chrome).
- **Existing Wide-specific styling:** there is no breakpoint dedicated to
  "Wide" (≥ 1920 or ≥ 2560). Screens that change at Wide do so by
  re-using Tailwind's `xl:` (1280) and `2xl:` (1536) prefixes — see
  [Screen inventory](#screen-inventory) below for the per-screen detail.

## Screen inventory

The gallery's `ALL_ROUTES` list and the patterns from
`tatch-wide-reference/SKILL.md` map onto these source files. "Current Wide
behavior" describes what fires at the `2xl:` breakpoint (1536+), because
that's the widest tier any screen targets today — at the 2560 Wide preset
the same `2xl:` rules render with extra dead canvas around them.

| Screen | File | Current Wide behavior |
|---|---|---|
| P1 — Welcome | [`src/components/onboarding/WelcomeScreen.tsx`](../src/components/onboarding/WelcomeScreen.tsx) | Wraps `OnboardingShell wide`; centered hero column grows to **1800px @2xl**. H1 stepped at fixed values: 36px → `lg:56px` → `2xl:72px` (no `clamp`). Single phone-OTP CTA capped 320px. **4-up feature-card grid** at `lg:` (`grid-cols-4 lg:gap-5 2xl:gap-6`) — each card bumps padding `p-5 → 2xl:p-6`, title `14px → 2xl:16px`, body `12.5px → 2xl:13.5px`. BrandRibbons ornament on lg+. |
| P1 — Ticket variant *(hidden)* | [`src/components/onboarding/TicketWelcomeScreen.tsx`](../src/components/onboarding/TicketWelcomeScreen.tsx) | Stashed via the gallery's `hidden: true` flag (route still reachable at `/onboarding/ticket`). Out of scope unless un-stashed. |
| P0/B — Code entry | [`src/components/onboarding/CodeEntryScreen.tsx`](../src/components/onboarding/CodeEntryScreen.tsx) | Standard shell (no `wide`); column caps at **1280px @2xl** via the shell, but the screen's own content fills only the left side — H1 + helper + input + CTA all sit left-aligned at the top of that column. Input pill capped 320px @lg, never grows. No `2xl:` rules in this file at all. |
| P2 — Auth (phone) | [`src/components/onboarding/AuthScreen.tsx`](../src/components/onboarding/AuthScreen.tsx) | Standard shell + **journey rail** (left aside, 300/340/400px at md/xl/2xl). Form column inside the right pane capped 400px @lg; OTP via `OtpInput`. H1 stepped 24 → `md:28` → `lg:32` (no `2xl:` bump). Operator-context breadcrumb pinned above the form. |
| P2 — Auth (email) | [`src/components/onboarding/AuthScreen.tsx`](../src/components/onboarding/AuthScreen.tsx) | Same shell + rail; two stacked `TextField`s (email + password) plus "Use phone instead →" / "Use Google instead →" alt-path links. |
| P3 — Business profile | [`src/components/onboarding/BusinessProfileScreen.tsx`](../src/components/onboarding/BusinessProfileScreen.tsx) | Shell `wide` + journey rail. **2-column grid at lg+:** form on the left (`max-w-520`), `OperatorPreviewCard` aside on the right (`320px @lg → 460px @2xl`, gap 12 → 20). Preview is a mocked operator-app chrome card that updates live as the partner types. Inner contact-row uses `grid-cols-[140px_1fr]` (phone+email side-by-side at md+). Sticky preview follows the form on scroll. |
| P4 — Discovery | [`src/components/onboarding/DiscoveryScreen.tsx`](../src/components/onboarding/DiscoveryScreen.tsx) | Standard shell + journey rail. **Header is a split-row at md+:** title/helper left, `TechCountSlider` card pinned top-right (260px @md → 300px @lg). Service multi-select renders as mobile `ChipGroup` below lg, **4-up `TileGroup` at lg, 8-up at 2xl** (`grid-cols-4 2xl:grid-cols-8`). Tile height fixed 88px. |
| P5 — Invite team | [`src/components/onboarding/TeamInviteScreen.tsx`](../src/components/onboarding/TeamInviteScreen.tsx) | Standard shell + journey rail. Content cap **400px @md, 696px @lg.** Below lg: stacked card per row. Lg+: **table layout** (`grid-cols-[1fr_220px_40px]`) with column headers ("Phone or email" / "Role"), row-level remove button, "Add another" footer row. Footer flips skip-link + CTA to a horizontal lockup at lg. |
| P6 — Activating | [`src/components/onboarding/ActivatingScreen.tsx`](../src/components/onboarding/ActivatingScreen.tsx) | `chrome={false}, ornament={false}`. Centered stack with `md:min-h-[80vh]` so the spinner vertically centers in the iframe. Focal: 64×64 conic-spin ring around a brand-gradient pill (`animate-spin` 1.1s + `animate-ping` 30% opacity). Two beats: "Connecting you to {operator}…" → "Adding your team contacts…" at 1.2s each, total 2.4s, then routes to P7. Copy crossfade via `transition-opacity duration-med`. |
| P7 — Connected (new) | [`src/components/onboarding/SuccessScreen.tsx`](../src/components/onboarding/SuccessScreen.tsx) | `chrome={false}`. Centered stack with `md:min-h-[80vh]`. **64px gradient pill + white checkmark** (solid fill, no draw animation), H1 + sub paragraph (`max-w-44ch`), "View connection details" disclosure that reveals a 4-row `ConnectionSummary` table. Single "Go to home" CTA capped 320px. No `2xl:` rules — entire stack stays at default size at Wide. |
| P7 — Short-circuit | [`src/components/onboarding/SuccessScreen.tsx`](../src/components/onboarding/SuccessScreen.tsx) | Same component, `?existing=1` switches headline + sub to "now connected to your account" / "Nothing else changed" copy. |
| O1 — Operator invite | [`src/components/operator/OperatorInviteScreen.tsx`](../src/components/operator/OperatorInviteScreen.tsx) | **Does NOT use `OnboardingShell`** — has its own Topbar (brand + faux nav: Dash · Leads · Records · Wallet) and content cap `max-w-1180`. 2-col lg+ grid (`1fr_360px`): left = `SendInviteCard` (chips field + outgoing-message preview + Send button), right = stacked `CodesCard`s (Company Code + BDM Code with copy/rotate/share). A `RecentInvitesCard` is defined in the file (lines 289–332) but **not currently rendered**. |
| Edge — Invalid code | [`src/components/onboarding/CodeEntryScreen.tsx`](../src/components/onboarding/CodeEntryScreen.tsx) (with `?bad=1`) | Same screen as P0/B with the error message pre-applied ("This code doesn't look right or it's expired."). Input border tints red; no shake on initial render. |
| Edge — Used invite | [`src/components/onboarding/AlreadyUsedScreen.tsx`](../src/components/onboarding/AlreadyUsedScreen.tsx) | Standard shell. **Left-aligned column** with grey-disc `CircleAlert` glyph (48px), H2 headline, body paragraph (`max-w-44ch`), Sign-in CTA + "Contact your operator" link, capped `sm:max-w-xs` (~384px). No journey rail. No 2xl bumps. |

## CSS infrastructure

- **Tailwind config** ([`tailwind.config.ts`](../tailwind.config.ts)) extends colors / fonts / radii / shadows from CSS custom properties but **does not declare any custom breakpoints.** Effective breakpoints are Tailwind's defaults:
  - `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536
  - **There is no breakpoint for ≥1920 or ≥2560.** Everything from 1536 upward shares one set of `2xl:` rules.
- **`clamp()` usage:** zero occurrences in `src/`. Type scale is stepped via discrete `lg:` / `xl:` / `2xl:` prefixes (e.g. WelcomeScreen H1: `t-h1` base → `lg:text-[56px]` → `2xl:text-[72px]`). No fluid type anywhere.
- **Container queries:** zero occurrences. No `@container`, no `container-type`, no `container-name` in any file under `src/`.
- **Global type scale** ([`src/app/globals.css`](../src/app/globals.css) `:root`): defines `--fs-display-xl: 72px` down to `--fs-micro: 9px`, plus role classes `.t-display`, `.t-h1`...`.t-caption`, `.t-mono-label`, `.t-brand-text`. Light theme (DIS) overrides type weights to `font-medium` and tightens letter-spacing on `t-display`/`t-h1`.
- **Theme tokens:** the prototype ships **two** themes, not three.
  - Light = "Dimensional Interface Schema (DIS)" — white canvas, glass-card `.bg-card` surfaces with `backdrop-filter`, blue-500 accent (`--royal-400` → `#3B82F6`), long-throw shadows.
  - Dark = "NeuroSync" — `#0A0A14` canvas with `#141424` cards, purple-500 (`#A855F7`) accent, soft purple-tinted shadows, embossed BrandRibbons sweep.
- **Shell widening recipe** ([`OnboardingShell.tsx`](../src/components/onboarding/OnboardingShell.tsx) lines 44–53):
  ```
  wide = false → max-w-[480px] md:max-w-[640px] lg:max-w-[760px]  xl:max-w-[920px]  2xl:max-w-[1280px]
  wide = true  → max-w-[480px] md:max-w-[720px] lg:max-w-[1120px] xl:max-w-[1320px] 2xl:max-w-[1800px]
  ```
  Comment on line 47 names the intent explicitly: *"so modules actually fill the canvas at Wide viewport (2560 native) instead of centering with margins."* That's the "earn the real estate" stance — which the reference pack's `principles.md` argues against for onboarding.

## The big architectural observation

The current Wide design has made a deliberate **"earn the real estate"**
choice: at `2xl:` the shell column widens (up to 1800px in `wide` mode), a
journey rail aside appears on most working screens, the P3 form gains a
live operator-preview side-pane, and the P4 tile grid expands to 8-up. The
reference pack's `principles.md` — *"For every Tatch onboarding screen,
the answer is cap-and-center"* — is the inverse stance. Reconciling those
two is the substance of Stage 2's audit.

Secondary observation: there's a **theme-name mismatch** between the
reference pack and the prototype. The pack talks about "Atmospheric /
Tatch light / Tatch dark"; this repo has DIS (light) and NeuroSync (dark).
"Atmospheric" doesn't exist. The composition guidance is theme-agnostic
so this shouldn't block the audit, but I'll surface theme-name swaps as
needed when citing pattern docs.

## Open questions for Rob

1. **Architectural stance.** The current Wide stance is "earn the real estate" (1800px column, journey rail, side-panes, 8-up grid). The reference pack's stance is "cap and center with intention" (~520–840px column, margins absorb the canvas, no sidebars). **Is the audit's job to flip the prototype to cap-and-center across the board, or to identify the screens where the current stance is defensible and the screens where it's not?** I'm assuming the former (flip toward the pack's stance) but want to confirm before Stage 2 frames the findings that way.
2. **Journey rail.** The left journey rail on P2/P3/P4/P5 is a deliberate addition that's directly called out by `anti-patterns.md` ("Don't add a sidebar with tips or preview panels"). Strict reading: remove it at Wide. Lenient reading: the rail is *progress*, not "tips/preview," and may be defensible. **Which reading do you want?**
3. **P3 operator-preview pane.** Same question, sharper case: the live "what {operator} sees" card on Business Profile is closer to a *preview* than a *progress* signal. Strict reading per pack: remove. **Keep or cut?**
4. **O1 Operator invite.** This is the one screen in scope that `principles.md` explicitly notes has *some* "earn the real estate" character (settings panel with codes + list). It also already opts out of `OnboardingShell` and uses its own 1180px-capped chrome with a faux product nav (Dash · Leads · Records · Wallet). **Is the audit scope here narrower (e.g. just the typography and the side-by-side panels at Wide) than the partner-onboarding screens?**
5. **Theme naming.** Want me to keep citing pack terms ("Atmospheric / Tatch light / Tatch dark") in the audit findings, or translate to repo terms ("DIS / NeuroSync") inline? I'll go with translating-with-a-mapping-note unless you prefer otherwise.
6. **Stage-1 deliverable location.** I'm writing this doc to `docs/wide-audit-discovery.md` on `claude/wide-viewport-pass`. Stage 3 implementation will continue on the same branch. The audit prompt asks for the branch name `wide-viewport-pass` but the repo's coordination scripts auto-prefix to `claude/wide-viewport-pass`. **OK with the auto-prefix, or do you want a manually-named `wide-viewport-pass` branch?**

Stopping here for review before Stage 2.
