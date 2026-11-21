<script setup lang="ts">
import {
  ref, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import type { ColDef, GridApi } from './types'
import { THEME_COLORS, screenToCanvas } from './CanvasGrid'
import { CathodeSurface } from './CathodeSurface'
import { useGridModel } from './useGridModel'
import type { GridEmit, GridPointer } from './useGridModel'
import { eventToLensUV, curvatureToStrength, fieldScale } from './lensShader'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  columnDefs:           ColDef[]
  rowData?:             any[]
  rowHeight?:           number
  defaultColDef?:       Partial<ColDef>
  getRowStyle?:         (p: { data: any, node: any }) => CSSProperties | undefined
  pinnedBottomRowData?: any[]

  pagination?:         boolean
  paginationPageSize?: number   // maximum rows/page; actual count auto-fitted to height

  /** 'none' inherits parent CSS vars; 'phosphor' | 'amber' | 'paper' are built-in */
  theme?:     'none' | 'phosphor' | 'amber' | 'paper'
  /**
   * −45–45  screen-bend strength. Positive = CONVEX (classic CRT bulge —
   * barrel distortion; edge columns compress so more fits). Negative =
   * CONCAVE (dish/pincushion — the screen bows away from the viewer; edge
   * content stretches outward). 0 = flat. Hit-testing tracks the bend in
   * both directions.
   */
  curvature?: number
  scanlines?: boolean
  glow?:      boolean
  /**
   * Lens-on-hover mode. When true, mousing over the grid magnifies a circular
   * region under the cursor at ~2.5× with smoothstep falloff to 1× at the edge.
   * Hit-testing uses raw pixel coordinates (not the magnified visual position),
   * which matches the existing grid's behaviour under barrel curvature.
   */
  magnify?:   boolean
  /**
   * The bend buys field-of-view (default true): the offscreen content canvas
   * widens by exactly the factor the warp can absorb without cropping, so
   * bending the panel SLIDES MORE COLUMNS IN instead of just distorting the
   * same ones (+54% width at −45 concave, +16% at +45 convex). false = the
   * pre-0.7 behavior (bend is purely visual).
   */
  bendField?: boolean
}>(), {
  rowData:            () => [],
  rowHeight:          28,
  theme:              'none',
  curvature:          25,
  scanlines:          true,
  glow:               true,
  magnify:            false,
  bendField:          true,
  pagination:         true,
  paginationPageSize: 200,   // effectively unlimited; auto-fit drives page size
})

// ── Emits ─────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  'grid-ready':       [{ api: GridApi }]
  'row-clicked':      [{ data: any, event: MouseEvent }]
  'cell-selected':    [{ data: any, row: number, col: number, colId: string }]
  'column-resized':   []
  'sort-changed':     []
  'filter-changed':   []
}>()

// ── The grid model ────────────────────────────────────────────────────────────
// All grid state and behaviour (columns, rows, sort/filter, scroll, selection, the filter popup,
// column resize, keyboard nav, the GridApi, the paint call) lives in the headless model — see
// useGridModel.ts. This component is the DOM presenter: it owns the canvas, the renderer, the
// surface, the observers and the ghost <input>, and maps DOM events into the model's canvas space.

const filterGhostEl = ref<HTMLInputElement | null>(null)

const model = useGridModel({
  columnDefs:          () => props.columnDefs,
  defaultColDef:       () => props.defaultColDef,
  rowData:             () => props.rowData,
  pinnedBottomRowData: () => props.pinnedBottomRowData,
  rowHeight:           () => props.rowHeight,
  theme:               () => props.theme,
  emit:                emit as unknown as GridEmit,
  host: {
    redraw:           () => redraw(),
    resize:           () => sizeToContainer(),
    focusCanvas:      () => canvasEl.value?.focus(),
    focusFilterInput: () => filterGhostEl.value?.focus(),
    blurFilterInput:  () => filterGhostEl.value?.blur(),
  },
})

// What the template reads.
const {
  scrollY, maxScrollY, filteredRows, displayCols, selectedCell,
  firstVisibleRow, lastVisibleRow, activeFilter, filterPopupValue,
  formatCell, pageUp, pageDown, clearFilter,
} = model

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// Injected by CathodeWorkspace — increments whenever reset() is called
const resetTick = inject<Ref<number>>('cathodeResetTick', ref(0))
watch(resetTick, () => scheduleResize())

// ── Three.js ───────────────────────────────────────────────────────────────────

