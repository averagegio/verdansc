import Link from "next/link";
import {
  findIntakeApplicationById,
  type IntakeApplicationStatus,
} from "../../lib/intakeApplications";
import { findIntakeListingById } from "../../lib/intakeListings";

type ApplicationStatusPageProps = {
  params: Promise<{
    applicationId: string;
  }>;
};

function statusMeta(status: IntakeApplicationStatus) {
  if (status === "draft") {
    return {
      label: "Draft",
      tone: "border-slate-400/40 bg-slate-900/20 text-slate-200",
      detail: "Your application draft is saved. Complete payment to submit.",
    };
  }
  if (status === "payment_pending") {
    return {
      label: "Payment Pending",
      tone: "border-cyan-300/40 bg-cyan-900/20 text-cyan-200",
      detail:
        "Payment was started. We are waiting for final confirmation from checkout.",
    };
  }
  if (status === "submitted") {
    return {
      label: "Submitted",
      tone: "border-emerald-300/40 bg-emerald-900/20 text-emerald-200",
      detail: "Payment is confirmed and your application is in the landlord queue.",
    };
  }
  if (status === "under_review") {
    return {
      label: "Under Review",
      tone: "border-cyan-300/40 bg-cyan-900/20 text-cyan-200",
      detail: "Landlord is actively reviewing your application.",
    };
  }
  if (status === "approved") {
    return {
      label: "Approved",
      tone: "border-emerald-300/40 bg-emerald-900/20 text-emerald-200",
      detail: "Your application has been approved.",
    };
  }
  return {
    label: "Declined",
    tone: "border-rose-300/40 bg-rose-900/20 text-rose-200",
    detail: "This application was declined. Contact the listing team for details.",
  };
}

export default async function ApplicationStatusPage({
  params,
}: ApplicationStatusPageProps) {
  const { applicationId } = await params;
  const application = await findIntakeApplicationById(applicationId);

  if (!application) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
        <section className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-400/30 bg-slate-900/65 p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
            Application status
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Application not found</h1>
          <p className="mt-3 text-slate-300">
            The status link is invalid or has expired.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
          >
            Browse listings
          </Link>
        </section>
      </main>
    );
  }

  const listing = await findIntakeListingById(application.listingId);
  const status = statusMeta(application.status);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <section className="mx-auto w-full max-w-4xl space-y-5">
        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Application status
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Track your application</h1>
          <p className="mt-3 text-sm text-slate-300">
            Application ID: <span className="text-cyan-200">{application.id}</span>
          </p>
        </header>

        <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
          <div
            className={`inline-flex rounded-md border px-3 py-1 text-xs uppercase tracking-[0.12em] ${status.tone}`}
          >
            {status.label}
          </div>
          <p className="mt-3 text-sm text-slate-300">{status.detail}</p>
          {application.submittedAt ? (
            <p className="mt-2 text-xs text-slate-400">
              Submitted at: {application.submittedAt}
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
          <h2 className="text-lg font-semibold">Application details</h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <p>
              Name: <span className="text-slate-100">{application.applicantName}</span>
            </p>
            <p>
              Email: <span className="text-slate-100">{application.email}</span>
            </p>
            <p>
              Phone: <span className="text-slate-100">{application.phone}</span>
            </p>
            <p>
              Property:{" "}
              <span className="text-slate-100">
                {listing
                  ? `${listing.propertyTitle} - ${listing.propertyAddress}`
                  : application.listingId}
              </span>
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          {listing ? (
            <Link
              href={`/apply/${listing.id}`}
              className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              Back to application
            </Link>
          ) : null}
          <Link
            href="/listings"
            className="inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
          >
            Browse listings
          </Link>
        </div>
      </section>
    </main>
  );
}

