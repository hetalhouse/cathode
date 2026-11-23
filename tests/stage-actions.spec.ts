import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Title-bar ACTIONS (text buttons with an active state, left of the controls) and the ✕ close control. The stage draws and hit-tests them and
 * reports clicks; what they do is the host's call. (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
const act = (page: Page, id: string, a: string) => page.evaluate(([i, k]) => (window as any).__stage3d.stage.clientPointForAction(i, k), [id, a]);
const ctl = (page: Page, id: string, c: string) => page.evaluate(([i, k]) => (window as any).__stage3d.stage.clientPointForControl(i, k), [id, c]);
const actions = (page: Page, id: string) => page.evaluate(([i]) => (window as any).__stage3d.stage.panels.get(i).actions, [id]);
const evs = (page: Page, k: 'actionEvents' | 'controlEvents') => page.evaluate(([x]) => (window as any).__stage3d[x] as string[], [k]);
const barPic = (page: Page, id: string) => page.evaluate(([i]) => {
  const c = (window as any).__stage3d.stage.panels.get(i).bar.material.map.image as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let k = 0; k < d.length; k += 5) h = (h * 31 + d[k]) | 0; return h;
}, [id]);

test.describe('title-bar actions + close', () => {
  test('actions sit left of the controls, in order, without overlapping them or each other; the title squeezes clear of them', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const r = await page.evaluate(() => {
      const p = (window as any).__stage3d.stage.panels.get('tilt');
      return { rects: p.actionRects() as any[], ctl: ['minimize', 'maximize', 'close'].map((c) => p.controlRect(c)) as any[], w: p.content.width as number };
    });
    expect(r.rects.map((a) => a.id)).toEqual(['5m', '15m', '1H', '1D']);
    for (let i = 1; i < r.rects.length; i++) expect(r.rects[i].x, 'in order, not overlapping').toBeGreaterThanOrEqual(r.rects[i - 1].x + r.rects[i - 1].w);
    expect(r.rects.at(-1)!.x + r.rects.at(-1)!.w, 'clear of the first control').toBeLessThanOrEqual(r.ctl[0].x);
    expect(r.ctl[2].x + r.ctl[2].w, 'the ✕ is the last control, at the bar\'s right edge').toBeLessThanOrEqual(r.w);
    expect(await actions(page, 'tilt')).toEqual([{ id: '5m', label: '5m' }, { id: '15m', label: '15m' }, { id: '1H', label: '1H', active: true }, { id: '1D', label: '1D' }]);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('a click on an action is reported with its id — never a drag, never the "face the panel" double-click', async ({ page }) => {
    await open(page);
    const bar0 = await page.evaluate(() => (window as any).__stage3d.stage.panels.get('tilt').group.position.x);
    const c = (await act(page, 'tilt', '15m'))!;
    await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x + 3, c.y + 2); await page.mouse.up(); await page.waitForTimeout(150);
    expect(await evs(page, 'actionEvents')).toEqual(['tilt:15m']);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.panels.get('tilt').group.position.x), 'a press on a button is not a drag').toBe(bar0);
    await page.mouse.dblclick(c.x, c.y); await page.waitForTimeout(200);
    expect((await evs(page, 'actionEvents')).filter((e) => e === 'tilt:15m').length).toBe(3);   // a click, then two more for the double-click
    expect(await page.evaluate(() => (window as any).__stage3d.events.some((e: any) => e.e === 'activate')), 'and never "face this panel"').toBe(false);
  });

  test('setActions moves the active mark and repaints only when something changed', async ({ page }) => {
    await open(page);
    const before = await barPic(page, 'tilt');
    const c = (await act(page, 'tilt', '1D'))!;
    await page.mouse.click(c.x, c.y); await page.waitForTimeout(150);
    expect((await actions(page, 'tilt')).find((a: any) => a.active).id).toBe('1D');
    expect(await barPic(page, 'tilt'), 'the bar was repainted with the new active button').not.toBe(before);
    const dirty = await page.evaluate(() => { const p = (window as any).__stage3d.stage.panels.get('tilt'); p.setActions(p.actions); return p.barDirty as boolean; });
    expect(dirty, 'the same actions again: nothing is invalidated').toBe(false);
  });

  test('the close control (✕) is a control like the others: reported, hit-tested, and the title still fits', async ({ page }) => {
    await open(page);
    const c = (await ctl(page, 'tilt', 'close'))!;
    await page.mouse.click(c.x, c.y); await page.waitForTimeout(150);
    expect(await evs(page, 'controlEvents')).toContain('tilt:close');
    // a panel without actions / close is unchanged: its controls hit-test as before
    const m = (await ctl(page, 'trades', 'minimize'))!;
    await page.mouse.click(m.x, m.y); await page.waitForTimeout(150);
    expect(await evs(page, 'controlEvents')).toContain('trades:minimize');
  });
});
