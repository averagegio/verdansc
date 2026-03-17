"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AccountFields = {
  email: string;
  username: string;
  password: string;
};

type PaymentFields = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

type ChargeResponse = {
  ok: boolean;
  message: string;
  paymentId?: string;
};

const CHECK_PRICE = 19;

export default function CreditCheckPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [account, setAccount] = useState<AccountFields>({
    email: "",
    username: "",
    password: "",
  });
  const [payment, setPayment] = useState<PaymentFields>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [error, setError] = useState("");
  const [charging, setCharging] = useState(false);
  const [result, setResult] = useState<ChargeResponse | null>(null);
  const [checkingReport, setCheckingReport] = useState(false);
  const [reportError, setReportError] = useState("");
  const [report, setReport] = useState<unknown>(null);

  const onAccountNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setReport(null);
    setReportError("");

    if (!account.email || !account.username || !account.password) {
      setError("Please fill out email, username, and password.");
      return;
    }

    if (account.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStep(2);
  };

  const onCharge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setReport(null);
    setReportError("");

    if (
      !payment.cardName ||
      !payment.cardNumber ||
      !payment.expiry ||
      !payment.cvc
    ) {
      setError("Please complete all credit card fields.");
      return;
    }

    setCharging(true);

    try {
      const response = await fetch("/api/stripe/credit-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: account.email,
          username: account.username,
          amount: CHECK_PRICE,
          cardLast4: payment.cardNumber.replace(/\s/g, "").slice(-4),
        }),
      });

      const payload = (await response.json()) as ChargeResponse;
      if (!response.ok) {
        setError(payload.message ?? "Payment request failed.");
        return;
      }

      setResult(payload);

      setCheckingReport(true);
      const reportResponse = await fetch("/api/credit-check", {
        method: "GET",
        cache: "no-store",
      });
      const reportPayload = (await reportResponse.json()) as unknown;

      if (!reportResponse.ok) {
        setReportError("Payment went through, but credit report lookup failed.");
      } else {
        setReport(reportPayload);
      }
    } catch {
      setError("Could not process payment. Please try again.");
    } finally {
      setCharging(false);
      setCheckingReport(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            API Service - Finance
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Credit Check API
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Create an account, complete payment, then run a credit check
            request. This form uses a Stripe-style endpoint for secure charge
            simulation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Soft and hard inquiry support
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Fraud checks and affordability scoring
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Transaction-ready approval summary
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Payment-gated report request flow
            </div>
          </div>
        </article>

        <aside className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <h2 className="text-lg font-semibold text-cyan-100">
            {step === 1 ? "Step 1: Account Setup" : "Step 2: Payment"}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {step === 1
              ? "Enter user credentials before payment."
              : `Enter card details to pay $${CHECK_PRICE} for a credit check.`}
          </p>

          {step === 1 ? (
            <form className="mt-4 space-y-3" onSubmit={onAccountNext}>
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="email"
                placeholder="Email"
                value={account.email}
                onChange={(event) =>
                  setAccount({ ...account, email: event.target.value })
                }
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Create username"
                value={account.username}
                onChange={(event) =>
                  setAccount({ ...account, username: event.target.value })
                }
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="password"
                placeholder="Password"
                value={account.password}
                onChange={(event) =>
                  setAccount({ ...account, password: event.target.value })
                }
              />
              <button
                type="submit"
                className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
              >
                Continue to payment
              </button>
            </form>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={onCharge}>
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Name on card"
                value={payment.cardName}
                onChange={(event) =>
                  setPayment({ ...payment, cardName: event.target.value })
                }
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Card number"
                value={payment.cardNumber}
                onChange={(event) =>
                  setPayment({ ...payment, cardNumber: event.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="text"
                  placeholder="MM/YY"
                  value={payment.expiry}
                  onChange={(event) =>
                    setPayment({ ...payment, expiry: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="text"
                  placeholder="CVC"
                  value={payment.cvc}
                  onChange={(event) =>
                    setPayment({ ...payment, cvc: event.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex rounded-md border border-slate-500/50 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/30"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
                  disabled={charging}
                >
                  {charging ? "Processing..." : `Pay $${CHECK_PRICE}`}
                </button>
              </div>
            </form>
          )}

          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          {result ? (
            <p className="mt-3 text-sm text-emerald-300">
              {result.message} {result.paymentId ? `ID: ${result.paymentId}` : ""}
            </p>
          ) : null}
          {checkingReport ? (
            <p className="mt-3 text-sm text-cyan-200">Generating credit report...</p>
          ) : null}
          {reportError ? (
            <p className="mt-3 text-sm text-amber-300">{reportError}</p>
          ) : null}
          {report ? (
            <div className="mt-3 rounded-lg border border-cyan-300/30 bg-slate-950/70 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
                Credit report result
              </p>
              <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900/80 p-3 text-xs text-cyan-100">
                {JSON.stringify(report, null, 2)}
              </pre>
            </div>
          ) : null}

          <div className="mt-6 rounded-lg border border-cyan-300/30 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Suggested endpoint
            </p>
            <code className="mt-2 block text-sm text-cyan-100">
              /api/credit-check
            </code>
            <code className="mt-2 block text-sm text-cyan-100">
              /api/stripe/credit-check
            </code>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
          >
            Back to map
          </Link>
        </aside>
      </section>
    </main>
  );
}
