import Link from "next/link";
import ServiceTopBar from "../components/ServiceTopBar";
import { listIntakeListings } from "../lib/intakeListings";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const listings = await listIntakeListings();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <ServiceTopBar middleLinkHref="/pricing" middleLinkLabel="View pricing" />
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Renter Discovery
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Rental Application Listings
          </h1>
          <p className="mt-3 text-slate-300">
            Browse active listings and compare application fees before you apply.
          </p>
        </header>

        {listings.length === 0 ? (
          <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-slate-300">
              No active listings yet. Check back soon for new rental application
              opportunities.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6"
              >
                <h2 className="text-xl font-semibold">{listing.propertyTitle}</h2>
                <p className="mt-1 text-sm text-slate-300">{listing.propertyAddress}</p>
                <p className="mt-4 inline-flex rounded-md border border-cyan-300/40 bg-cyan-900/20 px-3 py-1 text-sm text-cyan-100">
                  Application fee: ${(listing.applicationFeeCents / 100).toFixed(2)}
                </p>
                {listing.requirements ? (
                  <p className="mt-3 text-sm text-slate-300">{listing.requirements}</p>
                ) : null}
                <Link
                  href={`/apply/${listing.id}`}
                  className="mt-5 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Apply now
                </Link>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

