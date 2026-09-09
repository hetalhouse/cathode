import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';
import { applyBarrel, screenToCanvas } from '../src/CanvasGrid';
import { curvatureToStrength } from '../src/lensShader';

/**
 * Concave bending (negative curvature). The barrel pipeline is signed:
 * positive = convex (classic CRT bulge), negative = concave (pincushion).
 * Guards three things:
 *   1. the shared curvature→strength mapping (linear, symmetric — the
 *      shader mirrors magnitude across the sign, so −45 bends as far as +45)
 *   2. CPU hit-testing stays coherent with the GPU pixels at negative
 *      strength (clicks land on cells; no bezel false-positives — concave
 *      never pushes UVs out of range, so there IS no bezel)
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

  test('concave mirrors convex: corner displacement magnitudes equal', () => {
    // The shader computes magnitude from |strength| and applies sign after,
    // so −45 must displace the corner exactly as far as +45 (inward).
    const conv = applyBarrel(1, 1, curvatureToStrength(45));
    const conc = applyBarrel(1, 1, curvatureToStrength(-45));
    const dConv = Math.hypot(conv[0] - 1, conv[1] - 1);
    const dConc = Math.hypot(conc[0] - 1, conc[1] - 1);
    expect(dConc).toBeCloseTo(dConv, 10);
  });

  test('concave pulls inward, convex pushes outward, no fold-over', () => {
    const s = curvatureToStrength(-45);
    // corner: convex leaves [0,1] (bezel), concave stays inside (no bezel)
    const [cx] = applyBarrel(1, 1, curvatureToStrength(45));
    const [kx, ky] = applyBarrel(1, 1, s);
    expect(cx).toBeGreaterThan(1);
    expect(kx).toBeLessThan(1);
    expect(kx).toBeGreaterThan(0.5); // no fold past center
    expect(ky).toBeGreaterThan(0.5);
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
