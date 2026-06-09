import { Suspense } from "react";
import { CreateAccountBusinessScreen } from "@/components/operator/CreateAccountBusinessScreen";
export default function Page() {
  return <Suspense fallback={null}><CreateAccountBusinessScreen /></Suspense>;
}
