import { defineComponent as Je, ref as z, reactive as kt, computed as ne, watch as N, inject as Tt, nextTick as ze, onMounted as Ge, onUnmounted as Qe, openBlock as pe, createElementBlock as we, normalizeStyle as Fe, createElementVNode as re, withModifiers as Oe, withKeys as kn, createCommentVNode as We, toDisplayString as Ye, createVNode as sn, withDirectives as cn, vModelText as In, provide as Jt, renderSlot as At, Transition as Ln, withCtx as Rn, Fragment as Dn, renderList as En, createTextVNode as Fn, normalizeClass as An, vShow as Bn } from "vue";
import * as X from "three";
const ct = {
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
}, me = 30, It = 12, _n = 10, un = 28;
function Yn(t, n) {
  if (typeof n == "function") return n(t);
  const e = t.filter((o) => o != null && o !== "");
  if (n === "count") return e.length;
  const l = e.map((o) => Number(o)).filter((o) => !Number.isNaN(o));
  if (l.length === 0) return null;
  switch (n) {
    case "sum":
      return l.reduce((o, i) => o + i, 0);
    case "avg":
      return l.reduce((o, i) => o + i, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function Qt(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, i = ct[n.theme] ?? ct.none, { cols: d, rows: f, pinnedRows: s, rowHeight: r, scrollY: u, scrollX: h, glow: p } = n;
  e.clearRect(0, 0, l, o), e.fillStyle = i.bg, e.fillRect(0, 0, l, o), e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip();
  const M = s.length * r, w = n.aggregateRow ? un : 0, x = o - me - M - w;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, l, me), e.textBaseline = "middle", e.textAlign = "left";
  let v = -h;
  for (let B = 0; B < d.length; B++) {
    const V = d[B];
    if (v + V.width <= 0) {
      v += V.width;
      continue;
    }
    if (v >= l) break;
    const Y = !!n.colFilters[V.colId], _ = n.sortColId === V.colId, O = (V.colDef.headerName ?? V.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, V.width, me), e.clip(), e.font = `bold ${_n}px system-ui, -apple-system, sans-serif`, e.fillStyle = Y ? i.accent : i.textHeader, p ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(O, v + 8, me / 2), e.shadowBlur = 4, e.fillText(O, v + 8, me / 2), e.shadowBlur = 0) : e.fillText(O, v + 8, me / 2), _) {
      const $ = e.measureText(O).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", v + 8 + $ + 4, me / 2);
    }
    V.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = Y ? i.accent : i.textHeader, e.globalAlpha = Y ? 1 : 0.38, e.fillText("⌕", v + V.width - 20, me / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + V.width - 0.5, 0), e.lineTo(v + V.width - 0.5, me), e.stroke(), v += V.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, me - 0.5), e.lineTo(l, me - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, me, l, x), e.clip();
  const m = Math.max(0, Math.floor(u / r)), D = Math.min(f.length, Math.ceil((u + x) / r)), L = n.selectionAnchorRow ?? n.selectedRow, K = n.selectionAnchorCol ?? n.selectedCol, g = n.selectedRow >= 0 && L >= 0 ? Math.min(n.selectedRow, L) : -1, k = n.selectedRow >= 0 && L >= 0 ? Math.max(n.selectedRow, L) : -1, R = n.selectedCol >= 0 && K >= 0 ? Math.min(n.selectedCol, K) : -1, P = n.selectedCol >= 0 && K >= 0 ? Math.max(n.selectedCol, K) : -1, A = k > g || P > R;
  let Q = Number.POSITIVE_INFINITY, G = Number.NEGATIVE_INFINITY, U = Number.POSITIVE_INFINITY, j = Number.NEGATIVE_INFINITY;
  for (let B = m; B < D; B++) {
    const V = f[B], Y = me + B * r - u;
    B % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, Y, l, r));
    const _ = B >= g && B <= k;
    B === n.hoveredRow && !_ && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, Y, l, r)), _ && !A && (e.fillStyle = Lt(i.accent, 0.1), e.fillRect(0, Y, l, r)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Y + r - 0.5), e.lineTo(l, Y + r - 0.5), e.stroke();
    let O = -h;
    for (let $ = 0; $ < d.length; $++) {
      const S = d[$];
      if (O + S.width <= 0) {
        O += S.width;
        continue;
      }
      if (O >= l) break;
      const q = _ && $ >= R && $ <= P;
      q && A && (e.fillStyle = Lt(i.accent, 0.14), e.fillRect(O, Y, S.width, r)), q && (O < Q && (Q = O), O + S.width > G && (G = O + S.width), Y < U && (U = Y), Y + r > j && (j = Y + r));
      const te = n.getCellStyle(S, V), se = te.color ?? i.text, ie = te.textAlign ?? "left", fe = n.formatCell(S, V);
      e.save(), e.beginPath(), e.rect(O + 1, Y, S.width - 2, r), e.clip(), e.font = `${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = se, e.textBaseline = "middle";
      const ae = ie === "right" ? O + S.width - 8 : O + 8;
      e.textAlign = ie === "right" ? "right" : "left";
      const ce = Y + r / 2;
      p ? (e.shadowColor = se, e.shadowBlur = 12, e.fillText(fe, ae, ce), e.shadowBlur = 6, e.fillText(fe, ae, ce), e.shadowBlur = 2, e.fillText(fe, ae, ce), e.shadowBlur = 0) : e.fillText(fe, ae, ce), e.restore(), B === n.selectedRow && $ === n.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(O + 1.5, Y + 1.5, S.width - 3, r - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(O + S.width - 0.5, Y), e.lineTo(O + S.width - 0.5, Y + r), e.stroke(), O += S.width;
    }
  }
  if (A && Q < G && U < j && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(Q + 0.5, U + 0.5, G - Q - 1, j - U - 1)), e.restore(), s.length > 0) {
    const B = o - M - w;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B - 0.5), e.lineTo(l, B - 0.5), e.stroke();
    for (let V = 0; V < s.length; V++) {
      const Y = s[V], _ = B + V * r;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, _, l, r);
      let O = -h;
      for (let $ = 0; $ < d.length; $++) {
        const S = d[$];
        if (O + S.width <= 0) {
          O += S.width;
          continue;
        }
        if (O >= l) break;
        const q = n.getCellStyle(S, Y), te = q.color ?? i.text, se = q.textAlign ?? "left", ie = n.formatCell(S, Y);
        e.save(), e.beginPath(), e.rect(O + 1, _, S.width - 2, r), e.clip(), e.font = `bold ${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = te, e.textBaseline = "middle", se === "right" ? (e.textAlign = "right", e.fillText(ie, O + S.width - 8, _ + r / 2)) : (e.textAlign = "left", e.fillText(ie, O + 8, _ + r / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(O + S.width - 0.5, _), e.lineTo(O + S.width - 0.5, _ + r), e.stroke(), O += S.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, _ + r - 0.5), e.lineTo(l, _ + r - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const B = o - w;
    e.fillStyle = Lt(i.accent, 0.1), e.fillRect(0, B, l, w), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B - 0.5), e.lineTo(l, B - 0.5), e.stroke();
    let V = -h;
    for (let Y = 0; Y < d.length; Y++) {
      const _ = d[Y];
      if (V + _.width <= 0) {
        V += _.width;
        continue;
      }
      if (V >= l) break;
      const $ = n.getCellStyle(_, n.aggregateRow).textAlign ?? "left", S = n.aggregateRow[_.colId] ?? "";
      e.save(), e.beginPath(), e.rect(V + 1, B, _.width - 2, w), e.clip(), e.font = `bold ${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", p && (e.shadowColor = i.accent, e.shadowBlur = 8), $ === "right" ? (e.textAlign = "right", e.fillText(S, V + _.width - 8, B + w / 2)) : (e.textAlign = "left", e.fillText(S, V + 8, B + w / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(V + _.width - 0.5, B), e.lineTo(V + _.width - 0.5, B + w), e.stroke(), V += _.width;
    }
  }
  e.restore();
}
function Lt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), o = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${o},${n})`;
}
function Wn(t, n, e) {
  const l = t - 0.5, o = n - 0.5, i = (l * l + o * o) * e, d = l * (1 + i) * i, f = o * (1 + i) * i;
  return [t + d, n + f * 0.15];
}
function zn(t, n, e, l, o) {
  const i = t / e, d = 1 - n / l, [f, s] = Wn(i, d, o);
  return f < 0 || f > 1 || s < 0 || s > 1 ? [-1, -1] : [f * e, (1 - s) * l];
}
function Rt(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function Pn(t, n, e) {
  return t >= n + e - 24 && t < n + e;
}
function en(t, n, e) {
  const l = n + e;
  return t >= l - 6 && t <= l + 1;
}
function tn(t, n, e, l, o, i, d, f, s, r = !1) {
  const u = t + s;
  let h = -1, p = 0;
  for (let m = 0; m < e.length; m++) {
    if (u >= p && u < p + e[m].width) {
      h = m;
      break;
    }
    p += e[m].width;
  }
  if (n < me) return { area: "header", colIdx: h, rowIdx: -1 };
  const M = r ? un : 0;
  if (M > 0 && n >= d - M)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const w = f * o;
  if (w > 0 && n >= d - w - M) {
    const m = Math.floor((n - (d - w - M)) / o);
    return { area: "pinned", colIdx: h, rowIdx: m };
  }
  const x = n - me + i, v = Math.floor(x / o);
  return v >= 0 && v < l ? { area: "body", colIdx: h, rowIdx: v } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Hn = 500, $n = Hn / 2, Vn = 1.6, Yt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Wt = `
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
`, zt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Pt() {
  return {
    uMouseUV: { value: new X.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Vn },
    uLensTint: { value: new X.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
function Ht(t, n, e, l, o) {
  const i = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = i && o > 0 ? $n / o : 0, t.uniforms.uAspect.value = o > 0 ? l / o : 1;
}
function $t(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const Xn = ["value"], Nn = ["disabled"], On = ["disabled"], Un = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Kn = 28, Gn = 600, jn = /* @__PURE__ */ Je({
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
    const e = t, l = n, o = z(e.rowData ?? []), i = z(e.pinnedBottomRowData ?? []), d = z(""), f = z(null), s = kt({}), r = kt({}), u = kt(/* @__PURE__ */ new Set()), h = z(0), p = z(0), M = z(0), w = z(0), x = z(0), v = z(-1), m = z(null), D = z(null), L = z(null), K = { ...Me }, g = z({ x: 0, y: me }), k = z("");
    function R(a) {
      return a.colId ?? a.field ?? (a.headerName ? a.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const P = ne(() => {
      const a = e.defaultColDef ?? {};
      return e.columnDefs.filter((c) => !u.has(R(c))).map((c) => {
        const b = R(c), I = { ...a, ...c };
        return { colId: b, colDef: I, width: r[b] ?? I.width ?? 100 };
      });
    }), A = ne(() => {
      const a = p.value;
      if (!a) return P.value;
      const c = P.value.reduce((T, E) => T + E.width, 0);
      if (!c || c >= a) return P.value;
      const b = a / c;
      let I = 0;
      return P.value.map((T, E) => {
        const Z = E === P.value.length - 1 ? a - I : Math.max(8, Math.round(T.width * b));
        return I += Z, { ...T, width: Z };
      });
    }), Q = ne(() => {
      const a = A.value.reduce((c, b) => c + b.width, 0);
      return Math.max(0, a - p.value);
    }), G = ne(() => {
      const a = i.value.length * e.rowHeight;
      return Math.max(0, M.value - me - a);
    }), U = ne(
      () => Math.max(0, $.value.length * e.rowHeight - G.value)
    ), j = ne(
      () => Math.max(1, Math.floor(G.value / e.rowHeight))
    ), B = ne(
      () => $.value.length === 0 ? 0 : Math.min($.value.length - 1, Math.floor(w.value / e.rowHeight))
    ), V = ne(
      () => Math.min($.value.length - 1, B.value + j.value - 1)
    );
    function Y(a, c) {
      if (c.colDef.valueGetter) return c.colDef.valueGetter({ data: a, colDef: c.colDef });
      if (c.colDef.field) return a[c.colDef.field];
    }
    function _(a, c) {
      const b = Y(c, a);
      return a.colDef.valueFormatter ? a.colDef.valueFormatter({ value: b, data: c, colDef: a.colDef }) ?? "" : a.colDef.cellRenderer ? (a.colDef.cellRenderer({ value: b, data: c, colDef: a.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function O(a, c) {
      return a.colDef.cellStyle ? typeof a.colDef.cellStyle == "function" ? a.colDef.cellStyle({ value: Y(c, a), data: c, colDef: a.colDef }) ?? {} : a.colDef.cellStyle : {};
    }
    const $ = ne(() => {
      h.value;
      let a = o.value;
      const c = d.value.trim().toLowerCase();
      c && (a = a.filter(
        (b) => P.value.some(
          (I) => String(Y(b, I) ?? "").toLowerCase().includes(c)
        )
      ));
      for (const [b, I] of Object.entries(s)) {
        if (!I) continue;
        const T = P.value.find((E) => E.colId === b);
        if (T)
          if (I.startsWith("__eq__")) {
            const E = I.slice(6).toLowerCase();
            a = a.filter((W) => String(Y(W, T) ?? "").toLowerCase() === E);
          } else {
            const E = I.toLowerCase();
            a = a.filter((W) => String(Y(W, T) ?? "").toLowerCase().includes(E));
          }
      }
      if (f.value) {
        const { colId: b, dir: I } = f.value, T = P.value.find((E) => E.colId === b);
        T && (a = [...a].sort((E, W) => {
          const Z = Y(E, T), de = Y(W, T);
          let ge = 0;
          return T.colDef.comparator ? ge = T.colDef.comparator(Z, de) : typeof Z == "number" && typeof de == "number" ? ge = Z - de : ge = String(Z ?? "").localeCompare(String(de ?? ""), void 0, { numeric: !0 }), I === "asc" ? ge : -ge;
        }));
      }
      return a;
    }), S = ne(() => {
      const a = P.value.filter((T) => T.colDef.aggFunc != null);
      if (a.length === 0) return null;
      const c = $.value, b = {};
      for (const T of a) {
        const E = c.map((Z) => Y(Z, T)), W = Yn(E, T.colDef.aggFunc);
        if (W == null) {
          b[T.colId] = "";
          continue;
        }
        b[T.colId] = T.colDef.aggValueFormatter ? T.colDef.aggValueFormatter(W) : String(W);
      }
      const I = a[0].colId;
      return b[I] === "" && (b[I] = "Σ"), b;
    });
    N($, () => {
      w.value = 0, m.value = null;
    }), N(Q, () => {
      x.value = Math.min(x.value, Q.value);
    }), N(U, () => {
      w.value = Math.min(w.value, U.value);
    });
    function q(a) {
      const c = a * e.rowHeight, b = c + e.rowHeight;
      c < w.value ? w.value = c : b > w.value + G.value && (w.value = Math.min(U.value, b - G.value));
    }
    function te() {
      w.value = Math.max(0, w.value - G.value), oe();
    }
    function se() {
      w.value = Math.min(U.value, w.value + G.value), oe();
    }
    let ie = !1, fe = "", ae = 0, ce = 0, ke = !1, xe = !1, De = 0, C = 0, H = 0, le = 0, ve = !1;
    function Se(a, c) {
      var b;
      ie = !0, fe = a, ae = c, ce = ((b = A.value.find((I) => I.colId === a)) == null ? void 0 : b.width) ?? 100, ke = !1;
    }
    function He(a) {
      if (xe) {
        const E = De - a.clientX, W = C - a.clientY;
        (Math.abs(E) > 4 || Math.abs(W) > 4) && (ve = !0), x.value = Math.max(0, Math.min(Q.value, H + E)), w.value = Math.max(0, Math.min(U.value, le + W)), oe();
        return;
      }
      if (!ie) return;
      const c = p.value, b = Math.max(30, ce + (a.clientX - ae)), I = P.value.filter((E) => E.colId !== fe).reduce((E, W) => E + W.width, 0), T = c - b;
      T > 10 && (r[fe] = Math.max(10, Math.round(b * I / T))), oe();
    }
    function nt() {
      xe && (ve && (ke = !0), xe = !1), ie && (ie = !1, ke = !0, l("column-resized"));
    }
    function ut(a) {
      if (a.touches.length !== 1) return;
      const c = a.touches[0];
      xe = !0, ve = !1, De = c.clientX, C = c.clientY, H = x.value, le = w.value;
    }
    function lt(a) {
      if (!xe || a.touches.length !== 1) return;
      a.preventDefault();
      const c = a.touches[0], b = De - c.clientX, I = C - c.clientY;
      (Math.abs(b) > 4 || Math.abs(I) > 4) && (ve = !0), x.value = Math.max(0, Math.min(Q.value, H + b)), w.value = Math.max(0, Math.min(U.value, le + I)), oe();
    }
    function Ne() {
      xe && (ve && (ke = !0), xe = !1);
    }
    const Ie = z(null), ee = z(null), $e = Tt("cathodeResetTick", z(0));
    N($e, () => at());
    let ue = null, Ve = !1, Be, ft, Ce, Te, he;
    const y = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Yt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Wt}

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

    ${zt}

    gl_FragColor = color;
  }
`;
    function F() {
      if (!(!ee.value || !Ie.value)) {
        he = document.createElement("canvas");
        try {
          ue = new X.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          Ve = !0;
        }
        if (!Ve && !ue.getContext() && (ue.dispose(), ue = null, Ve = !0), Ve) {
          J();
          return;
        }
        ue.setPixelRatio(1), ue.setClearColor(0, 0), Be = new X.Scene(), ft = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), Te = new X.CanvasTexture(he), Te.minFilter = X.LinearFilter, Te.magFilter = X.LinearFilter, Ce = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: Te },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new X.Color(0) },
            ...Pt()
          },
          vertexShader: Un,
          fragmentShader: y,
          transparent: !0
        }), Be.add(new X.Mesh(new X.PlaneGeometry(2, 2), Ce)), J();
      }
    }
    function J() {
      if (!Ie.value || !ue && !Ve) return;
      const a = Ie.value.clientWidth, c = Ie.value.clientHeight - (e.pagination ? Kn : 0);
      if (!a || !c) return;
      const b = he.width !== a || he.height !== c;
      he.width = a, he.height = c, p.value = a, M.value = c, x.value = Math.max(0, Math.min(Q.value, x.value)), w.value = Math.max(0, Math.min(U.value, w.value)), ue ? (b && Te && (Te.dispose(), Te = new X.CanvasTexture(he), Te.minFilter = X.LinearFilter, Te.magFilter = X.LinearFilter, Ce && (Ce.uniforms.uTex.value = Te)), ue.setPixelRatio(window.devicePixelRatio || 1), ue.setSize(a, c)) : ee.value && (ee.value.width = a, ee.value.height = c, ee.value.style.width = a + "px", ee.value.style.height = c + "px"), oe();
    }
    function oe() {
      var b, I, T, E, W, Z, de, ge, it, ht, mt, rt;
      if (!(he != null && he.width)) return;
      if (Ve) {
        if (!ee.value) return;
        Qt(he, {
          cols: A.value,
          rows: $.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: w.value,
          scrollX: x.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = f.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((I = f.value) == null ? void 0 : I.dir) ?? null,
          colFilters: s,
          hoveredRow: v.value,
          selectedRow: ((T = m.value) == null ? void 0 : T.row) ?? -1,
          selectedCol: ((E = m.value) == null ? void 0 : E.col) ?? -1,
          selectionAnchorRow: ((W = D.value) == null ? void 0 : W.row) ?? -1,
          selectionAnchorCol: ((Z = D.value) == null ? void 0 : Z.col) ?? -1,
          formatCell: _,
          getCellStyle: O
        });
        const gt = ee.value.getContext("2d");
        gt && gt.drawImage(he, 0, 0);
        return;
      }
      if (!ue || !Ce || !Te) return;
      const a = ct[e.theme] ?? ct.none, c = e.theme === "paper";
      Ce.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ce.uniforms.uScanlines.value = e.scanlines && !c ? 1 : 0, Ce.uniforms.uVignette.value = c ? 0 : 1, Ce.uniforms.uBezel.value.set(a.bg), Ht(Ce, e.magnify, K, he.width, he.height), Qt(he, {
        cols: A.value,
        rows: $.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: w.value,
        scrollX: x.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((de = f.value) == null ? void 0 : de.colId) ?? null,
        sortDir: ((ge = f.value) == null ? void 0 : ge.dir) ?? null,
        colFilters: s,
        hoveredRow: v.value,
        selectedRow: ((it = m.value) == null ? void 0 : it.row) ?? -1,
        selectedCol: ((ht = m.value) == null ? void 0 : ht.col) ?? -1,
        selectionAnchorRow: ((mt = D.value) == null ? void 0 : mt.row) ?? -1,
        selectionAnchorCol: ((rt = D.value) == null ? void 0 : rt.col) ?? -1,
        formatCell: _,
        getCellStyle: O,
        aggregateRow: S.value
      }), Te.needsUpdate = !0, ue.render(Be, ft);
    }
    function Ee(a) {
      if (!ee.value) return [-1, -1];
      const c = ee.value.getBoundingClientRect(), b = a.clientX - c.left, I = a.clientY - c.top, T = ee.value.width || c.width, E = ee.value.height || c.height, W = e.curvature / 45 * 0.55, [Z, de] = zn(b, I, T, E, W);
      return Z < 0 ? [-1, -1] : [Z, de];
    }
    let Le = 0;
    function _e(a) {
      L.value = null;
      const c = Date.now();
      if (a.deltaX !== 0) {
        Le = c, x.value = Math.max(0, Math.min(Q.value, x.value + a.deltaX)), oe();
        return;
      }
      if (a.shiftKey && a.deltaY !== 0) {
        Le = c, x.value = Math.max(0, Math.min(Q.value, x.value + a.deltaY)), oe();
        return;
      }
      c - Le < Gn || (w.value = Math.max(0, Math.min(U.value, w.value + a.deltaY)), oe());
    }
    function ot(a) {
      if (ie) return;
      if (e.magnify && ee.value) {
        const T = $t(a, ee.value);
        K.x = T.x, K.y = T.y;
      }
      const [c, b] = Ee(a);
      if (c < 0) {
        v.value = -1, oe();
        return;
      }
      const I = tn(
        c,
        b,
        A.value,
        $.value.length,
        e.rowHeight,
        w.value,
        he.height,
        i.value.length,
        x.value,
        S.value !== null
      );
      if (v.value = I.area === "body" ? I.rowIdx : -1, I.area === "header" && I.colIdx >= 0) {
        const T = A.value[I.colIdx], E = Rt(I.colIdx, A.value), W = c + x.value;
        ee.value.style.cursor = T && en(W, E, T.width) ? "col-resize" : "pointer";
      } else I.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      oe();
    }
    function qe() {
      v.value = -1, K.x = Me.x, K.y = Me.y, oe();
    }
    function mn(a) {
      const [c, b] = Ee(a);
      if (c < 0) return;
      if (b >= me) {
        xe = !0, ve = !1, De = a.clientX, C = a.clientY, H = x.value, le = w.value;
        return;
      }
      const I = c + x.value;
      for (let T = 0; T < A.value.length; T++) {
        const E = A.value[T], W = Rt(T, A.value);
        if (E.colDef.resizable !== !1 && en(I, W, E.width)) {
          Se(E.colId, a.clientX);
          return;
        }
      }
    }
    function gn(a) {
      var T, E, W;
      if (ke) {
        ke = !1;
        return;
      }
      if (ie) return;
      const [c, b] = Ee(a);
      if (c < 0) {
        L.value = null;
        return;
      }
      const I = tn(
        c,
        b,
        A.value,
        $.value.length,
        e.rowHeight,
        w.value,
        he.height,
        i.value.length,
        x.value,
        S.value !== null
      );
      if (I.area === "header" && I.colIdx >= 0) {
        const Z = A.value[I.colIdx], de = Rt(I.colIdx, A.value), ge = c + x.value;
        Z.colDef.filter && Pn(ge, de, Z.width) ? (a.stopPropagation(), L.value === Z.colId ? L.value = null : (L.value = Z.colId, k.value = (T = s[Z.colId]) != null && T.startsWith("__eq__") ? s[Z.colId].slice(6) : s[Z.colId] ?? "", g.value = { x: Math.max(0, de - x.value), y: me })) : Z.colDef.sortable !== !1 && (L.value = null, f.value = ((E = f.value) == null ? void 0 : E.colId) === Z.colId ? f.value.dir === "asc" ? { colId: Z.colId, dir: "desc" } : null : { colId: Z.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (L.value = null, I.area === "body" && I.rowIdx >= 0 && I.colIdx >= 0) {
        const Z = I.rowIdx;
        a.shiftKey && m.value ? (D.value || (D.value = { ...m.value }), m.value = { row: Z, col: I.colIdx }) : (m.value = { row: Z, col: I.colIdx }, D.value = { row: Z, col: I.colIdx }), (W = ee.value) == null || W.focus();
        const de = $.value[Z], ge = A.value[I.colIdx];
        de && ge && (l("row-clicked", { data: de, event: a }), l("cell-selected", { data: de, row: Z, col: I.colIdx, colId: ge.colId }));
      }
    }
    function Kt(a) {
      var c, b;
      L.value && ((b = (c = a.target).closest) != null && b.call(c, ".cathode-filter-popup") || (L.value = null));
    }
    function pn(a) {
      var T;
      if (!p.value) return;
      let c = 0;
      for (let E = 0; E < a; E++) c += A.value[E].width;
      const b = ((T = A.value[a]) == null ? void 0 : T.width) ?? 0, I = c - x.value;
      I < 0 ? x.value = Math.max(0, c) : I + b > p.value && (x.value = Math.min(Q.value, c + b - p.value));
    }
    function wn(a) {
      const b = A.value.length - 1, I = $.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(a.key) && (a.preventDefault(), m.value = { row: B.value, col: 0 }, D.value = { row: B.value, col: 0 });
        return;
      }
      let { row: T, col: E } = m.value;
      const W = (Z, de, ge = !1) => {
        T = Math.max(0, Math.min(I, Z)), E = Math.max(0, Math.min(b, de)), m.value = { row: T, col: E }, ge || (D.value = { row: T, col: E }), q(T), pn(E);
      };
      switch (a.key) {
        case "ArrowDown":
          a.preventDefault(), W(T + 1, E, a.shiftKey);
          break;
        case "ArrowUp":
          a.preventDefault(), W(T - 1, E, a.shiftKey);
          break;
        case "ArrowRight":
          a.preventDefault(), a.shiftKey ? W(T, E + 1, !0) : E < b ? W(T, E + 1) : W(T + 1, 0);
          break;
        case "ArrowLeft":
          a.preventDefault(), a.shiftKey ? W(T, E - 1, !0) : E > 0 ? W(T, E - 1) : W(T - 1, b);
          break;
        case "Tab":
          a.preventDefault(), a.shiftKey ? E > 0 ? W(T, E - 1) : W(T - 1, b) : E < b ? W(T, E + 1) : W(T + 1, 0);
          break;
        case "Enter":
          a.preventDefault(), a.shiftKey ? W(T - 1, E) : W(T + 1, E);
          break;
        case "Home":
          a.preventDefault(), a.ctrlKey || a.metaKey ? W(0, 0, a.shiftKey) : W(T, 0, a.shiftKey);
          break;
        case "End":
          a.preventDefault(), a.ctrlKey || a.metaKey ? W(I, b, a.shiftKey) : W(T, b, a.shiftKey);
          break;
        case "PageDown":
          a.preventDefault(), W(Math.min(I, T + j.value), E, a.shiftKey);
          break;
        case "PageUp":
          a.preventDefault(), W(Math.max(0, T - j.value), E, a.shiftKey);
          break;
        case "Escape":
          m.value = null, D.value = null;
          break;
        case "c":
        case "C":
          (a.ctrlKey || a.metaKey) && (a.preventDefault(), yn());
          break;
      }
    }
    function yn() {
      var ge;
      if (!m.value) return;
      const a = A.value, c = $.value, b = D.value ?? m.value, I = Math.min(b.row, m.value.row), T = Math.max(b.row, m.value.row), E = Math.min(b.col, m.value.col), W = Math.max(b.col, m.value.col), Z = [];
      for (let it = I; it <= T; it++) {
        const ht = c[it];
        if (!ht) continue;
        const mt = [];
        for (let rt = E; rt <= W; rt++) {
          const gt = a[rt];
          gt && mt.push(_(gt, ht).replace(/[\t\r\n]+/g, " "));
        }
        Z.push(mt.join("	"));
      }
      const de = Z.join(`
`);
      (ge = navigator.clipboard) == null || ge.writeText(de).catch(() => {
      });
    }
    function bn(a) {
      const c = a.target.value;
      k.value = c, c ? s[L.value] = c : delete s[L.value], l("filter-changed");
    }
    function Gt() {
      L.value && delete s[L.value], k.value = "", L.value = null, l("filter-changed");
    }
    const xn = {
      setGridOption(a, c) {
        a === "rowData" ? o.value = c : a === "pinnedBottomRowData" ? i.value = c : a === "quickFilterText" && (d.value = c);
      },
      getColumnState() {
        return e.columnDefs.map((a) => {
          var b, I;
          const c = R(a);
          return {
            colId: c,
            hide: u.has(c),
            sort: ((b = f.value) == null ? void 0 : b.colId) === c ? f.value.dir : null,
            sortIndex: ((I = f.value) == null ? void 0 : I.colId) === c ? 0 : null,
            width: r[c] ?? a.width
          };
        });
      },
      applyColumnState({ state: a }) {
        for (const c of a)
          c.hide === !0 && u.add(c.colId), c.hide === !1 && u.delete(c.colId), c.sort && (f.value = { colId: c.colId, dir: c.sort }), c.width && (r[c.colId] = c.width);
      },
      setFilterModel(a) {
        for (const c of Object.keys(s)) delete s[c];
        if (a)
          for (const [c, b] of Object.entries(a))
            (b == null ? void 0 : b.type) === "equals" ? s[c] = `__eq__${b.filter}` : b != null && b.filter && (s[c] = b.filter);
      },
      getFilterModel() {
        const a = {};
        for (const [c, b] of Object.entries(s))
          b && (a[c] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
        return a;
      },
      async setColumnFilterModel(a, c) {
        c ? c.type === "equals" ? s[a] = `__eq__${c.filter}` : s[a] = c.filter ?? "" : delete s[a];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: a = "export.csv" } = {}) {
        const c = P.value, b = c.map((W) => W.colDef.headerName ?? W.colId).join(","), I = $.value.map(
          (W) => c.map((Z) => `"${String(_(Z, W)).replace(/"/g, '""')}"`).join(",")
        ), T = new Blob([[b, ...I].join(`
`)], { type: "text/csv" }), E = URL.createObjectURL(T);
        Object.assign(document.createElement("a"), { href: E, download: a }).click(), URL.revokeObjectURL(E);
      },
      resize() {
        J();
      },
      resetColumnState() {
        u.clear();
        for (const c of e.columnDefs)
          c.hide && u.add(R(c));
        const a = e.columnDefs.find((c) => c.sort);
        f.value = a ? { colId: R(a), dir: a.sort } : null;
        for (const c of Object.keys(r)) delete r[c];
        for (const c of Object.keys(s)) delete s[c];
        d.value = "", w.value = 0, m.value = null, L.value = null;
      }
    };
    N(
      [$, () => i.value, A, w, v, m],
      () => ze(oe)
    ), N(() => e.theme, () => oe()), N(() => e.curvature, () => ze(J)), N(() => e.scanlines, () => oe()), N(() => e.glow, () => oe()), N(() => e.magnify, (a) => {
      a || (K.x = Me.x, K.y = Me.y), oe();
    }), N(m, (a) => {
      if (!a) return;
      const c = $.value[a.row], b = A.value[a.col];
      c && b && l("cell-selected", { data: c, row: a.row, col: a.col, colId: b.colId });
    });
    let dt = null, vt = null, Ct = 0;
    function at() {
      cancelAnimationFrame(Ct), Ct = requestAnimationFrame(J);
    }
    function jt(a) {
      a.preventDefault();
    }
    function qt() {
      ue == null || ue.dispose(), ue = null, Ve = !1, F();
    }
    Ge(() => {
      for (const a of e.columnDefs)
        a.hide && u.add(R(a)), a.sort && !f.value && (f.value = { colId: R(a), dir: a.sort });
      o.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Kt), document.addEventListener("mousemove", He), document.addEventListener("mouseup", nt), ze(() => {
        var a;
        F(), ee.value && (ee.value.addEventListener("webglcontextlost", jt), ee.value.addEventListener("webglcontextrestored", qt)), Ie.value && (dt = new ResizeObserver(() => J()), dt.observe(Ie.value), vt = new IntersectionObserver((c) => {
          c.some((b) => b.isIntersecting) && at();
        }), vt.observe(Ie.value)), window.addEventListener("resize", at), (a = window.visualViewport) == null || a.addEventListener("resize", at), l("grid-ready", { api: xn });
      });
    }), Qe(() => {
      var a, c, b;
      document.removeEventListener("click", Kt, !0), document.removeEventListener("mousemove", He), document.removeEventListener("mouseup", nt), (a = ee.value) == null || a.removeEventListener("webglcontextlost", jt), (c = ee.value) == null || c.removeEventListener("webglcontextrestored", qt), dt == null || dt.disconnect(), vt == null || vt.disconnect(), window.removeEventListener("resize", at), (b = window.visualViewport) == null || b.removeEventListener("resize", at), cancelAnimationFrame(Ct), ue == null || ue.dispose();
    });
    const Re = ne(() => ct[e.theme] ?? ct.none), Mn = ne(() => ({
      position: "absolute",
      left: `${g.value.x}px`,
      top: `${g.value.y}px`,
      zIndex: 100,
      background: Re.value.headerBg,
      border: `1px solid ${Re.value.accent}`,
      color: Re.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Sn = ne(() => ({
      background: Re.value.bg,
      border: `1px solid ${Re.value.border}`,
      color: Re.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Tn = ne(() => ({
      background: Re.value.headerBg,
      borderTop: `1px solid ${Re.value.border}`,
      color: Re.value.text
    })), Cn = ne(() => ({
      background: Re.value.bg
    })), Zt = ne(() => Re.value.accent);
    return (a, c) => {
      var b, I;
      return pe(), we("div", {
        ref_key: "wrapEl",
        ref: Ie,
        class: "cathode-wrap",
        style: Fe(Cn.value)
      }, [
        re("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Oe(_e, ["prevent"]),
          onMousemove: ot,
          onMouseleave: qe,
          onMousedown: mn,
          onClick: gn,
          onKeydown: wn,
          onTouchstartPassive: ut,
          onTouchmove: lt,
          onTouchend: Ne,
          onTouchcancel: Ne
        }, null, 544),
        L.value ? (pe(), we("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Fe(Mn.value),
          onClick: c[0] || (c[0] = Oe(() => {
          }, ["stop"]))
        }, [
          re("input", {
            style: Fe(Sn.value),
            value: k.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: bn,
            onKeydown: kn(Gt, ["escape"])
          }, null, 44, Xn),
          k.value ? (pe(), we("button", {
            key: 0,
            style: Fe({
              background: "none",
              border: "none",
              color: Re.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Gt
          }, "✕", 4)) : We("", !0)
        ], 4)) : We("", !0),
        t.pagination ? (pe(), we("div", {
          key: 1,
          class: "cathode-pagination",
          style: Fe(Tn.value)
        }, [
          re("button", {
            disabled: w.value <= 0,
            onClick: c[1] || (c[1] = (T) => te())
          }, "◀", 8, Nn),
          re("span", null, Ye((B.value + 1).toLocaleString()) + "–" + Ye(Math.min($.value.length, V.value + 1).toLocaleString()) + " / " + Ye($.value.length.toLocaleString()), 1),
          re("button", {
            disabled: w.value >= U.value,
            onClick: c[2] || (c[2] = (T) => se())
          }, "▶", 8, On),
          re("span", {
            class: "cathode-page-info",
            style: Fe({ color: Zt.value })
          }, Ye($.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (pe(), we("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Fe({ color: Zt.value })
          }, Ye(((b = A.value[m.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((I = A.value[m.value.col]) == null ? void 0 : I.colId)) + " : " + Ye(_(A.value[m.value.col], $.value[m.value.row])), 5)) : We("", !0)
        ], 4)) : We("", !0)
      ], 4);
    };
  }
}), et = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, o] of n)
    e[l] = o;
  return e;
}, lo = /* @__PURE__ */ et(jn, [["__scopeId", "data-v-e37eed70"]]), bt = {
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
function qn(t, n) {
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
const Zn = 12, ye = 18, wt = 10, Ze = 6, Vt = `${Zn}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Jn(t, n, e) {
  if (e <= 0 || !n) return [n];
  const l = [];
  for (const o of n.split(`
`)) {
    if (!o) {
      l.push("");
      continue;
    }
    if (t.measureText(o).width <= e) {
      l.push(o);
      continue;
    }
    const i = o.split(/(\s+)/);
    let d = "";
    for (const f of i) {
      const s = d + f;
      if (t.measureText(s).width <= e)
        d = s;
      else if (d && (l.push(d.replace(/\s+$/, "")), d = ""), t.measureText(f).width > e) {
        let r = "";
        for (const u of f)
          t.measureText(r + u).width > e ? (r && l.push(r), r = u) : r += u;
        d = r;
      } else
        d = f.replace(/^\s+/, "");
    }
    d && l.push(d.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function fn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), o = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${o}`;
  }
  return t;
}
function Qn(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function el(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: o, wordWrap: i } = t, d = t.formatTs ?? fn;
  e.font = Vt;
  const f = [];
  for (let s = 0; s < n.length; s++) {
    const r = n[s], u = r.level ?? "info", h = o && r.ts != null ? d(r.ts) : "", p = i ? Jn(e, r.text, l) : r.text.split(`
`);
    for (let M = 0; M < p.length; M++)
      f.push({
        entryIdx: s,
        text: p[M],
        level: u,
        timestamp: M === 0 ? h : "",
        isFirstFrag: M === 0,
        widthPx: e.measureText(p[M]).width
      });
  }
  return f;
}
function nn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, i = bt[n.theme] ?? bt.none;
  e.clearRect(0, 0, l, o), e.fillStyle = i.bg, e.fillRect(0, 0, l, o), e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip(), e.font = Vt, e.textBaseline = "middle";
  const d = n.visualLines, f = wt - n.scrollX, s = (n.showTimestamps ? wt + n.timestampWidth : wt) - n.scrollX, r = Math.max(0, Math.floor((n.scrollY - Ze) / ye)), u = Math.min(d.length, Math.ceil((n.scrollY + o - Ze) / ye) + 1);
  for (let h = r; h < u; h++) {
    const p = d[h], M = Ze + h * ye - n.scrollY + ye / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let x = 1;
      for (; h + x < u && d[h + x].entryIdx === p.entryIdx; ) x++;
      e.fillRect(0, M - ye / 2, l, ye * x);
    }
    n.selectionStart >= 0 && h >= n.selectionStart && h <= n.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, M - ye / 2, l, ye)), h === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M - ye / 2, l, ye)), n.showTimestamps && p.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(p.timestamp, f, M), e.shadowBlur = 0);
    const w = qn(i, p.level);
    e.fillStyle = w, e.textAlign = "left", n.glow ? (e.shadowColor = w, e.shadowBlur = 14, e.fillText(p.text, s, M), e.shadowBlur = 7, e.fillText(p.text, s, M), e.shadowBlur = 3, e.fillText(p.text, s, M), e.shadowBlur = 0) : e.fillText(p.text, s, M);
  }
  e.restore();
}
function ln(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - Ze) / ye);
  return l < 0 || l >= e ? -1 : l;
}
function tl(t) {
  return Ze * 2 + t * ye;
}
const nl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ll = /* @__PURE__ */ Je({
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
    const e = t, l = z(null), o = z(null), i = { ...Me }, d = z(0), f = z(0), s = z(0), r = z(-1), u = z(!0), h = z(-1), p = z(-1), M = ne(() => {
      const y = e.entries ?? [];
      return e.maxLines > 0 && y.length > e.maxLines ? y.slice(y.length - e.maxLines) : y;
    }), w = ne(() => {
      if (!e.showTimestamps) return "";
      const y = e.formatTs ?? fn;
      let F = "00:00:00";
      for (const J of M.value) {
        if (J.ts == null) continue;
        const oe = y(J.ts);
        oe.length > F.length && (F = oe);
      }
      return F;
    }), x = z(0), v = z([]);
    function m() {
      if (!j) return;
      const y = j.getContext("2d");
      if (!y) return;
      y.font = Vt;
      const F = e.showTimestamps ? Qn(y, w.value) : 0;
      x.value = F;
      const J = Math.max(
        1,
        d.value - wt * 2 - F
      );
      v.value = el({
        entries: M.value,
        ctx: y,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const D = ne(() => tl(v.value.length)), L = ne(() => Math.max(0, D.value - f.value)), K = ne(() => {
      let y = 0;
      for (const F of v.value) F.widthPx > y && (y = F.widthPx);
      return wt * 2 + x.value + y;
    }), g = ne(() => Math.max(0, K.value - d.value)), k = z(0);
    N(L, () => {
      u.value ? s.value = L.value : s.value = Math.min(s.value, L.value);
    }), N(g, () => {
      k.value = Math.min(k.value, g.value);
    }), N(
      [M, d, () => e.showTimestamps, () => e.wordWrap, w],
      () => {
        m(), ze(_);
      },
      { deep: !1 }
    );
    let R = null, P = !1, A, Q, G, U, j;
    const B = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Yt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Wt}

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

    ${zt}

    gl_FragColor = color;
  }
`;
    function V() {
      if (!(!o.value || !l.value)) {
        j = document.createElement("canvas");
        try {
          R = new X.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          P = !0;
        }
        if (!P && !R.getContext() && (R.dispose(), R = null, P = !0), P) {
          Y();
          return;
        }
        R.setPixelRatio(1), R.setClearColor(0, 0), A = new X.Scene(), Q = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), U = new X.CanvasTexture(j), U.minFilter = X.LinearFilter, U.magFilter = X.LinearFilter, G = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: U },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Pt()
          },
          vertexShader: nl,
          fragmentShader: B,
          transparent: !0
        }), A.add(new X.Mesh(new X.PlaneGeometry(2, 2), G)), Y();
      }
    }
    function Y() {
      if (!l.value || !R && !P) return;
      const y = l.value.clientWidth, F = l.value.clientHeight;
      if (!y || !F) return;
      const J = j.width !== y || j.height !== F;
      J && (j.width = y, j.height = F, d.value = y, f.value = F, m(), R ? (J && U && (U.dispose(), U = new X.CanvasTexture(j), U.minFilter = X.LinearFilter, U.magFilter = X.LinearFilter, G && (G.uniforms.uTex.value = U)), R.setPixelRatio(window.devicePixelRatio || 1), R.setSize(y, F)) : o.value && (o.value.width = y, o.value.height = F, o.value.style.width = y + "px", o.value.style.height = F + "px"), u.value && (s.value = Math.max(0, D.value - f.value)), _());
    }
    function _() {
      if (!(j != null && j.width)) return;
      if (P) {
        if (!o.value) return;
        nn(j, {
          visualLines: v.value,
          scrollY: s.value,
          scrollX: k.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: x.value,
          hoveredLine: r.value,
          selectionStart: Math.min(h.value, p.value),
          selectionEnd: Math.max(h.value, p.value)
        });
        const F = o.value.getContext("2d");
        F && F.drawImage(j, 0, 0);
        return;
      }
      if (!R || !G || !U) return;
      const y = e.theme === "paper";
      G.uniforms.uStrength.value = e.curvature / 45 * 0.55, G.uniforms.uScanlines.value = e.scanlines && !y ? 1 : 0, G.uniforms.uVignette.value = y ? 0 : 1, Ht(G, e.magnify, i, j.width, j.height), nn(j, {
        visualLines: v.value,
        scrollY: s.value,
        scrollX: k.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: x.value,
        hoveredLine: r.value,
        selectionStart: Math.min(h.value, p.value),
        selectionEnd: Math.max(h.value, p.value)
      }), U.needsUpdate = !0, R.render(A, Q);
    }
    N(() => e.theme, () => _()), N(() => e.curvature, () => _()), N(() => e.scanlines, () => _()), N(() => e.glow, () => _()), N(() => e.magnify, (y) => {
      y || (i.x = Me.x, i.y = Me.y), _();
    }), N(s, () => _()), N(k, () => _()), N(r, () => _()), N([h, p], () => _());
    function O(y) {
      if (!o.value) return [-1, -1];
      const F = o.value.getBoundingClientRect();
      return [y.clientX - F.left, y.clientY - F.top];
    }
    function $(y) {
      s.value = Math.max(0, Math.min(L.value, y)), u.value = s.value >= L.value - 4;
    }
    function S(y) {
      k.value = Math.max(0, Math.min(g.value, y));
    }
    function q(y) {
      y.shiftKey ? S(k.value + y.deltaY) : Math.abs(y.deltaX) > Math.abs(y.deltaY) ? S(k.value + y.deltaX) : $(s.value + y.deltaY);
    }
    let te = !1, se = 0, ie = 0, fe = 0, ae = 0, ce = !1;
    function ke(y) {
      te = !0, ce = !1, se = y.clientX, ie = y.clientY, fe = k.value, ae = s.value, l.value && l.value.focus();
    }
    function xe(y) {
      if (te) {
        const F = se - y.clientX, J = ie - y.clientY;
        (Math.abs(F) > 4 || Math.abs(J) > 4) && (ce = !0), S(fe + F), $(ae + J);
      }
    }
    function De() {
      te && (te = !1, ce && (ce = !1));
    }
    function C(y) {
      if (y.touches.length !== 1) return;
      const F = y.touches[0];
      te = !0, ce = !1, se = F.clientX, ie = F.clientY, fe = k.value, ae = s.value, l.value && l.value.focus();
    }
    function H(y) {
      if (!te || y.touches.length !== 1) return;
      y.preventDefault();
      const F = y.touches[0], J = se - F.clientX, oe = ie - F.clientY;
      (Math.abs(J) > 4 || Math.abs(oe) > 4) && (ce = !0), S(fe + J), $(ae + oe);
    }
    function le() {
      te && (te = !1, ce && (ce = !1));
    }
    function ve(y) {
      const [, F] = O(y);
      return F < 0 ? -1 : ln(F, s.value, v.value.length);
    }
    function Se(y) {
      if (ce) {
        ce = !1;
        return;
      }
      const F = ve(y);
      if (F < 0) {
        h.value = -1, p.value = -1;
        return;
      }
      y.shiftKey && h.value >= 0 || (h.value = F), p.value = F;
    }
    function He(y, F) {
      const J = v.value.length;
      if (J === 0) return;
      const oe = p.value < 0 ? 0 : p.value;
      let Ee = Math.max(0, Math.min(J - 1, oe + y));
      p.value = Ee, (!F || h.value < 0) && (h.value = Ee), r.value = Ee;
      const Le = Ze + Ee * ye, _e = Le + ye;
      Le < s.value ? $(Le) : _e > s.value + f.value && $(_e - f.value);
    }
    function nt() {
      const y = Math.min(h.value, p.value), F = Math.max(h.value, p.value);
      if (y < 0) return "";
      const J = v.value, oe = /* @__PURE__ */ new Set(), Ee = [];
      for (let Le = y; Le <= F && Le < J.length; Le++) {
        const _e = J[Le];
        if (oe.has(_e.entryIdx)) continue;
        oe.add(_e.entryIdx);
        let ot = "";
        for (let qe = 0; qe < J.length; qe++)
          J[qe].entryIdx === _e.entryIdx && (ot += (ot && !J[qe].isFirstFrag ? " " : "") + J[qe].text);
        Ee.push(_e.timestamp ? `${_e.timestamp}  ${ot}` : ot);
      }
      return Ee.join(`
`);
    }
    async function ut() {
      const y = nt();
      if (y)
        try {
          await navigator.clipboard.writeText(y);
        } catch {
          const F = document.createElement("textarea");
          F.value = y, F.style.position = "fixed", F.style.opacity = "0", document.body.appendChild(F), F.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(F);
        }
    }
    function lt(y) {
      if ((y.metaKey || y.ctrlKey) && (y.key === "c" || y.key === "C")) {
        h.value >= 0 && (y.preventDefault(), ut());
        return;
      }
      if ((y.metaKey || y.ctrlKey) && (y.key === "a" || y.key === "A")) {
        y.preventDefault(), h.value = 0, p.value = v.value.length - 1;
        return;
      }
      switch (y.key) {
        case "ArrowDown":
          y.preventDefault(), He(1, y.shiftKey);
          break;
        case "ArrowUp":
          y.preventDefault(), He(-1, y.shiftKey);
          break;
        case "ArrowRight":
          y.preventDefault(), S(k.value + ye * 2);
          break;
        case "ArrowLeft":
          y.preventDefault(), S(k.value - ye * 2);
          break;
        case "PageDown":
          y.preventDefault(), $(s.value + f.value);
          break;
        case "PageUp":
          y.preventDefault(), $(s.value - f.value);
          break;
        case "Home":
          y.preventDefault(), $(0), S(0);
          break;
        case "End":
          y.preventDefault(), $(L.value);
          break;
        case "Escape":
          h.value = -1, p.value = -1;
          break;
      }
    }
    function Ne(y) {
      if (e.magnify && o.value) {
        const J = $t(y, o.value);
        i.x = J.x, i.y = J.y, _();
      }
      const [, F] = O(y);
      if (F < 0) {
        r.value = -1;
        return;
      }
      r.value = ln(F, s.value, v.value.length);
    }
    function Ie() {
      r.value = -1, i.x = Me.x, i.y = Me.y, _();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, s.value = L.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        $(Ze + y * ye);
      }
    });
    let ee = null, $e = null, ue = 0;
    const Ve = Tt("cathodeResetTick", z(0));
    N(Ve, () => Be());
    function Be() {
      cancelAnimationFrame(ue), ue = requestAnimationFrame(Y);
    }
    function ft(y) {
      y.preventDefault();
    }
    function Ce() {
      R == null || R.dispose(), R = null, P = !1, V();
    }
    Ge(() => {
      document.addEventListener("mousemove", xe), document.addEventListener("mouseup", De), ze(() => {
        var y;
        V(), o.value && (o.value.addEventListener("webglcontextlost", ft), o.value.addEventListener("webglcontextrestored", Ce)), l.value && (ee = new ResizeObserver(() => Y()), ee.observe(l.value), $e = new IntersectionObserver((F) => {
          F.some((J) => J.isIntersecting) && Be();
        }), $e.observe(l.value)), window.addEventListener("resize", Be), (y = window.visualViewport) == null || y.addEventListener("resize", Be), s.value = L.value;
      });
    }), Qe(() => {
      var y, F, J;
      document.removeEventListener("mousemove", xe), document.removeEventListener("mouseup", De), (y = o.value) == null || y.removeEventListener("webglcontextlost", ft), (F = o.value) == null || F.removeEventListener("webglcontextrestored", Ce), ee == null || ee.disconnect(), $e == null || $e.disconnect(), window.removeEventListener("resize", Be), (J = window.visualViewport) == null || J.removeEventListener("resize", Be), cancelAnimationFrame(ue), R == null || R.dispose();
    });
    const Te = ne(() => bt[e.theme] ?? bt.none), he = ne(() => ({
      background: Te.value.bg
    }));
    return (y, F) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Fe(he.value),
      tabindex: "0",
      onKeydown: lt
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-log-canvas",
        onWheel: Oe(q, ["prevent"]),
        onMousemove: Ne,
        onMouseleave: Ie,
        onMousedown: ke,
        onClick: Se,
        onTouchstartPassive: C,
        onTouchmove: H,
        onTouchend: le,
        onTouchcancel: le
      }, null, 544)
    ], 36));
  }
}), ol = /* @__PURE__ */ et(ll, [["__scopeId", "data-v-96a56f90"]]), al = ["disabled"], il = /* @__PURE__ */ Je({
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
    const l = t, o = e, i = z(null), d = z(null), f = z(""), s = z([]), r = z(-1);
    let u = "";
    function h(g) {
      g.trim() && (s.value.length && s.value[s.value.length - 1] === g || (s.value.push(g), s.value.length > l.historyLimit && s.value.splice(0, s.value.length - l.historyLimit)));
    }
    function p(g) {
      if (!l.disabled) {
        if (g.key === "Enter") {
          g.preventDefault();
          const k = f.value;
          k.trim() && h(k), r.value = -1, f.value = "", o("submit", k);
          return;
        }
        if (g.key === "ArrowUp") {
          if (!s.value.length) return;
          g.preventDefault(), r.value === -1 ? (u = f.value, r.value = s.value.length - 1) : r.value > 0 && r.value--, f.value = s.value[r.value];
          return;
        }
        if (g.key === "ArrowDown") {
          if (r.value === -1) return;
          g.preventDefault(), r.value < s.value.length - 1 ? (r.value++, f.value = s.value[r.value]) : (r.value = -1, f.value = u, u = "");
          return;
        }
      }
    }
    const M = z(!0);
    let w = null;
    function x() {
      w || (w = setInterval(() => {
        M.value = !M.value;
      }, 530));
    }
    function v() {
      w && (clearInterval(w), w = null), M.value = !0;
    }
    const m = ne(() => {
      let g;
      return l.disabled ? g = " " : l.busy ? g = "█" : g = M.value ? "█" : " ", { level: "info", text: `${l.prompt}${f.value}${g}` };
    }), D = ne(
      () => [...l.entries, m.value]
    );
    function L() {
      var g;
      l.disabled || (g = d.value) == null || g.focus();
    }
    N(() => l.busy, (g, k) => {
      k && !g && !l.disabled && ze(() => {
        var R;
        return (R = d.value) == null ? void 0 : R.focus();
      });
    });
    function K() {
      var g;
      (g = d.value) == null || g.focus();
    }
    return n({ focus: K }), Ge(() => {
      x(), l.disabled || requestAnimationFrame(() => {
        var g;
        return (g = d.value) == null ? void 0 : g.focus();
      });
    }), Qe(() => {
      v();
    }), (g, k) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: L
    }, [
      sn(ol, {
        entries: D.value,
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
      cn(re("input", {
        ref_key: "inputEl",
        ref: d,
        "onUpdate:modelValue": k[0] || (k[0] = (R) => f.value = R),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: p
      }, null, 40, al), [
        [In, f.value]
      ])
    ], 512));
  }
}), oo = /* @__PURE__ */ et(il, [["__scopeId", "data-v-a2b39934"]]), xt = {
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
}, rl = 0.18, pt = 8, Xt = 22, sl = 4, Pe = 8, Ke = 56, Nt = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", cl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Dt = 4, ul = 1, fl = 1;
function dl(t, n, e, l = 0, o = !1) {
  const i = o ? Nt : Ke, d = Math.max(0, n - Pe - i), f = Math.max(1, Math.floor(d / e)), s = Math.min(f, t);
  return { firstIdx: Math.max(0, t - s - Math.floor(l / e)), count: s, slotW: e };
}
function vl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, o = -1 / 0, i = 0;
  const d = Math.min(t.length, n + e);
  for (let s = n; s < d; s++) {
    const r = t[s];
    r && (r.low < l && (l = r.low), r.high > o && (o = r.high), r.volume > i && (i = r.volume));
  }
  if (!isFinite(l) || !isFinite(o) || l === o) {
    const s = isFinite(l) ? l : 0;
    return { min: s - 1, max: s + 1, maxVol: Math.max(1, i) };
  }
  const f = (o - l) * 0.04;
  return { min: l - f, max: o + f, maxVol: Math.max(1, i) };
}
function hl(t, n, e = !1) {
  const l = e ? sl : Xt, o = Math.max(1, t - pt - l - Dt), i = Math.max(0, Math.round(o * n)), d = o - i;
  return {
    priceY0: pt,
    priceY1: pt + d,
    volumeY0: pt + d + Dt,
    volumeY1: pt + d + Dt + i
  };
}
function Ae(t, n, e, l) {
  const o = n.max - n.min;
  return o <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / o) * (l - e);
}
function je(t, n, e) {
  return Pe + (t - n + 0.5) * e;
}
function Ue(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function Ot(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), o = String(n.getHours()).padStart(2, "0"), i = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${o}:${i}`;
}
function ml(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), o = e / l;
  let i;
  return o < 1.5 ? i = 1 : o < 3 ? i = 2 : o < 7 ? i = 5 : i = 10, i * l;
}
function on(t, n) {
  var M, w, x, v, m;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, i = xt[n.theme] ?? xt.none, d = n.colors ? { ...i, ...n.colors } : i, f = !!n.compact;
  if (e.clearRect(0, 0, l, o), e.fillStyle = d.bg, e.fillRect(0, 0, l, o), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip();
  const s = dl(n.candles.length, l, n.slotW, n.scrollX, f), r = vl(n.candles, s.firstIdx, s.count), u = hl(o, n.showVolume ? n.volumeFraction : 0, f), h = Math.max(ul, Math.floor(n.slotW * 0.7)), p = Math.min(n.candles.length, s.firstIdx + s.count);
  for (let D = s.firstIdx; D < p; D++) {
    const L = n.candles[D];
    if (!L) continue;
    const K = je(D, s.firstIdx, n.slotW), g = Ae(L.open, r, u.priceY0, u.priceY1), k = Ae(L.close, r, u.priceY0, u.priceY1), R = Ae(L.high, r, u.priceY0, u.priceY1), P = Ae(L.low, r, u.priceY0, u.priceY1), A = L.close >= L.open, Q = A ? d.wickBull : d.wickBear, G = A ? d.candleBull : d.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = G), e.strokeStyle = Q, e.lineWidth = fl, e.beginPath(), e.moveTo(Math.round(K) + 0.5, R), e.lineTo(Math.round(K) + 0.5, P), e.stroke(), e.fillStyle = G;
    const U = Math.min(g, k), j = Math.max(1, Math.abs(k - g)), B = Math.round(K - h / 2), V = Math.round(U), Y = Math.round(j);
    if (e.fillRect(B, V, h, Y), n.glow && (e.shadowBlur = 4, e.fillRect(B, V, h, Y)), e.shadowBlur = 0, n.showVolume && r.maxVol > 0) {
      const _ = Math.round(L.volume / r.maxVol * (u.volumeY1 - u.volumeY0));
      _ > 0 && (e.fillStyle = A ? d.volumeBull : d.volumeBear, e.fillRect(
        Math.round(K - h / 2),
        u.volumeY1 - _,
        h,
        _
      ));
    }
  }
  if ((M = n.overlays) != null && M.length)
    for (const D of n.overlays)
      D.kind === "hline" ? pl(e, D, l, r, u, d, f) : gl(e, D, s, r, u, n.slotW);
  (w = n.markers) != null && w.length && Cl(e, d, n.markers, n.candles, s, r, u, n.slotW), kl(e, d, r, u, l, f), f || (Il(e, d, n.candles, s, n.slotW, o), Sl(e, d, n.candles, l, o)), (x = n.overlays) != null && x.length && yl(e, d, n.overlays, u), n.hover && (Ll(e, d, n.candles, s, r, u, n.slotW, n.hover, l), bl(e, d, n.candles, s, n.slotW, n.hover, u, ((v = n.overlays) == null ? void 0 : v.length) ?? 0), (m = n.markers) != null && m.length && Ml(e, d, n.markers, n.candles, s, r, u, n.slotW, n.hover, l)), e.restore();
}
function gl(t, n, e, l, o, i) {
  var f;
  const d = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Pe,
    o.priceY0,
    /* width: */
    999999,
    o.priceY1 - o.priceY0
  ), t.clip(), n.kind === "line")
    yt(t, n.data, e.firstIdx, d, i, l, o, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const s = dn(n.color, n.fillAlpha ?? 0.08);
    wl(t, n.upper, n.lower, e.firstIdx, d, i, l, o, s), yt(t, n.upper, e.firstIdx, d, i, l, o, n.color, 1, !1), yt(t, n.lower, e.firstIdx, d, i, l, o, n.color, 1, !1), (f = n.middle) != null && f.length && yt(t, n.middle, e.firstIdx, d, i, l, o, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function pl(t, n, e, l, o, i, d) {
  const f = Ae(n.price, l, o.priceY0, o.priceY1);
  if (f < o.priceY0 - 0.5 || f > o.priceY1 + 0.5) return;
  const s = d ? Nt : Ke, r = Math.round(f) + 0.5;
  t.save(), t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Pe, r), t.lineTo(e - s, r), t.stroke(), t.setLineDash([]);
  const u = n.label ?? Ue(n.price);
  if (u !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const h = t.measureText(u).width, p = 4, M = 2;
    t.fillStyle = n.color, t.fillRect(e - s + 2, f - 7 - M, h + p * 2, 14 + M * 2), t.fillStyle = i.bg && !i.bg.startsWith("rgba(0,0,0,0)") ? i.bg : "#0d1520", t.fillText(u, e - s + 2 + p, f);
  }
  t.restore();
}
function yt(t, n, e, l, o, i, d, f, s, r) {
  if (!n || !n.length) return;
  t.strokeStyle = f, t.lineWidth = s, t.setLineDash(r ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < l; h++) {
    const p = n[h];
    if (typeof p != "number" || !isFinite(p)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const M = je(h, e, o), w = Ae(p, i, d.priceY0, d.priceY1);
    u ? t.lineTo(M, w) : (t.moveTo(M, w), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function wl(t, n, e, l, o, i, d, f, s) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = s;
  let r = !1, u = -1;
  for (let h = l; h <= o; h++) {
    const p = n[h], M = e[h], w = h < o && typeof p == "number" && typeof M == "number" && isFinite(p) && isFinite(M);
    if (w && !r && (u = h, r = !0), !w && r || h === o && r) {
      const x = w ? h + 1 : h;
      t.beginPath();
      for (let v = u; v < x; v++) {
        const m = je(v, l, i), D = Ae(n[v], d, f.priceY0, f.priceY1);
        v === u ? t.moveTo(m, D) : t.lineTo(m, D);
      }
      for (let v = x - 1; v >= u; v--) {
        const m = je(v, l, i), D = Ae(e[v], d, f.priceY0, f.priceY1);
        t.lineTo(m, D);
      }
      t.closePath(), t.fill(), r = !1;
    }
  }
}
function dn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), o = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${o},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function yl(t, n, e, l) {
  const o = e.filter((x) => x.kind !== "hline" && !!x.label);
  if (!o.length) return;
  t.save(), t.font = Xe;
  const i = 8, d = 5, f = 12, s = 6, r = 14;
  let u = 0;
  for (const x of o) {
    const v = t.measureText(x.label).width;
    v > u && (u = v);
  }
  const h = i * 2 + f + s + u, p = d * 2 + r * o.length, M = Pe + 4, w = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(M, w, h, p), t.textBaseline = "middle", t.textAlign = "left";
  for (let x = 0; x < o.length; x++) {
    const v = o[x], m = w + d + r * (x + 0.5), D = M + i;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(D, m), t.lineTo(D + f, m), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = dn(v.color, v.fillAlpha ?? 0.2), t.fillRect(D, m - 4, f, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(D + 0.5, m - 4 + 0.5, f - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, D + f + s, m);
  }
  t.restore();
}
function bl(t, n, e, l, o, i, d, f) {
  const s = Math.floor((i.x - Pe) / o), r = l.firstIdx + s;
  if (r < 0 || r >= e.length) return;
  const u = e[r];
  if (!u) return;
  const h = u.close - u.open, p = u.open !== 0 ? h / u.open * 100 : 0, M = h >= 0 ? "+" : "", w = [
    ["O", Ue(u.open), void 0],
    ["H", Ue(u.high), void 0],
    ["L", Ue(u.low), void 0],
    ["C", Ue(u.close), void 0],
    ["V", xl(u.volume), void 0],
    ["", `${M}${p.toFixed(2)}%`, h >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const x = 8, v = 4, m = 14;
  let D = x;
  for (const [k, R] of w) {
    const P = k ? `${k} ${R}` : R, A = t.measureText(P).width + 12;
    D += A;
  }
  D += x - 12;
  const L = d.priceY0 + 4 + (f > 0 ? v * 2 + 14 * f + 4 : 0), K = Pe + 4;
  t.fillStyle = n.panelBg, t.fillRect(K, L, D, m + v * 2);
  let g = K + x;
  for (let k = 0; k < w.length; k++) {
    const [R, P, A] = w[k];
    t.fillStyle = n.text, R && (t.globalAlpha = 0.6, t.fillText(R + " ", g, L + v + m / 2), t.globalAlpha = 1, g += t.measureText(R + " ").width), A && (t.fillStyle = A), t.fillText(P, g, L + v + m / 2), g += t.measureText(P).width + 12;
  }
  t.restore();
}
function xl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Ml(t, n, e, l, o, i, d, f, s, r) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, h = Math.max(1, u * 0.5), p = Math.min(l.length, o.firstIdx + o.count), M = 9;
  let w = null;
  for (const P of e) {
    let A = 0, Q = l.length - 1, G = -1;
    for (; A <= Q; ) {
      const B = A + Q >> 1, V = l[B].start - P.timestamp;
      if (Math.abs(V) <= h) {
        G = B;
        break;
      }
      V < 0 ? A = B + 1 : Q = B - 1;
    }
    if (G < 0 || G < o.firstIdx || G >= p) continue;
    const U = je(G, o.firstIdx, f), j = Ae(P.price, i, d.priceY0, d.priceY1);
    if (Math.abs(s.x - U) <= M && Math.abs(s.y - j) <= M) {
      w = { m: P, x: U, y: j };
      break;
    }
  }
  if (!w) return;
  const x = Ot(w.m.timestamp), v = [
    `${w.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${x}`,
    `@ ${Ue(w.m.price)}`
  ];
  w.m.label && v.push(w.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const m = 6, D = 14;
  let L = 0;
  for (const P of v) {
    const A = t.measureText(P).width;
    A > L && (L = A);
  }
  const K = L + m * 2, g = v.length * D + m * 2;
  let k = w.x + 12;
  k + K > r - Ke && (k = w.x - 12 - K);
  let R = w.y - g / 2;
  R < d.priceY0 && (R = d.priceY0), R + g > d.priceY1 && (R = d.priceY1 - g), t.fillStyle = n.panelBgSolid, t.strokeStyle = w.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(k, R, K, g), t.strokeRect(k + 0.5, R + 0.5, K - 1, g - 1);
  for (let P = 0; P < v.length; P++) {
    const A = v[P];
    t.fillStyle = P === 0 ? w.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(A, k + m, R + m + P * D);
  }
  t.restore();
}
function Sl(t, n, e, l, o) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, d = Tl(i);
  if (!d) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const f = 6, s = 3, r = t.measureText(d).width, u = l - Ke - f, h = o - Xt + 4;
  t.fillStyle = n.accent, t.fillRect(u - r - f, h - s, r + f * 2, 14 + s * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(d, u, h), t.restore();
}
function Tl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, o = 24 * l, i = 7 * o;
  return t >= i && t % i === 0 ? t / i + "W" : t >= o && t % o === 0 ? t / o + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function Cl(t, n, e, l, o, i, d, f) {
  if (!l.length) return;
  const s = l.length > 1 ? l[1].start - l[0].start : 6e4, r = Math.max(1, s * 0.5), u = Math.min(l.length, o.firstIdx + o.count), h = (M) => {
    let w = 0, x = l.length - 1;
    for (; w <= x; ) {
      const v = w + x >> 1, m = l[v].start - M;
      if (Math.abs(m) <= r) return v;
      m < 0 ? w = v + 1 : x = v - 1;
    }
    return -1;
  }, p = 7;
  for (const M of e) {
    const w = h(M.timestamp);
    if (w < 0 || w < o.firstIdx || w >= u) continue;
    const x = je(w, o.firstIdx, f), v = Ae(M.price, i, d.priceY0, d.priceY1);
    if (v < d.priceY0 || v > d.priceY1) continue;
    const m = M.color ?? (M.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = m, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), M.kind === "entry" ? (t.moveTo(x, v - p), t.lineTo(x - p, v + p - 1), t.lineTo(x + p, v + p - 1)) : (t.moveTo(x, v + p), t.lineTo(x - p, v - p + 1), t.lineTo(x + p, v - p + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function kl(t, n, e, l, o, i = !1) {
  const d = e.max - e.min;
  if (d <= 0) return;
  const f = l.priceY1 - l.priceY0, s = i ? Math.max(2, Math.min(4, Math.round(f / 36))) : 6, r = ml(d, s), u = Math.ceil(e.min / r) * r, h = i ? Nt : Ke;
  t.font = i ? cl : Xe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let p = u; p <= e.max; p += r) {
    const M = Ae(p, e, l.priceY0, l.priceY1);
    M < l.priceY0 || M > l.priceY1 || (t.beginPath(), t.moveTo(Pe, Math.round(M) + 0.5), t.lineTo(o - h, Math.round(M) + 0.5), t.stroke(), t.fillText(Ue(p), o - h + 3, M));
  }
  t.globalAlpha = 1;
}
function Il(t, n, e, l, o, i) {
  if (l.count <= 0 || !e.length) return;
  const f = Math.max(1, Math.floor(l.count / 6));
  t.font = Xe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const s = Math.min(e.length, l.firstIdx + l.count);
  for (let r = l.firstIdx; r < s; r += f) {
    const u = e[r];
    if (!u) continue;
    const h = je(r, l.firstIdx, o);
    t.fillText(Ot(u.start), h, i - Xt + 4);
  }
  t.globalAlpha = 1;
}
function Ll(t, n, e, l, o, i, d, f, s) {
  const r = Math.floor((f.x - Pe) / d), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + r)), h = e[u];
  if (!h) return;
  const p = je(u, l.firstIdx, d);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(p) + 0.5, i.priceY0), t.lineTo(Math.round(p) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const M = Math.max(i.priceY0, Math.min(i.priceY1, f.y));
  t.beginPath(), t.moveTo(Pe, Math.round(M) + 0.5), t.lineTo(s - Ke, Math.round(M) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const w = o.max - o.min;
  if (w > 0) {
    const m = o.max - (M - i.priceY0) / (i.priceY1 - i.priceY0) * w, D = Ue(m);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const L = t.measureText(D).width, K = 4, g = 2;
    t.fillStyle = n.accent, t.fillRect(s - Ke + 2, M - 7 - g, L + K * 2, 14 + g * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(D, s - Ke + 2 + K, M);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const x = Ot(h.start), v = t.measureText(x).width;
  t.fillStyle = n.accent, t.fillRect(p - v / 2 - 4, i.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(x, p, i.volumeY1 + 4), t.restore();
}
const Et = 0.25, Ft = 6, Rl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Dl = /* @__PURE__ */ Je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: rl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = z(null), l = z(null), o = { ...Me }, i = z(0), d = z(0), f = z(0), s = z(1), r = z(null), u = ne(() => Math.max(1, n.slotW * s.value));
    let h = null, p = !1, M, w, x, v, m;
    const D = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Yt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Wt}

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

    ${zt}

    gl_FragColor = color;
  }
`;
    function L() {
      if (!(!l.value || !e.value)) {
        if (m = document.createElement("canvas"), n.flat) {
          p = !0, K();
          return;
        }
        try {
          h = new X.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          p = !0;
        }
        if (!p && !h.getContext() && (h.dispose(), h = null, p = !0), p) {
          K();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), M = new X.Scene(), w = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new X.CanvasTexture(m), v.minFilter = X.LinearFilter, v.magFilter = X.LinearFilter, x = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Pt()
          },
          vertexShader: Rl,
          fragmentShader: D,
          transparent: !0
        }), M.add(new X.Mesh(new X.PlaneGeometry(2, 2), x)), K();
      }
    }
    function K() {
      if (!e.value || !h && !p) return;
      const C = e.value.clientWidth, H = e.value.clientHeight;
      !C || !H || !(m.width !== C || m.height !== H) || (m.width = C, m.height = H, i.value = C, d.value = H, h ? (v && (v.dispose(), v = new X.CanvasTexture(m), v.minFilter = X.LinearFilter, v.magFilter = X.LinearFilter, x && (x.uniforms.uTex.value = v)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(C, H)) : l.value && (l.value.width = C, l.value.height = H, l.value.style.width = C + "px", l.value.style.height = H + "px"), g());
    }
    function g() {
      if (!(m != null && m.width)) return;
      if (p) {
        if (!l.value) return;
        on(m, {
          candles: n.candles,
          slotW: u.value,
          scrollX: f.value,
          theme: n.theme,
          glow: !1,
          showVolume: n.showVolume,
          volumeFraction: n.volumeFraction,
          hover: r.value,
          overlays: n.overlays,
          markers: n.markers,
          compact: n.compact,
          colors: n.colors
        });
        const H = l.value.getContext("2d");
        H && (H.clearRect(0, 0, l.value.width, l.value.height), H.drawImage(m, 0, 0));
        return;
      }
      if (!h || !x || !v) return;
      const C = n.theme === "paper";
      x.uniforms.uStrength.value = n.curvature / 45 * 0.55, x.uniforms.uScanlines.value = n.scanlines && !C ? 1 : 0, x.uniforms.uVignette.value = C ? 0 : 1, Ht(x, n.magnify, o, m.width, m.height), on(m, {
        candles: n.candles,
        slotW: u.value,
        scrollX: f.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: r.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), v.needsUpdate = !0, h.render(M, w);
    }
    N(() => n.theme, () => g()), N(() => n.curvature, () => g()), N(() => n.scanlines, () => g()), N(() => n.glow, () => g()), N(() => n.showVolume, () => g()), N(() => n.volumeFraction, () => g()), N(() => n.slotW, () => g()), N(() => n.candles, () => g(), { deep: !1 }), N(() => n.overlays, () => g(), { deep: !1 }), N(() => n.markers, () => g(), { deep: !1 }), N(() => n.compact, () => g()), N(() => n.magnify, (C) => {
      C || (o.x = Me.x, o.y = Me.y), g();
    }), N(() => n.colors, () => g(), { deep: !0 }), N(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), N(f, () => g()), N(s, () => g()), N(r, () => g()), N(u, () => g());
    let k = null, R = null, P = 0;
    const A = Tt("cathodeResetTick", z(0));
    N(A, () => Q());
    function Q() {
      cancelAnimationFrame(P), P = requestAnimationFrame(K);
    }
    function G(C) {
      C.preventDefault();
    }
    function U() {
      h == null || h.dispose(), h = null, p = !1, L();
    }
    function j(C) {
      if (!l.value) return [-1, -1];
      const H = l.value.getBoundingClientRect();
      return [C.clientX - H.left, C.clientY - H.top];
    }
    function B(C) {
      var He;
      const H = u.value;
      if (H <= 0) return 0;
      const le = ((He = n.candles) == null ? void 0 : He.length) ?? 0, ve = Math.max(1, Math.floor((i.value || 1) / H)), Se = Math.max(0, le - ve);
      return Math.max(0, Math.min(C, Se * H));
    }
    function V(C) {
      var ve;
      if (C.deltaX !== 0 || C.shiftKey && C.deltaY !== 0) {
        const Se = C.deltaX !== 0 ? C.deltaX : C.deltaY;
        f.value = B(f.value + Se);
        return;
      }
      if (C.deltaY === 0) return;
      const [H] = j(C), le = u.value;
      if (H >= 0 && le > 0 && ((ve = n.candles) != null && ve.length)) {
        const Se = Math.max(1, Math.floor((i.value || 1) / le)), nt = Math.max(0, n.candles.length - Se - Math.floor(f.value / le)) + (H - 8) / le, ut = Math.exp(-C.deltaY * 15e-4), lt = Math.max(Et, Math.min(Ft, s.value * ut));
        s.value = lt;
        const Ne = n.slotW * lt, Ie = Math.max(1, Math.floor((i.value || 1) / Ne)), ee = nt - (H - 8) / Ne, $e = Math.max(0, n.candles.length - Ie - ee);
        f.value = B($e * Ne);
      } else {
        const Se = Math.exp(-C.deltaY * 15e-4);
        s.value = Math.max(Et, Math.min(Ft, s.value * Se));
      }
    }
    let Y = !1, _ = 0, O = 0;
    function $(C) {
      C.button === 0 && (Y = !0, _ = C.clientX, O = f.value, r.value = null, e.value && e.value.focus());
    }
    function S(C) {
      const H = Math.exp(C * 0.18);
      s.value = Math.max(Et, Math.min(Ft, s.value * H)), f.value = B(f.value);
    }
    function q(C) {
      const H = u.value, le = C.shiftKey ? 20 : 3;
      switch (C.key) {
        case "ArrowLeft":
          C.preventDefault(), f.value = B(f.value + H * le);
          break;
        case "ArrowRight":
          C.preventDefault(), f.value = B(f.value - H * le);
          break;
        case "ArrowUp":
          C.preventDefault(), S(1);
          break;
        case "ArrowDown":
          C.preventDefault(), S(-1);
          break;
        case "Home":
          C.preventDefault(), f.value = B(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          C.preventDefault(), f.value = 0;
          break;
      }
    }
    function te(C) {
      if (Y) {
        const H = C.clientX - _;
        f.value = B(O + H);
        return;
      }
    }
    function se() {
      Y = !1;
    }
    function ie(C) {
      if (C.touches.length !== 1) return;
      const H = C.touches[0];
      Y = !0, _ = H.clientX, O = f.value, r.value = null;
    }
    function fe(C) {
      if (!Y || C.touches.length !== 1) return;
      C.preventDefault();
      const le = C.touches[0].clientX - _;
      f.value = B(O + le);
    }
    function ae() {
      Y = !1;
    }
    function ce(C) {
      if (n.magnify && l.value) {
        const ve = $t(C, l.value);
        o.x = ve.x, o.y = ve.y, g();
      }
      if (Y) return;
      const [H, le] = j(C);
      if (H < 0 || le < 0) {
        r.value = null;
        return;
      }
      r.value = { x: H, y: le };
    }
    function ke() {
      r.value = null, o.x = Me.x, o.y = Me.y, g();
    }
    Ge(() => {
      document.addEventListener("mousemove", te), document.addEventListener("mouseup", se), ze(() => {
        var C;
        L(), l.value && (l.value.addEventListener("webglcontextlost", G), l.value.addEventListener("webglcontextrestored", U)), e.value && (k = new ResizeObserver(() => K()), k.observe(e.value), R = new IntersectionObserver((H) => {
          H.some((le) => le.isIntersecting) && Q();
        }), R.observe(e.value)), window.addEventListener("resize", Q), (C = window.visualViewport) == null || C.addEventListener("resize", Q);
      });
    }), Qe(() => {
      var C, H, le;
      document.removeEventListener("mousemove", te), document.removeEventListener("mouseup", se), (C = l.value) == null || C.removeEventListener("webglcontextlost", G), (H = l.value) == null || H.removeEventListener("webglcontextrestored", U), k == null || k.disconnect(), R == null || R.disconnect(), window.removeEventListener("resize", Q), (le = window.visualViewport) == null || le.removeEventListener("resize", Q), cancelAnimationFrame(P), h == null || h.dispose();
    });
    const xe = ne(() => xt[n.theme] ?? xt.none), De = ne(() => ({
      background: xe.value.bg
    }));
    return (C, H) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Fe(De.value),
      tabindex: "0",
      onKeydown: q
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: Oe(V, ["prevent"]),
        onMousedown: $,
        onMousemove: ce,
        onMouseleave: ke,
        onTouchstartPassive: ie,
        onTouchmove: fe,
        onTouchend: ae,
        onTouchcancel: ae
      }, null, 544)
    ], 36));
  }
}), ao = /* @__PURE__ */ et(Dl, [["__scopeId", "data-v-255bf71a"]]), Ut = z(0), Bt = 28, st = 12;
let _t = 10, Mt = "cathode.layout", St = !1;
const be = z({});
function El(t, n = "cathode.layout") {
  if (!St) {
    St = !0, Mt = n;
    try {
      const e = localStorage.getItem(Mt);
      if (e) {
        be.value = JSON.parse(e), an();
        return;
      }
    } catch {
    }
    be.value = { ...t }, an();
  }
}
function an() {
  let t = 10;
  for (const n of Object.values(be.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  _t = t;
}
function tt() {
  localStorage.setItem(Mt, JSON.stringify(be.value));
}
function Fl(t) {
  St = !1, localStorage.removeItem(Mt), be.value = { ...t }, tt(), St = !0, Ut.value++;
}
function vn(t) {
  _t++, be.value[t] && (be.value[t].zIndex = _t);
}
function Al(t, n) {
  be.value[t].visible = n, tt();
}
function Bl(t, n) {
  be.value[t].minimized = n, n && (be.value[t].maximized = !1), tt();
}
function _l(t, n) {
  be.value[t].maximized = n, n && (be.value[t].minimized = !1, vn(t)), tt();
}
function Yl(t, n, e) {
  be.value[t].x = Math.round(n), be.value[t].y = Math.round(e), tt();
}
function Wl(t, n, e) {
  be.value[t].w = Math.round(n), be.value[t].h = Math.round(e), tt();
}
function io(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), o = Math.ceil(e.length / l), i = Math.floor((t - st * (l + 1)) / l), d = Math.floor((n - st * (o + 1)) / o), f = {};
  return e.forEach((s, r) => {
    const u = r % l, h = Math.floor(r / l);
    f[s] = {
      x: st + u * (i + st),
      y: st + h * (d + st),
      w: i,
      h: d,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: r + 1
    };
  }), f;
}
function hn() {
  return {
    containers: be,
    TITLEBAR_H: Bt,
    load: El,
    save: tt,
    reset: Fl,
    bringToFront: vn,
    setVisible: Al,
    setMinimized: Bl,
    setMaximized: _l,
    updatePos: Yl,
    updateSize: Wl
  };
}
const zl = { class: "ws-toolbar" }, Pl = {
  key: 0,
  class: "ws-restore-menu"
}, Hl = {
  key: 0,
  class: "ws-restore-empty"
}, $l = ["onClick"], Vl = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: o, setVisible: i } = hn(), d = z(null);
    Jt("cathodeWorkspace", d), Jt("cathodeResetTick", Ut), Ge(() => {
      if (!d.value) return;
      const { clientWidth: v, clientHeight: m } = d.value, D = n.initialLayout ?? {};
      l(D, n.storageKey ?? "cathode.layout");
      const L = Object.keys(e.value)[0];
      L && f(L);
    });
    function f(v) {
      var D;
      document.querySelectorAll(".cc").forEach((L) => L.classList.remove("cc-focused"));
      const m = (D = d.value) == null ? void 0 : D.querySelector(`#cc-${v}`);
      m && m.classList.add("cc-focused");
    }
    function s() {
      !d.value || !n.initialLayout || o(n.initialLayout);
    }
    function r(v) {
      const m = v.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const u = z(!1), h = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function p(v) {
      i(v, !0), u.value = !1;
    }
    function M(v) {
      if (!u.value) return;
      const m = v.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (u.value = !1);
    }
    function w(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Ge(() => {
      document.addEventListener("click", M), document.addEventListener("keydown", w);
    }), Qe(() => {
      document.removeEventListener("click", M), document.removeEventListener("keydown", w);
    });
    function x(v) {
      var m;
      return ((m = n.containerTitles) == null ? void 0 : m[v]) ?? v;
    }
    return (v, m) => (pe(), we("div", {
      ref_key: "workspaceEl",
      ref: d,
      class: "cathode-workspace",
      onMousedown: r
    }, [
      At(v.$slots, "default", {}, void 0, !0),
      At(v.$slots, "overlay", {}, void 0, !0),
      re("div", zl, [
        t.initialLayout ? (pe(), we("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: s
        }, " ↺ Reset Layout ")) : We("", !0),
        m[1] || (m[1] = re("div", { class: "ws-sep" }, null, -1)),
        re("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (D) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      sn(Ln, { name: "menu" }, {
        default: Rn(() => [
          u.value ? (pe(), we("div", Pl, [
            m[3] || (m[3] = re("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? We("", !0) : (pe(), we("div", Hl, " No closed panels ")),
            (pe(!0), we(Dn, null, En(h(), (D) => (pe(), we("div", {
              key: D,
              class: "ws-restore-item",
              onClick: (L) => p(D)
            }, [
              m[2] || (m[2] = re("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Fn(" " + Ye(x(D)), 1)
            ], 8, $l))), 128))
          ])) : We("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), ro = /* @__PURE__ */ et(Vl, [["__scopeId", "data-v-5838d04b"]]), Xl = ["id"], Nl = { class: "cc-title" }, Ol = {
  key: 0,
  class: "cc-size-badge"
}, Ul = { class: "cc-controls" }, Kl = ["title"], Gl = { class: "cc-body" }, jl = 200, ql = 80, rn = 60, Zl = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: o, setMinimized: i, setMaximized: d, updatePos: f, updateSize: s } = hn(), r = Tt("cathodeWorkspace", z(null)), u = ne(() => e.value[n.id]), h = ne(() => {
      const S = u.value, q = n.curvature ?? 0;
      if (!S) return {};
      const te = { "--curvature": q };
      return S.maximized ? { ...te, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: S.zIndex } : {
        ...te,
        left: S.x + "px",
        top: S.y + "px",
        width: S.w + "px",
        height: S.minimized ? Bt + "px" : S.h + "px",
        zIndex: S.zIndex,
        display: S.visible ? "flex" : "none"
      };
    });
    let p = !1, M = 0, w = 0;
    function x(S) {
      var se;
      if (S.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), p = !0;
      const q = (se = r.value) == null ? void 0 : se.querySelector(`#cc-${n.id}`);
      if (!q) return;
      const te = q.getBoundingClientRect();
      M = S.clientX - te.left, w = S.clientY - te.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", m), S.preventDefault();
    }
    function v(S) {
      var fe;
      if (!p || !r.value) return;
      const q = r.value.getBoundingClientRect(), te = ((fe = u.value) == null ? void 0 : fe.w) ?? 300;
      let se = S.clientX - q.left - M, ie = S.clientY - q.top - w;
      se = Math.max(rn - te, Math.min(q.width - rn, se)), ie = Math.max(0, Math.min(q.height - Bt, ie)), f(n.id, se, ie);
    }
    function m() {
      p = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", m);
    }
    let D = !1, L = 0, K = 0, g = 0, k = 0;
    const R = z("");
    function P(S) {
      u.value.maximized || (l(n.id), D = !0, L = S.clientX, K = S.clientY, g = u.value.w, k = u.value.h, document.addEventListener("mousemove", A), document.addEventListener("mouseup", Q), S.preventDefault(), S.stopPropagation());
    }
    function A(S) {
      if (!D) return;
      const q = Math.max(jl, g + (S.clientX - L)), te = Math.max(ql, k + (S.clientY - K));
      s(n.id, q, te), R.value = `${Math.round(q)}×${Math.round(te)}`;
    }
    function Q() {
      D = !1, R.value = "", document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", Q), G.value++;
    }
    const G = z(0);
    N(Ut, () => {
      G.value++;
    }), Qe(() => {
      var S;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", Q), (S = U.value) == null || S.removeEventListener("scroll", B), V();
    });
    const U = z(null);
    function j(S) {
      if (n.canvas) return [];
      const q = S.children[0];
      return q ? Array.from(q.children) : [];
    }
    function B() {
      const S = U.value, q = n.curvature ?? 0;
      if (!S) return;
      const te = j(S);
      if (!te.length) return;
      const se = S.clientHeight, ie = se / 2, fe = q * 38e-4;
      te.forEach((ae) => {
        if (!ae.dataset.origFs) {
          const Se = getComputedStyle(ae);
          ae.dataset.origFs = Se.fontSize, ae.dataset.origLh = Se.lineHeight;
        }
        if (q === 0) {
          ae.style.fontSize = "", ae.style.lineHeight = "";
          return;
        }
        const ce = ae.getBoundingClientRect(), ke = S.getBoundingClientRect(), xe = ce.top - ke.top + ce.height / 2, De = Math.min(1, Math.abs(xe - ie) / (se / 2)), C = 1 + fe * Math.cos(De * Math.PI / 2), H = parseFloat(ae.dataset.origFs), le = ae.dataset.origLh, ve = le === "normal" ? H * 1.4 : parseFloat(le);
        isNaN(H) || (ae.style.fontSize = `${(H * C).toFixed(2)}px`), isNaN(ve) || (ae.style.lineHeight = `${(ve * C).toFixed(2)}px`);
      });
    }
    function V() {
      const S = U.value;
      S && j(S).forEach((q) => {
        q.style.fontSize = "", q.style.lineHeight = "", delete q.dataset.origFs, delete q.dataset.origLh;
      });
    }
    N(() => n.curvature, (S) => {
      (S ?? 0) === 0 ? V() : B();
    }), Ge(() => {
      var S;
      (S = U.value) == null || S.addEventListener("scroll", B, { passive: !0 }), ze(B);
    });
    function Y() {
      i(n.id, !u.value.minimized), ze(() => {
        G.value++;
      });
    }
    function _() {
      d(n.id, !u.value.maximized), ze(() => {
        G.value++;
      });
    }
    function O() {
      o(n.id, !1);
    }
    function $() {
      l(n.id);
    }
    return (S, q) => u.value && u.value.visible ? (pe(), we("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: An(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Fe(h.value),
      onMousedown: $
    }, [
      re("div", {
        class: "cc-titlebar",
        onMousedown: x
      }, [
        q[0] || (q[0] = re("span", { class: "cc-status-dot" }, null, -1)),
        re("span", Nl, Ye(t.title), 1),
        R.value ? (pe(), we("span", Ol, Ye(R.value), 1)) : We("", !0),
        re("div", Ul, [
          re("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Oe(Y, ["stop"])
          }, "─"),
          re("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Oe(_, ["stop"])
          }, Ye(u.value.maximized ? "⤡" : "⤢"), 9, Kl),
          re("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Oe(O, ["stop"])
          }, "✕")
        ])
      ], 32),
      cn(re("div", Gl, [
        re("div", {
          ref_key: "bodyEl",
          ref: U,
          class: "cc-screen",
          onScroll: B
        }, [
          At(S.$slots, "default", { resizeKey: G.value }, void 0, !0),
          q[1] || (q[1] = re("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Bn, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (pe(), we("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Oe(P, ["stop"])
      }, null, 32)) : We("", !0)
    ], 46, Xl)) : We("", !0);
  }
}), so = /* @__PURE__ */ et(Zl, [["__scopeId", "data-v-d8a49f79"]]), Jl = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ql = `
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
`, eo = 100, to = /* @__PURE__ */ Je({
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
    }, l = z(null), o = z(null);
    let i = null, d = !1, f, s, r, u, h, p = null, M = 0;
    function w(g) {
      g - M >= eo && (m(), M = g), p = requestAnimationFrame(w);
    }
    function x() {
      if (!l.value || !h) return;
      const g = l.value.clientWidth, k = l.value.clientHeight;
      g <= 0 || k <= 0 || h.width === g && h.height === k || (h.width = g, h.height = k, i && i.setSize(g, k, !1), o.value && (o.value.width = g, o.value.height = k, o.value.style.width = g + "px", o.value.style.height = k + "px"));
    }
    function v() {
      if (!(h != null && h.width)) return;
      const g = h.getContext("2d");
      if (!g) return;
      const k = h.width, R = h.height, P = e[n.theme] ?? e.none;
      g.clearRect(0, 0, k, R), g.fillStyle = P.bg, g.fillRect(0, 0, k, R);
      const A = Date.now(), Q = (A / 500 | 0) % 2 === 0, G = (A / 400 | 0) % 4;
      g.font = `bold ${Math.max(14, Math.min(k, R) * 0.06)}px monospace`, g.textAlign = "center", g.textBaseline = "middle", g.fillStyle = P.text, n.glow && (g.shadowColor = P.text, g.shadowBlur = 14);
      const U = ".".repeat(G).padEnd(3, " "), j = `${n.label}${U}`;
      if (g.fillText(j, k / 2, R / 2), g.shadowBlur = 0, Q) {
        const B = g.measureText(j), V = g.measureText("M").width, Y = parseFloat(g.font), _ = k / 2 + B.width / 2 + 4, O = R / 2 - Y / 2 + 2;
        g.fillStyle = P.cursor, n.glow && (g.shadowColor = P.cursor, g.shadowBlur = 12), g.fillRect(_, O, V * 0.7, Y * 0.95), g.shadowBlur = 0;
      }
    }
    function m() {
      if (!h) return;
      if (v(), d) {
        if (!o.value) return;
        const k = o.value.getContext("2d");
        k && k.drawImage(h, 0, 0);
        return;
      }
      if (!i || !r || !u) return;
      const g = n.theme === "paper";
      r.uniforms.uStrength.value = n.curvature / 45 * 0.55, r.uniforms.uScanlines.value = n.scanlines && !g ? 1 : 0, r.uniforms.uVignette.value = g ? 0 : 1, u.needsUpdate = !0, i.render(f, s);
    }
    function D() {
      if (!(!o.value || !l.value)) {
        h = document.createElement("canvas");
        try {
          i = new X.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          d = !0;
        }
        if (!d && !i.getContext() && (i.dispose(), i = null, d = !0), d) {
          x();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), f = new X.Scene(), s = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), u = new X.CanvasTexture(h), u.minFilter = X.LinearFilter, u.magFilter = X.LinearFilter, r = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: u },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Jl,
          fragmentShader: Ql,
          transparent: !0
        }), f.add(new X.Mesh(new X.PlaneGeometry(2, 2), r)), x();
      }
    }
    let L = null;
    Ge(() => {
      D(), m(), p = requestAnimationFrame(w), l.value && (L = new ResizeObserver(() => x()), L.observe(l.value));
    }), Qe(() => {
      p !== null && cancelAnimationFrame(p), L == null || L.disconnect(), i && i.dispose(), u == null || u.dispose(), r == null || r.dispose();
    }), N(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => m());
    const K = ne(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (g, k) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Fe(K.value)
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), co = /* @__PURE__ */ et(to, [["__scopeId", "data-v-2be1f107"]]);
export {
  xt as CANDLE_THEME_COLORS,
  ao as CathodeCandle,
  so as CathodeContainer,
  lo as CathodeGrid,
  co as CathodeLoader,
  ol as CathodeLog,
  oo as CathodeTerminal,
  ro as CathodeWorkspace,
  bt as LOG_THEME_COLORS,
  io as buildDefaultLayout,
  hn as useCathodeLayout
};
