import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { collectConsoleErrors } from './_helpers';

/**
 * GOLDEN for CathodeCandle: a scripted sequence of real input (hover crosshair, wheel zoom anchored at the cursor, shift-wheel and
 * trackpad scroll, drag-pan, arrows / shift-arrows / Home / End, leave) on a fixed series with overlays and markers, hashing the rendered
 * canvas after each step. Generated BEFORE the candle's logic moved into a headless model (UPDATE_GOLDEN=1 regenerates), so the refactor is
 * proved byte-identical. Three configurations: the default; concave / amber / glow / no volume; compact + flat (the 2D fallback pipeline).
 */
const GOLDEN = 'tests/__golden__/candle.json';
const CONFIGS: Record<string, string> = {
  default: '?theme=phosphor&curv=4',
  concave: '?theme=amber&curv=-20&glow=1&vol=0&slot=6',
  flat:    '?theme=paper&curv=0&compact=1&flat=1&over=0',
};
const hash = (b: Buffer) => createHash('sha1').update(b).digest('hex').slice(0, 12);

async function run(page: Page, query: string) {
  await page.goto('/candle-fixture.html' + query);
  const canvas = page.locator('#host canvas');
  await canvas.waitFor({ state: 'visible' });
  await page.waitForTimeout(600);
  const out: Record<string, string> = {};
  const snap = async (k: string) => { await page.waitForTimeout(120); out[k] = hash(await canvas.screenshot()); };
  const box = (await canvas.boundingBox())!;
  const mv = (x: number, y: number) => page.mouse.move(box.x + x, box.y + y);

  await snap('initial');
  await mv(300, 150); await snap('hover crosshair');
  await mv(120, 90);  await snap('hover elsewhere');
  await mv(400, 140); await page.mouse.wheel(0, -300); await snap('wheel up (zoom in at the cursor)');
  await page.mouse.wheel(0, -200); await snap('wheel up more');
  await mv(200, 140); await page.mouse.wheel(0, 500); await snap('wheel down (zoom out)');
  await page.keyboard.down('Shift'); await page.mouse.wheel(0, 120); await page.keyboard.up('Shift'); await snap('shift+wheel scrolls back in time');
  await page.mouse.wheel(90, 0); await snap('trackpad horizontal scroll');
  await mv(300, 200); await page.mouse.down(); await mv(420, 200); await page.mouse.up(); await snap('drag right (older candles)');
  await page.mouse.down(); await mv(150, 210); await page.mouse.up(); await snap('drag left (newer candles)');
  await page.keyboard.press('ArrowLeft'); await snap('arrow left');
  await page.keyboard.press('Shift+ArrowLeft'); await snap('shift+arrow left');
  await page.keyboard.press('ArrowRight'); await snap('arrow right');
  await page.keyboard.press('ArrowUp'); await snap('arrow up (zoom in)');
  await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp'); await snap('arrow up x2');
  await page.keyboard.press('ArrowDown'); await snap('arrow down');
  await page.keyboard.press('Home'); await snap('home (oldest)');
  await page.keyboard.press('End'); await snap('end (newest)');
  await page.mouse.wheel(0, -4000); await snap('wheel to the max zoom');
  await page.mouse.wheel(0, 9000); await snap('wheel to the min zoom');
  await mv(700, 500); await snap('pointer leaves');
  return out;
}

test.describe('CathodeCandle golden (pre-refactor behaviour)', () => {
  test('canvas hash after every step, in three configurations', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    const got: Record<string, Record<string, string>> = {};
    for (const [name, q] of Object.entries(CONFIGS)) got[name] = await run(page, q);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
    if (process.env.UPDATE_GOLDEN || !existsSync(GOLDEN)) { writeFileSync(GOLDEN, JSON.stringify(got, null, 2) + '\n'); return; }
    expect(got).toEqual(JSON.parse(readFileSync(GOLDEN, 'utf8')));
  });
});
