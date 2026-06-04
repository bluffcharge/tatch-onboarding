import { Suspense } from "react";
import { PaymentScreen } from "@/components/operator/PaymentScreen";
export default function Page() {
  return <Suspense fallback={null}><PaymentScreen /></Suspense>;
}
