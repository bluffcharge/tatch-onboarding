import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DevPalette } from "@/components/dev/DevPalette";

export const metadata: Metadata = {
  title: "Tatch Operator Console — canvas",
  description:
    "Breakpoint walkthrough of the Tatch operator console half-MVP — Dash, Leads, Records, and Wallet — across phone, tablet, laptop, desktop, and wide.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // When the on-screen keyboard opens on a phone, resize the layout
  // viewport (so 100dvh shrinks to the area above the keyboard). Combined
  // with the dvh-based min-heights + vertical centering on the input
  // screens, the content slides up to stay above the keyboard instead of
  // being covered by it.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFCFC" },
    { media: "(prefers-color-scheme: dark)",  color: "#27292C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <DevPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
