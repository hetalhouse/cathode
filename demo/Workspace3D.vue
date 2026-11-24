<script setup lang="ts">
/**
 * Workspace3D — the 3D stage as a demo tab: a day-themed (paper) workspace of live panels — a grid, a candle chart, a wall of mini charts, a gauge, a log — hung in one three.js scene,
 * with the camera as the interface. Scroll to zoom in and out, drag to orbit, □ to EXPAND a panel (the camera flies in to fill the view, and back), Overview to zoom the whole workspace
 * out until everything is in frame, Recenter to go home. ▶ Tour plays it for you. The Night button re-dresses the same scene live (bars, menu, panels).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CathodeStage3D } from '../src/CathodeStage3D'
import type { StageControls, StageCameraPose, BarColors } from '../src/CathodeStage3D'
import { gridContent, gaugeContent, logContent, candleContent, candleWallContent } from '../src/panelContent'
import { candles as series, overlays, markers, wallCells } from './candleData'
import type { LogEntry } from '../src/CanvasLog'

type Mode = 'day' | 'night'
const emit = defineEmits<{ mode: [Mode] }>()
const mode = ref<Mode>('day')
const host = ref<HTMLDivElement | null>(null)
const caption = ref('')
const touring = ref(false)
const zoomLabel = ref('Overview')

// the title bars + Display menu per mode (cathode 0.20: themeable chrome)
const BARS: Record<Mode, Partial<BarColors>> = {
  day: { bg: '#e6edf6', bgFocused: '#f3f7fc', line: '#b9c7da', lineFocused: '#2f6fd0', text: '#5a6b80', textFocused: '#1d2b3d', title: '#2f6fd0', titleFocused: '#1f56ad', box: '#b9c7da', boxFocused: '#8aa0bd', accent: '#1f9d66', accentText: '#0b2a1a' },
  night: {},
}
const MENU = {
  day: { bg: '#f8fafd', border: '#b9c7da', text: '#1d2b3d', muted: '#6b7c92', accent: '#2f6fd0', divider: '#d6dfeb', hover: 'rgba(47,111,208,0.10)' },
  night: {},
}

// ── data ──────────────────────────────────────────────────────────────────────
const PRODUCTS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'AVAX-USD', 'LINK-USD', 'DOGE-USD', 'ADA-USD', 'XRP-USD']
const trades = Array.from({ length: 80 }, (_, i) => ({ id: i + 1, product: PRODUCTS[i % PRODUCTS.length], side: i % 3 === 0 ? 'short' : 'long', pnl: Math.round(Math.sin(i * 1.7) * 480) / 10, size: 100 + ((i * 37) % 900) }))
const T0 = Date.UTC(2026, 10, 22, 14, 0, 0)
const LEVELS: NonNullable<LogEntry['level']>[] = ['info', 'info', 'success', 'warn', 'debug', 'info']
const logEntries: LogEntry[] = Array.from({ length: 60 }, (_, i) => ({ ts: T0 + i * 7_000, level: LEVELS[i % LEVELS.length], text: `scanner cycle ${i * 3} complete — ${i % 5} candidates passed the filter` }))
const hhmm = (ts: number | string) => { const d = new Date(ts as number); return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}` }

// ── the layout: each panel's rectangle in stage px (title bar included), like a 2D workspace ─────────────────────
const BAR = 26
const LAYOUT = {
  trades: { x: 0,    y: 0,   w: 560, h: 320, title: 'Open positions' },
  candle: { x: 580,  y: 0,   w: 600, h: 320, title: 'BTC-USD · 1h' },
  tilt:   { x: 1200, y: 0,   w: 340, h: 320, title: 'Net tilt' },
  wall:   { x: 0,    y: 370, w: 740, h: 320, title: 'Charts' },
  log:    { x: 760,  y: 370, w: 780, h: 320, title: 'Monitor log' },
} as const
type PanelId = keyof typeof LAYOUT
const TOTAL_W = 1540, TOTAL_H = 370 + 320 + BAR

let stage: CathodeStage3D | null = null
let tiltTimer: ReturnType<typeof setInterval> | null = null
let gaugeRef: ReturnType<typeof gaugeContent> | null = null
const before = new Map<string, StageCameraPose>()
let tourToken = 0

function build(m: Mode, keepPose: StageCameraPose | null) {
  const el = host.value!
  const theme = m === 'day' ? 'paper' : 'phosphor'
  const day = m === 'day'
  stage = new CathodeStage3D({
    container: el, transparent: true,
    controls: (camera, dom) => { const c = new OrbitControls(camera, dom); c.enableDamping = true; c.minDistance = 0.4; c.maxDistance = 16; c.zoomSpeed = 0.9; return c as unknown as StageControls },
    cameraPosition: [0, 0, 6],
    displayMenu: { colors: MENU[m] },
    barStyle: 'cockpit', barColors: BARS[m],
    onPanelActivate: (id) => { const p = stage!.facingPose(id, { margin: 0.04 }); if (p) void stage!.flyTo(p, 650); zoomLabel.value = 'Overview' },
    onPanelControl: (id, control) => {
      const p = stage!.panels.get(id)!
      if (control === 'info') { say(INFO[id as PanelId] ?? '', 5000); return }
      if (control === 'minimize') { stage!.setPanelMinimized(id, !p.minimized); return }
      if (control !== 'maximize') return
      if (!p.maximized) {                                       // EXPAND: remember where the camera was, then fly in until the panel fills the view
        before.set(id, stage!.getCameraPose()); p.setMaximized(true)
        const pose = stage!.facingPose(id, { margin: 0.03 }); if (pose) void stage!.flyTo(pose, 700)
      } else {                                                  // restore: fly back out to where we were
        p.setMaximized(false)
        const pose = before.get(id); if (pose) void stage!.flyTo(pose, 700)
      }
    },
  })
  const look = { curvature: day ? 5 : 10, scanlines: !day, vignette: false }
  const glow = !day
  const ppu = stage.pxPerUnit
  const at = (id: PanelId) => { const r = LAYOUT[id]; return [(r.x + r.w / 2 - TOTAL_W / 2) / ppu, -((r.y + BAR + r.h / 2) - TOTAL_H / 2) / ppu, 0] as [number, number, number] }
  const add = (id: PanelId, content: Parameters<CathodeStage3D['addPanel']>[0]['content'], extra: object = {}) =>
    stage!.addPanel({ id, title: LAYOUT[id].title, content, position: at(id), look, glow, controls: ['info', 'minimize', 'maximize'], resizable: true, ...extra })

  add('trades', gridContent({ width: LAYOUT.trades.w, height: LAYOUT.trades.h, theme, rowData: trades, columnDefs: [
    { field: 'id', headerName: 'ID', width: 60, sortable: true }, { field: 'product', headerName: 'Product', width: 130, sortable: true, filter: true },
    { field: 'side', headerName: 'Side', width: 90, sortable: true },
    { field: 'pnl', headerName: 'P&L %', width: 110, sortable: true, cellStyle: (p: { value: number }) => ({ color: p.value >= 0 ? (day ? '#16794f' : '#6ee7a7') : (day ? '#c0392b' : '#f87171') }) },
    { field: 'size', headerName: 'Size', width: 100, sortable: true },
  ], rowHeight: 24 }))
  add('candle', candleContent({ width: LAYOUT.candle.w, height: LAYOUT.candle.h, candles: series, overlays, markers, theme }))
  gaugeRef = gaugeContent({ width: LAYOUT.tilt.w, height: LAYOUT.tilt.h, theme, value: 0.62, min: -1, max: 1, stance: 'net long', sub: '5 long · 3 short · 9 flat', leftLabel: 'SHORT', rightLabel: 'LONG', sideLetters: ['S', 'L'],
    caption: 'tilt of the book', note: 'a gauge, in the same scene',
    items: [{ label: 'BTC', side: 'right', value: '+2.1%', tone: 'up' }, { label: 'ETH', side: 'right', value: '+0.8%', tone: 'up' }, { label: 'XRP', side: 'left', value: '−1.4%', tone: 'down' }] })
  add('tilt', gaugeRef)
  add('wall', candleWallContent({ width: LAYOUT.wall.w, height: LAYOUT.wall.h, cells: wallCells(9), theme }))
  add('log', logContent({ width: LAYOUT.log.w, height: LAYOUT.log.h, entries: logEntries, theme, formatTs: hhmm }))

  // start from the Overview (or where the camera was, when the look was just switched)
  const start = keepPose ?? stage.framePose(undefined, { margin: 0.06 })
  if (start) stage.setCameraPose(start)
  tiltTimer = setInterval(() => { const v = Math.round(Math.sin(Date.now() / 4000) * 90) / 100; gaugeRef?.update({ value: v, stance: v >= 0 ? 'net long' : 'net short' }) }, 2500)   // (rounded: the read-out prints the value as given)
  ;(window as unknown as Record<string, unknown>).__ws3d = { stage, overview, recenter, tour, stopTour, setMode, layout: LAYOUT, setCaption: (t: string) => { caption.value = t },
    setTilt: (v: number) => { if (tiltTimer) clearInterval(tiltTimer); tiltTimer = null; gaugeRef?.update({ value: v, stance: v >= 0 ? 'net long' : 'net short' }) } }   // (tests + tools/capture-workspace.mjs drive the scene through it)
}

function teardown() { if (tiltTimer) clearInterval(tiltTimer); tiltTimer = null; stage?.dispose(); stage = null; gaugeRef = null; before.clear() }

// ⓘ on a panel: what it is, as the caption
const INFO: Record<PanelId, string> = {
  trades: 'A sortable, filterable canvas grid — click a header to sort, the funnel to filter',
  candle: 'A three.js candlestick chart — wheel to zoom the series, drag to pan, hover for the crosshair',
  tilt: 'A bipolar gauge — the needle eases to each new reading',
  wall: 'A wall of mini charts drawn into ONE surface — hover a card, scroll the wall',
  log: 'A scrolling console — follow the tail, select and copy lines',
}
let sayTimer: ReturnType<typeof setTimeout> | null = null
function say(text: string, ms: number) { caption.value = text; if (sayTimer) clearTimeout(sayTimer); sayTimer = setTimeout(() => { if (!touring.value) caption.value = '' }, ms) }

// ── the zoom controls ─────────────────────────────────────────────────────────────────────────────────────────────
/** zoom the whole workspace OUT until every panel is in frame */
function overview() { const p = stage?.framePose(undefined, { margin: 0.06 }); if (p) void stage!.flyTo(p, 800); zoomLabel.value = 'Overview' }
/** back to the start: the overview, level and centred */
function recenter() { for (const [id] of before) stage?.panels.get(id)?.setMaximized(false); before.clear(); overview() }
/** zoom IN on one panel until it fills the view */
async function zoomTo(id: PanelId, ms = 800) { const p = stage?.facingPose(id, { margin: 0.05 }); if (p) await stage!.flyTo(p, ms) }
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function tour() {
  if (touring.value) { stopTour(); return }
  touring.value = true
  const me = ++tourToken
  const alive = () => tourToken === me && !!stage
  const steps: { text: string; run: () => Promise<void> | void; hold: number }[] = [
    { text: 'Zoom out — the whole workspace in one view', run: () => { overview() }, hold: 1600 },
    { text: 'Zoom in — a panel fills the screen', run: () => zoomTo('trades'), hold: 1500 },
    { text: 'Zoom out — and in again on the chart', run: async () => { overview(); await sleep(900); await zoomTo('candle') }, hold: 1700 },
    { text: 'A wall of mini charts — one WebGL surface', run: () => zoomTo('wall'), hold: 1500 },
    { text: 'Back out to the overview', run: () => { overview() }, hold: 1500 },
  ]
  for (const s of steps) { if (!alive()) break; caption.value = s.text; await s.run(); await sleep(s.hold) }
  if (tourToken === me) { caption.value = ''; touring.value = false }
}
function stopTour() { tourToken++; touring.value = false; caption.value = ''; stage?.flyTo(stage.getCameraPose(), 0) }

