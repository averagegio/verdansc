"use client";

import type { OutreachAlert } from "../lib/outreachOps";

type OutreachToastsProps = {
  toasts: OutreachAlert[];
  onDismiss: (id: string) => void;
};

const KIND_STYLES: Record<OutreachAlert["kind"], string> = {
  complete:
    "border-emerald-300/50 bg-emerald-950/90 text-emerald-100",
  skip: "border-slate-400/40 bg-slate-900/95 text-slate-100",
  blocked: "border-amber-300/45 bg-amber-950/90 text-amber-100",
  reset: "border-cyan-300/40 bg-slate-900/95 text-cyan-100",
};

export function OutreachToasts({ toasts, onDismiss }: OutreachToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-3 py-2 shadow-lg shadow-black/40 ${KIND_STYLES[toast.kind]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-5">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md text-xs uppercase tracking-[0.08em] opacity-80 hover:bg-white/10 hover:opacity-100"
              aria-label="Dismiss alert"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

type OutreachAlertListProps = {
  alerts: OutreachAlert[];
};

export function OutreachAlertList({ alerts }: OutreachAlertListProps) {
  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
        Completion alerts
      </p>
      <h2 className="mt-2 text-xl font-semibold">Marked in this browser</h2>
      <p className="mt-1 text-sm text-slate-300">
        Alerts fire when you mark a slot complete, skip, or blocked. Nothing is
        sent from this page.
      </p>
      {alerts.length === 0 ? (
        <p className="mt-4 rounded-xl border border-slate-600/40 bg-slate-950/40 px-3 py-3 text-sm text-slate-400">
          No operator marks yet. Complete a Facebook or Craigslist slot after
          you post it in the live app.
        </p>
      ) : (
        <ol className="mt-4 space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="rounded-xl border border-cyan-400/20 bg-slate-950/45 px-3 py-2"
            >
              <p className="text-sm text-slate-100">{alert.message}</p>
              <p className="mt-1 font-mono text-xs text-slate-400">
                {new Date(alert.createdAt).toLocaleString()} · {alert.kind}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
