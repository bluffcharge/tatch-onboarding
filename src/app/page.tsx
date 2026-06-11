import { redirect } from "next/navigation";

/* The site root IS the flow: visitors land on the partner invite welcome
   (P1), exactly as an invited partner would. The route gallery — the
   reviewer-facing index of every screen — lives at /gallery. */
export default function Root() {
  redirect("/j/abc123");
}
