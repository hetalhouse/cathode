var Kn = Object.defineProperty;
var qn = (n, t, e) => t in n ? Kn(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var oe = (n, t, e) => qn(n, typeof t != "symbol" ? t + "" : t, e);
import { effectScope as jn, ref as X, reactive as Vt, watch as te, nextTick as Ae, computed as ue, defineComponent as Je, inject as St, onMounted as Xe, onUnmounted as et, openBlock as be, createElementBlock as Me, normalizeStyle as qe, createElementVNode as he, withModifiers as ut, unref as ve, withKeys as mn, createCommentVNode as je, toDisplayString as Ue, createVNode as Sn, withDirectives as Tn, vModelText as Zn, provide as gn, renderSlot as Zt, Transition as Qn, withCtx as Jn, Fragment as el, renderList as tl, createTextVNode as nl, normalizeClass as ll, vShow as al } from "vue";
import * as P from "three";
const pt = {
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
}, Te = 30, Qt = 12, ol = 10, Rt = 14, Cn = 5;
function It() {
  return `${Qt}px system-ui, -apple-system, sans-serif`;
}
function kn(n, t, e) {
  const l = String(t ?? "");
  if (!l) return [""];
  const a = l.split(/\s+/).filter(Boolean);
  if (a.length === 0) return [""];
  const i = [];
  let o = "";
  for (const r of a) {
    const s = o ? o + " " + r : r;
    !o || n.measureText(s).width <= e ? o = s : (i.push(o), o = r);
  }
  return o && i.push(o), i.length ? i : [""];
}
function il(n, t) {
  return Math.max(t, n * Rt + Cn * 2);
}
function an(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let l = 0; l < t; l++) e[l + 1] = e[l] + (n[l] ?? 0);
  return e;
}
function Dt(n, t) {
  if (t <= 0) return 0;
  let e = 0, l = n.length - 1;
  for (; e < l; ) {
    const a = e + l + 1 >> 1;
    n[a] <= t ? e = a : l = a - 1;
  }
  return e;
}
const Ln = 28;
function rl(n, t) {
  if (typeof t == "function") return t(n);
  const e = n.filter((a) => a != null && a !== "");
  if (t === "count") return e.length;
  const l = e.map((a) => Number(a)).filter((a) => !Number.isNaN(a));
  if (l.length === 0) return null;
  switch (t) {
    case "sum":
      return l.reduce((a, i) => a + i, 0);
    case "avg":
      return l.reduce((a, i) => a + i, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function sl(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, i = n.height / l, o = pt[t.theme] ?? pt.none, { cols: r, rows: s, pinnedRows: f, rowHeight: u, scrollY: v, scrollX: h, glow: w } = t;
  e.clearRect(0, 0, a, i), e.fillStyle = o.bg, e.fillRect(0, 0, a, i), e.save(), e.beginPath(), e.rect(0, 0, a, i), e.clip();
  const I = f.length * u, L = t.aggregateRow ? Ln : 0, m = i - Te - I - L;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, a, Te), e.textBaseline = "middle", e.textAlign = "left";
  let g = -h;
  for (let d = 0; d < r.length; d++) {
    const y = r[d];
    if (g + y.width <= 0) {
      g += y.width;
      continue;
    }
    if (g >= a) break;
    const O = !!t.colFilters[y.colId], D = t.sorts.findIndex(($) => $.colId === y.colId), G = D >= 0, U = (y.colDef.headerName ?? y.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(g, 0, y.width, Te), e.clip(), e.font = `bold ${ol}px system-ui, -apple-system, sans-serif`, e.fillStyle = O ? o.accent : o.textHeader, w ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText(U, g + 8, Te / 2), e.shadowBlur = 4, e.fillText(U, g + 8, Te / 2), e.shadowBlur = 0) : e.fillText(U, g + 8, Te / 2), G) {
      const $ = e.measureText(U).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent;
      const Z = t.sorts[D].dir === "asc" ? "▲" : "▼";
      e.fillText(t.sorts.length > 1 ? `${Z}${D + 1}` : Z, g + 8 + $ + 4, Te / 2);
    }
    y.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = O ? o.accent : o.textHeader, e.globalAlpha = O ? 1 : 0.38, e.fillText("⌕", g + y.width - 20, Te / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(g + y.width - 0.5, 0), e.lineTo(g + y.width - 0.5, Te), e.stroke(), g += y.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Te - 0.5), e.lineTo(a, Te - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Te, a, m), e.clip();
  const R = t.rowHeights && t.rowHeights.length === s.length ? t.rowHeights : null, F = R ? an(R, s.length) : null, k = (d) => F ? F[d] : d * u, S = (d) => R ? R[d] : u, p = F ? Dt(F, v) : Math.max(0, Math.floor(v / u));
  let M;
  if (F)
    for (M = p; M < s.length && k(M) < v + m; ) M++;
  else
    M = Math.min(s.length, Math.ceil((v + m) / u));
  const Y = t.selectionAnchorRow ?? t.selectedRow, E = t.selectionAnchorCol ?? t.selectedCol, Q = t.selectedRow >= 0 && Y >= 0 ? Math.min(t.selectedRow, Y) : -1, B = t.selectedRow >= 0 && Y >= 0 ? Math.max(t.selectedRow, Y) : -1, C = t.selectedCol >= 0 && E >= 0 ? Math.min(t.selectedCol, E) : -1, H = t.selectedCol >= 0 && E >= 0 ? Math.max(t.selectedCol, E) : -1, V = B > Q || H > C;
  let j = Number.POSITIVE_INFINITY, le = Number.NEGATIVE_INFINITY, ie = Number.POSITIVE_INFINITY, ne = Number.NEGATIVE_INFINITY;
  const ee = (d, y, O, D) => {
    w ? (e.shadowColor = D, e.shadowBlur = 12, e.fillText(d, y, O), e.shadowBlur = 6, e.fillText(d, y, O), e.shadowBlur = 2, e.fillText(d, y, O), e.shadowBlur = 0) : e.fillText(d, y, O);
  };
  for (let d = p; d < M; d++) {
    const y = s[d], O = S(d), D = Te + k(d) - v;
    d % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, D, a, O));
    const G = d >= Q && d <= B;
    d === t.hoveredRow && !G && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, D, a, O)), G && !V && (e.fillStyle = Ot(o.accent, 0.1), e.fillRect(0, D, a, O)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, D + O - 0.5), e.lineTo(a, D + O - 0.5), e.stroke();
    let U = -h;
    for (let $ = 0; $ < r.length; $++) {
      const Z = r[$];
      if (U + Z.width <= 0) {
        U += Z.width;
        continue;
      }
      if (U >= a) break;
      const ce = G && $ >= C && $ <= H;
      ce && V && (e.fillStyle = Ot(o.accent, 0.14), e.fillRect(U, D, Z.width, O)), ce && (U < j && (j = U), U + Z.width > le && (le = U + Z.width), D < ie && (ie = D), D + O > ne && (ne = D + O));
      const me = t.getCellStyle(Z, y), ye = me.color ?? o.text, Se = me.textAlign ?? "left", W = t.formatCell(Z, y);
      if (e.save(), e.beginPath(), e.rect(U + 1, D, Z.width - 2, O), e.clip(), e.font = It(), e.fillStyle = ye, e.textBaseline = "middle", Z.colDef.wrap) {
        e.textAlign = "left";
        const N = kn(e, W, Math.max(20, Z.width - 16));
        let se = D + Cn + Rt / 2;
        for (const ge of N) {
          if (se - Rt / 2 >= D + O) break;
          ee(ge, U + 8, se, ye), se += Rt;
        }
      } else {
        const N = Se === "right" ? U + Z.width - 8 : U + 8;
        e.textAlign = Se === "right" ? "right" : "left", ee(W, N, D + O / 2, ye);
      }
      e.restore(), d === t.selectedRow && $ === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(U + 1.5, D + 1.5, Z.width - 3, O - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(U + Z.width - 0.5, D), e.lineTo(U + Z.width - 0.5, D + O), e.stroke(), U += Z.width;
    }
  }
  if (V && j < le && ie < ne && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(j + 0.5, ie + 0.5, le - j - 1, ne - ie - 1)), e.restore(), f.length > 0) {
    const d = i - I - L;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, d - 0.5), e.lineTo(a, d - 0.5), e.stroke();
    for (let y = 0; y < f.length; y++) {
      const O = f[y], D = d + y * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, D, a, u);
      let G = -h;
      for (let U = 0; U < r.length; U++) {
        const $ = r[U];
        if (G + $.width <= 0) {
          G += $.width;
          continue;
        }
        if (G >= a) break;
        const Z = t.getCellStyle($, O), ce = Z.color ?? o.text, me = Z.textAlign ?? "left", ye = t.formatCell($, O);
        e.save(), e.beginPath(), e.rect(G + 1, D, $.width - 2, u), e.clip(), e.font = `bold ${Qt}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle", me === "right" ? (e.textAlign = "right", e.fillText(ye, G + $.width - 8, D + u / 2)) : (e.textAlign = "left", e.fillText(ye, G + 8, D + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(G + $.width - 0.5, D), e.lineTo(G + $.width - 0.5, D + u), e.stroke(), G += $.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, D + u - 0.5), e.lineTo(a, D + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const d = i - L;
    e.fillStyle = Ot(o.accent, 0.1), e.fillRect(0, d, a, L), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, d - 0.5), e.lineTo(a, d - 0.5), e.stroke();
    let y = -h;
    for (let O = 0; O < r.length; O++) {
      const D = r[O];
      if (y + D.width <= 0) {
        y += D.width;
        continue;
      }
      if (y >= a) break;
      const U = t.getCellStyle(D, t.aggregateRow).textAlign ?? "left", $ = t.aggregateRow[D.colId] ?? "";
      e.save(), e.beginPath(), e.rect(y + 1, d, D.width - 2, L), e.clip(), e.font = `bold ${Qt}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", w && (e.shadowColor = o.accent, e.shadowBlur = 8), U === "right" ? (e.textAlign = "right", e.fillText($, y + D.width - 8, d + L / 2)) : (e.textAlign = "left", e.fillText($, y + 8, d + L / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(y + D.width - 0.5, d), e.lineTo(y + D.width - 0.5, d + L), e.stroke(), y += D.width;
    }
  }
  e.restore();
}
function Ot(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), a = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${t})`;
}
const Ct = 190, Ut = 34;
function cl(n, t, e) {
  const l = Math.max(4, Math.min(t, n - Ct - 4)), a = Te + 6, i = e ? 26 : 0;
  return {
    box: { x: l, y: a, w: Ct, h: Ut },
    input: { x: l + 9, y: a + 5, w: Ct - 18 - i, h: Ut - 10 },
    clear: e ? { x: l + Ct - 28, y: a, w: 28, h: Ut } : null
  };
}
const Xt = (n, t, e, l = 0) => n >= e.x - l && n <= e.x + e.w + l && t >= e.y && t <= e.y + e.h;
function kt(n, t, e, l = 1) {
  return e.clear && Xt(n, t, e.clear, 4 * (l - 1)) ? "clear" : Xt(n, t, e.input) ? "input" : Xt(n, t, e.box) ? "inside" : "outside";
}
function ul(n, t, e, l, a) {
  const { box: i, input: o, clear: r } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = a.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(i.x + 0.5, i.y + 0.5, i.w - 1, i.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(o.x, o.y, o.w, o.h, 3), n.fill(), n.beginPath(), n.rect(o.x, o.y, o.w, o.h), n.clip(), n.font = It(), n.textBaseline = "middle";
  const s = o.y + o.h / 2 + 1, f = 5;
  if (e) {
    n.fillStyle = a.text;
    const u = n.measureText(e).width, v = u > o.w - 2 * f - 2 ? o.x + o.w - f - 2 - u : o.x + f;
    n.fillText(e, v, s), l && (n.fillStyle = a.accent, n.fillRect(Math.min(v + u + 1, o.x + o.w - f), o.y + 4, 1.5, o.h - 8));
  } else
    n.fillStyle = a.textHeader, n.fillText("Filter…", o.x + f, s), l && (n.fillStyle = a.accent, n.fillRect(o.x + f, o.y + 4, 1.5, o.h - 8));
  n.restore(), r && (n.save(), n.font = It(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = a.textHeader, n.fillText("✕", r.x + r.w / 2, r.y + r.h / 2 + 1), n.restore());
}
function fl(n, t, e) {
  const l = n - 0.5, a = t - 0.5, i = Math.abs(e), o = (l * l + a * a) * i;
  if (e < 0) {
    const f = 0.5 * i, v = 1 / (1 - 2 * (0.5 * (1 + f) * f)), h = (l + l * (1 + o) * o * -1) * v, w = (a + a * (1 + o) * o * -1) * v;
    return [0.5 + h, 0.5 + w];
  }
  const r = l * (1 + o) * o, s = a * (1 + o) * o;
  return [n + r, t + s];
}
function Rn(n, t, e, l, a, i = e, o = l) {
  const r = n / e, s = 1 - t / l, [f, u] = fl(r, s, a);
  return f < 0 || f > 1 || u < 0 || u > 1 ? [-1, -1] : [f * i, (1 - u) * o];
}
function Nt(n, t) {
  let e = 0;
  for (let l = 0; l < n; l++) e += t[l].width;
  return e;
}
function dl(n, t, e, l = 1) {
  return n >= t + e - 24 * l && n < t + e;
}
function pn(n, t, e, l = 1) {
  const a = t + e;
  return n >= a - 6 * l && n <= a + 1 * l;
}
function hl(n, t, e, l, a, i, o, r, s, f = !1, u) {
  const v = n + s;
  let h = -1, w = 0;
  for (let R = 0; R < e.length; R++) {
    if (v >= w && v < w + e[R].width) {
      h = R;
      break;
    }
    w += e[R].width;
  }
  if (t < Te) return { area: "header", colIdx: h, rowIdx: -1 };
  const I = f ? Ln : 0;
  if (I > 0 && t >= o - I)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const L = r * a;
  if (L > 0 && t >= o - L - I) {
    const R = Math.floor((t - (o - L - I)) / a);
    return { area: "pinned", colIdx: h, rowIdx: R };
  }
  const m = t - Te + i, g = u && u.length === l ? Dt(an(u, l), m) : Math.floor(m / a);
  return g >= 0 && g < l ? { area: "body", colIdx: h, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function Ze(n) {
  return n / 45 * 0.55;
}
function In(n) {
  const t = Math.abs(Ze(n));
  if (t === 0) return 1;
  if (n < 0) {
    const l = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + l) * l));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const vl = 500, Dn = vl / 2, Jt = 1.6, _t = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Bt = `
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
`, Wt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function zt() {
  return {
    uMouseUV: { value: new P.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Jt },
    uLensTint: { value: new P.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Ce = { x: -999, y: -999 };
function Yt(n, t, e, l, a) {
  const i = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = i && a > 0 ? Dn / a : 0, n.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function Tt(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const ml = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, gl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`, pl = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${_t}

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

  ${Bt}

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
    ${Wt}
    gl_FragColor = color;
  }
