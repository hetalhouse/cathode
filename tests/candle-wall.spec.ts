import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeCandleGrid ("the wall") — N mini charts in ONE WebGL context, warped
 * as a single sheet. Guards:
 *   1. context economy: the wall tab renders exactly ONE canvas
 *   2. cell hit-mapping: clicks route through the barrel inverse to the right
 *      cell id at flat AND deep concave
 *   3. the sheet visibly bends (flat vs convex vs concave all differ)
 */

test.describe('CathodeCandleGrid', () => {
  test('one context, cell clicks map under bend, three states render distinctly', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    const clicks: string[] = [];
    page.on('console', (m) => {
      const t = m.text();
      if (t.startsWith('wall cell:')) clicks.push(t.slice('wall cell:'.length).trim());
    });

    await page.goto('/');
    await page.getByRole('button', { name: /^WALL$/ }).click();
    const wall = page.locator('.cathode-candle-grid-wrap canvas');
    await wall.waitFor({ state: 'visible' });
    await page.waitForTimeout(600);

    // 1. context economy — the wall is ONE canvas regardless of cell count
    expect(await page.locator('.cathode-candle-grid-wrap canvas').count()).toBe(1);

    const slider = page.locator('input[type=range]').first();
    const box = await wall.boundingBox();
    if (!box) throw new Error('wall canvas not found');

    // 2a. flat: click the first cell's center → BTC
    await slider.fill('0');
    await page.waitForTimeout(300);
    await page.mouse.click(box.x + 100, box.y + 80);
    await page.waitForTimeout(150);
    expect(clicks.pop()).toBe('BTC');

    // 2b. deep concave: the same screen point now maps through the dish —
    // click the panel CENTER (always content) and assert SOME cell resolves,
    // then verify a click in the pinch-bezel (top-center edge) resolves NONE.
    await slider.fill('-35');
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.25);
    await page.waitForTimeout(150);
    const centerHit = clicks.pop();
    expect(centerHit, 'center click resolves a cell under concave').toBeTruthy();
    const before = clicks.length;
    await page.mouse.click(box.x + box.width / 2, box.y + 2); // pinch bezel
    await page.waitForTimeout(150);
    expect(clicks.length, 'pinch-bezel click resolves no cell').toBe(before);

    // 3. three-state rendering
    const shot = async (v: number) => {
      await slider.fill(String(v));
      await page.waitForTimeout(350);
      return page.screenshot({ clip: { x: box.x, y: box.y, width: 200, height: 120 } });
    };
    const flat = await shot(0);
    const convex = await shot(35);
    const concave = await shot(-35);
    expect(Buffer.compare(convex, flat)).not.toBe(0);
    expect(Buffer.compare(concave, flat)).not.toBe(0);
    expect(Buffer.compare(concave, convex)).not.toBe(0);

    expect(watch.entries, 'no GL warnings').toEqual([]);
  });
});
