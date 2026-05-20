import { notFound } from "next/navigation";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { AlreadyUsedScreen } from "@/components/onboarding/AlreadyUsedScreen";
import { resolveInvite } from "@/lib/mockInvite";

export default function JoinByToken({ params }: { params: { token: string } }) {
  // Mocked: "used" token => already-used error. Anything else resolves to the default invite.
  if (params.token === "used") {
    return <AlreadyUsedScreen />;
  }
  if (!params.token) return notFound();
  const invite = resolveInvite();
  return <WelcomeScreen invite={invite} />;
}
