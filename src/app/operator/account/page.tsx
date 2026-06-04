import { Suspense } from "react";
import { CreateAccountScreen } from "@/components/operator/CreateAccountScreen";
export default function Page() {
  return <Suspense fallback={null}><CreateAccountScreen /></Suspense>;
}
