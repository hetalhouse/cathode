import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * The demo's front door: the 3D WORKSPACE tab — five live panels hung in one three.js scene, in the DAY (paper) theme, with the camera as the interface: scroll to zoom, Overview to zoom the
 * whole workspace out until everything is in frame, □ to expand a panel (and back), ▶ Tour to play it. (page.evaluate callbacks run in the page.)
 */
async function open(page: Page, q = '') {
  await page.setViewportSize({ width: 1500, height: 900 });
  await page.goto('/' + q);
  await page.waitForFunction(() => !!(window as any).__ws3d);
  await page.waitForTimeout(1200);
}
/** the panels' on-screen extents as fractions of the stage canvas (body + bar corners): within [0, 1] = in frame */
const extents = (page: Page) => page.evaluate(() => { const st = (window as any).__ws3d.stage; st.camera.updateMatrixWorld(true); st.camera.updateProjectionMatrix();
  const out: Record<string, { minX: number; maxX: number; minY: number; maxY: number }> = {};
  for (const [id, p] of st.panels) { p.group.updateWorldMatrix(true, true); const ppu = st.pxPerUnit, w = p.content.width / ppu, bh = p.content.height / ppu, bar = 26 / ppu;
    let a = { minX: 9, maxX: -9, minY: 9, maxY: -9 };
    for (const [cx, cy] of [[-w / 2, -bh / 2], [w / 2, -bh / 2], [-w / 2, bh / 2 + bar], [w / 2, bh / 2 + bar]]) { const v = p.body.localToWorld(new p.group.position.constructor(cx, cy, 0)); v.project(st.camera);
      a = { minX: Math.min(a.minX, (v.x + 1) / 2), maxX: Math.max(a.maxX, (v.x + 1) / 2), minY: Math.min(a.minY, (1 - v.y) / 2), maxY: Math.max(a.maxY, (1 - v.y) / 2) }; }
    out[id] = a; } return out; });
/** how far the camera is from the (z = 0) layout plane — the zoom level (getCameraPose's target is only a look-at point one unit ahead) */
const dist = (page: Page) => page.evaluate(() => Math.abs((window as any).__ws3d.stage.camera.position.z));
const settle = async (page: Page) => { let prev = await dist(page); for (let i = 0; i < 30; i++) { await page.waitForTimeout(150); const d = await dist(page); if (Math.abs(d - prev) < 1e-4) break; prev = d; } };
const allIn = (e: Awaited<ReturnType<typeof extents>>) => Object.values(e).every((c) => c.minX >= -0.01 && c.maxX <= 1.01 && c.minY >= -0.01 && c.maxY <= 1.01);

