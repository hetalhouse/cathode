import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * candleContent — a candle chart as a stage panel: a headless CandleModel + a world-mode surface, with the stage's raycast input
 * routed into it. (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?candle=1&static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d?.candle);
  await page.waitForTimeout(500);
  // face the chart (snap): a stable, flat view to aim at
  await page.evaluate(() => { const s = (window as any).__stage3d.stage; return s.flyTo(s.facingPose('candle', { margin: 0.1 }), 0); });
  await page.waitForTimeout(400);
}
const m = (page: Page) => page.evaluate(() => {
  const g = (window as any).__stage3d.candle.model;
  return { scrollX: g.scrollX.value as number, zoom: g.zoomLevel.value as number, sw: g.effectiveSlotW.value as number, hover: g.hover.value as { x: number; y: number } | null,
    w: g.canvasW.value as number, h: g.canvasH.value as number, total: (window as any).__stage3d.candleCount() as number };
});
const pt = (page: Page, x: number, y: number) => page.evaluate(([a, b]) => (window as any).__stage3d.stage.clientPointForContent('candle', a, b), [x, y]);
/** the (fractional) index of the candle under content x, from the model's own state — what must stay put when zooming at the cursor */
const idxAt = (s: { scrollX: number; sw: number; w: number; total: number }, cx: number) => {
  const visible = Math.max(1, Math.floor(s.w / s.sw));
  return Math.max(0, s.total - visible - Math.floor(s.scrollX / s.sw)) + (cx - 8) / s.sw;
};
/** focus the panel with a press on it (the stage routes keys to the focused panel) */
const focus = async (page: Page) => { const c = (await pt(page, 300, 120))!; await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(100); return c; };

