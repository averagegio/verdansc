import Link from "next/link";
type CreditCheckSuccessPageProps = {
  searchParams?: Promise<{
    source?: string;
    payment_id?: string;
    session_id?: string;
  }>;
};

export default async function CreditCheckSuccessPage({
  searchParams,
}: CreditCheckSuccessPageProps) {
  const params = (await searchParams) ?? {};
  const source = params.source ?? "payment";
  const sessionId = params.session_id ?? "unknown";
  const confirmationId = params.payment_id ?? sessionId ?? "Confirmation pending";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Credit Check
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Payment confirmed</h1>
        <p className="mt-3 text-slate-300">
          Thanks. Your credit check request was received successfully and is now
          in review.
        </p>

        <div className="mt-6 rounded-lg border border-cyan-300/30 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
            Confirmation
          </p>
          <p className="mt-2 text-sm text-cyan-100">
            Source: {source} <br />
            ID: {confirmationId}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/credit-check"
            className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
          >
            Run another check
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
          >
            Back to map
          </Link>
        </div>
      </section>
    </main>
  );
}
