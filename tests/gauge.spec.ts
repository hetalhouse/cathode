import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeGauge — the bipolar gauge surface (readout · needle on a left↔right axis · caption ·
 * chips) through the same Three.js + CanvasTexture + barrel pipeline as the other surfaces.
 * Smoke + regression: it mounts, the needle moves when the value changes (Tilt), every
 * theme / the lens / both bend directions redraw, and a viewport sweep stays GL-clean.
 */
test.describe('CathodeGauge', () => {
  test('mounts through the pipeline; the needle moves on Tilt; viewport sweep stays clean', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Gauge$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(900); // the mount sweep (centre → value) settles

    const before = await canvas.screenshot();
    expect(before.length, 'gauge canvas appears blank').toBeGreaterThan(1500);

    // a new tilt → the needle eases to it → the pixels change
    await page.getByTestId('cf-tilt').click();
    await page.waitForTimeout(900);
    const after = await canvas.screenshot();
    expect(Buffer.compare(before, after), 'the needle did not move on Tilt').not.toBe(0);

    for (const s of [{ width: 800, height: 600 }, { width: 1600, height: 900 }, { width: 1024, height: 768 }, { width: 1280, height: 800 }]) {
      await page.setViewportSize(s);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(200);
    expect(watch.entries, `console emitted GL/page errors:\n${JSON.stringify(watch.entries, null, 2)}`).toEqual([]);
  });

  test('themes, the magnify lens and both bend directions redraw without GL errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Gauge$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(500);

    for (const theme of ['phosphor', 'amber', 'paper', 'none']) {
      await page.locator('select').first().selectOption(theme);
      await page.waitForTimeout(120);
    }
    await page.getByTestId('cf-magnify').check();
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5, { steps: 6 });
    await page.waitForTimeout(120);
    await page.getByTestId('cf-magnify').uncheck();
    const slider = page.locator('input[type="range"]').first();
    for (const v of ['-45', '0', '45', '10']) {
      await slider.fill(v);
      await page.waitForTimeout(100);
    }
    const shot = await canvas.screenshot();
    expect(shot.length, 'gauge canvas appears blank after the sweep').toBeGreaterThan(1500);
    expect(watch.entries, `console emitted GL/page errors:\n${JSON.stringify(watch.entries, null, 2)}`).toEqual([]);
  });
});
