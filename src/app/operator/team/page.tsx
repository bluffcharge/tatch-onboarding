import { Suspense } from "react";
import { InviteTeamScreen } from "@/components/operator/InviteTeamScreen";
export default function Page() {
  return <Suspense fallback={null}><InviteTeamScreen /></Suspense>;
}
