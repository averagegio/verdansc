import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stripe monitor",
  description: "Internal Verdansc Stripe payment monitor.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StripeOpsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
