import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * The WALL: panels are upright and side by side in one plane; a POP-UP joins it in a FREE SPOT (never over another panel) and the camera zooms to it; its restore button flies back to the view
 * you had; ✕ closes it and does the same. Library: stage.freeSpot / expand / unexpand / toggleExpand / addPopup / closePanel. Driven through the demo's 3D Workspace tab (ⓘ opens a pop-up).
 * (page.evaluate callbacks run in the page.)
 */
async function open(page: Page) {
  await page.setViewportSize({ width: 1500, height: 900 });
  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__ws3d);
  await page.waitForTimeout(1200);
}
/** every panel's footprint (body + title bar) in the wall's plane, in world units */
const rects = (page: Page) => page.evaluate(() => { const st = (window as any).__ws3d.stage; const ppu = st.pxPerUnit;
  return Object.fromEntries([...st.panels.entries()].map(([id, p]: [string, any]) => { const w = p.content.width / ppu, h = p.content.height / ppu, bar = 26 / ppu;
    return [id, { x0: p.group.position.x - w / 2, x1: p.group.position.x + w / 2, y0: p.group.position.y - h / 2, y1: p.group.position.y + h / 2 + bar, z: p.group.position.z, rotY: p.group.rotation.y }]; })) as Record<string, { x0: number; x1: number; y0: number; y1: number; z: number; rotY: number }>; });
const overlap = (a: { x0: number; x1: number; y0: number; y1: number }, b: typeof a) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const noOverlaps = (r: Awaited<ReturnType<typeof rects>>) => { const ids = Object.keys(r); const bad: string[] = []; for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (overlap(r[ids[i]], r[ids[j]])) bad.push(`${ids[i]}×${ids[j]}`); return bad; };
const pose = (page: Page) => page.evaluate(() => { const p = (window as any).__ws3d.stage.getCameraPose(); return [...p.position, ...p.target]; });
const settle = async (page: Page) => { let prev = await pose(page); for (let i = 0; i < 40; i++) { await page.waitForTimeout(150); const c = await pose(page); if (c.every((v, k) => Math.abs(v - prev[k]) < 1e-4)) break; prev = c; } };
const near = (a: number[], b: number[], tol = 0.02) => a.every((v, k) => Math.abs(v - b[k]) < tol);
const infoClick = async (page: Page, id: string) => { const p = await page.evaluate(([i]) => (window as any).__ws3d.stage.clientPointForControl(i, 'info'), [id]); await page.mouse.click(p.x, p.y); };
const ctlClick = async (page: Page, id: string, c: string) => { const p = await page.evaluate(([i, k]) => (window as any).__ws3d.stage.clientPointForControl(i, k), [id, c]); await page.mouse.click(p.x, p.y); };
/** the panel's share of the view: its footprint's on-screen extent as fractions of the canvas */
const extent = (page: Page, id: string) => page.evaluate(([i]) => { const st = (window as any).__ws3d.stage; st.camera.updateMatrixWorld(true); st.camera.updateProjectionMatrix(); const p = st.panels.get(i); p.group.updateWorldMatrix(true, true);
  const ppu = st.pxPerUnit, w = p.content.width / ppu, bh = p.content.height / ppu, bar = 26 / ppu; let a = { minX: 9, maxX: -9, minY: 9, maxY: -9 };
  for (const [cx, cy] of [[-w / 2, -bh / 2], [w / 2, -bh / 2], [-w / 2, bh / 2 + bar], [w / 2, bh / 2 + bar]]) { const v = p.body.localToWorld(new p.group.position.constructor(cx, cy, 0)); v.project(st.camera);
    a = { minX: Math.min(a.minX, (v.x + 1) / 2), maxX: Math.max(a.maxX, (v.x + 1) / 2), minY: Math.min(a.minY, (1 - v.y) / 2), maxY: Math.max(a.maxY, (1 - v.y) / 2) }; } return a; }, [id]);

