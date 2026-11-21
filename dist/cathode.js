import { defineComponent as Je, ref as z, reactive as en, watch as Q, nextTick as _e, computed as se, inject as Rt, onMounted as Ue, onUnmounted as Qe, openBlock as Me, createElementBlock as Te, normalizeStyle as Ke, createElementVNode as ue, withModifiers as ft, withKeys as En, createCommentVNode as qe, toDisplayString as Xe, createVNode as Hn, withDirectives as zn, vModelText as fl, provide as Dn, renderSlot as un, Transition as dl, withCtx as vl, Fragment as hl, renderList as ml, createTextVNode as gl, normalizeClass as pl, vShow as wl } from "vue";
import * as Y from "three";
const lt = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Header keeps modest opacity for contrast against rows.
    bg: "rgba(0,0,0,0)",
    headerBg: "rgba(18,18,42,0.65)",
    text: "#e8f2ff",
    textHeader: "#6a90b8",
    border: "#2a3a50",
    accent: "#40a0f0",
    rowAlt: "rgba(255,255,255,0.018)"
  },
  phosphor: {
    bg: "#060d06",
    headerBg: "#030703",
    text: "#33ff33",
    textHeader: "#00cc00",
    border: "#0a250a",
    accent: "#80ff80",
    rowAlt: "rgba(51,255,51,0.025)"
  },
  amber: {
    bg: "#0a0700",
    headerBg: "#060400",
    text: "#ffb000",
    textHeader: "#ffd000",
    border: "#2a1500",
    accent: "#ffd060",
    rowAlt: "rgba(255,176,0,0.025)"
  },
  paper: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through in day mode — same propagation pattern as 'none' (1c79043).
    // Header keeps a subtle white tint for contrast against rows.
    // Border bumped from #dee2e6 (very light grey, nearly invisible on
    // the brighter screen surface after the 2026-05-01 vignette/bg
    // changes) to #bfc8d4 — gridlines now read as proper rules.
    bg: "rgba(0,0,0,0)",
    headerBg: "rgba(255,255,255,0.65)",
    text: "#222222",
    textHeader: "#158cba",
    border: "#bfc8d4",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)"
  }
}, ke = 30, fn = 12, yl = 10, Vt = 14, Vn = 5;
function Ot() {
  return `${fn}px system-ui, -apple-system, sans-serif`;
}
function On(n, t, e) {
  const l = String(t ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const s = [];
  let o = "";
  for (const d of a) {
    const c = o ? o + " " + d : d;
    !o || n.measureText(c).width <= e ? o = c : (s.push(o), o = d);
  }
  return o && s.push(o), s.length ? s : [""];
}
function xl(n, t) {
  return Math.max(t, n * Vt + Vn * 2);
}
function mn(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let l = 0; l < t; l++) e[l + 1] = e[l] + (n[l] ?? 0);
  return e;
}
function Nt(n, t) {
  if (t <= 0) return 0;
  let e = 0, l = n.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    n[a] <= t ? e = a : l = a - 1;
  }
  return e;
}
const Nn = 28;
function bl(n, t) {
  if (typeof t == "function") return t(n);
  const e = n.filter((a) => a != null && a !== "");
  if (t === "count") return e.length;
  const l = e.map((a) => Number(a)).filter((a) => !Number.isNaN(a));
  if (l.length === 0) return null;
  switch (t) {
    case "sum":
      return l.reduce((a, s) => a + s, 0);
    case "avg":
      return l.reduce((a, s) => a + s, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function Fn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, s = n.height / l, o = lt[t.theme] ?? lt.none, { cols: d, rows: c, pinnedRows: f, rowHeight: u, scrollY: g, scrollX: m, glow: b } = t;
  e.clearRect(0, 0, a, s), e.fillStyle = o.bg, e.fillRect(0, 0, a, s), e.save(), e.beginPath(), e.rect(0, 0, a, s), e.clip();
  const k = f.length * u, C = t.aggregateRow ? Nn : 0, v = s - ke - k - C;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, a, ke), e.textBaseline = "middle", e.textAlign = "left";
  let h = -m;
  for (let i = 0; i < d.length; i++) {
    const w = d[i];
    if (h + w.width <= 0) {
      h += w.width;
      continue;
    }
    if (h >= a) break;
    const B = !!t.colFilters[w.colId], T = t.sorts.findIndex((O) => O.colId === w.colId), N = T >= 0, H = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, w.width, ke), e.clip(), e.font = `bold ${yl}px system-ui, -apple-system, sans-serif`, e.fillStyle = B ? o.accent : o.textHeader, b ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText(H, h + 8, ke / 2), e.shadowBlur = 4, e.fillText(H, h + 8, ke / 2), e.shadowBlur = 0) : e.fillText(H, h + 8, ke / 2), N) {
      const O = e.measureText(H).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent;
      const ae = t.sorts[T].dir === "asc" ? "▲" : "▼";
      e.fillText(t.sorts.length > 1 ? `${ae}${T + 1}` : ae, h + 8 + O + 4, ke / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = B ? o.accent : o.textHeader, e.globalAlpha = B ? 1 : 0.38, e.fillText("⌕", h + w.width - 20, ke / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(h + w.width - 0.5, 0), e.lineTo(h + w.width - 0.5, ke), e.stroke(), h += w.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ke - 0.5), e.lineTo(a, ke - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ke, a, v), e.clip();
  const R = t.rowHeights && t.rowHeights.length === c.length ? t.rowHeights : null, E = R ? mn(R, c.length) : null, P = (i) => E ? E[i] : i * u, M = (i) => R ? R[i] : u, y = E ? Nt(E, g) : Math.max(0, Math.floor(g / u));
  let I;
  if (E)
    for (I = y; I < c.length && P(I) < g + v; ) I++;
  else
    I = Math.min(c.length, Math.ceil((g + v) / u));
  const U = t.selectionAnchorRow ?? t.selectedRow, D = t.selectionAnchorCol ?? t.selectedCol, Z = t.selectedRow >= 0 && U >= 0 ? Math.min(t.selectedRow, U) : -1, q = t.selectedRow >= 0 && U >= 0 ? Math.max(t.selectedRow, U) : -1, V = t.selectedCol >= 0 && D >= 0 ? Math.min(t.selectedCol, D) : -1, J = t.selectedCol >= 0 && D >= 0 ? Math.max(t.selectedCol, D) : -1, $ = q > Z || J > V;
  let _ = Number.POSITIVE_INFINITY, te = Number.NEGATIVE_INFINITY, le = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY;
  const j = (i, w, B, T) => {
    b ? (e.shadowColor = T, e.shadowBlur = 12, e.fillText(i, w, B), e.shadowBlur = 6, e.fillText(i, w, B), e.shadowBlur = 2, e.fillText(i, w, B), e.shadowBlur = 0) : e.fillText(i, w, B);
  };
  for (let i = y; i < I; i++) {
    const w = c[i], B = M(i), T = ke + P(i) - g;
    i % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, T, a, B));
    const N = i >= Z && i <= q;
    i === t.hoveredRow && !N && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, T, a, B)), N && !$ && (e.fillStyle = tn(o.accent, 0.1), e.fillRect(0, T, a, B)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, T + B - 0.5), e.lineTo(a, T + B - 0.5), e.stroke();
    let H = -m;
    for (let O = 0; O < d.length; O++) {
      const ae = d[O];
      if (H + ae.width <= 0) {
        H += ae.width;
        continue;
      }
      if (H >= a) break;
      const oe = N && O >= V && O <= J;
      oe && $ && (e.fillStyle = tn(o.accent, 0.14), e.fillRect(H, T, ae.width, B)), oe && (H < _ && (_ = H), H + ae.width > te && (te = H + ae.width), T < le && (le = T), T + B > ee && (ee = T + B));
      const he = t.getCellStyle(ae, w), Ce = he.color ?? o.text, Ee = he.textAlign ?? "left", L = t.formatCell(ae, w);
      if (e.save(), e.beginPath(), e.rect(H + 1, T, ae.width - 2, B), e.clip(), e.font = Ot(), e.fillStyle = Ce, e.textBaseline = "middle", ae.colDef.wrap) {
        e.textAlign = "left";
        const G = On(e, L, Math.max(20, ae.width - 16));
        let re = T + Vn + Vt / 2;
        for (const xe of G) {
          if (re - Vt / 2 >= T + B) break;
          j(xe, H + 8, re, Ce), re += Vt;
        }
      } else {
        const G = Ee === "right" ? H + ae.width - 8 : H + 8;
        e.textAlign = Ee === "right" ? "right" : "left", j(L, G, T + B / 2, Ce);
      }
      e.restore(), i === t.selectedRow && O === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(H + 1.5, T + 1.5, ae.width - 3, B - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(H + ae.width - 0.5, T), e.lineTo(H + ae.width - 0.5, T + B), e.stroke(), H += ae.width;
    }
  }
  if ($ && _ < te && le < ee && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(_ + 0.5, le + 0.5, te - _ - 1, ee - le - 1)), e.restore(), f.length > 0) {
    const i = s - k - C;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(a, i - 0.5), e.stroke();
    for (let w = 0; w < f.length; w++) {
      const B = f[w], T = i + w * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, T, a, u);
      let N = -m;
      for (let H = 0; H < d.length; H++) {
        const O = d[H];
        if (N + O.width <= 0) {
          N += O.width;
          continue;
        }
        if (N >= a) break;
        const ae = t.getCellStyle(O, B), oe = ae.color ?? o.text, he = ae.textAlign ?? "left", Ce = t.formatCell(O, B);
        e.save(), e.beginPath(), e.rect(N + 1, T, O.width - 2, u), e.clip(), e.font = `bold ${fn}px system-ui, -apple-system, sans-serif`, e.fillStyle = oe, e.textBaseline = "middle", he === "right" ? (e.textAlign = "right", e.fillText(Ce, N + O.width - 8, T + u / 2)) : (e.textAlign = "left", e.fillText(Ce, N + 8, T + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(N + O.width - 0.5, T), e.lineTo(N + O.width - 0.5, T + u), e.stroke(), N += O.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, T + u - 0.5), e.lineTo(a, T + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const i = s - C;
    e.fillStyle = tn(o.accent, 0.1), e.fillRect(0, i, a, C), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(a, i - 0.5), e.stroke();
    let w = -m;
    for (let B = 0; B < d.length; B++) {
      const T = d[B];
      if (w + T.width <= 0) {
        w += T.width;
        continue;
      }
      if (w >= a) break;
      const H = t.getCellStyle(T, t.aggregateRow).textAlign ?? "left", O = t.aggregateRow[T.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, i, T.width - 2, C), e.clip(), e.font = `bold ${fn}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", b && (e.shadowColor = o.accent, e.shadowBlur = 8), H === "right" ? (e.textAlign = "right", e.fillText(O, w + T.width - 8, i + C / 2)) : (e.textAlign = "left", e.fillText(O, w + 8, i + C / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + T.width - 0.5, i), e.lineTo(w + T.width - 0.5, i + C), e.stroke(), w += T.width;
    }
  }
  e.restore();
}
function tn(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), a = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${t})`;
}
const $t = 190, nn = 34;
function Sl(n, t, e) {
  const l = Math.max(4, Math.min(t, n - $t - 4)), a = ke + 6, s = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: $t, h: nn },
    input: { x: l + 9, y: a + 5, w: $t - 18 - s, h: nn - 10 },
    clear: e ? { x: l + $t - 28, y: a, w: 28, h: nn } : null
  };
}
const ln = (n, t, e, l = 0) => n >= e.x - l && n <= e.x + e.w + l && t >= e.y && t <= e.y + e.h;
function Ht(n, t, e, l = 1) {
  return e.clear && ln(n, t, e.clear, 4 * (l - 1)) ? "clear" : ln(n, t, e.input) ? "input" : ln(n, t, e.box) ? "inside" : "outside";
}
function Ml(n, t, e, l, a) {
  const { box: s, input: o, clear: d } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = a.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(o.x, o.y, o.w, o.h, 3), n.fill(), n.beginPath(), n.rect(o.x, o.y, o.w, o.h), n.clip(), n.font = Ot(), n.textBaseline = "middle";
  const c = o.y + o.h / 2 + 1, f = 5;
  if (e) {
    n.fillStyle = a.text;
    const u = n.measureText(e).width, g = u > o.w - 2 * f - 2 ? o.x + o.w - f - 2 - u : o.x + f;
    n.fillText(e, g, c), l && (n.fillStyle = a.accent, n.fillRect(Math.min(g + u + 1, o.x + o.w - f), o.y + 4, 1.5, o.h - 8));
  } else
    n.fillStyle = a.textHeader, n.fillText("Filter…", o.x + f, c), l && (n.fillStyle = a.accent, n.fillRect(o.x + f, o.y + 4, 1.5, o.h - 8));
  n.restore(), d && (n.save(), n.font = Ot(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = a.textHeader, n.fillText("✕", d.x + d.w / 2, d.y + d.h / 2 + 1), n.restore());
}
function Tl(n, t, e) {
  const l = n - 0.5, a = t - 0.5, s = Math.abs(e), o = (l * l + a * a) * s;
  if (e < 0) {
    const f = 0.5 * s, g = 1 / (1 - 2 * (0.5 * (1 + f) * f)), m = (l + l * (1 + o) * o * -1) * g, b = (a + a * (1 + o) * o * -1) * g;
    return [0.5 + m, 0.5 + b];
  }
  const d = l * (1 + o) * o, c = a * (1 + o) * o;
  return [n + d, t + c * 0.15];
}
function Xn(n, t, e, l, a, s = e, o = l) {
  const d = n / e, c = 1 - t / l, [f, u] = Tl(d, c, a);
  return f < 0 || f > 1 || u < 0 || u > 1 ? [-1, -1] : [f * s, (1 - u) * o];
}
function an(n, t) {
  let e = 0;
  for (let l = 0; l < n; l++) e += t[l].width;
  return e;
}
function Cl(n, t, e, l = 1) {
  return n >= t + e - 24 * l && n < t + e;
}
function An(n, t, e, l = 1) {
  const a = t + e;
  return n >= a - 6 * l && n <= a + 1 * l;
}
function _n(n, t, e, l, a, s, o, d, c, f = !1, u) {
  const g = n + c;
  let m = -1, b = 0;
  for (let R = 0; R < e.length; R++) {
    if (g >= b && g < b + e[R].width) {
      m = R;
      break;
    }
    b += e[R].width;
  }
  if (t < ke) return { area: "header", colIdx: m, rowIdx: -1 };
  const k = f ? Nn : 0;
  if (k > 0 && t >= o - k)
    return { area: "agg", colIdx: m, rowIdx: -1 };
  const C = d * a;
  if (C > 0 && t >= o - C - k) {
    const R = Math.floor((t - (o - C - k)) / a);
    return { area: "pinned", colIdx: m, rowIdx: R };
  }
  const v = t - ke + s, h = u && u.length === l ? Nt(mn(u, l), v) : Math.floor(v / a);
  return h >= 0 && h < l ? { area: "body", colIdx: m, rowIdx: h } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function je(n) {
  return n / 45 * 0.55;
}
function Un(n) {
  const t = Math.abs(je(n));
  if (t === 0) return 1;
  if (n < 0) {
    const l = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const kl = 500, Ll = kl / 2, Rl = 1.6, It = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Et = `
  // Pull sample position toward mouse when within lens radius — compresses
  // the sampled region so it displays magnified. Distance is computed in
  // aspect-corrected space (x scaled by W/H) so the lens is circular in
  // pixels regardless of canvas proportions; the inverse aspect scale is
  // applied when reconstructing the sample UV.
  //
  // Magnification is FLAT across the inner ~88% of the lens, then tapers
  // through the outer rim — just enough taper to read as a real glass curl
  // at the edge without becoming a fish-eye orb. The inner-flat percentage
  // (smoothstep first arg) controls how much "magnifier" vs "convex" the
  // lens reads as: smaller number = more orb-like.
  vec2 applyLens(vec2 uv) {
    if (uLensR <= 0.0) return uv;
    vec2  d    = (uv - uMouseUV) * vec2(uAspect, 1.0);
    float dist = length(d);
    if (dist >= uLensR) return uv;
    float t    = dist / uLensR;
    float zoom = mix(uLensZoom, 1.0, smoothstep(0.88, 1.0, t));
    vec2  newD = (d / zoom) * vec2(1.0 / uAspect, 1.0);
    return uMouseUV + newD;
  }
`, Dt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Ft() {
  return {
    uMouseUV: { value: new Y.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Rl },
    uLensTint: { value: new Y.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const ve = { x: -999, y: -999 };
function At(n, t, e, l, a) {
  const s = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = s && a > 0 ? Ll / a : 0, n.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function _t(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const Il = ["value"], El = ["disabled"], Dl = ["disabled"], Fl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Al = 28, _l = 600, Bl = /* @__PURE__ */ Je({
  __name: "CathodeGrid",
  props: {
    columnDefs: {},
    rowData: { default: () => [] },
    rowHeight: { default: 28 },
    defaultColDef: {},
    getRowStyle: {},
    pinnedBottomRowData: {},
    pagination: { type: Boolean, default: !0 },
    paginationPageSize: { default: 200 },
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    magnify: { type: Boolean, default: !1 },
    bendField: { type: Boolean, default: !0 }
  },
  emits: ["grid-ready", "row-clicked", "cell-selected", "column-resized", "sort-changed", "filter-changed"],
  setup(n, { emit: t }) {
    const e = n, l = t, a = z(e.rowData ?? []), s = z(e.pinnedBottomRowData ?? []), o = z(""), d = z([]), c = en({}), f = en({}), u = en(/* @__PURE__ */ new Set()), g = z(0), m = z(0), b = z(0), k = z(0), C = z(0), v = z(0), h = z(0), R = z(-1), E = z(null), P = z(null), M = z(null), y = { ...ve }, I = z(""), U = z(0), D = z(null);
    let Z = null;
    const q = z(!0);
    let V = null;
    Q(M, (r) => {
      var p;
      V && (clearInterval(V), V = null), r ? (q.value = !0, V = setInterval(() => {
        q.value = !q.value, ye();
      }, 530), _e(() => {
        var x;
        return (x = D.value) == null ? void 0 : x.focus();
      })) : (Z = null, (p = D.value) == null || p.blur()), ye();
    });
    function J(r) {
      return r.colId ?? r.field ?? (r.headerName ? r.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const $ = se(() => {
      const r = e.defaultColDef ?? {};
      return e.columnDefs.filter((p) => !u.has(J(p))).map((p) => {
        const x = J(p), A = { ...r, ...p };
        return { colId: x, colDef: A, width: f[x] ?? A.width ?? 100 };
      });
    }), _ = se(() => {
      const r = m.value;
      if (!r) return $.value;
      const p = $.value.reduce((F, W) => F + W.width, 0);
      if (!p || p >= r) return $.value;
      const x = r / p;
      let A = 0;
      return $.value.map((F, W) => {
        const ne = W === $.value.length - 1 ? r - A : Math.max(8, Math.round(F.width * x));
        return A += ne, { ...F, width: ne };
      });
    }), te = se(() => {
      const r = _.value.reduce((p, x) => p + x.width, 0);
      return Math.max(0, r - m.value);
    });
    let le = null;
    function ee() {
      if (typeof document > "u") return null;
      le || (le = document.createElement("canvas"));
      const r = le.getContext("2d");
      return r && (r.font = Ot()), r;
    }
    const j = se(() => _.value.some((r) => r.colDef.wrap)), i = se(() => {
      if (!j.value) return null;
      const r = ee();
      if (!r) return null;
      const p = _.value.filter((A) => A.colDef.wrap), x = e.rowHeight;
      return L.value.map((A) => {
        let F = 1;
        for (const W of p) {
          const X = On(r, he(W, A), Math.max(20, W.width - 16));
          X.length > F && (F = X.length);
        }
        return xl(F, x);
      });
    }), w = se(
      () => i.value ? mn(i.value, L.value.length) : null
    ), B = se(
      () => w.value ? w.value[L.value.length] : L.value.length * e.rowHeight
    ), T = se(() => {
      const r = s.value.length * e.rowHeight;
      return Math.max(0, b.value - ke - r);
    }), N = se(
      () => Math.max(0, B.value - T.value)
    ), H = se(
      () => Math.max(1, Math.floor(T.value / e.rowHeight))
    ), O = se(() => {
      const r = L.value.length;
      if (r === 0) return 0;
      const p = w.value ? Nt(w.value, v.value) : Math.floor(v.value / e.rowHeight);
      return Math.min(r - 1, p);
    }), ae = se(() => {
      const r = L.value.length;
      return r === 0 ? 0 : w.value ? Math.min(r - 1, Nt(w.value, v.value + T.value - 1)) : Math.min(r - 1, O.value + H.value - 1);
    });
    function oe(r, p) {
      if (p.colDef.valueGetter) return p.colDef.valueGetter({ data: r, colDef: p.colDef });
      if (p.colDef.field) return r[p.colDef.field];
    }
    function he(r, p) {
      const x = oe(p, r);
      return r.colDef.valueFormatter ? r.colDef.valueFormatter({ value: x, data: p, colDef: r.colDef }) ?? "" : r.colDef.cellRenderer ? (r.colDef.cellRenderer({ value: x, data: p, colDef: r.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function Ce(r, p) {
      return r.colDef.cellStyle ? typeof r.colDef.cellStyle == "function" ? r.colDef.cellStyle({ value: oe(p, r), data: p, colDef: r.colDef }) ?? {} : r.colDef.cellStyle : {};
    }
    function Ee() {
      return e.columnDefs.map((r, p) => ({ d: r, i: p })).filter(({ d: r }) => r.sort).sort((r, p) => (r.d.sortIndex ?? r.i) - (p.d.sortIndex ?? p.i)).map(({ d: r }) => ({ colId: J(r), dir: r.sort }));
    }
    const L = se(() => {
      g.value;
      let r = a.value;
      const p = o.value.trim().toLowerCase();
      p && (r = r.filter(
        (A) => $.value.some(
          (F) => String(oe(A, F) ?? "").toLowerCase().includes(p)
        )
      ));
      for (const [A, F] of Object.entries(c)) {
        if (!F) continue;
        const W = $.value.find((X) => X.colId === A);
        if (W)
          if (F.startsWith("__eq__")) {
            const X = F.slice(6).toLowerCase();
            r = r.filter((ne) => String(oe(ne, W) ?? "").toLowerCase() === X);
          } else {
            const X = F.toLowerCase();
            r = r.filter((ne) => String(oe(ne, W) ?? "").toLowerCase().includes(X));
          }
      }
      const x = d.value.map(({ colId: A, dir: F }) => ({ col: $.value.find((W) => W.colId === A), dir: F })).filter((A) => !!A.col);
      return x.length && (r = [...r].sort((A, F) => {
        for (const { col: W, dir: X } of x) {
          const ne = oe(A, W), pe = oe(F, W);
          let we = 0;
          if (W.colDef.comparator ? we = W.colDef.comparator(ne, pe) : typeof ne == "number" && typeof pe == "number" ? we = ne - pe : we = String(ne ?? "").localeCompare(String(pe ?? ""), void 0, { numeric: !0 }), we) return X === "asc" ? we : -we;
        }
        return 0;
      })), r;
    }), G = se(() => {
      const r = $.value.filter((F) => F.colDef.aggFunc != null);
      if (r.length === 0) return null;
      const p = L.value, x = {};
      for (const F of r) {
        const W = p.map((ne) => oe(ne, F)), X = bl(W, F.colDef.aggFunc);
        if (X == null) {
          x[F.colId] = "";
          continue;
        }
        x[F.colId] = F.colDef.aggValueFormatter ? F.colDef.aggValueFormatter(X) : String(X);
      }
      const A = r[0].colId;
      return x[A] === "" && (x[A] = "Σ"), x;
    });
    Q(L, () => {
      v.value = 0, E.value = null;
    }), Q(te, () => {
      h.value = Math.min(h.value, te.value);
    }), Q(N, () => {
      v.value = Math.min(v.value, N.value);
    });
    function re(r) {
      const p = w.value, x = p ? p[r] : r * e.rowHeight, A = p ? p[r + 1] : x + e.rowHeight;
      x < v.value ? v.value = x : A > v.value + T.value && (v.value = Math.min(N.value, A - T.value));
    }
    function xe() {
      v.value = Math.max(0, v.value - T.value), ye();
    }
    function De() {
      v.value = Math.min(N.value, v.value + T.value), ye();
    }
    let Fe = !1, it = "", ht = 0, st = 0, tt = 1, He = !1, Ie = !1, Be = 0, nt = 0, mt = 0, Pe = 0, Ge = !1;
    function Bt(r, p, x = 1) {
      var A;
      Fe = !0, it = r, ht = p, tt = x, st = ((A = _.value.find((F) => F.colId === r)) == null ? void 0 : A.width) ?? 100, He = !1;
    }
    function Wt(r) {
      if (Ie) {
        const W = Be - r.clientX, X = nt - r.clientY;
        (Math.abs(W) > 4 || Math.abs(X) > 4) && (Ge = !0), h.value = Math.max(0, Math.min(te.value, mt + W)), v.value = Math.max(0, Math.min(N.value, Pe + X)), ye();
        return;
      }
      if (!Fe) return;
      const p = m.value, x = Math.max(30, st + (r.clientX - ht) * tt), A = $.value.filter((W) => W.colId !== it).reduce((W, X) => W + X.width, 0), F = p - x;
      F > 10 && (f[it] = Math.max(10, Math.round(x * A / F))), ye();
    }
    function Pt() {
      Ie && (Ge && (He = !0), Ie = !1), Fe && (Fe = !1, He = !0, l("column-resized"));
    }
    function S(r) {
      if (r.touches.length !== 1) return;
      const p = r.touches[0];
      Ie = !0, Ge = !1, Be = p.clientX, nt = p.clientY, mt = h.value, Pe = v.value;
    }
    function K(r) {
      if (!Ie || r.touches.length !== 1) return;
      r.preventDefault();
      const p = r.touches[0], x = Be - p.clientX, A = nt - p.clientY;
      (Math.abs(x) > 4 || Math.abs(A) > 4) && (Ge = !0), h.value = Math.max(0, Math.min(te.value, mt + x)), v.value = Math.max(0, Math.min(N.value, Pe + A)), ye();
    }
    function ce() {
      Ie && (Ge && (He = !0), Ie = !1);
    }
    const be = z(null), ie = z(null), ze = Rt("cathodeResetTick", z(0));
    Q(ze, () => pt());
    let me = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), fe = null, Ae = !1;
    function Zn() {
      if (fe) {
        try {
          fe.forceContextLoss();
        } catch {
        }
        try {
          fe.dispose();
        } catch {
        }
        fe = null;
      }
    }
    let qt, bn, Ve, We, de;
    const Jn = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${It}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): the full 0.5.0 dish, plus a fit-to-content rescale. The
    // raw inward map samples a shrunken region, so the texture's outer
    // margin (headers, edge columns) was never displayed at high strength.
    // Scaling the sampled field so the screen CORNERS land exactly on the
    // texture corners guarantees every content pixel is drawn; the sampled
    // range then overshoots [0,1] at the edge MIDPOINTS, which renders as
    // the classic pincushion silhouette — content pinching inward on each
    // side, corners touching, the header riding the bowed top edge.
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;                        // corner dist = |cc|²·as at (.5,.5)
      float cp = 0.5 * (1.0 + cd) * cd;           // corner inward pull
      m /= (1.0 - 2.0 * cp);                      // corners → exactly ±0.5
    }
    return vec2(0.5) + m;
  }

  ${Et}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${Dt}

    gl_FragColor = color;
  }
`;
    function Sn() {
      if (!(!ie.value || !be.value)) {
        de = document.createElement("canvas");
        try {
          fe = new Y.WebGLRenderer({ canvas: ie.value, antialias: !1, alpha: !0 });
        } catch {
          Ae = !0;
        }
        if (!Ae && !fe.getContext() && (fe.dispose(), fe = null, Ae = !0), Ae) {
          gt();
          return;
        }
        fe.setPixelRatio(1), fe.setClearColor(0, 0), qt = new Y.Scene(), bn = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), We = new Y.CanvasTexture(de), We.minFilter = Y.LinearFilter, We.magFilter = Y.LinearFilter, Ve = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: We },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new Y.Color(0) },
            ...Ft()
          },
          vertexShader: Fl,
          fragmentShader: Jn,
          transparent: !0
        }), qt.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), Ve)), gt();
      }
    }
    function gt() {
      if (!be.value || !fe && !Ae) return;
      const r = be.value.clientWidth, p = be.value.clientHeight - (e.pagination ? Al : 0);
      if (!r || !p) return;
      k.value = r, C.value = p;
      const x = e.bendField ? Math.round(r * Un(e.curvature)) : r;
      me = Math.min(window.devicePixelRatio || 1, 2);
      const A = Math.round(x * me), F = Math.round(p * me), W = de.width !== A || de.height !== F;
      de.width = A, de.height = F, m.value = x, b.value = p, h.value = Math.max(0, Math.min(te.value, h.value)), v.value = Math.max(0, Math.min(N.value, v.value)), fe ? (W && We && (We.dispose(), We = new Y.CanvasTexture(de), We.minFilter = Y.LinearFilter, We.magFilter = Y.LinearFilter, Ve && (Ve.uniforms.uTex.value = We)), fe.setPixelRatio(me), fe.setSize(r, p)) : ie.value && (ie.value.width = Math.round(r * me), ie.value.height = Math.round(p * me), ie.value.style.width = r + "px", ie.value.style.height = p + "px"), ye();
    }
    function ye() {
      var x, A, F, W, X, ne, pe, we;
      if (!(de != null && de.width)) return;
      if (Ae) {
        if (!ie.value) return;
        Fn(de, {
          cols: _.value,
          rows: L.value,
          pinnedRows: s.value,
          rowHeight: e.rowHeight,
          rowHeights: i.value ?? void 0,
          scrollY: v.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sorts: d.value,
          colFilters: c,
          hoveredRow: R.value,
          selectedRow: ((x = E.value) == null ? void 0 : x.row) ?? -1,
          selectedCol: ((A = E.value) == null ? void 0 : A.col) ?? -1,
          selectionAnchorRow: ((F = P.value) == null ? void 0 : F.row) ?? -1,
          selectionAnchorCol: ((W = P.value) == null ? void 0 : W.col) ?? -1,
          formatCell: he,
          getCellStyle: Ce,
          dpr: me
        }), Mn();
        const Oe = ie.value.getContext("2d");
        Oe && Oe.drawImage(de, 0, 0, de.width, de.height, 0, 0, ie.value.width, ie.value.height);
        return;
      }
      if (!fe || !Ve || !We) return;
      const r = lt[e.theme] ?? lt.none, p = e.theme === "paper";
      Ve.uniforms.uStrength.value = je(e.curvature), Ve.uniforms.uScanlines.value = e.scanlines && !p ? 1 : 0, Ve.uniforms.uVignette.value = p ? 0 : 1, Ve.uniforms.uBezel.value.set(r.bg), At(Ve, e.magnify, y, k.value || de.width, C.value || de.height), Fn(de, {
        cols: _.value,
        rows: L.value,
        pinnedRows: s.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: i.value ?? void 0,
        scrollY: v.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sorts: d.value,
        colFilters: c,
        hoveredRow: R.value,
        selectedRow: ((X = E.value) == null ? void 0 : X.row) ?? -1,
        selectedCol: ((ne = E.value) == null ? void 0 : ne.col) ?? -1,
        selectionAnchorRow: ((pe = P.value) == null ? void 0 : pe.row) ?? -1,
        selectionAnchorCol: ((we = P.value) == null ? void 0 : we.col) ?? -1,
        formatCell: he,
        getCellStyle: Ce,
        aggregateRow: G.value,
        dpr: me
      }), Mn(), We.needsUpdate = !0, fe.render(qt, bn);
    }
    function Mn() {
      if (!M.value || !(de != null && de.width)) return;
      const r = de.getContext("2d");
      if (!r) return;
      r.setTransform(me, 0, 0, me, 0, 0), Z = Sl(de.width / me, U.value, !!I.value);
      const p = lt[e.theme] ?? lt.none;
      Ml(r, Z, I.value, q.value, p);
    }
    function jt(r, p) {
      if (!ie.value) return [-1, -1];
      const x = ie.value.getBoundingClientRect(), A = r - x.left, F = p - x.top, W = x.width, X = x.height, ne = je(e.curvature), [pe, we] = Xn(A, F, W, X, ne, de.width / me || W, de.height / me || X);
      return pe < 0 ? [-1, -1] : [pe, we];
    }
    function Yt(r) {
      return jt(r.clientX, r.clientY);
    }
    function ct(r) {
      if (!ie.value) return 1;
      const [p] = jt(r.clientX - 4, r.clientY), [x] = jt(r.clientX + 4, r.clientY);
      return p < 0 || x < 0 ? 1 : Math.max(1, Math.abs(x - p) / 8);
    }
    let Zt = 0;
    function Qn(r) {
      M.value = null;
      const p = Date.now();
      if (r.deltaX !== 0) {
        Zt = p, h.value = Math.max(0, Math.min(te.value, h.value + r.deltaX)), ye();
        return;
      }
      if (r.shiftKey && r.deltaY !== 0) {
        Zt = p, h.value = Math.max(0, Math.min(te.value, h.value + r.deltaY)), ye();
        return;
      }
      p - Zt < _l || (v.value = Math.max(0, Math.min(N.value, v.value + r.deltaY)), ye());
    }
    function el(r) {
      if (Fe) return;
      if (e.magnify && ie.value) {
        const F = _t(r, ie.value);
        y.x = F.x, y.y = F.y;
      }
      const [p, x] = Yt(r);
      if (p < 0) {
        R.value = -1, ye();
        return;
      }
      if (M.value && Z) {
        const F = Ht(p, x, Z, ct(r));
        if (F !== "outside") {
          R.value = -1, ie.value.style.cursor = F === "clear" ? "pointer" : "text", ye();
          return;
        }
      }
      const A = _n(
        p,
        x,
        _.value,
        L.value.length,
        e.rowHeight,
        v.value,
        b.value,
        s.value.length,
        h.value,
        G.value !== null,
        i.value ?? void 0
      );
      if (R.value = A.area === "body" ? A.rowIdx : -1, A.area === "header" && A.colIdx >= 0) {
        const F = _.value[A.colIdx], W = an(A.colIdx, _.value), X = p + h.value;
        ie.value.style.cursor = F && An(X, W, F.width, ct(r)) ? "col-resize" : "pointer";
      } else A.area === "body" ? ie.value.style.cursor = "pointer" : ie.value.style.cursor = "default";
      ye();
    }
    function tl() {
      R.value = -1, y.x = ve.x, y.y = ve.y, ye();
    }
    function nl(r) {
      const [p, x] = Yt(r);
      if (p < 0 || M.value && Z && Ht(p, x, Z, ct(r)) !== "outside") return;
      if (x >= ke) {
        Ie = !0, Ge = !1, Be = r.clientX, nt = r.clientY, mt = h.value, Pe = v.value;
        return;
      }
      const A = p + h.value, F = ct(r);
      for (let W = 0; W < _.value.length; W++) {
        const X = _.value[W], ne = an(W, _.value);
        if (X.colDef.resizable !== !1 && An(A, ne, X.width, F)) {
          Bt(X.colId, r.clientX, F);
          return;
        }
      }
    }
    function ll(r) {
      var F, W, X;
      if (He) {
        He = !1;
        return;
      }
      if (Fe) return;
      const [p, x] = Yt(r);
      if (p < 0) {
        M.value = null;
        return;
      }
      if (M.value && Z) {
        const ne = Ht(p, x, Z, ct(r));
        if (ne === "clear") {
          Cn();
          return;
        }
        if (ne !== "outside") {
          (F = D.value) == null || F.focus();
          return;
        }
        M.value = null;
      }
      const A = _n(
        p,
        x,
        _.value,
        L.value.length,
        e.rowHeight,
        v.value,
        b.value,
        s.value.length,
        h.value,
        G.value !== null,
        i.value ?? void 0
      );
      if (A.area === "header" && A.colIdx >= 0) {
        const ne = _.value[A.colIdx], pe = an(A.colIdx, _.value), we = p + h.value;
        if (ne.colDef.filter && Cl(we, pe, ne.width, ct(r)))
          r.stopPropagation(), M.value === ne.colId ? M.value = null : (M.value = ne.colId, I.value = (W = c[ne.colId]) != null && W.startsWith("__eq__") ? c[ne.colId].slice(6) : c[ne.colId] ?? "", U.value = Math.max(0, pe - h.value));
        else if (ne.colDef.sortable !== !1) {
          M.value = null;
          const Oe = d.value.find((Ne) => Ne.colId === ne.colId), ut = Oe ? Oe.dir === "asc" ? "desc" : null : "asc";
          r.shiftKey ? d.value = Oe ? ut ? d.value.map((Ne) => Ne.colId === ne.colId ? { colId: Ne.colId, dir: ut } : Ne) : d.value.filter((Ne) => Ne.colId !== ne.colId) : [...d.value, { colId: ne.colId, dir: "asc" }] : d.value = ut ? [{ colId: ne.colId, dir: ut }] : [], l("sort-changed");
        }
        return;
      }
      if (M.value = null, A.area === "body" && A.rowIdx >= 0 && A.colIdx >= 0) {
        const ne = A.rowIdx;
        r.shiftKey && E.value ? (P.value || (P.value = { ...E.value }), E.value = { row: ne, col: A.colIdx }) : (E.value = { row: ne, col: A.colIdx }, P.value = { row: ne, col: A.colIdx }), (X = ie.value) == null || X.focus();
        const pe = L.value[ne], we = _.value[A.colIdx];
        pe && we && (l("row-clicked", { data: pe, event: r }), l("cell-selected", { data: pe, row: ne, col: A.colIdx, colId: we.colId }));
      }
    }
    function Tn(r) {
      if (M.value) {
        if (r.target === ie.value && Z) {
          const [p, x] = Yt(r);
          if (p >= 0 && Ht(p, x, Z, ct(r)) !== "outside") return;
        }
        M.value = null;
      }
    }
    function al(r) {
      var F;
      if (!m.value) return;
      let p = 0;
      for (let W = 0; W < r; W++) p += _.value[W].width;
      const x = ((F = _.value[r]) == null ? void 0 : F.width) ?? 0, A = p - h.value;
      A < 0 ? h.value = Math.max(0, p) : A + x > m.value && (h.value = Math.min(te.value, p + x - m.value));
    }
    function ol(r) {
      const x = _.value.length - 1, A = L.value.length - 1;
      if (!E.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(r.key) && (r.preventDefault(), E.value = { row: O.value, col: 0 }, P.value = { row: O.value, col: 0 });
        return;
      }
      let { row: F, col: W } = E.value;
      const X = (ne, pe, we = !1) => {
        F = Math.max(0, Math.min(A, ne)), W = Math.max(0, Math.min(x, pe)), E.value = { row: F, col: W }, we || (P.value = { row: F, col: W }), re(F), al(W);
      };
      switch (r.key) {
        case "ArrowDown":
          r.preventDefault(), X(F + 1, W, r.shiftKey);
          break;
        case "ArrowUp":
          r.preventDefault(), X(F - 1, W, r.shiftKey);
          break;
        case "ArrowRight":
          r.preventDefault(), r.shiftKey ? X(F, W + 1, !0) : W < x ? X(F, W + 1) : X(F + 1, 0);
          break;
        case "ArrowLeft":
          r.preventDefault(), r.shiftKey ? X(F, W - 1, !0) : W > 0 ? X(F, W - 1) : X(F - 1, x);
          break;
        case "Tab":
          r.preventDefault(), r.shiftKey ? W > 0 ? X(F, W - 1) : X(F - 1, x) : W < x ? X(F, W + 1) : X(F + 1, 0);
          break;
        case "Enter":
          r.preventDefault(), r.shiftKey ? X(F - 1, W) : X(F + 1, W);
          break;
        case "Home":
          r.preventDefault(), r.ctrlKey || r.metaKey ? X(0, 0, r.shiftKey) : X(F, 0, r.shiftKey);
          break;
        case "End":
          r.preventDefault(), r.ctrlKey || r.metaKey ? X(A, x, r.shiftKey) : X(F, x, r.shiftKey);
          break;
        case "PageDown":
          r.preventDefault(), X(Math.min(A, F + H.value), W, r.shiftKey);
          break;
        case "PageUp":
          r.preventDefault(), X(Math.max(0, F - H.value), W, r.shiftKey);
          break;
        case "Escape":
          E.value = null, P.value = null;
          break;
        case "c":
        case "C":
          (r.ctrlKey || r.metaKey) && (r.preventDefault(), rl());
          break;
      }
    }
    function rl() {
      var we;
      if (!E.value) return;
      const r = _.value, p = L.value, x = P.value ?? E.value, A = Math.min(x.row, E.value.row), F = Math.max(x.row, E.value.row), W = Math.min(x.col, E.value.col), X = Math.max(x.col, E.value.col), ne = [];
      for (let Oe = A; Oe <= F; Oe++) {
        const ut = p[Oe];
        if (!ut) continue;
        const Ne = [];
        for (let Qt = W; Qt <= X; Qt++) {
          const In = r[Qt];
          In && Ne.push(he(In, ut).replace(/[\t\r\n]+/g, " "));
        }
        ne.push(Ne.join("	"));
      }
      const pe = ne.join(`
`);
      (we = navigator.clipboard) == null || we.writeText(pe).catch(() => {
      });
    }
    function il(r) {
      const p = r.target.value;
      I.value = p, p ? c[M.value] = p : delete c[M.value], l("filter-changed");
    }
    function Cn() {
      M.value && delete c[M.value], I.value = "", M.value = null, l("filter-changed");
    }
    const sl = {
      setGridOption(r, p) {
        r === "rowData" ? a.value = p : r === "pinnedBottomRowData" ? s.value = p : r === "quickFilterText" && (o.value = p);
      },
      getColumnState() {
        return e.columnDefs.map((r) => {
          var x;
          const p = J(r);
          return {
            colId: p,
            hide: u.has(p),
            sort: ((x = d.value.find((A) => A.colId === p)) == null ? void 0 : x.dir) ?? null,
            sortIndex: d.value.some((A) => A.colId === p) ? d.value.findIndex((A) => A.colId === p) : null,
            width: f[p] ?? r.width
          };
        });
      },
      applyColumnState({ state: r }) {
        const p = r.filter((x) => x.sort).sort((x, A) => (x.sortIndex ?? 0) - (A.sortIndex ?? 0));
        p.length && (d.value = p.map((x) => ({ colId: x.colId, dir: x.sort })));
        for (const x of r)
          x.hide === !0 && u.add(x.colId), x.hide === !1 && u.delete(x.colId), x.width && (f[x.colId] = x.width);
      },
      setFilterModel(r) {
        for (const p of Object.keys(c)) delete c[p];
        if (r)
          for (const [p, x] of Object.entries(r))
            (x == null ? void 0 : x.type) === "equals" ? c[p] = `__eq__${x.filter}` : x != null && x.filter && (c[p] = x.filter);
      },
      getFilterModel() {
        const r = {};
        for (const [p, x] of Object.entries(c))
          x && (r[p] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return r;
      },
      async setColumnFilterModel(r, p) {
        p ? p.type === "equals" ? c[r] = `__eq__${p.filter}` : c[r] = p.filter ?? "" : delete c[r];
      },
      onFilterChanged() {
      },
      refreshCells() {
        g.value++;
      },
      exportDataAsCsv({ fileName: r = "export.csv" } = {}) {
        const p = $.value, x = p.map((X) => X.colDef.headerName ?? X.colId).join(","), A = L.value.map(
          (X) => p.map((ne) => `"${String(he(ne, X)).replace(/"/g, '""')}"`).join(",")
        ), F = new Blob([[x, ...A].join(`
`)], { type: "text/csv" }), W = URL.createObjectURL(F);
        Object.assign(document.createElement("a"), { href: W, download: r }).click(), URL.revokeObjectURL(W);
      },
      resize() {
        gt();
      },
      resetColumnState() {
        u.clear();
        for (const r of e.columnDefs)
          r.hide && u.add(J(r));
        d.value = Ee();
        for (const r of Object.keys(f)) delete f[r];
        for (const r of Object.keys(c)) delete c[r];
        o.value = "", v.value = 0, E.value = null, M.value = null;
      }
    };
    Q(
      [L, () => s.value, _, v, R, E],
      () => _e(ye)
    ), Q(() => e.theme, () => ye()), Q(() => [e.curvature, e.bendField], () => _e(gt)), Q(() => e.scanlines, () => ye()), Q(() => e.glow, () => ye()), Q(() => e.magnify, (r) => {
      r || (y.x = ve.x, y.y = ve.y), ye();
    }), Q(E, (r) => {
      if (!r) return;
      const p = L.value[r.row], x = _.value[r.col];
      p && x && l("cell-selected", { data: p, row: r.row, col: r.col, colId: x.colId });
    });
    let bt = null, St = null, Jt = 0;
    function pt() {
      cancelAnimationFrame(Jt), Jt = requestAnimationFrame(gt);
    }
    function kn(r) {
      r.preventDefault();
    }
    function Ln() {
      fe == null || fe.dispose(), fe = null, Ae = !1, Sn();
    }
    Ue(() => {
      for (const r of e.columnDefs)
        r.hide && u.add(J(r));
      d.value.length || (d.value = Ee()), a.value = e.rowData ?? [], s.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Tn), document.addEventListener("mousemove", Wt), document.addEventListener("mouseup", Pt), _e(() => {
        var r;
        Sn(), ie.value && (ie.value.addEventListener("webglcontextlost", kn), ie.value.addEventListener("webglcontextrestored", Ln)), be.value && (bt = new ResizeObserver(() => gt()), bt.observe(be.value), St = new IntersectionObserver((p) => {
          p.some((x) => x.isIntersecting) && pt();
        }), St.observe(be.value)), window.addEventListener("resize", pt), (r = window.visualViewport) == null || r.addEventListener("resize", pt), l("grid-ready", { api: sl });
      });
    }), Qe(() => {
      var r, p, x;
      document.removeEventListener("click", Tn, !0), document.removeEventListener("mousemove", Wt), document.removeEventListener("mouseup", Pt), (r = ie.value) == null || r.removeEventListener("webglcontextlost", kn), (p = ie.value) == null || p.removeEventListener("webglcontextrestored", Ln), bt == null || bt.disconnect(), St == null || St.disconnect(), window.removeEventListener("resize", pt), (x = window.visualViewport) == null || x.removeEventListener("resize", pt), cancelAnimationFrame(Jt), Zn();
    });
    const Mt = se(() => lt[e.theme] ?? lt.none), cl = se(() => ({
      background: Mt.value.headerBg,
      borderTop: `1px solid ${Mt.value.border}`,
      color: Mt.value.text
    })), ul = se(() => ({
      background: Mt.value.bg
    })), Rn = se(() => Mt.value.accent);
    return (r, p) => {
      var x, A;
      return Me(), Te("div", {
        ref_key: "wrapEl",
        ref: be,
        class: "cathode-wrap",
        style: Ke(ul.value)
      }, [
        ue("canvas", {
          ref_key: "canvasEl",
          ref: ie,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ft(Qn, ["prevent"]),
          onMousemove: el,
          onMouseleave: tl,
          onMousedown: nl,
          onClick: ll,
          onKeydown: ol,
          onTouchstartPassive: S,
          onTouchmove: K,
          onTouchend: ce,
          onTouchcancel: ce
        }, null, 544),
        M.value ? (Me(), Te("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: D,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: I.value,
          autofocus: "",
          onInput: il,
          onKeydown: [
            En(Cn, ["escape"]),
            p[0] || (p[0] = En((F) => M.value = null, ["enter"]))
          ]
        }, null, 40, Il)) : qe("", !0),
        n.pagination ? (Me(), Te("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ke(cl.value)
        }, [
          ue("button", {
            disabled: v.value <= 0,
            onClick: p[1] || (p[1] = (F) => xe())
          }, "◀", 8, El),
          ue("span", null, Xe((O.value + 1).toLocaleString()) + "–" + Xe(Math.min(L.value.length, ae.value + 1).toLocaleString()) + " / " + Xe(L.value.length.toLocaleString()), 1),
          ue("button", {
            disabled: v.value >= N.value,
            onClick: p[2] || (p[2] = (F) => De())
          }, "▶", 8, Dl),
          ue("span", {
            class: "cathode-page-info",
            style: Ke({ color: Rn.value })
          }, Xe(L.value.length.toLocaleString()) + " rows ", 5),
          E.value ? (Me(), Te("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ke({ color: Rn.value })
          }, Xe(((x = _.value[E.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((A = _.value[E.value.col]) == null ? void 0 : A.colId)) + " : " + Xe(he(_.value[E.value.col], L.value[E.value.row])), 5)) : qe("", !0)
        ], 4)) : qe("", !0)
      ], 4);
    };
  }
}), et = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [l, a] of t)
    e[l] = a;
  return e;
}, Ka = /* @__PURE__ */ et(Bl, [["__scopeId", "data-v-0b8d3f54"]]), Xt = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid's `none` theme.
    // Brightened 2026-05-01: levelInfo, levelDebug, timestamp were too
    // muted — read as washed-out under barrel + vignette.
    bg: "rgba(0,0,0,0)",
    text: "#f0f8ff",
    border: "#2a3a50",
    accent: "#60c0ff",
    rowAlt: "rgba(255,255,255,0.018)",
    levelInfo: "#e0eaf4",
    levelWarn: "#ffd890",
    levelError: "#ff9a9a",
    levelDebug: "#a0b8d0",
    levelSuccess: "#a0e8c0",
    timestamp: "#90b8d8"
  },
  paper: {
    // bg fully transparent for day-mode glass propagation.
    bg: "rgba(0,0,0,0)",
    text: "#222222",
    border: "#dee2e6",
    accent: "#158cba",
    // Black at 2% — invisible on dark bg, barely-there shading on light.
    // The previous accent-blue at 4% read as harsh bands across each
    // entry on a paper-light surface (visible above ~3% alpha on white).
    rowAlt: "rgba(0,0,0,0.020)",
    levelInfo: "#444444",
    levelWarn: "#a06000",
    levelError: "#c0392b",
    levelDebug: "#888888",
    levelSuccess: "#1a8038",
    timestamp: "#888888"
  },
  phosphor: {
    // Mixed-with-white phosphor — pure #33ff33 reads as muted green
    // under shader vignette. Lifting to a slightly off-white green
    // gives the proper "burn through the screen" CRT phosphor look.
    bg: "#060d06",
    text: "#80ff80",
    border: "#0a250a",
    accent: "#a0ffa0",
    rowAlt: "rgba(51,255,51,0.025)",
    levelInfo: "#80ff80",
    levelWarn: "#d0ff60",
    levelError: "#ff8080",
    levelDebug: "#5fcc5f",
    levelSuccess: "#80ffa0",
    timestamp: "#60dd60"
  },
  amber: {
    bg: "#0a0700",
    text: "#ffd060",
    border: "#2a1500",
    accent: "#ffe080",
    rowAlt: "rgba(255,176,0,0.025)",
    levelInfo: "#ffd060",
    levelWarn: "#ffe040",
    levelError: "#ff7030",
    levelDebug: "#cc9030",
    levelSuccess: "#ffe890",
    timestamp: "#ffe080"
  }
};
function Wl(n, t) {
  switch (t) {
    case "warn":
      return n.levelWarn;
    case "error":
      return n.levelError;
    case "debug":
      return n.levelDebug;
    case "success":
      return n.levelSuccess;
    case "info":
    default:
      return n.levelInfo;
  }
}
const Pl = 12, Le = 18, Lt = 10, dt = 6, gn = `${Pl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Yl(n, t, e) {
  if (e <= 0 || !t) return [t];
  const l = [];
  for (const a of t.split(`
`)) {
    if (!a) {
      l.push("");
      continue;
    }
    if (n.measureText(a).width <= e) {
      l.push(a);
      continue;
    }
    const s = a.split(/(\s+)/);
    let o = "";
    for (const d of s) {
      const c = o + d;
      if (n.measureText(c).width <= e)
        o = c;
      else if (o && (l.push(o.replace(/\s+$/, "")), o = ""), n.measureText(d).width > e) {
        let f = "";
        for (const u of d)
          n.measureText(f + u).width > e ? (f && l.push(f), f = u) : f += u;
        o = f;
      } else
        o = d.replace(/^\s+/, "");
    }
    o && l.push(o.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Gn(n) {
  if (typeof n == "number") {
    const t = new Date(n), e = String(t.getHours()).padStart(2, "0"), l = String(t.getMinutes()).padStart(2, "0"), a = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return n;
}
function $l(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function Hl(n) {
  const { entries: t, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: s } = n, o = n.formatTs ?? Gn;
  e.font = gn;
  const d = [];
  for (let c = 0; c < t.length; c++) {
    const f = t[c], u = f.level ?? "info", g = a && f.ts != null ? o(f.ts) : "", m = s ? Yl(e, f.text, l) : f.text.split(`
`);
    for (let b = 0; b < m.length; b++)
      d.push({
        entryIdx: c,
        text: m[b],
        level: u,
        timestamp: b === 0 ? g : "",
        isFirstFrag: b === 0,
        widthPx: e.measureText(m[b]).width
      });
  }
  return d;
}
function Bn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = n.width, a = n.height, s = Xt[t.theme] ?? Xt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = s.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = gn, e.textBaseline = "middle";
  const o = t.visualLines, d = Lt - t.scrollX, c = (t.showTimestamps ? Lt + t.timestampWidth : Lt) - t.scrollX, f = Math.max(0, Math.floor((t.scrollY - dt) / Le)), u = Math.min(o.length, Math.ceil((t.scrollY + a - dt) / Le) + 1);
  for (let g = f; g < u; g++) {
    const m = o[g], b = dt + g * Le - t.scrollY + Le / 2;
    if (m.entryIdx % 2 === 1 && m.isFirstFrag) {
      e.fillStyle = s.rowAlt;
      let C = 1;
      for (; g + C < u && o[g + C].entryIdx === m.entryIdx; ) C++;
      e.fillRect(0, b - Le / 2, l, Le * C);
    }
    t.selectionStart >= 0 && g >= t.selectionStart && g <= t.selectionEnd && (e.fillStyle = s.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, b - Le / 2, l, Le)), g === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, b - Le / 2, l, Le)), t.showTimestamps && m.timestamp && (e.fillStyle = s.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = s.timestamp), e.fillText(m.timestamp, d, b), e.shadowBlur = 0);
    const k = Wl(s, m.level);
    e.fillStyle = k, e.textAlign = "left", t.glow ? (e.shadowColor = k, e.shadowBlur = 14, e.fillText(m.text, c, b), e.shadowBlur = 7, e.fillText(m.text, c, b), e.shadowBlur = 3, e.fillText(m.text, c, b), e.shadowBlur = 0) : e.fillText(m.text, c, b);
  }
  e.restore();
}
function Wn(n, t, e) {
  if (n < 0) return -1;
  const l = Math.floor((n + t - dt) / Le);
  return l < 0 || l >= e ? -1 : l;
}
function zl(n) {
  return dt * 2 + n * Le;
}
const Vl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ol = /* @__PURE__ */ Je({
  __name: "CathodeLog",
  props: {
    entries: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showTimestamps: { type: Boolean, default: !0 },
    formatTs: {},
    wordWrap: { type: Boolean, default: !0 },
    autoscroll: { type: Boolean, default: !0 },
    maxLines: { default: 0 },
    magnify: { type: Boolean, default: !1 }
  },
  setup(n, { expose: t }) {
    const e = n, l = z(null), a = z(null), s = { ...ve }, o = z(0), d = z(0), c = z(0), f = z(-1), u = z(!0), g = z(-1), m = z(-1), b = se(() => {
      const S = e.entries ?? [];
      return e.maxLines > 0 && S.length > e.maxLines ? S.slice(S.length - e.maxLines) : S;
    }), k = se(() => {
      if (!e.showTimestamps) return "";
      const S = e.formatTs ?? Gn;
      let K = "00:00:00";
      for (const ce of b.value) {
        if (ce.ts == null) continue;
        const be = S(ce.ts);
        be.length > K.length && (K = be);
      }
      return K;
    }), C = z(0), v = z([]);
    function h() {
      if (!$) return;
      const S = $.getContext("2d");
      if (!S) return;
      S.font = gn;
      const K = e.showTimestamps ? $l(S, k.value) : 0;
      C.value = K;
      const ce = Math.max(
        1,
        o.value - Lt * 2 - K
      );
      v.value = Hl({
        entries: b.value,
        ctx: S,
        textMaxWidth: ce,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const R = se(() => zl(v.value.length)), E = se(() => Math.max(0, R.value - d.value)), P = se(() => {
      let S = 0;
      for (const K of v.value) K.widthPx > S && (S = K.widthPx);
      return Lt * 2 + C.value + S;
    }), M = se(() => Math.max(0, P.value - o.value)), y = z(0);
    Q(E, () => {
      u.value ? c.value = E.value : c.value = Math.min(c.value, E.value);
    }), Q(M, () => {
      y.value = Math.min(y.value, M.value);
    }), Q(
      [b, o, () => e.showTimestamps, () => e.wordWrap, k],
      () => {
        h(), _e(ee);
      },
      { deep: !1 }
    );
    let I = null, U = !1;
    function D() {
      if (I) {
        try {
          I.forceContextLoss();
        } catch {
        }
        try {
          I.dispose();
        } catch {
        }
        I = null;
      }
    }
    let Z, q, V, J, $;
    const _ = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${It}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): the full 0.5.0 dish, plus a fit-to-content rescale. The
    // raw inward map samples a shrunken region, so the texture's outer
    // margin (headers, edge columns) was never displayed at high strength.
    // Scaling the sampled field so the screen CORNERS land exactly on the
    // texture corners guarantees every content pixel is drawn; the sampled
    // range then overshoots [0,1] at the edge MIDPOINTS, which renders as
    // the classic pincushion silhouette — content pinching inward on each
    // side, corners touching, the header riding the bowed top edge.
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;                        // corner dist = |cc|²·as at (.5,.5)
      float cp = 0.5 * (1.0 + cd) * cd;           // corner inward pull
      m /= (1.0 - 2.0 * cp);                      // corners → exactly ±0.5
    }
    return vec2(0.5) + m;
  }

  ${Et}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      // Falloff coefficient was 1.5 — corners darkened to ~25% of centre,
      // which crushed text brightness. Dropped to 0.6: corners now hold
      // ~70%+ luminance so text reads bright across the whole screen.
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${Dt}

    gl_FragColor = color;
  }
`;
    function te() {
      if (!(!a.value || !l.value)) {
        $ = document.createElement("canvas");
        try {
          I = new Y.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          U = !0;
        }
        if (!U && !I.getContext() && (I.dispose(), I = null, U = !0), U) {
          le();
          return;
        }
        I.setPixelRatio(1), I.setClearColor(0, 0), Z = new Y.Scene(), q = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), J = new Y.CanvasTexture($), J.minFilter = Y.LinearFilter, J.magFilter = Y.LinearFilter, V = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: J },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ft()
          },
          vertexShader: Vl,
          fragmentShader: _,
          transparent: !0
        }), Z.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), V)), le();
      }
    }
    function le() {
      if (!l.value || !I && !U) return;
      const S = l.value.clientWidth, K = l.value.clientHeight;
      if (!S || !K) return;
      const ce = $.width !== S || $.height !== K;
      ce && ($.width = S, $.height = K, o.value = S, d.value = K, h(), I ? (ce && J && (J.dispose(), J = new Y.CanvasTexture($), J.minFilter = Y.LinearFilter, J.magFilter = Y.LinearFilter, V && (V.uniforms.uTex.value = J)), I.setPixelRatio(window.devicePixelRatio || 1), I.setSize(S, K)) : a.value && (a.value.width = S, a.value.height = K, a.value.style.width = S + "px", a.value.style.height = K + "px"), u.value && (c.value = Math.max(0, R.value - d.value)), ee());
    }
    function ee() {
      if (!($ != null && $.width)) return;
      if (U) {
        if (!a.value) return;
        Bn($, {
          visualLines: v.value,
          scrollY: c.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: C.value,
          hoveredLine: f.value,
          selectionStart: Math.min(g.value, m.value),
          selectionEnd: Math.max(g.value, m.value)
        });
        const K = a.value.getContext("2d");
        K && K.drawImage($, 0, 0);
        return;
      }
      if (!I || !V || !J) return;
      const S = e.theme === "paper";
      V.uniforms.uStrength.value = je(e.curvature), V.uniforms.uScanlines.value = e.scanlines && !S ? 1 : 0, V.uniforms.uVignette.value = S ? 0 : 1, At(V, e.magnify, s, $.width, $.height), Bn($, {
        visualLines: v.value,
        scrollY: c.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: C.value,
        hoveredLine: f.value,
        selectionStart: Math.min(g.value, m.value),
        selectionEnd: Math.max(g.value, m.value)
      }), J.needsUpdate = !0, I.render(Z, q);
    }
    Q(() => e.theme, () => ee()), Q(() => e.curvature, () => ee()), Q(() => e.scanlines, () => ee()), Q(() => e.glow, () => ee()), Q(() => e.magnify, (S) => {
      S || (s.x = ve.x, s.y = ve.y), ee();
    }), Q(c, () => ee()), Q(y, () => ee()), Q(f, () => ee()), Q([g, m], () => ee());
    function j(S) {
      if (!a.value) return [-1, -1];
      const K = a.value.getBoundingClientRect();
      return [S.clientX - K.left, S.clientY - K.top];
    }
    function i(S) {
      c.value = Math.max(0, Math.min(E.value, S)), u.value = c.value >= E.value - 4;
    }
    function w(S) {
      y.value = Math.max(0, Math.min(M.value, S));
    }
    function B(S) {
      S.shiftKey ? w(y.value + S.deltaY) : Math.abs(S.deltaX) > Math.abs(S.deltaY) ? w(y.value + S.deltaX) : i(c.value + S.deltaY);
    }
    let T = !1, N = 0, H = 0, O = 0, ae = 0, oe = !1;
    function he(S) {
      T = !0, oe = !1, N = S.clientX, H = S.clientY, O = y.value, ae = c.value, l.value && l.value.focus();
    }
    function Ce(S) {
      if (T) {
        const K = N - S.clientX, ce = H - S.clientY;
        (Math.abs(K) > 4 || Math.abs(ce) > 4) && (oe = !0), w(O + K), i(ae + ce);
      }
    }
    function Ee() {
      T && (T = !1, oe && (oe = !1));
    }
    function L(S) {
      if (S.touches.length !== 1) return;
      const K = S.touches[0];
      T = !0, oe = !1, N = K.clientX, H = K.clientY, O = y.value, ae = c.value, l.value && l.value.focus();
    }
    function G(S) {
      if (!T || S.touches.length !== 1) return;
      S.preventDefault();
      const K = S.touches[0], ce = N - K.clientX, be = H - K.clientY;
      (Math.abs(ce) > 4 || Math.abs(be) > 4) && (oe = !0), w(O + ce), i(ae + be);
    }
    function re() {
      T && (T = !1, oe && (oe = !1));
    }
    function xe(S) {
      const [, K] = j(S);
      return K < 0 ? -1 : Wn(K, c.value, v.value.length);
    }
    function De(S) {
      if (oe) {
        oe = !1;
        return;
      }
      const K = xe(S);
      if (K < 0) {
        g.value = -1, m.value = -1;
        return;
      }
      S.shiftKey && g.value >= 0 || (g.value = K), m.value = K;
    }
    function Fe(S, K) {
      const ce = v.value.length;
      if (ce === 0) return;
      const be = m.value < 0 ? 0 : m.value;
      let ie = Math.max(0, Math.min(ce - 1, be + S));
      m.value = ie, (!K || g.value < 0) && (g.value = ie), f.value = ie;
      const ze = dt + ie * Le, me = ze + Le;
      ze < c.value ? i(ze) : me > c.value + d.value && i(me - d.value);
    }
    function it() {
      const S = Math.min(g.value, m.value), K = Math.max(g.value, m.value);
      if (S < 0) return "";
      const ce = v.value, be = /* @__PURE__ */ new Set(), ie = [];
      for (let ze = S; ze <= K && ze < ce.length; ze++) {
        const me = ce[ze];
        if (be.has(me.entryIdx)) continue;
        be.add(me.entryIdx);
        let fe = "";
        for (let Ae = 0; Ae < ce.length; Ae++)
          ce[Ae].entryIdx === me.entryIdx && (fe += (fe && !ce[Ae].isFirstFrag ? " " : "") + ce[Ae].text);
        ie.push(me.timestamp ? `${me.timestamp}  ${fe}` : fe);
      }
      return ie.join(`
`);
    }
    async function ht() {
      const S = it();
      if (S)
        try {
          await navigator.clipboard.writeText(S);
        } catch {
          const K = document.createElement("textarea");
          K.value = S, K.style.position = "fixed", K.style.opacity = "0", document.body.appendChild(K), K.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(K);
        }
    }
    function st(S) {
      if ((S.metaKey || S.ctrlKey) && (S.key === "c" || S.key === "C")) {
        g.value >= 0 && (S.preventDefault(), ht());
        return;
      }
      if ((S.metaKey || S.ctrlKey) && (S.key === "a" || S.key === "A")) {
        S.preventDefault(), g.value = 0, m.value = v.value.length - 1;
        return;
      }
      switch (S.key) {
        case "ArrowDown":
          S.preventDefault(), Fe(1, S.shiftKey);
          break;
        case "ArrowUp":
          S.preventDefault(), Fe(-1, S.shiftKey);
          break;
        case "ArrowRight":
          S.preventDefault(), w(y.value + Le * 2);
          break;
        case "ArrowLeft":
          S.preventDefault(), w(y.value - Le * 2);
          break;
        case "PageDown":
          S.preventDefault(), i(c.value + d.value);
          break;
        case "PageUp":
          S.preventDefault(), i(c.value - d.value);
          break;
        case "Home":
          S.preventDefault(), i(0), w(0);
          break;
        case "End":
          S.preventDefault(), i(E.value);
          break;
        case "Escape":
          g.value = -1, m.value = -1;
          break;
      }
    }
    function tt(S) {
      if (e.magnify && a.value) {
        const ce = _t(S, a.value);
        s.x = ce.x, s.y = ce.y, ee();
      }
      const [, K] = j(S);
      if (K < 0) {
        f.value = -1;
        return;
      }
      f.value = Wn(K, c.value, v.value.length);
    }
    function He() {
      f.value = -1, s.x = ve.x, s.y = ve.y, ee();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = E.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(S) {
        i(dt + S * Le);
      }
    });
    let Ie = null, Be = null, nt = 0;
    const mt = Rt("cathodeResetTick", z(0));
    Q(mt, () => Pe());
    function Pe() {
      cancelAnimationFrame(nt), nt = requestAnimationFrame(le);
    }
    function Ge(S) {
      S.preventDefault();
    }
    function Bt() {
      I == null || I.dispose(), I = null, U = !1, te();
    }
    Ue(() => {
      document.addEventListener("mousemove", Ce), document.addEventListener("mouseup", Ee), _e(() => {
        var S;
        te(), a.value && (a.value.addEventListener("webglcontextlost", Ge), a.value.addEventListener("webglcontextrestored", Bt)), l.value && (Ie = new ResizeObserver(() => le()), Ie.observe(l.value), Be = new IntersectionObserver((K) => {
          K.some((ce) => ce.isIntersecting) && Pe();
        }), Be.observe(l.value)), window.addEventListener("resize", Pe), (S = window.visualViewport) == null || S.addEventListener("resize", Pe), c.value = E.value;
      });
    }), Qe(() => {
      var S, K, ce;
      document.removeEventListener("mousemove", Ce), document.removeEventListener("mouseup", Ee), (S = a.value) == null || S.removeEventListener("webglcontextlost", Ge), (K = a.value) == null || K.removeEventListener("webglcontextrestored", Bt), Ie == null || Ie.disconnect(), Be == null || Be.disconnect(), window.removeEventListener("resize", Pe), (ce = window.visualViewport) == null || ce.removeEventListener("resize", Pe), cancelAnimationFrame(nt), D();
    });
    const Wt = se(() => Xt[e.theme] ?? Xt.none), Pt = se(() => ({
      background: Wt.value.bg
    }));
    return (S, K) => (Me(), Te("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ke(Pt.value),
      tabindex: "0",
      onKeydown: st
    }, [
      ue("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: ft(B, ["prevent"]),
        onMousemove: tt,
        onMouseleave: He,
        onMousedown: he,
        onClick: De,
        onTouchstartPassive: L,
        onTouchmove: G,
        onTouchend: re,
        onTouchcancel: re
      }, null, 544)
    ], 36));
  }
}), Nl = /* @__PURE__ */ et(Ol, [["__scopeId", "data-v-d6dc9e79"]]), Xl = ["disabled"], Ul = /* @__PURE__ */ Je({
  __name: "CathodeTerminal",
  props: {
    entries: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showTimestamps: { type: Boolean, default: !0 },
    formatTs: {},
    wordWrap: { type: Boolean, default: !0 },
    autoscroll: { type: Boolean, default: !0 },
    maxLines: { default: 0 },
    prompt: { default: "→ " },
    disabled: { type: Boolean, default: !1 },
    busy: { type: Boolean, default: !1 },
    historyLimit: { default: 100 },
    magnify: { type: Boolean, default: !1 }
  },
  emits: ["submit"],
  setup(n, { expose: t, emit: e }) {
    const l = n, a = e, s = z(null), o = z(null), d = z(""), c = z([]), f = z(-1);
    let u = "";
    function g(M) {
      M.trim() && (c.value.length && c.value[c.value.length - 1] === M || (c.value.push(M), c.value.length > l.historyLimit && c.value.splice(0, c.value.length - l.historyLimit)));
    }
    function m(M) {
      if (!l.disabled) {
        if (M.key === "Enter") {
          M.preventDefault();
          const y = d.value;
          y.trim() && g(y), f.value = -1, d.value = "", a("submit", y);
          return;
        }
        if (M.key === "ArrowUp") {
          if (!c.value.length) return;
          M.preventDefault(), f.value === -1 ? (u = d.value, f.value = c.value.length - 1) : f.value > 0 && f.value--, d.value = c.value[f.value];
          return;
        }
        if (M.key === "ArrowDown") {
          if (f.value === -1) return;
          M.preventDefault(), f.value < c.value.length - 1 ? (f.value++, d.value = c.value[f.value]) : (f.value = -1, d.value = u, u = "");
          return;
        }
      }
    }
    const b = z(!0);
    let k = null;
    function C() {
      k || (k = setInterval(() => {
        b.value = !b.value;
      }, 530));
    }
    function v() {
      k && (clearInterval(k), k = null), b.value = !0;
    }
    const h = se(() => {
      let M;
      return l.disabled ? M = " " : l.busy ? M = "█" : M = b.value ? "█" : " ", { level: "info", text: `${l.prompt}${d.value}${M}` };
    }), R = se(
      () => [...l.entries, h.value]
    );
    function E() {
      var M;
      l.disabled || (M = o.value) == null || M.focus();
    }
    Q(() => l.busy, (M, y) => {
      y && !M && !l.disabled && _e(() => {
        var I;
        return (I = o.value) == null ? void 0 : I.focus();
      });
    });
    function P() {
      var M;
      (M = o.value) == null || M.focus();
    }
    return t({ focus: P }), Ue(() => {
      C(), l.disabled || requestAnimationFrame(() => {
        var M;
        return (M = o.value) == null ? void 0 : M.focus();
      });
    }), Qe(() => {
      v();
    }), (M, y) => (Me(), Te("div", {
      ref_key: "wrapEl",
      ref: s,
      class: "cathode-terminal-wrap",
      onClick: E
    }, [
      Hn(Nl, {
        entries: R.value,
        theme: n.theme,
        curvature: n.curvature,
        scanlines: n.scanlines,
        glow: n.glow,
        magnify: n.magnify,
        "show-timestamps": n.showTimestamps,
        "format-ts": n.formatTs,
        "word-wrap": n.wordWrap,
        autoscroll: n.autoscroll,
        "max-lines": n.maxLines
      }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "magnify", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"]),
      zn(ue("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": y[0] || (y[0] = (I) => d.value = I),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: m
      }, null, 40, Xl), [
        [fl, d.value]
      ])
    ], 512));
  }
}), qa = /* @__PURE__ */ et(Ul, [["__scopeId", "data-v-a2b39934"]]), xt = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid / CanvasLog `none`.
    bg: "rgba(0,0,0,0)",
    candleBull: "#26a69a",
    candleBear: "#ef5350",
    wickBull: "#26a69a",
    wickBear: "#ef5350",
    volumeBull: "rgba(38,166,154,0.45)",
    volumeBear: "rgba(239,83,80,0.45)",
    gridline: "rgba(255,255,255,0.06)",
    text: "#c0d0e0",
    accent: "#40a0f0",
    markerEntry: "#00cc55",
    markerExit: "#e74c3c",
    panelBg: "rgba(13,21,32,0.55)",
    panelBgSolid: "rgba(13,21,32,0.92)"
  },
  paper: {
    bg: "rgba(0,0,0,0)",
    candleBull: "#1a8038",
    candleBear: "#c0392b",
    wickBull: "#1a8038",
    wickBear: "#c0392b",
    volumeBull: "rgba(26,128,56,0.30)",
    volumeBear: "rgba(192,57,43,0.30)",
    gridline: "rgba(0,0,0,0.06)",
    text: "#222222",
    accent: "#158cba",
    markerEntry: "#1a9e3f",
    markerExit: "#d93025",
    // Light backdrops for paper mode — dark fallbacks would be illegible on
    // the white parent background.
    panelBg: "rgba(255,255,255,0.78)",
    panelBgSolid: "rgba(255,255,255,0.96)"
  },
  phosphor: {
    bg: "#060d06",
    candleBull: "#33ff33",
    candleBear: "#ff5050",
    wickBull: "#33ff33",
    wickBear: "#ff5050",
    volumeBull: "rgba(51,255,51,0.35)",
    volumeBear: "rgba(255,80,80,0.35)",
    gridline: "rgba(51,255,51,0.10)",
    text: "#33ff33",
    accent: "#80ff80",
    markerEntry: "#80ff80",
    markerExit: "#ff8080",
    panelBg: "rgba(6,13,6,0.85)",
    panelBgSolid: "rgba(6,13,6,0.96)"
  },
  amber: {
    bg: "#0a0700",
    candleBull: "#ffd060",
    candleBear: "#ff5000",
    wickBull: "#ffd060",
    wickBear: "#ff5000",
    volumeBull: "rgba(255,208,96,0.35)",
    volumeBear: "rgba(255,80,0,0.35)",
    gridline: "rgba(255,176,0,0.10)",
    text: "#ffb000",
    accent: "#ffd060",
    markerEntry: "#ffe080",
    markerExit: "#ff7030",
    panelBg: "rgba(10,7,0,0.85)",
    panelBgSolid: "rgba(10,7,0,0.96)"
  }
}, Gl = 0.18, Tt = 8, pn = 22, Kl = 4, $e = 8, ot = 56, wn = 42, Ze = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ql = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", on = 4, jl = 1, Zl = 1;
function Jl(n, t, e, l = 0, a = !1) {
  const s = a ? wn : ot, o = Math.max(0, t - $e - s), d = Math.max(1, Math.floor(o / e)), c = Math.min(d, n);
  return { firstIdx: Math.max(0, n - c - Math.floor(l / e)), count: c, slotW: e };
}
function Ql(n, t, e) {
  if (!n.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, s = 0;
  const o = Math.min(n.length, t + e);
  for (let c = t; c < o; c++) {
    const f = n[c];
    f && (f.low < l && (l = f.low), f.high > a && (a = f.high), f.volume > s && (s = f.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const c = isFinite(l) ? l : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, s) };
  }
  const d = (a - l) * 0.04;
  return { min: l - d, max: a + d, maxVol: Math.max(1, s) };
}
function ea(n, t, e = !1) {
  const l = e ? Kl : pn, a = Math.max(1, n - Tt - l - on), s = Math.max(0, Math.round(a * t)), o = a - s;
  return {
    priceY0: Tt,
    priceY1: Tt + o,
    volumeY0: Tt + o + on,
    volumeY1: Tt + o + on + s
  };
}
function Ye(n, t, e, l) {
  const a = t.max - t.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (n - t.min) / a) * (l - e);
}
function rt(n, t, e) {
  return $e + (n - t + 0.5) * e;
}
function at(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function yn(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0"), a = String(t.getHours()).padStart(2, "0"), s = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${s}`;
}
function ta(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let s;
  return a < 1.5 ? s = 1 : a < 3 ? s = 2 : a < 7 ? s = 5 : s = 10, s * l;
}
function dn(n, t) {
  var k, C, v, h, R;
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, s = n.height / l, o = xt[t.theme] ?? xt.none, d = t.colors ? { ...o, ...t.colors } : o, c = !!t.compact;
  if (e.clearRect(0, 0, a, s), e.fillStyle = d.bg, e.fillRect(0, 0, a, s), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, a, s), e.clip();
  const f = Jl(t.candles.length, a, t.slotW, t.scrollX, c), u = Ql(t.candles, f.firstIdx, f.count), g = ea(s, t.showVolume ? t.volumeFraction : 0, c), m = Math.max(jl, Math.floor(t.slotW * 0.7)), b = Math.min(t.candles.length, f.firstIdx + f.count);
  for (let E = f.firstIdx; E < b; E++) {
    const P = t.candles[E];
    if (!P) continue;
    const M = rt(E, f.firstIdx, t.slotW), y = Ye(P.open, u, g.priceY0, g.priceY1), I = Ye(P.close, u, g.priceY0, g.priceY1), U = Ye(P.high, u, g.priceY0, g.priceY1), D = Ye(P.low, u, g.priceY0, g.priceY1), Z = P.close >= P.open, q = Z ? d.wickBull : d.wickBear, V = Z ? d.candleBull : d.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = V), e.strokeStyle = q, e.lineWidth = Zl, e.beginPath(), e.moveTo(Math.round(M) + 0.5, U), e.lineTo(Math.round(M) + 0.5, D), e.stroke(), e.fillStyle = V;
    const J = Math.min(y, I), $ = Math.max(1, Math.abs(I - y)), _ = Math.round(M - m / 2), te = Math.round(J), le = Math.round($);
    if (e.fillRect(_, te, m, le), t.glow && (e.shadowBlur = 4, e.fillRect(_, te, m, le)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const ee = Math.round(P.volume / u.maxVol * (g.volumeY1 - g.volumeY0));
      ee > 0 && (e.fillStyle = Z ? d.volumeBull : d.volumeBear, e.fillRect(
        Math.round(M - m / 2),
        g.volumeY1 - ee,
        m,
        ee
      ));
    }
  }
  if ((k = t.overlays) != null && k.length) {
    const E = { above: 0, below: 0 }, P = t.overlays.filter((y) => y.kind !== "hline" && !!y.label).length, M = P ? 14 + 14 * P + 12 : 8;
    for (const y of t.overlays)
      y.kind === "hline" ? la(e, y, a, u, g, d, c, E, M) : na(e, y, f, u, g, t.slotW);
  }
  (C = t.markers) != null && C.length && fa(e, d, t.markers, t.candles, f, u, g, t.slotW), da(e, d, u, g, a, c), c || (va(e, d, t.candles, f, t.slotW, s), ca(e, d, t.candles, a, s)), (v = t.overlays) != null && v.length && oa(e, d, t.overlays, g), t.hover && (ha(e, d, t.candles, f, u, g, t.slotW, t.hover, a), ra(e, d, t.candles, f, t.slotW, t.hover, g, ((h = t.overlays) == null ? void 0 : h.length) ?? 0), (R = t.markers) != null && R.length && sa(e, d, t.markers, t.candles, f, u, g, t.slotW, t.hover, a)), e.restore();
}
function na(n, t, e, l, a, s) {
  var d;
  const o = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    $e,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), n.clip(), t.kind === "line")
    zt(n, t.data, e.firstIdx, o, s, l, a, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const c = Kn(t.color, t.fillAlpha ?? 0.08);
    aa(n, t.upper, t.lower, e.firstIdx, o, s, l, a, c), zt(n, t.upper, e.firstIdx, o, s, l, a, t.color, 1, !1), zt(n, t.lower, e.firstIdx, o, s, l, a, t.color, 1, !1), (d = t.middle) != null && d.length && zt(n, t.middle, e.firstIdx, o, s, l, a, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function la(n, t, e, l, a, s, o, d = { above: 0, below: 0 }, c = 8) {
  const f = Ye(t.price, l, a.priceY0, a.priceY1), u = f < a.priceY0 - 0.5, g = f > a.priceY1 + 0.5, m = u || g, b = m ? u ? d.above++ : d.below++ : 0, k = m ? u ? a.priceY0 + c + b * 20 : a.priceY1 - 8 - b * 20 : f, C = o ? wn : ot, v = Math.round(k) + 0.5;
  n.save(), m || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo($e, v), n.lineTo(e - C, v), n.stroke(), n.setLineDash([]));
  let h = t.label ?? at(t.price);
  if (m && h !== "" && (h = (u ? "↑ " : "↓ ") + h), h !== "") {
    n.font = Ze, n.textBaseline = "middle", n.textAlign = "left";
    const R = n.measureText(h).width, E = 4, P = 2, M = $e + 2;
    n.fillStyle = t.color, m && (n.globalAlpha = 0.85), n.fillRect(M, k - 7 - P, R + E * 2, 14 + P * 2), n.globalAlpha = 1, n.fillStyle = s.bg && !s.bg.startsWith("rgba(0,0,0,0)") ? s.bg : "#0d1520", n.fillText(h, M + E, k);
  }
  n.restore();
}
function zt(n, t, e, l, a, s, o, d, c, f) {
  if (!t || !t.length) return;
  n.strokeStyle = d, n.lineWidth = c, n.setLineDash(f ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let g = e; g < l; g++) {
    const m = t[g];
    if (typeof m != "number" || !isFinite(m)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const b = rt(g, e, a), k = Ye(m, s, o.priceY0, o.priceY1);
    u ? n.lineTo(b, k) : (n.moveTo(b, k), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function aa(n, t, e, l, a, s, o, d, c) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = c;
  let f = !1, u = -1;
  for (let g = l; g <= a; g++) {
    const m = t[g], b = e[g], k = g < a && typeof m == "number" && typeof b == "number" && isFinite(m) && isFinite(b);
    if (k && !f && (u = g, f = !0), !k && f || g === a && f) {
      const C = k ? g + 1 : g;
      n.beginPath();
      for (let v = u; v < C; v++) {
        const h = rt(v, l, s), R = Ye(t[v], o, d.priceY0, d.priceY1);
        v === u ? n.moveTo(h, R) : n.lineTo(h, R);
      }
      for (let v = C - 1; v >= u; v--) {
        const h = rt(v, l, s), R = Ye(e[v], o, d.priceY0, d.priceY1);
        n.lineTo(h, R);
      }
      n.closePath(), n.fill(), f = !1;
    }
  }
}
function Kn(n, t) {
  const e = Math.max(0, Math.min(1, t));
  if (n.startsWith("#") && n.length === 7) {
    const l = parseInt(n.slice(1, 3), 16), a = parseInt(n.slice(3, 5), 16), s = parseInt(n.slice(5, 7), 16);
    return `rgba(${l},${a},${s},${e})`;
  }
  return n.startsWith("rgba") ? n.replace(/[\d.]+\)$/, `${e})`) : n.startsWith("rgb(") ? n.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : n;
}
function oa(n, t, e, l) {
  const a = e.filter((C) => C.kind !== "hline" && !!C.label);
  if (!a.length) return;
  n.save(), n.font = Ze;
  const s = 8, o = 5, d = 12, c = 6, f = 14;
  let u = 0;
  for (const C of a) {
    const v = n.measureText(C.label).width;
    v > u && (u = v);
  }
  const g = s * 2 + d + c + u, m = o * 2 + f * a.length, b = $e + 4, k = l.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(b, k, g, m), n.textBaseline = "middle", n.textAlign = "left";
  for (let C = 0; C < a.length; C++) {
    const v = a[C], h = k + o + f * (C + 0.5), R = b + s;
    v.kind === "line" ? (n.strokeStyle = v.color, n.lineWidth = v.lineWidth ?? 1, n.setLineDash(v.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(R, h), n.lineTo(R + d, h), n.stroke(), n.setLineDash([])) : v.kind === "band" && (n.fillStyle = Kn(v.color, v.fillAlpha ?? 0.2), n.fillRect(R, h - 4, d, 8), n.strokeStyle = v.color, n.lineWidth = 1, n.strokeRect(R + 0.5, h - 4 + 0.5, d - 1, 7)), n.fillStyle = t.text, n.fillText(v.label, R + d + c, h);
  }
  n.restore();
}
function ra(n, t, e, l, a, s, o, d) {
  const c = Math.floor((s.x - $e) / a), f = l.firstIdx + c;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const g = u.close - u.open, m = u.open !== 0 ? g / u.open * 100 : 0, b = g >= 0 ? "+" : "", k = [
    ["O", at(u.open), void 0],
    ["H", at(u.high), void 0],
    ["L", at(u.low), void 0],
    ["C", at(u.close), void 0],
    ["V", ia(u.volume), void 0],
    ["", `${b}${m.toFixed(2)}%`, g >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = Ze, n.textBaseline = "middle", n.textAlign = "left";
  const C = 8, v = 4, h = 14;
  let R = C;
  for (const [y, I] of k) {
    const U = y ? `${y} ${I}` : I, D = n.measureText(U).width + 12;
    R += D;
  }
  R += C - 12;
  const E = o.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), P = $e + 4;
  n.fillStyle = t.panelBg, n.fillRect(P, E, R, h + v * 2);
  let M = P + C;
  for (let y = 0; y < k.length; y++) {
    const [I, U, D] = k[y];
    n.fillStyle = t.text, I && (n.globalAlpha = 0.6, n.fillText(I + " ", M, E + v + h / 2), n.globalAlpha = 1, M += n.measureText(I + " ").width), D && (n.fillStyle = D), n.fillText(U, M, E + v + h / 2), M += n.measureText(U).width + 12;
  }
  n.restore();
}
function ia(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function sa(n, t, e, l, a, s, o, d, c, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, g = Math.max(1, u * 0.5), m = Math.min(l.length, a.firstIdx + a.count), b = 9;
  let k = null;
  for (const U of e) {
    let D = 0, Z = l.length - 1, q = -1;
    for (; D <= Z; ) {
      const $ = D + Z >> 1, _ = l[$].start - U.timestamp;
      if (Math.abs(_) <= g) {
        q = $;
        break;
      }
      _ < 0 ? D = $ + 1 : Z = $ - 1;
    }
    if (q < 0 || q < a.firstIdx || q >= m) continue;
    const V = rt(q, a.firstIdx, d), J = Ye(U.price, s, o.priceY0, o.priceY1);
    if (Math.abs(c.x - V) <= b && Math.abs(c.y - J) <= b) {
      k = { m: U, x: V, y: J };
      break;
    }
  }
  if (!k) return;
  const C = yn(k.m.timestamp), v = [
    `${k.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${C}`,
    `@ ${at(k.m.price)}`
  ];
  k.m.label && v.push(k.m.label), n.save(), n.font = Ze, n.textBaseline = "top", n.textAlign = "left";
  const h = 6, R = 14;
  let E = 0;
  for (const U of v) {
    const D = n.measureText(U).width;
    D > E && (E = D);
  }
  const P = E + h * 2, M = v.length * R + h * 2;
  let y = k.x + 12;
  y + P > f - ot && (y = k.x - 12 - P);
  let I = k.y - M / 2;
  I < o.priceY0 && (I = o.priceY0), I + M > o.priceY1 && (I = o.priceY1 - M), n.fillStyle = t.panelBgSolid, n.strokeStyle = k.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(y, I, P, M), n.strokeRect(y + 0.5, I + 0.5, P - 1, M - 1);
  for (let U = 0; U < v.length; U++) {
    const D = v[U];
    n.fillStyle = U === 0 ? k.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(D, y + h, I + h + U * R);
  }
  n.restore();
}
function ca(n, t, e, l, a) {
  if (e.length < 2) return;
  const s = e[1].start - e[0].start, o = ua(s);
  if (!o) return;
  n.save(), n.font = Ze, n.textBaseline = "top", n.textAlign = "right";
  const d = 6, c = 3, f = n.measureText(o).width, u = l - ot - d, g = a - pn + 4;
  n.fillStyle = t.accent, n.fillRect(u - f - d, g - c, f + d * 2, 14 + c * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(o, u, g), n.restore();
}
function ua(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, l = 60 * e, a = 24 * l, s = 7 * a;
  return n >= s && n % s === 0 ? n / s + "W" : n >= a && n % a === 0 ? n / a + "D" : n >= l && n % l === 0 ? n / l + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function fa(n, t, e, l, a, s, o, d) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, c * 0.5), u = Math.min(l.length, a.firstIdx + a.count), g = (b) => {
    let k = 0, C = l.length - 1;
    for (; k <= C; ) {
      const v = k + C >> 1, h = l[v].start - b;
      if (Math.abs(h) <= f) return v;
      h < 0 ? k = v + 1 : C = v - 1;
    }
    return -1;
  }, m = 7;
  for (const b of e) {
    const k = g(b.timestamp);
    if (k < 0 || k < a.firstIdx || k >= u) continue;
    const C = rt(k, a.firstIdx, d), v = Ye(b.price, s, o.priceY0, o.priceY1);
    if (v < o.priceY0 || v > o.priceY1) continue;
    const h = b.color ?? (b.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = h, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), b.kind === "entry" ? (n.moveTo(C, v - m), n.lineTo(C - m, v + m - 1), n.lineTo(C + m, v + m - 1)) : (n.moveTo(C, v + m), n.lineTo(C - m, v - m + 1), n.lineTo(C + m, v - m + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function da(n, t, e, l, a, s = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const d = l.priceY1 - l.priceY0, c = s ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, f = ta(o, c), u = Math.ceil(e.min / f) * f, g = s ? wn : ot;
  n.font = s ? ql : Ze, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let m = u; m <= e.max; m += f) {
    const b = Ye(m, e, l.priceY0, l.priceY1);
    b < l.priceY0 || b > l.priceY1 || (n.beginPath(), n.moveTo($e, Math.round(b) + 0.5), n.lineTo(a - g, Math.round(b) + 0.5), n.stroke(), n.fillText(at(m), a - g + 3, b));
  }
  n.globalAlpha = 1;
}
function va(n, t, e, l, a, s) {
  if (l.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(l.count / 6));
  n.font = Ze, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const c = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < c; f += d) {
    const u = e[f];
    if (!u) continue;
    const g = rt(f, l.firstIdx, a);
    n.fillText(yn(u.start), g, s - pn + 4);
  }
  n.globalAlpha = 1;
}
function ha(n, t, e, l, a, s, o, d, c) {
  const f = Math.floor((d.x - $e) / o), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), g = e[u];
  if (!g) return;
  const m = rt(u, l.firstIdx, o);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(m) + 0.5, s.priceY0), n.lineTo(Math.round(m) + 0.5, s.volumeY1 || s.priceY1), n.stroke();
  const b = Math.max(s.priceY0, Math.min(s.priceY1, d.y));
  n.beginPath(), n.moveTo($e, Math.round(b) + 0.5), n.lineTo(c - ot, Math.round(b) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const k = a.max - a.min;
  if (k > 0) {
    const h = a.max - (b - s.priceY0) / (s.priceY1 - s.priceY0) * k, R = at(h);
    n.font = Ze, n.textBaseline = "middle", n.textAlign = "left";
    const E = n.measureText(R).width, P = 4, M = 2;
    n.fillStyle = t.accent, n.fillRect(c - ot + 2, b - 7 - M, E + P * 2, 14 + M * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(R, c - ot + 2 + P, b);
  }
  n.font = Ze, n.textBaseline = "top", n.textAlign = "center";
  const C = yn(g.start), v = n.measureText(C).width;
  n.fillStyle = t.accent, n.fillRect(m - v / 2 - 4, s.volumeY1 + 2, v + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(C, m, s.volumeY1 + 4), n.restore();
}
const rn = 0.25, sn = 6, ma = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ga = /* @__PURE__ */ Je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Gl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(n) {
    const t = n, e = z(null), l = z(null), a = { ...ve }, s = z(0), o = z(0), d = z(0), c = z(1), f = z(null), u = se(() => Math.max(1, t.slotW * c.value));
    let g = null, m = !1;
    function b() {
      if (g) {
        try {
          g.forceContextLoss();
        } catch {
        }
        try {
          g.dispose();
        } catch {
        }
        g = null;
      }
    }
    let k, C, v, h, R;
    const E = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${It}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): the full 0.5.0 dish, plus a fit-to-content rescale. The
    // raw inward map samples a shrunken region, so the texture's outer
    // margin (headers, edge columns) was never displayed at high strength.
    // Scaling the sampled field so the screen CORNERS land exactly on the
    // texture corners guarantees every content pixel is drawn; the sampled
    // range then overshoots [0,1] at the edge MIDPOINTS, which renders as
    // the classic pincushion silhouette — content pinching inward on each
    // side, corners touching, the header riding the bowed top edge.
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;                        // corner dist = |cc|²·as at (.5,.5)
      float cp = 0.5 * (1.0 + cd) * cd;           // corner inward pull
      m /= (1.0 - 2.0 * cp);                      // corners → exactly ±0.5
    }
    return vec2(0.5) + m;
  }

  ${Et}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${Dt}

    gl_FragColor = color;
  }
`;
    function P() {
      if (!(!l.value || !e.value)) {
        if (R = document.createElement("canvas"), t.flat) {
          m = !0, M();
          return;
        }
        try {
          g = new Y.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !g.getContext() && (g.dispose(), g = null, m = !0), m) {
          M();
          return;
        }
        g.setPixelRatio(1), g.setClearColor(0, 0), k = new Y.Scene(), C = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new Y.CanvasTexture(R), h.minFilter = Y.LinearFilter, h.magFilter = Y.LinearFilter, v = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ft()
          },
          vertexShader: ma,
          fragmentShader: E,
          transparent: !0
        }), k.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), v)), M();
      }
    }
    function M() {
      if (!e.value || !g && !m) return;
      const L = e.value.clientWidth, G = e.value.clientHeight;
      !L || !G || !(R.width !== L || R.height !== G) || (R.width = L, R.height = G, s.value = L, o.value = G, g ? (h && (h.dispose(), h = new Y.CanvasTexture(R), h.minFilter = Y.LinearFilter, h.magFilter = Y.LinearFilter, v && (v.uniforms.uTex.value = h)), g.setPixelRatio(window.devicePixelRatio || 1), g.setSize(L, G)) : l.value && (l.value.width = L, l.value.height = G, l.value.style.width = L + "px", l.value.style.height = G + "px"), y());
    }
    function y() {
      if (!(R != null && R.width)) return;
      if (m) {
        if (!l.value) return;
        dn(R, {
          candles: t.candles,
          slotW: u.value,
          scrollX: d.value,
          theme: t.theme,
          glow: !1,
          showVolume: t.showVolume,
          volumeFraction: t.volumeFraction,
          hover: f.value,
          overlays: t.overlays,
          markers: t.markers,
          compact: t.compact,
          colors: t.colors
        });
        const G = l.value.getContext("2d");
        G && (G.clearRect(0, 0, l.value.width, l.value.height), G.drawImage(R, 0, 0));
        return;
      }
      if (!g || !v || !h) return;
      const L = t.theme === "paper";
      v.uniforms.uStrength.value = je(t.curvature), v.uniforms.uScanlines.value = t.scanlines && !L ? 1 : 0, v.uniforms.uVignette.value = L ? 0 : 1, At(v, t.magnify, a, R.width, R.height), dn(R, {
        candles: t.candles,
        slotW: u.value,
        scrollX: d.value,
        theme: t.theme,
        glow: t.glow,
        showVolume: t.showVolume,
        volumeFraction: t.volumeFraction,
        hover: f.value,
        overlays: t.overlays,
        markers: t.markers,
        compact: t.compact,
        colors: t.colors
      }), h.needsUpdate = !0, g.render(k, C);
    }
    Q(() => t.theme, () => y()), Q(() => t.curvature, () => y()), Q(() => t.scanlines, () => y()), Q(() => t.glow, () => y()), Q(() => t.showVolume, () => y()), Q(() => t.volumeFraction, () => y()), Q(() => t.slotW, () => y()), Q(() => t.candles, () => y(), { deep: !1 }), Q(() => t.overlays, () => y(), { deep: !1 }), Q(() => t.markers, () => y(), { deep: !1 }), Q(() => t.compact, () => y()), Q(() => t.magnify, (L) => {
      L || (a.x = ve.x, a.y = ve.y), y();
    }), Q(() => t.colors, () => y(), { deep: !0 }), Q(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), Q(d, () => y()), Q(c, () => y()), Q(f, () => y()), Q(u, () => y());
    let I = null, U = null, D = 0;
    const Z = Rt("cathodeResetTick", z(0));
    Q(Z, () => q());
    function q() {
      cancelAnimationFrame(D), D = requestAnimationFrame(M);
    }
    function V(L) {
      L.preventDefault();
    }
    function J() {
      g == null || g.dispose(), g = null, m = !1, P();
    }
    function $(L) {
      if (!l.value) return [-1, -1];
      const G = l.value.getBoundingClientRect();
      return [L.clientX - G.left, L.clientY - G.top];
    }
    function _(L) {
      var Fe;
      const G = u.value;
      if (G <= 0) return 0;
      const re = ((Fe = t.candles) == null ? void 0 : Fe.length) ?? 0, xe = Math.max(1, Math.floor((s.value || 1) / G)), De = Math.max(0, re - xe);
      return Math.max(0, Math.min(L, De * G));
    }
    function te(L) {
      var xe;
      if (L.deltaX !== 0 || L.shiftKey && L.deltaY !== 0) {
        const De = L.deltaX !== 0 ? L.deltaX : L.deltaY;
        d.value = _(d.value + De);
        return;
      }
      if (L.deltaY === 0) return;
      const [G] = $(L), re = u.value;
      if (G >= 0 && re > 0 && ((xe = t.candles) != null && xe.length)) {
        const De = Math.max(1, Math.floor((s.value || 1) / re)), it = Math.max(0, t.candles.length - De - Math.floor(d.value / re)) + (G - 8) / re, ht = Math.exp(-L.deltaY * 15e-4), st = Math.max(rn, Math.min(sn, c.value * ht));
        c.value = st;
        const tt = t.slotW * st, He = Math.max(1, Math.floor((s.value || 1) / tt)), Ie = it - (G - 8) / tt, Be = Math.max(0, t.candles.length - He - Ie);
        d.value = _(Be * tt);
      } else {
        const De = Math.exp(-L.deltaY * 15e-4);
        c.value = Math.max(rn, Math.min(sn, c.value * De));
      }
    }
    let le = !1, ee = 0, j = 0;
    function i(L) {
      L.button === 0 && (le = !0, ee = L.clientX, j = d.value, f.value = null, e.value && e.value.focus());
    }
    function w(L) {
      const G = Math.exp(L * 0.18);
      c.value = Math.max(rn, Math.min(sn, c.value * G)), d.value = _(d.value);
    }
    function B(L) {
      const G = u.value, re = L.shiftKey ? 20 : 3;
      switch (L.key) {
        case "ArrowLeft":
          L.preventDefault(), d.value = _(d.value + G * re);
          break;
        case "ArrowRight":
          L.preventDefault(), d.value = _(d.value - G * re);
          break;
        case "ArrowUp":
          L.preventDefault(), w(1);
          break;
        case "ArrowDown":
          L.preventDefault(), w(-1);
          break;
        case "Home":
          L.preventDefault(), d.value = _(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          L.preventDefault(), d.value = 0;
          break;
      }
    }
    function T(L) {
      if (le) {
        const G = L.clientX - ee;
        d.value = _(j + G);
        return;
      }
    }
    function N() {
      le = !1;
    }
    function H(L) {
      if (L.touches.length !== 1) return;
      const G = L.touches[0];
      le = !0, ee = G.clientX, j = d.value, f.value = null;
    }
    function O(L) {
      if (!le || L.touches.length !== 1) return;
      L.preventDefault();
      const re = L.touches[0].clientX - ee;
      d.value = _(j + re);
    }
    function ae() {
      le = !1;
    }
    function oe(L) {
      if (t.magnify && l.value) {
        const xe = _t(L, l.value);
        a.x = xe.x, a.y = xe.y, y();
      }
      if (le) return;
      const [G, re] = $(L);
      if (G < 0 || re < 0) {
        f.value = null;
        return;
      }
      f.value = { x: G, y: re };
    }
    function he() {
      f.value = null, a.x = ve.x, a.y = ve.y, y();
    }
    Ue(() => {
      document.addEventListener("mousemove", T), document.addEventListener("mouseup", N), _e(() => {
        var L;
        P(), l.value && (l.value.addEventListener("webglcontextlost", V), l.value.addEventListener("webglcontextrestored", J)), e.value && (I = new ResizeObserver(() => M()), I.observe(e.value), U = new IntersectionObserver((G) => {
          G.some((re) => re.isIntersecting) && q();
        }), U.observe(e.value)), window.addEventListener("resize", q), (L = window.visualViewport) == null || L.addEventListener("resize", q);
      });
    }), Qe(() => {
      var L, G, re;
      document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", N), (L = l.value) == null || L.removeEventListener("webglcontextlost", V), (G = l.value) == null || G.removeEventListener("webglcontextrestored", J), I == null || I.disconnect(), U == null || U.disconnect(), window.removeEventListener("resize", q), (re = window.visualViewport) == null || re.removeEventListener("resize", q), cancelAnimationFrame(D), b();
    });
    const Ce = se(() => xt[t.theme] ?? xt.none), Ee = se(() => ({
      background: Ce.value.bg
    }));
    return (L, G) => (Me(), Te("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ke(Ee.value),
      tabindex: "0",
      onKeydown: B
    }, [
      ue("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: ft(te, ["prevent"]),
        onMousedown: i,
        onMousemove: oe,
        onMouseleave: he,
        onTouchstartPassive: H,
        onTouchmove: O,
        onTouchend: ae,
        onTouchcancel: ae
      }, null, 544)
    ], 36));
  }
}), ja = /* @__PURE__ */ et(ga, [["__scopeId", "data-v-7c334778"]]), wt = 22, Ct = 6, pa = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, wa = /* @__PURE__ */ Je({
  __name: "CathodeCandleGrid",
  props: {
    cells: {},
    theme: { default: "none" },
    curvature: { default: 0 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    magnify: { type: Boolean, default: !1 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: 0.22 },
    slotW: { default: 3 },
    colors: {},
    bendField: { type: Boolean, default: !0 },
    minCellW: { default: 210 },
    cellAspect: { default: 0.6 }
  },
  emits: ["cell-click"],
  setup(n, { emit: t }) {
    const e = n, l = t, a = z(null), s = z(null), o = z(-1), d = z(0), c = { ...ve };
    let f = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, g = !1;
    function m() {
      if (u) {
        try {
          u.forceContextLoss();
        } catch {
        }
        try {
          u.dispose();
        } catch {
        }
        u = null;
      }
    }
    let b, k, C, v, h;
    const R = z(0), E = z(0), P = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${It}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend + concave fit-to-content rescale — see CathodeGrid for the
    // full derivation (corners land exactly on texture corners; nothing crops).
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;
      float cp = 0.5 * (1.0 + cd) * cd;
      m /= (1.0 - 2.0 * cp);
    }
    return vec2(0.5) + m;
  }

  ${Et}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${Dt}

    gl_FragColor = color;
  }
`;
    function M() {
      if (!(!s.value || !a.value)) {
        h = document.createElement("canvas");
        try {
          u = new Y.WebGLRenderer({ canvas: s.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          g = !0;
        }
        if (!g && !u.getContext() && (u.dispose(), u = null, g = !0), g) {
          y();
          return;
        }
        u.setPixelRatio(f), u.setClearColor(0, 0), b = new Y.Scene(), k = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new Y.CanvasTexture(h), v.minFilter = Y.LinearFilter, v.magFilter = Y.LinearFilter, C = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ft()
          },
          vertexShader: pa,
          fragmentShader: P,
          transparent: !0
        }), b.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), C)), y();
      }
    }
    function y() {
      if (!a.value || !u && !g) return;
      const i = a.value.clientWidth, w = a.value.clientHeight;
      if (!i || !w) return;
      R.value = i, E.value = w, f = Math.min(window.devicePixelRatio || 1, 2);
      const B = e.bendField ? Math.round(i * Un(e.curvature)) : i, T = Math.round(B * f), N = Math.round(w * f), H = h.width !== T || h.height !== N;
      h.width = T, h.height = N, u ? (H && v && (v.dispose(), v = new Y.CanvasTexture(h), v.minFilter = Y.LinearFilter, v.magFilter = Y.LinearFilter, C.uniforms.uTex.value = v), u.setPixelRatio(f), u.setSize(i, w)) : s.value && (s.value.width = Math.round(i * f), s.value.height = Math.round(w * f), s.value.style.width = i + "px", s.value.style.height = w + "px"), V();
    }
    function I() {
      const i = (h == null ? void 0 : h.width) || 0, w = Math.max(1, Math.floor(i / e.minCellW)), B = Math.floor(i / w), T = Math.round(B * e.cellAspect), N = wt + T + Ct;
      return { rects: e.cells.map((O, ae) => ({
        x: ae % w * B,
        y: Math.floor(ae / w) * N - d.value,
        w: B,
        h: N
      })), rowH: N, totalH: Math.ceil(e.cells.length / w) * N, cols: w };
    }
    const U = () => {
      const { totalH: i } = I();
      return Math.max(0, i - ((h == null ? void 0 : h.height) || 0));
    }, D = /* @__PURE__ */ new Map();
    function Z(i, w, B) {
      const T = i.candles[i.candles.length - 1], N = `${w}x${B}@${f}|${i.candles.length}|${T ? T.start + ":" + T.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, H = D.get(i.id);
      if (H && H.key === N) return H.canvas;
      const O = (H == null ? void 0 : H.canvas) ?? document.createElement("canvas");
      O.width = Math.round(w * f), O.height = Math.round(B * f);
      const ae = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, i.candles.length))), oe = w < 260 && i.overlays ? i.overlays.map((he) => ({ ...he, label: "" })) : i.overlays;
      return dn(O, {
        candles: i.candles,
        slotW: ae,
        scrollX: Math.max(0, i.candles.length * ae - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: oe,
        compact: !0,
        colors: e.colors,
        dpr: f
      }), D.set(i.id, { canvas: O, key: N }), O;
    }
    const q = se(() => ({ ...xt[e.theme] ?? xt.none, ...e.colors ?? {} }));
    function V() {
      var T;
      if (!(h != null && h.width)) return;
      const i = h.getContext("2d");
      if (!i) return;
      const w = q.value;
      i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, h.width, h.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (i.fillStyle = w.bg, i.fillRect(0, 0, h.width, h.height)), i.setTransform(f, 0, 0, f, 0, 0);
      const { rects: B } = I();
      i.font = "600 11px ui-monospace, SFMono-Regular, monospace", i.textBaseline = "middle";
      for (let N = 0; N < e.cells.length; N++) {
        const H = e.cells[N], O = B[N];
        if (O.y + O.h < 0 || O.y > h.height / f) continue;
        const ae = O.x + Ct / 2, oe = O.w - Ct;
        i.strokeStyle = H.open ? w.candleBull : w.gridline, i.lineWidth = N === o.value ? 2 : 1, i.strokeRect(ae + 0.5, O.y + 0.5, oe - 1, O.h - Ct - 1), i.save(), i.beginPath(), i.rect(ae, O.y, oe, wt), i.clip();
        const he = O.y + wt / 2 + 1, Ce = H.note ? i.measureText(H.note).width + (H.open ? 22 : 12) : H.open ? 16 : 0, Ee = H.badge ? i.measureText(H.badge).width + 6 : 0, L = oe - 14 - Ee - Ce;
        let G = H.title;
        if (i.measureText(G).width > L) {
          for (; G.length > 1 && i.measureText(G + "…").width > L; ) G = G.slice(0, -1);
          G += "…";
        }
        let re = ae + 7;
        i.fillStyle = w.text, i.textAlign = "left", i.fillText(G, re, he), re += i.measureText(G).width + 6, H.badge && (i.fillStyle = w.accent, i.fillText(H.badge, re, he)), H.note && (i.textAlign = "right", i.fillStyle = H.noteColor || w.accent, i.fillText(H.note, ae + oe - (H.open ? 16 : 7), he), i.textAlign = "left"), i.restore(), H.open && (i.fillStyle = w.candleBull, i.beginPath(), i.arc(ae + oe - 9, O.y + wt / 2 + 1, 3, 0, Math.PI * 2), i.fill());
        const xe = O.y + wt, De = O.h - wt - Ct;
        H.candles.length ? i.drawImage(Z(H, oe - 2, De - 1), ae + 1, xe, oe - 2, De - 1) : (i.fillStyle = w.accent, i.textAlign = "center", i.fillText("· · ·", ae + oe / 2, xe + De / 2), i.textAlign = "left");
      }
      if (g) {
        const N = (T = s.value) == null ? void 0 : T.getContext("2d");
        N && s.value && N.drawImage(h, 0, 0, h.width, h.height, 0, 0, s.value.width, s.value.height);
        return;
      }
      !u || !C || !v || (C.uniforms.uStrength.value = je(e.curvature), C.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, C.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, At(C, e.magnify, c, R.value || h.width, E.value || h.height), v.needsUpdate = !0, u.render(b, k));
    }
    function J(i) {
      if (!s.value) return [-1, -1];
      const w = s.value.getBoundingClientRect();
      return Xn(
        i.clientX - w.left,
        i.clientY - w.top,
        w.width,
        w.height,
        je(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((h == null ? void 0 : h.width) || w.width) / f,
        ((h == null ? void 0 : h.height) || w.height) / f
      );
    }
    function $(i, w) {
      if (i < 0) return -1;
      const { rects: B } = I();
      return B.findIndex((T) => i >= T.x && i < T.x + T.w && w >= T.y && w < T.y + T.h);
    }
    function _(i) {
      const [w, B] = J(i), T = $(w, B);
      T >= 0 && l("cell-click", e.cells[T].id);
    }
    function te(i) {
      if (e.magnify && s.value) {
        const N = _t(i, s.value);
        c.x = N.x, c.y = N.y;
      }
      const [w, B] = J(i), T = $(w, B);
      T !== o.value ? (o.value = T, V()) : e.magnify && V(), s.value && (s.value.style.cursor = T >= 0 ? "pointer" : "default");
    }
    function le() {
      o.value = -1, c.x = ve.x, c.y = ve.y, V();
    }
    function ee(i) {
      const w = U();
      w <= 0 || (i.preventDefault(), d.value = Math.max(0, Math.min(w, d.value + i.deltaY)), V());
    }
    let j = null;
    return Ue(() => {
      M(), j = new ResizeObserver(() => y()), a.value && j.observe(a.value);
    }), Qe(() => {
      j == null || j.disconnect(), m(), D.clear();
    }), Q(() => [e.curvature, e.bendField], () => _e(y)), Q(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      d.value = Math.min(d.value, U()), V();
    }, { deep: !1 }), (i, w) => (Me(), Te("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      ue("canvas", {
        ref_key: "canvasEl",
        ref: s,
        onClick: _,
        onMousemove: te,
        onMouseleave: le,
        onWheel: ee
      }, null, 544)
    ], 512));
  }
}), Za = /* @__PURE__ */ et(wa, [["__scopeId", "data-v-9f2b24f8"]]), xn = z(0), vn = 28, yt = 12;
let hn = 10, Ut = "cathode.layout", Gt = !1;
const Re = z({});
function ya(n, t = "cathode.layout") {
  if (!Gt) {
    Gt = !0, Ut = t;
    try {
      const e = localStorage.getItem(Ut);
      if (e) {
        Re.value = JSON.parse(e), Pn();
        return;
      }
    } catch {
    }
    Re.value = { ...n }, Pn();
  }
}
function Pn() {
  let n = 10;
  for (const t of Object.values(Re.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  hn = n;
}
function vt() {
  localStorage.setItem(Ut, JSON.stringify(Re.value));
}
function xa(n) {
  Gt = !1, localStorage.removeItem(Ut), Re.value = { ...n }, vt(), Gt = !0, xn.value++;
}
function qn(n) {
  hn++, Re.value[n] && (Re.value[n].zIndex = hn);
}
function ba(n, t) {
  Re.value[n].visible = t, vt();
}
function Sa(n, t) {
  Re.value[n].minimized = t, t && (Re.value[n].maximized = !1), vt();
}
function Ma(n, t) {
  Re.value[n].maximized = t, t && (Re.value[n].minimized = !1, qn(n)), vt();
}
function Ta(n, t, e) {
  Re.value[n].x = Math.round(t), Re.value[n].y = Math.round(e), vt();
}
function Ca(n, t, e) {
  Re.value[n].w = Math.round(t), Re.value[n].h = Math.round(e), vt();
}
function Ja(n, t, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), s = Math.floor((n - yt * (l + 1)) / l), o = Math.floor((t - yt * (a + 1)) / a), d = {};
  return e.forEach((c, f) => {
    const u = f % l, g = Math.floor(f / l);
    d[c] = {
      x: yt + u * (s + yt),
      y: yt + g * (o + yt),
      w: s,
      h: o,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: f + 1
    };
  }), d;
}
function jn() {
  return {
    containers: Re,
    TITLEBAR_H: vn,
    load: ya,
    save: vt,
    reset: xa,
    bringToFront: qn,
    setVisible: ba,
    setMinimized: Sa,
    setMaximized: Ma,
    updatePos: Ta,
    updateSize: Ca
  };
}
const ka = { class: "ws-toolbar" }, La = {
  key: 0,
  class: "ws-restore-menu"
}, Ra = {
  key: 0,
  class: "ws-restore-empty"
}, Ia = ["onClick"], Ea = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: l, reset: a, setVisible: s } = jn(), o = z(null);
    Dn("cathodeWorkspace", o), Dn("cathodeResetTick", xn), Ue(() => {
      if (!o.value) return;
      const { clientWidth: v, clientHeight: h } = o.value, R = t.initialLayout ?? {};
      l(R, t.storageKey ?? "cathode.layout");
      const E = Object.keys(e.value)[0];
      E && d(E);
    });
    function d(v) {
      var R;
      document.querySelectorAll(".cc").forEach((E) => E.classList.remove("cc-focused"));
      const h = (R = o.value) == null ? void 0 : R.querySelector(`#cc-${v}`);
      h && h.classList.add("cc-focused");
    }
    function c() {
      !o.value || !t.initialLayout || a(t.initialLayout);
    }
    function f(v) {
      const h = v.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((R) => R.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const u = z(!1), g = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function m(v) {
      s(v, !0), u.value = !1;
    }
    function b(v) {
      if (!u.value) return;
      const h = v.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (u.value = !1);
    }
    function k(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Ue(() => {
      document.addEventListener("click", b), document.addEventListener("keydown", k);
    }), Qe(() => {
      document.removeEventListener("click", b), document.removeEventListener("keydown", k);
    });
    function C(v) {
      var h;
      return ((h = t.containerTitles) == null ? void 0 : h[v]) ?? v;
    }
    return (v, h) => (Me(), Te("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      un(v.$slots, "default", {}, void 0, !0),
      un(v.$slots, "overlay", {}, void 0, !0),
      ue("div", ka, [
        n.initialLayout ? (Me(), Te("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : qe("", !0),
        h[1] || (h[1] = ue("div", { class: "ws-sep" }, null, -1)),
        ue("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (R) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Hn(dl, { name: "menu" }, {
        default: vl(() => [
          u.value ? (Me(), Te("div", La, [
            h[3] || (h[3] = ue("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            g().length ? qe("", !0) : (Me(), Te("div", Ra, " No closed panels ")),
            (Me(!0), Te(hl, null, ml(g(), (R) => (Me(), Te("div", {
              key: R,
              class: "ws-restore-item",
              onClick: (E) => m(R)
            }, [
              h[2] || (h[2] = ue("span", { class: "ws-restore-icon" }, "⊞", -1)),
              gl(" " + Xe(C(R)), 1)
            ], 8, Ia))), 128))
          ])) : qe("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Qa = /* @__PURE__ */ et(Ea, [["__scopeId", "data-v-5838d04b"]]), Da = ["id"], Fa = { class: "cc-title" }, Aa = {
  key: 0,
  class: "cc-size-badge"
}, _a = { class: "cc-controls" }, Ba = ["title"], Wa = { class: "cc-body" }, Pa = 200, Ya = 80, Yn = 60, $a = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: l, setVisible: a, setMinimized: s, setMaximized: o, updatePos: d, updateSize: c } = jn(), f = Rt("cathodeWorkspace", z(null)), u = se(() => e.value[t.id]), g = se(() => {
      const i = u.value, w = t.curvature ?? 0;
      if (!i) return {};
      const B = { "--curvature": Math.abs(w) };
      return i.maximized ? { ...B, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: i.zIndex } : {
        ...B,
        left: i.x + "px",
        top: i.y + "px",
        width: i.w + "px",
        height: i.minimized ? vn + "px" : i.h + "px",
        zIndex: i.zIndex,
        display: i.visible ? "flex" : "none"
      };
    });
    let m = !1, b = 0, k = 0;
    function C(i) {
      var T;
      if (i.target.closest(".cc-btn") || u.value.maximized) return;
      l(t.id), m = !0;
      const w = (T = f.value) == null ? void 0 : T.querySelector(`#cc-${t.id}`);
      if (!w) return;
      const B = w.getBoundingClientRect();
      b = i.clientX - B.left, k = i.clientY - B.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", h), i.preventDefault();
    }
    function v(i) {
      var H;
      if (!m || !f.value) return;
      const w = f.value.getBoundingClientRect(), B = ((H = u.value) == null ? void 0 : H.w) ?? 300;
      let T = i.clientX - w.left - b, N = i.clientY - w.top - k;
      T = Math.max(Yn - B, Math.min(w.width - Yn, T)), N = Math.max(0, Math.min(w.height - vn, N)), d(t.id, T, N);
    }
    function h() {
      m = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h);
    }
    let R = !1, E = 0, P = 0, M = 0, y = 0;
    const I = z("");
    function U(i) {
      u.value.maximized || (l(t.id), R = !0, E = i.clientX, P = i.clientY, M = u.value.w, y = u.value.h, document.addEventListener("mousemove", D), document.addEventListener("mouseup", Z), i.preventDefault(), i.stopPropagation());
    }
    function D(i) {
      if (!R) return;
      const w = Math.max(Pa, M + (i.clientX - E)), B = Math.max(Ya, y + (i.clientY - P));
      c(t.id, w, B), I.value = `${Math.round(w)}×${Math.round(B)}`;
    }
    function Z() {
      R = !1, I.value = "", document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", Z), q.value++;
    }
    const q = z(0);
    Q(xn, () => {
      q.value++;
    }), Qe(() => {
      var i;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", Z), (i = V.value) == null || i.removeEventListener("scroll", $), _();
    });
    const V = z(null);
    function J(i) {
      if (t.canvas) return [];
      const w = i.children[0];
      return w ? Array.from(w.children) : [];
    }
    function $() {
      const i = V.value, w = t.curvature ?? 0;
      if (!i) return;
      const B = J(i);
      if (!B.length) return;
      const T = i.clientHeight, N = T / 2, H = w * 38e-4;
      B.forEach((O) => {
        if (!O.dataset.origFs) {
          const xe = getComputedStyle(O);
          O.dataset.origFs = xe.fontSize, O.dataset.origLh = xe.lineHeight;
        }
        if (w === 0) {
          O.style.fontSize = "", O.style.lineHeight = "";
          return;
        }
        const ae = O.getBoundingClientRect(), oe = i.getBoundingClientRect(), he = ae.top - oe.top + ae.height / 2, Ce = Math.min(1, Math.abs(he - N) / (T / 2)), Ee = 1 + H * Math.cos(Ce * Math.PI / 2), L = parseFloat(O.dataset.origFs), G = O.dataset.origLh, re = G === "normal" ? L * 1.4 : parseFloat(G);
        isNaN(L) || (O.style.fontSize = `${(L * Ee).toFixed(2)}px`), isNaN(re) || (O.style.lineHeight = `${(re * Ee).toFixed(2)}px`);
      });
    }
    function _() {
      const i = V.value;
      i && J(i).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    Q(() => t.curvature, (i) => {
      (i ?? 0) === 0 ? _() : $();
    }), Ue(() => {
      var i;
      (i = V.value) == null || i.addEventListener("scroll", $, { passive: !0 }), _e($);
    });
    function te() {
      s(t.id, !u.value.minimized), _e(() => {
        q.value++;
      });
    }
    function le() {
      o(t.id, !u.value.maximized), _e(() => {
        q.value++;
      });
    }
    function ee() {
      a(t.id, !1);
    }
    function j() {
      l(t.id);
    }
    return (i, w) => u.value && u.value.visible ? (Me(), Te("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: pl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: Ke(g.value),
      onMousedown: j
    }, [
      ue("div", {
        class: "cc-titlebar",
        onMousedown: C
      }, [
        w[0] || (w[0] = ue("span", { class: "cc-status-dot" }, null, -1)),
        ue("span", Fa, Xe(n.title), 1),
        I.value ? (Me(), Te("span", Aa, Xe(I.value), 1)) : qe("", !0),
        ue("div", _a, [
          ue("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ft(te, ["stop"])
          }, "─"),
          ue("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: ft(le, ["stop"])
          }, Xe(u.value.maximized ? "⤡" : "⤢"), 9, Ba),
          ue("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ft(ee, ["stop"])
          }, "✕")
        ])
      ], 32),
      zn(ue("div", Wa, [
        ue("div", {
          ref_key: "bodyEl",
          ref: V,
          class: "cc-screen",
          onScroll: $
        }, [
          un(i.$slots, "default", { resizeKey: q.value }, void 0, !0),
          w[1] || (w[1] = ue("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [wl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (Me(), Te("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ft(U, ["stop"])
      }, null, 32)) : qe("", !0)
    ], 46, Da)) : qe("", !0);
  }
}), eo = /* @__PURE__ */ et($a, [["__scopeId", "data-v-ca0af4ca"]]), Ha = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, za = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): the full 0.5.0 dish, plus a fit-to-content rescale. The
    // raw inward map samples a shrunken region, so the texture's outer
    // margin (headers, edge columns) was never displayed at high strength.
    // Scaling the sampled field so the screen CORNERS land exactly on the
    // texture corners guarantees every content pixel is drawn; the sampled
    // range then overshoots [0,1] at the edge MIDPOINTS, which renders as
    // the classic pincushion silhouette — content pinching inward on each
    // side, corners touching, the header riding the bowed top edge.
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;                        // corner dist = |cc|²·as at (.5,.5)
      float cp = 0.5 * (1.0 + cd) * cd;           // corner inward pull
      m /= (1.0 - 2.0 * cp);                      // corners → exactly ±0.5
    }
    return vec2(0.5) + m;
  }

  void main() {
    vec2 uv = barrel(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    vec4 color = texture2D(uTex, uv);
    if (uScanlines > 0.5 && mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }
    gl_FragColor = color;
  }
`, Va = 100, Oa = /* @__PURE__ */ Je({
  __name: "CathodeLoader",
  props: {
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    label: { default: "BOOTING" }
  },
  setup(n) {
    const t = n, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, l = z(null), a = z(null);
    let s = null, o = !1;
    function d() {
      if (s) {
        try {
          s.forceContextLoss();
        } catch {
        }
        try {
          s.dispose();
        } catch {
        }
        s = null;
      }
    }
    let c, f, u, g, m, b = null, k = 0;
    function C(y) {
      y - k >= Va && (R(), k = y), b = requestAnimationFrame(C);
    }
    function v() {
      if (!l.value || !m) return;
      const y = l.value.clientWidth, I = l.value.clientHeight;
      y <= 0 || I <= 0 || m.width === y && m.height === I || (m.width = y, m.height = I, s && s.setSize(y, I, !1), a.value && (a.value.width = y, a.value.height = I, a.value.style.width = y + "px", a.value.style.height = I + "px"));
    }
    function h() {
      if (!(m != null && m.width)) return;
      const y = m.getContext("2d");
      if (!y) return;
      const I = m.width, U = m.height, D = e[t.theme] ?? e.none;
      y.clearRect(0, 0, I, U), y.fillStyle = D.bg, y.fillRect(0, 0, I, U);
      const Z = Date.now(), q = (Z / 500 | 0) % 2 === 0, V = (Z / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(I, U) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = D.text, t.glow && (y.shadowColor = D.text, y.shadowBlur = 14);
      const J = ".".repeat(V).padEnd(3, " "), $ = `${t.label}${J}`;
      if (y.fillText($, I / 2, U / 2), y.shadowBlur = 0, q) {
        const _ = y.measureText($), te = y.measureText("M").width, le = parseFloat(y.font), ee = I / 2 + _.width / 2 + 4, j = U / 2 - le / 2 + 2;
        y.fillStyle = D.cursor, t.glow && (y.shadowColor = D.cursor, y.shadowBlur = 12), y.fillRect(ee, j, te * 0.7, le * 0.95), y.shadowBlur = 0;
      }
    }
    function R() {
      if (!m) return;
      if (h(), o) {
        if (!a.value) return;
        const I = a.value.getContext("2d");
        I && I.drawImage(m, 0, 0);
        return;
      }
      if (!s || !u || !g) return;
      const y = t.theme === "paper";
      u.uniforms.uStrength.value = je(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, g.needsUpdate = !0, s.render(c, f);
    }
    function E() {
      if (!(!a.value || !l.value)) {
        m = document.createElement("canvas");
        try {
          s = new Y.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          o = !0;
        }
        if (!o && !s.getContext() && (s.dispose(), s = null, o = !0), o) {
          v();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), c = new Y.Scene(), f = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new Y.CanvasTexture(m), g.minFilter = Y.LinearFilter, g.magFilter = Y.LinearFilter, u = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ha,
          fragmentShader: za,
          transparent: !0
        }), c.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), u)), v();
      }
    }
    let P = null;
    Ue(() => {
      E(), R(), b = requestAnimationFrame(C), l.value && (P = new ResizeObserver(() => v()), P.observe(l.value));
    }), Qe(() => {
      b !== null && cancelAnimationFrame(b), P == null || P.disconnect(), d(), g == null || g.dispose(), u == null || u.dispose();
    }), Q(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => R());
    const M = se(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (y, I) => (Me(), Te("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ke(M.value)
    }, [
      ue("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), to = /* @__PURE__ */ et(Oa, [["__scopeId", "data-v-d00e5f47"]]), Kt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, $n = (n, t) => t === "left" ? n.left : t === "right" ? n.right : !t || t === "neutral" ? n.dim : t, Se = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ge = 12;
function cn(n, t, e) {
  const l = [];
  for (const a of t.split(`
`)) {
    let s = "";
    for (const o of a.split(" ")) {
      const d = s ? `${s} ${o}` : o;
      s && n.measureText(d).width > e ? (l.push(s), s = o) : s = d;
    }
    l.push(s);
  }
  return l;
}
function kt(n, t, e, l, a, s) {
  const o = Math.min(s, l / 2, a / 2);
  n.beginPath(), n.moveTo(t + o, e), n.lineTo(t + l - o, e), n.quadraticCurveTo(t + l, e, t + l, e + o), n.lineTo(t + l, e + a - o), n.quadraticCurveTo(t + l, e + a, t + l - o, e + a), n.lineTo(t + o, e + a), n.quadraticCurveTo(t, e + a, t, e + a - o), n.lineTo(t, e + o), n.quadraticCurveTo(t, e, t + o, e), n.closePath();
}
function Na(n, t) {
  var I, U;
  const e = n.getContext("2d");
  if (!e) return 0;
  const l = t.dpr || 1, a = n.width / l, s = n.height / l, o = { ...Kt[t.theme] ?? Kt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(l, 0, 0, l, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, a, s);
  const d = (D) => D > 0 ? o.right : D < 0 ? o.left : o.neutral, c = d(t.value), f = (D, Z = 10) => {
    t.glow && (e.shadowColor = D, e.shadowBlur = Z);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, g = Math.max(40, a - ge * 2);
  let m = ge;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const b = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${Se}`;
  const k = e.measureText(b).width;
  e.fillStyle = c, f(c, 14), e.fillText(b, ge, m + 30), u();
  const C = ge + k + 14;
  t.stance && (e.font = `700 14px ${Se}`, e.fillStyle = c, f(c, 8), e.fillText(t.stance.toUpperCase(), C, m + 15), u()), t.sub && (e.font = `11px ${Se}`, e.fillStyle = o.dim, e.fillText(t.sub, C, m + 31)), m += 48, e.font = `700 9px ${Se}`;
  const v = t.leftLabel.toUpperCase(), h = t.rightLabel.toUpperCase(), R = e.measureText(v).width, E = e.measureText(h).width, P = ge + R + 8, M = a - ge - E - 8, y = m + 10;
  if (e.fillStyle = o.left, e.fillText(v, ge, y + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(h, a - ge, y + 3), e.textAlign = "left", M - P > 24) {
    const D = e.createLinearGradient(P, 0, M, 0);
    D.addColorStop(0, o.left), D.addColorStop(0.45, o.surface), D.addColorStop(0.55, o.surface), D.addColorStop(1, o.right), kt(e, P, y - 4, M - P, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = D, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const Z = (P + M) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(Z, y - 8), e.lineTo(Z, y + 8), e.stroke();
    for (const _ of [0.25, 0.75]) {
      const te = P + _ * (M - P);
      e.beginPath(), e.moveTo(te, y - 5), e.lineTo(te, y + 5), e.stroke();
    }
    const q = t.max - t.min || 1, V = Math.max(0, Math.min(1, (t.shown - t.min) / q)), J = P + V * (M - P), $ = d(t.shown);
    e.beginPath(), e.moveTo(J, y - 10), e.lineTo(J - 4.5, y - 17), e.lineTo(J + 4.5, y - 17), e.closePath(), e.fillStyle = $, e.fill(), e.beginPath(), e.arc(J, y, 6.5, 0, Math.PI * 2), e.fillStyle = $, f($, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
    for (const _ of t.marks ?? []) {
      const te = (_.value - t.min) / q;
      if (te < 0 || te > 1) continue;
      const le = P + te * (M - P), ee = $n(o, _.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = ee, e.lineWidth = 1, e.beginPath(), e.moveTo(le, y - 9), e.lineTo(le, y + 9), e.stroke(), e.restore(), _.label) {
        e.font = `700 8px ${Se}`, e.fillStyle = ee;
        const j = e.measureText(_.label).width;
        e.fillText(_.label, Math.max(P, Math.min(M - j, le - j / 2)), y + 20);
      }
    }
  }
  if (m += (I = t.marks) != null && I.some((D) => D.label) ? 42 : 30, t.meter) {
    const D = t.meter, Z = D.min ?? 0, q = D.max ?? 1, V = q - Z || 1, J = D.tone === "up" ? o.right : D.tone === "down" ? o.left : D.tone === "warn" ? o.warn : o.neutral;
    D.label && (e.font = `700 9px ${Se}`, e.fillStyle = o.dim, e.fillText(D.label.toUpperCase(), ge, m + 9)), D.hint && (e.font = `9px ${Se}`, e.fillStyle = o.dim, e.textAlign = "right", e.fillText(D.hint, a - ge, m + 9), e.textAlign = "left"), (D.label || D.hint) && (m += 15), e.font = `700 12px ${Se}`;
    const $ = D.valueText ?? (D.value == null ? "—" : String(D.value)), _ = e.measureText($).width, te = ge, le = a - ge - _ - 10, ee = m + 6, j = !!((U = D.thresholds) != null && U.some((i) => i.label));
    if (le - te > 24) {
      if (kt(e, te, ee - 5, le - te, 10, 5), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), D.value != null) {
        const i = Math.max(0, Math.min(1, (D.value - Z) / V));
        i > 0 && (e.save(), kt(e, te, ee - 5, le - te, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = J, f(J, 8), e.fillRect(te, ee - 5, (le - te) * i, 10), e.restore());
      }
      for (const i of D.thresholds ?? []) {
        const w = (i.value - Z) / V;
        if (w < 0 || w > 1) continue;
        const B = te + w * (le - te), T = $n(o, i.color);
        if (e.strokeStyle = T, e.lineWidth = 1, e.beginPath(), e.moveTo(B, ee - 7), e.lineTo(B, ee + 7), e.stroke(), i.label) {
          e.font = `700 7.5px ${Se}`, e.fillStyle = T;
          const N = e.measureText(i.label).width;
          e.fillText(i.label, Math.max(te, Math.min(le - N, B - N / 2)), ee + 17);
        }
      }
    }
    e.font = `700 12px ${Se}`, e.fillStyle = J, e.textAlign = "right", f(J, 8), e.fillText($, a - ge, ee + 4), u(), e.textAlign = "left", m += j ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${Se}`;
    const D = cn(e, t.caption, g - 18), Z = D.length * 15 + 12;
    kt(e, ge, m, g, Z, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, D.forEach((q, V) => e.fillText(q, ge + 9, m + 17 + V * 15)), m += Z + 10;
  }
  if (t.note) {
    e.font = `10px ${Se}`, e.fillStyle = o.dim;
    const D = cn(e, t.note, g);
    D.forEach((Z, q) => e.fillText(Z, ge, m + 10 + q * 14)), m += D.length * 14 + 10;
  }
  if (t.items.length) {
    let q = ge;
    for (const V of t.items) {
      const J = V.side === "left" ? o.left : V.side === "right" ? o.right : o.neutral, $ = V.side === "left" ? t.sideLetters[0] : V.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${Se}`;
      const _ = e.measureText(V.label).width;
      e.font = `700 8px ${Se}`;
      const te = $ ? e.measureText($).width + 6 : 0;
      e.font = `10px ${Se}`;
      const le = V.value ? e.measureText(V.value).width : 0, ee = 7 + _ + ($ ? 4 + te : 0) + (V.value ? 4 + le : 0) + 7;
      q + ee > a - ge && q > ge && (q = ge, m += 23), kt(e, q, m, ee, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = J, e.fillRect(q, m + 1, 2, 16);
      let j = q + 7;
      e.font = `700 10px ${Se}`, e.fillStyle = o.text, e.fillText(V.label, j, m + 12.5), j += _ + 4, $ && (e.font = `700 8px ${Se}`, e.fillStyle = J, e.fillText($, j + 3, m + 12), j += te + 4), V.value && (e.font = `10px ${Se}`, e.fillStyle = V.tone === "up" ? o.right : V.tone === "down" ? o.left : o.dim, e.fillText(V.value, j, m + 12.5)), q += ee + 5;
    }
    m += 18;
  } else if (t.emptyText) {
    e.font = `10px ${Se}`, e.fillStyle = o.dim;
    const D = cn(e, t.emptyText, g);
    D.forEach((Z, q) => e.fillText(Z, ge, m + 10 + q * 14)), m += D.length * 14;
  }
  return m + ge;
}
const Xa = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ua = /* @__PURE__ */ Je({
  __name: "CathodeGauge",
  props: {
    theme: { default: "none" },
    curvature: { default: 10 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    magnify: { type: Boolean, default: !1 },
    value: {},
    min: { default: -1 },
    max: { default: 1 },
    readout: {},
    stance: {},
    sub: {},
    leftLabel: { default: "−" },
    rightLabel: { default: "+" },
    sideLetters: { default: () => ["−", "+"] },
    marks: { default: () => [] },
    meter: { default: null },
    caption: {},
    note: {},
    items: { default: () => [] },
    emptyText: {},
    colors: {},
    animate: { type: Boolean, default: !0 }
  },
  setup(n) {
    const t = n, e = z(null), l = z(null), a = () => (t.min + t.max) / 2, s = z(t.animate ? a() : t.value);
    let o = 0;
    function d() {
      if (cancelAnimationFrame(o), !t.animate) {
        s.value = t.value, U();
        return;
      }
      const j = () => {
        const i = t.value - s.value;
        if (Math.abs(i) < 4e-3) {
          s.value = t.value, U();
          return;
        }
        s.value += i * 0.18, U(), o = requestAnimationFrame(j);
      };
      o = requestAnimationFrame(j);
    }
    Q(() => t.value, d);
    let c = null, f = !1;
    function u() {
      if (c) {
        try {
          c.forceContextLoss();
        } catch {
        }
        try {
          c.dispose();
        } catch {
        }
        c = null;
      }
    }
    let g, m, b, k, C, v = 1, h = 0, R = 0;
    const E = { x: ve.x, y: ve.y }, P = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${It}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float as   = abs(uStrength);
    float dist = dot(cc, cc) * as;
    vec2  m    = cc + cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      float cd = 0.5 * as;
      float cp = 0.5 * (1.0 + cd) * cd;
      m /= (1.0 - 2.0 * cp);
    }
    return vec2(0.5) + m;
  }

  ${Et}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    vec4 color = texture2D(uTex, uv);
    if (uScanlines > 0.5 && mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }
    ${Dt}
    gl_FragColor = color;
  }
`;
    function M() {
      if (!(!l.value || !e.value)) {
        C = document.createElement("canvas");
        try {
          c = new Y.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !c.getContext() && (c.dispose(), c = null, f = !0), f) {
          y();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), g = new Y.Scene(), m = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), k = new Y.CanvasTexture(C), k.minFilter = Y.LinearFilter, k.magFilter = Y.LinearFilter, b = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: k },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ft()
          },
          vertexShader: Xa,
          fragmentShader: P,
          transparent: !0
        }), g.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), b)), y();
      }
    }
    function y() {
      if (!e.value || !C || !c && !f) return;
      const j = e.value.clientWidth, i = e.value.clientHeight;
      if (!j || !i) return;
      const w = Math.min(window.devicePixelRatio || 1, 2), B = Math.round(j * w), T = Math.round(i * w);
      C.width === B && C.height === T && v === w || (v = w, h = j, R = i, C.width = B, C.height = T, c ? (k && (k.dispose(), k = new Y.CanvasTexture(C), k.minFilter = Y.LinearFilter, k.magFilter = Y.LinearFilter, b && (b.uniforms.uTex.value = k)), c.setPixelRatio(v), c.setSize(j, i)) : l.value && (l.value.width = B, l.value.height = T, l.value.style.width = j + "px", l.value.style.height = i + "px"), U());
    }
    function I(j) {
      Na(C, {
        dpr: v,
        theme: t.theme,
        colors: t.colors,
        glow: j,
        shown: s.value,
        value: t.value,
        min: t.min,
        max: t.max,
        readout: t.readout,
        stance: t.stance,
        sub: t.sub,
        leftLabel: t.leftLabel,
        rightLabel: t.rightLabel,
        sideLetters: t.sideLetters,
        marks: t.marks,
        meter: t.meter,
        caption: t.caption,
        note: t.note,
        items: t.items,
        emptyText: t.emptyText
      });
    }
    function U() {
      if (!(C != null && C.width)) return;
      if (f) {
        if (!l.value) return;
        I(!1);
        const i = l.value.getContext("2d");
        i && (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, l.value.width, l.value.height), i.drawImage(C, 0, 0));
        return;
      }
      if (!c || !b || !k) return;
      const j = t.theme === "paper";
      b.uniforms.uStrength.value = je(t.curvature), b.uniforms.uScanlines.value = t.scanlines && !j ? 1 : 0, b.uniforms.uVignette.value = j ? 0 : 1, At(b, t.magnify, E, h || C.width, R || C.height), I(t.glow), k.needsUpdate = !0, c.render(g, m);
    }
    Q(
      () => [
        t.theme,
        t.curvature,
        t.scanlines,
        t.glow,
        t.readout,
        t.stance,
        t.sub,
        t.leftLabel,
        t.rightLabel,
        t.sideLetters,
        t.marks,
        t.meter,
        t.caption,
        t.note,
        t.items,
        t.emptyText,
        t.colors,
        t.min,
        t.max
      ],
      () => U(),
      { deep: !0 }
    ), Q(() => t.magnify, (j) => {
      j || (E.x = ve.x, E.y = ve.y), U();
    });
    function D(j) {
      if (!t.magnify || !l.value) return;
      const i = _t(j, l.value);
      E.x = i.x, E.y = i.y, U();
    }
    function Z() {
      E.x = ve.x, E.y = ve.y, U();
    }
    let q = null, V = null, J = 0;
    const $ = Rt("cathodeResetTick", z(0));
    Q($, () => _());
    function _() {
      cancelAnimationFrame(J), J = requestAnimationFrame(y);
    }
    function te(j) {
      j.preventDefault();
    }
    function le() {
      c == null || c.dispose(), c = null, f = !1, M();
    }
    Ue(() => {
      _e(() => {
        var j;
        M(), l.value && (l.value.addEventListener("webglcontextlost", te), l.value.addEventListener("webglcontextrestored", le)), e.value && (q = new ResizeObserver(() => y()), q.observe(e.value), V = new IntersectionObserver((i) => {
          i.some((w) => w.isIntersecting) && _();
        }), V.observe(e.value)), window.addEventListener("resize", _), (j = window.visualViewport) == null || j.addEventListener("resize", _), d();
      });
    }), Qe(() => {
      var j, i, w;
      cancelAnimationFrame(o), cancelAnimationFrame(J), (j = l.value) == null || j.removeEventListener("webglcontextlost", te), (i = l.value) == null || i.removeEventListener("webglcontextrestored", le), q == null || q.disconnect(), V == null || V.disconnect(), window.removeEventListener("resize", _), (w = window.visualViewport) == null || w.removeEventListener("resize", _), u(), k == null || k.dispose(), b == null || b.dispose();
    });
    const ee = se(() => ({
      background: (Kt[t.theme] ?? Kt.none).bg
    }));
    return (j, i) => (Me(), Te("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: Ke(ee.value)
    }, [
      ue("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-gauge-canvas",
        onMousemove: D,
        onMouseleave: Z
      }, null, 544)
    ], 4));
  }
}), no = /* @__PURE__ */ et(Ua, [["__scopeId", "data-v-f8c2302b"]]);
export {
  xt as CANDLE_THEME_COLORS,
  ja as CathodeCandle,
  Za as CathodeCandleGrid,
  eo as CathodeContainer,
  no as CathodeGauge,
  Ka as CathodeGrid,
  to as CathodeLoader,
  Nl as CathodeLog,
  qa as CathodeTerminal,
  Qa as CathodeWorkspace,
  Kt as GAUGE_THEME_COLORS,
  Xt as LOG_THEME_COLORS,
  Ja as buildDefaultLayout,
  jn as useCathodeLayout
};
