/* Copied from origin/cursor/facebook-ads-outreach-schedule-c958 (PR 19 live tracker)
 * Week: 2026-09-02 through 2026-09-09, America/Denver
 * Times: 7:00 / 7:40 / 8:20 / 9:00 / 9:40
 * Tracker only — no send, no scrape, no login, no LinkedIn publish.
 *
 * GTM this week (George):
 *   Facebook = one unique group per day (never reuse Albuquerque Small
 *   Business Community after Thu 9/3).
 *   LinkedIn = organic Grok Imagine ad posts in the old 9:00 / 9:40 email
 *   slots, new 16:9 ad each day through 2026-09-09. No DMs, no paid.
 *   Caption/CTA: $19 soft credit check, rental-application intake, landlord
 *   signup. Do not CTA /listings while the Austin smoke-test row is public.
 *   Craigslist stays listed, not the primary GTM.
 *   T&C / Monarch / Country Club Lofts / Rembe / Bryten cold email: removed.
 *
 * Facebook unique groups:
 *   Wed 9/2 Albuquerque Small Business Community (already used)
 *   Thu 9/3 Albuquerque Small Business Community (already used — do not reuse)
 *   Fri 9/4 New Mexico Small Businesses
 *   Sat 9/5 ABQ SMALL BUSINESS
 *   Sun 9/6 Support Small Business metro
 *   Mon 9/7 ABQ Community Services / Small Business
 *   Tue 9/8 Albuquerque Business Owners
 *   Wed 9/9 Albuquerque Small Business Owners
 */
window.OUTREACH_WEEK = {
  tz: "America/Denver",
  start: "2026-09-02",
  end: "2026-09-09",
  times: ["07:00", "07:40", "08:20", "09:00", "09:40"],
  windowStart: "07:00",
  windowEnd: "10:00",
};

