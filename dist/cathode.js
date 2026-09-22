import { defineComponent as Qe, ref as W, reactive as qt, watch as K, nextTick as _e, computed as ae, inject as Ht, onMounted as Ne, onUnmounted as et, openBlock as xe, createElementBlock as be, normalizeStyle as Ke, createElementVNode as me, withModifiers as ot, withKeys as Tn, createCommentVNode as Oe, toDisplayString as ze, createVNode as An, withDirectives as _n, vModelText as ll, provide as Cn, renderSlot as on, Transition as ol, withCtx as al, Fragment as rl, renderList as il, createTextVNode as sl, normalizeClass as cl, vShow as ul } from "vue";
import * as $ from "three";
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
}, ye = 30, an = 12, fl = 10, At = 14, Bn = 5;
function _t() {
  return `${an}px system-ui, -apple-system, sans-serif`;
}
function Wn(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const r = [];
  let f = "";
  for (const v of a) {
    const h = f ? f + " " + v : v;
    !f || t.measureText(h).width <= e ? f = h : (r.push(f), f = v);
  }
  return f && r.push(f), r.length ? r : [""];
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
  const l = t.width, a = t.height, r = Ge[n.theme] ?? Ge.none, { cols: f, rows: v, pinnedRows: h, rowHeight: s, scrollY: u, scrollX: m, glow: p } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const S = h.length * s, C = n.aggregateRow ? Yn : 0, E = a - ye - S - C;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, ye), e.textBaseline = "middle", e.textAlign = "left";
  let c = -m;
  for (let X = 0; X < f.length; X++) {
    const i = f[X];
    if (c + i.width <= 0) {
      c += i.width;
      continue;
    }
    if (c >= l) break;
    const w = !!n.colFilters[i.colId], F = n.sortColId === i.colId, A = (i.colDef.headerName ?? i.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(c, 0, i.width, ye), e.clip(), e.font = `bold ${fl}px system-ui, -apple-system, sans-serif`, e.fillStyle = w ? r.accent : r.textHeader, p ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(A, c + 8, ye / 2), e.shadowBlur = 4, e.fillText(A, c + 8, ye / 2), e.shadowBlur = 0) : e.fillText(A, c + 8, ye / 2), F) {
      const _ = e.measureText(A).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", c + 8 + _ + 4, ye / 2);
    }
    i.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = w ? r.accent : r.textHeader, e.globalAlpha = w ? 1 : 0.38, e.fillText("⌕", c + i.width - 20, ye / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(c + i.width - 0.5, 0), e.lineTo(c + i.width - 0.5, ye), e.stroke(), c += i.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ye - 0.5), e.lineTo(l, ye - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ye, l, E), e.clip();
  const g = n.rowHeights && n.rowHeights.length === v.length ? n.rowHeights : null, T = g ? un(g, v.length) : null, D = (X) => T ? T[X] : X * s, N = (X) => g ? g[X] : s, M = T ? Bt(T, u) : Math.max(0, Math.floor(u / s));
  let y;
  if (T)
    for (y = M; y < v.length && D(y) < u + E; ) y++;
  else
    y = Math.min(v.length, Math.ceil((u + E) / s));
  const k = n.selectionAnchorRow ?? n.selectedRow, G = n.selectionAnchorCol ?? n.selectedCol, j = n.selectedRow >= 0 && k >= 0 ? Math.min(n.selectedRow, k) : -1, te = n.selectedRow >= 0 && k >= 0 ? Math.max(n.selectedRow, k) : -1, ne = n.selectedCol >= 0 && G >= 0 ? Math.min(n.selectedCol, G) : -1, q = n.selectedCol >= 0 && G >= 0 ? Math.max(n.selectedCol, G) : -1, Z = te > j || q > ne;
  let O = Number.POSITIVE_INFINITY, U = Number.NEGATIVE_INFINITY, fe = Number.POSITIVE_INFINITY, se = Number.NEGATIVE_INFINITY;
  const ie = (X, i, w, F) => {
    p ? (e.shadowColor = F, e.shadowBlur = 12, e.fillText(X, i, w), e.shadowBlur = 6, e.fillText(X, i, w), e.shadowBlur = 2, e.fillText(X, i, w), e.shadowBlur = 0) : e.fillText(X, i, w);
  };
  for (let X = M; X < y; X++) {
    const i = v[X], w = N(X), F = ye + D(X) - u;
    X % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, F, l, w));
    const A = X >= j && X <= te;
    X === n.hoveredRow && !A && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, F, l, w)), A && !Z && (e.fillStyle = Zt(r.accent, 0.1), e.fillRect(0, F, l, w)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + w - 0.5), e.lineTo(l, F + w - 0.5), e.stroke();
    let _ = -m;
    for (let Y = 0; Y < f.length; Y++) {
      const H = f[Y];
      if (_ + H.width <= 0) {
        _ += H.width;
        continue;
      }
      if (_ >= l) break;
      const ce = A && Y >= ne && Y <= q;
      ce && Z && (e.fillStyle = Zt(r.accent, 0.14), e.fillRect(_, F, H.width, w)), ce && (_ < O && (O = _), _ + H.width > U && (U = _ + H.width), F < fe && (fe = F), F + w > se && (se = F + w));
      const Q = n.getCellStyle(H, i), he = Q.color ?? r.text, Ie = Q.textAlign ?? "left", le = n.formatCell(H, i);
      if (e.save(), e.beginPath(), e.rect(_ + 1, F, H.width - 2, w), e.clip(), e.font = _t(), e.fillStyle = he, e.textBaseline = "middle", H.colDef.wrap) {
        e.textAlign = "left";
        const R = Wn(e, le, Math.max(20, H.width - 16));
        let V = F + Bn + At / 2;
        for (const re of R) {
          if (V - At / 2 >= F + w) break;
          ie(re, _ + 8, V, he), V += At;
        }
      } else {
        const R = Ie === "right" ? _ + H.width - 8 : _ + 8;
        e.textAlign = Ie === "right" ? "right" : "left", ie(le, R, F + w / 2, he);
      }
      e.restore(), X === n.selectedRow && Y === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(_ + 1.5, F + 1.5, H.width - 3, w - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(_ + H.width - 0.5, F), e.lineTo(_ + H.width - 0.5, F + w), e.stroke(), _ += H.width;
    }
  }
  if (Z && O < U && fe < se && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(O + 0.5, fe + 0.5, U - O - 1, se - fe - 1)), e.restore(), h.length > 0) {
    const X = a - S - C;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, X - 0.5), e.lineTo(l, X - 0.5), e.stroke();
    for (let i = 0; i < h.length; i++) {
      const w = h[i], F = X + i * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, F, l, s);
      let A = -m;
      for (let _ = 0; _ < f.length; _++) {
        const Y = f[_];
        if (A + Y.width <= 0) {
          A += Y.width;
          continue;
        }
        if (A >= l) break;
        const H = n.getCellStyle(Y, w), ce = H.color ?? r.text, Q = H.textAlign ?? "left", he = n.formatCell(Y, w);
        e.save(), e.beginPath(), e.rect(A + 1, F, Y.width - 2, s), e.clip(), e.font = `bold ${an}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle", Q === "right" ? (e.textAlign = "right", e.fillText(he, A + Y.width - 8, F + s / 2)) : (e.textAlign = "left", e.fillText(he, A + 8, F + s / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(A + Y.width - 0.5, F), e.lineTo(A + Y.width - 0.5, F + s), e.stroke(), A += Y.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + s - 0.5), e.lineTo(l, F + s - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const X = a - C;
    e.fillStyle = Zt(r.accent, 0.1), e.fillRect(0, X, l, C), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, X - 0.5), e.lineTo(l, X - 0.5), e.stroke();
    let i = -m;
    for (let w = 0; w < f.length; w++) {
      const F = f[w];
      if (i + F.width <= 0) {
        i += F.width;
        continue;
      }
      if (i >= l) break;
      const _ = n.getCellStyle(F, n.aggregateRow).textAlign ?? "left", Y = n.aggregateRow[F.colId] ?? "";
      e.save(), e.beginPath(), e.rect(i + 1, X, F.width - 2, C), e.clip(), e.font = `bold ${an}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", p && (e.shadowColor = r.accent, e.shadowBlur = 8), _ === "right" ? (e.textAlign = "right", e.fillText(Y, i + F.width - 8, X + C / 2)) : (e.textAlign = "left", e.fillText(Y, i + 8, X + C / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(i + F.width - 0.5, X), e.lineTo(i + F.width - 0.5, X + C), e.stroke(), i += F.width;
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
  const l = Math.max(4, Math.min(n, t - Et - 4)), a = ye + 6, r = e ? 26 : 0;
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
  const { box: r, input: f, clear: v } = n;
  t.save(), t.fillStyle = "rgba(8,12,22,0.94)", t.strokeStyle = a.accent, t.lineWidth = 1, t.beginPath(), t.roundRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1, 4), t.fill(), t.stroke(), t.fillStyle = "rgba(255,255,255,0.05)", t.beginPath(), t.roundRect(f.x, f.y, f.w, f.h, 3), t.fill(), t.beginPath(), t.rect(f.x, f.y, f.w, f.h), t.clip(), t.font = _t(), t.textBaseline = "middle";
  const h = f.y + f.h / 2 + 1, s = 5;
  if (e) {
    t.fillStyle = a.text;
    const u = t.measureText(e).width, m = u > f.w - 2 * s - 2 ? f.x + f.w - s - 2 - u : f.x + s;
    t.fillText(e, m, h), l && (t.fillStyle = a.accent, t.fillRect(Math.min(m + u + 1, f.x + f.w - s), f.y + 4, 1.5, f.h - 8));
  } else
    t.fillStyle = a.textHeader, t.fillText("Filter…", f.x + s, h), l && (t.fillStyle = a.accent, t.fillRect(f.x + s, f.y + 4, 1.5, f.h - 8));
  t.restore(), v && (t.save(), t.font = _t(), t.textBaseline = "middle", t.textAlign = "center", t.fillStyle = a.textHeader, t.fillText("✕", v.x + v.w / 2, v.y + v.h / 2 + 1), t.restore());
}
function gl(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = Math.abs(e), f = (l * l + a * a) * r;
  if (e < 0) {
    const s = 0.5 * r, m = 1 / (1 - 2 * (0.5 * (1 + s) * s)), p = (l + l * (1 + f) * f * -1) * m, S = (a + a * (1 + f) * f * -1) * m;
    return [0.5 + p, 0.5 + S];
  }
  const v = l * (1 + f) * f, h = a * (1 + f) * f;
  return [t + v, n + h * 0.15];
}
function Pn(t, n, e, l, a, r = e, f = l) {
  const v = t / e, h = 1 - n / l, [s, u] = gl(v, h, a);
  return s < 0 || s > 1 || u < 0 || u > 1 ? [-1, -1] : [s * r, (1 - u) * f];
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
function Ln(t, n, e, l, a, r, f, v, h, s = !1, u) {
  const m = t + h;
  let p = -1, S = 0;
  for (let T = 0; T < e.length; T++) {
    if (m >= S && m < S + e[T].width) {
      p = T;
      break;
    }
    S += e[T].width;
  }
  if (n < ye) return { area: "header", colIdx: p, rowIdx: -1 };
  const C = s ? Yn : 0;
  if (C > 0 && n >= f - C)
    return { area: "agg", colIdx: p, rowIdx: -1 };
  const E = v * a;
  if (E > 0 && n >= f - E - C) {
    const T = Math.floor((n - (f - E - C)) / a);
    return { area: "pinned", colIdx: p, rowIdx: T };
  }
  const c = n - ye + r, g = u && u.length === l ? Bt(un(u, l), c) : Math.floor(c / a);
  return g >= 0 && g < l ? { area: "body", colIdx: p, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
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
    uMouseUV: { value: new $.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: xl },
    uLensTint: { value: new $.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
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
    const e = t, l = n, a = W(e.rowData ?? []), r = W(e.pinnedBottomRowData ?? []), f = W(""), v = W(null), h = qt({}), s = qt({}), u = qt(/* @__PURE__ */ new Set()), m = W(0), p = W(0), S = W(0), C = W(0), E = W(0), c = W(0), g = W(0), T = W(-1), D = W(null), N = W(null), M = W(null), y = { ...Me }, k = W(""), G = W(0), j = W(null);
    let te = null;
    const ne = W(!0);
    let q = null;
    K(M, (o) => {
      var d;
      q && (clearInterval(q), q = null), o ? (ne.value = !0, q = setInterval(() => {
        ne.value = !ne.value, we();
      }, 530), _e(() => {
        var x;
        return (x = j.value) == null ? void 0 : x.focus();
      })) : (te = null, (d = j.value) == null || d.blur()), we();
    });
    function Z(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const O = ae(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((d) => !u.has(Z(d))).map((d) => {
        const x = Z(d), L = { ...o, ...d };
        return { colId: x, colDef: L, width: s[x] ?? L.width ?? 100 };
      });
    }), U = ae(() => {
      const o = p.value;
      if (!o) return O.value;
      const d = O.value.reduce((I, B) => I + B.width, 0);
      if (!d || d >= o) return O.value;
      const x = o / d;
      let L = 0;
      return O.value.map((I, B) => {
        const ve = B === O.value.length - 1 ? o - L : Math.max(8, Math.round(I.width * x));
        return L += ve, { ...I, width: ve };
      });
    }), fe = ae(() => {
      const o = U.value.reduce((d, x) => d + x.width, 0);
      return Math.max(0, o - p.value);
    });
    let se = null;
    function ie() {
      if (typeof document > "u") return null;
      se || (se = document.createElement("canvas"));
      const o = se.getContext("2d");
      return o && (o.font = _t()), o;
    }
    const X = ae(() => U.value.some((o) => o.colDef.wrap)), i = ae(() => {
      if (!X.value) return null;
      const o = ie();
      if (!o) return null;
      const d = U.value.filter((L) => L.colDef.wrap), x = e.rowHeight;
      return le.value.map((L) => {
        let I = 1;
        for (const B of d) {
          const z = Wn(o, he(B, L), Math.max(20, B.width - 16));
          z.length > I && (I = z.length);
        }
        return dl(I, x);
      });
    }), w = ae(
      () => i.value ? un(i.value, le.value.length) : null
    ), F = ae(
      () => w.value ? w.value[le.value.length] : le.value.length * e.rowHeight
    ), A = ae(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, S.value - ye - o);
    }), _ = ae(
      () => Math.max(0, F.value - A.value)
    ), Y = ae(
      () => Math.max(1, Math.floor(A.value / e.rowHeight))
    ), H = ae(() => {
      const o = le.value.length;
      if (o === 0) return 0;
      const d = w.value ? Bt(w.value, c.value) : Math.floor(c.value / e.rowHeight);
      return Math.min(o - 1, d);
    }), ce = ae(() => {
      const o = le.value.length;
      return o === 0 ? 0 : w.value ? Math.min(o - 1, Bt(w.value, c.value + A.value - 1)) : Math.min(o - 1, H.value + Y.value - 1);
    });
    function Q(o, d) {
      if (d.colDef.valueGetter) return d.colDef.valueGetter({ data: o, colDef: d.colDef });
      if (d.colDef.field) return o[d.colDef.field];
    }
    function he(o, d) {
      const x = Q(d, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: d, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: d, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function Ie(o, d) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: Q(d, o), data: d, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const le = ae(() => {
      m.value;
      let o = a.value;
      const d = f.value.trim().toLowerCase();
      d && (o = o.filter(
        (x) => O.value.some(
          (L) => String(Q(x, L) ?? "").toLowerCase().includes(d)
        )
      ));
      for (const [x, L] of Object.entries(h)) {
        if (!L) continue;
        const I = O.value.find((B) => B.colId === x);
        if (I)
          if (L.startsWith("__eq__")) {
            const B = L.slice(6).toLowerCase();
            o = o.filter((z) => String(Q(z, I) ?? "").toLowerCase() === B);
          } else {
            const B = L.toLowerCase();
            o = o.filter((z) => String(Q(z, I) ?? "").toLowerCase().includes(B));
          }
      }
      if (v.value) {
        const { colId: x, dir: L } = v.value, I = O.value.find((B) => B.colId === x);
        I && (o = [...o].sort((B, z) => {
          const ve = Q(B, I), oe = Q(z, I);
          let ge = 0;
          return I.colDef.comparator ? ge = I.colDef.comparator(ve, oe) : typeof ve == "number" && typeof oe == "number" ? ge = ve - oe : ge = String(ve ?? "").localeCompare(String(oe ?? ""), void 0, { numeric: !0 }), L === "asc" ? ge : -ge;
        }));
      }
      return o;
    }), R = ae(() => {
      const o = O.value.filter((I) => I.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const d = le.value, x = {};
      for (const I of o) {
        const B = d.map((ve) => Q(ve, I)), z = vl(B, I.colDef.aggFunc);
        if (z == null) {
          x[I.colId] = "";
          continue;
        }
        x[I.colId] = I.colDef.aggValueFormatter ? I.colDef.aggValueFormatter(z) : String(z);
      }
      const L = o[0].colId;
      return x[L] === "" && (x[L] = "Σ"), x;
    });
    K(le, () => {
      c.value = 0, D.value = null;
    }), K(fe, () => {
      g.value = Math.min(g.value, fe.value);
    }), K(_, () => {
      c.value = Math.min(c.value, _.value);
    });
    function V(o) {
      const d = w.value, x = d ? d[o] : o * e.rowHeight, L = d ? d[o + 1] : x + e.rowHeight;
      x < c.value ? c.value = x : L > c.value + A.value && (c.value = Math.min(_.value, L - A.value));
    }
    function re() {
      c.value = Math.max(0, c.value - A.value), we();
    }
    function Se() {
      c.value = Math.min(_.value, c.value + A.value), we();
    }
    let pe = !1, Pe = "", it = 0, st = 0, nt = 1, Re = !1, Ee = !1, De = 0, Fe = 0, Ue = 0, ct = 0, Le = !1;
    function It(o, d, x = 1) {
      var L;
      pe = !0, Pe = o, it = d, nt = x, st = ((L = U.value.find((I) => I.colId === o)) == null ? void 0 : L.width) ?? 100, Re = !1;
    }
    function pt(o) {
      if (Ee) {
        const B = De - o.clientX, z = Fe - o.clientY;
        (Math.abs(B) > 4 || Math.abs(z) > 4) && (Le = !0), g.value = Math.max(0, Math.min(fe.value, Ue + B)), c.value = Math.max(0, Math.min(_.value, ct + z)), we();
        return;
      }
      if (!pe) return;
      const d = p.value, x = Math.max(30, st + (o.clientX - it) * nt), L = O.value.filter((B) => B.colId !== Pe).reduce((B, z) => B + z.width, 0), I = d - x;
      I > 10 && (s[Pe] = Math.max(10, Math.round(x * L / I))), we();
    }
    function Lt() {
      Ee && (Le && (Re = !0), Ee = !1), pe && (pe = !1, Re = !0, l("column-resized"));
    }
    function Ut(o) {
      if (o.touches.length !== 1) return;
      const d = o.touches[0];
      Ee = !0, Le = !1, De = d.clientX, Fe = d.clientY, Ue = g.value, ct = c.value;
    }
    function b(o) {
      if (!Ee || o.touches.length !== 1) return;
      o.preventDefault();
      const d = o.touches[0], x = De - d.clientX, L = Fe - d.clientY;
      (Math.abs(x) > 4 || Math.abs(L) > 4) && (Le = !0), g.value = Math.max(0, Math.min(fe.value, Ue + x)), c.value = Math.max(0, Math.min(_.value, ct + L)), we();
    }
    function P() {
      Ee && (Le && (Re = !0), Ee = !1);
    }
    const J = W(null), ee = W(null), Ve = Ht("cathodeResetTick", W(0));
    K(Ve, () => dt());
    let ue = null, ke = !1;
    function ut() {
      if (ue) {
        try {
          ue.forceContextLoss();
        } catch {
        }
        try {
          ue.dispose();
        } catch {
        }
        ue = null;
      }
    }
    let $e, gn, He, Ae, de;
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
      if (!(!ee.value || !J.value)) {
        de = document.createElement("canvas");
        try {
          ue = new $.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          ke = !0;
        }
        if (!ke && !ue.getContext() && (ue.dispose(), ue = null, ke = !0), ke) {
          ft();
          return;
        }
        ue.setPixelRatio(1), ue.setClearColor(0, 0), $e = new $.Scene(), gn = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), Ae = new $.CanvasTexture(de), Ae.minFilter = $.LinearFilter, Ae.magFilter = $.LinearFilter, He = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: Ae },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new $.Color(0) },
            ...Ot()
          },
          vertexShader: Tl,
          fragmentShader: Nn,
          transparent: !0
        }), $e.add(new $.Mesh(new $.PlaneGeometry(2, 2), He)), ft();
      }
    }
    function ft() {
      if (!J.value || !ue && !ke) return;
      const o = J.value.clientWidth, d = J.value.clientHeight - (e.pagination ? Cl : 0);
      if (!o || !d) return;
      C.value = o, E.value = d;
      const x = e.bendField ? Math.round(o * Hn(e.curvature)) : o, L = de.width !== x || de.height !== d;
      de.width = x, de.height = d, p.value = x, S.value = d, g.value = Math.max(0, Math.min(fe.value, g.value)), c.value = Math.max(0, Math.min(_.value, c.value)), ue ? (L && Ae && (Ae.dispose(), Ae = new $.CanvasTexture(de), Ae.minFilter = $.LinearFilter, Ae.magFilter = $.LinearFilter, He && (He.uniforms.uTex.value = Ae)), ue.setPixelRatio(window.devicePixelRatio || 1), ue.setSize(o, d)) : ee.value && (ee.value.width = o, ee.value.height = d, ee.value.style.width = o + "px", ee.value.style.height = d + "px"), we();
    }
    function we() {
      var x, L, I, B, z, ve, oe, ge, Be, bt, Mt, vt;
      if (!(de != null && de.width)) return;
      if (ke) {
        if (!ee.value) return;
        kn(de, {
          cols: U.value,
          rows: le.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: i.value ?? void 0,
          scrollY: c.value,
          scrollX: g.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = v.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((L = v.value) == null ? void 0 : L.dir) ?? null,
          colFilters: h,
          hoveredRow: T.value,
          selectedRow: ((I = D.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((B = D.value) == null ? void 0 : B.col) ?? -1,
          selectionAnchorRow: ((z = N.value) == null ? void 0 : z.row) ?? -1,
          selectionAnchorCol: ((ve = N.value) == null ? void 0 : ve.col) ?? -1,
          formatCell: he,
          getCellStyle: Ie
        }), wn();
        const St = ee.value.getContext("2d");
        St && St.drawImage(de, 0, 0, de.width, de.height, 0, 0, ee.value.width, ee.value.height);
        return;
      }
      if (!ue || !He || !Ae) return;
      const o = Ge[e.theme] ?? Ge.none, d = e.theme === "paper";
      He.uniforms.uStrength.value = Ze(e.curvature), He.uniforms.uScanlines.value = e.scanlines && !d ? 1 : 0, He.uniforms.uVignette.value = d ? 0 : 1, He.uniforms.uBezel.value.set(o.bg), Nt(He, e.magnify, y, C.value || de.width, E.value || de.height), kn(de, {
        cols: U.value,
        rows: le.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: i.value ?? void 0,
        scrollY: c.value,
        scrollX: g.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((oe = v.value) == null ? void 0 : oe.colId) ?? null,
        sortDir: ((ge = v.value) == null ? void 0 : ge.dir) ?? null,
        colFilters: h,
        hoveredRow: T.value,
        selectedRow: ((Be = D.value) == null ? void 0 : Be.row) ?? -1,
        selectedCol: ((bt = D.value) == null ? void 0 : bt.col) ?? -1,
        selectionAnchorRow: ((Mt = N.value) == null ? void 0 : Mt.row) ?? -1,
        selectionAnchorCol: ((vt = N.value) == null ? void 0 : vt.col) ?? -1,
        formatCell: he,
        getCellStyle: Ie,
        aggregateRow: R.value
      }), wn(), Ae.needsUpdate = !0, ue.render($e, gn);
    }
    function wn() {
      if (!M.value || !(de != null && de.width)) return;
      const o = de.getContext("2d");
      if (!o) return;
      te = hl(de.width, G.value, !!k.value);
      const d = Ge[e.theme] ?? Ge.none;
      ml(o, te, k.value, ne.value, d);
    }
    function Gt(o, d) {
      if (!ee.value) return [-1, -1];
      const x = ee.value.getBoundingClientRect(), L = o - x.left, I = d - x.top, B = x.width, z = x.height, ve = Ze(e.curvature), [oe, ge] = Pn(L, I, B, z, ve, de.width || B, de.height || z);
      return oe < 0 ? [-1, -1] : [oe, ge];
    }
    function Rt(o) {
      return Gt(o.clientX, o.clientY);
    }
    function lt(o) {
      if (!ee.value) return 1;
      const [d] = Gt(o.clientX - 4, o.clientY), [x] = Gt(o.clientX + 4, o.clientY);
      return d < 0 || x < 0 ? 1 : Math.max(1, Math.abs(x - d) / 8);
    }
    let Kt = 0;
    function Xn(o) {
      M.value = null;
      const d = Date.now();
      if (o.deltaX !== 0) {
        Kt = d, g.value = Math.max(0, Math.min(fe.value, g.value + o.deltaX)), we();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Kt = d, g.value = Math.max(0, Math.min(fe.value, g.value + o.deltaY)), we();
        return;
      }
      d - Kt < kl || (c.value = Math.max(0, Math.min(_.value, c.value + o.deltaY)), we());
    }
    function Un(o) {
      if (pe) return;
      if (e.magnify && ee.value) {
        const I = Xt(o, ee.value);
        y.x = I.x, y.y = I.y;
      }
      const [d, x] = Rt(o);
      if (d < 0) {
        T.value = -1, we();
        return;
      }
      if (M.value && te) {
        const I = Dt(d, x, te, lt(o));
        if (I !== "outside") {
          T.value = -1, ee.value.style.cursor = I === "clear" ? "pointer" : "text", we();
          return;
        }
      }
      const L = Ln(
        d,
        x,
        U.value,
        le.value.length,
        e.rowHeight,
        c.value,
        de.height,
        r.value.length,
        g.value,
        R.value !== null,
        i.value ?? void 0
      );
      if (T.value = L.area === "body" ? L.rowIdx : -1, L.area === "header" && L.colIdx >= 0) {
        const I = U.value[L.colIdx], B = en(L.colIdx, U.value), z = d + g.value;
        ee.value.style.cursor = I && In(z, B, I.width, lt(o)) ? "col-resize" : "pointer";
      } else L.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      we();
    }
    function Gn() {
      T.value = -1, y.x = Me.x, y.y = Me.y, we();
    }
    function Kn(o) {
      const [d, x] = Rt(o);
      if (d < 0 || M.value && te && Dt(d, x, te, lt(o)) !== "outside") return;
      if (x >= ye) {
        Ee = !0, Le = !1, De = o.clientX, Fe = o.clientY, Ue = g.value, ct = c.value;
        return;
      }
      const L = d + g.value, I = lt(o);
      for (let B = 0; B < U.value.length; B++) {
        const z = U.value[B], ve = en(B, U.value);
        if (z.colDef.resizable !== !1 && In(L, ve, z.width, I)) {
          It(z.colId, o.clientX, I);
          return;
        }
      }
    }
    function jn(o) {
      var I, B, z, ve;
      if (Re) {
        Re = !1;
        return;
      }
      if (pe) return;
      const [d, x] = Rt(o);
      if (d < 0) {
        M.value = null;
        return;
      }
      if (M.value && te) {
        const oe = Dt(d, x, te, lt(o));
        if (oe === "clear") {
          xn();
          return;
        }
        if (oe !== "outside") {
          (I = j.value) == null || I.focus();
          return;
        }
        M.value = null;
      }
      const L = Ln(
        d,
        x,
        U.value,
        le.value.length,
        e.rowHeight,
        c.value,
        de.height,
        r.value.length,
        g.value,
        R.value !== null,
        i.value ?? void 0
      );
      if (L.area === "header" && L.colIdx >= 0) {
        const oe = U.value[L.colIdx], ge = en(L.colIdx, U.value), Be = d + g.value;
        oe.colDef.filter && pl(Be, ge, oe.width, lt(o)) ? (o.stopPropagation(), M.value === oe.colId ? M.value = null : (M.value = oe.colId, k.value = (B = h[oe.colId]) != null && B.startsWith("__eq__") ? h[oe.colId].slice(6) : h[oe.colId] ?? "", G.value = Math.max(0, ge - g.value))) : oe.colDef.sortable !== !1 && (M.value = null, v.value = ((z = v.value) == null ? void 0 : z.colId) === oe.colId ? v.value.dir === "asc" ? { colId: oe.colId, dir: "desc" } : null : { colId: oe.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (M.value = null, L.area === "body" && L.rowIdx >= 0 && L.colIdx >= 0) {
        const oe = L.rowIdx;
        o.shiftKey && D.value ? (N.value || (N.value = { ...D.value }), D.value = { row: oe, col: L.colIdx }) : (D.value = { row: oe, col: L.colIdx }, N.value = { row: oe, col: L.colIdx }), (ve = ee.value) == null || ve.focus();
        const ge = le.value[oe], Be = U.value[L.colIdx];
        ge && Be && (l("row-clicked", { data: ge, event: o }), l("cell-selected", { data: ge, row: oe, col: L.colIdx, colId: Be.colId }));
      }
    }
    function yn(o) {
      if (M.value) {
        if (o.target === ee.value && te) {
          const [d, x] = Rt(o);
          if (d >= 0 && Dt(d, x, te, lt(o)) !== "outside") return;
        }
        M.value = null;
      }
    }
    function qn(o) {
      var I;
      if (!p.value) return;
      let d = 0;
      for (let B = 0; B < o; B++) d += U.value[B].width;
      const x = ((I = U.value[o]) == null ? void 0 : I.width) ?? 0, L = d - g.value;
      L < 0 ? g.value = Math.max(0, d) : L + x > p.value && (g.value = Math.min(fe.value, d + x - p.value));
    }
    function Zn(o) {
      const x = U.value.length - 1, L = le.value.length - 1;
      if (!D.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), D.value = { row: H.value, col: 0 }, N.value = { row: H.value, col: 0 });
        return;
      }
      let { row: I, col: B } = D.value;
      const z = (ve, oe, ge = !1) => {
        I = Math.max(0, Math.min(L, ve)), B = Math.max(0, Math.min(x, oe)), D.value = { row: I, col: B }, ge || (N.value = { row: I, col: B }), V(I), qn(B);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), z(I + 1, B, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), z(I - 1, B, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? z(I, B + 1, !0) : B < x ? z(I, B + 1) : z(I + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? z(I, B - 1, !0) : B > 0 ? z(I, B - 1) : z(I - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? B > 0 ? z(I, B - 1) : z(I - 1, x) : B < x ? z(I, B + 1) : z(I + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? z(I - 1, B) : z(I + 1, B);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(0, 0, o.shiftKey) : z(I, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(L, x, o.shiftKey) : z(I, x, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), z(Math.min(L, I + Y.value), B, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), z(Math.max(0, I - Y.value), B, o.shiftKey);
          break;
        case "Escape":
          D.value = null, N.value = null;
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
      const o = U.value, d = le.value, x = N.value ?? D.value, L = Math.min(x.row, D.value.row), I = Math.max(x.row, D.value.row), B = Math.min(x.col, D.value.col), z = Math.max(x.col, D.value.col), ve = [];
      for (let Be = L; Be <= I; Be++) {
        const bt = d[Be];
        if (!bt) continue;
        const Mt = [];
        for (let vt = B; vt <= z; vt++) {
          const St = o[vt];
          St && Mt.push(he(St, bt).replace(/[\t\r\n]+/g, " "));
        }
        ve.push(Mt.join("	"));
      }
      const oe = ve.join(`
`);
      (ge = navigator.clipboard) == null || ge.writeText(oe).catch(() => {
      });
    }
    function Qn(o) {
      const d = o.target.value;
      k.value = d, d ? h[M.value] = d : delete h[M.value], l("filter-changed");
    }
    function xn() {
      M.value && delete h[M.value], k.value = "", M.value = null, l("filter-changed");
    }
    const el = {
      setGridOption(o, d) {
        o === "rowData" ? a.value = d : o === "pinnedBottomRowData" ? r.value = d : o === "quickFilterText" && (f.value = d);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, L;
          const d = Z(o);
          return {
            colId: d,
            hide: u.has(d),
            sort: ((x = v.value) == null ? void 0 : x.colId) === d ? v.value.dir : null,
            sortIndex: ((L = v.value) == null ? void 0 : L.colId) === d ? 0 : null,
            width: s[d] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const d of o)
          d.hide === !0 && u.add(d.colId), d.hide === !1 && u.delete(d.colId), d.sort && (v.value = { colId: d.colId, dir: d.sort }), d.width && (s[d.colId] = d.width);
      },
      setFilterModel(o) {
        for (const d of Object.keys(h)) delete h[d];
        if (o)
          for (const [d, x] of Object.entries(o))
            (x == null ? void 0 : x.type) === "equals" ? h[d] = `__eq__${x.filter}` : x != null && x.filter && (h[d] = x.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [d, x] of Object.entries(h))
          x && (o[d] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return o;
      },
      async setColumnFilterModel(o, d) {
        d ? d.type === "equals" ? h[o] = `__eq__${d.filter}` : h[o] = d.filter ?? "" : delete h[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        m.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const d = O.value, x = d.map((z) => z.colDef.headerName ?? z.colId).join(","), L = le.value.map(
          (z) => d.map((ve) => `"${String(he(ve, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[x, ...L].join(`
`)], { type: "text/csv" }), B = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: B, download: o }).click(), URL.revokeObjectURL(B);
      },
      resize() {
        ft();
      },
      resetColumnState() {
        u.clear();
        for (const d of e.columnDefs)
          d.hide && u.add(Z(d));
        const o = e.columnDefs.find((d) => d.sort);
        v.value = o ? { colId: Z(o), dir: o.sort } : null;
        for (const d of Object.keys(s)) delete s[d];
        for (const d of Object.keys(h)) delete h[d];
        f.value = "", c.value = 0, D.value = null, M.value = null;
      }
    };
    K(
      [le, () => r.value, U, c, T, D],
      () => _e(we)
    ), K(() => e.theme, () => we()), K(() => [e.curvature, e.bendField], () => _e(ft)), K(() => e.scanlines, () => we()), K(() => e.glow, () => we()), K(() => e.magnify, (o) => {
      o || (y.x = Me.x, y.y = Me.y), we();
    }), K(D, (o) => {
      if (!o) return;
      const d = le.value[o.row], x = U.value[o.col];
      d && x && l("cell-selected", { data: d, row: o.row, col: o.col, colId: x.colId });
    });
    let wt = null, yt = null, jt = 0;
    function dt() {
      cancelAnimationFrame(jt), jt = requestAnimationFrame(ft);
    }
    function bn(o) {
      o.preventDefault();
    }
    function Mn() {
      ue == null || ue.dispose(), ue = null, ke = !1, pn();
    }
    Ne(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(Z(o)), o.sort && !v.value && (v.value = { colId: Z(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", yn), document.addEventListener("mousemove", pt), document.addEventListener("mouseup", Lt), _e(() => {
        var o;
        pn(), ee.value && (ee.value.addEventListener("webglcontextlost", bn), ee.value.addEventListener("webglcontextrestored", Mn)), J.value && (wt = new ResizeObserver(() => ft()), wt.observe(J.value), yt = new IntersectionObserver((d) => {
          d.some((x) => x.isIntersecting) && dt();
        }), yt.observe(J.value)), window.addEventListener("resize", dt), (o = window.visualViewport) == null || o.addEventListener("resize", dt), l("grid-ready", { api: el });
      });
    }), et(() => {
      var o, d, x;
      document.removeEventListener("click", yn, !0), document.removeEventListener("mousemove", pt), document.removeEventListener("mouseup", Lt), (o = ee.value) == null || o.removeEventListener("webglcontextlost", bn), (d = ee.value) == null || d.removeEventListener("webglcontextrestored", Mn), wt == null || wt.disconnect(), yt == null || yt.disconnect(), window.removeEventListener("resize", dt), (x = window.visualViewport) == null || x.removeEventListener("resize", dt), cancelAnimationFrame(jt), ut();
    });
    const xt = ae(() => Ge[e.theme] ?? Ge.none), tl = ae(() => ({
      background: xt.value.headerBg,
      borderTop: `1px solid ${xt.value.border}`,
      color: xt.value.text
    })), nl = ae(() => ({
      background: xt.value.bg
    })), Sn = ae(() => xt.value.accent);
    return (o, d) => {
      var x, L;
      return xe(), be("div", {
        ref_key: "wrapEl",
        ref: J,
        class: "cathode-wrap",
        style: Ke(nl.value)
      }, [
        me("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ot(Xn, ["prevent"]),
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
        M.value ? (xe(), be("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: j,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: k.value,
          autofocus: "",
          onInput: Qn,
          onKeydown: [
            Tn(xn, ["escape"]),
            d[0] || (d[0] = Tn((I) => M.value = null, ["enter"]))
          ]
        }, null, 40, bl)) : Oe("", !0),
        t.pagination ? (xe(), be("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ke(tl.value)
        }, [
          me("button", {
            disabled: c.value <= 0,
            onClick: d[1] || (d[1] = (I) => re())
          }, "◀", 8, Ml),
          me("span", null, ze((H.value + 1).toLocaleString()) + "–" + ze(Math.min(le.value.length, ce.value + 1).toLocaleString()) + " / " + ze(le.value.length.toLocaleString()), 1),
          me("button", {
            disabled: c.value >= _.value,
            onClick: d[2] || (d[2] = (I) => Se())
          }, "▶", 8, Sl),
          me("span", {
            class: "cathode-page-info",
            style: Ke({ color: Sn.value })
          }, ze(le.value.length.toLocaleString()) + " rows ", 5),
          D.value ? (xe(), be("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ke({ color: Sn.value })
          }, ze(((x = U.value[D.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((L = U.value[D.value.col]) == null ? void 0 : L.colId)) + " : " + ze(he(U.value[D.value.col], le.value[D.value.row])), 5)) : Oe("", !0)
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
const Rl = 12, Te = 18, kt = 10, at = 6, fn = `${Rl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
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
    let f = "";
    for (const v of r) {
      const h = f + v;
      if (t.measureText(h).width <= e)
        f = h;
      else if (f && (l.push(f.replace(/\s+$/, "")), f = ""), t.measureText(v).width > e) {
        let s = "";
        for (const u of v)
          t.measureText(s + u).width > e ? (s && l.push(s), s = u) : s += u;
        f = s;
      } else
        f = v.replace(/^\s+/, "");
    }
    f && l.push(f.replace(/\s+$/, ""));
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
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, f = t.formatTs ?? zn;
  e.font = fn;
  const v = [];
  for (let h = 0; h < n.length; h++) {
    const s = n[h], u = s.level ?? "info", m = a && s.ts != null ? f(s.ts) : "", p = r ? El(e, s.text, l) : s.text.split(`
`);
    for (let S = 0; S < p.length; S++)
      v.push({
        entryIdx: h,
        text: p[S],
        level: u,
        timestamp: S === 0 ? m : "",
        isFirstFrag: S === 0,
        widthPx: e.measureText(p[S]).width
      });
  }
  return v;
}
function Rn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Wt[n.theme] ?? Wt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = fn, e.textBaseline = "middle";
  const f = n.visualLines, v = kt - n.scrollX, h = (n.showTimestamps ? kt + n.timestampWidth : kt) - n.scrollX, s = Math.max(0, Math.floor((n.scrollY - at) / Te)), u = Math.min(f.length, Math.ceil((n.scrollY + a - at) / Te) + 1);
  for (let m = s; m < u; m++) {
    const p = f[m], S = at + m * Te - n.scrollY + Te / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let E = 1;
      for (; m + E < u && f[m + E].entryIdx === p.entryIdx; ) E++;
      e.fillRect(0, S - Te / 2, l, Te * E);
    }
    n.selectionStart >= 0 && m >= n.selectionStart && m <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, S - Te / 2, l, Te)), m === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - Te / 2, l, Te)), n.showTimestamps && p.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(p.timestamp, v, S), e.shadowBlur = 0);
    const C = Ll(r, p.level);
    e.fillStyle = C, e.textAlign = "left", n.glow ? (e.shadowColor = C, e.shadowBlur = 14, e.fillText(p.text, h, S), e.shadowBlur = 7, e.fillText(p.text, h, S), e.shadowBlur = 3, e.fillText(p.text, h, S), e.shadowBlur = 0) : e.fillText(p.text, h, S);
  }
  e.restore();
}
function En(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - at) / Te);
  return l < 0 || l >= e ? -1 : l;
}
function Al(t) {
  return at * 2 + t * Te;
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
    const e = t, l = W(null), a = W(null), r = { ...Me }, f = W(0), v = W(0), h = W(0), s = W(-1), u = W(!0), m = W(-1), p = W(-1), S = ae(() => {
      const b = e.entries ?? [];
      return e.maxLines > 0 && b.length > e.maxLines ? b.slice(b.length - e.maxLines) : b;
    }), C = ae(() => {
      if (!e.showTimestamps) return "";
      const b = e.formatTs ?? zn;
      let P = "00:00:00";
      for (const J of S.value) {
        if (J.ts == null) continue;
        const ee = b(J.ts);
        ee.length > P.length && (P = ee);
      }
      return P;
    }), E = W(0), c = W([]);
    function g() {
      if (!O) return;
      const b = O.getContext("2d");
      if (!b) return;
      b.font = fn;
      const P = e.showTimestamps ? Dl(b, C.value) : 0;
      E.value = P;
      const J = Math.max(
        1,
        f.value - kt * 2 - P
      );
      c.value = Fl({
        entries: S.value,
        ctx: b,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const T = ae(() => Al(c.value.length)), D = ae(() => Math.max(0, T.value - v.value)), N = ae(() => {
      let b = 0;
      for (const P of c.value) P.widthPx > b && (b = P.widthPx);
      return kt * 2 + E.value + b;
    }), M = ae(() => Math.max(0, N.value - f.value)), y = W(0);
    K(D, () => {
      u.value ? h.value = D.value : h.value = Math.min(h.value, D.value);
    }), K(M, () => {
      y.value = Math.min(y.value, M.value);
    }), K(
      [S, f, () => e.showTimestamps, () => e.wordWrap, C],
      () => {
        g(), _e(ie);
      },
      { deep: !1 }
    );
    let k = null, G = !1;
    function j() {
      if (k) {
        try {
          k.forceContextLoss();
        } catch {
        }
        try {
          k.dispose();
        } catch {
        }
        k = null;
      }
    }
    let te, ne, q, Z, O;
    const U = `
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
    function fe() {
      if (!(!a.value || !l.value)) {
        O = document.createElement("canvas");
        try {
          k = new $.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          G = !0;
        }
        if (!G && !k.getContext() && (k.dispose(), k = null, G = !0), G) {
          se();
          return;
        }
        k.setPixelRatio(1), k.setClearColor(0, 0), te = new $.Scene(), ne = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), Z = new $.CanvasTexture(O), Z.minFilter = $.LinearFilter, Z.magFilter = $.LinearFilter, q = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: Z },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: _l,
          fragmentShader: U,
          transparent: !0
        }), te.add(new $.Mesh(new $.PlaneGeometry(2, 2), q)), se();
      }
    }
    function se() {
      if (!l.value || !k && !G) return;
      const b = l.value.clientWidth, P = l.value.clientHeight;
      if (!b || !P) return;
      const J = O.width !== b || O.height !== P;
      J && (O.width = b, O.height = P, f.value = b, v.value = P, g(), k ? (J && Z && (Z.dispose(), Z = new $.CanvasTexture(O), Z.minFilter = $.LinearFilter, Z.magFilter = $.LinearFilter, q && (q.uniforms.uTex.value = Z)), k.setPixelRatio(window.devicePixelRatio || 1), k.setSize(b, P)) : a.value && (a.value.width = b, a.value.height = P, a.value.style.width = b + "px", a.value.style.height = P + "px"), u.value && (h.value = Math.max(0, T.value - v.value)), ie());
    }
    function ie() {
      if (!(O != null && O.width)) return;
      if (G) {
        if (!a.value) return;
        Rn(O, {
          visualLines: c.value,
          scrollY: h.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: E.value,
          hoveredLine: s.value,
          selectionStart: Math.min(m.value, p.value),
          selectionEnd: Math.max(m.value, p.value)
        });
        const P = a.value.getContext("2d");
        P && P.drawImage(O, 0, 0);
        return;
      }
      if (!k || !q || !Z) return;
      const b = e.theme === "paper";
      q.uniforms.uStrength.value = Ze(e.curvature), q.uniforms.uScanlines.value = e.scanlines && !b ? 1 : 0, q.uniforms.uVignette.value = b ? 0 : 1, Nt(q, e.magnify, r, O.width, O.height), Rn(O, {
        visualLines: c.value,
        scrollY: h.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: E.value,
        hoveredLine: s.value,
        selectionStart: Math.min(m.value, p.value),
        selectionEnd: Math.max(m.value, p.value)
      }), Z.needsUpdate = !0, k.render(te, ne);
    }
    K(() => e.theme, () => ie()), K(() => e.curvature, () => ie()), K(() => e.scanlines, () => ie()), K(() => e.glow, () => ie()), K(() => e.magnify, (b) => {
      b || (r.x = Me.x, r.y = Me.y), ie();
    }), K(h, () => ie()), K(y, () => ie()), K(s, () => ie()), K([m, p], () => ie());
    function X(b) {
      if (!a.value) return [-1, -1];
      const P = a.value.getBoundingClientRect();
      return [b.clientX - P.left, b.clientY - P.top];
    }
    function i(b) {
      h.value = Math.max(0, Math.min(D.value, b)), u.value = h.value >= D.value - 4;
    }
    function w(b) {
      y.value = Math.max(0, Math.min(M.value, b));
    }
    function F(b) {
      b.shiftKey ? w(y.value + b.deltaY) : Math.abs(b.deltaX) > Math.abs(b.deltaY) ? w(y.value + b.deltaX) : i(h.value + b.deltaY);
    }
    let A = !1, _ = 0, Y = 0, H = 0, ce = 0, Q = !1;
    function he(b) {
      A = !0, Q = !1, _ = b.clientX, Y = b.clientY, H = y.value, ce = h.value, l.value && l.value.focus();
    }
    function Ie(b) {
      if (A) {
        const P = _ - b.clientX, J = Y - b.clientY;
        (Math.abs(P) > 4 || Math.abs(J) > 4) && (Q = !0), w(H + P), i(ce + J);
      }
    }
    function le() {
      A && (A = !1, Q && (Q = !1));
    }
    function R(b) {
      if (b.touches.length !== 1) return;
      const P = b.touches[0];
      A = !0, Q = !1, _ = P.clientX, Y = P.clientY, H = y.value, ce = h.value, l.value && l.value.focus();
    }
    function V(b) {
      if (!A || b.touches.length !== 1) return;
      b.preventDefault();
      const P = b.touches[0], J = _ - P.clientX, ee = Y - P.clientY;
      (Math.abs(J) > 4 || Math.abs(ee) > 4) && (Q = !0), w(H + J), i(ce + ee);
    }
    function re() {
      A && (A = !1, Q && (Q = !1));
    }
    function Se(b) {
      const [, P] = X(b);
      return P < 0 ? -1 : En(P, h.value, c.value.length);
    }
    function pe(b) {
      if (Q) {
        Q = !1;
        return;
      }
      const P = Se(b);
      if (P < 0) {
        m.value = -1, p.value = -1;
        return;
      }
      b.shiftKey && m.value >= 0 || (m.value = P), p.value = P;
    }
    function Pe(b, P) {
      const J = c.value.length;
      if (J === 0) return;
      const ee = p.value < 0 ? 0 : p.value;
      let Ve = Math.max(0, Math.min(J - 1, ee + b));
      p.value = Ve, (!P || m.value < 0) && (m.value = Ve), s.value = Ve;
      const ue = at + Ve * Te, ke = ue + Te;
      ue < h.value ? i(ue) : ke > h.value + v.value && i(ke - v.value);
    }
    function it() {
      const b = Math.min(m.value, p.value), P = Math.max(m.value, p.value);
      if (b < 0) return "";
      const J = c.value, ee = /* @__PURE__ */ new Set(), Ve = [];
      for (let ue = b; ue <= P && ue < J.length; ue++) {
        const ke = J[ue];
        if (ee.has(ke.entryIdx)) continue;
        ee.add(ke.entryIdx);
        let ut = "";
        for (let $e = 0; $e < J.length; $e++)
          J[$e].entryIdx === ke.entryIdx && (ut += (ut && !J[$e].isFirstFrag ? " " : "") + J[$e].text);
        Ve.push(ke.timestamp ? `${ke.timestamp}  ${ut}` : ut);
      }
      return Ve.join(`
`);
    }
    async function st() {
      const b = it();
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
        m.value >= 0 && (b.preventDefault(), st());
        return;
      }
      if ((b.metaKey || b.ctrlKey) && (b.key === "a" || b.key === "A")) {
        b.preventDefault(), m.value = 0, p.value = c.value.length - 1;
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
          b.preventDefault(), w(y.value + Te * 2);
          break;
        case "ArrowLeft":
          b.preventDefault(), w(y.value - Te * 2);
          break;
        case "PageDown":
          b.preventDefault(), i(h.value + v.value);
          break;
        case "PageUp":
          b.preventDefault(), i(h.value - v.value);
          break;
        case "Home":
          b.preventDefault(), i(0), w(0);
          break;
        case "End":
          b.preventDefault(), i(D.value);
          break;
        case "Escape":
          m.value = -1, p.value = -1;
          break;
      }
    }
    function Re(b) {
      if (e.magnify && a.value) {
        const J = Xt(b, a.value);
        r.x = J.x, r.y = J.y, ie();
      }
      const [, P] = X(b);
      if (P < 0) {
        s.value = -1;
        return;
      }
      s.value = En(P, h.value, c.value.length);
    }
    function Ee() {
      s.value = -1, r.x = Me.x, r.y = Me.y, ie();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, h.value = D.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(b) {
        i(at + b * Te);
      }
    });
    let De = null, Fe = null, Ue = 0;
    const ct = Ht("cathodeResetTick", W(0));
    K(ct, () => Le());
    function Le() {
      cancelAnimationFrame(Ue), Ue = requestAnimationFrame(se);
    }
    function It(b) {
      b.preventDefault();
    }
    function pt() {
      k == null || k.dispose(), k = null, G = !1, fe();
    }
    Ne(() => {
      document.addEventListener("mousemove", Ie), document.addEventListener("mouseup", le), _e(() => {
        var b;
        fe(), a.value && (a.value.addEventListener("webglcontextlost", It), a.value.addEventListener("webglcontextrestored", pt)), l.value && (De = new ResizeObserver(() => se()), De.observe(l.value), Fe = new IntersectionObserver((P) => {
          P.some((J) => J.isIntersecting) && Le();
        }), Fe.observe(l.value)), window.addEventListener("resize", Le), (b = window.visualViewport) == null || b.addEventListener("resize", Le), h.value = D.value;
      });
    }), et(() => {
      var b, P, J;
      document.removeEventListener("mousemove", Ie), document.removeEventListener("mouseup", le), (b = a.value) == null || b.removeEventListener("webglcontextlost", It), (P = a.value) == null || P.removeEventListener("webglcontextrestored", pt), De == null || De.disconnect(), Fe == null || Fe.disconnect(), window.removeEventListener("resize", Le), (J = window.visualViewport) == null || J.removeEventListener("resize", Le), cancelAnimationFrame(Ue), j();
    });
    const Lt = ae(() => Wt[e.theme] ?? Wt.none), Ut = ae(() => ({
      background: Lt.value.bg
    }));
    return (b, P) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ke(Ut.value),
      tabindex: "0",
      onKeydown: nt
    }, [
      me("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: ot(F, ["prevent"]),
        onMousemove: Re,
        onMouseleave: Ee,
        onMousedown: he,
        onClick: pe,
        onTouchstartPassive: R,
        onTouchmove: V,
        onTouchend: re,
        onTouchcancel: re
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
    const l = t, a = e, r = W(null), f = W(null), v = W(""), h = W([]), s = W(-1);
    let u = "";
    function m(M) {
      M.trim() && (h.value.length && h.value[h.value.length - 1] === M || (h.value.push(M), h.value.length > l.historyLimit && h.value.splice(0, h.value.length - l.historyLimit)));
    }
    function p(M) {
      if (!l.disabled) {
        if (M.key === "Enter") {
          M.preventDefault();
          const y = v.value;
          y.trim() && m(y), s.value = -1, v.value = "", a("submit", y);
          return;
        }
        if (M.key === "ArrowUp") {
          if (!h.value.length) return;
          M.preventDefault(), s.value === -1 ? (u = v.value, s.value = h.value.length - 1) : s.value > 0 && s.value--, v.value = h.value[s.value];
          return;
        }
        if (M.key === "ArrowDown") {
          if (s.value === -1) return;
          M.preventDefault(), s.value < h.value.length - 1 ? (s.value++, v.value = h.value[s.value]) : (s.value = -1, v.value = u, u = "");
          return;
        }
      }
    }
    const S = W(!0);
    let C = null;
    function E() {
      C || (C = setInterval(() => {
        S.value = !S.value;
      }, 530));
    }
    function c() {
      C && (clearInterval(C), C = null), S.value = !0;
    }
    const g = ae(() => {
      let M;
      return l.disabled ? M = " " : l.busy ? M = "█" : M = S.value ? "█" : " ", { level: "info", text: `${l.prompt}${v.value}${M}` };
    }), T = ae(
      () => [...l.entries, g.value]
    );
    function D() {
      var M;
      l.disabled || (M = f.value) == null || M.focus();
    }
    K(() => l.busy, (M, y) => {
      y && !M && !l.disabled && _e(() => {
        var k;
        return (k = f.value) == null ? void 0 : k.focus();
      });
    });
    function N() {
      var M;
      (M = f.value) == null || M.focus();
    }
    return n({ focus: N }), Ne(() => {
      E(), l.disabled || requestAnimationFrame(() => {
        var M;
        return (M = f.value) == null ? void 0 : M.focus();
      });
    }), et(() => {
      c();
    }), (M, y) => (xe(), be("div", {
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
      _n(me("input", {
        ref_key: "inputEl",
        ref: f,
        "onUpdate:modelValue": y[0] || (y[0] = (k) => v.value = k),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: p
      }, null, 40, Yl), [
        [ll, v.value]
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
  const r = a ? vn : qe, f = Math.max(0, n - Ye - r), v = Math.max(1, Math.floor(f / e)), h = Math.min(v, t);
  return { firstIdx: Math.max(0, t - h - Math.floor(l / e)), count: h, slotW: e };
}
function Xl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, r = 0;
  const f = Math.min(t.length, n + e);
  for (let h = n; h < f; h++) {
    const s = t[h];
    s && (s.low < l && (l = s.low), s.high > a && (a = s.high), s.volume > r && (r = s.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const h = isFinite(l) ? l : 0;
    return { min: h - 1, max: h + 1, maxVol: Math.max(1, r) };
  }
  const v = (a - l) * 0.04;
  return { min: l - v, max: a + v, maxVol: Math.max(1, r) };
}
function Ul(t, n, e = !1) {
  const l = e ? zl : dn, a = Math.max(1, t - Tt - l - tn), r = Math.max(0, Math.round(a * n)), f = a - r;
  return {
    priceY0: Tt,
    priceY1: Tt + f,
    volumeY0: Tt + f + tn,
    volumeY1: Tt + f + tn + r
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
  var C, E, c, g, T;
  const e = t.getContext("2d");
  if (!e) return;
  const l = n.dpr && n.dpr > 0 ? n.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = t.width / l, r = t.height / l, f = gt[n.theme] ?? gt.none, v = n.colors ? { ...f, ...n.colors } : f, h = !!n.compact;
  if (e.clearRect(0, 0, a, r), e.fillStyle = v.bg, e.fillRect(0, 0, a, r), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, a, r), e.clip();
  const s = Nl(n.candles.length, a, n.slotW, n.scrollX, h), u = Xl(n.candles, s.firstIdx, s.count), m = Ul(r, n.showVolume ? n.volumeFraction : 0, h), p = Math.max($l, Math.floor(n.slotW * 0.7)), S = Math.min(n.candles.length, s.firstIdx + s.count);
  for (let D = s.firstIdx; D < S; D++) {
    const N = n.candles[D];
    if (!N) continue;
    const M = Je(D, s.firstIdx, n.slotW), y = We(N.open, u, m.priceY0, m.priceY1), k = We(N.close, u, m.priceY0, m.priceY1), G = We(N.high, u, m.priceY0, m.priceY1), j = We(N.low, u, m.priceY0, m.priceY1), te = N.close >= N.open, ne = te ? v.wickBull : v.wickBear, q = te ? v.candleBull : v.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = ne, e.lineWidth = Ol, e.beginPath(), e.moveTo(Math.round(M) + 0.5, G), e.lineTo(Math.round(M) + 0.5, j), e.stroke(), e.fillStyle = q;
    const Z = Math.min(y, k), O = Math.max(1, Math.abs(k - y)), U = Math.round(M - p / 2), fe = Math.round(Z), se = Math.round(O);
    if (e.fillRect(U, fe, p, se), n.glow && (e.shadowBlur = 4, e.fillRect(U, fe, p, se)), e.shadowBlur = 0, n.showVolume && u.maxVol > 0) {
      const ie = Math.round(N.volume / u.maxVol * (m.volumeY1 - m.volumeY0));
      ie > 0 && (e.fillStyle = te ? v.volumeBull : v.volumeBear, e.fillRect(
        Math.round(M - p / 2),
        m.volumeY1 - ie,
        p,
        ie
      ));
    }
  }
  if ((C = n.overlays) != null && C.length) {
    const D = { above: 0, below: 0 }, N = n.overlays.filter((y) => y.kind !== "hline" && !!y.label).length, M = N ? 14 + 14 * N + 12 : 8;
    for (const y of n.overlays)
      y.kind === "hline" ? jl(e, y, a, u, m, v, h, D, M) : Kl(e, y, s, u, m, n.slotW);
  }
  (E = n.markers) != null && E.length && lo(e, v, n.markers, n.candles, s, u, m, n.slotW), oo(e, v, u, m, a, h), h || (ao(e, v, n.candles, s, n.slotW, r), to(e, v, n.candles, a, r)), (c = n.overlays) != null && c.length && Zl(e, v, n.overlays, m), n.hover && (ro(e, v, n.candles, s, u, m, n.slotW, n.hover, a), Jl(e, v, n.candles, s, n.slotW, n.hover, m, ((g = n.overlays) == null ? void 0 : g.length) ?? 0), (T = n.markers) != null && T.length && eo(e, v, n.markers, n.candles, s, u, m, n.slotW, n.hover, a)), e.restore();
}
function Kl(t, n, e, l, a, r) {
  var v;
  const f = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    Ft(t, n.data, e.firstIdx, f, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const h = Vn(n.color, n.fillAlpha ?? 0.08);
    ql(t, n.upper, n.lower, e.firstIdx, f, r, l, a, h), Ft(t, n.upper, e.firstIdx, f, r, l, a, n.color, 1, !1), Ft(t, n.lower, e.firstIdx, f, r, l, a, n.color, 1, !1), (v = n.middle) != null && v.length && Ft(t, n.middle, e.firstIdx, f, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function jl(t, n, e, l, a, r, f, v = { above: 0, below: 0 }, h = 8) {
  const s = We(n.price, l, a.priceY0, a.priceY1), u = s < a.priceY0 - 0.5, m = s > a.priceY1 + 0.5, p = u || m, S = p ? u ? v.above++ : v.below++ : 0, C = p ? u ? a.priceY0 + h + S * 20 : a.priceY1 - 8 - S * 20 : s, E = f ? vn : qe, c = Math.round(C) + 0.5;
  t.save(), p || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, c), t.lineTo(e - E, c), t.stroke(), t.setLineDash([]));
  let g = n.label ?? je(n.price);
  if (p && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const T = t.measureText(g).width, D = 4, N = 2, M = Ye + 2;
    t.fillStyle = n.color, p && (t.globalAlpha = 0.85), t.fillRect(M, C - 7 - N, T + D * 2, 14 + N * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(g, M + D, C);
  }
  t.restore();
}
function Ft(t, n, e, l, a, r, f, v, h, s) {
  if (!n || !n.length) return;
  t.strokeStyle = v, t.lineWidth = h, t.setLineDash(s ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let m = e; m < l; m++) {
    const p = n[m];
    if (typeof p != "number" || !isFinite(p)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const S = Je(m, e, a), C = We(p, r, f.priceY0, f.priceY1);
    u ? t.lineTo(S, C) : (t.moveTo(S, C), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function ql(t, n, e, l, a, r, f, v, h) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = h;
  let s = !1, u = -1;
  for (let m = l; m <= a; m++) {
    const p = n[m], S = e[m], C = m < a && typeof p == "number" && typeof S == "number" && isFinite(p) && isFinite(S);
    if (C && !s && (u = m, s = !0), !C && s || m === a && s) {
      const E = C ? m + 1 : m;
      t.beginPath();
      for (let c = u; c < E; c++) {
        const g = Je(c, l, r), T = We(n[c], f, v.priceY0, v.priceY1);
        c === u ? t.moveTo(g, T) : t.lineTo(g, T);
      }
      for (let c = E - 1; c >= u; c--) {
        const g = Je(c, l, r), T = We(e[c], f, v.priceY0, v.priceY1);
        t.lineTo(g, T);
      }
      t.closePath(), t.fill(), s = !1;
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
  const r = 8, f = 5, v = 12, h = 6, s = 14;
  let u = 0;
  for (const E of a) {
    const c = t.measureText(E.label).width;
    c > u && (u = c);
  }
  const m = r * 2 + v + h + u, p = f * 2 + s * a.length, S = Ye + 4, C = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(S, C, m, p), t.textBaseline = "middle", t.textAlign = "left";
  for (let E = 0; E < a.length; E++) {
    const c = a[E], g = C + f + s * (E + 0.5), T = S + r;
    c.kind === "line" ? (t.strokeStyle = c.color, t.lineWidth = c.lineWidth ?? 1, t.setLineDash(c.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(T, g), t.lineTo(T + v, g), t.stroke(), t.setLineDash([])) : c.kind === "band" && (t.fillStyle = Vn(c.color, c.fillAlpha ?? 0.2), t.fillRect(T, g - 4, v, 8), t.strokeStyle = c.color, t.lineWidth = 1, t.strokeRect(T + 0.5, g - 4 + 0.5, v - 1, 7)), t.fillStyle = n.text, t.fillText(c.label, T + v + h, g);
  }
  t.restore();
}
function Jl(t, n, e, l, a, r, f, v) {
  const h = Math.floor((r.x - Ye) / a), s = l.firstIdx + h;
  if (s < 0 || s >= e.length) return;
  const u = e[s];
  if (!u) return;
  const m = u.close - u.open, p = u.open !== 0 ? m / u.open * 100 : 0, S = m >= 0 ? "+" : "", C = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", Ql(u.volume), void 0],
    ["", `${S}${p.toFixed(2)}%`, m >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const E = 8, c = 4, g = 14;
  let T = E;
  for (const [y, k] of C) {
    const G = y ? `${y} ${k}` : k, j = t.measureText(G).width + 12;
    T += j;
  }
  T += E - 12;
  const D = f.priceY0 + 4 + (v > 0 ? c * 2 + 14 * v + 4 : 0), N = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(N, D, T, g + c * 2);
  let M = N + E;
  for (let y = 0; y < C.length; y++) {
    const [k, G, j] = C[y];
    t.fillStyle = n.text, k && (t.globalAlpha = 0.6, t.fillText(k + " ", M, D + c + g / 2), t.globalAlpha = 1, M += t.measureText(k + " ").width), j && (t.fillStyle = j), t.fillText(G, M, D + c + g / 2), M += t.measureText(G).width + 12;
  }
  t.restore();
}
function Ql(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function eo(t, n, e, l, a, r, f, v, h, s) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, m = Math.max(1, u * 0.5), p = Math.min(l.length, a.firstIdx + a.count), S = 9;
  let C = null;
  for (const G of e) {
    let j = 0, te = l.length - 1, ne = -1;
    for (; j <= te; ) {
      const O = j + te >> 1, U = l[O].start - G.timestamp;
      if (Math.abs(U) <= m) {
        ne = O;
        break;
      }
      U < 0 ? j = O + 1 : te = O - 1;
    }
    if (ne < 0 || ne < a.firstIdx || ne >= p) continue;
    const q = Je(ne, a.firstIdx, v), Z = We(G.price, r, f.priceY0, f.priceY1);
    if (Math.abs(h.x - q) <= S && Math.abs(h.y - Z) <= S) {
      C = { m: G, x: q, y: Z };
      break;
    }
  }
  if (!C) return;
  const E = hn(C.m.timestamp), c = [
    `${C.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${E}`,
    `@ ${je(C.m.price)}`
  ];
  C.m.label && c.push(C.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, T = 14;
  let D = 0;
  for (const G of c) {
    const j = t.measureText(G).width;
    j > D && (D = j);
  }
  const N = D + g * 2, M = c.length * T + g * 2;
  let y = C.x + 12;
  y + N > s - qe && (y = C.x - 12 - N);
  let k = C.y - M / 2;
  k < f.priceY0 && (k = f.priceY0), k + M > f.priceY1 && (k = f.priceY1 - M), t.fillStyle = n.panelBgSolid, t.strokeStyle = C.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(y, k, N, M), t.strokeRect(y + 0.5, k + 0.5, N - 1, M - 1);
  for (let G = 0; G < c.length; G++) {
    const j = c[G];
    t.fillStyle = G === 0 ? C.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(j, y + g, k + g + G * T);
  }
  t.restore();
}
function to(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, f = no(r);
  if (!f) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, h = 3, s = t.measureText(f).width, u = l - qe - v, m = a - dn + 4;
  t.fillStyle = n.accent, t.fillRect(u - s - v, m - h, s + v * 2, 14 + h * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(f, u, m), t.restore();
}
function no(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function lo(t, n, e, l, a, r, f, v) {
  if (!l.length) return;
  const h = l.length > 1 ? l[1].start - l[0].start : 6e4, s = Math.max(1, h * 0.5), u = Math.min(l.length, a.firstIdx + a.count), m = (S) => {
    let C = 0, E = l.length - 1;
    for (; C <= E; ) {
      const c = C + E >> 1, g = l[c].start - S;
      if (Math.abs(g) <= s) return c;
      g < 0 ? C = c + 1 : E = c - 1;
    }
    return -1;
  }, p = 7;
  for (const S of e) {
    const C = m(S.timestamp);
    if (C < 0 || C < a.firstIdx || C >= u) continue;
    const E = Je(C, a.firstIdx, v), c = We(S.price, r, f.priceY0, f.priceY1);
    if (c < f.priceY0 || c > f.priceY1) continue;
    const g = S.color ?? (S.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(E, c - p), t.lineTo(E - p, c + p - 1), t.lineTo(E + p, c + p - 1)) : (t.moveTo(E, c + p), t.lineTo(E - p, c - p + 1), t.lineTo(E + p, c - p + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function oo(t, n, e, l, a, r = !1) {
  const f = e.max - e.min;
  if (f <= 0) return;
  const v = l.priceY1 - l.priceY0, h = r ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, s = Gl(f, h), u = Math.ceil(e.min / s) * s, m = r ? vn : qe;
  t.font = r ? Vl : Xe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let p = u; p <= e.max; p += s) {
    const S = We(p, e, l.priceY0, l.priceY1);
    S < l.priceY0 || S > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(S) + 0.5), t.lineTo(a - m, Math.round(S) + 0.5), t.stroke(), t.fillText(je(p), a - m + 3, S));
  }
  t.globalAlpha = 1;
}
function ao(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(l.count / 6));
  t.font = Xe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const h = Math.min(e.length, l.firstIdx + l.count);
  for (let s = l.firstIdx; s < h; s += v) {
    const u = e[s];
    if (!u) continue;
    const m = Je(s, l.firstIdx, a);
    t.fillText(hn(u.start), m, r - dn + 4);
  }
  t.globalAlpha = 1;
}
function ro(t, n, e, l, a, r, f, v, h) {
  const s = Math.floor((v.x - Ye) / f), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + s)), m = e[u];
  if (!m) return;
  const p = Je(u, l.firstIdx, f);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(p) + 0.5, r.priceY0), t.lineTo(Math.round(p) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const S = Math.max(r.priceY0, Math.min(r.priceY1, v.y));
  t.beginPath(), t.moveTo(Ye, Math.round(S) + 0.5), t.lineTo(h - qe, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const C = a.max - a.min;
  if (C > 0) {
    const g = a.max - (S - r.priceY0) / (r.priceY1 - r.priceY0) * C, T = je(g);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const D = t.measureText(T).width, N = 4, M = 2;
    t.fillStyle = n.accent, t.fillRect(h - qe + 2, S - 7 - M, D + N * 2, 14 + M * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(T, h - qe + 2 + N, S);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const E = hn(m.start), c = t.measureText(E).width;
  t.fillStyle = n.accent, t.fillRect(p - c / 2 - 4, r.volumeY1 + 2, c + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(E, p, r.volumeY1 + 4), t.restore();
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
    const n = t, e = W(null), l = W(null), a = { ...Me }, r = W(0), f = W(0), v = W(0), h = W(1), s = W(null), u = ae(() => Math.max(1, n.slotW * h.value));
    let m = null, p = !1;
    function S() {
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
    let C, E, c, g, T;
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
    function N() {
      if (!(!l.value || !e.value)) {
        if (T = document.createElement("canvas"), n.flat) {
          p = !0, M();
          return;
        }
        try {
          m = new $.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          p = !0;
        }
        if (!p && !m.getContext() && (m.dispose(), m = null, p = !0), p) {
          M();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), C = new $.Scene(), E = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new $.CanvasTexture(T), g.minFilter = $.LinearFilter, g.magFilter = $.LinearFilter, c = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: io,
          fragmentShader: D,
          transparent: !0
        }), C.add(new $.Mesh(new $.PlaneGeometry(2, 2), c)), M();
      }
    }
    function M() {
      if (!e.value || !m && !p) return;
      const R = e.value.clientWidth, V = e.value.clientHeight;
      !R || !V || !(T.width !== R || T.height !== V) || (T.width = R, T.height = V, r.value = R, f.value = V, m ? (g && (g.dispose(), g = new $.CanvasTexture(T), g.minFilter = $.LinearFilter, g.magFilter = $.LinearFilter, c && (c.uniforms.uTex.value = g)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(R, V)) : l.value && (l.value.width = R, l.value.height = V, l.value.style.width = R + "px", l.value.style.height = V + "px"), y());
    }
    function y() {
      if (!(T != null && T.width)) return;
      if (p) {
        if (!l.value) return;
        rn(T, {
          candles: n.candles,
          slotW: u.value,
          scrollX: v.value,
          theme: n.theme,
          glow: !1,
          showVolume: n.showVolume,
          volumeFraction: n.volumeFraction,
          hover: s.value,
          overlays: n.overlays,
          markers: n.markers,
          compact: n.compact,
          colors: n.colors
        });
        const V = l.value.getContext("2d");
        V && (V.clearRect(0, 0, l.value.width, l.value.height), V.drawImage(T, 0, 0));
        return;
      }
      if (!m || !c || !g) return;
      const R = n.theme === "paper";
      c.uniforms.uStrength.value = Ze(n.curvature), c.uniforms.uScanlines.value = n.scanlines && !R ? 1 : 0, c.uniforms.uVignette.value = R ? 0 : 1, Nt(c, n.magnify, a, T.width, T.height), rn(T, {
        candles: n.candles,
        slotW: u.value,
        scrollX: v.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: s.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), g.needsUpdate = !0, m.render(C, E);
    }
    K(() => n.theme, () => y()), K(() => n.curvature, () => y()), K(() => n.scanlines, () => y()), K(() => n.glow, () => y()), K(() => n.showVolume, () => y()), K(() => n.volumeFraction, () => y()), K(() => n.slotW, () => y()), K(() => n.candles, () => y(), { deep: !1 }), K(() => n.overlays, () => y(), { deep: !1 }), K(() => n.markers, () => y(), { deep: !1 }), K(() => n.compact, () => y()), K(() => n.magnify, (R) => {
      R || (a.x = Me.x, a.y = Me.y), y();
    }), K(() => n.colors, () => y(), { deep: !0 }), K(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), K(v, () => y()), K(h, () => y()), K(s, () => y()), K(u, () => y());
    let k = null, G = null, j = 0;
    const te = Ht("cathodeResetTick", W(0));
    K(te, () => ne());
    function ne() {
      cancelAnimationFrame(j), j = requestAnimationFrame(M);
    }
    function q(R) {
      R.preventDefault();
    }
    function Z() {
      m == null || m.dispose(), m = null, p = !1, N();
    }
    function O(R) {
      if (!l.value) return [-1, -1];
      const V = l.value.getBoundingClientRect();
      return [R.clientX - V.left, R.clientY - V.top];
    }
    function U(R) {
      var Pe;
      const V = u.value;
      if (V <= 0) return 0;
      const re = ((Pe = n.candles) == null ? void 0 : Pe.length) ?? 0, Se = Math.max(1, Math.floor((r.value || 1) / V)), pe = Math.max(0, re - Se);
      return Math.max(0, Math.min(R, pe * V));
    }
    function fe(R) {
      var Se;
      if (R.deltaX !== 0 || R.shiftKey && R.deltaY !== 0) {
        const pe = R.deltaX !== 0 ? R.deltaX : R.deltaY;
        v.value = U(v.value + pe);
        return;
      }
      if (R.deltaY === 0) return;
      const [V] = O(R), re = u.value;
      if (V >= 0 && re > 0 && ((Se = n.candles) != null && Se.length)) {
        const pe = Math.max(1, Math.floor((r.value || 1) / re)), it = Math.max(0, n.candles.length - pe - Math.floor(v.value / re)) + (V - 8) / re, st = Math.exp(-R.deltaY * 15e-4), nt = Math.max(nn, Math.min(ln, h.value * st));
        h.value = nt;
        const Re = n.slotW * nt, Ee = Math.max(1, Math.floor((r.value || 1) / Re)), De = it - (V - 8) / Re, Fe = Math.max(0, n.candles.length - Ee - De);
        v.value = U(Fe * Re);
      } else {
        const pe = Math.exp(-R.deltaY * 15e-4);
        h.value = Math.max(nn, Math.min(ln, h.value * pe));
      }
    }
    let se = !1, ie = 0, X = 0;
    function i(R) {
      R.button === 0 && (se = !0, ie = R.clientX, X = v.value, s.value = null, e.value && e.value.focus());
    }
    function w(R) {
      const V = Math.exp(R * 0.18);
      h.value = Math.max(nn, Math.min(ln, h.value * V)), v.value = U(v.value);
    }
    function F(R) {
      const V = u.value, re = R.shiftKey ? 20 : 3;
      switch (R.key) {
        case "ArrowLeft":
          R.preventDefault(), v.value = U(v.value + V * re);
          break;
        case "ArrowRight":
          R.preventDefault(), v.value = U(v.value - V * re);
          break;
        case "ArrowUp":
          R.preventDefault(), w(1);
          break;
        case "ArrowDown":
          R.preventDefault(), w(-1);
          break;
        case "Home":
          R.preventDefault(), v.value = U(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          R.preventDefault(), v.value = 0;
          break;
      }
    }
    function A(R) {
      if (se) {
        const V = R.clientX - ie;
        v.value = U(X + V);
        return;
      }
    }
    function _() {
      se = !1;
    }
    function Y(R) {
      if (R.touches.length !== 1) return;
      const V = R.touches[0];
      se = !0, ie = V.clientX, X = v.value, s.value = null;
    }
    function H(R) {
      if (!se || R.touches.length !== 1) return;
      R.preventDefault();
      const re = R.touches[0].clientX - ie;
      v.value = U(X + re);
    }
    function ce() {
      se = !1;
    }
    function Q(R) {
      if (n.magnify && l.value) {
        const Se = Xt(R, l.value);
        a.x = Se.x, a.y = Se.y, y();
      }
      if (se) return;
      const [V, re] = O(R);
      if (V < 0 || re < 0) {
        s.value = null;
        return;
      }
      s.value = { x: V, y: re };
    }
    function he() {
      s.value = null, a.x = Me.x, a.y = Me.y, y();
    }
    Ne(() => {
      document.addEventListener("mousemove", A), document.addEventListener("mouseup", _), _e(() => {
        var R;
        N(), l.value && (l.value.addEventListener("webglcontextlost", q), l.value.addEventListener("webglcontextrestored", Z)), e.value && (k = new ResizeObserver(() => M()), k.observe(e.value), G = new IntersectionObserver((V) => {
          V.some((re) => re.isIntersecting) && ne();
        }), G.observe(e.value)), window.addEventListener("resize", ne), (R = window.visualViewport) == null || R.addEventListener("resize", ne);
      });
    }), et(() => {
      var R, V, re;
      document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", _), (R = l.value) == null || R.removeEventListener("webglcontextlost", q), (V = l.value) == null || V.removeEventListener("webglcontextrestored", Z), k == null || k.disconnect(), G == null || G.disconnect(), window.removeEventListener("resize", ne), (re = window.visualViewport) == null || re.removeEventListener("resize", ne), cancelAnimationFrame(j), S();
    });
    const Ie = ae(() => gt[n.theme] ?? gt.none), le = ae(() => ({
      background: Ie.value.bg
    }));
    return (R, V) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ke(le.value),
      tabindex: "0",
      onKeydown: F
    }, [
      me("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: ot(fe, ["prevent"]),
        onMousedown: i,
        onMousemove: Q,
        onMouseleave: he,
        onTouchstartPassive: Y,
        onTouchmove: H,
        onTouchend: ce,
        onTouchcancel: ce
      }, null, 544)
    ], 36));
  }
}), zo = /* @__PURE__ */ tt(so, [["__scopeId", "data-v-7c334778"]]), ht = 22, Ct = 6, co = `
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
    const e = t, l = n, a = W(null), r = W(null), f = W(-1), v = W(0), h = { ...Me };
    let s = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, m = !1;
    function p() {
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
    let S, C, E, c, g;
    const T = W(0), D = W(0), N = `
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
    function M() {
      if (!(!r.value || !a.value)) {
        g = document.createElement("canvas");
        try {
          u = new $.WebGLRenderer({ canvas: r.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !u.getContext() && (u.dispose(), u = null, m = !0), m) {
          y();
          return;
        }
        u.setPixelRatio(s), u.setClearColor(0, 0), S = new $.Scene(), C = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), c = new $.CanvasTexture(g), c.minFilter = $.LinearFilter, c.magFilter = $.LinearFilter, E = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: c },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: co,
          fragmentShader: N,
          transparent: !0
        }), S.add(new $.Mesh(new $.PlaneGeometry(2, 2), E)), y();
      }
    }
    function y() {
      if (!a.value || !u && !m) return;
      const i = a.value.clientWidth, w = a.value.clientHeight;
      if (!i || !w) return;
      T.value = i, D.value = w, s = Math.min(window.devicePixelRatio || 1, 2);
      const F = e.bendField ? Math.round(i * Hn(e.curvature)) : i, A = Math.round(F * s), _ = Math.round(w * s), Y = g.width !== A || g.height !== _;
      g.width = A, g.height = _, u ? (Y && c && (c.dispose(), c = new $.CanvasTexture(g), c.minFilter = $.LinearFilter, c.magFilter = $.LinearFilter, E.uniforms.uTex.value = c), u.setPixelRatio(s), u.setSize(i, w)) : r.value && (r.value.width = Math.round(i * s), r.value.height = Math.round(w * s), r.value.style.width = i + "px", r.value.style.height = w + "px"), q();
    }
    function k() {
      const i = (g == null ? void 0 : g.width) || 0, w = Math.max(1, Math.floor(i / e.minCellW)), F = Math.floor(i / w), A = Math.round(F * e.cellAspect), _ = ht + A + Ct;
      return { rects: e.cells.map((H, ce) => ({
        x: ce % w * F,
        y: Math.floor(ce / w) * _ - v.value,
        w: F,
        h: _
      })), rowH: _, totalH: Math.ceil(e.cells.length / w) * _, cols: w };
    }
    const G = () => {
      const { totalH: i } = k();
      return Math.max(0, i - ((g == null ? void 0 : g.height) || 0));
    }, j = /* @__PURE__ */ new Map();
    function te(i, w, F) {
      const A = i.candles[i.candles.length - 1], _ = `${w}x${F}@${s}|${i.candles.length}|${A ? A.start + ":" + A.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, Y = j.get(i.id);
      if (Y && Y.key === _) return Y.canvas;
      const H = (Y == null ? void 0 : Y.canvas) ?? document.createElement("canvas");
      H.width = Math.round(w * s), H.height = Math.round(F * s);
      const ce = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, i.candles.length))), Q = w < 260 && i.overlays ? i.overlays.map((he) => ({ ...he, label: "" })) : i.overlays;
      return rn(H, {
        candles: i.candles,
        slotW: ce,
        scrollX: Math.max(0, i.candles.length * ce - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: Q,
        compact: !0,
        colors: e.colors,
        dpr: s
      }), j.set(i.id, { canvas: H, key: _ }), H;
    }
    const ne = ae(() => ({ ...gt[e.theme] ?? gt.none, ...e.colors ?? {} }));
    function q() {
      var A;
      if (!(g != null && g.width)) return;
      const i = g.getContext("2d");
      if (!i) return;
      const w = ne.value;
      i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, g.width, g.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (i.fillStyle = w.bg, i.fillRect(0, 0, g.width, g.height)), i.setTransform(s, 0, 0, s, 0, 0);
      const { rects: F } = k();
      i.font = "600 11px ui-monospace, SFMono-Regular, monospace", i.textBaseline = "middle";
      for (let _ = 0; _ < e.cells.length; _++) {
        const Y = e.cells[_], H = F[_];
        if (H.y + H.h < 0 || H.y > g.height / s) continue;
        const ce = H.x + Ct / 2, Q = H.w - Ct;
        i.strokeStyle = Y.open ? w.candleBull : w.gridline, i.lineWidth = _ === f.value ? 2 : 1, i.strokeRect(ce + 0.5, H.y + 0.5, Q - 1, H.h - Ct - 1), i.save(), i.beginPath(), i.rect(ce, H.y, Q, ht), i.clip();
        const he = H.y + ht / 2 + 1, Ie = Y.note ? i.measureText(Y.note).width + (Y.open ? 22 : 12) : Y.open ? 16 : 0, le = Y.badge ? i.measureText(Y.badge).width + 6 : 0, R = Q - 14 - le - Ie;
        let V = Y.title;
        if (i.measureText(V).width > R) {
          for (; V.length > 1 && i.measureText(V + "…").width > R; ) V = V.slice(0, -1);
          V += "…";
        }
        let re = ce + 7;
        i.fillStyle = w.text, i.textAlign = "left", i.fillText(V, re, he), re += i.measureText(V).width + 6, Y.badge && (i.fillStyle = w.accent, i.fillText(Y.badge, re, he)), Y.note && (i.textAlign = "right", i.fillStyle = Y.noteColor || w.accent, i.fillText(Y.note, ce + Q - (Y.open ? 16 : 7), he), i.textAlign = "left"), i.restore(), Y.open && (i.fillStyle = w.candleBull, i.beginPath(), i.arc(ce + Q - 9, H.y + ht / 2 + 1, 3, 0, Math.PI * 2), i.fill());
        const Se = H.y + ht, pe = H.h - ht - Ct;
        Y.candles.length ? i.drawImage(te(Y, Q - 2, pe - 1), ce + 1, Se, Q - 2, pe - 1) : (i.fillStyle = w.accent, i.textAlign = "center", i.fillText("· · ·", ce + Q / 2, Se + pe / 2), i.textAlign = "left");
      }
      if (m) {
        const _ = (A = r.value) == null ? void 0 : A.getContext("2d");
        _ && r.value && _.drawImage(g, 0, 0, g.width, g.height, 0, 0, r.value.width, r.value.height);
        return;
      }
      !u || !E || !c || (E.uniforms.uStrength.value = Ze(e.curvature), E.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, E.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Nt(E, e.magnify, h, T.value || g.width, D.value || g.height), c.needsUpdate = !0, u.render(S, C));
    }
    function Z(i) {
      if (!r.value) return [-1, -1];
      const w = r.value.getBoundingClientRect();
      return Pn(
        i.clientX - w.left,
        i.clientY - w.top,
        w.width,
        w.height,
        Ze(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((g == null ? void 0 : g.width) || w.width) / s,
        ((g == null ? void 0 : g.height) || w.height) / s
      );
    }
    function O(i, w) {
      if (i < 0) return -1;
      const { rects: F } = k();
      return F.findIndex((A) => i >= A.x && i < A.x + A.w && w >= A.y && w < A.y + A.h);
    }
    function U(i) {
      const [w, F] = Z(i), A = O(w, F);
      A >= 0 && l("cell-click", e.cells[A].id);
    }
    function fe(i) {
      if (e.magnify && r.value) {
        const _ = Xt(i, r.value);
        h.x = _.x, h.y = _.y;
      }
      const [w, F] = Z(i), A = O(w, F);
      A !== f.value ? (f.value = A, q()) : e.magnify && q(), r.value && (r.value.style.cursor = A >= 0 ? "pointer" : "default");
    }
    function se() {
      f.value = -1, h.x = Me.x, h.y = Me.y, q();
    }
    function ie(i) {
      const w = G();
      w <= 0 || (i.preventDefault(), v.value = Math.max(0, Math.min(w, v.value + i.deltaY)), q());
    }
    let X = null;
    return Ne(() => {
      M(), X = new ResizeObserver(() => y()), a.value && X.observe(a.value);
    }), et(() => {
      X == null || X.disconnect(), p(), j.clear();
    }), K(() => [e.curvature, e.bendField], () => _e(y)), K(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      v.value = Math.min(v.value, G()), q();
    }, { deep: !1 }), (i, w) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      me("canvas", {
        ref_key: "canvasEl",
        ref: r,
        onClick: U,
        onMousemove: fe,
        onMouseleave: se,
        onWheel: ie
      }, null, 544)
    ], 512));
  }
}), Vo = /* @__PURE__ */ tt(uo, [["__scopeId", "data-v-9f2b24f8"]]), mn = W(0), sn = 28, mt = 12;
let cn = 10, Yt = "cathode.layout", Pt = !1;
const Ce = W({});
function fo(t, n = "cathode.layout") {
  if (!Pt) {
    Pt = !0, Yt = n;
    try {
      const e = localStorage.getItem(Yt);
      if (e) {
        Ce.value = JSON.parse(e), Dn();
        return;
      }
    } catch {
    }
    Ce.value = { ...t }, Dn();
  }
}
function Dn() {
  let t = 10;
  for (const n of Object.values(Ce.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  cn = t;
}
function rt() {
  localStorage.setItem(Yt, JSON.stringify(Ce.value));
}
function vo(t) {
  Pt = !1, localStorage.removeItem(Yt), Ce.value = { ...t }, rt(), Pt = !0, mn.value++;
}
function $n(t) {
  cn++, Ce.value[t] && (Ce.value[t].zIndex = cn);
}
function ho(t, n) {
  Ce.value[t].visible = n, rt();
}
function mo(t, n) {
  Ce.value[t].minimized = n, n && (Ce.value[t].maximized = !1), rt();
}
function go(t, n) {
  Ce.value[t].maximized = n, n && (Ce.value[t].minimized = !1, $n(t)), rt();
}
function po(t, n, e) {
  Ce.value[t].x = Math.round(n), Ce.value[t].y = Math.round(e), rt();
}
function wo(t, n, e) {
  Ce.value[t].w = Math.round(n), Ce.value[t].h = Math.round(e), rt();
}
function $o(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - mt * (l + 1)) / l), f = Math.floor((n - mt * (a + 1)) / a), v = {};
  return e.forEach((h, s) => {
    const u = s % l, m = Math.floor(s / l);
    v[h] = {
      x: mt + u * (r + mt),
      y: mt + m * (f + mt),
      w: r,
      h: f,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), v;
}
function On() {
  return {
    containers: Ce,
    TITLEBAR_H: sn,
    load: fo,
    save: rt,
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
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = On(), f = W(null);
    Cn("cathodeWorkspace", f), Cn("cathodeResetTick", mn), Ne(() => {
      if (!f.value) return;
      const { clientWidth: c, clientHeight: g } = f.value, T = n.initialLayout ?? {};
      l(T, n.storageKey ?? "cathode.layout");
      const D = Object.keys(e.value)[0];
      D && v(D);
    });
    function v(c) {
      var T;
      document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused"));
      const g = (T = f.value) == null ? void 0 : T.querySelector(`#cc-${c}`);
      g && g.classList.add("cc-focused");
    }
    function h() {
      !f.value || !n.initialLayout || a(n.initialLayout);
    }
    function s(c) {
      const g = c.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = W(!1), m = () => Object.entries(e.value).filter(([, c]) => !c.visible).map(([c]) => c);
    function p(c) {
      r(c, !0), u.value = !1;
    }
    function S(c) {
      if (!u.value) return;
      const g = c.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function C(c) {
      c.key === "Escape" && (u.value = !1);
    }
    Ne(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", C);
    }), et(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", C);
    });
    function E(c) {
      var g;
      return ((g = n.containerTitles) == null ? void 0 : g[c]) ?? c;
    }
    return (c, g) => (xe(), be("div", {
      ref_key: "workspaceEl",
      ref: f,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      on(c.$slots, "default", {}, void 0, !0),
      on(c.$slots, "overlay", {}, void 0, !0),
      me("div", yo, [
        t.initialLayout ? (xe(), be("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: h
        }, " ↺ Reset Layout ")) : Oe("", !0),
        g[1] || (g[1] = me("div", { class: "ws-sep" }, null, -1)),
        me("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (T) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      An(ol, { name: "menu" }, {
        default: al(() => [
          u.value ? (xe(), be("div", xo, [
            g[3] || (g[3] = me("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? Oe("", !0) : (xe(), be("div", bo, " No closed panels ")),
            (xe(!0), be(rl, null, il(m(), (T) => (xe(), be("div", {
              key: T,
              class: "ws-restore-item",
              onClick: (D) => p(T)
            }, [
              g[2] || (g[2] = me("span", { class: "ws-restore-icon" }, "⊞", -1)),
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
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: f, updatePos: v, updateSize: h } = On(), s = Ht("cathodeWorkspace", W(null)), u = ae(() => e.value[n.id]), m = ae(() => {
      const i = u.value, w = n.curvature ?? 0;
      if (!i) return {};
      const F = { "--curvature": Math.abs(w) };
      return i.maximized ? { ...F, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: i.zIndex } : {
        ...F,
        left: i.x + "px",
        top: i.y + "px",
        width: i.w + "px",
        height: i.minimized ? sn + "px" : i.h + "px",
        zIndex: i.zIndex,
        display: i.visible ? "flex" : "none"
      };
    });
    let p = !1, S = 0, C = 0;
    function E(i) {
      var A;
      if (i.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), p = !0;
      const w = (A = s.value) == null ? void 0 : A.querySelector(`#cc-${n.id}`);
      if (!w) return;
      const F = w.getBoundingClientRect();
      S = i.clientX - F.left, C = i.clientY - F.top, document.addEventListener("mousemove", c), document.addEventListener("mouseup", g), i.preventDefault();
    }
    function c(i) {
      var Y;
      if (!p || !s.value) return;
      const w = s.value.getBoundingClientRect(), F = ((Y = u.value) == null ? void 0 : Y.w) ?? 300;
      let A = i.clientX - w.left - S, _ = i.clientY - w.top - C;
      A = Math.max(Fn - F, Math.min(w.width - Fn, A)), _ = Math.max(0, Math.min(w.height - sn, _)), v(n.id, A, _);
    }
    function g() {
      p = !1, document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", g);
    }
    let T = !1, D = 0, N = 0, M = 0, y = 0;
    const k = W("");
    function G(i) {
      u.value.maximized || (l(n.id), T = !0, D = i.clientX, N = i.clientY, M = u.value.w, y = u.value.h, document.addEventListener("mousemove", j), document.addEventListener("mouseup", te), i.preventDefault(), i.stopPropagation());
    }
    function j(i) {
      if (!T) return;
      const w = Math.max(Eo, M + (i.clientX - D)), F = Math.max(Do, y + (i.clientY - N));
      h(n.id, w, F), k.value = `${Math.round(w)}×${Math.round(F)}`;
    }
    function te() {
      T = !1, k.value = "", document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", te), ne.value++;
    }
    const ne = W(0);
    K(mn, () => {
      ne.value++;
    }), et(() => {
      var i;
      document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", te), (i = q.value) == null || i.removeEventListener("scroll", O), U();
    });
    const q = W(null);
    function Z(i) {
      if (n.canvas) return [];
      const w = i.children[0];
      return w ? Array.from(w.children) : [];
    }
    function O() {
      const i = q.value, w = n.curvature ?? 0;
      if (!i) return;
      const F = Z(i);
      if (!F.length) return;
      const A = i.clientHeight, _ = A / 2, Y = w * 38e-4;
      F.forEach((H) => {
        if (!H.dataset.origFs) {
          const Se = getComputedStyle(H);
          H.dataset.origFs = Se.fontSize, H.dataset.origLh = Se.lineHeight;
        }
        if (w === 0) {
          H.style.fontSize = "", H.style.lineHeight = "";
          return;
        }
        const ce = H.getBoundingClientRect(), Q = i.getBoundingClientRect(), he = ce.top - Q.top + ce.height / 2, Ie = Math.min(1, Math.abs(he - _) / (A / 2)), le = 1 + Y * Math.cos(Ie * Math.PI / 2), R = parseFloat(H.dataset.origFs), V = H.dataset.origLh, re = V === "normal" ? R * 1.4 : parseFloat(V);
        isNaN(R) || (H.style.fontSize = `${(R * le).toFixed(2)}px`), isNaN(re) || (H.style.lineHeight = `${(re * le).toFixed(2)}px`);
      });
    }
    function U() {
      const i = q.value;
      i && Z(i).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    K(() => n.curvature, (i) => {
      (i ?? 0) === 0 ? U() : O();
    }), Ne(() => {
      var i;
      (i = q.value) == null || i.addEventListener("scroll", O, { passive: !0 }), _e(O);
    });
    function fe() {
      r(n.id, !u.value.minimized), _e(() => {
        ne.value++;
      });
    }
    function se() {
      f(n.id, !u.value.maximized), _e(() => {
        ne.value++;
      });
    }
    function ie() {
      a(n.id, !1);
    }
    function X() {
      l(n.id);
    }
    return (i, w) => u.value && u.value.visible ? (xe(), be("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: cl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ke(m.value),
      onMousedown: X
    }, [
      me("div", {
        class: "cc-titlebar",
        onMousedown: E
      }, [
        w[0] || (w[0] = me("span", { class: "cc-status-dot" }, null, -1)),
        me("span", Co, ze(t.title), 1),
        k.value ? (xe(), be("span", ko, ze(k.value), 1)) : Oe("", !0),
        me("div", Io, [
          me("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ot(fe, ["stop"])
          }, "─"),
          me("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: ot(se, ["stop"])
          }, ze(u.value.maximized ? "⤡" : "⤢"), 9, Lo),
          me("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ot(ie, ["stop"])
          }, "✕")
        ])
      ], 32),
      _n(me("div", Ro, [
        me("div", {
          ref_key: "bodyEl",
          ref: q,
          class: "cc-screen",
          onScroll: O
        }, [
          on(i.$slots, "default", { resizeKey: ne.value }, void 0, !0),
          w[1] || (w[1] = me("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ul, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (xe(), be("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ot(G, ["stop"])
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
    }, l = W(null), a = W(null);
    let r = null, f = !1;
    function v() {
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
    let h, s, u, m, p, S = null, C = 0;
    function E(y) {
      y - C >= Bo && (T(), C = y), S = requestAnimationFrame(E);
    }
    function c() {
      if (!l.value || !p) return;
      const y = l.value.clientWidth, k = l.value.clientHeight;
      y <= 0 || k <= 0 || p.width === y && p.height === k || (p.width = y, p.height = k, r && r.setSize(y, k, !1), a.value && (a.value.width = y, a.value.height = k, a.value.style.width = y + "px", a.value.style.height = k + "px"));
    }
    function g() {
      if (!(p != null && p.width)) return;
      const y = p.getContext("2d");
      if (!y) return;
      const k = p.width, G = p.height, j = e[n.theme] ?? e.none;
      y.clearRect(0, 0, k, G), y.fillStyle = j.bg, y.fillRect(0, 0, k, G);
      const te = Date.now(), ne = (te / 500 | 0) % 2 === 0, q = (te / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(k, G) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = j.text, n.glow && (y.shadowColor = j.text, y.shadowBlur = 14);
      const Z = ".".repeat(q).padEnd(3, " "), O = `${n.label}${Z}`;
      if (y.fillText(O, k / 2, G / 2), y.shadowBlur = 0, ne) {
        const U = y.measureText(O), fe = y.measureText("M").width, se = parseFloat(y.font), ie = k / 2 + U.width / 2 + 4, X = G / 2 - se / 2 + 2;
        y.fillStyle = j.cursor, n.glow && (y.shadowColor = j.cursor, y.shadowBlur = 12), y.fillRect(ie, X, fe * 0.7, se * 0.95), y.shadowBlur = 0;
      }
    }
    function T() {
      if (!p) return;
      if (g(), f) {
        if (!a.value) return;
        const k = a.value.getContext("2d");
        k && k.drawImage(p, 0, 0);
        return;
      }
      if (!r || !u || !m) return;
      const y = n.theme === "paper";
      u.uniforms.uStrength.value = Ze(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, m.needsUpdate = !0, r.render(h, s);
    }
    function D() {
      if (!(!a.value || !l.value)) {
        p = document.createElement("canvas");
        try {
          r = new $.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !r.getContext() && (r.dispose(), r = null, f = !0), f) {
          c();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), h = new $.Scene(), s = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new $.CanvasTexture(p), m.minFilter = $.LinearFilter, m.magFilter = $.LinearFilter, u = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ao,
          fragmentShader: _o,
          transparent: !0
        }), h.add(new $.Mesh(new $.PlaneGeometry(2, 2), u)), c();
      }
    }
    let N = null;
    Ne(() => {
      D(), T(), S = requestAnimationFrame(E), l.value && (N = new ResizeObserver(() => c()), N.observe(l.value));
    }), et(() => {
      S !== null && cancelAnimationFrame(S), N == null || N.disconnect(), v(), m == null || m.dispose(), u == null || u.dispose();
    }), K(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => T());
    const M = ae(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (y, k) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ke(M.value)
    }, [
      me("canvas", {
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
