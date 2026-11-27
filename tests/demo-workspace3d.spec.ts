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

  test('▶ Tour demonstrates the whole vocabulary by itself — zoom out, FLY IN on a panel and FLY OUT again, a pop-up joining the wall (and the camera flying back), a sweep around the wall — and ends where it began', async ({ page }) => {
    test.setTimeout(90_000);
    await open(page);
    await settle(page);
    const home = await dist(page);
    const caption = page.locator('.ws3d-caption');
    const st = (f: string) => page.evaluate((x) => { const w = (window as any).__ws3d; return x === 'expanded' ? w.stage.expandedId : x === 'popup' ? w.stage.panels.has('about-wall') : x === 'rotating' ? w.orbit.autoRotate : null; }, f);
    await page.getByRole('button', { name: '▶ Tour' }).click();
    await expect(caption).toContainText('Zoom out', { timeout: 4000 });
    await expect(caption).toContainText('Fly in', { timeout: 6000 });
    await expect.poll(() => st('expanded'), { timeout: 4000 }).toBe('trades');                         // flew in on a panel: expanded
    await page.waitForTimeout(600); await settle(page);                                                 // (the flight takes a moment, longer under load)
    expect(await dist(page), 'the camera flew in').toBeLessThan(home * 0.7);
    await expect(caption).toContainText('Fly out', { timeout: 8000 });
    await expect.poll(() => st('expanded'), { timeout: 4000 }).toBeNull();                              // …and out: the view from before
    await expect(caption).toContainText('pop-up', { timeout: 12_000 });
    await expect.poll(() => st('popup'), { timeout: 4000 }).toBe(true);                                 // a pop-up joined the wall
    await expect(caption).toContainText('Close it', { timeout: 6000 });
    await expect.poll(() => st('popup'), { timeout: 4000 }).toBe(false);                                // closed; the camera flies back
    await expect(caption).toContainText('Rotate', { timeout: 8000 });
    await expect.poll(() => st('rotating'), { timeout: 3000 }).toBe(true);                              // the sweep
    await expect(caption).toContainText('Back out', { timeout: 12_000 });
    expect(await st('rotating'), 'the sweep stopped').toBe(false);
    await expect(caption).toHaveCount(0, { timeout: 8000 });                                            // the tour ended …
    await expect(page.getByRole('button', { name: '▶ Tour' })).toBeVisible();
    await settle(page);
    expect(Math.abs((await dist(page)) - home) / home, '… back at the overview').toBeLessThan(0.05);
    expect(await st('popup')).toBe(false);
  });

  test('■ Stop ends the tour anywhere: stopped mid fly-in, the camera flies back out and nothing is left open', async ({ page }) => {
    await open(page);
    await settle(page);
    const home = await dist(page);
    await page.getByRole('button', { name: '▶ Tour' }).click();
    await expect(page.locator('.ws3d-caption')).toContainText('Fly in', { timeout: 8000 });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: '■ Stop' }).click();
    await expect(page.locator('.ws3d-caption')).toHaveCount(0);
    await page.waitForTimeout(1200); await settle(page);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.expandedId), 'no longer expanded').toBeNull();
    expect(Math.abs((await dist(page)) - home) / home, 'flew back to where it started').toBeLessThan(0.05);
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

  test('⟳ Rotate sweeps the camera around the wall (to one side and back, never behind it) until a drag takes the camera; Recenter and Overview stop it', async ({ page }) => {
    await open(page);
    await settle(page);
    const az = () => page.evaluate(() => (window as any).__ws3d.orbit.getAzimuthalAngle() as number);
    const rot = () => page.evaluate(() => (window as any).__ws3d.orbit.autoRotate as boolean);
    const btn = page.getByRole('button', { name: /Rotate/ });
    expect(await rot()).toBe(false);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(await rot()).toBe(true);
    // (the sweep is driven by the controls' update(), once per rendered frame — a headless GL context renders only a few frames a second, so step it directly: the same code, deterministically)
    const sweep = (n: number, speed: number) => page.evaluate(([N, SP]) => { const o = (window as any).__ws3d.orbit; o.autoRotateSpeed = SP as number; const out: number[] = []; for (let i = 0; i < (N as number); i++) { o.update(); out.push(o.getAzimuthalAngle()); } return out; }, [n, speed]);
    const a0 = await az();
    const first = await sweep(60, 0.9);   // (damped: it eases into the sweep)
    expect(Math.abs(first[first.length - 1] - a0), 'the camera is sweeping').toBeGreaterThan(0.02);
    // the sweep REVERSES at its limit instead of running on behind the wall
    const seen = await sweep(500, 20);
    expect(Math.max(...seen.map(Math.abs)), 'never past the hard clamp (~60°) — nowhere near behind the wall (even at 20× speed, whose momentum overshoots the turn-round point)').toBeLessThanOrEqual(1.0501);
    expect(Math.max(...seen), 'it reached one side …').toBeGreaterThan(0.8);
    expect(Math.min(...seen), '… and came back across to the other').toBeLessThan(-0.8);
    // a drag takes the camera back: the sweep stops, the limits are lifted
    await page.mouse.move(700, 500); await page.mouse.down(); await page.mouse.move(740, 505, { steps: 4 }); await page.mouse.up();
    await page.waitForTimeout(300);
    expect(await rot(), 'a drag stopped the sweep').toBe(false);
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(await page.evaluate(() => (window as any).__ws3d.orbit.maxAzimuthAngle)).toBe(Infinity);
    // Recenter: stops it and flies home
    await btn.click(); expect(await rot()).toBe(true);
    await page.getByRole('button', { name: 'Recenter' }).click();
    expect(await rot(), 'Recenter stopped it').toBe(false);
    await btn.click(); await page.getByRole('button', { name: 'Overview' }).click();
    expect(await rot(), 'Overview stopped it').toBe(false);
  });

  test('a SCAPE of chart tiles lies on the floor in front of the wall (flat, below every panel, live) and is replaced — not duplicated — when the theme changes', async ({ page }) => {
    await open(page);
    const info = () => page.evaluate(() => { const w = (window as any).__ws3d, st = w.stage, g = w.scape; if (!g) return null;
      const tiles = g.children.filter((c: any) => c.isMesh), labels = g.children.filter((c: any) => c.isSprite);
      let lowest = 9; for (const p of st.panels.values()) lowest = Math.min(lowest, p.group.position.y - p.content.height / st.pxPerUnit / 2);
      return { tiles: tiles.length, labels: labels.length, flat: tiles.every((t: any) => Math.abs(t.rotation.x + Math.PI / 2) < 1e-6), belowWall: tiles.every((t: any) => t.position.y < lowest), inFront: tiles.every((t: any) => t.position.z > 0),
        copies: st.scene.children.filter((c: any) => c.name === 'scape').length as number, floorY: w.floor.position.y as number, tileY: tiles[0].position.y as number }; });
    const a = (await info())!;
    expect(a.tiles).toBe(12); expect(a.labels, 'a ticker label per tile').toBe(12);
    expect(a.flat, 'lying flat on the floor').toBe(true); expect(a.belowWall, 'below every panel').toBe(true); expect(a.inFront, 'in front of the wall').toBe(true);
    expect(a.tileY, 'on the floor').toBeCloseTo(a.floorY, 1);
    expect(a.copies).toBe(1);
    // live: the tiles' price lines tick (a tile's texture is redrawn)
    const hash = () => page.evaluate(() => { const t = (window as any).__ws3d.scape.children.find((c: any) => c.isMesh); const cv = t.material.map.image as HTMLCanvasElement; return cv.toDataURL().length + ':' + cv.toDataURL().slice(-40); });
    const h0 = await hash(); await page.waitForTimeout(3200);
    expect(await hash(), 'the tile redrew (a new price point)').not.toBe(h0);
    // drawn: the strip under the wall changes when the scape is hidden
    const strip = { x: 100, y: 770, width: 1300, height: 110 };
    const shot = async (v: boolean) => { await page.evaluate((vis) => { const w = (window as any).__ws3d; w.scape.visible = vis; w.stage.invalidate(); }, v); await page.waitForTimeout(200); return (await page.screenshot({ clip: strip })).toString('base64'); };
    expect(await shot(true)).not.toBe(await shot(false));
    // the theme change rebuilds it in the new colours — one scape, not two
    await page.locator('.demo-bar select').first().selectOption('amber');
    await page.waitForTimeout(1200);
    const b = (await info())!;
    expect(b.copies).toBe(1); expect(b.tiles).toBe(12);
  });
});
