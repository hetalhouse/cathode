# Changelog

## 0.23.0 — 2026-11-25

**Pop-ups join the wall, never land on it.** The panels of a stage are a *wall* — upright, side by side in one plane. A pop-up (a detail view, a help panel, a chart opened from a row) now takes a
**free spot in that plane**, and the camera zooms to it; its restore button flies back to the view you had. All additive: nothing existing changes.

- **`stage.freeSpot({ w, h }, { near?, gap?, prefer? })`** — where a panel of that body size fits in the wall's plane without touching any panel that is there (`gap` px clear all round, default 24):
  the free spot nearest `near` (a panel id — a detail view opens beside its parent) or, without it, the wall's centre. `position` is the body's centre in world units — pass it to `addPanel`. Pure.
- **`stage.expand(id, { margin?, ms? })` / `unexpand(id?, { ms? })` / `toggleExpand(id)` / `expandedId`** — the maximize control's meaning in one place. *Expand* remembers the camera, marks the
  panel expanded (its maximize control shows "restore") and flies in until it fills the view; *unexpand* flies back to the view from before. Expanding another panel meanwhile keeps the
  **original** way back.
- **`stage.addPopup(options, { near?, gap?, prefer?, zoom?, margin?, ms? })`** — add the panel in a free spot (`options.position` is ignored), focus it and — unless `zoom: false` — expand it.
  **`stage.closePanel(id)`** removes a panel and, if it is the expanded one, flies back to the view from before.
- **Demo:** ⓘ on a panel opens a real pop-up beside it in the wall and zooms to it; □ restores the view, ✕ closes it and restores too.

New members: `CathodeStage3D.freeSpot` / `expand` / `unexpand` / `toggleExpand` / `expandedId` / `addPopup` / `closePanel`.

## 0.22.1 — 2026-11-25

**Docs and demo only — no library code changes.** The published README (what the npm page shows) now matches the demo.

- **README:** the 3D-workspace section's screenshots and zoom GIF are the current look — the workspace standing on a **floor grid**, its look driven by the demo's **Theme** drop-down
  (Default · Phosphor · Amber · Paper; the Day / Night buttons are gone). Text updated to match.
- **`examples/threejs-workspace.html`** (in the repository, not in the package): the same floor grid and a slightly raised home view.
- **Demo:** the 3D Workspace tab follows the Theme menu and lies on a shader floor grid in front of / below the panels (never drawn across their glass).

No API changes; `0.22.0` → `0.22.1` is safe to take.

## 0.22.0 — 2026-11-25

**Zoom the whole workspace out — and a 3D workspace to show it off.** Additive: nothing existing changes.

- **`stage.framePose(ids?, { margin?, minDistance? })`** — the camera pose that frames *several* panels at once (every title bar included), looking along their average facing:
  `await stage.flyTo(stage.framePose(), 800)` zooms out until everything is in view, wherever the panels were dragged. `ids` frames a subset; `minDistance` stops an Overview from ever being a
  zoom *in*. Pure, like `facingPose` — it moves nothing. `facingPose(id)` = zoom in on one panel; `framePose()` = zoom out to all of them.
- **The demo opens on a "3D Workspace" tab** (`?tab=<name>` opens any other): five live panels — a grid, a candle chart, a gauge, a wall of mini charts, a log — in one three.js scene, in the
  day (paper) theme, with scroll-to-zoom, **Overview**, **Recenter**, a □ that expands a panel (and back), a captioned **▶ Tour**, and a ☀ Day / ☾ Night switch that re-dresses the scene live.
- **`examples/threejs-workspace.html`** — a standalone three.js example: one HTML file, an import map, no build step.
- **README**: a new top section with screenshots and a zoom GIF (`npm run capture:workspace` reproduces them); the 3D section no longer splits the Props table.

New members: `CathodeStage3D.framePose`.

## 0.21.0 — 2026-11-24

**Grid view state in `GridApi`.** A host that shows one grid in two places — the dashboard's 2D window and its 3D stage panel — can now carry the grid's whole view between them. Filter and
column state were already in the API; this adds what was missing. Additive: nothing existing changes.

- **`getSortModel()` / `setSortModel([{ colId, sort }])`** — read or replace the sort (priority order kept). Unlike `applyColumnState`, which only ever *adds* a sort, `setSortModel([])` **clears** it.
- **`getScrollY()` / `setScrollY(y)`** — the vertical scroll offset in px. `setScrollY` clamps to the range and is applied after the pending sort / filter / data updates (those reset the scroll to
  the top), so it is safe to call straight after `setSortModel` / `setFilterModel` / `setGridOption('rowData', …)`; `getScrollY()` reflects it on the next tick.

With `getFilterModel()` / `setFilterModel()` and `getColumnState()` / `applyColumnState()` that is a grid's complete view: sort, filter, column widths / visibility, scroll.

New members on `GridApi` only (a host that *implements* `GridApi` itself needs the four methods).

## 0.20.0 — 2026-11-24

