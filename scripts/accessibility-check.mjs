import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
const results = [];
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({
    width,
    violations: r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
}
console.log(JSON.stringify(results, null, 2));
await writeFile(".qa/accessibility.json", JSON.stringify(results, null, 2));
await browser.close();
if (results.some((r) => r.violations.length)) process.exitCode = 1;
