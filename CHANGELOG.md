# Changelog

## 0.15.0 — 2026-11-22

**Window controls for stage panels: minimise, maximise, resize.** A `CathodeStage3D` panel could be moved and faced but not
collapsed or resized the way a DOM window can. All additive; panels have none of this unless asked for.

- **Title-bar controls.** `controls: ['minimize', 'maximize']` on `addPanel` draws the buttons at the bar's right edge —
  strokes, not font glyphs (a glyph can fall back to a font that lacks it). The stage hit-tests them (`pick(…).control`),
  shows a hand over them, lights the one under the pointer, and reports a click as `onPanelControl(id, control)`. A press on a
  button is a button: it never starts a drag, and a click on one is never the "double-click the title to face this panel"
  gesture. **What a click means is the host's call.** The title text is squeezed so it never runs under the controls.
- **Minimise.** `stage.setPanelMinimized(id, v)` / `panel.minimized` collapses a panel to its title bar: the body is hidden
  (not drawn, not picked), hover / press on it are released, `facingPose` fits the bar alone, the button shows "expand", and
  `minimized` round-trips through `getLayout()` / `applyLayout()` / `addPanel({ minimized })`.
- **Maximise.** `panel.setMaximized(v)` / `panel.maximized` flips the maximise button to "restore" — a visual flag; the host
  pairs it with `facingPose(id, { margin })` + `flyTo` to fill the view, and back to the remembered pose.
- **Resize.** `resizable: true` (with `minSize` / `maxSize`, default 240×160 … 1600×1000) puts a grip in the panel's bottom-right
  corner; dragging it resizes the panel and **the top-left corner stays put** (the centre moves; a ray–plane drag on the panel's
  own plane, so it holds under tilt and perspective). The handle is **geometric** — hit-tested on the plane's UV
  (`pick(…).handle`), so a screen bend can't move it — with a `nwse-resize` cursor; a collapsed panel has no grip. The content
  must support it: the new optional `PanelContent.resize(w, h)` — `gridContent` re-fits its columns and viewport (more room, more
  columns / rows), `gaugeContent` redraws, `surfaceContent` accepts one — and then the surface's backing store follows.
  `onPanelResized(id, size, pos)` fires once on release; `panel.resize(w, h)` does it programmatically; `getLayout()` /
  `applyLayout()` carry `size` (apply the position **and** the size to restore a saved arrangement). A resize drag is never a
  content press, a click, or an orbit.
- **Test helpers.** `stage.clientPointForControl(id, control)` and `stage.clientPointForHandle(id)`.

New exports: type `PanelControl`. New options / methods: `PanelOptions.controls` / `minimized` / `resizable` / `minSize` /
`maxSize`, `CathodeStage3DOptions.onPanelControl` / `onPanelResized`, `Panel3D.setMinimized` / `setMaximized` / `resize` /
`controlRect` / `controlAt` / `grip`, `PanelContent.resize`, `PanelLayout.minimized` / `size`, `StagePick.control` / `handle`.
Type-level note: `StagePick` gains two **required** fields (`control`, `handle`) — only relevant if you construct a `StagePick`
yourself; the stage hands them to you.

## 0.14.0 — 2026-11-22

**`Panel3D.setTitle()` — a stage panel's title can change after it is created.** A host whose windows carry live
counts in their titles ("Open positions (6)", "Ledger (3)") had no way to keep one current: the title was a
`readonly` field fixed at creation, so a count meant rebuilding the panel (losing its scroll position and selection).

- `panel.setTitle(text)` repaints **only the title bar**, and **only when the text changed** — the same text is a
  no-op and invalidates nothing. `panel.title` is now a getter.
- A title too long for the bar is squeezed to fit (`fillText` `maxWidth`) instead of running off it.

Additive; nothing existing changes (`panel.title` still reads the text; it just can't be assigned directly any more —
it never was meant to be: it is a TypeScript `readonly` that is now a getter).

## 0.13.0 — 2026-11-21

**`gaugeContent()` — the gauge as a stage panel.** A gauge in a `CathodeStage3D` needs more than
`surfaceContent`: its needle has to ease to each new value and sweep in from centre on mount, the way
`CathodeGauge.vue`'s does. `gaugeContent({ width, height, ...props })` is a ready-made, read-only
`PanelContent` that draws the same picture `CathodeGauge` draws — the readout, the needle on a
left↔right axis, `marks`, the secondary `meter`, the caption, the note and one chip per item — with the
DOM component's easing (18% per frame, settled within 0.004) and defaults.

