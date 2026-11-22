<script setup lang="ts">
import {
  ref, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import {
  CANDLE_THEME_COLORS, DEFAULT_VOLUME_FRACTION,
  type OHLCVCandle, type PriceOverlay, type TradeMarker, type CandleColors,
} from './CanvasCandle'
import { CathodeSurface } from './CathodeSurface'
import { useCandleModel } from './useCandleModel'
import {
  eventToLensUV, LENS_INACTIVE, type MouseLensUV,
} from './lensShader'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  candles:        OHLCVCandle[]
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 barrel-distortion strength, same scale as CathodeGrid/Log. */
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  /** Show/hide the volume pane at the bottom. Defaults to true. */
  showVolume?:    boolean
  /** 0..1, fraction of pane reserved for volume bars (default 0.18). */
  volumeFraction?: number
  /** px slot width per candle (driver of "zoom"). Higher = wider candles. */
  slotW?:         number
  /** Indicator series drawn on the price pane (BB, EMA, SMA, etc.). */
  overlays?:      PriceOverlay[]
  /** Trade entry/exit annotations at (timestamp, price) points. */
  markers?:       TradeMarker[]
  /**
   * Force the 2D-canvas fallback path — skip Three.js + barrel shader
   * entirely. Use for mini-charts: dashboards rendering many cards at
   * once exceed Chrome's ~16 WebGL-context cap, evicting visible charts.
   * The barrel effect is also barely legible at small sizes.
   */
  flat?:          boolean
  /**
   * Thumbnail mode — drops the time axis + interval badge, narrows the
   * right-edge gutter, sparser & smaller price-axis labels. Use for
   * mini-charts (~120–180px tall) where the full chrome doesn't fit.
   */
  compact?:       boolean
  /**
   * Per-instance colour overrides merged onto the active theme. Lets the
   * consumer match its own brand palette (e.g. dashboard's #00bc8c) without
   * having to register a new theme upstream.
   */
  colors?:        Partial<CandleColors>
  /**
   * Lens-on-hover mode. When true, mousing over the chart magnifies a
   * circular region under the cursor at ~1.6× with a flat field and a
   * subtle glass curl at the rim. Independent of the mouse-wheel zoom
   * (which is chart-internal and rescales the candle slot width).
   */
  magnify?:       boolean
}>(), {
  theme:          'none',
  curvature:      25,
  scanlines:      true,
  glow:           true,
  showVolume:     true,
  volumeFraction: DEFAULT_VOLUME_FRACTION,
  slotW:          8,
  flat:           false,
  compact:        false,
  magnify:        false,
})

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Lens state (mouse position in shader UV; (-999,-999) = inactive) ─────────

const mouseLensUV: MouseLensUV = { ...LENS_INACTIVE }

// ── The model ─────────────────────────────────────────────────────────────────
// Scroll, zoom, the crosshair, the keyboard and the paint all live in useCandleModel.ts. This component
// is the DOM presenter: it owns the canvas, the renderer and the DOM events, and maps each event into the
// canvas space the model works in.

const model = useCandleModel({
  candles:        () => props.candles,
  theme:          () => props.theme,
  slotW:          () => props.slotW,
  showVolume:     () => props.showVolume,
  volumeFraction: () => props.volumeFraction,
  overlays:       () => props.overlays,
  markers:        () => props.markers,
  compact:        () => props.compact,
  colors:         () => props.colors,
  host:           { redraw: () => redraw() },
})

// ── Three.js ──────────────────────────────────────────────────────────────────

let renderer:    THREE.WebGLRenderer | null = null
let webglFailed  = false

// Release the WebGL CONTEXT (not just GPU resources) on teardown. THREE's
// dispose() frees programs/textures but leaves the context slot allocated until
// GC — so rapid mount/unmount (source/tab switches, many panels) leaks contexts
// past the browser's ~16-context cap, evicting a LIVE canvas and blanking it.
// forceContextLoss() frees the slot immediately.
function releaseRenderer() {
  if (!renderer) return
  try { renderer.forceContextLoss() } catch { /* no context / unsupported */ }
  try { renderer.dispose() } catch { /* already torn down */ }
  renderer = null
}
let scene:       THREE.Scene
let camera:      THREE.OrthographicCamera
let dpr = 1