// Device-pixel ratio (capped at 2). Re-read on resize. Drives the 2D→texture→WebGL chain so the
// grid's gridlines/borders/text are crisp on retina (the composite texture, not just the display).
let dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
let renderer:    THREE.WebGLRenderer | null = null
let webglFailed  = false   // true when GPU/sandbox prevents WebGL

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
    // No WebGL — fall back to direct 2D blit; still set up the surface canvas dimensions
    sizeToContainer()
    return
  }
  renderer!.setPixelRatio(1)
  renderer!.setClearColor(0x000000, 0)

  scene  = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  // flipY=true (default): canvas row 0 (top) → texture UV y=1 ✓
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), surface.material))

  sizeToContainer()
}

const PAGINATION_H = 28

function sizeToContainer() {
  if (!wrapEl.value) return
  if (!renderer && !webglFailed) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight - (props.pagination ? PAGINATION_H : 0)
  if (!W || !H) return
  // Bend-field gain: the content canvas is WIDER than the screen by the factor
  // the warp absorbs — extra columns slide in as the panel bends.
  const contentW = props.bendField ? Math.round(W * fieldScale(props.curvature)) : W

  // Backing store at physical resolution (× dpr); canvasW/canvasH stay LOGICAL (layout/scroll/hit-test).
  // surface.resize() re-reads the device pixel ratio (the monitor may have changed) and, when the
  // size changes, re-creates the CanvasTexture so three.js reallocates GPU storage — a stale
  // allocation makes it texSubImage2D past the old bounds (GL_INVALID_VALUE, garbled pixels).
  surface.resize(contentW, H)
  surface.setScreenSize(W, H)
  dpr = surface.dpr
  model.setViewport(contentW, H, W, H)

  if (renderer) {
    // Track DPR so zooming the browser page keeps the canvas crisp.
    renderer.setPixelRatio(dpr)
    // Update the WebGL pixel buffer AND the canvas CSS size together.
    renderer.setSize(W, H)
  } else if (canvasEl.value) {
    // WebGL fallback: size the canvas element directly (× dpr for crispness)
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

  // WebGL fallback: paint the surface canvas (no glow) and blit it to the visible canvas via 2D
  if (webglFailed) {
    if (!canvasEl.value) return
    surface.paintOnly(false)
    const off = surface.canvas
    const ctx2d = canvasEl.value.getContext('2d')
    // fallback has no warp — squeeze the (possibly wider) content uniformly
    if (ctx2d) ctx2d.drawImage(off, 0, 0, off.width, off.height, 0, 0, canvasEl.value.width, canvasEl.value.height)
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
  surface.syncUniforms()
  surface.paint(props.glow)
  renderer.render(scene, camera)
}

// ── Canvas coordinate mapping ─────────────────────────────────────────────────

function canvasXYAt(clientX: number, clientY: number): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  const sx   = clientX - rect.left
  const sy   = clientY - rect.top
  // Apply the same barrel transform the shader uses, in reverse, so
  // hit-testing lands on the canvas cell the user actually SEES under
  // their cursor. Without this, high curvature compresses edge columns
  // inward visually but hit-tests still expect raw pixel coordinates,
  // so resize handles and filter icons drift away from where they're drawn.
  const W        = rect.width
  const H        = rect.height
  const strength = curvatureToStrength(props.curvature)
  // texture dims in LOGICAL px (the surface canvas backing store is × dpr) so results match layout coords
  const [cx, cy] = screenToCanvas(sx, sy, W, H, strength, (surface.canvas.width / dpr) || W, (surface.canvas.height / dpr) || H)
  return cx < 0 ? [-1, -1] : [cx, cy]
}
function canvasCoords(e: MouseEvent): [number, number] {
  return canvasXYAt(e.clientX, e.clientY)
}

// Local hit scale: canvas px per screen px at the cursor (two-point probe through
// the same barrel mapping), relative to the flat density. The fixed canvas-px hit
// zones (6px resize handle, 24px filter icon) and the resize drag delta are scaled
// by it so their ON-SCREEN size/speed stay constant under distortion — at −45
// concave the fit rescale shrinks center targets ~35% otherwise. Clamped ≥1 so
// flat/convex behavior is byte-identical to before.
function hitScaleX(e: MouseEvent): number {
  if (!canvasEl.value) return 1
  const [a] = canvasXYAt(e.clientX - 4, e.clientY)
  const [b] = canvasXYAt(e.clientX + 4, e.clientY)
  if (a < 0 || b < 0) return 1
  return Math.max(1, Math.abs(b - a) / 8)
}

// ── Pointer / keyboard → model ────────────────────────────────────────────────
// Each handler maps the DOM event into canvas space (through the screen's barrel bend, see
// canvasXYAt) and hands the model a GridPointer; the model owns what it MEANS.

function pointerAt(e: MouseEvent): GridPointer {
  const [cx, cy] = canvasCoords(e)
  return { cx, cy, hitScale: hitScaleX(e) }
}

function onCanvasWheel(e: WheelEvent) { model.wheel(e.deltaX, e.deltaY, e.shiftKey) }

function onCanvasMouseMove(e: MouseEvent) {
  if (model.resizing) return

  // Lens tracking — update mouse UV when lens is enabled.
  if (props.magnify && canvasEl.value) {
    surface.setLens(eventToLensUV(e, canvasEl.value))
  }

  const cursor = model.hover(pointerAt(e))
  if (cursor && canvasEl.value) canvasEl.value.style.cursor = cursor
}

function onCanvasMouseLeave() {
  surface.setLens(null)
  model.leave()
}

function onCanvasMouseDown(e: MouseEvent) { model.pointerDown(pointerAt(e), e.clientX, e.clientY) }

function onCanvasClick(e: MouseEvent) {
  if (model.click(pointerAt(e), e).stopPropagation) e.stopPropagation()
}

function onDocClick(e: MouseEvent) {
  if (!activeFilter.value) return
  model.docClick(e.target === canvasEl.value ? pointerAt(e) : null)
}

function onGlobalMouseMove(e: MouseEvent) { model.globalMove(e.clientX, e.clientY) }
function onGlobalMouseUp() { model.globalUp() }

// Touch — mobile browsers don't fire wheel/mousemove on swipe; without these the grid is stuck
// at scrollY=0 on phones and tablets. Mirrors the mouse-drag pan model.
function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  model.panStart(e.touches[0].clientX, e.touches[0].clientY)
}
function onTouchMove(e: TouchEvent) {
  if (!model.panning || e.touches.length !== 1) return
  e.preventDefault()
  model.panMove(e.touches[0].clientX, e.touches[0].clientY)
}
function onTouchEnd() { model.panEnd() }

