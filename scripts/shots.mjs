import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";

const targets = [
  { name: "home", url: "/", full: true },
  { name: "demarrer", url: "/demarrer", full: true },
];

const viewports = [
  { tag: "desktop", width: 1440, height: 900 },
  { tag: "mobile", width: 390, height: 844 },
];

// WSL2: chrome-headless-shell segfaults; use the full chromium build instead.
const FULL_CHROME =
  process.env.HOME +
  "/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome";
const browser = await chromium.launch({
  executablePath: FULL_CHROME,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const t of targets) {
    await page.goto(BASE + t.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const file = `${OUT}/${t.name}-${vp.tag}.png`;
    await page.screenshot({
      path: file,
      fullPage: t.full,
      animations: "disabled",
      timeout: 60000,
    });
    console.log("✓", file);
  }
  await ctx.close();
}

// Form: walk a couple of steps on desktop
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(BASE + "/demarrer", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
// trigger validation by clicking continue empty
await page.getByRole("button", { name: /Continuer/i }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/form-validation.png`, animations: "disabled", timeout: 60000 });
console.log("✓ form-validation");
await ctx.close();

await browser.close();
console.log("done");
