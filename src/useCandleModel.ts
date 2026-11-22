/**
 * useCandleModel — the headless half of CathodeCandle.
 *
 * Everything the chart KNOWS and DOES that isn't presentation: horizontal scroll (anchored to the newest
 * candle), wheel / key zoom anchored on the candle under the cursor, pan-to-scroll, the hover crosshair, the
 * keyboard (←/→ pan, ↑/↓ zoom, Home / End), and the paint call that draws it into a canvas. No DOM events,
 * no renderer, no Three.js.
 *
 * Input arrives in CANVAS space — LOGICAL px on the content canvas, the space the painter draws in — never
 * as DOM events. A presenter maps its pointer to that space and calls in:
 *
 *   • CathodeCandle.vue is the DOM presenter (a canvas + renderer);
 *   • a 3D stage maps a raycast hit's UV through CathodeSurface.contentPoint() (candleContent()).
 *
 * `host` carries the one side-effect the model can't do itself (repaint). Reactivity is Vue's
 * (`ref` / `computed`) inside an effectScope, so a model that lives outside a component can be torn down
 * with dispose().
 */
import { ref, computed, watch, effectScope } from 'vue'
import {
  drawCandle,
  type OHLCVCandle, type PriceOverlay, type TradeMarker, type CandleColors,
} from './CanvasCandle'

export interface CandleHost {
  redraw(): void
}

export interface CandleModelOptions {
  candles:         () => OHLCVCandle[]
  theme:           () => string
  /** px slot width per candle at zoom 1 */
  slotW:           () => number
  showVolume:      () => boolean
  volumeFraction:  () => number
  overlays?:       () => PriceOverlay[] | undefined
  markers?:        () => TradeMarker[] | undefined
  compact?:        () => boolean
  colors?:         () => Partial<CandleColors> | undefined
  host:            CandleHost
}

export interface CandlePaintOpts { dpr: number; glow: boolean }

const ZOOM_MIN = 0.25
const ZOOM_MAX = 6.0
/** the candle area's left padding (CanvasCandle.PADDING_LEFT) — the cursor→candle anchor math measures from it */
const PAD_L = 8

