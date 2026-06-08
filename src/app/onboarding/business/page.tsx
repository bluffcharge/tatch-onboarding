"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BusinessProfileScreen } from "@/components/onboarding/BusinessProfileScreen";
import { FinishAccountScreen } from "@/components/onboarding/FinishAccountScreen";
import { JoinCompanyScreen } from "@/components/onboarding/JoinCompanyScreen";
import { useInvite } from "@/lib/useInvite";

/* P3 has two variants in the partner-side flow:
   - default: BusinessProfileScreen — invitee creates a new company.
   - linked:  JoinCompanyScreen — invitee's contact was attached to an
              existing company on Tatch ("+ Invite User" form's Company
              field), so we confirm the join instead of asking them to
              recreate it.
   The variant is driven by `?co=<id>` carried by the operator's invite
   URL. `useInvite()` reads that from the current URL (gallery direct
   visit) or from sessionStorage (mid-flow navigation, where the entry
   route stashed it).
   Marked client-side because the variant decision needs sessionStorage
   access — server-side searchParams alone wouldn't see the `co` value
   once the user navigates past the entry route. Wrapped in Suspense
   because `useSearchParams()` requires it for the static prerender. */
export default function BusinessProfilePage() {
  return (
    <Suspense fallback={null}>
      <BusinessProfilePageInner />
    </Suspense>
  );
}

function BusinessProfilePageInner() {
  const invite = useInvite();
  const sp = useSearchParams();
  if (invite.linkedCompany) {
    return (
      <JoinCompanyScreen
        invite={invite as typeof invite & { linkedCompany: NonNullable<typeof invite.linkedCompany> }}
      />
    );
  }
  // `?v=tight` previews the confirmation-first variant of step 2.
  if (sp.get("v") === "tight") return <FinishAccountScreen />;
  return <BusinessProfileScreen />;
}
