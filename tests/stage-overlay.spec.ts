import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeStage3D overlay mode — a transparent, pass-through stage over a host scene whose camera
 * drives the stage. The host here is a div (#scene-layer) that counts the events that reach it and
 * orbits; a DOM window (#dom-window) is stacked above the stage. (page.evaluate callbacks are
 * serialized into the page, so each reads window.__overlay directly.)
 */
async function open(page: Page) {
  await page.goto('/stage3d-overlay.html');
  await page.waitForFunction(() => !!(window as any).__overlay);
  await page.waitForTimeout(600);
}
const toClient = (page: Page, x: number, y: number) =>
  page.evaluate(([cx, cy]) => (window as any).__overlay.stage.clientPointForContent('trades', cx, cy), [x, y] as [number, number]);
const counts = (page: Page) => page.evaluate(() => ({ ...(window as any).__overlay.counts }));

test.describe('CathodeStage3D overlay mode', () => {
  test('transparent: the canvas is clear where there is no panel and opaque where there is', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const alpha = await page.evaluate(([px, py]) => {
      const { stage } = (window as any).__overlay;
      stage.renderer.render(stage.scene, stage.camera);              // read back in the same task as the draw
      const gl = stage.renderer.getContext() as WebGL2RenderingContext;
      const a = (x: number, y: number) => { const b = new Uint8Array(4); gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, b); return b[3]; };
      const dpr = stage.renderer.getPixelRatio();
      return { corner: a(2, 2), panel: a(Math.round(px * dpr), Math.round(py * dpr)) };
    }, [await page.evaluate(() => innerWidth / 2), await page.evaluate(() => innerHeight / 2)]);
    expect(alpha.corner, 'empty corner must be transparent').toBe(0);
    expect(alpha.panel, 'panel centre must be painted').toBeGreaterThan(0);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('pass-through: a press/click/wheel over a panel is the panel\'s; elsewhere it reaches the host scene', async ({ page }) => {
    await open(page);
    // empty space (top-left) → the host sees it
    await page.mouse.click(40, 60);
    expect(await counts(page)).toMatchObject({ pointerdown: 1, click: 1 });
    await page.mouse.move(40, 60);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(100);
    expect((await counts(page)).wheel).toBe(1);

    // over the panel header → the grid sorts and the host sees NOTHING new
    const before = await counts(page);
    const hdr = await toClient(page, 160, 15);
    await page.mouse.click(hdr.x, hdr.y);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__overlay.grid.model.sortState.value.map((k: any) => k.colId))).toEqual(['product']);
    expect(await counts(page)).toEqual(before);

    // wheel over the panel scrolls the grid, and the host's wheel count is unchanged
    const cell = await toClient(page, 160, 70);
    await page.mouse.move(cell.x, cell.y);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => (window as any).__overlay.grid.model.scrollY.value)).toBeGreaterThan(0);
    expect((await counts(page)).wheel).toBe(before.wheel);
  });

  test('shouldHandle: a press on a DOM window stacked above a panel is NOT taken by the stage', async ({ page }) => {
    await open(page);
    // find a point that is on BOTH the DOM window and (behind it) the grid panel
    const pt = await page.evaluate(() => {
      const w = document.getElementById('dom-window')!.getBoundingClientRect();
      const { stage } = (window as any).__overlay;
      for (let y = w.top + 20; y < w.bottom - 10; y += 6) for (let x = w.left + 10; x < w.right - 10; x += 6) {
        if (stage.pick(x, y)) return { x, y };
      }
      return null;
    });
    expect(pt, 'the DOM window should overlap the panel on screen').not.toBeNull();
    await page.mouse.click(pt!.x, pt!.y);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => (window as any).__overlay.grid.model.selectedCell.value)).toBeNull();
    expect(await page.evaluate(() => (window as any).__overlay.stage.focusedId)).toBeNull();
  });

  test('shared camera: the host orbit moves the panel on screen, and picking follows', async ({ page }) => {
    await open(page);
    // an OFF-centre content point: the panel sits at the orbit target, so its centre never moves on screen
    const before = await toClient(page, 60, 60);
    // drag empty space → the host orbits → setCameraPose
    await page.mouse.move(120, 600);
    await page.mouse.down();
    await page.mouse.move(260, 560, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => (window as any).__overlay.cam.yaw)).not.toBe(0);
    const after = await toClient(page, 60, 60);
    expect(Math.hypot(after.x - before.x, after.y - before.y), 'the panel moved on screen with the camera').toBeGreaterThan(8);
    // …and a click aimed at the drawn point still lands on that content (pick/projection agree)
    await page.mouse.click(after.x, after.y);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__overlay.grid.model.selectedCell.value)).not.toBeNull();
    const pose = await page.evaluate(() => (window as any).__overlay.stage.getCameraPose());
    expect(pose.position[0]).not.toBeCloseTo(0, 2);   // yawed off the axis
  });

  test('keys go to the focused panel from window — but not while typing in an input; a press elsewhere releases focus', async ({ page }) => {
    await open(page);
    const cell = await toClient(page, 160, 60);
    await page.mouse.click(cell.x, cell.y);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => (window as any).__overlay.stage.focusedId)).toBe('trades');
    const row0 = await page.evaluate(() => (window as any).__overlay.grid.model.selectedCell.value.row);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(80);
    expect(await page.evaluate(() => (window as any).__overlay.grid.model.selectedCell.value.row)).toBe(row0 + 1);

    // typing in the DOM input must not move the grid selection
    await page.locator('#dom-input').click();
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(80);
    expect(await page.evaluate(() => (window as any).__overlay.grid.model.selectedCell.value.row)).toBe(row0 + 1);

    // a press on empty space releases the stage's keyboard focus
    await page.mouse.click(40, 60);
    expect(await page.evaluate(() => (window as any).__overlay.stage.focusedId)).toBeNull();
  });

  test('facingPose is pure: the HOST applies it (overlay mode) and the panel comes up front-on', async ({ page }) => {
    await open(page);
    const corners = () => page.evaluate(() => {
      const s = (window as any).__overlay.stage;
      return [s.clientPointForContent('trades', 6, 6), s.clientPointForContent('trades', 514, 6),
              s.clientPointForContent('trades', 6, 334), s.clientPointForContent('trades', 514, 334)];
    });
    // yaw the host away first, so the panel is clearly oblique
    await page.mouse.move(120, 600); await page.mouse.down(); await page.mouse.move(300, 580, { steps: 8 }); await page.mouse.up();
    await page.waitForTimeout(250);
    const [tl0, tr0] = await corners();
    expect(Math.abs(tl0.y - tr0.y), 'oblique before').toBeGreaterThan(4);

    // facingPose moves nothing by itself…
    const pure = await page.evaluate(() => {
      const s = (window as any).__overlay.stage;
      const a = JSON.stringify(s.getCameraPose()); s.facingPose('trades'); return a === JSON.stringify(s.getCameraPose());
    });
    expect(pure).toBe(true);
    // …the host applies it
    await page.evaluate(() => { const s = (window as any).__overlay.stage; s.setCameraPose(s.facingPose('trades')); });
    await page.waitForTimeout(150);
    const [tl, tr, bl] = await corners();
    expect(Math.abs(tl.y - tr.y), 'level after the host applies it').toBeLessThan(1.5);
    expect(Math.abs(tl.x - bl.x), 'vertical after the host applies it').toBeLessThan(1.5);
  });
});