window.OUTREACH_SLOTS = [
  {
    id: "S-TODAY-01",
    date: "2026-09-02",
    time: "07:00",
    channel: "facebook_group",
    group: "Albuquerque Small Business Community",
    title: "Albuquerque Small Business Community",
    detail:
      "Named ABQ/NM SB group · short post + 4×5 still · 30s 9×16 video if allowed · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings · confirm live title + rules",
  },
  {
    id: "S-TODAY-02",
    date: "2026-09-02",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail:
      "Downtown ABQ, Nob Hill, Rio Rancho · day-01 variant (Post A) · listed, not primary GTM this week",
  },
  {
    id: "S-TODAY-03",
    date: "2026-09-02",
    time: "08:20",
    channel: "facebook_dm",
    group: "Albuquerque Small Business Community",
    title: "Inbound DM (S-TODAY-01)",
    detail: "Messenger follow-up only if they wrote first · skip if none",
  },
  {
    id: "S-TODAY-04",
    date: "2026-09-02",
    time: "09:00",
    channel: "facebook_first_comment",
    group: "Albuquerque Small Business Community",
    title: "First comment on S-TODAY-01",
    detail:
      "Same group as S-TODAY-01 · not a second post · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings · video disclaimer if the 30s clip is attached",
  },
  {
    id: "S-TODAY-05",
    date: "2026-09-02",
    time: "09:40",
    channel: "facebook_reply_window",
    group: "Albuquerque Small Business Community",
    title: "Reply window / inbound",
    detail: "Open threads or inbound only · skip if none · no cold email on this board",
  },
  {
    id: "S01",
    date: "2026-09-03",
    time: "07:00",
    channel: "facebook_group",
    group: "Albuquerque Small Business Community",
    title: "Albuquerque Small Business Community",
    detail:
      "Named ABQ/NM SB group · one unique group today · short post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings · confirm live title + rules · do not reuse this group Fri–Wed",
  },
  {
    id: "S02",
    date: "2026-09-03",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail:
      "Downtown ABQ, Nob Hill, Rio Rancho · Post A · listed, not primary GTM this week",
  },
  {
    id: "S03",
    date: "2026-09-03",
    time: "08:20",
    channel: "facebook_dm",
    group: "Albuquerque Small Business Community",
    title: "Inbound DM (S01)",
    detail: "Messenger follow-up only if they wrote first · skip if none · Facebook inbound only, not LinkedIn",
  },
  {
    id: "S04",
    date: "2026-09-03",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-03",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-03.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S05",
    date: "2026-09-03",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-03",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-03.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
  {
    id: "S06",
    date: "2026-09-04",
    time: "07:00",
    channel: "facebook_group",
    group: "New Mexico Small Businesses",
    title: "New Mexico Small Businesses",
    detail:
      "Named NM SB group · one unique group today · not Albuquerque Small Business Community · short post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S07",
    date: "2026-09-04",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail: "Greater Albuquerque · Post B · listed, not primary GTM this week",
  },
  {
    id: "S08",
    date: "2026-09-04",
    time: "08:20",
    channel: "facebook_dm",
    group: "New Mexico Small Businesses",
    title: "Inbound DM (S06)",
    detail: "Inbound only · skip if none · Facebook inbound only, not LinkedIn",
  },
  {
    id: "S09",
    date: "2026-09-04",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-04",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-04.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S10",
    date: "2026-09-04",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-04",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-04.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
  {
    id: "S11",
    date: "2026-09-05",
    time: "07:00",
    channel: "facebook_group",
    group: "ABQ SMALL BUSINESS",
    title: "ABQ SMALL BUSINESS",
    detail:
      "Named ABQ SB group · one unique group today · not Albuquerque Small Business Community · long post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings · confirm promo rules",
  },
  {
    id: "S12",
    date: "2026-09-05",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail:
      "Downtown ABQ + Nob Hill loft/flat · Post C · listed, not primary GTM this week",
  },
  {
    id: "S13",
    date: "2026-09-05",
    time: "08:20",
    channel: "facebook_first_comment",
    group: "ABQ SMALL BUSINESS",
    title: "First comment on S11",
    detail:
      "Same group as S11 · not a second post · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S14",
    date: "2026-09-05",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-05",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-05.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S15",
    date: "2026-09-05",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-05",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-05.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
  {
    id: "S16",
    date: "2026-09-06",
    time: "07:00",
    channel: "facebook_group",
    group: "Support Small Business, Albuquerque, Los Lunas, Rio Rancho, Edgewood",
    title: "Support Small Business (ABQ / Los Lunas / Rio Rancho / Edgewood)",
    detail:
      "Named metro SB group · one unique group today · not Albuquerque Small Business Community · long post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S17",
    date: "2026-09-06",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail: "Rio Rancho primary · Post A · listed, not primary GTM this week",
  },
  {
    id: "S18",
    date: "2026-09-06",
    time: "08:20",
    channel: "facebook_first_comment",
    group: "Support Small Business, Albuquerque, Los Lunas, Rio Rancho, Edgewood",
    title: "First comment on S16",
    detail:
      "Same Support Small Business group · not a second post · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S19",
    date: "2026-09-06",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-06",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-06.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S20",
    date: "2026-09-06",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-06",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-06.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
  {
    id: "S21",
    date: "2026-09-07",
    time: "07:00",
    channel: "facebook_group",
    group: "ABQ Community Services / Small Business",
    title: "ABQ Community Services / Small Business",
    detail:
      "Named ABQ SB group · one unique group today · not Albuquerque Small Business Community · short post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S22",
    date: "2026-09-07",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail: "Metro ABQ + Rio Rancho · Post B · listed, not primary GTM this week",
  },
  {
    id: "S23",
    date: "2026-09-07",
    time: "08:20",
    channel: "facebook_first_comment",
    group: "ABQ Community Services / Small Business",
    title: "First comment on S21",
    detail:
      "Same group as S21 · not a second post · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S24",
    date: "2026-09-07",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-07",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-07.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S25",
    date: "2026-09-07",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-07",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-07.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
  {
    id: "S26",
    date: "2026-09-08",
    time: "07:00",
    channel: "facebook_group",
    group: "Albuquerque Business Owners",
    title: "Albuquerque Business Owners",
    detail:
      "Named ABQ SB group · one unique group today · not Albuquerque Small Business Community · short post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S27",
    date: "2026-09-08",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail: "Downtown + Nob Hill · Post C · listed, not primary GTM this week",
  },
  {
    id: "S28",
    date: "2026-09-08",
    time: "08:20",
    channel: "facebook_dm",
    group: "Albuquerque Business Owners",
    title: "Inbound DM (S26)",
    detail: "Inbound only · skip if none · Facebook inbound only, not LinkedIn",
  },
  {
    id: "S29",
    date: "2026-09-08",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-08",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-08.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S30",
    date: "2026-09-08",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-08",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-08.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
  {
    id: "S31",
    date: "2026-09-09",
    time: "07:00",
    channel: "facebook_group",
    group: "Albuquerque Small Business Owners",
    title: "Albuquerque Small Business Owners",
    detail:
      "Named ABQ SB group · one unique group today · not Albuquerque Small Business Community · short post + 4×5 still · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S32",
    date: "2026-09-09",
    time: "07:40",
    channel: "craigslist",
    group: "",
    title: "Craigslist housing-wanted",
    detail:
      "Rio Rancho + greater Albuquerque · Post A · listed, not primary GTM this week",
  },
  {
    id: "S33",
    date: "2026-09-09",
    time: "08:20",
    channel: "facebook_first_comment",
    group: "Albuquerque Small Business Owners",
    title: "First comment on S31",
    detail:
      "Same group as S31 · not a second post · CTA $19 soft credit check + rental-application intake + landlord signup · no /listings",
  },
  {
    id: "S34",
    date: "2026-09-09",
    time: "09:00",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic · Grok Imagine 2026-09-09",
    detail:
      "Organic feed post · new Grok Imagine 16:9 ad grok-imagine-linkedin-2026-09-09.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · no DMs · no paid",
  },
  {
    id: "S35",
    date: "2026-09-09",
    time: "09:40",
    channel: "linkedin",
    group: "",
    title: "LinkedIn organic comment · Grok Imagine 2026-09-09",
    detail:
      "Organic first comment on the 9:00 LinkedIn post · same-day Grok Imagine ad grok-imagine-linkedin-2026-09-09.mp4 · caption/CTA $19 soft credit check + rental-application intake + landlord signup · no /listings (Austin smoke-test row is public) · not a second post · no DMs · no paid",
  },
];
