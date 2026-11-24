/**
 * CathodeStage3D — many cathode panels in ONE three.js scene.
 *
 * Every DOM widget builds its own WebGLRenderer and sits in a CSS window; the stage replaces
 * that with a single renderer + perspective camera and a Panel3D per CathodeSurface:
 *
 *   • one renderer, so no ~16-context browser cap, and panels can overlap, tilt and recede;
 *   • input by raycast: a pointer hit's UV goes through CathodeSurface.contentPoint() (the CPU
 *     mirror of the CRT warp) into the panel's content, in the painter's own logical px;
 *   • drag-to-move by ray–plane intersection on the panel's own plane, via a title bar;
 *   • focus: the pressed panel takes keyboard focus and is raised (renderOrder).
 *
 * The stage owns no widget logic — a panel's PanelContent (see panelContent.ts) says what it
 * draws and what pointer/keys mean. Rendering is on demand: nothing draws until something
 * invalidates (a repaint, a camera move, a drag).
 *
 * Camera control is injected (`controls`) so the library doesn't bundle three/addons — pass
 * `(camera, el) => new OrbitControls(camera, el)`.
 *
 * OVERLAY MODE — a stage laid over ANOTHER three.js scene (a dashboard's market scape) instead of
 * owning the whole view:
 *   • `transparent` — an alpha canvas, nothing painted where no panel is;
 *   • `setCameraPose()` — the host drives the camera, so panels sit in the same 3D space as the
 *     scene beneath (match `fov` / `near` / `far` to that scene's camera);
 *   • `passThrough` — the canvas takes no pointer events. The stage listens on `inputTarget`
 *     (capture phase, `document` by default) and picks panels by raycast: a press, click or wheel
 *     over a panel is handled here and stopped; anywhere else it falls through untouched to the
 *     scene below (its orbit, its plane clicks). `shouldHandle(target)` lets the host exclude
 *     events that landed on DOM stacked ABOVE the stage (a window over a panel). Keys go to the
 *     focused panel via `window`, except while typing in an input.
 */
import * as THREE from 'three'
import type { SurfaceLook } from './CathodeSurface'
import type { PanelContent, PanelPointerEvent, PanelPointerKind } from './panelContent'
import { DisplayMenu3D, CURVE_MIN, CURVE_MAX, CURVE_STEP } from './stageMenu'
import type { PanelDisplay, MenuRow, MenuColors } from './stageMenu'
export type { PanelDisplay, MenuColors, MenuRow }

export interface StageControls {
  enabled: boolean
  /** OrbitControls' pivot — kept in step with the camera when the host / flyTo moves it */
  target?: { set(x: number, y: number, z: number): unknown }
  update(): void
  dispose(): void
  addEventListener(type: 'change', listener: () => void): void
}

export interface CathodeStage3DOptions {
  /** the element the stage's canvas fills */
  container: HTMLElement
  /** e.g. (camera, el) => new OrbitControls(camera, el) — omit for a fixed camera */
  controls?: (camera: THREE.PerspectiveCamera, el: HTMLElement) => StageControls
  background?: number
  /** an alpha canvas — nothing is painted where there is no panel (a stage over another scene) */
  transparent?: boolean
  /** world units are `pxPerUnit` logical px of a panel (default 360) */
  pxPerUnit?: number
  cameraPosition?: [number, number, number]
  /** camera intrinsics — match them to the scene the stage is laid over (defaults 45 / 0.05 / 100) */
  fov?: number
  near?: number
  far?: number
  /**
   * The canvas takes no pointer events; input is picked by raycast on `inputTarget` instead and
   * only what lands on a panel is consumed. See the overlay-mode note above.
   */
  passThrough?: boolean
  /** where passThrough listens (capture phase). Default: `document`. */
  inputTarget?: Document | HTMLElement
  /** passThrough: return false for events that landed on DOM stacked above the stage */
  shouldHandle?: (target: EventTarget | null) => boolean
  /** cursor changes (default: set on the canvas, which passThrough makes invisible — route it to the host) */
  onCursor?: (cursor: string) => void
  onFocus?: (id: string | null) => void
  onPanelMoved?: (id: string, pos: { x: number; y: number; z: number }) => void
  /** a panel's title bar was double-clicked (typically: face / fly to it — see facingPose) */
  onPanelActivate?: (id: string) => void
  /**
   * A title-bar control was clicked. The stage does NOT act on it — what "minimize" / "maximize" mean is the host's call
   * (minimize usually: stage.setPanelMinimized(id, !panel.minimized); maximize: fly the camera to fill the view, and back).
   */
  onPanelControl?: (id: string, control: PanelControl) => void
  /** a title-bar action button was clicked (see PanelOptions.actions) */
  onPanelAction?: (id: string, action: string) => void
  /**
   * A right-click on a panel opens a "Display" menu drawn IN the scene — Scan lines · Glow · Magnify (hover lens) · a Bend stepper — and Cmd+Shift +/- bends
   * the hovered panel. `true` or `{ colors }` (the menu's palette). The stage applies each change to the panel at once; `onPanelDisplay` lets the host persist it.
   */
  displayMenu?: boolean | { colors?: Partial<MenuColors> }
  /** the title bars' palette (default: the green-on-black bar) and style; both can be changed live (setBarColors / setBarStyle) */
  barColors?: Partial<BarColors>
  barStyle?: BarStyle
  /** a panel's display (bend / scan lines / glow / magnify) was changed through the menu or the bend shortcut: the full new state */
  onPanelDisplay?: (id: string, display: PanelDisplay) => void
  /** a panel was resized by dragging its corner (once, on release): its new size in logical px and its new centre (the top-left corner stays put) */
  onPanelResized?: (id: string, size: { w: number; h: number }, pos: { x: number; y: number; z: number }) => void
}

/** a title-bar control: the stage draws it, hit-tests it and reports clicks (onPanelControl) */
export type PanelControl = 'minimize' | 'maximize' | 'close' | 'info'

/**
 * The title bar's palette (the stage's bars all wear it; `setBarColors` re-themes them live). The defaults are the original green-on-black bar.
 * `bg` / `bgFocused`: the bar's fill (resting / the focused panel's) · `line` / `lineFocused`: its 2px bottom rule · `text` / `textFocused`: the title and the control strokes ·
 * `box` / `boxFocused`: an action button's outline · `accent`: the hover / active fills and the status dot · `accentText`: an active action's label ·
 * `title` / `titleFocused`: the title text in the cockpit style (default: the same as `text` / `textFocused`).
 */
export interface BarColors {
  bg: string; bgFocused: string; line: string; lineFocused: string; text: string; textFocused: string
  box: string; boxFocused: string; accent: string; accentText: string; title?: string; titleFocused?: string
}
export const DEFAULT_BAR_COLORS: BarColors = {
  bg: '#08130e', bgFocused: '#0f2a1d', line: '#2f6b4c', lineFocused: '#6ee7a7', text: '#6fae8f', textFocused: '#b6f5d2',
  box: '#2f6b4c', boxFocused: '#3f8f6b', accent: '#6ee7a7', accentText: '#d5fbe6',
}
/** `plain` (default): the title as written, in 12px mono. `cockpit`: what the 2D windows' title bars look like — a status dot, then a small, bold, tracked UPPERCASE title. */
export type BarStyle = 'plain' | 'cockpit'

/**
 * A title-bar ACTION: a small text button (a range picker's "1H", a tab) drawn left of the controls, with an `active` state. The stage hit-tests it
 * and reports a click as onPanelAction(panelId, action.id); what it does — and which one is active — is the host's call (panel.setActions()).
 */
export interface PanelAction { id: string; label: string; active?: boolean }

/** A camera pose in world space (what an external driver — another scene's camera — sets). */
export interface StageCameraPose {
  position: [number, number, number]
  target:   [number, number, number]
}

export interface PanelOptions {
  id: string
  title?: string
  content: PanelContent
  position?: [number, number, number]
  rotationY?: number
  look?: Partial<SurfaceLook>
  glow?: boolean
  /** default true; a hidden panel isn't drawn, picked or painted */
  visible?: boolean
  /** title-bar controls, drawn left → right at the bar's right edge (default none). 'close' is an ✕ — what it closes is the host's call (onPanelControl). */
  controls?: PanelControl[]
  /** title-bar action buttons (text), drawn left of the controls (default none); change them with panel.setActions() */
  actions?: PanelAction[]
  /** start collapsed to its title bar */
  minimized?: boolean
  /** a corner handle drags the panel to a new size (needs `content.resize`); default false */
  resizable?: boolean
  /** resize limits in logical px (default 240x160 .. 1600x1000) */
  minSize?: { w: number; h: number }
  maxSize?: { w: number; h: number }
}

