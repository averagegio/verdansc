export const OUTREACH_TIMEZONE = "America/Denver";
export const OUTREACH_WEEK_START = "2026-09-03";
export const OUTREACH_WEEK_END = "2026-09-09";
export const OUTREACH_WINDOW_LABEL = "7:00–9:40 America/Denver";
export const EMAIL_FROM = "founder@verdansc.com";

export type OutreachChannel =
  | "facebook_group"
  | "facebook_dm"
  | "facebook_first_comment"
  | "facebook_reply_window"
  | "craigslist"
  | "email";

export type OutreachSlot = {
  id: string;
  date: string;
  time: string;
  datetimeMt: string;
  channel: OutreachChannel;
  channelLabel: string;
  account: string;
  audience: string;
  copyPath: string;
  adPath: string | null;
  cta: string;
  fromAccount?: string;
};

export const CHANNEL_LABELS: Record<OutreachChannel, string> = {
  facebook_group: "Facebook group",
  facebook_dm: "Facebook DM",
  facebook_first_comment: "First comment",
  facebook_reply_window: "Reply window",
  craigslist: "Craigslist",
  email: "Email",
};

function slot(
  id: string,
  datetimeMt: string,
  channel: OutreachChannel,
  account: string,
  audience: string,
  copyPath: string,
  adPath: string | null,
  cta: string,
): OutreachSlot {
  const [date, timeWithSec] = datetimeMt.split(" ");
  const time = timeWithSec.slice(0, 5);
  return {
    id,
    date,
    time,
    datetimeMt,
    channel,
    channelLabel: CHANNEL_LABELS[channel],
    account,
    audience,
    copyPath,
    adPath,
    cta,
    fromAccount: channel === "email" ? EMAIL_FROM : undefined,
  };
}

/**
 * 35 queued slots for 2026-09-03 through 2026-09-09.
 * Seeded from marketing/schedule/queue.csv on origin/cursor/outreach-accounts-6306.
 */
