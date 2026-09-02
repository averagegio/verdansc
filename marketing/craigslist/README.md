# Verdansc Craigslist housing pack (Albuquerque / Rio Rancho)

Assets and copy for a **human** to post in Craigslist **housing wanted**. Nothing here posts live.

## What is in this folder

| Path | Purpose |
| --- | --- |
| `images/` | 12 original generated photos (apartments, lofts, flats; ABQ + Rio Rancho look) |
| `images/manifest.md` | Filename, type, area, alt text + attach order |
| `images/manifest.csv` | Same table for spreadsheets |
| `ad-copy.md` | Housing-wanted posts (primary) + housing-offered variant |
| `how-to.md` | Operator steps, link order, compliance |
| `form-checklist.md` | Craigslist fields + Verdansc intake/apply mapping |

## Conversion (sale)

1. https://verdansc.com/credit-check — $19 credit check  
2. https://verdansc.com/listings — rental application (`/apply/{listingId}`)

Landlord intake that **creates** apply links: https://verdansc.com/rental-application (not the renter form).

## Photo rules

- All images in `images/` are **generated samples**, not a specific address Verdansc manages.
- This repo had no owned listing photography in `public/` (only default Next.js SVGs).
- Do not scrape Zillow, Craigslist, or Apartments.com photos.
- Housing wanted: say the photos are style samples.
- Housing offered: use photos of a unit you actually control.

## Sibling work

Only this path is for this pack: `marketing/craigslist/`. Other marketing folders belong to other workstreams.
