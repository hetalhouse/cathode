/**
 * Single-panel 3D demo: one CathodeSurface (a gauge) in 'world' mode on a plane in a perspective
 * scene. Validates that the CRT shader, mipmapped texture and CPU hit-testing hold up off the
 * full-screen quad. Query: ?curv=<-45..45>  ?magnify=1  ?rotY=<radians>
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CathodeSurface } from '../src/CathodeSurface'
import { createSurfaceMesh } from '../src/surfaceMesh'
import { drawGauge, GAUGE_THEME_COLORS } from '../src/CanvasGauge'

const q = new URLSearchParams(location.search)
const curvature = Number(q.get('curv') ?? 10)
const magnify   = q.get('magnify') === '1'
const rotY      = Number(q.get('rotY') ?? 0.55)

let shown = 0, target = 0.62

const surface = new CathodeSurface({
  mode: 'world',
  paint: (canvas, { dpr, glow }) => drawGauge(canvas, {
    dpr, theme: 'phosphor', glow, shown, value: target, min: -1, max: 1,
    stance: 'net long', sub: '4 long · 1 short · 7 flat',
    leftLabel: 'SHORT', rightLabel: 'LONG', sideLetters: ['S', 'L'],
    caption: 'tilted long — 3D plane', note: 'CathodeSurface · mode: world',
    items: [
      { label: 'BTC', side: 'L' }, { label: 'ETH', side: 'L' },
      { label: 'SOL', side: 'L' }, { label: 'XRP', side: 'S' },
    ] as never,
    emptyText: '',
  }),
})
surface.setLook({ curvature, magnify, scanlines: true, vignette: true })
surface.resize(560, 360, Math.min(window.devicePixelRatio || 1, 2))

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
renderer.setClearColor(0x05080a, 1)
document.body.appendChild(renderer.domElement)
surface.setAnisotropy(renderer.capabilities.getMaxAnisotropy())

const scene  = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50)
camera.position.set(0, 0.15, 2.4)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const mesh = createSurfaceMesh(surface, 1.2)
mesh.rotation.y = rotY
scene.add(mesh)

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

// pointer → raycast → surface UV → lens centre
const ray = new THREE.Raycaster()
const ndc = new THREE.Vector2()
function hitAt(clientX: number, clientY: number) {
  const r = renderer.domElement.getBoundingClientRect()
  ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  return ray.intersectObject(mesh)[0]?.uv ?? null
}
renderer.domElement.addEventListener('pointermove', (e) => {
  const uv = hitAt(e.clientX, e.clientY)
  surface.setLens(uv ? { x: uv.x, y: uv.y } : null)
  dirty = true
})

let dirty = true
function frame() {
  const d = target - shown
  if (Math.abs(d) > 0.004) { shown += d * 0.18; dirty = true } else if (shown !== target) { shown = target; dirty = true }
  if (dirty) {
    surface.syncUniforms()
    surface.paint(true)
    dirty = false
  }
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(frame)
}
frame()

// test hook
;(window as unknown as Record<string, unknown>).__surface3d = {
  surface, mesh, camera, scene,
  /** surface UV → content px, via the shared CPU mirror of the shader */
  probe: (u: number, v: number) => surface.contentPoint(u, v),
  hitAt,
}
