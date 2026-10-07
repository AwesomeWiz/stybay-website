import { spawn } from "node:child_process";
import { chromium, expect } from "@playwright/test";
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: "3002" },
  windowsHide: true,
  stdio: "pipe",
});
let browser;
try {
  for (let i = 0; i < 30; i++) {
    try {
      if ((await fetch("http://localhost:3002")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Find whatfeels like you.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://stybay-fashion-discovery.stybayinfo.chatgpt.site",
  );
  await page.screenshot({ path: ".qa/production-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".qa/production-mobile-transform.png" });
  await page.locator(".personalization").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: ".qa/production-mobile-masonry.png" });
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  console.log(
    "PASS: static export renders, metadata is correct, desktop/mobile screenshot checks, no runtime errors or overflow.",
  );
} finally {
  await browser?.close();
  server.kill();
}