export interface PanelLayout { x: number; y: number; z: number; rotY: number; visible?: boolean; minimized?: boolean; size?: { w: number; h: number } }

export interface StagePick {
  panel: Panel3D
  part:  'body' | 'bar'
  /** content px in the panel's logical px; null over the bezel / on the bar */
  content: { x: number; y: number } | null
  /** on the bar: the title-bar control under the pointer, if any */
  control: PanelControl | null
  /** on the bar: the action button under the pointer (its id), if any */
  action: string | null
  /** on the body: the pointer is over the resize handle (the bottom-right corner of a resizable panel) */
  handle: boolean
  /** the raycast hit's UV on the plane (0..1, y up) */
  uv: { x: number; y: number } | null
}

const BAR_PX = 26
// title-bar controls: BTN_W x BTN_H boxes, BTN_GAP apart, BAR_PAD in from the bar's right edge
const BTN_W = 20, BTN_H = 18, BTN_GAP = 4, BAR_PAD = 8
// the resize handle: a HANDLE_PX square at the body's bottom-right corner (geometric — hit-tested on the plane's UV, so a bend can't move it)
const HANDLE_PX = 16
// title-bar actions: text buttons (mono ACTION_FONT), ACTION_GAP apart
const ACTION_FONT = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', ACTION_GAP = 4
const DEFAULT_MIN = { w: 240, h: 160 }, DEFAULT_MAX = { w: 1600, h: 1000 }

/** One panel: a surface mesh + a title bar, in a group the stage moves around. */
export class Panel3D {
  readonly id: string
  readonly content: PanelContent
  readonly group = new THREE.Group()
  readonly body: THREE.Mesh
  readonly bar: THREE.Mesh
  glow: boolean
  private _display: PanelDisplay = { curvature: 0, scanlines: true, glow: true, magnify: false }
  dirty = true
  barDirty = true

  private _title: string
  readonly controls: PanelControl[]
  readonly resizable: boolean
  readonly minSize: { w: number; h: number }
  readonly maxSize: { w: number; h: number }
  private _grip: THREE.Mesh | null = null
  /** the corner grip (only on a resizable panel) */
  get grip(): THREE.Mesh | null { return this._grip }
  private _minimized = false
  private _maximized = false
  private hoverControl: PanelControl | null = null
  private hoverAction: string | null = null
  private _actions: PanelAction[] = []
  private barCanvas = document.createElement('canvas')
  private barTexture: THREE.CanvasTexture

  constructor(readonly stage: CathodeStage3D, o: PanelOptions) {
    this.id      = o.id
    this._title  = o.title ?? o.id
    this.controls = o.controls ?? []
    this._actions = (o.actions ?? []).map((a) => ({ ...a }))
    this.content = o.content
    this.resizable = !!o.resizable && typeof o.content.resize === 'function'
    this.minSize = o.minSize ?? DEFAULT_MIN
    this.maxSize = o.maxSize ?? DEFAULT_MAX
    this.glow    = o.glow ?? true
    const s = o.content.surface
    if (s.mode !== 'world') throw new Error("CathodeStage3D panels need a CathodeSurface created with mode: 'world'")

    const ppu = stage.pxPerUnit
    const w = o.content.width / ppu, h = o.content.height / ppu, bh = BAR_PX / ppu
    this.body = new THREE.Mesh(new THREE.PlaneGeometry(w, h), s.material)
    this.barTexture = new THREE.CanvasTexture(this.barCanvas)
    this.barTexture.colorSpace = THREE.SRGBColorSpace
    this.bar = new THREE.Mesh(
      new THREE.PlaneGeometry(w, bh),
      new THREE.MeshBasicMaterial({ map: this.barTexture, toneMapped: false }),
    )
    this.bar.position.y = h / 2 + bh / 2
    this.group.add(this.body, this.bar)
    this.body.userData.panel = this
    this.bar.userData.panel  = this

    if (this.resizable) {
      const g = HANDLE_PX / ppu
      const gc = document.createElement('canvas'); gc.width = gc.height = 32
      const gx = gc.getContext('2d')!
      gx.strokeStyle = '#6ee7a7'; gx.lineWidth = 3; gx.lineCap = 'round'
      gx.beginPath(); for (const k of [10, 18, 26]) { gx.moveTo(30, k); gx.lineTo(k, 30) } gx.stroke()   // three diagonal ticks
      const gt = new THREE.CanvasTexture(gc); gt.colorSpace = THREE.SRGBColorSpace
      this._grip = new THREE.Mesh(
        new THREE.PlaneGeometry(g, g),
        new THREE.MeshBasicMaterial({ map: gt, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false }),
      )
      this.group.add(this._grip)
      this.placeGrip()
    }
    if (o.visible === false) this.group.visible = false
    if (o.minimized) { this._minimized = true; this.body.visible = false }
    if (o.position) this.group.position.set(...o.position)
    this.group.rotation.y = o.rotationY ?? 0
    if (o.look) s.setLook(o.look)
    this._display = { curvature: o.look?.curvature ?? 0, scanlines: o.look?.scanlines ?? true, glow: this.glow, magnify: o.look?.magnify ?? false }

    s.resize(o.content.width, o.content.height, window.devicePixelRatio || 1)
    o.content.attach?.(() => this.invalidate())
  }

  /** the title bar's text */
  get title(): string { return this._title }

  /** Change the title bar's text (e.g. a live count: "Open positions (6)"). Repaints only the bar, and only if it changed. */
  setTitle(title: string) {
    if (title === this._title) return
    this._title = title
    this.invalidateBar()
  }

  private placeGrip() {
    if (!this.grip) return
    const ppu = this.stage.pxPerUnit
    this.grip.position.set((this.content.width - HANDLE_PX) / 2 / ppu, -(this.content.height - HANDLE_PX) / 2 / ppu, 0.003)
    this.grip.visible = !this._minimized
  }

  /** @internal the stage brightens the grip while the pointer is over the handle */
  setHoverGrip(on: boolean) {
    if (!this.grip) return
    ;(this.grip.material as THREE.MeshBasicMaterial).opacity = on ? 1 : 0.55
    this.stage.invalidate()
  }

  /**
   * Resize to `w` x `h` logical px (clamped to minSize / maxSize): the content lays out for the new size, the surface's backing
   * store follows, and the body / title bar / grip geometry is rebuilt. The panel's CENTRE stays where it is — the drag in the
   * stage moves it so the top-left corner stays put. No-op (false) for a panel that is not resizable.
   */
  resize(w: number, h: number): boolean {
    if (!this.resizable) return false
    w = Math.round(Math.min(this.maxSize.w, Math.max(this.minSize.w, w)))
    h = Math.round(Math.min(this.maxSize.h, Math.max(this.minSize.h, h)))
    if (w === this.content.width && h === this.content.height) return false
    this.content.resize!(w, h)
    this.content.surface.resize(w, h, window.devicePixelRatio || 1)
    const ppu = this.stage.pxPerUnit, bh = BAR_PX / ppu
    this.body.geometry.dispose(); this.body.geometry = new THREE.PlaneGeometry(w / ppu, h / ppu)
    this.bar.geometry.dispose();  this.bar.geometry  = new THREE.PlaneGeometry(w / ppu, bh)
    this.bar.position.y = h / ppu / 2 + bh / 2
    this.placeGrip()
    this.dirty = true; this.barDirty = true
    this.stage.invalidate()
    return true
  }

  get minimized(): boolean { return this._minimized }
  get maximized(): boolean { return this._maximized }

  /**
   * Collapse to the title bar (the body is hidden and no longer picked) / expand. Prefer stage.setPanelMinimized(),
   * which also releases hover / press on the body.
   */
  setMinimized(v: boolean) {
    if (this._minimized === v) return
    this._minimized = v
    this.body.visible = !v
    if (this.grip) this.grip.visible = !v
    this.invalidateBar()                // the control's glyph changes
    if (!v) this.invalidate()           // repaint what changed while it was collapsed
  }

