# Verdansc marketing ads

Two paid-social ads for **VERDANSC**: a photographic still and a ~30 second split-screen video. Tenant and landlord stories run in parallel and land on the same match.

Canonical product URL: `https://verdansc.com` (`app/layout.tsx` `metadataBase`).

## File list

### Ready to run (use these)

| File | Use |
| --- | --- |
| `exports/verdansc-split-ad-4x5.png` (+ `.jpg` `.webp`) | Instagram / Facebook feed still (1080×1350) |
| `exports/verdansc-split-ad-1x1.png` (+ `.jpg` `.webp`) | Feed / carousel square (1080×1080) |
| `exports/verdansc-split-ad-16x9.png` (+ `.jpg` `.webp`) | Landscape still / YouTube / X (1920×1080) |
| `exports/verdansc-split-ad-30s-16x9.mp4` | Primary video, **30.00s**, 1920×1080, H.264 + silent AAC |
| `exports/verdansc-split-ad-30s-9x16.mp4` | Reels / Stories, **30.00s**, 1080×1920 |

### Source and rebuild

| Path | What it is |
| --- | --- |
| `source/` | Original generated lifestyle photos (no portal listing scrapes) |
| `ui-captures/` | Screenshots of the live local app (`http://localhost:3000`) with fictional Maya Chen / Harborline Flats 2B data |
| `frames/16x9/` and `frames/9x16/` | Composed storyboard stills baked with captions |
| `compose_ads.py` | PIL compositor (brand overlays, phone chrome, split layout) |
| `export-video.sh` | ffmpeg Ken Burns + xfade assembly |
| `capture-ui.mjs` | Playwright capture helper (needs `playwright-core` + Chrome) |
| `COPY.md` | Overlay copy, captions, suggested placements |

## How the ads were made

1. **Brand from the repo.** Wordmark `VERDANSC`, navy map UI (`#02060d`), cyan `#22d3ee`, teal `#14b8a6`, ice text `#f0f9ff`. There is no separate logo file; the product uses the Impact-style wordmark in `app/globals.css`.
2. **Real flows captured** on the running Next.js app:
   - Tenant search: `/listings` (Renter Discovery)
   - Credit check: `/credit-check` (Maya Chen, fictional SSN last-4 `0000`)
   - Rental application: `/apply/lst_…` Harborline Flats 2B
   - Landlord intake: `/rental-application` (Applicant Intake Setup)
3. **Original photography** generated in-session (kitchen tenant, craftsman-house landlord, notification stills, aerial end-card). No Zillow/portal listing photos.
4. **Composition.** `compose_ads.py` places live UI screenshots in phone/laptop chrome on top of the photos, adds TENANT / LANDLORD pills, captions, and in-app-style notification cards.
5. **Video.** `export-video.sh` Ken-Burns each frame (~5.5–8s) then `xfade` fades to exactly 30.00 seconds.

## Video storyboard vs beats

Split screen throughout (16:9 left/right, 9:16 stacked).

| Time | Storyboard beat | What is on screen |
| --- | --- | --- |
| 0–5s | Tenant searches rentals; landlord photographs property | Live `/listings` UI + landlord camera still |
| 5–10s | Tenant credit check; landlord uploads into intake | Live `/credit-check` UI + live `/rental-application` intake overlay |
| 10–16s | Tenant rental application; listing goes live | Live `/apply/…` Harborline Flats 2B + intake setup |
| 16–23s | Climax notifications | Tenant: “Application accepted” + “Credit check complete”. Landlord: “You got a tenant” |
| 23–30s | Brand + CTA | `VERDANSC` · Find a home. Fill a home. · `verdansc.com/listings` |

## Suggested placements

- **4:5 still:** Instagram feed, Facebook feed, Advantage+ catalog creative.
- **1:1 still:** Instagram carousel, Facebook right column.
- **16:9 still / 16:9 video:** Facebook in-stream, YouTube bumper-adjacent, X, LinkedIn.
- **9:16 video:** Instagram Reels, Facebook Reels, Stories (safe-zone copy is in the center third).

Primary CTA path: **https://verdansc.com/listings**  
Landlord path: **https://verdansc.com/rental-application**  
Credit check: **https://verdansc.com/credit-check**

## Gaps (product vs ad)

- **No property-photo field on intake.** `/rental-application` creates an intake link (title, address, fee, requirements) and does not accept a listing photo. Photo upload exists on `/move-out-tracker` and `/move-in-planner` evidence images, not on intake. The ad shows a landlord photographing a house, then the real intake form — that pairing is narrative, not a single native screen.
- **No push-notification UI.** Climax cards are ad treatments. Closest product surfaces: landlord dashboard “Paid applications ready for review” and `/application-status/[id]` status `Approved` (“Your application has been approved.”).
- **No in-app “you got a tenant” string.** Wording is polished ad copy for the landlord queue event.
- Generated notification photos include a decorative leaf glyph; official brand in-product is the **VERDANSC** wordmark, which is what the overlays and end card use.

## Rebuild

```bash
# App must be running for fresh UI captures
npm run dev
# optional recapture (requires playwright-core)
node marketing/ads/capture-ui.mjs
python3 marketing/ads/compose_ads.py
bash marketing/ads/export-video.sh
```

Fictional names only: tenant **Maya Chen**, landlord **Jordan Hale**, property **Harborline Flats 2B**, 1842 Willow Ave, Portland, OR.
