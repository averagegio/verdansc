# Verdansc Outreach — phone tracker

Standalone installable PWA. **Not** part of the Verdansc listings map app.
Marks Facebook, Craigslist, and LinkedIn outreach slots on your phone. It does
not send email, post to Facebook, post to Craigslist, publish to LinkedIn, or
ask for a password.

Week copied into `slots.js`: **Sep 2–9 2026**. Cadence **7:00 / 7:40 / 8:00
(LinkedIn weekdays) / 8:20 / 9:00 / 9:40 America/Denver**. Wednesday Sep 2 uses
the same mix (Facebook / Craigslist / LinkedIn / inbound only — no cold email).
Email / cold slots stay **blocked** (no scrape, no CAN-SPAM address or
unsubscribe URL) and cannot be marked sent.

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
- Full week: all 46 slots (40 Facebook / Craigslist / email plus 6 weekday
  LinkedIn), named ABQ / NM small-business Facebook groups
- Facebook + Craigslist + LinkedIn: **Mark complete** or **Skip**, with a
  banner alert
- Email: stays **blocked** — no send button
- “Due now” highlight in the 7:00–10:00am MT window
- Offline via service worker after the first load
- Payments tab: recent Stripe PaymentIntents (amount, status, created,
  description) via an optional **local** proxy. No Stripe secret in the
  widget or git. Without a proxy the tab is empty and links to
  [Stripe payments](https://dashboard.stripe.com/payments).

## Payments (optional local Stripe proxy)

The tracker never talks to Stripe with a secret key. On your laptop:

```bash
cd outreach-tracker
export STRIPE_SECRET_KEY=sk_test_your_key_from_the_dashboard
node stripe-proxy.mjs
```

`GET http://127.0.0.1:4242/charges` lists recent PaymentIntents. Open the
widget with `?stripeProxy=http://127.0.0.1:4242` (saved in `localStorage`)
or paste that URL into the Payments tab. Do not commit `STRIPE_SECRET_KEY`.

Default bind is `127.0.0.1:4242`. Override with `STRIPE_PROXY_HOST` /
`STRIPE_PROXY_PORT` if needed. The key stays in the proxy process environment.