`;
function wl(n, t, e) {
  const l = n - 0.5, a = t - 0.5, i = Math.abs(e), o = (l * l + a * a) * i, r = (1 + o) * o * Math.sign(e);
  let s = l + l * r, f = a + a * r;
  if (e < 0) {
    const u = 0.5 * i, v = 0.5 * (1 + u) * u;
    s /= 1 - 2 * v, f /= 1 - 2 * v;
  }
  return { x: 0.5 + s, y: 0.5 + f };
}
function yl(n, t, e, l, a, i) {
  if (!l || e.x === Ce.x || i <= 0) return { x: n, y: t };
  const o = a / i, r = Dn / i, s = (n - e.x) * o, f = t - e.y, u = Math.hypot(s, f);
  if (u >= r) return { x: n, y: t };
  const v = u / r, h = Math.min(Math.max((v - 0.88) / (1 - 0.88), 0), 1), w = h * h * (3 - 2 * h), I = Jt + (1 - Jt) * w;
  return { x: e.x + s / I / o, y: e.y + f / I };
}
class Ht {
  constructor(t) {
    oe(this, "canvas");
    oe(this, "material");
    oe(this, "mode");
    /** logical (CSS px) size and backing-store dpr — set by resize() */
    oe(this, "dpr", 1);
    oe(this, "logicalW", 0);
    oe(this, "logicalH", 0);
    /**
     * Visible panel size in px, when it differs from the content canvas (CathodeGrid's bend-field
     * gain draws a WIDER canvas than the screen it warps into). The lens is a fixed physical size
     * and circular in SCREEN px, so its radius/aspect come from this; 0 = same as the content.
     */
    oe(this, "screenW", 0);
    oe(this, "screenH", 0);
    oe(this, "texture");
    oe(this, "painter");
    oe(this, "maxDpr");
    oe(this, "look", { curvature: 0, scanlines: !0, vignette: !0, magnify: !1 });
    oe(this, "mouse", { x: Ce.x, y: Ce.y });
    oe(this, "anisotropy", 1);
    this.painter = t.paint, this.mode = t.mode ?? "screen", this.maxDpr = t.maxDpr ?? 2, this.canvas = document.createElement("canvas"), this.texture = this.makeTexture(), this.material = new P.ShaderMaterial({
      uniforms: {
        uTex: { value: this.texture },
        uStrength: { value: 0 },
        uScanlines: { value: 1 },
        uVignette: { value: 1 },
        ...zt()
      },
      vertexShader: this.mode === "world" ? gl : ml,
      fragmentShader: pl,
      transparent: !0,
      side: this.mode === "world" ? P.DoubleSide : P.FrontSide
    });
  }
  /**
   * Max anisotropy for 'world' mode — pass renderer.capabilities.getMaxAnisotropy() once the
   * presenter has a renderer. Applies to the current and every future texture.
   */
  setAnisotropy(t) {
    this.anisotropy = Math.max(1, t), this.texture.anisotropy = this.anisotropy, this.texture.needsUpdate = !0;
  }
  makeTexture() {
    const t = new P.CanvasTexture(this.canvas);
    return t.magFilter = P.LinearFilter, this.mode === "world" ? (t.generateMipmaps = !0, t.minFilter = P.LinearMipmapLinearFilter, t.anisotropy = this.anisotropy) : t.minFilter = P.LinearFilter, t;
  }
  /**
   * Size the backing store (logical W×H × dpr, capped). Returns false — and does nothing — when
   * nothing changed: assigning canvas.width clears it even at the same value, and ResizeObserver
   * fires spuriously. The caller redraws on true.
   */
  resize(t, e, l = window.devicePixelRatio || 1) {
    if (!t || !e) return !1;
    const a = Math.min(l, this.maxDpr), i = Math.round(t * a), o = Math.round(e * a);
    return this.canvas.width === i && this.canvas.height === o && this.dpr === a ? !1 : (this.dpr = a, this.logicalW = t, this.logicalH = e, this.canvas.width = i, this.canvas.height = o, this.texture.dispose(), this.texture = this.makeTexture(), this.material.uniforms.uTex.value = this.texture, !0);
  }
  /** Curvature / scanlines / vignette / lens enable. Takes effect on the next syncUniforms(). */
  setLook(t) {
    this.look = { ...this.look, ...t };
  }
  setScreenSize(t, e) {
    this.screenW = t, this.screenH = e;
  }
  /** Lens centre in surface UV (y up); null = lens off. */
  setLens(t) {
    this.mouse.x = t ? t.x : Ce.x, this.mouse.y = t ? t.y : Ce.y;
  }
  /** Push look + lens state into the shader uniforms. */
  syncUniforms() {
    const t = this.material.uniforms;
    t.uStrength.value = Ze(this.look.curvature), t.uScanlines.value = this.look.scanlines ? 1 : 0, t.uVignette.value = this.look.vignette ? 1 : 0, Yt(
      this.material,
      this.look.magnify,
      this.mouse,
      this.screenW || this.logicalW || this.canvas.width,
      this.screenH || this.logicalH || this.canvas.height
    );
  }
  /** Run the painter into the offscreen canvas and flag the texture for upload. */
  paint(t) {
    this.canvas.width && (this.painter(this.canvas, { dpr: this.dpr, glow: t }), this.texture.needsUpdate = !0);
  }
  /** paint() the picture WITHOUT the GL upload — for the 2D fallback presenter. */
  paintOnly(t) {
    this.canvas.width && this.painter(this.canvas, { dpr: this.dpr, glow: t });
  }
  /**
   * Surface UV (0..1, y up — what a raycast hit's `uv` gives) → CONTENT pixel position in the
   * painter's LOGICAL px (y down), through the same lens + barrel the shader applies. Null when
   * the point lands outside the drawn content (the barrel's transparent margin).
   */
  contentPoint(t, e) {
    const l = yl(t, e, this.mouse, this.look.magnify, this.screenW || this.logicalW, this.screenH || this.logicalH), a = wl(l.x, l.y, Ze(this.look.curvature));
    return a.x < 0 || a.x > 1 || a.y < 0 || a.y > 1 ? null : { x: a.x * this.logicalW, y: (1 - a.y) * this.logicalH };
  }
  dispose() {
    this.texture.dispose(), this.material.dispose();
  }
}
const xl = 600;
function En(n) {
  const t = jn(!0);
  return t.run(() => bl(n, t));
}
function bl(n, t) {
  var dn, hn;
  const { emit: e, host: l } = n, a = X(((dn = n.rowData) == null ? void 0 : dn.call(n)) ?? []), i = X(((hn = n.pinnedBottomRowData) == null ? void 0 : hn.call(n)) ?? []), o = X(""), r = X([]), s = Vt({}), f = Vt({}), u = Vt(/* @__PURE__ */ new Set()), v = X(0), h = X(0), w = X(0), I = X(0), L = X(0), m = X(0), g = X(0), R = X(-1), F = X(null), k = X(null), S = X(null), p = X(""), M = X(0);
  let Y = null;
  const E = X(!0);
  let Q = null;
  te(S, (c) => {
    var x;
    Q && (clearInterval(Q), Q = null), c ? (E.value = !0, Q = setInterval(() => {
      E.value = !E.value, l.redraw();
    }, 530), Ae(() => {
      var b;
      return (b = l.focusFilterInput) == null ? void 0 : b.call(l);
    })) : (Y = null, (x = l.blurFilterInput) == null || x.call(l)), l.redraw();
  });
  function B(c) {
    return c.colId ?? c.field ?? (c.headerName ? c.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
  }
  const C = ue(() => {
    var x;
    const c = ((x = n.defaultColDef) == null ? void 0 : x.call(n)) ?? {};
    return n.columnDefs().filter((b) => !u.has(B(b))).map((b) => {
      const _ = B(b), z = { ...c, ...b };
      return { colId: _, colDef: z, width: f[_] ?? z.width ?? 100 };
    });
  }), H = ue(() => {
    const c = h.value;
    if (!c) return C.value;
    const x = C.value.reduce((z, K) => z + K.width, 0);
    if (!x || x >= c) return C.value;
    const b = c / x;
    let _ = 0;
    return C.value.map((z, K) => {
      const re = K === C.value.length - 1 ? c - _ : Math.max(8, Math.round(z.width * b));
      return _ += re, { ...z, width: re };
    });
  }), V = ue(() => {
    const c = H.value.reduce((x, b) => x + b.width, 0);
    return Math.max(0, c - h.value);
  });
  function j(c, x) {
    if (x.colDef.valueGetter) return x.colDef.valueGetter({ data: c, colDef: x.colDef });
    if (x.colDef.field) return c[x.colDef.field];
  }
  function le(c, x) {
    const b = j(x, c);
    return c.colDef.valueFormatter ? c.colDef.valueFormatter({ value: b, data: x, colDef: c.colDef }) ?? "" : c.colDef.cellRenderer ? (c.colDef.cellRenderer({ value: b, data: x, colDef: c.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
  }
  function ie(c, x) {
    return c.colDef.cellStyle ? typeof c.colDef.cellStyle == "function" ? c.colDef.cellStyle({ value: j(x, c), data: x, colDef: c.colDef }) ?? {} : c.colDef.cellStyle : {};
  }
  function ne() {
    return n.columnDefs().map((c, x) => ({ d: c, i: x })).filter(({ d: c }) => c.sort).sort((c, x) => (c.d.sortIndex ?? c.i) - (x.d.sortIndex ?? x.i)).map(({ d: c }) => ({ colId: B(c), dir: c.sort }));
  }
  const ee = ue(() => {
    v.value;
    let c = a.value;
    const x = o.value.trim().toLowerCase();
    x && (c = c.filter(
      (_) => C.value.some(
        (z) => String(j(_, z) ?? "").toLowerCase().includes(x)
      )
    ));
    for (const [_, z] of Object.entries(s)) {
      if (!z) continue;
      const K = C.value.find((J) => J.colId === _);
      if (K)
        if (z.startsWith("__eq__")) {
          const J = z.slice(6).toLowerCase();
          c = c.filter((re) => String(j(re, K) ?? "").toLowerCase() === J);
        } else {
          const J = z.toLowerCase();
          c = c.filter((re) => String(j(re, K) ?? "").toLowerCase().includes(J));
        }
    }
    const b = r.value.map(({ colId: _, dir: z }) => ({ col: C.value.find((K) => K.colId === _), dir: z })).filter((_) => !!_.col);
    return b.length && (c = [...c].sort((_, z) => {
      for (const { col: K, dir: J } of b) {
        const re = j(_, K), Ee = j(z, K);
        let De = 0;
        if (K.colDef.comparator ? De = K.colDef.comparator(re, Ee) : typeof re == "number" && typeof Ee == "number" ? De = re - Ee : De = String(re ?? "").localeCompare(String(Ee ?? ""), void 0, { numeric: !0 }), De) return J === "asc" ? De : -De;
      }
      return 0;
    })), c;
  });
  let d = null;
  function y() {
    if (typeof document > "u") return null;
    d || (d = document.createElement("canvas"));
    const c = d.getContext("2d");
    return c && (c.font = It()), c;
  }
  const O = ue(() => H.value.some((c) => c.colDef.wrap)), D = ue(() => {
    if (!O.value) return null;
    const c = y();
    if (!c) return null;
    const x = H.value.filter((_) => _.colDef.wrap), b = n.rowHeight();
    return ee.value.map((_) => {
      let z = 1;
      for (const K of x) {
        const J = kn(c, le(K, _), Math.max(20, K.width - 16));
        J.length > z && (z = J.length);
      }
      return il(z, b);
    });
  }), G = ue(
    () => D.value ? an(D.value, ee.value.length) : null
  ), U = ue(
    () => G.value ? G.value[ee.value.length] : ee.value.length * n.rowHeight()
  ), $ = ue(() => {
    const c = i.value.length * n.rowHeight();
    return Math.max(0, w.value - Te - c);
  }), Z = ue(() => Math.max(0, U.value - $.value)), ce = ue(() => Math.max(1, Math.floor($.value / n.rowHeight()))), me = ue(() => {
    const c = ee.value.length;
    if (c === 0) return 0;
    const x = G.value ? Dt(G.value, m.value) : Math.floor(m.value / n.rowHeight());
    return Math.min(c - 1, x);
  }), ye = ue(() => {
    const c = ee.value.length;
    return c === 0 ? 0 : G.value ? Math.min(c - 1, Dt(G.value, m.value + $.value - 1)) : Math.min(c - 1, me.value + ce.value - 1);
  }), Se = ue(() => {
    const c = C.value.filter((z) => z.colDef.aggFunc != null);
    if (c.length === 0) return null;
    const x = ee.value, b = {};
    for (const z of c) {
      const K = x.map((re) => j(re, z)), J = rl(K, z.colDef.aggFunc);
      if (J == null) {
        b[z.colId] = "";
        continue;
      }
      b[z.colId] = z.colDef.aggValueFormatter ? z.colDef.aggValueFormatter(J) : String(J);
    }
    const _ = c[0].colId;
    return b[_] === "" && (b[_] = "Σ"), b;
  });
  te(ee, () => {
    m.value = 0, F.value = null;
  }), te(V, () => {
    g.value = Math.min(g.value, V.value);
  }), te(Z, () => {
    m.value = Math.min(m.value, Z.value);
  }), te(
    [ee, () => i.value, H, m, R, F],
    () => Ae(() => l.redraw())
  ), te(F, (c) => {
    if (!c) return;
    const x = ee.value[c.row], b = H.value[c.col];
    x && b && e("cell-selected", { data: x, row: c.row, col: c.col, colId: b.colId });
  });
  function W(c, x, b, _) {
    I.value = b, L.value = _, h.value = c, w.value = x, g.value = Math.max(0, Math.min(V.value, g.value)), m.value = Math.max(0, Math.min(Z.value, m.value));
  }
  function N(c) {
    const x = G.value, b = x ? x[c] : c * n.rowHeight(), _ = x ? x[c + 1] : b + n.rowHeight();
    b < m.value ? m.value = b : _ > m.value + $.value && (m.value = Math.min(Z.value, _ - $.value));
  }
  function se(c) {
    var z;
    if (!h.value) return;
    let x = 0;
    for (let K = 0; K < c; K++) x += H.value[K].width;
    const b = ((z = H.value[c]) == null ? void 0 : z.width) ?? 0, _ = x - g.value;
    _ < 0 ? g.value = Math.max(0, x) : _ + b > h.value && (g.value = Math.min(V.value, x + b - h.value));
  }
  function ge() {
    m.value = Math.max(0, m.value - $.value), l.redraw();
  }
  function pe() {
    m.value = Math.min(Z.value, m.value + $.value), l.redraw();
  }
  let Re = !1, Ye = "", Pe = 0, Ne = 0, He = 1, _e = !1, A = !1, ae = 0, de = 0, Ge = 0, Ie = 0, Ke = !1;
  function ot(c, x, b = 1) {
    var _;
    Re = !0, Ye = c, Pe = x, He = b, Ne = ((_ = H.value.find((z) => z.colId === c)) == null ? void 0 : _.width) ?? 100, _e = !1;
  }
  function ht(c, x) {
    A = !0, Ke = !1, ae = c, de = x, Ge = g.value, Ie = m.value;
  }
  function it(c, x) {
    const b = ae - c, _ = de - x;
    (Math.abs(b) > 4 || Math.abs(_) > 4) && (Ke = !0), g.value = Math.max(0, Math.min(V.value, Ge + b)), m.value = Math.max(0, Math.min(Z.value, Ie + _)), l.redraw();
  }
  function T() {
    A && (Ke && (_e = !0), A = !1);
  }
  function q(c, x) {
    if (A) {
      it(c, x);
      return;
    }
    if (!Re) return;
    const b = h.value, _ = Math.max(30, Ne + (c - Pe) * He), z = C.value.filter((J) => J.colId !== Ye).reduce((J, re) => J + re.width, 0), K = b - _;
    K > 10 && (f[Ye] = Math.max(10, Math.round(_ * z / K))), l.redraw();
  }
  function fe() {
    T(), Re && (Re = !1, _e = !0, e("column-resized"));
  }
  function Fe(c, x) {
    return hl(
      c,
      x,
      H.value,
      ee.value.length,
      n.rowHeight(),
      m.value,
      w.value,
      i.value.length,
      g.value,
      Se.value !== null,
      D.value ?? void 0
    );
  }
  let Be = 0;
  function $e(c, x, b) {
    S.value = null;
    const _ = Date.now();
    if (c !== 0) {
      Be = _, g.value = Math.max(0, Math.min(V.value, g.value + c)), l.redraw();
      return;
    }
    if (b && x !== 0) {
      Be = _, g.value = Math.max(0, Math.min(V.value, g.value + x)), l.redraw();
      return;
    }
    _ - Be < xl || (m.value = Math.max(0, Math.min(Z.value, m.value + x)), l.redraw());
  }
  function Ve(c) {
    if (c.cx < 0)
      return R.value = -1, l.redraw(), null;
    if (S.value && Y) {
      const _ = kt(c.cx, c.cy, Y, c.hitScale);
      if (_ !== "outside")
        return R.value = -1, l.redraw(), _ === "clear" ? "pointer" : "text";
    }
    const x = Fe(c.cx, c.cy);
    R.value = x.area === "body" ? x.rowIdx : -1;
    let b;
    if (x.area === "header" && x.colIdx >= 0) {
      const _ = H.value[x.colIdx], z = Nt(x.colIdx, H.value), K = c.cx + g.value;
      b = _ && pn(K, z, _.width, c.hitScale) ? "col-resize" : "pointer";
    } else x.area === "body" ? b = "pointer" : b = "default";
    return l.redraw(), b;
  }
  function vt() {
    R.value = -1, l.redraw();
  }
  function rt(c, x, b) {
    if (c.cx < 0 || S.value && Y && kt(c.cx, c.cy, Y, c.hitScale) !== "outside") return;
    if (c.cy >= Te) {
      ht(x, b);
      return;
    }
    const _ = c.cx + g.value;
    for (let z = 0; z < H.value.length; z++) {
      const K = H.value[z], J = Nt(z, H.value);
      if (K.colDef.resizable !== !1 && pn(_, J, K.width, c.hitScale)) {
        ot(K.colId, x, c.hitScale);
        return;
      }
    }
  }
  function Wn(c, x) {
    var z, K, J;
    const b = { stopPropagation: !1 };
    if (_e)
      return _e = !1, b;
    if (Re) return b;
    if (c.cx < 0)
      return S.value = null, b;
    if (S.value && Y) {
      const re = kt(c.cx, c.cy, Y, c.hitScale);
      if (re === "clear")
        return fn(), b;
      if (re !== "outside")
        return (z = l.focusFilterInput) == null || z.call(l), b;
      S.value = null;
    }
    const _ = Fe(c.cx, c.cy);
    if (_.area === "header" && _.colIdx >= 0) {
      const re = H.value[_.colIdx], Ee = Nt(_.colIdx, H.value), De = c.cx + g.value;
      if (re.colDef.filter && dl(De, Ee, re.width, c.hitScale))
        b.stopPropagation = !0, S.value === re.colId ? S.value = null : (S.value = re.colId, p.value = (K = s[re.colId]) != null && K.startsWith("__eq__") ? s[re.colId].slice(6) : s[re.colId] ?? "", M.value = Math.max(0, Ee - g.value));
      else if (re.colDef.sortable !== !1) {
        S.value = null;
        const st = r.value.find((Oe) => Oe.colId === re.colId), ct = st ? st.dir === "asc" ? "desc" : null : "asc";
        x.shiftKey ? r.value = st ? ct ? r.value.map((Oe) => Oe.colId === re.colId ? { colId: Oe.colId, dir: ct } : Oe) : r.value.filter((Oe) => Oe.colId !== re.colId) : [...r.value, { colId: re.colId, dir: "asc" }] : r.value = ct ? [{ colId: re.colId, dir: ct }] : [], e("sort-changed");
      }
      return b;
    }
    if (S.value = null, _.area === "body" && _.rowIdx >= 0 && _.colIdx >= 0) {
      const re = _.rowIdx;
      x.shiftKey && F.value ? (k.value || (k.value = { ...F.value }), F.value = { row: re, col: _.colIdx }) : (F.value = { row: re, col: _.colIdx }, k.value = { row: re, col: _.colIdx }), (J = l.focusCanvas) == null || J.call(l);
      const Ee = ee.value[re], De = H.value[_.colIdx];
      Ee && De && (e("row-clicked", { data: Ee, event: x }), e("cell-selected", { data: Ee, row: re, col: _.colIdx, colId: De.colId }));
    }
    return b;
  }
  function zn(c) {
    S.value && (c && Y && c.cx >= 0 && kt(c.cx, c.cy, Y, c.hitScale) !== "outside" || (S.value = null));
  }
  function Yn(c) {
    const b = H.value.length - 1, _ = ee.value.length - 1;
    if (!F.value) {
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(c.key) && (c.preventDefault(), F.value = { row: me.value, col: 0 }, k.value = { row: me.value, col: 0 });
      return;
    }
    let { row: z, col: K } = F.value;
    const J = (re, Ee, De = !1) => {
      z = Math.max(0, Math.min(_, re)), K = Math.max(0, Math.min(b, Ee)), F.value = { row: z, col: K }, De || (k.value = { row: z, col: K }), N(z), se(K);
    };
    switch (c.key) {
      case "ArrowDown":
        c.preventDefault(), J(z + 1, K, c.shiftKey);
        break;
      case "ArrowUp":
        c.preventDefault(), J(z - 1, K, c.shiftKey);
        break;
      case "ArrowRight":
        c.preventDefault(), c.shiftKey ? J(z, K + 1, !0) : K < b ? J(z, K + 1) : J(z + 1, 0);
        break;
      case "ArrowLeft":
        c.preventDefault(), c.shiftKey ? J(z, K - 1, !0) : K > 0 ? J(z, K - 1) : J(z - 1, b);
        break;
      case "Tab":
        c.preventDefault(), c.shiftKey ? K > 0 ? J(z, K - 1) : J(z - 1, b) : K < b ? J(z, K + 1) : J(z + 1, 0);
        break;
      case "Enter":
        c.preventDefault(), c.shiftKey ? J(z - 1, K) : J(z + 1, K);
        break;
      case "Home":
        c.preventDefault(), c.ctrlKey || c.metaKey ? J(0, 0, c.shiftKey) : J(z, 0, c.shiftKey);
        break;
      case "End":
        c.preventDefault(), c.ctrlKey || c.metaKey ? J(_, b, c.shiftKey) : J(z, b, c.shiftKey);
        break;
      case "PageDown":
        c.preventDefault(), J(Math.min(_, z + ce.value), K, c.shiftKey);
        break;
      case "PageUp":
        c.preventDefault(), J(Math.max(0, z - ce.value), K, c.shiftKey);
        break;
      case "Escape":
        F.value = null, k.value = null;
        break;
      case "c":
      case "C":
        (c.ctrlKey || c.metaKey) && (c.preventDefault(), Hn());
        break;
    }
  }
  function Hn() {
    var De;
    if (!F.value) return;
    const c = H.value, x = ee.value, b = k.value ?? F.value, _ = Math.min(b.row, F.value.row), z = Math.max(b.row, F.value.row), K = Math.min(b.col, F.value.col), J = Math.max(b.col, F.value.col), re = [];
    for (let st = _; st <= z; st++) {
      const ct = x[st];
      if (!ct) continue;
      const Oe = [];
      for (let $t = K; $t <= J; $t++) {
        const vn = c[$t];
        vn && Oe.push(le(vn, ct).replace(/[\t\r\n]+/g, " "));
      }
      re.push(Oe.join("	"));
    }
    const Ee = re.join(`
