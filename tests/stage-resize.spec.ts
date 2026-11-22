import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Resize — a corner handle drags a panel to a new size: the content lays out for it (a grid re-fits its columns, a gauge
 * redraws), the surface's backing store follows, and the TOP-LEFT corner stays put while the panel's centre moves.
 * (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
const handle = (page: Page, id: string) => page.evaluate(([i]) => (window as any).__stage3d.stage.clientPointForHandle(i), [id]);
const size = (page: Page, id: string) => page.evaluate(([i]) => {
  const p = (window as any).__stage3d.stage.panels.get(i); const s = p.content.surface;
  return { w: p.content.width as number, h: p.content.height as number, cw: s.canvas.width as number, ch: s.canvas.height as number, dpr: s.dpr as number };
}, [id]);
const tl = (page: Page, id: string) => page.evaluate(([i]) => (window as any).__stage3d.stage.clientPointForContent(i, 0, 0) ?? (window as any).__stage3d.stage.clientPointForContent(i, 1, 1), [id]);
const drag = async (page: Page, from: { x: number; y: number }, dx: number, dy: number) => {
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  await page.mouse.move(from.x + dx, from.y + dy, { steps: 10 }); await page.mouse.up();
  await page.waitForTimeout(300);
};

test.describe('panel resize', () => {
  test('the handle is the bottom-right corner of a resizable panel — and nowhere else', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => {
      const s = (window as any).__stage3d.stage;
      const h = s.clientPointForHandle('trades'); const c = s.clientPointForContent('trades', 320, 200); const b = s.clientPointForBar('trades');
      return { onHandle: s.pick(h.x, h.y)?.handle, body: s.pick(c.x, c.y)?.handle, bar: s.pick(b.x - 150, b.y)?.handle, part: s.pick(h.x, h.y)?.part };
    });
    expect(r).toEqual({ onHandle: true, body: false, bar: false, part: 'body' });

    // a panel that is NOT resizable has no handle (and says so)
    const plain = await page.evaluate(async () => {
      const m = await import('/src/panelContent.ts');
      const s = (window as any).__stage3d.stage;
      const p = s.addPanel({ id: 'plain', title: 'Plain', content: m.gaugeContent({ width: 300, height: 200, value: 0.2 }), position: [0, -1.1, 0] });
      await new Promise((r) => setTimeout(r, 300));
      const c = s.clientPointForContent('plain', 292, 192);   // the very corner
      return { resizable: p.resizable, handle: c ? s.pick(c.x, c.y)?.handle : null, point: s.clientPointForHandle('plain') };
    });
    expect(plain).toEqual({ resizable: false, handle: false, point: null });
  });

  test('dragging the handle resizes: the content re-lays-out, the backing store follows, the top-left corner stays put', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const before = await size(page, 'trades');
    expect([before.w, before.h]).toEqual([640, 400]);
    const tl0 = await tl(page, 'trades');
    const cols0 = await page.evaluate(() => (window as any).__stage3d.grid.model.displayCols.value.map((c: any) => c.width));

    const h = await handle(page, 'trades');
    await drag(page, h, 90, 70);
    const after = await size(page, 'trades');
    expect(after.w, 'wider').toBeGreaterThan(before.w + 20); expect(after.h, 'taller').toBeGreaterThan(before.h + 20);
    expect(after.cw, 'the backing store follows (× dpr)').toBe(Math.round(after.w * after.dpr));
    expect(after.ch).toBe(Math.round(after.h * after.dpr));
    // the grid re-fitted its columns to the new width (and its viewport to the new height)
    const m = await page.evaluate(() => { const g = (window as any).__stage3d.grid.model; return { cols: g.displayCols.value.map((c: any) => c.width) as number[], cw: g.canvasW.value as number, ch: g.canvasH.value as number }; });
    expect([m.cw, m.ch]).toEqual([after.w, after.h]);
    expect(m.cols.reduce((a, b) => a + b, 0), 'the columns fill the new width').toBe(after.w);
    expect(m.cols.reduce((a, b) => a + b, 0)).toBeGreaterThan(cols0.reduce((a: number, b: number) => a + b, 0));
    // the TOP-LEFT corner did not move on screen (the centre did)
    const tl1 = await tl(page, 'trades');
    expect(Math.hypot(tl1.x - tl0.x, tl1.y - tl0.y), 'the top-left corner stayed put').toBeLessThan(1.5);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('onPanelResized fires once on release with the final size; getLayout carries the size; applyLayout restores it; the press never reaches the content', async ({ page }) => {
    await open(page);
    const h = await handle(page, 'trades');
    await drag(page, h, 60, 40);
    const ev = await page.evaluate(() => (window as any).__stage3d.resizeEvents);
    expect(ev).toHaveLength(1);
    const after = await size(page, 'trades');
    expect(ev[0]).toEqual({ id: 'trades', w: after.w, h: after.h });
    expect(await page.evaluate(() => (window as any).__stage3d.stage.getLayout().trades.size)).toEqual({ w: after.w, h: after.h });
    // the drag was a resize, not a content press / click
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.selectedCell.value)).toBeNull();
    expect(await page.evaluate(() => (window as any).__stage3d.events.filter((e: any) => e.e === 'row-clicked').length)).toBe(0);

    await page.evaluate(() => (window as any).__stage3d.stage.applyLayout({ trades: { size: { w: 500, h: 300 } } }));
    await page.waitForTimeout(150);
    expect(await size(page, 'trades')).toMatchObject({ w: 500, h: 300 });
  });

  test('size limits: dragging far inward stops at the minimum, far outward at the maximum', async ({ page }) => {
    await open(page);
    const h = await handle(page, 'trades');
    await drag(page, h, -600, -400);
    expect(await size(page, 'trades')).toMatchObject({ w: 240, h: 160 });
    const h2 = await handle(page, 'trades');
    await drag(page, h2, 900, 700);
    const big = await size(page, 'trades');
    expect(big.w).toBeLessThanOrEqual(1600); expect(big.h).toBeLessThanOrEqual(1000);
    expect(big.w, 'it did grow').toBeGreaterThan(640);
  });

  test('after a resize the input mapping is exact: a drawn point picks the same content, and a header click still sorts', async ({ page }) => {
    await open(page);
    await drag(page, await handle(page, 'trades'), 120, 60);
    const r = await page.evaluate(() => {
      const s = (window as any).__stage3d.stage; const out: any[] = [];
      for (const [cx, cy] of [[100, 60], [400, 200], [650, 380]]) {
        const p = s.clientPointForContent('trades', cx, cy); const hit = p && s.pick(p.x, p.y);
        out.push({ want: [cx, cy], got: hit?.content ? [hit.content.x, hit.content.y] : null });
      }
      return out;
    });
    for (const { want, got } of r) {
      expect(got, `content ${want} found on screen`).not.toBeNull();
      expect(Math.abs(got![0] - want[0])).toBeLessThan(2); expect(Math.abs(got![1] - want[1])).toBeLessThan(2);
    }
    const hdr = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForContent('trades', 160, 15));
    await page.mouse.click(hdr.x, hdr.y); await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.sortState.value.length)).toBe(1);
  });

  test('a gauge redraws at its new size; a collapsed panel has no handle', async ({ page }) => {
    await open(page);
    const picture = () => page.evaluate(() => {
      const c = (window as any).__stage3d.gauge.surface.canvas as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      let h = 0; for (let i = 0; i < d.length; i += 7) h = (h * 31 + d[i]) | 0;
      return { h, w: c.width, ch: c.height };
    });
    await page.waitForTimeout(900);                                       // the needle settles
    const p0 = await picture();
    await drag(page, await handle(page, 'tilt'), 80, 60);
    const g = await size(page, 'tilt'); const p1 = await picture();
    expect(g.w).toBeGreaterThan(440); expect(g.h).toBeGreaterThan(320);
    expect([p1.w, p1.ch]).toEqual([Math.round(g.w * g.dpr), Math.round(g.h * g.dpr)]);
    expect(p1.h, 'the gauge was redrawn for the new size').not.toBe(p0.h);

    await page.evaluate(() => (window as any).__stage3d.stage.setPanelMinimized('trades', true));
    await page.waitForTimeout(150);
    const hit = await page.evaluate(() => {
      const s = (window as any).__stage3d.stage; const h = s.clientPointForHandle('trades');
      return { grip: s.panels.get('trades').grip.visible, handle: s.pick(h.x, h.y)?.handle ?? false };
    });
    expect(hit, 'collapsed: no grip, no handle').toEqual({ grip: false, handle: false });
  });
});
