<script setup lang="ts">
/**
 * CathodeGauge — a bipolar gauge through the CRT pipeline.
 *
 * A readout (big figure + stance + sub-line), a needle on a left↔right axis that EASES to each
 * new `value` (and sweeps in from centre on mount), then an optional caption, note and a
 * wrapping row of item chips — the shape of a long/short book's net-tilt read-out, one chip per
 * position, but nothing here knows about trading: poles, letters and copy are props.
 *
 * Same barrel + scanlines + vignette + magnify-lens shader as CathodeLog / Grid / Candle, the
 * same 2D fallback when WebGL is unavailable, backing store at devicePixelRatio (crisp text on
 * retina), context-loss recovery, ResizeObserver / IntersectionObserver sizing.
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick, inject } from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import { drawGauge, GAUGE_THEME_COLORS } from './CanvasGauge'
import type { GaugeItem, GaugeColors } from './CanvasGauge'
import {
  curvatureToStrength,
  LENS_FRAG_UNIFORMS, LENS_FRAG_FN, LENS_FRAG_RING,
  createLensUniforms, writeLensUniforms, eventToLensUV, LENS_INACTIVE,
} from './lensShader'
import type { MouseLensUV } from './lensShader'
import './cathode.css'

const props = withDefaults(defineProps<{
  /** 'none' = transparent, inherits the host (glass); built-ins: phosphor | amber | paper. */
  theme?:       'none' | 'phosphor' | 'amber' | 'paper'
  /** −45–45 bend (positive convex, negative concave), same scale as the other cathode surfaces. */
  curvature?:   number
  scanlines?:   boolean
  glow?:        boolean
  /** hover magnifier lens */
  magnify?:     boolean
  /** where the needle sits, on the [min, max] axis */
  value:        number
  min?:         number
  max?:         number
  /** the big figure; defaults to the signed `value` */
  readout?:     string
  /** headline beside the readout (e.g. "net short") */
  stance?:      string
  /** small line under the headline (e.g. "1 long · 2 short · 8 flat") */
  sub?:         string
  leftLabel?:   string
  rightLabel?:  string
  /** the letter a chip shows for each pole, e.g. ['S', 'L'] */
  sideLetters?: [string, string]
  /** boxed line under the axis (the posture) */
  caption?:     string
  /** dim paragraph under the caption */
  note?:        string
  /** one chip each, wrapping */
  items?:       GaugeItem[]
  /** shown in place of the chips when `items` is empty */
  emptyText?:   string
  /** per-instance palette overrides (e.g. the host's P&L up/down colours for the poles) */
  colors?:      Partial<GaugeColors>
  /** ease the needle to each new value (and sweep in from centre on mount) */
  animate?:     boolean
}>(), {
  theme:       'none',
  curvature:   10,
  scanlines:   true,
  glow:        true,
  magnify:     false,
  min:         -1,
  max:         1,
  leftLabel:   '−',
  rightLabel:  '+',
  sideLetters: () => ['−', '+'],
  items:       () => [],
  animate:     true,
})

// ── DOM refs ──────────────────────────────────────────────────────────────────
const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Needle animation — eases toward `value`; the drawn position is `shown` ───
const mid = () => (props.min + props.max) / 2
const shown = ref(props.animate ? mid() : props.value)
let animRaf = 0
function animateTo() {
  cancelAnimationFrame(animRaf)
  if (!props.animate) { shown.value = props.value; redraw(); return }
  const step = () => {
    const d = props.value - shown.value
    if (Math.abs(d) < 0.004) { shown.value = props.value; redraw(); return }
    shown.value += d * 0.18
    redraw()
    animRaf = requestAnimationFrame(step)
  }
  animRaf = requestAnimationFrame(step)
}
watch(() => props.value, animateTo)

// ── Three.js ──────────────────────────────────────────────────────────────────
let renderer:    THREE.WebGLRenderer | null = null
let webglFailed  = false

// Release the WebGL CONTEXT (not just GPU resources) on teardown — see CathodeLog.
function releaseRenderer() {
  if (!renderer) return
  try { renderer.forceContextLoss() } catch { /* no context / unsupported */ }
  try { renderer.dispose() } catch { /* already torn down */ }
  renderer = null
}
let scene:     THREE.Scene
let camera:    THREE.OrthographicCamera
let material:  THREE.ShaderMaterial
let texture:   THREE.CanvasTexture
let offCanvas: HTMLCanvasElement
let dpr = 1
let logicalW = 0, logicalH = 0
const mouseLensUV: MouseLensUV = { x: LENS_INACTIVE.x, y: LENS_INACTIVE.y }

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Same barrel + scanlines + vignette + lens as CathodeLog (see the barrel() comment there).
const FRAG = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${LENS_FRAG_UNIFORMS}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
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
    if (uScanlines > 0.5 && mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
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
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: false, alpha: true })
  } catch { webglFailed = true }
  if (!webglFailed && !renderer!.getContext()) {
    renderer!.dispose()
    renderer    = null
    webglFailed = true
  }
  if (webglFailed) { sizeToContainer(); return }

  renderer!.setPixelRatio(1)
  renderer!.setClearColor(0x000000, 0)
  scene  = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  texture = new THREE.CanvasTexture(offCanvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  material = new THREE.ShaderMaterial({
    uniforms: {
      uTex:       { value: texture },
      uStrength:  { value: 0.0 },
      uScanlines: { value: 1.0 },
      uVignette:  { value: 1.0 },
      ...createLensUniforms(),
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
  })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))
  sizeToContainer()
}

