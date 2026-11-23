import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { collectConsoleErrors } from './_helpers';

/**
 * GOLDEN for CathodeCandleGrid (the wall of mini candle charts): a scripted run of real input (hover a cell, wheel-scroll the wall, click a cell, leave) on fixed
 * data, hashing the rendered canvas after each step plus the cell ids that clicks reported. Generated BEFORE the wall's layout / painting was lifted out into shared
 * code (UPDATE_GOLDEN=1 regenerates), so the lift is proved byte-identical. Three configurations: bend (phosphor, curvature 4, bend field) · concave amber with glow
 * and scan lines · flat paper with no bend field.
 */
const GOLDEN = 'tests/__golden__/candle-wall.json';
const CONFIGS: Record<string, string> = {
  bend:    '?theme=phosphor&curv=4',
  concave: '?theme=amber&curv=-20&glow=1&scan=1',
  flat:    '?theme=paper&curv=0&bendfield=0',
};
const hash = (b: Buffer) => createHash('sha1').update(b).digest('hex').slice(0, 12);

async function run(page: Page, query: string) {
  await page.goto('/candle-wall-fixture.html' + query);
  const canvas = page.locator('#host canvas');
  await canvas.waitFor({ state: 'visible' });
  await page.waitForTimeout(700);
  const out: Record<string, string> = {};
  const snap = async (k: string) => { await page.waitForTimeout(120); out[k] = hash(await canvas.screenshot()); };
  const box = (await canvas.boundingBox())!;
  const mv = (x: number, y: number) => page.mouse.move(box.x + x, box.y + y);
  const cl = (x: number, y: number) => page.mouse.click(box.x + x, box.y + y);

  await snap('initial');
  await mv(120, 90); await snap('hover a cell');
  await mv(420, 200); await snap('hover another');
  await page.mouse.wheel(0, 140); await snap('wheel down');
  await page.mouse.wheel(0, 140); await snap('wheel down more');
  await mv(250, 120); await snap('hover after scroll');
  await cl(250, 120); await snap('click a cell');
  await page.mouse.wheel(0, -2000); await snap('wheel to the top');
  await cl(120, 90); await cl(560, 90);
  await mv(690, 410); await snap('pointer leaves');
  const clicks = await page.evaluate(() => (window as any).__wallClicks as string[]);
  return { steps: out, clicks };
}

test.describe('CathodeCandleGrid golden (pre-lift behaviour)', () => {
  test('canvas hash after every step + the clicked cells, in three configurations', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    const got: Record<string, unknown> = {};
    for (const [name, q] of Object.entries(CONFIGS)) got[name] = await run(page, q);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
    expect((got.bend as { clicks: string[] }).clicks.length, 'clicks were reported').toBeGreaterThan(1);
    if (process.env.UPDATE_GOLDEN || !existsSync(GOLDEN)) { writeFileSync(GOLDEN, JSON.stringify(got, null, 2) + '\n'); return; }
    expect(got).toEqual(JSON.parse(readFileSync(GOLDEN, 'utf8')));
  });
});
