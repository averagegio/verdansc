# Form checklist — Craigslist upload + Verdansc intake

Prepare files locally, then a human pastes into each form. Nothing in this repo posts to Craigslist.

Schedule: **1 housing-wanted post per day** (slots S02, S07, S11, S17, S22, S27, S32), **7:00–10:00 a.m. MT**, starting **2026-09-03**.  
Exact time is **7:40 a.m. MT** except Saturday **S11 at 7:00 a.m. MT**.  
Use today’s file in `variants/`.

---

## A. Craigslist — housing wanted (primary)

Albuquerque site: https://albuquerque.craigslist.org  
Flow: `post` → `housing wanted` → continue

| Field | What to enter | Notes |
| --- | --- | --- |
| City / site | Albuquerque | Greater ABQ + Rio Rancho uses this site |
| Category | housing wanted | Do not also post the same body in apts/housing unless you have a real unit (see section B) |
| Posting title | Today’s title from `variants/day-0N.md` | Also listed in `ad-copy.md`. Stay under ~70 characters |
| Price | *(blank)* or seeker budget only | Blank is safest. A dollar amount here reads like housing offered |
| Availability / date | *(blank)* | Housing wanted has no move-in for a unit you control |
| Postal code | `87102` (Downtown), `87108` (Nob Hill), or `87124` (Rio Rancho) | Area hint only — not a claim you manage that ZIP. Match the day’s variant |
| Neighborhood | Downtown / Nob Hill / Rio Rancho | Type the area name; do not invent a street |
| Description / body | Paste today’s **Body** from `variants/` | Signup URL, then credit-check URL, then listings/apply URL |
| Photos | Upload in the order listed in today’s variant | First image = search thumbnail. All are generated samples |
| Contact email | Account is **`mrigwe234@gmail.com`** | Use Craigslist’s anonymized email relay on the public post |
| Phone / text | Optional | Skip unless it is a real person who will answer |
| Show on map | Off | No fake pin. Map only for a real unit in housing offered |
| Other CL housing details (laundry, parking, sqft, beds) | Leave unset | Those fields imply you are offering a unit |

Preview check before publish:

- [ ] Body says photos are generated style samples
- [ ] No specific street address presented as a vacancy
- [ ] First link is https://www.verdansc.com/signup (or https://www.verdansc.com/ )
- [ ] Second link is https://www.verdansc.com/credit-check
- [ ] Third link is https://www.verdansc.com/listings (or a real `/apply/{id}`)
- [ ] Not cross-posted to extra categories
- [ ] This is the only Craigslist slot today (S02 / S07 / S11 / S17 / S22 / S27 / S32)
- [ ] Posted at the slot time (7:40 a.m. MT, or 7:00 a.m. MT for S11)
- [ ] No Verdansc split-ad attached

---

## B. Craigslist — housing offered (optional, better landlord conversion)

Only if you control a vacant unit. Category: **apts / housing for rent**.  
This replaces the daily housing-wanted slot that day — still **one** post.

| Field | What to enter |
| --- | --- |
| Title | Real beds + area, then apply CTA. Example: `Rio Rancho 2BR — apply on Verdansc` |
| Price | Actual monthly rent |
| Sqft / beds / baths | Actual figures |
| Availability | Actual date |
| Neighborhood | Real area |
| Body | Housing-offered variant in `ad-copy.md`, with the live apply URL |
| Photos | **Your** unit photos only — not `images/` generated samples |
| Map | Real building pin if you are allowed to disclose it |

Step 3 in the body must be the renter apply URL (`https://www.verdansc.com/apply/{listingId}`), not https://www.verdansc.com/rental-application.

---

## C. Verdansc landlord intake (creates the rental-app link)

Page: https://www.verdansc.com/rental-application  
Auth: landlord account (https://www.verdansc.com/signup?role=landlord&plan=landlord-growth or https://www.verdansc.com/login?role=landlord)

This form has **no photo upload**. Photos stay on Craigslist (or your own files). Map the creative to text fields only:

| Intake field | Map from this pack |
| --- | --- |
| Property title | Area + type, clearly sample if not a real unit. Example: `Sample — Nob Hill courtyard apartment (demo)` |
| Property address | Area-level only unless you have a real listing. Example: `Nob Hill, Albuquerque, NM` or `Rio Rancho, NM` — never a fake street number |
| Application fee (USD) | Default in the UI is `35`. Change to your real fee |
| Requirements | `Sign up first: https://www.verdansc.com/signup. Then credit check: https://www.verdansc.com/credit-check. Then apply on this listing. Photos on Craigslist are generated style samples unless this is a real unit.` |

There is no image, gallery, or listing-photo field on this page.

On success, copy `applyUrl` (`https://www.verdansc.com/apply/{listingId}`). That URL is what renters use for the **rental application**. The listing also appears on https://www.verdansc.com/listings.

Do not send housing-wanted traffic to `/rental-application` itself; they will hit a landlord-only form.

---

## D. Verdansc renter application (the sale after signup + credit check)

Page: https://www.verdansc.com/apply/{listingId} (from listings or the copied apply URL)

| Field | Applicant fills |
| --- | --- |
| Name | required |
| Email | required |
| Phone | required |
| Move-in date | optional |
| Monthly income | optional |
| Occupants | optional |
| Notes | optional |
| Pay application fee | Stripe Checkout after draft save |

Operator script when someone replies on Craigslist:

1. “Create an account: https://www.verdansc.com/signup”
2. After they have an account: “Credit check ($19): https://www.verdansc.com/credit-check”
3. After they confirm payment: “Apply here: https://www.verdansc.com/listings” (or the specific apply URL)
