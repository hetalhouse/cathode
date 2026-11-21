import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * gaugeContent — the stage's gauge panel: the same picture CathodeGauge draws, as a PanelContent, with the
 * needle easing to each new value (and sweeping in from centre on mount) like the DOM component's.
 * (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
}
/** a checksum of the gauge's offscreen 2D picture */
const picture = (page: Page) => page.evaluate(() => {
  const c = (window as any).__stage3d.gauge.surface.canvas as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  let h = 0; for (let i = 0; i < d.length; i += 7) h = (h * 31 + d[i]) | 0;
  let lit = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) lit++;
  return { h, lit };
});
const shown = (page: Page) => page.evaluate(() => (window as any).__stage3d.gauge.shown as number);

test.describe('gaugeContent', () => {
  test('the needle sweeps in from centre on mount and eases to its value', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/stage3d.html?static=1&curv=0');
    // sample immediately: it starts at the axis centre (0) and has not reached 0.62 yet
    const early = await page.evaluate(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      return (window as any).__stage3d.gauge.shown as number;
    });
    expect(early, 'starts near the centre').toBeLessThan(0.5);
    await page.waitForTimeout(1200);
    expect(await shown(page), 'settled on the value').toBeCloseTo(0.62, 2);
    expect((await picture(page)).lit, 'the gauge is drawn').toBeGreaterThan(5000);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('update(): a new value eases the needle and repaints; other props repaint at once', async ({ page }) => {
    await open(page);
    await page.waitForTimeout(1200);
    const base = await picture(page);

    await page.evaluate(() => (window as any).__stage3d.gauge.update({ value: -0.8 }));
    await page.waitForTimeout(80);
    const mid = await shown(page);
    expect(mid, 'easing — not there yet').toBeGreaterThan(-0.7);
    expect(mid, '…but on its way').toBeLessThan(0.62);
    await page.waitForTimeout(1500);
    expect(await shown(page)).toBeCloseTo(-0.8, 2);
    const moved = await picture(page);
    expect(moved.h, 'the needle moved, the picture changed').not.toBe(base.h);

    // a non-value prop repaints immediately without touching the needle
    const before = await shown(page);
    await page.evaluate(() => (window as any).__stage3d.gauge.update({ caption: 'a different posture line' }));
    await page.waitForTimeout(60);
    expect((await picture(page)).h, 'the caption changed the picture').not.toBe(moved.h);
    expect(await shown(page)).toBe(before);
  });

  test('animate:false snaps the needle straight to the value', async ({ page }) => {
    await open(page);
    await page.waitForTimeout(800);
    const snapped = await page.evaluate(() => {
      const g = (window as any).__stage3d.gauge;
      g.update({ animate: false, value: 0.1 });
      return g.shown as number;
    });
    expect(snapped).toBe(0.1);
  });

  test('dispose() stops the animation', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(async () => {
      const g = (window as any).__stage3d.gauge;
      g.update({ value: -0.9 });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const a = g.shown as number;
      g.dispose();
      await new Promise((r) => setTimeout(r, 400));
      return { a, b: g.shown as number };
    });
    expect(r.b, 'no more easing after dispose').toBe(r.a);
  });
});
