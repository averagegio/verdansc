"use client";

import { useMemo, useState } from "react";
import ServiceTopBar from "../components/ServiceTopBar";
import { OutreachAlertList, OutreachToasts } from "../components/OutreachAlerts";
import OutreachWidget from "../components/OutreachWidget";
import { StatusBadge } from "../components/OutreachStatusBadge";
import {
  denverParts,
  formatDateLabel,
  formatDenverClock,
  formatSlotTime,
  isMorningWindow,
  summarizeWeek,
  type OperatorMark,
  type ViewedSlot,
} from "../lib/outreachOps";
import {
  EMAIL_BLOCK_REASON,
  EMAIL_FROM,
  OUTREACH_DATES,
  OUTREACH_WINDOW_LABEL,
  OUTREACH_WEEK_END,
  OUTREACH_WEEK_START,
} from "../lib/outreachSchedule";
import { useOutreachOps } from "../lib/useOutreachOps";

function SlotActions({
  slot,
  onMark,
}: {
  slot: ViewedSlot;
  onMark: (status: OperatorMark) => void;
}) {
  const completeDisabled = slot.emailLocked;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={completeDisabled}
        title={completeDisabled ? EMAIL_BLOCK_REASON : "Mark complete after you post in the live app"}
        onClick={() => onMark("done")}
        className="inline-flex min-h-11 items-center rounded-md border border-emerald-300/50 px-3 py-1 text-sm text-emerald-100 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500 disabled:hover:bg-transparent"
      >
        Mark complete
      </button>
      <button
        type="button"
        onClick={() => onMark("skipped")}
        className="inline-flex min-h-11 items-center rounded-md border border-slate-400/50 px-3 py-1 text-sm text-slate-100 hover:bg-slate-700/40"
      >
        Skip
      </button>
      <button
        type="button"
        onClick={() => onMark("blocked")}
        disabled={slot.emailLocked}
        title={
          slot.emailLocked
            ? "Email is already blocked by compliance gates"
            : "Mark blocked if the group or listing rejected the post"
        }
        className="inline-flex min-h-11 items-center rounded-md border border-amber-300/45 px-3 py-1 text-sm text-amber-100 hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500 disabled:hover:bg-transparent"
      >
        Blocked
      </button>
      {slot.status === "done" || slot.status === "skipped" || (slot.status === "blocked" && !slot.emailLocked) ? (
        <button
          type="button"
          onClick={() => onMark("ready")}
          className="inline-flex min-h-11 items-center rounded-md border border-cyan-300/40 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-400/10"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

function SlotCard({
  slot,
  onMark,
}: {
  slot: ViewedSlot;
  onMark: (slot: ViewedSlot, status: OperatorMark) => void;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        slot.dueNow
          ? "border-amber-300/70 bg-amber-950/25"
          : slot.emailLocked
            ? "border-rose-400/25 bg-slate-900/55"
            : "border-cyan-400/30 bg-slate-900/65"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-300">
            {slot.id} · {formatSlotTime(slot)}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{slot.channelLabel}</h3>
          <p className="mt-1 text-sm text-slate-300">{slot.account}</p>
        </div>
        <StatusBadge status={slot.status} dueNow={slot.dueNow} />
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-slate-300">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Group / account
          </dt>
          <dd className="mt-0.5 text-slate-100">{slot.account}</dd>
        </div>
        {slot.fromAccount ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">From</dt>
            <dd className="mt-0.5 font-mono text-slate-100">{slot.fromAccount}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Audience</dt>
          <dd className="mt-0.5">{slot.audience}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Copy file</dt>
          <dd className="mt-0.5 font-mono text-xs text-cyan-100">{slot.copyPath}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Ad attachment
          </dt>
          <dd className="mt-0.5 font-mono text-xs text-cyan-100">
            {slot.adPath ?? "None — links only"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">CTA</dt>
          <dd className="mt-0.5 break-all font-mono text-xs text-slate-200">{slot.cta}</dd>
        </div>
        {slot.updatedAt ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">
              Last marked
            </dt>
            <dd className="mt-0.5 font-mono text-xs">
              {new Date(slot.updatedAt).toLocaleString()}
            </dd>
          </div>
        ) : null}
      </dl>

      {slot.emailLocked ? (
        <p className="mt-4 rounded-lg border border-rose-300/35 bg-rose-950/30 px-3 py-2 text-sm text-rose-100">
          {EMAIL_BLOCK_REASON}
        </p>
      ) : null}

      <div className="mt-4">
        <SlotActions slot={slot} onMark={(status) => onMark(slot, status)} />
      </div>
    </article>
  );
}

export default function OpsPage() {
  const { now, slots, alerts, toasts, mark, dismissToast, requestNotifications } =
    useOutreachOps();
  const todayKey = denverParts(now).dateKey;
  const defaultDate =
    OUTREACH_DATES.find((date) => date === todayKey) ??
    OUTREACH_DATES.find((date) => date >= todayKey) ??
    OUTREACH_DATES[0];
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [notifyNote, setNotifyNote] = useState<string | null>(null);
  const [markError, setMarkError] = useState<string | null>(null);

  const week = useMemo(() => summarizeWeek(slots), [slots]);
  const todaySlots = slots.filter((slot) => slot.date === todayKey);
  const selectedSlots = slots.filter((slot) => slot.date === selectedDate);
  const windowOpen = isMorningWindow(now);

  const onMark = (slot: ViewedSlot, status: OperatorMark) => {
    const result = mark(slot, status);
    setMarkError(result.error ?? null);
  };

  const onNotify = async () => {
    const permission = await requestNotifications();
    if (permission === "unsupported") {
      setNotifyNote("This browser does not support notifications.");
      return;
    }
    setNotifyNote(
      permission === "granted"
        ? "Browser notifications are on for completion marks."
        : "Notifications stayed off. In-app alerts still work.",
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <OutreachToasts toasts={toasts} onDismiss={dismissToast} />
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <ServiceTopBar middleLinkHref="/pitch" middleLinkLabel="Pitch deck" />

        <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Internal ops
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Outreach schedule</h1>
          <p className="mt-2 text-sm text-slate-300">
            {OUTREACH_WEEK_START} through {OUTREACH_WEEK_END} · {OUTREACH_WINDOW_LABEL} ·
            35 slots, 5 per day. Run queued work from your already-logged-in
            Facebook, Zoho, and Craigslist apps. This board only tracks completion.
          </p>
          <p className="mt-2 font-mono text-xs text-cyan-200" suppressHydrationWarning>
            Mountain clock: {formatDenverClock(now)}
          </p>
          <p className="mt-4 rounded-xl border border-slate-500/40 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
            Do not paste passwords here. This page does not send Facebook posts,
            Craigslist ads, or email, and it does not scrape inboxes.
          </p>
        </header>

        {windowOpen ? (
          <div className="rounded-xl border border-amber-300/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
            Due now: the 7:00–10:00am America/Denver window is open. Finish or
            skip slot n before starting n+1.
          </div>
        ) : null}

        {markError ? (
          <div className="rounded-xl border border-rose-300/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-100">
            {markError}
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.7fr)]">
          <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Week counts
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(
                [
                  ["Ready", week.counts.ready],
                  ["Due", week.counts.due],
                  ["Done", week.counts.done],
                  ["Skipped", week.counts.skipped],
                  ["Blocked", week.counts.blocked],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-cyan-400/20 bg-slate-950/40 px-3 py-2"
                >
                  <p className="text-xs uppercase tracking-[0.1em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-2xl">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">
              {week.remainingSendable} Facebook / Craigslist slots still open ·{" "}
              {week.emailBlocked} email slots blocked · {week.done}/{week.total}{" "}
              marked done
            </p>
          </article>
          <OutreachWidget slots={slots} now={now} />
        </section>

        <section className="rounded-2xl border border-rose-400/25 bg-slate-900/65 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-rose-200">
            Email gates
          </p>
          <h2 className="mt-2 text-xl font-semibold">Cold email stays blocked</h2>
          <p className="mt-2 text-sm text-slate-300">
            Queued from <span className="font-mono text-cyan-100">{EMAIL_FROM}</span>{" "}
            but not sendable until compliance fields exist.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="rounded-lg border border-rose-300/30 bg-rose-950/20 px-3 py-2">
              Physical mailing address — missing
            </li>
            <li className="rounded-lg border border-rose-300/30 bg-rose-950/20 px-3 py-2">
              Unsubscribe URL — missing
            </li>
            <li className="rounded-lg border border-rose-300/30 bg-rose-950/20 px-3 py-2">
              Inbox scraping — never. Public company addresses only.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
                Today
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {todaySlots.length > 0
                  ? `${todaySlots.length} slots · ${formatDateLabel(todayKey)}`
                  : `No slots on ${formatDateLabel(todayKey)}`}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void onNotify()}
              className="inline-flex min-h-11 items-center rounded-md border border-cyan-300/40 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              Enable browser alerts
            </button>
          </div>
          {notifyNote ? (
            <p className="mt-3 text-sm text-slate-300">{notifyNote}</p>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              Optional: allow notifications so a completion mark can ping this
              browser. In-app toasts always appear.
            </p>
          )}
          {todaySlots.length === 0 ? (
            <p className="mt-4 text-sm text-slate-300">
              Week runs {OUTREACH_WEEK_START}–{OUTREACH_WEEK_END}. Use the day
              tabs to prep or mark the next window.
            </p>
          ) : (
            <div className="mt-4 grid gap-4">
              {todaySlots.map((slot) => (
                <SlotCard key={slot.id} slot={slot} onMark={onMark} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Full week
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {formatDateLabel(selectedDate)}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Outreach days">
              {OUTREACH_DATES.map((date) => (
                <button
                  key={date}
                  type="button"
                  role="tab"
                  aria-selected={date === selectedDate}
                  onClick={() => setSelectedDate(date)}
                  className={`inline-flex min-h-11 items-center rounded-md border px-3 py-1 text-sm ${
                    date === selectedDate
                      ? "border-cyan-300/80 bg-cyan-900/30 text-cyan-100"
                      : "border-cyan-400/25 text-slate-200 hover:bg-cyan-400/10"
                  }`}
                >
                  {formatDateLabel(date)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {selectedSlots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} onMark={onMark} />
            ))}
          </div>
        </section>

        <OutreachAlertList alerts={alerts} />
      </section>
    </main>
  );
}
