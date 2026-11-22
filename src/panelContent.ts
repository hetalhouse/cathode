/**
 * PanelContent — what a CathodeStage3D panel shows and how it hears the pointer.
 *
 * A panel is a CathodeSurface (world mode) plus an input adapter. The stage turns a raycast into
 * a PanelPointerEvent in the surface's own LOGICAL px — the same canvas space the painter draws
 * in — and the content decides what it means. gridContent() binds a headless GridModel; any
 * painter-only widget is just surfaceContent(); gaugeContent() is a ready-made one for a gauge.
 */
import { CathodeSurface } from './CathodeSurface'
import { useGridModel } from './useGridModel'
import type { GridModel, GridEmit } from './useGridModel'
import type { ColDef } from './types'
import { drawGauge } from './CanvasGauge'
import type { GaugeItem, GaugeColors, GaugeMark, GaugeMeter } from './CanvasGauge'

export type PanelPointerKind = 'move' | 'down' | 'up' | 'click' | 'leave' | 'wheel' | 'drag'

export interface PanelPointerEvent {
  kind: PanelPointerKind
  /** content position in the surface's logical px; -1 when the pointer is over the bend's bezel */
  x: number
  y: number
  /** local content-px per screen-px (≥ 1): keeps fixed-size hit zones the same size ON SCREEN */
  hitScale: number
  clientX: number
  clientY: number
  deltaX: number
  deltaY: number
  /** click count on 'click' events (1, then 2 for a double-click — as `MouseEvent.detail`); 0 for every other kind */
  detail: number
  shiftKey: boolean
}

export interface PanelContent {
  surface: CathodeSurface
  /** logical px the surface is drawn at */
  width:  number
  height: number
  /** The stage hands over a function that schedules a repaint + render. */
  attach?(invalidate: () => void): void
  /**
   * Pointer input. 'drag' = the pointer moved while a press that began on this panel is held
   * (it may be anywhere on screen); 'up' ends it. Return a CSS cursor, or null/undefined to leave it.
   */
  pointer?(e: PanelPointerEvent): string | null | void
  key?(e: KeyboardEvent): void
  /**
   * The panel was resized: lay out for `width` x `height` logical px and update `this.width` / `this.height`. The stage
   * resizes the surface's backing store and repaints afterwards. A content WITHOUT this cannot be resized.
   */
  resize?(width: number, height: number): void
  dispose?(): void
}

/** A painter-only widget (e.g. a gauge): a surface, a size, and no input. */
export function surfaceContent(
  surface: CathodeSurface,
  width: number,
  height: number,
  extra: Partial<Pick<PanelContent, 'attach' | 'pointer' | 'key' | 'resize' | 'dispose'>> = {},
): PanelContent {
  return { surface, width, height, ...extra }
}

export interface GridContentOptions {
  columnDefs:           ColDef[]
  rowData?:             any[]
  pinnedBottomRowData?: any[]
  defaultColDef?:       Partial<ColDef>
  rowHeight?:           number
  theme?:               'none' | 'phosphor' | 'amber' | 'paper'
  width:                number
  height:               number
  /** grid events (row-clicked, cell-selected, sort-changed, …) */
  emit?:                GridEmit
}

/**
 * A grid for the stage: a headless GridModel + a world-mode surface, with pointer, wheel and key
 * input routed into the model. The filter popup is typed into directly (no DOM ghost input in 3D).
 * Unlike the DOM grid there is no bend-field gain here: the content canvas equals the panel.
 */
export function gridContent(o: GridContentOptions): PanelContent & { model: GridModel } {
  let invalidate = () => {}
  const theme = o.theme ?? 'phosphor'

  const model = useGridModel({
    columnDefs:          () => o.columnDefs,
    defaultColDef:       () => o.defaultColDef,
    rowData:             () => o.rowData,
    pinnedBottomRowData: () => o.pinnedBottomRowData,
    rowHeight:           () => o.rowHeight ?? 28,
    theme:               () => theme,
    emit:                o.emit ?? ((() => {}) as GridEmit),
    host:                { redraw: () => invalidate() },
  })
  model.init()
  model.setViewport(o.width, o.height, o.width, o.height)

  const surface = new CathodeSurface({
    mode:  'world',
    paint: (canvas, p) => model.paint(canvas, p),
  })

  const pointer: PanelContent['pointer'] = (e) => {
    const p = { cx: e.x, cy: e.y, hitScale: e.hitScale }
    switch (e.kind) {
      case 'move':  return model.resizing ? null : model.hover(p)
      case 'leave': model.leave(); return null
      case 'down':  model.pointerDown(p, e.clientX, e.clientY); return null
      case 'drag':  model.globalMove(e.clientX, e.clientY); return null
      case 'up':    model.globalUp(); return null
      case 'click': model.click(p, { shiftKey: e.shiftKey, detail: e.detail } as MouseEvent); return null
      case 'wheel': model.wheel(e.deltaX, e.deltaY, e.shiftKey); return null
    }
  }

  const key: PanelContent['key'] = (e) => {
    if (model.activeFilter.value) {
      // the filter popup is drawn in the canvas; with no ghost <input> the stage types for it
      if (e.key === 'Escape')    { e.preventDefault(); model.clearFilter(); return }
      if (e.key === 'Enter')     { e.preventDefault(); model.closeFilter(); return }
      if (e.key === 'Backspace') { e.preventDefault(); model.setFilterText(model.filterPopupValue.value.slice(0, -1)); invalidate(); return }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        model.setFilterText(model.filterPopupValue.value + e.key)
        invalidate()
        return
      }
    }
    model.keyDown(e)
  }

  const content: PanelContent & { model: GridModel } = {
    model, surface, width: o.width, height: o.height,
    attach: (fn) => { invalidate = fn },
    pointer, key,
    // more room → more columns / rows; the model re-clamps scroll and re-fits the columns to the new canvas
    resize(w, h) { content.width = w; content.height = h; model.setViewport(w, h, w, h); invalidate() },
    dispose: () => { model.dispose(); surface.dispose() },
  }
  return content
}

