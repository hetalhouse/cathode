import { defineComponent as lt, ref as P, reactive as Ot, watch as N, nextTick as _e, computed as ee, inject as Bt, onMounted as Ze, onUnmounted as ot, openBlock as we, createElementBlock as ye, normalizeStyle as Ge, createElementVNode as ce, withModifiers as tt, withKeys as yn, createCommentVNode as $e, toDisplayString as Oe, createVNode as Rn, withDirectives as En, vModelText as Zn, provide as bn, renderSlot as jt, Transition as Jn, withCtx as Qn, Fragment as el, renderList as tl, createTextVNode as nl, normalizeClass as ll, vShow as ol } from "vue";
import * as V from "three";
const Ke = {
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
}, ge = 30, qt = 12, al = 10, Lt = 14, Dn = 5;
function Rt() {
  return `${qt}px system-ui, -apple-system, sans-serif`;
}
function An(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const r = [];
  let i = "";
  for (const d of a) {
    const c = i ? i + " " + d : d;
    !i || t.measureText(c).width <= e ? i = c : (r.push(i), i = d);
  }
  return i && r.push(i), r.length ? r : [""];
}
function rl(t, n) {
  return Math.max(n, t * Lt + Dn * 2);
}
function Qt(t, n) {
  const e = new Array(n + 1);
  e[0] = 0;
  for (let l = 0; l < n; l++) e[l + 1] = e[l] + (t[l] ?? 0);
  return e;
}
function Et(t, n) {
  if (n <= 0) return 0;
  let e = 0, l = t.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    t[a] <= n ? e = a : l = a - 1;
  }
  return e;
}
const Fn = 28;
function il(t, n) {
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
function xn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ke[n.theme] ?? Ke.none, { cols: i, rows: d, pinnedRows: c, rowHeight: f, scrollY: u, scrollX: h, glow: m } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const C = c.length * f, p = n.aggregateRow ? Fn : 0, S = a - ge - C - p;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, ge), e.textBaseline = "middle", e.textAlign = "left";
  let v = -h;
  for (let W = 0; W < i.length; W++) {
    const x = i[W];
    if (v + x.width <= 0) {
      v += x.width;
      continue;
    }
    if (v >= l) break;
    const E = !!n.colFilters[x.colId], _ = n.sortColId === x.colId, U = (x.colDef.headerName ?? x.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, x.width, ge), e.clip(), e.font = `bold ${al}px system-ui, -apple-system, sans-serif`, e.fillStyle = E ? r.accent : r.textHeader, m ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(U, v + 8, ge / 2), e.shadowBlur = 4, e.fillText(U, v + 8, ge / 2), e.shadowBlur = 0) : e.fillText(U, v + 8, ge / 2), _) {
      const K = e.measureText(U).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", v + 8 + K + 4, ge / 2);
    }
    x.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = E ? r.accent : r.textHeader, e.globalAlpha = E ? 1 : 0.38, e.fillText("⌕", v + x.width - 20, ge / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + x.width - 0.5, 0), e.lineTo(v + x.width - 0.5, ge), e.stroke(), v += x.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ge - 0.5), e.lineTo(l, ge - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ge, l, S), e.clip();
  const g = n.rowHeights && n.rowHeights.length === d.length ? n.rowHeights : null, M = g ? Qt(g, d.length) : null, D = (W) => M ? M[W] : W * f, $ = (W) => g ? g[W] : f, R = M ? Et(M, u) : Math.max(0, Math.floor(u / f));
  let b;
  if (M)
    for (b = R; b < d.length && D(b) < u + S; ) b++;
  else
    b = Math.min(d.length, Math.ceil((u + S) / f));
  const L = n.selectionAnchorRow ?? n.selectedRow, Y = n.selectionAnchorCol ?? n.selectedCol, G = n.selectedRow >= 0 && L >= 0 ? Math.min(n.selectedRow, L) : -1, ie = n.selectedRow >= 0 && L >= 0 ? Math.max(n.selectedRow, L) : -1, q = n.selectedCol >= 0 && Y >= 0 ? Math.min(n.selectedCol, Y) : -1, j = n.selectedCol >= 0 && Y >= 0 ? Math.max(n.selectedCol, Y) : -1, z = ie > G || j > q;
  let H = Number.POSITIVE_INFINITY, ae = Number.NEGATIVE_INFINITY, me = Number.POSITIVE_INFINITY, re = Number.NEGATIVE_INFINITY;
  const le = (W, x, E, _) => {
    m ? (e.shadowColor = _, e.shadowBlur = 12, e.fillText(W, x, E), e.shadowBlur = 6, e.fillText(W, x, E), e.shadowBlur = 2, e.fillText(W, x, E), e.shadowBlur = 0) : e.fillText(W, x, E);
  };
  for (let W = R; W < b; W++) {
    const x = d[W], E = $(W), _ = ge + D(W) - u;
    W % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, _, l, E));
    const U = W >= G && W <= ie;
    W === n.hoveredRow && !U && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, _, l, E)), U && !z && (e.fillStyle = Nt(r.accent, 0.1), e.fillRect(0, _, l, E)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, _ + E - 0.5), e.lineTo(l, _ + E - 0.5), e.stroke();
    let K = -h;
    for (let te = 0; te < i.length; te++) {
      const X = i[te];
      if (K + X.width <= 0) {
        K += X.width;
        continue;
      }
      if (K >= l) break;
      const ue = U && te >= q && te <= j;
      ue && z && (e.fillStyle = Nt(r.accent, 0.14), e.fillRect(K, _, X.width, E)), ue && (K < H && (H = K), K + X.width > ae && (ae = K + X.width), _ < me && (me = _), _ + E > re && (re = _ + E));
      const fe = n.getCellStyle(X, x), Z = fe.color ?? r.text, Ce = fe.textAlign ?? "left", Ie = n.formatCell(X, x);
      if (e.save(), e.beginPath(), e.rect(K + 1, _, X.width - 2, E), e.clip(), e.font = Rt(), e.fillStyle = Z, e.textBaseline = "middle", X.colDef.wrap) {
        e.textAlign = "left";
        const A = An(e, Ie, Math.max(20, X.width - 16));
        let O = _ + Dn + Lt / 2;
        for (const J of A) {
          if (O - Lt / 2 >= _ + E) break;
          le(J, K + 8, O, Z), O += Lt;
        }
      } else {
        const A = Ce === "right" ? K + X.width - 8 : K + 8;
        e.textAlign = Ce === "right" ? "right" : "left", le(Ie, A, _ + E / 2, Z);
      }
      e.restore(), W === n.selectedRow && te === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(K + 1.5, _ + 1.5, X.width - 3, E - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(K + X.width - 0.5, _), e.lineTo(K + X.width - 0.5, _ + E), e.stroke(), K += X.width;
    }
  }
  if (z && H < ae && me < re && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(H + 0.5, me + 0.5, ae - H - 1, re - me - 1)), e.restore(), c.length > 0) {
    const W = a - C - p;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, W - 0.5), e.lineTo(l, W - 0.5), e.stroke();
    for (let x = 0; x < c.length; x++) {
      const E = c[x], _ = W + x * f;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, _, l, f);
      let U = -h;
      for (let K = 0; K < i.length; K++) {
        const te = i[K];
        if (U + te.width <= 0) {
          U += te.width;
          continue;
        }
        if (U >= l) break;
        const X = n.getCellStyle(te, E), ue = X.color ?? r.text, fe = X.textAlign ?? "left", Z = n.formatCell(te, E);
        e.save(), e.beginPath(), e.rect(U + 1, _, te.width - 2, f), e.clip(), e.font = `bold ${qt}px system-ui, -apple-system, sans-serif`, e.fillStyle = ue, e.textBaseline = "middle", fe === "right" ? (e.textAlign = "right", e.fillText(Z, U + te.width - 8, _ + f / 2)) : (e.textAlign = "left", e.fillText(Z, U + 8, _ + f / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(U + te.width - 0.5, _), e.lineTo(U + te.width - 0.5, _ + f), e.stroke(), U += te.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, _ + f - 0.5), e.lineTo(l, _ + f - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const W = a - p;
    e.fillStyle = Nt(r.accent, 0.1), e.fillRect(0, W, l, p), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, W - 0.5), e.lineTo(l, W - 0.5), e.stroke();
    let x = -h;
    for (let E = 0; E < i.length; E++) {
      const _ = i[E];
      if (x + _.width <= 0) {
        x += _.width;
        continue;
      }
      if (x >= l) break;
      const K = n.getCellStyle(_, n.aggregateRow).textAlign ?? "left", te = n.aggregateRow[_.colId] ?? "";
      e.save(), e.beginPath(), e.rect(x + 1, W, _.width - 2, p), e.clip(), e.font = `bold ${qt}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", m && (e.shadowColor = r.accent, e.shadowBlur = 8), K === "right" ? (e.textAlign = "right", e.fillText(te, x + _.width - 8, W + p / 2)) : (e.textAlign = "left", e.fillText(te, x + 8, W + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(x + _.width - 0.5, W), e.lineTo(x + _.width - 0.5, W + p), e.stroke(), x += _.width;
    }
  }
  e.restore();
}
function Nt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
const Ct = 190, Vt = 34;
function sl(t, n, e) {
  const l = Math.max(4, Math.min(n, t - Ct - 4)), a = ge + 6, r = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: Ct, h: Vt },
    input: { x: l + 9, y: a + 5, w: Ct - 18 - r, h: Vt - 10 },
    clear: e ? { x: l + Ct - 28, y: a, w: 28, h: Vt } : null
  };
}
const $t = (t, n, e, l = 0) => t >= e.x - l && t <= e.x + e.w + l && n >= e.y && n <= e.y + e.h;
function kt(t, n, e, l = 1) {
  return e.clear && $t(t, n, e.clear, 4 * (l - 1)) ? "clear" : $t(t, n, e.input) ? "input" : $t(t, n, e.box) ? "inside" : "outside";
}
function cl(t, n, e, l, a) {
  const { box: r, input: i, clear: d } = n;
  t.save(), t.fillStyle = "rgba(8,12,22,0.94)", t.strokeStyle = a.accent, t.lineWidth = 1, t.beginPath(), t.roundRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1, 4), t.fill(), t.stroke(), t.fillStyle = "rgba(255,255,255,0.05)", t.beginPath(), t.roundRect(i.x, i.y, i.w, i.h, 3), t.fill(), t.beginPath(), t.rect(i.x, i.y, i.w, i.h), t.clip(), t.font = Rt(), t.textBaseline = "middle";
  const c = i.y + i.h / 2 + 1, f = 5;
  if (e) {
    t.fillStyle = a.text;
    const u = t.measureText(e).width, h = u > i.w - 2 * f - 2 ? i.x + i.w - f - 2 - u : i.x + f;
    t.fillText(e, h, c), l && (t.fillStyle = a.accent, t.fillRect(Math.min(h + u + 1, i.x + i.w - f), i.y + 4, 1.5, i.h - 8));
  } else
    t.fillStyle = a.textHeader, t.fillText("Filter…", i.x + f, c), l && (t.fillStyle = a.accent, t.fillRect(i.x + f, i.y + 4, 1.5, i.h - 8));
  t.restore(), d && (t.save(), t.font = Rt(), t.textBaseline = "middle", t.textAlign = "center", t.fillStyle = a.textHeader, t.fillText("✕", d.x + d.w / 2, d.y + d.h / 2 + 1), t.restore());
}
function ul(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = Math.abs(e), i = (l * l + a * a) * r;
  if (e < 0) {
    const f = 0.5 * r, h = 1 / (1 - 2 * (0.5 * (1 + f) * f)), m = (l + l * (1 + i) * i * -1) * h, C = (a + a * (1 + i) * i * -1) * h;
    return [0.5 + m, 0.5 + C];
  }
  const d = l * (1 + i) * i, c = a * (1 + i) * i;
  return [t + d, n + c * 0.15];
}
function fl(t, n, e, l, a) {
  const r = t / e, i = 1 - n / l, [d, c] = ul(r, i, a);
  return d < 0 || d > 1 || c < 0 || c > 1 ? [-1, -1] : [d * e, (1 - c) * l];
}
function Xt(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function dl(t, n, e, l = 1) {
  return t >= n + e - 24 * l && t < n + e;
}
function Mn(t, n, e, l = 1) {
  const a = n + e;
  return t >= a - 6 * l && t <= a + 1 * l;
}
function Sn(t, n, e, l, a, r, i, d, c, f = !1, u) {
  const h = t + c;
  let m = -1, C = 0;
  for (let M = 0; M < e.length; M++) {
    if (h >= C && h < C + e[M].width) {
      m = M;
      break;
    }
    C += e[M].width;
  }
  if (n < ge) return { area: "header", colIdx: m, rowIdx: -1 };
  const p = f ? Fn : 0;
  if (p > 0 && n >= i - p)
    return { area: "agg", colIdx: m, rowIdx: -1 };
  const S = d * a;
  if (S > 0 && n >= i - S - p) {
    const M = Math.floor((n - (i - S - p)) / a);
    return { area: "pinned", colIdx: m, rowIdx: M };
  }
  const v = n - ge + r, g = u && u.length === l ? Et(Qt(u, l), v) : Math.floor(v / a);
  return g >= 0 && g < l ? { area: "body", colIdx: m, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function xt(t) {
  return t / 45 * 0.55;
}
const vl = 500, hl = vl / 2, ml = 1.6, en = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, tn = `
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
`, nn = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function ln() {
  return {
    uMouseUV: { value: new V.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: ml },
    uLensTint: { value: new V.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Te = { x: -999, y: -999 };
function on(t, n, e, l, a) {
  const r = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = r && a > 0 ? hl / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function an(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const gl = ["value"], pl = ["disabled"], wl = ["disabled"], yl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, bl = 28, xl = 600, Ml = /* @__PURE__ */ lt({
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
    magnify: { type: Boolean, default: !1 }
  },
  emits: ["grid-ready", "row-clicked", "cell-selected", "column-resized", "sort-changed", "filter-changed"],
  setup(t, { emit: n }) {
    const e = t, l = n, a = P(e.rowData ?? []), r = P(e.pinnedBottomRowData ?? []), i = P(""), d = P(null), c = Ot({}), f = Ot({}), u = Ot(/* @__PURE__ */ new Set()), h = P(0), m = P(0), C = P(0), p = P(0), S = P(0), v = P(-1), g = P(null), M = P(null), D = P(null), $ = { ...Te }, R = P(""), b = P(0), L = P(null);
    let Y = null;
    const G = P(!0);
    let ie = null;
    N(D, (o) => {
      var s;
      ie && (clearInterval(ie), ie = null), o ? (G.value = !0, ie = setInterval(() => {
        G.value = !G.value, he();
      }, 530), _e(() => {
        var y;
        return (y = L.value) == null ? void 0 : y.focus();
      })) : (Y = null, (s = L.value) == null || s.blur()), he();
    });
    function q(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const j = ee(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((s) => !u.has(q(s))).map((s) => {
        const y = q(s), I = { ...o, ...s };
        return { colId: y, colDef: I, width: f[y] ?? I.width ?? 100 };
      });
    }), z = ee(() => {
      const o = m.value;
      if (!o) return j.value;
      const s = j.value.reduce((k, F) => k + F.width, 0);
      if (!s || s >= o) return j.value;
      const y = o / s;
      let I = 0;
      return j.value.map((k, F) => {
        const se = F === j.value.length - 1 ? o - I : Math.max(8, Math.round(k.width * y));
        return I += se, { ...k, width: se };
      });
    }), H = ee(() => {
      const o = z.value.reduce((s, y) => s + y.width, 0);
      return Math.max(0, o - m.value);
    });
    let ae = null;
    function me() {
      if (typeof document > "u") return null;
      ae || (ae = document.createElement("canvas"));
      const o = ae.getContext("2d");
      return o && (o.font = Rt()), o;
    }
    const re = ee(() => z.value.some((o) => o.colDef.wrap)), le = ee(() => {
      if (!re.value) return null;
      const o = me();
      if (!o) return null;
      const s = z.value.filter((I) => I.colDef.wrap), y = e.rowHeight;
      return Z.value.map((I) => {
        let k = 1;
        for (const F of s) {
          const B = An(o, ue(F, I), Math.max(20, F.width - 16));
          B.length > k && (k = B.length);
        }
        return rl(k, y);
      });
    }), W = ee(
      () => le.value ? Qt(le.value, Z.value.length) : null
    ), x = ee(
      () => W.value ? W.value[Z.value.length] : Z.value.length * e.rowHeight
    ), E = ee(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, C.value - ge - o);
    }), _ = ee(
      () => Math.max(0, x.value - E.value)
    ), U = ee(
      () => Math.max(1, Math.floor(E.value / e.rowHeight))
    ), K = ee(() => {
      const o = Z.value.length;
      if (o === 0) return 0;
      const s = W.value ? Et(W.value, p.value) : Math.floor(p.value / e.rowHeight);
      return Math.min(o - 1, s);
    }), te = ee(() => {
      const o = Z.value.length;
      return o === 0 ? 0 : W.value ? Math.min(o - 1, Et(W.value, p.value + E.value - 1)) : Math.min(o - 1, K.value + U.value - 1);
    });
    function X(o, s) {
      if (s.colDef.valueGetter) return s.colDef.valueGetter({ data: o, colDef: s.colDef });
      if (s.colDef.field) return o[s.colDef.field];
    }
    function ue(o, s) {
      const y = X(s, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: y, data: s, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: y, data: s, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : y == null ? "" : String(y);
    }
    function fe(o, s) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: X(s, o), data: s, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const Z = ee(() => {
      h.value;
      let o = a.value;
      const s = i.value.trim().toLowerCase();
      s && (o = o.filter(
        (y) => j.value.some(
          (I) => String(X(y, I) ?? "").toLowerCase().includes(s)
        )
      ));
      for (const [y, I] of Object.entries(c)) {
        if (!I) continue;
        const k = j.value.find((F) => F.colId === y);
        if (k)
          if (I.startsWith("__eq__")) {
            const F = I.slice(6).toLowerCase();
            o = o.filter((B) => String(X(B, k) ?? "").toLowerCase() === F);
          } else {
            const F = I.toLowerCase();
            o = o.filter((B) => String(X(B, k) ?? "").toLowerCase().includes(F));
          }
      }
      if (d.value) {
        const { colId: y, dir: I } = d.value, k = j.value.find((F) => F.colId === y);
        k && (o = [...o].sort((F, B) => {
          const se = X(F, k), Q = X(B, k);
          let ve = 0;
          return k.colDef.comparator ? ve = k.colDef.comparator(se, Q) : typeof se == "number" && typeof Q == "number" ? ve = se - Q : ve = String(se ?? "").localeCompare(String(Q ?? ""), void 0, { numeric: !0 }), I === "asc" ? ve : -ve;
        }));
      }
      return o;
    }), Ce = ee(() => {
      const o = j.value.filter((k) => k.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const s = Z.value, y = {};
      for (const k of o) {
        const F = s.map((se) => X(se, k)), B = il(F, k.colDef.aggFunc);
        if (B == null) {
          y[k.colId] = "";
          continue;
        }
        y[k.colId] = k.colDef.aggValueFormatter ? k.colDef.aggValueFormatter(B) : String(B);
      }
      const I = o[0].colId;
      return y[I] === "" && (y[I] = "Σ"), y;
    });
    N(Z, () => {
      p.value = 0, g.value = null;
    }), N(H, () => {
      S.value = Math.min(S.value, H.value);
    }), N(_, () => {
      p.value = Math.min(p.value, _.value);
    });
    function Ie(o) {
      const s = W.value, y = s ? s[o] : o * e.rowHeight, I = s ? s[o + 1] : y + e.rowHeight;
      y < p.value ? p.value = y : I > p.value + E.value && (p.value = Math.min(_.value, I - E.value));
    }
    function A() {
      p.value = Math.max(0, p.value - E.value), he();
    }
    function O() {
      p.value = Math.min(_.value, p.value + E.value), he();
    }
    let J = !1, xe = "", Le = 0, Ne = 0, it = 1, We = !1, ke = !1, Pe = 0, Ue = 0, Re = 0, Ee = 0, ze = !1;
    function Yt(o, s, y = 1) {
      var I;
      J = !0, xe = o, Le = s, it = y, Ne = ((I = z.value.find((k) => k.colId === o)) == null ? void 0 : I.width) ?? 100, We = !1;
    }
    function Ve(o) {
      if (ke) {
        const F = Pe - o.clientX, B = Ue - o.clientY;
        (Math.abs(F) > 4 || Math.abs(B) > 4) && (ze = !0), S.value = Math.max(0, Math.min(H.value, Re + F)), p.value = Math.max(0, Math.min(_.value, Ee + B)), he();
        return;
      }
      if (!J) return;
      const s = m.value, y = Math.max(30, Ne + (o.clientX - Le) * it), I = j.value.filter((F) => F.colId !== xe).reduce((F, B) => F + B.width, 0), k = s - y;
      k > 10 && (f[xe] = Math.max(10, Math.round(y * I / k))), he();
    }
    function dt() {
      ke && (ze && (We = !0), ke = !1), J && (J = !1, We = !0, l("column-resized"));
    }
    function Mt(o) {
      if (o.touches.length !== 1) return;
      const s = o.touches[0];
      ke = !0, ze = !1, Pe = s.clientX, Ue = s.clientY, Re = S.value, Ee = p.value;
    }
    function Wt(o) {
      if (!ke || o.touches.length !== 1) return;
      o.preventDefault();
      const s = o.touches[0], y = Pe - s.clientX, I = Ue - s.clientY;
      (Math.abs(y) > 4 || Math.abs(I) > 4) && (ze = !0), S.value = Math.max(0, Math.min(H.value, Re + y)), p.value = Math.max(0, Math.min(_.value, Ee + I)), he();
    }
    function St() {
      ke && (ze && (We = !0), ke = !1);
    }
    const w = P(null), T = P(null), ne = Bt("cathodeResetTick", P(0));
    N(ne, () => ct());
    let oe = null, Se = !1;
    function He() {
      if (oe) {
        try {
          oe.forceContextLoss();
        } catch {
        }
        try {
          oe.dispose();
        } catch {
        }
        oe = null;
      }
    }
    let De, Qe, Me, Ae, de;
    const Pn = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${en}

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

  ${tn}

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

    ${nn}

    gl_FragColor = color;
  }
`;
    function dn() {
      if (!(!T.value || !w.value)) {
        de = document.createElement("canvas");
        try {
          oe = new V.WebGLRenderer({ canvas: T.value, antialias: !1, alpha: !0 });
        } catch {
          Se = !0;
        }
        if (!Se && !oe.getContext() && (oe.dispose(), oe = null, Se = !0), Se) {
          st();
          return;
        }
        oe.setPixelRatio(1), oe.setClearColor(0, 0), De = new V.Scene(), Qe = new V.OrthographicCamera(-1, 1, 1, -1, 0, 1), Ae = new V.CanvasTexture(de), Ae.minFilter = V.LinearFilter, Ae.magFilter = V.LinearFilter, Me = new V.ShaderMaterial({
          uniforms: {
            uTex: { value: Ae },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new V.Color(0) },
            ...ln()
          },
          vertexShader: yl,
          fragmentShader: Pn,
          transparent: !0
        }), De.add(new V.Mesh(new V.PlaneGeometry(2, 2), Me)), st();
      }
    }
    function st() {
      if (!w.value || !oe && !Se) return;
      const o = w.value.clientWidth, s = w.value.clientHeight - (e.pagination ? bl : 0);
      if (!o || !s) return;
      const y = de.width !== o || de.height !== s;
      de.width = o, de.height = s, m.value = o, C.value = s, S.value = Math.max(0, Math.min(H.value, S.value)), p.value = Math.max(0, Math.min(_.value, p.value)), oe ? (y && Ae && (Ae.dispose(), Ae = new V.CanvasTexture(de), Ae.minFilter = V.LinearFilter, Ae.magFilter = V.LinearFilter, Me && (Me.uniforms.uTex.value = Ae)), oe.setPixelRatio(window.devicePixelRatio || 1), oe.setSize(o, s)) : T.value && (T.value.width = o, T.value.height = s, T.value.style.width = o + "px", T.value.style.height = s + "px"), he();
    }
    function he() {
      var y, I, k, F, B, se, Q, ve, Fe, gt, pt, ut;
      if (!(de != null && de.width)) return;
      if (Se) {
        if (!T.value) return;
        xn(de, {
          cols: z.value,
          rows: Z.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: le.value ?? void 0,
          scrollY: p.value,
          scrollX: S.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((y = d.value) == null ? void 0 : y.colId) ?? null,
          sortDir: ((I = d.value) == null ? void 0 : I.dir) ?? null,
          colFilters: c,
          hoveredRow: v.value,
          selectedRow: ((k = g.value) == null ? void 0 : k.row) ?? -1,
          selectedCol: ((F = g.value) == null ? void 0 : F.col) ?? -1,
          selectionAnchorRow: ((B = M.value) == null ? void 0 : B.row) ?? -1,
          selectionAnchorCol: ((se = M.value) == null ? void 0 : se.col) ?? -1,
          formatCell: ue,
          getCellStyle: fe
        }), vn();
        const wt = T.value.getContext("2d");
        wt && wt.drawImage(de, 0, 0);
        return;
      }
      if (!oe || !Me || !Ae) return;
      const o = Ke[e.theme] ?? Ke.none, s = e.theme === "paper";
      Me.uniforms.uStrength.value = xt(e.curvature), Me.uniforms.uScanlines.value = e.scanlines && !s ? 1 : 0, Me.uniforms.uVignette.value = s ? 0 : 1, Me.uniforms.uBezel.value.set(o.bg), on(Me, e.magnify, $, de.width, de.height), xn(de, {
        cols: z.value,
        rows: Z.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: le.value ?? void 0,
        scrollY: p.value,
        scrollX: S.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((Q = d.value) == null ? void 0 : Q.colId) ?? null,
        sortDir: ((ve = d.value) == null ? void 0 : ve.dir) ?? null,
        colFilters: c,
        hoveredRow: v.value,
        selectedRow: ((Fe = g.value) == null ? void 0 : Fe.row) ?? -1,
        selectedCol: ((gt = g.value) == null ? void 0 : gt.col) ?? -1,
        selectionAnchorRow: ((pt = M.value) == null ? void 0 : pt.row) ?? -1,
        selectionAnchorCol: ((ut = M.value) == null ? void 0 : ut.col) ?? -1,
        formatCell: ue,
        getCellStyle: fe,
        aggregateRow: Ce.value
      }), vn(), Ae.needsUpdate = !0, oe.render(De, Qe);
    }
    function vn() {
      if (!D.value || !(de != null && de.width)) return;
      const o = de.getContext("2d");
      if (!o) return;
      Y = sl(de.width, b.value, !!R.value);
      const s = Ke[e.theme] ?? Ke.none;
      cl(o, Y, R.value, G.value, s);
    }
    function Pt(o, s) {
      if (!T.value) return [-1, -1];
      const y = T.value.getBoundingClientRect(), I = o - y.left, k = s - y.top, F = T.value.width || y.width, B = T.value.height || y.height, se = xt(e.curvature), [Q, ve] = fl(I, k, F, B, se);
      return Q < 0 ? [-1, -1] : [Q, ve];
    }
    function Tt(o) {
      return Pt(o.clientX, o.clientY);
    }
    function et(o) {
      if (!T.value) return 1;
      const [s] = Pt(o.clientX - 4, o.clientY), [y] = Pt(o.clientX + 4, o.clientY);
      if (s < 0 || y < 0) return 1;
      const I = T.value.getBoundingClientRect(), k = (T.value.width || I.width) / I.width;
      return Math.max(1, Math.abs(y - s) / 8 / k);
    }
    let zt = 0;
    function zn(o) {
      D.value = null;
      const s = Date.now();
      if (o.deltaX !== 0) {
        zt = s, S.value = Math.max(0, Math.min(H.value, S.value + o.deltaX)), he();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        zt = s, S.value = Math.max(0, Math.min(H.value, S.value + o.deltaY)), he();
        return;
      }
      s - zt < xl || (p.value = Math.max(0, Math.min(_.value, p.value + o.deltaY)), he());
    }
    function Hn(o) {
      if (J) return;
      if (e.magnify && T.value) {
        const k = an(o, T.value);
        $.x = k.x, $.y = k.y;
      }
      const [s, y] = Tt(o);
      if (s < 0) {
        v.value = -1, he();
        return;
      }
      if (D.value && Y) {
        const k = kt(s, y, Y, et(o));
        if (k !== "outside") {
          v.value = -1, T.value.style.cursor = k === "clear" ? "pointer" : "text", he();
          return;
        }
      }
      const I = Sn(
        s,
        y,
        z.value,
        Z.value.length,
        e.rowHeight,
        p.value,
        de.height,
        r.value.length,
        S.value,
        Ce.value !== null,
        le.value ?? void 0
      );
      if (v.value = I.area === "body" ? I.rowIdx : -1, I.area === "header" && I.colIdx >= 0) {
        const k = z.value[I.colIdx], F = Xt(I.colIdx, z.value), B = s + S.value;
        T.value.style.cursor = k && Mn(B, F, k.width, et(o)) ? "col-resize" : "pointer";
      } else I.area === "body" ? T.value.style.cursor = "pointer" : T.value.style.cursor = "default";
      he();
    }
    function On() {
      v.value = -1, $.x = Te.x, $.y = Te.y, he();
    }
    function Nn(o) {
      const [s, y] = Tt(o);
      if (s < 0 || D.value && Y && kt(s, y, Y, et(o)) !== "outside") return;
      if (y >= ge) {
        ke = !0, ze = !1, Pe = o.clientX, Ue = o.clientY, Re = S.value, Ee = p.value;
        return;
      }
      const I = s + S.value, k = et(o);
      for (let F = 0; F < z.value.length; F++) {
        const B = z.value[F], se = Xt(F, z.value);
        if (B.colDef.resizable !== !1 && Mn(I, se, B.width, k)) {
          Yt(B.colId, o.clientX, k);
          return;
        }
      }
    }
    function Vn(o) {
      var k, F, B, se;
      if (We) {
        We = !1;
        return;
      }
      if (J) return;
      const [s, y] = Tt(o);
      if (s < 0) {
        D.value = null;
        return;
      }
      if (D.value && Y) {
        const Q = kt(s, y, Y, et(o));
        if (Q === "clear") {
          mn();
          return;
        }
        if (Q !== "outside") {
          (k = L.value) == null || k.focus();
          return;
        }
        D.value = null;
      }
      const I = Sn(
        s,
        y,
        z.value,
        Z.value.length,
        e.rowHeight,
        p.value,
        de.height,
        r.value.length,
        S.value,
        Ce.value !== null,
        le.value ?? void 0
      );
      if (I.area === "header" && I.colIdx >= 0) {
        const Q = z.value[I.colIdx], ve = Xt(I.colIdx, z.value), Fe = s + S.value;
        Q.colDef.filter && dl(Fe, ve, Q.width, et(o)) ? (o.stopPropagation(), D.value === Q.colId ? D.value = null : (D.value = Q.colId, R.value = (F = c[Q.colId]) != null && F.startsWith("__eq__") ? c[Q.colId].slice(6) : c[Q.colId] ?? "", b.value = Math.max(0, ve - S.value))) : Q.colDef.sortable !== !1 && (D.value = null, d.value = ((B = d.value) == null ? void 0 : B.colId) === Q.colId ? d.value.dir === "asc" ? { colId: Q.colId, dir: "desc" } : null : { colId: Q.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (D.value = null, I.area === "body" && I.rowIdx >= 0 && I.colIdx >= 0) {
        const Q = I.rowIdx;
        o.shiftKey && g.value ? (M.value || (M.value = { ...g.value }), g.value = { row: Q, col: I.colIdx }) : (g.value = { row: Q, col: I.colIdx }, M.value = { row: Q, col: I.colIdx }), (se = T.value) == null || se.focus();
        const ve = Z.value[Q], Fe = z.value[I.colIdx];
        ve && Fe && (l("row-clicked", { data: ve, event: o }), l("cell-selected", { data: ve, row: Q, col: I.colIdx, colId: Fe.colId }));
      }
    }
    function hn(o) {
      if (D.value) {
        if (o.target === T.value && Y) {
          const [s, y] = Tt(o);
          if (s >= 0 && kt(s, y, Y, et(o)) !== "outside") return;
        }
        D.value = null;
      }
    }
    function $n(o) {
      var k;
      if (!m.value) return;
      let s = 0;
      for (let F = 0; F < o; F++) s += z.value[F].width;
      const y = ((k = z.value[o]) == null ? void 0 : k.width) ?? 0, I = s - S.value;
      I < 0 ? S.value = Math.max(0, s) : I + y > m.value && (S.value = Math.min(H.value, s + y - m.value));
    }
    function Xn(o) {
      const y = z.value.length - 1, I = Z.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), g.value = { row: K.value, col: 0 }, M.value = { row: K.value, col: 0 });
        return;
      }
      let { row: k, col: F } = g.value;
      const B = (se, Q, ve = !1) => {
        k = Math.max(0, Math.min(I, se)), F = Math.max(0, Math.min(y, Q)), g.value = { row: k, col: F }, ve || (M.value = { row: k, col: F }), Ie(k), $n(F);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), B(k + 1, F, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), B(k - 1, F, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? B(k, F + 1, !0) : F < y ? B(k, F + 1) : B(k + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? B(k, F - 1, !0) : F > 0 ? B(k, F - 1) : B(k - 1, y);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? F > 0 ? B(k, F - 1) : B(k - 1, y) : F < y ? B(k, F + 1) : B(k + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? B(k - 1, F) : B(k + 1, F);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? B(0, 0, o.shiftKey) : B(k, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? B(I, y, o.shiftKey) : B(k, y, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), B(Math.min(I, k + U.value), F, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), B(Math.max(0, k - U.value), F, o.shiftKey);
          break;
        case "Escape":
          g.value = null, M.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), Un());
          break;
      }
    }
    function Un() {
      var ve;
      if (!g.value) return;
      const o = z.value, s = Z.value, y = M.value ?? g.value, I = Math.min(y.row, g.value.row), k = Math.max(y.row, g.value.row), F = Math.min(y.col, g.value.col), B = Math.max(y.col, g.value.col), se = [];
      for (let Fe = I; Fe <= k; Fe++) {
        const gt = s[Fe];
        if (!gt) continue;
        const pt = [];
        for (let ut = F; ut <= B; ut++) {
          const wt = o[ut];
          wt && pt.push(ue(wt, gt).replace(/[\t\r\n]+/g, " "));
        }
        se.push(pt.join("	"));
      }
      const Q = se.join(`
`);
      (ve = navigator.clipboard) == null || ve.writeText(Q).catch(() => {
      });
    }
    function Kn(o) {
      const s = o.target.value;
      R.value = s, s ? c[D.value] = s : delete c[D.value], l("filter-changed");
    }
    function mn() {
      D.value && delete c[D.value], R.value = "", D.value = null, l("filter-changed");
    }
    const Gn = {
      setGridOption(o, s) {
        o === "rowData" ? a.value = s : o === "pinnedBottomRowData" ? r.value = s : o === "quickFilterText" && (i.value = s);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var y, I;
          const s = q(o);
          return {
            colId: s,
            hide: u.has(s),
            sort: ((y = d.value) == null ? void 0 : y.colId) === s ? d.value.dir : null,
            sortIndex: ((I = d.value) == null ? void 0 : I.colId) === s ? 0 : null,
            width: f[s] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const s of o)
          s.hide === !0 && u.add(s.colId), s.hide === !1 && u.delete(s.colId), s.sort && (d.value = { colId: s.colId, dir: s.sort }), s.width && (f[s.colId] = s.width);
      },
      setFilterModel(o) {
        for (const s of Object.keys(c)) delete c[s];
        if (o)
          for (const [s, y] of Object.entries(o))
            (y == null ? void 0 : y.type) === "equals" ? c[s] = `__eq__${y.filter}` : y != null && y.filter && (c[s] = y.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [s, y] of Object.entries(c))
          y && (o[s] = y.startsWith("__eq__") ? { type: "equals", filter: y.slice(6) } : { type: "contains", filter: y });
        return o;
      },
      async setColumnFilterModel(o, s) {
        s ? s.type === "equals" ? c[o] = `__eq__${s.filter}` : c[o] = s.filter ?? "" : delete c[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const s = j.value, y = s.map((B) => B.colDef.headerName ?? B.colId).join(","), I = Z.value.map(
          (B) => s.map((se) => `"${String(ue(se, B)).replace(/"/g, '""')}"`).join(",")
        ), k = new Blob([[y, ...I].join(`
`)], { type: "text/csv" }), F = URL.createObjectURL(k);
        Object.assign(document.createElement("a"), { href: F, download: o }).click(), URL.revokeObjectURL(F);
      },
      resize() {
        st();
      },
      resetColumnState() {
        u.clear();
        for (const s of e.columnDefs)
          s.hide && u.add(q(s));
        const o = e.columnDefs.find((s) => s.sort);
        d.value = o ? { colId: q(o), dir: o.sort } : null;
        for (const s of Object.keys(f)) delete f[s];
        for (const s of Object.keys(c)) delete c[s];
        i.value = "", p.value = 0, g.value = null, D.value = null;
      }
    };
    N(
      [Z, () => r.value, z, p, v, g],
      () => _e(he)
    ), N(() => e.theme, () => he()), N(() => e.curvature, () => _e(st)), N(() => e.scanlines, () => he()), N(() => e.glow, () => he()), N(() => e.magnify, (o) => {
      o || ($.x = Te.x, $.y = Te.y), he();
    }), N(g, (o) => {
      if (!o) return;
      const s = Z.value[o.row], y = z.value[o.col];
      s && y && l("cell-selected", { data: s, row: o.row, col: o.col, colId: y.colId });
    });
    let vt = null, ht = null, Ht = 0;
    function ct() {
      cancelAnimationFrame(Ht), Ht = requestAnimationFrame(st);
    }
    function gn(o) {
      o.preventDefault();
    }
    function pn() {
      oe == null || oe.dispose(), oe = null, Se = !1, dn();
    }
    Ze(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(q(o)), o.sort && !d.value && (d.value = { colId: q(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", hn), document.addEventListener("mousemove", Ve), document.addEventListener("mouseup", dt), _e(() => {
        var o;
        dn(), T.value && (T.value.addEventListener("webglcontextlost", gn), T.value.addEventListener("webglcontextrestored", pn)), w.value && (vt = new ResizeObserver(() => st()), vt.observe(w.value), ht = new IntersectionObserver((s) => {
          s.some((y) => y.isIntersecting) && ct();
        }), ht.observe(w.value)), window.addEventListener("resize", ct), (o = window.visualViewport) == null || o.addEventListener("resize", ct), l("grid-ready", { api: Gn });
      });
    }), ot(() => {
      var o, s, y;
      document.removeEventListener("click", hn, !0), document.removeEventListener("mousemove", Ve), document.removeEventListener("mouseup", dt), (o = T.value) == null || o.removeEventListener("webglcontextlost", gn), (s = T.value) == null || s.removeEventListener("webglcontextrestored", pn), vt == null || vt.disconnect(), ht == null || ht.disconnect(), window.removeEventListener("resize", ct), (y = window.visualViewport) == null || y.removeEventListener("resize", ct), cancelAnimationFrame(Ht), He();
    });
    const mt = ee(() => Ke[e.theme] ?? Ke.none), jn = ee(() => ({
      background: mt.value.headerBg,
      borderTop: `1px solid ${mt.value.border}`,
      color: mt.value.text
    })), qn = ee(() => ({
      background: mt.value.bg
    })), wn = ee(() => mt.value.accent);
    return (o, s) => {
      var y, I;
      return we(), ye("div", {
        ref_key: "wrapEl",
        ref: w,
        class: "cathode-wrap",
        style: Ge(qn.value)
      }, [
        ce("canvas", {
          ref_key: "canvasEl",
          ref: T,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: tt(zn, ["prevent"]),
          onMousemove: Hn,
          onMouseleave: On,
          onMousedown: Nn,
          onClick: Vn,
          onKeydown: Xn,
          onTouchstartPassive: Mt,
          onTouchmove: Wt,
          onTouchend: St,
          onTouchcancel: St
        }, null, 544),
        D.value ? (we(), ye("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: L,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: R.value,
          autofocus: "",
          onInput: Kn,
          onKeydown: [
            yn(mn, ["escape"]),
            s[0] || (s[0] = yn((k) => D.value = null, ["enter"]))
          ]
        }, null, 40, gl)) : $e("", !0),
        t.pagination ? (we(), ye("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ge(jn.value)
        }, [
          ce("button", {
            disabled: p.value <= 0,
            onClick: s[1] || (s[1] = (k) => A())
          }, "◀", 8, pl),
          ce("span", null, Oe((K.value + 1).toLocaleString()) + "–" + Oe(Math.min(Z.value.length, te.value + 1).toLocaleString()) + " / " + Oe(Z.value.length.toLocaleString()), 1),
          ce("button", {
            disabled: p.value >= _.value,
            onClick: s[2] || (s[2] = (k) => O())
          }, "▶", 8, wl),
          ce("span", {
            class: "cathode-page-info",
            style: Ge({ color: wn.value })
          }, Oe(Z.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (we(), ye("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ge({ color: wn.value })
          }, Oe(((y = z.value[g.value.col]) == null ? void 0 : y.colDef.headerName) ?? ((I = z.value[g.value.col]) == null ? void 0 : I.colId)) + " : " + Oe(ue(z.value[g.value.col], Z.value[g.value.row])), 5)) : $e("", !0)
        ], 4)) : $e("", !0)
      ], 4);
    };
  }
}), at = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, Do = /* @__PURE__ */ at(Ml, [["__scopeId", "data-v-a8b02ec7"]]), Dt = {
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
function Sl(t, n) {
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
const Tl = 12, pe = 18, bt = 10, nt = 6, rn = `${Tl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Cl(t, n, e) {
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
    let i = "";
    for (const d of r) {
      const c = i + d;
      if (t.measureText(c).width <= e)
        i = c;
      else if (i && (l.push(i.replace(/\s+$/, "")), i = ""), t.measureText(d).width > e) {
        let f = "";
        for (const u of d)
          t.measureText(f + u).width > e ? (f && l.push(f), f = u) : f += u;
        i = f;
      } else
        i = d.replace(/^\s+/, "");
    }
    i && l.push(i.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function _n(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function kl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function Il(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, i = t.formatTs ?? _n;
  e.font = rn;
  const d = [];
  for (let c = 0; c < n.length; c++) {
    const f = n[c], u = f.level ?? "info", h = a && f.ts != null ? i(f.ts) : "", m = r ? Cl(e, f.text, l) : f.text.split(`
`);
    for (let C = 0; C < m.length; C++)
      d.push({
        entryIdx: c,
        text: m[C],
        level: u,
        timestamp: C === 0 ? h : "",
        isFirstFrag: C === 0,
        widthPx: e.measureText(m[C]).width
      });
  }
  return d;
}
function Tn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Dt[n.theme] ?? Dt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = rn, e.textBaseline = "middle";
  const i = n.visualLines, d = bt - n.scrollX, c = (n.showTimestamps ? bt + n.timestampWidth : bt) - n.scrollX, f = Math.max(0, Math.floor((n.scrollY - nt) / pe)), u = Math.min(i.length, Math.ceil((n.scrollY + a - nt) / pe) + 1);
  for (let h = f; h < u; h++) {
    const m = i[h], C = nt + h * pe - n.scrollY + pe / 2;
    if (m.entryIdx % 2 === 1 && m.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let S = 1;
      for (; h + S < u && i[h + S].entryIdx === m.entryIdx; ) S++;
      e.fillRect(0, C - pe / 2, l, pe * S);
    }
    n.selectionStart >= 0 && h >= n.selectionStart && h <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, C - pe / 2, l, pe)), h === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, C - pe / 2, l, pe)), n.showTimestamps && m.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(m.timestamp, d, C), e.shadowBlur = 0);
    const p = Sl(r, m.level);
    e.fillStyle = p, e.textAlign = "left", n.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(m.text, c, C), e.shadowBlur = 7, e.fillText(m.text, c, C), e.shadowBlur = 3, e.fillText(m.text, c, C), e.shadowBlur = 0) : e.fillText(m.text, c, C);
  }
  e.restore();
}
function Cn(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - nt) / pe);
  return l < 0 || l >= e ? -1 : l;
}
function Ll(t) {
  return nt * 2 + t * pe;
}
const Rl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, El = /* @__PURE__ */ lt({
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
    const e = t, l = P(null), a = P(null), r = { ...Te }, i = P(0), d = P(0), c = P(0), f = P(-1), u = P(!0), h = P(-1), m = P(-1), C = ee(() => {
      const w = e.entries ?? [];
      return e.maxLines > 0 && w.length > e.maxLines ? w.slice(w.length - e.maxLines) : w;
    }), p = ee(() => {
      if (!e.showTimestamps) return "";
      const w = e.formatTs ?? _n;
      let T = "00:00:00";
      for (const ne of C.value) {
        if (ne.ts == null) continue;
        const oe = w(ne.ts);
        oe.length > T.length && (T = oe);
      }
      return T;
    }), S = P(0), v = P([]);
    function g() {
      if (!H) return;
      const w = H.getContext("2d");
      if (!w) return;
      w.font = rn;
      const T = e.showTimestamps ? kl(w, p.value) : 0;
      S.value = T;
      const ne = Math.max(
        1,
        i.value - bt * 2 - T
      );
      v.value = Il({
        entries: C.value,
        ctx: w,
        textMaxWidth: ne,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const M = ee(() => Ll(v.value.length)), D = ee(() => Math.max(0, M.value - d.value)), $ = ee(() => {
      let w = 0;
      for (const T of v.value) T.widthPx > w && (w = T.widthPx);
      return bt * 2 + S.value + w;
    }), R = ee(() => Math.max(0, $.value - i.value)), b = P(0);
    N(D, () => {
      u.value ? c.value = D.value : c.value = Math.min(c.value, D.value);
    }), N(R, () => {
      b.value = Math.min(b.value, R.value);
    }), N(
      [C, i, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        g(), _e(le);
      },
      { deep: !1 }
    );
    let L = null, Y = !1;
    function G() {
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
    let ie, q, j, z, H;
    const ae = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${en}

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

  ${tn}

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

    ${nn}

    gl_FragColor = color;
  }
`;
    function me() {
      if (!(!a.value || !l.value)) {
        H = document.createElement("canvas");
        try {
          L = new V.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          Y = !0;
        }
        if (!Y && !L.getContext() && (L.dispose(), L = null, Y = !0), Y) {
          re();
          return;
        }
        L.setPixelRatio(1), L.setClearColor(0, 0), ie = new V.Scene(), q = new V.OrthographicCamera(-1, 1, 1, -1, 0, 1), z = new V.CanvasTexture(H), z.minFilter = V.LinearFilter, z.magFilter = V.LinearFilter, j = new V.ShaderMaterial({
          uniforms: {
            uTex: { value: z },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...ln()
          },
          vertexShader: Rl,
          fragmentShader: ae,
          transparent: !0
        }), ie.add(new V.Mesh(new V.PlaneGeometry(2, 2), j)), re();
      }
    }
    function re() {
      if (!l.value || !L && !Y) return;
      const w = l.value.clientWidth, T = l.value.clientHeight;
      if (!w || !T) return;
      const ne = H.width !== w || H.height !== T;
      ne && (H.width = w, H.height = T, i.value = w, d.value = T, g(), L ? (ne && z && (z.dispose(), z = new V.CanvasTexture(H), z.minFilter = V.LinearFilter, z.magFilter = V.LinearFilter, j && (j.uniforms.uTex.value = z)), L.setPixelRatio(window.devicePixelRatio || 1), L.setSize(w, T)) : a.value && (a.value.width = w, a.value.height = T, a.value.style.width = w + "px", a.value.style.height = T + "px"), u.value && (c.value = Math.max(0, M.value - d.value)), le());
    }
    function le() {
      if (!(H != null && H.width)) return;
      if (Y) {
        if (!a.value) return;
        Tn(H, {
          visualLines: v.value,
          scrollY: c.value,
          scrollX: b.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: S.value,
          hoveredLine: f.value,
          selectionStart: Math.min(h.value, m.value),
          selectionEnd: Math.max(h.value, m.value)
        });
        const T = a.value.getContext("2d");
        T && T.drawImage(H, 0, 0);
        return;
      }
      if (!L || !j || !z) return;
      const w = e.theme === "paper";
      j.uniforms.uStrength.value = xt(e.curvature), j.uniforms.uScanlines.value = e.scanlines && !w ? 1 : 0, j.uniforms.uVignette.value = w ? 0 : 1, on(j, e.magnify, r, H.width, H.height), Tn(H, {
        visualLines: v.value,
        scrollY: c.value,
        scrollX: b.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: S.value,
        hoveredLine: f.value,
        selectionStart: Math.min(h.value, m.value),
        selectionEnd: Math.max(h.value, m.value)
      }), z.needsUpdate = !0, L.render(ie, q);
    }
    N(() => e.theme, () => le()), N(() => e.curvature, () => le()), N(() => e.scanlines, () => le()), N(() => e.glow, () => le()), N(() => e.magnify, (w) => {
      w || (r.x = Te.x, r.y = Te.y), le();
    }), N(c, () => le()), N(b, () => le()), N(f, () => le()), N([h, m], () => le());
    function W(w) {
      if (!a.value) return [-1, -1];
      const T = a.value.getBoundingClientRect();
      return [w.clientX - T.left, w.clientY - T.top];
    }
    function x(w) {
      c.value = Math.max(0, Math.min(D.value, w)), u.value = c.value >= D.value - 4;
    }
    function E(w) {
      b.value = Math.max(0, Math.min(R.value, w));
    }
    function _(w) {
      w.shiftKey ? E(b.value + w.deltaY) : Math.abs(w.deltaX) > Math.abs(w.deltaY) ? E(b.value + w.deltaX) : x(c.value + w.deltaY);
    }
    let U = !1, K = 0, te = 0, X = 0, ue = 0, fe = !1;
    function Z(w) {
      U = !0, fe = !1, K = w.clientX, te = w.clientY, X = b.value, ue = c.value, l.value && l.value.focus();
    }
    function Ce(w) {
      if (U) {
        const T = K - w.clientX, ne = te - w.clientY;
        (Math.abs(T) > 4 || Math.abs(ne) > 4) && (fe = !0), E(X + T), x(ue + ne);
      }
    }
    function Ie() {
      U && (U = !1, fe && (fe = !1));
    }
    function A(w) {
      if (w.touches.length !== 1) return;
      const T = w.touches[0];
      U = !0, fe = !1, K = T.clientX, te = T.clientY, X = b.value, ue = c.value, l.value && l.value.focus();
    }
    function O(w) {
      if (!U || w.touches.length !== 1) return;
      w.preventDefault();
      const T = w.touches[0], ne = K - T.clientX, oe = te - T.clientY;
      (Math.abs(ne) > 4 || Math.abs(oe) > 4) && (fe = !0), E(X + ne), x(ue + oe);
    }
    function J() {
      U && (U = !1, fe && (fe = !1));
    }
    function xe(w) {
      const [, T] = W(w);
      return T < 0 ? -1 : Cn(T, c.value, v.value.length);
    }
    function Le(w) {
      if (fe) {
        fe = !1;
        return;
      }
      const T = xe(w);
      if (T < 0) {
        h.value = -1, m.value = -1;
        return;
      }
      w.shiftKey && h.value >= 0 || (h.value = T), m.value = T;
    }
    function Ne(w, T) {
      const ne = v.value.length;
      if (ne === 0) return;
      const oe = m.value < 0 ? 0 : m.value;
      let Se = Math.max(0, Math.min(ne - 1, oe + w));
      m.value = Se, (!T || h.value < 0) && (h.value = Se), f.value = Se;
      const He = nt + Se * pe, De = He + pe;
      He < c.value ? x(He) : De > c.value + d.value && x(De - d.value);
    }
    function it() {
      const w = Math.min(h.value, m.value), T = Math.max(h.value, m.value);
      if (w < 0) return "";
      const ne = v.value, oe = /* @__PURE__ */ new Set(), Se = [];
      for (let He = w; He <= T && He < ne.length; He++) {
        const De = ne[He];
        if (oe.has(De.entryIdx)) continue;
        oe.add(De.entryIdx);
        let Qe = "";
        for (let Me = 0; Me < ne.length; Me++)
          ne[Me].entryIdx === De.entryIdx && (Qe += (Qe && !ne[Me].isFirstFrag ? " " : "") + ne[Me].text);
        Se.push(De.timestamp ? `${De.timestamp}  ${Qe}` : Qe);
      }
      return Se.join(`
`);
    }
    async function We() {
      const w = it();
      if (w)
        try {
          await navigator.clipboard.writeText(w);
        } catch {
          const T = document.createElement("textarea");
          T.value = w, T.style.position = "fixed", T.style.opacity = "0", document.body.appendChild(T), T.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(T);
        }
    }
    function ke(w) {
      if ((w.metaKey || w.ctrlKey) && (w.key === "c" || w.key === "C")) {
        h.value >= 0 && (w.preventDefault(), We());
        return;
      }
      if ((w.metaKey || w.ctrlKey) && (w.key === "a" || w.key === "A")) {
        w.preventDefault(), h.value = 0, m.value = v.value.length - 1;
        return;
      }
      switch (w.key) {
        case "ArrowDown":
          w.preventDefault(), Ne(1, w.shiftKey);
          break;
        case "ArrowUp":
          w.preventDefault(), Ne(-1, w.shiftKey);
          break;
        case "ArrowRight":
          w.preventDefault(), E(b.value + pe * 2);
          break;
        case "ArrowLeft":
          w.preventDefault(), E(b.value - pe * 2);
          break;
        case "PageDown":
          w.preventDefault(), x(c.value + d.value);
          break;
        case "PageUp":
          w.preventDefault(), x(c.value - d.value);
          break;
        case "Home":
          w.preventDefault(), x(0), E(0);
          break;
        case "End":
          w.preventDefault(), x(D.value);
          break;
        case "Escape":
          h.value = -1, m.value = -1;
          break;
      }
    }
    function Pe(w) {
      if (e.magnify && a.value) {
        const ne = an(w, a.value);
        r.x = ne.x, r.y = ne.y, le();
      }
      const [, T] = W(w);
      if (T < 0) {
        f.value = -1;
        return;
      }
      f.value = Cn(T, c.value, v.value.length);
    }
    function Ue() {
      f.value = -1, r.x = Te.x, r.y = Te.y, le();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = D.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(w) {
        x(nt + w * pe);
      }
    });
    let Re = null, Ee = null, ze = 0;
    const Yt = Bt("cathodeResetTick", P(0));
    N(Yt, () => Ve());
    function Ve() {
      cancelAnimationFrame(ze), ze = requestAnimationFrame(re);
    }
    function dt(w) {
      w.preventDefault();
    }
    function Mt() {
      L == null || L.dispose(), L = null, Y = !1, me();
    }
    Ze(() => {
      document.addEventListener("mousemove", Ce), document.addEventListener("mouseup", Ie), _e(() => {
        var w;
        me(), a.value && (a.value.addEventListener("webglcontextlost", dt), a.value.addEventListener("webglcontextrestored", Mt)), l.value && (Re = new ResizeObserver(() => re()), Re.observe(l.value), Ee = new IntersectionObserver((T) => {
          T.some((ne) => ne.isIntersecting) && Ve();
        }), Ee.observe(l.value)), window.addEventListener("resize", Ve), (w = window.visualViewport) == null || w.addEventListener("resize", Ve), c.value = D.value;
      });
    }), ot(() => {
      var w, T, ne;
      document.removeEventListener("mousemove", Ce), document.removeEventListener("mouseup", Ie), (w = a.value) == null || w.removeEventListener("webglcontextlost", dt), (T = a.value) == null || T.removeEventListener("webglcontextrestored", Mt), Re == null || Re.disconnect(), Ee == null || Ee.disconnect(), window.removeEventListener("resize", Ve), (ne = window.visualViewport) == null || ne.removeEventListener("resize", Ve), cancelAnimationFrame(ze), G();
    });
    const Wt = ee(() => Dt[e.theme] ?? Dt.none), St = ee(() => ({
      background: Wt.value.bg
    }));
    return (w, T) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ge(St.value),
      tabindex: "0",
      onKeydown: ke
    }, [
      ce("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: tt(_, ["prevent"]),
        onMousemove: Pe,
        onMouseleave: Ue,
        onMousedown: Z,
        onClick: Le,
        onTouchstartPassive: A,
        onTouchmove: O,
        onTouchend: J,
        onTouchcancel: J
      }, null, 544)
    ], 36));
  }
}), Dl = /* @__PURE__ */ at(El, [["__scopeId", "data-v-d6dc9e79"]]), Al = ["disabled"], Fl = /* @__PURE__ */ lt({
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
    const l = t, a = e, r = P(null), i = P(null), d = P(""), c = P([]), f = P(-1);
    let u = "";
    function h(R) {
      R.trim() && (c.value.length && c.value[c.value.length - 1] === R || (c.value.push(R), c.value.length > l.historyLimit && c.value.splice(0, c.value.length - l.historyLimit)));
    }
    function m(R) {
      if (!l.disabled) {
        if (R.key === "Enter") {
          R.preventDefault();
          const b = d.value;
          b.trim() && h(b), f.value = -1, d.value = "", a("submit", b);
          return;
        }
        if (R.key === "ArrowUp") {
          if (!c.value.length) return;
          R.preventDefault(), f.value === -1 ? (u = d.value, f.value = c.value.length - 1) : f.value > 0 && f.value--, d.value = c.value[f.value];
          return;
        }
        if (R.key === "ArrowDown") {
          if (f.value === -1) return;
          R.preventDefault(), f.value < c.value.length - 1 ? (f.value++, d.value = c.value[f.value]) : (f.value = -1, d.value = u, u = "");
          return;
        }
      }
    }
    const C = P(!0);
    let p = null;
    function S() {
      p || (p = setInterval(() => {
        C.value = !C.value;
      }, 530));
    }
    function v() {
      p && (clearInterval(p), p = null), C.value = !0;
    }
    const g = ee(() => {
      let R;
      return l.disabled ? R = " " : l.busy ? R = "█" : R = C.value ? "█" : " ", { level: "info", text: `${l.prompt}${d.value}${R}` };
    }), M = ee(
      () => [...l.entries, g.value]
    );
    function D() {
      var R;
      l.disabled || (R = i.value) == null || R.focus();
    }
    N(() => l.busy, (R, b) => {
      b && !R && !l.disabled && _e(() => {
        var L;
        return (L = i.value) == null ? void 0 : L.focus();
      });
    });
    function $() {
      var R;
      (R = i.value) == null || R.focus();
    }
    return n({ focus: $ }), Ze(() => {
      S(), l.disabled || requestAnimationFrame(() => {
        var R;
        return (R = i.value) == null ? void 0 : R.focus();
      });
    }), ot(() => {
      v();
    }), (R, b) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: D
    }, [
      Rn(Dl, {
        entries: M.value,
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
      En(ce("input", {
        ref_key: "inputEl",
        ref: i,
        "onUpdate:modelValue": b[0] || (b[0] = (L) => d.value = L),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: m
      }, null, 40, Al), [
        [Zn, d.value]
      ])
    ], 512));
  }
}), Ao = /* @__PURE__ */ at(Fl, [["__scopeId", "data-v-a2b39934"]]), At = {
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
}, _l = 0.18, yt = 8, sn = 22, Bl = 4, Ye = 8, qe = 56, cn = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Yl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Ut = 4, Wl = 1, Pl = 1;
function zl(t, n, e, l = 0, a = !1) {
  const r = a ? cn : qe, i = Math.max(0, n - Ye - r), d = Math.max(1, Math.floor(i / e)), c = Math.min(d, t);
  return { firstIdx: Math.max(0, t - c - Math.floor(l / e)), count: c, slotW: e };
}
function Hl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, r = 0;
  const i = Math.min(t.length, n + e);
  for (let c = n; c < i; c++) {
    const f = t[c];
    f && (f.low < l && (l = f.low), f.high > a && (a = f.high), f.volume > r && (r = f.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const c = isFinite(l) ? l : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, r) };
  }
  const d = (a - l) * 0.04;
  return { min: l - d, max: a + d, maxVol: Math.max(1, r) };
}
function Ol(t, n, e = !1) {
  const l = e ? Bl : sn, a = Math.max(1, t - yt - l - Ut), r = Math.max(0, Math.round(a * n)), i = a - r;
  return {
    priceY0: yt,
    priceY1: yt + i,
    volumeY0: yt + i + Ut,
    volumeY1: yt + i + Ut + r
  };
}
function Be(t, n, e, l) {
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
function un(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${r}`;
}
function Nl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * l;
}
function kn(t, n) {
  var C, p, S, v, g;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = At[n.theme] ?? At.none, i = n.colors ? { ...r, ...n.colors } : r, d = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = i.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const c = zl(n.candles.length, l, n.slotW, n.scrollX, d), f = Hl(n.candles, c.firstIdx, c.count), u = Ol(a, n.showVolume ? n.volumeFraction : 0, d), h = Math.max(Wl, Math.floor(n.slotW * 0.7)), m = Math.min(n.candles.length, c.firstIdx + c.count);
  for (let M = c.firstIdx; M < m; M++) {
    const D = n.candles[M];
    if (!D) continue;
    const $ = Je(M, c.firstIdx, n.slotW), R = Be(D.open, f, u.priceY0, u.priceY1), b = Be(D.close, f, u.priceY0, u.priceY1), L = Be(D.high, f, u.priceY0, u.priceY1), Y = Be(D.low, f, u.priceY0, u.priceY1), G = D.close >= D.open, ie = G ? i.wickBull : i.wickBear, q = G ? i.candleBull : i.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = ie, e.lineWidth = Pl, e.beginPath(), e.moveTo(Math.round($) + 0.5, L), e.lineTo(Math.round($) + 0.5, Y), e.stroke(), e.fillStyle = q;
    const j = Math.min(R, b), z = Math.max(1, Math.abs(b - R)), H = Math.round($ - h / 2), ae = Math.round(j), me = Math.round(z);
    if (e.fillRect(H, ae, h, me), n.glow && (e.shadowBlur = 4, e.fillRect(H, ae, h, me)), e.shadowBlur = 0, n.showVolume && f.maxVol > 0) {
      const re = Math.round(D.volume / f.maxVol * (u.volumeY1 - u.volumeY0));
      re > 0 && (e.fillStyle = G ? i.volumeBull : i.volumeBear, e.fillRect(
        Math.round($ - h / 2),
        u.volumeY1 - re,
        h,
        re
      ));
    }
  }
  if ((C = n.overlays) != null && C.length) {
    const M = { above: 0, below: 0 }, D = n.overlays.filter((R) => R.kind !== "hline" && !!R.label).length, $ = D ? 14 + 14 * D + 12 : 8;
    for (const R of n.overlays)
      R.kind === "hline" ? $l(e, R, l, f, u, i, d, M, $) : Vl(e, R, c, f, u, n.slotW);
  }
  (p = n.markers) != null && p.length && Jl(e, i, n.markers, n.candles, c, f, u, n.slotW), Ql(e, i, f, u, l, d), d || (eo(e, i, n.candles, c, n.slotW, a), ql(e, i, n.candles, l, a)), (S = n.overlays) != null && S.length && Ul(e, i, n.overlays, u), n.hover && (to(e, i, n.candles, c, f, u, n.slotW, n.hover, l), Kl(e, i, n.candles, c, n.slotW, n.hover, u, ((v = n.overlays) == null ? void 0 : v.length) ?? 0), (g = n.markers) != null && g.length && jl(e, i, n.markers, n.candles, c, f, u, n.slotW, n.hover, l)), e.restore();
}
function Vl(t, n, e, l, a, r) {
  var d;
  const i = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    It(t, n.data, e.firstIdx, i, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const c = Bn(n.color, n.fillAlpha ?? 0.08);
    Xl(t, n.upper, n.lower, e.firstIdx, i, r, l, a, c), It(t, n.upper, e.firstIdx, i, r, l, a, n.color, 1, !1), It(t, n.lower, e.firstIdx, i, r, l, a, n.color, 1, !1), (d = n.middle) != null && d.length && It(t, n.middle, e.firstIdx, i, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function $l(t, n, e, l, a, r, i, d = { above: 0, below: 0 }, c = 8) {
  const f = Be(n.price, l, a.priceY0, a.priceY1), u = f < a.priceY0 - 0.5, h = f > a.priceY1 + 0.5, m = u || h, C = m ? u ? d.above++ : d.below++ : 0, p = m ? u ? a.priceY0 + c + C * 20 : a.priceY1 - 8 - C * 20 : f, S = i ? cn : qe, v = Math.round(p) + 0.5;
  t.save(), m || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, v), t.lineTo(e - S, v), t.stroke(), t.setLineDash([]));
  let g = n.label ?? je(n.price);
  if (m && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(g).width, D = 4, $ = 2, R = Ye + 2;
    t.fillStyle = n.color, m && (t.globalAlpha = 0.85), t.fillRect(R, p - 7 - $, M + D * 2, 14 + $ * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(g, R + D, p);
  }
  t.restore();
}
function It(t, n, e, l, a, r, i, d, c, f) {
  if (!n || !n.length) return;
  t.strokeStyle = d, t.lineWidth = c, t.setLineDash(f ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < l; h++) {
    const m = n[h];
    if (typeof m != "number" || !isFinite(m)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const C = Je(h, e, a), p = Be(m, r, i.priceY0, i.priceY1);
    u ? t.lineTo(C, p) : (t.moveTo(C, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function Xl(t, n, e, l, a, r, i, d, c) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = c;
  let f = !1, u = -1;
  for (let h = l; h <= a; h++) {
    const m = n[h], C = e[h], p = h < a && typeof m == "number" && typeof C == "number" && isFinite(m) && isFinite(C);
    if (p && !f && (u = h, f = !0), !p && f || h === a && f) {
      const S = p ? h + 1 : h;
      t.beginPath();
      for (let v = u; v < S; v++) {
        const g = Je(v, l, r), M = Be(n[v], i, d.priceY0, d.priceY1);
        v === u ? t.moveTo(g, M) : t.lineTo(g, M);
      }
      for (let v = S - 1; v >= u; v--) {
        const g = Je(v, l, r), M = Be(e[v], i, d.priceY0, d.priceY1);
        t.lineTo(g, M);
      }
      t.closePath(), t.fill(), f = !1;
    }
  }
}
function Bn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Ul(t, n, e, l) {
  const a = e.filter((S) => S.kind !== "hline" && !!S.label);
  if (!a.length) return;
  t.save(), t.font = Xe;
  const r = 8, i = 5, d = 12, c = 6, f = 14;
  let u = 0;
  for (const S of a) {
    const v = t.measureText(S.label).width;
    v > u && (u = v);
  }
  const h = r * 2 + d + c + u, m = i * 2 + f * a.length, C = Ye + 4, p = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(C, p, h, m), t.textBaseline = "middle", t.textAlign = "left";
  for (let S = 0; S < a.length; S++) {
    const v = a[S], g = p + i + f * (S + 0.5), M = C + r;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(M, g), t.lineTo(M + d, g), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = Bn(v.color, v.fillAlpha ?? 0.2), t.fillRect(M, g - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(M + 0.5, g - 4 + 0.5, d - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, M + d + c, g);
  }
  t.restore();
}
function Kl(t, n, e, l, a, r, i, d) {
  const c = Math.floor((r.x - Ye) / a), f = l.firstIdx + c;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const h = u.close - u.open, m = u.open !== 0 ? h / u.open * 100 : 0, C = h >= 0 ? "+" : "", p = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", Gl(u.volume), void 0],
    ["", `${C}${m.toFixed(2)}%`, h >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const S = 8, v = 4, g = 14;
  let M = S;
  for (const [b, L] of p) {
    const Y = b ? `${b} ${L}` : L, G = t.measureText(Y).width + 12;
    M += G;
  }
  M += S - 12;
  const D = i.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), $ = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect($, D, M, g + v * 2);
  let R = $ + S;
  for (let b = 0; b < p.length; b++) {
    const [L, Y, G] = p[b];
    t.fillStyle = n.text, L && (t.globalAlpha = 0.6, t.fillText(L + " ", R, D + v + g / 2), t.globalAlpha = 1, R += t.measureText(L + " ").width), G && (t.fillStyle = G), t.fillText(Y, R, D + v + g / 2), R += t.measureText(Y).width + 12;
  }
  t.restore();
}
function Gl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function jl(t, n, e, l, a, r, i, d, c, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, h = Math.max(1, u * 0.5), m = Math.min(l.length, a.firstIdx + a.count), C = 9;
  let p = null;
  for (const Y of e) {
    let G = 0, ie = l.length - 1, q = -1;
    for (; G <= ie; ) {
      const H = G + ie >> 1, ae = l[H].start - Y.timestamp;
      if (Math.abs(ae) <= h) {
        q = H;
        break;
      }
      ae < 0 ? G = H + 1 : ie = H - 1;
    }
    if (q < 0 || q < a.firstIdx || q >= m) continue;
    const j = Je(q, a.firstIdx, d), z = Be(Y.price, r, i.priceY0, i.priceY1);
    if (Math.abs(c.x - j) <= C && Math.abs(c.y - z) <= C) {
      p = { m: Y, x: j, y: z };
      break;
    }
  }
  if (!p) return;
  const S = un(p.m.timestamp), v = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${S}`,
    `@ ${je(p.m.price)}`
  ];
  p.m.label && v.push(p.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, M = 14;
  let D = 0;
  for (const Y of v) {
    const G = t.measureText(Y).width;
    G > D && (D = G);
  }
  const $ = D + g * 2, R = v.length * M + g * 2;
  let b = p.x + 12;
  b + $ > f - qe && (b = p.x - 12 - $);
  let L = p.y - R / 2;
  L < i.priceY0 && (L = i.priceY0), L + R > i.priceY1 && (L = i.priceY1 - R), t.fillStyle = n.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(b, L, $, R), t.strokeRect(b + 0.5, L + 0.5, $ - 1, R - 1);
  for (let Y = 0; Y < v.length; Y++) {
    const G = v[Y];
    t.fillStyle = Y === 0 ? p.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(G, b + g, L + g + Y * M);
  }
  t.restore();
}
function ql(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, i = Zl(r);
  if (!i) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, c = 3, f = t.measureText(i).width, u = l - qe - d, h = a - sn + 4;
  t.fillStyle = n.accent, t.fillRect(u - f - d, h - c, f + d * 2, 14 + c * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(i, u, h), t.restore();
}
function Zl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function Jl(t, n, e, l, a, r, i, d) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, c * 0.5), u = Math.min(l.length, a.firstIdx + a.count), h = (C) => {
    let p = 0, S = l.length - 1;
    for (; p <= S; ) {
      const v = p + S >> 1, g = l[v].start - C;
      if (Math.abs(g) <= f) return v;
      g < 0 ? p = v + 1 : S = v - 1;
    }
    return -1;
  }, m = 7;
  for (const C of e) {
    const p = h(C.timestamp);
    if (p < 0 || p < a.firstIdx || p >= u) continue;
    const S = Je(p, a.firstIdx, d), v = Be(C.price, r, i.priceY0, i.priceY1);
    if (v < i.priceY0 || v > i.priceY1) continue;
    const g = C.color ?? (C.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), C.kind === "entry" ? (t.moveTo(S, v - m), t.lineTo(S - m, v + m - 1), t.lineTo(S + m, v + m - 1)) : (t.moveTo(S, v + m), t.lineTo(S - m, v - m + 1), t.lineTo(S + m, v - m + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Ql(t, n, e, l, a, r = !1) {
  const i = e.max - e.min;
  if (i <= 0) return;
  const d = l.priceY1 - l.priceY0, c = r ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, f = Nl(i, c), u = Math.ceil(e.min / f) * f, h = r ? cn : qe;
  t.font = r ? Yl : Xe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let m = u; m <= e.max; m += f) {
    const C = Be(m, e, l.priceY0, l.priceY1);
    C < l.priceY0 || C > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(C) + 0.5), t.lineTo(a - h, Math.round(C) + 0.5), t.stroke(), t.fillText(je(m), a - h + 3, C));
  }
  t.globalAlpha = 1;
}
function eo(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(l.count / 6));
  t.font = Xe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const c = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < c; f += d) {
    const u = e[f];
    if (!u) continue;
    const h = Je(f, l.firstIdx, a);
    t.fillText(un(u.start), h, r - sn + 4);
  }
  t.globalAlpha = 1;
}
function to(t, n, e, l, a, r, i, d, c) {
  const f = Math.floor((d.x - Ye) / i), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), h = e[u];
  if (!h) return;
  const m = Je(u, l.firstIdx, i);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(m) + 0.5, r.priceY0), t.lineTo(Math.round(m) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const C = Math.max(r.priceY0, Math.min(r.priceY1, d.y));
  t.beginPath(), t.moveTo(Ye, Math.round(C) + 0.5), t.lineTo(c - qe, Math.round(C) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = a.max - a.min;
  if (p > 0) {
    const g = a.max - (C - r.priceY0) / (r.priceY1 - r.priceY0) * p, M = je(g);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const D = t.measureText(M).width, $ = 4, R = 2;
    t.fillStyle = n.accent, t.fillRect(c - qe + 2, C - 7 - R, D + $ * 2, 14 + R * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(M, c - qe + 2 + $, C);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const S = un(h.start), v = t.measureText(S).width;
  t.fillStyle = n.accent, t.fillRect(m - v / 2 - 4, r.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(S, m, r.volumeY1 + 4), t.restore();
}
const Kt = 0.25, Gt = 6, no = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, lo = /* @__PURE__ */ lt({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: _l },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = P(null), l = P(null), a = { ...Te }, r = P(0), i = P(0), d = P(0), c = P(1), f = P(null), u = ee(() => Math.max(1, n.slotW * c.value));
    let h = null, m = !1;
    function C() {
      if (h) {
        try {
          h.forceContextLoss();
        } catch {
        }
        try {
          h.dispose();
        } catch {
        }
        h = null;
      }
    }
    let p, S, v, g, M;
    const D = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${en}

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

  ${tn}

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

    ${nn}

    gl_FragColor = color;
  }
`;
    function $() {
      if (!(!l.value || !e.value)) {
        if (M = document.createElement("canvas"), n.flat) {
          m = !0, R();
          return;
        }
        try {
          h = new V.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !h.getContext() && (h.dispose(), h = null, m = !0), m) {
          R();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), p = new V.Scene(), S = new V.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new V.CanvasTexture(M), g.minFilter = V.LinearFilter, g.magFilter = V.LinearFilter, v = new V.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...ln()
          },
          vertexShader: no,
          fragmentShader: D,
          transparent: !0
        }), p.add(new V.Mesh(new V.PlaneGeometry(2, 2), v)), R();
      }
    }
    function R() {
      if (!e.value || !h && !m) return;
      const A = e.value.clientWidth, O = e.value.clientHeight;
      !A || !O || !(M.width !== A || M.height !== O) || (M.width = A, M.height = O, r.value = A, i.value = O, h ? (g && (g.dispose(), g = new V.CanvasTexture(M), g.minFilter = V.LinearFilter, g.magFilter = V.LinearFilter, v && (v.uniforms.uTex.value = g)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(A, O)) : l.value && (l.value.width = A, l.value.height = O, l.value.style.width = A + "px", l.value.style.height = O + "px"), b());
    }
    function b() {
      if (!(M != null && M.width)) return;
      if (m) {
        if (!l.value) return;
        kn(M, {
          candles: n.candles,
          slotW: u.value,
          scrollX: d.value,
          theme: n.theme,
          glow: !1,
          showVolume: n.showVolume,
          volumeFraction: n.volumeFraction,
          hover: f.value,
          overlays: n.overlays,
          markers: n.markers,
          compact: n.compact,
          colors: n.colors
        });
        const O = l.value.getContext("2d");
        O && (O.clearRect(0, 0, l.value.width, l.value.height), O.drawImage(M, 0, 0));
        return;
      }
      if (!h || !v || !g) return;
      const A = n.theme === "paper";
      v.uniforms.uStrength.value = xt(n.curvature), v.uniforms.uScanlines.value = n.scanlines && !A ? 1 : 0, v.uniforms.uVignette.value = A ? 0 : 1, on(v, n.magnify, a, M.width, M.height), kn(M, {
        candles: n.candles,
        slotW: u.value,
        scrollX: d.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: f.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), g.needsUpdate = !0, h.render(p, S);
    }
    N(() => n.theme, () => b()), N(() => n.curvature, () => b()), N(() => n.scanlines, () => b()), N(() => n.glow, () => b()), N(() => n.showVolume, () => b()), N(() => n.volumeFraction, () => b()), N(() => n.slotW, () => b()), N(() => n.candles, () => b(), { deep: !1 }), N(() => n.overlays, () => b(), { deep: !1 }), N(() => n.markers, () => b(), { deep: !1 }), N(() => n.compact, () => b()), N(() => n.magnify, (A) => {
      A || (a.x = Te.x, a.y = Te.y), b();
    }), N(() => n.colors, () => b(), { deep: !0 }), N(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), N(d, () => b()), N(c, () => b()), N(f, () => b()), N(u, () => b());
    let L = null, Y = null, G = 0;
    const ie = Bt("cathodeResetTick", P(0));
    N(ie, () => q());
    function q() {
      cancelAnimationFrame(G), G = requestAnimationFrame(R);
    }
    function j(A) {
      A.preventDefault();
    }
    function z() {
      h == null || h.dispose(), h = null, m = !1, $();
    }
    function H(A) {
      if (!l.value) return [-1, -1];
      const O = l.value.getBoundingClientRect();
      return [A.clientX - O.left, A.clientY - O.top];
    }
    function ae(A) {
      var Ne;
      const O = u.value;
      if (O <= 0) return 0;
      const J = ((Ne = n.candles) == null ? void 0 : Ne.length) ?? 0, xe = Math.max(1, Math.floor((r.value || 1) / O)), Le = Math.max(0, J - xe);
      return Math.max(0, Math.min(A, Le * O));
    }
    function me(A) {
      var xe;
      if (A.deltaX !== 0 || A.shiftKey && A.deltaY !== 0) {
        const Le = A.deltaX !== 0 ? A.deltaX : A.deltaY;
        d.value = ae(d.value + Le);
        return;
      }
      if (A.deltaY === 0) return;
      const [O] = H(A), J = u.value;
      if (O >= 0 && J > 0 && ((xe = n.candles) != null && xe.length)) {
        const Le = Math.max(1, Math.floor((r.value || 1) / J)), it = Math.max(0, n.candles.length - Le - Math.floor(d.value / J)) + (O - 8) / J, We = Math.exp(-A.deltaY * 15e-4), ke = Math.max(Kt, Math.min(Gt, c.value * We));
        c.value = ke;
        const Pe = n.slotW * ke, Ue = Math.max(1, Math.floor((r.value || 1) / Pe)), Re = it - (O - 8) / Pe, Ee = Math.max(0, n.candles.length - Ue - Re);
        d.value = ae(Ee * Pe);
      } else {
        const Le = Math.exp(-A.deltaY * 15e-4);
        c.value = Math.max(Kt, Math.min(Gt, c.value * Le));
      }
    }
    let re = !1, le = 0, W = 0;
    function x(A) {
      A.button === 0 && (re = !0, le = A.clientX, W = d.value, f.value = null, e.value && e.value.focus());
    }
    function E(A) {
      const O = Math.exp(A * 0.18);
      c.value = Math.max(Kt, Math.min(Gt, c.value * O)), d.value = ae(d.value);
    }
    function _(A) {
      const O = u.value, J = A.shiftKey ? 20 : 3;
      switch (A.key) {
        case "ArrowLeft":
          A.preventDefault(), d.value = ae(d.value + O * J);
          break;
        case "ArrowRight":
          A.preventDefault(), d.value = ae(d.value - O * J);
          break;
        case "ArrowUp":
          A.preventDefault(), E(1);
          break;
        case "ArrowDown":
          A.preventDefault(), E(-1);
          break;
        case "Home":
          A.preventDefault(), d.value = ae(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          A.preventDefault(), d.value = 0;
          break;
      }
    }
    function U(A) {
      if (re) {
        const O = A.clientX - le;
        d.value = ae(W + O);
        return;
      }
    }
    function K() {
      re = !1;
    }
    function te(A) {
      if (A.touches.length !== 1) return;
      const O = A.touches[0];
      re = !0, le = O.clientX, W = d.value, f.value = null;
    }
    function X(A) {
      if (!re || A.touches.length !== 1) return;
      A.preventDefault();
      const J = A.touches[0].clientX - le;
      d.value = ae(W + J);
    }
    function ue() {
      re = !1;
    }
    function fe(A) {
      if (n.magnify && l.value) {
        const xe = an(A, l.value);
        a.x = xe.x, a.y = xe.y, b();
      }
      if (re) return;
      const [O, J] = H(A);
      if (O < 0 || J < 0) {
        f.value = null;
        return;
      }
      f.value = { x: O, y: J };
    }
    function Z() {
      f.value = null, a.x = Te.x, a.y = Te.y, b();
    }
    Ze(() => {
      document.addEventListener("mousemove", U), document.addEventListener("mouseup", K), _e(() => {
        var A;
        $(), l.value && (l.value.addEventListener("webglcontextlost", j), l.value.addEventListener("webglcontextrestored", z)), e.value && (L = new ResizeObserver(() => R()), L.observe(e.value), Y = new IntersectionObserver((O) => {
          O.some((J) => J.isIntersecting) && q();
        }), Y.observe(e.value)), window.addEventListener("resize", q), (A = window.visualViewport) == null || A.addEventListener("resize", q);
      });
    }), ot(() => {
      var A, O, J;
      document.removeEventListener("mousemove", U), document.removeEventListener("mouseup", K), (A = l.value) == null || A.removeEventListener("webglcontextlost", j), (O = l.value) == null || O.removeEventListener("webglcontextrestored", z), L == null || L.disconnect(), Y == null || Y.disconnect(), window.removeEventListener("resize", q), (J = window.visualViewport) == null || J.removeEventListener("resize", q), cancelAnimationFrame(G), C();
    });
    const Ce = ee(() => At[n.theme] ?? At.none), Ie = ee(() => ({
      background: Ce.value.bg
    }));
    return (A, O) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ge(Ie.value),
      tabindex: "0",
      onKeydown: _
    }, [
      ce("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: tt(me, ["prevent"]),
        onMousedown: x,
        onMousemove: fe,
        onMouseleave: Z,
        onTouchstartPassive: te,
        onTouchmove: X,
        onTouchend: ue,
        onTouchcancel: ue
      }, null, 544)
    ], 36));
  }
}), Fo = /* @__PURE__ */ at(lo, [["__scopeId", "data-v-7c334778"]]), fn = P(0), Zt = 28, ft = 12;
let Jt = 10, Ft = "cathode.layout", _t = !1;
const be = P({});
function oo(t, n = "cathode.layout") {
  if (!_t) {
    _t = !0, Ft = n;
    try {
      const e = localStorage.getItem(Ft);
      if (e) {
        be.value = JSON.parse(e), In();
        return;
      }
    } catch {
    }
    be.value = { ...t }, In();
  }
}
function In() {
  let t = 10;
  for (const n of Object.values(be.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  Jt = t;
}
function rt() {
  localStorage.setItem(Ft, JSON.stringify(be.value));
}
function ao(t) {
  _t = !1, localStorage.removeItem(Ft), be.value = { ...t }, rt(), _t = !0, fn.value++;
}
function Yn(t) {
  Jt++, be.value[t] && (be.value[t].zIndex = Jt);
}
function ro(t, n) {
  be.value[t].visible = n, rt();
}
function io(t, n) {
  be.value[t].minimized = n, n && (be.value[t].maximized = !1), rt();
}
function so(t, n) {
  be.value[t].maximized = n, n && (be.value[t].minimized = !1, Yn(t)), rt();
}
function co(t, n, e) {
  be.value[t].x = Math.round(n), be.value[t].y = Math.round(e), rt();
}
function uo(t, n, e) {
  be.value[t].w = Math.round(n), be.value[t].h = Math.round(e), rt();
}
function _o(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - ft * (l + 1)) / l), i = Math.floor((n - ft * (a + 1)) / a), d = {};
  return e.forEach((c, f) => {
    const u = f % l, h = Math.floor(f / l);
    d[c] = {
      x: ft + u * (r + ft),
      y: ft + h * (i + ft),
      w: r,
      h: i,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: f + 1
    };
  }), d;
}
function Wn() {
  return {
    containers: be,
    TITLEBAR_H: Zt,
    load: oo,
    save: rt,
    reset: ao,
    bringToFront: Yn,
    setVisible: ro,
    setMinimized: io,
    setMaximized: so,
    updatePos: co,
    updateSize: uo
  };
}
const fo = { class: "ws-toolbar" }, vo = {
  key: 0,
  class: "ws-restore-menu"
}, ho = {
  key: 0,
  class: "ws-restore-empty"
}, mo = ["onClick"], go = /* @__PURE__ */ lt({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = Wn(), i = P(null);
    bn("cathodeWorkspace", i), bn("cathodeResetTick", fn), Ze(() => {
      if (!i.value) return;
      const { clientWidth: v, clientHeight: g } = i.value, M = n.initialLayout ?? {};
      l(M, n.storageKey ?? "cathode.layout");
      const D = Object.keys(e.value)[0];
      D && d(D);
    });
    function d(v) {
      var M;
      document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused"));
      const g = (M = i.value) == null ? void 0 : M.querySelector(`#cc-${v}`);
      g && g.classList.add("cc-focused");
    }
    function c() {
      !i.value || !n.initialLayout || a(n.initialLayout);
    }
    function f(v) {
      const g = v.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = P(!1), h = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function m(v) {
      r(v, !0), u.value = !1;
    }
    function C(v) {
      if (!u.value) return;
      const g = v.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function p(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Ze(() => {
      document.addEventListener("click", C), document.addEventListener("keydown", p);
    }), ot(() => {
      document.removeEventListener("click", C), document.removeEventListener("keydown", p);
    });
    function S(v) {
      var g;
      return ((g = n.containerTitles) == null ? void 0 : g[v]) ?? v;
    }
    return (v, g) => (we(), ye("div", {
      ref_key: "workspaceEl",
      ref: i,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      jt(v.$slots, "default", {}, void 0, !0),
      jt(v.$slots, "overlay", {}, void 0, !0),
      ce("div", fo, [
        t.initialLayout ? (we(), ye("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : $e("", !0),
        g[1] || (g[1] = ce("div", { class: "ws-sep" }, null, -1)),
        ce("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (M) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Rn(Jn, { name: "menu" }, {
        default: Qn(() => [
          u.value ? (we(), ye("div", vo, [
            g[3] || (g[3] = ce("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? $e("", !0) : (we(), ye("div", ho, " No closed panels ")),
            (we(!0), ye(el, null, tl(h(), (M) => (we(), ye("div", {
              key: M,
              class: "ws-restore-item",
              onClick: (D) => m(M)
            }, [
              g[2] || (g[2] = ce("span", { class: "ws-restore-icon" }, "⊞", -1)),
              nl(" " + Oe(S(M)), 1)
            ], 8, mo))), 128))
          ])) : $e("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Bo = /* @__PURE__ */ at(go, [["__scopeId", "data-v-5838d04b"]]), po = ["id"], wo = { class: "cc-title" }, yo = {
  key: 0,
  class: "cc-size-badge"
}, bo = { class: "cc-controls" }, xo = ["title"], Mo = { class: "cc-body" }, So = 200, To = 80, Ln = 60, Co = /* @__PURE__ */ lt({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: i, updatePos: d, updateSize: c } = Wn(), f = Bt("cathodeWorkspace", P(null)), u = ee(() => e.value[n.id]), h = ee(() => {
      const x = u.value, E = n.curvature ?? 0;
      if (!x) return {};
      const _ = { "--curvature": Math.abs(E) };
      return x.maximized ? { ..._, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: x.zIndex } : {
        ..._,
        left: x.x + "px",
        top: x.y + "px",
        width: x.w + "px",
        height: x.minimized ? Zt + "px" : x.h + "px",
        zIndex: x.zIndex,
        display: x.visible ? "flex" : "none"
      };
    });
    let m = !1, C = 0, p = 0;
    function S(x) {
      var U;
      if (x.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), m = !0;
      const E = (U = f.value) == null ? void 0 : U.querySelector(`#cc-${n.id}`);
      if (!E) return;
      const _ = E.getBoundingClientRect();
      C = x.clientX - _.left, p = x.clientY - _.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), x.preventDefault();
    }
    function v(x) {
      var te;
      if (!m || !f.value) return;
      const E = f.value.getBoundingClientRect(), _ = ((te = u.value) == null ? void 0 : te.w) ?? 300;
      let U = x.clientX - E.left - C, K = x.clientY - E.top - p;
      U = Math.max(Ln - _, Math.min(E.width - Ln, U)), K = Math.max(0, Math.min(E.height - Zt, K)), d(n.id, U, K);
    }
    function g() {
      m = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let M = !1, D = 0, $ = 0, R = 0, b = 0;
    const L = P("");
    function Y(x) {
      u.value.maximized || (l(n.id), M = !0, D = x.clientX, $ = x.clientY, R = u.value.w, b = u.value.h, document.addEventListener("mousemove", G), document.addEventListener("mouseup", ie), x.preventDefault(), x.stopPropagation());
    }
    function G(x) {
      if (!M) return;
      const E = Math.max(So, R + (x.clientX - D)), _ = Math.max(To, b + (x.clientY - $));
      c(n.id, E, _), L.value = `${Math.round(E)}×${Math.round(_)}`;
    }
    function ie() {
      M = !1, L.value = "", document.removeEventListener("mousemove", G), document.removeEventListener("mouseup", ie), q.value++;
    }
    const q = P(0);
    N(fn, () => {
      q.value++;
    }), ot(() => {
      var x;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", G), document.removeEventListener("mouseup", ie), (x = j.value) == null || x.removeEventListener("scroll", H), ae();
    });
    const j = P(null);
    function z(x) {
      if (n.canvas) return [];
      const E = x.children[0];
      return E ? Array.from(E.children) : [];
    }
    function H() {
      const x = j.value, E = n.curvature ?? 0;
      if (!x) return;
      const _ = z(x);
      if (!_.length) return;
      const U = x.clientHeight, K = U / 2, te = E * 38e-4;
      _.forEach((X) => {
        if (!X.dataset.origFs) {
          const xe = getComputedStyle(X);
          X.dataset.origFs = xe.fontSize, X.dataset.origLh = xe.lineHeight;
        }
        if (E === 0) {
          X.style.fontSize = "", X.style.lineHeight = "";
          return;
        }
        const ue = X.getBoundingClientRect(), fe = x.getBoundingClientRect(), Z = ue.top - fe.top + ue.height / 2, Ce = Math.min(1, Math.abs(Z - K) / (U / 2)), Ie = 1 + te * Math.cos(Ce * Math.PI / 2), A = parseFloat(X.dataset.origFs), O = X.dataset.origLh, J = O === "normal" ? A * 1.4 : parseFloat(O);
        isNaN(A) || (X.style.fontSize = `${(A * Ie).toFixed(2)}px`), isNaN(J) || (X.style.lineHeight = `${(J * Ie).toFixed(2)}px`);
      });
    }
    function ae() {
      const x = j.value;
      x && z(x).forEach((E) => {
        E.style.fontSize = "", E.style.lineHeight = "", delete E.dataset.origFs, delete E.dataset.origLh;
      });
    }
    N(() => n.curvature, (x) => {
      (x ?? 0) === 0 ? ae() : H();
    }), Ze(() => {
      var x;
      (x = j.value) == null || x.addEventListener("scroll", H, { passive: !0 }), _e(H);
    });
    function me() {
      r(n.id, !u.value.minimized), _e(() => {
        q.value++;
      });
    }
    function re() {
      i(n.id, !u.value.maximized), _e(() => {
        q.value++;
      });
    }
    function le() {
      a(n.id, !1);
    }
    function W() {
      l(n.id);
    }
    return (x, E) => u.value && u.value.visible ? (we(), ye("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: ll(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ge(h.value),
      onMousedown: W
    }, [
      ce("div", {
        class: "cc-titlebar",
        onMousedown: S
      }, [
        E[0] || (E[0] = ce("span", { class: "cc-status-dot" }, null, -1)),
        ce("span", wo, Oe(t.title), 1),
        L.value ? (we(), ye("span", yo, Oe(L.value), 1)) : $e("", !0),
        ce("div", bo, [
          ce("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: tt(me, ["stop"])
          }, "─"),
          ce("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: tt(re, ["stop"])
          }, Oe(u.value.maximized ? "⤡" : "⤢"), 9, xo),
          ce("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: tt(le, ["stop"])
          }, "✕")
        ])
      ], 32),
      En(ce("div", Mo, [
        ce("div", {
          ref_key: "bodyEl",
          ref: j,
          class: "cc-screen",
          onScroll: H
        }, [
          jt(x.$slots, "default", { resizeKey: q.value }, void 0, !0),
          E[1] || (E[1] = ce("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ol, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (we(), ye("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: tt(Y, ["stop"])
      }, null, 32)) : $e("", !0)
    ], 46, po)) : $e("", !0);
  }
}), Yo = /* @__PURE__ */ at(Co, [["__scopeId", "data-v-ca0af4ca"]]), ko = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Io = `
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
`, Lo = 100, Ro = /* @__PURE__ */ lt({
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
    }, l = P(null), a = P(null);
    let r = null, i = !1;
    function d() {
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
    let c, f, u, h, m, C = null, p = 0;
    function S(b) {
      b - p >= Lo && (M(), p = b), C = requestAnimationFrame(S);
    }
    function v() {
      if (!l.value || !m) return;
      const b = l.value.clientWidth, L = l.value.clientHeight;
      b <= 0 || L <= 0 || m.width === b && m.height === L || (m.width = b, m.height = L, r && r.setSize(b, L, !1), a.value && (a.value.width = b, a.value.height = L, a.value.style.width = b + "px", a.value.style.height = L + "px"));
    }
    function g() {
      if (!(m != null && m.width)) return;
      const b = m.getContext("2d");
      if (!b) return;
      const L = m.width, Y = m.height, G = e[n.theme] ?? e.none;
      b.clearRect(0, 0, L, Y), b.fillStyle = G.bg, b.fillRect(0, 0, L, Y);
      const ie = Date.now(), q = (ie / 500 | 0) % 2 === 0, j = (ie / 400 | 0) % 4;
      b.font = `bold ${Math.max(14, Math.min(L, Y) * 0.06)}px monospace`, b.textAlign = "center", b.textBaseline = "middle", b.fillStyle = G.text, n.glow && (b.shadowColor = G.text, b.shadowBlur = 14);
      const z = ".".repeat(j).padEnd(3, " "), H = `${n.label}${z}`;
      if (b.fillText(H, L / 2, Y / 2), b.shadowBlur = 0, q) {
        const ae = b.measureText(H), me = b.measureText("M").width, re = parseFloat(b.font), le = L / 2 + ae.width / 2 + 4, W = Y / 2 - re / 2 + 2;
        b.fillStyle = G.cursor, n.glow && (b.shadowColor = G.cursor, b.shadowBlur = 12), b.fillRect(le, W, me * 0.7, re * 0.95), b.shadowBlur = 0;
      }
    }
    function M() {
      if (!m) return;
      if (g(), i) {
        if (!a.value) return;
        const L = a.value.getContext("2d");
        L && L.drawImage(m, 0, 0);
        return;
      }
      if (!r || !u || !h) return;
      const b = n.theme === "paper";
      u.uniforms.uStrength.value = xt(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !b ? 1 : 0, u.uniforms.uVignette.value = b ? 0 : 1, h.needsUpdate = !0, r.render(c, f);
    }
    function D() {
      if (!(!a.value || !l.value)) {
        m = document.createElement("canvas");
        try {
          r = new V.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          i = !0;
        }
        if (!i && !r.getContext() && (r.dispose(), r = null, i = !0), i) {
          v();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), c = new V.Scene(), f = new V.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new V.CanvasTexture(m), h.minFilter = V.LinearFilter, h.magFilter = V.LinearFilter, u = new V.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: ko,
          fragmentShader: Io,
          transparent: !0
        }), c.add(new V.Mesh(new V.PlaneGeometry(2, 2), u)), v();
      }
    }
    let $ = null;
    Ze(() => {
      D(), M(), C = requestAnimationFrame(S), l.value && ($ = new ResizeObserver(() => v()), $.observe(l.value));
    }), ot(() => {
      C !== null && cancelAnimationFrame(C), $ == null || $.disconnect(), d(), h == null || h.dispose(), u == null || u.dispose();
    }), N(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => M());
    const R = ee(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (b, L) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ge(R.value)
    }, [
      ce("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Wo = /* @__PURE__ */ at(Ro, [["__scopeId", "data-v-d00e5f47"]]);
export {
  At as CANDLE_THEME_COLORS,
  Fo as CathodeCandle,
  Yo as CathodeContainer,
  Do as CathodeGrid,
  Wo as CathodeLoader,
  Dl as CathodeLog,
  Ao as CathodeTerminal,
  Bo as CathodeWorkspace,
  Dt as LOG_THEME_COLORS,
  _o as buildDefaultLayout,
  Wn as useCathodeLayout
};
