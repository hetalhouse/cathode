import { defineComponent as Qe, ref as P, reactive as Zt, watch as G, nextTick as Be, computed as ie, inject as Ht, onMounted as Ne, onUnmounted as et, openBlock as Se, createElementBlock as Te, normalizeStyle as Ke, createElementVNode as de, withModifiers as at, withKeys as Cn, createCommentVNode as Oe, toDisplayString as Ve, createVNode as _n, withDirectives as Bn, vModelText as ol, provide as kn, renderSlot as an, Transition as al, withCtx as rl, Fragment as il, renderList as sl, createTextVNode as cl, normalizeClass as ul, vShow as fl } from "vue";
import * as $ from "three";
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
}, Me = 30, rn = 12, dl = 10, At = 14, Wn = 5;
function _t() {
  return `${rn}px system-ui, -apple-system, sans-serif`;
}
function Pn(t, n, e) {
  const l = String(n ?? "");
  if (!l) return [""];
  const o = l.split(/\s+/).filter(Boolean);
  if (o.length === 0) return [""];
  const s = [];
  let i = "";
  for (const u of o) {
    const m = i ? i + " " + u : u;
    !i || t.measureText(m).width <= e ? i = m : (s.push(i), i = u);
  }
  return i && s.push(i), s.length ? s : [""];
}
function vl(t, n) {
  return Math.max(n, t * At + Wn * 2);
}
function fn(t, n) {
  const e = new Array(n + 1);
  e[0] = 0;
  for (let l = 0; l < n; l++) e[l + 1] = e[l] + (t[l] ?? 0);
  return e;
}
function Bt(t, n) {
  if (n <= 0) return 0;
  let e = 0, l = t.length - 1;
  for (; e < l; ) {
    const o = e + l + 1 >> 1;
    t[o] <= n ? e = o : l = o - 1;
  }
  return e;
}
const Yn = 28;
function hl(t, n) {
  if (typeof n == "function") return n(t);
  const e = t.filter((o) => o != null && o !== "");
  if (n === "count") return e.length;
  const l = e.map((o) => Number(o)).filter((o) => !Number.isNaN(o));
  if (l.length === 0) return null;
  switch (n) {
    case "sum":
      return l.reduce((o, s) => o + s, 0);
    case "avg":
      return l.reduce((o, s) => o + s, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function In(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = n.dpr && n.dpr > 0 ? n.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const o = t.width / l, s = t.height / l, i = Ge[n.theme] ?? Ge.none, { cols: u, rows: m, pinnedRows: d, rowHeight: c, scrollY: g, scrollX: p, glow: S } = n;
  e.clearRect(0, 0, o, s), e.fillStyle = i.bg, e.fillRect(0, 0, o, s), e.save(), e.beginPath(), e.rect(0, 0, o, s), e.clip();
  const L = d.length * c, R = n.aggregateRow ? Yn : 0, v = s - Me - L - R;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, o, Me), e.textBaseline = "middle", e.textAlign = "left";
  let h = -p;
  for (let r = 0; r < u.length; r++) {
    const w = u[r];
    if (h + w.width <= 0) {
      h += w.width;
      continue;
    }
    if (h >= o) break;
    const B = !!n.colFilters[w.colId], M = n.sortColId === w.colId, W = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, w.width, Me), e.clip(), e.font = `bold ${dl}px system-ui, -apple-system, sans-serif`, e.fillStyle = B ? i.accent : i.textHeader, S ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(W, h + 8, Me / 2), e.shadowBlur = 4, e.fillText(W, h + 8, Me / 2), e.shadowBlur = 0) : e.fillText(W, h + 8, Me / 2), M) {
      const _ = e.measureText(W).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", h + 8 + _ + 4, Me / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = B ? i.accent : i.textHeader, e.globalAlpha = B ? 1 : 0.38, e.fillText("⌕", h + w.width - 20, Me / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(h + w.width - 0.5, 0), e.lineTo(h + w.width - 0.5, Me), e.stroke(), h += w.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Me - 0.5), e.lineTo(o, Me - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Me, o, v), e.clip();
  const C = n.rowHeights && n.rowHeights.length === m.length ? n.rowHeights : null, D = C ? fn(C, m.length) : null, O = (r) => D ? D[r] : r * c, T = (r) => C ? C[r] : c, y = D ? Bt(D, g) : Math.max(0, Math.floor(g / c));
  let k;
  if (D)
    for (k = y; k < m.length && O(k) < g + v; ) k++;
  else
    k = Math.min(m.length, Math.ceil((g + v) / c));
  const U = n.selectionAnchorRow ?? n.selectedRow, K = n.selectionAnchorCol ?? n.selectedCol, te = n.selectedRow >= 0 && U >= 0 ? Math.min(n.selectedRow, U) : -1, le = n.selectedRow >= 0 && U >= 0 ? Math.max(n.selectedRow, U) : -1, q = n.selectedCol >= 0 && K >= 0 ? Math.min(n.selectedCol, K) : -1, J = n.selectedCol >= 0 && K >= 0 ? Math.max(n.selectedCol, K) : -1, N = le > te || J > q;
  let X = Number.POSITIVE_INFINITY, ue = Number.NEGATIVE_INFINITY, se = Number.POSITIVE_INFINITY, oe = Number.NEGATIVE_INFINITY;
  const me = (r, w, B, M) => {
    S ? (e.shadowColor = M, e.shadowBlur = 12, e.fillText(r, w, B), e.shadowBlur = 6, e.fillText(r, w, B), e.shadowBlur = 2, e.fillText(r, w, B), e.shadowBlur = 0) : e.fillText(r, w, B);
  };
  for (let r = y; r < k; r++) {
    const w = m[r], B = T(r), M = Me + O(r) - g;
    r % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, M, o, B));
    const W = r >= te && r <= le;
    r === n.hoveredRow && !W && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M, o, B)), W && !N && (e.fillStyle = Jt(i.accent, 0.1), e.fillRect(0, M, o, B)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, M + B - 0.5), e.lineTo(o, M + B - 0.5), e.stroke();
    let _ = -p;
    for (let Y = 0; Y < u.length; Y++) {
      const j = u[Y];
      if (_ + j.width <= 0) {
        _ += j.width;
        continue;
      }
      if (_ >= o) break;
      const Q = W && Y >= q && Y <= J;
      Q && N && (e.fillStyle = Jt(i.accent, 0.14), e.fillRect(_, M, j.width, B)), Q && (_ < X && (X = _), _ + j.width > ue && (ue = _ + j.width), M < se && (se = M), M + B > oe && (oe = M + B));
      const he = n.getCellStyle(j, w), be = he.color ?? i.text, ae = he.textAlign ?? "left", F = n.formatCell(j, w);
      if (e.save(), e.beginPath(), e.rect(_ + 1, M, j.width - 2, B), e.clip(), e.font = _t(), e.fillStyle = be, e.textBaseline = "middle", j.colDef.wrap) {
        e.textAlign = "left";
        const V = Pn(e, F, Math.max(20, j.width - 16));
        let ne = M + Wn + At / 2;
        for (const xe of V) {
          if (ne - At / 2 >= M + B) break;
          me(xe, _ + 8, ne, be), ne += At;
        }
      } else {
        const V = ae === "right" ? _ + j.width - 8 : _ + 8;
        e.textAlign = ae === "right" ? "right" : "left", me(F, V, M + B / 2, be);
      }
      e.restore(), r === n.selectedRow && Y === n.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(_ + 1.5, M + 1.5, j.width - 3, B - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(_ + j.width - 0.5, M), e.lineTo(_ + j.width - 0.5, M + B), e.stroke(), _ += j.width;
    }
  }
  if (N && X < ue && se < oe && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(X + 0.5, se + 0.5, ue - X - 1, oe - se - 1)), e.restore(), d.length > 0) {
    const r = s - L - R;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, r - 0.5), e.lineTo(o, r - 0.5), e.stroke();
    for (let w = 0; w < d.length; w++) {
      const B = d[w], M = r + w * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, M, o, c);
      let W = -p;
      for (let _ = 0; _ < u.length; _++) {
        const Y = u[_];
        if (W + Y.width <= 0) {
          W += Y.width;
          continue;
        }
        if (W >= o) break;
        const j = n.getCellStyle(Y, B), Q = j.color ?? i.text, he = j.textAlign ?? "left", be = n.formatCell(Y, B);
        e.save(), e.beginPath(), e.rect(W + 1, M, Y.width - 2, c), e.clip(), e.font = `bold ${rn}px system-ui, -apple-system, sans-serif`, e.fillStyle = Q, e.textBaseline = "middle", he === "right" ? (e.textAlign = "right", e.fillText(be, W + Y.width - 8, M + c / 2)) : (e.textAlign = "left", e.fillText(be, W + 8, M + c / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(W + Y.width - 0.5, M), e.lineTo(W + Y.width - 0.5, M + c), e.stroke(), W += Y.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, M + c - 0.5), e.lineTo(o, M + c - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const r = s - R;
    e.fillStyle = Jt(i.accent, 0.1), e.fillRect(0, r, o, R), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, r - 0.5), e.lineTo(o, r - 0.5), e.stroke();
    let w = -p;
    for (let B = 0; B < u.length; B++) {
      const M = u[B];
      if (w + M.width <= 0) {
        w += M.width;
        continue;
      }
      if (w >= o) break;
      const _ = n.getCellStyle(M, n.aggregateRow).textAlign ?? "left", Y = n.aggregateRow[M.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, r, M.width - 2, R), e.clip(), e.font = `bold ${rn}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", S && (e.shadowColor = i.accent, e.shadowBlur = 8), _ === "right" ? (e.textAlign = "right", e.fillText(Y, w + M.width - 8, r + R / 2)) : (e.textAlign = "left", e.fillText(Y, w + 8, r + R / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + M.width - 0.5, r), e.lineTo(w + M.width - 0.5, r + R), e.stroke(), w += M.width;
    }
  }
  e.restore();
}
function Jt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), o = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${o},${n})`;
}
const Et = 190, Qt = 34;
function ml(t, n, e) {
  const l = Math.max(4, Math.min(n, t - Et - 4)), o = Me + 6, s = e ? 26 : 0;
  return {
    box: { x: l, y: o, w: Et, h: Qt },
    input: { x: l + 9, y: o + 5, w: Et - 18 - s, h: Qt - 10 },
    clear: e ? { x: l + Et - 28, y: o, w: 28, h: Qt } : null
  };
}
const en = (t, n, e, l = 0) => t >= e.x - l && t <= e.x + e.w + l && n >= e.y && n <= e.y + e.h;
function Dt(t, n, e, l = 1) {
  return e.clear && en(t, n, e.clear, 4 * (l - 1)) ? "clear" : en(t, n, e.input) ? "input" : en(t, n, e.box) ? "inside" : "outside";
}
function gl(t, n, e, l, o) {
  const { box: s, input: i, clear: u } = n;
  t.save(), t.fillStyle = "rgba(8,12,22,0.94)", t.strokeStyle = o.accent, t.lineWidth = 1, t.beginPath(), t.roundRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1, 4), t.fill(), t.stroke(), t.fillStyle = "rgba(255,255,255,0.05)", t.beginPath(), t.roundRect(i.x, i.y, i.w, i.h, 3), t.fill(), t.beginPath(), t.rect(i.x, i.y, i.w, i.h), t.clip(), t.font = _t(), t.textBaseline = "middle";
  const m = i.y + i.h / 2 + 1, d = 5;
  if (e) {
    t.fillStyle = o.text;
    const c = t.measureText(e).width, g = c > i.w - 2 * d - 2 ? i.x + i.w - d - 2 - c : i.x + d;
    t.fillText(e, g, m), l && (t.fillStyle = o.accent, t.fillRect(Math.min(g + c + 1, i.x + i.w - d), i.y + 4, 1.5, i.h - 8));
  } else
    t.fillStyle = o.textHeader, t.fillText("Filter…", i.x + d, m), l && (t.fillStyle = o.accent, t.fillRect(i.x + d, i.y + 4, 1.5, i.h - 8));
  t.restore(), u && (t.save(), t.font = _t(), t.textBaseline = "middle", t.textAlign = "center", t.fillStyle = o.textHeader, t.fillText("✕", u.x + u.w / 2, u.y + u.h / 2 + 1), t.restore());
}
function pl(t, n, e) {
  const l = t - 0.5, o = n - 0.5, s = Math.abs(e), i = (l * l + o * o) * s;
  if (e < 0) {
    const d = 0.5 * s, g = 1 / (1 - 2 * (0.5 * (1 + d) * d)), p = (l + l * (1 + i) * i * -1) * g, S = (o + o * (1 + i) * i * -1) * g;
    return [0.5 + p, 0.5 + S];
  }
  const u = l * (1 + i) * i, m = o * (1 + i) * i;
  return [t + u, n + m * 0.15];
}
function Hn(t, n, e, l, o, s = e, i = l) {
  const u = t / e, m = 1 - n / l, [d, c] = pl(u, m, o);
  return d < 0 || d > 1 || c < 0 || c > 1 ? [-1, -1] : [d * s, (1 - c) * i];
}
function tn(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function wl(t, n, e, l = 1) {
  return t >= n + e - 24 * l && t < n + e;
}
function Ln(t, n, e, l = 1) {
  const o = n + e;
  return t >= o - 6 * l && t <= o + 1 * l;
}
function Rn(t, n, e, l, o, s, i, u, m, d = !1, c) {
  const g = t + m;
  let p = -1, S = 0;
  for (let C = 0; C < e.length; C++) {
    if (g >= S && g < S + e[C].width) {
      p = C;
      break;
    }
    S += e[C].width;
  }
  if (n < Me) return { area: "header", colIdx: p, rowIdx: -1 };
  const L = d ? Yn : 0;
  if (L > 0 && n >= i - L)
    return { area: "agg", colIdx: p, rowIdx: -1 };
  const R = u * o;
  if (R > 0 && n >= i - R - L) {
    const C = Math.floor((n - (i - R - L)) / o);
    return { area: "pinned", colIdx: p, rowIdx: C };
  }
  const v = n - Me + s, h = c && c.length === l ? Bt(fn(c, l), v) : Math.floor(v / o);
  return h >= 0 && h < l ? { area: "body", colIdx: p, rowIdx: h } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function Ze(t) {
  return t / 45 * 0.55;
}
function zn(t) {
  const n = Math.abs(Ze(t));
  if (n === 0) return 1;
  if (t < 0) {
    const l = 0.5 * n;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * n;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const yl = 500, xl = yl / 2, bl = 1.6, zt = `
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
    uMouseUV: { value: new $.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: bl },
    uLensTint: { value: new $.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Ce = { x: -999, y: -999 };
function Nt(t, n, e, l, o) {
  const s = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = s && o > 0 ? xl / o : 0, t.uniforms.uAspect.value = o > 0 ? l / o : 1;
}
function Xt(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const Ml = ["value"], Sl = ["disabled"], Tl = ["disabled"], Cl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, kl = 28, Il = 600, Ll = /* @__PURE__ */ Qe({
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
    const e = t, l = n, o = P(e.rowData ?? []), s = P(e.pinnedBottomRowData ?? []), i = P(""), u = P(null), m = Zt({}), d = Zt({}), c = Zt(/* @__PURE__ */ new Set()), g = P(0), p = P(0), S = P(0), L = P(0), R = P(0), v = P(0), h = P(0), C = P(-1), D = P(null), O = P(null), T = P(null), y = { ...Ce }, k = P(""), U = P(0), K = P(null);
    let te = null;
    const le = P(!0);
    let q = null;
    G(T, (a) => {
      var f;
      q && (clearInterval(q), q = null), a ? (le.value = !0, q = setInterval(() => {
        le.value = !le.value, ye();
      }, 530), Be(() => {
        var x;
        return (x = K.value) == null ? void 0 : x.focus();
      })) : (te = null, (f = K.value) == null || f.blur()), ye();
    });
    function J(a) {
      return a.colId ?? a.field ?? (a.headerName ? a.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const N = ie(() => {
      const a = e.defaultColDef ?? {};
      return e.columnDefs.filter((f) => !c.has(J(f))).map((f) => {
        const x = J(f), E = { ...a, ...f };
        return { colId: x, colDef: E, width: d[x] ?? E.width ?? 100 };
      });
    }), X = ie(() => {
      const a = p.value;
      if (!a) return N.value;
      const f = N.value.reduce((I, A) => I + A.width, 0);
      if (!f || f >= a) return N.value;
      const x = a / f;
      let E = 0;
      return N.value.map((I, A) => {
        const fe = A === N.value.length - 1 ? a - E : Math.max(8, Math.round(I.width * x));
        return E += fe, { ...I, width: fe };
      });
    }), ue = ie(() => {
      const a = X.value.reduce((f, x) => f + x.width, 0);
      return Math.max(0, a - p.value);
    });
    let se = null;
    function oe() {
      if (typeof document > "u") return null;
      se || (se = document.createElement("canvas"));
      const a = se.getContext("2d");
      return a && (a.font = _t()), a;
    }
    const me = ie(() => X.value.some((a) => a.colDef.wrap)), r = ie(() => {
      if (!me.value) return null;
      const a = oe();
      if (!a) return null;
      const f = X.value.filter((E) => E.colDef.wrap), x = e.rowHeight;
      return ae.value.map((E) => {
        let I = 1;
        for (const A of f) {
          const z = Pn(a, he(A, E), Math.max(20, A.width - 16));
          z.length > I && (I = z.length);
        }
        return vl(I, x);
      });
    }), w = ie(
      () => r.value ? fn(r.value, ae.value.length) : null
    ), B = ie(
      () => w.value ? w.value[ae.value.length] : ae.value.length * e.rowHeight
    ), M = ie(() => {
      const a = s.value.length * e.rowHeight;
      return Math.max(0, S.value - Me - a);
    }), W = ie(
      () => Math.max(0, B.value - M.value)
    ), _ = ie(
      () => Math.max(1, Math.floor(M.value / e.rowHeight))
    ), Y = ie(() => {
      const a = ae.value.length;
      if (a === 0) return 0;
      const f = w.value ? Bt(w.value, v.value) : Math.floor(v.value / e.rowHeight);
      return Math.min(a - 1, f);
    }), j = ie(() => {
      const a = ae.value.length;
      return a === 0 ? 0 : w.value ? Math.min(a - 1, Bt(w.value, v.value + M.value - 1)) : Math.min(a - 1, Y.value + _.value - 1);
    });
    function Q(a, f) {
      if (f.colDef.valueGetter) return f.colDef.valueGetter({ data: a, colDef: f.colDef });
      if (f.colDef.field) return a[f.colDef.field];
    }
    function he(a, f) {
      const x = Q(f, a);
      return a.colDef.valueFormatter ? a.colDef.valueFormatter({ value: x, data: f, colDef: a.colDef }) ?? "" : a.colDef.cellRenderer ? (a.colDef.cellRenderer({ value: x, data: f, colDef: a.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function be(a, f) {
      return a.colDef.cellStyle ? typeof a.colDef.cellStyle == "function" ? a.colDef.cellStyle({ value: Q(f, a), data: f, colDef: a.colDef }) ?? {} : a.colDef.cellStyle : {};
    }
    const ae = ie(() => {
      g.value;
      let a = o.value;
      const f = i.value.trim().toLowerCase();
      f && (a = a.filter(
        (x) => N.value.some(
          (E) => String(Q(x, E) ?? "").toLowerCase().includes(f)
        )
      ));
      for (const [x, E] of Object.entries(m)) {
        if (!E) continue;
        const I = N.value.find((A) => A.colId === x);
        if (I)
          if (E.startsWith("__eq__")) {
            const A = E.slice(6).toLowerCase();
            a = a.filter((z) => String(Q(z, I) ?? "").toLowerCase() === A);
          } else {
            const A = E.toLowerCase();
            a = a.filter((z) => String(Q(z, I) ?? "").toLowerCase().includes(A));
          }
      }
      if (u.value) {
        const { colId: x, dir: E } = u.value, I = N.value.find((A) => A.colId === x);
        I && (a = [...a].sort((A, z) => {
          const fe = Q(A, I), re = Q(z, I);
          let pe = 0;
          return I.colDef.comparator ? pe = I.colDef.comparator(fe, re) : typeof fe == "number" && typeof re == "number" ? pe = fe - re : pe = String(fe ?? "").localeCompare(String(re ?? ""), void 0, { numeric: !0 }), E === "asc" ? pe : -pe;
        }));
      }
      return a;
    }), F = ie(() => {
      const a = N.value.filter((I) => I.colDef.aggFunc != null);
      if (a.length === 0) return null;
      const f = ae.value, x = {};
      for (const I of a) {
        const A = f.map((fe) => Q(fe, I)), z = hl(A, I.colDef.aggFunc);
        if (z == null) {
          x[I.colId] = "";
          continue;
        }
        x[I.colId] = I.colDef.aggValueFormatter ? I.colDef.aggValueFormatter(z) : String(z);
      }
      const E = a[0].colId;
      return x[E] === "" && (x[E] = "Σ"), x;
    });
    G(ae, () => {
      v.value = 0, D.value = null;
    }), G(ue, () => {
      h.value = Math.min(h.value, ue.value);
    }), G(W, () => {
      v.value = Math.min(v.value, W.value);
    });
    function V(a) {
      const f = w.value, x = f ? f[a] : a * e.rowHeight, E = f ? f[a + 1] : x + e.rowHeight;
      x < v.value ? v.value = x : E > v.value + M.value && (v.value = Math.min(W.value, E - M.value));
    }
    function ne() {
      v.value = Math.max(0, v.value - M.value), ye();
    }
    function xe() {
      v.value = Math.min(W.value, v.value + M.value), ye();
    }
    let we = !1, He = "", st = 0, ct = 0, nt = 1, Re = !1, Ee = !1, De = 0, Fe = 0, Ue = 0, ut = 0, Le = !1;
    function It(a, f, x = 1) {
      var E;
      we = !0, He = a, st = f, nt = x, ct = ((E = X.value.find((I) => I.colId === a)) == null ? void 0 : E.width) ?? 100, Re = !1;
    }
    function pt(a) {
      if (Ee) {
        const A = De - a.clientX, z = Fe - a.clientY;
        (Math.abs(A) > 4 || Math.abs(z) > 4) && (Le = !0), h.value = Math.max(0, Math.min(ue.value, Ue + A)), v.value = Math.max(0, Math.min(W.value, ut + z)), ye();
        return;
      }
      if (!we) return;
      const f = p.value, x = Math.max(30, ct + (a.clientX - st) * nt), E = N.value.filter((A) => A.colId !== He).reduce((A, z) => A + z.width, 0), I = f - x;
      I > 10 && (d[He] = Math.max(10, Math.round(x * E / I))), ye();
    }
    function Lt() {
      Ee && (Le && (Re = !0), Ee = !1), we && (we = !1, Re = !0, l("column-resized"));
    }
    function Ut(a) {
      if (a.touches.length !== 1) return;
      const f = a.touches[0];
      Ee = !0, Le = !1, De = f.clientX, Fe = f.clientY, Ue = h.value, ut = v.value;
    }
    function b(a) {
      if (!Ee || a.touches.length !== 1) return;
      a.preventDefault();
      const f = a.touches[0], x = De - f.clientX, E = Fe - f.clientY;
      (Math.abs(x) > 4 || Math.abs(E) > 4) && (Le = !0), h.value = Math.max(0, Math.min(ue.value, Ue + x)), v.value = Math.max(0, Math.min(W.value, ut + E)), ye();
    }
    function H() {
      Ee && (Le && (Re = !0), Ee = !1);
    }
    const Z = P(null), ee = P(null), $e = Ht("cathodeResetTick", P(0));
    G($e, () => dt());
    let ge = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), ce = null, Ae = !1;
    function lt() {
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
    let Gt, pn, ze, _e, ve;
    const Xn = `
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
    function wn() {
      if (!(!ee.value || !Z.value)) {
        ve = document.createElement("canvas");
        try {
          ce = new $.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          Ae = !0;
        }
        if (!Ae && !ce.getContext() && (ce.dispose(), ce = null, Ae = !0), Ae) {
          ft();
          return;
        }
        ce.setPixelRatio(1), ce.setClearColor(0, 0), Gt = new $.Scene(), pn = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), _e = new $.CanvasTexture(ve), _e.minFilter = $.LinearFilter, _e.magFilter = $.LinearFilter, ze = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: _e },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new $.Color(0) },
            ...Ot()
          },
          vertexShader: Cl,
          fragmentShader: Xn,
          transparent: !0
        }), Gt.add(new $.Mesh(new $.PlaneGeometry(2, 2), ze)), ft();
      }
    }
    function ft() {
      if (!Z.value || !ce && !Ae) return;
      const a = Z.value.clientWidth, f = Z.value.clientHeight - (e.pagination ? kl : 0);
      if (!a || !f) return;
      L.value = a, R.value = f;
      const x = e.bendField ? Math.round(a * zn(e.curvature)) : a;
      ge = Math.min(window.devicePixelRatio || 1, 2);
      const E = Math.round(x * ge), I = Math.round(f * ge), A = ve.width !== E || ve.height !== I;
      ve.width = E, ve.height = I, p.value = x, S.value = f, h.value = Math.max(0, Math.min(ue.value, h.value)), v.value = Math.max(0, Math.min(W.value, v.value)), ce ? (A && _e && (_e.dispose(), _e = new $.CanvasTexture(ve), _e.minFilter = $.LinearFilter, _e.magFilter = $.LinearFilter, ze && (ze.uniforms.uTex.value = _e)), ce.setPixelRatio(ge), ce.setSize(a, f)) : ee.value && (ee.value.width = Math.round(a * ge), ee.value.height = Math.round(f * ge), ee.value.style.width = a + "px", ee.value.style.height = f + "px"), ye();
    }
    function ye() {
      var x, E, I, A, z, fe, re, pe, We, bt, Mt, vt;
      if (!(ve != null && ve.width)) return;
      if (Ae) {
        if (!ee.value) return;
        In(ve, {
          cols: X.value,
          rows: ae.value,
          pinnedRows: s.value,
          rowHeight: e.rowHeight,
          rowHeights: r.value ?? void 0,
          scrollY: v.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = u.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((E = u.value) == null ? void 0 : E.dir) ?? null,
          colFilters: m,
          hoveredRow: C.value,
          selectedRow: ((I = D.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((A = D.value) == null ? void 0 : A.col) ?? -1,
          selectionAnchorRow: ((z = O.value) == null ? void 0 : z.row) ?? -1,
          selectionAnchorCol: ((fe = O.value) == null ? void 0 : fe.col) ?? -1,
          formatCell: he,
          getCellStyle: be,
          dpr: ge
        }), yn();
        const St = ee.value.getContext("2d");
        St && St.drawImage(ve, 0, 0, ve.width, ve.height, 0, 0, ee.value.width, ee.value.height);
        return;
      }
      if (!ce || !ze || !_e) return;
      const a = Ge[e.theme] ?? Ge.none, f = e.theme === "paper";
      ze.uniforms.uStrength.value = Ze(e.curvature), ze.uniforms.uScanlines.value = e.scanlines && !f ? 1 : 0, ze.uniforms.uVignette.value = f ? 0 : 1, ze.uniforms.uBezel.value.set(a.bg), Nt(ze, e.magnify, y, L.value || ve.width, R.value || ve.height), In(ve, {
        cols: X.value,
        rows: ae.value,
        pinnedRows: s.value,
        rowHeight: e.rowHeight,
        // Per-row variable heights for `wrap` columns — the MAIN WebGL path had drifted from
        // the fallback path (line ~669) and dropped this, so wrapped rows never grew on-screen.
        rowHeights: r.value ?? void 0,
        scrollY: v.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((re = u.value) == null ? void 0 : re.colId) ?? null,
        sortDir: ((pe = u.value) == null ? void 0 : pe.dir) ?? null,
        colFilters: m,
        hoveredRow: C.value,
        selectedRow: ((We = D.value) == null ? void 0 : We.row) ?? -1,
        selectedCol: ((bt = D.value) == null ? void 0 : bt.col) ?? -1,
        selectionAnchorRow: ((Mt = O.value) == null ? void 0 : Mt.row) ?? -1,
        selectionAnchorCol: ((vt = O.value) == null ? void 0 : vt.col) ?? -1,
        formatCell: he,
        getCellStyle: be,
        aggregateRow: F.value,
        dpr: ge
      }), yn(), _e.needsUpdate = !0, ce.render(Gt, pn);
    }
    function yn() {
      if (!T.value || !(ve != null && ve.width)) return;
      const a = ve.getContext("2d");
      if (!a) return;
      a.setTransform(ge, 0, 0, ge, 0, 0), te = ml(ve.width / ge, U.value, !!k.value);
      const f = Ge[e.theme] ?? Ge.none;
      gl(a, te, k.value, le.value, f);
    }
    function Kt(a, f) {
      if (!ee.value) return [-1, -1];
      const x = ee.value.getBoundingClientRect(), E = a - x.left, I = f - x.top, A = x.width, z = x.height, fe = Ze(e.curvature), [re, pe] = Hn(E, I, A, z, fe, ve.width / ge || A, ve.height / ge || z);
      return re < 0 ? [-1, -1] : [re, pe];
    }
    function Rt(a) {
      return Kt(a.clientX, a.clientY);
    }
    function ot(a) {
      if (!ee.value) return 1;
      const [f] = Kt(a.clientX - 4, a.clientY), [x] = Kt(a.clientX + 4, a.clientY);
      return f < 0 || x < 0 ? 1 : Math.max(1, Math.abs(x - f) / 8);
    }
    let jt = 0;
    function Un(a) {
      T.value = null;
      const f = Date.now();
      if (a.deltaX !== 0) {
        jt = f, h.value = Math.max(0, Math.min(ue.value, h.value + a.deltaX)), ye();
        return;
      }
      if (a.shiftKey && a.deltaY !== 0) {
        jt = f, h.value = Math.max(0, Math.min(ue.value, h.value + a.deltaY)), ye();
        return;
      }
      f - jt < Il || (v.value = Math.max(0, Math.min(W.value, v.value + a.deltaY)), ye());
    }
    function Gn(a) {
      if (we) return;
      if (e.magnify && ee.value) {
        const I = Xt(a, ee.value);
        y.x = I.x, y.y = I.y;
      }
      const [f, x] = Rt(a);
      if (f < 0) {
        C.value = -1, ye();
        return;
      }
      if (T.value && te) {
        const I = Dt(f, x, te, ot(a));
        if (I !== "outside") {
          C.value = -1, ee.value.style.cursor = I === "clear" ? "pointer" : "text", ye();
          return;
        }
      }
      const E = Rn(
        f,
        x,
        X.value,
        ae.value.length,
        e.rowHeight,
        v.value,
        S.value,
        s.value.length,
        h.value,
        F.value !== null,
        r.value ?? void 0
      );
      if (C.value = E.area === "body" ? E.rowIdx : -1, E.area === "header" && E.colIdx >= 0) {
        const I = X.value[E.colIdx], A = tn(E.colIdx, X.value), z = f + h.value;
        ee.value.style.cursor = I && Ln(z, A, I.width, ot(a)) ? "col-resize" : "pointer";
      } else E.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      ye();
    }
    function Kn() {
      C.value = -1, y.x = Ce.x, y.y = Ce.y, ye();
    }
    function jn(a) {
      const [f, x] = Rt(a);
      if (f < 0 || T.value && te && Dt(f, x, te, ot(a)) !== "outside") return;
      if (x >= Me) {
        Ee = !0, Le = !1, De = a.clientX, Fe = a.clientY, Ue = h.value, ut = v.value;
        return;
      }
      const E = f + h.value, I = ot(a);
      for (let A = 0; A < X.value.length; A++) {
        const z = X.value[A], fe = tn(A, X.value);
        if (z.colDef.resizable !== !1 && Ln(E, fe, z.width, I)) {
          It(z.colId, a.clientX, I);
          return;
        }
      }
    }
    function qn(a) {
      var I, A, z, fe;
      if (Re) {
        Re = !1;
        return;
      }
      if (we) return;
      const [f, x] = Rt(a);
      if (f < 0) {
        T.value = null;
        return;
      }
      if (T.value && te) {
        const re = Dt(f, x, te, ot(a));
        if (re === "clear") {
          bn();
          return;
        }
        if (re !== "outside") {
          (I = K.value) == null || I.focus();
          return;
        }
        T.value = null;
      }
      const E = Rn(
        f,
        x,
        X.value,
        ae.value.length,
        e.rowHeight,
        v.value,
        S.value,
        s.value.length,
        h.value,
        F.value !== null,
        r.value ?? void 0
      );
      if (E.area === "header" && E.colIdx >= 0) {
        const re = X.value[E.colIdx], pe = tn(E.colIdx, X.value), We = f + h.value;
        re.colDef.filter && wl(We, pe, re.width, ot(a)) ? (a.stopPropagation(), T.value === re.colId ? T.value = null : (T.value = re.colId, k.value = (A = m[re.colId]) != null && A.startsWith("__eq__") ? m[re.colId].slice(6) : m[re.colId] ?? "", U.value = Math.max(0, pe - h.value))) : re.colDef.sortable !== !1 && (T.value = null, u.value = ((z = u.value) == null ? void 0 : z.colId) === re.colId ? u.value.dir === "asc" ? { colId: re.colId, dir: "desc" } : null : { colId: re.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (T.value = null, E.area === "body" && E.rowIdx >= 0 && E.colIdx >= 0) {
        const re = E.rowIdx;
        a.shiftKey && D.value ? (O.value || (O.value = { ...D.value }), D.value = { row: re, col: E.colIdx }) : (D.value = { row: re, col: E.colIdx }, O.value = { row: re, col: E.colIdx }), (fe = ee.value) == null || fe.focus();
        const pe = ae.value[re], We = X.value[E.colIdx];
        pe && We && (l("row-clicked", { data: pe, event: a }), l("cell-selected", { data: pe, row: re, col: E.colIdx, colId: We.colId }));
      }
    }
    function xn(a) {
      if (T.value) {
        if (a.target === ee.value && te) {
          const [f, x] = Rt(a);
          if (f >= 0 && Dt(f, x, te, ot(a)) !== "outside") return;
        }
        T.value = null;
      }
    }
    function Zn(a) {
      var I;
      if (!p.value) return;
      let f = 0;
      for (let A = 0; A < a; A++) f += X.value[A].width;
      const x = ((I = X.value[a]) == null ? void 0 : I.width) ?? 0, E = f - h.value;
      E < 0 ? h.value = Math.max(0, f) : E + x > p.value && (h.value = Math.min(ue.value, f + x - p.value));
    }
    function Jn(a) {
      const x = X.value.length - 1, E = ae.value.length - 1;
      if (!D.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(a.key) && (a.preventDefault(), D.value = { row: Y.value, col: 0 }, O.value = { row: Y.value, col: 0 });
        return;
      }
      let { row: I, col: A } = D.value;
      const z = (fe, re, pe = !1) => {
        I = Math.max(0, Math.min(E, fe)), A = Math.max(0, Math.min(x, re)), D.value = { row: I, col: A }, pe || (O.value = { row: I, col: A }), V(I), Zn(A);
      };
      switch (a.key) {
        case "ArrowDown":
          a.preventDefault(), z(I + 1, A, a.shiftKey);
          break;
        case "ArrowUp":
          a.preventDefault(), z(I - 1, A, a.shiftKey);
          break;
        case "ArrowRight":
          a.preventDefault(), a.shiftKey ? z(I, A + 1, !0) : A < x ? z(I, A + 1) : z(I + 1, 0);
          break;
        case "ArrowLeft":
          a.preventDefault(), a.shiftKey ? z(I, A - 1, !0) : A > 0 ? z(I, A - 1) : z(I - 1, x);
          break;
        case "Tab":
          a.preventDefault(), a.shiftKey ? A > 0 ? z(I, A - 1) : z(I - 1, x) : A < x ? z(I, A + 1) : z(I + 1, 0);
          break;
        case "Enter":
          a.preventDefault(), a.shiftKey ? z(I - 1, A) : z(I + 1, A);
          break;
        case "Home":
          a.preventDefault(), a.ctrlKey || a.metaKey ? z(0, 0, a.shiftKey) : z(I, 0, a.shiftKey);
          break;
        case "End":
          a.preventDefault(), a.ctrlKey || a.metaKey ? z(E, x, a.shiftKey) : z(I, x, a.shiftKey);
          break;
        case "PageDown":
          a.preventDefault(), z(Math.min(E, I + _.value), A, a.shiftKey);
          break;
        case "PageUp":
          a.preventDefault(), z(Math.max(0, I - _.value), A, a.shiftKey);
          break;
        case "Escape":
          D.value = null, O.value = null;
          break;
        case "c":
        case "C":
          (a.ctrlKey || a.metaKey) && (a.preventDefault(), Qn());
          break;
      }
    }
    function Qn() {
      var pe;
      if (!D.value) return;
      const a = X.value, f = ae.value, x = O.value ?? D.value, E = Math.min(x.row, D.value.row), I = Math.max(x.row, D.value.row), A = Math.min(x.col, D.value.col), z = Math.max(x.col, D.value.col), fe = [];
      for (let We = E; We <= I; We++) {
        const bt = f[We];
        if (!bt) continue;
        const Mt = [];
        for (let vt = A; vt <= z; vt++) {
          const St = a[vt];
          St && Mt.push(he(St, bt).replace(/[\t\r\n]+/g, " "));
        }
        fe.push(Mt.join("	"));
      }
      const re = fe.join(`
`);
      (pe = navigator.clipboard) == null || pe.writeText(re).catch(() => {
      });
    }
    function el(a) {
      const f = a.target.value;
      k.value = f, f ? m[T.value] = f : delete m[T.value], l("filter-changed");
    }
    function bn() {
      T.value && delete m[T.value], k.value = "", T.value = null, l("filter-changed");
    }
    const tl = {
      setGridOption(a, f) {
        a === "rowData" ? o.value = f : a === "pinnedBottomRowData" ? s.value = f : a === "quickFilterText" && (i.value = f);
      },
      getColumnState() {
        return e.columnDefs.map((a) => {
          var x, E;
          const f = J(a);
          return {
            colId: f,
            hide: c.has(f),
            sort: ((x = u.value) == null ? void 0 : x.colId) === f ? u.value.dir : null,
            sortIndex: ((E = u.value) == null ? void 0 : E.colId) === f ? 0 : null,
            width: d[f] ?? a.width
          };
        });
      },
      applyColumnState({ state: a }) {
        for (const f of a)
          f.hide === !0 && c.add(f.colId), f.hide === !1 && c.delete(f.colId), f.sort && (u.value = { colId: f.colId, dir: f.sort }), f.width && (d[f.colId] = f.width);
      },
      setFilterModel(a) {
        for (const f of Object.keys(m)) delete m[f];
        if (a)
          for (const [f, x] of Object.entries(a))
            (x == null ? void 0 : x.type) === "equals" ? m[f] = `__eq__${x.filter}` : x != null && x.filter && (m[f] = x.filter);
      },
      getFilterModel() {
        const a = {};
        for (const [f, x] of Object.entries(m))
          x && (a[f] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return a;
      },
      async setColumnFilterModel(a, f) {
        f ? f.type === "equals" ? m[a] = `__eq__${f.filter}` : m[a] = f.filter ?? "" : delete m[a];
      },
      onFilterChanged() {
      },
      refreshCells() {
        g.value++;
      },
      exportDataAsCsv({ fileName: a = "export.csv" } = {}) {
        const f = N.value, x = f.map((z) => z.colDef.headerName ?? z.colId).join(","), E = ae.value.map(
          (z) => f.map((fe) => `"${String(he(fe, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[x, ...E].join(`
`)], { type: "text/csv" }), A = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: A, download: a }).click(), URL.revokeObjectURL(A);
      },
      resize() {
        ft();
      },
      resetColumnState() {
        c.clear();
        for (const f of e.columnDefs)
          f.hide && c.add(J(f));
        const a = e.columnDefs.find((f) => f.sort);
        u.value = a ? { colId: J(a), dir: a.sort } : null;
        for (const f of Object.keys(d)) delete d[f];
        for (const f of Object.keys(m)) delete m[f];
        i.value = "", v.value = 0, D.value = null, T.value = null;
      }
    };
    G(
      [ae, () => s.value, X, v, C, D],
      () => Be(ye)
    ), G(() => e.theme, () => ye()), G(() => [e.curvature, e.bendField], () => Be(ft)), G(() => e.scanlines, () => ye()), G(() => e.glow, () => ye()), G(() => e.magnify, (a) => {
      a || (y.x = Ce.x, y.y = Ce.y), ye();
    }), G(D, (a) => {
      if (!a) return;
      const f = ae.value[a.row], x = X.value[a.col];
      f && x && l("cell-selected", { data: f, row: a.row, col: a.col, colId: x.colId });
    });
    let wt = null, yt = null, qt = 0;
    function dt() {
      cancelAnimationFrame(qt), qt = requestAnimationFrame(ft);
    }
    function Mn(a) {
      a.preventDefault();
    }
    function Sn() {
      ce == null || ce.dispose(), ce = null, Ae = !1, wn();
    }
    Ne(() => {
      for (const a of e.columnDefs)
        a.hide && c.add(J(a)), a.sort && !u.value && (u.value = { colId: J(a), dir: a.sort });
      o.value = e.rowData ?? [], s.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", xn), document.addEventListener("mousemove", pt), document.addEventListener("mouseup", Lt), Be(() => {
        var a;
        wn(), ee.value && (ee.value.addEventListener("webglcontextlost", Mn), ee.value.addEventListener("webglcontextrestored", Sn)), Z.value && (wt = new ResizeObserver(() => ft()), wt.observe(Z.value), yt = new IntersectionObserver((f) => {
          f.some((x) => x.isIntersecting) && dt();
        }), yt.observe(Z.value)), window.addEventListener("resize", dt), (a = window.visualViewport) == null || a.addEventListener("resize", dt), l("grid-ready", { api: tl });
      });
    }), et(() => {
      var a, f, x;
      document.removeEventListener("click", xn, !0), document.removeEventListener("mousemove", pt), document.removeEventListener("mouseup", Lt), (a = ee.value) == null || a.removeEventListener("webglcontextlost", Mn), (f = ee.value) == null || f.removeEventListener("webglcontextrestored", Sn), wt == null || wt.disconnect(), yt == null || yt.disconnect(), window.removeEventListener("resize", dt), (x = window.visualViewport) == null || x.removeEventListener("resize", dt), cancelAnimationFrame(qt), lt();
    });
    const xt = ie(() => Ge[e.theme] ?? Ge.none), nl = ie(() => ({
      background: xt.value.headerBg,
      borderTop: `1px solid ${xt.value.border}`,
      color: xt.value.text
    })), ll = ie(() => ({
      background: xt.value.bg
    })), Tn = ie(() => xt.value.accent);
    return (a, f) => {
      var x, E;
      return Se(), Te("div", {
        ref_key: "wrapEl",
        ref: Z,
        class: "cathode-wrap",
        style: Ke(ll.value)
      }, [
        de("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: at(Un, ["prevent"]),
          onMousemove: Gn,
          onMouseleave: Kn,
          onMousedown: jn,
          onClick: qn,
          onKeydown: Jn,
          onTouchstartPassive: Ut,
          onTouchmove: b,
          onTouchend: H,
          onTouchcancel: H
        }, null, 544),
        T.value ? (Se(), Te("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: K,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: k.value,
          autofocus: "",
          onInput: el,
          onKeydown: [
            Cn(bn, ["escape"]),
            f[0] || (f[0] = Cn((I) => T.value = null, ["enter"]))
          ]
        }, null, 40, Ml)) : Oe("", !0),
        t.pagination ? (Se(), Te("div", {
          key: 1,
          class: "cathode-pagination",
          style: Ke(nl.value)
        }, [
          de("button", {
            disabled: v.value <= 0,
            onClick: f[1] || (f[1] = (I) => ne())
          }, "◀", 8, Sl),
          de("span", null, Ve((Y.value + 1).toLocaleString()) + "–" + Ve(Math.min(ae.value.length, j.value + 1).toLocaleString()) + " / " + Ve(ae.value.length.toLocaleString()), 1),
          de("button", {
            disabled: v.value >= W.value,
            onClick: f[2] || (f[2] = (I) => xe())
          }, "▶", 8, Tl),
          de("span", {
            class: "cathode-page-info",
            style: Ke({ color: Tn.value })
          }, Ve(ae.value.length.toLocaleString()) + " rows ", 5),
          D.value ? (Se(), Te("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Ke({ color: Tn.value })
          }, Ve(((x = X.value[D.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((E = X.value[D.value.col]) == null ? void 0 : E.colId)) + " : " + Ve(he(X.value[D.value.col], ae.value[D.value.row])), 5)) : Oe("", !0)
        ], 4)) : Oe("", !0)
      ], 4);
    };
  }
}), tt = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, o] of n)
    e[l] = o;
  return e;
}, Ho = /* @__PURE__ */ tt(Ll, [["__scopeId", "data-v-ff5f851c"]]), Wt = {
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
function Rl(t, n) {
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
const El = 12, ke = 18, kt = 10, rt = 6, dn = `${El}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Dl(t, n, e) {
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
    const s = o.split(/(\s+)/);
    let i = "";
    for (const u of s) {
      const m = i + u;
      if (t.measureText(m).width <= e)
        i = m;
      else if (i && (l.push(i.replace(/\s+$/, "")), i = ""), t.measureText(u).width > e) {
        let d = "";
        for (const c of u)
          t.measureText(d + c).width > e ? (d && l.push(d), d = c) : d += c;
        i = d;
      } else
        i = u.replace(/^\s+/, "");
    }
    i && l.push(i.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Vn(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), o = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${o}`;
  }
  return t;
}
function Fl(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function Al(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: o, wordWrap: s } = t, i = t.formatTs ?? Vn;
  e.font = dn;
  const u = [];
  for (let m = 0; m < n.length; m++) {
    const d = n[m], c = d.level ?? "info", g = o && d.ts != null ? i(d.ts) : "", p = s ? Dl(e, d.text, l) : d.text.split(`
`);
    for (let S = 0; S < p.length; S++)
      u.push({
        entryIdx: m,
        text: p[S],
        level: c,
        timestamp: S === 0 ? g : "",
        isFirstFrag: S === 0,
        widthPx: e.measureText(p[S]).width
      });
  }
  return u;
}
function En(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, o = t.height, s = Wt[n.theme] ?? Wt.none;
  e.clearRect(0, 0, l, o), e.fillStyle = s.bg, e.fillRect(0, 0, l, o), e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip(), e.font = dn, e.textBaseline = "middle";
  const i = n.visualLines, u = kt - n.scrollX, m = (n.showTimestamps ? kt + n.timestampWidth : kt) - n.scrollX, d = Math.max(0, Math.floor((n.scrollY - rt) / ke)), c = Math.min(i.length, Math.ceil((n.scrollY + o - rt) / ke) + 1);
  for (let g = d; g < c; g++) {
    const p = i[g], S = rt + g * ke - n.scrollY + ke / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = s.rowAlt;
      let R = 1;
      for (; g + R < c && i[g + R].entryIdx === p.entryIdx; ) R++;
      e.fillRect(0, S - ke / 2, l, ke * R);
    }
    n.selectionStart >= 0 && g >= n.selectionStart && g <= n.selectionEnd && (e.fillStyle = s.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, S - ke / 2, l, ke)), g === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - ke / 2, l, ke)), n.showTimestamps && p.timestamp && (e.fillStyle = s.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = s.timestamp), e.fillText(p.timestamp, u, S), e.shadowBlur = 0);
    const L = Rl(s, p.level);
    e.fillStyle = L, e.textAlign = "left", n.glow ? (e.shadowColor = L, e.shadowBlur = 14, e.fillText(p.text, m, S), e.shadowBlur = 7, e.fillText(p.text, m, S), e.shadowBlur = 3, e.fillText(p.text, m, S), e.shadowBlur = 0) : e.fillText(p.text, m, S);
  }
  e.restore();
}
function Dn(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - rt) / ke);
  return l < 0 || l >= e ? -1 : l;
}
function _l(t) {
  return rt * 2 + t * ke;
}
const Bl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Wl = /* @__PURE__ */ Qe({
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
    const e = t, l = P(null), o = P(null), s = { ...Ce }, i = P(0), u = P(0), m = P(0), d = P(-1), c = P(!0), g = P(-1), p = P(-1), S = ie(() => {
      const b = e.entries ?? [];
      return e.maxLines > 0 && b.length > e.maxLines ? b.slice(b.length - e.maxLines) : b;
    }), L = ie(() => {
      if (!e.showTimestamps) return "";
      const b = e.formatTs ?? Vn;
      let H = "00:00:00";
      for (const Z of S.value) {
        if (Z.ts == null) continue;
        const ee = b(Z.ts);
        ee.length > H.length && (H = ee);
      }
      return H;
    }), R = P(0), v = P([]);
    function h() {
      if (!N) return;
      const b = N.getContext("2d");
      if (!b) return;
      b.font = dn;
      const H = e.showTimestamps ? Fl(b, L.value) : 0;
      R.value = H;
      const Z = Math.max(
        1,
        i.value - kt * 2 - H
      );
      v.value = Al({
        entries: S.value,
        ctx: b,
        textMaxWidth: Z,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const C = ie(() => _l(v.value.length)), D = ie(() => Math.max(0, C.value - u.value)), O = ie(() => {
      let b = 0;
      for (const H of v.value) H.widthPx > b && (b = H.widthPx);
      return kt * 2 + R.value + b;
    }), T = ie(() => Math.max(0, O.value - i.value)), y = P(0);
    G(D, () => {
      c.value ? m.value = D.value : m.value = Math.min(m.value, D.value);
    }), G(T, () => {
      y.value = Math.min(y.value, T.value);
    }), G(
      [S, i, () => e.showTimestamps, () => e.wordWrap, L],
      () => {
        h(), Be(oe);
      },
      { deep: !1 }
    );
    let k = null, U = !1;
    function K() {
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
    let te, le, q, J, N;
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
      if (!(!o.value || !l.value)) {
        N = document.createElement("canvas");
        try {
          k = new $.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          U = !0;
        }
        if (!U && !k.getContext() && (k.dispose(), k = null, U = !0), U) {
          se();
          return;
        }
        k.setPixelRatio(1), k.setClearColor(0, 0), te = new $.Scene(), le = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), J = new $.CanvasTexture(N), J.minFilter = $.LinearFilter, J.magFilter = $.LinearFilter, q = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: J },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: Bl,
          fragmentShader: X,
          transparent: !0
        }), te.add(new $.Mesh(new $.PlaneGeometry(2, 2), q)), se();
      }
    }
    function se() {
      if (!l.value || !k && !U) return;
      const b = l.value.clientWidth, H = l.value.clientHeight;
      if (!b || !H) return;
      const Z = N.width !== b || N.height !== H;
      Z && (N.width = b, N.height = H, i.value = b, u.value = H, h(), k ? (Z && J && (J.dispose(), J = new $.CanvasTexture(N), J.minFilter = $.LinearFilter, J.magFilter = $.LinearFilter, q && (q.uniforms.uTex.value = J)), k.setPixelRatio(window.devicePixelRatio || 1), k.setSize(b, H)) : o.value && (o.value.width = b, o.value.height = H, o.value.style.width = b + "px", o.value.style.height = H + "px"), c.value && (m.value = Math.max(0, C.value - u.value)), oe());
    }
    function oe() {
      if (!(N != null && N.width)) return;
      if (U) {
        if (!o.value) return;
        En(N, {
          visualLines: v.value,
          scrollY: m.value,
          scrollX: y.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: R.value,
          hoveredLine: d.value,
          selectionStart: Math.min(g.value, p.value),
          selectionEnd: Math.max(g.value, p.value)
        });
        const H = o.value.getContext("2d");
        H && H.drawImage(N, 0, 0);
        return;
      }
      if (!k || !q || !J) return;
      const b = e.theme === "paper";
      q.uniforms.uStrength.value = Ze(e.curvature), q.uniforms.uScanlines.value = e.scanlines && !b ? 1 : 0, q.uniforms.uVignette.value = b ? 0 : 1, Nt(q, e.magnify, s, N.width, N.height), En(N, {
        visualLines: v.value,
        scrollY: m.value,
        scrollX: y.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: R.value,
        hoveredLine: d.value,
        selectionStart: Math.min(g.value, p.value),
        selectionEnd: Math.max(g.value, p.value)
      }), J.needsUpdate = !0, k.render(te, le);
    }
    G(() => e.theme, () => oe()), G(() => e.curvature, () => oe()), G(() => e.scanlines, () => oe()), G(() => e.glow, () => oe()), G(() => e.magnify, (b) => {
      b || (s.x = Ce.x, s.y = Ce.y), oe();
    }), G(m, () => oe()), G(y, () => oe()), G(d, () => oe()), G([g, p], () => oe());
    function me(b) {
      if (!o.value) return [-1, -1];
      const H = o.value.getBoundingClientRect();
      return [b.clientX - H.left, b.clientY - H.top];
    }
    function r(b) {
      m.value = Math.max(0, Math.min(D.value, b)), c.value = m.value >= D.value - 4;
    }
    function w(b) {
      y.value = Math.max(0, Math.min(T.value, b));
    }
    function B(b) {
      b.shiftKey ? w(y.value + b.deltaY) : Math.abs(b.deltaX) > Math.abs(b.deltaY) ? w(y.value + b.deltaX) : r(m.value + b.deltaY);
    }
    let M = !1, W = 0, _ = 0, Y = 0, j = 0, Q = !1;
    function he(b) {
      M = !0, Q = !1, W = b.clientX, _ = b.clientY, Y = y.value, j = m.value, l.value && l.value.focus();
    }
    function be(b) {
      if (M) {
        const H = W - b.clientX, Z = _ - b.clientY;
        (Math.abs(H) > 4 || Math.abs(Z) > 4) && (Q = !0), w(Y + H), r(j + Z);
      }
    }
    function ae() {
      M && (M = !1, Q && (Q = !1));
    }
    function F(b) {
      if (b.touches.length !== 1) return;
      const H = b.touches[0];
      M = !0, Q = !1, W = H.clientX, _ = H.clientY, Y = y.value, j = m.value, l.value && l.value.focus();
    }
    function V(b) {
      if (!M || b.touches.length !== 1) return;
      b.preventDefault();
      const H = b.touches[0], Z = W - H.clientX, ee = _ - H.clientY;
      (Math.abs(Z) > 4 || Math.abs(ee) > 4) && (Q = !0), w(Y + Z), r(j + ee);
    }
    function ne() {
      M && (M = !1, Q && (Q = !1));
    }
    function xe(b) {
      const [, H] = me(b);
      return H < 0 ? -1 : Dn(H, m.value, v.value.length);
    }
    function we(b) {
      if (Q) {
        Q = !1;
        return;
      }
      const H = xe(b);
      if (H < 0) {
        g.value = -1, p.value = -1;
        return;
      }
      b.shiftKey && g.value >= 0 || (g.value = H), p.value = H;
    }
    function He(b, H) {
      const Z = v.value.length;
      if (Z === 0) return;
      const ee = p.value < 0 ? 0 : p.value;
      let $e = Math.max(0, Math.min(Z - 1, ee + b));
      p.value = $e, (!H || g.value < 0) && (g.value = $e), d.value = $e;
      const ge = rt + $e * ke, ce = ge + ke;
      ge < m.value ? r(ge) : ce > m.value + u.value && r(ce - u.value);
    }
    function st() {
      const b = Math.min(g.value, p.value), H = Math.max(g.value, p.value);
      if (b < 0) return "";
      const Z = v.value, ee = /* @__PURE__ */ new Set(), $e = [];
      for (let ge = b; ge <= H && ge < Z.length; ge++) {
        const ce = Z[ge];
        if (ee.has(ce.entryIdx)) continue;
        ee.add(ce.entryIdx);
        let Ae = "";
        for (let lt = 0; lt < Z.length; lt++)
          Z[lt].entryIdx === ce.entryIdx && (Ae += (Ae && !Z[lt].isFirstFrag ? " " : "") + Z[lt].text);
        $e.push(ce.timestamp ? `${ce.timestamp}  ${Ae}` : Ae);
      }
      return $e.join(`
`);
    }
    async function ct() {
      const b = st();
      if (b)
        try {
          await navigator.clipboard.writeText(b);
        } catch {
          const H = document.createElement("textarea");
          H.value = b, H.style.position = "fixed", H.style.opacity = "0", document.body.appendChild(H), H.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(H);
        }
    }
    function nt(b) {
      if ((b.metaKey || b.ctrlKey) && (b.key === "c" || b.key === "C")) {
        g.value >= 0 && (b.preventDefault(), ct());
        return;
      }
      if ((b.metaKey || b.ctrlKey) && (b.key === "a" || b.key === "A")) {
        b.preventDefault(), g.value = 0, p.value = v.value.length - 1;
        return;
      }
      switch (b.key) {
        case "ArrowDown":
          b.preventDefault(), He(1, b.shiftKey);
          break;
        case "ArrowUp":
          b.preventDefault(), He(-1, b.shiftKey);
          break;
        case "ArrowRight":
          b.preventDefault(), w(y.value + ke * 2);
          break;
        case "ArrowLeft":
          b.preventDefault(), w(y.value - ke * 2);
          break;
        case "PageDown":
          b.preventDefault(), r(m.value + u.value);
          break;
        case "PageUp":
          b.preventDefault(), r(m.value - u.value);
          break;
        case "Home":
          b.preventDefault(), r(0), w(0);
          break;
        case "End":
          b.preventDefault(), r(D.value);
          break;
        case "Escape":
          g.value = -1, p.value = -1;
          break;
      }
    }
    function Re(b) {
      if (e.magnify && o.value) {
        const Z = Xt(b, o.value);
        s.x = Z.x, s.y = Z.y, oe();
      }
      const [, H] = me(b);
      if (H < 0) {
        d.value = -1;
        return;
      }
      d.value = Dn(H, m.value, v.value.length);
    }
    function Ee() {
      d.value = -1, s.x = Ce.x, s.y = Ce.y, oe();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        c.value = !0, m.value = D.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(b) {
        r(rt + b * ke);
      }
    });
    let De = null, Fe = null, Ue = 0;
    const ut = Ht("cathodeResetTick", P(0));
    G(ut, () => Le());
    function Le() {
      cancelAnimationFrame(Ue), Ue = requestAnimationFrame(se);
    }
    function It(b) {
      b.preventDefault();
    }
    function pt() {
      k == null || k.dispose(), k = null, U = !1, ue();
    }
    Ne(() => {
      document.addEventListener("mousemove", be), document.addEventListener("mouseup", ae), Be(() => {
        var b;
        ue(), o.value && (o.value.addEventListener("webglcontextlost", It), o.value.addEventListener("webglcontextrestored", pt)), l.value && (De = new ResizeObserver(() => se()), De.observe(l.value), Fe = new IntersectionObserver((H) => {
          H.some((Z) => Z.isIntersecting) && Le();
        }), Fe.observe(l.value)), window.addEventListener("resize", Le), (b = window.visualViewport) == null || b.addEventListener("resize", Le), m.value = D.value;
      });
    }), et(() => {
      var b, H, Z;
      document.removeEventListener("mousemove", be), document.removeEventListener("mouseup", ae), (b = o.value) == null || b.removeEventListener("webglcontextlost", It), (H = o.value) == null || H.removeEventListener("webglcontextrestored", pt), De == null || De.disconnect(), Fe == null || Fe.disconnect(), window.removeEventListener("resize", Le), (Z = window.visualViewport) == null || Z.removeEventListener("resize", Le), cancelAnimationFrame(Ue), K();
    });
    const Lt = ie(() => Wt[e.theme] ?? Wt.none), Ut = ie(() => ({
      background: Lt.value.bg
    }));
    return (b, H) => (Se(), Te("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Ke(Ut.value),
      tabindex: "0",
      onKeydown: nt
    }, [
      de("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-log-canvas",
        onWheel: at(B, ["prevent"]),
        onMousemove: Re,
        onMouseleave: Ee,
        onMousedown: he,
        onClick: we,
        onTouchstartPassive: F,
        onTouchmove: V,
        onTouchend: ne,
        onTouchcancel: ne
      }, null, 544)
    ], 36));
  }
}), Pl = /* @__PURE__ */ tt(Wl, [["__scopeId", "data-v-d6dc9e79"]]), Yl = ["disabled"], Hl = /* @__PURE__ */ Qe({
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
    const l = t, o = e, s = P(null), i = P(null), u = P(""), m = P([]), d = P(-1);
    let c = "";
    function g(T) {
      T.trim() && (m.value.length && m.value[m.value.length - 1] === T || (m.value.push(T), m.value.length > l.historyLimit && m.value.splice(0, m.value.length - l.historyLimit)));
    }
    function p(T) {
      if (!l.disabled) {
        if (T.key === "Enter") {
          T.preventDefault();
          const y = u.value;
          y.trim() && g(y), d.value = -1, u.value = "", o("submit", y);
          return;
        }
        if (T.key === "ArrowUp") {
          if (!m.value.length) return;
          T.preventDefault(), d.value === -1 ? (c = u.value, d.value = m.value.length - 1) : d.value > 0 && d.value--, u.value = m.value[d.value];
          return;
        }
        if (T.key === "ArrowDown") {
          if (d.value === -1) return;
          T.preventDefault(), d.value < m.value.length - 1 ? (d.value++, u.value = m.value[d.value]) : (d.value = -1, u.value = c, c = "");
          return;
        }
      }
    }
    const S = P(!0);
    let L = null;
    function R() {
      L || (L = setInterval(() => {
        S.value = !S.value;
      }, 530));
    }
    function v() {
      L && (clearInterval(L), L = null), S.value = !0;
    }
    const h = ie(() => {
      let T;
      return l.disabled ? T = " " : l.busy ? T = "█" : T = S.value ? "█" : " ", { level: "info", text: `${l.prompt}${u.value}${T}` };
    }), C = ie(
      () => [...l.entries, h.value]
    );
    function D() {
      var T;
      l.disabled || (T = i.value) == null || T.focus();
    }
    G(() => l.busy, (T, y) => {
      y && !T && !l.disabled && Be(() => {
        var k;
        return (k = i.value) == null ? void 0 : k.focus();
      });
    });
    function O() {
      var T;
      (T = i.value) == null || T.focus();
    }
    return n({ focus: O }), Ne(() => {
      R(), l.disabled || requestAnimationFrame(() => {
        var T;
        return (T = i.value) == null ? void 0 : T.focus();
      });
    }), et(() => {
      v();
    }), (T, y) => (Se(), Te("div", {
      ref_key: "wrapEl",
      ref: s,
      class: "cathode-terminal-wrap",
      onClick: D
    }, [
      _n(Pl, {
        entries: C.value,
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
      Bn(de("input", {
        ref_key: "inputEl",
        ref: i,
        "onUpdate:modelValue": y[0] || (y[0] = (k) => u.value = k),
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
        [ol, u.value]
      ])
    ], 512));
  }
}), zo = /* @__PURE__ */ tt(Hl, [["__scopeId", "data-v-a2b39934"]]), gt = {
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
}, zl = 0.18, Tt = 8, vn = 22, Vl = 4, Ye = 8, qe = 56, hn = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", $l = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", nn = 4, Ol = 1, Nl = 1;
function Xl(t, n, e, l = 0, o = !1) {
  const s = o ? hn : qe, i = Math.max(0, n - Ye - s), u = Math.max(1, Math.floor(i / e)), m = Math.min(u, t);
  return { firstIdx: Math.max(0, t - m - Math.floor(l / e)), count: m, slotW: e };
}
function Ul(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, o = -1 / 0, s = 0;
  const i = Math.min(t.length, n + e);
  for (let m = n; m < i; m++) {
    const d = t[m];
    d && (d.low < l && (l = d.low), d.high > o && (o = d.high), d.volume > s && (s = d.volume));
  }
  if (!isFinite(l) || !isFinite(o) || l === o) {
    const m = isFinite(l) ? l : 0;
    return { min: m - 1, max: m + 1, maxVol: Math.max(1, s) };
  }
  const u = (o - l) * 0.04;
  return { min: l - u, max: o + u, maxVol: Math.max(1, s) };
}
function Gl(t, n, e = !1) {
  const l = e ? Vl : vn, o = Math.max(1, t - Tt - l - nn), s = Math.max(0, Math.round(o * n)), i = o - s;
  return {
    priceY0: Tt,
    priceY1: Tt + i,
    volumeY0: Tt + i + nn,
    volumeY1: Tt + i + nn + s
  };
}
function Pe(t, n, e, l) {
  const o = n.max - n.min;
  return o <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / o) * (l - e);
}
function Je(t, n, e) {
  return Ye + (t - n + 0.5) * e;
}
function je(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function mn(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), o = String(n.getHours()).padStart(2, "0"), s = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${o}:${s}`;
}
function Kl(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), o = e / l;
  let s;
  return o < 1.5 ? s = 1 : o < 3 ? s = 2 : o < 7 ? s = 5 : s = 10, s * l;
}
function sn(t, n) {
  var L, R, v, h, C;
  const e = t.getContext("2d");
  if (!e) return;
  const l = n.dpr && n.dpr > 0 ? n.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const o = t.width / l, s = t.height / l, i = gt[n.theme] ?? gt.none, u = n.colors ? { ...i, ...n.colors } : i, m = !!n.compact;
  if (e.clearRect(0, 0, o, s), e.fillStyle = u.bg, e.fillRect(0, 0, o, s), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, o, s), e.clip();
  const d = Xl(n.candles.length, o, n.slotW, n.scrollX, m), c = Ul(n.candles, d.firstIdx, d.count), g = Gl(s, n.showVolume ? n.volumeFraction : 0, m), p = Math.max(Ol, Math.floor(n.slotW * 0.7)), S = Math.min(n.candles.length, d.firstIdx + d.count);
  for (let D = d.firstIdx; D < S; D++) {
    const O = n.candles[D];
    if (!O) continue;
    const T = Je(D, d.firstIdx, n.slotW), y = Pe(O.open, c, g.priceY0, g.priceY1), k = Pe(O.close, c, g.priceY0, g.priceY1), U = Pe(O.high, c, g.priceY0, g.priceY1), K = Pe(O.low, c, g.priceY0, g.priceY1), te = O.close >= O.open, le = te ? u.wickBull : u.wickBear, q = te ? u.candleBull : u.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = q), e.strokeStyle = le, e.lineWidth = Nl, e.beginPath(), e.moveTo(Math.round(T) + 0.5, U), e.lineTo(Math.round(T) + 0.5, K), e.stroke(), e.fillStyle = q;
    const J = Math.min(y, k), N = Math.max(1, Math.abs(k - y)), X = Math.round(T - p / 2), ue = Math.round(J), se = Math.round(N);
    if (e.fillRect(X, ue, p, se), n.glow && (e.shadowBlur = 4, e.fillRect(X, ue, p, se)), e.shadowBlur = 0, n.showVolume && c.maxVol > 0) {
      const oe = Math.round(O.volume / c.maxVol * (g.volumeY1 - g.volumeY0));
      oe > 0 && (e.fillStyle = te ? u.volumeBull : u.volumeBear, e.fillRect(
        Math.round(T - p / 2),
        g.volumeY1 - oe,
        p,
        oe
      ));
    }
  }
  if ((L = n.overlays) != null && L.length) {
    const D = { above: 0, below: 0 }, O = n.overlays.filter((y) => y.kind !== "hline" && !!y.label).length, T = O ? 14 + 14 * O + 12 : 8;
    for (const y of n.overlays)
      y.kind === "hline" ? ql(e, y, o, c, g, u, m, D, T) : jl(e, y, d, c, g, n.slotW);
  }
  (R = n.markers) != null && R.length && oo(e, u, n.markers, n.candles, d, c, g, n.slotW), ao(e, u, c, g, o, m), m || (ro(e, u, n.candles, d, n.slotW, s), no(e, u, n.candles, o, s)), (v = n.overlays) != null && v.length && Jl(e, u, n.overlays, g), n.hover && (io(e, u, n.candles, d, c, g, n.slotW, n.hover, o), Ql(e, u, n.candles, d, n.slotW, n.hover, g, ((h = n.overlays) == null ? void 0 : h.length) ?? 0), (C = n.markers) != null && C.length && to(e, u, n.markers, n.candles, d, c, g, n.slotW, n.hover, o)), e.restore();
}
function jl(t, n, e, l, o, s) {
  var u;
  const i = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ye,
    o.priceY0,
    /* width: */
    999999,
    o.priceY1 - o.priceY0
  ), t.clip(), n.kind === "line")
    Ft(t, n.data, e.firstIdx, i, s, l, o, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else if (n.kind === "band") {
    const m = $n(n.color, n.fillAlpha ?? 0.08);
    Zl(t, n.upper, n.lower, e.firstIdx, i, s, l, o, m), Ft(t, n.upper, e.firstIdx, i, s, l, o, n.color, 1, !1), Ft(t, n.lower, e.firstIdx, i, s, l, o, n.color, 1, !1), (u = n.middle) != null && u.length && Ft(t, n.middle, e.firstIdx, i, s, l, o, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function ql(t, n, e, l, o, s, i, u = { above: 0, below: 0 }, m = 8) {
  const d = Pe(n.price, l, o.priceY0, o.priceY1), c = d < o.priceY0 - 0.5, g = d > o.priceY1 + 0.5, p = c || g, S = p ? c ? u.above++ : u.below++ : 0, L = p ? c ? o.priceY0 + m + S * 20 : o.priceY1 - 8 - S * 20 : d, R = i ? hn : qe, v = Math.round(L) + 0.5;
  t.save(), p || (t.strokeStyle = n.color, t.lineWidth = n.lineWidth ?? 1, t.setLineDash(n.dashed === !1 ? [] : [4, 3]), t.beginPath(), t.moveTo(Ye, v), t.lineTo(e - R, v), t.stroke(), t.setLineDash([]));
  let h = n.label ?? je(n.price);
  if (p && h !== "" && (h = (c ? "↑ " : "↓ ") + h), h !== "") {
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const C = t.measureText(h).width, D = 4, O = 2, T = Ye + 2;
    t.fillStyle = n.color, p && (t.globalAlpha = 0.85), t.fillRect(T, L - 7 - O, C + D * 2, 14 + O * 2), t.globalAlpha = 1, t.fillStyle = s.bg && !s.bg.startsWith("rgba(0,0,0,0)") ? s.bg : "#0d1520", t.fillText(h, T + D, L);
  }
  t.restore();
}
function Ft(t, n, e, l, o, s, i, u, m, d) {
  if (!n || !n.length) return;
  t.strokeStyle = u, t.lineWidth = m, t.setLineDash(d ? [4, 3] : []), t.beginPath();
  let c = !1;
  for (let g = e; g < l; g++) {
    const p = n[g];
    if (typeof p != "number" || !isFinite(p)) {
      c && (t.stroke(), t.beginPath(), c = !1);
      continue;
    }
    const S = Je(g, e, o), L = Pe(p, s, i.priceY0, i.priceY1);
    c ? t.lineTo(S, L) : (t.moveTo(S, L), c = !0);
  }
  c && t.stroke(), t.setLineDash([]);
}
function Zl(t, n, e, l, o, s, i, u, m) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = m;
  let d = !1, c = -1;
  for (let g = l; g <= o; g++) {
    const p = n[g], S = e[g], L = g < o && typeof p == "number" && typeof S == "number" && isFinite(p) && isFinite(S);
    if (L && !d && (c = g, d = !0), !L && d || g === o && d) {
      const R = L ? g + 1 : g;
      t.beginPath();
      for (let v = c; v < R; v++) {
        const h = Je(v, l, s), C = Pe(n[v], i, u.priceY0, u.priceY1);
        v === c ? t.moveTo(h, C) : t.lineTo(h, C);
      }
      for (let v = R - 1; v >= c; v--) {
        const h = Je(v, l, s), C = Pe(e[v], i, u.priceY0, u.priceY1);
        t.lineTo(h, C);
      }
      t.closePath(), t.fill(), d = !1;
    }
  }
}
function $n(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), o = parseInt(t.slice(3, 5), 16), s = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${o},${s},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Jl(t, n, e, l) {
  const o = e.filter((R) => R.kind !== "hline" && !!R.label);
  if (!o.length) return;
  t.save(), t.font = Xe;
  const s = 8, i = 5, u = 12, m = 6, d = 14;
  let c = 0;
  for (const R of o) {
    const v = t.measureText(R.label).width;
    v > c && (c = v);
  }
  const g = s * 2 + u + m + c, p = i * 2 + d * o.length, S = Ye + 4, L = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(S, L, g, p), t.textBaseline = "middle", t.textAlign = "left";
  for (let R = 0; R < o.length; R++) {
    const v = o[R], h = L + i + d * (R + 0.5), C = S + s;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(C, h), t.lineTo(C + u, h), t.stroke(), t.setLineDash([])) : v.kind === "band" && (t.fillStyle = $n(v.color, v.fillAlpha ?? 0.2), t.fillRect(C, h - 4, u, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(C + 0.5, h - 4 + 0.5, u - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, C + u + m, h);
  }
  t.restore();
}
function Ql(t, n, e, l, o, s, i, u) {
  const m = Math.floor((s.x - Ye) / o), d = l.firstIdx + m;
  if (d < 0 || d >= e.length) return;
  const c = e[d];
  if (!c) return;
  const g = c.close - c.open, p = c.open !== 0 ? g / c.open * 100 : 0, S = g >= 0 ? "+" : "", L = [
    ["O", je(c.open), void 0],
    ["H", je(c.high), void 0],
    ["L", je(c.low), void 0],
    ["C", je(c.close), void 0],
    ["V", eo(c.volume), void 0],
    ["", `${S}${p.toFixed(2)}%`, g >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const R = 8, v = 4, h = 14;
  let C = R;
  for (const [y, k] of L) {
    const U = y ? `${y} ${k}` : k, K = t.measureText(U).width + 12;
    C += K;
  }
  C += R - 12;
  const D = i.priceY0 + 4 + (u > 0 ? v * 2 + 14 * u + 4 : 0), O = Ye + 4;
  t.fillStyle = n.panelBg, t.fillRect(O, D, C, h + v * 2);
  let T = O + R;
  for (let y = 0; y < L.length; y++) {
    const [k, U, K] = L[y];
    t.fillStyle = n.text, k && (t.globalAlpha = 0.6, t.fillText(k + " ", T, D + v + h / 2), t.globalAlpha = 1, T += t.measureText(k + " ").width), K && (t.fillStyle = K), t.fillText(U, T, D + v + h / 2), T += t.measureText(U).width + 12;
  }
  t.restore();
}
function eo(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function to(t, n, e, l, o, s, i, u, m, d) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, g = Math.max(1, c * 0.5), p = Math.min(l.length, o.firstIdx + o.count), S = 9;
  let L = null;
  for (const U of e) {
    let K = 0, te = l.length - 1, le = -1;
    for (; K <= te; ) {
      const N = K + te >> 1, X = l[N].start - U.timestamp;
      if (Math.abs(X) <= g) {
        le = N;
        break;
      }
      X < 0 ? K = N + 1 : te = N - 1;
    }
    if (le < 0 || le < o.firstIdx || le >= p) continue;
    const q = Je(le, o.firstIdx, u), J = Pe(U.price, s, i.priceY0, i.priceY1);
    if (Math.abs(m.x - q) <= S && Math.abs(m.y - J) <= S) {
      L = { m: U, x: q, y: J };
      break;
    }
  }
  if (!L) return;
  const R = mn(L.m.timestamp), v = [
    `${L.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${R}`,
    `@ ${je(L.m.price)}`
  ];
  L.m.label && v.push(L.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const h = 6, C = 14;
  let D = 0;
  for (const U of v) {
    const K = t.measureText(U).width;
    K > D && (D = K);
  }
  const O = D + h * 2, T = v.length * C + h * 2;
  let y = L.x + 12;
  y + O > d - qe && (y = L.x - 12 - O);
  let k = L.y - T / 2;
  k < i.priceY0 && (k = i.priceY0), k + T > i.priceY1 && (k = i.priceY1 - T), t.fillStyle = n.panelBgSolid, t.strokeStyle = L.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(y, k, O, T), t.strokeRect(y + 0.5, k + 0.5, O - 1, T - 1);
  for (let U = 0; U < v.length; U++) {
    const K = v[U];
    t.fillStyle = U === 0 ? L.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(K, y + h, k + h + U * C);
  }
  t.restore();
}
function no(t, n, e, l, o) {
  if (e.length < 2) return;
  const s = e[1].start - e[0].start, i = lo(s);
  if (!i) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const u = 6, m = 3, d = t.measureText(i).width, c = l - qe - u, g = o - vn + 4;
  t.fillStyle = n.accent, t.fillRect(c - d - u, g - m, d + u * 2, 14 + m * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(i, c, g), t.restore();
}
function lo(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, o = 24 * l, s = 7 * o;
  return t >= s && t % s === 0 ? t / s + "W" : t >= o && t % o === 0 ? t / o + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function oo(t, n, e, l, o, s, i, u) {
  if (!l.length) return;
  const m = l.length > 1 ? l[1].start - l[0].start : 6e4, d = Math.max(1, m * 0.5), c = Math.min(l.length, o.firstIdx + o.count), g = (S) => {
    let L = 0, R = l.length - 1;
    for (; L <= R; ) {
      const v = L + R >> 1, h = l[v].start - S;
      if (Math.abs(h) <= d) return v;
      h < 0 ? L = v + 1 : R = v - 1;
    }
    return -1;
  }, p = 7;
  for (const S of e) {
    const L = g(S.timestamp);
    if (L < 0 || L < o.firstIdx || L >= c) continue;
    const R = Je(L, o.firstIdx, u), v = Pe(S.price, s, i.priceY0, i.priceY1);
    if (v < i.priceY0 || v > i.priceY1) continue;
    const h = S.color ?? (S.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = h, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(R, v - p), t.lineTo(R - p, v + p - 1), t.lineTo(R + p, v + p - 1)) : (t.moveTo(R, v + p), t.lineTo(R - p, v - p + 1), t.lineTo(R + p, v - p + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function ao(t, n, e, l, o, s = !1) {
  const i = e.max - e.min;
  if (i <= 0) return;
  const u = l.priceY1 - l.priceY0, m = s ? Math.max(2, Math.min(4, Math.round(u / 36))) : 6, d = Kl(i, m), c = Math.ceil(e.min / d) * d, g = s ? hn : qe;
  t.font = s ? $l : Xe, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let p = c; p <= e.max; p += d) {
    const S = Pe(p, e, l.priceY0, l.priceY1);
    S < l.priceY0 || S > l.priceY1 || (t.beginPath(), t.moveTo(Ye, Math.round(S) + 0.5), t.lineTo(o - g, Math.round(S) + 0.5), t.stroke(), t.fillText(je(p), o - g + 3, S));
  }
  t.globalAlpha = 1;
}
function ro(t, n, e, l, o, s) {
  if (l.count <= 0 || !e.length) return;
  const u = Math.max(1, Math.floor(l.count / 6));
  t.font = Xe, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const m = Math.min(e.length, l.firstIdx + l.count);
  for (let d = l.firstIdx; d < m; d += u) {
    const c = e[d];
    if (!c) continue;
    const g = Je(d, l.firstIdx, o);
    t.fillText(mn(c.start), g, s - vn + 4);
  }
  t.globalAlpha = 1;
}
function io(t, n, e, l, o, s, i, u, m) {
  const d = Math.floor((u.x - Ye) / i), c = Math.max(0, Math.min(e.length - 1, l.firstIdx + d)), g = e[c];
  if (!g) return;
  const p = Je(c, l.firstIdx, i);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(p) + 0.5, s.priceY0), t.lineTo(Math.round(p) + 0.5, s.volumeY1 || s.priceY1), t.stroke();
  const S = Math.max(s.priceY0, Math.min(s.priceY1, u.y));
  t.beginPath(), t.moveTo(Ye, Math.round(S) + 0.5), t.lineTo(m - qe, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const L = o.max - o.min;
  if (L > 0) {
    const h = o.max - (S - s.priceY0) / (s.priceY1 - s.priceY0) * L, C = je(h);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const D = t.measureText(C).width, O = 4, T = 2;
    t.fillStyle = n.accent, t.fillRect(m - qe + 2, S - 7 - T, D + O * 2, 14 + T * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(C, m - qe + 2 + O, S);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const R = mn(g.start), v = t.measureText(R).width;
  t.fillStyle = n.accent, t.fillRect(p - v / 2 - 4, s.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(R, p, s.volumeY1 + 4), t.restore();
}
const ln = 0.25, on = 6, so = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, co = /* @__PURE__ */ Qe({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: zl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = P(null), l = P(null), o = { ...Ce }, s = P(0), i = P(0), u = P(0), m = P(1), d = P(null), c = ie(() => Math.max(1, n.slotW * m.value));
    let g = null, p = !1;
    function S() {
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
    let L, R, v, h, C;
    const D = `
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
    function O() {
      if (!(!l.value || !e.value)) {
        if (C = document.createElement("canvas"), n.flat) {
          p = !0, T();
          return;
        }
        try {
          g = new $.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          p = !0;
        }
        if (!p && !g.getContext() && (g.dispose(), g = null, p = !0), p) {
          T();
          return;
        }
        g.setPixelRatio(1), g.setClearColor(0, 0), L = new $.Scene(), R = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new $.CanvasTexture(C), h.minFilter = $.LinearFilter, h.magFilter = $.LinearFilter, v = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: so,
          fragmentShader: D,
          transparent: !0
        }), L.add(new $.Mesh(new $.PlaneGeometry(2, 2), v)), T();
      }
    }
    function T() {
      if (!e.value || !g && !p) return;
      const F = e.value.clientWidth, V = e.value.clientHeight;
      !F || !V || !(C.width !== F || C.height !== V) || (C.width = F, C.height = V, s.value = F, i.value = V, g ? (h && (h.dispose(), h = new $.CanvasTexture(C), h.minFilter = $.LinearFilter, h.magFilter = $.LinearFilter, v && (v.uniforms.uTex.value = h)), g.setPixelRatio(window.devicePixelRatio || 1), g.setSize(F, V)) : l.value && (l.value.width = F, l.value.height = V, l.value.style.width = F + "px", l.value.style.height = V + "px"), y());
    }
    function y() {
      if (!(C != null && C.width)) return;
      if (p) {
        if (!l.value) return;
        sn(C, {
          candles: n.candles,
          slotW: c.value,
          scrollX: u.value,
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
        const V = l.value.getContext("2d");
        V && (V.clearRect(0, 0, l.value.width, l.value.height), V.drawImage(C, 0, 0));
        return;
      }
      if (!g || !v || !h) return;
      const F = n.theme === "paper";
      v.uniforms.uStrength.value = Ze(n.curvature), v.uniforms.uScanlines.value = n.scanlines && !F ? 1 : 0, v.uniforms.uVignette.value = F ? 0 : 1, Nt(v, n.magnify, o, C.width, C.height), sn(C, {
        candles: n.candles,
        slotW: c.value,
        scrollX: u.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: d.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), h.needsUpdate = !0, g.render(L, R);
    }
    G(() => n.theme, () => y()), G(() => n.curvature, () => y()), G(() => n.scanlines, () => y()), G(() => n.glow, () => y()), G(() => n.showVolume, () => y()), G(() => n.volumeFraction, () => y()), G(() => n.slotW, () => y()), G(() => n.candles, () => y(), { deep: !1 }), G(() => n.overlays, () => y(), { deep: !1 }), G(() => n.markers, () => y(), { deep: !1 }), G(() => n.compact, () => y()), G(() => n.magnify, (F) => {
      F || (o.x = Ce.x, o.y = Ce.y), y();
    }), G(() => n.colors, () => y(), { deep: !0 }), G(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), G(u, () => y()), G(m, () => y()), G(d, () => y()), G(c, () => y());
    let k = null, U = null, K = 0;
    const te = Ht("cathodeResetTick", P(0));
    G(te, () => le());
    function le() {
      cancelAnimationFrame(K), K = requestAnimationFrame(T);
    }
    function q(F) {
      F.preventDefault();
    }
    function J() {
      g == null || g.dispose(), g = null, p = !1, O();
    }
    function N(F) {
      if (!l.value) return [-1, -1];
      const V = l.value.getBoundingClientRect();
      return [F.clientX - V.left, F.clientY - V.top];
    }
    function X(F) {
      var He;
      const V = c.value;
      if (V <= 0) return 0;
      const ne = ((He = n.candles) == null ? void 0 : He.length) ?? 0, xe = Math.max(1, Math.floor((s.value || 1) / V)), we = Math.max(0, ne - xe);
      return Math.max(0, Math.min(F, we * V));
    }
    function ue(F) {
      var xe;
      if (F.deltaX !== 0 || F.shiftKey && F.deltaY !== 0) {
        const we = F.deltaX !== 0 ? F.deltaX : F.deltaY;
        u.value = X(u.value + we);
        return;
      }
      if (F.deltaY === 0) return;
      const [V] = N(F), ne = c.value;
      if (V >= 0 && ne > 0 && ((xe = n.candles) != null && xe.length)) {
        const we = Math.max(1, Math.floor((s.value || 1) / ne)), st = Math.max(0, n.candles.length - we - Math.floor(u.value / ne)) + (V - 8) / ne, ct = Math.exp(-F.deltaY * 15e-4), nt = Math.max(ln, Math.min(on, m.value * ct));
        m.value = nt;
        const Re = n.slotW * nt, Ee = Math.max(1, Math.floor((s.value || 1) / Re)), De = st - (V - 8) / Re, Fe = Math.max(0, n.candles.length - Ee - De);
        u.value = X(Fe * Re);
      } else {
        const we = Math.exp(-F.deltaY * 15e-4);
        m.value = Math.max(ln, Math.min(on, m.value * we));
      }
    }
    let se = !1, oe = 0, me = 0;
    function r(F) {
      F.button === 0 && (se = !0, oe = F.clientX, me = u.value, d.value = null, e.value && e.value.focus());
    }
    function w(F) {
      const V = Math.exp(F * 0.18);
      m.value = Math.max(ln, Math.min(on, m.value * V)), u.value = X(u.value);
    }
    function B(F) {
      const V = c.value, ne = F.shiftKey ? 20 : 3;
      switch (F.key) {
        case "ArrowLeft":
          F.preventDefault(), u.value = X(u.value + V * ne);
          break;
        case "ArrowRight":
          F.preventDefault(), u.value = X(u.value - V * ne);
          break;
        case "ArrowUp":
          F.preventDefault(), w(1);
          break;
        case "ArrowDown":
          F.preventDefault(), w(-1);
          break;
        case "Home":
          F.preventDefault(), u.value = X(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          F.preventDefault(), u.value = 0;
          break;
      }
    }
    function M(F) {
      if (se) {
        const V = F.clientX - oe;
        u.value = X(me + V);
        return;
      }
    }
    function W() {
      se = !1;
    }
    function _(F) {
      if (F.touches.length !== 1) return;
      const V = F.touches[0];
      se = !0, oe = V.clientX, me = u.value, d.value = null;
    }
    function Y(F) {
      if (!se || F.touches.length !== 1) return;
      F.preventDefault();
      const ne = F.touches[0].clientX - oe;
      u.value = X(me + ne);
    }
    function j() {
      se = !1;
    }
    function Q(F) {
      if (n.magnify && l.value) {
        const xe = Xt(F, l.value);
        o.x = xe.x, o.y = xe.y, y();
      }
      if (se) return;
      const [V, ne] = N(F);
      if (V < 0 || ne < 0) {
        d.value = null;
        return;
      }
      d.value = { x: V, y: ne };
    }
    function he() {
      d.value = null, o.x = Ce.x, o.y = Ce.y, y();
    }
    Ne(() => {
      document.addEventListener("mousemove", M), document.addEventListener("mouseup", W), Be(() => {
        var F;
        O(), l.value && (l.value.addEventListener("webglcontextlost", q), l.value.addEventListener("webglcontextrestored", J)), e.value && (k = new ResizeObserver(() => T()), k.observe(e.value), U = new IntersectionObserver((V) => {
          V.some((ne) => ne.isIntersecting) && le();
        }), U.observe(e.value)), window.addEventListener("resize", le), (F = window.visualViewport) == null || F.addEventListener("resize", le);
      });
    }), et(() => {
      var F, V, ne;
      document.removeEventListener("mousemove", M), document.removeEventListener("mouseup", W), (F = l.value) == null || F.removeEventListener("webglcontextlost", q), (V = l.value) == null || V.removeEventListener("webglcontextrestored", J), k == null || k.disconnect(), U == null || U.disconnect(), window.removeEventListener("resize", le), (ne = window.visualViewport) == null || ne.removeEventListener("resize", le), cancelAnimationFrame(K), S();
    });
    const be = ie(() => gt[n.theme] ?? gt.none), ae = ie(() => ({
      background: be.value.bg
    }));
    return (F, V) => (Se(), Te("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Ke(ae.value),
      tabindex: "0",
      onKeydown: B
    }, [
      de("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: at(ue, ["prevent"]),
        onMousedown: r,
        onMousemove: Q,
        onMouseleave: he,
        onTouchstartPassive: _,
        onTouchmove: Y,
        onTouchend: j,
        onTouchcancel: j
      }, null, 544)
    ], 36));
  }
}), Vo = /* @__PURE__ */ tt(co, [["__scopeId", "data-v-7c334778"]]), ht = 22, Ct = 6, uo = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, fo = /* @__PURE__ */ Qe({
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
    const e = t, l = n, o = P(null), s = P(null), i = P(-1), u = P(0), m = { ...Ce };
    let d = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), c = null, g = !1;
    function p() {
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
    let S, L, R, v, h;
    const C = P(0), D = P(0), O = `
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
    function T() {
      if (!(!s.value || !o.value)) {
        h = document.createElement("canvas");
        try {
          c = new $.WebGLRenderer({ canvas: s.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          g = !0;
        }
        if (!g && !c.getContext() && (c.dispose(), c = null, g = !0), g) {
          y();
          return;
        }
        c.setPixelRatio(d), c.setClearColor(0, 0), S = new $.Scene(), L = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new $.CanvasTexture(h), v.minFilter = $.LinearFilter, v.magFilter = $.LinearFilter, R = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Ot()
          },
          vertexShader: uo,
          fragmentShader: O,
          transparent: !0
        }), S.add(new $.Mesh(new $.PlaneGeometry(2, 2), R)), y();
      }
    }
    function y() {
      if (!o.value || !c && !g) return;
      const r = o.value.clientWidth, w = o.value.clientHeight;
      if (!r || !w) return;
      C.value = r, D.value = w, d = Math.min(window.devicePixelRatio || 1, 2);
      const B = e.bendField ? Math.round(r * zn(e.curvature)) : r, M = Math.round(B * d), W = Math.round(w * d), _ = h.width !== M || h.height !== W;
      h.width = M, h.height = W, c ? (_ && v && (v.dispose(), v = new $.CanvasTexture(h), v.minFilter = $.LinearFilter, v.magFilter = $.LinearFilter, R.uniforms.uTex.value = v), c.setPixelRatio(d), c.setSize(r, w)) : s.value && (s.value.width = Math.round(r * d), s.value.height = Math.round(w * d), s.value.style.width = r + "px", s.value.style.height = w + "px"), q();
    }
    function k() {
      const r = (h == null ? void 0 : h.width) || 0, w = Math.max(1, Math.floor(r / e.minCellW)), B = Math.floor(r / w), M = Math.round(B * e.cellAspect), W = ht + M + Ct;
      return { rects: e.cells.map((Y, j) => ({
        x: j % w * B,
        y: Math.floor(j / w) * W - u.value,
        w: B,
        h: W
      })), rowH: W, totalH: Math.ceil(e.cells.length / w) * W, cols: w };
    }
    const U = () => {
      const { totalH: r } = k();
      return Math.max(0, r - ((h == null ? void 0 : h.height) || 0));
    }, K = /* @__PURE__ */ new Map();
    function te(r, w, B) {
      const M = r.candles[r.candles.length - 1], W = `${w}x${B}@${d}|${r.candles.length}|${M ? M.start + ":" + M.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, _ = K.get(r.id);
      if (_ && _.key === W) return _.canvas;
      const Y = (_ == null ? void 0 : _.canvas) ?? document.createElement("canvas");
      Y.width = Math.round(w * d), Y.height = Math.round(B * d);
      const j = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, r.candles.length))), Q = w < 260 && r.overlays ? r.overlays.map((he) => ({ ...he, label: "" })) : r.overlays;
      return sn(Y, {
        candles: r.candles,
        slotW: j,
        scrollX: Math.max(0, r.candles.length * j - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: Q,
        compact: !0,
        colors: e.colors,
        dpr: d
      }), K.set(r.id, { canvas: Y, key: W }), Y;
    }
    const le = ie(() => ({ ...gt[e.theme] ?? gt.none, ...e.colors ?? {} }));
    function q() {
      var M;
      if (!(h != null && h.width)) return;
      const r = h.getContext("2d");
      if (!r) return;
      const w = le.value;
      r.setTransform(1, 0, 0, 1, 0, 0), r.clearRect(0, 0, h.width, h.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (r.fillStyle = w.bg, r.fillRect(0, 0, h.width, h.height)), r.setTransform(d, 0, 0, d, 0, 0);
      const { rects: B } = k();
      r.font = "600 11px ui-monospace, SFMono-Regular, monospace", r.textBaseline = "middle";
      for (let W = 0; W < e.cells.length; W++) {
        const _ = e.cells[W], Y = B[W];
        if (Y.y + Y.h < 0 || Y.y > h.height / d) continue;
        const j = Y.x + Ct / 2, Q = Y.w - Ct;
        r.strokeStyle = _.open ? w.candleBull : w.gridline, r.lineWidth = W === i.value ? 2 : 1, r.strokeRect(j + 0.5, Y.y + 0.5, Q - 1, Y.h - Ct - 1), r.save(), r.beginPath(), r.rect(j, Y.y, Q, ht), r.clip();
        const he = Y.y + ht / 2 + 1, be = _.note ? r.measureText(_.note).width + (_.open ? 22 : 12) : _.open ? 16 : 0, ae = _.badge ? r.measureText(_.badge).width + 6 : 0, F = Q - 14 - ae - be;
        let V = _.title;
        if (r.measureText(V).width > F) {
          for (; V.length > 1 && r.measureText(V + "…").width > F; ) V = V.slice(0, -1);
          V += "…";
        }
        let ne = j + 7;
        r.fillStyle = w.text, r.textAlign = "left", r.fillText(V, ne, he), ne += r.measureText(V).width + 6, _.badge && (r.fillStyle = w.accent, r.fillText(_.badge, ne, he)), _.note && (r.textAlign = "right", r.fillStyle = _.noteColor || w.accent, r.fillText(_.note, j + Q - (_.open ? 16 : 7), he), r.textAlign = "left"), r.restore(), _.open && (r.fillStyle = w.candleBull, r.beginPath(), r.arc(j + Q - 9, Y.y + ht / 2 + 1, 3, 0, Math.PI * 2), r.fill());
        const xe = Y.y + ht, we = Y.h - ht - Ct;
        _.candles.length ? r.drawImage(te(_, Q - 2, we - 1), j + 1, xe, Q - 2, we - 1) : (r.fillStyle = w.accent, r.textAlign = "center", r.fillText("· · ·", j + Q / 2, xe + we / 2), r.textAlign = "left");
      }
      if (g) {
        const W = (M = s.value) == null ? void 0 : M.getContext("2d");
        W && s.value && W.drawImage(h, 0, 0, h.width, h.height, 0, 0, s.value.width, s.value.height);
        return;
      }
      !c || !R || !v || (R.uniforms.uStrength.value = Ze(e.curvature), R.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, R.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Nt(R, e.magnify, m, C.value || h.width, D.value || h.height), v.needsUpdate = !0, c.render(S, L));
    }
    function J(r) {
      if (!s.value) return [-1, -1];
      const w = s.value.getBoundingClientRect();
      return Hn(
        r.clientX - w.left,
        r.clientY - w.top,
        w.width,
        w.height,
        Ze(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((h == null ? void 0 : h.width) || w.width) / d,
        ((h == null ? void 0 : h.height) || w.height) / d
      );
    }
    function N(r, w) {
      if (r < 0) return -1;
      const { rects: B } = k();
      return B.findIndex((M) => r >= M.x && r < M.x + M.w && w >= M.y && w < M.y + M.h);
    }
    function X(r) {
      const [w, B] = J(r), M = N(w, B);
      M >= 0 && l("cell-click", e.cells[M].id);
    }
    function ue(r) {
      if (e.magnify && s.value) {
        const W = Xt(r, s.value);
        m.x = W.x, m.y = W.y;
      }
      const [w, B] = J(r), M = N(w, B);
      M !== i.value ? (i.value = M, q()) : e.magnify && q(), s.value && (s.value.style.cursor = M >= 0 ? "pointer" : "default");
    }
    function se() {
      i.value = -1, m.x = Ce.x, m.y = Ce.y, q();
    }
    function oe(r) {
      const w = U();
      w <= 0 || (r.preventDefault(), u.value = Math.max(0, Math.min(w, u.value + r.deltaY)), q());
    }
    let me = null;
    return Ne(() => {
      T(), me = new ResizeObserver(() => y()), o.value && me.observe(o.value);
    }), et(() => {
      me == null || me.disconnect(), p(), K.clear();
    }), G(() => [e.curvature, e.bendField], () => Be(y)), G(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      u.value = Math.min(u.value, U()), q();
    }, { deep: !1 }), (r, w) => (Se(), Te("div", {
      ref_key: "wrapEl",
      ref: o,
      class: "cathode-candle-grid-wrap"
    }, [
      de("canvas", {
        ref_key: "canvasEl",
        ref: s,
        onClick: X,
        onMousemove: ue,
        onMouseleave: se,
        onWheel: oe
      }, null, 544)
    ], 512));
  }
}), $o = /* @__PURE__ */ tt(fo, [["__scopeId", "data-v-9f2b24f8"]]), gn = P(0), cn = 28, mt = 12;
let un = 10, Pt = "cathode.layout", Yt = !1;
const Ie = P({});
function vo(t, n = "cathode.layout") {
  if (!Yt) {
    Yt = !0, Pt = n;
    try {
      const e = localStorage.getItem(Pt);
      if (e) {
        Ie.value = JSON.parse(e), Fn();
        return;
      }
    } catch {
    }
    Ie.value = { ...t }, Fn();
  }
}
function Fn() {
  let t = 10;
  for (const n of Object.values(Ie.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  un = t;
}
function it() {
  localStorage.setItem(Pt, JSON.stringify(Ie.value));
}
function ho(t) {
  Yt = !1, localStorage.removeItem(Pt), Ie.value = { ...t }, it(), Yt = !0, gn.value++;
}
function On(t) {
  un++, Ie.value[t] && (Ie.value[t].zIndex = un);
}
function mo(t, n) {
  Ie.value[t].visible = n, it();
}
function go(t, n) {
  Ie.value[t].minimized = n, n && (Ie.value[t].maximized = !1), it();
}
function po(t, n) {
  Ie.value[t].maximized = n, n && (Ie.value[t].minimized = !1, On(t)), it();
}
function wo(t, n, e) {
  Ie.value[t].x = Math.round(n), Ie.value[t].y = Math.round(e), it();
}
function yo(t, n, e) {
  Ie.value[t].w = Math.round(n), Ie.value[t].h = Math.round(e), it();
}
function Oo(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), o = Math.ceil(e.length / l), s = Math.floor((t - mt * (l + 1)) / l), i = Math.floor((n - mt * (o + 1)) / o), u = {};
  return e.forEach((m, d) => {
    const c = d % l, g = Math.floor(d / l);
    u[m] = {
      x: mt + c * (s + mt),
      y: mt + g * (i + mt),
      w: s,
      h: i,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: d + 1
    };
  }), u;
}
function Nn() {
  return {
    containers: Ie,
    TITLEBAR_H: cn,
    load: vo,
    save: it,
    reset: ho,
    bringToFront: On,
    setVisible: mo,
    setMinimized: go,
    setMaximized: po,
    updatePos: wo,
    updateSize: yo
  };
}
const xo = { class: "ws-toolbar" }, bo = {
  key: 0,
  class: "ws-restore-menu"
}, Mo = {
  key: 0,
  class: "ws-restore-empty"
}, So = ["onClick"], To = /* @__PURE__ */ Qe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: o, setVisible: s } = Nn(), i = P(null);
    kn("cathodeWorkspace", i), kn("cathodeResetTick", gn), Ne(() => {
      if (!i.value) return;
      const { clientWidth: v, clientHeight: h } = i.value, C = n.initialLayout ?? {};
      l(C, n.storageKey ?? "cathode.layout");
      const D = Object.keys(e.value)[0];
      D && u(D);
    });
    function u(v) {
      var C;
      document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused"));
      const h = (C = i.value) == null ? void 0 : C.querySelector(`#cc-${v}`);
      h && h.classList.add("cc-focused");
    }
    function m() {
      !i.value || !n.initialLayout || o(n.initialLayout);
    }
    function d(v) {
      const h = v.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((C) => C.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const c = P(!1), g = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function p(v) {
      s(v, !0), c.value = !1;
    }
    function S(v) {
      if (!c.value) return;
      const h = v.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (c.value = !1);
    }
    function L(v) {
      v.key === "Escape" && (c.value = !1);
    }
    Ne(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", L);
    }), et(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", L);
    });
    function R(v) {
      var h;
      return ((h = n.containerTitles) == null ? void 0 : h[v]) ?? v;
    }
    return (v, h) => (Se(), Te("div", {
      ref_key: "workspaceEl",
      ref: i,
      class: "cathode-workspace",
      onMousedown: d
    }, [
      an(v.$slots, "default", {}, void 0, !0),
      an(v.$slots, "overlay", {}, void 0, !0),
      de("div", xo, [
        t.initialLayout ? (Se(), Te("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: m
        }, " ↺ Reset Layout ")) : Oe("", !0),
        h[1] || (h[1] = de("div", { class: "ws-sep" }, null, -1)),
        de("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (C) => c.value = !c.value)
        }, " ⊞ Restore Panel ")
      ]),
      _n(al, { name: "menu" }, {
        default: rl(() => [
          c.value ? (Se(), Te("div", bo, [
            h[3] || (h[3] = de("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            g().length ? Oe("", !0) : (Se(), Te("div", Mo, " No closed panels ")),
            (Se(!0), Te(il, null, sl(g(), (C) => (Se(), Te("div", {
              key: C,
              class: "ws-restore-item",
              onClick: (D) => p(C)
            }, [
              h[2] || (h[2] = de("span", { class: "ws-restore-icon" }, "⊞", -1)),
              cl(" " + Ve(R(C)), 1)
            ], 8, So))), 128))
          ])) : Oe("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), No = /* @__PURE__ */ tt(To, [["__scopeId", "data-v-5838d04b"]]), Co = ["id"], ko = { class: "cc-title" }, Io = {
  key: 0,
  class: "cc-size-badge"
}, Lo = { class: "cc-controls" }, Ro = ["title"], Eo = { class: "cc-body" }, Do = 200, Fo = 80, An = 60, Ao = /* @__PURE__ */ Qe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: o, setMinimized: s, setMaximized: i, updatePos: u, updateSize: m } = Nn(), d = Ht("cathodeWorkspace", P(null)), c = ie(() => e.value[n.id]), g = ie(() => {
      const r = c.value, w = n.curvature ?? 0;
      if (!r) return {};
      const B = { "--curvature": Math.abs(w) };
      return r.maximized ? { ...B, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: r.zIndex } : {
        ...B,
        left: r.x + "px",
        top: r.y + "px",
        width: r.w + "px",
        height: r.minimized ? cn + "px" : r.h + "px",
        zIndex: r.zIndex,
        display: r.visible ? "flex" : "none"
      };
    });
    let p = !1, S = 0, L = 0;
    function R(r) {
      var M;
      if (r.target.closest(".cc-btn") || c.value.maximized) return;
      l(n.id), p = !0;
      const w = (M = d.value) == null ? void 0 : M.querySelector(`#cc-${n.id}`);
      if (!w) return;
      const B = w.getBoundingClientRect();
      S = r.clientX - B.left, L = r.clientY - B.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", h), r.preventDefault();
    }
    function v(r) {
      var _;
      if (!p || !d.value) return;
      const w = d.value.getBoundingClientRect(), B = ((_ = c.value) == null ? void 0 : _.w) ?? 300;
      let M = r.clientX - w.left - S, W = r.clientY - w.top - L;
      M = Math.max(An - B, Math.min(w.width - An, M)), W = Math.max(0, Math.min(w.height - cn, W)), u(n.id, M, W);
    }
    function h() {
      p = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h);
    }
    let C = !1, D = 0, O = 0, T = 0, y = 0;
    const k = P("");
    function U(r) {
      c.value.maximized || (l(n.id), C = !0, D = r.clientX, O = r.clientY, T = c.value.w, y = c.value.h, document.addEventListener("mousemove", K), document.addEventListener("mouseup", te), r.preventDefault(), r.stopPropagation());
    }
    function K(r) {
      if (!C) return;
      const w = Math.max(Do, T + (r.clientX - D)), B = Math.max(Fo, y + (r.clientY - O));
      m(n.id, w, B), k.value = `${Math.round(w)}×${Math.round(B)}`;
    }
    function te() {
      C = !1, k.value = "", document.removeEventListener("mousemove", K), document.removeEventListener("mouseup", te), le.value++;
    }
    const le = P(0);
    G(gn, () => {
      le.value++;
    }), et(() => {
      var r;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", K), document.removeEventListener("mouseup", te), (r = q.value) == null || r.removeEventListener("scroll", N), X();
    });
    const q = P(null);
    function J(r) {
      if (n.canvas) return [];
      const w = r.children[0];
      return w ? Array.from(w.children) : [];
    }
    function N() {
      const r = q.value, w = n.curvature ?? 0;
      if (!r) return;
      const B = J(r);
      if (!B.length) return;
      const M = r.clientHeight, W = M / 2, _ = w * 38e-4;
      B.forEach((Y) => {
        if (!Y.dataset.origFs) {
          const xe = getComputedStyle(Y);
          Y.dataset.origFs = xe.fontSize, Y.dataset.origLh = xe.lineHeight;
        }
        if (w === 0) {
          Y.style.fontSize = "", Y.style.lineHeight = "";
          return;
        }
        const j = Y.getBoundingClientRect(), Q = r.getBoundingClientRect(), he = j.top - Q.top + j.height / 2, be = Math.min(1, Math.abs(he - W) / (M / 2)), ae = 1 + _ * Math.cos(be * Math.PI / 2), F = parseFloat(Y.dataset.origFs), V = Y.dataset.origLh, ne = V === "normal" ? F * 1.4 : parseFloat(V);
        isNaN(F) || (Y.style.fontSize = `${(F * ae).toFixed(2)}px`), isNaN(ne) || (Y.style.lineHeight = `${(ne * ae).toFixed(2)}px`);
      });
    }
    function X() {
      const r = q.value;
      r && J(r).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    G(() => n.curvature, (r) => {
      (r ?? 0) === 0 ? X() : N();
    }), Ne(() => {
      var r;
      (r = q.value) == null || r.addEventListener("scroll", N, { passive: !0 }), Be(N);
    });
    function ue() {
      s(n.id, !c.value.minimized), Be(() => {
        le.value++;
      });
    }
    function se() {
      i(n.id, !c.value.maximized), Be(() => {
        le.value++;
      });
    }
    function oe() {
      o(n.id, !1);
    }
    function me() {
      l(n.id);
    }
    return (r, w) => c.value && c.value.visible ? (Se(), Te("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: ul(["cc", { "cc-minimized": c.value.minimized, "cc-maximized": c.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Ke(g.value),
      onMousedown: me
    }, [
      de("div", {
        class: "cc-titlebar",
        onMousedown: R
      }, [
        w[0] || (w[0] = de("span", { class: "cc-status-dot" }, null, -1)),
        de("span", ko, Ve(t.title), 1),
        k.value ? (Se(), Te("span", Io, Ve(k.value), 1)) : Oe("", !0),
        de("div", Lo, [
          de("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: at(ue, ["stop"])
          }, "─"),
          de("button", {
            class: "cc-btn cc-btn-max",
            title: c.value.maximized ? "Restore" : "Maximize",
            onClick: at(se, ["stop"])
          }, Ve(c.value.maximized ? "⤡" : "⤢"), 9, Ro),
          de("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: at(oe, ["stop"])
          }, "✕")
        ])
      ], 32),
      Bn(de("div", Eo, [
        de("div", {
          ref_key: "bodyEl",
          ref: q,
          class: "cc-screen",
          onScroll: N
        }, [
          an(r.$slots, "default", { resizeKey: le.value }, void 0, !0),
          w[1] || (w[1] = de("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [fl, !c.value.minimized]
      ]),
      !c.value.minimized && !c.value.maximized ? (Se(), Te("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: at(U, ["stop"])
      }, null, 32)) : Oe("", !0)
    ], 46, Co)) : Oe("", !0);
  }
}), Xo = /* @__PURE__ */ tt(Ao, [["__scopeId", "data-v-ca0af4ca"]]), _o = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Bo = `
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
`, Wo = 100, Po = /* @__PURE__ */ Qe({
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
    }, l = P(null), o = P(null);
    let s = null, i = !1;
    function u() {
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
    let m, d, c, g, p, S = null, L = 0;
    function R(y) {
      y - L >= Wo && (C(), L = y), S = requestAnimationFrame(R);
    }
    function v() {
      if (!l.value || !p) return;
      const y = l.value.clientWidth, k = l.value.clientHeight;
      y <= 0 || k <= 0 || p.width === y && p.height === k || (p.width = y, p.height = k, s && s.setSize(y, k, !1), o.value && (o.value.width = y, o.value.height = k, o.value.style.width = y + "px", o.value.style.height = k + "px"));
    }
    function h() {
      if (!(p != null && p.width)) return;
      const y = p.getContext("2d");
      if (!y) return;
      const k = p.width, U = p.height, K = e[n.theme] ?? e.none;
      y.clearRect(0, 0, k, U), y.fillStyle = K.bg, y.fillRect(0, 0, k, U);
      const te = Date.now(), le = (te / 500 | 0) % 2 === 0, q = (te / 400 | 0) % 4;
      y.font = `bold ${Math.max(14, Math.min(k, U) * 0.06)}px monospace`, y.textAlign = "center", y.textBaseline = "middle", y.fillStyle = K.text, n.glow && (y.shadowColor = K.text, y.shadowBlur = 14);
      const J = ".".repeat(q).padEnd(3, " "), N = `${n.label}${J}`;
      if (y.fillText(N, k / 2, U / 2), y.shadowBlur = 0, le) {
        const X = y.measureText(N), ue = y.measureText("M").width, se = parseFloat(y.font), oe = k / 2 + X.width / 2 + 4, me = U / 2 - se / 2 + 2;
        y.fillStyle = K.cursor, n.glow && (y.shadowColor = K.cursor, y.shadowBlur = 12), y.fillRect(oe, me, ue * 0.7, se * 0.95), y.shadowBlur = 0;
      }
    }
    function C() {
      if (!p) return;
      if (h(), i) {
        if (!o.value) return;
        const k = o.value.getContext("2d");
        k && k.drawImage(p, 0, 0);
        return;
      }
      if (!s || !c || !g) return;
      const y = n.theme === "paper";
      c.uniforms.uStrength.value = Ze(n.curvature), c.uniforms.uScanlines.value = n.scanlines && !y ? 1 : 0, c.uniforms.uVignette.value = y ? 0 : 1, g.needsUpdate = !0, s.render(m, d);
    }
    function D() {
      if (!(!o.value || !l.value)) {
        p = document.createElement("canvas");
        try {
          s = new $.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          i = !0;
        }
        if (!i && !s.getContext() && (s.dispose(), s = null, i = !0), i) {
          v();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), m = new $.Scene(), d = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new $.CanvasTexture(p), g.minFilter = $.LinearFilter, g.magFilter = $.LinearFilter, c = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: _o,
          fragmentShader: Bo,
          transparent: !0
        }), m.add(new $.Mesh(new $.PlaneGeometry(2, 2), c)), v();
      }
    }
    let O = null;
    Ne(() => {
      D(), C(), S = requestAnimationFrame(R), l.value && (O = new ResizeObserver(() => v()), O.observe(l.value));
    }), et(() => {
      S !== null && cancelAnimationFrame(S), O == null || O.disconnect(), u(), g == null || g.dispose(), c == null || c.dispose();
    }), G(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => C());
    const T = ie(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (y, k) => (Se(), Te("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Ke(T.value)
    }, [
      de("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Uo = /* @__PURE__ */ tt(Po, [["__scopeId", "data-v-d00e5f47"]]);
export {
  gt as CANDLE_THEME_COLORS,
  Vo as CathodeCandle,
  $o as CathodeCandleGrid,
  Xo as CathodeContainer,
  Ho as CathodeGrid,
  Uo as CathodeLoader,
  Pl as CathodeLog,
  zo as CathodeTerminal,
  No as CathodeWorkspace,
  Wt as LOG_THEME_COLORS,
  Oo as buildDefaultLayout,
  Nn as useCathodeLayout
};
