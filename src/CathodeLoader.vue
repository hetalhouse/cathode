<script setup lang="ts">
/**
 * CathodeLoader — CRT-styled boot/loading placeholder.
 *
 * Drop-in replacement for the modern-flat-UI skeleton loaders that clash with
 * the rest of cathode's aesthetic. Renders centered phosphor text + blinking
 * block cursor + animated ellipsis through the same barrel + scanline shader
 * the data components use, so it tones with everything around it.
 *
 * Common consumers:
 *   - CathodeContainer's `!isReady` slot during initial mount
 *   - Dashboard panels during the 'resizing' state
 *   - Async data-fetch placeholders inside other panels
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import * as THREE from 'three'
import './cathode.css'

const props = withDefaults(defineProps<{
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:     'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 barrel strength, same scale as the other cathode components. */
  curvature?: number
  scanlines?: boolean
  glow?:      boolean
  /** Centered text. Defaults to "BOOTING". A trailing ellipsis is animated separately. */
  label?:     string
}>(), {
  theme:     'none',
  curvature: 25,
  scanlines: true,
  glow:      true,
  label:     'BOOTING',
})

// Theme colours — mirrors the palette in CanvasLog's LOG_THEME_COLORS but kept
// inline since the loader's surface is so small the indirection isn't worth it.
const THEMES: Record<string, { bg: string; text: string; cursor: string }> = {
  none:     { bg: 'rgba(0,0,0,0)', text: '#33ff77', cursor: '#33ff77' },
  phosphor: { bg: '#060d06',       text: '#33ff33', cursor: '#80ff80' },
  amber:    { bg: '#0a0700',       text: '#ffb000', cursor: '#ffd060' },
  paper:    { bg: 'rgba(0,0,0,0)', text: '#222222', cursor: '#158cba' },
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Three.js state ────────────────────────────────────────────────────────────
let renderer:    THREE.WebGLRenderer | null = null
let webglFailed = false
let scene:       THREE.Scene
let camera:      THREE.OrthographicCamera
let material:    THREE.ShaderMaterial
let texture:     THREE.CanvasTexture
let offCanvas:   HTMLCanvasElement

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Same barrel + scanlines + vignette shader as CathodeLog/Grid/Candle but
// without the magnify-lens uniforms — loader is transient, no need for
// hover interactions.
const FRAG = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  void main() {
    vec2 uv = barrel(vUv);
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
    gl_FragColor = color;
  }
`

// ── Animation tick — drives blinking cursor + ellipsis dots ──────────────────
// Uses Date.now() so the wall-clock determines phase; if the renderer skips a
// frame the visual stays in sync. Redraw frequency is throttled to ~10 Hz —
// the loader doesn't need 60fps to convey its message.
let rafId: number | null = null
let lastDraw = 0
const REDRAW_MS = 100

function tick(now: number) {
  if (now - lastDraw >= REDRAW_MS) {
    redraw()
    lastDraw = now
  }
  rafId = requestAnimationFrame(tick)
}

// ── Sizing + redraw ──────────────────────────────────────────────────────────
function sizeToContainer() {
  if (!wrapEl.value || !offCanvas) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight
  if (W <= 0 || H <= 0) return
  if (offCanvas.width === W && offCanvas.height === H) return
  offCanvas.width  = W
  offCanvas.height = H
  if (renderer) renderer.setSize(W, H, false)
  if (canvasEl.value) {
    canvasEl.value.width  = W
    canvasEl.value.height = H
    canvasEl.value.style.width  = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }
}

function drawLoader() {
  if (!offCanvas?.width) return
  const ctx = offCanvas.getContext('2d')
  if (!ctx) return

  const W = offCanvas.width
  const H = offCanvas.height
  const c = THEMES[props.theme] ?? THEMES.none

  // Background — transparent for `none`/`paper` (parent shows through),
  // solid CRT face for `phosphor`/`amber`.
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, W, H)

  // Animation phase derived from wall-clock so cursor + ellipsis stay
  // synchronised even if frames are skipped.
  const t       = Date.now()
  const cursorOn = ((t / 500) | 0) % 2 === 0       // 1Hz blink
  const dotsN    = ((t / 400) | 0) % 4              // 0..3 dots, 2.5Hz cycle

  ctx.font          = `bold ${Math.max(14, Math.min(W, H) * 0.06)}px monospace`
  ctx.textAlign     = 'center'
  ctx.textBaseline  = 'middle'
  ctx.fillStyle     = c.text

  if (props.glow) {
    ctx.shadowColor = c.text
    ctx.shadowBlur  = 14
  }

  const dots = '.'.repeat(dotsN).padEnd(3, ' ')
  const fullLabel = `${props.label}${dots}`
  ctx.fillText(fullLabel, W / 2, H / 2)
  ctx.shadowBlur = 0

  // Block cursor — drawn just to the right of the text. Sized to the cap
  // height so it reads as a terminal cursor rather than a token of text.
  if (cursorOn) {
    const m   = ctx.measureText(fullLabel)
    const cw  = ctx.measureText('M').width   // monospace — same width per char
    const ch  = parseFloat(ctx.font)
    const x   = W / 2 + m.width / 2 + 4
    const y   = H / 2 - ch / 2 + 2
    ctx.fillStyle = c.cursor
    if (props.glow) { ctx.shadowColor = c.cursor; ctx.shadowBlur = 12 }
    ctx.fillRect(x, y, cw * 0.7, ch * 0.95)
    ctx.shadowBlur = 0
  }
}

function redraw() {
  if (!offCanvas) return
  drawLoader()

  if (webglFailed) {
    if (!canvasEl.value) return
    const ctx2d = canvasEl.value.getContext('2d')
    if (ctx2d) ctx2d.drawImage(offCanvas, 0, 0)
    return
  }

  if (!renderer || !material || !texture) return
  const isPaper = props.theme === 'paper'
  material.uniforms.uStrength.value  = (props.curvature / 45) * 0.55
  material.uniforms.uScanlines.value = (props.scanlines && !isPaper) ? 1.0 : 0.0
  material.uniforms.uVignette.value  = isPaper ? 0.0 : 1.0
  texture.needsUpdate = true
  renderer.render(scene, camera)
}

// ── Init ──────────────────────────────────────────────────────────────────────
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
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
  })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

  sizeToContainer()
}

// ResizeObserver — re-size on parent dimension changes
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  initThree()
  redraw()
  rafId = requestAnimationFrame(tick)

  if (wrapEl.value) {
    resizeObserver = new ResizeObserver(() => sizeToContainer())
    resizeObserver.observe(wrapEl.value)
  }
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  if (renderer) renderer.dispose()
  texture?.dispose()
  material?.dispose()
})

// Theme / shader-prop changes redraw immediately rather than waiting for
// the next animation tick (~100ms feels laggy on toggle).
watch(() => [props.theme, props.curvature, props.scanlines, props.glow, props.label], () => redraw())

// ── Wrap style ────────────────────────────────────────────────────────────────
const wrapStyle = computed<CSSProperties>(() => ({
  background: (THEMES[props.theme] ?? THEMES.none).bg,
}))
</script>

<template>
  <div ref="wrapEl" class="cathode-loader-wrap" :style="wrapStyle">
    <canvas ref="canvasEl" class="cathode-loader-canvas" />
  </div>
</template>

<style scoped>
.cathode-loader-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cathode-loader-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