export interface GaugeContentProps {
  /** 'none' = transparent (glass); built-ins: phosphor | amber | paper */
  theme?:       'none' | 'phosphor' | 'amber' | 'paper'
  /** where the needle sits, on the [min, max] axis */
  value:        number
  min?:         number
  max?:         number
  /** the big figure; defaults to the signed `value` */
  readout?:     string
  /** headline beside the readout (e.g. "net short") */
  stance?:      string
  /** small line under the headline */
  sub?:         string
  leftLabel?:   string
  rightLabel?:  string
  /** the letter a chip shows for each pole, e.g. ['S', 'L'] */
  sideLetters?: [string, string]
  /** labelled ticks on the axis */
  marks?:       GaugeMark[]
  /** a secondary bar under the axis */
  meter?:       GaugeMeter | null
  caption?:     string
  note?:        string
  items?:       GaugeItem[]
  emptyText?:   string
  /** per-instance palette overrides */
  colors?:      Partial<GaugeColors>
  /** ease the needle to each new value (and sweep in from centre on mount); default true */
  animate?:     boolean
}

export interface GaugeContentOptions extends GaugeContentProps {
  /** logical px the gauge is drawn at */
  width:  number
  height: number
}

/**
 * A gauge for the stage — the same picture CathodeGauge.vue draws (a readout, a needle on a
 * left↔right axis, a caption, a note, a row of chips), as a PanelContent: the needle EASES to each new
 * value and sweeps in from centre on mount, exactly as the DOM component's does. Read-only (no input).
 * Push new data with `update()`; `shown` is the needle's current (animated) position.
 */
export function gaugeContent(o: GaugeContentOptions): PanelContent & { update(p: Partial<GaugeContentProps>): void; readonly shown: number } {
  let invalidate = () => {}
  let state: GaugeContentProps = { ...o }
  const mid = () => ((state.min ?? -1) + (state.max ?? 1)) / 2
  let shown = state.animate === false ? state.value : mid()
  let raf = 0

  const surface = new CathodeSurface({
    mode: 'world',
    paint: (canvas, { dpr, glow }) => {
      drawGauge(canvas, {
        dpr, theme: state.theme ?? 'none', colors: state.colors, glow,
        shown, value: state.value, min: state.min ?? -1, max: state.max ?? 1,
        readout: state.readout, stance: state.stance, sub: state.sub,
        leftLabel: state.leftLabel ?? '−', rightLabel: state.rightLabel ?? '+', sideLetters: state.sideLetters ?? ['−', '+'],
        marks: state.marks ?? [], meter: state.meter ?? null,
        caption: state.caption, note: state.note, items: state.items ?? [], emptyText: state.emptyText,
      })
    },
  })

  // ease the needle toward `value` (the DOM component's constants: 18% per frame, done within 0.004)
  const animateTo = () => {
    cancelAnimationFrame(raf)
    if (state.animate === false) { shown = state.value; invalidate(); return }
    const step = () => {
      const d = state.value - shown
      if (Math.abs(d) < 0.004) { shown = state.value; invalidate(); return }
      shown += d * 0.18
      invalidate()
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  const content: PanelContent & { update(p: Partial<GaugeContentProps>): void; readonly shown: number } = {
    surface, width: o.width, height: o.height,
    attach: (fn) => { invalidate = fn; animateTo() },   // the mount sweep: centre → value
    resize(w, h) { content.width = w; content.height = h; invalidate() },   // the painter lays out for the canvas it is given
    update(p) {
      const moved = p.value !== undefined && p.value !== state.value
      state = { ...state, ...p }
      if (moved || p.animate !== undefined) animateTo(); else invalidate()
    },
    get shown() { return shown },
    dispose: () => { cancelAnimationFrame(raf); invalidate = () => {}; surface.dispose() },
  }
  return content
}
