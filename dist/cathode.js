import { defineComponent as Je, ref as z, reactive as kt, computed as le, watch as O, inject as Tt, nextTick as Pe, onMounted as Ge, onUnmounted as Qe, openBlock as pe, createElementBlock as we, normalizeStyle as Ae, createElementVNode as re, withModifiers as Oe, withKeys as Cl, createCommentVNode as ze, toDisplayString as We, createVNode as rl, withDirectives as sl, vModelText as kl, provide as Jt, renderSlot as Ft, Transition as Il, withCtx as Ll, Fragment as Rl, renderList as Dl, createTextVNode as El, normalizeClass as Al, vShow as Fl } from "vue";
import * as N from "three";
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
}, me = 30, It = 12, Bl = 10, cl = 28;
function _l(t, l) {
  if (typeof l == "function") return l(t);
  const e = t.filter((o) => o != null && o !== "");
  if (l === "count") return e.length;
  const n = e.map((o) => Number(o)).filter((o) => !Number.isNaN(o));
  if (n.length === 0) return null;
  switch (l) {
    case "sum":
      return n.reduce((o, i) => o + i, 0);
    case "avg":
      return n.reduce((o, i) => o + i, 0) / n.length;
    case "min":
      return Math.min(...n);
    case "max":
      return Math.max(...n);
  }
}
function Qt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, o = t.height, i = ct[l.theme] ?? ct.none, { cols: f, rows: d, pinnedRows: c, rowHeight: r, scrollY: u, scrollX: h, glow: w } = l;
  e.clearRect(0, 0, n, o), e.fillStyle = i.bg, e.fillRect(0, 0, n, o), e.save(), e.beginPath(), e.rect(0, 0, n, o), e.clip();
  const M = c.length * r, p = l.aggregateRow ? cl : 0, x = o - me - M - p;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, n, me), e.textBaseline = "middle", e.textAlign = "left";
  let v = -h;
  for (let B = 0; B < f.length; B++) {
    const X = f[B];
    if (v + X.width <= 0) {
      v += X.width;
      continue;
    }
    if (v >= n) break;
    const Y = !!l.colFilters[X.colId], _ = l.sortColId === X.colId, U = (X.colDef.headerName ?? X.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, X.width, me), e.clip(), e.font = `bold ${Bl}px system-ui, -apple-system, sans-serif`, e.fillStyle = Y ? i.accent : i.textHeader, w ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(U, v + 8, me / 2), e.shadowBlur = 4, e.fillText(U, v + 8, me / 2), e.shadowBlur = 0) : e.fillText(U, v + 8, me / 2), _) {
      const $ = e.measureText(U).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", v + 8 + $ + 4, me / 2);
    }
    X.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = Y ? i.accent : i.textHeader, e.globalAlpha = Y ? 1 : 0.38, e.fillText("⌕", v + X.width - 20, me / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + X.width - 0.5, 0), e.lineTo(v + X.width - 0.5, me), e.stroke(), v += X.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, me - 0.5), e.lineTo(n, me - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, me, n, x), e.clip();
  const m = Math.max(0, Math.floor(u / r)), D = Math.min(d.length, Math.ceil((u + x) / r)), C = l.selectionAnchorRow ?? l.selectedRow, V = l.selectionAnchorCol ?? l.selectedCol, g = l.selectedRow >= 0 && C >= 0 ? Math.min(l.selectedRow, C) : -1, I = l.selectedRow >= 0 && C >= 0 ? Math.max(l.selectedRow, C) : -1, R = l.selectedCol >= 0 && V >= 0 ? Math.min(l.selectedCol, V) : -1, P = l.selectedCol >= 0 && V >= 0 ? Math.max(l.selectedCol, V) : -1, F = I > g || P > R;
  let Q = Number.POSITIVE_INFINITY, G = Number.NEGATIVE_INFINITY, K = Number.POSITIVE_INFINITY, j = Number.NEGATIVE_INFINITY;
  for (let B = m; B < D; B++) {
    const X = d[B], Y = me + B * r - u;
    B % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, Y, n, r));
    const _ = B >= g && B <= I;
    B === l.hoveredRow && !_ && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, Y, n, r)), _ && !F && (e.fillStyle = Lt(i.accent, 0.1), e.fillRect(0, Y, n, r)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Y + r - 0.5), e.lineTo(n, Y + r - 0.5), e.stroke();
    let U = -h;
    for (let $ = 0; $ < f.length; $++) {
      const S = f[$];
      if (U + S.width <= 0) {
        U += S.width;
        continue;
      }
      if (U >= n) break;
      const q = _ && $ >= R && $ <= P;
      q && F && (e.fillStyle = Lt(i.accent, 0.14), e.fillRect(U, Y, S.width, r)), q && (U < Q && (Q = U), U + S.width > G && (G = U + S.width), Y < K && (K = Y), Y + r > j && (j = Y + r));
      const te = l.getCellStyle(S, X), se = te.color ?? i.text, ie = te.textAlign ?? "left", fe = l.formatCell(S, X);
      e.save(), e.beginPath(), e.rect(U + 1, Y, S.width - 2, r), e.clip(), e.font = `${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = se, e.textBaseline = "middle";
      const ae = ie === "right" ? U + S.width - 8 : U + 8;
      e.textAlign = ie === "right" ? "right" : "left";
      const ce = Y + r / 2;
      w ? (e.shadowColor = se, e.shadowBlur = 12, e.fillText(fe, ae, ce), e.shadowBlur = 6, e.fillText(fe, ae, ce), e.shadowBlur = 2, e.fillText(fe, ae, ce), e.shadowBlur = 0) : e.fillText(fe, ae, ce), e.restore(), B === l.selectedRow && $ === l.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(U + 1.5, Y + 1.5, S.width - 3, r - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(U + S.width - 0.5, Y), e.lineTo(U + S.width - 0.5, Y + r), e.stroke(), U += S.width;
    }
  }
  if (F && Q < G && K < j && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(Q + 0.5, K + 0.5, G - Q - 1, j - K - 1)), e.restore(), c.length > 0) {
    const B = o - M - p;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B - 0.5), e.lineTo(n, B - 0.5), e.stroke();
    for (let X = 0; X < c.length; X++) {
      const Y = c[X], _ = B + X * r;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, _, n, r);
      let U = -h;
      for (let $ = 0; $ < f.length; $++) {
        const S = f[$];
        if (U + S.width <= 0) {
          U += S.width;
          continue;
        }
        if (U >= n) break;
        const q = l.getCellStyle(S, Y), te = q.color ?? i.text, se = q.textAlign ?? "left", ie = l.formatCell(S, Y);
        e.save(), e.beginPath(), e.rect(U + 1, _, S.width - 2, r), e.clip(), e.font = `bold ${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = te, e.textBaseline = "middle", se === "right" ? (e.textAlign = "right", e.fillText(ie, U + S.width - 8, _ + r / 2)) : (e.textAlign = "left", e.fillText(ie, U + 8, _ + r / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(U + S.width - 0.5, _), e.lineTo(U + S.width - 0.5, _ + r), e.stroke(), U += S.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, _ + r - 0.5), e.lineTo(n, _ + r - 0.5), e.stroke();
    }
  }
  if (l.aggregateRow) {
    const B = o - p;
    e.fillStyle = Lt(i.accent, 0.1), e.fillRect(0, B, n, p), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B - 0.5), e.lineTo(n, B - 0.5), e.stroke();
    let X = -h;
    for (let Y = 0; Y < f.length; Y++) {
      const _ = f[Y];
      if (X + _.width <= 0) {
        X += _.width;
        continue;
      }
      if (X >= n) break;
      const $ = l.getCellStyle(_, l.aggregateRow).textAlign ?? "left", S = l.aggregateRow[_.colId] ?? "";
      e.save(), e.beginPath(), e.rect(X + 1, B, _.width - 2, p), e.clip(), e.font = `bold ${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", w && (e.shadowColor = i.accent, e.shadowBlur = 8), $ === "right" ? (e.textAlign = "right", e.fillText(S, X + _.width - 8, B + p / 2)) : (e.textAlign = "left", e.fillText(S, X + 8, B + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(X + _.width - 0.5, B), e.lineTo(X + _.width - 0.5, B + p), e.stroke(), X += _.width;
    }
  }
  e.restore();
}
function Lt(t, l) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${l})`);
  const e = parseInt(t.slice(1, 3), 16), n = parseInt(t.slice(3, 5), 16), o = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${n},${o},${l})`;
}
function Yl(t, l, e) {
  const n = t - 0.5, o = l - 0.5, i = (n * n + o * o) * e, f = n * (1 + i) * i, d = o * (1 + i) * i;
  return [t + f, l + d * 0.15];
}
function Wl(t, l, e, n, o) {
  const i = t / e, f = 1 - l / n, [d, c] = Yl(i, f, o);
  return d < 0 || d > 1 || c < 0 || c > 1 ? [-1, -1] : [d * e, (1 - c) * n];
}
function Rt(t, l) {
  let e = 0;
  for (let n = 0; n < t; n++) e += l[n].width;
  return e;
}
function zl(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function el(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function tl(t, l, e, n, o, i, f, d, c, r = !1) {
  const u = t + c;
  let h = -1, w = 0;
  for (let m = 0; m < e.length; m++) {
    if (u >= w && u < w + e[m].width) {
      h = m;
      break;
    }
    w += e[m].width;
  }
  if (l < me) return { area: "header", colIdx: h, rowIdx: -1 };
  const M = r ? cl : 0;
  if (M > 0 && l >= f - M)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const p = d * o;
  if (p > 0 && l >= f - p - M) {
    const m = Math.floor((l - (f - p - M)) / o);
    return { area: "pinned", colIdx: h, rowIdx: m };
  }
  const x = l - me + i, v = Math.floor(x / o);
  return v >= 0 && v < n ? { area: "body", colIdx: h, rowIdx: v } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Pl = 500, Hl = Pl / 2, $l = 1.6, Yt = `
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
    uMouseUV: { value: new N.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: $l },
    uLensTint: { value: new N.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
function Ht(t, l, e, n, o) {
  const i = l && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = i && o > 0 ? Hl / o : 0, t.uniforms.uAspect.value = o > 0 ? n / o : 1;
}
function $t(t, l) {
  const e = l.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const Vl = ["value"], Xl = ["disabled"], Nl = ["disabled"], Ol = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ul = 28, Kl = 600, Gl = /* @__PURE__ */ Je({
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
  setup(t, { emit: l }) {
    const e = t, n = l, o = z(e.rowData ?? []), i = z(e.pinnedBottomRowData ?? []), f = z(""), d = z(null), c = kt({}), r = kt({}), u = kt(/* @__PURE__ */ new Set()), h = z(0), w = z(0), M = z(0), p = z(0), x = z(0), v = z(-1), m = z(null), D = z(null), C = z(null), V = { ...Me }, g = z({ x: 0, y: me }), I = z("");
    function R(a) {
      return a.colId ?? a.field ?? (a.headerName ? a.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const P = le(() => {
      const a = e.defaultColDef ?? {};
      return e.columnDefs.filter((s) => !u.has(R(s))).map((s) => {
        const b = R(s), L = { ...a, ...s };
        return { colId: b, colDef: L, width: r[b] ?? L.width ?? 100 };
      });
    }), F = le(() => {
      const a = w.value;
      if (!a) return P.value;
      const s = P.value.reduce((T, E) => T + E.width, 0);
      if (!s || s >= a) return P.value;
      const b = a / s;
      let L = 0;
      return P.value.map((T, E) => {
        const Z = E === P.value.length - 1 ? a - L : Math.max(8, Math.round(T.width * b));
        return L += Z, { ...T, width: Z };
      });
    }), Q = le(() => {
      const a = F.value.reduce((s, b) => s + b.width, 0);
      return Math.max(0, a - w.value);
    }), G = le(() => {
      const a = i.value.length * e.rowHeight;
      return Math.max(0, M.value - me - a);
    }), K = le(
      () => Math.max(0, $.value.length * e.rowHeight - G.value)
    ), j = le(
      () => Math.max(1, Math.floor(G.value / e.rowHeight))
    ), B = le(
      () => $.value.length === 0 ? 0 : Math.min($.value.length - 1, Math.floor(p.value / e.rowHeight))
    ), X = le(
      () => Math.min($.value.length - 1, B.value + j.value - 1)
    );
    function Y(a, s) {
      if (s.colDef.valueGetter) return s.colDef.valueGetter({ data: a, colDef: s.colDef });
      if (s.colDef.field) return a[s.colDef.field];
    }
    function _(a, s) {
      const b = Y(s, a);
      return a.colDef.valueFormatter ? a.colDef.valueFormatter({ value: b, data: s, colDef: a.colDef }) ?? "" : a.colDef.cellRenderer ? (a.colDef.cellRenderer({ value: b, data: s, colDef: a.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function U(a, s) {
      return a.colDef.cellStyle ? typeof a.colDef.cellStyle == "function" ? a.colDef.cellStyle({ value: Y(s, a), data: s, colDef: a.colDef }) ?? {} : a.colDef.cellStyle : {};
    }
    const $ = le(() => {
      h.value;
      let a = o.value;
      const s = f.value.trim().toLowerCase();
      s && (a = a.filter(
        (b) => P.value.some(
          (L) => String(Y(b, L) ?? "").toLowerCase().includes(s)
        )
      ));
      for (const [b, L] of Object.entries(c)) {
        if (!L) continue;
        const T = P.value.find((E) => E.colId === b);
        if (T)
          if (L.startsWith("__eq__")) {
            const E = L.slice(6).toLowerCase();
            a = a.filter((W) => String(Y(W, T) ?? "").toLowerCase() === E);
          } else {
            const E = L.toLowerCase();
            a = a.filter((W) => String(Y(W, T) ?? "").toLowerCase().includes(E));
          }
      }
      if (d.value) {
        const { colId: b, dir: L } = d.value, T = P.value.find((E) => E.colId === b);
        T && (a = [...a].sort((E, W) => {
          const Z = Y(E, T), de = Y(W, T);
          let ge = 0;
          return T.colDef.comparator ? ge = T.colDef.comparator(Z, de) : typeof Z == "number" && typeof de == "number" ? ge = Z - de : ge = String(Z ?? "").localeCompare(String(de ?? ""), void 0, { numeric: !0 }), L === "asc" ? ge : -ge;
        }));
      }
      return a;
    }), S = le(() => {
      const a = P.value.filter((T) => T.colDef.aggFunc != null);
      if (a.length === 0) return null;
      const s = $.value, b = {};
      for (const T of a) {
        const E = s.map((Z) => Y(Z, T)), W = _l(E, T.colDef.aggFunc);
        if (W == null) {
          b[T.colId] = "";
          continue;
        }
        b[T.colId] = T.colDef.aggValueFormatter ? T.colDef.aggValueFormatter(W) : String(W);
      }
      const L = a[0].colId;
      return b[L] === "" && (b[L] = "Σ"), b;
    });
    O($, () => {
      p.value = 0, m.value = null;
    }), O(Q, () => {
      x.value = Math.min(x.value, Q.value);
    }), O(K, () => {
      p.value = Math.min(p.value, K.value);
    });
    function q(a) {
      const s = a * e.rowHeight, b = s + e.rowHeight;
      s < p.value ? p.value = s : b > p.value + G.value && (p.value = Math.min(K.value, b - G.value));
    }
    function te() {
      p.value = Math.max(0, p.value - G.value), oe();
    }
    function se() {
      p.value = Math.min(K.value, p.value + G.value), oe();
    }
    let ie = !1, fe = "", ae = 0, ce = 0, ke = !1, xe = !1, De = 0, k = 0, H = 0, ne = 0, ve = !1;
    function Se(a, s) {
      var b;
      ie = !0, fe = a, ae = s, ce = ((b = F.value.find((L) => L.colId === a)) == null ? void 0 : b.width) ?? 100, ke = !1;
    }
    function He(a) {
      if (xe) {
        const E = De - a.clientX, W = k - a.clientY;
        (Math.abs(E) > 4 || Math.abs(W) > 4) && (ve = !0), x.value = Math.max(0, Math.min(Q.value, H + E)), p.value = Math.max(0, Math.min(K.value, ne + W)), oe();
        return;
      }
      if (!ie) return;
      const s = w.value, b = Math.max(30, ce + (a.clientX - ae)), L = P.value.filter((E) => E.colId !== fe).reduce((E, W) => E + W.width, 0), T = s - b;
      T > 10 && (r[fe] = Math.max(10, Math.round(b * L / T))), oe();
    }
    function lt() {
      xe && (ve && (ke = !0), xe = !1), ie && (ie = !1, ke = !0, n("column-resized"));
    }
    function ut(a) {
      if (a.touches.length !== 1) return;
      const s = a.touches[0];
      xe = !0, ve = !1, De = s.clientX, k = s.clientY, H = x.value, ne = p.value;
    }
    function nt(a) {
      if (!xe || a.touches.length !== 1) return;
      a.preventDefault();
      const s = a.touches[0], b = De - s.clientX, L = k - s.clientY;
      (Math.abs(b) > 4 || Math.abs(L) > 4) && (ve = !0), x.value = Math.max(0, Math.min(Q.value, H + b)), p.value = Math.max(0, Math.min(K.value, ne + L)), oe();
    }
    function Ne() {
      xe && (ve && (ke = !0), xe = !1);
    }
    const Ie = z(null), ee = z(null), $e = Tt("cathodeResetTick", z(0));
    O($e, () => at());
    let ue = null, Ve = !1, _e, ft, Ce, Te, he;
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
    function A() {
      if (!(!ee.value || !Ie.value)) {
        he = document.createElement("canvas");
        try {
          ue = new N.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          Ve = !0;
        }
        if (!Ve && !ue.getContext() && (ue.dispose(), ue = null, Ve = !0), Ve) {
          J();
          return;
        }
        ue.setPixelRatio(1), ue.setClearColor(0, 0), _e = new N.Scene(), ft = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), Te = new N.CanvasTexture(he), Te.minFilter = N.LinearFilter, Te.magFilter = N.LinearFilter, Ce = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: Te },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new N.Color(0) },
            ...Pt()
          },
          vertexShader: Ol,
          fragmentShader: y,
          transparent: !0
        }), _e.add(new N.Mesh(new N.PlaneGeometry(2, 2), Ce)), J();
      }
    }
    function J() {
      if (!Ie.value || !ue && !Ve) return;
      const a = Ie.value.clientWidth, s = Ie.value.clientHeight - (e.pagination ? Ul : 0);
      if (!a || !s) return;
      const b = he.width !== a || he.height !== s;
      he.width = a, he.height = s, w.value = a, M.value = s, x.value = Math.max(0, Math.min(Q.value, x.value)), p.value = Math.max(0, Math.min(K.value, p.value)), ue ? (b && Te && (Te.dispose(), Te = new N.CanvasTexture(he), Te.minFilter = N.LinearFilter, Te.magFilter = N.LinearFilter, Ce && (Ce.uniforms.uTex.value = Te)), ue.setPixelRatio(window.devicePixelRatio || 1), ue.setSize(a, s)) : ee.value && (ee.value.width = a, ee.value.height = s, ee.value.style.width = a + "px", ee.value.style.height = s + "px"), oe();
    }
    function oe() {
      var b, L, T, E, W, Z, de, ge, it, ht, mt, rt;
      if (!(he != null && he.width)) return;
      if (Ve) {
        if (!ee.value) return;
        Qt(he, {
          cols: F.value,
          rows: $.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: p.value,
          scrollX: x.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = d.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((L = d.value) == null ? void 0 : L.dir) ?? null,
          colFilters: c,
          hoveredRow: v.value,
          selectedRow: ((T = m.value) == null ? void 0 : T.row) ?? -1,
          selectedCol: ((E = m.value) == null ? void 0 : E.col) ?? -1,
          selectionAnchorRow: ((W = D.value) == null ? void 0 : W.row) ?? -1,
          selectionAnchorCol: ((Z = D.value) == null ? void 0 : Z.col) ?? -1,
          formatCell: _,
          getCellStyle: U
        });
        const gt = ee.value.getContext("2d");
        gt && gt.drawImage(he, 0, 0);
        return;
      }
      if (!ue || !Ce || !Te) return;
      const a = ct[e.theme] ?? ct.none, s = e.theme === "paper";
      Ce.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ce.uniforms.uScanlines.value = e.scanlines && !s ? 1 : 0, Ce.uniforms.uVignette.value = s ? 0 : 1, Ce.uniforms.uBezel.value.set(a.bg), Ht(Ce, e.magnify, V, he.width, he.height), Qt(he, {
        cols: F.value,
        rows: $.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: p.value,
        scrollX: x.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((de = d.value) == null ? void 0 : de.colId) ?? null,
        sortDir: ((ge = d.value) == null ? void 0 : ge.dir) ?? null,
        colFilters: c,
        hoveredRow: v.value,
        selectedRow: ((it = m.value) == null ? void 0 : it.row) ?? -1,
        selectedCol: ((ht = m.value) == null ? void 0 : ht.col) ?? -1,
        selectionAnchorRow: ((mt = D.value) == null ? void 0 : mt.row) ?? -1,
        selectionAnchorCol: ((rt = D.value) == null ? void 0 : rt.col) ?? -1,
        formatCell: _,
        getCellStyle: U,
        aggregateRow: S.value
      }), Te.needsUpdate = !0, ue.render(_e, ft);
    }
    function Ee(a) {
      if (!ee.value) return [-1, -1];
      const s = ee.value.getBoundingClientRect(), b = a.clientX - s.left, L = a.clientY - s.top, T = ee.value.width || s.width, E = ee.value.height || s.height, W = e.curvature / 45 * 0.55, [Z, de] = Wl(b, L, T, E, W);
      return Z < 0 ? [-1, -1] : [Z, de];
    }
    let Le = 0;
    function Ye(a) {
      C.value = null;
      const s = Date.now();
      if (a.deltaX !== 0) {
        Le = s, x.value = Math.max(0, Math.min(Q.value, x.value + a.deltaX)), oe();
        return;
      }
      if (a.shiftKey && a.deltaY !== 0) {
        Le = s, x.value = Math.max(0, Math.min(Q.value, x.value + a.deltaY)), oe();
        return;
      }
      s - Le < Kl || (p.value = Math.max(0, Math.min(K.value, p.value + a.deltaY)), oe());
    }
    function ot(a) {
      if (ie) return;
      if (e.magnify && ee.value) {
        const T = $t(a, ee.value);
        V.x = T.x, V.y = T.y;
      }
      const [s, b] = Ee(a);
      if (s < 0) {
        v.value = -1, oe();
        return;
      }
      const L = tl(
        s,
        b,
        F.value,
        $.value.length,
        e.rowHeight,
        p.value,
        he.height,
        i.value.length,
        x.value,
        S.value !== null
      );
      if (v.value = L.area === "body" ? L.rowIdx : -1, L.area === "header" && L.colIdx >= 0) {
        const T = F.value[L.colIdx], E = Rt(L.colIdx, F.value), W = s + x.value;
        ee.value.style.cursor = T && el(W, E, T.width) ? "col-resize" : "pointer";
      } else L.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      oe();
    }
    function qe() {
      v.value = -1, V.x = Me.x, V.y = Me.y, oe();
    }
    function hl(a) {
      const [s, b] = Ee(a);
      if (s < 0) return;
      if (b >= me) {
        xe = !0, ve = !1, De = a.clientX, k = a.clientY, H = x.value, ne = p.value;
        return;
      }
      const L = s + x.value;
      for (let T = 0; T < F.value.length; T++) {
        const E = F.value[T], W = Rt(T, F.value);
        if (E.colDef.resizable !== !1 && el(L, W, E.width)) {
          Se(E.colId, a.clientX);
          return;
        }
      }
    }
    function ml(a) {
      var T, E, W;
      if (ke) {
        ke = !1;
        return;
      }
      if (ie) return;
      const [s, b] = Ee(a);
      if (s < 0) {
        C.value = null;
        return;
      }
      const L = tl(
        s,
        b,
        F.value,
        $.value.length,
        e.rowHeight,
        p.value,
        he.height,
        i.value.length,
        x.value,
        S.value !== null
      );
      if (L.area === "header" && L.colIdx >= 0) {
        const Z = F.value[L.colIdx], de = Rt(L.colIdx, F.value), ge = s + x.value;
        Z.colDef.filter && zl(ge, de, Z.width) ? (a.stopPropagation(), C.value === Z.colId ? C.value = null : (C.value = Z.colId, I.value = (T = c[Z.colId]) != null && T.startsWith("__eq__") ? c[Z.colId].slice(6) : c[Z.colId] ?? "", g.value = { x: Math.max(0, de - x.value), y: me })) : Z.colDef.sortable !== !1 && (C.value = null, d.value = ((E = d.value) == null ? void 0 : E.colId) === Z.colId ? d.value.dir === "asc" ? { colId: Z.colId, dir: "desc" } : null : { colId: Z.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (C.value = null, L.area === "body" && L.rowIdx >= 0 && L.colIdx >= 0) {
        const Z = L.rowIdx;
        a.shiftKey && m.value ? (D.value || (D.value = { ...m.value }), m.value = { row: Z, col: L.colIdx }) : (m.value = { row: Z, col: L.colIdx }, D.value = { row: Z, col: L.colIdx }), (W = ee.value) == null || W.focus();
        const de = $.value[Z], ge = F.value[L.colIdx];
        de && ge && (n("row-clicked", { data: de, event: a }), n("cell-selected", { data: de, row: Z, col: L.colIdx, colId: ge.colId }));
      }
    }
    function Kt(a) {
      var s, b;
      C.value && ((b = (s = a.target).closest) != null && b.call(s, ".cathode-filter-popup") || (C.value = null));
    }
    function gl(a) {
      var T;
      if (!w.value) return;
      let s = 0;
      for (let E = 0; E < a; E++) s += F.value[E].width;
      const b = ((T = F.value[a]) == null ? void 0 : T.width) ?? 0, L = s - x.value;
      L < 0 ? x.value = Math.max(0, s) : L + b > w.value && (x.value = Math.min(Q.value, s + b - w.value));
    }
    function pl(a) {
      const b = F.value.length - 1, L = $.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(a.key) && (a.preventDefault(), m.value = { row: B.value, col: 0 }, D.value = { row: B.value, col: 0 });
        return;
      }
      let { row: T, col: E } = m.value;
      const W = (Z, de, ge = !1) => {
        T = Math.max(0, Math.min(L, Z)), E = Math.max(0, Math.min(b, de)), m.value = { row: T, col: E }, ge || (D.value = { row: T, col: E }), q(T), gl(E);
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
          a.preventDefault(), a.ctrlKey || a.metaKey ? W(L, b, a.shiftKey) : W(T, b, a.shiftKey);
          break;
        case "PageDown":
          a.preventDefault(), W(Math.min(L, T + j.value), E, a.shiftKey);
          break;
        case "PageUp":
          a.preventDefault(), W(Math.max(0, T - j.value), E, a.shiftKey);
          break;
        case "Escape":
          m.value = null, D.value = null;
          break;
        case "c":
        case "C":
          (a.ctrlKey || a.metaKey) && (a.preventDefault(), wl());
          break;
      }
    }
    function wl() {
      var ge;
      if (!m.value) return;
      const a = F.value, s = $.value, b = D.value ?? m.value, L = Math.min(b.row, m.value.row), T = Math.max(b.row, m.value.row), E = Math.min(b.col, m.value.col), W = Math.max(b.col, m.value.col), Z = [];
      for (let it = L; it <= T; it++) {
        const ht = s[it];
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
    function yl(a) {
      const s = a.target.value;
      I.value = s, s ? c[C.value] = s : delete c[C.value], n("filter-changed");
    }
    function Gt() {
      C.value && delete c[C.value], I.value = "", C.value = null, n("filter-changed");
    }
    const bl = {
      setGridOption(a, s) {
        a === "rowData" ? o.value = s : a === "pinnedBottomRowData" ? i.value = s : a === "quickFilterText" && (f.value = s);
      },
      getColumnState() {
        return e.columnDefs.map((a) => {
          var b, L;
          const s = R(a);
          return {
            colId: s,
            hide: u.has(s),
            sort: ((b = d.value) == null ? void 0 : b.colId) === s ? d.value.dir : null,
            sortIndex: ((L = d.value) == null ? void 0 : L.colId) === s ? 0 : null,
            width: r[s] ?? a.width
          };
        });
      },
      applyColumnState({ state: a }) {
        for (const s of a)
          s.hide === !0 && u.add(s.colId), s.hide === !1 && u.delete(s.colId), s.sort && (d.value = { colId: s.colId, dir: s.sort }), s.width && (r[s.colId] = s.width);
      },
      setFilterModel(a) {
        for (const s of Object.keys(c)) delete c[s];
        if (a)
          for (const [s, b] of Object.entries(a))
            (b == null ? void 0 : b.type) === "equals" ? c[s] = `__eq__${b.filter}` : b != null && b.filter && (c[s] = b.filter);
      },
      getFilterModel() {
        const a = {};
        for (const [s, b] of Object.entries(c))
          b && (a[s] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
        return a;
      },
      async setColumnFilterModel(a, s) {
        s ? s.type === "equals" ? c[a] = `__eq__${s.filter}` : c[a] = s.filter ?? "" : delete c[a];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: a = "export.csv" } = {}) {
        const s = P.value, b = s.map((W) => W.colDef.headerName ?? W.colId).join(","), L = $.value.map(
          (W) => s.map((Z) => `"${String(_(Z, W)).replace(/"/g, '""')}"`).join(",")
        ), T = new Blob([[b, ...L].join(`
`)], { type: "text/csv" }), E = URL.createObjectURL(T);
        Object.assign(document.createElement("a"), { href: E, download: a }).click(), URL.revokeObjectURL(E);
      },
      resize() {
        J();
      },
      resetColumnState() {
        u.clear();
        for (const s of e.columnDefs)
          s.hide && u.add(R(s));
        const a = e.columnDefs.find((s) => s.sort);
        d.value = a ? { colId: R(a), dir: a.sort } : null;
        for (const s of Object.keys(r)) delete r[s];
        for (const s of Object.keys(c)) delete c[s];
        f.value = "", p.value = 0, m.value = null, C.value = null;
      }
    };
    O(
      [$, () => i.value, F, p, v, m],
      () => Pe(oe)
    ), O(() => e.theme, () => oe()), O(() => e.curvature, () => Pe(J)), O(() => e.scanlines, () => oe()), O(() => e.glow, () => oe()), O(() => e.magnify, (a) => {
      a || (V.x = Me.x, V.y = Me.y), oe();
    }), O(m, (a) => {
      if (!a) return;
      const s = $.value[a.row], b = F.value[a.col];
      s && b && n("cell-selected", { data: s, row: a.row, col: a.col, colId: b.colId });
    });
    let dt = null, vt = null, Ct = 0;
    function at() {
      cancelAnimationFrame(Ct), Ct = requestAnimationFrame(J);
    }
    function jt(a) {
      a.preventDefault();
    }
    function qt() {
      ue == null || ue.dispose(), ue = null, Ve = !1, A();
    }
    Ge(() => {
      for (const a of e.columnDefs)
        a.hide && u.add(R(a)), a.sort && !d.value && (d.value = { colId: R(a), dir: a.sort });
      o.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Kt), document.addEventListener("mousemove", He), document.addEventListener("mouseup", lt), Pe(() => {
        var a;
        A(), ee.value && (ee.value.addEventListener("webglcontextlost", jt), ee.value.addEventListener("webglcontextrestored", qt)), Ie.value && (dt = new ResizeObserver(() => J()), dt.observe(Ie.value), vt = new IntersectionObserver((s) => {
          s.some((b) => b.isIntersecting) && at();
        }), vt.observe(Ie.value)), window.addEventListener("resize", at), (a = window.visualViewport) == null || a.addEventListener("resize", at), n("grid-ready", { api: bl });
      });
    }), Qe(() => {
      var a, s, b;
      document.removeEventListener("click", Kt, !0), document.removeEventListener("mousemove", He), document.removeEventListener("mouseup", lt), (a = ee.value) == null || a.removeEventListener("webglcontextlost", jt), (s = ee.value) == null || s.removeEventListener("webglcontextrestored", qt), dt == null || dt.disconnect(), vt == null || vt.disconnect(), window.removeEventListener("resize", at), (b = window.visualViewport) == null || b.removeEventListener("resize", at), cancelAnimationFrame(Ct), ue == null || ue.dispose();
    });
    const Re = le(() => ct[e.theme] ?? ct.none), xl = le(() => ({
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
    })), Ml = le(() => ({
      background: Re.value.bg,
      border: `1px solid ${Re.value.border}`,
      color: Re.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Sl = le(() => ({
      background: Re.value.headerBg,
      borderTop: `1px solid ${Re.value.border}`,
      color: Re.value.text
    })), Tl = le(() => ({
      background: Re.value.bg
    })), Zt = le(() => Re.value.accent);
    return (a, s) => {
      var b, L;
      return pe(), we("div", {
        ref_key: "wrapEl",
        ref: Ie,
        class: "cathode-wrap",
        style: Ae(Tl.value)
      }, [
        re("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Oe(Ye, ["prevent"]),
          onMousemove: ot,
          onMouseleave: qe,
          onMousedown: hl,
          onClick: ml,
          onKeydown: pl,
          onTouchstartPassive: ut,
          onTouchmove: nt,
          onTouchend: Ne,
          onTouchcancel: Ne
        }, null, 544),
        C.value ? (pe(), we("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Ae(xl.value),
          onClick: s[0] || (s[0] = Oe(() => {
          }, ["stop"]))
        }, [
          re("input", {
            style: Ae(Ml.value),
            value: I.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: yl,
            onKeydown: Cl(Gt, ["escape"])
          }, null, 44, Vl),
          I.value ? (pe(), we("button", {
            key: 0,
            style: Ae({
              background: "none",
              border: "none",
              color: Re.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Gt
          }, "✕", 4)) : ze("", !0)
        ], 4)) : ze("", !0),
        t.pagination ? (pe(), we("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ae(Sl.value)
        }, [
          re("button", {
            disabled: p.value <= 0,
            onClick: s[1] || (s[1] = (T) => te())
          }, "◀", 8, Xl),
          re("span", null, We((B.value + 1).toLocaleString()) + "–" + We(Math.min($.value.length, X.value + 1).toLocaleString()) + " / " + We($.value.length.toLocaleString()), 1),
          re("button", {
            disabled: p.value >= K.value,
            onClick: s[2] || (s[2] = (T) => se())
          }, "▶", 8, Nl),
          re("span", {
            class: "cathode-page-info",
            style: Ae({ color: Zt.value })
          }, We($.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (pe(), we("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ae({ color: Zt.value })
          }, We(((b = F.value[m.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((L = F.value[m.value.col]) == null ? void 0 : L.colId)) + " : " + We(_(F.value[m.value.col], $.value[m.value.row])), 5)) : ze("", !0)
        ], 4)) : ze("", !0)
      ], 4);
    };
  }
}), et = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, o] of l)
    e[n] = o;
  return e;
}, no = /* @__PURE__ */ et(Gl, [["__scopeId", "data-v-e37eed70"]]), bt = {
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
function jl(t, l) {
  switch (l) {
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
const ql = 12, ye = 18, wt = 10, Ze = 6, Vt = `${ql}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Zl(t, l, e) {
  if (e <= 0 || !l) return [l];
  const n = [];
  for (const o of l.split(`
`)) {
    if (!o) {
      n.push("");
      continue;
    }
    if (t.measureText(o).width <= e) {
      n.push(o);
      continue;
    }
    const i = o.split(/(\s+)/);
    let f = "";
    for (const d of i) {
      const c = f + d;
      if (t.measureText(c).width <= e)
        f = c;
      else if (f && (n.push(f.replace(/\s+$/, "")), f = ""), t.measureText(d).width > e) {
        let r = "";
        for (const u of d)
          t.measureText(r + u).width > e ? (r && n.push(r), r = u) : r += u;
        f = r;
      } else
        f = d.replace(/^\s+/, "");
    }
    f && n.push(f.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function ul(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), o = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${o}`;
  }
  return t;
}
function Jl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function Ql(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: o, wordWrap: i } = t, f = t.formatTs ?? ul;
  e.font = Vt;
  const d = [];
  for (let c = 0; c < l.length; c++) {
    const r = l[c], u = r.level ?? "info", h = o && r.ts != null ? f(r.ts) : "", w = i ? Zl(e, r.text, n) : r.text.split(`
`);
    for (let M = 0; M < w.length; M++)
      d.push({
        entryIdx: c,
        text: w[M],
        level: u,
        timestamp: M === 0 ? h : "",
        isFirstFrag: M === 0,
        widthPx: e.measureText(w[M]).width
      });
  }
  return d;
}
function ll(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, o = t.height, i = bt[l.theme] ?? bt.none;
  e.clearRect(0, 0, n, o), e.fillStyle = i.bg, e.fillRect(0, 0, n, o), e.save(), e.beginPath(), e.rect(0, 0, n, o), e.clip(), e.font = Vt, e.textBaseline = "middle";
  const f = l.visualLines, d = wt - l.scrollX, c = (l.showTimestamps ? wt + l.timestampWidth : wt) - l.scrollX, r = Math.max(0, Math.floor((l.scrollY - Ze) / ye)), u = Math.min(f.length, Math.ceil((l.scrollY + o - Ze) / ye) + 1);
  for (let h = r; h < u; h++) {
    const w = f[h], M = Ze + h * ye - l.scrollY + ye / 2;
    if (w.entryIdx % 2 === 1 && w.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let x = 1;
      for (; h + x < u && f[h + x].entryIdx === w.entryIdx; ) x++;
      e.fillRect(0, M - ye / 2, n, ye * x);
    }
    l.selectionStart >= 0 && h >= l.selectionStart && h <= l.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, M - ye / 2, n, ye)), h === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M - ye / 2, n, ye)), l.showTimestamps && w.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(w.timestamp, d, M), e.shadowBlur = 0);
    const p = jl(i, w.level);
    e.fillStyle = p, e.textAlign = "left", l.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(w.text, c, M), e.shadowBlur = 7, e.fillText(w.text, c, M), e.shadowBlur = 3, e.fillText(w.text, c, M), e.shadowBlur = 0) : e.fillText(w.text, c, M);
  }
  e.restore();
}
function nl(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Ze) / ye);
  return n < 0 || n >= e ? -1 : n;
}
function en(t) {
  return Ze * 2 + t * ye;
}
const tn = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ln = /* @__PURE__ */ Je({
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
  setup(t, { expose: l }) {
    const e = t, n = z(null), o = z(null), i = { ...Me }, f = z(0), d = z(0), c = z(0), r = z(-1), u = z(!0), h = z(-1), w = z(-1), M = le(() => {
      const y = e.entries ?? [];
      return e.maxLines > 0 && y.length > e.maxLines ? y.slice(y.length - e.maxLines) : y;
    }), p = le(() => {
      if (!e.showTimestamps) return "";
      const y = e.formatTs ?? ul;
      let A = "00:00:00";
      for (const J of M.value) {
        if (J.ts == null) continue;
        const oe = y(J.ts);
        oe.length > A.length && (A = oe);
      }
      return A;
    }), x = z(0), v = z([]);
    function m() {
      if (!j) return;
      const y = j.getContext("2d");
      if (!y) return;
      y.font = Vt;
      const A = e.showTimestamps ? Jl(y, p.value) : 0;
      x.value = A;
      const J = Math.max(
        1,
        f.value - wt * 2 - A
      );
      v.value = Ql({
        entries: M.value,
        ctx: y,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const D = le(() => en(v.value.length)), C = le(() => Math.max(0, D.value - d.value)), V = le(() => {
      let y = 0;
      for (const A of v.value) A.widthPx > y && (y = A.widthPx);
      return wt * 2 + x.value + y;
    }), g = le(() => Math.max(0, V.value - f.value)), I = z(0);
    O(C, () => {
      u.value ? c.value = C.value : c.value = Math.min(c.value, C.value);
    }), O(g, () => {
      I.value = Math.min(I.value, g.value);
    }), O(
      [M, f, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        m(), Pe(_);
      },
      { deep: !1 }
    );
    let R = null, P = !1, F, Q, G, K, j;
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
    function X() {
      if (!(!o.value || !n.value)) {
        j = document.createElement("canvas");
        try {
          R = new N.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          P = !0;
        }
        if (!P && !R.getContext() && (R.dispose(), R = null, P = !0), P) {
          Y();
          return;
        }
        R.setPixelRatio(1), R.setClearColor(0, 0), F = new N.Scene(), Q = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), K = new N.CanvasTexture(j), K.minFilter = N.LinearFilter, K.magFilter = N.LinearFilter, G = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: K },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Pt()
          },
          vertexShader: tn,
          fragmentShader: B,
          transparent: !0
        }), F.add(new N.Mesh(new N.PlaneGeometry(2, 2), G)), Y();
      }
    }
    function Y() {
      if (!n.value || !R && !P) return;
      const y = n.value.clientWidth, A = n.value.clientHeight;
      if (!y || !A) return;
      const J = j.width !== y || j.height !== A;
      J && (j.width = y, j.height = A, f.value = y, d.value = A, m(), R ? (J && K && (K.dispose(), K = new N.CanvasTexture(j), K.minFilter = N.LinearFilter, K.magFilter = N.LinearFilter, G && (G.uniforms.uTex.value = K)), R.setPixelRatio(window.devicePixelRatio || 1), R.setSize(y, A)) : o.value && (o.value.width = y, o.value.height = A, o.value.style.width = y + "px", o.value.style.height = A + "px"), u.value && (c.value = Math.max(0, D.value - d.value)), _());
    }
    function _() {
      if (!(j != null && j.width)) return;
      if (P) {
        if (!o.value) return;
        ll(j, {
          visualLines: v.value,
          scrollY: c.value,
          scrollX: I.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: x.value,
          hoveredLine: r.value,
          selectionStart: Math.min(h.value, w.value),
          selectionEnd: Math.max(h.value, w.value)
        });
        const A = o.value.getContext("2d");
        A && A.drawImage(j, 0, 0);
        return;
      }
      if (!R || !G || !K) return;
      const y = e.theme === "paper";
      G.uniforms.uStrength.value = e.curvature / 45 * 0.55, G.uniforms.uScanlines.value = e.scanlines && !y ? 1 : 0, G.uniforms.uVignette.value = y ? 0 : 1, Ht(G, e.magnify, i, j.width, j.height), ll(j, {
        visualLines: v.value,
        scrollY: c.value,
        scrollX: I.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: x.value,
        hoveredLine: r.value,
        selectionStart: Math.min(h.value, w.value),
        selectionEnd: Math.max(h.value, w.value)
      }), K.needsUpdate = !0, R.render(F, Q);
    }
    O(() => e.theme, () => _()), O(() => e.curvature, () => _()), O(() => e.scanlines, () => _()), O(() => e.glow, () => _()), O(() => e.magnify, (y) => {
      y || (i.x = Me.x, i.y = Me.y), _();
    }), O(c, () => _()), O(I, () => _()), O(r, () => _()), O([h, w], () => _());
    function U(y) {
      if (!o.value) return [-1, -1];
      const A = o.value.getBoundingClientRect();
      return [y.clientX - A.left, y.clientY - A.top];
    }
    function $(y) {
      c.value = Math.max(0, Math.min(C.value, y)), u.value = c.value >= C.value - 4;
    }
    function S(y) {
      I.value = Math.max(0, Math.min(g.value, y));
    }
    function q(y) {
      y.shiftKey ? S(I.value + y.deltaY) : Math.abs(y.deltaX) > Math.abs(y.deltaY) ? S(I.value + y.deltaX) : $(c.value + y.deltaY);
    }
    let te = !1, se = 0, ie = 0, fe = 0, ae = 0, ce = !1;
    function ke(y) {
      te = !0, ce = !1, se = y.clientX, ie = y.clientY, fe = I.value, ae = c.value, n.value && n.value.focus();
    }
    function xe(y) {
      if (te) {
        const A = se - y.clientX, J = ie - y.clientY;
        (Math.abs(A) > 4 || Math.abs(J) > 4) && (ce = !0), S(fe + A), $(ae + J);
      }
    }
    function De() {
      te && (te = !1, ce && (ce = !1));
    }
    function k(y) {
      if (y.touches.length !== 1) return;
      const A = y.touches[0];
      te = !0, ce = !1, se = A.clientX, ie = A.clientY, fe = I.value, ae = c.value, n.value && n.value.focus();
    }
    function H(y) {
      if (!te || y.touches.length !== 1) return;
      y.preventDefault();
      const A = y.touches[0], J = se - A.clientX, oe = ie - A.clientY;
      (Math.abs(J) > 4 || Math.abs(oe) > 4) && (ce = !0), S(fe + J), $(ae + oe);
    }
    function ne() {
      te && (te = !1, ce && (ce = !1));
    }
    function ve(y) {
      const [, A] = U(y);
      return A < 0 ? -1 : nl(A, c.value, v.value.length);
    }
    function Se(y) {
      if (ce) {
        ce = !1;
        return;
      }
      const A = ve(y);
      if (A < 0) {
        h.value = -1, w.value = -1;
        return;
      }
      y.shiftKey && h.value >= 0 || (h.value = A), w.value = A;
    }
    function He(y, A) {
      const J = v.value.length;
      if (J === 0) return;
      const oe = w.value < 0 ? 0 : w.value;
      let Ee = Math.max(0, Math.min(J - 1, oe + y));
      w.value = Ee, (!A || h.value < 0) && (h.value = Ee), r.value = Ee;
      const Le = Ze + Ee * ye, Ye = Le + ye;
      Le < c.value ? $(Le) : Ye > c.value + d.value && $(Ye - d.value);
    }
    function lt() {
      const y = Math.min(h.value, w.value), A = Math.max(h.value, w.value);
      if (y < 0) return "";
      const J = v.value, oe = /* @__PURE__ */ new Set(), Ee = [];
      for (let Le = y; Le <= A && Le < J.length; Le++) {
        const Ye = J[Le];
        if (oe.has(Ye.entryIdx)) continue;
        oe.add(Ye.entryIdx);
        let ot = "";
        for (let qe = 0; qe < J.length; qe++)
          J[qe].entryIdx === Ye.entryIdx && (ot += (ot && !J[qe].isFirstFrag ? " " : "") + J[qe].text);
        Ee.push(Ye.timestamp ? `${Ye.timestamp}  ${ot}` : ot);
      }
      return Ee.join(`
`);
    }
    async function ut() {
      const y = lt();
      if (y)
        try {
          await navigator.clipboard.writeText(y);
        } catch {
          const A = document.createElement("textarea");
          A.value = y, A.style.position = "fixed", A.style.opacity = "0", document.body.appendChild(A), A.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(A);
        }
    }
    function nt(y) {
      if ((y.metaKey || y.ctrlKey) && (y.key === "c" || y.key === "C")) {
        h.value >= 0 && (y.preventDefault(), ut());
        return;
      }
      if ((y.metaKey || y.ctrlKey) && (y.key === "a" || y.key === "A")) {
        y.preventDefault(), h.value = 0, w.value = v.value.length - 1;
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
          y.preventDefault(), S(I.value + ye * 2);
          break;
        case "ArrowLeft":
          y.preventDefault(), S(I.value - ye * 2);
          break;
        case "PageDown":
          y.preventDefault(), $(c.value + d.value);
          break;
        case "PageUp":
          y.preventDefault(), $(c.value - d.value);
          break;
        case "Home":
          y.preventDefault(), $(0), S(0);
          break;
        case "End":
          y.preventDefault(), $(C.value);
          break;
        case "Escape":
          h.value = -1, w.value = -1;
          break;
      }
    }
    function Ne(y) {
      if (e.magnify && o.value) {
        const J = $t(y, o.value);
        i.x = J.x, i.y = J.y, _();
      }
      const [, A] = U(y);
      if (A < 0) {
        r.value = -1;
        return;
      }
      r.value = nl(A, c.value, v.value.length);
    }
    function Ie() {
      r.value = -1, i.x = Me.x, i.y = Me.y, _();
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = C.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        $(Ze + y * ye);
      }
    });
    let ee = null, $e = null, ue = 0;
    const Ve = Tt("cathodeResetTick", z(0));
    O(Ve, () => _e());
    function _e() {
      cancelAnimationFrame(ue), ue = requestAnimationFrame(Y);
    }
    function ft(y) {
      y.preventDefault();
    }
    function Ce() {
      R == null || R.dispose(), R = null, P = !1, X();
    }
    Ge(() => {
      document.addEventListener("mousemove", xe), document.addEventListener("mouseup", De), Pe(() => {
        var y;
        X(), o.value && (o.value.addEventListener("webglcontextlost", ft), o.value.addEventListener("webglcontextrestored", Ce)), n.value && (ee = new ResizeObserver(() => Y()), ee.observe(n.value), $e = new IntersectionObserver((A) => {
          A.some((J) => J.isIntersecting) && _e();
        }), $e.observe(n.value)), window.addEventListener("resize", _e), (y = window.visualViewport) == null || y.addEventListener("resize", _e), c.value = C.value;
      });
    }), Qe(() => {
      var y, A, J;
      document.removeEventListener("mousemove", xe), document.removeEventListener("mouseup", De), (y = o.value) == null || y.removeEventListener("webglcontextlost", ft), (A = o.value) == null || A.removeEventListener("webglcontextrestored", Ce), ee == null || ee.disconnect(), $e == null || $e.disconnect(), window.removeEventListener("resize", _e), (J = window.visualViewport) == null || J.removeEventListener("resize", _e), cancelAnimationFrame(ue), R == null || R.dispose();
    });
    const Te = le(() => bt[e.theme] ?? bt.none), he = le(() => ({
      background: Te.value.bg
    }));
    return (y, A) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: Ae(he.value),
      tabindex: "0",
      onKeydown: nt
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
        onTouchstartPassive: k,
        onTouchmove: H,
        onTouchend: ne,
        onTouchcancel: ne
      }, null, 544)
    ], 36));
  }
}), nn = /* @__PURE__ */ et(ln, [["__scopeId", "data-v-96a56f90"]]), on = ["disabled"], an = /* @__PURE__ */ Je({
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
  setup(t, { expose: l, emit: e }) {
    const n = t, o = e, i = z(null), f = z(null), d = z(""), c = z([]), r = z(-1);
    let u = "";
    function h(g) {
      g.trim() && (c.value.length && c.value[c.value.length - 1] === g || (c.value.push(g), c.value.length > n.historyLimit && c.value.splice(0, c.value.length - n.historyLimit)));
    }
    function w(g) {
      if (!n.disabled) {
        if (g.key === "Enter") {
          g.preventDefault();
          const I = d.value;
          I.trim() && h(I), r.value = -1, d.value = "", o("submit", I);
          return;
        }
        if (g.key === "ArrowUp") {
          if (!c.value.length) return;
          g.preventDefault(), r.value === -1 ? (u = d.value, r.value = c.value.length - 1) : r.value > 0 && r.value--, d.value = c.value[r.value];
          return;
        }
        if (g.key === "ArrowDown") {
          if (r.value === -1) return;
          g.preventDefault(), r.value < c.value.length - 1 ? (r.value++, d.value = c.value[r.value]) : (r.value = -1, d.value = u, u = "");
          return;
        }
      }
    }
    const M = z(!0);
    let p = null;
    function x() {
      p || (p = setInterval(() => {
        M.value = !M.value;
      }, 530));
    }
    function v() {
      p && (clearInterval(p), p = null), M.value = !0;
    }
    const m = le(() => {
      let g;
      return n.disabled ? g = " " : n.busy ? g = "█" : g = M.value ? "█" : " ", { level: "info", text: `${n.prompt}${d.value}${g}` };
    }), D = le(
      () => [...n.entries, m.value]
    );
    function C() {
      var g;
      n.disabled || (g = f.value) == null || g.focus();
    }
    O(() => n.busy, (g, I) => {
      I && !g && !n.disabled && Pe(() => {
        var R;
        return (R = f.value) == null ? void 0 : R.focus();
      });
    });
    function V() {
      var g;
      (g = f.value) == null || g.focus();
    }
    return l({ focus: V }), Ge(() => {
      x(), n.disabled || requestAnimationFrame(() => {
        var g;
        return (g = f.value) == null ? void 0 : g.focus();
      });
    }), Qe(() => {
      v();
    }), (g, I) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: C
    }, [
      rl(nn, {
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
      sl(re("input", {
        ref_key: "inputEl",
        ref: f,
        "onUpdate:modelValue": I[0] || (I[0] = (R) => d.value = R),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: w
      }, null, 40, on), [
        [kl, d.value]
      ])
    ], 512));
  }
}), oo = /* @__PURE__ */ et(an, [["__scopeId", "data-v-a2b39934"]]), xt = {
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
}, rn = 0.18, pt = 8, Xt = 22, sn = 4, Be = 8, Ke = 56, Nt = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", cn = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Dt = 4, un = 1, fn = 1;
function dn(t, l, e, n = 0, o = !1) {
  const i = o ? Nt : Ke, f = Math.max(0, l - Be - i), d = Math.max(1, Math.floor(f / e)), c = Math.min(d, t);
  return { firstIdx: Math.max(0, t - c - Math.floor(n / e)), count: c, slotW: e };
}
function vn(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, o = -1 / 0, i = 0;
  const f = Math.min(t.length, l + e);
  for (let c = l; c < f; c++) {
    const r = t[c];
    r && (r.low < n && (n = r.low), r.high > o && (o = r.high), r.volume > i && (i = r.volume));
  }
  if (!isFinite(n) || !isFinite(o) || n === o) {
    const c = isFinite(n) ? n : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, i) };
  }
  const d = (o - n) * 0.04;
  return { min: n - d, max: o + d, maxVol: Math.max(1, i) };
}
function hn(t, l, e = !1) {
  const n = e ? sn : Xt, o = Math.max(1, t - pt - n - Dt), i = Math.max(0, Math.round(o * l)), f = o - i;
  return {
    priceY0: pt,
    priceY1: pt + f,
    volumeY0: pt + f + Dt,
    volumeY1: pt + f + Dt + i
  };
}
function Fe(t, l, e, n) {
  const o = l.max - l.min;
  return o <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / o) * (n - e);
}
function je(t, l, e) {
  return Be + (t - l + 0.5) * e;
}
function Ue(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function Ot(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), o = String(l.getHours()).padStart(2, "0"), i = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${o}:${i}`;
}
function mn(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), o = e / n;
  let i;
  return o < 1.5 ? i = 1 : o < 3 ? i = 2 : o < 7 ? i = 5 : i = 10, i * n;
}
function ol(t, l) {
  var M, p, x, v, m;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, o = t.height, i = xt[l.theme] ?? xt.none, f = l.colors ? { ...i, ...l.colors } : i, d = !!l.compact;
  if (e.clearRect(0, 0, n, o), e.fillStyle = f.bg, e.fillRect(0, 0, n, o), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, o), e.clip();
  const c = dn(l.candles.length, n, l.slotW, l.scrollX, d), r = vn(l.candles, c.firstIdx, c.count), u = hn(o, l.showVolume ? l.volumeFraction : 0, d), h = Math.max(un, Math.floor(l.slotW * 0.7)), w = Math.min(l.candles.length, c.firstIdx + c.count);
  for (let D = c.firstIdx; D < w; D++) {
    const C = l.candles[D];
    if (!C) continue;
    const V = je(D, c.firstIdx, l.slotW), g = Fe(C.open, r, u.priceY0, u.priceY1), I = Fe(C.close, r, u.priceY0, u.priceY1), R = Fe(C.high, r, u.priceY0, u.priceY1), P = Fe(C.low, r, u.priceY0, u.priceY1), F = C.close >= C.open, Q = F ? f.wickBull : f.wickBear, G = F ? f.candleBull : f.candleBear;
    l.glow && (e.shadowBlur = 10, e.shadowColor = G), e.strokeStyle = Q, e.lineWidth = fn, e.beginPath(), e.moveTo(Math.round(V) + 0.5, R), e.lineTo(Math.round(V) + 0.5, P), e.stroke(), e.fillStyle = G;
    const K = Math.min(g, I), j = Math.max(1, Math.abs(I - g)), B = Math.round(V - h / 2), X = Math.round(K), Y = Math.round(j);
    if (e.fillRect(B, X, h, Y), l.glow && (e.shadowBlur = 4, e.fillRect(B, X, h, Y)), e.shadowBlur = 0, l.showVolume && r.maxVol > 0) {
      const _ = Math.round(C.volume / r.maxVol * (u.volumeY1 - u.volumeY0));
      _ > 0 && (e.fillStyle = F ? f.volumeBull : f.volumeBear, e.fillRect(
        Math.round(V - h / 2),
        u.volumeY1 - _,
        h,
        _
      ));
    }
  }
  if ((M = l.overlays) != null && M.length) {
    const D = { above: 0, below: 0 }, C = l.overlays.filter((g) => g.kind !== "hline" && !!g.label).length, V = C ? 14 + 14 * C + 12 : 8;
    for (const g of l.overlays)
      g.kind === "hline" ? pn(e, g, n, r, u, f, d, D, V) : gn(e, g, c, r, u, l.slotW);
  }
  (p = l.markers) != null && p.length && Cn(e, f, l.markers, l.candles, c, r, u, l.slotW), kn(e, f, r, u, n, d), d || (In(e, f, l.candles, c, l.slotW, o), Sn(e, f, l.candles, n, o)), (x = l.overlays) != null && x.length && yn(e, f, l.overlays, u), l.hover && (Ln(e, f, l.candles, c, r, u, l.slotW, l.hover, n), bn(e, f, l.candles, c, l.slotW, l.hover, u, ((v = l.overlays) == null ? void 0 : v.length) ?? 0), (m = l.markers) != null && m.length && Mn(e, f, l.markers, l.candles, c, r, u, l.slotW, l.hover, n)), e.restore();
}
function gn(t, l, e, n, o, i) {
  var d;
  const f = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Be,
    o.priceY0,
    /* width: */
    999999,
    o.priceY1 - o.priceY0
  ), t.clip(), l.kind === "line")
    yt(t, l.data, e.firstIdx, f, i, n, o, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else if (l.kind === "band") {
    const c = fl(l.color, l.fillAlpha ?? 0.08);
    wn(t, l.upper, l.lower, e.firstIdx, f, i, n, o, c), yt(t, l.upper, e.firstIdx, f, i, n, o, l.color, 1, !1), yt(t, l.lower, e.firstIdx, f, i, n, o, l.color, 1, !1), (d = l.middle) != null && d.length && yt(t, l.middle, e.firstIdx, f, i, n, o, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function pn(t, l, e, n, o, i, f, d = { above: 0, below: 0 }, c = 8) {
  const r = Fe(l.price, n, o.priceY0, o.priceY1), u = r < o.priceY0 - 0.5, h = r > o.priceY1 + 0.5, w = u || h, M = w ? u ? d.above++ : d.below++ : 0, p = w ? u ? o.priceY0 + c + M * 20 : o.priceY1 - 8 - M * 20 : r, x = f ? Nt : Ke, v = Math.round(p) + 0.5;
  t.save(), w || (t.strokeStyle = l.color, t.lineWidth = l.lineWidth ?? 1, t.setLineDash(l.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Be, v), t.lineTo(e - x, v), t.stroke(), t.setLineDash([]));
  let m = l.label ?? Ue(l.price);
  if (w && m !== "" && (m = (u ? "↑ " : "↓ ") + m), m !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const D = t.measureText(m).width, C = 4, V = 2, g = Be + 2;
    t.fillStyle = l.color, w && (t.globalAlpha = 0.85), t.fillRect(g, p - 7 - V, D + C * 2, 14 + V * 2), t.globalAlpha = 1, t.fillStyle = i.bg && !i.bg.startsWith("rgba(0,0,0,0)") ? i.bg : "#0d1520", t.fillText(m, g + C, p);
  }
  t.restore();
}
function yt(t, l, e, n, o, i, f, d, c, r) {
  if (!l || !l.length) return;
  t.strokeStyle = d, t.lineWidth = c, t.setLineDash(r ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < n; h++) {
    const w = l[h];
    if (typeof w != "number" || !isFinite(w)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const M = je(h, e, o), p = Fe(w, i, f.priceY0, f.priceY1);
    u ? t.lineTo(M, p) : (t.moveTo(M, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function wn(t, l, e, n, o, i, f, d, c) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = c;
  let r = !1, u = -1;
  for (let h = n; h <= o; h++) {
    const w = l[h], M = e[h], p = h < o && typeof w == "number" && typeof M == "number" && isFinite(w) && isFinite(M);
    if (p && !r && (u = h, r = !0), !p && r || h === o && r) {
      const x = p ? h + 1 : h;
      t.beginPath();
      for (let v = u; v < x; v++) {
        const m = je(v, n, i), D = Fe(l[v], f, d.priceY0, d.priceY1);
        v === u ? t.moveTo(m, D) : t.lineTo(m, D);
      }
      for (let v = x - 1; v >= u; v--) {
        const m = je(v, n, i), D = Fe(e[v], f, d.priceY0, d.priceY1);
        t.lineTo(m, D);
      }
      t.closePath(), t.fill(), r = !1;
    }
  }
}
function fl(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), o = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${o},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function yn(t, l, e, n) {
  const o = e.filter((x) => x.kind !== "hline" && !!x.label);
  if (!o.length) return;
  t.save(), t.font = Xe;
  const i = 8, f = 5, d = 12, c = 6, r = 14;
  let u = 0;
  for (const x of o) {
    const v = t.measureText(x.label).width;
    v > u && (u = v);
  }
  const h = i * 2 + d + c + u, w = f * 2 + r * o.length, M = Be + 4, p = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(M, p, h, w), t.textBaseline = "middle", t.textAlign = "left";
  for (let x = 0; x < o.length; x++) {
    const v = o[x], m = p + f + r * (x + 0.5), D = M + i;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(D, m), t.lineTo(D + d, m), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = fl(v.color, v.fillAlpha ?? 0.2), t.fillRect(D, m - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(D + 0.5, m - 4 + 0.5, d - 1, 7)), t.fillStyle = l.text, t.fillText(v.label, D + d + c, m);
  }
  t.restore();
}
function bn(t, l, e, n, o, i, f, d) {
  const c = Math.floor((i.x - Be) / o), r = n.firstIdx + c;
  if (r < 0 || r >= e.length) return;
  const u = e[r];
  if (!u) return;
  const h = u.close - u.open, w = u.open !== 0 ? h / u.open * 100 : 0, M = h >= 0 ? "+" : "", p = [
    ["O", Ue(u.open), void 0],
    ["H", Ue(u.high), void 0],
    ["L", Ue(u.low), void 0],
    ["C", Ue(u.close), void 0],
    ["V", xn(u.volume), void 0],
    ["", `${M}${w.toFixed(2)}%`, h >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const x = 8, v = 4, m = 14;
  let D = x;
  for (const [I, R] of p) {
    const P = I ? `${I} ${R}` : R, F = t.measureText(P).width + 12;
    D += F;
  }
  D += x - 12;
  const C = f.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), V = Be + 4;
  t.fillStyle = l.panelBg, t.fillRect(V, C, D, m + v * 2);
  let g = V + x;
  for (let I = 0; I < p.length; I++) {
    const [R, P, F] = p[I];
    t.fillStyle = l.text, R && (t.globalAlpha = 0.6, t.fillText(R + " ", g, C + v + m / 2), t.globalAlpha = 1, g += t.measureText(R + " ").width), F && (t.fillStyle = F), t.fillText(P, g, C + v + m / 2), g += t.measureText(P).width + 12;
  }
  t.restore();
}
function xn(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Mn(t, l, e, n, o, i, f, d, c, r) {
  if (!n.length) return;
  const u = n.length > 1 ? n[1].start - n[0].start : 6e4, h = Math.max(1, u * 0.5), w = Math.min(n.length, o.firstIdx + o.count), M = 9;
  let p = null;
  for (const P of e) {
    let F = 0, Q = n.length - 1, G = -1;
    for (; F <= Q; ) {
      const B = F + Q >> 1, X = n[B].start - P.timestamp;
      if (Math.abs(X) <= h) {
        G = B;
        break;
      }
      X < 0 ? F = B + 1 : Q = B - 1;
    }
    if (G < 0 || G < o.firstIdx || G >= w) continue;
    const K = je(G, o.firstIdx, d), j = Fe(P.price, i, f.priceY0, f.priceY1);
    if (Math.abs(c.x - K) <= M && Math.abs(c.y - j) <= M) {
      p = { m: P, x: K, y: j };
      break;
    }
  }
  if (!p) return;
  const x = Ot(p.m.timestamp), v = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${x}`,
    `@ ${Ue(p.m.price)}`
  ];
  p.m.label && v.push(p.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const m = 6, D = 14;
  let C = 0;
  for (const P of v) {
    const F = t.measureText(P).width;
    F > C && (C = F);
  }
  const V = C + m * 2, g = v.length * D + m * 2;
  let I = p.x + 12;
  I + V > r - Ke && (I = p.x - 12 - V);
  let R = p.y - g / 2;
  R < f.priceY0 && (R = f.priceY0), R + g > f.priceY1 && (R = f.priceY1 - g), t.fillStyle = l.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(I, R, V, g), t.strokeRect(I + 0.5, R + 0.5, V - 1, g - 1);
  for (let P = 0; P < v.length; P++) {
    const F = v[P];
    t.fillStyle = P === 0 ? p.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(F, I + m, R + m + P * D);
  }
  t.restore();
}
function Sn(t, l, e, n, o) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, f = Tn(i);
  if (!f) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, c = 3, r = t.measureText(f).width, u = n - Ke - d, h = o - Xt + 4;
  t.fillStyle = l.accent, t.fillRect(u - r - d, h - c, r + d * 2, 14 + c * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(f, u, h), t.restore();
}
function Tn(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, o = 24 * n, i = 7 * o;
  return t >= i && t % i === 0 ? t / i + "W" : t >= o && t % o === 0 ? t / o + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function Cn(t, l, e, n, o, i, f, d) {
  if (!n.length) return;
  const c = n.length > 1 ? n[1].start - n[0].start : 6e4, r = Math.max(1, c * 0.5), u = Math.min(n.length, o.firstIdx + o.count), h = (M) => {
    let p = 0, x = n.length - 1;
    for (; p <= x; ) {
      const v = p + x >> 1, m = n[v].start - M;
      if (Math.abs(m) <= r) return v;
      m < 0 ? p = v + 1 : x = v - 1;
    }
    return -1;
  }, w = 7;
  for (const M of e) {
    const p = h(M.timestamp);
    if (p < 0 || p < o.firstIdx || p >= u) continue;
    const x = je(p, o.firstIdx, d), v = Fe(M.price, i, f.priceY0, f.priceY1);
    if (v < f.priceY0 || v > f.priceY1) continue;
    const m = M.color ?? (M.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = m, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), M.kind === "entry" ? (t.moveTo(x, v - w), t.lineTo(x - w, v + w - 1), t.lineTo(x + w, v + w - 1)) : (t.moveTo(x, v + w), t.lineTo(x - w, v - w + 1), t.lineTo(x + w, v - w + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function kn(t, l, e, n, o, i = !1) {
  const f = e.max - e.min;
  if (f <= 0) return;
  const d = n.priceY1 - n.priceY0, c = i ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, r = mn(f, c), u = Math.ceil(e.min / r) * r, h = i ? Nt : Ke;
  t.font = i ? cn : Xe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let w = u; w <= e.max; w += r) {
    const M = Fe(w, e, n.priceY0, n.priceY1);
    M < n.priceY0 || M > n.priceY1 || (t.beginPath(), t.moveTo(Be, Math.round(M) + 0.5), t.lineTo(o - h, Math.round(M) + 0.5), t.stroke(), t.fillText(Ue(w), o - h + 3, M));
  }
  t.globalAlpha = 1;
}
function In(t, l, e, n, o, i) {
  if (n.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(n.count / 6));
  t.font = Xe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const c = Math.min(e.length, n.firstIdx + n.count);
  for (let r = n.firstIdx; r < c; r += d) {
    const u = e[r];
    if (!u) continue;
    const h = je(r, n.firstIdx, o);
    t.fillText(Ot(u.start), h, i - Xt + 4);
  }
  t.globalAlpha = 1;
}
function Ln(t, l, e, n, o, i, f, d, c) {
  const r = Math.floor((d.x - Be) / f), u = Math.max(0, Math.min(e.length - 1, n.firstIdx + r)), h = e[u];
  if (!h) return;
  const w = je(u, n.firstIdx, f);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(w) + 0.5, i.priceY0), t.lineTo(Math.round(w) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const M = Math.max(i.priceY0, Math.min(i.priceY1, d.y));
  t.beginPath(), t.moveTo(Be, Math.round(M) + 0.5), t.lineTo(c - Ke, Math.round(M) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = o.max - o.min;
  if (p > 0) {
    const m = o.max - (M - i.priceY0) / (i.priceY1 - i.priceY0) * p, D = Ue(m);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const C = t.measureText(D).width, V = 4, g = 2;
    t.fillStyle = l.accent, t.fillRect(c - Ke + 2, M - 7 - g, C + V * 2, 14 + g * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(D, c - Ke + 2 + V, M);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const x = Ot(h.start), v = t.measureText(x).width;
  t.fillStyle = l.accent, t.fillRect(w - v / 2 - 4, i.volumeY1 + 2, v + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(x, w, i.volumeY1 + 4), t.restore();
}
const Et = 0.25, At = 6, Rn = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Dn = /* @__PURE__ */ Je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: rn },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const l = t, e = z(null), n = z(null), o = { ...Me }, i = z(0), f = z(0), d = z(0), c = z(1), r = z(null), u = le(() => Math.max(1, l.slotW * c.value));
    let h = null, w = !1, M, p, x, v, m;
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
    function C() {
      if (!(!n.value || !e.value)) {
        if (m = document.createElement("canvas"), l.flat) {
          w = !0, V();
          return;
        }
        try {
          h = new N.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          w = !0;
        }
        if (!w && !h.getContext() && (h.dispose(), h = null, w = !0), w) {
          V();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), M = new N.Scene(), p = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new N.CanvasTexture(m), v.minFilter = N.LinearFilter, v.magFilter = N.LinearFilter, x = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Pt()
          },
          vertexShader: Rn,
          fragmentShader: D,
          transparent: !0
        }), M.add(new N.Mesh(new N.PlaneGeometry(2, 2), x)), V();
      }
    }
    function V() {
      if (!e.value || !h && !w) return;
      const k = e.value.clientWidth, H = e.value.clientHeight;
      !k || !H || !(m.width !== k || m.height !== H) || (m.width = k, m.height = H, i.value = k, f.value = H, h ? (v && (v.dispose(), v = new N.CanvasTexture(m), v.minFilter = N.LinearFilter, v.magFilter = N.LinearFilter, x && (x.uniforms.uTex.value = v)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(k, H)) : n.value && (n.value.width = k, n.value.height = H, n.value.style.width = k + "px", n.value.style.height = H + "px"), g());
    }
    function g() {
      if (!(m != null && m.width)) return;
      if (w) {
        if (!n.value) return;
        ol(m, {
          candles: l.candles,
          slotW: u.value,
          scrollX: d.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: r.value,
          overlays: l.overlays,
          markers: l.markers,
          compact: l.compact,
          colors: l.colors
        });
        const H = n.value.getContext("2d");
        H && (H.clearRect(0, 0, n.value.width, n.value.height), H.drawImage(m, 0, 0));
        return;
      }
      if (!h || !x || !v) return;
      const k = l.theme === "paper";
      x.uniforms.uStrength.value = l.curvature / 45 * 0.55, x.uniforms.uScanlines.value = l.scanlines && !k ? 1 : 0, x.uniforms.uVignette.value = k ? 0 : 1, Ht(x, l.magnify, o, m.width, m.height), ol(m, {
        candles: l.candles,
        slotW: u.value,
        scrollX: d.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: r.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), v.needsUpdate = !0, h.render(M, p);
    }
    O(() => l.theme, () => g()), O(() => l.curvature, () => g()), O(() => l.scanlines, () => g()), O(() => l.glow, () => g()), O(() => l.showVolume, () => g()), O(() => l.volumeFraction, () => g()), O(() => l.slotW, () => g()), O(() => l.candles, () => g(), { deep: !1 }), O(() => l.overlays, () => g(), { deep: !1 }), O(() => l.markers, () => g(), { deep: !1 }), O(() => l.compact, () => g()), O(() => l.magnify, (k) => {
      k || (o.x = Me.x, o.y = Me.y), g();
    }), O(() => l.colors, () => g(), { deep: !0 }), O(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), O(d, () => g()), O(c, () => g()), O(r, () => g()), O(u, () => g());
    let I = null, R = null, P = 0;
    const F = Tt("cathodeResetTick", z(0));
    O(F, () => Q());
    function Q() {
      cancelAnimationFrame(P), P = requestAnimationFrame(V);
    }
    function G(k) {
      k.preventDefault();
    }
    function K() {
      h == null || h.dispose(), h = null, w = !1, C();
    }
    function j(k) {
      if (!n.value) return [-1, -1];
      const H = n.value.getBoundingClientRect();
      return [k.clientX - H.left, k.clientY - H.top];
    }
    function B(k) {
      var He;
      const H = u.value;
      if (H <= 0) return 0;
      const ne = ((He = l.candles) == null ? void 0 : He.length) ?? 0, ve = Math.max(1, Math.floor((i.value || 1) / H)), Se = Math.max(0, ne - ve);
      return Math.max(0, Math.min(k, Se * H));
    }
    function X(k) {
      var ve;
      if (k.deltaX !== 0 || k.shiftKey && k.deltaY !== 0) {
        const Se = k.deltaX !== 0 ? k.deltaX : k.deltaY;
        d.value = B(d.value + Se);
        return;
      }
      if (k.deltaY === 0) return;
      const [H] = j(k), ne = u.value;
      if (H >= 0 && ne > 0 && ((ve = l.candles) != null && ve.length)) {
        const Se = Math.max(1, Math.floor((i.value || 1) / ne)), lt = Math.max(0, l.candles.length - Se - Math.floor(d.value / ne)) + (H - 8) / ne, ut = Math.exp(-k.deltaY * 15e-4), nt = Math.max(Et, Math.min(At, c.value * ut));
        c.value = nt;
        const Ne = l.slotW * nt, Ie = Math.max(1, Math.floor((i.value || 1) / Ne)), ee = lt - (H - 8) / Ne, $e = Math.max(0, l.candles.length - Ie - ee);
        d.value = B($e * Ne);
      } else {
        const Se = Math.exp(-k.deltaY * 15e-4);
        c.value = Math.max(Et, Math.min(At, c.value * Se));
      }
    }
    let Y = !1, _ = 0, U = 0;
    function $(k) {
      k.button === 0 && (Y = !0, _ = k.clientX, U = d.value, r.value = null, e.value && e.value.focus());
    }
    function S(k) {
      const H = Math.exp(k * 0.18);
      c.value = Math.max(Et, Math.min(At, c.value * H)), d.value = B(d.value);
    }
    function q(k) {
      const H = u.value, ne = k.shiftKey ? 20 : 3;
      switch (k.key) {
        case "ArrowLeft":
          k.preventDefault(), d.value = B(d.value + H * ne);
          break;
        case "ArrowRight":
          k.preventDefault(), d.value = B(d.value - H * ne);
          break;
        case "ArrowUp":
          k.preventDefault(), S(1);
          break;
        case "ArrowDown":
          k.preventDefault(), S(-1);
          break;
        case "Home":
          k.preventDefault(), d.value = B(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          k.preventDefault(), d.value = 0;
          break;
      }
    }
    function te(k) {
      if (Y) {
        const H = k.clientX - _;
        d.value = B(U + H);
        return;
      }
    }
    function se() {
      Y = !1;
    }
    function ie(k) {
      if (k.touches.length !== 1) return;
      const H = k.touches[0];
      Y = !0, _ = H.clientX, U = d.value, r.value = null;
    }
    function fe(k) {
      if (!Y || k.touches.length !== 1) return;
      k.preventDefault();
      const ne = k.touches[0].clientX - _;
      d.value = B(U + ne);
    }
    function ae() {
      Y = !1;
    }
    function ce(k) {
      if (l.magnify && n.value) {
        const ve = $t(k, n.value);
        o.x = ve.x, o.y = ve.y, g();
      }
      if (Y) return;
      const [H, ne] = j(k);
      if (H < 0 || ne < 0) {
        r.value = null;
        return;
      }
      r.value = { x: H, y: ne };
    }
    function ke() {
      r.value = null, o.x = Me.x, o.y = Me.y, g();
    }
    Ge(() => {
      document.addEventListener("mousemove", te), document.addEventListener("mouseup", se), Pe(() => {
        var k;
        C(), n.value && (n.value.addEventListener("webglcontextlost", G), n.value.addEventListener("webglcontextrestored", K)), e.value && (I = new ResizeObserver(() => V()), I.observe(e.value), R = new IntersectionObserver((H) => {
          H.some((ne) => ne.isIntersecting) && Q();
        }), R.observe(e.value)), window.addEventListener("resize", Q), (k = window.visualViewport) == null || k.addEventListener("resize", Q);
      });
    }), Qe(() => {
      var k, H, ne;
      document.removeEventListener("mousemove", te), document.removeEventListener("mouseup", se), (k = n.value) == null || k.removeEventListener("webglcontextlost", G), (H = n.value) == null || H.removeEventListener("webglcontextrestored", K), I == null || I.disconnect(), R == null || R.disconnect(), window.removeEventListener("resize", Q), (ne = window.visualViewport) == null || ne.removeEventListener("resize", Q), cancelAnimationFrame(P), h == null || h.dispose();
    });
    const xe = le(() => xt[l.theme] ?? xt.none), De = le(() => ({
      background: xe.value.bg
    }));
    return (k, H) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ae(De.value),
      tabindex: "0",
      onKeydown: q
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Oe(X, ["prevent"]),
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
}), ao = /* @__PURE__ */ et(Dn, [["__scopeId", "data-v-255bf71a"]]), Ut = z(0), Bt = 28, st = 12;
let _t = 10, Mt = "cathode.layout", St = !1;
const be = z({});
function En(t, l = "cathode.layout") {
  if (!St) {
    St = !0, Mt = l;
    try {
      const e = localStorage.getItem(Mt);
      if (e) {
        be.value = JSON.parse(e), al();
        return;
      }
    } catch {
    }
    be.value = { ...t }, al();
  }
}
function al() {
  let t = 10;
  for (const l of Object.values(be.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  _t = t;
}
function tt() {
  localStorage.setItem(Mt, JSON.stringify(be.value));
}
function An(t) {
  St = !1, localStorage.removeItem(Mt), be.value = { ...t }, tt(), St = !0, Ut.value++;
}
function dl(t) {
  _t++, be.value[t] && (be.value[t].zIndex = _t);
}
function Fn(t, l) {
  be.value[t].visible = l, tt();
}
function Bn(t, l) {
  be.value[t].minimized = l, l && (be.value[t].maximized = !1), tt();
}
function _n(t, l) {
  be.value[t].maximized = l, l && (be.value[t].minimized = !1, dl(t)), tt();
}
function Yn(t, l, e) {
  be.value[t].x = Math.round(l), be.value[t].y = Math.round(e), tt();
}
function Wn(t, l, e) {
  be.value[t].w = Math.round(l), be.value[t].h = Math.round(e), tt();
}
function io(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), o = Math.ceil(e.length / n), i = Math.floor((t - st * (n + 1)) / n), f = Math.floor((l - st * (o + 1)) / o), d = {};
  return e.forEach((c, r) => {
    const u = r % n, h = Math.floor(r / n);
    d[c] = {
      x: st + u * (i + st),
      y: st + h * (f + st),
      w: i,
      h: f,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: r + 1
    };
  }), d;
}
function vl() {
  return {
    containers: be,
    TITLEBAR_H: Bt,
    load: En,
    save: tt,
    reset: An,
    bringToFront: dl,
    setVisible: Fn,
    setMinimized: Bn,
    setMaximized: _n,
    updatePos: Yn,
    updateSize: Wn
  };
}
const zn = { class: "ws-toolbar" }, Pn = {
  key: 0,
  class: "ws-restore-menu"
}, Hn = {
  key: 0,
  class: "ws-restore-empty"
}, $n = ["onClick"], Vn = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: o, setVisible: i } = vl(), f = z(null);
    Jt("cathodeWorkspace", f), Jt("cathodeResetTick", Ut), Ge(() => {
      if (!f.value) return;
      const { clientWidth: v, clientHeight: m } = f.value, D = l.initialLayout ?? {};
      n(D, l.storageKey ?? "cathode.layout");
      const C = Object.keys(e.value)[0];
      C && d(C);
    });
    function d(v) {
      var D;
      document.querySelectorAll(".cc").forEach((C) => C.classList.remove("cc-focused"));
      const m = (D = f.value) == null ? void 0 : D.querySelector(`#cc-${v}`);
      m && m.classList.add("cc-focused");
    }
    function c() {
      !f.value || !l.initialLayout || o(l.initialLayout);
    }
    function r(v) {
      const m = v.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const u = z(!1), h = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function w(v) {
      i(v, !0), u.value = !1;
    }
    function M(v) {
      if (!u.value) return;
      const m = v.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (u.value = !1);
    }
    function p(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Ge(() => {
      document.addEventListener("click", M), document.addEventListener("keydown", p);
    }), Qe(() => {
      document.removeEventListener("click", M), document.removeEventListener("keydown", p);
    });
    function x(v) {
      var m;
      return ((m = l.containerTitles) == null ? void 0 : m[v]) ?? v;
    }
    return (v, m) => (pe(), we("div", {
      ref_key: "workspaceEl",
      ref: f,
      class: "cathode-workspace",
      onMousedown: r
    }, [
      Ft(v.$slots, "default", {}, void 0, !0),
      Ft(v.$slots, "overlay", {}, void 0, !0),
      re("div", zn, [
        t.initialLayout ? (pe(), we("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : ze("", !0),
        m[1] || (m[1] = re("div", { class: "ws-sep" }, null, -1)),
        re("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (D) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      rl(Il, { name: "menu" }, {
        default: Ll(() => [
          u.value ? (pe(), we("div", Pn, [
            m[3] || (m[3] = re("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? ze("", !0) : (pe(), we("div", Hn, " No closed panels ")),
            (pe(!0), we(Rl, null, Dl(h(), (D) => (pe(), we("div", {
              key: D,
              class: "ws-restore-item",
              onClick: (C) => w(D)
            }, [
              m[2] || (m[2] = re("span", { class: "ws-restore-icon" }, "⊞", -1)),
              El(" " + We(x(D)), 1)
            ], 8, $n))), 128))
          ])) : ze("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), ro = /* @__PURE__ */ et(Vn, [["__scopeId", "data-v-5838d04b"]]), Xn = ["id"], Nn = { class: "cc-title" }, On = {
  key: 0,
  class: "cc-size-badge"
}, Un = { class: "cc-controls" }, Kn = ["title"], Gn = { class: "cc-body" }, jn = 200, qn = 80, il = 60, Zn = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: o, setMinimized: i, setMaximized: f, updatePos: d, updateSize: c } = vl(), r = Tt("cathodeWorkspace", z(null)), u = le(() => e.value[l.id]), h = le(() => {
      const S = u.value, q = l.curvature ?? 0;
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
    let w = !1, M = 0, p = 0;
    function x(S) {
      var se;
      if (S.target.closest(".cc-btn") || u.value.maximized) return;
      n(l.id), w = !0;
      const q = (se = r.value) == null ? void 0 : se.querySelector(`#cc-${l.id}`);
      if (!q) return;
      const te = q.getBoundingClientRect();
      M = S.clientX - te.left, p = S.clientY - te.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", m), S.preventDefault();
    }
    function v(S) {
      var fe;
      if (!w || !r.value) return;
      const q = r.value.getBoundingClientRect(), te = ((fe = u.value) == null ? void 0 : fe.w) ?? 300;
      let se = S.clientX - q.left - M, ie = S.clientY - q.top - p;
      se = Math.max(il - te, Math.min(q.width - il, se)), ie = Math.max(0, Math.min(q.height - Bt, ie)), d(l.id, se, ie);
    }
    function m() {
      w = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", m);
    }
    let D = !1, C = 0, V = 0, g = 0, I = 0;
    const R = z("");
    function P(S) {
      u.value.maximized || (n(l.id), D = !0, C = S.clientX, V = S.clientY, g = u.value.w, I = u.value.h, document.addEventListener("mousemove", F), document.addEventListener("mouseup", Q), S.preventDefault(), S.stopPropagation());
    }
    function F(S) {
      if (!D) return;
      const q = Math.max(jn, g + (S.clientX - C)), te = Math.max(qn, I + (S.clientY - V));
      c(l.id, q, te), R.value = `${Math.round(q)}×${Math.round(te)}`;
    }
    function Q() {
      D = !1, R.value = "", document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", Q), G.value++;
    }
    const G = z(0);
    O(Ut, () => {
      G.value++;
    }), Qe(() => {
      var S;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", Q), (S = K.value) == null || S.removeEventListener("scroll", B), X();
    });
    const K = z(null);
    function j(S) {
      if (l.canvas) return [];
      const q = S.children[0];
      return q ? Array.from(q.children) : [];
    }
    function B() {
      const S = K.value, q = l.curvature ?? 0;
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
        const ce = ae.getBoundingClientRect(), ke = S.getBoundingClientRect(), xe = ce.top - ke.top + ce.height / 2, De = Math.min(1, Math.abs(xe - ie) / (se / 2)), k = 1 + fe * Math.cos(De * Math.PI / 2), H = parseFloat(ae.dataset.origFs), ne = ae.dataset.origLh, ve = ne === "normal" ? H * 1.4 : parseFloat(ne);
        isNaN(H) || (ae.style.fontSize = `${(H * k).toFixed(2)}px`), isNaN(ve) || (ae.style.lineHeight = `${(ve * k).toFixed(2)}px`);
      });
    }
    function X() {
      const S = K.value;
      S && j(S).forEach((q) => {
        q.style.fontSize = "", q.style.lineHeight = "", delete q.dataset.origFs, delete q.dataset.origLh;
      });
    }
    O(() => l.curvature, (S) => {
      (S ?? 0) === 0 ? X() : B();
    }), Ge(() => {
      var S;
      (S = K.value) == null || S.addEventListener("scroll", B, { passive: !0 }), Pe(B);
    });
    function Y() {
      i(l.id, !u.value.minimized), Pe(() => {
        G.value++;
      });
    }
    function _() {
      f(l.id, !u.value.maximized), Pe(() => {
        G.value++;
      });
    }
    function U() {
      o(l.id, !1);
    }
    function $() {
      n(l.id);
    }
    return (S, q) => u.value && u.value.visible ? (pe(), we("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: Al(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ae(h.value),
      onMousedown: $
    }, [
      re("div", {
        class: "cc-titlebar",
        onMousedown: x
      }, [
        q[0] || (q[0] = re("span", { class: "cc-status-dot" }, null, -1)),
        re("span", Nn, We(t.title), 1),
        R.value ? (pe(), we("span", On, We(R.value), 1)) : ze("", !0),
        re("div", Un, [
          re("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Oe(Y, ["stop"])
          }, "─"),
          re("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Oe(_, ["stop"])
          }, We(u.value.maximized ? "⤡" : "⤢"), 9, Kn),
          re("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Oe(U, ["stop"])
          }, "✕")
        ])
      ], 32),
      sl(re("div", Gn, [
        re("div", {
          ref_key: "bodyEl",
          ref: K,
          class: "cc-screen",
          onScroll: B
        }, [
          Ft(S.$slots, "default", { resizeKey: G.value }, void 0, !0),
          q[1] || (q[1] = re("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Fl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (pe(), we("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Oe(P, ["stop"])
      }, null, 32)) : ze("", !0)
    ], 46, Xn)) : ze("", !0);
  }
}), so = /* @__PURE__ */ et(Zn, [["__scopeId", "data-v-d8a49f79"]]), Jn = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Qn = `
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
    const l = t, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, n = z(null), o = z(null);
    let i = null, f = !1, d, c, r, u, h, w = null, M = 0;
    function p(g) {
      g - M >= eo && (m(), M = g), w = requestAnimationFrame(p);
    }
    function x() {
      if (!n.value || !h) return;
      const g = n.value.clientWidth, I = n.value.clientHeight;
      g <= 0 || I <= 0 || h.width === g && h.height === I || (h.width = g, h.height = I, i && i.setSize(g, I, !1), o.value && (o.value.width = g, o.value.height = I, o.value.style.width = g + "px", o.value.style.height = I + "px"));
    }
    function v() {
      if (!(h != null && h.width)) return;
      const g = h.getContext("2d");
      if (!g) return;
      const I = h.width, R = h.height, P = e[l.theme] ?? e.none;
      g.clearRect(0, 0, I, R), g.fillStyle = P.bg, g.fillRect(0, 0, I, R);
      const F = Date.now(), Q = (F / 500 | 0) % 2 === 0, G = (F / 400 | 0) % 4;
      g.font = `bold ${Math.max(14, Math.min(I, R) * 0.06)}px monospace`, g.textAlign = "center", g.textBaseline = "middle", g.fillStyle = P.text, l.glow && (g.shadowColor = P.text, g.shadowBlur = 14);
      const K = ".".repeat(G).padEnd(3, " "), j = `${l.label}${K}`;
      if (g.fillText(j, I / 2, R / 2), g.shadowBlur = 0, Q) {
        const B = g.measureText(j), X = g.measureText("M").width, Y = parseFloat(g.font), _ = I / 2 + B.width / 2 + 4, U = R / 2 - Y / 2 + 2;
        g.fillStyle = P.cursor, l.glow && (g.shadowColor = P.cursor, g.shadowBlur = 12), g.fillRect(_, U, X * 0.7, Y * 0.95), g.shadowBlur = 0;
      }
    }
    function m() {
      if (!h) return;
      if (v(), f) {
        if (!o.value) return;
        const I = o.value.getContext("2d");
        I && I.drawImage(h, 0, 0);
        return;
      }
      if (!i || !r || !u) return;
      const g = l.theme === "paper";
      r.uniforms.uStrength.value = l.curvature / 45 * 0.55, r.uniforms.uScanlines.value = l.scanlines && !g ? 1 : 0, r.uniforms.uVignette.value = g ? 0 : 1, u.needsUpdate = !0, i.render(d, c);
    }
    function D() {
      if (!(!o.value || !n.value)) {
        h = document.createElement("canvas");
        try {
          i = new N.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !i.getContext() && (i.dispose(), i = null, f = !0), f) {
          x();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), d = new N.Scene(), c = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), u = new N.CanvasTexture(h), u.minFilter = N.LinearFilter, u.magFilter = N.LinearFilter, r = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: u },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Jn,
          fragmentShader: Qn,
          transparent: !0
        }), d.add(new N.Mesh(new N.PlaneGeometry(2, 2), r)), x();
      }
    }
    let C = null;
    Ge(() => {
      D(), m(), w = requestAnimationFrame(p), n.value && (C = new ResizeObserver(() => x()), C.observe(n.value));
    }), Qe(() => {
      w !== null && cancelAnimationFrame(w), C == null || C.disconnect(), i && i.dispose(), u == null || u.dispose(), r == null || r.dispose();
    }), O(() => [l.theme, l.curvature, l.scanlines, l.glow, l.label], () => m());
    const V = le(() => ({
      background: (e[l.theme] ?? e.none).bg
    }));
    return (g, I) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-loader-wrap",
      style: Ae(V.value)
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
  no as CathodeGrid,
  co as CathodeLoader,
  nn as CathodeLog,
  oo as CathodeTerminal,
  ro as CathodeWorkspace,
  bt as LOG_THEME_COLORS,
  io as buildDefaultLayout,
  vl as useCathodeLayout
};
