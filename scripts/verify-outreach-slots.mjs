#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  path.join(root, "outreach-tracker/slots.js"),
  path.join(root, "public/tracker/slots.js"),
];

function loadSlots(file) {
  const src = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window;
}

const [standalone, hosted] = files.map(loadSlots);

assert.equal(
  fs.readFileSync(files[0], "utf8"),
  fs.readFileSync(files[1], "utf8"),
  "public/tracker/slots.js must match outreach-tracker/slots.js",
);

for (const pack of [standalone, hosted]) {
  const week = pack.OUTREACH_WEEK;
  const slots = pack.OUTREACH_SLOTS;
  assert.equal(week.tz, "America/Denver");
  assert.equal(week.times.join(","), "07:00,07:40,08:20,09:00,09:40");
  assert.equal(week.windowStart, "07:00");
  assert.equal(week.windowEnd, "10:00");
  assert.equal(week.start, "2026-09-02");
  assert.equal(week.end, "2026-09-09");
  assert.equal(slots.length, 40, "expected 40 slots");
  assert.equal(slots[0].id, "S-TODAY-01");
  assert.equal(slots[0].date, "2026-09-02");
  assert.equal(slots[5].id, "S01");
  assert.equal(slots[5].date, "2026-09-03");
  assert.equal(slots[5].time, "07:00");
  assert.equal(slots[5].title, "Albuquerque Small Business Community");
  const email = slots.filter((s) => s.channel === "email");
  assert.equal(email.length, 7);
  assert.ok(email.every((s) => s.blocked === true));
}

const remaining = standalone.OUTREACH_SLOTS.filter(
  (s) => s.date >= "2026-09-03" && s.channel !== "email" && !s.blocked,
);
assert.equal(remaining[0].id, "S01");

console.log(
  "ok: 40 slots synced, 7:00–10:00 America/Denver, 7 email rows blocked, next sendable S01 Thu 07:00",
);
