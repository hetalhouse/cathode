import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { collectConsoleErrors } from './_helpers';

/**
 * GOLDEN for the title bar's DEFAULT look: the bar canvas of two panels (one with actions + all three controls, one plain) hashed in every state a user can put it in — resting, focused,
 * a hovered control, a hovered action, minimised, maximised. Generated BEFORE the bar became themeable (UPDATE_GOLDEN=1 regenerates), so the opt-in bar colours / cockpit style / info
 * control are proved not to touch the default one. (page.evaluate callbacks run in the page.)
 */
const GOLDEN = 'tests/__golden__/stage-bar.json';
const hash = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 12);

async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(800);
}
const bar = (page: Page, id: string) => page.evaluate(([i]) => { const c = (window as any).__stage3d.stage.panels.get(i).bar.material.map.image as HTMLCanvasElement; return c.toDataURL(); }, [id]);
const ids = (page: Page) => page.evaluate(() => [...(window as any).__stage3d.stage.panels.keys()] as string[]);

test('the default title bar, in every state (golden)', async ({ page }) => {
  const watch = collectConsoleErrors(page);
  await open(page);
  const out: Record<string, string> = {};
  const snap = async (k: string, id: string) => { await page.waitForTimeout(150); out[`${id} · ${k}`] = hash(await bar(page, id)); };
  const all = await ids(page);
  const targets = ['tilt', all.find((i) => i !== 'tilt' && i !== 'wall' && i !== 'log' && i !== 'chart')!];
  for (const id of targets) {
    await page.evaluate(([i]) => { const s = (window as any).__stage3d.stage; s.setFocus(null); }, [id]);
    await snap('resting', id);
    await page.evaluate(([i]) => (window as any).__stage3d.stage.setFocus(i), [id]); await snap('focused', id);
    const c = await page.evaluate(([i]) => (window as any).__stage3d.stage.clientPointForControl(i, 'maximize'), [id]);
    await page.mouse.move(c.x, c.y); await snap('hover control', id);
    if (id === 'tilt') { const a = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForAction('tilt', '15m')); await page.mouse.move(a.x, a.y); await snap('hover action', id); }
    await page.mouse.move(5, 5);
    await page.evaluate(([i]) => (window as any).__stage3d.stage.panels.get(i).setMaximized(true), [id]); await snap('maximised', id);
    await page.evaluate(([i]) => (window as any).__stage3d.stage.panels.get(i).setMaximized(false), [id]);
    await page.evaluate(([i]) => (window as any).__stage3d.stage.setPanelMinimized(i, true), [id]); await snap('minimised', id);
    await page.evaluate(([i]) => (window as any).__stage3d.stage.setPanelMinimized(i, false), [id]);
  }
  expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  expect(new Set(Object.values(out)).size, 'the states look different from each other').toBeGreaterThan(6);
  if (process.env.UPDATE_GOLDEN || !existsSync(GOLDEN)) { writeFileSync(GOLDEN, JSON.stringify(out, null, 2) + '\n'); return; }
  expect(out).toEqual(JSON.parse(readFileSync(GOLDEN, 'utf8')));
});
