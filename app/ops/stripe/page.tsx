import Link from "next/link";
import UnlockForm from "./UnlockForm";
import { countLoggedStripePayments } from "../../lib/stripePaymentLog";
import {
  founderOpsEmails,
  isOpsAccessConfigured,
  isOpsSecretConfigured,
  readOpsAuthFromCookies,
} from "../../lib/stripeOpsAuth";
import {
  formatStripeAmount,
  formatStripeTimestamp,
  listRecentStripeTransactions,
  stripeProductLabel,
  type StripeProductKind,
} from "../../lib/stripeTransactions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (
    normalized === "succeeded" ||
    normalized === "paid" ||
    normalized === "complete" ||
    normalized === "active"
  ) {
    return "border-emerald-300/40 bg-emerald-900/20 text-emerald-200";
  }
  if (
    normalized === "processing" ||
    normalized === "pending" ||
    normalized === "unpaid" ||
    normalized.includes("requires")
  ) {
    return "border-amber-300/40 bg-amber-900/20 text-amber-200";
  }
  if (normalized === "canceled" || normalized === "failed") {
    return "border-rose-300/40 bg-rose-900/20 text-rose-200";
  }
  return "border-slate-400/40 bg-slate-900/20 text-slate-200";
}

function productClass(product: StripeProductKind) {
  if (product === "credit_check") return "text-cyan-200";
  if (product === "rental_application") return "text-teal-200";
  if (product === "membership") return "text-sky-200";
  return "text-slate-300";
}

export default async function StripeOpsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const auth = await readOpsAuthFromCookies();
  const secretConfigured = isOpsSecretConfigured();
  const founderConfigured = founderOpsEmails().length > 0;

  if (!auth.ok) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <section className="mx-auto w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-8 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Internal ops
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Stripe monitor</h1>
          <p className="mt-3 text-sm text-slate-300">
            This surface lists live Verdansc Checkout and PaymentIntent activity.
            It is not public marketing and is blocked from indexing.
          </p>
          {!isOpsAccessConfigured() ? (
            <p className="mt-4 rounded-xl border border-slate-500/40 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
              Access is locked until{" "}
              <code className="text-cyan-200">STRIPE_OPS_SECRET</code> or{" "}
              <code className="text-cyan-200">STRIPE_OPS_EMAIL</code> is set in
              the server environment. Do not put secrets in the repository or a
              pull request.
            </p>
          ) : null}
          <UnlockForm
            invalid={params.error === "invalid"}
            secretConfigured={secretConfigured}
            founderConfigured={founderConfigured}
          />
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-slate-500/60 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
          >
            Back to map
          </Link>
        </section>
      </main>
    );
  }

  const result = await listRecentStripeTransactions();
  const webhookLogCount = await countLoggedStripePayments().catch(() => 0);
  const succeeded = result.transactions.filter((row) =>
    ["succeeded", "paid", "complete"].includes(row.status.toLowerCase()),
  );
  const succeededTotal = succeeded.reduce((sum, row) => sum + row.amountCents, 0);
  const byProduct = result.transactions.reduce(
    (counts, row) => {
      counts[row.product] += 1;
      return counts;
    },
    {
      credit_check: 0,
      rental_application: 0,
      membership: 0,
      other: 0,
    } as Record<StripeProductKind, number>,
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Internal ops
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Stripe monitor</h1>
          <p className="mt-2 text-sm text-slate-300">
            Recent PaymentIntents plus unmatched Checkout Sessions. Source is the
            Stripe list API — this page does not invent charges.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em]">
            <span className="rounded-md border border-cyan-300/40 bg-cyan-900/20 px-3 py-1 text-cyan-100">
              Mode: {result.mode}
            </span>
            <span className="rounded-md border border-cyan-300/40 bg-cyan-900/20 px-3 py-1 text-cyan-100">
              Auth: {auth.method === "founder_session" ? "founder session" : "ops secret"}
            </span>
            <span className="rounded-md border border-slate-500/50 px-3 py-1 text-slate-200">
              Fetched {result.fetchedAt}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/ops/stripe"
              className="inline-flex min-h-11 items-center rounded-md border border-cyan-300/50 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              Refresh
            </Link>
            <form method="post" action="/ops/stripe/logout">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-md border border-slate-500/60 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
              >
                Lock
              </button>
            </form>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-md border border-slate-500/60 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
            >
              Back to map
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Listed objects
            </p>
            <p className="mt-2 text-2xl font-semibold">{result.transactions.length}</p>
          </article>
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Succeeded total
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {formatStripeAmount(succeededTotal, "usd")}
            </p>
            <p className="mt-1 text-xs text-slate-400">{succeeded.length} succeeded / paid</p>
          </article>
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Product mix
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Credit check {byProduct.credit_check} · Apps {byProduct.rental_application} ·
              Memberships {byProduct.membership}
            </p>
          </article>
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Webhook log
            </p>
            <p className="mt-2 text-2xl font-semibold">{webhookLogCount}</p>
            <p className="mt-1 text-xs text-slate-400">
              Idempotent successful-payment events
            </p>
          </article>
        </section>

        {!result.ok ? (
          <p className="rounded-xl border border-amber-300/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-100">
            {result.message}
          </p>
        ) : null}

        <section className="overflow-x-auto rounded-2xl border border-cyan-400/30 bg-slate-900/65">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-cyan-400/20 text-xs uppercase tracking-[0.14em] text-cyan-300">
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Object</th>
              </tr>
            </thead>
            <tbody>
              {result.transactions.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-slate-400" colSpan={6}>
                    {result.configured
                      ? "No PaymentIntents or Checkout Sessions returned from Stripe yet."
                      : result.message}
                  </td>
                </tr>
              ) : (
                result.transactions.map((row) => (
                  <tr
                    key={`${row.object}-${row.id}`}
                    className="border-b border-slate-800/80 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {formatStripeAmount(row.amountCents, row.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md border px-2 py-1 text-xs uppercase tracking-[0.12em] ${statusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatStripeTimestamp(row.created)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {row.customerEmail ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm ${productClass(row.product)}`}>
                        {stripeProductLabel(row.product)}
                      </p>
                      <p className="text-xs text-slate-400">{row.description}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {row.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
