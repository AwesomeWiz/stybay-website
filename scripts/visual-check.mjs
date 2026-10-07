import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const results = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2800);
await page.screenshot({ path: ".qa/desktop-hero.png" });
for (const selector of [
  ".problem",
  ".showcase",
  ".personalization",
  ".intent",
  ".collections",
  ".final-cta",
]) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: ".qa/" + selector.slice(1) + ".png" });
}
await page.getByRole("button", { name: "After dark", exact: true }).click();
await page.waitForTimeout(650);
results.push({
  moodSelected: await page
    .getByRole("button", { name: "After dark", exact: true })
    .getAttribute("aria-pressed"),
});
await page
  .getByRole("button", { name: "minimal outfit for dinner", exact: true })
  .click();
results.push({
  querySelected: await page
    .getByRole("button", { name: "minimal outfit for dinner", exact: true })
    .getAttribute("aria-pressed"),
});
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(1300);
await page.screenshot({ path: ".qa/hero-transformed.png" });
for (const width of [1440, 1280, 1024, 768, 430, 390, 360]) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: ".qa/hero-" + width + ".png" });
  results.push({
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    h1: await page.locator("h1").isVisible(),
  });
}
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({ path: ".qa/reduced-mobile.png", fullPage: true });
results.push({ reducedPinCount: await page.locator(".pin-spacer").count() });
await page.locator(".final-cta").scrollIntoViewIfNeeded();
results.push({ waitlist: await page.locator(".waitlist-pending").innerText() });
await writeFile(
  ".qa/results.json",
  JSON.stringify({ errors, results }, null, 2),
);
console.log(JSON.stringify({ errors, results }, null, 2));
await browser.close();
