"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import ServiceTopBar from "../components/ServiceTopBar";
import { trackEvent } from "../lib/analytics";

type DetailsFields = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  dob: string;
  ssnLast4: string;
  acceptedConsent: boolean;
};

type ChargeResponse = {
  ok: boolean;
  message: string;
  paymentId?: string;
  checkoutUrl?: string | null;
  mode?: "mock" | "stripe-checkout";
};

const CHECK_PRICE = 19;

export default function CreditCheckPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<DetailsFields>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    dob: "",
    ssnLast4: "",
    acceptedConsent: false,
  });
  const [error, setError] = useState("");
  const [charging, setCharging] = useState(false);
  const [result, setResult] = useState<ChargeResponse | null>(null);
  const [checkingReport, setCheckingReport] = useState(false);
  const [reportError, setReportError] = useState("");
  const [report, setReport] = useState<unknown>(null);

  const isDetailsValid =
    details.fullName.trim().length > 1 &&
    details.email.trim().length > 0 &&
    details.phone.trim().length >= 10 &&
    details.addressLine1.trim().length > 3 &&
    details.city.trim().length > 1 &&
    details.state.trim().length > 1 &&
    details.postalCode.trim().length >= 5 &&
    /^\d{4}$/.test(details.ssnLast4) &&
    details.dob.trim().length > 0 &&
    details.acceptedConsent;

  useEffect(() => {
    trackEvent("credit_check_view", { page: "/credit-check" });
  }, []);

  const onDetailsNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setReport(null);
    setReportError("");

    if (!isDetailsValid) {
      setError("Please complete all required details and consent to continue.");
      return;
    }

    trackEvent("credit_check_account_continue", {
      hasEmail: details.email.trim().length > 0,
      hasFullName: details.fullName.trim().length > 0,
      hasAddress: details.addressLine1.trim().length > 0,
    });
    setStep(2);
  };

  const onCharge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setReport(null);
    setReportError("");

    setCharging(true);
    trackEvent("credit_check_payment_submit", { amount: CHECK_PRICE });

    try {
      const response = await fetch("/api/stripe/credit-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: details.email,
          username:
            details.email.split("@")[0] || details.fullName.replace(/\s+/g, "_"),
          amount: CHECK_PRICE,
        }),
      });

      const payload = (await response.json()) as ChargeResponse;
      if (!response.ok) {
        setError(payload.message ?? "Payment request failed.");
        trackEvent("credit_check_payment_error", { stage: "payment_request" });
        return;
      }

      setResult(payload);

      if (payload.checkoutUrl) {
        trackEvent("credit_check_redirect_stripe", {
          mode: payload.mode ?? "stripe-checkout",
        });
        window.location.assign(payload.checkoutUrl);
        return;
      }

      setCheckingReport(true);
      const reportResponse = await fetch("/api/credit-check", {
        method: "GET",
        cache: "no-store",
      });
      const reportPayload = (await reportResponse.json()) as unknown;

      if (!reportResponse.ok) {
        setReportError("Payment went through, but credit report lookup failed.");
        trackEvent("credit_check_payment_error", { stage: "report_fetch" });
      } else {
        setReport(reportPayload);
        const paymentId = payload.paymentId ?? "pending";
        trackEvent("credit_check_payment_success", {
          source: "mock",
          paymentId,
          amount: CHECK_PRICE,
        });
        router.push(
          `/credit-check/success?source=mock&payment_id=${encodeURIComponent(paymentId)}`,
        );
      }
    } catch {
      setError("Could not process payment. Please try again.");
      trackEvent("credit_check_payment_error", { stage: "network" });
    } finally {
      setCharging(false);
      setCheckingReport(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <ServiceTopBar />
      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Consumer Credit Service
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Get Your Credit Check in Minutes
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Built for renters, buyers, landlords, and agents. Create your
            account, complete secure checkout, and receive your report summary
            right away.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              One-time payment: ${CHECK_PRICE}
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Secure checkout with Stripe
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Instant report summary after payment
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Useful for rental and buyer readiness
            </div>
          </div>
        </article>

        <aside className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <h2 className="text-lg font-semibold text-cyan-100">
            {step === 1
              ? "Step 1: Your details"
              : "Step 2: Continue to secure checkout"}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {step === 1
              ? "Enter your details to prepare your one-time soft credit check request."
              : `Review your request and continue to Stripe Checkout to pay $${CHECK_PRICE} securely.`}
          </p>
          <p className="mt-2 text-xs text-cyan-200/90">
            Soft inquiry only. This check does not affect your credit score.
          </p>

          {step === 1 ? (
            <form className="mt-4 space-y-3" onSubmit={onDetailsNext}>
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Full legal name"
                value={details.fullName}
                onChange={(event) =>
                  setDetails({ ...details, fullName: event.target.value })
                }
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="email"
                placeholder="Your email"
                value={details.email}
                onChange={(event) =>
                  setDetails({ ...details, email: event.target.value })
                }
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Phone number"
                value={details.phone}
                onChange={(event) =>
                  setDetails({ ...details, phone: event.target.value })
                }
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Street address"
                value={details.addressLine1}
                onChange={(event) =>
                  setDetails({ ...details, addressLine1: event.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="text"
                  placeholder="City"
                  value={details.city}
                  onChange={(event) =>
                    setDetails({ ...details, city: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="text"
                  placeholder="State"
                  value={details.state}
                  onChange={(event) =>
                    setDetails({ ...details, state: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="text"
                  placeholder="ZIP code"
                  value={details.postalCode}
                  onChange={(event) =>
                    setDetails({ ...details, postalCode: event.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="date"
                  value={details.dob}
                  onChange={(event) =>
                    setDetails({ ...details, dob: event.target.value })
                  }
                />
                <input
                  className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  type="text"
                  placeholder="SSN last 4"
                  value={details.ssnLast4}
                  onChange={(event) =>
                    setDetails({
                      ...details,
                      ssnLast4: event.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  inputMode="numeric"
                />
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-300">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={details.acceptedConsent}
                  onChange={(event) =>
                    setDetails({ ...details, acceptedConsent: event.target.checked })
                  }
                />
                I authorize a soft credit inquiry and agree to Verdansc terms and
                privacy policy.
              </label>
              <p className="text-xs text-cyan-200/90">
                We only ask for the details needed to process your one-time request.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
                >
                  Cancel and return
                </Link>
                <button
                  type="submit"
                  className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!isDetailsValid}
                >
                  Continue to secure payment
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={onCharge}>
              <div className="rounded-md border border-cyan-300/30 bg-slate-950/60 p-3 text-sm text-cyan-100">
                <p>
                  You will pay <strong>${CHECK_PRICE}</strong> on Stripe&apos;s
                  hosted checkout.
                </p>
                <p className="mt-1 text-xs text-cyan-200/90">
                  No card details are entered on Verdansc.
                </p>
              </div>
              <p className="text-xs text-cyan-200/90">
                You will be redirected to Stripe to complete payment.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
                >
                  Cancel and return
                </Link>
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
                  {charging ? "Processing..." : `Pay $${CHECK_PRICE} and run check`}
                </button>
              </div>
            </form>
          )}

          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          {result ? (
            <p className="mt-3 text-sm text-emerald-300">
              Payment successful. {result.message}{" "}
              {result.paymentId ? `Confirmation: ${result.paymentId}` : ""}
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
                Your credit check result
              </p>
              <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900/80 p-3 text-xs text-cyan-100">
                {JSON.stringify(report, null, 2)}
              </pre>
            </div>
          ) : null}

          <div className="mt-6 rounded-lg border border-cyan-300/30 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Privacy and security
            </p>
            <p className="mt-2 text-sm text-cyan-100">
              Payment is processed through secure checkout flows. Report data is
              generated only after successful payment.
            </p>
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