function setMode(m: Mode) {
  if (m === mode.value || !stage) return
  const pose = stage.getCameraPose()
  stopTour(); teardown(); mode.value = m
  build(m, pose); emit('mode', m)
}

onMounted(() => { build(mode.value, null); emit('mode', mode.value) })
onBeforeUnmount(() => { tourToken++; teardown(); delete (window as unknown as Record<string, unknown>).__ws3d })
</script>

<template>
  <div class="ws3d" :class="mode" data-testid="ws3d">
    <div ref="host" class="ws3d-stage" />
    <div class="ws3d-bar">
      <span class="ws3d-title">3D workspace</span>
      <button class="ws3d-btn" title="Zoom the whole workspace out until every panel is in frame" @click="overview">Overview</button>
      <button class="ws3d-btn" title="Fly back to the start" @click="recenter">Recenter</button>
      <button class="ws3d-btn" :class="{ on: touring }" title="Play a short zoom-in / zoom-out tour" @click="tour">{{ touring ? '■ Stop' : '▶ Tour' }}</button>
      <span class="ws3d-spacer" />
      <button class="ws3d-btn" :class="{ on: mode === 'day' }" @click="setMode('day')">☀ Day</button>
      <button class="ws3d-btn" :class="{ on: mode === 'night' }" @click="setMode('night')">☾ Night</button>
    </div>
    <div v-if="caption" class="ws3d-caption" role="status">{{ caption }}</div>
    <div class="ws3d-hint">scroll to <b>zoom</b> · drag to <b>orbit</b> · <b>□</b> expands a panel · double-click a title bar to face it · right-click a panel for its display menu</div>
  </div>
