# Verdansc property-manager email sequence (3 touches)

**Audience:** Property managers, small operators, and leasing leads in greater Albuquerque and Rio Rancho.  
**CTA:** Create a landlord member account and list properties on Verdansc.  
**Do not send until** `compliance.md` is followed. This kit is drafts only.

**From (identify the sender):**  
`[SENDER_NAME]` at Verdansc · `support@verdansc.com` (or a named `@verdansc.com` mailbox)  
**Reply-to:** same human mailbox, not a no-reply.  
**Company:** VERDANSC 2026 INC (as shown on https://verdansc.com/)

## Product facts you may claim (shipped)

Use these URLs. Do not invent PMS, lockboxes, rent collection, or listing-photo galleries.

| Landlord need | What Verdansc actually does | URL |
| --- | --- | --- |
| Become a member | Landlord signup; choose Landlord Growth ($99/mo) or Landlord Pro ($249/mo) | https://verdansc.com/signup?role=landlord&plan=landlord-growth · https://verdansc.com/pricing |
| List / intake a property | Applicant Intake Setup: title, address, application fee, screening requirements → shareable apply link | https://verdansc.com/rental-application |
| Get tenants | Active intake listings appear on renter discovery | https://verdansc.com/listings |
| Collect applications | Structured apply flow (contact, move-in, income, occupants, notes) + application fee | https://verdansc.com/listings → `/apply/[listingId]` |
| See applicants | Dashboard queue of paid applications | https://verdansc.com/login?role=landlord then dashboard |
| Screen | Payment-gated credit check, $19 | https://verdansc.com/credit-check |
| Show the unit | 3D Home Tours (walkthrough-ready experiences, shareable media links) | https://verdansc.com/3d-home-tour |
| Condition photos | Move-out tracker supports photo evidence (not a public listing gallery) | https://verdansc.com/move-out-tracker |
| Login | Landlord login | https://verdansc.com/login?role=landlord |

**Do not claim:** Zillow syndication, automatic rent ACH, background/criminal search beyond the credit-check product, Fair Housing decisioning, LIHTC compliance, SMS blasts, or “upload listing photos into intake” (intake today is title / address / fee / requirements).

**Photo language that stays honest:** invite them to pair intake links with **3D Home Tours** and to use **move-out photo evidence** for unit condition — not “post your listing photos to our marketplace gallery.”

## Personalization tokens

| Token | Meaning |
| --- | --- |
| `[PM_NAME]` | First name or “there” if unknown |
| `[COMPANY]` | Firm name |
| `[MARKET]` | Albuquerque / Rio Rancho / greater Albuquerque |
| `[INVENTORY_TYPE]` | apartments / lofts / flats / single-family rentals / mixed portfolio |
| `[ONE_LOCAL_DETAIL]` | One fact from their **own website** (e.g. “your downtown loft mix”, “Rio Rancho SFR”) — never a scraped listing blurb |
| `[SENDER_NAME]` | Real person at Verdansc |
| `[SENDER_TITLE]` | e.g. Partnerships |
| `[PHYSICAL_MAILING_ADDRESS]` | Required CAN-SPAM postal address |
| `[UNSUB_URL]` | One-click unsubscribe |
| `[UNSUB_EMAIL]` | `support@verdansc.com` with subject `unsubscribe` as backup |

Keep `[ONE_LOCAL_DETAIL]` to a short clause. If you cannot personalize, omit it rather than faking it.

---

## Email 1 — Intro (day 0)

**Goal:** Name the market, name the product, one CTA. No feature dump.

**Subject A:** Listing apartments and lofts in `[MARKET]` — a Verdansc member invite  
**Subject B:** `[COMPANY]`: applicant intake for your `[MARKET]` rentals  

Both are honest: this is an invitation to join, not a fake “RE: your vacancy.”

**Preview A:** Set up intake, share an apply link, and let renters find your listings.  
**Preview B:** Landlord Growth membership for screening and applications — built for ABQ and Rio Rancho operators.

```
Hi [PM_NAME],

I’m [SENDER_NAME] at Verdansc. We built a map-first rental workspace for landlords and managers in greater Albuquerque and Rio Rancho — apartments, lofts, flats, and scattered rentals.

If [COMPANY] is filling [INVENTORY_TYPE][ONE_LOCAL_DETAIL], you can become a landlord member, list a property, and send applicants a structured apply link instead of a PDF pile.

What members use today:
• Applicant intake setup (property, fee, requirements, shareable apply URL)
• Listings renters can browse before they apply
• $19 payment-gated credit checks
• A dashboard queue of paid applications

Create a landlord account (Landlord Growth is $99/mo; Landlord Pro is $249/mo):
https://verdansc.com/signup?role=landlord&plan=landlord-growth

Pricing: https://verdansc.com/pricing
Intake setup: https://verdansc.com/rental-application

If this isn’t useful, reply “unsubscribe” or use [UNSUB_URL] and we will not email again.

[SENDER_NAME]
[SENDER_TITLE], Verdansc
support@verdansc.com
https://verdansc.com/

VERDANSC 2026 INC
[PHYSICAL_MAILING_ADDRESS]
Unsubscribe: [UNSUB_URL] · [UNSUB_EMAIL]
```

---

## Email 2 — Value (day 4–6)

**Goal:** Landlord-side workflow in their language. Still one CTA.

**Subject A:** How [COMPANY] can collect applications on Verdansc  
**Subject B:** Intake, tenants, and screening — without a new PMS  

**Preview A:** Create the listing, share the link, review paid applications.  
**Preview B:** Credit check is $19. Listings go live for renter search.

```
Hi [PM_NAME],

Quick follow-up with the actual landlord path, since the first note was an invite.

1) Join as a landlord member
https://verdansc.com/signup?role=landlord&plan=landlord-growth

2) List the unit
On Applicant Intake Setup you enter title, address, application fee, and screening notes, then copy an apply link:
https://verdansc.com/rental-application

3) Get in front of renters
Those listings appear on Verdansc renter search:
https://verdansc.com/listings

4) Screen
Applicants complete a rental application (contact, move-in, income, occupants). You can run a $19 credit check:
https://verdansc.com/credit-check

Paid applications land in your landlord dashboard:
https://verdansc.com/login?role=landlord

Showing the home: 3D Home Tours are a separate service for walkthrough-ready media (not a Zillow photo scrape, and not required to list):
https://verdansc.com/3d-home-tour

Move-out photo evidence lives on the move-out tracker if you need condition files:
https://verdansc.com/move-out-tracker

We are not asking you to rip out AppFolio or your community PMS. Use Verdansc as the member layer for intake, discovery, and screening in [MARKET].

Landlord Growth ($99/mo) includes the applicant pipeline, intake links, and member-rate credit-check volume. Landlord Pro ($249/mo) raises limits and onboarding priority.
https://verdansc.com/pricing

If you want a 15-minute walkthrough for [COMPANY], reply with a time. If not, [UNSUB_URL].

[SENDER_NAME]
Verdansc · support@verdansc.com
VERDANSC 2026 INC · [PHYSICAL_MAILING_ADDRESS]
Unsubscribe: [UNSUB_URL]
```

---

## Email 3 — Soft bump (day 12–14)

**Goal:** Permission to close the loop. No pressure, no fake scarcity.

**Subject A:** Should I close the loop with [COMPANY]?  
**Subject B:** Last note on Verdansc membership for [MARKET]  

**Preview A:** Happy to stop after this. The signup link is here if useful.  
**Preview B:** One link to create a landlord member account.

```
Hi [PM_NAME],

I’ll keep this short and then step back.

Verdansc is inviting property managers in Albuquerque and Rio Rancho to sign up as landlord members and list properties for renter applications and screening. If that’s useful for [COMPANY], the account link is:

https://verdansc.com/signup?role=landlord&plan=landlord-growth

If now is the wrong time, ignore this or unsubscribe here: [UNSUB_URL]. I won’t follow up after this note unless you reply.

Thanks for the work you already do housing [MARKET].

[SENDER_NAME]
Verdansc
support@verdansc.com
https://verdansc.com/

VERDANSC 2026 INC
[PHYSICAL_MAILING_ADDRESS]
Unsubscribe: [UNSUB_URL] · [UNSUB_EMAIL]
```

---

## Sequence rules (anti-spam cannon)

- Cap at **3 emails** unless they reply. No “just bumping this” #4.
- **Throttle:** first wave ≤20 firms from `prospects.md` with a filled lawful email. Review replies before scaling.
- **Send window:** Tue–Thu, 9:00–11:30am Mountain. No Monday 6am blasts.
- **One conversation per company** — do not email five community inboxes at the same operator.
- **Human From name.** Merge `[PM_NAME]` only when you have it; otherwise “Hi there” is better than a wrong first name.
- **A/B:** run Subject A vs B on email 1 only (split the small list). Do not A/B all three at once on 18 people.
- If they say they’re fully on Yardi/Greystar stack: thank them, offer to stay in touch for boutique/overflow units, and suppress.

## Suggested first-wave segments

1. Local PMs (rows 1–8 in `prospects.md`) — Emails 1–3 as written.  
2. Boutique lofts (Peterson, Country Club / Rembe, Maddox lofts) — swap `[INVENTORY_TYPE]` to “lofts and flats.”  
3. Monarch / other affordable operators — add one sentence: “Verdansc does not replace your compliance or AMI workflow; it is intake, discovery, and credit check only.”  
4. Nationals — **do not** run this sequence as a mail merge. Use a single partnership email to `contactus@` / corporate form.