export const OUTREACH_SLOTS: OutreachSlot[] = [
  slot(
    "S01",
    "2026-09-03 07:00:00",
    "facebook_group",
    "ABQ SMALL BUSINESS",
    "ABQ SMALL BUSINESS Facebook group (confirm live title/rules); Albuquerque/Rio Rancho owner-operators",
    "marketing/facebook/small-business-short.md",
    "marketing/ads/exports/verdansc-split-ad-4x5.png",
    "https://www.verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_sb_invite&utm_content=short",
  ),
  slot(
    "S02",
    "2026-09-03 07:40:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; Downtown ABQ + Nob Hill + Rio Rancho",
    "marketing/craigslist/ad-copy.md#post-a",
    "marketing/craigslist/images/nob-hill-courtyard-apartments.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S03",
    "2026-09-03 08:20:00",
    "facebook_dm",
    "Inbound Messenger (S01)",
    "Inbound Messenger only (S01); skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/credit-check?utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S04",
    "2026-09-03 09:00:00",
    "email",
    "T&C Management",
    "T&C Management <tandcmanagement@tandcmanagement.com>; intro; ABQ+Rio Rancho PM",
    "marketing/outreach/email-sequence.md#email-1-intro",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S05",
    "2026-09-03 09:40:00",
    "email",
    "Monarch Properties, Inc.",
    "Monarch Properties Inc <mpi@monarchnm.com>; intro; AMI disclaimer",
    "marketing/outreach/email-sequence.md#email-1-intro",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S06",
    "2026-09-04 07:00:00",
    "facebook_group",
    "Albuquerque Real Estate Investors",
    "Albuquerque Real Estate Investors / ABQREIA-adjacent group (confirm rules); not Thursday group",
    "marketing/facebook/real-estate-short.md",
    "marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4",
    "https://www.verdansc.com/?utm_source=facebook&utm_medium=group&utm_campaign=abq_re_invite&utm_content=short",
  ),
  slot(
    "S07",
    "2026-09-04 07:40:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; greater Albuquerque seeker voice",
    "marketing/craigslist/ad-copy.md#post-b",
    "marketing/craigslist/images/nob-hill-courtyard-apartments.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S08",
    "2026-09-04 08:20:00",
    "facebook_dm",
    "Inbound Messenger (S06)",
    "Inbound Messenger only (S06); skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/listings?utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S09",
    "2026-09-04 09:00:00",
    "email",
    "Country Club Lofts / Rembe Design",
    "Country Club Lofts / Rembe Design <marketing@rembedesign.com>; intro 1:1; lofts/flats",
    "marketing/outreach/email-sequence.md#email-1-intro",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S10",
    "2026-09-04 09:40:00",
    "email",
    "Bryten Real Estate Partners",
    "Bryten Real Estate Partners <contactus@livebryten.com>; partnership intro only; not community blast",
    "marketing/outreach/email-sequence.md#email-1-intro",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S11",
    "2026-09-05 07:00:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; Downtown ABQ + Nob Hill loft/flat",
    "marketing/craigslist/ad-copy.md#post-c",
    "marketing/craigslist/images/downtown-abq-loft-exterior.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S12",
    "2026-09-05 07:40:00",
    "facebook_group",
    "Albuquerque housing / apartments / rentals",
    "Albuquerque housing/apartments/rentals discussion group (confirm promo allowed); new group",
    "marketing/facebook/real-estate-long.md",
    "marketing/ads/exports/verdansc-split-ad-4x5.png",
    "https://www.verdansc.com/listings?utm_source=facebook&utm_medium=group&utm_campaign=abq_re_invite&utm_content=long",
  ),
  slot(
    "S13",
    "2026-09-05 08:20:00",
    "facebook_first_comment",
    "Same group as S12",
    "Same group as S12; first comment not a second post",
    "marketing/facebook/replies-and-dms.md",
    null,
    "https://www.verdansc.com/credit-check?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=first_comment",
  ),
  slot(
    "S14",
    "2026-09-05 09:00:00",
    "facebook_dm",
    "Inbound Messenger (S12)",
    "Inbound Messenger only (S12); skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/credit-check?utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S15",
    "2026-09-05 09:40:00",
    "facebook_reply_window",
    "Open threads S01 / S06 / S12",
    "Open comment threads from S01/S06/S12; reply snippets only",
    "marketing/facebook/replies-and-dms.md",
    null,
    "https://www.verdansc.com/pricing?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=reply",
  ),
  slot(
    "S16",
    "2026-09-06 07:00:00",
    "facebook_group",
    "Rio Rancho NM community / small business",
    "Rio Rancho NM community / small business group (avoid BST if promo-banned); new group",
    "marketing/facebook/small-business-long.md",
    "marketing/ads/exports/verdansc-split-ad-30s-16x9.mp4",
    "https://www.verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_sb_invite&utm_content=long",
  ),
  slot(
    "S17",
    "2026-09-06 07:40:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; Rio Rancho primary",
    "marketing/craigslist/ad-copy.md#post-a",
    "marketing/craigslist/images/rio-rancho-apartment-exterior.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S18",
    "2026-09-06 08:20:00",
    "facebook_first_comment",
    "Same group as S16",
    "Same Rio Rancho group as S16",
    "marketing/facebook/first-comment-hashtags-alt.md",
    null,
    "https://www.verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=first_comment",
  ),
  slot(
    "S19",
    "2026-09-06 09:00:00",
    "facebook_reply_window",
    "Sat–Sun Facebook threads",
    "Open Sat-Sun Facebook threads",
    "marketing/facebook/replies-and-dms.md",
    null,
    "https://www.verdansc.com/pricing?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=reply",
  ),
  slot(
    "S20",
    "2026-09-06 09:40:00",
    "facebook_dm",
    "Inbound Messenger",
    "Inbound Messenger only; skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/signup?role=landlord&plan=landlord-growth&utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S21",
    "2026-09-07 07:00:00",
    "facebook_group",
    "Albuquerque landlords / property managers",
    "Albuquerque landlords / property managers Facebook group; new group",
    "marketing/facebook/real-estate-long.md",
    "marketing/ads/exports/verdansc-split-ad-4x5.png",
    "https://www.verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_re_invite&utm_content=long",
  ),
  slot(
    "S22",
    "2026-09-07 07:40:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; metro ABQ + Rio Rancho",
    "marketing/craigslist/ad-copy.md#post-b",
    "marketing/craigslist/images/nob-hill-courtyard-apartments.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S23",
    "2026-09-07 08:20:00",
    "facebook_first_comment",
    "Same group as S21",
    "Same landlords group as S21",
    "marketing/facebook/replies-and-dms.md",
    null,
    "https://www.verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=first_comment",
  ),
  slot(
    "S24",
    "2026-09-07 09:00:00",
    "email",
    "T&C Management",
    "T&C Management <tandcmanagement@tandcmanagement.com>; value follow-up day 4",
    "marketing/outreach/email-sequence.md#email-2-value",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S25",
    "2026-09-07 09:40:00",
    "facebook_dm",
    "Inbound Messenger",
    "Inbound Messenger only; skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/credit-check?utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S26",
    "2026-09-08 07:00:00",
    "facebook_group",
    "Albuquerque real estate networking / agents",
    "Albuquerque real estate networking / agents group; new group",
    "marketing/facebook/real-estate-short.md",
    "marketing/ads/exports/verdansc-split-ad-30s-9x16.mp4",
    "https://www.verdansc.com/?utm_source=facebook&utm_medium=group&utm_campaign=abq_re_invite&utm_content=short",
  ),
  slot(
    "S27",
    "2026-09-08 07:40:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; Downtown + Nob Hill",
    "marketing/craigslist/ad-copy.md#post-c",
    "marketing/craigslist/images/downtown-abq-loft-exterior.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S28",
    "2026-09-08 08:20:00",
    "facebook_dm",
    "Inbound Messenger",
    "Inbound Messenger only; skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/listings?utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S29",
    "2026-09-08 09:00:00",
    "email",
    "Monarch Properties, Inc.",
    "Monarch Properties Inc <mpi@monarchnm.com>; value follow-up day 5",
    "marketing/outreach/email-sequence.md#email-2-value",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S30",
    "2026-09-08 09:40:00",
    "email",
    "Country Club Lofts / Rembe Design",
    "Country Club Lofts / Rembe Design <marketing@rembedesign.com>; value follow-up day 4",
    "marketing/outreach/email-sequence.md#email-2-value",
    "marketing/ads/exports/verdansc-split-ad-16x9.jpg",
    "https://verdansc.com/signup?role=landlord&plan=landlord-growth",
  ),
  slot(
    "S31",
    "2026-09-09 07:00:00",
    "facebook_group",
    "NM small business owners / ABQ entrepreneurs",
    "New Mexico small business owners / Albuquerque entrepreneurs group; new group",
    "marketing/facebook/small-business-short.md",
    "marketing/ads/exports/verdansc-split-ad-4x5.png",
    "https://www.verdansc.com/rental-application?utm_source=facebook&utm_medium=group&utm_campaign=abq_sb_invite&utm_content=short",
  ),
  slot(
    "S32",
    "2026-09-09 07:40:00",
    "craigslist",
    "albuquerque.craigslist.org",
    "albuquerque.craigslist.org housing wanted; Rio Rancho + greater Albuquerque",
    "marketing/craigslist/ad-copy.md#post-a",
    "marketing/craigslist/images/rio-rancho-apartment-exterior.png",
    "https://verdansc.com/credit-check",
  ),
  slot(
    "S33",
    "2026-09-09 08:20:00",
    "facebook_first_comment",
    "Same group as S31",
    "Same group as S31",
    "marketing/facebook/replies-and-dms.md",
    null,
    "https://www.verdansc.com/credit-check?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=first_comment",
  ),
  slot(
    "S34",
    "2026-09-09 09:00:00",
    "facebook_dm",
    "Inbound Messenger",
    "Inbound Messenger only; skip if none",
    "marketing/facebook/replies-and-dms.md",
    "marketing/ads/exports/verdansc-split-ad-1x1.png",
    "https://www.verdansc.com/signup?role=landlord&plan=landlord-growth&utm_source=facebook&utm_medium=dm&utm_campaign=abq_invite&utm_content=followup",
  ),
  slot(
    "S35",
    "2026-09-09 09:40:00",
    "facebook_reply_window",
    "Remaining week threads",
    "Remaining week threads; honor admin takedown requests",
    "marketing/facebook/replies-and-dms.md",
    null,
    "https://www.verdansc.com/pricing?utm_source=facebook&utm_medium=group&utm_campaign=abq_invite&utm_content=reply",
  ),
];

export const OUTREACH_DATES = [
  "2026-09-03",
  "2026-09-04",
  "2026-09-05",
  "2026-09-06",
  "2026-09-07",
  "2026-09-08",
  "2026-09-09",
] as const;

export const EMAIL_BLOCK_REASON =
  "Cold email is blocked until a physical mailing address and a working unsubscribe URL exist. No scraping. Slots stay queued from founder@verdansc.com.";
