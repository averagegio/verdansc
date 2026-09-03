# Verdansc Outreach — phone tracker

Standalone installable PWA. **Not** part of the Verdansc listings map app.
Marks Facebook, Craigslist, and LinkedIn outreach slots on your phone. It does
not send email, post to Facebook, post to Craigslist, publish to LinkedIn, or
ask for a password.

Week copied into `slots.js`: **Sep 2–9 2026**, five slots a day at
**7:00 / 7:40 / 8:20 / 9:00 / 9:40 America/Denver** (window **7:00–10:00 MT**).

GTM this week: one unique Facebook group per day; LinkedIn organic Grok Imagine
ads in the 9:00 / 9:40 slots (new 16:9 ad each day through 2026-09-09); Craigslist
listed but not primary. T&C / Monarch / Country Club Lofts / Rembe / Bryten cold
email rows are **gone** — not blocked placeholders. LinkedIn is organic only
(no DMs, no paid). Do not CTA `/listings` while the Austin smoke-test row is
public.

Do **not** rewrite this cadence to the PM-email kit window (Tue–Thu
9:00–11:30am). That kit is drafts only and is not this PWA’s schedule.

Hosted copy: `public/tracker/slots.js` must stay byte-identical to this
`slots.js` (40 slots: `S-TODAY-01`…`05` + `S01`–`S35`). After merge, open https://www.verdansc.com/tracker and Add to Home Screen.

## Open on your phone

Serve the hosted copy (`public/tracker/`, absolute `/tracker/` asset paths) or
the standalone folder (`outreach-tracker/`, relative paths):

```bash
cd public/tracker   # or: cd outreach-tracker
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

- Widget: today’s Mountain date, next due, five daily slots, remaining counts
- Live HH:MM:SS countdown to today 7:00 AM MT when still before that window, otherwise the next remaining sendable slot (America/Denver); remaining counts and next-due update as soon as you mark complete or skip
- Full week: all 40 slots, unique ABQ / NM small-business Facebook groups plus LinkedIn Grok-ad slots
- Facebook, Craigslist, LinkedIn: **Mark complete** or **Skip**, with a banner alert
- No PM cold-email rows on the board
- “Due now” highlight in the 7:00–10:00am MT window
- Offline via service worker after the first load
