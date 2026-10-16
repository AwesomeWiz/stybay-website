import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
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
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
try {
  for (const route of ["/", "/about", "/technology"]) {
    for (const width of [1440, 1024, 430, 390, 360]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        (
          await page.goto(`http://localhost:3000${route}`, {
            waitUntil: "networkidle",
          })
        ).status(),
        200,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} ${width} overflow`,
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
          .evaluateAll((imgs) => imgs.filter((i) => !i.naturalWidth).length),
        0,
        "All images load",
      );
      await page.screenshot({
        path: `.qa/refined-${route.slice(1) || "home"}-${width}.png`,
        fullPage: true,
      });
      if (route === "/technology") {
        const mobile = width <= 700;
        assert.equal(
          await page.locator(".constellation-item:visible").count(),
          mobile ? 12 : 24,
        );
        assert.equal(
          await page.locator(".taste-product:visible").count(),
          mobile ? 6 : 8,
        );
        assert.equal(
          await page
            .locator(
              ".technology-page .phone,.technology-page .intent,.technology-page .mood-selector",
            )
            .count(),
          0,
          "Technology has its own interaction language",
        );
        if (width === 1440 || width === 390) {
          const a11y = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
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
        const slider = page.getByRole("slider", {
          name: "Minimal to Expressive",
        });
        await page.locator(".taste-lab").scrollIntoViewIfNeeded();
        await page.evaluate(() => {
          window.qaTasteNodes = [
            ...document.querySelectorAll(".taste-product"),
          ];
        });
        await slider.focus();
        await slider.press("End");
        assert.equal(await slider.inputValue(), "4");
        assert.equal(
          await slider.getAttribute("aria-valuetext"),
          "Expressive focus",
        );
        await page
          .getByRole("slider", { name: "Neutral to Colourful" })
          .fill("4");
        await page.screenshot({ path: `.qa/taste-expressive-${width}.png` });
        assert.ok(
          await page
            .locator(".taste-product:visible img")
            .evaluateAll((imgs) =>
              imgs.some((i) => /product(23|41|48|51|53)\.webp/.test(i.src)),
            ),
          "Colourful expressive edit includes a visibly patterned dress",
        );
        assert.equal(
          await page.evaluate(() =>
            window.qaTasteNodes.every(
              (node, i) =>
                node === document.querySelectorAll(".taste-product")[i],
            ),
          ),
          true,
          "Slider changes preserve mounted image nodes",
        );
        await slider.press("Home");
        assert.equal(await slider.inputValue(), "0");
        await page
          .getByRole("button", { name: "Read the visual details" })
          .click();
        assert.equal(await page.locator(".dna-attributes").isVisible(), true);
        await page.getByRole("button", { name: /A bolder direction/ }).click();
        assert.match(
          await page.locator(".dna-relationship").innerText(),
          /asymmetric red/,
        );
        const bold = page.getByRole("button", { name: "Bold", exact: true });
        await bold.focus();
        await bold.press("Enter");
        assert.equal(await bold.getAttribute("aria-pressed"), "true");
        assert.equal(
          await page
            .locator('.constellation-item:has(img[src*="product60.webp"])')
            .evaluate((el) => getComputedStyle(el).opacity),
          "1",
        );
        assert.equal(
          await page
            .locator('.constellation-item:has(img[src*="product27.webp"])')
            .evaluate((el) => getComputedStyle(el).opacity),
          "0.2",
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          "No interactive overflow",
        );
        await page.screenshot({ path: `.qa/constellation-bold-${width}.png` });
      }
    }
  }
  // Every local navigation target and hash must resolve in the exported site.
  for (const route of [
    "/",
    "/about",
    "/technology",
    "/contact",
    "/privacy-policy",
    "/terms",
  ]) {
    await page.goto(`http://localhost:3000${route}`);
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((links) => [
        ...new Set(
          links
            .map((a) => a.getAttribute("href"))
            .filter((h) => h.startsWith("/") || h.startsWith("#")),
        ),
      ])) {
      const url = new URL(href, page.url());
      assert.equal(
        (await context.request.get(url.href.split("#")[0])).status(),
        200,
        href,
      );
      if (url.pathname === route && url.hash)
        assert.ok(
          await page.locator(`[id="${url.hash.slice(1)}"]`).count(),
          href,
        );
    }
    for (const href of await page
      .locator('a[href*="tally.so"]')
      .evaluateAll((links) => links.map((a) => a.href)))
      assert.equal(href, "https://tally.so/r/0Qpg8P");
  }
  await page.goto("http://localhost:3000/");
  assert.equal(
    await page.locator(".waitlist-form").getAttribute("action"),
    "https://tally.so/r/0Qpg8P",
  );
  assert.equal(
    await page.locator(".waitlist-form").getAttribute("target"),
    "_blank",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3000/technology");
  await page.locator(".editorial-query").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator(".constellation").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Romantic", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: ".qa/technology-motion-constellation.png" });
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await page.waitForURL("**/about");
  assert.equal(await page.locator(".constellation,.pin-spacer").count(), 0);
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "Experience", exact: true })
    .click();
  await page.waitForURL("**/#experience");
  await page.waitForFunction(
    () => {
      const target = document.getElementById("experience");
      const top = target?.getBoundingClientRect().top;
      return (
        document.querySelector(".pin-spacer > .hero") && top >= 70 && top <= 110
      );
    },
    null,
    { timeout: 12000 },
  );
  assert.deepEqual(errors, []);
  await writeFile(
    ".qa/technology-report.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
  assert.equal(
    results.some((r) => r.violations.length),
    false,
    "Accessibility violations",
  );
  console.log(
    "Passed: affected routes at five widths, keyboard/touch controls, mounted image pools, links/Tally, motion cleanup.",
  );
} finally {
  await browser.close();
}
