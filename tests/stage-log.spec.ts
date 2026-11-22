import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * logContent — a log as a stage panel: a headless LogModel + a world-mode surface, with the stage's raycast input routed into it.
 * (page.evaluate callbacks are serialised into the page: each reads window.__stage3d directly.)
 */
test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

async function open(page: Page) {
  await page.goto('/stage3d.html?log=1&static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d?.log);
  await page.waitForTimeout(500);
  // face the log panel (snap): a stable, flat view to aim at
  await page.evaluate(() => { const s = (window as any).__stage3d.stage; return s.flyTo(s.facingPose('log', { margin: 0.1 }), 0); });
  await page.waitForTimeout(400);
}
const m = (page: Page) => page.evaluate(() => {
  const g = (window as any).__stage3d.log.model;
  return { scrollY: g.scrollY.value as number, scrollX: g.scrollX.value as number, max: g.maxScrollY.value as number, stuck: g.stuckToBottom.value as boolean,
    lines: g.visualLines.value.length as number, hovered: g.hoveredLine.value as number, sel: [g.selectionAnchor.value, g.selectionActive.value] as number[],
    w: g.canvasW.value as number, h: g.canvasH.value as number };
});
const pt = (page: Page, x: number, y: number) => page.evaluate(([a, b]) => (window as any).__stage3d.stage.clientPointForContent('log', a, b), [x, y]);
/** the client point of the middle of visual line `li` (it must be on screen) */
const lineAt = async (page: Page, li: number) => { const s = (await m(page)).scrollY; return pt(page, 200, 6 + li * 18 - s + 9); };
const firstVisible = async (page: Page) => Math.floor((await m(page)).scrollY / 18);

test.describe('logContent', () => {
  test('opens on the latest entry (following the tail), and wraps to the panel width', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const s = await m(page);
    expect(s.stuck).toBe(true);
    expect(s.scrollY, 'scrolled to the bottom').toBe(s.max);
    expect(s.max).toBeGreaterThan(500);
    expect(s.lines, 'the long entries wrapped into more visual lines than entries').toBeGreaterThan(80);
    expect([s.w, s.h]).toEqual([560, 300]);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('wheel scrolls (and unsticks from the tail); scrolling back to the bottom sticks again; hover follows the pointer', async ({ page }) => {
    await open(page);
    const c = (await pt(page, 280, 150))!;
    await page.mouse.move(c.x, c.y);
    await page.mouse.wheel(0, -300); await page.waitForTimeout(150);
    let s = await m(page);
    expect(s.scrollY).toBeLessThan(s.max - 100); expect(s.stuck).toBe(false);
    // hover follows the pointer (it updates on a pointer move, as in the DOM log): move, and the hovered line is the one under it
    await page.mouse.move(c.x + 3, c.y + 2); await page.waitForTimeout(120);
    s = await m(page);
    const li = Math.floor((s.scrollY + 150 - 6) / 18);
    expect(Math.abs(s.hovered - li), 'the hovered line is the one under the pointer').toBeLessThanOrEqual(1);
    await page.mouse.move(2, 2); await page.waitForTimeout(120);
    expect((await m(page)).hovered, 'leaving the panel clears it').toBe(-1);
    await page.mouse.move(c.x, c.y);
    await page.mouse.wheel(0, 100000); await page.waitForTimeout(150);
    s = await m(page);
    expect(s.scrollY).toBe(s.max); expect(s.stuck).toBe(true);
    // shift+wheel scrolls sideways (a no-wrap log) — here the log wraps, so there is nothing to scroll
    await page.keyboard.down('Shift'); await page.mouse.wheel(0, 200); await page.keyboard.up('Shift');
    expect((await m(page)).scrollX).toBe(0);
  });

  test('click selects a line, shift-click extends it, Ctrl+C copies the ENTRIES (timestamp + text), Escape clears', async ({ page }) => {
    await open(page);
    const c0 = (await pt(page, 280, 150))!; await page.mouse.move(c0.x, c0.y);
    await page.mouse.wheel(0, -100000); await page.waitForTimeout(150);
    const base = await firstVisible(page);
    const a = (await lineAt(page, base + 2))!, b = (await lineAt(page, base + 5))!;
    await page.mouse.click(a.x, a.y); await page.waitForTimeout(100);
    expect((await m(page)).sel).toEqual([base + 2, base + 2]);
    await page.keyboard.down('Shift'); await page.mouse.click(b.x, b.y); await page.keyboard.up('Shift'); await page.waitForTimeout(100);
    expect((await m(page)).sel).toEqual([base + 2, base + 5]);

    await page.keyboard.press('Control+c'); await page.waitForTimeout(200);
    const text = await page.evaluate(() => navigator.clipboard.readText());
    const rows = text.split('\n');
    expect(rows.length, 'one row per ENTRY (wrapped fragments rejoin)').toBeGreaterThanOrEqual(3);
    expect(rows.length).toBeLessThanOrEqual(4);
    for (const r of rows) expect(r).toMatch(/^14:\d\d:\d\d {2}#\d+ /);
    expect(text).toContain('scanner cycle');

    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    expect((await m(page)).sel).toEqual([-1, -1]);
    await page.keyboard.press('Control+a'); await page.waitForTimeout(100);
    const all = await m(page);
    expect(all.sel).toEqual([0, all.lines - 1]);
  });

  test('keyboard: arrows move the selection and scroll it into view; End jumps to the tail', async ({ page }) => {
    await open(page);
    const c0 = (await pt(page, 280, 150))!; await page.mouse.move(c0.x, c0.y);
    await page.mouse.wheel(0, -100000); await page.waitForTimeout(150);
    const base = await firstVisible(page);
    const a = (await lineAt(page, base + 1))!;
    await page.mouse.click(a.x, a.y);
    for (let i = 0; i < 25; i++) await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(150);
    const s = await m(page);
    expect(s.sel).toEqual([base + 26, base + 26]);
    expect(s.scrollY, 'scrolled to keep the selection visible').toBeGreaterThan(0);
    await page.keyboard.press('End'); await page.waitForTimeout(100);
    const e = await m(page); expect(e.scrollY).toBe(e.max); expect(e.stuck).toBe(true);
  });

  test('follow-the-tail: appended entries keep a following log at the bottom; a log scrolled up stays where it is', async ({ page }) => {
    await open(page);
    const before = await m(page);
    await page.evaluate(() => (window as any).__stage3d.appendLog(12)); await page.waitForTimeout(200);
    let s = await m(page);
    expect(s.max, 'it grew').toBeGreaterThan(before.max);
    expect(s.scrollY, 'still at the bottom').toBe(s.max); expect(s.stuck).toBe(true);

    const c = (await pt(page, 280, 150))!; await page.mouse.move(c.x, c.y);
    await page.mouse.wheel(0, -400); await page.waitForTimeout(150);
    const up = await m(page);
    await page.evaluate(() => (window as any).__stage3d.appendLog(12)); await page.waitForTimeout(200);
    s = await m(page);
    expect(s.scrollY, 'a log you scrolled up does not jump').toBe(up.scrollY);
    expect(s.max).toBeGreaterThan(up.max); expect(s.stuck).toBe(false);
  });

  test('drag-pan scrolls the content with the pointer and is not a selection click', async ({ page }) => {
    await open(page);
    const a = (await pt(page, 280, 200))!;
    const start = await m(page);
    await page.mouse.move(a.x, a.y); await page.mouse.down();
    await page.mouse.move(a.x, a.y + 90, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    const s = await m(page);
    expect(s.scrollY, 'dragging DOWN pulls earlier lines into view').toBeLessThan(start.scrollY - 20);
    expect(s.sel, 'a pan is not a selection').toEqual([-1, -1]);
  });

  test('resize re-wraps the lines to the new width; the surface and viewport follow', async ({ page }) => {
    await open(page);
    const before = await m(page);
    // the corner grip drags the panel wider (the viewport follows) …
    const h = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForHandle('log'));
    await page.mouse.move(h.x, h.y); await page.mouse.down();
    await page.mouse.move(h.x + 140, h.y + 60, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(250);
    let s = await m(page);
    expect(s.w, 'wider').toBeGreaterThan(before.w + 20);
    expect(s.h, 'taller').toBeGreaterThan(before.h + 10);
    // … and a width where the long entries fit on one line has fewer lines than a narrow one has
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('log').resize(1300, 300)); await page.waitForTimeout(200);
    const wide = await m(page);
    await page.evaluate(() => (window as any).__stage3d.stage.panels.get('log').resize(320, 300)); await page.waitForTimeout(200);
    const narrow = await m(page);
    expect(wide.lines, 'fewer wrapped lines when wide').toBeLessThan(narrow.lines);
    expect(wide.lines, 'every long entry on one line: one visual line per entry').toBeLessThanOrEqual(80 + 2);
    s = narrow;
    expect(s.stuck, 'a following log keeps following through a resize').toBe(true);
    expect(s.scrollY).toBe(s.max);
    const back = await page.evaluate(() => { const p = (window as any).__stage3d.stage.panels.get('log'); const c = p.content.surface.canvas;
      return { cw: c.width, ch: c.height, dpr: p.content.surface.dpr, w: p.content.width, h: p.content.height }; });
    expect([back.cw, back.ch]).toEqual([Math.round(back.w * back.dpr), Math.round(back.h * back.dpr)]);
  });

  test('the log is actually drawn (the surface is not blank) and repaints when it scrolls', async ({ page }) => {
    await open(page);
    const pic = () => page.evaluate(() => {
      const c = (window as any).__stage3d.log.surface.canvas as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      let h = 0, lit = 0; for (let i = 0; i < d.length; i += 4) { if (d[i + 3] > 0 && (d[i] + d[i + 1] + d[i + 2]) > 200) lit++; h = (h * 31 + d[i + 1]) | 0; }
      return { h, lit };
    });
    const a = await pic();
    expect(a.lit, 'text pixels are on the canvas').toBeGreaterThan(500);
    const c = (await pt(page, 280, 150))!; await page.mouse.move(c.x, c.y);
    await page.mouse.wheel(0, -250); await page.waitForTimeout(200);
    expect((await pic()).h, 'it repainted for the new scroll position').not.toBe(a.h);
  });
});
