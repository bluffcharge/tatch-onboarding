import { Suspense } from "react";
import { CreateAccountProfileScreen } from "@/components/operator/CreateAccountProfileScreen";
export default function Page() {
  return <Suspense fallback={null}><CreateAccountProfileScreen /></Suspense>;
}
