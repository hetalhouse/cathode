import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * High-frequency interaction tests for CathodeGrid.
 *
 * Covers the drag-rate user inputs that aren't exercised by viewport-resize:
 *   - Column resize (drag the right edge of a header cell)
 *   - Body pan (click in body, drag to scroll)
 *
 * These are canvas-internal interactions — Playwright can't see column edges
 * via the DOM, so we drive the mouse using known geometry (HEADER_H = 30,
 * first column 'Entry Time' = 148px wide in the demo).
 */

const BLANK_FLOOR = 3000;
const HEADER_H    = 30;

async function wireContextLossListeners(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const w = window as any;
    w.__cathodeContextLossCount = 0;
    w.__cathodeLossLog          = [] as any[];
    const wire = (c: HTMLCanvasElement) => {
      c.addEventListener('webglcontextlost', () => {
        w.__cathodeContextLossCount++;
        w.__cathodeLossLog.push({ parent: c.parentElement?.className || '?' });
      });
    };
    document.querySelectorAll('canvas').forEach(c => wire(c as HTMLCanvasElement));
    new MutationObserver(muts => {
      for (const m of muts) for (const node of Array.from(m.addedNodes)) {
        if (node instanceof HTMLCanvasElement) wire(node);
        if (node instanceof HTMLElement) node.querySelectorAll?.('canvas').forEach(c => wire(c as HTMLCanvasElement));
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
}

async function getLossCount(page: import('@playwright/test').Page) {
  return await page.evaluate(() => (window as any).__cathodeContextLossCount ?? 0);
}

test.describe('CathodeGrid interaction', () => {

  test('column resize: rapid drag does not blank the grid canvas', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    await wireContextLossListeners(page);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('grid canvas not found');

    // First demo column is 'Entry Time' at width 148. Resize handle is the
    // right ~6px of the column. Click 3px inside that zone in the header.
    const ENTRY_TIME_WIDTH = 148;
    const handleX = box.x + ENTRY_TIME_WIDTH - 3;
    const handleY = box.y + HEADER_H / 2;

    // Aggressive resize sweep — narrow, widen, settle
    const sweeps = [-80, +160, -120, +40];
    const STEPS  = 25;

    await page.mouse.move(handleX, handleY);
    await page.mouse.down();
    let curX = handleX;
    for (const dx of sweeps) {
      const targetX = curX + dx;
      for (let i = 1; i <= STEPS; i++) {
        const t = i / STEPS;
        await page.mouse.move(curX + (targetX - curX) * t, handleY, { steps: 1 });
      }
      curX = targetX;
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    expect(await getLossCount(page), 'WebGL context lost during column resize').toBe(0);

    const post = (await canvas.screenshot()).length;
    expect(post, `grid canvas blanked after column resize (${post} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });

  test('body pan-drag: rapid scroll-by-drag does not blank the grid canvas', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    await wireContextLossListeners(page);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('grid canvas not found');

    // Click well below the header — pan-to-scroll territory
    const startX = box.x + box.width / 2;
    const startY = box.y + HEADER_H + 50;

    // Several pan strokes, each broken into many ticks
    const strokes = [
      { dx:    0, dy: -300 },   // scroll down
      { dx:    0, dy:  500 },   // back up + further
      { dx:  200, dy:    0 },   // horizontal nudge
      { dx: -200, dy: -200 },   // diagonal back
    ];
    const STEPS = 30;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    let curX = startX, curY = startY;
    for (const s of strokes) {
      const targetX = curX + s.dx;
      const targetY = curY + s.dy;
      for (let i = 1; i <= STEPS; i++) {
        const t = i / STEPS;
        await page.mouse.move(curX + (targetX - curX) * t, curY + (targetY - curY) * t, { steps: 1 });
      }
      curX = targetX; curY = targetY;
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    expect(await getLossCount(page), 'WebGL context lost during pan-drag').toBe(0);

    const post = (await canvas.screenshot()).length;
    expect(post, `grid canvas blanked after pan-drag (${post} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });
});
