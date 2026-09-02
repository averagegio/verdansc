# Do not send until the user logs in

**Gate:** every slot in `week-2026-09-03.md` / `queue.csv` stays `queued` until this page is complete. Sibling agents must not Send, Post, or Publish on the operator’s behalf.

Date operator signed in (fill when true): `[ ]` _______________  
Operator name / From name: `[ ]` _______________

---

## 1. Facebook

Sign in before any `facebook_group`, `facebook_first_comment`, `facebook_dm`, or `facebook_reply_window` slot.

- [ ] Logged into the Facebook account (or Page) that will post as Verdansc
- [ ] Profile or Page name matches the disclosed affiliation (“I’m with Verdansc”)
- [ ] Joined each group named this week (search + confirm live title; see calendar)
- [ ] Read each group’s rules (promo, approval queue, no-link comments)
- [ ] Messenger is open for **inbound-only** DMs (no cold outreach)
- [ ] Can attach `marketing/ads/exports/verdansc-split-ad-4x5.png` and, if the group allows video, `verdansc-split-ad-30s-9x16.mp4`

If Facebook login fails, **skip all Facebook slots** that day. Do not dump those touches onto email or Craigslist.

---

## 2. Email (Gmail / Google Workspace SMTP)

Sign in before any `email` slot.

- [ ] Sending as a real person from `@verdansc.com` (e.g. `support@verdansc.com` or a named mailbox) — not a spoofed PM-looking domain
- [ ] Reply-to reaches a human (no no-reply)
- [ ] Gmail or Google Workspace SMTP is authenticated for that mailbox
- [ ] SPF, DKIM, and DMARC on `verdansc.com` are in place (or sending is deferred until they are)
- [ ] One-click unsubscribe / List-Unsubscribe can be honored within 10 business days
- [ ] Suppression list exists (unsub, bounce, “do not contact”)
- [ ] Can attach `marketing/ads/exports/verdansc-split-ad-16x9.jpg` (do not attach the 30s MP4 on first-wave mail)

If SMTP login fails, **skip email slots**. Do not BCC a personal Gmail as a workaround.

---

## 3. Craigslist

Sign in before any `craigslist` slot.

- [ ] Logged into [albuquerque.craigslist.org](https://albuquerque.craigslist.org)
- [ ] Account email/phone is an operator alias you monitor (prefer Craigslist anonymized relay)
- [ ] Know how to post **housing → housing wanted** (not apts/housing for rent)
- [ ] Local copies of `marketing/craigslist/images/` are on disk for the 6-photo attach set
- [ ] Will not use automation, clone posts, or post the same title twice in one day

If Craigslist login fails, **skip the day’s housing-wanted slot**. Do not post it from a second account.

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

---

## Hard stops

| Missing | Action |
| --- | --- |
| Any unchecked box in §1–4 | Keep status `queued`. Do not send. |
| No inbound Facebook message at a DM slot | Mark that slot `skipped`. Do not cold-DM. |
| Prospect row still `[COMPANY_EMAIL]` | Do not guess an address. |
| Group bans promo | Skip that group post. Do not re-use a group already scheduled this week. |
| User has not logged in | **Do not send anything.** |
