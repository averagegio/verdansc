# UTM-ready links (real Verdansc paths)

Base origin: **https://verdansc.com** (`metadataBase` in the app).

Query pattern:

`utm_source=facebook`  
`utm_medium=group` (use `dm` only in Messenger follow-ups)  
`utm_campaign=abq_re_invite` | `abq_sb_invite` | `abq_invite`  
`utm_content=short` | `long` | `first_comment` | `reply` | `followup`

Signup already uses `role` and `plan` query params. Append UTM after those with `&`.

## Core CTAs

| Intent | Path | Example URL |
| --- | --- | --- |
| Map / home | `/` | https://verdansc.com/?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Credit check ($19 soft inquiry) | `/credit-check` | https://verdansc.com/credit-check?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Browse rental listings | `/listings` | https://verdansc.com/listings?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Apply to a specific listing | `/apply/[listingId]` | Only share a real listing id from intake setup. Do not invent ids. |
| Landlord applicant intake | `/rental-application` | https://verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Pricing | `/pricing` | https://verdansc.com/pricing?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Renter signup | `/signup?role=renter` | https://verdansc.com/signup?role=renter&utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Renter signup + Club plan | `/signup?role=renter&plan=renter-ready` | https://verdansc.com/signup?role=renter&plan=renter-ready&utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Landlord signup + Growth plan | `/signup?role=landlord&plan=landlord-growth` | https://verdansc.com/signup?role=landlord&plan=landlord-growth&utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Login | `/login` | https://verdansc.com/login?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=short |
| Move-in planner (renters) | `/move-in-planner` | https://verdansc.com/move-in-planner?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=long |
| Move-out tracker (landlords) | `/move-out-tracker` | https://verdansc.com/move-out-tracker?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=long |

## Request-only (mention carefully)

These pages exist but the form is a **request**, not live self-serve checkout:

- https://verdansc.com/3d-home-tour
- https://verdansc.com/draft-agreements
- https://verdansc.com/hold-in-escrow
- https://verdansc.com/broker-services

Default posts in this kit **omit** them. If someone asks, you can send the URL and say you’ll follow up.

## Campaign split

- Real estate group posts: `utm_campaign=abq_re_invite`
- Small-business group posts: `utm_campaign=abq_sb_invite`
- Shared first-comment / replies: `utm_campaign=abq_invite`
- DMs: `utm_medium=dm`

## Do not use

- Placeholder domains (`example.com`, `verdansc.local`)
- Invented listing apply URLs
- Shorteners that hide the destination in groups that ban them
