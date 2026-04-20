import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ActivateSubscriptionButton from "../components/ActivateSubscriptionButton";
import ServiceTopBar from "../components/ServiceTopBar";
import { listApplicationsForLandlord } from "../lib/intakeApplications";
import { findUserByEmail } from "../lib/mockUsers";
import {
  getMoveInPlanByEmail,
  getMoveInPlanInsight,
} from "../lib/moveInPlanner";
import {
  getMoveOutPlanByEmail,
  getMoveOutPlanInsight,
} from "../lib/moveOutTracker";
import { hasActiveSubscription } from "../lib/subscriptionAccess";
import {
  findPlanById,
  getDefaultPlanIdForAudience,
  SUBSCRIPTION_PLANS,
} from "../lib/subscriptionPlans";

type DashboardPageProps = {
  searchParams?: Promise<{
    subscription?: string;
    session_id?: string;
    welcome?: string;
    upgrade?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const session = cookieStore.get("verdansc_session")?.value;
  const role = cookieStore.get("verdansc_role")?.value ?? "renter";
  const email = cookieStore.get("verdansc_email")?.value ?? "member";
  const planCookie = cookieStore.get("verdansc_plan")?.value;

  if (!session) {
    redirect("/login");
  }

  const isLandlord = role === "landlord";
  const audiencePlans = SUBSCRIPTION_PLANS.filter((plan) =>
    isLandlord ? plan.audience === "landlord" : plan.audience === "renter",
  );
  const fallbackPlanId = getDefaultPlanIdForAudience(
    isLandlord ? "landlord" : "renter",
  );
  const currentPlan =
    findPlanById(planCookie) ??
    audiencePlans.find((plan) => plan.id === fallbackPlanId) ??
    audiencePlans[0];
  const userRecord = await findUserByEmail(email);
  const landlordQueue = isLandlord ? await listApplicationsForLandlord(email) : [];
  const moveInPlan = isLandlord ? undefined : await getMoveInPlanByEmail(email);
  const moveOutPlan = isLandlord ? await getMoveOutPlanByEmail(email) : undefined;
  const moveInInsight = getMoveInPlanInsight(moveInPlan);
  const moveOutInsight = getMoveOutPlanInsight(moveOutPlan);
  const subscriptionStatus = userRecord?.subscriptionStatus ?? "inactive";
  const onboardingStatus = userRecord?.onboardingStatus ?? "plan_selected";
  const isActiveMember = hasActiveSubscription(subscriptionStatus);
  const showOnboardingPanel =
    !isActiveMember && onboardingStatus !== "subscription_active";
  const statusLabel =
    subscriptionStatus === "checkout_pending"
      ? "Checkout in progress"
      : subscriptionStatus === "checkout_completed"
        ? "Awaiting activation confirmation"
        : subscriptionStatus === "trialing"
          ? "Active trial"
          : subscriptionStatus === "active"
            ? "Active"
            : subscriptionStatus === "past_due"
              ? "Payment past due"
              : subscriptionStatus === "unpaid"
                ? "Payment required"
                : subscriptionStatus === "incomplete"
                  ? "Activation incomplete"
                  : subscriptionStatus === "canceled"
                    ? "Canceled"
                    : "Inactive";

  const statusStyle =
    subscriptionStatus === "active" || subscriptionStatus === "trialing"
      ? "border-emerald-300/40 bg-emerald-900/20 text-emerald-200"
      : subscriptionStatus === "checkout_pending" ||
          subscriptionStatus === "checkout_completed"
        ? "border-cyan-300/40 bg-cyan-900/20 text-cyan-200"
        : subscriptionStatus === "past_due" ||
            subscriptionStatus === "unpaid" ||
            subscriptionStatus === "incomplete"
          ? "border-amber-300/40 bg-amber-900/20 text-amber-200"
          : "border-slate-400/40 bg-slate-900/20 text-slate-200";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <ServiceTopBar middleLinkHref="/pricing" middleLinkLabel="View pricing" />
        {params.welcome === "1" ? (
          <div className="rounded-xl border border-emerald-300/40 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-200">
            Account created successfully. Activate your subscription to unlock
            full member access.
          </div>
        ) : null}
        {params.subscription === "success" ? (
          <div className="rounded-xl border border-cyan-300/40 bg-cyan-900/20 px-4 py-3 text-sm text-cyan-200">
            Checkout completed. Membership activates after Stripe confirms the
            subscription status.
            {params.session_id ? ` Session: ${params.session_id}` : ""}
          </div>
        ) : null}
        {params.subscription === "cancelled" ? (
          <div className="rounded-xl border border-amber-300/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
            Subscription checkout was cancelled. You can try again anytime.
          </div>
        ) : null}
        {params.upgrade === "required" ? (
          <div className="rounded-xl border border-amber-300/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
            Premium tools require an active subscription. Activate your plan to
            continue.
          </div>
        ) : null}

        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Membership Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">
            Signed in as <span className="text-cyan-200">{email}</span> (
            {isLandlord ? "Landlord / Manager" : "Renter / Buyer"}).
          </p>
          <div
            className={`mt-4 inline-flex rounded-md border px-3 py-1 text-xs uppercase tracking-[0.12em] ${statusStyle}`}
          >
            Subscription status: {statusLabel}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              {isActiveMember ? "Active membership" : "Selected plan"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{currentPlan.name}</h2>
            <p className="mt-1 text-cyan-200">{currentPlan.price}</p>
            {!isActiveMember ? (
              <p className="mt-2 text-xs text-slate-300">
                Membership access will unlock after Stripe marks your subscription
                as active or trialing.
              </p>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {currentPlan.highlights.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <ActivateSubscriptionButton
              planId={currentPlan.id}
              planName={currentPlan.name}
            />
            <Link
              href="/pricing"
              className="mt-5 inline-flex rounded-md border border-cyan-300/50 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              View all plans
            </Link>
          </article>

          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Quick actions
            </p>
            <div className="mt-4 grid gap-2">
              <Link
                href={isActiveMember ? "/membership-tools" : "/pricing"}
                className="rounded-md border border-cyan-300/40 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
              >
                {isActiveMember
                  ? "Open premium tools"
                  : "Activate membership now"}
              </Link>
              {isLandlord ? (
                <>
                  <Link
                    href="/rental-application"
                    className="rounded-md border border-cyan-300/40 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                  >
                    Set up applicant intake
                  </Link>
                  <Link
                    href="/move-out-tracker"
                    className="rounded-md border border-cyan-300/40 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                  >
                    Open move-out tracker
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/credit-check"
                    className="rounded-md border border-cyan-300/40 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                  >
                    Run a credit check
                  </Link>
                  <Link
                    href="/move-in-planner"
                    className="rounded-md border border-cyan-300/40 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
                  >
                    Open move-in planner
                  </Link>
                </>
              )}
              <Link
                href="/"
                className="rounded-md border border-slate-500/60 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
              >
                Back to map
              </Link>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
            Planner readiness
          </p>
          {isLandlord ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-cyan-300/30 bg-slate-950/45 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">Move-out tracker</h3>
                  <span className="rounded-md border border-cyan-300/40 bg-cyan-900/20 px-2 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100">
                    {moveOutInsight.readinessScore}% ready
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {moveOutInsight.completeCount}/{moveOutInsight.totalCount || 5} tasks
                  complete
                </p>
                {moveOutInsight.riskWarning ? (
                  <p className="mt-2 rounded-md border border-amber-300/35 bg-amber-900/15 px-2 py-1 text-xs text-amber-100">
                    {moveOutInsight.riskWarning}
                  </p>
                ) : null}
                {moveOutInsight.nextActions.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {moveOutInsight.nextActions.map((item) => (
                      <li key={item.id}>- {item.label}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-cyan-300/30 bg-slate-950/45 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">Move-in planner</h3>
                  <span className="rounded-md border border-cyan-300/40 bg-cyan-900/20 px-2 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100">
                    {moveInInsight.readinessScore}% ready
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {moveInInsight.completeCount}/{moveInInsight.totalCount || 5} tasks
                  complete
                </p>
                {moveInInsight.riskWarning ? (
                  <p className="mt-2 rounded-md border border-amber-300/35 bg-amber-900/15 px-2 py-1 text-xs text-amber-100">
                    {moveInInsight.riskWarning}
                  </p>
                ) : null}
                {moveInInsight.nextActions.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {moveInInsight.nextActions.map((item) => (
                      <li key={item.id}>- {item.label}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )}
        </section>

        {showOnboardingPanel ? (
          <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Onboarding
            </p>
            <h2 className="mt-2 text-xl font-semibold">Complete setup in 2 steps</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-lg border border-emerald-300/40 bg-emerald-900/15 px-3 py-2 text-emerald-100">
                Step 1: Account created
              </div>
              <div className="rounded-lg border border-cyan-300/40 bg-cyan-900/15 px-3 py-2 text-cyan-100">
                Step 2: Activate your subscription to unlock premium tools
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
            Plan options
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {audiencePlans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-xl border p-4 ${
                  plan.id === currentPlan.id
                    ? "border-cyan-300/70 bg-cyan-900/20"
                    : "border-cyan-400/30 bg-slate-950/40"
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-cyan-200">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
              </article>
            ))}
          </div>
        </section>

        {isLandlord ? (
          <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Applicant review queue
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              Paid applications ready for review
            </h2>
            {landlordQueue.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">
                No paid submissions yet. Share your intake link from the landlord
                setup page to start collecting applications.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {landlordQueue.map((item) => (
                  <article
                    key={item.applicationId}
                    className="rounded-xl border border-cyan-300/30 bg-slate-950/45 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-semibold">{item.applicantName}</h3>
                      <span className="rounded-md border border-emerald-300/40 bg-emerald-900/15 px-2 py-1 text-xs uppercase tracking-[0.12em] text-emerald-200">
                        {item.status === "submitted" ? "Submitted" : "Under review"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      {item.propertyTitle} - {item.propertyAddress}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {item.applicantEmail} - {item.applicantPhone}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Application ID: {item.applicationId}
                      {item.submittedAt ? ` - Submitted: ${item.submittedAt}` : ""}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </section>
    </main>
  );
}
