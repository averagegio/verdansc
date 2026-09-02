# Email gate — two campaigns, no send from this VM

This calendar **does not send email.** This file is the stop sign for blasts and scrapes.

## Blocked (scraped / harvested PM cold email)

- Property-manager cold / commercial blasts from `founder@verdansc.com`
- Scraping Facebook groups, Zillow, or Redfin for emails
- Harvesting a “found emails” list
- Sending PM sequence mail without a US postal address **and** a working unsubscribe page (CAN-SPAM)

There is no physical mailing address on file (no PO box, no registered-agent street). There is no working unsub URL. Until both exist, every **`email`** (PM) slot stays **queued / skipped**.

Reply templates for people who **already wrote in** live in `marketing/outreach/opt-in-reply.md`. Those are paste-ready replies only. This repo still does not send them.

## Not blocked the same way: investor email (user-provided list)

Investor notes are a **separate campaign**. The operator attached a VC/angel list. Copy lives in `marketing/investors/`. Slots are `investor_email` in [`investor-queue.csv`](investor-queue.csv) / [`queue.csv`](queue.csv).

- **Do** let a human paste 1:1 notes into Zoho as `founder@verdansc.com` (staggered, 6/weekday in 10:00–10:50am MT).
- **Do not** auto-send, mail-merge a blast, or run SMTP from this VM.
- **Do not** mark `investor_email` slots `blocked` the way PM cold email is gated.
- **Do not** put the compiled contact file in git.
- Status stays **`queued`** until the human actually sends.

Prefer a postal address on volume mail when you have one. These are short founder 1:1 notes, not the PM sequence.

## Allowed from the user’s own logged-in apps

A human on their own device may:

- Post **one** Craigslist housing-wanted variant per day (not email; no unsub URL required)
- Post Facebook small-business copy to the scheduled SB groups they already belong to
- Reply on Craigslist or Facebook to people who already contacted them
- Paste investor templates from `marketing/investors/` into Zoho (one recipient per slot)

Do **not** post to Anime Memes & Things, New Mexico Film Casting and more, or BLACK GIRLS.

Wait for `roadblocks.md` and `login-needed.md` before any CL/FB post.

## Not in this pass

No scraper. No prospect harvester. No send from this VM. No Craigslist auto-post. No Zillow / Facebook / Redfin scrape.
