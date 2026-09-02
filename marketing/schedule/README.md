# Verdansc outreach schedule (source of truth)

This folder is a **calendar only**. It does not send email, post to Facebook, or post to Craigslist. Sibling Facebook, Craigslist, and property-manager agents must read this schedule before acting.

**Week covered:** Thursday 2026-09-03 through Wednesday 2026-09-09  
**Window:** 7:00am–10:00am America/Denver (Mountain; MDT / UTC−6 on these dates)  
**Cadence:** 5 queued touches per day, staggered ~40 minutes (not a burst)  
**Slots:** 35, all `status = queued`

Copy, groups, and ads live on sibling branches until those PRs merge. Do not copy those trees into this folder.

| Channel | Source branch / PR | Path |
| --- | --- | --- |
| Property-manager email | `origin/cursor/pm-outreach-6306` / [PR #2](https://github.com/averagegio/verdansc/pull/2) | `marketing/outreach/` |
| Facebook group posts + DMs | `origin/cursor/facebook-invite-6306` / [PR #3](https://github.com/averagegio/verdansc/pull/3) | `marketing/facebook/` |
| Craigslist housing-wanted | `origin/cursor/craigslist-housing-ads-6306` / [PR #4](https://github.com/averagegio/verdansc/pull/4) | `marketing/craigslist/` |
| Still + video ads | `origin/cursor/marketing-ads-6306` / [PR #5](https://github.com/averagegio/verdansc/pull/5) | `marketing/ads/exports/` |

Machine-readable queue: [`queue.csv`](queue.csv). Human calendar: [`week-2026-09-03.md`](week-2026-09-03.md). Sign-in blockers: [`login-needed.md`](login-needed.md).

## Do not send until the user logs in

Nothing in this week may go out until a Verdansc operator has completed [`login-needed.md`](login-needed.md). That includes:

1. Facebook (account or Page + membership in each named group)
2. Email (Gmail or Google Workspace SMTP for `@verdansc.com`, with SPF/DKIM/DMARC)
3. Craigslist (`albuquerque.craigslist.org` account)
4. A real `[PHYSICAL_MAILING_ADDRESS]` and a working `[UNSUB_URL]` in every commercial email

Until those four are true, every slot stays **queued**. Agents may prepare paste buffers. They may not click Send / Post.

## How to execute (human operator)

1. Open `week-2026-09-03.md` for the current Mountain date.
2. Confirm `login-needed.md` is fully checked.
3. At each slot time, pull the listed `copy_path` from the sibling branch/PR (or from `main` after merge).
4. Attach only the listed `ad_path`. Do not invent extra creatives.
5. Personalize tokens (`[PM_NAME]`, `[COMPANY]`, `[ONE_LOCAL_DETAIL]`) from that company’s **own website**, then send/post once.
6. Mark the row `sent` or `skipped` in `queue.csv`. Never silently retry a skipped slot the same morning.

Work **in succession**: finish or skip slot *n* before starting slot *n+1*. Do not queue five tabs and fire them together.

## Daily mix (anti-spam)

Each day uses **different channels in the 7–10am window**, not five of the same thing.

| Channel | Cap | Why |
| --- | --- | --- |
| Craigslist housing-wanted | **1 per day** | Category spam / duplicate-post flags |
| Facebook group post | **1 per day**, **new group each day** | Cross-posting identical text looks like spam |
| Facebook DM | **0–1 per day**, inbound-only | Kit forbids cold DMs |
| Facebook first comment / reply window | Used to fill the 5-slot day without a second group post | Not a duplicate post |
| PM email | **1–2 per day**, different companies | First-wave, not the whole list |

Email sequence steps rotate **intro → value**. Soft-bump (email 3) is day 12–14, which falls **after** this week — do not send a fourth “just bumping” note.

## First-wave email rules

Only these **publicly listed company inboxes** from `marketing/outreach/prospects.md` are on this calendar. No guessed `info@`. No scraped personal mail. No LinkedIn harvests.

| Company | Inbox | Lawful notes |
| --- | --- | --- |
| T&C Management | `tandcmanagement@tandcmanagement.com` | Published in site footer |
| Monarch Properties, Inc. | `mpi@monarchnm.com` | Published on homepage; add the affordable-portfolio disclaimer from the sequence |
| Country Club Lofts / Rembe Design | `marketing@rembedesign.com` | On the community site; **1:1 only**, loft/flat inventory language |
| Bryten Real Estate Partners | `contactus@livebryten.com` | Published on terms page; **one partnership note**, not the three-email merge |

Rows in `prospects.md` that still say `[COMPANY_EMAIL]` (Maddox, Del Mesa, PURE, Elevated, Barnhill, Rhino, New Earth, Roger Cox, Greystar, PacifiCap, Titan, Peterson, Asset Living, AMC) are **not** on this week. Call, use their contact form, or wait for a published office inbox.

Every email must include the CAN-SPAM footer from `marketing/outreach/email-sequence.md`: VERDANSC 2026 INC, physical mailing address, `[UNSUB_URL]`, `support@verdansc.com` subject `unsubscribe`. Honest subjects only (no “RE: your vacancy”).

`email-sequence.md` prefers Tue–Thu 9:00–11:30am Mountain. This calendar still places email slots at **9:00 or 9:40am** inside the 7–10am window. Saturday and Sunday have **no** commercial email (deliverability + the sequence’s weekday guidance). Monday’s only email is at **9:00am**, not 7:00am.

## Facebook rules

- Read each group’s rules before posting. Honor approval queues and no-promo days.
- Disclose “I’m with Verdansc.”
- One thoughtful post per group for the week. Do not paste the same body into a second group the same morning.
- First comment uses `marketing/facebook/replies-and-dms.md` (or the short variant in `first-comment-hashtags-alt.md`).
- DMs: **only if they messaged first**. If the DM slot arrives and there is no inbound thread, mark `skipped`.
- Use `https://www.verdansc.com` (apex redirects). UTMs from `marketing/facebook/utm-links.md`.
- Group names below are **search targets**. Confirm the live title, that you are a member, and that promo is allowed. If a group bans the post, skip and do **not** swap in a last-minute duplicate to another group already used this week.

## Craigslist rules

- Site: [albuquerque.craigslist.org](https://albuquerque.craigslist.org) → **housing → housing wanted** only.
- Max **one** housing-wanted post per day. Do not also post the same text to apts/housing, rooms, or services.
- Rotate Post A / B / C from `marketing/craigslist/ad-copy.md` and rotate neighborhood emphasis (Downtown, Nob Hill, Rio Rancho, metro).
- Photos are **generated style samples** from `marketing/craigslist/images/`. The post body must say so. Do not attach Verdansc split-ad stills/videos to Craigslist — those read as a service ad and raise flag risk.
- Link order is required: credit check first, then listings. Never reverse.
- Do not use housing-offered unless you control a real unit (out of scope for this week).

## Ads to attach

Ready files (PR #5):

| File | Use on this calendar |
| --- | --- |
| `marketing/ads/exports/verdansc-split-ad-4x5.png` | Facebook group feed still |
| `marketing/ads/exports/verdansc-split-ad-1x1.png` | Facebook DM still (only if they asked, or as a light follow-up image) |
| `marketing/ads/exports/verdansc-split-ad-16x9.jpg` | Email still (JPG, smaller than PNG) |
| `marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4` | Facebook group video when the group allows video |
| `marketing/ads/exports/verdansc-split-ad-30s-16x9.mp4` | Alternate landscape video (groups that prefer 16:9) |

Do not attach the 30s MP4 to first-wave email (size + spam filters). Optional: paste `marketing/outreach/one-pager-plain.txt` under the email still.

## Slot counts (this week)

| Channel | Slots |
| --- | --- |
| `email` | 7 |
| `facebook_group` | 7 |
| `facebook_dm` | 7 |
| `facebook_first_comment` | 4 |
| `facebook_reply_window` | 3 |
| `craigslist` | 7 |
| **Total** | **35** |

## What agents must not do

- Do not mail-merge the whole prospect table.
- Do not scrape listing sites or harvest personal inboxes.
- Do not cold-DM Facebook members.
- Do not auto-post Craigslist.
- Do not claim inventory, PMS replacement, hard credit pulls, or listing-photo galleries.
- Do not mark a slot `sent` unless a human actually posted or mailed it.