// Backing store at physical resolution (× dpr, capped at 2); the draw works in logical px.
// Early-return when nothing changed: setting canvas.width clears it even at the same value,
// and ResizeObserver fires spuriously (see CathodeLog).
function sizeToContainer() {
  if (!wrapEl.value || !offCanvas) return
  if (!renderer && !webglFailed) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight
  if (!W || !H) return
  const d  = Math.min(window.devicePixelRatio || 1, 2)
  const bw = Math.round(W * d), bh = Math.round(H * d)
  if (offCanvas.width === bw && offCanvas.height === bh && dpr === d) return
  dpr = d
  logicalW = W; logicalH = H
  offCanvas.width  = bw
  offCanvas.height = bh
  if (renderer) {
    if (texture) {
      texture.dispose()
      texture = new THREE.CanvasTexture(offCanvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      if (material) material.uniforms.uTex.value = texture
    }
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H)
  } else if (canvasEl.value) {
    canvasEl.value.width  = bw
    canvasEl.value.height = bh
    canvasEl.value.style.width  = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }
  redraw()
}

function draw(glow: boolean) {
  drawGauge(offCanvas, {
    dpr, theme: props.theme, colors: props.colors, glow,
    shown: shown.value, value: props.value, min: props.min, max: props.max,
    readout: props.readout, stance: props.stance, sub: props.sub,
    leftLabel: props.leftLabel, rightLabel: props.rightLabel, sideLetters: props.sideLetters,
    caption: props.caption, note: props.note, items: props.items, emptyText: props.emptyText,
  })
}

function redraw() {
  if (!offCanvas?.width) return
  if (webglFailed) {
    if (!canvasEl.value) return
    draw(false)
    const ctx2d = canvasEl.value.getContext('2d')
    if (ctx2d) { ctx2d.setTransform(1, 0, 0, 1, 0, 0); ctx2d.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height); ctx2d.drawImage(offCanvas, 0, 0) }
    return
  }
  if (!renderer || !material || !texture) return
  const isPaper = props.theme === 'paper'
  material.uniforms.uStrength.value  = curvatureToStrength(props.curvature)
  material.uniforms.uScanlines.value = (props.scanlines && !isPaper) ? 1.0 : 0.0
  material.uniforms.uVignette.value  = isPaper ? 0.0 : 1.0
  // lens radius is a fixed physical size → logical canvas size, not the ×dpr backing store
  writeLensUniforms(material, props.magnify, mouseLensUV, logicalW || offCanvas.width, logicalH || offCanvas.height)
  draw(props.glow)
  texture.needsUpdate = true
  renderer.render(scene, camera)
}

// Any prop that changes the picture redraws immediately (the needle animates separately).
watch(
  () => [props.theme, props.curvature, props.scanlines, props.glow, props.readout, props.stance, props.sub,
         props.leftLabel, props.rightLabel, props.sideLetters, props.caption, props.note, props.items,
         props.emptyText, props.colors, props.min, props.max],
  () => redraw(),
  { deep: true },
)
watch(() => props.magnify, (on) => {
  if (!on) { mouseLensUV.x = LENS_INACTIVE.x; mouseLensUV.y = LENS_INACTIVE.y }
  redraw()
})

// ── Mouse — the lens follows the cursor ──────────────────────────────────────
function onCanvasMouseMove(e: MouseEvent) {
  if (!props.magnify || !canvasEl.value) return
  const uv = eventToLensUV(e, canvasEl.value)
  mouseLensUV.x = uv.x
  mouseLensUV.y = uv.y
  redraw()
}
function onCanvasMouseLeave() {
  mouseLensUV.x = LENS_INACTIVE.x
  mouseLensUV.y = LENS_INACTIVE.y
  redraw()
}

// ── Observers / context loss ─────────────────────────────────────────────────
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
    animateTo() // the mount sweep: centre → value
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animRaf)
  cancelAnimationFrame(resizeRaf)
  canvasEl.value?.removeEventListener('webglcontextlost',     onContextLost)
  canvasEl.value?.removeEventListener('webglcontextrestored', onContextRestored)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  window.removeEventListener('resize', scheduleResize)
  window.visualViewport?.removeEventListener('resize', scheduleResize)
  releaseRenderer()
  texture?.dispose()
  material?.dispose()
})

// ── Wrap style ────────────────────────────────────────────────────────────────
const wrapStyle = computed<CSSProperties>(() => ({
  background: (GAUGE_THEME_COLORS[props.theme] ?? GAUGE_THEME_COLORS.none).bg,
}))
</script>

<template>
  <div ref="wrapEl" class="cathode-gauge-wrap" :style="wrapStyle">
    <canvas
      ref="canvasEl"
      class="cathode-gauge-canvas"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
    />
  </div>
</template>

<style scoped>
.cathode-gauge-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cathode-gauge-canvas {
  /* Renderer.setSize() owns inline width/height. */
  display: block;
  outline: none;
}
</style>
