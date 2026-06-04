import { Suspense } from "react";
import { ChoosePlanScreen } from "@/components/operator/ChoosePlanScreen";
export default function Page() {
  return <Suspense fallback={null}><ChoosePlanScreen /></Suspense>;
}
