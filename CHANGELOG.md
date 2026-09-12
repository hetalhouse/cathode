# Changelog

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
