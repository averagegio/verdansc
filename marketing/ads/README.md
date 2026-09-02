# Verdansc marketing ads (Facebook attach subset)

This branch vendors **only** the files Facebook group posts and DMs need. Full source, rebuild scripts, and extra crops live on `origin/cursor/marketing-ads-6306` (GitHub PR #5).

| File | Facebook use |
| --- | --- |
| `exports/verdansc-split-ad-4x5.jpg` | **Default attach** for feed/group posts and DMs (1080×1350) |
| `exports/verdansc-split-ad-4x5.png` | Same still, lossless |
| `exports/verdansc-split-ad-30s-9x16.mp4` | Optional Reels/group video **only if the group allows video**; never DMs |
| `COPY.md` | Overlay copy baked into the still/video (do not paste “Photograph. Upload.” as a product claim) |

How to attach: `marketing/facebook/attachments.md`.

## Gaps (product vs ad)

- **No property-photo field on intake.** `/rental-application` creates an intake link (title, address, fee, requirements) and does not accept a listing photo. Photo upload exists on `/move-out-tracker` and `/move-in-planner` evidence images, not on intake. The ad shows a landlord photographing a house, then the real intake form — that pairing is narrative, not a single native screen.
- **No push-notification UI.** Climax cards are ad treatments. Closest product surfaces: landlord dashboard “Paid applications ready for review” and `/application-status/[id]` status `Approved` (“Your application has been approved.”).
- **No in-app “you got a tenant” string.** Wording is polished ad copy for the landlord queue event.
- Generated notification photos include a decorative leaf glyph; official brand in-product is the **VERDANSC** wordmark, which is what the overlays and end card use.
