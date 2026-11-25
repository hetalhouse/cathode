<script setup lang="ts">
/**
 * Workspace3D — the 3D stage as a demo tab: a workspace of live panels — a grid, a candle chart, a wall of mini charts, a gauge, a log — hung in one three.js scene above a floor grid,
 * with the camera as the interface. Scroll to zoom in and out, drag to orbit, □ to EXPAND a panel (the camera flies in to fill the view, and back), Overview to zoom the whole workspace
 * out until everything is in frame, Recenter to go home. ▶ Tour plays it for you. The look follows the demo's Theme drop-down (Default · Phosphor · Amber · Paper): the panels, the title
 * bars, the Display menu, the backdrop and the floor are all re-dressed live, keeping the camera where it is.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CathodeStage3D } from '../src/CathodeStage3D'
import type { StageControls, StageCameraPose, BarColors } from '../src/CathodeStage3D'
import { gridContent, gaugeContent, logContent, candleContent, candleWallContent } from '../src/panelContent'
import { candles as series, overlays, markers, wallCells } from './candleData'
import type { LogEntry } from '../src/CanvasLog'

type Theme = 'none' | 'phosphor' | 'amber' | 'paper'
const props = defineProps<{ theme: Theme }>()
const host = ref<HTMLDivElement | null>(null)
const caption = ref('')
const touring = ref(false)

/** everything that changes with the theme: the title bars, the Display menu, the page behind the canvas, the floor, the panels' look, and the toolbar's colours */
interface Look {
  bars: Partial<BarColors>; menu: object
  bg: string; dot: string; floor: string; floorAlpha: number
  panel: { curvature: number; scanlines: boolean; glow: boolean }
  up: string; down: string
  ui: { ink: string; btnBg: string; btnBorder: string; btnInk: string; btnHoverInk: string; capBg: string; capInk: string; hint: string }
}
const LOOKS: Record<Theme, Look> = {
  paper: {
    bars: { bg: '#e6edf6', bgFocused: '#f3f7fc', line: '#b9c7da', lineFocused: '#2f6fd0', text: '#5a6b80', textFocused: '#1d2b3d', title: '#2f6fd0', titleFocused: '#1f56ad', box: '#b9c7da', boxFocused: '#8aa0bd', accent: '#1f9d66', accentText: '#0b2a1a' },
    menu: { bg: '#f8fafd', border: '#b9c7da', text: '#1d2b3d', muted: '#6b7c92', accent: '#2f6fd0', divider: '#d6dfeb', hover: 'rgba(47,111,208,0.10)' },
    bg: 'radial-gradient(ellipse at 50% 30%, #fbfdff 0%, #eaf1fa 55%, #d3e0f1 100%)', dot: 'rgba(47,111,208,0.16)', floor: '#2f6fd0', floorAlpha: 0.55,
    panel: { curvature: 5, scanlines: false, glow: false }, up: '#16794f', down: '#c0392b',
    ui: { ink: '#2f6fd0', btnBg: 'rgba(255,255,255,0.75)', btnBorder: '#b9c7da', btnInk: '#33465e', btnHoverInk: '#fff', capBg: 'rgba(31,86,173,0.92)', capInk: '#fff', hint: '#5a6b80' },
  },
  none: {
    bars: { bg: '#12122a', bgFocused: '#181840', line: '#26324a', lineFocused: '#40a0f0', text: '#6a85a8', textFocused: '#b8d0ea', title: '#40a0f0', titleFocused: '#7cc4ff', box: '#26324a', boxFocused: '#3a5a80', accent: '#00bc8c', accentText: '#e8fff6' },
    menu: { bg: '#10182a', border: '#2a3a55', text: '#c0d0e0', muted: '#6a7f96', accent: '#40a0f0', divider: '#1e2a3a', hover: 'rgba(255,255,255,0.07)' },
    bg: 'radial-gradient(ellipse at 50% 30%, #131c33 0%, #0a1020 60%, #060a14 100%)', dot: 'rgba(64,160,240,0.14)', floor: '#40a0f0', floorAlpha: 0.5,
    panel: { curvature: 8, scanlines: true, glow: false }, up: '#00bc8c', down: '#e74c3c',
    ui: { ink: '#40a0f0', btnBg: 'rgba(16,24,42,0.78)', btnBorder: '#2a3a55', btnInk: '#a8c4e4', btnHoverInk: '#06101e', capBg: 'rgba(64,160,240,0.95)', capInk: '#06101e', hint: '#6a85a8' },
  },
  phosphor: {
    bars: {},   // the stage's default green-on-black bar
    menu: {},
    bg: 'radial-gradient(ellipse at 50% 30%, #0e1a22 0%, #070d12 60%, #04080b 100%)', dot: 'rgba(110,231,167,0.14)', floor: '#6ee7a7', floorAlpha: 0.5,
    panel: { curvature: 10, scanlines: true, glow: true }, up: '#6ee7a7', down: '#f87171',
    ui: { ink: '#6ee7a7', btnBg: 'rgba(8,19,14,0.7)', btnBorder: '#2f6b4c', btnInk: '#9fd9bd', btnHoverInk: '#06150e', capBg: 'rgba(110,231,167,0.95)', capInk: '#06150e', hint: '#6fae8f' },
  },
  amber: {
    bars: { bg: '#1a1205', bgFocused: '#271a07', line: '#5e4310', lineFocused: '#ffcc33', text: '#b8883a', textFocused: '#ffd983', title: '#ffcc33', titleFocused: '#ffe08a', box: '#5e4310', boxFocused: '#8a6418', accent: '#ffcc33', accentText: '#2a1c04' },
    menu: { bg: '#1a1205', border: '#5e4310', text: '#ffd983', muted: '#b8883a', accent: '#ffcc33', divider: '#3a2a0a', hover: 'rgba(255,204,51,0.10)' },
    bg: 'radial-gradient(ellipse at 50% 30%, #20160a 0%, #120c04 60%, #0a0702 100%)', dot: 'rgba(255,204,51,0.13)', floor: '#ffb62e', floorAlpha: 0.5,
    panel: { curvature: 10, scanlines: true, glow: true }, up: '#ffcc33', down: '#d9531e',
    ui: { ink: '#ffcc33', btnBg: 'rgba(26,18,5,0.78)', btnBorder: '#5e4310', btnInk: '#e0b560', btnHoverInk: '#1a1205', capBg: 'rgba(255,204,51,0.95)', capInk: '#1a1205', hint: '#b8883a' },
  },
}
const look = () => LOOKS[props.theme]
/** the toolbar's colours as CSS variables on the root */
const rootStyle = () => { const L = look(); return { '--bg': L.bg, '--dot': L.dot, '--ink': L.ui.ink, '--btn-bg': L.ui.btnBg, '--btn-border': L.ui.btnBorder, '--btn-ink': L.ui.btnInk, '--btn-hover-ink': L.ui.btnHoverInk, '--cap-bg': L.ui.capBg, '--cap-ink': L.ui.capInk, '--hint': L.ui.hint } }

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
let tourToken = 0