test.describe('demo: the 3D Workspace tab', () => {
  test('it is the front door, in the DAY theme: five panels in one scene, the page chrome light, the whole workspace in frame', async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', (e) => errors.push(String(e)));
    await open(page);
    await expect(page.locator('.tab-btn.active')).toHaveText(/3D Workspace/);
    await expect(page.locator('.demo-shell')).toHaveClass(/cathode-light/);                      // paper = the day theme, page chrome included
    await expect(page.locator('[data-testid="ws3d"]')).toHaveClass(/day/);
    expect(await page.evaluate(() => [...(window as any).__ws3d.stage.panels.keys()].sort())).toEqual(['candle', 'log', 'tilt', 'trades', 'wall']);
    expect(allIn(await extents(page)), 'the start view frames every panel').toBe(true);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.barStyle)).toBe('cockpit');
    expect(errors).toEqual([]);
  });

  test('zoom in and out: the wheel zooms the camera; Overview zooms back out until EVERY panel is in frame; Recenter goes home', async ({ page }) => {
    await open(page);
    await settle(page);
    const home = await dist(page);
    // scroll over empty scene → the camera dollies in
    await page.mouse.move(750, 470);                                                              // (the gap between the panel rows)
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -240); await page.waitForTimeout(60); }
    await settle(page);
    const zoomed = await dist(page);
    expect(zoomed, 'the wheel zoomed IN').toBeLessThan(home * 0.8);
    expect(allIn(await extents(page)), 'zoomed in, not everything is in frame').toBe(false);
    await page.getByRole('button', { name: 'Overview' }).click();
    await page.waitForTimeout(1100); await settle(page);
    expect(allIn(await extents(page)), 'Overview: every panel is in frame again').toBe(true);
    expect(await dist(page)).toBeGreaterThan(zoomed);
    // zoom in again, then Recenter
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -240); await page.waitForTimeout(60); }
    await settle(page);
    await page.getByRole('button', { name: 'Recenter' }).click();
    await page.waitForTimeout(1100); await settle(page);
    expect(Math.abs((await dist(page)) - home) / home, 'back at the start distance').toBeLessThan(0.02);
  });

  test('□ expands a panel (the camera flies in until it fills the view) and restores (flies back out); double-click a title bar faces it', async ({ page }) => {
    await open(page);
    await settle(page);
    const home = await dist(page);
    const c = await page.evaluate(() => (window as any).__ws3d.stage.clientPointForControl('candle', 'maximize'));
    await page.mouse.click(c.x, c.y);
    await page.waitForTimeout(1000); await settle(page);
    const e = (await extents(page)).candle;
    expect(e.maxX - e.minX, 'the expanded panel fills the width').toBeGreaterThan(0.9);
    expect(await dist(page)).toBeLessThan(home * 0.6);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.panels.get('candle').maximized)).toBe(true);
    const c2 = await page.evaluate(() => (window as any).__ws3d.stage.clientPointForControl('candle', 'maximize'));
    await page.mouse.click(c2.x, c2.y);
    await page.waitForTimeout(1000); await settle(page);
    expect(Math.abs((await dist(page)) - home) / home, 'restored: back where the camera was').toBeLessThan(0.03);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.panels.get('candle').maximized)).toBe(false);
  });

  test('▶ Tour zooms in and out by itself, captioning each step, and ■ Stop ends it', async ({ page }) => {
    await open(page);
    await settle(page);
    const home = await dist(page);
    await page.getByRole('button', { name: '▶ Tour' }).click();
    await expect(page.locator('.ws3d-caption')).toContainText('Zoom out', { timeout: 4000 });
    await expect(page.locator('.ws3d-caption')).toContainText('Zoom in', { timeout: 6000 });
    await page.waitForTimeout(500); await settle(page);
    expect(await dist(page), 'the tour zoomed IN on a panel').toBeLessThan(home * 0.7);
    await page.getByRole('button', { name: '■ Stop' }).click();
    await expect(page.locator('.ws3d-caption')).toHaveCount(0);
    await expect(page.getByRole('button', { name: '▶ Tour' })).toBeVisible();
  });

  test('Night re-dresses the same scene (dark chrome, dark bars) keeping the camera; leaving the tab restores the theme; ⓘ explains a panel', async ({ page }) => {
    await open(page);
    // zoom in a little so there is a camera pose to keep
    await page.evaluate(() => { const w = (window as any).__ws3d; return w.stage.flyTo(w.stage.facingPose('trades', { margin: 0.2 }), 0); });
    await page.waitForTimeout(300);
    const pose = await page.evaluate(() => (window as any).__ws3d.stage.getCameraPose());
    await page.getByRole('button', { name: '☾ Night' }).click();
    await page.waitForTimeout(900);
    await expect(page.locator('.demo-shell')).not.toHaveClass(/cathode-light/);
    await expect(page.locator('[data-testid="ws3d"]')).toHaveClass(/night/);
    const pose2 = await page.evaluate(() => (window as any).__ws3d.stage.getCameraPose());
    pose.position.forEach((v: number, i: number) => expect(pose2.position[i]).toBeCloseTo(v, 1));
    expect(await page.evaluate(() => (window as any).__ws3d.stage.barColors.bg), 'the default (night) bar').toBe('#08130e');
    // back to day, then the ⓘ
    await page.getByRole('button', { name: '☀ Day' }).click();
    await page.waitForTimeout(900);
    await expect(page.locator('.demo-shell')).toHaveClass(/cathode-light/);
    await page.evaluate(() => { const w = (window as any).__ws3d; return w.stage.flyTo(w.stage.framePose(), 0); });
    await page.waitForTimeout(300);
    const i = await page.evaluate(() => (window as any).__ws3d.stage.clientPointForControl('wall', 'info'));
    await page.mouse.click(i.x, i.y);
    await expect(page.locator('.ws3d-caption')).toContainText('mini charts');
    // leaving the tab puts the page theme back (it was the default dark before)
    await page.getByRole('button', { name: 'GRID' }).click();
    await expect(page.locator('.demo-shell')).not.toHaveClass(/cathode-light/);
  });
});
