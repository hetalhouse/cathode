<script setup lang="ts">
import {
  ref, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import { LOG_THEME_COLORS, LINE_HEIGHT, PADDING_Y, type LogEntry } from './CanvasLog'
import { CathodeSurface } from './CathodeSurface'
import { useLogModel } from './useLogModel'
import {
  eventToLensUV, LENS_INACTIVE, type MouseLensUV,
} from './lensShader'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  entries:        LogEntry[]
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 barrel-distortion strength. */
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  /** Show/hide the timestamp column (left of the text). Defaults to true. */
  showTimestamps?: boolean
  /** Per-entry timestamp formatter. Defaults to HH:mm:ss for ms epoch. */
  formatTs?:      (ts: number | string) => string
  /** Wrap long lines to fit the canvas width (default true). */
  wordWrap?:      boolean
  /** Stick to bottom on new entries unless the user has scrolled up (default true). */
  autoscroll?:    boolean
  /** Ring-buffer cap on rendered entries — older entries scroll off. 0 = no cap. */
  maxLines?:      number
  /**
   * Lens-on-hover mode. When true, mousing over the log magnifies a
   * circular region under the cursor at ~1.6× with a flat field and a
   * subtle glass curl at the rim.
   */
  magnify?:       boolean
}>(), {
  theme:          'none',
  curvature:      25,
  scanlines:      true,
  glow:           true,
  showTimestamps: true,
  wordWrap:       true,
  autoscroll:     true,
  maxLines:       0,
  magnify:        false,
})

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Lens state (mouse position in shader UV; (-999,-999) = inactive) ─────────

const mouseLensUV: MouseLensUV = { ...LENS_INACTIVE }

// ── The model ─────────────────────────────────────────────────────────────────
// Entries → wrapped lines, scroll + follow-the-tail, hover, selection, keyboard, copy and the paint
// all live in useLogModel.ts. This component is the DOM presenter: it owns the canvas, the renderer
// and the DOM events, and maps each event into the canvas space the model works in.

const model = useLogModel({
  entries:        () => props.entries,
  theme:          () => props.theme,
  showTimestamps: () => props.showTimestamps,
  formatTs:       () => props.formatTs,
  wordWrap:       () => props.wordWrap,
  maxLines:       () => props.maxLines,
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

  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: false, alpha: true })
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

  // Critical: setting a canvas width clears it even when the value is unchanged.
  // ResizeObserver / IntersectionObserver can fire spuriously (e.g. on Vue prop
  // updates that re-render unrelated DOM in the ancestor flex layout), so we MUST
  // early-return when nothing changed — otherwise the visible canvas blanks until
  // the next redraw lands. (surface.resize() reports false when nothing changed.)
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
    if (ctx2d) ctx2d.drawImage(surface.canvas, 0, 0, surface.canvas.width, surface.canvas.height, 0, 0, canvasEl.value.width, canvasEl.value.height)
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

// ── Prop redraws ──────────────────────────────────────────────────────────────

watch(() => props.theme,     () => redraw())
// Curvature only changes the barrel-shader uStrength uniform — no layout
// or texture impact. (The blanking-on-slider bug was traced to spurious
// ResizeObserver fires during slider drag, fixed by the no-change guard in
// sizeToContainer above.)
watch(() => props.curvature, () => redraw())
watch(() => props.scanlines, () => redraw())
watch(() => props.glow,      () => redraw())
watch(() => props.magnify,   (on) => {
  if (!on) { mouseLensUV.x = LENS_INACTIVE.x; mouseLensUV.y = LENS_INACTIVE.y }
  redraw()
})

// ── Mouse / wheel interaction ─────────────────────────────────────────────────
// (the log does not undo the screen's bend when it maps a pointer: it never has)

function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  return [e.clientX - rect.left, e.clientY - rect.top]
}

function onCanvasWheel(e: WheelEvent) { model.wheel(e.deltaX, e.deltaY, e.shiftKey) }

function onCanvasMouseDown(e: MouseEvent) {
  model.panStart(e.clientX, e.clientY)
  // Grab keyboard focus so arrow keys / page keys / Cmd+C work on the canvas.
  if (wrapEl.value) wrapEl.value.focus()
}

function onGlobalMouseMove(e: MouseEvent) { model.panMove(e.clientX, e.clientY) }
function onGlobalMouseUp() { model.panEnd() }

// ── Touch handlers ─────────────────────────────────────────────────────────
// Mobile browsers don't fire wheel events. Without these, swipe-to-scroll
// inside the log canvas does nothing. We mirror the mouse-drag pan model.
function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  const t = e.touches[0]
  model.panStart(t.clientX, t.clientY)
  if (wrapEl.value) wrapEl.value.focus()
}

function onTouchMove(e: TouchEvent) {
  if (!model.panning() || e.touches.length !== 1) return
  // preventDefault stops the browser from page-scrolling under the finger
  // while we're driving canvas-internal scroll.
  e.preventDefault()
  const t = e.touches[0]
  model.panMove(t.clientX, t.clientY)
}

function onTouchEnd() { model.panEnd() }

function onCanvasClick(e: MouseEvent) {
  const [, cy] = canvasCoords(e)
  model.click(cy, e.shiftKey)
}

function onKeyDown(e: KeyboardEvent) { model.keyDown(e) }

function onCanvasMouseMove(e: MouseEvent) {
  if (props.magnify && canvasEl.value) {
    const uv = eventToLensUV(e, canvasEl.value)
    mouseLensUV.x = uv.x
    mouseLensUV.y = uv.y
    redraw()
  }
  const [, cy] = canvasCoords(e)
  model.hover(cy)
}

function onCanvasMouseLeave() {
  model.leave()
  mouseLensUV.x = LENS_INACTIVE.x
  mouseLensUV.y = LENS_INACTIVE.y
  redraw()
}

// ── Public API: jump to bottom ────────────────────────────────────────────────

defineExpose({
  /** Force-scroll to the latest entry. Resumes autoscroll. */
  scrollToBottom() { model.scrollToBottom() },
  /** Programmatic scroll to a given line index (visual lines, not entry idx). */
  scrollToLine(li: number) { model.scrollToLine(li) },
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

    // Start at bottom on mount (typical for log views)
    model.scrollY.value = model.maxScrollY.value
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

const themeC = computed(() => LOG_THEME_COLORS[props.theme] ?? LOG_THEME_COLORS['none'])

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))
</script>

<template>
  <div
    ref="wrapEl"
    class="cathode-log-wrap"
    :style="wrapStyle"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <canvas
      ref="canvasEl"
      class="cathode-log-canvas"
      @wheel.prevent="onCanvasWheel"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
      @mousedown="onCanvasMouseDown"
      @click="onCanvasClick"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    />
  </div>
</template>

<style scoped>
.cathode-log-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* tabindex=0 makes the wrap focusable so arrow keys route here; suppress
     the browser's default focus outline — the CRT bezel already signals
     "this surface is active." */
  outline: none;
}

.cathode-log-canvas {
  /* Renderer.setSize() owns inline width/height. Don't override here. */
  display: block;
  outline: none;
  /* Tell mobile browsers not to handle touches on this canvas — the JS
     touch handlers drive scroll. Without this the browser will try to
     page-scroll a swipe gesture, fighting with our scrollY/scrollX refs. */
  touch-action: none;
  flex-shrink: 0;
}
</style>
