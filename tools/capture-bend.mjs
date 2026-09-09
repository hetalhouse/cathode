#!/usr/bin/env node
// capture-bend.mjs — drive the demo's Curve slider through the full SIGNED range
// (+45 convex → 0 flat → −45 concave) on the Grid tab and assemble the frames
// into docs/bend.gif (+ bend.mp4) with ffmpeg. The onboarding shot for the
// signed-curvature feature: one sweep says everything.
//
// Usage: npm run capture:bend   (orchestrates vite via tools/capture-bend.sh)

import { chromium } from "playwright";
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const URL = process.env.CATHODE_DEMO_URL || "http://localhost:5180";
const TMP = "/tmp/cathode-bend-frames";
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync("docs", { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newContext({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 2 }).then((c) => c.newPage());
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector(".demo-bar", { timeout: 10_000 });
await page.locator(".demo-bar select").first().selectOption("phosphor");
await page.getByRole("button", { name: /^Grid$/ }).click();
await page.waitForTimeout(1200);

const slider = page.locator('input[type=range]').first();
// sweep: hold convex, glide to concave, hold concave
const steps = [];
for (let i = 0; i < 6; i++) steps.push(45);
for (let v = 45; v >= -45; v -= 3) steps.push(v);
for (let i = 0; i < 10; i++) steps.push(-45);

let n = 0;
for (const v of steps) {
  await slider.fill(String(v));
  await page.waitForTimeout(90);
  await page.screenshot({ path: `${TMP}/f${String(n++).padStart(3, "0")}.png` });
}
await browser.close();

console.log(`captured ${n} frames — encoding …`);
execFileSync("ffmpeg", ["-y", "-framerate", "10", "-i", `${TMP}/f%03d.png`, "-vf", "scale=1100:-1", "-pix_fmt", "yuv420p", "docs/bend.mp4"], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-framerate", "10", "-i", `${TMP}/f%03d.png`, "-vf", "scale=880:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer", "docs/bend.gif"], { stdio: "inherit" });
rmSync(TMP, { recursive: true, force: true });
console.log("Done: docs/bend.gif + docs/bend.mp4");
