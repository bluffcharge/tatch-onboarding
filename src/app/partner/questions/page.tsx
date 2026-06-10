import { Suspense } from "react";
import { QuestionsScreen } from "@/components/partner/QuestionsScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuestionsScreen />
    </Suspense>
  );
}