test.describe('candleContent', () => {
  test('opens anchored on the newest candle, drawn, at zoom 1', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const s = await m(page);
    expect(s.scrollX).toBe(0); expect(s.zoom).toBe(1); expect(s.hover).toBeNull();
    expect([s.w, s.h]).toEqual([600, 320]);
    const lit = await page.evaluate(() => {
      const c = (window as any).__stage3d.candle.surface.canvas as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0 && d[i] + d[i + 1] + d[i + 2] > 200) n++;
      return n;
    });
    expect(lit, 'candles / axes are on the canvas').toBeGreaterThan(800);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('hover: the crosshair follows the pointer in content space; leaving clears it', async ({ page }) => {
    await open(page);
    const c = (await pt(page, 240, 130))!;
    await page.mouse.move(c.x, c.y); await page.waitForTimeout(120);
    const h = (await m(page)).hover!;
    expect(Math.hypot(h.x - 240, h.y - 130), 'the crosshair is where the pointer is, in logical px').toBeLessThan(2.5);
    await page.mouse.move(3, 3); await page.waitForTimeout(120);
    expect((await m(page)).hover, 'leaving the panel clears it').toBeNull();
  });

  test('wheel zooms ANCHORED on the candle under the cursor; zoom is bounded', async ({ page }) => {
    await open(page);
    const c = (await pt(page, 420, 130))!; await page.mouse.move(c.x, c.y);
    const a = await m(page); const before = idxAt(a, 420);
    await page.mouse.wheel(0, -400); await page.waitForTimeout(150);
    const b = await m(page);
    expect(b.zoom, 'wheel up zooms in').toBeGreaterThan(1.3);
    expect(Math.abs(idxAt(b, 420) - before), 'the candle under the cursor did not move').toBeLessThan(1.5);
    await page.mouse.wheel(0, -100000); await page.waitForTimeout(150);
    expect((await m(page)).zoom).toBeLessThanOrEqual(6);
    await page.mouse.wheel(0, 100000); await page.waitForTimeout(150);
    expect((await m(page)).zoom).toBeGreaterThanOrEqual(0.25);
  });

  test('scrolling: shift+wheel and a horizontal wheel move back in time (clamped); Home = oldest, End = newest', async ({ page }) => {
    await open(page);
    await focus(page);
    await page.keyboard.down('Shift'); await page.mouse.wheel(0, 160); await page.keyboard.up('Shift'); await page.waitForTimeout(120);
    const a = await m(page); expect(a.scrollX, 'shift+wheel scrolled back').toBeGreaterThan(100);
    await page.mouse.wheel(90, 0); await page.waitForTimeout(120);
    expect((await m(page)).scrollX, 'a horizontal wheel too').toBeGreaterThan(a.scrollX);
    await page.keyboard.press('Home'); await page.waitForTimeout(120);
    const home = await m(page);
    expect(home.scrollX, 'Home: the oldest candle is at the left edge').toBeGreaterThan(1000);
    await page.keyboard.down('Shift'); await page.mouse.wheel(0, 5000); await page.keyboard.up('Shift'); await page.waitForTimeout(100);
    expect((await m(page)).scrollX, 'scrolling is clamped at the oldest candle').toBe(home.scrollX);
    await page.keyboard.press('End'); await page.waitForTimeout(120);
    expect((await m(page)).scrollX).toBe(0);
  });

  test('drag-pan moves the chart with the pointer (right = older) and hides the crosshair while panning', async ({ page }) => {
    await open(page);
    const a = (await pt(page, 300, 160))!;
    await page.mouse.move(a.x, a.y); await page.waitForTimeout(100);
    expect((await m(page)).hover).not.toBeNull();
    await page.mouse.down();
    await page.mouse.move(a.x + 100, a.y, { steps: 8 }); await page.waitForTimeout(100);
    const mid = await m(page);
    expect(mid.scrollX, 'dragged right: older candles come into view').toBeGreaterThan(20);
    expect(mid.hover, 'no crosshair while panning').toBeNull();
    await page.mouse.move(a.x - 50, a.y, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(100);
    expect((await m(page)).scrollX, 'dragged back left').toBeLessThan(mid.scrollX);
  });

  test('keyboard: arrows pan and zoom the focused chart', async ({ page }) => {
    await open(page);
    await focus(page);
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(100);
    expect((await m(page)).zoom, 'up zooms in').toBeGreaterThan(1.1);
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(100);
    expect((await m(page)).zoom, 'down zooms out').toBeLessThan(1);
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(100);
    const l = (await m(page)).scrollX; expect(l, 'left goes back in time').toBeGreaterThan(0);
    await page.keyboard.press('Shift+ArrowLeft'); await page.waitForTimeout(100);
    const jumped = (await m(page)).scrollX;
    expect(jumped, 'shift jumps ~7x further than a plain step (20 slots vs 3)').toBeGreaterThan(l * 5);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
    expect((await m(page)).scrollX, 'right comes forward in time').toBeLessThan(jumped);
  });

  test('update(): new candles replace the series and the chart stays anchored on the newest', async ({ page }) => {
    await open(page);
    const pic = () => page.evaluate(() => {
      const c = (window as any).__stage3d.candle.surface.canvas as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 4) h = (h * 31 + d[i + 1]) | 0; return h;
    });
    const before = await pic(); const n0 = (await m(page)).total;
    await page.evaluate(() => (window as any).__stage3d.appendCandles(5)); await page.waitForTimeout(200);
    expect((await m(page)).total).toBe(n0 + 5);
    expect((await m(page)).scrollX, 'still on the newest').toBe(0);
    expect(await pic(), 'repainted with the new candles').not.toBe(before);
  });

  test('resize: the chart fits its new size (more room, more candles) and the surface follows', async ({ page }) => {
    await open(page);
    const h = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForHandle('candle'));
    await page.mouse.move(h.x, h.y); await page.mouse.down();
    await page.mouse.move(h.x + 140, h.y + 60, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(250);
    const s = await m(page);
    expect(s.w, 'wider').toBeGreaterThan(620); expect(s.h, 'taller').toBeGreaterThan(330);
    const back = await page.evaluate(() => { const p = (window as any).__stage3d.stage.panels.get('candle'); const c = p.content.surface.canvas;
      return { cw: c.width, ch: c.height, dpr: p.content.surface.dpr, w: p.content.width, h: p.content.height }; });
    expect([back.cw, back.ch]).toEqual([Math.round(back.w * back.dpr), Math.round(back.h * back.dpr)]);
    // and a programmatic resize (a narrower panel) re-fits the viewport too
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('candle').resize(300, 240)); await page.waitForTimeout(200);
    expect((await m(page)).w).toBe(300);
  });
});