let floor: THREE.Mesh | null = null

/** a grid on the ground under the panels (the dashboard's scape has one): fine + major lines, fading out with distance — a shader, so the lines stay one pixel wide at any zoom */
function makeFloor(color: string, alpha: number, y: number) {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uAlpha: { value: alpha }, uCell: { value: 0.3 }, uFar: { value: 20 } },
    vertexShader: 'varying vec3 vP; void main() { vP = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.0); }',
    fragmentShader: `
      varying vec3 vP; uniform vec3 uColor; uniform float uAlpha; uniform float uCell; uniform float uFar;
      float lines(vec2 p, float cell) { vec2 c = p / cell; vec2 g = abs(fract(c - 0.5) - 0.5) / max(fwidth(c), vec2(1e-4)); return 1.0 - min(min(g.x, g.y), 1.0); }
      void main() {
        float minor = lines(vP.xz, uCell), major = lines(vP.xz, uCell * 5.0);
        float fade = smoothstep(uFar, 1.5, length(vP.xz));
        float front = smoothstep(0.0, 0.4, vP.z);              // only IN FRONT of the panels (a ledge they hover over) — never behind their glass, where it would cross their text
        float a = max(minor * 0.55, major) * fade * front * uAlpha;
        if (a < 0.004) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
  })
  const m = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat)
  m.rotation.x = -Math.PI / 2
  m.position.set(0, y, -10)
  m.renderOrder = -10                    // under every panel
  m.name = 'floor'
  return m
}

function build(keepPose: StageCameraPose | null) {
  const el = host.value!
  const L = look()
  const theme = props.theme
  stage = new CathodeStage3D({
    container: el, transparent: true,
    controls: (camera, dom) => { const c = new OrbitControls(camera, dom); c.enableDamping = true; c.minDistance = 0.4; c.maxDistance = 16; c.zoomSpeed = 0.9; return c as unknown as StageControls },
    cameraPosition: [0, 0, 6],
    displayMenu: { colors: L.menu },
    barStyle: 'cockpit', barColors: L.bars,
    onPanelActivate: (id) => { const p = stage!.facingPose(id, { margin: 0.04 }); if (p) void stage!.flyTo(p, 650) },
    onPanelControl: (id, control) => {
      const p = stage!.panels.get(id)!
      if (control === 'info') { openAbout(id as PanelId); return }                                  // ⓘ: a POP-UP joins the wall in free space, and the camera zooms to it
      if (control === 'minimize') { stage!.setPanelMinimized(id, !p.minimized); return }
      if (control === 'close') { void stage!.closePanel(id); return }                              // ✕: it goes, and the view you had comes back
      void stage!.toggleExpand(id)                                                                 // □: expand (fly in to fill the view) — or, when expanded, restore the view from before
    },
  })
  const panelLook = { curvature: L.panel.curvature, scanlines: L.panel.scanlines, vignette: false }
  const glow = L.panel.glow
  const ppu = stage.pxPerUnit
  const at = (id: PanelId) => { const r = LAYOUT[id]; return [(r.x + r.w / 2 - TOTAL_W / 2) / ppu, -((r.y + BAR + r.h / 2) - TOTAL_H / 2) / ppu, 0] as [number, number, number] }
  const add = (id: PanelId, content: Parameters<CathodeStage3D['addPanel']>[0]['content'], extra: object = {}) =>
    stage!.addPanel({ id, title: LAYOUT[id].title, content, position: at(id), look: panelLook, glow, controls: ['info', 'minimize', 'maximize'], resizable: true, ...extra })

  add('trades', gridContent({ width: LAYOUT.trades.w, height: LAYOUT.trades.h, theme, rowData: trades, columnDefs: [
    { field: 'id', headerName: 'ID', width: 60, sortable: true }, { field: 'product', headerName: 'Product', width: 130, sortable: true, filter: true },
    { field: 'side', headerName: 'Side', width: 90, sortable: true },
    { field: 'pnl', headerName: 'P&L %', width: 110, sortable: true, cellStyle: (p: { value: number }) => ({ color: p.value >= 0 ? L.up : L.down }) },
    { field: 'size', headerName: 'Size', width: 100, sortable: true },
  ], rowHeight: 24 }))
  add('candle', candleContent({ width: LAYOUT.candle.w, height: LAYOUT.candle.h, candles: series, overlays, markers, theme }))
  gaugeRef = gaugeContent({ width: LAYOUT.tilt.w, height: LAYOUT.tilt.h, theme, value: 0.62, min: -1, max: 1, stance: 'net long', sub: '5 long · 3 short · 9 flat', leftLabel: 'SHORT', rightLabel: 'LONG', sideLetters: ['S', 'L'],
    caption: 'tilt of the book', note: 'a gauge, in the same scene',
    items: [{ label: 'BTC', side: 'right', value: '+2.1%', tone: 'up' }, { label: 'ETH', side: 'right', value: '+0.8%', tone: 'up' }, { label: 'XRP', side: 'left', value: '−1.4%', tone: 'down' }] })
  add('tilt', gaugeRef)
  add('wall', candleWallContent({ width: LAYOUT.wall.w, height: LAYOUT.wall.h, cells: wallCells(9), theme }))
  add('log', logContent({ width: LAYOUT.log.w, height: LAYOUT.log.h, entries: logEntries, theme, formatTs: hhmm }))

  // the floor grid, just below the lowest panel
  floor = makeFloor(L.floor, L.floorAlpha, -(TOTAL_H / 2) / ppu - 0.12)
  stage.scene.add(floor)
  // start from the Overview (or where the camera was, when the theme was just switched)
  const start = keepPose ?? homePose()
  if (start) stage.setCameraPose(start)
  tiltTimer = setInterval(() => { const v = Math.round(Math.sin(Date.now() / 4000) * 90) / 100; gaugeRef?.update({ value: v, stance: v >= 0 ? 'net long' : 'net short' }) }, 2500)   // (rounded: the read-out prints the value as given)
  ;(window as unknown as Record<string, unknown>).__ws3d = { stage, overview, recenter, tour, stopTour, openAbout, get floor() { return floor }, theme: () => props.theme, layout: LAYOUT, setCaption: (t: string) => { caption.value = t },
    setTilt: (v: number) => { if (tiltTimer) clearInterval(tiltTimer); tiltTimer = null; gaugeRef?.update({ value: v, stance: v >= 0 ? 'net long' : 'net short' }) } }   // (tests + tools/capture-workspace.mjs drive the scene through it)
}

function teardown() { if (tiltTimer) clearInterval(tiltTimer); tiltTimer = null; if (floor) { floor.geometry.dispose(); (floor.material as THREE.Material).dispose() } floor = null; stage?.dispose(); stage = null; gaugeRef = null }

// ⓘ on a panel: what it is — a POP-UP that joins the wall in a free spot beside it (never over another panel), then the camera zooms to it; □ on the pop-up flies back, ✕ closes it
const INFO: Record<PanelId, string[]> = {
  trades: ['A sortable, filterable canvas grid.', 'Click a header to sort; the funnel opens a filter you type into — there is no DOM input in 3D.', 'Rows are real data: select, copy as TSV, double-click to open.'],
  candle: ['A three.js candlestick chart.', 'Wheel zooms the series, drag pans, hover shows the crosshair and the OHLCV strip.', 'Overlays (Bollinger band, SMA50), a live price line and trade markers.'],
  tilt: ['A bipolar gauge.', 'The needle eases to each new reading; the figure and stance follow it.'],
  wall: ['A wall of mini charts drawn into ONE surface.', 'Hover rings a card, a click reports it, the wheel scrolls the wall.', 'Open positions are framed, with their P&L and entry line.'],
  log: ['A scrolling console.', 'Follows the tail until you scroll up; select and copy lines.'],
}
function openAbout(id: PanelId) {
  if (!stage) return
  const pid = `about-${id}`
  if (stage.panels.has(pid)) { void stage.expand(pid); return }          // already open: just fly to it
  const L = look()
  const entries: LogEntry[] = INFO[id].map((text) => ({ text, level: 'info' as const }))
  const content = logContent({ width: 520, height: 220, entries, theme: props.theme, showTimestamps: false })
  content.model.setScroll(0)
  stage.addPopup({ id: pid, title: `About — ${LAYOUT[id].title}`, content, look: { curvature: L.panel.curvature, scanlines: L.panel.scanlines, vignette: false }, glow: L.panel.glow, resizable: true }, { near: id })
}

// ── the zoom controls
/** the Overview pose: every panel in frame, sitting a little high in the view so the floor grid shows beneath the workspace */
function homePose(): StageCameraPose | null {
  const p = stage?.framePose(undefined, { margin: 0.12 })
  if (!p) return null
  const DROP = 0.17                                    // world units: the camera (and its look-at point) move DOWN, so the panels move UP the screen
  return { position: [p.position[0], p.position[1] - DROP, p.position[2]], target: [p.target[0], p.target[1] - DROP, p.target[2]] }
}
/** zoom the whole workspace OUT until every panel is in frame */
function overview() { const p = homePose(); if (p) void stage!.flyTo(p, 800) }
/** back to the start: the overview, level and centred */
function recenter() { if (stage?.expandedId) void stage.unexpand(); else overview() }
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

/** the Theme drop-down changed: rebuild the scene in the new look, keeping the camera where it is */
watch(() => props.theme, () => { if (!stage) return; const pose = stage.getCameraPose(); stopTour(); teardown(); build(pose) })

onMounted(() => { build(null) })
onBeforeUnmount(() => { tourToken++; teardown(); delete (window as unknown as Record<string, unknown>).__ws3d })
</script>

<template>
  <div class="ws3d" :class="`t-${theme}`" :style="rootStyle()" data-testid="ws3d">
    <div ref="host" class="ws3d-stage" />
    <div class="ws3d-bar">
      <span class="ws3d-title">3D workspace</span>
      <button class="ws3d-btn" title="Zoom the whole workspace out until every panel is in frame" @click="overview">Overview</button>
      <button class="ws3d-btn" title="Fly back to the start" @click="recenter">Recenter</button>
      <button class="ws3d-btn" :class="{ on: touring }" title="Play a short zoom-in / zoom-out tour" @click="tour">{{ touring ? '■ Stop' : '▶ Tour' }}</button>
    </div>
    <div v-if="caption" class="ws3d-caption" role="status">{{ caption }}</div>
    <div class="ws3d-hint">scroll to <b>zoom</b> · drag to <b>orbit</b> · <b>□</b> expands a panel (and flies back) · <b>ⓘ</b> opens a pop-up beside it · double-click a title bar to face it · right-click a panel for its display menu · the look follows the Theme menu</div>
  </div>
</template>

<style scoped>
.ws3d { position: relative; width: 100%; height: 100%; min-height: 520px; overflow: hidden; background: var(--bg); }
/* a faint dot grid on the backdrop, so the scene reads as a space behind the floor */
.ws3d::before { content: ''; position: absolute; inset: 0; pointer-events: none; background-size: 34px 34px; opacity: 0.5; background-image: radial-gradient(circle, var(--dot) 1px, transparent 1.4px); }
.ws3d-stage { position: absolute; inset: 0; }
.ws3d-bar { position: absolute; top: 10px; left: 12px; right: 12px; display: flex; gap: 6px; align-items: center; pointer-events: none; }
.ws3d-bar > * { pointer-events: auto; }
.ws3d-title { font: 700 11px ui-monospace, monospace; letter-spacing: 0.14em; text-transform: uppercase; margin-right: 8px; color: var(--ink); }
.ws3d-btn { font: 600 11px ui-monospace, monospace; padding: 5px 11px; border-radius: 4px; cursor: pointer; border: 1px solid var(--btn-border); background: var(--btn-bg); color: var(--btn-ink); }
.ws3d-btn:hover, .ws3d-btn.on { color: var(--btn-hover-ink); background: var(--ink); border-color: var(--ink); }
.ws3d-caption { position: absolute; left: 50%; bottom: 46px; transform: translateX(-50%); font: 700 14px ui-monospace, monospace; padding: 8px 16px; border-radius: 6px; pointer-events: none; white-space: nowrap; background: var(--cap-bg); color: var(--cap-ink); }
.ws3d-hint { position: absolute; left: 12px; right: 12px; bottom: 10px; text-align: center; font: 11px ui-monospace, monospace; pointer-events: none; color: var(--hint); }
</style>
