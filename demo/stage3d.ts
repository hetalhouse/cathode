/**
 * CathodeStage3D demo: a sortable, selectable, scrollable grid and a gauge in ONE three.js scene.
 * Query: ?curv=<-45..45> bend for both panels · ?static=1 stops the gauge's idle motion.
 */
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CathodeStage3D } from '../src/CathodeStage3D'
import type { StageControls } from '../src/CathodeStage3D'
import { gridContent, surfaceContent } from '../src/panelContent'
import { CathodeSurface } from '../src/CathodeSurface'
import { drawGauge } from '../src/CanvasGauge'

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

const grid = gridContent({
  width: 640, height: 400,
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

// ── gauge (painter-only content) ─────────────────────────────────────────────
const g = { shown: 0, value: 0.5 }
let gaugeInvalidate = () => {}
const gaugeSurface = new CathodeSurface({
  mode: 'world',
  paint: (canvas, { dpr, glow }) => drawGauge(canvas, {
    dpr, theme: 'phosphor', glow, shown: g.shown, value: g.value, min: -1, max: 1,
    stance: g.value >= 0 ? 'net long' : 'net short', sub: '5 long · 3 short · 9 flat',
    leftLabel: 'SHORT', rightLabel: 'LONG', sideLetters: ['S', 'L'],
    caption: 'tilt through the stage', note: 'a second panel, same scene, same renderer',
    items: [
      { label: 'BTC', side: 'right', value: '+2.1%', tone: 'up' },
      { label: 'ETH', side: 'right', value: '+0.8%', tone: 'up' },
      { label: 'XRP', side: 'left',  value: '−1.4%', tone: 'down' },
    ],
    emptyText: '',
  }),
})
const gauge = surfaceContent(gaugeSurface, 440, 320, { attach: (fn) => { gaugeInvalidate = fn } })

function easeNeedle() {
  const d = g.value - g.shown
  if (Math.abs(d) < 0.004) { g.shown = g.value; gaugeInvalidate(); return }
  g.shown += d * 0.18
  gaugeInvalidate()
  requestAnimationFrame(easeNeedle)
}
function setTilt(v: number) { g.value = v; easeNeedle() }

// ── stage ───────────────────────────────────────────────────────────────────
const stage = new CathodeStage3D({
  container: document.getElementById('stage')!,
  controls: (camera, el) => new OrbitControls(camera, el) as unknown as StageControls,
  cameraPosition: [0, 0.15, 3.3],
})
stage.addPanel({ id: 'trades', title: 'Trades', content: grid,  position: [-0.78, 0, 0],    rotationY: 0.22,  look: { curvature } })
stage.addPanel({ id: 'tilt',   title: 'Net tilt', content: gauge, position: [1.0, 0.05, -0.1], rotationY: -0.3, look: { curvature } })
setTilt(0.62)
if (idle) setInterval(() => setTilt(Math.sin(Date.now() / 4000) * 0.9), 2500)

;(window as unknown as Record<string, unknown>).__stage3d = { stage, grid, gauge, setTilt, state: g }
