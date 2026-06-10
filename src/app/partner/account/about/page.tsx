import { Suspense } from "react";
import { AboutYouScreen } from "@/components/partner/AboutYouScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AboutYouScreen />
    </Suspense>
  );
}
