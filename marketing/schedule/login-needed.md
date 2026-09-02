# Do not send until the user logs in

**Gate:** every slot in `week-2026-09-03.md` / `queue.csv` stays `queued` until [`roadblocks.md`](roadblocks.md) is answered **and** this page is complete. Sibling agents must not Send, Post, or Publish on the operator’s behalf.

**This Cloud Agent VM has no Facebook, Zoho Mail, or Craigslist session.** A human must execute the calendar or grant a live session. Do not invent a send.

Date operator signed in (fill when true): `[ ]` _______________  
Operator name / From name: `[ ]` George Igwe / founder

---

## 1. Facebook (user and/or Verdansc Page)

Sign in before any `facebook_group`, `facebook_first_comment`, `facebook_dm`, or `facebook_reply_window` slot.

Confirmed membership list (Your groups · Most visited). **This week’s posts** use the seven core SB groups only.

- [ ] Logged into the Facebook **user** and/or Verdansc **Page** that will post as Verdansc
- [ ] Profile or Page name matches the disclosed affiliation (“I’m with Verdansc”)
- [ ] Confirmed member of each **scheduled** group (exact titles):
  - [ ] Albuquerque Small Business Community (S01)
  - [ ] New Mexico Small Businesses (S06)
  - [ ] ABQ SMALL BUSINESS (S12)
  - [ ] Support Small Business, Albuquerque, Los Lunas, Rio Rancho, Edgewood (S16)
  - [ ] ABQ Community Services / Small Business (S21)
  - [ ] Albuquerque Business Owners (S26)
  - [ ] Albuquerque Small Business Owners (S31)
- [ ] Backup only if a scheduled group is skipped: ABQ Small Business Networking, Barter & Trade
- [ ] Optional 9th (not core SB): Albuquerque Wellness Professionals
- [ ] Will **not** post to excluded rooms: Anime Memes & Things; New Mexico Film Casting and more; BLACK GIRLS (unless the user overrides `roadblocks.md`)
- [ ] Read each scheduled group’s rules (promo, approval queue, video, no-link comments)
- [ ] Messenger is open for **inbound-only** DMs (no cold outreach)
- [ ] Can attach `marketing/ads/exports/verdansc-split-ad-4x5.png` (or `.jpg`) and, if a group allows video, `verdansc-split-ad-30s-9x16.mp4`

If Facebook login fails, **skip all Facebook slots** that day. Do not dump those touches onto email or Craigslist.

---

## 2. Email (Zoho Mail — `founder@verdansc.com`)

Two tracks (see [`email-gate.md`](email-gate.md)):

- **PM cold email (`email` slots)** stays **blocked** until CAN-SPAM fields exist. Do not scrape. Do not send from this VM. Opt-in replies only: `marketing/outreach/opt-in-reply.md`.
- **Investor email (`investor_email` slots)** is a separate user-provided-list campaign. A human may paste templates from `marketing/investors/` into Zoho. Still **no auto-send from this VM**. Do not mark those slots blocked like PM cold email.

Sign in before any Zoho paste. **Not** Gmail / Google Workspace SMTP.

- [ ] Sending as **`founder@verdansc.com`** from **Zoho Mail** (George Igwe). Reply-to reaches a human.
- [ ] Will **not** send as `founder@peaksees.com` (that mailbox exists on the same Zoho switcher; do not use it)
- [ ] Zoho web or SMTP later-send only: host `smtp.zoho.com` (typically 465 SSL or 587 TLS) — this VM must not send
- [ ] SPF, DKIM, and DMARC on `verdansc.com` include Zoho (or sending is deferred until they do)
- [ ] Investor notes: one To: address per 10:00–10:50am MT slot; attach `marketing/ads/exports/verdansc-split-ad-4x5.jpg`
- [ ] PM sequence (if unblocked later): one-click unsubscribe / List-Unsubscribe can be honored within 10 business days
- [ ] Suppression list exists (unsub, bounce, “do not contact”)
- [ ] Can attach `marketing/ads/exports/verdansc-split-ad-16x9.jpg` on PM mail (do not attach the 30s MP4 on first-wave PM mail)

If Zoho login fails, **skip email slots**. Do not BCC a personal Gmail or Peaksees as a workaround. Investor drafts can wait.

---

## 3. Craigslist (`mrigwe234@gmail.com`)

Sign in before any `craigslist` slot.

- [ ] Logged into [albuquerque.craigslist.org](https://albuquerque.craigslist.org) as **`mrigwe234@gmail.com`** (personal Gmail, not `@verdansc.com`)
- [ ] Did **not** consume a magic login-link email from this VM (human clicks that link on their own device if needed)
- [ ] Account email/phone is monitored; prefer Craigslist anonymized relay on the public post
- [ ] Know how to post **housing → housing wanted** (not apts/housing for rent)
- [ ] Local copies of `marketing/craigslist/images/` are on disk for the 6-photo attach set
- [ ] Will not use automation, clone posts, or post the same title twice in one day
- [ ] Will not post from a second Craigslist account

If Craigslist login fails, **skip the day’s housing-wanted slot**. Do not post it from `founder@verdansc.com` or Peaksees.

---

## 4. CAN-SPAM fields (email cannot go out without these)

The live site does not yet publish a postal address. **Do not send** until both are real and monitored.

- [ ] `[PHYSICAL_MAILING_ADDRESS]` filled: street, city, state, ZIP (company-monitored)
- [ ] `[UNSUB_URL]` is a working one-click unsubscribe
- [ ] Backup unsub: `support@verdansc.com` with subject `unsubscribe`
- [ ] Footer on every mail: `VERDANSC 2026 INC` + address + unsub line
- [ ] Subject lines match the body (membership invite / intake / screening) — no fake “RE:”

Confirmed address (paste):  
`[PHYSICAL_MAILING_ADDRESS] = ________________________________`

Confirmed unsub:  
`[UNSUB_URL] = ________________________________`

---

## 5. Assets on disk (sibling PRs)

Pull or check out the source branches if they are not on `main` yet.

- [ ] PR #2 / `marketing/outreach/email-sequence.md` + `prospects.md` + `compliance.md`
- [ ] PR #3 / `marketing/facebook/` copy + `utm-links.md`
- [ ] PR #4 / `marketing/craigslist/ad-copy.md` + `images/`
- [ ] PR #5 / `marketing/ads/exports/` stills and 30s videos
- [ ] Investor kit / `marketing/investors/` templates (this branch). Full contact extract stays **gitignored**.

---

## Hard stops

| Missing | Action |
| --- | --- |
| Unanswered [`roadblocks.md`](roadblocks.md) | **Wait for the user.** Do not send. |
| No live Facebook / Zoho / Craigslist session on this VM | Human executes, or skip that channel. |
| Any unchecked box in §1–4 | Keep status `queued`. Do not send. |
| No inbound Facebook message at a DM slot | Mark that slot `skipped`. Do not cold-DM. |
| Prospect row still `[COMPANY_EMAIL]` | Do not guess an address. |
| Group bans promo | Skip that group post. Use the unused backup SB group — do not reuse a group already scheduled this week. |
| User has not logged in | **Do not send anything.** |
