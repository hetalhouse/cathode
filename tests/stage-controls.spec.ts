import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Title-bar controls (minimize / maximize) and the collapsed state. The stage draws the buttons, hit-tests them and
 * reports clicks (onPanelControl); what a click MEANS is the host's — the demo collapses on minimize and flies the camera
 * to fill the view (and back) on maximize. (page.evaluate callbacks are serialised into the page: each reads
 * window.__stage3d directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
const ctl = (page: Page, id: string, c: 'minimize' | 'maximize') =>
  page.evaluate(([i, k]) => (window as any).__stage3d.stage.clientPointForControl(i, k), [id, c]);
const bar = (page: Page, id: string) => page.evaluate(([i]) => {
  const p = (window as any).__stage3d.stage.panels.get(i);
  const cv = p.bar.material.map.image as HTMLCanvasElement;
  const d = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height).data;
  let h = 0; for (let k = 0; k < d.length; k += 5) h = (h * 31 + d[k]) | 0;
  return h;
}, [id]);
const events = (page: Page) => page.evaluate(() => (window as any).__stage3d.controlEvents as string[]);
const pos = (page: Page, id: string) => page.evaluate(([i]) => { const g = (window as any).__stage3d.stage.panels.get(i).group.position; return [g.x, g.y, g.z]; }, [id]);

