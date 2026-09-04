# Outreach compliance and list hygiene

Verdansc staff and contractors must treat `marketing/outreach/` as a **draft kit**. Nobody sending from this repo has been authorized to fire a campaign by the existence of these files.

## Do not send (yet)

- Do not mail-merge these templates until counsel (or a designated compliance owner) confirms a lawful basis for each recipient.
- Do not buy scraped “Albuquerque landlord email” lists.
- Do not skip unsubscribe, physical address, or sender identity to “look cleaner.”

## Do not scrape

**Forbidden**

- Bulk crawling or automated harvesting of Zillow, Apartments.com, Realtor.com, Apartment List, Rent.com, or similar.
- Bypassing robots.txt, CAPTCHAs, blocks, login walls, or rate limits.
- Copying listing photos, floor plans, or copyrighted listing descriptions into emails, the CRM, or this folder.
- Using browser automation to page through thousands of results “just to get PM names.”
- Pulling personal emails from LinkedIn, whitepages-style tools, or AANM member directories into a blast file.

**Allowed**

- Reading a **small number** of public research pages and company homepages (as done in `market-notes.md` / `prospects.md`).
- Recording a generic `info@` / `contact@` / office inbox **when it is published on that company’s own website**, with `source_url` and date.
- Using contact forms, published phone numbers, and in-person/association introductions.
- Citing market reports with links.

If a site’s terms prohibit scraping, do not scrape it. A Google search snippet is not a license to copy listing copy.

## CAN-SPAM (US commercial email)

Every commercial message must:

1. **Identify the sender.** Use a real From name and `@verdansc.com` mailbox (e.g. `support@verdansc.com`). No spoofed PM-looking domains. Footer: VERDANSC 2026 INC.
2. **Honest subject lines.** The subject must match the body (membership invite / intake / screening). Ban: “RE: your vacancy,” “Application received,” “Tenant waiting,” “Final notice,” or anything that mimics a resident or vendor.
3. **Physical postal address.** Replace `[PHYSICAL_MAILING_ADDRESS]` with the company’s current mailing address (street, city, state, ZIP). The live site does not yet publish one; **do not send** until this is filled with a real address the company monitors.
4. **Clear unsubscribe.** Working `[UNSUB_URL]` (honor within 10 business days; suppress immediately in practice) plus `support@verdansc.com` subject `unsubscribe`. Honor opt-outs across all Verdansc marketing lists.
5. **No deceptive headers.** Reply-to must reach a human. Do not use lookalike domains.

CAN-SPAM is a floor, not a strategy. A technically compliant blast to harvested inboxes is still a bad idea and may violate other laws.

## Lawful basis (do not email “everyone we found”)

Before an address goes into a send tool, record one of:

| Basis | OK? | Notes |
| --- | --- | --- |
| Person asked to be contacted | Yes | Save the form/email proof |
| Existing customer or active conversation | Yes | Stay on-topic |
| Published **company** inbox on the company’s own site, B2B relevance | Maybe | US B2B cold email is commonly done under CAN-SPAM, but confirm with counsel; still honor opt-out; still no harvested personal mail |
| Named personal email from LinkedIn / ZoomInfo / scrape | No | Leave as `[PM_NAME]` until they opt in or publish a company role inbox |
| Guessed `info@` | No | |
| Community `leasing@` harvested from aggregators | No | |

New Mexico and other states may add privacy or telemarketing rules. If you SMS or call, this document is not your TCPA policy — get a separate one.

## List hygiene

- **One row per company** for the first wave. No spraying every on-site manager in a Greystar portfolio.
- Fields: company, name, role, email, source_url, date, lawful_basis, do_not_contact, unsub_date.
- Bounce = suppress. Role-change / “not me” = suppress and do not find a new personal email to sneak around it.
- Never re-add an unsubscribed address with a “new list” excuse.
- Separate **transactional** mail (someone signed up) from **marketing** mail (this sequence).
- Keep a suppression list: unsub, bounce, competitor counsel, anyone who said no.

## Fair Housing and honesty

- Do not suggest Verdansc helps “filter out bad zip codes,” “keep certain applicants out,” or otherwise steer.
- Credit check is a **paid report the user initiates with consent** on https://verdansc.com/credit-check. Recipients remain responsible for FCRA, consent, and adverse-action rules.
- Do not promise approvals, occupancy rates, or “guaranteed tenants.”
- Do not promise features that are not in the product (see `email-sequence.md` product table).

## Sending operations

- ESP with authentication (SPF/DKIM/DMARC on verdansc.com), complaint monitoring, and one-click unsubscribe (List-Unsubscribe header).
- Warm a new domain slowly. 18 hand-selected company inboxes do not need a 50k/day blaster.
- First wave: local PMs in `prospects.md` with a documented company inbox only.
- After three emails with no reply: stop.
- Track: sent, delivered, reply, unsub, signup at https://verdansc.com/signup?role=landlord — not vanity open rates.

## Who may press send

Only a Verdansc operator who has:

1. Filled `[PHYSICAL_MAILING_ADDRESS]`, `[UNSUB_URL]`, and a real `[SENDER_NAME]`.
2. Filled emails solely from company sites or opt-in.
3. Read this file and `email-sequence.md`.

Until then, these files stay drafts.
