"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import ServiceTopBar from "../components/ServiceTopBar";

type Role = "renter" | "landlord";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("renter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    const planParam = params.get("plan");
    if (roleParam === "renter" || roleParam === "landlord") {
      setRole(roleParam);
    }
    setSelectedPlan(planParam);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role, planId: selectedPlan }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "Could not sign in.");
        return;
      }

      router.push(payload.redirectTo ?? "/dashboard");
    } catch {
      setError("Login request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <ServiceTopBar middleLinkHref="/pricing" middleLinkLabel="View pricing" />
      <section className="mx-auto w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Member Access
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Login to Verdansc</h1>
        <p className="mt-3 text-sm text-slate-300">
          Access your renter or landlord dashboard.
        </p>
        {selectedPlan ? (
          <p className="mt-2 text-sm text-cyan-200">
            Selected plan: <span className="font-semibold">{selectedPlan}</span>
          </p>
        ) : null}

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm ${
                role === "renter"
                  ? "border-cyan-300/80 bg-cyan-500/20 text-cyan-100"
                  : "border-cyan-300/30 bg-slate-950/50 text-slate-200"
              }`}
              onClick={() => setRole("renter")}
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
              onClick={() => setRole("landlord")}
            >
              Landlord / Manager
            </button>
          </div>

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
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="submit"
            className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <Link
          href="/pricing"
          className="mt-3 inline-flex rounded-md border border-cyan-300/40 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
        >
          View pricing plans
        </Link>

        <Link
          href={`/signup?role=${role}${selectedPlan ? `&plan=${selectedPlan}` : ""}`}
          className="mt-3 inline-flex text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2"
        >
          New member? Create account
        </Link>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
        >
          Back to map
        </Link>
      </section>
    </main>
  );
}
