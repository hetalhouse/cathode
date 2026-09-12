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
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import {
  drawCandle, CANDLE_THEME_COLORS,
  type OHLCVCandle, type PriceOverlay, type CandleColors,
} from './CanvasCandle'
import { screenToCanvas } from './CanvasGrid'
import {
  LENS_FRAG_UNIFORMS, LENS_FRAG_FN, LENS_FRAG_RING,
  createLensUniforms, writeLensUniforms, eventToLensUV,
  LENS_INACTIVE, type MouseLensUV, curvatureToStrength, fieldScale,
} from './lensShader'
import './cathode.css'

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

const HEADER_H = 22
const PAD      = 6

// ── Three.js (one context for the whole wall) ────────────────────────────────
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
  renderer!.setPixelRatio(1)
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
  const contentW = props.bendField ? Math.round(W * fieldScale(props.curvature)) : W
  const sizeChanged = offCanvas.width !== contentW || offCanvas.height !== H
  offCanvas.width = contentW
  offCanvas.height = H
  if (renderer) {
    if (sizeChanged && texture) {
      texture.dispose()
      texture = new THREE.CanvasTexture(offCanvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      material.uniforms.uTex.value = texture
    }
    renderer.setSize(W, H)
  } else if (canvasEl.value) {
    canvasEl.value.width = W
    canvasEl.value.height = H
    canvasEl.value.style.width = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }
  redraw()
}

// ── Layout ───────────────────────────────────────────────────────────────────
interface CellRect { x: number; y: number; w: number; h: number }
function layout(): { rects: CellRect[]; rowH: number; totalH: number; cols: number } {
  const W = offCanvas?.width || 0
  const cols = Math.max(1, Math.floor(W / props.minCellW))
  const cellW = Math.floor(W / cols)
  const chartH = Math.round(cellW * props.cellAspect)
  const rowH = HEADER_H + chartH + PAD
  const rects = props.cells.map((_, i) => ({
    x: (i % cols) * cellW,
    y: Math.floor(i / cols) * rowH - scrollY.value,
    w: cellW,
    h: rowH,
  }))
  return { rects, rowH, totalH: Math.ceil(props.cells.length / cols) * rowH, cols }
}
const maxScrollY = () => {
  const { totalH } = layout()
  return Math.max(0, totalH - (offCanvas?.height || 0))
}

// ── Per-cell 2D offscreens (plain canvases — NOT WebGL; the cap only counts contexts) ──
const cellCanvases = new Map<string, { canvas: HTMLCanvasElement; key: string }>()
function cellCanvas(cell: WallCell, w: number, h: number): HTMLCanvasElement {
  const last = cell.candles[cell.candles.length - 1]
  const key = `${w}x${h}|${cell.candles.length}|${last ? last.start + ':' + last.close : 0}|${props.theme}|${props.glow}|${props.showVolume}|${props.slotW}`
  const hit = cellCanvases.get(cell.id)
  if (hit && hit.key === key) return hit.canvas
  const canvas = hit?.canvas ?? document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  // Fit the whole series into the cell: shrink slotW until it fits, then right-align.
  const fitSlotW = Math.max(1.5, Math.min(props.slotW, w / Math.max(1, cell.candles.length)))
  // Narrow cells: keep overlay LINES but drop their label pills — at mini sizes the
  // pills stack over the price axis and each other (the predmkt-wall clutter).
  const overlays = w < 260 && cell.overlays
    ? cell.overlays.map((o: any) => (o.label ? { ...o, label: undefined } : o))
    : cell.overlays
  drawCandle(canvas, {
    candles: cell.candles,
    slotW: fitSlotW,
    scrollX: Math.max(0, cell.candles.length * fitSlotW - w),
    theme: props.theme,
    glow: props.glow,
    showVolume: props.showVolume,
    volumeFraction: props.volumeFraction,
    hover: null,
    overlays,
    compact: true,
    colors: props.colors,
  })
  cellCanvases.set(cell.id, { canvas, key })
  return canvas
}

// ── Composite + warp ─────────────────────────────────────────────────────────
const themeC = computed(() => ({ ...(CANDLE_THEME_COLORS[props.theme] ?? CANDLE_THEME_COLORS['none']), ...(props.colors ?? {}) }) as CandleColors)

function redraw() {
  if (!offCanvas?.width) return
  const ctx = offCanvas.getContext('2d')
  if (!ctx) return
  const c = themeC.value
  ctx.clearRect(0, 0, offCanvas.width, offCanvas.height)
  if (c.bg && c.bg !== 'rgba(0,0,0,0)') { ctx.fillStyle = c.bg; ctx.fillRect(0, 0, offCanvas.width, offCanvas.height) }

  const { rects } = layout()
  ctx.font = '600 11px ui-monospace, SFMono-Regular, monospace'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < props.cells.length; i++) {
    const cell = props.cells[i]
    const r = rects[i]
    if (r.y + r.h < 0 || r.y > offCanvas.height) continue // off-screen row
    const inX = r.x + PAD / 2, inW = r.w - PAD
    // frame — accent when open, hover ring on top
    ctx.strokeStyle = cell.open ? c.candleBull : c.gridline
    ctx.lineWidth = i === hoveredCell.value ? 2 : 1
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
      ctx.drawImage(cellCanvas(cell, inW - 2, chartH - 1), inX + 1, chartY)
    } else {
      ctx.fillStyle = c.accent
      ctx.textAlign = 'center'
      ctx.fillText('· · ·', inX + inW / 2, chartY + chartH / 2)
      ctx.textAlign = 'left'
    }
  }

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
    offCanvas?.width || rect.width, offCanvas?.height || rect.height,
  )
}
function cellAt(cx: number, cy: number): number {
  if (cx < 0) return -1
  const { rects } = layout()
  return rects.findIndex((r) => cx >= r.x && cx < r.x + r.w && cy >= r.y && cy < r.y + r.h)
}
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
  cellCanvases.clear()
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
