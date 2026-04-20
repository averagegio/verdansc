import Link from "next/link";
import ServiceTopBar from "../../components/ServiceTopBar";

const CREDIT_CHECK_PROVIDER_URL = "https://www.annualcreditreport.com/index.action";
const CREDIT_CHECK_PROVIDER_NAME = "AnnualCreditReport.com";

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
      <ServiceTopBar middleLinkHref="/dashboard" middleLinkLabel="Dashboard" />
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Credit Check
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Payment confirmed</h1>
        <p className="mt-3 text-slate-300">
          Thanks. Your payment was received. You can now access your credit
          report through our trusted provider.
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

        <div className="mt-8 rounded-lg border border-emerald-300/40 bg-emerald-950/30 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
            Next step
          </p>
          <h2 className="mt-2 text-xl font-semibold text-emerald-100">
            Open your credit report
          </h2>
          <p className="mt-2 text-sm text-emerald-50/90">
            Continue to {CREDIT_CHECK_PROVIDER_NAME} to view your full report
            from Equifax, Experian, and TransUnion. This link opens in a new
            tab.
          </p>
          <a
            href={CREDIT_CHECK_PROVIDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-emerald-300/60 bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-400/20"
          >
            Continue to {CREDIT_CHECK_PROVIDER_NAME}
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-3 text-xs text-emerald-200/70">
            Save your confirmation ID above in case our support team needs to
            verify your purchase.
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
