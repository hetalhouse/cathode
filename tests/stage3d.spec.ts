import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeStage3D — a grid and a gauge in ONE scene, driven by real pointer/keyboard input through
 * raycasts. Clicks are aimed with stage.clientPointForContent(), which inverts the same bend
 * mapping the input path uses, so they land where the content is DRAWN.
 * (Every page.evaluate reads window.__stage3d directly — the callbacks are serialized into the page.)
 */
async function open(page: Page, qs = '') {
  await page.goto('/stage3d.html?static=1' + qs);
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
const contentToClient = (page: Page, id: string, x: number, y: number) =>
  page.evaluate(([i, cx, cy]) => (window as any).__stage3d.stage.clientPointForContent(i, cx, cy), [id, x, y] as [string, number, number]);

test.describe('CathodeStage3D', () => {
  test('renders both panels in one scene, GL-clean', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    const shot = await page.locator('canvas').first().screenshot();
    expect(shot.length, '3D stage looks blank').toBeGreaterThan(8000);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.panels.size)).toBe(2);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('raycast input drives the grid: header sort, cell select, keyboard, wheel scroll', async ({ page }) => {
    await open(page, '&curv=0');

    // header "Product" (content x 70..210) → sort asc
    const hdr = await contentToClient(page, 'trades', 140, 15);
    expect(hdr, 'header is drawn somewhere on screen').not.toBeNull();
    await page.mouse.click(hdr.x, hdr.y);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.sortState.value.map((k: any) => `${k.colId}:${k.dir}`))).toEqual(['product:asc']);

    // body cell (row 1, col 2) → select, and the panel takes keyboard focus
    const cell = await contentToClient(page, 'trades', 250, 30 + 28 + 10);
    await page.mouse.click(cell.x, cell.y);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.selectedCell.value)).toEqual({ row: 1, col: 2 });
    expect(await page.evaluate(() => (window as any).__stage3d.stage.focusedId)).toBe('trades');

    // keyboard goes to the focused panel
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.selectedCell.value)).toEqual({ row: 2, col: 3 });

    // wheel over the grid scrolls the grid, not the camera
    const camBefore = await page.evaluate(() => (window as any).__stage3d.stage.camera.position.z);
    await page.mouse.move(cell.x, cell.y);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.scrollY.value)).toBeGreaterThan(0);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.camera.position.z)).toBeCloseTo(camBefore, 6);
  });

  test('the filter popup is typed into directly (no DOM input in 3D)', async ({ page }) => {
    await open(page, '&curv=0');
    // "Product" is the filterable column; its filter icon is the right 24px of the header cell.
    // (Columns are scaled up to fill the 640px canvas, so read the real edges from the model.)
    const edge = await page.evaluate(() => {
      const cols = (window as any).__stage3d.grid.model.displayCols.value;
      return cols[0].width + cols[1].width;   // right edge of column 2 ("Product")
    });
    const icon = await contentToClient(page, 'trades', edge - 12, 15);
    await page.mouse.click(icon.x, icon.y);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.activeFilter.value)).toBe('product');
    await page.keyboard.type('BTC');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.filteredRows.value.length)).toBe(15);   // 120 rows / 8 products
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => (window as any).__stage3d.grid.model.filteredRows.value.length)).toBe(120);
  });

  test('inverse mapping round-trips on a bent panel: drawn point → pick → same content', async ({ page }) => {
    await open(page, '&curv=20');
    const r = await page.evaluate(() => {
      const s = (window as any).__stage3d.stage;
      const out: { want: number[]; got: number[] | null }[] = [];
      for (const [cx, cy] of [[100, 60], [320, 200], [560, 340], [40, 380]]) {
        const p = s.clientPointForContent('trades', cx, cy);
        const hit = p && s.pick(p.x, p.y);
        out.push({ want: [cx, cy], got: hit && hit.content ? [hit.content.x, hit.content.y] : null });
      }
      return out;
    });
    for (const { want, got } of r) {
      expect(got, `content ${want} not found on screen`).not.toBeNull();
      expect(Math.abs(got![0] - want[0])).toBeLessThan(2);
      expect(Math.abs(got![1] - want[1])).toBeLessThan(2);
    }
  });

  test('dragging a title bar moves the panel without orbiting; pressing the other panel moves focus', async ({ page }) => {
    await open(page, '&curv=0');
    const state = () => page.evaluate(() => {
      const s = (window as any).__stage3d.stage;
      const p = s.panels.get('tilt').group.position;
      return { x: p.x, y: p.y, cam: { x: s.camera.position.x, y: s.camera.position.y } };
    });
    const before = await state();
    const bar = await page.evaluate(() => (window as any).__stage3d.stage.clientPointForBar('tilt'));
    await page.mouse.move(bar.x, bar.y);
    await page.mouse.down();
    await page.mouse.move(bar.x - 120, bar.y + 70, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    const after = await state();
    expect(Math.hypot(after.x - before.x, after.y - before.y), 'panel moved').toBeGreaterThan(0.15);
    expect(after.cam.x).toBeCloseTo(before.cam.x, 6);
    expect(after.cam.y).toBeCloseTo(before.cam.y, 6);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.focusedId)).toBe('tilt');

    const hdr = await contentToClient(page, 'trades', 140, 15);
    await page.mouse.click(hdr.x, hdr.y);
    expect(await page.evaluate(() => (window as any).__stage3d.stage.focusedId)).toBe('trades');
  });

  test('dragging empty space orbits the camera', async ({ page }) => {
    await open(page, '&curv=0');
    const cam = () => page.evaluate(() => { const c = (window as any).__stage3d.stage.camera.position; return { x: c.x, z: c.z }; });
    const before = await cam();
    await page.mouse.move(640, 680);   // empty space below the panels (viewport is 1280x720)
    await page.mouse.down();
    await page.mouse.move(520, 660, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    const after = await cam();
    expect(Math.hypot(after.x - before.x, after.z - before.z), 'camera orbited').toBeGreaterThan(0.1);
  });
});
