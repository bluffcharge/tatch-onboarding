import { InviteDeclinedScreen } from "@/components/onboarding/InviteDeclinedScreen";
import { resolveInvite } from "@/lib/mockInvite";

/* Terminal state after declining an invite at /j/<token> — reached from
   the inline decline confirm on both the welcome screen and the
   existing-account connect screen. Keeps the token in the URL so the
   "Accept the invite" way-back can return to the live invite. */
export default function DeclinedPage({
  params,
}: {
  params: { token: string };
}) {
  const invite = resolveInvite({ existing: params.token === "existing" });
  return <InviteDeclinedScreen invite={invite} token={params.token} />;
}
