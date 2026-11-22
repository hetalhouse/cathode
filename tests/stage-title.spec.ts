import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Panel3D.setTitle — a panel's title-bar text can change after creation (a live count), repainting only the bar.
 * (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
/** a checksum of the panel's title-bar picture (the texture's canvas) */
const bar = (page: Page, id: string) => page.evaluate(([i]) => {
  const p = (window as any).__stage3d.stage.panels.get(i);
  const c = p.bar.material.map.image as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  let h = 0; for (let k = 0; k < d.length; k += 5) h = (h * 31 + d[k]) | 0;
  return { h, title: p.title as string, dirty: p.barDirty as boolean };
}, [id]);

test.describe('Panel3D.setTitle', () => {
  test('changing the title repaints the bar; the same text is a no-op', async ({ page }) => {
    await open(page);
    const before = await bar(page, 'trades');
    expect(before.title).toBe('Trades');

    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setTitle('Trades (120)'));
    await page.waitForTimeout(150);
    const after = await bar(page, 'trades');
    expect(after.title).toBe('Trades (120)');
    expect(after.h, 'the bar was repainted with the new text').not.toBe(before.h);
    expect(after.dirty, 'and the repaint ran').toBe(false);

    // the same text again: nothing is invalidated
    const dirty = await page.evaluate(() => {
      const p = (window as any).__stage3d.stage.panels.get('trades');
      p.setTitle('Trades (120)');
      return p.barDirty as boolean;
    });
    expect(dirty, 'no-op: the bar is not marked dirty').toBe(false);

    // and back
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setTitle('Trades'));
    await page.waitForTimeout(150);
    expect((await bar(page, 'trades')).h, 'the original picture comes back').toBe(before.h);
  });

  test('only the changed panel\'s bar is touched; a very long title does not throw', async ({ page }) => {
    await open(page);
    const other = await bar(page, 'tilt');
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setTitle('x'.repeat(400)));
    await page.waitForTimeout(150);
    expect((await bar(page, 'tilt')).h, 'the other panel\'s bar is untouched').toBe(other.h);
    expect((await bar(page, 'trades')).title.length).toBe(400);
  });
});
