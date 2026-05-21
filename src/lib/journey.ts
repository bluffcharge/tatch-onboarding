/**
 * Canonical partner-onboarding journey. Each step is a milestone the
 * partner moves through from invite-link tap to connected. Drives the
 * vertical JourneyTimeline rail rendered by OnboardingShell on wider
 * viewports — Kastamer-style.
 */
import {
  BadgeCheck,
  Building2,
  CheckCheck,
  ListChecks,
  ShieldCheck,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export type JourneyKey =
  | "welcome"
  | "auth"
  | "business"
  | "discovery"
  | "team"
  | "done";

export type JourneyStep = {
  key: JourneyKey;
  label: string;
  desc: string;
  icon: LucideIcon;
};

export const PARTNER_JOURNEY: JourneyStep[] = [
  { key: "welcome",   label: "Welcome",          desc: "Your invite",                 icon: Sparkles    },
  { key: "auth",      label: "Sign in",          desc: "Verify your identity",        icon: ShieldCheck },
  { key: "business",  label: "Business profile", desc: "Name, address, contact",      icon: Building2   },
  { key: "discovery", label: "About your team",  desc: "A few quick questions",       icon: ListChecks  },
  { key: "team",      label: "Invite teammates", desc: "Optional",                    icon: UserPlus    },
  { key: "done",      label: "You're connected", desc: "All set",                     icon: BadgeCheck  },
];

export function getStepIndex(key: JourneyKey): number {
  return PARTNER_JOURNEY.findIndex((s) => s.key === key);
}

// Re-export for components that need the completion glyph independent of step.
export { CheckCheck };