**Themeable title bars, a cockpit style, an ⓘ control, and a live-themeable Display menu.** A host whose theme changes — or whose 2D windows have a different look — can now dress
the 3D stage to match, live. All additive and opt-in: the default bar is unchanged, pinned pixel-for-pixel by a golden spec (11 states) generated before the change.

- **`barColors` / `stage.setBarColors(partial)`** — the title bars' palette: fill (resting / focused), bottom rule, text, action outlines, accent (hover / active fills, the status dot),
  active-action label, and the cockpit title colour. `DEFAULT_BAR_COLORS` is the original green-on-black bar.
- **`barStyle: 'plain' | 'cockpit'` / `stage.setBarStyle()`** — `'cockpit'` is what a dashboard's 2D windows wear: a glowing status dot, then a small, bold, tracked **UPPERCASE** title.
- **`PanelControl` gains `'info'`** — an ⓘ (drawn, hit-tested and ordered like the other controls); reported through `onPanelControl(id, 'info')`. What it does is the host's call.
- **`stage.setMenuColors(partial)`** — re-theme the in-scene Display menu live; an open menu repaints at once.

New exports: `DEFAULT_BAR_COLORS`; types `BarColors`, `BarStyle`. New options / members: `CathodeStage3DOptions.barColors` / `.barStyle`, `CathodeStage3D.barColors` / `.barStyle` /
`setBarColors` / `setBarStyle` / `setMenuColors`.
Type-level note: `PanelControl` gains a member (an exhaustive `switch` over it needs an `'info'` case) — only relevant if you switch over the union.

## 0.19.0 — 2026-11-23

**A wall of mini candle charts as a stage panel.** The dashboard's Charts window is a wall of small candle cards; `candleWallContent()` puts the same wall on a
`CathodeStage3D` panel. All additive: `CathodeCandleGrid`'s output is unchanged (pinned byte-identical by a golden spec generated before the lift).

- **`candleWallContent({ width, height, cells, theme?, minCellW?, cellAspect?, onCellClick? })`** — hover rings a cell, a click reports its id, the wheel scrolls a
  wall that overflows, a resize re-flows the columns (`floor(width / minCellW)`, default 210 px). `content.update({ cells, theme, … })` swaps the data.
- **`useCandleWallModel`** — the headless half (viewport, scroll, hovered cell, hit-testing, paint), and the pure wall maths shared with `CathodeCandleGrid`:
  **`layoutWall` / `wallCellAt` / `wallMaxScroll` / `drawWall`** (`src/CanvasCandleWall.ts`).
- **Fix:** `CathodeCandleGrid` laid out on the canvas's *physical* width, so a high-dpi screen got twice the columns of a twice-as-wide canvas; it now lays out in
  logical px (identical at dpr 1).

New exports: `candleWallContent`, `useCandleWallModel`, `layoutWall`, `wallCellAt`, `wallMaxScroll`, `drawWall`; types `CandleWallContentProps`,
`CandleWallContentOptions`, `WallModel`, `WallModelOptions`, `WallHost`, `WallPaintOpts`. `WallCell` is still exported from the same place.

## 0.18.0 — 2026-11-23

**Title-bar actions and a close control.** A `CathodeStage3D` panel can now be dismissed and can carry a picker in its title bar — what an on-demand
focus chart needs (an ✕ and its `5m / 15m / 1H / 1D` range buttons), and any panel that wants tabs. All additive: a panel without actions / close is unchanged.

- **`actions: [{ id, label, active? }]`** on `addPanel`: small **text buttons** drawn just left of the controls, with an **active** state (filled) and a hover
  highlight. A click is reported as `onPanelAction(panelId, actionId)` — never a drag, never the "face this panel" double-click. **`panel.setActions(next)`**
  moves the active mark and repaints the bar only if something changed. The title squeezes clear of them (the room maths is byte-identical when there are none).
- **`controls` gains `'close'`** (an ✕), reported through `onPanelControl(id, 'close')`; what closing means is the host's call.
- **`stage.clientPointForAction(id, actionId)`** for tests / tours; `StagePick` gains `action`.

New exports: type `PanelAction`. New options / members: `PanelOptions.actions`, `CathodeStage3DOptions.onPanelAction`, `Panel3D.actions` / `setActions` /
`actionRects` / `actionAt`, `CathodeStage3D.clientPointForAction`; `PanelControl` is now `'minimize' | 'maximize' | 'close'`.
Type-level notes: `StagePick` gains a **required** field (`action`), and `PanelControl` gains a member (an exhaustive `switch` over it needs a `'close'` case) —
only relevant if you construct a `StagePick` yourself or switch over the union.

## 0.17.0 — 2026-11-23

**The Display menu, drawn in the scene — and the hover magnifier on stage panels.** A right-click on a `CathodeStage3D` panel opens the CRT
"Display" menu as a small canvas-textured quad on THAT panel's own plane, a hair in front of it, so it tilts, bends and orbits with the panel
instead of floating over the page as DOM. All additive: nothing changes unless `displayMenu` is set.

