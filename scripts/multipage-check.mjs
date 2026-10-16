import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [],
  results = [];
page.on("pageerror", (error) => errors.push(error.message));
const normalize = (text) => text.replace(/\s+/g, " ").trim();
try {
  for (const route of [
    "/",
    "/about",
    "/technology",
    "/contact",
    "/privacy-policy",
    "/terms",
  ]) {
    for (const width of [1440, 1024, 430, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto("http://localhost:3000" + route, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        "https://stybay.com" + (route === "/" ? "" : route),
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} ${width} overflow`,
      );
      assert.equal(
        await page.locator('.site-footer a[href="/privacy-policy"]').count(),
        1,
      );
      assert.equal(
        await page.locator('.site-footer a[href="/terms"]').count(),
        1,
      );
      await page.evaluate(async () => {
        for (const img of document.images) {
          img.loading = "eager";
          await img.decode().catch(() => {});
        }
      });
      assert.equal(
        await page
          .locator("img")
          .evaluateAll(
            (imgs) => imgs.filter((i) => !i.complete || !i.naturalWidth).length,
          ),
        0,
      );
      await page.screenshot({
        path: `.qa/multipage-${route.slice(1) || "home"}-${width}.png`,
        fullPage: true,
      });
      const a11y =
        width === 1440 || width === 390
          ? await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze()
          : { violations: [] };
      results.push({
        route,
        width,
        violations: a11y.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
    }
    if (route === "/privacy-policy" || route === "/terms") {
      const source = await readFile(`content/legal${route}.md`, "utf8");
      const rendered = await page
        .locator(
          ".legal-heading h1,.legal-dates p,.legal-body p,.legal-body h2,.legal-body h3,.legal-body li",
        )
        .allTextContents();
      assert.equal(
        normalize(rendered.join(" ")),
        normalize(source.replace(/^- /gm, "")),
        `${route} verbatim legal text`,
      );
    }
  }
  await page.goto("http://localhost:3000/about");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Menu" })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.getByRole("button", { name: "Menu" }).click();
  await page
    .locator(".mobile-navigation")
    .getByRole("link", { name: "Technology", exact: true })
    .click();
  await page.waitForURL("**/technology");
  await page.reload({ waitUntil: "networkidle" });
  await page.goBack();
  await page.waitForURL("**/about");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(7000);
  assert.ok(
    (await page.locator(".pin-spacer").count()) > 0,
    "Homepage pins initialize",
  );
  await page.screenshot({ path: ".qa/multipage-home-motion.png" });
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await page.waitForURL("**/about");
  assert.equal(
    await page.locator(".pin-spacer").count(),
    0,
    "Homepage pins cleaned up",
  );
  await page
    .locator(".header")
    .getByRole("link", { name: "StyBay home", exact: true })
    .click();
  await page.waitForURL("http://localhost:3000/");
  await page.waitForTimeout(2500);
  assert.ok(
    (await page.locator(".pin-spacer").count()) > 0,
    "Homepage pins initialize after return",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    ".qa/multipage-report.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(
    JSON.stringify(
      results.filter((r) => r.violations.length),
      null,
      2,
    ),
  );
  assert.equal(
    results.some((r) => r.violations.length),
    false,
    "Accessibility violations",
  );
  console.log(
    "Passed: 24 responsive route checks, exact legal copy, navigation, motion lifecycle.",
  );
} finally {
  await browser.close();
}
