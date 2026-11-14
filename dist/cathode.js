import { defineComponent as je, ref as Y, reactive as en, watch as j, nextTick as De, computed as ie, inject as It, onMounted as Ne, onUnmounted as Ze, openBlock as Me, createElementBlock as Se, normalizeStyle as Ue, createElementVNode as ve, withModifiers as it, withKeys as En, createCommentVNode as Ge, toDisplayString as Oe, createVNode as Hn, withDirectives as zn, vModelText as cl, provide as Dn, renderSlot as fn, Transition as ul, withCtx as fl, Fragment as dl, renderList as vl, createTextVNode as hl, normalizeClass as ml, vShow as gl } from "vue";
import * as B from "three";
const et = {
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
}, Ce = 30, dn = 12, pl = 10, Vt = 14, $n = 5;
function Ot() {
  return `${dn}px system-ui, -apple-system, sans-serif`;
}
function Vn(n, t, e) {
  const l = String(t ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const s = [];
  let o = "";
  for (const f of a) {
    const c = o ? o + " " + f : f;
    !o || n.measureText(c).width <= e ? o = c : (s.push(o), o = f);
  }
  return o && s.push(o), s.length ? s : [""];
}
function wl(n, t) {
  return Math.max(t, n * Vt + $n * 2);
}
function gn(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let l = 0; l < t; l++) e[l + 1] = e[l] + (n[l] ?? 0);
  return e;
}
function Nt(n, t) {
  if (t <= 0) return 0;
  let e = 0, l = n.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    n[a] <= t ? e = a : l = a - 1;
  }
  return e;
}
const On = 28;
function yl(n, t) {
  if (typeof t == "function") return t(n);
  const e = n.filter((a) => a != null && a !== "");
  if (t === "count") return e.length;
  const l = e.map((a) => Number(a)).filter((a) => !Number.isNaN(a));
  if (l.length === 0) return null;
  switch (t) {
    case "sum":
      return l.reduce((a, s) => a + s, 0);
    case "avg":
      return l.reduce((a, s) => a + s, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function Fn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, s = n.height / l, o = et[t.theme] ?? et.none, { cols: f, rows: c, pinnedRows: d, rowHeight: u, scrollY: g, scrollX: p, glow: b } = t;
  e.clearRect(0, 0, a, s), e.fillStyle = o.bg, e.fillRect(0, 0, a, s), e.save(), e.beginPath(), e.rect(0, 0, a, s), e.clip();
  const L = d.length * u, C = t.aggregateRow ? On : 0, v = s - Ce - L - C;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, a, Ce), e.textBaseline = "middle", e.textAlign = "left";
  let h = -p;
  for (let i = 0; i < f.length; i++) {
    const w = f[i];
    if (h + w.width <= 0) {
      h += w.width;
      continue;
    }
    if (h >= a) break;
    const P = !!t.colFilters[w.colId], k = t.sortColId === w.colId, z = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, w.width, Ce), e.clip(), e.font = `bold ${pl}px system-ui, -apple-system, sans-serif`, e.fillStyle = P ? o.accent : o.textHeader, b ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText(z, h + 8, Ce / 2), e.shadowBlur = 4, e.fillText(z, h + 8, Ce / 2), e.shadowBlur = 0) : e.fillText(z, h + 8, Ce / 2), k) {
      const H = e.measureText(z).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent, e.fillText(t.sortDir === "asc" ? "▲" : "▼", h + 8 + H + 4, Ce / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = P ? o.accent : o.textHeader, e.globalAlpha = P ? 1 : 0.38, e.fillText("⌕", h + w.width - 20, Ce / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(h + w.width - 0.5, 0), e.lineTo(h + w.width - 0.5, Ce), e.stroke(), h += w.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Ce - 0.5), e.lineTo(a, Ce - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Ce, a, v), e.clip();
  const R = t.rowHeights && t.rowHeights.length === c.length ? t.rowHeights : null, I = R ? gn(R, c.length) : null, W = (i) => I ? I[i] : i * u, T = (i) => R ? R[i] : u, y = I ? Nt(I, g) : Math.max(0, Math.floor(g / u));
  let x;
  if (I)
    for (x = y; x < c.length && W(x) < g + v; ) x++;
  else
    x = Math.min(c.length, Math.ceil((g + v) / u));
  const A = t.selectionAnchorRow ?? t.selectedRow, O = t.selectionAnchorCol ?? t.selectedCol, K = t.selectedRow >= 0 && A >= 0 ? Math.min(t.selectedRow, A) : -1, Z = t.selectedRow >= 0 && A >= 0 ? Math.max(t.selectedRow, A) : -1, q = t.selectedCol >= 0 && O >= 0 ? Math.min(t.selectedCol, O) : -1, Q = t.selectedCol >= 0 && O >= 0 ? Math.max(t.selectedCol, O) : -1, $ = Z > K || Q > q;
  let V = Number.POSITIVE_INFINITY, ue = Number.NEGATIVE_INFINITY, te = Number.POSITIVE_INFINITY, oe = Number.NEGATIVE_INFINITY;
  const J = (i, w, P, k) => {
    b ? (e.shadowColor = k, e.shadowBlur = 12, e.fillText(i, w, P), e.shadowBlur = 6, e.fillText(i, w, P), e.shadowBlur = 2, e.fillText(i, w, P), e.shadowBlur = 0) : e.fillText(i, w, P);
  };
  for (let i = y; i < x; i++) {
    const w = c[i], P = T(i), k = Ce + W(i) - g;
    i % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, k, a, P));
    const z = i >= K && i <= Z;
    i === t.hoveredRow && !z && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, k, a, P)), z && !$ && (e.fillStyle = tn(o.accent, 0.1), e.fillRect(0, k, a, P)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, k + P - 0.5), e.lineTo(a, k + P - 0.5), e.stroke();
    let H = -p;
    for (let N = 0; N < f.length; N++) {
      const ee = f[N];
      if (H + ee.width <= 0) {
        H += ee.width;
        continue;
      }
      if (H >= a) break;
      const le = z && N >= q && N <= Q;
      le && $ && (e.fillStyle = tn(o.accent, 0.14), e.fillRect(H, k, ee.width, P)), le && (H < V && (V = H), H + ee.width > ue && (ue = H + ee.width), k < te && (te = k), k + P > oe && (oe = k + P));
      const ge = t.getCellStyle(ee, w), Te = ge.color ?? o.text, se = ge.textAlign ?? "left", F = t.formatCell(ee, w);
      if (e.save(), e.beginPath(), e.rect(H + 1, k, ee.width - 2, P), e.clip(), e.font = Ot(), e.fillStyle = Te, e.textBaseline = "middle", ee.colDef.wrap) {
        e.textAlign = "left";
        const G = Vn(e, F, Math.max(20, ee.width - 16));
        let re = k + $n + Vt / 2;
        for (const be of G) {
          if (re - Vt / 2 >= k + P) break;
          J(be, H + 8, re, Te), re += Vt;
        }
      } else {
        const G = se === "right" ? H + ee.width - 8 : H + 8;
        e.textAlign = se === "right" ? "right" : "left", J(F, G, k + P / 2, Te);
      }
      e.restore(), i === t.selectedRow && N === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(H + 1.5, k + 1.5, ee.width - 3, P - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(H + ee.width - 0.5, k), e.lineTo(H + ee.width - 0.5, k + P), e.stroke(), H += ee.width;
    }
  }
  if ($ && V < ue && te < oe && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(V + 0.5, te + 0.5, ue - V - 1, oe - te - 1)), e.restore(), d.length > 0) {
    const i = s - L - C;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(a, i - 0.5), e.stroke();
    for (let w = 0; w < d.length; w++) {
      const P = d[w], k = i + w * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, k, a, u);
      let z = -p;
      for (let H = 0; H < f.length; H++) {
        const N = f[H];
        if (z + N.width <= 0) {
          z += N.width;
          continue;
        }
        if (z >= a) break;
        const ee = t.getCellStyle(N, P), le = ee.color ?? o.text, ge = ee.textAlign ?? "left", Te = t.formatCell(N, P);
        e.save(), e.beginPath(), e.rect(z + 1, k, N.width - 2, u), e.clip(), e.font = `bold ${dn}px system-ui, -apple-system, sans-serif`, e.fillStyle = le, e.textBaseline = "middle", ge === "right" ? (e.textAlign = "right", e.fillText(Te, z + N.width - 8, k + u / 2)) : (e.textAlign = "left", e.fillText(Te, z + 8, k + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(z + N.width - 0.5, k), e.lineTo(z + N.width - 0.5, k + u), e.stroke(), z += N.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, k + u - 0.5), e.lineTo(a, k + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const i = s - C;
    e.fillStyle = tn(o.accent, 0.1), e.fillRect(0, i, a, C), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(a, i - 0.5), e.stroke();
    let w = -p;
    for (let P = 0; P < f.length; P++) {
      const k = f[P];
      if (w + k.width <= 0) {
        w += k.width;
        continue;
      }
      if (w >= a) break;
      const H = t.getCellStyle(k, t.aggregateRow).textAlign ?? "left", N = t.aggregateRow[k.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, i, k.width - 2, C), e.clip(), e.font = `bold ${dn}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", b && (e.shadowColor = o.accent, e.shadowBlur = 8), H === "right" ? (e.textAlign = "right", e.fillText(N, w + k.width - 8, i + C / 2)) : (e.textAlign = "left", e.fillText(N, w + 8, i + C / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + k.width - 0.5, i), e.lineTo(w + k.width - 0.5, i + C), e.stroke(), w += k.width;
    }
  }
  e.restore();
}
function tn(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), a = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${t})`;
}
const Ht = 190, nn = 34;
function xl(n, t, e) {
  const l = Math.max(4, Math.min(t, n - Ht - 4)), a = Ce + 6, s = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: Ht, h: nn },
    input: { x: l + 9, y: a + 5, w: Ht - 18 - s, h: nn - 10 },
    clear: e ? { x: l + Ht - 28, y: a, w: 28, h: nn } : null
  };
}
const ln = (n, t, e, l = 0) => n >= e.x - l && n <= e.x + e.w + l && t >= e.y && t <= e.y + e.h;
function zt(n, t, e, l = 1) {
  return e.clear && ln(n, t, e.clear, 4 * (l - 1)) ? "clear" : ln(n, t, e.input) ? "input" : ln(n, t, e.box) ? "inside" : "outside";
}
function bl(n, t, e, l, a) {
  const { box: s, input: o, clear: f } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = a.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(o.x, o.y, o.w, o.h, 3), n.fill(), n.beginPath(), n.rect(o.x, o.y, o.w, o.h), n.clip(), n.font = Ot(), n.textBaseline = "middle";
  const c = o.y + o.h / 2 + 1, d = 5;
  if (e) {
    n.fillStyle = a.text;
    const u = n.measureText(e).width, g = u > o.w - 2 * d - 2 ? o.x + o.w - d - 2 - u : o.x + d;
    n.fillText(e, g, c), l && (n.fillStyle = a.accent, n.fillRect(Math.min(g + u + 1, o.x + o.w - d), o.y + 4, 1.5, o.h - 8));
  } else
    n.fillStyle = a.textHeader, n.fillText("Filter…", o.x + d, c), l && (n.fillStyle = a.accent, n.fillRect(o.x + d, o.y + 4, 1.5, o.h - 8));
  n.restore(), f && (n.save(), n.font = Ot(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = a.textHeader, n.fillText("✕", f.x + f.w / 2, f.y + f.h / 2 + 1), n.restore());
}
function Ml(n, t, e) {
  const l = n - 0.5, a = t - 0.5, s = Math.abs(e), o = (l * l + a * a) * s;
  if (e < 0) {
    const d = 0.5 * s, g = 1 / (1 - 2 * (0.5 * (1 + d) * d)), p = (l + l * (1 + o) * o * -1) * g, b = (a + a * (1 + o) * o * -1) * g;
    return [0.5 + p, 0.5 + b];
  }
  const f = l * (1 + o) * o, c = a * (1 + o) * o;
  return [n + f, t + c * 0.15];
}
function Nn(n, t, e, l, a, s = e, o = l) {
  const f = n / e, c = 1 - t / l, [d, u] = Ml(f, c, a);
  return d < 0 || d > 1 || u < 0 || u > 1 ? [-1, -1] : [d * s, (1 - u) * o];
}
function an(n, t) {
  let e = 0;
  for (let l = 0; l < n; l++) e += t[l].width;
  return e;
}
function Sl(n, t, e, l = 1) {
  return n >= t + e - 24 * l && n < t + e;
}
function An(n, t, e, l = 1) {
  const a = t + e;
  return n >= a - 6 * l && n <= a + 1 * l;
}
function _n(n, t, e, l, a, s, o, f, c, d = !1, u) {
  const g = n + c;
  let p = -1, b = 0;
  for (let R = 0; R < e.length; R++) {
    if (g >= b && g < b + e[R].width) {
      p = R;
      break;
    }
    b += e[R].width;
  }
  if (t < Ce) return { area: "header", colIdx: p, rowIdx: -1 };
  const L = d ? On : 0;
  if (L > 0 && t >= o - L)
    return { area: "agg", colIdx: p, rowIdx: -1 };
  const C = f * a;
  if (C > 0 && t >= o - C - L) {
    const R = Math.floor((t - (o - C - L)) / a);
    return { area: "pinned", colIdx: p, rowIdx: R };
  }
  const v = t - Ce + s, h = u && u.length === l ? Nt(gn(u, l), v) : Math.floor(v / a);
  return h >= 0 && h < l ? { area: "body", colIdx: p, rowIdx: h } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function Ke(n) {
  return n / 45 * 0.55;
}
function Xn(n) {
  const t = Math.abs(Ke(n));
  if (t === 0) return 1;
  if (n < 0) {
    const l = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const Tl = 500, Cl = Tl / 2, Ll = 1.6, Et = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Dt = `
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
`, Ft = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function At() {
  return {
    uMouseUV: { value: new B.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Ll },
    uLensTint: { value: new B.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const me = { x: -999, y: -999 };
function _t(n, t, e, l, a) {
  const s = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = s && a > 0 ? Cl / a : 0, n.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function Bt(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const kl = ["value"], Rl = ["disabled"], Il = ["disabled"], El = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Dl = 28, Fl = 600, Al = /* @__PURE__ */ je({
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
  setup(n, { emit: t }) {
    const e = n, l = t, a = Y(e.rowData ?? []), s = Y(e.pinnedBottomRowData ?? []), o = Y(""), f = Y(null), c = en({}), d = en({}), u = en(/* @__PURE__ */ new Set()), g = Y(0), p = Y(0), b = Y(0), L = Y(0), C = Y(0), v = Y(0), h = Y(0), R = Y(-1), I = Y(null), W = Y(null), T = Y(null), y = { ...me }, x = Y(""), A = Y(0), O = Y(null);
    let K = null;
    const Z = Y(!0);
    let q = null;
    j(T, (r) => {
      var m;
      q && (clearInterval(q), q = null), r ? (Z.value = !0, q = setInterval(() => {
        Z.value = !Z.value, xe();
      }, 530), De(() => {
        var M;
        return (M = O.value) == null ? void 0 : M.focus();
      })) : (K = null, (m = O.value) == null || m.blur()), xe();
    });
    function Q(r) {
      return r.colId ?? r.field ?? (r.headerName ? r.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const $ = ie(() => {
      const r = e.defaultColDef ?? {};
      return e.columnDefs.filter((m) => !u.has(Q(m))).map((m) => {
        const M = Q(m), D = { ...r, ...m };
        return { colId: M, colDef: D, width: d[M] ?? D.width ?? 100 };
      });
    }), V = ie(() => {
      const r = p.value;
      if (!r) return $.value;
      const m = $.value.reduce((E, _) => E + _.width, 0);
      if (!m || m >= r) return $.value;
      const M = r / m;
      let D = 0;
      return $.value.map((E, _) => {
        const de = _ === $.value.length - 1 ? r - D : Math.max(8, Math.round(E.width * M));
        return D += de, { ...E, width: de };
      });
    }), ue = ie(() => {
      const r = V.value.reduce((m, M) => m + M.width, 0);
      return Math.max(0, r - p.value);
    });
    let te = null;
    function oe() {
      if (typeof document > "u") return null;
      te || (te = document.createElement("canvas"));
      const r = te.getContext("2d");
      return r && (r.font = Ot()), r;
    }
    const J = ie(() => V.value.some((r) => r.colDef.wrap)), i = ie(() => {
      if (!J.value) return null;
      const r = oe();
      if (!r) return null;
      const m = V.value.filter((D) => D.colDef.wrap), M = e.rowHeight;
      return se.value.map((D) => {
        let E = 1;
        for (const _ of m) {
          const U = Vn(r, ge(_, D), Math.max(20, _.width - 16));
          U.length > E && (E = U.length);
        }
        return wl(E, M);
      });
    }), w = ie(
      () => i.value ? gn(i.value, se.value.length) : null
    ), P = ie(
      () => w.value ? w.value[se.value.length] : se.value.length * e.rowHeight
    ), k = ie(() => {
      const r = s.value.length * e.rowHeight;
      return Math.max(0, b.value - Ce - r);
    }), z = ie(
      () => Math.max(0, P.value - k.value)
    ), H = ie(
      () => Math.max(1, Math.floor(k.value / e.rowHeight))
    ), N = ie(() => {
      const r = se.value.length;
      if (r === 0) return 0;
      const m = w.value ? Nt(w.value, v.value) : Math.floor(v.value / e.rowHeight);
      return Math.min(r - 1, m);
    }), ee = ie(() => {
      const r = se.value.length;
      return r === 0 ? 0 : w.value ? Math.min(r - 1, Nt(w.value, v.value + k.value - 1)) : Math.min(r - 1, N.value + H.value - 1);
    });
    function le(r, m) {
      if (m.colDef.valueGetter) return m.colDef.valueGetter({ data: r, colDef: m.colDef });
      if (m.colDef.field) return r[m.colDef.field];
    }
    function ge(r, m) {
      const M = le(m, r);
      return r.colDef.valueFormatter ? r.colDef.valueFormatter({ value: M, data: m, colDef: r.colDef }) ?? "" : r.colDef.cellRenderer ? (r.colDef.cellRenderer({ value: M, data: m, colDef: r.colDef }) ?? "").replace(/<[^>]+>/g, "") : M == null ? "" : String(M);
    }
    function Te(r, m) {
      return r.colDef.cellStyle ? typeof r.colDef.cellStyle == "function" ? r.colDef.cellStyle({ value: le(m, r), data: m, colDef: r.colDef }) ?? {} : r.colDef.cellStyle : {};
    }
    const se = ie(() => {
      g.value;
      let r = a.value;
      const m = o.value.trim().toLowerCase();
      m && (r = r.filter(
        (M) => $.value.some(
          (D) => String(le(M, D) ?? "").toLowerCase().includes(m)
        )
      ));
      for (const [M, D] of Object.entries(c)) {
        if (!D) continue;
        const E = $.value.find((_) => _.colId === M);
        if (E)
          if (D.startsWith("__eq__")) {
            const _ = D.slice(6).toLowerCase();
            r = r.filter((U) => String(le(U, E) ?? "").toLowerCase() === _);
          } else {
            const _ = D.toLowerCase();
            r = r.filter((U) => String(le(U, E) ?? "").toLowerCase().includes(_));
          }
      }
      if (f.value) {
        const { colId: M, dir: D } = f.value, E = $.value.find((_) => _.colId === M);
        E && (r = [...r].sort((_, U) => {
          const de = le(_, E), ce = le(U, E);
          let we = 0;
          return E.colDef.comparator ? we = E.colDef.comparator(de, ce) : typeof de == "number" && typeof ce == "number" ? we = de - ce : we = String(de ?? "").localeCompare(String(ce ?? ""), void 0, { numeric: !0 }), D === "asc" ? we : -we;
        }));
      }
      return r;
    }), F = ie(() => {
      const r = $.value.filter((E) => E.colDef.aggFunc != null);
      if (r.length === 0) return null;
      const m = se.value, M = {};
      for (const E of r) {
        const _ = m.map((de) => le(de, E)), U = yl(_, E.colDef.aggFunc);
        if (U == null) {
          M[E.colId] = "";
          continue;
        }
        M[E.colId] = E.colDef.aggValueFormatter ? E.colDef.aggValueFormatter(U) : String(U);
      }
      const D = r[0].colId;
      return M[D] === "" && (M[D] = "Σ"), M;
    });
    j(se, () => {
      v.value = 0, I.value = null;
    }), j(ue, () => {
      h.value = Math.min(h.value, ue.value);
    }), j(z, () => {
      v.value = Math.min(v.value, z.value);
    });
    function G(r) {
      const m = w.value, M = m ? m[r] : r * e.rowHeight, D = m ? m[r + 1] : M + e.rowHeight;
      M < v.value ? v.value = M : D > v.value + k.value && (v.value = Math.min(z.value, D - k.value));
    }
    function re() {
      v.value = Math.max(0, v.value - k.value), xe();
    }
    function be() {
      v.value = Math.min(z.value, v.value + k.value), xe();
    }
    let ye = !1, $e = "", ut = 0, ft = 0, at = 1, Fe = !1, Ae = !1, _e = 0, Be = 0, Qe = 0, dt = 0, Ie = !1;
    function Wt(r, m, M = 1) {
      var D;
      ye = !0, $e = r, ut = m, at = M, ft = ((D = V.value.find((E) => E.colId === r)) == null ? void 0 : D.width) ?? 100, Fe = !1;
    }
    function yt(r) {
      if (Ae) {
        const _ = _e - r.clientX, U = Be - r.clientY;
        (Math.abs(_) > 4 || Math.abs(U) > 4) && (Ie = !0), h.value = Math.max(0, Math.min(ue.value, Qe + _)), v.value = Math.max(0, Math.min(z.value, dt + U)), xe();
        return;
      }
      if (!ye) return;
      const m = p.value, M = Math.max(30, ft + (r.clientX - ut) * at), D = $.value.filter((_) => _.colId !== $e).reduce((_, U) => _ + U.width, 0), E = m - M;
      E > 10 && (d[$e] = Math.max(10, Math.round(M * D / E))), xe();
    }
    function Pt() {
      Ae && (Ie && (Fe = !0), Ae = !1), ye && (ye = !1, Fe = !0, l("column-resized"));
    }
    function qt(r) {
      if (r.touches.length !== 1) return;
      const m = r.touches[0];
      Ae = !0, Ie = !1, _e = m.clientX, Be = m.clientY, Qe = h.value, dt = v.value;
    }
    function S(r) {
      if (!Ae || r.touches.length !== 1) return;
      r.preventDefault();
      const m = r.touches[0], M = _e - m.clientX, D = Be - m.clientY;
      (Math.abs(M) > 4 || Math.abs(D) > 4) && (Ie = !0), h.value = Math.max(0, Math.min(ue.value, Qe + M)), v.value = Math.max(0, Math.min(z.value, dt + D)), xe();
    }
    function X() {
      Ae && (Ie && (Fe = !0), Ae = !1);
    }
    const ne = Y(null), ae = Y(null), Xe = It("cathodeResetTick", Y(0));
    j(Xe, () => ht());
    let pe = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), fe = null, We = !1;
    function ot() {
      if (fe) {
        try {
          fe.forceContextLoss();
        } catch {
        }
        try {
          fe.dispose();
        } catch {
        }
        fe = null;
      }
    }
    let jt, Mn, Ve, Pe, he;
    const jn = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Et}

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

  ${Dt}

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

    ${Ft}

    gl_FragColor = color;
  }
`;
    function Sn() {
      if (!(!ae.value || !ne.value)) {
        he = document.createElement("canvas");
        try {
          fe = new B.WebGLRenderer({ canvas: ae.value, antialias: !1, alpha: !0 });
        } catch {
          We = !0;
        }
        if (!We && !fe.getContext() && (fe.dispose(), fe = null, We = !0), We) {
          vt();
          return;
        }
        fe.setPixelRatio(1), fe.setClearColor(0, 0), jt = new B.Scene(), Mn = new B.OrthographicCamera(-1, 1, 1, -1, 0, 1), Pe = new B.CanvasTexture(he), Pe.minFilter = B.LinearFilter, Pe.magFilter = B.LinearFilter, Ve = new B.ShaderMaterial({
          uniforms: {
            uTex: { value: Pe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new B.Color(0) },
            ...At()
          },
          vertexShader: El,
          fragmentShader: jn,
          transparent: !0
        }), jt.add(new B.Mesh(new B.PlaneGeometry(2, 2), Ve)), vt();
      }
    }
    function vt() {
      if (!ne.value || !fe && !We) return;
      const r = ne.value.clientWidth, m = ne.value.clientHeight - (e.pagination ? Dl : 0);
      if (!r || !m) return;
      L.value = r, C.value = m;
      const M = e.bendField ? Math.round(r * Xn(e.curvature)) : r;
      pe = Math.min(window.devicePixelRatio || 1, 2);
      const D = Math.round(M * pe), E = Math.round(m * pe), _ = he.width !== D || he.height !== E;
      he.width = D, he.height = E, p.value = M, b.value = m, h.value = Math.max(0, Math.min(ue.value, h.value)), v.value = Math.max(0, Math.min(z.value, v.value)), fe ? (_ && Pe && (Pe.dispose(), Pe = new B.CanvasTexture(he), Pe.minFilter = B.LinearFilter, Pe.magFilter = B.LinearFilter, Ve && (Ve.uniforms.uTex.value = Pe)), fe.setPixelRatio(pe), fe.setSize(r, m)) : ae.value && (ae.value.width = Math.round(r * pe), ae.value.height = Math.round(m * pe), ae.value.style.width = r + "px", ae.value.style.height = m + "px"), xe();
    }
    function xe() {
      var M, D, E, _, U, de, ce, we, Ye, St, Tt, mt;
      if (!(he != null && he.width)) return;
      if (We) {
        if (!ae.value) return;
        Fn(he, {
          cols: V.value,
          rows: se.value,
          pinnedRows: s.value,
          rowHeight: e.rowHeight,
          rowHeights: i.value ?? void 0,
          scrollY: v.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((M = f.value) == null ? void 0 : M.colId) ?? null,
          sortDir: ((D = f.value) == null ? void 0 : D.dir) ?? null,
          colFilters: c,
          hoveredRow: R.value,
          selectedRow: ((E = I.value) == null ? void 0 : E.row) ?? -1,
          selectedCol: ((_ = I.value) == null ? void 0 : _.col) ?? -1,
          selectionAnchorRow: ((U = W.value) == null ? void 0 : U.row) ?? -1,
          selectionAnchorCol: ((de = W.value) == null ? void 0 : de.col) ?? -1,
          formatCell: ge,
          getCellStyle: Te,
          dpr: pe
        }), Tn();
        const Ct = ae.value.getContext("2d");
        Ct && Ct.drawImage(he, 0, 0, he.width, he.height, 0, 0, ae.value.width, ae.value.height);
        return;
      }
      if (!fe || !Ve || !Pe) return;
      const r = et[e.theme] ?? et.none, m = e.theme === "paper";
      Ve.uniforms.uStrength.value = Ke(e.curvature), Ve.uniforms.uScanlines.value = e.scanlines && !m ? 1 : 0, Ve.uniforms.uVignette.value = m ? 0 : 1, Ve.uniforms.uBezel.value.set(r.bg), _t(Ve, e.magnify, y, L.value || he.width, C.value || he.height), Fn(he, {
        cols: V.value,
        rows: se.value,
        pinnedRows: s.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: i.value ?? void 0,
        scrollY: v.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((ce = f.value) == null ? void 0 : ce.colId) ?? null,
        sortDir: ((we = f.value) == null ? void 0 : we.dir) ?? null,
        colFilters: c,
        hoveredRow: R.value,
        selectedRow: ((Ye = I.value) == null ? void 0 : Ye.row) ?? -1,
        selectedCol: ((St = I.value) == null ? void 0 : St.col) ?? -1,
        selectionAnchorRow: ((Tt = W.value) == null ? void 0 : Tt.row) ?? -1,
        selectionAnchorCol: ((mt = W.value) == null ? void 0 : mt.col) ?? -1,
        formatCell: ge,
        getCellStyle: Te,
        aggregateRow: F.value,
        dpr: pe
      }), Tn(), Pe.needsUpdate = !0, fe.render(jt, Mn);
    }
    function Tn() {
      if (!T.value || !(he != null && he.width)) return;
      const r = he.getContext("2d");
      if (!r) return;
      r.setTransform(pe, 0, 0, pe, 0, 0), K = xl(he.width / pe, A.value, !!x.value);
      const m = et[e.theme] ?? et.none;
      bl(r, K, x.value, Z.value, m);
    }
    function Zt(r, m) {
      if (!ae.value) return [-1, -1];
      const M = ae.value.getBoundingClientRect(), D = r - M.left, E = m - M.top, _ = M.width, U = M.height, de = Ke(e.curvature), [ce, we] = Nn(D, E, _, U, de, he.width / pe || _, he.height / pe || U);
      return ce < 0 ? [-1, -1] : [ce, we];
    }
    function Yt(r) {
      return Zt(r.clientX, r.clientY);
    }
    function rt(r) {
      if (!ae.value) return 1;
      const [m] = Zt(r.clientX - 4, r.clientY), [M] = Zt(r.clientX + 4, r.clientY);
      return m < 0 || M < 0 ? 1 : Math.max(1, Math.abs(M - m) / 8);
    }
    let Jt = 0;
    function Zn(r) {
      T.value = null;
      const m = Date.now();
      if (r.deltaX !== 0) {
        Jt = m, h.value = Math.max(0, Math.min(ue.value, h.value + r.deltaX)), xe();
        return;
      }
      if (r.shiftKey && r.deltaY !== 0) {
        Jt = m, h.value = Math.max(0, Math.min(ue.value, h.value + r.deltaY)), xe();
        return;
      }
      m - Jt < Fl || (v.value = Math.max(0, Math.min(z.value, v.value + r.deltaY)), xe());
    }
    function Jn(r) {
      if (ye) return;
      if (e.magnify && ae.value) {
        const E = Bt(r, ae.value);
        y.x = E.x, y.y = E.y;
      }
      const [m, M] = Yt(r);
      if (m < 0) {
        R.value = -1, xe();
        return;
      }
      if (T.value && K) {
        const E = zt(m, M, K, rt(r));
        if (E !== "outside") {
          R.value = -1, ae.value.style.cursor = E === "clear" ? "pointer" : "text", xe();
          return;
        }
      }
      const D = _n(
        m,
        M,
        V.value,
        se.value.length,
        e.rowHeight,
        v.value,
        b.value,
        s.value.length,
        h.value,
        F.value !== null,
        i.value ?? void 0
      );
      if (R.value = D.area === "body" ? D.rowIdx : -1, D.area === "header" && D.colIdx >= 0) {
        const E = V.value[D.colIdx], _ = an(D.colIdx, V.value), U = m + h.value;
        ae.value.style.cursor = E && An(U, _, E.width, rt(r)) ? "col-resize" : "pointer";
      } else D.area === "body" ? ae.value.style.cursor = "pointer" : ae.value.style.cursor = "default";
      xe();
    }
    function Qn() {
      R.value = -1, y.x = me.x, y.y = me.y, xe();
    }
    function el(r) {
      const [m, M] = Yt(r);
      if (m < 0 || T.value && K && zt(m, M, K, rt(r)) !== "outside") return;
      if (M >= Ce) {
        Ae = !0, Ie = !1, _e = r.clientX, Be = r.clientY, Qe = h.value, dt = v.value;
        return;
      }
      const D = m + h.value, E = rt(r);
      for (let _ = 0; _ < V.value.length; _++) {
        const U = V.value[_], de = an(_, V.value);
        if (U.colDef.resizable !== !1 && An(D, de, U.width, E)) {
          Wt(U.colId, r.clientX, E);
          return;
        }
      }
    }
    function tl(r) {
      var E, _, U, de;
      if (Fe) {
        Fe = !1;
        return;
      }
      if (ye) return;
      const [m, M] = Yt(r);
      if (m < 0) {
        T.value = null;
        return;
      }
      if (T.value && K) {
        const ce = zt(m, M, K, rt(r));
        if (ce === "clear") {
          Ln();
          return;
        }
        if (ce !== "outside") {
          (E = O.value) == null || E.focus();
          return;
        }
        T.value = null;
      }
      const D = _n(
        m,
        M,
        V.value,
        se.value.length,
        e.rowHeight,
        v.value,
        b.value,
        s.value.length,
        h.value,
        F.value !== null,
        i.value ?? void 0
      );
      if (D.area === "header" && D.colIdx >= 0) {
        const ce = V.value[D.colIdx], we = an(D.colIdx, V.value), Ye = m + h.value;
        ce.colDef.filter && Sl(Ye, we, ce.width, rt(r)) ? (r.stopPropagation(), T.value === ce.colId ? T.value = null : (T.value = ce.colId, x.value = (_ = c[ce.colId]) != null && _.startsWith("__eq__") ? c[ce.colId].slice(6) : c[ce.colId] ?? "", A.value = Math.max(0, we - h.value))) : ce.colDef.sortable !== !1 && (T.value = null, f.value = ((U = f.value) == null ? void 0 : U.colId) === ce.colId ? f.value.dir === "asc" ? { colId: ce.colId, dir: "desc" } : null : { colId: ce.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (T.value = null, D.area === "body" && D.rowIdx >= 0 && D.colIdx >= 0) {
        const ce = D.rowIdx;
        r.shiftKey && I.value ? (W.value || (W.value = { ...I.value }), I.value = { row: ce, col: D.colIdx }) : (I.value = { row: ce, col: D.colIdx }, W.value = { row: ce, col: D.colIdx }), (de = ae.value) == null || de.focus();
        const we = se.value[ce], Ye = V.value[D.colIdx];
        we && Ye && (l("row-clicked", { data: we, event: r }), l("cell-selected", { data: we, row: ce, col: D.colIdx, colId: Ye.colId }));
      }
    }
    function Cn(r) {
      if (T.value) {
        if (r.target === ae.value && K) {
          const [m, M] = Yt(r);
          if (m >= 0 && zt(m, M, K, rt(r)) !== "outside") return;
        }
        T.value = null;
      }
    }
    function nl(r) {
      var E;
      if (!p.value) return;
      let m = 0;
      for (let _ = 0; _ < r; _++) m += V.value[_].width;
      const M = ((E = V.value[r]) == null ? void 0 : E.width) ?? 0, D = m - h.value;
      D < 0 ? h.value = Math.max(0, m) : D + M > p.value && (h.value = Math.min(ue.value, m + M - p.value));
    }
    function ll(r) {
      const M = V.value.length - 1, D = se.value.length - 1;
      if (!I.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(r.key) && (r.preventDefault(), I.value = { row: N.value, col: 0 }, W.value = { row: N.value, col: 0 });
        return;
      }
      let { row: E, col: _ } = I.value;
      const U = (de, ce, we = !1) => {
        E = Math.max(0, Math.min(D, de)), _ = Math.max(0, Math.min(M, ce)), I.value = { row: E, col: _ }, we || (W.value = { row: E, col: _ }), G(E), nl(_);
      };
      switch (r.key) {
        case "ArrowDown":
          r.preventDefault(), U(E + 1, _, r.shiftKey);
          break;
        case "ArrowUp":
          r.preventDefault(), U(E - 1, _, r.shiftKey);
          break;
        case "ArrowRight":
          r.preventDefault(), r.shiftKey ? U(E, _ + 1, !0) : _ < M ? U(E, _ + 1) : U(E + 1, 0);
          break;
        case "ArrowLeft":
          r.preventDefault(), r.shiftKey ? U(E, _ - 1, !0) : _ > 0 ? U(E, _ - 1) : U(E - 1, M);
          break;
        case "Tab":
          r.preventDefault(), r.shiftKey ? _ > 0 ? U(E, _ - 1) : U(E - 1, M) : _ < M ? U(E, _ + 1) : U(E + 1, 0);
          break;
        case "Enter":
          r.preventDefault(), r.shiftKey ? U(E - 1, _) : U(E + 1, _);
          break;
        case "Home":
          r.preventDefault(), r.ctrlKey || r.metaKey ? U(0, 0, r.shiftKey) : U(E, 0, r.shiftKey);
          break;
        case "End":
          r.preventDefault(), r.ctrlKey || r.metaKey ? U(D, M, r.shiftKey) : U(E, M, r.shiftKey);
          break;
        case "PageDown":
          r.preventDefault(), U(Math.min(D, E + H.value), _, r.shiftKey);
          break;
        case "PageUp":
          r.preventDefault(), U(Math.max(0, E - H.value), _, r.shiftKey);
          break;
        case "Escape":
          I.value = null, W.value = null;
          break;
        case "c":
        case "C":
          (r.ctrlKey || r.metaKey) && (r.preventDefault(), al());
          break;
      }
    }
    function al() {
      var we;
      if (!I.value) return;
      const r = V.value, m = se.value, M = W.value ?? I.value, D = Math.min(M.row, I.value.row), E = Math.max(M.row, I.value.row), _ = Math.min(M.col, I.value.col), U = Math.max(M.col, I.value.col), de = [];
      for (let Ye = D; Ye <= E; Ye++) {
        const St = m[Ye];
        if (!St) continue;
        const Tt = [];
        for (let mt = _; mt <= U; mt++) {
          const Ct = r[mt];
          Ct && Tt.push(ge(Ct, St).replace(/[\t\r\n]+/g, " "));
        }
        de.push(Tt.join("	"));
      }
      const ce = de.join(`
`);
      (we = navigator.clipboard) == null || we.writeText(ce).catch(() => {
      });
    }
    function ol(r) {
      const m = r.target.value;
      x.value = m, m ? c[T.value] = m : delete c[T.value], l("filter-changed");
    }
    function Ln() {
      T.value && delete c[T.value], x.value = "", T.value = null, l("filter-changed");
    }
    const rl = {
      setGridOption(r, m) {
        r === "rowData" ? a.value = m : r === "pinnedBottomRowData" ? s.value = m : r === "quickFilterText" && (o.value = m);
      },
      getColumnState() {
        return e.columnDefs.map((r) => {
          var M, D;
          const m = Q(r);
          return {
            colId: m,
            hide: u.has(m),
            sort: ((M = f.value) == null ? void 0 : M.colId) === m ? f.value.dir : null,
            sortIndex: ((D = f.value) == null ? void 0 : D.colId) === m ? 0 : null,
            width: d[m] ?? r.width
          };
        });
      },
      applyColumnState({ state: r }) {
        for (const m of r)
          m.hide === !0 && u.add(m.colId), m.hide === !1 && u.delete(m.colId), m.sort && (f.value = { colId: m.colId, dir: m.sort }), m.width && (d[m.colId] = m.width);
      },
      setFilterModel(r) {
        for (const m of Object.keys(c)) delete c[m];
        if (r)
          for (const [m, M] of Object.entries(r))
            (M == null ? void 0 : M.type) === "equals" ? c[m] = `__eq__${M.filter}` : M != null && M.filter && (c[m] = M.filter);
      },
      getFilterModel() {
        const r = {};
        for (const [m, M] of Object.entries(c))
          M && (r[m] = M.startsWith("__eq__") ? { type: "equals", filter: M.slice(6) } : { type: "contains", filter: M });
        return r;
      },
      async setColumnFilterModel(r, m) {
        m ? m.type === "equals" ? c[r] = `__eq__${m.filter}` : c[r] = m.filter ?? "" : delete c[r];
      },
      onFilterChanged() {
      },
      refreshCells() {
        g.value++;
      },
      exportDataAsCsv({ fileName: r = "export.csv" } = {}) {
        const m = $.value, M = m.map((U) => U.colDef.headerName ?? U.colId).join(","), D = se.value.map(
          (U) => m.map((de) => `"${String(ge(de, U)).replace(/"/g, '""')}"`).join(",")
        ), E = new Blob([[M, ...D].join(`
`)], { type: "text/csv" }), _ = URL.createObjectURL(E);
        Object.assign(document.createElement("a"), { href: _, download: r }).click(), URL.revokeObjectURL(_);
      },
      resize() {
        vt();
      },
      resetColumnState() {
        u.clear();
        for (const m of e.columnDefs)
          m.hide && u.add(Q(m));
        const r = e.columnDefs.find((m) => m.sort);
        f.value = r ? { colId: Q(r), dir: r.sort } : null;
        for (const m of Object.keys(d)) delete d[m];
        for (const m of Object.keys(c)) delete c[m];
        o.value = "", v.value = 0, I.value = null, T.value = null;
      }
    };
    j(
      [se, () => s.value, V, v, R, I],
      () => De(xe)
    ), j(() => e.theme, () => xe()), j(() => [e.curvature, e.bendField], () => De(vt)), j(() => e.scanlines, () => xe()), j(() => e.glow, () => xe()), j(() => e.magnify, (r) => {
      r || (y.x = me.x, y.y = me.y), xe();
    }), j(I, (r) => {
      if (!r) return;
      const m = se.value[r.row], M = V.value[r.col];
      m && M && l("cell-selected", { data: m, row: r.row, col: r.col, colId: M.colId });
    });
    let xt = null, bt = null, Qt = 0;
    function ht() {
      cancelAnimationFrame(Qt), Qt = requestAnimationFrame(vt);
    }
    function kn(r) {
      r.preventDefault();
    }
    function Rn() {
      fe == null || fe.dispose(), fe = null, We = !1, Sn();
    }
    Ne(() => {
      for (const r of e.columnDefs)
        r.hide && u.add(Q(r)), r.sort && !f.value && (f.value = { colId: Q(r), dir: r.sort });
      a.value = e.rowData ?? [], s.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Cn), document.addEventListener("mousemove", yt), document.addEventListener("mouseup", Pt), De(() => {
        var r;
        Sn(), ae.value && (ae.value.addEventListener("webglcontextlost", kn), ae.value.addEventListener("webglcontextrestored", Rn)), ne.value && (xt = new ResizeObserver(() => vt()), xt.observe(ne.value), bt = new IntersectionObserver((m) => {
          m.some((M) => M.isIntersecting) && ht();
        }), bt.observe(ne.value)), window.addEventListener("resize", ht), (r = window.visualViewport) == null || r.addEventListener("resize", ht), l("grid-ready", { api: rl });
      });
    }), Ze(() => {
      var r, m, M;
      document.removeEventListener("click", Cn, !0), document.removeEventListener("mousemove", yt), document.removeEventListener("mouseup", Pt), (r = ae.value) == null || r.removeEventListener("webglcontextlost", kn), (m = ae.value) == null || m.removeEventListener("webglcontextrestored", Rn), xt == null || xt.disconnect(), bt == null || bt.disconnect(), window.removeEventListener("resize", ht), (M = window.visualViewport) == null || M.removeEventListener("resize", ht), cancelAnimationFrame(Qt), ot();
    });
    const Mt = ie(() => et[e.theme] ?? et.none), il = ie(() => ({
      background: Mt.value.headerBg,
      borderTop: `1px solid ${Mt.value.border}`,
      color: Mt.value.text
    })), sl = ie(() => ({
      background: Mt.value.bg
    })), In = ie(() => Mt.value.accent);
    return (r, m) => {
      var M, D;
      return Me(), Se("div", {
        ref_key: "wrapEl",
        ref: ne,
        class: "cathode-wrap",
        style: Ue(sl.value)
      }, [
        ve("canvas", {
          ref_key: "canvasEl",
          ref: ae,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: it(Zn, ["prevent"]),
          onMousemove: Jn,
          onMouseleave: Qn,
          onMousedown: el,
          onClick: tl,
          onKeydown: ll,
          onTouchstartPassive: qt,
          onTouchmove: S,
          onTouchend: X,
          onTouchcancel: X
        }, null, 544),
        T.value ? (Me(), Se("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: O,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: x.value,
          autofocus: "",
          onInput: ol,
          onKeydown: [
            En(Ln, ["escape"]),
            m[0] || (m[0] = En((E) => T.value = null, ["enter"]))
          ]
        }, null, 40, kl)) : Ge("", !0),
        n.pagination ? (Me(), Se("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ue(il.value)
        }, [
          ve("button", {
            disabled: v.value <= 0,
            onClick: m[1] || (m[1] = (E) => re())
          }, "◀", 8, Rl),
          ve("span", null, Oe((N.value + 1).toLocaleString()) + "–" + Oe(Math.min(se.value.length, ee.value + 1).toLocaleString()) + " / " + Oe(se.value.length.toLocaleString()), 1),
          ve("button", {
            disabled: v.value >= z.value,
            onClick: m[2] || (m[2] = (E) => be())
          }, "▶", 8, Il),
          ve("span", {
            class: "cathode-page-info",
            style: Ue({ color: In.value })
          }, Oe(se.value.length.toLocaleString()) + " rows ", 5),
          I.value ? (Me(), Se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ue({ color: In.value })
          }, Oe(((M = V.value[I.value.col]) == null ? void 0 : M.colDef.headerName) ?? ((D = V.value[I.value.col]) == null ? void 0 : D.colId)) + " : " + Oe(ge(V.value[I.value.col], se.value[I.value.row])), 5)) : Ge("", !0)
        ], 4)) : Ge("", !0)
      ], 4);
    };
  }
}), Je = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [l, a] of t)
    e[l] = a;
  return e;
}, Ua = /* @__PURE__ */ Je(Al, [["__scopeId", "data-v-ff5f851c"]]), Xt = {
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
function _l(n, t) {
  switch (t) {
    case "warn":
      return n.levelWarn;
    case "error":
      return n.levelError;
    case "debug":
      return n.levelDebug;
    case "success":
      return n.levelSuccess;
    case "info":
    default:
      return n.levelInfo;
  }
}
const Bl = 12, ke = 18, Rt = 10, st = 6, pn = `${Bl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Wl(n, t, e) {
  if (e <= 0 || !t) return [t];
  const l = [];
  for (const a of t.split(`
`)) {
    if (!a) {
      l.push("");
      continue;
    }
    if (n.measureText(a).width <= e) {
      l.push(a);
      continue;
    }
    const s = a.split(/(\s+)/);
    let o = "";
    for (const f of s) {
      const c = o + f;
      if (n.measureText(c).width <= e)
        o = c;
      else if (o && (l.push(o.replace(/\s+$/, "")), o = ""), n.measureText(f).width > e) {
        let d = "";
        for (const u of f)
          n.measureText(d + u).width > e ? (d && l.push(d), d = u) : d += u;
        o = d;
      } else
        o = f.replace(/^\s+/, "");
    }
    o && l.push(o.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Un(n) {
  if (typeof n == "number") {
    const t = new Date(n), e = String(t.getHours()).padStart(2, "0"), l = String(t.getMinutes()).padStart(2, "0"), a = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return n;
}
function Pl(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function Yl(n) {
  const { entries: t, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: s } = n, o = n.formatTs ?? Un;
  e.font = pn;
  const f = [];
  for (let c = 0; c < t.length; c++) {
    const d = t[c], u = d.level ?? "info", g = a && d.ts != null ? o(d.ts) : "", p = s ? Wl(e, d.text, l) : d.text.split(`
`);
    for (let b = 0; b < p.length; b++)
      f.push({
        entryIdx: c,
        text: p[b],
        level: u,
        timestamp: b === 0 ? g : "",
        isFirstFrag: b === 0,
        widthPx: e.measureText(p[b]).width
      });
  }
  return f;
}
function Bn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = n.width, a = n.height, s = Xt[t.theme] ?? Xt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = s.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = pn, e.textBaseline = "middle";
  const o = t.visualLines, f = Rt - t.scrollX, c = (t.showTimestamps ? Rt + t.timestampWidth : Rt) - t.scrollX, d = Math.max(0, Math.floor((t.scrollY - st) / ke)), u = Math.min(o.length, Math.ceil((t.scrollY + a - st) / ke) + 1);
  for (let g = d; g < u; g++) {
    const p = o[g], b = st + g * ke - t.scrollY + ke / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = s.rowAlt;
      let C = 1;
      for (; g + C < u && o[g + C].entryIdx === p.entryIdx; ) C++;
      e.fillRect(0, b - ke / 2, l, ke * C);
    }
    t.selectionStart >= 0 && g >= t.selectionStart && g <= t.selectionEnd && (e.fillStyle = s.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, b - ke / 2, l, ke)), g === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, b - ke / 2, l, ke)), t.showTimestamps && p.timestamp && (e.fillStyle = s.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = s.timestamp), e.fillText(p.timestamp, f, b), e.shadowBlur = 0);
    const L = _l(s, p.level);
    e.fillStyle = L, e.textAlign = "left", t.glow ? (e.shadowColor = L, e.shadowBlur = 14, e.fillText(p.text, c, b), e.shadowBlur = 7, e.fillText(p.text, c, b), e.shadowBlur = 3, e.fillText(p.text, c, b), e.shadowBlur = 0) : e.fillText(p.text, c, b);
  }
  e.restore();
}
function Wn(n, t, e) {
  if (n < 0) return -1;
  const l = Math.floor((n + t - st) / ke);
  return l < 0 || l >= e ? -1 : l;
}
function Hl(n) {
  return st * 2 + n * ke;
}
const zl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, $l = /* @__PURE__ */ je({
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
  setup(n, { expose: t }) {
    const e = n, l = Y(null), a = Y(null), s = { ...me }, o = Y(0), f = Y(0), c = Y(0), d = Y(-1), u = Y(!0), g = Y(-1), p = Y(-1), b = ie(() => {
      const S = e.entries ?? [];
      return e.maxLines > 0 && S.length > e.maxLines ? S.slice(S.length - e.maxLines) : S;
    }), L = ie(() => {
      if (!e.showTimestamps) return "";
      const S = e.formatTs ?? Un;
      let X = "00:00:00";
      for (const ne of b.value) {
        if (ne.ts == null) continue;
        const ae = S(ne.ts);
        ae.length > X.length && (X = ae);
      }
      return X;
    }), C = Y(0), v = Y([]);
    function h() {
      if (!$) return;
      const S = $.getContext("2d");
      if (!S) return;
      S.font = pn;
      const X = e.showTimestamps ? Pl(S, L.value) : 0;
      C.value = X;
      const ne = Math.max(
        1,
        o.value - Rt * 2 - X
      );
      v.value = Yl({
        entries: b.value,
        ctx: S,
        textMaxWidth: ne,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const R = ie(() => Hl(v.value.length)), I = ie(() => Math.max(0, R.value - f.value)), W = ie(() => {
      let S = 0;
      for (const X of v.value) X.widthPx > S && (S = X.widthPx);
      return Rt * 2 + C.value + S;
    }), T = ie(() => Math.max(0, W.value - o.value)), y = Y(0);
    j(I, () => {
      u.value ? c.value = I.value : c.value = Math.min(c.value, I.value);
    }), j(T, () => {
      y.value = Math.min(y.value, T.value);
    }), j(
      [b, o, () => e.showTimestamps, () => e.wordWrap, L],
      () => {
        h(), De(oe);
      },
      { deep: !1 }
    );
    let x = null, A = !1;
    function O() {
      if (x) {
        try {
          x.forceContextLoss();
        } catch {
        }
        try {
          x.dispose();
        } catch {
        }
        x = null;
      }
    }
    let K, Z, q, Q, $;
    const V = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Et}

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

  ${Dt}

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

    ${Ft}

    gl_FragColor = color;
  }
`;
    function ue() {
      if (!(!a.value || !l.value)) {
        $ = document.createElement("canvas");
        try {
          x = new B.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          A = !0;
        }
        if (!A && !x.getContext() && (x.dispose(), x = null, A = !0), A) {
          te();
          return;
        }
        x.setPixelRatio(1), x.setClearColor(0, 0), K = new B.Scene(), Z = new B.OrthographicCamera(-1, 1, 1, -1, 0, 1), Q = new B.CanvasTexture($), Q.minFilter = B.LinearFilter, Q.magFilter = B.LinearFilter, q = new B.ShaderMaterial({
          uniforms: {
            uTex: { value: Q },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...At()
          },
          vertexShader: zl,
          fragmentShader: V,
          transparent: !0
        }), K.add(new B.Mesh(new B.PlaneGeometry(2, 2), q)), te();
      }
    }
    function te() {
      if (!l.value || !x && !A) return;
      const S = l.value.clientWidth, X = l.value.clientHeight;
      if (!S || !X) return;
      const ne = $.width !== S || $.height !== X;
      ne && ($.width = S, $.height = X, o.value = S, f.value = X, h(), x ? (ne && Q && (Q.dispose(), Q = new B.CanvasTexture($), Q.minFilter = B.LinearFilter, Q.magFilter = B.LinearFilter, q && (q.uniforms.uTex.value = Q)), x.setPixelRatio(window.devicePixelRatio || 1), x.setSize(S, X)) : a.value && (a.value.width = S, a.value.height = X, a.value.style.width = S + "px", a.value.style.height = X + "px"), u.value && (c.value = Math.max(0, R.value - f.value)), oe());
    }
    function oe() {
      if (!($ != null && $.width)) return;
      if (A) {
        if (!a.value) return;
        Bn($, {
          visualLines: v.value,
          scrollY: c.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: C.value,
          hoveredLine: d.value,
          selectionStart: Math.min(g.value, p.value),
          selectionEnd: Math.max(g.value, p.value)
        });
        const X = a.value.getContext("2d");
        X && X.drawImage($, 0, 0);
        return;
      }
      if (!x || !q || !Q) return;
      const S = e.theme === "paper";
      q.uniforms.uStrength.value = Ke(e.curvature), q.uniforms.uScanlines.value = e.scanlines && !S ? 1 : 0, q.uniforms.uVignette.value = S ? 0 : 1, _t(q, e.magnify, s, $.width, $.height), Bn($, {
        visualLines: v.value,
        scrollY: c.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: C.value,
        hoveredLine: d.value,
        selectionStart: Math.min(g.value, p.value),
        selectionEnd: Math.max(g.value, p.value)
      }), Q.needsUpdate = !0, x.render(K, Z);
    }
    j(() => e.theme, () => oe()), j(() => e.curvature, () => oe()), j(() => e.scanlines, () => oe()), j(() => e.glow, () => oe()), j(() => e.magnify, (S) => {
      S || (s.x = me.x, s.y = me.y), oe();
    }), j(c, () => oe()), j(y, () => oe()), j(d, () => oe()), j([g, p], () => oe());
    function J(S) {
      if (!a.value) return [-1, -1];
      const X = a.value.getBoundingClientRect();
      return [S.clientX - X.left, S.clientY - X.top];
    }
    function i(S) {
      c.value = Math.max(0, Math.min(I.value, S)), u.value = c.value >= I.value - 4;
    }
    function w(S) {
      y.value = Math.max(0, Math.min(T.value, S));
    }
    function P(S) {
      S.shiftKey ? w(y.value + S.deltaY) : Math.abs(S.deltaX) > Math.abs(S.deltaY) ? w(y.value + S.deltaX) : i(c.value + S.deltaY);
    }
    let k = !1, z = 0, H = 0, N = 0, ee = 0, le = !1;
    function ge(S) {
      k = !0, le = !1, z = S.clientX, H = S.clientY, N = y.value, ee = c.value, l.value && l.value.focus();
    }
    function Te(S) {
      if (k) {
        const X = z - S.clientX, ne = H - S.clientY;
        (Math.abs(X) > 4 || Math.abs(ne) > 4) && (le = !0), w(N + X), i(ee + ne);
      }
    }
    function se() {
      k && (k = !1, le && (le = !1));
    }
    function F(S) {
      if (S.touches.length !== 1) return;
      const X = S.touches[0];
      k = !0, le = !1, z = X.clientX, H = X.clientY, N = y.value, ee = c.value, l.value && l.value.focus();
    }
    function G(S) {
      if (!k || S.touches.length !== 1) return;
      S.preventDefault();
      const X = S.touches[0], ne = z - X.clientX, ae = H - X.clientY;
      (Math.abs(ne) > 4 || Math.abs(ae) > 4) && (le = !0), w(N + ne), i(ee + ae);
    }
    function re() {
      k && (k = !1, le && (le = !1));
    }
    function be(S) {
      const [, X] = J(S);
      return X < 0 ? -1 : Wn(X, c.value, v.value.length);
    }
    function ye(S) {
      if (le) {
        le = !1;
        return;
      }
      const X = be(S);
      if (X < 0) {
        g.value = -1, p.value = -1;
        return;
      }
      S.shiftKey && g.value >= 0 || (g.value = X), p.value = X;
    }
    function $e(S, X) {
      const ne = v.value.length;
      if (ne === 0) return;
      const ae = p.value < 0 ? 0 : p.value;
      let Xe = Math.max(0, Math.min(ne - 1, ae + S));
      p.value = Xe, (!X || g.value < 0) && (g.value = Xe), d.value = Xe;
      const pe = st + Xe * ke, fe = pe + ke;
      pe < c.value ? i(pe) : fe > c.value + f.value && i(fe - f.value);
    }
    function ut() {
      const S = Math.min(g.value, p.value), X = Math.max(g.value, p.value);
      if (S < 0) return "";
      const ne = v.value, ae = /* @__PURE__ */ new Set(), Xe = [];
      for (let pe = S; pe <= X && pe < ne.length; pe++) {
        const fe = ne[pe];
        if (ae.has(fe.entryIdx)) continue;
        ae.add(fe.entryIdx);
        let We = "";
        for (let ot = 0; ot < ne.length; ot++)
          ne[ot].entryIdx === fe.entryIdx && (We += (We && !ne[ot].isFirstFrag ? " " : "") + ne[ot].text);
        Xe.push(fe.timestamp ? `${fe.timestamp}  ${We}` : We);
      }
      return Xe.join(`
`);
    }
    async function ft() {
      const S = ut();
      if (S)
        try {
          await navigator.clipboard.writeText(S);
        } catch {
          const X = document.createElement("textarea");
          X.value = S, X.style.position = "fixed", X.style.opacity = "0", document.body.appendChild(X), X.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(X);
        }
    }
    function at(S) {
      if ((S.metaKey || S.ctrlKey) && (S.key === "c" || S.key === "C")) {
        g.value >= 0 && (S.preventDefault(), ft());
        return;
      }
      if ((S.metaKey || S.ctrlKey) && (S.key === "a" || S.key === "A")) {
        S.preventDefault(), g.value = 0, p.value = v.value.length - 1;
        return;
      }
      switch (S.key) {
        case "ArrowDown":
          S.preventDefault(), $e(1, S.shiftKey);
          break;
        case "ArrowUp":
          S.preventDefault(), $e(-1, S.shiftKey);
          break;
        case "ArrowRight":
          S.preventDefault(), w(y.value + ke * 2);
          break;
        case "ArrowLeft":
          S.preventDefault(), w(y.value - ke * 2);
          break;
        case "PageDown":
          S.preventDefault(), i(c.value + f.value);
          break;
        case "PageUp":
          S.preventDefault(), i(c.value - f.value);
          break;
        case "Home":
          S.preventDefault(), i(0), w(0);
          break;
        case "End":
          S.preventDefault(), i(I.value);
          break;
        case "Escape":
          g.value = -1, p.value = -1;
          break;
      }
    }
    function Fe(S) {
      if (e.magnify && a.value) {
        const ne = Bt(S, a.value);
        s.x = ne.x, s.y = ne.y, oe();
      }
      const [, X] = J(S);
      if (X < 0) {
        d.value = -1;
        return;
      }
      d.value = Wn(X, c.value, v.value.length);
    }
    function Ae() {
      d.value = -1, s.x = me.x, s.y = me.y, oe();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = I.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(S) {
        i(st + S * ke);
      }
    });
    let _e = null, Be = null, Qe = 0;
    const dt = It("cathodeResetTick", Y(0));
    j(dt, () => Ie());
    function Ie() {
      cancelAnimationFrame(Qe), Qe = requestAnimationFrame(te);
    }
    function Wt(S) {
      S.preventDefault();
    }
    function yt() {
      x == null || x.dispose(), x = null, A = !1, ue();
    }
    Ne(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", se), De(() => {
        var S;
        ue(), a.value && (a.value.addEventListener("webglcontextlost", Wt), a.value.addEventListener("webglcontextrestored", yt)), l.value && (_e = new ResizeObserver(() => te()), _e.observe(l.value), Be = new IntersectionObserver((X) => {
          X.some((ne) => ne.isIntersecting) && Ie();
        }), Be.observe(l.value)), window.addEventListener("resize", Ie), (S = window.visualViewport) == null || S.addEventListener("resize", Ie), c.value = I.value;
      });
    }), Ze(() => {
      var S, X, ne;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", se), (S = a.value) == null || S.removeEventListener("webglcontextlost", Wt), (X = a.value) == null || X.removeEventListener("webglcontextrestored", yt), _e == null || _e.disconnect(), Be == null || Be.disconnect(), window.removeEventListener("resize", Ie), (ne = window.visualViewport) == null || ne.removeEventListener("resize", Ie), cancelAnimationFrame(Qe), O();
    });
    const Pt = ie(() => Xt[e.theme] ?? Xt.none), qt = ie(() => ({
      background: Pt.value.bg
    }));
    return (S, X) => (Me(), Se("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ue(qt.value),
      tabindex: "0",
      onKeydown: at
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: it(P, ["prevent"]),
        onMousemove: Fe,
        onMouseleave: Ae,
        onMousedown: ge,
        onClick: ye,
        onTouchstartPassive: F,
        onTouchmove: G,
        onTouchend: re,
        onTouchcancel: re
      }, null, 544)
    ], 36));
  }
}), Vl = /* @__PURE__ */ Je($l, [["__scopeId", "data-v-d6dc9e79"]]), Ol = ["disabled"], Nl = /* @__PURE__ */ je({
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
  setup(n, { expose: t, emit: e }) {
    const l = n, a = e, s = Y(null), o = Y(null), f = Y(""), c = Y([]), d = Y(-1);
    let u = "";
    function g(T) {
      T.trim() && (c.value.length && c.value[c.value.length - 1] === T || (c.value.push(T), c.value.length > l.historyLimit && c.value.splice(0, c.value.length - l.historyLimit)));
    }
    function p(T) {
      if (!l.disabled) {
        if (T.key === "Enter") {
          T.preventDefault();
          const y = f.value;
          y.trim() && g(y), d.value = -1, f.value = "", a("submit", y);
          return;
        }
        if (T.key === "ArrowUp") {
          if (!c.value.length) return;
          T.preventDefault(), d.value === -1 ? (u = f.value, d.value = c.value.length - 1) : d.value > 0 && d.value--, f.value = c.value[d.value];
          return;
        }
        if (T.key === "ArrowDown") {
          if (d.value === -1) return;
          T.preventDefault(), d.value < c.value.length - 1 ? (d.value++, f.value = c.value[d.value]) : (d.value = -1, f.value = u, u = "");
          return;
        }
      }
    }
    const b = Y(!0);
    let L = null;
    function C() {
      L || (L = setInterval(() => {
        b.value = !b.value;
      }, 530));
    }
    function v() {
      L && (clearInterval(L), L = null), b.value = !0;
    }
    const h = ie(() => {
      let T;
      return l.disabled ? T = " " : l.busy ? T = "█" : T = b.value ? "█" : " ", { level: "info", text: `${l.prompt}${f.value}${T}` };
    }), R = ie(
      () => [...l.entries, h.value]
    );
    function I() {
      var T;
      l.disabled || (T = o.value) == null || T.focus();
    }
    j(() => l.busy, (T, y) => {
      y && !T && !l.disabled && De(() => {
        var x;
        return (x = o.value) == null ? void 0 : x.focus();
      });
    });
    function W() {
      var T;
      (T = o.value) == null || T.focus();
    }
    return t({ focus: W }), Ne(() => {
      C(), l.disabled || requestAnimationFrame(() => {
        var T;
        return (T = o.value) == null ? void 0 : T.focus();
      });
    }), Ze(() => {
      v();
    }), (T, y) => (Me(), Se("div", {
      ref_key: "wrapEl",
      ref: s,
      class: "cathode-terminal-wrap",
      onClick: I
    }, [
      Hn(Vl, {
        entries: R.value,
        theme: n.theme,
        curvature: n.curvature,
        scanlines: n.scanlines,
        glow: n.glow,
        magnify: n.magnify,
        "show-timestamps": n.showTimestamps,
        "format-ts": n.formatTs,
        "word-wrap": n.wordWrap,
        autoscroll: n.autoscroll,
        "max-lines": n.maxLines
      }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "magnify", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"]),
      zn(ve("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": y[0] || (y[0] = (x) => f.value = x),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: p
      }, null, 40, Ol), [
        [cl, f.value]
      ])
    ], 512));
  }
}), Ga = /* @__PURE__ */ Je(Nl, [["__scopeId", "data-v-a2b39934"]]), wt = {
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
}, Xl = 0.18, Lt = 8, wn = 22, Ul = 4, ze = 8, nt = 56, yn = 42, qe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Gl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", on = 4, Kl = 1, ql = 1;
function jl(n, t, e, l = 0, a = !1) {
  const s = a ? yn : nt, o = Math.max(0, t - ze - s), f = Math.max(1, Math.floor(o / e)), c = Math.min(f, n);
  return { firstIdx: Math.max(0, n - c - Math.floor(l / e)), count: c, slotW: e };
}
function Zl(n, t, e) {
  if (!n.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, s = 0;
  const o = Math.min(n.length, t + e);
  for (let c = t; c < o; c++) {
    const d = n[c];
    d && (d.low < l && (l = d.low), d.high > a && (a = d.high), d.volume > s && (s = d.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const c = isFinite(l) ? l : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, s) };
  }
  const f = (a - l) * 0.04;
  return { min: l - f, max: a + f, maxVol: Math.max(1, s) };
}
function Jl(n, t, e = !1) {
  const l = e ? Ul : wn, a = Math.max(1, n - Lt - l - on), s = Math.max(0, Math.round(a * t)), o = a - s;
  return {
    priceY0: Lt,
    priceY1: Lt + o,
    volumeY0: Lt + o + on,
    volumeY1: Lt + o + on + s
  };
}
function He(n, t, e, l) {
  const a = t.max - t.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (n - t.min) / a) * (l - e);
}
function lt(n, t, e) {
  return ze + (n - t + 0.5) * e;
}
function tt(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function xn(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0"), a = String(t.getHours()).padStart(2, "0"), s = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${s}`;
}
function Ql(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let s;
  return a < 1.5 ? s = 1 : a < 3 ? s = 2 : a < 7 ? s = 5 : s = 10, s * l;
}
function vn(n, t) {
  var L, C, v, h, R;
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, s = n.height / l, o = wt[t.theme] ?? wt.none, f = t.colors ? { ...o, ...t.colors } : o, c = !!t.compact;
  if (e.clearRect(0, 0, a, s), e.fillStyle = f.bg, e.fillRect(0, 0, a, s), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, a, s), e.clip();
  const d = jl(t.candles.length, a, t.slotW, t.scrollX, c), u = Zl(t.candles, d.firstIdx, d.count), g = Jl(s, t.showVolume ? t.volumeFraction : 0, c), p = Math.max(Kl, Math.floor(t.slotW * 0.7)), b = Math.min(t.candles.length, d.firstIdx + d.count);
  for (let I = d.firstIdx; I < b; I++) {
    const W = t.candles[I];
    if (!W) continue;
    const T = lt(I, d.firstIdx, t.slotW), y = He(W.open, u, g.priceY0, g.priceY1), x = He(W.close, u, g.priceY0, g.priceY1), A = He(W.high, u, g.priceY0, g.priceY1), O = He(W.low, u, g.priceY0, g.priceY1), K = W.close >= W.open, Z = K ? f.wickBull : f.wickBear, q = K ? f.candleBull : f.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = Z, e.lineWidth = ql, e.beginPath(), e.moveTo(Math.round(T) + 0.5, A), e.lineTo(Math.round(T) + 0.5, O), e.stroke(), e.fillStyle = q;
    const Q = Math.min(y, x), $ = Math.max(1, Math.abs(x - y)), V = Math.round(T - p / 2), ue = Math.round(Q), te = Math.round($);
    if (e.fillRect(V, ue, p, te), t.glow && (e.shadowBlur = 4, e.fillRect(V, ue, p, te)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const oe = Math.round(W.volume / u.maxVol * (g.volumeY1 - g.volumeY0));
      oe > 0 && (e.fillStyle = K ? f.volumeBull : f.volumeBear, e.fillRect(
        Math.round(T - p / 2),
        g.volumeY1 - oe,
        p,
        oe
      ));
    }
  }
  if ((L = t.overlays) != null && L.length) {
    const I = { above: 0, below: 0 }, W = t.overlays.filter((y) => y.kind !== "hline" && !!y.label).length, T = W ? 14 + 14 * W + 12 : 8;
    for (const y of t.overlays)
      y.kind === "hline" ? ta(e, y, a, u, g, f, c, I, T) : ea(e, y, d, u, g, t.slotW);
  }
  (C = t.markers) != null && C.length && ca(e, f, t.markers, t.candles, d, u, g, t.slotW), ua(e, f, u, g, a, c), c || (fa(e, f, t.candles, d, t.slotW, s), ia(e, f, t.candles, a, s)), (v = t.overlays) != null && v.length && la(e, f, t.overlays, g), t.hover && (da(e, f, t.candles, d, u, g, t.slotW, t.hover, a), aa(e, f, t.candles, d, t.slotW, t.hover, g, ((h = t.overlays) == null ? void 0 : h.length) ?? 0), (R = t.markers) != null && R.length && ra(e, f, t.markers, t.candles, d, u, g, t.slotW, t.hover, a)), e.restore();
}
function ea(n, t, e, l, a, s) {
  var f;
  const o = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    ze,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), n.clip(), t.kind === "line")
    $t(n, t.data, e.firstIdx, o, s, l, a, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const c = Gn(t.color, t.fillAlpha ?? 0.08);
    na(n, t.upper, t.lower, e.firstIdx, o, s, l, a, c), $t(n, t.upper, e.firstIdx, o, s, l, a, t.color, 1, !1), $t(n, t.lower, e.firstIdx, o, s, l, a, t.color, 1, !1), (f = t.middle) != null && f.length && $t(n, t.middle, e.firstIdx, o, s, l, a, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function ta(n, t, e, l, a, s, o, f = { above: 0, below: 0 }, c = 8) {
  const d = He(t.price, l, a.priceY0, a.priceY1), u = d < a.priceY0 - 0.5, g = d > a.priceY1 + 0.5, p = u || g, b = p ? u ? f.above++ : f.below++ : 0, L = p ? u ? a.priceY0 + c + b * 20 : a.priceY1 - 8 - b * 20 : d, C = o ? yn : nt, v = Math.round(L) + 0.5;
  n.save(), p || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo(ze, v), n.lineTo(e - C, v), n.stroke(), n.setLineDash([]));
  let h = t.label ?? tt(t.price);
  if (p && h !== "" && (h = (u ? "↑ " : "↓ ") + h), h !== "") {
    n.font = qe, n.textBaseline = "middle", n.textAlign = "left";
    const R = n.measureText(h).width, I = 4, W = 2, T = ze + 2;
    n.fillStyle = t.color, p && (n.globalAlpha = 0.85), n.fillRect(T, L - 7 - W, R + I * 2, 14 + W * 2), n.globalAlpha = 1, n.fillStyle = s.bg && !s.bg.startsWith("rgba(0,0,0,0)") ? s.bg : "#0d1520", n.fillText(h, T + I, L);
  }
  n.restore();
}
function $t(n, t, e, l, a, s, o, f, c, d) {
  if (!t || !t.length) return;
  n.strokeStyle = f, n.lineWidth = c, n.setLineDash(d ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let g = e; g < l; g++) {
    const p = t[g];
    if (typeof p != "number" || !isFinite(p)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const b = lt(g, e, a), L = He(p, s, o.priceY0, o.priceY1);
    u ? n.lineTo(b, L) : (n.moveTo(b, L), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function na(n, t, e, l, a, s, o, f, c) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = c;
  let d = !1, u = -1;
  for (let g = l; g <= a; g++) {
    const p = t[g], b = e[g], L = g < a && typeof p == "number" && typeof b == "number" && isFinite(p) && isFinite(b);
    if (L && !d && (u = g, d = !0), !L && d || g === a && d) {
      const C = L ? g + 1 : g;
      n.beginPath();
      for (let v = u; v < C; v++) {
        const h = lt(v, l, s), R = He(t[v], o, f.priceY0, f.priceY1);
        v === u ? n.moveTo(h, R) : n.lineTo(h, R);
      }
      for (let v = C - 1; v >= u; v--) {
        const h = lt(v, l, s), R = He(e[v], o, f.priceY0, f.priceY1);
        n.lineTo(h, R);
      }
      n.closePath(), n.fill(), d = !1;
    }
  }
}
function Gn(n, t) {
  const e = Math.max(0, Math.min(1, t));
  if (n.startsWith("#") && n.length === 7) {
    const l = parseInt(n.slice(1, 3), 16), a = parseInt(n.slice(3, 5), 16), s = parseInt(n.slice(5, 7), 16);
    return `rgba(${l},${a},${s},${e})`;
  }
  return n.startsWith("rgba") ? n.replace(/[\d.]+\)$/, `${e})`) : n.startsWith("rgb(") ? n.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : n;
}
function la(n, t, e, l) {
  const a = e.filter((C) => C.kind !== "hline" && !!C.label);
  if (!a.length) return;
  n.save(), n.font = qe;
  const s = 8, o = 5, f = 12, c = 6, d = 14;
  let u = 0;
  for (const C of a) {
    const v = n.measureText(C.label).width;
    v > u && (u = v);
  }
  const g = s * 2 + f + c + u, p = o * 2 + d * a.length, b = ze + 4, L = l.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(b, L, g, p), n.textBaseline = "middle", n.textAlign = "left";
  for (let C = 0; C < a.length; C++) {
    const v = a[C], h = L + o + d * (C + 0.5), R = b + s;
    v.kind === "line" ? (n.strokeStyle = v.color, n.lineWidth = v.lineWidth ?? 1, n.setLineDash(v.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(R, h), n.lineTo(R + f, h), n.stroke(), n.setLineDash([])) : v.kind === "band" && (n.fillStyle = Gn(v.color, v.fillAlpha ?? 0.2), n.fillRect(R, h - 4, f, 8), n.strokeStyle = v.color, n.lineWidth = 1, n.strokeRect(R + 0.5, h - 4 + 0.5, f - 1, 7)), n.fillStyle = t.text, n.fillText(v.label, R + f + c, h);
  }
  n.restore();
}
function aa(n, t, e, l, a, s, o, f) {
  const c = Math.floor((s.x - ze) / a), d = l.firstIdx + c;
  if (d < 0 || d >= e.length) return;
  const u = e[d];
  if (!u) return;
  const g = u.close - u.open, p = u.open !== 0 ? g / u.open * 100 : 0, b = g >= 0 ? "+" : "", L = [
    ["O", tt(u.open), void 0],
    ["H", tt(u.high), void 0],
    ["L", tt(u.low), void 0],
    ["C", tt(u.close), void 0],
    ["V", oa(u.volume), void 0],
    ["", `${b}${p.toFixed(2)}%`, g >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = qe, n.textBaseline = "middle", n.textAlign = "left";
  const C = 8, v = 4, h = 14;
  let R = C;
  for (const [y, x] of L) {
    const A = y ? `${y} ${x}` : x, O = n.measureText(A).width + 12;
    R += O;
  }
  R += C - 12;
  const I = o.priceY0 + 4 + (f > 0 ? v * 2 + 14 * f + 4 : 0), W = ze + 4;
  n.fillStyle = t.panelBg, n.fillRect(W, I, R, h + v * 2);
  let T = W + C;
  for (let y = 0; y < L.length; y++) {
    const [x, A, O] = L[y];
    n.fillStyle = t.text, x && (n.globalAlpha = 0.6, n.fillText(x + " ", T, I + v + h / 2), n.globalAlpha = 1, T += n.measureText(x + " ").width), O && (n.fillStyle = O), n.fillText(A, T, I + v + h / 2), T += n.measureText(A).width + 12;
  }
  n.restore();
}
function oa(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function ra(n, t, e, l, a, s, o, f, c, d) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, g = Math.max(1, u * 0.5), p = Math.min(l.length, a.firstIdx + a.count), b = 9;
  let L = null;
  for (const A of e) {
    let O = 0, K = l.length - 1, Z = -1;
    for (; O <= K; ) {
      const $ = O + K >> 1, V = l[$].start - A.timestamp;
      if (Math.abs(V) <= g) {
        Z = $;
        break;
      }
      V < 0 ? O = $ + 1 : K = $ - 1;
    }
    if (Z < 0 || Z < a.firstIdx || Z >= p) continue;
    const q = lt(Z, a.firstIdx, f), Q = He(A.price, s, o.priceY0, o.priceY1);
    if (Math.abs(c.x - q) <= b && Math.abs(c.y - Q) <= b) {
      L = { m: A, x: q, y: Q };
      break;
    }
  }
  if (!L) return;
  const C = xn(L.m.timestamp), v = [
    `${L.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${C}`,
    `@ ${tt(L.m.price)}`
  ];
  L.m.label && v.push(L.m.label), n.save(), n.font = qe, n.textBaseline = "top", n.textAlign = "left";
  const h = 6, R = 14;
  let I = 0;
  for (const A of v) {
    const O = n.measureText(A).width;
    O > I && (I = O);
  }
  const W = I + h * 2, T = v.length * R + h * 2;
  let y = L.x + 12;
  y + W > d - nt && (y = L.x - 12 - W);
  let x = L.y - T / 2;
  x < o.priceY0 && (x = o.priceY0), x + T > o.priceY1 && (x = o.priceY1 - T), n.fillStyle = t.panelBgSolid, n.strokeStyle = L.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(y, x, W, T), n.strokeRect(y + 0.5, x + 0.5, W - 1, T - 1);
  for (let A = 0; A < v.length; A++) {
    const O = v[A];
    n.fillStyle = A === 0 ? L.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(O, y + h, x + h + A * R);
  }
  n.restore();
}
function ia(n, t, e, l, a) {
  if (e.length < 2) return;
  const s = e[1].start - e[0].start, o = sa(s);
  if (!o) return;
  n.save(), n.font = qe, n.textBaseline = "top", n.textAlign = "right";
  const f = 6, c = 3, d = n.measureText(o).width, u = l - nt - f, g = a - wn + 4;
  n.fillStyle = t.accent, n.fillRect(u - d - f, g - c, d + f * 2, 14 + c * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(o, u, g), n.restore();
}
function sa(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, l = 60 * e, a = 24 * l, s = 7 * a;
  return n >= s && n % s === 0 ? n / s + "W" : n >= a && n % a === 0 ? n / a + "D" : n >= l && n % l === 0 ? n / l + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function ca(n, t, e, l, a, s, o, f) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, d = Math.max(1, c * 0.5), u = Math.min(l.length, a.firstIdx + a.count), g = (b) => {
    let L = 0, C = l.length - 1;
    for (; L <= C; ) {
      const v = L + C >> 1, h = l[v].start - b;
      if (Math.abs(h) <= d) return v;
      h < 0 ? L = v + 1 : C = v - 1;
    }
    return -1;
  }, p = 7;
  for (const b of e) {
    const L = g(b.timestamp);
    if (L < 0 || L < a.firstIdx || L >= u) continue;
    const C = lt(L, a.firstIdx, f), v = He(b.price, s, o.priceY0, o.priceY1);
    if (v < o.priceY0 || v > o.priceY1) continue;
    const h = b.color ?? (b.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = h, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), b.kind === "entry" ? (n.moveTo(C, v - p), n.lineTo(C - p, v + p - 1), n.lineTo(C + p, v + p - 1)) : (n.moveTo(C, v + p), n.lineTo(C - p, v - p + 1), n.lineTo(C + p, v - p + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function ua(n, t, e, l, a, s = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const f = l.priceY1 - l.priceY0, c = s ? Math.max(2, Math.min(4, Math.round(f / 36))) : 6, d = Ql(o, c), u = Math.ceil(e.min / d) * d, g = s ? yn : nt;
  n.font = s ? Gl : qe, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let p = u; p <= e.max; p += d) {
    const b = He(p, e, l.priceY0, l.priceY1);
    b < l.priceY0 || b > l.priceY1 || (n.beginPath(), n.moveTo(ze, Math.round(b) + 0.5), n.lineTo(a - g, Math.round(b) + 0.5), n.stroke(), n.fillText(tt(p), a - g + 3, b));
  }
  n.globalAlpha = 1;
}
function fa(n, t, e, l, a, s) {
  if (l.count <= 0 || !e.length) return;
  const f = Math.max(1, Math.floor(l.count / 6));
  n.font = qe, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const c = Math.min(e.length, l.firstIdx + l.count);
  for (let d = l.firstIdx; d < c; d += f) {
    const u = e[d];
    if (!u) continue;
    const g = lt(d, l.firstIdx, a);
    n.fillText(xn(u.start), g, s - wn + 4);
  }
  n.globalAlpha = 1;
}
function da(n, t, e, l, a, s, o, f, c) {
  const d = Math.floor((f.x - ze) / o), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + d)), g = e[u];
  if (!g) return;
  const p = lt(u, l.firstIdx, o);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(p) + 0.5, s.priceY0), n.lineTo(Math.round(p) + 0.5, s.volumeY1 || s.priceY1), n.stroke();
  const b = Math.max(s.priceY0, Math.min(s.priceY1, f.y));
  n.beginPath(), n.moveTo(ze, Math.round(b) + 0.5), n.lineTo(c - nt, Math.round(b) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const L = a.max - a.min;
  if (L > 0) {
    const h = a.max - (b - s.priceY0) / (s.priceY1 - s.priceY0) * L, R = tt(h);
    n.font = qe, n.textBaseline = "middle", n.textAlign = "left";
    const I = n.measureText(R).width, W = 4, T = 2;
    n.fillStyle = t.accent, n.fillRect(c - nt + 2, b - 7 - T, I + W * 2, 14 + T * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(R, c - nt + 2 + W, b);
  }
  n.font = qe, n.textBaseline = "top", n.textAlign = "center";
  const C = xn(g.start), v = n.measureText(C).width;
  n.fillStyle = t.accent, n.fillRect(p - v / 2 - 4, s.volumeY1 + 2, v + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(C, p, s.volumeY1 + 4), n.restore();
}
const rn = 0.25, sn = 6, va = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ha = /* @__PURE__ */ je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Xl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(n) {
    const t = n, e = Y(null), l = Y(null), a = { ...me }, s = Y(0), o = Y(0), f = Y(0), c = Y(1), d = Y(null), u = ie(() => Math.max(1, t.slotW * c.value));
    let g = null, p = !1;
    function b() {
      if (g) {
        try {
          g.forceContextLoss();
        } catch {
        }
        try {
          g.dispose();
        } catch {
        }
        g = null;
      }
    }
    let L, C, v, h, R;
    const I = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Et}

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

  ${Dt}

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

    ${Ft}

    gl_FragColor = color;
  }
`;
    function W() {
      if (!(!l.value || !e.value)) {
        if (R = document.createElement("canvas"), t.flat) {
          p = !0, T();
          return;
        }
        try {
          g = new B.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          p = !0;
        }
        if (!p && !g.getContext() && (g.dispose(), g = null, p = !0), p) {
          T();
          return;
        }
        g.setPixelRatio(1), g.setClearColor(0, 0), L = new B.Scene(), C = new B.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new B.CanvasTexture(R), h.minFilter = B.LinearFilter, h.magFilter = B.LinearFilter, v = new B.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...At()
          },
          vertexShader: va,
          fragmentShader: I,
          transparent: !0
        }), L.add(new B.Mesh(new B.PlaneGeometry(2, 2), v)), T();
      }
    }
    function T() {
      if (!e.value || !g && !p) return;
      const F = e.value.clientWidth, G = e.value.clientHeight;
      !F || !G || !(R.width !== F || R.height !== G) || (R.width = F, R.height = G, s.value = F, o.value = G, g ? (h && (h.dispose(), h = new B.CanvasTexture(R), h.minFilter = B.LinearFilter, h.magFilter = B.LinearFilter, v && (v.uniforms.uTex.value = h)), g.setPixelRatio(window.devicePixelRatio || 1), g.setSize(F, G)) : l.value && (l.value.width = F, l.value.height = G, l.value.style.width = F + "px", l.value.style.height = G + "px"), y());
    }
    function y() {
      if (!(R != null && R.width)) return;
      if (p) {
        if (!l.value) return;
        vn(R, {
          candles: t.candles,
          slotW: u.value,
          scrollX: f.value,
          theme: t.theme,
          glow: !1,
          showVolume: t.showVolume,
          volumeFraction: t.volumeFraction,
          hover: d.value,
          overlays: t.overlays,
          markers: t.markers,
          compact: t.compact,
          colors: t.colors
        });
        const G = l.value.getContext("2d");
        G && (G.clearRect(0, 0, l.value.width, l.value.height), G.drawImage(R, 0, 0));
        return;
      }
      if (!g || !v || !h) return;
      const F = t.theme === "paper";
      v.uniforms.uStrength.value = Ke(t.curvature), v.uniforms.uScanlines.value = t.scanlines && !F ? 1 : 0, v.uniforms.uVignette.value = F ? 0 : 1, _t(v, t.magnify, a, R.width, R.height), vn(R, {
        candles: t.candles,
        slotW: u.value,
        scrollX: f.value,
        theme: t.theme,
        glow: t.glow,
        showVolume: t.showVolume,
        volumeFraction: t.volumeFraction,
        hover: d.value,
        overlays: t.overlays,
        markers: t.markers,
        compact: t.compact,
        colors: t.colors
      }), h.needsUpdate = !0, g.render(L, C);
    }
    j(() => t.theme, () => y()), j(() => t.curvature, () => y()), j(() => t.scanlines, () => y()), j(() => t.glow, () => y()), j(() => t.showVolume, () => y()), j(() => t.volumeFraction, () => y()), j(() => t.slotW, () => y()), j(() => t.candles, () => y(), { deep: !1 }), j(() => t.overlays, () => y(), { deep: !1 }), j(() => t.markers, () => y(), { deep: !1 }), j(() => t.compact, () => y()), j(() => t.magnify, (F) => {
      F || (a.x = me.x, a.y = me.y), y();
    }), j(() => t.colors, () => y(), { deep: !0 }), j(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), j(f, () => y()), j(c, () => y()), j(d, () => y()), j(u, () => y());
    let x = null, A = null, O = 0;
    const K = It("cathodeResetTick", Y(0));
    j(K, () => Z());
    function Z() {
      cancelAnimationFrame(O), O = requestAnimationFrame(T);
    }
    function q(F) {
      F.preventDefault();
    }
    function Q() {
      g == null || g.dispose(), g = null, p = !1, W();
    }
    function $(F) {
      if (!l.value) return [-1, -1];
      const G = l.value.getBoundingClientRect();
      return [F.clientX - G.left, F.clientY - G.top];
    }
    function V(F) {
      var $e;
      const G = u.value;
      if (G <= 0) return 0;
      const re = (($e = t.candles) == null ? void 0 : $e.length) ?? 0, be = Math.max(1, Math.floor((s.value || 1) / G)), ye = Math.max(0, re - be);
      return Math.max(0, Math.min(F, ye * G));
    }
    function ue(F) {
      var be;
      if (F.deltaX !== 0 || F.shiftKey && F.deltaY !== 0) {
        const ye = F.deltaX !== 0 ? F.deltaX : F.deltaY;
        f.value = V(f.value + ye);
        return;
      }
      if (F.deltaY === 0) return;
      const [G] = $(F), re = u.value;
      if (G >= 0 && re > 0 && ((be = t.candles) != null && be.length)) {
        const ye = Math.max(1, Math.floor((s.value || 1) / re)), ut = Math.max(0, t.candles.length - ye - Math.floor(f.value / re)) + (G - 8) / re, ft = Math.exp(-F.deltaY * 15e-4), at = Math.max(rn, Math.min(sn, c.value * ft));
        c.value = at;
        const Fe = t.slotW * at, Ae = Math.max(1, Math.floor((s.value || 1) / Fe)), _e = ut - (G - 8) / Fe, Be = Math.max(0, t.candles.length - Ae - _e);
        f.value = V(Be * Fe);
      } else {
        const ye = Math.exp(-F.deltaY * 15e-4);
        c.value = Math.max(rn, Math.min(sn, c.value * ye));
      }
    }
    let te = !1, oe = 0, J = 0;
    function i(F) {
      F.button === 0 && (te = !0, oe = F.clientX, J = f.value, d.value = null, e.value && e.value.focus());
    }
    function w(F) {
      const G = Math.exp(F * 0.18);
      c.value = Math.max(rn, Math.min(sn, c.value * G)), f.value = V(f.value);
    }
    function P(F) {
      const G = u.value, re = F.shiftKey ? 20 : 3;
      switch (F.key) {
        case "ArrowLeft":
          F.preventDefault(), f.value = V(f.value + G * re);
          break;
        case "ArrowRight":
          F.preventDefault(), f.value = V(f.value - G * re);
          break;
        case "ArrowUp":
          F.preventDefault(), w(1);
          break;
        case "ArrowDown":
          F.preventDefault(), w(-1);
          break;
        case "Home":
          F.preventDefault(), f.value = V(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          F.preventDefault(), f.value = 0;
          break;
      }
    }
    function k(F) {
      if (te) {
        const G = F.clientX - oe;
        f.value = V(J + G);
        return;
      }
    }
    function z() {
      te = !1;
    }
    function H(F) {
      if (F.touches.length !== 1) return;
      const G = F.touches[0];
      te = !0, oe = G.clientX, J = f.value, d.value = null;
    }
    function N(F) {
      if (!te || F.touches.length !== 1) return;
      F.preventDefault();
      const re = F.touches[0].clientX - oe;
      f.value = V(J + re);
    }
    function ee() {
      te = !1;
    }
    function le(F) {
      if (t.magnify && l.value) {
        const be = Bt(F, l.value);
        a.x = be.x, a.y = be.y, y();
      }
      if (te) return;
      const [G, re] = $(F);
      if (G < 0 || re < 0) {
        d.value = null;
        return;
      }
      d.value = { x: G, y: re };
    }
    function ge() {
      d.value = null, a.x = me.x, a.y = me.y, y();
    }
    Ne(() => {
      document.addEventListener("mousemove", k), document.addEventListener("mouseup", z), De(() => {
        var F;
        W(), l.value && (l.value.addEventListener("webglcontextlost", q), l.value.addEventListener("webglcontextrestored", Q)), e.value && (x = new ResizeObserver(() => T()), x.observe(e.value), A = new IntersectionObserver((G) => {
          G.some((re) => re.isIntersecting) && Z();
        }), A.observe(e.value)), window.addEventListener("resize", Z), (F = window.visualViewport) == null || F.addEventListener("resize", Z);
      });
    }), Ze(() => {
      var F, G, re;
      document.removeEventListener("mousemove", k), document.removeEventListener("mouseup", z), (F = l.value) == null || F.removeEventListener("webglcontextlost", q), (G = l.value) == null || G.removeEventListener("webglcontextrestored", Q), x == null || x.disconnect(), A == null || A.disconnect(), window.removeEventListener("resize", Z), (re = window.visualViewport) == null || re.removeEventListener("resize", Z), cancelAnimationFrame(O), b();
    });
    const Te = ie(() => wt[t.theme] ?? wt.none), se = ie(() => ({
      background: Te.value.bg
    }));
    return (F, G) => (Me(), Se("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ue(se.value),
      tabindex: "0",
      onKeydown: P
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: it(ue, ["prevent"]),
        onMousedown: i,
        onMousemove: le,
        onMouseleave: ge,
        onTouchstartPassive: H,
        onTouchmove: N,
        onTouchend: ee,
        onTouchcancel: ee
      }, null, 544)
    ], 36));
  }
}), Ka = /* @__PURE__ */ Je(ha, [["__scopeId", "data-v-7c334778"]]), gt = 22, kt = 6, ma = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ga = /* @__PURE__ */ je({
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
  setup(n, { emit: t }) {
    const e = n, l = t, a = Y(null), s = Y(null), o = Y(-1), f = Y(0), c = { ...me };
    let d = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, g = !1;
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
    let b, L, C, v, h;
    const R = Y(0), I = Y(0), W = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Et}

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

  ${Dt}

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

    ${Ft}

    gl_FragColor = color;
  }
`;
    function T() {
      if (!(!s.value || !a.value)) {
        h = document.createElement("canvas");
        try {
          u = new B.WebGLRenderer({ canvas: s.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          g = !0;
        }
        if (!g && !u.getContext() && (u.dispose(), u = null, g = !0), g) {
          y();
          return;
        }
        u.setPixelRatio(d), u.setClearColor(0, 0), b = new B.Scene(), L = new B.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new B.CanvasTexture(h), v.minFilter = B.LinearFilter, v.magFilter = B.LinearFilter, C = new B.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...At()
          },
          vertexShader: ma,
          fragmentShader: W,
          transparent: !0
        }), b.add(new B.Mesh(new B.PlaneGeometry(2, 2), C)), y();
      }
    }
    function y() {
      if (!a.value || !u && !g) return;
      const i = a.value.clientWidth, w = a.value.clientHeight;
      if (!i || !w) return;
      R.value = i, I.value = w, d = Math.min(window.devicePixelRatio || 1, 2);
      const P = e.bendField ? Math.round(i * Xn(e.curvature)) : i, k = Math.round(P * d), z = Math.round(w * d), H = h.width !== k || h.height !== z;
      h.width = k, h.height = z, u ? (H && v && (v.dispose(), v = new B.CanvasTexture(h), v.minFilter = B.LinearFilter, v.magFilter = B.LinearFilter, C.uniforms.uTex.value = v), u.setPixelRatio(d), u.setSize(i, w)) : s.value && (s.value.width = Math.round(i * d), s.value.height = Math.round(w * d), s.value.style.width = i + "px", s.value.style.height = w + "px"), q();
    }
    function x() {
      const i = (h == null ? void 0 : h.width) || 0, w = Math.max(1, Math.floor(i / e.minCellW)), P = Math.floor(i / w), k = Math.round(P * e.cellAspect), z = gt + k + kt;
      return { rects: e.cells.map((N, ee) => ({
        x: ee % w * P,
        y: Math.floor(ee / w) * z - f.value,
        w: P,
        h: z
      })), rowH: z, totalH: Math.ceil(e.cells.length / w) * z, cols: w };
    }
    const A = () => {
      const { totalH: i } = x();
      return Math.max(0, i - ((h == null ? void 0 : h.height) || 0));
    }, O = /* @__PURE__ */ new Map();
    function K(i, w, P) {
      const k = i.candles[i.candles.length - 1], z = `${w}x${P}@${d}|${i.candles.length}|${k ? k.start + ":" + k.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, H = O.get(i.id);
      if (H && H.key === z) return H.canvas;
      const N = (H == null ? void 0 : H.canvas) ?? document.createElement("canvas");
      N.width = Math.round(w * d), N.height = Math.round(P * d);
      const ee = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, i.candles.length))), le = w < 260 && i.overlays ? i.overlays.map((ge) => ({ ...ge, label: "" })) : i.overlays;
      return vn(N, {
        candles: i.candles,
        slotW: ee,
        scrollX: Math.max(0, i.candles.length * ee - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: le,
        compact: !0,
        colors: e.colors,
        dpr: d
      }), O.set(i.id, { canvas: N, key: z }), N;
    }
    const Z = ie(() => ({ ...wt[e.theme] ?? wt.none, ...e.colors ?? {} }));
    function q() {
      var k;
      if (!(h != null && h.width)) return;
      const i = h.getContext("2d");
      if (!i) return;
      const w = Z.value;
      i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, h.width, h.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (i.fillStyle = w.bg, i.fillRect(0, 0, h.width, h.height)), i.setTransform(d, 0, 0, d, 0, 0);
      const { rects: P } = x();
      i.font = "600 11px ui-monospace, SFMono-Regular, monospace", i.textBaseline = "middle";
      for (let z = 0; z < e.cells.length; z++) {
        const H = e.cells[z], N = P[z];
        if (N.y + N.h < 0 || N.y > h.height / d) continue;
        const ee = N.x + kt / 2, le = N.w - kt;
        i.strokeStyle = H.open ? w.candleBull : w.gridline, i.lineWidth = z === o.value ? 2 : 1, i.strokeRect(ee + 0.5, N.y + 0.5, le - 1, N.h - kt - 1), i.save(), i.beginPath(), i.rect(ee, N.y, le, gt), i.clip();
        const ge = N.y + gt / 2 + 1, Te = H.note ? i.measureText(H.note).width + (H.open ? 22 : 12) : H.open ? 16 : 0, se = H.badge ? i.measureText(H.badge).width + 6 : 0, F = le - 14 - se - Te;
        let G = H.title;
        if (i.measureText(G).width > F) {
          for (; G.length > 1 && i.measureText(G + "…").width > F; ) G = G.slice(0, -1);
          G += "…";
        }
        let re = ee + 7;
        i.fillStyle = w.text, i.textAlign = "left", i.fillText(G, re, ge), re += i.measureText(G).width + 6, H.badge && (i.fillStyle = w.accent, i.fillText(H.badge, re, ge)), H.note && (i.textAlign = "right", i.fillStyle = H.noteColor || w.accent, i.fillText(H.note, ee + le - (H.open ? 16 : 7), ge), i.textAlign = "left"), i.restore(), H.open && (i.fillStyle = w.candleBull, i.beginPath(), i.arc(ee + le - 9, N.y + gt / 2 + 1, 3, 0, Math.PI * 2), i.fill());
        const be = N.y + gt, ye = N.h - gt - kt;
        H.candles.length ? i.drawImage(K(H, le - 2, ye - 1), ee + 1, be, le - 2, ye - 1) : (i.fillStyle = w.accent, i.textAlign = "center", i.fillText("· · ·", ee + le / 2, be + ye / 2), i.textAlign = "left");
      }
      if (g) {
        const z = (k = s.value) == null ? void 0 : k.getContext("2d");
        z && s.value && z.drawImage(h, 0, 0, h.width, h.height, 0, 0, s.value.width, s.value.height);
        return;
      }
      !u || !C || !v || (C.uniforms.uStrength.value = Ke(e.curvature), C.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, C.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, _t(C, e.magnify, c, R.value || h.width, I.value || h.height), v.needsUpdate = !0, u.render(b, L));
    }
    function Q(i) {
      if (!s.value) return [-1, -1];
      const w = s.value.getBoundingClientRect();
      return Nn(
        i.clientX - w.left,
        i.clientY - w.top,
        w.width,
        w.height,
        Ke(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((h == null ? void 0 : h.width) || w.width) / d,
        ((h == null ? void 0 : h.height) || w.height) / d
      );
    }
    function $(i, w) {
      if (i < 0) return -1;
      const { rects: P } = x();
      return P.findIndex((k) => i >= k.x && i < k.x + k.w && w >= k.y && w < k.y + k.h);
    }
    function V(i) {
      const [w, P] = Q(i), k = $(w, P);
      k >= 0 && l("cell-click", e.cells[k].id);
    }
    function ue(i) {
      if (e.magnify && s.value) {
        const z = Bt(i, s.value);
        c.x = z.x, c.y = z.y;
      }
      const [w, P] = Q(i), k = $(w, P);
      k !== o.value ? (o.value = k, q()) : e.magnify && q(), s.value && (s.value.style.cursor = k >= 0 ? "pointer" : "default");
    }
    function te() {
      o.value = -1, c.x = me.x, c.y = me.y, q();
    }
    function oe(i) {
      const w = A();
      w <= 0 || (i.preventDefault(), f.value = Math.max(0, Math.min(w, f.value + i.deltaY)), q());
    }
    let J = null;
    return Ne(() => {
      T(), J = new ResizeObserver(() => y()), a.value && J.observe(a.value);
    }), Ze(() => {
      J == null || J.disconnect(), p(), O.clear();
    }), j(() => [e.curvature, e.bendField], () => De(y)), j(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      f.value = Math.min(f.value, A()), q();
    }, { deep: !1 }), (i, w) => (Me(), Se("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: s,
        onClick: V,
        onMousemove: ue,
        onMouseleave: te,
        onWheel: oe
      }, null, 544)
    ], 512));
  }
}), qa = /* @__PURE__ */ Je(ga, [["__scopeId", "data-v-9f2b24f8"]]), bn = Y(0), hn = 28, pt = 12;
let mn = 10, Ut = "cathode.layout", Gt = !1;
const Re = Y({});
function pa(n, t = "cathode.layout") {
  if (!Gt) {
    Gt = !0, Ut = t;
    try {
      const e = localStorage.getItem(Ut);
      if (e) {
        Re.value = JSON.parse(e), Pn();
        return;
      }
    } catch {
    }
    Re.value = { ...n }, Pn();
  }
}
function Pn() {
  let n = 10;
  for (const t of Object.values(Re.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  mn = n;
}
function ct() {
  localStorage.setItem(Ut, JSON.stringify(Re.value));
}
function wa(n) {
  Gt = !1, localStorage.removeItem(Ut), Re.value = { ...n }, ct(), Gt = !0, bn.value++;
}
function Kn(n) {
  mn++, Re.value[n] && (Re.value[n].zIndex = mn);
}
function ya(n, t) {
  Re.value[n].visible = t, ct();
}
function xa(n, t) {
  Re.value[n].minimized = t, t && (Re.value[n].maximized = !1), ct();
}
function ba(n, t) {
  Re.value[n].maximized = t, t && (Re.value[n].minimized = !1, Kn(n)), ct();
}
function Ma(n, t, e) {
  Re.value[n].x = Math.round(t), Re.value[n].y = Math.round(e), ct();
}
function Sa(n, t, e) {
  Re.value[n].w = Math.round(t), Re.value[n].h = Math.round(e), ct();
}
function ja(n, t, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), s = Math.floor((n - pt * (l + 1)) / l), o = Math.floor((t - pt * (a + 1)) / a), f = {};
  return e.forEach((c, d) => {
    const u = d % l, g = Math.floor(d / l);
    f[c] = {
      x: pt + u * (s + pt),
      y: pt + g * (o + pt),
      w: s,
      h: o,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: d + 1
    };
  }), f;
}
function qn() {
  return {
    containers: Re,
    TITLEBAR_H: hn,
    load: pa,
    save: ct,
    reset: wa,
    bringToFront: Kn,
    setVisible: ya,
    setMinimized: xa,
    setMaximized: ba,
    updatePos: Ma,
    updateSize: Sa
  };
}
const Ta = { class: "ws-toolbar" }, Ca = {
  key: 0,
  class: "ws-restore-menu"
}, La = {
  key: 0,
  class: "ws-restore-empty"
}, ka = ["onClick"], Ra = /* @__PURE__ */ je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: l, reset: a, setVisible: s } = qn(), o = Y(null);
    Dn("cathodeWorkspace", o), Dn("cathodeResetTick", bn), Ne(() => {
      if (!o.value) return;
      const { clientWidth: v, clientHeight: h } = o.value, R = t.initialLayout ?? {};
      l(R, t.storageKey ?? "cathode.layout");
      const I = Object.keys(e.value)[0];
      I && f(I);
    });
    function f(v) {
      var R;
      document.querySelectorAll(".cc").forEach((I) => I.classList.remove("cc-focused"));
      const h = (R = o.value) == null ? void 0 : R.querySelector(`#cc-${v}`);
      h && h.classList.add("cc-focused");
    }
    function c() {
      !o.value || !t.initialLayout || a(t.initialLayout);
    }
    function d(v) {
      const h = v.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((R) => R.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const u = Y(!1), g = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function p(v) {
      s(v, !0), u.value = !1;
    }
    function b(v) {
      if (!u.value) return;
      const h = v.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (u.value = !1);
    }
    function L(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Ne(() => {
      document.addEventListener("click", b), document.addEventListener("keydown", L);
    }), Ze(() => {
      document.removeEventListener("click", b), document.removeEventListener("keydown", L);
    });
    function C(v) {
      var h;
      return ((h = t.containerTitles) == null ? void 0 : h[v]) ?? v;
    }
    return (v, h) => (Me(), Se("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: d
    }, [
      fn(v.$slots, "default", {}, void 0, !0),
      fn(v.$slots, "overlay", {}, void 0, !0),
      ve("div", Ta, [
        n.initialLayout ? (Me(), Se("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : Ge("", !0),
        h[1] || (h[1] = ve("div", { class: "ws-sep" }, null, -1)),
        ve("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (R) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Hn(ul, { name: "menu" }, {
        default: fl(() => [
          u.value ? (Me(), Se("div", Ca, [
            h[3] || (h[3] = ve("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            g().length ? Ge("", !0) : (Me(), Se("div", La, " No closed panels ")),
            (Me(!0), Se(dl, null, vl(g(), (R) => (Me(), Se("div", {
              key: R,
              class: "ws-restore-item",
              onClick: (I) => p(R)
            }, [
              h[2] || (h[2] = ve("span", { class: "ws-restore-icon" }, "⊞", -1)),
              hl(" " + Oe(C(R)), 1)
            ], 8, ka))), 128))
          ])) : Ge("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Za = /* @__PURE__ */ Je(Ra, [["__scopeId", "data-v-5838d04b"]]), Ia = ["id"], Ea = { class: "cc-title" }, Da = {
  key: 0,
  class: "cc-size-badge"
}, Fa = { class: "cc-controls" }, Aa = ["title"], _a = { class: "cc-body" }, Ba = 200, Wa = 80, Yn = 60, Pa = /* @__PURE__ */ je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: l, setVisible: a, setMinimized: s, setMaximized: o, updatePos: f, updateSize: c } = qn(), d = It("cathodeWorkspace", Y(null)), u = ie(() => e.value[t.id]), g = ie(() => {
      const i = u.value, w = t.curvature ?? 0;
      if (!i) return {};
      const P = { "--curvature": Math.abs(w) };
      return i.maximized ? { ...P, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: i.zIndex } : {
        ...P,
        left: i.x + "px",
        top: i.y + "px",
        width: i.w + "px",
        height: i.minimized ? hn + "px" : i.h + "px",
        zIndex: i.zIndex,
        display: i.visible ? "flex" : "none"
      };
    });
    let p = !1, b = 0, L = 0;
    function C(i) {
      var k;
      if (i.target.closest(".cc-btn") || u.value.maximized) return;
      l(t.id), p = !0;
      const w = (k = d.value) == null ? void 0 : k.querySelector(`#cc-${t.id}`);
      if (!w) return;
      const P = w.getBoundingClientRect();
      b = i.clientX - P.left, L = i.clientY - P.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", h), i.preventDefault();
    }
    function v(i) {
      var H;
      if (!p || !d.value) return;
      const w = d.value.getBoundingClientRect(), P = ((H = u.value) == null ? void 0 : H.w) ?? 300;
      let k = i.clientX - w.left - b, z = i.clientY - w.top - L;
      k = Math.max(Yn - P, Math.min(w.width - Yn, k)), z = Math.max(0, Math.min(w.height - hn, z)), f(t.id, k, z);
    }
    function h() {
      p = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h);
    }
    let R = !1, I = 0, W = 0, T = 0, y = 0;
    const x = Y("");
    function A(i) {
      u.value.maximized || (l(t.id), R = !0, I = i.clientX, W = i.clientY, T = u.value.w, y = u.value.h, document.addEventListener("mousemove", O), document.addEventListener("mouseup", K), i.preventDefault(), i.stopPropagation());
    }
    function O(i) {
      if (!R) return;
      const w = Math.max(Ba, T + (i.clientX - I)), P = Math.max(Wa, y + (i.clientY - W));
      c(t.id, w, P), x.value = `${Math.round(w)}×${Math.round(P)}`;
    }
    function K() {
      R = !1, x.value = "", document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", K), Z.value++;
    }
    const Z = Y(0);
    j(bn, () => {
      Z.value++;
    }), Ze(() => {
      var i;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", K), (i = q.value) == null || i.removeEventListener("scroll", $), V();
    });
    const q = Y(null);
    function Q(i) {
      if (t.canvas) return [];
      const w = i.children[0];
      return w ? Array.from(w.children) : [];
    }
    function $() {
      const i = q.value, w = t.curvature ?? 0;
      if (!i) return;
      const P = Q(i);
      if (!P.length) return;
      const k = i.clientHeight, z = k / 2, H = w * 38e-4;
      P.forEach((N) => {
        if (!N.dataset.origFs) {
          const be = getComputedStyle(N);
          N.dataset.origFs = be.fontSize, N.dataset.origLh = be.lineHeight;
        }
        if (w === 0) {
          N.style.fontSize = "", N.style.lineHeight = "";
          return;
        }
        const ee = N.getBoundingClientRect(), le = i.getBoundingClientRect(), ge = ee.top - le.top + ee.height / 2, Te = Math.min(1, Math.abs(ge - z) / (k / 2)), se = 1 + H * Math.cos(Te * Math.PI / 2), F = parseFloat(N.dataset.origFs), G = N.dataset.origLh, re = G === "normal" ? F * 1.4 : parseFloat(G);
        isNaN(F) || (N.style.fontSize = `${(F * se).toFixed(2)}px`), isNaN(re) || (N.style.lineHeight = `${(re * se).toFixed(2)}px`);
      });
    }
    function V() {
      const i = q.value;
      i && Q(i).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    j(() => t.curvature, (i) => {
      (i ?? 0) === 0 ? V() : $();
    }), Ne(() => {
      var i;
      (i = q.value) == null || i.addEventListener("scroll", $, { passive: !0 }), De($);
    });
    function ue() {
      s(t.id, !u.value.minimized), De(() => {
        Z.value++;
      });
    }
    function te() {
      o(t.id, !u.value.maximized), De(() => {
        Z.value++;
      });
    }
    function oe() {
      a(t.id, !1);
    }
    function J() {
      l(t.id);
    }
    return (i, w) => u.value && u.value.visible ? (Me(), Se("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: ml(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: Ue(g.value),
      onMousedown: J
    }, [
      ve("div", {
        class: "cc-titlebar",
        onMousedown: C
      }, [
        w[0] || (w[0] = ve("span", { class: "cc-status-dot" }, null, -1)),
        ve("span", Ea, Oe(n.title), 1),
        x.value ? (Me(), Se("span", Da, Oe(x.value), 1)) : Ge("", !0),
        ve("div", Fa, [
          ve("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: it(ue, ["stop"])
          }, "─"),
          ve("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: it(te, ["stop"])
          }, Oe(u.value.maximized ? "⤡" : "⤢"), 9, Aa),
          ve("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: it(oe, ["stop"])
          }, "✕")
        ])
      ], 32),
      zn(ve("div", _a, [
        ve("div", {
          ref_key: "bodyEl",
          ref: q,
          class: "cc-screen",
          onScroll: $
        }, [
          fn(i.$slots, "default", { resizeKey: Z.value }, void 0, !0),
          w[1] || (w[1] = ve("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [gl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (Me(), Se("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: it(A, ["stop"])
      }, null, 32)) : Ge("", !0)
    ], 46, Ia)) : Ge("", !0);
  }
}), Ja = /* @__PURE__ */ Je(Pa, [["__scopeId", "data-v-ca0af4ca"]]), Ya = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ha = `
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
`, za = 100, $a = /* @__PURE__ */ je({
  __name: "CathodeLoader",
  props: {
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    label: { default: "BOOTING" }
  },
  setup(n) {
    const t = n, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, l = Y(null), a = Y(null);
    let s = null, o = !1;
    function f() {
      if (s) {
        try {
          s.forceContextLoss();
        } catch {
        }
        try {
          s.dispose();
        } catch {
        }
        s = null;
      }
    }
    let c, d, u, g, p, b = null, L = 0;
    function C(y) {
      y - L >= za && (R(), L = y), b = requestAnimationFrame(C);
    }
    function v() {
      if (!l.value || !p) return;
      const y = l.value.clientWidth, x = l.value.clientHeight;
      y <= 0 || x <= 0 || p.width === y && p.height === x || (p.width = y, p.height = x, s && s.setSize(y, x, !1), a.value && (a.value.width = y, a.value.height = x, a.value.style.width = y + "px", a.value.style.height = x + "px"));
    }
    function h() {
      if (!(p != null && p.width)) return;
      const y = p.getContext("2d");
      if (!y) return;
      const x = p.width, A = p.height, O = e[t.theme] ?? e.none;
      y.clearRect(0, 0, x, A), y.fillStyle = O.bg, y.fillRect(0, 0, x, A);
      const K = Date.now(), Z = (K / 500 | 0) % 2 === 0, q = (K / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(x, A) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = O.text, t.glow && (y.shadowColor = O.text, y.shadowBlur = 14);
      const Q = ".".repeat(q).padEnd(3, " "), $ = `${t.label}${Q}`;
      if (y.fillText($, x / 2, A / 2), y.shadowBlur = 0, Z) {
        const V = y.measureText($), ue = y.measureText("M").width, te = parseFloat(y.font), oe = x / 2 + V.width / 2 + 4, J = A / 2 - te / 2 + 2;
        y.fillStyle = O.cursor, t.glow && (y.shadowColor = O.cursor, y.shadowBlur = 12), y.fillRect(oe, J, ue * 0.7, te * 0.95), y.shadowBlur = 0;
      }
    }
    function R() {
      if (!p) return;
      if (h(), o) {
        if (!a.value) return;
        const x = a.value.getContext("2d");
        x && x.drawImage(p, 0, 0);
        return;
      }
      if (!s || !u || !g) return;
      const y = t.theme === "paper";
      u.uniforms.uStrength.value = Ke(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !y ? 1 : 0, u.uniforms.uVignette.value = y ? 0 : 1, g.needsUpdate = !0, s.render(c, d);
    }
    function I() {
      if (!(!a.value || !l.value)) {
        p = document.createElement("canvas");
        try {
          s = new B.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          o = !0;
        }
        if (!o && !s.getContext() && (s.dispose(), s = null, o = !0), o) {
          v();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), c = new B.Scene(), d = new B.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new B.CanvasTexture(p), g.minFilter = B.LinearFilter, g.magFilter = B.LinearFilter, u = new B.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ya,
          fragmentShader: Ha,
          transparent: !0
        }), c.add(new B.Mesh(new B.PlaneGeometry(2, 2), u)), v();
      }
    }
    let W = null;
    Ne(() => {
      I(), R(), b = requestAnimationFrame(C), l.value && (W = new ResizeObserver(() => v()), W.observe(l.value));
    }), Ze(() => {
      b !== null && cancelAnimationFrame(b), W == null || W.disconnect(), f(), g == null || g.dispose(), u == null || u.dispose();
    }), j(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => R());
    const T = ie(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (y, x) => (Me(), Se("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ue(T.value)
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Qa = /* @__PURE__ */ Je($a, [["__scopeId", "data-v-d00e5f47"]]), Kt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, Ee = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Le = 12;
function cn(n, t, e) {
  const l = [];
  for (const a of t.split(`
`)) {
    let s = "";
    for (const o of a.split(" ")) {
      const f = s ? `${s} ${o}` : o;
      s && n.measureText(f).width > e ? (l.push(s), s = o) : s = f;
    }
    l.push(s);
  }
  return l;
}
function un(n, t, e, l, a, s) {
  const o = Math.min(s, l / 2, a / 2);
  n.beginPath(), n.moveTo(t + o, e), n.lineTo(t + l - o, e), n.quadraticCurveTo(t + l, e, t + l, e + o), n.lineTo(t + l, e + a - o), n.quadraticCurveTo(t + l, e + a, t + l - o, e + a), n.lineTo(t + o, e + a), n.quadraticCurveTo(t, e + a, t, e + a - o), n.lineTo(t, e + o), n.quadraticCurveTo(t, e, t + o, e), n.closePath();
}
function Va(n, t) {
  const e = n.getContext("2d");
  if (!e) return 0;
  const l = t.dpr || 1, a = n.width / l, s = n.height / l, o = { ...Kt[t.theme] ?? Kt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(l, 0, 0, l, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, a, s);
  const f = (x) => x > 0 ? o.right : x < 0 ? o.left : o.neutral, c = f(t.value), d = (x, A = 10) => {
    t.glow && (e.shadowColor = x, e.shadowBlur = A);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, g = Math.max(40, a - Le * 2);
  let p = Le;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const b = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${Ee}`;
  const L = e.measureText(b).width;
  e.fillStyle = c, d(c, 14), e.fillText(b, Le, p + 30), u();
  const C = Le + L + 14;
  t.stance && (e.font = `700 14px ${Ee}`, e.fillStyle = c, d(c, 8), e.fillText(t.stance.toUpperCase(), C, p + 15), u()), t.sub && (e.font = `11px ${Ee}`, e.fillStyle = o.dim, e.fillText(t.sub, C, p + 31)), p += 48, e.font = `700 9px ${Ee}`;
  const v = t.leftLabel.toUpperCase(), h = t.rightLabel.toUpperCase(), R = e.measureText(v).width, I = e.measureText(h).width, W = Le + R + 8, T = a - Le - I - 8, y = p + 10;
  if (e.fillStyle = o.left, e.fillText(v, Le, y + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(h, a - Le, y + 3), e.textAlign = "left", T - W > 24) {
    const x = e.createLinearGradient(W, 0, T, 0);
    x.addColorStop(0, o.left), x.addColorStop(0.45, o.surface), x.addColorStop(0.55, o.surface), x.addColorStop(1, o.right), un(e, W, y - 4, T - W, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = x, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const A = (W + T) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(A, y - 8), e.lineTo(A, y + 8), e.stroke();
    for (const Q of [0.25, 0.75]) {
      const $ = W + Q * (T - W);
      e.beginPath(), e.moveTo($, y - 5), e.lineTo($, y + 5), e.stroke();
    }
    const O = t.max - t.min || 1, K = Math.max(0, Math.min(1, (t.shown - t.min) / O)), Z = W + K * (T - W), q = f(t.shown);
    e.beginPath(), e.moveTo(Z, y - 10), e.lineTo(Z - 4.5, y - 17), e.lineTo(Z + 4.5, y - 17), e.closePath(), e.fillStyle = q, e.fill(), e.beginPath(), e.arc(Z, y, 6.5, 0, Math.PI * 2), e.fillStyle = q, d(q, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
  }
  if (p += 30, t.caption) {
    e.font = `600 11.5px ${Ee}`;
    const x = cn(e, t.caption, g - 18), A = x.length * 15 + 12;
    un(e, Le, p, g, A, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, x.forEach((O, K) => e.fillText(O, Le + 9, p + 17 + K * 15)), p += A + 10;
  }
  if (t.note) {
    e.font = `10px ${Ee}`, e.fillStyle = o.dim;
    const x = cn(e, t.note, g);
    x.forEach((A, O) => e.fillText(A, Le, p + 10 + O * 14)), p += x.length * 14 + 10;
  }
  if (t.items.length) {
    let O = Le;
    for (const K of t.items) {
      const Z = K.side === "left" ? o.left : K.side === "right" ? o.right : o.neutral, q = K.side === "left" ? t.sideLetters[0] : K.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${Ee}`;
      const Q = e.measureText(K.label).width;
      e.font = `700 8px ${Ee}`;
      const $ = q ? e.measureText(q).width + 6 : 0;
      e.font = `10px ${Ee}`;
      const V = K.value ? e.measureText(K.value).width : 0, ue = 7 + Q + (q ? 4 + $ : 0) + (K.value ? 4 + V : 0) + 7;
      O + ue > a - Le && O > Le && (O = Le, p += 23), un(e, O, p, ue, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = Z, e.fillRect(O, p + 1, 2, 16);
      let te = O + 7;
      e.font = `700 10px ${Ee}`, e.fillStyle = o.text, e.fillText(K.label, te, p + 12.5), te += Q + 4, q && (e.font = `700 8px ${Ee}`, e.fillStyle = Z, e.fillText(q, te + 3, p + 12), te += $ + 4), K.value && (e.font = `10px ${Ee}`, e.fillStyle = K.tone === "up" ? o.right : K.tone === "down" ? o.left : o.dim, e.fillText(K.value, te, p + 12.5)), O += ue + 5;
    }
    p += 18;
  } else if (t.emptyText) {
    e.font = `10px ${Ee}`, e.fillStyle = o.dim;
    const x = cn(e, t.emptyText, g);
    x.forEach((A, O) => e.fillText(A, Le, p + 10 + O * 14)), p += x.length * 14;
  }
  return p + Le;
}
const Oa = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Na = /* @__PURE__ */ je({
  __name: "CathodeGauge",
  props: {
    theme: { default: "none" },
    curvature: { default: 10 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    magnify: { type: Boolean, default: !1 },
    value: {},
    min: { default: -1 },
    max: { default: 1 },
    readout: {},
    stance: {},
    sub: {},
    leftLabel: { default: "−" },
    rightLabel: { default: "+" },
    sideLetters: { default: () => ["−", "+"] },
    caption: {},
    note: {},
    items: { default: () => [] },
    emptyText: {},
    colors: {},
    animate: { type: Boolean, default: !0 }
  },
  setup(n) {
    const t = n, e = Y(null), l = Y(null), a = () => (t.min + t.max) / 2, s = Y(t.animate ? a() : t.value);
    let o = 0;
    function f() {
      if (cancelAnimationFrame(o), !t.animate) {
        s.value = t.value, A();
        return;
      }
      const J = () => {
        const i = t.value - s.value;
        if (Math.abs(i) < 4e-3) {
          s.value = t.value, A();
          return;
        }
        s.value += i * 0.18, A(), o = requestAnimationFrame(J);
      };
      o = requestAnimationFrame(J);
    }
    j(() => t.value, f);
    let c = null, d = !1;
    function u() {
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
    let g, p, b, L, C, v = 1, h = 0, R = 0;
    const I = { x: me.x, y: me.y }, W = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Et}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
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

  ${Dt}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);
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
    ${Ft}
    gl_FragColor = color;
  }
`;
    function T() {
      if (!(!l.value || !e.value)) {
        C = document.createElement("canvas");
        try {
          c = new B.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          d = !0;
        }
        if (!d && !c.getContext() && (c.dispose(), c = null, d = !0), d) {
          y();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), g = new B.Scene(), p = new B.OrthographicCamera(-1, 1, 1, -1, 0, 1), L = new B.CanvasTexture(C), L.minFilter = B.LinearFilter, L.magFilter = B.LinearFilter, b = new B.ShaderMaterial({
          uniforms: {
            uTex: { value: L },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...At()
          },
          vertexShader: Oa,
          fragmentShader: W,
          transparent: !0
        }), g.add(new B.Mesh(new B.PlaneGeometry(2, 2), b)), y();
      }
    }
    function y() {
      if (!e.value || !C || !c && !d) return;
      const J = e.value.clientWidth, i = e.value.clientHeight;
      if (!J || !i) return;
      const w = Math.min(window.devicePixelRatio || 1, 2), P = Math.round(J * w), k = Math.round(i * w);
      C.width === P && C.height === k && v === w || (v = w, h = J, R = i, C.width = P, C.height = k, c ? (L && (L.dispose(), L = new B.CanvasTexture(C), L.minFilter = B.LinearFilter, L.magFilter = B.LinearFilter, b && (b.uniforms.uTex.value = L)), c.setPixelRatio(v), c.setSize(J, i)) : l.value && (l.value.width = P, l.value.height = k, l.value.style.width = J + "px", l.value.style.height = i + "px"), A());
    }
    function x(J) {
      Va(C, {
        dpr: v,
        theme: t.theme,
        colors: t.colors,
        glow: J,
        shown: s.value,
        value: t.value,
        min: t.min,
        max: t.max,
        readout: t.readout,
        stance: t.stance,
        sub: t.sub,
        leftLabel: t.leftLabel,
        rightLabel: t.rightLabel,
        sideLetters: t.sideLetters,
        caption: t.caption,
        note: t.note,
        items: t.items,
        emptyText: t.emptyText
      });
    }
    function A() {
      if (!(C != null && C.width)) return;
      if (d) {
        if (!l.value) return;
        x(!1);
        const i = l.value.getContext("2d");
        i && (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, l.value.width, l.value.height), i.drawImage(C, 0, 0));
        return;
      }
      if (!c || !b || !L) return;
      const J = t.theme === "paper";
      b.uniforms.uStrength.value = Ke(t.curvature), b.uniforms.uScanlines.value = t.scanlines && !J ? 1 : 0, b.uniforms.uVignette.value = J ? 0 : 1, _t(b, t.magnify, I, h || C.width, R || C.height), x(t.glow), L.needsUpdate = !0, c.render(g, p);
    }
    j(
      () => [
        t.theme,
        t.curvature,
        t.scanlines,
        t.glow,
        t.readout,
        t.stance,
        t.sub,
        t.leftLabel,
        t.rightLabel,
        t.sideLetters,
        t.caption,
        t.note,
        t.items,
        t.emptyText,
        t.colors,
        t.min,
        t.max
      ],
      () => A(),
      { deep: !0 }
    ), j(() => t.magnify, (J) => {
      J || (I.x = me.x, I.y = me.y), A();
    });
    function O(J) {
      if (!t.magnify || !l.value) return;
      const i = Bt(J, l.value);
      I.x = i.x, I.y = i.y, A();
    }
    function K() {
      I.x = me.x, I.y = me.y, A();
    }
    let Z = null, q = null, Q = 0;
    const $ = It("cathodeResetTick", Y(0));
    j($, () => V());
    function V() {
      cancelAnimationFrame(Q), Q = requestAnimationFrame(y);
    }
    function ue(J) {
      J.preventDefault();
    }
    function te() {
      c == null || c.dispose(), c = null, d = !1, T();
    }
    Ne(() => {
      De(() => {
        var J;
        T(), l.value && (l.value.addEventListener("webglcontextlost", ue), l.value.addEventListener("webglcontextrestored", te)), e.value && (Z = new ResizeObserver(() => y()), Z.observe(e.value), q = new IntersectionObserver((i) => {
          i.some((w) => w.isIntersecting) && V();
        }), q.observe(e.value)), window.addEventListener("resize", V), (J = window.visualViewport) == null || J.addEventListener("resize", V), f();
      });
    }), Ze(() => {
      var J, i, w;
      cancelAnimationFrame(o), cancelAnimationFrame(Q), (J = l.value) == null || J.removeEventListener("webglcontextlost", ue), (i = l.value) == null || i.removeEventListener("webglcontextrestored", te), Z == null || Z.disconnect(), q == null || q.disconnect(), window.removeEventListener("resize", V), (w = window.visualViewport) == null || w.removeEventListener("resize", V), u(), L == null || L.dispose(), b == null || b.dispose();
    });
    const oe = ie(() => ({
      background: (Kt[t.theme] ?? Kt.none).bg
    }));
    return (J, i) => (Me(), Se("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: Ue(oe.value)
    }, [
      ve("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-gauge-canvas",
        onMousemove: O,
        onMouseleave: K
      }, null, 544)
    ], 4));
  }
}), eo = /* @__PURE__ */ Je(Na, [["__scopeId", "data-v-2b034d24"]]);
export {
  wt as CANDLE_THEME_COLORS,
  Ka as CathodeCandle,
  qa as CathodeCandleGrid,
  Ja as CathodeContainer,
  eo as CathodeGauge,
  Ua as CathodeGrid,
  Qa as CathodeLoader,
  Vl as CathodeLog,
  Ga as CathodeTerminal,
  Za as CathodeWorkspace,
  Kt as GAUGE_THEME_COLORS,
  Xt as LOG_THEME_COLORS,
  ja as buildDefaultLayout,
  qn as useCathodeLayout
};
