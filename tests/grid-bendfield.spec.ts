import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';
import { screenToCanvas } from '../src/CanvasGrid';
import { fieldScale, curvatureToStrength } from '../src/lensShader';

/**
 * Bend-field gain (0.7): bending a panel SLIDES MORE COLUMNS IN — the offscreen
 * content canvas widens by exactly the factor the warp can absorb without
 * cropping, so distortion pays for field-of-view instead of being cosmetic.
 * Proof: a column that is OFF-SCREEN at flat (the demo's `reason` column,
 * content x≈1540–1627 of ~1900 total vs a ~1064px panel) is fully present and
 * INTERACTIVE at −45 — found through the same screen→content mapping the
 * component uses, then its filter icon is clicked and the filter applied.
 */

test.describe('fieldScale math', () => {
  test('endpoints, monotonicity, and the screen/texture split', () => {
    expect(fieldScale(0)).toBe(1);
    expect(fieldScale(-45)).toBeGreaterThan(1.5);
    expect(fieldScale(-45)).toBeLessThan(1.6);
    expect(fieldScale(45)).toBeGreaterThan(1.1);
    expect(fieldScale(45)).toBeLessThan(1.2);
    expect(fieldScale(-45)).toBeGreaterThan(fieldScale(-20));
    expect(fieldScale(-20)).toBeGreaterThan(1);
    // texW scaling: flat mapping into a 2× wider texture doubles the content x
    expect(screenToCanvas(400, 300, 800, 600, 0, 1600, 600)[0]).toBeCloseTo(800, 6);
    expect(screenToCanvas(400, 300, 800, 600, 0)[0]).toBeCloseTo(400, 6);
  });
});

test.describe('columns slide in as the panel bends', () => {
  test('the `reason` column is unreachable at flat, interactive at −45', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);
    const slider = page.locator('input[type=range]').first();
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');

    // demo column hints: reason spans content x 1539–1627 (filter icon = right 24px)
    const REASON_L = 1539, REASON_R = 1627;

    // FLAT: the content canvas equals the screen — reason is beyond the panel
    await slider.fill('0');
    await page.waitForTimeout(250);
    expect(box.width).toBeLessThan(REASON_L, 'panel must be narrower than the reason column at flat');

    // −45: content widens by fieldScale — find the icon through the SAME mapping
    await slider.fill('-45');
    await page.waitForTimeout(350);
    const s = curvatureToStrength(-45);
    const texW = Math.round(box.width * fieldScale(-45));
    const texH = box.height;
    expect(texW).toBeGreaterThan(REASON_R, 'bent field must reach past the reason column');
    let iconAt: [number, number] | null = null;
    // the bowed header sits well below the screen top toward the edges at −45 —
    // sweep the upper 45% of the panel
    outer: for (let sy = 4; sy <= box.height * 0.45; sy += 2) {
      for (let sx = Math.floor(box.width * 0.55); sx < box.width; sx += 2) {
        const [cx, cy] = screenToCanvas(sx, sy, box.width, box.height, s, texW, texH);
        if (cx >= REASON_R - 22 && cx <= REASON_R - 4 && cy >= 4 && cy <= 26) { iconAt = [sx, sy]; break outer; }
      }
    }
    expect(iconAt, 'a screen pixel maps into the reason filter icon at −45').not.toBeNull();

    const pagin = page.locator('.tab-content:visible .cathode-pagination span').first();
    const totalOf = async () => Number((await pagin.textContent())!.split('/')[1].replace(/[^0-9]/g, ''));
    const before = await totalOf();

    await page.mouse.click(box.x + iconAt![0], box.y + iconAt![1]);
    await page.waitForTimeout(300);
    await page.keyboard.type('SL');
    await page.waitForTimeout(400);
    const filtered = await totalOf();
    expect(filtered, 'filtering the slid-in column works').toBeLessThan(before);
    expect(filtered).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    expect(await totalOf()).toBe(before);

    expect(watch.entries, 'no GL warnings').toEqual([]);
  });
});
