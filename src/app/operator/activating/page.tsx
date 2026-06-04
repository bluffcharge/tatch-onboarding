import { Suspense } from "react";
import { ActivatingScreen } from "@/components/operator/ActivatingScreen";
export default function Page() {
  return <Suspense fallback={null}><ActivatingScreen /></Suspense>;
}
