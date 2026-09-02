import assert from "node:assert/strict";
import {
  applyMark,
  canMarkComplete,
  denverLocalToUtcMs,
  denverParts,
  deriveStatus,
  EMPTY_OPS_STATE,
  isEmailLocked,
  isMorningWindow,
  viewSlots,
} from "../app/lib/outreachOps";
import {
  EMAIL_FROM,
  OUTREACH_DATES,
  OUTREACH_SLOTS,
} from "../app/lib/outreachSchedule";

assert.equal(OUTREACH_SLOTS.length, 35, "35 slots");
assert.equal(OUTREACH_DATES.length, 7, "7 days");

for (const date of OUTREACH_DATES) {
  const daySlots = OUTREACH_SLOTS.filter((slot) => slot.date === date);
  assert.equal(daySlots.length, 5, `5 slots on ${date}`);
  assert.deepEqual(
    daySlots.map((slot) => slot.time),
    ["07:00", "07:40", "08:20", "09:00", "09:40"],
    `stagger on ${date}`,
  );
}

const emailSlots = OUTREACH_SLOTS.filter((slot) => slot.channel === "email");
assert.equal(emailSlots.length, 7, "7 email slots");
assert.ok(emailSlots.every((slot) => slot.fromAccount === EMAIL_FROM));
assert.ok(emailSlots.every((slot) => isEmailLocked(slot)));
assert.ok(emailSlots.every((slot) => !canMarkComplete(slot)));

const facebookGroups = OUTREACH_SLOTS.filter((slot) => slot.channel === "facebook_group");
assert.equal(facebookGroups.length, 7);
assert.ok(
  facebookGroups.every((slot) =>
    /ABQ|Albuquerque|Rio Rancho|New Mexico|NM /i.test(slot.account),
  ),
  "Facebook groups are named ABQ/NM rooms",
);

const beforeWeek = new Date("2026-09-02T12:00:00-06:00");
const views = viewSlots({}, beforeWeek);
assert.equal(views.filter((slot) => slot.status === "blocked").length, 7);
assert.equal(views.filter((slot) => slot.channel !== "email" && slot.status === "ready").length, 28);
assert.equal(views.filter((slot) => slot.status === "due").length, 0);

const s01 = OUTREACH_SLOTS[0];
const duringS01 = new Date(denverLocalToUtcMs(s01.date, s01.time) + 60_000);
assert.equal(deriveStatus(s01, undefined, duringS01), "due");
assert.equal(isMorningWindow(duringS01), true);

const s04 = emailSlots[0];
const blockedAttempt = applyMark(EMPTY_OPS_STATE, s04, "done", duringS01);
assert.ok(blockedAttempt.error);
assert.equal(blockedAttempt.state.alerts.length, 0);

const completed = applyMark(EMPTY_OPS_STATE, s01, "done", duringS01);
assert.equal(completed.state.updates.S01.status, "done");
assert.equal(completed.alert?.kind, "complete");
assert.match(completed.alert?.message ?? "", /S01 complete/);

const afterComplete = viewSlots(completed.state.updates, duringS01);
assert.equal(afterComplete.find((slot) => slot.id === "S01")?.status, "done");
assert.equal(afterComplete.find((slot) => slot.id === "S04")?.status, "blocked");

const parts = denverParts(new Date("2026-09-03T13:00:00.000Z"));
assert.equal(parts.dateKey, "2026-09-03");
assert.equal(parts.hour, 7);

console.log("outreach ops invariants ok");
