import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * The Display menu, drawn IN the scene: a right-click on a panel opens a small quad on that panel's plane — Scan lines · Glow · Magnify · a Bend
 * stepper — and each row changes the panel at once and is reported (onPanelDisplay) so a host can persist it. A press on the menu never reaches the
 * content beneath; a press elsewhere closes it. (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
const pt = (page: Page, id: string, x: number, y: number) => page.evaluate(([i, a, b]) => (window as any).__stage3d.stage.clientPointForContent(i, a, b), [id, x, y] as [string, number, number]);
const row = (page: Page, r: string) => page.evaluate(([k]) => (window as any).__stage3d.stage.clientPointForMenuRow(k), [r]);
const disp = (page: Page, id: string) => page.evaluate(([i]) => (window as any).__stage3d.stage.panels.get(i).display, [id]);
const events = (page: Page) => page.evaluate(() => (window as any).__stage3d.displayEvents);
const menuOn = (page: Page) => page.evaluate(() => (window as any).__stage3d.stage.displayMenuPanel?.id ?? null);
const rightClick = async (page: Page, x: number, y: number) => { await page.mouse.click(x, y, { button: 'right' }); await page.waitForTimeout(150); };
const clickRow = async (page: Page, r: string) => { const c = (await row(page, r))!; await page.mouse.click(c.x, c.y); await page.waitForTimeout(120); };

test.describe('the Display menu, in the scene', () => {
  test('a right-click on a panel body opens the menu on THAT panel, drawn (not blank); the browser\'s own menu is not shown', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    expect(await menuOn(page)).toBeNull();
    const c = (await pt(page, 'trades', 200, 150))!;
    // a right-click on a panel is CONSUMED (it never reaches the page); one on empty space passes through untouched (the page's own context menu is its business)
    await page.evaluate(() => { (window as any).__cmReached = 0; document.addEventListener('contextmenu', () => { (window as any).__cmReached++; }); });
    await rightClick(page, c.x, c.y);
    expect(await menuOn(page)).toBe('trades');
    expect(await page.evaluate(() => (window as any).__cmReached), 'the panel took the right-click').toBe(0);
    await rightClick(page, 8, 300);
    expect(await menuOn(page), 'empty space closes it…').toBeNull();
    expect(await page.evaluate(() => (window as any).__cmReached), '…and the right-click goes on to the page').toBe(1);
    await rightClick(page, c.x, c.y);
    // it is drawn: the quad's texture has the labels' pixels
    const lit = await page.evaluate(() => {
      const m = (window as any).__stage3d.stage.menu?.mesh ?? (window as any).__stage3d.stage.displayMenuPanel.group.children.find((o: any) => o.renderOrder === 1_000_000);
      const cv = m.material.map.image as HTMLCanvasElement; const d = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 450) n++; return n;
    });
    expect(lit, 'the menu\'s text and boxes are on its texture').toBeGreaterThan(200);
    // the same on the gauge panel, and a right-click on a TITLE BAR also opens it
    const b = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForBar('tilt'));
    await rightClick(page, b.x - 120, b.y);
    expect(await menuOn(page), 'a title bar opens the menu on its panel').toBe('tilt');
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('Scan lines / Glow / Magnify toggle the panel at once, and each change is reported with the full state', async ({ page }) => {
    await open(page);
    const before = await disp(page, 'trades');
    const c = (await pt(page, 'trades', 200, 150))!;
    await rightClick(page, c.x, c.y);
    await clickRow(page, 'scanlines');
    expect((await disp(page, 'trades')).scanlines).toBe(!before.scanlines);
    await clickRow(page, 'glow');
    expect((await disp(page, 'trades')).glow).toBe(!before.glow);
    await clickRow(page, 'magnify');
    expect((await disp(page, 'trades')).magnify).toBe(!before.magnify);
    const ev = await events(page);
    expect(ev).toHaveLength(3);
    expect(ev[2]).toEqual({ id: 'trades', curvature: before.curvature, scanlines: !before.scanlines, glow: !before.glow, magnify: !before.magnify });
    expect(await menuOn(page), 'the menu stays open while you flip switches').toBe('trades');
    // toggling back restores
    await clickRow(page, 'scanlines'); await clickRow(page, 'glow'); await clickRow(page, 'magnify');
    expect(await disp(page, 'trades')).toEqual(before);
    // the other panel was never touched
    expect((await disp(page, 'tilt')).magnify).toBe(false);
  });

  test('the Bend stepper moves the curvature by 2 and stops at -40 / 40', async ({ page }) => {
    await open(page);
    const c = (await pt(page, 'trades', 200, 150))!;
    await rightClick(page, c.x, c.y);
    const start = (await disp(page, 'trades')).curvature;
    await clickRow(page, 'curve+'); await clickRow(page, 'curve+');
    expect((await disp(page, 'trades')).curvature).toBe(start + 4);
    await clickRow(page, 'curve-');
    expect((await disp(page, 'trades')).curvature).toBe(start + 2);
    // the screen actually bends: the same content point is drawn somewhere else once the curvature changed
    const p0 = await pt(page, 'trades', 100, 60);
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setDisplay({ curvature: 30 })); await page.waitForTimeout(150);
    const p1 = await pt(page, 'trades', 100, 60);
    expect(Math.hypot(p1.x - p0.x, p1.y - p0.y), 'a bend moves where content is drawn').toBeGreaterThan(1);
    // clamp
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setDisplay({ curvature: 39 }));
    await page.evaluate(() => (window as any).__stage3d.stage.openDisplayMenu('trades', 8, 8));
    await clickRow(page, 'curve+'); await clickRow(page, 'curve+');
    expect((await disp(page, 'trades')).curvature, 'stops at 40').toBe(40);
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setDisplay({ curvature: -39 }));
    await clickRow(page, 'curve-'); await clickRow(page, 'curve-');
    expect((await disp(page, 'trades')).curvature, 'stops at -40').toBe(-40);
  });

  test('a press on the menu never reaches the content beneath it; a press elsewhere closes it (and does what it was aimed at); Escape closes it', async ({ page }) => {
    await open(page);
    const c = (await pt(page, 'trades', 200, 100))!;
    await rightClick(page, c.x, c.y);
    const rowsBefore = await page.evaluate(() => (window as any).__stage3d.events.length);
    await clickRow(page, 'glow');                                   // lands on the grid cell under the menu — it must not be a grid click
    expect(await page.evaluate(() => (window as any).__stage3d.events.length), 'the grid heard nothing').toBe(rowsBefore);
    expect(await menuOn(page)).toBe('trades');
    // Escape closes
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    expect(await menuOn(page)).toBeNull();
    // a press elsewhere closes it AND acts: a click on a grid header sorts
    await rightClick(page, c.x, c.y);
    expect(await menuOn(page)).toBe('trades');
    const hdr = (await pt(page, 'trades', 200, 15))!;
    await page.mouse.click(hdr.x, hdr.y); await page.waitForTimeout(150);
    expect(await menuOn(page), 'closed by the press').toBeNull();
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.sortState.value.length), 'and the press still sorted').toBe(1);
    // a right-click on empty space closes it too
    await rightClick(page, c.x, c.y);
    await rightClick(page, 8, 300);
    expect(await menuOn(page)).toBeNull();
  });

  test('the menu stays inside its panel (a right-click near the bottom-right corner is clamped), and closes when the panel is dragged', async ({ page }) => {
    await open(page);
    const near = (await pt(page, 'trades', 630, 380))!;
    await rightClick(page, near.x, near.y);
    const r = await page.evaluate(() => {
      const st = (window as any).__stage3d.stage, p = st.displayMenuPanel, m = p.group.children.find((o: any) => o.renderOrder === 1_000_000);
      const ppu = st.pxPerUnit, bw = p.content.width, bh = p.content.height;
      const x0 = m.position.x * ppu + bw / 2 - 188 / 2, y0 = bh / 2 - m.position.y * ppu - 146 / 2;
      return { x0, y0, x1: x0 + 188, y1: y0 + 146, bw, bh };
    });
    expect(r.x0).toBeGreaterThanOrEqual(0); expect(r.y0).toBeGreaterThanOrEqual(0);
    expect(r.x1).toBeLessThanOrEqual(r.bw); expect(r.y1).toBeLessThanOrEqual(r.bh);
    const bar = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForBar('trades'));
    await page.mouse.move(bar.x - 100, bar.y); await page.mouse.down(); await page.mouse.move(bar.x - 140, bar.y + 40, { steps: 5 }); await page.mouse.up();
    expect(await menuOn(page), 'a drag closes it').toBeNull();
  });

  test('Magnify: with it on, the hover lens follows the pointer over that panel and lets go when it leaves; with it off there is no lens', async ({ page }) => {
    await open(page);
    const lens = (id: string) => page.evaluate(([i]) => { const u = (window as any).__stage3d.stage.panels.get(i).content.surface.material.uniforms; return { r: u.uLensR.value as number, x: u.uMouseUV.value.x as number }; }, [id]);
    const c = (await pt(page, 'trades', 300, 200))!;
    await page.mouse.move(c.x, c.y); await page.waitForTimeout(150);
    expect((await lens('trades')).r, 'off: no lens').toBe(0);
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setDisplay({ magnify: true }));
    await page.mouse.move(c.x + 3, c.y + 2); await page.waitForTimeout(200);
    const on = await lens('trades');
    expect(on.r, 'on: the lens has a radius').toBeGreaterThan(0); expect(on.x).toBeGreaterThan(0); expect(on.x).toBeLessThan(1);
    // the other panel has none
    expect((await lens('tilt')).r).toBe(0);
    // leaving the panel lets go
    await page.mouse.move(8, 300); await page.waitForTimeout(200);
    expect((await lens('trades')).r, 'gone when the pointer leaves').toBe(0);
    // turning it off mid-hover lets go too
    await page.mouse.move(c.x, c.y); await page.waitForTimeout(150);
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').setDisplay({ magnify: false })); await page.waitForTimeout(150);
    expect((await lens('trades')).r).toBe(0);
  });

  test('Cmd+Shift +/- bends the panel under the pointer by 2 (and reports it); other panels are untouched', async ({ page }) => {
    await open(page);
    const c = (await pt(page, 'trades', 300, 200))!;
    await page.mouse.click(c.x, c.y);                                  // (this demo's stage listens on its canvas: focus it by pressing the panel — a host in passThrough mode listens on window)
    await page.mouse.move(c.x + 2, c.y + 2); await page.waitForTimeout(100);
    const start = (await disp(page, 'trades')).curvature, other = (await disp(page, 'tilt')).curvature;
    await page.keyboard.press('Meta+Shift+='); await page.waitForTimeout(100);
    expect((await disp(page, 'trades')).curvature).toBe(start + 2);
    await page.keyboard.press('Meta+Shift+-'); await page.keyboard.press('Meta+Shift+-'); await page.waitForTimeout(100);
    expect((await disp(page, 'trades')).curvature).toBe(start - 2);
    expect((await disp(page, 'tilt')).curvature).toBe(other);
    const ev = await events(page);
    expect(ev.length).toBe(3); expect(ev[0]).toMatchObject({ id: 'trades', curvature: start + 2 });
  });
});
