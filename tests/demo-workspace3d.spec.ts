import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * The demo's front door: the 3D WORKSPACE tab — five live panels hung in one three.js scene above a floor grid, opening in the DAY (paper) theme and following the page's THEME drop-down, with the
 * camera as the interface: scroll to zoom, Overview to zoom the whole workspace out until everything is in frame, □ to expand a panel (and back), ▶ Tour to play it. (page.evaluate callbacks run in the page.)
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
    await expect(page.locator('[data-testid="ws3d"]')).toHaveClass(/t-paper/);
    expect(await page.evaluate(() => [...(window as any).__ws3d.stage.panels.keys()].sort())).toEqual(['candle', 'log', 'tilt', 'trades', 'wall']);
    expect(allIn(await extents(page)), 'the start view frames every panel').toBe(true);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.barStyle)).toBe('cockpit');
    // the look is the Theme drop-down's — there are no separate Day / Night buttons
    await expect(page.locator('.demo-bar select').first()).toHaveValue('paper');
    await expect(page.getByRole('button', { name: /Night|Day/ })).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('zoom in and out: the wheel zooms the camera; Overview zooms back out until EVERY panel is in frame; Recenter goes home', async ({ page }) => {
    await open(page);
    await settle(page);
    const home = await dist(page);
    // scroll over empty scene → the camera dollies in
    await page.mouse.move(750, 800);                                                              // (open floor, under the workspace: a wheel over a panel scrolls ITS content instead)
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

  test('the Theme drop-down re-dresses the scene live — panels, title bars, Display menu, backdrop, floor — keeping the camera; leaving the tab keeps the theme; ⓘ opens a pop-up', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { const w = (window as any).__ws3d; return w.stage.flyTo(w.stage.facingPose('trades', { margin: 0.2 }), 0); });   // zoom in a little so there is a camera pose to keep
    await page.waitForTimeout(300);
    const pose = await page.evaluate(() => (window as any).__ws3d.stage.getCameraPose());
    const sel = page.locator('.demo-bar select').first();
    const bar = () => page.evaluate(() => (window as any).__ws3d.stage.barColors.bg as string);
    const floorColor = () => page.evaluate(() => '#' + (window as any).__ws3d.floor.material.uniforms.uColor.value.getHexString());
    expect(await bar()).toBe('#e6edf6');
    const paperFloor = await floorColor();
    await sel.selectOption('phosphor');
    await page.waitForTimeout(900);
    await expect(page.locator('.demo-shell')).not.toHaveClass(/cathode-light/);
    await expect(page.locator('[data-testid="ws3d"]')).toHaveClass(/t-phosphor/);
    expect(await bar(), 'the stage default bar').toBe('#08130e');
    expect(await floorColor(), 'the floor wears the theme').not.toBe(paperFloor);
    const pose2 = await page.evaluate(() => (window as any).__ws3d.stage.getCameraPose());
    pose.position.forEach((v: number, i: number) => expect(pose2.position[i]).toBeCloseTo(v, 1));   // the camera did not move
    await sel.selectOption('amber');
    await page.waitForTimeout(900);
    expect(await bar()).toBe('#1a1205');
    await sel.selectOption('none');
    await page.waitForTimeout(900);
    expect(await bar()).toBe('#12122a');
    await sel.selectOption('paper');
    await page.waitForTimeout(900);
    await expect(page.locator('.demo-shell')).toHaveClass(/cathode-light/);
    expect(await bar()).toBe('#e6edf6');
    // ⓘ on a panel explains it
    await page.evaluate(() => { const w = (window as any).__ws3d; return w.stage.flyTo(w.stage.framePose(), 0); });
    await page.waitForTimeout(300);
    const i = await page.evaluate(() => (window as any).__ws3d.stage.clientPointForControl('wall', 'info'));
    await page.mouse.click(i.x, i.y);
    await expect.poll(() => page.evaluate(() => (window as any).__ws3d.stage.panels.has('about-wall'))).toBe(true);   // ⓘ opens a POP-UP in the wall (see stage-popup.spec.ts for where it lands and how the view comes back)
    // another tab and back: the theme is whatever the drop-down says (the tab does not fight it)
    await sel.selectOption('amber');
    await page.getByRole('button', { name: 'GRID' }).click();
    await expect(sel).toHaveValue('amber');
    await page.getByRole('button', { name: '3D Workspace' }).click();
    await page.waitForFunction(() => !!(window as any).__ws3d);
    await expect(page.locator('[data-testid="ws3d"]')).toHaveClass(/t-amber/);
  });

  test('a FLOOR GRID lies under the workspace: in the scene, below every panel, in the theme\'s colour — and it never draws over a panel\'s content', async ({ page }) => {
    await open(page);
    await settle(page);
    const f = await page.evaluate(() => { const w = (window as any).__ws3d, st = w.stage; const fl = w.floor;
      let lowest = 9; for (const p of st.panels.values()) lowest = Math.min(lowest, p.group.position.y - p.content.height / st.pxPerUnit / 2);
      return { inScene: st.scene.children.includes(fl), y: fl.position.y as number, lowest, order: fl.renderOrder as number }; });
    expect(f.inScene).toBe(true);
    expect(f.y, 'below the lowest panel').toBeLessThan(f.lowest);
    expect(f.order, 'drawn under the panels').toBeLessThan(0);
    // pixels: the strip under the workspace changes when the floor is hidden (it is drawn) …
    const strip = { x: 200, y: 800, width: 1100, height: 80 };
    const shot = async (floorVisible: boolean, clip: { x: number; y: number; width: number; height: number }) => { await page.evaluate((v) => { const w = (window as any).__ws3d; w.floor.visible = v; w.stage.invalidate(); }, floorVisible); await page.waitForTimeout(200); return (await page.screenshot({ clip })).toString('base64'); };
    expect(await shot(true, strip), 'the floor is drawn under the workspace').not.toBe(await shot(false, strip));
    // … but the panels' bodies are untouched by it (the floor lies in FRONT of them, below, never across their glass)
    const logBody = await page.evaluate(() => { const st = (window as any).__ws3d.stage; const a = st.clientPointForContent('log', 40, 40), b = st.clientPointForContent('wall', 40, 40); return [a, b] as { x: number; y: number }[]; });
    for (const pt of logBody) { const clip = { x: Math.round(pt.x), y: Math.round(pt.y), width: 260, height: 120 };
      expect(await shot(true, clip), 'the floor does not cross a panel\'s content').toBe(await shot(false, clip)); }
  });
});
