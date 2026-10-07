import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "--port", "3001"],
  {
    env: {
      ...process.env,
      STYBAY_TEST_BUILD: "1",
      NEXT_PUBLIC_WAITLIST_ENDPOINT: "https://waitlist.test/signup",
    },
    windowsHide: true,
    stdio: "pipe",
  },
);
server.stderr.on("data", (b) => process.stderr.write(b));
let browser;
try {
  for (let n = 0; n < 60; n++) {
    try {
      const r = await fetch("http://localhost:3001");
      if (r.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: "reduce" });
  let fail = true,
    requests = 0,
    body;
  await page.route("https://waitlist.test/signup", async (route) => {
    requests++;
    body = route.request().postDataJSON();
    await route.fulfill({
      status: fail ? 503 : 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: !fail }),
    });
  });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.getByLabel("Email address", { exact: true }).fill("not-an-email");
  await page
    .getByRole("button", { name: "Get early access", exact: true })
    .click();
  expect(requests).toBe(0);
  await page
    .getByLabel("Email address", { exact: true })
    .fill("preview@example.com");
  await page
    .getByRole("button", { name: "Get early access", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "We couldn’t add you right now. Please try again.",
  );
  fail = false;
  await page
    .getByRole("button", { name: "Get early access", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "You’re on the list. We’ll be in touch.",
  );
  expect(body).toEqual({
    email: "preview@example.com",
    source: "stybay-website",
  });
  await expect(
    page.getByRole("button", { name: "You’re on the list", exact: true }),
  ).toBeDisabled();
  console.log(
    "PASS: invalid email blocked; server failure shown; mocked success only after 201; request payload and duplicate prevention verified. No signup was sent externally.",
  );
} finally {
  await browser?.close();
  server.kill();
}
