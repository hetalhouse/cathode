/**
 * useCandleWallModel — the headless half of the candle WALL: the cells' layout for the canvas it is given, the vertical scroll, the hovered cell, hit-testing, and the
 * paint call. Canvas-space input (LOGICAL px), no DOM events / renderer — a stage panel (candleWallContent) maps a raycast to it. The layout and the painter are the
 * shared pure functions in CanvasCandleWall (also what CathodeCandleGrid draws with).
 */
import { ref, watch, effectScope } from 'vue'
import { layoutWall, wallCellAt, wallMaxScroll, drawWall } from './CanvasCandleWall'
import type { WallCell, WallCellCache } from './CanvasCandleWall'
import type { CandleColors } from './CanvasCandle'

export interface WallHost { redraw(): void }

export interface WallModelOptions {
  cells:           () => WallCell[]
  theme:           () => string
  showVolume?:     () => boolean
  volumeFraction?: () => number
  slotW?:          () => number
  colors?:         () => Partial<CandleColors> | undefined
  minCellW?:       () => number
  cellAspect?:     () => number
  host:            WallHost
}

export interface WallPaintOpts { dpr: number; glow: boolean }

export function useCandleWallModel(o: WallModelOptions) {
  const scope = effectScope()
  return scope.run(() => {
    const viewW = ref(0)
    const viewH = ref(0)
    const scrollY = ref(0)
    const hoveredCell = ref(-1)
    const cache: WallCellCache = new Map()
    const minCellW = () => o.minCellW?.() ?? 210
    const cellAspect = () => o.cellAspect?.() ?? 0.6

    const layout = () => layoutWall({ count: o.cells().length, width: viewW.value, minCellW: minCellW(), cellAspect: cellAspect(), scrollY: scrollY.value })
    const maxScroll = () => wallMaxScroll(layout().totalH, viewH.value)

    // new data / a new look: keep the scroll in range and repaint
    watch([o.cells, o.theme, () => o.showVolume?.(), () => o.volumeFraction?.(), () => o.slotW?.(), () => o.colors?.(), minCellW, cellAspect], () => {
      scrollY.value = Math.min(scrollY.value, maxScroll())
      o.host.redraw()
    })
    watch([scrollY, hoveredCell], () => o.host.redraw())

    /** the content canvas is `w` x `h` logical px */
    function setViewport(w: number, h: number) { viewW.value = w; viewH.value = h; scrollY.value = Math.min(scrollY.value, maxScroll()); o.host.redraw() }

    /** scroll by `deltaY` px; returns whether the wall could scroll at all (a wall that fits has nothing to scroll) */
    function wheel(deltaY: number): boolean {
      const max = maxScroll()
      if (max <= 0) return false
      scrollY.value = Math.max(0, Math.min(max, scrollY.value + deltaY))
      return true
    }

    /** the cell id under (cx, cy) in canvas px, or null */
    function cellIdAt(cx: number, cy: number): string | null {
      const i = wallCellAt(layout().rects, cx, cy)
      return i >= 0 ? o.cells()[i].id : null
    }
    /** the pointer is at (cx, cy): returns the hovered cell's index (-1 = none) */
    function hover(cx: number, cy: number): number {
      const i = wallCellAt(layout().rects, cx, cy)
      hoveredCell.value = i
      return i
    }
    function leave() { hoveredCell.value = -1 }

    function paint(canvas: HTMLCanvasElement, { dpr, glow }: WallPaintOpts) {
      drawWall(canvas, {
        cells: o.cells(), theme: o.theme(), glow, showVolume: o.showVolume?.() ?? true, volumeFraction: o.volumeFraction?.() ?? 0.22, slotW: o.slotW?.() ?? 3,
        colors: o.colors?.(), hoveredCell: hoveredCell.value, scrollY: scrollY.value, minCellW: minCellW(), cellAspect: cellAspect(), dpr,
      }, cache)
    }

    function dispose() { cache.clear(); scope.stop() }

    return { viewW, viewH, scrollY, hoveredCell, layout, maxScroll, setViewport, wheel, cellIdAt, hover, leave, paint, dispose }
  })!
}

export type WallModel = ReturnType<typeof useCandleWallModel>
