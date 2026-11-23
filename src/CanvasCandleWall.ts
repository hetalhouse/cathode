/**
 * CanvasCandleWall — the wall of mini candle charts as PURE functions: the grid layout, the cell hit-test and the painter. Lifted out of CathodeCandleGrid so the
 * DOM component and a stage panel (candleWallContent) draw the SAME wall from the same code. Every coordinate is LOGICAL px; the painter scales the canvas by `dpr`.
 */
import { drawCandle, CANDLE_THEME_COLORS } from './CanvasCandle'
import type { OHLCVCandle, PriceOverlay, CandleColors } from './CanvasCandle'

export interface WallCell {
  id:       string
  title:    string
  /** tiny badge after the title (e.g. 'EQ', '₿', '🅟') */
  badge?:   string
  /** right-aligned note (e.g. '+2.4%'), in `noteColor` */
  note?:    string
  noteColor?: string
  /** open-position state: accent frame + dot */
  open?:    boolean
  candles:  OHLCVCandle[]
  overlays?: PriceOverlay[]
}

export const WALL_HEADER_H = 22
export const WALL_PAD      = 6

export interface WallRect { x: number; y: number; w: number; h: number }
export interface WallLayout { rects: WallRect[]; rowH: number; totalH: number; cols: number }

/** the cells' rectangles for a wall `width` px wide, scrolled `scrollY` px */
export function layoutWall(o: { count: number; width: number; minCellW: number; cellAspect: number; scrollY: number }): WallLayout {
  const cols = Math.max(1, Math.floor(o.width / o.minCellW))
  const cellW = Math.floor(o.width / cols)
  const chartH = Math.round(cellW * o.cellAspect)
  const rowH = WALL_HEADER_H + chartH + WALL_PAD
  const rects = Array.from({ length: o.count }, (_, i) => ({
    x: (i % cols) * cellW,
    y: Math.floor(i / cols) * rowH - o.scrollY,
    w: cellW,
    h: rowH,
  }))
  return { rects, rowH, totalH: Math.ceil(o.count / cols) * rowH, cols }
}

/** the index of the cell under (cx, cy), or -1 */
export function wallCellAt(rects: WallRect[], cx: number, cy: number): number {
  if (cx < 0) return -1
  return rects.findIndex((r) => cx >= r.x && cx < r.x + r.w && cy >= r.y && cy < r.y + r.h)
}

/** how far the wall can scroll in a `viewH`-px-tall view */
export const wallMaxScroll = (totalH: number, viewH: number) => Math.max(0, totalH - viewH)

export interface DrawWallOpts {
  cells:          WallCell[]
  theme:          string
  glow:           boolean
  showVolume:     boolean
  volumeFraction: number
  slotW:          number
  colors?:        Partial<CandleColors>
  hoveredCell:    number
  scrollY:        number
  minCellW:       number
  cellAspect:     number
  /** backing-store pixels per logical px */
  dpr:            number
}

/** a per-cell offscreen cache (plain 2D canvases — not WebGL): a cell is redrawn only when its inputs change */
export type WallCellCache = Map<string, { canvas: HTMLCanvasElement; key: string }>

function cellCanvas(cache: WallCellCache, o: DrawWallOpts, cell: WallCell, w: number, h: number): HTMLCanvasElement {
  const last = cell.candles[cell.candles.length - 1]
  const key = `${w}x${h}@${o.dpr}|${cell.candles.length}|${last ? last.start + ':' + last.close : 0}|${o.theme}|${o.glow}|${o.showVolume}|${o.slotW}`
  const hit = cache.get(cell.id)
  if (hit && hit.key === key) return hit.canvas
  const canvas = hit?.canvas ?? document.createElement('canvas')
  // Physical backing store = logical × dpr; drawCandle(dpr) draws in logical coords at retina res.
  canvas.width = Math.round(w * o.dpr)
  canvas.height = Math.round(h * o.dpr)
  // Fit the whole series into the cell: shrink slotW until it fits, then right-align.
  const fitSlotW = Math.max(1.5, Math.min(o.slotW, w / Math.max(1, cell.candles.length)))
  // Narrow cells: keep overlay LINES but drop their label pills — at mini sizes the
  // pills stack over the price axis and each other (the predmkt-wall clutter).
  const overlays = w < 260 && cell.overlays
    ? cell.overlays.map((ov: any) => ({ ...ov, label: '' })) // '' suppresses the pill; undefined falls back to the price tag
    : cell.overlays
  drawCandle(canvas, {
    candles: cell.candles,
    slotW: fitSlotW,
    scrollX: Math.max(0, cell.candles.length * fitSlotW - w),
    theme: o.theme,
    glow: o.glow,
    showVolume: o.showVolume,
    volumeFraction: o.volumeFraction,
    hover: null,
    overlays,
    compact: true,
    colors: o.colors,
    dpr: o.dpr,
  })
  cache.set(cell.id, { canvas, key })
  return canvas
}