// The CathodeSurface owns the offscreen canvas, its CanvasTexture and the barrel / scanlines /
// vignette / lens shader; this component supplies the renderer + orthographic camera that present
const surface = new CathodeSurface({
  paint: (canvas, { dpr: d, glow }) => model.paint(canvas, { dpr: d, glow }),
})

function initThree() {
  if (!canvasEl.value || !wrapEl.value) return

  // `flat` opts out of WebGL entirely — same render path as the WebGL
  // fallback, intentionally chosen to avoid context-cap eviction when
  // many small charts mount at once.
  if (props.flat) {
    webglFailed = true
    sizeToContainer()
    return
  }

  try {
    // preserveDrawingBuffer keeps the frame readable after compositing so hosts can
    // export the chart via canvas.toDataURL() (0.3.1 — without it the read is blank).
    // Candle canvases are small; the copy cost is negligible.
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: false, alpha: true, preserveDrawingBuffer: true })
  } catch {
    webglFailed = true
  }
  if (!webglFailed && !renderer!.getContext()) {
    renderer!.dispose()
    renderer = null
    webglFailed = true
  }
  if (webglFailed) {
    sizeToContainer()
    return
  }
  renderer!.setPixelRatio(1)
  renderer!.setClearColor(0x000000, 0)

  scene  = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), surface.material))

  sizeToContainer()
}

function sizeToContainer() {
  if (!wrapEl.value) return
  if (!renderer && !webglFailed) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight
  if (!W || !H) return

  // Same defensive guard as CathodeLog: skip when nothing actually changed, since setting a canvas
  // size clears it — and ResizeObserver can fire spuriously during prop updates.
  if (!surface.resize(W, H)) return
  surface.setScreenSize(W, H)
  dpr = surface.dpr
  model.setViewport(W, H)

  if (renderer) {
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H)
  } else if (canvasEl.value) {
    canvasEl.value.width  = Math.round(W * dpr)
    canvasEl.value.height = Math.round(H * dpr)
    canvasEl.value.style.width  = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }

  redraw()
}

// ── Redraw ────────────────────────────────────────────────────────────────────

function redraw() {
  if (!surface.canvas.width) return

  if (webglFailed) {
    if (!canvasEl.value) return
    surface.paintOnly(false)
    const ctx2d = canvasEl.value.getContext('2d')
    if (ctx2d) {
      // Clear before composite — `none`/`paper` themes have a transparent
      // background, so drawImage would layer on top of the previous frame.
      // Without this, translucent overlays (BB band fillAlpha) accumulate
      // into solid colour after ~13 frames and axis/OHLCV labels smear.
      ctx2d.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height)
      ctx2d.drawImage(surface.canvas, 0, 0)
    }
    return
  }

  if (!renderer) return

  const isPaper = props.theme === 'paper'
  surface.setLook({
    curvature: props.curvature,
    scanlines: props.scanlines && !isPaper,
    vignette:  !isPaper,
    magnify:   props.magnify,
  })
  surface.setLens(props.magnify ? mouseLensUV : null)
  surface.syncUniforms()
  surface.paint(props.glow)
  renderer.render(scene, camera)
}

// ── Look-prop redraws (the data props are watched by the model) ───────────────

watch(() => props.curvature, () => redraw())
watch(() => props.scanlines, () => redraw())
watch(() => props.glow,      () => redraw())
watch(() => props.magnify,   (on) => {
  if (!on) { mouseLensUV.x = LENS_INACTIVE.x; mouseLensUV.y = LENS_INACTIVE.y }
  redraw()
})

// `flat` is a mount-time decision — once a canvas element has been used
// for WebGL the browser locks it (getContext('2d') returns null), so a
// pipeline swap requires remounting the component (via :key from the
// consumer). The watcher exists only to surface the constraint clearly.
watch(() => props.flat, () => {
  console.warn('[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.')
})

// ── ResizeObserver / IntersectionObserver / window listeners ──────────────────

let resizeObserver:       ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeRaf = 0

const resetTick = inject<Ref<number>>('cathodeResetTick', ref(0))
watch(resetTick, () => scheduleResize())

function scheduleResize() {
  cancelAnimationFrame(resizeRaf)
  resizeRaf = requestAnimationFrame(sizeToContainer)
}

function onContextLost(e: Event) { e.preventDefault() }
function onContextRestored() {
  renderer?.dispose()
  renderer    = null
  webglFailed = false
  initThree()
}

