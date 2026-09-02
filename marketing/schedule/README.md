# Verdansc outreach schedule (source of truth)

This folder is a **calendar only**. It does not send email, post to Facebook, or post to Craigslist. Sibling Facebook, Craigslist, and property-manager agents must read this schedule before acting.

**Week covered:** Thursday 2026-09-03 through Wednesday 2026-09-09  
**Morning window:** 7:00am–10:00am America/Denver — Facebook / Craigslist / PM email (5 slots, ~40 min stagger)  
**Investor window:** 10:00am–10:50am America/Denver — weekday investor notes only (6 slots, 10 min stagger; cap 5–8/day)  
**Slots:** 35 morning + 30 `investor_email` = 65, all `status = queued`

Copy, groups, and ads live on sibling branches until those PRs merge. Do not copy those trees into this folder.

| Channel | Source branch / PR | Path |
| --- | --- | --- |
| Property-manager email | `origin/cursor/pm-outreach-6306` / [PR #2](https://github.com/averagegio/verdansc/pull/2) | `marketing/outreach/` |
| Facebook group posts + DMs | `origin/cursor/facebook-invite-6306` / [PR #3](https://github.com/averagegio/verdansc/pull/3) | `marketing/facebook/` |
| Craigslist housing-wanted | `origin/cursor/craigslist-housing-ads-6306` / [PR #4](https://github.com/averagegio/verdansc/pull/4) | `marketing/craigslist/` |
| Still + video ads | `origin/cursor/marketing-ads-6306` / [PR #5](https://github.com/averagegio/verdansc/pull/5) | `marketing/ads/exports/` |
| Investor email | this branch | `marketing/investors/` |

Machine-readable queue: [`queue.csv`](queue.csv) (adds `facebook_group`, `from_address`, `mail_system`, `craigslist_account`). Investor-only copy of the 10:00 window: [`investor-queue.csv`](investor-queue.csv). Human calendar: [`week-2026-09-03.md`](week-2026-09-03.md). Sign-in blockers: [`login-needed.md`](login-needed.md). User checks: [`roadblocks.md`](roadblocks.md). Email rules: [`email-gate.md`](email-gate.md).

## Wait for the user on roadblocks before sending

**Do not send, post, or DM until the user answers [`roadblocks.md`](roadblocks.md)** and a human completes [`login-needed.md`](login-needed.md). This VM has no Facebook, Zoho, or Craigslist session.

Confirmed identities:

1. Facebook user/Page + the **exact** local SB groups in `week-2026-09-03.md` (not Anime Memes, Film Casting, or BLACK GIRLS)
2. Email From **`founder@verdansc.com`** via **Zoho Mail** (later-send hint: `smtp.zoho.com`). **Not** Gmail SMTP. **Not** `founder@peaksees.com`
3. Craigslist **`mrigwe234@gmail.com`** on `albuquerque.craigslist.org` (do not click the magic login link from this VM)
4. A real `[PHYSICAL_MAILING_ADDRESS]` and a working `[UNSUB_URL]` in every commercial email

Until those four are true **and** roadblocks are answered, morning Facebook / Craigslist / PM-email slots stay **queued**. Agents may prepare paste buffers. They may not click Send / Post.

See [`email-gate.md`](email-gate.md): **scraped / harvested PM cold email stays blocked**. Investor email is a **separate** user-provided-list campaign (templates in `marketing/investors/`). A human may paste those notes into Zoho themselves — still **no auto-send from this VM**, and slots stay `queued` until the human actually sends. Do not mark `investor_email` `blocked` the same way as PM cold email.

## How to execute (human operator)

1. Open `week-2026-09-03.md` for the current Mountain date.
2. Confirm `roadblocks.md` is answered and `login-needed.md` is fully checked.
3. At each slot time, pull the listed `copy_path` from the sibling branch/PR (or from `main` after merge).
4. Attach only the listed `ad_path`. Do not invent extra creatives.
5. Personalize tokens (`[PM_NAME]`, `[COMPANY]`, `[ONE_LOCAL_DETAIL]` for PM email; `[FIRST_NAME]`, `[FIRM]`, `[THESIS]` for investor email), then send/post once.
6. Mark the row `sent` or `skipped` in `queue.csv` (and `investor-queue.csv` for I-slots). Never silently retry a skipped slot the same morning.

Work **in succession**: finish or skip slot *n* before starting slot *n+1*. Do not queue five tabs and fire them together. Investor notes are one To: address at a time in the 10:00 window — not a merge blast.

## Daily mix (anti-spam)

Each day uses **different channels in the 7–10am window**, not five of the same thing.

| Channel | Cap | Why |
| --- | --- | --- |
| Craigslist housing-wanted | **1 per day** | Category spam / duplicate-post flags |
| Facebook group post | **1 per day**, **new group each day** | Cross-posting identical text looks like spam |
| Facebook DM | **0–1 per day**, inbound-only | Kit forbids cold DMs |
| Facebook first comment / reply window | Used to fill the 5-slot day without a second group post | Not a duplicate post |
| PM email | **1–2 per day**, different companies | First-wave, not the whole list. Still gated (see `email-gate.md`) |
| Investor email | **6 per weekday** in **10:00–10:50am MT** (cap 5–8) | User-provided VC/angel list. Human Zoho paste. Not a blast |

Email sequence steps rotate **intro → value**. Soft-bump (email 3) is day 12–14, which falls **after** this week — do not send a fourth “just bumping” note.

## Investor email (separate campaign)

- **From:** `founder@verdansc.com` via Zoho. Copy: `marketing/investors/templates/` (angel / seed / proptech / generalist).
- **When:** weekdays only, 10:00 / 10:10 / 10:20 / 10:30 / 10:40 / 10:50 America/Denver. Saturday and Sunday have none.
- **How:** paste one draft at a time. Attach `marketing/ads/exports/verdansc-split-ad-4x5.jpg`. Optional 30s 16×9. Deck: https://www.verdansc.com/pitch
- **Contacts:** local gitignored `marketing/investors/contacts.extracted.json`. Do not commit the compiled list. Do not put raw emails in this calendar.
- **Not blocked like PM cold email.** This is not a Zillow / Facebook / Redfin scrape. Still do **not** auto-send.
- **Tracker PWA:** `outreach-tracker/slots.js` on `cursor/outreach-phone-tracker-6306` still covers the 7:00–9:40 morning slots only. It may need a follow-up sync to pick up I01–I30. Use [`investor-queue.csv`](investor-queue.csv) for that sync — do not fight the tracker tree on this branch.

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
- Link order is required: sign up / subscribe first, then credit check ($19), then listings. Never reverse. See `email-gate.md` — Craigslist is not email.
- Do not use housing-offered unless you control a real unit (out of scope for this week).

## Ads to attach

Ready files (PR #5):

| File | Use on this calendar |
| --- | --- |
| `marketing/ads/exports/verdansc-split-ad-4x5.png` | Facebook group feed still |
| `marketing/ads/exports/verdansc-split-ad-4x5.jpg` | Facebook DM still (preferred; 1×1 is not required) **and** investor email still |
| `marketing/ads/exports/verdansc-split-ad-16x9.jpg` | PM email still (JPG, smaller than PNG) |
| `marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4` | Facebook group video when the group allows video |
| `marketing/ads/exports/verdansc-split-ad-30s-16x9.mp4` | Alternate landscape video (groups that prefer 16:9); **optional** investor attach |

Do not attach the 30s MP4 to first-wave **PM** email (size + spam filters). Investor notes may attach the 16×9 30s clip if the mailbox allows it. Optional on PM mail: paste `marketing/outreach/one-pager-plain.txt` under the email still.

## Slot counts (this week)

| Channel | Slots |
| --- | --- |
| `email` (PM) | 7 |
| `investor_email` | 30 |
| `facebook_group` | 7 |
| `facebook_dm` | 7 |
| `facebook_first_comment` | 4 |
| `facebook_reply_window` | 3 |
| `craigslist` | 7 |
| **Total** | **65** |

## What agents must not do

- Do not mail-merge the whole PM prospect table **or** the compiled VC list.
- Do not scrape listing sites or harvest personal inboxes (no Zillow / Facebook / Redfin scrape).
- Do not cold-DM Facebook members.
- Do not auto-post Craigslist.
- Do not auto-send investor email. Human paste into Zoho only.
- Do not commit `marketing/investors/contacts.extracted.json`.
- Do not claim inventory, PMS replacement, hard credit pulls, listing-photo galleries, or a live “Raising $1.8M”.
- Do not mark a slot `sent` unless a human actually posted or mailed it.
- Do not send until the user answers [`roadblocks.md`](roadblocks.md).
