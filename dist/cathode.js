import { defineComponent as tt, ref as z, reactive as At, computed as q, watch as O, inject as It, nextTick as $e, onMounted as qe, onUnmounted as nt, openBlock as we, createElementBlock as ye, normalizeStyle as _e, createElementVNode as se, withModifiers as Ke, withKeys as Pn, createCommentVNode as He, toDisplayString as Pe, createVNode as mn, withDirectives as gn, vModelText as Hn, provide as an, renderSlot as zt, Transition as $n, withCtx as Vn, Fragment as Xn, renderList as Nn, createTextVNode as On, normalizeClass as Un, vShow as Kn } from "vue";
import * as N from "three";
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
}, ge = 30, Pt = 12, Gn = 10, Mt = 14, pn = 5;
function wn() {
  return `${Pt}px system-ui, -apple-system, sans-serif`;
}
function yn(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const r = [];
  let u = "";
  for (const f of a) {
    const s = u ? u + " " + f : f;
    !u || t.measureText(s).width <= e ? u = s : (r.push(u), u = f);
  }
  return u && r.push(u), r.length ? r : [""];
}
function jn(t, n) {
  return Math.max(n, t * Mt + pn * 2);
}
function Vt(t, n) {
  const e = new Array(n + 1);
  e[0] = 0;
  for (let l = 0; l < n; l++) e[l + 1] = e[l] + (t[l] ?? 0);
  return e;
}
function St(t, n) {
  if (n <= 0) return 0;
  let e = 0, l = t.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    t[a] <= n ? e = a : l = a - 1;
  }
  return e;
}
const bn = 28;
function qn(t, n) {
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
function rn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = ut[n.theme] ?? ut.none, { cols: u, rows: f, pinnedRows: s, rowHeight: d, scrollY: c, scrollX: m, glow: h } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const T = s.length * d, p = n.aggregateRow ? bn : 0, S = a - ge - T - p;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, ge), e.textBaseline = "middle", e.textAlign = "left";
  let v = -m;
  for (let H = 0; H < u.length; H++) {
    const b = u[H];
    if (v + b.width <= 0) {
      v += b.width;
      continue;
    }
    if (v >= l) break;
    const D = !!n.colFilters[b.colId], F = n.sortColId === b.colId, X = (b.colDef.headerName ?? b.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, b.width, ge), e.clip(), e.font = `bold ${Gn}px system-ui, -apple-system, sans-serif`, e.fillStyle = D ? r.accent : r.textHeader, h ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(X, v + 8, ge / 2), e.shadowBlur = 4, e.fillText(X, v + 8, ge / 2), e.shadowBlur = 0) : e.fillText(X, v + 8, ge / 2), F) {
      const K = e.measureText(X).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", v + 8 + K + 4, ge / 2);
    }
    b.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = D ? r.accent : r.textHeader, e.globalAlpha = D ? 1 : 0.38, e.fillText("⌕", v + b.width - 20, ge / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + b.width - 0.5, 0), e.lineTo(v + b.width - 0.5, ge), e.stroke(), v += b.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ge - 0.5), e.lineTo(l, ge - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ge, l, S), e.clip();
  const g = n.rowHeights && n.rowHeights.length === f.length ? n.rowHeights : null, M = g ? Vt(g, f.length) : null, A = (H) => M ? M[H] : H * d, U = (H) => g ? g[H] : d, I = M ? St(M, c) : Math.max(0, Math.floor(c / d));
  let w;
  if (M)
    for (w = I; w < f.length && A(w) < c + S; ) w++;
  else
    w = Math.min(f.length, Math.ceil((c + S) / d));
  const C = n.selectionAnchorRow ?? n.selectedRow, W = n.selectionAnchorCol ?? n.selectedCol, B = n.selectedRow >= 0 && C >= 0 ? Math.min(n.selectedRow, C) : -1, oe = n.selectedRow >= 0 && C >= 0 ? Math.max(n.selectedRow, C) : -1, ne = n.selectedCol >= 0 && W >= 0 ? Math.min(n.selectedCol, W) : -1, ae = n.selectedCol >= 0 && W >= 0 ? Math.max(n.selectedCol, W) : -1, le = oe > B || ae > ne;
  let V = Number.POSITIVE_INFINITY, Q = Number.NEGATIVE_INFINITY, me = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY;
  const Z = (H, b, D, F) => {
    h ? (e.shadowColor = F, e.shadowBlur = 12, e.fillText(H, b, D), e.shadowBlur = 6, e.fillText(H, b, D), e.shadowBlur = 2, e.fillText(H, b, D), e.shadowBlur = 0) : e.fillText(H, b, D);
  };
  for (let H = I; H < w; H++) {
    const b = f[H], D = U(H), F = ge + A(H) - c;
    H % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, F, l, D));
    const X = H >= B && H <= oe;
    H === n.hoveredRow && !X && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, F, l, D)), X && !le && (e.fillStyle = Ft(r.accent, 0.1), e.fillRect(0, F, l, D)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + D - 0.5), e.lineTo(l, F + D - 0.5), e.stroke();
    let K = -m;
    for (let P = 0; P < u.length; P++) {
      const G = u[P];
      if (K + G.width <= 0) {
        K += G.width;
        continue;
      }
      if (K >= l) break;
      const be = X && P >= ne && P <= ae;
      be && le && (e.fillStyle = Ft(r.accent, 0.14), e.fillRect(K, F, G.width, D)), be && (K < V && (V = K), K + G.width > Q && (Q = K + G.width), F < me && (me = F), F + D > ee && (ee = F + D));
      const ue = n.getCellStyle(G, b), Le = ue.color ?? r.text, Te = ue.textAlign ?? "left", Ie = n.formatCell(G, b);
      if (e.save(), e.beginPath(), e.rect(K + 1, F, G.width - 2, D), e.clip(), e.font = wn(), e.fillStyle = Le, e.textBaseline = "middle", G.colDef.wrap) {
        e.textAlign = "left";
        const R = yn(e, Ie, Math.max(20, G.width - 16));
        let $ = F + pn + Mt / 2;
        for (const J of R) {
          if ($ - Mt / 2 >= F + D) break;
          Z(J, K + 8, $, Le), $ += Mt;
        }
      } else {
        const R = Te === "right" ? K + G.width - 8 : K + 8;
        e.textAlign = Te === "right" ? "right" : "left", Z(Ie, R, F + D / 2, Le);
      }
      e.restore(), H === n.selectedRow && P === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(K + 1.5, F + 1.5, G.width - 3, D - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(K + G.width - 0.5, F), e.lineTo(K + G.width - 0.5, F + D), e.stroke(), K += G.width;
    }
  }
  if (le && V < Q && me < ee && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(V + 0.5, me + 0.5, Q - V - 1, ee - me - 1)), e.restore(), s.length > 0) {
    const H = a - T - p;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    for (let b = 0; b < s.length; b++) {
      const D = s[b], F = H + b * d;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, F, l, d);
      let X = -m;
      for (let K = 0; K < u.length; K++) {
        const P = u[K];
        if (X + P.width <= 0) {
          X += P.width;
          continue;
        }
        if (X >= l) break;
        const G = n.getCellStyle(P, D), be = G.color ?? r.text, ue = G.textAlign ?? "left", Le = n.formatCell(P, D);
        e.save(), e.beginPath(), e.rect(X + 1, F, P.width - 2, d), e.clip(), e.font = `bold ${Pt}px system-ui, -apple-system, sans-serif`, e.fillStyle = be, e.textBaseline = "middle", ue === "right" ? (e.textAlign = "right", e.fillText(Le, X + P.width - 8, F + d / 2)) : (e.textAlign = "left", e.fillText(Le, X + 8, F + d / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(X + P.width - 0.5, F), e.lineTo(X + P.width - 0.5, F + d), e.stroke(), X += P.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + d - 0.5), e.lineTo(l, F + d - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const H = a - p;
    e.fillStyle = Ft(r.accent, 0.1), e.fillRect(0, H, l, p), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    let b = -m;
    for (let D = 0; D < u.length; D++) {
      const F = u[D];
      if (b + F.width <= 0) {
        b += F.width;
        continue;
      }
      if (b >= l) break;
      const K = n.getCellStyle(F, n.aggregateRow).textAlign ?? "left", P = n.aggregateRow[F.colId] ?? "";
      e.save(), e.beginPath(), e.rect(b + 1, H, F.width - 2, p), e.clip(), e.font = `bold ${Pt}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", h && (e.shadowColor = r.accent, e.shadowBlur = 8), K === "right" ? (e.textAlign = "right", e.fillText(P, b + F.width - 8, H + p / 2)) : (e.textAlign = "left", e.fillText(P, b + 8, H + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(b + F.width - 0.5, H), e.lineTo(b + F.width - 0.5, H + p), e.stroke(), b += F.width;
    }
  }
  e.restore();
}
function Ft(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
function Zn(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = (l * l + a * a) * e, u = l * (1 + r) * r, f = a * (1 + r) * r;
  return [t + u, n + f * 0.15];
}
function Jn(t, n, e, l, a) {
  const r = t / e, u = 1 - n / l, [f, s] = Zn(r, u, a);
  return f < 0 || f > 1 || s < 0 || s > 1 ? [-1, -1] : [f * e, (1 - s) * l];
}
function _t(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function Qn(t, n, e) {
  return t >= n + e - 24 && t < n + e;
}
function sn(t, n, e) {
  const l = n + e;
  return t >= l - 6 && t <= l + 1;
}
function cn(t, n, e, l, a, r, u, f, s, d = !1, c) {
  const m = t + s;
  let h = -1, T = 0;
  for (let M = 0; M < e.length; M++) {
    if (m >= T && m < T + e[M].width) {
      h = M;
      break;
    }
    T += e[M].width;
  }
  if (n < ge) return { area: "header", colIdx: h, rowIdx: -1 };
  const p = d ? bn : 0;
  if (p > 0 && n >= u - p)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const S = f * a;
  if (S > 0 && n >= u - S - p) {
    const M = Math.floor((n - (u - S - p)) / a);
    return { area: "pinned", colIdx: h, rowIdx: M };
  }
  const v = n - ge + r, g = c && c.length === l ? St(Vt(c, l), v) : Math.floor(v / a);
  return g >= 0 && g < l ? { area: "body", colIdx: h, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const el = 500, tl = el / 2, nl = 1.6, Xt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Nt = `
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
`, Ot = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Ut() {
  return {
    uMouseUV: { value: new N.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: nl },
    uLensTint: { value: new N.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const ke = { x: -999, y: -999 };
function Kt(t, n, e, l, a) {
  const r = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = r && a > 0 ? tl / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function Gt(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const ll = ["value"], ol = ["disabled"], al = ["disabled"], rl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, il = 28, sl = 600, cl = /* @__PURE__ */ tt({
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
    const e = t, l = n, a = z(e.rowData ?? []), r = z(e.pinnedBottomRowData ?? []), u = z(""), f = z(null), s = At({}), d = At({}), c = At(/* @__PURE__ */ new Set()), m = z(0), h = z(0), T = z(0), p = z(0), S = z(0), v = z(-1), g = z(null), M = z(null), A = z(null), U = { ...ke }, I = z({ x: 0, y: ge }), w = z("");
    function C(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const W = q(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((i) => !c.has(C(i))).map((i) => {
        const x = C(i), L = { ...o, ...i };
        return { colId: x, colDef: L, width: d[x] ?? L.width ?? 100 };
      });
    }), B = q(() => {
      const o = h.value;
      if (!o) return W.value;
      const i = W.value.reduce((k, E) => k + E.width, 0);
      if (!i || i >= o) return W.value;
      const x = o / i;
      let L = 0;
      return W.value.map((k, E) => {
        const j = E === W.value.length - 1 ? o - L : Math.max(8, Math.round(k.width * x));
        return L += j, { ...k, width: j };
      });
    }), oe = q(() => {
      const o = B.value.reduce((i, x) => i + x.width, 0);
      return Math.max(0, o - h.value);
    });
    let ne = null;
    function ae() {
      if (typeof document > "u") return null;
      ne || (ne = document.createElement("canvas"));
      const o = ne.getContext("2d");
      return o && (o.font = wn()), o;
    }
    const le = q(() => B.value.some((o) => o.colDef.wrap)), V = q(() => {
      if (!le.value) return null;
      const o = ae();
      if (!o) return null;
      const i = B.value.filter((L) => L.colDef.wrap), x = e.rowHeight;
      return P.value.map((L) => {
        let k = 1;
        for (const E of i) {
          const Y = yn(o, X(E, L), Math.max(20, E.width - 16));
          Y.length > k && (k = Y.length);
        }
        return jn(k, x);
      });
    }), Q = q(
      () => V.value ? Vt(V.value, P.value.length) : null
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
      const i = Q.value ? St(Q.value, p.value) : Math.floor(p.value / e.rowHeight);
      return Math.min(o - 1, i);
    }), D = q(() => {
      const o = P.value.length;
      return o === 0 ? 0 : Q.value ? Math.min(o - 1, St(Q.value, p.value + ee.value - 1)) : Math.min(o - 1, b.value + H.value - 1);
    });
    function F(o, i) {
      if (i.colDef.valueGetter) return i.colDef.valueGetter({ data: o, colDef: i.colDef });
      if (i.colDef.field) return o[i.colDef.field];
    }
    function X(o, i) {
      const x = F(i, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: i, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: i, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function K(o, i) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: F(i, o), data: i, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const P = q(() => {
      m.value;
      let o = a.value;
      const i = u.value.trim().toLowerCase();
      i && (o = o.filter(
        (x) => W.value.some(
          (L) => String(F(x, L) ?? "").toLowerCase().includes(i)
        )
      ));
      for (const [x, L] of Object.entries(s)) {
        if (!L) continue;
        const k = W.value.find((E) => E.colId === x);
        if (k)
          if (L.startsWith("__eq__")) {
            const E = L.slice(6).toLowerCase();
            o = o.filter((Y) => String(F(Y, k) ?? "").toLowerCase() === E);
          } else {
            const E = L.toLowerCase();
            o = o.filter((Y) => String(F(Y, k) ?? "").toLowerCase().includes(E));
          }
      }
      if (f.value) {
        const { colId: x, dir: L } = f.value, k = W.value.find((E) => E.colId === x);
        k && (o = [...o].sort((E, Y) => {
          const j = F(E, k), he = F(Y, k);
          let pe = 0;
          return k.colDef.comparator ? pe = k.colDef.comparator(j, he) : typeof j == "number" && typeof he == "number" ? pe = j - he : pe = String(j ?? "").localeCompare(String(he ?? ""), void 0, { numeric: !0 }), L === "asc" ? pe : -pe;
        }));
      }
      return o;
    }), G = q(() => {
      const o = W.value.filter((k) => k.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const i = P.value, x = {};
      for (const k of o) {
        const E = i.map((j) => F(j, k)), Y = qn(E, k.colDef.aggFunc);
        if (Y == null) {
          x[k.colId] = "";
          continue;
        }
        x[k.colId] = k.colDef.aggValueFormatter ? k.colDef.aggValueFormatter(Y) : String(Y);
      }
      const L = o[0].colId;
      return x[L] === "" && (x[L] = "Σ"), x;
    });
    O(P, () => {
      p.value = 0, g.value = null;
    }), O(oe, () => {
      S.value = Math.min(S.value, oe.value);
    }), O(Z, () => {
      p.value = Math.min(p.value, Z.value);
    });
    function be(o) {
      const i = Q.value, x = i ? i[o] : o * e.rowHeight, L = i ? i[o + 1] : x + e.rowHeight;
      x < p.value ? p.value = x : L > p.value + ee.value && (p.value = Math.min(Z.value, L - ee.value));
    }
    function ue() {
      p.value = Math.max(0, p.value - ee.value), xe();
    }
    function Le() {
      p.value = Math.min(Z.value, p.value + ee.value), xe();
    }
    let Te = !1, Ie = "", R = 0, $ = 0, J = !1, fe = !1, Re = 0, Ae = 0, Oe = 0, Ue = 0, Fe = !1;
    function Je(o, i) {
      var x;
      Te = !0, Ie = o, R = i, $ = ((x = B.value.find((L) => L.colId === o)) == null ? void 0 : x.width) ?? 100, J = !1;
    }
    function at(o) {
      if (fe) {
        const E = Re - o.clientX, Y = Ae - o.clientY;
        (Math.abs(E) > 4 || Math.abs(Y) > 4) && (Fe = !0), S.value = Math.max(0, Math.min(oe.value, Oe + E)), p.value = Math.max(0, Math.min(Z.value, Ue + Y)), xe();
        return;
      }
      if (!Te) return;
      const i = h.value, x = Math.max(30, $ + (o.clientX - R)), L = W.value.filter((E) => E.colId !== Ie).reduce((E, Y) => E + Y.width, 0), k = i - x;
      k > 10 && (d[Ie] = Math.max(10, Math.round(x * L / k))), xe();
    }
    function We() {
      fe && (Fe && (J = !0), fe = !1), Te && (Te = !1, J = !0, l("column-resized"));
    }
    function Ve(o) {
      if (o.touches.length !== 1) return;
      const i = o.touches[0];
      fe = !0, Fe = !1, Re = i.clientX, Ae = i.clientY, Oe = S.value, Ue = p.value;
    }
    function ft(o) {
      if (!fe || o.touches.length !== 1) return;
      o.preventDefault();
      const i = o.touches[0], x = Re - i.clientX, L = Ae - i.clientY;
      (Math.abs(x) > 4 || Math.abs(L) > 4) && (Fe = !0), S.value = Math.max(0, Math.min(oe.value, Oe + x)), p.value = Math.max(0, Math.min(Z.value, Ue + L)), xe();
    }
    function yt() {
      fe && (Fe && (J = !0), fe = !1);
    }
    const Ce = z(null), re = z(null), bt = It("cathodeResetTick", z(0));
    O(bt, () => rt());
    let ce = null, Xe = !1;
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
  ${Xt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Nt}

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

    ${Ot}

    gl_FragColor = color;
  }
`;
    function Qe() {
      if (!(!re.value || !Ce.value)) {
        ie = document.createElement("canvas");
        try {
          ce = new N.WebGLRenderer({ canvas: re.value, antialias: !1, alpha: !0 });
        } catch {
          Xe = !0;
        }
        if (!Xe && !ce.getContext() && (ce.dispose(), ce = null, Xe = !0), Xe) {
          De();
          return;
        }
        ce.setPixelRatio(1), ce.setClearColor(0, 0), _ = new N.Scene(), te = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), ve = new N.CanvasTexture(ie), ve.minFilter = N.LinearFilter, ve.magFilter = N.LinearFilter, de = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: ve },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new N.Color(0) },
            ...Ut()
          },
          vertexShader: rl,
          fragmentShader: ze,
          transparent: !0
        }), _.add(new N.Mesh(new N.PlaneGeometry(2, 2), de)), De();
      }
    }
    function De() {
      if (!Ce.value || !ce && !Xe) return;
      const o = Ce.value.clientWidth, i = Ce.value.clientHeight - (e.pagination ? il : 0);
      if (!o || !i) return;
      const x = ie.width !== o || ie.height !== i;
      ie.width = o, ie.height = i, h.value = o, T.value = i, S.value = Math.max(0, Math.min(oe.value, S.value)), p.value = Math.max(0, Math.min(Z.value, p.value)), ce ? (x && ve && (ve.dispose(), ve = new N.CanvasTexture(ie), ve.minFilter = N.LinearFilter, ve.magFilter = N.LinearFilter, de && (de.uniforms.uTex.value = ve)), ce.setPixelRatio(window.devicePixelRatio || 1), ce.setSize(o, i)) : re.value && (re.value.width = o, re.value.height = i, re.value.style.width = o + "px", re.value.style.height = i + "px"), xe();
    }
    function xe() {
      var x, L, k, E, Y, j, he, pe, it, ht, mt, st;
      if (!(ie != null && ie.width)) return;
      if (Xe) {
        if (!re.value) return;
        rn(ie, {
          cols: B.value,
          rows: P.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: V.value ?? void 0,
          scrollY: p.value,
          scrollX: S.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = f.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((L = f.value) == null ? void 0 : L.dir) ?? null,
          colFilters: s,
          hoveredRow: v.value,
          selectedRow: ((k = g.value) == null ? void 0 : k.row) ?? -1,
          selectedCol: ((E = g.value) == null ? void 0 : E.col) ?? -1,
          selectionAnchorRow: ((Y = M.value) == null ? void 0 : Y.row) ?? -1,
          selectionAnchorCol: ((j = M.value) == null ? void 0 : j.col) ?? -1,
          formatCell: X,
          getCellStyle: K
        });
        const gt = re.value.getContext("2d");
        gt && gt.drawImage(ie, 0, 0);
        return;
      }
      if (!ce || !de || !ve) return;
      const o = ut[e.theme] ?? ut.none, i = e.theme === "paper";
      de.uniforms.uStrength.value = e.curvature / 45 * 0.55, de.uniforms.uScanlines.value = e.scanlines && !i ? 1 : 0, de.uniforms.uVignette.value = i ? 0 : 1, de.uniforms.uBezel.value.set(o.bg), Kt(de, e.magnify, U, ie.width, ie.height), rn(ie, {
        cols: B.value,
        rows: P.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: V.value ?? void 0,
        scrollY: p.value,
        scrollX: S.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((he = f.value) == null ? void 0 : he.colId) ?? null,
        sortDir: ((pe = f.value) == null ? void 0 : pe.dir) ?? null,
        colFilters: s,
        hoveredRow: v.value,
        selectedRow: ((it = g.value) == null ? void 0 : it.row) ?? -1,
        selectedCol: ((ht = g.value) == null ? void 0 : ht.col) ?? -1,
        selectionAnchorRow: ((mt = M.value) == null ? void 0 : mt.row) ?? -1,
        selectionAnchorCol: ((st = M.value) == null ? void 0 : st.col) ?? -1,
        formatCell: X,
        getCellStyle: K,
        aggregateRow: G.value
      }), ve.needsUpdate = !0, ce.render(_, te);
    }
    function Rt(o) {
      if (!re.value) return [-1, -1];
      const i = re.value.getBoundingClientRect(), x = o.clientX - i.left, L = o.clientY - i.top, k = re.value.width || i.width, E = re.value.height || i.height, Y = e.curvature / 45 * 0.55, [j, he] = Jn(x, L, k, E, Y);
      return j < 0 ? [-1, -1] : [j, he];
    }
    let Dt = 0;
    function Cn(o) {
      A.value = null;
      const i = Date.now();
      if (o.deltaX !== 0) {
        Dt = i, S.value = Math.max(0, Math.min(oe.value, S.value + o.deltaX)), xe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Dt = i, S.value = Math.max(0, Math.min(oe.value, S.value + o.deltaY)), xe();
        return;
      }
      i - Dt < sl || (p.value = Math.max(0, Math.min(Z.value, p.value + o.deltaY)), xe());
    }
    function kn(o) {
      if (Te) return;
      if (e.magnify && re.value) {
        const k = Gt(o, re.value);
        U.x = k.x, U.y = k.y;
      }
      const [i, x] = Rt(o);
      if (i < 0) {
        v.value = -1, xe();
        return;
      }
      const L = cn(
        i,
        x,
        B.value,
        P.value.length,
        e.rowHeight,
        p.value,
        ie.height,
        r.value.length,
        S.value,
        G.value !== null,
        V.value ?? void 0
      );
      if (v.value = L.area === "body" ? L.rowIdx : -1, L.area === "header" && L.colIdx >= 0) {
        const k = B.value[L.colIdx], E = _t(L.colIdx, B.value), Y = i + S.value;
        re.value.style.cursor = k && sn(Y, E, k.width) ? "col-resize" : "pointer";
      } else L.area === "body" ? re.value.style.cursor = "pointer" : re.value.style.cursor = "default";
      xe();
    }
    function Ln() {
      v.value = -1, U.x = ke.x, U.y = ke.y, xe();
    }
    function In(o) {
      const [i, x] = Rt(o);
      if (i < 0) return;
      if (x >= ge) {
        fe = !0, Fe = !1, Re = o.clientX, Ae = o.clientY, Oe = S.value, Ue = p.value;
        return;
      }
      const L = i + S.value;
      for (let k = 0; k < B.value.length; k++) {
        const E = B.value[k], Y = _t(k, B.value);
        if (E.colDef.resizable !== !1 && sn(L, Y, E.width)) {
          Je(E.colId, o.clientX);
          return;
        }
      }
    }
    function Rn(o) {
      var k, E, Y;
      if (J) {
        J = !1;
        return;
      }
      if (Te) return;
      const [i, x] = Rt(o);
      if (i < 0) {
        A.value = null;
        return;
      }
      const L = cn(
        i,
        x,
        B.value,
        P.value.length,
        e.rowHeight,
        p.value,
        ie.height,
        r.value.length,
        S.value,
        G.value !== null,
        V.value ?? void 0
      );
      if (L.area === "header" && L.colIdx >= 0) {
        const j = B.value[L.colIdx], he = _t(L.colIdx, B.value), pe = i + S.value;
        j.colDef.filter && Qn(pe, he, j.width) ? (o.stopPropagation(), A.value === j.colId ? A.value = null : (A.value = j.colId, w.value = (k = s[j.colId]) != null && k.startsWith("__eq__") ? s[j.colId].slice(6) : s[j.colId] ?? "", I.value = { x: Math.max(0, he - S.value), y: ge })) : j.colDef.sortable !== !1 && (A.value = null, f.value = ((E = f.value) == null ? void 0 : E.colId) === j.colId ? f.value.dir === "asc" ? { colId: j.colId, dir: "desc" } : null : { colId: j.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (A.value = null, L.area === "body" && L.rowIdx >= 0 && L.colIdx >= 0) {
        const j = L.rowIdx;
        o.shiftKey && g.value ? (M.value || (M.value = { ...g.value }), g.value = { row: j, col: L.colIdx }) : (g.value = { row: j, col: L.colIdx }, M.value = { row: j, col: L.colIdx }), (Y = re.value) == null || Y.focus();
        const he = P.value[j], pe = B.value[L.colIdx];
        he && pe && (l("row-clicked", { data: he, event: o }), l("cell-selected", { data: he, row: j, col: L.colIdx, colId: pe.colId }));
      }
    }
    function en(o) {
      var i, x;
      A.value && ((x = (i = o.target).closest) != null && x.call(i, ".cathode-filter-popup") || (A.value = null));
    }
    function Dn(o) {
      var k;
      if (!h.value) return;
      let i = 0;
      for (let E = 0; E < o; E++) i += B.value[E].width;
      const x = ((k = B.value[o]) == null ? void 0 : k.width) ?? 0, L = i - S.value;
      L < 0 ? S.value = Math.max(0, i) : L + x > h.value && (S.value = Math.min(oe.value, i + x - h.value));
    }
    function En(o) {
      const x = B.value.length - 1, L = P.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), g.value = { row: b.value, col: 0 }, M.value = { row: b.value, col: 0 });
        return;
      }
      let { row: k, col: E } = g.value;
      const Y = (j, he, pe = !1) => {
        k = Math.max(0, Math.min(L, j)), E = Math.max(0, Math.min(x, he)), g.value = { row: k, col: E }, pe || (M.value = { row: k, col: E }), be(k), Dn(E);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), Y(k + 1, E, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), Y(k - 1, E, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? Y(k, E + 1, !0) : E < x ? Y(k, E + 1) : Y(k + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? Y(k, E - 1, !0) : E > 0 ? Y(k, E - 1) : Y(k - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? E > 0 ? Y(k, E - 1) : Y(k - 1, x) : E < x ? Y(k, E + 1) : Y(k + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? Y(k - 1, E) : Y(k + 1, E);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(0, 0, o.shiftKey) : Y(k, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(L, x, o.shiftKey) : Y(k, x, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), Y(Math.min(L, k + H.value), E, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), Y(Math.max(0, k - H.value), E, o.shiftKey);
          break;
        case "Escape":
          g.value = null, M.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), An());
          break;
      }
    }
    function An() {
      var pe;
      if (!g.value) return;
      const o = B.value, i = P.value, x = M.value ?? g.value, L = Math.min(x.row, g.value.row), k = Math.max(x.row, g.value.row), E = Math.min(x.col, g.value.col), Y = Math.max(x.col, g.value.col), j = [];
      for (let it = L; it <= k; it++) {
        const ht = i[it];
        if (!ht) continue;
        const mt = [];
        for (let st = E; st <= Y; st++) {
          const gt = o[st];
          gt && mt.push(X(gt, ht).replace(/[\t\r\n]+/g, " "));
        }
        j.push(mt.join("	"));
      }
      const he = j.join(`
`);
      (pe = navigator.clipboard) == null || pe.writeText(he).catch(() => {
      });
    }
    function Fn(o) {
      const i = o.target.value;
      w.value = i, i ? s[A.value] = i : delete s[A.value], l("filter-changed");
    }
    function tn() {
      A.value && delete s[A.value], w.value = "", A.value = null, l("filter-changed");
    }
    const _n = {
      setGridOption(o, i) {
        o === "rowData" ? a.value = i : o === "pinnedBottomRowData" ? r.value = i : o === "quickFilterText" && (u.value = i);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, L;
          const i = C(o);
          return {
            colId: i,
            hide: c.has(i),
            sort: ((x = f.value) == null ? void 0 : x.colId) === i ? f.value.dir : null,
            sortIndex: ((L = f.value) == null ? void 0 : L.colId) === i ? 0 : null,
            width: d[i] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const i of o)
          i.hide === !0 && c.add(i.colId), i.hide === !1 && c.delete(i.colId), i.sort && (f.value = { colId: i.colId, dir: i.sort }), i.width && (d[i.colId] = i.width);
      },
      setFilterModel(o) {
        for (const i of Object.keys(s)) delete s[i];
        if (o)
          for (const [i, x] of Object.entries(o))
            (x == null ? void 0 : x.type) === "equals" ? s[i] = `__eq__${x.filter}` : x != null && x.filter && (s[i] = x.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [i, x] of Object.entries(s))
          x && (o[i] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return o;
      },
      async setColumnFilterModel(o, i) {
        i ? i.type === "equals" ? s[o] = `__eq__${i.filter}` : s[o] = i.filter ?? "" : delete s[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        m.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const i = W.value, x = i.map((Y) => Y.colDef.headerName ?? Y.colId).join(","), L = P.value.map(
          (Y) => i.map((j) => `"${String(X(j, Y)).replace(/"/g, '""')}"`).join(",")
        ), k = new Blob([[x, ...L].join(`
`)], { type: "text/csv" }), E = URL.createObjectURL(k);
        Object.assign(document.createElement("a"), { href: E, download: o }).click(), URL.revokeObjectURL(E);
      },
      resize() {
        De();
      },
      resetColumnState() {
        c.clear();
        for (const i of e.columnDefs)
          i.hide && c.add(C(i));
        const o = e.columnDefs.find((i) => i.sort);
        f.value = o ? { colId: C(o), dir: o.sort } : null;
        for (const i of Object.keys(d)) delete d[i];
        for (const i of Object.keys(s)) delete s[i];
        u.value = "", p.value = 0, g.value = null, A.value = null;
      }
    };
    O(
      [P, () => r.value, B, p, v, g],
      () => $e(xe)
    ), O(() => e.theme, () => xe()), O(() => e.curvature, () => $e(De)), O(() => e.scanlines, () => xe()), O(() => e.glow, () => xe()), O(() => e.magnify, (o) => {
      o || (U.x = ke.x, U.y = ke.y), xe();
    }), O(g, (o) => {
      if (!o) return;
      const i = P.value[o.row], x = B.value[o.col];
      i && x && l("cell-selected", { data: i, row: o.row, col: o.col, colId: x.colId });
    });
    let dt = null, vt = null, Et = 0;
    function rt() {
      cancelAnimationFrame(Et), Et = requestAnimationFrame(De);
    }
    function nn(o) {
      o.preventDefault();
    }
    function ln() {
      ce == null || ce.dispose(), ce = null, Xe = !1, Qe();
    }
    qe(() => {
      for (const o of e.columnDefs)
        o.hide && c.add(C(o)), o.sort && !f.value && (f.value = { colId: C(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", en), document.addEventListener("mousemove", at), document.addEventListener("mouseup", We), $e(() => {
        var o;
        Qe(), re.value && (re.value.addEventListener("webglcontextlost", nn), re.value.addEventListener("webglcontextrestored", ln)), Ce.value && (dt = new ResizeObserver(() => De()), dt.observe(Ce.value), vt = new IntersectionObserver((i) => {
          i.some((x) => x.isIntersecting) && rt();
        }), vt.observe(Ce.value)), window.addEventListener("resize", rt), (o = window.visualViewport) == null || o.addEventListener("resize", rt), l("grid-ready", { api: _n });
      });
    }), nt(() => {
      var o, i, x;
      document.removeEventListener("click", en, !0), document.removeEventListener("mousemove", at), document.removeEventListener("mouseup", We), (o = re.value) == null || o.removeEventListener("webglcontextlost", nn), (i = re.value) == null || i.removeEventListener("webglcontextrestored", ln), dt == null || dt.disconnect(), vt == null || vt.disconnect(), window.removeEventListener("resize", rt), (x = window.visualViewport) == null || x.removeEventListener("resize", rt), cancelAnimationFrame(Et), y();
    });
    const Ee = q(() => ut[e.theme] ?? ut.none), Bn = q(() => ({
      position: "absolute",
      left: `${I.value.x}px`,
      top: `${I.value.y}px`,
      zIndex: 100,
      background: Ee.value.headerBg,
      border: `1px solid ${Ee.value.accent}`,
      color: Ee.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Yn = q(() => ({
      background: Ee.value.bg,
      border: `1px solid ${Ee.value.border}`,
      color: Ee.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Wn = q(() => ({
      background: Ee.value.headerBg,
      borderTop: `1px solid ${Ee.value.border}`,
      color: Ee.value.text
    })), zn = q(() => ({
      background: Ee.value.bg
    })), on = q(() => Ee.value.accent);
    return (o, i) => {
      var x, L;
      return we(), ye("div", {
        ref_key: "wrapEl",
        ref: Ce,
        class: "cathode-wrap",
        style: _e(zn.value)
      }, [
        se("canvas", {
          ref_key: "canvasEl",
          ref: re,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ke(Cn, ["prevent"]),
          onMousemove: kn,
          onMouseleave: Ln,
          onMousedown: In,
          onClick: Rn,
          onKeydown: En,
          onTouchstartPassive: Ve,
          onTouchmove: ft,
          onTouchend: yt,
          onTouchcancel: yt
        }, null, 544),
        A.value ? (we(), ye("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: _e(Bn.value),
          onClick: i[0] || (i[0] = Ke(() => {
          }, ["stop"]))
        }, [
          se("input", {
            style: _e(Yn.value),
            value: w.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Fn,
            onKeydown: Pn(tn, ["escape"])
          }, null, 44, ll),
          w.value ? (we(), ye("button", {
            key: 0,
            style: _e({
              background: "none",
              border: "none",
              color: Ee.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: tn
          }, "✕", 4)) : He("", !0)
        ], 4)) : He("", !0),
        t.pagination ? (we(), ye("div", {
          key: 1,
          class: "cathode-pagination",
          style: _e(Wn.value)
        }, [
          se("button", {
            disabled: p.value <= 0,
            onClick: i[1] || (i[1] = (k) => ue())
          }, "◀", 8, ol),
          se("span", null, Pe((b.value + 1).toLocaleString()) + "–" + Pe(Math.min(P.value.length, D.value + 1).toLocaleString()) + " / " + Pe(P.value.length.toLocaleString()), 1),
          se("button", {
            disabled: p.value >= Z.value,
            onClick: i[2] || (i[2] = (k) => Le())
          }, "▶", 8, al),
          se("span", {
            class: "cathode-page-info",
            style: _e({ color: on.value })
          }, Pe(P.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (we(), ye("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: _e({ color: on.value })
          }, Pe(((x = B.value[g.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((L = B.value[g.value.col]) == null ? void 0 : L.colId)) + " : " + Pe(X(B.value[g.value.col], P.value[g.value.row])), 5)) : He("", !0)
        ], 4)) : He("", !0)
      ], 4);
    };
  }
}), lt = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, wo = /* @__PURE__ */ lt(cl, [["__scopeId", "data-v-c6e94777"]]), Tt = {
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
function ul(t, n) {
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
const fl = 12, Me = 18, wt = 10, et = 6, jt = `${fl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function dl(t, n, e) {
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
    let u = "";
    for (const f of r) {
      const s = u + f;
      if (t.measureText(s).width <= e)
        u = s;
      else if (u && (l.push(u.replace(/\s+$/, "")), u = ""), t.measureText(f).width > e) {
        let d = "";
        for (const c of f)
          t.measureText(d + c).width > e ? (d && l.push(d), d = c) : d += c;
        u = d;
      } else
        u = f.replace(/^\s+/, "");
    }
    u && l.push(u.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function xn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function vl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function hl(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, u = t.formatTs ?? xn;
  e.font = jt;
  const f = [];
  for (let s = 0; s < n.length; s++) {
    const d = n[s], c = d.level ?? "info", m = a && d.ts != null ? u(d.ts) : "", h = r ? dl(e, d.text, l) : d.text.split(`
`);
    for (let T = 0; T < h.length; T++)
      f.push({
        entryIdx: s,
        text: h[T],
        level: c,
        timestamp: T === 0 ? m : "",
        isFirstFrag: T === 0,
        widthPx: e.measureText(h[T]).width
      });
  }
  return f;
}
function un(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Tt[n.theme] ?? Tt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = jt, e.textBaseline = "middle";
  const u = n.visualLines, f = wt - n.scrollX, s = (n.showTimestamps ? wt + n.timestampWidth : wt) - n.scrollX, d = Math.max(0, Math.floor((n.scrollY - et) / Me)), c = Math.min(u.length, Math.ceil((n.scrollY + a - et) / Me) + 1);
  for (let m = d; m < c; m++) {
    const h = u[m], T = et + m * Me - n.scrollY + Me / 2;
    if (h.entryIdx % 2 === 1 && h.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let S = 1;
      for (; m + S < c && u[m + S].entryIdx === h.entryIdx; ) S++;
      e.fillRect(0, T - Me / 2, l, Me * S);
    }
    n.selectionStart >= 0 && m >= n.selectionStart && m <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, T - Me / 2, l, Me)), m === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, T - Me / 2, l, Me)), n.showTimestamps && h.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(h.timestamp, f, T), e.shadowBlur = 0);
    const p = ul(r, h.level);
    e.fillStyle = p, e.textAlign = "left", n.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(h.text, s, T), e.shadowBlur = 7, e.fillText(h.text, s, T), e.shadowBlur = 3, e.fillText(h.text, s, T), e.shadowBlur = 0) : e.fillText(h.text, s, T);
  }
  e.restore();
}
function fn(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - et) / Me);
  return l < 0 || l >= e ? -1 : l;
}
function ml(t) {
  return et * 2 + t * Me;
}
const gl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, pl = /* @__PURE__ */ tt({
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
    const e = t, l = z(null), a = z(null), r = { ...ke }, u = z(0), f = z(0), s = z(0), d = z(-1), c = z(!0), m = z(-1), h = z(-1), T = q(() => {
      const y = e.entries ?? [];
      return e.maxLines > 0 && y.length > e.maxLines ? y.slice(y.length - e.maxLines) : y;
    }), p = q(() => {
      if (!e.showTimestamps) return "";
      const y = e.formatTs ?? xn;
      let _ = "00:00:00";
      for (const te of T.value) {
        if (te.ts == null) continue;
        const de = y(te.ts);
        de.length > _.length && (_ = de);
      }
      return _;
    }), S = z(0), v = z([]);
    function g() {
      if (!V) return;
      const y = V.getContext("2d");
      if (!y) return;
      y.font = jt;
      const _ = e.showTimestamps ? vl(y, p.value) : 0;
      S.value = _;
      const te = Math.max(
        1,
        u.value - wt * 2 - _
      );
      v.value = hl({
        entries: T.value,
        ctx: y,
        textMaxWidth: te,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const M = q(() => ml(v.value.length)), A = q(() => Math.max(0, M.value - f.value)), U = q(() => {
      let y = 0;
      for (const _ of v.value) _.widthPx > y && (y = _.widthPx);
      return wt * 2 + S.value + y;
    }), I = q(() => Math.max(0, U.value - u.value)), w = z(0);
    O(A, () => {
      c.value ? s.value = A.value : s.value = Math.min(s.value, A.value);
    }), O(I, () => {
      w.value = Math.min(w.value, I.value);
    }), O(
      [T, u, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        g(), $e(Z);
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
    let oe, ne, ae, le, V;
    const Q = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Xt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Nt}

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

    ${Ot}

    gl_FragColor = color;
  }
`;
    function me() {
      if (!(!a.value || !l.value)) {
        V = document.createElement("canvas");
        try {
          C = new N.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          W = !0;
        }
        if (!W && !C.getContext() && (C.dispose(), C = null, W = !0), W) {
          ee();
          return;
        }
        C.setPixelRatio(1), C.setClearColor(0, 0), oe = new N.Scene(), ne = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), le = new N.CanvasTexture(V), le.minFilter = N.LinearFilter, le.magFilter = N.LinearFilter, ae = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: le },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ut()
          },
          vertexShader: gl,
          fragmentShader: Q,
          transparent: !0
        }), oe.add(new N.Mesh(new N.PlaneGeometry(2, 2), ae)), ee();
      }
    }
    function ee() {
      if (!l.value || !C && !W) return;
      const y = l.value.clientWidth, _ = l.value.clientHeight;
      if (!y || !_) return;
      const te = V.width !== y || V.height !== _;
      te && (V.width = y, V.height = _, u.value = y, f.value = _, g(), C ? (te && le && (le.dispose(), le = new N.CanvasTexture(V), le.minFilter = N.LinearFilter, le.magFilter = N.LinearFilter, ae && (ae.uniforms.uTex.value = le)), C.setPixelRatio(window.devicePixelRatio || 1), C.setSize(y, _)) : a.value && (a.value.width = y, a.value.height = _, a.value.style.width = y + "px", a.value.style.height = _ + "px"), c.value && (s.value = Math.max(0, M.value - f.value)), Z());
    }
    function Z() {
      if (!(V != null && V.width)) return;
      if (W) {
        if (!a.value) return;
        un(V, {
          visualLines: v.value,
          scrollY: s.value,
          scrollX: w.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: S.value,
          hoveredLine: d.value,
          selectionStart: Math.min(m.value, h.value),
          selectionEnd: Math.max(m.value, h.value)
        });
        const _ = a.value.getContext("2d");
        _ && _.drawImage(V, 0, 0);
        return;
      }
      if (!C || !ae || !le) return;
      const y = e.theme === "paper";
      ae.uniforms.uStrength.value = e.curvature / 45 * 0.55, ae.uniforms.uScanlines.value = e.scanlines && !y ? 1 : 0, ae.uniforms.uVignette.value = y ? 0 : 1, Kt(ae, e.magnify, r, V.width, V.height), un(V, {
        visualLines: v.value,
        scrollY: s.value,
        scrollX: w.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: S.value,
        hoveredLine: d.value,
        selectionStart: Math.min(m.value, h.value),
        selectionEnd: Math.max(m.value, h.value)
      }), le.needsUpdate = !0, C.render(oe, ne);
    }
    O(() => e.theme, () => Z()), O(() => e.curvature, () => Z()), O(() => e.scanlines, () => Z()), O(() => e.glow, () => Z()), O(() => e.magnify, (y) => {
      y || (r.x = ke.x, r.y = ke.y), Z();
    }), O(s, () => Z()), O(w, () => Z()), O(d, () => Z()), O([m, h], () => Z());
    function H(y) {
      if (!a.value) return [-1, -1];
      const _ = a.value.getBoundingClientRect();
      return [y.clientX - _.left, y.clientY - _.top];
    }
    function b(y) {
      s.value = Math.max(0, Math.min(A.value, y)), c.value = s.value >= A.value - 4;
    }
    function D(y) {
      w.value = Math.max(0, Math.min(I.value, y));
    }
    function F(y) {
      y.shiftKey ? D(w.value + y.deltaY) : Math.abs(y.deltaX) > Math.abs(y.deltaY) ? D(w.value + y.deltaX) : b(s.value + y.deltaY);
    }
    let X = !1, K = 0, P = 0, G = 0, be = 0, ue = !1;
    function Le(y) {
      X = !0, ue = !1, K = y.clientX, P = y.clientY, G = w.value, be = s.value, l.value && l.value.focus();
    }
    function Te(y) {
      if (X) {
        const _ = K - y.clientX, te = P - y.clientY;
        (Math.abs(_) > 4 || Math.abs(te) > 4) && (ue = !0), D(G + _), b(be + te);
      }
    }
    function Ie() {
      X && (X = !1, ue && (ue = !1));
    }
    function R(y) {
      if (y.touches.length !== 1) return;
      const _ = y.touches[0];
      X = !0, ue = !1, K = _.clientX, P = _.clientY, G = w.value, be = s.value, l.value && l.value.focus();
    }
    function $(y) {
      if (!X || y.touches.length !== 1) return;
      y.preventDefault();
      const _ = y.touches[0], te = K - _.clientX, de = P - _.clientY;
      (Math.abs(te) > 4 || Math.abs(de) > 4) && (ue = !0), D(G + te), b(be + de);
    }
    function J() {
      X && (X = !1, ue && (ue = !1));
    }
    function fe(y) {
      const [, _] = H(y);
      return _ < 0 ? -1 : fn(_, s.value, v.value.length);
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
      h.value = ve, (!_ || m.value < 0) && (m.value = ve), d.value = ve;
      const ie = et + ve * Me, ze = ie + Me;
      ie < s.value ? b(ie) : ze > s.value + f.value && b(ze - f.value);
    }
    function Oe() {
      const y = Math.min(m.value, h.value), _ = Math.max(m.value, h.value);
      if (y < 0) return "";
      const te = v.value, de = /* @__PURE__ */ new Set(), ve = [];
      for (let ie = y; ie <= _ && ie < te.length; ie++) {
        const ze = te[ie];
        if (de.has(ze.entryIdx)) continue;
        de.add(ze.entryIdx);
        let Qe = "";
        for (let De = 0; De < te.length; De++)
          te[De].entryIdx === ze.entryIdx && (Qe += (Qe && !te[De].isFirstFrag ? " " : "") + te[De].text);
        ve.push(ze.timestamp ? `${ze.timestamp}  ${Qe}` : Qe);
      }
      return ve.join(`
`);
    }
    async function Ue() {
      const y = Oe();
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
          y.preventDefault(), D(w.value + Me * 2);
          break;
        case "ArrowLeft":
          y.preventDefault(), D(w.value - Me * 2);
          break;
        case "PageDown":
          y.preventDefault(), b(s.value + f.value);
          break;
        case "PageUp":
          y.preventDefault(), b(s.value - f.value);
          break;
        case "Home":
          y.preventDefault(), b(0), D(0);
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
        const te = Gt(y, a.value);
        r.x = te.x, r.y = te.y, Z();
      }
      const [, _] = H(y);
      if (_ < 0) {
        d.value = -1;
        return;
      }
      d.value = fn(_, s.value, v.value.length);
    }
    function at() {
      d.value = -1, r.x = ke.x, r.y = ke.y, Z();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        c.value = !0, s.value = A.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        b(et + y * Me);
      }
    });
    let We = null, Ve = null, ft = 0;
    const yt = It("cathodeResetTick", z(0));
    O(yt, () => Ce());
    function Ce() {
      cancelAnimationFrame(ft), ft = requestAnimationFrame(ee);
    }
    function re(y) {
      y.preventDefault();
    }
    function bt() {
      C == null || C.dispose(), C = null, W = !1, me();
    }
    qe(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", Ie), $e(() => {
        var y;
        me(), a.value && (a.value.addEventListener("webglcontextlost", re), a.value.addEventListener("webglcontextrestored", bt)), l.value && (We = new ResizeObserver(() => ee()), We.observe(l.value), Ve = new IntersectionObserver((_) => {
          _.some((te) => te.isIntersecting) && Ce();
        }), Ve.observe(l.value)), window.addEventListener("resize", Ce), (y = window.visualViewport) == null || y.addEventListener("resize", Ce), s.value = A.value;
      });
    }), nt(() => {
      var y, _, te;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", Ie), (y = a.value) == null || y.removeEventListener("webglcontextlost", re), (_ = a.value) == null || _.removeEventListener("webglcontextrestored", bt), We == null || We.disconnect(), Ve == null || Ve.disconnect(), window.removeEventListener("resize", Ce), (te = window.visualViewport) == null || te.removeEventListener("resize", Ce), cancelAnimationFrame(ft), B();
    });
    const ce = q(() => Tt[e.theme] ?? Tt.none), Xe = q(() => ({
      background: ce.value.bg
    }));
    return (y, _) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: _e(Xe.value),
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
        onTouchmove: $,
        onTouchend: J,
        onTouchcancel: J
      }, null, 544)
    ], 36));
  }
}), wl = /* @__PURE__ */ lt(pl, [["__scopeId", "data-v-81f547ae"]]), yl = ["disabled"], bl = /* @__PURE__ */ tt({
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
    const l = t, a = e, r = z(null), u = z(null), f = z(""), s = z([]), d = z(-1);
    let c = "";
    function m(I) {
      I.trim() && (s.value.length && s.value[s.value.length - 1] === I || (s.value.push(I), s.value.length > l.historyLimit && s.value.splice(0, s.value.length - l.historyLimit)));
    }
    function h(I) {
      if (!l.disabled) {
        if (I.key === "Enter") {
          I.preventDefault();
          const w = f.value;
          w.trim() && m(w), d.value = -1, f.value = "", a("submit", w);
          return;
        }
        if (I.key === "ArrowUp") {
          if (!s.value.length) return;
          I.preventDefault(), d.value === -1 ? (c = f.value, d.value = s.value.length - 1) : d.value > 0 && d.value--, f.value = s.value[d.value];
          return;
        }
        if (I.key === "ArrowDown") {
          if (d.value === -1) return;
          I.preventDefault(), d.value < s.value.length - 1 ? (d.value++, f.value = s.value[d.value]) : (d.value = -1, f.value = c, c = "");
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
      return l.disabled ? I = " " : l.busy ? I = "█" : I = T.value ? "█" : " ", { level: "info", text: `${l.prompt}${f.value}${I}` };
    }), M = q(
      () => [...l.entries, g.value]
    );
    function A() {
      var I;
      l.disabled || (I = u.value) == null || I.focus();
    }
    O(() => l.busy, (I, w) => {
      w && !I && !l.disabled && $e(() => {
        var C;
        return (C = u.value) == null ? void 0 : C.focus();
      });
    });
    function U() {
      var I;
      (I = u.value) == null || I.focus();
    }
    return n({ focus: U }), qe(() => {
      S(), l.disabled || requestAnimationFrame(() => {
        var I;
        return (I = u.value) == null ? void 0 : I.focus();
      });
    }), nt(() => {
      v();
    }), (I, w) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: A
    }, [
      mn(wl, {
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
      gn(se("input", {
        ref_key: "inputEl",
        ref: u,
        "onUpdate:modelValue": w[0] || (w[0] = (C) => f.value = C),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: h
      }, null, 40, yl), [
        [Hn, f.value]
      ])
    ], 512));
  }
}), yo = /* @__PURE__ */ lt(bl, [["__scopeId", "data-v-a2b39934"]]), Ct = {
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
}, xl = 0.18, pt = 8, qt = 22, Ml = 4, Ye = 8, je = 56, Zt = 42, Ne = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Sl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Bt = 4, Tl = 1, Cl = 1;
function kl(t, n, e, l = 0, a = !1) {
  const r = a ? Zt : je, u = Math.max(0, n - Ye - r), f = Math.max(1, Math.floor(u / e)), s = Math.min(f, t);
  return { firstIdx: Math.max(0, t - s - Math.floor(l / e)), count: s, slotW: e };
}
function Ll(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, r = 0;
  const u = Math.min(t.length, n + e);
  for (let s = n; s < u; s++) {
    const d = t[s];
    d && (d.low < l && (l = d.low), d.high > a && (a = d.high), d.volume > r && (r = d.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const s = isFinite(l) ? l : 0;
    return { min: s - 1, max: s + 1, maxVol: Math.max(1, r) };
  }
  const f = (a - l) * 0.04;
  return { min: l - f, max: a + f, maxVol: Math.max(1, r) };
}
function Il(t, n, e = !1) {
  const l = e ? Ml : qt, a = Math.max(1, t - pt - l - Bt), r = Math.max(0, Math.round(a * n)), u = a - r;
  return {
    priceY0: pt,
    priceY1: pt + u,
    volumeY0: pt + u + Bt,
    volumeY1: pt + u + Bt + r
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
function Jt(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${r}`;
}
function Rl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * l;
}
function dn(t, n) {
  var T, p, S, v, g;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ct[n.theme] ?? Ct.none, u = n.colors ? { ...r, ...n.colors } : r, f = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = u.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const s = kl(n.candles.length, l, n.slotW, n.scrollX, f), d = Ll(n.candles, s.firstIdx, s.count), c = Il(a, n.showVolume ? n.volumeFraction : 0, f), m = Math.max(Tl, Math.floor(n.slotW * 0.7)), h = Math.min(n.candles.length, s.firstIdx + s.count);
  for (let M = s.firstIdx; M < h; M++) {
    const A = n.candles[M];
    if (!A) continue;
    const U = Ze(M, s.firstIdx, n.slotW), I = Be(A.open, d, c.priceY0, c.priceY1), w = Be(A.close, d, c.priceY0, c.priceY1), C = Be(A.high, d, c.priceY0, c.priceY1), W = Be(A.low, d, c.priceY0, c.priceY1), B = A.close >= A.open, oe = B ? u.wickBull : u.wickBear, ne = B ? u.candleBull : u.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = ne), e.strokeStyle = oe, e.lineWidth = Cl, e.beginPath(), e.moveTo(Math.round(U) + 0.5, C), e.lineTo(Math.round(U) + 0.5, W), e.stroke(), e.fillStyle = ne;
    const ae = Math.min(I, w), le = Math.max(1, Math.abs(w - I)), V = Math.round(U - m / 2), Q = Math.round(ae), me = Math.round(le);
    if (e.fillRect(V, Q, m, me), n.glow && (e.shadowBlur = 4, e.fillRect(V, Q, m, me)), e.shadowBlur = 0, n.showVolume && d.maxVol > 0) {
      const ee = Math.round(A.volume / d.maxVol * (c.volumeY1 - c.volumeY0));
      ee > 0 && (e.fillStyle = B ? u.volumeBull : u.volumeBear, e.fillRect(
        Math.round(U - m / 2),
        c.volumeY1 - ee,
        m,
        ee
      ));
    }
  }
  if ((T = n.overlays) != null && T.length) {
    const M = { above: 0, below: 0 }, A = n.overlays.filter((I) => I.kind !== "hline" && !!I.label).length, U = A ? 14 + 14 * A + 12 : 8;
    for (const I of n.overlays)
      I.kind === "hline" ? El(e, I, l, d, c, u, f, M, U) : Dl(e, I, s, d, c, n.slotW);
  }
  (p = n.markers) != null && p.length && Pl(e, u, n.markers, n.candles, s, d, c, n.slotW), Hl(e, u, d, c, l, f), f || ($l(e, u, n.candles, s, n.slotW, a), Wl(e, u, n.candles, l, a)), (S = n.overlays) != null && S.length && Fl(e, u, n.overlays, c), n.hover && (Vl(e, u, n.candles, s, d, c, n.slotW, n.hover, l), _l(e, u, n.candles, s, n.slotW, n.hover, c, ((v = n.overlays) == null ? void 0 : v.length) ?? 0), (g = n.markers) != null && g.length && Yl(e, u, n.markers, n.candles, s, d, c, n.slotW, n.hover, l)), e.restore();
}
function Dl(t, n, e, l, a, r) {
  var f;
  const u = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    xt(t, n.data, e.firstIdx, u, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const s = Mn(n.color, n.fillAlpha ?? 0.08);
    Al(t, n.upper, n.lower, e.firstIdx, u, r, l, a, s), xt(t, n.upper, e.firstIdx, u, r, l, a, n.color, 1, !1), xt(t, n.lower, e.firstIdx, u, r, l, a, n.color, 1, !1), (f = n.middle) != null && f.length && xt(t, n.middle, e.firstIdx, u, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function El(t, n, e, l, a, r, u, f = { above: 0, below: 0 }, s = 8) {
  const d = Be(n.price, l, a.priceY0, a.priceY1), c = d < a.priceY0 - 0.5, m = d > a.priceY1 + 0.5, h = c || m, T = h ? c ? f.above++ : f.below++ : 0, p = h ? c ? a.priceY0 + s + T * 20 : a.priceY1 - 8 - T * 20 : d, S = u ? Zt : je, v = Math.round(p) + 0.5;
  t.save(), h || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, v), t.lineTo(e - S, v), t.stroke(), t.setLineDash([]));
  let g = n.label ?? Ge(n.price);
  if (h && g !== "" && (g = (c ? "↑ " : "↓ ") + g), g !== "") {
    t.font = Ne, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(g).width, A = 4, U = 2, I = Ye + 2;
    t.fillStyle = n.color, h && (t.globalAlpha = 0.85), t.fillRect(I, p - 7 - U, M + A * 2, 14 + U * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(g, I + A, p);
  }
  t.restore();
}
function xt(t, n, e, l, a, r, u, f, s, d) {
  if (!n || !n.length) return;
  t.strokeStyle = f, t.lineWidth = s, t.setLineDash(d ? [4, 3] : []), t.beginPath();
  let c = !1;
  for (let m = e; m < l; m++) {
    const h = n[m];
    if (typeof h != "number" || !isFinite(h)) {
      c && (t.stroke(), t.beginPath(), c = !1);
      continue;
    }
    const T = Ze(m, e, a), p = Be(h, r, u.priceY0, u.priceY1);
    c ? t.lineTo(T, p) : (t.moveTo(T, p), c = !0);
  }
  c && t.stroke(), t.setLineDash([]);
}
function Al(t, n, e, l, a, r, u, f, s) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = s;
  let d = !1, c = -1;
  for (let m = l; m <= a; m++) {
    const h = n[m], T = e[m], p = m < a && typeof h == "number" && typeof T == "number" && isFinite(h) && isFinite(T);
    if (p && !d && (c = m, d = !0), !p && d || m === a && d) {
      const S = p ? m + 1 : m;
      t.beginPath();
      for (let v = c; v < S; v++) {
        const g = Ze(v, l, r), M = Be(n[v], u, f.priceY0, f.priceY1);
        v === c ? t.moveTo(g, M) : t.lineTo(g, M);
      }
      for (let v = S - 1; v >= c; v--) {
        const g = Ze(v, l, r), M = Be(e[v], u, f.priceY0, f.priceY1);
        t.lineTo(g, M);
      }
      t.closePath(), t.fill(), d = !1;
    }
  }
}
function Mn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Fl(t, n, e, l) {
  const a = e.filter((S) => S.kind !== "hline" && !!S.label);
  if (!a.length) return;
  t.save(), t.font = Ne;
  const r = 8, u = 5, f = 12, s = 6, d = 14;
  let c = 0;
  for (const S of a) {
    const v = t.measureText(S.label).width;
    v > c && (c = v);
  }
  const m = r * 2 + f + s + c, h = u * 2 + d * a.length, T = Ye + 4, p = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(T, p, m, h), t.textBaseline = "middle", t.textAlign = "left";
  for (let S = 0; S < a.length; S++) {
    const v = a[S], g = p + u + d * (S + 0.5), M = T + r;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(M, g), t.lineTo(M + f, g), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = Mn(v.color, v.fillAlpha ?? 0.2), t.fillRect(M, g - 4, f, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(M + 0.5, g - 4 + 0.5, f - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, M + f + s, g);
  }
  t.restore();
}
function _l(t, n, e, l, a, r, u, f) {
  const s = Math.floor((r.x - Ye) / a), d = l.firstIdx + s;
  if (d < 0 || d >= e.length) return;
  const c = e[d];
  if (!c) return;
  const m = c.close - c.open, h = c.open !== 0 ? m / c.open * 100 : 0, T = m >= 0 ? "+" : "", p = [
    ["O", Ge(c.open), void 0],
    ["H", Ge(c.high), void 0],
    ["L", Ge(c.low), void 0],
    ["C", Ge(c.close), void 0],
    ["V", Bl(c.volume), void 0],
    ["", `${T}${h.toFixed(2)}%`, m >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Ne, t.textBaseline = "middle", t.textAlign = "left";
  const S = 8, v = 4, g = 14;
  let M = S;
  for (const [w, C] of p) {
    const W = w ? `${w} ${C}` : C, B = t.measureText(W).width + 12;
    M += B;
  }
  M += S - 12;
  const A = u.priceY0 + 4 + (f > 0 ? v * 2 + 14 * f + 4 : 0), U = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(U, A, M, g + v * 2);
  let I = U + S;
  for (let w = 0; w < p.length; w++) {
    const [C, W, B] = p[w];
    t.fillStyle = n.text, C && (t.globalAlpha = 0.6, t.fillText(C + " ", I, A + v + g / 2), t.globalAlpha = 1, I += t.measureText(C + " ").width), B && (t.fillStyle = B), t.fillText(W, I, A + v + g / 2), I += t.measureText(W).width + 12;
  }
  t.restore();
}
function Bl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Yl(t, n, e, l, a, r, u, f, s, d) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, m = Math.max(1, c * 0.5), h = Math.min(l.length, a.firstIdx + a.count), T = 9;
  let p = null;
  for (const W of e) {
    let B = 0, oe = l.length - 1, ne = -1;
    for (; B <= oe; ) {
      const V = B + oe >> 1, Q = l[V].start - W.timestamp;
      if (Math.abs(Q) <= m) {
        ne = V;
        break;
      }
      Q < 0 ? B = V + 1 : oe = V - 1;
    }
    if (ne < 0 || ne < a.firstIdx || ne >= h) continue;
    const ae = Ze(ne, a.firstIdx, f), le = Be(W.price, r, u.priceY0, u.priceY1);
    if (Math.abs(s.x - ae) <= T && Math.abs(s.y - le) <= T) {
      p = { m: W, x: ae, y: le };
      break;
    }
  }
  if (!p) return;
  const S = Jt(p.m.timestamp), v = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${S}`,
    `@ ${Ge(p.m.price)}`
  ];
  p.m.label && v.push(p.m.label), t.save(), t.font = Ne, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, M = 14;
  let A = 0;
  for (const W of v) {
    const B = t.measureText(W).width;
    B > A && (A = B);
  }
  const U = A + g * 2, I = v.length * M + g * 2;
  let w = p.x + 12;
  w + U > d - je && (w = p.x - 12 - U);
  let C = p.y - I / 2;
  C < u.priceY0 && (C = u.priceY0), C + I > u.priceY1 && (C = u.priceY1 - I), t.fillStyle = n.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(w, C, U, I), t.strokeRect(w + 0.5, C + 0.5, U - 1, I - 1);
  for (let W = 0; W < v.length; W++) {
    const B = v[W];
    t.fillStyle = W === 0 ? p.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(B, w + g, C + g + W * M);
  }
  t.restore();
}
function Wl(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, u = zl(r);
  if (!u) return;
  t.save(), t.font = Ne, t.textBaseline = "top", t.textAlign = "right";
  const f = 6, s = 3, d = t.measureText(u).width, c = l - je - f, m = a - qt + 4;
  t.fillStyle = n.accent, t.fillRect(c - d - f, m - s, d + f * 2, 14 + s * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(u, c, m), t.restore();
}
function zl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function Pl(t, n, e, l, a, r, u, f) {
  if (!l.length) return;
  const s = l.length > 1 ? l[1].start - l[0].start : 6e4, d = Math.max(1, s * 0.5), c = Math.min(l.length, a.firstIdx + a.count), m = (T) => {
    let p = 0, S = l.length - 1;
    for (; p <= S; ) {
      const v = p + S >> 1, g = l[v].start - T;
      if (Math.abs(g) <= d) return v;
      g < 0 ? p = v + 1 : S = v - 1;
    }
    return -1;
  }, h = 7;
  for (const T of e) {
    const p = m(T.timestamp);
    if (p < 0 || p < a.firstIdx || p >= c) continue;
    const S = Ze(p, a.firstIdx, f), v = Be(T.price, r, u.priceY0, u.priceY1);
    if (v < u.priceY0 || v > u.priceY1) continue;
    const g = T.color ?? (T.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), T.kind === "entry" ? (t.moveTo(S, v - h), t.lineTo(S - h, v + h - 1), t.lineTo(S + h, v + h - 1)) : (t.moveTo(S, v + h), t.lineTo(S - h, v - h + 1), t.lineTo(S + h, v - h + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Hl(t, n, e, l, a, r = !1) {
  const u = e.max - e.min;
  if (u <= 0) return;
  const f = l.priceY1 - l.priceY0, s = r ? Math.max(2, Math.min(4, Math.round(f / 36))) : 6, d = Rl(u, s), c = Math.ceil(e.min / d) * d, m = r ? Zt : je;
  t.font = r ? Sl : Ne, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let h = c; h <= e.max; h += d) {
    const T = Be(h, e, l.priceY0, l.priceY1);
    T < l.priceY0 || T > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(T) + 0.5), t.lineTo(a - m, Math.round(T) + 0.5), t.stroke(), t.fillText(Ge(h), a - m + 3, T));
  }
  t.globalAlpha = 1;
}
function $l(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const f = Math.max(1, Math.floor(l.count / 6));
  t.font = Ne, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const s = Math.min(e.length, l.firstIdx + l.count);
  for (let d = l.firstIdx; d < s; d += f) {
    const c = e[d];
    if (!c) continue;
    const m = Ze(d, l.firstIdx, a);
    t.fillText(Jt(c.start), m, r - qt + 4);
  }
  t.globalAlpha = 1;
}
function Vl(t, n, e, l, a, r, u, f, s) {
  const d = Math.floor((f.x - Ye) / u), c = Math.max(0, Math.min(e.length - 1, l.firstIdx + d)), m = e[c];
  if (!m) return;
  const h = Ze(c, l.firstIdx, u);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(h) + 0.5, r.priceY0), t.lineTo(Math.round(h) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const T = Math.max(r.priceY0, Math.min(r.priceY1, f.y));
  t.beginPath(), t.moveTo(Ye, Math.round(T) + 0.5), t.lineTo(s - je, Math.round(T) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = a.max - a.min;
  if (p > 0) {
    const g = a.max - (T - r.priceY0) / (r.priceY1 - r.priceY0) * p, M = Ge(g);
    t.font = Ne, t.textBaseline = "middle", t.textAlign = "left";
    const A = t.measureText(M).width, U = 4, I = 2;
    t.fillStyle = n.accent, t.fillRect(s - je + 2, T - 7 - I, A + U * 2, 14 + I * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(M, s - je + 2 + U, T);
  }
  t.font = Ne, t.textBaseline = "top", t.textAlign = "center";
  const S = Jt(m.start), v = t.measureText(S).width;
  t.fillStyle = n.accent, t.fillRect(h - v / 2 - 4, r.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(S, h, r.volumeY1 + 4), t.restore();
}
const Yt = 0.25, Wt = 6, Xl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Nl = /* @__PURE__ */ tt({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: xl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = z(null), l = z(null), a = { ...ke }, r = z(0), u = z(0), f = z(0), s = z(1), d = z(null), c = q(() => Math.max(1, n.slotW * s.value));
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
  ${Xt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Nt}

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

    ${Ot}

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
          m = new N.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          h = !0;
        }
        if (!h && !m.getContext() && (m.dispose(), m = null, h = !0), h) {
          I();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), p = new N.Scene(), S = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new N.CanvasTexture(M), g.minFilter = N.LinearFilter, g.magFilter = N.LinearFilter, v = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ut()
          },
          vertexShader: Xl,
          fragmentShader: A,
          transparent: !0
        }), p.add(new N.Mesh(new N.PlaneGeometry(2, 2), v)), I();
      }
    }
    function I() {
      if (!e.value || !m && !h) return;
      const R = e.value.clientWidth, $ = e.value.clientHeight;
      !R || !$ || !(M.width !== R || M.height !== $) || (M.width = R, M.height = $, r.value = R, u.value = $, m ? (g && (g.dispose(), g = new N.CanvasTexture(M), g.minFilter = N.LinearFilter, g.magFilter = N.LinearFilter, v && (v.uniforms.uTex.value = g)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(R, $)) : l.value && (l.value.width = R, l.value.height = $, l.value.style.width = R + "px", l.value.style.height = $ + "px"), w());
    }
    function w() {
      if (!(M != null && M.width)) return;
      if (h) {
        if (!l.value) return;
        dn(M, {
          candles: n.candles,
          slotW: c.value,
          scrollX: f.value,
          theme: n.theme,
          glow: !1,
          showVolume: n.showVolume,
          volumeFraction: n.volumeFraction,
          hover: d.value,
          overlays: n.overlays,
          markers: n.markers,
          compact: n.compact,
          colors: n.colors
        });
        const $ = l.value.getContext("2d");
        $ && ($.clearRect(0, 0, l.value.width, l.value.height), $.drawImage(M, 0, 0));
        return;
      }
      if (!m || !v || !g) return;
      const R = n.theme === "paper";
      v.uniforms.uStrength.value = n.curvature / 45 * 0.55, v.uniforms.uScanlines.value = n.scanlines && !R ? 1 : 0, v.uniforms.uVignette.value = R ? 0 : 1, Kt(v, n.magnify, a, M.width, M.height), dn(M, {
        candles: n.candles,
        slotW: c.value,
        scrollX: f.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: d.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), g.needsUpdate = !0, m.render(p, S);
    }
    O(() => n.theme, () => w()), O(() => n.curvature, () => w()), O(() => n.scanlines, () => w()), O(() => n.glow, () => w()), O(() => n.showVolume, () => w()), O(() => n.volumeFraction, () => w()), O(() => n.slotW, () => w()), O(() => n.candles, () => w(), { deep: !1 }), O(() => n.overlays, () => w(), { deep: !1 }), O(() => n.markers, () => w(), { deep: !1 }), O(() => n.compact, () => w()), O(() => n.magnify, (R) => {
      R || (a.x = ke.x, a.y = ke.y), w();
    }), O(() => n.colors, () => w(), { deep: !0 }), O(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), O(f, () => w()), O(s, () => w()), O(d, () => w()), O(c, () => w());
    let C = null, W = null, B = 0;
    const oe = It("cathodeResetTick", z(0));
    O(oe, () => ne());
    function ne() {
      cancelAnimationFrame(B), B = requestAnimationFrame(I);
    }
    function ae(R) {
      R.preventDefault();
    }
    function le() {
      m == null || m.dispose(), m = null, h = !1, U();
    }
    function V(R) {
      if (!l.value) return [-1, -1];
      const $ = l.value.getBoundingClientRect();
      return [R.clientX - $.left, R.clientY - $.top];
    }
    function Q(R) {
      var Ae;
      const $ = c.value;
      if ($ <= 0) return 0;
      const J = ((Ae = n.candles) == null ? void 0 : Ae.length) ?? 0, fe = Math.max(1, Math.floor((r.value || 1) / $)), Re = Math.max(0, J - fe);
      return Math.max(0, Math.min(R, Re * $));
    }
    function me(R) {
      var fe;
      if (R.deltaX !== 0 || R.shiftKey && R.deltaY !== 0) {
        const Re = R.deltaX !== 0 ? R.deltaX : R.deltaY;
        f.value = Q(f.value + Re);
        return;
      }
      if (R.deltaY === 0) return;
      const [$] = V(R), J = c.value;
      if ($ >= 0 && J > 0 && ((fe = n.candles) != null && fe.length)) {
        const Re = Math.max(1, Math.floor((r.value || 1) / J)), Oe = Math.max(0, n.candles.length - Re - Math.floor(f.value / J)) + ($ - 8) / J, Ue = Math.exp(-R.deltaY * 15e-4), Fe = Math.max(Yt, Math.min(Wt, s.value * Ue));
        s.value = Fe;
        const Je = n.slotW * Fe, at = Math.max(1, Math.floor((r.value || 1) / Je)), We = Oe - ($ - 8) / Je, Ve = Math.max(0, n.candles.length - at - We);
        f.value = Q(Ve * Je);
      } else {
        const Re = Math.exp(-R.deltaY * 15e-4);
        s.value = Math.max(Yt, Math.min(Wt, s.value * Re));
      }
    }
    let ee = !1, Z = 0, H = 0;
    function b(R) {
      R.button === 0 && (ee = !0, Z = R.clientX, H = f.value, d.value = null, e.value && e.value.focus());
    }
    function D(R) {
      const $ = Math.exp(R * 0.18);
      s.value = Math.max(Yt, Math.min(Wt, s.value * $)), f.value = Q(f.value);
    }
    function F(R) {
      const $ = c.value, J = R.shiftKey ? 20 : 3;
      switch (R.key) {
        case "ArrowLeft":
          R.preventDefault(), f.value = Q(f.value + $ * J);
          break;
        case "ArrowRight":
          R.preventDefault(), f.value = Q(f.value - $ * J);
          break;
        case "ArrowUp":
          R.preventDefault(), D(1);
          break;
        case "ArrowDown":
          R.preventDefault(), D(-1);
          break;
        case "Home":
          R.preventDefault(), f.value = Q(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          R.preventDefault(), f.value = 0;
          break;
      }
    }
    function X(R) {
      if (ee) {
        const $ = R.clientX - Z;
        f.value = Q(H + $);
        return;
      }
    }
    function K() {
      ee = !1;
    }
    function P(R) {
      if (R.touches.length !== 1) return;
      const $ = R.touches[0];
      ee = !0, Z = $.clientX, H = f.value, d.value = null;
    }
    function G(R) {
      if (!ee || R.touches.length !== 1) return;
      R.preventDefault();
      const J = R.touches[0].clientX - Z;
      f.value = Q(H + J);
    }
    function be() {
      ee = !1;
    }
    function ue(R) {
      if (n.magnify && l.value) {
        const fe = Gt(R, l.value);
        a.x = fe.x, a.y = fe.y, w();
      }
      if (ee) return;
      const [$, J] = V(R);
      if ($ < 0 || J < 0) {
        d.value = null;
        return;
      }
      d.value = { x: $, y: J };
    }
    function Le() {
      d.value = null, a.x = ke.x, a.y = ke.y, w();
    }
    qe(() => {
      document.addEventListener("mousemove", X), document.addEventListener("mouseup", K), $e(() => {
        var R;
        U(), l.value && (l.value.addEventListener("webglcontextlost", ae), l.value.addEventListener("webglcontextrestored", le)), e.value && (C = new ResizeObserver(() => I()), C.observe(e.value), W = new IntersectionObserver(($) => {
          $.some((J) => J.isIntersecting) && ne();
        }), W.observe(e.value)), window.addEventListener("resize", ne), (R = window.visualViewport) == null || R.addEventListener("resize", ne);
      });
    }), nt(() => {
      var R, $, J;
      document.removeEventListener("mousemove", X), document.removeEventListener("mouseup", K), (R = l.value) == null || R.removeEventListener("webglcontextlost", ae), ($ = l.value) == null || $.removeEventListener("webglcontextrestored", le), C == null || C.disconnect(), W == null || W.disconnect(), window.removeEventListener("resize", ne), (J = window.visualViewport) == null || J.removeEventListener("resize", ne), cancelAnimationFrame(B), T();
    });
    const Te = q(() => Ct[n.theme] ?? Ct.none), Ie = q(() => ({
      background: Te.value.bg
    }));
    return (R, $) => (we(), ye("div", {
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
}), bo = /* @__PURE__ */ lt(Nl, [["__scopeId", "data-v-78e7021b"]]), Qt = z(0), Ht = 28, ct = 12;
let $t = 10, kt = "cathode.layout", Lt = !1;
const Se = z({});
function Ol(t, n = "cathode.layout") {
  if (!Lt) {
    Lt = !0, kt = n;
    try {
      const e = localStorage.getItem(kt);
      if (e) {
        Se.value = JSON.parse(e), vn();
        return;
      }
    } catch {
    }
    Se.value = { ...t }, vn();
  }
}
function vn() {
  let t = 10;
  for (const n of Object.values(Se.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  $t = t;
}
function ot() {
  localStorage.setItem(kt, JSON.stringify(Se.value));
}
function Ul(t) {
  Lt = !1, localStorage.removeItem(kt), Se.value = { ...t }, ot(), Lt = !0, Qt.value++;
}
function Sn(t) {
  $t++, Se.value[t] && (Se.value[t].zIndex = $t);
}
function Kl(t, n) {
  Se.value[t].visible = n, ot();
}
function Gl(t, n) {
  Se.value[t].minimized = n, n && (Se.value[t].maximized = !1), ot();
}
function jl(t, n) {
  Se.value[t].maximized = n, n && (Se.value[t].minimized = !1, Sn(t)), ot();
}
function ql(t, n, e) {
  Se.value[t].x = Math.round(n), Se.value[t].y = Math.round(e), ot();
}
function Zl(t, n, e) {
  Se.value[t].w = Math.round(n), Se.value[t].h = Math.round(e), ot();
}
function xo(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - ct * (l + 1)) / l), u = Math.floor((n - ct * (a + 1)) / a), f = {};
  return e.forEach((s, d) => {
    const c = d % l, m = Math.floor(d / l);
    f[s] = {
      x: ct + c * (r + ct),
      y: ct + m * (u + ct),
      w: r,
      h: u,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: d + 1
    };
  }), f;
}
function Tn() {
  return {
    containers: Se,
    TITLEBAR_H: Ht,
    load: Ol,
    save: ot,
    reset: Ul,
    bringToFront: Sn,
    setVisible: Kl,
    setMinimized: Gl,
    setMaximized: jl,
    updatePos: ql,
    updateSize: Zl
  };
}
const Jl = { class: "ws-toolbar" }, Ql = {
  key: 0,
  class: "ws-restore-menu"
}, eo = {
  key: 0,
  class: "ws-restore-empty"
}, to = ["onClick"], no = /* @__PURE__ */ tt({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = Tn(), u = z(null);
    an("cathodeWorkspace", u), an("cathodeResetTick", Qt), qe(() => {
      if (!u.value) return;
      const { clientWidth: v, clientHeight: g } = u.value, M = n.initialLayout ?? {};
      l(M, n.storageKey ?? "cathode.layout");
      const A = Object.keys(e.value)[0];
      A && f(A);
    });
    function f(v) {
      var M;
      document.querySelectorAll(".cc").forEach((A) => A.classList.remove("cc-focused"));
      const g = (M = u.value) == null ? void 0 : M.querySelector(`#cc-${v}`);
      g && g.classList.add("cc-focused");
    }
    function s() {
      !u.value || !n.initialLayout || a(n.initialLayout);
    }
    function d(v) {
      const g = v.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const c = z(!1), m = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function h(v) {
      r(v, !0), c.value = !1;
    }
    function T(v) {
      if (!c.value) return;
      const g = v.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (c.value = !1);
    }
    function p(v) {
      v.key === "Escape" && (c.value = !1);
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
      ref: u,
      class: "cathode-workspace",
      onMousedown: d
    }, [
      zt(v.$slots, "default", {}, void 0, !0),
      zt(v.$slots, "overlay", {}, void 0, !0),
      se("div", Jl, [
        t.initialLayout ? (we(), ye("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: s
        }, " ↺ Reset Layout ")) : He("", !0),
        g[1] || (g[1] = se("div", { class: "ws-sep" }, null, -1)),
        se("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (M) => c.value = !c.value)
        }, " ⊞ Restore Panel ")
      ]),
      mn($n, { name: "menu" }, {
        default: Vn(() => [
          c.value ? (we(), ye("div", Ql, [
            g[3] || (g[3] = se("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? He("", !0) : (we(), ye("div", eo, " No closed panels ")),
            (we(!0), ye(Xn, null, Nn(m(), (M) => (we(), ye("div", {
              key: M,
              class: "ws-restore-item",
              onClick: (A) => h(M)
            }, [
              g[2] || (g[2] = se("span", { class: "ws-restore-icon" }, "⊞", -1)),
              On(" " + Pe(S(M)), 1)
            ], 8, to))), 128))
          ])) : He("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Mo = /* @__PURE__ */ lt(no, [["__scopeId", "data-v-5838d04b"]]), lo = ["id"], oo = { class: "cc-title" }, ao = {
  key: 0,
  class: "cc-size-badge"
}, ro = { class: "cc-controls" }, io = ["title"], so = { class: "cc-body" }, co = 200, uo = 80, hn = 60, fo = /* @__PURE__ */ tt({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: u, updatePos: f, updateSize: s } = Tn(), d = It("cathodeWorkspace", z(null)), c = q(() => e.value[n.id]), m = q(() => {
      const b = c.value, D = n.curvature ?? 0;
      if (!b) return {};
      const F = { "--curvature": D };
      return b.maximized ? { ...F, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: b.zIndex } : {
        ...F,
        left: b.x + "px",
        top: b.y + "px",
        width: b.w + "px",
        height: b.minimized ? Ht + "px" : b.h + "px",
        zIndex: b.zIndex,
        display: b.visible ? "flex" : "none"
      };
    });
    let h = !1, T = 0, p = 0;
    function S(b) {
      var X;
      if (b.target.closest(".cc-btn") || c.value.maximized) return;
      l(n.id), h = !0;
      const D = (X = d.value) == null ? void 0 : X.querySelector(`#cc-${n.id}`);
      if (!D) return;
      const F = D.getBoundingClientRect();
      T = b.clientX - F.left, p = b.clientY - F.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), b.preventDefault();
    }
    function v(b) {
      var P;
      if (!h || !d.value) return;
      const D = d.value.getBoundingClientRect(), F = ((P = c.value) == null ? void 0 : P.w) ?? 300;
      let X = b.clientX - D.left - T, K = b.clientY - D.top - p;
      X = Math.max(hn - F, Math.min(D.width - hn, X)), K = Math.max(0, Math.min(D.height - Ht, K)), f(n.id, X, K);
    }
    function g() {
      h = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let M = !1, A = 0, U = 0, I = 0, w = 0;
    const C = z("");
    function W(b) {
      c.value.maximized || (l(n.id), M = !0, A = b.clientX, U = b.clientY, I = c.value.w, w = c.value.h, document.addEventListener("mousemove", B), document.addEventListener("mouseup", oe), b.preventDefault(), b.stopPropagation());
    }
    function B(b) {
      if (!M) return;
      const D = Math.max(co, I + (b.clientX - A)), F = Math.max(uo, w + (b.clientY - U));
      s(n.id, D, F), C.value = `${Math.round(D)}×${Math.round(F)}`;
    }
    function oe() {
      M = !1, C.value = "", document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", oe), ne.value++;
    }
    const ne = z(0);
    O(Qt, () => {
      ne.value++;
    }), nt(() => {
      var b;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", oe), (b = ae.value) == null || b.removeEventListener("scroll", V), Q();
    });
    const ae = z(null);
    function le(b) {
      if (n.canvas) return [];
      const D = b.children[0];
      return D ? Array.from(D.children) : [];
    }
    function V() {
      const b = ae.value, D = n.curvature ?? 0;
      if (!b) return;
      const F = le(b);
      if (!F.length) return;
      const X = b.clientHeight, K = X / 2, P = D * 38e-4;
      F.forEach((G) => {
        if (!G.dataset.origFs) {
          const fe = getComputedStyle(G);
          G.dataset.origFs = fe.fontSize, G.dataset.origLh = fe.lineHeight;
        }
        if (D === 0) {
          G.style.fontSize = "", G.style.lineHeight = "";
          return;
        }
        const be = G.getBoundingClientRect(), ue = b.getBoundingClientRect(), Le = be.top - ue.top + be.height / 2, Te = Math.min(1, Math.abs(Le - K) / (X / 2)), Ie = 1 + P * Math.cos(Te * Math.PI / 2), R = parseFloat(G.dataset.origFs), $ = G.dataset.origLh, J = $ === "normal" ? R * 1.4 : parseFloat($);
        isNaN(R) || (G.style.fontSize = `${(R * Ie).toFixed(2)}px`), isNaN(J) || (G.style.lineHeight = `${(J * Ie).toFixed(2)}px`);
      });
    }
    function Q() {
      const b = ae.value;
      b && le(b).forEach((D) => {
        D.style.fontSize = "", D.style.lineHeight = "", delete D.dataset.origFs, delete D.dataset.origLh;
      });
    }
    O(() => n.curvature, (b) => {
      (b ?? 0) === 0 ? Q() : V();
    }), qe(() => {
      var b;
      (b = ae.value) == null || b.addEventListener("scroll", V, { passive: !0 }), $e(V);
    });
    function me() {
      r(n.id, !c.value.minimized), $e(() => {
        ne.value++;
      });
    }
    function ee() {
      u(n.id, !c.value.maximized), $e(() => {
        ne.value++;
      });
    }
    function Z() {
      a(n.id, !1);
    }
    function H() {
      l(n.id);
    }
    return (b, D) => c.value && c.value.visible ? (we(), ye("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: Un(["cc", { "cc-minimized": c.value.minimized, "cc-maximized": c.value.maximized, "cc-has-canvas": t.canvas }]),
      style: _e(m.value),
      onMousedown: H
    }, [
      se("div", {
        class: "cc-titlebar",
        onMousedown: S
      }, [
        D[0] || (D[0] = se("span", { class: "cc-status-dot" }, null, -1)),
        se("span", oo, Pe(t.title), 1),
        C.value ? (we(), ye("span", ao, Pe(C.value), 1)) : He("", !0),
        se("div", ro, [
          se("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ke(me, ["stop"])
          }, "─"),
          se("button", {
            class: "cc-btn cc-btn-max",
            title: c.value.maximized ? "Restore" : "Maximize",
            onClick: Ke(ee, ["stop"])
          }, Pe(c.value.maximized ? "⤡" : "⤢"), 9, io),
          se("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ke(Z, ["stop"])
          }, "✕")
        ])
      ], 32),
      gn(se("div", so, [
        se("div", {
          ref_key: "bodyEl",
          ref: ae,
          class: "cc-screen",
          onScroll: V
        }, [
          zt(b.$slots, "default", { resizeKey: ne.value }, void 0, !0),
          D[1] || (D[1] = se("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Kn, !c.value.minimized]
      ]),
      !c.value.minimized && !c.value.maximized ? (we(), ye("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ke(W, ["stop"])
      }, null, 32)) : He("", !0)
    ], 46, lo)) : He("", !0);
  }
}), So = /* @__PURE__ */ lt(fo, [["__scopeId", "data-v-d8a49f79"]]), vo = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ho = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
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
`, mo = 100, go = /* @__PURE__ */ tt({
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
    let r = null, u = !1;
    function f() {
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
    let s, d, c, m, h, T = null, p = 0;
    function S(w) {
      w - p >= mo && (M(), p = w), T = requestAnimationFrame(S);
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
      const le = ".".repeat(ae).padEnd(3, " "), V = `${n.label}${le}`;
      if (w.fillText(V, C / 2, W / 2), w.shadowBlur = 0, ne) {
        const Q = w.measureText(V), me = w.measureText("M").width, ee = parseFloat(w.font), Z = C / 2 + Q.width / 2 + 4, H = W / 2 - ee / 2 + 2;
        w.fillStyle = B.cursor, n.glow && (w.shadowColor = B.cursor, w.shadowBlur = 12), w.fillRect(Z, H, me * 0.7, ee * 0.95), w.shadowBlur = 0;
      }
    }
    function M() {
      if (!h) return;
      if (g(), u) {
        if (!a.value) return;
        const C = a.value.getContext("2d");
        C && C.drawImage(h, 0, 0);
        return;
      }
      if (!r || !c || !m) return;
      const w = n.theme === "paper";
      c.uniforms.uStrength.value = n.curvature / 45 * 0.55, c.uniforms.uScanlines.value = n.scanlines && !w ? 1 : 0, c.uniforms.uVignette.value = w ? 0 : 1, m.needsUpdate = !0, r.render(s, d);
    }
    function A() {
      if (!(!a.value || !l.value)) {
        h = document.createElement("canvas");
        try {
          r = new N.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          u = !0;
        }
        if (!u && !r.getContext() && (r.dispose(), r = null, u = !0), u) {
          v();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), s = new N.Scene(), d = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new N.CanvasTexture(h), m.minFilter = N.LinearFilter, m.magFilter = N.LinearFilter, c = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: vo,
          fragmentShader: ho,
          transparent: !0
        }), s.add(new N.Mesh(new N.PlaneGeometry(2, 2), c)), v();
      }
    }
    let U = null;
    qe(() => {
      A(), M(), T = requestAnimationFrame(S), l.value && (U = new ResizeObserver(() => v()), U.observe(l.value));
    }), nt(() => {
      T !== null && cancelAnimationFrame(T), U == null || U.disconnect(), f(), m == null || m.dispose(), c == null || c.dispose();
    }), O(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => M());
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
}), To = /* @__PURE__ */ lt(go, [["__scopeId", "data-v-5a54a7ab"]]);
export {
  Ct as CANDLE_THEME_COLORS,
  bo as CathodeCandle,
  So as CathodeContainer,
  wo as CathodeGrid,
  To as CathodeLoader,
  wl as CathodeLog,
  yo as CathodeTerminal,
  Mo as CathodeWorkspace,
  Tt as LOG_THEME_COLORS,
  xo as buildDefaultLayout,
  Tn as useCathodeLayout
};
