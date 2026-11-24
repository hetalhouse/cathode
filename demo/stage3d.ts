/**
 * CathodeStage3D demo: a sortable, selectable, scrollable grid and a gauge in ONE three.js scene.
 * Query: ?curv=<-45..45> bend for both panels · ?static=1 stops the gauge's idle motion · ?log=1 adds a log panel · ?candle=1 adds a candle chart · ?wall=1 adds a wall of mini charts · ?info=1 gives the Net-tilt panel an ⓘ control · ?bar=cockpit wears the cockpit title bars (status dot, small tracked UPPERCASE title) with a themed palette.
 * Right-click a panel for its Display menu (in the scene).  Double-click a title bar to fly the camera to face that panel;  the – / □ buttons minimise and maximise; drag a panel's bottom-right corner to resize it.
 */
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CathodeStage3D } from '../src/CathodeStage3D'
import type { StageControls } from '../src/CathodeStage3D'
import { gridContent, gaugeContent, logContent, candleContent, candleWallContent } from '../src/panelContent'
import { candles as candleSeries, overlays as candleOverlays, markers as candleMarkers, wallCells } from './candleData'
import type { LogEntry } from '../src/CanvasLog'

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

// ── log (logContent: ?log=1) — scroll / follow-the-tail / select / copy, on fixed data ────────────────────
const LEVELS: NonNullable<LogEntry['level']>[] = ['info', 'info', 'success', 'warn', 'error', 'debug']
const T0 = Date.UTC(2026, 10, 22, 14, 0, 0)
const mkEntry = (i: number): LogEntry => ({
  ts: T0 + i * 7_000, level: LEVELS[i % LEVELS.length],
  text: i % 11 === 4 ? `#${i} a deliberately long entry that has to wrap across several visual lines in a narrow panel, so the line count depends on the panel's width`
    : `#${i} scanner cycle ${i * 3} complete — ${i % 5} candidates passed the filter`,
})
const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtTs = (ts: number | string) => { const d = new Date(ts as number); return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}` }
let logEntries = Array.from({ length: 80 }, (_, i) => mkEntry(i))
const log = q.get('log') === '1' ? logContent({ width: 560, height: 300, entries: logEntries, theme: 'phosphor', formatTs: fmtTs }) : null
/** append `n` entries (replace the array — the content notices the replacement) */
function appendLog(n = 1) { const base = logEntries.length; logEntries = [...logEntries, ...Array.from({ length: n }, (_, i) => mkEntry(base + i))]; log?.update({ entries: logEntries }) }

// ── candle chart (candleContent: ?candle=1) — crosshair / zoom at the cursor / pan on a fixed series ──────
const candle = q.get('candle') === '1'
  ? candleContent({ width: 600, height: 320, candles: candleSeries, overlays: candleOverlays, markers: candleMarkers, theme: 'phosphor' }) : null
/** append `n` candles (replace the array — the content notices the replacement) */
function appendCandles(n = 1) {
  const out = [...candleSeries]
  for (let i = 0; i < n; i++) { const l = out[out.length - 1]; out.push({ start: l.start + 3_600_000, open: l.close, high: l.close * 1.01, low: l.close * 0.99, close: l.close * 1.004, volume: 1500 }) }
  candleSeries.splice(0, candleSeries.length, ...out); candle?.update({ candles: out })
}

// ── candle wall (candleWallContent: ?wall=1) — many mini charts in one surface: hover rings a cell, a click reports it, the wheel scrolls ──────
const wallClicks: string[] = []
const wall = q.get('wall') === '1'
  ? candleWallContent({ width: 640, height: 400, cells: wallCells(12), theme: 'phosphor', onCellClick: (id) => { wallClicks.push(id) } }) : null

// ── stage ───────────────────────────────────────────────────────────────────
const controlEvents: string[] = []
const resizeEvents: { id: string; w: number; h: number }[] = []
const actionEvents: string[] = []
const displayEvents: ({ id: string } & Record<string, unknown>)[] = []
const before = new Map<string, ReturnType<CathodeStage3D['getCameraPose']>>()
const stage = new CathodeStage3D({
  container: document.getElementById('stage')!,
  controls: (camera, el) => new OrbitControls(camera, el) as unknown as StageControls,
  cameraPosition: [0, 0.15, 3.3],
  // double-click a title bar → fly the camera to face that panel
  onPanelActivate: (id) => { const pose = stage.facingPose(id); if (pose) void stage.flyTo(pose) },
  // title-bar action buttons (the Net-tilt panel's range picker) and the ✕
  onPanelAction: (id, a) => { actionEvents.push(`${id}:${a}`); const p = stage.panels.get(id)!; p.setActions(p.actions.map((x) => ({ ...x, active: x.id === a }))) },
  // right-click a panel: the Display menu, drawn in the scene (scan lines / glow / magnify / bend); Cmd+Shift +/- bends the hovered panel
  displayMenu: true,
  // ?bar=cockpit: the title bars the dashboard's 2D windows have, in a themed palette
  ...(q.get('bar') === 'cockpit' ? { barStyle: 'cockpit' as const, barColors: { bg: '#12122a', bgFocused: '#16163a', line: '#1e2a3a', lineFocused: '#00bc8c', text: '#4a6a88', textFocused: '#8fb4d8', title: '#40a0f0', titleFocused: '#7cc4ff', box: '#1e2a3a', boxFocused: '#2a4a6a', accent: '#00bc8c', accentText: '#e8fff6' } } : {}),
  onPanelDisplay: (id, d) => { displayEvents.push({ id, ...d }) },
  // a panel was resized by its corner handle (once, on release)
  onPanelResized: (id, size) => { resizeEvents.push({ id, w: size.w, h: size.h }) },
  // the title-bar controls: the stage reports the click, the demo decides what it means
  onPanelControl: (id, control) => {
    controlEvents.push(`${id}:${control}`)
    const p = stage.panels.get(id)!
    if (control === 'minimize') stage.setPanelMinimized(id, !p.minimized)
    else if (control !== 'maximize') { /* close / info: recorded above — what they mean is the host's call */ }
    else if (!p.maximized) {                                   // maximize: remember where the camera was, fly to fill the view
      before.set(id, stage.getCameraPose()); p.setMaximized(true)
      const pose = stage.facingPose(id, { margin: 0.03 }); if (pose) void stage.flyTo(pose)
    } else {                                                   // restore: fly back
      p.setMaximized(false)
      const pose = before.get(id); if (pose) void stage.flyTo(pose)
    }
  },
})
stage.addPanel({ id: 'trades', title: 'Trades', content: grid,  position: [-0.78, 0, 0],    rotationY: 0.22,  look: { curvature }, controls: ['minimize', 'maximize'], resizable: true })
stage.addPanel({ id: 'tilt',   title: 'Net tilt', content: gauge, position: [1.0, 0.05, -0.1], rotationY: -0.3, look: { curvature }, controls: [...(q.get('info') === '1' ? ['info' as const] : []), 'minimize', 'maximize', 'close'], resizable: true,
  actions: [{ id: '5m', label: '5m' }, { id: '15m', label: '15m' }, { id: '1H', label: '1H', active: true }, { id: '1D', label: '1D' }] })
if (log) stage.addPanel({ id: 'log', title: 'Log', content: log, position: [-0.45, -1.1, 0.1], rotationY: 0.12, look: { curvature }, controls: ['minimize', 'maximize'], resizable: true })
if (candle) stage.addPanel({ id: 'candle', title: 'BTC-USD · 1h', content: candle, position: [0.35, -1.1, 0.1], rotationY: -0.12, look: { curvature }, controls: ['minimize', 'maximize'], resizable: true })
if (wall) stage.addPanel({ id: 'wall', title: 'Charts', content: wall, position: [0.1, -1.0, 0.1], rotationY: 0.05, look: { curvature }, controls: ['minimize', 'maximize'], resizable: true })
if (idle) setInterval(() => setTilt(Math.sin(Date.now() / 4000) * 0.9), 2500)

;(window as unknown as Record<string, unknown>).__stage3d = { stage, grid, gauge, setTilt, events, controlEvents, actionEvents, wall, wallClicks, resizeEvents, displayEvents, log, appendLog, candle, appendCandles, candleCount: () => candleSeries.length }
