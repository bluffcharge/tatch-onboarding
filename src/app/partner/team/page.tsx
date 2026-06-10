import { Suspense } from "react";
import { InviteTeamScreen } from "@/components/partner/InviteTeamScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InviteTeamScreen />
    </Suspense>
  );
}
