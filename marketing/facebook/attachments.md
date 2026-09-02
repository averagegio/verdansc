# Facebook attachment map

Attach-ready mapping for every copy file in this kit. **This environment cannot log into Facebook.** Nothing here was posted or DMed.

Canonical still (feed + DMs): `marketing/ads/exports/verdansc-split-ad-4x5.jpg` (1080×1350, smaller upload). PNG twin: `marketing/ads/exports/verdansc-split-ad-4x5.png`.

Optional reel (groups that allow video only): `marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4` (1080×1920, ~30s, silent AAC). **Never attach the MP4 in Messenger.**

Ad overlay on the still includes “Photograph. Upload. Get a tenant.” That line is **lifestyle / narrative**, not a live product claim. Intake is title, address, fee, and requirements. Do not caption the still as listing-photo upload. Video alert cards are **ad treatments**, not push notifications.

Slot IDs **S01–S35** are owned by `marketing/schedule/week-2026-09-03.md` on `origin/cursor/outreach-schedule-6306`. Facebook rows and exact files: `scheduled-slots.md`.

## Alt text (use on every still)

**Composer (short):** VERDANSC split graphic: a renter searching listings on a phone, a landlord photographing a house, and a fictional Harborline Flats 2B card. verdansc.com/listings.

**If the field allows a longer description:** VERDANSC 4:5 split still. Wordmark VERDANSC, line “Find a home. Fill a home.” Left TENANT: woman at a table looking at a phone. Right LANDLORD: man photographing a two-story house, with a phone mockup of Renter Discovery showing fictional Harborline Flats 2B, 1842 Willow Ave, Portland, OR (demo, not ABQ inventory). Footer: “Search. Credit check. Apply.” and “Photograph. Upload. Get a tenant.” (lifestyle overlay — intake does not take listing photos). Button verdansc.com/listings. Landlords: verdansc.com/rental-application. Names Maya Chen and Jordan Hale are fictional.

Do not write alt text that says “upload listing photos,” “MLS photos,” “push notification,” or “you got a tenant” as if those are in-app features.

## First comment (every group post)

Paste immediately after publish (from `replies-and-dms.md`), including the graphic honesty line. If the group forbids comment links, drop URLs and say “links are in the post.”

If you attached the 9:16 video, add the video honesty line from the same file.

## Map

| Copy file | Schedule slots | Attach | Optional video | Alt text | First comment / caption |
| --- | --- | --- | --- | --- | --- |
| `real-estate-short.md` | **S06**, **S26** | **4×5 still:** `marketing/ads/exports/verdansc-split-ad-4x5.jpg` (or `.png`) | **S06 / S26:** `marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4` only if that group allows video; otherwise still only | Short alt above | S06: `first-comment-hashtags-alt.md`. S26: `replies-and-dms.md` |
| `real-estate-long.md` | **S12**, **S21** | Same 4×5 still | Still only (schedule does not assign video) | Short alt above | S13 / S23 (`replies-and-dms.md`) |
| `small-business-short.md` | **S01**, **S31** | Same 4×5 still | Still only | Short alt above | S01: `replies-and-dms.md`. S33 for S31 |
| `small-business-long.md` | **S16** | Same 4×5 still | 9:16 MP4 only if the Rio Rancho group allows video (**not** 16:9) | Short alt above | S18 (`first-comment-hashtags-alt.md`, optional `#RioRancho`) |
| `replies-and-dms.md` → first comment | **S13**, **S23**, **S33** (and same-sitting comments on S01/S26) | Do not attach a second image | Never | n/a | The comment body itself (includes graphic honesty line) |
| `replies-and-dms.md` → FAQ / reply window | **S15**, **S19**, **S35** | No new creative | Never | n/a | Reply snippets in that file |
| `replies-and-dms.md` → DM follow-up | **S03**, **S08**, **S14**, **S20**, **S25**, **S28**, **S34** (inbound only; skip if empty) | **4×5 JPG still only** (not the calendar’s 1×1; not vendored here) | **Never** send the MP4 | Messenger rarely shows alt; if a field exists, use the short alt | DM still caption in `replies-and-dms.md` |
| `first-comment-hashtags-alt.md` | **S06** first comment; **S18** | Same 4×5 still as the parent post | Same as parent post | Short + long alts (copied there too) | Shorter first-comment variant in that file |
| `utm-links.md` | Links only | None | None | n/a | n/a |
| `scheduled-slots.md` | S01–S35 Facebook subset | None | None | n/a | n/a |

## Attach this image before posting (composer order)

1. Log in as the Facebook **user or Page** that is already a **member** of the target group. This Cloud Agent cannot sign in.
2. Open that group’s composer. Do **not** blast every group in the same hour.
3. **Add photo first:** `verdansc-split-ad-4x5.jpg` (preferred) or `.png`.
4. Paste the post body from the matching copy file.
5. Paste short alt text.
6. Publish, then paste the first comment.
7. Attach the 9:16 MP4 **instead of or in addition to** the still only when the group rules allow video. If unsure, still only.
8. For DMs: attach the JPG + short DM caption. Do not send video.

## Honesty vs the creative

| What the ad shows | What you may say | What you must not say |
| --- | --- | --- |
| Landlord photographing a house; overlay “Photograph. Upload.” | Lifestyle photo; landlords create an intake link (title, address, fee, requirements) | “Upload listing photos to go live,” “MLS photo intake,” “photo gallery listings” |
| Phone UI: Harborline Flats 2B, Portland, OR | Fictional demo listing used in the graphic | That this is an Albuquerque unit, or that we have a full local catalog |
| Video alert cards (“You got a tenant”, “Application accepted”) | Ad treatments. Closest product: dashboard paid-application queue; application status Approved | “Push notifications,” “we’ll ping your phone,” “in-app you got a tenant” |

Source ads: `origin/cursor/marketing-ads-6306` (GitHub PR #5). Source copy: `origin/cursor/facebook-invite-6306` (GitHub PR #3).
