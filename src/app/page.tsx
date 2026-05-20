import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const ROUTES: { href: string; title: string; subtitle: string }[] = [
  { href: "/j/abc123",                title: "P1 — Welcome (link entry)",   subtitle: "Partner taps the SMS/email link" },
  { href: "/join",                    title: "P0/B — Code entry",            subtitle: "Partner lands without a link and types the code" },
  { href: "/onboarding/auth",         title: "P2 — Authentication",          subtitle: "Phone OTP primary; email + Google secondary" },
  { href: "/onboarding/business",     title: "P3 — Business profile",        subtitle: "Name + address + contact" },
  { href: "/onboarding/discovery",    title: "P4 — Discovery questions",     subtitle: "Typed question array (technicians, services)" },
  { href: "/onboarding/team",         title: "P5 — Invite teammates",        subtitle: "SMS-first, optional, equal-weight Skip" },
  { href: "/onboarding/activating",   title: "P6 — Activating",              subtitle: "1–2s transition" },
  { href: "/onboarding/done",         title: "P7 — Connected (new)",         subtitle: "New-partner success copy" },
  { href: "/onboarding/done?existing=1", title: "P7 — Connected (existing)", subtitle: "Existing-partner short-circuit copy" },
  { href: "/partner-admin/invite",    title: "O1 — Operator invite UI",      subtitle: "Settings panel with codes + recent invites" },
  { href: "/join?bad=1",              title: "Edge — Invalid code",          subtitle: "Error state" },
  { href: "/j/used",                  title: "Edge — Already-used invite",   subtitle: "Error state" },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <div className="safe-pt mx-auto max-w-[920px] px-5 pb-12 pt-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="t-mono-label mb-2">tatch onboarding · prototype</p>
            <h1 className="t-display text-ink-title" style={{ fontFamily: "var(--font-display)" }}>
              Route gallery
            </h1>
            <p className="t-body mt-3 max-w-[60ch]">
              Hi-fi click-through of the partner onboarding flow (P1 → P7) plus the
              operator-side invite UI (O1). Mobile-first. Light + dark themes share
              the same components and tokens. No backend — all state is mocked or
              query-string toggled.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group block rounded-lg border border-border bg-card p-4 shadow-xs transition-colors duration-fast ease-snap hover:border-strong hover:bg-subtle"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="t-h4 text-ink-title">{r.title}</span>
                  <span className="t-caption text-ink-caption">{r.href}</span>
                </div>
                <p className="t-body mt-1 text-ink-subtitle">{r.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mt-10 border-t border-border-subtle pt-5">
          <p className="t-caption">
            Spec: <code className="rounded-xs bg-subtle px-1.5 py-0.5">~/Desktop/SUX/Tatch-Onboarding-Plan.md</code>.
            Design tokens: <code className="rounded-xs bg-subtle px-1.5 py-0.5">~/Claude CoWork/Tatch/design-system/colors_and_type.css</code>.
          </p>
        </footer>
      </div>
    </div>
  );
}
