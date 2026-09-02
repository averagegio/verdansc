/**
 * Capture live Verdansc UI for ad composition.
 * Requires playwright-core (e.g. npm install -C /tmp/pw-capture playwright-core)
 * and a running `npm run dev` on http://localhost:3000.
 */
import { mkdir } from "node:fs/promises";

let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  ({ chromium } = await import("/tmp/pw-capture/node_modules/playwright-core/index.mjs"));
}

const BASE = "http://localhost:3000";
const OUT = "/workspace/marketing/ads/ui-captures";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

async function shot(page, name) {
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    fullPage: false,
  });
  console.log("saved", name);
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await desktop.newPage();

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await shot(page, "01-landing-renter");
await page.getByRole("button", { name: "Landlord / Manager" }).click();
await shot(page, "02-landing-landlord");

await page.goto(`${BASE}/listings`, { waitUntil: "networkidle" });
await shot(page, "03-listings");

await page.goto(`${BASE}/credit-check`, { waitUntil: "networkidle" });
await page.getByPlaceholder("Full legal name").fill("Maya Chen");
await page.getByPlaceholder("Your email").fill("maya.chen@example.com");
await page.getByPlaceholder("Phone number").fill("5035550142");
await page.getByPlaceholder("Street address").fill("88 Hawthorne Blvd Apt 4");
await page.getByPlaceholder("City").fill("Portland");
await page.getByPlaceholder("State").fill("OR");
await page.getByPlaceholder("ZIP code").fill("97214");
await page.locator('input[type="date"]').fill("1996-04-12");
await page.getByPlaceholder("SSN last 4").fill("0000");
await page.getByRole("checkbox").check();
await shot(page, "04-credit-check");

await page.getByRole("button", { name: "Continue to secure payment" }).click();
await shot(page, "05-credit-check-pay");

await page.goto(`${BASE}/credit-check/success?source=mock&payment_id=pay_demo_harborline`, {
  waitUntil: "networkidle",
});
await shot(page, "06-credit-check-success");

await page.goto(`${BASE}/rental-application`, { waitUntil: "networkidle" });
await page.getByPlaceholder("Property title (example: Pineview Apartments)").fill(
  "Harborline Flats 2B",
);
await page.getByPlaceholder("Property address").fill("1842 Willow Ave, Portland, OR 97214");
await page.getByPlaceholder("Application fee (USD)").fill("35");
await page
  .getByPlaceholder("Optional requirements (income rules, move-in timing, compliance notes)")
  .fill("Soft credit check on Verdansc. Income 2.5x rent.");
await shot(page, "07-landlord-intake");

await page.goto(`${BASE}/apply/lst_5ebpk0fn`, { waitUntil: "networkidle" });
await page.getByPlaceholder("Full legal name").fill("Maya Chen");
await page.getByPlaceholder("Email").fill("maya.chen@example.com");
await page.getByPlaceholder("Phone number").fill("5035550142");
await page.getByPlaceholder("Occupants").fill("1");
await page.getByPlaceholder("Monthly gross income (optional)").fill("6200");
await page
  .getByPlaceholder("Notes for the landlord (optional)")
  .fill("Move-in Oct 1. Credit check already completed on Verdansc.");
await shot(page, "08-rental-application");

await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
await shot(page, "09-pricing");

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mpage = await mobile.newPage();
await mpage.goto(`${BASE}/listings`, { waitUntil: "networkidle" });
await shot(mpage, "10-listings-mobile");
await mpage.goto(`${BASE}/credit-check`, { waitUntil: "networkidle" });
await shot(mpage, "11-credit-check-mobile");
await mpage.goto(`${BASE}/apply/lst_5ebpk0fn`, { waitUntil: "networkidle" });
await shot(mpage, "12-apply-mobile");
await mpage.goto(`${BASE}/rental-application`, { waitUntil: "networkidle" });
await shot(mpage, "13-intake-mobile");

await browser.close();
console.log("captures complete");
