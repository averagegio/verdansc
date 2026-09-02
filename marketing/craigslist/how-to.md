# How to post Verdansc Craigslist housing ads (human operator)

Do **not** auto-post or spam Craigslist from this repo. A person copies the text, attaches photos, and submits the form.

Site: [https://albuquerque.craigslist.org](https://albuquerque.craigslist.org)  
Primary category: **housing → housing wanted**

---

## Goal

Get a **sale on Verdansc**: a qualified applicant pays for screening, then pays to apply.

Link order in every post (required):

1. Credit check — https://verdansc.com/credit-check ($19)
2. Rental application — https://verdansc.com/listings (or a specific `/apply/{listingId}` URL)

Never put the application link above the credit check.

---

## 1. Pick photos

From `marketing/craigslist/images/`. All 12 files are **generated**. They illustrate apartments, lofts, and flats in greater Albuquerque and Rio Rancho. They are not a real address.

**Housing wanted (default):** attach the 6-photo set in `images/manifest.md`. First file = thumbnail.

**Housing offered:** do not use these generated files as if they are your unit. Only attach photos of a unit you control. Generated images in this folder are bait if you claim a vacancy.

Craigslist typically allows up to 24 images. Six is enough. Do not mix in Zillow, Apartments.com, or other listing-site screenshots.

---

## 2. Fill the Craigslist form

See `form-checklist.md` for field-by-field values.

Short version:

- City: Albuquerque
- Category: housing wanted (primary)
- Title: copy from `ad-copy.md`
- Description: paste Post A, B, or C
- Area: Downtown / Nob Hill / Rio Rancho as text — no fake street number
- Email: your operator alias; prefer CL’s anonymized relay
- Phone: optional; do not put a “leasing office” number unless it is real
- Map pin: skip unless you have a real unit (housing offered only)

---

## 3. Conversion path after they click

1. Applicant opens https://verdansc.com/credit-check, consents, pays $19 (Stripe Checkout when keys are configured).
2. They open https://verdansc.com/listings, pick a listing, and submit `/apply/{listingId}` (application fee set by the landlord; intake form defaults to $35).
3. If there are no listings yet, a landlord must log in and create an intake link at https://verdansc.com/rental-application (landlord role). That page is **not** the renter application.

Honest product split:

- Renters buy credit check + apply on a listing.
- Landlords buy intake setup / membership and receive applicants.

---

## 4. Compliance (read before posting)

- **No bait photos of units you don’t control.** Housing wanted copy must say the images are generated style samples.
- **No fabricated street addresses.** Use area names only: Rio Rancho, Nob Hill, Downtown ABQ, greater Albuquerque.
- **Do not scrape or reuse** listing photos from Zillow, Craigslist, Apartments.com, or other sites.
- **Do not duplicate-spam** the same post across housing wanted, apts/housing, rooms, and services. One category per intent.
- Housing wanted that is actually a screening-service ad can be flagged. Keep the seeker intent honest, or use housing offered with a real unit.
- No “first month free if you apply today” lies. State the $19 credit check and that application fees are set per listing.
- No off-platform document collection (email PDFs, Google Forms) in the post. Point to Verdansc.
- Do not post live from automation. This folder is assets + copy for a human.

---

## 5. After the post is up

- Replies that skip step 1: send only the credit-check URL.
- Replies that finished credit check: send https://verdansc.com/listings or the specific apply URL.
- If conversion is weak, switch to a **housing offered** post with a real unit and a real `/apply/{id}` link. That category usually converts better for landlords.
