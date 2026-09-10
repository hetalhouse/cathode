import { defineComponent as Qe, ref as Y, reactive as qt, watch as K, nextTick as _e, computed as le, inject as Ht, onMounted as Ne, onUnmounted as et, openBlock as ye, createElementBlock as xe, normalizeStyle as Ke, createElementVNode as ve, withModifiers as at, withKeys as Tn, createCommentVNode as Oe, toDisplayString as ze, createVNode as An, withDirectives as _n, vModelText as ll, provide as Cn, renderSlot as on, Transition as ol, withCtx as al, Fragment as rl, renderList as il, createTextVNode as sl, normalizeClass as cl, vShow as ul } from "vue";
import * as z from "three";
const Ge = {
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
}, we = 30, an = 12, fl = 10, At = 14, Bn = 5;
function _t() {
  return `${an}px system-ui, -apple-system, sans-serif`;
}
function Wn(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const r = [];
  let s = "";
  for (const h of a) {
    const d = s ? s + " " + h : h;
    !s || t.measureText(d).width <= e ? s = d : (r.push(s), s = h);
  }
  return s && r.push(s), r.length ? r : [""];
}
function dl(t, n) {
  return Math.max(n, t * At + Bn * 2);
}
function un(t, n) {
  const e = new Array(n + 1);
  e[0] = 0;
  for (let l = 0; l < n; l++) e[l + 1] = e[l] + (t[l] ?? 0);
  return e;
}
function Bt(t, n) {
  if (n <= 0) return 0;
  let e = 0, l = t.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    t[a] <= n ? e = a : l = a - 1;
  }
  return e;
}
const Yn = 28;
function vl(t, n) {
  if (typeof n == "function") return n(t);
  const e = t.filter((a) => a != null && a !== "");
  if (n === "count") return e.length;
  const l = e.map((a) => Number(a)).filter((a) => !Number.isNaN(a));
  if (l.length === 0) return null;
  switch (n) {
    case "sum":
      return l.reduce((a, r) => a + r, 0);
    case "avg":
      return l.reduce((a, r) => a + r, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function kn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ge[n.theme] ?? Ge.none, { cols: s, rows: h, pinnedRows: d, rowHeight: c, scrollY: u, scrollX: m, glow: g } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const k = d.length * c, S = n.aggregateRow ? Yn : 0, E = a - we - k - S;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, we), e.textBaseline = "middle", e.textAlign = "left";
  let i = -m;
  for (let p = 0; p < s.length; p++) {
    const v = s[p];
    if (i + v.width <= 0) {
      i += v.width;
      continue;
    }
    if (i >= l) break;
    const C = !!n.colFilters[v.colId], L = n.sortColId === v.colId, B = (v.colDef.headerName ?? v.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(i, 0, v.width, we), e.clip(), e.font = `bold ${fl}px system-ui, -apple-system, sans-serif`, e.fillStyle = C ? r.accent : r.textHeader, g ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(B, i + 8, we / 2), e.shadowBlur = 4, e.fillText(B, i + 8, we / 2), e.shadowBlur = 0) : e.fillText(B, i + 8, we / 2), L) {
      const W = e.measureText(B).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", i + 8 + W + 4, we / 2);
    }
    v.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = C ? r.accent : r.textHeader, e.globalAlpha = C ? 1 : 0.38, e.fillText("⌕", i + v.width - 20, we / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(i + v.width - 0.5, 0), e.lineTo(i + v.width - 0.5, we), e.stroke(), i += v.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, we - 0.5), e.lineTo(l, we - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, we, l, E), e.clip();
  const w = n.rowHeights && n.rowHeights.length === h.length ? n.rowHeights : null, T = w ? un(w, h.length) : null, D = (p) => T ? T[p] : p * c, X = (p) => w ? w[p] : c, M = T ? Bt(T, u) : Math.max(0, Math.floor(u / c));
  let y;
  if (T)
    for (y = M; y < h.length && D(y) < u + E; ) y++;
  else
    y = Math.min(h.length, Math.ceil((u + E) / c));
  const I = n.selectionAnchorRow ?? n.selectedRow, U = n.selectionAnchorCol ?? n.selectedCol, j = n.selectedRow >= 0 && I >= 0 ? Math.min(n.selectedRow, I) : -1, te = n.selectedRow >= 0 && I >= 0 ? Math.max(n.selectedRow, I) : -1, q = n.selectedCol >= 0 && U >= 0 ? Math.min(n.selectedCol, U) : -1, ee = n.selectedCol >= 0 && U >= 0 ? Math.max(n.selectedCol, U) : -1, Z = te > j || ee > q;
  let V = Number.POSITIVE_INFINITY, N = Number.NEGATIVE_INFINITY, ue = Number.POSITIVE_INFINITY, re = Number.NEGATIVE_INFINITY;
  const oe = (p, v, C, L) => {
    g ? (e.shadowColor = L, e.shadowBlur = 12, e.fillText(p, v, C), e.shadowBlur = 6, e.fillText(p, v, C), e.shadowBlur = 2, e.fillText(p, v, C), e.shadowBlur = 0) : e.fillText(p, v, C);
  };
  for (let p = M; p < y; p++) {
    const v = h[p], C = X(p), L = we + D(p) - u;
    p % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, L, l, C));
    const B = p >= j && p <= te;
    p === n.hoveredRow && !B && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, L, l, C)), B && !Z && (e.fillStyle = Zt(r.accent, 0.1), e.fillRect(0, L, l, C)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, L + C - 0.5), e.lineTo(l, L + C - 0.5), e.stroke();
    let W = -m;
    for (let $ = 0; $ < s.length; $++) {
      const O = s[$];
      if (W + O.width <= 0) {
        W += O.width;
        continue;
      }
      if (W >= l) break;
      const he = B && $ >= q && $ <= ee;
      he && Z && (e.fillStyle = Zt(r.accent, 0.14), e.fillRect(W, L, O.width, C)), he && (W < V && (V = W), W + O.width > N && (N = W + O.width), L < ue && (ue = L), L + C > re && (re = L + C));
      const ie = n.getCellStyle(O, v), me = ie.color ?? r.text, ke = ie.textAlign ?? "left", ae = n.formatCell(O, v);
      if (e.save(), e.beginPath(), e.rect(W + 1, L, O.width - 2, C), e.clip(), e.font = _t(), e.fillStyle = me, e.textBaseline = "middle", O.colDef.wrap) {
        e.textAlign = "left";
        const A = Wn(e, ae, Math.max(20, O.width - 16));
        let G = L + Bn + At / 2;
        for (const se of A) {
          if (G - At / 2 >= L + C) break;
          oe(se, W + 8, G, me), G += At;
        }
      } else {
        const A = ke === "right" ? W + O.width - 8 : W + 8;
        e.textAlign = ke === "right" ? "right" : "left", oe(ae, A, L + C / 2, me);
      }
      e.restore(), p === n.selectedRow && $ === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(W + 1.5, L + 1.5, O.width - 3, C - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(W + O.width - 0.5, L), e.lineTo(W + O.width - 0.5, L + C), e.stroke(), W += O.width;
    }
  }
  if (Z && V < N && ue < re && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(V + 0.5, ue + 0.5, N - V - 1, re - ue - 1)), e.restore(), d.length > 0) {
    const p = a - k - S;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(l, p - 0.5), e.stroke();
    for (let v = 0; v < d.length; v++) {
      const C = d[v], L = p + v * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, L, l, c);
      let B = -m;
      for (let W = 0; W < s.length; W++) {
        const $ = s[W];
        if (B + $.width <= 0) {
          B += $.width;
          continue;
        }
        if (B >= l) break;
        const O = n.getCellStyle($, C), he = O.color ?? r.text, ie = O.textAlign ?? "left", me = n.formatCell($, C);
        e.save(), e.beginPath(), e.rect(B + 1, L, $.width - 2, c), e.clip(), e.font = `bold ${an}px system-ui, -apple-system, sans-serif`, e.fillStyle = he, e.textBaseline = "middle", ie === "right" ? (e.textAlign = "right", e.fillText(me, B + $.width - 8, L + c / 2)) : (e.textAlign = "left", e.fillText(me, B + 8, L + c / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(B + $.width - 0.5, L), e.lineTo(B + $.width - 0.5, L + c), e.stroke(), B += $.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, L + c - 0.5), e.lineTo(l, L + c - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const p = a - S;
    e.fillStyle = Zt(r.accent, 0.1), e.fillRect(0, p, l, S), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(l, p - 0.5), e.stroke();
    let v = -m;
    for (let C = 0; C < s.length; C++) {
      const L = s[C];
      if (v + L.width <= 0) {
        v += L.width;
        continue;
      }
      if (v >= l) break;
      const W = n.getCellStyle(L, n.aggregateRow).textAlign ?? "left", $ = n.aggregateRow[L.colId] ?? "";
      e.save(), e.beginPath(), e.rect(v + 1, p, L.width - 2, S), e.clip(), e.font = `bold ${an}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", g && (e.shadowColor = r.accent, e.shadowBlur = 8), W === "right" ? (e.textAlign = "right", e.fillText($, v + L.width - 8, p + S / 2)) : (e.textAlign = "left", e.fillText($, v + 8, p + S / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(v + L.width - 0.5, p), e.lineTo(v + L.width - 0.5, p + S), e.stroke(), v += L.width;
    }
  }
  e.restore();
}
function Zt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
const Et = 190, Jt = 34;
function hl(t, n, e) {
  const l = Math.max(4, Math.min(n, t - Et - 4)), a = we + 6, r = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: Et, h: Jt },
    input: { x: l + 9, y: a + 5, w: Et - 18 - r, h: Jt - 10 },
    clear: e ? { x: l + Et - 28, y: a, w: 28, h: Jt } : null
  };
}
const Qt = (t, n, e, l = 0) => t >= e.x - l && t <= e.x + e.w + l && n >= e.y && n <= e.y + e.h;
function Dt(t, n, e, l = 1) {
  return e.clear && Qt(t, n, e.clear, 4 * (l - 1)) ? "clear" : Qt(t, n, e.input) ? "input" : Qt(t, n, e.box) ? "inside" : "outside";
}
function ml(t, n, e, l, a) {
  const { box: r, input: s, clear: h } = n;
  t.save(), t.fillStyle = "rgba(8,12,22,0.94)", t.strokeStyle = a.accent, t.lineWidth = 1, t.beginPath(), t.roundRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1, 4), t.fill(), t.stroke(), t.fillStyle = "rgba(255,255,255,0.05)", t.beginPath(), t.roundRect(s.x, s.y, s.w, s.h, 3), t.fill(), t.beginPath(), t.rect(s.x, s.y, s.w, s.h), t.clip(), t.font = _t(), t.textBaseline = "middle";
  const d = s.y + s.h / 2 + 1, c = 5;
  if (e) {
    t.fillStyle = a.text;
    const u = t.measureText(e).width, m = u > s.w - 2 * c - 2 ? s.x + s.w - c - 2 - u : s.x + c;
    t.fillText(e, m, d), l && (t.fillStyle = a.accent, t.fillRect(Math.min(m + u + 1, s.x + s.w - c), s.y + 4, 1.5, s.h - 8));
  } else
    t.fillStyle = a.textHeader, t.fillText("Filter…", s.x + c, d), l && (t.fillStyle = a.accent, t.fillRect(s.x + c, s.y + 4, 1.5, s.h - 8));
  t.restore(), h && (t.save(), t.font = _t(), t.textBaseline = "middle", t.textAlign = "center", t.fillStyle = a.textHeader, t.fillText("✕", h.x + h.w / 2, h.y + h.h / 2 + 1), t.restore());
}
function gl(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = Math.abs(e), s = (l * l + a * a) * r;
  if (e < 0) {
    const c = 0.5 * r, m = 1 / (1 - 2 * (0.5 * (1 + c) * c)), g = (l + l * (1 + s) * s * -1) * m, k = (a + a * (1 + s) * s * -1) * m;
    return [0.5 + g, 0.5 + k];
  }
  const h = l * (1 + s) * s, d = a * (1 + s) * s;
  return [t + h, n + d * 0.15];
}
function Pn(t, n, e, l, a, r = e, s = l) {
  const h = t / e, d = 1 - n / l, [c, u] = gl(h, d, a);
  return c < 0 || c > 1 || u < 0 || u > 1 ? [-1, -1] : [c * r, (1 - u) * s];
}
function en(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function pl(t, n, e, l = 1) {
  return t >= n + e - 24 * l && t < n + e;
}
function In(t, n, e, l = 1) {
  const a = n + e;
  return t >= a - 6 * l && t <= a + 1 * l;
}
function Ln(t, n, e, l, a, r, s, h, d, c = !1, u) {
  const m = t + d;
  let g = -1, k = 0;
  for (let T = 0; T < e.length; T++) {
    if (m >= k && m < k + e[T].width) {
      g = T;
      break;
    }
    k += e[T].width;
  }
  if (n < we) return { area: "header", colIdx: g, rowIdx: -1 };
  const S = c ? Yn : 0;
  if (S > 0 && n >= s - S)
    return { area: "agg", colIdx: g, rowIdx: -1 };
  const E = h * a;
  if (E > 0 && n >= s - E - S) {
    const T = Math.floor((n - (s - E - S)) / a);
    return { area: "pinned", colIdx: g, rowIdx: T };
  }
  const i = n - we + r, w = u && u.length === l ? Bt(un(u, l), i) : Math.floor(i / a);
  return w >= 0 && w < l ? { area: "body", colIdx: g, rowIdx: w } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function Ze(t) {
  return t / 45 * 0.55;
}
function Hn(t) {
  const n = Math.abs(Ze(t));
  if (n === 0) return 1;
  if (t < 0) {
    const l = 0.5 * n;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * n;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const wl = 500, yl = wl / 2, xl = 1.6, zt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Vt = `
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
`, $t = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Ot() {
  return {
    uMouseUV: { value: new z.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: xl },
    uLensTint: { value: new z.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const be = { x: -999, y: -999 };
function Nt(t, n, e, l, a) {
  const r = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = r && a > 0 ? yl / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function Xt(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const bl = ["value"], Ml = ["disabled"], Sl = ["disabled"], Tl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Cl = 28, kl = 600, Il = /* @__PURE__ */ Qe({
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
  setup(t, { emit: n }) {
    const e = t, l = n, a = Y(e.rowData ?? []), r = Y(e.pinnedBottomRowData ?? []), s = Y(""), h = Y(null), d = qt({}), c = qt({}), u = qt(/* @__PURE__ */ new Set()), m = Y(0), g = Y(0), k = Y(0), S = Y(0), E = Y(0), i = Y(0), w = Y(0), T = Y(-1), D = Y(null), X = Y(null), M = Y(null), y = { ...be }, I = Y(""), U = Y(0), j = Y(null);
    let te = null;
    const q = Y(!0);
    let ee = null;
    K(M, (o) => {
      var f;
      ee && (clearInterval(ee), ee = null), o ? (q.value = !0, ee = setInterval(() => {
        q.value = !q.value, pe();
      }, 530), _e(() => {
        var x;
        return (x = j.value) == null ? void 0 : x.focus();
      })) : (te = null, (f = j.value) == null || f.blur()), pe();
    });
    function Z(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const V = le(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((f) => !u.has(Z(f))).map((f) => {
        const x = Z(f), F = { ...o, ...f };
        return { colId: x, colDef: F, width: c[x] ?? F.width ?? 100 };
      });
    }), N = le(() => {
      const o = g.value;
      if (!o) return V.value;
      const f = V.value.reduce((R, _) => R + _.width, 0);
      if (!f || f >= o) return V.value;
      const x = o / f;
      let F = 0;
      return V.value.map((R, _) => {
        const de = _ === V.value.length - 1 ? o - F : Math.max(8, Math.round(R.width * x));
        return F += de, { ...R, width: de };
      });
    }), ue = le(() => {
      const o = N.value.reduce((f, x) => f + x.width, 0);
      return Math.max(0, o - g.value);
    });
    let re = null;
    function oe() {
      if (typeof document > "u") return null;
      re || (re = document.createElement("canvas"));
      const o = re.getContext("2d");
      return o && (o.font = _t()), o;
    }
    const p = le(() => N.value.some((o) => o.colDef.wrap)), v = le(() => {
      if (!p.value) return null;
      const o = oe();
      if (!o) return null;
      const f = N.value.filter((F) => F.colDef.wrap), x = e.rowHeight;
      return ae.value.map((F) => {
        let R = 1;
        for (const _ of f) {
          const H = Wn(o, me(_, F), Math.max(20, _.width - 16));
          H.length > R && (R = H.length);
        }
        return dl(R, x);
      });
    }), C = le(
      () => v.value ? un(v.value, ae.value.length) : null
    ), L = le(
      () => C.value ? C.value[ae.value.length] : ae.value.length * e.rowHeight
    ), B = le(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, k.value - we - o);
    }), W = le(
      () => Math.max(0, L.value - B.value)
    ), $ = le(
      () => Math.max(1, Math.floor(B.value / e.rowHeight))
    ), O = le(() => {
      const o = ae.value.length;
      if (o === 0) return 0;
      const f = C.value ? Bt(C.value, i.value) : Math.floor(i.value / e.rowHeight);
      return Math.min(o - 1, f);
    }), he = le(() => {
      const o = ae.value.length;
      return o === 0 ? 0 : C.value ? Math.min(o - 1, Bt(C.value, i.value + B.value - 1)) : Math.min(o - 1, O.value + $.value - 1);
    });
    function ie(o, f) {
      if (f.colDef.valueGetter) return f.colDef.valueGetter({ data: o, colDef: f.colDef });
      if (f.colDef.field) return o[f.colDef.field];
    }
    function me(o, f) {
      const x = ie(f, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: f, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: f, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function ke(o, f) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: ie(f, o), data: f, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const ae = le(() => {
      m.value;
      let o = a.value;
      const f = s.value.trim().toLowerCase();
      f && (o = o.filter(
        (x) => V.value.some(
          (F) => String(ie(x, F) ?? "").toLowerCase().includes(f)
        )
      ));
      for (const [x, F] of Object.entries(d)) {
        if (!F) continue;
        const R = V.value.find((_) => _.colId === x);
        if (R)
          if (F.startsWith("__eq__")) {
            const _ = F.slice(6).toLowerCase();
            o = o.filter((H) => String(ie(H, R) ?? "").toLowerCase() === _);
          } else {
            const _ = F.toLowerCase();
            o = o.filter((H) => String(ie(H, R) ?? "").toLowerCase().includes(_));
          }
      }
      if (h.value) {
        const { colId: x, dir: F } = h.value, R = V.value.find((_) => _.colId === x);
        R && (o = [...o].sort((_, H) => {
          const de = ie(_, R), ne = ie(H, R);
          let ge = 0;
          return R.colDef.comparator ? ge = R.colDef.comparator(de, ne) : typeof de == "number" && typeof ne == "number" ? ge = de - ne : ge = String(de ?? "").localeCompare(String(ne ?? ""), void 0, { numeric: !0 }), F === "asc" ? ge : -ge;
        }));
      }
      return o;
    }), A = le(() => {
      const o = V.value.filter((R) => R.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const f = ae.value, x = {};
      for (const R of o) {
        const _ = f.map((de) => ie(de, R)), H = vl(_, R.colDef.aggFunc);
        if (H == null) {
          x[R.colId] = "";
          continue;
        }
        x[R.colId] = R.colDef.aggValueFormatter ? R.colDef.aggValueFormatter(H) : String(H);
      }
      const F = o[0].colId;
      return x[F] === "" && (x[F] = "Σ"), x;
    });
    K(ae, () => {
      i.value = 0, D.value = null;
    }), K(ue, () => {
      w.value = Math.min(w.value, ue.value);
    }), K(W, () => {
      i.value = Math.min(i.value, W.value);
    });
    function G(o) {
      const f = C.value, x = f ? f[o] : o * e.rowHeight, F = f ? f[o + 1] : x + e.rowHeight;
      x < i.value ? i.value = x : F > i.value + B.value && (i.value = Math.min(W.value, F - B.value));
    }
    function se() {
      i.value = Math.max(0, i.value - B.value), pe();
    }
    function Ie() {
      i.value = Math.min(W.value, i.value + B.value), pe();
    }
    let Te = !1, Pe = "", st = 0, ct = 0, nt = 1, Re = !1, Ee = !1, De = 0, Fe = 0, Ue = 0, ut = 0, Le = !1;
    function It(o, f, x = 1) {
      var F;
      Te = !0, Pe = o, st = f, nt = x, ct = ((F = N.value.find((R) => R.colId === o)) == null ? void 0 : F.width) ?? 100, Re = !1;
    }
    function pt(o) {
      if (Ee) {
        const _ = De - o.clientX, H = Fe - o.clientY;
        (Math.abs(_) > 4 || Math.abs(H) > 4) && (Le = !0), w.value = Math.max(0, Math.min(ue.value, Ue + _)), i.value = Math.max(0, Math.min(W.value, ut + H)), pe();
        return;
      }
      if (!Te) return;
      const f = g.value, x = Math.max(30, ct + (o.clientX - st) * nt), F = V.value.filter((_) => _.colId !== Pe).reduce((_, H) => _ + H.width, 0), R = f - x;
      R > 10 && (c[Pe] = Math.max(10, Math.round(x * F / R))), pe();
    }
    function Lt() {
      Ee && (Le && (Re = !0), Ee = !1), Te && (Te = !1, Re = !0, l("column-resized"));
    }
    function Ut(o) {
      if (o.touches.length !== 1) return;
      const f = o.touches[0];
      Ee = !0, Le = !1, De = f.clientX, Fe = f.clientY, Ue = w.value, ut = i.value;
    }
    function b(o) {
      if (!Ee || o.touches.length !== 1) return;
      o.preventDefault();
      const f = o.touches[0], x = De - f.clientX, F = Fe - f.clientY;
      (Math.abs(x) > 4 || Math.abs(F) > 4) && (Le = !0), w.value = Math.max(0, Math.min(ue.value, Ue + x)), i.value = Math.max(0, Math.min(W.value, ut + F)), pe();
    }
    function P() {
      Ee && (Le && (Re = !0), Ee = !1);
    }
    const J = Y(null), Q = Y(null), Ve = Ht("cathodeResetTick", Y(0));
    K(Ve, () => vt());
    let ce = null, Ce = !1;
    function ft() {
      if (ce) {
        try {
          ce.forceContextLoss();
        } catch {
        }
        try {
          ce.dispose();
        } catch {
        }
        ce = null;
      }
    }
    let $e, gn, He, Ae, fe;
    const Nn = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${zt}

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

  ${Vt}

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

    ${$t}

    gl_FragColor = color;
  }
`;
    function pn() {
      if (!(!Q.value || !J.value)) {
        fe = document.createElement("canvas");
        try {
          ce = new z.WebGLRenderer({ canvas: Q.value, antialias: !1, alpha: !0 });
        } catch {
          Ce = !0;
        }
        if (!Ce && !ce.getContext() && (ce.dispose(), ce = null, Ce = !0), Ce) {
          dt();
          return;
        }
        ce.setPixelRatio(1), ce.setClearColor(0, 0), $e = new z.Scene(), gn = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), Ae = new z.CanvasTexture(fe), Ae.minFilter = z.LinearFilter, Ae.magFilter = z.LinearFilter, He = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: Ae },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new z.Color(0) },
            ...Ot()
          },
          vertexShader: Tl,
          fragmentShader: Nn,
          transparent: !0
        }), $e.add(new z.Mesh(new z.PlaneGeometry(2, 2), He)), dt();
      }
    }
    function dt() {
      if (!J.value || !ce && !Ce) return;
      const o = J.value.clientWidth, f = J.value.clientHeight - (e.pagination ? Cl : 0);
      if (!o || !f) return;
      S.value = o, E.value = f;
      const x = e.bendField ? Math.round(o * Hn(e.curvature)) : o, F = fe.width !== x || fe.height !== f;
      fe.width = x, fe.height = f, g.value = x, k.value = f, w.value = Math.max(0, Math.min(ue.value, w.value)), i.value = Math.max(0, Math.min(W.value, i.value)), ce ? (F && Ae && (Ae.dispose(), Ae = new z.CanvasTexture(fe), Ae.minFilter = z.LinearFilter, Ae.magFilter = z.LinearFilter, He && (He.uniforms.uTex.value = Ae)), ce.setPixelRatio(window.devicePixelRatio || 1), ce.setSize(o, f)) : Q.value && (Q.value.width = o, Q.value.height = f, Q.value.style.width = o + "px", Q.value.style.height = f + "px"), pe();
    }
    function pe() {
      var x, F, R, _, H, de, ne, ge, Be, bt, Mt, ht;
      if (!(fe != null && fe.width)) return;
      if (Ce) {
        if (!Q.value) return;
        kn(fe, {
          cols: N.value,
          rows: ae.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: v.value ?? void 0,
          scrollY: i.value,
          scrollX: w.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = h.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((F = h.value) == null ? void 0 : F.dir) ?? null,
          colFilters: d,
          hoveredRow: T.value,
          selectedRow: ((R = D.value) == null ? void 0 : R.row) ?? -1,
          selectedCol: ((_ = D.value) == null ? void 0 : _.col) ?? -1,
          selectionAnchorRow: ((H = X.value) == null ? void 0 : H.row) ?? -1,
          selectionAnchorCol: ((de = X.value) == null ? void 0 : de.col) ?? -1,
          formatCell: me,
          getCellStyle: ke
        }), wn();
        const St = Q.value.getContext("2d");
        St && St.drawImage(fe, 0, 0, fe.width, fe.height, 0, 0, Q.value.width, Q.value.height);
        return;
      }
      if (!ce || !He || !Ae) return;
      const o = Ge[e.theme] ?? Ge.none, f = e.theme === "paper";
      He.uniforms.uStrength.value = Ze(e.curvature), He.uniforms.uScanlines.value = e.scanlines && !f ? 1 : 0, He.uniforms.uVignette.value = f ? 0 : 1, He.uniforms.uBezel.value.set(o.bg), Nt(He, e.magnify, y, S.value || fe.width, E.value || fe.height), kn(fe, {
        cols: N.value,
        rows: ae.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: v.value ?? void 0,
        scrollY: i.value,
        scrollX: w.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((ne = h.value) == null ? void 0 : ne.colId) ?? null,
        sortDir: ((ge = h.value) == null ? void 0 : ge.dir) ?? null,
        colFilters: d,
        hoveredRow: T.value,
        selectedRow: ((Be = D.value) == null ? void 0 : Be.row) ?? -1,
        selectedCol: ((bt = D.value) == null ? void 0 : bt.col) ?? -1,
        selectionAnchorRow: ((Mt = X.value) == null ? void 0 : Mt.row) ?? -1,
        selectionAnchorCol: ((ht = X.value) == null ? void 0 : ht.col) ?? -1,
        formatCell: me,
        getCellStyle: ke,
        aggregateRow: A.value
      }), wn(), Ae.needsUpdate = !0, ce.render($e, gn);
    }
    function wn() {
      if (!M.value || !(fe != null && fe.width)) return;
      const o = fe.getContext("2d");
      if (!o) return;
      te = hl(fe.width, U.value, !!I.value);
      const f = Ge[e.theme] ?? Ge.none;
      ml(o, te, I.value, q.value, f);
    }
    function Gt(o, f) {
      if (!Q.value) return [-1, -1];
      const x = Q.value.getBoundingClientRect(), F = o - x.left, R = f - x.top, _ = x.width, H = x.height, de = Ze(e.curvature), [ne, ge] = Pn(F, R, _, H, de, fe.width || _, fe.height || H);
      return ne < 0 ? [-1, -1] : [ne, ge];
    }
    function Rt(o) {
      return Gt(o.clientX, o.clientY);
    }
    function lt(o) {
      if (!Q.value) return 1;
      const [f] = Gt(o.clientX - 4, o.clientY), [x] = Gt(o.clientX + 4, o.clientY);
      return f < 0 || x < 0 ? 1 : Math.max(1, Math.abs(x - f) / 8);
    }
    let Kt = 0;
    function Xn(o) {
      M.value = null;
      const f = Date.now();
      if (o.deltaX !== 0) {
        Kt = f, w.value = Math.max(0, Math.min(ue.value, w.value + o.deltaX)), pe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Kt = f, w.value = Math.max(0, Math.min(ue.value, w.value + o.deltaY)), pe();
        return;
      }
      f - Kt < kl || (i.value = Math.max(0, Math.min(W.value, i.value + o.deltaY)), pe());
    }
    function Un(o) {
      if (Te) return;
      if (e.magnify && Q.value) {
        const R = Xt(o, Q.value);
        y.x = R.x, y.y = R.y;
      }
      const [f, x] = Rt(o);
      if (f < 0) {
        T.value = -1, pe();
        return;
      }
      if (M.value && te) {
        const R = Dt(f, x, te, lt(o));
        if (R !== "outside") {
          T.value = -1, Q.value.style.cursor = R === "clear" ? "pointer" : "text", pe();
          return;
        }
      }
      const F = Ln(
        f,
        x,
        N.value,
        ae.value.length,
        e.rowHeight,
        i.value,
        fe.height,
        r.value.length,
        w.value,
        A.value !== null,
        v.value ?? void 0
      );
      if (T.value = F.area === "body" ? F.rowIdx : -1, F.area === "header" && F.colIdx >= 0) {
        const R = N.value[F.colIdx], _ = en(F.colIdx, N.value), H = f + w.value;
        Q.value.style.cursor = R && In(H, _, R.width, lt(o)) ? "col-resize" : "pointer";
      } else F.area === "body" ? Q.value.style.cursor = "pointer" : Q.value.style.cursor = "default";
      pe();
    }
    function Gn() {
      T.value = -1, y.x = be.x, y.y = be.y, pe();
    }
    function Kn(o) {
      const [f, x] = Rt(o);
      if (f < 0 || M.value && te && Dt(f, x, te, lt(o)) !== "outside") return;
      if (x >= we) {
        Ee = !0, Le = !1, De = o.clientX, Fe = o.clientY, Ue = w.value, ut = i.value;
        return;
      }
      const F = f + w.value, R = lt(o);
      for (let _ = 0; _ < N.value.length; _++) {
        const H = N.value[_], de = en(_, N.value);
        if (H.colDef.resizable !== !1 && In(F, de, H.width, R)) {
          It(H.colId, o.clientX, R);
          return;
        }
      }
    }
    function jn(o) {
      var R, _, H, de;
      if (Re) {
        Re = !1;
        return;
      }
      if (Te) return;
      const [f, x] = Rt(o);
      if (f < 0) {
        M.value = null;
        return;
      }
      if (M.value && te) {
        const ne = Dt(f, x, te, lt(o));
        if (ne === "clear") {
          xn();
          return;
        }
        if (ne !== "outside") {
          (R = j.value) == null || R.focus();
          return;
        }
        M.value = null;
      }
      const F = Ln(
        f,
        x,
        N.value,
        ae.value.length,
        e.rowHeight,
        i.value,
        fe.height,
        r.value.length,
        w.value,
        A.value !== null,
        v.value ?? void 0
      );
      if (F.area === "header" && F.colIdx >= 0) {
        const ne = N.value[F.colIdx], ge = en(F.colIdx, N.value), Be = f + w.value;
        ne.colDef.filter && pl(Be, ge, ne.width, lt(o)) ? (o.stopPropagation(), M.value === ne.colId ? M.value = null : (M.value = ne.colId, I.value = (_ = d[ne.colId]) != null && _.startsWith("__eq__") ? d[ne.colId].slice(6) : d[ne.colId] ?? "", U.value = Math.max(0, ge - w.value))) : ne.colDef.sortable !== !1 && (M.value = null, h.value = ((H = h.value) == null ? void 0 : H.colId) === ne.colId ? h.value.dir === "asc" ? { colId: ne.colId, dir: "desc" } : null : { colId: ne.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (M.value = null, F.area === "body" && F.rowIdx >= 0 && F.colIdx >= 0) {
        const ne = F.rowIdx;
        o.shiftKey && D.value ? (X.value || (X.value = { ...D.value }), D.value = { row: ne, col: F.colIdx }) : (D.value = { row: ne, col: F.colIdx }, X.value = { row: ne, col: F.colIdx }), (de = Q.value) == null || de.focus();
        const ge = ae.value[ne], Be = N.value[F.colIdx];
        ge && Be && (l("row-clicked", { data: ge, event: o }), l("cell-selected", { data: ge, row: ne, col: F.colIdx, colId: Be.colId }));
      }
    }
    function yn(o) {
      if (M.value) {
        if (o.target === Q.value && te) {
          const [f, x] = Rt(o);
          if (f >= 0 && Dt(f, x, te, lt(o)) !== "outside") return;
        }
        M.value = null;
      }
    }
    function qn(o) {
      var R;
      if (!g.value) return;
      let f = 0;
      for (let _ = 0; _ < o; _++) f += N.value[_].width;
      const x = ((R = N.value[o]) == null ? void 0 : R.width) ?? 0, F = f - w.value;
      F < 0 ? w.value = Math.max(0, f) : F + x > g.value && (w.value = Math.min(ue.value, f + x - g.value));
    }
    function Zn(o) {
      const x = N.value.length - 1, F = ae.value.length - 1;
      if (!D.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), D.value = { row: O.value, col: 0 }, X.value = { row: O.value, col: 0 });
        return;
      }
      let { row: R, col: _ } = D.value;
      const H = (de, ne, ge = !1) => {
        R = Math.max(0, Math.min(F, de)), _ = Math.max(0, Math.min(x, ne)), D.value = { row: R, col: _ }, ge || (X.value = { row: R, col: _ }), G(R), qn(_);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), H(R + 1, _, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), H(R - 1, _, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? H(R, _ + 1, !0) : _ < x ? H(R, _ + 1) : H(R + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? H(R, _ - 1, !0) : _ > 0 ? H(R, _ - 1) : H(R - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? _ > 0 ? H(R, _ - 1) : H(R - 1, x) : _ < x ? H(R, _ + 1) : H(R + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? H(R - 1, _) : H(R + 1, _);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? H(0, 0, o.shiftKey) : H(R, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? H(F, x, o.shiftKey) : H(R, x, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), H(Math.min(F, R + $.value), _, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), H(Math.max(0, R - $.value), _, o.shiftKey);
          break;
        case "Escape":
          D.value = null, X.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), Jn());
          break;
      }
    }
    function Jn() {
      var ge;
      if (!D.value) return;
      const o = N.value, f = ae.value, x = X.value ?? D.value, F = Math.min(x.row, D.value.row), R = Math.max(x.row, D.value.row), _ = Math.min(x.col, D.value.col), H = Math.max(x.col, D.value.col), de = [];
      for (let Be = F; Be <= R; Be++) {
        const bt = f[Be];
        if (!bt) continue;
        const Mt = [];
        for (let ht = _; ht <= H; ht++) {
          const St = o[ht];
          St && Mt.push(me(St, bt).replace(/[\t\r\n]+/g, " "));
        }
        de.push(Mt.join("	"));
      }
      const ne = de.join(`
`);
      (ge = navigator.clipboard) == null || ge.writeText(ne).catch(() => {
      });
    }
    function Qn(o) {
      const f = o.target.value;
      I.value = f, f ? d[M.value] = f : delete d[M.value], l("filter-changed");
    }
    function xn() {
      M.value && delete d[M.value], I.value = "", M.value = null, l("filter-changed");
    }
    const el = {
      setGridOption(o, f) {
        o === "rowData" ? a.value = f : o === "pinnedBottomRowData" ? r.value = f : o === "quickFilterText" && (s.value = f);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, F;
          const f = Z(o);
          return {
            colId: f,
            hide: u.has(f),
            sort: ((x = h.value) == null ? void 0 : x.colId) === f ? h.value.dir : null,
            sortIndex: ((F = h.value) == null ? void 0 : F.colId) === f ? 0 : null,
            width: c[f] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const f of o)
          f.hide === !0 && u.add(f.colId), f.hide === !1 && u.delete(f.colId), f.sort && (h.value = { colId: f.colId, dir: f.sort }), f.width && (c[f.colId] = f.width);
      },
      setFilterModel(o) {
        for (const f of Object.keys(d)) delete d[f];
        if (o)
          for (const [f, x] of Object.entries(o))
            (x == null ? void 0 : x.type) === "equals" ? d[f] = `__eq__${x.filter}` : x != null && x.filter && (d[f] = x.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [f, x] of Object.entries(d))
          x && (o[f] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return o;
      },
      async setColumnFilterModel(o, f) {
        f ? f.type === "equals" ? d[o] = `__eq__${f.filter}` : d[o] = f.filter ?? "" : delete d[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        m.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const f = V.value, x = f.map((H) => H.colDef.headerName ?? H.colId).join(","), F = ae.value.map(
          (H) => f.map((de) => `"${String(me(de, H)).replace(/"/g, '""')}"`).join(",")
        ), R = new Blob([[x, ...F].join(`
`)], { type: "text/csv" }), _ = URL.createObjectURL(R);
        Object.assign(document.createElement("a"), { href: _, download: o }).click(), URL.revokeObjectURL(_);
      },
      resize() {
        dt();
      },
      resetColumnState() {
        u.clear();
        for (const f of e.columnDefs)
          f.hide && u.add(Z(f));
        const o = e.columnDefs.find((f) => f.sort);
        h.value = o ? { colId: Z(o), dir: o.sort } : null;
        for (const f of Object.keys(c)) delete c[f];
        for (const f of Object.keys(d)) delete d[f];
        s.value = "", i.value = 0, D.value = null, M.value = null;
      }
    };
    K(
      [ae, () => r.value, N, i, T, D],
      () => _e(pe)
    ), K(() => e.theme, () => pe()), K(() => [e.curvature, e.bendField], () => _e(dt)), K(() => e.scanlines, () => pe()), K(() => e.glow, () => pe()), K(() => e.magnify, (o) => {
      o || (y.x = be.x, y.y = be.y), pe();
    }), K(D, (o) => {
      if (!o) return;
      const f = ae.value[o.row], x = N.value[o.col];
      f && x && l("cell-selected", { data: f, row: o.row, col: o.col, colId: x.colId });
    });
    let wt = null, yt = null, jt = 0;
    function vt() {
      cancelAnimationFrame(jt), jt = requestAnimationFrame(dt);
    }
    function bn(o) {
      o.preventDefault();
    }
    function Mn() {
      ce == null || ce.dispose(), ce = null, Ce = !1, pn();
    }
    Ne(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(Z(o)), o.sort && !h.value && (h.value = { colId: Z(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", yn), document.addEventListener("mousemove", pt), document.addEventListener("mouseup", Lt), _e(() => {
        var o;
        pn(), Q.value && (Q.value.addEventListener("webglcontextlost", bn), Q.value.addEventListener("webglcontextrestored", Mn)), J.value && (wt = new ResizeObserver(() => dt()), wt.observe(J.value), yt = new IntersectionObserver((f) => {
          f.some((x) => x.isIntersecting) && vt();
        }), yt.observe(J.value)), window.addEventListener("resize", vt), (o = window.visualViewport) == null || o.addEventListener("resize", vt), l("grid-ready", { api: el });
      });
    }), et(() => {
      var o, f, x;
      document.removeEventListener("click", yn, !0), document.removeEventListener("mousemove", pt), document.removeEventListener("mouseup", Lt), (o = Q.value) == null || o.removeEventListener("webglcontextlost", bn), (f = Q.value) == null || f.removeEventListener("webglcontextrestored", Mn), wt == null || wt.disconnect(), yt == null || yt.disconnect(), window.removeEventListener("resize", vt), (x = window.visualViewport) == null || x.removeEventListener("resize", vt), cancelAnimationFrame(jt), ft();
    });
    const xt = le(() => Ge[e.theme] ?? Ge.none), tl = le(() => ({
      background: xt.value.headerBg,
      borderTop: `1px solid ${xt.value.border}`,
      color: xt.value.text
    })), nl = le(() => ({
      background: xt.value.bg
    })), Sn = le(() => xt.value.accent);
    return (o, f) => {
      var x, F;
      return ye(), xe("div", {
        ref_key: "wrapEl",
        ref: J,
        class: "cathode-wrap",
        style: Ke(nl.value)
      }, [
        ve("canvas", {
          ref_key: "canvasEl",
          ref: Q,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: at(Xn, ["prevent"]),
          onMousemove: Un,
          onMouseleave: Gn,
          onMousedown: Kn,
          onClick: jn,
          onKeydown: Zn,
          onTouchstartPassive: Ut,
          onTouchmove: b,
          onTouchend: P,
          onTouchcancel: P
        }, null, 544),
        M.value ? (ye(), xe("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: j,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: I.value,
          autofocus: "",
          onInput: Qn,
          onKeydown: [
            Tn(xn, ["escape"]),
            f[0] || (f[0] = Tn((R) => M.value = null, ["enter"]))
          ]
        }, null, 40, bl)) : Oe("", !0),
        t.pagination ? (ye(), xe("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ke(tl.value)
        }, [
          ve("button", {
            disabled: i.value <= 0,
            onClick: f[1] || (f[1] = (R) => se())
          }, "◀", 8, Ml),
          ve("span", null, ze((O.value + 1).toLocaleString()) + "–" + ze(Math.min(ae.value.length, he.value + 1).toLocaleString()) + " / " + ze(ae.value.length.toLocaleString()), 1),
          ve("button", {
            disabled: i.value >= W.value,
            onClick: f[2] || (f[2] = (R) => Ie())
          }, "▶", 8, Sl),
          ve("span", {
            class: "cathode-page-info",
            style: Ke({ color: Sn.value })
          }, ze(ae.value.length.toLocaleString()) + " rows ", 5),
          D.value ? (ye(), xe("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ke({ color: Sn.value })
          }, ze(((x = N.value[D.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((F = N.value[D.value.col]) == null ? void 0 : F.colId)) + " : " + ze(me(N.value[D.value.col], ae.value[D.value.row])), 5)) : Oe("", !0)
        ], 4)) : Oe("", !0)
      ], 4);
    };
  }
}), tt = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, Po = /* @__PURE__ */ tt(Il, [["__scopeId", "data-v-4918f754"]]), Wt = {
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
function Ll(t, n) {
  switch (n) {
    case "warn":
      return t.levelWarn;
    case "error":
      return t.levelError;
    case "debug":
      return t.levelDebug;
    case "success":
      return t.levelSuccess;
    case "info":
    default:
      return t.levelInfo;
  }
}
const Rl = 12, Me = 18, kt = 10, rt = 6, fn = `${Rl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function El(t, n, e) {
  if (e <= 0 || !n) return [n];
  const l = [];
  for (const a of n.split(`
`)) {
    if (!a) {
      l.push("");
      continue;
    }
    if (t.measureText(a).width <= e) {
      l.push(a);
      continue;
    }
    const r = a.split(/(\s+)/);
    let s = "";
    for (const h of r) {
      const d = s + h;
      if (t.measureText(d).width <= e)
        s = d;
      else if (s && (l.push(s.replace(/\s+$/, "")), s = ""), t.measureText(h).width > e) {
        let c = "";
        for (const u of h)
          t.measureText(c + u).width > e ? (c && l.push(c), c = u) : c += u;
        s = c;
      } else
        s = h.replace(/^\s+/, "");
    }
    s && l.push(s.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function zn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function Dl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function Fl(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, s = t.formatTs ?? zn;
  e.font = fn;
  const h = [];
  for (let d = 0; d < n.length; d++) {
    const c = n[d], u = c.level ?? "info", m = a && c.ts != null ? s(c.ts) : "", g = r ? El(e, c.text, l) : c.text.split(`
`);
    for (let k = 0; k < g.length; k++)
      h.push({
        entryIdx: d,
        text: g[k],
        level: u,
        timestamp: k === 0 ? m : "",
        isFirstFrag: k === 0,
        widthPx: e.measureText(g[k]).width
      });
  }
  return h;
}
function Rn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Wt[n.theme] ?? Wt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = fn, e.textBaseline = "middle";
  const s = n.visualLines, h = kt - n.scrollX, d = (n.showTimestamps ? kt + n.timestampWidth : kt) - n.scrollX, c = Math.max(0, Math.floor((n.scrollY - rt) / Me)), u = Math.min(s.length, Math.ceil((n.scrollY + a - rt) / Me) + 1);
  for (let m = c; m < u; m++) {
    const g = s[m], k = rt + m * Me - n.scrollY + Me / 2;
    if (g.entryIdx % 2 === 1 && g.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let E = 1;
      for (; m + E < u && s[m + E].entryIdx === g.entryIdx; ) E++;
      e.fillRect(0, k - Me / 2, l, Me * E);
    }
    n.selectionStart >= 0 && m >= n.selectionStart && m <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, k - Me / 2, l, Me)), m === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, k - Me / 2, l, Me)), n.showTimestamps && g.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(g.timestamp, h, k), e.shadowBlur = 0);
    const S = Ll(r, g.level);
    e.fillStyle = S, e.textAlign = "left", n.glow ? (e.shadowColor = S, e.shadowBlur = 14, e.fillText(g.text, d, k), e.shadowBlur = 7, e.fillText(g.text, d, k), e.shadowBlur = 3, e.fillText(g.text, d, k), e.shadowBlur = 0) : e.fillText(g.text, d, k);
  }
  e.restore();
}
function En(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - rt) / Me);
  return l < 0 || l >= e ? -1 : l;
}
function Al(t) {
  return rt * 2 + t * Me;
}
const _l = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Bl = /* @__PURE__ */ Qe({
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
  setup(t, { expose: n }) {
    const e = t, l = Y(null), a = Y(null), r = { ...be }, s = Y(0), h = Y(0), d = Y(0), c = Y(-1), u = Y(!0), m = Y(-1), g = Y(-1), k = le(() => {
      const b = e.entries ?? [];
      return e.maxLines > 0 && b.length > e.maxLines ? b.slice(b.length - e.maxLines) : b;
    }), S = le(() => {
      if (!e.showTimestamps) return "";
      const b = e.formatTs ?? zn;
      let P = "00:00:00";
      for (const J of k.value) {
        if (J.ts == null) continue;
        const Q = b(J.ts);
        Q.length > P.length && (P = Q);
      }
      return P;
    }), E = Y(0), i = Y([]);
    function w() {
      if (!V) return;
      const b = V.getContext("2d");
      if (!b) return;
      b.font = fn;
      const P = e.showTimestamps ? Dl(b, S.value) : 0;
      E.value = P;
      const J = Math.max(
        1,
        s.value - kt * 2 - P
      );
      i.value = Fl({
        entries: k.value,
        ctx: b,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const T = le(() => Al(i.value.length)), D = le(() => Math.max(0, T.value - h.value)), X = le(() => {
      let b = 0;
      for (const P of i.value) P.widthPx > b && (b = P.widthPx);
      return kt * 2 + E.value + b;
    }), M = le(() => Math.max(0, X.value - s.value)), y = Y(0);
    K(D, () => {
      u.value ? d.value = D.value : d.value = Math.min(d.value, D.value);
    }), K(M, () => {
      y.value = Math.min(y.value, M.value);
    }), K(
      [k, s, () => e.showTimestamps, () => e.wordWrap, S],
      () => {
        w(), _e(oe);
      },
      { deep: !1 }
    );
    let I = null, U = !1;
    function j() {
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
    let te, q, ee, Z, V;
    const N = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${zt}

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

  ${Vt}

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

    ${$t}

    gl_FragColor = color;
  }
`;
    function ue() {
      if (!(!a.value || !l.value)) {
        V = document.createElement("canvas");
        try {
          I = new z.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          U = !0;
        }
        if (!U && !I.getContext() && (I.dispose(), I = null, U = !0), U) {
          re();
          return;
        }
        I.setPixelRatio(1), I.setClearColor(0, 0), te = new z.Scene(), q = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), Z = new z.CanvasTexture(V), Z.minFilter = z.LinearFilter, Z.magFilter = z.LinearFilter, ee = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: Z },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: _l,
          fragmentShader: N,
          transparent: !0
        }), te.add(new z.Mesh(new z.PlaneGeometry(2, 2), ee)), re();
      }
    }
    function re() {
      if (!l.value || !I && !U) return;
      const b = l.value.clientWidth, P = l.value.clientHeight;
      if (!b || !P) return;
      const J = V.width !== b || V.height !== P;
      J && (V.width = b, V.height = P, s.value = b, h.value = P, w(), I ? (J && Z && (Z.dispose(), Z = new z.CanvasTexture(V), Z.minFilter = z.LinearFilter, Z.magFilter = z.LinearFilter, ee && (ee.uniforms.uTex.value = Z)), I.setPixelRatio(window.devicePixelRatio || 1), I.setSize(b, P)) : a.value && (a.value.width = b, a.value.height = P, a.value.style.width = b + "px", a.value.style.height = P + "px"), u.value && (d.value = Math.max(0, T.value - h.value)), oe());
    }
    function oe() {
      if (!(V != null && V.width)) return;
      if (U) {
        if (!a.value) return;
        Rn(V, {
          visualLines: i.value,
          scrollY: d.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: E.value,
          hoveredLine: c.value,
          selectionStart: Math.min(m.value, g.value),
          selectionEnd: Math.max(m.value, g.value)
        });
        const P = a.value.getContext("2d");
        P && P.drawImage(V, 0, 0);
        return;
      }
      if (!I || !ee || !Z) return;
      const b = e.theme === "paper";
      ee.uniforms.uStrength.value = Ze(e.curvature), ee.uniforms.uScanlines.value = e.scanlines && !b ? 1 : 0, ee.uniforms.uVignette.value = b ? 0 : 1, Nt(ee, e.magnify, r, V.width, V.height), Rn(V, {
        visualLines: i.value,
        scrollY: d.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: E.value,
        hoveredLine: c.value,
        selectionStart: Math.min(m.value, g.value),
        selectionEnd: Math.max(m.value, g.value)
      }), Z.needsUpdate = !0, I.render(te, q);
    }
    K(() => e.theme, () => oe()), K(() => e.curvature, () => oe()), K(() => e.scanlines, () => oe()), K(() => e.glow, () => oe()), K(() => e.magnify, (b) => {
      b || (r.x = be.x, r.y = be.y), oe();
    }), K(d, () => oe()), K(y, () => oe()), K(c, () => oe()), K([m, g], () => oe());
    function p(b) {
      if (!a.value) return [-1, -1];
      const P = a.value.getBoundingClientRect();
      return [b.clientX - P.left, b.clientY - P.top];
    }
    function v(b) {
      d.value = Math.max(0, Math.min(D.value, b)), u.value = d.value >= D.value - 4;
    }
    function C(b) {
      y.value = Math.max(0, Math.min(M.value, b));
    }
    function L(b) {
      b.shiftKey ? C(y.value + b.deltaY) : Math.abs(b.deltaX) > Math.abs(b.deltaY) ? C(y.value + b.deltaX) : v(d.value + b.deltaY);
    }
    let B = !1, W = 0, $ = 0, O = 0, he = 0, ie = !1;
    function me(b) {
      B = !0, ie = !1, W = b.clientX, $ = b.clientY, O = y.value, he = d.value, l.value && l.value.focus();
    }
    function ke(b) {
      if (B) {
        const P = W - b.clientX, J = $ - b.clientY;
        (Math.abs(P) > 4 || Math.abs(J) > 4) && (ie = !0), C(O + P), v(he + J);
      }
    }
    function ae() {
      B && (B = !1, ie && (ie = !1));
    }
    function A(b) {
      if (b.touches.length !== 1) return;
      const P = b.touches[0];
      B = !0, ie = !1, W = P.clientX, $ = P.clientY, O = y.value, he = d.value, l.value && l.value.focus();
    }
    function G(b) {
      if (!B || b.touches.length !== 1) return;
      b.preventDefault();
      const P = b.touches[0], J = W - P.clientX, Q = $ - P.clientY;
      (Math.abs(J) > 4 || Math.abs(Q) > 4) && (ie = !0), C(O + J), v(he + Q);
    }
    function se() {
      B && (B = !1, ie && (ie = !1));
    }
    function Ie(b) {
      const [, P] = p(b);
      return P < 0 ? -1 : En(P, d.value, i.value.length);
    }
    function Te(b) {
      if (ie) {
        ie = !1;
        return;
      }
      const P = Ie(b);
      if (P < 0) {
        m.value = -1, g.value = -1;
        return;
      }
      b.shiftKey && m.value >= 0 || (m.value = P), g.value = P;
    }
    function Pe(b, P) {
      const J = i.value.length;
      if (J === 0) return;
      const Q = g.value < 0 ? 0 : g.value;
      let Ve = Math.max(0, Math.min(J - 1, Q + b));
      g.value = Ve, (!P || m.value < 0) && (m.value = Ve), c.value = Ve;
      const ce = rt + Ve * Me, Ce = ce + Me;
      ce < d.value ? v(ce) : Ce > d.value + h.value && v(Ce - h.value);
    }
    function st() {
      const b = Math.min(m.value, g.value), P = Math.max(m.value, g.value);
      if (b < 0) return "";
      const J = i.value, Q = /* @__PURE__ */ new Set(), Ve = [];
      for (let ce = b; ce <= P && ce < J.length; ce++) {
        const Ce = J[ce];
        if (Q.has(Ce.entryIdx)) continue;
        Q.add(Ce.entryIdx);
        let ft = "";
        for (let $e = 0; $e < J.length; $e++)
          J[$e].entryIdx === Ce.entryIdx && (ft += (ft && !J[$e].isFirstFrag ? " " : "") + J[$e].text);
        Ve.push(Ce.timestamp ? `${Ce.timestamp}  ${ft}` : ft);
      }
      return Ve.join(`
`);
    }
    async function ct() {
      const b = st();
      if (b)
        try {
          await navigator.clipboard.writeText(b);
        } catch {
          const P = document.createElement("textarea");
          P.value = b, P.style.position = "fixed", P.style.opacity = "0", document.body.appendChild(P), P.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(P);
        }
    }
    function nt(b) {
      if ((b.metaKey || b.ctrlKey) && (b.key === "c" || b.key === "C")) {
        m.value >= 0 && (b.preventDefault(), ct());
        return;
      }
      if ((b.metaKey || b.ctrlKey) && (b.key === "a" || b.key === "A")) {
        b.preventDefault(), m.value = 0, g.value = i.value.length - 1;
        return;
      }
      switch (b.key) {
        case "ArrowDown":
          b.preventDefault(), Pe(1, b.shiftKey);
          break;
        case "ArrowUp":
          b.preventDefault(), Pe(-1, b.shiftKey);
          break;
        case "ArrowRight":
          b.preventDefault(), C(y.value + Me * 2);
          break;
        case "ArrowLeft":
          b.preventDefault(), C(y.value - Me * 2);
          break;
        case "PageDown":
          b.preventDefault(), v(d.value + h.value);
          break;
        case "PageUp":
          b.preventDefault(), v(d.value - h.value);
          break;
        case "Home":
          b.preventDefault(), v(0), C(0);
          break;
        case "End":
          b.preventDefault(), v(D.value);
          break;
        case "Escape":
          m.value = -1, g.value = -1;
          break;
      }
    }
    function Re(b) {
      if (e.magnify && a.value) {
        const J = Xt(b, a.value);
        r.x = J.x, r.y = J.y, oe();
      }
      const [, P] = p(b);
      if (P < 0) {
        c.value = -1;
        return;
      }
      c.value = En(P, d.value, i.value.length);
    }
    function Ee() {
      c.value = -1, r.x = be.x, r.y = be.y, oe();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, d.value = D.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(b) {
        v(rt + b * Me);
      }
    });
    let De = null, Fe = null, Ue = 0;
    const ut = Ht("cathodeResetTick", Y(0));
    K(ut, () => Le());
    function Le() {
      cancelAnimationFrame(Ue), Ue = requestAnimationFrame(re);
    }
    function It(b) {
      b.preventDefault();
    }
    function pt() {
      I == null || I.dispose(), I = null, U = !1, ue();
    }
    Ne(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", ae), _e(() => {
        var b;
        ue(), a.value && (a.value.addEventListener("webglcontextlost", It), a.value.addEventListener("webglcontextrestored", pt)), l.value && (De = new ResizeObserver(() => re()), De.observe(l.value), Fe = new IntersectionObserver((P) => {
          P.some((J) => J.isIntersecting) && Le();
        }), Fe.observe(l.value)), window.addEventListener("resize", Le), (b = window.visualViewport) == null || b.addEventListener("resize", Le), d.value = D.value;
      });
    }), et(() => {
      var b, P, J;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", ae), (b = a.value) == null || b.removeEventListener("webglcontextlost", It), (P = a.value) == null || P.removeEventListener("webglcontextrestored", pt), De == null || De.disconnect(), Fe == null || Fe.disconnect(), window.removeEventListener("resize", Le), (J = window.visualViewport) == null || J.removeEventListener("resize", Le), cancelAnimationFrame(Ue), j();
    });
    const Lt = le(() => Wt[e.theme] ?? Wt.none), Ut = le(() => ({
      background: Lt.value.bg
    }));
    return (b, P) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ke(Ut.value),
      tabindex: "0",
      onKeydown: nt
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: at(L, ["prevent"]),
        onMousemove: Re,
        onMouseleave: Ee,
        onMousedown: me,
        onClick: Te,
        onTouchstartPassive: A,
        onTouchmove: G,
        onTouchend: se,
        onTouchcancel: se
      }, null, 544)
    ], 36));
  }
}), Wl = /* @__PURE__ */ tt(Bl, [["__scopeId", "data-v-d6dc9e79"]]), Yl = ["disabled"], Pl = /* @__PURE__ */ Qe({
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
  setup(t, { expose: n, emit: e }) {
    const l = t, a = e, r = Y(null), s = Y(null), h = Y(""), d = Y([]), c = Y(-1);
    let u = "";
    function m(M) {
      M.trim() && (d.value.length && d.value[d.value.length - 1] === M || (d.value.push(M), d.value.length > l.historyLimit && d.value.splice(0, d.value.length - l.historyLimit)));
    }
    function g(M) {
      if (!l.disabled) {
        if (M.key === "Enter") {
          M.preventDefault();
          const y = h.value;
          y.trim() && m(y), c.value = -1, h.value = "", a("submit", y);
          return;
        }
        if (M.key === "ArrowUp") {
          if (!d.value.length) return;
          M.preventDefault(), c.value === -1 ? (u = h.value, c.value = d.value.length - 1) : c.value > 0 && c.value--, h.value = d.value[c.value];
          return;
        }
        if (M.key === "ArrowDown") {
          if (c.value === -1) return;
          M.preventDefault(), c.value < d.value.length - 1 ? (c.value++, h.value = d.value[c.value]) : (c.value = -1, h.value = u, u = "");
          return;
        }
      }
    }
    const k = Y(!0);
    let S = null;
    function E() {
      S || (S = setInterval(() => {
        k.value = !k.value;
      }, 530));
    }
    function i() {
      S && (clearInterval(S), S = null), k.value = !0;
    }
    const w = le(() => {
      let M;
      return l.disabled ? M = " " : l.busy ? M = "█" : M = k.value ? "█" : " ", { level: "info", text: `${l.prompt}${h.value}${M}` };
    }), T = le(
      () => [...l.entries, w.value]
    );
    function D() {
      var M;
      l.disabled || (M = s.value) == null || M.focus();
    }
    K(() => l.busy, (M, y) => {
      y && !M && !l.disabled && _e(() => {
        var I;
        return (I = s.value) == null ? void 0 : I.focus();
      });
    });
    function X() {
      var M;
      (M = s.value) == null || M.focus();
    }
    return n({ focus: X }), Ne(() => {
      E(), l.disabled || requestAnimationFrame(() => {
        var M;
        return (M = s.value) == null ? void 0 : M.focus();
      });
    }), et(() => {
      i();
    }), (M, y) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: D
    }, [
      An(Wl, {
        entries: T.value,
        theme: t.theme,
        curvature: t.curvature,
        scanlines: t.scanlines,
        glow: t.glow,
        magnify: t.magnify,
        "show-timestamps": t.showTimestamps,
        "format-ts": t.formatTs,
        "word-wrap": t.wordWrap,
        autoscroll: t.autoscroll,
        "max-lines": t.maxLines
      }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "magnify", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"]),
      _n(ve("input", {
        ref_key: "inputEl",
        ref: s,
        "onUpdate:modelValue": y[0] || (y[0] = (I) => h.value = I),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: g
      }, null, 40, Yl), [
        [ll, h.value]
      ])
    ], 512));
  }
}), Ho = /* @__PURE__ */ tt(Pl, [["__scopeId", "data-v-a2b39934"]]), gt = {
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
}, Hl = 0.18, Tt = 8, dn = 22, zl = 4, Ye = 8, qe = 56, vn = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Vl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", tn = 4, $l = 1, Ol = 1;
function Nl(t, n, e, l = 0, a = !1) {
  const r = a ? vn : qe, s = Math.max(0, n - Ye - r), h = Math.max(1, Math.floor(s / e)), d = Math.min(h, t);
  return { firstIdx: Math.max(0, t - d - Math.floor(l / e)), count: d, slotW: e };
}
function Xl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, r = 0;
  const s = Math.min(t.length, n + e);
  for (let d = n; d < s; d++) {
    const c = t[d];
    c && (c.low < l && (l = c.low), c.high > a && (a = c.high), c.volume > r && (r = c.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const d = isFinite(l) ? l : 0;
    return { min: d - 1, max: d + 1, maxVol: Math.max(1, r) };
  }
  const h = (a - l) * 0.04;
  return { min: l - h, max: a + h, maxVol: Math.max(1, r) };
}
function Ul(t, n, e = !1) {
  const l = e ? zl : dn, a = Math.max(1, t - Tt - l - tn), r = Math.max(0, Math.round(a * n)), s = a - r;
  return {
    priceY0: Tt,
    priceY1: Tt + s,
    volumeY0: Tt + s + tn,
    volumeY1: Tt + s + tn + r
  };
}
function We(t, n, e, l) {
  const a = n.max - n.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / a) * (l - e);
}
function Je(t, n, e) {
  return Ye + (t - n + 0.5) * e;
}
function je(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function hn(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${r}`;
}
function Gl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * l;
}
function rn(t, n) {
  var k, S, E, i, w;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = gt[n.theme] ?? gt.none, s = n.colors ? { ...r, ...n.colors } : r, h = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = s.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const d = Nl(n.candles.length, l, n.slotW, n.scrollX, h), c = Xl(n.candles, d.firstIdx, d.count), u = Ul(a, n.showVolume ? n.volumeFraction : 0, h), m = Math.max($l, Math.floor(n.slotW * 0.7)), g = Math.min(n.candles.length, d.firstIdx + d.count);
  for (let T = d.firstIdx; T < g; T++) {
    const D = n.candles[T];
    if (!D) continue;
    const X = Je(T, d.firstIdx, n.slotW), M = We(D.open, c, u.priceY0, u.priceY1), y = We(D.close, c, u.priceY0, u.priceY1), I = We(D.high, c, u.priceY0, u.priceY1), U = We(D.low, c, u.priceY0, u.priceY1), j = D.close >= D.open, te = j ? s.wickBull : s.wickBear, q = j ? s.candleBull : s.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = te, e.lineWidth = Ol, e.beginPath(), e.moveTo(Math.round(X) + 0.5, I), e.lineTo(Math.round(X) + 0.5, U), e.stroke(), e.fillStyle = q;
    const ee = Math.min(M, y), Z = Math.max(1, Math.abs(y - M)), V = Math.round(X - m / 2), N = Math.round(ee), ue = Math.round(Z);
    if (e.fillRect(V, N, m, ue), n.glow && (e.shadowBlur = 4, e.fillRect(V, N, m, ue)), e.shadowBlur = 0, n.showVolume && c.maxVol > 0) {
      const re = Math.round(D.volume / c.maxVol * (u.volumeY1 - u.volumeY0));
      re > 0 && (e.fillStyle = j ? s.volumeBull : s.volumeBear, e.fillRect(
        Math.round(X - m / 2),
        u.volumeY1 - re,
        m,
        re
      ));
    }
  }
  if ((k = n.overlays) != null && k.length) {
    const T = { above: 0, below: 0 }, D = n.overlays.filter((M) => M.kind !== "hline" && !!M.label).length, X = D ? 14 + 14 * D + 12 : 8;
    for (const M of n.overlays)
      M.kind === "hline" ? jl(e, M, l, c, u, s, h, T, X) : Kl(e, M, d, c, u, n.slotW);
  }
  (S = n.markers) != null && S.length && lo(e, s, n.markers, n.candles, d, c, u, n.slotW), oo(e, s, c, u, l, h), h || (ao(e, s, n.candles, d, n.slotW, a), to(e, s, n.candles, l, a)), (E = n.overlays) != null && E.length && Zl(e, s, n.overlays, u), n.hover && (ro(e, s, n.candles, d, c, u, n.slotW, n.hover, l), Jl(e, s, n.candles, d, n.slotW, n.hover, u, ((i = n.overlays) == null ? void 0 : i.length) ?? 0), (w = n.markers) != null && w.length && eo(e, s, n.markers, n.candles, d, c, u, n.slotW, n.hover, l)), e.restore();
}
function Kl(t, n, e, l, a, r) {
  var h;
  const s = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    Ft(t, n.data, e.firstIdx, s, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const d = Vn(n.color, n.fillAlpha ?? 0.08);
    ql(t, n.upper, n.lower, e.firstIdx, s, r, l, a, d), Ft(t, n.upper, e.firstIdx, s, r, l, a, n.color, 1, !1), Ft(t, n.lower, e.firstIdx, s, r, l, a, n.color, 1, !1), (h = n.middle) != null && h.length && Ft(t, n.middle, e.firstIdx, s, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function jl(t, n, e, l, a, r, s, h = { above: 0, below: 0 }, d = 8) {
  const c = We(n.price, l, a.priceY0, a.priceY1), u = c < a.priceY0 - 0.5, m = c > a.priceY1 + 0.5, g = u || m, k = g ? u ? h.above++ : h.below++ : 0, S = g ? u ? a.priceY0 + d + k * 20 : a.priceY1 - 8 - k * 20 : c, E = s ? vn : qe, i = Math.round(S) + 0.5;
  t.save(), g || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, i), t.lineTo(e - E, i), t.stroke(), t.setLineDash([]));
  let w = n.label ?? je(n.price);
  if (g && w !== "" && (w = (u ? "↑ " : "↓ ") + w), w !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const T = t.measureText(w).width, D = 4, X = 2, M = Ye + 2;
    t.fillStyle = n.color, g && (t.globalAlpha = 0.85), t.fillRect(M, S - 7 - X, T + D * 2, 14 + X * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(w, M + D, S);
  }
  t.restore();
}
function Ft(t, n, e, l, a, r, s, h, d, c) {
  if (!n || !n.length) return;
  t.strokeStyle = h, t.lineWidth = d, t.setLineDash(c ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let m = e; m < l; m++) {
    const g = n[m];
    if (typeof g != "number" || !isFinite(g)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const k = Je(m, e, a), S = We(g, r, s.priceY0, s.priceY1);
    u ? t.lineTo(k, S) : (t.moveTo(k, S), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function ql(t, n, e, l, a, r, s, h, d) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = d;
  let c = !1, u = -1;
  for (let m = l; m <= a; m++) {
    const g = n[m], k = e[m], S = m < a && typeof g == "number" && typeof k == "number" && isFinite(g) && isFinite(k);
    if (S && !c && (u = m, c = !0), !S && c || m === a && c) {
      const E = S ? m + 1 : m;
      t.beginPath();
      for (let i = u; i < E; i++) {
        const w = Je(i, l, r), T = We(n[i], s, h.priceY0, h.priceY1);
        i === u ? t.moveTo(w, T) : t.lineTo(w, T);
      }
      for (let i = E - 1; i >= u; i--) {
        const w = Je(i, l, r), T = We(e[i], s, h.priceY0, h.priceY1);
        t.lineTo(w, T);
      }
      t.closePath(), t.fill(), c = !1;
    }
  }
}
function Vn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Zl(t, n, e, l) {
  const a = e.filter((E) => E.kind !== "hline" && !!E.label);
  if (!a.length) return;
  t.save(), t.font = Xe;
  const r = 8, s = 5, h = 12, d = 6, c = 14;
  let u = 0;
  for (const E of a) {
    const i = t.measureText(E.label).width;
    i > u && (u = i);
  }
  const m = r * 2 + h + d + u, g = s * 2 + c * a.length, k = Ye + 4, S = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(k, S, m, g), t.textBaseline = "middle", t.textAlign = "left";
  for (let E = 0; E < a.length; E++) {
    const i = a[E], w = S + s + c * (E + 0.5), T = k + r;
    i.kind === "line" ? (t.strokeStyle = i.color, t.lineWidth = i.lineWidth ?? 1, t.setLineDash(i.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(T, w), t.lineTo(T + h, w), t.stroke(), t.setLineDash([])) : i.kind === "band" && (t.fillStyle = Vn(i.color, i.fillAlpha ?? 0.2), t.fillRect(T, w - 4, h, 8), t.strokeStyle = i.color, t.lineWidth = 1, t.strokeRect(T + 0.5, w - 4 + 0.5, h - 1, 7)), t.fillStyle = n.text, t.fillText(i.label, T + h + d, w);
  }
  t.restore();
}
function Jl(t, n, e, l, a, r, s, h) {
  const d = Math.floor((r.x - Ye) / a), c = l.firstIdx + d;
  if (c < 0 || c >= e.length) return;
  const u = e[c];
  if (!u) return;
  const m = u.close - u.open, g = u.open !== 0 ? m / u.open * 100 : 0, k = m >= 0 ? "+" : "", S = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", Ql(u.volume), void 0],
    ["", `${k}${g.toFixed(2)}%`, m >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const E = 8, i = 4, w = 14;
  let T = E;
  for (const [y, I] of S) {
    const U = y ? `${y} ${I}` : I, j = t.measureText(U).width + 12;
    T += j;
  }
  T += E - 12;
  const D = s.priceY0 + 4 + (h > 0 ? i * 2 + 14 * h + 4 : 0), X = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(X, D, T, w + i * 2);
  let M = X + E;
  for (let y = 0; y < S.length; y++) {
    const [I, U, j] = S[y];
    t.fillStyle = n.text, I && (t.globalAlpha = 0.6, t.fillText(I + " ", M, D + i + w / 2), t.globalAlpha = 1, M += t.measureText(I + " ").width), j && (t.fillStyle = j), t.fillText(U, M, D + i + w / 2), M += t.measureText(U).width + 12;
  }
  t.restore();
}
function Ql(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function eo(t, n, e, l, a, r, s, h, d, c) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, m = Math.max(1, u * 0.5), g = Math.min(l.length, a.firstIdx + a.count), k = 9;
  let S = null;
  for (const U of e) {
    let j = 0, te = l.length - 1, q = -1;
    for (; j <= te; ) {
      const V = j + te >> 1, N = l[V].start - U.timestamp;
      if (Math.abs(N) <= m) {
        q = V;
        break;
      }
      N < 0 ? j = V + 1 : te = V - 1;
    }
    if (q < 0 || q < a.firstIdx || q >= g) continue;
    const ee = Je(q, a.firstIdx, h), Z = We(U.price, r, s.priceY0, s.priceY1);
    if (Math.abs(d.x - ee) <= k && Math.abs(d.y - Z) <= k) {
      S = { m: U, x: ee, y: Z };
      break;
    }
  }
  if (!S) return;
  const E = hn(S.m.timestamp), i = [
    `${S.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${E}`,
    `@ ${je(S.m.price)}`
  ];
  S.m.label && i.push(S.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const w = 6, T = 14;
  let D = 0;
  for (const U of i) {
    const j = t.measureText(U).width;
    j > D && (D = j);
  }
  const X = D + w * 2, M = i.length * T + w * 2;
  let y = S.x + 12;
  y + X > c - qe && (y = S.x - 12 - X);
  let I = S.y - M / 2;
  I < s.priceY0 && (I = s.priceY0), I + M > s.priceY1 && (I = s.priceY1 - M), t.fillStyle = n.panelBgSolid, t.strokeStyle = S.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(y, I, X, M), t.strokeRect(y + 0.5, I + 0.5, X - 1, M - 1);
  for (let U = 0; U < i.length; U++) {
    const j = i[U];
    t.fillStyle = U === 0 ? S.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(j, y + w, I + w + U * T);
  }
  t.restore();
}
function to(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, s = no(r);
  if (!s) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const h = 6, d = 3, c = t.measureText(s).width, u = l - qe - h, m = a - dn + 4;
  t.fillStyle = n.accent, t.fillRect(u - c - h, m - d, c + h * 2, 14 + d * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(s, u, m), t.restore();
}
function no(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function lo(t, n, e, l, a, r, s, h) {
  if (!l.length) return;
  const d = l.length > 1 ? l[1].start - l[0].start : 6e4, c = Math.max(1, d * 0.5), u = Math.min(l.length, a.firstIdx + a.count), m = (k) => {
    let S = 0, E = l.length - 1;
    for (; S <= E; ) {
      const i = S + E >> 1, w = l[i].start - k;
      if (Math.abs(w) <= c) return i;
      w < 0 ? S = i + 1 : E = i - 1;
    }
    return -1;
  }, g = 7;
  for (const k of e) {
    const S = m(k.timestamp);
    if (S < 0 || S < a.firstIdx || S >= u) continue;
    const E = Je(S, a.firstIdx, h), i = We(k.price, r, s.priceY0, s.priceY1);
    if (i < s.priceY0 || i > s.priceY1) continue;
    const w = k.color ?? (k.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = w, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), k.kind === "entry" ? (t.moveTo(E, i - g), t.lineTo(E - g, i + g - 1), t.lineTo(E + g, i + g - 1)) : (t.moveTo(E, i + g), t.lineTo(E - g, i - g + 1), t.lineTo(E + g, i - g + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function oo(t, n, e, l, a, r = !1) {
  const s = e.max - e.min;
  if (s <= 0) return;
  const h = l.priceY1 - l.priceY0, d = r ? Math.max(2, Math.min(4, Math.round(h / 36))) : 6, c = Gl(s, d), u = Math.ceil(e.min / c) * c, m = r ? vn : qe;
  t.font = r ? Vl : Xe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let g = u; g <= e.max; g += c) {
    const k = We(g, e, l.priceY0, l.priceY1);
    k < l.priceY0 || k > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(k) + 0.5), t.lineTo(a - m, Math.round(k) + 0.5), t.stroke(), t.fillText(je(g), a - m + 3, k));
  }
  t.globalAlpha = 1;
}
function ao(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const h = Math.max(1, Math.floor(l.count / 6));
  t.font = Xe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const d = Math.min(e.length, l.firstIdx + l.count);
  for (let c = l.firstIdx; c < d; c += h) {
    const u = e[c];
    if (!u) continue;
    const m = Je(c, l.firstIdx, a);
    t.fillText(hn(u.start), m, r - dn + 4);
  }
  t.globalAlpha = 1;
}
function ro(t, n, e, l, a, r, s, h, d) {
  const c = Math.floor((h.x - Ye) / s), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + c)), m = e[u];
  if (!m) return;
  const g = Je(u, l.firstIdx, s);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(g) + 0.5, r.priceY0), t.lineTo(Math.round(g) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const k = Math.max(r.priceY0, Math.min(r.priceY1, h.y));
  t.beginPath(), t.moveTo(Ye, Math.round(k) + 0.5), t.lineTo(d - qe, Math.round(k) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const S = a.max - a.min;
  if (S > 0) {
    const w = a.max - (k - r.priceY0) / (r.priceY1 - r.priceY0) * S, T = je(w);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const D = t.measureText(T).width, X = 4, M = 2;
    t.fillStyle = n.accent, t.fillRect(d - qe + 2, k - 7 - M, D + X * 2, 14 + M * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(T, d - qe + 2 + X, k);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const E = hn(m.start), i = t.measureText(E).width;
  t.fillStyle = n.accent, t.fillRect(g - i / 2 - 4, r.volumeY1 + 2, i + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(E, g, r.volumeY1 + 4), t.restore();
}
const nn = 0.25, ln = 6, io = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, so = /* @__PURE__ */ Qe({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Hl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = Y(null), l = Y(null), a = { ...be }, r = Y(0), s = Y(0), h = Y(0), d = Y(1), c = Y(null), u = le(() => Math.max(1, n.slotW * d.value));
    let m = null, g = !1;
    function k() {
      if (m) {
        try {
          m.forceContextLoss();
        } catch {
        }
        try {
          m.dispose();
        } catch {
        }
        m = null;
      }
    }
    let S, E, i, w, T;
    const D = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${zt}

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

  ${Vt}

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

    ${$t}

    gl_FragColor = color;
  }
`;
    function X() {
      if (!(!l.value || !e.value)) {
        if (T = document.createElement("canvas"), n.flat) {
          g = !0, M();
          return;
        }
        try {
          m = new z.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          g = !0;
        }
        if (!g && !m.getContext() && (m.dispose(), m = null, g = !0), g) {
          M();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), S = new z.Scene(), E = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), w = new z.CanvasTexture(T), w.minFilter = z.LinearFilter, w.magFilter = z.LinearFilter, i = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: w },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: io,
          fragmentShader: D,
          transparent: !0
        }), S.add(new z.Mesh(new z.PlaneGeometry(2, 2), i)), M();
      }
    }
    function M() {
      if (!e.value || !m && !g) return;
      const A = e.value.clientWidth, G = e.value.clientHeight;
      !A || !G || !(T.width !== A || T.height !== G) || (T.width = A, T.height = G, r.value = A, s.value = G, m ? (w && (w.dispose(), w = new z.CanvasTexture(T), w.minFilter = z.LinearFilter, w.magFilter = z.LinearFilter, i && (i.uniforms.uTex.value = w)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(A, G)) : l.value && (l.value.width = A, l.value.height = G, l.value.style.width = A + "px", l.value.style.height = G + "px"), y());
    }
    function y() {
      if (!(T != null && T.width)) return;
      if (g) {
        if (!l.value) return;
        rn(T, {
          candles: n.candles,
          slotW: u.value,
          scrollX: h.value,
          theme: n.theme,
          glow: !1,
          showVolume: n.showVolume,
          volumeFraction: n.volumeFraction,
          hover: c.value,
          overlays: n.overlays,
          markers: n.markers,
          compact: n.compact,
          colors: n.colors
        });
        const G = l.value.getContext("2d");
        G && (G.clearRect(0, 0, l.value.width, l.value.height), G.drawImage(T, 0, 0));
        return;
      }
      if (!m || !i || !w) return;
      const A = n.theme === "paper";
      i.uniforms.uStrength.value = Ze(n.curvature), i.uniforms.uScanlines.value = n.scanlines && !A ? 1 : 0, i.uniforms.uVignette.value = A ? 0 : 1, Nt(i, n.magnify, a, T.width, T.height), rn(T, {
        candles: n.candles,
        slotW: u.value,
        scrollX: h.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: c.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), w.needsUpdate = !0, m.render(S, E);
    }
    K(() => n.theme, () => y()), K(() => n.curvature, () => y()), K(() => n.scanlines, () => y()), K(() => n.glow, () => y()), K(() => n.showVolume, () => y()), K(() => n.volumeFraction, () => y()), K(() => n.slotW, () => y()), K(() => n.candles, () => y(), { deep: !1 }), K(() => n.overlays, () => y(), { deep: !1 }), K(() => n.markers, () => y(), { deep: !1 }), K(() => n.compact, () => y()), K(() => n.magnify, (A) => {
      A || (a.x = be.x, a.y = be.y), y();
    }), K(() => n.colors, () => y(), { deep: !0 }), K(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), K(h, () => y()), K(d, () => y()), K(c, () => y()), K(u, () => y());
    let I = null, U = null, j = 0;
    const te = Ht("cathodeResetTick", Y(0));
    K(te, () => q());
    function q() {
      cancelAnimationFrame(j), j = requestAnimationFrame(M);
    }
    function ee(A) {
      A.preventDefault();
    }
    function Z() {
      m == null || m.dispose(), m = null, g = !1, X();
    }
    function V(A) {
      if (!l.value) return [-1, -1];
      const G = l.value.getBoundingClientRect();
      return [A.clientX - G.left, A.clientY - G.top];
    }
    function N(A) {
      var Pe;
      const G = u.value;
      if (G <= 0) return 0;
      const se = ((Pe = n.candles) == null ? void 0 : Pe.length) ?? 0, Ie = Math.max(1, Math.floor((r.value || 1) / G)), Te = Math.max(0, se - Ie);
      return Math.max(0, Math.min(A, Te * G));
    }
    function ue(A) {
      var Ie;
      if (A.deltaX !== 0 || A.shiftKey && A.deltaY !== 0) {
        const Te = A.deltaX !== 0 ? A.deltaX : A.deltaY;
        h.value = N(h.value + Te);
        return;
      }
      if (A.deltaY === 0) return;
      const [G] = V(A), se = u.value;
      if (G >= 0 && se > 0 && ((Ie = n.candles) != null && Ie.length)) {
        const Te = Math.max(1, Math.floor((r.value || 1) / se)), st = Math.max(0, n.candles.length - Te - Math.floor(h.value / se)) + (G - 8) / se, ct = Math.exp(-A.deltaY * 15e-4), nt = Math.max(nn, Math.min(ln, d.value * ct));
        d.value = nt;
        const Re = n.slotW * nt, Ee = Math.max(1, Math.floor((r.value || 1) / Re)), De = st - (G - 8) / Re, Fe = Math.max(0, n.candles.length - Ee - De);
        h.value = N(Fe * Re);
      } else {
        const Te = Math.exp(-A.deltaY * 15e-4);
        d.value = Math.max(nn, Math.min(ln, d.value * Te));
      }
    }
    let re = !1, oe = 0, p = 0;
    function v(A) {
      A.button === 0 && (re = !0, oe = A.clientX, p = h.value, c.value = null, e.value && e.value.focus());
    }
    function C(A) {
      const G = Math.exp(A * 0.18);
      d.value = Math.max(nn, Math.min(ln, d.value * G)), h.value = N(h.value);
    }
    function L(A) {
      const G = u.value, se = A.shiftKey ? 20 : 3;
      switch (A.key) {
        case "ArrowLeft":
          A.preventDefault(), h.value = N(h.value + G * se);
          break;
        case "ArrowRight":
          A.preventDefault(), h.value = N(h.value - G * se);
          break;
        case "ArrowUp":
          A.preventDefault(), C(1);
          break;
        case "ArrowDown":
          A.preventDefault(), C(-1);
          break;
        case "Home":
          A.preventDefault(), h.value = N(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          A.preventDefault(), h.value = 0;
          break;
      }
    }
    function B(A) {
      if (re) {
        const G = A.clientX - oe;
        h.value = N(p + G);
        return;
      }
    }
    function W() {
      re = !1;
    }
    function $(A) {
      if (A.touches.length !== 1) return;
      const G = A.touches[0];
      re = !0, oe = G.clientX, p = h.value, c.value = null;
    }
    function O(A) {
      if (!re || A.touches.length !== 1) return;
      A.preventDefault();
      const se = A.touches[0].clientX - oe;
      h.value = N(p + se);
    }
    function he() {
      re = !1;
    }
    function ie(A) {
      if (n.magnify && l.value) {
        const Ie = Xt(A, l.value);
        a.x = Ie.x, a.y = Ie.y, y();
      }
      if (re) return;
      const [G, se] = V(A);
      if (G < 0 || se < 0) {
        c.value = null;
        return;
      }
      c.value = { x: G, y: se };
    }
    function me() {
      c.value = null, a.x = be.x, a.y = be.y, y();
    }
    Ne(() => {
      document.addEventListener("mousemove", B), document.addEventListener("mouseup", W), _e(() => {
        var A;
        X(), l.value && (l.value.addEventListener("webglcontextlost", ee), l.value.addEventListener("webglcontextrestored", Z)), e.value && (I = new ResizeObserver(() => M()), I.observe(e.value), U = new IntersectionObserver((G) => {
          G.some((se) => se.isIntersecting) && q();
        }), U.observe(e.value)), window.addEventListener("resize", q), (A = window.visualViewport) == null || A.addEventListener("resize", q);
      });
    }), et(() => {
      var A, G, se;
      document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", W), (A = l.value) == null || A.removeEventListener("webglcontextlost", ee), (G = l.value) == null || G.removeEventListener("webglcontextrestored", Z), I == null || I.disconnect(), U == null || U.disconnect(), window.removeEventListener("resize", q), (se = window.visualViewport) == null || se.removeEventListener("resize", q), cancelAnimationFrame(j), k();
    });
    const ke = le(() => gt[n.theme] ?? gt.none), ae = le(() => ({
      background: ke.value.bg
    }));
    return (A, G) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ke(ae.value),
      tabindex: "0",
      onKeydown: L
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: at(ue, ["prevent"]),
        onMousedown: v,
        onMousemove: ie,
        onMouseleave: me,
        onTouchstartPassive: $,
        onTouchmove: O,
        onTouchend: he,
        onTouchcancel: he
      }, null, 544)
    ], 36));
  }
}), zo = /* @__PURE__ */ tt(so, [["__scopeId", "data-v-7c334778"]]), ot = 22, Ct = 6, co = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, uo = /* @__PURE__ */ Qe({
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
  setup(t, { emit: n }) {
    const e = t, l = n, a = Y(null), r = Y(null), s = Y(-1), h = Y(0), d = { ...be };
    let c = null, u = !1;
    function m() {
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
    let g, k, S, E, i;
    const w = Y(0), T = Y(0), D = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${zt}

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

  ${Vt}

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

    ${$t}

    gl_FragColor = color;
  }
`;
    function X() {
      if (!(!r.value || !a.value)) {
        i = document.createElement("canvas");
        try {
          c = new z.WebGLRenderer({ canvas: r.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          u = !0;
        }
        if (!u && !c.getContext() && (c.dispose(), c = null, u = !0), u) {
          M();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), g = new z.Scene(), k = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), E = new z.CanvasTexture(i), E.minFilter = z.LinearFilter, E.magFilter = z.LinearFilter, S = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: E },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: co,
          fragmentShader: D,
          transparent: !0
        }), g.add(new z.Mesh(new z.PlaneGeometry(2, 2), S)), M();
      }
    }
    function M() {
      if (!a.value || !c && !u) return;
      const p = a.value.clientWidth, v = a.value.clientHeight;
      if (!p || !v) return;
      w.value = p, T.value = v;
      const C = e.bendField ? Math.round(p * Hn(e.curvature)) : p, L = i.width !== C || i.height !== v;
      i.width = C, i.height = v, c ? (L && E && (E.dispose(), E = new z.CanvasTexture(i), E.minFilter = z.LinearFilter, E.magFilter = z.LinearFilter, S.uniforms.uTex.value = E), c.setSize(p, v)) : r.value && (r.value.width = p, r.value.height = v, r.value.style.width = p + "px", r.value.style.height = v + "px"), q();
    }
    function y() {
      const p = (i == null ? void 0 : i.width) || 0, v = Math.max(1, Math.floor(p / e.minCellW)), C = Math.floor(p / v), L = Math.round(C * e.cellAspect), B = ot + L + Ct;
      return { rects: e.cells.map(($, O) => ({
        x: O % v * C,
        y: Math.floor(O / v) * B - h.value,
        w: C,
        h: B
      })), rowH: B, totalH: Math.ceil(e.cells.length / v) * B, cols: v };
    }
    const I = () => {
      const { totalH: p } = y();
      return Math.max(0, p - ((i == null ? void 0 : i.height) || 0));
    }, U = /* @__PURE__ */ new Map();
    function j(p, v, C) {
      const L = p.candles[p.candles.length - 1], B = `${v}x${C}|${p.candles.length}|${L ? L.start + ":" + L.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, W = U.get(p.id);
      if (W && W.key === B) return W.canvas;
      const $ = (W == null ? void 0 : W.canvas) ?? document.createElement("canvas");
      $.width = v, $.height = C;
      const O = Math.max(1.5, Math.min(e.slotW, v / Math.max(1, p.candles.length)));
      return rn($, {
        candles: p.candles,
        slotW: O,
        scrollX: Math.max(0, p.candles.length * O - v),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: p.overlays,
        compact: !0,
        colors: e.colors
      }), U.set(p.id, { canvas: $, key: B }), $;
    }
    const te = le(() => ({ ...gt[e.theme] ?? gt.none, ...e.colors ?? {} }));
    function q() {
      var L;
      if (!(i != null && i.width)) return;
      const p = i.getContext("2d");
      if (!p) return;
      const v = te.value;
      p.clearRect(0, 0, i.width, i.height), v.bg && v.bg !== "rgba(0,0,0,0)" && (p.fillStyle = v.bg, p.fillRect(0, 0, i.width, i.height));
      const { rects: C } = y();
      p.font = "600 11px ui-monospace, SFMono-Regular, monospace", p.textBaseline = "middle";
      for (let B = 0; B < e.cells.length; B++) {
        const W = e.cells[B], $ = C[B];
        if ($.y + $.h < 0 || $.y > i.height) continue;
        const O = $.x + Ct / 2, he = $.w - Ct;
        p.strokeStyle = W.open ? v.candleBull : v.gridline, p.lineWidth = B === s.value ? 2 : 1, p.strokeRect(O + 0.5, $.y + 0.5, he - 1, $.h - Ct - 1);
        let ie = O + 7;
        p.fillStyle = v.text, p.textAlign = "left", p.fillText(W.title, ie, $.y + ot / 2 + 1), ie += p.measureText(W.title).width + 6, W.badge && (p.fillStyle = v.accent, p.fillText(W.badge, ie, $.y + ot / 2 + 1)), W.note && (p.textAlign = "right", p.fillStyle = W.noteColor || v.accent, p.fillText(W.note, O + he - (W.open ? 16 : 7), $.y + ot / 2 + 1), p.textAlign = "left"), W.open && (p.fillStyle = v.candleBull, p.beginPath(), p.arc(O + he - 9, $.y + ot / 2 + 1, 3, 0, Math.PI * 2), p.fill());
        const me = $.y + ot, ke = $.h - ot - Ct;
        W.candles.length ? p.drawImage(j(W, he - 2, ke - 1), O + 1, me) : (p.fillStyle = v.accent, p.textAlign = "center", p.fillText("· · ·", O + he / 2, me + ke / 2), p.textAlign = "left");
      }
      if (u) {
        const B = (L = r.value) == null ? void 0 : L.getContext("2d");
        B && r.value && B.drawImage(i, 0, 0, i.width, i.height, 0, 0, r.value.width, r.value.height);
        return;
      }
      !c || !S || !E || (S.uniforms.uStrength.value = Ze(e.curvature), S.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, S.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Nt(S, e.magnify, d, w.value || i.width, T.value || i.height), E.needsUpdate = !0, c.render(g, k));
    }
    function ee(p) {
      if (!r.value) return [-1, -1];
      const v = r.value.getBoundingClientRect();
      return Pn(
        p.clientX - v.left,
        p.clientY - v.top,
        v.width,
        v.height,
        Ze(e.curvature),
        (i == null ? void 0 : i.width) || v.width,
        (i == null ? void 0 : i.height) || v.height
      );
    }
    function Z(p, v) {
      if (p < 0) return -1;
      const { rects: C } = y();
      return C.findIndex((L) => p >= L.x && p < L.x + L.w && v >= L.y && v < L.y + L.h);
    }
    function V(p) {
      const [v, C] = ee(p), L = Z(v, C);
      L >= 0 && l("cell-click", e.cells[L].id);
    }
    function N(p) {
      if (e.magnify && r.value) {
        const B = Xt(p, r.value);
        d.x = B.x, d.y = B.y;
      }
      const [v, C] = ee(p), L = Z(v, C);
      L !== s.value ? (s.value = L, q()) : e.magnify && q(), r.value && (r.value.style.cursor = L >= 0 ? "pointer" : "default");
    }
    function ue() {
      s.value = -1, d.x = be.x, d.y = be.y, q();
    }
    function re(p) {
      const v = I();
      v <= 0 || (p.preventDefault(), h.value = Math.max(0, Math.min(v, h.value + p.deltaY)), q());
    }
    let oe = null;
    return Ne(() => {
      X(), oe = new ResizeObserver(() => M()), a.value && oe.observe(a.value);
    }), et(() => {
      oe == null || oe.disconnect(), m(), U.clear();
    }), K(() => [e.curvature, e.bendField], () => _e(M)), K(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      h.value = Math.min(h.value, I()), q();
    }, { deep: !1 }), (p, v) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: r,
        onClick: V,
        onMousemove: N,
        onMouseleave: ue,
        onWheel: re
      }, null, 544)
    ], 512));
  }
}), Vo = /* @__PURE__ */ tt(uo, [["__scopeId", "data-v-00f5c33e"]]), mn = Y(0), sn = 28, mt = 12;
let cn = 10, Yt = "cathode.layout", Pt = !1;
const Se = Y({});
function fo(t, n = "cathode.layout") {
  if (!Pt) {
    Pt = !0, Yt = n;
    try {
      const e = localStorage.getItem(Yt);
      if (e) {
        Se.value = JSON.parse(e), Dn();
        return;
      }
    } catch {
    }
    Se.value = { ...t }, Dn();
  }
}
function Dn() {
  let t = 10;
  for (const n of Object.values(Se.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  cn = t;
}
function it() {
  localStorage.setItem(Yt, JSON.stringify(Se.value));
}
function vo(t) {
  Pt = !1, localStorage.removeItem(Yt), Se.value = { ...t }, it(), Pt = !0, mn.value++;
}
function $n(t) {
  cn++, Se.value[t] && (Se.value[t].zIndex = cn);
}
function ho(t, n) {
  Se.value[t].visible = n, it();
}
function mo(t, n) {
  Se.value[t].minimized = n, n && (Se.value[t].maximized = !1), it();
}
function go(t, n) {
  Se.value[t].maximized = n, n && (Se.value[t].minimized = !1, $n(t)), it();
}
function po(t, n, e) {
  Se.value[t].x = Math.round(n), Se.value[t].y = Math.round(e), it();
}
function wo(t, n, e) {
  Se.value[t].w = Math.round(n), Se.value[t].h = Math.round(e), it();
}
function $o(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - mt * (l + 1)) / l), s = Math.floor((n - mt * (a + 1)) / a), h = {};
  return e.forEach((d, c) => {
    const u = c % l, m = Math.floor(c / l);
    h[d] = {
      x: mt + u * (r + mt),
      y: mt + m * (s + mt),
      w: r,
      h: s,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: c + 1
    };
  }), h;
}
function On() {
  return {
    containers: Se,
    TITLEBAR_H: sn,
    load: fo,
    save: it,
    reset: vo,
    bringToFront: $n,
    setVisible: ho,
    setMinimized: mo,
    setMaximized: go,
    updatePos: po,
    updateSize: wo
  };
}
const yo = { class: "ws-toolbar" }, xo = {
  key: 0,
  class: "ws-restore-menu"
}, bo = {
  key: 0,
  class: "ws-restore-empty"
}, Mo = ["onClick"], So = /* @__PURE__ */ Qe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = On(), s = Y(null);
    Cn("cathodeWorkspace", s), Cn("cathodeResetTick", mn), Ne(() => {
      if (!s.value) return;
      const { clientWidth: i, clientHeight: w } = s.value, T = n.initialLayout ?? {};
      l(T, n.storageKey ?? "cathode.layout");
      const D = Object.keys(e.value)[0];
      D && h(D);
    });
    function h(i) {
      var T;
      document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused"));
      const w = (T = s.value) == null ? void 0 : T.querySelector(`#cc-${i}`);
      w && w.classList.add("cc-focused");
    }
    function d() {
      !s.value || !n.initialLayout || a(n.initialLayout);
    }
    function c(i) {
      const w = i.target.closest(".cc");
      w && (document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused")), w.classList.add("cc-focused"));
    }
    const u = Y(!1), m = () => Object.entries(e.value).filter(([, i]) => !i.visible).map(([i]) => i);
    function g(i) {
      r(i, !0), u.value = !1;
    }
    function k(i) {
      if (!u.value) return;
      const w = i.target;
      !w.closest(".ws-restore-menu") && !w.closest(".ws-btn-restore") && (u.value = !1);
    }
    function S(i) {
      i.key === "Escape" && (u.value = !1);
    }
    Ne(() => {
      document.addEventListener("click", k), document.addEventListener("keydown", S);
    }), et(() => {
      document.removeEventListener("click", k), document.removeEventListener("keydown", S);
    });
    function E(i) {
      var w;
      return ((w = n.containerTitles) == null ? void 0 : w[i]) ?? i;
    }
    return (i, w) => (ye(), xe("div", {
      ref_key: "workspaceEl",
      ref: s,
      class: "cathode-workspace",
      onMousedown: c
    }, [
      on(i.$slots, "default", {}, void 0, !0),
      on(i.$slots, "overlay", {}, void 0, !0),
      ve("div", yo, [
        t.initialLayout ? (ye(), xe("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: d
        }, " ↺ Reset Layout ")) : Oe("", !0),
        w[1] || (w[1] = ve("div", { class: "ws-sep" }, null, -1)),
        ve("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: w[0] || (w[0] = (T) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      An(ol, { name: "menu" }, {
        default: al(() => [
          u.value ? (ye(), xe("div", xo, [
            w[3] || (w[3] = ve("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? Oe("", !0) : (ye(), xe("div", bo, " No closed panels ")),
            (ye(!0), xe(rl, null, il(m(), (T) => (ye(), xe("div", {
              key: T,
              class: "ws-restore-item",
              onClick: (D) => g(T)
            }, [
              w[2] || (w[2] = ve("span", { class: "ws-restore-icon" }, "⊞", -1)),
              sl(" " + ze(E(T)), 1)
            ], 8, Mo))), 128))
          ])) : Oe("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Oo = /* @__PURE__ */ tt(So, [["__scopeId", "data-v-5838d04b"]]), To = ["id"], Co = { class: "cc-title" }, ko = {
  key: 0,
  class: "cc-size-badge"
}, Io = { class: "cc-controls" }, Lo = ["title"], Ro = { class: "cc-body" }, Eo = 200, Do = 80, Fn = 60, Fo = /* @__PURE__ */ Qe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: s, updatePos: h, updateSize: d } = On(), c = Ht("cathodeWorkspace", Y(null)), u = le(() => e.value[n.id]), m = le(() => {
      const v = u.value, C = n.curvature ?? 0;
      if (!v) return {};
      const L = { "--curvature": Math.abs(C) };
      return v.maximized ? { ...L, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: v.zIndex } : {
        ...L,
        left: v.x + "px",
        top: v.y + "px",
        width: v.w + "px",
        height: v.minimized ? sn + "px" : v.h + "px",
        zIndex: v.zIndex,
        display: v.visible ? "flex" : "none"
      };
    });
    let g = !1, k = 0, S = 0;
    function E(v) {
      var B;
      if (v.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), g = !0;
      const C = (B = c.value) == null ? void 0 : B.querySelector(`#cc-${n.id}`);
      if (!C) return;
      const L = C.getBoundingClientRect();
      k = v.clientX - L.left, S = v.clientY - L.top, document.addEventListener("mousemove", i), document.addEventListener("mouseup", w), v.preventDefault();
    }
    function i(v) {
      var $;
      if (!g || !c.value) return;
      const C = c.value.getBoundingClientRect(), L = (($ = u.value) == null ? void 0 : $.w) ?? 300;
      let B = v.clientX - C.left - k, W = v.clientY - C.top - S;
      B = Math.max(Fn - L, Math.min(C.width - Fn, B)), W = Math.max(0, Math.min(C.height - sn, W)), h(n.id, B, W);
    }
    function w() {
      g = !1, document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", w);
    }
    let T = !1, D = 0, X = 0, M = 0, y = 0;
    const I = Y("");
    function U(v) {
      u.value.maximized || (l(n.id), T = !0, D = v.clientX, X = v.clientY, M = u.value.w, y = u.value.h, document.addEventListener("mousemove", j), document.addEventListener("mouseup", te), v.preventDefault(), v.stopPropagation());
    }
    function j(v) {
      if (!T) return;
      const C = Math.max(Eo, M + (v.clientX - D)), L = Math.max(Do, y + (v.clientY - X));
      d(n.id, C, L), I.value = `${Math.round(C)}×${Math.round(L)}`;
    }
    function te() {
      T = !1, I.value = "", document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", te), q.value++;
    }
    const q = Y(0);
    K(mn, () => {
      q.value++;
    }), et(() => {
      var v;
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", w), document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", te), (v = ee.value) == null || v.removeEventListener("scroll", V), N();
    });
    const ee = Y(null);
    function Z(v) {
      if (n.canvas) return [];
      const C = v.children[0];
      return C ? Array.from(C.children) : [];
    }
    function V() {
      const v = ee.value, C = n.curvature ?? 0;
      if (!v) return;
      const L = Z(v);
      if (!L.length) return;
      const B = v.clientHeight, W = B / 2, $ = C * 38e-4;
      L.forEach((O) => {
        if (!O.dataset.origFs) {
          const Ie = getComputedStyle(O);
          O.dataset.origFs = Ie.fontSize, O.dataset.origLh = Ie.lineHeight;
        }
        if (C === 0) {
          O.style.fontSize = "", O.style.lineHeight = "";
          return;
        }
        const he = O.getBoundingClientRect(), ie = v.getBoundingClientRect(), me = he.top - ie.top + he.height / 2, ke = Math.min(1, Math.abs(me - W) / (B / 2)), ae = 1 + $ * Math.cos(ke * Math.PI / 2), A = parseFloat(O.dataset.origFs), G = O.dataset.origLh, se = G === "normal" ? A * 1.4 : parseFloat(G);
        isNaN(A) || (O.style.fontSize = `${(A * ae).toFixed(2)}px`), isNaN(se) || (O.style.lineHeight = `${(se * ae).toFixed(2)}px`);
      });
    }
    function N() {
      const v = ee.value;
      v && Z(v).forEach((C) => {
        C.style.fontSize = "", C.style.lineHeight = "", delete C.dataset.origFs, delete C.dataset.origLh;
      });
    }
    K(() => n.curvature, (v) => {
      (v ?? 0) === 0 ? N() : V();
    }), Ne(() => {
      var v;
      (v = ee.value) == null || v.addEventListener("scroll", V, { passive: !0 }), _e(V);
    });
    function ue() {
      r(n.id, !u.value.minimized), _e(() => {
        q.value++;
      });
    }
    function re() {
      s(n.id, !u.value.maximized), _e(() => {
        q.value++;
      });
    }
    function oe() {
      a(n.id, !1);
    }
    function p() {
      l(n.id);
    }
    return (v, C) => u.value && u.value.visible ? (ye(), xe("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: cl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ke(m.value),
      onMousedown: p
    }, [
      ve("div", {
        class: "cc-titlebar",
        onMousedown: E
      }, [
        C[0] || (C[0] = ve("span", { class: "cc-status-dot" }, null, -1)),
        ve("span", Co, ze(t.title), 1),
        I.value ? (ye(), xe("span", ko, ze(I.value), 1)) : Oe("", !0),
        ve("div", Io, [
          ve("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: at(ue, ["stop"])
          }, "─"),
          ve("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: at(re, ["stop"])
          }, ze(u.value.maximized ? "⤡" : "⤢"), 9, Lo),
          ve("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: at(oe, ["stop"])
          }, "✕")
        ])
      ], 32),
      _n(ve("div", Ro, [
        ve("div", {
          ref_key: "bodyEl",
          ref: ee,
          class: "cc-screen",
          onScroll: V
        }, [
          on(v.$slots, "default", { resizeKey: q.value }, void 0, !0),
          C[1] || (C[1] = ve("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ul, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (ye(), xe("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: at(U, ["stop"])
      }, null, 32)) : Oe("", !0)
    ], 46, To)) : Oe("", !0);
  }
}), No = /* @__PURE__ */ tt(Fo, [["__scopeId", "data-v-ca0af4ca"]]), Ao = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, _o = `
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
`, Bo = 100, Wo = /* @__PURE__ */ Qe({
  __name: "CathodeLoader",
  props: {
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    label: { default: "BOOTING" }
  },
  setup(t) {
    const n = t, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, l = Y(null), a = Y(null);
    let r = null, s = !1;
    function h() {
      if (r) {
        try {
          r.forceContextLoss();
        } catch {
        }
        try {
          r.dispose();
        } catch {
        }
        r = null;
      }
    }
    let d, c, u, m, g, k = null, S = 0;
    function E(y) {
      y - S >= Bo && (T(), S = y), k = requestAnimationFrame(E);
    }
    function i() {
      if (!l.value || !g) return;
      const y = l.value.clientWidth, I = l.value.clientHeight;
      y <= 0 || I <= 0 || g.width === y && g.height === I || (g.width = y, g.height = I, r && r.setSize(y, I, !1), a.value && (a.value.width = y, a.value.height = I, a.value.style.width = y + "px", a.value.style.height = I + "px"));
    }
    function w() {
      if (!(g != null && g.width)) return;
      const y = g.getContext("2d");
      if (!y) return;
      const I = g.width, U = g.height, j = e[n.theme] ?? e.none;
      y.clearRect(0, 0, I, U), y.fillStyle = j.bg, y.fillRect(0, 0, I, U);
      const te = Date.now(), q = (te / 500 | 0) % 2 === 0, ee = (te / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(I, U) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = j.text, n.glow && (y.shadowColor = j.text, y.shadowBlur = 14);
      const Z = ".".repeat(ee).padEnd(3, " "), V = `${n.label}${Z}`;
      if (y.fillText(V, I / 2, U / 2), y.shadowBlur = 0, q) {
        const N = y.measureText(V), ue = y.measureText("M").width, re = parseFloat(y.font), oe = I / 2 + N.width / 2 + 4, p = U / 2 - re / 2 + 2;
        y.fillStyle = j.cursor, n.glow && (y.shadowColor = j.cursor, y.shadowBlur = 12), y.fillRect(oe, p, ue * 0.7, re * 0.95), y.shadowBlur = 0;
      }
    }
    function T() {
      if (!g) return;
      if (w(), s) {
        if (!a.value) return;
        const I = a.value.getContext("2d");
        I && I.drawImage(g, 0, 0);
        return;
      }
      if (!r || !u || !m) return;
      const y = n.theme === "paper";
      u.uniforms.uStrength.value = Ze(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, m.needsUpdate = !0, r.render(d, c);
    }
    function D() {
      if (!(!a.value || !l.value)) {
        g = document.createElement("canvas");
        try {
          r = new z.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          s = !0;
        }
        if (!s && !r.getContext() && (r.dispose(), r = null, s = !0), s) {
          i();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), d = new z.Scene(), c = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new z.CanvasTexture(g), m.minFilter = z.LinearFilter, m.magFilter = z.LinearFilter, u = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ao,
          fragmentShader: _o,
          transparent: !0
        }), d.add(new z.Mesh(new z.PlaneGeometry(2, 2), u)), i();
      }
    }
    let X = null;
    Ne(() => {
      D(), T(), k = requestAnimationFrame(E), l.value && (X = new ResizeObserver(() => i()), X.observe(l.value));
    }), et(() => {
      k !== null && cancelAnimationFrame(k), X == null || X.disconnect(), h(), m == null || m.dispose(), u == null || u.dispose();
    }), K(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => T());
    const M = le(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (y, I) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ke(M.value)
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Xo = /* @__PURE__ */ tt(Wo, [["__scopeId", "data-v-d00e5f47"]]);
export {
  gt as CANDLE_THEME_COLORS,
  zo as CathodeCandle,
  Vo as CathodeCandleGrid,
  No as CathodeContainer,
  Po as CathodeGrid,
  Xo as CathodeLoader,
  Wl as CathodeLog,
  Ho as CathodeTerminal,
  Oo as CathodeWorkspace,
  Wt as LOG_THEME_COLORS,
  $o as buildDefaultLayout,
  On as useCathodeLayout
};
