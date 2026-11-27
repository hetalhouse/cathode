#!/usr/bin/env node
// capture-workspace.mjs — the 3D Workspace tab (the demo's front door) as README / npm-page material:
//   docs/workspace-3d-overview.png  the day workspace, every panel in frame
//   docs/workspace-3d-zoom.png      zoomed in on the chart ("a panel fills the screen")
//   docs/workspace-3d-rotate.png    the camera most of the way round the wall (⟳ Rotate spins a full 360°): the charts that stand behind it in view
//   docs/workspace-3d-night.png     the same scene, Phosphor (the Theme drop-down)
//   docs/workspace-3d-zoom.gif (+ .mp4)  a zoom-out / zoom-in sweep, camera driven frame by frame (deterministic, not real time)
//
// Usage: npm run capture:workspace   (orchestrates vite via tools/capture-workspace.sh)

import { chromium } from "playwright";
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const URL = process.env.CATHODE_DEMO_URL || "http://localhost:5180";
const TMP = "/tmp/cathode-workspace-frames";
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync("docs", { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newContext({ viewport: { width: 1500, height: 940 }, deviceScaleFactor: 2 }).then((c) => c.newPage());
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForFunction(() => !!window.__ws3d, null, { timeout: 15_000 });
await page.evaluate(() => window.__ws3d.setTilt(0.62));   // a fixed reading (the demo's gauge idles back and forth)
await page.waitForTimeout(1500);

const shot = async (path) => { await page.waitForTimeout(250); await page.screenshot({ path }); };
const shrink = (src, dst, w) => { execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vf", `scale=${w}:-1:flags=lanczos`, dst]); rmSync(src, { force: true }); };
const pose = (kind, id) => page.evaluate(([k, i]) => { const s = window.__ws3d.stage; return k === "frame" ? s.framePose(undefined, { margin: 0.06 }) : s.facingPose(i, { margin: 0.05 }); }, [kind, id]);
const setPose = (p) => page.evaluate((x) => window.__ws3d.stage.setCameraPose(x), p);
const snap = (name, w) => shot(`${TMP}/${name}.png`).then(() => shrink(`${TMP}/${name}.png`, `docs/${name}.png`, w));

// ── stills ──────────────────────────────────────────────────────────────────────
await page.evaluate(() => window.__ws3d.setCaption(""));
await snap("workspace-3d-overview", 1800);
// the camera most of the way round the wall (⟳ Rotate spins a full 360°): from behind, where the chart tiles that stand behind the wall are in view — set through the same pose maths the spin uses
await page.evaluate(() => { const w = window.__ws3d, st = w.stage; window.__home = st.getCameraPose(); st.setCameraPose(w.poseAt(window.__home, (215 * Math.PI) / 180)); });
await page.waitForTimeout(900);
await snap("workspace-3d-rotate", 1800);
await page.evaluate(() => window.__ws3d.stage.setCameraPose(window.__home));
await page.waitForTimeout(700);
await page.waitForTimeout(1200);
const candle = await pose("face", "candle");
await setPose(candle);
await page.evaluate(() => window.__ws3d.setCaption("Zoom in — a panel fills the screen"));
await snap("workspace-3d-zoom", 1800);
await page.evaluate(() => window.__ws3d.setCaption(""));
await setPose(await pose("frame"));
await page.locator(".demo-bar select").first().selectOption("phosphor");   // the look is the page's Theme drop-down
await page.waitForTimeout(900);
await page.evaluate(() => window.__ws3d.setTilt(0.62));   // (switching the look rebuilds the scene — and restarts the gauge's idle swing)
await snap("workspace-3d-night", 1800);
await page.locator(".demo-bar select").first().selectOption("paper");
await page.waitForTimeout(900);
await page.evaluate(() => window.__ws3d.setTilt(0.62));

// ── the sweep: out → in on the grid → out → in on the chart → out, eased, one frame per step ─────────────────────
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const stops = [
  { id: null, hold: 6, text: "Zoom out — the whole workspace" },
  { id: "trades", hold: 5, text: "Zoom in — a panel fills the screen" },
  { id: null, hold: 4, text: "Zoom out" },
  { id: "candle", hold: 5, text: "Zoom in — on the chart" },
  { id: null, hold: 6, text: "Zoom out — everything in frame" },
];
let n = 0;
const frame = async () => { await page.waitForTimeout(70); await page.screenshot({ path: `${TMP}/f${String(n++).padStart(3, "0")}.png`, clip: await page.evaluate(() => { const r = document.querySelector(".stage-tab").getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }) }); };
const poseOf = async (stop) => (stop.id ? pose("face", stop.id) : pose("frame"));
let cur = await poseOf(stops[0]);
await setPose(cur);
for (let si = 0; si < stops.length; si++) {
  const stop = stops[si];
  const target = await poseOf(stop);
  await page.evaluate((t) => window.__ws3d.setCaption(t), stop.text);
  if (si > 0) for (let k = 1; k <= 14; k++) { const t = ease(k / 14); await setPose({ position: lerp(cur.position, target.position, t), target: lerp(cur.target, target.target, t) }); await frame(); }
  for (let h = 0; h < stop.hold; h++) await frame();
  cur = target;
}
await browser.close();

console.log(`captured ${n} frames — encoding …`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "10", "-i", `${TMP}/f%03d.png`, "-vf", "scale=1200:-2", "-pix_fmt", "yuv420p", "docs/workspace-3d-zoom.mp4"], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "10", "-i", `${TMP}/f%03d.png`, "-vf", "scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle", "-loop", "0", "docs/workspace-3d-zoom.gif"], { stdio: "inherit" });
if (!process.env.CATHODE_KEEP_FRAMES) rmSync(TMP, { recursive: true, force: true });
console.log("Done: docs/workspace-3d-{overview,zoom,night}.png + docs/workspace-3d-zoom.gif/.mp4");
