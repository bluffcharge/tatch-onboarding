import { Suspense } from "react";
import { ActivatingScreen } from "@/components/partner/ActivatingScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ActivatingScreen />
    </Suspense>
  );
}
