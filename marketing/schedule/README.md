# Verdansc outreach schedule (source of truth)

This folder is a **calendar only**. It does not send email, post to Facebook, post to Craigslist, or publish to LinkedIn. Sibling Facebook, Craigslist, LinkedIn, and property-manager agents must read this schedule before acting.

**Week covered:** Thursday 2026-09-03 through Wednesday 2026-09-09  
**Window:** 7:00am–10:00am America/Denver (Mountain; MDT / UTC−6 on these dates)  
**Cadence:** 5 queued touches on Sat/Sun; **6** on weekdays (LinkedIn at 8:00am MT). Stagger — not a burst.  
**Slots:** 40, all `status = queued` (35 prior + 5 weekday LinkedIn). The phone tracker also queues `S-LI-01` on Wed Sep 2.

Copy, groups, and ads live on sibling branches until those PRs merge. Do not copy those trees into this folder.

| Channel | Source branch / PR | Path |
| --- | --- | --- |
| Property-manager email | `origin/cursor/pm-outreach-6306` / [PR #2](https://github.com/averagegio/verdansc/pull/2) | `marketing/outreach/` |
| Facebook group posts + DMs | `origin/cursor/facebook-invite-6306` / [PR #3](https://github.com/averagegio/verdansc/pull/3) | `marketing/facebook/` |
| Craigslist housing-wanted | `origin/cursor/craigslist-housing-ads-6306` / [PR #4](https://github.com/averagegio/verdansc/pull/4) | `marketing/craigslist/` |
| Still + video ads | `origin/cursor/marketing-ads-6306` / [PR #5](https://github.com/averagegio/verdansc/pull/5) | `marketing/ads/exports/` |
| LinkedIn feed + motion 16:9 | `origin/cursor/higgsfield-linkedin-ad-6306` | `marketing/linkedin/COPY.md`, `marketing/ads/exports/verdansc-motion-ad-30s-16x9.mp4` |

Machine-readable queue: [`queue.csv`](queue.csv) (adds `facebook_group`, `from_address`, `mail_system`, `craigslist_account`). Human calendar: [`week-2026-09-03.md`](week-2026-09-03.md). Sign-in blockers: [`login-needed.md`](login-needed.md). User checks: [`roadblocks.md`](roadblocks.md).

## Wait for the user on roadblocks before sending

**Do not send, post, or DM until the user answers [`roadblocks.md`](roadblocks.md)** and a human completes [`login-needed.md`](login-needed.md). This VM has no Facebook, Zoho, or Craigslist session.

Confirmed identities:

1. Facebook user/Page + the **exact** local SB groups in `week-2026-09-03.md` (not Anime Memes, Film Casting, or BLACK GIRLS)
2. Email From **`founder@verdansc.com`** via **Zoho Mail** (later-send hint: `smtp.zoho.com`). **Not** Gmail SMTP. **Not** `founder@peaksees.com`
3. Craigslist **`mrigwe234@gmail.com`** on `albuquerque.craigslist.org` (do not click the magic login link from this VM)
4. A real `[PHYSICAL_MAILING_ADDRESS]` and a working `[UNSUB_URL]` in every commercial email

Until those four are true **and** roadblocks are answered, every slot stays **queued**. Agents may prepare paste buffers. They may not click Send / Post.

## How to execute (human operator)

1. Open `week-2026-09-03.md` for the current Mountain date.
2. Confirm `roadblocks.md` is answered and `login-needed.md` is fully checked.
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
| Facebook first comment / reply window | Used to fill the day without a second group post | Not a duplicate post |
| LinkedIn feed | **1 per weekday at 8:00am MT**, none Sat/Sun | Not a morning blast of identical posts |
| PM email | **1–2 per weekday**, different companies | First-wave, not the whole list; blocked on the phone tracker |

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
- Group names are **exact titles** from the operator’s Your groups list. One unique SB group per day. If a group bans the post, skip and swap only the unused backup (**ABQ Small Business Networking, Barter & Trade** or optional **Albuquerque Wellness Professionals**). Do **not** reuse a group already used this week.
- This week’s group copy is **small-business-short / small-business-long** only. Do not paste real-estate investor copy into these rooms.
- First post (S01) is the short small-business variant + 4×5 still.

## Craigslist rules

- Account: **`mrigwe234@gmail.com`**. Site: [albuquerque.craigslist.org](https://albuquerque.craigslist.org) → **housing → housing wanted** only.
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
| `marketing/ads/exports/verdansc-split-ad-4x5.jpg` | Facebook DM still (preferred; 1×1 is not required) |
| `marketing/ads/exports/verdansc-split-ad-16x9.jpg` | Email still (JPG, smaller than PNG) |
| `marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4` | Facebook group video when the group allows video |
| `marketing/ads/exports/verdansc-split-ad-30s-16x9.mp4` | Alternate landscape video (groups that prefer 16:9) |
| `marketing/ads/exports/verdansc-motion-ad-30s-16x9.mp4` | LinkedIn feed (Ken Burns 16:9; same encode as `verdansc_higgsfield_ad_30s.mp4`) |

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
| `linkedin` | 5 |
| **Total** | **40** |

## What agents must not do

- Do not mail-merge the whole prospect table.
- Do not scrape listing sites or harvest personal inboxes.
- Do not cold-DM Facebook members.
- Do not auto-post Craigslist.
- Do not publish LinkedIn from this VM (calendar / tracker only).
- Do not claim inventory, PMS replacement, hard credit pulls, or listing-photo galleries.
- Do not mark a slot `sent` unless a human actually posted or mailed it.
- Do not send until the user answers [`roadblocks.md`](roadblocks.md).
