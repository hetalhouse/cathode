/**
 * DisplayMenu3D — the right-click "Display" menu, drawn IN the scene.
 *
 * A stage panel's CRT look (scan lines, glow, the hover magnifier, the screen bend) is a handful of switches; this is the menu that flips them,
 * as a small canvas-textured quad that sits on the panel's own plane, a hair in front of it, so it bends, tilts and orbits with the panel
 * instead of floating over the page as DOM. It owns the drawing, the layout and the hit-testing; the stage owns when it opens and what a row does.
 */
import * as THREE from 'three'

/** what the menu switches on a panel */
export interface PanelDisplay { curvature: number; scanlines: boolean; glow: boolean; magnify: boolean }

export type MenuRow = 'scanlines' | 'glow' | 'magnify' | 'curve-' | 'curve+'

export interface MenuColors {
  bg: string; border: string; text: string; muted: string; accent: string; hover: string; divider: string
}
export const DEFAULT_MENU_COLORS: MenuColors = {
  bg: '#0d1520', border: '#2a3a50', text: '#c0d0e0', muted: '#6a7f96', accent: '#40a0f0', hover: 'rgba(255,255,255,0.07)', divider: '#1e2a3a',
}

/** the bend range and step (the 2D menu's: -40 concave … 40 convex, 2 per press) */
export const CURVE_MIN = -40, CURVE_MAX = 40, CURVE_STEP = 2

const W = 188, HEAD_H = 26, ROW_H = 24, CURVE_H = 30, HINT_H = 24
const H = HEAD_H + ROW_H * 3 + CURVE_H + HINT_H
const FONT = '11px system-ui, -apple-system, sans-serif'
// the bend buttons: BTN x BTN boxes at the row's right edge, the value between them
const BTN = 22, BTN_PAD = 10

export class DisplayMenu3D {
  readonly mesh: THREE.Mesh
  panel: import('./CathodeStage3D').Panel3D | null = null
  private canvas = document.createElement('canvas')
  private texture: THREE.CanvasTexture
  private colors: MenuColors
  private display: PanelDisplay = { curvature: 0, scanlines: false, glow: false, magnify: false }
  private hover: MenuRow | null = null

