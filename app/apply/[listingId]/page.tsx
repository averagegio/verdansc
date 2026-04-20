import Link from "next/link";
import { findIntakeListingById } from "../../lib/intakeListings";
import ApplyListingForm from "./ApplyListingForm";

type ApplyListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
  searchParams?: Promise<{
    payment?: string;
    application_id?: string;
    session_id?: string;
  }>;
};

export default async function ApplyListingPage({
  params,
  searchParams,
}: ApplyListingPageProps) {
  const { listingId } = await params;
  const query = (await searchParams) ?? {};
  const listing = await findIntakeListingById(listingId);

  if (!listing) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
        <section className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-400/30 bg-slate-900/65 p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
            Applicant Intake
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Listing not found</h1>
          <p className="mt-3 text-slate-300">
            This intake link is invalid or no longer active. Ask the landlord for an
            updated application link.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
          >
            Back to map
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.35fr_1fr]">
        <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-8">
          {query.payment === "success" ? (
            <div className="mb-4 rounded-lg border border-emerald-300/40 bg-emerald-900/15 px-3 py-2 text-sm text-emerald-100">
              Payment completed. Final submission confirmation is processing.
              {query.application_id ? ` Application ID: ${query.application_id}.` : ""}
              {query.application_id ? (
                <span>
                  {" "}
                  <Link
                    href={`/application-status/${query.application_id}`}
                    className="underline underline-offset-2"
                  >
                    Track status
                  </Link>
                </span>
              ) : null}
            </div>
          ) : null}
          {query.payment === "cancelled" ? (
            <div className="mb-4 rounded-lg border border-amber-300/40 bg-amber-900/15 px-3 py-2 text-sm text-amber-100">
              Payment was cancelled. Your draft is saved and you can try again.
              {query.application_id ? (
                <span>
                  {" "}
                  <Link
                    href={`/application-status/${query.application_id}`}
                    className="underline underline-offset-2"
                  >
                    View current status
                  </Link>
                </span>
              ) : null}
            </div>
          ) : null}
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Renter Application
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Apply to {listing.propertyTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-300">{listing.propertyAddress}</p>
          <div className="mt-6 rounded-lg border border-cyan-300/30 bg-slate-950/50 p-4 text-sm text-cyan-100">
            Application fee: ${(listing.applicationFeeCents / 100).toFixed(2)}
          </div>
          <p className="mt-4 text-sm text-slate-300">
            Complete your details below to save your application draft. Payment and
            final submission happen in the next step.
          </p>
          {listing.requirements ? (
            <div className="mt-4 rounded-lg border border-cyan-300/30 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
                Landlord requirements
              </p>
              <p className="mt-2 text-sm text-slate-200">{listing.requirements}</p>
            </div>
          ) : null}
        </article>

        <ApplyListingForm
          listingId={listing.id}
          initialApplicationId={query.application_id}
        />
      </section>
    </main>
  );
}

