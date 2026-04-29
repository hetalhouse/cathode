import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * High-frequency interaction tests for CathodeContainer.
 *
 * Same bug-shape as the curvature-drag bug fixed in 2026-04-29: rapid mouse
 * events on UI controls can cascade into watcher chains that remount canvas
 * components, churning WebGL contexts and blanking unrelated panels. These
 * tests reproduce realistic drag rates and assert no context loss + canvas
 * still renders.
 *
 * Coverage:
 *   - Titlebar drag → moves container
 *   - Resize-handle drag → resizes container (this one fires inside the
 *     `updateSize` reactivity path that's most likely to trigger child
 *     remounts via `resizeKey`)
 */

const BLANK_FLOOR = 3000;

async function wireContextLossListeners(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const w = window as any;
    w.__cathodeContextLossCount = 0;
    w.__cathodeLossLog          = [] as any[];
    const wire = (c: HTMLCanvasElement) => {
      c.addEventListener('webglcontextlost', () => {
        w.__cathodeContextLossCount++;
        w.__cathodeLossLog.push({
          parent:  c.parentElement?.className || c.parentElement?.tagName || '?',
          visible: (c as HTMLElement).offsetParent !== null,
        });
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

async function getContextLoss(page: import('@playwright/test').Page) {
  return await page.evaluate(() => ({
    count: (window as any).__cathodeContextLossCount ?? 0,
    log:   (window as any).__cathodeLossLog          ?? [],
  }));
}

test.describe('CathodeContainer interaction', () => {

  test('titlebar drag: rapid container move does not blank canvases', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.addInitScript(() => localStorage.clear());

    await page.goto('/');
    // Default tab is workspace
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await wireContextLossListeners(page);

    // Use the trades container (has CathodeGrid → real canvas inside)
    const titlebar = page.locator('#cc-trades .cc-titlebar');
    const box      = await titlebar.boundingBox();
    if (!box) throw new Error('trades titlebar not found');

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Drag through several waypoints at 60Hz-ish rate. The corners exercise
    // clamping logic too.
    const path = [
      { dx: 200, dy:   0  },
      { dx: 200, dy: 100 },
      { dx:   0, dy: 200 },
      { dx: -200, dy: 100 },
      { dx: -200, dy:   0 },
      { dx:   0, dy:   0 },
    ];
    const STEPS = 25;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    let curX = startX, curY = startY;
    for (const wp of path) {
      const targetX = startX + wp.dx;
      const targetY = startY + wp.dy;
      for (let i = 1; i <= STEPS; i++) {
        const t = i / STEPS;
        await page.mouse.move(
          curX + (targetX - curX) * t,
          curY + (targetY - curY) * t,
          { steps: 1 },
        );
      }
      curX = targetX; curY = targetY;
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    const loss  = await getContextLoss(page);
    expect(loss.count, `${loss.count} WebGL context-loss events during drag (sample: ${JSON.stringify(loss.log.slice(0, 3))})`).toBe(0);

    // Trades grid canvas should still be rendering
    const tradesCanvas = page.locator('#cc-trades canvas').first();
    const post         = (await tradesCanvas.screenshot()).length;
    expect(post, `trades canvas blanked after drag (${post} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });

  test('resize handle drag: rapid container resize does not blank canvases', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.addInitScript(() => localStorage.clear());

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await wireContextLossListeners(page);

    // Resize handle sits in the bottom-right corner of each container
    const handle = page.locator('#cc-trades .cc-resize');
    const box    = await handle.boundingBox();
    if (!box) throw new Error('trades resize handle not found');

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Aggressive sizing sweep — shrink, grow, shrink, settle
    const path = [
      { dx: -200, dy: -150 },
      { dx:  300, dy:  200 },
      { dx: -100, dy:  -50 },
      { dx:    0, dy:    0 },
    ];
    const STEPS = 30;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    let curX = startX, curY = startY;
    for (const wp of path) {
      const targetX = startX + wp.dx;
      const targetY = startY + wp.dy;
      for (let i = 1; i <= STEPS; i++) {
        const t = i / STEPS;
        await page.mouse.move(
          curX + (targetX - curX) * t,
          curY + (targetY - curY) * t,
          { steps: 1 },
        );
      }
      curX = targetX; curY = targetY;
    }
    await page.mouse.up();
    await page.waitForTimeout(400);   // ResizeObserver + redraw settle

    const loss = await getContextLoss(page);
    expect(loss.count, `${loss.count} WebGL context-loss events during resize (sample: ${JSON.stringify(loss.log.slice(0, 3))})`).toBe(0);

    const tradesCanvas = page.locator('#cc-trades canvas').first();
    const post         = (await tradesCanvas.screenshot()).length;
    expect(post, `trades canvas blanked after resize (${post} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });
});
