/**
 * CathodeSurface — the headless half of a cathode widget.
 *
 * A surface owns what every widget used to build for itself: the offscreen 2D canvas the painter
 * draws into, the CanvasTexture over it, and the barrel + scanlines + vignette + magnify-lens
 * ShaderMaterial. It owns NO renderer, camera, DOM or Vue — a *presenter* supplies those:
 *
 *   • mode 'screen' — the vertex shader fills clip space (a full-screen quad under an
 *     orthographic camera). This is how the DOM widgets (CathodeGauge …) present it.
 *   • mode 'world'  — the vertex shader uses the model/view/projection matrices, so the SAME
 *     material drops onto any mesh in any THREE.Scene (see createSurfaceMesh). The texture also
 *     gets mipmaps + anisotropy, since a plane seen at an angle shimmers under plain LinearFilter.
 *
 * The painter is a callback — `(canvas, { dpr, glow }) => void` — drawing in LOGICAL px on a
 * backing store scaled by dpr (the existing Canvas*.ts functions already have this shape).
 */
import * as THREE from 'three'
import {
  curvatureToStrength,
  LENS_FRAG_UNIFORMS, LENS_FRAG_FN, LENS_FRAG_RING,
  createLensUniforms, writeLensUniforms, LENS_INACTIVE, LENS_ZOOM, LENS_RADIUS_PX,
} from './lensShader'
import type { MouseLensUV } from './lensShader'

export type SurfaceMode = 'screen' | 'world'

export type SurfacePainter = (canvas: HTMLCanvasElement, ctx: { dpr: number; glow: boolean }) => void

export interface CathodeSurfaceOptions {
  paint:  SurfacePainter
  /** 'screen' (default) = clip-space quad for a private renderer; 'world' = scene-graph mesh. */
  mode?:  SurfaceMode
  /** backing-store dpr cap (default 2) */
  maxDpr?: number
}

export interface SurfaceLook {
  /** −45–45, same scale as every other cathode surface */
  curvature: number
  scanlines: boolean
  vignette:  boolean
  magnify:   boolean
}

const VERT_SCREEN = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const VERT_WORLD = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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

/**
 * CPU mirror of the fragment shader's barrel(): surface UV → content UV. `strength` is
 * curvatureToStrength(curvature). Pointer routing uses this so the cursor lands on the pixel
 * actually drawn under it (the shader warps the sample position; the CPU must warp the same way).
 */
export function barrelUV(u: number, v: number, strength: number): { x: number; y: number } {
  const cx = u - 0.5, cy = v - 0.5
  const as   = Math.abs(strength)
  const dist = (cx * cx + cy * cy) * as
  const k    = (1 + dist) * dist * Math.sign(strength)
  let mx = cx + cx * k, my = cy + cy * k
  if (strength < 0) {
    const cd = 0.5 * as
    const cp = 0.5 * (1 + cd) * cd
    mx /= 1 - 2 * cp
    my /= 1 - 2 * cp
  }
  return { x: 0.5 + mx, y: 0.5 + my }
}

/** CPU mirror of the shader's applyLens(). Returns the input UV when the lens is off. */
export function lensUV(
  u: number, v: number, mouse: MouseLensUV, magnify: boolean, canvasW: number, canvasH: number,
): { x: number; y: number } {
  if (!magnify || mouse.x === LENS_INACTIVE.x || canvasH <= 0) return { x: u, y: v }
  const aspect = canvasW / canvasH
  const r  = LENS_RADIUS_PX / canvasH
  const dx = (u - mouse.x) * aspect, dy = v - mouse.y
  const dist = Math.hypot(dx, dy)
  if (dist >= r) return { x: u, y: v }
  const t = dist / r
  const s = Math.min(Math.max((t - 0.88) / (1 - 0.88), 0), 1)
  const smooth = s * s * (3 - 2 * s)
  const zoom = LENS_ZOOM + (1 - LENS_ZOOM) * smooth
  return { x: mouse.x + (dx / zoom) / aspect, y: mouse.y + dy / zoom }
}

export class CathodeSurface {
  readonly canvas:   HTMLCanvasElement
  readonly material: THREE.ShaderMaterial
  readonly mode:     SurfaceMode

  /** logical (CSS px) size and backing-store dpr — set by resize() */
  dpr      = 1
  logicalW = 0
  logicalH = 0

  private texture: THREE.CanvasTexture
  private readonly painter: SurfacePainter
  private readonly maxDpr: number
  private look: SurfaceLook = { curvature: 0, scanlines: true, vignette: true, magnify: false }
  private mouse: MouseLensUV = { x: LENS_INACTIVE.x, y: LENS_INACTIVE.y }
  private anisotropy = 1