  constructor(private ppu: number, colors: Partial<MenuColors> = {}) {
    this.colors = { ...DEFAULT_MENU_COLORS, ...colors }
    const d = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(W * d); this.canvas.height = Math.round(H * d)
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.colorSpace = THREE.SRGBColorSpace
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(W / ppu, H / ppu),
      new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }),
    )
    this.mesh.renderOrder = 1_000_000          // above every panel, whoever was raised last
    this.mesh.visible = false
  }

  get isOpen() { return !!this.panel }
  static readonly width = W
  static readonly height = H

  setColors(c: Partial<MenuColors>) { this.colors = { ...this.colors, ...c }; if (this.panel) this.draw() }

  /** open on `panel`, with its top-left corner at (x, y) in the panel's BODY px (clamped to stay inside the body) */
  open(panel: import('./CathodeStage3D').Panel3D, x: number, y: number, display: PanelDisplay) {
    this.close()
    this.panel = panel
    this.display = { ...display }
    this.hover = null
    const bw = panel.content.width, bh = panel.content.height
    const cx = Math.max(4, Math.min(x, bw - W - 4)), cy = Math.max(4, Math.min(y, bh - H - 4))
    this.mesh.position.set((cx + W / 2 - bw / 2) / this.ppu, (bh / 2 - (cy + H / 2)) / this.ppu, 0.02)
    panel.group.add(this.mesh)
    this.mesh.visible = true
    this.draw()
  }

  close() {
    if (!this.panel) return
    this.panel.group.remove(this.mesh)
    this.mesh.visible = false
    this.panel = null
    this.hover = null
  }

  update(display: PanelDisplay) { this.display = { ...display }; this.draw() }
  setHover(row: MenuRow | null) { if (row !== this.hover) { this.hover = row; this.draw() } }

  /** the row under a point of the menu's own UV (y up), or null (header, divider, hint) */
  rowAtUV(u: number, v: number): MenuRow | null {
    const x = u * W, y = (1 - v) * H
    const y0 = y - HEAD_H
    if (y0 < 0) return null
    if (y0 < ROW_H * 3) return (['scanlines', 'glow', 'magnify'] as const)[Math.floor(y0 / ROW_H)]
    const yc = y0 - ROW_H * 3
    if (yc < CURVE_H) {
      if (x >= W - BTN_PAD - BTN) return 'curve+'
      if (x >= W - BTN_PAD - BTN - 54 - BTN && x < W - BTN_PAD - BTN - 54) return 'curve-'
    }
    return null
  }

  /** the CENTRE of a row in the menu's own px (for tests / tours) */
  static rowCentre(row: MenuRow): { x: number; y: number } {
    switch (row) {
      case 'scanlines': return { x: 90, y: HEAD_H + ROW_H * 0.5 }
      case 'glow':      return { x: 90, y: HEAD_H + ROW_H * 1.5 }
      case 'magnify':   return { x: 90, y: HEAD_H + ROW_H * 2.5 }
      case 'curve-':    return { x: W - BTN_PAD - BTN - 54 - BTN / 2, y: HEAD_H + ROW_H * 3 + CURVE_H / 2 }
      case 'curve+':    return { x: W - BTN_PAD - BTN / 2, y: HEAD_H + ROW_H * 3 + CURVE_H / 2 }
    }
  }

  private draw() {
    const d = Math.min(window.devicePixelRatio || 1, 2), c = this.colors
    const ctx = this.canvas.getContext('2d')!
    ctx.setTransform(d, 0, 0, d, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = c.bg; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
    ctx.textBaseline = 'middle'

    // header: DISPLAY ........ curve: N
    ctx.fillStyle = c.muted; ctx.font = 'bold 9px system-ui, -apple-system, sans-serif'
    ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '1px'
    ctx.textAlign = 'left'; ctx.fillText('DISPLAY', 10, HEAD_H / 2)
    ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '0px'
    ctx.font = '9px system-ui, -apple-system, sans-serif'; ctx.textAlign = 'right'
    ctx.fillText(`curve: ${this.display.curvature}`, W - 10, HEAD_H / 2)
    ctx.strokeStyle = c.divider; ctx.beginPath(); ctx.moveTo(0, HEAD_H - 0.5); ctx.lineTo(W, HEAD_H - 0.5); ctx.stroke()

    // the three switches: a box, a check when on, a label
    const rows: [MenuRow, string, boolean][] = [
      ['scanlines', 'Scan lines', this.display.scanlines], ['glow', 'Glow', this.display.glow], ['magnify', 'Magnify (hover lens)', this.display.magnify],
    ]
    rows.forEach(([row, label, on], i) => {
      const y = HEAD_H + i * ROW_H
      if (this.hover === row) { ctx.fillStyle = c.hover; ctx.fillRect(1, y, W - 2, ROW_H) }
      const bx = 10, by = y + (ROW_H - 12) / 2
      ctx.strokeStyle = on ? c.accent : c.muted; ctx.lineWidth = 1.2; ctx.strokeRect(bx + 0.5, by + 0.5, 11, 11)
      if (on) { ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx + 3, by + 6.5); ctx.lineTo(bx + 5.5, by + 9); ctx.lineTo(bx + 9.5, by + 3.5); ctx.stroke() }
      ctx.fillStyle = c.text; ctx.font = FONT; ctx.textAlign = 'left'; ctx.fillText(label, 30, y + ROW_H / 2)
    })

    // the bend stepper:  Bend ..... [-]  -12  [+]
    const yc = HEAD_H + ROW_H * 3
    ctx.strokeStyle = c.divider; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, yc + 0.5); ctx.lineTo(W, yc + 0.5); ctx.stroke()
    ctx.fillStyle = c.text; ctx.font = FONT; ctx.textAlign = 'left'; ctx.fillText('Bend', 10, yc + CURVE_H / 2)
    const btn = (row: 'curve-' | 'curve+', x: number, plus: boolean) => {
      const by = yc + (CURVE_H - BTN) / 2
      if (this.hover === row) { ctx.fillStyle = c.hover; ctx.fillRect(x, by, BTN, BTN) }
      ctx.strokeStyle = this.hover === row ? c.accent : c.border; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, by + 0.5, BTN - 1, BTN - 1)
      ctx.strokeStyle = c.text; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath()
      ctx.moveTo(x + 6, by + BTN / 2); ctx.lineTo(x + BTN - 6, by + BTN / 2)
      if (plus) { ctx.moveTo(x + BTN / 2, by + 6); ctx.lineTo(x + BTN / 2, by + BTN - 6) }
      ctx.stroke()
    }
    const xPlus = W - BTN_PAD - BTN, xMinus = xPlus - 54 - BTN
    btn('curve-', xMinus, false); btn('curve+', xPlus, true)
    ctx.fillStyle = c.text; ctx.font = FONT; ctx.textAlign = 'center'; ctx.fillText(String(this.display.curvature), xMinus + BTN + 27, yc + CURVE_H / 2)

    // hint
    ctx.strokeStyle = c.divider; ctx.beginPath(); ctx.moveTo(0, yc + CURVE_H + 0.5); ctx.lineTo(W, yc + CURVE_H + 0.5); ctx.stroke()
    ctx.fillStyle = c.muted; ctx.font = '9px system-ui, -apple-system, sans-serif'; ctx.textAlign = 'left'
    ctx.fillText('Cmd+Shift +/−  bends the hovered panel', 10, yc + CURVE_H + HINT_H / 2)

    this.texture.needsUpdate = true
    this.panel?.invalidate()
  }

  dispose() {
    this.close()
    this.mesh.geometry.dispose(); (this.mesh.material as THREE.MeshBasicMaterial).dispose(); this.texture.dispose()
  }
}
