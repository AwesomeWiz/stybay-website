import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const results = [];
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await expect(page.locator(".intro")).toHaveCSS("visibility", "visible");
await page.screenshot({ path: ".qa/intro.png" });
await expect(page.locator(".intro")).toHaveCSS("visibility", "hidden", {
  timeout: 5000,
});
results.push("First-visit intro resolves");
await page.reload({ waitUntil: "networkidle" });
await expect(page.locator(".intro")).toHaveCSS("visibility", "hidden");
results.push("Repeat visit skips intro");
await page.getByRole("link", { name: "How it works", exact: true }).click();
await page.waitForTimeout(1500);
await expect(page).toHaveURL(/#how-it-works$/);
results.push("Header anchor works");
for (let i = 0; i < 4; i++) {
  await page
    .locator("#step-" + i)
    .evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 180),
    );
  await page.waitForTimeout(1000);
  await expect(page.locator(".screen-layer").nth(i)).toHaveCSS("opacity", "1");
  await page.screenshot({ path: ".qa/chapter-" + i + ".png" });
}
results.push("All four phone chapters activate");
await page
  .getByRole("link", { name: "Get early access", exact: true })
  .first()
  .click();
await page.waitForTimeout(1500);
await expect(page).toHaveURL(/#early-access$/);
await expect(page.locator(".waitlist-pending")).toBeVisible();
results.push("Early access anchor and unconfigured state");
await page.locator(".intent").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: "Pause search animation" }).click();
const paused = await page.locator(".demo-query>span").innerText();
await page.waitForTimeout(1000);
expect(await page.locator(".demo-query>span").innerText()).toBe(paused);
results.push("Search animation pauses");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (const name of [
  "problem",
  "showcase",
  "personalization",
  "intent",
  "collections",
  "final-cta",
]) {
  await page
    .locator("." + name)
    .evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 85),
    );
  await page.waitForTimeout(700);
  await page.screenshot({ path: ".qa/mobile-" + name + ".png" });
}
await page.screenshot({ path: ".qa/mobile-full.png", fullPage: true });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload({ waitUntil: "networkidle" });
expect(await page.locator(".pin-spacer").count()).toBe(0);
expect(await page.locator(".mobile-phone:visible").count()).toBe(4);
results.push("Reduced-motion content stays complete");
console.log(results);
await writeFile(".qa/interactions.json", JSON.stringify(results, null, 2));
await browser.close();