`);
    (De = navigator.clipboard) == null || De.writeText(Ee).catch(() => {
    });
  }
  function $n(c) {
    p.value = c, c ? s[S.value] = c : delete s[S.value], e("filter-changed");
  }
  function fn() {
    S.value && delete s[S.value], p.value = "", S.value = null, e("filter-changed");
  }
  function Vn() {
    S.value = null;
  }
  function On(c, x) {
    if (!S.value || !c.width) return;
    const b = c.getContext("2d");
    if (!b) return;
    b.setTransform(x, 0, 0, x, 0, 0), Y = cl(c.width / x, M.value, !!p.value);
    const _ = pt[n.theme()] ?? pt.none;
    ul(b, Y, p.value, E.value, _);
  }
  function Un(c, { dpr: x, glow: b }) {
    var _, z, K, J;
    sl(c, {
      cols: H.value,
      rows: ee.value,
      pinnedRows: i.value,
      rowHeight: n.rowHeight(),
      // Per-row variable heights for `wrap` columns.
      rowHeights: D.value ?? void 0,
      scrollY: m.value,
      scrollX: g.value,
      theme: n.theme(),
      glow: b,
      sorts: r.value,
      colFilters: s,
      hoveredRow: R.value,
      selectedRow: ((_ = F.value) == null ? void 0 : _.row) ?? -1,
      selectedCol: ((z = F.value) == null ? void 0 : z.col) ?? -1,
      selectionAnchorRow: ((K = k.value) == null ? void 0 : K.row) ?? -1,
      selectionAnchorCol: ((J = k.value) == null ? void 0 : J.col) ?? -1,
      formatCell: le,
      getCellStyle: ie,
      aggregateRow: Se.value,
      dpr: x
    }), On(c, x);
  }
  const Xn = {
    setGridOption(c, x) {
      c === "rowData" ? a.value = x : c === "pinnedBottomRowData" ? i.value = x : c === "quickFilterText" && (o.value = x);
    },
    getColumnState() {
      return n.columnDefs().map((c) => {
        var b;
        const x = B(c);
        return {
          colId: x,
          hide: u.has(x),
          sort: ((b = r.value.find((_) => _.colId === x)) == null ? void 0 : b.dir) ?? null,
          sortIndex: r.value.some((_) => _.colId === x) ? r.value.findIndex((_) => _.colId === x) : null,
          width: f[x] ?? c.width
        };
      });
    },
    applyColumnState({ state: c }) {
      const x = c.filter((b) => b.sort).sort((b, _) => (b.sortIndex ?? 0) - (_.sortIndex ?? 0));
      x.length && (r.value = x.map((b) => ({ colId: b.colId, dir: b.sort })));
      for (const b of c)
        b.hide === !0 && u.add(b.colId), b.hide === !1 && u.delete(b.colId), b.width && (f[b.colId] = b.width);
    },
    setFilterModel(c) {
      for (const x of Object.keys(s)) delete s[x];
      if (c)
        for (const [x, b] of Object.entries(c))
          (b == null ? void 0 : b.type) === "equals" ? s[x] = `__eq__${b.filter}` : b != null && b.filter && (s[x] = b.filter);
    },
    getFilterModel() {
      const c = {};
      for (const [x, b] of Object.entries(s))
        b && (c[x] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
      return c;
    },
    async setColumnFilterModel(c, x) {
      x ? x.type === "equals" ? s[c] = `__eq__${x.filter}` : s[c] = x.filter ?? "" : delete s[c];
    },
    onFilterChanged() {
    },
    refreshCells() {
      v.value++;
    },
    exportDataAsCsv({ fileName: c = "export.csv" } = {}) {
      const x = C.value, b = x.map((J) => J.colDef.headerName ?? J.colId).join(","), _ = ee.value.map(
        (J) => x.map((re) => `"${String(le(re, J)).replace(/"/g, '""')}"`).join(",")
      ), z = new Blob([[b, ..._].join(`
`)], { type: "text/csv" }), K = URL.createObjectURL(z);
      Object.assign(document.createElement("a"), { href: K, download: c }).click(), URL.revokeObjectURL(K);
    },
    resize() {
      var c;
      (c = l.resize) == null || c.call(l);
    },
    resetColumnState() {
      u.clear();
      for (const c of n.columnDefs())
        c.hide && u.add(B(c));
      r.value = ne();
      for (const c of Object.keys(f)) delete f[c];
      for (const c of Object.keys(s)) delete s[c];
      o.value = "", m.value = 0, F.value = null, S.value = null;
    }
  };
  function Nn() {
    var c, x;
    for (const b of n.columnDefs())
      b.hide && u.add(B(b));
    r.value.length || (r.value = ne()), a.value = ((c = n.rowData) == null ? void 0 : c.call(n)) ?? [], i.value = ((x = n.pinnedBottomRowData) == null ? void 0 : x.call(n)) ?? [];
  }
  function Gn() {
    Q && (clearInterval(Q), Q = null), t.stop();
  }
  return {
    // reactive state / derived
    scrollX: g,
    scrollY: m,
    maxScrollX: V,
    maxScrollY: Z,
    filteredRows: ee,
    displayCols: H,
    resolvedCols: C,
    aggregateRow: Se,
    rowHeights: D,
    firstVisibleRow: me,
    lastVisibleRow: ye,
    visibleRowCount: ce,
    selectedCell: F,
    selectionAnchor: k,
    hoveredRow: R,
    activeFilter: S,
    filterPopupValue: p,
    caretOn: E,
    canvasW: h,
    canvasH: w,
    screenW: I,
    screenH: L,
    sortState: r,
    colFilters: s,
    // helpers
    formatCell: le,
    getCellValue: j,
    hit: Fe,
    get resizing() {
      return Re;
    },
    get panning() {
      return A;
    },
    // viewport + scrolling
    setViewport: W,
    pageUp: ge,
    pageDown: pe,
    ensureRowVisible: N,
    ensureColVisible: se,
    // input (canvas space)
    wheel: $e,
    hover: Ve,
    leave: vt,
    pointerDown: rt,
    click: Wn,
    docClick: zn,
    keyDown: Yn,
    panStart: ht,
    panMove: it,
    panEnd: T,
    globalMove: q,
    globalUp: fe,
    // filter popup
    setFilterText: $n,
    clearFilter: fn,
    closeFilter: Vn,
    // paint / api / lifecycle
    paint: Un,
    api: Xn,
    init: Nn,
    dispose: Gn
  };
}
const Ml = ["value"], Sl = ["disabled"], Tl = ["disabled"], Cl = 28, kl = /* @__PURE__ */ Je({
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
    const e = n, l = t, a = X(null), i = En({
      columnDefs: () => e.columnDefs,
      defaultColDef: () => e.defaultColDef,
      rowData: () => e.rowData,
      pinnedBottomRowData: () => e.pinnedBottomRowData,
      rowHeight: () => e.rowHeight,
      theme: () => e.theme,
      emit: l,
      host: {
        redraw: () => j(),
        resize: () => V(),
        focusCanvas: () => {
          var A;
          return (A = k.value) == null ? void 0 : A.focus();
        },
        focusFilterInput: () => {
          var A;
          return (A = a.value) == null ? void 0 : A.focus();
        },
        blurFilterInput: () => {
          var A;
          return (A = a.value) == null ? void 0 : A.blur();
        }
      }
    }), {
      scrollY: o,
      maxScrollY: r,
      filteredRows: s,
      displayCols: f,
      selectedCell: u,
      firstVisibleRow: v,
      lastVisibleRow: h,
      activeFilter: w,
      filterPopupValue: I,
      formatCell: L,
      pageUp: m,
      pageDown: g,
      clearFilter: R
    } = i, F = X(null), k = X(null), S = St("cathodeResetTick", X(0));
    te(S, () => pe());
    let p = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), M = null, Y = !1;
    function E() {
      if (M) {
        try {
          M.forceContextLoss();
        } catch {
        }
        try {
          M.dispose();
        } catch {
        }
        M = null;
      }
    }
    let Q, B;
    const C = new Ht({
      paint: (A, { dpr: ae, glow: de }) => i.paint(A, { dpr: ae, glow: de })
    });
    function H() {
      if (!(!k.value || !F.value)) {
        try {
          M = new P.WebGLRenderer({ canvas: k.value, antialias: !1, alpha: !0 });
        } catch {
          Y = !0;
        }
        if (!Y && !M.getContext() && (M.dispose(), M = null, Y = !0), Y) {
          V();
          return;
        }
        M.setPixelRatio(1), M.setClearColor(0, 0), Q = new P.Scene(), B = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), Q.add(new P.Mesh(new P.PlaneGeometry(2, 2), C.material)), V();
      }
    }
    function V() {
      if (!F.value || !M && !Y) return;
      const A = F.value.clientWidth, ae = F.value.clientHeight - (e.pagination ? Cl : 0);
      if (!A || !ae) return;
      const de = e.bendField ? Math.round(A * In(e.curvature)) : A;
      C.resize(de, ae), C.setScreenSize(A, ae), p = C.dpr, i.setViewport(de, ae, A, ae), M ? (M.setPixelRatio(p), M.setSize(A, ae)) : k.value && (k.value.width = Math.round(A * p), k.value.height = Math.round(ae * p), k.value.style.width = A + "px", k.value.style.height = ae + "px"), j();
    }
    function j() {
      if (!C.canvas.width) return;
      if (Y) {
        if (!k.value) return;
        C.paintOnly(!1);
        const ae = C.canvas, de = k.value.getContext("2d");
        de && de.drawImage(ae, 0, 0, ae.width, ae.height, 0, 0, k.value.width, k.value.height);
        return;
      }
      if (!M) return;
      const A = e.theme === "paper";
      C.setLook({
        curvature: e.curvature,
        scanlines: e.scanlines && !A,
        vignette: !A,
        magnify: e.magnify
      }), C.syncUniforms(), C.paint(e.glow), M.render(Q, B);
    }
    function le(A, ae) {
      if (!k.value) return [-1, -1];
      const de = k.value.getBoundingClientRect(), Ge = A - de.left, Ie = ae - de.top, Ke = de.width, ot = de.height, ht = Ze(e.curvature), [it, T] = Rn(Ge, Ie, Ke, ot, ht, C.canvas.width / p || Ke, C.canvas.height / p || ot);
      return it < 0 ? [-1, -1] : [it, T];
    }
    function ie(A) {
      return le(A.clientX, A.clientY);
    }
    function ne(A) {
      if (!k.value) return 1;
      const [ae] = le(A.clientX - 4, A.clientY), [de] = le(A.clientX + 4, A.clientY);
      return ae < 0 || de < 0 ? 1 : Math.max(1, Math.abs(de - ae) / 8);
    }
    function ee(A) {
      const [ae, de] = ie(A);
      return { cx: ae, cy: de, hitScale: ne(A) };
    }
    function d(A) {
      i.wheel(A.deltaX, A.deltaY, A.shiftKey);
    }
    function y(A) {
      if (i.resizing) return;
      e.magnify && k.value && C.setLens(Tt(A, k.value));
      const ae = i.hover(ee(A));
      ae && k.value && (k.value.style.cursor = ae);
    }
    function O() {
      C.setLens(null), i.leave();
    }
    function D(A) {
      i.pointerDown(ee(A), A.clientX, A.clientY);
    }
    function G(A) {
      i.click(ee(A), A).stopPropagation && A.stopPropagation();
    }
    function U(A) {
      w.value && i.docClick(A.target === k.value ? ee(A) : null);
    }
    function $(A) {
      i.globalMove(A.clientX, A.clientY);
    }
    function Z() {
      i.globalUp();
    }
    function ce(A) {
      A.touches.length === 1 && i.panStart(A.touches[0].clientX, A.touches[0].clientY);
    }
    function me(A) {
      !i.panning || A.touches.length !== 1 || (A.preventDefault(), i.panMove(A.touches[0].clientX, A.touches[0].clientY));
    }
    function ye() {
      i.panEnd();
    }
    function Se(A) {
      i.keyDown(A);
    }
    function W(A) {
      i.setFilterText(A.target.value);
    }
    te(() => e.theme, () => j()), te(() => [e.curvature, e.bendField], () => Ae(V)), te(() => e.scanlines, () => j()), te(() => e.glow, () => j()), te(() => e.magnify, (A) => {
      A || C.setLens(null), j();
    });
    let N = null, se = null, ge = 0;
    function pe() {
      cancelAnimationFrame(ge), ge = requestAnimationFrame(V);
    }
    function Re(A) {
      A.preventDefault();
    }
    function Ye() {
      M == null || M.dispose(), M = null, Y = !1, H();
    }
    Xe(() => {
      i.init(), document.addEventListener("click", U), document.addEventListener("mousemove", $), document.addEventListener("mouseup", Z), Ae(() => {
        var A;
        H(), k.value && (k.value.addEventListener("webglcontextlost", Re), k.value.addEventListener("webglcontextrestored", Ye)), F.value && (N = new ResizeObserver(() => V()), N.observe(F.value), se = new IntersectionObserver((ae) => {
          ae.some((de) => de.isIntersecting) && pe();
        }), se.observe(F.value)), window.addEventListener("resize", pe), (A = window.visualViewport) == null || A.addEventListener("resize", pe), l("grid-ready", { api: i.api });
      });
    }), et(() => {
      var A, ae, de;
      document.removeEventListener("click", U), document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", Z), (A = k.value) == null || A.removeEventListener("webglcontextlost", Re), (ae = k.value) == null || ae.removeEventListener("webglcontextrestored", Ye), N == null || N.disconnect(), se == null || se.disconnect(), window.removeEventListener("resize", pe), (de = window.visualViewport) == null || de.removeEventListener("resize", pe), cancelAnimationFrame(ge), E(), C.dispose(), i.dispose();
    });
    const Pe = ue(() => pt[e.theme] ?? pt.none), Ne = ue(() => ({
      background: Pe.value.headerBg,
      borderTop: `1px solid ${Pe.value.border}`,
      color: Pe.value.text
    })), He = ue(() => ({
      background: Pe.value.bg
    })), _e = ue(() => Pe.value.accent);
    return (A, ae) => {
      var de, Ge;
      return be(), Me("div", {
        ref_key: "wrapEl",
        ref: F,
        class: "cathode-wrap",
        style: qe(He.value)
      }, [
        he("canvas", {
          ref_key: "canvasEl",
          ref: k,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ut(d, ["prevent"]),
          onMousemove: y,
          onMouseleave: O,
          onMousedown: D,
          onClick: G,
          onKeydown: Se,
          onTouchstartPassive: ce,
          onTouchmove: me,
          onTouchend: ye,
          onTouchcancel: ye
        }, null, 544),
        ve(w) ? (be(), Me("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: a,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: ve(I),
          autofocus: "",
          onInput: W,
          onKeydown: [
            ae[0] || (ae[0] = mn(
              //@ts-ignore
              (...Ie) => ve(R) && ve(R)(...Ie),
              ["escape"]
            )),
            ae[1] || (ae[1] = mn((Ie) => ve(i).closeFilter(), ["enter"]))
          ]
        }, null, 40, Ml)) : je("", !0),
        n.pagination ? (be(), Me("div", {
          key: 1,
          class: "cathode-pagination",
          style: qe(Ne.value)
        }, [
          he("button", {
            disabled: ve(o) <= 0,
            onClick: ae[2] || (ae[2] = (Ie) => ve(m)())
          }, "◀", 8, Sl),
          he("span", null, Ue((ve(v) + 1).toLocaleString()) + "–" + Ue(Math.min(ve(s).length, ve(h) + 1).toLocaleString()) + " / " + Ue(ve(s).length.toLocaleString()), 1),
          he("button", {
            disabled: ve(o) >= ve(r),
            onClick: ae[3] || (ae[3] = (Ie) => ve(g)())
          }, "▶", 8, Tl),
          he("span", {
            class: "cathode-page-info",
            style: qe({ color: _e.value })
          }, Ue(ve(s).length.toLocaleString()) + " rows ", 5),
          ve(u) ? (be(), Me("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: qe({ color: _e.value })
          }, Ue(((de = ve(f)[ve(u).col]) == null ? void 0 : de.colDef.headerName) ?? ((Ge = ve(f)[ve(u).col]) == null ? void 0 : Ge.colId)) + " : " + Ue(ve(L)(ve(f)[ve(u).col], ve(s)[ve(u).row])), 5)) : je("", !0)
        ], 4)) : je("", !0)
      ], 4);
    };
  }
}), tt = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [l, a] of t)
    e[l] = a;
  return e;
}, Ya = /* @__PURE__ */ tt(kl, [["__scopeId", "data-v-3f5baab2"]]), Et = {
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
function Ll(n, t) {
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
const Rl = 12, ke = 18, Mt = 10, ft = 6, on = `${Rl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Il(n, t, e) {
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
    const i = a.split(/(\s+)/);
    let o = "";
    for (const r of i) {
      const s = o + r;
      if (n.measureText(s).width <= e)
        o = s;
      else if (o && (l.push(o.replace(/\s+$/, "")), o = ""), n.measureText(r).width > e) {
        let f = "";
        for (const u of r)
          n.measureText(f + u).width > e ? (f && l.push(f), f = u) : f += u;
        o = f;
      } else
        o = r.replace(/^\s+/, "");
    }
    o && l.push(o.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Fn(n) {
  if (typeof n == "number") {
    const t = new Date(n), e = String(t.getHours()).padStart(2, "0"), l = String(t.getMinutes()).padStart(2, "0"), a = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return n;
}
function Dl(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function El(n) {
  const { entries: t, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: i } = n, o = n.formatTs ?? Fn;
  e.font = on;
  const r = [];
  for (let s = 0; s < t.length; s++) {
    const f = t[s], u = f.level ?? "info", v = a && f.ts != null ? o(f.ts) : "", h = i ? Il(e, f.text, l) : f.text.split(`
`);
    for (let w = 0; w < h.length; w++)
      r.push({
        entryIdx: s,
        text: h[w],
        level: u,
        timestamp: w === 0 ? v : "",
        isFirstFrag: w === 0,
        widthPx: e.measureText(h[w]).width
      });
  }
  return r;
}
function wn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = n.width, a = n.height, i = Et[t.theme] ?? Et.none;
  e.clearRect(0, 0, l, a), e.fillStyle = i.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = on, e.textBaseline = "middle";
  const o = t.visualLines, r = Mt - t.scrollX, s = (t.showTimestamps ? Mt + t.timestampWidth : Mt) - t.scrollX, f = Math.max(0, Math.floor((t.scrollY - ft) / ke)), u = Math.min(o.length, Math.ceil((t.scrollY + a - ft) / ke) + 1);
  for (let v = f; v < u; v++) {
    const h = o[v], w = ft + v * ke - t.scrollY + ke / 2;
    if (h.entryIdx % 2 === 1 && h.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let L = 1;
      for (; v + L < u && o[v + L].entryIdx === h.entryIdx; ) L++;
      e.fillRect(0, w - ke / 2, l, ke * L);
    }
    t.selectionStart >= 0 && v >= t.selectionStart && v <= t.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, w - ke / 2, l, ke)), v === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, w - ke / 2, l, ke)), t.showTimestamps && h.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(h.timestamp, r, w), e.shadowBlur = 0);
    const I = Ll(i, h.level);
    e.fillStyle = I, e.textAlign = "left", t.glow ? (e.shadowColor = I, e.shadowBlur = 14, e.fillText(h.text, s, w), e.shadowBlur = 7, e.fillText(h.text, s, w), e.shadowBlur = 3, e.fillText(h.text, s, w), e.shadowBlur = 0) : e.fillText(h.text, s, w);
  }
  e.restore();
}
function yn(n, t, e) {
  if (n < 0) return -1;
  const l = Math.floor((n + t - ft) / ke);
  return l < 0 || l >= e ? -1 : l;
}
function Fl(n) {
  return ft * 2 + n * ke;
}
const Al = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Pl = /* @__PURE__ */ Je({
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
    const e = n, l = X(null), a = X(null), i = { ...Ce }, o = X(0), r = X(0), s = X(0), f = X(-1), u = X(!0), v = X(-1), h = X(-1), w = ue(() => {
      const T = e.entries ?? [];
      return e.maxLines > 0 && T.length > e.maxLines ? T.slice(T.length - e.maxLines) : T;
    }), I = ue(() => {
      if (!e.showTimestamps) return "";
      const T = e.formatTs ?? Fn;
      let q = "00:00:00";
      for (const fe of w.value) {
        if (fe.ts == null) continue;
        const Fe = T(fe.ts);
        Fe.length > q.length && (q = Fe);
      }
      return q;
    }), L = X(0), m = X([]);
    function g() {
      if (!V) return;
      const T = V.getContext("2d");
      if (!T) return;
      T.font = on;
      const q = e.showTimestamps ? Dl(T, I.value) : 0;
      L.value = q;
      const fe = Math.max(
        1,
        o.value - Mt * 2 - q
      );
      m.value = El({
        entries: w.value,
        ctx: T,
        textMaxWidth: fe,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const R = ue(() => Fl(m.value.length)), F = ue(() => Math.max(0, R.value - r.value)), k = ue(() => {
      let T = 0;
      for (const q of m.value) q.widthPx > T && (T = q.widthPx);
      return Mt * 2 + L.value + T;
    }), S = ue(() => Math.max(0, k.value - o.value)), p = X(0);
    te(F, () => {
      u.value ? s.value = F.value : s.value = Math.min(s.value, F.value);
    }), te(S, () => {
      p.value = Math.min(p.value, S.value);
    }), te(
      [w, o, () => e.showTimestamps, () => e.wordWrap, I],
      () => {
        g(), Ae(ne);
      },
      { deep: !1 }
    );
    let M = null, Y = !1;
    function E() {
      if (M) {
        try {
          M.forceContextLoss();
        } catch {
        }
        try {
          M.dispose();
        } catch {
        }
        M = null;
      }
    }
    let Q, B, C, H, V;
    const j = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${_t}

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

  ${Bt}

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

    ${Wt}

    gl_FragColor = color;
  }
`;
    function le() {
      if (!(!a.value || !l.value)) {
        V = document.createElement("canvas");
        try {
          M = new P.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          Y = !0;
        }
        if (!Y && !M.getContext() && (M.dispose(), M = null, Y = !0), Y) {
          ie();
          return;
        }
        M.setPixelRatio(1), M.setClearColor(0, 0), Q = new P.Scene(), B = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), H = new P.CanvasTexture(V), H.minFilter = P.LinearFilter, H.magFilter = P.LinearFilter, C = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: H },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...zt()
          },
          vertexShader: Al,
          fragmentShader: j,
          transparent: !0
        }), Q.add(new P.Mesh(new P.PlaneGeometry(2, 2), C)), ie();
      }
    }
    function ie() {
      if (!l.value || !M && !Y) return;
      const T = l.value.clientWidth, q = l.value.clientHeight;
      if (!T || !q) return;
      const fe = V.width !== T || V.height !== q;
      fe && (V.width = T, V.height = q, o.value = T, r.value = q, g(), M ? (fe && H && (H.dispose(), H = new P.CanvasTexture(V), H.minFilter = P.LinearFilter, H.magFilter = P.LinearFilter, C && (C.uniforms.uTex.value = H)), M.setPixelRatio(window.devicePixelRatio || 1), M.setSize(T, q)) : a.value && (a.value.width = T, a.value.height = q, a.value.style.width = T + "px", a.value.style.height = q + "px"), u.value && (s.value = Math.max(0, R.value - r.value)), ne());
    }
    function ne() {
      if (!(V != null && V.width)) return;
      if (Y) {
        if (!a.value) return;
        wn(V, {
          visualLines: m.value,
          scrollY: s.value,
          scrollX: p.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: L.value,
          hoveredLine: f.value,
          selectionStart: Math.min(v.value, h.value),
          selectionEnd: Math.max(v.value, h.value)
        });
        const q = a.value.getContext("2d");
        q && q.drawImage(V, 0, 0);
        return;
      }
      if (!M || !C || !H) return;
      const T = e.theme === "paper";
      C.uniforms.uStrength.value = Ze(e.curvature), C.uniforms.uScanlines.value = e.scanlines && !T ? 1 : 0, C.uniforms.uVignette.value = T ? 0 : 1, Yt(C, e.magnify, i, V.width, V.height), wn(V, {
        visualLines: m.value,
        scrollY: s.value,
        scrollX: p.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: L.value,
        hoveredLine: f.value,
        selectionStart: Math.min(v.value, h.value),
        selectionEnd: Math.max(v.value, h.value)
      }), H.needsUpdate = !0, M.render(Q, B);
    }
    te(() => e.theme, () => ne()), te(() => e.curvature, () => ne()), te(() => e.scanlines, () => ne()), te(() => e.glow, () => ne()), te(() => e.magnify, (T) => {
      T || (i.x = Ce.x, i.y = Ce.y), ne();
    }), te(s, () => ne()), te(p, () => ne()), te(f, () => ne()), te([v, h], () => ne());
    function ee(T) {
      if (!a.value) return [-1, -1];
      const q = a.value.getBoundingClientRect();
      return [T.clientX - q.left, T.clientY - q.top];
    }
    function d(T) {
      s.value = Math.max(0, Math.min(F.value, T)), u.value = s.value >= F.value - 4;
    }
    function y(T) {
      p.value = Math.max(0, Math.min(S.value, T));
    }
    function O(T) {
      T.shiftKey ? y(p.value + T.deltaY) : Math.abs(T.deltaX) > Math.abs(T.deltaY) ? y(p.value + T.deltaX) : d(s.value + T.deltaY);
    }
    let D = !1, G = 0, U = 0, $ = 0, Z = 0, ce = !1;
    function me(T) {
      D = !0, ce = !1, G = T.clientX, U = T.clientY, $ = p.value, Z = s.value, l.value && l.value.focus();
    }
    function ye(T) {
      if (D) {
        const q = G - T.clientX, fe = U - T.clientY;
        (Math.abs(q) > 4 || Math.abs(fe) > 4) && (ce = !0), y($ + q), d(Z + fe);
      }
    }
    function Se() {
      D && (D = !1, ce && (ce = !1));
    }
    function W(T) {
      if (T.touches.length !== 1) return;
      const q = T.touches[0];
      D = !0, ce = !1, G = q.clientX, U = q.clientY, $ = p.value, Z = s.value, l.value && l.value.focus();
    }
    function N(T) {
      if (!D || T.touches.length !== 1) return;
      T.preventDefault();
      const q = T.touches[0], fe = G - q.clientX, Fe = U - q.clientY;
      (Math.abs(fe) > 4 || Math.abs(Fe) > 4) && (ce = !0), y($ + fe), d(Z + Fe);
    }
    function se() {
      D && (D = !1, ce && (ce = !1));
    }
    function ge(T) {
      const [, q] = ee(T);
      return q < 0 ? -1 : yn(q, s.value, m.value.length);
    }
    function pe(T) {
      if (ce) {
        ce = !1;
        return;
      }
      const q = ge(T);
      if (q < 0) {
        v.value = -1, h.value = -1;
        return;
      }
      T.shiftKey && v.value >= 0 || (v.value = q), h.value = q;
    }
    function Re(T, q) {
      const fe = m.value.length;
      if (fe === 0) return;
      const Fe = h.value < 0 ? 0 : h.value;
      let Be = Math.max(0, Math.min(fe - 1, Fe + T));
      h.value = Be, (!q || v.value < 0) && (v.value = Be), f.value = Be;
      const $e = ft + Be * ke, Ve = $e + ke;
      $e < s.value ? d($e) : Ve > s.value + r.value && d(Ve - r.value);
    }
    function Ye() {
      const T = Math.min(v.value, h.value), q = Math.max(v.value, h.value);
      if (T < 0) return "";
      const fe = m.value, Fe = /* @__PURE__ */ new Set(), Be = [];
      for (let $e = T; $e <= q && $e < fe.length; $e++) {
        const Ve = fe[$e];
        if (Fe.has(Ve.entryIdx)) continue;
        Fe.add(Ve.entryIdx);
        let vt = "";
        for (let rt = 0; rt < fe.length; rt++)
          fe[rt].entryIdx === Ve.entryIdx && (vt += (vt && !fe[rt].isFirstFrag ? " " : "") + fe[rt].text);
        Be.push(Ve.timestamp ? `${Ve.timestamp}  ${vt}` : vt);
      }
      return Be.join(`
`);
    }
    async function Pe() {
      const T = Ye();
      if (T)
        try {
          await navigator.clipboard.writeText(T);
        } catch {
          const q = document.createElement("textarea");
          q.value = T, q.style.position = "fixed", q.style.opacity = "0", document.body.appendChild(q), q.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(q);
        }
    }
    function Ne(T) {
      if ((T.metaKey || T.ctrlKey) && (T.key === "c" || T.key === "C")) {
        v.value >= 0 && (T.preventDefault(), Pe());
        return;
      }
      if ((T.metaKey || T.ctrlKey) && (T.key === "a" || T.key === "A")) {
        T.preventDefault(), v.value = 0, h.value = m.value.length - 1;
        return;
      }
      switch (T.key) {
        case "ArrowDown":
          T.preventDefault(), Re(1, T.shiftKey);
          break;
        case "ArrowUp":
          T.preventDefault(), Re(-1, T.shiftKey);
          break;
        case "ArrowRight":
          T.preventDefault(), y(p.value + ke * 2);
          break;
        case "ArrowLeft":
          T.preventDefault(), y(p.value - ke * 2);
          break;
        case "PageDown":
          T.preventDefault(), d(s.value + r.value);
          break;
        case "PageUp":
          T.preventDefault(), d(s.value - r.value);
          break;
        case "Home":
          T.preventDefault(), d(0), y(0);
          break;
        case "End":
          T.preventDefault(), d(F.value);
          break;
        case "Escape":
          v.value = -1, h.value = -1;
          break;
      }
    }
    function He(T) {
      if (e.magnify && a.value) {
        const fe = Tt(T, a.value);
        i.x = fe.x, i.y = fe.y, ne();
      }
      const [, q] = ee(T);
      if (q < 0) {
        f.value = -1;
        return;
      }
      f.value = yn(q, s.value, m.value.length);
    }
    function _e() {
      f.value = -1, i.x = Ce.x, i.y = Ce.y, ne();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, s.value = F.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(T) {
        d(ft + T * ke);
      }
    });
    let A = null, ae = null, de = 0;
    const Ge = St("cathodeResetTick", X(0));
    te(Ge, () => Ie());
    function Ie() {
      cancelAnimationFrame(de), de = requestAnimationFrame(ie);
    }
    function Ke(T) {
      T.preventDefault();
    }
    function ot() {
      M == null || M.dispose(), M = null, Y = !1, le();
    }
    Xe(() => {
      document.addEventListener("mousemove", ye), document.addEventListener("mouseup", Se), Ae(() => {
        var T;
        le(), a.value && (a.value.addEventListener("webglcontextlost", Ke), a.value.addEventListener("webglcontextrestored", ot)), l.value && (A = new ResizeObserver(() => ie()), A.observe(l.value), ae = new IntersectionObserver((q) => {
          q.some((fe) => fe.isIntersecting) && Ie();
        }), ae.observe(l.value)), window.addEventListener("resize", Ie), (T = window.visualViewport) == null || T.addEventListener("resize", Ie), s.value = F.value;
      });
    }), et(() => {
      var T, q, fe;
      document.removeEventListener("mousemove", ye), document.removeEventListener("mouseup", Se), (T = a.value) == null || T.removeEventListener("webglcontextlost", Ke), (q = a.value) == null || q.removeEventListener("webglcontextrestored", ot), A == null || A.disconnect(), ae == null || ae.disconnect(), window.removeEventListener("resize", Ie), (fe = window.visualViewport) == null || fe.removeEventListener("resize", Ie), cancelAnimationFrame(de), E();
    });
    const ht = ue(() => Et[e.theme] ?? Et.none), it = ue(() => ({
      background: ht.value.bg
    }));
    return (T, q) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: qe(it.value),
      tabindex: "0",
      onKeydown: Ne
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: ut(O, ["prevent"]),
        onMousemove: He,
        onMouseleave: _e,
        onMousedown: me,
        onClick: pe,
        onTouchstartPassive: W,
        onTouchmove: N,
        onTouchend: se,
        onTouchcancel: se
      }, null, 544)
    ], 36));
  }
}), _l = /* @__PURE__ */ tt(Pl, [["__scopeId", "data-v-d6dc9e79"]]), Bl = ["disabled"], Wl = /* @__PURE__ */ Je({
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
    const l = n, a = e, i = X(null), o = X(null), r = X(""), s = X([]), f = X(-1);
    let u = "";
    function v(S) {
      S.trim() && (s.value.length && s.value[s.value.length - 1] === S || (s.value.push(S), s.value.length > l.historyLimit && s.value.splice(0, s.value.length - l.historyLimit)));
    }
    function h(S) {
      if (!l.disabled) {
        if (S.key === "Enter") {
          S.preventDefault();
          const p = r.value;
          p.trim() && v(p), f.value = -1, r.value = "", a("submit", p);
          return;
        }
        if (S.key === "ArrowUp") {
          if (!s.value.length) return;
          S.preventDefault(), f.value === -1 ? (u = r.value, f.value = s.value.length - 1) : f.value > 0 && f.value--, r.value = s.value[f.value];
          return;
        }
        if (S.key === "ArrowDown") {
          if (f.value === -1) return;
          S.preventDefault(), f.value < s.value.length - 1 ? (f.value++, r.value = s.value[f.value]) : (f.value = -1, r.value = u, u = "");
          return;
        }
      }
    }
    const w = X(!0);
    let I = null;
    function L() {
      I || (I = setInterval(() => {
        w.value = !w.value;
      }, 530));
    }
    function m() {
      I && (clearInterval(I), I = null), w.value = !0;
    }
    const g = ue(() => {
      let S;
      return l.disabled ? S = " " : l.busy ? S = "█" : S = w.value ? "█" : " ", { level: "info", text: `${l.prompt}${r.value}${S}` };
    }), R = ue(
      () => [...l.entries, g.value]
    );
    function F() {
      var S;
      l.disabled || (S = o.value) == null || S.focus();
    }
    te(() => l.busy, (S, p) => {
      p && !S && !l.disabled && Ae(() => {
        var M;
        return (M = o.value) == null ? void 0 : M.focus();
      });
    });
    function k() {
      var S;
      (S = o.value) == null || S.focus();
    }
    return t({ focus: k }), Xe(() => {
      L(), l.disabled || requestAnimationFrame(() => {
        var S;
        return (S = o.value) == null ? void 0 : S.focus();
      });
    }), et(() => {
      m();
    }), (S, p) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: F
    }, [
      Sn(_l, {
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
      Tn(he("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": p[0] || (p[0] = (M) => r.value = M),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: h
      }, null, 40, Bl), [
        [Zn, r.value]
      ])
    ], 512));
  }
}), Ha = /* @__PURE__ */ tt(Wl, [["__scopeId", "data-v-a2b39934"]]), wt = {
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
}, zl = 0.18, yt = 8, rn = 22, Yl = 4, ze = 8, lt = 56, sn = 42, Qe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Hl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Gt = 4, $l = 1, Vl = 1;
function Ol(n, t, e, l = 0, a = !1) {
  const i = a ? sn : lt, o = Math.max(0, t - ze - i), r = Math.max(1, Math.floor(o / e)), s = Math.min(r, n);
  return { firstIdx: Math.max(0, n - s - Math.floor(l / e)), count: s, slotW: e };
}
function Ul(n, t, e) {
  if (!n.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, i = 0;
  const o = Math.min(n.length, t + e);
  for (let s = t; s < o; s++) {
    const f = n[s];
    f && (f.low < l && (l = f.low), f.high > a && (a = f.high), f.volume > i && (i = f.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const s = isFinite(l) ? l : 0;
    return { min: s - 1, max: s + 1, maxVol: Math.max(1, i) };
  }
  const r = (a - l) * 0.04;
  return { min: l - r, max: a + r, maxVol: Math.max(1, i) };
}
function Xl(n, t, e = !1) {
  const l = e ? Yl : rn, a = Math.max(1, n - yt - l - Gt), i = Math.max(0, Math.round(a * t)), o = a - i;
  return {
    priceY0: yt,
    priceY1: yt + o,
    volumeY0: yt + o + Gt,
    volumeY1: yt + o + Gt + i
  };
}
function We(n, t, e, l) {
  const a = t.max - t.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (n - t.min) / a) * (l - e);
}
function at(n, t, e) {
  return ze + (n - t + 0.5) * e;
}
function nt(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function cn(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0"), a = String(t.getHours()).padStart(2, "0"), i = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${i}`;
}
function Nl(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let i;
  return a < 1.5 ? i = 1 : a < 3 ? i = 2 : a < 7 ? i = 5 : i = 10, i * l;
}
function en(n, t) {
  var I, L, m, g, R;
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const a = n.width / l, i = n.height / l, o = wt[t.theme] ?? wt.none, r = t.colors ? { ...o, ...t.colors } : o, s = !!t.compact;
  if (e.clearRect(0, 0, a, i), e.fillStyle = r.bg, e.fillRect(0, 0, a, i), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, a, i), e.clip();
  const f = Ol(t.candles.length, a, t.slotW, t.scrollX, s), u = Ul(t.candles, f.firstIdx, f.count), v = Xl(i, t.showVolume ? t.volumeFraction : 0, s), h = Math.max($l, Math.floor(t.slotW * 0.7)), w = Math.min(t.candles.length, f.firstIdx + f.count);
  for (let F = f.firstIdx; F < w; F++) {
    const k = t.candles[F];
    if (!k) continue;
    const S = at(F, f.firstIdx, t.slotW), p = We(k.open, u, v.priceY0, v.priceY1), M = We(k.close, u, v.priceY0, v.priceY1), Y = We(k.high, u, v.priceY0, v.priceY1), E = We(k.low, u, v.priceY0, v.priceY1), Q = k.close >= k.open, B = Q ? r.wickBull : r.wickBear, C = Q ? r.candleBull : r.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = C), e.strokeStyle = B, e.lineWidth = Vl, e.beginPath(), e.moveTo(Math.round(S) + 0.5, Y), e.lineTo(Math.round(S) + 0.5, E), e.stroke(), e.fillStyle = C;
    const H = Math.min(p, M), V = Math.max(1, Math.abs(M - p)), j = Math.round(S - h / 2), le = Math.round(H), ie = Math.round(V);
    if (e.fillRect(j, le, h, ie), t.glow && (e.shadowBlur = 4, e.fillRect(j, le, h, ie)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const ne = Math.round(k.volume / u.maxVol * (v.volumeY1 - v.volumeY0));
      ne > 0 && (e.fillStyle = Q ? r.volumeBull : r.volumeBear, e.fillRect(
        Math.round(S - h / 2),
        v.volumeY1 - ne,
        h,
        ne
      ));
    }
  }
  if ((I = t.overlays) != null && I.length) {
    const F = { above: 0, below: 0 }, k = t.overlays.filter((p) => p.kind !== "hline" && !!p.label).length, S = k ? 14 + 14 * k + 12 : 8;
    for (const p of t.overlays)
      p.kind === "hline" ? Kl(e, p, a, u, v, r, s, F, S) : Gl(e, p, f, u, v, t.slotW);
  }
  (L = t.markers) != null && L.length && na(e, r, t.markers, t.candles, f, u, v, t.slotW), la(e, r, u, v, a, s), s || (aa(e, r, t.candles, f, t.slotW, i), ea(e, r, t.candles, a, i)), (m = t.overlays) != null && m.length && jl(e, r, t.overlays, v), t.hover && (oa(e, r, t.candles, f, u, v, t.slotW, t.hover, a), Zl(e, r, t.candles, f, t.slotW, t.hover, v, ((g = t.overlays) == null ? void 0 : g.length) ?? 0), (R = t.markers) != null && R.length && Jl(e, r, t.markers, t.candles, f, u, v, t.slotW, t.hover, a)), e.restore();
}
function Gl(n, t, e, l, a, i) {
  var r;
  const o = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    ze,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), n.clip(), t.kind === "line")
    Lt(n, t.data, e.firstIdx, o, i, l, a, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const s = An(t.color, t.fillAlpha ?? 0.08);
    ql(n, t.upper, t.lower, e.firstIdx, o, i, l, a, s), Lt(n, t.upper, e.firstIdx, o, i, l, a, t.color, 1, !1), Lt(n, t.lower, e.firstIdx, o, i, l, a, t.color, 1, !1), (r = t.middle) != null && r.length && Lt(n, t.middle, e.firstIdx, o, i, l, a, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function Kl(n, t, e, l, a, i, o, r = { above: 0, below: 0 }, s = 8) {
  const f = We(t.price, l, a.priceY0, a.priceY1), u = f < a.priceY0 - 0.5, v = f > a.priceY1 + 0.5, h = u || v, w = h ? u ? r.above++ : r.below++ : 0, I = h ? u ? a.priceY0 + s + w * 20 : a.priceY1 - 8 - w * 20 : f, L = o ? sn : lt, m = Math.round(I) + 0.5;
  n.save(), h || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo(ze, m), n.lineTo(e - L, m), n.stroke(), n.setLineDash([]));
  let g = t.label ?? nt(t.price);
  if (h && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    n.font = Qe, n.textBaseline = "middle", n.textAlign = "left";
    const R = n.measureText(g).width, F = 4, k = 2, S = ze + 2;
    n.fillStyle = t.color, h && (n.globalAlpha = 0.85), n.fillRect(S, I - 7 - k, R + F * 2, 14 + k * 2), n.globalAlpha = 1, n.fillStyle = i.bg && !i.bg.startsWith("rgba(0,0,0,0)") ? i.bg : "#0d1520", n.fillText(g, S + F, I);
  }
  n.restore();
}
function Lt(n, t, e, l, a, i, o, r, s, f) {
  if (!t || !t.length) return;
  n.strokeStyle = r, n.lineWidth = s, n.setLineDash(f ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let v = e; v < l; v++) {
    const h = t[v];
    if (typeof h != "number" || !isFinite(h)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const w = at(v, e, a), I = We(h, i, o.priceY0, o.priceY1);
    u ? n.lineTo(w, I) : (n.moveTo(w, I), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function ql(n, t, e, l, a, i, o, r, s) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = s;
  let f = !1, u = -1;
  for (let v = l; v <= a; v++) {
    const h = t[v], w = e[v], I = v < a && typeof h == "number" && typeof w == "number" && isFinite(h) && isFinite(w);
    if (I && !f && (u = v, f = !0), !I && f || v === a && f) {
      const L = I ? v + 1 : v;
      n.beginPath();
      for (let m = u; m < L; m++) {
        const g = at(m, l, i), R = We(t[m], o, r.priceY0, r.priceY1);
        m === u ? n.moveTo(g, R) : n.lineTo(g, R);
      }
      for (let m = L - 1; m >= u; m--) {
        const g = at(m, l, i), R = We(e[m], o, r.priceY0, r.priceY1);
        n.lineTo(g, R);
      }
      n.closePath(), n.fill(), f = !1;
    }
  }
}
function An(n, t) {
  const e = Math.max(0, Math.min(1, t));
  if (n.startsWith("#") && n.length === 7) {
    const l = parseInt(n.slice(1, 3), 16), a = parseInt(n.slice(3, 5), 16), i = parseInt(n.slice(5, 7), 16);
    return `rgba(${l},${a},${i},${e})`;
  }
  return n.startsWith("rgba") ? n.replace(/[\d.]+\)$/, `${e})`) : n.startsWith("rgb(") ? n.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : n;
}
function jl(n, t, e, l) {
  const a = e.filter((L) => L.kind !== "hline" && !!L.label);
  if (!a.length) return;
  n.save(), n.font = Qe;
  const i = 8, o = 5, r = 12, s = 6, f = 14;
  let u = 0;
  for (const L of a) {
    const m = n.measureText(L.label).width;
    m > u && (u = m);
  }
  const v = i * 2 + r + s + u, h = o * 2 + f * a.length, w = ze + 4, I = l.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(w, I, v, h), n.textBaseline = "middle", n.textAlign = "left";
  for (let L = 0; L < a.length; L++) {
    const m = a[L], g = I + o + f * (L + 0.5), R = w + i;
    m.kind === "line" ? (n.strokeStyle = m.color, n.lineWidth = m.lineWidth ?? 1, n.setLineDash(m.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(R, g), n.lineTo(R + r, g), n.stroke(), n.setLineDash([])) : m.kind === "band" && (n.fillStyle = An(m.color, m.fillAlpha ?? 0.2), n.fillRect(R, g - 4, r, 8), n.strokeStyle = m.color, n.lineWidth = 1, n.strokeRect(R + 0.5, g - 4 + 0.5, r - 1, 7)), n.fillStyle = t.text, n.fillText(m.label, R + r + s, g);
  }
  n.restore();
}
function Zl(n, t, e, l, a, i, o, r) {
  const s = Math.floor((i.x - ze) / a), f = l.firstIdx + s;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const v = u.close - u.open, h = u.open !== 0 ? v / u.open * 100 : 0, w = v >= 0 ? "+" : "", I = [
    ["O", nt(u.open), void 0],
    ["H", nt(u.high), void 0],
    ["L", nt(u.low), void 0],
    ["C", nt(u.close), void 0],
    ["V", Ql(u.volume), void 0],
    ["", `${w}${h.toFixed(2)}%`, v >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = Qe, n.textBaseline = "middle", n.textAlign = "left";
  const L = 8, m = 4, g = 14;
  let R = L;
  for (const [p, M] of I) {
    const Y = p ? `${p} ${M}` : M, E = n.measureText(Y).width + 12;
    R += E;
  }
  R += L - 12;
  const F = o.priceY0 + 4 + (r > 0 ? m * 2 + 14 * r + 4 : 0), k = ze + 4;
  n.fillStyle = t.panelBg, n.fillRect(k, F, R, g + m * 2);
  let S = k + L;
  for (let p = 0; p < I.length; p++) {
    const [M, Y, E] = I[p];
    n.fillStyle = t.text, M && (n.globalAlpha = 0.6, n.fillText(M + " ", S, F + m + g / 2), n.globalAlpha = 1, S += n.measureText(M + " ").width), E && (n.fillStyle = E), n.fillText(Y, S, F + m + g / 2), S += n.measureText(Y).width + 12;
  }
  n.restore();
}
function Ql(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function Jl(n, t, e, l, a, i, o, r, s, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, v = Math.max(1, u * 0.5), h = Math.min(l.length, a.firstIdx + a.count), w = 9;
  let I = null;
  for (const Y of e) {
    let E = 0, Q = l.length - 1, B = -1;
    for (; E <= Q; ) {
      const V = E + Q >> 1, j = l[V].start - Y.timestamp;
      if (Math.abs(j) <= v) {
        B = V;
        break;
      }
      j < 0 ? E = V + 1 : Q = V - 1;
    }
    if (B < 0 || B < a.firstIdx || B >= h) continue;
    const C = at(B, a.firstIdx, r), H = We(Y.price, i, o.priceY0, o.priceY1);
    if (Math.abs(s.x - C) <= w && Math.abs(s.y - H) <= w) {
      I = { m: Y, x: C, y: H };
      break;
    }
  }
  if (!I) return;
  const L = cn(I.m.timestamp), m = [
    `${I.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${L}`,
    `@ ${nt(I.m.price)}`
  ];
  I.m.label && m.push(I.m.label), n.save(), n.font = Qe, n.textBaseline = "top", n.textAlign = "left";
  const g = 6, R = 14;
  let F = 0;
  for (const Y of m) {
    const E = n.measureText(Y).width;
    E > F && (F = E);
  }
  const k = F + g * 2, S = m.length * R + g * 2;
  let p = I.x + 12;
  p + k > f - lt && (p = I.x - 12 - k);
  let M = I.y - S / 2;
  M < o.priceY0 && (M = o.priceY0), M + S > o.priceY1 && (M = o.priceY1 - S), n.fillStyle = t.panelBgSolid, n.strokeStyle = I.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(p, M, k, S), n.strokeRect(p + 0.5, M + 0.5, k - 1, S - 1);
  for (let Y = 0; Y < m.length; Y++) {
    const E = m[Y];
    n.fillStyle = Y === 0 ? I.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(E, p + g, M + g + Y * R);
  }
  n.restore();
}
function ea(n, t, e, l, a) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, o = ta(i);
  if (!o) return;
  n.save(), n.font = Qe, n.textBaseline = "top", n.textAlign = "right";
  const r = 6, s = 3, f = n.measureText(o).width, u = l - lt - r, v = a - rn + 4;
  n.fillStyle = t.accent, n.fillRect(u - f - r, v - s, f + r * 2, 14 + s * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(o, u, v), n.restore();
}
function ta(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, l = 60 * e, a = 24 * l, i = 7 * a;
  return n >= i && n % i === 0 ? n / i + "W" : n >= a && n % a === 0 ? n / a + "D" : n >= l && n % l === 0 ? n / l + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function na(n, t, e, l, a, i, o, r) {
  if (!l.length) return;
  const s = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, s * 0.5), u = Math.min(l.length, a.firstIdx + a.count), v = (w) => {
    let I = 0, L = l.length - 1;
    for (; I <= L; ) {
      const m = I + L >> 1, g = l[m].start - w;
      if (Math.abs(g) <= f) return m;
      g < 0 ? I = m + 1 : L = m - 1;
    }
    return -1;
  }, h = 7;
  for (const w of e) {
    const I = v(w.timestamp);
    if (I < 0 || I < a.firstIdx || I >= u) continue;
    const L = at(I, a.firstIdx, r), m = We(w.price, i, o.priceY0, o.priceY1);
    if (m < o.priceY0 || m > o.priceY1) continue;
    const g = w.color ?? (w.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = g, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), w.kind === "entry" ? (n.moveTo(L, m - h), n.lineTo(L - h, m + h - 1), n.lineTo(L + h, m + h - 1)) : (n.moveTo(L, m + h), n.lineTo(L - h, m - h + 1), n.lineTo(L + h, m - h + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function la(n, t, e, l, a, i = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const r = l.priceY1 - l.priceY0, s = i ? Math.max(2, Math.min(4, Math.round(r / 36))) : 6, f = Nl(o, s), u = Math.ceil(e.min / f) * f, v = i ? sn : lt;
  n.font = i ? Hl : Qe, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let h = u; h <= e.max; h += f) {
    const w = We(h, e, l.priceY0, l.priceY1);
    w < l.priceY0 || w > l.priceY1 || (n.beginPath(), n.moveTo(ze, Math.round(w) + 0.5), n.lineTo(a - v, Math.round(w) + 0.5), n.stroke(), n.fillText(nt(h), a - v + 3, w));
  }
  n.globalAlpha = 1;
}
function aa(n, t, e, l, a, i) {
  if (l.count <= 0 || !e.length) return;
  const r = Math.max(1, Math.floor(l.count / 6));
  n.font = Qe, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const s = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < s; f += r) {
    const u = e[f];
    if (!u) continue;
    const v = at(f, l.firstIdx, a);
    n.fillText(cn(u.start), v, i - rn + 4);
  }
  n.globalAlpha = 1;
}
function oa(n, t, e, l, a, i, o, r, s) {
  const f = Math.floor((r.x - ze) / o), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), v = e[u];
  if (!v) return;
  const h = at(u, l.firstIdx, o);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(h) + 0.5, i.priceY0), n.lineTo(Math.round(h) + 0.5, i.volumeY1 || i.priceY1), n.stroke();
  const w = Math.max(i.priceY0, Math.min(i.priceY1, r.y));
  n.beginPath(), n.moveTo(ze, Math.round(w) + 0.5), n.lineTo(s - lt, Math.round(w) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const I = a.max - a.min;
  if (I > 0) {
    const g = a.max - (w - i.priceY0) / (i.priceY1 - i.priceY0) * I, R = nt(g);
    n.font = Qe, n.textBaseline = "middle", n.textAlign = "left";
    const F = n.measureText(R).width, k = 4, S = 2;
    n.fillStyle = t.accent, n.fillRect(s - lt + 2, w - 7 - S, F + k * 2, 14 + S * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(R, s - lt + 2 + k, w);
  }
  n.font = Qe, n.textBaseline = "top", n.textAlign = "center";
  const L = cn(v.start), m = n.measureText(L).width;
  n.fillStyle = t.accent, n.fillRect(h - m / 2 - 4, i.volumeY1 + 2, m + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(L, h, i.volumeY1 + 4), n.restore();
}
const Kt = 0.25, qt = 6, ia = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ra = /* @__PURE__ */ Je({
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
  setup(n) {
    const t = n, e = X(null), l = X(null), a = { ...Ce }, i = X(0), o = X(0), r = X(0), s = X(1), f = X(null), u = ue(() => Math.max(1, t.slotW * s.value));
    let v = null, h = !1;
    function w() {
      if (v) {
        try {
          v.forceContextLoss();
        } catch {
        }
        try {
          v.dispose();
        } catch {
        }
        v = null;
      }
    }
    let I, L, m, g, R;
    const F = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${_t}

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

  ${Bt}

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

    ${Wt}

    gl_FragColor = color;
  }
`;
    function k() {
      if (!(!l.value || !e.value)) {
        if (R = document.createElement("canvas"), t.flat) {
          h = !0, S();
          return;
        }
        try {
          v = new P.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          h = !0;
        }
        if (!h && !v.getContext() && (v.dispose(), v = null, h = !0), h) {
          S();
          return;
        }
        v.setPixelRatio(1), v.setClearColor(0, 0), I = new P.Scene(), L = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new P.CanvasTexture(R), g.minFilter = P.LinearFilter, g.magFilter = P.LinearFilter, m = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...zt()
          },
          vertexShader: ia,
          fragmentShader: F,
          transparent: !0
        }), I.add(new P.Mesh(new P.PlaneGeometry(2, 2), m)), S();
      }
    }
    function S() {
      if (!e.value || !v && !h) return;
      const W = e.value.clientWidth, N = e.value.clientHeight;
      !W || !N || !(R.width !== W || R.height !== N) || (R.width = W, R.height = N, i.value = W, o.value = N, v ? (g && (g.dispose(), g = new P.CanvasTexture(R), g.minFilter = P.LinearFilter, g.magFilter = P.LinearFilter, m && (m.uniforms.uTex.value = g)), v.setPixelRatio(window.devicePixelRatio || 1), v.setSize(W, N)) : l.value && (l.value.width = W, l.value.height = N, l.value.style.width = W + "px", l.value.style.height = N + "px"), p());
    }
    function p() {
      if (!(R != null && R.width)) return;
      if (h) {
        if (!l.value) return;
        en(R, {
          candles: t.candles,
          slotW: u.value,
          scrollX: r.value,
          theme: t.theme,
          glow: !1,
          showVolume: t.showVolume,
          volumeFraction: t.volumeFraction,
          hover: f.value,
          overlays: t.overlays,
          markers: t.markers,
          compact: t.compact,
          colors: t.colors
        });
        const N = l.value.getContext("2d");
        N && (N.clearRect(0, 0, l.value.width, l.value.height), N.drawImage(R, 0, 0));
        return;
      }
      if (!v || !m || !g) return;
      const W = t.theme === "paper";
      m.uniforms.uStrength.value = Ze(t.curvature), m.uniforms.uScanlines.value = t.scanlines && !W ? 1 : 0, m.uniforms.uVignette.value = W ? 0 : 1, Yt(m, t.magnify, a, R.width, R.height), en(R, {
        candles: t.candles,
        slotW: u.value,
        scrollX: r.value,
        theme: t.theme,
        glow: t.glow,
        showVolume: t.showVolume,
        volumeFraction: t.volumeFraction,
        hover: f.value,
        overlays: t.overlays,
        markers: t.markers,
        compact: t.compact,
        colors: t.colors
      }), g.needsUpdate = !0, v.render(I, L);
    }
    te(() => t.theme, () => p()), te(() => t.curvature, () => p()), te(() => t.scanlines, () => p()), te(() => t.glow, () => p()), te(() => t.showVolume, () => p()), te(() => t.volumeFraction, () => p()), te(() => t.slotW, () => p()), te(() => t.candles, () => p(), { deep: !1 }), te(() => t.overlays, () => p(), { deep: !1 }), te(() => t.markers, () => p(), { deep: !1 }), te(() => t.compact, () => p()), te(() => t.magnify, (W) => {
      W || (a.x = Ce.x, a.y = Ce.y), p();
    }), te(() => t.colors, () => p(), { deep: !0 }), te(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), te(r, () => p()), te(s, () => p()), te(f, () => p()), te(u, () => p());
    let M = null, Y = null, E = 0;
    const Q = St("cathodeResetTick", X(0));
    te(Q, () => B());
    function B() {
      cancelAnimationFrame(E), E = requestAnimationFrame(S);
    }
    function C(W) {
      W.preventDefault();
    }
    function H() {
      v == null || v.dispose(), v = null, h = !1, k();
    }
    function V(W) {
      if (!l.value) return [-1, -1];
      const N = l.value.getBoundingClientRect();
      return [W.clientX - N.left, W.clientY - N.top];
    }
    function j(W) {
      var Re;
      const N = u.value;
      if (N <= 0) return 0;
      const se = ((Re = t.candles) == null ? void 0 : Re.length) ?? 0, ge = Math.max(1, Math.floor((i.value || 1) / N)), pe = Math.max(0, se - ge);
      return Math.max(0, Math.min(W, pe * N));
    }
    function le(W) {
      var ge;
      if (W.deltaX !== 0 || W.shiftKey && W.deltaY !== 0) {
        const pe = W.deltaX !== 0 ? W.deltaX : W.deltaY;
        r.value = j(r.value + pe);
        return;
      }
      if (W.deltaY === 0) return;
      const [N] = V(W), se = u.value;
      if (N >= 0 && se > 0 && ((ge = t.candles) != null && ge.length)) {
        const pe = Math.max(1, Math.floor((i.value || 1) / se)), Ye = Math.max(0, t.candles.length - pe - Math.floor(r.value / se)) + (N - 8) / se, Pe = Math.exp(-W.deltaY * 15e-4), Ne = Math.max(Kt, Math.min(qt, s.value * Pe));
        s.value = Ne;
        const He = t.slotW * Ne, _e = Math.max(1, Math.floor((i.value || 1) / He)), A = Ye - (N - 8) / He, ae = Math.max(0, t.candles.length - _e - A);
        r.value = j(ae * He);
      } else {
        const pe = Math.exp(-W.deltaY * 15e-4);
        s.value = Math.max(Kt, Math.min(qt, s.value * pe));
      }
    }
    let ie = !1, ne = 0, ee = 0;
    function d(W) {
      W.button === 0 && (ie = !0, ne = W.clientX, ee = r.value, f.value = null, e.value && e.value.focus());
    }
    function y(W) {
      const N = Math.exp(W * 0.18);
      s.value = Math.max(Kt, Math.min(qt, s.value * N)), r.value = j(r.value);
    }
    function O(W) {
      const N = u.value, se = W.shiftKey ? 20 : 3;
      switch (W.key) {
        case "ArrowLeft":
          W.preventDefault(), r.value = j(r.value + N * se);
          break;
        case "ArrowRight":
          W.preventDefault(), r.value = j(r.value - N * se);
          break;
        case "ArrowUp":
          W.preventDefault(), y(1);
          break;
        case "ArrowDown":
          W.preventDefault(), y(-1);
          break;
        case "Home":
          W.preventDefault(), r.value = j(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          W.preventDefault(), r.value = 0;
          break;
      }
    }
    function D(W) {
      if (ie) {
        const N = W.clientX - ne;
        r.value = j(ee + N);
        return;
      }
    }
    function G() {
      ie = !1;
    }
    function U(W) {
      if (W.touches.length !== 1) return;
      const N = W.touches[0];
      ie = !0, ne = N.clientX, ee = r.value, f.value = null;
    }
    function $(W) {
      if (!ie || W.touches.length !== 1) return;
      W.preventDefault();
      const se = W.touches[0].clientX - ne;
      r.value = j(ee + se);
    }
    function Z() {
      ie = !1;
    }
    function ce(W) {
      if (t.magnify && l.value) {
        const ge = Tt(W, l.value);
        a.x = ge.x, a.y = ge.y, p();
      }
      if (ie) return;
      const [N, se] = V(W);
      if (N < 0 || se < 0) {
        f.value = null;
        return;
      }
      f.value = { x: N, y: se };
    }
    function me() {
      f.value = null, a.x = Ce.x, a.y = Ce.y, p();
    }
    Xe(() => {
      document.addEventListener("mousemove", D), document.addEventListener("mouseup", G), Ae(() => {
        var W;
        k(), l.value && (l.value.addEventListener("webglcontextlost", C), l.value.addEventListener("webglcontextrestored", H)), e.value && (M = new ResizeObserver(() => S()), M.observe(e.value), Y = new IntersectionObserver((N) => {
          N.some((se) => se.isIntersecting) && B();
        }), Y.observe(e.value)), window.addEventListener("resize", B), (W = window.visualViewport) == null || W.addEventListener("resize", B);
      });
    }), et(() => {
      var W, N, se;
      document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", G), (W = l.value) == null || W.removeEventListener("webglcontextlost", C), (N = l.value) == null || N.removeEventListener("webglcontextrestored", H), M == null || M.disconnect(), Y == null || Y.disconnect(), window.removeEventListener("resize", B), (se = window.visualViewport) == null || se.removeEventListener("resize", B), cancelAnimationFrame(E), w();
    });
    const ye = ue(() => wt[t.theme] ?? wt.none), Se = ue(() => ({
      background: ye.value.bg
    }));
    return (W, N) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: qe(Se.value),
      tabindex: "0",
      onKeydown: O
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: ut(le, ["prevent"]),
        onMousedown: d,
        onMousemove: ce,
        onMouseleave: me,
        onTouchstartPassive: U,
        onTouchmove: $,
        onTouchend: Z,
        onTouchcancel: Z
      }, null, 544)
    ], 36));
  }
}), $a = /* @__PURE__ */ tt(ra, [["__scopeId", "data-v-7c334778"]]), mt = 22, xt = 6, sa = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ca = /* @__PURE__ */ Je({
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
    const e = n, l = t, a = X(null), i = X(null), o = X(-1), r = X(0), s = { ...Ce };
    let f = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, v = !1;
    function h() {
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
    let w, I, L, m, g;
    const R = X(0), F = X(0), k = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${_t}

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

  ${Bt}

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

    ${Wt}

    gl_FragColor = color;
  }
`;
    function S() {
      if (!(!i.value || !a.value)) {
        g = document.createElement("canvas");
        try {
          u = new P.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          v = !0;
        }
        if (!v && !u.getContext() && (u.dispose(), u = null, v = !0), v) {
          p();
          return;
        }
        u.setPixelRatio(f), u.setClearColor(0, 0), w = new P.Scene(), I = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new P.CanvasTexture(g), m.minFilter = P.LinearFilter, m.magFilter = P.LinearFilter, L = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...zt()
          },
          vertexShader: sa,
          fragmentShader: k,
          transparent: !0
        }), w.add(new P.Mesh(new P.PlaneGeometry(2, 2), L)), p();
      }
    }
    function p() {
      if (!a.value || !u && !v) return;
      const d = a.value.clientWidth, y = a.value.clientHeight;
      if (!d || !y) return;
      R.value = d, F.value = y, f = Math.min(window.devicePixelRatio || 1, 2);
      const O = e.bendField ? Math.round(d * In(e.curvature)) : d, D = Math.round(O * f), G = Math.round(y * f), U = g.width !== D || g.height !== G;
      g.width = D, g.height = G, u ? (U && m && (m.dispose(), m = new P.CanvasTexture(g), m.minFilter = P.LinearFilter, m.magFilter = P.LinearFilter, L.uniforms.uTex.value = m), u.setPixelRatio(f), u.setSize(d, y)) : i.value && (i.value.width = Math.round(d * f), i.value.height = Math.round(y * f), i.value.style.width = d + "px", i.value.style.height = y + "px"), C();
    }
    function M() {
      const d = (g == null ? void 0 : g.width) || 0, y = Math.max(1, Math.floor(d / e.minCellW)), O = Math.floor(d / y), D = Math.round(O * e.cellAspect), G = mt + D + xt;
      return { rects: e.cells.map(($, Z) => ({
        x: Z % y * O,
        y: Math.floor(Z / y) * G - r.value,
        w: O,
        h: G
      })), rowH: G, totalH: Math.ceil(e.cells.length / y) * G, cols: y };
    }
    const Y = () => {
      const { totalH: d } = M();
      return Math.max(0, d - ((g == null ? void 0 : g.height) || 0));
    }, E = /* @__PURE__ */ new Map();
    function Q(d, y, O) {
      const D = d.candles[d.candles.length - 1], G = `${y}x${O}@${f}|${d.candles.length}|${D ? D.start + ":" + D.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, U = E.get(d.id);
      if (U && U.key === G) return U.canvas;
      const $ = (U == null ? void 0 : U.canvas) ?? document.createElement("canvas");
      $.width = Math.round(y * f), $.height = Math.round(O * f);
      const Z = Math.max(1.5, Math.min(e.slotW, y / Math.max(1, d.candles.length))), ce = y < 260 && d.overlays ? d.overlays.map((me) => ({ ...me, label: "" })) : d.overlays;
      return en($, {
        candles: d.candles,
        slotW: Z,
        scrollX: Math.max(0, d.candles.length * Z - y),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: ce,
        compact: !0,
        colors: e.colors,
        dpr: f
      }), E.set(d.id, { canvas: $, key: G }), $;
    }
    const B = ue(() => ({ ...wt[e.theme] ?? wt.none, ...e.colors ?? {} }));
    function C() {
      var D;
      if (!(g != null && g.width)) return;
      const d = g.getContext("2d");
      if (!d) return;
      const y = B.value;
      d.setTransform(1, 0, 0, 1, 0, 0), d.clearRect(0, 0, g.width, g.height), y.bg && y.bg !== "rgba(0,0,0,0)" && (d.fillStyle = y.bg, d.fillRect(0, 0, g.width, g.height)), d.setTransform(f, 0, 0, f, 0, 0);
      const { rects: O } = M();
      d.font = "600 11px ui-monospace, SFMono-Regular, monospace", d.textBaseline = "middle";
      for (let G = 0; G < e.cells.length; G++) {
        const U = e.cells[G], $ = O[G];
        if ($.y + $.h < 0 || $.y > g.height / f) continue;
        const Z = $.x + xt / 2, ce = $.w - xt;
        d.strokeStyle = U.open ? y.candleBull : y.gridline, d.lineWidth = G === o.value ? 2 : 1, d.strokeRect(Z + 0.5, $.y + 0.5, ce - 1, $.h - xt - 1), d.save(), d.beginPath(), d.rect(Z, $.y, ce, mt), d.clip();
        const me = $.y + mt / 2 + 1, ye = U.note ? d.measureText(U.note).width + (U.open ? 22 : 12) : U.open ? 16 : 0, Se = U.badge ? d.measureText(U.badge).width + 6 : 0, W = ce - 14 - Se - ye;
        let N = U.title;
        if (d.measureText(N).width > W) {
          for (; N.length > 1 && d.measureText(N + "…").width > W; ) N = N.slice(0, -1);
          N += "…";
        }
        let se = Z + 7;
        d.fillStyle = y.text, d.textAlign = "left", d.fillText(N, se, me), se += d.measureText(N).width + 6, U.badge && (d.fillStyle = y.accent, d.fillText(U.badge, se, me)), U.note && (d.textAlign = "right", d.fillStyle = U.noteColor || y.accent, d.fillText(U.note, Z + ce - (U.open ? 16 : 7), me), d.textAlign = "left"), d.restore(), U.open && (d.fillStyle = y.candleBull, d.beginPath(), d.arc(Z + ce - 9, $.y + mt / 2 + 1, 3, 0, Math.PI * 2), d.fill());
        const ge = $.y + mt, pe = $.h - mt - xt;
        U.candles.length ? d.drawImage(Q(U, ce - 2, pe - 1), Z + 1, ge, ce - 2, pe - 1) : (d.fillStyle = y.accent, d.textAlign = "center", d.fillText("· · ·", Z + ce / 2, ge + pe / 2), d.textAlign = "left");
      }
      if (v) {
        const G = (D = i.value) == null ? void 0 : D.getContext("2d");
        G && i.value && G.drawImage(g, 0, 0, g.width, g.height, 0, 0, i.value.width, i.value.height);
        return;
      }
      !u || !L || !m || (L.uniforms.uStrength.value = Ze(e.curvature), L.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, L.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Yt(L, e.magnify, s, R.value || g.width, F.value || g.height), m.needsUpdate = !0, u.render(w, I));
    }
    function H(d) {
      if (!i.value) return [-1, -1];
      const y = i.value.getBoundingClientRect();
      return Rn(
        d.clientX - y.left,
        d.clientY - y.top,
        y.width,
        y.height,
        Ze(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((g == null ? void 0 : g.width) || y.width) / f,
        ((g == null ? void 0 : g.height) || y.height) / f
      );
    }
    function V(d, y) {
      if (d < 0) return -1;
      const { rects: O } = M();
      return O.findIndex((D) => d >= D.x && d < D.x + D.w && y >= D.y && y < D.y + D.h);
    }
    function j(d) {
      const [y, O] = H(d), D = V(y, O);
      D >= 0 && l("cell-click", e.cells[D].id);
    }
    function le(d) {
      if (e.magnify && i.value) {
        const G = Tt(d, i.value);
        s.x = G.x, s.y = G.y;
      }
      const [y, O] = H(d), D = V(y, O);
      D !== o.value ? (o.value = D, C()) : e.magnify && C(), i.value && (i.value.style.cursor = D >= 0 ? "pointer" : "default");
    }
    function ie() {
      o.value = -1, s.x = Ce.x, s.y = Ce.y, C();
    }
    function ne(d) {
      const y = Y();
      y <= 0 || (d.preventDefault(), r.value = Math.max(0, Math.min(y, r.value + d.deltaY)), C());
    }
    let ee = null;
    return Xe(() => {
      S(), ee = new ResizeObserver(() => p()), a.value && ee.observe(a.value);
    }), et(() => {
      ee == null || ee.disconnect(), h(), E.clear();
    }), te(() => [e.curvature, e.bendField], () => Ae(p)), te(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      r.value = Math.min(r.value, Y()), C();
    }, { deep: !1 }), (d, y) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-candle-grid-wrap"
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: i,
        onClick: j,
        onMousemove: le,
        onMouseleave: ie,
        onWheel: ne
      }, null, 544)
    ], 512));
  }
}), Va = /* @__PURE__ */ tt(ca, [["__scopeId", "data-v-9f2b24f8"]]), un = X(0), tn = 28, gt = 12;
let nn = 10, Ft = "cathode.layout", At = !1;
const Le = X({});
function ua(n, t = "cathode.layout") {
  if (!At) {
    At = !0, Ft = t;
    try {
      const e = localStorage.getItem(Ft);
      if (e) {
        Le.value = JSON.parse(e), xn();
        return;
      }
    } catch {
    }
    Le.value = { ...n }, xn();
  }
}
function xn() {
  let n = 10;
  for (const t of Object.values(Le.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  nn = n;
}
function dt() {
  localStorage.setItem(Ft, JSON.stringify(Le.value));
}
function fa(n) {
  At = !1, localStorage.removeItem(Ft), Le.value = { ...n }, dt(), At = !0, un.value++;
}
function Pn(n) {
  nn++, Le.value[n] && (Le.value[n].zIndex = nn);
}
function da(n, t) {
  Le.value[n].visible = t, dt();
}
function ha(n, t) {
  Le.value[n].minimized = t, t && (Le.value[n].maximized = !1), dt();
}
function va(n, t) {
  Le.value[n].maximized = t, t && (Le.value[n].minimized = !1, Pn(n)), dt();
}
function ma(n, t, e) {
  Le.value[n].x = Math.round(t), Le.value[n].y = Math.round(e), dt();
}
function ga(n, t, e) {
  Le.value[n].w = Math.round(t), Le.value[n].h = Math.round(e), dt();
}
function Oa(n, t, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), i = Math.floor((n - gt * (l + 1)) / l), o = Math.floor((t - gt * (a + 1)) / a), r = {};
  return e.forEach((s, f) => {
    const u = f % l, v = Math.floor(f / l);
    r[s] = {
      x: gt + u * (i + gt),
      y: gt + v * (o + gt),
      w: i,
      h: o,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: f + 1
    };
  }), r;
}
function _n() {
  return {
    containers: Le,
    TITLEBAR_H: tn,
    load: ua,
    save: dt,
    reset: fa,
    bringToFront: Pn,
    setVisible: da,
    setMinimized: ha,
    setMaximized: va,
    updatePos: ma,
    updateSize: ga
  };
}
const pa = { class: "ws-toolbar" }, wa = {
  key: 0,
  class: "ws-restore-menu"
}, ya = {
  key: 0,
  class: "ws-restore-empty"
}, xa = ["onClick"], ba = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: l, reset: a, setVisible: i } = _n(), o = X(null);
    gn("cathodeWorkspace", o), gn("cathodeResetTick", un), Xe(() => {
      if (!o.value) return;
      const { clientWidth: m, clientHeight: g } = o.value, R = t.initialLayout ?? {};
      l(R, t.storageKey ?? "cathode.layout");
      const F = Object.keys(e.value)[0];
      F && r(F);
    });
    function r(m) {
      var R;
      document.querySelectorAll(".cc").forEach((F) => F.classList.remove("cc-focused"));
      const g = (R = o.value) == null ? void 0 : R.querySelector(`#cc-${m}`);
      g && g.classList.add("cc-focused");
    }
    function s() {
      !o.value || !t.initialLayout || a(t.initialLayout);
    }
    function f(m) {
      const g = m.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((R) => R.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = X(!1), v = () => Object.entries(e.value).filter(([, m]) => !m.visible).map(([m]) => m);
    function h(m) {
      i(m, !0), u.value = !1;
    }
    function w(m) {
      if (!u.value) return;
      const g = m.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function I(m) {
      m.key === "Escape" && (u.value = !1);
    }
    Xe(() => {
      document.addEventListener("click", w), document.addEventListener("keydown", I);
    }), et(() => {
      document.removeEventListener("click", w), document.removeEventListener("keydown", I);
    });
    function L(m) {
      var g;
      return ((g = t.containerTitles) == null ? void 0 : g[m]) ?? m;
    }
    return (m, g) => (be(), Me("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      Zt(m.$slots, "default", {}, void 0, !0),
      Zt(m.$slots, "overlay", {}, void 0, !0),
      he("div", pa, [
        n.initialLayout ? (be(), Me("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: s
        }, " ↺ Reset Layout ")) : je("", !0),
        g[1] || (g[1] = he("div", { class: "ws-sep" }, null, -1)),
        he("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (R) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Sn(Qn, { name: "menu" }, {
        default: Jn(() => [
          u.value ? (be(), Me("div", wa, [
            g[3] || (g[3] = he("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            v().length ? je("", !0) : (be(), Me("div", ya, " No closed panels ")),
            (be(!0), Me(el, null, tl(v(), (R) => (be(), Me("div", {
              key: R,
              class: "ws-restore-item",
              onClick: (F) => h(R)
            }, [
              g[2] || (g[2] = he("span", { class: "ws-restore-icon" }, "⊞", -1)),
              nl(" " + Ue(L(R)), 1)
            ], 8, xa))), 128))
          ])) : je("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Ua = /* @__PURE__ */ tt(ba, [["__scopeId", "data-v-5838d04b"]]), Ma = ["id"], Sa = { class: "cc-title" }, Ta = {
  key: 0,
  class: "cc-size-badge"
}, Ca = { class: "cc-controls" }, ka = ["title"], La = { class: "cc-body" }, Ra = 200, Ia = 80, bn = 60, Da = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: l, setVisible: a, setMinimized: i, setMaximized: o, updatePos: r, updateSize: s } = _n(), f = St("cathodeWorkspace", X(null)), u = ue(() => e.value[t.id]), v = ue(() => {
      const d = u.value, y = t.curvature ?? 0;
      if (!d) return {};
      const O = { "--curvature": Math.abs(y) };
      return d.maximized ? { ...O, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: d.zIndex } : {
        ...O,
        left: d.x + "px",
        top: d.y + "px",
        width: d.w + "px",
        height: d.minimized ? tn + "px" : d.h + "px",
        zIndex: d.zIndex,
        display: d.visible ? "flex" : "none"
      };
    });
    let h = !1, w = 0, I = 0;
    function L(d) {
      var D;
      if (d.target.closest(".cc-btn") || u.value.maximized) return;
      l(t.id), h = !0;
      const y = (D = f.value) == null ? void 0 : D.querySelector(`#cc-${t.id}`);
      if (!y) return;
      const O = y.getBoundingClientRect();
      w = d.clientX - O.left, I = d.clientY - O.top, document.addEventListener("mousemove", m), document.addEventListener("mouseup", g), d.preventDefault();
    }
    function m(d) {
      var U;
      if (!h || !f.value) return;
      const y = f.value.getBoundingClientRect(), O = ((U = u.value) == null ? void 0 : U.w) ?? 300;
      let D = d.clientX - y.left - w, G = d.clientY - y.top - I;
      D = Math.max(bn - O, Math.min(y.width - bn, D)), G = Math.max(0, Math.min(y.height - tn, G)), r(t.id, D, G);
    }
    function g() {
      h = !1, document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", g);
    }
    let R = !1, F = 0, k = 0, S = 0, p = 0;
    const M = X("");
    function Y(d) {
      u.value.maximized || (l(t.id), R = !0, F = d.clientX, k = d.clientY, S = u.value.w, p = u.value.h, document.addEventListener("mousemove", E), document.addEventListener("mouseup", Q), d.preventDefault(), d.stopPropagation());
    }
    function E(d) {
      if (!R) return;
      const y = Math.max(Ra, S + (d.clientX - F)), O = Math.max(Ia, p + (d.clientY - k));
      s(t.id, y, O), M.value = `${Math.round(y)}×${Math.round(O)}`;
    }
    function Q() {
      R = !1, M.value = "", document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", Q), B.value++;
    }
    const B = X(0);
    te(un, () => {
      B.value++;
    }), et(() => {
      var d;
      document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", Q), (d = C.value) == null || d.removeEventListener("scroll", V), j();
    });
    const C = X(null);
    function H(d) {
      if (t.canvas) return [];
      const y = d.children[0];
      return y ? Array.from(y.children) : [];
    }
    function V() {
      const d = C.value, y = t.curvature ?? 0;
      if (!d) return;
      const O = H(d);
      if (!O.length) return;
      const D = d.clientHeight, G = D / 2, U = y * 38e-4;
      O.forEach(($) => {
        if (!$.dataset.origFs) {
          const ge = getComputedStyle($);
          $.dataset.origFs = ge.fontSize, $.dataset.origLh = ge.lineHeight;
        }
        if (y === 0) {
          $.style.fontSize = "", $.style.lineHeight = "";
          return;
        }
        const Z = $.getBoundingClientRect(), ce = d.getBoundingClientRect(), me = Z.top - ce.top + Z.height / 2, ye = Math.min(1, Math.abs(me - G) / (D / 2)), Se = 1 + U * Math.cos(ye * Math.PI / 2), W = parseFloat($.dataset.origFs), N = $.dataset.origLh, se = N === "normal" ? W * 1.4 : parseFloat(N);
        isNaN(W) || ($.style.fontSize = `${(W * Se).toFixed(2)}px`), isNaN(se) || ($.style.lineHeight = `${(se * Se).toFixed(2)}px`);
      });
    }
    function j() {
      const d = C.value;
      d && H(d).forEach((y) => {
        y.style.fontSize = "", y.style.lineHeight = "", delete y.dataset.origFs, delete y.dataset.origLh;
      });
    }
    te(() => t.curvature, (d) => {
      (d ?? 0) === 0 ? j() : V();
    }), Xe(() => {
      var d;
      (d = C.value) == null || d.addEventListener("scroll", V, { passive: !0 }), Ae(V);
    });
    function le() {
      i(t.id, !u.value.minimized), Ae(() => {
        B.value++;
      });
    }
    function ie() {
      o(t.id, !u.value.maximized), Ae(() => {
        B.value++;
      });
    }
    function ne() {
      a(t.id, !1);
    }
    function ee() {
      l(t.id);
    }
    return (d, y) => u.value && u.value.visible ? (be(), Me("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: ll(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: qe(v.value),
      onMousedown: ee
    }, [
      he("div", {
        class: "cc-titlebar",
        onMousedown: L
      }, [
        y[0] || (y[0] = he("span", { class: "cc-status-dot" }, null, -1)),
        he("span", Sa, Ue(n.title), 1),
        M.value ? (be(), Me("span", Ta, Ue(M.value), 1)) : je("", !0),
        he("div", Ca, [
          he("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ut(le, ["stop"])
          }, "─"),
          he("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: ut(ie, ["stop"])
          }, Ue(u.value.maximized ? "⤡" : "⤢"), 9, ka),
          he("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ut(ne, ["stop"])
          }, "✕")
        ])
      ], 32),
      Tn(he("div", La, [
        he("div", {
          ref_key: "bodyEl",
          ref: C,
          class: "cc-screen",
          onScroll: V
        }, [
          Zt(d.$slots, "default", { resizeKey: B.value }, void 0, !0),
          y[1] || (y[1] = he("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [al, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (be(), Me("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ut(Y, ["stop"])
      }, null, 32)) : je("", !0)
    ], 46, Ma)) : je("", !0);
  }
}), Xa = /* @__PURE__ */ tt(Da, [["__scopeId", "data-v-ca0af4ca"]]), Ea = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Fa = `
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
`, Aa = 100, Pa = /* @__PURE__ */ Je({
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
    }, l = X(null), a = X(null);
    let i = null, o = !1;
    function r() {
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
    let s, f, u, v, h, w = null, I = 0;
    function L(p) {
      p - I >= Aa && (R(), I = p), w = requestAnimationFrame(L);
    }
    function m() {
      if (!l.value || !h) return;
      const p = l.value.clientWidth, M = l.value.clientHeight;
      p <= 0 || M <= 0 || h.width === p && h.height === M || (h.width = p, h.height = M, i && i.setSize(p, M, !1), a.value && (a.value.width = p, a.value.height = M, a.value.style.width = p + "px", a.value.style.height = M + "px"));
    }
    function g() {
      if (!(h != null && h.width)) return;
      const p = h.getContext("2d");
      if (!p) return;
      const M = h.width, Y = h.height, E = e[t.theme] ?? e.none;
      p.clearRect(0, 0, M, Y), p.fillStyle = E.bg, p.fillRect(0, 0, M, Y);
      const Q = Date.now(), B = (Q / 500 | 0) % 2 === 0, C = (Q / 400 | 0) % 4;
      p.font = `bold ${Math.max(14, Math.min(M, Y) * 0.06)}px monospace`, p.textAlign = "center", p.textBaseline = "middle", p.fillStyle = E.text, t.glow && (p.shadowColor = E.text, p.shadowBlur = 14);
      const H = ".".repeat(C).padEnd(3, " "), V = `${t.label}${H}`;
      if (p.fillText(V, M / 2, Y / 2), p.shadowBlur = 0, B) {
        const j = p.measureText(V), le = p.measureText("M").width, ie = parseFloat(p.font), ne = M / 2 + j.width / 2 + 4, ee = Y / 2 - ie / 2 + 2;
        p.fillStyle = E.cursor, t.glow && (p.shadowColor = E.cursor, p.shadowBlur = 12), p.fillRect(ne, ee, le * 0.7, ie * 0.95), p.shadowBlur = 0;
      }
    }
    function R() {
      if (!h) return;
      if (g(), o) {
        if (!a.value) return;
        const M = a.value.getContext("2d");
        M && M.drawImage(h, 0, 0);
        return;
      }
      if (!i || !u || !v) return;
      const p = t.theme === "paper";
      u.uniforms.uStrength.value = Ze(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !p ? 1 : 0, u.uniforms.uVignette.value = p ? 0 : 1, v.needsUpdate = !0, i.render(s, f);
    }
    function F() {
      if (!(!a.value || !l.value)) {
        h = document.createElement("canvas");
        try {
          i = new P.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          o = !0;
        }
        if (!o && !i.getContext() && (i.dispose(), i = null, o = !0), o) {
          m();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), s = new P.Scene(), f = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new P.CanvasTexture(h), v.minFilter = P.LinearFilter, v.magFilter = P.LinearFilter, u = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ea,
          fragmentShader: Fa,
          transparent: !0
        }), s.add(new P.Mesh(new P.PlaneGeometry(2, 2), u)), m();
      }
    }
    let k = null;
    Xe(() => {
      F(), R(), w = requestAnimationFrame(L), l.value && (k = new ResizeObserver(() => m()), k.observe(l.value));
    }), et(() => {
      w !== null && cancelAnimationFrame(w), k == null || k.disconnect(), r(), v == null || v.dispose(), u == null || u.dispose();
    }), te(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => R());
    const S = ue(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (p, M) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: qe(S.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Na = /* @__PURE__ */ tt(Pa, [["__scopeId", "data-v-d00e5f47"]]), Pt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, Mn = (n, t) => t === "left" ? n.left : t === "right" ? n.right : !t || t === "neutral" ? n.dim : t, xe = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", we = 12;
function jt(n, t, e) {
  const l = [];
  for (const a of t.split(`
`)) {
    let i = "";
    for (const o of a.split(" ")) {
      const r = i ? `${i} ${o}` : o;
      i && n.measureText(r).width > e ? (l.push(i), i = o) : i = r;
    }
    l.push(i);
  }
  return l;
}
function bt(n, t, e, l, a, i) {
  const o = Math.min(i, l / 2, a / 2);
  n.beginPath(), n.moveTo(t + o, e), n.lineTo(t + l - o, e), n.quadraticCurveTo(t + l, e, t + l, e + o), n.lineTo(t + l, e + a - o), n.quadraticCurveTo(t + l, e + a, t + l - o, e + a), n.lineTo(t + o, e + a), n.quadraticCurveTo(t, e + a, t, e + a - o), n.lineTo(t, e + o), n.quadraticCurveTo(t, e, t + o, e), n.closePath();
}
function Bn(n, t) {
  var M, Y;
  const e = n.getContext("2d");
  if (!e) return 0;
  const l = t.dpr || 1, a = n.width / l, i = n.height / l, o = { ...Pt[t.theme] ?? Pt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(l, 0, 0, l, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, a, i);
  const r = (E) => E > 0 ? o.right : E < 0 ? o.left : o.neutral, s = r(t.value), f = (E, Q = 10) => {
    t.glow && (e.shadowColor = E, e.shadowBlur = Q);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, v = Math.max(40, a - we * 2);
  let h = we;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const w = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${xe}`;
  const I = e.measureText(w).width;
  e.fillStyle = s, f(s, 14), e.fillText(w, we, h + 30), u();
  const L = we + I + 14;
  t.stance && (e.font = `700 14px ${xe}`, e.fillStyle = s, f(s, 8), e.fillText(t.stance.toUpperCase(), L, h + 15), u()), t.sub && (e.font = `11px ${xe}`, e.fillStyle = o.dim, e.fillText(t.sub, L, h + 31)), h += 48, e.font = `700 9px ${xe}`;
  const m = t.leftLabel.toUpperCase(), g = t.rightLabel.toUpperCase(), R = e.measureText(m).width, F = e.measureText(g).width, k = we + R + 8, S = a - we - F - 8, p = h + 10;
  if (e.fillStyle = o.left, e.fillText(m, we, p + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(g, a - we, p + 3), e.textAlign = "left", S - k > 24) {
    const E = e.createLinearGradient(k, 0, S, 0);
    E.addColorStop(0, o.left), E.addColorStop(0.45, o.surface), E.addColorStop(0.55, o.surface), E.addColorStop(1, o.right), bt(e, k, p - 4, S - k, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = E, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const Q = (k + S) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(Q, p - 8), e.lineTo(Q, p + 8), e.stroke();
    for (const j of [0.25, 0.75]) {
      const le = k + j * (S - k);
      e.beginPath(), e.moveTo(le, p - 5), e.lineTo(le, p + 5), e.stroke();
    }
    const B = t.max - t.min || 1, C = Math.max(0, Math.min(1, (t.shown - t.min) / B)), H = k + C * (S - k), V = r(t.shown);
    e.beginPath(), e.moveTo(H, p - 10), e.lineTo(H - 4.5, p - 17), e.lineTo(H + 4.5, p - 17), e.closePath(), e.fillStyle = V, e.fill(), e.beginPath(), e.arc(H, p, 6.5, 0, Math.PI * 2), e.fillStyle = V, f(V, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
    for (const j of t.marks ?? []) {
      const le = (j.value - t.min) / B;
      if (le < 0 || le > 1) continue;
      const ie = k + le * (S - k), ne = Mn(o, j.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = ne, e.lineWidth = 1, e.beginPath(), e.moveTo(ie, p - 9), e.lineTo(ie, p + 9), e.stroke(), e.restore(), j.label) {
        e.font = `700 8px ${xe}`, e.fillStyle = ne;
        const ee = e.measureText(j.label).width;
        e.fillText(j.label, Math.max(k, Math.min(S - ee, ie - ee / 2)), p + 20);
      }
    }
  }
  if (h += (M = t.marks) != null && M.some((E) => E.label) ? 42 : 30, t.meter) {
    const E = t.meter, Q = E.min ?? 0, B = E.max ?? 1, C = B - Q || 1, H = E.tone === "up" ? o.right : E.tone === "down" ? o.left : E.tone === "warn" ? o.warn : o.neutral;
    E.label && (e.font = `700 9px ${xe}`, e.fillStyle = o.dim, e.fillText(E.label.toUpperCase(), we, h + 9)), E.hint && (e.font = `9px ${xe}`, e.fillStyle = o.dim, e.textAlign = "right", e.fillText(E.hint, a - we, h + 9), e.textAlign = "left"), (E.label || E.hint) && (h += 15), e.font = `700 12px ${xe}`;
    const V = E.valueText ?? (E.value == null ? "—" : String(E.value)), j = e.measureText(V).width, le = we, ie = a - we - j - 10, ne = h + 6, ee = !!((Y = E.thresholds) != null && Y.some((d) => d.label));
    if (ie - le > 24) {
      if (bt(e, le, ne - 5, ie - le, 10, 5), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), E.value != null) {
        const d = Math.max(0, Math.min(1, (E.value - Q) / C));
        d > 0 && (e.save(), bt(e, le, ne - 5, ie - le, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = H, f(H, 8), e.fillRect(le, ne - 5, (ie - le) * d, 10), e.restore());
      }
      for (const d of E.thresholds ?? []) {
        const y = (d.value - Q) / C;
        if (y < 0 || y > 1) continue;
        const O = le + y * (ie - le), D = Mn(o, d.color);
        if (e.strokeStyle = D, e.lineWidth = 1, e.beginPath(), e.moveTo(O, ne - 7), e.lineTo(O, ne + 7), e.stroke(), d.label) {
          e.font = `700 7.5px ${xe}`, e.fillStyle = D;
          const G = e.measureText(d.label).width;
          e.fillText(d.label, Math.max(le, Math.min(ie - G, O - G / 2)), ne + 17);
        }
      }
    }
    e.font = `700 12px ${xe}`, e.fillStyle = H, e.textAlign = "right", f(H, 8), e.fillText(V, a - we, ne + 4), u(), e.textAlign = "left", h += ee ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${xe}`;
    const E = jt(e, t.caption, v - 18), Q = E.length * 15 + 12;
    bt(e, we, h, v, Q, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, E.forEach((B, C) => e.fillText(B, we + 9, h + 17 + C * 15)), h += Q + 10;
  }
  if (t.note) {
    e.font = `10px ${xe}`, e.fillStyle = o.dim;
    const E = jt(e, t.note, v);
    E.forEach((Q, B) => e.fillText(Q, we, h + 10 + B * 14)), h += E.length * 14 + 10;
  }
  if (t.items.length) {
    let B = we;
    for (const C of t.items) {
      const H = C.side === "left" ? o.left : C.side === "right" ? o.right : o.neutral, V = C.side === "left" ? t.sideLetters[0] : C.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${xe}`;
      const j = e.measureText(C.label).width;
      e.font = `700 8px ${xe}`;
      const le = V ? e.measureText(V).width + 6 : 0;
      e.font = `10px ${xe}`;
      const ie = C.value ? e.measureText(C.value).width : 0, ne = 7 + j + (V ? 4 + le : 0) + (C.value ? 4 + ie : 0) + 7;
      B + ne > a - we && B > we && (B = we, h += 23), bt(e, B, h, ne, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = H, e.fillRect(B, h + 1, 2, 16);
      let ee = B + 7;
      e.font = `700 10px ${xe}`, e.fillStyle = o.text, e.fillText(C.label, ee, h + 12.5), ee += j + 4, V && (e.font = `700 8px ${xe}`, e.fillStyle = H, e.fillText(V, ee + 3, h + 12), ee += le + 4), C.value && (e.font = `10px ${xe}`, e.fillStyle = C.tone === "up" ? o.right : C.tone === "down" ? o.left : o.dim, e.fillText(C.value, ee, h + 12.5)), B += ne + 5;
    }
    h += 18;
  } else if (t.emptyText) {
    e.font = `10px ${xe}`, e.fillStyle = o.dim;
    const E = jt(e, t.emptyText, v);
    E.forEach((Q, B) => e.fillText(Q, we, h + 10 + B * 14)), h += E.length * 14;
  }
  return h + we;
}
const _a = /* @__PURE__ */ Je({
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
    marks: { default: () => [] },
    meter: { default: null },
    caption: {},
    note: {},
    items: { default: () => [] },
    emptyText: {},
    colors: {},
    animate: { type: Boolean, default: !0 }
  },
  setup(n) {
    const t = n, e = X(null), l = X(null), a = () => (t.min + t.max) / 2, i = X(t.animate ? a() : t.value);
    let o = 0;
    function r() {
      if (cancelAnimationFrame(o), !t.animate) {
        i.value = t.value, m();
        return;
      }
      const B = () => {
        const C = t.value - i.value;
        if (Math.abs(C) < 4e-3) {
          i.value = t.value, m();
          return;
        }
        i.value += C * 0.18, m(), o = requestAnimationFrame(B);
      };
      o = requestAnimationFrame(B);
    }
    te(() => t.value, r);
    let s = null, f = !1;
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
    let v, h;
    const w = new Ht({
      paint: (B, { dpr: C, glow: H }) => Bn(B, {
        dpr: C,
        theme: t.theme,
        colors: t.colors,
        glow: H,
        shown: i.value,
        value: t.value,
        min: t.min,
        max: t.max,
        readout: t.readout,
        stance: t.stance,
        sub: t.sub,
        leftLabel: t.leftLabel,
        rightLabel: t.rightLabel,
        sideLetters: t.sideLetters,
        marks: t.marks,
        meter: t.meter,
        caption: t.caption,
        note: t.note,
        items: t.items,
        emptyText: t.emptyText
      })
    });
    function I() {
      if (!(!l.value || !e.value)) {
        try {
          s = new P.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !s.getContext() && (s.dispose(), s = null, f = !0), f) {
          L();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), v = new P.Scene(), h = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), v.add(new P.Mesh(new P.PlaneGeometry(2, 2), w.material)), L();
      }
    }
    function L() {
      if (!e.value || !s && !f) return;
      const B = e.value.clientWidth, C = e.value.clientHeight;
      w.resize(B, C) && (s ? (s.setPixelRatio(w.dpr), s.setSize(B, C)) : l.value && (l.value.width = w.canvas.width, l.value.height = w.canvas.height, l.value.style.width = B + "px", l.value.style.height = C + "px"), m());
    }
    function m() {
      if (!w.canvas.width) return;
      if (f) {
        if (!l.value) return;
        w.paintOnly(!1);
        const C = l.value.getContext("2d");
        C && (C.setTransform(1, 0, 0, 1, 0, 0), C.clearRect(0, 0, l.value.width, l.value.height), C.drawImage(w.canvas, 0, 0));
        return;
      }
      if (!s) return;
      const B = t.theme === "paper";
      w.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !B,
        vignette: !B,
        magnify: t.magnify
      }), w.syncUniforms(), w.paint(t.glow), s.render(v, h);
    }
    te(
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
        t.marks,
        t.meter,
        t.caption,
        t.note,
        t.items,
        t.emptyText,
        t.colors,
        t.min,
        t.max
      ],
      () => m(),
      { deep: !0 }
    ), te(() => t.magnify, (B) => {
      B || w.setLens(null), m();
    });
    function g(B) {
      !t.magnify || !l.value || (w.setLens(Tt(B, l.value)), m());
    }
    function R() {
      w.setLens(null), m();
    }
    let F = null, k = null, S = 0;
    const p = St("cathodeResetTick", X(0));
    te(p, () => M());
    function M() {
      cancelAnimationFrame(S), S = requestAnimationFrame(L);
    }
    function Y(B) {
      B.preventDefault();
    }
    function E() {
      s == null || s.dispose(), s = null, f = !1, I(), m();
    }
    Xe(() => {
      Ae(() => {
        var B;
        I(), l.value && (l.value.addEventListener("webglcontextlost", Y), l.value.addEventListener("webglcontextrestored", E)), e.value && (F = new ResizeObserver(() => L()), F.observe(e.value), k = new IntersectionObserver((C) => {
          C.some((H) => H.isIntersecting) && M();
        }), k.observe(e.value)), window.addEventListener("resize", M), (B = window.visualViewport) == null || B.addEventListener("resize", M), r();
      });
    }), et(() => {
      var B, C, H;
      cancelAnimationFrame(o), cancelAnimationFrame(S), (B = l.value) == null || B.removeEventListener("webglcontextlost", Y), (C = l.value) == null || C.removeEventListener("webglcontextrestored", E), F == null || F.disconnect(), k == null || k.disconnect(), window.removeEventListener("resize", M), (H = window.visualViewport) == null || H.removeEventListener("resize", M), u(), w.dispose();
    });
    const Q = ue(() => ({
      background: (Pt[t.theme] ?? Pt.none).bg
    }));
    return (B, C) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: qe(Q.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-gauge-canvas",
        onMousemove: g,
        onMouseleave: R
      }, null, 544)
    ], 4));
  }
}), Ga = /* @__PURE__ */ tt(_a, [["__scopeId", "data-v-6c2fc3b2"]]);
function Ka(n, t = 1) {
  if (n.mode !== "world")
    throw new Error("createSurfaceMesh needs a CathodeSurface created with mode: 'world'");
  const e = n.logicalH > 0 ? n.logicalW / n.logicalH : 16 / 9, l = new P.Mesh(new P.PlaneGeometry(t * e, t), n.material);
  return l.userData.cathodeSurface = n, l;
}
function qa(n, t, e = 1) {
  const l = t.logicalH > 0 ? t.logicalW / t.logicalH : 1.7777777777777777;
  n.geometry.dispose(), n.geometry = new P.PlaneGeometry(e * l, e);
}
const ln = 26;
class Ba {
  constructor(t, e) {
    oe(this, "id");
    oe(this, "content");
    oe(this, "group", new P.Group());
    oe(this, "body");
    oe(this, "bar");
    oe(this, "glow");
    oe(this, "dirty", !0);
    oe(this, "barDirty", !0);
    oe(this, "_title");
    oe(this, "barCanvas", document.createElement("canvas"));
    oe(this, "barTexture");
    var s, f;
    this.stage = t, this.id = e.id, this._title = e.title ?? e.id, this.content = e.content, this.glow = e.glow ?? !0;
    const l = e.content.surface;
    if (l.mode !== "world") throw new Error("CathodeStage3D panels need a CathodeSurface created with mode: 'world'");
    const a = t.pxPerUnit, i = e.content.width / a, o = e.content.height / a, r = ln / a;
    this.body = new P.Mesh(new P.PlaneGeometry(i, o), l.material), this.barTexture = new P.CanvasTexture(this.barCanvas), this.barTexture.colorSpace = P.SRGBColorSpace, this.bar = new P.Mesh(
      new P.PlaneGeometry(i, r),
      new P.MeshBasicMaterial({ map: this.barTexture, toneMapped: !1 })
    ), this.bar.position.y = o / 2 + r / 2, this.group.add(this.body, this.bar), this.body.userData.panel = this, this.bar.userData.panel = this, e.visible === !1 && (this.group.visible = !1), e.position && this.group.position.set(...e.position), this.group.rotation.y = e.rotationY ?? 0, e.look && l.setLook(e.look), l.resize(e.content.width, e.content.height, window.devicePixelRatio || 1), (f = (s = e.content).attach) == null || f.call(s, () => this.invalidate());
  }
  /** the title bar's text */
  get title() {
    return this._title;
  }
  /** Change the title bar's text (e.g. a live count: "Open positions (6)"). Repaints only the bar, and only if it changed. */
  setTitle(t) {
    t !== this._title && (this._title = t, this.invalidateBar());
  }
  get visible() {
    return this.group.visible;
  }
  /** Show / hide. Prefer stage.setPanelVisible(), which also releases focus / hover / drag. */
  setVisible(t) {
    this.group.visible !== t && (this.group.visible = t, t ? this.invalidate() : this.stage.invalidate());
  }
  /** Repaint the surface on the next frame (and render it). */
  invalidate() {
    this.dirty = !0, this.stage.invalidate();
  }
  invalidateBar() {
    this.barDirty = !0, this.stage.invalidate();
  }
  setLook(t) {
    this.content.surface.setLook(t), this.invalidate();
  }
  setPosition(t, e, l) {
    this.group.position.set(t, e, l), this.stage.invalidate();
  }
  setRotationY(t) {
    this.group.rotation.y = t, this.stage.invalidate();
  }
  /** @internal called by the stage's frame */
  paintIfDirty() {
    if (!this.group.visible) return;
    const t = this.content.surface;
    this.dirty && (t.syncUniforms(), t.paint(this.glow), this.dirty = !1), this.barDirty && (this.drawBar(), this.barDirty = !1);
  }
  drawBar() {
    const t = Math.min(window.devicePixelRatio || 1, 2), e = this.content.width, l = ln, a = this.barCanvas;
    (a.width !== Math.round(e * t) || a.height !== Math.round(l * t)) && (a.width = Math.round(e * t), a.height = Math.round(l * t), this.barTexture.dispose(), this.barTexture = new P.CanvasTexture(a), this.barTexture.colorSpace = P.SRGBColorSpace, this.bar.material.map = this.barTexture, this.bar.material.needsUpdate = !0);
    const i = a.getContext("2d");
    i.setTransform(t, 0, 0, t, 0, 0);
    const o = this.stage.focusedId === this.id;
    i.fillStyle = o ? "#0f2a1d" : "#08130e", i.fillRect(0, 0, e, l), i.fillStyle = o ? "#6ee7a7" : "#2f6b4c", i.fillRect(0, l - 2, e, 2), i.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", i.textBaseline = "middle", i.fillStyle = o ? "#b6f5d2" : "#6fae8f", i.fillText(this._title, 10, l / 2 - 1, e - 20), this.barTexture.needsUpdate = !0;
  }
  dispose() {
    var t, e;
    this.body.geometry.dispose(), this.bar.geometry.dispose(), this.bar.material.dispose(), this.barTexture.dispose(), (e = (t = this.content).dispose) == null || e.call(t);
  }
}
class ja {
  constructor(t) {
    oe(this, "renderer");
    oe(this, "scene", new P.Scene());
    oe(this, "camera");
    oe(this, "canvas");
    oe(this, "panels", /* @__PURE__ */ new Map());
    oe(this, "pxPerUnit");
    oe(this, "focusedId", null);
    oe(this, "controls", null);
    oe(this, "ray", new P.Raycaster());
    oe(this, "ndc", new P.Vector2());
    oe(this, "raf", 0);
    oe(this, "rendering", !1);
    oe(this, "raiseCounter", 0);
    oe(this, "hovered", null);
    oe(this, "pressed", null);
    // a content press in progress
    oe(this, "dragging", null);
    oe(this, "suppressClick", !1);
    oe(this, "resizeObserver");
    oe(this, "disposers", []);
    oe(this, "lastCursor", "");
    oe(this, "passThrough");
    oe(this, "swallowClick", !1);
    oe(this, "cancelFly", null);
    this.o = t, this.pxPerUnit = t.pxPerUnit ?? 360, this.passThrough = !!t.passThrough, this.renderer = new P.WebGLRenderer({ antialias: !0, alpha: !!t.transparent }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setClearColor(t.background ?? 329738, t.transparent ? 0 : 1), this.canvas = this.renderer.domElement, this.passThrough || (this.canvas.tabIndex = 0), this.canvas.style.cssText = "display:block;width:100%;height:100%;outline:none;touch-action:none" + (this.passThrough ? ";pointer-events:none" : ""), t.container.appendChild(this.canvas), this.camera = new P.PerspectiveCamera(t.fov ?? 45, 1, t.near ?? 0.05, t.far ?? 100);
    const e = t.cameraPosition ?? [0, 0.1, 3.4];
    this.camera.position.set(...e), this.camera.lookAt(0, 0, 0), t.controls && (this.controls = t.controls(this.camera, this.canvas), this.controls.addEventListener("change", () => this.invalidate()));
    const l = this.passThrough ? t.inputTarget ?? document : this.canvas;
    this.on(l, "pointerdown", (a) => this.onPointerDown(a), { capture: !0 }), this.on(l, "pointermove", (a) => this.onPointerMove(a)), this.passThrough || this.on(this.canvas, "pointerleave", () => this.setHover(null)), this.on(window, "pointerup", (a) => this.onPointerUp(a)), this.on(window, "pointercancel", (a) => this.onPointerUp(a)), this.on(l, "click", (a) => this.onClick(a), { capture: this.passThrough }), this.on(l, "wheel", (a) => this.onWheel(a), { capture: !0, passive: !1 }), this.on(this.passThrough ? window : this.canvas, "keydown", (a) => this.onKey(a)), this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t.container), this.resize();
  }
  on(t, e, l, a) {
    t.addEventListener(e, l, a), this.disposers.push(() => t.removeEventListener(e, l, a));
  }
  // ── External camera ─────────────────────────────────────────────────────────
  /** Point the camera (the host drives it — e.g. following another scene's camera). */
  setCameraPose(t) {
    var e, l;
    this.camera.position.set(...t.position), this.camera.lookAt(...t.target), this.camera.updateMatrixWorld(!0), (l = (e = this.controls) == null ? void 0 : e.target) == null || l.set(...t.target), this.invalidate();
  }
  /**
   * The camera pose that looks straight at a panel (its title bar included), from the front, far
   * enough back that the whole panel fits the view with `margin` (default 12%) to spare. Pure — it
   * moves nothing: a host that owns the camera (overlay mode) applies it itself; otherwise flyTo().
   */
  facingPose(t, e = {}) {
    const l = this.panels.get(t);
    if (!l) return null;
    l.group.updateWorldMatrix(!0, !0);
    const a = this.pxPerUnit, i = l.content.height / a, o = ln / a, r = l.content.width / a, s = i + o, f = l.body.localToWorld(new P.Vector3(0, o / 2, 0)), u = new P.Vector3(0, 0, 1).applyQuaternion(l.group.getWorldQuaternion(new P.Quaternion())), v = Math.tan(P.MathUtils.degToRad(this.camera.fov / 2)), h = Math.max(s / 2 / v, r / 2 / (v * this.camera.aspect)) * (1 + (e.margin ?? 0.12)), w = f.clone().addScaledVector(u, h);
    return { position: [w.x, w.y, w.z], target: [f.x, f.y, f.z] };
  }
  /**
   * Tween the camera to a pose (ease in-out). For a stage that OWNS its camera — in overlay mode
   * the host drives the camera, so apply facingPose() there instead. Resolves when it lands; a new
   * flyTo replaces one in flight. `ms <= 0` snaps.
   */
  flyTo(t, e = 550) {
    var a;
    if ((a = this.cancelFly) == null || a.call(this), e <= 0)
      return this.setCameraPose(t), Promise.resolve();
    const l = this.getCameraPose();
    return new Promise((i) => {
      const o = performance.now();
      let r = 0;
      this.cancelFly = () => {
        cancelAnimationFrame(r), this.cancelFly = null, i();
      };
      const s = (f) => {
        const u = Math.min(1, (f - o) / e), v = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, h = (w, I) => [w[0] + (I[0] - w[0]) * v, w[1] + (I[1] - w[1]) * v, w[2] + (I[2] - w[2]) * v];
        this.setCameraPose({ position: h(l.position, t.position), target: h(l.target, t.target) }), u < 1 ? r = requestAnimationFrame(s) : (this.cancelFly = null, i());
      };
      r = requestAnimationFrame(s);
    });
  }
  /** The camera's current pose (target = the point it looks at, one unit ahead). */
  getCameraPose() {
    const t = this.camera.position, e = this.camera.getWorldDirection(new P.Vector3()).add(t);
    return { position: [t.x, t.y, t.z], target: [e.x, e.y, e.z] };
  }
  // ── Panels ──────────────────────────────────────────────────────────────────
  addPanel(t) {
    if (this.panels.has(t.id)) throw new Error(`CathodeStage3D: duplicate panel id "${t.id}"`);
    const e = new Ba(this, t);
    return e.content.surface.setAnisotropy(this.renderer.capabilities.getMaxAnisotropy()), this.panels.set(t.id, e), this.scene.add(e.group), this.raise(e), this.invalidate(), e;
  }
  removePanel(t) {
    const e = this.panels.get(t);
    e && (this.focusedId === t && this.setFocus(null), this.hovered === e && (this.hovered = null), this.pressed === e && (this.pressed = null), this.scene.remove(e.group), e.dispose(), this.panels.delete(t), this.invalidate());
  }
  /** Show / hide a panel. Hiding releases its focus, hover, press and drag. */
  setPanelVisible(t, e) {
    var a;
    const l = this.panels.get(t);
    l && (l.setVisible(e), e || (this.focusedId === t && this.setFocus(null), this.hovered === l && (this.hovered = null), this.pressed === l && (this.pressed = null), ((a = this.dragging) == null ? void 0 : a.panel) === l && (this.dragging = null)), this.invalidate());
  }
  /** Keyboard focus + raise. */
  setFocus(t) {
    var a, i;
    if (this.focusedId === t) {
      t && this.raise(this.panels.get(t));
      return;
    }
    const e = this.focusedId && this.panels.get(this.focusedId);
    this.focusedId = t, e && e.invalidateBar();
    const l = t ? this.panels.get(t) : null;
    l && (this.raise(l), l.invalidateBar()), (i = (a = this.o).onFocus) == null || i.call(a, t), this.invalidate();
  }
  raise(t) {
    t.body.renderOrder = t.bar.renderOrder = ++this.raiseCounter;
  }
  getLayout() {
    const t = {};
    for (const [e, l] of this.panels)
      t[e] = { x: l.group.position.x, y: l.group.position.y, z: l.group.position.z, rotY: l.group.rotation.y, visible: l.visible };
    return t;
  }
  applyLayout(t) {
    for (const [e, l] of Object.entries(t)) {
      const a = this.panels.get(e);
      a && (a.group.position.set(l.x ?? a.group.position.x, l.y ?? a.group.position.y, l.z ?? a.group.position.z), l.rotY !== void 0 && (a.group.rotation.y = l.rotY), l.visible !== void 0 && this.setPanelVisible(e, l.visible));
    }
    this.invalidate();
  }
  // ── Rendering (on demand) ───────────────────────────────────────────────────
  invalidate() {
    this.raf || this.rendering || (this.raf = requestAnimationFrame(() => {
      this.raf = 0, this.frame();
    }));
  }
  frame() {
    var t;
    this.rendering = !0;
    for (const e of this.panels.values()) e.paintIfDirty();
    (t = this.controls) == null || t.update(), this.renderer.render(this.scene, this.camera), this.rendering = !1;
  }
  resize() {
    const t = this.o.container.clientWidth, e = this.o.container.clientHeight;
    !t || !e || (this.renderer.setSize(t, e, !1), this.camera.aspect = t / e, this.camera.updateProjectionMatrix(), this.invalidate());
  }
  // ── Picking ─────────────────────────────────────────────────────────────────
  setRay(t, e) {
    const l = this.canvas.getBoundingClientRect();
    this.ndc.set((t - l.left) / l.width * 2 - 1, -((e - l.top) / l.height) * 2 + 1), this.ray.setFromCamera(this.ndc, this.camera);
  }
  /** Content px (the panel's logical px) under a client point, or null (miss / bezel). */
  contentAt(t, e, l) {
    this.setRay(e, l);
    const a = this.ray.intersectObject(t.body)[0];
    return a != null && a.uv ? t.content.surface.contentPoint(a.uv.x, a.uv.y) : null;
  }
  /** Local content-px per screen-px at a client point: two probes 8px apart, as the DOM grid does. */
  hitScaleAt(t, e, l) {
    const a = this.contentAt(t, e - 4, l), i = this.contentAt(t, e + 4, l);
    return !a || !i ? 1 : Math.max(1, Math.abs(i.x - a.x) / 8);
  }
  /** The nearest panel part under a client point (bodies and title bars; raised panels win ties). */
  pick(t, e) {
    this.setRay(t, e);
    const l = [];
    for (const u of this.panels.values()) u.visible && l.push(u.body, u.bar);
    const a = this.ray.intersectObjects(l, !1);
    if (!a.length) return null;
    const i = a[0].distance;
    let o = a[0];
    for (const u of a)
      u.distance - i < 1e-3 && u.object.renderOrder > o.object.renderOrder && (o = u);
    const r = o.object.userData.panel, s = o.object === r.bar ? "bar" : "body", f = s === "body" && o.uv ? r.content.surface.contentPoint(o.uv.x, o.uv.y) : null;
    return { panel: r, part: s, content: f };
  }
  /**
   * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
   * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
   */
  clientPointForContent(t, e, l) {
    const a = this.panels.get(t);
    if (!a) return null;
    const i = a.content.surface, o = a.content.width, r = a.content.height;
    let s = e / o, f = 1 - l / r;
    const u = (I, L) => i.contentPoint(I, L);
    for (let I = 0; I < 12; I++) {
      const L = u(s, f);
      if (!L) {
        s = 0.5 + (s - 0.5) * 0.8, f = 0.5 + (f - 0.5) * 0.8;
        continue;
      }
      const m = L.x - e, g = L.y - l;
      if (Math.hypot(m, g) < 0.05) break;
      const R = 1e-4, F = u(s + R, f), k = u(s, f + R);
      if (!F || !k) break;
      const S = (F.x - L.x) / R, p = (k.x - L.x) / R, M = (F.y - L.y) / R, Y = (k.y - L.y) / R, E = S * Y - p * M;
      if (Math.abs(E) < 1e-9) break;
      s -= (Y * m - p * g) / E, f -= (-M * m + S * g) / E;
    }
    const v = u(s, f);
    if (!v || Math.hypot(v.x - e, v.y - l) > 1.5) return null;
    a.group.updateWorldMatrix(!0, !0);
    const h = a.body.localToWorld(new P.Vector3((s - 0.5) * (o / this.pxPerUnit), (f - 0.5) * (r / this.pxPerUnit), 0));
    h.project(this.camera);
    const w = this.canvas.getBoundingClientRect();
    return { x: w.left + (h.x + 1) / 2 * w.width, y: w.top + (1 - h.y) / 2 * w.height };
  }
  /** Client point of a panel's title bar centre (for tests / tours). */
  clientPointForBar(t) {
    const e = this.panels.get(t);
    if (!e) return null;
    e.group.updateWorldMatrix(!0, !0);
    const l = e.bar.getWorldPosition(new P.Vector3()).project(this.camera), a = this.canvas.getBoundingClientRect();
    return { x: a.left + (l.x + 1) / 2 * a.width, y: a.top + (1 - l.y) / 2 * a.height };
  }
  // ── Pointer routing ─────────────────────────────────────────────────────────
  send(t, e, l, a = {}) {
    var r, s;
    const i = this.contentAt(t, l.clientX, l.clientY), o = {
      kind: e,
      x: i ? i.x : -1,
      y: i ? i.y : -1,
      hitScale: i ? this.hitScaleAt(t, l.clientX, l.clientY) : 1,
      clientX: l.clientX,
      clientY: l.clientY,
      deltaX: a.deltaX ?? 0,
      deltaY: a.deltaY ?? 0,
      detail: e === "click" ? l.detail ?? 0 : 0,
      shiftKey: !!l.shiftKey
    };
    return ((s = (r = t.content).pointer) == null ? void 0 : s.call(r, o)) ?? null;
  }
  setCursor(t) {
    t !== this.lastCursor && (this.lastCursor = t, this.o.onCursor ? this.o.onCursor(t) : this.canvas.style.cursor = t);
  }
  setHover(t, e) {
    this.hovered && this.hovered !== t && this.send(this.hovered, "leave", e ?? { clientX: -1, clientY: -1 }), this.hovered = t, t || this.setCursor("");
  }
  /** passThrough: did this event land on something the stage may take (not DOM stacked above it)? */
  accepts(t) {
    return !this.passThrough || !this.o.shouldHandle || this.o.shouldHandle(t.target);
  }
  onPointerDown(t) {
    if (t.button !== 0 || !this.accepts(t)) return;
    this.passThrough || this.canvas.focus({ preventScroll: !0 });
    const e = this.pick(t.clientX, t.clientY);
    if (!e) {
      this.passThrough && this.setFocus(null);
      return;
    }
    this.passThrough && (t.stopPropagation(), this.swallowClick = !0), this.controls && (this.controls.enabled = !1), this.setFocus(e.panel.id), this.suppressClick = !1, e.part === "bar" ? (this.startDrag(e.panel), this.setCursor("grabbing")) : (this.pressed = e.panel, this.send(e.panel, "down", t));
  }
  onPointerMove(t) {
    if (this.dragging) {
      this.dragTo(t);
      return;
    }
    if (this.pressed) {
      this.send(this.pressed, "drag", t);
      return;
    }
    if (!this.accepts(t)) {
      this.setHover(null, t);
      return;
    }
    const e = this.pick(t.clientX, t.clientY);
    if (this.setHover(e && e.part === "body" ? e.panel : null, t), !e) {
      this.setCursor("");
      return;
    }
    if (e.part === "bar") {
      this.setCursor("grab");
      return;
    }
    const l = this.send(e.panel, "move", t);
    l && this.setCursor(l);
  }
  onPointerUp(t) {
    var e, l;
    if (this.dragging) {
      this.dragging.moved && (this.suppressClick = !0);
      const a = this.dragging.panel;
      this.dragging = null, this.setCursor(""), (l = (e = this.o).onPanelMoved) == null || l.call(e, a.id, { x: a.group.position.x, y: a.group.position.y, z: a.group.position.z });
    }
    this.pressed && (this.send(this.pressed, "up", t), this.pressed = null), this.controls && (this.controls.enabled = !0);
  }
  onClick(t) {
    var l, a;
    if (!this.accepts(t)) return;
    if (this.passThrough && this.swallowClick && (this.swallowClick = !1, t.stopPropagation()), this.suppressClick) {
      this.suppressClick = !1;
      return;
    }
    const e = this.pick(t.clientX, t.clientY);
    e && this.passThrough && t.stopPropagation(), e && e.part === "body" && this.send(e.panel, "click", t), e && e.part === "bar" && t.detail >= 2 && ((a = (l = this.o).onPanelActivate) == null || a.call(l, e.panel.id));
  }
  onWheel(t) {
    if (!this.accepts(t)) return;
    const e = this.pick(t.clientX, t.clientY);
    !e || e.part !== "body" || (t.preventDefault(), t.stopImmediatePropagation(), this.send(e.panel, "wheel", t, { deltaX: t.deltaX, deltaY: t.deltaY }));
  }
  onKey(t) {
    if (this.passThrough) {
      const l = t.target;
      if (l && (l.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(l.tagName))) return;
    }
    const e = this.focusedId ? this.panels.get(this.focusedId) : null;
    e != null && e.content.key && (e.content.key(t), e.invalidate());
  }
  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────
  startDrag(t) {
    t.group.updateWorldMatrix(!0, !0);
    const e = new P.Vector3(0, 0, 1).applyQuaternion(t.group.quaternion), l = new P.Plane().setFromNormalAndCoplanarPoint(e, t.group.position), a = new P.Vector3(), i = new P.Vector3();
    this.ray.ray.intersectPlane(l, a) && i.copy(t.group.position).sub(a), this.dragging = { panel: t, plane: l, offset: i, moved: !1 };
  }
  dragTo(t) {
    const e = this.dragging;
    this.setRay(t.clientX, t.clientY);
    const l = new P.Vector3();
    this.ray.ray.intersectPlane(e.plane, l) && (e.panel.group.position.copy(l.add(e.offset)), e.moved = !0, this.invalidate());
  }
  // ── Teardown ────────────────────────────────────────────────────────────────
  dispose() {
    var t, e;
    (t = this.cancelFly) == null || t.call(this), cancelAnimationFrame(this.raf), this.resizeObserver.disconnect();
    for (const l of this.disposers) l();
    for (const l of [...this.panels.values()]) this.removePanel(l.id);
    (e = this.controls) == null || e.dispose();
    try {
      this.renderer.forceContextLoss();
    } catch {
    }
    this.renderer.dispose(), this.canvas.remove();
  }
}
function Za(n, t, e, l = {}) {
  return { surface: n, width: t, height: e, ...l };
}
function Qa(n) {
  let t = () => {
  };
  const e = n.theme ?? "phosphor", l = En({
    columnDefs: () => n.columnDefs,
    defaultColDef: () => n.defaultColDef,
    rowData: () => n.rowData,
    pinnedBottomRowData: () => n.pinnedBottomRowData,
    rowHeight: () => n.rowHeight ?? 28,
    theme: () => e,
    emit: n.emit ?? (() => {
    }),
    host: { redraw: () => t() }
  });
  l.init(), l.setViewport(n.width, n.height, n.width, n.height);
  const a = new Ht({
    mode: "world",
    paint: (r, s) => l.paint(r, s)
  }), i = (r) => {
    const s = { cx: r.x, cy: r.y, hitScale: r.hitScale };
    switch (r.kind) {
      case "move":
        return l.resizing ? null : l.hover(s);
      case "leave":
        return l.leave(), null;
      case "down":
        return l.pointerDown(s, r.clientX, r.clientY), null;
      case "drag":
        return l.globalMove(r.clientX, r.clientY), null;
      case "up":
        return l.globalUp(), null;
      case "click":
        return l.click(s, { shiftKey: r.shiftKey, detail: r.detail }), null;
      case "wheel":
        return l.wheel(r.deltaX, r.deltaY, r.shiftKey), null;
    }
  }, o = (r) => {
    if (l.activeFilter.value) {
      if (r.key === "Escape") {
        r.preventDefault(), l.clearFilter();
        return;
      }
      if (r.key === "Enter") {
        r.preventDefault(), l.closeFilter();
        return;
      }
      if (r.key === "Backspace") {
        r.preventDefault(), l.setFilterText(l.filterPopupValue.value.slice(0, -1)), t();
        return;
      }
      if (r.key.length === 1 && !r.ctrlKey && !r.metaKey) {
        r.preventDefault(), l.setFilterText(l.filterPopupValue.value + r.key), t();
        return;
      }
    }
    l.keyDown(r);
  };
  return {
    model: l,
    surface: a,
    width: n.width,
    height: n.height,
    attach: (r) => {
      t = r;
    },
    pointer: i,
    key: o,
    dispose: () => {
      l.dispose(), a.dispose();
    }
  };
}
function Ja(n) {
  let t = () => {
  }, e = { ...n };
  const l = () => ((e.min ?? -1) + (e.max ?? 1)) / 2;
  let a = e.animate === !1 ? e.value : l(), i = 0;
  const o = new Ht({
    mode: "world",
    paint: (s, { dpr: f, glow: u }) => {
      Bn(s, {
        dpr: f,
        theme: e.theme ?? "none",
        colors: e.colors,
        glow: u,
        shown: a,
        value: e.value,
        min: e.min ?? -1,
        max: e.max ?? 1,
        readout: e.readout,
        stance: e.stance,
        sub: e.sub,
        leftLabel: e.leftLabel ?? "−",
        rightLabel: e.rightLabel ?? "+",
        sideLetters: e.sideLetters ?? ["−", "+"],
        marks: e.marks ?? [],
        meter: e.meter ?? null,
        caption: e.caption,
        note: e.note,
        items: e.items ?? [],
        emptyText: e.emptyText
      });
    }
  }), r = () => {
    if (cancelAnimationFrame(i), e.animate === !1) {
      a = e.value, t();
      return;
    }
    const s = () => {
      const f = e.value - a;
      if (Math.abs(f) < 4e-3) {
        a = e.value, t();
        return;
      }
      a += f * 0.18, t(), i = requestAnimationFrame(s);
    };
    i = requestAnimationFrame(s);
  };
  return {
    surface: o,
    width: n.width,
    height: n.height,
    attach: (s) => {
      t = s, r();
    },
    // the mount sweep: centre → value
    update(s) {
      const f = s.value !== void 0 && s.value !== e.value;
      e = { ...e, ...s }, f || s.animate !== void 0 ? r() : t();
    },
    get shown() {
      return a;
    },
    dispose: () => {
      cancelAnimationFrame(i), t = () => {
      }, o.dispose();
    }
  };
}
export {
  wt as CANDLE_THEME_COLORS,
  $a as CathodeCandle,
  Va as CathodeCandleGrid,
  Xa as CathodeContainer,
  Ga as CathodeGauge,
  Ya as CathodeGrid,
  Na as CathodeLoader,
  _l as CathodeLog,
  ja as CathodeStage3D,
  Ht as CathodeSurface,
  Ha as CathodeTerminal,
  Ua as CathodeWorkspace,
  Pt as GAUGE_THEME_COLORS,
  Et as LOG_THEME_COLORS,
  Ba as Panel3D,
  wl as barrelUV,
  Oa as buildDefaultLayout,
  Ka as createSurfaceMesh,
  Bn as drawGauge,
  Ja as gaugeContent,
  Qa as gridContent,
  yl as lensUV,
  qa as resizeSurfaceMesh,
  Za as surfaceContent,
  _n as useCathodeLayout,
  En as useGridModel
};
