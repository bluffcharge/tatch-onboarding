import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DevPalette } from "@/components/dev/DevPalette";

export const metadata: Metadata = {
  title: "Tatch — get connected",
  description:
    "Join the Tatch referral network. Set up your account, connect to your operator, invite your team.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
