import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';
import { applyBarrel, screenToCanvas, isOnResizeHandle, isOnFilterIcon } from '../src/CanvasGrid';
import { curvatureToStrength } from '../src/lensShader';

/**
 * Concave bending (negative curvature). The barrel pipeline is signed:
 * positive = convex (classic CRT bulge), negative = concave (pincushion).
 * Guards three things:
 *   1. the shared curvature→strength mapping (linear, symmetric — the fit
 *      rescale lives in the barrel map itself, not the mapping)
 *   2. concave FIT-TO-CONTENT: the full dish silhouette is kept, but the
 *      sampled field is rescaled so screen corners hit the texture corners —
 *      every content pixel (headers, edge columns) is displayed at ANY
 *      strength (0.5.0 cropped the outer ~8%; 0.5.1 pinned the border and
 *      flattened the look), and CPU hit-testing mirrors the GPU faithfully
 *   3. the shader visibly renders three distinct states (convex / flat /
 *      concave) rather than silently clamping negatives
 */

const HEADER_H = 30;

// ── 1. pure math on the shared mapping + barrel formula ───────────────────────

test.describe('curvatureToStrength + signed barrel math', () => {
  test('mapping: endpoints, sign, and flatness', () => {
    expect(curvatureToStrength(0)).toBe(0);
    expect(curvatureToStrength(45)).toBeCloseTo(0.55, 10);
    expect(curvatureToStrength(-45)).toBeCloseTo(-0.55, 10);
    expect(curvatureToStrength(20)).toBeGreaterThan(0);
    expect(curvatureToStrength(-20)).toBeLessThan(0);
  });

  test('concave fit-to-content: corners exact, midlines pinch, full header strip displayed', () => {
    const s = curvatureToStrength(-45);
    // Screen corners sample EXACTLY the texture corners (nothing can crop):
    for (const [x, y] of [[1, 1], [0, 0], [1, 0], [0, 1]] as const) {
      const [bx, by] = applyBarrel(x, y, s);
      expect(bx, `corner x at ${x},${y}`).toBeCloseTo(x, 10);
      expect(by, `corner y at ${x},${y}`).toBeCloseTo(y, 10);
    }
    // Edge midpoints overshoot [0,1] — the pincushion pinch (renders as bezel):
    expect(applyBarrel(0.5, 1, s)[1]).toBeGreaterThan(1);
    expect(applyBarrel(1, 0.5, s)[0]).toBeGreaterThan(1);
    // The user-facing guarantee: the header strip (texture top 5%) is sampled
    // across the FULL width — for every column band some screen pixel displays it.
    const seen = new Array(20).fill(false);
    for (let sx = 0; sx <= 1.0001; sx += 0.005) {
      for (let sy = 1; sy >= 0.70; sy -= 0.004) {
        const [tx, ty] = applyBarrel(sx, sy, s);
        if (ty >= 0.95 && ty <= 1 && tx >= 0 && tx <= 1) seen[Math.min(19, Math.floor(tx * 20))] = true;
      }
    }
    expect(seen.every(Boolean), `header visible in all 20 column bands: ${seen}`).toBe(true);
  });

  test('monotonic, no fold-over; convex unchanged', () => {
    const s = curvatureToStrength(-45);
    const [cx] = applyBarrel(1, 1, curvatureToStrength(45));
    expect(cx).toBeGreaterThan(1); // convex corner still overshoots into bezel
    // axes: strictly monotone about the center (no fold along rows/columns).
    // (Diagonal extreme corners fold slightly — a pre-existing 0.5.0-map quirk.)
    for (let x = 0; x <= 1.001; x += 0.02) {
      const [bx] = applyBarrel(x, 0.5, s);
      if (x > 0.5) expect(bx).toBeGreaterThan(0.5);
      if (x < 0.5) expect(bx).toBeLessThan(0.5);
    }
    // the pinch IS bezel (by design) at edge midpoints; the center is content
    expect(screenToCanvas(400, 0, 800, 600, s)[0]).toBe(-1);
    expect(screenToCanvas(400, 300, 800, 600, s)[0]).toBeGreaterThanOrEqual(0);
  });
});

test.describe('scale-aware header hit zones', () => {
  test('center local scale ≈ fit-rescale factor at −45; zones widen accordingly', () => {
    const s = curvatureToStrength(-45);
    // local canvas-per-screen density at the screen center (two-point probe,
    // same math hitScaleX uses): ≈ k = 1/(1−2·cornerPull) ≈ 1.54 at −45
    const [a] = applyBarrel(0.495, 0.5, s);
    const [b] = applyBarrel(0.505, 0.5, s);
    const local = Math.abs(b - a) / 0.01;
    expect(local).toBeGreaterThan(1.4);
    expect(local).toBeLessThan(1.7);
    // the 6px handle at scale 1.54 accepts a hit 9px out; at scale 1 it doesn't
    expect(isOnResizeHandle(100 - 8, 0, 100, local)).toBe(true);
    expect(isOnResizeHandle(100 - 8, 0, 100)).toBe(false);
    // filter icon zone widens the same way, still capped at the column edge
    expect(isOnFilterIcon(100 - 30, 0, 100, local)).toBe(true);
    expect(isOnFilterIcon(100 - 30, 0, 100)).toBe(false);
    expect(isOnFilterIcon(101, 0, 100, local)).toBe(false);
  });
});

// ── 2 + 3. live demo: hit-testing + visible three-state rendering ─────────────

test.describe('CathodeGrid concave rendering + interaction', () => {
  test('clicks select cells at curvature −45; convex/flat/concave render distinctly', async ({ page, context, browserName }) => {
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    const slider = page.locator('input[type=range]').first(); // shared demo-bar Curve slider

    // capture a corner region at three curvatures — all three must differ
    const shot = async (curv: number) => {
      await slider.fill(String(curv));
      await page.waitForTimeout(250);
      const box = await canvas.boundingBox();
      if (!box) throw new Error('canvas not found');
      // top-center: flat=content flush, convex=thin bezel arc, concave=deep arc + bowed header
      return page.screenshot({ clip: { x: box.x + box.width / 2 - 60, y: box.y, width: 120, height: 80 } });
    };
    const flat = await shot(0);
    const convex = await shot(45);
    const concave = await shot(-45);
    expect(Buffer.compare(convex, flat), 'convex must differ from flat').not.toBe(0);
    expect(Buffer.compare(concave, flat), 'concave must differ from flat').not.toBe(0);
    expect(Buffer.compare(concave, convex), 'concave must differ from convex').not.toBe(0);

    // hit-testing under full concave: click left-of-center content (the extreme
    // left edge is pinch-BEZEL at −45 by design — clicks there correctly no-op),
    // extend 1×1 → 2×2, copy — a TSV rectangle proves clicks map to real cells
    await slider.fill('-45');
    await page.waitForTimeout(250);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    // deep concave pulls the header far down-screen — probe well into the body
    await page.mouse.click(box.x + 300, box.y + HEADER_H + 150);
    await page.waitForTimeout(100);
    await page.keyboard.press('Shift+ArrowRight');
    await page.keyboard.press('Shift+ArrowDown');
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyC' : 'Control+KeyC');
    await page.waitForTimeout(150);
    if (browserName === 'chromium') {
      const tsv: string = await page.evaluate(() => navigator.clipboard.readText());
      const rows = tsv.trim().split('\n');
      expect(rows.length, 'selection spans 2 rows').toBe(2);
      expect(rows[0].split('\t').length, 'selection spans 2 cols').toBe(2);
    }

    expect(watch.entries, 'no GL warnings under concave').toEqual([]);
  });
});
