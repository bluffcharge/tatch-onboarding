import { Suspense } from "react";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";

export default function DonePage() {
  return (
    <Suspense fallback={null}>
      <SuccessScreen />
    </Suspense>
  );
}
