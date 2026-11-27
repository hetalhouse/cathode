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

  test('▶ Tour demonstrates the whole vocabulary by itself — zoom out, FLY IN on a panel and FLY OUT again, a pop-up joining the wall (and the camera flying back), a full 360° spin round the wall — and ends where it began', async ({ page }) => {
    test.setTimeout(90_000);
    await open(page);
    await settle(page);
    const home = await dist(page);
    const caption = page.locator('.ws3d-caption');
    const st = (f: string) => page.evaluate((x) => { const w = (window as any).__ws3d; return x === 'expanded' ? w.stage.expandedId : x === 'popup' ? w.stage.panels.has('about-wall') : x === 'rotating' ? w.rotating() : null; }, f);
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
    await expect.poll(() => st('rotating'), { timeout: 3000 }).toBe(true);                              // the 360° spin
    await expect(caption).toContainText('Back out', { timeout: 20_000 });
    expect(await st('rotating'), 'the spin finished').toBe(false);
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

  test('⟳ Rotate spins the camera a FULL 360° around the wall — exposing the charts behind it — and lands exactly where it began; the button stops it (flying home), a drag takes the camera where it is', async ({ page }) => {
    test.setTimeout(120_000);
    await open(page);
    await settle(page);
    const home = await page.evaluate(() => { const p = (window as any).__ws3d.stage.getCameraPose(); return [...p.position]; });
    const state = () => page.evaluate(() => { const w = (window as any).__ws3d, p = w.stage.camera.position, u = w.floor.material.uniforms.uBack.value as number;
      const back = w.scape.children.filter((c: any) => c.userData.back); return { rot: w.rotating() as boolean, az: Math.atan2(p.x, p.z) as number, mix: u, backVisible: back.filter((c: any) => c.visible).length as number, backOpacity: Math.max(...back.map((c: any) => c.material.opacity)) as number, pos: [p.x, p.y, p.z] }; });
    const btn = page.getByRole('button', { name: /Rotate|■ Spin/ });
    const s0 = await state();
    expect(s0.mix, 'from the front the floor behind the wall is hidden').toBe(0); expect(s0.backVisible, '…and so are the tiles behind it').toBe(0);
    await btn.click();
    await expect(btn).toHaveText('■ Spin'); await expect(btn).toHaveAttribute('aria-pressed', 'true');
    // follow the camera round: its angle about the wall, unwrapped, must cover a FULL turn; behind the wall the back tiles and the floor are fully shown
    let prev = s0.az, total = 0, maxMix = 0, maxOpacity = 0, maxVisible = 0;
    for (let i = 0; i < 300; i++) {
      await page.waitForTimeout(150);
      const s1 = await state();
      let d = s1.az - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      total += d; prev = s1.az; maxMix = Math.max(maxMix, s1.mix); maxOpacity = Math.max(maxOpacity, s1.backOpacity); maxVisible = Math.max(maxVisible, s1.backVisible);
      if (!s1.rot) break;
    }
    expect(Math.abs(total), 'a FULL 360° turn (2π)').toBeGreaterThan(2 * Math.PI * 0.93);
    expect(maxMix, 'the whole floor appeared behind the wall').toBeGreaterThan(0.95);
    expect(maxOpacity, 'the tiles behind the wall came fully into view').toBeGreaterThan(0.95); expect(maxVisible, '18 tiles + their 18 labels').toBe(36);
    // it ends exactly where it began, with the back hidden again
    await expect(btn).toHaveText('⟳ Rotate', { timeout: 5000 });
    await page.waitForTimeout(400);
    const s2 = await state();
    expect(s2.rot).toBe(false);
    s2.pos.forEach((v: number, k: number) => expect(Math.abs(v - home[k]), 'landed where it began').toBeLessThan(0.02));
    expect(s2.mix).toBe(0); expect(s2.backVisible).toBe(0);
    // the button again, mid-spin: it STOPS and flies back to where the spin began
    await btn.click(); await page.waitForTimeout(2500);
    expect((await state()).rot).toBe(true);
    await btn.click();
    await page.waitForTimeout(1500); await settle(page);
    const s3 = await state();
    expect(s3.rot).toBe(false); s3.pos.forEach((v: number, k: number) => expect(Math.abs(v - home[k])).toBeLessThan(0.05));
    // a drag mid-spin takes the camera: the spin stops WHERE IT IS (it does not fly home)
    await btn.click(); await page.waitForTimeout(2500);
    await page.mouse.move(700, 500); await page.mouse.down(); await page.mouse.move(720, 503, { steps: 3 }); await page.mouse.up();
    await page.waitForTimeout(400);
    const s4 = await state();
    expect(s4.rot, 'a drag stopped the spin').toBe(false);
    expect(Math.hypot(s4.pos[0] - home[0], s4.pos[2] - home[2]), 'and left the camera where it was taken (not home)').toBeGreaterThan(0.3);
    await expect(btn).toHaveText('⟳ Rotate');
    // Recenter flies home from wherever
    await page.getByRole('button', { name: 'Recenter' }).click();
    await page.waitForTimeout(1500); await settle(page);
    (await state()).pos.forEach((v: number, k: number) => expect(Math.abs(v - home[k])).toBeLessThan(0.05));
  });

  test('a SCAPE of chart tiles: twelve in front of the wall, eighteen BEHIND it — flat on the floor, below every panel, live — the back ones hidden from the front and fading in as the camera swings round; replaced (not duplicated) on a theme change', async ({ page }) => {
    await open(page);
    const info = () => page.evaluate(() => { const w = (window as any).__ws3d, st = w.stage, g = w.scape; if (!g) return null;
      const tiles = g.children.filter((c: any) => c.isMesh), labels = g.children.filter((c: any) => c.isSprite), front = tiles.filter((t: any) => !t.userData.back), back = tiles.filter((t: any) => t.userData.back);
      let lowest = 9; for (const p of st.panels.values()) lowest = Math.min(lowest, p.group.position.y - p.content.height / st.pxPerUnit / 2);
      return { tiles: tiles.length, labels: labels.length, front: front.length, back: back.length, flat: tiles.every((t: any) => Math.abs(t.rotation.x + Math.PI / 2) < 1e-6), belowWall: tiles.every((t: any) => t.position.y < lowest),
        frontIn: front.every((t: any) => t.position.z > 0), backBehind: back.every((t: any) => t.position.z < 0), backHidden: back.every((t: any) => !t.visible), copies: st.scene.children.filter((c: any) => c.name === 'scape').length as number,
        floorY: w.floor.position.y as number, tileY: tiles[0].position.y as number }; });
    const a = (await info())!;
    expect(a.front).toBe(12); expect(a.back).toBe(18); expect(a.labels, 'a ticker label per tile').toBe(30);
    expect(a.flat, 'lying flat on the floor').toBe(true); expect(a.belowWall, 'below every panel').toBe(true);
    expect(a.frontIn, 'twelve in front of the wall').toBe(true); expect(a.backBehind, 'eighteen behind it').toBe(true);
    expect(a.backHidden, 'hidden from the front: they would show through the panels\' glass').toBe(true);
    expect(a.tileY, 'on the floor').toBeCloseTo(a.floorY, 1); expect(a.copies).toBe(1);
    // live: the tiles' price lines tick (a tile's texture is redrawn)
    const hash = () => page.evaluate(() => { const t = (window as any).__ws3d.scape.children.find((c: any) => c.isMesh); const cv = t.material.map.image as HTMLCanvasElement; return cv.toDataURL().length + ':' + cv.toDataURL().slice(-40); });
    const h0 = await hash(); await page.waitForTimeout(3200);
    expect(await hash(), 'the tile redrew (a new price point)').not.toBe(h0);
    // drawn: the strip under the wall changes when the scape is hidden
    const strip = { x: 100, y: 770, width: 1300, height: 110 };
    const shot = async (v: boolean) => { await page.evaluate((vis) => { const w = (window as any).__ws3d; w.scape.visible = vis; w.stage.invalidate(); }, v); await page.waitForTimeout(200); return (await page.screenshot({ clip: strip })).toString('base64'); };
    expect(await shot(true)).not.toBe(await shot(false));
    await page.evaluate(() => { (window as any).__ws3d.scape.visible = true; });
    // from the BACK the floor and the tiles behind the wall are there; back at the front they are hidden again
    const mix = () => page.evaluate(() => { const w = (window as any).__ws3d; return { m: w.floor.material.uniforms.uBack.value as number, vis: w.scape.children.filter((c: any) => c.userData.back && c.visible).length as number }; });
    await page.evaluate(() => { const w = (window as any).__ws3d; (window as any).__home = w.stage.getCameraPose(); w.stage.setCameraPose(w.poseAt((window as any).__home, Math.PI)); });
    await page.waitForTimeout(900);
    const behind = await mix(); expect(behind.m).toBeGreaterThan(0.95); expect(behind.vis, '18 tiles + 18 labels').toBe(36);
    await page.evaluate(() => { const w = (window as any).__ws3d; w.stage.setCameraPose((window as any).__home); });
    await page.waitForTimeout(900);
    const front = await mix(); expect(front.m).toBe(0); expect(front.vis).toBe(0);
    // the theme change rebuilds it in the new colours — one scape, not two
    await page.locator('.demo-bar select').first().selectOption('amber');
    await page.waitForTimeout(1200);
    const b = (await info())!;
    expect(b.copies).toBe(1); expect(b.front).toBe(12); expect(b.back).toBe(18);
  });
});
