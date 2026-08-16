import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch Deck",
  description:
    "VERDANSC seed pitch: map-first real estate services, MAU projections, growth strategy, and funding ask.",
};

export default function PitchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
