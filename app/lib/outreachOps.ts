import {
  EMAIL_BLOCK_REASON,
  OUTREACH_SLOTS,
  OUTREACH_TIMEZONE,
  type OutreachSlot,
} from "./outreachSchedule";

export const STORAGE_KEY = "verdansc.outreach.ops.v1";
export const STORAGE_VERSION = 1 as const;

export const EMAIL_GATES = {
  physicalMailingAddress: false,
  unsubUrl: false,
  scrapingAllowed: false,
} as const;

export type OperatorMark = "ready" | "done" | "skipped" | "blocked";
export type DerivedStatus = "ready" | "due" | "done" | "skipped" | "blocked";
export type AlertKind = "complete" | "skip" | "blocked" | "reset";

export type SlotUpdate = {
  status: OperatorMark;
  updatedAt: string;
};

export type OutreachAlert = {
  id: string;
  slotId: string;
  kind: AlertKind;
  message: string;
  createdAt: string;
};

export type StoredOpsState = {
  version: typeof STORAGE_VERSION;
  updates: Record<string, SlotUpdate>;
  alerts: OutreachAlert[];
};

export type ViewedSlot = OutreachSlot & {
  status: DerivedStatus;
  updatedAt: string | null;
  dueNow: boolean;
  emailLocked: boolean;
};

export const EMPTY_OPS_STATE: StoredOpsState = {
  version: STORAGE_VERSION,
  updates: {},
  alerts: [],
};

export function emailGatesOpen(): boolean {
  return (
    EMAIL_GATES.physicalMailingAddress &&
    EMAIL_GATES.unsubUrl &&
    EMAIL_GATES.scrapingAllowed
  );
}

export function isEmailLocked(slot: OutreachSlot): boolean {
  return slot.channel === "email" && !emailGatesOpen();
}

export type DenverParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
  dateKey: string;
  timeLabel: string;
};

export function denverParts(date: Date): DenverParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: OUTREACH_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  });
  const bag = Object.fromEntries(
    fmt.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour: Number(bag.hour),
    minute: Number(bag.minute),
    weekday: bag.weekday,
    dateKey: `${bag.year}-${bag.month}-${bag.day}`,
    timeLabel: `${bag.hour}:${bag.minute}`,
  };
}

export function denverLocalToUtcMs(dateKey: string, time: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  let utc = Date.UTC(year, month - 1, day, hour, minute);

  for (let i = 0; i < 4; i += 1) {
    const parts = denverParts(new Date(utc));
    const dayDelta = Date.UTC(year, month - 1, day) - Date.UTC(parts.year, parts.month - 1, parts.day);
    const minuteDelta =
      (hour - parts.hour) * 60 + (minute - parts.minute) + dayDelta / 60_000;
    if (minuteDelta === 0) break;
    utc += minuteDelta * 60_000;
  }

  return utc;
}

export function slotStartMs(slot: OutreachSlot): number {
  return denverLocalToUtcMs(slot.date, slot.time);
}

export function isMorningWindow(now: Date): boolean {
  const parts = denverParts(now);
  const minutes = parts.hour * 60 + parts.minute;
  return minutes >= 7 * 60 && minutes < 10 * 60;
}

export function isDueNow(slot: OutreachSlot, now: Date): boolean {
  const start = slotStartMs(slot);
  const end = start + 40 * 60_000;
  const ts = now.getTime();
  return ts >= start && ts < end;
}

export function isPastSlotStart(slot: OutreachSlot, now: Date): boolean {
  return now.getTime() >= slotStartMs(slot);
}

export function deriveStatus(
  slot: OutreachSlot,
  update: SlotUpdate | undefined,
  now: Date,
): DerivedStatus {
  if (isEmailLocked(slot)) {
    return update?.status === "skipped" ? "skipped" : "blocked";
  }
  if (update?.status === "done") return "done";
  if (update?.status === "skipped") return "skipped";
  if (update?.status === "blocked") return "blocked";
  if (isPastSlotStart(slot, now)) return "due";
  return "ready";
}

export function canMarkComplete(slot: OutreachSlot): boolean {
  return !isEmailLocked(slot);
}

export function viewSlots(
  updates: Record<string, SlotUpdate>,
  now: Date,
  slots: OutreachSlot[] = OUTREACH_SLOTS,
): ViewedSlot[] {
  return slots.map((slot) => {
    const update = updates[slot.id];
    const status = deriveStatus(slot, update, now);
    return {
      ...slot,
      status,
      updatedAt: update?.updatedAt ?? null,
      dueNow: status === "due" && isDueNow(slot, now),
      emailLocked: isEmailLocked(slot),
    };
  });
}

