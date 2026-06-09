import { Suspense } from "react";
import { VerifyEmailScreen } from "@/components/operator/VerifyEmailScreen";
export default function Page() {
  return <Suspense fallback={null}><VerifyEmailScreen /></Suspense>;
}
