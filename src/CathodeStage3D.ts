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
}

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
}

export interface PanelLayout { x: number; y: number; z: number; rotY: number; visible?: boolean }

export interface StagePick {
  panel: Panel3D
  part:  'body' | 'bar'
  /** content px in the panel's logical px; null over the bezel / on the bar */
  content: { x: number; y: number } | null
}

const BAR_PX = 26

/** One panel: a surface mesh + a title bar, in a group the stage moves around. */
export class Panel3D {
  readonly id: string
  readonly title: string
  readonly content: PanelContent
  readonly group = new THREE.Group()
  readonly body: THREE.Mesh
  readonly bar: THREE.Mesh
  glow: boolean
  dirty = true
  barDirty = true

  private barCanvas = document.createElement('canvas')
  private barTexture: THREE.CanvasTexture

  constructor(readonly stage: CathodeStage3D, o: PanelOptions) {
    this.id      = o.id
    this.title   = o.title ?? o.id
    this.content = o.content
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

    if (o.visible === false) this.group.visible = false
    if (o.position) this.group.position.set(...o.position)
    this.group.rotation.y = o.rotationY ?? 0
    if (o.look) s.setLook(o.look)

    s.resize(o.content.width, o.content.height, window.devicePixelRatio || 1)
    o.content.attach?.(() => this.invalidate())
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

  setLook(look: Partial<SurfaceLook>) { this.content.surface.setLook(look); this.invalidate() }
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
    ctx.fillStyle = focused ? '#0f2a1d' : '#08130e'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = focused ? '#6ee7a7' : '#2f6b4c'
    ctx.fillRect(0, H - 2, W, 2)
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = focused ? '#b6f5d2' : '#6fae8f'
    ctx.fillText(this.title, 10, H / 2 - 1)
    this.barTexture.needsUpdate = true
  }

  dispose() {
    this.body.geometry.dispose()
    this.bar.geometry.dispose()
    ;(this.bar.material as THREE.Material).dispose()
    this.barTexture.dispose()
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
  private resizeObserver: ResizeObserver
  private disposers: (() => void)[] = []
  private lastCursor = ''
  private readonly passThrough: boolean
  private swallowClick = false
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
    const w = p.content.width / ppu, h = bodyH + barH
    // the body is centred on the group origin and the bar sits above it, so the whole panel's centre is barH/2 up
    const center = p.body.localToWorld(new THREE.Vector3(0, barH / 2, 0))
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(p.group.getWorldQuaternion(new THREE.Quaternion()))
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const d = Math.max(h / 2 / t, w / 2 / (t * this.camera.aspect)) * (1 + (opts.margin ?? 0.12))
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
  }

  getLayout(): Record<string, PanelLayout> {
    const out: Record<string, PanelLayout> = {}
    for (const [id, p] of this.panels) {
      out[id] = { x: p.group.position.x, y: p.group.position.y, z: p.group.position.z, rotY: p.group.rotation.y, visible: p.visible }
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
    for (const p of this.panels.values()) if (p.visible) meshes.push(p.body, p.bar)
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
    return { panel, part, content }
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
    if (!p) this.setCursor('')
  }

  /** passThrough: did this event land on something the stage may take (not DOM stacked above it)? */
  private accepts(e: Event): boolean {
    return !this.passThrough || !this.o.shouldHandle || this.o.shouldHandle(e.target)
  }

  private onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || !this.accepts(e)) return
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
    if (hit.part === 'bar') {
      this.startDrag(hit.panel)
      this.setCursor('grabbing')
    } else {
      this.pressed = hit.panel
      this.send(hit.panel, 'down', e)
    }
  }

  private onPointerMove(e: PointerEvent) {
    if (this.dragging) { this.dragTo(e); return }
    if (this.pressed) { this.send(this.pressed, 'drag', e); return }
    if (!this.accepts(e)) { this.setHover(null, e); return }
    const hit = this.pick(e.clientX, e.clientY)
    this.setHover(hit && hit.part === 'body' ? hit.panel : null, e)
    if (!hit) { this.setCursor(''); return }
    if (hit.part === 'bar') { this.setCursor('grab'); return }
    const cursor = this.send(hit.panel, 'move', e)
    if (cursor) this.setCursor(cursor)
  }

  private onPointerUp(e: PointerEvent) {
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
    if (hit && hit.part === 'bar' && e.detail >= 2) this.o.onPanelActivate?.(hit.panel.id)
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
    const p = this.focusedId ? this.panels.get(this.focusedId) : null
    if (p?.content.key) { p.content.key(e); p.invalidate() }
  }

  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────

  private startDrag(panel: Panel3D) {
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
    this.controls?.dispose()
    try { this.renderer.forceContextLoss() } catch { /* no context */ }
    this.renderer.dispose()
    this.canvas.remove()
  }
}
