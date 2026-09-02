# How to post Verdansc Craigslist housing ads (human operator)

Do **not** auto-post or spam Craigslist from this repo.  
A person copies the text, attaches photos, and submits the form.  
This polish pass did **not** post.

Site: [https://albuquerque.craigslist.org](https://albuquerque.craigslist.org)  
Account: **`mrigwe234@gmail.com`** (personal Gmail). Do **not** post as `founder@verdansc.com` or `founder@peaksees.com`.  
Do **not** click a Craigslist magic login-link email from a Cloud Agent VM — the human operator uses that link on their own device if needed.  
Primary category: **housing → housing wanted**  
Wait for `marketing/schedule/roadblocks.md` before posting.

---

## Schedule

| | |
| --- | --- |
| Slots | **1 Craigslist post per day** — S02, S07, S11, S17, S22, S27, S32 |
| Clock | **7:00–10:00 a.m. America/Denver** |
| Exact time | **7:40 a.m. MT** except Saturday **S11 at 7:00 a.m. MT** |
| First day | **2026-09-03** (S02 → `variants/day-01.md`) |
| Which copy | `variants/day-01.md` … `day-07.md` (legacy Post A/B/C = Days 1/2/3) |

Do not post a second housing-wanted variant the same day.  
Do not also dump the same body into apts/housing, rooms, or services.  
Do not attach Verdansc split-ads (`marketing/ads/exports/`).  
If the site throttles you, wait until the next day’s window.

---

## Goal

Get a **sale on Verdansc**: a subscriber / account, then a paid credit check, then a paid rental application.

Link order in every post (required):

1. Sign up / subscribe — https://www.verdansc.com/signup
2. Credit check — https://www.verdansc.com/credit-check ($19)
3. Rental application — https://www.verdansc.com/listings (or a specific `/apply/{listingId}` URL)

Never put the application link above signup or the credit check.

---

## 1. Pick photos

From `marketing/craigslist/images/`. All 12 files are **generated**.  
They illustrate apartments, lofts, and flats in greater Albuquerque and Rio Rancho.  
They are not a real address.

**Housing wanted (default):** attach the 6 files listed in that day’s `variants/day-0N.md`.  
First file = search thumbnail.

**Housing offered:** do not use these generated files as if they are your unit.  
Only attach photos of a unit you control.

Craigslist typically allows up to 24 images. Six is enough.  
Do not mix in Zillow, Apartments.com, or other listing-site screenshots.

---

## 2. Fill the Craigslist form

See `form-checklist.md` for field-by-field values.

Short version:

- City: Albuquerque
- Category: housing wanted (primary)
- Title + body: copy from today’s `variants/` file (or the matching block in `ad-copy.md`)
- Area: Downtown / Nob Hill / Rio Rancho as text — no fake street number
- Email: your operator alias; prefer Craigslist’s anonymized relay
- Phone: optional; do not put a “leasing office” number unless it is real
- Map pin: skip unless you have a real unit (housing offered only)

---

## 3. Conversion path after they click

1. Applicant opens https://www.verdansc.com/signup and creates an account (choose a renter plan on that page).
2. They open https://www.verdansc.com/credit-check, consent, and pay $19 (Stripe Checkout when keys are configured).
3. They open https://www.verdansc.com/listings, pick a listing, and submit `/apply/{listingId}` (application fee set by the landlord; intake form defaults to $35).
4. If there are no listings yet, a landlord must log in and create an intake link at https://www.verdansc.com/rental-application (landlord role).

Honest product split:

- Renters buy credit check + apply on a listing.
- Landlords buy intake setup / membership and receive applicants.

Verdansc intake fields are title, address, fee, and requirements.  
**There is no listing photo upload on** https://www.verdansc.com/rental-application.  
Photos stay on Craigslist (housing wanted) or on the landlord’s own files (housing offered).

---

## 4. Compliance (read before posting)

- **No bait photos of units you do not control.** Housing wanted copy must say the images are generated style samples.
- **No fabricated street addresses.** Use area names only: Rio Rancho, Nob Hill, Downtown ABQ, greater Albuquerque.
- **Do not scrape or reuse** listing photos from Zillow, Craigslist, Apartments.com, or other sites.
- **Do not duplicate-spam** the same post across housing wanted, apts/housing, rooms, and services. One category per intent.
- Housing wanted that is actually a screening-service ad can be flagged. Keep the seeker intent honest, or use housing offered with a real unit.
- No “first month free if you apply today” lies. State the $19 credit check and that application fees are set per listing.
- No off-platform document collection (email PDFs, Google Forms) in the post. Point to Verdansc.
- Do not post live from automation. This folder is assets + copy for a human.
- Rotate the seven variants. Identical daily spam gets flagged.

---

## 5. After the post is up

- Replies that skip step 1: send only https://www.verdansc.com/signup (or https://www.verdansc.com/ ).
- Replies that have an account: send the credit-check URL.
- Replies that finished credit check: send https://www.verdansc.com/listings or the specific apply URL.
- If conversion is weak and you control a real vacancy, switch **a later day’s slot** to a housing-offered post with a real unit and a real `/apply/{id}` link. Still one Craigslist slot that day.
