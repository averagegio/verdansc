import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-4 text-slate-300">
          Verdansc provides software workflows and partner integrations to help
          with real estate operations. By using this service, you agree to use
          it only for lawful purposes and authorized screening workflows.
        </p>
        <p className="mt-3 text-slate-300">
          Users are responsible for the accuracy of submitted information and
          for compliance with applicable housing, tenant-screening, and privacy
          regulations in their jurisdiction.
        </p>
        <p className="mt-3 text-slate-300">
          Service availability and features may change over time. Continued use
          of the platform indicates acceptance of updated terms.
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