function onKeyDown(e: KeyboardEvent) { model.keyDown(e) }

function onFilterInput(e: Event) { model.setFilterText((e.target as HTMLInputElement).value) }

// ── Watchers → redraw ─────────────────────────────────────────────────────────
// (Data / selection watchers live in the model.) Separate watchers per concern — a single
// combined array watcher can miss changes to primitive prop getters.

// Visual prop changes — each gets its own watcher so Vue definitely fires
watch(() => props.theme,     () => redraw())
// Curvature changes the container padding (via --curvature CSS var), which shrinks
// the canvas area. sizeToContainer must run after Vue patches the DOM so clientWidth
// reflects the new padding before we redraw.
watch(() => [props.curvature, props.bendField], () => nextTick(sizeToContainer))
watch(() => props.scanlines, () => redraw())
watch(() => props.glow,      () => redraw())
watch(() => props.magnify,   (on) => {
  if (!on) surface.setLens(null)
  redraw()
})


// ── ResizeObserver + IntersectionObserver + window/zoom listeners ─────────────

let resizeObserver:       ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeRaf = 0   // requestAnimationFrame handle for resize batching

function scheduleResize() {
  cancelAnimationFrame(resizeRaf)
  resizeRaf = requestAnimationFrame(sizeToContainer)
}

// ── WebGL context loss recovery ───────────────────────────────────────────────

function onContextLost(e: Event) {
  e.preventDefault()   // required to allow context restoration
}

function onContextRestored() {
  // Dispose the dead renderer and rebuild from scratch on the same canvas
  renderer?.dispose()
  renderer   = null
  webglFailed = false
  initThree()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  model.init()

  document.addEventListener('click',     onDocClick)
  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup',   onGlobalMouseUp)

  nextTick(() => {
    initThree()
    if (canvasEl.value) {
      canvasEl.value.addEventListener('webglcontextlost',     onContextLost)
      canvasEl.value.addEventListener('webglcontextrestored', onContextRestored)
    }
    if (wrapEl.value) {
      // Call sizeToContainer synchronously — rAF batching adds a full frame of lag
      // during drag resize, causing the old bitmap to visibly stretch before correction.
      resizeObserver = new ResizeObserver(() => sizeToContainer())
      resizeObserver.observe(wrapEl.value)

      // IntersectionObserver fires when the element becomes visible after an
      // ancestor v-show / display:none toggle — ResizeObserver alone misses this.
      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) scheduleResize()
      })
      intersectionObserver.observe(wrapEl.value)
    }
    // Window resize (e.g. dragging the browser window edge)
    window.addEventListener('resize', scheduleResize)
    // visualViewport fires on both window resize and browser zoom (ctrl+/-)
    window.visualViewport?.addEventListener('resize', scheduleResize)
    emit('grid-ready', { api: model.api })
  })
})

