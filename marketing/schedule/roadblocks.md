# Roadblocks — user yes/no before any send

Nothing in `week-2026-09-03.md` / `queue.csv` may leave `queued` until you answer these. This environment **did not** send email, post to Facebook, post to Craigslist, or click the Craigslist login link.

## Need your yes/no

| # | Decision | Agent default (until you override) | Your answer |
| --- | --- | --- | --- |
| 1 | **Cannot send from this VM.** No live Facebook, Zoho Mail, or Craigslist session. A human must execute the calendar or grant a live session. | Stay `queued`. Do not send. | Yes / No — execute yourself? Grant a session? |
| 2 | **Off-topic groups excluded.** Do **not** schedule Verdansc rental ads to **Anime Memes & Things**, **New Mexico Film Casting and more**, or **BLACK GIRLS**. Those rooms are not local business/professional; posting there would look like spam. | Excluded. Backup rooms are the unused SB groups, not these three. | OK to keep excluded? Or override (name which)? |
| 3 | **Split identity.** Email From is **`founder@verdansc.com`** (Zoho). Craigslist posts as **`mrigwe234@gmail.com`** on albuquerque.craigslist.org. Do **not** use `founder@peaksees.com`. | Keep this split. Do not click the Gmail Craigslist magic link from this VM. | OK? |
| 4 | **CAN-SPAM still missing for PM blasts.** Need a real `[PHYSICAL_MAILING_ADDRESS]` and a working `[UNSUB_URL]` before any **PM** commercial email. See `email-gate.md`. | Skip every PM `email` slot until both exist. No scrape / no send. | Paste address + unsub URL, or confirm skip? |
| 5 | **Group rules unread.** Promo / video / link-in-comments unknown. First post = short small-business variant + 4×5 still (S01 → Albuquerque Small Business Community). | Still only; skip a group that bans promo; do not reuse a group already on this week. | OK? Prefer video on a named group? |
| 6 | **Stay on the calendar.** Morning: 5 slots/day, 7:00 / 7:40 / 8:20 / 9:00 / 9:40 America/Denver, Sep 3–9. Investor: 6 notes, 10:00–10:50 weekdays. Do not blast all groups or inboxes in one sitting. | One unique SB group per day. One Craigslist housing-wanted per day. Inbound Facebook DMs only. Max 6 investor notes/weekday. | OK? |
| 7 | **Investor email is a separate campaign.** User-provided VC/angel list. Human paste into Zoho as `founder@verdansc.com`. Not a Zillow/Facebook/Redfin scrape. Do **not** mark it blocked like PM cold email. Do **not** auto-send. | Keep `investor_email` `queued`. Cap 6/day in 10:00–10:50 MT. Full list stays gitignored. | OK to send yourself from Zoho? |

## Major targeting change (please confirm)

Previous calendars used **search-target** names (investor / housing / realtor rooms) and mixed `real-estate-*` copy. Your membership list is almost all **Albuquerque / NM small-business** groups.

This pass:

- Schedules **only** local business/professional groups (7 unique, most-visited first).
- Binds every Facebook group slot to an **exact title** from Your groups.
- Switches this week’s group copy to **small-business-short / small-business-long** only (`real-estate-*` is unused).
- Leaves **Albuquerque Wellness Professionals** as optional backup (professional, not core SB).
- Leaves **ABQ Small Business Networking, Barter & Trade** as unused backup.

If you want investor/realtor rooms instead, or want ads in the three excluded groups, say so before anyone posts.

## Not done (and will not be done from this environment)

- No email sent (including from Zoho). Investor drafts were not mailed.
- No Facebook post, comment, or DM.
- No Craigslist post.
- Craigslist login-link email to `mrigwe234@gmail.com` was **not** opened or clicked.
- No extra email scrape (no Zillow / Facebook / Redfin).

Reply on this file or in chat: yes/no per row 1–7, plus CAN-SPAM values if PM email should ever leave `queued`.
