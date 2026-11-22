var li = Object.defineProperty;
var oi = (n, t, e) => t in n ? li(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var j = (n, t, e) => oi(n, typeof t != "symbol" ? t + "" : t, e);
import { effectScope as Kt, ref as U, reactive as At, watch as ne, nextTick as De, computed as re, defineComponent as Ye, inject as ht, onMounted as Fe, onUnmounted as Ve, openBlock as we, createElementBlock as ye, normalizeStyle as _e, createElementVNode as fe, withModifiers as Ze, unref as de, withKeys as an, createCommentVNode as We, toDisplayString as ze, createVNode as pn, withDirectives as wn, vModelText as ai, provide as rn, renderSlot as Ot, Transition as ri, withCtx as si, Fragment as ci, renderList as ui, createTextVNode as fi, normalizeClass as di, vShow as hi, shallowReactive as yn } from "vue";
import * as z from "three";
const at = {
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
}, xe = 30, Ut = 12, vi = 10, St = 14, bn = 5;
function Tt() {
  return `${Ut}px system-ui, -apple-system, sans-serif`;
}
function xn(n, t, e) {
  const i = String(t ?? "");
  if (!i) return [""];
  const l = i.split(/\s+/).filter(Boolean);
  if (l.length === 0) return [""];
  const a = [];
  let o = "";
  for (const r of l) {
    const c = o ? o + " " + r : r;
    !o || n.measureText(c).width <= e ? o = c : (a.push(o), o = r);
  }
  return o && a.push(o), a.length ? a : [""];
}
function mi(n, t) {
  return Math.max(t, n * St + bn * 2);
}
function jt(n, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let i = 0; i < t; i++) e[i + 1] = e[i] + (n[i] ?? 0);
  return e;
}
function Ct(n, t) {
  if (t <= 0) return 0;
  let e = 0, i = n.length - 1;
  for (; e < i; ) {
    const l = e + i + 1 >> 1;
    n[l] <= t ? e = l : i = l - 1;
  }
  return e;
}
const Mn = 28;
function gi(n, t) {
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
function pi(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const i = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(i, 0, 0, i, 0, 0);
  const l = n.width / i, a = n.height / i, o = at[t.theme] ?? at.none, { cols: r, rows: c, pinnedRows: s, rowHeight: u, scrollY: m, scrollX: h, glow: p } = t;
  e.clearRect(0, 0, l, a), e.fillStyle = o.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const M = s.length * u, C = t.aggregateRow ? Mn : 0, v = a - xe - M - C;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, l, xe), e.textBaseline = "middle", e.textAlign = "left";
  let g = -h;
  for (let f = 0; f < r.length; f++) {
    const w = r[f];
    if (g + w.width <= 0) {
      g += w.width;
      continue;
    }
    if (g >= l) break;
    const y = !!t.colFilters[w.colId], b = t.sorts.findIndex((O) => O.colId === w.colId), V = b >= 0, $ = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(g, 0, w.width, xe), e.clip(), e.font = `bold ${vi}px system-ui, -apple-system, sans-serif`, e.fillStyle = y ? o.accent : o.textHeader, p ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText($, g + 8, xe / 2), e.shadowBlur = 4, e.fillText($, g + 8, xe / 2), e.shadowBlur = 0) : e.fillText($, g + 8, xe / 2), V) {
      const O = e.measureText($).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent;
      const J = t.sorts[b].dir === "asc" ? "▲" : "▼";
      e.fillText(t.sorts.length > 1 ? `${J}${b + 1}` : J, g + 8 + O + 4, xe / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = y ? o.accent : o.textHeader, e.globalAlpha = y ? 1 : 0.38, e.fillText("⌕", g + w.width - 20, xe / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(g + w.width - 0.5, 0), e.lineTo(g + w.width - 0.5, xe), e.stroke(), g += w.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, xe - 0.5), e.lineTo(l, xe - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, xe, l, v), e.clip();
  const A = t.rowHeights && t.rowHeights.length === c.length ? t.rowHeights : null, P = A ? jt(A, c.length) : null, k = (f) => P ? P[f] : f * u, I = (f) => A ? A[f] : u, S = P ? Ct(P, m) : Math.max(0, Math.floor(m / u));
  let E;
  if (P)
    for (E = S; E < c.length && k(E) < m + v; ) E++;
  else
    E = Math.min(c.length, Math.ceil((m + v) / u));
  const R = t.selectionAnchorRow ?? t.selectedRow, D = t.selectionAnchorCol ?? t.selectedCol, G = t.selectedRow >= 0 && R >= 0 ? Math.min(t.selectedRow, R) : -1, F = t.selectedRow >= 0 && R >= 0 ? Math.max(t.selectedRow, R) : -1, L = t.selectedCol >= 0 && D >= 0 ? Math.min(t.selectedCol, D) : -1, W = t.selectedCol >= 0 && D >= 0 ? Math.max(t.selectedCol, D) : -1, X = F > G || W > L;
  let K = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY, ie = Number.POSITIVE_INFINITY, oe = Number.NEGATIVE_INFINITY;
  const q = (f, w, y, b) => {
    p ? (e.shadowColor = b, e.shadowBlur = 12, e.fillText(f, w, y), e.shadowBlur = 6, e.fillText(f, w, y), e.shadowBlur = 2, e.fillText(f, w, y), e.shadowBlur = 0) : e.fillText(f, w, y);
  };
  for (let f = S; f < E; f++) {
    const w = c[f], y = I(f), b = xe + k(f) - m;
    f % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, b, l, y));
    const V = f >= G && f <= F;
    f === t.hoveredRow && !V && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, b, l, y)), V && !X && (e.fillStyle = zt(o.accent, 0.1), e.fillRect(0, b, l, y)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, b + y - 0.5), e.lineTo(l, b + y - 0.5), e.stroke();
    let $ = -h;
    for (let O = 0; O < r.length; O++) {
      const J = r[O];
      if ($ + J.width <= 0) {
        $ += J.width;
        continue;
      }
      if ($ >= l) break;
      const ue = V && O >= L && O <= W;
      ue && X && (e.fillStyle = zt(o.accent, 0.14), e.fillRect($, b, J.width, y)), ue && ($ < K && (K = $), $ + J.width > ee && (ee = $ + J.width), b < ie && (ie = b), b + y > oe && (oe = b + y));
      const me = t.getCellStyle(J, w), Se = me.color ?? o.text, B = me.textAlign ?? "left", te = t.formatCell(J, w);
      if (e.save(), e.beginPath(), e.rect($ + 1, b, J.width - 2, y), e.clip(), e.font = Tt(), e.fillStyle = Se, e.textBaseline = "middle", J.colDef.wrap) {
        e.textAlign = "left";
        const Q = xn(e, te, Math.max(20, J.width - 16));
        let se = b + bn + St / 2;
        for (const he of Q) {
          if (se - St / 2 >= b + y) break;
          q(he, $ + 8, se, Se), se += St;
        }
      } else {
        const Q = B === "right" ? $ + J.width - 8 : $ + 8;
        e.textAlign = B === "right" ? "right" : "left", q(te, Q, b + y / 2, Se);
      }
      e.restore(), f === t.selectedRow && O === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect($ + 1.5, b + 1.5, J.width - 3, y - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo($ + J.width - 0.5, b), e.lineTo($ + J.width - 0.5, b + y), e.stroke(), $ += J.width;
    }
  }
  if (X && K < ee && ie < oe && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(K + 0.5, ie + 0.5, ee - K - 1, oe - ie - 1)), e.restore(), s.length > 0) {
    const f = a - M - C;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, f - 0.5), e.lineTo(l, f - 0.5), e.stroke();
    for (let w = 0; w < s.length; w++) {
      const y = s[w], b = f + w * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, b, l, u);
      let V = -h;
      for (let $ = 0; $ < r.length; $++) {
        const O = r[$];
        if (V + O.width <= 0) {
          V += O.width;
          continue;
        }
        if (V >= l) break;
        const J = t.getCellStyle(O, y), ue = J.color ?? o.text, me = J.textAlign ?? "left", Se = t.formatCell(O, y);
        e.save(), e.beginPath(), e.rect(V + 1, b, O.width - 2, u), e.clip(), e.font = `bold ${Ut}px system-ui, -apple-system, sans-serif`, e.fillStyle = ue, e.textBaseline = "middle", me === "right" ? (e.textAlign = "right", e.fillText(Se, V + O.width - 8, b + u / 2)) : (e.textAlign = "left", e.fillText(Se, V + 8, b + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(V + O.width - 0.5, b), e.lineTo(V + O.width - 0.5, b + u), e.stroke(), V += O.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, b + u - 0.5), e.lineTo(l, b + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const f = a - C;
    e.fillStyle = zt(o.accent, 0.1), e.fillRect(0, f, l, C), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, f - 0.5), e.lineTo(l, f - 0.5), e.stroke();
    let w = -h;
    for (let y = 0; y < r.length; y++) {
      const b = r[y];
      if (w + b.width <= 0) {
        w += b.width;
        continue;
      }
      if (w >= l) break;
      const $ = t.getCellStyle(b, t.aggregateRow).textAlign ?? "left", O = t.aggregateRow[b.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, f, b.width - 2, C), e.clip(), e.font = `bold ${Ut}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", p && (e.shadowColor = o.accent, e.shadowBlur = 8), $ === "right" ? (e.textAlign = "right", e.fillText(O, w + b.width - 8, f + C / 2)) : (e.textAlign = "left", e.fillText(O, w + 8, f + C / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + b.width - 0.5, f), e.lineTo(w + b.width - 0.5, f + C), e.stroke(), w += b.width;
    }
  }
  e.restore();
}
function zt(n, t) {
  if (n.startsWith("rgba") || n.startsWith("rgb"))
    return n.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(n.slice(1, 3), 16), i = parseInt(n.slice(3, 5), 16), l = parseInt(n.slice(5, 7), 16);
  return `rgba(${e},${i},${l},${t})`;
}
const bt = 190, Ft = 34;
function wi(n, t, e) {
  const i = Math.max(4, Math.min(t, n - bt - 4)), l = xe + 6, a = e ? 26 : 0;
  return {
    box: { x: i, y: l, w: bt, h: Ft },
    input: { x: i + 9, y: l + 5, w: bt - 18 - a, h: Ft - 10 },
    clear: e ? { x: i + bt - 28, y: l, w: 28, h: Ft } : null
  };
}
const Bt = (n, t, e, i = 0) => n >= e.x - i && n <= e.x + e.w + i && t >= e.y && t <= e.y + e.h;
function xt(n, t, e, i = 1) {
  return e.clear && Bt(n, t, e.clear, 4 * (i - 1)) ? "clear" : Bt(n, t, e.input) ? "input" : Bt(n, t, e.box) ? "inside" : "outside";
}
function yi(n, t, e, i, l) {
  const { box: a, input: o, clear: r } = t;
  n.save(), n.fillStyle = "rgba(8,12,22,0.94)", n.strokeStyle = l.accent, n.lineWidth = 1, n.beginPath(), n.roundRect(a.x + 0.5, a.y + 0.5, a.w - 1, a.h - 1, 4), n.fill(), n.stroke(), n.fillStyle = "rgba(255,255,255,0.05)", n.beginPath(), n.roundRect(o.x, o.y, o.w, o.h, 3), n.fill(), n.beginPath(), n.rect(o.x, o.y, o.w, o.h), n.clip(), n.font = Tt(), n.textBaseline = "middle";
  const c = o.y + o.h / 2 + 1, s = 5;
  if (e) {
    n.fillStyle = l.text;
    const u = n.measureText(e).width, m = u > o.w - 2 * s - 2 ? o.x + o.w - s - 2 - u : o.x + s;
    n.fillText(e, m, c), i && (n.fillStyle = l.accent, n.fillRect(Math.min(m + u + 1, o.x + o.w - s), o.y + 4, 1.5, o.h - 8));
  } else
    n.fillStyle = l.textHeader, n.fillText("Filter…", o.x + s, c), i && (n.fillStyle = l.accent, n.fillRect(o.x + s, o.y + 4, 1.5, o.h - 8));
  n.restore(), r && (n.save(), n.font = Tt(), n.textBaseline = "middle", n.textAlign = "center", n.fillStyle = l.textHeader, n.fillText("✕", r.x + r.w / 2, r.y + r.h / 2 + 1), n.restore());
}
function bi(n, t, e) {
  const i = n - 0.5, l = t - 0.5, a = Math.abs(e), o = (i * i + l * l) * a;
  if (e < 0) {
    const s = 0.5 * a, m = 1 / (1 - 2 * (0.5 * (1 + s) * s)), h = (i + i * (1 + o) * o * -1) * m, p = (l + l * (1 + o) * o * -1) * m;
    return [0.5 + h, 0.5 + p];
  }
  const r = i * (1 + o) * o, c = l * (1 + o) * o;
  return [n + r, t + c];
}
function Sn(n, t, e, i, l, a = e, o = i) {
  const r = n / e, c = 1 - t / i, [s, u] = bi(r, c, l);
  return s < 0 || s > 1 || u < 0 || u > 1 ? [-1, -1] : [s * a, (1 - u) * o];
}
function _t(n, t) {
  let e = 0;
  for (let i = 0; i < n; i++) e += t[i].width;
  return e;
}
function xi(n, t, e, i = 1) {
  return n >= t + e - 24 * i && n < t + e;
}
function sn(n, t, e, i = 1) {
  const l = t + e;
  return n >= l - 6 * i && n <= l + 1 * i;
}
function Mi(n, t, e, i, l, a, o, r, c, s = !1, u) {
  const m = n + c;
  let h = -1, p = 0;
  for (let A = 0; A < e.length; A++) {
    if (m >= p && m < p + e[A].width) {
      h = A;
      break;
    }
    p += e[A].width;
  }
  if (t < xe) return { area: "header", colIdx: h, rowIdx: -1 };
  const M = s ? Mn : 0;
  if (M > 0 && t >= o - M)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const C = r * l;
  if (C > 0 && t >= o - C - M) {
    const A = Math.floor((t - (o - C - M)) / l);
    return { area: "pinned", colIdx: h, rowIdx: A };
  }
  const v = t - xe + a, g = u && u.length === i ? Ct(jt(u, i), v) : Math.floor(v / l);
  return g >= 0 && g < i ? { area: "body", colIdx: h, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function tt(n) {
  return n / 45 * 0.55;
}
function Tn(n) {
  const t = Math.abs(tt(n));
  if (t === 0) return 1;
  if (n < 0) {
    const i = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + i) * i));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const Si = 500, Cn = Si / 2, Xt = 1.6, kn = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Ln = `
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
`, Rn = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Dn() {
  return {
    uMouseUV: { value: new z.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Xt },
    uLensTint: { value: new z.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
function In(n, t, e, i, l) {
  const a = t && e.x !== -999;
  n.uniforms.uMouseUV.value.set(e.x, e.y), n.uniforms.uLensR.value = a && l > 0 ? Cn / l : 0, n.uniforms.uAspect.value = l > 0 ? i / l : 1;
}
function vt(n, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (n.clientX - e.left) / e.width,
    y: 1 - (n.clientY - e.top) / e.height
  };
}
const Ti = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ci = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`, ki = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${kn}

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

  ${Ln}

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
    ${Rn}
    gl_FragColor = color;
  }
`;
function Li(n, t, e) {
  const i = n - 0.5, l = t - 0.5, a = Math.abs(e), o = (i * i + l * l) * a, r = (1 + o) * o * Math.sign(e);
  let c = i + i * r, s = l + l * r;
  if (e < 0) {
    const u = 0.5 * a, m = 0.5 * (1 + u) * u;
    c /= 1 - 2 * m, s /= 1 - 2 * m;
  }
  return { x: 0.5 + c, y: 0.5 + s };
}
function Ri(n, t, e, i, l, a) {
  if (!i || e.x === Me.x || a <= 0) return { x: n, y: t };
  const o = l / a, r = Cn / a, c = (n - e.x) * o, s = t - e.y, u = Math.hypot(c, s);
  if (u >= r) return { x: n, y: t };
  const m = u / r, h = Math.min(Math.max((m - 0.88) / (1 - 0.88), 0), 1), p = h * h * (3 - 2 * h), M = Xt + (1 - Xt) * p;
  return { x: e.x + c / M / o, y: e.y + s / M };
}
class Ne {
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
    j(this, "mouse", { x: Me.x, y: Me.y });
    j(this, "anisotropy", 1);
    this.painter = t.paint, this.mode = t.mode ?? "screen", this.maxDpr = t.maxDpr ?? 2, this.canvas = document.createElement("canvas"), this.texture = this.makeTexture(), this.material = new z.ShaderMaterial({
      uniforms: {
        uTex: { value: this.texture },
        uStrength: { value: 0 },
        uScanlines: { value: 1 },
        uVignette: { value: 1 },
        ...Dn()
      },
      vertexShader: this.mode === "world" ? Ci : Ti,
      fragmentShader: ki,
      transparent: !0,
      side: this.mode === "world" ? z.DoubleSide : z.FrontSide
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
    const t = new z.CanvasTexture(this.canvas);
    return t.magFilter = z.LinearFilter, this.mode === "world" ? (t.generateMipmaps = !0, t.minFilter = z.LinearMipmapLinearFilter, t.anisotropy = this.anisotropy) : t.minFilter = z.LinearFilter, t;
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
    this.mouse.x = t ? t.x : Me.x, this.mouse.y = t ? t.y : Me.y;
  }
  /** Push look + lens state into the shader uniforms. */
  syncUniforms() {
    const t = this.material.uniforms;
    t.uStrength.value = tt(this.look.curvature), t.uScanlines.value = this.look.scanlines ? 1 : 0, t.uVignette.value = this.look.vignette ? 1 : 0, In(
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
    const i = Ri(t, e, this.mouse, this.look.magnify, this.screenW || this.logicalW, this.screenH || this.logicalH), l = Li(i.x, i.y, tt(this.look.curvature));
    return l.x < 0 || l.x > 1 || l.y < 0 || l.y > 1 ? null : { x: l.x * this.logicalW, y: (1 - l.y) * this.logicalH };
  }
  dispose() {
    this.texture.dispose(), this.material.dispose();
  }
}
const Di = 600;
function En(n) {
  const t = Kt(!0);
  return t.run(() => Ii(n, t));
}
function Ii(n, t) {
  var nn, ln;
  const { emit: e, host: i } = n, l = U(((nn = n.rowData) == null ? void 0 : nn.call(n)) ?? []), a = U(((ln = n.pinnedBottomRowData) == null ? void 0 : ln.call(n)) ?? []), o = U(""), r = U([]), c = At({}), s = At({}), u = At(/* @__PURE__ */ new Set()), m = U(0), h = U(0), p = U(0), M = U(0), C = U(0), v = U(0), g = U(0), A = U(-1), P = U(null), k = U(null), I = U(null), S = U(""), E = U(0);
  let R = null;
  const D = U(!0);
  let G = null;
  ne(I, (d) => {
    var x;
    G && (clearInterval(G), G = null), d ? (D.value = !0, G = setInterval(() => {
      D.value = !D.value, i.redraw();
    }, 530), De(() => {
      var T;
      return (T = i.focusFilterInput) == null ? void 0 : T.call(i);
    })) : (R = null, (x = i.blurFilterInput) == null || x.call(i)), i.redraw();
  });
  function F(d) {
    return d.colId ?? d.field ?? (d.headerName ? d.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
  }
  const L = re(() => {
    var x;
    const d = ((x = n.defaultColDef) == null ? void 0 : x.call(n)) ?? {};
    return n.columnDefs().filter((T) => !u.has(F(T))).map((T) => {
      const _ = F(T), Y = { ...d, ...T };
      return { colId: _, colDef: Y, width: s[_] ?? Y.width ?? 100 };
    });
  }), W = re(() => {
    const d = h.value;
    if (!d) return L.value;
    const x = L.value.reduce((Y, N) => Y + N.width, 0);
    if (!x || x >= d) return L.value;
    const T = d / x;
    let _ = 0;
    return L.value.map((Y, N) => {
      const le = N === L.value.length - 1 ? d - _ : Math.max(8, Math.round(Y.width * T));
      return _ += le, { ...Y, width: le };
    });
  }), X = re(() => {
    const d = W.value.reduce((x, T) => x + T.width, 0);
    return Math.max(0, d - h.value);
  });
  function K(d, x) {
    if (x.colDef.valueGetter) return x.colDef.valueGetter({ data: d, colDef: x.colDef });
    if (x.colDef.field) return d[x.colDef.field];
  }
  function ee(d, x) {
    const T = K(x, d);
    return d.colDef.valueFormatter ? d.colDef.valueFormatter({ value: T, data: x, colDef: d.colDef }) ?? "" : d.colDef.cellRenderer ? (d.colDef.cellRenderer({ value: T, data: x, colDef: d.colDef }) ?? "").replace(/<[^>]+>/g, "") : T == null ? "" : String(T);
  }
  function ie(d, x) {
    return d.colDef.cellStyle ? typeof d.colDef.cellStyle == "function" ? d.colDef.cellStyle({ value: K(x, d), data: x, colDef: d.colDef }) ?? {} : d.colDef.cellStyle : {};
  }
  function oe() {
    return n.columnDefs().map((d, x) => ({ d, i: x })).filter(({ d }) => d.sort).sort((d, x) => (d.d.sortIndex ?? d.i) - (x.d.sortIndex ?? x.i)).map(({ d }) => ({ colId: F(d), dir: d.sort }));
  }
  const q = re(() => {
    m.value;
    let d = l.value;
    const x = o.value.trim().toLowerCase();
    x && (d = d.filter(
      (_) => L.value.some(
        (Y) => String(K(_, Y) ?? "").toLowerCase().includes(x)
      )
    ));
    for (const [_, Y] of Object.entries(c)) {
      if (!Y) continue;
      const N = L.value.find((Z) => Z.colId === _);
      if (N)
        if (Y.startsWith("__eq__")) {
          const Z = Y.slice(6).toLowerCase();
          d = d.filter((le) => String(K(le, N) ?? "").toLowerCase() === Z);
        } else {
          const Z = Y.toLowerCase();
          d = d.filter((le) => String(K(le, N) ?? "").toLowerCase().includes(Z));
        }
    }
    const T = r.value.map(({ colId: _, dir: Y }) => ({ col: L.value.find((N) => N.colId === _), dir: Y })).filter((_) => !!_.col);
    return T.length && (d = [...d].sort((_, Y) => {
      for (const { col: N, dir: Z } of T) {
        const le = K(_, N), Le = K(Y, N);
        let ke = 0;
        if (N.colDef.comparator ? ke = N.colDef.comparator(le, Le) : typeof le == "number" && typeof Le == "number" ? ke = le - Le : ke = String(le ?? "").localeCompare(String(Le ?? ""), void 0, { numeric: !0 }), ke) return Z === "asc" ? ke : -ke;
      }
      return 0;
    })), d;
  });
  let f = null;
  function w() {
    if (typeof document > "u") return null;
    f || (f = document.createElement("canvas"));
    const d = f.getContext("2d");
    return d && (d.font = Tt()), d;
  }
  const y = re(() => W.value.some((d) => d.colDef.wrap)), b = re(() => {
    if (!y.value) return null;
    const d = w();
    if (!d) return null;
    const x = W.value.filter((_) => _.colDef.wrap), T = n.rowHeight();
    return q.value.map((_) => {
      let Y = 1;
      for (const N of x) {
        const Z = xn(d, ee(N, _), Math.max(20, N.width - 16));
        Z.length > Y && (Y = Z.length);
      }
      return mi(Y, T);
    });
  }), V = re(
    () => b.value ? jt(b.value, q.value.length) : null
  ), $ = re(
    () => V.value ? V.value[q.value.length] : q.value.length * n.rowHeight()
  ), O = re(() => {
    const d = a.value.length * n.rowHeight();
    return Math.max(0, p.value - xe - d);
  }), J = re(() => Math.max(0, $.value - O.value)), ue = re(() => Math.max(1, Math.floor(O.value / n.rowHeight()))), me = re(() => {
    const d = q.value.length;
    if (d === 0) return 0;
    const x = V.value ? Ct(V.value, v.value) : Math.floor(v.value / n.rowHeight());
    return Math.min(d - 1, x);
  }), Se = re(() => {
    const d = q.value.length;
    return d === 0 ? 0 : V.value ? Math.min(d - 1, Ct(V.value, v.value + O.value - 1)) : Math.min(d - 1, me.value + ue.value - 1);
  }), B = re(() => {
    const d = L.value.filter((Y) => Y.colDef.aggFunc != null);
    if (d.length === 0) return null;
    const x = q.value, T = {};
    for (const Y of d) {
      const N = x.map((le) => K(le, Y)), Z = gi(N, Y.colDef.aggFunc);
      if (Z == null) {
        T[Y.colId] = "";
        continue;
      }
      T[Y.colId] = Y.colDef.aggValueFormatter ? Y.colDef.aggValueFormatter(Z) : String(Z);
    }
    const _ = d[0].colId;
    return T[_] === "" && (T[_] = "Σ"), T;
  });
  ne(q, () => {
    v.value = 0, P.value = null;
  }), ne(X, () => {
    g.value = Math.min(g.value, X.value);
  }), ne(J, () => {
    v.value = Math.min(v.value, J.value);
  }), ne(
    [q, () => a.value, W, v, A, P],
    () => De(() => i.redraw())
  ), ne(P, (d) => {
    if (!d) return;
    const x = q.value[d.row], T = W.value[d.col];
    x && T && e("cell-selected", { data: x, row: d.row, col: d.col, colId: T.colId });
  });
  function te(d, x, T, _) {
    M.value = T, C.value = _, h.value = d, p.value = x, g.value = Math.max(0, Math.min(X.value, g.value)), v.value = Math.max(0, Math.min(J.value, v.value));
  }
  function Q(d) {
    const x = V.value, T = x ? x[d] : d * n.rowHeight(), _ = x ? x[d + 1] : T + n.rowHeight();
    T < v.value ? v.value = T : _ > v.value + O.value && (v.value = Math.min(J.value, _ - O.value));
  }
  function se(d) {
    var Y;
    if (!h.value) return;
    let x = 0;
    for (let N = 0; N < d; N++) x += W.value[N].width;
    const T = ((Y = W.value[d]) == null ? void 0 : Y.width) ?? 0, _ = x - g.value;
    _ < 0 ? g.value = Math.max(0, x) : _ + T > h.value && (g.value = Math.min(X.value, x + T - h.value));
  }
  function he() {
    v.value = Math.max(0, v.value - O.value), i.redraw();
  }
  function ge() {
    v.value = Math.min(J.value, v.value + O.value), i.redraw();
  }
  let be = !1, Ie = "", Re = 0, mt = 0, gt = 1, Oe = !1, H = !1, ae = 0, ce = 0, Ke = 0, Be = 0, it = !1;
  function pt(d, x, T = 1) {
    var _;
    be = !0, Ie = d, Re = x, gt = T, mt = ((_ = W.value.find((Y) => Y.colId === d)) == null ? void 0 : _.width) ?? 100, Oe = !1;
  }
  function wt(d, x) {
    H = !0, it = !1, ae = d, ce = x, Ke = g.value, Be = v.value;
  }
  function st(d, x) {
    const T = ae - d, _ = ce - x;
    (Math.abs(T) > 4 || Math.abs(_) > 4) && (it = !0), g.value = Math.max(0, Math.min(X.value, Ke + T)), v.value = Math.max(0, Math.min(J.value, Be + _)), i.redraw();
  }
  function yt() {
    H && (it && (Oe = !0), H = !1);
  }
  function Vn(d, x) {
    if (H) {
      st(d, x);
      return;
    }
    if (!be) return;
    const T = h.value, _ = Math.max(30, mt + (d - Re) * gt), Y = L.value.filter((Z) => Z.colId !== Ie).reduce((Z, le) => Z + le.width, 0), N = T - _;
    N > 10 && (s[Ie] = Math.max(10, Math.round(_ * Y / N))), i.redraw();
  }
  function $n() {
    yt(), be && (be = !1, Oe = !0, e("column-resized"));
  }
  function It(d, x) {
    return Mi(
      d,
      x,
      W.value,
      q.value.length,
      n.rowHeight(),
      v.value,
      p.value,
      a.value.length,
      g.value,
      B.value !== null,
      b.value ?? void 0
    );
  }
  let Et = 0;
  function On(d, x, T) {
    I.value = null;
    const _ = Date.now();
    if (d !== 0) {
      Et = _, g.value = Math.max(0, Math.min(X.value, g.value + d)), i.redraw();
      return;
    }
    if (T && x !== 0) {
      Et = _, g.value = Math.max(0, Math.min(X.value, g.value + x)), i.redraw();
      return;
    }
    _ - Et < Di || (v.value = Math.max(0, Math.min(J.value, v.value + x)), i.redraw());
  }
  function Un(d) {
    if (d.cx < 0)
      return A.value = -1, i.redraw(), null;
    if (I.value && R) {
      const _ = xt(d.cx, d.cy, R, d.hitScale);
      if (_ !== "outside")
        return A.value = -1, i.redraw(), _ === "clear" ? "pointer" : "text";
    }
    const x = It(d.cx, d.cy);
    A.value = x.area === "body" ? x.rowIdx : -1;
    let T;
    if (x.area === "header" && x.colIdx >= 0) {
      const _ = W.value[x.colIdx], Y = _t(x.colIdx, W.value), N = d.cx + g.value;
      T = _ && sn(N, Y, _.width, d.hitScale) ? "col-resize" : "pointer";
    } else x.area === "body" ? T = "pointer" : T = "default";
    return i.redraw(), T;
  }
  function Xn() {
    A.value = -1, i.redraw();
  }
  function Gn(d, x, T) {
    if (d.cx < 0 || I.value && R && xt(d.cx, d.cy, R, d.hitScale) !== "outside") return;
    if (d.cy >= xe) {
      wt(x, T);
      return;
    }
    const _ = d.cx + g.value;
    for (let Y = 0; Y < W.value.length; Y++) {
      const N = W.value[Y], Z = _t(Y, W.value);
      if (N.colDef.resizable !== !1 && sn(_, Z, N.width, d.hitScale)) {
        pt(N.colId, x, d.hitScale);
        return;
      }
    }
  }
  function Nn(d, x) {
    var Y, N, Z;
    const T = { stopPropagation: !1 };
    if (Oe)
      return Oe = !1, T;
    if (be) return T;
    if (d.cx < 0)
      return I.value = null, T;
    if (I.value && R) {
      const le = xt(d.cx, d.cy, R, d.hitScale);
      if (le === "clear")
        return tn(), T;
      if (le !== "outside")
        return (Y = i.focusFilterInput) == null || Y.call(i), T;
      I.value = null;
    }
    const _ = It(d.cx, d.cy);
    if (_.area === "header" && _.colIdx >= 0) {
      const le = W.value[_.colIdx], Le = _t(_.colIdx, W.value), ke = d.cx + g.value;
      if (le.colDef.filter && xi(ke, Le, le.width, d.hitScale))
        T.stopPropagation = !0, I.value === le.colId ? I.value = null : (I.value = le.colId, S.value = (N = c[le.colId]) != null && N.startsWith("__eq__") ? c[le.colId].slice(6) : c[le.colId] ?? "", E.value = Math.max(0, Le - g.value));
      else if (le.colDef.sortable !== !1) {
        I.value = null;
        const je = r.value.find((Ae) => Ae.colId === le.colId), qe = je ? je.dir === "asc" ? "desc" : null : "asc";
        x.shiftKey ? r.value = je ? qe ? r.value.map((Ae) => Ae.colId === le.colId ? { colId: Ae.colId, dir: qe } : Ae) : r.value.filter((Ae) => Ae.colId !== le.colId) : [...r.value, { colId: le.colId, dir: "asc" }] : r.value = qe ? [{ colId: le.colId, dir: qe }] : [], e("sort-changed");
      }
      return T;
    }
    if (I.value = null, _.area === "body" && _.rowIdx >= 0 && _.colIdx >= 0) {
      const le = _.rowIdx;
      x.shiftKey && P.value ? (k.value || (k.value = { ...P.value }), P.value = { row: le, col: _.colIdx }) : (P.value = { row: le, col: _.colIdx }, k.value = { row: le, col: _.colIdx }), (Z = i.focusCanvas) == null || Z.call(i);
      const Le = q.value[le], ke = W.value[_.colIdx];
      Le && ke && (e("row-clicked", { data: Le, event: x }), e("cell-selected", { data: Le, row: le, col: _.colIdx, colId: ke.colId }));
    }
    return T;
  }
  function Kn(d) {
    I.value && (d && R && d.cx >= 0 && xt(d.cx, d.cy, R, d.hitScale) !== "outside" || (I.value = null));
  }
  function jn(d) {
    const T = W.value.length - 1, _ = q.value.length - 1;
    if (!P.value) {
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(d.key) && (d.preventDefault(), P.value = { row: me.value, col: 0 }, k.value = { row: me.value, col: 0 });
      return;
    }
    let { row: Y, col: N } = P.value;
    const Z = (le, Le, ke = !1) => {
      Y = Math.max(0, Math.min(_, le)), N = Math.max(0, Math.min(T, Le)), P.value = { row: Y, col: N }, ke || (k.value = { row: Y, col: N }), Q(Y), se(N);
    };
    switch (d.key) {
      case "ArrowDown":
        d.preventDefault(), Z(Y + 1, N, d.shiftKey);
        break;
      case "ArrowUp":
        d.preventDefault(), Z(Y - 1, N, d.shiftKey);
        break;
      case "ArrowRight":
        d.preventDefault(), d.shiftKey ? Z(Y, N + 1, !0) : N < T ? Z(Y, N + 1) : Z(Y + 1, 0);
        break;
      case "ArrowLeft":
        d.preventDefault(), d.shiftKey ? Z(Y, N - 1, !0) : N > 0 ? Z(Y, N - 1) : Z(Y - 1, T);
        break;
      case "Tab":
        d.preventDefault(), d.shiftKey ? N > 0 ? Z(Y, N - 1) : Z(Y - 1, T) : N < T ? Z(Y, N + 1) : Z(Y + 1, 0);
        break;
      case "Enter":
        d.preventDefault(), d.shiftKey ? Z(Y - 1, N) : Z(Y + 1, N);
        break;
      case "Home":
        d.preventDefault(), d.ctrlKey || d.metaKey ? Z(0, 0, d.shiftKey) : Z(Y, 0, d.shiftKey);
        break;
      case "End":
        d.preventDefault(), d.ctrlKey || d.metaKey ? Z(_, T, d.shiftKey) : Z(Y, T, d.shiftKey);
        break;
      case "PageDown":
        d.preventDefault(), Z(Math.min(_, Y + ue.value), N, d.shiftKey);
        break;
      case "PageUp":
        d.preventDefault(), Z(Math.max(0, Y - ue.value), N, d.shiftKey);
        break;
      case "Escape":
        P.value = null, k.value = null;
        break;
      case "c":
      case "C":
        (d.ctrlKey || d.metaKey) && (d.preventDefault(), qn());
        break;
    }
  }
  function qn() {
    var ke;
    if (!P.value) return;
    const d = W.value, x = q.value, T = k.value ?? P.value, _ = Math.min(T.row, P.value.row), Y = Math.max(T.row, P.value.row), N = Math.min(T.col, P.value.col), Z = Math.max(T.col, P.value.col), le = [];
    for (let je = _; je <= Y; je++) {
      const qe = x[je];
      if (!qe) continue;
      const Ae = [];
      for (let Pt = N; Pt <= Z; Pt++) {
        const on = d[Pt];
        on && Ae.push(ee(on, qe).replace(/[\t\r\n]+/g, " "));
      }
      le.push(Ae.join("	"));
    }
    const Le = le.join(`
`);
    (ke = navigator.clipboard) == null || ke.writeText(Le).catch(() => {
    });
  }
  function Zn(d) {
    S.value = d, d ? c[I.value] = d : delete c[I.value], e("filter-changed");
  }
  function tn() {
    I.value && delete c[I.value], S.value = "", I.value = null, e("filter-changed");
  }
  function Qn() {
    I.value = null;
  }
  function Jn(d, x) {
    if (!I.value || !d.width) return;
    const T = d.getContext("2d");
    if (!T) return;
    T.setTransform(x, 0, 0, x, 0, 0), R = wi(d.width / x, E.value, !!S.value);
    const _ = at[n.theme()] ?? at.none;
    yi(T, R, S.value, D.value, _);
  }
  function ei(d, { dpr: x, glow: T }) {
    var _, Y, N, Z;
    pi(d, {
      cols: W.value,
      rows: q.value,
      pinnedRows: a.value,
      rowHeight: n.rowHeight(),
      // Per-row variable heights for `wrap` columns.
      rowHeights: b.value ?? void 0,
      scrollY: v.value,
      scrollX: g.value,
      theme: n.theme(),
      glow: T,
      sorts: r.value,
      colFilters: c,
      hoveredRow: A.value,
      selectedRow: ((_ = P.value) == null ? void 0 : _.row) ?? -1,
      selectedCol: ((Y = P.value) == null ? void 0 : Y.col) ?? -1,
      selectionAnchorRow: ((N = k.value) == null ? void 0 : N.row) ?? -1,
      selectionAnchorCol: ((Z = k.value) == null ? void 0 : Z.col) ?? -1,
      formatCell: ee,
      getCellStyle: ie,
      aggregateRow: B.value,
      dpr: x
    }), Jn(d, x);
  }
  const ti = {
    setGridOption(d, x) {
      d === "rowData" ? l.value = x : d === "pinnedBottomRowData" ? a.value = x : d === "quickFilterText" && (o.value = x);
    },
    getColumnState() {
      return n.columnDefs().map((d) => {
        var T;
        const x = F(d);
        return {
          colId: x,
          hide: u.has(x),
          sort: ((T = r.value.find((_) => _.colId === x)) == null ? void 0 : T.dir) ?? null,
          sortIndex: r.value.some((_) => _.colId === x) ? r.value.findIndex((_) => _.colId === x) : null,
          width: s[x] ?? d.width
        };
      });
    },
    applyColumnState({ state: d }) {
      const x = d.filter((T) => T.sort).sort((T, _) => (T.sortIndex ?? 0) - (_.sortIndex ?? 0));
      x.length && (r.value = x.map((T) => ({ colId: T.colId, dir: T.sort })));
      for (const T of d)
        T.hide === !0 && u.add(T.colId), T.hide === !1 && u.delete(T.colId), T.width && (s[T.colId] = T.width);
    },
    setFilterModel(d) {
      for (const x of Object.keys(c)) delete c[x];
      if (d)
        for (const [x, T] of Object.entries(d))
          (T == null ? void 0 : T.type) === "equals" ? c[x] = `__eq__${T.filter}` : T != null && T.filter && (c[x] = T.filter);
    },
    getFilterModel() {
      const d = {};
      for (const [x, T] of Object.entries(c))
        T && (d[x] = T.startsWith("__eq__") ? { type: "equals", filter: T.slice(6) } : { type: "contains", filter: T });
      return d;
    },
    async setColumnFilterModel(d, x) {
      x ? x.type === "equals" ? c[d] = `__eq__${x.filter}` : c[d] = x.filter ?? "" : delete c[d];
    },
    onFilterChanged() {
    },
    refreshCells() {
      m.value++;
    },
    exportDataAsCsv({ fileName: d = "export.csv" } = {}) {
      const x = L.value, T = x.map((Z) => Z.colDef.headerName ?? Z.colId).join(","), _ = q.value.map(
        (Z) => x.map((le) => `"${String(ee(le, Z)).replace(/"/g, '""')}"`).join(",")
      ), Y = new Blob([[T, ..._].join(`
`)], { type: "text/csv" }), N = URL.createObjectURL(Y);
      Object.assign(document.createElement("a"), { href: N, download: d }).click(), URL.revokeObjectURL(N);
    },
    resize() {
      var d;
      (d = i.resize) == null || d.call(i);
    },
    resetColumnState() {
      u.clear();
      for (const d of n.columnDefs())
        d.hide && u.add(F(d));
      r.value = oe();
      for (const d of Object.keys(s)) delete s[d];
      for (const d of Object.keys(c)) delete c[d];
      o.value = "", v.value = 0, P.value = null, I.value = null;
    }
  };
  function ni() {
    var d, x;
    for (const T of n.columnDefs())
      T.hide && u.add(F(T));
    r.value.length || (r.value = oe()), l.value = ((d = n.rowData) == null ? void 0 : d.call(n)) ?? [], a.value = ((x = n.pinnedBottomRowData) == null ? void 0 : x.call(n)) ?? [];
  }
  function ii() {
    G && (clearInterval(G), G = null), t.stop();
  }
  return {
    // reactive state / derived
    scrollX: g,
    scrollY: v,
    maxScrollX: X,
    maxScrollY: J,
    filteredRows: q,
    displayCols: W,
    resolvedCols: L,
    aggregateRow: B,
    rowHeights: b,
    firstVisibleRow: me,
    lastVisibleRow: Se,
    visibleRowCount: ue,
    selectedCell: P,
    selectionAnchor: k,
    hoveredRow: A,
    activeFilter: I,
    filterPopupValue: S,
    caretOn: D,
    canvasW: h,
    canvasH: p,
    screenW: M,
    screenH: C,
    sortState: r,
    colFilters: c,
    // helpers
    formatCell: ee,
    getCellValue: K,
    hit: It,
    get resizing() {
      return be;
    },
    get panning() {
      return H;
    },
    // viewport + scrolling
    setViewport: te,
    pageUp: he,
    pageDown: ge,
    ensureRowVisible: Q,
    ensureColVisible: se,
    // input (canvas space)
    wheel: On,
    hover: Un,
    leave: Xn,
    pointerDown: Gn,
    click: Nn,
    docClick: Kn,
    keyDown: jn,
    panStart: wt,
    panMove: st,
    panEnd: yt,
    globalMove: Vn,
    globalUp: $n,
    // filter popup
    setFilterText: Zn,
    clearFilter: tn,
    closeFilter: Qn,
    // paint / api / lifecycle
    paint: ei,
    api: ti,
    init: ni,
    dispose: ii
  };
}
const Ei = ["value"], Pi = ["disabled"], Ai = ["disabled"], zi = 28, Fi = /* @__PURE__ */ Ye({
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
    const e = n, i = t, l = U(null), a = En({
      columnDefs: () => e.columnDefs,
      defaultColDef: () => e.defaultColDef,
      rowData: () => e.rowData,
      pinnedBottomRowData: () => e.pinnedBottomRowData,
      rowHeight: () => e.rowHeight,
      theme: () => e.theme,
      emit: i,
      host: {
        redraw: () => K(),
        resize: () => X(),
        focusCanvas: () => {
          var H;
          return (H = k.value) == null ? void 0 : H.focus();
        },
        focusFilterInput: () => {
          var H;
          return (H = l.value) == null ? void 0 : H.focus();
        },
        blurFilterInput: () => {
          var H;
          return (H = l.value) == null ? void 0 : H.blur();
        }
      }
    }), {
      scrollY: o,
      maxScrollY: r,
      filteredRows: c,
      displayCols: s,
      selectedCell: u,
      firstVisibleRow: m,
      lastVisibleRow: h,
      activeFilter: p,
      filterPopupValue: M,
      formatCell: C,
      pageUp: v,
      pageDown: g,
      clearFilter: A
    } = a, P = U(null), k = U(null), I = ht("cathodeResetTick", U(0));
    ne(I, () => ge());
    let S = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), E = null, R = !1;
    function D() {
      if (E) {
        try {
          E.forceContextLoss();
        } catch {
        }
        try {
          E.dispose();
        } catch {
        }
        E = null;
      }
    }
    let G, F;
    const L = new Ne({
      paint: (H, { dpr: ae, glow: ce }) => a.paint(H, { dpr: ae, glow: ce })
    });
    function W() {
      if (!(!k.value || !P.value)) {
        try {
          E = new z.WebGLRenderer({ canvas: k.value, antialias: !1, alpha: !0 });
        } catch {
          R = !0;
        }
        if (!R && !E.getContext() && (E.dispose(), E = null, R = !0), R) {
          X();
          return;
        }
        E.setPixelRatio(1), E.setClearColor(0, 0), G = new z.Scene(), F = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), G.add(new z.Mesh(new z.PlaneGeometry(2, 2), L.material)), X();
      }
    }
    function X() {
      if (!P.value || !E && !R) return;
      const H = P.value.clientWidth, ae = P.value.clientHeight - (e.pagination ? zi : 0);
      if (!H || !ae) return;
      const ce = e.bendField ? Math.round(H * Tn(e.curvature)) : H;
      L.resize(ce, ae), L.setScreenSize(H, ae), S = L.dpr, a.setViewport(ce, ae, H, ae), E ? (E.setPixelRatio(S), E.setSize(H, ae)) : k.value && (k.value.width = Math.round(H * S), k.value.height = Math.round(ae * S), k.value.style.width = H + "px", k.value.style.height = ae + "px"), K();
    }
    function K() {
      if (!L.canvas.width) return;
      if (R) {
        if (!k.value) return;
        L.paintOnly(!1);
        const ae = L.canvas, ce = k.value.getContext("2d");
        ce && ce.drawImage(ae, 0, 0, ae.width, ae.height, 0, 0, k.value.width, k.value.height);
        return;
      }
      if (!E) return;
      const H = e.theme === "paper";
      L.setLook({
        curvature: e.curvature,
        scanlines: e.scanlines && !H,
        vignette: !H,
        magnify: e.magnify
      }), L.syncUniforms(), L.paint(e.glow), E.render(G, F);
    }
    function ee(H, ae) {
      if (!k.value) return [-1, -1];
      const ce = k.value.getBoundingClientRect(), Ke = H - ce.left, Be = ae - ce.top, it = ce.width, pt = ce.height, wt = tt(e.curvature), [st, yt] = Sn(Ke, Be, it, pt, wt, L.canvas.width / S || it, L.canvas.height / S || pt);
      return st < 0 ? [-1, -1] : [st, yt];
    }
    function ie(H) {
      return ee(H.clientX, H.clientY);
    }
    function oe(H) {
      if (!k.value) return 1;
      const [ae] = ee(H.clientX - 4, H.clientY), [ce] = ee(H.clientX + 4, H.clientY);
      return ae < 0 || ce < 0 ? 1 : Math.max(1, Math.abs(ce - ae) / 8);
    }
    function q(H) {
      const [ae, ce] = ie(H);
      return { cx: ae, cy: ce, hitScale: oe(H) };
    }
    function f(H) {
      a.wheel(H.deltaX, H.deltaY, H.shiftKey);
    }
    function w(H) {
      if (a.resizing) return;
      e.magnify && k.value && L.setLens(vt(H, k.value));
      const ae = a.hover(q(H));
      ae && k.value && (k.value.style.cursor = ae);
    }
    function y() {
      L.setLens(null), a.leave();
    }
    function b(H) {
      a.pointerDown(q(H), H.clientX, H.clientY);
    }
    function V(H) {
      a.click(q(H), H).stopPropagation && H.stopPropagation();
    }
    function $(H) {
      p.value && a.docClick(H.target === k.value ? q(H) : null);
    }
    function O(H) {
      a.globalMove(H.clientX, H.clientY);
    }
    function J() {
      a.globalUp();
    }
    function ue(H) {
      H.touches.length === 1 && a.panStart(H.touches[0].clientX, H.touches[0].clientY);
    }
    function me(H) {
      !a.panning || H.touches.length !== 1 || (H.preventDefault(), a.panMove(H.touches[0].clientX, H.touches[0].clientY));
    }
    function Se() {
      a.panEnd();
    }
    function B(H) {
      a.keyDown(H);
    }
    function te(H) {
      a.setFilterText(H.target.value);
    }
    ne(() => e.theme, () => K()), ne(() => [e.curvature, e.bendField], () => De(X)), ne(() => e.scanlines, () => K()), ne(() => e.glow, () => K()), ne(() => e.magnify, (H) => {
      H || L.setLens(null), K();
    });
    let Q = null, se = null, he = 0;
    function ge() {
      cancelAnimationFrame(he), he = requestAnimationFrame(X);
    }
    function be(H) {
      H.preventDefault();
    }
    function Ie() {
      E == null || E.dispose(), E = null, R = !1, W();
    }
    Fe(() => {
      a.init(), document.addEventListener("click", $), document.addEventListener("mousemove", O), document.addEventListener("mouseup", J), De(() => {
        var H;
        W(), k.value && (k.value.addEventListener("webglcontextlost", be), k.value.addEventListener("webglcontextrestored", Ie)), P.value && (Q = new ResizeObserver(() => X()), Q.observe(P.value), se = new IntersectionObserver((ae) => {
          ae.some((ce) => ce.isIntersecting) && ge();
        }), se.observe(P.value)), window.addEventListener("resize", ge), (H = window.visualViewport) == null || H.addEventListener("resize", ge), i("grid-ready", { api: a.api });
      });
    }), Ve(() => {
      var H, ae, ce;
      document.removeEventListener("click", $), document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", J), (H = k.value) == null || H.removeEventListener("webglcontextlost", be), (ae = k.value) == null || ae.removeEventListener("webglcontextrestored", Ie), Q == null || Q.disconnect(), se == null || se.disconnect(), window.removeEventListener("resize", ge), (ce = window.visualViewport) == null || ce.removeEventListener("resize", ge), cancelAnimationFrame(he), D(), L.dispose(), a.dispose();
    });
    const Re = re(() => at[e.theme] ?? at.none), mt = re(() => ({
      background: Re.value.headerBg,
      borderTop: `1px solid ${Re.value.border}`,
      color: Re.value.text
    })), gt = re(() => ({
      background: Re.value.bg
    })), Oe = re(() => Re.value.accent);
    return (H, ae) => {
      var ce, Ke;
      return we(), ye("div", {
        ref_key: "wrapEl",
        ref: P,
        class: "cathode-wrap",
        style: _e(gt.value)
      }, [
        fe("canvas", {
          ref_key: "canvasEl",
          ref: k,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ze(f, ["prevent"]),
          onMousemove: w,
          onMouseleave: y,
          onMousedown: b,
          onClick: V,
          onKeydown: B,
          onTouchstartPassive: ue,
          onTouchmove: me,
          onTouchend: Se,
          onTouchcancel: Se
        }, null, 544),
        de(p) ? (we(), ye("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: l,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: de(M),
          autofocus: "",
          onInput: te,
          onKeydown: [
            ae[0] || (ae[0] = an(
              //@ts-ignore
              (...Be) => de(A) && de(A)(...Be),
              ["escape"]
            )),
            ae[1] || (ae[1] = an((Be) => de(a).closeFilter(), ["enter"]))
          ]
        }, null, 40, Ei)) : We("", !0),
        n.pagination ? (we(), ye("div", {
          key: 1,
          class: "cathode-pagination",
          style: _e(mt.value)
        }, [
          fe("button", {
            disabled: de(o) <= 0,
            onClick: ae[2] || (ae[2] = (Be) => de(v)())
          }, "◀", 8, Pi),
          fe("span", null, ze((de(m) + 1).toLocaleString()) + "–" + ze(Math.min(de(c).length, de(h) + 1).toLocaleString()) + " / " + ze(de(c).length.toLocaleString()), 1),
          fe("button", {
            disabled: de(o) >= de(r),
            onClick: ae[3] || (ae[3] = (Be) => de(g)())
          }, "▶", 8, Ai),
          fe("span", {
            class: "cathode-page-info",
            style: _e({ color: Oe.value })
          }, ze(de(c).length.toLocaleString()) + " rows ", 5),
          de(u) ? (we(), ye("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: _e({ color: Oe.value })
          }, ze(((ce = de(s)[de(u).col]) == null ? void 0 : ce.colDef.headerName) ?? ((Ke = de(s)[de(u).col]) == null ? void 0 : Ke.colId)) + " : " + ze(de(C)(de(s)[de(u).col], de(c)[de(u).row])), 5)) : We("", !0)
        ], 4)) : We("", !0)
      ], 4);
    };
  }
}), $e = (n, t) => {
  const e = n.__vccOpts || n;
  for (const [i, l] of t)
    e[i] = l;
  return e;
}, Kl = /* @__PURE__ */ $e(Fi, [["__scopeId", "data-v-3f5baab2"]]), kt = {
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
function Bi(n, t) {
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
const _i = 12, Te = 18, dt = 10, et = 6, qt = `${_i}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Wi(n, t, e) {
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
    for (const r of a) {
      const c = o + r;
      if (n.measureText(c).width <= e)
        o = c;
      else if (o && (i.push(o.replace(/\s+$/, "")), o = ""), n.measureText(r).width > e) {
        let s = "";
        for (const u of r)
          n.measureText(s + u).width > e ? (s && i.push(s), s = u) : s += u;
        o = s;
      } else
        o = r.replace(/^\s+/, "");
    }
    o && i.push(o.replace(/\s+$/, ""));
  }
  return i.length ? i : [""];
}
function Pn(n) {
  if (typeof n == "number") {
    const t = new Date(n), e = String(t.getHours()).padStart(2, "0"), i = String(t.getMinutes()).padStart(2, "0"), l = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${i}:${l}`;
  }
  return n;
}
function Hi(n, t) {
  return Math.ceil(n.measureText(t).width) + 12;
}
function Yi(n) {
  const { entries: t, ctx: e, textMaxWidth: i, showTimestamps: l, wordWrap: a } = n, o = n.formatTs ?? Pn;
  e.font = qt;
  const r = [];
  for (let c = 0; c < t.length; c++) {
    const s = t[c], u = s.level ?? "info", m = l && s.ts != null ? o(s.ts) : "", h = a ? Wi(e, s.text, i) : s.text.split(`
`);
    for (let p = 0; p < h.length; p++)
      r.push({
        entryIdx: c,
        text: h[p],
        level: u,
        timestamp: p === 0 ? m : "",
        isFirstFrag: p === 0,
        widthPx: e.measureText(h[p]).width
      });
  }
  return r;
}
function Vi(n, t) {
  const e = n.getContext("2d");
  if (!e) return;
  const i = t.dpr ?? 1, l = n.width / i, a = n.height / i, o = kt[t.theme] ?? kt.none;
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(i, 0, 0, i, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = qt, e.textBaseline = "middle";
  const r = t.visualLines, c = dt - t.scrollX, s = (t.showTimestamps ? dt + t.timestampWidth : dt) - t.scrollX, u = Math.max(0, Math.floor((t.scrollY - et) / Te)), m = Math.min(r.length, Math.ceil((t.scrollY + a - et) / Te) + 1);
  for (let h = u; h < m; h++) {
    const p = r[h], M = et + h * Te - t.scrollY + Te / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = o.rowAlt;
      let v = 1;
      for (; h + v < m && r[h + v].entryIdx === p.entryIdx; ) v++;
      e.fillRect(0, M - Te / 2, l, Te * v);
    }
    t.selectionStart >= 0 && h >= t.selectionStart && h <= t.selectionEnd && (e.fillStyle = o.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, M - Te / 2, l, Te)), h === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M - Te / 2, l, Te)), t.showTimestamps && p.timestamp && (e.fillStyle = o.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = o.timestamp), e.fillText(p.timestamp, c, M), e.shadowBlur = 0);
    const C = Bi(o, p.level);
    e.fillStyle = C, e.textAlign = "left", t.glow ? (e.shadowColor = C, e.shadowBlur = 14, e.fillText(p.text, s, M), e.shadowBlur = 7, e.fillText(p.text, s, M), e.shadowBlur = 3, e.fillText(p.text, s, M), e.shadowBlur = 0) : e.fillText(p.text, s, M);
  }
  e.restore();
}
function cn(n, t, e) {
  if (n < 0) return -1;
  const i = Math.floor((n + t - et) / Te);
  return i < 0 || i >= e ? -1 : i;
}
function $i(n) {
  return et * 2 + n * Te;
}
function An(n) {
  const t = Kt();
  return t.run(() => {
    const e = () => {
      var B;
      return ((B = n.showTimestamps) == null ? void 0 : B.call(n)) ?? !0;
    }, i = () => {
      var B;
      return ((B = n.wordWrap) == null ? void 0 : B.call(n)) ?? !0;
    }, l = U(0), a = U(0), o = U(0), r = U(0), c = U(-1), s = U(!0), u = U(-1), m = U(-1), h = document.createElement("canvas"), p = re(() => {
      var Q;
      const B = n.entries() ?? [], te = ((Q = n.maxLines) == null ? void 0 : Q.call(n)) ?? 0;
      return te > 0 && B.length > te ? B.slice(B.length - te) : B;
    }), M = re(() => {
      var Q;
      if (!e()) return "";
      const B = ((Q = n.formatTs) == null ? void 0 : Q.call(n)) ?? Pn;
      let te = "00:00:00";
      for (const se of p.value) {
        if (se.ts == null) continue;
        const he = B(se.ts);
        he.length > te.length && (te = he);
      }
      return te;
    }), C = U(0), v = U([]);
    function g() {
      var Q;
      const B = h.getContext("2d");
      if (!B) return;
      B.font = qt;
      const te = e() ? Hi(B, M.value) : 0;
      C.value = te, v.value = Yi({
        entries: p.value,
        ctx: B,
        textMaxWidth: Math.max(1, l.value - dt * 2 - te),
        showTimestamps: e(),
        formatTs: (Q = n.formatTs) == null ? void 0 : Q.call(n),
        wordWrap: i()
      });
    }
    const A = re(() => $i(v.value.length)), P = re(() => Math.max(0, A.value - a.value)), k = re(() => {
      let B = 0;
      for (const te of v.value) te.widthPx > B && (B = te.widthPx);
      return dt * 2 + C.value + B;
    }), I = re(() => Math.max(0, k.value - l.value));
    ne(P, () => {
      s.value ? o.value = P.value : o.value = Math.min(o.value, P.value);
    }), ne(I, () => {
      r.value = Math.min(r.value, I.value);
    }), ne(
      [p, l, e, i, M],
      () => {
        g(), De(() => n.host.redraw());
      },
      { deep: !1 }
    ), ne(o, () => n.host.redraw()), ne(r, () => n.host.redraw()), ne(c, () => n.host.redraw()), ne([u, m], () => n.host.redraw());
    function S(B, te) {
      l.value = B, a.value = te, g(), s.value && (o.value = Math.max(0, A.value - a.value));
    }
    function E(B) {
      o.value = Math.max(0, Math.min(P.value, B)), s.value = o.value >= P.value - 4;
    }
    function R(B) {
      r.value = Math.max(0, Math.min(I.value, B));
    }
    function D(B, te, Q) {
      Q ? R(r.value + te) : Math.abs(B) > Math.abs(te) ? R(r.value + B) : E(o.value + te);
    }
    function G() {
      s.value = !0, o.value = P.value;
    }
    function F(B) {
      E(et + B * Te);
    }
    let L = !1, W = !1, X = 0, K = 0, ee = 0, ie = 0;
    function oe(B, te) {
      L = !0, W = !1, X = B, K = te, ee = r.value, ie = o.value;
    }
    function q(B, te) {
      if (!L) return !1;
      const Q = X - B, se = K - te;
      return (Math.abs(Q) > 4 || Math.abs(se) > 4) && (W = !0), R(ee + Q), E(ie + se), !0;
    }
    function f() {
      L && (L = !1, W && (W = !1));
    }
    const w = () => L;
    function y(B) {
      c.value = B < 0 ? -1 : cn(B, o.value, v.value.length);
    }
    function b() {
      c.value = -1;
    }
    function V(B, te) {
      if (W) {
        W = !1;
        return;
      }
      const Q = B < 0 ? -1 : cn(B, o.value, v.value.length);
      if (Q < 0) {
        u.value = -1, m.value = -1;
        return;
      }
      te && u.value >= 0 || (u.value = Q), m.value = Q;
    }
    function $(B, te) {
      const Q = v.value.length;
      if (Q === 0) return;
      const se = m.value < 0 ? 0 : m.value, he = Math.max(0, Math.min(Q - 1, se + B));
      m.value = he, (!te || u.value < 0) && (u.value = he), c.value = he;
      const ge = et + he * Te, be = ge + Te;
      ge < o.value ? E(ge) : be > o.value + a.value && E(be - a.value);
    }
    function O() {
      const B = Math.min(u.value, m.value), te = Math.max(u.value, m.value);
      if (B < 0) return "";
      const Q = v.value, se = /* @__PURE__ */ new Set(), he = [];
      for (let ge = B; ge <= te && ge < Q.length; ge++) {
        const be = Q[ge];
        if (se.has(be.entryIdx)) continue;
        se.add(be.entryIdx);
        let Ie = "";
        for (let Re = 0; Re < Q.length; Re++)
          Q[Re].entryIdx === be.entryIdx && (Ie += (Ie && !Q[Re].isFirstFrag ? " " : "") + Q[Re].text);
        he.push(be.timestamp ? `${be.timestamp}  ${Ie}` : Ie);
      }
      return he.join(`
`);
    }
    async function J() {
      const B = O();
      if (B)
        try {
          await navigator.clipboard.writeText(B);
        } catch {
          const te = document.createElement("textarea");
          te.value = B, te.style.position = "fixed", te.style.opacity = "0", document.body.appendChild(te), te.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(te);
        }
    }
    function ue(B) {
      if ((B.metaKey || B.ctrlKey) && (B.key === "c" || B.key === "C")) {
        u.value >= 0 && (B.preventDefault(), J());
        return;
      }
      if ((B.metaKey || B.ctrlKey) && (B.key === "a" || B.key === "A")) {
        B.preventDefault(), u.value = 0, m.value = v.value.length - 1;
        return;
      }
      switch (B.key) {
        case "ArrowDown":
          B.preventDefault(), $(1, B.shiftKey);
          break;
        case "ArrowUp":
          B.preventDefault(), $(-1, B.shiftKey);
          break;
        case "ArrowRight":
          B.preventDefault(), R(r.value + Te * 2);
          break;
        case "ArrowLeft":
          B.preventDefault(), R(r.value - Te * 2);
          break;
        case "PageDown":
          B.preventDefault(), E(o.value + a.value);
          break;
        case "PageUp":
          B.preventDefault(), E(o.value - a.value);
          break;
        case "Home":
          B.preventDefault(), E(0), R(0);
          break;
        case "End":
          B.preventDefault(), E(P.value);
          break;
        case "Escape":
          u.value = -1, m.value = -1;
          break;
      }
    }
    function me(B, { dpr: te, glow: Q }) {
      Vi(B, {
        visualLines: v.value,
        scrollY: o.value,
        scrollX: r.value,
        theme: n.theme(),
        glow: Q,
        showTimestamps: e(),
        timestampWidth: C.value,
        hoveredLine: c.value,
        selectionStart: Math.min(u.value, m.value),
        selectionEnd: Math.max(u.value, m.value),
        dpr: te
      });
    }
    function Se() {
      t.stop();
    }
    return {
      // state
      canvasW: l,
      canvasH: a,
      scrollY: o,
      scrollX: r,
      hoveredLine: c,
      stuckToBottom: s,
      selectionAnchor: u,
      selectionActive: m,
      visualLines: v,
      tsWidth: C,
      contentH: A,
      maxScrollY: P,
      maxScrollX: I,
      // actions
      setViewport: S,
      setScroll: E,
      setScrollX: R,
      wheel: D,
      scrollToBottom: G,
      scrollToLine: F,
      panStart: oe,
      panMove: q,
      panEnd: f,
      panning: w,
      hover: y,
      leave: b,
      click: V,
      keyDown: ue,
      moveSelection: $,
      selectionAsText: O,
      copySelection: J,
      paint: me,
      dispose: Se
    };
  });
}
const Oi = /* @__PURE__ */ Ye({
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
    const e = n, i = U(null), l = U(null), a = { ...Me }, o = An({
      entries: () => e.entries,
      theme: () => e.theme,
      showTimestamps: () => e.showTimestamps,
      formatTs: () => e.formatTs,
      wordWrap: () => e.wordWrap,
      maxLines: () => e.maxLines,
      host: { redraw: () => v() }
    });
    let r = null, c = !1;
    function s() {
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
    let u, m, h = 1;
    const p = new Ne({
      paint: (y, { dpr: b, glow: V }) => o.paint(y, { dpr: b, glow: V })
    });
    function M() {
      if (!(!l.value || !i.value)) {
        try {
          r = new z.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          c = !0;
        }
        if (!c && !r.getContext() && (r.dispose(), r = null, c = !0), c) {
          C();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), u = new z.Scene(), m = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), u.add(new z.Mesh(new z.PlaneGeometry(2, 2), p.material)), C();
      }
    }
    function C() {
      if (!i.value || !r && !c) return;
      const y = i.value.clientWidth, b = i.value.clientHeight;
      !y || !b || p.resize(y, b) && (p.setScreenSize(y, b), h = p.dpr, o.setViewport(y, b), r ? (r.setPixelRatio(h), r.setSize(y, b)) : l.value && (l.value.width = Math.round(y * h), l.value.height = Math.round(b * h), l.value.style.width = y + "px", l.value.style.height = b + "px"), v());
    }
    function v() {
      if (!p.canvas.width) return;
      if (c) {
        if (!l.value) return;
        p.paintOnly(!1);
        const b = l.value.getContext("2d");
        b && b.drawImage(p.canvas, 0, 0, p.canvas.width, p.canvas.height, 0, 0, l.value.width, l.value.height);
        return;
      }
      if (!r) return;
      const y = e.theme === "paper";
      p.setLook({
        curvature: e.curvature,
        scanlines: e.scanlines && !y,
        vignette: !y,
        magnify: e.magnify
      }), p.setLens(e.magnify ? a : null), p.syncUniforms(), p.paint(e.glow), r.render(u, m);
    }
    ne(() => e.theme, () => v()), ne(() => e.curvature, () => v()), ne(() => e.scanlines, () => v()), ne(() => e.glow, () => v()), ne(() => e.magnify, (y) => {
      y || (a.x = Me.x, a.y = Me.y), v();
    });
    function g(y) {
      if (!l.value) return [-1, -1];
      const b = l.value.getBoundingClientRect();
      return [y.clientX - b.left, y.clientY - b.top];
    }
    function A(y) {
      o.wheel(y.deltaX, y.deltaY, y.shiftKey);
    }
    function P(y) {
      o.panStart(y.clientX, y.clientY), i.value && i.value.focus();
    }
    function k(y) {
      o.panMove(y.clientX, y.clientY);
    }
    function I() {
      o.panEnd();
    }
    function S(y) {
      if (y.touches.length !== 1) return;
      const b = y.touches[0];
      o.panStart(b.clientX, b.clientY), i.value && i.value.focus();
    }
    function E(y) {
      if (!o.panning() || y.touches.length !== 1) return;
      y.preventDefault();
      const b = y.touches[0];
      o.panMove(b.clientX, b.clientY);
    }
    function R() {
      o.panEnd();
    }
    function D(y) {
      const [, b] = g(y);
      o.click(b, y.shiftKey);
    }
    function G(y) {
      o.keyDown(y);
    }
    function F(y) {
      if (e.magnify && l.value) {
        const V = vt(y, l.value);
        a.x = V.x, a.y = V.y, v();
      }
      const [, b] = g(y);
      o.hover(b);
    }
    function L() {
      o.leave(), a.x = Me.x, a.y = Me.y, v();
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        o.scrollToBottom();
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        o.scrollToLine(y);
      }
    });
    let W = null, X = null, K = 0;
    const ee = ht("cathodeResetTick", U(0));
    ne(ee, () => ie());
    function ie() {
      cancelAnimationFrame(K), K = requestAnimationFrame(C);
    }
    function oe(y) {
      y.preventDefault();
    }
    function q() {
      r == null || r.dispose(), r = null, c = !1, M();
    }
    Fe(() => {
      document.addEventListener("mousemove", k), document.addEventListener("mouseup", I), De(() => {
        var y;
        M(), l.value && (l.value.addEventListener("webglcontextlost", oe), l.value.addEventListener("webglcontextrestored", q)), i.value && (W = new ResizeObserver(() => C()), W.observe(i.value), X = new IntersectionObserver((b) => {
          b.some((V) => V.isIntersecting) && ie();
        }), X.observe(i.value)), window.addEventListener("resize", ie), (y = window.visualViewport) == null || y.addEventListener("resize", ie), o.scrollY.value = o.maxScrollY.value;
      });
    }), Ve(() => {
      var y, b, V;
      document.removeEventListener("mousemove", k), document.removeEventListener("mouseup", I), (y = l.value) == null || y.removeEventListener("webglcontextlost", oe), (b = l.value) == null || b.removeEventListener("webglcontextrestored", q), W == null || W.disconnect(), X == null || X.disconnect(), window.removeEventListener("resize", ie), (V = window.visualViewport) == null || V.removeEventListener("resize", ie), cancelAnimationFrame(K), s(), o.dispose(), p.dispose();
    });
    const f = re(() => kt[e.theme] ?? kt.none), w = re(() => ({
      background: f.value.bg
    }));
    return (y, b) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-log-wrap",
      style: _e(w.value),
      tabindex: "0",
      onKeydown: G
    }, [
      fe("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-log-canvas",
        onWheel: Ze(A, ["prevent"]),
        onMousemove: F,
        onMouseleave: L,
        onMousedown: P,
        onClick: D,
        onTouchstartPassive: S,
        onTouchmove: E,
        onTouchend: R,
        onTouchcancel: R
      }, null, 544)
    ], 36));
  }
}), Ui = /* @__PURE__ */ $e(Oi, [["__scopeId", "data-v-328a73e4"]]), Xi = ["disabled"], Gi = /* @__PURE__ */ Ye({
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
    const i = n, l = e, a = U(null), o = U(null), r = U(""), c = U([]), s = U(-1);
    let u = "";
    function m(I) {
      I.trim() && (c.value.length && c.value[c.value.length - 1] === I || (c.value.push(I), c.value.length > i.historyLimit && c.value.splice(0, c.value.length - i.historyLimit)));
    }
    function h(I) {
      if (!i.disabled) {
        if (I.key === "Enter") {
          I.preventDefault();
          const S = r.value;
          S.trim() && m(S), s.value = -1, r.value = "", l("submit", S);
          return;
        }
        if (I.key === "ArrowUp") {
          if (!c.value.length) return;
          I.preventDefault(), s.value === -1 ? (u = r.value, s.value = c.value.length - 1) : s.value > 0 && s.value--, r.value = c.value[s.value];
          return;
        }
        if (I.key === "ArrowDown") {
          if (s.value === -1) return;
          I.preventDefault(), s.value < c.value.length - 1 ? (s.value++, r.value = c.value[s.value]) : (s.value = -1, r.value = u, u = "");
          return;
        }
      }
    }
    const p = U(!0);
    let M = null;
    function C() {
      M || (M = setInterval(() => {
        p.value = !p.value;
      }, 530));
    }
    function v() {
      M && (clearInterval(M), M = null), p.value = !0;
    }
    const g = re(() => {
      let I;
      return i.disabled ? I = " " : i.busy ? I = "█" : I = p.value ? "█" : " ", { level: "info", text: `${i.prompt}${r.value}${I}` };
    }), A = re(
      () => [...i.entries, g.value]
    );
    function P() {
      var I;
      i.disabled || (I = o.value) == null || I.focus();
    }
    ne(() => i.busy, (I, S) => {
      S && !I && !i.disabled && De(() => {
        var E;
        return (E = o.value) == null ? void 0 : E.focus();
      });
    });
    function k() {
      var I;
      (I = o.value) == null || I.focus();
    }
    return t({ focus: k }), Fe(() => {
      C(), i.disabled || requestAnimationFrame(() => {
        var I;
        return (I = o.value) == null ? void 0 : I.focus();
      });
    }), Ve(() => {
      v();
    }), (I, S) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-terminal-wrap",
      onClick: P
    }, [
      pn(Ui, {
        entries: A.value,
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
      wn(fe("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": S[0] || (S[0] = (E) => r.value = E),
        disabled: n.disabled || n.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: h
      }, null, 40, Xi), [
        [ai, r.value]
      ])
    ], 512));
  }
}), jl = /* @__PURE__ */ $e(Gi, [["__scopeId", "data-v-a2b39934"]]), rt = {
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
}, zn = 0.18, ct = 8, Zt = 22, Ni = 4, Pe = 8, Xe = 56, Qt = 42, He = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Ki = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Wt = 4, ji = 1, qi = 1;
function Zi(n, t, e, i = 0, l = !1) {
  const a = l ? Qt : Xe, o = Math.max(0, t - Pe - a), r = Math.max(1, Math.floor(o / e)), c = Math.min(r, n);
  return { firstIdx: Math.max(0, n - c - Math.floor(i / e)), count: c, slotW: e };
}
function Qi(n, t, e) {
  if (!n.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let i = 1 / 0, l = -1 / 0, a = 0;
  const o = Math.min(n.length, t + e);
  for (let c = t; c < o; c++) {
    const s = n[c];
    s && (s.low < i && (i = s.low), s.high > l && (l = s.high), s.volume > a && (a = s.volume));
  }
  if (!isFinite(i) || !isFinite(l) || i === l) {
    const c = isFinite(i) ? i : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, a) };
  }
  const r = (l - i) * 0.04;
  return { min: i - r, max: l + r, maxVol: Math.max(1, a) };
}
function Ji(n, t, e = !1) {
  const i = e ? Ni : Zt, l = Math.max(1, n - ct - i - Wt), a = Math.max(0, Math.round(l * t)), o = l - a;
  return {
    priceY0: ct,
    priceY1: ct + o,
    volumeY0: ct + o + Wt,
    volumeY1: ct + o + Wt + a
  };
}
function Ee(n, t, e, i) {
  const l = t.max - t.min;
  return l <= 0 ? (e + i) / 2 : e + (1 - (n - t.min) / l) * (i - e);
}
function Ge(n, t, e) {
  return Pe + (n - t + 0.5) * e;
}
function Ue(n) {
  const t = Math.abs(n), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return n.toLocaleString("en-US", e);
}
function Jt(n) {
  const t = new Date(n), e = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0"), l = String(t.getHours()).padStart(2, "0"), a = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${i} ${l}:${a}`;
}
function el(n, t) {
  if (n <= 0 || !isFinite(n)) return 1;
  const e = n / Math.max(1, t), i = Math.pow(10, Math.floor(Math.log10(e))), l = e / i;
  let a;
  return l < 1.5 ? a = 1 : l < 3 ? a = 2 : l < 7 ? a = 5 : a = 10, a * i;
}
function Fn(n, t) {
  var M, C, v, g, A;
  const e = n.getContext("2d");
  if (!e) return;
  const i = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(i, 0, 0, i, 0, 0);
  const l = n.width / i, a = n.height / i, o = rt[t.theme] ?? rt.none, r = t.colors ? { ...o, ...t.colors } : o, c = !!t.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = r.bg, e.fillRect(0, 0, l, a), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const s = Zi(t.candles.length, l, t.slotW, t.scrollX, c), u = Qi(t.candles, s.firstIdx, s.count), m = Ji(a, t.showVolume ? t.volumeFraction : 0, c), h = Math.max(ji, Math.floor(t.slotW * 0.7)), p = Math.min(t.candles.length, s.firstIdx + s.count);
  for (let P = s.firstIdx; P < p; P++) {
    const k = t.candles[P];
    if (!k) continue;
    const I = Ge(P, s.firstIdx, t.slotW), S = Ee(k.open, u, m.priceY0, m.priceY1), E = Ee(k.close, u, m.priceY0, m.priceY1), R = Ee(k.high, u, m.priceY0, m.priceY1), D = Ee(k.low, u, m.priceY0, m.priceY1), G = k.close >= k.open, F = G ? r.wickBull : r.wickBear, L = G ? r.candleBull : r.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = L), e.strokeStyle = F, e.lineWidth = qi, e.beginPath(), e.moveTo(Math.round(I) + 0.5, R), e.lineTo(Math.round(I) + 0.5, D), e.stroke(), e.fillStyle = L;
    const W = Math.min(S, E), X = Math.max(1, Math.abs(E - S)), K = Math.round(I - h / 2), ee = Math.round(W), ie = Math.round(X);
    if (e.fillRect(K, ee, h, ie), t.glow && (e.shadowBlur = 4, e.fillRect(K, ee, h, ie)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const oe = Math.round(k.volume / u.maxVol * (m.volumeY1 - m.volumeY0));
      oe > 0 && (e.fillStyle = G ? r.volumeBull : r.volumeBear, e.fillRect(
        Math.round(I - h / 2),
        m.volumeY1 - oe,
        h,
        oe
      ));
    }
  }
  if ((M = t.overlays) != null && M.length) {
    const P = { above: 0, below: 0 }, k = t.overlays.filter((S) => S.kind !== "hline" && !!S.label).length, I = k ? 14 + 14 * k + 12 : 8;
    for (const S of t.overlays)
      S.kind === "hline" ? nl(e, S, l, u, m, r, c, P, I) : tl(e, S, s, u, m, t.slotW);
  }
  (C = t.markers) != null && C.length && ul(e, r, t.markers, t.candles, s, u, m, t.slotW), fl(e, r, u, m, l, c), c || (dl(e, r, t.candles, s, t.slotW, a), sl(e, r, t.candles, l, a)), (v = t.overlays) != null && v.length && ll(e, r, t.overlays, m), t.hover && (hl(e, r, t.candles, s, u, m, t.slotW, t.hover, l), ol(e, r, t.candles, s, t.slotW, t.hover, m, ((g = t.overlays) == null ? void 0 : g.length) ?? 0), (A = t.markers) != null && A.length && rl(e, r, t.markers, t.candles, s, u, m, t.slotW, t.hover, l)), e.restore();
}
function tl(n, t, e, i, l, a) {
  var r;
  const o = e.firstIdx + e.count;
  if (n.save(), n.beginPath(), n.rect(
    Pe,
    l.priceY0,
    /* width: */
    999999,
    l.priceY1 - l.priceY0
  ), n.clip(), t.kind === "line")
    Mt(n, t.data, e.firstIdx, o, a, i, l, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const c = Bn(t.color, t.fillAlpha ?? 0.08);
    il(n, t.upper, t.lower, e.firstIdx, o, a, i, l, c), Mt(n, t.upper, e.firstIdx, o, a, i, l, t.color, 1, !1), Mt(n, t.lower, e.firstIdx, o, a, i, l, t.color, 1, !1), (r = t.middle) != null && r.length && Mt(n, t.middle, e.firstIdx, o, a, i, l, t.color, 1, t.middleDashed !== !1);
  }
  n.restore();
}
function nl(n, t, e, i, l, a, o, r = { above: 0, below: 0 }, c = 8) {
  const s = Ee(t.price, i, l.priceY0, l.priceY1), u = s < l.priceY0 - 0.5, m = s > l.priceY1 + 0.5, h = u || m, p = h ? u ? r.above++ : r.below++ : 0, M = h ? u ? l.priceY0 + c + p * 20 : l.priceY1 - 8 - p * 20 : s, C = o ? Qt : Xe, v = Math.round(M) + 0.5;
  n.save(), h || (n.strokeStyle = t.color, n.lineWidth = t.lineWidth ?? 1, n.setLineDash(t.dashed === !1 ? [] : [4, 3]), n.beginPath(), n.moveTo(Pe, v), n.lineTo(e - C, v), n.stroke(), n.setLineDash([]));
  let g = t.label ?? Ue(t.price);
  if (h && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    n.font = He, n.textBaseline = "middle", n.textAlign = "left";
    const A = n.measureText(g).width, P = 4, k = 2, I = Pe + 2;
    n.fillStyle = t.color, h && (n.globalAlpha = 0.85), n.fillRect(I, M - 7 - k, A + P * 2, 14 + k * 2), n.globalAlpha = 1, n.fillStyle = a.bg && !a.bg.startsWith("rgba(0,0,0,0)") ? a.bg : "#0d1520", n.fillText(g, I + P, M);
  }
  n.restore();
}
function Mt(n, t, e, i, l, a, o, r, c, s) {
  if (!t || !t.length) return;
  n.strokeStyle = r, n.lineWidth = c, n.setLineDash(s ? [4, 3] : []), n.beginPath();
  let u = !1;
  for (let m = e; m < i; m++) {
    const h = t[m];
    if (typeof h != "number" || !isFinite(h)) {
      u && (n.stroke(), n.beginPath(), u = !1);
      continue;
    }
    const p = Ge(m, e, l), M = Ee(h, a, o.priceY0, o.priceY1);
    u ? n.lineTo(p, M) : (n.moveTo(p, M), u = !0);
  }
  u && n.stroke(), n.setLineDash([]);
}
function il(n, t, e, i, l, a, o, r, c) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  n.fillStyle = c;
  let s = !1, u = -1;
  for (let m = i; m <= l; m++) {
    const h = t[m], p = e[m], M = m < l && typeof h == "number" && typeof p == "number" && isFinite(h) && isFinite(p);
    if (M && !s && (u = m, s = !0), !M && s || m === l && s) {
      const C = M ? m + 1 : m;
      n.beginPath();
      for (let v = u; v < C; v++) {
        const g = Ge(v, i, a), A = Ee(t[v], o, r.priceY0, r.priceY1);
        v === u ? n.moveTo(g, A) : n.lineTo(g, A);
      }
      for (let v = C - 1; v >= u; v--) {
        const g = Ge(v, i, a), A = Ee(e[v], o, r.priceY0, r.priceY1);
        n.lineTo(g, A);
      }
      n.closePath(), n.fill(), s = !1;
    }
  }
}
function Bn(n, t) {
  const e = Math.max(0, Math.min(1, t));
  if (n.startsWith("#") && n.length === 7) {
    const i = parseInt(n.slice(1, 3), 16), l = parseInt(n.slice(3, 5), 16), a = parseInt(n.slice(5, 7), 16);
    return `rgba(${i},${l},${a},${e})`;
  }
  return n.startsWith("rgba") ? n.replace(/[\d.]+\)$/, `${e})`) : n.startsWith("rgb(") ? n.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : n;
}
function ll(n, t, e, i) {
  const l = e.filter((C) => C.kind !== "hline" && !!C.label);
  if (!l.length) return;
  n.save(), n.font = He;
  const a = 8, o = 5, r = 12, c = 6, s = 14;
  let u = 0;
  for (const C of l) {
    const v = n.measureText(C.label).width;
    v > u && (u = v);
  }
  const m = a * 2 + r + c + u, h = o * 2 + s * l.length, p = Pe + 4, M = i.priceY0 + 4;
  n.fillStyle = t.panelBg, n.fillRect(p, M, m, h), n.textBaseline = "middle", n.textAlign = "left";
  for (let C = 0; C < l.length; C++) {
    const v = l[C], g = M + o + s * (C + 0.5), A = p + a;
    v.kind === "line" ? (n.strokeStyle = v.color, n.lineWidth = v.lineWidth ?? 1, n.setLineDash(v.dashed ? [3, 3] : []), n.beginPath(), n.moveTo(A, g), n.lineTo(A + r, g), n.stroke(), n.setLineDash([])) : v.kind === "band" && (n.fillStyle = Bn(v.color, v.fillAlpha ?? 0.2), n.fillRect(A, g - 4, r, 8), n.strokeStyle = v.color, n.lineWidth = 1, n.strokeRect(A + 0.5, g - 4 + 0.5, r - 1, 7)), n.fillStyle = t.text, n.fillText(v.label, A + r + c, g);
  }
  n.restore();
}
function ol(n, t, e, i, l, a, o, r) {
  const c = Math.floor((a.x - Pe) / l), s = i.firstIdx + c;
  if (s < 0 || s >= e.length) return;
  const u = e[s];
  if (!u) return;
  const m = u.close - u.open, h = u.open !== 0 ? m / u.open * 100 : 0, p = m >= 0 ? "+" : "", M = [
    ["O", Ue(u.open), void 0],
    ["H", Ue(u.high), void 0],
    ["L", Ue(u.low), void 0],
    ["C", Ue(u.close), void 0],
    ["V", al(u.volume), void 0],
    ["", `${p}${h.toFixed(2)}%`, m >= 0 ? t.candleBull : t.candleBear]
  ];
  n.save(), n.font = He, n.textBaseline = "middle", n.textAlign = "left";
  const C = 8, v = 4, g = 14;
  let A = C;
  for (const [S, E] of M) {
    const R = S ? `${S} ${E}` : E, D = n.measureText(R).width + 12;
    A += D;
  }
  A += C - 12;
  const P = o.priceY0 + 4 + (r > 0 ? v * 2 + 14 * r + 4 : 0), k = Pe + 4;
  n.fillStyle = t.panelBg, n.fillRect(k, P, A, g + v * 2);
  let I = k + C;
  for (let S = 0; S < M.length; S++) {
    const [E, R, D] = M[S];
    n.fillStyle = t.text, E && (n.globalAlpha = 0.6, n.fillText(E + " ", I, P + v + g / 2), n.globalAlpha = 1, I += n.measureText(E + " ").width), D && (n.fillStyle = D), n.fillText(R, I, P + v + g / 2), I += n.measureText(R).width + 12;
  }
  n.restore();
}
function al(n) {
  return !isFinite(n) || n <= 0 ? "0" : n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Math.round(n).toString();
}
function rl(n, t, e, i, l, a, o, r, c, s) {
  if (!i.length) return;
  const u = i.length > 1 ? i[1].start - i[0].start : 6e4, m = Math.max(1, u * 0.5), h = Math.min(i.length, l.firstIdx + l.count), p = 9;
  let M = null;
  for (const R of e) {
    let D = 0, G = i.length - 1, F = -1;
    for (; D <= G; ) {
      const X = D + G >> 1, K = i[X].start - R.timestamp;
      if (Math.abs(K) <= m) {
        F = X;
        break;
      }
      K < 0 ? D = X + 1 : G = X - 1;
    }
    if (F < 0 || F < l.firstIdx || F >= h) continue;
    const L = Ge(F, l.firstIdx, r), W = Ee(R.price, a, o.priceY0, o.priceY1);
    if (Math.abs(c.x - L) <= p && Math.abs(c.y - W) <= p) {
      M = { m: R, x: L, y: W };
      break;
    }
  }
  if (!M) return;
  const C = Jt(M.m.timestamp), v = [
    `${M.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${C}`,
    `@ ${Ue(M.m.price)}`
  ];
  M.m.label && v.push(M.m.label), n.save(), n.font = He, n.textBaseline = "top", n.textAlign = "left";
  const g = 6, A = 14;
  let P = 0;
  for (const R of v) {
    const D = n.measureText(R).width;
    D > P && (P = D);
  }
  const k = P + g * 2, I = v.length * A + g * 2;
  let S = M.x + 12;
  S + k > s - Xe && (S = M.x - 12 - k);
  let E = M.y - I / 2;
  E < o.priceY0 && (E = o.priceY0), E + I > o.priceY1 && (E = o.priceY1 - I), n.fillStyle = t.panelBgSolid, n.strokeStyle = M.m.kind === "entry" ? t.markerEntry : t.markerExit, n.lineWidth = 1, n.fillRect(S, E, k, I), n.strokeRect(S + 0.5, E + 0.5, k - 1, I - 1);
  for (let R = 0; R < v.length; R++) {
    const D = v[R];
    n.fillStyle = R === 0 ? M.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, n.fillText(D, S + g, E + g + R * A);
  }
  n.restore();
}
function sl(n, t, e, i, l) {
  if (e.length < 2) return;
  const a = e[1].start - e[0].start, o = cl(a);
  if (!o) return;
  n.save(), n.font = He, n.textBaseline = "top", n.textAlign = "right";
  const r = 6, c = 3, s = n.measureText(o).width, u = i - Xe - r, m = l - Zt + 4;
  n.fillStyle = t.accent, n.fillRect(u - s - r, m - c, s + r * 2, 14 + c * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(o, u, m), n.restore();
}
function cl(n) {
  if (n <= 0 || !isFinite(n)) return "";
  const t = 1e3, e = 60 * t, i = 60 * e, l = 24 * i, a = 7 * l;
  return n >= a && n % a === 0 ? n / a + "W" : n >= l && n % l === 0 ? n / l + "D" : n >= i && n % i === 0 ? n / i + "h" : n >= e && n % e === 0 ? n / e + "m" : n >= t && n % t === 0 ? n / t + "s" : Math.round(n / e) + "m";
}
function ul(n, t, e, i, l, a, o, r) {
  if (!i.length) return;
  const c = i.length > 1 ? i[1].start - i[0].start : 6e4, s = Math.max(1, c * 0.5), u = Math.min(i.length, l.firstIdx + l.count), m = (p) => {
    let M = 0, C = i.length - 1;
    for (; M <= C; ) {
      const v = M + C >> 1, g = i[v].start - p;
      if (Math.abs(g) <= s) return v;
      g < 0 ? M = v + 1 : C = v - 1;
    }
    return -1;
  }, h = 7;
  for (const p of e) {
    const M = m(p.timestamp);
    if (M < 0 || M < l.firstIdx || M >= u) continue;
    const C = Ge(M, l.firstIdx, r), v = Ee(p.price, a, o.priceY0, o.priceY1);
    if (v < o.priceY0 || v > o.priceY1) continue;
    const g = p.color ?? (p.kind === "entry" ? t.markerEntry : t.markerExit);
    n.fillStyle = g, n.strokeStyle = t.panelBgSolid, n.lineWidth = 1, n.beginPath(), p.kind === "entry" ? (n.moveTo(C, v - h), n.lineTo(C - h, v + h - 1), n.lineTo(C + h, v + h - 1)) : (n.moveTo(C, v + h), n.lineTo(C - h, v - h + 1), n.lineTo(C + h, v - h + 1)), n.closePath(), n.fill(), n.stroke();
  }
}
function fl(n, t, e, i, l, a = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const r = i.priceY1 - i.priceY0, c = a ? Math.max(2, Math.min(4, Math.round(r / 36))) : 6, s = el(o, c), u = Math.ceil(e.min / s) * s, m = a ? Qt : Xe;
  n.font = a ? Ki : He, n.fillStyle = t.text, n.strokeStyle = t.gridline, n.textBaseline = "middle", n.textAlign = "left", n.lineWidth = 1, n.globalAlpha = 0.7;
  for (let h = u; h <= e.max; h += s) {
    const p = Ee(h, e, i.priceY0, i.priceY1);
    p < i.priceY0 || p > i.priceY1 || (n.beginPath(), n.moveTo(Pe, Math.round(p) + 0.5), n.lineTo(l - m, Math.round(p) + 0.5), n.stroke(), n.fillText(Ue(h), l - m + 3, p));
  }
  n.globalAlpha = 1;
}
function dl(n, t, e, i, l, a) {
  if (i.count <= 0 || !e.length) return;
  const r = Math.max(1, Math.floor(i.count / 6));
  n.font = He, n.fillStyle = t.text, n.textBaseline = "top", n.textAlign = "center", n.globalAlpha = 0.7;
  const c = Math.min(e.length, i.firstIdx + i.count);
  for (let s = i.firstIdx; s < c; s += r) {
    const u = e[s];
    if (!u) continue;
    const m = Ge(s, i.firstIdx, l);
    n.fillText(Jt(u.start), m, a - Zt + 4);
  }
  n.globalAlpha = 1;
}
function hl(n, t, e, i, l, a, o, r, c) {
  const s = Math.floor((r.x - Pe) / o), u = Math.max(0, Math.min(e.length - 1, i.firstIdx + s)), m = e[u];
  if (!m) return;
  const h = Ge(u, i.firstIdx, o);
  n.save(), n.strokeStyle = t.accent, n.lineWidth = 1, n.setLineDash([3, 3]), n.globalAlpha = 0.6, n.beginPath(), n.moveTo(Math.round(h) + 0.5, a.priceY0), n.lineTo(Math.round(h) + 0.5, a.volumeY1 || a.priceY1), n.stroke();
  const p = Math.max(a.priceY0, Math.min(a.priceY1, r.y));
  n.beginPath(), n.moveTo(Pe, Math.round(p) + 0.5), n.lineTo(c - Xe, Math.round(p) + 0.5), n.stroke(), n.setLineDash([]), n.globalAlpha = 1;
  const M = l.max - l.min;
  if (M > 0) {
    const g = l.max - (p - a.priceY0) / (a.priceY1 - a.priceY0) * M, A = Ue(g);
    n.font = He, n.textBaseline = "middle", n.textAlign = "left";
    const P = n.measureText(A).width, k = 4, I = 2;
    n.fillStyle = t.accent, n.fillRect(c - Xe + 2, p - 7 - I, P + k * 2, 14 + I * 2), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(A, c - Xe + 2 + k, p);
  }
  n.font = He, n.textBaseline = "top", n.textAlign = "center";
  const C = Jt(m.start), v = n.measureText(C).width;
  n.fillStyle = t.accent, n.fillRect(h - v / 2 - 4, a.volumeY1 + 2, v + 8, 14), n.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, n.fillText(C, h, a.volumeY1 + 4), n.restore();
}
const Ht = 0.25, Yt = 6, un = 8;
function _n(n) {
  const t = Kt();
  return t.run(() => {
    const e = U(0), i = U(0), l = U(0), a = U(1), o = U(null), r = re(() => Math.max(1, n.slotW() * a.value));
    ne(
      [n.theme, n.slotW, n.showVolume, n.volumeFraction, () => {
        var R;
        return (R = n.compact) == null ? void 0 : R.call(n);
      }, () => n.candles(), () => {
        var R;
        return (R = n.overlays) == null ? void 0 : R.call(n);
      }, () => {
        var R;
        return (R = n.markers) == null ? void 0 : R.call(n);
      }],
      () => n.host.redraw(),
      { deep: !1 }
    ), ne(() => {
      var R;
      return (R = n.colors) == null ? void 0 : R.call(n);
    }, () => n.host.redraw(), { deep: !0 }), ne(l, () => n.host.redraw()), ne(a, () => n.host.redraw()), ne(o, () => n.host.redraw()), ne(r, () => n.host.redraw());
    function c(R, D) {
      e.value = R, i.value = D;
    }
    function s(R) {
      var W;
      const D = r.value;
      if (D <= 0) return 0;
      const G = ((W = n.candles()) == null ? void 0 : W.length) ?? 0, F = Math.max(1, Math.floor((e.value || 1) / D)), L = Math.max(0, G - F);
      return Math.max(0, Math.min(R, L * D));
    }
    function u(R, D, G, F) {
      if (R !== 0 || G && D !== 0) {
        const K = R !== 0 ? R : D;
        l.value = s(l.value + K);
        return;
      }
      if (D === 0) return;
      const L = n.candles(), W = r.value, X = Math.exp(-D * 15e-4);
      if (F >= 0 && W > 0 && (L != null && L.length)) {
        const K = Math.max(1, Math.floor((e.value || 1) / W)), ie = Math.max(0, L.length - K - Math.floor(l.value / W)) + (F - un) / W, oe = Math.max(Ht, Math.min(Yt, a.value * X));
        a.value = oe;
        const q = n.slotW() * oe, f = Math.max(1, Math.floor((e.value || 1) / q)), w = ie - (F - un) / q, y = Math.max(0, L.length - f - w);
        l.value = s(y * q);
      } else
        a.value = Math.max(Ht, Math.min(Yt, a.value * X));
    }
    let m = !1, h = 0, p = 0;
    function M(R) {
      m = !0, h = R, p = l.value, o.value = null;
    }
    function C(R) {
      return m ? (l.value = s(p + (R - h)), !0) : !1;
    }
    function v() {
      m = !1;
    }
    const g = () => m;
    function A(R, D) {
      m || (o.value = R < 0 || D < 0 ? null : { x: R, y: D });
    }
    function P() {
      o.value = null;
    }
    function k(R) {
      a.value = Math.max(Ht, Math.min(Yt, a.value * Math.exp(R * 0.18))), l.value = s(l.value);
    }
    function I(R) {
      const D = r.value, G = R.shiftKey ? 20 : 3;
      switch (R.key) {
        case "ArrowLeft":
          R.preventDefault(), l.value = s(l.value + D * G);
          break;
        case "ArrowRight":
          R.preventDefault(), l.value = s(l.value - D * G);
          break;
        case "ArrowUp":
          R.preventDefault(), k(1);
          break;
        case "ArrowDown":
          R.preventDefault(), k(-1);
          break;
        case "Home":
          R.preventDefault(), l.value = s(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          R.preventDefault(), l.value = 0;
          break;
      }
    }
    function S(R, { dpr: D, glow: G }) {
      var F, L, W, X;
      Fn(R, {
        candles: n.candles(),
        slotW: r.value,
        scrollX: l.value,
        theme: n.theme(),
        glow: G,
        showVolume: n.showVolume(),
        volumeFraction: n.volumeFraction(),
        hover: o.value,
        overlays: (F = n.overlays) == null ? void 0 : F.call(n),
        markers: (L = n.markers) == null ? void 0 : L.call(n),
        compact: (W = n.compact) == null ? void 0 : W.call(n),
        colors: (X = n.colors) == null ? void 0 : X.call(n),
        dpr: D
      });
    }
    function E() {
      t.stop();
    }
    return {
      canvasW: e,
      canvasH: i,
      scrollX: l,
      zoomLevel: a,
      hover: o,
      effectiveSlotW: r,
      setViewport: c,
      clampScroll: s,
      wheel: u,
      panStart: M,
      panMove: C,
      panEnd: v,
      panning: g,
      hoverAt: A,
      leave: P,
      keyDown: I,
      applyZoom: k,
      paint: S,
      dispose: E
    };
  });
}
const vl = /* @__PURE__ */ Ye({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: zn },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(n) {
    const t = n, e = U(null), i = U(null), l = { ...Me }, a = _n({
      candles: () => t.candles,
      theme: () => t.theme,
      slotW: () => t.slotW,
      showVolume: () => t.showVolume,
      volumeFraction: () => t.volumeFraction,
      overlays: () => t.overlays,
      markers: () => t.markers,
      compact: () => t.compact,
      colors: () => t.colors,
      host: { redraw: () => C() }
    });
    let o = null, r = !1;
    function c() {
      if (o) {
        try {
          o.forceContextLoss();
        } catch {
        }
        try {
          o.dispose();
        } catch {
        }
        o = null;
      }
    }
    let s, u, m = 1;
    const h = new Ne({
      paint: (f, { dpr: w, glow: y }) => a.paint(f, { dpr: w, glow: y })
    });
    function p() {
      if (!(!i.value || !e.value)) {
        if (t.flat) {
          r = !0, M();
          return;
        }
        try {
          o = new z.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          r = !0;
        }
        if (!r && !o.getContext() && (o.dispose(), o = null, r = !0), r) {
          M();
          return;
        }
        o.setPixelRatio(1), o.setClearColor(0, 0), s = new z.Scene(), u = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), s.add(new z.Mesh(new z.PlaneGeometry(2, 2), h.material)), M();
      }
    }
    function M() {
      if (!e.value || !o && !r) return;
      const f = e.value.clientWidth, w = e.value.clientHeight;
      !f || !w || h.resize(f, w) && (h.setScreenSize(f, w), m = h.dpr, a.setViewport(f, w), o ? (o.setPixelRatio(m), o.setSize(f, w)) : i.value && (i.value.width = Math.round(f * m), i.value.height = Math.round(w * m), i.value.style.width = f + "px", i.value.style.height = w + "px"), C());
    }
    function C() {
      if (!h.canvas.width) return;
      if (r) {
        if (!i.value) return;
        h.paintOnly(!1);
        const w = i.value.getContext("2d");
        w && (w.clearRect(0, 0, i.value.width, i.value.height), w.drawImage(h.canvas, 0, 0));
        return;
      }
      if (!o) return;
      const f = t.theme === "paper";
      h.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !f,
        vignette: !f,
        magnify: t.magnify
      }), h.setLens(t.magnify ? l : null), h.syncUniforms(), h.paint(t.glow), o.render(s, u);
    }
    ne(() => t.curvature, () => C()), ne(() => t.scanlines, () => C()), ne(() => t.glow, () => C()), ne(() => t.magnify, (f) => {
      f || (l.x = Me.x, l.y = Me.y), C();
    }), ne(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    });
    let v = null, g = null, A = 0;
    const P = ht("cathodeResetTick", U(0));
    ne(P, () => k());
    function k() {
      cancelAnimationFrame(A), A = requestAnimationFrame(M);
    }
    function I(f) {
      f.preventDefault();
    }
    function S() {
      o == null || o.dispose(), o = null, r = !1, p();
    }
    function E(f) {
      if (!i.value) return [-1, -1];
      const w = i.value.getBoundingClientRect();
      return [f.clientX - w.left, f.clientY - w.top];
    }
    function R(f) {
      const [w] = E(f);
      a.wheel(f.deltaX, f.deltaY, f.shiftKey, w);
    }
    function D(f) {
      f.button === 0 && (a.panStart(f.clientX), e.value && e.value.focus());
    }
    function G(f) {
      a.keyDown(f);
    }
    function F(f) {
      a.panMove(f.clientX);
    }
    function L() {
      a.panEnd();
    }
    function W(f) {
      f.touches.length === 1 && a.panStart(f.touches[0].clientX);
    }
    function X(f) {
      !a.panning() || f.touches.length !== 1 || (f.preventDefault(), a.panMove(f.touches[0].clientX));
    }
    function K() {
      a.panEnd();
    }
    function ee(f) {
      if (t.magnify && i.value) {
        const b = vt(f, i.value);
        l.x = b.x, l.y = b.y, C();
      }
      const [w, y] = E(f);
      a.hoverAt(w, y);
    }
    function ie() {
      a.leave(), l.x = Me.x, l.y = Me.y, C();
    }
    Fe(() => {
      document.addEventListener("mousemove", F), document.addEventListener("mouseup", L), De(() => {
        var f;
        p(), i.value && (i.value.addEventListener("webglcontextlost", I), i.value.addEventListener("webglcontextrestored", S)), e.value && (v = new ResizeObserver(() => M()), v.observe(e.value), g = new IntersectionObserver((w) => {
          w.some((y) => y.isIntersecting) && k();
        }), g.observe(e.value)), window.addEventListener("resize", k), (f = window.visualViewport) == null || f.addEventListener("resize", k);
      });
    }), Ve(() => {
      var f, w, y;
      document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", L), (f = i.value) == null || f.removeEventListener("webglcontextlost", I), (w = i.value) == null || w.removeEventListener("webglcontextrestored", S), v == null || v.disconnect(), g == null || g.disconnect(), window.removeEventListener("resize", k), (y = window.visualViewport) == null || y.removeEventListener("resize", k), cancelAnimationFrame(A), c(), a.dispose(), h.dispose();
    });
    const oe = re(() => rt[t.theme] ?? rt.none), q = re(() => ({
      background: oe.value.bg
    }));
    return (f, w) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: _e(q.value),
      tabindex: "0",
      onKeydown: G
    }, [
      fe("canvas", {
        ref_key: "canvasEl",
        ref: i,
        class: "cathode-candle-canvas",
        onWheel: Ze(R, ["prevent"]),
        onMousedown: D,
        onMousemove: ee,
        onMouseleave: ie,
        onTouchstartPassive: W,
        onTouchmove: X,
        onTouchend: K,
        onTouchcancel: K
      }, null, 544)
    ], 36));
  }
}), ql = /* @__PURE__ */ $e(vl, [["__scopeId", "data-v-f2099684"]]), lt = 22, ut = 6, ml = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, gl = /* @__PURE__ */ Ye({
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
    const e = n, i = t, l = U(null), a = U(null), o = U(-1), r = U(0), c = { ...Me };
    let s = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, m = !1;
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
    let p, M, C, v, g;
    const A = U(0), P = U(0), k = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${kn}

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

  ${Ln}

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

    ${Rn}

    gl_FragColor = color;
  }
`;
    function I() {
      if (!(!a.value || !l.value)) {
        g = document.createElement("canvas");
        try {
          u = new z.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !u.getContext() && (u.dispose(), u = null, m = !0), m) {
          S();
          return;
        }
        u.setPixelRatio(s), u.setClearColor(0, 0), p = new z.Scene(), M = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new z.CanvasTexture(g), v.minFilter = z.LinearFilter, v.magFilter = z.LinearFilter, C = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Dn()
          },
          vertexShader: ml,
          fragmentShader: k,
          transparent: !0
        }), p.add(new z.Mesh(new z.PlaneGeometry(2, 2), C)), S();
      }
    }
    function S() {
      if (!l.value || !u && !m) return;
      const f = l.value.clientWidth, w = l.value.clientHeight;
      if (!f || !w) return;
      A.value = f, P.value = w, s = Math.min(window.devicePixelRatio || 1, 2);
      const y = e.bendField ? Math.round(f * Tn(e.curvature)) : f, b = Math.round(y * s), V = Math.round(w * s), $ = g.width !== b || g.height !== V;
      g.width = b, g.height = V, u ? ($ && v && (v.dispose(), v = new z.CanvasTexture(g), v.minFilter = z.LinearFilter, v.magFilter = z.LinearFilter, C.uniforms.uTex.value = v), u.setPixelRatio(s), u.setSize(f, w)) : a.value && (a.value.width = Math.round(f * s), a.value.height = Math.round(w * s), a.value.style.width = f + "px", a.value.style.height = w + "px"), L();
    }
    function E() {
      const f = (g == null ? void 0 : g.width) || 0, w = Math.max(1, Math.floor(f / e.minCellW)), y = Math.floor(f / w), b = Math.round(y * e.cellAspect), V = lt + b + ut;
      return { rects: e.cells.map((O, J) => ({
        x: J % w * y,
        y: Math.floor(J / w) * V - r.value,
        w: y,
        h: V
      })), rowH: V, totalH: Math.ceil(e.cells.length / w) * V, cols: w };
    }
    const R = () => {
      const { totalH: f } = E();
      return Math.max(0, f - ((g == null ? void 0 : g.height) || 0));
    }, D = /* @__PURE__ */ new Map();
    function G(f, w, y) {
      const b = f.candles[f.candles.length - 1], V = `${w}x${y}@${s}|${f.candles.length}|${b ? b.start + ":" + b.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, $ = D.get(f.id);
      if ($ && $.key === V) return $.canvas;
      const O = ($ == null ? void 0 : $.canvas) ?? document.createElement("canvas");
      O.width = Math.round(w * s), O.height = Math.round(y * s);
      const J = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, f.candles.length))), ue = w < 260 && f.overlays ? f.overlays.map((me) => ({ ...me, label: "" })) : f.overlays;
      return Fn(O, {
        candles: f.candles,
        slotW: J,
        scrollX: Math.max(0, f.candles.length * J - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: ue,
        compact: !0,
        colors: e.colors,
        dpr: s
      }), D.set(f.id, { canvas: O, key: V }), O;
    }
    const F = re(() => ({ ...rt[e.theme] ?? rt.none, ...e.colors ?? {} }));
    function L() {
      var b;
      if (!(g != null && g.width)) return;
      const f = g.getContext("2d");
      if (!f) return;
      const w = F.value;
      f.setTransform(1, 0, 0, 1, 0, 0), f.clearRect(0, 0, g.width, g.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (f.fillStyle = w.bg, f.fillRect(0, 0, g.width, g.height)), f.setTransform(s, 0, 0, s, 0, 0);
      const { rects: y } = E();
      f.font = "600 11px ui-monospace, SFMono-Regular, monospace", f.textBaseline = "middle";
      for (let V = 0; V < e.cells.length; V++) {
        const $ = e.cells[V], O = y[V];
        if (O.y + O.h < 0 || O.y > g.height / s) continue;
        const J = O.x + ut / 2, ue = O.w - ut;
        f.strokeStyle = $.open ? w.candleBull : w.gridline, f.lineWidth = V === o.value ? 2 : 1, f.strokeRect(J + 0.5, O.y + 0.5, ue - 1, O.h - ut - 1), f.save(), f.beginPath(), f.rect(J, O.y, ue, lt), f.clip();
        const me = O.y + lt / 2 + 1, Se = $.note ? f.measureText($.note).width + ($.open ? 22 : 12) : $.open ? 16 : 0, B = $.badge ? f.measureText($.badge).width + 6 : 0, te = ue - 14 - B - Se;
        let Q = $.title;
        if (f.measureText(Q).width > te) {
          for (; Q.length > 1 && f.measureText(Q + "…").width > te; ) Q = Q.slice(0, -1);
          Q += "…";
        }
        let se = J + 7;
        f.fillStyle = w.text, f.textAlign = "left", f.fillText(Q, se, me), se += f.measureText(Q).width + 6, $.badge && (f.fillStyle = w.accent, f.fillText($.badge, se, me)), $.note && (f.textAlign = "right", f.fillStyle = $.noteColor || w.accent, f.fillText($.note, J + ue - ($.open ? 16 : 7), me), f.textAlign = "left"), f.restore(), $.open && (f.fillStyle = w.candleBull, f.beginPath(), f.arc(J + ue - 9, O.y + lt / 2 + 1, 3, 0, Math.PI * 2), f.fill());
        const he = O.y + lt, ge = O.h - lt - ut;
        $.candles.length ? f.drawImage(G($, ue - 2, ge - 1), J + 1, he, ue - 2, ge - 1) : (f.fillStyle = w.accent, f.textAlign = "center", f.fillText("· · ·", J + ue / 2, he + ge / 2), f.textAlign = "left");
      }
      if (m) {
        const V = (b = a.value) == null ? void 0 : b.getContext("2d");
        V && a.value && V.drawImage(g, 0, 0, g.width, g.height, 0, 0, a.value.width, a.value.height);
        return;
      }
      !u || !C || !v || (C.uniforms.uStrength.value = tt(e.curvature), C.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, C.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, In(C, e.magnify, c, A.value || g.width, P.value || g.height), v.needsUpdate = !0, u.render(p, M));
    }
    function W(f) {
      if (!a.value) return [-1, -1];
      const w = a.value.getBoundingClientRect();
      return Sn(
        f.clientX - w.left,
        f.clientY - w.top,
        w.width,
        w.height,
        tt(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((g == null ? void 0 : g.width) || w.width) / s,
        ((g == null ? void 0 : g.height) || w.height) / s
      );
    }
    function X(f, w) {
      if (f < 0) return -1;
      const { rects: y } = E();
      return y.findIndex((b) => f >= b.x && f < b.x + b.w && w >= b.y && w < b.y + b.h);
    }
    function K(f) {
      const [w, y] = W(f), b = X(w, y);
      b >= 0 && i("cell-click", e.cells[b].id);
    }
    function ee(f) {
      if (e.magnify && a.value) {
        const V = vt(f, a.value);
        c.x = V.x, c.y = V.y;
      }
      const [w, y] = W(f), b = X(w, y);
      b !== o.value ? (o.value = b, L()) : e.magnify && L(), a.value && (a.value.style.cursor = b >= 0 ? "pointer" : "default");
    }
    function ie() {
      o.value = -1, c.x = Me.x, c.y = Me.y, L();
    }
    function oe(f) {
      const w = R();
      w <= 0 || (f.preventDefault(), r.value = Math.max(0, Math.min(w, r.value + f.deltaY)), L());
    }
    let q = null;
    return Fe(() => {
      I(), q = new ResizeObserver(() => S()), l.value && q.observe(l.value);
    }), Ve(() => {
      q == null || q.disconnect(), h(), D.clear();
    }), ne(() => [e.curvature, e.bendField], () => De(S)), ne(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      r.value = Math.min(r.value, R()), L();
    }, { deep: !1 }), (f, w) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-candle-grid-wrap"
    }, [
      fe("canvas", {
        ref_key: "canvasEl",
        ref: a,
        onClick: K,
        onMousemove: ee,
        onMouseleave: ie,
        onWheel: oe
      }, null, 544)
    ], 512));
  }
}), Zl = /* @__PURE__ */ $e(gl, [["__scopeId", "data-v-9f2b24f8"]]), en = U(0), Gt = 28, ot = 12;
let Nt = 10, Lt = "cathode.layout", Rt = !1;
const Ce = U({});
function pl(n, t = "cathode.layout") {
  if (!Rt) {
    Rt = !0, Lt = t;
    try {
      const e = localStorage.getItem(Lt);
      if (e) {
        Ce.value = JSON.parse(e), fn();
        return;
      }
    } catch {
    }
    Ce.value = { ...n }, fn();
  }
}
function fn() {
  let n = 10;
  for (const t of Object.values(Ce.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > n && (n = t.zIndex);
  Nt = n;
}
function nt() {
  localStorage.setItem(Lt, JSON.stringify(Ce.value));
}
function wl(n) {
  Rt = !1, localStorage.removeItem(Lt), Ce.value = { ...n }, nt(), Rt = !0, en.value++;
}
function Wn(n) {
  Nt++, Ce.value[n] && (Ce.value[n].zIndex = Nt);
}
function yl(n, t) {
  Ce.value[n].visible = t, nt();
}
function bl(n, t) {
  Ce.value[n].minimized = t, t && (Ce.value[n].maximized = !1), nt();
}
function xl(n, t) {
  Ce.value[n].maximized = t, t && (Ce.value[n].minimized = !1, Wn(n)), nt();
}
function Ml(n, t, e) {
  Ce.value[n].x = Math.round(t), Ce.value[n].y = Math.round(e), nt();
}
function Sl(n, t, e) {
  Ce.value[n].w = Math.round(t), Ce.value[n].h = Math.round(e), nt();
}
function Ql(n, t, e) {
  const i = Math.ceil(Math.sqrt(e.length)), l = Math.ceil(e.length / i), a = Math.floor((n - ot * (i + 1)) / i), o = Math.floor((t - ot * (l + 1)) / l), r = {};
  return e.forEach((c, s) => {
    const u = s % i, m = Math.floor(s / i);
    r[c] = {
      x: ot + u * (a + ot),
      y: ot + m * (o + ot),
      w: a,
      h: o,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), r;
}
function Hn() {
  return {
    containers: Ce,
    TITLEBAR_H: Gt,
    load: pl,
    save: nt,
    reset: wl,
    bringToFront: Wn,
    setVisible: yl,
    setMinimized: bl,
    setMaximized: xl,
    updatePos: Ml,
    updateSize: Sl
  };
}
const Tl = { class: "ws-toolbar" }, Cl = {
  key: 0,
  class: "ws-restore-menu"
}, kl = {
  key: 0,
  class: "ws-restore-empty"
}, Ll = ["onClick"], Rl = /* @__PURE__ */ Ye({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(n) {
    const t = n, { containers: e, load: i, reset: l, setVisible: a } = Hn(), o = U(null);
    rn("cathodeWorkspace", o), rn("cathodeResetTick", en), Fe(() => {
      if (!o.value) return;
      const { clientWidth: v, clientHeight: g } = o.value, A = t.initialLayout ?? {};
      i(A, t.storageKey ?? "cathode.layout");
      const P = Object.keys(e.value)[0];
      P && r(P);
    });
    function r(v) {
      var A;
      document.querySelectorAll(".cc").forEach((P) => P.classList.remove("cc-focused"));
      const g = (A = o.value) == null ? void 0 : A.querySelector(`#cc-${v}`);
      g && g.classList.add("cc-focused");
    }
    function c() {
      !o.value || !t.initialLayout || l(t.initialLayout);
    }
    function s(v) {
      const g = v.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((A) => A.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = U(!1), m = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function h(v) {
      a(v, !0), u.value = !1;
    }
    function p(v) {
      if (!u.value) return;
      const g = v.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function M(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Fe(() => {
      document.addEventListener("click", p), document.addEventListener("keydown", M);
    }), Ve(() => {
      document.removeEventListener("click", p), document.removeEventListener("keydown", M);
    });
    function C(v) {
      var g;
      return ((g = t.containerTitles) == null ? void 0 : g[v]) ?? v;
    }
    return (v, g) => (we(), ye("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      Ot(v.$slots, "default", {}, void 0, !0),
      Ot(v.$slots, "overlay", {}, void 0, !0),
      fe("div", Tl, [
        n.initialLayout ? (we(), ye("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : We("", !0),
        g[1] || (g[1] = fe("div", { class: "ws-sep" }, null, -1)),
        fe("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (A) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      pn(ri, { name: "menu" }, {
        default: si(() => [
          u.value ? (we(), ye("div", Cl, [
            g[3] || (g[3] = fe("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? We("", !0) : (we(), ye("div", kl, " No closed panels ")),
            (we(!0), ye(ci, null, ui(m(), (A) => (we(), ye("div", {
              key: A,
              class: "ws-restore-item",
              onClick: (P) => h(A)
            }, [
              g[2] || (g[2] = fe("span", { class: "ws-restore-icon" }, "⊞", -1)),
              fi(" " + ze(C(A)), 1)
            ], 8, Ll))), 128))
          ])) : We("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Jl = /* @__PURE__ */ $e(Rl, [["__scopeId", "data-v-5838d04b"]]), Dl = ["id"], Il = { class: "cc-title" }, El = {
  key: 0,
  class: "cc-size-badge"
}, Pl = { class: "cc-controls" }, Al = ["title"], zl = { class: "cc-body" }, Fl = 200, Bl = 80, dn = 60, _l = /* @__PURE__ */ Ye({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(n) {
    const t = n, { containers: e, bringToFront: i, setVisible: l, setMinimized: a, setMaximized: o, updatePos: r, updateSize: c } = Hn(), s = ht("cathodeWorkspace", U(null)), u = re(() => e.value[t.id]), m = re(() => {
      const f = u.value, w = t.curvature ?? 0;
      if (!f) return {};
      const y = { "--curvature": Math.abs(w) };
      return f.maximized ? { ...y, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: f.zIndex } : {
        ...y,
        left: f.x + "px",
        top: f.y + "px",
        width: f.w + "px",
        height: f.minimized ? Gt + "px" : f.h + "px",
        zIndex: f.zIndex,
        display: f.visible ? "flex" : "none"
      };
    });
    let h = !1, p = 0, M = 0;
    function C(f) {
      var b;
      if (f.target.closest(".cc-btn") || u.value.maximized) return;
      i(t.id), h = !0;
      const w = (b = s.value) == null ? void 0 : b.querySelector(`#cc-${t.id}`);
      if (!w) return;
      const y = w.getBoundingClientRect();
      p = f.clientX - y.left, M = f.clientY - y.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), f.preventDefault();
    }
    function v(f) {
      var $;
      if (!h || !s.value) return;
      const w = s.value.getBoundingClientRect(), y = (($ = u.value) == null ? void 0 : $.w) ?? 300;
      let b = f.clientX - w.left - p, V = f.clientY - w.top - M;
      b = Math.max(dn - y, Math.min(w.width - dn, b)), V = Math.max(0, Math.min(w.height - Gt, V)), r(t.id, b, V);
    }
    function g() {
      h = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let A = !1, P = 0, k = 0, I = 0, S = 0;
    const E = U("");
    function R(f) {
      u.value.maximized || (i(t.id), A = !0, P = f.clientX, k = f.clientY, I = u.value.w, S = u.value.h, document.addEventListener("mousemove", D), document.addEventListener("mouseup", G), f.preventDefault(), f.stopPropagation());
    }
    function D(f) {
      if (!A) return;
      const w = Math.max(Fl, I + (f.clientX - P)), y = Math.max(Bl, S + (f.clientY - k));
      c(t.id, w, y), E.value = `${Math.round(w)}×${Math.round(y)}`;
    }
    function G() {
      A = !1, E.value = "", document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", G), F.value++;
    }
    const F = U(0);
    ne(en, () => {
      F.value++;
    }), Ve(() => {
      var f;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", G), (f = L.value) == null || f.removeEventListener("scroll", X), K();
    });
    const L = U(null);
    function W(f) {
      if (t.canvas) return [];
      const w = f.children[0];
      return w ? Array.from(w.children) : [];
    }
    function X() {
      const f = L.value, w = t.curvature ?? 0;
      if (!f) return;
      const y = W(f);
      if (!y.length) return;
      const b = f.clientHeight, V = b / 2, $ = w * 38e-4;
      y.forEach((O) => {
        if (!O.dataset.origFs) {
          const he = getComputedStyle(O);
          O.dataset.origFs = he.fontSize, O.dataset.origLh = he.lineHeight;
        }
        if (w === 0) {
          O.style.fontSize = "", O.style.lineHeight = "";
          return;
        }
        const J = O.getBoundingClientRect(), ue = f.getBoundingClientRect(), me = J.top - ue.top + J.height / 2, Se = Math.min(1, Math.abs(me - V) / (b / 2)), B = 1 + $ * Math.cos(Se * Math.PI / 2), te = parseFloat(O.dataset.origFs), Q = O.dataset.origLh, se = Q === "normal" ? te * 1.4 : parseFloat(Q);
        isNaN(te) || (O.style.fontSize = `${(te * B).toFixed(2)}px`), isNaN(se) || (O.style.lineHeight = `${(se * B).toFixed(2)}px`);
      });
    }
    function K() {
      const f = L.value;
      f && W(f).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    ne(() => t.curvature, (f) => {
      (f ?? 0) === 0 ? K() : X();
    }), Fe(() => {
      var f;
      (f = L.value) == null || f.addEventListener("scroll", X, { passive: !0 }), De(X);
    });
    function ee() {
      a(t.id, !u.value.minimized), De(() => {
        F.value++;
      });
    }
    function ie() {
      o(t.id, !u.value.maximized), De(() => {
        F.value++;
      });
    }
    function oe() {
      l(t.id, !1);
    }
    function q() {
      i(t.id);
    }
    return (f, w) => u.value && u.value.visible ? (we(), ye("div", {
      key: 0,
      id: `cc-${n.id}`,
      class: di(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": n.canvas }]),
      style: _e(m.value),
      onMousedown: q
    }, [
      fe("div", {
        class: "cc-titlebar",
        onMousedown: C
      }, [
        w[0] || (w[0] = fe("span", { class: "cc-status-dot" }, null, -1)),
        fe("span", Il, ze(n.title), 1),
        E.value ? (we(), ye("span", El, ze(E.value), 1)) : We("", !0),
        fe("div", Pl, [
          fe("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ze(ee, ["stop"])
          }, "─"),
          fe("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Ze(ie, ["stop"])
          }, ze(u.value.maximized ? "⤡" : "⤢"), 9, Al),
          fe("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ze(oe, ["stop"])
          }, "✕")
        ])
      ], 32),
      wn(fe("div", zl, [
        fe("div", {
          ref_key: "bodyEl",
          ref: L,
          class: "cc-screen",
          onScroll: X
        }, [
          Ot(f.$slots, "default", { resizeKey: F.value }, void 0, !0),
          w[1] || (w[1] = fe("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [hi, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (we(), ye("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ze(R, ["stop"])
      }, null, 32)) : We("", !0)
    ], 46, Dl)) : We("", !0);
  }
}), eo = /* @__PURE__ */ $e(_l, [["__scopeId", "data-v-ca0af4ca"]]), Wl = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Hl = `
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
`, Yl = 100, Vl = /* @__PURE__ */ Ye({
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
    }, i = U(null), l = U(null);
    let a = null, o = !1;
    function r() {
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
    let c, s, u, m, h, p = null, M = 0;
    function C(S) {
      S - M >= Yl && (A(), M = S), p = requestAnimationFrame(C);
    }
    function v() {
      if (!i.value || !h) return;
      const S = i.value.clientWidth, E = i.value.clientHeight;
      S <= 0 || E <= 0 || h.width === S && h.height === E || (h.width = S, h.height = E, a && a.setSize(S, E, !1), l.value && (l.value.width = S, l.value.height = E, l.value.style.width = S + "px", l.value.style.height = E + "px"));
    }
    function g() {
      if (!(h != null && h.width)) return;
      const S = h.getContext("2d");
      if (!S) return;
      const E = h.width, R = h.height, D = e[t.theme] ?? e.none;
      S.clearRect(0, 0, E, R), S.fillStyle = D.bg, S.fillRect(0, 0, E, R);
      const G = Date.now(), F = (G / 500 | 0) % 2 === 0, L = (G / 400 | 0) % 4;
      S.font = `bold ${Math.max(14, Math.min(E, R) * 0.06)}px monospace`, S.textAlign = "center", S.textBaseline = "middle", S.fillStyle = D.text, t.glow && (S.shadowColor = D.text, S.shadowBlur = 14);
      const W = ".".repeat(L).padEnd(3, " "), X = `${t.label}${W}`;
      if (S.fillText(X, E / 2, R / 2), S.shadowBlur = 0, F) {
        const K = S.measureText(X), ee = S.measureText("M").width, ie = parseFloat(S.font), oe = E / 2 + K.width / 2 + 4, q = R / 2 - ie / 2 + 2;
        S.fillStyle = D.cursor, t.glow && (S.shadowColor = D.cursor, S.shadowBlur = 12), S.fillRect(oe, q, ee * 0.7, ie * 0.95), S.shadowBlur = 0;
      }
    }
    function A() {
      if (!h) return;
      if (g(), o) {
        if (!l.value) return;
        const E = l.value.getContext("2d");
        E && E.drawImage(h, 0, 0);
        return;
      }
      if (!a || !u || !m) return;
      const S = t.theme === "paper";
      u.uniforms.uStrength.value = tt(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !S ? 1 : 0, u.uniforms.uVignette.value = S ? 0 : 1, m.needsUpdate = !0, a.render(c, s);
    }
    function P() {
      if (!(!l.value || !i.value)) {
        h = document.createElement("canvas");
        try {
          a = new z.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          o = !0;
        }
        if (!o && !a.getContext() && (a.dispose(), a = null, o = !0), o) {
          v();
          return;
        }
        a.setPixelRatio(1), a.setClearColor(0, 0), c = new z.Scene(), s = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new z.CanvasTexture(h), m.minFilter = z.LinearFilter, m.magFilter = z.LinearFilter, u = new z.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Wl,
          fragmentShader: Hl,
          transparent: !0
        }), c.add(new z.Mesh(new z.PlaneGeometry(2, 2), u)), v();
      }
    }
    let k = null;
    Fe(() => {
      P(), A(), p = requestAnimationFrame(C), i.value && (k = new ResizeObserver(() => v()), k.observe(i.value));
    }), Ve(() => {
      p !== null && cancelAnimationFrame(p), k == null || k.disconnect(), r(), m == null || m.dispose(), u == null || u.dispose();
    }), ne(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => A());
    const I = re(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (S, E) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-loader-wrap",
      style: _e(I.value)
    }, [
      fe("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), to = /* @__PURE__ */ $e(Vl, [["__scopeId", "data-v-d00e5f47"]]), Dt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, hn = (n, t) => t === "left" ? n.left : t === "right" ? n.right : !t || t === "neutral" ? n.dim : t, pe = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ve = 12;
function Vt(n, t, e) {
  const i = [];
  for (const l of t.split(`
`)) {
    let a = "";
    for (const o of l.split(" ")) {
      const r = a ? `${a} ${o}` : o;
      a && n.measureText(r).width > e ? (i.push(a), a = o) : a = r;
    }
    i.push(a);
  }
  return i;
}
function ft(n, t, e, i, l, a) {
  const o = Math.min(a, i / 2, l / 2);
  n.beginPath(), n.moveTo(t + o, e), n.lineTo(t + i - o, e), n.quadraticCurveTo(t + i, e, t + i, e + o), n.lineTo(t + i, e + l - o), n.quadraticCurveTo(t + i, e + l, t + i - o, e + l), n.lineTo(t + o, e + l), n.quadraticCurveTo(t, e + l, t, e + l - o), n.lineTo(t, e + o), n.quadraticCurveTo(t, e, t + o, e), n.closePath();
}
function Yn(n, t) {
  var E, R;
  const e = n.getContext("2d");
  if (!e) return 0;
  const i = t.dpr || 1, l = n.width / i, a = n.height / i, o = { ...Dt[t.theme] ?? Dt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n.width, n.height), e.setTransform(i, 0, 0, i, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, l, a);
  const r = (D) => D > 0 ? o.right : D < 0 ? o.left : o.neutral, c = r(t.value), s = (D, G = 10) => {
    t.glow && (e.shadowColor = D, e.shadowBlur = G);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, m = Math.max(40, l - ve * 2);
  let h = ve;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const p = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${pe}`;
  const M = e.measureText(p).width;
  e.fillStyle = c, s(c, 14), e.fillText(p, ve, h + 30), u();
  const C = ve + M + 14;
  t.stance && (e.font = `700 14px ${pe}`, e.fillStyle = c, s(c, 8), e.fillText(t.stance.toUpperCase(), C, h + 15), u()), t.sub && (e.font = `11px ${pe}`, e.fillStyle = o.dim, e.fillText(t.sub, C, h + 31)), h += 48, e.font = `700 9px ${pe}`;
  const v = t.leftLabel.toUpperCase(), g = t.rightLabel.toUpperCase(), A = e.measureText(v).width, P = e.measureText(g).width, k = ve + A + 8, I = l - ve - P - 8, S = h + 10;
  if (e.fillStyle = o.left, e.fillText(v, ve, S + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(g, l - ve, S + 3), e.textAlign = "left", I - k > 24) {
    const D = e.createLinearGradient(k, 0, I, 0);
    D.addColorStop(0, o.left), D.addColorStop(0.45, o.surface), D.addColorStop(0.55, o.surface), D.addColorStop(1, o.right), ft(e, k, S - 4, I - k, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = D, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const G = (k + I) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(G, S - 8), e.lineTo(G, S + 8), e.stroke();
    for (const K of [0.25, 0.75]) {
      const ee = k + K * (I - k);
      e.beginPath(), e.moveTo(ee, S - 5), e.lineTo(ee, S + 5), e.stroke();
    }
    const F = t.max - t.min || 1, L = Math.max(0, Math.min(1, (t.shown - t.min) / F)), W = k + L * (I - k), X = r(t.shown);
    e.beginPath(), e.moveTo(W, S - 10), e.lineTo(W - 4.5, S - 17), e.lineTo(W + 4.5, S - 17), e.closePath(), e.fillStyle = X, e.fill(), e.beginPath(), e.arc(W, S, 6.5, 0, Math.PI * 2), e.fillStyle = X, s(X, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
    for (const K of t.marks ?? []) {
      const ee = (K.value - t.min) / F;
      if (ee < 0 || ee > 1) continue;
      const ie = k + ee * (I - k), oe = hn(o, K.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = oe, e.lineWidth = 1, e.beginPath(), e.moveTo(ie, S - 9), e.lineTo(ie, S + 9), e.stroke(), e.restore(), K.label) {
        e.font = `700 8px ${pe}`, e.fillStyle = oe;
        const q = e.measureText(K.label).width;
        e.fillText(K.label, Math.max(k, Math.min(I - q, ie - q / 2)), S + 20);
      }
    }
  }
  if (h += (E = t.marks) != null && E.some((D) => D.label) ? 42 : 30, t.meter) {
    const D = t.meter, G = D.min ?? 0, F = D.max ?? 1, L = F - G || 1, W = D.tone === "up" ? o.right : D.tone === "down" ? o.left : D.tone === "warn" ? o.warn : o.neutral;
    D.label && (e.font = `700 9px ${pe}`, e.fillStyle = o.dim, e.fillText(D.label.toUpperCase(), ve, h + 9)), D.hint && (e.font = `9px ${pe}`, e.fillStyle = o.dim, e.textAlign = "right", e.fillText(D.hint, l - ve, h + 9), e.textAlign = "left"), (D.label || D.hint) && (h += 15), e.font = `700 12px ${pe}`;
    const X = D.valueText ?? (D.value == null ? "—" : String(D.value)), K = e.measureText(X).width, ee = ve, ie = l - ve - K - 10, oe = h + 6, q = !!((R = D.thresholds) != null && R.some((f) => f.label));
    if (ie - ee > 24) {
      if (ft(e, ee, oe - 5, ie - ee, 10, 5), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), D.value != null) {
        const f = Math.max(0, Math.min(1, (D.value - G) / L));
        f > 0 && (e.save(), ft(e, ee, oe - 5, ie - ee, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = W, s(W, 8), e.fillRect(ee, oe - 5, (ie - ee) * f, 10), e.restore());
      }
      for (const f of D.thresholds ?? []) {
        const w = (f.value - G) / L;
        if (w < 0 || w > 1) continue;
        const y = ee + w * (ie - ee), b = hn(o, f.color);
        if (e.strokeStyle = b, e.lineWidth = 1, e.beginPath(), e.moveTo(y, oe - 7), e.lineTo(y, oe + 7), e.stroke(), f.label) {
          e.font = `700 7.5px ${pe}`, e.fillStyle = b;
          const V = e.measureText(f.label).width;
          e.fillText(f.label, Math.max(ee, Math.min(ie - V, y - V / 2)), oe + 17);
        }
      }
    }
    e.font = `700 12px ${pe}`, e.fillStyle = W, e.textAlign = "right", s(W, 8), e.fillText(X, l - ve, oe + 4), u(), e.textAlign = "left", h += q ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${pe}`;
    const D = Vt(e, t.caption, m - 18), G = D.length * 15 + 12;
    ft(e, ve, h, m, G, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, D.forEach((F, L) => e.fillText(F, ve + 9, h + 17 + L * 15)), h += G + 10;
  }
  if (t.note) {
    e.font = `10px ${pe}`, e.fillStyle = o.dim;
    const D = Vt(e, t.note, m);
    D.forEach((G, F) => e.fillText(G, ve, h + 10 + F * 14)), h += D.length * 14 + 10;
  }
  if (t.items.length) {
    let F = ve;
    for (const L of t.items) {
      const W = L.side === "left" ? o.left : L.side === "right" ? o.right : o.neutral, X = L.side === "left" ? t.sideLetters[0] : L.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${pe}`;
      const K = e.measureText(L.label).width;
      e.font = `700 8px ${pe}`;
      const ee = X ? e.measureText(X).width + 6 : 0;
      e.font = `10px ${pe}`;
      const ie = L.value ? e.measureText(L.value).width : 0, oe = 7 + K + (X ? 4 + ee : 0) + (L.value ? 4 + ie : 0) + 7;
      F + oe > l - ve && F > ve && (F = ve, h += 23), ft(e, F, h, oe, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = W, e.fillRect(F, h + 1, 2, 16);
      let q = F + 7;
      e.font = `700 10px ${pe}`, e.fillStyle = o.text, e.fillText(L.label, q, h + 12.5), q += K + 4, X && (e.font = `700 8px ${pe}`, e.fillStyle = W, e.fillText(X, q + 3, h + 12), q += ee + 4), L.value && (e.font = `10px ${pe}`, e.fillStyle = L.tone === "up" ? o.right : L.tone === "down" ? o.left : o.dim, e.fillText(L.value, q, h + 12.5)), F += oe + 5;
    }
    h += 18;
  } else if (t.emptyText) {
    e.font = `10px ${pe}`, e.fillStyle = o.dim;
    const D = Vt(e, t.emptyText, m);
    D.forEach((G, F) => e.fillText(G, ve, h + 10 + F * 14)), h += D.length * 14;
  }
  return h + ve;
}
const $l = /* @__PURE__ */ Ye({
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
    const t = n, e = U(null), i = U(null), l = () => (t.min + t.max) / 2, a = U(t.animate ? l() : t.value);
    let o = 0;
    function r() {
      if (cancelAnimationFrame(o), !t.animate) {
        a.value = t.value, v();
        return;
      }
      const F = () => {
        const L = t.value - a.value;
        if (Math.abs(L) < 4e-3) {
          a.value = t.value, v();
          return;
        }
        a.value += L * 0.18, v(), o = requestAnimationFrame(F);
      };
      o = requestAnimationFrame(F);
    }
    ne(() => t.value, r);
    let c = null, s = !1;
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
    let m, h;
    const p = new Ne({
      paint: (F, { dpr: L, glow: W }) => Yn(F, {
        dpr: L,
        theme: t.theme,
        colors: t.colors,
        glow: W,
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
    function M() {
      if (!(!i.value || !e.value)) {
        try {
          c = new z.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0 });
        } catch {
          s = !0;
        }
        if (!s && !c.getContext() && (c.dispose(), c = null, s = !0), s) {
          C();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), m = new z.Scene(), h = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), m.add(new z.Mesh(new z.PlaneGeometry(2, 2), p.material)), C();
      }
    }
    function C() {
      if (!e.value || !c && !s) return;
      const F = e.value.clientWidth, L = e.value.clientHeight;
      p.resize(F, L) && (c ? (c.setPixelRatio(p.dpr), c.setSize(F, L)) : i.value && (i.value.width = p.canvas.width, i.value.height = p.canvas.height, i.value.style.width = F + "px", i.value.style.height = L + "px"), v());
    }
    function v() {
      if (!p.canvas.width) return;
      if (s) {
        if (!i.value) return;
        p.paintOnly(!1);
        const L = i.value.getContext("2d");
        L && (L.setTransform(1, 0, 0, 1, 0, 0), L.clearRect(0, 0, i.value.width, i.value.height), L.drawImage(p.canvas, 0, 0));
        return;
      }
      if (!c) return;
      const F = t.theme === "paper";
      p.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !F,
        vignette: !F,
        magnify: t.magnify
      }), p.syncUniforms(), p.paint(t.glow), c.render(m, h);
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
      () => v(),
      { deep: !0 }
    ), ne(() => t.magnify, (F) => {
      F || p.setLens(null), v();
    });
    function g(F) {
      !t.magnify || !i.value || (p.setLens(vt(F, i.value)), v());
    }
    function A() {
      p.setLens(null), v();
    }
    let P = null, k = null, I = 0;
    const S = ht("cathodeResetTick", U(0));
    ne(S, () => E());
    function E() {
      cancelAnimationFrame(I), I = requestAnimationFrame(C);
    }
    function R(F) {
      F.preventDefault();
    }
    function D() {
      c == null || c.dispose(), c = null, s = !1, M(), v();
    }
    Fe(() => {
      De(() => {
        var F;
        M(), i.value && (i.value.addEventListener("webglcontextlost", R), i.value.addEventListener("webglcontextrestored", D)), e.value && (P = new ResizeObserver(() => C()), P.observe(e.value), k = new IntersectionObserver((L) => {
          L.some((W) => W.isIntersecting) && E();
        }), k.observe(e.value)), window.addEventListener("resize", E), (F = window.visualViewport) == null || F.addEventListener("resize", E), r();
      });
    }), Ve(() => {
      var F, L, W;
      cancelAnimationFrame(o), cancelAnimationFrame(I), (F = i.value) == null || F.removeEventListener("webglcontextlost", R), (L = i.value) == null || L.removeEventListener("webglcontextrestored", D), P == null || P.disconnect(), k == null || k.disconnect(), window.removeEventListener("resize", E), (W = window.visualViewport) == null || W.removeEventListener("resize", E), u(), p.dispose();
    });
    const G = re(() => ({
      background: (Dt[t.theme] ?? Dt.none).bg
    }));
    return (F, L) => (we(), ye("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: _e(G.value)
    }, [
      fe("canvas", {
        ref_key: "canvasEl",
        ref: i,
        class: "cathode-gauge-canvas",
        onMousemove: g,
        onMouseleave: A
      }, null, 544)
    ], 4));
  }
}), no = /* @__PURE__ */ $e($l, [["__scopeId", "data-v-6c2fc3b2"]]);
function io(n, t = 1) {
  if (n.mode !== "world")
    throw new Error("createSurfaceMesh needs a CathodeSurface created with mode: 'world'");
  const e = n.logicalH > 0 ? n.logicalW / n.logicalH : 16 / 9, i = new z.Mesh(new z.PlaneGeometry(t * e, t), n.material);
  return i.userData.cathodeSurface = n, i;
}
function lo(n, t, e = 1) {
  const i = t.logicalH > 0 ? t.logicalW / t.logicalH : 1.7777777777777777;
  n.geometry.dispose(), n.geometry = new z.PlaneGeometry(e * i, e);
}
const Qe = 26, $t = 20, vn = 18, mn = 4, gn = 8, Je = 16, Ol = { w: 240, h: 160 }, Ul = { w: 1600, h: 1e3 };
class Xl {
  constructor(t, e) {
    j(this, "id");
    j(this, "content");
    j(this, "group", new z.Group());
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
    var c, s;
    this.stage = t, this.id = e.id, this._title = e.title ?? e.id, this.controls = e.controls ?? [], this.content = e.content, this.resizable = !!e.resizable && typeof e.content.resize == "function", this.minSize = e.minSize ?? Ol, this.maxSize = e.maxSize ?? Ul, this.glow = e.glow ?? !0;
    const i = e.content.surface;
    if (i.mode !== "world") throw new Error("CathodeStage3D panels need a CathodeSurface created with mode: 'world'");
    const l = t.pxPerUnit, a = e.content.width / l, o = e.content.height / l, r = Qe / l;
    if (this.body = new z.Mesh(new z.PlaneGeometry(a, o), i.material), this.barTexture = new z.CanvasTexture(this.barCanvas), this.barTexture.colorSpace = z.SRGBColorSpace, this.bar = new z.Mesh(
      new z.PlaneGeometry(a, r),
      new z.MeshBasicMaterial({ map: this.barTexture, toneMapped: !1 })
    ), this.bar.position.y = o / 2 + r / 2, this.group.add(this.body, this.bar), this.body.userData.panel = this, this.bar.userData.panel = this, this.resizable) {
      const u = Je / l, m = document.createElement("canvas");
      m.width = m.height = 32;
      const h = m.getContext("2d");
      h.strokeStyle = "#6ee7a7", h.lineWidth = 3, h.lineCap = "round", h.beginPath();
      for (const M of [10, 18, 26])
        h.moveTo(30, M), h.lineTo(M, 30);
      h.stroke();
      const p = new z.CanvasTexture(m);
      p.colorSpace = z.SRGBColorSpace, this._grip = new z.Mesh(
        new z.PlaneGeometry(u, u),
        new z.MeshBasicMaterial({ map: p, transparent: !0, opacity: 0.55, depthWrite: !1, toneMapped: !1 })
      ), this.group.add(this._grip), this.placeGrip();
    }
    e.visible === !1 && (this.group.visible = !1), e.minimized && (this._minimized = !0, this.body.visible = !1), e.position && this.group.position.set(...e.position), this.group.rotation.y = e.rotationY ?? 0, e.look && i.setLook(e.look), i.resize(e.content.width, e.content.height, window.devicePixelRatio || 1), (s = (c = e.content).attach) == null || s.call(c, () => this.invalidate());
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
    this.grip.position.set((this.content.width - Je) / 2 / t, -(this.content.height - Je) / 2 / t, 3e-3), this.grip.visible = !this._minimized;
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
    const i = this.stage.pxPerUnit, l = Qe / i;
    return this.body.geometry.dispose(), this.body.geometry = new z.PlaneGeometry(t / i, e / i), this.bar.geometry.dispose(), this.bar.geometry = new z.PlaneGeometry(t / i, l), this.bar.position.y = e / i / 2 + l / 2, this.placeGrip(), this.dirty = !0, this.barDirty = !0, this.stage.invalidate(), !0;
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
    return { x: this.content.width - gn - (i - e) * $t - (i - 1 - e) * mn, y: (Qe - vn) / 2 - 1, w: $t, h: vn };
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
    const t = Math.min(window.devicePixelRatio || 1, 2), e = this.content.width, i = Qe, l = this.barCanvas;
    (l.width !== Math.round(e * t) || l.height !== Math.round(i * t)) && (l.width = Math.round(e * t), l.height = Math.round(i * t), this.barTexture.dispose(), this.barTexture = new z.CanvasTexture(l), this.barTexture.colorSpace = z.SRGBColorSpace, this.bar.material.map = this.barTexture, this.bar.material.needsUpdate = !0);
    const a = l.getContext("2d");
    a.setTransform(t, 0, 0, t, 0, 0);
    const o = this.stage.focusedId === this.id;
    a.fillStyle = o ? "#0f2a1d" : "#08130e", a.fillRect(0, 0, e, i), a.fillStyle = o ? "#6ee7a7" : "#2f6b4c", a.fillRect(0, i - 2, e, 2), a.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", a.textBaseline = "middle", a.fillStyle = o ? "#b6f5d2" : "#6fae8f";
    const r = this.controls.length ? e - 10 - (gn + this.controls.length * ($t + mn)) : e - 20;
    a.fillText(this._title, 10, i / 2 - 1, Math.max(20, r)), this.drawControls(a, o), this.barTexture.needsUpdate = !0;
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
class oo {
  constructor(t) {
    j(this, "renderer");
    j(this, "scene", new z.Scene());
    j(this, "camera");
    j(this, "canvas");
    j(this, "panels", /* @__PURE__ */ new Map());
    j(this, "pxPerUnit");
    j(this, "focusedId", null);
    j(this, "controls", null);
    j(this, "ray", new z.Raycaster());
    j(this, "ndc", new z.Vector2());
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
    this.o = t, this.pxPerUnit = t.pxPerUnit ?? 360, this.passThrough = !!t.passThrough, this.renderer = new z.WebGLRenderer({ antialias: !0, alpha: !!t.transparent }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setClearColor(t.background ?? 329738, t.transparent ? 0 : 1), this.canvas = this.renderer.domElement, this.passThrough || (this.canvas.tabIndex = 0), this.canvas.style.cssText = "display:block;width:100%;height:100%;outline:none;touch-action:none" + (this.passThrough ? ";pointer-events:none" : ""), t.container.appendChild(this.canvas), this.camera = new z.PerspectiveCamera(t.fov ?? 45, 1, t.near ?? 0.05, t.far ?? 100);
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
    const l = this.pxPerUnit, a = i.content.height / l, o = Qe / l, r = i.content.width / l, c = a / 2 + o, s = i.minimized ? a / 2 : -a / 2, u = c - s, m = i.body.localToWorld(new z.Vector3(0, (c + s) / 2, 0)), h = new z.Vector3(0, 0, 1).applyQuaternion(i.group.getWorldQuaternion(new z.Quaternion())), p = Math.tan(z.MathUtils.degToRad(this.camera.fov / 2)), M = Math.max(u / 2 / p, r / 2 / (p * this.camera.aspect)) * (1 + (e.margin ?? 0.12)), C = m.clone().addScaledVector(h, M);
    return { position: [C.x, C.y, C.z], target: [m.x, m.y, m.z] };
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
      let r = 0;
      this.cancelFly = () => {
        cancelAnimationFrame(r), this.cancelFly = null, a();
      };
      const c = (s) => {
        const u = Math.min(1, (s - o) / e), m = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, h = (p, M) => [p[0] + (M[0] - p[0]) * m, p[1] + (M[1] - p[1]) * m, p[2] + (M[2] - p[2]) * m];
        this.setCameraPose({ position: h(i.position, t.position), target: h(i.target, t.target) }), u < 1 ? r = requestAnimationFrame(c) : (this.cancelFly = null, a());
      };
      r = requestAnimationFrame(c);
    });
  }
  /** The camera's current pose (target = the point it looks at, one unit ahead). */
  getCameraPose() {
    const t = this.camera.position, e = this.camera.getWorldDirection(new z.Vector3()).add(t);
    return { position: [t.x, t.y, t.z], target: [e.x, e.y, e.z] };
  }
  // ── Panels ──────────────────────────────────────────────────────────────────
  addPanel(t) {
    if (this.panels.has(t.id)) throw new Error(`CathodeStage3D: duplicate panel id "${t.id}"`);
    const e = new Xl(this, t);
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
    for (const h of this.panels.values()) h.visible && (h.minimized || i.push(h.body), i.push(h.bar));
    const l = this.ray.intersectObjects(i, !1);
    if (!l.length) return null;
    const a = l[0].distance;
    let o = l[0];
    for (const h of l)
      h.distance - a < 1e-3 && h.object.renderOrder > o.object.renderOrder && (o = h);
    const r = o.object.userData.panel, c = o.object === r.bar ? "bar" : "body", s = c === "body" && o.uv ? r.content.surface.contentPoint(o.uv.x, o.uv.y) : null, u = c === "bar" && o.uv ? r.controlAt(o.uv.x * r.content.width, (1 - o.uv.y) * Qe) : null, m = c === "body" && r.resizable && !r.minimized && !!o.uv && o.uv.x * r.content.width > r.content.width - Je && (1 - o.uv.y) * r.content.height > r.content.height - Je;
    return { panel: r, part: c, content: s, control: u, handle: m };
  }
  /**
   * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
   * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
   */
  clientPointForContent(t, e, i) {
    const l = this.panels.get(t);
    if (!l) return null;
    const a = l.content.surface, o = l.content.width, r = l.content.height;
    let c = e / o, s = 1 - i / r;
    const u = (M, C) => a.contentPoint(M, C);
    for (let M = 0; M < 12; M++) {
      const C = u(c, s);
      if (!C) {
        c = 0.5 + (c - 0.5) * 0.8, s = 0.5 + (s - 0.5) * 0.8;
        continue;
      }
      const v = C.x - e, g = C.y - i;
      if (Math.hypot(v, g) < 0.05) break;
      const A = 1e-4, P = u(c + A, s), k = u(c, s + A);
      if (!P || !k) break;
      const I = (P.x - C.x) / A, S = (k.x - C.x) / A, E = (P.y - C.y) / A, R = (k.y - C.y) / A, D = I * R - S * E;
      if (Math.abs(D) < 1e-9) break;
      c -= (R * v - S * g) / D, s -= (-E * v + I * g) / D;
    }
    const m = u(c, s);
    if (!m || Math.hypot(m.x - e, m.y - i) > 1.5) return null;
    l.group.updateWorldMatrix(!0, !0);
    const h = l.body.localToWorld(new z.Vector3((c - 0.5) * (o / this.pxPerUnit), (s - 0.5) * (r / this.pxPerUnit), 0));
    h.project(this.camera);
    const p = this.canvas.getBoundingClientRect();
    return { x: p.left + (h.x + 1) / 2 * p.width, y: p.top + (1 - h.y) / 2 * p.height };
  }
  /** Client point of a resizable panel's resize handle (for tests / tours), or null. */
  clientPointForHandle(t) {
    const e = this.panels.get(t);
    if (!e || !e.resizable) return null;
    e.group.updateWorldMatrix(!0, !0);
    const i = this.pxPerUnit, l = e.body.localToWorld(new z.Vector3((e.content.width / 2 - Je / 2) / i, -(e.content.height / 2 - Je / 2) / i, 0)).project(this.camera), a = this.canvas.getBoundingClientRect();
    return { x: a.left + (l.x + 1) / 2 * a.width, y: a.top + (1 - l.y) / 2 * a.height };
  }
  /** Client point of a title-bar control's centre (for tests / tours), or null. */
  clientPointForControl(t, e) {
    const i = this.panels.get(t), l = i == null ? void 0 : i.controlRect(e);
    if (!i || !l) return null;
    i.group.updateWorldMatrix(!0, !0);
    const a = this.pxPerUnit, o = new z.Vector3((l.x + l.w / 2 - i.content.width / 2) / a, 0, 0);
    o.y = (Qe / 2 - (l.y + l.h / 2)) / a;
    const r = i.bar.localToWorld(o).project(this.camera), c = this.canvas.getBoundingClientRect();
    return { x: c.left + (r.x + 1) / 2 * c.width, y: c.top + (1 - r.y) / 2 * c.height };
  }
  /** Client point of a panel's title bar centre (for tests / tours). */
  clientPointForBar(t) {
    const e = this.panels.get(t);
    if (!e) return null;
    e.group.updateWorldMatrix(!0, !0);
    const i = e.bar.getWorldPosition(new z.Vector3()).project(this.camera), l = this.canvas.getBoundingClientRect();
    return { x: l.left + (i.x + 1) / 2 * l.width, y: l.top + (1 - i.y) / 2 * l.height };
  }
  // ── Pointer routing ─────────────────────────────────────────────────────────
  send(t, e, i, l = {}) {
    var r, c;
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
    return ((c = (r = t.content).pointer) == null ? void 0 : c.call(r, o)) ?? null;
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
        const r = o.panel.group.position;
        (i = (e = this.o).onPanelResized) == null || i.call(e, o.panel.id, { w: o.panel.content.width, h: o.panel.content.height }, { x: r.x, y: r.y, z: r.z });
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
    const e = t.group.getWorldQuaternion(new z.Quaternion()), i = new z.Vector3(1, 0, 0).applyQuaternion(e), l = new z.Vector3(0, 1, 0).applyQuaternion(e), a = new z.Vector3(0, 0, 1).applyQuaternion(e), o = this.pxPerUnit, r = t.body.localToWorld(new z.Vector3(-t.content.width / o / 2, t.content.height / o / 2, 0)), c = new z.Plane().setFromNormalAndCoplanarPoint(a, r);
    this.resizing = { panel: t, tl: r, right: i, up: l, plane: c, moved: !1 };
  }
  resizeTo(t) {
    const e = this.resizing;
    this.setRay(t.clientX, t.clientY);
    const i = new z.Vector3();
    if (!this.ray.ray.intersectPlane(e.plane, i)) return;
    const l = this.pxPerUnit, a = i.sub(e.tl), o = Math.round(a.dot(e.right) * l), r = Math.round(-a.dot(e.up) * l), c = e.panel, s = Math.round(Math.min(c.maxSize.w, Math.max(c.minSize.w, o))), u = Math.round(Math.min(c.maxSize.h, Math.max(c.minSize.h, r)));
    s === c.content.width && u === c.content.height || (c.group.position.copy(e.tl).addScaledVector(e.right, s / l / 2).addScaledVector(e.up, -u / l / 2), c.resize(s, u), e.moved = !0);
  }
  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────
  startDrag(t) {
    t.group.updateWorldMatrix(!0, !0);
    const e = new z.Vector3(0, 0, 1).applyQuaternion(t.group.quaternion), i = new z.Plane().setFromNormalAndCoplanarPoint(e, t.group.position), l = new z.Vector3(), a = new z.Vector3();
    this.ray.ray.intersectPlane(i, l) && a.copy(t.group.position).sub(l), this.dragging = { panel: t, plane: i, offset: a, moved: !1 };
  }
  dragTo(t) {
    const e = this.dragging;
    this.setRay(t.clientX, t.clientY);
    const i = new z.Vector3();
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
function ao(n, t, e, i = {}) {
  return { surface: n, width: t, height: e, ...i };
}
function ro(n) {
  let t = () => {
  };
  const e = n.theme ?? "phosphor", i = En({
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
  const l = new Ne({
    mode: "world",
    paint: (c, s) => i.paint(c, s)
  }), a = (c) => {
    const s = { cx: c.x, cy: c.y, hitScale: c.hitScale };
    switch (c.kind) {
      case "move":
        return i.resizing ? null : i.hover(s);
      case "leave":
        return i.leave(), null;
      case "down":
        return i.pointerDown(s, c.clientX, c.clientY), null;
      case "drag":
        return i.globalMove(c.clientX, c.clientY), null;
      case "up":
        return i.globalUp(), null;
      case "click":
        return i.click(s, { shiftKey: c.shiftKey, detail: c.detail }), null;
      case "wheel":
        return i.wheel(c.deltaX, c.deltaY, c.shiftKey), null;
    }
  }, o = (c) => {
    if (i.activeFilter.value) {
      if (c.key === "Escape") {
        c.preventDefault(), i.clearFilter();
        return;
      }
      if (c.key === "Enter") {
        c.preventDefault(), i.closeFilter();
        return;
      }
      if (c.key === "Backspace") {
        c.preventDefault(), i.setFilterText(i.filterPopupValue.value.slice(0, -1)), t();
        return;
      }
      if (c.key.length === 1 && !c.ctrlKey && !c.metaKey) {
        c.preventDefault(), i.setFilterText(i.filterPopupValue.value + c.key), t();
        return;
      }
    }
    i.keyDown(c);
  }, r = {
    model: i,
    surface: l,
    width: n.width,
    height: n.height,
    attach: (c) => {
      t = c;
    },
    pointer: a,
    key: o,
    // more room → more columns / rows; the model re-clamps scroll and re-fits the columns to the new canvas
    resize(c, s) {
      r.width = c, r.height = s, i.setViewport(c, s, c, s), t();
    },
    dispose: () => {
      i.dispose(), l.dispose();
    }
  };
  return r;
}
function so(n) {
  let t = () => {
  };
  const e = yn({
    entries: n.entries,
    theme: n.theme ?? "phosphor",
    showTimestamps: n.showTimestamps,
    formatTs: n.formatTs,
    wordWrap: n.wordWrap,
    maxLines: n.maxLines
  }), i = An({
    entries: () => e.entries,
    theme: () => e.theme ?? "phosphor",
    showTimestamps: () => e.showTimestamps ?? !0,
    formatTs: () => e.formatTs,
    wordWrap: () => e.wordWrap ?? !0,
    maxLines: () => e.maxLines ?? 0,
    host: { redraw: () => t() }
  });
  i.setViewport(n.width, n.height), i.scrollToBottom();
  const l = new Ne({ mode: "world", paint: (s, u) => i.paint(s, u) });
  let a = { x: 0, y: 0 }, o = !1;
  const r = (s) => {
    switch (s.kind) {
      case "move":
        return i.hover(s.x < 0 ? -1 : s.y), null;
      case "leave":
        return i.leave(), null;
      case "down":
        return a = { x: s.clientX, y: s.clientY }, o = !1, i.panStart(s.clientX * s.hitScale, s.clientY * s.hitScale), null;
      case "drag":
        return Math.hypot(s.clientX - a.x, s.clientY - a.y) > 4 && (o = !0), i.panMove(s.clientX * s.hitScale, s.clientY * s.hitScale), null;
      case "up":
        return i.panEnd(), null;
      case "click":
        return o || i.click(s.x < 0 ? -1 : s.y, s.shiftKey), o = !1, null;
      case "wheel":
        return i.wheel(s.deltaX, s.deltaY, s.shiftKey), null;
    }
  }, c = {
    model: i,
    surface: l,
    width: n.width,
    height: n.height,
    attach: (s) => {
      t = s;
    },
    pointer: r,
    key: (s) => i.keyDown(s),
    update(s) {
      Object.assign(e, s), t();
    },
    // more room → the lines re-wrap to the new width and more of them show
    resize(s, u) {
      c.width = s, c.height = u, i.setViewport(s, u), t();
    },
    dispose: () => {
      i.dispose(), l.dispose();
    }
  };
  return c;
}
function co(n) {
  let t = () => {
  };
  const e = yn({
    candles: n.candles,
    theme: n.theme,
    slotW: n.slotW,
    showVolume: n.showVolume,
    volumeFraction: n.volumeFraction,
    overlays: n.overlays,
    markers: n.markers,
    compact: n.compact,
    colors: n.colors
  }), i = _n({
    candles: () => e.candles,
    theme: () => e.theme ?? "phosphor",
    slotW: () => e.slotW ?? 8,
    showVolume: () => e.showVolume ?? !0,
    volumeFraction: () => e.volumeFraction ?? zn,
    overlays: () => e.overlays,
    markers: () => e.markers,
    compact: () => e.compact ?? !1,
    colors: () => e.colors,
    host: { redraw: () => t() }
  });
  i.setViewport(n.width, n.height);
  const l = new Ne({ mode: "world", paint: (r, c) => i.paint(r, c) }), a = (r) => {
    switch (r.kind) {
      case "move":
        return i.hoverAt(r.x, r.y), null;
      case "leave":
        return i.leave(), null;
      case "down":
        return i.panStart(r.clientX * r.hitScale), null;
      case "drag":
        return i.panMove(r.clientX * r.hitScale), null;
      case "up":
        return i.panEnd(), null;
      case "wheel":
        return i.wheel(r.deltaX, r.deltaY, r.shiftKey, r.x), null;
    }
  }, o = {
    model: i,
    surface: l,
    width: n.width,
    height: n.height,
    attach: (r) => {
      t = r;
    },
    pointer: a,
    key: (r) => i.keyDown(r),
    update(r) {
      Object.assign(e, r), t();
    },
    // the chart fits whatever it is given: more room, more candles
    resize(r, c) {
      o.width = r, o.height = c, i.setViewport(r, c), t();
    },
    dispose: () => {
      i.dispose(), l.dispose();
    }
  };
  return o;
}
function uo(n) {
  let t = () => {
  }, e = { ...n };
  const i = () => ((e.min ?? -1) + (e.max ?? 1)) / 2;
  let l = e.animate === !1 ? e.value : i(), a = 0;
  const o = new Ne({
    mode: "world",
    paint: (s, { dpr: u, glow: m }) => {
      Yn(s, {
        dpr: u,
        theme: e.theme ?? "none",
        colors: e.colors,
        glow: m,
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
  }), r = () => {
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
  }, c = {
    surface: o,
    width: n.width,
    height: n.height,
    attach: (s) => {
      t = s, r();
    },
    // the mount sweep: centre → value
    resize(s, u) {
      c.width = s, c.height = u, t();
    },
    // the painter lays out for the canvas it is given
    update(s) {
      const u = s.value !== void 0 && s.value !== e.value;
      e = { ...e, ...s }, u || s.animate !== void 0 ? r() : t();
    },
    get shown() {
      return l;
    },
    dispose: () => {
      cancelAnimationFrame(a), t = () => {
      }, o.dispose();
    }
  };
  return c;
}
export {
  rt as CANDLE_THEME_COLORS,
  ql as CathodeCandle,
  Zl as CathodeCandleGrid,
  eo as CathodeContainer,
  no as CathodeGauge,
  Kl as CathodeGrid,
  to as CathodeLoader,
  Ui as CathodeLog,
  oo as CathodeStage3D,
  Ne as CathodeSurface,
  jl as CathodeTerminal,
  Jl as CathodeWorkspace,
  Dt as GAUGE_THEME_COLORS,
  kt as LOG_THEME_COLORS,
  Xl as Panel3D,
  Li as barrelUV,
  Ql as buildDefaultLayout,
  co as candleContent,
  io as createSurfaceMesh,
  Yn as drawGauge,
  uo as gaugeContent,
  ro as gridContent,
  Ri as lensUV,
  so as logContent,
  lo as resizeSurfaceMesh,
  ao as surfaceContent,
  _n as useCandleModel,
  Hn as useCathodeLayout,
  En as useGridModel,
  An as useLogModel
};
