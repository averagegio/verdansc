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

const EXPECTED_GROUPS = {
  "2026-09-02": "Albuquerque Small Business Community",
  "2026-09-03": "Albuquerque Small Business Community",
  "2026-09-04": "New Mexico Small Businesses",
  "2026-09-05": "ABQ SMALL BUSINESS",
  "2026-09-06": "Support Small Business, Albuquerque, Los Lunas, Rio Rancho, Edgewood",
  "2026-09-07": "ABQ Community Services / Small Business",
  "2026-09-08": "Albuquerque Business Owners",
  "2026-09-09": "Albuquerque Small Business Owners",
};

const BANNED = /T&C|Monarch|Country Club Lofts|Rembe|Bryten/i;

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

  const email = slots.filter((s) => s.channel === "email" || s.blocked);
  assert.equal(email.length, 0, "no blocked PM cold-email rows");

  const blob = slots
    .map((s) => `${s.title}\n${s.detail}\n${s.group}`)
    .join("\n");
  assert.equal(BANNED.test(blob), false, "T&C / Monarch / Rembe / Bryten must be gone");

  const groupPosts = slots.filter((s) => s.channel === "facebook_group");
  const byDate = Object.fromEntries(groupPosts.map((s) => [s.date, s.group]));
  assert.deepEqual(byDate, EXPECTED_GROUPS);

  const uniqueFriWed = groupPosts
    .filter((s) => s.date >= "2026-09-04")
    .map((s) => s.group);
  assert.equal(new Set(uniqueFriWed).size, uniqueFriWed.length);
  assert.ok(
    uniqueFriWed.every((g) => g !== "Albuquerque Small Business Community"),
    "never reuse Albuquerque Small Business Community Fri–Wed",
  );

  for (const date of [
    "2026-09-03",
    "2026-09-04",
    "2026-09-05",
    "2026-09-06",
    "2026-09-07",
    "2026-09-08",
    "2026-09-09",
  ]) {
    const li = slots.filter((s) => s.date === date && s.channel === "linkedin");
    assert.equal(li.length, 2, `${date} should have two LinkedIn Grok-ad slots`);
    assert.equal(li[0].time, "09:00");
    assert.equal(li[1].time, "09:40");
    for (const slot of li) {
      assert.match(slot.detail, /Grok Imagine/);
      assert.match(slot.detail, new RegExp(`grok-imagine-linkedin-${date}\\.mp4`));
      assert.match(slot.detail, /\$19 soft credit check/);
      assert.match(slot.detail, /rental-application intake/);
      assert.match(slot.detail, /landlord signup/);
      assert.match(slot.detail, /no DMs/);
      assert.match(slot.detail, /no paid/);
      assert.equal(slot.detail.includes("/listings"), true);
      assert.match(slot.detail, /no \/listings/);
      assert.equal(/linkedin.?dm/i.test(slot.detail), false);
    }
  }

  const craigslist = slots.filter((s) => s.channel === "craigslist");
  assert.ok(craigslist.length >= 7, "Craigslist rows stay listed");
}

const remaining = standalone.OUTREACH_SLOTS.filter(
  (s) => s.date >= "2026-09-03" && !s.blocked,
);
assert.equal(remaining[0].id, "S01");
assert.equal(remaining[0].channel, "facebook_group");

console.log(
  "ok: 40 slots synced, unique FB groups, LinkedIn Grok-ad 9:00/9:40 through 2026-09-09, zero blocked email rows",
);
