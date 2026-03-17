"use client";

import { useEffect, useState } from "react";

type ApiResponsePreviewProps = {
  endpoint: string;
};

export default function ApiResponsePreview({ endpoint }: ApiResponsePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<unknown>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = (await response.json()) as unknown;
        if (active) {
          setPayload(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unknown request error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <div className="mt-6 rounded-lg border border-cyan-300/30 bg-slate-950/60 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
        Live API response
      </p>
      {loading ? (
        <p className="mt-2 text-sm text-slate-300">Loading response...</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
      {!loading && !error ? (
        <pre className="mt-2 max-h-80 overflow-auto rounded-md bg-slate-900/80 p-3 text-xs text-cyan-100">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