- `panel.content.update({ value, caption, items, … })` pushes new data: a new `value` eases the needle;
  any other prop repaints at once. `.shown` is the needle's animated position, `animate: false` snaps it,
  and `dispose()` stops the animation.
- `drawGauge` and `GaugeDrawOpts` are now exported (the package has no deep imports, so a host that wants
  to paint a gauge into its own canvas couldn't reach them).
- The stage demo (`/stage3d.html`) uses `gaugeContent` in place of a hand-rolled gauge.

New exports: `gaugeContent`, `drawGauge`, and the types `GaugeContentProps`, `GaugeContentOptions`,
`GaugeDrawOpts`. Additive; nothing existing changes.

## 0.12.0 — 2026-11-21

**CathodeStage3D grows up for a host app: overlay mode, facing, visibility.** The stage can now be
laid over ANOTHER three.js scene (a dashboard's 3D market view) and share its camera, instead of
owning the whole view. All additive; the stage's existing behaviour is unchanged.

- **Overlay mode.** `transparent` (an alpha canvas — clear wherever no panel is drawn),
  `fov` / `near` / `far` (match the scene beneath), `setCameraPose({ position, target })` /
  `getCameraPose()` (the host drives the camera, so panels share the scene's 3D space), and
  `passThrough`: the canvas takes no pointer events; the stage listens on `inputTarget` (capture
  phase, `document` by default) and picks by raycast. A press, click or wheel over a panel is
  handled **and stopped** — the scene's own orbit and plane clicks never see it, including the
  click that ends a press that began on a panel — and anywhere else it falls through untouched.
  A press on empty space releases the stage's keyboard focus; keys reach the focused panel from
  `window`, except while typing in an input / textarea / select / contenteditable.
  `shouldHandle(target)` excludes events that landed on DOM stacked above the stage, and `onCursor`
  routes cursor changes to the host (the canvas cursor is invisible under `passThrough`).
  Demo: `/stage3d-overlay.html`.
- **Facing.** `stage.facingPose(id, { margin })` is the camera pose that looks straight at a panel
  (title bar included) from the front, fitted to the view with a margin — pure, it moves nothing, so
  an overlay host applies it to its own camera. `stage.flyTo(pose, ms)` is an eased tween for a stage
  that owns its camera (resolves when it lands; a new flight replaces one in progress), and
  `setCameraPose` now keeps OrbitControls' pivot (`controls.target`) in step so the controls don't
  snap the camera back. `onPanelActivate(id)` fires on a title-bar double-click — the hook for
  "face this panel". The demo does exactly that.
- **Click count.** `PanelPointerEvent.detail` is the click count on `'click'` events (1, then 2 for a
  double-click), 0 for every other kind. `gridContent` forwards it as `event.detail` on `row-clicked`,
  so "double-click a row opens its chart" works in 3D the way it does in the DOM grid.
- **Visibility.** `stage.setPanelVisible(id, visible)` (or `visible:` on `addPanel`): a hidden panel
  isn't drawn, picked, painted or focused, and hiding releases its focus, hover, press and drag.
  `getLayout()` / `applyLayout()` carry `visible` alongside the position.

New exports: type `StageCameraPose`. Type changes to be aware of: `PanelPointerEvent` gains a
required `detail: number` (only matters if you CONSTRUCT these events yourself — a stage hands them
to your `PanelContent.pointer`), and `PanelLayout`, `PanelOptions` and `StageControls` gain optional
`visible` / `visible` / `target`.

## 0.11.0 — 2026-11-21

**Cathode in 3D space (experimental).** Every widget can now be a panel in ONE three.js scene
instead of a CSS window — one renderer, a perspective camera, panels that tilt, overlap and
recede, and pointer input by raycast. The DOM components are unchanged for existing consumers.

- **`CathodeStage3D`** — a `Panel3D` per surface (a surface mesh + a draggable title bar).
  Raycast input lands on the pixel actually drawn (through the CRT warp, bend included); drag a
  title bar to move a panel (ray–plane on its own plane); a press on a panel never orbits the
  camera, empty space does; the wheel goes to the panel under the cursor, elsewhere zooms; the
  pressed panel takes keyboard focus and is raised; `getLayout()` / `applyLayout()`; on-demand
  rendering. Camera controls are injected (`controls: (camera, el) => new OrbitControls(…)`) so
  the library doesn't bundle `three/addons`. Demo: `/stage3d.html`.
- **`PanelContent`**, **`gridContent()`**, **`surfaceContent()`** — what a panel shows and how it
  hears the pointer. `gridContent()` binds a headless grid (the filter popup is typed into
  directly — there is no DOM input in 3D); `surfaceContent()` is for painter-only widgets.
- **`CathodeSurface`** — the headless half of a widget: the offscreen canvas, its texture and the
  barrel / scanlines / vignette / magnify-lens shader, with no renderer, camera or DOM. Mode
  `'screen'` (clip-space quad, what the DOM widgets use) or `'world'` (model/view/projection, plus
  mipmaps and anisotropy) so the same material wears any mesh in any scene.
  `contentPoint(u, v)` is the CPU mirror of the warp for pointer routing; `barrelUV` / `lensUV`
  are exported. `createSurfaceMesh` / `resizeSurfaceMesh` put one on a plane.
- **`useGridModel`** — everything `CathodeGrid` knows and does (columns, rows, sort / filter /
  quick-filter, scroll, selection, the filter popup, column resize, keyboard navigation, the
  `GridApi`, the paint call) as a headless composable. Input arrives in canvas space
  (`GridPointer`), not DOM events. `CathodeGrid.vue` is now a thin DOM presenter over it
  (~1570 → ~580 lines) and `CathodeGauge.vue` a thin presenter over a surface — props, events and
  rendering are unchanged.

**Fix: convex hit-testing used a Y that was scaled by 0.15.** `CanvasGrid.applyBarrel` still
carried a leftover attenuation the shaders dropped long ago, so on a convex panel hover, clicks,
header sorts, resize handles and filter icons near the top and bottom landed up to ~0.15 of the
panel height away from the pixel under the cursor (flat and concave were exact). The CPU mirror
now applies the full bend on both axes — a visible improvement on the default convex look, and
the one behaviour change in this release for existing grid / candle-wall consumers.

Also: the grid's document click listener is actually removed on unmount (it was added without
capture and removed with it), its filter-caret timer is cleared, its texture and material are
released, and the no-WebGL 2D fallback now draws the aggregate row like the WebGL path.

New exports: `CathodeStage3D`, `Panel3D`, `gridContent`, `surfaceContent`, `CathodeSurface`,
`barrelUV`, `lensUV`, `createSurfaceMesh`, `resizeSurfaceMesh`, `useGridModel` and their types
(`CathodeStage3DOptions`, `PanelOptions`, `PanelLayout`, `StagePick`, `StageControls`,
`PanelContent`, `PanelPointerEvent`, `PanelPointerKind`, `GridContentOptions`,
`CathodeSurfaceOptions`, `SurfaceMode`, `SurfacePainter`, `SurfaceLook`, `GridModel`,
`GridModelOptions`, `GridHost`, `GridEmit`, `GridPointer`, `GridPaintOpts`, `SortKey`).

Not yet in 3D: Log / Candle / Container surfaces, panel minimise / maximise / resize, and a
world-space radius for the magnify lens (leave `magnify` off on stage panels for now).

## 0.10.0 — 2026-11-17

**CathodeGrid: shift-click multi-column sort.** Click a header to sort by it (asc → desc → off);
shift-click another header to *append* it as the next sort key — repeat while holding shift. A
plain click resets to that column alone. Headers show the direction arrow, plus the precedence
number (`▲1`, `▼2`) once more than one column is sorted. `getColumnState()` now returns every
sorted column with its `sortIndex`, `applyColumnState()` restores the order, and `ColDef.sortIndex`
orders several initial `sort` columns.

## 0.9.1 — 2026-11-14

**CathodeGauge: axis marks + a secondary meter.** `marks` draws labelled ticks on the main
axis (a dashed line through the track, the label under it — a second hurdle, a danger line);
`meter` draws a secondary bar between the axis and the caption: a label row (`label` left,
`hint` right), a filled track on `[min, max]` toned up / down / warn / neutral, threshold ticks
with their own labels, and the value (`valueText`) at the right — the shape of a margin guard.
`GaugeColors` gains `warn`. Exports: `GaugeMark`, `GaugeMeter`. Demo: the GAUGE tab shows both
(Tilt refills the meter too).

## 0.9.0 — 2026-11-14

**CathodeGauge — a real gauge through the pipeline.** A bipolar gauge surface: a readout (big
figure + stance + sub-line), a needle on a left↔right axis that eases to each new `value` (and
sweeps in from centre on mount), then an optional boxed caption, a dim note and a wrapping row
of item chips (`{ label, side, value, tone }`) — the shape of a long/short book's net-tilt
read-out, one chip per position, with nothing trading-specific baked in (poles, letters and copy
are props). Same barrel / scanlines / vignette / magnify-lens shader as the other surfaces, the
2D fallback when WebGL is unavailable, backing store at devicePixelRatio (crisp on retina),
context-loss recovery. Themes: none (transparent — inherits the host's glass), paper, phosphor,
amber; `colors` overrides the palette per instance. Demo: new GAUGE tab (Tilt). Exports:
`CathodeGauge`, `GaugeItem`, `GaugeColors`, `GAUGE_THEME_COLORS`.

## 0.8.4 / 0.8.3 — 2026-09
- Retina: CathodeGrid's composite texture and the candle wall render at devicePixelRatio
  (crisp gridlines / text / candles).

## 0.8.2 — 2026-09-12
- Narrow-cell pill suppression actually suppresses: hline labels default to the
  PRICE tag when label is undefined — the wall now passes label: '' (the one
  value drawHLine treats as "no pill").

## 0.8.1 — 2026-09-12
- Wall cells clip + ellipsize their headers (long titles — e.g. prediction-market
  questions — bled across neighboring cells) and drop overlay label pills below
  260px cell width (lines stay; the pills stacked into clutter at mini sizes).

## 0.8.0 — 2026-09-10

**CathodeCandleGrid — the chart wall.** N mini candle charts in ONE WebGL context:
each cell renders through the existing 2D pipeline (`drawCandle`) into a plain-2D
offscreen, the cells composite into one page canvas, and a single barrel shader warps
the whole wall as a sheet. Kills the ~16-WebGL-context cap that forced dashboards to
mount mini charts flat — and with bend-field, bending the wall slides MORE CELLS into
view. Cells carry title/badge/note/open-state chrome drawn in-canvas; clicks
inverse-map through the barrel to `cell-click(id)`; wheel scrolls overflow rows;
magnify lens works at the sheet level. Demo: new WALL tab (16 charts, one context).

## 0.7.0 — 2026-09-09

**Bend-field gain — distortion pays for data.** The bend's original promise ("edge
columns compress so more fits") was never physically true: the content canvas was
panel-sized, so the warp only distorted the same columns. Now (default on, prop
`bendField`) the offscreen content canvas widens by exactly the factor the warp can
absorb without cropping — `fieldScale(curvature)`: the concave fit-rescale k (+54%
width at −45) or the convex edge overflow (+16% at +45). Bending a panel SLIDES MORE
COLUMNS IN; columns hidden behind the horizontal scroll surface as the panel bends.
Concave absorbs ~3× more than convex — it is the "see more" direction.

- `screenToCanvas` gains texW/texH (screen-vs-texture split); hit-testing, hover,
  resize, filter popups and the overlay all track the widened field.
- Demo: "Field" checkbox to A/B the gain live.
- `bendField: false` restores the pre-0.7 purely-visual bend.

## 0.6.0 — 2026-09-09

**The overlay-surface architecture** — the first step toward canvas-native controls
("HTML in the room"): floating widgets drawn INTO the offscreen canvas after the body
pass, so they ride the same warp shader as the panel instead of floating flat above a
curved screen.

- **In-canvas filter popup** (first overlay citizen): panel, value, caret, and ✕ are
  drawn by `drawFilterPopup` and warp with the grid at any curvature; an invisible
  real `<input>` (the ghost) carries focus, IME, and keystrokes. Hit zones route
  through `hitFilterPopup` in canvas space, run before the grid's own hit paths, and
  widen with the local warp density. The document-level click-outside closer maps the
  point through the barrel before deciding "outside."
- Exported primitives: `layoutFilterPopup` / `drawFilterPopup` / `hitFilterPopup` /
  `OverlayBox` — the contract new overlay widgets (menus, dropdowns, tooltips, lists)
  will reuse.

## 0.5.3 — 2026-09-09
- Deep-concave header interactions: `hitScaleX` local-density probe scales the resize
  handle, filter icon, hover cursor, and drag delta so on-screen target size and drag
  feel stay constant at any bend.
- Onboarding: demo slider labels the bend direction; `npm run capture:bend` produces
  the signed-sweep `docs/bend.gif`; README embeds it.

## 0.5.2 — 2026-09-09
- Concave restored to the full dish + FIT-TO-CONTENT rescale (screen corners land
  exactly on texture corners): headers/edge content never crop at any strength; the
  edge-midpoint overshoot renders as the true pincushion silhouette.

## 0.5.1 — 2026-09-09 (superseded)
- Border-pinned concave — kept headers visible but flattened the look; replaced by
  0.5.2's fit rescale.

## 0.5.0 — 2026-09-09
- **Signed curvature (−45…45)**: negative bends CONCAVE. Mapping centralized in
  `curvatureToStrength`; CPU hit-testing mirrors the GPU.

## 0.4.0
- Opt-in variable row height via `ColDef.wrap`.

## 0.3.4
- WebGL context released on unmount (`forceContextLoss`).