export function slotsOnDate(slots: ViewedSlot[], dateKey: string): ViewedSlot[] {
  return slots.filter((slot) => slot.date === dateKey);
}

export function remainingSendable(slots: ViewedSlot[]): ViewedSlot[] {
  return slots.filter(
    (slot) => slot.status === "ready" || slot.status === "due",
  );
}

export function nextSendable(slots: ViewedSlot[]): ViewedSlot | null {
  return remainingSendable(slots)[0] ?? null;
}

export function countByStatus(slots: ViewedSlot[]) {
  return slots.reduce(
    (acc, slot) => {
      acc[slot.status] += 1;
      return acc;
    },
    { ready: 0, due: 0, done: 0, skipped: 0, blocked: 0 },
  );
}

export function formatDenverClock(now: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: OUTREACH_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(now);
}

export function formatSlotTime(slot: Pick<OutreachSlot, "time">): string {
  const [hourRaw, minute] = slot.time.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute}${suffix} MT`;
}

export function formatDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, 18, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: OUTREACH_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(utc);
}

export function parseStoredState(raw: string | null): StoredOpsState {
  if (!raw) return EMPTY_OPS_STATE;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredOpsState>;
    if (parsed.version !== STORAGE_VERSION || typeof parsed.updates !== "object") {
      return EMPTY_OPS_STATE;
    }
    return {
      version: STORAGE_VERSION,
      updates: parsed.updates ?? {},
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts.slice(0, 30) : [],
    };
  } catch {
    return EMPTY_OPS_STATE;
  }
}

export function loadOpsState(): StoredOpsState {
  if (typeof window === "undefined") return EMPTY_OPS_STATE;
  try {
    return parseStoredState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY_OPS_STATE;
  }
}

export function saveOpsState(state: StoredOpsState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode / quota — keep in-memory only.
  }
}

export function applyMark(
  state: StoredOpsState,
  slot: OutreachSlot,
  status: OperatorMark,
  now: Date,
): { state: StoredOpsState; alert: OutreachAlert | null; error?: string } {
  if (status === "done" && !canMarkComplete(slot)) {
    return { state, alert: null, error: EMAIL_BLOCK_REASON };
  }

  const nextStatus: OperatorMark = isEmailLocked(slot) && status === "ready"
    ? "blocked"
    : status === "ready" && isEmailLocked(slot)
      ? "blocked"
      : status;

  if (isEmailLocked(slot) && nextStatus === "done") {
    return { state, alert: null, error: EMAIL_BLOCK_REASON };
  }

  const updatedAt = now.toISOString();
  const updates = { ...state.updates };

  if (nextStatus === "ready" && !isEmailLocked(slot)) {
    delete updates[slot.id];
  } else {
    updates[slot.id] = { status: nextStatus, updatedAt };
  }

  const kind: AlertKind | null =
    nextStatus === "done"
      ? "complete"
      : nextStatus === "skipped"
        ? "skip"
        : nextStatus === "blocked"
          ? "blocked"
          : status === "ready"
            ? "reset"
            : null;

  const message =
    nextStatus === "done"
      ? `${slot.id} complete — ${slot.channelLabel} · ${slot.account}`
      : nextStatus === "skipped"
        ? `${slot.id} skipped — ${slot.channelLabel}`
        : nextStatus === "blocked"
          ? `${slot.id} blocked — ${slot.channelLabel}`
          : `${slot.id} reset to ready`;

  const alert: OutreachAlert | null = kind
    ? {
        id: `${slot.id}-${updatedAt}`,
        slotId: slot.id,
        kind,
        message,
        createdAt: updatedAt,
      }
    : null;

  return {
    state: {
      version: STORAGE_VERSION,
      updates,
      alerts: alert ? [alert, ...state.alerts].slice(0, 30) : state.alerts,
    },
    alert,
  };
}

export function summarizeWeek(slots: ViewedSlot[]) {
  const counts = countByStatus(slots);
  const sendable = remainingSendable(slots);
  const emailBlocked = slots.filter((slot) => slot.emailLocked && slot.status === "blocked");
  return {
    counts,
    remainingSendable: sendable.length,
    emailBlocked: emailBlocked.length,
    next: nextSendable(slots),
    done: counts.done,
    total: slots.length,
  };
}
