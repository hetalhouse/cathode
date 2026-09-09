import { defineComponent as tt, ref as z, reactive as Ft, computed as q, watch as X, inject as Rt, nextTick as Ve, onMounted as qe, onUnmounted as nt, openBlock as we, createElementBlock as ye, normalizeStyle as _e, createElementVNode as se, withModifiers as Ke, withKeys as Hn, createCommentVNode as He, toDisplayString as Pe, createVNode as gn, withDirectives as pn, vModelText as Vn, provide as rn, renderSlot as Pt, Transition as $n, withCtx as Nn, Fragment as On, renderList as Xn, createTextVNode as Un, normalizeClass as Kn, vShow as Gn } from "vue";
import * as O from "three";
const ut = {
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
}, ge = 30, Ht = 12, jn = 10, St = 14, wn = 5;
function yn() {
  return `${Ht}px system-ui, -apple-system, sans-serif`;
}
function bn(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const r = [];
  let c = "";
  for (const d of a) {
    const i = c ? c + " " + d : d;
    !c || t.measureText(i).width <= e ? c = i : (r.push(c), c = d);
  }
  return c && r.push(c), r.length ? r : [""];
}
function qn(t, n) {
  return Math.max(n, t * St + wn * 2);
}
function Nt(t, n) {
  const e = new Array(n + 1);
  e[0] = 0;
  for (let l = 0; l < n; l++) e[l + 1] = e[l] + (t[l] ?? 0);
  return e;
}
function Tt(t, n) {
  if (n <= 0) return 0;
  let e = 0, l = t.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    t[a] <= n ? e = a : l = a - 1;
  }
  return e;
}
const xn = 28;
function Zn(t, n) {
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
function sn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = ut[n.theme] ?? ut.none, { cols: c, rows: d, pinnedRows: i, rowHeight: f, scrollY: u, scrollX: m, glow: h } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const T = i.length * f, p = n.aggregateRow ? xn : 0, S = a - ge - T - p;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, ge), e.textBaseline = "middle", e.textAlign = "left";
  let v = -m;
  for (let H = 0; H < c.length; H++) {
    const b = c[H];
    if (v + b.width <= 0) {
      v += b.width;
      continue;
    }
    if (v >= l) break;
    const E = !!n.colFilters[b.colId], F = n.sortColId === b.colId, N = (b.colDef.headerName ?? b.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, b.width, ge), e.clip(), e.font = `bold ${jn}px system-ui, -apple-system, sans-serif`, e.fillStyle = E ? r.accent : r.textHeader, h ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(N, v + 8, ge / 2), e.shadowBlur = 4, e.fillText(N, v + 8, ge / 2), e.shadowBlur = 0) : e.fillText(N, v + 8, ge / 2), F) {
      const K = e.measureText(N).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", v + 8 + K + 4, ge / 2);
    }
    b.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = E ? r.accent : r.textHeader, e.globalAlpha = E ? 1 : 0.38, e.fillText("⌕", v + b.width - 20, ge / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + b.width - 0.5, 0), e.lineTo(v + b.width - 0.5, ge), e.stroke(), v += b.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ge - 0.5), e.lineTo(l, ge - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ge, l, S), e.clip();
  const g = n.rowHeights && n.rowHeights.length === d.length ? n.rowHeights : null, M = g ? Nt(g, d.length) : null, A = (H) => M ? M[H] : H * f, U = (H) => g ? g[H] : f, I = M ? Tt(M, u) : Math.max(0, Math.floor(u / f));
  let w;
  if (M)
    for (w = I; w < d.length && A(w) < u + S; ) w++;
  else
    w = Math.min(d.length, Math.ceil((u + S) / f));
  const C = n.selectionAnchorRow ?? n.selectedRow, W = n.selectionAnchorCol ?? n.selectedCol, B = n.selectedRow >= 0 && C >= 0 ? Math.min(n.selectedRow, C) : -1, oe = n.selectedRow >= 0 && C >= 0 ? Math.max(n.selectedRow, C) : -1, ne = n.selectedCol >= 0 && W >= 0 ? Math.min(n.selectedCol, W) : -1, ae = n.selectedCol >= 0 && W >= 0 ? Math.max(n.selectedCol, W) : -1, le = oe > B || ae > ne;
  let $ = Number.POSITIVE_INFINITY, Q = Number.NEGATIVE_INFINITY, me = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY;
  const Z = (H, b, E, F) => {
    h ? (e.shadowColor = F, e.shadowBlur = 12, e.fillText(H, b, E), e.shadowBlur = 6, e.fillText(H, b, E), e.shadowBlur = 2, e.fillText(H, b, E), e.shadowBlur = 0) : e.fillText(H, b, E);
  };
  for (let H = I; H < w; H++) {
    const b = d[H], E = U(H), F = ge + A(H) - u;
    H % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, F, l, E));
    const N = H >= B && H <= oe;
    H === n.hoveredRow && !N && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, F, l, E)), N && !le && (e.fillStyle = _t(r.accent, 0.1), e.fillRect(0, F, l, E)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + E - 0.5), e.lineTo(l, F + E - 0.5), e.stroke();
    let K = -m;
    for (let P = 0; P < c.length; P++) {
      const G = c[P];
      if (K + G.width <= 0) {
        K += G.width;
        continue;
      }
      if (K >= l) break;
      const be = N && P >= ne && P <= ae;
      be && le && (e.fillStyle = _t(r.accent, 0.14), e.fillRect(K, F, G.width, E)), be && (K < $ && ($ = K), K + G.width > Q && (Q = K + G.width), F < me && (me = F), F + E > ee && (ee = F + E));
      const ue = n.getCellStyle(G, b), Le = ue.color ?? r.text, Te = ue.textAlign ?? "left", Ie = n.formatCell(G, b);
      if (e.save(), e.beginPath(), e.rect(K + 1, F, G.width - 2, E), e.clip(), e.font = yn(), e.fillStyle = Le, e.textBaseline = "middle", G.colDef.wrap) {
        e.textAlign = "left";
        const R = bn(e, Ie, Math.max(20, G.width - 16));
        let V = F + wn + St / 2;
        for (const J of R) {
          if (V - St / 2 >= F + E) break;
          Z(J, K + 8, V, Le), V += St;
        }
      } else {
        const R = Te === "right" ? K + G.width - 8 : K + 8;
        e.textAlign = Te === "right" ? "right" : "left", Z(Ie, R, F + E / 2, Le);
      }
      e.restore(), H === n.selectedRow && P === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(K + 1.5, F + 1.5, G.width - 3, E - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(K + G.width - 0.5, F), e.lineTo(K + G.width - 0.5, F + E), e.stroke(), K += G.width;
    }
  }
  if (le && $ < Q && me < ee && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect($ + 0.5, me + 0.5, Q - $ - 1, ee - me - 1)), e.restore(), i.length > 0) {
    const H = a - T - p;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    for (let b = 0; b < i.length; b++) {
      const E = i[b], F = H + b * f;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, F, l, f);
      let N = -m;
      for (let K = 0; K < c.length; K++) {
        const P = c[K];
        if (N + P.width <= 0) {
          N += P.width;
          continue;
        }
        if (N >= l) break;
        const G = n.getCellStyle(P, E), be = G.color ?? r.text, ue = G.textAlign ?? "left", Le = n.formatCell(P, E);
        e.save(), e.beginPath(), e.rect(N + 1, F, P.width - 2, f), e.clip(), e.font = `bold ${Ht}px system-ui, -apple-system, sans-serif`, e.fillStyle = be, e.textBaseline = "middle", ue === "right" ? (e.textAlign = "right", e.fillText(Le, N + P.width - 8, F + f / 2)) : (e.textAlign = "left", e.fillText(Le, N + 8, F + f / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(N + P.width - 0.5, F), e.lineTo(N + P.width - 0.5, F + f), e.stroke(), N += P.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + f - 0.5), e.lineTo(l, F + f - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const H = a - p;
    e.fillStyle = _t(r.accent, 0.1), e.fillRect(0, H, l, p), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    let b = -m;
    for (let E = 0; E < c.length; E++) {
      const F = c[E];
      if (b + F.width <= 0) {
        b += F.width;
        continue;
      }
      if (b >= l) break;
      const K = n.getCellStyle(F, n.aggregateRow).textAlign ?? "left", P = n.aggregateRow[F.colId] ?? "";
      e.save(), e.beginPath(), e.rect(b + 1, H, F.width - 2, p), e.clip(), e.font = `bold ${Ht}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", h && (e.shadowColor = r.accent, e.shadowBlur = 8), K === "right" ? (e.textAlign = "right", e.fillText(P, b + F.width - 8, H + p / 2)) : (e.textAlign = "left", e.fillText(P, b + 8, H + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(b + F.width - 0.5, H), e.lineTo(b + F.width - 0.5, H + p), e.stroke(), b += F.width;
    }
  }
  e.restore();
}
function _t(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
function Jn(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = e >= 0 ? 1 : -1, c = (l * l + a * a) * Math.abs(e);
  let d = l * (1 + c) * c * r, i = a * (1 + c) * c * r;
  if (e < 0) {
    const f = (1 - 4 * l * l) * (1 - 4 * a * a);
    d *= f, i *= f;
  }
  return [t + d, n + i * 0.15];
}
function Qn(t, n, e, l, a) {
  const r = t / e, c = 1 - n / l, [d, i] = Jn(r, c, a);
  return d < 0 || d > 1 || i < 0 || i > 1 ? [-1, -1] : [d * e, (1 - i) * l];
}
function Bt(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function el(t, n, e) {
  return t >= n + e - 24 && t < n + e;
}
function cn(t, n, e) {
  const l = n + e;
  return t >= l - 6 && t <= l + 1;
}
function un(t, n, e, l, a, r, c, d, i, f = !1, u) {
  const m = t + i;
  let h = -1, T = 0;
  for (let M = 0; M < e.length; M++) {
    if (m >= T && m < T + e[M].width) {
      h = M;
      break;
    }
    T += e[M].width;
  }
  if (n < ge) return { area: "header", colIdx: h, rowIdx: -1 };
  const p = f ? xn : 0;
  if (p > 0 && n >= c - p)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const S = d * a;
  if (S > 0 && n >= c - S - p) {
    const M = Math.floor((n - (c - S - p)) / a);
    return { area: "pinned", colIdx: h, rowIdx: M };
  }
  const v = n - ge + r, g = u && u.length === l ? Tt(Nt(u, l), v) : Math.floor(v / a);
  return g >= 0 && g < l ? { area: "body", colIdx: h, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function yt(t) {
  return t / 45 * (t >= 0 ? 0.55 : 1.4);
}
const tl = 500, nl = tl / 2, ll = 1.6, Ot = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Xt = `
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
`, Ut = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Kt() {
  return {
    uMouseUV: { value: new O.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: ll },
    uLensTint: { value: new O.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const ke = { x: -999, y: -999 };
function Gt(t, n, e, l, a) {
  const r = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = r && a > 0 ? nl / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function jt(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const ol = ["value"], al = ["disabled"], rl = ["disabled"], il = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, sl = 28, cl = 600, ul = /* @__PURE__ */ tt({
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
    const e = t, l = n, a = z(e.rowData ?? []), r = z(e.pinnedBottomRowData ?? []), c = z(""), d = z(null), i = Ft({}), f = Ft({}), u = Ft(/* @__PURE__ */ new Set()), m = z(0), h = z(0), T = z(0), p = z(0), S = z(0), v = z(-1), g = z(null), M = z(null), A = z(null), U = { ...ke }, I = z({ x: 0, y: ge }), w = z("");
    function C(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const W = q(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((s) => !u.has(C(s))).map((s) => {
        const x = C(s), L = { ...o, ...s };
        return { colId: x, colDef: L, width: f[x] ?? L.width ?? 100 };
      });
    }), B = q(() => {
      const o = h.value;
      if (!o) return W.value;
      const s = W.value.reduce((k, D) => k + D.width, 0);
      if (!s || s >= o) return W.value;
      const x = o / s;
      let L = 0;
      return W.value.map((k, D) => {
        const j = D === W.value.length - 1 ? o - L : Math.max(8, Math.round(k.width * x));
        return L += j, { ...k, width: j };
      });
    }), oe = q(() => {
      const o = B.value.reduce((s, x) => s + x.width, 0);
      return Math.max(0, o - h.value);
    });
    let ne = null;
    function ae() {
      if (typeof document > "u") return null;
      ne || (ne = document.createElement("canvas"));
      const o = ne.getContext("2d");
      return o && (o.font = yn()), o;
    }
    const le = q(() => B.value.some((o) => o.colDef.wrap)), $ = q(() => {
      if (!le.value) return null;
      const o = ae();
      if (!o) return null;
      const s = B.value.filter((L) => L.colDef.wrap), x = e.rowHeight;
      return P.value.map((L) => {
        let k = 1;
        for (const D of s) {
          const Y = bn(o, N(D, L), Math.max(20, D.width - 16));
          Y.length > k && (k = Y.length);
        }
        return qn(k, x);
      });
    }), Q = q(
      () => $.value ? Nt($.value, P.value.length) : null
    ), me = q(
      () => Q.value ? Q.value[P.value.length] : P.value.length * e.rowHeight
    ), ee = q(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, T.value - ge - o);
    }), Z = q(
      () => Math.max(0, me.value - ee.value)
    ), H = q(
      () => Math.max(1, Math.floor(ee.value / e.rowHeight))
    ), b = q(() => {
      const o = P.value.length;
      if (o === 0) return 0;
      const s = Q.value ? Tt(Q.value, p.value) : Math.floor(p.value / e.rowHeight);
      return Math.min(o - 1, s);
    }), E = q(() => {
      const o = P.value.length;
      return o === 0 ? 0 : Q.value ? Math.min(o - 1, Tt(Q.value, p.value + ee.value - 1)) : Math.min(o - 1, b.value + H.value - 1);
    });
    function F(o, s) {
      if (s.colDef.valueGetter) return s.colDef.valueGetter({ data: o, colDef: s.colDef });
      if (s.colDef.field) return o[s.colDef.field];
    }
    function N(o, s) {
      const x = F(s, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: s, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: s, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function K(o, s) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: F(s, o), data: s, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const P = q(() => {
      m.value;
      let o = a.value;
      const s = c.value.trim().toLowerCase();
      s && (o = o.filter(
        (x) => W.value.some(
          (L) => String(F(x, L) ?? "").toLowerCase().includes(s)
        )
      ));
      for (const [x, L] of Object.entries(i)) {
        if (!L) continue;
        const k = W.value.find((D) => D.colId === x);
        if (k)
          if (L.startsWith("__eq__")) {
            const D = L.slice(6).toLowerCase();
            o = o.filter((Y) => String(F(Y, k) ?? "").toLowerCase() === D);
          } else {
            const D = L.toLowerCase();
            o = o.filter((Y) => String(F(Y, k) ?? "").toLowerCase().includes(D));
          }
      }
      if (d.value) {
        const { colId: x, dir: L } = d.value, k = W.value.find((D) => D.colId === x);
        k && (o = [...o].sort((D, Y) => {
          const j = F(D, k), he = F(Y, k);
          let pe = 0;
          return k.colDef.comparator ? pe = k.colDef.comparator(j, he) : typeof j == "number" && typeof he == "number" ? pe = j - he : pe = String(j ?? "").localeCompare(String(he ?? ""), void 0, { numeric: !0 }), L === "asc" ? pe : -pe;
        }));
      }
      return o;
    }), G = q(() => {
      const o = W.value.filter((k) => k.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const s = P.value, x = {};
      for (const k of o) {
        const D = s.map((j) => F(j, k)), Y = Zn(D, k.colDef.aggFunc);
        if (Y == null) {
          x[k.colId] = "";
          continue;
        }
        x[k.colId] = k.colDef.aggValueFormatter ? k.colDef.aggValueFormatter(Y) : String(Y);
      }
      const L = o[0].colId;
      return x[L] === "" && (x[L] = "Σ"), x;
    });
    X(P, () => {
      p.value = 0, g.value = null;
    }), X(oe, () => {
      S.value = Math.min(S.value, oe.value);
    }), X(Z, () => {
      p.value = Math.min(p.value, Z.value);
    });
    function be(o) {
      const s = Q.value, x = s ? s[o] : o * e.rowHeight, L = s ? s[o + 1] : x + e.rowHeight;
      x < p.value ? p.value = x : L > p.value + ee.value && (p.value = Math.min(Z.value, L - ee.value));
    }
    function ue() {
      p.value = Math.max(0, p.value - ee.value), xe();
    }
    function Le() {
      p.value = Math.min(Z.value, p.value + ee.value), xe();
    }
    let Te = !1, Ie = "", R = 0, V = 0, J = !1, fe = !1, Re = 0, Ae = 0, Xe = 0, Ue = 0, Fe = !1;
    function Je(o, s) {
      var x;
      Te = !0, Ie = o, R = s, V = ((x = B.value.find((L) => L.colId === o)) == null ? void 0 : x.width) ?? 100, J = !1;
    }
    function at(o) {
      if (fe) {
        const D = Re - o.clientX, Y = Ae - o.clientY;
        (Math.abs(D) > 4 || Math.abs(Y) > 4) && (Fe = !0), S.value = Math.max(0, Math.min(oe.value, Xe + D)), p.value = Math.max(0, Math.min(Z.value, Ue + Y)), xe();
        return;
      }
      if (!Te) return;
      const s = h.value, x = Math.max(30, V + (o.clientX - R)), L = W.value.filter((D) => D.colId !== Ie).reduce((D, Y) => D + Y.width, 0), k = s - x;
      k > 10 && (f[Ie] = Math.max(10, Math.round(x * L / k))), xe();
    }
    function We() {
      fe && (Fe && (J = !0), fe = !1), Te && (Te = !1, J = !0, l("column-resized"));
    }
    function $e(o) {
      if (o.touches.length !== 1) return;
      const s = o.touches[0];
      fe = !0, Fe = !1, Re = s.clientX, Ae = s.clientY, Xe = S.value, Ue = p.value;
    }
    function ft(o) {
      if (!fe || o.touches.length !== 1) return;
      o.preventDefault();
      const s = o.touches[0], x = Re - s.clientX, L = Ae - s.clientY;
      (Math.abs(x) > 4 || Math.abs(L) > 4) && (Fe = !0), S.value = Math.max(0, Math.min(oe.value, Xe + x)), p.value = Math.max(0, Math.min(Z.value, Ue + L)), xe();
    }
    function bt() {
      fe && (Fe && (J = !0), fe = !1);
    }
    const Ce = z(null), re = z(null), xt = Rt("cathodeResetTick", z(0));
    X(xt, () => rt());
    let ce = null, Ne = !1;
    function y() {
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
    let _, te, de, ve, ie;
    const ze = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Ot}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): inward sampling would push edge content (headers, first/
    // last columns) off-screen entirely, so the displacement is faded to zero
    // at the rectangle border: the FRAME stays pinned and the glass dishes
    // inward — no content is ever lost, the bow reads through interior rows.
    // (Physically truer to a tube, too: the bezel doesn't move.)
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * abs(uStrength);
    vec2  d    = cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      d *= (1.0 - 4.0 * cc.x * cc.x) * (1.0 - 4.0 * cc.y * cc.y);
    }
    return uv + d;
  }

  ${Xt}

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

    ${Ut}

    gl_FragColor = color;
  }
`;
    function Qe() {
      if (!(!re.value || !Ce.value)) {
        ie = document.createElement("canvas");
        try {
          ce = new O.WebGLRenderer({ canvas: re.value, antialias: !1, alpha: !0 });
        } catch {
          Ne = !0;
        }
        if (!Ne && !ce.getContext() && (ce.dispose(), ce = null, Ne = !0), Ne) {
          Ee();
          return;
        }
        ce.setPixelRatio(1), ce.setClearColor(0, 0), _ = new O.Scene(), te = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), ve = new O.CanvasTexture(ie), ve.minFilter = O.LinearFilter, ve.magFilter = O.LinearFilter, de = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: ve },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new O.Color(0) },
            ...Kt()
          },
          vertexShader: il,
          fragmentShader: ze,
          transparent: !0
        }), _.add(new O.Mesh(new O.PlaneGeometry(2, 2), de)), Ee();
      }
    }
    function Ee() {
      if (!Ce.value || !ce && !Ne) return;
      const o = Ce.value.clientWidth, s = Ce.value.clientHeight - (e.pagination ? sl : 0);
      if (!o || !s) return;
      const x = ie.width !== o || ie.height !== s;
      ie.width = o, ie.height = s, h.value = o, T.value = s, S.value = Math.max(0, Math.min(oe.value, S.value)), p.value = Math.max(0, Math.min(Z.value, p.value)), ce ? (x && ve && (ve.dispose(), ve = new O.CanvasTexture(ie), ve.minFilter = O.LinearFilter, ve.magFilter = O.LinearFilter, de && (de.uniforms.uTex.value = ve)), ce.setPixelRatio(window.devicePixelRatio || 1), ce.setSize(o, s)) : re.value && (re.value.width = o, re.value.height = s, re.value.style.width = o + "px", re.value.style.height = s + "px"), xe();
    }
    function xe() {
      var x, L, k, D, Y, j, he, pe, it, ht, mt, st;
      if (!(ie != null && ie.width)) return;
      if (Ne) {
        if (!re.value) return;
        sn(ie, {
          cols: B.value,
          rows: P.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: $.value ?? void 0,
          scrollY: p.value,
          scrollX: S.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = d.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((L = d.value) == null ? void 0 : L.dir) ?? null,
          colFilters: i,
          hoveredRow: v.value,
          selectedRow: ((k = g.value) == null ? void 0 : k.row) ?? -1,
          selectedCol: ((D = g.value) == null ? void 0 : D.col) ?? -1,
          selectionAnchorRow: ((Y = M.value) == null ? void 0 : Y.row) ?? -1,
          selectionAnchorCol: ((j = M.value) == null ? void 0 : j.col) ?? -1,
          formatCell: N,
          getCellStyle: K
        });
        const gt = re.value.getContext("2d");
        gt && gt.drawImage(ie, 0, 0);
        return;
      }
      if (!ce || !de || !ve) return;
      const o = ut[e.theme] ?? ut.none, s = e.theme === "paper";
      de.uniforms.uStrength.value = yt(e.curvature), de.uniforms.uScanlines.value = e.scanlines && !s ? 1 : 0, de.uniforms.uVignette.value = s ? 0 : 1, de.uniforms.uBezel.value.set(o.bg), Gt(de, e.magnify, U, ie.width, ie.height), sn(ie, {
        cols: B.value,
        rows: P.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: $.value ?? void 0,
        scrollY: p.value,
        scrollX: S.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((he = d.value) == null ? void 0 : he.colId) ?? null,
        sortDir: ((pe = d.value) == null ? void 0 : pe.dir) ?? null,
        colFilters: i,
        hoveredRow: v.value,
        selectedRow: ((it = g.value) == null ? void 0 : it.row) ?? -1,
        selectedCol: ((ht = g.value) == null ? void 0 : ht.col) ?? -1,
        selectionAnchorRow: ((mt = M.value) == null ? void 0 : mt.row) ?? -1,
        selectionAnchorCol: ((st = M.value) == null ? void 0 : st.col) ?? -1,
        formatCell: N,
        getCellStyle: K,
        aggregateRow: G.value
      }), ve.needsUpdate = !0, ce.render(_, te);
    }
    function Et(o) {
      if (!re.value) return [-1, -1];
      const s = re.value.getBoundingClientRect(), x = o.clientX - s.left, L = o.clientY - s.top, k = re.value.width || s.width, D = re.value.height || s.height, Y = yt(e.curvature), [j, he] = Qn(x, L, k, D, Y);
      return j < 0 ? [-1, -1] : [j, he];
    }
    let Dt = 0;
    function kn(o) {
      A.value = null;
      const s = Date.now();
      if (o.deltaX !== 0) {
        Dt = s, S.value = Math.max(0, Math.min(oe.value, S.value + o.deltaX)), xe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Dt = s, S.value = Math.max(0, Math.min(oe.value, S.value + o.deltaY)), xe();
        return;
      }
      s - Dt < cl || (p.value = Math.max(0, Math.min(Z.value, p.value + o.deltaY)), xe());
    }
    function Ln(o) {
      if (Te) return;
      if (e.magnify && re.value) {
        const k = jt(o, re.value);
        U.x = k.x, U.y = k.y;
      }
      const [s, x] = Et(o);
      if (s < 0) {
        v.value = -1, xe();
        return;
      }
      const L = un(
        s,
        x,
        B.value,
        P.value.length,
        e.rowHeight,
        p.value,
        ie.height,
        r.value.length,
        S.value,
        G.value !== null,
        $.value ?? void 0
      );
      if (v.value = L.area === "body" ? L.rowIdx : -1, L.area === "header" && L.colIdx >= 0) {
        const k = B.value[L.colIdx], D = Bt(L.colIdx, B.value), Y = s + S.value;
        re.value.style.cursor = k && cn(Y, D, k.width) ? "col-resize" : "pointer";
      } else L.area === "body" ? re.value.style.cursor = "pointer" : re.value.style.cursor = "default";
      xe();
    }
    function In() {
      v.value = -1, U.x = ke.x, U.y = ke.y, xe();
    }
    function Rn(o) {
      const [s, x] = Et(o);
      if (s < 0) return;
      if (x >= ge) {
        fe = !0, Fe = !1, Re = o.clientX, Ae = o.clientY, Xe = S.value, Ue = p.value;
        return;
      }
      const L = s + S.value;
      for (let k = 0; k < B.value.length; k++) {
        const D = B.value[k], Y = Bt(k, B.value);
        if (D.colDef.resizable !== !1 && cn(L, Y, D.width)) {
          Je(D.colId, o.clientX);
          return;
        }
      }
    }
    function En(o) {
      var k, D, Y;
      if (J) {
        J = !1;
        return;
      }
      if (Te) return;
      const [s, x] = Et(o);
      if (s < 0) {
        A.value = null;
        return;
      }
      const L = un(
        s,
        x,
        B.value,
        P.value.length,
        e.rowHeight,
        p.value,
        ie.height,
        r.value.length,
        S.value,
        G.value !== null,
        $.value ?? void 0
      );
      if (L.area === "header" && L.colIdx >= 0) {
        const j = B.value[L.colIdx], he = Bt(L.colIdx, B.value), pe = s + S.value;
        j.colDef.filter && el(pe, he, j.width) ? (o.stopPropagation(), A.value === j.colId ? A.value = null : (A.value = j.colId, w.value = (k = i[j.colId]) != null && k.startsWith("__eq__") ? i[j.colId].slice(6) : i[j.colId] ?? "", I.value = { x: Math.max(0, he - S.value), y: ge })) : j.colDef.sortable !== !1 && (A.value = null, d.value = ((D = d.value) == null ? void 0 : D.colId) === j.colId ? d.value.dir === "asc" ? { colId: j.colId, dir: "desc" } : null : { colId: j.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (A.value = null, L.area === "body" && L.rowIdx >= 0 && L.colIdx >= 0) {
        const j = L.rowIdx;
        o.shiftKey && g.value ? (M.value || (M.value = { ...g.value }), g.value = { row: j, col: L.colIdx }) : (g.value = { row: j, col: L.colIdx }, M.value = { row: j, col: L.colIdx }), (Y = re.value) == null || Y.focus();
        const he = P.value[j], pe = B.value[L.colIdx];
        he && pe && (l("row-clicked", { data: he, event: o }), l("cell-selected", { data: he, row: j, col: L.colIdx, colId: pe.colId }));
      }
    }
    function tn(o) {
      var s, x;
      A.value && ((x = (s = o.target).closest) != null && x.call(s, ".cathode-filter-popup") || (A.value = null));
    }
    function Dn(o) {
      var k;
      if (!h.value) return;
      let s = 0;
      for (let D = 0; D < o; D++) s += B.value[D].width;
      const x = ((k = B.value[o]) == null ? void 0 : k.width) ?? 0, L = s - S.value;
      L < 0 ? S.value = Math.max(0, s) : L + x > h.value && (S.value = Math.min(oe.value, s + x - h.value));
    }
    function An(o) {
      const x = B.value.length - 1, L = P.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), g.value = { row: b.value, col: 0 }, M.value = { row: b.value, col: 0 });
        return;
      }
      let { row: k, col: D } = g.value;
      const Y = (j, he, pe = !1) => {
        k = Math.max(0, Math.min(L, j)), D = Math.max(0, Math.min(x, he)), g.value = { row: k, col: D }, pe || (M.value = { row: k, col: D }), be(k), Dn(D);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), Y(k + 1, D, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), Y(k - 1, D, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? Y(k, D + 1, !0) : D < x ? Y(k, D + 1) : Y(k + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? Y(k, D - 1, !0) : D > 0 ? Y(k, D - 1) : Y(k - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? D > 0 ? Y(k, D - 1) : Y(k - 1, x) : D < x ? Y(k, D + 1) : Y(k + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? Y(k - 1, D) : Y(k + 1, D);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(0, 0, o.shiftKey) : Y(k, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(L, x, o.shiftKey) : Y(k, x, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), Y(Math.min(L, k + H.value), D, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), Y(Math.max(0, k - H.value), D, o.shiftKey);
          break;
        case "Escape":
          g.value = null, M.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), Fn());
          break;
      }
    }
    function Fn() {
      var pe;
      if (!g.value) return;
      const o = B.value, s = P.value, x = M.value ?? g.value, L = Math.min(x.row, g.value.row), k = Math.max(x.row, g.value.row), D = Math.min(x.col, g.value.col), Y = Math.max(x.col, g.value.col), j = [];
      for (let it = L; it <= k; it++) {
        const ht = s[it];
        if (!ht) continue;
        const mt = [];
        for (let st = D; st <= Y; st++) {
          const gt = o[st];
          gt && mt.push(N(gt, ht).replace(/[\t\r\n]+/g, " "));
        }
        j.push(mt.join("	"));
      }
      const he = j.join(`
`);
      (pe = navigator.clipboard) == null || pe.writeText(he).catch(() => {
      });
    }
    function _n(o) {
      const s = o.target.value;
      w.value = s, s ? i[A.value] = s : delete i[A.value], l("filter-changed");
    }
    function nn() {
      A.value && delete i[A.value], w.value = "", A.value = null, l("filter-changed");
    }
    const Bn = {
      setGridOption(o, s) {
        o === "rowData" ? a.value = s : o === "pinnedBottomRowData" ? r.value = s : o === "quickFilterText" && (c.value = s);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, L;
          const s = C(o);
          return {
            colId: s,
            hide: u.has(s),
            sort: ((x = d.value) == null ? void 0 : x.colId) === s ? d.value.dir : null,
            sortIndex: ((L = d.value) == null ? void 0 : L.colId) === s ? 0 : null,
            width: f[s] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const s of o)
          s.hide === !0 && u.add(s.colId), s.hide === !1 && u.delete(s.colId), s.sort && (d.value = { colId: s.colId, dir: s.sort }), s.width && (f[s.colId] = s.width);
      },
      setFilterModel(o) {
        for (const s of Object.keys(i)) delete i[s];
        if (o)
          for (const [s, x] of Object.entries(o))
            (x == null ? void 0 : x.type) === "equals" ? i[s] = `__eq__${x.filter}` : x != null && x.filter && (i[s] = x.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [s, x] of Object.entries(i))
          x && (o[s] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return o;
      },
      async setColumnFilterModel(o, s) {
        s ? s.type === "equals" ? i[o] = `__eq__${s.filter}` : i[o] = s.filter ?? "" : delete i[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        m.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const s = W.value, x = s.map((Y) => Y.colDef.headerName ?? Y.colId).join(","), L = P.value.map(
          (Y) => s.map((j) => `"${String(N(j, Y)).replace(/"/g, '""')}"`).join(",")
        ), k = new Blob([[x, ...L].join(`
`)], { type: "text/csv" }), D = URL.createObjectURL(k);
        Object.assign(document.createElement("a"), { href: D, download: o }).click(), URL.revokeObjectURL(D);
      },
      resize() {
        Ee();
      },
      resetColumnState() {
        u.clear();
        for (const s of e.columnDefs)
          s.hide && u.add(C(s));
        const o = e.columnDefs.find((s) => s.sort);
        d.value = o ? { colId: C(o), dir: o.sort } : null;
        for (const s of Object.keys(f)) delete f[s];
        for (const s of Object.keys(i)) delete i[s];
        c.value = "", p.value = 0, g.value = null, A.value = null;
      }
    };
    X(
      [P, () => r.value, B, p, v, g],
      () => Ve(xe)
    ), X(() => e.theme, () => xe()), X(() => e.curvature, () => Ve(Ee)), X(() => e.scanlines, () => xe()), X(() => e.glow, () => xe()), X(() => e.magnify, (o) => {
      o || (U.x = ke.x, U.y = ke.y), xe();
    }), X(g, (o) => {
      if (!o) return;
      const s = P.value[o.row], x = B.value[o.col];
      s && x && l("cell-selected", { data: s, row: o.row, col: o.col, colId: x.colId });
    });
    let dt = null, vt = null, At = 0;
    function rt() {
      cancelAnimationFrame(At), At = requestAnimationFrame(Ee);
    }
    function ln(o) {
      o.preventDefault();
    }
    function on() {
      ce == null || ce.dispose(), ce = null, Ne = !1, Qe();
    }
    qe(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(C(o)), o.sort && !d.value && (d.value = { colId: C(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", tn), document.addEventListener("mousemove", at), document.addEventListener("mouseup", We), Ve(() => {
        var o;
        Qe(), re.value && (re.value.addEventListener("webglcontextlost", ln), re.value.addEventListener("webglcontextrestored", on)), Ce.value && (dt = new ResizeObserver(() => Ee()), dt.observe(Ce.value), vt = new IntersectionObserver((s) => {
          s.some((x) => x.isIntersecting) && rt();
        }), vt.observe(Ce.value)), window.addEventListener("resize", rt), (o = window.visualViewport) == null || o.addEventListener("resize", rt), l("grid-ready", { api: Bn });
      });
    }), nt(() => {
      var o, s, x;
      document.removeEventListener("click", tn, !0), document.removeEventListener("mousemove", at), document.removeEventListener("mouseup", We), (o = re.value) == null || o.removeEventListener("webglcontextlost", ln), (s = re.value) == null || s.removeEventListener("webglcontextrestored", on), dt == null || dt.disconnect(), vt == null || vt.disconnect(), window.removeEventListener("resize", rt), (x = window.visualViewport) == null || x.removeEventListener("resize", rt), cancelAnimationFrame(At), y();
    });
    const De = q(() => ut[e.theme] ?? ut.none), Yn = q(() => ({
      position: "absolute",
      left: `${I.value.x}px`,
      top: `${I.value.y}px`,
      zIndex: 100,
      background: De.value.headerBg,
      border: `1px solid ${De.value.accent}`,
      color: De.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Wn = q(() => ({
      background: De.value.bg,
      border: `1px solid ${De.value.border}`,
      color: De.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), zn = q(() => ({
      background: De.value.headerBg,
      borderTop: `1px solid ${De.value.border}`,
      color: De.value.text
    })), Pn = q(() => ({
      background: De.value.bg
    })), an = q(() => De.value.accent);
    return (o, s) => {
      var x, L;
      return we(), ye("div", {
        ref_key: "wrapEl",
        ref: Ce,
        class: "cathode-wrap",
        style: _e(Pn.value)
      }, [
        se("canvas", {
          ref_key: "canvasEl",
          ref: re,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ke(kn, ["prevent"]),
          onMousemove: Ln,
          onMouseleave: In,
          onMousedown: Rn,
          onClick: En,
          onKeydown: An,
          onTouchstartPassive: $e,
          onTouchmove: ft,
          onTouchend: bt,
          onTouchcancel: bt
        }, null, 544),
        A.value ? (we(), ye("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: _e(Yn.value),
          onClick: s[0] || (s[0] = Ke(() => {
          }, ["stop"]))
        }, [
          se("input", {
            style: _e(Wn.value),
            value: w.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: _n,
            onKeydown: Hn(nn, ["escape"])
          }, null, 44, ol),
          w.value ? (we(), ye("button", {
            key: 0,
            style: _e({
              background: "none",
              border: "none",
              color: De.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: nn
          }, "✕", 4)) : He("", !0)
        ], 4)) : He("", !0),
        t.pagination ? (we(), ye("div", {
          key: 1,
          class: "cathode-pagination",
          style: _e(zn.value)
        }, [
          se("button", {
            disabled: p.value <= 0,
            onClick: s[1] || (s[1] = (k) => ue())
          }, "◀", 8, al),
          se("span", null, Pe((b.value + 1).toLocaleString()) + "–" + Pe(Math.min(P.value.length, E.value + 1).toLocaleString()) + " / " + Pe(P.value.length.toLocaleString()), 1),
          se("button", {
            disabled: p.value >= Z.value,
            onClick: s[2] || (s[2] = (k) => Le())
          }, "▶", 8, rl),
          se("span", {
            class: "cathode-page-info",
            style: _e({ color: an.value })
          }, Pe(P.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (we(), ye("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: _e({ color: an.value })
          }, Pe(((x = B.value[g.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((L = B.value[g.value.col]) == null ? void 0 : L.colId)) + " : " + Pe(N(B.value[g.value.col], P.value[g.value.row])), 5)) : He("", !0)
        ], 4)) : He("", !0)
      ], 4);
    };
  }
}), lt = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, yo = /* @__PURE__ */ lt(ul, [["__scopeId", "data-v-be96d8ca"]]), Ct = {
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
function fl(t, n) {
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
const dl = 12, Me = 18, wt = 10, et = 6, qt = `${dl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function vl(t, n, e) {
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
    let c = "";
    for (const d of r) {
      const i = c + d;
      if (t.measureText(i).width <= e)
        c = i;
      else if (c && (l.push(c.replace(/\s+$/, "")), c = ""), t.measureText(d).width > e) {
        let f = "";
        for (const u of d)
          t.measureText(f + u).width > e ? (f && l.push(f), f = u) : f += u;
        c = f;
      } else
        c = d.replace(/^\s+/, "");
    }
    c && l.push(c.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Mn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function hl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function ml(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, c = t.formatTs ?? Mn;
  e.font = qt;
  const d = [];
  for (let i = 0; i < n.length; i++) {
    const f = n[i], u = f.level ?? "info", m = a && f.ts != null ? c(f.ts) : "", h = r ? vl(e, f.text, l) : f.text.split(`
`);
    for (let T = 0; T < h.length; T++)
      d.push({
        entryIdx: i,
        text: h[T],
        level: u,
        timestamp: T === 0 ? m : "",
        isFirstFrag: T === 0,
        widthPx: e.measureText(h[T]).width
      });
  }
  return d;
}
function fn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ct[n.theme] ?? Ct.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = qt, e.textBaseline = "middle";
  const c = n.visualLines, d = wt - n.scrollX, i = (n.showTimestamps ? wt + n.timestampWidth : wt) - n.scrollX, f = Math.max(0, Math.floor((n.scrollY - et) / Me)), u = Math.min(c.length, Math.ceil((n.scrollY + a - et) / Me) + 1);
  for (let m = f; m < u; m++) {
    const h = c[m], T = et + m * Me - n.scrollY + Me / 2;
    if (h.entryIdx % 2 === 1 && h.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let S = 1;
      for (; m + S < u && c[m + S].entryIdx === h.entryIdx; ) S++;
      e.fillRect(0, T - Me / 2, l, Me * S);
    }
    n.selectionStart >= 0 && m >= n.selectionStart && m <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, T - Me / 2, l, Me)), m === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, T - Me / 2, l, Me)), n.showTimestamps && h.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(h.timestamp, d, T), e.shadowBlur = 0);
    const p = fl(r, h.level);
    e.fillStyle = p, e.textAlign = "left", n.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(h.text, i, T), e.shadowBlur = 7, e.fillText(h.text, i, T), e.shadowBlur = 3, e.fillText(h.text, i, T), e.shadowBlur = 0) : e.fillText(h.text, i, T);
  }
  e.restore();
}
function dn(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - et) / Me);
  return l < 0 || l >= e ? -1 : l;
}
function gl(t) {
  return et * 2 + t * Me;
}
const pl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, wl = /* @__PURE__ */ tt({
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
    const e = t, l = z(null), a = z(null), r = { ...ke }, c = z(0), d = z(0), i = z(0), f = z(-1), u = z(!0), m = z(-1), h = z(-1), T = q(() => {
      const y = e.entries ?? [];
      return e.maxLines > 0 && y.length > e.maxLines ? y.slice(y.length - e.maxLines) : y;
    }), p = q(() => {
      if (!e.showTimestamps) return "";
      const y = e.formatTs ?? Mn;
      let _ = "00:00:00";
      for (const te of T.value) {
        if (te.ts == null) continue;
        const de = y(te.ts);
        de.length > _.length && (_ = de);
      }
      return _;
    }), S = z(0), v = z([]);
    function g() {
      if (!$) return;
      const y = $.getContext("2d");
      if (!y) return;
      y.font = qt;
      const _ = e.showTimestamps ? hl(y, p.value) : 0;
      S.value = _;
      const te = Math.max(
        1,
        c.value - wt * 2 - _
      );
      v.value = ml({
        entries: T.value,
        ctx: y,
        textMaxWidth: te,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const M = q(() => gl(v.value.length)), A = q(() => Math.max(0, M.value - d.value)), U = q(() => {
      let y = 0;
      for (const _ of v.value) _.widthPx > y && (y = _.widthPx);
      return wt * 2 + S.value + y;
    }), I = q(() => Math.max(0, U.value - c.value)), w = z(0);
    X(A, () => {
      u.value ? i.value = A.value : i.value = Math.min(i.value, A.value);
    }), X(I, () => {
      w.value = Math.min(w.value, I.value);
    }), X(
      [T, c, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        g(), Ve(Z);
      },
      { deep: !1 }
    );
    let C = null, W = !1;
    function B() {
      if (C) {
        try {
          C.forceContextLoss();
        } catch {
        }
        try {
          C.dispose();
        } catch {
        }
        C = null;
      }
    }
    let oe, ne, ae, le, $;
    const Q = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Ot}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): inward sampling would push edge content (headers, first/
    // last columns) off-screen entirely, so the displacement is faded to zero
    // at the rectangle border: the FRAME stays pinned and the glass dishes
    // inward — no content is ever lost, the bow reads through interior rows.
    // (Physically truer to a tube, too: the bezel doesn't move.)
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * abs(uStrength);
    vec2  d    = cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      d *= (1.0 - 4.0 * cc.x * cc.x) * (1.0 - 4.0 * cc.y * cc.y);
    }
    return uv + d;
  }

  ${Xt}

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

    ${Ut}

    gl_FragColor = color;
  }
`;
    function me() {
      if (!(!a.value || !l.value)) {
        $ = document.createElement("canvas");
        try {
          C = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          W = !0;
        }
        if (!W && !C.getContext() && (C.dispose(), C = null, W = !0), W) {
          ee();
          return;
        }
        C.setPixelRatio(1), C.setClearColor(0, 0), oe = new O.Scene(), ne = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), le = new O.CanvasTexture($), le.minFilter = O.LinearFilter, le.magFilter = O.LinearFilter, ae = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: le },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Kt()
          },
          vertexShader: pl,
          fragmentShader: Q,
          transparent: !0
        }), oe.add(new O.Mesh(new O.PlaneGeometry(2, 2), ae)), ee();
      }
    }
    function ee() {
      if (!l.value || !C && !W) return;
      const y = l.value.clientWidth, _ = l.value.clientHeight;
      if (!y || !_) return;
      const te = $.width !== y || $.height !== _;
      te && ($.width = y, $.height = _, c.value = y, d.value = _, g(), C ? (te && le && (le.dispose(), le = new O.CanvasTexture($), le.minFilter = O.LinearFilter, le.magFilter = O.LinearFilter, ae && (ae.uniforms.uTex.value = le)), C.setPixelRatio(window.devicePixelRatio || 1), C.setSize(y, _)) : a.value && (a.value.width = y, a.value.height = _, a.value.style.width = y + "px", a.value.style.height = _ + "px"), u.value && (i.value = Math.max(0, M.value - d.value)), Z());
    }
    function Z() {
      if (!($ != null && $.width)) return;
      if (W) {
        if (!a.value) return;
        fn($, {
          visualLines: v.value,
          scrollY: i.value,
          scrollX: w.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: S.value,
          hoveredLine: f.value,
          selectionStart: Math.min(m.value, h.value),
          selectionEnd: Math.max(m.value, h.value)
        });
        const _ = a.value.getContext("2d");
        _ && _.drawImage($, 0, 0);
        return;
      }
      if (!C || !ae || !le) return;
      const y = e.theme === "paper";
      ae.uniforms.uStrength.value = yt(e.curvature), ae.uniforms.uScanlines.value = e.scanlines && !y ? 1 : 0, ae.uniforms.uVignette.value = y ? 0 : 1, Gt(ae, e.magnify, r, $.width, $.height), fn($, {
        visualLines: v.value,
        scrollY: i.value,
        scrollX: w.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: S.value,
        hoveredLine: f.value,
        selectionStart: Math.min(m.value, h.value),
        selectionEnd: Math.max(m.value, h.value)
      }), le.needsUpdate = !0, C.render(oe, ne);
    }
    X(() => e.theme, () => Z()), X(() => e.curvature, () => Z()), X(() => e.scanlines, () => Z()), X(() => e.glow, () => Z()), X(() => e.magnify, (y) => {
      y || (r.x = ke.x, r.y = ke.y), Z();
    }), X(i, () => Z()), X(w, () => Z()), X(f, () => Z()), X([m, h], () => Z());
    function H(y) {
      if (!a.value) return [-1, -1];
      const _ = a.value.getBoundingClientRect();
      return [y.clientX - _.left, y.clientY - _.top];
    }
    function b(y) {
      i.value = Math.max(0, Math.min(A.value, y)), u.value = i.value >= A.value - 4;
    }
    function E(y) {
      w.value = Math.max(0, Math.min(I.value, y));
    }
    function F(y) {
      y.shiftKey ? E(w.value + y.deltaY) : Math.abs(y.deltaX) > Math.abs(y.deltaY) ? E(w.value + y.deltaX) : b(i.value + y.deltaY);
    }
    let N = !1, K = 0, P = 0, G = 0, be = 0, ue = !1;
    function Le(y) {
      N = !0, ue = !1, K = y.clientX, P = y.clientY, G = w.value, be = i.value, l.value && l.value.focus();
    }
    function Te(y) {
      if (N) {
        const _ = K - y.clientX, te = P - y.clientY;
        (Math.abs(_) > 4 || Math.abs(te) > 4) && (ue = !0), E(G + _), b(be + te);
      }
    }
    function Ie() {
      N && (N = !1, ue && (ue = !1));
    }
    function R(y) {
      if (y.touches.length !== 1) return;
      const _ = y.touches[0];
      N = !0, ue = !1, K = _.clientX, P = _.clientY, G = w.value, be = i.value, l.value && l.value.focus();
    }
    function V(y) {
      if (!N || y.touches.length !== 1) return;
      y.preventDefault();
      const _ = y.touches[0], te = K - _.clientX, de = P - _.clientY;
      (Math.abs(te) > 4 || Math.abs(de) > 4) && (ue = !0), E(G + te), b(be + de);
    }
    function J() {
      N && (N = !1, ue && (ue = !1));
    }
    function fe(y) {
      const [, _] = H(y);
      return _ < 0 ? -1 : dn(_, i.value, v.value.length);
    }
    function Re(y) {
      if (ue) {
        ue = !1;
        return;
      }
      const _ = fe(y);
      if (_ < 0) {
        m.value = -1, h.value = -1;
        return;
      }
      y.shiftKey && m.value >= 0 || (m.value = _), h.value = _;
    }
    function Ae(y, _) {
      const te = v.value.length;
      if (te === 0) return;
      const de = h.value < 0 ? 0 : h.value;
      let ve = Math.max(0, Math.min(te - 1, de + y));
      h.value = ve, (!_ || m.value < 0) && (m.value = ve), f.value = ve;
      const ie = et + ve * Me, ze = ie + Me;
      ie < i.value ? b(ie) : ze > i.value + d.value && b(ze - d.value);
    }
    function Xe() {
      const y = Math.min(m.value, h.value), _ = Math.max(m.value, h.value);
      if (y < 0) return "";
      const te = v.value, de = /* @__PURE__ */ new Set(), ve = [];
      for (let ie = y; ie <= _ && ie < te.length; ie++) {
        const ze = te[ie];
        if (de.has(ze.entryIdx)) continue;
        de.add(ze.entryIdx);
        let Qe = "";
        for (let Ee = 0; Ee < te.length; Ee++)
          te[Ee].entryIdx === ze.entryIdx && (Qe += (Qe && !te[Ee].isFirstFrag ? " " : "") + te[Ee].text);
        ve.push(ze.timestamp ? `${ze.timestamp}  ${Qe}` : Qe);
      }
      return ve.join(`
`);
    }
    async function Ue() {
      const y = Xe();
      if (y)
        try {
          await navigator.clipboard.writeText(y);
        } catch {
          const _ = document.createElement("textarea");
          _.value = y, _.style.position = "fixed", _.style.opacity = "0", document.body.appendChild(_), _.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(_);
        }
    }
    function Fe(y) {
      if ((y.metaKey || y.ctrlKey) && (y.key === "c" || y.key === "C")) {
        m.value >= 0 && (y.preventDefault(), Ue());
        return;
      }
      if ((y.metaKey || y.ctrlKey) && (y.key === "a" || y.key === "A")) {
        y.preventDefault(), m.value = 0, h.value = v.value.length - 1;
        return;
      }
      switch (y.key) {
        case "ArrowDown":
          y.preventDefault(), Ae(1, y.shiftKey);
          break;
        case "ArrowUp":
          y.preventDefault(), Ae(-1, y.shiftKey);
          break;
        case "ArrowRight":
          y.preventDefault(), E(w.value + Me * 2);
          break;
        case "ArrowLeft":
          y.preventDefault(), E(w.value - Me * 2);
          break;
        case "PageDown":
          y.preventDefault(), b(i.value + d.value);
          break;
        case "PageUp":
          y.preventDefault(), b(i.value - d.value);
          break;
        case "Home":
          y.preventDefault(), b(0), E(0);
          break;
        case "End":
          y.preventDefault(), b(A.value);
          break;
        case "Escape":
          m.value = -1, h.value = -1;
          break;
      }
    }
    function Je(y) {
      if (e.magnify && a.value) {
        const te = jt(y, a.value);
        r.x = te.x, r.y = te.y, Z();
      }
      const [, _] = H(y);
      if (_ < 0) {
        f.value = -1;
        return;
      }
      f.value = dn(_, i.value, v.value.length);
    }
    function at() {
      f.value = -1, r.x = ke.x, r.y = ke.y, Z();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, i.value = A.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        b(et + y * Me);
      }
    });
    let We = null, $e = null, ft = 0;
    const bt = Rt("cathodeResetTick", z(0));
    X(bt, () => Ce());
    function Ce() {
      cancelAnimationFrame(ft), ft = requestAnimationFrame(ee);
    }
    function re(y) {
      y.preventDefault();
    }
    function xt() {
      C == null || C.dispose(), C = null, W = !1, me();
    }
    qe(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", Ie), Ve(() => {
        var y;
        me(), a.value && (a.value.addEventListener("webglcontextlost", re), a.value.addEventListener("webglcontextrestored", xt)), l.value && (We = new ResizeObserver(() => ee()), We.observe(l.value), $e = new IntersectionObserver((_) => {
          _.some((te) => te.isIntersecting) && Ce();
        }), $e.observe(l.value)), window.addEventListener("resize", Ce), (y = window.visualViewport) == null || y.addEventListener("resize", Ce), i.value = A.value;
      });
    }), nt(() => {
      var y, _, te;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", Ie), (y = a.value) == null || y.removeEventListener("webglcontextlost", re), (_ = a.value) == null || _.removeEventListener("webglcontextrestored", xt), We == null || We.disconnect(), $e == null || $e.disconnect(), window.removeEventListener("resize", Ce), (te = window.visualViewport) == null || te.removeEventListener("resize", Ce), cancelAnimationFrame(ft), B();
    });
    const ce = q(() => Ct[e.theme] ?? Ct.none), Ne = q(() => ({
      background: ce.value.bg
    }));
    return (y, _) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: _e(Ne.value),
      tabindex: "0",
      onKeydown: Fe
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Ke(F, ["prevent"]),
        onMousemove: Je,
        onMouseleave: at,
        onMousedown: Le,
        onClick: Re,
        onTouchstartPassive: R,
        onTouchmove: V,
        onTouchend: J,
        onTouchcancel: J
      }, null, 544)
    ], 36));
  }
}), yl = /* @__PURE__ */ lt(wl, [["__scopeId", "data-v-236f6c87"]]), bl = ["disabled"], xl = /* @__PURE__ */ tt({
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
    const l = t, a = e, r = z(null), c = z(null), d = z(""), i = z([]), f = z(-1);
    let u = "";
    function m(I) {
      I.trim() && (i.value.length && i.value[i.value.length - 1] === I || (i.value.push(I), i.value.length > l.historyLimit && i.value.splice(0, i.value.length - l.historyLimit)));
    }
    function h(I) {
      if (!l.disabled) {
        if (I.key === "Enter") {
          I.preventDefault();
          const w = d.value;
          w.trim() && m(w), f.value = -1, d.value = "", a("submit", w);
          return;
        }
        if (I.key === "ArrowUp") {
          if (!i.value.length) return;
          I.preventDefault(), f.value === -1 ? (u = d.value, f.value = i.value.length - 1) : f.value > 0 && f.value--, d.value = i.value[f.value];
          return;
        }
        if (I.key === "ArrowDown") {
          if (f.value === -1) return;
          I.preventDefault(), f.value < i.value.length - 1 ? (f.value++, d.value = i.value[f.value]) : (f.value = -1, d.value = u, u = "");
          return;
        }
      }
    }
    const T = z(!0);
    let p = null;
    function S() {
      p || (p = setInterval(() => {
        T.value = !T.value;
      }, 530));
    }
    function v() {
      p && (clearInterval(p), p = null), T.value = !0;
    }
    const g = q(() => {
      let I;
      return l.disabled ? I = " " : l.busy ? I = "█" : I = T.value ? "█" : " ", { level: "info", text: `${l.prompt}${d.value}${I}` };
    }), M = q(
      () => [...l.entries, g.value]
    );
    function A() {
      var I;
      l.disabled || (I = c.value) == null || I.focus();
    }
    X(() => l.busy, (I, w) => {
      w && !I && !l.disabled && Ve(() => {
        var C;
        return (C = c.value) == null ? void 0 : C.focus();
      });
    });
    function U() {
      var I;
      (I = c.value) == null || I.focus();
    }
    return n({ focus: U }), qe(() => {
      S(), l.disabled || requestAnimationFrame(() => {
        var I;
        return (I = c.value) == null ? void 0 : I.focus();
      });
    }), nt(() => {
      v();
    }), (I, w) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: A
    }, [
      gn(yl, {
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
      pn(se("input", {
        ref_key: "inputEl",
        ref: c,
        "onUpdate:modelValue": w[0] || (w[0] = (C) => d.value = C),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: h
      }, null, 40, bl), [
        [Vn, d.value]
      ])
    ], 512));
  }
}), bo = /* @__PURE__ */ lt(xl, [["__scopeId", "data-v-a2b39934"]]), kt = {
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
}, Ml = 0.18, pt = 8, Zt = 22, Sl = 4, Ye = 8, je = 56, Jt = 42, Oe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Tl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Yt = 4, Cl = 1, kl = 1;
function Ll(t, n, e, l = 0, a = !1) {
  const r = a ? Jt : je, c = Math.max(0, n - Ye - r), d = Math.max(1, Math.floor(c / e)), i = Math.min(d, t);
  return { firstIdx: Math.max(0, t - i - Math.floor(l / e)), count: i, slotW: e };
}
function Il(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, r = 0;
  const c = Math.min(t.length, n + e);
  for (let i = n; i < c; i++) {
    const f = t[i];
    f && (f.low < l && (l = f.low), f.high > a && (a = f.high), f.volume > r && (r = f.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const i = isFinite(l) ? l : 0;
    return { min: i - 1, max: i + 1, maxVol: Math.max(1, r) };
  }
  const d = (a - l) * 0.04;
  return { min: l - d, max: a + d, maxVol: Math.max(1, r) };
}
function Rl(t, n, e = !1) {
  const l = e ? Sl : Zt, a = Math.max(1, t - pt - l - Yt), r = Math.max(0, Math.round(a * n)), c = a - r;
  return {
    priceY0: pt,
    priceY1: pt + c,
    volumeY0: pt + c + Yt,
    volumeY1: pt + c + Yt + r
  };
}
function Be(t, n, e, l) {
  const a = n.max - n.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / a) * (l - e);
}
function Ze(t, n, e) {
  return Ye + (t - n + 0.5) * e;
}
function Ge(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function Qt(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${r}`;
}
function El(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * l;
}
function vn(t, n) {
  var T, p, S, v, g;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = kt[n.theme] ?? kt.none, c = n.colors ? { ...r, ...n.colors } : r, d = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = c.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const i = Ll(n.candles.length, l, n.slotW, n.scrollX, d), f = Il(n.candles, i.firstIdx, i.count), u = Rl(a, n.showVolume ? n.volumeFraction : 0, d), m = Math.max(Cl, Math.floor(n.slotW * 0.7)), h = Math.min(n.candles.length, i.firstIdx + i.count);
  for (let M = i.firstIdx; M < h; M++) {
    const A = n.candles[M];
    if (!A) continue;
    const U = Ze(M, i.firstIdx, n.slotW), I = Be(A.open, f, u.priceY0, u.priceY1), w = Be(A.close, f, u.priceY0, u.priceY1), C = Be(A.high, f, u.priceY0, u.priceY1), W = Be(A.low, f, u.priceY0, u.priceY1), B = A.close >= A.open, oe = B ? c.wickBull : c.wickBear, ne = B ? c.candleBull : c.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = ne), e.strokeStyle = oe, e.lineWidth = kl, e.beginPath(), e.moveTo(Math.round(U) + 0.5, C), e.lineTo(Math.round(U) + 0.5, W), e.stroke(), e.fillStyle = ne;
    const ae = Math.min(I, w), le = Math.max(1, Math.abs(w - I)), $ = Math.round(U - m / 2), Q = Math.round(ae), me = Math.round(le);
    if (e.fillRect($, Q, m, me), n.glow && (e.shadowBlur = 4, e.fillRect($, Q, m, me)), e.shadowBlur = 0, n.showVolume && f.maxVol > 0) {
      const ee = Math.round(A.volume / f.maxVol * (u.volumeY1 - u.volumeY0));
      ee > 0 && (e.fillStyle = B ? c.volumeBull : c.volumeBear, e.fillRect(
        Math.round(U - m / 2),
        u.volumeY1 - ee,
        m,
        ee
      ));
    }
  }
  if ((T = n.overlays) != null && T.length) {
    const M = { above: 0, below: 0 }, A = n.overlays.filter((I) => I.kind !== "hline" && !!I.label).length, U = A ? 14 + 14 * A + 12 : 8;
    for (const I of n.overlays)
      I.kind === "hline" ? Al(e, I, l, f, u, c, d, M, U) : Dl(e, I, i, f, u, n.slotW);
  }
  (p = n.markers) != null && p.length && Hl(e, c, n.markers, n.candles, i, f, u, n.slotW), Vl(e, c, f, u, l, d), d || ($l(e, c, n.candles, i, n.slotW, a), zl(e, c, n.candles, l, a)), (S = n.overlays) != null && S.length && _l(e, c, n.overlays, u), n.hover && (Nl(e, c, n.candles, i, f, u, n.slotW, n.hover, l), Bl(e, c, n.candles, i, n.slotW, n.hover, u, ((v = n.overlays) == null ? void 0 : v.length) ?? 0), (g = n.markers) != null && g.length && Wl(e, c, n.markers, n.candles, i, f, u, n.slotW, n.hover, l)), e.restore();
}
function Dl(t, n, e, l, a, r) {
  var d;
  const c = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    Mt(t, n.data, e.firstIdx, c, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const i = Sn(n.color, n.fillAlpha ?? 0.08);
    Fl(t, n.upper, n.lower, e.firstIdx, c, r, l, a, i), Mt(t, n.upper, e.firstIdx, c, r, l, a, n.color, 1, !1), Mt(t, n.lower, e.firstIdx, c, r, l, a, n.color, 1, !1), (d = n.middle) != null && d.length && Mt(t, n.middle, e.firstIdx, c, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function Al(t, n, e, l, a, r, c, d = { above: 0, below: 0 }, i = 8) {
  const f = Be(n.price, l, a.priceY0, a.priceY1), u = f < a.priceY0 - 0.5, m = f > a.priceY1 + 0.5, h = u || m, T = h ? u ? d.above++ : d.below++ : 0, p = h ? u ? a.priceY0 + i + T * 20 : a.priceY1 - 8 - T * 20 : f, S = c ? Jt : je, v = Math.round(p) + 0.5;
  t.save(), h || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, v), t.lineTo(e - S, v), t.stroke(), t.setLineDash([]));
  let g = n.label ?? Ge(n.price);
  if (h && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    t.font = Oe, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(g).width, A = 4, U = 2, I = Ye + 2;
    t.fillStyle = n.color, h && (t.globalAlpha = 0.85), t.fillRect(I, p - 7 - U, M + A * 2, 14 + U * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(g, I + A, p);
  }
  t.restore();
}
function Mt(t, n, e, l, a, r, c, d, i, f) {
  if (!n || !n.length) return;
  t.strokeStyle = d, t.lineWidth = i, t.setLineDash(f ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let m = e; m < l; m++) {
    const h = n[m];
    if (typeof h != "number" || !isFinite(h)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const T = Ze(m, e, a), p = Be(h, r, c.priceY0, c.priceY1);
    u ? t.lineTo(T, p) : (t.moveTo(T, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function Fl(t, n, e, l, a, r, c, d, i) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = i;
  let f = !1, u = -1;
  for (let m = l; m <= a; m++) {
    const h = n[m], T = e[m], p = m < a && typeof h == "number" && typeof T == "number" && isFinite(h) && isFinite(T);
    if (p && !f && (u = m, f = !0), !p && f || m === a && f) {
      const S = p ? m + 1 : m;
      t.beginPath();
      for (let v = u; v < S; v++) {
        const g = Ze(v, l, r), M = Be(n[v], c, d.priceY0, d.priceY1);
        v === u ? t.moveTo(g, M) : t.lineTo(g, M);
      }
      for (let v = S - 1; v >= u; v--) {
        const g = Ze(v, l, r), M = Be(e[v], c, d.priceY0, d.priceY1);
        t.lineTo(g, M);
      }
      t.closePath(), t.fill(), f = !1;
    }
  }
}
function Sn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function _l(t, n, e, l) {
  const a = e.filter((S) => S.kind !== "hline" && !!S.label);
  if (!a.length) return;
  t.save(), t.font = Oe;
  const r = 8, c = 5, d = 12, i = 6, f = 14;
  let u = 0;
  for (const S of a) {
    const v = t.measureText(S.label).width;
    v > u && (u = v);
  }
  const m = r * 2 + d + i + u, h = c * 2 + f * a.length, T = Ye + 4, p = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(T, p, m, h), t.textBaseline = "middle", t.textAlign = "left";
  for (let S = 0; S < a.length; S++) {
    const v = a[S], g = p + c + f * (S + 0.5), M = T + r;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(M, g), t.lineTo(M + d, g), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = Sn(v.color, v.fillAlpha ?? 0.2), t.fillRect(M, g - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(M + 0.5, g - 4 + 0.5, d - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, M + d + i, g);
  }
  t.restore();
}
function Bl(t, n, e, l, a, r, c, d) {
  const i = Math.floor((r.x - Ye) / a), f = l.firstIdx + i;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const m = u.close - u.open, h = u.open !== 0 ? m / u.open * 100 : 0, T = m >= 0 ? "+" : "", p = [
    ["O", Ge(u.open), void 0],
    ["H", Ge(u.high), void 0],
    ["L", Ge(u.low), void 0],
    ["C", Ge(u.close), void 0],
    ["V", Yl(u.volume), void 0],
    ["", `${T}${h.toFixed(2)}%`, m >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Oe, t.textBaseline = "middle", t.textAlign = "left";
  const S = 8, v = 4, g = 14;
  let M = S;
  for (const [w, C] of p) {
    const W = w ? `${w} ${C}` : C, B = t.measureText(W).width + 12;
    M += B;
  }
  M += S - 12;
  const A = c.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), U = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(U, A, M, g + v * 2);
  let I = U + S;
  for (let w = 0; w < p.length; w++) {
    const [C, W, B] = p[w];
    t.fillStyle = n.text, C && (t.globalAlpha = 0.6, t.fillText(C + " ", I, A + v + g / 2), t.globalAlpha = 1, I += t.measureText(C + " ").width), B && (t.fillStyle = B), t.fillText(W, I, A + v + g / 2), I += t.measureText(W).width + 12;
  }
  t.restore();
}
function Yl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Wl(t, n, e, l, a, r, c, d, i, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, m = Math.max(1, u * 0.5), h = Math.min(l.length, a.firstIdx + a.count), T = 9;
  let p = null;
  for (const W of e) {
    let B = 0, oe = l.length - 1, ne = -1;
    for (; B <= oe; ) {
      const $ = B + oe >> 1, Q = l[$].start - W.timestamp;
      if (Math.abs(Q) <= m) {
        ne = $;
        break;
      }
      Q < 0 ? B = $ + 1 : oe = $ - 1;
    }
    if (ne < 0 || ne < a.firstIdx || ne >= h) continue;
    const ae = Ze(ne, a.firstIdx, d), le = Be(W.price, r, c.priceY0, c.priceY1);
    if (Math.abs(i.x - ae) <= T && Math.abs(i.y - le) <= T) {
      p = { m: W, x: ae, y: le };
      break;
    }
  }
  if (!p) return;
  const S = Qt(p.m.timestamp), v = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${S}`,
    `@ ${Ge(p.m.price)}`
  ];
  p.m.label && v.push(p.m.label), t.save(), t.font = Oe, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, M = 14;
  let A = 0;
  for (const W of v) {
    const B = t.measureText(W).width;
    B > A && (A = B);
  }
  const U = A + g * 2, I = v.length * M + g * 2;
  let w = p.x + 12;
  w + U > f - je && (w = p.x - 12 - U);
  let C = p.y - I / 2;
  C < c.priceY0 && (C = c.priceY0), C + I > c.priceY1 && (C = c.priceY1 - I), t.fillStyle = n.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(w, C, U, I), t.strokeRect(w + 0.5, C + 0.5, U - 1, I - 1);
  for (let W = 0; W < v.length; W++) {
    const B = v[W];
    t.fillStyle = W === 0 ? p.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(B, w + g, C + g + W * M);
  }
  t.restore();
}
function zl(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, c = Pl(r);
  if (!c) return;
  t.save(), t.font = Oe, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, i = 3, f = t.measureText(c).width, u = l - je - d, m = a - Zt + 4;
  t.fillStyle = n.accent, t.fillRect(u - f - d, m - i, f + d * 2, 14 + i * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(c, u, m), t.restore();
}
function Pl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function Hl(t, n, e, l, a, r, c, d) {
  if (!l.length) return;
  const i = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, i * 0.5), u = Math.min(l.length, a.firstIdx + a.count), m = (T) => {
    let p = 0, S = l.length - 1;
    for (; p <= S; ) {
      const v = p + S >> 1, g = l[v].start - T;
      if (Math.abs(g) <= f) return v;
      g < 0 ? p = v + 1 : S = v - 1;
    }
    return -1;
  }, h = 7;
  for (const T of e) {
    const p = m(T.timestamp);
    if (p < 0 || p < a.firstIdx || p >= u) continue;
    const S = Ze(p, a.firstIdx, d), v = Be(T.price, r, c.priceY0, c.priceY1);
    if (v < c.priceY0 || v > c.priceY1) continue;
    const g = T.color ?? (T.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), T.kind === "entry" ? (t.moveTo(S, v - h), t.lineTo(S - h, v + h - 1), t.lineTo(S + h, v + h - 1)) : (t.moveTo(S, v + h), t.lineTo(S - h, v - h + 1), t.lineTo(S + h, v - h + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Vl(t, n, e, l, a, r = !1) {
  const c = e.max - e.min;
  if (c <= 0) return;
  const d = l.priceY1 - l.priceY0, i = r ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, f = El(c, i), u = Math.ceil(e.min / f) * f, m = r ? Jt : je;
  t.font = r ? Tl : Oe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let h = u; h <= e.max; h += f) {
    const T = Be(h, e, l.priceY0, l.priceY1);
    T < l.priceY0 || T > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(T) + 0.5), t.lineTo(a - m, Math.round(T) + 0.5), t.stroke(), t.fillText(Ge(h), a - m + 3, T));
  }
  t.globalAlpha = 1;
}
function $l(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(l.count / 6));
  t.font = Oe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const i = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < i; f += d) {
    const u = e[f];
    if (!u) continue;
    const m = Ze(f, l.firstIdx, a);
    t.fillText(Qt(u.start), m, r - Zt + 4);
  }
  t.globalAlpha = 1;
}
function Nl(t, n, e, l, a, r, c, d, i) {
  const f = Math.floor((d.x - Ye) / c), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), m = e[u];
  if (!m) return;
  const h = Ze(u, l.firstIdx, c);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(h) + 0.5, r.priceY0), t.lineTo(Math.round(h) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const T = Math.max(r.priceY0, Math.min(r.priceY1, d.y));
  t.beginPath(), t.moveTo(Ye, Math.round(T) + 0.5), t.lineTo(i - je, Math.round(T) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = a.max - a.min;
  if (p > 0) {
    const g = a.max - (T - r.priceY0) / (r.priceY1 - r.priceY0) * p, M = Ge(g);
    t.font = Oe, t.textBaseline = "middle", t.textAlign = "left";
    const A = t.measureText(M).width, U = 4, I = 2;
    t.fillStyle = n.accent, t.fillRect(i - je + 2, T - 7 - I, A + U * 2, 14 + I * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(M, i - je + 2 + U, T);
  }
  t.font = Oe, t.textBaseline = "top", t.textAlign = "center";
  const S = Qt(m.start), v = t.measureText(S).width;
  t.fillStyle = n.accent, t.fillRect(h - v / 2 - 4, r.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(S, h, r.volumeY1 + 4), t.restore();
}
const Wt = 0.25, zt = 6, Ol = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Xl = /* @__PURE__ */ tt({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Ml },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = z(null), l = z(null), a = { ...ke }, r = z(0), c = z(0), d = z(0), i = z(1), f = z(null), u = q(() => Math.max(1, n.slotW * i.value));
    let m = null, h = !1;
    function T() {
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
    let p, S, v, g, M;
    const A = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Ot}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): inward sampling would push edge content (headers, first/
    // last columns) off-screen entirely, so the displacement is faded to zero
    // at the rectangle border: the FRAME stays pinned and the glass dishes
    // inward — no content is ever lost, the bow reads through interior rows.
    // (Physically truer to a tube, too: the bezel doesn't move.)
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * abs(uStrength);
    vec2  d    = cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      d *= (1.0 - 4.0 * cc.x * cc.x) * (1.0 - 4.0 * cc.y * cc.y);
    }
    return uv + d;
  }

  ${Xt}

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

    ${Ut}

    gl_FragColor = color;
  }
`;
    function U() {
      if (!(!l.value || !e.value)) {
        if (M = document.createElement("canvas"), n.flat) {
          h = !0, I();
          return;
        }
        try {
          m = new O.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          h = !0;
        }
        if (!h && !m.getContext() && (m.dispose(), m = null, h = !0), h) {
          I();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), p = new O.Scene(), S = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new O.CanvasTexture(M), g.minFilter = O.LinearFilter, g.magFilter = O.LinearFilter, v = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Kt()
          },
          vertexShader: Ol,
          fragmentShader: A,
          transparent: !0
        }), p.add(new O.Mesh(new O.PlaneGeometry(2, 2), v)), I();
      }
    }
    function I() {
      if (!e.value || !m && !h) return;
      const R = e.value.clientWidth, V = e.value.clientHeight;
      !R || !V || !(M.width !== R || M.height !== V) || (M.width = R, M.height = V, r.value = R, c.value = V, m ? (g && (g.dispose(), g = new O.CanvasTexture(M), g.minFilter = O.LinearFilter, g.magFilter = O.LinearFilter, v && (v.uniforms.uTex.value = g)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(R, V)) : l.value && (l.value.width = R, l.value.height = V, l.value.style.width = R + "px", l.value.style.height = V + "px"), w());
    }
    function w() {
      if (!(M != null && M.width)) return;
      if (h) {
        if (!l.value) return;
        vn(M, {
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
        const V = l.value.getContext("2d");
        V && (V.clearRect(0, 0, l.value.width, l.value.height), V.drawImage(M, 0, 0));
        return;
      }
      if (!m || !v || !g) return;
      const R = n.theme === "paper";
      v.uniforms.uStrength.value = yt(n.curvature), v.uniforms.uScanlines.value = n.scanlines && !R ? 1 : 0, v.uniforms.uVignette.value = R ? 0 : 1, Gt(v, n.magnify, a, M.width, M.height), vn(M, {
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
      }), g.needsUpdate = !0, m.render(p, S);
    }
    X(() => n.theme, () => w()), X(() => n.curvature, () => w()), X(() => n.scanlines, () => w()), X(() => n.glow, () => w()), X(() => n.showVolume, () => w()), X(() => n.volumeFraction, () => w()), X(() => n.slotW, () => w()), X(() => n.candles, () => w(), { deep: !1 }), X(() => n.overlays, () => w(), { deep: !1 }), X(() => n.markers, () => w(), { deep: !1 }), X(() => n.compact, () => w()), X(() => n.magnify, (R) => {
      R || (a.x = ke.x, a.y = ke.y), w();
    }), X(() => n.colors, () => w(), { deep: !0 }), X(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), X(d, () => w()), X(i, () => w()), X(f, () => w()), X(u, () => w());
    let C = null, W = null, B = 0;
    const oe = Rt("cathodeResetTick", z(0));
    X(oe, () => ne());
    function ne() {
      cancelAnimationFrame(B), B = requestAnimationFrame(I);
    }
    function ae(R) {
      R.preventDefault();
    }
    function le() {
      m == null || m.dispose(), m = null, h = !1, U();
    }
    function $(R) {
      if (!l.value) return [-1, -1];
      const V = l.value.getBoundingClientRect();
      return [R.clientX - V.left, R.clientY - V.top];
    }
    function Q(R) {
      var Ae;
      const V = u.value;
      if (V <= 0) return 0;
      const J = ((Ae = n.candles) == null ? void 0 : Ae.length) ?? 0, fe = Math.max(1, Math.floor((r.value || 1) / V)), Re = Math.max(0, J - fe);
      return Math.max(0, Math.min(R, Re * V));
    }
    function me(R) {
      var fe;
      if (R.deltaX !== 0 || R.shiftKey && R.deltaY !== 0) {
        const Re = R.deltaX !== 0 ? R.deltaX : R.deltaY;
        d.value = Q(d.value + Re);
        return;
      }
      if (R.deltaY === 0) return;
      const [V] = $(R), J = u.value;
      if (V >= 0 && J > 0 && ((fe = n.candles) != null && fe.length)) {
        const Re = Math.max(1, Math.floor((r.value || 1) / J)), Xe = Math.max(0, n.candles.length - Re - Math.floor(d.value / J)) + (V - 8) / J, Ue = Math.exp(-R.deltaY * 15e-4), Fe = Math.max(Wt, Math.min(zt, i.value * Ue));
        i.value = Fe;
        const Je = n.slotW * Fe, at = Math.max(1, Math.floor((r.value || 1) / Je)), We = Xe - (V - 8) / Je, $e = Math.max(0, n.candles.length - at - We);
        d.value = Q($e * Je);
      } else {
        const Re = Math.exp(-R.deltaY * 15e-4);
        i.value = Math.max(Wt, Math.min(zt, i.value * Re));
      }
    }
    let ee = !1, Z = 0, H = 0;
    function b(R) {
      R.button === 0 && (ee = !0, Z = R.clientX, H = d.value, f.value = null, e.value && e.value.focus());
    }
    function E(R) {
      const V = Math.exp(R * 0.18);
      i.value = Math.max(Wt, Math.min(zt, i.value * V)), d.value = Q(d.value);
    }
    function F(R) {
      const V = u.value, J = R.shiftKey ? 20 : 3;
      switch (R.key) {
        case "ArrowLeft":
          R.preventDefault(), d.value = Q(d.value + V * J);
          break;
        case "ArrowRight":
          R.preventDefault(), d.value = Q(d.value - V * J);
          break;
        case "ArrowUp":
          R.preventDefault(), E(1);
          break;
        case "ArrowDown":
          R.preventDefault(), E(-1);
          break;
        case "Home":
          R.preventDefault(), d.value = Q(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          R.preventDefault(), d.value = 0;
          break;
      }
    }
    function N(R) {
      if (ee) {
        const V = R.clientX - Z;
        d.value = Q(H + V);
        return;
      }
    }
    function K() {
      ee = !1;
    }
    function P(R) {
      if (R.touches.length !== 1) return;
      const V = R.touches[0];
      ee = !0, Z = V.clientX, H = d.value, f.value = null;
    }
    function G(R) {
      if (!ee || R.touches.length !== 1) return;
      R.preventDefault();
      const J = R.touches[0].clientX - Z;
      d.value = Q(H + J);
    }
    function be() {
      ee = !1;
    }
    function ue(R) {
      if (n.magnify && l.value) {
        const fe = jt(R, l.value);
        a.x = fe.x, a.y = fe.y, w();
      }
      if (ee) return;
      const [V, J] = $(R);
      if (V < 0 || J < 0) {
        f.value = null;
        return;
      }
      f.value = { x: V, y: J };
    }
    function Le() {
      f.value = null, a.x = ke.x, a.y = ke.y, w();
    }
    qe(() => {
      document.addEventListener("mousemove", N), document.addEventListener("mouseup", K), Ve(() => {
        var R;
        U(), l.value && (l.value.addEventListener("webglcontextlost", ae), l.value.addEventListener("webglcontextrestored", le)), e.value && (C = new ResizeObserver(() => I()), C.observe(e.value), W = new IntersectionObserver((V) => {
          V.some((J) => J.isIntersecting) && ne();
        }), W.observe(e.value)), window.addEventListener("resize", ne), (R = window.visualViewport) == null || R.addEventListener("resize", ne);
      });
    }), nt(() => {
      var R, V, J;
      document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", K), (R = l.value) == null || R.removeEventListener("webglcontextlost", ae), (V = l.value) == null || V.removeEventListener("webglcontextrestored", le), C == null || C.disconnect(), W == null || W.disconnect(), window.removeEventListener("resize", ne), (J = window.visualViewport) == null || J.removeEventListener("resize", ne), cancelAnimationFrame(B), T();
    });
    const Te = q(() => kt[n.theme] ?? kt.none), Ie = q(() => ({
      background: Te.value.bg
    }));
    return (R, V) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: _e(Ie.value),
      tabindex: "0",
      onKeydown: F
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: Ke(me, ["prevent"]),
        onMousedown: b,
        onMousemove: ue,
        onMouseleave: Le,
        onTouchstartPassive: P,
        onTouchmove: G,
        onTouchend: be,
        onTouchcancel: be
      }, null, 544)
    ], 36));
  }
}), xo = /* @__PURE__ */ lt(Xl, [["__scopeId", "data-v-684fe641"]]), en = z(0), Vt = 28, ct = 12;
let $t = 10, Lt = "cathode.layout", It = !1;
const Se = z({});
function Ul(t, n = "cathode.layout") {
  if (!It) {
    It = !0, Lt = n;
    try {
      const e = localStorage.getItem(Lt);
      if (e) {
        Se.value = JSON.parse(e), hn();
        return;
      }
    } catch {
    }
    Se.value = { ...t }, hn();
  }
}
function hn() {
  let t = 10;
  for (const n of Object.values(Se.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  $t = t;
}
function ot() {
  localStorage.setItem(Lt, JSON.stringify(Se.value));
}
function Kl(t) {
  It = !1, localStorage.removeItem(Lt), Se.value = { ...t }, ot(), It = !0, en.value++;
}
function Tn(t) {
  $t++, Se.value[t] && (Se.value[t].zIndex = $t);
}
function Gl(t, n) {
  Se.value[t].visible = n, ot();
}
function jl(t, n) {
  Se.value[t].minimized = n, n && (Se.value[t].maximized = !1), ot();
}
function ql(t, n) {
  Se.value[t].maximized = n, n && (Se.value[t].minimized = !1, Tn(t)), ot();
}
function Zl(t, n, e) {
  Se.value[t].x = Math.round(n), Se.value[t].y = Math.round(e), ot();
}
function Jl(t, n, e) {
  Se.value[t].w = Math.round(n), Se.value[t].h = Math.round(e), ot();
}
function Mo(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - ct * (l + 1)) / l), c = Math.floor((n - ct * (a + 1)) / a), d = {};
  return e.forEach((i, f) => {
    const u = f % l, m = Math.floor(f / l);
    d[i] = {
      x: ct + u * (r + ct),
      y: ct + m * (c + ct),
      w: r,
      h: c,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: f + 1
    };
  }), d;
}
function Cn() {
  return {
    containers: Se,
    TITLEBAR_H: Vt,
    load: Ul,
    save: ot,
    reset: Kl,
    bringToFront: Tn,
    setVisible: Gl,
    setMinimized: jl,
    setMaximized: ql,
    updatePos: Zl,
    updateSize: Jl
  };
}
const Ql = { class: "ws-toolbar" }, eo = {
  key: 0,
  class: "ws-restore-menu"
}, to = {
  key: 0,
  class: "ws-restore-empty"
}, no = ["onClick"], lo = /* @__PURE__ */ tt({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = Cn(), c = z(null);
    rn("cathodeWorkspace", c), rn("cathodeResetTick", en), qe(() => {
      if (!c.value) return;
      const { clientWidth: v, clientHeight: g } = c.value, M = n.initialLayout ?? {};
      l(M, n.storageKey ?? "cathode.layout");
      const A = Object.keys(e.value)[0];
      A && d(A);
    });
    function d(v) {
      var M;
      document.querySelectorAll(".cc").forEach((A) => A.classList.remove("cc-focused"));
      const g = (M = c.value) == null ? void 0 : M.querySelector(`#cc-${v}`);
      g && g.classList.add("cc-focused");
    }
    function i() {
      !c.value || !n.initialLayout || a(n.initialLayout);
    }
    function f(v) {
      const g = v.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = z(!1), m = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function h(v) {
      r(v, !0), u.value = !1;
    }
    function T(v) {
      if (!u.value) return;
      const g = v.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function p(v) {
      v.key === "Escape" && (u.value = !1);
    }
    qe(() => {
      document.addEventListener("click", T), document.addEventListener("keydown", p);
    }), nt(() => {
      document.removeEventListener("click", T), document.removeEventListener("keydown", p);
    });
    function S(v) {
      var g;
      return ((g = n.containerTitles) == null ? void 0 : g[v]) ?? v;
    }
    return (v, g) => (we(), ye("div", {
      ref_key: "workspaceEl",
      ref: c,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      Pt(v.$slots, "default", {}, void 0, !0),
      Pt(v.$slots, "overlay", {}, void 0, !0),
      se("div", Ql, [
        t.initialLayout ? (we(), ye("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: i
        }, " ↺ Reset Layout ")) : He("", !0),
        g[1] || (g[1] = se("div", { class: "ws-sep" }, null, -1)),
        se("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (M) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      gn($n, { name: "menu" }, {
        default: Nn(() => [
          u.value ? (we(), ye("div", eo, [
            g[3] || (g[3] = se("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? He("", !0) : (we(), ye("div", to, " No closed panels ")),
            (we(!0), ye(On, null, Xn(m(), (M) => (we(), ye("div", {
              key: M,
              class: "ws-restore-item",
              onClick: (A) => h(M)
            }, [
              g[2] || (g[2] = se("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Un(" " + Pe(S(M)), 1)
            ], 8, no))), 128))
          ])) : He("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), So = /* @__PURE__ */ lt(lo, [["__scopeId", "data-v-5838d04b"]]), oo = ["id"], ao = { class: "cc-title" }, ro = {
  key: 0,
  class: "cc-size-badge"
}, io = { class: "cc-controls" }, so = ["title"], co = { class: "cc-body" }, uo = 200, fo = 80, mn = 60, vo = /* @__PURE__ */ tt({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: c, updatePos: d, updateSize: i } = Cn(), f = Rt("cathodeWorkspace", z(null)), u = q(() => e.value[n.id]), m = q(() => {
      const b = u.value, E = n.curvature ?? 0;
      if (!b) return {};
      const F = { "--curvature": Math.abs(E) };
      return b.maximized ? { ...F, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: b.zIndex } : {
        ...F,
        left: b.x + "px",
        top: b.y + "px",
        width: b.w + "px",
        height: b.minimized ? Vt + "px" : b.h + "px",
        zIndex: b.zIndex,
        display: b.visible ? "flex" : "none"
      };
    });
    let h = !1, T = 0, p = 0;
    function S(b) {
      var N;
      if (b.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), h = !0;
      const E = (N = f.value) == null ? void 0 : N.querySelector(`#cc-${n.id}`);
      if (!E) return;
      const F = E.getBoundingClientRect();
      T = b.clientX - F.left, p = b.clientY - F.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), b.preventDefault();
    }
    function v(b) {
      var P;
      if (!h || !f.value) return;
      const E = f.value.getBoundingClientRect(), F = ((P = u.value) == null ? void 0 : P.w) ?? 300;
      let N = b.clientX - E.left - T, K = b.clientY - E.top - p;
      N = Math.max(mn - F, Math.min(E.width - mn, N)), K = Math.max(0, Math.min(E.height - Vt, K)), d(n.id, N, K);
    }
    function g() {
      h = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let M = !1, A = 0, U = 0, I = 0, w = 0;
    const C = z("");
    function W(b) {
      u.value.maximized || (l(n.id), M = !0, A = b.clientX, U = b.clientY, I = u.value.w, w = u.value.h, document.addEventListener("mousemove", B), document.addEventListener("mouseup", oe), b.preventDefault(), b.stopPropagation());
    }
    function B(b) {
      if (!M) return;
      const E = Math.max(uo, I + (b.clientX - A)), F = Math.max(fo, w + (b.clientY - U));
      i(n.id, E, F), C.value = `${Math.round(E)}×${Math.round(F)}`;
    }
    function oe() {
      M = !1, C.value = "", document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", oe), ne.value++;
    }
    const ne = z(0);
    X(en, () => {
      ne.value++;
    }), nt(() => {
      var b;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", oe), (b = ae.value) == null || b.removeEventListener("scroll", $), Q();
    });
    const ae = z(null);
    function le(b) {
      if (n.canvas) return [];
      const E = b.children[0];
      return E ? Array.from(E.children) : [];
    }
    function $() {
      const b = ae.value, E = n.curvature ?? 0;
      if (!b) return;
      const F = le(b);
      if (!F.length) return;
      const N = b.clientHeight, K = N / 2, P = E * 38e-4;
      F.forEach((G) => {
        if (!G.dataset.origFs) {
          const fe = getComputedStyle(G);
          G.dataset.origFs = fe.fontSize, G.dataset.origLh = fe.lineHeight;
        }
        if (E === 0) {
          G.style.fontSize = "", G.style.lineHeight = "";
          return;
        }
        const be = G.getBoundingClientRect(), ue = b.getBoundingClientRect(), Le = be.top - ue.top + be.height / 2, Te = Math.min(1, Math.abs(Le - K) / (N / 2)), Ie = 1 + P * Math.cos(Te * Math.PI / 2), R = parseFloat(G.dataset.origFs), V = G.dataset.origLh, J = V === "normal" ? R * 1.4 : parseFloat(V);
        isNaN(R) || (G.style.fontSize = `${(R * Ie).toFixed(2)}px`), isNaN(J) || (G.style.lineHeight = `${(J * Ie).toFixed(2)}px`);
      });
    }
    function Q() {
      const b = ae.value;
      b && le(b).forEach((E) => {
        E.style.fontSize = "", E.style.lineHeight = "", delete E.dataset.origFs, delete E.dataset.origLh;
      });
    }
    X(() => n.curvature, (b) => {
      (b ?? 0) === 0 ? Q() : $();
    }), qe(() => {
      var b;
      (b = ae.value) == null || b.addEventListener("scroll", $, { passive: !0 }), Ve($);
    });
    function me() {
      r(n.id, !u.value.minimized), Ve(() => {
        ne.value++;
      });
    }
    function ee() {
      c(n.id, !u.value.maximized), Ve(() => {
        ne.value++;
      });
    }
    function Z() {
      a(n.id, !1);
    }
    function H() {
      l(n.id);
    }
    return (b, E) => u.value && u.value.visible ? (we(), ye("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: Kn(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: _e(m.value),
      onMousedown: H
    }, [
      se("div", {
        class: "cc-titlebar",
        onMousedown: S
      }, [
        E[0] || (E[0] = se("span", { class: "cc-status-dot" }, null, -1)),
        se("span", ao, Pe(t.title), 1),
        C.value ? (we(), ye("span", ro, Pe(C.value), 1)) : He("", !0),
        se("div", io, [
          se("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ke(me, ["stop"])
          }, "─"),
          se("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Ke(ee, ["stop"])
          }, Pe(u.value.maximized ? "⤡" : "⤢"), 9, so),
          se("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ke(Z, ["stop"])
          }, "✕")
        ])
      ], 32),
      pn(se("div", co, [
        se("div", {
          ref_key: "bodyEl",
          ref: ae,
          class: "cc-screen",
          onScroll: $
        }, [
          Pt(b.$slots, "default", { resizeKey: ne.value }, void 0, !0),
          E[1] || (E[1] = se("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Gn, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (we(), ye("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ke(W, ["stop"])
      }, null, 32)) : He("", !0)
    ], 46, oo)) : He("", !0);
  }
}), To = /* @__PURE__ */ lt(vo, [["__scopeId", "data-v-ca0af4ca"]]), ho = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, mo = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    // Signed bend: magnitude from |strength|, direction applied after.
    // CONVEX (+): classic barrel — corners sample past the texture → bezel.
    // CONCAVE (−): inward sampling would push edge content (headers, first/
    // last columns) off-screen entirely, so the displacement is faded to zero
    // at the rectangle border: the FRAME stays pinned and the glass dishes
    // inward — no content is ever lost, the bow reads through interior rows.
    // (Physically truer to a tube, too: the bezel doesn't move.)
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * abs(uStrength);
    vec2  d    = cc * (1.0 + dist) * dist * sign(uStrength);
    if (uStrength < 0.0) {
      d *= (1.0 - 4.0 * cc.x * cc.x) * (1.0 - 4.0 * cc.y * cc.y);
    }
    return uv + d;
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
`, go = 100, po = /* @__PURE__ */ tt({
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
    }, l = z(null), a = z(null);
    let r = null, c = !1;
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
    let i, f, u, m, h, T = null, p = 0;
    function S(w) {
      w - p >= go && (M(), p = w), T = requestAnimationFrame(S);
    }
    function v() {
      if (!l.value || !h) return;
      const w = l.value.clientWidth, C = l.value.clientHeight;
      w <= 0 || C <= 0 || h.width === w && h.height === C || (h.width = w, h.height = C, r && r.setSize(w, C, !1), a.value && (a.value.width = w, a.value.height = C, a.value.style.width = w + "px", a.value.style.height = C + "px"));
    }
    function g() {
      if (!(h != null && h.width)) return;
      const w = h.getContext("2d");
      if (!w) return;
      const C = h.width, W = h.height, B = e[n.theme] ?? e.none;
      w.clearRect(0, 0, C, W), w.fillStyle = B.bg, w.fillRect(0, 0, C, W);
      const oe = Date.now(), ne = (oe / 500 | 0) % 2 === 0, ae = (oe / 400 | 0) % 4;
      w.font = `bold ${Math.max(14, Math.min(C, W) * 0.06)}px monospace`, w.textAlign = "center", w.textBaseline = "middle", w.fillStyle = B.text, n.glow && (w.shadowColor = B.text, w.shadowBlur = 14);
      const le = ".".repeat(ae).padEnd(3, " "), $ = `${n.label}${le}`;
      if (w.fillText($, C / 2, W / 2), w.shadowBlur = 0, ne) {
        const Q = w.measureText($), me = w.measureText("M").width, ee = parseFloat(w.font), Z = C / 2 + Q.width / 2 + 4, H = W / 2 - ee / 2 + 2;
        w.fillStyle = B.cursor, n.glow && (w.shadowColor = B.cursor, w.shadowBlur = 12), w.fillRect(Z, H, me * 0.7, ee * 0.95), w.shadowBlur = 0;
      }
    }
    function M() {
      if (!h) return;
      if (g(), c) {
        if (!a.value) return;
        const C = a.value.getContext("2d");
        C && C.drawImage(h, 0, 0);
        return;
      }
      if (!r || !u || !m) return;
      const w = n.theme === "paper";
      u.uniforms.uStrength.value = yt(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !w ? 1 : 0, u.uniforms.uVignette.value = w ? 0 : 1, m.needsUpdate = !0, r.render(i, f);
    }
    function A() {
      if (!(!a.value || !l.value)) {
        h = document.createElement("canvas");
        try {
          r = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          c = !0;
        }
        if (!c && !r.getContext() && (r.dispose(), r = null, c = !0), c) {
          v();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), i = new O.Scene(), f = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new O.CanvasTexture(h), m.minFilter = O.LinearFilter, m.magFilter = O.LinearFilter, u = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: ho,
          fragmentShader: mo,
          transparent: !0
        }), i.add(new O.Mesh(new O.PlaneGeometry(2, 2), u)), v();
      }
    }
    let U = null;
    qe(() => {
      A(), M(), T = requestAnimationFrame(S), l.value && (U = new ResizeObserver(() => v()), U.observe(l.value));
    }), nt(() => {
      T !== null && cancelAnimationFrame(T), U == null || U.disconnect(), d(), m == null || m.dispose(), u == null || u.dispose();
    }), X(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => M());
    const I = q(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (w, C) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: _e(I.value)
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Co = /* @__PURE__ */ lt(po, [["__scopeId", "data-v-a9decc41"]]);
export {
  kt as CANDLE_THEME_COLORS,
  xo as CathodeCandle,
  To as CathodeContainer,
  yo as CathodeGrid,
  Co as CathodeLoader,
  yl as CathodeLog,
  bo as CathodeTerminal,
  So as CathodeWorkspace,
  Ct as LOG_THEME_COLORS,
  Mo as buildDefaultLayout,
  Cn as useCathodeLayout
};
