import { Suspense } from "react";
import { AboutYouScreen } from "@/components/operator/AboutYouScreen";
export default function Page() {
  return <Suspense fallback={null}><AboutYouScreen /></Suspense>;
}
