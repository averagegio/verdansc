import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outreach ops",
  description:
    "Internal Verdansc outreach board for the Sep 3–9 2026 calendar. Human-marked status only — this page does not send posts or email.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