  /** The maximize control's glyph state (a maximized panel shows "restore"). A visual flag only — what maximized MEANS is the host's. */
  setMaximized(v: boolean) {
    if (this._maximized === v) return
    this._maximized = v
    this.invalidateBar()
  }

  /** @internal the stage lights the control under the pointer */
  setHoverControl(c: PanelControl | null, a: string | null = null) {
    if (this.hoverControl === c && this.hoverAction === a) return
    this.hoverControl = c
    this.hoverAction = a
    this.invalidateBar()
  }

  /** the title bar's action buttons */
  get actions(): PanelAction[] { return this._actions.map((a) => ({ ...a })) }

  /** replace the action buttons (e.g. move the `active` mark); repaints the bar only if something changed */
  setActions(actions: PanelAction[]) {
    const same = actions.length === this._actions.length && actions.every((a, i) => a.id === this._actions[i].id && a.label === this._actions[i].label && !!a.active === !!this._actions[i].active)
    if (same) return
    this._actions = actions.map((a) => ({ ...a }))
    this.invalidateBar()
  }

  /** where the controls start (their left edge), in the bar's px */
  private controlsLeft(): number {
    return this.controls.length ? this.content.width - BAR_PAD - this.controls.length * (BTN_W + BTN_GAP) + BTN_GAP : this.content.width - BAR_PAD
  }

  /** the action buttons' rectangles in the bar's px (right-aligned, just left of the controls) */
  actionRects(): { id: string; x: number; y: number; w: number; h: number }[] {
    if (!this._actions.length) return []
    const ctx = this.barCanvas.getContext('2d')!
    ctx.font = ACTION_FONT
    const widths = this._actions.map((a) => Math.ceil(ctx.measureText(a.label).width) + 14)
    const total = widths.reduce((t, w) => t + w, 0) + (widths.length - 1) * ACTION_GAP
    let x = this.controlsLeft() - 10 - total
    return this._actions.map((a, i) => { const r = { id: a.id, x, y: (BAR_PX - BTN_H) / 2 - 1, w: widths[i], h: BTN_H }; x += widths[i] + ACTION_GAP; return r })
  }

  controlRect(c: PanelControl): { x: number; y: number; w: number; h: number } | null {
    const i = this.controls.indexOf(c)
    if (i < 0) return null
    const n = this.controls.length
    return { x: this.content.width - BAR_PAD - (n - i) * BTN_W - (n - 1 - i) * BTN_GAP, y: (BAR_PX - BTN_H) / 2 - 1, w: BTN_W, h: BTN_H }
  }

  /** The control at a point in the title bar's px, or null. */
  controlAt(px: number, py: number): PanelControl | null {
    for (const c of this.controls) {
      const r = this.controlRect(c)!
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return c
    }
    return null
  }

  /** The action button (its id) at a point in the title bar's px, or null. */
  actionAt(px: number, py: number): string | null {
    for (const r of this.actionRects()) if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return r.id
    return null
  }

  get visible(): boolean { return this.group.visible }

  /** Show / hide. Prefer stage.setPanelVisible(), which also releases focus / hover / drag. */
  setVisible(v: boolean) {
    if (this.group.visible === v) return
    this.group.visible = v
    if (v) this.invalidate()          // repaint what changed while it was away
    else this.stage.invalidate()
  }

  /** Repaint the surface on the next frame (and render it). */
  invalidate() { this.dirty = true; this.stage.invalidate() }
  invalidateBar() { this.barDirty = true; this.stage.invalidate() }

  setLook(look: Partial<SurfaceLook>) {
    this.content.surface.setLook(look)
    const d = this._display
    if (look.curvature !== undefined) d.curvature = look.curvature
    if (look.scanlines !== undefined) d.scanlines = look.scanlines
    if (look.magnify !== undefined) d.magnify = look.magnify
    this.invalidate()
  }

  /** the panel's display switches: bend, scan lines, glow, the hover magnifier */
  get display(): PanelDisplay { return { ...this._display } }

  /** change any of the display switches (what the Display menu does); a turned-off magnifier lets go of the lens */
  setDisplay(d: Partial<PanelDisplay>) {
    this._display = { ...this._display, ...d }
    const n = this._display
    this.content.surface.setLook({ curvature: n.curvature, scanlines: n.scanlines, magnify: n.magnify })
    this.glow = n.glow
    if (!n.magnify) this.content.surface.setLens(null)
    this.invalidate()
  }
  setPosition(x: number, y: number, z: number) { this.group.position.set(x, y, z); this.stage.invalidate() }
  setRotationY(r: number) { this.group.rotation.y = r; this.stage.invalidate() }

  /** @internal called by the stage's frame */
  paintIfDirty() {
    if (!this.group.visible) return   // stays dirty — repainted when it comes back
    const s = this.content.surface
    if (this.dirty) {
      s.syncUniforms()
      s.paint(this.glow)
      this.dirty = false
    }
    if (this.barDirty) { this.drawBar(); this.barDirty = false }
  }

  private drawBar() {
    const d  = Math.min(window.devicePixelRatio || 1, 2)
    const W  = this.content.width, H = BAR_PX
    const c  = this.barCanvas
    if (c.width !== Math.round(W * d) || c.height !== Math.round(H * d)) {
      c.width = Math.round(W * d); c.height = Math.round(H * d)
      this.barTexture.dispose()
      this.barTexture = new THREE.CanvasTexture(c)
      this.barTexture.colorSpace = THREE.SRGBColorSpace
      ;(this.bar.material as THREE.MeshBasicMaterial).map = this.barTexture
      ;(this.bar.material as THREE.MeshBasicMaterial).needsUpdate = true
    }
    const ctx = c.getContext('2d')!
    ctx.setTransform(d, 0, 0, d, 0, 0)
    const focused = this.stage.focusedId === this.id
    const bc = this.stage.barColors, cockpit = this.stage.barStyle === 'cockpit'
    ctx.fillStyle = focused ? bc.bgFocused : bc.bg
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = focused ? bc.lineFocused : bc.line
    ctx.fillRect(0, H - 2, W, 2)
    ctx.textBaseline = 'middle'
    // (the plain title's font is set BEFORE actionRects(), which measures in the 11px action font on this same context — so a plain title beside actions has always been drawn in 11px;
    // kept as is: the default bar is pinned pixel-for-pixel)
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    const ar = this.actionRects()
    // the cockpit title starts after a status dot (5px + 8px gap, as in the 2D title bar)
    const x0 = cockpit ? 23 : 10
    const room = ar.length ? ar[0].x - 8 - x0 : (this.controls.length ? W - 10 - (BAR_PAD + this.controls.length * (BTN_W + BTN_GAP)) - (x0 - 10) : W - 10 - x0)
    if (cockpit) {
      ctx.save(); ctx.fillStyle = bc.accent; ctx.shadowColor = bc.accent; ctx.shadowBlur = 4
      ctx.beginPath(); ctx.arc(12.5, H / 2 - 1, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      ctx.font = 'bold 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
      ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '1.26px'
      ctx.fillStyle = (focused ? bc.titleFocused : bc.title) ?? (focused ? bc.textFocused : bc.text)
      ctx.fillText(this._title.toUpperCase(), x0, H / 2 - 1, Math.max(20, room))
      ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '0px'
    } else {
      ctx.fillStyle = focused ? bc.textFocused : bc.text
      ctx.fillText(this._title, x0, H / 2 - 1, Math.max(20, room))   // a long title squeezes to fit instead of running off the bar / under the controls
    }
    this.drawActions(ctx, focused, ar)
    this.drawControls(ctx, focused)
    this.barTexture.needsUpdate = true
  }

  /** the title-bar action buttons: a small box with the label; the active one is filled */
  private drawActions(ctx: CanvasRenderingContext2D, focused: boolean, rects: { id: string; x: number; y: number; w: number; h: number }[]) {
    const bc = this.stage.barColors
    ctx.font = ACTION_FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    this._actions.forEach((a, i) => {
      const r = rects[i]
      if (a.active) this.fillAlpha(ctx, bc.accent, 0.28, r)
      else if (this.hoverAction === a.id) this.fillAlpha(ctx, bc.accent, 0.14, r)
      ctx.strokeStyle = a.active ? bc.accent : (focused ? bc.boxFocused : bc.box); ctx.lineWidth = 1
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1)
      ctx.fillStyle = a.active ? bc.accentText : (focused ? bc.textFocused : bc.text)
      ctx.fillText(a.label, r.x + r.w / 2, r.y + r.h / 2 + 0.5)
    })
    ctx.textAlign = 'left'
  }

