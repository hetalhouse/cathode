/**
 * useGridModel — the headless half of CathodeGrid.
 *
 * Everything the grid KNOWS and DOES that isn't presentation: columns, rows, sort / filter /
 * quick-filter, scroll, selection, the filter popup, column resize, keyboard navigation, the
 * GridApi, and the paint call that draws it all into a canvas. No DOM, no renderer, no Three.js.
 *
 * Input arrives in CANVAS space — LOGICAL px on the content canvas, the same space the painter
 * draws in — never as DOM events. A presenter maps its pointer to that space and calls in:
 *
 *   • CathodeGrid.vue maps a mouse/touch event through the screen's barrel bend
 *     (CanvasGrid.screenToCanvas) and the DOM is the host;
 *   • a 3D stage maps a raycast hit's UV through CathodeSurface.contentPoint().
 *
 * `host` carries the few side-effects the model can't do itself (repaint, focus the ghost input,
 * resize the surface). Reactivity is Vue's (`ref` / `computed`), created inside an effectScope so
 * a model that lives outside a component can be torn down with dispose().
 */
import { ref, reactive, computed, watch, nextTick, effectScope } from 'vue'
import type { CSSProperties } from 'vue'
import type { ColDef, ColState, GridApi, ResolvedCol } from './types'
import {
  drawGrid, hitTest,
  isOnFilterIcon, isOnResizeHandle, colLeft,
  layoutFilterPopup, drawFilterPopup, hitFilterPopup, type FilterPopupLayout,
  HEADER_H, THEME_COLORS,
  aggregate,
  wrapTextLines, rowHeightFor, buildRowOffsets, rowAtOffset, gridCellFont,
} from './CanvasGrid'

export type SortKey = { colId: string, dir: 'asc' | 'desc' }

/** A pointer position in canvas space. cx < 0 means "outside the drawn content" (the bezel). */
export interface GridPointer {
  cx: number
  cy: number
  /** local canvas-px per screen-px (≥ 1) — widens the fixed-size hit zones under distortion */
  hitScale: number
}

export interface GridEmit {
  (e: 'row-clicked',    p: { data: any, event: MouseEvent }): void
  (e: 'cell-selected',  p: { data: any, row: number, col: number, colId: string }): void
  (e: 'column-resized' | 'sort-changed' | 'filter-changed'): void
}

/** Side-effects the model asks of its presenter. All optional except redraw. */
export interface GridHost {
  redraw(): void
  /** GridApi.resize() — re-measure the presentation */
  resize?(): void
  focusCanvas?(): void
  focusFilterInput?(): void
  blurFilterInput?(): void
}

export interface GridModelOptions {
  columnDefs:           () => ColDef[]
  defaultColDef?:       () => Partial<ColDef> | undefined
  rowData?:             () => any[] | undefined
  pinnedBottomRowData?: () => any[] | undefined
  rowHeight:            () => number
  theme:                () => string
  emit:                 GridEmit
  host:                 GridHost
}

export interface GridPaintOpts { dpr: number, glow: boolean }

const H_SCROLL_LOCK_MS = 600   // suppress vertical scroll for this long after a horizontal gesture

export function useGridModel(opts: GridModelOptions) {
  const scope = effectScope(true)
  return scope.run(() => createModel(opts, scope))!
}