// ── Mouse / wheel interaction ─────────────────────────────────────────────────
// (the chart does not undo the screen's bend when it maps a pointer: it never has)

function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  return [e.clientX - rect.left, e.clientY - rect.top]
}

function onCanvasWheel(e: WheelEvent) {
  const [cx] = canvasCoords(e)
  model.wheel(e.deltaX, e.deltaY, e.shiftKey, cx)
}

function onCanvasMouseDown(e: MouseEvent) {
  if (e.button !== 0) return   // only left-click
  model.panStart(e.clientX)
  // Grab focus so arrow / shift-arrow keys route to the chart.
  if (wrapEl.value) wrapEl.value.focus()
}

function onKeyDown(e: KeyboardEvent) { model.keyDown(e) }

function onGlobalMouseMove(e: MouseEvent) { model.panMove(e.clientX) }
function onGlobalMouseUp() { model.panEnd() }

// ── Touch handlers ─────────────────────────────────────────────────────────
// Mobile browsers don't fire wheel events. Without these, swipe-pan inside
// the chart canvas does nothing on phones/tablets. Mirrors the mouse-drag
// pan model with the same sign convention (drag right → see older candles
// on the left → scrollX increases).
function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  model.panStart(e.touches[0].clientX)
}

function onTouchMove(e: TouchEvent) {
  if (!model.panning() || e.touches.length !== 1) return
  e.preventDefault()
  model.panMove(e.touches[0].clientX)
}

function onTouchEnd() { model.panEnd() }

function onCanvasMouseMove(e: MouseEvent) {
  if (props.magnify && canvasEl.value) {
    const uv = eventToLensUV(e, canvasEl.value)
    mouseLensUV.x = uv.x
    mouseLensUV.y = uv.y
    redraw()
  }
  const [cx, cy] = canvasCoords(e)
  model.hoverAt(cx, cy)
}

function onCanvasMouseLeave() {
  model.leave()
  mouseLensUV.x = LENS_INACTIVE.x
  mouseLensUV.y = LENS_INACTIVE.y
  redraw()
}

onMounted(() => {
  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup',   onGlobalMouseUp)
  nextTick(() => {
    initThree()
    if (canvasEl.value) {
      canvasEl.value.addEventListener('webglcontextlost',     onContextLost)
      canvasEl.value.addEventListener('webglcontextrestored', onContextRestored)
    }
    if (wrapEl.value) {
      resizeObserver = new ResizeObserver(() => sizeToContainer())
      resizeObserver.observe(wrapEl.value)

      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) scheduleResize()
      })
      intersectionObserver.observe(wrapEl.value)
    }
    window.addEventListener('resize', scheduleResize)
    window.visualViewport?.addEventListener('resize', scheduleResize)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onGlobalMouseMove)
  document.removeEventListener('mouseup',   onGlobalMouseUp)
  canvasEl.value?.removeEventListener('webglcontextlost',     onContextLost)
  canvasEl.value?.removeEventListener('webglcontextrestored', onContextRestored)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  window.removeEventListener('resize', scheduleResize)
  window.visualViewport?.removeEventListener('resize', scheduleResize)
  cancelAnimationFrame(resizeRaf)
  releaseRenderer()
  model.dispose()
  surface.dispose()
})

// ── Computed styles ───────────────────────────────────────────────────────────

const themeC = computed(() => CANDLE_THEME_COLORS[props.theme] ?? CANDLE_THEME_COLORS['none'])

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))
</script>

<template>
  <div
    ref="wrapEl"
    class="cathode-candle-wrap"
    :style="wrapStyle"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <canvas
      ref="canvasEl"
      class="cathode-candle-canvas"
      @wheel.prevent="onCanvasWheel"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    />
  </div>
</template>

<style scoped>
.cathode-candle-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* Focusable for keyboard nav (arrow keys); suppress the default outline
     since the CRT bezel signals the active surface. */
  outline: none;
}
.cathode-candle-canvas {
  /* Renderer.setSize() owns inline width/height. */
  display: block;
  outline: none;
  flex-shrink: 0;
  /* Tell mobile browsers not to handle touches on this canvas — JS touch
     handlers drive horizontal pan. Without this, the page scrolls under
     the finger instead of the chart panning. */
  touch-action: none;
}
</style>
