# Facebook scheduled slots

Slot IDs **S01–S35** are owned by the sibling schedule agent in `marketing/schedule/week-2026-09-03.md` (`origin/cursor/outreach-schedule-6306`). That calendar mixes Facebook, Craigslist, and email. This file lists **Facebook rows only** and the exact ad this kit attaches.

This environment **cannot** log into Facebook. Every slot stays queued until a human completes login (Facebook user/Page + group membership). See the schedule’s `login-needed.md`.

## Cadence (owned by the schedule)

- 5 touches/day, 7:00–10:00am America/Denver, start **2026-09-03**
- Stagger 7:00 / 7:40 / 8:20 / 9:00 / 9:40 MT — do not blast
- **One Facebook group post per day**, new group each day
- DMs inbound-only; skip if nobody messaged
- First comments and reply windows are not extra group posts

## Attachment rules this kit enforces

| Surface | Attach | Do not attach |
| --- | --- | --- |
| Group feed (`facebook_group`) | `marketing/ads/exports/verdansc-split-ad-4x5.jpg` (or `.png`) | 16:9 video, Craigslist housing photos |
| Group video (only if that group allows video/Reels) | `marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4` **in addition to or instead of** the 4×5 still | 16:9 MP4 (not vendored here; groups should get 9:16) |
| Messenger (`facebook_dm`) | **4×5 JPG still only** + short caption in `replies-and-dms.md` | MP4 (too large; alert cards look like push notifications) |
| First comment / reply window | none (image already on the post) | a second still or video |

The schedule calendar currently lists `verdansc-split-ad-1x1.png` on DM rows and `verdansc-split-ad-30s-16x9.mp4` on S16. **This attach kit does not vendor those files.** Use the 4×5 still for every DM, and 9:16 (or still) for S16. Operators should prefer `.jpg` for faster upload; `.png` is the same 1080×1350 frame.

## Facebook rows this week

| Slot | MT | Channel | Copy | Attach (this kit) | First comment |
| --- | --- | --- | --- | --- | --- |
| **S01** | 2026-09-03 07:00 | group | `small-business-short.md` | 4×5 still | `replies-and-dms.md` |
| **S03** | 2026-09-03 08:20 | DM (inbound) | `replies-and-dms.md` DM follow-up | 4×5 JPG still + DM caption | n/a |
| **S06** | 2026-09-04 07:00 | group | `real-estate-short.md` | 9:16 MP4 **if video allowed**, else 4×5 still | `first-comment-hashtags-alt.md` (optional `#Albuquerque`) |
| **S08** | 2026-09-04 08:20 | DM (inbound) | `replies-and-dms.md` DM follow-up | 4×5 JPG still + DM caption | n/a |
| **S12** | 2026-09-05 07:40 | group | `real-estate-long.md` | 4×5 still | S13 |
| **S13** | 2026-09-05 08:20 | first comment on S12 | `replies-and-dms.md` | none | this slot is the comment |
| **S14** | 2026-09-05 09:00 | DM (inbound) | `replies-and-dms.md` (renter path) | 4×5 JPG still + DM caption | n/a |
| **S15** | 2026-09-05 09:40 | reply window | `replies-and-dms.md` snippets | none | n/a |
| **S16** | 2026-09-06 07:00 | group | `small-business-long.md` | 9:16 MP4 **if video allowed**, else 4×5 still (not 16:9) | S18 |
| **S18** | 2026-09-06 08:20 | first comment on S16 | `first-comment-hashtags-alt.md` (optional `#RioRancho`) | none | this slot is the comment |
| **S19** | 2026-09-06 09:00 | reply window | `replies-and-dms.md` snippets | none | n/a |
| **S20** | 2026-09-06 09:40 | DM (inbound) | `replies-and-dms.md` (landlord path) | 4×5 JPG still + DM caption | n/a |
| **S21** | 2026-09-07 07:00 | group | `real-estate-long.md` | 4×5 still | S23 |
| **S23** | 2026-09-07 08:20 | first comment on S21 | `replies-and-dms.md` | none | this slot is the comment |
| **S25** | 2026-09-07 09:40 | DM (inbound) | `replies-and-dms.md` DM follow-up | 4×5 JPG still + DM caption | n/a |
| **S26** | 2026-09-08 07:00 | group | `real-estate-short.md` | 9:16 MP4 **if video allowed**, else 4×5 still | `replies-and-dms.md` |
| **S28** | 2026-09-08 08:20 | DM (inbound) | `replies-and-dms.md` DM follow-up | 4×5 JPG still + DM caption | n/a |
| **S31** | 2026-09-09 07:00 | group | `small-business-short.md` | 4×5 still | S33 |
| **S33** | 2026-09-09 08:20 | first comment on S31 | `replies-and-dms.md` | none | this slot is the comment |
| **S34** | 2026-09-09 09:00 | DM (inbound) | `replies-and-dms.md` DM follow-up | 4×5 JPG still + DM caption | n/a |
| **S35** | 2026-09-09 09:40 | reply window | `replies-and-dms.md` (incl. admin-remove) | none | n/a |

S02, S04, S05, S07, S09, S10, S11, S17, S22, S24, S27, S29, S30, S32 are Craigslist or email — not this kit.

## Login reminder (blocks publishing)

A human must, before any Facebook slot:

1. Log into the Facebook **user** and/or Verdansc **Page**
2. Confirm **membership** (and posting rights) in each target group
3. Read that group’s rules (promo, video, links in comments)
4. Attach the still **before** posting
5. Never cold-DM; never blast all groups in one hour

Until login exists, leave every row `queued`. Do not mark `sent` from this Cloud Agent.
