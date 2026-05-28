# Wide-viewport audit — followups

Items spotted during Stage 3 implementation that aren't part of the
active screen-pass. Each entry names the screen, the observation, and
why it was deferred. Format: `[screen] — observation — deferred because`.

## P5 — Invite team

- **`OnboardingShell`'s internal footer cap is fixed at `lg:max-w-[400px]`
  with no 2xl expansion** ([OnboardingShell.tsx:69](../src/components/onboarding/OnboardingShell.tsx#L69)
  and again at line 134). At Wide the form body column caps at 520px
  per the P5 fix, but the CTA below renders at 400px — a small
  inconsistency (the pre-existing lg behavior had a wider 696px form +
  400px CTA, so this is actually less mismatched than before). Pattern
  03 specifies the primary button is "100% width of the form column,"
  so the ideal end-state is a `2xl:max-w-[520px]` (or `2xl:max-w-none`
  with a screen-supplied wrapper) on the shell's footer cap. Deferred
  because the shell is shared by P2 Auth + P4 Discovery and changing
  it mid-screen-pass would expand the blast radius beyond P5.

## Tooling / session-scoped notes (not for any screen)

- **Worktree `node_modules` is symlinked** to `../../../node_modules`
  (the main checkout's installed dependencies) so the dev server can
  run against the worktree's source. Not committed (gitignored). Will
  be removed when the worktree is released via
  `./.coordination/release wide-viewport-pass --remove-worktree`.

- **Parent `Tatch/.claude/launch.json` has a new
  `tatch-wide-viewport-pass` entry** added so the preview tool can
  start the dev server against this worktree. That file lives in a
  different repo (`/Users/rob/Claude CoWork/Tatch/`) and is outside the
  audit prompt's strict scope; the change is tooling-only, follows the
  established convention in that file (~20 prior worktree entries), and
  doesn't touch tatch-onboarding source. Flagging because the addition
  is outside the audit branch and won't be reverted by releasing this
  worktree.
