import { defineComponent as et, ref as z, reactive as Yt, computed as q, watch as X, inject as Lt, nextTick as Ve, onMounted as Ze, onUnmounted as tt, openBlock as ye, createElementBlock as be, normalizeStyle as _e, createElementVNode as se, withModifiers as Ge, withKeys as $n, createCommentVNode as He, toDisplayString as Pe, createVNode as yn, withDirectives as bn, vModelText as On, provide as un, renderSlot as Nt, Transition as Xn, withCtx as Un, Fragment as Kn, renderList as Gn, createTextVNode as jn, normalizeClass as qn, vShow as Zn } from "vue";
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
}, ge = 30, $t = 12, Jn = 10, Mt = 14, xn = 5;
function Mn() {
  return `${$t}px system-ui, -apple-system, sans-serif`;
}
function Sn(t, n, e) {
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
function Qn(t, n) {
  return Math.max(n, t * Mt + xn * 2);
}
function Ut(t, n) {
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
const Tn = 28;
function el(t, n) {
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
function fn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = ut[n.theme] ?? ut.none, { cols: c, rows: d, pinnedRows: i, rowHeight: f, scrollY: u, scrollX: h, glow: m } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const T = i.length * f, p = n.aggregateRow ? Tn : 0, S = a - ge - T - p;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, ge), e.textBaseline = "middle", e.textAlign = "left";
  let v = -h;
  for (let H = 0; H < c.length; H++) {
    const x = c[H];
    if (v + x.width <= 0) {
      v += x.width;
      continue;
    }
    if (v >= l) break;
    const D = !!n.colFilters[x.colId], F = n.sortColId === x.colId, $ = (x.colDef.headerName ?? x.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, x.width, ge), e.clip(), e.font = `bold ${Jn}px system-ui, -apple-system, sans-serif`, e.fillStyle = D ? r.accent : r.textHeader, m ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText($, v + 8, ge / 2), e.shadowBlur = 4, e.fillText($, v + 8, ge / 2), e.shadowBlur = 0) : e.fillText($, v + 8, ge / 2), F) {
      const K = e.measureText($).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", v + 8 + K + 4, ge / 2);
    }
    x.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = D ? r.accent : r.textHeader, e.globalAlpha = D ? 1 : 0.38, e.fillText("⌕", v + x.width - 20, ge / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + x.width - 0.5, 0), e.lineTo(v + x.width - 0.5, ge), e.stroke(), v += x.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ge - 0.5), e.lineTo(l, ge - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ge, l, S), e.clip();
  const g = n.rowHeights && n.rowHeights.length === d.length ? n.rowHeights : null, M = g ? Ut(g, d.length) : null, A = (H) => M ? M[H] : H * f, U = (H) => g ? g[H] : f, L = M ? St(M, u) : Math.max(0, Math.floor(u / f));
  let y;
  if (M)
    for (y = L; y < d.length && A(y) < u + S; ) y++;
  else
    y = Math.min(d.length, Math.ceil((u + S) / f));
  const C = n.selectionAnchorRow ?? n.selectedRow, W = n.selectionAnchorCol ?? n.selectedCol, _ = n.selectedRow >= 0 && C >= 0 ? Math.min(n.selectedRow, C) : -1, ae = n.selectedRow >= 0 && C >= 0 ? Math.max(n.selectedRow, C) : -1, te = n.selectedCol >= 0 && W >= 0 ? Math.min(n.selectedCol, W) : -1, re = n.selectedCol >= 0 && W >= 0 ? Math.max(n.selectedCol, W) : -1, ne = ae > _ || re > te;
  let N = Number.POSITIVE_INFINITY, Q = Number.NEGATIVE_INFINITY, he = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY;
  const Z = (H, x, D, F) => {
    m ? (e.shadowColor = F, e.shadowBlur = 12, e.fillText(H, x, D), e.shadowBlur = 6, e.fillText(H, x, D), e.shadowBlur = 2, e.fillText(H, x, D), e.shadowBlur = 0) : e.fillText(H, x, D);
  };
  for (let H = L; H < y; H++) {
    const x = d[H], D = U(H), F = ge + A(H) - u;
    H % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, F, l, D));
    const $ = H >= _ && H <= ae;
    H === n.hoveredRow && !$ && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, F, l, D)), $ && !ne && (e.fillStyle = Wt(r.accent, 0.1), e.fillRect(0, F, l, D)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + D - 0.5), e.lineTo(l, F + D - 0.5), e.stroke();
    let K = -h;
    for (let P = 0; P < c.length; P++) {
      const G = c[P];
      if (K + G.width <= 0) {
        K += G.width;
        continue;
      }
      if (K >= l) break;
      const xe = $ && P >= te && P <= re;
      xe && ne && (e.fillStyle = Wt(r.accent, 0.14), e.fillRect(K, F, G.width, D)), xe && (K < N && (N = K), K + G.width > Q && (Q = K + G.width), F < he && (he = F), F + D > ee && (ee = F + D));
      const ue = n.getCellStyle(G, x), Ie = ue.color ?? r.text, Ce = ue.textAlign ?? "left", Le = n.formatCell(G, x);
      if (e.save(), e.beginPath(), e.rect(K + 1, F, G.width - 2, D), e.clip(), e.font = Mn(), e.fillStyle = Ie, e.textBaseline = "middle", G.colDef.wrap) {
        e.textAlign = "left";
        const R = Sn(e, Le, Math.max(20, G.width - 16));
        let V = F + xn + Mt / 2;
        for (const le of R) {
          if (V - Mt / 2 >= F + D) break;
          Z(le, K + 8, V, Ie), V += Mt;
        }
      } else {
        const R = Ce === "right" ? K + G.width - 8 : K + 8;
        e.textAlign = Ce === "right" ? "right" : "left", Z(Le, R, F + D / 2, Ie);
      }
      e.restore(), H === n.selectedRow && P === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(K + 1.5, F + 1.5, G.width - 3, D - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(K + G.width - 0.5, F), e.lineTo(K + G.width - 0.5, F + D), e.stroke(), K += G.width;
    }
  }
  if (ne && N < Q && he < ee && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(N + 0.5, he + 0.5, Q - N - 1, ee - he - 1)), e.restore(), i.length > 0) {
    const H = a - T - p;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    for (let x = 0; x < i.length; x++) {
      const D = i[x], F = H + x * f;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, F, l, f);
      let $ = -h;
      for (let K = 0; K < c.length; K++) {
        const P = c[K];
        if ($ + P.width <= 0) {
          $ += P.width;
          continue;
        }
        if ($ >= l) break;
        const G = n.getCellStyle(P, D), xe = G.color ?? r.text, ue = G.textAlign ?? "left", Ie = n.formatCell(P, D);
        e.save(), e.beginPath(), e.rect($ + 1, F, P.width - 2, f), e.clip(), e.font = `bold ${$t}px system-ui, -apple-system, sans-serif`, e.fillStyle = xe, e.textBaseline = "middle", ue === "right" ? (e.textAlign = "right", e.fillText(Ie, $ + P.width - 8, F + f / 2)) : (e.textAlign = "left", e.fillText(Ie, $ + 8, F + f / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo($ + P.width - 0.5, F), e.lineTo($ + P.width - 0.5, F + f), e.stroke(), $ += P.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, F + f - 0.5), e.lineTo(l, F + f - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const H = a - p;
    e.fillStyle = Wt(r.accent, 0.1), e.fillRect(0, H, l, p), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    let x = -h;
    for (let D = 0; D < c.length; D++) {
      const F = c[D];
      if (x + F.width <= 0) {
        x += F.width;
        continue;
      }
      if (x >= l) break;
      const K = n.getCellStyle(F, n.aggregateRow).textAlign ?? "left", P = n.aggregateRow[F.colId] ?? "";
      e.save(), e.beginPath(), e.rect(x + 1, H, F.width - 2, p), e.clip(), e.font = `bold ${$t}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", m && (e.shadowColor = r.accent, e.shadowBlur = 8), K === "right" ? (e.textAlign = "right", e.fillText(P, x + F.width - 8, H + p / 2)) : (e.textAlign = "left", e.fillText(P, x + 8, H + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(x + F.width - 0.5, H), e.lineTo(x + F.width - 0.5, H + p), e.stroke(), x += F.width;
    }
  }
  e.restore();
}
function Wt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
function tl(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = Math.abs(e), c = (l * l + a * a) * r;
  if (e < 0) {
    const f = 0.5 * r, h = 1 / (1 - 2 * (0.5 * (1 + f) * f)), m = (l + l * (1 + c) * c * -1) * h, T = (a + a * (1 + c) * c * -1) * h;
    return [0.5 + m, 0.5 + T];
  }
  const d = l * (1 + c) * c, i = a * (1 + c) * c;
  return [t + d, n + i * 0.15];
}
function nl(t, n, e, l, a) {
  const r = t / e, c = 1 - n / l, [d, i] = tl(r, c, a);
  return d < 0 || d > 1 || i < 0 || i > 1 ? [-1, -1] : [d * e, (1 - i) * l];
}
function zt(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function ll(t, n, e, l = 1) {
  return t >= n + e - 24 * l && t < n + e;
}
function dn(t, n, e, l = 1) {
  const a = n + e;
  return t >= a - 6 * l && t <= a + 1 * l;
}
function vn(t, n, e, l, a, r, c, d, i, f = !1, u) {
  const h = t + i;
  let m = -1, T = 0;
  for (let M = 0; M < e.length; M++) {
    if (h >= T && h < T + e[M].width) {
      m = M;
      break;
    }
    T += e[M].width;
  }
  if (n < ge) return { area: "header", colIdx: m, rowIdx: -1 };
  const p = f ? Tn : 0;
  if (p > 0 && n >= c - p)
    return { area: "agg", colIdx: m, rowIdx: -1 };
  const S = d * a;
  if (S > 0 && n >= c - S - p) {
    const M = Math.floor((n - (c - S - p)) / a);
    return { area: "pinned", colIdx: m, rowIdx: M };
  }
  const v = n - ge + r, g = u && u.length === l ? St(Ut(u, l), v) : Math.floor(v / a);
  return g >= 0 && g < l ? { area: "body", colIdx: m, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function bt(t) {
  return t / 45 * 0.55;
}
const ol = 500, al = ol / 2, rl = 1.6, Kt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Gt = `
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
`, jt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function qt() {
  return {
    uMouseUV: { value: new O.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: rl },
    uLensTint: { value: new O.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const ke = { x: -999, y: -999 };
function Zt(t, n, e, l, a) {
  const r = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = r && a > 0 ? al / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function Jt(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const il = ["value"], sl = ["disabled"], cl = ["disabled"], ul = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, fl = 28, dl = 600, vl = /* @__PURE__ */ et({
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
    const e = t, l = n, a = z(e.rowData ?? []), r = z(e.pinnedBottomRowData ?? []), c = z(""), d = z(null), i = Yt({}), f = Yt({}), u = Yt(/* @__PURE__ */ new Set()), h = z(0), m = z(0), T = z(0), p = z(0), S = z(0), v = z(-1), g = z(null), M = z(null), A = z(null), U = { ...ke }, L = z({ x: 0, y: ge }), y = z("");
    function C(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const W = q(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((s) => !u.has(C(s))).map((s) => {
        const b = C(s), I = { ...o, ...s };
        return { colId: b, colDef: I, width: f[b] ?? I.width ?? 100 };
      });
    }), _ = q(() => {
      const o = m.value;
      if (!o) return W.value;
      const s = W.value.reduce((k, E) => k + E.width, 0);
      if (!s || s >= o) return W.value;
      const b = o / s;
      let I = 0;
      return W.value.map((k, E) => {
        const j = E === W.value.length - 1 ? o - I : Math.max(8, Math.round(k.width * b));
        return I += j, { ...k, width: j };
      });
    }), ae = q(() => {
      const o = _.value.reduce((s, b) => s + b.width, 0);
      return Math.max(0, o - m.value);
    });
    let te = null;
    function re() {
      if (typeof document > "u") return null;
      te || (te = document.createElement("canvas"));
      const o = te.getContext("2d");
      return o && (o.font = Mn()), o;
    }
    const ne = q(() => _.value.some((o) => o.colDef.wrap)), N = q(() => {
      if (!ne.value) return null;
      const o = re();
      if (!o) return null;
      const s = _.value.filter((I) => I.colDef.wrap), b = e.rowHeight;
      return P.value.map((I) => {
        let k = 1;
        for (const E of s) {
          const Y = Sn(o, $(E, I), Math.max(20, E.width - 16));
          Y.length > k && (k = Y.length);
        }
        return Qn(k, b);
      });
    }), Q = q(
      () => N.value ? Ut(N.value, P.value.length) : null
    ), he = q(
      () => Q.value ? Q.value[P.value.length] : P.value.length * e.rowHeight
    ), ee = q(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, T.value - ge - o);
    }), Z = q(
      () => Math.max(0, he.value - ee.value)
    ), H = q(
      () => Math.max(1, Math.floor(ee.value / e.rowHeight))
    ), x = q(() => {
      const o = P.value.length;
      if (o === 0) return 0;
      const s = Q.value ? St(Q.value, p.value) : Math.floor(p.value / e.rowHeight);
      return Math.min(o - 1, s);
    }), D = q(() => {
      const o = P.value.length;
      return o === 0 ? 0 : Q.value ? Math.min(o - 1, St(Q.value, p.value + ee.value - 1)) : Math.min(o - 1, x.value + H.value - 1);
    });
    function F(o, s) {
      if (s.colDef.valueGetter) return s.colDef.valueGetter({ data: o, colDef: s.colDef });
      if (s.colDef.field) return o[s.colDef.field];
    }
    function $(o, s) {
      const b = F(s, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: b, data: s, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: b, data: s, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function K(o, s) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: F(s, o), data: s, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const P = q(() => {
      h.value;
      let o = a.value;
      const s = c.value.trim().toLowerCase();
      s && (o = o.filter(
        (b) => W.value.some(
          (I) => String(F(b, I) ?? "").toLowerCase().includes(s)
        )
      ));
      for (const [b, I] of Object.entries(i)) {
        if (!I) continue;
        const k = W.value.find((E) => E.colId === b);
        if (k)
          if (I.startsWith("__eq__")) {
            const E = I.slice(6).toLowerCase();
            o = o.filter((Y) => String(F(Y, k) ?? "").toLowerCase() === E);
          } else {
            const E = I.toLowerCase();
            o = o.filter((Y) => String(F(Y, k) ?? "").toLowerCase().includes(E));
          }
      }
      if (d.value) {
        const { colId: b, dir: I } = d.value, k = W.value.find((E) => E.colId === b);
        k && (o = [...o].sort((E, Y) => {
          const j = F(E, k), de = F(Y, k);
          let ve = 0;
          return k.colDef.comparator ? ve = k.colDef.comparator(j, de) : typeof j == "number" && typeof de == "number" ? ve = j - de : ve = String(j ?? "").localeCompare(String(de ?? ""), void 0, { numeric: !0 }), I === "asc" ? ve : -ve;
        }));
      }
      return o;
    }), G = q(() => {
      const o = W.value.filter((k) => k.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const s = P.value, b = {};
      for (const k of o) {
        const E = s.map((j) => F(j, k)), Y = el(E, k.colDef.aggFunc);
        if (Y == null) {
          b[k.colId] = "";
          continue;
        }
        b[k.colId] = k.colDef.aggValueFormatter ? k.colDef.aggValueFormatter(Y) : String(Y);
      }
      const I = o[0].colId;
      return b[I] === "" && (b[I] = "Σ"), b;
    });
    X(P, () => {
      p.value = 0, g.value = null;
    }), X(ae, () => {
      S.value = Math.min(S.value, ae.value);
    }), X(Z, () => {
      p.value = Math.min(p.value, Z.value);
    });
    function xe(o) {
      const s = Q.value, b = s ? s[o] : o * e.rowHeight, I = s ? s[o + 1] : b + e.rowHeight;
      b < p.value ? p.value = b : I > p.value + ee.value && (p.value = Math.min(Z.value, I - ee.value));
    }
    function ue() {
      p.value = Math.max(0, p.value - ee.value), Me();
    }
    function Ie() {
      p.value = Math.min(Z.value, p.value + ee.value), Me();
    }
    let Ce = !1, Le = "", R = 0, V = 0, le = 1, me = !1, pe = !1, Ae = 0, Xe = 0, Ue = 0, Ne = 0, De = !1;
    function ft(o, s, b = 1) {
      var I;
      Ce = !0, Le = o, R = s, le = b, V = ((I = _.value.find((k) => k.colId === o)) == null ? void 0 : I.width) ?? 100, me = !1;
    }
    function We(o) {
      if (pe) {
        const E = Ae - o.clientX, Y = Xe - o.clientY;
        (Math.abs(E) > 4 || Math.abs(Y) > 4) && (De = !0), S.value = Math.max(0, Math.min(ae.value, Ue + E)), p.value = Math.max(0, Math.min(Z.value, Ne + Y)), Me();
        return;
      }
      if (!Ce) return;
      const s = m.value, b = Math.max(30, V + (o.clientX - R) * le), I = W.value.filter((E) => E.colId !== Le).reduce((E, Y) => E + Y.width, 0), k = s - b;
      k > 10 && (f[Le] = Math.max(10, Math.round(b * I / k))), Me();
    }
    function ze() {
      pe && (De && (me = !0), pe = !1), Ce && (Ce = !1, me = !0, l("column-resized"));
    }
    function dt(o) {
      if (o.touches.length !== 1) return;
      const s = o.touches[0];
      pe = !0, De = !1, Ae = s.clientX, Xe = s.clientY, Ue = S.value, Ne = p.value;
    }
    function Rt(o) {
      if (!pe || o.touches.length !== 1) return;
      o.preventDefault();
      const s = o.touches[0], b = Ae - s.clientX, I = Xe - s.clientY;
      (Math.abs(b) > 4 || Math.abs(I) > 4) && (De = !0), S.value = Math.max(0, Math.min(ae.value, Ue + b)), p.value = Math.max(0, Math.min(Z.value, Ne + I)), Me();
    }
    function $e() {
      pe && (De && (me = !0), pe = !1);
    }
    const Fe = z(null), oe = z(null), Dt = Lt("cathodeResetTick", z(0));
    X(Dt, () => rt());
    let ce = null, w = !1;
    function B() {
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
    let J, Re, we, fe, ie;
    const ot = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Kt}

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

  ${Gt}

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

    ${jt}

    gl_FragColor = color;
  }
`;
    function Ke() {
      if (!(!oe.value || !Fe.value)) {
        ie = document.createElement("canvas");
        try {
          ce = new O.WebGLRenderer({ canvas: oe.value, antialias: !1, alpha: !0 });
        } catch {
          w = !0;
        }
        if (!w && !ce.getContext() && (ce.dispose(), ce = null, w = !0), w) {
          at();
          return;
        }
        ce.setPixelRatio(1), ce.setClearColor(0, 0), J = new O.Scene(), Re = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), fe = new O.CanvasTexture(ie), fe.minFilter = O.LinearFilter, fe.magFilter = O.LinearFilter, we = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: fe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new O.Color(0) },
            ...qt()
          },
          vertexShader: ul,
          fragmentShader: ot,
          transparent: !0
        }), J.add(new O.Mesh(new O.PlaneGeometry(2, 2), we)), at();
      }
    }
    function at() {
      if (!Fe.value || !ce && !w) return;
      const o = Fe.value.clientWidth, s = Fe.value.clientHeight - (e.pagination ? fl : 0);
      if (!o || !s) return;
      const b = ie.width !== o || ie.height !== s;
      ie.width = o, ie.height = s, m.value = o, T.value = s, S.value = Math.max(0, Math.min(ae.value, S.value)), p.value = Math.max(0, Math.min(Z.value, p.value)), ce ? (b && fe && (fe.dispose(), fe = new O.CanvasTexture(ie), fe.minFilter = O.LinearFilter, fe.magFilter = O.LinearFilter, we && (we.uniforms.uTex.value = fe)), ce.setPixelRatio(window.devicePixelRatio || 1), ce.setSize(o, s)) : oe.value && (oe.value.width = o, oe.value.height = s, oe.value.style.width = o + "px", oe.value.style.height = s + "px"), Me();
    }
    function Me() {
      var b, I, k, E, Y, j, de, ve, it, mt, gt, st;
      if (!(ie != null && ie.width)) return;
      if (w) {
        if (!oe.value) return;
        fn(ie, {
          cols: _.value,
          rows: P.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: N.value ?? void 0,
          scrollY: p.value,
          scrollX: S.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = d.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((I = d.value) == null ? void 0 : I.dir) ?? null,
          colFilters: i,
          hoveredRow: v.value,
          selectedRow: ((k = g.value) == null ? void 0 : k.row) ?? -1,
          selectedCol: ((E = g.value) == null ? void 0 : E.col) ?? -1,
          selectionAnchorRow: ((Y = M.value) == null ? void 0 : Y.row) ?? -1,
          selectionAnchorCol: ((j = M.value) == null ? void 0 : j.col) ?? -1,
          formatCell: $,
          getCellStyle: K
        });
        const pt = oe.value.getContext("2d");
        pt && pt.drawImage(ie, 0, 0);
        return;
      }
      if (!ce || !we || !fe) return;
      const o = ut[e.theme] ?? ut.none, s = e.theme === "paper";
      we.uniforms.uStrength.value = bt(e.curvature), we.uniforms.uScanlines.value = e.scanlines && !s ? 1 : 0, we.uniforms.uVignette.value = s ? 0 : 1, we.uniforms.uBezel.value.set(o.bg), Zt(we, e.magnify, U, ie.width, ie.height), fn(ie, {
        cols: _.value,
        rows: P.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: N.value ?? void 0,
        scrollY: p.value,
        scrollX: S.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((de = d.value) == null ? void 0 : de.colId) ?? null,
        sortDir: ((ve = d.value) == null ? void 0 : ve.dir) ?? null,
        colFilters: i,
        hoveredRow: v.value,
        selectedRow: ((it = g.value) == null ? void 0 : it.row) ?? -1,
        selectedCol: ((mt = g.value) == null ? void 0 : mt.col) ?? -1,
        selectionAnchorRow: ((gt = M.value) == null ? void 0 : gt.row) ?? -1,
        selectionAnchorCol: ((st = M.value) == null ? void 0 : st.col) ?? -1,
        formatCell: $,
        getCellStyle: K,
        aggregateRow: G.value
      }), fe.needsUpdate = !0, ce.render(J, Re);
    }
    function Et(o, s) {
      if (!oe.value) return [-1, -1];
      const b = oe.value.getBoundingClientRect(), I = o - b.left, k = s - b.top, E = oe.value.width || b.width, Y = oe.value.height || b.height, j = bt(e.curvature), [de, ve] = nl(I, k, E, Y, j);
      return de < 0 ? [-1, -1] : [de, ve];
    }
    function At(o) {
      return Et(o.clientX, o.clientY);
    }
    function Ft(o) {
      if (!oe.value) return 1;
      const [s] = Et(o.clientX - 4, o.clientY), [b] = Et(o.clientX + 4, o.clientY);
      if (s < 0 || b < 0) return 1;
      const I = oe.value.getBoundingClientRect(), k = (oe.value.width || I.width) / I.width;
      return Math.max(1, Math.abs(b - s) / 8 / k);
    }
    let _t = 0;
    function Rn(o) {
      A.value = null;
      const s = Date.now();
      if (o.deltaX !== 0) {
        _t = s, S.value = Math.max(0, Math.min(ae.value, S.value + o.deltaX)), Me();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        _t = s, S.value = Math.max(0, Math.min(ae.value, S.value + o.deltaY)), Me();
        return;
      }
      s - _t < dl || (p.value = Math.max(0, Math.min(Z.value, p.value + o.deltaY)), Me());
    }
    function Dn(o) {
      if (Ce) return;
      if (e.magnify && oe.value) {
        const k = Jt(o, oe.value);
        U.x = k.x, U.y = k.y;
      }
      const [s, b] = At(o);
      if (s < 0) {
        v.value = -1, Me();
        return;
      }
      const I = vn(
        s,
        b,
        _.value,
        P.value.length,
        e.rowHeight,
        p.value,
        ie.height,
        r.value.length,
        S.value,
        G.value !== null,
        N.value ?? void 0
      );
      if (v.value = I.area === "body" ? I.rowIdx : -1, I.area === "header" && I.colIdx >= 0) {
        const k = _.value[I.colIdx], E = zt(I.colIdx, _.value), Y = s + S.value;
        oe.value.style.cursor = k && dn(Y, E, k.width, Ft(o)) ? "col-resize" : "pointer";
      } else I.area === "body" ? oe.value.style.cursor = "pointer" : oe.value.style.cursor = "default";
      Me();
    }
    function En() {
      v.value = -1, U.x = ke.x, U.y = ke.y, Me();
    }
    function An(o) {
      const [s, b] = At(o);
      if (s < 0) return;
      if (b >= ge) {
        pe = !0, De = !1, Ae = o.clientX, Xe = o.clientY, Ue = S.value, Ne = p.value;
        return;
      }
      const I = s + S.value, k = Ft(o);
      for (let E = 0; E < _.value.length; E++) {
        const Y = _.value[E], j = zt(E, _.value);
        if (Y.colDef.resizable !== !1 && dn(I, j, Y.width, k)) {
          ft(Y.colId, o.clientX, k);
          return;
        }
      }
    }
    function Fn(o) {
      var k, E, Y;
      if (me) {
        me = !1;
        return;
      }
      if (Ce) return;
      const [s, b] = At(o);
      if (s < 0) {
        A.value = null;
        return;
      }
      const I = vn(
        s,
        b,
        _.value,
        P.value.length,
        e.rowHeight,
        p.value,
        ie.height,
        r.value.length,
        S.value,
        G.value !== null,
        N.value ?? void 0
      );
      if (I.area === "header" && I.colIdx >= 0) {
        const j = _.value[I.colIdx], de = zt(I.colIdx, _.value), ve = s + S.value;
        j.colDef.filter && ll(ve, de, j.width, Ft(o)) ? (o.stopPropagation(), A.value === j.colId ? A.value = null : (A.value = j.colId, y.value = (k = i[j.colId]) != null && k.startsWith("__eq__") ? i[j.colId].slice(6) : i[j.colId] ?? "", L.value = { x: Math.max(0, de - S.value), y: ge })) : j.colDef.sortable !== !1 && (A.value = null, d.value = ((E = d.value) == null ? void 0 : E.colId) === j.colId ? d.value.dir === "asc" ? { colId: j.colId, dir: "desc" } : null : { colId: j.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (A.value = null, I.area === "body" && I.rowIdx >= 0 && I.colIdx >= 0) {
        const j = I.rowIdx;
        o.shiftKey && g.value ? (M.value || (M.value = { ...g.value }), g.value = { row: j, col: I.colIdx }) : (g.value = { row: j, col: I.colIdx }, M.value = { row: j, col: I.colIdx }), (Y = oe.value) == null || Y.focus();
        const de = P.value[j], ve = _.value[I.colIdx];
        de && ve && (l("row-clicked", { data: de, event: o }), l("cell-selected", { data: de, row: j, col: I.colIdx, colId: ve.colId }));
      }
    }
    function on(o) {
      var s, b;
      A.value && ((b = (s = o.target).closest) != null && b.call(s, ".cathode-filter-popup") || (A.value = null));
    }
    function _n(o) {
      var k;
      if (!m.value) return;
      let s = 0;
      for (let E = 0; E < o; E++) s += _.value[E].width;
      const b = ((k = _.value[o]) == null ? void 0 : k.width) ?? 0, I = s - S.value;
      I < 0 ? S.value = Math.max(0, s) : I + b > m.value && (S.value = Math.min(ae.value, s + b - m.value));
    }
    function Bn(o) {
      const b = _.value.length - 1, I = P.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), g.value = { row: x.value, col: 0 }, M.value = { row: x.value, col: 0 });
        return;
      }
      let { row: k, col: E } = g.value;
      const Y = (j, de, ve = !1) => {
        k = Math.max(0, Math.min(I, j)), E = Math.max(0, Math.min(b, de)), g.value = { row: k, col: E }, ve || (M.value = { row: k, col: E }), xe(k), _n(E);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), Y(k + 1, E, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), Y(k - 1, E, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? Y(k, E + 1, !0) : E < b ? Y(k, E + 1) : Y(k + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? Y(k, E - 1, !0) : E > 0 ? Y(k, E - 1) : Y(k - 1, b);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? E > 0 ? Y(k, E - 1) : Y(k - 1, b) : E < b ? Y(k, E + 1) : Y(k + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? Y(k - 1, E) : Y(k + 1, E);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(0, 0, o.shiftKey) : Y(k, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(I, b, o.shiftKey) : Y(k, b, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), Y(Math.min(I, k + H.value), E, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), Y(Math.max(0, k - H.value), E, o.shiftKey);
          break;
        case "Escape":
          g.value = null, M.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), Yn());
          break;
      }
    }
    function Yn() {
      var ve;
      if (!g.value) return;
      const o = _.value, s = P.value, b = M.value ?? g.value, I = Math.min(b.row, g.value.row), k = Math.max(b.row, g.value.row), E = Math.min(b.col, g.value.col), Y = Math.max(b.col, g.value.col), j = [];
      for (let it = I; it <= k; it++) {
        const mt = s[it];
        if (!mt) continue;
        const gt = [];
        for (let st = E; st <= Y; st++) {
          const pt = o[st];
          pt && gt.push($(pt, mt).replace(/[\t\r\n]+/g, " "));
        }
        j.push(gt.join("	"));
      }
      const de = j.join(`
`);
      (ve = navigator.clipboard) == null || ve.writeText(de).catch(() => {
      });
    }
    function Wn(o) {
      const s = o.target.value;
      y.value = s, s ? i[A.value] = s : delete i[A.value], l("filter-changed");
    }
    function an() {
      A.value && delete i[A.value], y.value = "", A.value = null, l("filter-changed");
    }
    const zn = {
      setGridOption(o, s) {
        o === "rowData" ? a.value = s : o === "pinnedBottomRowData" ? r.value = s : o === "quickFilterText" && (c.value = s);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var b, I;
          const s = C(o);
          return {
            colId: s,
            hide: u.has(s),
            sort: ((b = d.value) == null ? void 0 : b.colId) === s ? d.value.dir : null,
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
        for (const s of Object.keys(i)) delete i[s];
        if (o)
          for (const [s, b] of Object.entries(o))
            (b == null ? void 0 : b.type) === "equals" ? i[s] = `__eq__${b.filter}` : b != null && b.filter && (i[s] = b.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [s, b] of Object.entries(i))
          b && (o[s] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
        return o;
      },
      async setColumnFilterModel(o, s) {
        s ? s.type === "equals" ? i[o] = `__eq__${s.filter}` : i[o] = s.filter ?? "" : delete i[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const s = W.value, b = s.map((Y) => Y.colDef.headerName ?? Y.colId).join(","), I = P.value.map(
          (Y) => s.map((j) => `"${String($(j, Y)).replace(/"/g, '""')}"`).join(",")
        ), k = new Blob([[b, ...I].join(`
`)], { type: "text/csv" }), E = URL.createObjectURL(k);
        Object.assign(document.createElement("a"), { href: E, download: o }).click(), URL.revokeObjectURL(E);
      },
      resize() {
        at();
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
      [P, () => r.value, _, p, v, g],
      () => Ve(Me)
    ), X(() => e.theme, () => Me()), X(() => e.curvature, () => Ve(at)), X(() => e.scanlines, () => Me()), X(() => e.glow, () => Me()), X(() => e.magnify, (o) => {
      o || (U.x = ke.x, U.y = ke.y), Me();
    }), X(g, (o) => {
      if (!o) return;
      const s = P.value[o.row], b = _.value[o.col];
      s && b && l("cell-selected", { data: s, row: o.row, col: o.col, colId: b.colId });
    });
    let vt = null, ht = null, Bt = 0;
    function rt() {
      cancelAnimationFrame(Bt), Bt = requestAnimationFrame(at);
    }
    function rn(o) {
      o.preventDefault();
    }
    function sn() {
      ce == null || ce.dispose(), ce = null, w = !1, Ke();
    }
    Ze(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(C(o)), o.sort && !d.value && (d.value = { colId: C(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", on), document.addEventListener("mousemove", We), document.addEventListener("mouseup", ze), Ve(() => {
        var o;
        Ke(), oe.value && (oe.value.addEventListener("webglcontextlost", rn), oe.value.addEventListener("webglcontextrestored", sn)), Fe.value && (vt = new ResizeObserver(() => at()), vt.observe(Fe.value), ht = new IntersectionObserver((s) => {
          s.some((b) => b.isIntersecting) && rt();
        }), ht.observe(Fe.value)), window.addEventListener("resize", rt), (o = window.visualViewport) == null || o.addEventListener("resize", rt), l("grid-ready", { api: zn });
      });
    }), tt(() => {
      var o, s, b;
      document.removeEventListener("click", on, !0), document.removeEventListener("mousemove", We), document.removeEventListener("mouseup", ze), (o = oe.value) == null || o.removeEventListener("webglcontextlost", rn), (s = oe.value) == null || s.removeEventListener("webglcontextrestored", sn), vt == null || vt.disconnect(), ht == null || ht.disconnect(), window.removeEventListener("resize", rt), (b = window.visualViewport) == null || b.removeEventListener("resize", rt), cancelAnimationFrame(Bt), B();
    });
    const Ee = q(() => ut[e.theme] ?? ut.none), Pn = q(() => ({
      position: "absolute",
      left: `${L.value.x}px`,
      top: `${L.value.y}px`,
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
    })), Hn = q(() => ({
      background: Ee.value.bg,
      border: `1px solid ${Ee.value.border}`,
      color: Ee.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Vn = q(() => ({
      background: Ee.value.headerBg,
      borderTop: `1px solid ${Ee.value.border}`,
      color: Ee.value.text
    })), Nn = q(() => ({
      background: Ee.value.bg
    })), cn = q(() => Ee.value.accent);
    return (o, s) => {
      var b, I;
      return ye(), be("div", {
        ref_key: "wrapEl",
        ref: Fe,
        class: "cathode-wrap",
        style: _e(Nn.value)
      }, [
        se("canvas", {
          ref_key: "canvasEl",
          ref: oe,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ge(Rn, ["prevent"]),
          onMousemove: Dn,
          onMouseleave: En,
          onMousedown: An,
          onClick: Fn,
          onKeydown: Bn,
          onTouchstartPassive: dt,
          onTouchmove: Rt,
          onTouchend: $e,
          onTouchcancel: $e
        }, null, 544),
        A.value ? (ye(), be("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: _e(Pn.value),
          onClick: s[0] || (s[0] = Ge(() => {
          }, ["stop"]))
        }, [
          se("input", {
            style: _e(Hn.value),
            value: y.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Wn,
            onKeydown: $n(an, ["escape"])
          }, null, 44, il),
          y.value ? (ye(), be("button", {
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
            onClick: an
          }, "✕", 4)) : He("", !0)
        ], 4)) : He("", !0),
        t.pagination ? (ye(), be("div", {
          key: 1,
          class: "cathode-pagination",
          style: _e(Vn.value)
        }, [
          se("button", {
            disabled: p.value <= 0,
            onClick: s[1] || (s[1] = (k) => ue())
          }, "◀", 8, sl),
          se("span", null, Pe((x.value + 1).toLocaleString()) + "–" + Pe(Math.min(P.value.length, D.value + 1).toLocaleString()) + " / " + Pe(P.value.length.toLocaleString()), 1),
          se("button", {
            disabled: p.value >= Z.value,
            onClick: s[2] || (s[2] = (k) => Ie())
          }, "▶", 8, cl),
          se("span", {
            class: "cathode-page-info",
            style: _e({ color: cn.value })
          }, Pe(P.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (ye(), be("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: _e({ color: cn.value })
          }, Pe(((b = _.value[g.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((I = _.value[g.value.col]) == null ? void 0 : I.colId)) + " : " + Pe($(_.value[g.value.col], P.value[g.value.row])), 5)) : He("", !0)
        ], 4)) : He("", !0)
      ], 4);
    };
  }
}), nt = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, Mo = /* @__PURE__ */ nt(vl, [["__scopeId", "data-v-b2dcfacb"]]), Tt = {
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
function hl(t, n) {
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
const ml = 12, Se = 18, yt = 10, Qe = 6, Qt = `${ml}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function gl(t, n, e) {
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
function Cn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function pl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function wl(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, c = t.formatTs ?? Cn;
  e.font = Qt;
  const d = [];
  for (let i = 0; i < n.length; i++) {
    const f = n[i], u = f.level ?? "info", h = a && f.ts != null ? c(f.ts) : "", m = r ? gl(e, f.text, l) : f.text.split(`
`);
    for (let T = 0; T < m.length; T++)
      d.push({
        entryIdx: i,
        text: m[T],
        level: u,
        timestamp: T === 0 ? h : "",
        isFirstFrag: T === 0,
        widthPx: e.measureText(m[T]).width
      });
  }
  return d;
}
function hn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Tt[n.theme] ?? Tt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = Qt, e.textBaseline = "middle";
  const c = n.visualLines, d = yt - n.scrollX, i = (n.showTimestamps ? yt + n.timestampWidth : yt) - n.scrollX, f = Math.max(0, Math.floor((n.scrollY - Qe) / Se)), u = Math.min(c.length, Math.ceil((n.scrollY + a - Qe) / Se) + 1);
  for (let h = f; h < u; h++) {
    const m = c[h], T = Qe + h * Se - n.scrollY + Se / 2;
    if (m.entryIdx % 2 === 1 && m.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let S = 1;
      for (; h + S < u && c[h + S].entryIdx === m.entryIdx; ) S++;
      e.fillRect(0, T - Se / 2, l, Se * S);
    }
    n.selectionStart >= 0 && h >= n.selectionStart && h <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, T - Se / 2, l, Se)), h === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, T - Se / 2, l, Se)), n.showTimestamps && m.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(m.timestamp, d, T), e.shadowBlur = 0);
    const p = hl(r, m.level);
    e.fillStyle = p, e.textAlign = "left", n.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(m.text, i, T), e.shadowBlur = 7, e.fillText(m.text, i, T), e.shadowBlur = 3, e.fillText(m.text, i, T), e.shadowBlur = 0) : e.fillText(m.text, i, T);
  }
  e.restore();
}
function mn(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - Qe) / Se);
  return l < 0 || l >= e ? -1 : l;
}
function yl(t) {
  return Qe * 2 + t * Se;
}
const bl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, xl = /* @__PURE__ */ et({
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
    const e = t, l = z(null), a = z(null), r = { ...ke }, c = z(0), d = z(0), i = z(0), f = z(-1), u = z(!0), h = z(-1), m = z(-1), T = q(() => {
      const w = e.entries ?? [];
      return e.maxLines > 0 && w.length > e.maxLines ? w.slice(w.length - e.maxLines) : w;
    }), p = q(() => {
      if (!e.showTimestamps) return "";
      const w = e.formatTs ?? Cn;
      let B = "00:00:00";
      for (const J of T.value) {
        if (J.ts == null) continue;
        const Re = w(J.ts);
        Re.length > B.length && (B = Re);
      }
      return B;
    }), S = z(0), v = z([]);
    function g() {
      if (!N) return;
      const w = N.getContext("2d");
      if (!w) return;
      w.font = Qt;
      const B = e.showTimestamps ? pl(w, p.value) : 0;
      S.value = B;
      const J = Math.max(
        1,
        c.value - yt * 2 - B
      );
      v.value = wl({
        entries: T.value,
        ctx: w,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const M = q(() => yl(v.value.length)), A = q(() => Math.max(0, M.value - d.value)), U = q(() => {
      let w = 0;
      for (const B of v.value) B.widthPx > w && (w = B.widthPx);
      return yt * 2 + S.value + w;
    }), L = q(() => Math.max(0, U.value - c.value)), y = z(0);
    X(A, () => {
      u.value ? i.value = A.value : i.value = Math.min(i.value, A.value);
    }), X(L, () => {
      y.value = Math.min(y.value, L.value);
    }), X(
      [T, c, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        g(), Ve(Z);
      },
      { deep: !1 }
    );
    let C = null, W = !1;
    function _() {
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
    let ae, te, re, ne, N;
    const Q = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Kt}

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

  ${Gt}

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

    ${jt}

    gl_FragColor = color;
  }
`;
    function he() {
      if (!(!a.value || !l.value)) {
        N = document.createElement("canvas");
        try {
          C = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          W = !0;
        }
        if (!W && !C.getContext() && (C.dispose(), C = null, W = !0), W) {
          ee();
          return;
        }
        C.setPixelRatio(1), C.setClearColor(0, 0), ae = new O.Scene(), te = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), ne = new O.CanvasTexture(N), ne.minFilter = O.LinearFilter, ne.magFilter = O.LinearFilter, re = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: ne },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...qt()
          },
          vertexShader: bl,
          fragmentShader: Q,
          transparent: !0
        }), ae.add(new O.Mesh(new O.PlaneGeometry(2, 2), re)), ee();
      }
    }
    function ee() {
      if (!l.value || !C && !W) return;
      const w = l.value.clientWidth, B = l.value.clientHeight;
      if (!w || !B) return;
      const J = N.width !== w || N.height !== B;
      J && (N.width = w, N.height = B, c.value = w, d.value = B, g(), C ? (J && ne && (ne.dispose(), ne = new O.CanvasTexture(N), ne.minFilter = O.LinearFilter, ne.magFilter = O.LinearFilter, re && (re.uniforms.uTex.value = ne)), C.setPixelRatio(window.devicePixelRatio || 1), C.setSize(w, B)) : a.value && (a.value.width = w, a.value.height = B, a.value.style.width = w + "px", a.value.style.height = B + "px"), u.value && (i.value = Math.max(0, M.value - d.value)), Z());
    }
    function Z() {
      if (!(N != null && N.width)) return;
      if (W) {
        if (!a.value) return;
        hn(N, {
          visualLines: v.value,
          scrollY: i.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: S.value,
          hoveredLine: f.value,
          selectionStart: Math.min(h.value, m.value),
          selectionEnd: Math.max(h.value, m.value)
        });
        const B = a.value.getContext("2d");
        B && B.drawImage(N, 0, 0);
        return;
      }
      if (!C || !re || !ne) return;
      const w = e.theme === "paper";
      re.uniforms.uStrength.value = bt(e.curvature), re.uniforms.uScanlines.value = e.scanlines && !w ? 1 : 0, re.uniforms.uVignette.value = w ? 0 : 1, Zt(re, e.magnify, r, N.width, N.height), hn(N, {
        visualLines: v.value,
        scrollY: i.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: S.value,
        hoveredLine: f.value,
        selectionStart: Math.min(h.value, m.value),
        selectionEnd: Math.max(h.value, m.value)
      }), ne.needsUpdate = !0, C.render(ae, te);
    }
    X(() => e.theme, () => Z()), X(() => e.curvature, () => Z()), X(() => e.scanlines, () => Z()), X(() => e.glow, () => Z()), X(() => e.magnify, (w) => {
      w || (r.x = ke.x, r.y = ke.y), Z();
    }), X(i, () => Z()), X(y, () => Z()), X(f, () => Z()), X([h, m], () => Z());
    function H(w) {
      if (!a.value) return [-1, -1];
      const B = a.value.getBoundingClientRect();
      return [w.clientX - B.left, w.clientY - B.top];
    }
    function x(w) {
      i.value = Math.max(0, Math.min(A.value, w)), u.value = i.value >= A.value - 4;
    }
    function D(w) {
      y.value = Math.max(0, Math.min(L.value, w));
    }
    function F(w) {
      w.shiftKey ? D(y.value + w.deltaY) : Math.abs(w.deltaX) > Math.abs(w.deltaY) ? D(y.value + w.deltaX) : x(i.value + w.deltaY);
    }
    let $ = !1, K = 0, P = 0, G = 0, xe = 0, ue = !1;
    function Ie(w) {
      $ = !0, ue = !1, K = w.clientX, P = w.clientY, G = y.value, xe = i.value, l.value && l.value.focus();
    }
    function Ce(w) {
      if ($) {
        const B = K - w.clientX, J = P - w.clientY;
        (Math.abs(B) > 4 || Math.abs(J) > 4) && (ue = !0), D(G + B), x(xe + J);
      }
    }
    function Le() {
      $ && ($ = !1, ue && (ue = !1));
    }
    function R(w) {
      if (w.touches.length !== 1) return;
      const B = w.touches[0];
      $ = !0, ue = !1, K = B.clientX, P = B.clientY, G = y.value, xe = i.value, l.value && l.value.focus();
    }
    function V(w) {
      if (!$ || w.touches.length !== 1) return;
      w.preventDefault();
      const B = w.touches[0], J = K - B.clientX, Re = P - B.clientY;
      (Math.abs(J) > 4 || Math.abs(Re) > 4) && (ue = !0), D(G + J), x(xe + Re);
    }
    function le() {
      $ && ($ = !1, ue && (ue = !1));
    }
    function me(w) {
      const [, B] = H(w);
      return B < 0 ? -1 : mn(B, i.value, v.value.length);
    }
    function pe(w) {
      if (ue) {
        ue = !1;
        return;
      }
      const B = me(w);
      if (B < 0) {
        h.value = -1, m.value = -1;
        return;
      }
      w.shiftKey && h.value >= 0 || (h.value = B), m.value = B;
    }
    function Ae(w, B) {
      const J = v.value.length;
      if (J === 0) return;
      const Re = m.value < 0 ? 0 : m.value;
      let we = Math.max(0, Math.min(J - 1, Re + w));
      m.value = we, (!B || h.value < 0) && (h.value = we), f.value = we;
      const fe = Qe + we * Se, ie = fe + Se;
      fe < i.value ? x(fe) : ie > i.value + d.value && x(ie - d.value);
    }
    function Xe() {
      const w = Math.min(h.value, m.value), B = Math.max(h.value, m.value);
      if (w < 0) return "";
      const J = v.value, Re = /* @__PURE__ */ new Set(), we = [];
      for (let fe = w; fe <= B && fe < J.length; fe++) {
        const ie = J[fe];
        if (Re.has(ie.entryIdx)) continue;
        Re.add(ie.entryIdx);
        let ot = "";
        for (let Ke = 0; Ke < J.length; Ke++)
          J[Ke].entryIdx === ie.entryIdx && (ot += (ot && !J[Ke].isFirstFrag ? " " : "") + J[Ke].text);
        we.push(ie.timestamp ? `${ie.timestamp}  ${ot}` : ot);
      }
      return we.join(`
`);
    }
    async function Ue() {
      const w = Xe();
      if (w)
        try {
          await navigator.clipboard.writeText(w);
        } catch {
          const B = document.createElement("textarea");
          B.value = w, B.style.position = "fixed", B.style.opacity = "0", document.body.appendChild(B), B.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(B);
        }
    }
    function Ne(w) {
      if ((w.metaKey || w.ctrlKey) && (w.key === "c" || w.key === "C")) {
        h.value >= 0 && (w.preventDefault(), Ue());
        return;
      }
      if ((w.metaKey || w.ctrlKey) && (w.key === "a" || w.key === "A")) {
        w.preventDefault(), h.value = 0, m.value = v.value.length - 1;
        return;
      }
      switch (w.key) {
        case "ArrowDown":
          w.preventDefault(), Ae(1, w.shiftKey);
          break;
        case "ArrowUp":
          w.preventDefault(), Ae(-1, w.shiftKey);
          break;
        case "ArrowRight":
          w.preventDefault(), D(y.value + Se * 2);
          break;
        case "ArrowLeft":
          w.preventDefault(), D(y.value - Se * 2);
          break;
        case "PageDown":
          w.preventDefault(), x(i.value + d.value);
          break;
        case "PageUp":
          w.preventDefault(), x(i.value - d.value);
          break;
        case "Home":
          w.preventDefault(), x(0), D(0);
          break;
        case "End":
          w.preventDefault(), x(A.value);
          break;
        case "Escape":
          h.value = -1, m.value = -1;
          break;
      }
    }
    function De(w) {
      if (e.magnify && a.value) {
        const J = Jt(w, a.value);
        r.x = J.x, r.y = J.y, Z();
      }
      const [, B] = H(w);
      if (B < 0) {
        f.value = -1;
        return;
      }
      f.value = mn(B, i.value, v.value.length);
    }
    function ft() {
      f.value = -1, r.x = ke.x, r.y = ke.y, Z();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, i.value = A.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(w) {
        x(Qe + w * Se);
      }
    });
    let We = null, ze = null, dt = 0;
    const Rt = Lt("cathodeResetTick", z(0));
    X(Rt, () => $e());
    function $e() {
      cancelAnimationFrame(dt), dt = requestAnimationFrame(ee);
    }
    function Fe(w) {
      w.preventDefault();
    }
    function oe() {
      C == null || C.dispose(), C = null, W = !1, he();
    }
    Ze(() => {
      document.addEventListener("mousemove", Ce), document.addEventListener("mouseup", Le), Ve(() => {
        var w;
        he(), a.value && (a.value.addEventListener("webglcontextlost", Fe), a.value.addEventListener("webglcontextrestored", oe)), l.value && (We = new ResizeObserver(() => ee()), We.observe(l.value), ze = new IntersectionObserver((B) => {
          B.some((J) => J.isIntersecting) && $e();
        }), ze.observe(l.value)), window.addEventListener("resize", $e), (w = window.visualViewport) == null || w.addEventListener("resize", $e), i.value = A.value;
      });
    }), tt(() => {
      var w, B, J;
      document.removeEventListener("mousemove", Ce), document.removeEventListener("mouseup", Le), (w = a.value) == null || w.removeEventListener("webglcontextlost", Fe), (B = a.value) == null || B.removeEventListener("webglcontextrestored", oe), We == null || We.disconnect(), ze == null || ze.disconnect(), window.removeEventListener("resize", $e), (J = window.visualViewport) == null || J.removeEventListener("resize", $e), cancelAnimationFrame(dt), _();
    });
    const Dt = q(() => Tt[e.theme] ?? Tt.none), ce = q(() => ({
      background: Dt.value.bg
    }));
    return (w, B) => (ye(), be("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: _e(ce.value),
      tabindex: "0",
      onKeydown: Ne
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Ge(F, ["prevent"]),
        onMousemove: De,
        onMouseleave: ft,
        onMousedown: Ie,
        onClick: pe,
        onTouchstartPassive: R,
        onTouchmove: V,
        onTouchend: le,
        onTouchcancel: le
      }, null, 544)
    ], 36));
  }
}), Ml = /* @__PURE__ */ nt(xl, [["__scopeId", "data-v-d6dc9e79"]]), Sl = ["disabled"], Tl = /* @__PURE__ */ et({
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
    function h(L) {
      L.trim() && (i.value.length && i.value[i.value.length - 1] === L || (i.value.push(L), i.value.length > l.historyLimit && i.value.splice(0, i.value.length - l.historyLimit)));
    }
    function m(L) {
      if (!l.disabled) {
        if (L.key === "Enter") {
          L.preventDefault();
          const y = d.value;
          y.trim() && h(y), f.value = -1, d.value = "", a("submit", y);
          return;
        }
        if (L.key === "ArrowUp") {
          if (!i.value.length) return;
          L.preventDefault(), f.value === -1 ? (u = d.value, f.value = i.value.length - 1) : f.value > 0 && f.value--, d.value = i.value[f.value];
          return;
        }
        if (L.key === "ArrowDown") {
          if (f.value === -1) return;
          L.preventDefault(), f.value < i.value.length - 1 ? (f.value++, d.value = i.value[f.value]) : (f.value = -1, d.value = u, u = "");
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
      let L;
      return l.disabled ? L = " " : l.busy ? L = "█" : L = T.value ? "█" : " ", { level: "info", text: `${l.prompt}${d.value}${L}` };
    }), M = q(
      () => [...l.entries, g.value]
    );
    function A() {
      var L;
      l.disabled || (L = c.value) == null || L.focus();
    }
    X(() => l.busy, (L, y) => {
      y && !L && !l.disabled && Ve(() => {
        var C;
        return (C = c.value) == null ? void 0 : C.focus();
      });
    });
    function U() {
      var L;
      (L = c.value) == null || L.focus();
    }
    return n({ focus: U }), Ze(() => {
      S(), l.disabled || requestAnimationFrame(() => {
        var L;
        return (L = c.value) == null ? void 0 : L.focus();
      });
    }), tt(() => {
      v();
    }), (L, y) => (ye(), be("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: A
    }, [
      yn(Ml, {
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
      bn(se("input", {
        ref_key: "inputEl",
        ref: c,
        "onUpdate:modelValue": y[0] || (y[0] = (C) => d.value = C),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: m
      }, null, 40, Sl), [
        [On, d.value]
      ])
    ], 512));
  }
}), So = /* @__PURE__ */ nt(Tl, [["__scopeId", "data-v-a2b39934"]]), Ct = {
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
}, Cl = 0.18, wt = 8, en = 22, kl = 4, Ye = 8, qe = 56, tn = 42, Oe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Il = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Pt = 4, Ll = 1, Rl = 1;
function Dl(t, n, e, l = 0, a = !1) {
  const r = a ? tn : qe, c = Math.max(0, n - Ye - r), d = Math.max(1, Math.floor(c / e)), i = Math.min(d, t);
  return { firstIdx: Math.max(0, t - i - Math.floor(l / e)), count: i, slotW: e };
}
function El(t, n, e) {
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
function Al(t, n, e = !1) {
  const l = e ? kl : en, a = Math.max(1, t - wt - l - Pt), r = Math.max(0, Math.round(a * n)), c = a - r;
  return {
    priceY0: wt,
    priceY1: wt + c,
    volumeY0: wt + c + Pt,
    volumeY1: wt + c + Pt + r
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
function nn(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${r}`;
}
function Fl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * l;
}
function gn(t, n) {
  var T, p, S, v, g;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ct[n.theme] ?? Ct.none, c = n.colors ? { ...r, ...n.colors } : r, d = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = c.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const i = Dl(n.candles.length, l, n.slotW, n.scrollX, d), f = El(n.candles, i.firstIdx, i.count), u = Al(a, n.showVolume ? n.volumeFraction : 0, d), h = Math.max(Ll, Math.floor(n.slotW * 0.7)), m = Math.min(n.candles.length, i.firstIdx + i.count);
  for (let M = i.firstIdx; M < m; M++) {
    const A = n.candles[M];
    if (!A) continue;
    const U = Je(M, i.firstIdx, n.slotW), L = Be(A.open, f, u.priceY0, u.priceY1), y = Be(A.close, f, u.priceY0, u.priceY1), C = Be(A.high, f, u.priceY0, u.priceY1), W = Be(A.low, f, u.priceY0, u.priceY1), _ = A.close >= A.open, ae = _ ? c.wickBull : c.wickBear, te = _ ? c.candleBull : c.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = te), e.strokeStyle = ae, e.lineWidth = Rl, e.beginPath(), e.moveTo(Math.round(U) + 0.5, C), e.lineTo(Math.round(U) + 0.5, W), e.stroke(), e.fillStyle = te;
    const re = Math.min(L, y), ne = Math.max(1, Math.abs(y - L)), N = Math.round(U - h / 2), Q = Math.round(re), he = Math.round(ne);
    if (e.fillRect(N, Q, h, he), n.glow && (e.shadowBlur = 4, e.fillRect(N, Q, h, he)), e.shadowBlur = 0, n.showVolume && f.maxVol > 0) {
      const ee = Math.round(A.volume / f.maxVol * (u.volumeY1 - u.volumeY0));
      ee > 0 && (e.fillStyle = _ ? c.volumeBull : c.volumeBear, e.fillRect(
        Math.round(U - h / 2),
        u.volumeY1 - ee,
        h,
        ee
      ));
    }
  }
  if ((T = n.overlays) != null && T.length) {
    const M = { above: 0, below: 0 }, A = n.overlays.filter((L) => L.kind !== "hline" && !!L.label).length, U = A ? 14 + 14 * A + 12 : 8;
    for (const L of n.overlays)
      L.kind === "hline" ? Bl(e, L, l, f, u, c, d, M, U) : _l(e, L, i, f, u, n.slotW);
  }
  (p = n.markers) != null && p.length && $l(e, c, n.markers, n.candles, i, f, u, n.slotW), Ol(e, c, f, u, l, d), d || (Xl(e, c, n.candles, i, n.slotW, a), Vl(e, c, n.candles, l, a)), (S = n.overlays) != null && S.length && Wl(e, c, n.overlays, u), n.hover && (Ul(e, c, n.candles, i, f, u, n.slotW, n.hover, l), zl(e, c, n.candles, i, n.slotW, n.hover, u, ((v = n.overlays) == null ? void 0 : v.length) ?? 0), (g = n.markers) != null && g.length && Hl(e, c, n.markers, n.candles, i, f, u, n.slotW, n.hover, l)), e.restore();
}
function _l(t, n, e, l, a, r) {
  var d;
  const c = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    xt(t, n.data, e.firstIdx, c, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const i = kn(n.color, n.fillAlpha ?? 0.08);
    Yl(t, n.upper, n.lower, e.firstIdx, c, r, l, a, i), xt(t, n.upper, e.firstIdx, c, r, l, a, n.color, 1, !1), xt(t, n.lower, e.firstIdx, c, r, l, a, n.color, 1, !1), (d = n.middle) != null && d.length && xt(t, n.middle, e.firstIdx, c, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function Bl(t, n, e, l, a, r, c, d = { above: 0, below: 0 }, i = 8) {
  const f = Be(n.price, l, a.priceY0, a.priceY1), u = f < a.priceY0 - 0.5, h = f > a.priceY1 + 0.5, m = u || h, T = m ? u ? d.above++ : d.below++ : 0, p = m ? u ? a.priceY0 + i + T * 20 : a.priceY1 - 8 - T * 20 : f, S = c ? tn : qe, v = Math.round(p) + 0.5;
  t.save(), m || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, v), t.lineTo(e - S, v), t.stroke(), t.setLineDash([]));
  let g = n.label ?? je(n.price);
  if (m && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    t.font = Oe, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(g).width, A = 4, U = 2, L = Ye + 2;
    t.fillStyle = n.color, m && (t.globalAlpha = 0.85), t.fillRect(L, p - 7 - U, M + A * 2, 14 + U * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(g, L + A, p);
  }
  t.restore();
}
function xt(t, n, e, l, a, r, c, d, i, f) {
  if (!n || !n.length) return;
  t.strokeStyle = d, t.lineWidth = i, t.setLineDash(f ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < l; h++) {
    const m = n[h];
    if (typeof m != "number" || !isFinite(m)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const T = Je(h, e, a), p = Be(m, r, c.priceY0, c.priceY1);
    u ? t.lineTo(T, p) : (t.moveTo(T, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function Yl(t, n, e, l, a, r, c, d, i) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = i;
  let f = !1, u = -1;
  for (let h = l; h <= a; h++) {
    const m = n[h], T = e[h], p = h < a && typeof m == "number" && typeof T == "number" && isFinite(m) && isFinite(T);
    if (p && !f && (u = h, f = !0), !p && f || h === a && f) {
      const S = p ? h + 1 : h;
      t.beginPath();
      for (let v = u; v < S; v++) {
        const g = Je(v, l, r), M = Be(n[v], c, d.priceY0, d.priceY1);
        v === u ? t.moveTo(g, M) : t.lineTo(g, M);
      }
      for (let v = S - 1; v >= u; v--) {
        const g = Je(v, l, r), M = Be(e[v], c, d.priceY0, d.priceY1);
        t.lineTo(g, M);
      }
      t.closePath(), t.fill(), f = !1;
    }
  }
}
function kn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Wl(t, n, e, l) {
  const a = e.filter((S) => S.kind !== "hline" && !!S.label);
  if (!a.length) return;
  t.save(), t.font = Oe;
  const r = 8, c = 5, d = 12, i = 6, f = 14;
  let u = 0;
  for (const S of a) {
    const v = t.measureText(S.label).width;
    v > u && (u = v);
  }
  const h = r * 2 + d + i + u, m = c * 2 + f * a.length, T = Ye + 4, p = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(T, p, h, m), t.textBaseline = "middle", t.textAlign = "left";
  for (let S = 0; S < a.length; S++) {
    const v = a[S], g = p + c + f * (S + 0.5), M = T + r;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(M, g), t.lineTo(M + d, g), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = kn(v.color, v.fillAlpha ?? 0.2), t.fillRect(M, g - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(M + 0.5, g - 4 + 0.5, d - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, M + d + i, g);
  }
  t.restore();
}
function zl(t, n, e, l, a, r, c, d) {
  const i = Math.floor((r.x - Ye) / a), f = l.firstIdx + i;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const h = u.close - u.open, m = u.open !== 0 ? h / u.open * 100 : 0, T = h >= 0 ? "+" : "", p = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", Pl(u.volume), void 0],
    ["", `${T}${m.toFixed(2)}%`, h >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Oe, t.textBaseline = "middle", t.textAlign = "left";
  const S = 8, v = 4, g = 14;
  let M = S;
  for (const [y, C] of p) {
    const W = y ? `${y} ${C}` : C, _ = t.measureText(W).width + 12;
    M += _;
  }
  M += S - 12;
  const A = c.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), U = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(U, A, M, g + v * 2);
  let L = U + S;
  for (let y = 0; y < p.length; y++) {
    const [C, W, _] = p[y];
    t.fillStyle = n.text, C && (t.globalAlpha = 0.6, t.fillText(C + " ", L, A + v + g / 2), t.globalAlpha = 1, L += t.measureText(C + " ").width), _ && (t.fillStyle = _), t.fillText(W, L, A + v + g / 2), L += t.measureText(W).width + 12;
  }
  t.restore();
}
function Pl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Hl(t, n, e, l, a, r, c, d, i, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, h = Math.max(1, u * 0.5), m = Math.min(l.length, a.firstIdx + a.count), T = 9;
  let p = null;
  for (const W of e) {
    let _ = 0, ae = l.length - 1, te = -1;
    for (; _ <= ae; ) {
      const N = _ + ae >> 1, Q = l[N].start - W.timestamp;
      if (Math.abs(Q) <= h) {
        te = N;
        break;
      }
      Q < 0 ? _ = N + 1 : ae = N - 1;
    }
    if (te < 0 || te < a.firstIdx || te >= m) continue;
    const re = Je(te, a.firstIdx, d), ne = Be(W.price, r, c.priceY0, c.priceY1);
    if (Math.abs(i.x - re) <= T && Math.abs(i.y - ne) <= T) {
      p = { m: W, x: re, y: ne };
      break;
    }
  }
  if (!p) return;
  const S = nn(p.m.timestamp), v = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${S}`,
    `@ ${je(p.m.price)}`
  ];
  p.m.label && v.push(p.m.label), t.save(), t.font = Oe, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, M = 14;
  let A = 0;
  for (const W of v) {
    const _ = t.measureText(W).width;
    _ > A && (A = _);
  }
  const U = A + g * 2, L = v.length * M + g * 2;
  let y = p.x + 12;
  y + U > f - qe && (y = p.x - 12 - U);
  let C = p.y - L / 2;
  C < c.priceY0 && (C = c.priceY0), C + L > c.priceY1 && (C = c.priceY1 - L), t.fillStyle = n.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(y, C, U, L), t.strokeRect(y + 0.5, C + 0.5, U - 1, L - 1);
  for (let W = 0; W < v.length; W++) {
    const _ = v[W];
    t.fillStyle = W === 0 ? p.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(_, y + g, C + g + W * M);
  }
  t.restore();
}
function Vl(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, c = Nl(r);
  if (!c) return;
  t.save(), t.font = Oe, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, i = 3, f = t.measureText(c).width, u = l - qe - d, h = a - en + 4;
  t.fillStyle = n.accent, t.fillRect(u - f - d, h - i, f + d * 2, 14 + i * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(c, u, h), t.restore();
}
function Nl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function $l(t, n, e, l, a, r, c, d) {
  if (!l.length) return;
  const i = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, i * 0.5), u = Math.min(l.length, a.firstIdx + a.count), h = (T) => {
    let p = 0, S = l.length - 1;
    for (; p <= S; ) {
      const v = p + S >> 1, g = l[v].start - T;
      if (Math.abs(g) <= f) return v;
      g < 0 ? p = v + 1 : S = v - 1;
    }
    return -1;
  }, m = 7;
  for (const T of e) {
    const p = h(T.timestamp);
    if (p < 0 || p < a.firstIdx || p >= u) continue;
    const S = Je(p, a.firstIdx, d), v = Be(T.price, r, c.priceY0, c.priceY1);
    if (v < c.priceY0 || v > c.priceY1) continue;
    const g = T.color ?? (T.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), T.kind === "entry" ? (t.moveTo(S, v - m), t.lineTo(S - m, v + m - 1), t.lineTo(S + m, v + m - 1)) : (t.moveTo(S, v + m), t.lineTo(S - m, v - m + 1), t.lineTo(S + m, v - m + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Ol(t, n, e, l, a, r = !1) {
  const c = e.max - e.min;
  if (c <= 0) return;
  const d = l.priceY1 - l.priceY0, i = r ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, f = Fl(c, i), u = Math.ceil(e.min / f) * f, h = r ? tn : qe;
  t.font = r ? Il : Oe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let m = u; m <= e.max; m += f) {
    const T = Be(m, e, l.priceY0, l.priceY1);
    T < l.priceY0 || T > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(T) + 0.5), t.lineTo(a - h, Math.round(T) + 0.5), t.stroke(), t.fillText(je(m), a - h + 3, T));
  }
  t.globalAlpha = 1;
}
function Xl(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(l.count / 6));
  t.font = Oe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const i = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < i; f += d) {
    const u = e[f];
    if (!u) continue;
    const h = Je(f, l.firstIdx, a);
    t.fillText(nn(u.start), h, r - en + 4);
  }
  t.globalAlpha = 1;
}
function Ul(t, n, e, l, a, r, c, d, i) {
  const f = Math.floor((d.x - Ye) / c), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), h = e[u];
  if (!h) return;
  const m = Je(u, l.firstIdx, c);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(m) + 0.5, r.priceY0), t.lineTo(Math.round(m) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const T = Math.max(r.priceY0, Math.min(r.priceY1, d.y));
  t.beginPath(), t.moveTo(Ye, Math.round(T) + 0.5), t.lineTo(i - qe, Math.round(T) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = a.max - a.min;
  if (p > 0) {
    const g = a.max - (T - r.priceY0) / (r.priceY1 - r.priceY0) * p, M = je(g);
    t.font = Oe, t.textBaseline = "middle", t.textAlign = "left";
    const A = t.measureText(M).width, U = 4, L = 2;
    t.fillStyle = n.accent, t.fillRect(i - qe + 2, T - 7 - L, A + U * 2, 14 + L * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(M, i - qe + 2 + U, T);
  }
  t.font = Oe, t.textBaseline = "top", t.textAlign = "center";
  const S = nn(h.start), v = t.measureText(S).width;
  t.fillStyle = n.accent, t.fillRect(m - v / 2 - 4, r.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(S, m, r.volumeY1 + 4), t.restore();
}
const Ht = 0.25, Vt = 6, Kl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Gl = /* @__PURE__ */ et({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Cl },
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
    let h = null, m = !1;
    function T() {
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
    const A = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Kt}

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

  ${Gt}

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

    ${jt}

    gl_FragColor = color;
  }
`;
    function U() {
      if (!(!l.value || !e.value)) {
        if (M = document.createElement("canvas"), n.flat) {
          m = !0, L();
          return;
        }
        try {
          h = new O.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !h.getContext() && (h.dispose(), h = null, m = !0), m) {
          L();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), p = new O.Scene(), S = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new O.CanvasTexture(M), g.minFilter = O.LinearFilter, g.magFilter = O.LinearFilter, v = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...qt()
          },
          vertexShader: Kl,
          fragmentShader: A,
          transparent: !0
        }), p.add(new O.Mesh(new O.PlaneGeometry(2, 2), v)), L();
      }
    }
    function L() {
      if (!e.value || !h && !m) return;
      const R = e.value.clientWidth, V = e.value.clientHeight;
      !R || !V || !(M.width !== R || M.height !== V) || (M.width = R, M.height = V, r.value = R, c.value = V, h ? (g && (g.dispose(), g = new O.CanvasTexture(M), g.minFilter = O.LinearFilter, g.magFilter = O.LinearFilter, v && (v.uniforms.uTex.value = g)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(R, V)) : l.value && (l.value.width = R, l.value.height = V, l.value.style.width = R + "px", l.value.style.height = V + "px"), y());
    }
    function y() {
      if (!(M != null && M.width)) return;
      if (m) {
        if (!l.value) return;
        gn(M, {
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
      if (!h || !v || !g) return;
      const R = n.theme === "paper";
      v.uniforms.uStrength.value = bt(n.curvature), v.uniforms.uScanlines.value = n.scanlines && !R ? 1 : 0, v.uniforms.uVignette.value = R ? 0 : 1, Zt(v, n.magnify, a, M.width, M.height), gn(M, {
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
    X(() => n.theme, () => y()), X(() => n.curvature, () => y()), X(() => n.scanlines, () => y()), X(() => n.glow, () => y()), X(() => n.showVolume, () => y()), X(() => n.volumeFraction, () => y()), X(() => n.slotW, () => y()), X(() => n.candles, () => y(), { deep: !1 }), X(() => n.overlays, () => y(), { deep: !1 }), X(() => n.markers, () => y(), { deep: !1 }), X(() => n.compact, () => y()), X(() => n.magnify, (R) => {
      R || (a.x = ke.x, a.y = ke.y), y();
    }), X(() => n.colors, () => y(), { deep: !0 }), X(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), X(d, () => y()), X(i, () => y()), X(f, () => y()), X(u, () => y());
    let C = null, W = null, _ = 0;
    const ae = Lt("cathodeResetTick", z(0));
    X(ae, () => te());
    function te() {
      cancelAnimationFrame(_), _ = requestAnimationFrame(L);
    }
    function re(R) {
      R.preventDefault();
    }
    function ne() {
      h == null || h.dispose(), h = null, m = !1, U();
    }
    function N(R) {
      if (!l.value) return [-1, -1];
      const V = l.value.getBoundingClientRect();
      return [R.clientX - V.left, R.clientY - V.top];
    }
    function Q(R) {
      var Ae;
      const V = u.value;
      if (V <= 0) return 0;
      const le = ((Ae = n.candles) == null ? void 0 : Ae.length) ?? 0, me = Math.max(1, Math.floor((r.value || 1) / V)), pe = Math.max(0, le - me);
      return Math.max(0, Math.min(R, pe * V));
    }
    function he(R) {
      var me;
      if (R.deltaX !== 0 || R.shiftKey && R.deltaY !== 0) {
        const pe = R.deltaX !== 0 ? R.deltaX : R.deltaY;
        d.value = Q(d.value + pe);
        return;
      }
      if (R.deltaY === 0) return;
      const [V] = N(R), le = u.value;
      if (V >= 0 && le > 0 && ((me = n.candles) != null && me.length)) {
        const pe = Math.max(1, Math.floor((r.value || 1) / le)), Xe = Math.max(0, n.candles.length - pe - Math.floor(d.value / le)) + (V - 8) / le, Ue = Math.exp(-R.deltaY * 15e-4), Ne = Math.max(Ht, Math.min(Vt, i.value * Ue));
        i.value = Ne;
        const De = n.slotW * Ne, ft = Math.max(1, Math.floor((r.value || 1) / De)), We = Xe - (V - 8) / De, ze = Math.max(0, n.candles.length - ft - We);
        d.value = Q(ze * De);
      } else {
        const pe = Math.exp(-R.deltaY * 15e-4);
        i.value = Math.max(Ht, Math.min(Vt, i.value * pe));
      }
    }
    let ee = !1, Z = 0, H = 0;
    function x(R) {
      R.button === 0 && (ee = !0, Z = R.clientX, H = d.value, f.value = null, e.value && e.value.focus());
    }
    function D(R) {
      const V = Math.exp(R * 0.18);
      i.value = Math.max(Ht, Math.min(Vt, i.value * V)), d.value = Q(d.value);
    }
    function F(R) {
      const V = u.value, le = R.shiftKey ? 20 : 3;
      switch (R.key) {
        case "ArrowLeft":
          R.preventDefault(), d.value = Q(d.value + V * le);
          break;
        case "ArrowRight":
          R.preventDefault(), d.value = Q(d.value - V * le);
          break;
        case "ArrowUp":
          R.preventDefault(), D(1);
          break;
        case "ArrowDown":
          R.preventDefault(), D(-1);
          break;
        case "Home":
          R.preventDefault(), d.value = Q(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          R.preventDefault(), d.value = 0;
          break;
      }
    }
    function $(R) {
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
      const le = R.touches[0].clientX - Z;
      d.value = Q(H + le);
    }
    function xe() {
      ee = !1;
    }
    function ue(R) {
      if (n.magnify && l.value) {
        const me = Jt(R, l.value);
        a.x = me.x, a.y = me.y, y();
      }
      if (ee) return;
      const [V, le] = N(R);
      if (V < 0 || le < 0) {
        f.value = null;
        return;
      }
      f.value = { x: V, y: le };
    }
    function Ie() {
      f.value = null, a.x = ke.x, a.y = ke.y, y();
    }
    Ze(() => {
      document.addEventListener("mousemove", $), document.addEventListener("mouseup", K), Ve(() => {
        var R;
        U(), l.value && (l.value.addEventListener("webglcontextlost", re), l.value.addEventListener("webglcontextrestored", ne)), e.value && (C = new ResizeObserver(() => L()), C.observe(e.value), W = new IntersectionObserver((V) => {
          V.some((le) => le.isIntersecting) && te();
        }), W.observe(e.value)), window.addEventListener("resize", te), (R = window.visualViewport) == null || R.addEventListener("resize", te);
      });
    }), tt(() => {
      var R, V, le;
      document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", K), (R = l.value) == null || R.removeEventListener("webglcontextlost", re), (V = l.value) == null || V.removeEventListener("webglcontextrestored", ne), C == null || C.disconnect(), W == null || W.disconnect(), window.removeEventListener("resize", te), (le = window.visualViewport) == null || le.removeEventListener("resize", te), cancelAnimationFrame(_), T();
    });
    const Ce = q(() => Ct[n.theme] ?? Ct.none), Le = q(() => ({
      background: Ce.value.bg
    }));
    return (R, V) => (ye(), be("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: _e(Le.value),
      tabindex: "0",
      onKeydown: F
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: Ge(he, ["prevent"]),
        onMousedown: x,
        onMousemove: ue,
        onMouseleave: Ie,
        onTouchstartPassive: P,
        onTouchmove: G,
        onTouchend: xe,
        onTouchcancel: xe
      }, null, 544)
    ], 36));
  }
}), To = /* @__PURE__ */ nt(Gl, [["__scopeId", "data-v-7c334778"]]), ln = z(0), Ot = 28, ct = 12;
let Xt = 10, kt = "cathode.layout", It = !1;
const Te = z({});
function jl(t, n = "cathode.layout") {
  if (!It) {
    It = !0, kt = n;
    try {
      const e = localStorage.getItem(kt);
      if (e) {
        Te.value = JSON.parse(e), pn();
        return;
      }
    } catch {
    }
    Te.value = { ...t }, pn();
  }
}
function pn() {
  let t = 10;
  for (const n of Object.values(Te.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  Xt = t;
}
function lt() {
  localStorage.setItem(kt, JSON.stringify(Te.value));
}
function ql(t) {
  It = !1, localStorage.removeItem(kt), Te.value = { ...t }, lt(), It = !0, ln.value++;
}
function In(t) {
  Xt++, Te.value[t] && (Te.value[t].zIndex = Xt);
}
function Zl(t, n) {
  Te.value[t].visible = n, lt();
}
function Jl(t, n) {
  Te.value[t].minimized = n, n && (Te.value[t].maximized = !1), lt();
}
function Ql(t, n) {
  Te.value[t].maximized = n, n && (Te.value[t].minimized = !1, In(t)), lt();
}
function eo(t, n, e) {
  Te.value[t].x = Math.round(n), Te.value[t].y = Math.round(e), lt();
}
function to(t, n, e) {
  Te.value[t].w = Math.round(n), Te.value[t].h = Math.round(e), lt();
}
function Co(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - ct * (l + 1)) / l), c = Math.floor((n - ct * (a + 1)) / a), d = {};
  return e.forEach((i, f) => {
    const u = f % l, h = Math.floor(f / l);
    d[i] = {
      x: ct + u * (r + ct),
      y: ct + h * (c + ct),
      w: r,
      h: c,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: f + 1
    };
  }), d;
}
function Ln() {
  return {
    containers: Te,
    TITLEBAR_H: Ot,
    load: jl,
    save: lt,
    reset: ql,
    bringToFront: In,
    setVisible: Zl,
    setMinimized: Jl,
    setMaximized: Ql,
    updatePos: eo,
    updateSize: to
  };
}
const no = { class: "ws-toolbar" }, lo = {
  key: 0,
  class: "ws-restore-menu"
}, oo = {
  key: 0,
  class: "ws-restore-empty"
}, ao = ["onClick"], ro = /* @__PURE__ */ et({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = Ln(), c = z(null);
    un("cathodeWorkspace", c), un("cathodeResetTick", ln), Ze(() => {
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
    const u = z(!1), h = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function m(v) {
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
    Ze(() => {
      document.addEventListener("click", T), document.addEventListener("keydown", p);
    }), tt(() => {
      document.removeEventListener("click", T), document.removeEventListener("keydown", p);
    });
    function S(v) {
      var g;
      return ((g = n.containerTitles) == null ? void 0 : g[v]) ?? v;
    }
    return (v, g) => (ye(), be("div", {
      ref_key: "workspaceEl",
      ref: c,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      Nt(v.$slots, "default", {}, void 0, !0),
      Nt(v.$slots, "overlay", {}, void 0, !0),
      se("div", no, [
        t.initialLayout ? (ye(), be("button", {
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
      yn(Xn, { name: "menu" }, {
        default: Un(() => [
          u.value ? (ye(), be("div", lo, [
            g[3] || (g[3] = se("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? He("", !0) : (ye(), be("div", oo, " No closed panels ")),
            (ye(!0), be(Kn, null, Gn(h(), (M) => (ye(), be("div", {
              key: M,
              class: "ws-restore-item",
              onClick: (A) => m(M)
            }, [
              g[2] || (g[2] = se("span", { class: "ws-restore-icon" }, "⊞", -1)),
              jn(" " + Pe(S(M)), 1)
            ], 8, ao))), 128))
          ])) : He("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), ko = /* @__PURE__ */ nt(ro, [["__scopeId", "data-v-5838d04b"]]), io = ["id"], so = { class: "cc-title" }, co = {
  key: 0,
  class: "cc-size-badge"
}, uo = { class: "cc-controls" }, fo = ["title"], vo = { class: "cc-body" }, ho = 200, mo = 80, wn = 60, go = /* @__PURE__ */ et({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: c, updatePos: d, updateSize: i } = Ln(), f = Lt("cathodeWorkspace", z(null)), u = q(() => e.value[n.id]), h = q(() => {
      const x = u.value, D = n.curvature ?? 0;
      if (!x) return {};
      const F = { "--curvature": Math.abs(D) };
      return x.maximized ? { ...F, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: x.zIndex } : {
        ...F,
        left: x.x + "px",
        top: x.y + "px",
        width: x.w + "px",
        height: x.minimized ? Ot + "px" : x.h + "px",
        zIndex: x.zIndex,
        display: x.visible ? "flex" : "none"
      };
    });
    let m = !1, T = 0, p = 0;
    function S(x) {
      var $;
      if (x.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), m = !0;
      const D = ($ = f.value) == null ? void 0 : $.querySelector(`#cc-${n.id}`);
      if (!D) return;
      const F = D.getBoundingClientRect();
      T = x.clientX - F.left, p = x.clientY - F.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), x.preventDefault();
    }
    function v(x) {
      var P;
      if (!m || !f.value) return;
      const D = f.value.getBoundingClientRect(), F = ((P = u.value) == null ? void 0 : P.w) ?? 300;
      let $ = x.clientX - D.left - T, K = x.clientY - D.top - p;
      $ = Math.max(wn - F, Math.min(D.width - wn, $)), K = Math.max(0, Math.min(D.height - Ot, K)), d(n.id, $, K);
    }
    function g() {
      m = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let M = !1, A = 0, U = 0, L = 0, y = 0;
    const C = z("");
    function W(x) {
      u.value.maximized || (l(n.id), M = !0, A = x.clientX, U = x.clientY, L = u.value.w, y = u.value.h, document.addEventListener("mousemove", _), document.addEventListener("mouseup", ae), x.preventDefault(), x.stopPropagation());
    }
    function _(x) {
      if (!M) return;
      const D = Math.max(ho, L + (x.clientX - A)), F = Math.max(mo, y + (x.clientY - U));
      i(n.id, D, F), C.value = `${Math.round(D)}×${Math.round(F)}`;
    }
    function ae() {
      M = !1, C.value = "", document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", ae), te.value++;
    }
    const te = z(0);
    X(ln, () => {
      te.value++;
    }), tt(() => {
      var x;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", ae), (x = re.value) == null || x.removeEventListener("scroll", N), Q();
    });
    const re = z(null);
    function ne(x) {
      if (n.canvas) return [];
      const D = x.children[0];
      return D ? Array.from(D.children) : [];
    }
    function N() {
      const x = re.value, D = n.curvature ?? 0;
      if (!x) return;
      const F = ne(x);
      if (!F.length) return;
      const $ = x.clientHeight, K = $ / 2, P = D * 38e-4;
      F.forEach((G) => {
        if (!G.dataset.origFs) {
          const me = getComputedStyle(G);
          G.dataset.origFs = me.fontSize, G.dataset.origLh = me.lineHeight;
        }
        if (D === 0) {
          G.style.fontSize = "", G.style.lineHeight = "";
          return;
        }
        const xe = G.getBoundingClientRect(), ue = x.getBoundingClientRect(), Ie = xe.top - ue.top + xe.height / 2, Ce = Math.min(1, Math.abs(Ie - K) / ($ / 2)), Le = 1 + P * Math.cos(Ce * Math.PI / 2), R = parseFloat(G.dataset.origFs), V = G.dataset.origLh, le = V === "normal" ? R * 1.4 : parseFloat(V);
        isNaN(R) || (G.style.fontSize = `${(R * Le).toFixed(2)}px`), isNaN(le) || (G.style.lineHeight = `${(le * Le).toFixed(2)}px`);
      });
    }
    function Q() {
      const x = re.value;
      x && ne(x).forEach((D) => {
        D.style.fontSize = "", D.style.lineHeight = "", delete D.dataset.origFs, delete D.dataset.origLh;
      });
    }
    X(() => n.curvature, (x) => {
      (x ?? 0) === 0 ? Q() : N();
    }), Ze(() => {
      var x;
      (x = re.value) == null || x.addEventListener("scroll", N, { passive: !0 }), Ve(N);
    });
    function he() {
      r(n.id, !u.value.minimized), Ve(() => {
        te.value++;
      });
    }
    function ee() {
      c(n.id, !u.value.maximized), Ve(() => {
        te.value++;
      });
    }
    function Z() {
      a(n.id, !1);
    }
    function H() {
      l(n.id);
    }
    return (x, D) => u.value && u.value.visible ? (ye(), be("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: qn(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: _e(h.value),
      onMousedown: H
    }, [
      se("div", {
        class: "cc-titlebar",
        onMousedown: S
      }, [
        D[0] || (D[0] = se("span", { class: "cc-status-dot" }, null, -1)),
        se("span", so, Pe(t.title), 1),
        C.value ? (ye(), be("span", co, Pe(C.value), 1)) : He("", !0),
        se("div", uo, [
          se("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ge(he, ["stop"])
          }, "─"),
          se("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Ge(ee, ["stop"])
          }, Pe(u.value.maximized ? "⤡" : "⤢"), 9, fo),
          se("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ge(Z, ["stop"])
          }, "✕")
        ])
      ], 32),
      bn(se("div", vo, [
        se("div", {
          ref_key: "bodyEl",
          ref: re,
          class: "cc-screen",
          onScroll: N
        }, [
          Nt(x.$slots, "default", { resizeKey: te.value }, void 0, !0),
          D[1] || (D[1] = se("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Zn, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (ye(), be("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ge(W, ["stop"])
      }, null, 32)) : He("", !0)
    ], 46, io)) : He("", !0);
  }
}), Io = /* @__PURE__ */ nt(go, [["__scopeId", "data-v-ca0af4ca"]]), po = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, wo = `
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
`, yo = 100, bo = /* @__PURE__ */ et({
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
    let i, f, u, h, m, T = null, p = 0;
    function S(y) {
      y - p >= yo && (M(), p = y), T = requestAnimationFrame(S);
    }
    function v() {
      if (!l.value || !m) return;
      const y = l.value.clientWidth, C = l.value.clientHeight;
      y <= 0 || C <= 0 || m.width === y && m.height === C || (m.width = y, m.height = C, r && r.setSize(y, C, !1), a.value && (a.value.width = y, a.value.height = C, a.value.style.width = y + "px", a.value.style.height = C + "px"));
    }
    function g() {
      if (!(m != null && m.width)) return;
      const y = m.getContext("2d");
      if (!y) return;
      const C = m.width, W = m.height, _ = e[n.theme] ?? e.none;
      y.clearRect(0, 0, C, W), y.fillStyle = _.bg, y.fillRect(0, 0, C, W);
      const ae = Date.now(), te = (ae / 500 | 0) % 2 === 0, re = (ae / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(C, W) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = _.text, n.glow && (y.shadowColor = _.text, y.shadowBlur = 14);
      const ne = ".".repeat(re).padEnd(3, " "), N = `${n.label}${ne}`;
      if (y.fillText(N, C / 2, W / 2), y.shadowBlur = 0, te) {
        const Q = y.measureText(N), he = y.measureText("M").width, ee = parseFloat(y.font), Z = C / 2 + Q.width / 2 + 4, H = W / 2 - ee / 2 + 2;
        y.fillStyle = _.cursor, n.glow && (y.shadowColor = _.cursor, y.shadowBlur = 12), y.fillRect(Z, H, he * 0.7, ee * 0.95), y.shadowBlur = 0;
      }
    }
    function M() {
      if (!m) return;
      if (g(), c) {
        if (!a.value) return;
        const C = a.value.getContext("2d");
        C && C.drawImage(m, 0, 0);
        return;
      }
      if (!r || !u || !h) return;
      const y = n.theme === "paper";
      u.uniforms.uStrength.value = bt(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, h.needsUpdate = !0, r.render(i, f);
    }
    function A() {
      if (!(!a.value || !l.value)) {
        m = document.createElement("canvas");
        try {
          r = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          c = !0;
        }
        if (!c && !r.getContext() && (r.dispose(), r = null, c = !0), c) {
          v();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), i = new O.Scene(), f = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new O.CanvasTexture(m), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, u = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: po,
          fragmentShader: wo,
          transparent: !0
        }), i.add(new O.Mesh(new O.PlaneGeometry(2, 2), u)), v();
      }
    }
    let U = null;
    Ze(() => {
      A(), M(), T = requestAnimationFrame(S), l.value && (U = new ResizeObserver(() => v()), U.observe(l.value));
    }), tt(() => {
      T !== null && cancelAnimationFrame(T), U == null || U.disconnect(), d(), h == null || h.dispose(), u == null || u.dispose();
    }), X(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => M());
    const L = q(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (y, C) => (ye(), be("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: _e(L.value)
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Lo = /* @__PURE__ */ nt(bo, [["__scopeId", "data-v-d00e5f47"]]);
export {
  Ct as CANDLE_THEME_COLORS,
  To as CathodeCandle,
  Io as CathodeContainer,
  Mo as CathodeGrid,
  Lo as CathodeLoader,
  Ml as CathodeLog,
  So as CathodeTerminal,
  ko as CathodeWorkspace,
  Tt as LOG_THEME_COLORS,
  Co as buildDefaultLayout,
  Ln as useCathodeLayout
};
