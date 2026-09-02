"use client";

import Link from "next/link";
import {
  denverParts,
  formatSlotTime,
  nextSendable,
  remainingSendable,
  slotsOnDate,
  type ViewedSlot,
} from "../lib/outreachOps";
import { OUTREACH_DATES } from "../lib/outreachSchedule";
import { StatusBadge } from "./OutreachStatusBadge";

type OutreachWidgetProps = {
  slots: ViewedSlot[];
  now: Date;
  href?: string;
};

export default function OutreachWidget({
  slots,
  now,
  href = "/ops",
}: OutreachWidgetProps) {
  const todayKey = denverParts(now).dateKey;
  const todaySlots = slotsOnDate(slots, todayKey);
  const displayDate =
    todaySlots.length > 0
      ? todayKey
      : (OUTREACH_DATES.find((date) => date >= todayKey) ?? OUTREACH_DATES[0]);
  const displaySlots = slotsOnDate(slots, displayDate);
  const isToday = displayDate === todayKey;
  const remaining = remainingSendable(displaySlots).length;
  const next = nextSendable(slots);

  return (
    <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
            Outreach widget
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            {isToday ? "Today" : "Next window"} · {displaySlots.length} slots
          </h2>
        </div>
        <p className="rounded-md border border-cyan-300/30 bg-slate-950/50 px-2 py-1 font-mono text-xs text-cyan-100">
          {remaining} remaining
        </p>
      </div>

      <p className="mt-2 text-sm text-slate-300">
        {next
          ? `Next due: ${next.id} · ${formatSlotTime(next)} · ${next.channelLabel}`
          : "No sendable slots left. Email stays blocked."}
      </p>

      <ol className="mt-3 space-y-1.5">
        {displaySlots.map((slot) => (
          <li
            key={slot.id}
            className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-sm ${
              slot.dueNow
                ? "border-amber-300/60 bg-amber-900/25"
                : "border-cyan-400/15 bg-slate-950/35"
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-100">
                {slot.id} · {formatSlotTime(slot)}
              </p>
              <p className="truncate text-xs text-slate-400">
                {slot.channelLabel} · {slot.account}
              </p>
            </div>
            <StatusBadge status={slot.status} dueNow={slot.dueNow} compact />
          </li>
        ))}
      </ol>

      <Link
        href={href}
        className="mt-4 inline-flex min-h-11 items-center text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2 hover:text-cyan-100"
      >
        Open ops dashboard
      </Link>
    </article>
  );
}
