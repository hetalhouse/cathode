import { test, expect } from '@playwright/test';

/**
 * useGridModel — the headless grid. These drive the model with NO component, NO renderer and NO
 * DOM events: input arrives in canvas space, the way a 3D stage would feed it from a raycast.
 * (The page is only a host for the module graph — surface3d.html mounts no grid.)
 */
test.describe('useGridModel (headless)', () => {
  test('sort, select, keyboard, filter, scroll, resize and paint without a component', async ({ page }) => {
    await page.goto('/surface3d.html');
    const r = await page.evaluate(async () => {
      const { useGridModel } = await import('/src/useGridModel.ts');
      const { HEADER_H } = await import('/src/CanvasGrid.ts');

      const events: string[] = [];
      const rows = Array.from({ length: 60 }, (_, i) => ({ id: i, name: `row-${String(59 - i).padStart(2, '0')}`, qty: (i * 7) % 13 }));
      const model = useGridModel({
        columnDefs: () => [
          { field: 'id',   headerName: 'ID',   width: 100, filter: true },
          { field: 'name', headerName: 'Name', width: 100 },
          { field: 'qty',  headerName: 'Qty',  width: 100 },
        ],
        rowData: () => rows,
        rowHeight: () => 28,
        theme: () => 'phosphor',
        emit: ((e: string, p?: { row?: number }) => events.push(e + (p?.row !== undefined ? `:${p.row}` : ''))) as never,
        host: { redraw: () => { events.push('redraw'); } },
      });
      model.init();
      model.setViewport(300, 300, 300, 300);   // 3 cols x 100px fill 300px exactly
      const ptr = (cx: number, cy: number) => ({ cx, cy, hitScale: 1 });
      const mouse = (shiftKey = false) => ({ shiftKey } as MouseEvent);
      const out: Record<string, unknown> = {};

      out.rows0 = model.filteredRows.value.length;
      out.firstUnsorted = model.filteredRows.value[0].id;

      // header click on "Name" (x 100..200) → ascending sort; first row is the lexically smallest
      model.click(ptr(150, HEADER_H / 2), mouse());
      out.sortedFirst = model.filteredRows.value[0].name;
      out.sortEvt = events.includes('sort-changed');
      // plain second click → descending
      model.click(ptr(150, HEADER_H / 2), mouse());
      out.descFirst = model.filteredRows.value[0].name;

      // body click selects cell (row 0, col 1); shift-click extends the anchor rectangle
      model.click(ptr(150, HEADER_H + 5), mouse());
      out.sel = { ...model.selectedCell.value };
      model.click(ptr(250, HEADER_H + 28 * 2 + 5), mouse(true));
      out.selExtended = { active: { ...model.selectedCell.value }, anchor: { ...model.selectionAnchor.value } };
      out.rowClickedEmitted = events.some(e => e.startsWith('cell-selected'));

      // keyboard: arrow down moves, Escape clears
      const key = (k: string, shiftKey = false) => model.keyDown({ key: k, shiftKey, ctrlKey: false, metaKey: false, preventDefault() {} });
      key('Escape');
      out.afterEsc = model.selectedCell.value;
      key('ArrowDown');                       // no selection → seeds at first visible row
      key('ArrowDown'); key('ArrowRight');
      out.afterArrows = { ...model.selectedCell.value };

      // wheel scroll clamps to [0, maxScrollY]; 60 rows * 28 > body height
      model.wheel(0, 100000, false);
      out.scrollClamped = model.scrollY.value === model.maxScrollY.value && model.maxScrollY.value > 0;

      // filter model via the API shrinks the row set and resets scroll
      model.api.setFilterModel({ name: { type: 'equals', filter: 'row-07' } });
      out.filtered = model.filteredRows.value.length;
      await new Promise(r => setTimeout(r, 0));   // Vue flushes watchers on the next tick
      out.scrollReset = model.scrollY.value;
      model.api.setFilterModel(null);

      // column resize drag: grab the right edge of col 0 (x≈100) and move +40px
      const w0 = model.displayCols.value[0].width;
      model.pointerDown(ptr(99, HEADER_H / 2), 99, 10);
      out.resizing = model.resizing;
      model.globalMove(139, 10);
      model.globalUp();
      out.colWidenedBy = model.displayCols.value[0].width - w0;
      out.colResizedEvt = events.includes('column-resized');

      // paint into a bare canvas: non-blank
      const canvas = document.createElement('canvas');
      canvas.width = 300; canvas.height = 300;
      model.paint(canvas, { dpr: 1, glow: false });
      const px = canvas.getContext('2d')!.getImageData(0, 0, 300, 300).data;
      let lit = 0; for (let i = 0; i < px.length; i += 4) if (px[i] || px[i + 1] || px[i + 2]) lit++;
      out.litPixels = lit;

      model.dispose();
      return out;
    });

    expect(r.rows0).toBe(60);
    expect(r.firstUnsorted).toBe(0);
    expect(r.sortedFirst).toBe('row-00');
    expect(r.sortEvt).toBe(true);
    expect(r.descFirst).toBe('row-59');
    expect(r.sel).toEqual({ row: 0, col: 1 });
    expect(r.selExtended).toEqual({ active: { row: 2, col: 2 }, anchor: { row: 0, col: 1 } });
    expect(r.rowClickedEmitted).toBe(true);
    expect(r.afterEsc).toBeNull();
    expect(r.afterArrows).toEqual({ row: 1, col: 1 });
    expect(r.scrollClamped).toBe(true);
    expect(r.filtered).toBe(1);
    expect(r.scrollReset).toBe(0);
    expect(r.resizing).toBe(true);
    expect(r.colWidenedBy).toBeGreaterThan(10);
    expect(r.colResizedEvt).toBe(true);
    expect(r.litPixels as number).toBeGreaterThan(2000);
  });
});
