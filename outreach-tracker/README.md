# Verdansc Outreach — phone tracker

Standalone installable PWA. **Not** part of the Verdansc listings map app.
Marks Facebook, Craigslist, LinkedIn, and investor-email outreach slots on
your phone. It does not send email, post to Facebook, post to Craigslist,
publish to LinkedIn, or ask for a password.

Week copied into `slots.js`: **Sep 2–9 2026**. Cadence **7:00 / 7:40 / 8:00
(LinkedIn weekdays) / 8:20 / 9:00 / 9:40 America/Denver**, plus Thursday
**10:00–10:50** investor notes (`I01`–`I06`). Window **7:00–11:00 MT**.
Wednesday Sep 2 uses the morning mix (Facebook / Craigslist / LinkedIn /
inbound only — no cold email). Property-manager cold email stays **blocked**
(`channel: "email"` + `blocked: true` — no scrape, no CAN-SPAM address or
unsubscribe URL) and cannot be marked sent. `investor_email` is **not** that
gate: Mark complete / Skip.

**Facebook rotation (CoS lock, one unique group per day, 7:00 AM MT):**

| Day | Date | Group | Copy |
| --- | --- | --- | --- |
| Thu | 2026-09-03 | Albuquerque Small Business Community | small-business |
| Fri | 2026-09-04 | Albuquerque Real Estate Investors (confirm live title) | real-estate-short |
| Sat | 2026-09-05 | Rio Rancho / ABQ landlords and property managers (confirm live title) | real-estate-short |
| Sun | 2026-09-06 | New Mexico Small Businesses | small-business |
| Mon | 2026-09-07 | Albuquerque landlords / property managers (confirm live title) | real-estate-long |
| Tue | 2026-09-08 | Albuquerque REALTORS / agent networking (confirm live title) | real-estate-short |
| Wed | 2026-09-09 | ABQ SMALL BUSINESS | small-business |

Held unused this week: Support Small Business metro, ABQ Community Services /
Small Business, Albuquerque Business Owners, Albuquerque Small Business Owners.
Facebook rows attach `grok-imagine-ad.mp4` if video is allowed plus
`grok-imagine-ad-endframe.png`. DMs: endframe still only, never the MP4.
Post body CTA is signup + rental-application + $19 credit-check. First comment
may mention the short deck at `/pitch`. Inbound DMs stay same-day group.

**Thursday investor notes:** six 1:1 Zoho pastes from `founder@verdansc.com`,
CTA `https://www.verdansc.com/pitch`, one To: per slot, rotate
angel / seed / proptech / generalist / angel / seed. Do not blast. Do not
commit `contacts.extracted.json`.

**LinkedIn:** one organic feed post per weekday at **8:00 AM MT** (`S-LI-01` …
`S-LI-06`). Not Saturday or Sunday. Channel `linkedin` is sendable (Mark
complete / Skip). Attach the motion 16:9 ad `verdansc_higgsfield_ad_30s.mp4` /
Ken Burns export; copy is a short professional post + `verdansc.com/pitch`.
This app does not publish.

Hosted copy: `public/tracker/slots.js` must stay byte-identical to this
`slots.js`. After merge, open https://www.verdansc.com/tracker and Add to Home
Screen.

## Open on your phone

Serve the hosted copy (`public/tracker/`, absolute `/tracker/` asset paths) or
the standalone folder (`outreach-tracker/`, relative paths):

```bash
cd outreach-tracker
python3 -m http.server 4173
```

Then open `http://<your-laptop-ip>:4173` on the phone.

Cloud VM preview for this PWA is the same port **4173**.

Or drop the folder on any static host (Netlify, GitHub Pages, `npx serve`,
Cloudflare Pages). The app is only the files in this directory.

## Add to Home Screen

No account. No login.

**iPhone / iPad (Safari)**

1. Open the URL in Safari (not an in-app browser).
2. Tap Share → **Add to Home Screen**.
3. Name it `Outreach` (or keep Verdansc Outreach).
4. Open the icon. The home screen is the daily widget.

**Android (Chrome)**

1. Open the URL in Chrome.
2. Menu → **Install app** / **Add to Home screen**.
3. Open the installed icon.

Marks live in this device’s `localStorage`. Clearing site data clears the week.

## What it does

- Widget: today’s Mountain date, next due, daily slots, remaining counts
- Live HH:MM:SS countdown to the next remaining sendable slot
  (America/Denver); remaining counts and next-due update as soon as you mark
  complete or skip
- Full week: all 52 slots (Facebook / Craigslist / blocked PM email / weekday
  LinkedIn / Thursday investor notes), named ABQ / NM small-business Facebook
  groups
- Facebook + Craigslist + LinkedIn + investor email: **Mark complete** or
  **Skip**, with a banner alert
- PM cold email: stays **blocked** — no send button
- “Due now” highlight in the 7:00–11:00am MT window
- Offline via service worker after the first load