  constructor(opts: CathodeSurfaceOptions) {
    this.painter = opts.paint
    this.mode    = opts.mode ?? 'screen'
    this.maxDpr  = opts.maxDpr ?? 2
    this.canvas  = document.createElement('canvas')
    this.texture = this.makeTexture()
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTex:       { value: this.texture },
        uStrength:  { value: 0.0 },
        uScanlines: { value: 1.0 },
        uVignette:  { value: 1.0 },
        ...createLensUniforms(),
      },
      vertexShader:   this.mode === 'world' ? VERT_WORLD : VERT_SCREEN,
      fragmentShader: FRAG,
      transparent:    true,
      side:           this.mode === 'world' ? THREE.DoubleSide : THREE.FrontSide,
    })
  }

  /**
   * Max anisotropy for 'world' mode — pass renderer.capabilities.getMaxAnisotropy() once the
   * presenter has a renderer. Applies to the current and every future texture.
   */
  setAnisotropy(n: number) {
    this.anisotropy = Math.max(1, n)
    this.texture.anisotropy = this.anisotropy
    this.texture.needsUpdate = true
  }

  private makeTexture(): THREE.CanvasTexture {
    const t = new THREE.CanvasTexture(this.canvas)
    t.magFilter = THREE.LinearFilter
    if (this.mode === 'world') {
      t.generateMipmaps = true
      t.minFilter       = THREE.LinearMipmapLinearFilter
      t.anisotropy      = this.anisotropy
    } else {
      t.minFilter = THREE.LinearFilter
    }
    return t
  }

  /**
   * Size the backing store (logical W×H × dpr, capped). Returns false — and does nothing — when
   * nothing changed: assigning canvas.width clears it even at the same value, and ResizeObserver
   * fires spuriously. The caller redraws on true.
   */
  resize(W: number, H: number, devicePixelRatio = window.devicePixelRatio || 1): boolean {
    if (!W || !H) return false
    const d  = Math.min(devicePixelRatio, this.maxDpr)
    const bw = Math.round(W * d), bh = Math.round(H * d)
    if (this.canvas.width === bw && this.canvas.height === bh && this.dpr === d) return false
    this.dpr = d
    this.logicalW = W
    this.logicalH = H
    this.canvas.width  = bw
    this.canvas.height = bh
    // The GPU storage is sized from the first upload — a resized canvas needs a fresh texture.
    this.texture.dispose()
    this.texture = this.makeTexture()
    this.material.uniforms.uTex.value = this.texture
    return true
  }

  /** Curvature / scanlines / vignette / lens enable. Takes effect on the next syncUniforms(). */
  setLook(look: Partial<SurfaceLook>) {
    this.look = { ...this.look, ...look }
  }

  /** Lens centre in surface UV (y up); null = lens off. */
  setLens(uv: MouseLensUV | null) {
    this.mouse.x = uv ? uv.x : LENS_INACTIVE.x
    this.mouse.y = uv ? uv.y : LENS_INACTIVE.y
  }

  /** Push look + lens state into the shader uniforms. */
  syncUniforms() {
    const u = this.material.uniforms
    u.uStrength.value  = curvatureToStrength(this.look.curvature)
    u.uScanlines.value = this.look.scanlines ? 1.0 : 0.0
    u.uVignette.value  = this.look.vignette  ? 1.0 : 0.0
    // lens radius is a fixed physical size → logical canvas size, not the ×dpr backing store
    writeLensUniforms(this.material, this.look.magnify, this.mouse,
      this.logicalW || this.canvas.width, this.logicalH || this.canvas.height)
  }

  /** Run the painter into the offscreen canvas and flag the texture for upload. */
  paint(glow: boolean) {
    if (!this.canvas.width) return
    this.painter(this.canvas, { dpr: this.dpr, glow })
    this.texture.needsUpdate = true
  }

  /** paint() the picture WITHOUT the GL upload — for the 2D fallback presenter. */
  paintOnly(glow: boolean) {
    if (!this.canvas.width) return
    this.painter(this.canvas, { dpr: this.dpr, glow })
  }

  /**
   * Surface UV (0..1, y up — what a raycast hit's `uv` gives) → CONTENT pixel position in the
   * painter's LOGICAL px (y down), through the same lens + barrel the shader applies. Null when
   * the point lands outside the drawn content (the barrel's transparent margin).
   */
  contentPoint(u: number, v: number): { x: number; y: number } | null {
    const l = lensUV(u, v, this.mouse, this.look.magnify, this.logicalW, this.logicalH)
    const c = barrelUV(l.x, l.y, curvatureToStrength(this.look.curvature))
    if (c.x < 0 || c.x > 1 || c.y < 0 || c.y > 1) return null
    return { x: c.x * this.logicalW, y: (1 - c.y) * this.logicalH }
  }

  dispose() {
    this.texture.dispose()
    this.material.dispose()
  }
}