  /** fill a rect with `color` at `alpha` (any CSS colour — a themed accent is not necessarily a hex) */
  private fillAlpha(ctx: CanvasRenderingContext2D, color: string, alpha: number, r: { x: number; y: number; w: number; h: number }) {
    const m = /^#([0-9a-f]{6})$/i.exec(color)
    if (m) {   // a hex colour becomes the same rgba() the bar always used (a globalAlpha fill rounds a unit differently — the default bar is pinned pixel-for-pixel)
      const n = parseInt(m[1], 16)
      ctx.fillStyle = `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
      ctx.fillRect(r.x, r.y, r.w, r.h)
      return
    }
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillRect(r.x, r.y, r.w, r.h); ctx.restore()
  }

  /** the title-bar controls: strokes, not font glyphs (a glyph can fall back to a font that does not have it) */
  private drawControls(ctx: CanvasRenderingContext2D, focused: boolean) {
    const bc = this.stage.barColors
    for (const c of this.controls) {
      const r = this.controlRect(c)!
      if (this.hoverControl === c) this.fillAlpha(ctx, bc.accent, 0.20, r)
      ctx.strokeStyle = focused ? bc.textFocused : bc.text
      ctx.lineWidth = 1.4
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2
      ctx.beginPath()
      if (c === 'info') {
        ctx.arc(cx, cy, 6, 0, Math.PI * 2)                                                                                    // info: ⓘ
        ctx.moveTo(cx, cy - 0.5); ctx.lineTo(cx, cy + 3); ctx.moveTo(cx, cy - 3.2); ctx.lineTo(cx, cy - 2.6)
      } else if (c === 'close') {
        ctx.moveTo(cx - 4, cy - 4); ctx.lineTo(cx + 4, cy + 4); ctx.moveTo(cx + 4, cy - 4); ctx.lineTo(cx - 4, cy + 4)               // close: ✕
      } else if (c === 'minimize') {
        if (this._minimized) { ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy); ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5) }   // expand: +
        else { ctx.moveTo(cx - 5, cy + 3); ctx.lineTo(cx + 5, cy + 3) }                                                       // collapse: –
      } else if (this._maximized) {                                                                                         // restore: two squares
        ctx.rect(cx - 5, cy - 2, 7, 6); ctx.moveTo(cx - 2, cy - 2); ctx.lineTo(cx - 2, cy - 5); ctx.lineTo(cx + 5, cy - 5); ctx.lineTo(cx + 5, cy + 1); ctx.lineTo(cx + 2, cy + 1)
      } else {
        ctx.rect(cx - 5, cy - 4, 10, 8)                                                                                     // maximize: □
      }
      ctx.stroke()
    }
  }

  dispose() {
    this.body.geometry.dispose()
    this.bar.geometry.dispose()
    ;(this.bar.material as THREE.Material).dispose()
    this.barTexture.dispose()
    if (this.grip) { this.grip.geometry.dispose(); const m = this.grip.material as THREE.MeshBasicMaterial; m.map?.dispose(); m.dispose() }
    this.content.dispose?.()
  }
}

export class CathodeStage3D {
  readonly renderer: THREE.WebGLRenderer
  readonly scene  = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  readonly canvas: HTMLCanvasElement
  readonly panels = new Map<string, Panel3D>()
  readonly pxPerUnit: number
  focusedId: string | null = null
  /** the title bars' palette and style (setBarColors / setBarStyle change them live) */
  barColors: BarColors = { ...DEFAULT_BAR_COLORS }
  barStyle: BarStyle = 'plain'

  private controls: StageControls | null = null
  private ray = new THREE.Raycaster()
  private ndc = new THREE.Vector2()
  private raf = 0
  private rendering = false
  private raiseCounter = 0
  private hovered: Panel3D | null = null
  private pressed: Panel3D | null = null            // a content press in progress
  private dragging: { panel: Panel3D; plane: THREE.Plane; offset: THREE.Vector3; moved: boolean } | null = null
  private suppressClick = false
  /** the in-scene Display menu (when the `displayMenu` option is on) and the panel whose hover lens is following the pointer */
  private menu: DisplayMenu3D | null = null
  private lensPanel: Panel3D | null = null
  private resizeObserver: ResizeObserver
  private disposers: (() => void)[] = []
  private lastCursor = ''
  private readonly passThrough: boolean
  private swallowClick = false
  private pressedControl: { panel: Panel3D; control: PanelControl | null; action: string | null } | null = null
  private resizing: { panel: Panel3D; tl: THREE.Vector3; right: THREE.Vector3; up: THREE.Vector3; plane: THREE.Plane; moved: boolean } | null = null
  private hoverGrip: Panel3D | null = null
  private hoverBar: Panel3D | null = null
  private cancelFly: (() => void) | null = null

  constructor(private o: CathodeStage3DOptions) {
    this.pxPerUnit = o.pxPerUnit ?? 360
    this.passThrough = !!o.passThrough
    this.renderer  = new THREE.WebGLRenderer({ antialias: true, alpha: !!o.transparent })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setClearColor(o.background ?? 0x05080a, o.transparent ? 0 : 1)
    this.canvas = this.renderer.domElement
    if (!this.passThrough) this.canvas.tabIndex = 0
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;outline:none;touch-action:none'
      + (this.passThrough ? ';pointer-events:none' : '')
    o.container.appendChild(this.canvas)

    this.camera = new THREE.PerspectiveCamera(o.fov ?? 45, 1, o.near ?? 0.05, o.far ?? 100)
    const cp = o.cameraPosition ?? [0, 0.1, 3.4]
    this.camera.position.set(...cp)
    this.camera.lookAt(0, 0, 0)

    if (o.controls) {
      this.controls = o.controls(this.camera, this.canvas)
      this.controls.addEventListener('change', () => this.invalidate())
    }

    // capture phase, so a press on a panel disables orbit BEFORE the controls' own listener runs
    // (passThrough: on the host's input target, where a press on a panel is stopped before it can
    // reach the scene beneath)
    const it: EventTarget = this.passThrough ? (o.inputTarget ?? document) : this.canvas
    this.on(it, 'pointerdown', (e) => this.onPointerDown(e as PointerEvent), { capture: true })
    this.on(it, 'pointermove', (e) => this.onPointerMove(e as PointerEvent))
    if (!this.passThrough) this.on(this.canvas, 'pointerleave', () => this.setHover(null))
    this.on(window, 'pointerup', (e) => this.onPointerUp(e as PointerEvent))
    this.on(window, 'pointercancel', (e) => this.onPointerUp(e as PointerEvent))
    this.on(it, 'click', (e) => this.onClick(e as MouseEvent), { capture: this.passThrough })
    this.on(it, 'wheel', (e) => this.onWheel(e as WheelEvent), { capture: true, passive: false })
    this.on(this.passThrough ? window : this.canvas, 'keydown', (e) => this.onKey(e as KeyboardEvent))

    if (o.barColors) this.barColors = { ...DEFAULT_BAR_COLORS, ...o.barColors }
    if (o.barStyle) this.barStyle = o.barStyle
    if (o.displayMenu) {
      this.menu = new DisplayMenu3D(this.pxPerUnit, typeof o.displayMenu === 'object' ? o.displayMenu.colors : {})
      this.on(it, 'contextmenu', (e) => this.onContextMenu(e as MouseEvent), { capture: true })
    }

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(o.container)
    this.resize()
  }

  private on(t: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions) {
    t.addEventListener(type, fn, opts)
    this.disposers.push(() => t.removeEventListener(type, fn, opts))
  }

  // ── External camera ─────────────────────────────────────────────────────────

  /** Point the camera (the host drives it — e.g. following another scene's camera). */
  setCameraPose(pose: StageCameraPose) {
    this.camera.position.set(...pose.position)
    this.camera.lookAt(...pose.target)
    this.camera.updateMatrixWorld(true)
    this.controls?.target?.set(...pose.target)   // OrbitControls would otherwise snap back to its old pivot
    this.invalidate()
  }

  /**
   * The camera pose that looks straight at a panel (its title bar included), from the front, far
   * enough back that the whole panel fits the view with `margin` (default 12%) to spare. Pure — it
   * moves nothing: a host that owns the camera (overlay mode) applies it itself; otherwise flyTo().
   */
  facingPose(id: string, opts: { margin?: number } = {}): StageCameraPose | null {
    const p = this.panels.get(id)
    if (!p) return null
    p.group.updateWorldMatrix(true, true)
    const ppu = this.pxPerUnit
    const bodyH = p.content.height / ppu, barH = BAR_PX / ppu
    const w = p.content.width / ppu
    // the body is centred on the group origin and the bar sits above it. Expanded, the panel spans the body's bottom to the
    // bar's top; collapsed, only the bar is left.
    const top = bodyH / 2 + barH, bottom = p.minimized ? bodyH / 2 : -bodyH / 2
    const h = top - bottom
    const center = p.body.localToWorld(new THREE.Vector3(0, (top + bottom) / 2, 0))
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(p.group.getWorldQuaternion(new THREE.Quaternion()))
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const d = Math.max(h / 2 / t, w / 2 / (t * this.camera.aspect)) * (1 + (opts.margin ?? 0.12))
    const pos = center.clone().addScaledVector(normal, d)
    return { position: [pos.x, pos.y, pos.z], target: [center.x, center.y, center.z] }
  }

  /**
   * The camera pose that frames SEVERAL panels at once — the workspace "zoom out": looks along the panels' average facing, from far enough back that every one of them (title bars
   * included) is in view with `margin` (default 8%) to spare, centred on the group. `ids` limits it to those panels (default: all). Never closer than `minDistance` (default 0), so an
   * Overview can't be a zoom IN on a small group. Pure, like facingPose: it moves nothing — apply it yourself or flyTo() it. Null when there is nothing to frame.
   */
  framePose(ids?: string[], opts: { margin?: number; minDistance?: number } = {}): StageCameraPose | null {
    const list = (ids ?? [...this.panels.keys()]).map((id) => this.panels.get(id)).filter((p): p is Panel3D => !!p)
    if (!list.length) return null
    const ppu = this.pxPerUnit, barH = BAR_PX / ppu
    // the group's facing: the mean of the panels' normals (straight at +z for an unrotated layout)
    const normal = new THREE.Vector3()
    for (const p of list) { p.group.updateWorldMatrix(true, true); normal.add(new THREE.Vector3(0, 0, 1).applyQuaternion(p.group.getWorldQuaternion(new THREE.Quaternion()))) }
    normal.normalize()
    if (!isFinite(normal.x)) normal.set(0, 0, 1)
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), normal)
    if (right.lengthSq() < 1e-6) right.set(1, 0, 0)
    right.normalize()
    const up = new THREE.Vector3().crossVectors(normal, right).normalize()
    // every panel's corners (body + the bar above it; a collapsed panel is only its bar), in that basis
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, depth = 0, n = 0
    for (const p of list) {
      const w = p.content.width / ppu, bodyH = p.content.height / ppu
      const top = bodyH / 2 + barH, bottom = p.minimized ? bodyH / 2 : -bodyH / 2
      for (const [cx, cy] of [[-w / 2, bottom], [w / 2, bottom], [-w / 2, top], [w / 2, top]]) {
        const v = p.body.localToWorld(new THREE.Vector3(cx, cy, 0))
        const X = v.dot(right), Y = v.dot(up)
        x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); depth += v.dot(normal); n++
      }
    }
    const m = 1 + (opts.margin ?? 0.08)
    const W = (x1 - x0) * m, H = (y1 - y0) * m
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const d = Math.max(H / 2 / t, W / 2 / (t * this.camera.aspect), opts.minDistance ?? 0)
    const center = right.clone().multiplyScalar((x0 + x1) / 2).addScaledVector(up, (y0 + y1) / 2).addScaledVector(normal, depth / n)
    const pos = center.clone().addScaledVector(normal, d)
    return { position: [pos.x, pos.y, pos.z], target: [center.x, center.y, center.z] }
  }

  /**
   * Tween the camera to a pose (ease in-out). For a stage that OWNS its camera — in overlay mode
   * the host drives the camera, so apply facingPose() there instead. Resolves when it lands; a new
   * flyTo replaces one in flight. `ms <= 0` snaps.
   */
  flyTo(pose: StageCameraPose, ms = 550): Promise<void> {
    this.cancelFly?.()
    if (ms <= 0) { this.setCameraPose(pose); return Promise.resolve() }
    const from = this.getCameraPose()
    return new Promise<void>((resolve) => {
      const t0 = performance.now()
      let raf = 0
      this.cancelFly = () => { cancelAnimationFrame(raf); this.cancelFly = null; resolve() }
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms)
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
        const lerp = (a: [number, number, number], b: [number, number, number]): [number, number, number] =>
          [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e]
        this.setCameraPose({ position: lerp(from.position, pose.position), target: lerp(from.target, pose.target) })
        if (k < 1) raf = requestAnimationFrame(step)
        else { this.cancelFly = null; resolve() }
      }
      raf = requestAnimationFrame(step)
    })
  }

  /** The camera's current pose (target = the point it looks at, one unit ahead). */
  getCameraPose(): StageCameraPose {
    const p = this.camera.position
    const t = this.camera.getWorldDirection(new THREE.Vector3()).add(p)
    return { position: [p.x, p.y, p.z], target: [t.x, t.y, t.z] }
  }

  // ── Panels ──────────────────────────────────────────────────────────────────

  addPanel(o: PanelOptions): Panel3D {
    if (this.panels.has(o.id)) throw new Error(`CathodeStage3D: duplicate panel id "${o.id}"`)
    const p = new Panel3D(this, o)
    p.content.surface.setAnisotropy(this.renderer.capabilities.getMaxAnisotropy())
    this.panels.set(o.id, p)
    this.scene.add(p.group)
    this.raise(p)
    this.invalidate()
    return p
  }

  removePanel(id: string) {
    const p = this.panels.get(id)
    if (!p) return
    if (this.focusedId === id) this.setFocus(null)
    if (this.hovered === p) this.hovered = null
    if (this.pressed === p) this.pressed = null
    if (this.lensPanel === p) this.lensPanel = null
    if (this.menu?.panel === p) this.menu.close()
    this.scene.remove(p.group)
    p.dispose()
    this.panels.delete(id)
    this.invalidate()
  }

  /** Show / hide a panel. Hiding releases its focus, hover, press and drag. */
  setPanelVisible(id: string, visible: boolean) {
    const p = this.panels.get(id)
    if (!p) return
    p.setVisible(visible)
    if (!visible) {
      if (this.focusedId === id) this.setFocus(null)
      if (this.hovered === p) this.hovered = null
      if (this.pressed === p) this.pressed = null
      if (this.dragging?.panel === p) this.dragging = null
    }
    this.invalidate()
  }

  /** Collapse a panel to its title bar / expand it. Collapsing releases hover and press on its body. */
  setPanelMinimized(id: string, minimized: boolean) {
    const p = this.panels.get(id)
    if (!p) return
    p.setMinimized(minimized)
    if (minimized) {
      if (this.hovered === p) this.hovered = null
      if (this.pressed === p) this.pressed = null
    }
    this.invalidate()
  }

  /** Keyboard focus + raise. */
  setFocus(id: string | null) {
    if (this.focusedId === id) { if (id) this.raise(this.panels.get(id)!); return }
    const prev = this.focusedId && this.panels.get(this.focusedId)
    this.focusedId = id
    if (prev) prev.invalidateBar()
    const next = id ? this.panels.get(id) : null
    if (next) { this.raise(next); next.invalidateBar() }
    this.o.onFocus?.(id)
    this.invalidate()
  }

  private raise(p: Panel3D) {
    p.body.renderOrder = p.bar.renderOrder = ++this.raiseCounter
    if (p.grip) p.grip.renderOrder = p.body.renderOrder + 0.5
  }

  getLayout(): Record<string, PanelLayout> {
    const out: Record<string, PanelLayout> = {}
    for (const [id, p] of this.panels) {
      out[id] = { x: p.group.position.x, y: p.group.position.y, z: p.group.position.z, rotY: p.group.rotation.y, visible: p.visible, minimized: p.minimized, ...(p.resizable ? { size: { w: p.content.width, h: p.content.height } } : {}) }
    }
    return out
  }

  applyLayout(layout: Record<string, Partial<PanelLayout>>) {
    for (const [id, l] of Object.entries(layout)) {
      const p = this.panels.get(id)
      if (!p) continue
      p.group.position.set(l.x ?? p.group.position.x, l.y ?? p.group.position.y, l.z ?? p.group.position.z)
      if (l.rotY !== undefined) p.group.rotation.y = l.rotY
      if (l.visible !== undefined) this.setPanelVisible(id, l.visible)
      if (l.minimized !== undefined) this.setPanelMinimized(id, l.minimized)
      if (l.size) p.resize(l.size.w, l.size.h)   // (the panel's centre stays: restore a saved position AND size by applying both)
    }
    this.invalidate()
  }

  // ── Rendering (on demand) ───────────────────────────────────────────────────

  invalidate() {
    if (this.raf || this.rendering) return
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.frame() })
  }

  private frame() {
    this.rendering = true
    for (const p of this.panels.values()) p.paintIfDirty()
    this.controls?.update()
    this.renderer.render(this.scene, this.camera)
    this.rendering = false
  }

  private resize() {
    const W = this.o.container.clientWidth, H = this.o.container.clientHeight
    if (!W || !H) return
    this.renderer.setSize(W, H, false)
    this.camera.aspect = W / H
    this.camera.updateProjectionMatrix()
    this.invalidate()
  }

  // ── Picking ─────────────────────────────────────────────────────────────────

  private setRay(clientX: number, clientY: number) {
    const r = this.canvas.getBoundingClientRect()
    this.ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
    this.ray.setFromCamera(this.ndc, this.camera)
  }

  /** Content px (the panel's logical px) under a client point, or null (miss / bezel). */
  contentAt(panel: Panel3D, clientX: number, clientY: number): { x: number; y: number } | null {
    this.setRay(clientX, clientY)
    const hit = this.ray.intersectObject(panel.body)[0]
    if (!hit?.uv) return null
    return panel.content.surface.contentPoint(hit.uv.x, hit.uv.y)
  }

  /** Local content-px per screen-px at a client point: two probes 8px apart, as the DOM grid does. */
  private hitScaleAt(panel: Panel3D, clientX: number, clientY: number): number {
    const a = this.contentAt(panel, clientX - 4, clientY)
    const b = this.contentAt(panel, clientX + 4, clientY)
    if (!a || !b) return 1
    return Math.max(1, Math.abs(b.x - a.x) / 8)
  }

  /** The nearest panel part under a client point (bodies and title bars; raised panels win ties). */
  pick(clientX: number, clientY: number): StagePick | null {
    this.setRay(clientX, clientY)
    const meshes: THREE.Object3D[] = []
    for (const p of this.panels.values()) if (p.visible) { if (!p.minimized) meshes.push(p.body); meshes.push(p.bar) }   // a collapsed panel is only its bar
    const hits = this.ray.intersectObjects(meshes, false)
    if (!hits.length) return null
    // hits are sorted nearest-first; among those within a hair of the nearest (coplanar overlap),
    // the most recently raised panel wins
    const d0 = hits[0].distance
    let best = hits[0]
    for (const h of hits) {
      if (h.distance - d0 < 1e-3 && h.object.renderOrder > best.object.renderOrder) best = h
    }
    const panel = best.object.userData.panel as Panel3D
    const part  = best.object === panel.bar ? 'bar' : 'body'
    const content = part === 'body' && best.uv ? panel.content.surface.contentPoint(best.uv.x, best.uv.y) : null
    const control = part === 'bar' && best.uv ? panel.controlAt(best.uv.x * panel.content.width, (1 - best.uv.y) * BAR_PX) : null
    const action = part === 'bar' && best.uv && !control ? panel.actionAt(best.uv.x * panel.content.width, (1 - best.uv.y) * BAR_PX) : null
    const handle = part === 'body' && panel.resizable && !panel.minimized && !!best.uv
      && best.uv.x * panel.content.width > panel.content.width - HANDLE_PX && (1 - best.uv.y) * panel.content.height > panel.content.height - HANDLE_PX
    return { panel, part, content, control, action, handle, uv: best.uv ? { x: best.uv.x, y: best.uv.y } : null }
  }

  /**
   * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
   * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
   */
  clientPointForContent(id: string, cx: number, cy: number): { x: number; y: number } | null {
    const p = this.panels.get(id)
    if (!p) return null
    const s = p.content.surface
    const W = p.content.width, H = p.content.height
    let u = cx / W, v = 1 - cy / H
    const f = (uu: number, vv: number) => s.contentPoint(uu, vv)
    for (let i = 0; i < 12; i++) {
      const c = f(u, v)
      if (!c) { u = 0.5 + (u - 0.5) * 0.8; v = 0.5 + (v - 0.5) * 0.8; continue }
      const ex = c.x - cx, ey = c.y - cy
      if (Math.hypot(ex, ey) < 0.05) break
      const e = 1e-4
      const cu = f(u + e, v), cv = f(u, v + e)
      if (!cu || !cv) break
      const a = (cu.x - c.x) / e, b = (cv.x - c.x) / e
      const cc = (cu.y - c.y) / e, d = (cv.y - c.y) / e
      const det = a * d - b * cc
      if (Math.abs(det) < 1e-9) break
      u -= (d * ex - b * ey) / det
      v -= (-cc * ex + a * ey) / det
    }
    const check = f(u, v)
    if (!check || Math.hypot(check.x - cx, check.y - cy) > 1.5) return null
    p.group.updateWorldMatrix(true, true)
    const world = p.body.localToWorld(new THREE.Vector3((u - 0.5) * (W / this.pxPerUnit), (v - 0.5) * (H / this.pxPerUnit), 0))
    world.project(this.camera)
    const r = this.canvas.getBoundingClientRect()
    return { x: r.left + ((world.x + 1) / 2) * r.width, y: r.top + ((1 - world.y) / 2) * r.height }
  }

  /** Client point of a resizable panel's resize handle (for tests / tours), or null. */
  clientPointForHandle(id: string): { x: number; y: number } | null {
    const p = this.panels.get(id)
    if (!p || !p.resizable) return null
    p.group.updateWorldMatrix(true, true)
    const ppu = this.pxPerUnit
    const world = p.body.localToWorld(new THREE.Vector3((p.content.width / 2 - HANDLE_PX / 2) / ppu, -(p.content.height / 2 - HANDLE_PX / 2) / ppu, 0)).project(this.camera)
    const rect = this.canvas.getBoundingClientRect()
    return { x: rect.left + ((world.x + 1) / 2) * rect.width, y: rect.top + ((1 - world.y) / 2) * rect.height }
  }

  /** Client point of a title-bar control's centre (for tests / tours), or null. */
  clientPointForAction(id: string, action: string): { x: number; y: number } | null {
    const p = this.panels.get(id)
    const r = p?.actionRects().find((a) => a.id === action)
    if (!p || !r) return null
    p.group.updateWorldMatrix(true, true)
    const ppu = this.pxPerUnit
    const v = p.bar.localToWorld(new THREE.Vector3((r.x + r.w / 2 - p.content.width / 2) / ppu, -((r.y + r.h / 2) - BAR_PX / 2) / ppu, 0)).project(this.camera)
    const rect = this.canvas.getBoundingClientRect()
    return { x: rect.left + ((v.x + 1) / 2) * rect.width, y: rect.top + ((1 - v.y) / 2) * rect.height }
  }

  clientPointForControl(id: string, control: PanelControl): { x: number; y: number } | null {
    const p = this.panels.get(id)
    const r = p?.controlRect(control)
    if (!p || !r) return null
    p.group.updateWorldMatrix(true, true)
    const ppu = this.pxPerUnit
    const local = new THREE.Vector3((r.x + r.w / 2 - p.content.width / 2) / ppu, 0, 0)
    local.y = (BAR_PX / 2 - (r.y + r.h / 2)) / ppu
    const world = p.bar.localToWorld(local).project(this.camera)
    const rect = this.canvas.getBoundingClientRect()
    return { x: rect.left + ((world.x + 1) / 2) * rect.width, y: rect.top + ((1 - world.y) / 2) * rect.height }
  }

  /** Client point of a panel's title bar centre (for tests / tours). */
  clientPointForBar(id: string): { x: number; y: number } | null {
    const p = this.panels.get(id)
    if (!p) return null
    p.group.updateWorldMatrix(true, true)
    const world = p.bar.getWorldPosition(new THREE.Vector3()).project(this.camera)
    const r = this.canvas.getBoundingClientRect()
    return { x: r.left + ((world.x + 1) / 2) * r.width, y: r.top + ((1 - world.y) / 2) * r.height }
  }

  // ── Pointer routing ─────────────────────────────────────────────────────────

  private send(panel: Panel3D, kind: PanelPointerKind, e: { clientX: number; clientY: number; shiftKey?: boolean; detail?: number },
               extra: { deltaX?: number; deltaY?: number } = {}): string | null {
    const c = this.contentAt(panel, e.clientX, e.clientY)
    const ev: PanelPointerEvent = {
      kind, x: c ? c.x : -1, y: c ? c.y : -1,
      hitScale: c ? this.hitScaleAt(panel, e.clientX, e.clientY) : 1,
      clientX: e.clientX, clientY: e.clientY,
      deltaX: extra.deltaX ?? 0, deltaY: extra.deltaY ?? 0,
      detail: kind === 'click' ? (e.detail ?? 0) : 0, shiftKey: !!e.shiftKey,
    }
    return panel.content.pointer?.(ev) ?? null
  }

  private setCursor(c: string) {
    if (c === this.lastCursor) return
    this.lastCursor = c
    if (this.o.onCursor) this.o.onCursor(c)
    else this.canvas.style.cursor = c
  }

  private setHover(p: Panel3D | null, e?: PointerEvent) {
    if (this.hovered && this.hovered !== p) {
      this.send(this.hovered, 'leave', e ?? { clientX: -1, clientY: -1 })
    }
    this.hovered = p
    if (!p) { this.setCursor(''); this.setLens(null) }
  }

  /** passThrough: did this event land on something the stage may take (not DOM stacked above it)? */
  private accepts(e: Event): boolean {
    return !this.passThrough || !this.o.shouldHandle || this.o.shouldHandle(e.target)
  }

  private onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || !this.accepts(e)) return
    // the Display menu: a press on a row acts; a press anywhere else closes it (and goes on to do whatever it was aimed at)
    if (this.menu?.isOpen) {
      const row = this.pickMenu(e.clientX, e.clientY)
      if (row) { e.preventDefault(); e.stopPropagation(); this.suppressClick = true; this.menuAct(row); return }
      this.menu.close(); this.invalidate()
    }
    if (!this.passThrough) this.canvas.focus({ preventScroll: true })
    const hit = this.pick(e.clientX, e.clientY)
    if (!hit) {                                        // empty space → orbit (the scene's, if passThrough)
      if (this.passThrough) this.setFocus(null)        // …and a press elsewhere releases keyboard focus
      return
    }
    // a press on a panel never reaches the layer beneath (its orbit, its plane clicks)
    if (this.passThrough) { e.stopPropagation(); this.swallowClick = true }
    if (this.controls) this.controls.enabled = false   // …and never orbits
    this.setFocus(hit.panel.id)
    this.suppressClick = false
    if (hit.part === 'bar' && (hit.control || hit.action)) {
      this.pressedControl = { panel: hit.panel, control: hit.control, action: hit.action }   // a press on a control is a button, never a drag
      this.setCursor('pointer')
    } else if (hit.part === 'bar') {
      this.startDrag(hit.panel)
      this.setCursor('grabbing')
    } else if (hit.handle) {
      this.startResize(hit.panel)
      this.setCursor('nwse-resize')
    } else {
      this.pressed = hit.panel
      this.send(hit.panel, 'down', e)
    }
  }

  private onPointerMove(e: PointerEvent) {
    if (this.resizing) { this.resizeTo(e); return }
    if (this.dragging) { this.dragTo(e); return }
    if (this.pressed) { this.send(this.pressed, 'drag', e); return }
    if (this.pressedControl) return
    if (!this.accepts(e)) { this.setHover(null, e); this.setHoverBar(null, null); this.setHoverGrip(null); return }
    if (this.menu?.isOpen) {                           // over the Display menu: light its row, and nothing under it hears the pointer
      const row = this.pickMenu(e.clientX, e.clientY)
      this.menu.setHover(row)
      if (row) { this.setHover(null, e); this.setHoverBar(null, null); this.setHoverGrip(null); this.setLens(null); this.setCursor('pointer'); return }
    }
    const hit = this.pick(e.clientX, e.clientY)
    this.setLens(hit && hit.part === 'body' && !hit.handle ? hit : null)
    this.setHoverGrip(hit?.handle ? hit.panel : null)
    this.setHover(hit && hit.part === 'body' && !hit.handle ? hit.panel : null, e)
    this.setHoverBar(hit && hit.part === 'bar' ? hit.panel : null, hit?.control ?? null, hit?.action ?? null)
    if (!hit) { this.setCursor(''); return }
    if (hit.part === 'bar') { this.setCursor(hit.control || hit.action ? 'pointer' : 'grab'); return }
    if (hit.handle) { this.setCursor('nwse-resize'); return }
    const cursor = this.send(hit.panel, 'move', e)
    if (cursor) this.setCursor(cursor)
  }

  /** light the control under the pointer (and clear the previous panel's) */
  private setHoverBar(panel: Panel3D | null, control: PanelControl | null, action: string | null = null) {
    if (this.hoverBar && this.hoverBar !== panel) this.hoverBar.setHoverControl(null, null)
    this.hoverBar = panel
    panel?.setHoverControl(control, action)
  }

  private setHoverGrip(panel: Panel3D | null) {
    if (this.hoverGrip && this.hoverGrip !== panel) this.hoverGrip.setHoverGrip(false)
    this.hoverGrip = panel
    panel?.setHoverGrip(true)
  }

  private onPointerUp(e: PointerEvent) {
    this.pressedControl = null
    if (this.resizing) {
      const r = this.resizing; this.resizing = null
      if (r.moved) {
        this.suppressClick = true
        const g = r.panel.group.position
        this.o.onPanelResized?.(r.panel.id, { w: r.panel.content.width, h: r.panel.content.height }, { x: g.x, y: g.y, z: g.z })
      }
      this.setCursor('')
    }
    if (this.dragging) {
      if (this.dragging.moved) this.suppressClick = true
      const p = this.dragging.panel
      this.dragging = null
      this.setCursor('')
      this.o.onPanelMoved?.(p.id, { x: p.group.position.x, y: p.group.position.y, z: p.group.position.z })
    }
    if (this.pressed) {
      this.send(this.pressed, 'up', e)
      this.pressed = null
    }
    if (this.controls) this.controls.enabled = true
  }

  private onClick(e: MouseEvent) {
    if (!this.accepts(e)) return
    // the click that ends a press that began on a panel is the panel's, wherever it lands
    if (this.passThrough && this.swallowClick) { this.swallowClick = false; e.stopPropagation() }
    if (this.suppressClick) { this.suppressClick = false; return }
    const hit = this.pick(e.clientX, e.clientY)
    if (hit && this.passThrough) e.stopPropagation()
    if (hit && hit.part === 'body') this.send(hit.panel, 'click', e)
    if (hit && hit.part === 'bar') {
      if (hit.control) this.o.onPanelControl?.(hit.panel.id, hit.control)
      else if (hit.action) this.o.onPanelAction?.(hit.panel.id, hit.action)
      else if (e.detail >= 2) this.o.onPanelActivate?.(hit.panel.id)
    }
  }

  private onWheel(e: WheelEvent) {
    if (!this.accepts(e)) return
    const hit = this.pick(e.clientX, e.clientY)
    if (!hit || hit.part !== 'body') return            // let the camera zoom
    e.preventDefault()
    e.stopImmediatePropagation()
    this.send(hit.panel, 'wheel', e, { deltaX: e.deltaX, deltaY: e.deltaY })
  }

  private onKey(e: KeyboardEvent) {
    if (this.passThrough) {                            // window-level: not while typing elsewhere
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
    }
    if (this.menu) {
      if (e.key === 'Escape' && this.menu.isOpen) { this.menu.close(); this.invalidate(); return }
      // Cmd+Shift +/-  bends the panel the pointer is over (Shift so it doesn't shadow the browser's own Cmd +/- page zoom)
      if (e.metaKey && e.shiftKey && /^[=+\-_]$/.test(e.key)) {
        const target = this.menu.panel ?? this.hovered
        if (target) { e.preventDefault(); this.stepBend(target, e.key === '=' || e.key === '+' ? CURVE_STEP : -CURVE_STEP); return }
      }
    }
    const p = this.focusedId ? this.panels.get(this.focusedId) : null
    if (p?.content.key) { p.content.key(e); p.invalidate() }
  }

  // ── The Display menu (in the scene) ─────────────────────────────────────────────────────────────────────

  /** right-click: open the menu on the panel under the pointer (the body or the title bar); anywhere else, close it and leave the click to the page */
  private onContextMenu(e: MouseEvent) {
    if (!this.menu) return
    if (!this.accepts(e)) { this.menu.close(); this.invalidate(); return }
    if (this.dragging || this.resizing) return
    const hit = this.pick(e.clientX, e.clientY)
    if (!hit) { if (this.menu.isOpen) { this.menu.close(); this.invalidate() } return }
    e.preventDefault(); e.stopPropagation()
    this.setFocus(hit.panel.id)
    const bw = hit.panel.content.width, bh = hit.panel.content.height
    // the menu's corner is where the pointer is: a body point is (u, 1-v) of the body; a title-bar point opens it at the body's top edge
    const x = hit.part === 'body' && hit.uv ? hit.uv.x * bw : (hit.uv ? hit.uv.x * bw : 0)
    const y = hit.part === 'body' && hit.uv ? (1 - hit.uv.y) * bh : 0
    this.menu.open(hit.panel, x, y, hit.panel.display)
    this.invalidate()
  }

  /** open the menu on a panel programmatically (tests / tours); (x, y) is the menu's top-left in the body's px */
  openDisplayMenu(id: string, x = 8, y = 8) {
    const p = this.panels.get(id)
    if (!this.menu || !p) return
    this.menu.open(p, x, y, p.display)
    this.invalidate()
  }
  /** re-theme the in-scene Display menu (a host whose theme changed); an open menu repaints at once */
  setMenuColors(c: Partial<MenuColors>) { this.menu?.setColors(c); this.invalidate() }
  /** re-theme every title bar (merged over the current palette) */
  setBarColors(c: Partial<BarColors>) {
    this.barColors = { ...this.barColors, ...c }
    for (const p of this.panels.values()) p.invalidateBar()
    this.invalidate()
  }
  /** switch every title bar between the plain style and the cockpit style */
  setBarStyle(style: BarStyle) {
    if (this.barStyle === style) return
    this.barStyle = style
    for (const p of this.panels.values()) p.invalidateBar()
    this.invalidate()
  }
  closeDisplayMenu() { if (this.menu?.isOpen) { this.menu.close(); this.invalidate() } }
  /** the panel the Display menu is open on, or null */
  get displayMenuPanel(): Panel3D | null { return this.menu?.panel ?? null }

  /** the menu row under a client point (the menu is a quad on its panel's plane — a plain ray hit), or null */
  private pickMenu(clientX: number, clientY: number): MenuRow | null {
    if (!this.menu?.isOpen) return null
    this.setRay(clientX, clientY)
    const hit = this.ray.intersectObject(this.menu.mesh, false)[0]
    return hit?.uv ? this.menu.rowAtUV(hit.uv.x, hit.uv.y) : null
  }

  /** the client point of a menu row's centre (for tests / tours), or null when the menu is closed */
  clientPointForMenuRow(row: MenuRow): { x: number; y: number } | null {
    if (!this.menu?.isOpen) return null
    const { x, y } = DisplayMenu3D.rowCentre(row)
    this.menu.mesh.updateWorldMatrix(true, false)
    const v = this.menu.mesh.localToWorld(new THREE.Vector3((x - DisplayMenu3D.width / 2) / this.pxPerUnit, (DisplayMenu3D.height / 2 - y) / this.pxPerUnit, 0)).project(this.camera)
    const r = this.canvas.getBoundingClientRect()
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height }
  }

  private menuAct(row: MenuRow) {
    const p = this.menu?.panel
    if (!p) return
    const d = p.display
    if (row === 'curve-' || row === 'curve+') { this.stepBend(p, row === 'curve+' ? CURVE_STEP : -CURVE_STEP); return }
    this.applyDisplay(p, { [row]: !d[row] } as Partial<PanelDisplay>)
  }

  private stepBend(p: Panel3D, step: number) {
    this.applyDisplay(p, { curvature: Math.max(CURVE_MIN, Math.min(CURVE_MAX, p.display.curvature + step)) })
  }

  private applyDisplay(p: Panel3D, d: Partial<PanelDisplay>) {
    p.setDisplay(d)
    if (this.menu?.panel === p) this.menu.update(p.display)
    this.o.onPanelDisplay?.(p.id, p.display)
    this.invalidate()
  }

  /** the hover magnifier: follow the pointer over a panel whose `magnify` is on; let go everywhere else */
  private setLens(hit: StagePick | null) {
    const on = hit && hit.uv && hit.panel.display.magnify ? hit.panel : null
    if (this.lensPanel && this.lensPanel !== on) { this.lensPanel.content.surface.setLens(null); this.lensPanel.invalidate() }
    this.lensPanel = on
    if (on && hit!.uv) { on.content.surface.setLens({ x: hit!.uv.x, y: hit!.uv.y }); on.invalidate() }
  }

  // ── Resize (ray–plane on the panel's own plane; the TOP-LEFT corner stays put) ──────────────────────────

  private startResize(panel: Panel3D) {
    this.menu?.close()
    panel.group.updateWorldMatrix(true, true)
    const q = panel.group.getWorldQuaternion(new THREE.Quaternion())
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q), up = new THREE.Vector3(0, 1, 0).applyQuaternion(q)
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(q)
    const ppu = this.pxPerUnit
    const tl = panel.body.localToWorld(new THREE.Vector3(-panel.content.width / ppu / 2, panel.content.height / ppu / 2, 0))
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, tl)
    this.resizing = { panel, tl, right, up, plane, moved: false }
  }

  private resizeTo(e: PointerEvent) {
    const r = this.resizing!
    this.setRay(e.clientX, e.clientY)
    const p = new THREE.Vector3()
    if (!this.ray.ray.intersectPlane(r.plane, p)) return
    const ppu = this.pxPerUnit
    const d = p.sub(r.tl)
    const w = Math.round(d.dot(r.right) * ppu), h = Math.round(-d.dot(r.up) * ppu)    // (the panel clamps to its limits)
    const panel = r.panel
    const cw = Math.round(Math.min(panel.maxSize.w, Math.max(panel.minSize.w, w)))
    const ch = Math.round(Math.min(panel.maxSize.h, Math.max(panel.minSize.h, h)))
    if (cw === panel.content.width && ch === panel.content.height) return
    // keep the top-left corner where it is: the centre sits half the NEW size right of / below it
    panel.group.position.copy(r.tl).addScaledVector(r.right, cw / ppu / 2).addScaledVector(r.up, -ch / ppu / 2)
    panel.resize(cw, ch)
    r.moved = true
  }

  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────

  private startDrag(panel: Panel3D) {
    this.menu?.close()
    panel.group.updateWorldMatrix(true, true)
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(panel.group.quaternion)
    const plane  = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, panel.group.position)
    const p0 = new THREE.Vector3()
    const offset = new THREE.Vector3()
    if (this.ray.ray.intersectPlane(plane, p0)) offset.copy(panel.group.position).sub(p0)
    this.dragging = { panel, plane, offset, moved: false }
  }

  private dragTo(e: PointerEvent) {
    const d = this.dragging!
    this.setRay(e.clientX, e.clientY)
    const p = new THREE.Vector3()
    if (!this.ray.ray.intersectPlane(d.plane, p)) return
    d.panel.group.position.copy(p.add(d.offset))
    d.moved = true
    this.invalidate()
  }

  // ── Teardown ────────────────────────────────────────────────────────────────

  dispose() {
    this.cancelFly?.()
    cancelAnimationFrame(this.raf)
    this.resizeObserver.disconnect()
    for (const off of this.disposers) off()
    for (const p of [...this.panels.values()]) this.removePanel(p.id)
    this.menu?.dispose()
    this.controls?.dispose()
    try { this.renderer.forceContextLoss() } catch { /* no context */ }
    this.renderer.dispose()
    this.canvas.remove()
  }
}
