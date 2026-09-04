# Verdansc Outreach — phone tracker

Standalone installable PWA. **Not** part of the Verdansc listings map app.
Marks Facebook, Craigslist, and LinkedIn outreach slots on your phone. It does
not send email, post to Facebook, post to Craigslist, publish to LinkedIn, or
ask for a password.

Week copied into `slots.js`: **Sep 2–9 2026**. Cadence **7:00 / 7:40 / 8:00
(LinkedIn weekdays) / 8:20 / 9:00 / 9:40 America/Denver**. Wednesday Sep 2 uses
the same mix (Facebook / Craigslist / LinkedIn / inbound only).

**Cold email is not in this app.** Property-manager cold outreach (`channel:
email`) and investor / VC blast slots (`investor_email`) are omitted from the
PWA. Drafts under `marketing/investors/` stay on disk; they are not queued
here. Facebook group posts, Craigslist, LinkedIn, first-comment, DM, and
reply-window slots remain. LEFT TODAY / LEFT THIS WEEK count only those
sendable rows.

**LinkedIn:** one organic feed post per weekday at **8:00 AM MT** (`S-LI-01` …
`S-LI-06`). Not Saturday or Sunday. Channel `linkedin` is sendable (Mark
complete / Skip). Attach the motion 16:9 ad `verdansc_higgsfield_ad_30s.mp4` /
Ken Burns export; copy is a short professional post + `verdansc.com/pitch`.
This app does not publish.

## Open on your phone

Serve this folder as static files (any host, or your laptop on the same Wi-Fi):

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
- Full week: 39 Facebook / Craigslist / LinkedIn / inbound slots (no cold
  email), named ABQ / NM small-business Facebook groups
- Facebook + Craigslist + LinkedIn: **Mark complete** or **Skip**, with a
  banner alert
- “Due now” highlight in the 7:00–10:00am MT window
- Offline via service worker after the first load
- Payments tab: recent Stripe PaymentIntents (amount, status, created,
  description) via an optional **local** proxy. No Stripe secret in the
  widget or git. Without a proxy the tab is empty and links to
  [Stripe payments](https://dashboard.stripe.com/payments).

## Stripe proxy (`outreach-tracker/stripe-proxy.mjs`)

The Payments tab never talks to Stripe with a secret key. The proxy is
**`outreach-tracker/stripe-proxy.mjs`**. There is no site `/ops/stripe` route
for this widget.

1. Get a secret key from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   (`sk_test_…` or `sk_live_…`).
2. Export it in the shell that will run the proxy. **Never commit the key.**

```bash
cd outreach-tracker
export STRIPE_SECRET_KEY=sk_live_or_test_from_stripe_dashboard
node stripe-proxy.mjs
```

Default listen: **`http://127.0.0.1:4242`**.

Open the tracker Payments tab through the proxy query string:

```
http://127.0.0.1:4173/?stripeProxy=http://127.0.0.1:4242#/payments
```

`GET http://127.0.0.1:4242/charges` lists recent PaymentIntents. You can also
paste `http://127.0.0.1:4242` into the Payments tab (saved in `localStorage`).

Override bind with `STRIPE_PROXY_HOST` / `STRIPE_PROXY_PORT` if needed. The key
stays in the proxy process environment only.
