import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir(".qa", { recursive: true });
const display = JSON.parse(await readFile("lib/productDisplay.json", "utf8"));
const hash = (buffer) =>
  createHash("sha256").update(buffer).digest("hex").slice(0, 12);
for (let id = 1; id <= 60; id++) {
  const buffer = await readFile(`public/assets/optimized/product${id}.webp`);
  assert.equal(hash(buffer), display.revisions[id]);
  const { data, info } = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 480);
  assert.equal(info.height, 720);
  for (const corner of [
    0,
    info.width - 1,
    (info.height - 1) * info.width,
    info.height * info.width - 1,
  ]) {
    [240, 239, 235].forEach((expected, c) =>
      assert.ok(
        Math.abs(data[corner * 3 + c] - expected) <= 3,
        `Product ${id} has uniform warm canvas`,
      ),
    );
  }
}
for (const id of [48, 56])
  assert.equal(
    hash(await readFile(`public/assets/products/product${id}.jpg`)),
    display.sourceRevisions[id],
  );
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [],
  results = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
try {
  for (const route of ["/", "/about", "/technology", "/contact"])
    for (const width of [1440, 1024, 430, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        (
          await page.goto(`http://localhost:3000${route}`, {
            waitUntil: "networkidle",
          })
        ).status(),
        200,
      );
      await page.evaluate(async () => {
        for (const i of document.images) {
          i.loading = "eager";
          await i.decode().catch(() => {});
        }
      });
      const issues = await page
        .locator(".product-frame:visible")
        .evaluateAll((frames) =>
          frames.flatMap((frame) => {
            const css = getComputedStyle(frame),
              img = frame.querySelector("img"),
              imageCss = getComputedStyle(img),
              issues = [];
            if (css.overflow !== "hidden" || css.borderRadius !== "8px")
              issues.push("clip/radius");
            if (css.backgroundColor !== "rgb(240, 239, 235)")
              issues.push("canvas");
            if (
              imageCss.objectFit !== "contain" ||
              imageCss.mixBlendMode !== "normal"
            )
              issues.push("fit/blend");
            if (
              !img.naturalWidth ||
              img.naturalWidth !== 480 ||
              img.naturalHeight !== 720
            )
              issues.push("dimensions");
            if (
              Math.abs(img.offsetWidth - frame.clientWidth) > 1 ||
              Math.abs(img.offsetHeight - frame.clientHeight) > 1
            )
              issues.push("image escaped frame");
            return issues.length
              ? [{ id: frame.dataset.productId, issues }]
              : [];
          }),
        );
      assert.deepEqual(issues, [], `${route} ${width} product frames`);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} ${width} overflow`,
      );
      if (route === "/")
        assert.equal(
          await page
            .locator(".final-strip")
            .evaluate((strip) =>
              [...strip.children].every(
                (frame) =>
                  frame.getBoundingClientRect().bottom <=
                  strip.getBoundingClientRect().bottom + 1,
              ),
            ),
          true,
          "Final strip preserves bottom corner radii",
        );
      if (route === "/technology")
        for (const id of [48, 56])
          assert.ok(
            (
              await page
                .locator(`[data-product-id="${id}"] img`)
                .first()
                .getAttribute("src")
            ).includes(`?v=${display.revisions[id]}`),
          );
      await page.screenshot({
        path: `.qa/frames-${route.slice(1) || "home"}-${width}.png`,
        fullPage: true,
      });
      if (route === "/technology" && (width === 1440 || width === 390)) {
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        results.push({
          route,
          width,
          violations: axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      }
    }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3000/technology", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(950);
  assert.equal(
    await page
      .locator(".taste-product.is-in-edit>.product-frame")
      .evaluateAll((frames) =>
        frames.every((frame) => Number(getComputedStyle(frame).opacity) < 1),
      ),
    true,
    "Product entry is armed before scrolling into the study",
  );
  assert.equal(
    await page.locator(".pin-spacer").count(),
    0,
    "Technology adds no pins",
  );
  await page.locator(".taste-board").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  assert.equal(
    await page
      .locator(".taste-product.is-in-edit>.product-frame")
      .evaluateAll((frames) =>
        frames.every((f) => Number(getComputedStyle(f).opacity) === 1),
      ),
    true,
  );
  await page.locator(".dna-directions").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  await page.getByRole("button", { name: /A warmer palette/ }).click();
  await page.locator(".constellation").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Romantic", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: ".qa/technology-refined-motion.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".constellation-item>.product-frame")
      .evaluateAll((frames) =>
        frames.every((f) => Number(getComputedStyle(f).opacity) === 1),
      ),
    true,
    "Reduced motion restores every frame",
  );
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await page.waitForURL("**/about");
  assert.equal(await page.locator(".constellation,.pin-spacer").count(), 0);
  assert.deepEqual(errors, []);
  await writeFile(
    ".qa/imagery-report.json",
    JSON.stringify(
      { results, errors, normalizedProducts: 60, updatedSources: [48, 56] },
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
    "Passed: 60 normalized assets; four pages/four widths; frames, corners, updated sources, reduced motion and animation cleanup.",
  );
} finally {
  await browser.close();
}
