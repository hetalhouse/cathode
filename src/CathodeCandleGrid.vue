<script setup lang="ts">
/**
 * CathodeCandleGrid — a WALL of mini candle charts in ONE WebGL context.
 *
 * The context-economy answer to "curvature on the charts panel": a dashboard of
 * N CathodeCandle cards costs N WebGL contexts and hits Chrome's ~16-context cap
 * (the reason dashboards mount minis in `flat` mode). Here every cell renders
 * through the SAME 2D pipeline (`drawCandle`) into a small plain-2D offscreen,
 * the cells composite into one page canvas, and a single barrel shader warps the
 * whole wall — N charts, 1 context, and the grid bends as one sheet.
 *
 * Interaction contract (the 0.6 overlay-surface pattern, one level up):
 * clicks inverse-map through the same barrel math (screenToCanvas + texW/texH)
 * to a cell index → `cell-click`. Bend-field applies: bending the wall widens
 * the content canvas, so MORE CELLS slide into view (distortion pays for data).
 */
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import type { CandleColors } from './CanvasCandle'
import { layoutWall, wallCellAt, wallMaxScroll, drawWall } from './CanvasCandleWall'
import type { WallCell, WallCellCache } from './CanvasCandleWall'
import { screenToCanvas } from './CanvasGrid'
import {
  LENS_FRAG_UNIFORMS, LENS_FRAG_FN, LENS_FRAG_RING,
  createLensUniforms, writeLensUniforms, eventToLensUV,
  LENS_INACTIVE, type MouseLensUV, curvatureToStrength, fieldScale,
} from './lensShader'
import './cathode.css'

export type { WallCell }

const props = withDefaults(defineProps<{
  cells:          WallCell[]
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  /** −45–45 signed bend, same scale as every cathode component. */
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  magnify?:       boolean
  showVolume?:    boolean
  volumeFraction?: number
  slotW?:         number
  colors?:        Partial<CandleColors>
  /** Bend buys field-of-view: more cells slide in as the wall bends (default true). */
  bendField?:     boolean
  /** Minimum cell width (px) — column count = floor(contentW / minCellW). */
  minCellW?:      number
  /** Chart height as a fraction of cell width. */
  cellAspect?:    number
}>(), {
  theme:          'none',
  curvature:      0,
  scanlines:      true,
  glow:           true,
  magnify:        false,
  showVolume:     true,
  volumeFraction: 0.22,
  slotW:          3,
  bendField:      true,
  minCellW:       210,
  cellAspect:     0.6,
})

const emit = defineEmits<{ 'cell-click': [id: string] }>()

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const hoveredCell = ref(-1)
const scrollY  = ref(0)
const mouseLensUV: MouseLensUV = { ...LENS_INACTIVE }

// ── Three.js (one context for the whole wall) ────────────────────────────────
// Device-pixel ratio (capped at 2 — beyond that the memory cost outweighs the gain). Re-read on
// resize so dragging to a different-DPR monitor stays crisp. Drives the whole 2D→texture→WebGL chain.
let dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
let renderer: THREE.WebGLRenderer | null = null
let webglFailed = false
function releaseRenderer() {
  if (!renderer) return
  try { renderer.forceContextLoss() } catch { /* no context */ }
  try { renderer.dispose() } catch { /* torn down */ }
  renderer = null
}
let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let material: THREE.ShaderMaterial
let texture: THREE.CanvasTexture
let offCanvas: HTMLCanvasElement
const screenW = ref(0)
const screenH = ref(0)

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const FRAG = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${LENS_FRAG_UNIFORMS}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend + concave fit-to-content rescale — see CathodeGrid for the
    // full derivation (corners land exactly on texture corners; nothing crops).
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;
      float cp = 0.5 * (1.0 + cd) * cd;
      m /= (1.0 - 2.0 * cp);
    }
    return vec2(0.5) + m;
  }

  ${LENS_FRAG_FN}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${LENS_FRAG_RING}

    gl_FragColor = color;
  }
