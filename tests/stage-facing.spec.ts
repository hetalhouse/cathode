import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * CathodeStage3D — click count (double-click), facingPose / flyTo, and panel show/hide.
 * (page.evaluate callbacks are serialized into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page, qs = '') {
  await page.goto('/stage3d.html?static=1&curv=0' + qs);
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
const toClient = (page: Page, id: string, x: number, y: number) =>
  page.evaluate(([i, cx, cy]) => (window as any).__stage3d.stage.clientPointForContent(i, cx, cy), [id, x, y] as [string, number, number]);

/** how front-on / how big the panel looks: corner projections */
const frontOn = (page: Page, id: string, w: number, h: number) =>
  page.evaluate(([i, W, H]) => {
    const s = (window as any).__stage3d.stage;
    const tl = s.clientPointForContent(i, 6, 6), tr = s.clientPointForContent(i, W - 6, 6);
    const bl = s.clientPointForContent(i, 6, H - 6), br = s.clientPointForContent(i, W - 6, H - 6);
    return { tl, tr, bl, br, vw: innerWidth, vh: innerHeight };
  }, [id, w, h] as [string, number, number]);

test.describe('CathodeStage3D — click count, facing, visibility', () => {
  test('a double-click reaches the panel with its click count (event.detail 1 then 2)', async ({ page }) => {
    await open(page);
    const cell = await toClient(page, 'trades', 250, 30 + 28 * 2 + 10);
    await page.mouse.dblclick(cell.x, cell.y);
    await page.waitForTimeout(150);
    const clicks = await page.evaluate(() => (window as any).__stage3d.events.filter((e: any) => e.e === 'row-clicked').map((e: any) => e.detail));
    expect(clicks).toEqual([1, 2]);
  });

  test('facingPose looks straight at a panel and fits it in view; flyTo lands on it', async ({ page }) => {
    await open(page);
    // before: the grid is tilted (rotationY 0.22) — its top edge is not level on screen
    const before = await frontOn(page, 'trades', 640, 400);
    expect(Math.abs(before.tl.y - before.tr.y), 'tilted before').toBeGreaterThan(4);

    await page.evaluate(() => { const s = (window as any).__stage3d.stage; return s.flyTo(s.facingPose('trades'), 250); });
    await page.waitForTimeout(150);
    const a = await frontOn(page, 'trades', 640, 400);
    expect(Math.abs(a.tl.y - a.tr.y), 'top edge level').toBeLessThan(1.5);
    expect(Math.abs(a.bl.y - a.br.y), 'bottom edge level').toBeLessThan(1.5);
    expect(Math.abs(a.tl.x - a.bl.x), 'left edge vertical').toBeLessThan(1.5);
    for (const p of [a.tl, a.tr, a.bl, a.br]) {
      expect(p.x).toBeGreaterThan(0); expect(p.x).toBeLessThan(a.vw);
      expect(p.y).toBeGreaterThan(0); expect(p.y).toBeLessThan(a.vh);
    }
    // it fills a good share of the view (fit with a margin, not a speck)
    expect((a.br.y - a.tl.y) / a.vh, 'fills the view vertically').toBeGreaterThan(0.6);
    // and input still lands where the content is drawn
    const hdr = await toClient(page, 'trades', 140, 15);
    await page.mouse.click(hdr.x, hdr.y);
    await page.waitForTimeout(120);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.sortState.value.map((k: any) => k.colId))).toEqual(['product']);
  });

  test('double-clicking a title bar flies the camera to face that panel', async ({ page }) => {
    await open(page);
    const bar = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForBar('tilt'));
    await page.mouse.dblclick(bar.x, bar.y);
    await page.waitForTimeout(900);                       // the default flight is 550ms
    const a = await frontOn(page, 'tilt', 440, 320);
    expect(Math.abs(a.tl.y - a.tr.y), 'gauge panel now front-on').toBeLessThan(1.5);
    expect(a.tl.x).toBeGreaterThan(0); expect(a.br.x).toBeLessThan(a.vw);
  });

  test('a hidden panel is not drawn, picked or focused; showing it restores it; layout carries visibility', async ({ page }) => {
    await open(page);
    const gp = await toClient(page, 'tilt', 220, 160);
    // focus the gauge, then hide it
    await page.mouse.click(gp.x, gp.y);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.focusedId)).toBe('tilt');
    await page.evaluate(() => (window as any).__stage3d.stage.setPanelVisible('tilt', false));
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.focusedId), 'hiding releases focus').toBeNull();
    expect(await page.evaluate(([x, y]) => !!(window as any).__stage3d.stage.pick(x, y), [gp.x, gp.y]), 'not pickable').toBe(false);
    const hidden = await page.evaluate(() => (window as any).__stage3d.stage.getLayout().tilt.visible);
    expect(hidden).toBe(false);
    // …and it is not DRAWN: the pixel where the gauge was reads as the clear colour (0x05080a)
    const px = await page.evaluate(([x, y]) => {
      const { stage } = (window as any).__stage3d;
      stage.renderer.render(stage.scene, stage.camera);
      const gl = stage.renderer.getContext() as WebGL2RenderingContext;
      const r = stage.canvas.getBoundingClientRect(), d = stage.renderer.getPixelRatio();
      const b = new Uint8Array(4);
      gl.readPixels(Math.round((x - r.left) * d), Math.round((r.bottom - y) * d), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, b);
      return Array.from(b.slice(0, 3));
    }, [gp.x, gp.y]);
    expect(px, 'clear colour where the hidden panel was').toEqual([5, 8, 10]);

    // the layout round-trips: applyLayout({visible:true}) brings it back, pickable again
    await page.evaluate(() => (window as any).__stage3d.stage.applyLayout({ tilt: { visible: true } }));
    await page.waitForTimeout(150);
    expect(await page.evaluate(([x, y]) => (window as any).__stage3d.stage.pick(x, y)?.panel.id, [gp.x, gp.y])).toBe('tilt');
    expect(await page.evaluate(() => (window as any).__stage3d.stage.getLayout().tilt.visible)).toBe(true);
  });
});