function createModel(opts: GridModelOptions, scope: ReturnType<typeof effectScope>) {
  const { emit, host } = opts

  // ── Grid data state ─────────────────────────────────────────────────────────

  const localRowData  = ref<any[]>(opts.rowData?.() ?? [])
  const localPinned   = ref<any[]>(opts.pinnedBottomRowData?.() ?? [])
  const quickFilter   = ref('')
  /** Ordered sort criteria — index 0 is the primary key. Shift-click appends. */
  const sortState     = ref<SortKey[]>([])
  const colFilters    = reactive<Record<string, string>>({})
  const colWidths     = reactive<Record<string, number>>({})   // hint-space overrides
  const hiddenCols    = reactive(new Set<string>())
  const refreshKey    = ref(0)

  // ── Canvas dimensions (set by setViewport) ──────────────────────────────────

  const canvasW = ref(0)   // CONTENT width (≥ screen width under bendField)
  const canvasH = ref(0)
  const screenW = ref(0)   // visible panel dims (the warp squeezes content into these)
  const screenH = ref(0)

  // ── Interaction state ───────────────────────────────────────────────────────

  const scrollY       = ref(0)   // vertical offset (px)
  const scrollX       = ref(0)   // horizontal offset (px)
  const hoveredRow    = ref(-1)
  const selectedCell  = ref<{ row: number, col: number } | null>(null)
  // Anchor for Excel-style range selection. Shift-arrow / shift-click moves `selectedCell` (the
  // active cursor) while leaving the anchor in place; the rectangle between them is the
  // selection. Plain arrow/click collapses it by writing both to the same cell.
  const selectionAnchor = ref<{ row: number, col: number } | null>(null)
  const activeFilter  = ref<string | null>(null)

  // Filter popup — drawn INTO the content canvas so it warps with the panel; a hidden real
  // <input> (the "ghost", owned by the presenter) carries focus, IME and keystrokes while the
  // glyphs + caret are ours. filterAnchorX is the popup's canvas-space anchor (column left).
  const filterPopupValue = ref('')
  const filterAnchorX    = ref(0)
  let   filterLayout: FilterPopupLayout | null = null
  const caretOn = ref(true)
  let caretTimer: ReturnType<typeof setInterval> | null = null
  watch(activeFilter, (open) => {
    if (caretTimer) { clearInterval(caretTimer); caretTimer = null }
    if (open) {
      caretOn.value = true
      caretTimer = setInterval(() => { caretOn.value = !caretOn.value; host.redraw() }, 530)
      nextTick(() => host.focusFilterInput?.())
    } else {
      filterLayout = null
      host.blurFilterInput?.()
    }
    host.redraw()
  })

  // ── Column ID helper ────────────────────────────────────────────────────────

  function colIdOf(def: ColDef): string {
    return (
      def.colId
      ?? def.field
      ?? (def.headerName ? def.headerName.toLowerCase().replace(/\s+/g, '_') : undefined)
      ?? `col_${Math.random().toString(36).slice(2, 7)}`
    )
  }

  // ── resolvedCols — applies user-set width overrides (hint-space) ────────────

  const resolvedCols = computed<ResolvedCol[]>(() => {
    const defaults = opts.defaultColDef?.() ?? {}
    return opts.columnDefs()
      .filter(def => !hiddenCols.has(colIdOf(def)))
      .map(def => {
        const colId  = colIdOf(def)
        const merged = { ...defaults, ...def } as ColDef
        return { colId, colDef: merged, width: colWidths[colId] ?? merged.width ?? 100 }
      })
  })

  /**
   * displayCols — columns scaled so they EXACTLY fill canvasW.
   *
   * Only scales UP when columns are narrower than the canvas. When columns exceed canvas width,
   * natural widths are used and horizontal scroll handles navigation.
   */
  const displayCols = computed<ResolvedCol[]>(() => {
    const W = canvasW.value
    if (!W) return resolvedCols.value

    const totalHint = resolvedCols.value.reduce((s, c) => s + c.width, 0)
    if (!totalHint) return resolvedCols.value

    if (totalHint >= W) return resolvedCols.value

    const scale = W / totalHint
    let used = 0
    return resolvedCols.value.map((c, i) => {
      const isLast = i === resolvedCols.value.length - 1
      const w = isLast ? W - used : Math.max(8, Math.round(c.width * scale))
      used += w
      return { ...c, width: w }
    })
  })

  const maxScrollX = computed(() => {
    const totalW = displayCols.value.reduce((s, c) => s + c.width, 0)
    return Math.max(0, totalW - canvasW.value)
  })

  // ── Cell value / format helpers ─────────────────────────────────────────────

  function getCellValue(row: any, col: ResolvedCol): any {
    if (col.colDef.valueGetter) return col.colDef.valueGetter({ data: row, colDef: col.colDef })
    if (col.colDef.field)       return row[col.colDef.field]
    return undefined
  }

  function formatCell(col: ResolvedCol, row: any): string {
    const value = getCellValue(row, col)
    if (col.colDef.valueFormatter)
      return col.colDef.valueFormatter({ value, data: row, colDef: col.colDef }) ?? ''
    if (col.colDef.cellRenderer) {
      const html = col.colDef.cellRenderer({ value, data: row, colDef: col.colDef }) ?? ''
      return html.replace(/<[^>]+>/g, '')        // strip HTML → plain text for canvas
    }
    return value == null ? '' : String(value)
  }

  function getCellStyle(col: ResolvedCol, row: any): CSSProperties {
    if (!col.colDef.cellStyle) return {}
    if (typeof col.colDef.cellStyle === 'function')
      return col.colDef.cellStyle({ value: getCellValue(row, col), data: row, colDef: col.colDef }) ?? {}
    return col.colDef.cellStyle
  }

  /** Initial sort from columnDefs — `sortIndex` orders them, else column order. */
  function initialSorts(): SortKey[] {
    return opts.columnDefs()
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => d.sort)
      .sort((a, b) => (a.d.sortIndex ?? a.i) - (b.d.sortIndex ?? b.i))
      .map(({ d }) => ({ colId: colIdOf(d), dir: d.sort! }))
  }

  // ── Filter + sort ───────────────────────────────────────────────────────────

  const filteredRows = computed<any[]>(() => {
    void refreshKey.value
    let rows = localRowData.value

    const q = quickFilter.value.trim().toLowerCase()
    if (q) {
      rows = rows.filter(row =>
        resolvedCols.value.some(col =>
          String(getCellValue(row, col) ?? '').toLowerCase().includes(q)
        )
      )
    }

    for (const [colId, raw] of Object.entries(colFilters)) {
      if (!raw) continue
      const col = resolvedCols.value.find(c => c.colId === colId)
      if (!col) continue
      if (raw.startsWith('__eq__')) {
        const t = raw.slice(6).toLowerCase()
        rows = rows.filter(r => String(getCellValue(r, col) ?? '').toLowerCase() === t)
      } else {
        const t = raw.toLowerCase()
        rows = rows.filter(r => String(getCellValue(r, col) ?? '').toLowerCase().includes(t))
      }
    }

    const sortKeys = sortState.value
      .map(({ colId, dir }) => ({ col: resolvedCols.value.find(c => c.colId === colId), dir }))
      .filter((k): k is { col: ResolvedCol, dir: 'asc' | 'desc' } => !!k.col)
    if (sortKeys.length) {
      rows = [...rows].sort((a, b) => {
        for (const { col, dir } of sortKeys) {
          const av = getCellValue(a, col)
          const bv = getCellValue(b, col)
          let cmp = 0
          if (col.colDef.comparator)                                 cmp = col.colDef.comparator(av, bv)
          else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
          else cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true })
          if (cmp) return dir === 'asc' ? cmp : -cmp
        }
        return 0
      })
    }

    return rows
  })

  // ── Variable row height (word-wrap columns) ─────────────────────────────────
  // A grid with no `wrap` column has rowHeights=null and every geometry helper below falls back
  // to the uniform rowHeight — zero behaviour change. Only when a column declares `wrap: true`
  // do rows grow to fit their wrapped text.

  let _measureCanvas: HTMLCanvasElement | null = null
  function measureCtx(): CanvasRenderingContext2D | null {
    if (typeof document === 'undefined') return null
    if (!_measureCanvas) _measureCanvas = document.createElement('canvas')
    const ctx = _measureCanvas.getContext('2d')
    if (ctx) ctx.font = gridCellFont()   // identical font to the renderer's cell draw
    return ctx
  }

  const hasWrapCol = computed(() => displayCols.value.some(c => c.colDef.wrap))

  // Per-row heights parallel to filteredRows; null when no wrap column exists.
  const rowHeights = computed<number[] | null>(() => {
    if (!hasWrapCol.value) return null
    const ctx = measureCtx()
    if (!ctx) return null
    const wrapCols = displayCols.value.filter(c => c.colDef.wrap)
    const base = opts.rowHeight()
    return filteredRows.value.map(row => {
      let maxLines = 1
      for (const col of wrapCols) {
        const lines = wrapTextLines(ctx, formatCell(col, row), Math.max(20, col.width - 16))
        if (lines.length > maxLines) maxLines = lines.length
      }
      return rowHeightFor(maxLines, base)
    })
  })

  const rowOffsets = computed<number[] | null>(() =>
    rowHeights.value ? buildRowOffsets(rowHeights.value, filteredRows.value.length) : null
  )

  const totalRowsH = computed(() =>
    rowOffsets.value
      ? rowOffsets.value[filteredRows.value.length]
      : filteredRows.value.length * opts.rowHeight()
  )

  // ── Viewport geometry ───────────────────────────────────────────────────────

  const bodyH = computed(() => {
    const pinnedH = localPinned.value.length * opts.rowHeight()
    return Math.max(0, canvasH.value - HEADER_H - pinnedH)
  })

  const maxScrollY = computed(() => Math.max(0, totalRowsH.value - bodyH.value))

  const visibleRowCount = computed(() => Math.max(1, Math.floor(bodyH.value / opts.rowHeight())))

  const firstVisibleRow = computed(() => {
    const n = filteredRows.value.length
    if (n === 0) return 0
    const idx = rowOffsets.value
      ? rowAtOffset(rowOffsets.value, scrollY.value)
      : Math.floor(scrollY.value / opts.rowHeight())
    return Math.min(n - 1, idx)
  })

  const lastVisibleRow = computed(() => {
    const n = filteredRows.value.length
    if (n === 0) return 0
    if (rowOffsets.value)
      return Math.min(n - 1, rowAtOffset(rowOffsets.value, scrollY.value + bodyH.value - 1))
    return Math.min(n - 1, firstVisibleRow.value + visibleRowCount.value - 1)
  })

  /**
   * Aggregate row — one entry per column declaring `aggFunc`. Recomputes when filteredRows
   * changes. Null when no column requests aggregation, so the renderer skips the band entirely.
   */
  const aggregateRow = computed<Record<string, string> | null>(() => {
    const aggCols = resolvedCols.value.filter(c => c.colDef.aggFunc != null)
    if (aggCols.length === 0) return null

    const rows = filteredRows.value
    const out: Record<string, string> = {}
    for (const col of aggCols) {
      const values = rows.map(r => getCellValue(r, col))
      const result = aggregate(values, col.colDef.aggFunc!)
      if (result === null || result === undefined) {
        out[col.colId] = ''
        continue
      }
      out[col.colId] = col.colDef.aggValueFormatter
        ? col.colDef.aggValueFormatter(result)
        : String(result)
    }
    // Mark first aggregated column with a Σ label only if there's no value there already —
    // purely a "this row is totals" cue.
    const firstAggColId = aggCols[0].colId
    if (out[firstAggColId] === '') out[firstAggColId] = 'Σ'

    return out
  })

  watch(filteredRows, () => { scrollY.value = 0; selectedCell.value = null })
  watch(maxScrollX,  () => { scrollX.value = Math.min(scrollX.value, maxScrollX.value) })
  watch(maxScrollY,  () => { scrollY.value = Math.min(scrollY.value, maxScrollY.value) })

  // Data changes → repaint
  watch([filteredRows, () => localPinned.value, displayCols, scrollY, hoveredRow, selectedCell],
    () => nextTick(() => host.redraw()))

  // Emit cell-selected when selection changes (keyboard moves; clicks also emit directly)
  watch(selectedCell, (sc) => {
    if (!sc) return
    const row = filteredRows.value[sc.row]   // sc.row is absolute
    const col = displayCols.value[sc.col]
    if (row && col) emit('cell-selected', { data: row, row: sc.row, col: sc.col, colId: col.colId })
  })

  // ── Viewport (the presenter reports its size) ───────────────────────────────

  /**
   * Set the content canvas size (LOGICAL px) and the visible screen size. The two differ under
   * bendField: the content is WIDER than the screen by the factor the warp absorbs. Clamps scroll.
   */
  function setViewport(contentW: number, contentH: number, sW: number, sH: number) {
    screenW.value = sW
    screenH.value = sH
    canvasW.value = contentW
    canvasH.value = contentH
    scrollX.value = Math.max(0, Math.min(maxScrollX.value, scrollX.value))
    scrollY.value = Math.max(0, Math.min(maxScrollY.value, scrollY.value))
  }

  // ── Scrolling ───────────────────────────────────────────────────────────────

  // Scroll the absolute row index into the visible viewport.
  function ensureRowVisible(absRow: number) {
    const offs      = rowOffsets.value
    const rowTop    = offs ? offs[absRow]     : absRow * opts.rowHeight()
    const rowBottom = offs ? offs[absRow + 1] : rowTop + opts.rowHeight()
    if (rowTop < scrollY.value) {
      scrollY.value = rowTop
    } else if (rowBottom > scrollY.value + bodyH.value) {
      scrollY.value = Math.min(maxScrollY.value, rowBottom - bodyH.value)
    }
  }

  // Scroll the column into view (horizontal).
  function ensureColVisible(colIdx: number) {
    if (!canvasW.value) return
    let colX = 0
    for (let i = 0; i < colIdx; i++) colX += displayCols.value[i].width
    const colW    = displayCols.value[colIdx]?.width ?? 0
    const canvasX = colX - scrollX.value
    if (canvasX < 0) {
      scrollX.value = Math.max(0, colX)
    } else if (canvasX + colW > canvasW.value) {
      scrollX.value = Math.min(maxScrollX.value, colX + colW - canvasW.value)
    }
  }

  function pageUp() {
    scrollY.value = Math.max(0, scrollY.value - bodyH.value)
    host.redraw()
  }

  function pageDown() {
    scrollY.value = Math.min(maxScrollY.value, scrollY.value + bodyH.value)
    host.redraw()
  }

  // ── Column resize + pan-to-scroll ───────────────────────────────────────────
  // Resize adjusts the PROPORTIONAL width of a column while keeping all columns filling the
  // container. We convert from display-pixel drag delta to hint-space so that displayCols
  // re-scales correctly.

  let resizeActive      = false
  let resizeColId       = ''
  let resizeStartX      = 0
  let resizeStartDispW  = 0   // display width at resize start
  let resizeScale       = 1   // local canvas-px-per-screen-px at the grab (concave shrinks it on screen)
  let wasDragging       = false

  // Pan-to-scroll (click+drag in body, or one-finger touch)
  let panActive       = false
  let panStartX       = 0
  let panStartY       = 0
  let panStartScrollX = 0
  let panStartScrollY = 0
  let panMoved        = false

  function startColResize(colId: string, startClientX: number, scale = 1) {
    resizeActive     = true
    resizeColId      = colId
    resizeStartX     = startClientX
    resizeScale      = scale   // canvas px per screen px at the grab point (distortion-aware)
    resizeStartDispW = displayCols.value.find(c => c.colId === colId)?.width ?? 100
    wasDragging      = false
  }

  /** Begin a body pan (mouse drag or touch) from a client position. */
  function panStart(clientX: number, clientY: number) {
    panActive       = true
    panMoved        = false
    panStartX       = clientX
    panStartY       = clientY
    panStartScrollX = scrollX.value
    panStartScrollY = scrollY.value
  }

  /** Drive the pan from the current client position. */
  function panMove(clientX: number, clientY: number) {
    const dx = panStartX - clientX
    const dy = panStartY - clientY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) panMoved = true
    scrollX.value = Math.max(0, Math.min(maxScrollX.value, panStartScrollX + dx))
    scrollY.value = Math.max(0, Math.min(maxScrollY.value, panStartScrollY + dy))
    host.redraw()
  }

  function panEnd() {
    if (panActive) {
      if (panMoved) wasDragging = true
      panActive = false
    }
  }

  /** Document-level pointer move: continues a pan or a column resize. */
  function globalMove(clientX: number, clientY: number) {
    if (panActive) { panMove(clientX, clientY); return }
    if (!resizeActive) return

    const W            = canvasW.value
    const desiredDispW = Math.max(30, resizeStartDispW + (clientX - resizeStartX) * resizeScale)
    const otherHints   = resolvedCols.value
      .filter(c => c.colId !== resizeColId)
      .reduce((s, c) => s + c.width, 0)

    // Solve: desiredDispW * scale = hint, where scale = W / (hint + otherHints)
    // → hint = (desiredDispW * otherHints) / (W - desiredDispW)
    const denom = W - desiredDispW
    if (denom > 10) {
      colWidths[resizeColId] = Math.max(10, Math.round((desiredDispW * otherHints) / denom))
    }

    host.redraw()
  }

  /** Document-level pointer up: ends a pan or a column resize. */
  function globalUp() {
    panEnd()
    if (resizeActive) {
      resizeActive = false
      wasDragging  = true
      emit('column-resized')
    }
  }

  // ── Hit testing (canvas space) ──────────────────────────────────────────────

  function hit(cx: number, cy: number) {
    return hitTest(
      cx, cy, displayCols.value,
      filteredRows.value.length, opts.rowHeight(),
      scrollY.value, canvasH.value, localPinned.value.length, scrollX.value,
      aggregateRow.value !== null,
      rowHeights.value ?? undefined,
    )
  }

  // ── Pointer input ───────────────────────────────────────────────────────────

  let lastHScrollTime = 0   // timestamp of last horizontal scroll event

  function wheel(deltaX: number, deltaY: number, shiftKey: boolean) {
    activeFilter.value = null
    const now = Date.now()

    // Horizontal scroll — any deltaX means the gesture is horizontal. Lock out vertical scroll
    // for H_SCROLL_LOCK_MS to suppress stray deltaX=0 events that trackpads emit at gesture
    // start/end.
    if (deltaX !== 0) {
      lastHScrollTime = now
      scrollX.value = Math.max(0, Math.min(maxScrollX.value, scrollX.value + deltaX))
      host.redraw()
      return
    }
    if (shiftKey && deltaY !== 0) {
      lastHScrollTime = now
      scrollX.value = Math.max(0, Math.min(maxScrollX.value, scrollX.value + deltaY))
      host.redraw()
      return
    }

    // Still within the horizontal scroll lock window — drop this event entirely
    if (now - lastHScrollTime < H_SCROLL_LOCK_MS) return

    // Vertical — always smooth pixel scroll regardless of pagination
    scrollY.value = Math.max(0, Math.min(maxScrollY.value, scrollY.value + deltaY))
    host.redraw()
  }

  /**
   * Pointer moved over the grid. Returns the cursor to show, or null to leave it unchanged.
   * (Callers should skip this while `resizing`.)
   */
  function hover(p: GridPointer): string | null {
    if (p.cx < 0) { hoveredRow.value = -1; host.redraw(); return null }

    if (activeFilter.value && filterLayout) {
      const zone = hitFilterPopup(p.cx, p.cy, filterLayout, p.hitScale)
      if (zone !== 'outside') {
        hoveredRow.value = -1
        host.redraw()
        return zone === 'clear' ? 'pointer' : 'text'
      }
    }

    const h = hit(p.cx, p.cy)
    hoveredRow.value = h.area === 'body' ? h.rowIdx : -1

    let cursor: string
    if (h.area === 'header' && h.colIdx >= 0) {
      const col       = displayCols.value[h.colIdx]
      const clx       = colLeft(h.colIdx, displayCols.value)
      const contentCx = p.cx + scrollX.value
      cursor = col && isOnResizeHandle(contentCx, clx, col.width, p.hitScale) ? 'col-resize' : 'pointer'
    } else if (h.area === 'body') {
      cursor = 'pointer'
    } else {
      cursor = 'default'
    }

    host.redraw()
    return cursor
  }

  function leave() {
    hoveredRow.value = -1
    host.redraw()
  }

  /** Button down on the grid. `clientX/Y` seed a pan or a column resize. */
  function pointerDown(p: GridPointer, clientX: number, clientY: number) {
    if (p.cx < 0) return
    if (activeFilter.value && filterLayout && hitFilterPopup(p.cx, p.cy, filterLayout, p.hitScale) !== 'outside') return

    if (p.cy >= HEADER_H) {
      // Body press — start pan. (The DOM host lets the event bubble so CathodeContainer can
      // bringToFront; its drag only starts from the title bar so there's no conflict.)
      panStart(clientX, clientY)
      return
    }

    const contentCx = p.cx + scrollX.value
    for (let ci = 0; ci < displayCols.value.length; ci++) {
      const col = displayCols.value[ci]
      const clx = colLeft(ci, displayCols.value)
      if (col.colDef.resizable !== false && isOnResizeHandle(contentCx, clx, col.width, p.hitScale)) {
        startColResize(col.colId, clientX, p.hitScale)
        return
      }
    }
  }

  /**
   * Click. `p` is the pointer in canvas space (cx < 0 = bezel). Returns
   * `{ stopPropagation: true }` when the click opened/closed a header filter popup and the DOM
   * host should stop the event.
   */
  function click(p: GridPointer, e: MouseEvent): { stopPropagation: boolean } {
    const result = { stopPropagation: false }
    if (wasDragging) { wasDragging = false; return result }
    if (resizeActive) return result

    if (p.cx < 0) { activeFilter.value = null; return result }

    // Popup overlay eats its clicks before any grid path (it is drawn on top).
    if (activeFilter.value && filterLayout) {
      const zone = hitFilterPopup(p.cx, p.cy, filterLayout, p.hitScale)
      if (zone === 'clear') { clearFilter(); return result }
      if (zone !== 'outside') { host.focusFilterInput?.(); return result }
      // outside → close, then let the click fall through to the grid as usual
      activeFilter.value = null
    }

    const h = hit(p.cx, p.cy)

    // ── Header click — sort or filter ────────────────────────────────────────
    if (h.area === 'header' && h.colIdx >= 0) {
      const col       = displayCols.value[h.colIdx]
      const clx       = colLeft(h.colIdx, displayCols.value)
      const contentCx = p.cx + scrollX.value

      if (col.colDef.filter && isOnFilterIcon(contentCx, clx, col.width, p.hitScale)) {
        result.stopPropagation = true
        if (activeFilter.value === col.colId) {
          activeFilter.value = null
        } else {
          activeFilter.value     = col.colId
          filterPopupValue.value = colFilters[col.colId]?.startsWith('__eq__')
            ? colFilters[col.colId].slice(6)
            : (colFilters[col.colId] ?? '')
          // Anchor in viewport canvas coords (content x minus current scroll)
          filterAnchorX.value    = Math.max(0, clx - scrollX.value)
        }
      } else if (col.colDef.sortable !== false) {
        activeFilter.value = null
        const cur  = sortState.value.find(k => k.colId === col.colId)
        const next = !cur ? 'asc' : cur.dir === 'asc' ? 'desc' : null
        if (e.shiftKey) {
          // Shift-click: add / flip / drop this column, keep the other keys
          sortState.value = !cur
            ? [...sortState.value, { colId: col.colId, dir: 'asc' }]
            : next
              ? sortState.value.map(k => k.colId === col.colId ? { colId: k.colId, dir: next } : k)
              : sortState.value.filter(k => k.colId !== col.colId)
        } else {
          // Plain click: reset to this column alone
          sortState.value = next ? [{ colId: col.colId, dir: next }] : []
        }
        emit('sort-changed')
      }
      return result
    }

    activeFilter.value = null

    // ── Body click — select cell ─────────────────────────────────────────────
    if (h.area === 'body' && h.rowIdx >= 0 && h.colIdx >= 0) {
      const absRow = h.rowIdx
      // Shift-click extends the selection: keep the existing anchor (or the current cell if
      // there isn't one yet) and move the active cell only.
      if (e.shiftKey && selectedCell.value) {
        if (!selectionAnchor.value) selectionAnchor.value = { ...selectedCell.value }
        selectedCell.value = { row: absRow, col: h.colIdx }
      } else {
        selectedCell.value    = { row: absRow, col: h.colIdx }
        selectionAnchor.value = { row: absRow, col: h.colIdx }
      }
      host.focusCanvas?.()

      const row = filteredRows.value[absRow]
      const col = displayCols.value[h.colIdx]
      if (row && col) {
        emit('row-clicked',   { data: row, event: e })
        emit('cell-selected', { data: row, row: absRow, col: h.colIdx, colId: col.colId })
      }
    }
    return result
  }

  /**
   * A click anywhere in the document. `p` is the pointer in canvas space when the click landed
   * ON the grid canvas, else null. The filter popup lives IN the canvas, so a canvas click
   * inside its zones must not count as "outside" — the document-level closer maps the point and
   * checks the zones itself.
   */
  function docClick(p: GridPointer | null) {
    if (!activeFilter.value) return
    if (p && filterLayout && p.cx >= 0 && hitFilterPopup(p.cx, p.cy, filterLayout, p.hitScale) !== 'outside') return
    activeFilter.value = null
  }

  // ── Keyboard navigation ─────────────────────────────────────────────────────

  type KeyLike = Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'preventDefault'>

  function keyDown(e: KeyLike) {
    const cols   = displayCols.value
    const maxCol = cols.length - 1
    const maxRow = filteredRows.value.length - 1   // absolute

    if (!selectedCell.value) {
      if (['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Tab','Enter'].includes(e.key)) {
        e.preventDefault()
        selectedCell.value    = { row: firstVisibleRow.value, col: 0 }
        selectionAnchor.value = { row: firstVisibleRow.value, col: 0 }
      }
      return
    }

    let { row, col } = selectedCell.value   // row is absolute

    // `extend` = shift-held; we move only the active cell and leave the anchor where it is, so
    // the selection rectangle grows. Plain moves collapse the selection by writing the anchor to
    // the new active cell.
    const goTo = (r: number, c: number, extend = false) => {
      row = Math.max(0, Math.min(maxRow, r))
      col = Math.max(0, Math.min(maxCol, c))
      selectedCell.value = { row, col }
      if (!extend) selectionAnchor.value = { row, col }
      ensureRowVisible(row)
      ensureColVisible(col)
    }

    switch (e.key) {
      case 'ArrowDown':  e.preventDefault(); goTo(row + 1, col, e.shiftKey); break
      case 'ArrowUp':    e.preventDefault(); goTo(row - 1, col, e.shiftKey); break

      case 'ArrowRight':
        e.preventDefault()
        if (e.shiftKey) {
          // Shift-arrow stays on the same row even at the right edge — Excel doesn't wrap
          // selection. Plain arrow keeps the existing wrap behaviour.
          goTo(row, col + 1, true)
        } else {
          col < maxCol ? goTo(row, col + 1) : goTo(row + 1, 0)
        }
        break

      case 'ArrowLeft':
        e.preventDefault()
        if (e.shiftKey) {
          goTo(row, col - 1, true)
        } else {
          col > 0 ? goTo(row, col - 1) : goTo(row - 1, maxCol)
        }
        break

      case 'Tab':
        e.preventDefault()
        // Tab always collapses selection (single-cell editing rhythm) and wraps at row edges.
        // Shift+Tab is reverse-tab, not range extend.
        if (!e.shiftKey) { col < maxCol ? goTo(row, col + 1) : goTo(row + 1, 0) }
        else             { col > 0      ? goTo(row, col - 1) : goTo(row - 1, maxCol) }
        break

      case 'Enter':
        e.preventDefault()
        e.shiftKey ? goTo(row - 1, col) : goTo(row + 1, col)
        break

      case 'Home':
        e.preventDefault()
        if (e.ctrlKey || e.metaKey) goTo(0,   0,      e.shiftKey)
        else                        goTo(row, 0,      e.shiftKey)
        break

      case 'End':
        e.preventDefault()
        if (e.ctrlKey || e.metaKey) goTo(maxRow, maxCol, e.shiftKey)
        else                        goTo(row,    maxCol, e.shiftKey)
        break

      case 'PageDown':
        e.preventDefault()
        goTo(Math.min(maxRow, row + visibleRowCount.value), col, e.shiftKey)
        break

      case 'PageUp':
        e.preventDefault()
        goTo(Math.max(0, row - visibleRowCount.value), col, e.shiftKey)
        break

      case 'Escape':
        selectedCell.value    = null
        selectionAnchor.value = null
        break

      case 'c':
      case 'C':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          copySelectionToClipboard()
        }
        break
    }
  }

  // Build a TSV string from the current selection rectangle and write it to the clipboard. TSV
  // is what Excel/Numbers/Sheets paste-targets expect, so the user can Cmd+C from cathode and
  // Cmd+V into a spreadsheet.
  function copySelectionToClipboard() {
    if (!selectedCell.value) return
    const cols = displayCols.value
    const rows = filteredRows.value
    const a    = selectionAnchor.value ?? selectedCell.value
    const minR = Math.min(a.row, selectedCell.value.row)
    const maxR = Math.max(a.row, selectedCell.value.row)
    const minC = Math.min(a.col, selectedCell.value.col)
    const maxC = Math.max(a.col, selectedCell.value.col)

    const lines: string[] = []
    for (let r = minR; r <= maxR; r++) {
      const row = rows[r]
      if (!row) continue
      const fields: string[] = []
      for (let c = minC; c <= maxC; c++) {
        const col = cols[c]
        if (!col) continue
        // Replace embedded tabs / newlines so the TSV stays grid-shaped on paste
        fields.push(formatCell(col, row).replace(/[\t\r\n]+/g, ' '))
      }
      lines.push(fields.join('\t'))
    }
    const tsv = lines.join('\n')
    navigator.clipboard?.writeText(tsv).catch(() => {})
  }

  // ── Filter popup ────────────────────────────────────────────────────────────

  function setFilterText(val: string) {
    filterPopupValue.value = val
    if (val) colFilters[activeFilter.value!] = val
    else     delete colFilters[activeFilter.value!]
    emit('filter-changed')
  }

  function clearFilter() {
    if (activeFilter.value) delete colFilters[activeFilter.value]
    filterPopupValue.value = ''
    activeFilter.value     = null
    emit('filter-changed')
  }

  function closeFilter() { activeFilter.value = null }

  // ── Paint ───────────────────────────────────────────────────────────────────

  // Draw the filter popup into the content canvas after the body pass — it rides the warp.
  function drawPopupOverlay(canvas: HTMLCanvasElement, dpr: number) {
    if (!activeFilter.value || !canvas.width) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // draw the popup in LOGICAL coords at physical res (rides the warp)
    filterLayout = layoutFilterPopup(canvas.width / dpr, filterAnchorX.value, !!filterPopupValue.value)
    const colors = THEME_COLORS[opts.theme()] ?? THEME_COLORS['none']
    drawFilterPopup(ctx, filterLayout, filterPopupValue.value, caretOn.value, colors)
  }

  /** Paint the whole grid (body + popup) into `canvas` — a CathodeSurface painter callback. */
  function paint(canvas: HTMLCanvasElement, { dpr, glow }: GridPaintOpts) {
    drawGrid(canvas, {
      cols:        displayCols.value,
      rows:        filteredRows.value,
      pinnedRows:  localPinned.value,
      rowHeight:   opts.rowHeight(),
      // Per-row variable heights for `wrap` columns.
      rowHeights:  rowHeights.value ?? undefined,
      scrollY:     scrollY.value,
      scrollX:     scrollX.value,
      theme:       opts.theme(),
      glow,
      sorts:       sortState.value,
      colFilters,
      hoveredRow:  hoveredRow.value,
      selectedRow: selectedCell.value?.row ?? -1,
      selectedCol: selectedCell.value?.col ?? -1,
      selectionAnchorRow: selectionAnchor.value?.row ?? -1,
      selectionAnchorCol: selectionAnchor.value?.col ?? -1,
      formatCell,
      getCellStyle,
      aggregateRow: aggregateRow.value,
      dpr,
    })
    drawPopupOverlay(canvas, dpr)
  }

  // ── Grid API ────────────────────────────────────────────────────────────────

  const api: GridApi = {
    setGridOption(key: string, value: any) {
      if      (key === 'rowData')             localRowData.value = value
      else if (key === 'pinnedBottomRowData') localPinned.value  = value
      else if (key === 'quickFilterText')     quickFilter.value  = value
    },

    getColumnState(): ColState[] {
      return opts.columnDefs().map(def => {
        const colId = colIdOf(def)
        return {
          colId,
          hide:      hiddenCols.has(colId),
          sort:      sortState.value.find(k => k.colId === colId)?.dir ?? null,
          sortIndex: sortState.value.some(k => k.colId === colId)
            ? sortState.value.findIndex(k => k.colId === colId) : null,
          width:     colWidths[colId] ?? def.width,
        }
      })
    },

    applyColumnState({ state }) {
      const sorted = state.filter(s => s.sort)
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
      if (sorted.length) sortState.value = sorted.map(s => ({ colId: s.colId, dir: s.sort! }))
      for (const s of state) {
        if (s.hide === true)  hiddenCols.add(s.colId)
        if (s.hide === false) hiddenCols.delete(s.colId)
        if (s.width)          colWidths[s.colId] = s.width
      }
    },

    setFilterModel(model) {
      for (const k of Object.keys(colFilters)) delete colFilters[k]
      if (!model) return
      for (const [colId, filter] of Object.entries(model)) {
        if (filter?.type === 'equals') colFilters[colId] = `__eq__${filter.filter}`
        else if (filter?.filter)       colFilters[colId] = filter.filter
      }
    },

    getFilterModel() {
      const model: Record<string, any> = {}
      for (const [colId, raw] of Object.entries(colFilters)) {
        if (!raw) continue
        model[colId] = raw.startsWith('__eq__')
          ? { type: 'equals',   filter: raw.slice(6) }
          : { type: 'contains', filter: raw }
      }
      return model
    },

    async setColumnFilterModel(colId: string, model: any) {
      if (!model)                       delete colFilters[colId]
      else if (model.type === 'equals') colFilters[colId] = `__eq__${model.filter}`
      else                              colFilters[colId] = model.filter ?? ''
    },

    onFilterChanged() { /* reactive */ },
    refreshCells()    { refreshKey.value++ },

    exportDataAsCsv({ fileName = 'export.csv' } = {}) {
      const cols   = resolvedCols.value
      const header = cols.map(c => c.colDef.headerName ?? c.colId).join(',')
      const lines  = filteredRows.value.map(row =>
        cols.map(col => `"${String(formatCell(col, row)).replace(/"/g, '""')}"`).join(',')
      )
      const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
      const url  = URL.createObjectURL(blob)
      Object.assign(document.createElement('a'), { href: url, download: fileName }).click()
      URL.revokeObjectURL(url)
    },

    resize() { host.resize?.() },

    getSortModel() { return sortState.value.map(k => ({ colId: k.colId, sort: k.dir })) },
    setSortModel(model) { sortState.value = model.map(k => ({ colId: k.colId, dir: k.sort })) },
    getScrollY() { return scrollY.value },
    setScrollY(y) {
      // after the updates a sort / filter / data change queues (they reset the scroll to the top), and clamped to what the rows allow by then
      void nextTick(() => { scrollY.value = Math.max(0, Math.min(maxScrollY.value, y)) })
    },

    resetColumnState() {
      hiddenCols.clear()
      for (const def of opts.columnDefs()) {
        if (def.hide) hiddenCols.add(colIdOf(def))
      }
      sortState.value    = initialSorts()
      for (const k of Object.keys(colWidths))  delete colWidths[k]
      for (const k of Object.keys(colFilters)) delete colFilters[k]
      quickFilter.value  = ''
      scrollY.value      = 0
      selectedCell.value = null
      activeFilter.value = null
    },
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  /** Seed hidden columns, initial sorts and the row data from the options (call once on mount). */
  function init() {
    for (const def of opts.columnDefs()) {
      if (def.hide) hiddenCols.add(colIdOf(def))
    }
    if (!sortState.value.length) sortState.value = initialSorts()
    localRowData.value = opts.rowData?.() ?? []
    localPinned.value  = opts.pinnedBottomRowData?.() ?? []
  }

  /** Stop every watcher/computed and the caret timer. */
  function dispose() {
    if (caretTimer) { clearInterval(caretTimer); caretTimer = null }
    scope.stop()
  }

  return {
    // reactive state / derived
    scrollX, scrollY, maxScrollX, maxScrollY,
    filteredRows, displayCols, resolvedCols, aggregateRow, rowHeights,
    firstVisibleRow, lastVisibleRow, visibleRowCount,
    selectedCell, selectionAnchor, hoveredRow,
    activeFilter, filterPopupValue, caretOn,
    canvasW, canvasH, screenW, screenH,
    sortState, colFilters,
    // helpers
    formatCell, getCellValue, hit,
    get resizing() { return resizeActive },
    get panning()  { return panActive },
    // viewport + scrolling
    setViewport, pageUp, pageDown, ensureRowVisible, ensureColVisible,
    // input (canvas space)
    wheel, hover, leave, pointerDown, click, docClick, keyDown,
    panStart, panMove, panEnd, globalMove, globalUp,
    // filter popup
    setFilterText, clearFilter, closeFilter,
    // paint / api / lifecycle
    paint, api, init, dispose,
  }
}

export type GridModel = ReturnType<typeof useGridModel>
