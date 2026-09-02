import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch Deck",
  description:
    "VERDANSC marketplace pitch: tenants search, credit-check, and apply; landlords list properties in Albuquerque and Rio Rancho.",
};

export default function PitchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
