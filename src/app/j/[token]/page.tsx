import { notFound } from "next/navigation";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { AlreadyUsedScreen } from "@/components/onboarding/AlreadyUsedScreen";
import { InviteSessionWriter } from "@/lib/InviteSessionWriter";
import { resolveInvite } from "@/lib/mockInvite";

/* Invite-token entry. In production, /j/<token> would resolve to a row
   in the API that carries the inviter, operator, optional linked
   company, and any pre-fill the operator typed. Here we mock the
   resolution from URL query params so the operator side can demo the
   contract by appending them to the invite URL it generates:
     ?co=<companyId>   — link to an existing company (skip P3 create)
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
  const invite = resolveInvite({
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
      <WelcomeScreen invite={invite} />
    </>
  );
}