export function useCandleModel(o: CandleModelOptions) {
  const scope = effectScope()
  return scope.run(() => {
    // ── Canvas dimensions (set by setViewport) ──────────────────────────────
    const canvasW = ref(0)
    const canvasH = ref(0)

    // scrollX   — px offset, positive = scrolled back in time (older candles); anchored to the right edge
    // zoomLevel — multiplier on slotW; the wheel / ↑↓ adjust it. 1.0 = base zoom
    // hover     — { x, y } in canvas coords, null when not over the chart; drives the crosshair
    const scrollX   = ref(0)
    const zoomLevel = ref(1)
    const hover     = ref<{ x: number; y: number } | null>(null)

    const effectiveSlotW = computed(() => Math.max(1, o.slotW() * zoomLevel.value))

    // anything that changes the picture repaints it
    watch(
      [o.theme, o.slotW, o.showVolume, o.volumeFraction, () => o.compact?.(), () => o.candles(), () => o.overlays?.(), () => o.markers?.()],
      () => o.host.redraw(),
      { deep: false },
    )
    watch(() => o.colors?.(), () => o.host.redraw(), { deep: true })
    watch(scrollX,        () => o.host.redraw())
    watch(zoomLevel,      () => o.host.redraw())
    watch(hover,          () => o.host.redraw())
    watch(effectiveSlotW, () => o.host.redraw())

    /** The content canvas is `w` x `h` logical px (call again on every resize). */
    function setViewport(w: number, h: number) { canvasW.value = w; canvasH.value = h }

    /**
     * Clamp scrollX to [0, maxScrollX], where the max keeps at least one candle visible at the right edge —
     * without it a fast pan runs scrollX past the available range and presents a blank chart.
     */
    function clampScroll(s: number): number {
      const sw = effectiveSlotW.value
      if (sw <= 0) return 0
      const total = o.candles()?.length ?? 0
      // right edge anchored: scrollX 0 = newest candle on the right; the max is when the OLDEST is on the left
      const visible = Math.max(1, Math.floor((canvasW.value || 1) / sw))
      const maxScrollSlots = Math.max(0, total - visible)
      return Math.max(0, Math.min(s, maxScrollSlots * sw))
    }

    // ── Wheel ───────────────────────────────────────────────────────────────
    /**
     * Trackpad: deltaX scrolls, deltaY zooms. Mouse wheel: shift+deltaY scrolls, plain deltaY zooms — anchored
     * on the candle under the cursor (`cx`, canvas x; < 0 = unknown) so the user's focus stays under it.
     */
    function wheel(deltaX: number, deltaY: number, shiftKey: boolean, cx: number) {
      if (deltaX !== 0 || (shiftKey && deltaY !== 0)) {
        const dx = deltaX !== 0 ? deltaX : deltaY
        scrollX.value = clampScroll(scrollX.value + dx)
        return
      }
      if (deltaY === 0) return
      const candles = o.candles()
      const sw = effectiveSlotW.value
      const factor = Math.exp(-deltaY * 0.0015)             // negative deltaY = wheel up = zoom in
      if (cx >= 0 && sw > 0 && candles?.length) {
        // candle index under the cursor before the zoom
        const visible     = Math.max(1, Math.floor((canvasW.value || 1) / sw))
        const firstIdx    = Math.max(0, candles.length - visible - Math.floor(scrollX.value / sw))
        const idxAtCursor = firstIdx + (cx - PAD_L) / sw
        const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value * factor))
        zoomLevel.value = newZoom
        const newSw      = o.slotW() * newZoom
        const newVisible = Math.max(1, Math.floor((canvasW.value || 1) / newSw))
        // solve for the scrollX that keeps the same candle under the cursor
        const desiredFirst  = idxAtCursor - (cx - PAD_L) / newSw
        const slotsScrolled = Math.max(0, candles.length - newVisible - desiredFirst)
        scrollX.value = clampScroll(slotsScrolled * newSw)
      } else {
        zoomLevel.value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value * factor))
      }
    }

    // ── Click-drag pan ──────────────────────────────────────────────────────
    let panActive = false, panStartX = 0, panStartScrollX = 0

    /** A press begins a pan (and hides the crosshair — it would lag the pan); `clientX` is any consistent x. */
    function panStart(clientX: number) {
      panActive = true
      panStartX = clientX
      panStartScrollX = scrollX.value
      hover.value = null
    }
    /**
     * The pointer moved while a pan is held. Direct manipulation: drag RIGHT exposes older candles on the left
     * (scrollX grows); drag LEFT pulls newer ones in (clamped at 0). Returns whether a pan is in progress.
     */
    function panMove(clientX: number): boolean {
      if (!panActive) return false
      scrollX.value = clampScroll(panStartScrollX + (clientX - panStartX))
      return true
    }
    function panEnd() { panActive = false }
    const panning = () => panActive

    // ── Crosshair ───────────────────────────────────────────────────────────
    /** The pointer is at (cx, cy) in canvas space (< 0 = off the chart). Ignored mid-pan. */
    function hoverAt(cx: number, cy: number) {
      if (panActive) return
      hover.value = cx < 0 || cy < 0 ? null : { x: cx, y: cy }
    }
    function leave() { hover.value = null }

    // ── Keyboard: ←/→ pan one step (Shift = a screenful), ↑/↓ zoom, Home / End ──
    function applyZoom(direction: 1 | -1) {
      zoomLevel.value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value * Math.exp(direction * 0.18)))
      scrollX.value = clampScroll(scrollX.value)
    }
    function keyDown(e: KeyboardEvent) {
      // a step of 3 slots (vs 1) makes each press visibly move the chart even zoomed in; shift jumps 20
      const sw = effectiveSlotW.value
      const step = e.shiftKey ? 20 : 3
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); scrollX.value = clampScroll(scrollX.value + sw * step); break
        case 'ArrowRight': e.preventDefault(); scrollX.value = clampScroll(scrollX.value - sw * step); break
        case 'ArrowUp':    e.preventDefault(); applyZoom(1); break
        case 'ArrowDown':  e.preventDefault(); applyZoom(-1); break
        case 'Home':       e.preventDefault(); scrollX.value = clampScroll(Number.MAX_SAFE_INTEGER); break
        case 'End':        e.preventDefault(); scrollX.value = 0; break
      }
    }

    // ── Paint ───────────────────────────────────────────────────────────────
    function paint(canvas: HTMLCanvasElement, { dpr, glow }: CandlePaintOpts) {
      drawCandle(canvas, {
        candles:        o.candles(),
        slotW:          effectiveSlotW.value,
        scrollX:        scrollX.value,
        theme:          o.theme(),
        glow,
        showVolume:     o.showVolume(),
        volumeFraction: o.volumeFraction(),
        hover:          hover.value,
        overlays:       o.overlays?.(),
        markers:        o.markers?.(),
        compact:        o.compact?.(),
        colors:         o.colors?.(),
        dpr,
      })
    }

    function dispose() { scope.stop() }

    return {
      canvasW, canvasH, scrollX, zoomLevel, hover, effectiveSlotW,
      setViewport, clampScroll, wheel, panStart, panMove, panEnd, panning,
      hoverAt, leave, keyDown, applyZoom, paint, dispose,
    }
  })!
}

export type CandleModel = ReturnType<typeof useCandleModel>
