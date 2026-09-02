import type { DerivedStatus } from "../lib/outreachOps";

const STYLES: Record<DerivedStatus, string> = {
  ready: "border-cyan-300/40 bg-cyan-900/20 text-cyan-100",
  due: "border-amber-300/50 bg-amber-900/30 text-amber-100",
  done: "border-emerald-300/45 bg-emerald-900/25 text-emerald-100",
  skipped: "border-slate-400/40 bg-slate-800/50 text-slate-200",
  blocked: "border-rose-300/45 bg-rose-950/40 text-rose-100",
};

const LABELS: Record<DerivedStatus, string> = {
  ready: "Ready",
  due: "Due",
  done: "Done",
  skipped: "Skipped",
  blocked: "Blocked",
};

type StatusBadgeProps = {
  status: DerivedStatus;
  dueNow?: boolean;
  compact?: boolean;
};

export function StatusBadge({ status, dueNow = false, compact = false }: StatusBadgeProps) {
  const label = dueNow && status === "due" ? "Due now" : LABELS[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 ${
        compact ? "py-0.5 text-[10px]" : "py-1 text-xs"
      } uppercase tracking-[0.12em] ${STYLES[status]} ${
        dueNow ? "animate-pulse" : ""
      }`}
    >
      {label}
    </span>
  );
}
