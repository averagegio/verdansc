"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import ServiceTopBar from "../components/ServiceTopBar";

export default function RentalApplicationPage() {
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [applicationFeeUsd, setApplicationFeeUsd] = useState("35");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    applyUrl: string;
    listingId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const isValid = useMemo(() => {
    const fee = Number(applicationFeeUsd);
    return (
      propertyTitle.trim().length > 2 &&
      propertyAddress.trim().length > 4 &&
      Number.isFinite(fee) &&
      fee > 0
    );
  }, [applicationFeeUsd, propertyAddress, propertyTitle]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(null);
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch("/api/intake/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyTitle,
          propertyAddress,
          applicationFeeUsd: Number(applicationFeeUsd),
          requirements,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        applyUrl?: string;
        listingId?: string;
      };

      if (!response.ok || !payload.ok || !payload.applyUrl || !payload.listingId) {
        setError(payload.message ?? "Could not create intake link.");
        return;
      }

      setSuccess({
        applyUrl: payload.applyUrl,
        listingId: payload.listingId,
      });
    } catch {
      setError("Intake link request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!success?.applyUrl) return;
    try {
      await navigator.clipboard.writeText(success.applyUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <ServiceTopBar />
      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Landlord Intake Setup
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Applicant Intake Setup
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Configure your leasing intake so renters can submit applications
            through a structured flow that matches your screening process.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              One setup request for all active listings
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Property and unit volume planning
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Screening workflow preferences included
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              Fast onboarding follow-up from Verdansc
            </div>
          </div>
        </article>

        <aside className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <h2 className="text-lg font-semibold text-cyan-100">
            Start intake setup
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Tell us how you lease and screen so we can configure your intake flow.
          </p>
          <div className="mt-4 rounded-lg border border-amber-300/40 bg-amber-900/15 p-3 text-sm text-amber-100">
            Landlord account required: create an account or log in before generating
            an intake link.
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/signup?role=landlord&plan=landlord-growth"
                className="inline-flex rounded-md border border-amber-300/40 px-3 py-1 text-xs hover:bg-amber-400/10"
              >
                Create landlord account
              </Link>
              <Link
                href="/login?role=landlord"
                className="inline-flex rounded-md border border-amber-300/40 px-3 py-1 text-xs hover:bg-amber-400/10"
              >
                Landlord login
              </Link>
            </div>
          </div>
          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <input
              className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              type="text"
              placeholder="Property title (example: Pineview Apartments)"
              value={propertyTitle}
              onChange={(event) => setPropertyTitle(event.target.value)}
            />
            <input
              className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              type="text"
              placeholder="Property address"
              value={propertyAddress}
              onChange={(event) => setPropertyAddress(event.target.value)}
            />
            <input
              className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              type="number"
              min="1"
              step="1"
              placeholder="Application fee (USD)"
              value={applicationFeeUsd}
              onChange={(event) => setApplicationFeeUsd(event.target.value)}
            />
            <textarea
              className="min-h-24 w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              placeholder="Optional requirements (income rules, move-in timing, compliance notes)"
              value={requirements}
              onChange={(event) => setRequirements(event.target.value)}
            />
            <button
              type="submit"
              className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
              disabled={loading || !isValid}
            >
              {loading ? "Creating intake link..." : "Create intake link"}
            </button>
          </form>
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          {success ? (
            <div className="mt-3 space-y-2 rounded-lg border border-emerald-300/30 bg-emerald-900/15 p-3 text-sm text-emerald-100">
              <p>
                Intake link ready. Your listing is now live on the renter listings
                feed. Share this link with renters to apply:
              </p>
              <p className="rounded border border-emerald-300/30 bg-slate-950/60 px-2 py-1 text-xs break-all">
                {success.applyUrl}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex rounded-md border border-emerald-300/40 px-3 py-1 text-xs hover:bg-emerald-400/10"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
                <Link
                  href="/listings"
                  className="inline-flex rounded-md border border-emerald-300/40 px-3 py-1 text-xs hover:bg-emerald-400/10"
                >
                  View renter listings feed
                </Link>
              </div>
            </div>
          ) : null}
          <Link
            href="/login"
            className="mt-3 inline-flex text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2"
          >
            Returning user? Login
          </Link>
        </aside>
      </section>
    </main>
  );
}
