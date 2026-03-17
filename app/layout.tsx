import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://verdansc.com"),
  title: {
    default: "VERDANSC",
    template: "%s | VERDANSC",
  },
  description:
    "Map-first real estate services platform for credit checks, 3D tours, agreements, escrow workflows, and broker matching.",
  applicationName: "VERDANSC",
  keywords: [
    "real estate",
    "credit check",
    "tenant screening",
    "escrow",
    "broker services",
    "energy audits",
  ],
  openGraph: {
    title: "VERDANSC",
    description:
      "Unified real estate service platform for faster approvals and better transaction workflows.",
    url: "https://verdansc.com",
    siteName: "VERDANSC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VERDANSC",
    description:
      "Unified real estate service platform for faster approvals and better transaction workflows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
