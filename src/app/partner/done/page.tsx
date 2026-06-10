import { Suspense } from "react";
import { AllSetScreen } from "@/components/partner/AllSetScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AllSetScreen />
    </Suspense>
  );
}
