import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeTerminal regression tests. The component renders the prompt +
 * draft + cursor INLINE as the last entry on the inner CathodeLog canvas
 * (no separate input row); a hidden HTML input captures keystrokes. The
 * demo wires a small echo handler so we can drive the full round-trip
 * without a backend.
 *
 * Coverage:
 *   - Tab mounts cleanly (no console errors), canvas shows the seed
 *     entries + the prompt phantom
 *   - Submit emits + the echo handler appends both the user line and the
 *     handler's response into the scrollback (visible byte-delta on canvas)
 *   - History navigation: ↑ recalls the last command; ↓ past it restores
 *     the in-progress draft
 *   - Cursor blink: byte-delta within ~1.5s confirms the canvas is
 *     redrawing as the cursor toggles
 */

const BLANK_FLOOR = 3000;

test.describe('CathodeTerminal', () => {

  test('renders the Terminal tab without console errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    // Scrollback canvas drew the seed entry + the prompt phantom
    const bytes = (await canvas.screenshot()).length;
    expect(bytes, `terminal scrollback canvas appears blank (${bytes} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    // Hidden input is in the DOM (it's `pointer-events: none`, which the
    // is-visible heuristic treats as still visible — confirm by attached state)
    const input = page.getByTestId('ct-input');
    await expect(input).toBeAttached();

    expect(watch.entries).toEqual([]);
  });

  test('cursor blinks (canvas bytes change while idle)', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(200);

    // Sample N times across a window > 2 blink cycles. Two-sample compares
    // are flaky because the screenshots can land on the same blink phase.
    // The blink toggles every 530ms — sampling 8 times over 2s catches both
    // states reliably.
    const samples: number[] = [];
    for (let i = 0; i < 8; i++) {
      samples.push((await canvas.screenshot()).length);
      await page.waitForTimeout(250);
    }
    const distinct = new Set(samples).size;
    expect(distinct,
      `canvas only produced ${distinct} distinct screenshot size(s) across 2s of sampling — cursor isn't redrawing. samples=${samples.join(',')}`,
    ).toBeGreaterThanOrEqual(2);

    expect(watch.entries).toEqual([]);
  });

  test('submit echoes the command + handler response into the scrollback', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    const baseline = (await canvas.screenshot()).length;

    // Type + submit
    const input = page.getByTestId('ct-input');
    await input.fill('echo regression-check');
    await input.press('Enter');

    // Demo's echo handler intentionally simulates 180ms latency so the busy
    // spinner shows up — wait past that.
    await page.waitForTimeout(400);

    const afterBytes = (await canvas.screenshot()).length;
    expect(afterBytes,
      `scrollback bytes did not change after submit (${baseline} → ${afterBytes}) — handler did not run`,
    ).not.toBe(baseline);

    // Input cleared on submit
    await expect(input).toHaveValue('');

    expect(watch.entries).toEqual([]);
  });

  test('arrow-up recalls last command; arrow-down restores in-progress draft', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();
    await page.locator('.tab-content:visible canvas').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    const input = page.getByTestId('ct-input');

    // Submit twice so history has two entries
    await input.fill('first');
    await input.press('Enter');
    await page.waitForTimeout(220);
    await input.fill('second');
    await input.press('Enter');
    await page.waitForTimeout(220);

    // Type a fresh draft, then ↑ should snapshot it and recall 'second'
    await input.fill('in-progress');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('second');

    // ↑ again — recall 'first'
    await input.press('ArrowUp');
    await expect(input).toHaveValue('first');

    // ↓ moves forward — back to 'second'
    await input.press('ArrowDown');
    await expect(input).toHaveValue('second');

    // ↓ past the most recent entry — restore the snapshot
    await input.press('ArrowDown');
    await expect(input).toHaveValue('in-progress');

    expect(watch.entries).toEqual([]);
  });
});
