import { TicketWelcomeScreen } from "@/components/onboarding/TicketWelcomeScreen";
import { resolveInvite } from "@/lib/mockInvite";

export default function TicketWelcome() {
  const invite = resolveInvite();
  return <TicketWelcomeScreen invite={invite} />;
}
