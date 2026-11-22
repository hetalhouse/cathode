/**
 * CathodeStage3D demo: a sortable, selectable, scrollable grid and a gauge in ONE three.js scene.
 * Query: ?curv=<-45..45> bend for both panels · ?static=1 stops the gauge's idle motion.
 * Double-click a title bar to fly the camera to face that panel; the – / □ buttons minimise and maximise.
 */
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CathodeStage3D } from '../src/CathodeStage3D'
import type { StageControls } from '../src/CathodeStage3D'
import { gridContent, gaugeContent } from '../src/panelContent'

const q = new URLSearchParams(location.search)
const curvature = Number(q.get('curv') ?? 12)
const idle = q.get('static') !== '1'

// ── data ────────────────────────────────────────────────────────────────────
const PRODUCTS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'LINK-USD', 'DOGE-USD']
const trades = Array.from({ length: 120 }, (_, i) => ({
  id: i + 1,
  product: PRODUCTS[i % PRODUCTS.length],
  side: i % 3 === 0 ? 'short' : 'long',
  pnl: Math.round(Math.sin(i * 1.7) * 480) / 10,
  size: 100 + ((i * 37) % 900),
}))

// grid events, kept for the tests (row-clicked carries the click count in event.detail)
const events: { e: string; detail?: number }[] = []

const grid = gridContent({
  width: 640, height: 400,
  emit: ((e: string, p?: { event?: { detail?: number } }) => { events.push({ e, detail: p?.event?.detail }) }) as never,
  rowData: trades,
  columnDefs: [
    { field: 'id',      headerName: 'ID',      width: 70,  sortable: true },
    { field: 'product', headerName: 'Product', width: 140, sortable: true, filter: true },
    { field: 'side',    headerName: 'Side',    width: 110, sortable: true },
    { field: 'pnl',     headerName: 'P&L %',   width: 130, sortable: true,
      cellStyle: (p: { value: number }) => ({ color: p.value >= 0 ? '#6ee7a7' : '#f87171' }) },
    { field: 'size',    headerName: 'Size',    width: 120, sortable: true },
  ],
})

// ── gauge (gaugeContent: the same picture CathodeGauge draws, as a stage panel; the needle eases) ──────
const gauge = gaugeContent({
  width: 440, height: 320, theme: 'phosphor',
  value: 0.62, min: -1, max: 1,
  stance: 'net long', sub: '5 long · 3 short · 9 flat',
  leftLabel: 'SHORT', rightLabel: 'LONG', sideLetters: ['S', 'L'],
  caption: 'tilt through the stage', note: 'a second panel, same scene, same renderer',
  items: [
    { label: 'BTC', side: 'right', value: '+2.1%', tone: 'up' },
    { label: 'ETH', side: 'right', value: '+0.8%', tone: 'up' },
    { label: 'XRP', side: 'left',  value: '−1.4%', tone: 'down' },
  ],
})
function setTilt(v: number) { gauge.update({ value: v, stance: v >= 0 ? 'net long' : 'net short' }) }

// ── stage ───────────────────────────────────────────────────────────────────
const controlEvents: string[] = []
const before = new Map<string, ReturnType<CathodeStage3D['getCameraPose']>>()
const stage = new CathodeStage3D({
  container: document.getElementById('stage')!,
  controls: (camera, el) => new OrbitControls(camera, el) as unknown as StageControls,
  cameraPosition: [0, 0.15, 3.3],
  // double-click a title bar → fly the camera to face that panel
  onPanelActivate: (id) => { const pose = stage.facingPose(id); if (pose) void stage.flyTo(pose) },
  // the title-bar controls: the stage reports the click, the demo decides what it means
  onPanelControl: (id, control) => {
    controlEvents.push(`${id}:${control}`)
    const p = stage.panels.get(id)!
    if (control === 'minimize') stage.setPanelMinimized(id, !p.minimized)
    else if (!p.maximized) {                                   // maximize: remember where the camera was, fly to fill the view
      before.set(id, stage.getCameraPose()); p.setMaximized(true)
      const pose = stage.facingPose(id, { margin: 0.03 }); if (pose) void stage.flyTo(pose)
    } else {                                                   // restore: fly back
      p.setMaximized(false)
      const pose = before.get(id); if (pose) void stage.flyTo(pose)
    }
  },
})
stage.addPanel({ id: 'trades', title: 'Trades', content: grid,  position: [-0.78, 0, 0],    rotationY: 0.22,  look: { curvature }, controls: ['minimize', 'maximize'] })
stage.addPanel({ id: 'tilt',   title: 'Net tilt', content: gauge, position: [1.0, 0.05, -0.1], rotationY: -0.3, look: { curvature }, controls: ['minimize', 'maximize'] })
if (idle) setInterval(() => setTilt(Math.sin(Date.now() / 4000) * 0.9), 2500)

;(window as unknown as Record<string, unknown>).__stage3d = { stage, grid, gauge, setTilt, events, controlEvents }
