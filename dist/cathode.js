import { defineComponent as Qe, ref as z, reactive as It, computed as te, watch as K, inject as Tt, nextTick as $e, onMounted as Ge, onUnmounted as et, openBlock as pe, createElementBlock as we, normalizeStyle as Be, createElementVNode as se, withModifiers as Oe, withKeys as In, createCommentVNode as He, toDisplayString as Pe, createVNode as cn, withDirectives as un, vModelText as Ln, provide as Qt, renderSlot as Bt, Transition as Rn, withCtx as Dn, Fragment as En, renderList as An, createTextVNode as Fn, normalizeClass as Bn, vShow as _n } from "vue";
import * as X from "three";
const st = {
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
}, he = 30, Lt = 12, Yn = 10, fn = 28;
function Wn(t, n) {
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
function en(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, i = st[n.theme] ?? st.none, { cols: f, rows: v, pinnedRows: s, rowHeight: r, scrollY: u, scrollX: h, glow: m } = n;
  e.clearRect(0, 0, l, o), e.fillStyle = i.bg, e.fillRect(0, 0, l, o), e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip();
  const M = s.length * r, p = n.aggregateRow ? fn : 0, S = o - he - M - p;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, l, he), e.textBaseline = "middle", e.textAlign = "left";
  let d = -h;
  for (let E = 0; E < f.length; E++) {
    const P = f[E];
    if (d + P.width <= 0) {
      d += P.width;
      continue;
    }
    if (d >= l) break;
    const N = !!n.colFilters[P.colId], H = n.sortColId === P.colId, _ = (P.colDef.headerName ?? P.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(d, 0, P.width, he), e.clip(), e.font = `bold ${Yn}px system-ui, -apple-system, sans-serif`, e.fillStyle = N ? i.accent : i.textHeader, m ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(_, d + 8, he / 2), e.shadowBlur = 4, e.fillText(_, d + 8, he / 2), e.shadowBlur = 0) : e.fillText(_, d + 8, he / 2), H) {
      const O = e.measureText(_).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", d + 8 + O + 4, he / 2);
    }
    P.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = N ? i.accent : i.textHeader, e.globalAlpha = N ? 1 : 0.38, e.fillText("⌕", d + P.width - 20, he / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(d + P.width - 0.5, 0), e.lineTo(d + P.width - 0.5, he), e.stroke(), d += P.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, he - 0.5), e.lineTo(l, he - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, he, l, S), e.clip();
  const g = Math.max(0, Math.floor(u / r)), T = Math.min(v.length, Math.ceil((u + S) / r)), D = n.selectionAnchorRow ?? n.selectedRow, V = n.selectionAnchorCol ?? n.selectedCol, I = n.selectedRow >= 0 && D >= 0 ? Math.min(n.selectedRow, D) : -1, y = n.selectedRow >= 0 && D >= 0 ? Math.max(n.selectedRow, D) : -1, C = n.selectedCol >= 0 && V >= 0 ? Math.min(n.selectedCol, V) : -1, Y = n.selectedCol >= 0 && V >= 0 ? Math.max(n.selectedCol, V) : -1, B = y > I || Y > C;
  let Q = Number.POSITIVE_INFINITY, q = Number.NEGATIVE_INFINITY, G = Number.POSITIVE_INFINITY, J = Number.NEGATIVE_INFINITY;
  for (let E = g; E < T; E++) {
    const P = v[E], N = he + E * r - u;
    E % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, N, l, r));
    const H = E >= I && E <= y;
    E === n.hoveredRow && !H && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, N, l, r)), H && !B && (e.fillStyle = Rt(i.accent, 0.1), e.fillRect(0, N, l, r)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, N + r - 0.5), e.lineTo(l, N + r - 0.5), e.stroke();
    let _ = -h;
    for (let O = 0; O < f.length; O++) {
      const x = f[O];
      if (_ + x.width <= 0) {
        _ += x.width;
        continue;
      }
      if (_ >= l) break;
      const U = H && O >= C && O <= Y;
      U && B && (e.fillStyle = Rt(i.accent, 0.14), e.fillRect(_, N, x.width, r)), U && (_ < Q && (Q = _), _ + x.width > q && (q = _ + x.width), N < G && (G = N), N + r > J && (J = N + r));
      const ce = n.getCellStyle(x, P), le = ce.color ?? i.text, ie = ce.textAlign ?? "left", fe = n.formatCell(x, P);
      e.save(), e.beginPath(), e.rect(_ + 1, N, x.width - 2, r), e.clip(), e.font = `${Lt}px system-ui, -apple-system, sans-serif`, e.fillStyle = le, e.textBaseline = "middle";
      const re = ie === "right" ? _ + x.width - 8 : _ + 8;
      e.textAlign = ie === "right" ? "right" : "left";
      const me = N + r / 2;
      m ? (e.shadowColor = le, e.shadowBlur = 12, e.fillText(fe, re, me), e.shadowBlur = 6, e.fillText(fe, re, me), e.shadowBlur = 2, e.fillText(fe, re, me), e.shadowBlur = 0) : e.fillText(fe, re, me), e.restore(), E === n.selectedRow && O === n.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(_ + 1.5, N + 1.5, x.width - 3, r - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(_ + x.width - 0.5, N), e.lineTo(_ + x.width - 0.5, N + r), e.stroke(), _ += x.width;
    }
  }
  if (B && Q < q && G < J && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(Q + 0.5, G + 0.5, q - Q - 1, J - G - 1)), e.restore(), s.length > 0) {
    const E = o - M - p;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, E - 0.5), e.lineTo(l, E - 0.5), e.stroke();
    for (let P = 0; P < s.length; P++) {
      const N = s[P], H = E + P * r;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, H, l, r);
      let _ = -h;
      for (let O = 0; O < f.length; O++) {
        const x = f[O];
        if (_ + x.width <= 0) {
          _ += x.width;
          continue;
        }
        if (_ >= l) break;
        const U = n.getCellStyle(x, N), ce = U.color ?? i.text, le = U.textAlign ?? "left", ie = n.formatCell(x, N);
        e.save(), e.beginPath(), e.rect(_ + 1, H, x.width - 2, r), e.clip(), e.font = `bold ${Lt}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle", le === "right" ? (e.textAlign = "right", e.fillText(ie, _ + x.width - 8, H + r / 2)) : (e.textAlign = "left", e.fillText(ie, _ + 8, H + r / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(_ + x.width - 0.5, H), e.lineTo(_ + x.width - 0.5, H + r), e.stroke(), _ += x.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H + r - 0.5), e.lineTo(l, H + r - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const E = o - p;
    e.fillStyle = Rt(i.accent, 0.1), e.fillRect(0, E, l, p), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, E - 0.5), e.lineTo(l, E - 0.5), e.stroke();
    let P = -h;
    for (let N = 0; N < f.length; N++) {
      const H = f[N];
      if (P + H.width <= 0) {
        P += H.width;
        continue;
      }
      if (P >= l) break;
      const O = n.getCellStyle(H, n.aggregateRow).textAlign ?? "left", x = n.aggregateRow[H.colId] ?? "";
      e.save(), e.beginPath(), e.rect(P + 1, E, H.width - 2, p), e.clip(), e.font = `bold ${Lt}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", m && (e.shadowColor = i.accent, e.shadowBlur = 8), O === "right" ? (e.textAlign = "right", e.fillText(x, P + H.width - 8, E + p / 2)) : (e.textAlign = "left", e.fillText(x, P + 8, E + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(P + H.width - 0.5, E), e.lineTo(P + H.width - 0.5, E + p), e.stroke(), P += H.width;
    }
  }
  e.restore();
}
function Rt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), o = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${o},${n})`;
}
function zn(t, n, e) {
  const l = t - 0.5, o = n - 0.5, i = (l * l + o * o) * e, f = l * (1 + i) * i, v = o * (1 + i) * i;
  return [t + f, n + v * 0.15];
}
function Pn(t, n, e, l, o) {
  const i = t / e, f = 1 - n / l, [v, s] = zn(i, f, o);
  return v < 0 || v > 1 || s < 0 || s > 1 ? [-1, -1] : [v * e, (1 - s) * l];
}
function Dt(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function Hn(t, n, e) {
  return t >= n + e - 24 && t < n + e;
}
function tn(t, n, e) {
  const l = n + e;
  return t >= l - 6 && t <= l + 1;
}
function nn(t, n, e, l, o, i, f, v, s, r = !1) {
  const u = t + s;
  let h = -1, m = 0;
  for (let g = 0; g < e.length; g++) {
    if (u >= m && u < m + e[g].width) {
      h = g;
      break;
    }
    m += e[g].width;
  }
  if (n < he) return { area: "header", colIdx: h, rowIdx: -1 };
  const M = r ? fn : 0;
  if (M > 0 && n >= f - M)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const p = v * o;
  if (p > 0 && n >= f - p - M) {
    const g = Math.floor((n - (f - p - M)) / o);
    return { area: "pinned", colIdx: h, rowIdx: g };
  }
  const S = n - he + i, d = Math.floor(S / o);
  return d >= 0 && d < l ? { area: "body", colIdx: h, rowIdx: d } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const $n = 500, Vn = $n / 2, Xn = 1.6, Wt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, zt = `
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
`, Pt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Ht() {
  return {
    uMouseUV: { value: new X.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Xn },
    uLensTint: { value: new X.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const xe = { x: -999, y: -999 };
function $t(t, n, e, l, o) {
  const i = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = i && o > 0 ? Vn / o : 0, t.uniforms.uAspect.value = o > 0 ? l / o : 1;
}
function Vt(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const Nn = ["value"], On = ["disabled"], Un = ["disabled"], Kn = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Gn = 28, jn = 600, qn = /* @__PURE__ */ Qe({
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
    const e = t, l = n, o = z(e.rowData ?? []), i = z(e.pinnedBottomRowData ?? []), f = z(""), v = z(null), s = It({}), r = It({}), u = It(/* @__PURE__ */ new Set()), h = z(0), m = z(0), M = z(0), p = z(0), S = z(0), d = z(-1), g = z(null), T = z(null), D = z(null), V = { ...xe }, I = z({ x: 0, y: he }), y = z("");
    function C(a) {
      return a.colId ?? a.field ?? (a.headerName ? a.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const Y = te(() => {
      const a = e.defaultColDef ?? {};
      return e.columnDefs.filter((c) => !u.has(C(c))).map((c) => {
        const b = C(c), R = { ...a, ...c };
        return { colId: b, colDef: R, width: r[b] ?? R.width ?? 100 };
      });
    }), B = te(() => {
      const a = m.value;
      if (!a) return Y.value;
      const c = Y.value.reduce((k, A) => k + A.width, 0);
      if (!c || c >= a) return Y.value;
      const b = a / c;
      let R = 0;
      return Y.value.map((k, A) => {
        const j = A === Y.value.length - 1 ? a - R : Math.max(8, Math.round(k.width * b));
        return R += j, { ...k, width: j };
      });
    }), Q = te(() => {
      const a = B.value.reduce((c, b) => c + b.width, 0);
      return Math.max(0, a - m.value);
    }), q = te(() => {
      const a = i.value.length * e.rowHeight;
      return Math.max(0, M.value - he - a);
    }), G = te(
      () => Math.max(0, O.value.length * e.rowHeight - q.value)
    ), J = te(
      () => Math.max(1, Math.floor(q.value / e.rowHeight))
    ), E = te(
      () => O.value.length === 0 ? 0 : Math.min(O.value.length - 1, Math.floor(p.value / e.rowHeight))
    ), P = te(
      () => Math.min(O.value.length - 1, E.value + J.value - 1)
    );
    function N(a, c) {
      if (c.colDef.valueGetter) return c.colDef.valueGetter({ data: a, colDef: c.colDef });
      if (c.colDef.field) return a[c.colDef.field];
    }
    function H(a, c) {
      const b = N(c, a);
      return a.colDef.valueFormatter ? a.colDef.valueFormatter({ value: b, data: c, colDef: a.colDef }) ?? "" : a.colDef.cellRenderer ? (a.colDef.cellRenderer({ value: b, data: c, colDef: a.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function _(a, c) {
      return a.colDef.cellStyle ? typeof a.colDef.cellStyle == "function" ? a.colDef.cellStyle({ value: N(c, a), data: c, colDef: a.colDef }) ?? {} : a.colDef.cellStyle : {};
    }
    const O = te(() => {
      h.value;
      let a = o.value;
      const c = f.value.trim().toLowerCase();
      c && (a = a.filter(
        (b) => Y.value.some(
          (R) => String(N(b, R) ?? "").toLowerCase().includes(c)
        )
      ));
      for (const [b, R] of Object.entries(s)) {
        if (!R) continue;
        const k = Y.value.find((A) => A.colId === b);
        if (k)
          if (R.startsWith("__eq__")) {
            const A = R.slice(6).toLowerCase();
            a = a.filter((W) => String(N(W, k) ?? "").toLowerCase() === A);
          } else {
            const A = R.toLowerCase();
            a = a.filter((W) => String(N(W, k) ?? "").toLowerCase().includes(A));
          }
      }
      if (v.value) {
        const { colId: b, dir: R } = v.value, k = Y.value.find((A) => A.colId === b);
        k && (a = [...a].sort((A, W) => {
          const j = N(A, k), de = N(W, k);
          let ge = 0;
          return k.colDef.comparator ? ge = k.colDef.comparator(j, de) : typeof j == "number" && typeof de == "number" ? ge = j - de : ge = String(j ?? "").localeCompare(String(de ?? ""), void 0, { numeric: !0 }), R === "asc" ? ge : -ge;
        }));
      }
      return a;
    }), x = te(() => {
      const a = Y.value.filter((k) => k.colDef.aggFunc != null);
      if (a.length === 0) return null;
      const c = O.value, b = {};
      for (const k of a) {
        const A = c.map((j) => N(j, k)), W = Wn(A, k.colDef.aggFunc);
        if (W == null) {
          b[k.colId] = "";
          continue;
        }
        b[k.colId] = k.colDef.aggValueFormatter ? k.colDef.aggValueFormatter(W) : String(W);
      }
      const R = a[0].colId;
      return b[R] === "" && (b[R] = "Σ"), b;
    });
    K(O, () => {
      p.value = 0, g.value = null;
    }), K(Q, () => {
      S.value = Math.min(S.value, Q.value);
    }), K(G, () => {
      p.value = Math.min(p.value, G.value);
    });
    function U(a) {
      const c = a * e.rowHeight, b = c + e.rowHeight;
      c < p.value ? p.value = c : b > p.value + q.value && (p.value = Math.min(G.value, b - q.value));
    }
    function ce() {
      p.value = Math.max(0, p.value - q.value), ae();
    }
    function le() {
      p.value = Math.min(G.value, p.value + q.value), ae();
    }
    let ie = !1, fe = "", re = 0, me = 0, ue = !1, Me = !1, Ee = 0, Ie = 0, L = 0, $ = 0, ee = !1;
    function Se(a, c) {
      var b;
      ie = !0, fe = a, re = c, me = ((b = B.value.find((R) => R.colId === a)) == null ? void 0 : b.width) ?? 100, ue = !1;
    }
    function Le(a) {
      if (Me) {
        const A = Ee - a.clientX, W = Ie - a.clientY;
        (Math.abs(A) > 4 || Math.abs(W) > 4) && (ee = !0), S.value = Math.max(0, Math.min(Q.value, L + A)), p.value = Math.max(0, Math.min(G.value, $ + W)), ae();
        return;
      }
      if (!ie) return;
      const c = m.value, b = Math.max(30, me + (a.clientX - re)), R = Y.value.filter((A) => A.colId !== fe).reduce((A, W) => A + W.width, 0), k = c - b;
      k > 10 && (r[fe] = Math.max(10, Math.round(b * R / k))), ae();
    }
    function Ve() {
      Me && (ee && (ue = !0), Me = !1), ie && (ie = !1, ue = !0, l("column-resized"));
    }
    function ct(a) {
      if (a.touches.length !== 1) return;
      const c = a.touches[0];
      Me = !0, ee = !1, Ee = c.clientX, Ie = c.clientY, L = S.value, $ = p.value;
    }
    function ut(a) {
      if (!Me || a.touches.length !== 1) return;
      a.preventDefault();
      const c = a.touches[0], b = Ee - c.clientX, R = Ie - c.clientY;
      (Math.abs(b) > 4 || Math.abs(R) > 4) && (ee = !0), S.value = Math.max(0, Math.min(Q.value, L + b)), p.value = Math.max(0, Math.min(G.value, $ + R)), ae();
    }
    function qe() {
      Me && (ee && (ue = !0), Me = !1);
    }
    const Te = z(null), ne = z(null), Xe = Tt("cathodeResetTick", z(0));
    K(Xe, () => ot());
    let oe = null, Ae = !1;
    function Ct() {
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
    let We, ft, ke, Ce, ve;
    const w = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Wt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${zt}

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

    ${Pt}

    gl_FragColor = color;
  }
`;
    function F() {
      if (!(!ne.value || !Te.value)) {
        ve = document.createElement("canvas");
        try {
          oe = new X.WebGLRenderer({ canvas: ne.value, antialias: !1, alpha: !0 });
        } catch {
          Ae = !0;
        }
        if (!Ae && !oe.getContext() && (oe.dispose(), oe = null, Ae = !0), Ae) {
          Z();
          return;
        }
        oe.setPixelRatio(1), oe.setClearColor(0, 0), We = new X.Scene(), ft = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), Ce = new X.CanvasTexture(ve), Ce.minFilter = X.LinearFilter, Ce.magFilter = X.LinearFilter, ke = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: Ce },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new X.Color(0) },
            ...Ht()
          },
          vertexShader: Kn,
          fragmentShader: w,
          transparent: !0
        }), We.add(new X.Mesh(new X.PlaneGeometry(2, 2), ke)), Z();
      }
    }
    function Z() {
      if (!Te.value || !oe && !Ae) return;
      const a = Te.value.clientWidth, c = Te.value.clientHeight - (e.pagination ? Gn : 0);
      if (!a || !c) return;
      const b = ve.width !== a || ve.height !== c;
      ve.width = a, ve.height = c, m.value = a, M.value = c, S.value = Math.max(0, Math.min(Q.value, S.value)), p.value = Math.max(0, Math.min(G.value, p.value)), oe ? (b && Ce && (Ce.dispose(), Ce = new X.CanvasTexture(ve), Ce.minFilter = X.LinearFilter, Ce.magFilter = X.LinearFilter, ke && (ke.uniforms.uTex.value = Ce)), oe.setPixelRatio(window.devicePixelRatio || 1), oe.setSize(a, c)) : ne.value && (ne.value.width = a, ne.value.height = c, ne.value.style.width = a + "px", ne.value.style.height = c + "px"), ae();
    }
    function ae() {
      var b, R, k, A, W, j, de, ge, at, ht, mt, it;
      if (!(ve != null && ve.width)) return;
      if (Ae) {
        if (!ne.value) return;
        en(ve, {
          cols: B.value,
          rows: O.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: p.value,
          scrollX: S.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = v.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((R = v.value) == null ? void 0 : R.dir) ?? null,
          colFilters: s,
          hoveredRow: d.value,
          selectedRow: ((k = g.value) == null ? void 0 : k.row) ?? -1,
          selectedCol: ((A = g.value) == null ? void 0 : A.col) ?? -1,
          selectionAnchorRow: ((W = T.value) == null ? void 0 : W.row) ?? -1,
          selectionAnchorCol: ((j = T.value) == null ? void 0 : j.col) ?? -1,
          formatCell: H,
          getCellStyle: _
        });
        const gt = ne.value.getContext("2d");
        gt && gt.drawImage(ve, 0, 0);
        return;
      }
      if (!oe || !ke || !Ce) return;
      const a = st[e.theme] ?? st.none, c = e.theme === "paper";
      ke.uniforms.uStrength.value = e.curvature / 45 * 0.55, ke.uniforms.uScanlines.value = e.scanlines && !c ? 1 : 0, ke.uniforms.uVignette.value = c ? 0 : 1, ke.uniforms.uBezel.value.set(a.bg), $t(ke, e.magnify, V, ve.width, ve.height), en(ve, {
        cols: B.value,
        rows: O.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: p.value,
        scrollX: S.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((de = v.value) == null ? void 0 : de.colId) ?? null,
        sortDir: ((ge = v.value) == null ? void 0 : ge.dir) ?? null,
        colFilters: s,
        hoveredRow: d.value,
        selectedRow: ((at = g.value) == null ? void 0 : at.row) ?? -1,
        selectedCol: ((ht = g.value) == null ? void 0 : ht.col) ?? -1,
        selectionAnchorRow: ((mt = T.value) == null ? void 0 : mt.row) ?? -1,
        selectionAnchorCol: ((it = T.value) == null ? void 0 : it.col) ?? -1,
        formatCell: H,
        getCellStyle: _,
        aggregateRow: x.value
      }), Ce.needsUpdate = !0, oe.render(We, ft);
    }
    function Fe(a) {
      if (!ne.value) return [-1, -1];
      const c = ne.value.getBoundingClientRect(), b = a.clientX - c.left, R = a.clientY - c.top, k = ne.value.width || c.width, A = ne.value.height || c.height, W = e.curvature / 45 * 0.55, [j, de] = Pn(b, R, k, A, W);
      return j < 0 ? [-1, -1] : [j, de];
    }
    let Re = 0;
    function ze(a) {
      D.value = null;
      const c = Date.now();
      if (a.deltaX !== 0) {
        Re = c, S.value = Math.max(0, Math.min(Q.value, S.value + a.deltaX)), ae();
        return;
      }
      if (a.shiftKey && a.deltaY !== 0) {
        Re = c, S.value = Math.max(0, Math.min(Q.value, S.value + a.deltaY)), ae();
        return;
      }
      c - Re < jn || (p.value = Math.max(0, Math.min(G.value, p.value + a.deltaY)), ae());
    }
    function lt(a) {
      if (ie) return;
      if (e.magnify && ne.value) {
        const k = Vt(a, ne.value);
        V.x = k.x, V.y = k.y;
      }
      const [c, b] = Fe(a);
      if (c < 0) {
        d.value = -1, ae();
        return;
      }
      const R = nn(
        c,
        b,
        B.value,
        O.value.length,
        e.rowHeight,
        p.value,
        ve.height,
        i.value.length,
        S.value,
        x.value !== null
      );
      if (d.value = R.area === "body" ? R.rowIdx : -1, R.area === "header" && R.colIdx >= 0) {
        const k = B.value[R.colIdx], A = Dt(R.colIdx, B.value), W = c + S.value;
        ne.value.style.cursor = k && tn(W, A, k.width) ? "col-resize" : "pointer";
      } else R.area === "body" ? ne.value.style.cursor = "pointer" : ne.value.style.cursor = "default";
      ae();
    }
    function Ze() {
      d.value = -1, V.x = xe.x, V.y = xe.y, ae();
    }
    function gn(a) {
      const [c, b] = Fe(a);
      if (c < 0) return;
      if (b >= he) {
        Me = !0, ee = !1, Ee = a.clientX, Ie = a.clientY, L = S.value, $ = p.value;
        return;
      }
      const R = c + S.value;
      for (let k = 0; k < B.value.length; k++) {
        const A = B.value[k], W = Dt(k, B.value);
        if (A.colDef.resizable !== !1 && tn(R, W, A.width)) {
          Se(A.colId, a.clientX);
          return;
        }
      }
    }
    function pn(a) {
      var k, A, W;
      if (ue) {
        ue = !1;
        return;
      }
      if (ie) return;
      const [c, b] = Fe(a);
      if (c < 0) {
        D.value = null;
        return;
      }
      const R = nn(
        c,
        b,
        B.value,
        O.value.length,
        e.rowHeight,
        p.value,
        ve.height,
        i.value.length,
        S.value,
        x.value !== null
      );
      if (R.area === "header" && R.colIdx >= 0) {
        const j = B.value[R.colIdx], de = Dt(R.colIdx, B.value), ge = c + S.value;
        j.colDef.filter && Hn(ge, de, j.width) ? (a.stopPropagation(), D.value === j.colId ? D.value = null : (D.value = j.colId, y.value = (k = s[j.colId]) != null && k.startsWith("__eq__") ? s[j.colId].slice(6) : s[j.colId] ?? "", I.value = { x: Math.max(0, de - S.value), y: he })) : j.colDef.sortable !== !1 && (D.value = null, v.value = ((A = v.value) == null ? void 0 : A.colId) === j.colId ? v.value.dir === "asc" ? { colId: j.colId, dir: "desc" } : null : { colId: j.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (D.value = null, R.area === "body" && R.rowIdx >= 0 && R.colIdx >= 0) {
        const j = R.rowIdx;
        a.shiftKey && g.value ? (T.value || (T.value = { ...g.value }), g.value = { row: j, col: R.colIdx }) : (g.value = { row: j, col: R.colIdx }, T.value = { row: j, col: R.colIdx }), (W = ne.value) == null || W.focus();
        const de = O.value[j], ge = B.value[R.colIdx];
        de && ge && (l("row-clicked", { data: de, event: a }), l("cell-selected", { data: de, row: j, col: R.colIdx, colId: ge.colId }));
      }
    }
    function Gt(a) {
      var c, b;
      D.value && ((b = (c = a.target).closest) != null && b.call(c, ".cathode-filter-popup") || (D.value = null));
    }
    function wn(a) {
      var k;
      if (!m.value) return;
      let c = 0;
      for (let A = 0; A < a; A++) c += B.value[A].width;
      const b = ((k = B.value[a]) == null ? void 0 : k.width) ?? 0, R = c - S.value;
      R < 0 ? S.value = Math.max(0, c) : R + b > m.value && (S.value = Math.min(Q.value, c + b - m.value));
    }
    function yn(a) {
      const b = B.value.length - 1, R = O.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(a.key) && (a.preventDefault(), g.value = { row: E.value, col: 0 }, T.value = { row: E.value, col: 0 });
        return;
      }
      let { row: k, col: A } = g.value;
      const W = (j, de, ge = !1) => {
        k = Math.max(0, Math.min(R, j)), A = Math.max(0, Math.min(b, de)), g.value = { row: k, col: A }, ge || (T.value = { row: k, col: A }), U(k), wn(A);
      };
      switch (a.key) {
        case "ArrowDown":
          a.preventDefault(), W(k + 1, A, a.shiftKey);
          break;
        case "ArrowUp":
          a.preventDefault(), W(k - 1, A, a.shiftKey);
          break;
        case "ArrowRight":
          a.preventDefault(), a.shiftKey ? W(k, A + 1, !0) : A < b ? W(k, A + 1) : W(k + 1, 0);
          break;
        case "ArrowLeft":
          a.preventDefault(), a.shiftKey ? W(k, A - 1, !0) : A > 0 ? W(k, A - 1) : W(k - 1, b);
          break;
        case "Tab":
          a.preventDefault(), a.shiftKey ? A > 0 ? W(k, A - 1) : W(k - 1, b) : A < b ? W(k, A + 1) : W(k + 1, 0);
          break;
        case "Enter":
          a.preventDefault(), a.shiftKey ? W(k - 1, A) : W(k + 1, A);
          break;
        case "Home":
          a.preventDefault(), a.ctrlKey || a.metaKey ? W(0, 0, a.shiftKey) : W(k, 0, a.shiftKey);
          break;
        case "End":
          a.preventDefault(), a.ctrlKey || a.metaKey ? W(R, b, a.shiftKey) : W(k, b, a.shiftKey);
          break;
        case "PageDown":
          a.preventDefault(), W(Math.min(R, k + J.value), A, a.shiftKey);
          break;
        case "PageUp":
          a.preventDefault(), W(Math.max(0, k - J.value), A, a.shiftKey);
          break;
        case "Escape":
          g.value = null, T.value = null;
          break;
        case "c":
        case "C":
          (a.ctrlKey || a.metaKey) && (a.preventDefault(), bn());
          break;
      }
    }
    function bn() {
      var ge;
      if (!g.value) return;
      const a = B.value, c = O.value, b = T.value ?? g.value, R = Math.min(b.row, g.value.row), k = Math.max(b.row, g.value.row), A = Math.min(b.col, g.value.col), W = Math.max(b.col, g.value.col), j = [];
      for (let at = R; at <= k; at++) {
        const ht = c[at];
        if (!ht) continue;
        const mt = [];
        for (let it = A; it <= W; it++) {
          const gt = a[it];
          gt && mt.push(H(gt, ht).replace(/[\t\r\n]+/g, " "));
        }
        j.push(mt.join("	"));
      }
      const de = j.join(`
`);
      (ge = navigator.clipboard) == null || ge.writeText(de).catch(() => {
      });
    }
    function xn(a) {
      const c = a.target.value;
      y.value = c, c ? s[D.value] = c : delete s[D.value], l("filter-changed");
    }
    function jt() {
      D.value && delete s[D.value], y.value = "", D.value = null, l("filter-changed");
    }
    const Mn = {
      setGridOption(a, c) {
        a === "rowData" ? o.value = c : a === "pinnedBottomRowData" ? i.value = c : a === "quickFilterText" && (f.value = c);
      },
      getColumnState() {
        return e.columnDefs.map((a) => {
          var b, R;
          const c = C(a);
          return {
            colId: c,
            hide: u.has(c),
            sort: ((b = v.value) == null ? void 0 : b.colId) === c ? v.value.dir : null,
            sortIndex: ((R = v.value) == null ? void 0 : R.colId) === c ? 0 : null,
            width: r[c] ?? a.width
          };
        });
      },
      applyColumnState({ state: a }) {
        for (const c of a)
          c.hide === !0 && u.add(c.colId), c.hide === !1 && u.delete(c.colId), c.sort && (v.value = { colId: c.colId, dir: c.sort }), c.width && (r[c.colId] = c.width);
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
        const c = Y.value, b = c.map((W) => W.colDef.headerName ?? W.colId).join(","), R = O.value.map(
          (W) => c.map((j) => `"${String(H(j, W)).replace(/"/g, '""')}"`).join(",")
        ), k = new Blob([[b, ...R].join(`
`)], { type: "text/csv" }), A = URL.createObjectURL(k);
        Object.assign(document.createElement("a"), { href: A, download: a }).click(), URL.revokeObjectURL(A);
      },
      resize() {
        Z();
      },
      resetColumnState() {
        u.clear();
        for (const c of e.columnDefs)
          c.hide && u.add(C(c));
        const a = e.columnDefs.find((c) => c.sort);
        v.value = a ? { colId: C(a), dir: a.sort } : null;
        for (const c of Object.keys(r)) delete r[c];
        for (const c of Object.keys(s)) delete s[c];
        f.value = "", p.value = 0, g.value = null, D.value = null;
      }
    };
    K(
      [O, () => i.value, B, p, d, g],
      () => $e(ae)
    ), K(() => e.theme, () => ae()), K(() => e.curvature, () => $e(Z)), K(() => e.scanlines, () => ae()), K(() => e.glow, () => ae()), K(() => e.magnify, (a) => {
      a || (V.x = xe.x, V.y = xe.y), ae();
    }), K(g, (a) => {
      if (!a) return;
      const c = O.value[a.row], b = B.value[a.col];
      c && b && l("cell-selected", { data: c, row: a.row, col: a.col, colId: b.colId });
    });
    let dt = null, vt = null, kt = 0;
    function ot() {
      cancelAnimationFrame(kt), kt = requestAnimationFrame(Z);
    }
    function qt(a) {
      a.preventDefault();
    }
    function Zt() {
      oe == null || oe.dispose(), oe = null, Ae = !1, F();
    }
    Ge(() => {
      for (const a of e.columnDefs)
        a.hide && u.add(C(a)), a.sort && !v.value && (v.value = { colId: C(a), dir: a.sort });
      o.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Gt), document.addEventListener("mousemove", Le), document.addEventListener("mouseup", Ve), $e(() => {
        var a;
        F(), ne.value && (ne.value.addEventListener("webglcontextlost", qt), ne.value.addEventListener("webglcontextrestored", Zt)), Te.value && (dt = new ResizeObserver(() => Z()), dt.observe(Te.value), vt = new IntersectionObserver((c) => {
          c.some((b) => b.isIntersecting) && ot();
        }), vt.observe(Te.value)), window.addEventListener("resize", ot), (a = window.visualViewport) == null || a.addEventListener("resize", ot), l("grid-ready", { api: Mn });
      });
    }), et(() => {
      var a, c, b;
      document.removeEventListener("click", Gt, !0), document.removeEventListener("mousemove", Le), document.removeEventListener("mouseup", Ve), (a = ne.value) == null || a.removeEventListener("webglcontextlost", qt), (c = ne.value) == null || c.removeEventListener("webglcontextrestored", Zt), dt == null || dt.disconnect(), vt == null || vt.disconnect(), window.removeEventListener("resize", ot), (b = window.visualViewport) == null || b.removeEventListener("resize", ot), cancelAnimationFrame(kt), Ct();
    });
    const De = te(() => st[e.theme] ?? st.none), Sn = te(() => ({
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
    })), Tn = te(() => ({
      background: De.value.bg,
      border: `1px solid ${De.value.border}`,
      color: De.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Cn = te(() => ({
      background: De.value.headerBg,
      borderTop: `1px solid ${De.value.border}`,
      color: De.value.text
    })), kn = te(() => ({
      background: De.value.bg
    })), Jt = te(() => De.value.accent);
    return (a, c) => {
      var b, R;
      return pe(), we("div", {
        ref_key: "wrapEl",
        ref: Te,
        class: "cathode-wrap",
        style: Be(kn.value)
      }, [
        se("canvas", {
          ref_key: "canvasEl",
          ref: ne,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Oe(ze, ["prevent"]),
          onMousemove: lt,
          onMouseleave: Ze,
          onMousedown: gn,
          onClick: pn,
          onKeydown: yn,
          onTouchstartPassive: ct,
          onTouchmove: ut,
          onTouchend: qe,
          onTouchcancel: qe
        }, null, 544),
        D.value ? (pe(), we("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Be(Sn.value),
          onClick: c[0] || (c[0] = Oe(() => {
          }, ["stop"]))
        }, [
          se("input", {
            style: Be(Tn.value),
            value: y.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: xn,
            onKeydown: In(jt, ["escape"])
          }, null, 44, Nn),
          y.value ? (pe(), we("button", {
            key: 0,
            style: Be({
              background: "none",
              border: "none",
              color: De.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: jt
          }, "✕", 4)) : He("", !0)
        ], 4)) : He("", !0),
        t.pagination ? (pe(), we("div", {
          key: 1,
          class: "cathode-pagination",
          style: Be(Cn.value)
        }, [
          se("button", {
            disabled: p.value <= 0,
            onClick: c[1] || (c[1] = (k) => ce())
          }, "◀", 8, On),
          se("span", null, Pe((E.value + 1).toLocaleString()) + "–" + Pe(Math.min(O.value.length, P.value + 1).toLocaleString()) + " / " + Pe(O.value.length.toLocaleString()), 1),
          se("button", {
            disabled: p.value >= G.value,
            onClick: c[2] || (c[2] = (k) => le())
          }, "▶", 8, Un),
          se("span", {
            class: "cathode-page-info",
            style: Be({ color: Jt.value })
          }, Pe(O.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (pe(), we("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Be({ color: Jt.value })
          }, Pe(((b = B.value[g.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((R = B.value[g.value.col]) == null ? void 0 : R.colId)) + " : " + Pe(H(B.value[g.value.col], O.value[g.value.row])), 5)) : He("", !0)
        ], 4)) : He("", !0)
      ], 4);
    };
  }
}), tt = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, o] of n)
    e[l] = o;
  return e;
}, oo = /* @__PURE__ */ tt(qn, [["__scopeId", "data-v-452bb2f2"]]), bt = {
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
function Zn(t, n) {
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
const Jn = 12, ye = 18, wt = 10, Je = 6, Xt = `${Jn}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Qn(t, n, e) {
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
    let f = "";
    for (const v of i) {
      const s = f + v;
      if (t.measureText(s).width <= e)
        f = s;
      else if (f && (l.push(f.replace(/\s+$/, "")), f = ""), t.measureText(v).width > e) {
        let r = "";
        for (const u of v)
          t.measureText(r + u).width > e ? (r && l.push(r), r = u) : r += u;
        f = r;
      } else
        f = v.replace(/^\s+/, "");
    }
    f && l.push(f.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function dn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), o = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${o}`;
  }
  return t;
}
function el(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function tl(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: o, wordWrap: i } = t, f = t.formatTs ?? dn;
  e.font = Xt;
  const v = [];
  for (let s = 0; s < n.length; s++) {
    const r = n[s], u = r.level ?? "info", h = o && r.ts != null ? f(r.ts) : "", m = i ? Qn(e, r.text, l) : r.text.split(`
`);
    for (let M = 0; M < m.length; M++)
      v.push({
        entryIdx: s,
        text: m[M],
        level: u,
        timestamp: M === 0 ? h : "",
        isFirstFrag: M === 0,
        widthPx: e.measureText(m[M]).width
      });
  }
  return v;
}
function ln(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, i = bt[n.theme] ?? bt.none;
  e.clearRect(0, 0, l, o), e.fillStyle = i.bg, e.fillRect(0, 0, l, o), e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip(), e.font = Xt, e.textBaseline = "middle";
  const f = n.visualLines, v = wt - n.scrollX, s = (n.showTimestamps ? wt + n.timestampWidth : wt) - n.scrollX, r = Math.max(0, Math.floor((n.scrollY - Je) / ye)), u = Math.min(f.length, Math.ceil((n.scrollY + o - Je) / ye) + 1);
  for (let h = r; h < u; h++) {
    const m = f[h], M = Je + h * ye - n.scrollY + ye / 2;
    if (m.entryIdx % 2 === 1 && m.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let S = 1;
      for (; h + S < u && f[h + S].entryIdx === m.entryIdx; ) S++;
      e.fillRect(0, M - ye / 2, l, ye * S);
    }
    n.selectionStart >= 0 && h >= n.selectionStart && h <= n.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, M - ye / 2, l, ye)), h === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M - ye / 2, l, ye)), n.showTimestamps && m.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(m.timestamp, v, M), e.shadowBlur = 0);
    const p = Zn(i, m.level);
    e.fillStyle = p, e.textAlign = "left", n.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(m.text, s, M), e.shadowBlur = 7, e.fillText(m.text, s, M), e.shadowBlur = 3, e.fillText(m.text, s, M), e.shadowBlur = 0) : e.fillText(m.text, s, M);
  }
  e.restore();
}
function on(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - Je) / ye);
  return l < 0 || l >= e ? -1 : l;
}
function nl(t) {
  return Je * 2 + t * ye;
}
const ll = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ol = /* @__PURE__ */ Qe({
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
    const e = t, l = z(null), o = z(null), i = { ...xe }, f = z(0), v = z(0), s = z(0), r = z(-1), u = z(!0), h = z(-1), m = z(-1), M = te(() => {
      const w = e.entries ?? [];
      return e.maxLines > 0 && w.length > e.maxLines ? w.slice(w.length - e.maxLines) : w;
    }), p = te(() => {
      if (!e.showTimestamps) return "";
      const w = e.formatTs ?? dn;
      let F = "00:00:00";
      for (const Z of M.value) {
        if (Z.ts == null) continue;
        const ae = w(Z.ts);
        ae.length > F.length && (F = ae);
      }
      return F;
    }), S = z(0), d = z([]);
    function g() {
      if (!E) return;
      const w = E.getContext("2d");
      if (!w) return;
      w.font = Xt;
      const F = e.showTimestamps ? el(w, p.value) : 0;
      S.value = F;
      const Z = Math.max(
        1,
        f.value - wt * 2 - F
      );
      d.value = tl({
        entries: M.value,
        ctx: w,
        textMaxWidth: Z,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const T = te(() => nl(d.value.length)), D = te(() => Math.max(0, T.value - v.value)), V = te(() => {
      let w = 0;
      for (const F of d.value) F.widthPx > w && (w = F.widthPx);
      return wt * 2 + S.value + w;
    }), I = te(() => Math.max(0, V.value - f.value)), y = z(0);
    K(D, () => {
      u.value ? s.value = D.value : s.value = Math.min(s.value, D.value);
    }), K(I, () => {
      y.value = Math.min(y.value, I.value);
    }), K(
      [M, f, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        g(), $e(_);
      },
      { deep: !1 }
    );
    let C = null, Y = !1;
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
    let Q, q, G, J, E;
    const P = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Wt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${zt}

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

    ${Pt}

    gl_FragColor = color;
  }
`;
    function N() {
      if (!(!o.value || !l.value)) {
        E = document.createElement("canvas");
        try {
          C = new X.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          Y = !0;
        }
        if (!Y && !C.getContext() && (C.dispose(), C = null, Y = !0), Y) {
          H();
          return;
        }
        C.setPixelRatio(1), C.setClearColor(0, 0), Q = new X.Scene(), q = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), J = new X.CanvasTexture(E), J.minFilter = X.LinearFilter, J.magFilter = X.LinearFilter, G = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: J },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ht()
          },
          vertexShader: ll,
          fragmentShader: P,
          transparent: !0
        }), Q.add(new X.Mesh(new X.PlaneGeometry(2, 2), G)), H();
      }
    }
    function H() {
      if (!l.value || !C && !Y) return;
      const w = l.value.clientWidth, F = l.value.clientHeight;
      if (!w || !F) return;
      const Z = E.width !== w || E.height !== F;
      Z && (E.width = w, E.height = F, f.value = w, v.value = F, g(), C ? (Z && J && (J.dispose(), J = new X.CanvasTexture(E), J.minFilter = X.LinearFilter, J.magFilter = X.LinearFilter, G && (G.uniforms.uTex.value = J)), C.setPixelRatio(window.devicePixelRatio || 1), C.setSize(w, F)) : o.value && (o.value.width = w, o.value.height = F, o.value.style.width = w + "px", o.value.style.height = F + "px"), u.value && (s.value = Math.max(0, T.value - v.value)), _());
    }
    function _() {
      if (!(E != null && E.width)) return;
      if (Y) {
        if (!o.value) return;
        ln(E, {
          visualLines: d.value,
          scrollY: s.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: S.value,
          hoveredLine: r.value,
          selectionStart: Math.min(h.value, m.value),
          selectionEnd: Math.max(h.value, m.value)
        });
        const F = o.value.getContext("2d");
        F && F.drawImage(E, 0, 0);
        return;
      }
      if (!C || !G || !J) return;
      const w = e.theme === "paper";
      G.uniforms.uStrength.value = e.curvature / 45 * 0.55, G.uniforms.uScanlines.value = e.scanlines && !w ? 1 : 0, G.uniforms.uVignette.value = w ? 0 : 1, $t(G, e.magnify, i, E.width, E.height), ln(E, {
        visualLines: d.value,
        scrollY: s.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: S.value,
        hoveredLine: r.value,
        selectionStart: Math.min(h.value, m.value),
        selectionEnd: Math.max(h.value, m.value)
      }), J.needsUpdate = !0, C.render(Q, q);
    }
    K(() => e.theme, () => _()), K(() => e.curvature, () => _()), K(() => e.scanlines, () => _()), K(() => e.glow, () => _()), K(() => e.magnify, (w) => {
      w || (i.x = xe.x, i.y = xe.y), _();
    }), K(s, () => _()), K(y, () => _()), K(r, () => _()), K([h, m], () => _());
    function O(w) {
      if (!o.value) return [-1, -1];
      const F = o.value.getBoundingClientRect();
      return [w.clientX - F.left, w.clientY - F.top];
    }
    function x(w) {
      s.value = Math.max(0, Math.min(D.value, w)), u.value = s.value >= D.value - 4;
    }
    function U(w) {
      y.value = Math.max(0, Math.min(I.value, w));
    }
    function ce(w) {
      w.shiftKey ? U(y.value + w.deltaY) : Math.abs(w.deltaX) > Math.abs(w.deltaY) ? U(y.value + w.deltaX) : x(s.value + w.deltaY);
    }
    let le = !1, ie = 0, fe = 0, re = 0, me = 0, ue = !1;
    function Me(w) {
      le = !0, ue = !1, ie = w.clientX, fe = w.clientY, re = y.value, me = s.value, l.value && l.value.focus();
    }
    function Ee(w) {
      if (le) {
        const F = ie - w.clientX, Z = fe - w.clientY;
        (Math.abs(F) > 4 || Math.abs(Z) > 4) && (ue = !0), U(re + F), x(me + Z);
      }
    }
    function Ie() {
      le && (le = !1, ue && (ue = !1));
    }
    function L(w) {
      if (w.touches.length !== 1) return;
      const F = w.touches[0];
      le = !0, ue = !1, ie = F.clientX, fe = F.clientY, re = y.value, me = s.value, l.value && l.value.focus();
    }
    function $(w) {
      if (!le || w.touches.length !== 1) return;
      w.preventDefault();
      const F = w.touches[0], Z = ie - F.clientX, ae = fe - F.clientY;
      (Math.abs(Z) > 4 || Math.abs(ae) > 4) && (ue = !0), U(re + Z), x(me + ae);
    }
    function ee() {
      le && (le = !1, ue && (ue = !1));
    }
    function Se(w) {
      const [, F] = O(w);
      return F < 0 ? -1 : on(F, s.value, d.value.length);
    }
    function Le(w) {
      if (ue) {
        ue = !1;
        return;
      }
      const F = Se(w);
      if (F < 0) {
        h.value = -1, m.value = -1;
        return;
      }
      w.shiftKey && h.value >= 0 || (h.value = F), m.value = F;
    }
    function Ve(w, F) {
      const Z = d.value.length;
      if (Z === 0) return;
      const ae = m.value < 0 ? 0 : m.value;
      let Fe = Math.max(0, Math.min(Z - 1, ae + w));
      m.value = Fe, (!F || h.value < 0) && (h.value = Fe), r.value = Fe;
      const Re = Je + Fe * ye, ze = Re + ye;
      Re < s.value ? x(Re) : ze > s.value + v.value && x(ze - v.value);
    }
    function ct() {
      const w = Math.min(h.value, m.value), F = Math.max(h.value, m.value);
      if (w < 0) return "";
      const Z = d.value, ae = /* @__PURE__ */ new Set(), Fe = [];
      for (let Re = w; Re <= F && Re < Z.length; Re++) {
        const ze = Z[Re];
        if (ae.has(ze.entryIdx)) continue;
        ae.add(ze.entryIdx);
        let lt = "";
        for (let Ze = 0; Ze < Z.length; Ze++)
          Z[Ze].entryIdx === ze.entryIdx && (lt += (lt && !Z[Ze].isFirstFrag ? " " : "") + Z[Ze].text);
        Fe.push(ze.timestamp ? `${ze.timestamp}  ${lt}` : lt);
      }
      return Fe.join(`
`);
    }
    async function ut() {
      const w = ct();
      if (w)
        try {
          await navigator.clipboard.writeText(w);
        } catch {
          const F = document.createElement("textarea");
          F.value = w, F.style.position = "fixed", F.style.opacity = "0", document.body.appendChild(F), F.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(F);
        }
    }
    function qe(w) {
      if ((w.metaKey || w.ctrlKey) && (w.key === "c" || w.key === "C")) {
        h.value >= 0 && (w.preventDefault(), ut());
        return;
      }
      if ((w.metaKey || w.ctrlKey) && (w.key === "a" || w.key === "A")) {
        w.preventDefault(), h.value = 0, m.value = d.value.length - 1;
        return;
      }
      switch (w.key) {
        case "ArrowDown":
          w.preventDefault(), Ve(1, w.shiftKey);
          break;
        case "ArrowUp":
          w.preventDefault(), Ve(-1, w.shiftKey);
          break;
        case "ArrowRight":
          w.preventDefault(), U(y.value + ye * 2);
          break;
        case "ArrowLeft":
          w.preventDefault(), U(y.value - ye * 2);
          break;
        case "PageDown":
          w.preventDefault(), x(s.value + v.value);
          break;
        case "PageUp":
          w.preventDefault(), x(s.value - v.value);
          break;
        case "Home":
          w.preventDefault(), x(0), U(0);
          break;
        case "End":
          w.preventDefault(), x(D.value);
          break;
        case "Escape":
          h.value = -1, m.value = -1;
          break;
      }
    }
    function Te(w) {
      if (e.magnify && o.value) {
        const Z = Vt(w, o.value);
        i.x = Z.x, i.y = Z.y, _();
      }
      const [, F] = O(w);
      if (F < 0) {
        r.value = -1;
        return;
      }
      r.value = on(F, s.value, d.value.length);
    }
    function ne() {
      r.value = -1, i.x = xe.x, i.y = xe.y, _();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, s.value = D.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(w) {
        x(Je + w * ye);
      }
    });
    let Xe = null, oe = null, Ae = 0;
    const Ct = Tt("cathodeResetTick", z(0));
    K(Ct, () => We());
    function We() {
      cancelAnimationFrame(Ae), Ae = requestAnimationFrame(H);
    }
    function ft(w) {
      w.preventDefault();
    }
    function ke() {
      C == null || C.dispose(), C = null, Y = !1, N();
    }
    Ge(() => {
      document.addEventListener("mousemove", Ee), document.addEventListener("mouseup", Ie), $e(() => {
        var w;
        N(), o.value && (o.value.addEventListener("webglcontextlost", ft), o.value.addEventListener("webglcontextrestored", ke)), l.value && (Xe = new ResizeObserver(() => H()), Xe.observe(l.value), oe = new IntersectionObserver((F) => {
          F.some((Z) => Z.isIntersecting) && We();
        }), oe.observe(l.value)), window.addEventListener("resize", We), (w = window.visualViewport) == null || w.addEventListener("resize", We), s.value = D.value;
      });
    }), et(() => {
      var w, F, Z;
      document.removeEventListener("mousemove", Ee), document.removeEventListener("mouseup", Ie), (w = o.value) == null || w.removeEventListener("webglcontextlost", ft), (F = o.value) == null || F.removeEventListener("webglcontextrestored", ke), Xe == null || Xe.disconnect(), oe == null || oe.disconnect(), window.removeEventListener("resize", We), (Z = window.visualViewport) == null || Z.removeEventListener("resize", We), cancelAnimationFrame(Ae), B();
    });
    const Ce = te(() => bt[e.theme] ?? bt.none), ve = te(() => ({
      background: Ce.value.bg
    }));
    return (w, F) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Be(ve.value),
      tabindex: "0",
      onKeydown: qe
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-log-canvas",
        onWheel: Oe(ce, ["prevent"]),
        onMousemove: Te,
        onMouseleave: ne,
        onMousedown: Me,
        onClick: Le,
        onTouchstartPassive: L,
        onTouchmove: $,
        onTouchend: ee,
        onTouchcancel: ee
      }, null, 544)
    ], 36));
  }
}), al = /* @__PURE__ */ tt(ol, [["__scopeId", "data-v-81f547ae"]]), il = ["disabled"], rl = /* @__PURE__ */ Qe({
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
    const l = t, o = e, i = z(null), f = z(null), v = z(""), s = z([]), r = z(-1);
    let u = "";
    function h(I) {
      I.trim() && (s.value.length && s.value[s.value.length - 1] === I || (s.value.push(I), s.value.length > l.historyLimit && s.value.splice(0, s.value.length - l.historyLimit)));
    }
    function m(I) {
      if (!l.disabled) {
        if (I.key === "Enter") {
          I.preventDefault();
          const y = v.value;
          y.trim() && h(y), r.value = -1, v.value = "", o("submit", y);
          return;
        }
        if (I.key === "ArrowUp") {
          if (!s.value.length) return;
          I.preventDefault(), r.value === -1 ? (u = v.value, r.value = s.value.length - 1) : r.value > 0 && r.value--, v.value = s.value[r.value];
          return;
        }
        if (I.key === "ArrowDown") {
          if (r.value === -1) return;
          I.preventDefault(), r.value < s.value.length - 1 ? (r.value++, v.value = s.value[r.value]) : (r.value = -1, v.value = u, u = "");
          return;
        }
      }
    }
    const M = z(!0);
    let p = null;
    function S() {
      p || (p = setInterval(() => {
        M.value = !M.value;
      }, 530));
    }
    function d() {
      p && (clearInterval(p), p = null), M.value = !0;
    }
    const g = te(() => {
      let I;
      return l.disabled ? I = " " : l.busy ? I = "█" : I = M.value ? "█" : " ", { level: "info", text: `${l.prompt}${v.value}${I}` };
    }), T = te(
      () => [...l.entries, g.value]
    );
    function D() {
      var I;
      l.disabled || (I = f.value) == null || I.focus();
    }
    K(() => l.busy, (I, y) => {
      y && !I && !l.disabled && $e(() => {
        var C;
        return (C = f.value) == null ? void 0 : C.focus();
      });
    });
    function V() {
      var I;
      (I = f.value) == null || I.focus();
    }
    return n({ focus: V }), Ge(() => {
      S(), l.disabled || requestAnimationFrame(() => {
        var I;
        return (I = f.value) == null ? void 0 : I.focus();
      });
    }), et(() => {
      d();
    }), (I, y) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: D
    }, [
      cn(al, {
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
      un(se("input", {
        ref_key: "inputEl",
        ref: f,
        "onUpdate:modelValue": y[0] || (y[0] = (C) => v.value = C),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: m
      }, null, 40, il), [
        [Ln, v.value]
      ])
    ], 512));
  }
}), ao = /* @__PURE__ */ tt(rl, [["__scopeId", "data-v-a2b39934"]]), xt = {
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
}, sl = 0.18, pt = 8, Nt = 22, cl = 4, Ye = 8, Ke = 56, Ot = 42, Ne = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ul = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Et = 4, fl = 1, dl = 1;
function vl(t, n, e, l = 0, o = !1) {
  const i = o ? Ot : Ke, f = Math.max(0, n - Ye - i), v = Math.max(1, Math.floor(f / e)), s = Math.min(v, t);
  return { firstIdx: Math.max(0, t - s - Math.floor(l / e)), count: s, slotW: e };
}
function hl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, o = -1 / 0, i = 0;
  const f = Math.min(t.length, n + e);
  for (let s = n; s < f; s++) {
    const r = t[s];
    r && (r.low < l && (l = r.low), r.high > o && (o = r.high), r.volume > i && (i = r.volume));
  }
  if (!isFinite(l) || !isFinite(o) || l === o) {
    const s = isFinite(l) ? l : 0;
    return { min: s - 1, max: s + 1, maxVol: Math.max(1, i) };
  }
  const v = (o - l) * 0.04;
  return { min: l - v, max: o + v, maxVol: Math.max(1, i) };
}
function ml(t, n, e = !1) {
  const l = e ? cl : Nt, o = Math.max(1, t - pt - l - Et), i = Math.max(0, Math.round(o * n)), f = o - i;
  return {
    priceY0: pt,
    priceY1: pt + f,
    volumeY0: pt + f + Et,
    volumeY1: pt + f + Et + i
  };
}
function _e(t, n, e, l) {
  const o = n.max - n.min;
  return o <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / o) * (l - e);
}
function je(t, n, e) {
  return Ye + (t - n + 0.5) * e;
}
function Ue(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function Ut(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), o = String(n.getHours()).padStart(2, "0"), i = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${o}:${i}`;
}
function gl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), o = e / l;
  let i;
  return o < 1.5 ? i = 1 : o < 3 ? i = 2 : o < 7 ? i = 5 : i = 10, i * l;
}
function an(t, n) {
  var M, p, S, d, g;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, i = xt[n.theme] ?? xt.none, f = n.colors ? { ...i, ...n.colors } : i, v = !!n.compact;
  if (e.clearRect(0, 0, l, o), e.fillStyle = f.bg, e.fillRect(0, 0, l, o), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip();
  const s = vl(n.candles.length, l, n.slotW, n.scrollX, v), r = hl(n.candles, s.firstIdx, s.count), u = ml(o, n.showVolume ? n.volumeFraction : 0, v), h = Math.max(fl, Math.floor(n.slotW * 0.7)), m = Math.min(n.candles.length, s.firstIdx + s.count);
  for (let T = s.firstIdx; T < m; T++) {
    const D = n.candles[T];
    if (!D) continue;
    const V = je(T, s.firstIdx, n.slotW), I = _e(D.open, r, u.priceY0, u.priceY1), y = _e(D.close, r, u.priceY0, u.priceY1), C = _e(D.high, r, u.priceY0, u.priceY1), Y = _e(D.low, r, u.priceY0, u.priceY1), B = D.close >= D.open, Q = B ? f.wickBull : f.wickBear, q = B ? f.candleBull : f.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = Q, e.lineWidth = dl, e.beginPath(), e.moveTo(Math.round(V) + 0.5, C), e.lineTo(Math.round(V) + 0.5, Y), e.stroke(), e.fillStyle = q;
    const G = Math.min(I, y), J = Math.max(1, Math.abs(y - I)), E = Math.round(V - h / 2), P = Math.round(G), N = Math.round(J);
    if (e.fillRect(E, P, h, N), n.glow && (e.shadowBlur = 4, e.fillRect(E, P, h, N)), e.shadowBlur = 0, n.showVolume && r.maxVol > 0) {
      const H = Math.round(D.volume / r.maxVol * (u.volumeY1 - u.volumeY0));
      H > 0 && (e.fillStyle = B ? f.volumeBull : f.volumeBear, e.fillRect(
        Math.round(V - h / 2),
        u.volumeY1 - H,
        h,
        H
      ));
    }
  }
  if ((M = n.overlays) != null && M.length) {
    const T = { above: 0, below: 0 }, D = n.overlays.filter((I) => I.kind !== "hline" && !!I.label).length, V = D ? 14 + 14 * D + 12 : 8;
    for (const I of n.overlays)
      I.kind === "hline" ? wl(e, I, l, r, u, f, v, T, V) : pl(e, I, s, r, u, n.slotW);
  }
  (p = n.markers) != null && p.length && kl(e, f, n.markers, n.candles, s, r, u, n.slotW), Il(e, f, r, u, l, v), v || (Ll(e, f, n.candles, s, n.slotW, o), Tl(e, f, n.candles, l, o)), (S = n.overlays) != null && S.length && bl(e, f, n.overlays, u), n.hover && (Rl(e, f, n.candles, s, r, u, n.slotW, n.hover, l), xl(e, f, n.candles, s, n.slotW, n.hover, u, ((d = n.overlays) == null ? void 0 : d.length) ?? 0), (g = n.markers) != null && g.length && Sl(e, f, n.markers, n.candles, s, r, u, n.slotW, n.hover, l)), e.restore();
}
function pl(t, n, e, l, o, i) {
  var v;
  const f = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    o.priceY0,
    /* width: */
    999999,
    o.priceY1 - o.priceY0
  ), t.clip(), n.kind === "line")
    yt(t, n.data, e.firstIdx, f, i, l, o, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const s = vn(n.color, n.fillAlpha ?? 0.08);
    yl(t, n.upper, n.lower, e.firstIdx, f, i, l, o, s), yt(t, n.upper, e.firstIdx, f, i, l, o, n.color, 1, !1), yt(t, n.lower, e.firstIdx, f, i, l, o, n.color, 1, !1), (v = n.middle) != null && v.length && yt(t, n.middle, e.firstIdx, f, i, l, o, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function wl(t, n, e, l, o, i, f, v = { above: 0, below: 0 }, s = 8) {
  const r = _e(n.price, l, o.priceY0, o.priceY1), u = r < o.priceY0 - 0.5, h = r > o.priceY1 + 0.5, m = u || h, M = m ? u ? v.above++ : v.below++ : 0, p = m ? u ? o.priceY0 + s + M * 20 : o.priceY1 - 8 - M * 20 : r, S = f ? Ot : Ke, d = Math.round(p) + 0.5;
  t.save(), m || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, d), t.lineTo(e - S, d), t.stroke(), t.setLineDash([]));
  let g = n.label ?? Ue(n.price);
  if (m && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    t.font = Ne, t.textBaseline = "middle", t.textAlign = "left";
    const T = t.measureText(g).width, D = 4, V = 2, I = Ye + 2;
    t.fillStyle = n.color, m && (t.globalAlpha = 0.85), t.fillRect(I, p - 7 - V, T + D * 2, 14 + V * 2), t.globalAlpha = 1, t.fillStyle = i.bg && !i.bg.startsWith("rgba(0,0,0,0)") ? i.bg : "#0d1520", t.fillText(g, I + D, p);
  }
  t.restore();
}
function yt(t, n, e, l, o, i, f, v, s, r) {
  if (!n || !n.length) return;
  t.strokeStyle = v, t.lineWidth = s, t.setLineDash(r ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < l; h++) {
    const m = n[h];
    if (typeof m != "number" || !isFinite(m)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const M = je(h, e, o), p = _e(m, i, f.priceY0, f.priceY1);
    u ? t.lineTo(M, p) : (t.moveTo(M, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function yl(t, n, e, l, o, i, f, v, s) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = s;
  let r = !1, u = -1;
  for (let h = l; h <= o; h++) {
    const m = n[h], M = e[h], p = h < o && typeof m == "number" && typeof M == "number" && isFinite(m) && isFinite(M);
    if (p && !r && (u = h, r = !0), !p && r || h === o && r) {
      const S = p ? h + 1 : h;
      t.beginPath();
      for (let d = u; d < S; d++) {
        const g = je(d, l, i), T = _e(n[d], f, v.priceY0, v.priceY1);
        d === u ? t.moveTo(g, T) : t.lineTo(g, T);
      }
      for (let d = S - 1; d >= u; d--) {
        const g = je(d, l, i), T = _e(e[d], f, v.priceY0, v.priceY1);
        t.lineTo(g, T);
      }
      t.closePath(), t.fill(), r = !1;
    }
  }
}
function vn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), o = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${o},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function bl(t, n, e, l) {
  const o = e.filter((S) => S.kind !== "hline" && !!S.label);
  if (!o.length) return;
  t.save(), t.font = Ne;
  const i = 8, f = 5, v = 12, s = 6, r = 14;
  let u = 0;
  for (const S of o) {
    const d = t.measureText(S.label).width;
    d > u && (u = d);
  }
  const h = i * 2 + v + s + u, m = f * 2 + r * o.length, M = Ye + 4, p = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(M, p, h, m), t.textBaseline = "middle", t.textAlign = "left";
  for (let S = 0; S < o.length; S++) {
    const d = o[S], g = p + f + r * (S + 0.5), T = M + i;
    d.kind === "line" ? (t.strokeStyle = d.color, t.lineWidth = d.lineWidth ?? 1, t.setLineDash(d.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(T, g), t.lineTo(T + v, g), t.stroke(), t.setLineDash([])) : d.kind === "band" && (t.fillStyle = vn(d.color, d.fillAlpha ?? 0.2), t.fillRect(T, g - 4, v, 8), t.strokeStyle = d.color, t.lineWidth = 1, t.strokeRect(T + 0.5, g - 4 + 0.5, v - 1, 7)), t.fillStyle = n.text, t.fillText(d.label, T + v + s, g);
  }
  t.restore();
}
function xl(t, n, e, l, o, i, f, v) {
  const s = Math.floor((i.x - Ye) / o), r = l.firstIdx + s;
  if (r < 0 || r >= e.length) return;
  const u = e[r];
  if (!u) return;
  const h = u.close - u.open, m = u.open !== 0 ? h / u.open * 100 : 0, M = h >= 0 ? "+" : "", p = [
    ["O", Ue(u.open), void 0],
    ["H", Ue(u.high), void 0],
    ["L", Ue(u.low), void 0],
    ["C", Ue(u.close), void 0],
    ["V", Ml(u.volume), void 0],
    ["", `${M}${m.toFixed(2)}%`, h >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Ne, t.textBaseline = "middle", t.textAlign = "left";
  const S = 8, d = 4, g = 14;
  let T = S;
  for (const [y, C] of p) {
    const Y = y ? `${y} ${C}` : C, B = t.measureText(Y).width + 12;
    T += B;
  }
  T += S - 12;
  const D = f.priceY0 + 4 + (v > 0 ? d * 2 + 14 * v + 4 : 0), V = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(V, D, T, g + d * 2);
  let I = V + S;
  for (let y = 0; y < p.length; y++) {
    const [C, Y, B] = p[y];
    t.fillStyle = n.text, C && (t.globalAlpha = 0.6, t.fillText(C + " ", I, D + d + g / 2), t.globalAlpha = 1, I += t.measureText(C + " ").width), B && (t.fillStyle = B), t.fillText(Y, I, D + d + g / 2), I += t.measureText(Y).width + 12;
  }
  t.restore();
}
function Ml(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Sl(t, n, e, l, o, i, f, v, s, r) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, h = Math.max(1, u * 0.5), m = Math.min(l.length, o.firstIdx + o.count), M = 9;
  let p = null;
  for (const Y of e) {
    let B = 0, Q = l.length - 1, q = -1;
    for (; B <= Q; ) {
      const E = B + Q >> 1, P = l[E].start - Y.timestamp;
      if (Math.abs(P) <= h) {
        q = E;
        break;
      }
      P < 0 ? B = E + 1 : Q = E - 1;
    }
    if (q < 0 || q < o.firstIdx || q >= m) continue;
    const G = je(q, o.firstIdx, v), J = _e(Y.price, i, f.priceY0, f.priceY1);
    if (Math.abs(s.x - G) <= M && Math.abs(s.y - J) <= M) {
      p = { m: Y, x: G, y: J };
      break;
    }
  }
  if (!p) return;
  const S = Ut(p.m.timestamp), d = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${S}`,
    `@ ${Ue(p.m.price)}`
  ];
  p.m.label && d.push(p.m.label), t.save(), t.font = Ne, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, T = 14;
  let D = 0;
  for (const Y of d) {
    const B = t.measureText(Y).width;
    B > D && (D = B);
  }
  const V = D + g * 2, I = d.length * T + g * 2;
  let y = p.x + 12;
  y + V > r - Ke && (y = p.x - 12 - V);
  let C = p.y - I / 2;
  C < f.priceY0 && (C = f.priceY0), C + I > f.priceY1 && (C = f.priceY1 - I), t.fillStyle = n.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(y, C, V, I), t.strokeRect(y + 0.5, C + 0.5, V - 1, I - 1);
  for (let Y = 0; Y < d.length; Y++) {
    const B = d[Y];
    t.fillStyle = Y === 0 ? p.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(B, y + g, C + g + Y * T);
  }
  t.restore();
}
function Tl(t, n, e, l, o) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, f = Cl(i);
  if (!f) return;
  t.save(), t.font = Ne, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, s = 3, r = t.measureText(f).width, u = l - Ke - v, h = o - Nt + 4;
  t.fillStyle = n.accent, t.fillRect(u - r - v, h - s, r + v * 2, 14 + s * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(f, u, h), t.restore();
}
function Cl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, o = 24 * l, i = 7 * o;
  return t >= i && t % i === 0 ? t / i + "W" : t >= o && t % o === 0 ? t / o + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function kl(t, n, e, l, o, i, f, v) {
  if (!l.length) return;
  const s = l.length > 1 ? l[1].start - l[0].start : 6e4, r = Math.max(1, s * 0.5), u = Math.min(l.length, o.firstIdx + o.count), h = (M) => {
    let p = 0, S = l.length - 1;
    for (; p <= S; ) {
      const d = p + S >> 1, g = l[d].start - M;
      if (Math.abs(g) <= r) return d;
      g < 0 ? p = d + 1 : S = d - 1;
    }
    return -1;
  }, m = 7;
  for (const M of e) {
    const p = h(M.timestamp);
    if (p < 0 || p < o.firstIdx || p >= u) continue;
    const S = je(p, o.firstIdx, v), d = _e(M.price, i, f.priceY0, f.priceY1);
    if (d < f.priceY0 || d > f.priceY1) continue;
    const g = M.color ?? (M.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), M.kind === "entry" ? (t.moveTo(S, d - m), t.lineTo(S - m, d + m - 1), t.lineTo(S + m, d + m - 1)) : (t.moveTo(S, d + m), t.lineTo(S - m, d - m + 1), t.lineTo(S + m, d - m + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Il(t, n, e, l, o, i = !1) {
  const f = e.max - e.min;
  if (f <= 0) return;
  const v = l.priceY1 - l.priceY0, s = i ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, r = gl(f, s), u = Math.ceil(e.min / r) * r, h = i ? Ot : Ke;
  t.font = i ? ul : Ne, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let m = u; m <= e.max; m += r) {
    const M = _e(m, e, l.priceY0, l.priceY1);
    M < l.priceY0 || M > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(M) + 0.5), t.lineTo(o - h, Math.round(M) + 0.5), t.stroke(), t.fillText(Ue(m), o - h + 3, M));
  }
  t.globalAlpha = 1;
}
function Ll(t, n, e, l, o, i) {
  if (l.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(l.count / 6));
  t.font = Ne, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const s = Math.min(e.length, l.firstIdx + l.count);
  for (let r = l.firstIdx; r < s; r += v) {
    const u = e[r];
    if (!u) continue;
    const h = je(r, l.firstIdx, o);
    t.fillText(Ut(u.start), h, i - Nt + 4);
  }
  t.globalAlpha = 1;
}
function Rl(t, n, e, l, o, i, f, v, s) {
  const r = Math.floor((v.x - Ye) / f), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + r)), h = e[u];
  if (!h) return;
  const m = je(u, l.firstIdx, f);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(m) + 0.5, i.priceY0), t.lineTo(Math.round(m) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const M = Math.max(i.priceY0, Math.min(i.priceY1, v.y));
  t.beginPath(), t.moveTo(Ye, Math.round(M) + 0.5), t.lineTo(s - Ke, Math.round(M) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = o.max - o.min;
  if (p > 0) {
    const g = o.max - (M - i.priceY0) / (i.priceY1 - i.priceY0) * p, T = Ue(g);
    t.font = Ne, t.textBaseline = "middle", t.textAlign = "left";
    const D = t.measureText(T).width, V = 4, I = 2;
    t.fillStyle = n.accent, t.fillRect(s - Ke + 2, M - 7 - I, D + V * 2, 14 + I * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(T, s - Ke + 2 + V, M);
  }
  t.font = Ne, t.textBaseline = "top", t.textAlign = "center";
  const S = Ut(h.start), d = t.measureText(S).width;
  t.fillStyle = n.accent, t.fillRect(m - d / 2 - 4, i.volumeY1 + 2, d + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(S, m, i.volumeY1 + 4), t.restore();
}
const At = 0.25, Ft = 6, Dl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, El = /* @__PURE__ */ Qe({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: sl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = z(null), l = z(null), o = { ...xe }, i = z(0), f = z(0), v = z(0), s = z(1), r = z(null), u = te(() => Math.max(1, n.slotW * s.value));
    let h = null, m = !1;
    function M() {
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
    let p, S, d, g, T;
    const D = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Wt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${zt}

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

    ${Pt}

    gl_FragColor = color;
  }
`;
    function V() {
      if (!(!l.value || !e.value)) {
        if (T = document.createElement("canvas"), n.flat) {
          m = !0, I();
          return;
        }
        try {
          h = new X.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !h.getContext() && (h.dispose(), h = null, m = !0), m) {
          I();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), p = new X.Scene(), S = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new X.CanvasTexture(T), g.minFilter = X.LinearFilter, g.magFilter = X.LinearFilter, d = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ht()
          },
          vertexShader: Dl,
          fragmentShader: D,
          transparent: !0
        }), p.add(new X.Mesh(new X.PlaneGeometry(2, 2), d)), I();
      }
    }
    function I() {
      if (!e.value || !h && !m) return;
      const L = e.value.clientWidth, $ = e.value.clientHeight;
      !L || !$ || !(T.width !== L || T.height !== $) || (T.width = L, T.height = $, i.value = L, f.value = $, h ? (g && (g.dispose(), g = new X.CanvasTexture(T), g.minFilter = X.LinearFilter, g.magFilter = X.LinearFilter, d && (d.uniforms.uTex.value = g)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(L, $)) : l.value && (l.value.width = L, l.value.height = $, l.value.style.width = L + "px", l.value.style.height = $ + "px"), y());
    }
    function y() {
      if (!(T != null && T.width)) return;
      if (m) {
        if (!l.value) return;
        an(T, {
          candles: n.candles,
          slotW: u.value,
          scrollX: v.value,
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
        const $ = l.value.getContext("2d");
        $ && ($.clearRect(0, 0, l.value.width, l.value.height), $.drawImage(T, 0, 0));
        return;
      }
      if (!h || !d || !g) return;
      const L = n.theme === "paper";
      d.uniforms.uStrength.value = n.curvature / 45 * 0.55, d.uniforms.uScanlines.value = n.scanlines && !L ? 1 : 0, d.uniforms.uVignette.value = L ? 0 : 1, $t(d, n.magnify, o, T.width, T.height), an(T, {
        candles: n.candles,
        slotW: u.value,
        scrollX: v.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: r.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), g.needsUpdate = !0, h.render(p, S);
    }
    K(() => n.theme, () => y()), K(() => n.curvature, () => y()), K(() => n.scanlines, () => y()), K(() => n.glow, () => y()), K(() => n.showVolume, () => y()), K(() => n.volumeFraction, () => y()), K(() => n.slotW, () => y()), K(() => n.candles, () => y(), { deep: !1 }), K(() => n.overlays, () => y(), { deep: !1 }), K(() => n.markers, () => y(), { deep: !1 }), K(() => n.compact, () => y()), K(() => n.magnify, (L) => {
      L || (o.x = xe.x, o.y = xe.y), y();
    }), K(() => n.colors, () => y(), { deep: !0 }), K(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), K(v, () => y()), K(s, () => y()), K(r, () => y()), K(u, () => y());
    let C = null, Y = null, B = 0;
    const Q = Tt("cathodeResetTick", z(0));
    K(Q, () => q());
    function q() {
      cancelAnimationFrame(B), B = requestAnimationFrame(I);
    }
    function G(L) {
      L.preventDefault();
    }
    function J() {
      h == null || h.dispose(), h = null, m = !1, V();
    }
    function E(L) {
      if (!l.value) return [-1, -1];
      const $ = l.value.getBoundingClientRect();
      return [L.clientX - $.left, L.clientY - $.top];
    }
    function P(L) {
      var Ve;
      const $ = u.value;
      if ($ <= 0) return 0;
      const ee = ((Ve = n.candles) == null ? void 0 : Ve.length) ?? 0, Se = Math.max(1, Math.floor((i.value || 1) / $)), Le = Math.max(0, ee - Se);
      return Math.max(0, Math.min(L, Le * $));
    }
    function N(L) {
      var Se;
      if (L.deltaX !== 0 || L.shiftKey && L.deltaY !== 0) {
        const Le = L.deltaX !== 0 ? L.deltaX : L.deltaY;
        v.value = P(v.value + Le);
        return;
      }
      if (L.deltaY === 0) return;
      const [$] = E(L), ee = u.value;
      if ($ >= 0 && ee > 0 && ((Se = n.candles) != null && Se.length)) {
        const Le = Math.max(1, Math.floor((i.value || 1) / ee)), ct = Math.max(0, n.candles.length - Le - Math.floor(v.value / ee)) + ($ - 8) / ee, ut = Math.exp(-L.deltaY * 15e-4), qe = Math.max(At, Math.min(Ft, s.value * ut));
        s.value = qe;
        const Te = n.slotW * qe, ne = Math.max(1, Math.floor((i.value || 1) / Te)), Xe = ct - ($ - 8) / Te, oe = Math.max(0, n.candles.length - ne - Xe);
        v.value = P(oe * Te);
      } else {
        const Le = Math.exp(-L.deltaY * 15e-4);
        s.value = Math.max(At, Math.min(Ft, s.value * Le));
      }
    }
    let H = !1, _ = 0, O = 0;
    function x(L) {
      L.button === 0 && (H = !0, _ = L.clientX, O = v.value, r.value = null, e.value && e.value.focus());
    }
    function U(L) {
      const $ = Math.exp(L * 0.18);
      s.value = Math.max(At, Math.min(Ft, s.value * $)), v.value = P(v.value);
    }
    function ce(L) {
      const $ = u.value, ee = L.shiftKey ? 20 : 3;
      switch (L.key) {
        case "ArrowLeft":
          L.preventDefault(), v.value = P(v.value + $ * ee);
          break;
        case "ArrowRight":
          L.preventDefault(), v.value = P(v.value - $ * ee);
          break;
        case "ArrowUp":
          L.preventDefault(), U(1);
          break;
        case "ArrowDown":
          L.preventDefault(), U(-1);
          break;
        case "Home":
          L.preventDefault(), v.value = P(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          L.preventDefault(), v.value = 0;
          break;
      }
    }
    function le(L) {
      if (H) {
        const $ = L.clientX - _;
        v.value = P(O + $);
        return;
      }
    }
    function ie() {
      H = !1;
    }
    function fe(L) {
      if (L.touches.length !== 1) return;
      const $ = L.touches[0];
      H = !0, _ = $.clientX, O = v.value, r.value = null;
    }
    function re(L) {
      if (!H || L.touches.length !== 1) return;
      L.preventDefault();
      const ee = L.touches[0].clientX - _;
      v.value = P(O + ee);
    }
    function me() {
      H = !1;
    }
    function ue(L) {
      if (n.magnify && l.value) {
        const Se = Vt(L, l.value);
        o.x = Se.x, o.y = Se.y, y();
      }
      if (H) return;
      const [$, ee] = E(L);
      if ($ < 0 || ee < 0) {
        r.value = null;
        return;
      }
      r.value = { x: $, y: ee };
    }
    function Me() {
      r.value = null, o.x = xe.x, o.y = xe.y, y();
    }
    Ge(() => {
      document.addEventListener("mousemove", le), document.addEventListener("mouseup", ie), $e(() => {
        var L;
        V(), l.value && (l.value.addEventListener("webglcontextlost", G), l.value.addEventListener("webglcontextrestored", J)), e.value && (C = new ResizeObserver(() => I()), C.observe(e.value), Y = new IntersectionObserver(($) => {
          $.some((ee) => ee.isIntersecting) && q();
        }), Y.observe(e.value)), window.addEventListener("resize", q), (L = window.visualViewport) == null || L.addEventListener("resize", q);
      });
    }), et(() => {
      var L, $, ee;
      document.removeEventListener("mousemove", le), document.removeEventListener("mouseup", ie), (L = l.value) == null || L.removeEventListener("webglcontextlost", G), ($ = l.value) == null || $.removeEventListener("webglcontextrestored", J), C == null || C.disconnect(), Y == null || Y.disconnect(), window.removeEventListener("resize", q), (ee = window.visualViewport) == null || ee.removeEventListener("resize", q), cancelAnimationFrame(B), M();
    });
    const Ee = te(() => xt[n.theme] ?? xt.none), Ie = te(() => ({
      background: Ee.value.bg
    }));
    return (L, $) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Be(Ie.value),
      tabindex: "0",
      onKeydown: ce
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: Oe(N, ["prevent"]),
        onMousedown: x,
        onMousemove: ue,
        onMouseleave: Me,
        onTouchstartPassive: fe,
        onTouchmove: re,
        onTouchend: me,
        onTouchcancel: me
      }, null, 544)
    ], 36));
  }
}), io = /* @__PURE__ */ tt(El, [["__scopeId", "data-v-78e7021b"]]), Kt = z(0), _t = 28, rt = 12;
let Yt = 10, Mt = "cathode.layout", St = !1;
const be = z({});
function Al(t, n = "cathode.layout") {
  if (!St) {
    St = !0, Mt = n;
    try {
      const e = localStorage.getItem(Mt);
      if (e) {
        be.value = JSON.parse(e), rn();
        return;
      }
    } catch {
    }
    be.value = { ...t }, rn();
  }
}
function rn() {
  let t = 10;
  for (const n of Object.values(be.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  Yt = t;
}
function nt() {
  localStorage.setItem(Mt, JSON.stringify(be.value));
}
function Fl(t) {
  St = !1, localStorage.removeItem(Mt), be.value = { ...t }, nt(), St = !0, Kt.value++;
}
function hn(t) {
  Yt++, be.value[t] && (be.value[t].zIndex = Yt);
}
function Bl(t, n) {
  be.value[t].visible = n, nt();
}
function _l(t, n) {
  be.value[t].minimized = n, n && (be.value[t].maximized = !1), nt();
}
function Yl(t, n) {
  be.value[t].maximized = n, n && (be.value[t].minimized = !1, hn(t)), nt();
}
function Wl(t, n, e) {
  be.value[t].x = Math.round(n), be.value[t].y = Math.round(e), nt();
}
function zl(t, n, e) {
  be.value[t].w = Math.round(n), be.value[t].h = Math.round(e), nt();
}
function ro(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), o = Math.ceil(e.length / l), i = Math.floor((t - rt * (l + 1)) / l), f = Math.floor((n - rt * (o + 1)) / o), v = {};
  return e.forEach((s, r) => {
    const u = r % l, h = Math.floor(r / l);
    v[s] = {
      x: rt + u * (i + rt),
      y: rt + h * (f + rt),
      w: i,
      h: f,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: r + 1
    };
  }), v;
}
function mn() {
  return {
    containers: be,
    TITLEBAR_H: _t,
    load: Al,
    save: nt,
    reset: Fl,
    bringToFront: hn,
    setVisible: Bl,
    setMinimized: _l,
    setMaximized: Yl,
    updatePos: Wl,
    updateSize: zl
  };
}
const Pl = { class: "ws-toolbar" }, Hl = {
  key: 0,
  class: "ws-restore-menu"
}, $l = {
  key: 0,
  class: "ws-restore-empty"
}, Vl = ["onClick"], Xl = /* @__PURE__ */ Qe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: o, setVisible: i } = mn(), f = z(null);
    Qt("cathodeWorkspace", f), Qt("cathodeResetTick", Kt), Ge(() => {
      if (!f.value) return;
      const { clientWidth: d, clientHeight: g } = f.value, T = n.initialLayout ?? {};
      l(T, n.storageKey ?? "cathode.layout");
      const D = Object.keys(e.value)[0];
      D && v(D);
    });
    function v(d) {
      var T;
      document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused"));
      const g = (T = f.value) == null ? void 0 : T.querySelector(`#cc-${d}`);
      g && g.classList.add("cc-focused");
    }
    function s() {
      !f.value || !n.initialLayout || o(n.initialLayout);
    }
    function r(d) {
      const g = d.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = z(!1), h = () => Object.entries(e.value).filter(([, d]) => !d.visible).map(([d]) => d);
    function m(d) {
      i(d, !0), u.value = !1;
    }
    function M(d) {
      if (!u.value) return;
      const g = d.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function p(d) {
      d.key === "Escape" && (u.value = !1);
    }
    Ge(() => {
      document.addEventListener("click", M), document.addEventListener("keydown", p);
    }), et(() => {
      document.removeEventListener("click", M), document.removeEventListener("keydown", p);
    });
    function S(d) {
      var g;
      return ((g = n.containerTitles) == null ? void 0 : g[d]) ?? d;
    }
    return (d, g) => (pe(), we("div", {
      ref_key: "workspaceEl",
      ref: f,
      class: "cathode-workspace",
      onMousedown: r
    }, [
      Bt(d.$slots, "default", {}, void 0, !0),
      Bt(d.$slots, "overlay", {}, void 0, !0),
      se("div", Pl, [
        t.initialLayout ? (pe(), we("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: s
        }, " ↺ Reset Layout ")) : He("", !0),
        g[1] || (g[1] = se("div", { class: "ws-sep" }, null, -1)),
        se("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (T) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      cn(Rn, { name: "menu" }, {
        default: Dn(() => [
          u.value ? (pe(), we("div", Hl, [
            g[3] || (g[3] = se("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? He("", !0) : (pe(), we("div", $l, " No closed panels ")),
            (pe(!0), we(En, null, An(h(), (T) => (pe(), we("div", {
              key: T,
              class: "ws-restore-item",
              onClick: (D) => m(T)
            }, [
              g[2] || (g[2] = se("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Fn(" " + Pe(S(T)), 1)
            ], 8, Vl))), 128))
          ])) : He("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), so = /* @__PURE__ */ tt(Xl, [["__scopeId", "data-v-5838d04b"]]), Nl = ["id"], Ol = { class: "cc-title" }, Ul = {
  key: 0,
  class: "cc-size-badge"
}, Kl = { class: "cc-controls" }, Gl = ["title"], jl = { class: "cc-body" }, ql = 200, Zl = 80, sn = 60, Jl = /* @__PURE__ */ Qe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: o, setMinimized: i, setMaximized: f, updatePos: v, updateSize: s } = mn(), r = Tt("cathodeWorkspace", z(null)), u = te(() => e.value[n.id]), h = te(() => {
      const x = u.value, U = n.curvature ?? 0;
      if (!x) return {};
      const ce = { "--curvature": U };
      return x.maximized ? { ...ce, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: x.zIndex } : {
        ...ce,
        left: x.x + "px",
        top: x.y + "px",
        width: x.w + "px",
        height: x.minimized ? _t + "px" : x.h + "px",
        zIndex: x.zIndex,
        display: x.visible ? "flex" : "none"
      };
    });
    let m = !1, M = 0, p = 0;
    function S(x) {
      var le;
      if (x.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), m = !0;
      const U = (le = r.value) == null ? void 0 : le.querySelector(`#cc-${n.id}`);
      if (!U) return;
      const ce = U.getBoundingClientRect();
      M = x.clientX - ce.left, p = x.clientY - ce.top, document.addEventListener("mousemove", d), document.addEventListener("mouseup", g), x.preventDefault();
    }
    function d(x) {
      var fe;
      if (!m || !r.value) return;
      const U = r.value.getBoundingClientRect(), ce = ((fe = u.value) == null ? void 0 : fe.w) ?? 300;
      let le = x.clientX - U.left - M, ie = x.clientY - U.top - p;
      le = Math.max(sn - ce, Math.min(U.width - sn, le)), ie = Math.max(0, Math.min(U.height - _t, ie)), v(n.id, le, ie);
    }
    function g() {
      m = !1, document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", g);
    }
    let T = !1, D = 0, V = 0, I = 0, y = 0;
    const C = z("");
    function Y(x) {
      u.value.maximized || (l(n.id), T = !0, D = x.clientX, V = x.clientY, I = u.value.w, y = u.value.h, document.addEventListener("mousemove", B), document.addEventListener("mouseup", Q), x.preventDefault(), x.stopPropagation());
    }
    function B(x) {
      if (!T) return;
      const U = Math.max(ql, I + (x.clientX - D)), ce = Math.max(Zl, y + (x.clientY - V));
      s(n.id, U, ce), C.value = `${Math.round(U)}×${Math.round(ce)}`;
    }
    function Q() {
      T = !1, C.value = "", document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", Q), q.value++;
    }
    const q = z(0);
    K(Kt, () => {
      q.value++;
    }), et(() => {
      var x;
      document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", Q), (x = G.value) == null || x.removeEventListener("scroll", E), P();
    });
    const G = z(null);
    function J(x) {
      if (n.canvas) return [];
      const U = x.children[0];
      return U ? Array.from(U.children) : [];
    }
    function E() {
      const x = G.value, U = n.curvature ?? 0;
      if (!x) return;
      const ce = J(x);
      if (!ce.length) return;
      const le = x.clientHeight, ie = le / 2, fe = U * 38e-4;
      ce.forEach((re) => {
        if (!re.dataset.origFs) {
          const Se = getComputedStyle(re);
          re.dataset.origFs = Se.fontSize, re.dataset.origLh = Se.lineHeight;
        }
        if (U === 0) {
          re.style.fontSize = "", re.style.lineHeight = "";
          return;
        }
        const me = re.getBoundingClientRect(), ue = x.getBoundingClientRect(), Me = me.top - ue.top + me.height / 2, Ee = Math.min(1, Math.abs(Me - ie) / (le / 2)), Ie = 1 + fe * Math.cos(Ee * Math.PI / 2), L = parseFloat(re.dataset.origFs), $ = re.dataset.origLh, ee = $ === "normal" ? L * 1.4 : parseFloat($);
        isNaN(L) || (re.style.fontSize = `${(L * Ie).toFixed(2)}px`), isNaN(ee) || (re.style.lineHeight = `${(ee * Ie).toFixed(2)}px`);
      });
    }
    function P() {
      const x = G.value;
      x && J(x).forEach((U) => {
        U.style.fontSize = "", U.style.lineHeight = "", delete U.dataset.origFs, delete U.dataset.origLh;
      });
    }
    K(() => n.curvature, (x) => {
      (x ?? 0) === 0 ? P() : E();
    }), Ge(() => {
      var x;
      (x = G.value) == null || x.addEventListener("scroll", E, { passive: !0 }), $e(E);
    });
    function N() {
      i(n.id, !u.value.minimized), $e(() => {
        q.value++;
      });
    }
    function H() {
      f(n.id, !u.value.maximized), $e(() => {
        q.value++;
      });
    }
    function _() {
      o(n.id, !1);
    }
    function O() {
      l(n.id);
    }
    return (x, U) => u.value && u.value.visible ? (pe(), we("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: Bn(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Be(h.value),
      onMousedown: O
    }, [
      se("div", {
        class: "cc-titlebar",
        onMousedown: S
      }, [
        U[0] || (U[0] = se("span", { class: "cc-status-dot" }, null, -1)),
        se("span", Ol, Pe(t.title), 1),
        C.value ? (pe(), we("span", Ul, Pe(C.value), 1)) : He("", !0),
        se("div", Kl, [
          se("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Oe(N, ["stop"])
          }, "─"),
          se("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Oe(H, ["stop"])
          }, Pe(u.value.maximized ? "⤡" : "⤢"), 9, Gl),
          se("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Oe(_, ["stop"])
          }, "✕")
        ])
      ], 32),
      un(se("div", jl, [
        se("div", {
          ref_key: "bodyEl",
          ref: G,
          class: "cc-screen",
          onScroll: E
        }, [
          Bt(x.$slots, "default", { resizeKey: q.value }, void 0, !0),
          U[1] || (U[1] = se("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [_n, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (pe(), we("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Oe(Y, ["stop"])
      }, null, 32)) : He("", !0)
    ], 46, Nl)) : He("", !0);
  }
}), co = /* @__PURE__ */ tt(Jl, [["__scopeId", "data-v-d8a49f79"]]), Ql = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, eo = `
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
`, to = 100, no = /* @__PURE__ */ Qe({
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
    let i = null, f = !1;
    function v() {
      if (i) {
        try {
          i.forceContextLoss();
        } catch {
        }
        try {
          i.dispose();
        } catch {
        }
        i = null;
      }
    }
    let s, r, u, h, m, M = null, p = 0;
    function S(y) {
      y - p >= to && (T(), p = y), M = requestAnimationFrame(S);
    }
    function d() {
      if (!l.value || !m) return;
      const y = l.value.clientWidth, C = l.value.clientHeight;
      y <= 0 || C <= 0 || m.width === y && m.height === C || (m.width = y, m.height = C, i && i.setSize(y, C, !1), o.value && (o.value.width = y, o.value.height = C, o.value.style.width = y + "px", o.value.style.height = C + "px"));
    }
    function g() {
      if (!(m != null && m.width)) return;
      const y = m.getContext("2d");
      if (!y) return;
      const C = m.width, Y = m.height, B = e[n.theme] ?? e.none;
      y.clearRect(0, 0, C, Y), y.fillStyle = B.bg, y.fillRect(0, 0, C, Y);
      const Q = Date.now(), q = (Q / 500 | 0) % 2 === 0, G = (Q / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(C, Y) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = B.text, n.glow && (y.shadowColor = B.text, y.shadowBlur = 14);
      const J = ".".repeat(G).padEnd(3, " "), E = `${n.label}${J}`;
      if (y.fillText(E, C / 2, Y / 2), y.shadowBlur = 0, q) {
        const P = y.measureText(E), N = y.measureText("M").width, H = parseFloat(y.font), _ = C / 2 + P.width / 2 + 4, O = Y / 2 - H / 2 + 2;
        y.fillStyle = B.cursor, n.glow && (y.shadowColor = B.cursor, y.shadowBlur = 12), y.fillRect(_, O, N * 0.7, H * 0.95), y.shadowBlur = 0;
      }
    }
    function T() {
      if (!m) return;
      if (g(), f) {
        if (!o.value) return;
        const C = o.value.getContext("2d");
        C && C.drawImage(m, 0, 0);
        return;
      }
      if (!i || !u || !h) return;
      const y = n.theme === "paper";
      u.uniforms.uStrength.value = n.curvature / 45 * 0.55, u.uniforms.uScanlines.value = n.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, h.needsUpdate = !0, i.render(s, r);
    }
    function D() {
      if (!(!o.value || !l.value)) {
        m = document.createElement("canvas");
        try {
          i = new X.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !i.getContext() && (i.dispose(), i = null, f = !0), f) {
          d();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), s = new X.Scene(), r = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new X.CanvasTexture(m), h.minFilter = X.LinearFilter, h.magFilter = X.LinearFilter, u = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ql,
          fragmentShader: eo,
          transparent: !0
        }), s.add(new X.Mesh(new X.PlaneGeometry(2, 2), u)), d();
      }
    }
    let V = null;
    Ge(() => {
      D(), T(), M = requestAnimationFrame(S), l.value && (V = new ResizeObserver(() => d()), V.observe(l.value));
    }), et(() => {
      M !== null && cancelAnimationFrame(M), V == null || V.disconnect(), v(), h == null || h.dispose(), u == null || u.dispose();
    }), K(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => T());
    const I = te(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (y, C) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Be(I.value)
    }, [
      se("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), uo = /* @__PURE__ */ tt(no, [["__scopeId", "data-v-5a54a7ab"]]);
export {
  xt as CANDLE_THEME_COLORS,
  io as CathodeCandle,
  co as CathodeContainer,
  oo as CathodeGrid,
  uo as CathodeLoader,
  al as CathodeLog,
  ao as CathodeTerminal,
  so as CathodeWorkspace,
  bt as LOG_THEME_COLORS,
  ro as buildDefaultLayout,
  mn as useCathodeLayout
};
