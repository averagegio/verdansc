import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail } from "../lib/mockUsers";
import { hasActiveSubscription } from "../lib/subscriptionAccess";

export default async function MembershipToolsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("verdansc_session")?.value;
  const email = cookieStore.get("verdansc_email")?.value;
  const role = cookieStore.get("verdansc_role")?.value ?? "renter";

  if (!session || !email) {
    redirect("/login");
  }

  const user = await findUserByEmail(email);
  const subscriptionStatus = user?.subscriptionStatus;

  if (!hasActiveSubscription(subscriptionStatus)) {
    redirect("/dashboard?upgrade=required");
  }

  const isLandlord = role === "landlord";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-5xl space-y-5">
        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Premium Member Tools
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Subscription unlocked</h1>
          <p className="mt-3 text-slate-300">
            Your membership is active. These premium tools are available for your
            {isLandlord ? " landlord" : " renter"} workflow.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <h2 className="text-xl font-semibold">Priority workflow board</h2>
            <p className="mt-2 text-sm text-slate-300">
              Track high-priority actions, status updates, and member-only queue
              processing.
            </p>
          </article>
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <h2 className="text-xl font-semibold">Member support routing</h2>
            <p className="mt-2 text-sm text-slate-300">
              Faster support handling and plan-specific feature guidance.
            </p>
          </article>
        </section>

        <Link
          href="/dashboard"
          className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
