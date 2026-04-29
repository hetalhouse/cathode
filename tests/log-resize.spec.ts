import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Companion to grid-resize.spec.ts — same texture-resize regression risk
 * applies to CathodeLog, which uses the same Three.js + CanvasTexture
 * pipeline as CathodeGrid. If a future refactor breaks the dispose-and-
 * recreate path, this test catches it on the log component too.
 *
 * Also acts as a smoke test that CathodeLog mounts cleanly with mock
 * entries and survives a viewport sweep without GL errors.
 */
test.describe('CathodeLog resize regression', () => {
  test('viewport sweep: zero GL warnings on the standalone log tab', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');

    await page.getByRole('button', { name: /^Log$/ }).click();

    // Multiple canvases live in the demo (one per tab, v-show'd). Scope to the
    // currently visible tab content so we wait for the LOG canvas, not the
    // grid tab's hidden one (which appears earlier in DOM order).
    await page.locator('.tab-content:visible canvas').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const sizes = [
      { width: 800,  height: 600  },
      { width: 1600, height: 900  },
      { width: 1920, height: 1080 },
      { width: 1024, height: 768  },
      { width: 1366, height: 768  },
      { width: 1280, height: 800  },
    ];

    for (const s of sizes) {
      await page.setViewportSize(s);
      await page.waitForTimeout(150);
    }

    await page.waitForTimeout(200);

    expect(
      watch.entries,
      `console emitted GL/page errors during resize:\n${JSON.stringify(watch.entries, null, 2)}`,
    ).toEqual([]);
  });

  /**
   * Smoke regression — discrete .fill() jumps to a few values. Catches a
   * fully-broken render but NOT the user-reported drag bug (only single
   * input events, no 60Hz cascade).
   */
  test('curvature slider: log canvas keeps content across discrete jumps', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');

    await page.getByRole('button', { name: /^Log$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    async function screenshotBytes(): Promise<number> {
      const buf = await canvas.screenshot();
      return buf.length;
    }

    const BLANK_FLOOR = 3000;
    expect(await screenshotBytes(), 'initial canvas appears blank').toBeGreaterThan(BLANK_FLOOR);

    const slider = page.locator('input[type="range"]').first();
    for (const value of ['10', '30', '0', '45', '25']) {
      await slider.fill(value);
      await page.waitForTimeout(150);
      const size = await screenshotBytes();
      expect(size, `log canvas blanked after curvature=${value} (${size} bytes)`).toBeGreaterThan(BLANK_FLOOR);
    }

    expect(watch.entries, `console errors during discrete jumps`).toEqual([]);
  });

  /**
   * Regression for the drag-bug the user reported: clicking either end of the
   * slider works fine, but DRAGGING blanks the log canvas. Drag fires
   * input events at ~60 Hz, which exposed a watcher cascade in the demo
   * (gridKey++ on every curvature change → CathodeGrid unmount/remount per
   * frame → rapid WebGL context churn → browser evicts the oldest live
   * context, which is the Log's).
   *
   * This test simulates a real mouse-drag rather than discrete fill() jumps,
   * also listens for `webglcontextlost` events on every canvas, and asserts
   * the log canvas is still rendering after the drag.
   */
  test('curvature slider: rapid mouse-drag does not blank the log canvas', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');

    await page.getByRole('button', { name: /^Log$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Wire a global counter for any webglcontextlost / contextrestored events
    // on any canvas. The demo gets WebGL context churn whenever the curvature
    // watcher cascades into mount/unmount, which is exactly what we're
    // looking for.
    await page.evaluate(() => {
      const w = window as any;
      w.__cathodeContextLossCount    = 0;
      w.__cathodeContextRestoreCount = 0;
      w.__cathodeLossLog             = [] as Array<{ idx: number; parent: string; visible: boolean }>;
      const all = () => Array.from(document.querySelectorAll('canvas')) as HTMLCanvasElement[];
      const wire = (c: HTMLCanvasElement) => {
        c.addEventListener('webglcontextlost', () => {
          w.__cathodeContextLossCount++;
          const idx     = all().indexOf(c);
          const visible = (c as HTMLElement).offsetParent !== null;
          const parent  = c.parentElement?.className || c.parentElement?.tagName || '?';
          w.__cathodeLossLog.push({ idx, parent, visible });
        });
        c.addEventListener('webglcontextrestored', () => w.__cathodeContextRestoreCount++);
      };
      all().forEach(wire);
      const obs = new MutationObserver(muts => {
        for (const m of muts) {
          for (const node of Array.from(m.addedNodes)) {
            if (node instanceof HTMLCanvasElement) wire(node);
            if (node instanceof HTMLElement) {
              node.querySelectorAll?.('canvas').forEach(c => wire(c as HTMLCanvasElement));
            }
          }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    });

    async function screenshotBytes(): Promise<number> {
      const buf = await canvas.screenshot();
      return buf.length;
    }

    const BLANK_FLOOR = 3000;
    expect(await screenshotBytes(), 'pre-drag canvas appears blank').toBeGreaterThan(BLANK_FLOOR);

    // Locate the slider's actual rendered geometry — needed to drag the thumb.
    const slider = page.locator('input[type="range"]').first();
    const box    = await slider.boundingBox();
    if (!box) throw new Error('curvature slider not found in DOM');

    const y = box.y + box.height / 2;
    // Default value 25 of [0..45] → thumb sits at ~55% across.
    const startX = box.x + box.width * 0.55;
    // Aggressive back-and-forth sweep: simulate 4 full strokes through the
    // range, each broken into many intermediate ticks. This is what reliably
    // reproduces the drag-blank bug — fill() to 10 and back doesn't.
    const strokes = [
      { from: 0.55, to: 0.10 },   // hard left
      { from: 0.10, to: 0.95 },   // hard right
      { from: 0.95, to: 0.30 },   // back to lowish
      { from: 0.30, to: 0.55 },   // settle near default
    ];
    const STEPS_PER_STROKE = 30;

    await page.mouse.move(startX, y);
    await page.mouse.down();
    for (const s of strokes) {
      for (let i = 1; i <= STEPS_PER_STROKE; i++) {
        const t  = i / STEPS_PER_STROKE;
        const fx = box.x + box.width * (s.from + (s.to - s.from) * t);
        // steps:1 forces the input event each call (no Playwright smoothing
        // would skip values).
        await page.mouse.move(fx, y, { steps: 1 });
      }
    }
    await page.mouse.up();

    // Allow any pending watchers / requestAnimationFrame cycles to settle
    await page.waitForTimeout(400);

    // Sanity: the slider value actually changed (drag went through)
    const finalValue = await slider.inputValue();
    expect(finalValue).not.toBe('25');

    // Did the log canvas survive?
    const post = await screenshotBytes();
    expect(post, `log canvas blanked after drag (${post} bytes, slider ended at ${finalValue})`).toBeGreaterThan(BLANK_FLOOR);

    // Did anything lose its WebGL context?
    const ctx = await page.evaluate(() => ({
      lost:     (window as any).__cathodeContextLossCount    ?? 0,
      restored: (window as any).__cathodeContextRestoreCount ?? 0,
      log:      (window as any).__cathodeLossLog             ?? [],
    }));
    // Per-canvas breakdown — useful diagnostic when this test fails
    console.log('Context loss breakdown:', JSON.stringify(ctx.log.slice(0, 10), null, 2), '...total entries:', ctx.log.length);
    expect(ctx.lost, `${ctx.lost} WebGL context-loss events fired during drag (first few: ${JSON.stringify(ctx.log.slice(0, 5))})`).toBe(0);

    expect(watch.entries, `console errors during drag:\n${JSON.stringify(watch.entries, null, 2)}`).toEqual([]);
  });
});
