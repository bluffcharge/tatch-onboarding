import "./operator.css";

/**
 * Route-group layout for the operator signup flow. Wraps every /operator/*
 * screen in `.operator-root` so the "Tatch Creative Roadmap" brand
 * (Urbanist, ink-on-white, black CTAs) is scoped here and never leaks into
 * the existing DIS onboarding screens.
 */
export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="operator-root">{children}</div>;
}