test.describe('the wall: pop-ups join it, never land on it', () => {
  test('the wall is upright and flat: every panel in ONE plane, none tilted — the plane a pop-up will join', async ({ page }) => {
    await open(page);
    const r = await rects(page);
    const zs = Object.values(r).map((x) => x.z);
    expect(Math.max(...zs) - Math.min(...zs), 'one plane').toBeLessThan(1e-6);
    expect(Object.values(r).every((x) => Math.abs(x.rotY) < 1e-9), 'upright, facing the viewer — no tilt').toBe(true);
    expect(noOverlaps(r), 'and nothing overlaps').toEqual([]);
  });

  test('freeSpot: any size lands clear of every panel (and of the pop-ups before it); `near` puts it beside that panel; pure — it adds nothing', async ({ page }) => {
    await open(page);
    const before = await rects(page);
    const spots = await page.evaluate(() => { const st = (window as any).__ws3d.stage; const out: { size: number[]; near?: string; p: number[] }[] = [];
      for (const [w, h, n] of [[300, 200, undefined], [800, 500, undefined], [1500, 300, undefined], [520, 220, 'candle'], [520, 220, 'wall'], [400, 400, 'trades']] as [number, number, string | undefined][]) {
        const s = st.freeSpot({ w, h }, { near: n }); out.push({ size: [w, h], near: n, p: s.position }); }
      return out; });
    expect(await rects(page), 'freeSpot is pure').toEqual(before);
    const ppu = 360;
    for (const s of spots) {
      const [w, h] = s.size; const cand = { x0: s.p[0] - w / ppu / 2, x1: s.p[0] + w / ppu / 2, y0: s.p[1] - h / ppu / 2, y1: s.p[1] + h / ppu / 2 + 26 / ppu };
      for (const [id, r] of Object.entries(before)) expect(overlap(cand, r), `a ${w}×${h} spot${s.near ? ' near ' + s.near : ''} overlaps ${id}`).toBe(false);
      expect(s.p[2], 'in the wall\'s plane').toBeCloseTo(Object.values(before)[0].z, 6);
    }
    // `near` really is nearer: the spot beside 'candle' is closer to it than the unconstrained spot of the same size
    const dist = (p: number[], id: string) => { const r = before[id]; return Math.hypot(p[0] - (r.x0 + r.x1) / 2, p[1] - (r.y0 + r.y1) / 2); };
    const base = await page.evaluate(() => (window as any).__ws3d.stage.freeSpot({ w: 520, h: 220 }).position as number[]);
    expect(dist(spots[3].p, 'candle')).toBeLessThanOrEqual(dist(base, 'candle') + 1e-6);
  });

  test('ⓘ opens a pop-up IN the wall (free spot, same plane, upright), the camera zooms to fill the view with it, and its restore button flies back to the view you had', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    await settle(page);
    const home = await pose(page);
    const wallBefore = await rects(page);
    await infoClick(page, 'trades');
    await expect.poll(() => page.evaluate(() => (window as any).__ws3d.stage.panels.has('about-trades'))).toBe(true);
    await page.waitForTimeout(900); await settle(page);
    const r = await rects(page);
    expect(noOverlaps(r), 'the pop-up overlaps nothing').toEqual([]);
    for (const [id, was] of Object.entries(wallBefore)) expect(r[id], `${id} did not move`).toEqual(was);   // the wall is left alone
    expect(r['about-trades'].z).toBeCloseTo(wallBefore.trades.z, 6);
    expect(Math.abs(r['about-trades'].rotY)).toBeLessThan(1e-9);
    // zoomed to it: it fills the view, expanded (its button is "restore"), focused
    const e = await extent(page, 'about-trades');
    expect(Math.max(e.maxX - e.minX, e.maxY - e.minY), 'the pop-up fills the view').toBeGreaterThan(0.9);
    expect(await page.evaluate(() => { const st = (window as any).__ws3d.stage; return [st.expandedId, st.panels.get('about-trades').maximized, st.focusedId]; })).toEqual(['about-trades', true, 'about-trades']);
    expect(near(await pose(page), home, 0.05), 'the camera moved').toBe(false);
    // unexpand → the prior perspective, exactly
    await ctlClick(page, 'about-trades', 'maximize');
    await page.waitForTimeout(900); await settle(page);
    expect(near(await pose(page), home), 'back to the view from before').toBe(true);
    expect(await page.evaluate(() => { const st = (window as any).__ws3d.stage; return [st.expandedId, st.panels.get('about-trades').maximized, st.panels.has('about-trades')]; })).toEqual([null, false, true]);   // it stays in the wall
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('a second pop-up takes ANOTHER free spot (they do not stack), and the way back is always the original view; ✕ closes a pop-up and restores the view too', async ({ page }) => {
    await open(page);
    await settle(page);
    const home = await pose(page);
    await infoClick(page, 'trades');
    await page.waitForTimeout(900); await settle(page);
    // while zoomed on the first pop-up, open another from a panel (go back to the wall's view first: its ⓘ is off-screen now) — so use the API as the ⓘ does
    await page.evaluate(() => (window as any).__ws3d.openAbout('candle'));
    await page.waitForTimeout(900); await settle(page);
    const r = await rects(page);
    expect(Object.keys(r).filter((k) => k.startsWith('about-')).sort()).toEqual(['about-candle', 'about-trades']);
    expect(noOverlaps(r), 'two pop-ups, no overlaps').toEqual([]);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.expandedId)).toBe('about-candle');
    // restore from the SECOND one → the ORIGINAL view (before the first expand)
    await ctlClick(page, 'about-candle', 'maximize');
    await page.waitForTimeout(900); await settle(page);
    expect(near(await pose(page), home), 'the original view, not the first pop-up\'s').toBe(true);
    // ✕ on an expanded pop-up: it is removed and the view comes back
    await infoClick(page, 'log');
    await page.waitForTimeout(900); await settle(page);
    expect(near(await pose(page), home, 0.05)).toBe(false);
    await ctlClick(page, 'about-log', 'close');
    await page.waitForTimeout(900); await settle(page);
    expect(await page.evaluate(() => (window as any).__ws3d.stage.panels.has('about-log'))).toBe(false);
    expect(near(await pose(page), home), '✕ restored the view').toBe(true);
    expect(noOverlaps(await rects(page))).toEqual([]);
  });
});
