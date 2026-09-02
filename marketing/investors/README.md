# Investor email kit (paste into Zoho — this VM does not send)

**From:** `founder@verdansc.com` (Zoho Mail, George Igwe). **Not** `founder@peaksees.com`.  
**Goal:** short, tailored notes. Live product only. No blast. No scrape.

This folder is copy + a local merge helper. Agents must not click Send. Facebook and Craigslist stay human copy-paste on the morning calendar. Investor email is a **separate campaign** from a user-provided VC/angel list — it is **not** the blocked property-manager cold-email track in `marketing/schedule/email-gate.md`.

## What is in git vs local-only

| Path | In git? | What it is |
| --- | --- | --- |
| `templates/*.md` | Yes | Four variants + subject A/B |
| `sample-contacts.json` | Yes | Fake schema + 3 invalid-domain examples |
| `extract-contacts.py` | Yes | Reads the local PDF → gitignored JSON |
| `merge-drafts.py` | Yes | Fills tokens → local `.eml` / mailto (no SMTP) |
| `contacts.extracted.json` | **No** | Full compiled list. `.gitignore`d |
| `drafts/` | **No** | Filled messages. `.gitignore`d |

Do **not** commit the raw PDF or the extracted contact file. The source PDF was a large third-party VC/angel compilation.

## Personalization tokens

Replace these before sending. `merge-drafts.py` does the substitution from a contacts JSON row.

| Token | Meaning | Source |
| --- | --- | --- |
| `[FIRST_NAME]` | Given name | Extract / your edit |
| `[FIRM]` | Fund, studio, or angel group | Extract / your edit |
| `[THESIS]` | One-line why this person | Classifier default, then you tighten |

Classifier defaults (override when you know the fund):

- **angel** — early marketplace and consumer infrastructure
- **seed** — seed-stage marketplaces and local network effects
- **proptech** — proptech and residential marketplaces
- **generalist** — two-sided marketplaces and local software

## Templates (4)

| Variant | File | Use when |
| --- | --- | --- |
| Angel | `templates/angel.md` | Angel / angel group / “Angel (individual)” |
| Seed VC | `templates/seed.md` | Seed, pre-seed, 500 Startups–style |
| Proptech | `templates/proptech.md` | Housing / real estate / proptech thesis |
| Generalist | `templates/generalist.md` | Everyone else |

Each file has a **1-line subject A** and **subject B**. Body is 2–5 sentences, then:

1. Deck: https://www.verdansc.com/pitch
2. Split-still line + live product: https://www.verdansc.com/listings and https://www.verdansc.com/signup
3. Soft CTA (look at the deck or a short call)

Claims match the live pitch (`/pitch`): map-first rental marketplace, ABQ–Rio Rancho, $19 credit check, landlord intake, two-sided marketplace. **Do not** write “Raising $1.8M” (removed from the pitch). **Do not** invent traction.

## Attachments (in Zoho, not in git as binary)

- **Required still:** `marketing/ads/exports/verdansc-split-ad-4x5.jpg` (sibling ads PR). One-line body description: renter browsing listings on one side, landlord photographing a home on the other.
- **Optional:** `marketing/ads/exports/verdansc-split-ad-30s-16x9.mp4` — skip on first note if the mailbox is picky about video size.

## How to paste into Zoho (`founder@verdansc.com`)

We are **not** sending from this VM. On your machine:

1. Run the extract once (PDF stays outside git):

   ```bash
   python3 marketing/investors/extract-contacts.py \
     --pdf /path/to/master_list_of_vc_iykyk.pdf \
     --out marketing/investors/contacts.extracted.json
   ```

2. Optional dry run on the fake sample:

   ```bash
   python3 marketing/investors/merge-drafts.py \
     --contacts marketing/investors/sample-contacts.json \
     --out marketing/investors/drafts --limit 3
   ```

3. For a real morning (cap **6 notes**, staggered — see `marketing/schedule/investor-queue.csv`):

   ```bash
   python3 marketing/investors/merge-drafts.py \
     --contacts marketing/investors/contacts.extracted.json \
     --out marketing/investors/drafts --limit 6 --subject A
   ```

4. Open Zoho Mail as **`founder@verdansc.com`**.
5. New message → **one** To: address from that slot’s draft (no BCC of the list).
6. Paste subject A or B. Paste the body. Check `[FIRST_NAME]`, `[FIRM]`, `[THESIS]` are gone.
7. Attach `verdansc-split-ad-4x5.jpg`. Optionally attach the 30s 16×9.
8. Send **once**. Mark the slot `sent` in `marketing/schedule/investor-queue.csv` (and `queue.csv`). If you skip, mark `skipped` — do not dump the leftover into the next slot as a burst.

Spell-check the filled name/firm. Keep the body under ~120 words (templates are written to that cap).

## Schedule

Investor slots live in a **10:00–10:50am America/Denver** window on weekdays only (six notes, 10 minutes apart). Morning Facebook / Craigslist / PM-email slots stay 7:00–9:40am and stay human copy-paste. See `marketing/schedule/README.md`.

Status of every investor slot: **`queued`**. This kit does not auto-send.

## What this kit will not do

- Send, SMTP, or mail-merge a blast
- Scrape Zillow, Facebook, or Redfin
- Commit the compiled email list
- Claim fake traction or a live $1.8M raise
