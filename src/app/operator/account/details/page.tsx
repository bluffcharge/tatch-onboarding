import { Suspense } from "react";
import { CreateAccountDetailsScreen } from "@/components/operator/CreateAccountDetailsScreen";
export default function Page() {
  return <Suspense fallback={null}><CreateAccountDetailsScreen /></Suspense>;
}
