var Jn = Object.defineProperty;
var ei = (n, t, e) => t in n ? Jn(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var j = (n, t, e) => ei(n, typeof t != "symbol" ? t + "" : t, e);
import { effectScope as ti, ref as X, reactive as Ut, watch as ne, nextTick as Pe, computed as ue, defineComponent as Je, inject as Ct, onMounted as Xe, onUnmounted as et, openBlock as be, createElementBlock as Me, normalizeStyle as qe, createElementVNode as he, withModifiers as ut, unref as ve, withKeys as pn, createCommentVNode as je, toDisplayString as Ue, createVNode as Rn, withDirectives as In, vModelText as ni, provide as wn, renderSlot as en, Transition as ii, withCtx as li, Fragment as oi, renderList as ai, createTextVNode as ri, normalizeClass as si, vShow as ci } from "vue";
import * as C from "three";
const yt = {
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
}, Te = 30, tn = 12, ui = 10, Dt = 14, Dn = 5;
function Et() {
  return `${tn}px system-ui, -apple-system, sans-serif`;
}
function En(n, t, e) {
  const i = String(t ?? "");
  if (!i) return [""];
  const l = i.split(/\s+/).filter(Boolean);
  if (l.length === 0) return [""];
  const a = [];
  let o = "";
  for (const c of l) {
    const r = o ? o + " " + c : c;
    !o || n.measureText(r).width <= e ? o = r : (a.push(o), o = c);
  }
  return o && a.push(o), a.length ? a : [""];
}
function fi(n, t) {
  return Math.max(t, n * Dt + Dn * 2);
}
function rn(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let i = 0; i < t; i++) e[i + 1] = e[i] + (n[i] ?? 0);
  return e;
}
function Ft(n, t) {
  if (t <= 0) return 0;
  let e = 0, i = n.length - 1;
  for (; e < i; ) {
    const l = e + i + 1 >> 1;
    n[l] <= t ? e = l : i = l - 1;
  }
  return e;
}
const Fn = 28;
function di(n, t) {
  if (typeof t == "function") return t(n);
  const e = n.filter((l) => l != null && l !== "");
  if (t === "count") return e.length;
  const i = e.map((l) => Number(l)).filter((l) => !Number.isNaN(l));
  if (i.length === 0) return null;
  switch (t) {
    case "sum":
      return i.reduce((l, a) => l + a, 0);
    case "avg":
      return i.reduce((l, a) => l + a, 0) / i.length;
    case "min":
      return Math.min(...i);
    case "max":
      return Math.max(...i);
  }
}
function hi(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const i = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(i, 0, 0, i, 0, 0);
  const l = n.width / i, a = n.height / i, o = yt[t.theme] ?? yt.none, { cols: c, rows: r, pinnedRows: s, rowHeight: u, scrollY: v, scrollX: d, glow: w } = t;
  e.clearRect(0, 0, l, a), e.fillStyle = o.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const k = s.length * u, L = t.aggregateRow ? Fn : 0, m = a - Te - k - L;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, l, Te), e.textBaseline = "middle", e.textAlign = "left";
  let g = -d;
  for (let h = 0; h < c.length; h++) {
    const y = c[h];
    if (g + y.width <= 0) {
      g += y.width;
      continue;
    }
    if (g >= l) break;
    const O = !!t.colFilters[y.colId], E = t.sorts.findIndex((V) => V.colId === y.colId), G = E >= 0, U = (y.colDef.headerName ?? y.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(g, 0, y.width, Te), e.clip(), e.font = `bold ${ui}px system-ui, -apple-system, sans-serif`, e.fillStyle = O ? o.accent : o.textHeader, w ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText(U, g + 8, Te / 2), e.shadowBlur = 4, e.fillText(U, g + 8, Te / 2), e.shadowBlur = 0) : e.fillText(U, g + 8, Te / 2), G) {
      const V = e.measureText(U).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent;
      const Q = t.sorts[E].dir === "asc" ? "▲" : "▼";
      e.fillText(t.sorts.length > 1 ? `${Q}${E + 1}` : Q, g + 8 + V + 4, Te / 2);
    }
    y.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = O ? o.accent : o.textHeader, e.globalAlpha = O ? 1 : 0.38, e.fillText("⌕", g + y.width - 20, Te / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(g + y.width - 0.5, 0), e.lineTo(g + y.width - 0.5, Te), e.stroke(), g += y.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Te - 0.5), e.lineTo(l, Te - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Te, l, m), e.clip();
  const D = t.rowHeights && t.rowHeights.length === r.length ? t.rowHeights : null, P = D ? rn(D, r.length) : null, I = (h) => P ? P[h] : h * u, S = (h) => D ? D[h] : u, p = P ? Ft(P, v) : Math.max(0, Math.floor(v / u));
  let M;
  if (P)
    for (M = p; M < r.length && I(M) < v + m; ) M++;
  else
    M = Math.min(r.length, Math.ceil((v + m) / u));
  const H = t.selectionAnchorRow ?? t.selectedRow, F = t.selectionAnchorCol ?? t.selectedCol, J = t.selectedRow >= 0 && H >= 0 ? Math.min(t.selectedRow, H) : -1, _ = t.selectedRow >= 0 && H >= 0 ? Math.max(t.selectedRow, H) : -1, R = t.selectedCol >= 0 && F >= 0 ? Math.min(t.selectedCol, F) : -1, Y = t.selectedCol >= 0 && F >= 0 ? Math.max(t.selectedCol, F) : -1, $ = _ > J || Y > R;
  let Z = Number.POSITIVE_INFINITY, le = Number.NEGATIVE_INFINITY, ae = Number.POSITIVE_INFINITY, ie = Number.NEGATIVE_INFINITY;
  const te = (h, y, O, E) => {
    w ? (e.shadowColor = E, e.shadowBlur = 12, e.fillText(h, y, O), e.shadowBlur = 6, e.fillText(h, y, O), e.shadowBlur = 2, e.fillText(h, y, O), e.shadowBlur = 0) : e.fillText(h, y, O);
  };
  for (let h = p; h < M; h++) {
    const y = r[h], O = S(h), E = Te + I(h) - v;
    h % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, E, l, O));
    const G = h >= J && h <= _;
    h === t.hoveredRow && !G && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, E, l, O)), G && !$ && (e.fillStyle = Xt(o.accent, 0.1), e.fillRect(0, E, l, O)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, E + O - 0.5), e.lineTo(l, E + O - 0.5), e.stroke();
    let U = -d;
    for (let V = 0; V < c.length; V++) {
      const Q = c[V];
      if (U + Q.width <= 0) {
        U += Q.width;
        continue;
      }
      if (U >= l) break;
      const ce = G && V >= R && V <= Y;
      ce && $ && (e.fillStyle = Xt(o.accent, 0.14), e.fillRect(U, E, Q.width, O)), ce && (U < Z && (Z = U), U + Q.width > le && (le = U + Q.width), E < ae && (ae = E), E + O > ie && (ie = E + O));
      const me = t.getCellStyle(Q, y), ye = me.color ?? o.text, Se = me.textAlign ?? "left", B = t.formatCell(Q, y);
      if (e.save(), e.beginPath(), e.rect(U + 1, E, Q.width - 2, O), e.clip(), e.font = Et(), e.fillStyle = ye, e.textBaseline = "middle", Q.colDef.wrap) {
        e.textAlign = "left";
        const N = En(e, B, Math.max(20, Q.width - 16));
        let se = E + Dn + Dt / 2;
        for (const ge of N) {
          if (se - Dt / 2 >= E + O) break;
          te(ge, U + 8, se, ye), se += Dt;
        }
      } else {
        const N = Se === "right" ? U + Q.width - 8 : U + 8;
        e.textAlign = Se === "right" ? "right" : "left", te(B, N, E + O / 2, ye);
      }
      e.restore(), h === t.selectedRow && V === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(U + 1.5, E + 1.5, Q.width - 3, O - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(U + Q.width - 0.5, E), e.lineTo(U + Q.width - 0.5, E + O), e.stroke(), U += Q.width;
    }
  }
  if ($ && Z < le && ae < ie && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(Z + 0.5, ae + 0.5, le - Z - 1, ie - ae - 1)), e.restore(), s.length > 0) {
    const h = a - k - L;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, h - 0.5), e.lineTo(l, h - 0.5), e.stroke();
    for (let y = 0; y < s.length; y++) {
      const O = s[y], E = h + y * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, E, l, u);
      let G = -d;
      for (let U = 0; U < c.length; U++) {
        const V = c[U];
        if (G + V.width <= 0) {
          G += V.width;
          continue;
        }
        if (G >= l) break;
        const Q = t.getCellStyle(V, O), ce = Q.color ?? o.text, me = Q.textAlign ?? "left", ye = t.formatCell(V, O);
        e.save(), e.beginPath(), e.rect(G + 1, E, V.width - 2, u), e.clip(), e.font = `bold ${tn}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle", me === "right" ? (e.textAlign = "right", e.fillText(ye, G + V.width - 8, E + u / 2)) : (e.textAlign = "left", e.fillText(ye, G + 8, E + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(G + V.width - 0.5, E), e.lineTo(G + V.width - 0.5, E + u), e.stroke(), G += V.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, E + u - 0.5), e.lineTo(l, E + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const h = a - L;
    e.fillStyle = Xt(o.accent, 0.1), e.fillRect(0, h, l, L), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, h - 0.5), e.lineTo(l, h - 0.5), e.stroke();
    let y = -d;
    for (let O = 0; O < c.length; O++) {
      const E = c[O];
      if (y + E.width <= 0) {
        y += E.width;
        continue;
      }
      if (y >= l) break;
      const U = t.getCellStyle(E, t.aggregateRow).textAlign ?? "left", V = t.aggregateRow[E.colId] ?? "";
      e.save(), e.beginPath(), e.rect(y + 1, h, E.width - 2, L), e.clip(), e.font = `bold ${tn}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", w && (e.shadowColor = o.accent, e.shadowBlur = 8), U === "right" ? (e.textAlign = "right", e.fillText(V, y + E.width - 8, h + L / 2)) : (e.textAlign = "left", e.fillText(V, y + 8, h + L / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(y + E.width - 0.5, h), e.lineTo(y + E.width - 0.5, h + L), e.stroke(), y += E.width;
    }
  }
  e.restore();
}
function Xt(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), i = parseInt(n.slice(3, 5), 16), l = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${i},${l},${t})`;
}
const Lt = 190, Nt = 34;
function vi(n, t, e) {
  const i = Math.max(4, Math.min(t, n - Lt - 4)), l = Te + 6, a = e ? 26 : 0;
  return {
    box: { x: i, y: l, w: Lt, h: Nt },
    input: { x: i + 9, y: l + 5, w: Lt - 18 - a, h: Nt - 10 },
    clear: e ? { x: i + Lt - 28, y: l, w: 28, h: Nt } : null
  };
}
const Gt = (n, t, e, i = 0) => n >= e.x - i && n <= e.x + e.w + i && t >= e.y && t <= e.y + e.h;
function Rt(n, t, e, i = 1) {
  return e.clear && Gt(n, t, e.clear, 4 * (i - 1)) ? "clear" : Gt(n, t, e.input) ? "input" : Gt(n, t, e.box) ? "inside" : "outside";
}
function mi(n, t, e, i, l) {
  const { box: a, input: o, clear: c } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = l.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(a.x + 0.5, a.y + 0.5, a.w - 1, a.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(o.x, o.y, o.w, o.h, 3), n.fill(), n.beginPath(), n.rect(o.x, o.y, o.w, o.h), n.clip(), n.font = Et(), n.textBaseline = "middle";
  const r = o.y + o.h / 2 + 1, s = 5;
  if (e) {
    n.fillStyle = l.text;
    const u = n.measureText(e).width, v = u > o.w - 2 * s - 2 ? o.x + o.w - s - 2 - u : o.x + s;
    n.fillText(e, v, r), i && (n.fillStyle = l.accent, n.fillRect(Math.min(v + u + 1, o.x + o.w - s), o.y + 4, 1.5, o.h - 8));
  } else
    n.fillStyle = l.textHeader, n.fillText("Filter…", o.x + s, r), i && (n.fillStyle = l.accent, n.fillRect(o.x + s, o.y + 4, 1.5, o.h - 8));
  n.restore(), c && (n.save(), n.font = Et(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = l.textHeader, n.fillText("✕", c.x + c.w / 2, c.y + c.h / 2 + 1), n.restore());
}
function gi(n, t, e) {
  const i = n - 0.5, l = t - 0.5, a = Math.abs(e), o = (i * i + l * l) * a;
  if (e < 0) {
    const s = 0.5 * a, v = 1 / (1 - 2 * (0.5 * (1 + s) * s)), d = (i + i * (1 + o) * o * -1) * v, w = (l + l * (1 + o) * o * -1) * v;
    return [0.5 + d, 0.5 + w];
  }
  const c = i * (1 + o) * o, r = l * (1 + o) * o;
  return [n + c, t + r];
}
function Pn(n, t, e, i, l, a = e, o = i) {
  const c = n / e, r = 1 - t / i, [s, u] = gi(c, r, l);
  return s < 0 || s > 1 || u < 0 || u > 1 ? [-1, -1] : [s * a, (1 - u) * o];
}
function Kt(n, t) {
  let e = 0;
  for (let i = 0; i < n; i++) e += t[i].width;
  return e;
}
function pi(n, t, e, i = 1) {
  return n >= t + e - 24 * i && n < t + e;
}
function yn(n, t, e, i = 1) {
  const l = t + e;
  return n >= l - 6 * i && n <= l + 1 * i;
}
function wi(n, t, e, i, l, a, o, c, r, s = !1, u) {
  const v = n + r;
  let d = -1, w = 0;
  for (let D = 0; D < e.length; D++) {
    if (v >= w && v < w + e[D].width) {
      d = D;
      break;
    }
    w += e[D].width;
  }
  if (t < Te) return { area: "header", colIdx: d, rowIdx: -1 };
  const k = s ? Fn : 0;
  if (k > 0 && t >= o - k)
    return { area: "agg", colIdx: d, rowIdx: -1 };
  const L = c * l;
  if (L > 0 && t >= o - L - k) {
    const D = Math.floor((t - (o - L - k)) / l);
    return { area: "pinned", colIdx: d, rowIdx: D };
  }
  const m = t - Te + a, g = u && u.length === i ? Ft(rn(u, i), m) : Math.floor(m / l);
  return g >= 0 && g < i ? { area: "body", colIdx: d, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function Ze(n) {
  return n / 45 * 0.55;
}
function An(n) {
  const t = Math.abs(Ze(n));
  if (t === 0) return 1;
  if (n < 0) {
    const i = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + i) * i));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const yi = 500, zn = yi / 2, nn = 1.6, Bt = `
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
`, Ht = `
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
    uMouseUV: { value: new C.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: nn },
    uLensTint: { value: new C.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Ce = { x: -999, y: -999 };
function Vt(n, t, e, i, l) {
  const a = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = a && l > 0 ? zn / l : 0, n.uniforms.uAspect.value = l > 0 ? i / l : 1;
}
function kt(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const xi = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, bi = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`, Mi = `
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

  ${Wt}

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
    ${Ht}
    gl_FragColor = color;
  }
`;
function Si(n, t, e) {
  const i = n - 0.5, l = t - 0.5, a = Math.abs(e), o = (i * i + l * l) * a, c = (1 + o) * o * Math.sign(e);
  let r = i + i * c, s = l + l * c;
  if (e < 0) {
    const u = 0.5 * a, v = 0.5 * (1 + u) * u;
    r /= 1 - 2 * v, s /= 1 - 2 * v;
  }
  return { x: 0.5 + r, y: 0.5 + s };
}
function Ti(n, t, e, i, l, a) {
  if (!i || e.x === Ce.x || a <= 0) return { x: n, y: t };
  const o = l / a, c = zn / a, r = (n - e.x) * o, s = t - e.y, u = Math.hypot(r, s);
  if (u >= c) return { x: n, y: t };
  const v = u / c, d = Math.min(Math.max((v - 0.88) / (1 - 0.88), 0), 1), w = d * d * (3 - 2 * d), k = nn + (1 - nn) * w;
  return { x: e.x + r / k / o, y: e.y + s / k };
}
class $t {
  constructor(t) {
    j(this, "canvas");
    j(this, "material");
    j(this, "mode");
    /** logical (CSS px) size and backing-store dpr — set by resize() */
    j(this, "dpr", 1);
    j(this, "logicalW", 0);
    j(this, "logicalH", 0);
    /**
     * Visible panel size in px, when it differs from the content canvas (CathodeGrid's bend-field
     * gain draws a WIDER canvas than the screen it warps into). The lens is a fixed physical size
     * and circular in SCREEN px, so its radius/aspect come from this; 0 = same as the content.
     */
    j(this, "screenW", 0);
    j(this, "screenH", 0);
    j(this, "texture");
    j(this, "painter");
    j(this, "maxDpr");
    j(this, "look", { curvature: 0, scanlines: !0, vignette: !0, magnify: !1 });
    j(this, "mouse", { x: Ce.x, y: Ce.y });
    j(this, "anisotropy", 1);
    this.painter = t.paint, this.mode = t.mode ?? "screen", this.maxDpr = t.maxDpr ?? 2, this.canvas = document.createElement("canvas"), this.texture = this.makeTexture(), this.material = new C.ShaderMaterial({
      uniforms: {
        uTex: { value: this.texture },
        uStrength: { value: 0 },
        uScanlines: { value: 1 },
        uVignette: { value: 1 },
        ...Yt()
      },
      vertexShader: this.mode === "world" ? bi : xi,
      fragmentShader: Mi,
      transparent: !0,
      side: this.mode === "world" ? C.DoubleSide : C.FrontSide
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
    const t = new C.CanvasTexture(this.canvas);
    return t.magFilter = C.LinearFilter, this.mode === "world" ? (t.generateMipmaps = !0, t.minFilter = C.LinearMipmapLinearFilter, t.anisotropy = this.anisotropy) : t.minFilter = C.LinearFilter, t;
  }
  /**
   * Size the backing store (logical W×H × dpr, capped). Returns false — and does nothing — when
   * nothing changed: assigning canvas.width clears it even at the same value, and ResizeObserver
   * fires spuriously. The caller redraws on true.
   */
  resize(t, e, i = window.devicePixelRatio || 1) {
    if (!t || !e) return !1;
    const l = Math.min(i, this.maxDpr), a = Math.round(t * l), o = Math.round(e * l);
    return this.canvas.width === a && this.canvas.height === o && this.dpr === l ? !1 : (this.dpr = l, this.logicalW = t, this.logicalH = e, this.canvas.width = a, this.canvas.height = o, this.texture.dispose(), this.texture = this.makeTexture(), this.material.uniforms.uTex.value = this.texture, !0);
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
    t.uStrength.value = Ze(this.look.curvature), t.uScanlines.value = this.look.scanlines ? 1 : 0, t.uVignette.value = this.look.vignette ? 1 : 0, Vt(
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
    const i = Ti(t, e, this.mouse, this.look.magnify, this.screenW || this.logicalW, this.screenH || this.logicalH), l = Si(i.x, i.y, Ze(this.look.curvature));
    return l.x < 0 || l.x > 1 || l.y < 0 || l.y > 1 ? null : { x: l.x * this.logicalW, y: (1 - l.y) * this.logicalH };
  }
  dispose() {
    this.texture.dispose(), this.material.dispose();
  }
}
const Ci = 600;
function _n(n) {
  const t = ti(!0);
  return t.run(() => ki(n, t));
}
function ki(n, t) {
  var vn, mn;
  const { emit: e, host: i } = n, l = X(((vn = n.rowData) == null ? void 0 : vn.call(n)) ?? []), a = X(((mn = n.pinnedBottomRowData) == null ? void 0 : mn.call(n)) ?? []), o = X(""), c = X([]), r = Ut({}), s = Ut({}), u = Ut(/* @__PURE__ */ new Set()), v = X(0), d = X(0), w = X(0), k = X(0), L = X(0), m = X(0), g = X(0), D = X(-1), P = X(null), I = X(null), S = X(null), p = X(""), M = X(0);
  let H = null;
  const F = X(!0);
  let J = null;
  ne(S, (f) => {
    var x;
    J && (clearInterval(J), J = null), f ? (F.value = !0, J = setInterval(() => {
      F.value = !F.value, i.redraw();
    }, 530), Pe(() => {
      var b;
      return (b = i.focusFilterInput) == null ? void 0 : b.call(i);
    })) : (H = null, (x = i.blurFilterInput) == null || x.call(i)), i.redraw();
  });
  function _(f) {
    return f.colId ?? f.field ?? (f.headerName ? f.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
  }
  const R = ue(() => {
    var x;
    const f = ((x = n.defaultColDef) == null ? void 0 : x.call(n)) ?? {};
    return n.columnDefs().filter((b) => !u.has(_(b))).map((b) => {
      const z = _(b), W = { ...f, ...b };
      return { colId: z, colDef: W, width: s[z] ?? W.width ?? 100 };
    });
  }), Y = ue(() => {
    const f = d.value;
    if (!f) return R.value;
    const x = R.value.reduce((W, K) => W + K.width, 0);
    if (!x || x >= f) return R.value;
    const b = f / x;
    let z = 0;
    return R.value.map((W, K) => {
      const re = K === R.value.length - 1 ? f - z : Math.max(8, Math.round(W.width * b));
      return z += re, { ...W, width: re };
    });
  }), $ = ue(() => {
    const f = Y.value.reduce((x, b) => x + b.width, 0);
    return Math.max(0, f - d.value);
  });
  function Z(f, x) {
    if (x.colDef.valueGetter) return x.colDef.valueGetter({ data: f, colDef: x.colDef });
    if (x.colDef.field) return f[x.colDef.field];
  }
  function le(f, x) {
    const b = Z(x, f);
    return f.colDef.valueFormatter ? f.colDef.valueFormatter({ value: b, data: x, colDef: f.colDef }) ?? "" : f.colDef.cellRenderer ? (f.colDef.cellRenderer({ value: b, data: x, colDef: f.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
  }
  function ae(f, x) {
    return f.colDef.cellStyle ? typeof f.colDef.cellStyle == "function" ? f.colDef.cellStyle({ value: Z(x, f), data: x, colDef: f.colDef }) ?? {} : f.colDef.cellStyle : {};
  }
  function ie() {
    return n.columnDefs().map((f, x) => ({ d: f, i: x })).filter(({ d: f }) => f.sort).sort((f, x) => (f.d.sortIndex ?? f.i) - (x.d.sortIndex ?? x.i)).map(({ d: f }) => ({ colId: _(f), dir: f.sort }));
  }
  const te = ue(() => {
    v.value;
    let f = l.value;
    const x = o.value.trim().toLowerCase();
    x && (f = f.filter(
      (z) => R.value.some(
        (W) => String(Z(z, W) ?? "").toLowerCase().includes(x)
      )
    ));
    for (const [z, W] of Object.entries(r)) {
      if (!W) continue;
      const K = R.value.find((ee) => ee.colId === z);
      if (K)
        if (W.startsWith("__eq__")) {
          const ee = W.slice(6).toLowerCase();
          f = f.filter((re) => String(Z(re, K) ?? "").toLowerCase() === ee);
        } else {
          const ee = W.toLowerCase();
          f = f.filter((re) => String(Z(re, K) ?? "").toLowerCase().includes(ee));
        }
    }
    const b = c.value.map(({ colId: z, dir: W }) => ({ col: R.value.find((K) => K.colId === z), dir: W })).filter((z) => !!z.col);
    return b.length && (f = [...f].sort((z, W) => {
      for (const { col: K, dir: ee } of b) {
        const re = Z(z, K), Ee = Z(W, K);
        let De = 0;
        if (K.colDef.comparator ? De = K.colDef.comparator(re, Ee) : typeof re == "number" && typeof Ee == "number" ? De = re - Ee : De = String(re ?? "").localeCompare(String(Ee ?? ""), void 0, { numeric: !0 }), De) return ee === "asc" ? De : -De;
      }
      return 0;
    })), f;
  });
  let h = null;
  function y() {
    if (typeof document > "u") return null;
    h || (h = document.createElement("canvas"));
    const f = h.getContext("2d");
    return f && (f.font = Et()), f;
  }
  const O = ue(() => Y.value.some((f) => f.colDef.wrap)), E = ue(() => {
    if (!O.value) return null;
    const f = y();
    if (!f) return null;
    const x = Y.value.filter((z) => z.colDef.wrap), b = n.rowHeight();
    return te.value.map((z) => {
      let W = 1;
      for (const K of x) {
        const ee = En(f, le(K, z), Math.max(20, K.width - 16));
        ee.length > W && (W = ee.length);
      }
      return fi(W, b);
    });
  }), G = ue(
    () => E.value ? rn(E.value, te.value.length) : null
  ), U = ue(
    () => G.value ? G.value[te.value.length] : te.value.length * n.rowHeight()
  ), V = ue(() => {
    const f = a.value.length * n.rowHeight();
    return Math.max(0, w.value - Te - f);
  }), Q = ue(() => Math.max(0, U.value - V.value)), ce = ue(() => Math.max(1, Math.floor(V.value / n.rowHeight()))), me = ue(() => {
    const f = te.value.length;
    if (f === 0) return 0;
    const x = G.value ? Ft(G.value, m.value) : Math.floor(m.value / n.rowHeight());
    return Math.min(f - 1, x);
  }), ye = ue(() => {
    const f = te.value.length;
    return f === 0 ? 0 : G.value ? Math.min(f - 1, Ft(G.value, m.value + V.value - 1)) : Math.min(f - 1, me.value + ce.value - 1);
  }), Se = ue(() => {
    const f = R.value.filter((W) => W.colDef.aggFunc != null);
    if (f.length === 0) return null;
    const x = te.value, b = {};
    for (const W of f) {
      const K = x.map((re) => Z(re, W)), ee = di(K, W.colDef.aggFunc);
      if (ee == null) {
        b[W.colId] = "";
        continue;
      }
      b[W.colId] = W.colDef.aggValueFormatter ? W.colDef.aggValueFormatter(ee) : String(ee);
    }
    const z = f[0].colId;
    return b[z] === "" && (b[z] = "Σ"), b;
  });
  ne(te, () => {
    m.value = 0, P.value = null;
  }), ne($, () => {
    g.value = Math.min(g.value, $.value);
  }), ne(Q, () => {
    m.value = Math.min(m.value, Q.value);
  }), ne(
    [te, () => a.value, Y, m, D, P],
    () => Pe(() => i.redraw())
  ), ne(P, (f) => {
    if (!f) return;
    const x = te.value[f.row], b = Y.value[f.col];
    x && b && e("cell-selected", { data: x, row: f.row, col: f.col, colId: b.colId });
  });
  function B(f, x, b, z) {
    k.value = b, L.value = z, d.value = f, w.value = x, g.value = Math.max(0, Math.min($.value, g.value)), m.value = Math.max(0, Math.min(Q.value, m.value));
  }
  function N(f) {
    const x = G.value, b = x ? x[f] : f * n.rowHeight(), z = x ? x[f + 1] : b + n.rowHeight();
    b < m.value ? m.value = b : z > m.value + V.value && (m.value = Math.min(Q.value, z - V.value));
  }
  function se(f) {
    var W;
    if (!d.value) return;
    let x = 0;
    for (let K = 0; K < f; K++) x += Y.value[K].width;
    const b = ((W = Y.value[f]) == null ? void 0 : W.width) ?? 0, z = x - g.value;
    z < 0 ? g.value = Math.max(0, x) : z + b > d.value && (g.value = Math.min($.value, x + b - d.value));
  }
  function ge() {
    m.value = Math.max(0, m.value - V.value), i.redraw();
  }
  function pe() {
    m.value = Math.min(Q.value, m.value + V.value), i.redraw();
  }
  let Re = !1, He = "", Ae = 0, Ne = 0, Ye = 1, ze = !1, A = !1, oe = 0, de = 0, Ge = 0, Ie = 0, Ke = !1;
  function ot(f, x, b = 1) {
    var z;
    Re = !0, He = f, Ae = x, Ye = b, Ne = ((z = Y.value.find((W) => W.colId === f)) == null ? void 0 : z.width) ?? 100, ze = !1;
  }
  function mt(f, x) {
    A = !0, Ke = !1, oe = f, de = x, Ge = g.value, Ie = m.value;
  }
  function at(f, x) {
    const b = oe - f, z = de - x;
    (Math.abs(b) > 4 || Math.abs(z) > 4) && (Ke = !0), g.value = Math.max(0, Math.min($.value, Ge + b)), m.value = Math.max(0, Math.min(Q.value, Ie + z)), i.redraw();
  }
  function T() {
    A && (Ke && (ze = !0), A = !1);
  }
  function q(f, x) {
    if (A) {
      at(f, x);
      return;
    }
    if (!Re) return;
    const b = d.value, z = Math.max(30, Ne + (f - Ae) * Ye), W = R.value.filter((ee) => ee.colId !== He).reduce((ee, re) => ee + re.width, 0), K = b - z;
    K > 10 && (s[He] = Math.max(10, Math.round(z * W / K))), i.redraw();
  }
  function fe() {
    T(), Re && (Re = !1, ze = !0, e("column-resized"));
  }
  function Fe(f, x) {
    return wi(
      f,
      x,
      Y.value,
      te.value.length,
      n.rowHeight(),
      m.value,
      w.value,
      a.value.length,
      g.value,
      Se.value !== null,
      E.value ?? void 0
    );
  }
  let _e = 0;
  function Ve(f, x, b) {
    S.value = null;
    const z = Date.now();
    if (f !== 0) {
      _e = z, g.value = Math.max(0, Math.min($.value, g.value + f)), i.redraw();
      return;
    }
    if (b && x !== 0) {
      _e = z, g.value = Math.max(0, Math.min($.value, g.value + x)), i.redraw();
      return;
    }
    z - _e < Ci || (m.value = Math.max(0, Math.min(Q.value, m.value + x)), i.redraw());
  }
  function $e(f) {
    if (f.cx < 0)
      return D.value = -1, i.redraw(), null;
    if (S.value && H) {
      const z = Rt(f.cx, f.cy, H, f.hitScale);
      if (z !== "outside")
        return D.value = -1, i.redraw(), z === "clear" ? "pointer" : "text";
    }
    const x = Fe(f.cx, f.cy);
    D.value = x.area === "body" ? x.rowIdx : -1;
    let b;
    if (x.area === "header" && x.colIdx >= 0) {
      const z = Y.value[x.colIdx], W = Kt(x.colIdx, Y.value), K = f.cx + g.value;
      b = z && yn(K, W, z.width, f.hitScale) ? "col-resize" : "pointer";
    } else x.area === "body" ? b = "pointer" : b = "default";
    return i.redraw(), b;
  }
  function gt() {
    D.value = -1, i.redraw();
  }
  function rt(f, x, b) {
    if (f.cx < 0 || S.value && H && Rt(f.cx, f.cy, H, f.hitScale) !== "outside") return;
    if (f.cy >= Te) {
      mt(x, b);
      return;
    }
    const z = f.cx + g.value;
    for (let W = 0; W < Y.value.length; W++) {
      const K = Y.value[W], ee = Kt(W, Y.value);
      if (K.colDef.resizable !== !1 && yn(z, ee, K.width, f.hitScale)) {
        ot(K.colId, x, f.hitScale);
        return;
      }
    }
  }
  function $n(f, x) {
    var W, K, ee;
    const b = { stopPropagation: !1 };
    if (ze)
      return ze = !1, b;
    if (Re) return b;
    if (f.cx < 0)
      return S.value = null, b;
    if (S.value && H) {
      const re = Rt(f.cx, f.cy, H, f.hitScale);
      if (re === "clear")
        return hn(), b;
      if (re !== "outside")
        return (W = i.focusFilterInput) == null || W.call(i), b;
      S.value = null;
    }
    const z = Fe(f.cx, f.cy);
    if (z.area === "header" && z.colIdx >= 0) {
      const re = Y.value[z.colIdx], Ee = Kt(z.colIdx, Y.value), De = f.cx + g.value;
      if (re.colDef.filter && pi(De, Ee, re.width, f.hitScale))
        b.stopPropagation = !0, S.value === re.colId ? S.value = null : (S.value = re.colId, p.value = (K = r[re.colId]) != null && K.startsWith("__eq__") ? r[re.colId].slice(6) : r[re.colId] ?? "", M.value = Math.max(0, Ee - g.value));
      else if (re.colDef.sortable !== !1) {
        S.value = null;
        const st = c.value.find((Oe) => Oe.colId === re.colId), ct = st ? st.dir === "asc" ? "desc" : null : "asc";
        x.shiftKey ? c.value = st ? ct ? c.value.map((Oe) => Oe.colId === re.colId ? { colId: Oe.colId, dir: ct } : Oe) : c.value.filter((Oe) => Oe.colId !== re.colId) : [...c.value, { colId: re.colId, dir: "asc" }] : c.value = ct ? [{ colId: re.colId, dir: ct }] : [], e("sort-changed");
      }
      return b;
    }
    if (S.value = null, z.area === "body" && z.rowIdx >= 0 && z.colIdx >= 0) {
      const re = z.rowIdx;
      x.shiftKey && P.value ? (I.value || (I.value = { ...P.value }), P.value = { row: re, col: z.colIdx }) : (P.value = { row: re, col: z.colIdx }, I.value = { row: re, col: z.colIdx }), (ee = i.focusCanvas) == null || ee.call(i);
      const Ee = te.value[re], De = Y.value[z.colIdx];
      Ee && De && (e("row-clicked", { data: Ee, event: x }), e("cell-selected", { data: Ee, row: re, col: z.colIdx, colId: De.colId }));
    }
    return b;
  }
  function On(f) {
    S.value && (f && H && f.cx >= 0 && Rt(f.cx, f.cy, H, f.hitScale) !== "outside" || (S.value = null));
  }
  function Un(f) {
    const b = Y.value.length - 1, z = te.value.length - 1;
    if (!P.value) {
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(f.key) && (f.preventDefault(), P.value = { row: me.value, col: 0 }, I.value = { row: me.value, col: 0 });
      return;
    }
    let { row: W, col: K } = P.value;
    const ee = (re, Ee, De = !1) => {
      W = Math.max(0, Math.min(z, re)), K = Math.max(0, Math.min(b, Ee)), P.value = { row: W, col: K }, De || (I.value = { row: W, col: K }), N(W), se(K);
    };
    switch (f.key) {
      case "ArrowDown":
        f.preventDefault(), ee(W + 1, K, f.shiftKey);
        break;
      case "ArrowUp":
        f.preventDefault(), ee(W - 1, K, f.shiftKey);
        break;
      case "ArrowRight":
        f.preventDefault(), f.shiftKey ? ee(W, K + 1, !0) : K < b ? ee(W, K + 1) : ee(W + 1, 0);
        break;
      case "ArrowLeft":
        f.preventDefault(), f.shiftKey ? ee(W, K - 1, !0) : K > 0 ? ee(W, K - 1) : ee(W - 1, b);
        break;
      case "Tab":
        f.preventDefault(), f.shiftKey ? K > 0 ? ee(W, K - 1) : ee(W - 1, b) : K < b ? ee(W, K + 1) : ee(W + 1, 0);
        break;
      case "Enter":
        f.preventDefault(), f.shiftKey ? ee(W - 1, K) : ee(W + 1, K);
        break;
      case "Home":
        f.preventDefault(), f.ctrlKey || f.metaKey ? ee(0, 0, f.shiftKey) : ee(W, 0, f.shiftKey);
        break;
      case "End":
        f.preventDefault(), f.ctrlKey || f.metaKey ? ee(z, b, f.shiftKey) : ee(W, b, f.shiftKey);
        break;
      case "PageDown":
        f.preventDefault(), ee(Math.min(z, W + ce.value), K, f.shiftKey);
        break;
      case "PageUp":
        f.preventDefault(), ee(Math.max(0, W - ce.value), K, f.shiftKey);
        break;
      case "Escape":
        P.value = null, I.value = null;
        break;
      case "c":
      case "C":
        (f.ctrlKey || f.metaKey) && (f.preventDefault(), Xn());
        break;
    }
  }
  function Xn() {
    var De;
    if (!P.value) return;
    const f = Y.value, x = te.value, b = I.value ?? P.value, z = Math.min(b.row, P.value.row), W = Math.max(b.row, P.value.row), K = Math.min(b.col, P.value.col), ee = Math.max(b.col, P.value.col), re = [];
    for (let st = z; st <= W; st++) {
      const ct = x[st];
      if (!ct) continue;
      const Oe = [];
      for (let Ot = K; Ot <= ee; Ot++) {
        const gn = f[Ot];
        gn && Oe.push(le(gn, ct).replace(/[\t\r\n]+/g, " "));
      }
      re.push(Oe.join("	"));
    }
    const Ee = re.join(`
`);
    (De = navigator.clipboard) == null || De.writeText(Ee).catch(() => {
    });
  }
  function Nn(f) {
    p.value = f, f ? r[S.value] = f : delete r[S.value], e("filter-changed");
  }
  function hn() {
    S.value && delete r[S.value], p.value = "", S.value = null, e("filter-changed");
  }
  function Gn() {
    S.value = null;
  }
  function Kn(f, x) {
    if (!S.value || !f.width) return;
    const b = f.getContext("2d");
    if (!b) return;
    b.setTransform(x, 0, 0, x, 0, 0), H = vi(f.width / x, M.value, !!p.value);
    const z = yt[n.theme()] ?? yt.none;
    mi(b, H, p.value, F.value, z);
  }
  function qn(f, { dpr: x, glow: b }) {
    var z, W, K, ee;
    hi(f, {
      cols: Y.value,
      rows: te.value,
      pinnedRows: a.value,
      rowHeight: n.rowHeight(),
      // Per-row variable heights for `wrap` columns.
      rowHeights: E.value ?? void 0,
      scrollY: m.value,
      scrollX: g.value,
      theme: n.theme(),
      glow: b,
      sorts: c.value,
      colFilters: r,
      hoveredRow: D.value,
      selectedRow: ((z = P.value) == null ? void 0 : z.row) ?? -1,
      selectedCol: ((W = P.value) == null ? void 0 : W.col) ?? -1,
      selectionAnchorRow: ((K = I.value) == null ? void 0 : K.row) ?? -1,
      selectionAnchorCol: ((ee = I.value) == null ? void 0 : ee.col) ?? -1,
      formatCell: le,
      getCellStyle: ae,
      aggregateRow: Se.value,
      dpr: x
    }), Kn(f, x);
  }
  const jn = {
    setGridOption(f, x) {
      f === "rowData" ? l.value = x : f === "pinnedBottomRowData" ? a.value = x : f === "quickFilterText" && (o.value = x);
    },
    getColumnState() {
      return n.columnDefs().map((f) => {
        var b;
        const x = _(f);
        return {
          colId: x,
          hide: u.has(x),
          sort: ((b = c.value.find((z) => z.colId === x)) == null ? void 0 : b.dir) ?? null,
          sortIndex: c.value.some((z) => z.colId === x) ? c.value.findIndex((z) => z.colId === x) : null,
          width: s[x] ?? f.width
        };
      });
    },
    applyColumnState({ state: f }) {
      const x = f.filter((b) => b.sort).sort((b, z) => (b.sortIndex ?? 0) - (z.sortIndex ?? 0));
      x.length && (c.value = x.map((b) => ({ colId: b.colId, dir: b.sort })));
      for (const b of f)
        b.hide === !0 && u.add(b.colId), b.hide === !1 && u.delete(b.colId), b.width && (s[b.colId] = b.width);
    },
    setFilterModel(f) {
      for (const x of Object.keys(r)) delete r[x];
      if (f)
        for (const [x, b] of Object.entries(f))
          (b == null ? void 0 : b.type) === "equals" ? r[x] = `__eq__${b.filter}` : b != null && b.filter && (r[x] = b.filter);
    },
    getFilterModel() {
      const f = {};
      for (const [x, b] of Object.entries(r))
        b && (f[x] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
      return f;
    },
    async setColumnFilterModel(f, x) {
      x ? x.type === "equals" ? r[f] = `__eq__${x.filter}` : r[f] = x.filter ?? "" : delete r[f];
    },
    onFilterChanged() {
    },
    refreshCells() {
      v.value++;
    },
    exportDataAsCsv({ fileName: f = "export.csv" } = {}) {
      const x = R.value, b = x.map((ee) => ee.colDef.headerName ?? ee.colId).join(","), z = te.value.map(
        (ee) => x.map((re) => `"${String(le(re, ee)).replace(/"/g, '""')}"`).join(",")
      ), W = new Blob([[b, ...z].join(`
`)], { type: "text/csv" }), K = URL.createObjectURL(W);
      Object.assign(document.createElement("a"), { href: K, download: f }).click(), URL.revokeObjectURL(K);
    },
    resize() {
      var f;
      (f = i.resize) == null || f.call(i);
    },
    resetColumnState() {
      u.clear();
      for (const f of n.columnDefs())
        f.hide && u.add(_(f));
      c.value = ie();
      for (const f of Object.keys(s)) delete s[f];
      for (const f of Object.keys(r)) delete r[f];
      o.value = "", m.value = 0, P.value = null, S.value = null;
    }
  };
  function Zn() {
    var f, x;
    for (const b of n.columnDefs())
      b.hide && u.add(_(b));
    c.value.length || (c.value = ie()), l.value = ((f = n.rowData) == null ? void 0 : f.call(n)) ?? [], a.value = ((x = n.pinnedBottomRowData) == null ? void 0 : x.call(n)) ?? [];
  }
  function Qn() {
    J && (clearInterval(J), J = null), t.stop();
  }
  return {
    // reactive state / derived
    scrollX: g,
    scrollY: m,
    maxScrollX: $,
    maxScrollY: Q,
    filteredRows: te,
    displayCols: Y,
    resolvedCols: R,
    aggregateRow: Se,
    rowHeights: E,
    firstVisibleRow: me,
    lastVisibleRow: ye,
    visibleRowCount: ce,
    selectedCell: P,
    selectionAnchor: I,
    hoveredRow: D,
    activeFilter: S,
    filterPopupValue: p,
    caretOn: F,
    canvasW: d,
    canvasH: w,
    screenW: k,
    screenH: L,
    sortState: c,
    colFilters: r,
    // helpers
    formatCell: le,
    getCellValue: Z,
    hit: Fe,
    get resizing() {
      return Re;
    },
    get panning() {
      return A;
    },
    // viewport + scrolling
    setViewport: B,
    pageUp: ge,
    pageDown: pe,
    ensureRowVisible: N,
    ensureColVisible: se,
    // input (canvas space)
    wheel: Ve,
    hover: $e,
    leave: gt,
    pointerDown: rt,
    click: $n,
    docClick: On,
    keyDown: Un,
    panStart: mt,
    panMove: at,
    panEnd: T,
    globalMove: q,
    globalUp: fe,
    // filter popup
    setFilterText: Nn,
    clearFilter: hn,
    closeFilter: Gn,
    // paint / api / lifecycle
    paint: qn,
    api: jn,
    init: Zn,
    dispose: Qn
  };
}
const Li = ["value"], Ri = ["disabled"], Ii = ["disabled"], Di = 28, Ei = /* @__PURE__ */ Je({
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
    const e = n, i = t, l = X(null), a = _n({
      columnDefs: () => e.columnDefs,
      defaultColDef: () => e.defaultColDef,
      rowData: () => e.rowData,
      pinnedBottomRowData: () => e.pinnedBottomRowData,
      rowHeight: () => e.rowHeight,
      theme: () => e.theme,
      emit: i,
      host: {
        redraw: () => Z(),
        resize: () => $(),
        focusCanvas: () => {
          var A;
          return (A = I.value) == null ? void 0 : A.focus();
        },
        focusFilterInput: () => {
          var A;
          return (A = l.value) == null ? void 0 : A.focus();
        },
        blurFilterInput: () => {
          var A;
          return (A = l.value) == null ? void 0 : A.blur();
        }
      }
    }), {
      scrollY: o,
      maxScrollY: c,
      filteredRows: r,
      displayCols: s,
      selectedCell: u,
      firstVisibleRow: v,
      lastVisibleRow: d,
      activeFilter: w,
      filterPopupValue: k,
      formatCell: L,
      pageUp: m,
      pageDown: g,
      clearFilter: D
    } = a, P = X(null), I = X(null), S = Ct("cathodeResetTick", X(0));
    ne(S, () => pe());
    let p = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), M = null, H = !1;
    function F() {
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
    const R = new $t({
      paint: (A, { dpr: oe, glow: de }) => a.paint(A, { dpr: oe, glow: de })
    });
    function Y() {
      if (!(!I.value || !P.value)) {
        try {
          M = new C.WebGLRenderer({ canvas: I.value, antialias: !1, alpha: !0 });
        } catch {
          H = !0;
        }
        if (!H && !M.getContext() && (M.dispose(), M = null, H = !0), H) {
          $();
          return;
        }
        M.setPixelRatio(1), M.setClearColor(0, 0), J = new C.Scene(), _ = new C.OrthographicCamera(-1, 1, 1, -1, 0, 1), J.add(new C.Mesh(new C.PlaneGeometry(2, 2), R.material)), $();
      }
    }
    function $() {
      if (!P.value || !M && !H) return;
      const A = P.value.clientWidth, oe = P.value.clientHeight - (e.pagination ? Di : 0);
      if (!A || !oe) return;
      const de = e.bendField ? Math.round(A * An(e.curvature)) : A;
      R.resize(de, oe), R.setScreenSize(A, oe), p = R.dpr, a.setViewport(de, oe, A, oe), M ? (M.setPixelRatio(p), M.setSize(A, oe)) : I.value && (I.value.width = Math.round(A * p), I.value.height = Math.round(oe * p), I.value.style.width = A + "px", I.value.style.height = oe + "px"), Z();
    }
    function Z() {
      if (!R.canvas.width) return;
      if (H) {
        if (!I.value) return;
        R.paintOnly(!1);
        const oe = R.canvas, de = I.value.getContext("2d");
        de && de.drawImage(oe, 0, 0, oe.width, oe.height, 0, 0, I.value.width, I.value.height);
        return;
      }
      if (!M) return;
      const A = e.theme === "paper";
      R.setLook({
        curvature: e.curvature,
        scanlines: e.scanlines && !A,
        vignette: !A,
        magnify: e.magnify
      }), R.syncUniforms(), R.paint(e.glow), M.render(J, _);
    }
    function le(A, oe) {
      if (!I.value) return [-1, -1];
      const de = I.value.getBoundingClientRect(), Ge = A - de.left, Ie = oe - de.top, Ke = de.width, ot = de.height, mt = Ze(e.curvature), [at, T] = Pn(Ge, Ie, Ke, ot, mt, R.canvas.width / p || Ke, R.canvas.height / p || ot);
      return at < 0 ? [-1, -1] : [at, T];
    }
    function ae(A) {
      return le(A.clientX, A.clientY);
    }
    function ie(A) {
      if (!I.value) return 1;
      const [oe] = le(A.clientX - 4, A.clientY), [de] = le(A.clientX + 4, A.clientY);
      return oe < 0 || de < 0 ? 1 : Math.max(1, Math.abs(de - oe) / 8);
    }
    function te(A) {
      const [oe, de] = ae(A);
      return { cx: oe, cy: de, hitScale: ie(A) };
    }
    function h(A) {
      a.wheel(A.deltaX, A.deltaY, A.shiftKey);
    }
    function y(A) {
      if (a.resizing) return;
      e.magnify && I.value && R.setLens(kt(A, I.value));
      const oe = a.hover(te(A));
      oe && I.value && (I.value.style.cursor = oe);
    }
    function O() {
      R.setLens(null), a.leave();
    }
    function E(A) {
      a.pointerDown(te(A), A.clientX, A.clientY);
    }
    function G(A) {
      a.click(te(A), A).stopPropagation && A.stopPropagation();
    }
    function U(A) {
      w.value && a.docClick(A.target === I.value ? te(A) : null);
    }
    function V(A) {
      a.globalMove(A.clientX, A.clientY);
    }
    function Q() {
      a.globalUp();
    }
    function ce(A) {
      A.touches.length === 1 && a.panStart(A.touches[0].clientX, A.touches[0].clientY);
    }
    function me(A) {
      !a.panning || A.touches.length !== 1 || (A.preventDefault(), a.panMove(A.touches[0].clientX, A.touches[0].clientY));
    }
    function ye() {
      a.panEnd();
    }
    function Se(A) {
      a.keyDown(A);
    }
    function B(A) {
      a.setFilterText(A.target.value);
    }
    ne(() => e.theme, () => Z()), ne(() => [e.curvature, e.bendField], () => Pe($)), ne(() => e.scanlines, () => Z()), ne(() => e.glow, () => Z()), ne(() => e.magnify, (A) => {
      A || R.setLens(null), Z();
    });
    let N = null, se = null, ge = 0;
    function pe() {
      cancelAnimationFrame(ge), ge = requestAnimationFrame($);
    }
    function Re(A) {
      A.preventDefault();
    }
    function He() {
      M == null || M.dispose(), M = null, H = !1, Y();
    }
    Xe(() => {
      a.init(), document.addEventListener("click", U), document.addEventListener("mousemove", V), document.addEventListener("mouseup", Q), Pe(() => {
        var A;
        Y(), I.value && (I.value.addEventListener("webglcontextlost", Re), I.value.addEventListener("webglcontextrestored", He)), P.value && (N = new ResizeObserver(() => $()), N.observe(P.value), se = new IntersectionObserver((oe) => {
          oe.some((de) => de.isIntersecting) && pe();
        }), se.observe(P.value)), window.addEventListener("resize", pe), (A = window.visualViewport) == null || A.addEventListener("resize", pe), i("grid-ready", { api: a.api });
      });
    }), et(() => {
      var A, oe, de;
      document.removeEventListener("click", U), document.removeEventListener("mousemove", V), document.removeEventListener("mouseup", Q), (A = I.value) == null || A.removeEventListener("webglcontextlost", Re), (oe = I.value) == null || oe.removeEventListener("webglcontextrestored", He), N == null || N.disconnect(), se == null || se.disconnect(), window.removeEventListener("resize", pe), (de = window.visualViewport) == null || de.removeEventListener("resize", pe), cancelAnimationFrame(ge), F(), R.dispose(), a.dispose();
    });
    const Ae = ue(() => yt[e.theme] ?? yt.none), Ne = ue(() => ({
      background: Ae.value.headerBg,
      borderTop: `1px solid ${Ae.value.border}`,
      color: Ae.value.text
    })), Ye = ue(() => ({
      background: Ae.value.bg
    })), ze = ue(() => Ae.value.accent);
    return (A, oe) => {
      var de, Ge;
      return be(), Me("div", {
        ref_key: "wrapEl",
        ref: P,
        class: "cathode-wrap",
        style: qe(Ye.value)
      }, [
        he("canvas", {
          ref_key: "canvasEl",
          ref: I,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ut(h, ["prevent"]),
          onMousemove: y,
          onMouseleave: O,
          onMousedown: E,
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
          ref: l,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: ve(k),
          autofocus: "",
          onInput: B,
          onKeydown: [
            oe[0] || (oe[0] = pn(
              //@ts-ignore
              (...Ie) => ve(D) && ve(D)(...Ie),
              ["escape"]
            )),
            oe[1] || (oe[1] = pn((Ie) => ve(a).closeFilter(), ["enter"]))
          ]
        }, null, 40, Li)) : je("", !0),
        n.pagination ? (be(), Me("div", {
          key: 1,
          class: "cathode-pagination",
          style: qe(Ne.value)
        }, [
          he("button", {
            disabled: ve(o) <= 0,
            onClick: oe[2] || (oe[2] = (Ie) => ve(m)())
          }, "◀", 8, Ri),
          he("span", null, Ue((ve(v) + 1).toLocaleString()) + "–" + Ue(Math.min(ve(r).length, ve(d) + 1).toLocaleString()) + " / " + Ue(ve(r).length.toLocaleString()), 1),
          he("button", {
            disabled: ve(o) >= ve(c),
            onClick: oe[3] || (oe[3] = (Ie) => ve(g)())
          }, "▶", 8, Ii),
          he("span", {
            class: "cathode-page-info",
            style: qe({ color: ze.value })
          }, Ue(ve(r).length.toLocaleString()) + " rows ", 5),
          ve(u) ? (be(), Me("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: qe({ color: ze.value })
          }, Ue(((de = ve(s)[ve(u).col]) == null ? void 0 : de.colDef.headerName) ?? ((Ge = ve(s)[ve(u).col]) == null ? void 0 : Ge.colId)) + " : " + Ue(ve(L)(ve(s)[ve(u).col], ve(r)[ve(u).row])), 5)) : je("", !0)
        ], 4)) : je("", !0)
      ], 4);
    };
  }
}), tt = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [i, l] of t)
    e[i] = l;
  return e;
}, Nl = /* @__PURE__ */ tt(Ei, [["__scopeId", "data-v-3f5baab2"]]), Pt = {
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
function Fi(n, t) {
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
const Pi = 12, ke = 18, Tt = 10, ht = 6, sn = `${Pi}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Ai(n, t, e) {
  if (e <= 0 || !t) return [t];
  const i = [];
  for (const l of t.split(`
`)) {
    if (!l) {
      i.push("");
      continue;
    }
    if (n.measureText(l).width <= e) {
      i.push(l);
      continue;
    }
    const a = l.split(/(\s+)/);
    let o = "";
    for (const c of a) {
      const r = o + c;
      if (n.measureText(r).width <= e)
        o = r;
      else if (o && (i.push(o.replace(/\s+$/, "")), o = ""), n.measureText(c).width > e) {
        let s = "";
        for (const u of c)
          n.measureText(s + u).width > e ? (s && i.push(s), s = u) : s += u;
        o = s;
      } else
        o = c.replace(/^\s+/, "");
    }
    o && i.push(o.replace(/\s+$/, ""));
  }
  return i.length ? i : [""];
}
function Bn(n) {
  if (typeof n == "number") {
    const t = new Date(n), e = String(t.getHours()).padStart(2, "0"), i = String(t.getMinutes()).padStart(2, "0"), l = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${i}:${l}`;
  }
  return n;
}
function zi(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function _i(n) {
  const { entries: t, ctx: e, textMaxWidth: i, showTimestamps: l, wordWrap: a } = n, o = n.formatTs ?? Bn;
  e.font = sn;
  const c = [];
  for (let r = 0; r < t.length; r++) {
    const s = t[r], u = s.level ?? "info", v = l && s.ts != null ? o(s.ts) : "", d = a ? Ai(e, s.text, i) : s.text.split(`
`);
    for (let w = 0; w < d.length; w++)
      c.push({
        entryIdx: r,
        text: d[w],
        level: u,
        timestamp: w === 0 ? v : "",
        isFirstFrag: w === 0,
        widthPx: e.measureText(d[w]).width
      });
  }
  return c;
}
function xn(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const i = n.width, l = n.height, a = Pt[t.theme] ?? Pt.none;
  e.clearRect(0, 0, i, l), e.fillStyle = a.bg, e.fillRect(0, 0, i, l), e.save(), e.beginPath(), e.rect(0, 0, i, l), e.clip(), e.font = sn, e.textBaseline = "middle";
  const o = t.visualLines, c = Tt - t.scrollX, r = (t.showTimestamps ? Tt + t.timestampWidth : Tt) - t.scrollX, s = Math.max(0, Math.floor((t.scrollY - ht) / ke)), u = Math.min(o.length, Math.ceil((t.scrollY + l - ht) / ke) + 1);
  for (let v = s; v < u; v++) {
    const d = o[v], w = ht + v * ke - t.scrollY + ke / 2;
    if (d.entryIdx % 2 === 1 && d.isFirstFrag) {
      e.fillStyle = a.rowAlt;
      let L = 1;
      for (; v + L < u && o[v + L].entryIdx === d.entryIdx; ) L++;
      e.fillRect(0, w - ke / 2, i, ke * L);
    }
    t.selectionStart >= 0 && v >= t.selectionStart && v <= t.selectionEnd && (e.fillStyle = a.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, w - ke / 2, i, ke)), v === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, w - ke / 2, i, ke)), t.showTimestamps && d.timestamp && (e.fillStyle = a.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = a.timestamp), e.fillText(d.timestamp, c, w), e.shadowBlur = 0);
    const k = Fi(a, d.level);
    e.fillStyle = k, e.textAlign = "left", t.glow ? (e.shadowColor = k, e.shadowBlur = 14, e.fillText(d.text, r, w), e.shadowBlur = 7, e.fillText(d.text, r, w), e.shadowBlur = 3, e.fillText(d.text, r, w), e.shadowBlur = 0) : e.fillText(d.text, r, w);
  }
  e.restore();
}
function bn(n, t, e) {
  if (n < 0) return -1;
  const i = Math.floor((n + t - ht) / ke);
  return i < 0 || i >= e ? -1 : i;
}
function Bi(n) {
  return ht * 2 + n * ke;
}
const Wi = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Hi = /* @__PURE__ */ Je({
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
    const e = n, i = X(null), l = X(null), a = { ...Ce }, o = X(0), c = X(0), r = X(0), s = X(-1), u = X(!0), v = X(-1), d = X(-1), w = ue(() => {
      const T = e.entries ?? [];
      return e.maxLines > 0 && T.length > e.maxLines ? T.slice(T.length - e.maxLines) : T;
    }), k = ue(() => {
      if (!e.showTimestamps) return "";
      const T = e.formatTs ?? Bn;
      let q = "00:00:00";
      for (const fe of w.value) {
        if (fe.ts == null) continue;
        const Fe = T(fe.ts);
        Fe.length > q.length && (q = Fe);
      }
      return q;
    }), L = X(0), m = X([]);
    function g() {
      if (!$) return;
      const T = $.getContext("2d");
      if (!T) return;
      T.font = sn;
      const q = e.showTimestamps ? zi(T, k.value) : 0;
      L.value = q;
      const fe = Math.max(
        1,
        o.value - Tt * 2 - q
      );
      m.value = _i({
        entries: w.value,
        ctx: T,
        textMaxWidth: fe,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const D = ue(() => Bi(m.value.length)), P = ue(() => Math.max(0, D.value - c.value)), I = ue(() => {
      let T = 0;
      for (const q of m.value) q.widthPx > T && (T = q.widthPx);
      return Tt * 2 + L.value + T;
    }), S = ue(() => Math.max(0, I.value - o.value)), p = X(0);
    ne(P, () => {
      u.value ? r.value = P.value : r.value = Math.min(r.value, P.value);
    }), ne(S, () => {
      p.value = Math.min(p.value, S.value);
    }), ne(
      [w, o, () => e.showTimestamps, () => e.wordWrap, k],
      () => {
        g(), Pe(ie);
      },
      { deep: !1 }
    );
    let M = null, H = !1;
    function F() {
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
    let J, _, R, Y, $;
    const Z = `
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

    ${Ht}

    gl_FragColor = color;
  }
`;
    function le() {
      if (!(!l.value || !i.value)) {
        $ = document.createElement("canvas");
        try {
          M = new C.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          H = !0;
        }
        if (!H && !M.getContext() && (M.dispose(), M = null, H = !0), H) {
          ae();
          return;
        }
        M.setPixelRatio(1), M.setClearColor(0, 0), J = new C.Scene(), _ = new C.OrthographicCamera(-1, 1, 1, -1, 0, 1), Y = new C.CanvasTexture($), Y.minFilter = C.LinearFilter, Y.magFilter = C.LinearFilter, R = new C.ShaderMaterial({
          uniforms: {
            uTex: { value: Y },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: Wi,
          fragmentShader: Z,
          transparent: !0
        }), J.add(new C.Mesh(new C.PlaneGeometry(2, 2), R)), ae();
      }
    }
    function ae() {
      if (!i.value || !M && !H) return;
      const T = i.value.clientWidth, q = i.value.clientHeight;
      if (!T || !q) return;
      const fe = $.width !== T || $.height !== q;
      fe && ($.width = T, $.height = q, o.value = T, c.value = q, g(), M ? (fe && Y && (Y.dispose(), Y = new C.CanvasTexture($), Y.minFilter = C.LinearFilter, Y.magFilter = C.LinearFilter, R && (R.uniforms.uTex.value = Y)), M.setPixelRatio(window.devicePixelRatio || 1), M.setSize(T, q)) : l.value && (l.value.width = T, l.value.height = q, l.value.style.width = T + "px", l.value.style.height = q + "px"), u.value && (r.value = Math.max(0, D.value - c.value)), ie());
    }
    function ie() {
      if (!($ != null && $.width)) return;
      if (H) {
        if (!l.value) return;
        xn($, {
          visualLines: m.value,
          scrollY: r.value,
          scrollX: p.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: L.value,
          hoveredLine: s.value,
          selectionStart: Math.min(v.value, d.value),
          selectionEnd: Math.max(v.value, d.value)
        });
        const q = l.value.getContext("2d");
        q && q.drawImage($, 0, 0);
        return;
      }
      if (!M || !R || !Y) return;
      const T = e.theme === "paper";
      R.uniforms.uStrength.value = Ze(e.curvature), R.uniforms.uScanlines.value = e.scanlines && !T ? 1 : 0, R.uniforms.uVignette.value = T ? 0 : 1, Vt(R, e.magnify, a, $.width, $.height), xn($, {
        visualLines: m.value,
        scrollY: r.value,
        scrollX: p.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: L.value,
        hoveredLine: s.value,
        selectionStart: Math.min(v.value, d.value),
        selectionEnd: Math.max(v.value, d.value)
      }), Y.needsUpdate = !0, M.render(J, _);
    }
    ne(() => e.theme, () => ie()), ne(() => e.curvature, () => ie()), ne(() => e.scanlines, () => ie()), ne(() => e.glow, () => ie()), ne(() => e.magnify, (T) => {
      T || (a.x = Ce.x, a.y = Ce.y), ie();
    }), ne(r, () => ie()), ne(p, () => ie()), ne(s, () => ie()), ne([v, d], () => ie());
    function te(T) {
      if (!l.value) return [-1, -1];
      const q = l.value.getBoundingClientRect();
      return [T.clientX - q.left, T.clientY - q.top];
    }
    function h(T) {
      r.value = Math.max(0, Math.min(P.value, T)), u.value = r.value >= P.value - 4;
    }
    function y(T) {
      p.value = Math.max(0, Math.min(S.value, T));
    }
    function O(T) {
      T.shiftKey ? y(p.value + T.deltaY) : Math.abs(T.deltaX) > Math.abs(T.deltaY) ? y(p.value + T.deltaX) : h(r.value + T.deltaY);
    }
    let E = !1, G = 0, U = 0, V = 0, Q = 0, ce = !1;
    function me(T) {
      E = !0, ce = !1, G = T.clientX, U = T.clientY, V = p.value, Q = r.value, i.value && i.value.focus();
    }
    function ye(T) {
      if (E) {
        const q = G - T.clientX, fe = U - T.clientY;
        (Math.abs(q) > 4 || Math.abs(fe) > 4) && (ce = !0), y(V + q), h(Q + fe);
      }
    }
    function Se() {
      E && (E = !1, ce && (ce = !1));
    }
    function B(T) {
      if (T.touches.length !== 1) return;
      const q = T.touches[0];
      E = !0, ce = !1, G = q.clientX, U = q.clientY, V = p.value, Q = r.value, i.value && i.value.focus();
    }
    function N(T) {
      if (!E || T.touches.length !== 1) return;
      T.preventDefault();
      const q = T.touches[0], fe = G - q.clientX, Fe = U - q.clientY;
      (Math.abs(fe) > 4 || Math.abs(Fe) > 4) && (ce = !0), y(V + fe), h(Q + Fe);
    }
    function se() {
      E && (E = !1, ce && (ce = !1));
    }
    function ge(T) {
      const [, q] = te(T);
      return q < 0 ? -1 : bn(q, r.value, m.value.length);
    }
    function pe(T) {
      if (ce) {
        ce = !1;
        return;
      }
      const q = ge(T);
      if (q < 0) {
        v.value = -1, d.value = -1;
        return;
      }
      T.shiftKey && v.value >= 0 || (v.value = q), d.value = q;
    }
    function Re(T, q) {
      const fe = m.value.length;
      if (fe === 0) return;
      const Fe = d.value < 0 ? 0 : d.value;
      let _e = Math.max(0, Math.min(fe - 1, Fe + T));
      d.value = _e, (!q || v.value < 0) && (v.value = _e), s.value = _e;
      const Ve = ht + _e * ke, $e = Ve + ke;
      Ve < r.value ? h(Ve) : $e > r.value + c.value && h($e - c.value);
    }
    function He() {
      const T = Math.min(v.value, d.value), q = Math.max(v.value, d.value);
      if (T < 0) return "";
      const fe = m.value, Fe = /* @__PURE__ */ new Set(), _e = [];
      for (let Ve = T; Ve <= q && Ve < fe.length; Ve++) {
        const $e = fe[Ve];
        if (Fe.has($e.entryIdx)) continue;
        Fe.add($e.entryIdx);
        let gt = "";
        for (let rt = 0; rt < fe.length; rt++)
          fe[rt].entryIdx === $e.entryIdx && (gt += (gt && !fe[rt].isFirstFrag ? " " : "") + fe[rt].text);
        _e.push($e.timestamp ? `${$e.timestamp}  ${gt}` : gt);
      }
      return _e.join(`
`);
    }
    async function Ae() {
      const T = He();
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
        v.value >= 0 && (T.preventDefault(), Ae());
        return;
      }
      if ((T.metaKey || T.ctrlKey) && (T.key === "a" || T.key === "A")) {
        T.preventDefault(), v.value = 0, d.value = m.value.length - 1;
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
          T.preventDefault(), h(r.value + c.value);
          break;
        case "PageUp":
          T.preventDefault(), h(r.value - c.value);
          break;
        case "Home":
          T.preventDefault(), h(0), y(0);
          break;
        case "End":
          T.preventDefault(), h(P.value);
          break;
        case "Escape":
          v.value = -1, d.value = -1;
          break;
      }
    }
    function Ye(T) {
      if (e.magnify && l.value) {
        const fe = kt(T, l.value);
        a.x = fe.x, a.y = fe.y, ie();
      }
      const [, q] = te(T);
      if (q < 0) {
        s.value = -1;
        return;
      }
      s.value = bn(q, r.value, m.value.length);
    }
    function ze() {
      s.value = -1, a.x = Ce.x, a.y = Ce.y, ie();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, r.value = P.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(T) {
        h(ht + T * ke);
      }
    });
    let A = null, oe = null, de = 0;
    const Ge = Ct("cathodeResetTick", X(0));
    ne(Ge, () => Ie());
    function Ie() {
      cancelAnimationFrame(de), de = requestAnimationFrame(ae);
    }
    function Ke(T) {
      T.preventDefault();
    }
    function ot() {
      M == null || M.dispose(), M = null, H = !1, le();
    }
    Xe(() => {
      document.addEventListener("mousemove", ye), document.addEventListener("mouseup", Se), Pe(() => {
        var T;
        le(), l.value && (l.value.addEventListener("webglcontextlost", Ke), l.value.addEventListener("webglcontextrestored", ot)), i.value && (A = new ResizeObserver(() => ae()), A.observe(i.value), oe = new IntersectionObserver((q) => {
          q.some((fe) => fe.isIntersecting) && Ie();
        }), oe.observe(i.value)), window.addEventListener("resize", Ie), (T = window.visualViewport) == null || T.addEventListener("resize", Ie), r.value = P.value;
      });
    }), et(() => {
      var T, q, fe;
      document.removeEventListener("mousemove", ye), document.removeEventListener("mouseup", Se), (T = l.value) == null || T.removeEventListener("webglcontextlost", Ke), (q = l.value) == null || q.removeEventListener("webglcontextrestored", ot), A == null || A.disconnect(), oe == null || oe.disconnect(), window.removeEventListener("resize", Ie), (fe = window.visualViewport) == null || fe.removeEventListener("resize", Ie), cancelAnimationFrame(de), F();
    });
    const mt = ue(() => Pt[e.theme] ?? Pt.none), at = ue(() => ({
      background: mt.value.bg
    }));
    return (T, q) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-log-wrap",
      style: qe(at.value),
      tabindex: "0",
      onKeydown: Ne
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-log-canvas",
        onWheel: ut(O, ["prevent"]),
        onMousemove: Ye,
        onMouseleave: ze,
        onMousedown: me,
        onClick: pe,
        onTouchstartPassive: B,
        onTouchmove: N,
        onTouchend: se,
        onTouchcancel: se
      }, null, 544)
    ], 36));
  }
}), Yi = /* @__PURE__ */ tt(Hi, [["__scopeId", "data-v-d6dc9e79"]]), Vi = ["disabled"], $i = /* @__PURE__ */ Je({
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
    const i = n, l = e, a = X(null), o = X(null), c = X(""), r = X([]), s = X(-1);
    let u = "";
    function v(S) {
      S.trim() && (r.value.length && r.value[r.value.length - 1] === S || (r.value.push(S), r.value.length > i.historyLimit && r.value.splice(0, r.value.length - i.historyLimit)));
    }
    function d(S) {
      if (!i.disabled) {
        if (S.key === "Enter") {
          S.preventDefault();
          const p = c.value;
          p.trim() && v(p), s.value = -1, c.value = "", l("submit", p);
          return;
        }
        if (S.key === "ArrowUp") {
          if (!r.value.length) return;
          S.preventDefault(), s.value === -1 ? (u = c.value, s.value = r.value.length - 1) : s.value > 0 && s.value--, c.value = r.value[s.value];
          return;
        }
        if (S.key === "ArrowDown") {
          if (s.value === -1) return;
          S.preventDefault(), s.value < r.value.length - 1 ? (s.value++, c.value = r.value[s.value]) : (s.value = -1, c.value = u, u = "");
          return;
        }
      }
    }
    const w = X(!0);
    let k = null;
    function L() {
      k || (k = setInterval(() => {
        w.value = !w.value;
      }, 530));
    }
    function m() {
      k && (clearInterval(k), k = null), w.value = !0;
    }
    const g = ue(() => {
      let S;
      return i.disabled ? S = " " : i.busy ? S = "█" : S = w.value ? "█" : " ", { level: "info", text: `${i.prompt}${c.value}${S}` };
    }), D = ue(
      () => [...i.entries, g.value]
    );
    function P() {
      var S;
      i.disabled || (S = o.value) == null || S.focus();
    }
    ne(() => i.busy, (S, p) => {
      p && !S && !i.disabled && Pe(() => {
        var M;
        return (M = o.value) == null ? void 0 : M.focus();
      });
    });
    function I() {
      var S;
      (S = o.value) == null || S.focus();
    }
    return t({ focus: I }), Xe(() => {
      L(), i.disabled || requestAnimationFrame(() => {
        var S;
        return (S = o.value) == null ? void 0 : S.focus();
      });
    }), et(() => {
      m();
    }), (S, p) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-terminal-wrap",
      onClick: P
    }, [
      Rn(Yi, {
        entries: D.value,
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
      In(he("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": p[0] || (p[0] = (M) => c.value = M),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: d
      }, null, 40, Vi), [
        [ni, c.value]
      ])
    ], 512));
  }
}), Gl = /* @__PURE__ */ tt($i, [["__scopeId", "data-v-a2b39934"]]), xt = {
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
}, Oi = 0.18, bt = 8, cn = 22, Ui = 4, We = 8, it = 56, un = 42, Qe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Xi = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", qt = 4, Ni = 1, Gi = 1;
function Ki(n, t, e, i = 0, l = !1) {
  const a = l ? un : it, o = Math.max(0, t - We - a), c = Math.max(1, Math.floor(o / e)), r = Math.min(c, n);
  return { firstIdx: Math.max(0, n - r - Math.floor(i / e)), count: r, slotW: e };
}
function qi(n, t, e) {
  if (!n.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let i = 1 / 0, l = -1 / 0, a = 0;
  const o = Math.min(n.length, t + e);
  for (let r = t; r < o; r++) {
    const s = n[r];
    s && (s.low < i && (i = s.low), s.high > l && (l = s.high), s.volume > a && (a = s.volume));
  }
  if (!isFinite(i) || !isFinite(l) || i === l) {
    const r = isFinite(i) ? i : 0;
    return { min: r - 1, max: r + 1, maxVol: Math.max(1, a) };
  }
  const c = (l - i) * 0.04;
  return { min: i - c, max: l + c, maxVol: Math.max(1, a) };
}
function ji(n, t, e = !1) {
  const i = e ? Ui : cn, l = Math.max(1, n - bt - i - qt), a = Math.max(0, Math.round(l * t)), o = l - a;
  return {
    priceY0: bt,
    priceY1: bt + o,
    volumeY0: bt + o + qt,
    volumeY1: bt + o + qt + a
  };
}
function Be(n, t, e, i) {
  const l = t.max - t.min;
  return l <= 0 ? (e + i) / 2 : e + (1 - (n - t.min) / l) * (i - e);
}
function lt(n, t, e) {
  return We + (n - t + 0.5) * e;
}
function nt(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function fn(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0"), l = String(t.getHours()).padStart(2, "0"), a = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${i} ${l}:${a}`;
}
function Zi(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), i = Math.pow(10, Math.floor(Math.log10(e))), l = e / i;
  let a;
  return l < 1.5 ? a = 1 : l < 3 ? a = 2 : l < 7 ? a = 5 : a = 10, a * i;
}
function ln(n, t) {
  var k, L, m, g, D;
  const e = n.getContext("2d");
  if (!e) return;
  const i = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(i, 0, 0, i, 0, 0);
  const l = n.width / i, a = n.height / i, o = xt[t.theme] ?? xt.none, c = t.colors ? { ...o, ...t.colors } : o, r = !!t.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = c.bg, e.fillRect(0, 0, l, a), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const s = Ki(t.candles.length, l, t.slotW, t.scrollX, r), u = qi(t.candles, s.firstIdx, s.count), v = ji(a, t.showVolume ? t.volumeFraction : 0, r), d = Math.max(Ni, Math.floor(t.slotW * 0.7)), w = Math.min(t.candles.length, s.firstIdx + s.count);
  for (let P = s.firstIdx; P < w; P++) {
    const I = t.candles[P];
    if (!I) continue;
    const S = lt(P, s.firstIdx, t.slotW), p = Be(I.open, u, v.priceY0, v.priceY1), M = Be(I.close, u, v.priceY0, v.priceY1), H = Be(I.high, u, v.priceY0, v.priceY1), F = Be(I.low, u, v.priceY0, v.priceY1), J = I.close >= I.open, _ = J ? c.wickBull : c.wickBear, R = J ? c.candleBull : c.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = R), e.strokeStyle = _, e.lineWidth = Gi, e.beginPath(), e.moveTo(Math.round(S) + 0.5, H), e.lineTo(Math.round(S) + 0.5, F), e.stroke(), e.fillStyle = R;
    const Y = Math.min(p, M), $ = Math.max(1, Math.abs(M - p)), Z = Math.round(S - d / 2), le = Math.round(Y), ae = Math.round($);
    if (e.fillRect(Z, le, d, ae), t.glow && (e.shadowBlur = 4, e.fillRect(Z, le, d, ae)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const ie = Math.round(I.volume / u.maxVol * (v.volumeY1 - v.volumeY0));
      ie > 0 && (e.fillStyle = J ? c.volumeBull : c.volumeBear, e.fillRect(
        Math.round(S - d / 2),
        v.volumeY1 - ie,
        d,
        ie
      ));
    }
  }
  if ((k = t.overlays) != null && k.length) {
    const P = { above: 0, below: 0 }, I = t.overlays.filter((p) => p.kind !== "hline" && !!p.label).length, S = I ? 14 + 14 * I + 12 : 8;
    for (const p of t.overlays)
      p.kind === "hline" ? Ji(e, p, l, u, v, c, r, P, S) : Qi(e, p, s, u, v, t.slotW);
  }
  (L = t.markers) != null && L.length && rl(e, c, t.markers, t.candles, s, u, v, t.slotW), sl(e, c, u, v, l, r), r || (cl(e, c, t.candles, s, t.slotW, a), ol(e, c, t.candles, l, a)), (m = t.overlays) != null && m.length && tl(e, c, t.overlays, v), t.hover && (ul(e, c, t.candles, s, u, v, t.slotW, t.hover, l), nl(e, c, t.candles, s, t.slotW, t.hover, v, ((g = t.overlays) == null ? void 0 : g.length) ?? 0), (D = t.markers) != null && D.length && ll(e, c, t.markers, t.candles, s, u, v, t.slotW, t.hover, l)), e.restore();
}
function Qi(n, t, e, i, l, a) {
  var c;
  const o = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    We,
    l.priceY0,
    /* width: */
    999999,
    l.priceY1 - l.priceY0
  ), n.clip(), t.kind === "line")
    It(n, t.data, e.firstIdx, o, a, i, l, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const r = Wn(t.color, t.fillAlpha ?? 0.08);
    el(n, t.upper, t.lower, e.firstIdx, o, a, i, l, r), It(n, t.upper, e.firstIdx, o, a, i, l, t.color, 1, !1), It(n, t.lower, e.firstIdx, o, a, i, l, t.color, 1, !1), (c = t.middle) != null && c.length && It(n, t.middle, e.firstIdx, o, a, i, l, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function Ji(n, t, e, i, l, a, o, c = { above: 0, below: 0 }, r = 8) {
  const s = Be(t.price, i, l.priceY0, l.priceY1), u = s < l.priceY0 - 0.5, v = s > l.priceY1 + 0.5, d = u || v, w = d ? u ? c.above++ : c.below++ : 0, k = d ? u ? l.priceY0 + r + w * 20 : l.priceY1 - 8 - w * 20 : s, L = o ? un : it, m = Math.round(k) + 0.5;
  n.save(), d || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo(We, m), n.lineTo(e - L, m), n.stroke(), n.setLineDash([]));
  let g = t.label ?? nt(t.price);
  if (d && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    n.font = Qe, n.textBaseline = "middle", n.textAlign = "left";
    const D = n.measureText(g).width, P = 4, I = 2, S = We + 2;
    n.fillStyle = t.color, d && (n.globalAlpha = 0.85), n.fillRect(S, k - 7 - I, D + P * 2, 14 + I * 2), n.globalAlpha = 1, n.fillStyle = a.bg && !a.bg.startsWith("rgba(0,0,0,0)") ? a.bg : "#0d1520", n.fillText(g, S + P, k);
  }
  n.restore();
}
function It(n, t, e, i, l, a, o, c, r, s) {
  if (!t || !t.length) return;
  n.strokeStyle = c, n.lineWidth = r, n.setLineDash(s ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let v = e; v < i; v++) {
    const d = t[v];
    if (typeof d != "number" || !isFinite(d)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const w = lt(v, e, l), k = Be(d, a, o.priceY0, o.priceY1);
    u ? n.lineTo(w, k) : (n.moveTo(w, k), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function el(n, t, e, i, l, a, o, c, r) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = r;
  let s = !1, u = -1;
  for (let v = i; v <= l; v++) {
    const d = t[v], w = e[v], k = v < l && typeof d == "number" && typeof w == "number" && isFinite(d) && isFinite(w);
    if (k && !s && (u = v, s = !0), !k && s || v === l && s) {
      const L = k ? v + 1 : v;
      n.beginPath();
      for (let m = u; m < L; m++) {
        const g = lt(m, i, a), D = Be(t[m], o, c.priceY0, c.priceY1);
        m === u ? n.moveTo(g, D) : n.lineTo(g, D);
      }
      for (let m = L - 1; m >= u; m--) {
        const g = lt(m, i, a), D = Be(e[m], o, c.priceY0, c.priceY1);
        n.lineTo(g, D);
      }
      n.closePath(), n.fill(), s = !1;
    }
  }
}
function Wn(n, t) {
  const e = Math.max(0, Math.min(1, t));
  if (n.startsWith("#") && n.length === 7) {
    const i = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), a = parseInt(n.slice(5, 7), 16);
    return `rgba(${i},${l},${a},${e})`;
  }
  return n.startsWith("rgba") ? n.replace(/[\d.]+\)$/, `${e})`) : n.startsWith("rgb(") ? n.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : n;
}
function tl(n, t, e, i) {
  const l = e.filter((L) => L.kind !== "hline" && !!L.label);
  if (!l.length) return;
  n.save(), n.font = Qe;
  const a = 8, o = 5, c = 12, r = 6, s = 14;
  let u = 0;
  for (const L of l) {
    const m = n.measureText(L.label).width;
    m > u && (u = m);
  }
  const v = a * 2 + c + r + u, d = o * 2 + s * l.length, w = We + 4, k = i.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(w, k, v, d), n.textBaseline = "middle", n.textAlign = "left";
  for (let L = 0; L < l.length; L++) {
    const m = l[L], g = k + o + s * (L + 0.5), D = w + a;
    m.kind === "line" ? (n.strokeStyle = m.color, n.lineWidth = m.lineWidth ?? 1, n.setLineDash(m.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(D, g), n.lineTo(D + c, g), n.stroke(), n.setLineDash([])) : m.kind === "band" && (n.fillStyle = Wn(m.color, m.fillAlpha ?? 0.2), n.fillRect(D, g - 4, c, 8), n.strokeStyle = m.color, n.lineWidth = 1, n.strokeRect(D + 0.5, g - 4 + 0.5, c - 1, 7)), n.fillStyle = t.text, n.fillText(m.label, D + c + r, g);
  }
  n.restore();
}
function nl(n, t, e, i, l, a, o, c) {
  const r = Math.floor((a.x - We) / l), s = i.firstIdx + r;
  if (s < 0 || s >= e.length) return;
  const u = e[s];
  if (!u) return;
  const v = u.close - u.open, d = u.open !== 0 ? v / u.open * 100 : 0, w = v >= 0 ? "+" : "", k = [
    ["O", nt(u.open), void 0],
    ["H", nt(u.high), void 0],
    ["L", nt(u.low), void 0],
    ["C", nt(u.close), void 0],
    ["V", il(u.volume), void 0],
    ["", `${w}${d.toFixed(2)}%`, v >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = Qe, n.textBaseline = "middle", n.textAlign = "left";
  const L = 8, m = 4, g = 14;
  let D = L;
  for (const [p, M] of k) {
    const H = p ? `${p} ${M}` : M, F = n.measureText(H).width + 12;
    D += F;
  }
  D += L - 12;
  const P = o.priceY0 + 4 + (c > 0 ? m * 2 + 14 * c + 4 : 0), I = We + 4;
  n.fillStyle = t.panelBg, n.fillRect(I, P, D, g + m * 2);
  let S = I + L;
  for (let p = 0; p < k.length; p++) {
    const [M, H, F] = k[p];
    n.fillStyle = t.text, M && (n.globalAlpha = 0.6, n.fillText(M + " ", S, P + m + g / 2), n.globalAlpha = 1, S += n.measureText(M + " ").width), F && (n.fillStyle = F), n.fillText(H, S, P + m + g / 2), S += n.measureText(H).width + 12;
  }
  n.restore();
}
function il(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function ll(n, t, e, i, l, a, o, c, r, s) {
  if (!i.length) return;
  const u = i.length > 1 ? i[1].start - i[0].start : 6e4, v = Math.max(1, u * 0.5), d = Math.min(i.length, l.firstIdx + l.count), w = 9;
  let k = null;
  for (const H of e) {
    let F = 0, J = i.length - 1, _ = -1;
    for (; F <= J; ) {
      const $ = F + J >> 1, Z = i[$].start - H.timestamp;
      if (Math.abs(Z) <= v) {
        _ = $;
        break;
      }
      Z < 0 ? F = $ + 1 : J = $ - 1;
    }
    if (_ < 0 || _ < l.firstIdx || _ >= d) continue;
    const R = lt(_, l.firstIdx, c), Y = Be(H.price, a, o.priceY0, o.priceY1);
    if (Math.abs(r.x - R) <= w && Math.abs(r.y - Y) <= w) {
      k = { m: H, x: R, y: Y };
      break;
    }
  }
  if (!k) return;
  const L = fn(k.m.timestamp), m = [
    `${k.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${L}`,
    `@ ${nt(k.m.price)}`
  ];
  k.m.label && m.push(k.m.label), n.save(), n.font = Qe, n.textBaseline = "top", n.textAlign = "left";
  const g = 6, D = 14;
  let P = 0;
  for (const H of m) {
    const F = n.measureText(H).width;
    F > P && (P = F);
  }
  const I = P + g * 2, S = m.length * D + g * 2;
  let p = k.x + 12;
  p + I > s - it && (p = k.x - 12 - I);
  let M = k.y - S / 2;
  M < o.priceY0 && (M = o.priceY0), M + S > o.priceY1 && (M = o.priceY1 - S), n.fillStyle = t.panelBgSolid, n.strokeStyle = k.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(p, M, I, S), n.strokeRect(p + 0.5, M + 0.5, I - 1, S - 1);
  for (let H = 0; H < m.length; H++) {
    const F = m[H];
    n.fillStyle = H === 0 ? k.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(F, p + g, M + g + H * D);
  }
  n.restore();
}
function ol(n, t, e, i, l) {
  if (e.length < 2) return;
  const a = e[1].start - e[0].start, o = al(a);
  if (!o) return;
  n.save(), n.font = Qe, n.textBaseline = "top", n.textAlign = "right";
  const c = 6, r = 3, s = n.measureText(o).width, u = i - it - c, v = l - cn + 4;
  n.fillStyle = t.accent, n.fillRect(u - s - c, v - r, s + c * 2, 14 + r * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(o, u, v), n.restore();
}
function al(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, i = 60 * e, l = 24 * i, a = 7 * l;
  return n >= a && n % a === 0 ? n / a + "W" : n >= l && n % l === 0 ? n / l + "D" : n >= i && n % i === 0 ? n / i + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function rl(n, t, e, i, l, a, o, c) {
  if (!i.length) return;
  const r = i.length > 1 ? i[1].start - i[0].start : 6e4, s = Math.max(1, r * 0.5), u = Math.min(i.length, l.firstIdx + l.count), v = (w) => {
    let k = 0, L = i.length - 1;
    for (; k <= L; ) {
      const m = k + L >> 1, g = i[m].start - w;
      if (Math.abs(g) <= s) return m;
      g < 0 ? k = m + 1 : L = m - 1;
    }
    return -1;
  }, d = 7;
  for (const w of e) {
    const k = v(w.timestamp);
    if (k < 0 || k < l.firstIdx || k >= u) continue;
    const L = lt(k, l.firstIdx, c), m = Be(w.price, a, o.priceY0, o.priceY1);
    if (m < o.priceY0 || m > o.priceY1) continue;
    const g = w.color ?? (w.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = g, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), w.kind === "entry" ? (n.moveTo(L, m - d), n.lineTo(L - d, m + d - 1), n.lineTo(L + d, m + d - 1)) : (n.moveTo(L, m + d), n.lineTo(L - d, m - d + 1), n.lineTo(L + d, m - d + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function sl(n, t, e, i, l, a = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const c = i.priceY1 - i.priceY0, r = a ? Math.max(2, Math.min(4, Math.round(c / 36))) : 6, s = Zi(o, r), u = Math.ceil(e.min / s) * s, v = a ? un : it;
  n.font = a ? Xi : Qe, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let d = u; d <= e.max; d += s) {
    const w = Be(d, e, i.priceY0, i.priceY1);
    w < i.priceY0 || w > i.priceY1 || (n.beginPath(), n.moveTo(We, Math.round(w) + 0.5), n.lineTo(l - v, Math.round(w) + 0.5), n.stroke(), n.fillText(nt(d), l - v + 3, w));
  }
  n.globalAlpha = 1;
}
function cl(n, t, e, i, l, a) {
  if (i.count <= 0 || !e.length) return;
  const c = Math.max(1, Math.floor(i.count / 6));
  n.font = Qe, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const r = Math.min(e.length, i.firstIdx + i.count);
  for (let s = i.firstIdx; s < r; s += c) {
    const u = e[s];
    if (!u) continue;
    const v = lt(s, i.firstIdx, l);
    n.fillText(fn(u.start), v, a - cn + 4);
  }
  n.globalAlpha = 1;
}
function ul(n, t, e, i, l, a, o, c, r) {
  const s = Math.floor((c.x - We) / o), u = Math.max(0, Math.min(e.length - 1, i.firstIdx + s)), v = e[u];
  if (!v) return;
  const d = lt(u, i.firstIdx, o);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(d) + 0.5, a.priceY0), n.lineTo(Math.round(d) + 0.5, a.volumeY1 || a.priceY1), n.stroke();
  const w = Math.max(a.priceY0, Math.min(a.priceY1, c.y));
  n.beginPath(), n.moveTo(We, Math.round(w) + 0.5), n.lineTo(r - it, Math.round(w) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const k = l.max - l.min;
  if (k > 0) {
    const g = l.max - (w - a.priceY0) / (a.priceY1 - a.priceY0) * k, D = nt(g);
    n.font = Qe, n.textBaseline = "middle", n.textAlign = "left";
    const P = n.measureText(D).width, I = 4, S = 2;
    n.fillStyle = t.accent, n.fillRect(r - it + 2, w - 7 - S, P + I * 2, 14 + S * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(D, r - it + 2 + I, w);
  }
  n.font = Qe, n.textBaseline = "top", n.textAlign = "center";
  const L = fn(v.start), m = n.measureText(L).width;
  n.fillStyle = t.accent, n.fillRect(d - m / 2 - 4, a.volumeY1 + 2, m + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(L, d, a.volumeY1 + 4), n.restore();
}
const jt = 0.25, Zt = 6, fl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, dl = /* @__PURE__ */ Je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Oi },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(n) {
    const t = n, e = X(null), i = X(null), l = { ...Ce }, a = X(0), o = X(0), c = X(0), r = X(1), s = X(null), u = ue(() => Math.max(1, t.slotW * r.value));
    let v = null, d = !1;
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
    let k, L, m, g, D;
    const P = `
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

    ${Ht}

    gl_FragColor = color;
  }
`;
    function I() {
      if (!(!i.value || !e.value)) {
        if (D = document.createElement("canvas"), t.flat) {
          d = !0, S();
          return;
        }
        try {
          v = new C.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          d = !0;
        }
        if (!d && !v.getContext() && (v.dispose(), v = null, d = !0), d) {
          S();
          return;
        }
        v.setPixelRatio(1), v.setClearColor(0, 0), k = new C.Scene(), L = new C.OrthographicCamera(-1, 1, 1, -1, 0, 1), g = new C.CanvasTexture(D), g.minFilter = C.LinearFilter, g.magFilter = C.LinearFilter, m = new C.ShaderMaterial({
          uniforms: {
            uTex: { value: g },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: fl,
          fragmentShader: P,
          transparent: !0
        }), k.add(new C.Mesh(new C.PlaneGeometry(2, 2), m)), S();
      }
    }
    function S() {
      if (!e.value || !v && !d) return;
      const B = e.value.clientWidth, N = e.value.clientHeight;
      !B || !N || !(D.width !== B || D.height !== N) || (D.width = B, D.height = N, a.value = B, o.value = N, v ? (g && (g.dispose(), g = new C.CanvasTexture(D), g.minFilter = C.LinearFilter, g.magFilter = C.LinearFilter, m && (m.uniforms.uTex.value = g)), v.setPixelRatio(window.devicePixelRatio || 1), v.setSize(B, N)) : i.value && (i.value.width = B, i.value.height = N, i.value.style.width = B + "px", i.value.style.height = N + "px"), p());
    }
    function p() {
      if (!(D != null && D.width)) return;
      if (d) {
        if (!i.value) return;
        ln(D, {
          candles: t.candles,
          slotW: u.value,
          scrollX: c.value,
          theme: t.theme,
          glow: !1,
          showVolume: t.showVolume,
          volumeFraction: t.volumeFraction,
          hover: s.value,
          overlays: t.overlays,
          markers: t.markers,
          compact: t.compact,
          colors: t.colors
        });
        const N = i.value.getContext("2d");
        N && (N.clearRect(0, 0, i.value.width, i.value.height), N.drawImage(D, 0, 0));
        return;
      }
      if (!v || !m || !g) return;
      const B = t.theme === "paper";
      m.uniforms.uStrength.value = Ze(t.curvature), m.uniforms.uScanlines.value = t.scanlines && !B ? 1 : 0, m.uniforms.uVignette.value = B ? 0 : 1, Vt(m, t.magnify, l, D.width, D.height), ln(D, {
        candles: t.candles,
        slotW: u.value,
        scrollX: c.value,
        theme: t.theme,
        glow: t.glow,
        showVolume: t.showVolume,
        volumeFraction: t.volumeFraction,
        hover: s.value,
        overlays: t.overlays,
        markers: t.markers,
        compact: t.compact,
        colors: t.colors
      }), g.needsUpdate = !0, v.render(k, L);
    }
    ne(() => t.theme, () => p()), ne(() => t.curvature, () => p()), ne(() => t.scanlines, () => p()), ne(() => t.glow, () => p()), ne(() => t.showVolume, () => p()), ne(() => t.volumeFraction, () => p()), ne(() => t.slotW, () => p()), ne(() => t.candles, () => p(), { deep: !1 }), ne(() => t.overlays, () => p(), { deep: !1 }), ne(() => t.markers, () => p(), { deep: !1 }), ne(() => t.compact, () => p()), ne(() => t.magnify, (B) => {
      B || (l.x = Ce.x, l.y = Ce.y), p();
    }), ne(() => t.colors, () => p(), { deep: !0 }), ne(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), ne(c, () => p()), ne(r, () => p()), ne(s, () => p()), ne(u, () => p());
    let M = null, H = null, F = 0;
    const J = Ct("cathodeResetTick", X(0));
    ne(J, () => _());
    function _() {
      cancelAnimationFrame(F), F = requestAnimationFrame(S);
    }
    function R(B) {
      B.preventDefault();
    }
    function Y() {
      v == null || v.dispose(), v = null, d = !1, I();
    }
    function $(B) {
      if (!i.value) return [-1, -1];
      const N = i.value.getBoundingClientRect();
      return [B.clientX - N.left, B.clientY - N.top];
    }
    function Z(B) {
      var Re;
      const N = u.value;
      if (N <= 0) return 0;
      const se = ((Re = t.candles) == null ? void 0 : Re.length) ?? 0, ge = Math.max(1, Math.floor((a.value || 1) / N)), pe = Math.max(0, se - ge);
      return Math.max(0, Math.min(B, pe * N));
    }
    function le(B) {
      var ge;
      if (B.deltaX !== 0 || B.shiftKey && B.deltaY !== 0) {
        const pe = B.deltaX !== 0 ? B.deltaX : B.deltaY;
        c.value = Z(c.value + pe);
        return;
      }
      if (B.deltaY === 0) return;
      const [N] = $(B), se = u.value;
      if (N >= 0 && se > 0 && ((ge = t.candles) != null && ge.length)) {
        const pe = Math.max(1, Math.floor((a.value || 1) / se)), He = Math.max(0, t.candles.length - pe - Math.floor(c.value / se)) + (N - 8) / se, Ae = Math.exp(-B.deltaY * 15e-4), Ne = Math.max(jt, Math.min(Zt, r.value * Ae));
        r.value = Ne;
        const Ye = t.slotW * Ne, ze = Math.max(1, Math.floor((a.value || 1) / Ye)), A = He - (N - 8) / Ye, oe = Math.max(0, t.candles.length - ze - A);
        c.value = Z(oe * Ye);
      } else {
        const pe = Math.exp(-B.deltaY * 15e-4);
        r.value = Math.max(jt, Math.min(Zt, r.value * pe));
      }
    }
    let ae = !1, ie = 0, te = 0;
    function h(B) {
      B.button === 0 && (ae = !0, ie = B.clientX, te = c.value, s.value = null, e.value && e.value.focus());
    }
    function y(B) {
      const N = Math.exp(B * 0.18);
      r.value = Math.max(jt, Math.min(Zt, r.value * N)), c.value = Z(c.value);
    }
    function O(B) {
      const N = u.value, se = B.shiftKey ? 20 : 3;
      switch (B.key) {
        case "ArrowLeft":
          B.preventDefault(), c.value = Z(c.value + N * se);
          break;
        case "ArrowRight":
          B.preventDefault(), c.value = Z(c.value - N * se);
          break;
        case "ArrowUp":
          B.preventDefault(), y(1);
          break;
        case "ArrowDown":
          B.preventDefault(), y(-1);
          break;
        case "Home":
          B.preventDefault(), c.value = Z(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          B.preventDefault(), c.value = 0;
          break;
      }
    }
    function E(B) {
      if (ae) {
        const N = B.clientX - ie;
        c.value = Z(te + N);
        return;
      }
    }
    function G() {
      ae = !1;
    }
    function U(B) {
      if (B.touches.length !== 1) return;
      const N = B.touches[0];
      ae = !0, ie = N.clientX, te = c.value, s.value = null;
    }
    function V(B) {
      if (!ae || B.touches.length !== 1) return;
      B.preventDefault();
      const se = B.touches[0].clientX - ie;
      c.value = Z(te + se);
    }
    function Q() {
      ae = !1;
    }
    function ce(B) {
      if (t.magnify && i.value) {
        const ge = kt(B, i.value);
        l.x = ge.x, l.y = ge.y, p();
      }
      if (ae) return;
      const [N, se] = $(B);
      if (N < 0 || se < 0) {
        s.value = null;
        return;
      }
      s.value = { x: N, y: se };
    }
    function me() {
      s.value = null, l.x = Ce.x, l.y = Ce.y, p();
    }
    Xe(() => {
      document.addEventListener("mousemove", E), document.addEventListener("mouseup", G), Pe(() => {
        var B;
        I(), i.value && (i.value.addEventListener("webglcontextlost", R), i.value.addEventListener("webglcontextrestored", Y)), e.value && (M = new ResizeObserver(() => S()), M.observe(e.value), H = new IntersectionObserver((N) => {
          N.some((se) => se.isIntersecting) && _();
        }), H.observe(e.value)), window.addEventListener("resize", _), (B = window.visualViewport) == null || B.addEventListener("resize", _);
      });
    }), et(() => {
      var B, N, se;
      document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", G), (B = i.value) == null || B.removeEventListener("webglcontextlost", R), (N = i.value) == null || N.removeEventListener("webglcontextrestored", Y), M == null || M.disconnect(), H == null || H.disconnect(), window.removeEventListener("resize", _), (se = window.visualViewport) == null || se.removeEventListener("resize", _), cancelAnimationFrame(F), w();
    });
    const ye = ue(() => xt[t.theme] ?? xt.none), Se = ue(() => ({
      background: ye.value.bg
    }));
    return (B, N) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: qe(Se.value),
      tabindex: "0",
      onKeydown: O
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: i,
        class: "cathode-candle-canvas",
        onWheel: ut(le, ["prevent"]),
        onMousedown: h,
        onMousemove: ce,
        onMouseleave: me,
        onTouchstartPassive: U,
        onTouchmove: V,
        onTouchend: Q,
        onTouchcancel: Q
      }, null, 544)
    ], 36));
  }
}), Kl = /* @__PURE__ */ tt(dl, [["__scopeId", "data-v-7c334778"]]), pt = 22, Mt = 6, hl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, vl = /* @__PURE__ */ Je({
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
    const e = n, i = t, l = X(null), a = X(null), o = X(-1), c = X(0), r = { ...Ce };
    let s = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, v = !1;
    function d() {
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
    let w, k, L, m, g;
    const D = X(0), P = X(0), I = `
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
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${Ht}

    gl_FragColor = color;
  }
`;
    function S() {
      if (!(!a.value || !l.value)) {
        g = document.createElement("canvas");
        try {
          u = new C.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          v = !0;
        }
        if (!v && !u.getContext() && (u.dispose(), u = null, v = !0), v) {
          p();
          return;
        }
        u.setPixelRatio(s), u.setClearColor(0, 0), w = new C.Scene(), k = new C.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new C.CanvasTexture(g), m.minFilter = C.LinearFilter, m.magFilter = C.LinearFilter, L = new C.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: hl,
          fragmentShader: I,
          transparent: !0
        }), w.add(new C.Mesh(new C.PlaneGeometry(2, 2), L)), p();
      }
    }
    function p() {
      if (!l.value || !u && !v) return;
      const h = l.value.clientWidth, y = l.value.clientHeight;
      if (!h || !y) return;
      D.value = h, P.value = y, s = Math.min(window.devicePixelRatio || 1, 2);
      const O = e.bendField ? Math.round(h * An(e.curvature)) : h, E = Math.round(O * s), G = Math.round(y * s), U = g.width !== E || g.height !== G;
      g.width = E, g.height = G, u ? (U && m && (m.dispose(), m = new C.CanvasTexture(g), m.minFilter = C.LinearFilter, m.magFilter = C.LinearFilter, L.uniforms.uTex.value = m), u.setPixelRatio(s), u.setSize(h, y)) : a.value && (a.value.width = Math.round(h * s), a.value.height = Math.round(y * s), a.value.style.width = h + "px", a.value.style.height = y + "px"), R();
    }
    function M() {
      const h = (g == null ? void 0 : g.width) || 0, y = Math.max(1, Math.floor(h / e.minCellW)), O = Math.floor(h / y), E = Math.round(O * e.cellAspect), G = pt + E + Mt;
      return { rects: e.cells.map((V, Q) => ({
        x: Q % y * O,
        y: Math.floor(Q / y) * G - c.value,
        w: O,
        h: G
      })), rowH: G, totalH: Math.ceil(e.cells.length / y) * G, cols: y };
    }
    const H = () => {
      const { totalH: h } = M();
      return Math.max(0, h - ((g == null ? void 0 : g.height) || 0));
    }, F = /* @__PURE__ */ new Map();
    function J(h, y, O) {
      const E = h.candles[h.candles.length - 1], G = `${y}x${O}@${s}|${h.candles.length}|${E ? E.start + ":" + E.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, U = F.get(h.id);
      if (U && U.key === G) return U.canvas;
      const V = (U == null ? void 0 : U.canvas) ?? document.createElement("canvas");
      V.width = Math.round(y * s), V.height = Math.round(O * s);
      const Q = Math.max(1.5, Math.min(e.slotW, y / Math.max(1, h.candles.length))), ce = y < 260 && h.overlays ? h.overlays.map((me) => ({ ...me, label: "" })) : h.overlays;
      return ln(V, {
        candles: h.candles,
        slotW: Q,
        scrollX: Math.max(0, h.candles.length * Q - y),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: ce,
        compact: !0,
        colors: e.colors,
        dpr: s
      }), F.set(h.id, { canvas: V, key: G }), V;
    }
    const _ = ue(() => ({ ...xt[e.theme] ?? xt.none, ...e.colors ?? {} }));
    function R() {
      var E;
      if (!(g != null && g.width)) return;
      const h = g.getContext("2d");
      if (!h) return;
      const y = _.value;
      h.setTransform(1, 0, 0, 1, 0, 0), h.clearRect(0, 0, g.width, g.height), y.bg && y.bg !== "rgba(0,0,0,0)" && (h.fillStyle = y.bg, h.fillRect(0, 0, g.width, g.height)), h.setTransform(s, 0, 0, s, 0, 0);
      const { rects: O } = M();
      h.font = "600 11px ui-monospace, SFMono-Regular, monospace", h.textBaseline = "middle";
      for (let G = 0; G < e.cells.length; G++) {
        const U = e.cells[G], V = O[G];
        if (V.y + V.h < 0 || V.y > g.height / s) continue;
        const Q = V.x + Mt / 2, ce = V.w - Mt;
        h.strokeStyle = U.open ? y.candleBull : y.gridline, h.lineWidth = G === o.value ? 2 : 1, h.strokeRect(Q + 0.5, V.y + 0.5, ce - 1, V.h - Mt - 1), h.save(), h.beginPath(), h.rect(Q, V.y, ce, pt), h.clip();
        const me = V.y + pt / 2 + 1, ye = U.note ? h.measureText(U.note).width + (U.open ? 22 : 12) : U.open ? 16 : 0, Se = U.badge ? h.measureText(U.badge).width + 6 : 0, B = ce - 14 - Se - ye;
        let N = U.title;
        if (h.measureText(N).width > B) {
          for (; N.length > 1 && h.measureText(N + "…").width > B; ) N = N.slice(0, -1);
          N += "…";
        }
        let se = Q + 7;
        h.fillStyle = y.text, h.textAlign = "left", h.fillText(N, se, me), se += h.measureText(N).width + 6, U.badge && (h.fillStyle = y.accent, h.fillText(U.badge, se, me)), U.note && (h.textAlign = "right", h.fillStyle = U.noteColor || y.accent, h.fillText(U.note, Q + ce - (U.open ? 16 : 7), me), h.textAlign = "left"), h.restore(), U.open && (h.fillStyle = y.candleBull, h.beginPath(), h.arc(Q + ce - 9, V.y + pt / 2 + 1, 3, 0, Math.PI * 2), h.fill());
        const ge = V.y + pt, pe = V.h - pt - Mt;
        U.candles.length ? h.drawImage(J(U, ce - 2, pe - 1), Q + 1, ge, ce - 2, pe - 1) : (h.fillStyle = y.accent, h.textAlign = "center", h.fillText("· · ·", Q + ce / 2, ge + pe / 2), h.textAlign = "left");
      }
      if (v) {
        const G = (E = a.value) == null ? void 0 : E.getContext("2d");
        G && a.value && G.drawImage(g, 0, 0, g.width, g.height, 0, 0, a.value.width, a.value.height);
        return;
      }
      !u || !L || !m || (L.uniforms.uStrength.value = Ze(e.curvature), L.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, L.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Vt(L, e.magnify, r, D.value || g.width, P.value || g.height), m.needsUpdate = !0, u.render(w, k));
    }
    function Y(h) {
      if (!a.value) return [-1, -1];
      const y = a.value.getBoundingClientRect();
      return Pn(
        h.clientX - y.left,
        h.clientY - y.top,
        y.width,
        y.height,
        Ze(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((g == null ? void 0 : g.width) || y.width) / s,
        ((g == null ? void 0 : g.height) || y.height) / s
      );
    }
    function $(h, y) {
      if (h < 0) return -1;
      const { rects: O } = M();
      return O.findIndex((E) => h >= E.x && h < E.x + E.w && y >= E.y && y < E.y + E.h);
    }
    function Z(h) {
      const [y, O] = Y(h), E = $(y, O);
      E >= 0 && i("cell-click", e.cells[E].id);
    }
    function le(h) {
      if (e.magnify && a.value) {
        const G = kt(h, a.value);
        r.x = G.x, r.y = G.y;
      }
      const [y, O] = Y(h), E = $(y, O);
      E !== o.value ? (o.value = E, R()) : e.magnify && R(), a.value && (a.value.style.cursor = E >= 0 ? "pointer" : "default");
    }
    function ae() {
      o.value = -1, r.x = Ce.x, r.y = Ce.y, R();
    }
    function ie(h) {
      const y = H();
      y <= 0 || (h.preventDefault(), c.value = Math.max(0, Math.min(y, c.value + h.deltaY)), R());
    }
    let te = null;
    return Xe(() => {
      S(), te = new ResizeObserver(() => p()), l.value && te.observe(l.value);
    }), et(() => {
      te == null || te.disconnect(), d(), F.clear();
    }), ne(() => [e.curvature, e.bendField], () => Pe(p)), ne(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      c.value = Math.min(c.value, H()), R();
    }, { deep: !1 }), (h, y) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-candle-grid-wrap"
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: a,
        onClick: Z,
        onMousemove: le,
        onMouseleave: ae,
        onWheel: ie
      }, null, 544)
    ], 512));
  }
}), ql = /* @__PURE__ */ tt(vl, [["__scopeId", "data-v-9f2b24f8"]]), dn = X(0), on = 28, wt = 12;
let an = 10, At = "cathode.layout", zt = !1;
const Le = X({});
function ml(n, t = "cathode.layout") {
  if (!zt) {
    zt = !0, At = t;
    try {
      const e = localStorage.getItem(At);
      if (e) {
        Le.value = JSON.parse(e), Mn();
        return;
      }
    } catch {
    }
    Le.value = { ...n }, Mn();
  }
}
function Mn() {
  let n = 10;
  for (const t of Object.values(Le.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  an = n;
}
function vt() {
  localStorage.setItem(At, JSON.stringify(Le.value));
}
function gl(n) {
  zt = !1, localStorage.removeItem(At), Le.value = { ...n }, vt(), zt = !0, dn.value++;
}
function Hn(n) {
  an++, Le.value[n] && (Le.value[n].zIndex = an);
}
function pl(n, t) {
  Le.value[n].visible = t, vt();
}
function wl(n, t) {
  Le.value[n].minimized = t, t && (Le.value[n].maximized = !1), vt();
}
function yl(n, t) {
  Le.value[n].maximized = t, t && (Le.value[n].minimized = !1, Hn(n)), vt();
}
function xl(n, t, e) {
  Le.value[n].x = Math.round(t), Le.value[n].y = Math.round(e), vt();
}
function bl(n, t, e) {
  Le.value[n].w = Math.round(t), Le.value[n].h = Math.round(e), vt();
}
function jl(n, t, e) {
  const i = Math.ceil(Math.sqrt(e.length)), l = Math.ceil(e.length / i), a = Math.floor((n - wt * (i + 1)) / i), o = Math.floor((t - wt * (l + 1)) / l), c = {};
  return e.forEach((r, s) => {
    const u = s % i, v = Math.floor(s / i);
    c[r] = {
      x: wt + u * (a + wt),
      y: wt + v * (o + wt),
      w: a,
      h: o,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), c;
}
function Yn() {
  return {
    containers: Le,
    TITLEBAR_H: on,
    load: ml,
    save: vt,
    reset: gl,
    bringToFront: Hn,
    setVisible: pl,
    setMinimized: wl,
    setMaximized: yl,
    updatePos: xl,
    updateSize: bl
  };
}
const Ml = { class: "ws-toolbar" }, Sl = {
  key: 0,
  class: "ws-restore-menu"
}, Tl = {
  key: 0,
  class: "ws-restore-empty"
}, Cl = ["onClick"], kl = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: i, reset: l, setVisible: a } = Yn(), o = X(null);
    wn("cathodeWorkspace", o), wn("cathodeResetTick", dn), Xe(() => {
      if (!o.value) return;
      const { clientWidth: m, clientHeight: g } = o.value, D = t.initialLayout ?? {};
      i(D, t.storageKey ?? "cathode.layout");
      const P = Object.keys(e.value)[0];
      P && c(P);
    });
    function c(m) {
      var D;
      document.querySelectorAll(".cc").forEach((P) => P.classList.remove("cc-focused"));
      const g = (D = o.value) == null ? void 0 : D.querySelector(`#cc-${m}`);
      g && g.classList.add("cc-focused");
    }
    function r() {
      !o.value || !t.initialLayout || l(t.initialLayout);
    }
    function s(m) {
      const g = m.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = X(!1), v = () => Object.entries(e.value).filter(([, m]) => !m.visible).map(([m]) => m);
    function d(m) {
      a(m, !0), u.value = !1;
    }
    function w(m) {
      if (!u.value) return;
      const g = m.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function k(m) {
      m.key === "Escape" && (u.value = !1);
    }
    Xe(() => {
      document.addEventListener("click", w), document.addEventListener("keydown", k);
    }), et(() => {
      document.removeEventListener("click", w), document.removeEventListener("keydown", k);
    });
    function L(m) {
      var g;
      return ((g = t.containerTitles) == null ? void 0 : g[m]) ?? m;
    }
    return (m, g) => (be(), Me("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      en(m.$slots, "default", {}, void 0, !0),
      en(m.$slots, "overlay", {}, void 0, !0),
      he("div", Ml, [
        n.initialLayout ? (be(), Me("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: r
        }, " ↺ Reset Layout ")) : je("", !0),
        g[1] || (g[1] = he("div", { class: "ws-sep" }, null, -1)),
        he("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (D) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Rn(ii, { name: "menu" }, {
        default: li(() => [
          u.value ? (be(), Me("div", Sl, [
            g[3] || (g[3] = he("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            v().length ? je("", !0) : (be(), Me("div", Tl, " No closed panels ")),
            (be(!0), Me(oi, null, ai(v(), (D) => (be(), Me("div", {
              key: D,
              class: "ws-restore-item",
              onClick: (P) => d(D)
            }, [
              g[2] || (g[2] = he("span", { class: "ws-restore-icon" }, "⊞", -1)),
              ri(" " + Ue(L(D)), 1)
            ], 8, Cl))), 128))
          ])) : je("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Zl = /* @__PURE__ */ tt(kl, [["__scopeId", "data-v-5838d04b"]]), Ll = ["id"], Rl = { class: "cc-title" }, Il = {
  key: 0,
  class: "cc-size-badge"
}, Dl = { class: "cc-controls" }, El = ["title"], Fl = { class: "cc-body" }, Pl = 200, Al = 80, Sn = 60, zl = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: i, setVisible: l, setMinimized: a, setMaximized: o, updatePos: c, updateSize: r } = Yn(), s = Ct("cathodeWorkspace", X(null)), u = ue(() => e.value[t.id]), v = ue(() => {
      const h = u.value, y = t.curvature ?? 0;
      if (!h) return {};
      const O = { "--curvature": Math.abs(y) };
      return h.maximized ? { ...O, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: h.zIndex } : {
        ...O,
        left: h.x + "px",
        top: h.y + "px",
        width: h.w + "px",
        height: h.minimized ? on + "px" : h.h + "px",
        zIndex: h.zIndex,
        display: h.visible ? "flex" : "none"
      };
    });
    let d = !1, w = 0, k = 0;
    function L(h) {
      var E;
      if (h.target.closest(".cc-btn") || u.value.maximized) return;
      i(t.id), d = !0;
      const y = (E = s.value) == null ? void 0 : E.querySelector(`#cc-${t.id}`);
      if (!y) return;
      const O = y.getBoundingClientRect();
      w = h.clientX - O.left, k = h.clientY - O.top, document.addEventListener("mousemove", m), document.addEventListener("mouseup", g), h.preventDefault();
    }
    function m(h) {
      var U;
      if (!d || !s.value) return;
      const y = s.value.getBoundingClientRect(), O = ((U = u.value) == null ? void 0 : U.w) ?? 300;
      let E = h.clientX - y.left - w, G = h.clientY - y.top - k;
      E = Math.max(Sn - O, Math.min(y.width - Sn, E)), G = Math.max(0, Math.min(y.height - on, G)), c(t.id, E, G);
    }
    function g() {
      d = !1, document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", g);
    }
    let D = !1, P = 0, I = 0, S = 0, p = 0;
    const M = X("");
    function H(h) {
      u.value.maximized || (i(t.id), D = !0, P = h.clientX, I = h.clientY, S = u.value.w, p = u.value.h, document.addEventListener("mousemove", F), document.addEventListener("mouseup", J), h.preventDefault(), h.stopPropagation());
    }
    function F(h) {
      if (!D) return;
      const y = Math.max(Pl, S + (h.clientX - P)), O = Math.max(Al, p + (h.clientY - I));
      r(t.id, y, O), M.value = `${Math.round(y)}×${Math.round(O)}`;
    }
    function J() {
      D = !1, M.value = "", document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", J), _.value++;
    }
    const _ = X(0);
    ne(dn, () => {
      _.value++;
    }), et(() => {
      var h;
      document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", J), (h = R.value) == null || h.removeEventListener("scroll", $), Z();
    });
    const R = X(null);
    function Y(h) {
      if (t.canvas) return [];
      const y = h.children[0];
      return y ? Array.from(y.children) : [];
    }
    function $() {
      const h = R.value, y = t.curvature ?? 0;
      if (!h) return;
      const O = Y(h);
      if (!O.length) return;
      const E = h.clientHeight, G = E / 2, U = y * 38e-4;
      O.forEach((V) => {
        if (!V.dataset.origFs) {
          const ge = getComputedStyle(V);
          V.dataset.origFs = ge.fontSize, V.dataset.origLh = ge.lineHeight;
        }
        if (y === 0) {
          V.style.fontSize = "", V.style.lineHeight = "";
          return;
        }
        const Q = V.getBoundingClientRect(), ce = h.getBoundingClientRect(), me = Q.top - ce.top + Q.height / 2, ye = Math.min(1, Math.abs(me - G) / (E / 2)), Se = 1 + U * Math.cos(ye * Math.PI / 2), B = parseFloat(V.dataset.origFs), N = V.dataset.origLh, se = N === "normal" ? B * 1.4 : parseFloat(N);
        isNaN(B) || (V.style.fontSize = `${(B * Se).toFixed(2)}px`), isNaN(se) || (V.style.lineHeight = `${(se * Se).toFixed(2)}px`);
      });
    }
    function Z() {
      const h = R.value;
      h && Y(h).forEach((y) => {
        y.style.fontSize = "", y.style.lineHeight = "", delete y.dataset.origFs, delete y.dataset.origLh;
      });
    }
    ne(() => t.curvature, (h) => {
      (h ?? 0) === 0 ? Z() : $();
    }), Xe(() => {
      var h;
      (h = R.value) == null || h.addEventListener("scroll", $, { passive: !0 }), Pe($);
    });
    function le() {
      a(t.id, !u.value.minimized), Pe(() => {
        _.value++;
      });
    }
    function ae() {
      o(t.id, !u.value.maximized), Pe(() => {
        _.value++;
      });
    }
    function ie() {
      l(t.id, !1);
    }
    function te() {
      i(t.id);
    }
    return (h, y) => u.value && u.value.visible ? (be(), Me("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: si(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: qe(v.value),
      onMousedown: te
    }, [
      he("div", {
        class: "cc-titlebar",
        onMousedown: L
      }, [
        y[0] || (y[0] = he("span", { class: "cc-status-dot" }, null, -1)),
        he("span", Rl, Ue(n.title), 1),
        M.value ? (be(), Me("span", Il, Ue(M.value), 1)) : je("", !0),
        he("div", Dl, [
          he("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ut(le, ["stop"])
          }, "─"),
          he("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: ut(ae, ["stop"])
          }, Ue(u.value.maximized ? "⤡" : "⤢"), 9, El),
          he("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ut(ie, ["stop"])
          }, "✕")
        ])
      ], 32),
      In(he("div", Fl, [
        he("div", {
          ref_key: "bodyEl",
          ref: R,
          class: "cc-screen",
          onScroll: $
        }, [
          en(h.$slots, "default", { resizeKey: _.value }, void 0, !0),
          y[1] || (y[1] = he("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ci, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (be(), Me("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ut(H, ["stop"])
      }, null, 32)) : je("", !0)
    ], 46, Ll)) : je("", !0);
  }
}), Ql = /* @__PURE__ */ tt(zl, [["__scopeId", "data-v-ca0af4ca"]]), _l = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Bl = `
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
`, Wl = 100, Hl = /* @__PURE__ */ Je({
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
    }, i = X(null), l = X(null);
    let a = null, o = !1;
    function c() {
      if (a) {
        try {
          a.forceContextLoss();
        } catch {
        }
        try {
          a.dispose();
        } catch {
        }
        a = null;
      }
    }
    let r, s, u, v, d, w = null, k = 0;
    function L(p) {
      p - k >= Wl && (D(), k = p), w = requestAnimationFrame(L);
    }
    function m() {
      if (!i.value || !d) return;
      const p = i.value.clientWidth, M = i.value.clientHeight;
      p <= 0 || M <= 0 || d.width === p && d.height === M || (d.width = p, d.height = M, a && a.setSize(p, M, !1), l.value && (l.value.width = p, l.value.height = M, l.value.style.width = p + "px", l.value.style.height = M + "px"));
    }
    function g() {
      if (!(d != null && d.width)) return;
      const p = d.getContext("2d");
      if (!p) return;
      const M = d.width, H = d.height, F = e[t.theme] ?? e.none;
      p.clearRect(0, 0, M, H), p.fillStyle = F.bg, p.fillRect(0, 0, M, H);
      const J = Date.now(), _ = (J / 500 | 0) % 2 === 0, R = (J / 400 | 0) % 4;
      p.font = `bold ${Math.max(14, Math.min(M, H) * 0.06)}px monospace`, p.textAlign = "center", p.textBaseline = "middle", p.fillStyle = F.text, t.glow && (p.shadowColor = F.text, p.shadowBlur = 14);
      const Y = ".".repeat(R).padEnd(3, " "), $ = `${t.label}${Y}`;
      if (p.fillText($, M / 2, H / 2), p.shadowBlur = 0, _) {
        const Z = p.measureText($), le = p.measureText("M").width, ae = parseFloat(p.font), ie = M / 2 + Z.width / 2 + 4, te = H / 2 - ae / 2 + 2;
        p.fillStyle = F.cursor, t.glow && (p.shadowColor = F.cursor, p.shadowBlur = 12), p.fillRect(ie, te, le * 0.7, ae * 0.95), p.shadowBlur = 0;
      }
    }
    function D() {
      if (!d) return;
      if (g(), o) {
        if (!l.value) return;
        const M = l.value.getContext("2d");
        M && M.drawImage(d, 0, 0);
        return;
      }
      if (!a || !u || !v) return;
      const p = t.theme === "paper";
      u.uniforms.uStrength.value = Ze(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !p ? 1 : 0, u.uniforms.uVignette.value = p ? 0 : 1, v.needsUpdate = !0, a.render(r, s);
    }
    function P() {
      if (!(!l.value || !i.value)) {
        d = document.createElement("canvas");
        try {
          a = new C.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          o = !0;
        }
        if (!o && !a.getContext() && (a.dispose(), a = null, o = !0), o) {
          m();
          return;
        }
        a.setPixelRatio(1), a.setClearColor(0, 0), r = new C.Scene(), s = new C.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new C.CanvasTexture(d), v.minFilter = C.LinearFilter, v.magFilter = C.LinearFilter, u = new C.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: _l,
          fragmentShader: Bl,
          transparent: !0
        }), r.add(new C.Mesh(new C.PlaneGeometry(2, 2), u)), m();
      }
    }
    let I = null;
    Xe(() => {
      P(), D(), w = requestAnimationFrame(L), i.value && (I = new ResizeObserver(() => m()), I.observe(i.value));
    }), et(() => {
      w !== null && cancelAnimationFrame(w), I == null || I.disconnect(), c(), v == null || v.dispose(), u == null || u.dispose();
    }), ne(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => D());
    const S = ue(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (p, M) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-loader-wrap",
      style: qe(S.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), Jl = /* @__PURE__ */ tt(Hl, [["__scopeId", "data-v-d00e5f47"]]), _t = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, Tn = (n, t) => t === "left" ? n.left : t === "right" ? n.right : !t || t === "neutral" ? n.dim : t, xe = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", we = 12;
function Qt(n, t, e) {
  const i = [];
  for (const l of t.split(`
`)) {
    let a = "";
    for (const o of l.split(" ")) {
      const c = a ? `${a} ${o}` : o;
      a && n.measureText(c).width > e ? (i.push(a), a = o) : a = c;
    }
    i.push(a);
  }
  return i;
}
function St(n, t, e, i, l, a) {
  const o = Math.min(a, i / 2, l / 2);
  n.beginPath(), n.moveTo(t + o, e), n.lineTo(t + i - o, e), n.quadraticCurveTo(t + i, e, t + i, e + o), n.lineTo(t + i, e + l - o), n.quadraticCurveTo(t + i, e + l, t + i - o, e + l), n.lineTo(t + o, e + l), n.quadraticCurveTo(t, e + l, t, e + l - o), n.lineTo(t, e + o), n.quadraticCurveTo(t, e, t + o, e), n.closePath();
}
function Vn(n, t) {
  var M, H;
  const e = n.getContext("2d");
  if (!e) return 0;
  const i = t.dpr || 1, l = n.width / i, a = n.height / i, o = { ..._t[t.theme] ?? _t.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(i, 0, 0, i, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, l, a);
  const c = (F) => F > 0 ? o.right : F < 0 ? o.left : o.neutral, r = c(t.value), s = (F, J = 10) => {
    t.glow && (e.shadowColor = F, e.shadowBlur = J);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, v = Math.max(40, l - we * 2);
  let d = we;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const w = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${xe}`;
  const k = e.measureText(w).width;
  e.fillStyle = r, s(r, 14), e.fillText(w, we, d + 30), u();
  const L = we + k + 14;
  t.stance && (e.font = `700 14px ${xe}`, e.fillStyle = r, s(r, 8), e.fillText(t.stance.toUpperCase(), L, d + 15), u()), t.sub && (e.font = `11px ${xe}`, e.fillStyle = o.dim, e.fillText(t.sub, L, d + 31)), d += 48, e.font = `700 9px ${xe}`;
  const m = t.leftLabel.toUpperCase(), g = t.rightLabel.toUpperCase(), D = e.measureText(m).width, P = e.measureText(g).width, I = we + D + 8, S = l - we - P - 8, p = d + 10;
  if (e.fillStyle = o.left, e.fillText(m, we, p + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(g, l - we, p + 3), e.textAlign = "left", S - I > 24) {
    const F = e.createLinearGradient(I, 0, S, 0);
    F.addColorStop(0, o.left), F.addColorStop(0.45, o.surface), F.addColorStop(0.55, o.surface), F.addColorStop(1, o.right), St(e, I, p - 4, S - I, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = F, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const J = (I + S) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(J, p - 8), e.lineTo(J, p + 8), e.stroke();
    for (const Z of [0.25, 0.75]) {
      const le = I + Z * (S - I);
      e.beginPath(), e.moveTo(le, p - 5), e.lineTo(le, p + 5), e.stroke();
    }
    const _ = t.max - t.min || 1, R = Math.max(0, Math.min(1, (t.shown - t.min) / _)), Y = I + R * (S - I), $ = c(t.shown);
    e.beginPath(), e.moveTo(Y, p - 10), e.lineTo(Y - 4.5, p - 17), e.lineTo(Y + 4.5, p - 17), e.closePath(), e.fillStyle = $, e.fill(), e.beginPath(), e.arc(Y, p, 6.5, 0, Math.PI * 2), e.fillStyle = $, s($, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
    for (const Z of t.marks ?? []) {
      const le = (Z.value - t.min) / _;
      if (le < 0 || le > 1) continue;
      const ae = I + le * (S - I), ie = Tn(o, Z.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = ie, e.lineWidth = 1, e.beginPath(), e.moveTo(ae, p - 9), e.lineTo(ae, p + 9), e.stroke(), e.restore(), Z.label) {
        e.font = `700 8px ${xe}`, e.fillStyle = ie;
        const te = e.measureText(Z.label).width;
        e.fillText(Z.label, Math.max(I, Math.min(S - te, ae - te / 2)), p + 20);
      }
    }
  }
  if (d += (M = t.marks) != null && M.some((F) => F.label) ? 42 : 30, t.meter) {
    const F = t.meter, J = F.min ?? 0, _ = F.max ?? 1, R = _ - J || 1, Y = F.tone === "up" ? o.right : F.tone === "down" ? o.left : F.tone === "warn" ? o.warn : o.neutral;
    F.label && (e.font = `700 9px ${xe}`, e.fillStyle = o.dim, e.fillText(F.label.toUpperCase(), we, d + 9)), F.hint && (e.font = `9px ${xe}`, e.fillStyle = o.dim, e.textAlign = "right", e.fillText(F.hint, l - we, d + 9), e.textAlign = "left"), (F.label || F.hint) && (d += 15), e.font = `700 12px ${xe}`;
    const $ = F.valueText ?? (F.value == null ? "—" : String(F.value)), Z = e.measureText($).width, le = we, ae = l - we - Z - 10, ie = d + 6, te = !!((H = F.thresholds) != null && H.some((h) => h.label));
    if (ae - le > 24) {
      if (St(e, le, ie - 5, ae - le, 10, 5), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), F.value != null) {
        const h = Math.max(0, Math.min(1, (F.value - J) / R));
        h > 0 && (e.save(), St(e, le, ie - 5, ae - le, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = Y, s(Y, 8), e.fillRect(le, ie - 5, (ae - le) * h, 10), e.restore());
      }
      for (const h of F.thresholds ?? []) {
        const y = (h.value - J) / R;
        if (y < 0 || y > 1) continue;
        const O = le + y * (ae - le), E = Tn(o, h.color);
        if (e.strokeStyle = E, e.lineWidth = 1, e.beginPath(), e.moveTo(O, ie - 7), e.lineTo(O, ie + 7), e.stroke(), h.label) {
          e.font = `700 7.5px ${xe}`, e.fillStyle = E;
          const G = e.measureText(h.label).width;
          e.fillText(h.label, Math.max(le, Math.min(ae - G, O - G / 2)), ie + 17);
        }
      }
    }
    e.font = `700 12px ${xe}`, e.fillStyle = Y, e.textAlign = "right", s(Y, 8), e.fillText($, l - we, ie + 4), u(), e.textAlign = "left", d += te ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${xe}`;
    const F = Qt(e, t.caption, v - 18), J = F.length * 15 + 12;
    St(e, we, d, v, J, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, F.forEach((_, R) => e.fillText(_, we + 9, d + 17 + R * 15)), d += J + 10;
  }
  if (t.note) {
    e.font = `10px ${xe}`, e.fillStyle = o.dim;
    const F = Qt(e, t.note, v);
    F.forEach((J, _) => e.fillText(J, we, d + 10 + _ * 14)), d += F.length * 14 + 10;
  }
  if (t.items.length) {
    let _ = we;
    for (const R of t.items) {
      const Y = R.side === "left" ? o.left : R.side === "right" ? o.right : o.neutral, $ = R.side === "left" ? t.sideLetters[0] : R.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${xe}`;
      const Z = e.measureText(R.label).width;
      e.font = `700 8px ${xe}`;
      const le = $ ? e.measureText($).width + 6 : 0;
      e.font = `10px ${xe}`;
      const ae = R.value ? e.measureText(R.value).width : 0, ie = 7 + Z + ($ ? 4 + le : 0) + (R.value ? 4 + ae : 0) + 7;
      _ + ie > l - we && _ > we && (_ = we, d += 23), St(e, _, d, ie, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = Y, e.fillRect(_, d + 1, 2, 16);
      let te = _ + 7;
      e.font = `700 10px ${xe}`, e.fillStyle = o.text, e.fillText(R.label, te, d + 12.5), te += Z + 4, $ && (e.font = `700 8px ${xe}`, e.fillStyle = Y, e.fillText($, te + 3, d + 12), te += le + 4), R.value && (e.font = `10px ${xe}`, e.fillStyle = R.tone === "up" ? o.right : R.tone === "down" ? o.left : o.dim, e.fillText(R.value, te, d + 12.5)), _ += ie + 5;
    }
    d += 18;
  } else if (t.emptyText) {
    e.font = `10px ${xe}`, e.fillStyle = o.dim;
    const F = Qt(e, t.emptyText, v);
    F.forEach((J, _) => e.fillText(J, we, d + 10 + _ * 14)), d += F.length * 14;
  }
  return d + we;
}
const Yl = /* @__PURE__ */ Je({
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
    const t = n, e = X(null), i = X(null), l = () => (t.min + t.max) / 2, a = X(t.animate ? l() : t.value);
    let o = 0;
    function c() {
      if (cancelAnimationFrame(o), !t.animate) {
        a.value = t.value, m();
        return;
      }
      const _ = () => {
        const R = t.value - a.value;
        if (Math.abs(R) < 4e-3) {
          a.value = t.value, m();
          return;
        }
        a.value += R * 0.18, m(), o = requestAnimationFrame(_);
      };
      o = requestAnimationFrame(_);
    }
    ne(() => t.value, c);
    let r = null, s = !1;
    function u() {
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
    let v, d;
    const w = new $t({
      paint: (_, { dpr: R, glow: Y }) => Vn(_, {
        dpr: R,
        theme: t.theme,
        colors: t.colors,
        glow: Y,
        shown: a.value,
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
    function k() {
      if (!(!i.value || !e.value)) {
        try {
          r = new C.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0 });
        } catch {
          s = !0;
        }
        if (!s && !r.getContext() && (r.dispose(), r = null, s = !0), s) {
          L();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), v = new C.Scene(), d = new C.OrthographicCamera(-1, 1, 1, -1, 0, 1), v.add(new C.Mesh(new C.PlaneGeometry(2, 2), w.material)), L();
      }
    }
    function L() {
      if (!e.value || !r && !s) return;
      const _ = e.value.clientWidth, R = e.value.clientHeight;
      w.resize(_, R) && (r ? (r.setPixelRatio(w.dpr), r.setSize(_, R)) : i.value && (i.value.width = w.canvas.width, i.value.height = w.canvas.height, i.value.style.width = _ + "px", i.value.style.height = R + "px"), m());
    }
    function m() {
      if (!w.canvas.width) return;
      if (s) {
        if (!i.value) return;
        w.paintOnly(!1);
        const R = i.value.getContext("2d");
        R && (R.setTransform(1, 0, 0, 1, 0, 0), R.clearRect(0, 0, i.value.width, i.value.height), R.drawImage(w.canvas, 0, 0));
        return;
      }
      if (!r) return;
      const _ = t.theme === "paper";
      w.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !_,
        vignette: !_,
        magnify: t.magnify
      }), w.syncUniforms(), w.paint(t.glow), r.render(v, d);
    }
    ne(
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
    ), ne(() => t.magnify, (_) => {
      _ || w.setLens(null), m();
    });
    function g(_) {
      !t.magnify || !i.value || (w.setLens(kt(_, i.value)), m());
    }
    function D() {
      w.setLens(null), m();
    }
    let P = null, I = null, S = 0;
    const p = Ct("cathodeResetTick", X(0));
    ne(p, () => M());
    function M() {
      cancelAnimationFrame(S), S = requestAnimationFrame(L);
    }
    function H(_) {
      _.preventDefault();
    }
    function F() {
      r == null || r.dispose(), r = null, s = !1, k(), m();
    }
    Xe(() => {
      Pe(() => {
        var _;
        k(), i.value && (i.value.addEventListener("webglcontextlost", H), i.value.addEventListener("webglcontextrestored", F)), e.value && (P = new ResizeObserver(() => L()), P.observe(e.value), I = new IntersectionObserver((R) => {
          R.some((Y) => Y.isIntersecting) && M();
        }), I.observe(e.value)), window.addEventListener("resize", M), (_ = window.visualViewport) == null || _.addEventListener("resize", M), c();
      });
    }), et(() => {
      var _, R, Y;
      cancelAnimationFrame(o), cancelAnimationFrame(S), (_ = i.value) == null || _.removeEventListener("webglcontextlost", H), (R = i.value) == null || R.removeEventListener("webglcontextrestored", F), P == null || P.disconnect(), I == null || I.disconnect(), window.removeEventListener("resize", M), (Y = window.visualViewport) == null || Y.removeEventListener("resize", M), u(), w.dispose();
    });
    const J = ue(() => ({
      background: (_t[t.theme] ?? _t.none).bg
    }));
    return (_, R) => (be(), Me("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: qe(J.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: i,
        class: "cathode-gauge-canvas",
        onMousemove: g,
        onMouseleave: D
      }, null, 544)
    ], 4));
  }
}), eo = /* @__PURE__ */ tt(Yl, [["__scopeId", "data-v-6c2fc3b2"]]);
function to(n, t = 1) {
  if (n.mode !== "world")
    throw new Error("createSurfaceMesh needs a CathodeSurface created with mode: 'world'");
  const e = n.logicalH > 0 ? n.logicalW / n.logicalH : 16 / 9, i = new C.Mesh(new C.PlaneGeometry(t * e, t), n.material);
  return i.userData.cathodeSurface = n, i;
}
function no(n, t, e = 1) {
  const i = t.logicalH > 0 ? t.logicalW / t.logicalH : 1.7777777777777777;
  n.geometry.dispose(), n.geometry = new C.PlaneGeometry(e * i, e);
}
const ft = 26, Jt = 20, Cn = 18, kn = 4, Ln = 8, dt = 16, Vl = { w: 240, h: 160 }, $l = { w: 1600, h: 1e3 };
class Ol {
  constructor(t, e) {
    j(this, "id");
    j(this, "content");
    j(this, "group", new C.Group());
    j(this, "body");
    j(this, "bar");
    j(this, "glow");
    j(this, "dirty", !0);
    j(this, "barDirty", !0);
    j(this, "_title");
    j(this, "controls");
    j(this, "resizable");
    j(this, "minSize");
    j(this, "maxSize");
    j(this, "_grip", null);
    j(this, "_minimized", !1);
    j(this, "_maximized", !1);
    j(this, "hoverControl", null);
    j(this, "barCanvas", document.createElement("canvas"));
    j(this, "barTexture");
    var r, s;
    this.stage = t, this.id = e.id, this._title = e.title ?? e.id, this.controls = e.controls ?? [], this.content = e.content, this.resizable = !!e.resizable && typeof e.content.resize == "function", this.minSize = e.minSize ?? Vl, this.maxSize = e.maxSize ?? $l, this.glow = e.glow ?? !0;
    const i = e.content.surface;
    if (i.mode !== "world") throw new Error("CathodeStage3D panels need a CathodeSurface created with mode: 'world'");
    const l = t.pxPerUnit, a = e.content.width / l, o = e.content.height / l, c = ft / l;
    if (this.body = new C.Mesh(new C.PlaneGeometry(a, o), i.material), this.barTexture = new C.CanvasTexture(this.barCanvas), this.barTexture.colorSpace = C.SRGBColorSpace, this.bar = new C.Mesh(
      new C.PlaneGeometry(a, c),
      new C.MeshBasicMaterial({ map: this.barTexture, toneMapped: !1 })
    ), this.bar.position.y = o / 2 + c / 2, this.group.add(this.body, this.bar), this.body.userData.panel = this, this.bar.userData.panel = this, this.resizable) {
      const u = dt / l, v = document.createElement("canvas");
      v.width = v.height = 32;
      const d = v.getContext("2d");
      d.strokeStyle = "#6ee7a7", d.lineWidth = 3, d.lineCap = "round", d.beginPath();
      for (const k of [10, 18, 26])
        d.moveTo(30, k), d.lineTo(k, 30);
      d.stroke();
      const w = new C.CanvasTexture(v);
      w.colorSpace = C.SRGBColorSpace, this._grip = new C.Mesh(
        new C.PlaneGeometry(u, u),
        new C.MeshBasicMaterial({ map: w, transparent: !0, opacity: 0.55, depthWrite: !1, toneMapped: !1 })
      ), this.group.add(this._grip), this.placeGrip();
    }
    e.visible === !1 && (this.group.visible = !1), e.minimized && (this._minimized = !0, this.body.visible = !1), e.position && this.group.position.set(...e.position), this.group.rotation.y = e.rotationY ?? 0, e.look && i.setLook(e.look), i.resize(e.content.width, e.content.height, window.devicePixelRatio || 1), (s = (r = e.content).attach) == null || s.call(r, () => this.invalidate());
  }
  /** the corner grip (only on a resizable panel) */
  get grip() {
    return this._grip;
  }
  /** the title bar's text */
  get title() {
    return this._title;
  }
  /** Change the title bar's text (e.g. a live count: "Open positions (6)"). Repaints only the bar, and only if it changed. */
  setTitle(t) {
    t !== this._title && (this._title = t, this.invalidateBar());
  }
  placeGrip() {
    if (!this.grip) return;
    const t = this.stage.pxPerUnit;
    this.grip.position.set((this.content.width - dt) / 2 / t, -(this.content.height - dt) / 2 / t, 3e-3), this.grip.visible = !this._minimized;
  }
  /** @internal the stage brightens the grip while the pointer is over the handle */
  setHoverGrip(t) {
    this.grip && (this.grip.material.opacity = t ? 1 : 0.55, this.stage.invalidate());
  }
  /**
   * Resize to `w` x `h` logical px (clamped to minSize / maxSize): the content lays out for the new size, the surface's backing
   * store follows, and the body / title bar / grip geometry is rebuilt. The panel's CENTRE stays where it is — the drag in the
   * stage moves it so the top-left corner stays put. No-op (false) for a panel that is not resizable.
   */
  resize(t, e) {
    if (!this.resizable || (t = Math.round(Math.min(this.maxSize.w, Math.max(this.minSize.w, t))), e = Math.round(Math.min(this.maxSize.h, Math.max(this.minSize.h, e))), t === this.content.width && e === this.content.height)) return !1;
    this.content.resize(t, e), this.content.surface.resize(t, e, window.devicePixelRatio || 1);
    const i = this.stage.pxPerUnit, l = ft / i;
    return this.body.geometry.dispose(), this.body.geometry = new C.PlaneGeometry(t / i, e / i), this.bar.geometry.dispose(), this.bar.geometry = new C.PlaneGeometry(t / i, l), this.bar.position.y = e / i / 2 + l / 2, this.placeGrip(), this.dirty = !0, this.barDirty = !0, this.stage.invalidate(), !0;
  }
  get minimized() {
    return this._minimized;
  }
  get maximized() {
    return this._maximized;
  }
  /**
   * Collapse to the title bar (the body is hidden and no longer picked) / expand. Prefer stage.setPanelMinimized(),
   * which also releases hover / press on the body.
   */
  setMinimized(t) {
    this._minimized !== t && (this._minimized = t, this.body.visible = !t, this.grip && (this.grip.visible = !t), this.invalidateBar(), t || this.invalidate());
  }
  /** The maximize control's glyph state (a maximized panel shows "restore"). A visual flag only — what maximized MEANS is the host's. */
  setMaximized(t) {
    this._maximized !== t && (this._maximized = t, this.invalidateBar());
  }
  /** @internal the stage lights the control under the pointer */
  setHoverControl(t) {
    this.hoverControl !== t && (this.hoverControl = t, this.invalidateBar());
  }
  /** The box of a control in the title bar's own px (x from the bar's left, y from its top), or null if this panel has none. */
  controlRect(t) {
    const e = this.controls.indexOf(t);
    if (e < 0) return null;
    const i = this.controls.length;
    return { x: this.content.width - Ln - (i - e) * Jt - (i - 1 - e) * kn, y: (ft - Cn) / 2 - 1, w: Jt, h: Cn };
  }
  /** The control at a point in the title bar's px, or null. */
  controlAt(t, e) {
    for (const i of this.controls) {
      const l = this.controlRect(i);
      if (t >= l.x && t <= l.x + l.w && e >= l.y && e <= l.y + l.h) return i;
    }
    return null;
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
  setPosition(t, e, i) {
    this.group.position.set(t, e, i), this.stage.invalidate();
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
    const t = Math.min(window.devicePixelRatio || 1, 2), e = this.content.width, i = ft, l = this.barCanvas;
    (l.width !== Math.round(e * t) || l.height !== Math.round(i * t)) && (l.width = Math.round(e * t), l.height = Math.round(i * t), this.barTexture.dispose(), this.barTexture = new C.CanvasTexture(l), this.barTexture.colorSpace = C.SRGBColorSpace, this.bar.material.map = this.barTexture, this.bar.material.needsUpdate = !0);
    const a = l.getContext("2d");
    a.setTransform(t, 0, 0, t, 0, 0);
    const o = this.stage.focusedId === this.id;
    a.fillStyle = o ? "#0f2a1d" : "#08130e", a.fillRect(0, 0, e, i), a.fillStyle = o ? "#6ee7a7" : "#2f6b4c", a.fillRect(0, i - 2, e, 2), a.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", a.textBaseline = "middle", a.fillStyle = o ? "#b6f5d2" : "#6fae8f";
    const c = this.controls.length ? e - 10 - (Ln + this.controls.length * (Jt + kn)) : e - 20;
    a.fillText(this._title, 10, i / 2 - 1, Math.max(20, c)), this.drawControls(a, o), this.barTexture.needsUpdate = !0;
  }
  /** the title-bar controls: strokes, not font glyphs (a glyph can fall back to a font that does not have it) */
  drawControls(t, e) {
    for (const i of this.controls) {
      const l = this.controlRect(i);
      this.hoverControl === i && (t.fillStyle = "rgba(110,231,167,0.20)", t.fillRect(l.x, l.y, l.w, l.h)), t.strokeStyle = e ? "#b6f5d2" : "#6fae8f", t.lineWidth = 1.4;
      const a = l.x + l.w / 2, o = l.y + l.h / 2;
      t.beginPath(), i === "minimize" ? this._minimized ? (t.moveTo(a - 5, o), t.lineTo(a + 5, o), t.moveTo(a, o - 5), t.lineTo(a, o + 5)) : (t.moveTo(a - 5, o + 3), t.lineTo(a + 5, o + 3)) : this._maximized ? (t.rect(a - 5, o - 2, 7, 6), t.moveTo(a - 2, o - 2), t.lineTo(a - 2, o - 5), t.lineTo(a + 5, o - 5), t.lineTo(a + 5, o + 1), t.lineTo(a + 2, o + 1)) : t.rect(a - 5, o - 4, 10, 8), t.stroke();
    }
  }
  dispose() {
    var t, e, i;
    if (this.body.geometry.dispose(), this.bar.geometry.dispose(), this.bar.material.dispose(), this.barTexture.dispose(), this.grip) {
      this.grip.geometry.dispose();
      const l = this.grip.material;
      (t = l.map) == null || t.dispose(), l.dispose();
    }
    (i = (e = this.content).dispose) == null || i.call(e);
  }
}
class io {
  constructor(t) {
    j(this, "renderer");
    j(this, "scene", new C.Scene());
    j(this, "camera");
    j(this, "canvas");
    j(this, "panels", /* @__PURE__ */ new Map());
    j(this, "pxPerUnit");
    j(this, "focusedId", null);
    j(this, "controls", null);
    j(this, "ray", new C.Raycaster());
    j(this, "ndc", new C.Vector2());
    j(this, "raf", 0);
    j(this, "rendering", !1);
    j(this, "raiseCounter", 0);
    j(this, "hovered", null);
    j(this, "pressed", null);
    // a content press in progress
    j(this, "dragging", null);
    j(this, "suppressClick", !1);
    j(this, "resizeObserver");
    j(this, "disposers", []);
    j(this, "lastCursor", "");
    j(this, "passThrough");
    j(this, "swallowClick", !1);
    j(this, "pressedControl", null);
    j(this, "resizing", null);
    j(this, "hoverGrip", null);
    j(this, "hoverBar", null);
    j(this, "cancelFly", null);
    this.o = t, this.pxPerUnit = t.pxPerUnit ?? 360, this.passThrough = !!t.passThrough, this.renderer = new C.WebGLRenderer({ antialias: !0, alpha: !!t.transparent }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setClearColor(t.background ?? 329738, t.transparent ? 0 : 1), this.canvas = this.renderer.domElement, this.passThrough || (this.canvas.tabIndex = 0), this.canvas.style.cssText = "display:block;width:100%;height:100%;outline:none;touch-action:none" + (this.passThrough ? ";pointer-events:none" : ""), t.container.appendChild(this.canvas), this.camera = new C.PerspectiveCamera(t.fov ?? 45, 1, t.near ?? 0.05, t.far ?? 100);
    const e = t.cameraPosition ?? [0, 0.1, 3.4];
    this.camera.position.set(...e), this.camera.lookAt(0, 0, 0), t.controls && (this.controls = t.controls(this.camera, this.canvas), this.controls.addEventListener("change", () => this.invalidate()));
    const i = this.passThrough ? t.inputTarget ?? document : this.canvas;
    this.on(i, "pointerdown", (l) => this.onPointerDown(l), { capture: !0 }), this.on(i, "pointermove", (l) => this.onPointerMove(l)), this.passThrough || this.on(this.canvas, "pointerleave", () => this.setHover(null)), this.on(window, "pointerup", (l) => this.onPointerUp(l)), this.on(window, "pointercancel", (l) => this.onPointerUp(l)), this.on(i, "click", (l) => this.onClick(l), { capture: this.passThrough }), this.on(i, "wheel", (l) => this.onWheel(l), { capture: !0, passive: !1 }), this.on(this.passThrough ? window : this.canvas, "keydown", (l) => this.onKey(l)), this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t.container), this.resize();
  }
  on(t, e, i, l) {
    t.addEventListener(e, i, l), this.disposers.push(() => t.removeEventListener(e, i, l));
  }
  // ── External camera ─────────────────────────────────────────────────────────
  /** Point the camera (the host drives it — e.g. following another scene's camera). */
  setCameraPose(t) {
    var e, i;
    this.camera.position.set(...t.position), this.camera.lookAt(...t.target), this.camera.updateMatrixWorld(!0), (i = (e = this.controls) == null ? void 0 : e.target) == null || i.set(...t.target), this.invalidate();
  }
  /**
   * The camera pose that looks straight at a panel (its title bar included), from the front, far
   * enough back that the whole panel fits the view with `margin` (default 12%) to spare. Pure — it
   * moves nothing: a host that owns the camera (overlay mode) applies it itself; otherwise flyTo().
   */
  facingPose(t, e = {}) {
    const i = this.panels.get(t);
    if (!i) return null;
    i.group.updateWorldMatrix(!0, !0);
    const l = this.pxPerUnit, a = i.content.height / l, o = ft / l, c = i.content.width / l, r = a / 2 + o, s = i.minimized ? a / 2 : -a / 2, u = r - s, v = i.body.localToWorld(new C.Vector3(0, (r + s) / 2, 0)), d = new C.Vector3(0, 0, 1).applyQuaternion(i.group.getWorldQuaternion(new C.Quaternion())), w = Math.tan(C.MathUtils.degToRad(this.camera.fov / 2)), k = Math.max(u / 2 / w, c / 2 / (w * this.camera.aspect)) * (1 + (e.margin ?? 0.12)), L = v.clone().addScaledVector(d, k);
    return { position: [L.x, L.y, L.z], target: [v.x, v.y, v.z] };
  }
  /**
   * Tween the camera to a pose (ease in-out). For a stage that OWNS its camera — in overlay mode
   * the host drives the camera, so apply facingPose() there instead. Resolves when it lands; a new
   * flyTo replaces one in flight. `ms <= 0` snaps.
   */
  flyTo(t, e = 550) {
    var l;
    if ((l = this.cancelFly) == null || l.call(this), e <= 0)
      return this.setCameraPose(t), Promise.resolve();
    const i = this.getCameraPose();
    return new Promise((a) => {
      const o = performance.now();
      let c = 0;
      this.cancelFly = () => {
        cancelAnimationFrame(c), this.cancelFly = null, a();
      };
      const r = (s) => {
        const u = Math.min(1, (s - o) / e), v = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, d = (w, k) => [w[0] + (k[0] - w[0]) * v, w[1] + (k[1] - w[1]) * v, w[2] + (k[2] - w[2]) * v];
        this.setCameraPose({ position: d(i.position, t.position), target: d(i.target, t.target) }), u < 1 ? c = requestAnimationFrame(r) : (this.cancelFly = null, a());
      };
      c = requestAnimationFrame(r);
    });
  }
  /** The camera's current pose (target = the point it looks at, one unit ahead). */
  getCameraPose() {
    const t = this.camera.position, e = this.camera.getWorldDirection(new C.Vector3()).add(t);
    return { position: [t.x, t.y, t.z], target: [e.x, e.y, e.z] };
  }
  // ── Panels ──────────────────────────────────────────────────────────────────
  addPanel(t) {
    if (this.panels.has(t.id)) throw new Error(`CathodeStage3D: duplicate panel id "${t.id}"`);
    const e = new Ol(this, t);
    return e.content.surface.setAnisotropy(this.renderer.capabilities.getMaxAnisotropy()), this.panels.set(t.id, e), this.scene.add(e.group), this.raise(e), this.invalidate(), e;
  }
  removePanel(t) {
    const e = this.panels.get(t);
    e && (this.focusedId === t && this.setFocus(null), this.hovered === e && (this.hovered = null), this.pressed === e && (this.pressed = null), this.scene.remove(e.group), e.dispose(), this.panels.delete(t), this.invalidate());
  }
  /** Show / hide a panel. Hiding releases its focus, hover, press and drag. */
  setPanelVisible(t, e) {
    var l;
    const i = this.panels.get(t);
    i && (i.setVisible(e), e || (this.focusedId === t && this.setFocus(null), this.hovered === i && (this.hovered = null), this.pressed === i && (this.pressed = null), ((l = this.dragging) == null ? void 0 : l.panel) === i && (this.dragging = null)), this.invalidate());
  }
  /** Collapse a panel to its title bar / expand it. Collapsing releases hover and press on its body. */
  setPanelMinimized(t, e) {
    const i = this.panels.get(t);
    i && (i.setMinimized(e), e && (this.hovered === i && (this.hovered = null), this.pressed === i && (this.pressed = null)), this.invalidate());
  }
  /** Keyboard focus + raise. */
  setFocus(t) {
    var l, a;
    if (this.focusedId === t) {
      t && this.raise(this.panels.get(t));
      return;
    }
    const e = this.focusedId && this.panels.get(this.focusedId);
    this.focusedId = t, e && e.invalidateBar();
    const i = t ? this.panels.get(t) : null;
    i && (this.raise(i), i.invalidateBar()), (a = (l = this.o).onFocus) == null || a.call(l, t), this.invalidate();
  }
  raise(t) {
    t.body.renderOrder = t.bar.renderOrder = ++this.raiseCounter, t.grip && (t.grip.renderOrder = t.body.renderOrder + 0.5);
  }
  getLayout() {
    const t = {};
    for (const [e, i] of this.panels)
      t[e] = { x: i.group.position.x, y: i.group.position.y, z: i.group.position.z, rotY: i.group.rotation.y, visible: i.visible, minimized: i.minimized, ...i.resizable ? { size: { w: i.content.width, h: i.content.height } } : {} };
    return t;
  }
  applyLayout(t) {
    for (const [e, i] of Object.entries(t)) {
      const l = this.panels.get(e);
      l && (l.group.position.set(i.x ?? l.group.position.x, i.y ?? l.group.position.y, i.z ?? l.group.position.z), i.rotY !== void 0 && (l.group.rotation.y = i.rotY), i.visible !== void 0 && this.setPanelVisible(e, i.visible), i.minimized !== void 0 && this.setPanelMinimized(e, i.minimized), i.size && l.resize(i.size.w, i.size.h));
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
    const i = this.canvas.getBoundingClientRect();
    this.ndc.set((t - i.left) / i.width * 2 - 1, -((e - i.top) / i.height) * 2 + 1), this.ray.setFromCamera(this.ndc, this.camera);
  }
  /** Content px (the panel's logical px) under a client point, or null (miss / bezel). */
  contentAt(t, e, i) {
    this.setRay(e, i);
    const l = this.ray.intersectObject(t.body)[0];
    return l != null && l.uv ? t.content.surface.contentPoint(l.uv.x, l.uv.y) : null;
  }
  /** Local content-px per screen-px at a client point: two probes 8px apart, as the DOM grid does. */
  hitScaleAt(t, e, i) {
    const l = this.contentAt(t, e - 4, i), a = this.contentAt(t, e + 4, i);
    return !l || !a ? 1 : Math.max(1, Math.abs(a.x - l.x) / 8);
  }
  /** The nearest panel part under a client point (bodies and title bars; raised panels win ties). */
  pick(t, e) {
    this.setRay(t, e);
    const i = [];
    for (const d of this.panels.values()) d.visible && (d.minimized || i.push(d.body), i.push(d.bar));
    const l = this.ray.intersectObjects(i, !1);
    if (!l.length) return null;
    const a = l[0].distance;
    let o = l[0];
    for (const d of l)
      d.distance - a < 1e-3 && d.object.renderOrder > o.object.renderOrder && (o = d);
    const c = o.object.userData.panel, r = o.object === c.bar ? "bar" : "body", s = r === "body" && o.uv ? c.content.surface.contentPoint(o.uv.x, o.uv.y) : null, u = r === "bar" && o.uv ? c.controlAt(o.uv.x * c.content.width, (1 - o.uv.y) * ft) : null, v = r === "body" && c.resizable && !c.minimized && !!o.uv && o.uv.x * c.content.width > c.content.width - dt && (1 - o.uv.y) * c.content.height > c.content.height - dt;
    return { panel: c, part: r, content: s, control: u, handle: v };
  }
  /**
   * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
   * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
   */
  clientPointForContent(t, e, i) {
    const l = this.panels.get(t);
    if (!l) return null;
    const a = l.content.surface, o = l.content.width, c = l.content.height;
    let r = e / o, s = 1 - i / c;
    const u = (k, L) => a.contentPoint(k, L);
    for (let k = 0; k < 12; k++) {
      const L = u(r, s);
      if (!L) {
        r = 0.5 + (r - 0.5) * 0.8, s = 0.5 + (s - 0.5) * 0.8;
        continue;
      }
      const m = L.x - e, g = L.y - i;
      if (Math.hypot(m, g) < 0.05) break;
      const D = 1e-4, P = u(r + D, s), I = u(r, s + D);
      if (!P || !I) break;
      const S = (P.x - L.x) / D, p = (I.x - L.x) / D, M = (P.y - L.y) / D, H = (I.y - L.y) / D, F = S * H - p * M;
      if (Math.abs(F) < 1e-9) break;
      r -= (H * m - p * g) / F, s -= (-M * m + S * g) / F;
    }
    const v = u(r, s);
    if (!v || Math.hypot(v.x - e, v.y - i) > 1.5) return null;
    l.group.updateWorldMatrix(!0, !0);
    const d = l.body.localToWorld(new C.Vector3((r - 0.5) * (o / this.pxPerUnit), (s - 0.5) * (c / this.pxPerUnit), 0));
    d.project(this.camera);
    const w = this.canvas.getBoundingClientRect();
    return { x: w.left + (d.x + 1) / 2 * w.width, y: w.top + (1 - d.y) / 2 * w.height };
  }
  /** Client point of a resizable panel's resize handle (for tests / tours), or null. */
  clientPointForHandle(t) {
    const e = this.panels.get(t);
    if (!e || !e.resizable) return null;
    e.group.updateWorldMatrix(!0, !0);
    const i = this.pxPerUnit, l = e.body.localToWorld(new C.Vector3((e.content.width / 2 - dt / 2) / i, -(e.content.height / 2 - dt / 2) / i, 0)).project(this.camera), a = this.canvas.getBoundingClientRect();
    return { x: a.left + (l.x + 1) / 2 * a.width, y: a.top + (1 - l.y) / 2 * a.height };
  }
  /** Client point of a title-bar control's centre (for tests / tours), or null. */
  clientPointForControl(t, e) {
    const i = this.panels.get(t), l = i == null ? void 0 : i.controlRect(e);
    if (!i || !l) return null;
    i.group.updateWorldMatrix(!0, !0);
    const a = this.pxPerUnit, o = new C.Vector3((l.x + l.w / 2 - i.content.width / 2) / a, 0, 0);
    o.y = (ft / 2 - (l.y + l.h / 2)) / a;
    const c = i.bar.localToWorld(o).project(this.camera), r = this.canvas.getBoundingClientRect();
    return { x: r.left + (c.x + 1) / 2 * r.width, y: r.top + (1 - c.y) / 2 * r.height };
  }
  /** Client point of a panel's title bar centre (for tests / tours). */
  clientPointForBar(t) {
    const e = this.panels.get(t);
    if (!e) return null;
    e.group.updateWorldMatrix(!0, !0);
    const i = e.bar.getWorldPosition(new C.Vector3()).project(this.camera), l = this.canvas.getBoundingClientRect();
    return { x: l.left + (i.x + 1) / 2 * l.width, y: l.top + (1 - i.y) / 2 * l.height };
  }
  // ── Pointer routing ─────────────────────────────────────────────────────────
  send(t, e, i, l = {}) {
    var c, r;
    const a = this.contentAt(t, i.clientX, i.clientY), o = {
      kind: e,
      x: a ? a.x : -1,
      y: a ? a.y : -1,
      hitScale: a ? this.hitScaleAt(t, i.clientX, i.clientY) : 1,
      clientX: i.clientX,
      clientY: i.clientY,
      deltaX: l.deltaX ?? 0,
      deltaY: l.deltaY ?? 0,
      detail: e === "click" ? i.detail ?? 0 : 0,
      shiftKey: !!i.shiftKey
    };
    return ((r = (c = t.content).pointer) == null ? void 0 : r.call(c, o)) ?? null;
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
    this.passThrough && (t.stopPropagation(), this.swallowClick = !0), this.controls && (this.controls.enabled = !1), this.setFocus(e.panel.id), this.suppressClick = !1, e.part === "bar" && e.control ? (this.pressedControl = { panel: e.panel, control: e.control }, this.setCursor("pointer")) : e.part === "bar" ? (this.startDrag(e.panel), this.setCursor("grabbing")) : e.handle ? (this.startResize(e.panel), this.setCursor("nwse-resize")) : (this.pressed = e.panel, this.send(e.panel, "down", t));
  }
  onPointerMove(t) {
    if (this.resizing) {
      this.resizeTo(t);
      return;
    }
    if (this.dragging) {
      this.dragTo(t);
      return;
    }
    if (this.pressed) {
      this.send(this.pressed, "drag", t);
      return;
    }
    if (this.pressedControl) return;
    if (!this.accepts(t)) {
      this.setHover(null, t), this.setHoverBar(null, null), this.setHoverGrip(null);
      return;
    }
    const e = this.pick(t.clientX, t.clientY);
    if (this.setHoverGrip(e != null && e.handle ? e.panel : null), this.setHover(e && e.part === "body" && !e.handle ? e.panel : null, t), this.setHoverBar(e && e.part === "bar" ? e.panel : null, (e == null ? void 0 : e.control) ?? null), !e) {
      this.setCursor("");
      return;
    }
    if (e.part === "bar") {
      this.setCursor(e.control ? "pointer" : "grab");
      return;
    }
    if (e.handle) {
      this.setCursor("nwse-resize");
      return;
    }
    const i = this.send(e.panel, "move", t);
    i && this.setCursor(i);
  }
  /** light the control under the pointer (and clear the previous panel's) */
  setHoverBar(t, e) {
    this.hoverBar && this.hoverBar !== t && this.hoverBar.setHoverControl(null), this.hoverBar = t, t == null || t.setHoverControl(e);
  }
  setHoverGrip(t) {
    this.hoverGrip && this.hoverGrip !== t && this.hoverGrip.setHoverGrip(!1), this.hoverGrip = t, t == null || t.setHoverGrip(!0);
  }
  onPointerUp(t) {
    var e, i, l, a;
    if (this.pressedControl = null, this.resizing) {
      const o = this.resizing;
      if (this.resizing = null, o.moved) {
        this.suppressClick = !0;
        const c = o.panel.group.position;
        (i = (e = this.o).onPanelResized) == null || i.call(e, o.panel.id, { w: o.panel.content.width, h: o.panel.content.height }, { x: c.x, y: c.y, z: c.z });
      }
      this.setCursor("");
    }
    if (this.dragging) {
      this.dragging.moved && (this.suppressClick = !0);
      const o = this.dragging.panel;
      this.dragging = null, this.setCursor(""), (a = (l = this.o).onPanelMoved) == null || a.call(l, o.id, { x: o.group.position.x, y: o.group.position.y, z: o.group.position.z });
    }
    this.pressed && (this.send(this.pressed, "up", t), this.pressed = null), this.controls && (this.controls.enabled = !0);
  }
  onClick(t) {
    var i, l, a, o;
    if (!this.accepts(t)) return;
    if (this.passThrough && this.swallowClick && (this.swallowClick = !1, t.stopPropagation()), this.suppressClick) {
      this.suppressClick = !1;
      return;
    }
    const e = this.pick(t.clientX, t.clientY);
    e && this.passThrough && t.stopPropagation(), e && e.part === "body" && this.send(e.panel, "click", t), e && e.part === "bar" && (e.control ? (l = (i = this.o).onPanelControl) == null || l.call(i, e.panel.id, e.control) : t.detail >= 2 && ((o = (a = this.o).onPanelActivate) == null || o.call(a, e.panel.id)));
  }
  onWheel(t) {
    if (!this.accepts(t)) return;
    const e = this.pick(t.clientX, t.clientY);
    !e || e.part !== "body" || (t.preventDefault(), t.stopImmediatePropagation(), this.send(e.panel, "wheel", t, { deltaX: t.deltaX, deltaY: t.deltaY }));
  }
  onKey(t) {
    if (this.passThrough) {
      const i = t.target;
      if (i && (i.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName))) return;
    }
    const e = this.focusedId ? this.panels.get(this.focusedId) : null;
    e != null && e.content.key && (e.content.key(t), e.invalidate());
  }
  // ── Resize (ray–plane on the panel's own plane; the TOP-LEFT corner stays put) ──────────────────────────
  startResize(t) {
    t.group.updateWorldMatrix(!0, !0);
    const e = t.group.getWorldQuaternion(new C.Quaternion()), i = new C.Vector3(1, 0, 0).applyQuaternion(e), l = new C.Vector3(0, 1, 0).applyQuaternion(e), a = new C.Vector3(0, 0, 1).applyQuaternion(e), o = this.pxPerUnit, c = t.body.localToWorld(new C.Vector3(-t.content.width / o / 2, t.content.height / o / 2, 0)), r = new C.Plane().setFromNormalAndCoplanarPoint(a, c);
    this.resizing = { panel: t, tl: c, right: i, up: l, plane: r, moved: !1 };
  }
  resizeTo(t) {
    const e = this.resizing;
    this.setRay(t.clientX, t.clientY);
    const i = new C.Vector3();
    if (!this.ray.ray.intersectPlane(e.plane, i)) return;
    const l = this.pxPerUnit, a = i.sub(e.tl), o = Math.round(a.dot(e.right) * l), c = Math.round(-a.dot(e.up) * l), r = e.panel, s = Math.round(Math.min(r.maxSize.w, Math.max(r.minSize.w, o))), u = Math.round(Math.min(r.maxSize.h, Math.max(r.minSize.h, c)));
    s === r.content.width && u === r.content.height || (r.group.position.copy(e.tl).addScaledVector(e.right, s / l / 2).addScaledVector(e.up, -u / l / 2), r.resize(s, u), e.moved = !0);
  }
  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────
  startDrag(t) {
    t.group.updateWorldMatrix(!0, !0);
    const e = new C.Vector3(0, 0, 1).applyQuaternion(t.group.quaternion), i = new C.Plane().setFromNormalAndCoplanarPoint(e, t.group.position), l = new C.Vector3(), a = new C.Vector3();
    this.ray.ray.intersectPlane(i, l) && a.copy(t.group.position).sub(l), this.dragging = { panel: t, plane: i, offset: a, moved: !1 };
  }
  dragTo(t) {
    const e = this.dragging;
    this.setRay(t.clientX, t.clientY);
    const i = new C.Vector3();
    this.ray.ray.intersectPlane(e.plane, i) && (e.panel.group.position.copy(i.add(e.offset)), e.moved = !0, this.invalidate());
  }
  // ── Teardown ────────────────────────────────────────────────────────────────
  dispose() {
    var t, e;
    (t = this.cancelFly) == null || t.call(this), cancelAnimationFrame(this.raf), this.resizeObserver.disconnect();
    for (const i of this.disposers) i();
    for (const i of [...this.panels.values()]) this.removePanel(i.id);
    (e = this.controls) == null || e.dispose();
    try {
      this.renderer.forceContextLoss();
    } catch {
    }
    this.renderer.dispose(), this.canvas.remove();
  }
}
function lo(n, t, e, i = {}) {
  return { surface: n, width: t, height: e, ...i };
}
function oo(n) {
  let t = () => {
  };
  const e = n.theme ?? "phosphor", i = _n({
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
  i.init(), i.setViewport(n.width, n.height, n.width, n.height);
  const l = new $t({
    mode: "world",
    paint: (r, s) => i.paint(r, s)
  }), a = (r) => {
    const s = { cx: r.x, cy: r.y, hitScale: r.hitScale };
    switch (r.kind) {
      case "move":
        return i.resizing ? null : i.hover(s);
      case "leave":
        return i.leave(), null;
      case "down":
        return i.pointerDown(s, r.clientX, r.clientY), null;
      case "drag":
        return i.globalMove(r.clientX, r.clientY), null;
      case "up":
        return i.globalUp(), null;
      case "click":
        return i.click(s, { shiftKey: r.shiftKey, detail: r.detail }), null;
      case "wheel":
        return i.wheel(r.deltaX, r.deltaY, r.shiftKey), null;
    }
  }, o = (r) => {
    if (i.activeFilter.value) {
      if (r.key === "Escape") {
        r.preventDefault(), i.clearFilter();
        return;
      }
      if (r.key === "Enter") {
        r.preventDefault(), i.closeFilter();
        return;
      }
      if (r.key === "Backspace") {
        r.preventDefault(), i.setFilterText(i.filterPopupValue.value.slice(0, -1)), t();
        return;
      }
      if (r.key.length === 1 && !r.ctrlKey && !r.metaKey) {
        r.preventDefault(), i.setFilterText(i.filterPopupValue.value + r.key), t();
        return;
      }
    }
    i.keyDown(r);
  }, c = {
    model: i,
    surface: l,
    width: n.width,
    height: n.height,
    attach: (r) => {
      t = r;
    },
    pointer: a,
    key: o,
    // more room → more columns / rows; the model re-clamps scroll and re-fits the columns to the new canvas
    resize(r, s) {
      c.width = r, c.height = s, i.setViewport(r, s, r, s), t();
    },
    dispose: () => {
      i.dispose(), l.dispose();
    }
  };
  return c;
}
function ao(n) {
  let t = () => {
  }, e = { ...n };
  const i = () => ((e.min ?? -1) + (e.max ?? 1)) / 2;
  let l = e.animate === !1 ? e.value : i(), a = 0;
  const o = new $t({
    mode: "world",
    paint: (s, { dpr: u, glow: v }) => {
      Vn(s, {
        dpr: u,
        theme: e.theme ?? "none",
        colors: e.colors,
        glow: v,
        shown: l,
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
  }), c = () => {
    if (cancelAnimationFrame(a), e.animate === !1) {
      l = e.value, t();
      return;
    }
    const s = () => {
      const u = e.value - l;
      if (Math.abs(u) < 4e-3) {
        l = e.value, t();
        return;
      }
      l += u * 0.18, t(), a = requestAnimationFrame(s);
    };
    a = requestAnimationFrame(s);
  }, r = {
    surface: o,
    width: n.width,
    height: n.height,
    attach: (s) => {
      t = s, c();
    },
    // the mount sweep: centre → value
    resize(s, u) {
      r.width = s, r.height = u, t();
    },
    // the painter lays out for the canvas it is given
    update(s) {
      const u = s.value !== void 0 && s.value !== e.value;
      e = { ...e, ...s }, u || s.animate !== void 0 ? c() : t();
    },
    get shown() {
      return l;
    },
    dispose: () => {
      cancelAnimationFrame(a), t = () => {
      }, o.dispose();
    }
  };
  return r;
}
export {
  xt as CANDLE_THEME_COLORS,
  Kl as CathodeCandle,
  ql as CathodeCandleGrid,
  Ql as CathodeContainer,
  eo as CathodeGauge,
  Nl as CathodeGrid,
  Jl as CathodeLoader,
  Yi as CathodeLog,
  io as CathodeStage3D,
  $t as CathodeSurface,
  Gl as CathodeTerminal,
  Zl as CathodeWorkspace,
  _t as GAUGE_THEME_COLORS,
  Pt as LOG_THEME_COLORS,
  Ol as Panel3D,
  Si as barrelUV,
  jl as buildDefaultLayout,
  to as createSurfaceMesh,
  Vn as drawGauge,
  ao as gaugeContent,
  oo as gridContent,
  Ti as lensUV,
  no as resizeSurfaceMesh,
  lo as surfaceContent,
  Yn as useCathodeLayout,
  _n as useGridModel
};
