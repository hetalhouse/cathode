var Gn = Object.defineProperty;
var Kn = (n, t, e) => t in n ? Gn(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var ae = (n, t, e) => Kn(n, typeof t != "symbol" ? t + "" : t, e);
import { effectScope as jn, ref as X, reactive as $t, watch as te, nextTick as Ae, computed as ue, defineComponent as Qe, inject as St, onMounted as Xe, onUnmounted as et, openBlock as be, createElementBlock as Me, normalizeStyle as je, createElementVNode as he, withModifiers as ut, unref as ve, withKeys as vn, createCommentVNode as qe, toDisplayString as Ue, createVNode as Sn, withDirectives as Tn, vModelText as qn, provide as mn, renderSlot as qt, Transition as Zn, withCtx as Jn, Fragment as Qn, renderList as el, createTextVNode as tl, normalizeClass as nl, vShow as ll } from "vue";
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
}, Te = 30, Zt = 12, ol = 10, Rt = 14, Cn = 5;
function It() {
  return `${Zt}px system-ui, -apple-system, sans-serif`;
}
function kn(n, t, e) {
  const l = String(t ?? "");
  if (!l) return [""];
  const o = l.split(/\s+/).filter(Boolean);
  if (o.length === 0) return [""];
  const i = [];
  let a = "";
  for (const r of o) {
    const c = a ? a + " " + r : r;
    !a || n.measureText(c).width <= e ? a = c : (i.push(a), a = r);
  }
  return a && i.push(a), i.length ? i : [""];
}
function al(n, t) {
  return Math.max(t, n * Rt + Cn * 2);
}
function nn(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let l = 0; l < t; l++) e[l + 1] = e[l] + (n[l] ?? 0);
  return e;
}
function Dt(n, t) {
  if (t <= 0) return 0;
  let e = 0, l = n.length - 1;
  for (; e < l; ) {
    const o = e + l + 1 >> 1;
    n[o] <= t ? e = o : l = o - 1;
  }
  return e;
}
const Ln = 28;
function il(n, t) {
  if (typeof t == "function") return t(n);
  const e = n.filter((o) => o != null && o !== "");
  if (t === "count") return e.length;
  const l = e.map((o) => Number(o)).filter((o) => !Number.isNaN(o));
  if (l.length === 0) return null;
  switch (t) {
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
function rl(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const o = n.width / l, i = n.height / l, a = pt[t.theme] ?? pt.none, { cols: r, rows: c, pinnedRows: f, rowHeight: u, scrollY: m, scrollX: v, glow: y } = t;
  e.clearRect(0, 0, o, i), e.fillStyle = a.bg, e.fillRect(0, 0, o, i), e.save(), e.beginPath(), e.rect(0, 0, o, i), e.clip();
  const D = f.length * u, L = t.aggregateRow ? Ln : 0, h = i - Te - D - L;
  e.fillStyle = a.headerBg, e.fillRect(0, 0, o, Te), e.textBaseline = "middle", e.textAlign = "left";
  let g = -v;
  for (let d = 0; d < r.length; d++) {
    const w = r[d];
    if (g + w.width <= 0) {
      g += w.width;
      continue;
    }
    if (g >= o) break;
    const O = !!t.colFilters[w.colId], I = t.sorts.findIndex(($) => $.colId === w.colId), G = I >= 0, U = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(g, 0, w.width, Te), e.clip(), e.font = `bold ${ol}px system-ui, -apple-system, sans-serif`, e.fillStyle = O ? a.accent : a.textHeader, y ? (e.shadowColor = a.textHeader, e.shadowBlur = 10, e.fillText(U, g + 8, Te / 2), e.shadowBlur = 4, e.fillText(U, g + 8, Te / 2), e.shadowBlur = 0) : e.fillText(U, g + 8, Te / 2), G) {
      const $ = e.measureText(U).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = a.accent;
      const Z = t.sorts[I].dir === "asc" ? "▲" : "▼";
      e.fillText(t.sorts.length > 1 ? `${Z}${I + 1}` : Z, g + 8 + $ + 4, Te / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = O ? a.accent : a.textHeader, e.globalAlpha = O ? 1 : 0.38, e.fillText("⌕", g + w.width - 20, Te / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(g + w.width - 0.5, 0), e.lineTo(g + w.width - 0.5, Te), e.stroke(), g += w.width;
  }
  e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Te - 0.5), e.lineTo(o, Te - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Te, o, h), e.clip();
  const R = t.rowHeights && t.rowHeights.length === c.length ? t.rowHeights : null, F = R ? nn(R, c.length) : null, k = (d) => F ? F[d] : d * u, S = (d) => R ? R[d] : u, p = F ? Dt(F, m) : Math.max(0, Math.floor(m / u));
  let M;
  if (F)
    for (M = p; M < c.length && k(M) < m + h; ) M++;
  else
    M = Math.min(c.length, Math.ceil((m + h) / u));
  const z = t.selectionAnchorRow ?? t.selectedRow, E = t.selectionAnchorCol ?? t.selectedCol, J = t.selectedRow >= 0 && z >= 0 ? Math.min(t.selectedRow, z) : -1, _ = t.selectedRow >= 0 && z >= 0 ? Math.max(t.selectedRow, z) : -1, C = t.selectedCol >= 0 && E >= 0 ? Math.min(t.selectedCol, E) : -1, H = t.selectedCol >= 0 && E >= 0 ? Math.max(t.selectedCol, E) : -1, V = _ > J || H > C;
  let q = Number.POSITIVE_INFINITY, le = Number.NEGATIVE_INFINITY, ie = Number.POSITIVE_INFINITY, ne = Number.NEGATIVE_INFINITY;
  const ee = (d, w, O, I) => {
    y ? (e.shadowColor = I, e.shadowBlur = 12, e.fillText(d, w, O), e.shadowBlur = 6, e.fillText(d, w, O), e.shadowBlur = 2, e.fillText(d, w, O), e.shadowBlur = 0) : e.fillText(d, w, O);
  };
  for (let d = p; d < M; d++) {
    const w = c[d], O = S(d), I = Te + k(d) - m;
    d % 2 === 1 && (e.fillStyle = a.rowAlt, e.fillRect(0, I, o, O));
    const G = d >= J && d <= _;
    d === t.hoveredRow && !G && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, I, o, O)), G && !V && (e.fillStyle = Vt(a.accent, 0.1), e.fillRect(0, I, o, O)), e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, I + O - 0.5), e.lineTo(o, I + O - 0.5), e.stroke();
    let U = -v;
    for (let $ = 0; $ < r.length; $++) {
      const Z = r[$];
      if (U + Z.width <= 0) {
        U += Z.width;
        continue;
      }
      if (U >= o) break;
      const ce = G && $ >= C && $ <= H;
      ce && V && (e.fillStyle = Vt(a.accent, 0.14), e.fillRect(U, I, Z.width, O)), ce && (U < q && (q = U), U + Z.width > le && (le = U + Z.width), I < ie && (ie = I), I + O > ne && (ne = I + O));
      const me = t.getCellStyle(Z, w), ye = me.color ?? a.text, Se = me.textAlign ?? "left", W = t.formatCell(Z, w);
      if (e.save(), e.beginPath(), e.rect(U + 1, I, Z.width - 2, O), e.clip(), e.font = It(), e.fillStyle = ye, e.textBaseline = "middle", Z.colDef.wrap) {
        e.textAlign = "left";
        const N = kn(e, W, Math.max(20, Z.width - 16));
        let se = I + Cn + Rt / 2;
        for (const ge of N) {
          if (se - Rt / 2 >= I + O) break;
          ee(ge, U + 8, se, ye), se += Rt;
        }
      } else {
        const N = Se === "right" ? U + Z.width - 8 : U + 8;
        e.textAlign = Se === "right" ? "right" : "left", ee(W, N, I + O / 2, ye);
      }
      e.restore(), d === t.selectedRow && $ === t.selectedCol && (e.strokeStyle = a.accent, e.lineWidth = 2, e.strokeRect(U + 1.5, I + 1.5, Z.width - 3, O - 3)), e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(U + Z.width - 0.5, I), e.lineTo(U + Z.width - 0.5, I + O), e.stroke(), U += Z.width;
    }
  }
  if (V && q < le && ie < ne && (e.strokeStyle = a.accent, e.lineWidth = 2, e.strokeRect(q + 0.5, ie + 0.5, le - q - 1, ne - ie - 1)), e.restore(), f.length > 0) {
    const d = i - D - L;
    e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, d - 0.5), e.lineTo(o, d - 0.5), e.stroke();
    for (let w = 0; w < f.length; w++) {
      const O = f[w], I = d + w * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, I, o, u);
      let G = -v;
      for (let U = 0; U < r.length; U++) {
        const $ = r[U];
        if (G + $.width <= 0) {
          G += $.width;
          continue;
        }
        if (G >= o) break;
        const Z = t.getCellStyle($, O), ce = Z.color ?? a.text, me = Z.textAlign ?? "left", ye = t.formatCell($, O);
        e.save(), e.beginPath(), e.rect(G + 1, I, $.width - 2, u), e.clip(), e.font = `bold ${Zt}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle", me === "right" ? (e.textAlign = "right", e.fillText(ye, G + $.width - 8, I + u / 2)) : (e.textAlign = "left", e.fillText(ye, G + 8, I + u / 2)), e.restore(), e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(G + $.width - 0.5, I), e.lineTo(G + $.width - 0.5, I + u), e.stroke(), G += $.width;
      }
      e.strokeStyle = a.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, I + u - 0.5), e.lineTo(o, I + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const d = i - L;
    e.fillStyle = Vt(a.accent, 0.1), e.fillRect(0, d, o, L), e.strokeStyle = a.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, d - 0.5), e.lineTo(o, d - 0.5), e.stroke();
    let w = -v;
    for (let O = 0; O < r.length; O++) {
      const I = r[O];
      if (w + I.width <= 0) {
        w += I.width;
        continue;
      }
      if (w >= o) break;
      const U = t.getCellStyle(I, t.aggregateRow).textAlign ?? "left", $ = t.aggregateRow[I.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, d, I.width - 2, L), e.clip(), e.font = `bold ${Zt}px system-ui, -apple-system, sans-serif`, e.fillStyle = a.accent, e.textBaseline = "middle", y && (e.shadowColor = a.accent, e.shadowBlur = 8), U === "right" ? (e.textAlign = "right", e.fillText($, w + I.width - 8, d + L / 2)) : (e.textAlign = "left", e.fillText($, w + 8, d + L / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = a.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + I.width - 0.5, d), e.lineTo(w + I.width - 0.5, d + L), e.stroke(), w += I.width;
    }
  }
  e.restore();
}
function Vt(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), o = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${l},${o},${t})`;
}
const Ct = 190, Ot = 34;
function sl(n, t, e) {
  const l = Math.max(4, Math.min(t, n - Ct - 4)), o = Te + 6, i = e ? 26 : 0;
  return {
    box: { x: l, y: o, w: Ct, h: Ot },
    input: { x: l + 9, y: o + 5, w: Ct - 18 - i, h: Ot - 10 },
    clear: e ? { x: l + Ct - 28, y: o, w: 28, h: Ot } : null
  };
}
const Ut = (n, t, e, l = 0) => n >= e.x - l && n <= e.x + e.w + l && t >= e.y && t <= e.y + e.h;
function kt(n, t, e, l = 1) {
  return e.clear && Ut(n, t, e.clear, 4 * (l - 1)) ? "clear" : Ut(n, t, e.input) ? "input" : Ut(n, t, e.box) ? "inside" : "outside";
}
function cl(n, t, e, l, o) {
  const { box: i, input: a, clear: r } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = o.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(i.x + 0.5, i.y + 0.5, i.w - 1, i.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(a.x, a.y, a.w, a.h, 3), n.fill(), n.beginPath(), n.rect(a.x, a.y, a.w, a.h), n.clip(), n.font = It(), n.textBaseline = "middle";
  const c = a.y + a.h / 2 + 1, f = 5;
  if (e) {
    n.fillStyle = o.text;
    const u = n.measureText(e).width, m = u > a.w - 2 * f - 2 ? a.x + a.w - f - 2 - u : a.x + f;
    n.fillText(e, m, c), l && (n.fillStyle = o.accent, n.fillRect(Math.min(m + u + 1, a.x + a.w - f), a.y + 4, 1.5, a.h - 8));
  } else
    n.fillStyle = o.textHeader, n.fillText("Filter…", a.x + f, c), l && (n.fillStyle = o.accent, n.fillRect(a.x + f, a.y + 4, 1.5, a.h - 8));
  n.restore(), r && (n.save(), n.font = It(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = o.textHeader, n.fillText("✕", r.x + r.w / 2, r.y + r.h / 2 + 1), n.restore());
}
function ul(n, t, e) {
  const l = n - 0.5, o = t - 0.5, i = Math.abs(e), a = (l * l + o * o) * i;
  if (e < 0) {
    const f = 0.5 * i, m = 1 / (1 - 2 * (0.5 * (1 + f) * f)), v = (l + l * (1 + a) * a * -1) * m, y = (o + o * (1 + a) * a * -1) * m;
    return [0.5 + v, 0.5 + y];
  }
  const r = l * (1 + a) * a, c = o * (1 + a) * a;
  return [n + r, t + c];
}
function Rn(n, t, e, l, o, i = e, a = l) {
  const r = n / e, c = 1 - t / l, [f, u] = ul(r, c, o);
  return f < 0 || f > 1 || u < 0 || u > 1 ? [-1, -1] : [f * i, (1 - u) * a];
}
function Xt(n, t) {
  let e = 0;
  for (let l = 0; l < n; l++) e += t[l].width;
  return e;
}
function fl(n, t, e, l = 1) {
  return n >= t + e - 24 * l && n < t + e;
}
function gn(n, t, e, l = 1) {
  const o = t + e;
  return n >= o - 6 * l && n <= o + 1 * l;
}
function dl(n, t, e, l, o, i, a, r, c, f = !1, u) {
  const m = n + c;
  let v = -1, y = 0;
  for (let R = 0; R < e.length; R++) {
    if (m >= y && m < y + e[R].width) {
      v = R;
      break;
    }
    y += e[R].width;
  }
  if (t < Te) return { area: "header", colIdx: v, rowIdx: -1 };
  const D = f ? Ln : 0;
  if (D > 0 && t >= a - D)
    return { area: "agg", colIdx: v, rowIdx: -1 };
  const L = r * o;
  if (L > 0 && t >= a - L - D) {
    const R = Math.floor((t - (a - L - D)) / o);
    return { area: "pinned", colIdx: v, rowIdx: R };
  }
  const h = t - Te + i, g = u && u.length === l ? Dt(nn(u, l), h) : Math.floor(h / o);
  return g >= 0 && g < l ? { area: "body", colIdx: v, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
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
const hl = 500, Dn = hl / 2, Jt = 1.6, Bt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, _t = `
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
function Yt() {
  return {
    uMouseUV: { value: new P.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Jt },
    uLensTint: { value: new P.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Ce = { x: -999, y: -999 };
function zt(n, t, e, l, o) {
  const i = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = i && o > 0 ? Dn / o : 0, n.uniforms.uAspect.value = o > 0 ? l / o : 1;
}
function Tt(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const vl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ml = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`, gl = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Bt}

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

  ${_t}

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
function pl(n, t, e) {
  const l = n - 0.5, o = t - 0.5, i = Math.abs(e), a = (l * l + o * o) * i, r = (1 + a) * a * Math.sign(e);
  let c = l + l * r, f = o + o * r;
  if (e < 0) {
    const u = 0.5 * i, m = 0.5 * (1 + u) * u;
    c /= 1 - 2 * m, f /= 1 - 2 * m;
  }
  return { x: 0.5 + c, y: 0.5 + f };
}
function wl(n, t, e, l, o, i) {
  if (!l || e.x === Ce.x || i <= 0) return { x: n, y: t };
  const a = o / i, r = Dn / i, c = (n - e.x) * a, f = t - e.y, u = Math.hypot(c, f);
  if (u >= r) return { x: n, y: t };
  const m = u / r, v = Math.min(Math.max((m - 0.88) / (1 - 0.88), 0), 1), y = v * v * (3 - 2 * v), D = Jt + (1 - Jt) * y;
  return { x: e.x + c / D / a, y: e.y + f / D };
}
class ln {
  constructor(t) {
    ae(this, "canvas");
    ae(this, "material");
    ae(this, "mode");
    /** logical (CSS px) size and backing-store dpr — set by resize() */
    ae(this, "dpr", 1);
    ae(this, "logicalW", 0);
    ae(this, "logicalH", 0);
    /**
     * Visible panel size in px, when it differs from the content canvas (CathodeGrid's bend-field
     * gain draws a WIDER canvas than the screen it warps into). The lens is a fixed physical size
     * and circular in SCREEN px, so its radius/aspect come from this; 0 = same as the content.
     */
    ae(this, "screenW", 0);
    ae(this, "screenH", 0);
    ae(this, "texture");
    ae(this, "painter");
    ae(this, "maxDpr");
    ae(this, "look", { curvature: 0, scanlines: !0, vignette: !0, magnify: !1 });
    ae(this, "mouse", { x: Ce.x, y: Ce.y });
    ae(this, "anisotropy", 1);
    this.painter = t.paint, this.mode = t.mode ?? "screen", this.maxDpr = t.maxDpr ?? 2, this.canvas = document.createElement("canvas"), this.texture = this.makeTexture(), this.material = new P.ShaderMaterial({
      uniforms: {
        uTex: { value: this.texture },
        uStrength: { value: 0 },
        uScanlines: { value: 1 },
        uVignette: { value: 1 },
        ...Yt()
      },
      vertexShader: this.mode === "world" ? ml : vl,
      fragmentShader: gl,
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
    const o = Math.min(l, this.maxDpr), i = Math.round(t * o), a = Math.round(e * o);
    return this.canvas.width === i && this.canvas.height === a && this.dpr === o ? !1 : (this.dpr = o, this.logicalW = t, this.logicalH = e, this.canvas.width = i, this.canvas.height = a, this.texture.dispose(), this.texture = this.makeTexture(), this.material.uniforms.uTex.value = this.texture, !0);
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
    t.uStrength.value = Ze(this.look.curvature), t.uScanlines.value = this.look.scanlines ? 1 : 0, t.uVignette.value = this.look.vignette ? 1 : 0, zt(
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
    const l = wl(t, e, this.mouse, this.look.magnify, this.screenW || this.logicalW, this.screenH || this.logicalH), o = pl(l.x, l.y, Ze(this.look.curvature));
    return o.x < 0 || o.x > 1 || o.y < 0 || o.y > 1 ? null : { x: o.x * this.logicalW, y: (1 - o.y) * this.logicalH };
  }
  dispose() {
    this.texture.dispose(), this.material.dispose();
  }
}
const yl = 600;
function En(n) {
  const t = jn(!0);
  return t.run(() => xl(n, t));
}
function xl(n, t) {
  var fn, dn;
  const { emit: e, host: l } = n, o = X(((fn = n.rowData) == null ? void 0 : fn.call(n)) ?? []), i = X(((dn = n.pinnedBottomRowData) == null ? void 0 : dn.call(n)) ?? []), a = X(""), r = X([]), c = $t({}), f = $t({}), u = $t(/* @__PURE__ */ new Set()), m = X(0), v = X(0), y = X(0), D = X(0), L = X(0), h = X(0), g = X(0), R = X(-1), F = X(null), k = X(null), S = X(null), p = X(""), M = X(0);
  let z = null;
  const E = X(!0);
  let J = null;
  te(S, (s) => {
    var x;
    J && (clearInterval(J), J = null), s ? (E.value = !0, J = setInterval(() => {
      E.value = !E.value, l.redraw();
    }, 530), Ae(() => {
      var b;
      return (b = l.focusFilterInput) == null ? void 0 : b.call(l);
    })) : (z = null, (x = l.blurFilterInput) == null || x.call(l)), l.redraw();
  });
  function _(s) {
    return s.colId ?? s.field ?? (s.headerName ? s.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
  }
  const C = ue(() => {
    var x;
    const s = ((x = n.defaultColDef) == null ? void 0 : x.call(n)) ?? {};
    return n.columnDefs().filter((b) => !u.has(_(b))).map((b) => {
      const B = _(b), Y = { ...s, ...b };
      return { colId: B, colDef: Y, width: f[B] ?? Y.width ?? 100 };
    });
  }), H = ue(() => {
    const s = v.value;
    if (!s) return C.value;
    const x = C.value.reduce((Y, K) => Y + K.width, 0);
    if (!x || x >= s) return C.value;
    const b = s / x;
    let B = 0;
    return C.value.map((Y, K) => {
      const re = K === C.value.length - 1 ? s - B : Math.max(8, Math.round(Y.width * b));
      return B += re, { ...Y, width: re };
    });
  }), V = ue(() => {
    const s = H.value.reduce((x, b) => x + b.width, 0);
    return Math.max(0, s - v.value);
  });
  function q(s, x) {
    if (x.colDef.valueGetter) return x.colDef.valueGetter({ data: s, colDef: x.colDef });
    if (x.colDef.field) return s[x.colDef.field];
  }
  function le(s, x) {
    const b = q(x, s);
    return s.colDef.valueFormatter ? s.colDef.valueFormatter({ value: b, data: x, colDef: s.colDef }) ?? "" : s.colDef.cellRenderer ? (s.colDef.cellRenderer({ value: b, data: x, colDef: s.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
  }
  function ie(s, x) {
    return s.colDef.cellStyle ? typeof s.colDef.cellStyle == "function" ? s.colDef.cellStyle({ value: q(x, s), data: x, colDef: s.colDef }) ?? {} : s.colDef.cellStyle : {};
  }
  function ne() {
    return n.columnDefs().map((s, x) => ({ d: s, i: x })).filter(({ d: s }) => s.sort).sort((s, x) => (s.d.sortIndex ?? s.i) - (x.d.sortIndex ?? x.i)).map(({ d: s }) => ({ colId: _(s), dir: s.sort }));
  }
  const ee = ue(() => {
    m.value;
    let s = o.value;
    const x = a.value.trim().toLowerCase();
    x && (s = s.filter(
      (B) => C.value.some(
        (Y) => String(q(B, Y) ?? "").toLowerCase().includes(x)
      )
    ));
    for (const [B, Y] of Object.entries(c)) {
      if (!Y) continue;
      const K = C.value.find((Q) => Q.colId === B);
      if (K)
        if (Y.startsWith("__eq__")) {
          const Q = Y.slice(6).toLowerCase();
          s = s.filter((re) => String(q(re, K) ?? "").toLowerCase() === Q);
        } else {
          const Q = Y.toLowerCase();
          s = s.filter((re) => String(q(re, K) ?? "").toLowerCase().includes(Q));
        }
    }
    const b = r.value.map(({ colId: B, dir: Y }) => ({ col: C.value.find((K) => K.colId === B), dir: Y })).filter((B) => !!B.col);
    return b.length && (s = [...s].sort((B, Y) => {
      for (const { col: K, dir: Q } of b) {
        const re = q(B, K), Ee = q(Y, K);
        let De = 0;
        if (K.colDef.comparator ? De = K.colDef.comparator(re, Ee) : typeof re == "number" && typeof Ee == "number" ? De = re - Ee : De = String(re ?? "").localeCompare(String(Ee ?? ""), void 0, { numeric: !0 }), De) return Q === "asc" ? De : -De;
      }
      return 0;
    })), s;
  });
  let d = null;
  function w() {
    if (typeof document > "u") return null;
    d || (d = document.createElement("canvas"));
    const s = d.getContext("2d");
    return s && (s.font = It()), s;
  }
  const O = ue(() => H.value.some((s) => s.colDef.wrap)), I = ue(() => {
    if (!O.value) return null;
    const s = w();
    if (!s) return null;
    const x = H.value.filter((B) => B.colDef.wrap), b = n.rowHeight();
    return ee.value.map((B) => {
      let Y = 1;
      for (const K of x) {
        const Q = kn(s, le(K, B), Math.max(20, K.width - 16));
        Q.length > Y && (Y = Q.length);
      }
      return al(Y, b);
    });
  }), G = ue(
    () => I.value ? nn(I.value, ee.value.length) : null
  ), U = ue(
    () => G.value ? G.value[ee.value.length] : ee.value.length * n.rowHeight()
  ), $ = ue(() => {
    const s = i.value.length * n.rowHeight();
    return Math.max(0, y.value - Te - s);
  }), Z = ue(() => Math.max(0, U.value - $.value)), ce = ue(() => Math.max(1, Math.floor($.value / n.rowHeight()))), me = ue(() => {
    const s = ee.value.length;
    if (s === 0) return 0;
    const x = G.value ? Dt(G.value, h.value) : Math.floor(h.value / n.rowHeight());
    return Math.min(s - 1, x);
  }), ye = ue(() => {
    const s = ee.value.length;
    return s === 0 ? 0 : G.value ? Math.min(s - 1, Dt(G.value, h.value + $.value - 1)) : Math.min(s - 1, me.value + ce.value - 1);
  }), Se = ue(() => {
    const s = C.value.filter((Y) => Y.colDef.aggFunc != null);
    if (s.length === 0) return null;
    const x = ee.value, b = {};
    for (const Y of s) {
      const K = x.map((re) => q(re, Y)), Q = il(K, Y.colDef.aggFunc);
      if (Q == null) {
        b[Y.colId] = "";
        continue;
      }
      b[Y.colId] = Y.colDef.aggValueFormatter ? Y.colDef.aggValueFormatter(Q) : String(Q);
    }
    const B = s[0].colId;
    return b[B] === "" && (b[B] = "Σ"), b;
  });
  te(ee, () => {
    h.value = 0, F.value = null;
  }), te(V, () => {
    g.value = Math.min(g.value, V.value);
  }), te(Z, () => {
    h.value = Math.min(h.value, Z.value);
  }), te(
    [ee, () => i.value, H, h, R, F],
    () => Ae(() => l.redraw())
  ), te(F, (s) => {
    if (!s) return;
    const x = ee.value[s.row], b = H.value[s.col];
    x && b && e("cell-selected", { data: x, row: s.row, col: s.col, colId: b.colId });
  });
  function W(s, x, b, B) {
    D.value = b, L.value = B, v.value = s, y.value = x, g.value = Math.max(0, Math.min(V.value, g.value)), h.value = Math.max(0, Math.min(Z.value, h.value));
  }
  function N(s) {
    const x = G.value, b = x ? x[s] : s * n.rowHeight(), B = x ? x[s + 1] : b + n.rowHeight();
    b < h.value ? h.value = b : B > h.value + $.value && (h.value = Math.min(Z.value, B - $.value));
  }
  function se(s) {
    var Y;
    if (!v.value) return;
    let x = 0;
    for (let K = 0; K < s; K++) x += H.value[K].width;
    const b = ((Y = H.value[s]) == null ? void 0 : Y.width) ?? 0, B = x - g.value;
    B < 0 ? g.value = Math.max(0, x) : B + b > v.value && (g.value = Math.min(V.value, x + b - v.value));
  }
  function ge() {
    h.value = Math.max(0, h.value - $.value), l.redraw();
  }
  function pe() {
    h.value = Math.min(Z.value, h.value + $.value), l.redraw();
  }
  let Re = !1, ze = "", Pe = 0, Ne = 0, He = 1, Be = !1, A = !1, oe = 0, de = 0, Ge = 0, Ie = 0, Ke = !1;
  function at(s, x, b = 1) {
    var B;
    Re = !0, ze = s, Pe = x, He = b, Ne = ((B = H.value.find((Y) => Y.colId === s)) == null ? void 0 : B.width) ?? 100, Be = !1;
  }
  function ht(s, x) {
    A = !0, Ke = !1, oe = s, de = x, Ge = g.value, Ie = h.value;
  }
  function it(s, x) {
    const b = oe - s, B = de - x;
    (Math.abs(b) > 4 || Math.abs(B) > 4) && (Ke = !0), g.value = Math.max(0, Math.min(V.value, Ge + b)), h.value = Math.max(0, Math.min(Z.value, Ie + B)), l.redraw();
  }
  function T() {
    A && (Ke && (Be = !0), A = !1);
  }
  function j(s, x) {
    if (A) {
      it(s, x);
      return;
    }
    if (!Re) return;
    const b = v.value, B = Math.max(30, Ne + (s - Pe) * He), Y = C.value.filter((Q) => Q.colId !== ze).reduce((Q, re) => Q + re.width, 0), K = b - B;
    K > 10 && (f[ze] = Math.max(10, Math.round(B * Y / K))), l.redraw();
  }
  function fe() {
    T(), Re && (Re = !1, Be = !0, e("column-resized"));
  }
  function Fe(s, x) {
    return dl(
      s,
      x,
      H.value,
      ee.value.length,
      n.rowHeight(),
      h.value,
      y.value,
      i.value.length,
      g.value,
      Se.value !== null,
      I.value ?? void 0
    );
  }
  let _e = 0;
  function $e(s, x, b) {
    S.value = null;
    const B = Date.now();
    if (s !== 0) {
      _e = B, g.value = Math.max(0, Math.min(V.value, g.value + s)), l.redraw();
      return;
    }
    if (b && x !== 0) {
      _e = B, g.value = Math.max(0, Math.min(V.value, g.value + x)), l.redraw();
      return;
    }
    B - _e < yl || (h.value = Math.max(0, Math.min(Z.value, h.value + x)), l.redraw());
  }
  function Ve(s) {
    if (s.cx < 0)
      return R.value = -1, l.redraw(), null;
    if (S.value && z) {
      const B = kt(s.cx, s.cy, z, s.hitScale);
      if (B !== "outside")
        return R.value = -1, l.redraw(), B === "clear" ? "pointer" : "text";
    }
    const x = Fe(s.cx, s.cy);
    R.value = x.area === "body" ? x.rowIdx : -1;
    let b;
    if (x.area === "header" && x.colIdx >= 0) {
      const B = H.value[x.colIdx], Y = Xt(x.colIdx, H.value), K = s.cx + g.value;
      b = B && gn(K, Y, B.width, s.hitScale) ? "col-resize" : "pointer";
    } else x.area === "body" ? b = "pointer" : b = "default";
    return l.redraw(), b;
  }
  function vt() {
    R.value = -1, l.redraw();
  }
  function rt(s, x, b) {
    if (s.cx < 0 || S.value && z && kt(s.cx, s.cy, z, s.hitScale) !== "outside") return;
    if (s.cy >= Te) {
      ht(x, b);
      return;
    }
    const B = s.cx + g.value;
    for (let Y = 0; Y < H.value.length; Y++) {
      const K = H.value[Y], Q = Xt(Y, H.value);
      if (K.colDef.resizable !== !1 && gn(B, Q, K.width, s.hitScale)) {
        at(K.colId, x, s.hitScale);
        return;
      }
    }
  }
  function _n(s, x) {
    var Y, K, Q;
    const b = { stopPropagation: !1 };
    if (Be)
      return Be = !1, b;
    if (Re) return b;
    if (s.cx < 0)
      return S.value = null, b;
    if (S.value && z) {
      const re = kt(s.cx, s.cy, z, s.hitScale);
      if (re === "clear")
        return un(), b;
      if (re !== "outside")
        return (Y = l.focusFilterInput) == null || Y.call(l), b;
      S.value = null;
    }
    const B = Fe(s.cx, s.cy);
    if (B.area === "header" && B.colIdx >= 0) {
      const re = H.value[B.colIdx], Ee = Xt(B.colIdx, H.value), De = s.cx + g.value;
      if (re.colDef.filter && fl(De, Ee, re.width, s.hitScale))
        b.stopPropagation = !0, S.value === re.colId ? S.value = null : (S.value = re.colId, p.value = (K = c[re.colId]) != null && K.startsWith("__eq__") ? c[re.colId].slice(6) : c[re.colId] ?? "", M.value = Math.max(0, Ee - g.value));
      else if (re.colDef.sortable !== !1) {
        S.value = null;
        const st = r.value.find((Oe) => Oe.colId === re.colId), ct = st ? st.dir === "asc" ? "desc" : null : "asc";
        x.shiftKey ? r.value = st ? ct ? r.value.map((Oe) => Oe.colId === re.colId ? { colId: Oe.colId, dir: ct } : Oe) : r.value.filter((Oe) => Oe.colId !== re.colId) : [...r.value, { colId: re.colId, dir: "asc" }] : r.value = ct ? [{ colId: re.colId, dir: ct }] : [], e("sort-changed");
      }
      return b;
    }
    if (S.value = null, B.area === "body" && B.rowIdx >= 0 && B.colIdx >= 0) {
      const re = B.rowIdx;
      x.shiftKey && F.value ? (k.value || (k.value = { ...F.value }), F.value = { row: re, col: B.colIdx }) : (F.value = { row: re, col: B.colIdx }, k.value = { row: re, col: B.colIdx }), (Q = l.focusCanvas) == null || Q.call(l);
      const Ee = ee.value[re], De = H.value[B.colIdx];
      Ee && De && (e("row-clicked", { data: Ee, event: x }), e("cell-selected", { data: Ee, row: re, col: B.colIdx, colId: De.colId }));
    }
    return b;
  }
  function Wn(s) {
    S.value && (s && z && s.cx >= 0 && kt(s.cx, s.cy, z, s.hitScale) !== "outside" || (S.value = null));
  }
  function Yn(s) {
    const b = H.value.length - 1, B = ee.value.length - 1;
    if (!F.value) {
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(s.key) && (s.preventDefault(), F.value = { row: me.value, col: 0 }, k.value = { row: me.value, col: 0 });
      return;
    }
    let { row: Y, col: K } = F.value;
    const Q = (re, Ee, De = !1) => {
      Y = Math.max(0, Math.min(B, re)), K = Math.max(0, Math.min(b, Ee)), F.value = { row: Y, col: K }, De || (k.value = { row: Y, col: K }), N(Y), se(K);
    };
    switch (s.key) {
      case "ArrowDown":
        s.preventDefault(), Q(Y + 1, K, s.shiftKey);
        break;
      case "ArrowUp":
        s.preventDefault(), Q(Y - 1, K, s.shiftKey);
        break;
      case "ArrowRight":
        s.preventDefault(), s.shiftKey ? Q(Y, K + 1, !0) : K < b ? Q(Y, K + 1) : Q(Y + 1, 0);
        break;
      case "ArrowLeft":
        s.preventDefault(), s.shiftKey ? Q(Y, K - 1, !0) : K > 0 ? Q(Y, K - 1) : Q(Y - 1, b);
        break;
      case "Tab":
        s.preventDefault(), s.shiftKey ? K > 0 ? Q(Y, K - 1) : Q(Y - 1, b) : K < b ? Q(Y, K + 1) : Q(Y + 1, 0);
        break;
      case "Enter":
        s.preventDefault(), s.shiftKey ? Q(Y - 1, K) : Q(Y + 1, K);
        break;
      case "Home":
        s.preventDefault(), s.ctrlKey || s.metaKey ? Q(0, 0, s.shiftKey) : Q(Y, 0, s.shiftKey);
        break;
      case "End":
        s.preventDefault(), s.ctrlKey || s.metaKey ? Q(B, b, s.shiftKey) : Q(Y, b, s.shiftKey);
        break;
      case "PageDown":
        s.preventDefault(), Q(Math.min(B, Y + ce.value), K, s.shiftKey);
        break;
      case "PageUp":
        s.preventDefault(), Q(Math.max(0, Y - ce.value), K, s.shiftKey);
        break;
      case "Escape":
        F.value = null, k.value = null;
        break;
      case "c":
      case "C":
        (s.ctrlKey || s.metaKey) && (s.preventDefault(), zn());
        break;
    }
  }
  function zn() {
    var De;
    if (!F.value) return;
    const s = H.value, x = ee.value, b = k.value ?? F.value, B = Math.min(b.row, F.value.row), Y = Math.max(b.row, F.value.row), K = Math.min(b.col, F.value.col), Q = Math.max(b.col, F.value.col), re = [];
    for (let st = B; st <= Y; st++) {
      const ct = x[st];
      if (!ct) continue;
      const Oe = [];
      for (let Ht = K; Ht <= Q; Ht++) {
        const hn = s[Ht];
        hn && Oe.push(le(hn, ct).replace(/[\t\r\n]+/g, " "));
      }
      re.push(Oe.join("	"));
    }
    const Ee = re.join(`
`);
    (De = navigator.clipboard) == null || De.writeText(Ee).catch(() => {
    });
  }
  function Hn(s) {
    p.value = s, s ? c[S.value] = s : delete c[S.value], e("filter-changed");
  }
  function un() {
    S.value && delete c[S.value], p.value = "", S.value = null, e("filter-changed");
  }
  function $n() {
    S.value = null;
  }
  function Vn(s, x) {
    if (!S.value || !s.width) return;
    const b = s.getContext("2d");
    if (!b) return;
    b.setTransform(x, 0, 0, x, 0, 0), z = sl(s.width / x, M.value, !!p.value);
    const B = pt[n.theme()] ?? pt.none;
    cl(b, z, p.value, E.value, B);
  }
  function On(s, { dpr: x, glow: b }) {
    var B, Y, K, Q;
    rl(s, {
      cols: H.value,
      rows: ee.value,
      pinnedRows: i.value,
      rowHeight: n.rowHeight(),
      // Per-row variable heights for `wrap` columns.
      rowHeights: I.value ?? void 0,
      scrollY: h.value,
      scrollX: g.value,
      theme: n.theme(),
      glow: b,
      sorts: r.value,
      colFilters: c,
      hoveredRow: R.value,
      selectedRow: ((B = F.value) == null ? void 0 : B.row) ?? -1,
      selectedCol: ((Y = F.value) == null ? void 0 : Y.col) ?? -1,
      selectionAnchorRow: ((K = k.value) == null ? void 0 : K.row) ?? -1,
      selectionAnchorCol: ((Q = k.value) == null ? void 0 : Q.col) ?? -1,
      formatCell: le,
      getCellStyle: ie,
      aggregateRow: Se.value,
      dpr: x
    }), Vn(s, x);
  }
  const Un = {
    setGridOption(s, x) {
      s === "rowData" ? o.value = x : s === "pinnedBottomRowData" ? i.value = x : s === "quickFilterText" && (a.value = x);
    },
    getColumnState() {
      return n.columnDefs().map((s) => {
        var b;
        const x = _(s);
        return {
          colId: x,
          hide: u.has(x),
          sort: ((b = r.value.find((B) => B.colId === x)) == null ? void 0 : b.dir) ?? null,
          sortIndex: r.value.some((B) => B.colId === x) ? r.value.findIndex((B) => B.colId === x) : null,
          width: f[x] ?? s.width
        };
      });
    },
    applyColumnState({ state: s }) {
      const x = s.filter((b) => b.sort).sort((b, B) => (b.sortIndex ?? 0) - (B.sortIndex ?? 0));
      x.length && (r.value = x.map((b) => ({ colId: b.colId, dir: b.sort })));
      for (const b of s)
        b.hide === !0 && u.add(b.colId), b.hide === !1 && u.delete(b.colId), b.width && (f[b.colId] = b.width);
    },
    setFilterModel(s) {
      for (const x of Object.keys(c)) delete c[x];
      if (s)
        for (const [x, b] of Object.entries(s))
          (b == null ? void 0 : b.type) === "equals" ? c[x] = `__eq__${b.filter}` : b != null && b.filter && (c[x] = b.filter);
    },
    getFilterModel() {
      const s = {};
      for (const [x, b] of Object.entries(c))
        b && (s[x] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
      return s;
    },
    async setColumnFilterModel(s, x) {
      x ? x.type === "equals" ? c[s] = `__eq__${x.filter}` : c[s] = x.filter ?? "" : delete c[s];
    },
    onFilterChanged() {
    },
    refreshCells() {
      m.value++;
    },
    exportDataAsCsv({ fileName: s = "export.csv" } = {}) {
      const x = C.value, b = x.map((Q) => Q.colDef.headerName ?? Q.colId).join(","), B = ee.value.map(
        (Q) => x.map((re) => `"${String(le(re, Q)).replace(/"/g, '""')}"`).join(",")
      ), Y = new Blob([[b, ...B].join(`
`)], { type: "text/csv" }), K = URL.createObjectURL(Y);
      Object.assign(document.createElement("a"), { href: K, download: s }).click(), URL.revokeObjectURL(K);
    },
    resize() {
      var s;
      (s = l.resize) == null || s.call(l);
    },
    resetColumnState() {
      u.clear();
      for (const s of n.columnDefs())
        s.hide && u.add(_(s));
      r.value = ne();
      for (const s of Object.keys(f)) delete f[s];
      for (const s of Object.keys(c)) delete c[s];
      a.value = "", h.value = 0, F.value = null, S.value = null;
    }
  };
  function Xn() {
    var s, x;
    for (const b of n.columnDefs())
      b.hide && u.add(_(b));
    r.value.length || (r.value = ne()), o.value = ((s = n.rowData) == null ? void 0 : s.call(n)) ?? [], i.value = ((x = n.pinnedBottomRowData) == null ? void 0 : x.call(n)) ?? [];
  }
  function Nn() {
    J && (clearInterval(J), J = null), t.stop();
  }
  return {
    // reactive state / derived
    scrollX: g,
    scrollY: h,
    maxScrollX: V,
    maxScrollY: Z,
    filteredRows: ee,
    displayCols: H,
    resolvedCols: C,
    aggregateRow: Se,
    rowHeights: I,
    firstVisibleRow: me,
    lastVisibleRow: ye,
    visibleRowCount: ce,
    selectedCell: F,
    selectionAnchor: k,
    hoveredRow: R,
    activeFilter: S,
    filterPopupValue: p,
    caretOn: E,
    canvasW: v,
    canvasH: y,
    screenW: D,
    screenH: L,
    sortState: r,
    colFilters: c,
    // helpers
    formatCell: le,
    getCellValue: q,
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
    click: _n,
    docClick: Wn,
    keyDown: Yn,
    panStart: ht,
    panMove: it,
    panEnd: T,
    globalMove: j,
    globalUp: fe,
    // filter popup
    setFilterText: Hn,
    clearFilter: un,
    closeFilter: $n,
    // paint / api / lifecycle
    paint: On,
    api: Un,
    init: Xn,
    dispose: Nn
  };
}
const bl = ["value"], Ml = ["disabled"], Sl = ["disabled"], Tl = 28, Cl = /* @__PURE__ */ Qe({
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
    const e = n, l = t, o = X(null), i = En({
      columnDefs: () => e.columnDefs,
      defaultColDef: () => e.defaultColDef,
      rowData: () => e.rowData,
      pinnedBottomRowData: () => e.pinnedBottomRowData,
      rowHeight: () => e.rowHeight,
      theme: () => e.theme,
      emit: l,
      host: {
        redraw: () => q(),
        resize: () => V(),
        focusCanvas: () => {
          var A;
          return (A = k.value) == null ? void 0 : A.focus();
        },
        focusFilterInput: () => {
          var A;
          return (A = o.value) == null ? void 0 : A.focus();
        },
        blurFilterInput: () => {
          var A;
          return (A = o.value) == null ? void 0 : A.blur();
        }
      }
    }), {
      scrollY: a,
      maxScrollY: r,
      filteredRows: c,
      displayCols: f,
      selectedCell: u,
      firstVisibleRow: m,
      lastVisibleRow: v,
      activeFilter: y,
      filterPopupValue: D,
      formatCell: L,
      pageUp: h,
      pageDown: g,
      clearFilter: R
    } = i, F = X(null), k = X(null), S = St("cathodeResetTick", X(0));
    te(S, () => pe());
    let p = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), M = null, z = !1;
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
    let J, _;
    const C = new ln({
      paint: (A, { dpr: oe, glow: de }) => i.paint(A, { dpr: oe, glow: de })
    });
    function H() {
      if (!(!k.value || !F.value)) {
        try {
          M = new P.WebGLRenderer({ canvas: k.value, antialias: !1, alpha: !0 });
        } catch {
          z = !0;
        }
        if (!z && !M.getContext() && (M.dispose(), M = null, z = !0), z) {
          V();
          return;
        }
        M.setPixelRatio(1), M.setClearColor(0, 0), J = new P.Scene(), _ = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), J.add(new P.Mesh(new P.PlaneGeometry(2, 2), C.material)), V();
      }
    }
    function V() {
      if (!F.value || !M && !z) return;
      const A = F.value.clientWidth, oe = F.value.clientHeight - (e.pagination ? Tl : 0);
      if (!A || !oe) return;
      const de = e.bendField ? Math.round(A * In(e.curvature)) : A;
      C.resize(de, oe), C.setScreenSize(A, oe), p = C.dpr, i.setViewport(de, oe, A, oe), M ? (M.setPixelRatio(p), M.setSize(A, oe)) : k.value && (k.value.width = Math.round(A * p), k.value.height = Math.round(oe * p), k.value.style.width = A + "px", k.value.style.height = oe + "px"), q();
    }
    function q() {
      if (!C.canvas.width) return;
      if (z) {
        if (!k.value) return;
        C.paintOnly(!1);
        const oe = C.canvas, de = k.value.getContext("2d");
        de && de.drawImage(oe, 0, 0, oe.width, oe.height, 0, 0, k.value.width, k.value.height);
        return;
      }
      if (!M) return;
      const A = e.theme === "paper";
      C.setLook({
        curvature: e.curvature,
        scanlines: e.scanlines && !A,
        vignette: !A,
        magnify: e.magnify
      }), C.syncUniforms(), C.paint(e.glow), M.render(J, _);
    }
    function le(A, oe) {
      if (!k.value) return [-1, -1];
      const de = k.value.getBoundingClientRect(), Ge = A - de.left, Ie = oe - de.top, Ke = de.width, at = de.height, ht = Ze(e.curvature), [it, T] = Rn(Ge, Ie, Ke, at, ht, C.canvas.width / p || Ke, C.canvas.height / p || at);
      return it < 0 ? [-1, -1] : [it, T];
    }
    function ie(A) {
      return le(A.clientX, A.clientY);
    }
    function ne(A) {
      if (!k.value) return 1;
      const [oe] = le(A.clientX - 4, A.clientY), [de] = le(A.clientX + 4, A.clientY);
      return oe < 0 || de < 0 ? 1 : Math.max(1, Math.abs(de - oe) / 8);
    }
    function ee(A) {
      const [oe, de] = ie(A);
      return { cx: oe, cy: de, hitScale: ne(A) };
    }
    function d(A) {
      i.wheel(A.deltaX, A.deltaY, A.shiftKey);
    }
    function w(A) {
      if (i.resizing) return;
      e.magnify && k.value && C.setLens(Tt(A, k.value));
      const oe = i.hover(ee(A));
      oe && k.value && (k.value.style.cursor = oe);
    }
    function O() {
      C.setLens(null), i.leave();
    }
    function I(A) {
      i.pointerDown(ee(A), A.clientX, A.clientY);
    }
    function G(A) {
      i.click(ee(A), A).stopPropagation && A.stopPropagation();
    }
    function U(A) {
      y.value && i.docClick(A.target === k.value ? ee(A) : null);
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
    te(() => e.theme, () => q()), te(() => [e.curvature, e.bendField], () => Ae(V)), te(() => e.scanlines, () => q()), te(() => e.glow, () => q()), te(() => e.magnify, (A) => {
      A || C.setLens(null), q();
    });
    let N = null, se = null, ge = 0;
    function pe() {
      cancelAnimationFrame(ge), ge = requestAnimationFrame(V);
    }
    function Re(A) {
      A.preventDefault();
    }
    function ze() {
      M == null || M.dispose(), M = null, z = !1, H();
    }
    Xe(() => {
      i.init(), document.addEventListener("click", U), document.addEventListener("mousemove", $), document.addEventListener("mouseup", Z), Ae(() => {
        var A;
        H(), k.value && (k.value.addEventListener("webglcontextlost", Re), k.value.addEventListener("webglcontextrestored", ze)), F.value && (N = new ResizeObserver(() => V()), N.observe(F.value), se = new IntersectionObserver((oe) => {
          oe.some((de) => de.isIntersecting) && pe();
        }), se.observe(F.value)), window.addEventListener("resize", pe), (A = window.visualViewport) == null || A.addEventListener("resize", pe), l("grid-ready", { api: i.api });
      });
    }), et(() => {
      var A, oe, de;
      document.removeEventListener("click", U), document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", Z), (A = k.value) == null || A.removeEventListener("webglcontextlost", Re), (oe = k.value) == null || oe.removeEventListener("webglcontextrestored", ze), N == null || N.disconnect(), se == null || se.disconnect(), window.removeEventListener("resize", pe), (de = window.visualViewport) == null || de.removeEventListener("resize", pe), cancelAnimationFrame(ge), E(), C.dispose(), i.dispose();
    });
    const Pe = ue(() => pt[e.theme] ?? pt.none), Ne = ue(() => ({
      background: Pe.value.headerBg,
      borderTop: `1px solid ${Pe.value.border}`,
      color: Pe.value.text
    })), He = ue(() => ({
      background: Pe.value.bg
    })), Be = ue(() => Pe.value.accent);
    return (A, oe) => {
      var de, Ge;
      return be(), Me("div", {
        ref_key: "wrapEl",
        ref: F,
        class: "cathode-wrap",
        style: je(He.value)
      }, [
        he("canvas", {
          ref_key: "canvasEl",
          ref: k,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ut(d, ["prevent"]),
          onMousemove: w,
          onMouseleave: O,
          onMousedown: I,
          onClick: G,
          onKeydown: Se,
          onTouchstartPassive: ce,
          onTouchmove: me,
          onTouchend: ye,
          onTouchcancel: ye
        }, null, 544),
        ve(y) ? (be(), Me("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: o,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: ve(D),
          autofocus: "",
          onInput: W,
          onKeydown: [
            oe[0] || (oe[0] = vn(
              //@ts-ignore
              (...Ie) => ve(R) && ve(R)(...Ie),
              ["escape"]
            )),
            oe[1] || (oe[1] = vn((Ie) => ve(i).closeFilter(), ["enter"]))
          ]
        }, null, 40, bl)) : qe("", !0),
        n.pagination ? (be(), Me("div", {
          key: 1,
          class: "cathode-pagination",
          style: je(Ne.value)
        }, [
          he("button", {
            disabled: ve(a) <= 0,
            onClick: oe[2] || (oe[2] = (Ie) => ve(h)())
          }, "◀", 8, Ml),
          he("span", null, Ue((ve(m) + 1).toLocaleString()) + "–" + Ue(Math.min(ve(c).length, ve(v) + 1).toLocaleString()) + " / " + Ue(ve(c).length.toLocaleString()), 1),
          he("button", {
            disabled: ve(a) >= ve(r),
            onClick: oe[3] || (oe[3] = (Ie) => ve(g)())
          }, "▶", 8, Sl),
          he("span", {
            class: "cathode-page-info",
            style: je({ color: Be.value })
          }, Ue(ve(c).length.toLocaleString()) + " rows ", 5),
          ve(u) ? (be(), Me("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: je({ color: Be.value })
          }, Ue(((de = ve(f)[ve(u).col]) == null ? void 0 : de.colDef.headerName) ?? ((Ge = ve(f)[ve(u).col]) == null ? void 0 : Ge.colId)) + " : " + Ue(ve(L)(ve(f)[ve(u).col], ve(c)[ve(u).row])), 5)) : qe("", !0)
        ], 4)) : qe("", !0)
      ], 4);
    };
  }
}), tt = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [l, o] of t)
    e[l] = o;
  return e;
}, Ho = /* @__PURE__ */ tt(Cl, [["__scopeId", "data-v-3f5baab2"]]), Et = {
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
function kl(n, t) {
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
const Ll = 12, ke = 18, Mt = 10, ft = 6, on = `${Ll}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Rl(n, t, e) {
  if (e <= 0 || !t) return [t];
  const l = [];
  for (const o of t.split(`
`)) {
    if (!o) {
      l.push("");
      continue;
    }
    if (n.measureText(o).width <= e) {
      l.push(o);
      continue;
    }
    const i = o.split(/(\s+)/);
    let a = "";
    for (const r of i) {
      const c = a + r;
      if (n.measureText(c).width <= e)
        a = c;
      else if (a && (l.push(a.replace(/\s+$/, "")), a = ""), n.measureText(r).width > e) {
        let f = "";
        for (const u of r)
          n.measureText(f + u).width > e ? (f && l.push(f), f = u) : f += u;
        a = f;
      } else
        a = r.replace(/^\s+/, "");
    }
    a && l.push(a.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function Fn(n) {
  if (typeof n == "number") {
    const t = new Date(n), e = String(t.getHours()).padStart(2, "0"), l = String(t.getMinutes()).padStart(2, "0"), o = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${o}`;
  }
  return n;
}
function Il(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function Dl(n) {
  const { entries: t, ctx: e, textMaxWidth: l, showTimestamps: o, wordWrap: i } = n, a = n.formatTs ?? Fn;
  e.font = on;
  const r = [];
  for (let c = 0; c < t.length; c++) {
    const f = t[c], u = f.level ?? "info", m = o && f.ts != null ? a(f.ts) : "", v = i ? Rl(e, f.text, l) : f.text.split(`
`);
    for (let y = 0; y < v.length; y++)
      r.push({
        entryIdx: c,
        text: v[y],
        level: u,
        timestamp: y === 0 ? m : "",
        isFirstFrag: y === 0,
        widthPx: e.measureText(v[y]).width
      });
  }
  return r;
}
function pn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const l = n.width, o = n.height, i = Et[t.theme] ?? Et.none;
  e.clearRect(0, 0, l, o), e.fillStyle = i.bg, e.fillRect(0, 0, l, o), e.save(), e.beginPath(), e.rect(0, 0, l, o), e.clip(), e.font = on, e.textBaseline = "middle";
  const a = t.visualLines, r = Mt - t.scrollX, c = (t.showTimestamps ? Mt + t.timestampWidth : Mt) - t.scrollX, f = Math.max(0, Math.floor((t.scrollY - ft) / ke)), u = Math.min(a.length, Math.ceil((t.scrollY + o - ft) / ke) + 1);
  for (let m = f; m < u; m++) {
    const v = a[m], y = ft + m * ke - t.scrollY + ke / 2;
    if (v.entryIdx % 2 === 1 && v.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let L = 1;
      for (; m + L < u && a[m + L].entryIdx === v.entryIdx; ) L++;
      e.fillRect(0, y - ke / 2, l, ke * L);
    }
    t.selectionStart >= 0 && m >= t.selectionStart && m <= t.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, y - ke / 2, l, ke)), m === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, y - ke / 2, l, ke)), t.showTimestamps && v.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(v.timestamp, r, y), e.shadowBlur = 0);
    const D = kl(i, v.level);
    e.fillStyle = D, e.textAlign = "left", t.glow ? (e.shadowColor = D, e.shadowBlur = 14, e.fillText(v.text, c, y), e.shadowBlur = 7, e.fillText(v.text, c, y), e.shadowBlur = 3, e.fillText(v.text, c, y), e.shadowBlur = 0) : e.fillText(v.text, c, y);
  }
  e.restore();
}
function wn(n, t, e) {
  if (n < 0) return -1;
  const l = Math.floor((n + t - ft) / ke);
  return l < 0 || l >= e ? -1 : l;
}
function El(n) {
  return ft * 2 + n * ke;
}
const Fl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Al = /* @__PURE__ */ Qe({
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
    const e = n, l = X(null), o = X(null), i = { ...Ce }, a = X(0), r = X(0), c = X(0), f = X(-1), u = X(!0), m = X(-1), v = X(-1), y = ue(() => {
      const T = e.entries ?? [];
      return e.maxLines > 0 && T.length > e.maxLines ? T.slice(T.length - e.maxLines) : T;
    }), D = ue(() => {
      if (!e.showTimestamps) return "";
      const T = e.formatTs ?? Fn;
      let j = "00:00:00";
      for (const fe of y.value) {
        if (fe.ts == null) continue;
        const Fe = T(fe.ts);
        Fe.length > j.length && (j = Fe);
      }
      return j;
    }), L = X(0), h = X([]);
    function g() {
      if (!V) return;
      const T = V.getContext("2d");
      if (!T) return;
      T.font = on;
      const j = e.showTimestamps ? Il(T, D.value) : 0;
      L.value = j;
      const fe = Math.max(
        1,
        a.value - Mt * 2 - j
      );
      h.value = Dl({
        entries: y.value,
        ctx: T,
        textMaxWidth: fe,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const R = ue(() => El(h.value.length)), F = ue(() => Math.max(0, R.value - r.value)), k = ue(() => {
      let T = 0;
      for (const j of h.value) j.widthPx > T && (T = j.widthPx);
      return Mt * 2 + L.value + T;
    }), S = ue(() => Math.max(0, k.value - a.value)), p = X(0);
    te(F, () => {
      u.value ? c.value = F.value : c.value = Math.min(c.value, F.value);
    }), te(S, () => {
      p.value = Math.min(p.value, S.value);
    }), te(
      [y, a, () => e.showTimestamps, () => e.wordWrap, D],
      () => {
        g(), Ae(ne);
      },
      { deep: !1 }
    );
    let M = null, z = !1;
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
    let J, _, C, H, V;
    const q = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Bt}

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

  ${_t}

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
      if (!(!o.value || !l.value)) {
        V = document.createElement("canvas");
        try {
          M = new P.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          z = !0;
        }
        if (!z && !M.getContext() && (M.dispose(), M = null, z = !0), z) {
          ie();
          return;
        }
        M.setPixelRatio(1), M.setClearColor(0, 0), J = new P.Scene(), _ = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), H = new P.CanvasTexture(V), H.minFilter = P.LinearFilter, H.magFilter = P.LinearFilter, C = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: H },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: Fl,
          fragmentShader: q,
          transparent: !0
        }), J.add(new P.Mesh(new P.PlaneGeometry(2, 2), C)), ie();
      }
    }
    function ie() {
      if (!l.value || !M && !z) return;
      const T = l.value.clientWidth, j = l.value.clientHeight;
      if (!T || !j) return;
      const fe = V.width !== T || V.height !== j;
      fe && (V.width = T, V.height = j, a.value = T, r.value = j, g(), M ? (fe && H && (H.dispose(), H = new P.CanvasTexture(V), H.minFilter = P.LinearFilter, H.magFilter = P.LinearFilter, C && (C.uniforms.uTex.value = H)), M.setPixelRatio(window.devicePixelRatio || 1), M.setSize(T, j)) : o.value && (o.value.width = T, o.value.height = j, o.value.style.width = T + "px", o.value.style.height = j + "px"), u.value && (c.value = Math.max(0, R.value - r.value)), ne());
    }
    function ne() {
      if (!(V != null && V.width)) return;
      if (z) {
        if (!o.value) return;
        pn(V, {
          visualLines: h.value,
          scrollY: c.value,
          scrollX: p.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: L.value,
          hoveredLine: f.value,
          selectionStart: Math.min(m.value, v.value),
          selectionEnd: Math.max(m.value, v.value)
        });
        const j = o.value.getContext("2d");
        j && j.drawImage(V, 0, 0);
        return;
      }
      if (!M || !C || !H) return;
      const T = e.theme === "paper";
      C.uniforms.uStrength.value = Ze(e.curvature), C.uniforms.uScanlines.value = e.scanlines && !T ? 1 : 0, C.uniforms.uVignette.value = T ? 0 : 1, zt(C, e.magnify, i, V.width, V.height), pn(V, {
        visualLines: h.value,
        scrollY: c.value,
        scrollX: p.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: L.value,
        hoveredLine: f.value,
        selectionStart: Math.min(m.value, v.value),
        selectionEnd: Math.max(m.value, v.value)
      }), H.needsUpdate = !0, M.render(J, _);
    }
    te(() => e.theme, () => ne()), te(() => e.curvature, () => ne()), te(() => e.scanlines, () => ne()), te(() => e.glow, () => ne()), te(() => e.magnify, (T) => {
      T || (i.x = Ce.x, i.y = Ce.y), ne();
    }), te(c, () => ne()), te(p, () => ne()), te(f, () => ne()), te([m, v], () => ne());
    function ee(T) {
      if (!o.value) return [-1, -1];
      const j = o.value.getBoundingClientRect();
      return [T.clientX - j.left, T.clientY - j.top];
    }
    function d(T) {
      c.value = Math.max(0, Math.min(F.value, T)), u.value = c.value >= F.value - 4;
    }
    function w(T) {
      p.value = Math.max(0, Math.min(S.value, T));
    }
    function O(T) {
      T.shiftKey ? w(p.value + T.deltaY) : Math.abs(T.deltaX) > Math.abs(T.deltaY) ? w(p.value + T.deltaX) : d(c.value + T.deltaY);
    }
    let I = !1, G = 0, U = 0, $ = 0, Z = 0, ce = !1;
    function me(T) {
      I = !0, ce = !1, G = T.clientX, U = T.clientY, $ = p.value, Z = c.value, l.value && l.value.focus();
    }
    function ye(T) {
      if (I) {
        const j = G - T.clientX, fe = U - T.clientY;
        (Math.abs(j) > 4 || Math.abs(fe) > 4) && (ce = !0), w($ + j), d(Z + fe);
      }
    }
    function Se() {
      I && (I = !1, ce && (ce = !1));
    }
    function W(T) {
      if (T.touches.length !== 1) return;
      const j = T.touches[0];
      I = !0, ce = !1, G = j.clientX, U = j.clientY, $ = p.value, Z = c.value, l.value && l.value.focus();
    }
    function N(T) {
      if (!I || T.touches.length !== 1) return;
      T.preventDefault();
      const j = T.touches[0], fe = G - j.clientX, Fe = U - j.clientY;
      (Math.abs(fe) > 4 || Math.abs(Fe) > 4) && (ce = !0), w($ + fe), d(Z + Fe);
    }
    function se() {
      I && (I = !1, ce && (ce = !1));
    }
    function ge(T) {
      const [, j] = ee(T);
      return j < 0 ? -1 : wn(j, c.value, h.value.length);
    }
    function pe(T) {
      if (ce) {
        ce = !1;
        return;
      }
      const j = ge(T);
      if (j < 0) {
        m.value = -1, v.value = -1;
        return;
      }
      T.shiftKey && m.value >= 0 || (m.value = j), v.value = j;
    }
    function Re(T, j) {
      const fe = h.value.length;
      if (fe === 0) return;
      const Fe = v.value < 0 ? 0 : v.value;
      let _e = Math.max(0, Math.min(fe - 1, Fe + T));
      v.value = _e, (!j || m.value < 0) && (m.value = _e), f.value = _e;
      const $e = ft + _e * ke, Ve = $e + ke;
      $e < c.value ? d($e) : Ve > c.value + r.value && d(Ve - r.value);
    }
    function ze() {
      const T = Math.min(m.value, v.value), j = Math.max(m.value, v.value);
      if (T < 0) return "";
      const fe = h.value, Fe = /* @__PURE__ */ new Set(), _e = [];
      for (let $e = T; $e <= j && $e < fe.length; $e++) {
        const Ve = fe[$e];
        if (Fe.has(Ve.entryIdx)) continue;
        Fe.add(Ve.entryIdx);
        let vt = "";
        for (let rt = 0; rt < fe.length; rt++)
          fe[rt].entryIdx === Ve.entryIdx && (vt += (vt && !fe[rt].isFirstFrag ? " " : "") + fe[rt].text);
        _e.push(Ve.timestamp ? `${Ve.timestamp}  ${vt}` : vt);
      }
      return _e.join(`
`);
    }
    async function Pe() {
      const T = ze();
      if (T)
        try {
          await navigator.clipboard.writeText(T);
        } catch {
          const j = document.createElement("textarea");
          j.value = T, j.style.position = "fixed", j.style.opacity = "0", document.body.appendChild(j), j.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(j);
        }
    }
    function Ne(T) {
      if ((T.metaKey || T.ctrlKey) && (T.key === "c" || T.key === "C")) {
        m.value >= 0 && (T.preventDefault(), Pe());
        return;
      }
      if ((T.metaKey || T.ctrlKey) && (T.key === "a" || T.key === "A")) {
        T.preventDefault(), m.value = 0, v.value = h.value.length - 1;
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
          T.preventDefault(), w(p.value + ke * 2);
          break;
        case "ArrowLeft":
          T.preventDefault(), w(p.value - ke * 2);
          break;
        case "PageDown":
          T.preventDefault(), d(c.value + r.value);
          break;
        case "PageUp":
          T.preventDefault(), d(c.value - r.value);
          break;
        case "Home":
          T.preventDefault(), d(0), w(0);
          break;
        case "End":
          T.preventDefault(), d(F.value);
          break;
        case "Escape":
          m.value = -1, v.value = -1;
          break;
      }
    }
    function He(T) {
      if (e.magnify && o.value) {
        const fe = Tt(T, o.value);
        i.x = fe.x, i.y = fe.y, ne();
      }
      const [, j] = ee(T);
      if (j < 0) {
        f.value = -1;
        return;
      }
      f.value = wn(j, c.value, h.value.length);
    }
    function Be() {
      f.value = -1, i.x = Ce.x, i.y = Ce.y, ne();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = F.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(T) {
        d(ft + T * ke);
      }
    });
    let A = null, oe = null, de = 0;
    const Ge = St("cathodeResetTick", X(0));
    te(Ge, () => Ie());
    function Ie() {
      cancelAnimationFrame(de), de = requestAnimationFrame(ie);
    }
    function Ke(T) {
      T.preventDefault();
    }
    function at() {
      M == null || M.dispose(), M = null, z = !1, le();
    }
    Xe(() => {
      document.addEventListener("mousemove", ye), document.addEventListener("mouseup", Se), Ae(() => {
        var T;
        le(), o.value && (o.value.addEventListener("webglcontextlost", Ke), o.value.addEventListener("webglcontextrestored", at)), l.value && (A = new ResizeObserver(() => ie()), A.observe(l.value), oe = new IntersectionObserver((j) => {
          j.some((fe) => fe.isIntersecting) && Ie();
        }), oe.observe(l.value)), window.addEventListener("resize", Ie), (T = window.visualViewport) == null || T.addEventListener("resize", Ie), c.value = F.value;
      });
    }), et(() => {
      var T, j, fe;
      document.removeEventListener("mousemove", ye), document.removeEventListener("mouseup", Se), (T = o.value) == null || T.removeEventListener("webglcontextlost", Ke), (j = o.value) == null || j.removeEventListener("webglcontextrestored", at), A == null || A.disconnect(), oe == null || oe.disconnect(), window.removeEventListener("resize", Ie), (fe = window.visualViewport) == null || fe.removeEventListener("resize", Ie), cancelAnimationFrame(de), E();
    });
    const ht = ue(() => Et[e.theme] ?? Et.none), it = ue(() => ({
      background: ht.value.bg
    }));
    return (T, j) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: je(it.value),
      tabindex: "0",
      onKeydown: Ne
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-log-canvas",
        onWheel: ut(O, ["prevent"]),
        onMousemove: He,
        onMouseleave: Be,
        onMousedown: me,
        onClick: pe,
        onTouchstartPassive: W,
        onTouchmove: N,
        onTouchend: se,
        onTouchcancel: se
      }, null, 544)
    ], 36));
  }
}), Pl = /* @__PURE__ */ tt(Al, [["__scopeId", "data-v-d6dc9e79"]]), Bl = ["disabled"], _l = /* @__PURE__ */ Qe({
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
    const l = n, o = e, i = X(null), a = X(null), r = X(""), c = X([]), f = X(-1);
    let u = "";
    function m(S) {
      S.trim() && (c.value.length && c.value[c.value.length - 1] === S || (c.value.push(S), c.value.length > l.historyLimit && c.value.splice(0, c.value.length - l.historyLimit)));
    }
    function v(S) {
      if (!l.disabled) {
        if (S.key === "Enter") {
          S.preventDefault();
          const p = r.value;
          p.trim() && m(p), f.value = -1, r.value = "", o("submit", p);
          return;
        }
        if (S.key === "ArrowUp") {
          if (!c.value.length) return;
          S.preventDefault(), f.value === -1 ? (u = r.value, f.value = c.value.length - 1) : f.value > 0 && f.value--, r.value = c.value[f.value];
          return;
        }
        if (S.key === "ArrowDown") {
          if (f.value === -1) return;
          S.preventDefault(), f.value < c.value.length - 1 ? (f.value++, r.value = c.value[f.value]) : (f.value = -1, r.value = u, u = "");
          return;
        }
      }
    }
    const y = X(!0);
    let D = null;
    function L() {
      D || (D = setInterval(() => {
        y.value = !y.value;
      }, 530));
    }
    function h() {
      D && (clearInterval(D), D = null), y.value = !0;
    }
    const g = ue(() => {
      let S;
      return l.disabled ? S = " " : l.busy ? S = "█" : S = y.value ? "█" : " ", { level: "info", text: `${l.prompt}${r.value}${S}` };
    }), R = ue(
      () => [...l.entries, g.value]
    );
    function F() {
      var S;
      l.disabled || (S = a.value) == null || S.focus();
    }
    te(() => l.busy, (S, p) => {
      p && !S && !l.disabled && Ae(() => {
        var M;
        return (M = a.value) == null ? void 0 : M.focus();
      });
    });
    function k() {
      var S;
      (S = a.value) == null || S.focus();
    }
    return t({ focus: k }), Xe(() => {
      L(), l.disabled || requestAnimationFrame(() => {
        var S;
        return (S = a.value) == null ? void 0 : S.focus();
      });
    }), et(() => {
      h();
    }), (S, p) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: F
    }, [
      Sn(Pl, {
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
        ref: a,
        "onUpdate:modelValue": p[0] || (p[0] = (M) => r.value = M),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: v
      }, null, 40, Bl), [
        [qn, r.value]
      ])
    ], 512));
  }
}), $o = /* @__PURE__ */ tt(_l, [["__scopeId", "data-v-a2b39934"]]), wt = {
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
}, Wl = 0.18, yt = 8, an = 22, Yl = 4, Ye = 8, lt = 56, rn = 42, Je = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", zl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Nt = 4, Hl = 1, $l = 1;
function Vl(n, t, e, l = 0, o = !1) {
  const i = o ? rn : lt, a = Math.max(0, t - Ye - i), r = Math.max(1, Math.floor(a / e)), c = Math.min(r, n);
  return { firstIdx: Math.max(0, n - c - Math.floor(l / e)), count: c, slotW: e };
}
function Ol(n, t, e) {
  if (!n.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, o = -1 / 0, i = 0;
  const a = Math.min(n.length, t + e);
  for (let c = t; c < a; c++) {
    const f = n[c];
    f && (f.low < l && (l = f.low), f.high > o && (o = f.high), f.volume > i && (i = f.volume));
  }
  if (!isFinite(l) || !isFinite(o) || l === o) {
    const c = isFinite(l) ? l : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, i) };
  }
  const r = (o - l) * 0.04;
  return { min: l - r, max: o + r, maxVol: Math.max(1, i) };
}
function Ul(n, t, e = !1) {
  const l = e ? Yl : an, o = Math.max(1, n - yt - l - Nt), i = Math.max(0, Math.round(o * t)), a = o - i;
  return {
    priceY0: yt,
    priceY1: yt + a,
    volumeY0: yt + a + Nt,
    volumeY1: yt + a + Nt + i
  };
}
function We(n, t, e, l) {
  const o = t.max - t.min;
  return o <= 0 ? (e + l) / 2 : e + (1 - (n - t.min) / o) * (l - e);
}
function ot(n, t, e) {
  return Ye + (n - t + 0.5) * e;
}
function nt(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function sn(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0"), o = String(t.getHours()).padStart(2, "0"), i = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${o}:${i}`;
}
function Xl(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), l = Math.pow(10, Math.floor(Math.log10(e))), o = e / l;
  let i;
  return o < 1.5 ? i = 1 : o < 3 ? i = 2 : o < 7 ? i = 5 : i = 10, i * l;
}
function Qt(n, t) {
  var D, L, h, g, R;
  const e = n.getContext("2d");
  if (!e) return;
  const l = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(l, 0, 0, l, 0, 0);
  const o = n.width / l, i = n.height / l, a = wt[t.theme] ?? wt.none, r = t.colors ? { ...a, ...t.colors } : a, c = !!t.compact;
  if (e.clearRect(0, 0, o, i), e.fillStyle = r.bg, e.fillRect(0, 0, o, i), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, o, i), e.clip();
  const f = Vl(t.candles.length, o, t.slotW, t.scrollX, c), u = Ol(t.candles, f.firstIdx, f.count), m = Ul(i, t.showVolume ? t.volumeFraction : 0, c), v = Math.max(Hl, Math.floor(t.slotW * 0.7)), y = Math.min(t.candles.length, f.firstIdx + f.count);
  for (let F = f.firstIdx; F < y; F++) {
    const k = t.candles[F];
    if (!k) continue;
    const S = ot(F, f.firstIdx, t.slotW), p = We(k.open, u, m.priceY0, m.priceY1), M = We(k.close, u, m.priceY0, m.priceY1), z = We(k.high, u, m.priceY0, m.priceY1), E = We(k.low, u, m.priceY0, m.priceY1), J = k.close >= k.open, _ = J ? r.wickBull : r.wickBear, C = J ? r.candleBull : r.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = C), e.strokeStyle = _, e.lineWidth = $l, e.beginPath(), e.moveTo(Math.round(S) + 0.5, z), e.lineTo(Math.round(S) + 0.5, E), e.stroke(), e.fillStyle = C;
    const H = Math.min(p, M), V = Math.max(1, Math.abs(M - p)), q = Math.round(S - v / 2), le = Math.round(H), ie = Math.round(V);
    if (e.fillRect(q, le, v, ie), t.glow && (e.shadowBlur = 4, e.fillRect(q, le, v, ie)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const ne = Math.round(k.volume / u.maxVol * (m.volumeY1 - m.volumeY0));
      ne > 0 && (e.fillStyle = J ? r.volumeBull : r.volumeBear, e.fillRect(
        Math.round(S - v / 2),
        m.volumeY1 - ne,
        v,
        ne
      ));
    }
  }
  if ((D = t.overlays) != null && D.length) {
    const F = { above: 0, below: 0 }, k = t.overlays.filter((p) => p.kind !== "hline" && !!p.label).length, S = k ? 14 + 14 * k + 12 : 8;
    for (const p of t.overlays)
      p.kind === "hline" ? Gl(e, p, o, u, m, r, c, F, S) : Nl(e, p, f, u, m, t.slotW);
  }
  (L = t.markers) != null && L.length && to(e, r, t.markers, t.candles, f, u, m, t.slotW), no(e, r, u, m, o, c), c || (lo(e, r, t.candles, f, t.slotW, i), Ql(e, r, t.candles, o, i)), (h = t.overlays) != null && h.length && jl(e, r, t.overlays, m), t.hover && (oo(e, r, t.candles, f, u, m, t.slotW, t.hover, o), ql(e, r, t.candles, f, t.slotW, t.hover, m, ((g = t.overlays) == null ? void 0 : g.length) ?? 0), (R = t.markers) != null && R.length && Jl(e, r, t.markers, t.candles, f, u, m, t.slotW, t.hover, o)), e.restore();
}
function Nl(n, t, e, l, o, i) {
  var r;
  const a = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    Ye,
    o.priceY0,
    /* width: */
    999999,
    o.priceY1 - o.priceY0
  ), n.clip(), t.kind === "line")
    Lt(n, t.data, e.firstIdx, a, i, l, o, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const c = An(t.color, t.fillAlpha ?? 0.08);
    Kl(n, t.upper, t.lower, e.firstIdx, a, i, l, o, c), Lt(n, t.upper, e.firstIdx, a, i, l, o, t.color, 1, !1), Lt(n, t.lower, e.firstIdx, a, i, l, o, t.color, 1, !1), (r = t.middle) != null && r.length && Lt(n, t.middle, e.firstIdx, a, i, l, o, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function Gl(n, t, e, l, o, i, a, r = { above: 0, below: 0 }, c = 8) {
  const f = We(t.price, l, o.priceY0, o.priceY1), u = f < o.priceY0 - 0.5, m = f > o.priceY1 + 0.5, v = u || m, y = v ? u ? r.above++ : r.below++ : 0, D = v ? u ? o.priceY0 + c + y * 20 : o.priceY1 - 8 - y * 20 : f, L = a ? rn : lt, h = Math.round(D) + 0.5;
  n.save(), v || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo(Ye, h), n.lineTo(e - L, h), n.stroke(), n.setLineDash([]));
  let g = t.label ?? nt(t.price);
  if (v && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    n.font = Je, n.textBaseline = "middle", n.textAlign = "left";
    const R = n.measureText(g).width, F = 4, k = 2, S = Ye + 2;
    n.fillStyle = t.color, v && (n.globalAlpha = 0.85), n.fillRect(S, D - 7 - k, R + F * 2, 14 + k * 2), n.globalAlpha = 1, n.fillStyle = i.bg && !i.bg.startsWith("rgba(0,0,0,0)") ? i.bg : "#0d1520", n.fillText(g, S + F, D);
  }
  n.restore();
}
function Lt(n, t, e, l, o, i, a, r, c, f) {
  if (!t || !t.length) return;
  n.strokeStyle = r, n.lineWidth = c, n.setLineDash(f ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let m = e; m < l; m++) {
    const v = t[m];
    if (typeof v != "number" || !isFinite(v)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const y = ot(m, e, o), D = We(v, i, a.priceY0, a.priceY1);
    u ? n.lineTo(y, D) : (n.moveTo(y, D), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function Kl(n, t, e, l, o, i, a, r, c) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = c;
  let f = !1, u = -1;
  for (let m = l; m <= o; m++) {
    const v = t[m], y = e[m], D = m < o && typeof v == "number" && typeof y == "number" && isFinite(v) && isFinite(y);
    if (D && !f && (u = m, f = !0), !D && f || m === o && f) {
      const L = D ? m + 1 : m;
      n.beginPath();
      for (let h = u; h < L; h++) {
        const g = ot(h, l, i), R = We(t[h], a, r.priceY0, r.priceY1);
        h === u ? n.moveTo(g, R) : n.lineTo(g, R);
      }
      for (let h = L - 1; h >= u; h--) {
        const g = ot(h, l, i), R = We(e[h], a, r.priceY0, r.priceY1);
        n.lineTo(g, R);
      }
      n.closePath(), n.fill(), f = !1;
    }
  }
}
function An(n, t) {
  const e = Math.max(0, Math.min(1, t));
  if (n.startsWith("#") && n.length === 7) {
    const l = parseInt(n.slice(1, 3), 16), o = parseInt(n.slice(3, 5), 16), i = parseInt(n.slice(5, 7), 16);
    return `rgba(${l},${o},${i},${e})`;
  }
  return n.startsWith("rgba") ? n.replace(/[\d.]+\)$/, `${e})`) : n.startsWith("rgb(") ? n.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : n;
}
function jl(n, t, e, l) {
  const o = e.filter((L) => L.kind !== "hline" && !!L.label);
  if (!o.length) return;
  n.save(), n.font = Je;
  const i = 8, a = 5, r = 12, c = 6, f = 14;
  let u = 0;
  for (const L of o) {
    const h = n.measureText(L.label).width;
    h > u && (u = h);
  }
  const m = i * 2 + r + c + u, v = a * 2 + f * o.length, y = Ye + 4, D = l.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(y, D, m, v), n.textBaseline = "middle", n.textAlign = "left";
  for (let L = 0; L < o.length; L++) {
    const h = o[L], g = D + a + f * (L + 0.5), R = y + i;
    h.kind === "line" ? (n.strokeStyle = h.color, n.lineWidth = h.lineWidth ?? 1, n.setLineDash(h.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(R, g), n.lineTo(R + r, g), n.stroke(), n.setLineDash([])) : h.kind === "band" && (n.fillStyle = An(h.color, h.fillAlpha ?? 0.2), n.fillRect(R, g - 4, r, 8), n.strokeStyle = h.color, n.lineWidth = 1, n.strokeRect(R + 0.5, g - 4 + 0.5, r - 1, 7)), n.fillStyle = t.text, n.fillText(h.label, R + r + c, g);
  }
  n.restore();
}
function ql(n, t, e, l, o, i, a, r) {
  const c = Math.floor((i.x - Ye) / o), f = l.firstIdx + c;
  if (f < 0 || f >= e.length) return;
  const u = e[f];
  if (!u) return;
  const m = u.close - u.open, v = u.open !== 0 ? m / u.open * 100 : 0, y = m >= 0 ? "+" : "", D = [
    ["O", nt(u.open), void 0],
    ["H", nt(u.high), void 0],
    ["L", nt(u.low), void 0],
    ["C", nt(u.close), void 0],
    ["V", Zl(u.volume), void 0],
    ["", `${y}${v.toFixed(2)}%`, m >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = Je, n.textBaseline = "middle", n.textAlign = "left";
  const L = 8, h = 4, g = 14;
  let R = L;
  for (const [p, M] of D) {
    const z = p ? `${p} ${M}` : M, E = n.measureText(z).width + 12;
    R += E;
  }
  R += L - 12;
  const F = a.priceY0 + 4 + (r > 0 ? h * 2 + 14 * r + 4 : 0), k = Ye + 4;
  n.fillStyle = t.panelBg, n.fillRect(k, F, R, g + h * 2);
  let S = k + L;
  for (let p = 0; p < D.length; p++) {
    const [M, z, E] = D[p];
    n.fillStyle = t.text, M && (n.globalAlpha = 0.6, n.fillText(M + " ", S, F + h + g / 2), n.globalAlpha = 1, S += n.measureText(M + " ").width), E && (n.fillStyle = E), n.fillText(z, S, F + h + g / 2), S += n.measureText(z).width + 12;
  }
  n.restore();
}
function Zl(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function Jl(n, t, e, l, o, i, a, r, c, f) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, m = Math.max(1, u * 0.5), v = Math.min(l.length, o.firstIdx + o.count), y = 9;
  let D = null;
  for (const z of e) {
    let E = 0, J = l.length - 1, _ = -1;
    for (; E <= J; ) {
      const V = E + J >> 1, q = l[V].start - z.timestamp;
      if (Math.abs(q) <= m) {
        _ = V;
        break;
      }
      q < 0 ? E = V + 1 : J = V - 1;
    }
    if (_ < 0 || _ < o.firstIdx || _ >= v) continue;
    const C = ot(_, o.firstIdx, r), H = We(z.price, i, a.priceY0, a.priceY1);
    if (Math.abs(c.x - C) <= y && Math.abs(c.y - H) <= y) {
      D = { m: z, x: C, y: H };
      break;
    }
  }
  if (!D) return;
  const L = sn(D.m.timestamp), h = [
    `${D.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${L}`,
    `@ ${nt(D.m.price)}`
  ];
  D.m.label && h.push(D.m.label), n.save(), n.font = Je, n.textBaseline = "top", n.textAlign = "left";
  const g = 6, R = 14;
  let F = 0;
  for (const z of h) {
    const E = n.measureText(z).width;
    E > F && (F = E);
  }
  const k = F + g * 2, S = h.length * R + g * 2;
  let p = D.x + 12;
  p + k > f - lt && (p = D.x - 12 - k);
  let M = D.y - S / 2;
  M < a.priceY0 && (M = a.priceY0), M + S > a.priceY1 && (M = a.priceY1 - S), n.fillStyle = t.panelBgSolid, n.strokeStyle = D.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(p, M, k, S), n.strokeRect(p + 0.5, M + 0.5, k - 1, S - 1);
  for (let z = 0; z < h.length; z++) {
    const E = h[z];
    n.fillStyle = z === 0 ? D.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(E, p + g, M + g + z * R);
  }
  n.restore();
}
function Ql(n, t, e, l, o) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, a = eo(i);
  if (!a) return;
  n.save(), n.font = Je, n.textBaseline = "top", n.textAlign = "right";
  const r = 6, c = 3, f = n.measureText(a).width, u = l - lt - r, m = o - an + 4;
  n.fillStyle = t.accent, n.fillRect(u - f - r, m - c, f + r * 2, 14 + c * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(a, u, m), n.restore();
}
function eo(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, l = 60 * e, o = 24 * l, i = 7 * o;
  return n >= i && n % i === 0 ? n / i + "W" : n >= o && n % o === 0 ? n / o + "D" : n >= l && n % l === 0 ? n / l + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function to(n, t, e, l, o, i, a, r) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, f = Math.max(1, c * 0.5), u = Math.min(l.length, o.firstIdx + o.count), m = (y) => {
    let D = 0, L = l.length - 1;
    for (; D <= L; ) {
      const h = D + L >> 1, g = l[h].start - y;
      if (Math.abs(g) <= f) return h;
      g < 0 ? D = h + 1 : L = h - 1;
    }
    return -1;
  }, v = 7;
  for (const y of e) {
    const D = m(y.timestamp);
    if (D < 0 || D < o.firstIdx || D >= u) continue;
    const L = ot(D, o.firstIdx, r), h = We(y.price, i, a.priceY0, a.priceY1);
    if (h < a.priceY0 || h > a.priceY1) continue;
    const g = y.color ?? (y.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = g, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), y.kind === "entry" ? (n.moveTo(L, h - v), n.lineTo(L - v, h + v - 1), n.lineTo(L + v, h + v - 1)) : (n.moveTo(L, h + v), n.lineTo(L - v, h - v + 1), n.lineTo(L + v, h - v + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function no(n, t, e, l, o, i = !1) {
  const a = e.max - e.min;
  if (a <= 0) return;
  const r = l.priceY1 - l.priceY0, c = i ? Math.max(2, Math.min(4, Math.round(r / 36))) : 6, f = Xl(a, c), u = Math.ceil(e.min / f) * f, m = i ? rn : lt;
  n.font = i ? zl : Je, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let v = u; v <= e.max; v += f) {
    const y = We(v, e, l.priceY0, l.priceY1);
    y < l.priceY0 || y > l.priceY1 || (n.beginPath(), n.moveTo(Ye, Math.round(y) + 0.5), n.lineTo(o - m, Math.round(y) + 0.5), n.stroke(), n.fillText(nt(v), o - m + 3, y));
  }
  n.globalAlpha = 1;
}
function lo(n, t, e, l, o, i) {
  if (l.count <= 0 || !e.length) return;
  const r = Math.max(1, Math.floor(l.count / 6));
  n.font = Je, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const c = Math.min(e.length, l.firstIdx + l.count);
  for (let f = l.firstIdx; f < c; f += r) {
    const u = e[f];
    if (!u) continue;
    const m = ot(f, l.firstIdx, o);
    n.fillText(sn(u.start), m, i - an + 4);
  }
  n.globalAlpha = 1;
}
function oo(n, t, e, l, o, i, a, r, c) {
  const f = Math.floor((r.x - Ye) / a), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + f)), m = e[u];
  if (!m) return;
  const v = ot(u, l.firstIdx, a);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(v) + 0.5, i.priceY0), n.lineTo(Math.round(v) + 0.5, i.volumeY1 || i.priceY1), n.stroke();
  const y = Math.max(i.priceY0, Math.min(i.priceY1, r.y));
  n.beginPath(), n.moveTo(Ye, Math.round(y) + 0.5), n.lineTo(c - lt, Math.round(y) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const D = o.max - o.min;
  if (D > 0) {
    const g = o.max - (y - i.priceY0) / (i.priceY1 - i.priceY0) * D, R = nt(g);
    n.font = Je, n.textBaseline = "middle", n.textAlign = "left";
    const F = n.measureText(R).width, k = 4, S = 2;
    n.fillStyle = t.accent, n.fillRect(c - lt + 2, y - 7 - S, F + k * 2, 14 + S * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(R, c - lt + 2 + k, y);
  }
  n.font = Je, n.textBaseline = "top", n.textAlign = "center";
  const L = sn(m.start), h = n.measureText(L).width;
  n.fillStyle = t.accent, n.fillRect(v - h / 2 - 4, i.volumeY1 + 2, h + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(L, v, i.volumeY1 + 4), n.restore();
}
const Gt = 0.25, Kt = 6, ao = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, io = /* @__PURE__ */ Qe({
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
  setup(n) {
    const t = n, e = X(null), l = X(null), o = { ...Ce }, i = X(0), a = X(0), r = X(0), c = X(1), f = X(null), u = ue(() => Math.max(1, t.slotW * c.value));
    let m = null, v = !1;
    function y() {
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
    let D, L, h, g, R;
    const F = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Bt}

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

  ${_t}

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
          v = !0, S();
          return;
        }
        try {
          m = new P.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          v = !0;
        }
        if (!v && !m.getContext() && (m.dispose(), m = null, v = !0), v) {
          S();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), D = new P.Scene(), L = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new P.CanvasTexture(R), g.minFilter = P.LinearFilter, g.magFilter = P.LinearFilter, h = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: ao,
          fragmentShader: F,
          transparent: !0
        }), D.add(new P.Mesh(new P.PlaneGeometry(2, 2), h)), S();
      }
    }
    function S() {
      if (!e.value || !m && !v) return;
      const W = e.value.clientWidth, N = e.value.clientHeight;
      !W || !N || !(R.width !== W || R.height !== N) || (R.width = W, R.height = N, i.value = W, a.value = N, m ? (g && (g.dispose(), g = new P.CanvasTexture(R), g.minFilter = P.LinearFilter, g.magFilter = P.LinearFilter, h && (h.uniforms.uTex.value = g)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(W, N)) : l.value && (l.value.width = W, l.value.height = N, l.value.style.width = W + "px", l.value.style.height = N + "px"), p());
    }
    function p() {
      if (!(R != null && R.width)) return;
      if (v) {
        if (!l.value) return;
        Qt(R, {
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
      if (!m || !h || !g) return;
      const W = t.theme === "paper";
      h.uniforms.uStrength.value = Ze(t.curvature), h.uniforms.uScanlines.value = t.scanlines && !W ? 1 : 0, h.uniforms.uVignette.value = W ? 0 : 1, zt(h, t.magnify, o, R.width, R.height), Qt(R, {
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
      }), g.needsUpdate = !0, m.render(D, L);
    }
    te(() => t.theme, () => p()), te(() => t.curvature, () => p()), te(() => t.scanlines, () => p()), te(() => t.glow, () => p()), te(() => t.showVolume, () => p()), te(() => t.volumeFraction, () => p()), te(() => t.slotW, () => p()), te(() => t.candles, () => p(), { deep: !1 }), te(() => t.overlays, () => p(), { deep: !1 }), te(() => t.markers, () => p(), { deep: !1 }), te(() => t.compact, () => p()), te(() => t.magnify, (W) => {
      W || (o.x = Ce.x, o.y = Ce.y), p();
    }), te(() => t.colors, () => p(), { deep: !0 }), te(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), te(r, () => p()), te(c, () => p()), te(f, () => p()), te(u, () => p());
    let M = null, z = null, E = 0;
    const J = St("cathodeResetTick", X(0));
    te(J, () => _());
    function _() {
      cancelAnimationFrame(E), E = requestAnimationFrame(S);
    }
    function C(W) {
      W.preventDefault();
    }
    function H() {
      m == null || m.dispose(), m = null, v = !1, k();
    }
    function V(W) {
      if (!l.value) return [-1, -1];
      const N = l.value.getBoundingClientRect();
      return [W.clientX - N.left, W.clientY - N.top];
    }
    function q(W) {
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
        r.value = q(r.value + pe);
        return;
      }
      if (W.deltaY === 0) return;
      const [N] = V(W), se = u.value;
      if (N >= 0 && se > 0 && ((ge = t.candles) != null && ge.length)) {
        const pe = Math.max(1, Math.floor((i.value || 1) / se)), ze = Math.max(0, t.candles.length - pe - Math.floor(r.value / se)) + (N - 8) / se, Pe = Math.exp(-W.deltaY * 15e-4), Ne = Math.max(Gt, Math.min(Kt, c.value * Pe));
        c.value = Ne;
        const He = t.slotW * Ne, Be = Math.max(1, Math.floor((i.value || 1) / He)), A = ze - (N - 8) / He, oe = Math.max(0, t.candles.length - Be - A);
        r.value = q(oe * He);
      } else {
        const pe = Math.exp(-W.deltaY * 15e-4);
        c.value = Math.max(Gt, Math.min(Kt, c.value * pe));
      }
    }
    let ie = !1, ne = 0, ee = 0;
    function d(W) {
      W.button === 0 && (ie = !0, ne = W.clientX, ee = r.value, f.value = null, e.value && e.value.focus());
    }
    function w(W) {
      const N = Math.exp(W * 0.18);
      c.value = Math.max(Gt, Math.min(Kt, c.value * N)), r.value = q(r.value);
    }
    function O(W) {
      const N = u.value, se = W.shiftKey ? 20 : 3;
      switch (W.key) {
        case "ArrowLeft":
          W.preventDefault(), r.value = q(r.value + N * se);
          break;
        case "ArrowRight":
          W.preventDefault(), r.value = q(r.value - N * se);
          break;
        case "ArrowUp":
          W.preventDefault(), w(1);
          break;
        case "ArrowDown":
          W.preventDefault(), w(-1);
          break;
        case "Home":
          W.preventDefault(), r.value = q(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          W.preventDefault(), r.value = 0;
          break;
      }
    }
    function I(W) {
      if (ie) {
        const N = W.clientX - ne;
        r.value = q(ee + N);
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
      r.value = q(ee + se);
    }
    function Z() {
      ie = !1;
    }
    function ce(W) {
      if (t.magnify && l.value) {
        const ge = Tt(W, l.value);
        o.x = ge.x, o.y = ge.y, p();
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
      f.value = null, o.x = Ce.x, o.y = Ce.y, p();
    }
    Xe(() => {
      document.addEventListener("mousemove", I), document.addEventListener("mouseup", G), Ae(() => {
        var W;
        k(), l.value && (l.value.addEventListener("webglcontextlost", C), l.value.addEventListener("webglcontextrestored", H)), e.value && (M = new ResizeObserver(() => S()), M.observe(e.value), z = new IntersectionObserver((N) => {
          N.some((se) => se.isIntersecting) && _();
        }), z.observe(e.value)), window.addEventListener("resize", _), (W = window.visualViewport) == null || W.addEventListener("resize", _);
      });
    }), et(() => {
      var W, N, se;
      document.removeEventListener("mousemove", I), document.removeEventListener("mouseup", G), (W = l.value) == null || W.removeEventListener("webglcontextlost", C), (N = l.value) == null || N.removeEventListener("webglcontextrestored", H), M == null || M.disconnect(), z == null || z.disconnect(), window.removeEventListener("resize", _), (se = window.visualViewport) == null || se.removeEventListener("resize", _), cancelAnimationFrame(E), y();
    });
    const ye = ue(() => wt[t.theme] ?? wt.none), Se = ue(() => ({
      background: ye.value.bg
    }));
    return (W, N) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: je(Se.value),
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
}), Vo = /* @__PURE__ */ tt(io, [["__scopeId", "data-v-7c334778"]]), mt = 22, xt = 6, ro = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, so = /* @__PURE__ */ Qe({
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
    const e = n, l = t, o = X(null), i = X(null), a = X(-1), r = X(0), c = { ...Ce };
    let f = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, m = !1;
    function v() {
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
    let y, D, L, h, g;
    const R = X(0), F = X(0), k = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Bt}

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

  ${_t}

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
      if (!(!i.value || !o.value)) {
        g = document.createElement("canvas");
        try {
          u = new P.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !u.getContext() && (u.dispose(), u = null, m = !0), m) {
          p();
          return;
        }
        u.setPixelRatio(f), u.setClearColor(0, 0), y = new P.Scene(), D = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new P.CanvasTexture(g), h.minFilter = P.LinearFilter, h.magFilter = P.LinearFilter, L = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: ro,
          fragmentShader: k,
          transparent: !0
        }), y.add(new P.Mesh(new P.PlaneGeometry(2, 2), L)), p();
      }
    }
    function p() {
      if (!o.value || !u && !m) return;
      const d = o.value.clientWidth, w = o.value.clientHeight;
      if (!d || !w) return;
      R.value = d, F.value = w, f = Math.min(window.devicePixelRatio || 1, 2);
      const O = e.bendField ? Math.round(d * In(e.curvature)) : d, I = Math.round(O * f), G = Math.round(w * f), U = g.width !== I || g.height !== G;
      g.width = I, g.height = G, u ? (U && h && (h.dispose(), h = new P.CanvasTexture(g), h.minFilter = P.LinearFilter, h.magFilter = P.LinearFilter, L.uniforms.uTex.value = h), u.setPixelRatio(f), u.setSize(d, w)) : i.value && (i.value.width = Math.round(d * f), i.value.height = Math.round(w * f), i.value.style.width = d + "px", i.value.style.height = w + "px"), C();
    }
    function M() {
      const d = (g == null ? void 0 : g.width) || 0, w = Math.max(1, Math.floor(d / e.minCellW)), O = Math.floor(d / w), I = Math.round(O * e.cellAspect), G = mt + I + xt;
      return { rects: e.cells.map(($, Z) => ({
        x: Z % w * O,
        y: Math.floor(Z / w) * G - r.value,
        w: O,
        h: G
      })), rowH: G, totalH: Math.ceil(e.cells.length / w) * G, cols: w };
    }
    const z = () => {
      const { totalH: d } = M();
      return Math.max(0, d - ((g == null ? void 0 : g.height) || 0));
    }, E = /* @__PURE__ */ new Map();
    function J(d, w, O) {
      const I = d.candles[d.candles.length - 1], G = `${w}x${O}@${f}|${d.candles.length}|${I ? I.start + ":" + I.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, U = E.get(d.id);
      if (U && U.key === G) return U.canvas;
      const $ = (U == null ? void 0 : U.canvas) ?? document.createElement("canvas");
      $.width = Math.round(w * f), $.height = Math.round(O * f);
      const Z = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, d.candles.length))), ce = w < 260 && d.overlays ? d.overlays.map((me) => ({ ...me, label: "" })) : d.overlays;
      return Qt($, {
        candles: d.candles,
        slotW: Z,
        scrollX: Math.max(0, d.candles.length * Z - w),
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
    const _ = ue(() => ({ ...wt[e.theme] ?? wt.none, ...e.colors ?? {} }));
    function C() {
      var I;
      if (!(g != null && g.width)) return;
      const d = g.getContext("2d");
      if (!d) return;
      const w = _.value;
      d.setTransform(1, 0, 0, 1, 0, 0), d.clearRect(0, 0, g.width, g.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (d.fillStyle = w.bg, d.fillRect(0, 0, g.width, g.height)), d.setTransform(f, 0, 0, f, 0, 0);
      const { rects: O } = M();
      d.font = "600 11px ui-monospace, SFMono-Regular, monospace", d.textBaseline = "middle";
      for (let G = 0; G < e.cells.length; G++) {
        const U = e.cells[G], $ = O[G];
        if ($.y + $.h < 0 || $.y > g.height / f) continue;
        const Z = $.x + xt / 2, ce = $.w - xt;
        d.strokeStyle = U.open ? w.candleBull : w.gridline, d.lineWidth = G === a.value ? 2 : 1, d.strokeRect(Z + 0.5, $.y + 0.5, ce - 1, $.h - xt - 1), d.save(), d.beginPath(), d.rect(Z, $.y, ce, mt), d.clip();
        const me = $.y + mt / 2 + 1, ye = U.note ? d.measureText(U.note).width + (U.open ? 22 : 12) : U.open ? 16 : 0, Se = U.badge ? d.measureText(U.badge).width + 6 : 0, W = ce - 14 - Se - ye;
        let N = U.title;
        if (d.measureText(N).width > W) {
          for (; N.length > 1 && d.measureText(N + "…").width > W; ) N = N.slice(0, -1);
          N += "…";
        }
        let se = Z + 7;
        d.fillStyle = w.text, d.textAlign = "left", d.fillText(N, se, me), se += d.measureText(N).width + 6, U.badge && (d.fillStyle = w.accent, d.fillText(U.badge, se, me)), U.note && (d.textAlign = "right", d.fillStyle = U.noteColor || w.accent, d.fillText(U.note, Z + ce - (U.open ? 16 : 7), me), d.textAlign = "left"), d.restore(), U.open && (d.fillStyle = w.candleBull, d.beginPath(), d.arc(Z + ce - 9, $.y + mt / 2 + 1, 3, 0, Math.PI * 2), d.fill());
        const ge = $.y + mt, pe = $.h - mt - xt;
        U.candles.length ? d.drawImage(J(U, ce - 2, pe - 1), Z + 1, ge, ce - 2, pe - 1) : (d.fillStyle = w.accent, d.textAlign = "center", d.fillText("· · ·", Z + ce / 2, ge + pe / 2), d.textAlign = "left");
      }
      if (m) {
        const G = (I = i.value) == null ? void 0 : I.getContext("2d");
        G && i.value && G.drawImage(g, 0, 0, g.width, g.height, 0, 0, i.value.width, i.value.height);
        return;
      }
      !u || !L || !h || (L.uniforms.uStrength.value = Ze(e.curvature), L.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, L.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, zt(L, e.magnify, c, R.value || g.width, F.value || g.height), h.needsUpdate = !0, u.render(y, D));
    }
    function H(d) {
      if (!i.value) return [-1, -1];
      const w = i.value.getBoundingClientRect();
      return Rn(
        d.clientX - w.left,
        d.clientY - w.top,
        w.width,
        w.height,
        Ze(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((g == null ? void 0 : g.width) || w.width) / f,
        ((g == null ? void 0 : g.height) || w.height) / f
      );
    }
    function V(d, w) {
      if (d < 0) return -1;
      const { rects: O } = M();
      return O.findIndex((I) => d >= I.x && d < I.x + I.w && w >= I.y && w < I.y + I.h);
    }
    function q(d) {
      const [w, O] = H(d), I = V(w, O);
      I >= 0 && l("cell-click", e.cells[I].id);
    }
    function le(d) {
      if (e.magnify && i.value) {
        const G = Tt(d, i.value);
        c.x = G.x, c.y = G.y;
      }
      const [w, O] = H(d), I = V(w, O);
      I !== a.value ? (a.value = I, C()) : e.magnify && C(), i.value && (i.value.style.cursor = I >= 0 ? "pointer" : "default");
    }
    function ie() {
      a.value = -1, c.x = Ce.x, c.y = Ce.y, C();
    }
    function ne(d) {
      const w = z();
      w <= 0 || (d.preventDefault(), r.value = Math.max(0, Math.min(w, r.value + d.deltaY)), C());
    }
    let ee = null;
    return Xe(() => {
      S(), ee = new ResizeObserver(() => p()), o.value && ee.observe(o.value);
    }), et(() => {
      ee == null || ee.disconnect(), v(), E.clear();
    }), te(() => [e.curvature, e.bendField], () => Ae(p)), te(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      r.value = Math.min(r.value, z()), C();
    }, { deep: !1 }), (d, w) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: o,
      class: "cathode-candle-grid-wrap"
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: i,
        onClick: q,
        onMousemove: le,
        onMouseleave: ie,
        onWheel: ne
      }, null, 544)
    ], 512));
  }
}), Oo = /* @__PURE__ */ tt(so, [["__scopeId", "data-v-9f2b24f8"]]), cn = X(0), en = 28, gt = 12;
let tn = 10, Ft = "cathode.layout", At = !1;
const Le = X({});
function co(n, t = "cathode.layout") {
  if (!At) {
    At = !0, Ft = t;
    try {
      const e = localStorage.getItem(Ft);
      if (e) {
        Le.value = JSON.parse(e), yn();
        return;
      }
    } catch {
    }
    Le.value = { ...n }, yn();
  }
}
function yn() {
  let n = 10;
  for (const t of Object.values(Le.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  tn = n;
}
function dt() {
  localStorage.setItem(Ft, JSON.stringify(Le.value));
}
function uo(n) {
  At = !1, localStorage.removeItem(Ft), Le.value = { ...n }, dt(), At = !0, cn.value++;
}
function Pn(n) {
  tn++, Le.value[n] && (Le.value[n].zIndex = tn);
}
function fo(n, t) {
  Le.value[n].visible = t, dt();
}
function ho(n, t) {
  Le.value[n].minimized = t, t && (Le.value[n].maximized = !1), dt();
}
function vo(n, t) {
  Le.value[n].maximized = t, t && (Le.value[n].minimized = !1, Pn(n)), dt();
}
function mo(n, t, e) {
  Le.value[n].x = Math.round(t), Le.value[n].y = Math.round(e), dt();
}
function go(n, t, e) {
  Le.value[n].w = Math.round(t), Le.value[n].h = Math.round(e), dt();
}
function Uo(n, t, e) {
  const l = Math.ceil(Math.sqrt(e.length)), o = Math.ceil(e.length / l), i = Math.floor((n - gt * (l + 1)) / l), a = Math.floor((t - gt * (o + 1)) / o), r = {};
  return e.forEach((c, f) => {
    const u = f % l, m = Math.floor(f / l);
    r[c] = {
      x: gt + u * (i + gt),
      y: gt + m * (a + gt),
      w: i,
      h: a,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: f + 1
    };
  }), r;
}
function Bn() {
  return {
    containers: Le,
    TITLEBAR_H: en,
    load: co,
    save: dt,
    reset: uo,
    bringToFront: Pn,
    setVisible: fo,
    setMinimized: ho,
    setMaximized: vo,
    updatePos: mo,
    updateSize: go
  };
}
const po = { class: "ws-toolbar" }, wo = {
  key: 0,
  class: "ws-restore-menu"
}, yo = {
  key: 0,
  class: "ws-restore-empty"
}, xo = ["onClick"], bo = /* @__PURE__ */ Qe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: l, reset: o, setVisible: i } = Bn(), a = X(null);
    mn("cathodeWorkspace", a), mn("cathodeResetTick", cn), Xe(() => {
      if (!a.value) return;
      const { clientWidth: h, clientHeight: g } = a.value, R = t.initialLayout ?? {};
      l(R, t.storageKey ?? "cathode.layout");
      const F = Object.keys(e.value)[0];
      F && r(F);
    });
    function r(h) {
      var R;
      document.querySelectorAll(".cc").forEach((F) => F.classList.remove("cc-focused"));
      const g = (R = a.value) == null ? void 0 : R.querySelector(`#cc-${h}`);
      g && g.classList.add("cc-focused");
    }
    function c() {
      !a.value || !t.initialLayout || o(t.initialLayout);
    }
    function f(h) {
      const g = h.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((R) => R.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = X(!1), m = () => Object.entries(e.value).filter(([, h]) => !h.visible).map(([h]) => h);
    function v(h) {
      i(h, !0), u.value = !1;
    }
    function y(h) {
      if (!u.value) return;
      const g = h.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function D(h) {
      h.key === "Escape" && (u.value = !1);
    }
    Xe(() => {
      document.addEventListener("click", y), document.addEventListener("keydown", D);
    }), et(() => {
      document.removeEventListener("click", y), document.removeEventListener("keydown", D);
    });
    function L(h) {
      var g;
      return ((g = t.containerTitles) == null ? void 0 : g[h]) ?? h;
    }
    return (h, g) => (be(), Me("div", {
      ref_key: "workspaceEl",
      ref: a,
      class: "cathode-workspace",
      onMousedown: f
    }, [
      qt(h.$slots, "default", {}, void 0, !0),
      qt(h.$slots, "overlay", {}, void 0, !0),
      he("div", po, [
        n.initialLayout ? (be(), Me("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : qe("", !0),
        g[1] || (g[1] = he("div", { class: "ws-sep" }, null, -1)),
        he("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (R) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Sn(Zn, { name: "menu" }, {
        default: Jn(() => [
          u.value ? (be(), Me("div", wo, [
            g[3] || (g[3] = he("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? qe("", !0) : (be(), Me("div", yo, " No closed panels ")),
            (be(!0), Me(Qn, null, el(m(), (R) => (be(), Me("div", {
              key: R,
              class: "ws-restore-item",
              onClick: (F) => v(R)
            }, [
              g[2] || (g[2] = he("span", { class: "ws-restore-icon" }, "⊞", -1)),
              tl(" " + Ue(L(R)), 1)
            ], 8, xo))), 128))
          ])) : qe("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Xo = /* @__PURE__ */ tt(bo, [["__scopeId", "data-v-5838d04b"]]), Mo = ["id"], So = { class: "cc-title" }, To = {
  key: 0,
  class: "cc-size-badge"
}, Co = { class: "cc-controls" }, ko = ["title"], Lo = { class: "cc-body" }, Ro = 200, Io = 80, xn = 60, Do = /* @__PURE__ */ Qe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: l, setVisible: o, setMinimized: i, setMaximized: a, updatePos: r, updateSize: c } = Bn(), f = St("cathodeWorkspace", X(null)), u = ue(() => e.value[t.id]), m = ue(() => {
      const d = u.value, w = t.curvature ?? 0;
      if (!d) return {};
      const O = { "--curvature": Math.abs(w) };
      return d.maximized ? { ...O, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: d.zIndex } : {
        ...O,
        left: d.x + "px",
        top: d.y + "px",
        width: d.w + "px",
        height: d.minimized ? en + "px" : d.h + "px",
        zIndex: d.zIndex,
        display: d.visible ? "flex" : "none"
      };
    });
    let v = !1, y = 0, D = 0;
    function L(d) {
      var I;
      if (d.target.closest(".cc-btn") || u.value.maximized) return;
      l(t.id), v = !0;
      const w = (I = f.value) == null ? void 0 : I.querySelector(`#cc-${t.id}`);
      if (!w) return;
      const O = w.getBoundingClientRect();
      y = d.clientX - O.left, D = d.clientY - O.top, document.addEventListener("mousemove", h), document.addEventListener("mouseup", g), d.preventDefault();
    }
    function h(d) {
      var U;
      if (!v || !f.value) return;
      const w = f.value.getBoundingClientRect(), O = ((U = u.value) == null ? void 0 : U.w) ?? 300;
      let I = d.clientX - w.left - y, G = d.clientY - w.top - D;
      I = Math.max(xn - O, Math.min(w.width - xn, I)), G = Math.max(0, Math.min(w.height - en, G)), r(t.id, I, G);
    }
    function g() {
      v = !1, document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", g);
    }
    let R = !1, F = 0, k = 0, S = 0, p = 0;
    const M = X("");
    function z(d) {
      u.value.maximized || (l(t.id), R = !0, F = d.clientX, k = d.clientY, S = u.value.w, p = u.value.h, document.addEventListener("mousemove", E), document.addEventListener("mouseup", J), d.preventDefault(), d.stopPropagation());
    }
    function E(d) {
      if (!R) return;
      const w = Math.max(Ro, S + (d.clientX - F)), O = Math.max(Io, p + (d.clientY - k));
      c(t.id, w, O), M.value = `${Math.round(w)}×${Math.round(O)}`;
    }
    function J() {
      R = !1, M.value = "", document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", J), _.value++;
    }
    const _ = X(0);
    te(cn, () => {
      _.value++;
    }), et(() => {
      var d;
      document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", J), (d = C.value) == null || d.removeEventListener("scroll", V), q();
    });
    const C = X(null);
    function H(d) {
      if (t.canvas) return [];
      const w = d.children[0];
      return w ? Array.from(w.children) : [];
    }
    function V() {
      const d = C.value, w = t.curvature ?? 0;
      if (!d) return;
      const O = H(d);
      if (!O.length) return;
      const I = d.clientHeight, G = I / 2, U = w * 38e-4;
      O.forEach(($) => {
        if (!$.dataset.origFs) {
          const ge = getComputedStyle($);
          $.dataset.origFs = ge.fontSize, $.dataset.origLh = ge.lineHeight;
        }
        if (w === 0) {
          $.style.fontSize = "", $.style.lineHeight = "";
          return;
        }
        const Z = $.getBoundingClientRect(), ce = d.getBoundingClientRect(), me = Z.top - ce.top + Z.height / 2, ye = Math.min(1, Math.abs(me - G) / (I / 2)), Se = 1 + U * Math.cos(ye * Math.PI / 2), W = parseFloat($.dataset.origFs), N = $.dataset.origLh, se = N === "normal" ? W * 1.4 : parseFloat(N);
        isNaN(W) || ($.style.fontSize = `${(W * Se).toFixed(2)}px`), isNaN(se) || ($.style.lineHeight = `${(se * Se).toFixed(2)}px`);
      });
    }
    function q() {
      const d = C.value;
      d && H(d).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    te(() => t.curvature, (d) => {
      (d ?? 0) === 0 ? q() : V();
    }), Xe(() => {
      var d;
      (d = C.value) == null || d.addEventListener("scroll", V, { passive: !0 }), Ae(V);
    });
    function le() {
      i(t.id, !u.value.minimized), Ae(() => {
        _.value++;
      });
    }
    function ie() {
      a(t.id, !u.value.maximized), Ae(() => {
        _.value++;
      });
    }
    function ne() {
      o(t.id, !1);
    }
    function ee() {
      l(t.id);
    }
    return (d, w) => u.value && u.value.visible ? (be(), Me("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: nl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: je(m.value),
      onMousedown: ee
    }, [
      he("div", {
        class: "cc-titlebar",
        onMousedown: L
      }, [
        w[0] || (w[0] = he("span", { class: "cc-status-dot" }, null, -1)),
        he("span", So, Ue(n.title), 1),
        M.value ? (be(), Me("span", To, Ue(M.value), 1)) : qe("", !0),
        he("div", Co, [
          he("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ut(le, ["stop"])
          }, "─"),
          he("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: ut(ie, ["stop"])
          }, Ue(u.value.maximized ? "⤡" : "⤢"), 9, ko),
          he("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ut(ne, ["stop"])
          }, "✕")
        ])
      ], 32),
      Tn(he("div", Lo, [
        he("div", {
          ref_key: "bodyEl",
          ref: C,
          class: "cc-screen",
          onScroll: V
        }, [
          qt(d.$slots, "default", { resizeKey: _.value }, void 0, !0),
          w[1] || (w[1] = he("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ll, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (be(), Me("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ut(z, ["stop"])
      }, null, 32)) : qe("", !0)
    ], 46, Mo)) : qe("", !0);
  }
}), No = /* @__PURE__ */ tt(Do, [["__scopeId", "data-v-ca0af4ca"]]), Eo = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Fo = `
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
`, Ao = 100, Po = /* @__PURE__ */ Qe({
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
    }, l = X(null), o = X(null);
    let i = null, a = !1;
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
    let c, f, u, m, v, y = null, D = 0;
    function L(p) {
      p - D >= Ao && (R(), D = p), y = requestAnimationFrame(L);
    }
    function h() {
      if (!l.value || !v) return;
      const p = l.value.clientWidth, M = l.value.clientHeight;
      p <= 0 || M <= 0 || v.width === p && v.height === M || (v.width = p, v.height = M, i && i.setSize(p, M, !1), o.value && (o.value.width = p, o.value.height = M, o.value.style.width = p + "px", o.value.style.height = M + "px"));
    }
    function g() {
      if (!(v != null && v.width)) return;
      const p = v.getContext("2d");
      if (!p) return;
      const M = v.width, z = v.height, E = e[t.theme] ?? e.none;
      p.clearRect(0, 0, M, z), p.fillStyle = E.bg, p.fillRect(0, 0, M, z);
      const J = Date.now(), _ = (J / 500 | 0) % 2 === 0, C = (J / 400 | 0) % 4;
      p.font = `bold ${Math.max(14, Math.min(M, z) * 0.06)}px monospace`, p.textAlign = "center", p.textBaseline = "middle", p.fillStyle = E.text, t.glow && (p.shadowColor = E.text, p.shadowBlur = 14);
      const H = ".".repeat(C).padEnd(3, " "), V = `${t.label}${H}`;
      if (p.fillText(V, M / 2, z / 2), p.shadowBlur = 0, _) {
        const q = p.measureText(V), le = p.measureText("M").width, ie = parseFloat(p.font), ne = M / 2 + q.width / 2 + 4, ee = z / 2 - ie / 2 + 2;
        p.fillStyle = E.cursor, t.glow && (p.shadowColor = E.cursor, p.shadowBlur = 12), p.fillRect(ne, ee, le * 0.7, ie * 0.95), p.shadowBlur = 0;
      }
    }
    function R() {
      if (!v) return;
      if (g(), a) {
        if (!o.value) return;
        const M = o.value.getContext("2d");
        M && M.drawImage(v, 0, 0);
        return;
      }
      if (!i || !u || !m) return;
      const p = t.theme === "paper";
      u.uniforms.uStrength.value = Ze(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !p ? 1 : 0, u.uniforms.uVignette.value = p ? 0 : 1, m.needsUpdate = !0, i.render(c, f);
    }
    function F() {
      if (!(!o.value || !l.value)) {
        v = document.createElement("canvas");
        try {
          i = new P.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          a = !0;
        }
        if (!a && !i.getContext() && (i.dispose(), i = null, a = !0), a) {
          h();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), c = new P.Scene(), f = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new P.CanvasTexture(v), m.minFilter = P.LinearFilter, m.magFilter = P.LinearFilter, u = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Eo,
          fragmentShader: Fo,
          transparent: !0
        }), c.add(new P.Mesh(new P.PlaneGeometry(2, 2), u)), h();
      }
    }
    let k = null;
    Xe(() => {
      F(), R(), y = requestAnimationFrame(L), l.value && (k = new ResizeObserver(() => h()), k.observe(l.value));
    }), et(() => {
      y !== null && cancelAnimationFrame(y), k == null || k.disconnect(), r(), m == null || m.dispose(), u == null || u.dispose();
    }), te(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => R());
    const S = ue(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (p, M) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: je(S.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Go = /* @__PURE__ */ tt(Po, [["__scopeId", "data-v-d00e5f47"]]), Pt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, bn = (n, t) => t === "left" ? n.left : t === "right" ? n.right : !t || t === "neutral" ? n.dim : t, xe = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", we = 12;
function jt(n, t, e) {
  const l = [];
  for (const o of t.split(`
`)) {
    let i = "";
    for (const a of o.split(" ")) {
      const r = i ? `${i} ${a}` : a;
      i && n.measureText(r).width > e ? (l.push(i), i = a) : i = r;
    }
    l.push(i);
  }
  return l;
}
function bt(n, t, e, l, o, i) {
  const a = Math.min(i, l / 2, o / 2);
  n.beginPath(), n.moveTo(t + a, e), n.lineTo(t + l - a, e), n.quadraticCurveTo(t + l, e, t + l, e + a), n.lineTo(t + l, e + o - a), n.quadraticCurveTo(t + l, e + o, t + l - a, e + o), n.lineTo(t + a, e + o), n.quadraticCurveTo(t, e + o, t, e + o - a), n.lineTo(t, e + a), n.quadraticCurveTo(t, e, t + a, e), n.closePath();
}
function Bo(n, t) {
  var M, z;
  const e = n.getContext("2d");
  if (!e) return 0;
  const l = t.dpr || 1, o = n.width / l, i = n.height / l, a = { ...Pt[t.theme] ?? Pt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(l, 0, 0, l, 0, 0), e.fillStyle = a.bg, e.fillRect(0, 0, o, i);
  const r = (E) => E > 0 ? a.right : E < 0 ? a.left : a.neutral, c = r(t.value), f = (E, J = 10) => {
    t.glow && (e.shadowColor = E, e.shadowBlur = J);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, m = Math.max(40, o - we * 2);
  let v = we;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const y = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${xe}`;
  const D = e.measureText(y).width;
  e.fillStyle = c, f(c, 14), e.fillText(y, we, v + 30), u();
  const L = we + D + 14;
  t.stance && (e.font = `700 14px ${xe}`, e.fillStyle = c, f(c, 8), e.fillText(t.stance.toUpperCase(), L, v + 15), u()), t.sub && (e.font = `11px ${xe}`, e.fillStyle = a.dim, e.fillText(t.sub, L, v + 31)), v += 48, e.font = `700 9px ${xe}`;
  const h = t.leftLabel.toUpperCase(), g = t.rightLabel.toUpperCase(), R = e.measureText(h).width, F = e.measureText(g).width, k = we + R + 8, S = o - we - F - 8, p = v + 10;
  if (e.fillStyle = a.left, e.fillText(h, we, p + 3), e.fillStyle = a.right, e.textAlign = "right", e.fillText(g, o - we, p + 3), e.textAlign = "left", S - k > 24) {
    const E = e.createLinearGradient(k, 0, S, 0);
    E.addColorStop(0, a.left), E.addColorStop(0.45, a.surface), E.addColorStop(0.55, a.surface), E.addColorStop(1, a.right), bt(e, k, p - 4, S - k, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = E, e.fill(), e.restore(), e.strokeStyle = a.border, e.lineWidth = 1, e.stroke();
    const J = (k + S) / 2;
    e.strokeStyle = a.border, e.beginPath(), e.moveTo(J, p - 8), e.lineTo(J, p + 8), e.stroke();
    for (const q of [0.25, 0.75]) {
      const le = k + q * (S - k);
      e.beginPath(), e.moveTo(le, p - 5), e.lineTo(le, p + 5), e.stroke();
    }
    const _ = t.max - t.min || 1, C = Math.max(0, Math.min(1, (t.shown - t.min) / _)), H = k + C * (S - k), V = r(t.shown);
    e.beginPath(), e.moveTo(H, p - 10), e.lineTo(H - 4.5, p - 17), e.lineTo(H + 4.5, p - 17), e.closePath(), e.fillStyle = V, e.fill(), e.beginPath(), e.arc(H, p, 6.5, 0, Math.PI * 2), e.fillStyle = V, f(V, 12), e.fill(), u(), e.strokeStyle = a.bg === "rgba(0,0,0,0)" ? a.border : a.bg, e.lineWidth = 2, e.stroke();
    for (const q of t.marks ?? []) {
      const le = (q.value - t.min) / _;
      if (le < 0 || le > 1) continue;
      const ie = k + le * (S - k), ne = bn(a, q.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = ne, e.lineWidth = 1, e.beginPath(), e.moveTo(ie, p - 9), e.lineTo(ie, p + 9), e.stroke(), e.restore(), q.label) {
        e.font = `700 8px ${xe}`, e.fillStyle = ne;
        const ee = e.measureText(q.label).width;
        e.fillText(q.label, Math.max(k, Math.min(S - ee, ie - ee / 2)), p + 20);
      }
    }
  }
  if (v += (M = t.marks) != null && M.some((E) => E.label) ? 42 : 30, t.meter) {
    const E = t.meter, J = E.min ?? 0, _ = E.max ?? 1, C = _ - J || 1, H = E.tone === "up" ? a.right : E.tone === "down" ? a.left : E.tone === "warn" ? a.warn : a.neutral;
    E.label && (e.font = `700 9px ${xe}`, e.fillStyle = a.dim, e.fillText(E.label.toUpperCase(), we, v + 9)), E.hint && (e.font = `9px ${xe}`, e.fillStyle = a.dim, e.textAlign = "right", e.fillText(E.hint, o - we, v + 9), e.textAlign = "left"), (E.label || E.hint) && (v += 15), e.font = `700 12px ${xe}`;
    const V = E.valueText ?? (E.value == null ? "—" : String(E.value)), q = e.measureText(V).width, le = we, ie = o - we - q - 10, ne = v + 6, ee = !!((z = E.thresholds) != null && z.some((d) => d.label));
    if (ie - le > 24) {
      if (bt(e, le, ne - 5, ie - le, 10, 5), e.fillStyle = a.surface, e.fill(), e.strokeStyle = a.border, e.lineWidth = 1, e.stroke(), E.value != null) {
        const d = Math.max(0, Math.min(1, (E.value - J) / C));
        d > 0 && (e.save(), bt(e, le, ne - 5, ie - le, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = H, f(H, 8), e.fillRect(le, ne - 5, (ie - le) * d, 10), e.restore());
      }
      for (const d of E.thresholds ?? []) {
        const w = (d.value - J) / C;
        if (w < 0 || w > 1) continue;
        const O = le + w * (ie - le), I = bn(a, d.color);
        if (e.strokeStyle = I, e.lineWidth = 1, e.beginPath(), e.moveTo(O, ne - 7), e.lineTo(O, ne + 7), e.stroke(), d.label) {
          e.font = `700 7.5px ${xe}`, e.fillStyle = I;
          const G = e.measureText(d.label).width;
          e.fillText(d.label, Math.max(le, Math.min(ie - G, O - G / 2)), ne + 17);
        }
      }
    }
    e.font = `700 12px ${xe}`, e.fillStyle = H, e.textAlign = "right", f(H, 8), e.fillText(V, o - we, ne + 4), u(), e.textAlign = "left", v += ee ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${xe}`;
    const E = jt(e, t.caption, m - 18), J = E.length * 15 + 12;
    bt(e, we, v, m, J, 4), e.fillStyle = a.surface, e.fill(), e.strokeStyle = t.value < 0 ? a.left : a.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? a.left : t.value > 0 ? a.text : a.dim, E.forEach((_, C) => e.fillText(_, we + 9, v + 17 + C * 15)), v += J + 10;
  }
  if (t.note) {
    e.font = `10px ${xe}`, e.fillStyle = a.dim;
    const E = jt(e, t.note, m);
    E.forEach((J, _) => e.fillText(J, we, v + 10 + _ * 14)), v += E.length * 14 + 10;
  }
  if (t.items.length) {
    let _ = we;
    for (const C of t.items) {
      const H = C.side === "left" ? a.left : C.side === "right" ? a.right : a.neutral, V = C.side === "left" ? t.sideLetters[0] : C.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${xe}`;
      const q = e.measureText(C.label).width;
      e.font = `700 8px ${xe}`;
      const le = V ? e.measureText(V).width + 6 : 0;
      e.font = `10px ${xe}`;
      const ie = C.value ? e.measureText(C.value).width : 0, ne = 7 + q + (V ? 4 + le : 0) + (C.value ? 4 + ie : 0) + 7;
      _ + ne > o - we && _ > we && (_ = we, v += 23), bt(e, _, v, ne, 18, 4), e.fillStyle = a.surface, e.fill(), e.strokeStyle = a.border, e.lineWidth = 1, e.stroke(), e.fillStyle = H, e.fillRect(_, v + 1, 2, 16);
      let ee = _ + 7;
      e.font = `700 10px ${xe}`, e.fillStyle = a.text, e.fillText(C.label, ee, v + 12.5), ee += q + 4, V && (e.font = `700 8px ${xe}`, e.fillStyle = H, e.fillText(V, ee + 3, v + 12), ee += le + 4), C.value && (e.font = `10px ${xe}`, e.fillStyle = C.tone === "up" ? a.right : C.tone === "down" ? a.left : a.dim, e.fillText(C.value, ee, v + 12.5)), _ += ne + 5;
    }
    v += 18;
  } else if (t.emptyText) {
    e.font = `10px ${xe}`, e.fillStyle = a.dim;
    const E = jt(e, t.emptyText, m);
    E.forEach((J, _) => e.fillText(J, we, v + 10 + _ * 14)), v += E.length * 14;
  }
  return v + we;
}
const _o = /* @__PURE__ */ Qe({
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
    const t = n, e = X(null), l = X(null), o = () => (t.min + t.max) / 2, i = X(t.animate ? o() : t.value);
    let a = 0;
    function r() {
      if (cancelAnimationFrame(a), !t.animate) {
        i.value = t.value, h();
        return;
      }
      const _ = () => {
        const C = t.value - i.value;
        if (Math.abs(C) < 4e-3) {
          i.value = t.value, h();
          return;
        }
        i.value += C * 0.18, h(), a = requestAnimationFrame(_);
      };
      a = requestAnimationFrame(_);
    }
    te(() => t.value, r);
    let c = null, f = !1;
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
    let m, v;
    const y = new ln({
      paint: (_, { dpr: C, glow: H }) => Bo(_, {
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
    function D() {
      if (!(!l.value || !e.value)) {
        try {
          c = new P.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !c.getContext() && (c.dispose(), c = null, f = !0), f) {
          L();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), m = new P.Scene(), v = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), m.add(new P.Mesh(new P.PlaneGeometry(2, 2), y.material)), L();
      }
    }
    function L() {
      if (!e.value || !c && !f) return;
      const _ = e.value.clientWidth, C = e.value.clientHeight;
      y.resize(_, C) && (c ? (c.setPixelRatio(y.dpr), c.setSize(_, C)) : l.value && (l.value.width = y.canvas.width, l.value.height = y.canvas.height, l.value.style.width = _ + "px", l.value.style.height = C + "px"), h());
    }
    function h() {
      if (!y.canvas.width) return;
      if (f) {
        if (!l.value) return;
        y.paintOnly(!1);
        const C = l.value.getContext("2d");
        C && (C.setTransform(1, 0, 0, 1, 0, 0), C.clearRect(0, 0, l.value.width, l.value.height), C.drawImage(y.canvas, 0, 0));
        return;
      }
      if (!c) return;
      const _ = t.theme === "paper";
      y.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !_,
        vignette: !_,
        magnify: t.magnify
      }), y.syncUniforms(), y.paint(t.glow), c.render(m, v);
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
      () => h(),
      { deep: !0 }
    ), te(() => t.magnify, (_) => {
      _ || y.setLens(null), h();
    });
    function g(_) {
      !t.magnify || !l.value || (y.setLens(Tt(_, l.value)), h());
    }
    function R() {
      y.setLens(null), h();
    }
    let F = null, k = null, S = 0;
    const p = St("cathodeResetTick", X(0));
    te(p, () => M());
    function M() {
      cancelAnimationFrame(S), S = requestAnimationFrame(L);
    }
    function z(_) {
      _.preventDefault();
    }
    function E() {
      c == null || c.dispose(), c = null, f = !1, D(), h();
    }
    Xe(() => {
      Ae(() => {
        var _;
        D(), l.value && (l.value.addEventListener("webglcontextlost", z), l.value.addEventListener("webglcontextrestored", E)), e.value && (F = new ResizeObserver(() => L()), F.observe(e.value), k = new IntersectionObserver((C) => {
          C.some((H) => H.isIntersecting) && M();
        }), k.observe(e.value)), window.addEventListener("resize", M), (_ = window.visualViewport) == null || _.addEventListener("resize", M), r();
      });
    }), et(() => {
      var _, C, H;
      cancelAnimationFrame(a), cancelAnimationFrame(S), (_ = l.value) == null || _.removeEventListener("webglcontextlost", z), (C = l.value) == null || C.removeEventListener("webglcontextrestored", E), F == null || F.disconnect(), k == null || k.disconnect(), window.removeEventListener("resize", M), (H = window.visualViewport) == null || H.removeEventListener("resize", M), u(), y.dispose();
    });
    const J = ue(() => ({
      background: (Pt[t.theme] ?? Pt.none).bg
    }));
    return (_, C) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: je(J.value)
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
}), Ko = /* @__PURE__ */ tt(_o, [["__scopeId", "data-v-6c2fc3b2"]]);
function jo(n, t = 1) {
  if (n.mode !== "world")
    throw new Error("createSurfaceMesh needs a CathodeSurface created with mode: 'world'");
  const e = n.logicalH > 0 ? n.logicalW / n.logicalH : 16 / 9, l = new P.Mesh(new P.PlaneGeometry(t * e, t), n.material);
  return l.userData.cathodeSurface = n, l;
}
function qo(n, t, e = 1) {
  const l = t.logicalH > 0 ? t.logicalW / t.logicalH : 1.7777777777777777;
  n.geometry.dispose(), n.geometry = new P.PlaneGeometry(e * l, e);
}
const Mn = 26;
class Wo {
  constructor(t, e) {
    ae(this, "id");
    ae(this, "title");
    ae(this, "content");
    ae(this, "group", new P.Group());
    ae(this, "body");
    ae(this, "bar");
    ae(this, "glow");
    ae(this, "dirty", !0);
    ae(this, "barDirty", !0);
    ae(this, "barCanvas", document.createElement("canvas"));
    ae(this, "barTexture");
    var c, f;
    this.stage = t, this.id = e.id, this.title = e.title ?? e.id, this.content = e.content, this.glow = e.glow ?? !0;
    const l = e.content.surface;
    if (l.mode !== "world") throw new Error("CathodeStage3D panels need a CathodeSurface created with mode: 'world'");
    const o = t.pxPerUnit, i = e.content.width / o, a = e.content.height / o, r = Mn / o;
    this.body = new P.Mesh(new P.PlaneGeometry(i, a), l.material), this.barTexture = new P.CanvasTexture(this.barCanvas), this.barTexture.colorSpace = P.SRGBColorSpace, this.bar = new P.Mesh(
      new P.PlaneGeometry(i, r),
      new P.MeshBasicMaterial({ map: this.barTexture, toneMapped: !1 })
    ), this.bar.position.y = a / 2 + r / 2, this.group.add(this.body, this.bar), this.body.userData.panel = this, this.bar.userData.panel = this, e.position && this.group.position.set(...e.position), this.group.rotation.y = e.rotationY ?? 0, e.look && l.setLook(e.look), l.resize(e.content.width, e.content.height, window.devicePixelRatio || 1), (f = (c = e.content).attach) == null || f.call(c, () => this.invalidate());
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
    const t = this.content.surface;
    this.dirty && (t.syncUniforms(), t.paint(this.glow), this.dirty = !1), this.barDirty && (this.drawBar(), this.barDirty = !1);
  }
  drawBar() {
    const t = Math.min(window.devicePixelRatio || 1, 2), e = this.content.width, l = Mn, o = this.barCanvas;
    (o.width !== Math.round(e * t) || o.height !== Math.round(l * t)) && (o.width = Math.round(e * t), o.height = Math.round(l * t), this.barTexture.dispose(), this.barTexture = new P.CanvasTexture(o), this.barTexture.colorSpace = P.SRGBColorSpace, this.bar.material.map = this.barTexture, this.bar.material.needsUpdate = !0);
    const i = o.getContext("2d");
    i.setTransform(t, 0, 0, t, 0, 0);
    const a = this.stage.focusedId === this.id;
    i.fillStyle = a ? "#0f2a1d" : "#08130e", i.fillRect(0, 0, e, l), i.fillStyle = a ? "#6ee7a7" : "#2f6b4c", i.fillRect(0, l - 2, e, 2), i.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", i.textBaseline = "middle", i.fillStyle = a ? "#b6f5d2" : "#6fae8f", i.fillText(this.title, 10, l / 2 - 1), this.barTexture.needsUpdate = !0;
  }
  dispose() {
    var t, e;
    this.body.geometry.dispose(), this.bar.geometry.dispose(), this.bar.material.dispose(), this.barTexture.dispose(), (e = (t = this.content).dispose) == null || e.call(t);
  }
}
class Zo {
  constructor(t) {
    ae(this, "renderer");
    ae(this, "scene", new P.Scene());
    ae(this, "camera");
    ae(this, "canvas");
    ae(this, "panels", /* @__PURE__ */ new Map());
    ae(this, "pxPerUnit");
    ae(this, "focusedId", null);
    ae(this, "controls", null);
    ae(this, "ray", new P.Raycaster());
    ae(this, "ndc", new P.Vector2());
    ae(this, "raf", 0);
    ae(this, "rendering", !1);
    ae(this, "raiseCounter", 0);
    ae(this, "hovered", null);
    ae(this, "pressed", null);
    // a content press in progress
    ae(this, "dragging", null);
    ae(this, "suppressClick", !1);
    ae(this, "resizeObserver");
    ae(this, "disposers", []);
    ae(this, "lastCursor", "");
    this.o = t, this.pxPerUnit = t.pxPerUnit ?? 360, this.renderer = new P.WebGLRenderer({ antialias: !0, alpha: !1 }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setClearColor(t.background ?? 329738, 1), this.canvas = this.renderer.domElement, this.canvas.tabIndex = 0, this.canvas.style.cssText = "display:block;width:100%;height:100%;outline:none;touch-action:none", t.container.appendChild(this.canvas), this.camera = new P.PerspectiveCamera(45, 1, 0.05, 100);
    const e = t.cameraPosition ?? [0, 0.1, 3.4];
    this.camera.position.set(...e), this.camera.lookAt(0, 0, 0), t.controls && (this.controls = t.controls(this.camera, this.canvas), this.controls.addEventListener("change", () => this.invalidate())), this.on(this.canvas, "pointerdown", (l) => this.onPointerDown(l), { capture: !0 }), this.on(this.canvas, "pointermove", (l) => this.onPointerMove(l)), this.on(this.canvas, "pointerleave", () => this.setHover(null)), this.on(window, "pointerup", (l) => this.onPointerUp(l)), this.on(window, "pointercancel", (l) => this.onPointerUp(l)), this.on(this.canvas, "click", (l) => this.onClick(l)), this.on(this.canvas, "wheel", (l) => this.onWheel(l), { capture: !0, passive: !1 }), this.on(this.canvas, "keydown", (l) => this.onKey(l)), this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t.container), this.resize();
  }
  on(t, e, l, o) {
    t.addEventListener(e, l, o), this.disposers.push(() => t.removeEventListener(e, l, o));
  }
  // ── Panels ──────────────────────────────────────────────────────────────────
  addPanel(t) {
    if (this.panels.has(t.id)) throw new Error(`CathodeStage3D: duplicate panel id "${t.id}"`);
    const e = new Wo(this, t);
    return e.content.surface.setAnisotropy(this.renderer.capabilities.getMaxAnisotropy()), this.panels.set(t.id, e), this.scene.add(e.group), this.raise(e), this.invalidate(), e;
  }
  removePanel(t) {
    const e = this.panels.get(t);
    e && (this.focusedId === t && this.setFocus(null), this.hovered === e && (this.hovered = null), this.pressed === e && (this.pressed = null), this.scene.remove(e.group), e.dispose(), this.panels.delete(t), this.invalidate());
  }
  /** Keyboard focus + raise. */
  setFocus(t) {
    var o, i;
    if (this.focusedId === t) {
      t && this.raise(this.panels.get(t));
      return;
    }
    const e = this.focusedId && this.panels.get(this.focusedId);
    this.focusedId = t, e && e.invalidateBar();
    const l = t ? this.panels.get(t) : null;
    l && (this.raise(l), l.invalidateBar()), (i = (o = this.o).onFocus) == null || i.call(o, t), this.invalidate();
  }
  raise(t) {
    t.body.renderOrder = t.bar.renderOrder = ++this.raiseCounter;
  }
  getLayout() {
    const t = {};
    for (const [e, l] of this.panels)
      t[e] = { x: l.group.position.x, y: l.group.position.y, z: l.group.position.z, rotY: l.group.rotation.y };
    return t;
  }
  applyLayout(t) {
    for (const [e, l] of Object.entries(t)) {
      const o = this.panels.get(e);
      o && (o.group.position.set(l.x ?? o.group.position.x, l.y ?? o.group.position.y, l.z ?? o.group.position.z), l.rotY !== void 0 && (o.group.rotation.y = l.rotY));
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
    const o = this.ray.intersectObject(t.body)[0];
    return o != null && o.uv ? t.content.surface.contentPoint(o.uv.x, o.uv.y) : null;
  }
  /** Local content-px per screen-px at a client point: two probes 8px apart, as the DOM grid does. */
  hitScaleAt(t, e, l) {
    const o = this.contentAt(t, e - 4, l), i = this.contentAt(t, e + 4, l);
    return !o || !i ? 1 : Math.max(1, Math.abs(i.x - o.x) / 8);
  }
  /** The nearest panel part under a client point (bodies and title bars; raised panels win ties). */
  pick(t, e) {
    this.setRay(t, e);
    const l = [];
    for (const u of this.panels.values()) l.push(u.body, u.bar);
    const o = this.ray.intersectObjects(l, !1);
    if (!o.length) return null;
    const i = o[0].distance;
    let a = o[0];
    for (const u of o)
      u.distance - i < 1e-3 && u.object.renderOrder > a.object.renderOrder && (a = u);
    const r = a.object.userData.panel, c = a.object === r.bar ? "bar" : "body", f = c === "body" && a.uv ? r.content.surface.contentPoint(a.uv.x, a.uv.y) : null;
    return { panel: r, part: c, content: f };
  }
  /**
   * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
   * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
   */
  clientPointForContent(t, e, l) {
    const o = this.panels.get(t);
    if (!o) return null;
    const i = o.content.surface, a = o.content.width, r = o.content.height;
    let c = e / a, f = 1 - l / r;
    const u = (D, L) => i.contentPoint(D, L);
    for (let D = 0; D < 12; D++) {
      const L = u(c, f);
      if (!L) {
        c = 0.5 + (c - 0.5) * 0.8, f = 0.5 + (f - 0.5) * 0.8;
        continue;
      }
      const h = L.x - e, g = L.y - l;
      if (Math.hypot(h, g) < 0.05) break;
      const R = 1e-4, F = u(c + R, f), k = u(c, f + R);
      if (!F || !k) break;
      const S = (F.x - L.x) / R, p = (k.x - L.x) / R, M = (F.y - L.y) / R, z = (k.y - L.y) / R, E = S * z - p * M;
      if (Math.abs(E) < 1e-9) break;
      c -= (z * h - p * g) / E, f -= (-M * h + S * g) / E;
    }
    const m = u(c, f);
    if (!m || Math.hypot(m.x - e, m.y - l) > 1.5) return null;
    o.group.updateWorldMatrix(!0, !0);
    const v = o.body.localToWorld(new P.Vector3((c - 0.5) * (a / this.pxPerUnit), (f - 0.5) * (r / this.pxPerUnit), 0));
    v.project(this.camera);
    const y = this.canvas.getBoundingClientRect();
    return { x: y.left + (v.x + 1) / 2 * y.width, y: y.top + (1 - v.y) / 2 * y.height };
  }
  /** Client point of a panel's title bar centre (for tests / tours). */
  clientPointForBar(t) {
    const e = this.panels.get(t);
    if (!e) return null;
    e.group.updateWorldMatrix(!0, !0);
    const l = e.bar.getWorldPosition(new P.Vector3()).project(this.camera), o = this.canvas.getBoundingClientRect();
    return { x: o.left + (l.x + 1) / 2 * o.width, y: o.top + (1 - l.y) / 2 * o.height };
  }
  // ── Pointer routing ─────────────────────────────────────────────────────────
  send(t, e, l, o = {}) {
    var r, c;
    const i = this.contentAt(t, l.clientX, l.clientY), a = {
      kind: e,
      x: i ? i.x : -1,
      y: i ? i.y : -1,
      hitScale: i ? this.hitScaleAt(t, l.clientX, l.clientY) : 1,
      clientX: l.clientX,
      clientY: l.clientY,
      deltaX: o.deltaX ?? 0,
      deltaY: o.deltaY ?? 0,
      shiftKey: !!l.shiftKey
    };
    return ((c = (r = t.content).pointer) == null ? void 0 : c.call(r, a)) ?? null;
  }
  setCursor(t) {
    t !== this.lastCursor && (this.lastCursor = t, this.canvas.style.cursor = t);
  }
  setHover(t, e) {
    this.hovered && this.hovered !== t && this.send(this.hovered, "leave", e ?? { clientX: -1, clientY: -1 }), this.hovered = t, t || this.setCursor("");
  }
  onPointerDown(t) {
    if (t.button !== 0) return;
    this.canvas.focus({ preventScroll: !0 });
    const e = this.pick(t.clientX, t.clientY);
    e && (this.controls && (this.controls.enabled = !1), this.setFocus(e.panel.id), this.suppressClick = !1, e.part === "bar" ? (this.startDrag(e.panel), this.setCursor("grabbing")) : (this.pressed = e.panel, this.send(e.panel, "down", t)));
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
      const o = this.dragging.panel;
      this.dragging = null, this.setCursor(""), (l = (e = this.o).onPanelMoved) == null || l.call(e, o.id, { x: o.group.position.x, y: o.group.position.y, z: o.group.position.z });
    }
    this.pressed && (this.send(this.pressed, "up", t), this.pressed = null), this.controls && (this.controls.enabled = !0);
  }
  onClick(t) {
    if (this.suppressClick) {
      this.suppressClick = !1;
      return;
    }
    const e = this.pick(t.clientX, t.clientY);
    e && e.part === "body" && this.send(e.panel, "click", t);
  }
  onWheel(t) {
    const e = this.pick(t.clientX, t.clientY);
    !e || e.part !== "body" || (t.preventDefault(), t.stopImmediatePropagation(), this.send(e.panel, "wheel", t, { deltaX: t.deltaX, deltaY: t.deltaY }));
  }
  onKey(t) {
    const e = this.focusedId ? this.panels.get(this.focusedId) : null;
    e != null && e.content.key && (e.content.key(t), e.invalidate());
  }
  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────
  startDrag(t) {
    t.group.updateWorldMatrix(!0, !0);
    const e = new P.Vector3(0, 0, 1).applyQuaternion(t.group.quaternion), l = new P.Plane().setFromNormalAndCoplanarPoint(e, t.group.position), o = new P.Vector3(), i = new P.Vector3();
    this.ray.ray.intersectPlane(l, o) && i.copy(t.group.position).sub(o), this.dragging = { panel: t, plane: l, offset: i, moved: !1 };
  }
  dragTo(t) {
    const e = this.dragging;
    this.setRay(t.clientX, t.clientY);
    const l = new P.Vector3();
    this.ray.ray.intersectPlane(e.plane, l) && (e.panel.group.position.copy(l.add(e.offset)), e.moved = !0, this.invalidate());
  }
  // ── Teardown ────────────────────────────────────────────────────────────────
  dispose() {
    var t;
    cancelAnimationFrame(this.raf), this.resizeObserver.disconnect();
    for (const e of this.disposers) e();
    for (const e of [...this.panels.values()]) this.removePanel(e.id);
    (t = this.controls) == null || t.dispose();
    try {
      this.renderer.forceContextLoss();
    } catch {
    }
    this.renderer.dispose(), this.canvas.remove();
  }
}
function Jo(n, t, e, l = {}) {
  return { surface: n, width: t, height: e, ...l };
}
function Qo(n) {
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
  const o = new ln({
    mode: "world",
    paint: (r, c) => l.paint(r, c)
  }), i = (r) => {
    const c = { cx: r.x, cy: r.y, hitScale: r.hitScale };
    switch (r.kind) {
      case "move":
        return l.resizing ? null : l.hover(c);
      case "leave":
        return l.leave(), null;
      case "down":
        return l.pointerDown(c, r.clientX, r.clientY), null;
      case "drag":
        return l.globalMove(r.clientX, r.clientY), null;
      case "up":
        return l.globalUp(), null;
      case "click":
        return l.click(c, { shiftKey: r.shiftKey }), null;
      case "wheel":
        return l.wheel(r.deltaX, r.deltaY, r.shiftKey), null;
    }
  }, a = (r) => {
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
    surface: o,
    width: n.width,
    height: n.height,
    attach: (r) => {
      t = r;
    },
    pointer: i,
    key: a,
    dispose: () => {
      l.dispose(), o.dispose();
    }
  };
}
export {
  wt as CANDLE_THEME_COLORS,
  Vo as CathodeCandle,
  Oo as CathodeCandleGrid,
  No as CathodeContainer,
  Ko as CathodeGauge,
  Ho as CathodeGrid,
  Go as CathodeLoader,
  Pl as CathodeLog,
  Zo as CathodeStage3D,
  ln as CathodeSurface,
  $o as CathodeTerminal,
  Xo as CathodeWorkspace,
  Pt as GAUGE_THEME_COLORS,
  Et as LOG_THEME_COLORS,
  Wo as Panel3D,
  pl as barrelUV,
  Uo as buildDefaultLayout,
  jo as createSurfaceMesh,
  Qo as gridContent,
  wl as lensUV,
  qo as resizeSurfaceMesh,
  Jo as surfaceContent,
  Bn as useCathodeLayout,
  En as useGridModel
};