`

function initThree() {
  if (!canvasEl.value || !wrapEl.value) return
  offCanvas = document.createElement('canvas')
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: false, alpha: true, preserveDrawingBuffer: true })
  } catch { webglFailed = true }
  if (!webglFailed && !renderer!.getContext()) { renderer!.dispose(); renderer = null; webglFailed = true }
  if (webglFailed) { sizeToContainer(); return }
  renderer!.setPixelRatio(dpr)
  renderer!.setClearColor(0x000000, 0)
  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  texture = new THREE.CanvasTexture(offCanvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  material = new THREE.ShaderMaterial({
    uniforms: {
      uTex: { value: texture }, uStrength: { value: 0.0 },
      uScanlines: { value: 1.0 }, uVignette: { value: 1.0 },
      ...createLensUniforms(),
    },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true,
  })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))
  sizeToContainer()
}

function sizeToContainer() {
  if (!wrapEl.value) return
  if (!renderer && !webglFailed) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight
  if (!W || !H) return
  screenW.value = W
  screenH.value = H
  dpr = Math.min(window.devicePixelRatio || 1, 2) // re-read (monitor may have changed)
  const contentW = props.bendField ? Math.round(W * fieldScale(props.curvature)) : W
  // Backing store at physical resolution (× dpr); the composite/cells draw in logical coords scaled up.
  const bw = Math.round(contentW * dpr), bh = Math.round(H * dpr)
  const sizeChanged = offCanvas.width !== bw || offCanvas.height !== bh
  offCanvas.width = bw
  offCanvas.height = bh
  if (renderer) {
    if (sizeChanged && texture) {
      texture.dispose()
      texture = new THREE.CanvasTexture(offCanvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      material.uniforms.uTex.value = texture
    }
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H) // three multiplies by pixelRatio → backing buffer W·dpr × H·dpr
  } else if (canvasEl.value) {
    canvasEl.value.width = Math.round(W * dpr)
    canvasEl.value.height = Math.round(H * dpr)
    canvasEl.value.style.width = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }
  redraw()
}

// ── Layout (the pure maths is CanvasCandleWall; the component only feeds it the canvas size) ──
function layout() {
  return layoutWall({ count: props.cells.length, width: (offCanvas?.width || 0) / dpr, minCellW: props.minCellW, cellAspect: props.cellAspect, scrollY: scrollY.value })
}
const maxScrollY = () => wallMaxScroll(layout().totalH, (offCanvas?.height || 0) / dpr)

// Per-cell 2D offscreens (plain canvases — NOT WebGL; the cap only counts contexts)
const cellCache: WallCellCache = new Map()

// ── Composite + warp ─────────────────────────────────────────────────────────

function redraw() {
  if (!offCanvas?.width) return
  drawWall(offCanvas, {
    cells: props.cells, theme: props.theme, glow: props.glow, showVolume: props.showVolume, volumeFraction: props.volumeFraction, slotW: props.slotW,
    colors: props.colors, hoveredCell: hoveredCell.value, scrollY: scrollY.value, minCellW: props.minCellW, cellAspect: props.cellAspect, dpr,
  }, cellCache)

  if (webglFailed) {
    const ctx2d = canvasEl.value?.getContext('2d')
    if (ctx2d && canvasEl.value) ctx2d.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height, 0, 0, canvasEl.value.width, canvasEl.value.height)
    return
  }
  if (!renderer || !material || !texture) return
  material.uniforms.uStrength.value = curvatureToStrength(props.curvature)
  material.uniforms.uScanlines.value = props.scanlines && props.theme !== 'paper' ? 1.0 : 0.0
  material.uniforms.uVignette.value = props.theme === 'paper' ? 0.0 : 1.0
  writeLensUniforms(material, props.magnify, mouseLensUV, screenW.value || offCanvas.width, screenH.value || offCanvas.height)
  texture.needsUpdate = true
  renderer.render(scene, camera)
}

// ── Interaction ──────────────────────────────────────────────────────────────
function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  return screenToCanvas(
    e.clientX - rect.left, e.clientY - rect.top,
    rect.width, rect.height,
    curvatureToStrength(props.curvature),
    // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
    (offCanvas?.width || rect.width) / dpr, (offCanvas?.height || rect.height) / dpr,
  )
}
function cellAt(cx: number, cy: number): number { return wallCellAt(layout().rects, cx, cy) }
function onClick(e: MouseEvent) {
  const [cx, cy] = canvasCoords(e)
  const i = cellAt(cx, cy)
  if (i >= 0) emit('cell-click', props.cells[i].id)
}
function onMouseMove(e: MouseEvent) {
  if (props.magnify && canvasEl.value) {
    const uv = eventToLensUV(e, canvasEl.value)
    mouseLensUV.x = uv.x
    mouseLensUV.y = uv.y
  }
  const [cx, cy] = canvasCoords(e)
  const i = cellAt(cx, cy)
  if (i !== hoveredCell.value) { hoveredCell.value = i; redraw() }
  else if (props.magnify) redraw()
  if (canvasEl.value) canvasEl.value.style.cursor = i >= 0 ? 'pointer' : 'default'
}
function onMouseLeave() {
  hoveredCell.value = -1
  mouseLensUV.x = LENS_INACTIVE.x
  mouseLensUV.y = LENS_INACTIVE.y
  redraw()
}
function onWheel(e: WheelEvent) {
  const max = maxScrollY()
  if (max <= 0) return
  e.preventDefault()
  scrollY.value = Math.max(0, Math.min(max, scrollY.value + e.deltaY))
  redraw()
}

// ── Lifecycle ────────────────────────────────────────────────────────────────
let ro: ResizeObserver | null = null
onMounted(() => {
  initThree()
  ro = new ResizeObserver(() => sizeToContainer())
  if (wrapEl.value) ro.observe(wrapEl.value)
})
onUnmounted(() => {
  ro?.disconnect()
  releaseRenderer()
  cellCache.clear()
})
watch(() => [props.curvature, props.bendField], () => nextTick(sizeToContainer))
watch(() => [props.cells, props.theme, props.glow, props.scanlines, props.showVolume, props.magnify], () => {
  scrollY.value = Math.min(scrollY.value, maxScrollY())
  redraw()
}, { deep: false })
</script>

<template>
  <div ref="wrapEl" class="cathode-candle-grid-wrap">
    <canvas
      ref="canvasEl"
      @click="onClick"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @wheel="onWheel"
    />
  </div>
</template>

<style scoped>
.cathode-candle-grid-wrap { position: relative; width: 100%; height: 100%; overflow: hidden; }
.cathode-candle-grid-wrap canvas { display: block; width: 100%; height: 100%; }
</style>