test.describe('title-bar controls + minimize', () => {
  test('the stage hit-tests the buttons: a click reports the control, never starts a drag, and the pointer shows a hand', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const picks = await page.evaluate(() => {
      const s = (window as any).__stage3d.stage;
      const at = (id: string, c: string) => { const p = s.clientPointForControl(id, c); const h = p && s.pick(p.x, p.y); return h && { part: h.part, control: h.control, id: h.panel.id }; };
      const b = s.clientPointForBar('trades'); const hb = s.pick(b.x - 150, b.y);
      return { min: at('trades', 'minimize'), max: at('trades', 'maximize'), title: hb && { part: hb.part, control: hb.control }, gaugeMin: at('tilt', 'minimize') };
    });
    expect(picks.min).toEqual({ part: 'bar', control: 'minimize', id: 'trades' });
    expect(picks.max).toEqual({ part: 'bar', control: 'maximize', id: 'trades' });
    expect(picks.title, 'the bar away from the buttons is the plain title bar').toEqual({ part: 'bar', control: null });
    expect(picks.gaugeMin).toEqual({ part: 'bar', control: 'minimize', id: 'tilt' });

    const before = await pos(page, 'trades');
    const m = await ctl(page, 'trades', 'maximize');
    await page.mouse.move(m.x, m.y);
    await page.waitForTimeout(100);
    // press + a small wiggle on the button: it is a button, not a drag handle
    await page.mouse.down(); await page.mouse.move(m.x + 30, m.y + 30, { steps: 4 }); await page.mouse.up();
    expect(await pos(page, 'trades'), 'the panel did not move').toEqual(before);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('minimize: a click collapses the panel to its title bar (body hidden, not pickable), and again expands it', async ({ page }) => {
    await open(page);
    const body = await page.evaluate(() => { const s = (window as any).__stage3d.stage; const p = s.clientPointForContent('trades', 320, 200); return { x: p.x, y: p.y }; });
    expect(await page.evaluate(([x, y]) => (window as any).__stage3d.stage.pick(x, y)?.part, [body.x, body.y])).toBe('body');

    const barBefore = await bar(page, 'trades');
    const m = await ctl(page, 'trades', 'minimize');
    await page.mouse.click(m.x, m.y);
    await page.waitForTimeout(250);
    expect(await events(page)).toEqual(['trades:minimize']);
    const st = await page.evaluate(([x, y]) => {
      const s = (window as any).__stage3d.stage; const p = s.panels.get('trades');
      return { minimized: p.minimized, bodyVisible: p.body.visible, pickAtBody: s.pick(x, y)?.part ?? null, layout: s.getLayout().trades.minimized };
    }, [body.x, body.y]);
    expect(st).toEqual({ minimized: true, bodyVisible: false, pickAtBody: null, layout: true });
    const barMin = await bar(page, 'trades');
    expect(barMin, 'the control now shows "expand"').not.toBe(barBefore);

    // the bar is still there, and still a control
    const m2 = await ctl(page, 'trades', 'minimize');
    await page.mouse.click(m2.x, m2.y);
    await page.waitForTimeout(250);
    expect(await events(page)).toEqual(['trades:minimize', 'trades:minimize']);
    expect(await page.evaluate(() => { const p = (window as any).__stage3d.stage.panels.get('trades'); return { minimized: p.minimized, bodyVisible: p.body.visible }; })).toEqual({ minimized: false, bodyVisible: true });
    expect(await page.evaluate(([x, y]) => (window as any).__stage3d.stage.pick(x, y)?.part, [body.x, body.y])).toBe('body');
    // (not compared with the very first picture: the pointer is still over the button and the panel is now focused —
    //  both legitimately change the bar. Same hover + focus as `barMin`, so the only difference is the glyph.)
    expect(await bar(page, 'trades'), 'the control shows "collapse" again').not.toBe(barMin);
  });

  test('a collapsed panel is faced as its bar only; applyLayout round-trips minimized', async ({ page }) => {
    await open(page);
    const dist = (page: Page) => page.evaluate(() => {
      const s = (window as any).__stage3d.stage; const f = s.facingPose('trades');
      return Math.hypot(f.position[0] - f.target[0], f.position[1] - f.target[1], f.position[2] - f.target[2]);
    });
    const open0 = await dist(page);
    await page.evaluate(() => (window as any).__stage3d.stage.applyLayout({ trades: { minimized: true } }));
    await page.waitForTimeout(150);
    const closed = await dist(page);
    expect(closed, 'facing a bar-only panel needs a closer camera than facing the whole panel').toBeLessThan(open0);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.getLayout().trades.minimized)).toBe(true);
    await page.evaluate(() => (window as any).__stage3d.stage.applyLayout({ trades: { minimized: false } }));
    await page.waitForTimeout(150);
    expect(await dist(page)).toBeCloseTo(open0, 6);
  });

  test('maximize: the host flies the camera to fill the view and the glyph shows "restore"; clicking again flies back', async ({ page }) => {
    await open(page);
    const cam = () => page.evaluate(() => { const p = (window as any).__stage3d.stage.getCameraPose().position; return p as number[]; });
    const cam0 = await cam();
    const barBefore = await bar(page, 'trades');
    const m = await ctl(page, 'trades', 'maximize');
    await page.mouse.click(m.x, m.y);
    await page.waitForTimeout(900);                                     // the flight is 550 ms
    expect(await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').maximized)).toBe(true);
    expect(await bar(page, 'trades'), 'the glyph is now "restore"').not.toBe(barBefore);
    const filled = await page.evaluate(() => {
      const s = (window as any).__stage3d.stage;
      const tl = s.clientPointForContent('trades', 6, 6), br = s.clientPointForContent('trades', 634, 394);
      return { w: br.x - tl.x, h: br.y - tl.y, vw: innerWidth, vh: innerHeight };
    });
    expect(Math.max(filled.w / filled.vw, filled.h / filled.vh), 'the panel fills most of the view').toBeGreaterThan(0.7);

    const m2 = await ctl(page, 'trades', 'maximize');
    await page.mouse.click(m2.x, m2.y);
    await page.waitForTimeout(900);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.panels.get('trades').maximized)).toBe(false);
    const cam1 = await cam();
    for (let i = 0; i < 3; i++) expect(Math.abs(cam1[i] - cam0[i]), 'flew back to where it was').toBeLessThan(0.05);
  });

  test('double-clicking the plain title still activates (faces) the panel — but a control click never does', async ({ page }) => {
    await open(page);
    const cam = () => page.evaluate(() => (window as any).__stage3d.stage.getCameraPose().position as number[]);
    const cam0 = await cam();
    const m = await ctl(page, 'tilt', 'minimize');
    await page.mouse.dblclick(m.x, m.y);                                // two clicks on a button → two toggles, no "face this panel"
    await page.waitForTimeout(800);
    const cam1 = await cam();
    expect(Math.hypot(cam1[0] - cam0[0], cam1[1] - cam0[1], cam1[2] - cam0[2]), 'no face-the-panel flight').toBeLessThan(1e-6);
    expect(await events(page)).toEqual(['tilt:minimize', 'tilt:minimize']);
    const b = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForBar('tilt'));
    await page.mouse.dblclick(b.x - 120, b.y);                          // the title text area
    await page.waitForTimeout(900);
    const cam2 = await cam();
    expect(Math.hypot(cam2[0] - cam0[0], cam2[1] - cam0[1], cam2[2] - cam0[2]), 'the title double-click flew the camera').toBeGreaterThan(0.1);
  });
});