onUnmounted(() => {
  document.removeEventListener('click',     onDocClick)
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
  surface.dispose()
  model.dispose()
})

// ── Computed styles ───────────────────────────────────────────────────────────

const themeC = computed(() => THEME_COLORS[props.theme] ?? THEME_COLORS['none'])

const paginStyle = computed<CSSProperties>(() => ({
  background: themeC.value.headerBg,
  borderTop:  `1px solid ${themeC.value.border}`,
  color:      themeC.value.text,
}))

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))

const accentColor = computed(() => themeC.value.accent)
</script>

<template>
  <div ref="wrapEl" class="cathode-wrap" :style="wrapStyle">

    <!-- WebGL canvas — receives focus for keyboard nav -->
    <canvas
      ref="canvasEl"
      class="cathode-canvas"
      tabindex="0"
      @wheel.prevent="onCanvasWheel"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
      @mousedown="onCanvasMouseDown"
      @click="onCanvasClick"
      @keydown="onKeyDown"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    />

    <!-- Filter popup DOM overlay — fully theme-coloured -->
    <!-- Ghost input (0.6): the popup is DRAWN into the canvas (it warps with the
         panel); this invisible real input carries focus, IME and keystrokes. -->
    <input
      v-if="activeFilter"
      ref="filterGhostEl"
      class="cathode-filter-ghost"
      aria-label="Filter column"
      :value="filterPopupValue"
      autofocus
      @input="onFilterInput"
      @keydown.escape="clearFilter"
      @keydown.enter="model.closeFilter()"
    />

    <!-- Scroll info bar -->
    <div v-if="pagination" class="cathode-pagination" :style="paginStyle">
      <button :disabled="scrollY <= 0"       @click="pageUp()">◀</button>

      <span>
        {{ (firstVisibleRow + 1).toLocaleString() }}–{{ Math.min(filteredRows.length, lastVisibleRow + 1).toLocaleString() }}
        / {{ filteredRows.length.toLocaleString() }}
      </span>

      <button :disabled="scrollY >= maxScrollY" @click="pageDown()">▶</button>

      <span class="cathode-page-info" :style="{ color: accentColor }">
        {{ filteredRows.length.toLocaleString() }} rows
      </span>

      <!-- Selection readout — absolute row index into filteredRows -->
      <span v-if="selectedCell" class="cathode-sel-readout" :style="{ color: accentColor }">
        {{ displayCols[selectedCell.col]?.colDef.headerName ?? displayCols[selectedCell.col]?.colId }}
        :
        {{ formatCell(displayCols[selectedCell.col], filteredRows[selectedCell.row]) }}
      </span>
    </div>

  </div>
</template>

<style scoped>
.cathode-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.cathode-canvas {
  /* Do NOT set width/height here — renderer.setSize() owns the canvas dimensions
     via inline styles. CSS-based sizing causes the old pixel buffer to stretch
     visibly between the container resize and the ResizeObserver correction. */
  display: block;
  outline: none;
  flex-shrink: 0;
  /* Tell mobile browsers not to handle touches on this canvas — JS touch
     handlers drive pan/scroll. Without this, swipes get hijacked by page
     scroll and the grid stays stuck. */
  touch-action: none;
}

/* Filter popup — all colours applied inline from themeC computed */

/* Pagination */
.cathode-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 12px;
  font-size: 11px;
  font-family: system-ui, -apple-system, sans-serif;
  flex-shrink: 0;
}
.cathode-pagination button {
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: inherit;
  cursor: pointer;
  padding: 1px 8px;
  border-radius: 2px;
  font-family: inherit;
  font-size: 11px;
}
.cathode-pagination button:disabled { opacity: 0.3; cursor: default; }

/* Ghost filter input — a real focusable input with zero visual footprint; the
   popup pixels live in the canvas so they bend with the panel. */
.cathode-filter-ghost {
  position: absolute; left: 0; top: 0; width: 1px; height: 1px;
  opacity: 0; border: none; padding: 0; pointer-events: none;
}
.cathode-pagination button:not(:disabled):hover { border-color: #40a0f0; }

.cathode-page-info   { margin-left: auto; font-size: 10px; opacity: 0.75; }
.cathode-sel-readout {
  font-size: 10px;
  font-family: system-ui, -apple-system, sans-serif;
  opacity: 0.85;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1px 6px;
  border: 1px solid currentColor;
  border-radius: 2px;
  opacity: 0.7;
}
</style>
