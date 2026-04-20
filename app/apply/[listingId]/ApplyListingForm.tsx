"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import DateDropdown from "../../components/DateDropdown";

type ApplyListingFormProps = {
  listingId: string;
  initialApplicationId?: string;
};

export default function ApplyListingForm({
  listingId,
  initialApplicationId,
}: ApplyListingFormProps) {
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [occupants, setOccupants] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [success, setSuccess] = useState<{
    applicationId: string;
  } | null>(initialApplicationId ? { applicationId: initialApplicationId } : null);

  const isValid = useMemo(() => {
    return (
      applicantName.trim().length > 1 &&
      /^\S+@\S+\.\S+$/.test(email.trim()) &&
      phone.trim().length >= 10
    );
  }, [applicantName, email, phone]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setPaymentError("");
    setSuccess(null);

    try {
      const response = await fetch("/api/intake/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          applicantName,
          email,
          phone,
          moveInDate: moveInDate || undefined,
          monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
          occupants: occupants ? Number(occupants) : undefined,
          notes,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        applicationId?: string;
      };

      if (!response.ok || !payload.ok || !payload.applicationId) {
        setError(payload.message ?? "Could not save your application draft.");
        return;
      }

      setSuccess({ applicationId: payload.applicationId });
    } catch {
      setError("Application request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onPay = async () => {
    if (!success?.applicationId) return;
    setPaymentError("");
    setPaymentLoading(true);

    try {
      const response = await fetch("/api/billing/application-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId: success.applicationId }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        checkoutUrl?: string;
      };

      if (!response.ok || !payload.ok || !payload.checkoutUrl) {
        setPaymentError(payload.message ?? "Could not start application payment.");
        return;
      }

      window.location.assign(payload.checkoutUrl);
    } catch {
      setPaymentError("Payment request failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
      <h2 className="text-lg font-semibold text-cyan-100">Your application details</h2>
      <p className="mt-2 text-sm text-slate-300">
        Start your application now. In the next step, you will pay the fee to submit.
      </p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          type="text"
          placeholder="Full legal name"
          value={applicantName}
          onChange={(event) => setApplicantName(event.target.value)}
        />
        <input
          className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <DateDropdown
            value={moveInDate}
            onChange={setMoveInDate}
            placeholder="Requested move-in date"
          />
          <input
            className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
            type="number"
            min="1"
            step="1"
            placeholder="Occupants"
            value={occupants}
            onChange={(event) => setOccupants(event.target.value)}
          />
        </div>
        <input
          className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          type="number"
          min="0"
          step="100"
          placeholder="Monthly gross income (optional)"
          value={monthlyIncome}
          onChange={(event) => setMonthlyIncome(event.target.value)}
        />
        <textarea
          className="min-h-24 w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          placeholder="Notes for the landlord (optional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
          >
            Cancel and return
          </Link>
          <button
            type="submit"
            className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
            disabled={loading || !isValid}
          >
            {loading ? "Saving draft..." : "Save and continue"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      {success ? (
        <div className="mt-3 space-y-3 rounded-lg border border-emerald-300/30 bg-emerald-900/15 p-3 text-sm text-emerald-100">
          <p>
            Draft saved. Application ID: {success.applicationId}. Complete payment to
            submit your application to the landlord.
          </p>
          <Link
            href={`/application-status/${success.applicationId}`}
            className="inline-flex rounded-md border border-emerald-300/40 px-3 py-1 text-xs hover:bg-emerald-400/10"
          >
            Track application status
          </Link>
          <button
            type="button"
            onClick={onPay}
            className="inline-flex rounded-md border border-emerald-300/40 px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-400/10 disabled:opacity-50"
            disabled={paymentLoading}
          >
            {paymentLoading ? "Redirecting to payment..." : "Pay fee and submit"}
          </button>
        </div>
      ) : null}
      {paymentError ? <p className="mt-3 text-sm text-rose-300">{paymentError}</p> : null}
    </aside>
  );
}

