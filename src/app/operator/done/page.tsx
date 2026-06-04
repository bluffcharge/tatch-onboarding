import { Suspense } from "react";
import { AllSetScreen } from "@/components/operator/AllSetScreen";
export default function Page() {
  return <Suspense fallback={null}><AllSetScreen /></Suspense>;
}
