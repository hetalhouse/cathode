import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';
import { layoutFilterPopup, hitFilterPopup } from '../src/CanvasGrid';

/**
 * In-canvas filter popup (0.6 — the first overlay surface). The popup is DRAWN
 * into the offscreen canvas after the body pass, so it warps with the panel;
 * an invisible real <input> (the ghost) carries focus/IME/keystrokes. Guards:
 *   1. layout clamps inside the panel; hit zones route input/clear/outside
 *   2. the ghost bridge: click icon → type → rows filter; Escape clears
 *   3. the popup actually renders in-canvas and BENDS (differs flat vs −45)
 */

test.describe('filter popup layout + hit zones', () => {
  test('layout clamps; zones route; ✕ widens with local scale', () => {
    const l = layoutFilterPopup(1000, 400, true);
    expect(l.box.x).toBe(400);
    expect(l.clear).not.toBeNull();
    // clamped at the right edge
    const r = layoutFilterPopup(1000, 990, false);
    expect(r.box.x + r.box.w).toBeLessThanOrEqual(996);
    expect(r.clear).toBeNull();
    // zones
    expect(hitFilterPopup(l.input.x + 5, l.input.y + 5, l)).toBe('input');
    expect(hitFilterPopup(l.clear!.x + 5, l.clear!.y + 5, l)).toBe('clear');
    expect(hitFilterPopup(l.box.x + 2, l.box.y + 2, l)).toBe('inside');
    expect(hitFilterPopup(l.box.x - 10, l.box.y, l)).toBe('outside');
    // scale-widened ✕: a click 5px left of the zone hits at scale 2.5, not at 1
    const nearClear = l.clear!.x - 5;
    expect(hitFilterPopup(nearClear, l.clear!.y + 5, l, 2.5)).toBe('clear');
    expect(hitFilterPopup(nearClear, l.clear!.y + 5, l, 1)).toBe('inside'); // the input↔✕ gap
  });
});

test.describe('filter popup end-to-end', () => {
  test('icon click opens in-canvas popup; typing filters; Escape clears; popup bends', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    // flat coordinates for a precise icon click
    const slider = page.locator('input[type=range]').first();
    await slider.fill('0');
    await page.waitForTimeout(250);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    const pagin = page.locator('.tab-content:visible .cathode-pagination span').first();
    const totalOf = async () => Number((await pagin.textContent())!.split('/')[1].replace(/[^0-9]/g, ''));
    const before = await totalOf();

    // popup region screenshot helper (just below the header, at the Status column)
    const popShot = () => page.screenshot({ clip: { x: box.x + 420, y: box.y + 30, width: 210, height: 60 } });
    const closedShot = await popShot();

    // Status column: hint widths 148+148+80+72 → icon zone ends at x≈448
    await page.mouse.click(box.x + 440, box.y + 15);
    await page.waitForTimeout(300);
    const openShot = await popShot();
    expect(Buffer.compare(openShot, closedShot), 'popup renders in-canvas').not.toBe(0);

    // ghost input carries the keystrokes → rows filter down
    await page.keyboard.type('open');
    await page.waitForTimeout(400);
    const filtered = await totalOf();
    expect(filtered).toBeLessThan(before);
    expect(filtered).toBeGreaterThan(0);

    // the popup bends with the panel: same region differs at −45 (popup still open)
    await slider.fill('-45');
    await page.waitForTimeout(300);
    const bentShot = await popShot();
    expect(Buffer.compare(bentShot, openShot), 'popup warps with the panel').not.toBe(0);
    await slider.fill('0');
    await page.waitForTimeout(250);

    // the slider stole focus — click back into the popup's input to refocus the ghost
    await page.mouse.click(box.x + 400, box.y + 53);
    await page.waitForTimeout(150);

    // Escape clears the filter and closes the popup
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    expect(await totalOf()).toBe(before);

    expect(watch.entries, 'no GL warnings').toEqual([]);
  });
});
