import { defineComponent as nt, ref as Y, reactive as Nt, watch as X, nextTick as Be, computed as te, inject as Wt, onMounted as qe, onUnmounted as lt, openBlock as be, createElementBlock as xe, normalizeStyle as Ke, createElementVNode as ve, withModifiers as et, withKeys as xn, createCommentVNode as Ve, toDisplayString as He, createVNode as Dn, withDirectives as An, vModelText as Qn, provide as Mn, renderSlot as qt, Transition as el, withCtx as tl, Fragment as nl, renderList as ll, createTextVNode as ol, normalizeClass as al, vShow as rl } from "vue";
import * as U from "three";
const Ue = {
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
}, pe = 30, Zt = 12, il = 10, Et = 14, Fn = 5;
function Dt() {
  return `${Zt}px system-ui, -apple-system, sans-serif`;
}
function _n(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const r = [];
  let i = "";
  for (const v of a) {
    const f = i ? i + " " + v : v;
    !i || t.measureText(f).width <= e ? i = f : (r.push(i), i = v);
  }
  return i && r.push(i), r.length ? r : [""];
}
function sl(t, n) {
  return Math.max(n, t * Et + Fn * 2);
}
function en(t, n) {
  const e = new Array(n + 1);
  e[0] = 0;
  for (let l = 0; l < n; l++) e[l + 1] = e[l] + (t[l] ?? 0);
  return e;
}
function At(t, n) {
  if (n <= 0) return 0;
  let e = 0, l = t.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    t[a] <= n ? e = a : l = a - 1;
  }
  return e;
}
const Bn = 28;
function cl(t, n) {
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
function Sn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ue[n.theme] ?? Ue.none, { cols: i, rows: v, pinnedRows: f, rowHeight: d, scrollY: u, scrollX: h, glow: m } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const S = f.length * d, T = n.aggregateRow ? Bn : 0, A = a - pe - S - T;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, l, pe), e.textBaseline = "middle", e.textAlign = "left";
  let c = -h;
  for (let H = 0; H < i.length; H++) {
    const b = i[H];
    if (c + b.width <= 0) {
      c += b.width;
      continue;
    }
    if (c >= l) break;
    const R = !!n.colFilters[b.colId], B = n.sortColId === b.colId, N = (b.colDef.headerName ?? b.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(c, 0, b.width, pe), e.clip(), e.font = `bold ${il}px system-ui, -apple-system, sans-serif`, e.fillStyle = R ? r.accent : r.textHeader, m ? (e.shadowColor = r.textHeader, e.shadowBlur = 10, e.fillText(N, c + 8, pe / 2), e.shadowBlur = 4, e.fillText(N, c + 8, pe / 2), e.shadowBlur = 0) : e.fillText(N, c + 8, pe / 2), B) {
      const $ = e.measureText(N).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", c + 8 + $ + 4, pe / 2);
    }
    b.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = R ? r.accent : r.textHeader, e.globalAlpha = R ? 1 : 0.38, e.fillText("⌕", c + b.width - 20, pe / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(c + b.width - 0.5, 0), e.lineTo(c + b.width - 0.5, pe), e.stroke(), c += b.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, pe - 0.5), e.lineTo(l, pe - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, pe, l, A), e.clip();
  const g = n.rowHeights && n.rowHeights.length === v.length ? n.rowHeights : null, M = g ? en(g, v.length) : null, L = (H) => M ? M[H] : H * d, O = (H) => g ? g[H] : d, x = M ? At(M, u) : Math.max(0, Math.floor(u / d));
  let w;
  if (M)
    for (w = x; w < v.length && L(w) < u + A; ) w++;
  else
    w = Math.min(v.length, Math.ceil((u + A) / d));
  const k = n.selectionAnchorRow ?? n.selectedRow, V = n.selectionAnchorCol ?? n.selectedCol, G = n.selectedRow >= 0 && k >= 0 ? Math.min(n.selectedRow, k) : -1, ne = n.selectedRow >= 0 && k >= 0 ? Math.max(n.selectedRow, k) : -1, ee = n.selectedCol >= 0 && V >= 0 ? Math.min(n.selectedCol, V) : -1, le = n.selectedCol >= 0 && V >= 0 ? Math.max(n.selectedCol, V) : -1, Z = ne > G || le > ee;
  let W = Number.POSITIVE_INFINITY, P = Number.NEGATIVE_INFINITY, ue = Number.POSITIVE_INFINITY, ae = Number.NEGATIVE_INFINITY;
  const ce = (H, b, R, B) => {
    m ? (e.shadowColor = B, e.shadowBlur = 12, e.fillText(H, b, R), e.shadowBlur = 6, e.fillText(H, b, R), e.shadowBlur = 2, e.fillText(H, b, R), e.shadowBlur = 0) : e.fillText(H, b, R);
  };
  for (let H = x; H < w; H++) {
    const b = v[H], R = O(H), B = pe + L(H) - u;
    H % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, B, l, R));
    const N = H >= G && H <= ne;
    H === n.hoveredRow && !N && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, B, l, R)), N && !Z && (e.fillStyle = Vt(r.accent, 0.1), e.fillRect(0, B, l, R)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B + R - 0.5), e.lineTo(l, B + R - 0.5), e.stroke();
    let $ = -h;
    for (let J = 0; J < i.length; J++) {
      const K = i[J];
      if ($ + K.width <= 0) {
        $ += K.width;
        continue;
      }
      if ($ >= l) break;
      const we = N && J >= ee && J <= le;
      we && Z && (e.fillStyle = Vt(r.accent, 0.14), e.fillRect($, B, K.width, R)), we && ($ < W && (W = $), $ + K.width > P && (P = $ + K.width), B < ue && (ue = B), B + R > ae && (ae = B + R));
      const se = n.getCellStyle(K, b), ge = se.color ?? r.text, Le = se.textAlign ?? "left", oe = n.formatCell(K, b);
      if (e.save(), e.beginPath(), e.rect($ + 1, B, K.width - 2, R), e.clip(), e.font = Dt(), e.fillStyle = ge, e.textBaseline = "middle", K.colDef.wrap) {
        e.textAlign = "left";
        const E = _n(e, oe, Math.max(20, K.width - 16));
        let z = B + Fn + Et / 2;
        for (const re of E) {
          if (z - Et / 2 >= B + R) break;
          ce(re, $ + 8, z, ge), z += Et;
        }
      } else {
        const E = Le === "right" ? $ + K.width - 8 : $ + 8;
        e.textAlign = Le === "right" ? "right" : "left", ce(oe, E, B + R / 2, ge);
      }
      e.restore(), H === n.selectedRow && J === n.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect($ + 1.5, B + 1.5, K.width - 3, R - 3)), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo($ + K.width - 0.5, B), e.lineTo($ + K.width - 0.5, B + R), e.stroke(), $ += K.width;
    }
  }
  if (Z && W < P && ue < ae && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(W + 0.5, ue + 0.5, P - W - 1, ae - ue - 1)), e.restore(), f.length > 0) {
    const H = a - S - T;
    e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    for (let b = 0; b < f.length; b++) {
      const R = f[b], B = H + b * d;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, B, l, d);
      let N = -h;
      for (let $ = 0; $ < i.length; $++) {
        const J = i[$];
        if (N + J.width <= 0) {
          N += J.width;
          continue;
        }
        if (N >= l) break;
        const K = n.getCellStyle(J, R), we = K.color ?? r.text, se = K.textAlign ?? "left", ge = n.formatCell(J, R);
        e.save(), e.beginPath(), e.rect(N + 1, B, J.width - 2, d), e.clip(), e.font = `bold ${Zt}px system-ui, -apple-system, sans-serif`, e.fillStyle = we, e.textBaseline = "middle", se === "right" ? (e.textAlign = "right", e.fillText(ge, N + J.width - 8, B + d / 2)) : (e.textAlign = "left", e.fillText(ge, N + 8, B + d / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(N + J.width - 0.5, B), e.lineTo(N + J.width - 0.5, B + d), e.stroke(), N += J.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B + d - 0.5), e.lineTo(l, B + d - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const H = a - T;
    e.fillStyle = Vt(r.accent, 0.1), e.fillRect(0, H, l, T), e.strokeStyle = r.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, H - 0.5), e.lineTo(l, H - 0.5), e.stroke();
    let b = -h;
    for (let R = 0; R < i.length; R++) {
      const B = i[R];
      if (b + B.width <= 0) {
        b += B.width;
        continue;
      }
      if (b >= l) break;
      const $ = n.getCellStyle(B, n.aggregateRow).textAlign ?? "left", J = n.aggregateRow[B.colId] ?? "";
      e.save(), e.beginPath(), e.rect(b + 1, H, B.width - 2, T), e.clip(), e.font = `bold ${Zt}px system-ui, -apple-system, sans-serif`, e.fillStyle = r.accent, e.textBaseline = "middle", m && (e.shadowColor = r.accent, e.shadowBlur = 8), $ === "right" ? (e.textAlign = "right", e.fillText(J, b + B.width - 8, H + T / 2)) : (e.textAlign = "left", e.fillText(J, b + 8, H + T / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(b + B.width - 0.5, H), e.lineTo(b + B.width - 0.5, H + T), e.stroke(), b += B.width;
    }
  }
  e.restore();
}
function Vt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
const It = 190, $t = 34;
function ul(t, n, e) {
  const l = Math.max(4, Math.min(n, t - It - 4)), a = pe + 6, r = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: It, h: $t },
    input: { x: l + 9, y: a + 5, w: It - 18 - r, h: $t - 10 },
    clear: e ? { x: l + It - 28, y: a, w: 28, h: $t } : null
  };
}
const Xt = (t, n, e, l = 0) => t >= e.x - l && t <= e.x + e.w + l && n >= e.y && n <= e.y + e.h;
function Lt(t, n, e, l = 1) {
  return e.clear && Xt(t, n, e.clear, 4 * (l - 1)) ? "clear" : Xt(t, n, e.input) ? "input" : Xt(t, n, e.box) ? "inside" : "outside";
}
function fl(t, n, e, l, a) {
  const { box: r, input: i, clear: v } = n;
  t.save(), t.fillStyle = "rgba(8,12,22,0.94)", t.strokeStyle = a.accent, t.lineWidth = 1, t.beginPath(), t.roundRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1, 4), t.fill(), t.stroke(), t.fillStyle = "rgba(255,255,255,0.05)", t.beginPath(), t.roundRect(i.x, i.y, i.w, i.h, 3), t.fill(), t.beginPath(), t.rect(i.x, i.y, i.w, i.h), t.clip(), t.font = Dt(), t.textBaseline = "middle";
  const f = i.y + i.h / 2 + 1, d = 5;
  if (e) {
    t.fillStyle = a.text;
    const u = t.measureText(e).width, h = u > i.w - 2 * d - 2 ? i.x + i.w - d - 2 - u : i.x + d;
    t.fillText(e, h, f), l && (t.fillStyle = a.accent, t.fillRect(Math.min(h + u + 1, i.x + i.w - d), i.y + 4, 1.5, i.h - 8));
  } else
    t.fillStyle = a.textHeader, t.fillText("Filter…", i.x + d, f), l && (t.fillStyle = a.accent, t.fillRect(i.x + d, i.y + 4, 1.5, i.h - 8));
  t.restore(), v && (t.save(), t.font = Dt(), t.textBaseline = "middle", t.textAlign = "center", t.fillStyle = a.textHeader, t.fillText("✕", v.x + v.w / 2, v.y + v.h / 2 + 1), t.restore());
}
function dl(t, n, e) {
  const l = t - 0.5, a = n - 0.5, r = Math.abs(e), i = (l * l + a * a) * r;
  if (e < 0) {
    const d = 0.5 * r, h = 1 / (1 - 2 * (0.5 * (1 + d) * d)), m = (l + l * (1 + i) * i * -1) * h, S = (a + a * (1 + i) * i * -1) * h;
    return [0.5 + m, 0.5 + S];
  }
  const v = l * (1 + i) * i, f = a * (1 + i) * i;
  return [t + v, n + f * 0.15];
}
function vl(t, n, e, l, a, r = e, i = l) {
  const v = t / e, f = 1 - n / l, [d, u] = dl(v, f, a);
  return d < 0 || d > 1 || u < 0 || u > 1 ? [-1, -1] : [d * r, (1 - u) * i];
}
function Ut(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function hl(t, n, e, l = 1) {
  return t >= n + e - 24 * l && t < n + e;
}
function Tn(t, n, e, l = 1) {
  const a = n + e;
  return t >= a - 6 * l && t <= a + 1 * l;
}
function Cn(t, n, e, l, a, r, i, v, f, d = !1, u) {
  const h = t + f;
  let m = -1, S = 0;
  for (let M = 0; M < e.length; M++) {
    if (h >= S && h < S + e[M].width) {
      m = M;
      break;
    }
    S += e[M].width;
  }
  if (n < pe) return { area: "header", colIdx: m, rowIdx: -1 };
  const T = d ? Bn : 0;
  if (T > 0 && n >= i - T)
    return { area: "agg", colIdx: m, rowIdx: -1 };
  const A = v * a;
  if (A > 0 && n >= i - A - T) {
    const M = Math.floor((n - (i - A - T)) / a);
    return { area: "pinned", colIdx: m, rowIdx: M };
  }
  const c = n - pe + r, g = u && u.length === l ? At(en(u, l), c) : Math.floor(c / a);
  return g >= 0 && g < l ? { area: "body", colIdx: m, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function ht(t) {
  return t / 45 * 0.55;
}
function ml(t) {
  const n = Math.abs(ht(t));
  if (n === 0) return 1;
  if (t < 0) {
    const l = 0.5 * n;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * n;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const gl = 500, pl = gl / 2, wl = 1.6, tn = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, nn = `
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
`, ln = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function on() {
  return {
    uMouseUV: { value: new U.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: wl },
    uLensTint: { value: new U.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Ce = { x: -999, y: -999 };
function an(t, n, e, l, a) {
  const r = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = r && a > 0 ? pl / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function rn(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const yl = ["value"], bl = ["disabled"], xl = ["disabled"], Ml = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Sl = 28, Tl = 600, Cl = /* @__PURE__ */ nt({
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
    const e = t, l = n, a = Y(e.rowData ?? []), r = Y(e.pinnedBottomRowData ?? []), i = Y(""), v = Y(null), f = Nt({}), d = Nt({}), u = Nt(/* @__PURE__ */ new Set()), h = Y(0), m = Y(0), S = Y(0), T = Y(0), A = Y(0), c = Y(0), g = Y(0), M = Y(-1), L = Y(null), O = Y(null), x = Y(null), w = { ...Ce }, k = Y(""), V = Y(0), G = Y(null);
    let ne = null;
    const ee = Y(!0);
    let le = null;
    X(x, (o) => {
      var s;
      le && (clearInterval(le), le = null), o ? (ee.value = !0, le = setInterval(() => {
        ee.value = !ee.value, me();
      }, 530), Be(() => {
        var p;
        return (p = G.value) == null ? void 0 : p.focus();
      })) : (ne = null, (s = G.value) == null || s.blur()), me();
    });
    function Z(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const W = te(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((s) => !u.has(Z(s))).map((s) => {
        const p = Z(s), I = { ...o, ...s };
        return { colId: p, colDef: I, width: d[p] ?? I.width ?? 100 };
      });
    }), P = te(() => {
      const o = m.value;
      if (!o) return W.value;
      const s = W.value.reduce((C, D) => C + D.width, 0);
      if (!s || s >= o) return W.value;
      const p = o / s;
      let I = 0;
      return W.value.map((C, D) => {
        const de = D === W.value.length - 1 ? o - I : Math.max(8, Math.round(C.width * p));
        return I += de, { ...C, width: de };
      });
    }), ue = te(() => {
      const o = P.value.reduce((s, p) => s + p.width, 0);
      return Math.max(0, o - m.value);
    });
    let ae = null;
    function ce() {
      if (typeof document > "u") return null;
      ae || (ae = document.createElement("canvas"));
      const o = ae.getContext("2d");
      return o && (o.font = Dt()), o;
    }
    const H = te(() => P.value.some((o) => o.colDef.wrap)), b = te(() => {
      if (!H.value) return null;
      const o = ce();
      if (!o) return null;
      const s = P.value.filter((I) => I.colDef.wrap), p = e.rowHeight;
      return oe.value.map((I) => {
        let C = 1;
        for (const D of s) {
          const _ = _n(o, ge(D, I), Math.max(20, D.width - 16));
          _.length > C && (C = _.length);
        }
        return sl(C, p);
      });
    }), R = te(
      () => b.value ? en(b.value, oe.value.length) : null
    ), B = te(
      () => R.value ? R.value[oe.value.length] : oe.value.length * e.rowHeight
    ), N = te(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, S.value - pe - o);
    }), $ = te(
      () => Math.max(0, B.value - N.value)
    ), J = te(
      () => Math.max(1, Math.floor(N.value / e.rowHeight))
    ), K = te(() => {
      const o = oe.value.length;
      if (o === 0) return 0;
      const s = R.value ? At(R.value, c.value) : Math.floor(c.value / e.rowHeight);
      return Math.min(o - 1, s);
    }), we = te(() => {
      const o = oe.value.length;
      return o === 0 ? 0 : R.value ? Math.min(o - 1, At(R.value, c.value + N.value - 1)) : Math.min(o - 1, K.value + J.value - 1);
    });
    function se(o, s) {
      if (s.colDef.valueGetter) return s.colDef.valueGetter({ data: o, colDef: s.colDef });
      if (s.colDef.field) return o[s.colDef.field];
    }
    function ge(o, s) {
      const p = se(s, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: p, data: s, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: p, data: s, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : p == null ? "" : String(p);
    }
    function Le(o, s) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: se(s, o), data: s, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const oe = te(() => {
      h.value;
      let o = a.value;
      const s = i.value.trim().toLowerCase();
      s && (o = o.filter(
        (p) => W.value.some(
          (I) => String(se(p, I) ?? "").toLowerCase().includes(s)
        )
      ));
      for (const [p, I] of Object.entries(f)) {
        if (!I) continue;
        const C = W.value.find((D) => D.colId === p);
        if (C)
          if (I.startsWith("__eq__")) {
            const D = I.slice(6).toLowerCase();
            o = o.filter((_) => String(se(_, C) ?? "").toLowerCase() === D);
          } else {
            const D = I.toLowerCase();
            o = o.filter((_) => String(se(_, C) ?? "").toLowerCase().includes(D));
          }
      }
      if (v.value) {
        const { colId: p, dir: I } = v.value, C = W.value.find((D) => D.colId === p);
        C && (o = [...o].sort((D, _) => {
          const de = se(D, C), Q = se(_, C);
          let he = 0;
          return C.colDef.comparator ? he = C.colDef.comparator(de, Q) : typeof de == "number" && typeof Q == "number" ? he = de - Q : he = String(de ?? "").localeCompare(String(Q ?? ""), void 0, { numeric: !0 }), I === "asc" ? he : -he;
        }));
      }
      return o;
    }), E = te(() => {
      const o = W.value.filter((C) => C.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const s = oe.value, p = {};
      for (const C of o) {
        const D = s.map((de) => se(de, C)), _ = cl(D, C.colDef.aggFunc);
        if (_ == null) {
          p[C.colId] = "";
          continue;
        }
        p[C.colId] = C.colDef.aggValueFormatter ? C.colDef.aggValueFormatter(_) : String(_);
      }
      const I = o[0].colId;
      return p[I] === "" && (p[I] = "Σ"), p;
    });
    X(oe, () => {
      c.value = 0, L.value = null;
    }), X(ue, () => {
      g.value = Math.min(g.value, ue.value);
    }), X($, () => {
      c.value = Math.min(c.value, $.value);
    });
    function z(o) {
      const s = R.value, p = s ? s[o] : o * e.rowHeight, I = s ? s[o + 1] : p + e.rowHeight;
      p < c.value ? c.value = p : I > c.value + N.value && (c.value = Math.min($.value, I - N.value));
    }
    function re() {
      c.value = Math.max(0, c.value - N.value), me();
    }
    function ke() {
      c.value = Math.min($.value, c.value + N.value), me();
    }
    let Se = !1, Pe = "", rt = 0, it = 0, Je = 1, Re = !1, Ee = !1, De = 0, Ae = 0, Xe = 0, st = 0, Ie = !1;
    function Tt(o, s, p = 1) {
      var I;
      Se = !0, Pe = o, rt = s, Je = p, it = ((I = P.value.find((C) => C.colId === o)) == null ? void 0 : I.width) ?? 100, Re = !1;
    }
    function mt(o) {
      if (Ee) {
        const D = De - o.clientX, _ = Ae - o.clientY;
        (Math.abs(D) > 4 || Math.abs(_) > 4) && (Ie = !0), g.value = Math.max(0, Math.min(ue.value, Xe + D)), c.value = Math.max(0, Math.min($.value, st + _)), me();
        return;
      }
      if (!Se) return;
      const s = m.value, p = Math.max(30, it + (o.clientX - rt) * Je), I = W.value.filter((D) => D.colId !== Pe).reduce((D, _) => D + _.width, 0), C = s - p;
      C > 10 && (d[Pe] = Math.max(10, Math.round(p * I / C))), me();
    }
    function Ct() {
      Ee && (Ie && (Re = !0), Ee = !1), Se && (Se = !1, Re = !0, l("column-resized"));
    }
    function Pt(o) {
      if (o.touches.length !== 1) return;
      const s = o.touches[0];
      Ee = !0, Ie = !1, De = s.clientX, Ae = s.clientY, Xe = g.value, st = c.value;
    }
    function y(o) {
      if (!Ee || o.touches.length !== 1) return;
      o.preventDefault();
      const s = o.touches[0], p = De - s.clientX, I = Ae - s.clientY;
      (Math.abs(p) > 4 || Math.abs(I) > 4) && (Ie = !0), g.value = Math.max(0, Math.min(ue.value, Xe + p)), c.value = Math.max(0, Math.min($.value, st + I)), me();
    }
    function F() {
      Ee && (Ie && (Re = !0), Ee = !1);
    }
    const j = Y(null), q = Y(null), Oe = Wt("cathodeResetTick", Y(0));
    X(Oe, () => ft());
    let ie = null, Te = !1;
    function ct() {
      if (ie) {
        try {
          ie.forceContextLoss();
        } catch {
        }
        try {
          ie.dispose();
        } catch {
        }
        ie = null;
      }
    }
    let Ne, vn, ze, Fe, fe;
    const Hn = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${tn}

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

  ${nn}

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

    ${ln}

    gl_FragColor = color;
  }
`;
    function hn() {
      if (!(!q.value || !j.value)) {
        fe = document.createElement("canvas");
        try {
          ie = new U.WebGLRenderer({ canvas: q.value, antialias: !1, alpha: !0 });
        } catch {
          Te = !0;
        }
        if (!Te && !ie.getContext() && (ie.dispose(), ie = null, Te = !0), Te) {
          ut();
          return;
        }
        ie.setPixelRatio(1), ie.setClearColor(0, 0), Ne = new U.Scene(), vn = new U.OrthographicCamera(-1, 1, 1, -1, 0, 1), Fe = new U.CanvasTexture(fe), Fe.minFilter = U.LinearFilter, Fe.magFilter = U.LinearFilter, ze = new U.ShaderMaterial({
          uniforms: {
            uTex: { value: Fe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new U.Color(0) },
            ...on()
          },
          vertexShader: Ml,
          fragmentShader: Hn,
          transparent: !0
        }), Ne.add(new U.Mesh(new U.PlaneGeometry(2, 2), ze)), ut();
      }
    }
    function ut() {
      if (!j.value || !ie && !Te) return;
      const o = j.value.clientWidth, s = j.value.clientHeight - (e.pagination ? Sl : 0);
      if (!o || !s) return;
      T.value = o, A.value = s;
      const p = e.bendField ? Math.round(o * ml(e.curvature)) : o, I = fe.width !== p || fe.height !== s;
      fe.width = p, fe.height = s, m.value = p, S.value = s, g.value = Math.max(0, Math.min(ue.value, g.value)), c.value = Math.max(0, Math.min($.value, c.value)), ie ? (I && Fe && (Fe.dispose(), Fe = new U.CanvasTexture(fe), Fe.minFilter = U.LinearFilter, Fe.magFilter = U.LinearFilter, ze && (ze.uniforms.uTex.value = Fe)), ie.setPixelRatio(window.devicePixelRatio || 1), ie.setSize(o, s)) : q.value && (q.value.width = o, q.value.height = s, q.value.style.width = o + "px", q.value.style.height = s + "px"), me();
    }
    function me() {
      var p, I, C, D, _, de, Q, he, _e, yt, bt, dt;
      if (!(fe != null && fe.width)) return;
      if (Te) {
        if (!q.value) return;
        Sn(fe, {
          cols: P.value,
          rows: oe.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          rowHeights: b.value ?? void 0,
          scrollY: c.value,
          scrollX: g.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((p = v.value) == null ? void 0 : p.colId) ?? null,
          sortDir: ((I = v.value) == null ? void 0 : I.dir) ?? null,
          colFilters: f,
          hoveredRow: M.value,
          selectedRow: ((C = L.value) == null ? void 0 : C.row) ?? -1,
          selectedCol: ((D = L.value) == null ? void 0 : D.col) ?? -1,
          selectionAnchorRow: ((_ = O.value) == null ? void 0 : _.row) ?? -1,
          selectionAnchorCol: ((de = O.value) == null ? void 0 : de.col) ?? -1,
          formatCell: ge,
          getCellStyle: Le
        }), mn();
        const xt = q.value.getContext("2d");
        xt && xt.drawImage(fe, 0, 0, fe.width, fe.height, 0, 0, q.value.width, q.value.height);
        return;
      }
      if (!ie || !ze || !Fe) return;
      const o = Ue[e.theme] ?? Ue.none, s = e.theme === "paper";
      ze.uniforms.uStrength.value = ht(e.curvature), ze.uniforms.uScanlines.value = e.scanlines && !s ? 1 : 0, ze.uniforms.uVignette.value = s ? 0 : 1, ze.uniforms.uBezel.value.set(o.bg), an(ze, e.magnify, w, T.value || fe.width, A.value || fe.height), Sn(fe, {
        cols: P.value,
        rows: oe.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: b.value ?? void 0,
        scrollY: c.value,
        scrollX: g.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((Q = v.value) == null ? void 0 : Q.colId) ?? null,
        sortDir: ((he = v.value) == null ? void 0 : he.dir) ?? null,
        colFilters: f,
        hoveredRow: M.value,
        selectedRow: ((_e = L.value) == null ? void 0 : _e.row) ?? -1,
        selectedCol: ((yt = L.value) == null ? void 0 : yt.col) ?? -1,
        selectionAnchorRow: ((bt = O.value) == null ? void 0 : bt.row) ?? -1,
        selectionAnchorCol: ((dt = O.value) == null ? void 0 : dt.col) ?? -1,
        formatCell: ge,
        getCellStyle: Le,
        aggregateRow: E.value
      }), mn(), Fe.needsUpdate = !0, ie.render(Ne, vn);
    }
    function mn() {
      if (!x.value || !(fe != null && fe.width)) return;
      const o = fe.getContext("2d");
      if (!o) return;
      ne = ul(fe.width, V.value, !!k.value);
      const s = Ue[e.theme] ?? Ue.none;
      fl(o, ne, k.value, ee.value, s);
    }
    function zt(o, s) {
      if (!q.value) return [-1, -1];
      const p = q.value.getBoundingClientRect(), I = o - p.left, C = s - p.top, D = p.width, _ = p.height, de = ht(e.curvature), [Q, he] = vl(I, C, D, _, de, fe.width || D, fe.height || _);
      return Q < 0 ? [-1, -1] : [Q, he];
    }
    function kt(o) {
      return zt(o.clientX, o.clientY);
    }
    function Qe(o) {
      if (!q.value) return 1;
      const [s] = zt(o.clientX - 4, o.clientY), [p] = zt(o.clientX + 4, o.clientY);
      return s < 0 || p < 0 ? 1 : Math.max(1, Math.abs(p - s) / 8);
    }
    let Ht = 0;
    function On(o) {
      x.value = null;
      const s = Date.now();
      if (o.deltaX !== 0) {
        Ht = s, g.value = Math.max(0, Math.min(ue.value, g.value + o.deltaX)), me();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Ht = s, g.value = Math.max(0, Math.min(ue.value, g.value + o.deltaY)), me();
        return;
      }
      s - Ht < Tl || (c.value = Math.max(0, Math.min($.value, c.value + o.deltaY)), me());
    }
    function Nn(o) {
      if (Se) return;
      if (e.magnify && q.value) {
        const C = rn(o, q.value);
        w.x = C.x, w.y = C.y;
      }
      const [s, p] = kt(o);
      if (s < 0) {
        M.value = -1, me();
        return;
      }
      if (x.value && ne) {
        const C = Lt(s, p, ne, Qe(o));
        if (C !== "outside") {
          M.value = -1, q.value.style.cursor = C === "clear" ? "pointer" : "text", me();
          return;
        }
      }
      const I = Cn(
        s,
        p,
        P.value,
        oe.value.length,
        e.rowHeight,
        c.value,
        fe.height,
        r.value.length,
        g.value,
        E.value !== null,
        b.value ?? void 0
      );
      if (M.value = I.area === "body" ? I.rowIdx : -1, I.area === "header" && I.colIdx >= 0) {
        const C = P.value[I.colIdx], D = Ut(I.colIdx, P.value), _ = s + g.value;
        q.value.style.cursor = C && Tn(_, D, C.width, Qe(o)) ? "col-resize" : "pointer";
      } else I.area === "body" ? q.value.style.cursor = "pointer" : q.value.style.cursor = "default";
      me();
    }
    function Vn() {
      M.value = -1, w.x = Ce.x, w.y = Ce.y, me();
    }
    function $n(o) {
      const [s, p] = kt(o);
      if (s < 0 || x.value && ne && Lt(s, p, ne, Qe(o)) !== "outside") return;
      if (p >= pe) {
        Ee = !0, Ie = !1, De = o.clientX, Ae = o.clientY, Xe = g.value, st = c.value;
        return;
      }
      const I = s + g.value, C = Qe(o);
      for (let D = 0; D < P.value.length; D++) {
        const _ = P.value[D], de = Ut(D, P.value);
        if (_.colDef.resizable !== !1 && Tn(I, de, _.width, C)) {
          Tt(_.colId, o.clientX, C);
          return;
        }
      }
    }
    function Xn(o) {
      var C, D, _, de;
      if (Re) {
        Re = !1;
        return;
      }
      if (Se) return;
      const [s, p] = kt(o);
      if (s < 0) {
        x.value = null;
        return;
      }
      if (x.value && ne) {
        const Q = Lt(s, p, ne, Qe(o));
        if (Q === "clear") {
          pn();
          return;
        }
        if (Q !== "outside") {
          (C = G.value) == null || C.focus();
          return;
        }
        x.value = null;
      }
      const I = Cn(
        s,
        p,
        P.value,
        oe.value.length,
        e.rowHeight,
        c.value,
        fe.height,
        r.value.length,
        g.value,
        E.value !== null,
        b.value ?? void 0
      );
      if (I.area === "header" && I.colIdx >= 0) {
        const Q = P.value[I.colIdx], he = Ut(I.colIdx, P.value), _e = s + g.value;
        Q.colDef.filter && hl(_e, he, Q.width, Qe(o)) ? (o.stopPropagation(), x.value === Q.colId ? x.value = null : (x.value = Q.colId, k.value = (D = f[Q.colId]) != null && D.startsWith("__eq__") ? f[Q.colId].slice(6) : f[Q.colId] ?? "", V.value = Math.max(0, he - g.value))) : Q.colDef.sortable !== !1 && (x.value = null, v.value = ((_ = v.value) == null ? void 0 : _.colId) === Q.colId ? v.value.dir === "asc" ? { colId: Q.colId, dir: "desc" } : null : { colId: Q.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (x.value = null, I.area === "body" && I.rowIdx >= 0 && I.colIdx >= 0) {
        const Q = I.rowIdx;
        o.shiftKey && L.value ? (O.value || (O.value = { ...L.value }), L.value = { row: Q, col: I.colIdx }) : (L.value = { row: Q, col: I.colIdx }, O.value = { row: Q, col: I.colIdx }), (de = q.value) == null || de.focus();
        const he = oe.value[Q], _e = P.value[I.colIdx];
        he && _e && (l("row-clicked", { data: he, event: o }), l("cell-selected", { data: he, row: Q, col: I.colIdx, colId: _e.colId }));
      }
    }
    function gn(o) {
      if (x.value) {
        if (o.target === q.value && ne) {
          const [s, p] = kt(o);
          if (s >= 0 && Lt(s, p, ne, Qe(o)) !== "outside") return;
        }
        x.value = null;
      }
    }
    function Un(o) {
      var C;
      if (!m.value) return;
      let s = 0;
      for (let D = 0; D < o; D++) s += P.value[D].width;
      const p = ((C = P.value[o]) == null ? void 0 : C.width) ?? 0, I = s - g.value;
      I < 0 ? g.value = Math.max(0, s) : I + p > m.value && (g.value = Math.min(ue.value, s + p - m.value));
    }
    function Kn(o) {
      const p = P.value.length - 1, I = oe.value.length - 1;
      if (!L.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), L.value = { row: K.value, col: 0 }, O.value = { row: K.value, col: 0 });
        return;
      }
      let { row: C, col: D } = L.value;
      const _ = (de, Q, he = !1) => {
        C = Math.max(0, Math.min(I, de)), D = Math.max(0, Math.min(p, Q)), L.value = { row: C, col: D }, he || (O.value = { row: C, col: D }), z(C), Un(D);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), _(C + 1, D, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), _(C - 1, D, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? _(C, D + 1, !0) : D < p ? _(C, D + 1) : _(C + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? _(C, D - 1, !0) : D > 0 ? _(C, D - 1) : _(C - 1, p);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? D > 0 ? _(C, D - 1) : _(C - 1, p) : D < p ? _(C, D + 1) : _(C + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? _(C - 1, D) : _(C + 1, D);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? _(0, 0, o.shiftKey) : _(C, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? _(I, p, o.shiftKey) : _(C, p, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), _(Math.min(I, C + J.value), D, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), _(Math.max(0, C - J.value), D, o.shiftKey);
          break;
        case "Escape":
          L.value = null, O.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), Gn());
          break;
      }
    }
    function Gn() {
      var he;
      if (!L.value) return;
      const o = P.value, s = oe.value, p = O.value ?? L.value, I = Math.min(p.row, L.value.row), C = Math.max(p.row, L.value.row), D = Math.min(p.col, L.value.col), _ = Math.max(p.col, L.value.col), de = [];
      for (let _e = I; _e <= C; _e++) {
        const yt = s[_e];
        if (!yt) continue;
        const bt = [];
        for (let dt = D; dt <= _; dt++) {
          const xt = o[dt];
          xt && bt.push(ge(xt, yt).replace(/[\t\r\n]+/g, " "));
        }
        de.push(bt.join("	"));
      }
      const Q = de.join(`
`);
      (he = navigator.clipboard) == null || he.writeText(Q).catch(() => {
      });
    }
    function jn(o) {
      const s = o.target.value;
      k.value = s, s ? f[x.value] = s : delete f[x.value], l("filter-changed");
    }
    function pn() {
      x.value && delete f[x.value], k.value = "", x.value = null, l("filter-changed");
    }
    const qn = {
      setGridOption(o, s) {
        o === "rowData" ? a.value = s : o === "pinnedBottomRowData" ? r.value = s : o === "quickFilterText" && (i.value = s);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var p, I;
          const s = Z(o);
          return {
            colId: s,
            hide: u.has(s),
            sort: ((p = v.value) == null ? void 0 : p.colId) === s ? v.value.dir : null,
            sortIndex: ((I = v.value) == null ? void 0 : I.colId) === s ? 0 : null,
            width: d[s] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const s of o)
          s.hide === !0 && u.add(s.colId), s.hide === !1 && u.delete(s.colId), s.sort && (v.value = { colId: s.colId, dir: s.sort }), s.width && (d[s.colId] = s.width);
      },
      setFilterModel(o) {
        for (const s of Object.keys(f)) delete f[s];
        if (o)
          for (const [s, p] of Object.entries(o))
            (p == null ? void 0 : p.type) === "equals" ? f[s] = `__eq__${p.filter}` : p != null && p.filter && (f[s] = p.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [s, p] of Object.entries(f))
          p && (o[s] = p.startsWith("__eq__") ? { type: "equals", filter: p.slice(6) } : { type: "contains", filter: p });
        return o;
      },
      async setColumnFilterModel(o, s) {
        s ? s.type === "equals" ? f[o] = `__eq__${s.filter}` : f[o] = s.filter ?? "" : delete f[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const s = W.value, p = s.map((_) => _.colDef.headerName ?? _.colId).join(","), I = oe.value.map(
          (_) => s.map((de) => `"${String(ge(de, _)).replace(/"/g, '""')}"`).join(",")
        ), C = new Blob([[p, ...I].join(`
`)], { type: "text/csv" }), D = URL.createObjectURL(C);
        Object.assign(document.createElement("a"), { href: D, download: o }).click(), URL.revokeObjectURL(D);
      },
      resize() {
        ut();
      },
      resetColumnState() {
        u.clear();
        for (const s of e.columnDefs)
          s.hide && u.add(Z(s));
        const o = e.columnDefs.find((s) => s.sort);
        v.value = o ? { colId: Z(o), dir: o.sort } : null;
        for (const s of Object.keys(d)) delete d[s];
        for (const s of Object.keys(f)) delete f[s];
        i.value = "", c.value = 0, L.value = null, x.value = null;
      }
    };
    X(
      [oe, () => r.value, P, c, M, L],
      () => Be(me)
    ), X(() => e.theme, () => me()), X(() => [e.curvature, e.bendField], () => Be(ut)), X(() => e.scanlines, () => me()), X(() => e.glow, () => me()), X(() => e.magnify, (o) => {
      o || (w.x = Ce.x, w.y = Ce.y), me();
    }), X(L, (o) => {
      if (!o) return;
      const s = oe.value[o.row], p = P.value[o.col];
      s && p && l("cell-selected", { data: s, row: o.row, col: o.col, colId: p.colId });
    });
    let gt = null, pt = null, Ot = 0;
    function ft() {
      cancelAnimationFrame(Ot), Ot = requestAnimationFrame(ut);
    }
    function wn(o) {
      o.preventDefault();
    }
    function yn() {
      ie == null || ie.dispose(), ie = null, Te = !1, hn();
    }
    qe(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(Z(o)), o.sort && !v.value && (v.value = { colId: Z(o), dir: o.sort });
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", gn), document.addEventListener("mousemove", mt), document.addEventListener("mouseup", Ct), Be(() => {
        var o;
        hn(), q.value && (q.value.addEventListener("webglcontextlost", wn), q.value.addEventListener("webglcontextrestored", yn)), j.value && (gt = new ResizeObserver(() => ut()), gt.observe(j.value), pt = new IntersectionObserver((s) => {
          s.some((p) => p.isIntersecting) && ft();
        }), pt.observe(j.value)), window.addEventListener("resize", ft), (o = window.visualViewport) == null || o.addEventListener("resize", ft), l("grid-ready", { api: qn });
      });
    }), lt(() => {
      var o, s, p;
      document.removeEventListener("click", gn, !0), document.removeEventListener("mousemove", mt), document.removeEventListener("mouseup", Ct), (o = q.value) == null || o.removeEventListener("webglcontextlost", wn), (s = q.value) == null || s.removeEventListener("webglcontextrestored", yn), gt == null || gt.disconnect(), pt == null || pt.disconnect(), window.removeEventListener("resize", ft), (p = window.visualViewport) == null || p.removeEventListener("resize", ft), cancelAnimationFrame(Ot), ct();
    });
    const wt = te(() => Ue[e.theme] ?? Ue.none), Zn = te(() => ({
      background: wt.value.headerBg,
      borderTop: `1px solid ${wt.value.border}`,
      color: wt.value.text
    })), Jn = te(() => ({
      background: wt.value.bg
    })), bn = te(() => wt.value.accent);
    return (o, s) => {
      var p, I;
      return be(), xe("div", {
        ref_key: "wrapEl",
        ref: j,
        class: "cathode-wrap",
        style: Ke(Jn.value)
      }, [
        ve("canvas", {
          ref_key: "canvasEl",
          ref: q,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: et(On, ["prevent"]),
          onMousemove: Nn,
          onMouseleave: Vn,
          onMousedown: $n,
          onClick: Xn,
          onKeydown: Kn,
          onTouchstartPassive: Pt,
          onTouchmove: y,
          onTouchend: F,
          onTouchcancel: F
        }, null, 544),
        x.value ? (be(), xe("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: G,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: k.value,
          autofocus: "",
          onInput: jn,
          onKeydown: [
            xn(pn, ["escape"]),
            s[0] || (s[0] = xn((C) => x.value = null, ["enter"]))
          ]
        }, null, 40, yl)) : Ve("", !0),
        t.pagination ? (be(), xe("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ke(Zn.value)
        }, [
          ve("button", {
            disabled: c.value <= 0,
            onClick: s[1] || (s[1] = (C) => re())
          }, "◀", 8, bl),
          ve("span", null, He((K.value + 1).toLocaleString()) + "–" + He(Math.min(oe.value.length, we.value + 1).toLocaleString()) + " / " + He(oe.value.length.toLocaleString()), 1),
          ve("button", {
            disabled: c.value >= $.value,
            onClick: s[2] || (s[2] = (C) => ke())
          }, "▶", 8, xl),
          ve("span", {
            class: "cathode-page-info",
            style: Ke({ color: bn.value })
          }, He(oe.value.length.toLocaleString()) + " rows ", 5),
          L.value ? (be(), xe("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ke({ color: bn.value })
          }, He(((p = P.value[L.value.col]) == null ? void 0 : p.colDef.headerName) ?? ((I = P.value[L.value.col]) == null ? void 0 : I.colId)) + " : " + He(ge(P.value[L.value.col], oe.value[L.value.row])), 5)) : Ve("", !0)
        ], 4)) : Ve("", !0)
      ], 4);
    };
  }
}), ot = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, _o = /* @__PURE__ */ ot(Cl, [["__scopeId", "data-v-4918f754"]]), Ft = {
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
function kl(t, n) {
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
const Il = 12, ye = 18, St = 10, tt = 6, sn = `${Il}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Ll(t, n, e) {
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
    for (const v of r) {
      const f = i + v;
      if (t.measureText(f).width <= e)
        i = f;
      else if (i && (l.push(i.replace(/\s+$/, "")), i = ""), t.measureText(v).width > e) {
        let d = "";
        for (const u of v)
          t.measureText(d + u).width > e ? (d && l.push(d), d = u) : d += u;
        i = d;
      } else
        i = v.replace(/^\s+/, "");
    }
    i && l.push(i.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Yn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function Rl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function El(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: r } = t, i = t.formatTs ?? Yn;
  e.font = sn;
  const v = [];
  for (let f = 0; f < n.length; f++) {
    const d = n[f], u = d.level ?? "info", h = a && d.ts != null ? i(d.ts) : "", m = r ? Ll(e, d.text, l) : d.text.split(`
`);
    for (let S = 0; S < m.length; S++)
      v.push({
        entryIdx: f,
        text: m[S],
        level: u,
        timestamp: S === 0 ? h : "",
        isFirstFrag: S === 0,
        widthPx: e.measureText(m[S]).width
      });
  }
  return v;
}
function kn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = Ft[n.theme] ?? Ft.none;
  e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = sn, e.textBaseline = "middle";
  const i = n.visualLines, v = St - n.scrollX, f = (n.showTimestamps ? St + n.timestampWidth : St) - n.scrollX, d = Math.max(0, Math.floor((n.scrollY - tt) / ye)), u = Math.min(i.length, Math.ceil((n.scrollY + a - tt) / ye) + 1);
  for (let h = d; h < u; h++) {
    const m = i[h], S = tt + h * ye - n.scrollY + ye / 2;
    if (m.entryIdx % 2 === 1 && m.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let A = 1;
      for (; h + A < u && i[h + A].entryIdx === m.entryIdx; ) A++;
      e.fillRect(0, S - ye / 2, l, ye * A);
    }
    n.selectionStart >= 0 && h >= n.selectionStart && h <= n.selectionEnd && (e.fillStyle = r.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, S - ye / 2, l, ye)), h === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - ye / 2, l, ye)), n.showTimestamps && m.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = r.timestamp), e.fillText(m.timestamp, v, S), e.shadowBlur = 0);
    const T = kl(r, m.level);
    e.fillStyle = T, e.textAlign = "left", n.glow ? (e.shadowColor = T, e.shadowBlur = 14, e.fillText(m.text, f, S), e.shadowBlur = 7, e.fillText(m.text, f, S), e.shadowBlur = 3, e.fillText(m.text, f, S), e.shadowBlur = 0) : e.fillText(m.text, f, S);
  }
  e.restore();
}
function In(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - tt) / ye);
  return l < 0 || l >= e ? -1 : l;
}
function Dl(t) {
  return tt * 2 + t * ye;
}
const Al = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Fl = /* @__PURE__ */ nt({
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
    const e = t, l = Y(null), a = Y(null), r = { ...Ce }, i = Y(0), v = Y(0), f = Y(0), d = Y(-1), u = Y(!0), h = Y(-1), m = Y(-1), S = te(() => {
      const y = e.entries ?? [];
      return e.maxLines > 0 && y.length > e.maxLines ? y.slice(y.length - e.maxLines) : y;
    }), T = te(() => {
      if (!e.showTimestamps) return "";
      const y = e.formatTs ?? Yn;
      let F = "00:00:00";
      for (const j of S.value) {
        if (j.ts == null) continue;
        const q = y(j.ts);
        q.length > F.length && (F = q);
      }
      return F;
    }), A = Y(0), c = Y([]);
    function g() {
      if (!W) return;
      const y = W.getContext("2d");
      if (!y) return;
      y.font = sn;
      const F = e.showTimestamps ? Rl(y, T.value) : 0;
      A.value = F;
      const j = Math.max(
        1,
        i.value - St * 2 - F
      );
      c.value = El({
        entries: S.value,
        ctx: y,
        textMaxWidth: j,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const M = te(() => Dl(c.value.length)), L = te(() => Math.max(0, M.value - v.value)), O = te(() => {
      let y = 0;
      for (const F of c.value) F.widthPx > y && (y = F.widthPx);
      return St * 2 + A.value + y;
    }), x = te(() => Math.max(0, O.value - i.value)), w = Y(0);
    X(L, () => {
      u.value ? f.value = L.value : f.value = Math.min(f.value, L.value);
    }), X(x, () => {
      w.value = Math.min(w.value, x.value);
    }), X(
      [S, i, () => e.showTimestamps, () => e.wordWrap, T],
      () => {
        g(), Be(ce);
      },
      { deep: !1 }
    );
    let k = null, V = !1;
    function G() {
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
    let ne, ee, le, Z, W;
    const P = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${tn}

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

  ${nn}

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

    ${ln}

    gl_FragColor = color;
  }
`;
    function ue() {
      if (!(!a.value || !l.value)) {
        W = document.createElement("canvas");
        try {
          k = new U.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          V = !0;
        }
        if (!V && !k.getContext() && (k.dispose(), k = null, V = !0), V) {
          ae();
          return;
        }
        k.setPixelRatio(1), k.setClearColor(0, 0), ne = new U.Scene(), ee = new U.OrthographicCamera(-1, 1, 1, -1, 0, 1), Z = new U.CanvasTexture(W), Z.minFilter = U.LinearFilter, Z.magFilter = U.LinearFilter, le = new U.ShaderMaterial({
          uniforms: {
            uTex: { value: Z },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...on()
          },
          vertexShader: Al,
          fragmentShader: P,
          transparent: !0
        }), ne.add(new U.Mesh(new U.PlaneGeometry(2, 2), le)), ae();
      }
    }
    function ae() {
      if (!l.value || !k && !V) return;
      const y = l.value.clientWidth, F = l.value.clientHeight;
      if (!y || !F) return;
      const j = W.width !== y || W.height !== F;
      j && (W.width = y, W.height = F, i.value = y, v.value = F, g(), k ? (j && Z && (Z.dispose(), Z = new U.CanvasTexture(W), Z.minFilter = U.LinearFilter, Z.magFilter = U.LinearFilter, le && (le.uniforms.uTex.value = Z)), k.setPixelRatio(window.devicePixelRatio || 1), k.setSize(y, F)) : a.value && (a.value.width = y, a.value.height = F, a.value.style.width = y + "px", a.value.style.height = F + "px"), u.value && (f.value = Math.max(0, M.value - v.value)), ce());
    }
    function ce() {
      if (!(W != null && W.width)) return;
      if (V) {
        if (!a.value) return;
        kn(W, {
          visualLines: c.value,
          scrollY: f.value,
          scrollX: w.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: A.value,
          hoveredLine: d.value,
          selectionStart: Math.min(h.value, m.value),
          selectionEnd: Math.max(h.value, m.value)
        });
        const F = a.value.getContext("2d");
        F && F.drawImage(W, 0, 0);
        return;
      }
      if (!k || !le || !Z) return;
      const y = e.theme === "paper";
      le.uniforms.uStrength.value = ht(e.curvature), le.uniforms.uScanlines.value = e.scanlines && !y ? 1 : 0, le.uniforms.uVignette.value = y ? 0 : 1, an(le, e.magnify, r, W.width, W.height), kn(W, {
        visualLines: c.value,
        scrollY: f.value,
        scrollX: w.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: A.value,
        hoveredLine: d.value,
        selectionStart: Math.min(h.value, m.value),
        selectionEnd: Math.max(h.value, m.value)
      }), Z.needsUpdate = !0, k.render(ne, ee);
    }
    X(() => e.theme, () => ce()), X(() => e.curvature, () => ce()), X(() => e.scanlines, () => ce()), X(() => e.glow, () => ce()), X(() => e.magnify, (y) => {
      y || (r.x = Ce.x, r.y = Ce.y), ce();
    }), X(f, () => ce()), X(w, () => ce()), X(d, () => ce()), X([h, m], () => ce());
    function H(y) {
      if (!a.value) return [-1, -1];
      const F = a.value.getBoundingClientRect();
      return [y.clientX - F.left, y.clientY - F.top];
    }
    function b(y) {
      f.value = Math.max(0, Math.min(L.value, y)), u.value = f.value >= L.value - 4;
    }
    function R(y) {
      w.value = Math.max(0, Math.min(x.value, y));
    }
    function B(y) {
      y.shiftKey ? R(w.value + y.deltaY) : Math.abs(y.deltaX) > Math.abs(y.deltaY) ? R(w.value + y.deltaX) : b(f.value + y.deltaY);
    }
    let N = !1, $ = 0, J = 0, K = 0, we = 0, se = !1;
    function ge(y) {
      N = !0, se = !1, $ = y.clientX, J = y.clientY, K = w.value, we = f.value, l.value && l.value.focus();
    }
    function Le(y) {
      if (N) {
        const F = $ - y.clientX, j = J - y.clientY;
        (Math.abs(F) > 4 || Math.abs(j) > 4) && (se = !0), R(K + F), b(we + j);
      }
    }
    function oe() {
      N && (N = !1, se && (se = !1));
    }
    function E(y) {
      if (y.touches.length !== 1) return;
      const F = y.touches[0];
      N = !0, se = !1, $ = F.clientX, J = F.clientY, K = w.value, we = f.value, l.value && l.value.focus();
    }
    function z(y) {
      if (!N || y.touches.length !== 1) return;
      y.preventDefault();
      const F = y.touches[0], j = $ - F.clientX, q = J - F.clientY;
      (Math.abs(j) > 4 || Math.abs(q) > 4) && (se = !0), R(K + j), b(we + q);
    }
    function re() {
      N && (N = !1, se && (se = !1));
    }
    function ke(y) {
      const [, F] = H(y);
      return F < 0 ? -1 : In(F, f.value, c.value.length);
    }
    function Se(y) {
      if (se) {
        se = !1;
        return;
      }
      const F = ke(y);
      if (F < 0) {
        h.value = -1, m.value = -1;
        return;
      }
      y.shiftKey && h.value >= 0 || (h.value = F), m.value = F;
    }
    function Pe(y, F) {
      const j = c.value.length;
      if (j === 0) return;
      const q = m.value < 0 ? 0 : m.value;
      let Oe = Math.max(0, Math.min(j - 1, q + y));
      m.value = Oe, (!F || h.value < 0) && (h.value = Oe), d.value = Oe;
      const ie = tt + Oe * ye, Te = ie + ye;
      ie < f.value ? b(ie) : Te > f.value + v.value && b(Te - v.value);
    }
    function rt() {
      const y = Math.min(h.value, m.value), F = Math.max(h.value, m.value);
      if (y < 0) return "";
      const j = c.value, q = /* @__PURE__ */ new Set(), Oe = [];
      for (let ie = y; ie <= F && ie < j.length; ie++) {
        const Te = j[ie];
        if (q.has(Te.entryIdx)) continue;
        q.add(Te.entryIdx);
        let ct = "";
        for (let Ne = 0; Ne < j.length; Ne++)
          j[Ne].entryIdx === Te.entryIdx && (ct += (ct && !j[Ne].isFirstFrag ? " " : "") + j[Ne].text);
        Oe.push(Te.timestamp ? `${Te.timestamp}  ${ct}` : ct);
      }
      return Oe.join(`
`);
    }
    async function it() {
      const y = rt();
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
    function Je(y) {
      if ((y.metaKey || y.ctrlKey) && (y.key === "c" || y.key === "C")) {
        h.value >= 0 && (y.preventDefault(), it());
        return;
      }
      if ((y.metaKey || y.ctrlKey) && (y.key === "a" || y.key === "A")) {
        y.preventDefault(), h.value = 0, m.value = c.value.length - 1;
        return;
      }
      switch (y.key) {
        case "ArrowDown":
          y.preventDefault(), Pe(1, y.shiftKey);
          break;
        case "ArrowUp":
          y.preventDefault(), Pe(-1, y.shiftKey);
          break;
        case "ArrowRight":
          y.preventDefault(), R(w.value + ye * 2);
          break;
        case "ArrowLeft":
          y.preventDefault(), R(w.value - ye * 2);
          break;
        case "PageDown":
          y.preventDefault(), b(f.value + v.value);
          break;
        case "PageUp":
          y.preventDefault(), b(f.value - v.value);
          break;
        case "Home":
          y.preventDefault(), b(0), R(0);
          break;
        case "End":
          y.preventDefault(), b(L.value);
          break;
        case "Escape":
          h.value = -1, m.value = -1;
          break;
      }
    }
    function Re(y) {
      if (e.magnify && a.value) {
        const j = rn(y, a.value);
        r.x = j.x, r.y = j.y, ce();
      }
      const [, F] = H(y);
      if (F < 0) {
        d.value = -1;
        return;
      }
      d.value = In(F, f.value, c.value.length);
    }
    function Ee() {
      d.value = -1, r.x = Ce.x, r.y = Ce.y, ce();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, f.value = L.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        b(tt + y * ye);
      }
    });
    let De = null, Ae = null, Xe = 0;
    const st = Wt("cathodeResetTick", Y(0));
    X(st, () => Ie());
    function Ie() {
      cancelAnimationFrame(Xe), Xe = requestAnimationFrame(ae);
    }
    function Tt(y) {
      y.preventDefault();
    }
    function mt() {
      k == null || k.dispose(), k = null, V = !1, ue();
    }
    qe(() => {
      document.addEventListener("mousemove", Le), document.addEventListener("mouseup", oe), Be(() => {
        var y;
        ue(), a.value && (a.value.addEventListener("webglcontextlost", Tt), a.value.addEventListener("webglcontextrestored", mt)), l.value && (De = new ResizeObserver(() => ae()), De.observe(l.value), Ae = new IntersectionObserver((F) => {
          F.some((j) => j.isIntersecting) && Ie();
        }), Ae.observe(l.value)), window.addEventListener("resize", Ie), (y = window.visualViewport) == null || y.addEventListener("resize", Ie), f.value = L.value;
      });
    }), lt(() => {
      var y, F, j;
      document.removeEventListener("mousemove", Le), document.removeEventListener("mouseup", oe), (y = a.value) == null || y.removeEventListener("webglcontextlost", Tt), (F = a.value) == null || F.removeEventListener("webglcontextrestored", mt), De == null || De.disconnect(), Ae == null || Ae.disconnect(), window.removeEventListener("resize", Ie), (j = window.visualViewport) == null || j.removeEventListener("resize", Ie), cancelAnimationFrame(Xe), G();
    });
    const Ct = te(() => Ft[e.theme] ?? Ft.none), Pt = te(() => ({
      background: Ct.value.bg
    }));
    return (y, F) => (be(), xe("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ke(Pt.value),
      tabindex: "0",
      onKeydown: Je
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: et(B, ["prevent"]),
        onMousemove: Re,
        onMouseleave: Ee,
        onMousedown: ge,
        onClick: Se,
        onTouchstartPassive: E,
        onTouchmove: z,
        onTouchend: re,
        onTouchcancel: re
      }, null, 544)
    ], 36));
  }
}), _l = /* @__PURE__ */ ot(Fl, [["__scopeId", "data-v-d6dc9e79"]]), Bl = ["disabled"], Yl = /* @__PURE__ */ nt({
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
    const l = t, a = e, r = Y(null), i = Y(null), v = Y(""), f = Y([]), d = Y(-1);
    let u = "";
    function h(x) {
      x.trim() && (f.value.length && f.value[f.value.length - 1] === x || (f.value.push(x), f.value.length > l.historyLimit && f.value.splice(0, f.value.length - l.historyLimit)));
    }
    function m(x) {
      if (!l.disabled) {
        if (x.key === "Enter") {
          x.preventDefault();
          const w = v.value;
          w.trim() && h(w), d.value = -1, v.value = "", a("submit", w);
          return;
        }
        if (x.key === "ArrowUp") {
          if (!f.value.length) return;
          x.preventDefault(), d.value === -1 ? (u = v.value, d.value = f.value.length - 1) : d.value > 0 && d.value--, v.value = f.value[d.value];
          return;
        }
        if (x.key === "ArrowDown") {
          if (d.value === -1) return;
          x.preventDefault(), d.value < f.value.length - 1 ? (d.value++, v.value = f.value[d.value]) : (d.value = -1, v.value = u, u = "");
          return;
        }
      }
    }
    const S = Y(!0);
    let T = null;
    function A() {
      T || (T = setInterval(() => {
        S.value = !S.value;
      }, 530));
    }
    function c() {
      T && (clearInterval(T), T = null), S.value = !0;
    }
    const g = te(() => {
      let x;
      return l.disabled ? x = " " : l.busy ? x = "█" : x = S.value ? "█" : " ", { level: "info", text: `${l.prompt}${v.value}${x}` };
    }), M = te(
      () => [...l.entries, g.value]
    );
    function L() {
      var x;
      l.disabled || (x = i.value) == null || x.focus();
    }
    X(() => l.busy, (x, w) => {
      w && !x && !l.disabled && Be(() => {
        var k;
        return (k = i.value) == null ? void 0 : k.focus();
      });
    });
    function O() {
      var x;
      (x = i.value) == null || x.focus();
    }
    return n({ focus: O }), qe(() => {
      A(), l.disabled || requestAnimationFrame(() => {
        var x;
        return (x = i.value) == null ? void 0 : x.focus();
      });
    }), lt(() => {
      c();
    }), (x, w) => (be(), xe("div", {
      ref_key: "wrapEl",
      ref: r,
      class: "cathode-terminal-wrap",
      onClick: L
    }, [
      Dn(_l, {
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
      An(ve("input", {
        ref_key: "inputEl",
        ref: i,
        "onUpdate:modelValue": w[0] || (w[0] = (k) => v.value = k),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: m
      }, null, 40, Bl), [
        [Qn, v.value]
      ])
    ], 512));
  }
}), Bo = /* @__PURE__ */ ot(Yl, [["__scopeId", "data-v-a2b39934"]]), _t = {
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
}, Wl = 0.18, Mt = 8, cn = 22, Pl = 4, We = 8, je = 56, un = 42, $e = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", zl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Kt = 4, Hl = 1, Ol = 1;
function Nl(t, n, e, l = 0, a = !1) {
  const r = a ? un : je, i = Math.max(0, n - We - r), v = Math.max(1, Math.floor(i / e)), f = Math.min(v, t);
  return { firstIdx: Math.max(0, t - f - Math.floor(l / e)), count: f, slotW: e };
}
function Vl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, r = 0;
  const i = Math.min(t.length, n + e);
  for (let f = n; f < i; f++) {
    const d = t[f];
    d && (d.low < l && (l = d.low), d.high > a && (a = d.high), d.volume > r && (r = d.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const f = isFinite(l) ? l : 0;
    return { min: f - 1, max: f + 1, maxVol: Math.max(1, r) };
  }
  const v = (a - l) * 0.04;
  return { min: l - v, max: a + v, maxVol: Math.max(1, r) };
}
function $l(t, n, e = !1) {
  const l = e ? Pl : cn, a = Math.max(1, t - Mt - l - Kt), r = Math.max(0, Math.round(a * n)), i = a - r;
  return {
    priceY0: Mt,
    priceY1: Mt + i,
    volumeY0: Mt + i + Kt,
    volumeY1: Mt + i + Kt + r
  };
}
function Ye(t, n, e, l) {
  const a = n.max - n.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / a) * (l - e);
}
function Ze(t, n, e) {
  return We + (t - n + 0.5) * e;
}
function Ge(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function fn(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${r}`;
}
function Xl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * l;
}
function Ln(t, n) {
  var S, T, A, c, g;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, r = _t[n.theme] ?? _t.none, i = n.colors ? { ...r, ...n.colors } : r, v = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = i.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const f = Nl(n.candles.length, l, n.slotW, n.scrollX, v), d = Vl(n.candles, f.firstIdx, f.count), u = $l(a, n.showVolume ? n.volumeFraction : 0, v), h = Math.max(Hl, Math.floor(n.slotW * 0.7)), m = Math.min(n.candles.length, f.firstIdx + f.count);
  for (let M = f.firstIdx; M < m; M++) {
    const L = n.candles[M];
    if (!L) continue;
    const O = Ze(M, f.firstIdx, n.slotW), x = Ye(L.open, d, u.priceY0, u.priceY1), w = Ye(L.close, d, u.priceY0, u.priceY1), k = Ye(L.high, d, u.priceY0, u.priceY1), V = Ye(L.low, d, u.priceY0, u.priceY1), G = L.close >= L.open, ne = G ? i.wickBull : i.wickBear, ee = G ? i.candleBull : i.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = ee), e.strokeStyle = ne, e.lineWidth = Ol, e.beginPath(), e.moveTo(Math.round(O) + 0.5, k), e.lineTo(Math.round(O) + 0.5, V), e.stroke(), e.fillStyle = ee;
    const le = Math.min(x, w), Z = Math.max(1, Math.abs(w - x)), W = Math.round(O - h / 2), P = Math.round(le), ue = Math.round(Z);
    if (e.fillRect(W, P, h, ue), n.glow && (e.shadowBlur = 4, e.fillRect(W, P, h, ue)), e.shadowBlur = 0, n.showVolume && d.maxVol > 0) {
      const ae = Math.round(L.volume / d.maxVol * (u.volumeY1 - u.volumeY0));
      ae > 0 && (e.fillStyle = G ? i.volumeBull : i.volumeBear, e.fillRect(
        Math.round(O - h / 2),
        u.volumeY1 - ae,
        h,
        ae
      ));
    }
  }
  if ((S = n.overlays) != null && S.length) {
    const M = { above: 0, below: 0 }, L = n.overlays.filter((x) => x.kind !== "hline" && !!x.label).length, O = L ? 14 + 14 * L + 12 : 8;
    for (const x of n.overlays)
      x.kind === "hline" ? Kl(e, x, l, d, u, i, v, M, O) : Ul(e, x, f, d, u, n.slotW);
  }
  (T = n.markers) != null && T.length && to(e, i, n.markers, n.candles, f, d, u, n.slotW), no(e, i, d, u, l, v), v || (lo(e, i, n.candles, f, n.slotW, a), Ql(e, i, n.candles, l, a)), (A = n.overlays) != null && A.length && jl(e, i, n.overlays, u), n.hover && (oo(e, i, n.candles, f, d, u, n.slotW, n.hover, l), ql(e, i, n.candles, f, n.slotW, n.hover, u, ((c = n.overlays) == null ? void 0 : c.length) ?? 0), (g = n.markers) != null && g.length && Jl(e, i, n.markers, n.candles, f, d, u, n.slotW, n.hover, l)), e.restore();
}
function Ul(t, n, e, l, a, r) {
  var v;
  const i = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    We,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    Rt(t, n.data, e.firstIdx, i, r, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const f = Wn(n.color, n.fillAlpha ?? 0.08);
    Gl(t, n.upper, n.lower, e.firstIdx, i, r, l, a, f), Rt(t, n.upper, e.firstIdx, i, r, l, a, n.color, 1, !1), Rt(t, n.lower, e.firstIdx, i, r, l, a, n.color, 1, !1), (v = n.middle) != null && v.length && Rt(t, n.middle, e.firstIdx, i, r, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function Kl(t, n, e, l, a, r, i, v = { above: 0, below: 0 }, f = 8) {
  const d = Ye(n.price, l, a.priceY0, a.priceY1), u = d < a.priceY0 - 0.5, h = d > a.priceY1 + 0.5, m = u || h, S = m ? u ? v.above++ : v.below++ : 0, T = m ? u ? a.priceY0 + f + S * 20 : a.priceY1 - 8 - S * 20 : d, A = i ? un : je, c = Math.round(T) + 0.5;
  t.save(), m || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(We, c), t.lineTo(e - A, c), t.stroke(), t.setLineDash([]));
  let g = n.label ?? Ge(n.price);
  if (m && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    t.font = $e, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(g).width, L = 4, O = 2, x = We + 2;
    t.fillStyle = n.color, m && (t.globalAlpha = 0.85), t.fillRect(x, T - 7 - O, M + L * 2, 14 + O * 2), t.globalAlpha = 1, t.fillStyle = r.bg && !r.bg.startsWith("rgba(0,0,0,0)") ? r.bg : "#0d1520", t.fillText(g, x + L, T);
  }
  t.restore();
}
function Rt(t, n, e, l, a, r, i, v, f, d) {
  if (!n || !n.length) return;
  t.strokeStyle = v, t.lineWidth = f, t.setLineDash(d ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < l; h++) {
    const m = n[h];
    if (typeof m != "number" || !isFinite(m)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const S = Ze(h, e, a), T = Ye(m, r, i.priceY0, i.priceY1);
    u ? t.lineTo(S, T) : (t.moveTo(S, T), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function Gl(t, n, e, l, a, r, i, v, f) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = f;
  let d = !1, u = -1;
  for (let h = l; h <= a; h++) {
    const m = n[h], S = e[h], T = h < a && typeof m == "number" && typeof S == "number" && isFinite(m) && isFinite(S);
    if (T && !d && (u = h, d = !0), !T && d || h === a && d) {
      const A = T ? h + 1 : h;
      t.beginPath();
      for (let c = u; c < A; c++) {
        const g = Ze(c, l, r), M = Ye(n[c], i, v.priceY0, v.priceY1);
        c === u ? t.moveTo(g, M) : t.lineTo(g, M);
      }
      for (let c = A - 1; c >= u; c--) {
        const g = Ze(c, l, r), M = Ye(e[c], i, v.priceY0, v.priceY1);
        t.lineTo(g, M);
      }
      t.closePath(), t.fill(), d = !1;
    }
  }
}
function Wn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function jl(t, n, e, l) {
  const a = e.filter((A) => A.kind !== "hline" && !!A.label);
  if (!a.length) return;
  t.save(), t.font = $e;
  const r = 8, i = 5, v = 12, f = 6, d = 14;
  let u = 0;
  for (const A of a) {
    const c = t.measureText(A.label).width;
    c > u && (u = c);
  }
  const h = r * 2 + v + f + u, m = i * 2 + d * a.length, S = We + 4, T = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(S, T, h, m), t.textBaseline = "middle", t.textAlign = "left";
  for (let A = 0; A < a.length; A++) {
    const c = a[A], g = T + i + d * (A + 0.5), M = S + r;
    c.kind === "line" ? (t.strokeStyle = c.color, t.lineWidth = c.lineWidth ?? 1, t.setLineDash(c.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(M, g), t.lineTo(M + v, g), t.stroke(), t.setLineDash([])) : c.kind === "band" && (t.fillStyle = Wn(c.color, c.fillAlpha ?? 0.2), t.fillRect(M, g - 4, v, 8), t.strokeStyle = c.color, t.lineWidth = 1, t.strokeRect(M + 0.5, g - 4 + 0.5, v - 1, 7)), t.fillStyle = n.text, t.fillText(c.label, M + v + f, g);
  }
  t.restore();
}
function ql(t, n, e, l, a, r, i, v) {
  const f = Math.floor((r.x - We) / a), d = l.firstIdx + f;
  if (d < 0 || d >= e.length) return;
  const u = e[d];
  if (!u) return;
  const h = u.close - u.open, m = u.open !== 0 ? h / u.open * 100 : 0, S = h >= 0 ? "+" : "", T = [
    ["O", Ge(u.open), void 0],
    ["H", Ge(u.high), void 0],
    ["L", Ge(u.low), void 0],
    ["C", Ge(u.close), void 0],
    ["V", Zl(u.volume), void 0],
    ["", `${S}${m.toFixed(2)}%`, h >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = $e, t.textBaseline = "middle", t.textAlign = "left";
  const A = 8, c = 4, g = 14;
  let M = A;
  for (const [w, k] of T) {
    const V = w ? `${w} ${k}` : k, G = t.measureText(V).width + 12;
    M += G;
  }
  M += A - 12;
  const L = i.priceY0 + 4 + (v > 0 ? c * 2 + 14 * v + 4 : 0), O = We + 4;
  t.fillStyle = n.panelBg, t.fillRect(O, L, M, g + c * 2);
  let x = O + A;
  for (let w = 0; w < T.length; w++) {
    const [k, V, G] = T[w];
    t.fillStyle = n.text, k && (t.globalAlpha = 0.6, t.fillText(k + " ", x, L + c + g / 2), t.globalAlpha = 1, x += t.measureText(k + " ").width), G && (t.fillStyle = G), t.fillText(V, x, L + c + g / 2), x += t.measureText(V).width + 12;
  }
  t.restore();
}
function Zl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Jl(t, n, e, l, a, r, i, v, f, d) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, h = Math.max(1, u * 0.5), m = Math.min(l.length, a.firstIdx + a.count), S = 9;
  let T = null;
  for (const V of e) {
    let G = 0, ne = l.length - 1, ee = -1;
    for (; G <= ne; ) {
      const W = G + ne >> 1, P = l[W].start - V.timestamp;
      if (Math.abs(P) <= h) {
        ee = W;
        break;
      }
      P < 0 ? G = W + 1 : ne = W - 1;
    }
    if (ee < 0 || ee < a.firstIdx || ee >= m) continue;
    const le = Ze(ee, a.firstIdx, v), Z = Ye(V.price, r, i.priceY0, i.priceY1);
    if (Math.abs(f.x - le) <= S && Math.abs(f.y - Z) <= S) {
      T = { m: V, x: le, y: Z };
      break;
    }
  }
  if (!T) return;
  const A = fn(T.m.timestamp), c = [
    `${T.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${A}`,
    `@ ${Ge(T.m.price)}`
  ];
  T.m.label && c.push(T.m.label), t.save(), t.font = $e, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, M = 14;
  let L = 0;
  for (const V of c) {
    const G = t.measureText(V).width;
    G > L && (L = G);
  }
  const O = L + g * 2, x = c.length * M + g * 2;
  let w = T.x + 12;
  w + O > d - je && (w = T.x - 12 - O);
  let k = T.y - x / 2;
  k < i.priceY0 && (k = i.priceY0), k + x > i.priceY1 && (k = i.priceY1 - x), t.fillStyle = n.panelBgSolid, t.strokeStyle = T.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(w, k, O, x), t.strokeRect(w + 0.5, k + 0.5, O - 1, x - 1);
  for (let V = 0; V < c.length; V++) {
    const G = c[V];
    t.fillStyle = V === 0 ? T.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(G, w + g, k + g + V * M);
  }
  t.restore();
}
function Ql(t, n, e, l, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, i = eo(r);
  if (!i) return;
  t.save(), t.font = $e, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, f = 3, d = t.measureText(i).width, u = l - je - v, h = a - cn + 4;
  t.fillStyle = n.accent, t.fillRect(u - d - v, h - f, d + v * 2, 14 + f * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(i, u, h), t.restore();
}
function eo(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function to(t, n, e, l, a, r, i, v) {
  if (!l.length) return;
  const f = l.length > 1 ? l[1].start - l[0].start : 6e4, d = Math.max(1, f * 0.5), u = Math.min(l.length, a.firstIdx + a.count), h = (S) => {
    let T = 0, A = l.length - 1;
    for (; T <= A; ) {
      const c = T + A >> 1, g = l[c].start - S;
      if (Math.abs(g) <= d) return c;
      g < 0 ? T = c + 1 : A = c - 1;
    }
    return -1;
  }, m = 7;
  for (const S of e) {
    const T = h(S.timestamp);
    if (T < 0 || T < a.firstIdx || T >= u) continue;
    const A = Ze(T, a.firstIdx, v), c = Ye(S.price, r, i.priceY0, i.priceY1);
    if (c < i.priceY0 || c > i.priceY1) continue;
    const g = S.color ?? (S.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = g, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(A, c - m), t.lineTo(A - m, c + m - 1), t.lineTo(A + m, c + m - 1)) : (t.moveTo(A, c + m), t.lineTo(A - m, c - m + 1), t.lineTo(A + m, c - m + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function no(t, n, e, l, a, r = !1) {
  const i = e.max - e.min;
  if (i <= 0) return;
  const v = l.priceY1 - l.priceY0, f = r ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, d = Xl(i, f), u = Math.ceil(e.min / d) * d, h = r ? un : je;
  t.font = r ? zl : $e, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let m = u; m <= e.max; m += d) {
    const S = Ye(m, e, l.priceY0, l.priceY1);
    S < l.priceY0 || S > l.priceY1 || (t.beginPath(), t.moveTo(We, Math.round(S) + 0.5), t.lineTo(a - h, Math.round(S) + 0.5), t.stroke(), t.fillText(Ge(m), a - h + 3, S));
  }
  t.globalAlpha = 1;
}
function lo(t, n, e, l, a, r) {
  if (l.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(l.count / 6));
  t.font = $e, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const f = Math.min(e.length, l.firstIdx + l.count);
  for (let d = l.firstIdx; d < f; d += v) {
    const u = e[d];
    if (!u) continue;
    const h = Ze(d, l.firstIdx, a);
    t.fillText(fn(u.start), h, r - cn + 4);
  }
  t.globalAlpha = 1;
}
function oo(t, n, e, l, a, r, i, v, f) {
  const d = Math.floor((v.x - We) / i), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + d)), h = e[u];
  if (!h) return;
  const m = Ze(u, l.firstIdx, i);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(m) + 0.5, r.priceY0), t.lineTo(Math.round(m) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const S = Math.max(r.priceY0, Math.min(r.priceY1, v.y));
  t.beginPath(), t.moveTo(We, Math.round(S) + 0.5), t.lineTo(f - je, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const T = a.max - a.min;
  if (T > 0) {
    const g = a.max - (S - r.priceY0) / (r.priceY1 - r.priceY0) * T, M = Ge(g);
    t.font = $e, t.textBaseline = "middle", t.textAlign = "left";
    const L = t.measureText(M).width, O = 4, x = 2;
    t.fillStyle = n.accent, t.fillRect(f - je + 2, S - 7 - x, L + O * 2, 14 + x * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(M, f - je + 2 + O, S);
  }
  t.font = $e, t.textBaseline = "top", t.textAlign = "center";
  const A = fn(h.start), c = t.measureText(A).width;
  t.fillStyle = n.accent, t.fillRect(m - c / 2 - 4, r.volumeY1 + 2, c + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(A, m, r.volumeY1 + 4), t.restore();
}
const Gt = 0.25, jt = 6, ao = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ro = /* @__PURE__ */ nt({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Wl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = Y(null), l = Y(null), a = { ...Ce }, r = Y(0), i = Y(0), v = Y(0), f = Y(1), d = Y(null), u = te(() => Math.max(1, n.slotW * f.value));
    let h = null, m = !1;
    function S() {
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
    let T, A, c, g, M;
    const L = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${tn}

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

  ${nn}

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

    ${ln}

    gl_FragColor = color;
  }
`;
    function O() {
      if (!(!l.value || !e.value)) {
        if (M = document.createElement("canvas"), n.flat) {
          m = !0, x();
          return;
        }
        try {
          h = new U.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !h.getContext() && (h.dispose(), h = null, m = !0), m) {
          x();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), T = new U.Scene(), A = new U.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new U.CanvasTexture(M), g.minFilter = U.LinearFilter, g.magFilter = U.LinearFilter, c = new U.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...on()
          },
          vertexShader: ao,
          fragmentShader: L,
          transparent: !0
        }), T.add(new U.Mesh(new U.PlaneGeometry(2, 2), c)), x();
      }
    }
    function x() {
      if (!e.value || !h && !m) return;
      const E = e.value.clientWidth, z = e.value.clientHeight;
      !E || !z || !(M.width !== E || M.height !== z) || (M.width = E, M.height = z, r.value = E, i.value = z, h ? (g && (g.dispose(), g = new U.CanvasTexture(M), g.minFilter = U.LinearFilter, g.magFilter = U.LinearFilter, c && (c.uniforms.uTex.value = g)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(E, z)) : l.value && (l.value.width = E, l.value.height = z, l.value.style.width = E + "px", l.value.style.height = z + "px"), w());
    }
    function w() {
      if (!(M != null && M.width)) return;
      if (m) {
        if (!l.value) return;
        Ln(M, {
          candles: n.candles,
          slotW: u.value,
          scrollX: v.value,
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
        const z = l.value.getContext("2d");
        z && (z.clearRect(0, 0, l.value.width, l.value.height), z.drawImage(M, 0, 0));
        return;
      }
      if (!h || !c || !g) return;
      const E = n.theme === "paper";
      c.uniforms.uStrength.value = ht(n.curvature), c.uniforms.uScanlines.value = n.scanlines && !E ? 1 : 0, c.uniforms.uVignette.value = E ? 0 : 1, an(c, n.magnify, a, M.width, M.height), Ln(M, {
        candles: n.candles,
        slotW: u.value,
        scrollX: v.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: d.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), g.needsUpdate = !0, h.render(T, A);
    }
    X(() => n.theme, () => w()), X(() => n.curvature, () => w()), X(() => n.scanlines, () => w()), X(() => n.glow, () => w()), X(() => n.showVolume, () => w()), X(() => n.volumeFraction, () => w()), X(() => n.slotW, () => w()), X(() => n.candles, () => w(), { deep: !1 }), X(() => n.overlays, () => w(), { deep: !1 }), X(() => n.markers, () => w(), { deep: !1 }), X(() => n.compact, () => w()), X(() => n.magnify, (E) => {
      E || (a.x = Ce.x, a.y = Ce.y), w();
    }), X(() => n.colors, () => w(), { deep: !0 }), X(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), X(v, () => w()), X(f, () => w()), X(d, () => w()), X(u, () => w());
    let k = null, V = null, G = 0;
    const ne = Wt("cathodeResetTick", Y(0));
    X(ne, () => ee());
    function ee() {
      cancelAnimationFrame(G), G = requestAnimationFrame(x);
    }
    function le(E) {
      E.preventDefault();
    }
    function Z() {
      h == null || h.dispose(), h = null, m = !1, O();
    }
    function W(E) {
      if (!l.value) return [-1, -1];
      const z = l.value.getBoundingClientRect();
      return [E.clientX - z.left, E.clientY - z.top];
    }
    function P(E) {
      var Pe;
      const z = u.value;
      if (z <= 0) return 0;
      const re = ((Pe = n.candles) == null ? void 0 : Pe.length) ?? 0, ke = Math.max(1, Math.floor((r.value || 1) / z)), Se = Math.max(0, re - ke);
      return Math.max(0, Math.min(E, Se * z));
    }
    function ue(E) {
      var ke;
      if (E.deltaX !== 0 || E.shiftKey && E.deltaY !== 0) {
        const Se = E.deltaX !== 0 ? E.deltaX : E.deltaY;
        v.value = P(v.value + Se);
        return;
      }
      if (E.deltaY === 0) return;
      const [z] = W(E), re = u.value;
      if (z >= 0 && re > 0 && ((ke = n.candles) != null && ke.length)) {
        const Se = Math.max(1, Math.floor((r.value || 1) / re)), rt = Math.max(0, n.candles.length - Se - Math.floor(v.value / re)) + (z - 8) / re, it = Math.exp(-E.deltaY * 15e-4), Je = Math.max(Gt, Math.min(jt, f.value * it));
        f.value = Je;
        const Re = n.slotW * Je, Ee = Math.max(1, Math.floor((r.value || 1) / Re)), De = rt - (z - 8) / Re, Ae = Math.max(0, n.candles.length - Ee - De);
        v.value = P(Ae * Re);
      } else {
        const Se = Math.exp(-E.deltaY * 15e-4);
        f.value = Math.max(Gt, Math.min(jt, f.value * Se));
      }
    }
    let ae = !1, ce = 0, H = 0;
    function b(E) {
      E.button === 0 && (ae = !0, ce = E.clientX, H = v.value, d.value = null, e.value && e.value.focus());
    }
    function R(E) {
      const z = Math.exp(E * 0.18);
      f.value = Math.max(Gt, Math.min(jt, f.value * z)), v.value = P(v.value);
    }
    function B(E) {
      const z = u.value, re = E.shiftKey ? 20 : 3;
      switch (E.key) {
        case "ArrowLeft":
          E.preventDefault(), v.value = P(v.value + z * re);
          break;
        case "ArrowRight":
          E.preventDefault(), v.value = P(v.value - z * re);
          break;
        case "ArrowUp":
          E.preventDefault(), R(1);
          break;
        case "ArrowDown":
          E.preventDefault(), R(-1);
          break;
        case "Home":
          E.preventDefault(), v.value = P(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          E.preventDefault(), v.value = 0;
          break;
      }
    }
    function N(E) {
      if (ae) {
        const z = E.clientX - ce;
        v.value = P(H + z);
        return;
      }
    }
    function $() {
      ae = !1;
    }
    function J(E) {
      if (E.touches.length !== 1) return;
      const z = E.touches[0];
      ae = !0, ce = z.clientX, H = v.value, d.value = null;
    }
    function K(E) {
      if (!ae || E.touches.length !== 1) return;
      E.preventDefault();
      const re = E.touches[0].clientX - ce;
      v.value = P(H + re);
    }
    function we() {
      ae = !1;
    }
    function se(E) {
      if (n.magnify && l.value) {
        const ke = rn(E, l.value);
        a.x = ke.x, a.y = ke.y, w();
      }
      if (ae) return;
      const [z, re] = W(E);
      if (z < 0 || re < 0) {
        d.value = null;
        return;
      }
      d.value = { x: z, y: re };
    }
    function ge() {
      d.value = null, a.x = Ce.x, a.y = Ce.y, w();
    }
    qe(() => {
      document.addEventListener("mousemove", N), document.addEventListener("mouseup", $), Be(() => {
        var E;
        O(), l.value && (l.value.addEventListener("webglcontextlost", le), l.value.addEventListener("webglcontextrestored", Z)), e.value && (k = new ResizeObserver(() => x()), k.observe(e.value), V = new IntersectionObserver((z) => {
          z.some((re) => re.isIntersecting) && ee();
        }), V.observe(e.value)), window.addEventListener("resize", ee), (E = window.visualViewport) == null || E.addEventListener("resize", ee);
      });
    }), lt(() => {
      var E, z, re;
      document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", $), (E = l.value) == null || E.removeEventListener("webglcontextlost", le), (z = l.value) == null || z.removeEventListener("webglcontextrestored", Z), k == null || k.disconnect(), V == null || V.disconnect(), window.removeEventListener("resize", ee), (re = window.visualViewport) == null || re.removeEventListener("resize", ee), cancelAnimationFrame(G), S();
    });
    const Le = te(() => _t[n.theme] ?? _t.none), oe = te(() => ({
      background: Le.value.bg
    }));
    return (E, z) => (be(), xe("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ke(oe.value),
      tabindex: "0",
      onKeydown: B
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: et(ue, ["prevent"]),
        onMousedown: b,
        onMousemove: se,
        onMouseleave: ge,
        onTouchstartPassive: J,
        onTouchmove: K,
        onTouchend: we,
        onTouchcancel: we
      }, null, 544)
    ], 36));
  }
}), Yo = /* @__PURE__ */ ot(ro, [["__scopeId", "data-v-7c334778"]]), dn = Y(0), Jt = 28, vt = 12;
let Qt = 10, Bt = "cathode.layout", Yt = !1;
const Me = Y({});
function io(t, n = "cathode.layout") {
  if (!Yt) {
    Yt = !0, Bt = n;
    try {
      const e = localStorage.getItem(Bt);
      if (e) {
        Me.value = JSON.parse(e), Rn();
        return;
      }
    } catch {
    }
    Me.value = { ...t }, Rn();
  }
}
function Rn() {
  let t = 10;
  for (const n of Object.values(Me.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  Qt = t;
}
function at() {
  localStorage.setItem(Bt, JSON.stringify(Me.value));
}
function so(t) {
  Yt = !1, localStorage.removeItem(Bt), Me.value = { ...t }, at(), Yt = !0, dn.value++;
}
function Pn(t) {
  Qt++, Me.value[t] && (Me.value[t].zIndex = Qt);
}
function co(t, n) {
  Me.value[t].visible = n, at();
}
function uo(t, n) {
  Me.value[t].minimized = n, n && (Me.value[t].maximized = !1), at();
}
function fo(t, n) {
  Me.value[t].maximized = n, n && (Me.value[t].minimized = !1, Pn(t)), at();
}
function vo(t, n, e) {
  Me.value[t].x = Math.round(n), Me.value[t].y = Math.round(e), at();
}
function ho(t, n, e) {
  Me.value[t].w = Math.round(n), Me.value[t].h = Math.round(e), at();
}
function Wo(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), r = Math.floor((t - vt * (l + 1)) / l), i = Math.floor((n - vt * (a + 1)) / a), v = {};
  return e.forEach((f, d) => {
    const u = d % l, h = Math.floor(d / l);
    v[f] = {
      x: vt + u * (r + vt),
      y: vt + h * (i + vt),
      w: r,
      h: i,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: d + 1
    };
  }), v;
}
function zn() {
  return {
    containers: Me,
    TITLEBAR_H: Jt,
    load: io,
    save: at,
    reset: so,
    bringToFront: Pn,
    setVisible: co,
    setMinimized: uo,
    setMaximized: fo,
    updatePos: vo,
    updateSize: ho
  };
}
const mo = { class: "ws-toolbar" }, go = {
  key: 0,
  class: "ws-restore-menu"
}, po = {
  key: 0,
  class: "ws-restore-empty"
}, wo = ["onClick"], yo = /* @__PURE__ */ nt({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: r } = zn(), i = Y(null);
    Mn("cathodeWorkspace", i), Mn("cathodeResetTick", dn), qe(() => {
      if (!i.value) return;
      const { clientWidth: c, clientHeight: g } = i.value, M = n.initialLayout ?? {};
      l(M, n.storageKey ?? "cathode.layout");
      const L = Object.keys(e.value)[0];
      L && v(L);
    });
    function v(c) {
      var M;
      document.querySelectorAll(".cc").forEach((L) => L.classList.remove("cc-focused"));
      const g = (M = i.value) == null ? void 0 : M.querySelector(`#cc-${c}`);
      g && g.classList.add("cc-focused");
    }
    function f() {
      !i.value || !n.initialLayout || a(n.initialLayout);
    }
    function d(c) {
      const g = c.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = Y(!1), h = () => Object.entries(e.value).filter(([, c]) => !c.visible).map(([c]) => c);
    function m(c) {
      r(c, !0), u.value = !1;
    }
    function S(c) {
      if (!u.value) return;
      const g = c.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function T(c) {
      c.key === "Escape" && (u.value = !1);
    }
    qe(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", T);
    }), lt(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", T);
    });
    function A(c) {
      var g;
      return ((g = n.containerTitles) == null ? void 0 : g[c]) ?? c;
    }
    return (c, g) => (be(), xe("div", {
      ref_key: "workspaceEl",
      ref: i,
      class: "cathode-workspace",
      onMousedown: d
    }, [
      qt(c.$slots, "default", {}, void 0, !0),
      qt(c.$slots, "overlay", {}, void 0, !0),
      ve("div", mo, [
        t.initialLayout ? (be(), xe("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: f
        }, " ↺ Reset Layout ")) : Ve("", !0),
        g[1] || (g[1] = ve("div", { class: "ws-sep" }, null, -1)),
        ve("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (M) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Dn(el, { name: "menu" }, {
        default: tl(() => [
          u.value ? (be(), xe("div", go, [
            g[3] || (g[3] = ve("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? Ve("", !0) : (be(), xe("div", po, " No closed panels ")),
            (be(!0), xe(nl, null, ll(h(), (M) => (be(), xe("div", {
              key: M,
              class: "ws-restore-item",
              onClick: (L) => m(M)
            }, [
              g[2] || (g[2] = ve("span", { class: "ws-restore-icon" }, "⊞", -1)),
              ol(" " + He(A(M)), 1)
            ], 8, wo))), 128))
          ])) : Ve("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Po = /* @__PURE__ */ ot(yo, [["__scopeId", "data-v-5838d04b"]]), bo = ["id"], xo = { class: "cc-title" }, Mo = {
  key: 0,
  class: "cc-size-badge"
}, So = { class: "cc-controls" }, To = ["title"], Co = { class: "cc-body" }, ko = 200, Io = 80, En = 60, Lo = /* @__PURE__ */ nt({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: r, setMaximized: i, updatePos: v, updateSize: f } = zn(), d = Wt("cathodeWorkspace", Y(null)), u = te(() => e.value[n.id]), h = te(() => {
      const b = u.value, R = n.curvature ?? 0;
      if (!b) return {};
      const B = { "--curvature": Math.abs(R) };
      return b.maximized ? { ...B, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: b.zIndex } : {
        ...B,
        left: b.x + "px",
        top: b.y + "px",
        width: b.w + "px",
        height: b.minimized ? Jt + "px" : b.h + "px",
        zIndex: b.zIndex,
        display: b.visible ? "flex" : "none"
      };
    });
    let m = !1, S = 0, T = 0;
    function A(b) {
      var N;
      if (b.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), m = !0;
      const R = (N = d.value) == null ? void 0 : N.querySelector(`#cc-${n.id}`);
      if (!R) return;
      const B = R.getBoundingClientRect();
      S = b.clientX - B.left, T = b.clientY - B.top, document.addEventListener("mousemove", c), document.addEventListener("mouseup", g), b.preventDefault();
    }
    function c(b) {
      var J;
      if (!m || !d.value) return;
      const R = d.value.getBoundingClientRect(), B = ((J = u.value) == null ? void 0 : J.w) ?? 300;
      let N = b.clientX - R.left - S, $ = b.clientY - R.top - T;
      N = Math.max(En - B, Math.min(R.width - En, N)), $ = Math.max(0, Math.min(R.height - Jt, $)), v(n.id, N, $);
    }
    function g() {
      m = !1, document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", g);
    }
    let M = !1, L = 0, O = 0, x = 0, w = 0;
    const k = Y("");
    function V(b) {
      u.value.maximized || (l(n.id), M = !0, L = b.clientX, O = b.clientY, x = u.value.w, w = u.value.h, document.addEventListener("mousemove", G), document.addEventListener("mouseup", ne), b.preventDefault(), b.stopPropagation());
    }
    function G(b) {
      if (!M) return;
      const R = Math.max(ko, x + (b.clientX - L)), B = Math.max(Io, w + (b.clientY - O));
      f(n.id, R, B), k.value = `${Math.round(R)}×${Math.round(B)}`;
    }
    function ne() {
      M = !1, k.value = "", document.removeEventListener("mousemove", G), document.removeEventListener("mouseup", ne), ee.value++;
    }
    const ee = Y(0);
    X(dn, () => {
      ee.value++;
    }), lt(() => {
      var b;
      document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", G), document.removeEventListener("mouseup", ne), (b = le.value) == null || b.removeEventListener("scroll", W), P();
    });
    const le = Y(null);
    function Z(b) {
      if (n.canvas) return [];
      const R = b.children[0];
      return R ? Array.from(R.children) : [];
    }
    function W() {
      const b = le.value, R = n.curvature ?? 0;
      if (!b) return;
      const B = Z(b);
      if (!B.length) return;
      const N = b.clientHeight, $ = N / 2, J = R * 38e-4;
      B.forEach((K) => {
        if (!K.dataset.origFs) {
          const ke = getComputedStyle(K);
          K.dataset.origFs = ke.fontSize, K.dataset.origLh = ke.lineHeight;
        }
        if (R === 0) {
          K.style.fontSize = "", K.style.lineHeight = "";
          return;
        }
        const we = K.getBoundingClientRect(), se = b.getBoundingClientRect(), ge = we.top - se.top + we.height / 2, Le = Math.min(1, Math.abs(ge - $) / (N / 2)), oe = 1 + J * Math.cos(Le * Math.PI / 2), E = parseFloat(K.dataset.origFs), z = K.dataset.origLh, re = z === "normal" ? E * 1.4 : parseFloat(z);
        isNaN(E) || (K.style.fontSize = `${(E * oe).toFixed(2)}px`), isNaN(re) || (K.style.lineHeight = `${(re * oe).toFixed(2)}px`);
      });
    }
    function P() {
      const b = le.value;
      b && Z(b).forEach((R) => {
        R.style.fontSize = "", R.style.lineHeight = "", delete R.dataset.origFs, delete R.dataset.origLh;
      });
    }
    X(() => n.curvature, (b) => {
      (b ?? 0) === 0 ? P() : W();
    }), qe(() => {
      var b;
      (b = le.value) == null || b.addEventListener("scroll", W, { passive: !0 }), Be(W);
    });
    function ue() {
      r(n.id, !u.value.minimized), Be(() => {
        ee.value++;
      });
    }
    function ae() {
      i(n.id, !u.value.maximized), Be(() => {
        ee.value++;
      });
    }
    function ce() {
      a(n.id, !1);
    }
    function H() {
      l(n.id);
    }
    return (b, R) => u.value && u.value.visible ? (be(), xe("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: al(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ke(h.value),
      onMousedown: H
    }, [
      ve("div", {
        class: "cc-titlebar",
        onMousedown: A
      }, [
        R[0] || (R[0] = ve("span", { class: "cc-status-dot" }, null, -1)),
        ve("span", xo, He(t.title), 1),
        k.value ? (be(), xe("span", Mo, He(k.value), 1)) : Ve("", !0),
        ve("div", So, [
          ve("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: et(ue, ["stop"])
          }, "─"),
          ve("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: et(ae, ["stop"])
          }, He(u.value.maximized ? "⤡" : "⤢"), 9, To),
          ve("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: et(ce, ["stop"])
          }, "✕")
        ])
      ], 32),
      An(ve("div", Co, [
        ve("div", {
          ref_key: "bodyEl",
          ref: le,
          class: "cc-screen",
          onScroll: W
        }, [
          qt(b.$slots, "default", { resizeKey: ee.value }, void 0, !0),
          R[1] || (R[1] = ve("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [rl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (be(), xe("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: et(V, ["stop"])
      }, null, 32)) : Ve("", !0)
    ], 46, bo)) : Ve("", !0);
  }
}), zo = /* @__PURE__ */ ot(Lo, [["__scopeId", "data-v-ca0af4ca"]]), Ro = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Eo = `
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
`, Do = 100, Ao = /* @__PURE__ */ nt({
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
    let r = null, i = !1;
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
    let f, d, u, h, m, S = null, T = 0;
    function A(w) {
      w - T >= Do && (M(), T = w), S = requestAnimationFrame(A);
    }
    function c() {
      if (!l.value || !m) return;
      const w = l.value.clientWidth, k = l.value.clientHeight;
      w <= 0 || k <= 0 || m.width === w && m.height === k || (m.width = w, m.height = k, r && r.setSize(w, k, !1), a.value && (a.value.width = w, a.value.height = k, a.value.style.width = w + "px", a.value.style.height = k + "px"));
    }
    function g() {
      if (!(m != null && m.width)) return;
      const w = m.getContext("2d");
      if (!w) return;
      const k = m.width, V = m.height, G = e[n.theme] ?? e.none;
      w.clearRect(0, 0, k, V), w.fillStyle = G.bg, w.fillRect(0, 0, k, V);
      const ne = Date.now(), ee = (ne / 500 | 0) % 2 === 0, le = (ne / 400 | 0) % 4;
      w.font = `bold ${Math.max(14, Math.min(k, V) * 0.06)}px monospace`, w.textAlign = "center", w.textBaseline = "middle", w.fillStyle = G.text, n.glow && (w.shadowColor = G.text, w.shadowBlur = 14);
      const Z = ".".repeat(le).padEnd(3, " "), W = `${n.label}${Z}`;
      if (w.fillText(W, k / 2, V / 2), w.shadowBlur = 0, ee) {
        const P = w.measureText(W), ue = w.measureText("M").width, ae = parseFloat(w.font), ce = k / 2 + P.width / 2 + 4, H = V / 2 - ae / 2 + 2;
        w.fillStyle = G.cursor, n.glow && (w.shadowColor = G.cursor, w.shadowBlur = 12), w.fillRect(ce, H, ue * 0.7, ae * 0.95), w.shadowBlur = 0;
      }
    }
    function M() {
      if (!m) return;
      if (g(), i) {
        if (!a.value) return;
        const k = a.value.getContext("2d");
        k && k.drawImage(m, 0, 0);
        return;
      }
      if (!r || !u || !h) return;
      const w = n.theme === "paper";
      u.uniforms.uStrength.value = ht(n.curvature), u.uniforms.uScanlines.value = n.scanlines && !w ? 1 : 0, u.uniforms.uVignette.value = w ? 0 : 1, h.needsUpdate = !0, r.render(f, d);
    }
    function L() {
      if (!(!a.value || !l.value)) {
        m = document.createElement("canvas");
        try {
          r = new U.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          i = !0;
        }
        if (!i && !r.getContext() && (r.dispose(), r = null, i = !0), i) {
          c();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), f = new U.Scene(), d = new U.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new U.CanvasTexture(m), h.minFilter = U.LinearFilter, h.magFilter = U.LinearFilter, u = new U.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ro,
          fragmentShader: Eo,
          transparent: !0
        }), f.add(new U.Mesh(new U.PlaneGeometry(2, 2), u)), c();
      }
    }
    let O = null;
    qe(() => {
      L(), M(), S = requestAnimationFrame(A), l.value && (O = new ResizeObserver(() => c()), O.observe(l.value));
    }), lt(() => {
      S !== null && cancelAnimationFrame(S), O == null || O.disconnect(), v(), h == null || h.dispose(), u == null || u.dispose();
    }), X(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => M());
    const x = te(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (w, k) => (be(), xe("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ke(x.value)
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Ho = /* @__PURE__ */ ot(Ao, [["__scopeId", "data-v-d00e5f47"]]);
export {
  _t as CANDLE_THEME_COLORS,
  Yo as CathodeCandle,
  zo as CathodeContainer,
  _o as CathodeGrid,
  Ho as CathodeLoader,
  _l as CathodeLog,
  Bo as CathodeTerminal,
  Po as CathodeWorkspace,
  Ft as LOG_THEME_COLORS,
  Wo as buildDefaultLayout,
  zn as useCathodeLayout
};
