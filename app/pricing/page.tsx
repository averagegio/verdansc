import Link from "next/link";
import ServiceTopBar from "../components/ServiceTopBar";
import { SUBSCRIPTION_PLANS } from "../lib/subscriptionPlans";

export default function PricingPage() {
  const renterPlans = SUBSCRIPTION_PLANS.filter((plan) => plan.audience === "renter");
  const landlordPlans = SUBSCRIPTION_PLANS.filter(
    (plan) => plan.audience === "landlord",
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <ServiceTopBar middleLinkHref="/dashboard" middleLinkLabel="Dashboard" />
        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Membership Pricing
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Choose the plan that matches your workflow
          </h1>
          <p className="mt-3 text-slate-300">
            Start with renter-ready tools or landlord management features. You
            can switch plans later as your needs change.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-100">For renters / buyers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {renterPlans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-2xl border p-6 ${
                  plan.recommended
                    ? "border-cyan-300/70 bg-cyan-900/20"
                    : "border-cyan-400/30 bg-slate-900/65"
                }`}
              >
                {plan.recommended ? (
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">
                    Recommended
                  </p>
                ) : null}
                <h3 className="mt-2 text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-cyan-200">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {plan.highlights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <Link
                  href={`/signup?role=renter&plan=${plan.id}`}
                  className="mt-5 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Create account with this plan
                </Link>
                <Link
                  href={`/login?role=renter&plan=${plan.id}`}
                  className="mt-3 inline-flex text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2"
                >
                  Already a member? Login
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-100">
            For landlords / managers
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {landlordPlans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-2xl border p-6 ${
                  plan.recommended
                    ? "border-cyan-300/70 bg-cyan-900/20"
                    : "border-cyan-400/30 bg-slate-900/65"
                }`}
              >
                {plan.recommended ? (
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">
                    Recommended
                  </p>
                ) : null}
                <h3 className="mt-2 text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-cyan-200">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {plan.highlights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <Link
                  href={`/signup?role=landlord&plan=${plan.id}`}
                  className="mt-5 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Create account with this plan
                </Link>
                <Link
                  href={`/login?role=landlord&plan=${plan.id}`}
                  className="mt-3 inline-flex text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2"
                >
                  Already a member? Login
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