</template>

<style scoped>
.ws3d { position: relative; width: 100%; height: 100%; min-height: 520px; overflow: hidden; }
.ws3d.day   { background: radial-gradient(ellipse at 50% 35%, #fbfdff 0%, #eaf1fa 55%, #d9e5f3 100%); }
.ws3d.night { background: radial-gradient(ellipse at 50% 35%, #0e1a22 0%, #070d12 60%, #04080b 100%); }
/* a faint dot grid under the panels, so zooming reads as depth */
.ws3d::before { content: ''; position: absolute; inset: 0; pointer-events: none; background-size: 34px 34px; opacity: 0.5; }
.ws3d.day::before   { background-image: radial-gradient(circle, rgba(47,111,208,0.16) 1px, transparent 1.4px); }
.ws3d.night::before { background-image: radial-gradient(circle, rgba(110,231,167,0.14) 1px, transparent 1.4px); }
.ws3d-stage { position: absolute; inset: 0; }
.ws3d-bar { position: absolute; top: 10px; left: 12px; right: 12px; display: flex; gap: 6px; align-items: center; pointer-events: none; }
.ws3d-bar > * { pointer-events: auto; }
.ws3d-spacer { flex: 1; pointer-events: none; }
.ws3d-title { font: 700 11px ui-monospace, monospace; letter-spacing: 0.14em; text-transform: uppercase; margin-right: 8px; }
.day .ws3d-title { color: #2f6fd0; } .night .ws3d-title { color: #6ee7a7; }
.ws3d-btn { font: 600 11px ui-monospace, monospace; padding: 5px 11px; border-radius: 4px; cursor: pointer; border: 1px solid; background: transparent; }
.day .ws3d-btn   { color: #33465e; border-color: #b9c7da; background: rgba(255,255,255,0.7); }
.day .ws3d-btn:hover, .day .ws3d-btn.on   { color: #fff; background: #2f6fd0; border-color: #2f6fd0; }
.night .ws3d-btn { color: #9fd9bd; border-color: #2f6b4c; background: rgba(8,19,14,0.7); }
.night .ws3d-btn:hover, .night .ws3d-btn.on { color: #06150e; background: #6ee7a7; border-color: #6ee7a7; }
.ws3d-caption { position: absolute; left: 50%; bottom: 46px; transform: translateX(-50%); font: 700 14px ui-monospace, monospace; padding: 8px 16px; border-radius: 6px; pointer-events: none; white-space: nowrap; }
.day .ws3d-caption   { color: #fff; background: rgba(31,86,173,0.92); }
.night .ws3d-caption { color: #06150e; background: rgba(110,231,167,0.95); }
.ws3d-hint { position: absolute; left: 12px; right: 12px; bottom: 10px; text-align: center; font: 11px ui-monospace, monospace; pointer-events: none; }
.day .ws3d-hint { color: #5a6b80; } .night .ws3d-hint { color: #6fae8f; }
</style>
