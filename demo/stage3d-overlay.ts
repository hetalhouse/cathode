/**
 * Overlay-mode demo: a CathodeStage3D laid over a HOST scene. The "scene" here is a plain div that
 * stands in for a dashboard's market scape: it counts the pointer events that reach it and runs a
 * tiny orbit that DRIVES the stage's camera (setCameraPose) — so panels share the host's 3D space.
 * A DOM window sits above the stage to exercise shouldHandle.
 */
import { CathodeStage3D } from '../src/CathodeStage3D'
import { gridContent } from '../src/panelContent'

const counts = { pointerdown: 0, click: 0, wheel: 0 }
const sceneEl = document.getElementById('scene-layer')!
for (const t of ['pointerdown', 'click', 'wheel'] as const) {
  sceneEl.addEventListener(t, () => { counts[t]++ })
}

// host orbit: yaw/pitch/distance around the origin
const cam = { yaw: 0, pitch: 0.05, dist: 2.4 }
function applyCam() {
  const x = cam.dist * Math.sin(cam.yaw) * Math.cos(cam.pitch)
  const y = cam.dist * Math.sin(cam.pitch)
  const z = cam.dist * Math.cos(cam.yaw) * Math.cos(cam.pitch)
  stage.setCameraPose({ position: [x, y, z], target: [0, 0, 0] })
}
let orbit: { x: number; y: number; yaw: number; pitch: number } | null = null
sceneEl.addEventListener('pointerdown', (e) => { orbit = { x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch } })
window.addEventListener('pointermove', (e) => {
  if (!orbit) return
  cam.yaw = orbit.yaw - (e.clientX - orbit.x) * 0.005
  cam.pitch = Math.max(-1, Math.min(1, orbit.pitch + (e.clientY - orbit.y) * 0.005))
  applyCam()
})
window.addEventListener('pointerup', () => { orbit = null })
sceneEl.addEventListener('wheel', (e) => { cam.dist = Math.max(1.5, Math.min(8, cam.dist + e.deltaY * 0.002)); applyCam() })

const rows = Array.from({ length: 80 }, (_, i) => ({ id: i + 1, product: ['BTC', 'ETH', 'SOL', 'XRP'][i % 4], pnl: Math.round(Math.sin(i * 1.3) * 400) / 10 }))
const grid = gridContent({
  width: 520, height: 340, rowData: rows,
  columnDefs: [
    { field: 'id', headerName: 'ID', width: 80, sortable: true },
    { field: 'product', headerName: 'Product', width: 160, sortable: true },
    { field: 'pnl', headerName: 'P&L %', width: 140, sortable: true },
  ],
})

const stage = new CathodeStage3D({
  container: document.getElementById('stage')!,
  transparent: true,
  fov: 62, near: 0.1, far: 300,
  passThrough: true,
  shouldHandle: (t) => !(t as Element | null)?.closest?.('#dom-window'),
  onCursor: (c) => { sceneEl.style.cursor = c || 'grab' },
})
stage.addPanel({ id: 'trades', title: 'Trades', content: grid, position: [0, 0, 0], look: { curvature: 0 } })
applyCam()

;(window as unknown as Record<string, unknown>).__overlay = { stage, grid, counts, cam }
