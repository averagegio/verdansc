# VERDANSC

Verdansc is a map-first real estate service portal with linked API service pages
for credit checks, 3D tours, draft agreements, escrow, and broker matching.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Stripe keys

1. Copy `.env.example` to `.env.local`.
2. Add your real Stripe keys:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Restart the dev server.

When `STRIPE_SECRET_KEY` is present, `POST /api/stripe/credit-check` creates a
Stripe Checkout session. Without a key, it falls back to mock mode.

## Vercel deployment

Preview deploy:

```bash
npm run vercel:preview
```

Production deploy:

```bash
npm run vercel:prod
```

`vercel.json` is included for Next.js deployment defaults.

## Connect `verdansc.com` DNS to Vercel

1. In Vercel, open your project, then go to **Settings -> Domains**.
2. Add `verdansc.com` and `www.verdansc.com`.
3. At your DNS provider, add:
   - **A record** for root (`@`) -> `76.76.21.21`
   - **CNAME** for `www` -> `cname.vercel-dns.com`
4. Remove conflicting old A/CNAME records for the same hostnames.
5. Wait for propagation, then click **Refresh** in Vercel Domains until both
   show as configured.
6. Set `verdansc.com` as primary domain in Vercel if desired.
