"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ServiceTopBar from "../components/ServiceTopBar";
import { findPlanById, SUBSCRIPTION_PLANS } from "../lib/subscriptionPlans";

type Role = "renter" | "landlord";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("renter");
  const [planId, setPlanId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    setPlanId((currentPlanId) => {
      const currentPlan = findPlanById(currentPlanId);
      if (currentPlan && currentPlan.audience === nextRole) {
        return currentPlanId;
      }
      return "";
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    const planParam = params.get("plan");
    const selectedRole: Role =
      roleParam === "landlord" || roleParam === "renter" ? roleParam : "renter";
    setRole(selectedRole);

    if (planParam) {
      const found = findPlanById(planParam);
      if (found && found.audience === selectedRole) {
        setPlanId(found.id);
        return;
      }
    }
    setPlanId("");
  }, []);

  const selectedPlan = useMemo(() => findPlanById(planId), [planId]);
  const rolePlans = useMemo(
    () => SUBSCRIPTION_PLANS.filter((plan) => plan.audience === role),
    [role],
  );
  const formValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.length >= 8 &&
    confirmPassword &&
    Boolean(selectedPlan && selectedPlan.audience === role) &&
    acceptedTerms;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          role,
          planId,
          acceptedTerms,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "Could not create account.");
        return;
      }

      router.push(payload.redirectTo ?? "/dashboard");
    } catch {
      setError("Signup request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <ServiceTopBar middleLinkHref="/pricing" middleLinkLabel="View pricing" />
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Membership Signup
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create your account</h1>
        <p className="mt-3 text-sm text-slate-300">
          Set up your account to continue with your selected subscription plan.
        </p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm ${
                role === "renter"
                  ? "border-cyan-300/80 bg-cyan-500/20 text-cyan-100"
                  : "border-cyan-300/30 bg-slate-950/50 text-slate-200"
              }`}
              onClick={() => onRoleChange("renter")}
            >
              Renter / Buyer
            </button>
            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm ${
                role === "landlord"
                  ? "border-cyan-300/80 bg-cyan-500/20 text-cyan-100"
                  : "border-cyan-300/30 bg-slate-950/50 text-slate-200"
              }`}
              onClick={() => onRoleChange("landlord")}
            >
              Landlord / Manager
            </button>
          </div>

          <div className="space-y-2 rounded-md border border-cyan-300/30 bg-slate-950/50 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Choose your plan
            </p>
            <div className="space-y-2">
              {rolePlans.map((plan) => {
                const checked = plan.id === planId;
                return (
                  <label
                    key={plan.id}
                    className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm ${
                      checked
                        ? "border-cyan-300/70 bg-cyan-900/25 text-cyan-100"
                        : "border-cyan-300/30 bg-slate-950/40 text-slate-200"
                    }`}
                  >
                    <input
                      className="mt-1"
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={checked}
                      onChange={() => setPlanId(plan.id)}
                    />
                    <span>
                      <span className="font-semibold">{plan.name}</span> ({plan.price})
                      <span className="block text-xs text-slate-300">
                        {plan.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {!selectedPlan ? (
              <p className="text-xs text-amber-200">
                Select a plan to continue.
              </p>
            ) : null}
          </div>

          <input
            className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <input
            className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
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
            type="password"
            placeholder="Password (8+ characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <div className="rounded-md border border-cyan-300/30 bg-slate-950/50 px-3 py-2 text-sm text-cyan-100">
            Plan:{" "}
            <span className="font-semibold">
              {selectedPlan?.name ?? "Select a plan from pricing"}
            </span>{" "}
            ({selectedPlan?.price ?? "--"})
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-300">
            <input
              className="mt-1"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            I agree to the terms and privacy policy.
          </label>

          <button
            type="submit"
            className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
            disabled={loading || !formValid}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <Link
          href={`/login?role=${role}${planId ? `&plan=${planId}` : ""}`}
          className="mt-5 inline-flex text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2"
        >
          Already have an account? Login
        </Link>
      </section>
    </main>
  );
}
