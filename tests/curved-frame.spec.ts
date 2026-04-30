import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CurvedFrame regression tests.
 *
 * CurvedFrame is the CSS-based CRT shell — bezel + scanlines + vignette
 * over arbitrary HTML slot content. Unlike CathodeGrid / CathodeLog it
 * has no canvas / WebGL pipeline; the discipline here is:
 *
 *   1. Slot content stays interactive (the overlays must use
 *      pointer-events: none — clicks reach the wrapped content)
 *   2. Theme switching applies in computed style
 *   3. Curvature slider doesn't blank or break the slot
 *   4. No console errors at any point
 */

test.describe('CurvedFrame', () => {

  test('renders + slot content stays interactive', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Frame$/ }).click();

    // The CurvedFrame wrapper should mount with all three overlay layers
    const wrap = page.locator('.tab-content:visible .curved-frame');
    await expect(wrap).toBeVisible();
    await expect(wrap).toHaveClass(/curved-frame-scanlines/);
    await expect(wrap).toHaveClass(/curved-frame-glow/);

    // Click the demo button — the overlays must NOT block pointer events.
    const btn = page.locator('.frame-demo-btn');
    await expect(btn).toContainText('Clicked 0×');
    await btn.click();
    await btn.click();
    await btn.click();
    await expect(btn).toContainText('Clicked 3×');

    // Type into the input — text should land in the slot
    const input = page.locator('.frame-demo-input');
    await input.fill('hello CRT');
    await expect(input).toHaveValue('hello CRT');

    expect(watch.entries).toEqual([]);
  });

  test('theme switch updates the computed background variable', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^Frame$/ }).click();
    const wrap = page.locator('.tab-content:visible .curved-frame');
    await expect(wrap).toBeVisible();

    // Default theme is 'none' — `--cf-bg` resolves to transparent
    const noneBg = await wrap.evaluate(el => getComputedStyle(el).getPropertyValue('--cf-bg').trim());
    expect(noneBg).toMatch(/transparent|rgba\(0,\s*0,\s*0,\s*0\)/);

    // Switch to phosphor — should apply a dark green bg
    await page.locator('select').selectOption('phosphor');
    await page.waitForTimeout(100);
    const phosphorBg = await wrap.evaluate(el => getComputedStyle(el).getPropertyValue('--cf-bg').trim());
    expect(phosphorBg.toLowerCase()).toMatch(/060d06|^#060d06/);

    // Switch to paper — light bg
    await page.locator('select').selectOption('paper');
    await page.waitForTimeout(100);
    const paperBg = await wrap.evaluate(el => getComputedStyle(el).getPropertyValue('--cf-bg').trim());
    expect(paperBg.toLowerCase()).toMatch(/fafafa/);
  });

  test('curvature drag does not break interactivity or fire console errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Frame$/ }).click();

    const wrap  = page.locator('.tab-content:visible .curved-frame');
    const slider = page.locator('input[type="range"]').first();
    const box    = await slider.boundingBox();
    if (!box) throw new Error('curvature slider not found');

    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.55, y);
    await page.mouse.down();
    // Sweep through a few values rapidly
    for (const t of [0.2, 0.8, 0.3, 0.95, 0.55]) {
      const x = box.x + box.width * t;
      // steps:1 to force a per-step input event
      for (let i = 1; i <= 10; i++) {
        await page.mouse.move(x, y, { steps: 1 });
      }
    }
    await page.mouse.up();
    await page.waitForTimeout(200);

    // Slot content should still be interactive after curvature moves
    await expect(wrap).toBeVisible();
    const btn = page.locator('.frame-demo-btn');
    await btn.click();
    await expect(btn).toContainText(/Clicked \d+×/);

    expect(watch.entries).toEqual([]);
  });
});
