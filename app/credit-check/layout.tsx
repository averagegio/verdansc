import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Check",
  description:
    "Get a fast, secure credit check for rental or buyer readiness. Create your account, pay once, and access your report summary.",
};

export default function CreditCheckLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
