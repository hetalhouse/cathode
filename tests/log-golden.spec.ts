import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { collectConsoleErrors } from './_helpers';

/**
 * GOLDEN for CathodeLog: a scripted sequence of real input (wheel, click, shift-click, arrows, Cmd+A, Escape, drag-pan, hover)
 * on fixed data, hashing the rendered canvas after each step, plus the text that Cmd+C puts on the clipboard. Generated BEFORE
 * the log's logic moved into a headless model (UPDATE_GOLDEN=1 regenerates) — so the refactor is proved byte-identical.
 * Run 3 configurations: the default (wrap, phosphor, a slight bend), no-wrap / amber / concave, and no timestamp column.
 */
const GOLDEN = 'tests/__golden__/log.json';
const CONFIGS: Record<string, string> = {
  default:  '?theme=phosphor&curv=4',
  nowrap:   '?theme=amber&curv=-20&wrap=0&glow=1',
  nots:     '?theme=paper&curv=0&ts=0',
};
const hash = (b: Buffer) => createHash('sha1').update(b).digest('hex').slice(0, 12);

async function run(page: Page, query: string) {
  await page.goto('/log-fixture.html' + query);
  const canvas = page.locator('#host canvas');
  await canvas.waitFor({ state: 'visible' });
  await page.waitForTimeout(600);
  const out: Record<string, string> = {};
  const snap = async (k: string) => { await page.waitForTimeout(120); out[k] = hash(await canvas.screenshot()); };
  const box = (await canvas.boundingBox())!;
  const at = (x: number, y: number) => ({ x: box.x + x, y: box.y + y });

  await snap('initial (stuck to the bottom)');
  await page.mouse.move(...Object.values(at(200, 150)) as [number, number]);
  await page.mouse.wheel(0, -400); await snap('wheel up');
  await page.mouse.wheel(0, -100000); await snap('wheel to the top');
  await page.mouse.wheel(60, 0); await snap('horizontal wheel');
  await page.mouse.wheel(0, 2000); await page.mouse.wheel(0, -200); await snap('wheel down then a little up');
  let p = at(150, 120); await page.mouse.move(p.x, p.y); await snap('hover a line');
  await page.mouse.click(p.x, p.y); await snap('click selects a line');
  p = at(150, 220); await page.mouse.click(p.x, p.y, { modifiers: ['Shift'] }); await snap('shift-click extends');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Shift+ArrowDown');
  await snap('shift+arrow x3');
  for (let i = 0; i < 2; i++) await page.keyboard.press('ArrowUp');
  await snap('arrow up x2 collapses');
  await page.keyboard.press('PageDown'); await snap('page down');
  await page.keyboard.press('Home'); await snap('home');
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await snap('arrow right x2');
  await page.keyboard.press('End'); await snap('end');
  await page.keyboard.press('Control+a'); await snap('select all');
  await page.keyboard.press('Escape'); await snap('escape clears');
  // drag-pan (mouse down, move > 4px, up) scrolls both axes and is not a selection click
  const a = at(300, 250), b = at(260, 120);
  await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(b.x, b.y, { steps: 6 }); await page.mouse.up();
  await snap('drag-pan');
  await page.mouse.move(...Object.values(at(700, 500)) as [number, number]); await snap('pointer leaves');
  return out;
}

async function clip(page: Page, query: string) {
  await page.goto('/log-fixture.html' + query);
  const canvas = page.locator('#host canvas'); await canvas.waitFor({ state: 'visible' }); await page.waitForTimeout(600);
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + 100, box.y + 100); await page.mouse.wheel(0, -100000); await page.waitForTimeout(150);
  await page.mouse.click(box.x + 100, box.y + 40);
  await page.mouse.click(box.x + 100, box.y + 140, { modifiers: ['Shift'] });
  await page.keyboard.press('Control+c'); await page.waitForTimeout(200);
  return page.evaluate(() => navigator.clipboard.readText());
}

test.describe('CathodeLog golden (pre-refactor behaviour)', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });
  test('canvas hash after every step + the copied text, in three configurations', async ({ page, context }) => {
    const watch = collectConsoleErrors(page);
    const got: Record<string, any> = {};
    for (const [name, q] of Object.entries(CONFIGS)) got[name] = { steps: await run(page, q), copied: await clip(page, q) };
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
    expect(got.default.copied.length, 'something was copied').toBeGreaterThan(20);
    if (process.env.UPDATE_GOLDEN || !existsSync(GOLDEN)) { writeFileSync(GOLDEN, JSON.stringify(got, null, 2) + '\n'); return; }
    expect(got).toEqual(JSON.parse(readFileSync(GOLDEN, 'utf8')));
  });
});
