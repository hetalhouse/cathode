import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * GridApi's VIEW state — sort model, scroll — readable and settable, so a host can make two views of one grid agree (the dashboard carries a grid's sort / filter / scroll between its 2D
 * window and its 3D panel). Driven through the stage demo's Trades grid (120 rows). (page.evaluate callbacks run in the page.)
 */
async function open(page: Page) {
  await page.goto('/stage3d.html?static=1&curv=0');
  await page.waitForFunction(() => !!(window as any).__stage3d?.grid);
  await page.waitForTimeout(600);
}
const api = (page: Page, fn: string, arg?: unknown) => page.evaluate(([f, a]) => { const g = (window as any).__stage3d.grid.model.api; return a === undefined ? g[f as string]() : g[f as string](a); }, [fn, arg]);
const firstIds = (page: Page) => page.evaluate(() => (window as any).__stage3d.grid.model.filteredRows.value.slice(0, 3).map((r: any) => r.id) as number[]);
const tick = (page: Page) => page.waitForTimeout(120);

test.describe('GridApi view state', () => {
  test('getSortModel / setSortModel: round-trips, reorders the rows, and [] CLEARS the sort (applyColumnState cannot)', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await open(page);
    expect(await api(page, 'getSortModel')).toEqual([]);
    const natural = await firstIds(page);
    await api(page, 'setSortModel', [{ colId: 'pnl', sort: 'desc' }]); await tick(page);
    expect(await api(page, 'getSortModel')).toEqual([{ colId: 'pnl', sort: 'desc' }]);
    const sorted = await firstIds(page);
    expect(sorted, 'the rows are reordered').not.toEqual(natural);
    // it is the same state getColumnState reports
    expect((await api(page, 'getColumnState') as any[]).find((c) => c.colId === 'pnl')).toMatchObject({ sort: 'desc', sortIndex: 0 });
    // a two-column sort keeps its priority order
    await api(page, 'setSortModel', [{ colId: 'side', sort: 'asc' }, { colId: 'pnl', sort: 'desc' }]); await tick(page);
    expect((await api(page, 'getSortModel') as any[]).map((k) => k.colId)).toEqual(['side', 'pnl']);
    // [] clears
    await api(page, 'setSortModel', []); await tick(page);
    expect(await api(page, 'getSortModel')).toEqual([]);
    expect(await firstIds(page)).toEqual(natural);
    expect(watch.entries, JSON.stringify(watch.entries)).toEqual([]);
  });

  test('getScrollY / setScrollY: scrolls, clamps to the range, and survives a sort / filter set in the same tick (those reset the scroll to the top)', async ({ page }) => {
    await open(page);
    expect(await api(page, 'getScrollY')).toBe(0);
    await api(page, 'setScrollY', 200); await tick(page);
    expect(await api(page, 'getScrollY')).toBe(200);
    const max = await page.evaluate(() => (window as any).__stage3d.grid.model.maxScrollY.value as number);
    expect(max).toBeGreaterThan(200);
    await api(page, 'setScrollY', 1e7); await tick(page);
    expect(await api(page, 'getScrollY'), 'clamped to the bottom').toBe(max);
    await api(page, 'setScrollY', -50); await tick(page);
    expect(await api(page, 'getScrollY'), 'clamped to the top').toBe(0);
    // a sort and a scroll set together (what a host restoring a view does): the scroll wins over the sort's reset
    await page.evaluate(() => { const g = (window as any).__stage3d.grid.model.api; g.setSortModel([{ colId: 'pnl', sort: 'asc' }]); g.setScrollY(300); });
    await tick(page);
    expect(await api(page, 'getScrollY')).toBe(300);
  });

  test('a filter applied then a scroll in the same tick: the scroll is clamped to what the FILTERED rows allow', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { const g = (window as any).__stage3d.grid.model.api; g.setFilterModel({ product: { type: 'contains', filter: 'BTC' } }); g.setScrollY(5000); });
    await tick(page);
    const s = await page.evaluate(() => { const m = (window as any).__stage3d.grid.model; return { y: m.scrollY.value as number, max: m.maxScrollY.value as number, rows: m.filteredRows.value.length as number }; });
    expect(s.rows, 'a filter is on').toBeLessThan(120);
    expect(s.y).toBe(s.max);
  });
});
