# Craigslist ad copy (Albuquerque / Rio Rancho)

Primary category: **housing wanted** on [albuquerque.craigslist.org](https://albuquerque.craigslist.org).

These posts send room-seekers into Verdansc in this order:

1. **Credit check** (paid screening, $19): https://verdansc.com/credit-check
2. **Rental application** (browse live apply links, then pay the listing fee): https://verdansc.com/listings

Do not reverse that order. Screening first, then the application.

Photos in `images/` are **generated style samples**. Every housing-wanted post must say the pictures show the *type* of apartment / loft / flat sought — not a unit you manage.

---

## Product URLs (live Verdansc routes)

| Step | Who | Route | What it sells |
| --- | --- | --- | --- |
| 1. Credit check | renter | https://verdansc.com/credit-check | $19 one-time soft credit check |
| 2. Rental listings / apply | renter | https://verdansc.com/listings then `/apply/{listingId}` | landlord-set application fee (intake default $35) |
| Landlord intake (creates apply links) | landlord | https://verdansc.com/rental-application | intake link + listing on `/listings` |
| Pricing / membership | both | https://verdansc.com/pricing | Rental Ready Club $15/mo, landlord plans |
| Signup | renter | https://verdansc.com/signup?role=renter&plan=renter-ready | account before repeat applies |

`/rental-application` is **landlord intake setup**, not the renter form. Renters apply at `/listings` → `/apply/{listingId}`. Use the listings URL in housing-wanted posts. Use `/rental-application` only in the optional housing-offered variant.

---

## Post A — housing wanted (primary, service-honest)

**Suggested title** (keep under ~70 characters):

`ABQ / Rio Rancho apt, loft, or flat — credit-ready applicants`

**Neighborhood / area:** Albuquerque + Rio Rancho (Downtown, Nob Hill, Rio Rancho)

**Price / budget (optional):** leave blank, or put a budget like `1200` if you are a seeker stating max rent. Do **not** put a rent as if a unit is for lease.

**Body (paste):**

Looking for an apartment, loft, or flat in greater Albuquerque or Rio Rancho (Downtown ABQ, Nob Hill, Rio Rancho).

Photos are **generated style samples** of the housing types I’m targeting. They are not a specific vacant unit or street address.

Landlords and managers: I apply only through Verdansc so screening is done before the application.

1) Credit check (paid, $19):
https://verdansc.com/credit-check

2) Rental application (after the credit check):
https://verdansc.com/listings

Serious replies only. I will not email documents off-platform. Complete the credit check first, then submit the rental application on Verdansc.

---

## Post B — housing wanted (seeker voice, shorter)

**Title:** `1–2BR apartment / loft / flat wanted — ABQ & Rio Rancho`

**Body (paste):**

Housing wanted: apartment, loft, or flat in Albuquerque or Rio Rancho.

Style I’m looking for is in the photos (generated examples of lofts, courtyard apartments, and Rio Rancho flats — not a real listing I control).

To consider me:

Step 1 — credit check:
https://verdansc.com/credit-check

Step 2 — rental application:
https://verdansc.com/listings

Please don’t ask me to wire a deposit or fill a random PDF. Verdansc is how I screen and apply.

---

## Post C — housing wanted (loft / downtown focus)

**Title:** `Downtown ABQ loft or Nob Hill flat wanted — pre-screened`

**Body (paste):**

Wanted: loft or flat near Downtown Albuquerque or Nob Hill. Rio Rancho apartments OK if the apply link is on Verdansc.

Attached photos are generated samples of loft / courtyard / high-desert apartment style. Not photos of a unit I rent or manage.

Qualified path (this order):

Credit check:
https://verdansc.com/credit-check

Then the rental application:
https://verdansc.com/listings

If you have a Verdansc apply link, send it after I finish the credit check.

---

## Optional — housing offered (usually converts better for landlords)

Housing **offered** is the better Craigslist category if you actually control a vacant unit: renters already search “apts/housing for rent,” and the apply link is a natural CTA.

**Only use this variant if you manage a real unit.** Do not attach generated samples as if they are that unit. Use your own photos of the unit you control.

**Title example:** `Rio Rancho 2BR — apply on Verdansc (credit check first)`

**Body (paste, then replace bracketed fields with real facts):**

[Neighborhood] apartment for rent. [beds/baths], available [date]. Rent $[amount].

This is a real unit we manage. Photos are of this unit.

To apply:

1) Credit check — https://verdansc.com/credit-check
2) Rental application — [paste the live apply URL from Verdansc, example https://verdansc.com/apply/lst_xxxxxxxx ]

Create that apply URL first on https://verdansc.com/rental-application (landlord account required), then paste it as step 2. Do not send people to `/rental-application` itself; that page is intake setup, not the renter form.

No holding deposits by Venmo/Zelle. Screening and the application fee run on Verdansc.

---

## Why housing offered often converts better

- Seekers browse **apts/housing for rent**, not housing wanted.
- Housing wanted is easy to flag if it reads like a service ad or uses photos of units you don’t control.
- A real apply link (`/apply/{id}`) plus a real rent and neighborhood is a cleaner sale: $19 credit check, then the listing application fee.

Keep housing wanted as the primary post only when you are honestly a seeker (or posting on behalf of seekers) and the photos are labeled as style samples.

---

## CTA order (do not change)

1. https://verdansc.com/credit-check
2. https://verdansc.com/listings  (or a specific `https://verdansc.com/apply/{listingId}` once a landlord has created one)

Sale path: qualified applicant → paid credit check → paid rental application on Verdansc.