- **`displayMenu: true | { colors }`** on the stage. Rows: **Scan lines · Glow · Magnify (hover lens)** and a **Bend** stepper (−40 … 40, step 2).
  Each change applies to the panel at once and is reported as `onPanelDisplay(id, { curvature, scanlines, glow, magnify })` so a host can persist
  it. **Cmd+Shift +/−** bends the hovered panel the same way (and reports it).
- A press on the menu never reaches the content beneath it; a press elsewhere, Escape, or starting a drag / resize closes it; it clamps to stay
  inside its panel; a right-click over a panel is consumed (the page's own context menu is not shown), on empty space it passes through.
- **Magnify now works on a stage panel.** The stage feeds the hit UV to the surface's lens, so with it on the hover lens follows the pointer over
  that panel and lets go when the pointer leaves or the switch goes off. (The lens keeps its fixed pixel radius — best on panels big enough to carry it.)
- **`panel.display` / `panel.setDisplay({ … })`** are the same switches in code (`panel.setLook` keeps them in sync);
  **`stage.openDisplayMenu(id)` / `closeDisplayMenu()` / `displayMenuPanel` / `clientPointForMenuRow(row)`** for tours and tests.
  `StagePick` gains `uv` (the raycast hit's UV on the plane).

New exports: types `PanelDisplay`, `MenuColors`, `MenuRow`. New options: `CathodeStage3DOptions.displayMenu` / `onPanelDisplay`.
New members: `Panel3D.display` / `setDisplay`, `CathodeStage3D.openDisplayMenu` / `closeDisplayMenu` / `displayMenuPanel` / `clientPointForMenuRow`.
Type-level note: `StagePick` gains a **required** field (`uv`) — only relevant if you construct a `StagePick` yourself; the stage hands them to you.

## 0.16.0 — 2026-11-22

**Log and Candle as stage panels.** `CathodeStage3D` could host a grid and a gauge; it can now host a log and a candle chart too.
Each follows the grid's recipe — the component's logic moves into a **headless model**, the component becomes a presenter over that model and
a shared `CathodeSurface`, and a `…Content()` adapter puts the same model on a stage. The two components behave exactly as before (pinned by
golden specs generated from the originals — see below). All additive.

- **`useLogModel`** — the log's logic, headless: entries → wrapped visual lines, vertical / horizontal scroll with **follow-the-tail**, hover,
  Excel-style line selection, keyboard (arrows / page / home / end / Cmd+A / Cmd+C / Escape), copy (the **entries**: timestamp + text, wrapped
  fragments rejoined), pan-to-scroll, and the paint. Canvas-space input; no DOM events or renderer.
- **`logContent()`** — the log as a stage panel: wheel, drag-pan (a pan is not a selection click), hover, click / shift-click, keys,
  `update({ entries, theme, wordWrap, … })`, and a resize that re-wraps (a log that was following the tail keeps following).
- **`useCandleModel`** — the chart's logic, headless: scroll anchored on the newest candle (clamped), **wheel zoom anchored on the candle under the
  cursor** (0.25–6×), shift-wheel / trackpad scroll, pan-to-scroll, the hover crosshair, the keyboard (←/→ pan, ↑/↓ zoom, Shift = a screenful,
  Home / End), and the paint.
- **`candleContent()`** — the candle chart as a stage panel: crosshair + OHLCV readout, zoom at the cursor, scroll, drag-pan, keys,
  `update({ candles, overlays, markers, theme, slotW, … })`, and a resize that re-fits the chart (more room, more candles).
- **`CathodeLog` and `CathodeCandle` are presenters** over those models and the shared `CathodeSurface` (each component's private copy of the
  barrel / scanline / vignette / lens shader is gone). Behaviour is unchanged: `tests/log-golden.spec.ts` and `tests/candle-golden.spec.ts` were
  generated from the ORIGINAL components (scripted real input on fixed data, hashing the canvas after every step, in three configurations each) and
  are identical after the refactor. `CathodeCandle`'s `flat` 2D pipeline and `preserveDrawingBuffer` (`toDataURL` export) are kept.
- **Crisper on high-dpi screens.** `drawLog` takes an optional `dpr` (default 1) and both components now keep a logical × dpr backing store, like
  the grid — text and candles are drawn at physical resolution instead of upscaled from CSS px. At dpr 1 the output is byte-identical.

New exports: `useLogModel`, `useCandleModel`, `logContent`, `candleContent`, types `LogModel` / `LogModelOptions` / `LogHost` / `LogPaintOpts`,
`CandleModel` / `CandleModelOptions` / `CandleHost` / `CandlePaintOpts`, `LogContentProps` / `LogContentOptions`, `CandleContentProps` /
`CandleContentOptions`. New option: `DrawLogOpts.dpr`.

Noticed and left as-is (kept for byte parity): in `CathodeLog`, a drag-pan ends with a click at the release point that selects that line (the model
resets its "moved" flag on mouse-up, before the click arrives). `logContent` guards against it on the stage.

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
