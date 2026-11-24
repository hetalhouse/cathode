import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * stage.framePose(ids?, { margin, minDistance }) — the workspace "zoom out": the camera pose that frames several panels at once (every title bar included). Pure: it moves nothing.
 * (page.evaluate callbacks run in the page.)
 */
async function open(page: Page, q = '') {
  await page.goto('/stage3d.html?static=1&curv=0' + q);
  await page.waitForFunction(() => !!(window as any).__stage3d);
  await page.waitForTimeout(700);
}
/** every listed panel's four corners (body + bar), projected through the CURRENT camera, as fractions of the canvas: all within [0, 1] = in frame */
const corners = (page: Page, ids: string[]) => page.evaluate((list) => { const st = (window as any).__stage3d.stage; st.camera.updateMatrixWorld(true); st.camera.updateProjectionMatrix();
  const out: Record<string, { minX: number; maxX: number; minY: number; maxY: number }> = {};
  for (const id of list as string[]) { const p = st.panels.get(id); p.group.updateWorldMatrix(true, true); const ppu = st.pxPerUnit, w = p.content.width / ppu, bh = p.content.height / ppu, bar = 26 / ppu;
    let a = { minX: 9, maxX: -9, minY: 9, maxY: -9 };
    for (const [cx, cy] of [[-w / 2, -bh / 2], [w / 2, -bh / 2], [-w / 2, bh / 2 + bar], [w / 2, bh / 2 + bar]]) { const v = p.body.localToWorld(new p.group.position.constructor(cx, cy, 0)); v.project(st.camera);
      a = { minX: Math.min(a.minX, (v.x + 1) / 2), maxX: Math.max(a.maxX, (v.x + 1) / 2), minY: Math.min(a.minY, (1 - v.y) / 2), maxY: Math.max(a.maxY, (1 - v.y) / 2) }; }
    out[id] = a; } return out; }, ids);
const apply = (page: Page, args: unknown) => page.evaluate((a) => { const st = (window as any).__stage3d.stage; const pose = st.framePose(...(a as unknown[])); if (pose) { st.setCameraPose(pose); st.controls?.update?.(); } return pose; }, args);

test.describe('stage.framePose', () => {
  test('frames every panel — all of them in view with the margin to spare; a tighter set frames closer; minDistance never zooms in past it', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page, '&log=1&candle=1&wall=1');
    const ids = await page.evaluate(() => [...(window as any).__stage3d.stage.panels.keys()] as string[]);
    expect(ids.length).toBeGreaterThanOrEqual(5);
    const pose = await apply(page, [undefined, { margin: 0.08 }]) as { position: number[]; target: number[] };
    expect(pose).not.toBeNull();
    const all = await corners(page, ids);
    for (const [id, c] of Object.entries(all)) {
      expect(c.minX, `${id} left in view`).toBeGreaterThanOrEqual(-0.001); expect(c.maxX, `${id} right in view`).toBeLessThanOrEqual(1.001);
      expect(c.minY, `${id} top in view`).toBeGreaterThanOrEqual(-0.001); expect(c.maxY, `${id} bottom in view`).toBeLessThanOrEqual(1.001);
    }
    // it is a TIGHT fit: the group's bounding box touches the margin on at least one axis (not a vague far-away shot)
    const bb = Object.values(all).reduce((a, c) => ({ minX: Math.min(a.minX, c.minX), maxX: Math.max(a.maxX, c.maxX), minY: Math.min(a.minY, c.minY), maxY: Math.max(a.maxY, c.maxY) }), { minX: 9, maxX: -9, minY: 9, maxY: -9 });
    expect(Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY), 'fills most of the view on its limiting axis').toBeGreaterThan(0.85);
    // a subset frames closer than the whole
    const sub = await apply(page, [['tilt'], { margin: 0.08 }]) as { position: number[]; target: number[] };
    const dist = (p: { position: number[]; target: number[] }) => Math.hypot(p.position[0] - p.target[0], p.position[1] - p.target[1], p.position[2] - p.target[2]);
    expect(dist(sub), 'one panel is framed closer than all of them').toBeLessThan(dist(pose));
    const onlyTilt = await corners(page, ['tilt']);
    expect(onlyTilt.tilt.minX).toBeGreaterThanOrEqual(-0.001); expect(onlyTilt.tilt.maxX).toBeLessThanOrEqual(1.001);
    // minDistance: an Overview can't zoom IN past it
    const far = await apply(page, [['tilt'], { minDistance: 20 }]) as { position: number[]; target: number[] };
    expect(dist(far)).toBeGreaterThanOrEqual(19.99);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('pure (moves nothing); null for nothing to frame; flyTo(framePose()) lands on it', async ({ page }) => {
    await open(page);
    const before = await page.evaluate(() => { const c = (window as any).__stage3d.stage.camera.position; return [c.x, c.y, c.z]; });
    expect(await page.evaluate(() => (window as any).__stage3d.stage.framePose(['no-such-panel']))).toBeNull();
    await page.evaluate(() => (window as any).__stage3d.stage.framePose());
    expect(await page.evaluate(() => { const c = (window as any).__stage3d.stage.camera.position; return [c.x, c.y, c.z]; }), 'framePose moves nothing').toEqual(before);
    await page.evaluate(() => { const s = (window as any).__stage3d.stage; return s.flyTo(s.framePose(), 0); });
    const after = await page.evaluate(() => { const s = (window as any).__stage3d.stage, p = s.framePose(); const c = s.camera.position; return Math.hypot(c.x - p.position[0], c.y - p.position[1], c.z - p.position[2]); });
    expect(after).toBeLessThan(0.05);
  });
});
