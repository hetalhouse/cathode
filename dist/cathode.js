import { defineComponent as je, ref as z, reactive as tn, watch as Q, nextTick as De, computed as se, inject as Et, onMounted as Ne, onUnmounted as Ze, openBlock as Te, createElementBlock as Ce, normalizeStyle as Ue, createElementVNode as ve, withModifiers as it, withKeys as En, createCommentVNode as Ge, toDisplayString as Oe, createVNode as Hn, withDirectives as zn, vModelText as ul, provide as Dn, renderSlot as fn, Transition as fl, withCtx as dl, Fragment as vl, renderList as hl, createTextVNode as ml, normalizeClass as gl, vShow as pl } from "vue";
import * as Y from "three";
const et = {
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
}, Le = 30, dn = 12, wl = 10, Ot = 14, Vn = 5;
function Nt() {
  return `${dn}px system-ui, -apple-system, sans-serif`;
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
function yl(n, t) {
  return Math.max(t, n * Ot + Vn * 2);
}
function gn(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let l = 0; l < t; l++) e[l + 1] = e[l] + (n[l] ?? 0);
  return e;
}
function Xt(n, t) {
  if (t <= 0) return 0;
  let e = 0, l = n.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    n[a] <= t ? e = a : l = a - 1;
  }
  return e;
}
const Nn = 28;
function xl(n, t) {
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
  const a = n.width / l, s = n.height / l, o = et[t.theme] ?? et.none, { cols: d, rows: c, pinnedRows: f, rowHeight: u, scrollY: p, scrollX: m, glow: x } = t;
  e.clearRect(0, 0, a, s), e.fillStyle = o.bg, e.fillRect(0, 0, a, s), e.save(), e.beginPath(), e.rect(0, 0, a, s), e.clip();
  const k = f.length * u, T = t.aggregateRow ? Nn : 0, v = s - Le - k - T;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, a, Le), e.textBaseline = "middle", e.textAlign = "left";
  let h = -m;
  for (let i = 0; i < d.length; i++) {
    const w = d[i];
    if (h + w.width <= 0) {
      h += w.width;
      continue;
    }
    if (h >= a) break;
    const B = !!t.colFilters[w.colId], C = t.sortColId === w.colId, H = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, w.width, Le), e.clip(), e.font = `bold ${wl}px system-ui, -apple-system, sans-serif`, e.fillStyle = B ? o.accent : o.textHeader, x ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText(H, h + 8, Le / 2), e.shadowBlur = 4, e.fillText(H, h + 8, Le / 2), e.shadowBlur = 0) : e.fillText(H, h + 8, Le / 2), C) {
      const O = e.measureText(H).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent, e.fillText(t.sortDir === "asc" ? "▲" : "▼", h + 8 + O + 4, Le / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = B ? o.accent : o.textHeader, e.globalAlpha = B ? 1 : 0.38, e.fillText("⌕", h + w.width - 20, Le / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(h + w.width - 0.5, 0), e.lineTo(h + w.width - 0.5, Le), e.stroke(), h += w.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Le - 0.5), e.lineTo(a, Le - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Le, a, v), e.clip();
  const L = t.rowHeights && t.rowHeights.length === c.length ? t.rowHeights : null, I = L ? gn(L, c.length) : null, W = (i) => I ? I[i] : i * u, M = (i) => L ? L[i] : u, y = I ? Xt(I, p) : Math.max(0, Math.floor(p / u));
  let R;
  if (I)
    for (R = y; R < c.length && W(R) < p + v; ) R++;
  else
    R = Math.min(c.length, Math.ceil((p + v) / u));
  const N = t.selectionAnchorRow ?? t.selectedRow, E = t.selectionAnchorCol ?? t.selectedCol, Z = t.selectedRow >= 0 && N >= 0 ? Math.min(t.selectedRow, N) : -1, q = t.selectedRow >= 0 && N >= 0 ? Math.max(t.selectedRow, N) : -1, V = t.selectedCol >= 0 && E >= 0 ? Math.min(t.selectedCol, E) : -1, J = t.selectedCol >= 0 && E >= 0 ? Math.max(t.selectedCol, E) : -1, $ = q > Z || J > V;
  let _ = Number.POSITIVE_INFINITY, te = Number.NEGATIVE_INFINITY, ne = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY;
  const j = (i, w, B, C) => {
    x ? (e.shadowColor = C, e.shadowBlur = 12, e.fillText(i, w, B), e.shadowBlur = 6, e.fillText(i, w, B), e.shadowBlur = 2, e.fillText(i, w, B), e.shadowBlur = 0) : e.fillText(i, w, B);
  };
  for (let i = y; i < R; i++) {
    const w = c[i], B = M(i), C = Le + W(i) - p;
    i % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, C, a, B));
    const H = i >= Z && i <= q;
    i === t.hoveredRow && !H && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, C, a, B)), H && !$ && (e.fillStyle = nn(o.accent, 0.1), e.fillRect(0, C, a, B)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, C + B - 0.5), e.lineTo(a, C + B - 0.5), e.stroke();
    let O = -m;
    for (let X = 0; X < d.length; X++) {
      const le = d[X];
      if (O + le.width <= 0) {
        O += le.width;
        continue;
      }
      if (O >= a) break;
      const oe = H && X >= V && X <= J;
      oe && $ && (e.fillStyle = nn(o.accent, 0.14), e.fillRect(O, C, le.width, B)), oe && (O < _ && (_ = O), O + le.width > te && (te = O + le.width), C < ne && (ne = C), C + B > ee && (ee = C + B));
      const ge = t.getCellStyle(le, w), ke = ge.color ?? o.text, ce = ge.textAlign ?? "left", A = t.formatCell(le, w);
      if (e.save(), e.beginPath(), e.rect(O + 1, C, le.width - 2, B), e.clip(), e.font = Nt(), e.fillStyle = ke, e.textBaseline = "middle", le.colDef.wrap) {
        e.textAlign = "left";
        const K = On(e, A, Math.max(20, le.width - 16));
        let ie = C + Vn + Ot / 2;
        for (const Se of K) {
          if (ie - Ot / 2 >= C + B) break;
          j(Se, O + 8, ie, ke), ie += Ot;
        }
      } else {
        const K = ce === "right" ? O + le.width - 8 : O + 8;
        e.textAlign = ce === "right" ? "right" : "left", j(A, K, C + B / 2, ke);
      }
      e.restore(), i === t.selectedRow && X === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(O + 1.5, C + 1.5, le.width - 3, B - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(O + le.width - 0.5, C), e.lineTo(O + le.width - 0.5, C + B), e.stroke(), O += le.width;
    }
  }
  if ($ && _ < te && ne < ee && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(_ + 0.5, ne + 0.5, te - _ - 1, ee - ne - 1)), e.restore(), f.length > 0) {
    const i = s - k - T;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(a, i - 0.5), e.stroke();
    for (let w = 0; w < f.length; w++) {
      const B = f[w], C = i + w * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, C, a, u);
      let H = -m;
      for (let O = 0; O < d.length; O++) {
        const X = d[O];
        if (H + X.width <= 0) {
          H += X.width;
          continue;
        }
        if (H >= a) break;
        const le = t.getCellStyle(X, B), oe = le.color ?? o.text, ge = le.textAlign ?? "left", ke = t.formatCell(X, B);
        e.save(), e.beginPath(), e.rect(H + 1, C, X.width - 2, u), e.clip(), e.font = `bold ${dn}px system-ui, -apple-system, sans-serif`, e.fillStyle = oe, e.textBaseline = "middle", ge === "right" ? (e.textAlign = "right", e.fillText(ke, H + X.width - 8, C + u / 2)) : (e.textAlign = "left", e.fillText(ke, H + 8, C + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(H + X.width - 0.5, C), e.lineTo(H + X.width - 0.5, C + u), e.stroke(), H += X.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, C + u - 0.5), e.lineTo(a, C + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const i = s - T;
    e.fillStyle = nn(o.accent, 0.1), e.fillRect(0, i, a, T), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(a, i - 0.5), e.stroke();
    let w = -m;
    for (let B = 0; B < d.length; B++) {
      const C = d[B];
      if (w + C.width <= 0) {
        w += C.width;
        continue;
      }
      if (w >= a) break;
      const O = t.getCellStyle(C, t.aggregateRow).textAlign ?? "left", X = t.aggregateRow[C.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, i, C.width - 2, T), e.clip(), e.font = `bold ${dn}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", x && (e.shadowColor = o.accent, e.shadowBlur = 8), O === "right" ? (e.textAlign = "right", e.fillText(X, w + C.width - 8, i + T / 2)) : (e.textAlign = "left", e.fillText(X, w + 8, i + T / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + C.width - 0.5, i), e.lineTo(w + C.width - 0.5, i + T), e.stroke(), w += C.width;
    }
  }
  e.restore();
}
function nn(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), a = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${t})`;
}
const Ht = 190, ln = 34;
function bl(n, t, e) {
  const l = Math.max(4, Math.min(t, n - Ht - 4)), a = Le + 6, s = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: Ht, h: ln },
    input: { x: l + 9, y: a + 5, w: Ht - 18 - s, h: ln - 10 },
    clear: e ? { x: l + Ht - 28, y: a, w: 28, h: ln } : null
  };
}
const an = (n, t, e, l = 0) => n >= e.x - l && n <= e.x + e.w + l && t >= e.y && t <= e.y + e.h;
function zt(n, t, e, l = 1) {
  return e.clear && an(n, t, e.clear, 4 * (l - 1)) ? "clear" : an(n, t, e.input) ? "input" : an(n, t, e.box) ? "inside" : "outside";
}
function Sl(n, t, e, l, a) {
  const { box: s, input: o, clear: d } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = a.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(o.x, o.y, o.w, o.h, 3), n.fill(), n.beginPath(), n.rect(o.x, o.y, o.w, o.h), n.clip(), n.font = Nt(), n.textBaseline = "middle";
  const c = o.y + o.h / 2 + 1, f = 5;
  if (e) {
    n.fillStyle = a.text;
    const u = n.measureText(e).width, p = u > o.w - 2 * f - 2 ? o.x + o.w - f - 2 - u : o.x + f;
    n.fillText(e, p, c), l && (n.fillStyle = a.accent, n.fillRect(Math.min(p + u + 1, o.x + o.w - f), o.y + 4, 1.5, o.h - 8));
  } else
    n.fillStyle = a.textHeader, n.fillText("Filter…", o.x + f, c), l && (n.fillStyle = a.accent, n.fillRect(o.x + f, o.y + 4, 1.5, o.h - 8));
  n.restore(), d && (n.save(), n.font = Nt(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = a.textHeader, n.fillText("✕", d.x + d.w / 2, d.y + d.h / 2 + 1), n.restore());
}
function Ml(n, t, e) {
  const l = n - 0.5, a = t - 0.5, s = Math.abs(e), o = (l * l + a * a) * s;
  if (e < 0) {
    const f = 0.5 * s, p = 1 / (1 - 2 * (0.5 * (1 + f) * f)), m = (l + l * (1 + o) * o * -1) * p, x = (a + a * (1 + o) * o * -1) * p;
    return [0.5 + m, 0.5 + x];
  }
  const d = l * (1 + o) * o, c = a * (1 + o) * o;
  return [n + d, t + c * 0.15];
}
function Xn(n, t, e, l, a, s = e, o = l) {
  const d = n / e, c = 1 - t / l, [f, u] = Ml(d, c, a);
  return f < 0 || f > 1 || u < 0 || u > 1 ? [-1, -1] : [f * s, (1 - u) * o];
}
function on(n, t) {
  let e = 0;
  for (let l = 0; l < n; l++) e += t[l].width;
  return e;
}
function Tl(n, t, e, l = 1) {
  return n >= t + e - 24 * l && n < t + e;
}
function An(n, t, e, l = 1) {
  const a = t + e;
  return n >= a - 6 * l && n <= a + 1 * l;
}
function _n(n, t, e, l, a, s, o, d, c, f = !1, u) {
  const p = n + c;
  let m = -1, x = 0;
  for (let L = 0; L < e.length; L++) {
    if (p >= x && p < x + e[L].width) {
      m = L;
      break;
    }
    x += e[L].width;
  }
  if (t < Le) return { area: "header", colIdx: m, rowIdx: -1 };
  const k = f ? Nn : 0;
  if (k > 0 && t >= o - k)
    return { area: "agg", colIdx: m, rowIdx: -1 };
  const T = d * a;
  if (T > 0 && t >= o - T - k) {
    const L = Math.floor((t - (o - T - k)) / a);
    return { area: "pinned", colIdx: m, rowIdx: L };
  }
  const v = t - Le + s, h = u && u.length === l ? Xt(gn(u, l), v) : Math.floor(v / a);
  return h >= 0 && h < l ? { area: "body", colIdx: m, rowIdx: h } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function Ke(n) {
  return n / 45 * 0.55;
}
function Un(n) {
  const t = Math.abs(Ke(n));
  if (t === 0) return 1;
  if (n < 0) {
    const l = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const Cl = 500, kl = Cl / 2, Ll = 1.6, Dt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Ft = `
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
`, At = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function _t() {
  return {
    uMouseUV: { value: new Y.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Ll },
    uLensTint: { value: new Y.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const me = { x: -999, y: -999 };
function Bt(n, t, e, l, a) {
  const s = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = s && a > 0 ? kl / a : 0, n.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function Wt(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const Rl = ["value"], Il = ["disabled"], El = ["disabled"], Dl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Fl = 28, Al = 600, _l = /* @__PURE__ */ je({
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
    const e = n, l = t, a = z(e.rowData ?? []), s = z(e.pinnedBottomRowData ?? []), o = z(""), d = z(null), c = tn({}), f = tn({}), u = tn(/* @__PURE__ */ new Set()), p = z(0), m = z(0), x = z(0), k = z(0), T = z(0), v = z(0), h = z(0), L = z(-1), I = z(null), W = z(null), M = z(null), y = { ...me }, R = z(""), N = z(0), E = z(null);
    let Z = null;
    const q = z(!0);
    let V = null;
    Q(M, (r) => {
      var g;
      V && (clearInterval(V), V = null), r ? (q.value = !0, V = setInterval(() => {
        q.value = !q.value, be();
      }, 530), De(() => {
        var b;
        return (b = E.value) == null ? void 0 : b.focus();
      })) : (Z = null, (g = E.value) == null || g.blur()), be();
    });
    function J(r) {
      return r.colId ?? r.field ?? (r.headerName ? r.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const $ = se(() => {
      const r = e.defaultColDef ?? {};
      return e.columnDefs.filter((g) => !u.has(J(g))).map((g) => {
        const b = J(g), F = { ...r, ...g };
        return { colId: b, colDef: F, width: f[b] ?? F.width ?? 100 };
      });
    }), _ = se(() => {
      const r = m.value;
      if (!r) return $.value;
      const g = $.value.reduce((D, P) => D + P.width, 0);
      if (!g || g >= r) return $.value;
      const b = r / g;
      let F = 0;
      return $.value.map((D, P) => {
        const de = P === $.value.length - 1 ? r - F : Math.max(8, Math.round(D.width * b));
        return F += de, { ...D, width: de };
      });
    }), te = se(() => {
      const r = _.value.reduce((g, b) => g + b.width, 0);
      return Math.max(0, r - m.value);
    });
    let ne = null;
    function ee() {
      if (typeof document > "u") return null;
      ne || (ne = document.createElement("canvas"));
      const r = ne.getContext("2d");
      return r && (r.font = Nt()), r;
    }
    const j = se(() => _.value.some((r) => r.colDef.wrap)), i = se(() => {
      if (!j.value) return null;
      const r = ee();
      if (!r) return null;
      const g = _.value.filter((F) => F.colDef.wrap), b = e.rowHeight;
      return ce.value.map((F) => {
        let D = 1;
        for (const P of g) {
          const G = On(r, ge(P, F), Math.max(20, P.width - 16));
          G.length > D && (D = G.length);
        }
        return yl(D, b);
      });
    }), w = se(
      () => i.value ? gn(i.value, ce.value.length) : null
    ), B = se(
      () => w.value ? w.value[ce.value.length] : ce.value.length * e.rowHeight
    ), C = se(() => {
      const r = s.value.length * e.rowHeight;
      return Math.max(0, x.value - Le - r);
    }), H = se(
      () => Math.max(0, B.value - C.value)
    ), O = se(
      () => Math.max(1, Math.floor(C.value / e.rowHeight))
    ), X = se(() => {
      const r = ce.value.length;
      if (r === 0) return 0;
      const g = w.value ? Xt(w.value, v.value) : Math.floor(v.value / e.rowHeight);
      return Math.min(r - 1, g);
    }), le = se(() => {
      const r = ce.value.length;
      return r === 0 ? 0 : w.value ? Math.min(r - 1, Xt(w.value, v.value + C.value - 1)) : Math.min(r - 1, X.value + O.value - 1);
    });
    function oe(r, g) {
      if (g.colDef.valueGetter) return g.colDef.valueGetter({ data: r, colDef: g.colDef });
      if (g.colDef.field) return r[g.colDef.field];
    }
    function ge(r, g) {
      const b = oe(g, r);
      return r.colDef.valueFormatter ? r.colDef.valueFormatter({ value: b, data: g, colDef: r.colDef }) ?? "" : r.colDef.cellRenderer ? (r.colDef.cellRenderer({ value: b, data: g, colDef: r.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function ke(r, g) {
      return r.colDef.cellStyle ? typeof r.colDef.cellStyle == "function" ? r.colDef.cellStyle({ value: oe(g, r), data: g, colDef: r.colDef }) ?? {} : r.colDef.cellStyle : {};
    }
    const ce = se(() => {
      p.value;
      let r = a.value;
      const g = o.value.trim().toLowerCase();
      g && (r = r.filter(
        (b) => $.value.some(
          (F) => String(oe(b, F) ?? "").toLowerCase().includes(g)
        )
      ));
      for (const [b, F] of Object.entries(c)) {
        if (!F) continue;
        const D = $.value.find((P) => P.colId === b);
        if (D)
          if (F.startsWith("__eq__")) {
            const P = F.slice(6).toLowerCase();
            r = r.filter((G) => String(oe(G, D) ?? "").toLowerCase() === P);
          } else {
            const P = F.toLowerCase();
            r = r.filter((G) => String(oe(G, D) ?? "").toLowerCase().includes(P));
          }
      }
      if (d.value) {
        const { colId: b, dir: F } = d.value, D = $.value.find((P) => P.colId === b);
        D && (r = [...r].sort((P, G) => {
          const de = oe(P, D), ue = oe(G, D);
          let we = 0;
          return D.colDef.comparator ? we = D.colDef.comparator(de, ue) : typeof de == "number" && typeof ue == "number" ? we = de - ue : we = String(de ?? "").localeCompare(String(ue ?? ""), void 0, { numeric: !0 }), F === "asc" ? we : -we;
        }));
      }
      return r;
    }), A = se(() => {
      const r = $.value.filter((D) => D.colDef.aggFunc != null);
      if (r.length === 0) return null;
      const g = ce.value, b = {};
      for (const D of r) {
        const P = g.map((de) => oe(de, D)), G = xl(P, D.colDef.aggFunc);
        if (G == null) {
          b[D.colId] = "";
          continue;
        }
        b[D.colId] = D.colDef.aggValueFormatter ? D.colDef.aggValueFormatter(G) : String(G);
      }
      const F = r[0].colId;
      return b[F] === "" && (b[F] = "Σ"), b;
    });
    Q(ce, () => {
      v.value = 0, I.value = null;
    }), Q(te, () => {
      h.value = Math.min(h.value, te.value);
    }), Q(H, () => {
      v.value = Math.min(v.value, H.value);
    });
    function K(r) {
      const g = w.value, b = g ? g[r] : r * e.rowHeight, F = g ? g[r + 1] : b + e.rowHeight;
      b < v.value ? v.value = b : F > v.value + C.value && (v.value = Math.min(H.value, F - C.value));
    }
    function ie() {
      v.value = Math.max(0, v.value - C.value), be();
    }
    function Se() {
      v.value = Math.min(H.value, v.value + C.value), be();
    }
    let xe = !1, ze = "", ut = 0, ft = 0, at = 1, Fe = !1, Ae = !1, _e = 0, Be = 0, Qe = 0, dt = 0, Ee = !1;
    function Pt(r, g, b = 1) {
      var F;
      xe = !0, ze = r, ut = g, at = b, ft = ((F = _.value.find((D) => D.colId === r)) == null ? void 0 : F.width) ?? 100, Fe = !1;
    }
    function yt(r) {
      if (Ae) {
        const P = _e - r.clientX, G = Be - r.clientY;
        (Math.abs(P) > 4 || Math.abs(G) > 4) && (Ee = !0), h.value = Math.max(0, Math.min(te.value, Qe + P)), v.value = Math.max(0, Math.min(H.value, dt + G)), be();
        return;
      }
      if (!xe) return;
      const g = m.value, b = Math.max(30, ft + (r.clientX - ut) * at), F = $.value.filter((P) => P.colId !== ze).reduce((P, G) => P + G.width, 0), D = g - b;
      D > 10 && (f[ze] = Math.max(10, Math.round(b * F / D))), be();
    }
    function Yt() {
      Ae && (Ee && (Fe = !0), Ae = !1), xe && (xe = !1, Fe = !0, l("column-resized"));
    }
    function jt(r) {
      if (r.touches.length !== 1) return;
      const g = r.touches[0];
      Ae = !0, Ee = !1, _e = g.clientX, Be = g.clientY, Qe = h.value, dt = v.value;
    }
    function S(r) {
      if (!Ae || r.touches.length !== 1) return;
      r.preventDefault();
      const g = r.touches[0], b = _e - g.clientX, F = Be - g.clientY;
      (Math.abs(b) > 4 || Math.abs(F) > 4) && (Ee = !0), h.value = Math.max(0, Math.min(te.value, Qe + b)), v.value = Math.max(0, Math.min(H.value, dt + F)), be();
    }
    function U() {
      Ae && (Ee && (Fe = !0), Ae = !1);
    }
    const ae = z(null), re = z(null), Xe = Et("cathodeResetTick", z(0));
    Q(Xe, () => ht());
    let pe = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), fe = null, We = !1;
    function ot() {
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
    let Zt, Sn, Ve, Pe, he;
    const Zn = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Dt}

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

  ${Ft}

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

    ${At}

    gl_FragColor = color;
  }
`;
    function Mn() {
      if (!(!re.value || !ae.value)) {
        he = document.createElement("canvas");
        try {
          fe = new Y.WebGLRenderer({ canvas: re.value, antialias: !1, alpha: !0 });
        } catch {
          We = !0;
        }
        if (!We && !fe.getContext() && (fe.dispose(), fe = null, We = !0), We) {
          vt();
          return;
        }
        fe.setPixelRatio(1), fe.setClearColor(0, 0), Zt = new Y.Scene(), Sn = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), Pe = new Y.CanvasTexture(he), Pe.minFilter = Y.LinearFilter, Pe.magFilter = Y.LinearFilter, Ve = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: Pe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new Y.Color(0) },
            ..._t()
          },
          vertexShader: Dl,
          fragmentShader: Zn,
          transparent: !0
        }), Zt.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), Ve)), vt();
      }
    }
    function vt() {
      if (!ae.value || !fe && !We) return;
      const r = ae.value.clientWidth, g = ae.value.clientHeight - (e.pagination ? Fl : 0);
      if (!r || !g) return;
      k.value = r, T.value = g;
      const b = e.bendField ? Math.round(r * Un(e.curvature)) : r;
      pe = Math.min(window.devicePixelRatio || 1, 2);
      const F = Math.round(b * pe), D = Math.round(g * pe), P = he.width !== F || he.height !== D;
      he.width = F, he.height = D, m.value = b, x.value = g, h.value = Math.max(0, Math.min(te.value, h.value)), v.value = Math.max(0, Math.min(H.value, v.value)), fe ? (P && Pe && (Pe.dispose(), Pe = new Y.CanvasTexture(he), Pe.minFilter = Y.LinearFilter, Pe.magFilter = Y.LinearFilter, Ve && (Ve.uniforms.uTex.value = Pe)), fe.setPixelRatio(pe), fe.setSize(r, g)) : re.value && (re.value.width = Math.round(r * pe), re.value.height = Math.round(g * pe), re.value.style.width = r + "px", re.value.style.height = g + "px"), be();
    }
    function be() {
      var b, F, D, P, G, de, ue, we, Ye, Mt, Tt, mt;
      if (!(he != null && he.width)) return;
      if (We) {
        if (!re.value) return;
        Fn(he, {
          cols: _.value,
          rows: ce.value,
          pinnedRows: s.value,
          rowHeight: e.rowHeight,
          rowHeights: i.value ?? void 0,
          scrollY: v.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = d.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((F = d.value) == null ? void 0 : F.dir) ?? null,
          colFilters: c,
          hoveredRow: L.value,
          selectedRow: ((D = I.value) == null ? void 0 : D.row) ?? -1,
          selectedCol: ((P = I.value) == null ? void 0 : P.col) ?? -1,
          selectionAnchorRow: ((G = W.value) == null ? void 0 : G.row) ?? -1,
          selectionAnchorCol: ((de = W.value) == null ? void 0 : de.col) ?? -1,
          formatCell: ge,
          getCellStyle: ke,
          dpr: pe
        }), Tn();
        const Ct = re.value.getContext("2d");
        Ct && Ct.drawImage(he, 0, 0, he.width, he.height, 0, 0, re.value.width, re.value.height);
        return;
      }
      if (!fe || !Ve || !Pe) return;
      const r = et[e.theme] ?? et.none, g = e.theme === "paper";
      Ve.uniforms.uStrength.value = Ke(e.curvature), Ve.uniforms.uScanlines.value = e.scanlines && !g ? 1 : 0, Ve.uniforms.uVignette.value = g ? 0 : 1, Ve.uniforms.uBezel.value.set(r.bg), Bt(Ve, e.magnify, y, k.value || he.width, T.value || he.height), Fn(he, {
        cols: _.value,
        rows: ce.value,
        pinnedRows: s.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: i.value ?? void 0,
        scrollY: v.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((ue = d.value) == null ? void 0 : ue.colId) ?? null,
        sortDir: ((we = d.value) == null ? void 0 : we.dir) ?? null,
        colFilters: c,
        hoveredRow: L.value,
        selectedRow: ((Ye = I.value) == null ? void 0 : Ye.row) ?? -1,
        selectedCol: ((Mt = I.value) == null ? void 0 : Mt.col) ?? -1,
        selectionAnchorRow: ((Tt = W.value) == null ? void 0 : Tt.row) ?? -1,
        selectionAnchorCol: ((mt = W.value) == null ? void 0 : mt.col) ?? -1,
        formatCell: ge,
        getCellStyle: ke,
        aggregateRow: A.value,
        dpr: pe
      }), Tn(), Pe.needsUpdate = !0, fe.render(Zt, Sn);
    }
    function Tn() {
      if (!M.value || !(he != null && he.width)) return;
      const r = he.getContext("2d");
      if (!r) return;
      r.setTransform(pe, 0, 0, pe, 0, 0), Z = bl(he.width / pe, N.value, !!R.value);
      const g = et[e.theme] ?? et.none;
      Sl(r, Z, R.value, q.value, g);
    }
    function Jt(r, g) {
      if (!re.value) return [-1, -1];
      const b = re.value.getBoundingClientRect(), F = r - b.left, D = g - b.top, P = b.width, G = b.height, de = Ke(e.curvature), [ue, we] = Xn(F, D, P, G, de, he.width / pe || P, he.height / pe || G);
      return ue < 0 ? [-1, -1] : [ue, we];
    }
    function $t(r) {
      return Jt(r.clientX, r.clientY);
    }
    function rt(r) {
      if (!re.value) return 1;
      const [g] = Jt(r.clientX - 4, r.clientY), [b] = Jt(r.clientX + 4, r.clientY);
      return g < 0 || b < 0 ? 1 : Math.max(1, Math.abs(b - g) / 8);
    }
    let Qt = 0;
    function Jn(r) {
      M.value = null;
      const g = Date.now();
      if (r.deltaX !== 0) {
        Qt = g, h.value = Math.max(0, Math.min(te.value, h.value + r.deltaX)), be();
        return;
      }
      if (r.shiftKey && r.deltaY !== 0) {
        Qt = g, h.value = Math.max(0, Math.min(te.value, h.value + r.deltaY)), be();
        return;
      }
      g - Qt < Al || (v.value = Math.max(0, Math.min(H.value, v.value + r.deltaY)), be());
    }
    function Qn(r) {
      if (xe) return;
      if (e.magnify && re.value) {
        const D = Wt(r, re.value);
        y.x = D.x, y.y = D.y;
      }
      const [g, b] = $t(r);
      if (g < 0) {
        L.value = -1, be();
        return;
      }
      if (M.value && Z) {
        const D = zt(g, b, Z, rt(r));
        if (D !== "outside") {
          L.value = -1, re.value.style.cursor = D === "clear" ? "pointer" : "text", be();
          return;
        }
      }
      const F = _n(
        g,
        b,
        _.value,
        ce.value.length,
        e.rowHeight,
        v.value,
        x.value,
        s.value.length,
        h.value,
        A.value !== null,
        i.value ?? void 0
      );
      if (L.value = F.area === "body" ? F.rowIdx : -1, F.area === "header" && F.colIdx >= 0) {
        const D = _.value[F.colIdx], P = on(F.colIdx, _.value), G = g + h.value;
        re.value.style.cursor = D && An(G, P, D.width, rt(r)) ? "col-resize" : "pointer";
      } else F.area === "body" ? re.value.style.cursor = "pointer" : re.value.style.cursor = "default";
      be();
    }
    function el() {
      L.value = -1, y.x = me.x, y.y = me.y, be();
    }
    function tl(r) {
      const [g, b] = $t(r);
      if (g < 0 || M.value && Z && zt(g, b, Z, rt(r)) !== "outside") return;
      if (b >= Le) {
        Ae = !0, Ee = !1, _e = r.clientX, Be = r.clientY, Qe = h.value, dt = v.value;
        return;
      }
      const F = g + h.value, D = rt(r);
      for (let P = 0; P < _.value.length; P++) {
        const G = _.value[P], de = on(P, _.value);
        if (G.colDef.resizable !== !1 && An(F, de, G.width, D)) {
          Pt(G.colId, r.clientX, D);
          return;
        }
      }
    }
    function nl(r) {
      var D, P, G, de;
      if (Fe) {
        Fe = !1;
        return;
      }
      if (xe) return;
      const [g, b] = $t(r);
      if (g < 0) {
        M.value = null;
        return;
      }
      if (M.value && Z) {
        const ue = zt(g, b, Z, rt(r));
        if (ue === "clear") {
          kn();
          return;
        }
        if (ue !== "outside") {
          (D = E.value) == null || D.focus();
          return;
        }
        M.value = null;
      }
      const F = _n(
        g,
        b,
        _.value,
        ce.value.length,
        e.rowHeight,
        v.value,
        x.value,
        s.value.length,
        h.value,
        A.value !== null,
        i.value ?? void 0
      );
      if (F.area === "header" && F.colIdx >= 0) {
        const ue = _.value[F.colIdx], we = on(F.colIdx, _.value), Ye = g + h.value;
        ue.colDef.filter && Tl(Ye, we, ue.width, rt(r)) ? (r.stopPropagation(), M.value === ue.colId ? M.value = null : (M.value = ue.colId, R.value = (P = c[ue.colId]) != null && P.startsWith("__eq__") ? c[ue.colId].slice(6) : c[ue.colId] ?? "", N.value = Math.max(0, we - h.value))) : ue.colDef.sortable !== !1 && (M.value = null, d.value = ((G = d.value) == null ? void 0 : G.colId) === ue.colId ? d.value.dir === "asc" ? { colId: ue.colId, dir: "desc" } : null : { colId: ue.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (M.value = null, F.area === "body" && F.rowIdx >= 0 && F.colIdx >= 0) {
        const ue = F.rowIdx;
        r.shiftKey && I.value ? (W.value || (W.value = { ...I.value }), I.value = { row: ue, col: F.colIdx }) : (I.value = { row: ue, col: F.colIdx }, W.value = { row: ue, col: F.colIdx }), (de = re.value) == null || de.focus();
        const we = ce.value[ue], Ye = _.value[F.colIdx];
        we && Ye && (l("row-clicked", { data: we, event: r }), l("cell-selected", { data: we, row: ue, col: F.colIdx, colId: Ye.colId }));
      }
    }
    function Cn(r) {
      if (M.value) {
        if (r.target === re.value && Z) {
          const [g, b] = $t(r);
          if (g >= 0 && zt(g, b, Z, rt(r)) !== "outside") return;
        }
        M.value = null;
      }
    }
    function ll(r) {
      var D;
      if (!m.value) return;
      let g = 0;
      for (let P = 0; P < r; P++) g += _.value[P].width;
      const b = ((D = _.value[r]) == null ? void 0 : D.width) ?? 0, F = g - h.value;
      F < 0 ? h.value = Math.max(0, g) : F + b > m.value && (h.value = Math.min(te.value, g + b - m.value));
    }
    function al(r) {
      const b = _.value.length - 1, F = ce.value.length - 1;
      if (!I.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(r.key) && (r.preventDefault(), I.value = { row: X.value, col: 0 }, W.value = { row: X.value, col: 0 });
        return;
      }
      let { row: D, col: P } = I.value;
      const G = (de, ue, we = !1) => {
        D = Math.max(0, Math.min(F, de)), P = Math.max(0, Math.min(b, ue)), I.value = { row: D, col: P }, we || (W.value = { row: D, col: P }), K(D), ll(P);
      };
      switch (r.key) {
        case "ArrowDown":
          r.preventDefault(), G(D + 1, P, r.shiftKey);
          break;
        case "ArrowUp":
          r.preventDefault(), G(D - 1, P, r.shiftKey);
          break;
        case "ArrowRight":
          r.preventDefault(), r.shiftKey ? G(D, P + 1, !0) : P < b ? G(D, P + 1) : G(D + 1, 0);
          break;
        case "ArrowLeft":
          r.preventDefault(), r.shiftKey ? G(D, P - 1, !0) : P > 0 ? G(D, P - 1) : G(D - 1, b);
          break;
        case "Tab":
          r.preventDefault(), r.shiftKey ? P > 0 ? G(D, P - 1) : G(D - 1, b) : P < b ? G(D, P + 1) : G(D + 1, 0);
          break;
        case "Enter":
          r.preventDefault(), r.shiftKey ? G(D - 1, P) : G(D + 1, P);
          break;
        case "Home":
          r.preventDefault(), r.ctrlKey || r.metaKey ? G(0, 0, r.shiftKey) : G(D, 0, r.shiftKey);
          break;
        case "End":
          r.preventDefault(), r.ctrlKey || r.metaKey ? G(F, b, r.shiftKey) : G(D, b, r.shiftKey);
          break;
        case "PageDown":
          r.preventDefault(), G(Math.min(F, D + O.value), P, r.shiftKey);
          break;
        case "PageUp":
          r.preventDefault(), G(Math.max(0, D - O.value), P, r.shiftKey);
          break;
        case "Escape":
          I.value = null, W.value = null;
          break;
        case "c":
        case "C":
          (r.ctrlKey || r.metaKey) && (r.preventDefault(), ol());
          break;
      }
    }
    function ol() {
      var we;
      if (!I.value) return;
      const r = _.value, g = ce.value, b = W.value ?? I.value, F = Math.min(b.row, I.value.row), D = Math.max(b.row, I.value.row), P = Math.min(b.col, I.value.col), G = Math.max(b.col, I.value.col), de = [];
      for (let Ye = F; Ye <= D; Ye++) {
        const Mt = g[Ye];
        if (!Mt) continue;
        const Tt = [];
        for (let mt = P; mt <= G; mt++) {
          const Ct = r[mt];
          Ct && Tt.push(ge(Ct, Mt).replace(/[\t\r\n]+/g, " "));
        }
        de.push(Tt.join("	"));
      }
      const ue = de.join(`
`);
      (we = navigator.clipboard) == null || we.writeText(ue).catch(() => {
      });
    }
    function rl(r) {
      const g = r.target.value;
      R.value = g, g ? c[M.value] = g : delete c[M.value], l("filter-changed");
    }
    function kn() {
      M.value && delete c[M.value], R.value = "", M.value = null, l("filter-changed");
    }
    const il = {
      setGridOption(r, g) {
        r === "rowData" ? a.value = g : r === "pinnedBottomRowData" ? s.value = g : r === "quickFilterText" && (o.value = g);
      },
      getColumnState() {
        return e.columnDefs.map((r) => {
          var b, F;
          const g = J(r);
          return {
            colId: g,
            hide: u.has(g),
            sort: ((b = d.value) == null ? void 0 : b.colId) === g ? d.value.dir : null,
            sortIndex: ((F = d.value) == null ? void 0 : F.colId) === g ? 0 : null,
            width: f[g] ?? r.width
          };
        });
      },
      applyColumnState({ state: r }) {
        for (const g of r)
          g.hide === !0 && u.add(g.colId), g.hide === !1 && u.delete(g.colId), g.sort && (d.value = { colId: g.colId, dir: g.sort }), g.width && (f[g.colId] = g.width);
      },
      setFilterModel(r) {
        for (const g of Object.keys(c)) delete c[g];
        if (r)
          for (const [g, b] of Object.entries(r))
            (b == null ? void 0 : b.type) === "equals" ? c[g] = `__eq__${b.filter}` : b != null && b.filter && (c[g] = b.filter);
      },
      getFilterModel() {
        const r = {};
        for (const [g, b] of Object.entries(c))
          b && (r[g] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
        return r;
      },
      async setColumnFilterModel(r, g) {
        g ? g.type === "equals" ? c[r] = `__eq__${g.filter}` : c[r] = g.filter ?? "" : delete c[r];
      },
      onFilterChanged() {
      },
      refreshCells() {
        p.value++;
      },
      exportDataAsCsv({ fileName: r = "export.csv" } = {}) {
        const g = $.value, b = g.map((G) => G.colDef.headerName ?? G.colId).join(","), F = ce.value.map(
          (G) => g.map((de) => `"${String(ge(de, G)).replace(/"/g, '""')}"`).join(",")
        ), D = new Blob([[b, ...F].join(`
`)], { type: "text/csv" }), P = URL.createObjectURL(D);
        Object.assign(document.createElement("a"), { href: P, download: r }).click(), URL.revokeObjectURL(P);
      },
      resize() {
        vt();
      },
      resetColumnState() {
        u.clear();
        for (const g of e.columnDefs)
          g.hide && u.add(J(g));
        const r = e.columnDefs.find((g) => g.sort);
        d.value = r ? { colId: J(r), dir: r.sort } : null;
        for (const g of Object.keys(f)) delete f[g];
        for (const g of Object.keys(c)) delete c[g];
        o.value = "", v.value = 0, I.value = null, M.value = null;
      }
    };
    Q(
      [ce, () => s.value, _, v, L, I],
      () => De(be)
    ), Q(() => e.theme, () => be()), Q(() => [e.curvature, e.bendField], () => De(vt)), Q(() => e.scanlines, () => be()), Q(() => e.glow, () => be()), Q(() => e.magnify, (r) => {
      r || (y.x = me.x, y.y = me.y), be();
    }), Q(I, (r) => {
      if (!r) return;
      const g = ce.value[r.row], b = _.value[r.col];
      g && b && l("cell-selected", { data: g, row: r.row, col: r.col, colId: b.colId });
    });
    let xt = null, bt = null, en = 0;
    function ht() {
      cancelAnimationFrame(en), en = requestAnimationFrame(vt);
    }
    function Ln(r) {
      r.preventDefault();
    }
    function Rn() {
      fe == null || fe.dispose(), fe = null, We = !1, Mn();
    }
    Ne(() => {
      for (const r of e.columnDefs)
        r.hide && u.add(J(r)), r.sort && !d.value && (d.value = { colId: J(r), dir: r.sort });
      a.value = e.rowData ?? [], s.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Cn), document.addEventListener("mousemove", yt), document.addEventListener("mouseup", Yt), De(() => {
        var r;
        Mn(), re.value && (re.value.addEventListener("webglcontextlost", Ln), re.value.addEventListener("webglcontextrestored", Rn)), ae.value && (xt = new ResizeObserver(() => vt()), xt.observe(ae.value), bt = new IntersectionObserver((g) => {
          g.some((b) => b.isIntersecting) && ht();
        }), bt.observe(ae.value)), window.addEventListener("resize", ht), (r = window.visualViewport) == null || r.addEventListener("resize", ht), l("grid-ready", { api: il });
      });
    }), Ze(() => {
      var r, g, b;
      document.removeEventListener("click", Cn, !0), document.removeEventListener("mousemove", yt), document.removeEventListener("mouseup", Yt), (r = re.value) == null || r.removeEventListener("webglcontextlost", Ln), (g = re.value) == null || g.removeEventListener("webglcontextrestored", Rn), xt == null || xt.disconnect(), bt == null || bt.disconnect(), window.removeEventListener("resize", ht), (b = window.visualViewport) == null || b.removeEventListener("resize", ht), cancelAnimationFrame(en), ot();
    });
    const St = se(() => et[e.theme] ?? et.none), sl = se(() => ({
      background: St.value.headerBg,
      borderTop: `1px solid ${St.value.border}`,
      color: St.value.text
    })), cl = se(() => ({
      background: St.value.bg
    })), In = se(() => St.value.accent);
    return (r, g) => {
      var b, F;
      return Te(), Ce("div", {
        ref_key: "wrapEl",
        ref: ae,
        class: "cathode-wrap",
        style: Ue(cl.value)
      }, [
        ve("canvas", {
          ref_key: "canvasEl",
          ref: re,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: it(Jn, ["prevent"]),
          onMousemove: Qn,
          onMouseleave: el,
          onMousedown: tl,
          onClick: nl,
          onKeydown: al,
          onTouchstartPassive: jt,
          onTouchmove: S,
          onTouchend: U,
          onTouchcancel: U
        }, null, 544),
        M.value ? (Te(), Ce("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: E,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: R.value,
          autofocus: "",
          onInput: rl,
          onKeydown: [
            En(kn, ["escape"]),
            g[0] || (g[0] = En((D) => M.value = null, ["enter"]))
          ]
        }, null, 40, Rl)) : Ge("", !0),
        n.pagination ? (Te(), Ce("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ue(sl.value)
        }, [
          ve("button", {
            disabled: v.value <= 0,
            onClick: g[1] || (g[1] = (D) => ie())
          }, "◀", 8, Il),
          ve("span", null, Oe((X.value + 1).toLocaleString()) + "–" + Oe(Math.min(ce.value.length, le.value + 1).toLocaleString()) + " / " + Oe(ce.value.length.toLocaleString()), 1),
          ve("button", {
            disabled: v.value >= H.value,
            onClick: g[2] || (g[2] = (D) => Se())
          }, "▶", 8, El),
          ve("span", {
            class: "cathode-page-info",
            style: Ue({ color: In.value })
          }, Oe(ce.value.length.toLocaleString()) + " rows ", 5),
          I.value ? (Te(), Ce("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ue({ color: In.value })
          }, Oe(((b = _.value[I.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((F = _.value[I.value.col]) == null ? void 0 : F.colId)) + " : " + Oe(ge(_.value[I.value.col], ce.value[I.value.row])), 5)) : Ge("", !0)
        ], 4)) : Ge("", !0)
      ], 4);
    };
  }
}), Je = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [l, a] of t)
    e[l] = a;
  return e;
}, Ga = /* @__PURE__ */ Je(_l, [["__scopeId", "data-v-ff5f851c"]]), Ut = {
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
function Bl(n, t) {
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
const Wl = 12, Re = 18, It = 10, st = 6, pn = `${Wl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Pl(n, t, e) {
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
function Yl(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function $l(n) {
  const { entries: t, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: s } = n, o = n.formatTs ?? Gn;
  e.font = pn;
  const d = [];
  for (let c = 0; c < t.length; c++) {
    const f = t[c], u = f.level ?? "info", p = a && f.ts != null ? o(f.ts) : "", m = s ? Pl(e, f.text, l) : f.text.split(`
`);
    for (let x = 0; x < m.length; x++)
      d.push({
        entryIdx: c,
        text: m[x],
        level: u,
        timestamp: x === 0 ? p : "",
        isFirstFrag: x === 0,
        widthPx: e.measureText(m[x]).width
      });
  }
  return d;
}
function Bn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = n.width, a = n.height, s = Ut[t.theme] ?? Ut.none;
  e.clearRect(0, 0, l, a), e.fillStyle = s.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = pn, e.textBaseline = "middle";
  const o = t.visualLines, d = It - t.scrollX, c = (t.showTimestamps ? It + t.timestampWidth : It) - t.scrollX, f = Math.max(0, Math.floor((t.scrollY - st) / Re)), u = Math.min(o.length, Math.ceil((t.scrollY + a - st) / Re) + 1);
  for (let p = f; p < u; p++) {
    const m = o[p], x = st + p * Re - t.scrollY + Re / 2;
    if (m.entryIdx % 2 === 1 && m.isFirstFrag) {
      e.fillStyle = s.rowAlt;
      let T = 1;
      for (; p + T < u && o[p + T].entryIdx === m.entryIdx; ) T++;
      e.fillRect(0, x - Re / 2, l, Re * T);
    }
    t.selectionStart >= 0 && p >= t.selectionStart && p <= t.selectionEnd && (e.fillStyle = s.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, x - Re / 2, l, Re)), p === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, x - Re / 2, l, Re)), t.showTimestamps && m.timestamp && (e.fillStyle = s.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = s.timestamp), e.fillText(m.timestamp, d, x), e.shadowBlur = 0);
    const k = Bl(s, m.level);
    e.fillStyle = k, e.textAlign = "left", t.glow ? (e.shadowColor = k, e.shadowBlur = 14, e.fillText(m.text, c, x), e.shadowBlur = 7, e.fillText(m.text, c, x), e.shadowBlur = 3, e.fillText(m.text, c, x), e.shadowBlur = 0) : e.fillText(m.text, c, x);
  }
  e.restore();
}
function Wn(n, t, e) {
  if (n < 0) return -1;
  const l = Math.floor((n + t - st) / Re);
  return l < 0 || l >= e ? -1 : l;
}
function Hl(n) {
  return st * 2 + n * Re;
}
const zl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Vl = /* @__PURE__ */ je({
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
    const e = n, l = z(null), a = z(null), s = { ...me }, o = z(0), d = z(0), c = z(0), f = z(-1), u = z(!0), p = z(-1), m = z(-1), x = se(() => {
      const S = e.entries ?? [];
      return e.maxLines > 0 && S.length > e.maxLines ? S.slice(S.length - e.maxLines) : S;
    }), k = se(() => {
      if (!e.showTimestamps) return "";
      const S = e.formatTs ?? Gn;
      let U = "00:00:00";
      for (const ae of x.value) {
        if (ae.ts == null) continue;
        const re = S(ae.ts);
        re.length > U.length && (U = re);
      }
      return U;
    }), T = z(0), v = z([]);
    function h() {
      if (!$) return;
      const S = $.getContext("2d");
      if (!S) return;
      S.font = pn;
      const U = e.showTimestamps ? Yl(S, k.value) : 0;
      T.value = U;
      const ae = Math.max(
        1,
        o.value - It * 2 - U
      );
      v.value = $l({
        entries: x.value,
        ctx: S,
        textMaxWidth: ae,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const L = se(() => Hl(v.value.length)), I = se(() => Math.max(0, L.value - d.value)), W = se(() => {
      let S = 0;
      for (const U of v.value) U.widthPx > S && (S = U.widthPx);
      return It * 2 + T.value + S;
    }), M = se(() => Math.max(0, W.value - o.value)), y = z(0);
    Q(I, () => {
      u.value ? c.value = I.value : c.value = Math.min(c.value, I.value);
    }), Q(M, () => {
      y.value = Math.min(y.value, M.value);
    }), Q(
      [x, o, () => e.showTimestamps, () => e.wordWrap, k],
      () => {
        h(), De(ee);
      },
      { deep: !1 }
    );
    let R = null, N = !1;
    function E() {
      if (R) {
        try {
          R.forceContextLoss();
        } catch {
        }
        try {
          R.dispose();
        } catch {
        }
        R = null;
      }
    }
    let Z, q, V, J, $;
    const _ = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Dt}

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

  ${Ft}

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

    ${At}

    gl_FragColor = color;
  }
`;
    function te() {
      if (!(!a.value || !l.value)) {
        $ = document.createElement("canvas");
        try {
          R = new Y.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          N = !0;
        }
        if (!N && !R.getContext() && (R.dispose(), R = null, N = !0), N) {
          ne();
          return;
        }
        R.setPixelRatio(1), R.setClearColor(0, 0), Z = new Y.Scene(), q = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), J = new Y.CanvasTexture($), J.minFilter = Y.LinearFilter, J.magFilter = Y.LinearFilter, V = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: J },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ..._t()
          },
          vertexShader: zl,
          fragmentShader: _,
          transparent: !0
        }), Z.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), V)), ne();
      }
    }
    function ne() {
      if (!l.value || !R && !N) return;
      const S = l.value.clientWidth, U = l.value.clientHeight;
      if (!S || !U) return;
      const ae = $.width !== S || $.height !== U;
      ae && ($.width = S, $.height = U, o.value = S, d.value = U, h(), R ? (ae && J && (J.dispose(), J = new Y.CanvasTexture($), J.minFilter = Y.LinearFilter, J.magFilter = Y.LinearFilter, V && (V.uniforms.uTex.value = J)), R.setPixelRatio(window.devicePixelRatio || 1), R.setSize(S, U)) : a.value && (a.value.width = S, a.value.height = U, a.value.style.width = S + "px", a.value.style.height = U + "px"), u.value && (c.value = Math.max(0, L.value - d.value)), ee());
    }
    function ee() {
      if (!($ != null && $.width)) return;
      if (N) {
        if (!a.value) return;
        Bn($, {
          visualLines: v.value,
          scrollY: c.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: T.value,
          hoveredLine: f.value,
          selectionStart: Math.min(p.value, m.value),
          selectionEnd: Math.max(p.value, m.value)
        });
        const U = a.value.getContext("2d");
        U && U.drawImage($, 0, 0);
        return;
      }
      if (!R || !V || !J) return;
      const S = e.theme === "paper";
      V.uniforms.uStrength.value = Ke(e.curvature), V.uniforms.uScanlines.value = e.scanlines && !S ? 1 : 0, V.uniforms.uVignette.value = S ? 0 : 1, Bt(V, e.magnify, s, $.width, $.height), Bn($, {
        visualLines: v.value,
        scrollY: c.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: T.value,
        hoveredLine: f.value,
        selectionStart: Math.min(p.value, m.value),
        selectionEnd: Math.max(p.value, m.value)
      }), J.needsUpdate = !0, R.render(Z, q);
    }
    Q(() => e.theme, () => ee()), Q(() => e.curvature, () => ee()), Q(() => e.scanlines, () => ee()), Q(() => e.glow, () => ee()), Q(() => e.magnify, (S) => {
      S || (s.x = me.x, s.y = me.y), ee();
    }), Q(c, () => ee()), Q(y, () => ee()), Q(f, () => ee()), Q([p, m], () => ee());
    function j(S) {
      if (!a.value) return [-1, -1];
      const U = a.value.getBoundingClientRect();
      return [S.clientX - U.left, S.clientY - U.top];
    }
    function i(S) {
      c.value = Math.max(0, Math.min(I.value, S)), u.value = c.value >= I.value - 4;
    }
    function w(S) {
      y.value = Math.max(0, Math.min(M.value, S));
    }
    function B(S) {
      S.shiftKey ? w(y.value + S.deltaY) : Math.abs(S.deltaX) > Math.abs(S.deltaY) ? w(y.value + S.deltaX) : i(c.value + S.deltaY);
    }
    let C = !1, H = 0, O = 0, X = 0, le = 0, oe = !1;
    function ge(S) {
      C = !0, oe = !1, H = S.clientX, O = S.clientY, X = y.value, le = c.value, l.value && l.value.focus();
    }
    function ke(S) {
      if (C) {
        const U = H - S.clientX, ae = O - S.clientY;
        (Math.abs(U) > 4 || Math.abs(ae) > 4) && (oe = !0), w(X + U), i(le + ae);
      }
    }
    function ce() {
      C && (C = !1, oe && (oe = !1));
    }
    function A(S) {
      if (S.touches.length !== 1) return;
      const U = S.touches[0];
      C = !0, oe = !1, H = U.clientX, O = U.clientY, X = y.value, le = c.value, l.value && l.value.focus();
    }
    function K(S) {
      if (!C || S.touches.length !== 1) return;
      S.preventDefault();
      const U = S.touches[0], ae = H - U.clientX, re = O - U.clientY;
      (Math.abs(ae) > 4 || Math.abs(re) > 4) && (oe = !0), w(X + ae), i(le + re);
    }
    function ie() {
      C && (C = !1, oe && (oe = !1));
    }
    function Se(S) {
      const [, U] = j(S);
      return U < 0 ? -1 : Wn(U, c.value, v.value.length);
    }
    function xe(S) {
      if (oe) {
        oe = !1;
        return;
      }
      const U = Se(S);
      if (U < 0) {
        p.value = -1, m.value = -1;
        return;
      }
      S.shiftKey && p.value >= 0 || (p.value = U), m.value = U;
    }
    function ze(S, U) {
      const ae = v.value.length;
      if (ae === 0) return;
      const re = m.value < 0 ? 0 : m.value;
      let Xe = Math.max(0, Math.min(ae - 1, re + S));
      m.value = Xe, (!U || p.value < 0) && (p.value = Xe), f.value = Xe;
      const pe = st + Xe * Re, fe = pe + Re;
      pe < c.value ? i(pe) : fe > c.value + d.value && i(fe - d.value);
    }
    function ut() {
      const S = Math.min(p.value, m.value), U = Math.max(p.value, m.value);
      if (S < 0) return "";
      const ae = v.value, re = /* @__PURE__ */ new Set(), Xe = [];
      for (let pe = S; pe <= U && pe < ae.length; pe++) {
        const fe = ae[pe];
        if (re.has(fe.entryIdx)) continue;
        re.add(fe.entryIdx);
        let We = "";
        for (let ot = 0; ot < ae.length; ot++)
          ae[ot].entryIdx === fe.entryIdx && (We += (We && !ae[ot].isFirstFrag ? " " : "") + ae[ot].text);
        Xe.push(fe.timestamp ? `${fe.timestamp}  ${We}` : We);
      }
      return Xe.join(`
`);
    }
    async function ft() {
      const S = ut();
      if (S)
        try {
          await navigator.clipboard.writeText(S);
        } catch {
          const U = document.createElement("textarea");
          U.value = S, U.style.position = "fixed", U.style.opacity = "0", document.body.appendChild(U), U.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(U);
        }
    }
    function at(S) {
      if ((S.metaKey || S.ctrlKey) && (S.key === "c" || S.key === "C")) {
        p.value >= 0 && (S.preventDefault(), ft());
        return;
      }
      if ((S.metaKey || S.ctrlKey) && (S.key === "a" || S.key === "A")) {
        S.preventDefault(), p.value = 0, m.value = v.value.length - 1;
        return;
      }
      switch (S.key) {
        case "ArrowDown":
          S.preventDefault(), ze(1, S.shiftKey);
          break;
        case "ArrowUp":
          S.preventDefault(), ze(-1, S.shiftKey);
          break;
        case "ArrowRight":
          S.preventDefault(), w(y.value + Re * 2);
          break;
        case "ArrowLeft":
          S.preventDefault(), w(y.value - Re * 2);
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
          S.preventDefault(), i(I.value);
          break;
        case "Escape":
          p.value = -1, m.value = -1;
          break;
      }
    }
    function Fe(S) {
      if (e.magnify && a.value) {
        const ae = Wt(S, a.value);
        s.x = ae.x, s.y = ae.y, ee();
      }
      const [, U] = j(S);
      if (U < 0) {
        f.value = -1;
        return;
      }
      f.value = Wn(U, c.value, v.value.length);
    }
    function Ae() {
      f.value = -1, s.x = me.x, s.y = me.y, ee();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = I.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(S) {
        i(st + S * Re);
      }
    });
    let _e = null, Be = null, Qe = 0;
    const dt = Et("cathodeResetTick", z(0));
    Q(dt, () => Ee());
    function Ee() {
      cancelAnimationFrame(Qe), Qe = requestAnimationFrame(ne);
    }
    function Pt(S) {
      S.preventDefault();
    }
    function yt() {
      R == null || R.dispose(), R = null, N = !1, te();
    }
    Ne(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", ce), De(() => {
        var S;
        te(), a.value && (a.value.addEventListener("webglcontextlost", Pt), a.value.addEventListener("webglcontextrestored", yt)), l.value && (_e = new ResizeObserver(() => ne()), _e.observe(l.value), Be = new IntersectionObserver((U) => {
          U.some((ae) => ae.isIntersecting) && Ee();
        }), Be.observe(l.value)), window.addEventListener("resize", Ee), (S = window.visualViewport) == null || S.addEventListener("resize", Ee), c.value = I.value;
      });
    }), Ze(() => {
      var S, U, ae;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", ce), (S = a.value) == null || S.removeEventListener("webglcontextlost", Pt), (U = a.value) == null || U.removeEventListener("webglcontextrestored", yt), _e == null || _e.disconnect(), Be == null || Be.disconnect(), window.removeEventListener("resize", Ee), (ae = window.visualViewport) == null || ae.removeEventListener("resize", Ee), cancelAnimationFrame(Qe), E();
    });
    const Yt = se(() => Ut[e.theme] ?? Ut.none), jt = se(() => ({
      background: Yt.value.bg
    }));
    return (S, U) => (Te(), Ce("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ue(jt.value),
      tabindex: "0",
      onKeydown: at
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: it(B, ["prevent"]),
        onMousemove: Fe,
        onMouseleave: Ae,
        onMousedown: ge,
        onClick: xe,
        onTouchstartPassive: A,
        onTouchmove: K,
        onTouchend: ie,
        onTouchcancel: ie
      }, null, 544)
    ], 36));
  }
}), Ol = /* @__PURE__ */ Je(Vl, [["__scopeId", "data-v-d6dc9e79"]]), Nl = ["disabled"], Xl = /* @__PURE__ */ je({
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
    function p(M) {
      M.trim() && (c.value.length && c.value[c.value.length - 1] === M || (c.value.push(M), c.value.length > l.historyLimit && c.value.splice(0, c.value.length - l.historyLimit)));
    }
    function m(M) {
      if (!l.disabled) {
        if (M.key === "Enter") {
          M.preventDefault();
          const y = d.value;
          y.trim() && p(y), f.value = -1, d.value = "", a("submit", y);
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
    const x = z(!0);
    let k = null;
    function T() {
      k || (k = setInterval(() => {
        x.value = !x.value;
      }, 530));
    }
    function v() {
      k && (clearInterval(k), k = null), x.value = !0;
    }
    const h = se(() => {
      let M;
      return l.disabled ? M = " " : l.busy ? M = "█" : M = x.value ? "█" : " ", { level: "info", text: `${l.prompt}${d.value}${M}` };
    }), L = se(
      () => [...l.entries, h.value]
    );
    function I() {
      var M;
      l.disabled || (M = o.value) == null || M.focus();
    }
    Q(() => l.busy, (M, y) => {
      y && !M && !l.disabled && De(() => {
        var R;
        return (R = o.value) == null ? void 0 : R.focus();
      });
    });
    function W() {
      var M;
      (M = o.value) == null || M.focus();
    }
    return t({ focus: W }), Ne(() => {
      T(), l.disabled || requestAnimationFrame(() => {
        var M;
        return (M = o.value) == null ? void 0 : M.focus();
      });
    }), Ze(() => {
      v();
    }), (M, y) => (Te(), Ce("div", {
      ref_key: "wrapEl",
      ref: s,
      class: "cathode-terminal-wrap",
      onClick: I
    }, [
      Hn(Ol, {
        entries: L.value,
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
      zn(ve("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": y[0] || (y[0] = (R) => d.value = R),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: m
      }, null, 40, Nl), [
        [ul, d.value]
      ])
    ], 512));
  }
}), Ka = /* @__PURE__ */ Je(Xl, [["__scopeId", "data-v-a2b39934"]]), wt = {
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
}, Ul = 0.18, kt = 8, wn = 22, Gl = 4, He = 8, nt = 56, yn = 42, qe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Kl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", rn = 4, ql = 1, jl = 1;
function Zl(n, t, e, l = 0, a = !1) {
  const s = a ? yn : nt, o = Math.max(0, t - He - s), d = Math.max(1, Math.floor(o / e)), c = Math.min(d, n);
  return { firstIdx: Math.max(0, n - c - Math.floor(l / e)), count: c, slotW: e };
}
function Jl(n, t, e) {
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
function Ql(n, t, e = !1) {
  const l = e ? Gl : wn, a = Math.max(1, n - kt - l - rn), s = Math.max(0, Math.round(a * t)), o = a - s;
  return {
    priceY0: kt,
    priceY1: kt + o,
    volumeY0: kt + o + rn,
    volumeY1: kt + o + rn + s
  };
}
function $e(n, t, e, l) {
  const a = t.max - t.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (n - t.min) / a) * (l - e);
}
function lt(n, t, e) {
  return He + (n - t + 0.5) * e;
}
function tt(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function xn(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0"), a = String(t.getHours()).padStart(2, "0"), s = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${s}`;
}
function ea(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let s;
  return a < 1.5 ? s = 1 : a < 3 ? s = 2 : a < 7 ? s = 5 : s = 10, s * l;
}
function vn(n, t) {
  var k, T, v, h, L;
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, s = n.height / l, o = wt[t.theme] ?? wt.none, d = t.colors ? { ...o, ...t.colors } : o, c = !!t.compact;
  if (e.clearRect(0, 0, a, s), e.fillStyle = d.bg, e.fillRect(0, 0, a, s), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, a, s), e.clip();
  const f = Zl(t.candles.length, a, t.slotW, t.scrollX, c), u = Jl(t.candles, f.firstIdx, f.count), p = Ql(s, t.showVolume ? t.volumeFraction : 0, c), m = Math.max(ql, Math.floor(t.slotW * 0.7)), x = Math.min(t.candles.length, f.firstIdx + f.count);
  for (let I = f.firstIdx; I < x; I++) {
    const W = t.candles[I];
    if (!W) continue;
    const M = lt(I, f.firstIdx, t.slotW), y = $e(W.open, u, p.priceY0, p.priceY1), R = $e(W.close, u, p.priceY0, p.priceY1), N = $e(W.high, u, p.priceY0, p.priceY1), E = $e(W.low, u, p.priceY0, p.priceY1), Z = W.close >= W.open, q = Z ? d.wickBull : d.wickBear, V = Z ? d.candleBull : d.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = V), e.strokeStyle = q, e.lineWidth = jl, e.beginPath(), e.moveTo(Math.round(M) + 0.5, N), e.lineTo(Math.round(M) + 0.5, E), e.stroke(), e.fillStyle = V;
    const J = Math.min(y, R), $ = Math.max(1, Math.abs(R - y)), _ = Math.round(M - m / 2), te = Math.round(J), ne = Math.round($);
    if (e.fillRect(_, te, m, ne), t.glow && (e.shadowBlur = 4, e.fillRect(_, te, m, ne)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const ee = Math.round(W.volume / u.maxVol * (p.volumeY1 - p.volumeY0));
      ee > 0 && (e.fillStyle = Z ? d.volumeBull : d.volumeBear, e.fillRect(
        Math.round(M - m / 2),
        p.volumeY1 - ee,
        m,
        ee
      ));
    }
  }
  if ((k = t.overlays) != null && k.length) {
    const I = { above: 0, below: 0 }, W = t.overlays.filter((y) => y.kind !== "hline" && !!y.label).length, M = W ? 14 + 14 * W + 12 : 8;
    for (const y of t.overlays)
      y.kind === "hline" ? na(e, y, a, u, p, d, c, I, M) : ta(e, y, f, u, p, t.slotW);
  }
  (T = t.markers) != null && T.length && ua(e, d, t.markers, t.candles, f, u, p, t.slotW), fa(e, d, u, p, a, c), c || (da(e, d, t.candles, f, t.slotW, s), sa(e, d, t.candles, a, s)), (v = t.overlays) != null && v.length && aa(e, d, t.overlays, p), t.hover && (va(e, d, t.candles, f, u, p, t.slotW, t.hover, a), oa(e, d, t.candles, f, t.slotW, t.hover, p, ((h = t.overlays) == null ? void 0 : h.length) ?? 0), (L = t.markers) != null && L.length && ia(e, d, t.markers, t.candles, f, u, p, t.slotW, t.hover, a)), e.restore();
}
function ta(n, t, e, l, a, s) {
  var d;
  const o = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    He,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), n.clip(), t.kind === "line")
    Vt(n, t.data, e.firstIdx, o, s, l, a, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const c = Kn(t.color, t.fillAlpha ?? 0.08);
    la(n, t.upper, t.lower, e.firstIdx, o, s, l, a, c), Vt(n, t.upper, e.firstIdx, o, s, l, a, t.color, 1, !1), Vt(n, t.lower, e.firstIdx, o, s, l, a, t.color, 1, !1), (d = t.middle) != null && d.length && Vt(n, t.middle, e.firstIdx, o, s, l, a, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function na(n, t, e, l, a, s, o, d = { above: 0, below: 0 }, c = 8) {
  const f = $e(t.price, l, a.priceY0, a.priceY1), u = f < a.priceY0 - 0.5, p = f > a.priceY1 + 0.5, m = u || p, x = m ? u ? d.above++ : d.below++ : 0, k = m ? u ? a.priceY0 + c + x * 20 : a.priceY1 - 8 - x * 20 : f, T = o ? yn : nt, v = Math.round(k) + 0.5;
  n.save(), m || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo(He, v), n.lineTo(e - T, v), n.stroke(), n.setLineDash([]));
  let h = t.label ?? tt(t.price);
  if (m && h !== "" && (h = (u ? "↑ " : "↓ ") + h), h !== "") {
    n.font = qe, n.textBaseline = "middle", n.textAlign = "left";
    const L = n.measureText(h).width, I = 4, W = 2, M = He + 2;
    n.fillStyle = t.color, m && (n.globalAlpha = 0.85), n.fillRect(M, k - 7 - W, L + I * 2, 14 + W * 2), n.globalAlpha = 1, n.fillStyle = s.bg && !s.bg.startsWith("rgba(0,0,0,0)") ? s.bg : "#0d1520", n.fillText(h, M + I, k);
  }
  n.restore();
}
function Vt(n, t, e, l, a, s, o, d, c, f) {
  if (!t || !t.length) return;
  n.strokeStyle = d, n.lineWidth = c, n.setLineDash(f ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let p = e; p < l; p++) {
    const m = t[p];
    if (typeof m != "number" || !isFinite(m)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const x = lt(p, e, a), k = $e(m, s, o.priceY0, o.priceY1);
    u ? n.lineTo(x, k) : (n.moveTo(x, k), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function la(n, t, e, l, a, s, o, d, c) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = c;
  let f = !1, u = -1;
  for (let p = l; p <= a; p++) {
    const m = t[p], x = e[p], k = p < a && typeof m == "number" && typeof x == "number" && isFinite(m) && isFinite(x);
    if (k && !f && (u = p, f = !0), !k && f || p === a && f) {
      const T = k ? p + 1 : p;
      n.beginPath();
      for (let v = u; v < T; v++) {
        const h = lt(v, l, s), L = $e(t[v], o, d.priceY0, d.priceY1);
        v === u ? n.moveTo(h, L) : n.lineTo(h, L);
      }
      for (let v = T - 1; v >= u; v--) {
        const h = lt(v, l, s), L = $e(e[v], o, d.priceY0, d.priceY1);
        n.lineTo(h, L);
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
function aa(n, t, e, l) {
  const a = e.filter((T) => T.kind !== "hline" && !!T.label);
  if (!a.length) return;
  n.save(), n.font = qe;
  const s = 8, o = 5, d = 12, c = 6, f = 14;
  let u = 0;
  for (const T of a) {
    const v = n.measureText(T.label).width;
    v > u && (u = v);
  }
  const p = s * 2 + d + c + u, m = o * 2 + f * a.length, x = He + 4, k = l.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(x, k, p, m), n.textBaseline = "middle", n.textAlign = "left";
  for (let T = 0; T < a.length; T++) {
    const v = a[T], h = k + o + f * (T + 0.5), L = x + s;
    v.kind === "line" ? (n.strokeStyle = v.color, n.lineWidth = v.lineWidth ?? 1, n.setLineDash(v.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(L, h), n.lineTo(L + d, h), n.stroke(), n.setLineDash([])) : v.kind === "band" && (n.fillStyle = Kn(v.color, v.fillAlpha ?? 0.2), n.fillRect(L, h - 4, d, 8), n.strokeStyle = v.color, n.lineWidth = 1, n.strokeRect(L + 0.5, h - 4 + 0.5, d - 1, 7)), n.fillStyle = t.text, n.fillText(v.label, L + d + c, h);
  }
  n.restore();
}
function oa(n, t, e, l, a, s, o, d) {
  const c = Math.floor((s.x - He) / a), f = l.firstIdx + c;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const p = u.close - u.open, m = u.open !== 0 ? p / u.open * 100 : 0, x = p >= 0 ? "+" : "", k = [
    ["O", tt(u.open), void 0],
    ["H", tt(u.high), void 0],
    ["L", tt(u.low), void 0],
    ["C", tt(u.close), void 0],
    ["V", ra(u.volume), void 0],
    ["", `${x}${m.toFixed(2)}%`, p >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = qe, n.textBaseline = "middle", n.textAlign = "left";
  const T = 8, v = 4, h = 14;
  let L = T;
  for (const [y, R] of k) {
    const N = y ? `${y} ${R}` : R, E = n.measureText(N).width + 12;
    L += E;
  }
  L += T - 12;
  const I = o.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), W = He + 4;
  n.fillStyle = t.panelBg, n.fillRect(W, I, L, h + v * 2);
  let M = W + T;
  for (let y = 0; y < k.length; y++) {
    const [R, N, E] = k[y];
    n.fillStyle = t.text, R && (n.globalAlpha = 0.6, n.fillText(R + " ", M, I + v + h / 2), n.globalAlpha = 1, M += n.measureText(R + " ").width), E && (n.fillStyle = E), n.fillText(N, M, I + v + h / 2), M += n.measureText(N).width + 12;
  }
  n.restore();
}
function ra(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function ia(n, t, e, l, a, s, o, d, c, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, p = Math.max(1, u * 0.5), m = Math.min(l.length, a.firstIdx + a.count), x = 9;
  let k = null;
  for (const N of e) {
    let E = 0, Z = l.length - 1, q = -1;
    for (; E <= Z; ) {
      const $ = E + Z >> 1, _ = l[$].start - N.timestamp;
      if (Math.abs(_) <= p) {
        q = $;
        break;
      }
      _ < 0 ? E = $ + 1 : Z = $ - 1;
    }
    if (q < 0 || q < a.firstIdx || q >= m) continue;
    const V = lt(q, a.firstIdx, d), J = $e(N.price, s, o.priceY0, o.priceY1);
    if (Math.abs(c.x - V) <= x && Math.abs(c.y - J) <= x) {
      k = { m: N, x: V, y: J };
      break;
    }
  }
  if (!k) return;
  const T = xn(k.m.timestamp), v = [
    `${k.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${T}`,
    `@ ${tt(k.m.price)}`
  ];
  k.m.label && v.push(k.m.label), n.save(), n.font = qe, n.textBaseline = "top", n.textAlign = "left";
  const h = 6, L = 14;
  let I = 0;
  for (const N of v) {
    const E = n.measureText(N).width;
    E > I && (I = E);
  }
  const W = I + h * 2, M = v.length * L + h * 2;
  let y = k.x + 12;
  y + W > f - nt && (y = k.x - 12 - W);
  let R = k.y - M / 2;
  R < o.priceY0 && (R = o.priceY0), R + M > o.priceY1 && (R = o.priceY1 - M), n.fillStyle = t.panelBgSolid, n.strokeStyle = k.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(y, R, W, M), n.strokeRect(y + 0.5, R + 0.5, W - 1, M - 1);
  for (let N = 0; N < v.length; N++) {
    const E = v[N];
    n.fillStyle = N === 0 ? k.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(E, y + h, R + h + N * L);
  }
  n.restore();
}
function sa(n, t, e, l, a) {
  if (e.length < 2) return;
  const s = e[1].start - e[0].start, o = ca(s);
  if (!o) return;
  n.save(), n.font = qe, n.textBaseline = "top", n.textAlign = "right";
  const d = 6, c = 3, f = n.measureText(o).width, u = l - nt - d, p = a - wn + 4;
  n.fillStyle = t.accent, n.fillRect(u - f - d, p - c, f + d * 2, 14 + c * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(o, u, p), n.restore();
}
function ca(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, l = 60 * e, a = 24 * l, s = 7 * a;
  return n >= s && n % s === 0 ? n / s + "W" : n >= a && n % a === 0 ? n / a + "D" : n >= l && n % l === 0 ? n / l + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function ua(n, t, e, l, a, s, o, d) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, c * 0.5), u = Math.min(l.length, a.firstIdx + a.count), p = (x) => {
    let k = 0, T = l.length - 1;
    for (; k <= T; ) {
      const v = k + T >> 1, h = l[v].start - x;
      if (Math.abs(h) <= f) return v;
      h < 0 ? k = v + 1 : T = v - 1;
    }
    return -1;
  }, m = 7;
  for (const x of e) {
    const k = p(x.timestamp);
    if (k < 0 || k < a.firstIdx || k >= u) continue;
    const T = lt(k, a.firstIdx, d), v = $e(x.price, s, o.priceY0, o.priceY1);
    if (v < o.priceY0 || v > o.priceY1) continue;
    const h = x.color ?? (x.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = h, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), x.kind === "entry" ? (n.moveTo(T, v - m), n.lineTo(T - m, v + m - 1), n.lineTo(T + m, v + m - 1)) : (n.moveTo(T, v + m), n.lineTo(T - m, v - m + 1), n.lineTo(T + m, v - m + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function fa(n, t, e, l, a, s = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const d = l.priceY1 - l.priceY0, c = s ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, f = ea(o, c), u = Math.ceil(e.min / f) * f, p = s ? yn : nt;
  n.font = s ? Kl : qe, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let m = u; m <= e.max; m += f) {
    const x = $e(m, e, l.priceY0, l.priceY1);
    x < l.priceY0 || x > l.priceY1 || (n.beginPath(), n.moveTo(He, Math.round(x) + 0.5), n.lineTo(a - p, Math.round(x) + 0.5), n.stroke(), n.fillText(tt(m), a - p + 3, x));
  }
  n.globalAlpha = 1;
}
function da(n, t, e, l, a, s) {
  if (l.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(l.count / 6));
  n.font = qe, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const c = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < c; f += d) {
    const u = e[f];
    if (!u) continue;
    const p = lt(f, l.firstIdx, a);
    n.fillText(xn(u.start), p, s - wn + 4);
  }
  n.globalAlpha = 1;
}
function va(n, t, e, l, a, s, o, d, c) {
  const f = Math.floor((d.x - He) / o), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), p = e[u];
  if (!p) return;
  const m = lt(u, l.firstIdx, o);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(m) + 0.5, s.priceY0), n.lineTo(Math.round(m) + 0.5, s.volumeY1 || s.priceY1), n.stroke();
  const x = Math.max(s.priceY0, Math.min(s.priceY1, d.y));
  n.beginPath(), n.moveTo(He, Math.round(x) + 0.5), n.lineTo(c - nt, Math.round(x) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const k = a.max - a.min;
  if (k > 0) {
    const h = a.max - (x - s.priceY0) / (s.priceY1 - s.priceY0) * k, L = tt(h);
    n.font = qe, n.textBaseline = "middle", n.textAlign = "left";
    const I = n.measureText(L).width, W = 4, M = 2;
    n.fillStyle = t.accent, n.fillRect(c - nt + 2, x - 7 - M, I + W * 2, 14 + M * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(L, c - nt + 2 + W, x);
  }
  n.font = qe, n.textBaseline = "top", n.textAlign = "center";
  const T = xn(p.start), v = n.measureText(T).width;
  n.fillStyle = t.accent, n.fillRect(m - v / 2 - 4, s.volumeY1 + 2, v + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(T, m, s.volumeY1 + 4), n.restore();
}
const sn = 0.25, cn = 6, ha = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ma = /* @__PURE__ */ je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Ul },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(n) {
    const t = n, e = z(null), l = z(null), a = { ...me }, s = z(0), o = z(0), d = z(0), c = z(1), f = z(null), u = se(() => Math.max(1, t.slotW * c.value));
    let p = null, m = !1;
    function x() {
      if (p) {
        try {
          p.forceContextLoss();
        } catch {
        }
        try {
          p.dispose();
        } catch {
        }
        p = null;
      }
    }
    let k, T, v, h, L;
    const I = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Dt}

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

  ${Ft}

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

    ${At}

    gl_FragColor = color;
  }
`;
    function W() {
      if (!(!l.value || !e.value)) {
        if (L = document.createElement("canvas"), t.flat) {
          m = !0, M();
          return;
        }
        try {
          p = new Y.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !p.getContext() && (p.dispose(), p = null, m = !0), m) {
          M();
          return;
        }
        p.setPixelRatio(1), p.setClearColor(0, 0), k = new Y.Scene(), T = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new Y.CanvasTexture(L), h.minFilter = Y.LinearFilter, h.magFilter = Y.LinearFilter, v = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ..._t()
          },
          vertexShader: ha,
          fragmentShader: I,
          transparent: !0
        }), k.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), v)), M();
      }
    }
    function M() {
      if (!e.value || !p && !m) return;
      const A = e.value.clientWidth, K = e.value.clientHeight;
      !A || !K || !(L.width !== A || L.height !== K) || (L.width = A, L.height = K, s.value = A, o.value = K, p ? (h && (h.dispose(), h = new Y.CanvasTexture(L), h.minFilter = Y.LinearFilter, h.magFilter = Y.LinearFilter, v && (v.uniforms.uTex.value = h)), p.setPixelRatio(window.devicePixelRatio || 1), p.setSize(A, K)) : l.value && (l.value.width = A, l.value.height = K, l.value.style.width = A + "px", l.value.style.height = K + "px"), y());
    }
    function y() {
      if (!(L != null && L.width)) return;
      if (m) {
        if (!l.value) return;
        vn(L, {
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
        const K = l.value.getContext("2d");
        K && (K.clearRect(0, 0, l.value.width, l.value.height), K.drawImage(L, 0, 0));
        return;
      }
      if (!p || !v || !h) return;
      const A = t.theme === "paper";
      v.uniforms.uStrength.value = Ke(t.curvature), v.uniforms.uScanlines.value = t.scanlines && !A ? 1 : 0, v.uniforms.uVignette.value = A ? 0 : 1, Bt(v, t.magnify, a, L.width, L.height), vn(L, {
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
      }), h.needsUpdate = !0, p.render(k, T);
    }
    Q(() => t.theme, () => y()), Q(() => t.curvature, () => y()), Q(() => t.scanlines, () => y()), Q(() => t.glow, () => y()), Q(() => t.showVolume, () => y()), Q(() => t.volumeFraction, () => y()), Q(() => t.slotW, () => y()), Q(() => t.candles, () => y(), { deep: !1 }), Q(() => t.overlays, () => y(), { deep: !1 }), Q(() => t.markers, () => y(), { deep: !1 }), Q(() => t.compact, () => y()), Q(() => t.magnify, (A) => {
      A || (a.x = me.x, a.y = me.y), y();
    }), Q(() => t.colors, () => y(), { deep: !0 }), Q(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), Q(d, () => y()), Q(c, () => y()), Q(f, () => y()), Q(u, () => y());
    let R = null, N = null, E = 0;
    const Z = Et("cathodeResetTick", z(0));
    Q(Z, () => q());
    function q() {
      cancelAnimationFrame(E), E = requestAnimationFrame(M);
    }
    function V(A) {
      A.preventDefault();
    }
    function J() {
      p == null || p.dispose(), p = null, m = !1, W();
    }
    function $(A) {
      if (!l.value) return [-1, -1];
      const K = l.value.getBoundingClientRect();
      return [A.clientX - K.left, A.clientY - K.top];
    }
    function _(A) {
      var ze;
      const K = u.value;
      if (K <= 0) return 0;
      const ie = ((ze = t.candles) == null ? void 0 : ze.length) ?? 0, Se = Math.max(1, Math.floor((s.value || 1) / K)), xe = Math.max(0, ie - Se);
      return Math.max(0, Math.min(A, xe * K));
    }
    function te(A) {
      var Se;
      if (A.deltaX !== 0 || A.shiftKey && A.deltaY !== 0) {
        const xe = A.deltaX !== 0 ? A.deltaX : A.deltaY;
        d.value = _(d.value + xe);
        return;
      }
      if (A.deltaY === 0) return;
      const [K] = $(A), ie = u.value;
      if (K >= 0 && ie > 0 && ((Se = t.candles) != null && Se.length)) {
        const xe = Math.max(1, Math.floor((s.value || 1) / ie)), ut = Math.max(0, t.candles.length - xe - Math.floor(d.value / ie)) + (K - 8) / ie, ft = Math.exp(-A.deltaY * 15e-4), at = Math.max(sn, Math.min(cn, c.value * ft));
        c.value = at;
        const Fe = t.slotW * at, Ae = Math.max(1, Math.floor((s.value || 1) / Fe)), _e = ut - (K - 8) / Fe, Be = Math.max(0, t.candles.length - Ae - _e);
        d.value = _(Be * Fe);
      } else {
        const xe = Math.exp(-A.deltaY * 15e-4);
        c.value = Math.max(sn, Math.min(cn, c.value * xe));
      }
    }
    let ne = !1, ee = 0, j = 0;
    function i(A) {
      A.button === 0 && (ne = !0, ee = A.clientX, j = d.value, f.value = null, e.value && e.value.focus());
    }
    function w(A) {
      const K = Math.exp(A * 0.18);
      c.value = Math.max(sn, Math.min(cn, c.value * K)), d.value = _(d.value);
    }
    function B(A) {
      const K = u.value, ie = A.shiftKey ? 20 : 3;
      switch (A.key) {
        case "ArrowLeft":
          A.preventDefault(), d.value = _(d.value + K * ie);
          break;
        case "ArrowRight":
          A.preventDefault(), d.value = _(d.value - K * ie);
          break;
        case "ArrowUp":
          A.preventDefault(), w(1);
          break;
        case "ArrowDown":
          A.preventDefault(), w(-1);
          break;
        case "Home":
          A.preventDefault(), d.value = _(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          A.preventDefault(), d.value = 0;
          break;
      }
    }
    function C(A) {
      if (ne) {
        const K = A.clientX - ee;
        d.value = _(j + K);
        return;
      }
    }
    function H() {
      ne = !1;
    }
    function O(A) {
      if (A.touches.length !== 1) return;
      const K = A.touches[0];
      ne = !0, ee = K.clientX, j = d.value, f.value = null;
    }
    function X(A) {
      if (!ne || A.touches.length !== 1) return;
      A.preventDefault();
      const ie = A.touches[0].clientX - ee;
      d.value = _(j + ie);
    }
    function le() {
      ne = !1;
    }
    function oe(A) {
      if (t.magnify && l.value) {
        const Se = Wt(A, l.value);
        a.x = Se.x, a.y = Se.y, y();
      }
      if (ne) return;
      const [K, ie] = $(A);
      if (K < 0 || ie < 0) {
        f.value = null;
        return;
      }
      f.value = { x: K, y: ie };
    }
    function ge() {
      f.value = null, a.x = me.x, a.y = me.y, y();
    }
    Ne(() => {
      document.addEventListener("mousemove", C), document.addEventListener("mouseup", H), De(() => {
        var A;
        W(), l.value && (l.value.addEventListener("webglcontextlost", V), l.value.addEventListener("webglcontextrestored", J)), e.value && (R = new ResizeObserver(() => M()), R.observe(e.value), N = new IntersectionObserver((K) => {
          K.some((ie) => ie.isIntersecting) && q();
        }), N.observe(e.value)), window.addEventListener("resize", q), (A = window.visualViewport) == null || A.addEventListener("resize", q);
      });
    }), Ze(() => {
      var A, K, ie;
      document.removeEventListener("mousemove", C), document.removeEventListener("mouseup", H), (A = l.value) == null || A.removeEventListener("webglcontextlost", V), (K = l.value) == null || K.removeEventListener("webglcontextrestored", J), R == null || R.disconnect(), N == null || N.disconnect(), window.removeEventListener("resize", q), (ie = window.visualViewport) == null || ie.removeEventListener("resize", q), cancelAnimationFrame(E), x();
    });
    const ke = se(() => wt[t.theme] ?? wt.none), ce = se(() => ({
      background: ke.value.bg
    }));
    return (A, K) => (Te(), Ce("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ue(ce.value),
      tabindex: "0",
      onKeydown: B
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: it(te, ["prevent"]),
        onMousedown: i,
        onMousemove: oe,
        onMouseleave: ge,
        onTouchstartPassive: O,
        onTouchmove: X,
        onTouchend: le,
        onTouchcancel: le
      }, null, 544)
    ], 36));
  }
}), qa = /* @__PURE__ */ Je(ma, [["__scopeId", "data-v-7c334778"]]), gt = 22, Lt = 6, ga = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, pa = /* @__PURE__ */ je({
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
    const e = n, l = t, a = z(null), s = z(null), o = z(-1), d = z(0), c = { ...me };
    let f = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, p = !1;
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
    let x, k, T, v, h;
    const L = z(0), I = z(0), W = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Dt}

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

  ${Ft}

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

    ${At}

    gl_FragColor = color;
  }
`;
    function M() {
      if (!(!s.value || !a.value)) {
        h = document.createElement("canvas");
        try {
          u = new Y.WebGLRenderer({ canvas: s.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          p = !0;
        }
        if (!p && !u.getContext() && (u.dispose(), u = null, p = !0), p) {
          y();
          return;
        }
        u.setPixelRatio(f), u.setClearColor(0, 0), x = new Y.Scene(), k = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new Y.CanvasTexture(h), v.minFilter = Y.LinearFilter, v.magFilter = Y.LinearFilter, T = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ..._t()
          },
          vertexShader: ga,
          fragmentShader: W,
          transparent: !0
        }), x.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), T)), y();
      }
    }
    function y() {
      if (!a.value || !u && !p) return;
      const i = a.value.clientWidth, w = a.value.clientHeight;
      if (!i || !w) return;
      L.value = i, I.value = w, f = Math.min(window.devicePixelRatio || 1, 2);
      const B = e.bendField ? Math.round(i * Un(e.curvature)) : i, C = Math.round(B * f), H = Math.round(w * f), O = h.width !== C || h.height !== H;
      h.width = C, h.height = H, u ? (O && v && (v.dispose(), v = new Y.CanvasTexture(h), v.minFilter = Y.LinearFilter, v.magFilter = Y.LinearFilter, T.uniforms.uTex.value = v), u.setPixelRatio(f), u.setSize(i, w)) : s.value && (s.value.width = Math.round(i * f), s.value.height = Math.round(w * f), s.value.style.width = i + "px", s.value.style.height = w + "px"), V();
    }
    function R() {
      const i = (h == null ? void 0 : h.width) || 0, w = Math.max(1, Math.floor(i / e.minCellW)), B = Math.floor(i / w), C = Math.round(B * e.cellAspect), H = gt + C + Lt;
      return { rects: e.cells.map((X, le) => ({
        x: le % w * B,
        y: Math.floor(le / w) * H - d.value,
        w: B,
        h: H
      })), rowH: H, totalH: Math.ceil(e.cells.length / w) * H, cols: w };
    }
    const N = () => {
      const { totalH: i } = R();
      return Math.max(0, i - ((h == null ? void 0 : h.height) || 0));
    }, E = /* @__PURE__ */ new Map();
    function Z(i, w, B) {
      const C = i.candles[i.candles.length - 1], H = `${w}x${B}@${f}|${i.candles.length}|${C ? C.start + ":" + C.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, O = E.get(i.id);
      if (O && O.key === H) return O.canvas;
      const X = (O == null ? void 0 : O.canvas) ?? document.createElement("canvas");
      X.width = Math.round(w * f), X.height = Math.round(B * f);
      const le = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, i.candles.length))), oe = w < 260 && i.overlays ? i.overlays.map((ge) => ({ ...ge, label: "" })) : i.overlays;
      return vn(X, {
        candles: i.candles,
        slotW: le,
        scrollX: Math.max(0, i.candles.length * le - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: oe,
        compact: !0,
        colors: e.colors,
        dpr: f
      }), E.set(i.id, { canvas: X, key: H }), X;
    }
    const q = se(() => ({ ...wt[e.theme] ?? wt.none, ...e.colors ?? {} }));
    function V() {
      var C;
      if (!(h != null && h.width)) return;
      const i = h.getContext("2d");
      if (!i) return;
      const w = q.value;
      i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, h.width, h.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (i.fillStyle = w.bg, i.fillRect(0, 0, h.width, h.height)), i.setTransform(f, 0, 0, f, 0, 0);
      const { rects: B } = R();
      i.font = "600 11px ui-monospace, SFMono-Regular, monospace", i.textBaseline = "middle";
      for (let H = 0; H < e.cells.length; H++) {
        const O = e.cells[H], X = B[H];
        if (X.y + X.h < 0 || X.y > h.height / f) continue;
        const le = X.x + Lt / 2, oe = X.w - Lt;
        i.strokeStyle = O.open ? w.candleBull : w.gridline, i.lineWidth = H === o.value ? 2 : 1, i.strokeRect(le + 0.5, X.y + 0.5, oe - 1, X.h - Lt - 1), i.save(), i.beginPath(), i.rect(le, X.y, oe, gt), i.clip();
        const ge = X.y + gt / 2 + 1, ke = O.note ? i.measureText(O.note).width + (O.open ? 22 : 12) : O.open ? 16 : 0, ce = O.badge ? i.measureText(O.badge).width + 6 : 0, A = oe - 14 - ce - ke;
        let K = O.title;
        if (i.measureText(K).width > A) {
          for (; K.length > 1 && i.measureText(K + "…").width > A; ) K = K.slice(0, -1);
          K += "…";
        }
        let ie = le + 7;
        i.fillStyle = w.text, i.textAlign = "left", i.fillText(K, ie, ge), ie += i.measureText(K).width + 6, O.badge && (i.fillStyle = w.accent, i.fillText(O.badge, ie, ge)), O.note && (i.textAlign = "right", i.fillStyle = O.noteColor || w.accent, i.fillText(O.note, le + oe - (O.open ? 16 : 7), ge), i.textAlign = "left"), i.restore(), O.open && (i.fillStyle = w.candleBull, i.beginPath(), i.arc(le + oe - 9, X.y + gt / 2 + 1, 3, 0, Math.PI * 2), i.fill());
        const Se = X.y + gt, xe = X.h - gt - Lt;
        O.candles.length ? i.drawImage(Z(O, oe - 2, xe - 1), le + 1, Se, oe - 2, xe - 1) : (i.fillStyle = w.accent, i.textAlign = "center", i.fillText("· · ·", le + oe / 2, Se + xe / 2), i.textAlign = "left");
      }
      if (p) {
        const H = (C = s.value) == null ? void 0 : C.getContext("2d");
        H && s.value && H.drawImage(h, 0, 0, h.width, h.height, 0, 0, s.value.width, s.value.height);
        return;
      }
      !u || !T || !v || (T.uniforms.uStrength.value = Ke(e.curvature), T.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, T.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Bt(T, e.magnify, c, L.value || h.width, I.value || h.height), v.needsUpdate = !0, u.render(x, k));
    }
    function J(i) {
      if (!s.value) return [-1, -1];
      const w = s.value.getBoundingClientRect();
      return Xn(
        i.clientX - w.left,
        i.clientY - w.top,
        w.width,
        w.height,
        Ke(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((h == null ? void 0 : h.width) || w.width) / f,
        ((h == null ? void 0 : h.height) || w.height) / f
      );
    }
    function $(i, w) {
      if (i < 0) return -1;
      const { rects: B } = R();
      return B.findIndex((C) => i >= C.x && i < C.x + C.w && w >= C.y && w < C.y + C.h);
    }
    function _(i) {
      const [w, B] = J(i), C = $(w, B);
      C >= 0 && l("cell-click", e.cells[C].id);
    }
    function te(i) {
      if (e.magnify && s.value) {
        const H = Wt(i, s.value);
        c.x = H.x, c.y = H.y;
      }
      const [w, B] = J(i), C = $(w, B);
      C !== o.value ? (o.value = C, V()) : e.magnify && V(), s.value && (s.value.style.cursor = C >= 0 ? "pointer" : "default");
    }
    function ne() {
      o.value = -1, c.x = me.x, c.y = me.y, V();
    }
    function ee(i) {
      const w = N();
      w <= 0 || (i.preventDefault(), d.value = Math.max(0, Math.min(w, d.value + i.deltaY)), V());
    }
    let j = null;
    return Ne(() => {
      M(), j = new ResizeObserver(() => y()), a.value && j.observe(a.value);
    }), Ze(() => {
      j == null || j.disconnect(), m(), E.clear();
    }), Q(() => [e.curvature, e.bendField], () => De(y)), Q(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      d.value = Math.min(d.value, N()), V();
    }, { deep: !1 }), (i, w) => (Te(), Ce("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: s,
        onClick: _,
        onMousemove: te,
        onMouseleave: ne,
        onWheel: ee
      }, null, 544)
    ], 512));
  }
}), ja = /* @__PURE__ */ Je(pa, [["__scopeId", "data-v-9f2b24f8"]]), bn = z(0), hn = 28, pt = 12;
let mn = 10, Gt = "cathode.layout", Kt = !1;
const Ie = z({});
function wa(n, t = "cathode.layout") {
  if (!Kt) {
    Kt = !0, Gt = t;
    try {
      const e = localStorage.getItem(Gt);
      if (e) {
        Ie.value = JSON.parse(e), Pn();
        return;
      }
    } catch {
    }
    Ie.value = { ...n }, Pn();
  }
}
function Pn() {
  let n = 10;
  for (const t of Object.values(Ie.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  mn = n;
}
function ct() {
  localStorage.setItem(Gt, JSON.stringify(Ie.value));
}
function ya(n) {
  Kt = !1, localStorage.removeItem(Gt), Ie.value = { ...n }, ct(), Kt = !0, bn.value++;
}
function qn(n) {
  mn++, Ie.value[n] && (Ie.value[n].zIndex = mn);
}
function xa(n, t) {
  Ie.value[n].visible = t, ct();
}
function ba(n, t) {
  Ie.value[n].minimized = t, t && (Ie.value[n].maximized = !1), ct();
}
function Sa(n, t) {
  Ie.value[n].maximized = t, t && (Ie.value[n].minimized = !1, qn(n)), ct();
}
function Ma(n, t, e) {
  Ie.value[n].x = Math.round(t), Ie.value[n].y = Math.round(e), ct();
}
function Ta(n, t, e) {
  Ie.value[n].w = Math.round(t), Ie.value[n].h = Math.round(e), ct();
}
function Za(n, t, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), s = Math.floor((n - pt * (l + 1)) / l), o = Math.floor((t - pt * (a + 1)) / a), d = {};
  return e.forEach((c, f) => {
    const u = f % l, p = Math.floor(f / l);
    d[c] = {
      x: pt + u * (s + pt),
      y: pt + p * (o + pt),
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
    containers: Ie,
    TITLEBAR_H: hn,
    load: wa,
    save: ct,
    reset: ya,
    bringToFront: qn,
    setVisible: xa,
    setMinimized: ba,
    setMaximized: Sa,
    updatePos: Ma,
    updateSize: Ta
  };
}
const Ca = { class: "ws-toolbar" }, ka = {
  key: 0,
  class: "ws-restore-menu"
}, La = {
  key: 0,
  class: "ws-restore-empty"
}, Ra = ["onClick"], Ia = /* @__PURE__ */ je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: l, reset: a, setVisible: s } = jn(), o = z(null);
    Dn("cathodeWorkspace", o), Dn("cathodeResetTick", bn), Ne(() => {
      if (!o.value) return;
      const { clientWidth: v, clientHeight: h } = o.value, L = t.initialLayout ?? {};
      l(L, t.storageKey ?? "cathode.layout");
      const I = Object.keys(e.value)[0];
      I && d(I);
    });
    function d(v) {
      var L;
      document.querySelectorAll(".cc").forEach((I) => I.classList.remove("cc-focused"));
      const h = (L = o.value) == null ? void 0 : L.querySelector(`#cc-${v}`);
      h && h.classList.add("cc-focused");
    }
    function c() {
      !o.value || !t.initialLayout || a(t.initialLayout);
    }
    function f(v) {
      const h = v.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((L) => L.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const u = z(!1), p = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function m(v) {
      s(v, !0), u.value = !1;
    }
    function x(v) {
      if (!u.value) return;
      const h = v.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (u.value = !1);
    }
    function k(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Ne(() => {
      document.addEventListener("click", x), document.addEventListener("keydown", k);
    }), Ze(() => {
      document.removeEventListener("click", x), document.removeEventListener("keydown", k);
    });
    function T(v) {
      var h;
      return ((h = t.containerTitles) == null ? void 0 : h[v]) ?? v;
    }
    return (v, h) => (Te(), Ce("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      fn(v.$slots, "default", {}, void 0, !0),
      fn(v.$slots, "overlay", {}, void 0, !0),
      ve("div", Ca, [
        n.initialLayout ? (Te(), Ce("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : Ge("", !0),
        h[1] || (h[1] = ve("div", { class: "ws-sep" }, null, -1)),
        ve("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (L) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Hn(fl, { name: "menu" }, {
        default: dl(() => [
          u.value ? (Te(), Ce("div", ka, [
            h[3] || (h[3] = ve("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            p().length ? Ge("", !0) : (Te(), Ce("div", La, " No closed panels ")),
            (Te(!0), Ce(vl, null, hl(p(), (L) => (Te(), Ce("div", {
              key: L,
              class: "ws-restore-item",
              onClick: (I) => m(L)
            }, [
              h[2] || (h[2] = ve("span", { class: "ws-restore-icon" }, "⊞", -1)),
              ml(" " + Oe(T(L)), 1)
            ], 8, Ra))), 128))
          ])) : Ge("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Ja = /* @__PURE__ */ Je(Ia, [["__scopeId", "data-v-5838d04b"]]), Ea = ["id"], Da = { class: "cc-title" }, Fa = {
  key: 0,
  class: "cc-size-badge"
}, Aa = { class: "cc-controls" }, _a = ["title"], Ba = { class: "cc-body" }, Wa = 200, Pa = 80, Yn = 60, Ya = /* @__PURE__ */ je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: l, setVisible: a, setMinimized: s, setMaximized: o, updatePos: d, updateSize: c } = jn(), f = Et("cathodeWorkspace", z(null)), u = se(() => e.value[t.id]), p = se(() => {
      const i = u.value, w = t.curvature ?? 0;
      if (!i) return {};
      const B = { "--curvature": Math.abs(w) };
      return i.maximized ? { ...B, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: i.zIndex } : {
        ...B,
        left: i.x + "px",
        top: i.y + "px",
        width: i.w + "px",
        height: i.minimized ? hn + "px" : i.h + "px",
        zIndex: i.zIndex,
        display: i.visible ? "flex" : "none"
      };
    });
    let m = !1, x = 0, k = 0;
    function T(i) {
      var C;
      if (i.target.closest(".cc-btn") || u.value.maximized) return;
      l(t.id), m = !0;
      const w = (C = f.value) == null ? void 0 : C.querySelector(`#cc-${t.id}`);
      if (!w) return;
      const B = w.getBoundingClientRect();
      x = i.clientX - B.left, k = i.clientY - B.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", h), i.preventDefault();
    }
    function v(i) {
      var O;
      if (!m || !f.value) return;
      const w = f.value.getBoundingClientRect(), B = ((O = u.value) == null ? void 0 : O.w) ?? 300;
      let C = i.clientX - w.left - x, H = i.clientY - w.top - k;
      C = Math.max(Yn - B, Math.min(w.width - Yn, C)), H = Math.max(0, Math.min(w.height - hn, H)), d(t.id, C, H);
    }
    function h() {
      m = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h);
    }
    let L = !1, I = 0, W = 0, M = 0, y = 0;
    const R = z("");
    function N(i) {
      u.value.maximized || (l(t.id), L = !0, I = i.clientX, W = i.clientY, M = u.value.w, y = u.value.h, document.addEventListener("mousemove", E), document.addEventListener("mouseup", Z), i.preventDefault(), i.stopPropagation());
    }
    function E(i) {
      if (!L) return;
      const w = Math.max(Wa, M + (i.clientX - I)), B = Math.max(Pa, y + (i.clientY - W));
      c(t.id, w, B), R.value = `${Math.round(w)}×${Math.round(B)}`;
    }
    function Z() {
      L = !1, R.value = "", document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", Z), q.value++;
    }
    const q = z(0);
    Q(bn, () => {
      q.value++;
    }), Ze(() => {
      var i;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", Z), (i = V.value) == null || i.removeEventListener("scroll", $), _();
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
      const C = i.clientHeight, H = C / 2, O = w * 38e-4;
      B.forEach((X) => {
        if (!X.dataset.origFs) {
          const Se = getComputedStyle(X);
          X.dataset.origFs = Se.fontSize, X.dataset.origLh = Se.lineHeight;
        }
        if (w === 0) {
          X.style.fontSize = "", X.style.lineHeight = "";
          return;
        }
        const le = X.getBoundingClientRect(), oe = i.getBoundingClientRect(), ge = le.top - oe.top + le.height / 2, ke = Math.min(1, Math.abs(ge - H) / (C / 2)), ce = 1 + O * Math.cos(ke * Math.PI / 2), A = parseFloat(X.dataset.origFs), K = X.dataset.origLh, ie = K === "normal" ? A * 1.4 : parseFloat(K);
        isNaN(A) || (X.style.fontSize = `${(A * ce).toFixed(2)}px`), isNaN(ie) || (X.style.lineHeight = `${(ie * ce).toFixed(2)}px`);
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
    }), Ne(() => {
      var i;
      (i = V.value) == null || i.addEventListener("scroll", $, { passive: !0 }), De($);
    });
    function te() {
      s(t.id, !u.value.minimized), De(() => {
        q.value++;
      });
    }
    function ne() {
      o(t.id, !u.value.maximized), De(() => {
        q.value++;
      });
    }
    function ee() {
      a(t.id, !1);
    }
    function j() {
      l(t.id);
    }
    return (i, w) => u.value && u.value.visible ? (Te(), Ce("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: gl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: Ue(p.value),
      onMousedown: j
    }, [
      ve("div", {
        class: "cc-titlebar",
        onMousedown: T
      }, [
        w[0] || (w[0] = ve("span", { class: "cc-status-dot" }, null, -1)),
        ve("span", Da, Oe(n.title), 1),
        R.value ? (Te(), Ce("span", Fa, Oe(R.value), 1)) : Ge("", !0),
        ve("div", Aa, [
          ve("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: it(te, ["stop"])
          }, "─"),
          ve("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: it(ne, ["stop"])
          }, Oe(u.value.maximized ? "⤡" : "⤢"), 9, _a),
          ve("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: it(ee, ["stop"])
          }, "✕")
        ])
      ], 32),
      zn(ve("div", Ba, [
        ve("div", {
          ref_key: "bodyEl",
          ref: V,
          class: "cc-screen",
          onScroll: $
        }, [
          fn(i.$slots, "default", { resizeKey: q.value }, void 0, !0),
          w[1] || (w[1] = ve("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [pl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (Te(), Ce("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: it(N, ["stop"])
      }, null, 32)) : Ge("", !0)
    ], 46, Ea)) : Ge("", !0);
  }
}), Qa = /* @__PURE__ */ Je(Ya, [["__scopeId", "data-v-ca0af4ca"]]), $a = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ha = `
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
`, za = 100, Va = /* @__PURE__ */ je({
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
    let c, f, u, p, m, x = null, k = 0;
    function T(y) {
      y - k >= za && (L(), k = y), x = requestAnimationFrame(T);
    }
    function v() {
      if (!l.value || !m) return;
      const y = l.value.clientWidth, R = l.value.clientHeight;
      y <= 0 || R <= 0 || m.width === y && m.height === R || (m.width = y, m.height = R, s && s.setSize(y, R, !1), a.value && (a.value.width = y, a.value.height = R, a.value.style.width = y + "px", a.value.style.height = R + "px"));
    }
    function h() {
      if (!(m != null && m.width)) return;
      const y = m.getContext("2d");
      if (!y) return;
      const R = m.width, N = m.height, E = e[t.theme] ?? e.none;
      y.clearRect(0, 0, R, N), y.fillStyle = E.bg, y.fillRect(0, 0, R, N);
      const Z = Date.now(), q = (Z / 500 | 0) % 2 === 0, V = (Z / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(R, N) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = E.text, t.glow && (y.shadowColor = E.text, y.shadowBlur = 14);
      const J = ".".repeat(V).padEnd(3, " "), $ = `${t.label}${J}`;
      if (y.fillText($, R / 2, N / 2), y.shadowBlur = 0, q) {
        const _ = y.measureText($), te = y.measureText("M").width, ne = parseFloat(y.font), ee = R / 2 + _.width / 2 + 4, j = N / 2 - ne / 2 + 2;
        y.fillStyle = E.cursor, t.glow && (y.shadowColor = E.cursor, y.shadowBlur = 12), y.fillRect(ee, j, te * 0.7, ne * 0.95), y.shadowBlur = 0;
      }
    }
    function L() {
      if (!m) return;
      if (h(), o) {
        if (!a.value) return;
        const R = a.value.getContext("2d");
        R && R.drawImage(m, 0, 0);
        return;
      }
      if (!s || !u || !p) return;
      const y = t.theme === "paper";
      u.uniforms.uStrength.value = Ke(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, p.needsUpdate = !0, s.render(c, f);
    }
    function I() {
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
        s.setPixelRatio(1), s.setClearColor(0, 0), c = new Y.Scene(), f = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), p = new Y.CanvasTexture(m), p.minFilter = Y.LinearFilter, p.magFilter = Y.LinearFilter, u = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: p },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: $a,
          fragmentShader: Ha,
          transparent: !0
        }), c.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), u)), v();
      }
    }
    let W = null;
    Ne(() => {
      I(), L(), x = requestAnimationFrame(T), l.value && (W = new ResizeObserver(() => v()), W.observe(l.value));
    }), Ze(() => {
      x !== null && cancelAnimationFrame(x), W == null || W.disconnect(), d(), p == null || p.dispose(), u == null || u.dispose();
    }), Q(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => L());
    const M = se(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (y, R) => (Te(), Ce("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ue(M.value)
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), eo = /* @__PURE__ */ Je(Va, [["__scopeId", "data-v-d00e5f47"]]), qt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, $n = (n, t) => t === "left" ? n.left : t === "right" ? n.right : !t || t === "neutral" ? n.dim : t, Me = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ye = 12;
function un(n, t, e) {
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
function Rt(n, t, e, l, a, s) {
  const o = Math.min(s, l / 2, a / 2);
  n.beginPath(), n.moveTo(t + o, e), n.lineTo(t + l - o, e), n.quadraticCurveTo(t + l, e, t + l, e + o), n.lineTo(t + l, e + a - o), n.quadraticCurveTo(t + l, e + a, t + l - o, e + a), n.lineTo(t + o, e + a), n.quadraticCurveTo(t, e + a, t, e + a - o), n.lineTo(t, e + o), n.quadraticCurveTo(t, e, t + o, e), n.closePath();
}
function Oa(n, t) {
  var R, N;
  const e = n.getContext("2d");
  if (!e) return 0;
  const l = t.dpr || 1, a = n.width / l, s = n.height / l, o = { ...qt[t.theme] ?? qt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(l, 0, 0, l, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, a, s);
  const d = (E) => E > 0 ? o.right : E < 0 ? o.left : o.neutral, c = d(t.value), f = (E, Z = 10) => {
    t.glow && (e.shadowColor = E, e.shadowBlur = Z);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, p = Math.max(40, a - ye * 2);
  let m = ye;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const x = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${Me}`;
  const k = e.measureText(x).width;
  e.fillStyle = c, f(c, 14), e.fillText(x, ye, m + 30), u();
  const T = ye + k + 14;
  t.stance && (e.font = `700 14px ${Me}`, e.fillStyle = c, f(c, 8), e.fillText(t.stance.toUpperCase(), T, m + 15), u()), t.sub && (e.font = `11px ${Me}`, e.fillStyle = o.dim, e.fillText(t.sub, T, m + 31)), m += 48, e.font = `700 9px ${Me}`;
  const v = t.leftLabel.toUpperCase(), h = t.rightLabel.toUpperCase(), L = e.measureText(v).width, I = e.measureText(h).width, W = ye + L + 8, M = a - ye - I - 8, y = m + 10;
  if (e.fillStyle = o.left, e.fillText(v, ye, y + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(h, a - ye, y + 3), e.textAlign = "left", M - W > 24) {
    const E = e.createLinearGradient(W, 0, M, 0);
    E.addColorStop(0, o.left), E.addColorStop(0.45, o.surface), E.addColorStop(0.55, o.surface), E.addColorStop(1, o.right), Rt(e, W, y - 4, M - W, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = E, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const Z = (W + M) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(Z, y - 8), e.lineTo(Z, y + 8), e.stroke();
    for (const _ of [0.25, 0.75]) {
      const te = W + _ * (M - W);
      e.beginPath(), e.moveTo(te, y - 5), e.lineTo(te, y + 5), e.stroke();
    }
    const q = t.max - t.min || 1, V = Math.max(0, Math.min(1, (t.shown - t.min) / q)), J = W + V * (M - W), $ = d(t.shown);
    e.beginPath(), e.moveTo(J, y - 10), e.lineTo(J - 4.5, y - 17), e.lineTo(J + 4.5, y - 17), e.closePath(), e.fillStyle = $, e.fill(), e.beginPath(), e.arc(J, y, 6.5, 0, Math.PI * 2), e.fillStyle = $, f($, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
    for (const _ of t.marks ?? []) {
      const te = (_.value - t.min) / q;
      if (te < 0 || te > 1) continue;
      const ne = W + te * (M - W), ee = $n(o, _.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = ee, e.lineWidth = 1, e.beginPath(), e.moveTo(ne, y - 9), e.lineTo(ne, y + 9), e.stroke(), e.restore(), _.label) {
        e.font = `700 8px ${Me}`, e.fillStyle = ee;
        const j = e.measureText(_.label).width;
        e.fillText(_.label, Math.max(W, Math.min(M - j, ne - j / 2)), y + 20);
      }
    }
  }
  if (m += (R = t.marks) != null && R.some((E) => E.label) ? 42 : 30, t.meter) {
    const E = t.meter, Z = E.min ?? 0, q = E.max ?? 1, V = q - Z || 1, J = E.tone === "up" ? o.right : E.tone === "down" ? o.left : E.tone === "warn" ? o.warn : o.neutral;
    E.label && (e.font = `700 9px ${Me}`, e.fillStyle = o.dim, e.fillText(E.label.toUpperCase(), ye, m + 9)), E.hint && (e.font = `9px ${Me}`, e.fillStyle = o.dim, e.textAlign = "right", e.fillText(E.hint, a - ye, m + 9), e.textAlign = "left"), (E.label || E.hint) && (m += 15), e.font = `700 12px ${Me}`;
    const $ = E.valueText ?? (E.value == null ? "—" : String(E.value)), _ = e.measureText($).width, te = ye, ne = a - ye - _ - 10, ee = m + 6, j = !!((N = E.thresholds) != null && N.some((i) => i.label));
    if (ne - te > 24) {
      if (Rt(e, te, ee - 5, ne - te, 10, 5), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), E.value != null) {
        const i = Math.max(0, Math.min(1, (E.value - Z) / V));
        i > 0 && (e.save(), Rt(e, te, ee - 5, ne - te, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = J, f(J, 8), e.fillRect(te, ee - 5, (ne - te) * i, 10), e.restore());
      }
      for (const i of E.thresholds ?? []) {
        const w = (i.value - Z) / V;
        if (w < 0 || w > 1) continue;
        const B = te + w * (ne - te), C = $n(o, i.color);
        if (e.strokeStyle = C, e.lineWidth = 1, e.beginPath(), e.moveTo(B, ee - 7), e.lineTo(B, ee + 7), e.stroke(), i.label) {
          e.font = `700 7.5px ${Me}`, e.fillStyle = C;
          const H = e.measureText(i.label).width;
          e.fillText(i.label, Math.max(te, Math.min(ne - H, B - H / 2)), ee + 17);
        }
      }
    }
    e.font = `700 12px ${Me}`, e.fillStyle = J, e.textAlign = "right", f(J, 8), e.fillText($, a - ye, ee + 4), u(), e.textAlign = "left", m += j ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${Me}`;
    const E = un(e, t.caption, p - 18), Z = E.length * 15 + 12;
    Rt(e, ye, m, p, Z, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, E.forEach((q, V) => e.fillText(q, ye + 9, m + 17 + V * 15)), m += Z + 10;
  }
  if (t.note) {
    e.font = `10px ${Me}`, e.fillStyle = o.dim;
    const E = un(e, t.note, p);
    E.forEach((Z, q) => e.fillText(Z, ye, m + 10 + q * 14)), m += E.length * 14 + 10;
  }
  if (t.items.length) {
    let q = ye;
    for (const V of t.items) {
      const J = V.side === "left" ? o.left : V.side === "right" ? o.right : o.neutral, $ = V.side === "left" ? t.sideLetters[0] : V.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${Me}`;
      const _ = e.measureText(V.label).width;
      e.font = `700 8px ${Me}`;
      const te = $ ? e.measureText($).width + 6 : 0;
      e.font = `10px ${Me}`;
      const ne = V.value ? e.measureText(V.value).width : 0, ee = 7 + _ + ($ ? 4 + te : 0) + (V.value ? 4 + ne : 0) + 7;
      q + ee > a - ye && q > ye && (q = ye, m += 23), Rt(e, q, m, ee, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = J, e.fillRect(q, m + 1, 2, 16);
      let j = q + 7;
      e.font = `700 10px ${Me}`, e.fillStyle = o.text, e.fillText(V.label, j, m + 12.5), j += _ + 4, $ && (e.font = `700 8px ${Me}`, e.fillStyle = J, e.fillText($, j + 3, m + 12), j += te + 4), V.value && (e.font = `10px ${Me}`, e.fillStyle = V.tone === "up" ? o.right : V.tone === "down" ? o.left : o.dim, e.fillText(V.value, j, m + 12.5)), q += ee + 5;
    }
    m += 18;
  } else if (t.emptyText) {
    e.font = `10px ${Me}`, e.fillStyle = o.dim;
    const E = un(e, t.emptyText, p);
    E.forEach((Z, q) => e.fillText(Z, ye, m + 10 + q * 14)), m += E.length * 14;
  }
  return m + ye;
}
const Na = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Xa = /* @__PURE__ */ je({
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
        s.value = t.value, N();
        return;
      }
      const j = () => {
        const i = t.value - s.value;
        if (Math.abs(i) < 4e-3) {
          s.value = t.value, N();
          return;
        }
        s.value += i * 0.18, N(), o = requestAnimationFrame(j);
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
    let p, m, x, k, T, v = 1, h = 0, L = 0;
    const I = { x: me.x, y: me.y }, W = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Dt}

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

  ${Ft}

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
    ${At}
    gl_FragColor = color;
  }
`;
    function M() {
      if (!(!l.value || !e.value)) {
        T = document.createElement("canvas");
        try {
          c = new Y.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !c.getContext() && (c.dispose(), c = null, f = !0), f) {
          y();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), p = new Y.Scene(), m = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), k = new Y.CanvasTexture(T), k.minFilter = Y.LinearFilter, k.magFilter = Y.LinearFilter, x = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: k },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ..._t()
          },
          vertexShader: Na,
          fragmentShader: W,
          transparent: !0
        }), p.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), x)), y();
      }
    }
    function y() {
      if (!e.value || !T || !c && !f) return;
      const j = e.value.clientWidth, i = e.value.clientHeight;
      if (!j || !i) return;
      const w = Math.min(window.devicePixelRatio || 1, 2), B = Math.round(j * w), C = Math.round(i * w);
      T.width === B && T.height === C && v === w || (v = w, h = j, L = i, T.width = B, T.height = C, c ? (k && (k.dispose(), k = new Y.CanvasTexture(T), k.minFilter = Y.LinearFilter, k.magFilter = Y.LinearFilter, x && (x.uniforms.uTex.value = k)), c.setPixelRatio(v), c.setSize(j, i)) : l.value && (l.value.width = B, l.value.height = C, l.value.style.width = j + "px", l.value.style.height = i + "px"), N());
    }
    function R(j) {
      Oa(T, {
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
    function N() {
      if (!(T != null && T.width)) return;
      if (f) {
        if (!l.value) return;
        R(!1);
        const i = l.value.getContext("2d");
        i && (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, l.value.width, l.value.height), i.drawImage(T, 0, 0));
        return;
      }
      if (!c || !x || !k) return;
      const j = t.theme === "paper";
      x.uniforms.uStrength.value = Ke(t.curvature), x.uniforms.uScanlines.value = t.scanlines && !j ? 1 : 0, x.uniforms.uVignette.value = j ? 0 : 1, Bt(x, t.magnify, I, h || T.width, L || T.height), R(t.glow), k.needsUpdate = !0, c.render(p, m);
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
      () => N(),
      { deep: !0 }
    ), Q(() => t.magnify, (j) => {
      j || (I.x = me.x, I.y = me.y), N();
    });
    function E(j) {
      if (!t.magnify || !l.value) return;
      const i = Wt(j, l.value);
      I.x = i.x, I.y = i.y, N();
    }
    function Z() {
      I.x = me.x, I.y = me.y, N();
    }
    let q = null, V = null, J = 0;
    const $ = Et("cathodeResetTick", z(0));
    Q($, () => _());
    function _() {
      cancelAnimationFrame(J), J = requestAnimationFrame(y);
    }
    function te(j) {
      j.preventDefault();
    }
    function ne() {
      c == null || c.dispose(), c = null, f = !1, M();
    }
    Ne(() => {
      De(() => {
        var j;
        M(), l.value && (l.value.addEventListener("webglcontextlost", te), l.value.addEventListener("webglcontextrestored", ne)), e.value && (q = new ResizeObserver(() => y()), q.observe(e.value), V = new IntersectionObserver((i) => {
          i.some((w) => w.isIntersecting) && _();
        }), V.observe(e.value)), window.addEventListener("resize", _), (j = window.visualViewport) == null || j.addEventListener("resize", _), d();
      });
    }), Ze(() => {
      var j, i, w;
      cancelAnimationFrame(o), cancelAnimationFrame(J), (j = l.value) == null || j.removeEventListener("webglcontextlost", te), (i = l.value) == null || i.removeEventListener("webglcontextrestored", ne), q == null || q.disconnect(), V == null || V.disconnect(), window.removeEventListener("resize", _), (w = window.visualViewport) == null || w.removeEventListener("resize", _), u(), k == null || k.dispose(), x == null || x.dispose();
    });
    const ee = se(() => ({
      background: (qt[t.theme] ?? qt.none).bg
    }));
    return (j, i) => (Te(), Ce("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: Ue(ee.value)
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-gauge-canvas",
        onMousemove: E,
        onMouseleave: Z
      }, null, 544)
    ], 4));
  }
}), to = /* @__PURE__ */ Je(Xa, [["__scopeId", "data-v-f8c2302b"]]);
export {
  wt as CANDLE_THEME_COLORS,
  qa as CathodeCandle,
  ja as CathodeCandleGrid,
  Qa as CathodeContainer,
  to as CathodeGauge,
  Ga as CathodeGrid,
  eo as CathodeLoader,
  Ol as CathodeLog,
  Ka as CathodeTerminal,
  Ja as CathodeWorkspace,
  qt as GAUGE_THEME_COLORS,
  Ut as LOG_THEME_COLORS,
  Za as buildDefaultLayout,
  jn as useCathodeLayout
};
