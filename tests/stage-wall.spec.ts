import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * candleWallContent — a wall of mini candle charts as a stage panel: a headless WallModel + a world-mode surface, routed from the stage's raycast. Hover rings a cell, a click
 * reports its id, the wheel scrolls an overflowing wall, a resize re-flows the columns, update() swaps the cells. (page.evaluate callbacks run in the page.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?wall=1&static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d?.wall);
  await page.waitForTimeout(500);
  await page.evaluate(() => { const s = (window as any).__stage3d.stage; return s.flyTo(s.facingPose('wall', { margin: 0.1 }), 0); });
  await page.waitForTimeout(400);
}
const m = (page: Page) => page.evaluate(() => { const w = (window as any).__stage3d.wall.model; const l = w.layout();
  return { cols: l.cols as number, rows: Math.ceil(l.rects.length / l.cols), cell: l.rects[0] as { x: number; y: number; w: number; h: number }, totalH: l.totalH as number, max: w.maxScroll() as number, scrollY: w.scrollY.value as number, hovered: w.hoveredCell.value as number, w: w.viewW.value as number, h: w.viewH.value as number }; });
const at = (page: Page, x: number, y: number) => page.evaluate(([a, b]) => (window as any).__stage3d.stage.clientPointForContent('wall', a, b), [x, y]);
const clicks = (page: Page) => page.evaluate(() => (window as any).__stage3d.wallClicks as string[]);

test.describe('candleWallContent', () => {
  test('opens as a wall: 3 columns of 210+px cells, drawn (not blank), the open positions framed', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const s = await m(page);
    expect(s.cols).toBe(3); expect(s.rows).toBe(4);
    expect(s.cell.w).toBeGreaterThanOrEqual(210);
    expect(s.max, 'twelve cells overflow a 400px wall').toBeGreaterThan(0);
    const lit = await page.evaluate(() => { const c = (window as any).__stage3d.wall.surface.canvas as HTMLCanvasElement; const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0 && d[i] + d[i + 1] + d[i + 2] > 200) n++; return n; });
    expect(lit, 'cells, titles and candles are on the surface').toBeGreaterThan(3000);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('hover rings the cell under the pointer (and clears on leave); a click reports that cell\'s id', async ({ page }) => {
    await open(page);
    const s = await m(page);
    const c1 = (await at(page, s.cell.w * 1.5, s.cell.h * 0.5))!;                       // the 2nd cell (index 1)
    await page.mouse.move(c1.x, c1.y); await page.waitForTimeout(150);
    expect((await m(page)).hovered).toBe(1);
    await page.mouse.click(c1.x, c1.y); await page.waitForTimeout(100);
    expect(await clicks(page)).toEqual(['P1']);
    const c2 = (await at(page, s.cell.w * 2.5, s.cell.h * 0.5))!;                       // index 2
    await page.mouse.click(c2.x, c2.y); await page.waitForTimeout(100);
    expect(await clicks(page)).toEqual(['P1', 'P2']);
    await page.mouse.move(8, 300); await page.waitForTimeout(150);
    expect((await m(page)).hovered, 'gone when the pointer leaves').toBe(-1);
  });

  test('the wheel scrolls an overflowing wall (clamped) and a click after scrolling reports the cell that is NOW under the pointer', async ({ page }) => {
    await open(page);
    const s = await m(page);
    const c = (await at(page, s.cell.w * 0.5, s.cell.h * 0.5))!;
    await page.mouse.move(c.x, c.y);
    await page.mouse.wheel(0, 100); await page.waitForTimeout(150);
    let t = await m(page); expect(t.scrollY).toBe(100);
    await page.mouse.wheel(0, 100000); await page.waitForTimeout(150);
    t = await m(page); expect(t.scrollY, 'clamped at the bottom').toBe(t.max);
    await page.mouse.wheel(0, -100000); await page.waitForTimeout(150);
    expect((await m(page)).scrollY).toBe(0);
    // scroll one full row down: the cell at the top-left is now index 3 (the 2nd row's first)
    await page.mouse.wheel(0, s.cell.h); await page.waitForTimeout(150);
    const top = (await at(page, s.cell.w * 0.5, s.cell.h * 0.5))!;
    await page.mouse.click(top.x, top.y); await page.waitForTimeout(100);
    expect((await clicks(page)).at(-1)).toBe('P3');
  });

  test('update() swaps the cells; resize re-flows the columns (wider = more of them) and the surface follows', async ({ page }) => {
    await open(page);
    const before = await m(page);
    await page.evaluate(() => { const w = (window as any).__stage3d.wall; w.update({ cells: [] }); });
    await page.waitForTimeout(150);
    expect((await m(page)).rows, 'no cells').toBe(0);
    // a wider panel fits more columns: 4 x 210 = 840
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('wall').resize(900, 400)); await page.waitForTimeout(200);
    await page.evaluate(() => { const w = (window as any).__stage3d.wall; w.update({ cells: Array.from({ length: 8 }, (_, i) => ({ id: `Q${i}`, title: `Q${i}`, candles: [] })) }); });
    await page.waitForTimeout(200);
    const wide = await m(page);
    expect(wide.cols).toBe(4); expect(wide.w).toBe(900); expect(wide.cols).toBeGreaterThan(before.cols);
    const back = await page.evaluate(() => { const p = (window as any).__stage3d.stage.panels.get('wall'); const c = p.content.surface.canvas;
      return { cw: c.width, dpr: p.content.surface.dpr, w: p.content.width }; });
    expect(back.cw).toBe(Math.round(back.w * back.dpr));
  });
});
