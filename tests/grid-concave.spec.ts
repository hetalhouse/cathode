import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';
import { applyBarrel, screenToCanvas } from '../src/CanvasGrid';
import { curvatureToStrength } from '../src/lensShader';

/**
 * Concave bending (negative curvature). The barrel pipeline is signed:
 * positive = convex (classic CRT bulge), negative = concave (pincushion).
 * Guards three things:
 *   1. the shared curvature→strength mapping (concave branch boosted — the
 *      border-pinning damps interior bow, so −45 needs more raw strength)
 *   2. concave is BORDER-PINNED: headers / edge columns can never leave the
 *      screen (the 0.5.0 mapping pushed edge content off-display at high
 *      strength — the header-vanishing bug), and CPU hit-testing stays
 *      coherent with the GPU pixels (no bezel false-positives)
 *   3. the shader visibly renders three distinct states (convex / flat /
 *      concave) rather than silently clamping negatives
 */

const HEADER_H = 30;

// ── 1. pure math on the shared mapping + barrel formula ───────────────────────

test.describe('curvatureToStrength + signed barrel math', () => {
  test('mapping: endpoints, sign, and flatness', () => {
    expect(curvatureToStrength(0)).toBe(0);
    expect(curvatureToStrength(45)).toBeCloseTo(0.55, 10);
    expect(curvatureToStrength(-45)).toBeCloseTo(-1.4, 10);
    expect(curvatureToStrength(20)).toBeGreaterThan(0);
    expect(curvatureToStrength(-20)).toBeLessThan(0);
  });

  test('concave is border-pinned: edges never move, interior bows', () => {
    const s = curvatureToStrength(-45);
    // Border pinned exactly — headers (top edge), first/last columns, corners:
    for (const [x, y] of [[0.5, 1], [0.5, 0], [0, 0.5], [1, 0.5], [1, 1], [0, 0]] as const) {
      const [bx, by] = applyBarrel(x, y, s);
      expect(bx, `x pinned at ${x},${y}`).toBeCloseTo(x, 10);
      expect(by, `y pinned at ${x},${y}`).toBeCloseTo(y, 10);
    }
    // Interior genuinely bows inward (the dish):
    const [ix, iy] = applyBarrel(0.25, 0.25, s);
    expect(ix).toBeGreaterThan(0.25 + 0.005);
    expect(iy).toBeGreaterThan(0.25 + 0.0005); // Y attenuated ×0.15 in the CPU mirror
  });

  test('concave stays in range, convex pushes outward, no fold-over', () => {
    const s = curvatureToStrength(-45);
    // corner: convex leaves [0,1] (bezel); concave corner is pinned (no bezel)
    const [cx] = applyBarrel(1, 1, curvatureToStrength(45));
    expect(cx).toBeGreaterThan(1);
    // dense sweep: concave samples never leave [0,1] and never fold past center
    for (let x = 0; x <= 1.001; x += 0.05) for (let y = 0; y <= 1.001; y += 0.05) {
      const [bx, by] = applyBarrel(x, y, s);
      expect(bx).toBeGreaterThanOrEqual(-1e-9);
      expect(bx).toBeLessThanOrEqual(1 + 1e-9);
      expect(by).toBeGreaterThanOrEqual(-1e-9);
      expect(by).toBeLessThanOrEqual(1 + 1e-9);
      if (x > 0.5) expect(bx).toBeGreaterThan(0.5);
      if (x < 0.5) expect(bx).toBeLessThan(0.5);
    }
    // screenToCanvas: concave must NEVER report the bezel region
    for (const [sx, sy] of [[0, 0], [799, 0], [0, 599], [799, 599], [400, 300]] as const) {
      const [mx] = screenToCanvas(sx, sy, 800, 600, s);
      expect(mx, `bezel at ${sx},${sy}`).toBeGreaterThanOrEqual(0);
    }
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
      return page.screenshot({ clip: { x: box.x, y: box.y, width: 60, height: 40 } });
    };
    const flat = await shot(0);
    const convex = await shot(45);
    const concave = await shot(-45);
    expect(Buffer.compare(convex, flat), 'convex must differ from flat').not.toBe(0);
    expect(Buffer.compare(concave, flat), 'concave must differ from flat').not.toBe(0);
    expect(Buffer.compare(concave, convex), 'concave must differ from convex').not.toBe(0);

    // hit-testing under full concave: click near the left edge (max distortion),
    // extend 1×1 → 2×2, copy — a TSV rectangle proves clicks map to real cells
    await slider.fill('-45');
    await page.waitForTimeout(250);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    await page.mouse.click(box.x + 60, box.y + HEADER_H + 40);
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
