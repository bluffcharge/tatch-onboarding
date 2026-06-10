import "./operator.css";

/**
 * Route-group layout for the partner signup wizard. Wraps every /partner/*
 * screen in `.operator-root` so the "Tatch Creative Roadmap" brand
 * (Urbanist, ink-on-white, black CTAs) — ported from the operator signup —
 * is scoped here and never leaks into the DIS-branded P1 welcome screens.
 */
export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="operator-root">{children}</div>;
}
