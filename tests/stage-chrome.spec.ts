import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { collectConsoleErrors } from './_helpers';

/**
 * Themeable chrome: the title bars' palette (setBarColors), the cockpit bar style (status dot + small tracked UPPERCASE title — what the dashboard's 2D windows wear), the ⓘ control, and
 * re-theming the in-scene Display menu live (setMenuColors). Everything is opt-in: the DEFAULT bar is pinned by stage-bar-golden, and these tests also prove that putting the defaults
 * back gives exactly the golden's pixels. (page.evaluate callbacks run in the page.)
 */
const GOLDEN = JSON.parse(readFileSync('tests/__golden__/stage-bar.json', 'utf8')) as Record<string, string>;
const hash = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 12);

async function open(page: Page, q = '') {
  await page.goto('/stage3d.html?static=1&curv=0' + q);
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(800);
}
const barUrl = (page: Page, id: string) => page.evaluate(([i]) => ((window as any).__stage3d.stage.panels.get(i).bar.material.map.image as HTMLCanvasElement).toDataURL(), [id]);
/** the bar's pixel at logical (x, y) */
const px = (page: Page, id: string, x: number, y: number) => page.evaluate(([i, X, Y]) => { const c = (window as any).__stage3d.stage.panels.get(i).bar.material.map.image as HTMLCanvasElement; const d = Math.min(devicePixelRatio || 1, 2);
  return [...c.getContext('2d')!.getImageData(Math.round((X as number) * d), Math.round((Y as number) * d), 1, 1).data] as number[]; }, [id, x, y]);

test.describe('themeable chrome', () => {
  test('setBarColors re-themes every bar live; putting the defaults back gives the default bar\'s exact pixels', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    await page.evaluate(() => (window as any).__stage3d.stage.setFocus(null));
    await page.waitForTimeout(150);
    expect(hash(await barUrl(page, 'tilt')), 'starts as the golden resting bar').toBe(GOLDEN['tilt · resting']);
    expect(await px(page, 'tilt', 3, 3)).toEqual([8, 19, 14, 255]);                          // #08130e
    await page.evaluate(() => (window as any).__stage3d.stage.setBarColors({ bg: '#102040', line: '#ff8800' }));
    await page.waitForTimeout(150);
    expect(await px(page, 'tilt', 3, 3)).toEqual([16, 32, 64, 255]);                         // the new bg …
    expect(await px(page, 'trades', 3, 3)).toEqual([16, 32, 64, 255]);                       // … on every panel
    expect((await px(page, 'tilt', 3, 24))[0], 'the bottom rule is the new line colour').toBe(255);
    await page.evaluate(() => (window as any).__stage3d.stage.setBarColors({ bg: '#08130e', line: '#2f6b4c' }));
    await page.waitForTimeout(150);
    expect(hash(await barUrl(page, 'tilt')), 'defaults back = the golden pixels').toBe(GOLDEN['tilt · resting']);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('the cockpit style adds a status dot and a small bold UPPERCASE title (live, reversible); the controls and actions still fit and still work', async ({ page }) => {
    await open(page);
    await page.evaluate(() => (window as any).__stage3d.stage.setFocus(null));
    const before = await barUrl(page, 'tilt');
    await page.evaluate(() => (window as any).__stage3d.stage.setBarStyle('cockpit'));
    await page.waitForTimeout(200);
    const after = await barUrl(page, 'tilt');
    expect(after).not.toBe(before);
    // the dot: the accent colour at its centre (12.5, 12) — the default accent is #6ee7a7
    const dot = await px(page, 'tilt', 12, 12);
    expect(dot[1], 'a green dot where the plain bar has nothing').toBeGreaterThan(150);
    expect(await px(page, 'tilt', 12, 12)).not.toEqual(await px(page, 'tilt', 3, 3));
    // the controls / actions are where they were and still report clicks
    const a = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForAction('tilt', '15m'));
    await page.mouse.click(a.x, a.y);
    expect(await page.evaluate(() => (window as any).__stage3d.actionEvents)).toContain('tilt:15m');
    const c = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForControl('tilt', 'minimize'));
    await page.mouse.click(c.x, c.y);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.panels.get('tilt').minimized)).toBe(true);
    await page.mouse.click(c.x, c.y);
    // back to plain = the plain bar again (the 15m click moved the active mark, so compare a panel without actions)
    await page.evaluate(() => (window as any).__stage3d.stage.setBarStyle('plain'));
    await page.waitForTimeout(200);
    expect(hash(await barUrl(page, 'trades'))).toBe(GOLDEN['trades · resting']);
  });

  test('?bar=cockpit: the whole bar wears the host palette (fill, title colour, dot) from the first frame', async ({ page }) => {
    await open(page, '&bar=cockpit');
    await page.evaluate(() => (window as any).__stage3d.stage.setFocus(null));
    await page.waitForTimeout(200);
    expect(await px(page, 'trades', 3, 3)).toEqual([0x12, 0x12, 0x2a, 255]);                // bg #12122a
    expect((await px(page, 'trades', 12, 12))[1], 'the accent dot (#00bc8c)').toBeGreaterThan(120);
    // the title's ink is the title colour (#40a0f0), not the plain text colour: some pixel on the title row is strongly blue
    const blue = await page.evaluate(() => { const c = (window as any).__stage3d.stage.panels.get('trades').bar.material.map.image as HTMLCanvasElement; const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 2] > 180 && d[i] < 120) n++; return n; });
    expect(blue, 'title ink in the themed title colour').toBeGreaterThan(30);
  });

  test('the ⓘ control: drawn, hit-tested left of the others, reported through onPanelControl (and it does nothing else)', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page, '&info=1');
    const r = await page.evaluate(() => { const p = (window as any).__stage3d.stage.panels.get('tilt'); return ['info', 'minimize', 'maximize', 'close'].map((c) => p.controlRect(c)) as { x: number; w: number }[]; });
    for (let i = 0; i < 3; i++) expect(r[i].x + r[i].w, `control ${i} clear of the next`).toBeLessThanOrEqual(r[i + 1].x);
    const c = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForControl('tilt', 'info'));
    await page.mouse.click(c.x, c.y);
    expect(await page.evaluate(() => (window as any).__stage3d.controlEvents)).toContain('tilt:info');
    expect(await page.evaluate(() => (window as any).__stage3d.stage.panels.get('tilt').maximized), 'ⓘ is not maximise').toBe(false);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('setMenuColors re-themes the Display menu: an open menu repaints at once, and the next one opens in the new colours', async ({ page }) => {
    await open(page);
    const menuBg = () => page.evaluate(() => { const m = (window as any).__stage3d.stage.menu, c = m.canvas as HTMLCanvasElement; const d = Math.min(devicePixelRatio || 1, 2);
      return [...c.getContext('2d')!.getImageData(Math.round(6 * d), Math.round(6 * d), 1, 1).data] as number[]; });
    const pt = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForContent('trades', 150, 120));
    await page.mouse.click(pt.x, pt.y, { button: 'right' }); await page.waitForTimeout(200);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.displayMenuPanel?.id)).toBe('trades');
    const was = await menuBg();
    await page.evaluate(() => (window as any).__stage3d.stage.setMenuColors({ bg: '#aa0000' }));
    await page.waitForTimeout(150);
    const now = await menuBg();
    expect(now).not.toEqual(was);
    expect(now[0], 'the open menu is now red').toBeGreaterThan(120);
    expect(now[1]).toBeLessThan(40);
  });
});