/** paint the whole wall into `canvas` (its backing store is logical × `o.dpr`) */
export function drawWall(canvas: HTMLCanvasElement, o: DrawWallOpts, cache: WallCellCache): void {
  if (!canvas.width) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = o.dpr
  const c = { ...(CANDLE_THEME_COLORS[o.theme] ?? CANDLE_THEME_COLORS['none']), ...(o.colors ?? {}) } as CandleColors
  ctx.setTransform(1, 0, 0, 1, 0, 0) // clear/fill in physical px…
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (c.bg && c.bg !== 'rgba(0,0,0,0)') { ctx.fillStyle = c.bg; ctx.fillRect(0, 0, canvas.width, canvas.height) }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // …then draw the wall in LOGICAL coords at physical resolution

  const { rects } = layoutWall({ count: o.cells.length, width: canvas.width / dpr, minCellW: o.minCellW, cellAspect: o.cellAspect, scrollY: o.scrollY })
  const HEADER_H = WALL_HEADER_H, PAD = WALL_PAD
  ctx.font = '600 11px ui-monospace, SFMono-Regular, monospace'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < o.cells.length; i++) {
    const cell = o.cells[i]
    const r = rects[i]
    if (r.y + r.h < 0 || r.y > canvas.height / dpr) continue // off-screen row (rects are logical)
    const inX = r.x + PAD / 2, inW = r.w - PAD
    // frame — accent when open, hover ring on top
    ctx.strokeStyle = cell.open ? c.candleBull : c.gridline
    ctx.lineWidth = i === o.hoveredCell ? 2 : 1
    ctx.strokeRect(inX + 0.5, r.y + 0.5, inW - 1, r.h - PAD - 1)
    // header — clipped to the cell; the title ellipsizes into the space the
    // badge + note leave (predmkt questions are sentences, not tickers).
    ctx.save()
    ctx.beginPath()
    ctx.rect(inX, r.y, inW, HEADER_H)
    ctx.clip()
    const ty = r.y + HEADER_H / 2 + 1
    const noteW = cell.note ? ctx.measureText(cell.note).width + (cell.open ? 22 : 12) : (cell.open ? 16 : 0)
    const badgeW = cell.badge ? ctx.measureText(cell.badge).width + 6 : 0
    const titleMax = inW - 14 - badgeW - noteW
    let title = cell.title
    if (ctx.measureText(title).width > titleMax) {
      while (title.length > 1 && ctx.measureText(title + '…').width > titleMax) title = title.slice(0, -1)
      title += '…'
    }
    let tx = inX + 7
    ctx.fillStyle = c.text
    ctx.textAlign = 'left'
    ctx.fillText(title, tx, ty)
    tx += ctx.measureText(title).width + 6
    if (cell.badge) {
      ctx.fillStyle = c.accent
      ctx.fillText(cell.badge, tx, ty)
    }
    if (cell.note) {
      ctx.textAlign = 'right'
      ctx.fillStyle = cell.noteColor || c.accent
      ctx.fillText(cell.note, inX + inW - (cell.open ? 16 : 7), ty)
      ctx.textAlign = 'left'
    }
    ctx.restore()
    if (cell.open) {
      ctx.fillStyle = c.candleBull
      ctx.beginPath()
      ctx.arc(inX + inW - 9, r.y + HEADER_H / 2 + 1, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    // chart (or a loading placeholder)
    const chartY = r.y + HEADER_H
    const chartH = r.h - HEADER_H - PAD
    if (cell.candles.length) {
      // cell offscreen is dpr-scaled (physical (inW-2)·dpr × …); draw it at LOGICAL dest size so it
      // lands 1:1 with the composite's dpr scale — crisp, no re-blur.
      ctx.drawImage(cellCanvas(cache, o, cell, inW - 2, chartH - 1), inX + 1, chartY, inW - 2, chartH - 1)
    } else {
      ctx.fillStyle = c.accent
      ctx.textAlign = 'center'
      ctx.fillText('· · ·', inX + inW / 2, chartY + chartH / 2)
      ctx.textAlign = 'left'
    }
  }
}
