"use client";

import { useState } from "react";

type ActivateSubscriptionButtonProps = {
  planId: string;
  planName: string;
};

export default function ActivateSubscriptionButton({
  planId,
  planName,
}: ActivateSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onActivate = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        checkoutUrl?: string;
      };

      if (!response.ok || !payload.ok || !payload.checkoutUrl) {
        setError(payload.message ?? "Could not start subscription checkout.");
        return;
      }

      window.location.assign(payload.checkoutUrl);
    } catch {
      setError("Subscription request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 space-y-2">
      <button
        type="button"
        onClick={onActivate}
        className="inline-flex rounded-md border border-cyan-300/50 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Redirecting..." : `Activate ${planName}`}
      </button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
