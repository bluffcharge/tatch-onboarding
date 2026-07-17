import { notFound } from "next/navigation";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { AlreadyUsedScreen } from "@/components/onboarding/AlreadyUsedScreen";
import { ConnectAccountScreen } from "@/components/onboarding/ConnectAccountScreen";
import { InviteSessionWriter } from "@/lib/InviteSessionWriter";
import { resolveInvite } from "@/lib/mockInvite";

/* Invite-token entry. In production, /j/<token> would resolve to a row
   in the API that carries the inviter, operator, optional linked
   company, and any pre-fill the operator typed. Here we mock the
   resolution from URL query params so the operator side can demo the
   contract by appending them to the invite URL it generates:
     ?co=<companyId>   — link to an existing company (skip P3 create)
     ?existing=1       — token resolves to an existing Tatch account
     ?fn=<firstName>   — pre-fill first name
     ?ln=<lastName>    — pre-fill last name
     ?email=<email>    — pre-fill email
     ?phone=<phone>    — pre-fill phone
   These also get picked up by the client-side `useInvite()` hook on
   subsequent screens (it persists the invite session in sessionStorage
   so we don't have to thread params through every navigation). */
export default function JoinByToken({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: {
    co?: string;
    existing?: string;
    fn?: string;
    ln?: string;
    email?: string;
    phone?: string;
  };
}) {
  // Mocked: "used" token => already-used error. Anything else resolves to the default invite.
  if (params.token === "used") {
    return <AlreadyUsedScreen />;
  }
  if (!params.token) return notFound();

  // Mocked: "existing" token (or ?existing=1) => the token resolved to
  // someone who already has a Tatch account. Per the notifications
  // catalog's rec-company-invite row, that's a confirm/decline decision
  // — no signup wizard — so we branch to the connect screen instead of
  // the welcome hero.
  const existing = params.token === "existing" || searchParams.existing === "1";
  const invite = resolveInvite({
    existing,
    co: searchParams.co,
    prefill: {
      firstName: searchParams.fn,
      lastName: searchParams.ln,
      email: searchParams.email,
      phone: searchParams.phone,
    },
  });
  return (
    <>
      {/* Persist the server-resolved invite to sessionStorage so the
          downstream onboarding screens — which live on different URLs
          and don't see the original `?co=` / `?fn=` / etc. query params —
          can read it via `useInvite()`. Renders nothing. */}
      <InviteSessionWriter invite={invite} />
      {existing ? (
        <ConnectAccountScreen invite={invite} token={params.token} />
      ) : (
        <WelcomeScreen invite={invite} token={params.token} />
      )}
    </>
  );
}
