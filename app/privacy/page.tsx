import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-slate-300">
          Verdansc collects only the information needed to provide screening,
          payment, and service workflow features. Sensitive data is handled
          through secured systems and is not sold to third parties.
        </p>
        <p className="mt-3 text-slate-300">
          We use service providers for payment processing and infrastructure.
          Access is restricted to authorized users and logged for audit and
          operational safety.
        </p>
        <p className="mt-3 text-slate-300">
          If you need account data updates or deletion requests, contact our
          support channel listed on the main site.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
        >
          Back to map
        </Link>
      </section>
    </main>
  );
}
