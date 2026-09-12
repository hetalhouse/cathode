import { defineComponent as Qe, ref as Y, reactive as qt, watch as K, nextTick as _e, computed as ae, inject as Ht, onMounted as Ne, onUnmounted as et, openBlock as ye, createElementBlock as xe, normalizeStyle as Ke, createElementVNode as he, withModifiers as ot, withKeys as Tn, createCommentVNode as Oe, toDisplayString as ze, createVNode as An, withDirectives as _n, vModelText as ll, provide as Cn, renderSlot as on, Transition as ol, withCtx as al, Fragment as rl, renderList as il, createTextVNode as sl, normalizeClass as cl, vShow as ul } from "vue";
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
  const l = t.width, a = t.height, r = Ge[n.theme] ?? Ge.none, { cols: s, rows: h, pinnedRows: d, rowHeight: c, scrollY: u, scrollX: m, glow: p } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const k = d.length * c, S = n.aggregateRow ? Yn : 0, D = a - we - k - S;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, we), e.textBaseline = "middle", e.textAlign = "left";
  let i = -m;
  for (let g = 0; g < s.length; g++) {
    const v = s[g];
    if (i + v.width <= 0) {
      i += v.width;
      continue;
    }
    if (i >= l) break;
    const C = !!n.colFilters[v.colId], R = n.sortColId === v.colId, W = (v.colDef.headerName ?? v.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(i, 0, v.width, we), e.clip(), e.font = `bold ${fl}px system-ui, -apple-system, sans-serif`, e.fillStyle = C ? r.accent : r.textHeader, p ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(W, i + 8, we / 2), e.shadowBlur = 4, e.fillText(W, i + 8, we / 2), e.shadowBlur = 0) : e.fillText(W, i + 8, we / 2), R) {
      const _ = e.measureText(W).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", i + 8 + _ + 4, we / 2);
    }
    v.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = C ? r.accent : r.textHeader, e.globalAlpha = C ? 1 : 0.38, e.fillText("⌕", i + v.width - 20, we / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(i + v.width - 0.5, 0), e.lineTo(i + v.width - 0.5, we), e.stroke(), i += v.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, we - 0.5), e.lineTo(l, we - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, we, l, D), e.clip();
  const w = n.rowHeights && n.rowHeights.length === h.length ? n.rowHeights : null, T = w ? un(w, h.length) : null, F = (g) => T ? T[g] : g * c, U = (g) => w ? w[g] : c, M = T ? Bt(T, u) : Math.max(0, Math.floor(u / c));
  let y;
  if (T)
    for (y = M; y < h.length && F(y) < u + D; ) y++;
  else
    y = Math.min(h.length, Math.ceil((u + D) / c));
  const L = n.selectionAnchorRow ?? n.selectedRow, G = n.selectionAnchorCol ?? n.selectedCol, j = n.selectedRow >= 0 && L >= 0 ? Math.min(n.selectedRow, L) : -1, le = n.selectedRow >= 0 && L >= 0 ? Math.max(n.selectedRow, L) : -1, q = n.selectedCol >= 0 && G >= 0 ? Math.min(n.selectedCol, G) : -1, ee = n.selectedCol >= 0 && G >= 0 ? Math.max(n.selectedCol, G) : -1, Z = le > j || ee > q;
  let V = Number.POSITIVE_INFINITY, X = Number.NEGATIVE_INFINITY, ue = Number.POSITIVE_INFINITY, se = Number.NEGATIVE_INFINITY;
  const re = (g, v, C, R) => {
    p ? (e.shadowColor = R, e.shadowBlur = 12, e.fillText(g, v, C), e.shadowBlur = 6, e.fillText(g, v, C), e.shadowBlur = 2, e.fillText(g, v, C), e.shadowBlur = 0) : e.fillText(g, v, C);
  };
  for (let g = M; g < y; g++) {
    const v = h[g], C = U(g), R = we + F(g) - u;
    g % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, R, l, C));
    const W = g >= j && g <= le;
    g === n.hoveredRow && !W && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, R, l, C)), W && !Z && (e.fillStyle = Zt(r.accent, 0.1), e.fillRect(0, R, l, C)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, R + C - 0.5), e.lineTo(l, R + C - 0.5), e.stroke();
    let _ = -m;
    for (let N = 0; N < s.length; N++) {
      const $ = s[N];
      if (_ + $.width <= 0) {
        _ += $.width;
        continue;
      }
      if (_ >= l) break;
      const fe = W && N >= q && N <= ee;
      fe && Z && (e.fillStyle = Zt(r.accent, 0.14), e.fillRect(_, R, $.width, C)), fe && (_ < V && (V = _), _ + $.width > X && (X = _ + $.width), R < ue && (ue = R), R + C > se && (se = R + C));
      const te = n.getCellStyle($, v), ge = te.color ?? r.text, Ie = te.textAlign ?? "left", ne = n.formatCell($, v);
      if (e.save(), e.beginPath(), e.rect(_ + 1, R, $.width - 2, C), e.clip(), e.font = _t(), e.fillStyle = ge, e.textBaseline = "middle", $.colDef.wrap) {
        e.textAlign = "left";
        const I = Wn(e, ne, Math.max(20, $.width - 16));
        let O = R + Bn + At / 2;
        for (const ie of I) {
          if (O - At / 2 >= R + C) break;
          re(ie, _ + 8, O, ge), O += At;
        }
      } else {
        const I = Ie === "right" ? _ + $.width - 8 : _ + 8;
        e.textAlign = Ie === "right" ? "right" : "left", re(ne, I, R + C / 2, ge);
      }
      e.restore(), g === n.selectedRow && N === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(_ + 1.5, R + 1.5, $.width - 3, C - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(_ + $.width - 0.5, R), e.lineTo(_ + $.width - 0.5, R + C), e.stroke(), _ += $.width;
    }
  }
  if (Z && V < X && ue < se && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(V + 0.5, ue + 0.5, X - V - 1, se - ue - 1)), e.restore(), d.length > 0) {
    const g = a - k - S;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, g - 0.5), e.lineTo(l, g - 0.5), e.stroke();
    for (let v = 0; v < d.length; v++) {
      const C = d[v], R = g + v * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, R, l, c);
      let W = -m;
      for (let _ = 0; _ < s.length; _++) {
        const N = s[_];
        if (W + N.width <= 0) {
          W += N.width;
          continue;
        }
        if (W >= l) break;
        const $ = n.getCellStyle(N, C), fe = $.color ?? r.text, te = $.textAlign ?? "left", ge = n.formatCell(N, C);
        e.save(), e.beginPath(), e.rect(W + 1, R, N.width - 2, c), e.clip(), e.font = `bold ${an}px system-ui, -apple-system, sans-serif`, e.fillStyle = fe, e.textBaseline = "middle", te === "right" ? (e.textAlign = "right", e.fillText(ge, W + N.width - 8, R + c / 2)) : (e.textAlign = "left", e.fillText(ge, W + 8, R + c / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(W + N.width - 0.5, R), e.lineTo(W + N.width - 0.5, R + c), e.stroke(), W += N.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, R + c - 0.5), e.lineTo(l, R + c - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const g = a - S;
    e.fillStyle = Zt(r.accent, 0.1), e.fillRect(0, g, l, S), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, g - 0.5), e.lineTo(l, g - 0.5), e.stroke();
    let v = -m;
    for (let C = 0; C < s.length; C++) {
      const R = s[C];
      if (v + R.width <= 0) {
        v += R.width;
        continue;
      }
      if (v >= l) break;
      const _ = n.getCellStyle(R, n.aggregateRow).textAlign ?? "left", N = n.aggregateRow[R.colId] ?? "";
      e.save(), e.beginPath(), e.rect(v + 1, g, R.width - 2, S), e.clip(), e.font = `bold ${an}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", p && (e.shadowColor = r.accent, e.shadowBlur = 8), _ === "right" ? (e.textAlign = "right", e.fillText(N, v + R.width - 8, g + S / 2)) : (e.textAlign = "left", e.fillText(N, v + 8, g + S / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(v + R.width - 0.5, g), e.lineTo(v + R.width - 0.5, g + S), e.stroke(), v += R.width;
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
    const c = 0.5 * r, m = 1 / (1 - 2 * (0.5 * (1 + c) * c)), p = (l + l * (1 + s) * s * -1) * m, k = (a + a * (1 + s) * s * -1) * m;
    return [0.5 + p, 0.5 + k];
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
  let p = -1, k = 0;
  for (let T = 0; T < e.length; T++) {
    if (m >= k && m < k + e[T].width) {
      p = T;
      break;
    }
    k += e[T].width;
  }
  if (n < we) return { area: "header", colIdx: p, rowIdx: -1 };
  const S = c ? Yn : 0;
  if (S > 0 && n >= s - S)
    return { area: "agg", colIdx: p, rowIdx: -1 };
  const D = h * a;
  if (D > 0 && n >= s - D - S) {
    const T = Math.floor((n - (s - D - S)) / a);
    return { area: "pinned", colIdx: p, rowIdx: T };
  }
  const i = n - we + r, w = u && u.length === l ? Bt(un(u, l), i) : Math.floor(i / a);
  return w >= 0 && w < l ? { area: "body", colIdx: p, rowIdx: w } : { area: "none", colIdx: -1, rowIdx: -1 };
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
    const e = t, l = n, a = Y(e.rowData ?? []), r = Y(e.pinnedBottomRowData ?? []), s = Y(""), h = Y(null), d = qt({}), c = qt({}), u = qt(/* @__PURE__ */ new Set()), m = Y(0), p = Y(0), k = Y(0), S = Y(0), D = Y(0), i = Y(0), w = Y(0), T = Y(-1), F = Y(null), U = Y(null), M = Y(null), y = { ...be }, L = Y(""), G = Y(0), j = Y(null);
    let le = null;
    const q = Y(!0);
    let ee = null;
    K(M, (o) => {
      var f;
      ee && (clearInterval(ee), ee = null), o ? (q.value = !0, ee = setInterval(() => {
        q.value = !q.value, pe();
      }, 530), _e(() => {
        var x;
        return (x = j.value) == null ? void 0 : x.focus();
      })) : (le = null, (f = j.value) == null || f.blur()), pe();
    });
    function Z(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const V = ae(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((f) => !u.has(Z(f))).map((f) => {
        const x = Z(f), A = { ...o, ...f };
        return { colId: x, colDef: A, width: c[x] ?? A.width ?? 100 };
      });
    }), X = ae(() => {
      const o = p.value;
      if (!o) return V.value;
      const f = V.value.reduce((E, B) => E + B.width, 0);
      if (!f || f >= o) return V.value;
      const x = o / f;
      let A = 0;
      return V.value.map((E, B) => {
        const ve = B === V.value.length - 1 ? o - A : Math.max(8, Math.round(E.width * x));
        return A += ve, { ...E, width: ve };
      });
    }), ue = ae(() => {
      const o = X.value.reduce((f, x) => f + x.width, 0);
      return Math.max(0, o - p.value);
    });
    let se = null;
    function re() {
      if (typeof document > "u") return null;
      se || (se = document.createElement("canvas"));
      const o = se.getContext("2d");
      return o && (o.font = _t()), o;
    }
    const g = ae(() => X.value.some((o) => o.colDef.wrap)), v = ae(() => {
      if (!g.value) return null;
      const o = re();
      if (!o) return null;
      const f = X.value.filter((A) => A.colDef.wrap), x = e.rowHeight;
      return ne.value.map((A) => {
        let E = 1;
        for (const B of f) {
          const H = Wn(o, ge(B, A), Math.max(20, B.width - 16));
          H.length > E && (E = H.length);
        }
        return dl(E, x);
      });
    }), C = ae(
      () => v.value ? un(v.value, ne.value.length) : null
    ), R = ae(
      () => C.value ? C.value[ne.value.length] : ne.value.length * e.rowHeight
    ), W = ae(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, k.value - we - o);
    }), _ = ae(
      () => Math.max(0, R.value - W.value)
    ), N = ae(
      () => Math.max(1, Math.floor(W.value / e.rowHeight))
    ), $ = ae(() => {
      const o = ne.value.length;
      if (o === 0) return 0;
      const f = C.value ? Bt(C.value, i.value) : Math.floor(i.value / e.rowHeight);
      return Math.min(o - 1, f);
    }), fe = ae(() => {
      const o = ne.value.length;
      return o === 0 ? 0 : C.value ? Math.min(o - 1, Bt(C.value, i.value + W.value - 1)) : Math.min(o - 1, $.value + N.value - 1);
    });
    function te(o, f) {
      if (f.colDef.valueGetter) return f.colDef.valueGetter({ data: o, colDef: f.colDef });
      if (f.colDef.field) return o[f.colDef.field];
    }
    function ge(o, f) {
      const x = te(f, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: f, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: f, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function Ie(o, f) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: te(f, o), data: f, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const ne = ae(() => {
      m.value;
      let o = a.value;
      const f = s.value.trim().toLowerCase();
      f && (o = o.filter(
        (x) => V.value.some(
          (A) => String(te(x, A) ?? "").toLowerCase().includes(f)
        )
      ));
      for (const [x, A] of Object.entries(d)) {
        if (!A) continue;
        const E = V.value.find((B) => B.colId === x);
        if (E)
          if (A.startsWith("__eq__")) {
            const B = A.slice(6).toLowerCase();
            o = o.filter((H) => String(te(H, E) ?? "").toLowerCase() === B);
          } else {
            const B = A.toLowerCase();
            o = o.filter((H) => String(te(H, E) ?? "").toLowerCase().includes(B));
          }
      }
      if (h.value) {
        const { colId: x, dir: A } = h.value, E = V.value.find((B) => B.colId === x);
        E && (o = [...o].sort((B, H) => {
          const ve = te(B, E), oe = te(H, E);
          let me = 0;
          return E.colDef.comparator ? me = E.colDef.comparator(ve, oe) : typeof ve == "number" && typeof oe == "number" ? me = ve - oe : me = String(ve ?? "").localeCompare(String(oe ?? ""), void 0, { numeric: !0 }), A === "asc" ? me : -me;
        }));
      }
      return o;
    }), I = ae(() => {
      const o = V.value.filter((E) => E.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const f = ne.value, x = {};
      for (const E of o) {
        const B = f.map((ve) => te(ve, E)), H = vl(B, E.colDef.aggFunc);
        if (H == null) {
          x[E.colId] = "";
          continue;
        }
        x[E.colId] = E.colDef.aggValueFormatter ? E.colDef.aggValueFormatter(H) : String(H);
      }
      const A = o[0].colId;
      return x[A] === "" && (x[A] = "Σ"), x;
    });
    K(ne, () => {
      i.value = 0, F.value = null;
    }), K(ue, () => {
      w.value = Math.min(w.value, ue.value);
    }), K(_, () => {
      i.value = Math.min(i.value, _.value);
    });
    function O(o) {
      const f = C.value, x = f ? f[o] : o * e.rowHeight, A = f ? f[o + 1] : x + e.rowHeight;
      x < i.value ? i.value = x : A > i.value + W.value && (i.value = Math.min(_.value, A - W.value));
    }
    function ie() {
      i.value = Math.max(0, i.value - W.value), pe();
    }
    function Me() {
      i.value = Math.min(_.value, i.value + W.value), pe();
    }
    let Ce = !1, Pe = "", it = 0, st = 0, nt = 1, Re = !1, Ee = !1, De = 0, Fe = 0, Ue = 0, ct = 0, Le = !1;
    function It(o, f, x = 1) {
      var A;
      Ce = !0, Pe = o, it = f, nt = x, st = ((A = X.value.find((E) => E.colId === o)) == null ? void 0 : A.width) ?? 100, Re = !1;
    }
    function pt(o) {
      if (Ee) {
        const B = De - o.clientX, H = Fe - o.clientY;
        (Math.abs(B) > 4 || Math.abs(H) > 4) && (Le = !0), w.value = Math.max(0, Math.min(ue.value, Ue + B)), i.value = Math.max(0, Math.min(_.value, ct + H)), pe();
        return;
      }
      if (!Ce) return;
      const f = p.value, x = Math.max(30, st + (o.clientX - it) * nt), A = V.value.filter((B) => B.colId !== Pe).reduce((B, H) => B + H.width, 0), E = f - x;
      E > 10 && (c[Pe] = Math.max(10, Math.round(x * A / E))), pe();
    }
    function Lt() {
      Ee && (Le && (Re = !0), Ee = !1), Ce && (Ce = !1, Re = !0, l("column-resized"));
    }
    function Ut(o) {
      if (o.touches.length !== 1) return;
      const f = o.touches[0];
      Ee = !0, Le = !1, De = f.clientX, Fe = f.clientY, Ue = w.value, ct = i.value;
    }
    function b(o) {
      if (!Ee || o.touches.length !== 1) return;
      o.preventDefault();
      const f = o.touches[0], x = De - f.clientX, A = Fe - f.clientY;
      (Math.abs(x) > 4 || Math.abs(A) > 4) && (Le = !0), w.value = Math.max(0, Math.min(ue.value, Ue + x)), i.value = Math.max(0, Math.min(_.value, ct + A)), pe();
    }
    function P() {
      Ee && (Le && (Re = !0), Ee = !1);
    }
    const J = Y(null), Q = Y(null), Ve = Ht("cathodeResetTick", Y(0));
    K(Ve, () => dt());
    let ce = null, ke = !1;
    function ut() {
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
      if (!(!Q.value || !J.value)) {
        de = document.createElement("canvas");
        try {
          ce = new z.WebGLRenderer({ canvas: Q.value, antialias: !1, alpha: !0 });
        } catch {
          ke = !0;
        }
        if (!ke && !ce.getContext() && (ce.dispose(), ce = null, ke = !0), ke) {
          ft();
          return;
        }
        ce.setPixelRatio(1), ce.setClearColor(0, 0), $e = new z.Scene(), gn = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), Ae = new z.CanvasTexture(de), Ae.minFilter = z.LinearFilter, Ae.magFilter = z.LinearFilter, He = new z.ShaderMaterial({
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
        }), $e.add(new z.Mesh(new z.PlaneGeometry(2, 2), He)), ft();
      }
    }
    function ft() {
      if (!J.value || !ce && !ke) return;
      const o = J.value.clientWidth, f = J.value.clientHeight - (e.pagination ? Cl : 0);
      if (!o || !f) return;
      S.value = o, D.value = f;
      const x = e.bendField ? Math.round(o * Hn(e.curvature)) : o, A = de.width !== x || de.height !== f;
      de.width = x, de.height = f, p.value = x, k.value = f, w.value = Math.max(0, Math.min(ue.value, w.value)), i.value = Math.max(0, Math.min(_.value, i.value)), ce ? (A && Ae && (Ae.dispose(), Ae = new z.CanvasTexture(de), Ae.minFilter = z.LinearFilter, Ae.magFilter = z.LinearFilter, He && (He.uniforms.uTex.value = Ae)), ce.setPixelRatio(window.devicePixelRatio || 1), ce.setSize(o, f)) : Q.value && (Q.value.width = o, Q.value.height = f, Q.value.style.width = o + "px", Q.value.style.height = f + "px"), pe();
    }
    function pe() {
      var x, A, E, B, H, ve, oe, me, Be, bt, Mt, vt;
      if (!(de != null && de.width)) return;
      if (ke) {
        if (!Q.value) return;
        kn(de, {
          cols: X.value,
          rows: ne.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: v.value ?? void 0,
          scrollY: i.value,
          scrollX: w.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = h.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((A = h.value) == null ? void 0 : A.dir) ?? null,
          colFilters: d,
          hoveredRow: T.value,
          selectedRow: ((E = F.value) == null ? void 0 : E.row) ?? -1,
          selectedCol: ((B = F.value) == null ? void 0 : B.col) ?? -1,
          selectionAnchorRow: ((H = U.value) == null ? void 0 : H.row) ?? -1,
          selectionAnchorCol: ((ve = U.value) == null ? void 0 : ve.col) ?? -1,
          formatCell: ge,
          getCellStyle: Ie
        }), wn();
        const St = Q.value.getContext("2d");
        St && St.drawImage(de, 0, 0, de.width, de.height, 0, 0, Q.value.width, Q.value.height);
        return;
      }
      if (!ce || !He || !Ae) return;
      const o = Ge[e.theme] ?? Ge.none, f = e.theme === "paper";
      He.uniforms.uStrength.value = Ze(e.curvature), He.uniforms.uScanlines.value = e.scanlines && !f ? 1 : 0, He.uniforms.uVignette.value = f ? 0 : 1, He.uniforms.uBezel.value.set(o.bg), Nt(He, e.magnify, y, S.value || de.width, D.value || de.height), kn(de, {
        cols: X.value,
        rows: ne.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: v.value ?? void 0,
        scrollY: i.value,
        scrollX: w.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((oe = h.value) == null ? void 0 : oe.colId) ?? null,
        sortDir: ((me = h.value) == null ? void 0 : me.dir) ?? null,
        colFilters: d,
        hoveredRow: T.value,
        selectedRow: ((Be = F.value) == null ? void 0 : Be.row) ?? -1,
        selectedCol: ((bt = F.value) == null ? void 0 : bt.col) ?? -1,
        selectionAnchorRow: ((Mt = U.value) == null ? void 0 : Mt.row) ?? -1,
        selectionAnchorCol: ((vt = U.value) == null ? void 0 : vt.col) ?? -1,
        formatCell: ge,
        getCellStyle: Ie,
        aggregateRow: I.value
      }), wn(), Ae.needsUpdate = !0, ce.render($e, gn);
    }
    function wn() {
      if (!M.value || !(de != null && de.width)) return;
      const o = de.getContext("2d");
      if (!o) return;
      le = hl(de.width, G.value, !!L.value);
      const f = Ge[e.theme] ?? Ge.none;
      ml(o, le, L.value, q.value, f);
    }
    function Gt(o, f) {
      if (!Q.value) return [-1, -1];
      const x = Q.value.getBoundingClientRect(), A = o - x.left, E = f - x.top, B = x.width, H = x.height, ve = Ze(e.curvature), [oe, me] = Pn(A, E, B, H, ve, de.width || B, de.height || H);
      return oe < 0 ? [-1, -1] : [oe, me];
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
      f - Kt < kl || (i.value = Math.max(0, Math.min(_.value, i.value + o.deltaY)), pe());
    }
    function Un(o) {
      if (Ce) return;
      if (e.magnify && Q.value) {
        const E = Xt(o, Q.value);
        y.x = E.x, y.y = E.y;
      }
      const [f, x] = Rt(o);
      if (f < 0) {
        T.value = -1, pe();
        return;
      }
      if (M.value && le) {
        const E = Dt(f, x, le, lt(o));
        if (E !== "outside") {
          T.value = -1, Q.value.style.cursor = E === "clear" ? "pointer" : "text", pe();
          return;
        }
      }
      const A = Ln(
        f,
        x,
        X.value,
        ne.value.length,
        e.rowHeight,
        i.value,
        de.height,
        r.value.length,
        w.value,
        I.value !== null,
        v.value ?? void 0
      );
      if (T.value = A.area === "body" ? A.rowIdx : -1, A.area === "header" && A.colIdx >= 0) {
        const E = X.value[A.colIdx], B = en(A.colIdx, X.value), H = f + w.value;
        Q.value.style.cursor = E && In(H, B, E.width, lt(o)) ? "col-resize" : "pointer";
      } else A.area === "body" ? Q.value.style.cursor = "pointer" : Q.value.style.cursor = "default";
      pe();
    }
    function Gn() {
      T.value = -1, y.x = be.x, y.y = be.y, pe();
    }
    function Kn(o) {
      const [f, x] = Rt(o);
      if (f < 0 || M.value && le && Dt(f, x, le, lt(o)) !== "outside") return;
      if (x >= we) {
        Ee = !0, Le = !1, De = o.clientX, Fe = o.clientY, Ue = w.value, ct = i.value;
        return;
      }
      const A = f + w.value, E = lt(o);
      for (let B = 0; B < X.value.length; B++) {
        const H = X.value[B], ve = en(B, X.value);
        if (H.colDef.resizable !== !1 && In(A, ve, H.width, E)) {
          It(H.colId, o.clientX, E);
          return;
        }
      }
    }
    function jn(o) {
      var E, B, H, ve;
      if (Re) {
        Re = !1;
        return;
      }
      if (Ce) return;
      const [f, x] = Rt(o);
      if (f < 0) {
        M.value = null;
        return;
      }
      if (M.value && le) {
        const oe = Dt(f, x, le, lt(o));
        if (oe === "clear") {
          xn();
          return;
        }
        if (oe !== "outside") {
          (E = j.value) == null || E.focus();
          return;
        }
        M.value = null;
      }
      const A = Ln(
        f,
        x,
        X.value,
        ne.value.length,
        e.rowHeight,
        i.value,
        de.height,
        r.value.length,
        w.value,
        I.value !== null,
        v.value ?? void 0
      );
      if (A.area === "header" && A.colIdx >= 0) {
        const oe = X.value[A.colIdx], me = en(A.colIdx, X.value), Be = f + w.value;
        oe.colDef.filter && pl(Be, me, oe.width, lt(o)) ? (o.stopPropagation(), M.value === oe.colId ? M.value = null : (M.value = oe.colId, L.value = (B = d[oe.colId]) != null && B.startsWith("__eq__") ? d[oe.colId].slice(6) : d[oe.colId] ?? "", G.value = Math.max(0, me - w.value))) : oe.colDef.sortable !== !1 && (M.value = null, h.value = ((H = h.value) == null ? void 0 : H.colId) === oe.colId ? h.value.dir === "asc" ? { colId: oe.colId, dir: "desc" } : null : { colId: oe.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (M.value = null, A.area === "body" && A.rowIdx >= 0 && A.colIdx >= 0) {
        const oe = A.rowIdx;
        o.shiftKey && F.value ? (U.value || (U.value = { ...F.value }), F.value = { row: oe, col: A.colIdx }) : (F.value = { row: oe, col: A.colIdx }, U.value = { row: oe, col: A.colIdx }), (ve = Q.value) == null || ve.focus();
        const me = ne.value[oe], Be = X.value[A.colIdx];
        me && Be && (l("row-clicked", { data: me, event: o }), l("cell-selected", { data: me, row: oe, col: A.colIdx, colId: Be.colId }));
      }
    }
    function yn(o) {
      if (M.value) {
        if (o.target === Q.value && le) {
          const [f, x] = Rt(o);
          if (f >= 0 && Dt(f, x, le, lt(o)) !== "outside") return;
        }
        M.value = null;
      }
    }
    function qn(o) {
      var E;
      if (!p.value) return;
      let f = 0;
      for (let B = 0; B < o; B++) f += X.value[B].width;
      const x = ((E = X.value[o]) == null ? void 0 : E.width) ?? 0, A = f - w.value;
      A < 0 ? w.value = Math.max(0, f) : A + x > p.value && (w.value = Math.min(ue.value, f + x - p.value));
    }
    function Zn(o) {
      const x = X.value.length - 1, A = ne.value.length - 1;
      if (!F.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), F.value = { row: $.value, col: 0 }, U.value = { row: $.value, col: 0 });
        return;
      }
      let { row: E, col: B } = F.value;
      const H = (ve, oe, me = !1) => {
        E = Math.max(0, Math.min(A, ve)), B = Math.max(0, Math.min(x, oe)), F.value = { row: E, col: B }, me || (U.value = { row: E, col: B }), O(E), qn(B);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), H(E + 1, B, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), H(E - 1, B, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? H(E, B + 1, !0) : B < x ? H(E, B + 1) : H(E + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? H(E, B - 1, !0) : B > 0 ? H(E, B - 1) : H(E - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? B > 0 ? H(E, B - 1) : H(E - 1, x) : B < x ? H(E, B + 1) : H(E + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? H(E - 1, B) : H(E + 1, B);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? H(0, 0, o.shiftKey) : H(E, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? H(A, x, o.shiftKey) : H(E, x, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), H(Math.min(A, E + N.value), B, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), H(Math.max(0, E - N.value), B, o.shiftKey);
          break;
        case "Escape":
          F.value = null, U.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), Jn());
          break;
      }
    }
    function Jn() {
      var me;
      if (!F.value) return;
      const o = X.value, f = ne.value, x = U.value ?? F.value, A = Math.min(x.row, F.value.row), E = Math.max(x.row, F.value.row), B = Math.min(x.col, F.value.col), H = Math.max(x.col, F.value.col), ve = [];
      for (let Be = A; Be <= E; Be++) {
        const bt = f[Be];
        if (!bt) continue;
        const Mt = [];
        for (let vt = B; vt <= H; vt++) {
          const St = o[vt];
          St && Mt.push(ge(St, bt).replace(/[\t\r\n]+/g, " "));
        }
        ve.push(Mt.join("	"));
      }
      const oe = ve.join(`
`);
      (me = navigator.clipboard) == null || me.writeText(oe).catch(() => {
      });
    }
    function Qn(o) {
      const f = o.target.value;
      L.value = f, f ? d[M.value] = f : delete d[M.value], l("filter-changed");
    }
    function xn() {
      M.value && delete d[M.value], L.value = "", M.value = null, l("filter-changed");
    }
    const el = {
      setGridOption(o, f) {
        o === "rowData" ? a.value = f : o === "pinnedBottomRowData" ? r.value = f : o === "quickFilterText" && (s.value = f);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, A;
          const f = Z(o);
          return {
            colId: f,
            hide: u.has(f),
            sort: ((x = h.value) == null ? void 0 : x.colId) === f ? h.value.dir : null,
            sortIndex: ((A = h.value) == null ? void 0 : A.colId) === f ? 0 : null,
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
        const f = V.value, x = f.map((H) => H.colDef.headerName ?? H.colId).join(","), A = ne.value.map(
          (H) => f.map((ve) => `"${String(ge(ve, H)).replace(/"/g, '""')}"`).join(",")
        ), E = new Blob([[x, ...A].join(`
`)], { type: "text/csv" }), B = URL.createObjectURL(E);
        Object.assign(document.createElement("a"), { href: B, download: o }).click(), URL.revokeObjectURL(B);
      },
      resize() {
        ft();
      },
      resetColumnState() {
        u.clear();
        for (const f of e.columnDefs)
          f.hide && u.add(Z(f));
        const o = e.columnDefs.find((f) => f.sort);
        h.value = o ? { colId: Z(o), dir: o.sort } : null;
        for (const f of Object.keys(c)) delete c[f];
        for (const f of Object.keys(d)) delete d[f];
        s.value = "", i.value = 0, F.value = null, M.value = null;
      }
    };
    K(
      [ne, () => r.value, X, i, T, F],
      () => _e(pe)
    ), K(() => e.theme, () => pe()), K(() => [e.curvature, e.bendField], () => _e(ft)), K(() => e.scanlines, () => pe()), K(() => e.glow, () => pe()), K(() => e.magnify, (o) => {
      o || (y.x = be.x, y.y = be.y), pe();
    }), K(F, (o) => {
      if (!o) return;
      const f = ne.value[o.row], x = X.value[o.col];
      f && x && l("cell-selected", { data: f, row: o.row, col: o.col, colId: x.colId });
    });
    let wt = null, yt = null, jt = 0;
    function dt() {
      cancelAnimationFrame(jt), jt = requestAnimationFrame(ft);
    }
    function bn(o) {
      o.preventDefault();
    }
    function Mn() {
      ce == null || ce.dispose(), ce = null, ke = !1, pn();
    }
    Ne(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(Z(o)), o.sort && !h.value && (h.value = { colId: Z(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", yn), document.addEventListener("mousemove", pt), document.addEventListener("mouseup", Lt), _e(() => {
        var o;
        pn(), Q.value && (Q.value.addEventListener("webglcontextlost", bn), Q.value.addEventListener("webglcontextrestored", Mn)), J.value && (wt = new ResizeObserver(() => ft()), wt.observe(J.value), yt = new IntersectionObserver((f) => {
          f.some((x) => x.isIntersecting) && dt();
        }), yt.observe(J.value)), window.addEventListener("resize", dt), (o = window.visualViewport) == null || o.addEventListener("resize", dt), l("grid-ready", { api: el });
      });
    }), et(() => {
      var o, f, x;
      document.removeEventListener("click", yn, !0), document.removeEventListener("mousemove", pt), document.removeEventListener("mouseup", Lt), (o = Q.value) == null || o.removeEventListener("webglcontextlost", bn), (f = Q.value) == null || f.removeEventListener("webglcontextrestored", Mn), wt == null || wt.disconnect(), yt == null || yt.disconnect(), window.removeEventListener("resize", dt), (x = window.visualViewport) == null || x.removeEventListener("resize", dt), cancelAnimationFrame(jt), ut();
    });
    const xt = ae(() => Ge[e.theme] ?? Ge.none), tl = ae(() => ({
      background: xt.value.headerBg,
      borderTop: `1px solid ${xt.value.border}`,
      color: xt.value.text
    })), nl = ae(() => ({
      background: xt.value.bg
    })), Sn = ae(() => xt.value.accent);
    return (o, f) => {
      var x, A;
      return ye(), xe("div", {
        ref_key: "wrapEl",
        ref: J,
        class: "cathode-wrap",
        style: Ke(nl.value)
      }, [
        he("canvas", {
          ref_key: "canvasEl",
          ref: Q,
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
        M.value ? (ye(), xe("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: j,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: L.value,
          autofocus: "",
          onInput: Qn,
          onKeydown: [
            Tn(xn, ["escape"]),
            f[0] || (f[0] = Tn((E) => M.value = null, ["enter"]))
          ]
        }, null, 40, bl)) : Oe("", !0),
        t.pagination ? (ye(), xe("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ke(tl.value)
        }, [
          he("button", {
            disabled: i.value <= 0,
            onClick: f[1] || (f[1] = (E) => ie())
          }, "◀", 8, Ml),
          he("span", null, ze(($.value + 1).toLocaleString()) + "–" + ze(Math.min(ne.value.length, fe.value + 1).toLocaleString()) + " / " + ze(ne.value.length.toLocaleString()), 1),
          he("button", {
            disabled: i.value >= _.value,
            onClick: f[2] || (f[2] = (E) => Me())
          }, "▶", 8, Sl),
          he("span", {
            class: "cathode-page-info",
            style: Ke({ color: Sn.value })
          }, ze(ne.value.length.toLocaleString()) + " rows ", 5),
          F.value ? (ye(), xe("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ke({ color: Sn.value })
          }, ze(((x = X.value[F.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((A = X.value[F.value.col]) == null ? void 0 : A.colId)) + " : " + ze(ge(X.value[F.value.col], ne.value[F.value.row])), 5)) : Oe("", !0)
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
const Rl = 12, Se = 18, kt = 10, at = 6, fn = `${Rl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
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
    const c = n[d], u = c.level ?? "info", m = a && c.ts != null ? s(c.ts) : "", p = r ? El(e, c.text, l) : c.text.split(`
`);
    for (let k = 0; k < p.length; k++)
      h.push({
        entryIdx: d,
        text: p[k],
        level: u,
        timestamp: k === 0 ? m : "",
        isFirstFrag: k === 0,
        widthPx: e.measureText(p[k]).width
      });
  }
  return h;
}
function Rn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Wt[n.theme] ?? Wt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = fn, e.textBaseline = "middle";
  const s = n.visualLines, h = kt - n.scrollX, d = (n.showTimestamps ? kt + n.timestampWidth : kt) - n.scrollX, c = Math.max(0, Math.floor((n.scrollY - at) / Se)), u = Math.min(s.length, Math.ceil((n.scrollY + a - at) / Se) + 1);
  for (let m = c; m < u; m++) {
    const p = s[m], k = at + m * Se - n.scrollY + Se / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let D = 1;
      for (; m + D < u && s[m + D].entryIdx === p.entryIdx; ) D++;
      e.fillRect(0, k - Se / 2, l, Se * D);
    }
    n.selectionStart >= 0 && m >= n.selectionStart && m <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, k - Se / 2, l, Se)), m === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, k - Se / 2, l, Se)), n.showTimestamps && p.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(p.timestamp, h, k), e.shadowBlur = 0);
    const S = Ll(r, p.level);
    e.fillStyle = S, e.textAlign = "left", n.glow ? (e.shadowColor = S, e.shadowBlur = 14, e.fillText(p.text, d, k), e.shadowBlur = 7, e.fillText(p.text, d, k), e.shadowBlur = 3, e.fillText(p.text, d, k), e.shadowBlur = 0) : e.fillText(p.text, d, k);
  }
  e.restore();
}
function En(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - at) / Se);
  return l < 0 || l >= e ? -1 : l;
}
function Al(t) {
  return at * 2 + t * Se;
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
    const e = t, l = Y(null), a = Y(null), r = { ...be }, s = Y(0), h = Y(0), d = Y(0), c = Y(-1), u = Y(!0), m = Y(-1), p = Y(-1), k = ae(() => {
      const b = e.entries ?? [];
      return e.maxLines > 0 && b.length > e.maxLines ? b.slice(b.length - e.maxLines) : b;
    }), S = ae(() => {
      if (!e.showTimestamps) return "";
      const b = e.formatTs ?? zn;
      let P = "00:00:00";
      for (const J of k.value) {
        if (J.ts == null) continue;
        const Q = b(J.ts);
        Q.length > P.length && (P = Q);
      }
      return P;
    }), D = Y(0), i = Y([]);
    function w() {
      if (!V) return;
      const b = V.getContext("2d");
      if (!b) return;
      b.font = fn;
      const P = e.showTimestamps ? Dl(b, S.value) : 0;
      D.value = P;
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
    const T = ae(() => Al(i.value.length)), F = ae(() => Math.max(0, T.value - h.value)), U = ae(() => {
      let b = 0;
      for (const P of i.value) P.widthPx > b && (b = P.widthPx);
      return kt * 2 + D.value + b;
    }), M = ae(() => Math.max(0, U.value - s.value)), y = Y(0);
    K(F, () => {
      u.value ? d.value = F.value : d.value = Math.min(d.value, F.value);
    }), K(M, () => {
      y.value = Math.min(y.value, M.value);
    }), K(
      [k, s, () => e.showTimestamps, () => e.wordWrap, S],
      () => {
        w(), _e(re);
      },
      { deep: !1 }
    );
    let L = null, G = !1;
    function j() {
      if (L) {
        try {
          L.forceContextLoss();
        } catch {
        }
        try {
          L.dispose();
        } catch {
        }
        L = null;
      }
    }
    let le, q, ee, Z, V;
    const X = `
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
          L = new z.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          G = !0;
        }
        if (!G && !L.getContext() && (L.dispose(), L = null, G = !0), G) {
          se();
          return;
        }
        L.setPixelRatio(1), L.setClearColor(0, 0), le = new z.Scene(), q = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), Z = new z.CanvasTexture(V), Z.minFilter = z.LinearFilter, Z.magFilter = z.LinearFilter, ee = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: Z },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: _l,
          fragmentShader: X,
          transparent: !0
        }), le.add(new z.Mesh(new z.PlaneGeometry(2, 2), ee)), se();
      }
    }
    function se() {
      if (!l.value || !L && !G) return;
      const b = l.value.clientWidth, P = l.value.clientHeight;
      if (!b || !P) return;
      const J = V.width !== b || V.height !== P;
      J && (V.width = b, V.height = P, s.value = b, h.value = P, w(), L ? (J && Z && (Z.dispose(), Z = new z.CanvasTexture(V), Z.minFilter = z.LinearFilter, Z.magFilter = z.LinearFilter, ee && (ee.uniforms.uTex.value = Z)), L.setPixelRatio(window.devicePixelRatio || 1), L.setSize(b, P)) : a.value && (a.value.width = b, a.value.height = P, a.value.style.width = b + "px", a.value.style.height = P + "px"), u.value && (d.value = Math.max(0, T.value - h.value)), re());
    }
    function re() {
      if (!(V != null && V.width)) return;
      if (G) {
        if (!a.value) return;
        Rn(V, {
          visualLines: i.value,
          scrollY: d.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: D.value,
          hoveredLine: c.value,
          selectionStart: Math.min(m.value, p.value),
          selectionEnd: Math.max(m.value, p.value)
        });
        const P = a.value.getContext("2d");
        P && P.drawImage(V, 0, 0);
        return;
      }
      if (!L || !ee || !Z) return;
      const b = e.theme === "paper";
      ee.uniforms.uStrength.value = Ze(e.curvature), ee.uniforms.uScanlines.value = e.scanlines && !b ? 1 : 0, ee.uniforms.uVignette.value = b ? 0 : 1, Nt(ee, e.magnify, r, V.width, V.height), Rn(V, {
        visualLines: i.value,
        scrollY: d.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: D.value,
        hoveredLine: c.value,
        selectionStart: Math.min(m.value, p.value),
        selectionEnd: Math.max(m.value, p.value)
      }), Z.needsUpdate = !0, L.render(le, q);
    }
    K(() => e.theme, () => re()), K(() => e.curvature, () => re()), K(() => e.scanlines, () => re()), K(() => e.glow, () => re()), K(() => e.magnify, (b) => {
      b || (r.x = be.x, r.y = be.y), re();
    }), K(d, () => re()), K(y, () => re()), K(c, () => re()), K([m, p], () => re());
    function g(b) {
      if (!a.value) return [-1, -1];
      const P = a.value.getBoundingClientRect();
      return [b.clientX - P.left, b.clientY - P.top];
    }
    function v(b) {
      d.value = Math.max(0, Math.min(F.value, b)), u.value = d.value >= F.value - 4;
    }
    function C(b) {
      y.value = Math.max(0, Math.min(M.value, b));
    }
    function R(b) {
      b.shiftKey ? C(y.value + b.deltaY) : Math.abs(b.deltaX) > Math.abs(b.deltaY) ? C(y.value + b.deltaX) : v(d.value + b.deltaY);
    }
    let W = !1, _ = 0, N = 0, $ = 0, fe = 0, te = !1;
    function ge(b) {
      W = !0, te = !1, _ = b.clientX, N = b.clientY, $ = y.value, fe = d.value, l.value && l.value.focus();
    }
    function Ie(b) {
      if (W) {
        const P = _ - b.clientX, J = N - b.clientY;
        (Math.abs(P) > 4 || Math.abs(J) > 4) && (te = !0), C($ + P), v(fe + J);
      }
    }
    function ne() {
      W && (W = !1, te && (te = !1));
    }
    function I(b) {
      if (b.touches.length !== 1) return;
      const P = b.touches[0];
      W = !0, te = !1, _ = P.clientX, N = P.clientY, $ = y.value, fe = d.value, l.value && l.value.focus();
    }
    function O(b) {
      if (!W || b.touches.length !== 1) return;
      b.preventDefault();
      const P = b.touches[0], J = _ - P.clientX, Q = N - P.clientY;
      (Math.abs(J) > 4 || Math.abs(Q) > 4) && (te = !0), C($ + J), v(fe + Q);
    }
    function ie() {
      W && (W = !1, te && (te = !1));
    }
    function Me(b) {
      const [, P] = g(b);
      return P < 0 ? -1 : En(P, d.value, i.value.length);
    }
    function Ce(b) {
      if (te) {
        te = !1;
        return;
      }
      const P = Me(b);
      if (P < 0) {
        m.value = -1, p.value = -1;
        return;
      }
      b.shiftKey && m.value >= 0 || (m.value = P), p.value = P;
    }
    function Pe(b, P) {
      const J = i.value.length;
      if (J === 0) return;
      const Q = p.value < 0 ? 0 : p.value;
      let Ve = Math.max(0, Math.min(J - 1, Q + b));
      p.value = Ve, (!P || m.value < 0) && (m.value = Ve), c.value = Ve;
      const ce = at + Ve * Se, ke = ce + Se;
      ce < d.value ? v(ce) : ke > d.value + h.value && v(ke - h.value);
    }
    function it() {
      const b = Math.min(m.value, p.value), P = Math.max(m.value, p.value);
      if (b < 0) return "";
      const J = i.value, Q = /* @__PURE__ */ new Set(), Ve = [];
      for (let ce = b; ce <= P && ce < J.length; ce++) {
        const ke = J[ce];
        if (Q.has(ke.entryIdx)) continue;
        Q.add(ke.entryIdx);
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
        b.preventDefault(), m.value = 0, p.value = i.value.length - 1;
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
          b.preventDefault(), C(y.value + Se * 2);
          break;
        case "ArrowLeft":
          b.preventDefault(), C(y.value - Se * 2);
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
          b.preventDefault(), v(F.value);
          break;
        case "Escape":
          m.value = -1, p.value = -1;
          break;
      }
    }
    function Re(b) {
      if (e.magnify && a.value) {
        const J = Xt(b, a.value);
        r.x = J.x, r.y = J.y, re();
      }
      const [, P] = g(b);
      if (P < 0) {
        c.value = -1;
        return;
      }
      c.value = En(P, d.value, i.value.length);
    }
    function Ee() {
      c.value = -1, r.x = be.x, r.y = be.y, re();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, d.value = F.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(b) {
        v(at + b * Se);
      }
    });
    let De = null, Fe = null, Ue = 0;
    const ct = Ht("cathodeResetTick", Y(0));
    K(ct, () => Le());
    function Le() {
      cancelAnimationFrame(Ue), Ue = requestAnimationFrame(se);
    }
    function It(b) {
      b.preventDefault();
    }
    function pt() {
      L == null || L.dispose(), L = null, G = !1, ue();
    }
    Ne(() => {
      document.addEventListener("mousemove", Ie), document.addEventListener("mouseup", ne), _e(() => {
        var b;
        ue(), a.value && (a.value.addEventListener("webglcontextlost", It), a.value.addEventListener("webglcontextrestored", pt)), l.value && (De = new ResizeObserver(() => se()), De.observe(l.value), Fe = new IntersectionObserver((P) => {
          P.some((J) => J.isIntersecting) && Le();
        }), Fe.observe(l.value)), window.addEventListener("resize", Le), (b = window.visualViewport) == null || b.addEventListener("resize", Le), d.value = F.value;
      });
    }), et(() => {
      var b, P, J;
      document.removeEventListener("mousemove", Ie), document.removeEventListener("mouseup", ne), (b = a.value) == null || b.removeEventListener("webglcontextlost", It), (P = a.value) == null || P.removeEventListener("webglcontextrestored", pt), De == null || De.disconnect(), Fe == null || Fe.disconnect(), window.removeEventListener("resize", Le), (J = window.visualViewport) == null || J.removeEventListener("resize", Le), cancelAnimationFrame(Ue), j();
    });
    const Lt = ae(() => Wt[e.theme] ?? Wt.none), Ut = ae(() => ({
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
      he("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: ot(R, ["prevent"]),
        onMousemove: Re,
        onMouseleave: Ee,
        onMousedown: ge,
        onClick: Ce,
        onTouchstartPassive: I,
        onTouchmove: O,
        onTouchend: ie,
        onTouchcancel: ie
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
    function p(M) {
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
    function D() {
      S || (S = setInterval(() => {
        k.value = !k.value;
      }, 530));
    }
    function i() {
      S && (clearInterval(S), S = null), k.value = !0;
    }
    const w = ae(() => {
      let M;
      return l.disabled ? M = " " : l.busy ? M = "█" : M = k.value ? "█" : " ", { level: "info", text: `${l.prompt}${h.value}${M}` };
    }), T = ae(
      () => [...l.entries, w.value]
    );
    function F() {
      var M;
      l.disabled || (M = s.value) == null || M.focus();
    }
    K(() => l.busy, (M, y) => {
      y && !M && !l.disabled && _e(() => {
        var L;
        return (L = s.value) == null ? void 0 : L.focus();
      });
    });
    function U() {
      var M;
      (M = s.value) == null || M.focus();
    }
    return n({ focus: U }), Ne(() => {
      D(), l.disabled || requestAnimationFrame(() => {
        var M;
        return (M = s.value) == null ? void 0 : M.focus();
      });
    }), et(() => {
      i();
    }), (M, y) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: F
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
      _n(he("input", {
        ref_key: "inputEl",
        ref: s,
        "onUpdate:modelValue": y[0] || (y[0] = (L) => h.value = L),
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
  var k, S, D, i, w;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = gt[n.theme] ?? gt.none, s = n.colors ? { ...r, ...n.colors } : r, h = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = s.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const d = Nl(n.candles.length, l, n.slotW, n.scrollX, h), c = Xl(n.candles, d.firstIdx, d.count), u = Ul(a, n.showVolume ? n.volumeFraction : 0, h), m = Math.max($l, Math.floor(n.slotW * 0.7)), p = Math.min(n.candles.length, d.firstIdx + d.count);
  for (let T = d.firstIdx; T < p; T++) {
    const F = n.candles[T];
    if (!F) continue;
    const U = Je(T, d.firstIdx, n.slotW), M = We(F.open, c, u.priceY0, u.priceY1), y = We(F.close, c, u.priceY0, u.priceY1), L = We(F.high, c, u.priceY0, u.priceY1), G = We(F.low, c, u.priceY0, u.priceY1), j = F.close >= F.open, le = j ? s.wickBull : s.wickBear, q = j ? s.candleBull : s.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = le, e.lineWidth = Ol, e.beginPath(), e.moveTo(Math.round(U) + 0.5, L), e.lineTo(Math.round(U) + 0.5, G), e.stroke(), e.fillStyle = q;
    const ee = Math.min(M, y), Z = Math.max(1, Math.abs(y - M)), V = Math.round(U - m / 2), X = Math.round(ee), ue = Math.round(Z);
    if (e.fillRect(V, X, m, ue), n.glow && (e.shadowBlur = 4, e.fillRect(V, X, m, ue)), e.shadowBlur = 0, n.showVolume && c.maxVol > 0) {
      const se = Math.round(F.volume / c.maxVol * (u.volumeY1 - u.volumeY0));
      se > 0 && (e.fillStyle = j ? s.volumeBull : s.volumeBear, e.fillRect(
        Math.round(U - m / 2),
        u.volumeY1 - se,
        m,
        se
      ));
    }
  }
  if ((k = n.overlays) != null && k.length) {
    const T = { above: 0, below: 0 }, F = n.overlays.filter((M) => M.kind !== "hline" && !!M.label).length, U = F ? 14 + 14 * F + 12 : 8;
    for (const M of n.overlays)
      M.kind === "hline" ? jl(e, M, l, c, u, s, h, T, U) : Kl(e, M, d, c, u, n.slotW);
  }
  (S = n.markers) != null && S.length && lo(e, s, n.markers, n.candles, d, c, u, n.slotW), oo(e, s, c, u, l, h), h || (ao(e, s, n.candles, d, n.slotW, a), to(e, s, n.candles, l, a)), (D = n.overlays) != null && D.length && Zl(e, s, n.overlays, u), n.hover && (ro(e, s, n.candles, d, c, u, n.slotW, n.hover, l), Jl(e, s, n.candles, d, n.slotW, n.hover, u, ((i = n.overlays) == null ? void 0 : i.length) ?? 0), (w = n.markers) != null && w.length && eo(e, s, n.markers, n.candles, d, c, u, n.slotW, n.hover, l)), e.restore();
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
  const c = We(n.price, l, a.priceY0, a.priceY1), u = c < a.priceY0 - 0.5, m = c > a.priceY1 + 0.5, p = u || m, k = p ? u ? h.above++ : h.below++ : 0, S = p ? u ? a.priceY0 + d + k * 20 : a.priceY1 - 8 - k * 20 : c, D = s ? vn : qe, i = Math.round(S) + 0.5;
  t.save(), p || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, i), t.lineTo(e - D, i), t.stroke(), t.setLineDash([]));
  let w = n.label ?? je(n.price);
  if (p && w !== "" && (w = (u ? "↑ " : "↓ ") + w), w !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const T = t.measureText(w).width, F = 4, U = 2, M = Ye + 2;
    t.fillStyle = n.color, p && (t.globalAlpha = 0.85), t.fillRect(M, S - 7 - U, T + F * 2, 14 + U * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(w, M + F, S);
  }
  t.restore();
}
function Ft(t, n, e, l, a, r, s, h, d, c) {
  if (!n || !n.length) return;
  t.strokeStyle = h, t.lineWidth = d, t.setLineDash(c ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let m = e; m < l; m++) {
    const p = n[m];
    if (typeof p != "number" || !isFinite(p)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const k = Je(m, e, a), S = We(p, r, s.priceY0, s.priceY1);
    u ? t.lineTo(k, S) : (t.moveTo(k, S), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function ql(t, n, e, l, a, r, s, h, d) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = d;
  let c = !1, u = -1;
  for (let m = l; m <= a; m++) {
    const p = n[m], k = e[m], S = m < a && typeof p == "number" && typeof k == "number" && isFinite(p) && isFinite(k);
    if (S && !c && (u = m, c = !0), !S && c || m === a && c) {
      const D = S ? m + 1 : m;
      t.beginPath();
      for (let i = u; i < D; i++) {
        const w = Je(i, l, r), T = We(n[i], s, h.priceY0, h.priceY1);
        i === u ? t.moveTo(w, T) : t.lineTo(w, T);
      }
      for (let i = D - 1; i >= u; i--) {
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
  const a = e.filter((D) => D.kind !== "hline" && !!D.label);
  if (!a.length) return;
  t.save(), t.font = Xe;
  const r = 8, s = 5, h = 12, d = 6, c = 14;
  let u = 0;
  for (const D of a) {
    const i = t.measureText(D.label).width;
    i > u && (u = i);
  }
  const m = r * 2 + h + d + u, p = s * 2 + c * a.length, k = Ye + 4, S = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(k, S, m, p), t.textBaseline = "middle", t.textAlign = "left";
  for (let D = 0; D < a.length; D++) {
    const i = a[D], w = S + s + c * (D + 0.5), T = k + r;
    i.kind === "line" ? (t.strokeStyle = i.color, t.lineWidth = i.lineWidth ?? 1, t.setLineDash(i.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(T, w), t.lineTo(T + h, w), t.stroke(), t.setLineDash([])) : i.kind === "band" && (t.fillStyle = Vn(i.color, i.fillAlpha ?? 0.2), t.fillRect(T, w - 4, h, 8), t.strokeStyle = i.color, t.lineWidth = 1, t.strokeRect(T + 0.5, w - 4 + 0.5, h - 1, 7)), t.fillStyle = n.text, t.fillText(i.label, T + h + d, w);
  }
  t.restore();
}
function Jl(t, n, e, l, a, r, s, h) {
  const d = Math.floor((r.x - Ye) / a), c = l.firstIdx + d;
  if (c < 0 || c >= e.length) return;
  const u = e[c];
  if (!u) return;
  const m = u.close - u.open, p = u.open !== 0 ? m / u.open * 100 : 0, k = m >= 0 ? "+" : "", S = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", Ql(u.volume), void 0],
    ["", `${k}${p.toFixed(2)}%`, m >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const D = 8, i = 4, w = 14;
  let T = D;
  for (const [y, L] of S) {
    const G = y ? `${y} ${L}` : L, j = t.measureText(G).width + 12;
    T += j;
  }
  T += D - 12;
  const F = s.priceY0 + 4 + (h > 0 ? i * 2 + 14 * h + 4 : 0), U = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(U, F, T, w + i * 2);
  let M = U + D;
  for (let y = 0; y < S.length; y++) {
    const [L, G, j] = S[y];
    t.fillStyle = n.text, L && (t.globalAlpha = 0.6, t.fillText(L + " ", M, F + i + w / 2), t.globalAlpha = 1, M += t.measureText(L + " ").width), j && (t.fillStyle = j), t.fillText(G, M, F + i + w / 2), M += t.measureText(G).width + 12;
  }
  t.restore();
}
function Ql(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function eo(t, n, e, l, a, r, s, h, d, c) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, m = Math.max(1, u * 0.5), p = Math.min(l.length, a.firstIdx + a.count), k = 9;
  let S = null;
  for (const G of e) {
    let j = 0, le = l.length - 1, q = -1;
    for (; j <= le; ) {
      const V = j + le >> 1, X = l[V].start - G.timestamp;
      if (Math.abs(X) <= m) {
        q = V;
        break;
      }
      X < 0 ? j = V + 1 : le = V - 1;
    }
    if (q < 0 || q < a.firstIdx || q >= p) continue;
    const ee = Je(q, a.firstIdx, h), Z = We(G.price, r, s.priceY0, s.priceY1);
    if (Math.abs(d.x - ee) <= k && Math.abs(d.y - Z) <= k) {
      S = { m: G, x: ee, y: Z };
      break;
    }
  }
  if (!S) return;
  const D = hn(S.m.timestamp), i = [
    `${S.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${D}`,
    `@ ${je(S.m.price)}`
  ];
  S.m.label && i.push(S.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const w = 6, T = 14;
  let F = 0;
  for (const G of i) {
    const j = t.measureText(G).width;
    j > F && (F = j);
  }
  const U = F + w * 2, M = i.length * T + w * 2;
  let y = S.x + 12;
  y + U > c - qe && (y = S.x - 12 - U);
  let L = S.y - M / 2;
  L < s.priceY0 && (L = s.priceY0), L + M > s.priceY1 && (L = s.priceY1 - M), t.fillStyle = n.panelBgSolid, t.strokeStyle = S.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(y, L, U, M), t.strokeRect(y + 0.5, L + 0.5, U - 1, M - 1);
  for (let G = 0; G < i.length; G++) {
    const j = i[G];
    t.fillStyle = G === 0 ? S.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(j, y + w, L + w + G * T);
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
    let S = 0, D = l.length - 1;
    for (; S <= D; ) {
      const i = S + D >> 1, w = l[i].start - k;
      if (Math.abs(w) <= c) return i;
      w < 0 ? S = i + 1 : D = i - 1;
    }
    return -1;
  }, p = 7;
  for (const k of e) {
    const S = m(k.timestamp);
    if (S < 0 || S < a.firstIdx || S >= u) continue;
    const D = Je(S, a.firstIdx, h), i = We(k.price, r, s.priceY0, s.priceY1);
    if (i < s.priceY0 || i > s.priceY1) continue;
    const w = k.color ?? (k.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = w, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), k.kind === "entry" ? (t.moveTo(D, i - p), t.lineTo(D - p, i + p - 1), t.lineTo(D + p, i + p - 1)) : (t.moveTo(D, i + p), t.lineTo(D - p, i - p + 1), t.lineTo(D + p, i - p + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function oo(t, n, e, l, a, r = !1) {
  const s = e.max - e.min;
  if (s <= 0) return;
  const h = l.priceY1 - l.priceY0, d = r ? Math.max(2, Math.min(4, Math.round(h / 36))) : 6, c = Gl(s, d), u = Math.ceil(e.min / c) * c, m = r ? vn : qe;
  t.font = r ? Vl : Xe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let p = u; p <= e.max; p += c) {
    const k = We(p, e, l.priceY0, l.priceY1);
    k < l.priceY0 || k > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(k) + 0.5), t.lineTo(a - m, Math.round(k) + 0.5), t.stroke(), t.fillText(je(p), a - m + 3, k));
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
  const p = Je(u, l.firstIdx, s);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(p) + 0.5, r.priceY0), t.lineTo(Math.round(p) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const k = Math.max(r.priceY0, Math.min(r.priceY1, h.y));
  t.beginPath(), t.moveTo(Ye, Math.round(k) + 0.5), t.lineTo(d - qe, Math.round(k) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const S = a.max - a.min;
  if (S > 0) {
    const w = a.max - (k - r.priceY0) / (r.priceY1 - r.priceY0) * S, T = je(w);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const F = t.measureText(T).width, U = 4, M = 2;
    t.fillStyle = n.accent, t.fillRect(d - qe + 2, k - 7 - M, F + U * 2, 14 + M * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(T, d - qe + 2 + U, k);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const D = hn(m.start), i = t.measureText(D).width;
  t.fillStyle = n.accent, t.fillRect(p - i / 2 - 4, r.volumeY1 + 2, i + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(D, p, r.volumeY1 + 4), t.restore();
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
    const n = t, e = Y(null), l = Y(null), a = { ...be }, r = Y(0), s = Y(0), h = Y(0), d = Y(1), c = Y(null), u = ae(() => Math.max(1, n.slotW * d.value));
    let m = null, p = !1;
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
    let S, D, i, w, T;
    const F = `
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
    function U() {
      if (!(!l.value || !e.value)) {
        if (T = document.createElement("canvas"), n.flat) {
          p = !0, M();
          return;
        }
        try {
          m = new z.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          p = !0;
        }
        if (!p && !m.getContext() && (m.dispose(), m = null, p = !0), p) {
          M();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), S = new z.Scene(), D = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), w = new z.CanvasTexture(T), w.minFilter = z.LinearFilter, w.magFilter = z.LinearFilter, i = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: w },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: io,
          fragmentShader: F,
          transparent: !0
        }), S.add(new z.Mesh(new z.PlaneGeometry(2, 2), i)), M();
      }
    }
    function M() {
      if (!e.value || !m && !p) return;
      const I = e.value.clientWidth, O = e.value.clientHeight;
      !I || !O || !(T.width !== I || T.height !== O) || (T.width = I, T.height = O, r.value = I, s.value = O, m ? (w && (w.dispose(), w = new z.CanvasTexture(T), w.minFilter = z.LinearFilter, w.magFilter = z.LinearFilter, i && (i.uniforms.uTex.value = w)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(I, O)) : l.value && (l.value.width = I, l.value.height = O, l.value.style.width = I + "px", l.value.style.height = O + "px"), y());
    }
    function y() {
      if (!(T != null && T.width)) return;
      if (p) {
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
        const O = l.value.getContext("2d");
        O && (O.clearRect(0, 0, l.value.width, l.value.height), O.drawImage(T, 0, 0));
        return;
      }
      if (!m || !i || !w) return;
      const I = n.theme === "paper";
      i.uniforms.uStrength.value = Ze(n.curvature), i.uniforms.uScanlines.value = n.scanlines && !I ? 1 : 0, i.uniforms.uVignette.value = I ? 0 : 1, Nt(i, n.magnify, a, T.width, T.height), rn(T, {
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
      }), w.needsUpdate = !0, m.render(S, D);
    }
    K(() => n.theme, () => y()), K(() => n.curvature, () => y()), K(() => n.scanlines, () => y()), K(() => n.glow, () => y()), K(() => n.showVolume, () => y()), K(() => n.volumeFraction, () => y()), K(() => n.slotW, () => y()), K(() => n.candles, () => y(), { deep: !1 }), K(() => n.overlays, () => y(), { deep: !1 }), K(() => n.markers, () => y(), { deep: !1 }), K(() => n.compact, () => y()), K(() => n.magnify, (I) => {
      I || (a.x = be.x, a.y = be.y), y();
    }), K(() => n.colors, () => y(), { deep: !0 }), K(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), K(h, () => y()), K(d, () => y()), K(c, () => y()), K(u, () => y());
    let L = null, G = null, j = 0;
    const le = Ht("cathodeResetTick", Y(0));
    K(le, () => q());
    function q() {
      cancelAnimationFrame(j), j = requestAnimationFrame(M);
    }
    function ee(I) {
      I.preventDefault();
    }
    function Z() {
      m == null || m.dispose(), m = null, p = !1, U();
    }
    function V(I) {
      if (!l.value) return [-1, -1];
      const O = l.value.getBoundingClientRect();
      return [I.clientX - O.left, I.clientY - O.top];
    }
    function X(I) {
      var Pe;
      const O = u.value;
      if (O <= 0) return 0;
      const ie = ((Pe = n.candles) == null ? void 0 : Pe.length) ?? 0, Me = Math.max(1, Math.floor((r.value || 1) / O)), Ce = Math.max(0, ie - Me);
      return Math.max(0, Math.min(I, Ce * O));
    }
    function ue(I) {
      var Me;
      if (I.deltaX !== 0 || I.shiftKey && I.deltaY !== 0) {
        const Ce = I.deltaX !== 0 ? I.deltaX : I.deltaY;
        h.value = X(h.value + Ce);
        return;
      }
      if (I.deltaY === 0) return;
      const [O] = V(I), ie = u.value;
      if (O >= 0 && ie > 0 && ((Me = n.candles) != null && Me.length)) {
        const Ce = Math.max(1, Math.floor((r.value || 1) / ie)), it = Math.max(0, n.candles.length - Ce - Math.floor(h.value / ie)) + (O - 8) / ie, st = Math.exp(-I.deltaY * 15e-4), nt = Math.max(nn, Math.min(ln, d.value * st));
        d.value = nt;
        const Re = n.slotW * nt, Ee = Math.max(1, Math.floor((r.value || 1) / Re)), De = it - (O - 8) / Re, Fe = Math.max(0, n.candles.length - Ee - De);
        h.value = X(Fe * Re);
      } else {
        const Ce = Math.exp(-I.deltaY * 15e-4);
        d.value = Math.max(nn, Math.min(ln, d.value * Ce));
      }
    }
    let se = !1, re = 0, g = 0;
    function v(I) {
      I.button === 0 && (se = !0, re = I.clientX, g = h.value, c.value = null, e.value && e.value.focus());
    }
    function C(I) {
      const O = Math.exp(I * 0.18);
      d.value = Math.max(nn, Math.min(ln, d.value * O)), h.value = X(h.value);
    }
    function R(I) {
      const O = u.value, ie = I.shiftKey ? 20 : 3;
      switch (I.key) {
        case "ArrowLeft":
          I.preventDefault(), h.value = X(h.value + O * ie);
          break;
        case "ArrowRight":
          I.preventDefault(), h.value = X(h.value - O * ie);
          break;
        case "ArrowUp":
          I.preventDefault(), C(1);
          break;
        case "ArrowDown":
          I.preventDefault(), C(-1);
          break;
        case "Home":
          I.preventDefault(), h.value = X(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          I.preventDefault(), h.value = 0;
          break;
      }
    }
    function W(I) {
      if (se) {
        const O = I.clientX - re;
        h.value = X(g + O);
        return;
      }
    }
    function _() {
      se = !1;
    }
    function N(I) {
      if (I.touches.length !== 1) return;
      const O = I.touches[0];
      se = !0, re = O.clientX, g = h.value, c.value = null;
    }
    function $(I) {
      if (!se || I.touches.length !== 1) return;
      I.preventDefault();
      const ie = I.touches[0].clientX - re;
      h.value = X(g + ie);
    }
    function fe() {
      se = !1;
    }
    function te(I) {
      if (n.magnify && l.value) {
        const Me = Xt(I, l.value);
        a.x = Me.x, a.y = Me.y, y();
      }
      if (se) return;
      const [O, ie] = V(I);
      if (O < 0 || ie < 0) {
        c.value = null;
        return;
      }
      c.value = { x: O, y: ie };
    }
    function ge() {
      c.value = null, a.x = be.x, a.y = be.y, y();
    }
    Ne(() => {
      document.addEventListener("mousemove", W), document.addEventListener("mouseup", _), _e(() => {
        var I;
        U(), l.value && (l.value.addEventListener("webglcontextlost", ee), l.value.addEventListener("webglcontextrestored", Z)), e.value && (L = new ResizeObserver(() => M()), L.observe(e.value), G = new IntersectionObserver((O) => {
          O.some((ie) => ie.isIntersecting) && q();
        }), G.observe(e.value)), window.addEventListener("resize", q), (I = window.visualViewport) == null || I.addEventListener("resize", q);
      });
    }), et(() => {
      var I, O, ie;
      document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", _), (I = l.value) == null || I.removeEventListener("webglcontextlost", ee), (O = l.value) == null || O.removeEventListener("webglcontextrestored", Z), L == null || L.disconnect(), G == null || G.disconnect(), window.removeEventListener("resize", q), (ie = window.visualViewport) == null || ie.removeEventListener("resize", q), cancelAnimationFrame(j), k();
    });
    const Ie = ae(() => gt[n.theme] ?? gt.none), ne = ae(() => ({
      background: Ie.value.bg
    }));
    return (I, O) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ke(ne.value),
      tabindex: "0",
      onKeydown: R
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: ot(ue, ["prevent"]),
        onMousedown: v,
        onMousemove: te,
        onMouseleave: ge,
        onTouchstartPassive: N,
        onTouchmove: $,
        onTouchend: fe,
        onTouchcancel: fe
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
    let p, k, S, D, i;
    const w = Y(0), T = Y(0), F = `
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
    function U() {
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
        c.setPixelRatio(1), c.setClearColor(0, 0), p = new z.Scene(), k = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), D = new z.CanvasTexture(i), D.minFilter = z.LinearFilter, D.magFilter = z.LinearFilter, S = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: D },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: co,
          fragmentShader: F,
          transparent: !0
        }), p.add(new z.Mesh(new z.PlaneGeometry(2, 2), S)), M();
      }
    }
    function M() {
      if (!a.value || !c && !u) return;
      const g = a.value.clientWidth, v = a.value.clientHeight;
      if (!g || !v) return;
      w.value = g, T.value = v;
      const C = e.bendField ? Math.round(g * Hn(e.curvature)) : g, R = i.width !== C || i.height !== v;
      i.width = C, i.height = v, c ? (R && D && (D.dispose(), D = new z.CanvasTexture(i), D.minFilter = z.LinearFilter, D.magFilter = z.LinearFilter, S.uniforms.uTex.value = D), c.setSize(g, v)) : r.value && (r.value.width = g, r.value.height = v, r.value.style.width = g + "px", r.value.style.height = v + "px"), q();
    }
    function y() {
      const g = (i == null ? void 0 : i.width) || 0, v = Math.max(1, Math.floor(g / e.minCellW)), C = Math.floor(g / v), R = Math.round(C * e.cellAspect), W = ht + R + Ct;
      return { rects: e.cells.map((N, $) => ({
        x: $ % v * C,
        y: Math.floor($ / v) * W - h.value,
        w: C,
        h: W
      })), rowH: W, totalH: Math.ceil(e.cells.length / v) * W, cols: v };
    }
    const L = () => {
      const { totalH: g } = y();
      return Math.max(0, g - ((i == null ? void 0 : i.height) || 0));
    }, G = /* @__PURE__ */ new Map();
    function j(g, v, C) {
      const R = g.candles[g.candles.length - 1], W = `${v}x${C}|${g.candles.length}|${R ? R.start + ":" + R.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, _ = G.get(g.id);
      if (_ && _.key === W) return _.canvas;
      const N = (_ == null ? void 0 : _.canvas) ?? document.createElement("canvas");
      N.width = v, N.height = C;
      const $ = Math.max(1.5, Math.min(e.slotW, v / Math.max(1, g.candles.length))), fe = v < 260 && g.overlays ? g.overlays.map((te) => te.label ? { ...te, label: void 0 } : te) : g.overlays;
      return rn(N, {
        candles: g.candles,
        slotW: $,
        scrollX: Math.max(0, g.candles.length * $ - v),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: fe,
        compact: !0,
        colors: e.colors
      }), G.set(g.id, { canvas: N, key: W }), N;
    }
    const le = ae(() => ({ ...gt[e.theme] ?? gt.none, ...e.colors ?? {} }));
    function q() {
      var R;
      if (!(i != null && i.width)) return;
      const g = i.getContext("2d");
      if (!g) return;
      const v = le.value;
      g.clearRect(0, 0, i.width, i.height), v.bg && v.bg !== "rgba(0,0,0,0)" && (g.fillStyle = v.bg, g.fillRect(0, 0, i.width, i.height));
      const { rects: C } = y();
      g.font = "600 11px ui-monospace, SFMono-Regular, monospace", g.textBaseline = "middle";
      for (let W = 0; W < e.cells.length; W++) {
        const _ = e.cells[W], N = C[W];
        if (N.y + N.h < 0 || N.y > i.height) continue;
        const $ = N.x + Ct / 2, fe = N.w - Ct;
        g.strokeStyle = _.open ? v.candleBull : v.gridline, g.lineWidth = W === s.value ? 2 : 1, g.strokeRect($ + 0.5, N.y + 0.5, fe - 1, N.h - Ct - 1), g.save(), g.beginPath(), g.rect($, N.y, fe, ht), g.clip();
        const te = N.y + ht / 2 + 1, ge = _.note ? g.measureText(_.note).width + (_.open ? 22 : 12) : _.open ? 16 : 0, Ie = _.badge ? g.measureText(_.badge).width + 6 : 0, ne = fe - 14 - Ie - ge;
        let I = _.title;
        if (g.measureText(I).width > ne) {
          for (; I.length > 1 && g.measureText(I + "…").width > ne; ) I = I.slice(0, -1);
          I += "…";
        }
        let O = $ + 7;
        g.fillStyle = v.text, g.textAlign = "left", g.fillText(I, O, te), O += g.measureText(I).width + 6, _.badge && (g.fillStyle = v.accent, g.fillText(_.badge, O, te)), _.note && (g.textAlign = "right", g.fillStyle = _.noteColor || v.accent, g.fillText(_.note, $ + fe - (_.open ? 16 : 7), te), g.textAlign = "left"), g.restore(), _.open && (g.fillStyle = v.candleBull, g.beginPath(), g.arc($ + fe - 9, N.y + ht / 2 + 1, 3, 0, Math.PI * 2), g.fill());
        const ie = N.y + ht, Me = N.h - ht - Ct;
        _.candles.length ? g.drawImage(j(_, fe - 2, Me - 1), $ + 1, ie) : (g.fillStyle = v.accent, g.textAlign = "center", g.fillText("· · ·", $ + fe / 2, ie + Me / 2), g.textAlign = "left");
      }
      if (u) {
        const W = (R = r.value) == null ? void 0 : R.getContext("2d");
        W && r.value && W.drawImage(i, 0, 0, i.width, i.height, 0, 0, r.value.width, r.value.height);
        return;
      }
      !c || !S || !D || (S.uniforms.uStrength.value = Ze(e.curvature), S.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, S.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Nt(S, e.magnify, d, w.value || i.width, T.value || i.height), D.needsUpdate = !0, c.render(p, k));
    }
    function ee(g) {
      if (!r.value) return [-1, -1];
      const v = r.value.getBoundingClientRect();
      return Pn(
        g.clientX - v.left,
        g.clientY - v.top,
        v.width,
        v.height,
        Ze(e.curvature),
        (i == null ? void 0 : i.width) || v.width,
        (i == null ? void 0 : i.height) || v.height
      );
    }
    function Z(g, v) {
      if (g < 0) return -1;
      const { rects: C } = y();
      return C.findIndex((R) => g >= R.x && g < R.x + R.w && v >= R.y && v < R.y + R.h);
    }
    function V(g) {
      const [v, C] = ee(g), R = Z(v, C);
      R >= 0 && l("cell-click", e.cells[R].id);
    }
    function X(g) {
      if (e.magnify && r.value) {
        const W = Xt(g, r.value);
        d.x = W.x, d.y = W.y;
      }
      const [v, C] = ee(g), R = Z(v, C);
      R !== s.value ? (s.value = R, q()) : e.magnify && q(), r.value && (r.value.style.cursor = R >= 0 ? "pointer" : "default");
    }
    function ue() {
      s.value = -1, d.x = be.x, d.y = be.y, q();
    }
    function se(g) {
      const v = L();
      v <= 0 || (g.preventDefault(), h.value = Math.max(0, Math.min(v, h.value + g.deltaY)), q());
    }
    let re = null;
    return Ne(() => {
      U(), re = new ResizeObserver(() => M()), a.value && re.observe(a.value);
    }), et(() => {
      re == null || re.disconnect(), m(), G.clear();
    }), K(() => [e.curvature, e.bendField], () => _e(M)), K(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      h.value = Math.min(h.value, L()), q();
    }, { deep: !1 }), (g, v) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: r,
        onClick: V,
        onMousemove: X,
        onMouseleave: ue,
        onWheel: se
      }, null, 544)
    ], 512));
  }
}), Vo = /* @__PURE__ */ tt(uo, [["__scopeId", "data-v-09199049"]]), mn = Y(0), sn = 28, mt = 12;
let cn = 10, Yt = "cathode.layout", Pt = !1;
const Te = Y({});
function fo(t, n = "cathode.layout") {
  if (!Pt) {
    Pt = !0, Yt = n;
    try {
      const e = localStorage.getItem(Yt);
      if (e) {
        Te.value = JSON.parse(e), Dn();
        return;
      }
    } catch {
    }
    Te.value = { ...t }, Dn();
  }
}
function Dn() {
  let t = 10;
  for (const n of Object.values(Te.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  cn = t;
}
function rt() {
  localStorage.setItem(Yt, JSON.stringify(Te.value));
}
function vo(t) {
  Pt = !1, localStorage.removeItem(Yt), Te.value = { ...t }, rt(), Pt = !0, mn.value++;
}
function $n(t) {
  cn++, Te.value[t] && (Te.value[t].zIndex = cn);
}
function ho(t, n) {
  Te.value[t].visible = n, rt();
}
function mo(t, n) {
  Te.value[t].minimized = n, n && (Te.value[t].maximized = !1), rt();
}
function go(t, n) {
  Te.value[t].maximized = n, n && (Te.value[t].minimized = !1, $n(t)), rt();
}
function po(t, n, e) {
  Te.value[t].x = Math.round(n), Te.value[t].y = Math.round(e), rt();
}
function wo(t, n, e) {
  Te.value[t].w = Math.round(n), Te.value[t].h = Math.round(e), rt();
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
    containers: Te,
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
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = On(), s = Y(null);
    Cn("cathodeWorkspace", s), Cn("cathodeResetTick", mn), Ne(() => {
      if (!s.value) return;
      const { clientWidth: i, clientHeight: w } = s.value, T = n.initialLayout ?? {};
      l(T, n.storageKey ?? "cathode.layout");
      const F = Object.keys(e.value)[0];
      F && h(F);
    });
    function h(i) {
      var T;
      document.querySelectorAll(".cc").forEach((F) => F.classList.remove("cc-focused"));
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
    function p(i) {
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
    function D(i) {
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
      he("div", yo, [
        t.initialLayout ? (ye(), xe("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: d
        }, " ↺ Reset Layout ")) : Oe("", !0),
        w[1] || (w[1] = he("div", { class: "ws-sep" }, null, -1)),
        he("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: w[0] || (w[0] = (T) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      An(ol, { name: "menu" }, {
        default: al(() => [
          u.value ? (ye(), xe("div", xo, [
            w[3] || (w[3] = he("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? Oe("", !0) : (ye(), xe("div", bo, " No closed panels ")),
            (ye(!0), xe(rl, null, il(m(), (T) => (ye(), xe("div", {
              key: T,
              class: "ws-restore-item",
              onClick: (F) => p(T)
            }, [
              w[2] || (w[2] = he("span", { class: "ws-restore-icon" }, "⊞", -1)),
              sl(" " + ze(D(T)), 1)
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
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: s, updatePos: h, updateSize: d } = On(), c = Ht("cathodeWorkspace", Y(null)), u = ae(() => e.value[n.id]), m = ae(() => {
      const v = u.value, C = n.curvature ?? 0;
      if (!v) return {};
      const R = { "--curvature": Math.abs(C) };
      return v.maximized ? { ...R, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: v.zIndex } : {
        ...R,
        left: v.x + "px",
        top: v.y + "px",
        width: v.w + "px",
        height: v.minimized ? sn + "px" : v.h + "px",
        zIndex: v.zIndex,
        display: v.visible ? "flex" : "none"
      };
    });
    let p = !1, k = 0, S = 0;
    function D(v) {
      var W;
      if (v.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), p = !0;
      const C = (W = c.value) == null ? void 0 : W.querySelector(`#cc-${n.id}`);
      if (!C) return;
      const R = C.getBoundingClientRect();
      k = v.clientX - R.left, S = v.clientY - R.top, document.addEventListener("mousemove", i), document.addEventListener("mouseup", w), v.preventDefault();
    }
    function i(v) {
      var N;
      if (!p || !c.value) return;
      const C = c.value.getBoundingClientRect(), R = ((N = u.value) == null ? void 0 : N.w) ?? 300;
      let W = v.clientX - C.left - k, _ = v.clientY - C.top - S;
      W = Math.max(Fn - R, Math.min(C.width - Fn, W)), _ = Math.max(0, Math.min(C.height - sn, _)), h(n.id, W, _);
    }
    function w() {
      p = !1, document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", w);
    }
    let T = !1, F = 0, U = 0, M = 0, y = 0;
    const L = Y("");
    function G(v) {
      u.value.maximized || (l(n.id), T = !0, F = v.clientX, U = v.clientY, M = u.value.w, y = u.value.h, document.addEventListener("mousemove", j), document.addEventListener("mouseup", le), v.preventDefault(), v.stopPropagation());
    }
    function j(v) {
      if (!T) return;
      const C = Math.max(Eo, M + (v.clientX - F)), R = Math.max(Do, y + (v.clientY - U));
      d(n.id, C, R), L.value = `${Math.round(C)}×${Math.round(R)}`;
    }
    function le() {
      T = !1, L.value = "", document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", le), q.value++;
    }
    const q = Y(0);
    K(mn, () => {
      q.value++;
    }), et(() => {
      var v;
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", w), document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", le), (v = ee.value) == null || v.removeEventListener("scroll", V), X();
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
      const R = Z(v);
      if (!R.length) return;
      const W = v.clientHeight, _ = W / 2, N = C * 38e-4;
      R.forEach(($) => {
        if (!$.dataset.origFs) {
          const Me = getComputedStyle($);
          $.dataset.origFs = Me.fontSize, $.dataset.origLh = Me.lineHeight;
        }
        if (C === 0) {
          $.style.fontSize = "", $.style.lineHeight = "";
          return;
        }
        const fe = $.getBoundingClientRect(), te = v.getBoundingClientRect(), ge = fe.top - te.top + fe.height / 2, Ie = Math.min(1, Math.abs(ge - _) / (W / 2)), ne = 1 + N * Math.cos(Ie * Math.PI / 2), I = parseFloat($.dataset.origFs), O = $.dataset.origLh, ie = O === "normal" ? I * 1.4 : parseFloat(O);
        isNaN(I) || ($.style.fontSize = `${(I * ne).toFixed(2)}px`), isNaN(ie) || ($.style.lineHeight = `${(ie * ne).toFixed(2)}px`);
      });
    }
    function X() {
      const v = ee.value;
      v && Z(v).forEach((C) => {
        C.style.fontSize = "", C.style.lineHeight = "", delete C.dataset.origFs, delete C.dataset.origLh;
      });
    }
    K(() => n.curvature, (v) => {
      (v ?? 0) === 0 ? X() : V();
    }), Ne(() => {
      var v;
      (v = ee.value) == null || v.addEventListener("scroll", V, { passive: !0 }), _e(V);
    });
    function ue() {
      r(n.id, !u.value.minimized), _e(() => {
        q.value++;
      });
    }
    function se() {
      s(n.id, !u.value.maximized), _e(() => {
        q.value++;
      });
    }
    function re() {
      a(n.id, !1);
    }
    function g() {
      l(n.id);
    }
    return (v, C) => u.value && u.value.visible ? (ye(), xe("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: cl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ke(m.value),
      onMousedown: g
    }, [
      he("div", {
        class: "cc-titlebar",
        onMousedown: D
      }, [
        C[0] || (C[0] = he("span", { class: "cc-status-dot" }, null, -1)),
        he("span", Co, ze(t.title), 1),
        L.value ? (ye(), xe("span", ko, ze(L.value), 1)) : Oe("", !0),
        he("div", Io, [
          he("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ot(ue, ["stop"])
          }, "─"),
          he("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: ot(se, ["stop"])
          }, ze(u.value.maximized ? "⤡" : "⤢"), 9, Lo),
          he("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ot(re, ["stop"])
          }, "✕")
        ])
      ], 32),
      _n(he("div", Ro, [
        he("div", {
          ref_key: "bodyEl",
          ref: ee,
          class: "cc-screen",
          onScroll: V
        }, [
          on(v.$slots, "default", { resizeKey: q.value }, void 0, !0),
          C[1] || (C[1] = he("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ul, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (ye(), xe("div", {
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
    let d, c, u, m, p, k = null, S = 0;
    function D(y) {
      y - S >= Bo && (T(), S = y), k = requestAnimationFrame(D);
    }
    function i() {
      if (!l.value || !p) return;
      const y = l.value.clientWidth, L = l.value.clientHeight;
      y <= 0 || L <= 0 || p.width === y && p.height === L || (p.width = y, p.height = L, r && r.setSize(y, L, !1), a.value && (a.value.width = y, a.value.height = L, a.value.style.width = y + "px", a.value.style.height = L + "px"));
    }
    function w() {
      if (!(p != null && p.width)) return;
      const y = p.getContext("2d");
      if (!y) return;
      const L = p.width, G = p.height, j = e[n.theme] ?? e.none;
      y.clearRect(0, 0, L, G), y.fillStyle = j.bg, y.fillRect(0, 0, L, G);
      const le = Date.now(), q = (le / 500 | 0) % 2 === 0, ee = (le / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(L, G) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = j.text, n.glow && (y.shadowColor = j.text, y.shadowBlur = 14);
      const Z = ".".repeat(ee).padEnd(3, " "), V = `${n.label}${Z}`;
      if (y.fillText(V, L / 2, G / 2), y.shadowBlur = 0, q) {
        const X = y.measureText(V), ue = y.measureText("M").width, se = parseFloat(y.font), re = L / 2 + X.width / 2 + 4, g = G / 2 - se / 2 + 2;
        y.fillStyle = j.cursor, n.glow && (y.shadowColor = j.cursor, y.shadowBlur = 12), y.fillRect(re, g, ue * 0.7, se * 0.95), y.shadowBlur = 0;
      }
    }
    function T() {
      if (!p) return;
      if (w(), s) {
        if (!a.value) return;
        const L = a.value.getContext("2d");
        L && L.drawImage(p, 0, 0);
        return;
      }
      if (!r || !u || !m) return;
      const y = n.theme === "paper";
      u.uniforms.uStrength.value = Ze(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, m.needsUpdate = !0, r.render(d, c);
    }
    function F() {
      if (!(!a.value || !l.value)) {
        p = document.createElement("canvas");
        try {
          r = new z.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          s = !0;
        }
        if (!s && !r.getContext() && (r.dispose(), r = null, s = !0), s) {
          i();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), d = new z.Scene(), c = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new z.CanvasTexture(p), m.minFilter = z.LinearFilter, m.magFilter = z.LinearFilter, u = new z.ShaderMaterial({
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
    let U = null;
    Ne(() => {
      F(), T(), k = requestAnimationFrame(D), l.value && (U = new ResizeObserver(() => i()), U.observe(l.value));
    }), et(() => {
      k !== null && cancelAnimationFrame(k), U == null || U.disconnect(), h(), m == null || m.dispose(), u == null || u.dispose();
    }), K(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => T());
    const M = ae(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (y, L) => (ye(), xe("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ke(M.value)
    }, [
      he("canvas", {
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
