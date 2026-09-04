"use client";

import { FormEvent, useState } from "react";

type UnlockFormProps = {
  invalid?: boolean;
  secretConfigured: boolean;
  founderConfigured: boolean;
};

export default function UnlockForm({
  invalid,
  secretConfigured,
  founderConfigured,
}: UnlockFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    if (!event.currentTarget.checkValidity()) {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="mt-6 space-y-3"
      method="post"
      action="/ops/stripe/unlock"
      onSubmit={onSubmit}
    >
      {invalid ? (
        <p className="rounded-xl border border-amber-300/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-100">
          That ops secret did not match. Use the server environment value — do
          not paste keys into a pull request.
        </p>
      ) : null}
      {secretConfigured ? (
        <>
          <label className="block text-sm text-slate-300" htmlFor="ops-secret">
            Ops secret
          </label>
          <input
            id="ops-secret"
            name="secret"
            type="password"
            required
            autoComplete="off"
            className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
            placeholder="STRIPE_OPS_SECRET"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-60"
          >
            {submitting ? "Unlocking…" : "Unlock monitor"}
          </button>
        </>
      ) : (
        <p className="rounded-xl border border-slate-500/40 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
          <code className="text-cyan-200">STRIPE_OPS_SECRET</code> is not set on
          this server.
          {founderConfigured
            ? " Sign in with the founder account listed in STRIPE_OPS_EMAIL, then reload this page."
            : " Set STRIPE_OPS_SECRET or STRIPE_OPS_EMAIL in the hosting environment to enable access."}
        </p>
      )}
    </form>
  );
}
