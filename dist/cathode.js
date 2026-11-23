var mi = Object.defineProperty;
var pi = (i, t, e) => t in i ? mi(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var V = (i, t, e) => pi(i, typeof t != "symbol" ? t + "" : t, e);
import { effectScope as on, ref as X, reactive as Ot, watch as ne, nextTick as Ae, computed as se, defineComponent as Ne, inject as bt, onMounted as Ye, onUnmounted as Ge, openBlock as xe, createElementBlock as be, normalizeStyle as $e, createElementVNode as he, withModifiers as it, unref as fe, withKeys as pn, createCommentVNode as Ue, toDisplayString as He, createVNode as Ln, withDirectives as Rn, vModelText as gi, provide as gn, renderSlot as Jt, Transition as wi, withCtx as yi, Fragment as xi, renderList as bi, createTextVNode as Mi, normalizeClass as Si, vShow as Ti, shallowReactive as Dn } from "vue";
import * as P from "three";
const vt = {
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
}, Se = 30, en = 12, Ci = 10, Pt = 14, In = 5;
function At() {
  return `${en}px system-ui, -apple-system, sans-serif`;
}
function En(i, t, e) {
  const n = String(t ?? "");
  if (!n) return [""];
  const l = n.split(/\s+/).filter(Boolean);
  if (l.length === 0) return [""];
  const a = [];
  let o = "";
  for (const s of l) {
    const c = o ? o + " " + s : s;
    !o || i.measureText(c).width <= e ? o = c : (a.push(o), o = s);
  }
  return o && a.push(o), a.length ? a : [""];
}
function ki(i, t) {
  return Math.max(t, i * Pt + In * 2);
}
function an(i, t) {
  const e = new Array(t + 1);
  e[0] = 0;
  for (let n = 0; n < t; n++) e[n + 1] = e[n] + (i[n] ?? 0);
  return e;
}
function zt(i, t) {
  if (t <= 0) return 0;
  let e = 0, n = i.length - 1;
  for (; e < n; ) {
    const l = e + n + 1 >> 1;
    i[l] <= t ? e = l : n = l - 1;
  }
  return e;
}
const Pn = 28;
function Li(i, t) {
  if (typeof t == "function") return t(i);
  const e = i.filter((l) => l != null && l !== "");
  if (t === "count") return e.length;
  const n = e.map((l) => Number(l)).filter((l) => !Number.isNaN(l));
  if (n.length === 0) return null;
  switch (t) {
    case "sum":
      return n.reduce((l, a) => l + a, 0);
    case "avg":
      return n.reduce((l, a) => l + a, 0) / n.length;
    case "min":
      return Math.min(...n);
    case "max":
      return Math.max(...n);
  }
}
function Ri(i, t) {
  const e = i.getContext("2d");
  if (!e) return;
  const n = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(n, 0, 0, n, 0, 0);
  const l = i.width / n, a = i.height / n, o = vt[t.theme] ?? vt.none, { cols: s, rows: c, pinnedRows: r, rowHeight: u, scrollY: m, scrollX: v, glow: p } = t;
  e.clearRect(0, 0, l, a), e.fillStyle = o.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const b = r.length * u, x = t.aggregateRow ? Pn : 0, d = a - Se - b - x;
  e.fillStyle = o.headerBg, e.fillRect(0, 0, l, Se), e.textBaseline = "middle", e.textAlign = "left";
  let g = -v;
  for (let h = 0; h < s.length; h++) {
    const w = s[h];
    if (g + w.width <= 0) {
      g += w.width;
      continue;
    }
    if (g >= l) break;
    const y = !!t.colFilters[w.colId], M = t.sorts.findIndex((U) => U.colId === w.colId), O = M >= 0, $ = (w.colDef.headerName ?? w.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(g, 0, w.width, Se), e.clip(), e.font = `bold ${Ci}px system-ui, -apple-system, sans-serif`, e.fillStyle = y ? o.accent : o.textHeader, p ? (e.shadowColor = o.textHeader, e.shadowBlur = 10, e.fillText($, g + 8, Se / 2), e.shadowBlur = 4, e.fillText($, g + 8, Se / 2), e.shadowBlur = 0) : e.fillText($, g + 8, Se / 2), O) {
      const U = e.measureText($).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = o.accent;
      const J = t.sorts[M].dir === "asc" ? "▲" : "▼";
      e.fillText(t.sorts.length > 1 ? `${J}${M + 1}` : J, g + 8 + U + 4, Se / 2);
    }
    w.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = y ? o.accent : o.textHeader, e.globalAlpha = y ? 1 : 0.38, e.fillText("⌕", g + w.width - 20, Se / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(g + w.width - 0.5, 0), e.lineTo(g + w.width - 0.5, Se), e.stroke(), g += w.width;
  }
  e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Se - 0.5), e.lineTo(l, Se - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, Se, l, d), e.clip();
  const z = t.rowHeights && t.rowHeights.length === c.length ? t.rowHeights : null, A = z ? an(z, c.length) : null, k = (h) => A ? A[h] : h * u, I = (h) => z ? z[h] : u, T = A ? zt(A, m) : Math.max(0, Math.floor(m / u));
  let E;
  if (A)
    for (E = T; E < c.length && k(E) < m + d; ) E++;
  else
    E = Math.min(c.length, Math.ceil((m + d) / u));
  const R = t.selectionAnchorRow ?? t.selectedRow, D = t.selectionAnchorCol ?? t.selectedCol, G = t.selectedRow >= 0 && R >= 0 ? Math.min(t.selectedRow, R) : -1, _ = t.selectedRow >= 0 && R >= 0 ? Math.max(t.selectedRow, R) : -1, L = t.selectedCol >= 0 && D >= 0 ? Math.min(t.selectedCol, D) : -1, W = t.selectedCol >= 0 && D >= 0 ? Math.max(t.selectedCol, D) : -1, N = _ > G || W > L;
  let j = Number.POSITIVE_INFINITY, ee = Number.NEGATIVE_INFINITY, ie = Number.POSITIVE_INFINITY, oe = Number.NEGATIVE_INFINITY;
  const q = (h, w, y, M) => {
    p ? (e.shadowColor = M, e.shadowBlur = 12, e.fillText(h, w, y), e.shadowBlur = 6, e.fillText(h, w, y), e.shadowBlur = 2, e.fillText(h, w, y), e.shadowBlur = 0) : e.fillText(h, w, y);
  };
  for (let h = T; h < E; h++) {
    const w = c[h], y = I(h), M = Se + k(h) - m;
    h % 2 === 1 && (e.fillStyle = o.rowAlt, e.fillRect(0, M, l, y));
    const O = h >= G && h <= _;
    h === t.hoveredRow && !O && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M, l, y)), O && !N && (e.fillStyle = $t(o.accent, 0.1), e.fillRect(0, M, l, y)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, M + y - 0.5), e.lineTo(l, M + y - 0.5), e.stroke();
    let $ = -v;
    for (let U = 0; U < s.length; U++) {
      const J = s[U];
      if ($ + J.width <= 0) {
        $ += J.width;
        continue;
      }
      if ($ >= l) break;
      const ue = O && U >= L && U <= W;
      ue && N && (e.fillStyle = $t(o.accent, 0.14), e.fillRect($, M, J.width, y)), ue && ($ < j && (j = $), $ + J.width > ee && (ee = $ + J.width), M < ie && (ie = M), M + y > oe && (oe = M + y));
      const me = t.getCellStyle(J, w), Ce = me.color ?? o.text, F = me.textAlign ?? "left", te = t.formatCell(J, w);
      if (e.save(), e.beginPath(), e.rect($ + 1, M, J.width - 2, y), e.clip(), e.font = At(), e.fillStyle = Ce, e.textBaseline = "middle", J.colDef.wrap) {
        e.textAlign = "left";
        const Q = En(e, te, Math.max(20, J.width - 16));
        let re = M + In + Pt / 2;
        for (const de of Q) {
          if (re - Pt / 2 >= M + y) break;
          q(de, $ + 8, re, Ce), re += Pt;
        }
      } else {
        const Q = F === "right" ? $ + J.width - 8 : $ + 8;
        e.textAlign = F === "right" ? "right" : "left", q(te, Q, M + y / 2, Ce);
      }
      e.restore(), h === t.selectedRow && U === t.selectedCol && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect($ + 1.5, M + 1.5, J.width - 3, y - 3)), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo($ + J.width - 0.5, M), e.lineTo($ + J.width - 0.5, M + y), e.stroke(), $ += J.width;
    }
  }
  if (N && j < ee && ie < oe && (e.strokeStyle = o.accent, e.lineWidth = 2, e.strokeRect(j + 0.5, ie + 0.5, ee - j - 1, oe - ie - 1)), e.restore(), r.length > 0) {
    const h = a - b - x;
    e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, h - 0.5), e.lineTo(l, h - 0.5), e.stroke();
    for (let w = 0; w < r.length; w++) {
      const y = r[w], M = h + w * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, M, l, u);
      let O = -v;
      for (let $ = 0; $ < s.length; $++) {
        const U = s[$];
        if (O + U.width <= 0) {
          O += U.width;
          continue;
        }
        if (O >= l) break;
        const J = t.getCellStyle(U, y), ue = J.color ?? o.text, me = J.textAlign ?? "left", Ce = t.formatCell(U, y);
        e.save(), e.beginPath(), e.rect(O + 1, M, U.width - 2, u), e.clip(), e.font = `bold ${en}px system-ui, -apple-system, sans-serif`, e.fillStyle = ue, e.textBaseline = "middle", me === "right" ? (e.textAlign = "right", e.fillText(Ce, O + U.width - 8, M + u / 2)) : (e.textAlign = "left", e.fillText(Ce, O + 8, M + u / 2)), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(O + U.width - 0.5, M), e.lineTo(O + U.width - 0.5, M + u), e.stroke(), O += U.width;
      }
      e.strokeStyle = o.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, M + u - 0.5), e.lineTo(l, M + u - 0.5), e.stroke();
    }
  }
  if (t.aggregateRow) {
    const h = a - x;
    e.fillStyle = $t(o.accent, 0.1), e.fillRect(0, h, l, x), e.strokeStyle = o.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, h - 0.5), e.lineTo(l, h - 0.5), e.stroke();
    let w = -v;
    for (let y = 0; y < s.length; y++) {
      const M = s[y];
      if (w + M.width <= 0) {
        w += M.width;
        continue;
      }
      if (w >= l) break;
      const $ = t.getCellStyle(M, t.aggregateRow).textAlign ?? "left", U = t.aggregateRow[M.colId] ?? "";
      e.save(), e.beginPath(), e.rect(w + 1, h, M.width - 2, x), e.clip(), e.font = `bold ${en}px system-ui, -apple-system, sans-serif`, e.fillStyle = o.accent, e.textBaseline = "middle", p && (e.shadowColor = o.accent, e.shadowBlur = 8), $ === "right" ? (e.textAlign = "right", e.fillText(U, w + M.width - 8, h + x / 2)) : (e.textAlign = "left", e.fillText(U, w + 8, h + x / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + M.width - 0.5, h), e.lineTo(w + M.width - 0.5, h + x), e.stroke(), w += M.width;
    }
  }
  e.restore();
}
function $t(i, t) {
  if (i.startsWith("rgba") || i.startsWith("rgb"))
    return i.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(i.slice(1, 3), 16), n = parseInt(i.slice(3, 5), 16), l = parseInt(i.slice(5, 7), 16);
  return `rgba(${e},${n},${l},${t})`;
}
const Rt = 190, Ut = 34;
function Di(i, t, e) {
  const n = Math.max(4, Math.min(t, i - Rt - 4)), l = Se + 6, a = e ? 26 : 0;
  return {
    box: { x: n, y: l, w: Rt, h: Ut },
    input: { x: n + 9, y: l + 5, w: Rt - 18 - a, h: Ut - 10 },
    clear: e ? { x: n + Rt - 28, y: l, w: 28, h: Ut } : null
  };
}
const Xt = (i, t, e, n = 0) => i >= e.x - n && i <= e.x + e.w + n && t >= e.y && t <= e.y + e.h;
function Dt(i, t, e, n = 1) {
  return e.clear && Xt(i, t, e.clear, 4 * (n - 1)) ? "clear" : Xt(i, t, e.input) ? "input" : Xt(i, t, e.box) ? "inside" : "outside";
}
function Ii(i, t, e, n, l) {
  const { box: a, input: o, clear: s } = t;
  i.save(), i.fillStyle = "rgba(8,12,22,0.94)", i.strokeStyle = l.accent, i.lineWidth = 1, i.beginPath(), i.roundRect(a.x + 0.5, a.y + 0.5, a.w - 1, a.h - 1, 4), i.fill(), i.stroke(), i.fillStyle = "rgba(255,255,255,0.05)", i.beginPath(), i.roundRect(o.x, o.y, o.w, o.h, 3), i.fill(), i.beginPath(), i.rect(o.x, o.y, o.w, o.h), i.clip(), i.font = At(), i.textBaseline = "middle";
  const c = o.y + o.h / 2 + 1, r = 5;
  if (e) {
    i.fillStyle = l.text;
    const u = i.measureText(e).width, m = u > o.w - 2 * r - 2 ? o.x + o.w - r - 2 - u : o.x + r;
    i.fillText(e, m, c), n && (i.fillStyle = l.accent, i.fillRect(Math.min(m + u + 1, o.x + o.w - r), o.y + 4, 1.5, o.h - 8));
  } else
    i.fillStyle = l.textHeader, i.fillText("Filter…", o.x + r, c), n && (i.fillStyle = l.accent, i.fillRect(o.x + r, o.y + 4, 1.5, o.h - 8));
  i.restore(), s && (i.save(), i.font = At(), i.textBaseline = "middle", i.textAlign = "center", i.fillStyle = l.textHeader, i.fillText("✕", s.x + s.w / 2, s.y + s.h / 2 + 1), i.restore());
}
function Ei(i, t, e) {
  const n = i - 0.5, l = t - 0.5, a = Math.abs(e), o = (n * n + l * l) * a;
  if (e < 0) {
    const r = 0.5 * a, m = 1 / (1 - 2 * (0.5 * (1 + r) * r)), v = (n + n * (1 + o) * o * -1) * m, p = (l + l * (1 + o) * o * -1) * m;
    return [0.5 + v, 0.5 + p];
  }
  const s = n * (1 + o) * o, c = l * (1 + o) * o;
  return [i + s, t + c];
}
function An(i, t, e, n, l, a = e, o = n) {
  const s = i / e, c = 1 - t / n, [r, u] = Ei(s, c, l);
  return r < 0 || r > 1 || u < 0 || u > 1 ? [-1, -1] : [r * a, (1 - u) * o];
}
function Nt(i, t) {
  let e = 0;
  for (let n = 0; n < i; n++) e += t[n].width;
  return e;
}
function Pi(i, t, e, n = 1) {
  return i >= t + e - 24 * n && i < t + e;
}
function wn(i, t, e, n = 1) {
  const l = t + e;
  return i >= l - 6 * n && i <= l + 1 * n;
}
function Ai(i, t, e, n, l, a, o, s, c, r = !1, u) {
  const m = i + c;
  let v = -1, p = 0;
  for (let z = 0; z < e.length; z++) {
    if (m >= p && m < p + e[z].width) {
      v = z;
      break;
    }
    p += e[z].width;
  }
  if (t < Se) return { area: "header", colIdx: v, rowIdx: -1 };
  const b = r ? Pn : 0;
  if (b > 0 && t >= o - b)
    return { area: "agg", colIdx: v, rowIdx: -1 };
  const x = s * l;
  if (x > 0 && t >= o - x - b) {
    const z = Math.floor((t - (o - x - b)) / l);
    return { area: "pinned", colIdx: v, rowIdx: z };
  }
  const d = t - Se + a, g = u && u.length === n ? zt(an(u, n), d) : Math.floor(d / l);
  return g >= 0 && g < n ? { area: "body", colIdx: v, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
function st(i) {
  return i / 45 * 0.55;
}
function zn(i) {
  const t = Math.abs(st(i));
  if (t === 0) return 1;
  if (i < 0) {
    const n = 0.5 * t;
    return 1 / (1 - 2 * (0.5 * (1 + n) * n));
  }
  const e = 0.25 * t;
  return 1 + 2 * (0.5 * (1 + e) * e);
}
const zi = 500, _n = zi / 2, tn = 1.6, Fn = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Bn = `
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
`, Wn = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Hn() {
  return {
    uMouseUV: { value: new P.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: tn },
    uLensTint: { value: new P.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Te = { x: -999, y: -999 };
function Yn(i, t, e, n, l) {
  const a = t && e.x !== -999;
  i.uniforms.uMouseUV.value.set(e.x, e.y), i.uniforms.uLensR.value = a && l > 0 ? _n / l : 0, i.uniforms.uAspect.value = l > 0 ? n / l : 1;
}
function Mt(i, t) {
  const e = t.getBoundingClientRect();
  return {
    x: (i.clientX - e.left) / e.width,
    y: 1 - (i.clientY - e.top) / e.height
  };
}
const _i = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Fi = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`, Bi = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Fn}

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

  ${Bn}

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
    ${Wn}
    gl_FragColor = color;
  }
`;
function Wi(i, t, e) {
  const n = i - 0.5, l = t - 0.5, a = Math.abs(e), o = (n * n + l * l) * a, s = (1 + o) * o * Math.sign(e);
  let c = n + n * s, r = l + l * s;
  if (e < 0) {
    const u = 0.5 * a, m = 0.5 * (1 + u) * u;
    c /= 1 - 2 * m, r /= 1 - 2 * m;
  }
  return { x: 0.5 + c, y: 0.5 + r };
}
function Hi(i, t, e, n, l, a) {
  if (!n || e.x === Te.x || a <= 0) return { x: i, y: t };
  const o = l / a, s = _n / a, c = (i - e.x) * o, r = t - e.y, u = Math.hypot(c, r);
  if (u >= s) return { x: i, y: t };
  const m = u / s, v = Math.min(Math.max((m - 0.88) / (1 - 0.88), 0), 1), p = v * v * (3 - 2 * v), b = tn + (1 - tn) * p;
  return { x: e.x + c / b / o, y: e.y + r / b };
}
class Je {
  constructor(t) {
    V(this, "canvas");
    V(this, "material");
    V(this, "mode");
    /** logical (CSS px) size and backing-store dpr — set by resize() */
    V(this, "dpr", 1);
    V(this, "logicalW", 0);
    V(this, "logicalH", 0);
    /**
     * Visible panel size in px, when it differs from the content canvas (CathodeGrid's bend-field
     * gain draws a WIDER canvas than the screen it warps into). The lens is a fixed physical size
     * and circular in SCREEN px, so its radius/aspect come from this; 0 = same as the content.
     */
    V(this, "screenW", 0);
    V(this, "screenH", 0);
    V(this, "texture");
    V(this, "painter");
    V(this, "maxDpr");
    V(this, "look", { curvature: 0, scanlines: !0, vignette: !0, magnify: !1 });
    V(this, "mouse", { x: Te.x, y: Te.y });
    V(this, "anisotropy", 1);
    this.painter = t.paint, this.mode = t.mode ?? "screen", this.maxDpr = t.maxDpr ?? 2, this.canvas = document.createElement("canvas"), this.texture = this.makeTexture(), this.material = new P.ShaderMaterial({
      uniforms: {
        uTex: { value: this.texture },
        uStrength: { value: 0 },
        uScanlines: { value: 1 },
        uVignette: { value: 1 },
        ...Hn()
      },
      vertexShader: this.mode === "world" ? Fi : _i,
      fragmentShader: Bi,
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
  resize(t, e, n = window.devicePixelRatio || 1) {
    if (!t || !e) return !1;
    const l = Math.min(n, this.maxDpr), a = Math.round(t * l), o = Math.round(e * l);
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
    this.mouse.x = t ? t.x : Te.x, this.mouse.y = t ? t.y : Te.y;
  }
  /** Push look + lens state into the shader uniforms. */
  syncUniforms() {
    const t = this.material.uniforms;
    t.uStrength.value = st(this.look.curvature), t.uScanlines.value = this.look.scanlines ? 1 : 0, t.uVignette.value = this.look.vignette ? 1 : 0, Yn(
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
    const n = Hi(t, e, this.mouse, this.look.magnify, this.screenW || this.logicalW, this.screenH || this.logicalH), l = Wi(n.x, n.y, st(this.look.curvature));
    return l.x < 0 || l.x > 1 || l.y < 0 || l.y > 1 ? null : { x: l.x * this.logicalW, y: (1 - l.y) * this.logicalH };
  }
  dispose() {
    this.texture.dispose(), this.material.dispose();
  }
}
const Yi = 600;
function Vn(i) {
  const t = on(!0);
  return t.run(() => Vi(i, t));
}
function Vi(i, t) {
  var dn, vn;
  const { emit: e, host: n } = i, l = X(((dn = i.rowData) == null ? void 0 : dn.call(i)) ?? []), a = X(((vn = i.pinnedBottomRowData) == null ? void 0 : vn.call(i)) ?? []), o = X(""), s = X([]), c = Ot({}), r = Ot({}), u = Ot(/* @__PURE__ */ new Set()), m = X(0), v = X(0), p = X(0), b = X(0), x = X(0), d = X(0), g = X(0), z = X(-1), A = X(null), k = X(null), I = X(null), T = X(""), E = X(0);
  let R = null;
  const D = X(!0);
  let G = null;
  ne(I, (f) => {
    var S;
    G && (clearInterval(G), G = null), f ? (D.value = !0, G = setInterval(() => {
      D.value = !D.value, n.redraw();
    }, 530), Ae(() => {
      var C;
      return (C = n.focusFilterInput) == null ? void 0 : C.call(n);
    })) : (R = null, (S = n.blurFilterInput) == null || S.call(n)), n.redraw();
  });
  function _(f) {
    return f.colId ?? f.field ?? (f.headerName ? f.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
  }
  const L = se(() => {
    var S;
    const f = ((S = i.defaultColDef) == null ? void 0 : S.call(i)) ?? {};
    return i.columnDefs().filter((C) => !u.has(_(C))).map((C) => {
      const B = _(C), Y = { ...f, ...C };
      return { colId: B, colDef: Y, width: r[B] ?? Y.width ?? 100 };
    });
  }), W = se(() => {
    const f = v.value;
    if (!f) return L.value;
    const S = L.value.reduce((Y, K) => Y + K.width, 0);
    if (!S || S >= f) return L.value;
    const C = f / S;
    let B = 0;
    return L.value.map((Y, K) => {
      const le = K === L.value.length - 1 ? f - B : Math.max(8, Math.round(Y.width * C));
      return B += le, { ...Y, width: le };
    });
  }), N = se(() => {
    const f = W.value.reduce((S, C) => S + C.width, 0);
    return Math.max(0, f - v.value);
  });
  function j(f, S) {
    if (S.colDef.valueGetter) return S.colDef.valueGetter({ data: f, colDef: S.colDef });
    if (S.colDef.field) return f[S.colDef.field];
  }
  function ee(f, S) {
    const C = j(S, f);
    return f.colDef.valueFormatter ? f.colDef.valueFormatter({ value: C, data: S, colDef: f.colDef }) ?? "" : f.colDef.cellRenderer ? (f.colDef.cellRenderer({ value: C, data: S, colDef: f.colDef }) ?? "").replace(/<[^>]+>/g, "") : C == null ? "" : String(C);
  }
  function ie(f, S) {
    return f.colDef.cellStyle ? typeof f.colDef.cellStyle == "function" ? f.colDef.cellStyle({ value: j(S, f), data: S, colDef: f.colDef }) ?? {} : f.colDef.cellStyle : {};
  }
  function oe() {
    return i.columnDefs().map((f, S) => ({ d: f, i: S })).filter(({ d: f }) => f.sort).sort((f, S) => (f.d.sortIndex ?? f.i) - (S.d.sortIndex ?? S.i)).map(({ d: f }) => ({ colId: _(f), dir: f.sort }));
  }
  const q = se(() => {
    m.value;
    let f = l.value;
    const S = o.value.trim().toLowerCase();
    S && (f = f.filter(
      (B) => L.value.some(
        (Y) => String(j(B, Y) ?? "").toLowerCase().includes(S)
      )
    ));
    for (const [B, Y] of Object.entries(c)) {
      if (!Y) continue;
      const K = L.value.find((Z) => Z.colId === B);
      if (K)
        if (Y.startsWith("__eq__")) {
          const Z = Y.slice(6).toLowerCase();
          f = f.filter((le) => String(j(le, K) ?? "").toLowerCase() === Z);
        } else {
          const Z = Y.toLowerCase();
          f = f.filter((le) => String(j(le, K) ?? "").toLowerCase().includes(Z));
        }
    }
    const C = s.value.map(({ colId: B, dir: Y }) => ({ col: L.value.find((K) => K.colId === B), dir: Y })).filter((B) => !!B.col);
    return C.length && (f = [...f].sort((B, Y) => {
      for (const { col: K, dir: Z } of C) {
        const le = j(B, K), De = j(Y, K);
        let Re = 0;
        if (K.colDef.comparator ? Re = K.colDef.comparator(le, De) : typeof le == "number" && typeof De == "number" ? Re = le - De : Re = String(le ?? "").localeCompare(String(De ?? ""), void 0, { numeric: !0 }), Re) return Z === "asc" ? Re : -Re;
      }
      return 0;
    })), f;
  });
  let h = null;
  function w() {
    if (typeof document > "u") return null;
    h || (h = document.createElement("canvas"));
    const f = h.getContext("2d");
    return f && (f.font = At()), f;
  }
  const y = se(() => W.value.some((f) => f.colDef.wrap)), M = se(() => {
    if (!y.value) return null;
    const f = w();
    if (!f) return null;
    const S = W.value.filter((B) => B.colDef.wrap), C = i.rowHeight();
    return q.value.map((B) => {
      let Y = 1;
      for (const K of S) {
        const Z = En(f, ee(K, B), Math.max(20, K.width - 16));
        Z.length > Y && (Y = Z.length);
      }
      return ki(Y, C);
    });
  }), O = se(
    () => M.value ? an(M.value, q.value.length) : null
  ), $ = se(
    () => O.value ? O.value[q.value.length] : q.value.length * i.rowHeight()
  ), U = se(() => {
    const f = a.value.length * i.rowHeight();
    return Math.max(0, p.value - Se - f);
  }), J = se(() => Math.max(0, $.value - U.value)), ue = se(() => Math.max(1, Math.floor(U.value / i.rowHeight()))), me = se(() => {
    const f = q.value.length;
    if (f === 0) return 0;
    const S = O.value ? zt(O.value, d.value) : Math.floor(d.value / i.rowHeight());
    return Math.min(f - 1, S);
  }), Ce = se(() => {
    const f = q.value.length;
    return f === 0 ? 0 : O.value ? Math.min(f - 1, zt(O.value, d.value + U.value - 1)) : Math.min(f - 1, me.value + ue.value - 1);
  }), F = se(() => {
    const f = L.value.filter((Y) => Y.colDef.aggFunc != null);
    if (f.length === 0) return null;
    const S = q.value, C = {};
    for (const Y of f) {
      const K = S.map((le) => j(le, Y)), Z = Li(K, Y.colDef.aggFunc);
      if (Z == null) {
        C[Y.colId] = "";
        continue;
      }
      C[Y.colId] = Y.colDef.aggValueFormatter ? Y.colDef.aggValueFormatter(Z) : String(Z);
    }
    const B = f[0].colId;
    return C[B] === "" && (C[B] = "Σ"), C;
  });
  ne(q, () => {
    d.value = 0, A.value = null;
  }), ne(N, () => {
    g.value = Math.min(g.value, N.value);
  }), ne(J, () => {
    d.value = Math.min(d.value, J.value);
  }), ne(
    [q, () => a.value, W, d, z, A],
    () => Ae(() => n.redraw())
  ), ne(A, (f) => {
    if (!f) return;
    const S = q.value[f.row], C = W.value[f.col];
    S && C && e("cell-selected", { data: S, row: f.row, col: f.col, colId: C.colId });
  });
  function te(f, S, C, B) {
    b.value = C, x.value = B, v.value = f, p.value = S, g.value = Math.max(0, Math.min(N.value, g.value)), d.value = Math.max(0, Math.min(J.value, d.value));
  }
  function Q(f) {
    const S = O.value, C = S ? S[f] : f * i.rowHeight(), B = S ? S[f + 1] : C + i.rowHeight();
    C < d.value ? d.value = C : B > d.value + U.value && (d.value = Math.min(J.value, B - U.value));
  }
  function re(f) {
    var Y;
    if (!v.value) return;
    let S = 0;
    for (let K = 0; K < f; K++) S += W.value[K].width;
    const C = ((Y = W.value[f]) == null ? void 0 : Y.width) ?? 0, B = S - g.value;
    B < 0 ? g.value = Math.max(0, S) : B + C > v.value && (g.value = Math.min(N.value, S + C - v.value));
  }
  function de() {
    d.value = Math.max(0, d.value - U.value), n.redraw();
  }
  function pe() {
    d.value = Math.min(J.value, d.value + U.value), n.redraw();
  }
  let Me = !1, ze = "", Ie = 0, St = 0, Tt = 1, je = !1, H = !1, ae = 0, ce = 0, et = 0, Ve = 0, ct = !1;
  function Ct(f, S, C = 1) {
    var B;
    Me = !0, ze = f, Ie = S, Tt = C, St = ((B = W.value.find((Y) => Y.colId === f)) == null ? void 0 : B.width) ?? 100, je = !1;
  }
  function kt(f, S) {
    H = !0, ct = !1, ae = f, ce = S, et = g.value, Ve = d.value;
  }
  function pt(f, S) {
    const C = ae - f, B = ce - S;
    (Math.abs(C) > 4 || Math.abs(B) > 4) && (ct = !0), g.value = Math.max(0, Math.min(N.value, et + C)), d.value = Math.max(0, Math.min(J.value, Ve + B)), n.redraw();
  }
  function Lt() {
    H && (ct && (je = !0), H = !1);
  }
  function Qn(f, S) {
    if (H) {
      pt(f, S);
      return;
    }
    if (!Me) return;
    const C = v.value, B = Math.max(30, St + (f - Ie) * Tt), Y = L.value.filter((Z) => Z.colId !== ze).reduce((Z, le) => Z + le.width, 0), K = C - B;
    K > 10 && (r[ze] = Math.max(10, Math.round(B * Y / K))), n.redraw();
  }
  function Jn() {
    Lt(), Me && (Me = !1, je = !0, e("column-resized"));
  }
  function Ht(f, S) {
    return Ai(
      f,
      S,
      W.value,
      q.value.length,
      i.rowHeight(),
      d.value,
      p.value,
      a.value.length,
      g.value,
      F.value !== null,
      M.value ?? void 0
    );
  }
  let Yt = 0;
  function ei(f, S, C) {
    I.value = null;
    const B = Date.now();
    if (f !== 0) {
      Yt = B, g.value = Math.max(0, Math.min(N.value, g.value + f)), n.redraw();
      return;
    }
    if (C && S !== 0) {
      Yt = B, g.value = Math.max(0, Math.min(N.value, g.value + S)), n.redraw();
      return;
    }
    B - Yt < Yi || (d.value = Math.max(0, Math.min(J.value, d.value + S)), n.redraw());
  }
  function ti(f) {
    if (f.cx < 0)
      return z.value = -1, n.redraw(), null;
    if (I.value && R) {
      const B = Dt(f.cx, f.cy, R, f.hitScale);
      if (B !== "outside")
        return z.value = -1, n.redraw(), B === "clear" ? "pointer" : "text";
    }
    const S = Ht(f.cx, f.cy);
    z.value = S.area === "body" ? S.rowIdx : -1;
    let C;
    if (S.area === "header" && S.colIdx >= 0) {
      const B = W.value[S.colIdx], Y = Nt(S.colIdx, W.value), K = f.cx + g.value;
      C = B && wn(K, Y, B.width, f.hitScale) ? "col-resize" : "pointer";
    } else S.area === "body" ? C = "pointer" : C = "default";
    return n.redraw(), C;
  }
  function ni() {
    z.value = -1, n.redraw();
  }
  function ii(f, S, C) {
    if (f.cx < 0 || I.value && R && Dt(f.cx, f.cy, R, f.hitScale) !== "outside") return;
    if (f.cy >= Se) {
      kt(S, C);
      return;
    }
    const B = f.cx + g.value;
    for (let Y = 0; Y < W.value.length; Y++) {
      const K = W.value[Y], Z = Nt(Y, W.value);
      if (K.colDef.resizable !== !1 && wn(B, Z, K.width, f.hitScale)) {
        Ct(K.colId, S, f.hitScale);
        return;
      }
    }
  }
  function li(f, S) {
    var Y, K, Z;
    const C = { stopPropagation: !1 };
    if (je)
      return je = !1, C;
    if (Me) return C;
    if (f.cx < 0)
      return I.value = null, C;
    if (I.value && R) {
      const le = Dt(f.cx, f.cy, R, f.hitScale);
      if (le === "clear")
        return fn(), C;
      if (le !== "outside")
        return (Y = n.focusFilterInput) == null || Y.call(n), C;
      I.value = null;
    }
    const B = Ht(f.cx, f.cy);
    if (B.area === "header" && B.colIdx >= 0) {
      const le = W.value[B.colIdx], De = Nt(B.colIdx, W.value), Re = f.cx + g.value;
      if (le.colDef.filter && Pi(Re, De, le.width, f.hitScale))
        C.stopPropagation = !0, I.value === le.colId ? I.value = null : (I.value = le.colId, T.value = (K = c[le.colId]) != null && K.startsWith("__eq__") ? c[le.colId].slice(6) : c[le.colId] ?? "", E.value = Math.max(0, De - g.value));
      else if (le.colDef.sortable !== !1) {
        I.value = null;
        const tt = s.value.find((Be) => Be.colId === le.colId), nt = tt ? tt.dir === "asc" ? "desc" : null : "asc";
        S.shiftKey ? s.value = tt ? nt ? s.value.map((Be) => Be.colId === le.colId ? { colId: Be.colId, dir: nt } : Be) : s.value.filter((Be) => Be.colId !== le.colId) : [...s.value, { colId: le.colId, dir: "asc" }] : s.value = nt ? [{ colId: le.colId, dir: nt }] : [], e("sort-changed");
      }
      return C;
    }
    if (I.value = null, B.area === "body" && B.rowIdx >= 0 && B.colIdx >= 0) {
      const le = B.rowIdx;
      S.shiftKey && A.value ? (k.value || (k.value = { ...A.value }), A.value = { row: le, col: B.colIdx }) : (A.value = { row: le, col: B.colIdx }, k.value = { row: le, col: B.colIdx }), (Z = n.focusCanvas) == null || Z.call(n);
      const De = q.value[le], Re = W.value[B.colIdx];
      De && Re && (e("row-clicked", { data: De, event: S }), e("cell-selected", { data: De, row: le, col: B.colIdx, colId: Re.colId }));
    }
    return C;
  }
  function oi(f) {
    I.value && (f && R && f.cx >= 0 && Dt(f.cx, f.cy, R, f.hitScale) !== "outside" || (I.value = null));
  }
  function ai(f) {
    const C = W.value.length - 1, B = q.value.length - 1;
    if (!A.value) {
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(f.key) && (f.preventDefault(), A.value = { row: me.value, col: 0 }, k.value = { row: me.value, col: 0 });
      return;
    }
    let { row: Y, col: K } = A.value;
    const Z = (le, De, Re = !1) => {
      Y = Math.max(0, Math.min(B, le)), K = Math.max(0, Math.min(C, De)), A.value = { row: Y, col: K }, Re || (k.value = { row: Y, col: K }), Q(Y), re(K);
    };
    switch (f.key) {
      case "ArrowDown":
        f.preventDefault(), Z(Y + 1, K, f.shiftKey);
        break;
      case "ArrowUp":
        f.preventDefault(), Z(Y - 1, K, f.shiftKey);
        break;
      case "ArrowRight":
        f.preventDefault(), f.shiftKey ? Z(Y, K + 1, !0) : K < C ? Z(Y, K + 1) : Z(Y + 1, 0);
        break;
      case "ArrowLeft":
        f.preventDefault(), f.shiftKey ? Z(Y, K - 1, !0) : K > 0 ? Z(Y, K - 1) : Z(Y - 1, C);
        break;
      case "Tab":
        f.preventDefault(), f.shiftKey ? K > 0 ? Z(Y, K - 1) : Z(Y - 1, C) : K < C ? Z(Y, K + 1) : Z(Y + 1, 0);
        break;
      case "Enter":
        f.preventDefault(), f.shiftKey ? Z(Y - 1, K) : Z(Y + 1, K);
        break;
      case "Home":
        f.preventDefault(), f.ctrlKey || f.metaKey ? Z(0, 0, f.shiftKey) : Z(Y, 0, f.shiftKey);
        break;
      case "End":
        f.preventDefault(), f.ctrlKey || f.metaKey ? Z(B, C, f.shiftKey) : Z(Y, C, f.shiftKey);
        break;
      case "PageDown":
        f.preventDefault(), Z(Math.min(B, Y + ue.value), K, f.shiftKey);
        break;
      case "PageUp":
        f.preventDefault(), Z(Math.max(0, Y - ue.value), K, f.shiftKey);
        break;
      case "Escape":
        A.value = null, k.value = null;
        break;
      case "c":
      case "C":
        (f.ctrlKey || f.metaKey) && (f.preventDefault(), si());
        break;
    }
  }
  function si() {
    var Re;
    if (!A.value) return;
    const f = W.value, S = q.value, C = k.value ?? A.value, B = Math.min(C.row, A.value.row), Y = Math.max(C.row, A.value.row), K = Math.min(C.col, A.value.col), Z = Math.max(C.col, A.value.col), le = [];
    for (let tt = B; tt <= Y; tt++) {
      const nt = S[tt];
      if (!nt) continue;
      const Be = [];
      for (let Vt = K; Vt <= Z; Vt++) {
        const mn = f[Vt];
        mn && Be.push(ee(mn, nt).replace(/[\t\r\n]+/g, " "));
      }
      le.push(Be.join("	"));
    }
    const De = le.join(`
`);
    (Re = navigator.clipboard) == null || Re.writeText(De).catch(() => {
    });
  }
  function ri(f) {
    T.value = f, f ? c[I.value] = f : delete c[I.value], e("filter-changed");
  }
  function fn() {
    I.value && delete c[I.value], T.value = "", I.value = null, e("filter-changed");
  }
  function ci() {
    I.value = null;
  }
  function ui(f, S) {
    if (!I.value || !f.width) return;
    const C = f.getContext("2d");
    if (!C) return;
    C.setTransform(S, 0, 0, S, 0, 0), R = Di(f.width / S, E.value, !!T.value);
    const B = vt[i.theme()] ?? vt.none;
    Ii(C, R, T.value, D.value, B);
  }
  function hi(f, { dpr: S, glow: C }) {
    var B, Y, K, Z;
    Ri(f, {
      cols: W.value,
      rows: q.value,
      pinnedRows: a.value,
      rowHeight: i.rowHeight(),
      // Per-row variable heights for `wrap` columns.
      rowHeights: M.value ?? void 0,
      scrollY: d.value,
      scrollX: g.value,
      theme: i.theme(),
      glow: C,
      sorts: s.value,
      colFilters: c,
      hoveredRow: z.value,
      selectedRow: ((B = A.value) == null ? void 0 : B.row) ?? -1,
      selectedCol: ((Y = A.value) == null ? void 0 : Y.col) ?? -1,
      selectionAnchorRow: ((K = k.value) == null ? void 0 : K.row) ?? -1,
      selectionAnchorCol: ((Z = k.value) == null ? void 0 : Z.col) ?? -1,
      formatCell: ee,
      getCellStyle: ie,
      aggregateRow: F.value,
      dpr: S
    }), ui(f, S);
  }
  const fi = {
    setGridOption(f, S) {
      f === "rowData" ? l.value = S : f === "pinnedBottomRowData" ? a.value = S : f === "quickFilterText" && (o.value = S);
    },
    getColumnState() {
      return i.columnDefs().map((f) => {
        var C;
        const S = _(f);
        return {
          colId: S,
          hide: u.has(S),
          sort: ((C = s.value.find((B) => B.colId === S)) == null ? void 0 : C.dir) ?? null,
          sortIndex: s.value.some((B) => B.colId === S) ? s.value.findIndex((B) => B.colId === S) : null,
          width: r[S] ?? f.width
        };
      });
    },
    applyColumnState({ state: f }) {
      const S = f.filter((C) => C.sort).sort((C, B) => (C.sortIndex ?? 0) - (B.sortIndex ?? 0));
      S.length && (s.value = S.map((C) => ({ colId: C.colId, dir: C.sort })));
      for (const C of f)
        C.hide === !0 && u.add(C.colId), C.hide === !1 && u.delete(C.colId), C.width && (r[C.colId] = C.width);
    },
    setFilterModel(f) {
      for (const S of Object.keys(c)) delete c[S];
      if (f)
        for (const [S, C] of Object.entries(f))
          (C == null ? void 0 : C.type) === "equals" ? c[S] = `__eq__${C.filter}` : C != null && C.filter && (c[S] = C.filter);
    },
    getFilterModel() {
      const f = {};
      for (const [S, C] of Object.entries(c))
        C && (f[S] = C.startsWith("__eq__") ? { type: "equals", filter: C.slice(6) } : { type: "contains", filter: C });
      return f;
    },
    async setColumnFilterModel(f, S) {
      S ? S.type === "equals" ? c[f] = `__eq__${S.filter}` : c[f] = S.filter ?? "" : delete c[f];
    },
    onFilterChanged() {
    },
    refreshCells() {
      m.value++;
    },
    exportDataAsCsv({ fileName: f = "export.csv" } = {}) {
      const S = L.value, C = S.map((Z) => Z.colDef.headerName ?? Z.colId).join(","), B = q.value.map(
        (Z) => S.map((le) => `"${String(ee(le, Z)).replace(/"/g, '""')}"`).join(",")
      ), Y = new Blob([[C, ...B].join(`
`)], { type: "text/csv" }), K = URL.createObjectURL(Y);
      Object.assign(document.createElement("a"), { href: K, download: f }).click(), URL.revokeObjectURL(K);
    },
    resize() {
      var f;
      (f = n.resize) == null || f.call(n);
    },
    resetColumnState() {
      u.clear();
      for (const f of i.columnDefs())
        f.hide && u.add(_(f));
      s.value = oe();
      for (const f of Object.keys(r)) delete r[f];
      for (const f of Object.keys(c)) delete c[f];
      o.value = "", d.value = 0, A.value = null, I.value = null;
    }
  };
  function di() {
    var f, S;
    for (const C of i.columnDefs())
      C.hide && u.add(_(C));
    s.value.length || (s.value = oe()), l.value = ((f = i.rowData) == null ? void 0 : f.call(i)) ?? [], a.value = ((S = i.pinnedBottomRowData) == null ? void 0 : S.call(i)) ?? [];
  }
  function vi() {
    G && (clearInterval(G), G = null), t.stop();
  }
  return {
    // reactive state / derived
    scrollX: g,
    scrollY: d,
    maxScrollX: N,
    maxScrollY: J,
    filteredRows: q,
    displayCols: W,
    resolvedCols: L,
    aggregateRow: F,
    rowHeights: M,
    firstVisibleRow: me,
    lastVisibleRow: Ce,
    visibleRowCount: ue,
    selectedCell: A,
    selectionAnchor: k,
    hoveredRow: z,
    activeFilter: I,
    filterPopupValue: T,
    caretOn: D,
    canvasW: v,
    canvasH: p,
    screenW: b,
    screenH: x,
    sortState: s,
    colFilters: c,
    // helpers
    formatCell: ee,
    getCellValue: j,
    hit: Ht,
    get resizing() {
      return Me;
    },
    get panning() {
      return H;
    },
    // viewport + scrolling
    setViewport: te,
    pageUp: de,
    pageDown: pe,
    ensureRowVisible: Q,
    ensureColVisible: re,
    // input (canvas space)
    wheel: ei,
    hover: ti,
    leave: ni,
    pointerDown: ii,
    click: li,
    docClick: oi,
    keyDown: ai,
    panStart: kt,
    panMove: pt,
    panEnd: Lt,
    globalMove: Qn,
    globalUp: Jn,
    // filter popup
    setFilterText: ri,
    clearFilter: fn,
    closeFilter: ci,
    // paint / api / lifecycle
    paint: hi,
    api: fi,
    init: di,
    dispose: vi
  };
}
const Oi = ["value"], $i = ["disabled"], Ui = ["disabled"], Xi = 28, Ni = /* @__PURE__ */ Ne({
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
  setup(i, { emit: t }) {
    const e = i, n = t, l = X(null), a = Vn({
      columnDefs: () => e.columnDefs,
      defaultColDef: () => e.defaultColDef,
      rowData: () => e.rowData,
      pinnedBottomRowData: () => e.pinnedBottomRowData,
      rowHeight: () => e.rowHeight,
      theme: () => e.theme,
      emit: n,
      host: {
        redraw: () => j(),
        resize: () => N(),
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
      maxScrollY: s,
      filteredRows: c,
      displayCols: r,
      selectedCell: u,
      firstVisibleRow: m,
      lastVisibleRow: v,
      activeFilter: p,
      filterPopupValue: b,
      formatCell: x,
      pageUp: d,
      pageDown: g,
      clearFilter: z
    } = a, A = X(null), k = X(null), I = bt("cathodeResetTick", X(0));
    ne(I, () => pe());
    let T = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), E = null, R = !1;
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
    let G, _;
    const L = new Je({
      paint: (H, { dpr: ae, glow: ce }) => a.paint(H, { dpr: ae, glow: ce })
    });
    function W() {
      if (!(!k.value || !A.value)) {
        try {
          E = new P.WebGLRenderer({ canvas: k.value, antialias: !1, alpha: !0 });
        } catch {
          R = !0;
        }
        if (!R && !E.getContext() && (E.dispose(), E = null, R = !0), R) {
          N();
          return;
        }
        E.setPixelRatio(1), E.setClearColor(0, 0), G = new P.Scene(), _ = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), G.add(new P.Mesh(new P.PlaneGeometry(2, 2), L.material)), N();
      }
    }
    function N() {
      if (!A.value || !E && !R) return;
      const H = A.value.clientWidth, ae = A.value.clientHeight - (e.pagination ? Xi : 0);
      if (!H || !ae) return;
      const ce = e.bendField ? Math.round(H * zn(e.curvature)) : H;
      L.resize(ce, ae), L.setScreenSize(H, ae), T = L.dpr, a.setViewport(ce, ae, H, ae), E ? (E.setPixelRatio(T), E.setSize(H, ae)) : k.value && (k.value.width = Math.round(H * T), k.value.height = Math.round(ae * T), k.value.style.width = H + "px", k.value.style.height = ae + "px"), j();
    }
    function j() {
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
      }), L.syncUniforms(), L.paint(e.glow), E.render(G, _);
    }
    function ee(H, ae) {
      if (!k.value) return [-1, -1];
      const ce = k.value.getBoundingClientRect(), et = H - ce.left, Ve = ae - ce.top, ct = ce.width, Ct = ce.height, kt = st(e.curvature), [pt, Lt] = An(et, Ve, ct, Ct, kt, L.canvas.width / T || ct, L.canvas.height / T || Ct);
      return pt < 0 ? [-1, -1] : [pt, Lt];
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
    function h(H) {
      a.wheel(H.deltaX, H.deltaY, H.shiftKey);
    }
    function w(H) {
      if (a.resizing) return;
      e.magnify && k.value && L.setLens(Mt(H, k.value));
      const ae = a.hover(q(H));
      ae && k.value && (k.value.style.cursor = ae);
    }
    function y() {
      L.setLens(null), a.leave();
    }
    function M(H) {
      a.pointerDown(q(H), H.clientX, H.clientY);
    }
    function O(H) {
      a.click(q(H), H).stopPropagation && H.stopPropagation();
    }
    function $(H) {
      p.value && a.docClick(H.target === k.value ? q(H) : null);
    }
    function U(H) {
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
    function Ce() {
      a.panEnd();
    }
    function F(H) {
      a.keyDown(H);
    }
    function te(H) {
      a.setFilterText(H.target.value);
    }
    ne(() => e.theme, () => j()), ne(() => [e.curvature, e.bendField], () => Ae(N)), ne(() => e.scanlines, () => j()), ne(() => e.glow, () => j()), ne(() => e.magnify, (H) => {
      H || L.setLens(null), j();
    });
    let Q = null, re = null, de = 0;
    function pe() {
      cancelAnimationFrame(de), de = requestAnimationFrame(N);
    }
    function Me(H) {
      H.preventDefault();
    }
    function ze() {
      E == null || E.dispose(), E = null, R = !1, W();
    }
    Ye(() => {
      a.init(), document.addEventListener("click", $), document.addEventListener("mousemove", U), document.addEventListener("mouseup", J), Ae(() => {
        var H;
        W(), k.value && (k.value.addEventListener("webglcontextlost", Me), k.value.addEventListener("webglcontextrestored", ze)), A.value && (Q = new ResizeObserver(() => N()), Q.observe(A.value), re = new IntersectionObserver((ae) => {
          ae.some((ce) => ce.isIntersecting) && pe();
        }), re.observe(A.value)), window.addEventListener("resize", pe), (H = window.visualViewport) == null || H.addEventListener("resize", pe), n("grid-ready", { api: a.api });
      });
    }), Ge(() => {
      var H, ae, ce;
      document.removeEventListener("click", $), document.removeEventListener("mousemove", U), document.removeEventListener("mouseup", J), (H = k.value) == null || H.removeEventListener("webglcontextlost", Me), (ae = k.value) == null || ae.removeEventListener("webglcontextrestored", ze), Q == null || Q.disconnect(), re == null || re.disconnect(), window.removeEventListener("resize", pe), (ce = window.visualViewport) == null || ce.removeEventListener("resize", pe), cancelAnimationFrame(de), D(), L.dispose(), a.dispose();
    });
    const Ie = se(() => vt[e.theme] ?? vt.none), St = se(() => ({
      background: Ie.value.headerBg,
      borderTop: `1px solid ${Ie.value.border}`,
      color: Ie.value.text
    })), Tt = se(() => ({
      background: Ie.value.bg
    })), je = se(() => Ie.value.accent);
    return (H, ae) => {
      var ce, et;
      return xe(), be("div", {
        ref_key: "wrapEl",
        ref: A,
        class: "cathode-wrap",
        style: $e(Tt.value)
      }, [
        he("canvas", {
          ref_key: "canvasEl",
          ref: k,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: it(h, ["prevent"]),
          onMousemove: w,
          onMouseleave: y,
          onMousedown: M,
          onClick: O,
          onKeydown: F,
          onTouchstartPassive: ue,
          onTouchmove: me,
          onTouchend: Ce,
          onTouchcancel: Ce
        }, null, 544),
        fe(p) ? (xe(), be("input", {
          key: 0,
          ref_key: "filterGhostEl",
          ref: l,
          class: "cathode-filter-ghost",
          "aria-label": "Filter column",
          value: fe(b),
          autofocus: "",
          onInput: te,
          onKeydown: [
            ae[0] || (ae[0] = pn(
              //@ts-ignore
              (...Ve) => fe(z) && fe(z)(...Ve),
              ["escape"]
            )),
            ae[1] || (ae[1] = pn((Ve) => fe(a).closeFilter(), ["enter"]))
          ]
        }, null, 40, Oi)) : Ue("", !0),
        i.pagination ? (xe(), be("div", {
          key: 1,
          class: "cathode-pagination",
          style: $e(St.value)
        }, [
          he("button", {
            disabled: fe(o) <= 0,
            onClick: ae[2] || (ae[2] = (Ve) => fe(d)())
          }, "◀", 8, $i),
          he("span", null, He((fe(m) + 1).toLocaleString()) + "–" + He(Math.min(fe(c).length, fe(v) + 1).toLocaleString()) + " / " + He(fe(c).length.toLocaleString()), 1),
          he("button", {
            disabled: fe(o) >= fe(s),
            onClick: ae[3] || (ae[3] = (Ve) => fe(g)())
          }, "▶", 8, Ui),
          he("span", {
            class: "cathode-page-info",
            style: $e({ color: je.value })
          }, He(fe(c).length.toLocaleString()) + " rows ", 5),
          fe(u) ? (xe(), be("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: $e({ color: je.value })
          }, He(((ce = fe(r)[fe(u).col]) == null ? void 0 : ce.colDef.headerName) ?? ((et = fe(r)[fe(u).col]) == null ? void 0 : et.colId)) + " : " + He(fe(x)(fe(r)[fe(u).col], fe(c)[fe(u).row])), 5)) : Ue("", !0)
        ], 4)) : Ue("", !0)
      ], 4);
    };
  }
}), Ke = (i, t) => {
  const e = i.__vccOpts || i;
  for (const [n, l] of t)
    e[n] = l;
  return e;
}, ro = /* @__PURE__ */ Ke(Ni, [["__scopeId", "data-v-3f5baab2"]]), _t = {
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
function Gi(i, t) {
  switch (t) {
    case "warn":
      return i.levelWarn;
    case "error":
      return i.levelError;
    case "debug":
      return i.levelDebug;
    case "success":
      return i.levelSuccess;
    case "info":
    default:
      return i.levelInfo;
  }
}
const Ki = 12, ke = 18, xt = 10, at = 6, sn = `${Ki}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function ji(i, t, e) {
  if (e <= 0 || !t) return [t];
  const n = [];
  for (const l of t.split(`
`)) {
    if (!l) {
      n.push("");
      continue;
    }
    if (i.measureText(l).width <= e) {
      n.push(l);
      continue;
    }
    const a = l.split(/(\s+)/);
    let o = "";
    for (const s of a) {
      const c = o + s;
      if (i.measureText(c).width <= e)
        o = c;
      else if (o && (n.push(o.replace(/\s+$/, "")), o = ""), i.measureText(s).width > e) {
        let r = "";
        for (const u of s)
          i.measureText(r + u).width > e ? (r && n.push(r), r = u) : r += u;
        o = r;
      } else
        o = s.replace(/^\s+/, "");
    }
    o && n.push(o.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function On(i) {
  if (typeof i == "number") {
    const t = new Date(i), e = String(t.getHours()).padStart(2, "0"), n = String(t.getMinutes()).padStart(2, "0"), l = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${l}`;
  }
  return i;
}
function qi(i, t) {
  return Math.ceil(i.measureText(t).width) + 12;
}
function Zi(i) {
  const { entries: t, ctx: e, textMaxWidth: n, showTimestamps: l, wordWrap: a } = i, o = i.formatTs ?? On;
  e.font = sn;
  const s = [];
  for (let c = 0; c < t.length; c++) {
    const r = t[c], u = r.level ?? "info", m = l && r.ts != null ? o(r.ts) : "", v = a ? ji(e, r.text, n) : r.text.split(`
`);
    for (let p = 0; p < v.length; p++)
      s.push({
        entryIdx: c,
        text: v[p],
        level: u,
        timestamp: p === 0 ? m : "",
        isFirstFrag: p === 0,
        widthPx: e.measureText(v[p]).width
      });
  }
  return s;
}
function Qi(i, t) {
  const e = i.getContext("2d");
  if (!e) return;
  const n = t.dpr ?? 1, l = i.width / n, a = i.height / n, o = _t[t.theme] ?? _t.none;
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, i.width, i.height), e.setTransform(n, 0, 0, n, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = sn, e.textBaseline = "middle";
  const s = t.visualLines, c = xt - t.scrollX, r = (t.showTimestamps ? xt + t.timestampWidth : xt) - t.scrollX, u = Math.max(0, Math.floor((t.scrollY - at) / ke)), m = Math.min(s.length, Math.ceil((t.scrollY + a - at) / ke) + 1);
  for (let v = u; v < m; v++) {
    const p = s[v], b = at + v * ke - t.scrollY + ke / 2;
    if (p.entryIdx % 2 === 1 && p.isFirstFrag) {
      e.fillStyle = o.rowAlt;
      let d = 1;
      for (; v + d < m && s[v + d].entryIdx === p.entryIdx; ) d++;
      e.fillRect(0, b - ke / 2, l, ke * d);
    }
    t.selectionStart >= 0 && v >= t.selectionStart && v <= t.selectionEnd && (e.fillStyle = o.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, b - ke / 2, l, ke)), v === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, b - ke / 2, l, ke)), t.showTimestamps && p.timestamp && (e.fillStyle = o.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 6, e.shadowColor = o.timestamp), e.fillText(p.timestamp, c, b), e.shadowBlur = 0);
    const x = Gi(o, p.level);
    e.fillStyle = x, e.textAlign = "left", t.glow ? (e.shadowColor = x, e.shadowBlur = 14, e.fillText(p.text, r, b), e.shadowBlur = 7, e.fillText(p.text, r, b), e.shadowBlur = 3, e.fillText(p.text, r, b), e.shadowBlur = 0) : e.fillText(p.text, r, b);
  }
  e.restore();
}
function yn(i, t, e) {
  if (i < 0) return -1;
  const n = Math.floor((i + t - at) / ke);
  return n < 0 || n >= e ? -1 : n;
}
function Ji(i) {
  return at * 2 + i * ke;
}
function $n(i) {
  const t = on();
  return t.run(() => {
    const e = () => {
      var F;
      return ((F = i.showTimestamps) == null ? void 0 : F.call(i)) ?? !0;
    }, n = () => {
      var F;
      return ((F = i.wordWrap) == null ? void 0 : F.call(i)) ?? !0;
    }, l = X(0), a = X(0), o = X(0), s = X(0), c = X(-1), r = X(!0), u = X(-1), m = X(-1), v = document.createElement("canvas"), p = se(() => {
      var Q;
      const F = i.entries() ?? [], te = ((Q = i.maxLines) == null ? void 0 : Q.call(i)) ?? 0;
      return te > 0 && F.length > te ? F.slice(F.length - te) : F;
    }), b = se(() => {
      var Q;
      if (!e()) return "";
      const F = ((Q = i.formatTs) == null ? void 0 : Q.call(i)) ?? On;
      let te = "00:00:00";
      for (const re of p.value) {
        if (re.ts == null) continue;
        const de = F(re.ts);
        de.length > te.length && (te = de);
      }
      return te;
    }), x = X(0), d = X([]);
    function g() {
      var Q;
      const F = v.getContext("2d");
      if (!F) return;
      F.font = sn;
      const te = e() ? qi(F, b.value) : 0;
      x.value = te, d.value = Zi({
        entries: p.value,
        ctx: F,
        textMaxWidth: Math.max(1, l.value - xt * 2 - te),
        showTimestamps: e(),
        formatTs: (Q = i.formatTs) == null ? void 0 : Q.call(i),
        wordWrap: n()
      });
    }
    const z = se(() => Ji(d.value.length)), A = se(() => Math.max(0, z.value - a.value)), k = se(() => {
      let F = 0;
      for (const te of d.value) te.widthPx > F && (F = te.widthPx);
      return xt * 2 + x.value + F;
    }), I = se(() => Math.max(0, k.value - l.value));
    ne(A, () => {
      r.value ? o.value = A.value : o.value = Math.min(o.value, A.value);
    }), ne(I, () => {
      s.value = Math.min(s.value, I.value);
    }), ne(
      [p, l, e, n, b],
      () => {
        g(), Ae(() => i.host.redraw());
      },
      { deep: !1 }
    ), ne(o, () => i.host.redraw()), ne(s, () => i.host.redraw()), ne(c, () => i.host.redraw()), ne([u, m], () => i.host.redraw());
    function T(F, te) {
      l.value = F, a.value = te, g(), r.value && (o.value = Math.max(0, z.value - a.value));
    }
    function E(F) {
      o.value = Math.max(0, Math.min(A.value, F)), r.value = o.value >= A.value - 4;
    }
    function R(F) {
      s.value = Math.max(0, Math.min(I.value, F));
    }
    function D(F, te, Q) {
      Q ? R(s.value + te) : Math.abs(F) > Math.abs(te) ? R(s.value + F) : E(o.value + te);
    }
    function G() {
      r.value = !0, o.value = A.value;
    }
    function _(F) {
      E(at + F * ke);
    }
    let L = !1, W = !1, N = 0, j = 0, ee = 0, ie = 0;
    function oe(F, te) {
      L = !0, W = !1, N = F, j = te, ee = s.value, ie = o.value;
    }
    function q(F, te) {
      if (!L) return !1;
      const Q = N - F, re = j - te;
      return (Math.abs(Q) > 4 || Math.abs(re) > 4) && (W = !0), R(ee + Q), E(ie + re), !0;
    }
    function h() {
      L && (L = !1, W && (W = !1));
    }
    const w = () => L;
    function y(F) {
      c.value = F < 0 ? -1 : yn(F, o.value, d.value.length);
    }
    function M() {
      c.value = -1;
    }
    function O(F, te) {
      if (W) {
        W = !1;
        return;
      }
      const Q = F < 0 ? -1 : yn(F, o.value, d.value.length);
      if (Q < 0) {
        u.value = -1, m.value = -1;
        return;
      }
      te && u.value >= 0 || (u.value = Q), m.value = Q;
    }
    function $(F, te) {
      const Q = d.value.length;
      if (Q === 0) return;
      const re = m.value < 0 ? 0 : m.value, de = Math.max(0, Math.min(Q - 1, re + F));
      m.value = de, (!te || u.value < 0) && (u.value = de), c.value = de;
      const pe = at + de * ke, Me = pe + ke;
      pe < o.value ? E(pe) : Me > o.value + a.value && E(Me - a.value);
    }
    function U() {
      const F = Math.min(u.value, m.value), te = Math.max(u.value, m.value);
      if (F < 0) return "";
      const Q = d.value, re = /* @__PURE__ */ new Set(), de = [];
      for (let pe = F; pe <= te && pe < Q.length; pe++) {
        const Me = Q[pe];
        if (re.has(Me.entryIdx)) continue;
        re.add(Me.entryIdx);
        let ze = "";
        for (let Ie = 0; Ie < Q.length; Ie++)
          Q[Ie].entryIdx === Me.entryIdx && (ze += (ze && !Q[Ie].isFirstFrag ? " " : "") + Q[Ie].text);
        de.push(Me.timestamp ? `${Me.timestamp}  ${ze}` : ze);
      }
      return de.join(`
`);
    }
    async function J() {
      const F = U();
      if (F)
        try {
          await navigator.clipboard.writeText(F);
        } catch {
          const te = document.createElement("textarea");
          te.value = F, te.style.position = "fixed", te.style.opacity = "0", document.body.appendChild(te), te.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(te);
        }
    }
    function ue(F) {
      if ((F.metaKey || F.ctrlKey) && (F.key === "c" || F.key === "C")) {
        u.value >= 0 && (F.preventDefault(), J());
        return;
      }
      if ((F.metaKey || F.ctrlKey) && (F.key === "a" || F.key === "A")) {
        F.preventDefault(), u.value = 0, m.value = d.value.length - 1;
        return;
      }
      switch (F.key) {
        case "ArrowDown":
          F.preventDefault(), $(1, F.shiftKey);
          break;
        case "ArrowUp":
          F.preventDefault(), $(-1, F.shiftKey);
          break;
        case "ArrowRight":
          F.preventDefault(), R(s.value + ke * 2);
          break;
        case "ArrowLeft":
          F.preventDefault(), R(s.value - ke * 2);
          break;
        case "PageDown":
          F.preventDefault(), E(o.value + a.value);
          break;
        case "PageUp":
          F.preventDefault(), E(o.value - a.value);
          break;
        case "Home":
          F.preventDefault(), E(0), R(0);
          break;
        case "End":
          F.preventDefault(), E(A.value);
          break;
        case "Escape":
          u.value = -1, m.value = -1;
          break;
      }
    }
    function me(F, { dpr: te, glow: Q }) {
      Qi(F, {
        visualLines: d.value,
        scrollY: o.value,
        scrollX: s.value,
        theme: i.theme(),
        glow: Q,
        showTimestamps: e(),
        timestampWidth: x.value,
        hoveredLine: c.value,
        selectionStart: Math.min(u.value, m.value),
        selectionEnd: Math.max(u.value, m.value),
        dpr: te
      });
    }
    function Ce() {
      t.stop();
    }
    return {
      // state
      canvasW: l,
      canvasH: a,
      scrollY: o,
      scrollX: s,
      hoveredLine: c,
      stuckToBottom: r,
      selectionAnchor: u,
      selectionActive: m,
      visualLines: d,
      tsWidth: x,
      contentH: z,
      maxScrollY: A,
      maxScrollX: I,
      // actions
      setViewport: T,
      setScroll: E,
      setScrollX: R,
      wheel: D,
      scrollToBottom: G,
      scrollToLine: _,
      panStart: oe,
      panMove: q,
      panEnd: h,
      panning: w,
      hover: y,
      leave: M,
      click: O,
      keyDown: ue,
      moveSelection: $,
      selectionAsText: U,
      copySelection: J,
      paint: me,
      dispose: Ce
    };
  });
}
const el = /* @__PURE__ */ Ne({
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
  setup(i, { expose: t }) {
    const e = i, n = X(null), l = X(null), a = { ...Te }, o = $n({
      entries: () => e.entries,
      theme: () => e.theme,
      showTimestamps: () => e.showTimestamps,
      formatTs: () => e.formatTs,
      wordWrap: () => e.wordWrap,
      maxLines: () => e.maxLines,
      host: { redraw: () => d() }
    });
    let s = null, c = !1;
    function r() {
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
    let u, m, v = 1;
    const p = new Je({
      paint: (y, { dpr: M, glow: O }) => o.paint(y, { dpr: M, glow: O })
    });
    function b() {
      if (!(!l.value || !n.value)) {
        try {
          s = new P.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          c = !0;
        }
        if (!c && !s.getContext() && (s.dispose(), s = null, c = !0), c) {
          x();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), u = new P.Scene(), m = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), u.add(new P.Mesh(new P.PlaneGeometry(2, 2), p.material)), x();
      }
    }
    function x() {
      if (!n.value || !s && !c) return;
      const y = n.value.clientWidth, M = n.value.clientHeight;
      !y || !M || p.resize(y, M) && (p.setScreenSize(y, M), v = p.dpr, o.setViewport(y, M), s ? (s.setPixelRatio(v), s.setSize(y, M)) : l.value && (l.value.width = Math.round(y * v), l.value.height = Math.round(M * v), l.value.style.width = y + "px", l.value.style.height = M + "px"), d());
    }
    function d() {
      if (!p.canvas.width) return;
      if (c) {
        if (!l.value) return;
        p.paintOnly(!1);
        const M = l.value.getContext("2d");
        M && M.drawImage(p.canvas, 0, 0, p.canvas.width, p.canvas.height, 0, 0, l.value.width, l.value.height);
        return;
      }
      if (!s) return;
      const y = e.theme === "paper";
      p.setLook({
        curvature: e.curvature,
        scanlines: e.scanlines && !y,
        vignette: !y,
        magnify: e.magnify
      }), p.setLens(e.magnify ? a : null), p.syncUniforms(), p.paint(e.glow), s.render(u, m);
    }
    ne(() => e.theme, () => d()), ne(() => e.curvature, () => d()), ne(() => e.scanlines, () => d()), ne(() => e.glow, () => d()), ne(() => e.magnify, (y) => {
      y || (a.x = Te.x, a.y = Te.y), d();
    });
    function g(y) {
      if (!l.value) return [-1, -1];
      const M = l.value.getBoundingClientRect();
      return [y.clientX - M.left, y.clientY - M.top];
    }
    function z(y) {
      o.wheel(y.deltaX, y.deltaY, y.shiftKey);
    }
    function A(y) {
      o.panStart(y.clientX, y.clientY), n.value && n.value.focus();
    }
    function k(y) {
      o.panMove(y.clientX, y.clientY);
    }
    function I() {
      o.panEnd();
    }
    function T(y) {
      if (y.touches.length !== 1) return;
      const M = y.touches[0];
      o.panStart(M.clientX, M.clientY), n.value && n.value.focus();
    }
    function E(y) {
      if (!o.panning() || y.touches.length !== 1) return;
      y.preventDefault();
      const M = y.touches[0];
      o.panMove(M.clientX, M.clientY);
    }
    function R() {
      o.panEnd();
    }
    function D(y) {
      const [, M] = g(y);
      o.click(M, y.shiftKey);
    }
    function G(y) {
      o.keyDown(y);
    }
    function _(y) {
      if (e.magnify && l.value) {
        const O = Mt(y, l.value);
        a.x = O.x, a.y = O.y, d();
      }
      const [, M] = g(y);
      o.hover(M);
    }
    function L() {
      o.leave(), a.x = Te.x, a.y = Te.y, d();
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
    let W = null, N = null, j = 0;
    const ee = bt("cathodeResetTick", X(0));
    ne(ee, () => ie());
    function ie() {
      cancelAnimationFrame(j), j = requestAnimationFrame(x);
    }
    function oe(y) {
      y.preventDefault();
    }
    function q() {
      s == null || s.dispose(), s = null, c = !1, b();
    }
    Ye(() => {
      document.addEventListener("mousemove", k), document.addEventListener("mouseup", I), Ae(() => {
        var y;
        b(), l.value && (l.value.addEventListener("webglcontextlost", oe), l.value.addEventListener("webglcontextrestored", q)), n.value && (W = new ResizeObserver(() => x()), W.observe(n.value), N = new IntersectionObserver((M) => {
          M.some((O) => O.isIntersecting) && ie();
        }), N.observe(n.value)), window.addEventListener("resize", ie), (y = window.visualViewport) == null || y.addEventListener("resize", ie), o.scrollY.value = o.maxScrollY.value;
      });
    }), Ge(() => {
      var y, M, O;
      document.removeEventListener("mousemove", k), document.removeEventListener("mouseup", I), (y = l.value) == null || y.removeEventListener("webglcontextlost", oe), (M = l.value) == null || M.removeEventListener("webglcontextrestored", q), W == null || W.disconnect(), N == null || N.disconnect(), window.removeEventListener("resize", ie), (O = window.visualViewport) == null || O.removeEventListener("resize", ie), cancelAnimationFrame(j), r(), o.dispose(), p.dispose();
    });
    const h = se(() => _t[e.theme] ?? _t.none), w = se(() => ({
      background: h.value.bg
    }));
    return (y, M) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: $e(w.value),
      tabindex: "0",
      onKeydown: G
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-log-canvas",
        onWheel: it(z, ["prevent"]),
        onMousemove: _,
        onMouseleave: L,
        onMousedown: A,
        onClick: D,
        onTouchstartPassive: T,
        onTouchmove: E,
        onTouchend: R,
        onTouchcancel: R
      }, null, 544)
    ], 36));
  }
}), tl = /* @__PURE__ */ Ke(el, [["__scopeId", "data-v-328a73e4"]]), nl = ["disabled"], il = /* @__PURE__ */ Ne({
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
  setup(i, { expose: t, emit: e }) {
    const n = i, l = e, a = X(null), o = X(null), s = X(""), c = X([]), r = X(-1);
    let u = "";
    function m(I) {
      I.trim() && (c.value.length && c.value[c.value.length - 1] === I || (c.value.push(I), c.value.length > n.historyLimit && c.value.splice(0, c.value.length - n.historyLimit)));
    }
    function v(I) {
      if (!n.disabled) {
        if (I.key === "Enter") {
          I.preventDefault();
          const T = s.value;
          T.trim() && m(T), r.value = -1, s.value = "", l("submit", T);
          return;
        }
        if (I.key === "ArrowUp") {
          if (!c.value.length) return;
          I.preventDefault(), r.value === -1 ? (u = s.value, r.value = c.value.length - 1) : r.value > 0 && r.value--, s.value = c.value[r.value];
          return;
        }
        if (I.key === "ArrowDown") {
          if (r.value === -1) return;
          I.preventDefault(), r.value < c.value.length - 1 ? (r.value++, s.value = c.value[r.value]) : (r.value = -1, s.value = u, u = "");
          return;
        }
      }
    }
    const p = X(!0);
    let b = null;
    function x() {
      b || (b = setInterval(() => {
        p.value = !p.value;
      }, 530));
    }
    function d() {
      b && (clearInterval(b), b = null), p.value = !0;
    }
    const g = se(() => {
      let I;
      return n.disabled ? I = " " : n.busy ? I = "█" : I = p.value ? "█" : " ", { level: "info", text: `${n.prompt}${s.value}${I}` };
    }), z = se(
      () => [...n.entries, g.value]
    );
    function A() {
      var I;
      n.disabled || (I = o.value) == null || I.focus();
    }
    ne(() => n.busy, (I, T) => {
      T && !I && !n.disabled && Ae(() => {
        var E;
        return (E = o.value) == null ? void 0 : E.focus();
      });
    });
    function k() {
      var I;
      (I = o.value) == null || I.focus();
    }
    return t({ focus: k }), Ye(() => {
      x(), n.disabled || requestAnimationFrame(() => {
        var I;
        return (I = o.value) == null ? void 0 : I.focus();
      });
    }), Ge(() => {
      d();
    }), (I, T) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-terminal-wrap",
      onClick: A
    }, [
      Ln(tl, {
        entries: z.value,
        theme: i.theme,
        curvature: i.curvature,
        scanlines: i.scanlines,
        glow: i.glow,
        magnify: i.magnify,
        "show-timestamps": i.showTimestamps,
        "format-ts": i.formatTs,
        "word-wrap": i.wordWrap,
        autoscroll: i.autoscroll,
        "max-lines": i.maxLines
      }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "magnify", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"]),
      Rn(he("input", {
        ref_key: "inputEl",
        ref: o,
        "onUpdate:modelValue": T[0] || (T[0] = (E) => s.value = E),
        disabled: i.disabled || i.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: v
      }, null, 40, nl), [
        [gi, s.value]
      ])
    ], 512));
  }
}), co = /* @__PURE__ */ Ke(il, [["__scopeId", "data-v-a2b39934"]]), mt = {
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
}, Un = 0.18, gt = 8, rn = 22, ll = 4, Fe = 8, Ze = 56, cn = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ol = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Gt = 4, al = 1, sl = 1;
function rl(i, t, e, n = 0, l = !1) {
  const a = l ? cn : Ze, o = Math.max(0, t - Fe - a), s = Math.max(1, Math.floor(o / e)), c = Math.min(s, i);
  return { firstIdx: Math.max(0, i - c - Math.floor(n / e)), count: c, slotW: e };
}
function cl(i, t, e) {
  if (!i.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, l = -1 / 0, a = 0;
  const o = Math.min(i.length, t + e);
  for (let c = t; c < o; c++) {
    const r = i[c];
    r && (r.low < n && (n = r.low), r.high > l && (l = r.high), r.volume > a && (a = r.volume));
  }
  if (!isFinite(n) || !isFinite(l) || n === l) {
    const c = isFinite(n) ? n : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, a) };
  }
  const s = (l - n) * 0.04;
  return { min: n - s, max: l + s, maxVol: Math.max(1, a) };
}
function ul(i, t, e = !1) {
  const n = e ? ll : rn, l = Math.max(1, i - gt - n - Gt), a = Math.max(0, Math.round(l * t)), o = l - a;
  return {
    priceY0: gt,
    priceY1: gt + o,
    volumeY0: gt + o + Gt,
    volumeY1: gt + o + Gt + a
  };
}
function _e(i, t, e, n) {
  const l = t.max - t.min;
  return l <= 0 ? (e + n) / 2 : e + (1 - (i - t.min) / l) * (n - e);
}
function Qe(i, t, e) {
  return Fe + (i - t + 0.5) * e;
}
function qe(i) {
  const t = Math.abs(i), e = t >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : t >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : t >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : t >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return i.toLocaleString("en-US", e);
}
function un(i) {
  const t = new Date(i), e = String(t.getMonth() + 1).padStart(2, "0"), n = String(t.getDate()).padStart(2, "0"), l = String(t.getHours()).padStart(2, "0"), a = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${l}:${a}`;
}
function hl(i, t) {
  if (i <= 0 || !isFinite(i)) return 1;
  const e = i / Math.max(1, t), n = Math.pow(10, Math.floor(Math.log10(e))), l = e / n;
  let a;
  return l < 1.5 ? a = 1 : l < 3 ? a = 2 : l < 7 ? a = 5 : a = 10, a * n;
}
function Xn(i, t) {
  var b, x, d, g, z;
  const e = i.getContext("2d");
  if (!e) return;
  const n = t.dpr && t.dpr > 0 ? t.dpr : 1;
  e.setTransform(n, 0, 0, n, 0, 0);
  const l = i.width / n, a = i.height / n, o = mt[t.theme] ?? mt.none, s = t.colors ? { ...o, ...t.colors } : o, c = !!t.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = s.bg, e.fillRect(0, 0, l, a), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const r = rl(t.candles.length, l, t.slotW, t.scrollX, c), u = cl(t.candles, r.firstIdx, r.count), m = ul(a, t.showVolume ? t.volumeFraction : 0, c), v = Math.max(al, Math.floor(t.slotW * 0.7)), p = Math.min(t.candles.length, r.firstIdx + r.count);
  for (let A = r.firstIdx; A < p; A++) {
    const k = t.candles[A];
    if (!k) continue;
    const I = Qe(A, r.firstIdx, t.slotW), T = _e(k.open, u, m.priceY0, m.priceY1), E = _e(k.close, u, m.priceY0, m.priceY1), R = _e(k.high, u, m.priceY0, m.priceY1), D = _e(k.low, u, m.priceY0, m.priceY1), G = k.close >= k.open, _ = G ? s.wickBull : s.wickBear, L = G ? s.candleBull : s.candleBear;
    t.glow && (e.shadowBlur = 10, e.shadowColor = L), e.strokeStyle = _, e.lineWidth = sl, e.beginPath(), e.moveTo(Math.round(I) + 0.5, R), e.lineTo(Math.round(I) + 0.5, D), e.stroke(), e.fillStyle = L;
    const W = Math.min(T, E), N = Math.max(1, Math.abs(E - T)), j = Math.round(I - v / 2), ee = Math.round(W), ie = Math.round(N);
    if (e.fillRect(j, ee, v, ie), t.glow && (e.shadowBlur = 4, e.fillRect(j, ee, v, ie)), e.shadowBlur = 0, t.showVolume && u.maxVol > 0) {
      const oe = Math.round(k.volume / u.maxVol * (m.volumeY1 - m.volumeY0));
      oe > 0 && (e.fillStyle = G ? s.volumeBull : s.volumeBear, e.fillRect(
        Math.round(I - v / 2),
        m.volumeY1 - oe,
        v,
        oe
      ));
    }
  }
  if ((b = t.overlays) != null && b.length) {
    const A = { above: 0, below: 0 }, k = t.overlays.filter((T) => T.kind !== "hline" && !!T.label).length, I = k ? 14 + 14 * k + 12 : 8;
    for (const T of t.overlays)
      T.kind === "hline" ? dl(e, T, l, u, m, s, c, A, I) : fl(e, T, r, u, m, t.slotW);
  }
  (x = t.markers) != null && x.length && bl(e, s, t.markers, t.candles, r, u, m, t.slotW), Ml(e, s, u, m, l, c), c || (Sl(e, s, t.candles, r, t.slotW, a), yl(e, s, t.candles, l, a)), (d = t.overlays) != null && d.length && ml(e, s, t.overlays, m), t.hover && (Tl(e, s, t.candles, r, u, m, t.slotW, t.hover, l), pl(e, s, t.candles, r, t.slotW, t.hover, m, ((g = t.overlays) == null ? void 0 : g.length) ?? 0), (z = t.markers) != null && z.length && wl(e, s, t.markers, t.candles, r, u, m, t.slotW, t.hover, l)), e.restore();
}
function fl(i, t, e, n, l, a) {
  var s;
  const o = e.firstIdx + e.count;
  if (i.save(), i.beginPath(), i.rect(
    Fe,
    l.priceY0,
    /* width: */
    999999,
    l.priceY1 - l.priceY0
  ), i.clip(), t.kind === "line")
    It(i, t.data, e.firstIdx, o, a, n, l, t.color, t.lineWidth ?? 1, t.dashed === !0);
  else if (t.kind === "band") {
    const c = Nn(t.color, t.fillAlpha ?? 0.08);
    vl(i, t.upper, t.lower, e.firstIdx, o, a, n, l, c), It(i, t.upper, e.firstIdx, o, a, n, l, t.color, 1, !1), It(i, t.lower, e.firstIdx, o, a, n, l, t.color, 1, !1), (s = t.middle) != null && s.length && It(i, t.middle, e.firstIdx, o, a, n, l, t.color, 1, t.middleDashed !== !1);
  }
  i.restore();
}
function dl(i, t, e, n, l, a, o, s = { above: 0, below: 0 }, c = 8) {
  const r = _e(t.price, n, l.priceY0, l.priceY1), u = r < l.priceY0 - 0.5, m = r > l.priceY1 + 0.5, v = u || m, p = v ? u ? s.above++ : s.below++ : 0, b = v ? u ? l.priceY0 + c + p * 20 : l.priceY1 - 8 - p * 20 : r, x = o ? cn : Ze, d = Math.round(b) + 0.5;
  i.save(), v || (i.strokeStyle = t.color, i.lineWidth = t.lineWidth ?? 1, i.setLineDash(t.dashed === !1 ? [] : [4, 3]), i.beginPath(), i.moveTo(Fe, d), i.lineTo(e - x, d), i.stroke(), i.setLineDash([]));
  let g = t.label ?? qe(t.price);
  if (v && g !== "" && (g = (u ? "↑ " : "↓ ") + g), g !== "") {
    i.font = Xe, i.textBaseline = "middle", i.textAlign = "left";
    const z = i.measureText(g).width, A = 4, k = 2, I = Fe + 2;
    i.fillStyle = t.color, v && (i.globalAlpha = 0.85), i.fillRect(I, b - 7 - k, z + A * 2, 14 + k * 2), i.globalAlpha = 1, i.fillStyle = a.bg && !a.bg.startsWith("rgba(0,0,0,0)") ? a.bg : "#0d1520", i.fillText(g, I + A, b);
  }
  i.restore();
}
function It(i, t, e, n, l, a, o, s, c, r) {
  if (!t || !t.length) return;
  i.strokeStyle = s, i.lineWidth = c, i.setLineDash(r ? [4, 3] : []), i.beginPath();
  let u = !1;
  for (let m = e; m < n; m++) {
    const v = t[m];
    if (typeof v != "number" || !isFinite(v)) {
      u && (i.stroke(), i.beginPath(), u = !1);
      continue;
    }
    const p = Qe(m, e, l), b = _e(v, a, o.priceY0, o.priceY1);
    u ? i.lineTo(p, b) : (i.moveTo(p, b), u = !0);
  }
  u && i.stroke(), i.setLineDash([]);
}
function vl(i, t, e, n, l, a, o, s, c) {
  if (!(t != null && t.length) || !(e != null && e.length)) return;
  i.fillStyle = c;
  let r = !1, u = -1;
  for (let m = n; m <= l; m++) {
    const v = t[m], p = e[m], b = m < l && typeof v == "number" && typeof p == "number" && isFinite(v) && isFinite(p);
    if (b && !r && (u = m, r = !0), !b && r || m === l && r) {
      const x = b ? m + 1 : m;
      i.beginPath();
      for (let d = u; d < x; d++) {
        const g = Qe(d, n, a), z = _e(t[d], o, s.priceY0, s.priceY1);
        d === u ? i.moveTo(g, z) : i.lineTo(g, z);
      }
      for (let d = x - 1; d >= u; d--) {
        const g = Qe(d, n, a), z = _e(e[d], o, s.priceY0, s.priceY1);
        i.lineTo(g, z);
      }
      i.closePath(), i.fill(), r = !1;
    }
  }
}
function Nn(i, t) {
  const e = Math.max(0, Math.min(1, t));
  if (i.startsWith("#") && i.length === 7) {
    const n = parseInt(i.slice(1, 3), 16), l = parseInt(i.slice(3, 5), 16), a = parseInt(i.slice(5, 7), 16);
    return `rgba(${n},${l},${a},${e})`;
  }
  return i.startsWith("rgba") ? i.replace(/[\d.]+\)$/, `${e})`) : i.startsWith("rgb(") ? i.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : i;
}
function ml(i, t, e, n) {
  const l = e.filter((x) => x.kind !== "hline" && !!x.label);
  if (!l.length) return;
  i.save(), i.font = Xe;
  const a = 8, o = 5, s = 12, c = 6, r = 14;
  let u = 0;
  for (const x of l) {
    const d = i.measureText(x.label).width;
    d > u && (u = d);
  }
  const m = a * 2 + s + c + u, v = o * 2 + r * l.length, p = Fe + 4, b = n.priceY0 + 4;
  i.fillStyle = t.panelBg, i.fillRect(p, b, m, v), i.textBaseline = "middle", i.textAlign = "left";
  for (let x = 0; x < l.length; x++) {
    const d = l[x], g = b + o + r * (x + 0.5), z = p + a;
    d.kind === "line" ? (i.strokeStyle = d.color, i.lineWidth = d.lineWidth ?? 1, i.setLineDash(d.dashed ? [3, 3] : []), i.beginPath(), i.moveTo(z, g), i.lineTo(z + s, g), i.stroke(), i.setLineDash([])) : d.kind === "band" && (i.fillStyle = Nn(d.color, d.fillAlpha ?? 0.2), i.fillRect(z, g - 4, s, 8), i.strokeStyle = d.color, i.lineWidth = 1, i.strokeRect(z + 0.5, g - 4 + 0.5, s - 1, 7)), i.fillStyle = t.text, i.fillText(d.label, z + s + c, g);
  }
  i.restore();
}
function pl(i, t, e, n, l, a, o, s) {
  const c = Math.floor((a.x - Fe) / l), r = n.firstIdx + c;
  if (r < 0 || r >= e.length) return;
  const u = e[r];
  if (!u) return;
  const m = u.close - u.open, v = u.open !== 0 ? m / u.open * 100 : 0, p = m >= 0 ? "+" : "", b = [
    ["O", qe(u.open), void 0],
    ["H", qe(u.high), void 0],
    ["L", qe(u.low), void 0],
    ["C", qe(u.close), void 0],
    ["V", gl(u.volume), void 0],
    ["", `${p}${v.toFixed(2)}%`, m >= 0 ? t.candleBull : t.candleBear]
  ];
  i.save(), i.font = Xe, i.textBaseline = "middle", i.textAlign = "left";
  const x = 8, d = 4, g = 14;
  let z = x;
  for (const [T, E] of b) {
    const R = T ? `${T} ${E}` : E, D = i.measureText(R).width + 12;
    z += D;
  }
  z += x - 12;
  const A = o.priceY0 + 4 + (s > 0 ? d * 2 + 14 * s + 4 : 0), k = Fe + 4;
  i.fillStyle = t.panelBg, i.fillRect(k, A, z, g + d * 2);
  let I = k + x;
  for (let T = 0; T < b.length; T++) {
    const [E, R, D] = b[T];
    i.fillStyle = t.text, E && (i.globalAlpha = 0.6, i.fillText(E + " ", I, A + d + g / 2), i.globalAlpha = 1, I += i.measureText(E + " ").width), D && (i.fillStyle = D), i.fillText(R, I, A + d + g / 2), I += i.measureText(R).width + 12;
  }
  i.restore();
}
function gl(i) {
  return !isFinite(i) || i <= 0 ? "0" : i >= 1e9 ? (i / 1e9).toFixed(2) + "B" : i >= 1e6 ? (i / 1e6).toFixed(2) + "M" : i >= 1e3 ? (i / 1e3).toFixed(1) + "K" : Math.round(i).toString();
}
function wl(i, t, e, n, l, a, o, s, c, r) {
  if (!n.length) return;
  const u = n.length > 1 ? n[1].start - n[0].start : 6e4, m = Math.max(1, u * 0.5), v = Math.min(n.length, l.firstIdx + l.count), p = 9;
  let b = null;
  for (const R of e) {
    let D = 0, G = n.length - 1, _ = -1;
    for (; D <= G; ) {
      const N = D + G >> 1, j = n[N].start - R.timestamp;
      if (Math.abs(j) <= m) {
        _ = N;
        break;
      }
      j < 0 ? D = N + 1 : G = N - 1;
    }
    if (_ < 0 || _ < l.firstIdx || _ >= v) continue;
    const L = Qe(_, l.firstIdx, s), W = _e(R.price, a, o.priceY0, o.priceY1);
    if (Math.abs(c.x - L) <= p && Math.abs(c.y - W) <= p) {
      b = { m: R, x: L, y: W };
      break;
    }
  }
  if (!b) return;
  const x = un(b.m.timestamp), d = [
    `${b.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${x}`,
    `@ ${qe(b.m.price)}`
  ];
  b.m.label && d.push(b.m.label), i.save(), i.font = Xe, i.textBaseline = "top", i.textAlign = "left";
  const g = 6, z = 14;
  let A = 0;
  for (const R of d) {
    const D = i.measureText(R).width;
    D > A && (A = D);
  }
  const k = A + g * 2, I = d.length * z + g * 2;
  let T = b.x + 12;
  T + k > r - Ze && (T = b.x - 12 - k);
  let E = b.y - I / 2;
  E < o.priceY0 && (E = o.priceY0), E + I > o.priceY1 && (E = o.priceY1 - I), i.fillStyle = t.panelBgSolid, i.strokeStyle = b.m.kind === "entry" ? t.markerEntry : t.markerExit, i.lineWidth = 1, i.fillRect(T, E, k, I), i.strokeRect(T + 0.5, E + 0.5, k - 1, I - 1);
  for (let R = 0; R < d.length; R++) {
    const D = d[R];
    i.fillStyle = R === 0 ? b.m.kind === "entry" ? t.markerEntry : t.markerExit : t.text, i.fillText(D, T + g, E + g + R * z);
  }
  i.restore();
}
function yl(i, t, e, n, l) {
  if (e.length < 2) return;
  const a = e[1].start - e[0].start, o = xl(a);
  if (!o) return;
  i.save(), i.font = Xe, i.textBaseline = "top", i.textAlign = "right";
  const s = 6, c = 3, r = i.measureText(o).width, u = n - Ze - s, m = l - rn + 4;
  i.fillStyle = t.accent, i.fillRect(u - r - s, m - c, r + s * 2, 14 + c * 2), i.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, i.fillText(o, u, m), i.restore();
}
function xl(i) {
  if (i <= 0 || !isFinite(i)) return "";
  const t = 1e3, e = 60 * t, n = 60 * e, l = 24 * n, a = 7 * l;
  return i >= a && i % a === 0 ? i / a + "W" : i >= l && i % l === 0 ? i / l + "D" : i >= n && i % n === 0 ? i / n + "h" : i >= e && i % e === 0 ? i / e + "m" : i >= t && i % t === 0 ? i / t + "s" : Math.round(i / e) + "m";
}
function bl(i, t, e, n, l, a, o, s) {
  if (!n.length) return;
  const c = n.length > 1 ? n[1].start - n[0].start : 6e4, r = Math.max(1, c * 0.5), u = Math.min(n.length, l.firstIdx + l.count), m = (p) => {
    let b = 0, x = n.length - 1;
    for (; b <= x; ) {
      const d = b + x >> 1, g = n[d].start - p;
      if (Math.abs(g) <= r) return d;
      g < 0 ? b = d + 1 : x = d - 1;
    }
    return -1;
  }, v = 7;
  for (const p of e) {
    const b = m(p.timestamp);
    if (b < 0 || b < l.firstIdx || b >= u) continue;
    const x = Qe(b, l.firstIdx, s), d = _e(p.price, a, o.priceY0, o.priceY1);
    if (d < o.priceY0 || d > o.priceY1) continue;
    const g = p.color ?? (p.kind === "entry" ? t.markerEntry : t.markerExit);
    i.fillStyle = g, i.strokeStyle = t.panelBgSolid, i.lineWidth = 1, i.beginPath(), p.kind === "entry" ? (i.moveTo(x, d - v), i.lineTo(x - v, d + v - 1), i.lineTo(x + v, d + v - 1)) : (i.moveTo(x, d + v), i.lineTo(x - v, d - v + 1), i.lineTo(x + v, d - v + 1)), i.closePath(), i.fill(), i.stroke();
  }
}
function Ml(i, t, e, n, l, a = !1) {
  const o = e.max - e.min;
  if (o <= 0) return;
  const s = n.priceY1 - n.priceY0, c = a ? Math.max(2, Math.min(4, Math.round(s / 36))) : 6, r = hl(o, c), u = Math.ceil(e.min / r) * r, m = a ? cn : Ze;
  i.font = a ? ol : Xe, i.fillStyle = t.text, i.strokeStyle = t.gridline, i.textBaseline = "middle", i.textAlign = "left", i.lineWidth = 1, i.globalAlpha = 0.7;
  for (let v = u; v <= e.max; v += r) {
    const p = _e(v, e, n.priceY0, n.priceY1);
    p < n.priceY0 || p > n.priceY1 || (i.beginPath(), i.moveTo(Fe, Math.round(p) + 0.5), i.lineTo(l - m, Math.round(p) + 0.5), i.stroke(), i.fillText(qe(v), l - m + 3, p));
  }
  i.globalAlpha = 1;
}
function Sl(i, t, e, n, l, a) {
  if (n.count <= 0 || !e.length) return;
  const s = Math.max(1, Math.floor(n.count / 6));
  i.font = Xe, i.fillStyle = t.text, i.textBaseline = "top", i.textAlign = "center", i.globalAlpha = 0.7;
  const c = Math.min(e.length, n.firstIdx + n.count);
  for (let r = n.firstIdx; r < c; r += s) {
    const u = e[r];
    if (!u) continue;
    const m = Qe(r, n.firstIdx, l);
    i.fillText(un(u.start), m, a - rn + 4);
  }
  i.globalAlpha = 1;
}
function Tl(i, t, e, n, l, a, o, s, c) {
  const r = Math.floor((s.x - Fe) / o), u = Math.max(0, Math.min(e.length - 1, n.firstIdx + r)), m = e[u];
  if (!m) return;
  const v = Qe(u, n.firstIdx, o);
  i.save(), i.strokeStyle = t.accent, i.lineWidth = 1, i.setLineDash([3, 3]), i.globalAlpha = 0.6, i.beginPath(), i.moveTo(Math.round(v) + 0.5, a.priceY0), i.lineTo(Math.round(v) + 0.5, a.volumeY1 || a.priceY1), i.stroke();
  const p = Math.max(a.priceY0, Math.min(a.priceY1, s.y));
  i.beginPath(), i.moveTo(Fe, Math.round(p) + 0.5), i.lineTo(c - Ze, Math.round(p) + 0.5), i.stroke(), i.setLineDash([]), i.globalAlpha = 1;
  const b = l.max - l.min;
  if (b > 0) {
    const g = l.max - (p - a.priceY0) / (a.priceY1 - a.priceY0) * b, z = qe(g);
    i.font = Xe, i.textBaseline = "middle", i.textAlign = "left";
    const A = i.measureText(z).width, k = 4, I = 2;
    i.fillStyle = t.accent, i.fillRect(c - Ze + 2, p - 7 - I, A + k * 2, 14 + I * 2), i.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, i.fillText(z, c - Ze + 2 + k, p);
  }
  i.font = Xe, i.textBaseline = "top", i.textAlign = "center";
  const x = un(m.start), d = i.measureText(x).width;
  i.fillStyle = t.accent, i.fillRect(v - d / 2 - 4, a.volumeY1 + 2, d + 8, 14), i.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, i.fillText(x, v, a.volumeY1 + 4), i.restore();
}
const Kt = 0.25, jt = 6, xn = 8;
function Gn(i) {
  const t = on();
  return t.run(() => {
    const e = X(0), n = X(0), l = X(0), a = X(1), o = X(null), s = se(() => Math.max(1, i.slotW() * a.value));
    ne(
      [i.theme, i.slotW, i.showVolume, i.volumeFraction, () => {
        var R;
        return (R = i.compact) == null ? void 0 : R.call(i);
      }, () => i.candles(), () => {
        var R;
        return (R = i.overlays) == null ? void 0 : R.call(i);
      }, () => {
        var R;
        return (R = i.markers) == null ? void 0 : R.call(i);
      }],
      () => i.host.redraw(),
      { deep: !1 }
    ), ne(() => {
      var R;
      return (R = i.colors) == null ? void 0 : R.call(i);
    }, () => i.host.redraw(), { deep: !0 }), ne(l, () => i.host.redraw()), ne(a, () => i.host.redraw()), ne(o, () => i.host.redraw()), ne(s, () => i.host.redraw());
    function c(R, D) {
      e.value = R, n.value = D;
    }
    function r(R) {
      var W;
      const D = s.value;
      if (D <= 0) return 0;
      const G = ((W = i.candles()) == null ? void 0 : W.length) ?? 0, _ = Math.max(1, Math.floor((e.value || 1) / D)), L = Math.max(0, G - _);
      return Math.max(0, Math.min(R, L * D));
    }
    function u(R, D, G, _) {
      if (R !== 0 || G && D !== 0) {
        const j = R !== 0 ? R : D;
        l.value = r(l.value + j);
        return;
      }
      if (D === 0) return;
      const L = i.candles(), W = s.value, N = Math.exp(-D * 15e-4);
      if (_ >= 0 && W > 0 && (L != null && L.length)) {
        const j = Math.max(1, Math.floor((e.value || 1) / W)), ie = Math.max(0, L.length - j - Math.floor(l.value / W)) + (_ - xn) / W, oe = Math.max(Kt, Math.min(jt, a.value * N));
        a.value = oe;
        const q = i.slotW() * oe, h = Math.max(1, Math.floor((e.value || 1) / q)), w = ie - (_ - xn) / q, y = Math.max(0, L.length - h - w);
        l.value = r(y * q);
      } else
        a.value = Math.max(Kt, Math.min(jt, a.value * N));
    }
    let m = !1, v = 0, p = 0;
    function b(R) {
      m = !0, v = R, p = l.value, o.value = null;
    }
    function x(R) {
      return m ? (l.value = r(p + (R - v)), !0) : !1;
    }
    function d() {
      m = !1;
    }
    const g = () => m;
    function z(R, D) {
      m || (o.value = R < 0 || D < 0 ? null : { x: R, y: D });
    }
    function A() {
      o.value = null;
    }
    function k(R) {
      a.value = Math.max(Kt, Math.min(jt, a.value * Math.exp(R * 0.18))), l.value = r(l.value);
    }
    function I(R) {
      const D = s.value, G = R.shiftKey ? 20 : 3;
      switch (R.key) {
        case "ArrowLeft":
          R.preventDefault(), l.value = r(l.value + D * G);
          break;
        case "ArrowRight":
          R.preventDefault(), l.value = r(l.value - D * G);
          break;
        case "ArrowUp":
          R.preventDefault(), k(1);
          break;
        case "ArrowDown":
          R.preventDefault(), k(-1);
          break;
        case "Home":
          R.preventDefault(), l.value = r(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          R.preventDefault(), l.value = 0;
          break;
      }
    }
    function T(R, { dpr: D, glow: G }) {
      var _, L, W, N;
      Xn(R, {
        candles: i.candles(),
        slotW: s.value,
        scrollX: l.value,
        theme: i.theme(),
        glow: G,
        showVolume: i.showVolume(),
        volumeFraction: i.volumeFraction(),
        hover: o.value,
        overlays: (_ = i.overlays) == null ? void 0 : _.call(i),
        markers: (L = i.markers) == null ? void 0 : L.call(i),
        compact: (W = i.compact) == null ? void 0 : W.call(i),
        colors: (N = i.colors) == null ? void 0 : N.call(i),
        dpr: D
      });
    }
    function E() {
      t.stop();
    }
    return {
      canvasW: e,
      canvasH: n,
      scrollX: l,
      zoomLevel: a,
      hover: o,
      effectiveSlotW: s,
      setViewport: c,
      clampScroll: r,
      wheel: u,
      panStart: b,
      panMove: x,
      panEnd: d,
      panning: g,
      hoverAt: z,
      leave: A,
      keyDown: I,
      applyZoom: k,
      paint: T,
      dispose: E
    };
  });
}
const Cl = /* @__PURE__ */ Ne({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Un },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(i) {
    const t = i, e = X(null), n = X(null), l = { ...Te }, a = Gn({
      candles: () => t.candles,
      theme: () => t.theme,
      slotW: () => t.slotW,
      showVolume: () => t.showVolume,
      volumeFraction: () => t.volumeFraction,
      overlays: () => t.overlays,
      markers: () => t.markers,
      compact: () => t.compact,
      colors: () => t.colors,
      host: { redraw: () => x() }
    });
    let o = null, s = !1;
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
    let r, u, m = 1;
    const v = new Je({
      paint: (h, { dpr: w, glow: y }) => a.paint(h, { dpr: w, glow: y })
    });
    function p() {
      if (!(!n.value || !e.value)) {
        if (t.flat) {
          s = !0, b();
          return;
        }
        try {
          o = new P.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          s = !0;
        }
        if (!s && !o.getContext() && (o.dispose(), o = null, s = !0), s) {
          b();
          return;
        }
        o.setPixelRatio(1), o.setClearColor(0, 0), r = new P.Scene(), u = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), r.add(new P.Mesh(new P.PlaneGeometry(2, 2), v.material)), b();
      }
    }
    function b() {
      if (!e.value || !o && !s) return;
      const h = e.value.clientWidth, w = e.value.clientHeight;
      !h || !w || v.resize(h, w) && (v.setScreenSize(h, w), m = v.dpr, a.setViewport(h, w), o ? (o.setPixelRatio(m), o.setSize(h, w)) : n.value && (n.value.width = Math.round(h * m), n.value.height = Math.round(w * m), n.value.style.width = h + "px", n.value.style.height = w + "px"), x());
    }
    function x() {
      if (!v.canvas.width) return;
      if (s) {
        if (!n.value) return;
        v.paintOnly(!1);
        const w = n.value.getContext("2d");
        w && (w.clearRect(0, 0, n.value.width, n.value.height), w.drawImage(v.canvas, 0, 0));
        return;
      }
      if (!o) return;
      const h = t.theme === "paper";
      v.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !h,
        vignette: !h,
        magnify: t.magnify
      }), v.setLens(t.magnify ? l : null), v.syncUniforms(), v.paint(t.glow), o.render(r, u);
    }
    ne(() => t.curvature, () => x()), ne(() => t.scanlines, () => x()), ne(() => t.glow, () => x()), ne(() => t.magnify, (h) => {
      h || (l.x = Te.x, l.y = Te.y), x();
    }), ne(() => t.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    });
    let d = null, g = null, z = 0;
    const A = bt("cathodeResetTick", X(0));
    ne(A, () => k());
    function k() {
      cancelAnimationFrame(z), z = requestAnimationFrame(b);
    }
    function I(h) {
      h.preventDefault();
    }
    function T() {
      o == null || o.dispose(), o = null, s = !1, p();
    }
    function E(h) {
      if (!n.value) return [-1, -1];
      const w = n.value.getBoundingClientRect();
      return [h.clientX - w.left, h.clientY - w.top];
    }
    function R(h) {
      const [w] = E(h);
      a.wheel(h.deltaX, h.deltaY, h.shiftKey, w);
    }
    function D(h) {
      h.button === 0 && (a.panStart(h.clientX), e.value && e.value.focus());
    }
    function G(h) {
      a.keyDown(h);
    }
    function _(h) {
      a.panMove(h.clientX);
    }
    function L() {
      a.panEnd();
    }
    function W(h) {
      h.touches.length === 1 && a.panStart(h.touches[0].clientX);
    }
    function N(h) {
      !a.panning() || h.touches.length !== 1 || (h.preventDefault(), a.panMove(h.touches[0].clientX));
    }
    function j() {
      a.panEnd();
    }
    function ee(h) {
      if (t.magnify && n.value) {
        const M = Mt(h, n.value);
        l.x = M.x, l.y = M.y, x();
      }
      const [w, y] = E(h);
      a.hoverAt(w, y);
    }
    function ie() {
      a.leave(), l.x = Te.x, l.y = Te.y, x();
    }
    Ye(() => {
      document.addEventListener("mousemove", _), document.addEventListener("mouseup", L), Ae(() => {
        var h;
        p(), n.value && (n.value.addEventListener("webglcontextlost", I), n.value.addEventListener("webglcontextrestored", T)), e.value && (d = new ResizeObserver(() => b()), d.observe(e.value), g = new IntersectionObserver((w) => {
          w.some((y) => y.isIntersecting) && k();
        }), g.observe(e.value)), window.addEventListener("resize", k), (h = window.visualViewport) == null || h.addEventListener("resize", k);
      });
    }), Ge(() => {
      var h, w, y;
      document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", L), (h = n.value) == null || h.removeEventListener("webglcontextlost", I), (w = n.value) == null || w.removeEventListener("webglcontextrestored", T), d == null || d.disconnect(), g == null || g.disconnect(), window.removeEventListener("resize", k), (y = window.visualViewport) == null || y.removeEventListener("resize", k), cancelAnimationFrame(z), c(), a.dispose(), v.dispose();
    });
    const oe = se(() => mt[t.theme] ?? mt.none), q = se(() => ({
      background: oe.value.bg
    }));
    return (h, w) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: $e(q.value),
      tabindex: "0",
      onKeydown: G
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: it(R, ["prevent"]),
        onMousedown: D,
        onMousemove: ee,
        onMouseleave: ie,
        onTouchstartPassive: W,
        onTouchmove: N,
        onTouchend: j,
        onTouchcancel: j
      }, null, 544)
    ], 36));
  }
}), uo = /* @__PURE__ */ Ke(Cl, [["__scopeId", "data-v-f2099684"]]), ut = 22, wt = 6, kl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ll = /* @__PURE__ */ Ne({
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
  setup(i, { emit: t }) {
    const e = i, n = t, l = X(null), a = X(null), o = X(-1), s = X(0), c = { ...Te };
    let r = Math.min(typeof window < "u" && window.devicePixelRatio || 1, 2), u = null, m = !1;
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
    let p, b, x, d, g;
    const z = X(0), A = X(0), k = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Fn}

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

  ${Bn}

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

    ${Wn}

    gl_FragColor = color;
  }
`;
    function I() {
      if (!(!a.value || !l.value)) {
        g = document.createElement("canvas");
        try {
          u = new P.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0, preserveDrawingBuffer: !0 });
        } catch {
          m = !0;
        }
        if (!m && !u.getContext() && (u.dispose(), u = null, m = !0), m) {
          T();
          return;
        }
        u.setPixelRatio(r), u.setClearColor(0, 0), p = new P.Scene(), b = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), d = new P.CanvasTexture(g), d.minFilter = P.LinearFilter, d.magFilter = P.LinearFilter, x = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: d },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Hn()
          },
          vertexShader: kl,
          fragmentShader: k,
          transparent: !0
        }), p.add(new P.Mesh(new P.PlaneGeometry(2, 2), x)), T();
      }
    }
    function T() {
      if (!l.value || !u && !m) return;
      const h = l.value.clientWidth, w = l.value.clientHeight;
      if (!h || !w) return;
      z.value = h, A.value = w, r = Math.min(window.devicePixelRatio || 1, 2);
      const y = e.bendField ? Math.round(h * zn(e.curvature)) : h, M = Math.round(y * r), O = Math.round(w * r), $ = g.width !== M || g.height !== O;
      g.width = M, g.height = O, u ? ($ && d && (d.dispose(), d = new P.CanvasTexture(g), d.minFilter = P.LinearFilter, d.magFilter = P.LinearFilter, x.uniforms.uTex.value = d), u.setPixelRatio(r), u.setSize(h, w)) : a.value && (a.value.width = Math.round(h * r), a.value.height = Math.round(w * r), a.value.style.width = h + "px", a.value.style.height = w + "px"), L();
    }
    function E() {
      const h = (g == null ? void 0 : g.width) || 0, w = Math.max(1, Math.floor(h / e.minCellW)), y = Math.floor(h / w), M = Math.round(y * e.cellAspect), O = ut + M + wt;
      return { rects: e.cells.map((U, J) => ({
        x: J % w * y,
        y: Math.floor(J / w) * O - s.value,
        w: y,
        h: O
      })), rowH: O, totalH: Math.ceil(e.cells.length / w) * O, cols: w };
    }
    const R = () => {
      const { totalH: h } = E();
      return Math.max(0, h - ((g == null ? void 0 : g.height) || 0));
    }, D = /* @__PURE__ */ new Map();
    function G(h, w, y) {
      const M = h.candles[h.candles.length - 1], O = `${w}x${y}@${r}|${h.candles.length}|${M ? M.start + ":" + M.close : 0}|${e.theme}|${e.glow}|${e.showVolume}|${e.slotW}`, $ = D.get(h.id);
      if ($ && $.key === O) return $.canvas;
      const U = ($ == null ? void 0 : $.canvas) ?? document.createElement("canvas");
      U.width = Math.round(w * r), U.height = Math.round(y * r);
      const J = Math.max(1.5, Math.min(e.slotW, w / Math.max(1, h.candles.length))), ue = w < 260 && h.overlays ? h.overlays.map((me) => ({ ...me, label: "" })) : h.overlays;
      return Xn(U, {
        candles: h.candles,
        slotW: J,
        scrollX: Math.max(0, h.candles.length * J - w),
        theme: e.theme,
        glow: e.glow,
        showVolume: e.showVolume,
        volumeFraction: e.volumeFraction,
        hover: null,
        overlays: ue,
        compact: !0,
        colors: e.colors,
        dpr: r
      }), D.set(h.id, { canvas: U, key: O }), U;
    }
    const _ = se(() => ({ ...mt[e.theme] ?? mt.none, ...e.colors ?? {} }));
    function L() {
      var M;
      if (!(g != null && g.width)) return;
      const h = g.getContext("2d");
      if (!h) return;
      const w = _.value;
      h.setTransform(1, 0, 0, 1, 0, 0), h.clearRect(0, 0, g.width, g.height), w.bg && w.bg !== "rgba(0,0,0,0)" && (h.fillStyle = w.bg, h.fillRect(0, 0, g.width, g.height)), h.setTransform(r, 0, 0, r, 0, 0);
      const { rects: y } = E();
      h.font = "600 11px ui-monospace, SFMono-Regular, monospace", h.textBaseline = "middle";
      for (let O = 0; O < e.cells.length; O++) {
        const $ = e.cells[O], U = y[O];
        if (U.y + U.h < 0 || U.y > g.height / r) continue;
        const J = U.x + wt / 2, ue = U.w - wt;
        h.strokeStyle = $.open ? w.candleBull : w.gridline, h.lineWidth = O === o.value ? 2 : 1, h.strokeRect(J + 0.5, U.y + 0.5, ue - 1, U.h - wt - 1), h.save(), h.beginPath(), h.rect(J, U.y, ue, ut), h.clip();
        const me = U.y + ut / 2 + 1, Ce = $.note ? h.measureText($.note).width + ($.open ? 22 : 12) : $.open ? 16 : 0, F = $.badge ? h.measureText($.badge).width + 6 : 0, te = ue - 14 - F - Ce;
        let Q = $.title;
        if (h.measureText(Q).width > te) {
          for (; Q.length > 1 && h.measureText(Q + "…").width > te; ) Q = Q.slice(0, -1);
          Q += "…";
        }
        let re = J + 7;
        h.fillStyle = w.text, h.textAlign = "left", h.fillText(Q, re, me), re += h.measureText(Q).width + 6, $.badge && (h.fillStyle = w.accent, h.fillText($.badge, re, me)), $.note && (h.textAlign = "right", h.fillStyle = $.noteColor || w.accent, h.fillText($.note, J + ue - ($.open ? 16 : 7), me), h.textAlign = "left"), h.restore(), $.open && (h.fillStyle = w.candleBull, h.beginPath(), h.arc(J + ue - 9, U.y + ut / 2 + 1, 3, 0, Math.PI * 2), h.fill());
        const de = U.y + ut, pe = U.h - ut - wt;
        $.candles.length ? h.drawImage(G($, ue - 2, pe - 1), J + 1, de, ue - 2, pe - 1) : (h.fillStyle = w.accent, h.textAlign = "center", h.fillText("· · ·", J + ue / 2, de + pe / 2), h.textAlign = "left");
      }
      if (m) {
        const O = (M = a.value) == null ? void 0 : M.getContext("2d");
        O && a.value && O.drawImage(g, 0, 0, g.width, g.height, 0, 0, a.value.width, a.value.height);
        return;
      }
      !u || !x || !d || (x.uniforms.uStrength.value = st(e.curvature), x.uniforms.uScanlines.value = e.scanlines && e.theme !== "paper" ? 1 : 0, x.uniforms.uVignette.value = e.theme === "paper" ? 0 : 1, Yn(x, e.magnify, c, z.value || g.width, A.value || g.height), d.needsUpdate = !0, u.render(p, b));
    }
    function W(h) {
      if (!a.value) return [-1, -1];
      const w = a.value.getBoundingClientRect();
      return An(
        h.clientX - w.left,
        h.clientY - w.top,
        w.width,
        w.height,
        st(e.curvature),
        // texture dims in LOGICAL px (offCanvas backing store is now × dpr) so results match the layout rects
        ((g == null ? void 0 : g.width) || w.width) / r,
        ((g == null ? void 0 : g.height) || w.height) / r
      );
    }
    function N(h, w) {
      if (h < 0) return -1;
      const { rects: y } = E();
      return y.findIndex((M) => h >= M.x && h < M.x + M.w && w >= M.y && w < M.y + M.h);
    }
    function j(h) {
      const [w, y] = W(h), M = N(w, y);
      M >= 0 && n("cell-click", e.cells[M].id);
    }
    function ee(h) {
      if (e.magnify && a.value) {
        const O = Mt(h, a.value);
        c.x = O.x, c.y = O.y;
      }
      const [w, y] = W(h), M = N(w, y);
      M !== o.value ? (o.value = M, L()) : e.magnify && L(), a.value && (a.value.style.cursor = M >= 0 ? "pointer" : "default");
    }
    function ie() {
      o.value = -1, c.x = Te.x, c.y = Te.y, L();
    }
    function oe(h) {
      const w = R();
      w <= 0 || (h.preventDefault(), s.value = Math.max(0, Math.min(w, s.value + h.deltaY)), L());
    }
    let q = null;
    return Ye(() => {
      I(), q = new ResizeObserver(() => T()), l.value && q.observe(l.value);
    }), Ge(() => {
      q == null || q.disconnect(), v(), D.clear();
    }), ne(() => [e.curvature, e.bendField], () => Ae(T)), ne(() => [e.cells, e.theme, e.glow, e.scanlines, e.showVolume, e.magnify], () => {
      s.value = Math.min(s.value, R()), L();
    }, { deep: !1 }), (h, w) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-candle-grid-wrap"
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: a,
        onClick: j,
        onMousemove: ee,
        onMouseleave: ie,
        onWheel: oe
      }, null, 544)
    ], 512));
  }
}), ho = /* @__PURE__ */ Ke(Ll, [["__scopeId", "data-v-9f2b24f8"]]), hn = X(0), nn = 28, ht = 12;
let ln = 10, Ft = "cathode.layout", Bt = !1;
const Le = X({});
function Rl(i, t = "cathode.layout") {
  if (!Bt) {
    Bt = !0, Ft = t;
    try {
      const e = localStorage.getItem(Ft);
      if (e) {
        Le.value = JSON.parse(e), bn();
        return;
      }
    } catch {
    }
    Le.value = { ...i }, bn();
  }
}
function bn() {
  let i = 10;
  for (const t of Object.values(Le.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > i && (i = t.zIndex);
  ln = i;
}
function rt() {
  localStorage.setItem(Ft, JSON.stringify(Le.value));
}
function Dl(i) {
  Bt = !1, localStorage.removeItem(Ft), Le.value = { ...i }, rt(), Bt = !0, hn.value++;
}
function Kn(i) {
  ln++, Le.value[i] && (Le.value[i].zIndex = ln);
}
function Il(i, t) {
  Le.value[i].visible = t, rt();
}
function El(i, t) {
  Le.value[i].minimized = t, t && (Le.value[i].maximized = !1), rt();
}
function Pl(i, t) {
  Le.value[i].maximized = t, t && (Le.value[i].minimized = !1, Kn(i)), rt();
}
function Al(i, t, e) {
  Le.value[i].x = Math.round(t), Le.value[i].y = Math.round(e), rt();
}
function zl(i, t, e) {
  Le.value[i].w = Math.round(t), Le.value[i].h = Math.round(e), rt();
}
function fo(i, t, e) {
  const n = Math.ceil(Math.sqrt(e.length)), l = Math.ceil(e.length / n), a = Math.floor((i - ht * (n + 1)) / n), o = Math.floor((t - ht * (l + 1)) / l), s = {};
  return e.forEach((c, r) => {
    const u = r % n, m = Math.floor(r / n);
    s[c] = {
      x: ht + u * (a + ht),
      y: ht + m * (o + ht),
      w: a,
      h: o,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: r + 1
    };
  }), s;
}
function jn() {
  return {
    containers: Le,
    TITLEBAR_H: nn,
    load: Rl,
    save: rt,
    reset: Dl,
    bringToFront: Kn,
    setVisible: Il,
    setMinimized: El,
    setMaximized: Pl,
    updatePos: Al,
    updateSize: zl
  };
}
const _l = { class: "ws-toolbar" }, Fl = {
  key: 0,
  class: "ws-restore-menu"
}, Bl = {
  key: 0,
  class: "ws-restore-empty"
}, Wl = ["onClick"], Hl = /* @__PURE__ */ Ne({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(i) {
    const t = i, { containers: e, load: n, reset: l, setVisible: a } = jn(), o = X(null);
    gn("cathodeWorkspace", o), gn("cathodeResetTick", hn), Ye(() => {
      if (!o.value) return;
      const { clientWidth: d, clientHeight: g } = o.value, z = t.initialLayout ?? {};
      n(z, t.storageKey ?? "cathode.layout");
      const A = Object.keys(e.value)[0];
      A && s(A);
    });
    function s(d) {
      var z;
      document.querySelectorAll(".cc").forEach((A) => A.classList.remove("cc-focused"));
      const g = (z = o.value) == null ? void 0 : z.querySelector(`#cc-${d}`);
      g && g.classList.add("cc-focused");
    }
    function c() {
      !o.value || !t.initialLayout || l(t.initialLayout);
    }
    function r(d) {
      const g = d.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((z) => z.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const u = X(!1), m = () => Object.entries(e.value).filter(([, d]) => !d.visible).map(([d]) => d);
    function v(d) {
      a(d, !0), u.value = !1;
    }
    function p(d) {
      if (!u.value) return;
      const g = d.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (u.value = !1);
    }
    function b(d) {
      d.key === "Escape" && (u.value = !1);
    }
    Ye(() => {
      document.addEventListener("click", p), document.addEventListener("keydown", b);
    }), Ge(() => {
      document.removeEventListener("click", p), document.removeEventListener("keydown", b);
    });
    function x(d) {
      var g;
      return ((g = t.containerTitles) == null ? void 0 : g[d]) ?? d;
    }
    return (d, g) => (xe(), be("div", {
      ref_key: "workspaceEl",
      ref: o,
      class: "cathode-workspace",
      onMousedown: r
    }, [
      Jt(d.$slots, "default", {}, void 0, !0),
      Jt(d.$slots, "overlay", {}, void 0, !0),
      he("div", _l, [
        i.initialLayout ? (xe(), be("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : Ue("", !0),
        g[1] || (g[1] = he("div", { class: "ws-sep" }, null, -1)),
        he("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (z) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Ln(wi, { name: "menu" }, {
        default: yi(() => [
          u.value ? (xe(), be("div", Fl, [
            g[3] || (g[3] = he("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? Ue("", !0) : (xe(), be("div", Bl, " No closed panels ")),
            (xe(!0), be(xi, null, bi(m(), (z) => (xe(), be("div", {
              key: z,
              class: "ws-restore-item",
              onClick: (A) => v(z)
            }, [
              g[2] || (g[2] = he("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Mi(" " + He(x(z)), 1)
            ], 8, Wl))), 128))
          ])) : Ue("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), vo = /* @__PURE__ */ Ke(Hl, [["__scopeId", "data-v-5838d04b"]]), Yl = ["id"], Vl = { class: "cc-title" }, Ol = {
  key: 0,
  class: "cc-size-badge"
}, $l = { class: "cc-controls" }, Ul = ["title"], Xl = { class: "cc-body" }, Nl = 200, Gl = 80, Mn = 60, Kl = /* @__PURE__ */ Ne({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(i) {
    const t = i, { containers: e, bringToFront: n, setVisible: l, setMinimized: a, setMaximized: o, updatePos: s, updateSize: c } = jn(), r = bt("cathodeWorkspace", X(null)), u = se(() => e.value[t.id]), m = se(() => {
      const h = u.value, w = t.curvature ?? 0;
      if (!h) return {};
      const y = { "--curvature": Math.abs(w) };
      return h.maximized ? { ...y, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: h.zIndex } : {
        ...y,
        left: h.x + "px",
        top: h.y + "px",
        width: h.w + "px",
        height: h.minimized ? nn + "px" : h.h + "px",
        zIndex: h.zIndex,
        display: h.visible ? "flex" : "none"
      };
    });
    let v = !1, p = 0, b = 0;
    function x(h) {
      var M;
      if (h.target.closest(".cc-btn") || u.value.maximized) return;
      n(t.id), v = !0;
      const w = (M = r.value) == null ? void 0 : M.querySelector(`#cc-${t.id}`);
      if (!w) return;
      const y = w.getBoundingClientRect();
      p = h.clientX - y.left, b = h.clientY - y.top, document.addEventListener("mousemove", d), document.addEventListener("mouseup", g), h.preventDefault();
    }
    function d(h) {
      var $;
      if (!v || !r.value) return;
      const w = r.value.getBoundingClientRect(), y = (($ = u.value) == null ? void 0 : $.w) ?? 300;
      let M = h.clientX - w.left - p, O = h.clientY - w.top - b;
      M = Math.max(Mn - y, Math.min(w.width - Mn, M)), O = Math.max(0, Math.min(w.height - nn, O)), s(t.id, M, O);
    }
    function g() {
      v = !1, document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", g);
    }
    let z = !1, A = 0, k = 0, I = 0, T = 0;
    const E = X("");
    function R(h) {
      u.value.maximized || (n(t.id), z = !0, A = h.clientX, k = h.clientY, I = u.value.w, T = u.value.h, document.addEventListener("mousemove", D), document.addEventListener("mouseup", G), h.preventDefault(), h.stopPropagation());
    }
    function D(h) {
      if (!z) return;
      const w = Math.max(Nl, I + (h.clientX - A)), y = Math.max(Gl, T + (h.clientY - k));
      c(t.id, w, y), E.value = `${Math.round(w)}×${Math.round(y)}`;
    }
    function G() {
      z = !1, E.value = "", document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", G), _.value++;
    }
    const _ = X(0);
    ne(hn, () => {
      _.value++;
    }), Ge(() => {
      var h;
      document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", D), document.removeEventListener("mouseup", G), (h = L.value) == null || h.removeEventListener("scroll", N), j();
    });
    const L = X(null);
    function W(h) {
      if (t.canvas) return [];
      const w = h.children[0];
      return w ? Array.from(w.children) : [];
    }
    function N() {
      const h = L.value, w = t.curvature ?? 0;
      if (!h) return;
      const y = W(h);
      if (!y.length) return;
      const M = h.clientHeight, O = M / 2, $ = w * 38e-4;
      y.forEach((U) => {
        if (!U.dataset.origFs) {
          const de = getComputedStyle(U);
          U.dataset.origFs = de.fontSize, U.dataset.origLh = de.lineHeight;
        }
        if (w === 0) {
          U.style.fontSize = "", U.style.lineHeight = "";
          return;
        }
        const J = U.getBoundingClientRect(), ue = h.getBoundingClientRect(), me = J.top - ue.top + J.height / 2, Ce = Math.min(1, Math.abs(me - O) / (M / 2)), F = 1 + $ * Math.cos(Ce * Math.PI / 2), te = parseFloat(U.dataset.origFs), Q = U.dataset.origLh, re = Q === "normal" ? te * 1.4 : parseFloat(Q);
        isNaN(te) || (U.style.fontSize = `${(te * F).toFixed(2)}px`), isNaN(re) || (U.style.lineHeight = `${(re * F).toFixed(2)}px`);
      });
    }
    function j() {
      const h = L.value;
      h && W(h).forEach((w) => {
        w.style.fontSize = "", w.style.lineHeight = "", delete w.dataset.origFs, delete w.dataset.origLh;
      });
    }
    ne(() => t.curvature, (h) => {
      (h ?? 0) === 0 ? j() : N();
    }), Ye(() => {
      var h;
      (h = L.value) == null || h.addEventListener("scroll", N, { passive: !0 }), Ae(N);
    });
    function ee() {
      a(t.id, !u.value.minimized), Ae(() => {
        _.value++;
      });
    }
    function ie() {
      o(t.id, !u.value.maximized), Ae(() => {
        _.value++;
      });
    }
    function oe() {
      l(t.id, !1);
    }
    function q() {
      n(t.id);
    }
    return (h, w) => u.value && u.value.visible ? (xe(), be("div", {
      key: 0,
      id: `cc-${i.id}`,
      class: Si(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": i.canvas }]),
      style: $e(m.value),
      onMousedown: q
    }, [
      he("div", {
        class: "cc-titlebar",
        onMousedown: x
      }, [
        w[0] || (w[0] = he("span", { class: "cc-status-dot" }, null, -1)),
        he("span", Vl, He(i.title), 1),
        E.value ? (xe(), be("span", Ol, He(E.value), 1)) : Ue("", !0),
        he("div", $l, [
          he("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: it(ee, ["stop"])
          }, "─"),
          he("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: it(ie, ["stop"])
          }, He(u.value.maximized ? "⤡" : "⤢"), 9, Ul),
          he("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: it(oe, ["stop"])
          }, "✕")
        ])
      ], 32),
      Rn(he("div", Xl, [
        he("div", {
          ref_key: "bodyEl",
          ref: L,
          class: "cc-screen",
          onScroll: N
        }, [
          Jt(h.$slots, "default", { resizeKey: _.value }, void 0, !0),
          w[1] || (w[1] = he("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Ti, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (xe(), be("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: it(R, ["stop"])
      }, null, 32)) : Ue("", !0)
    ], 46, Yl)) : Ue("", !0);
  }
}), mo = /* @__PURE__ */ Ke(Kl, [["__scopeId", "data-v-ca0af4ca"]]), jl = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ql = `
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
`, Zl = 100, Ql = /* @__PURE__ */ Ne({
  __name: "CathodeLoader",
  props: {
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    label: { default: "BOOTING" }
  },
  setup(i) {
    const t = i, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, n = X(null), l = X(null);
    let a = null, o = !1;
    function s() {
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
    let c, r, u, m, v, p = null, b = 0;
    function x(T) {
      T - b >= Zl && (z(), b = T), p = requestAnimationFrame(x);
    }
    function d() {
      if (!n.value || !v) return;
      const T = n.value.clientWidth, E = n.value.clientHeight;
      T <= 0 || E <= 0 || v.width === T && v.height === E || (v.width = T, v.height = E, a && a.setSize(T, E, !1), l.value && (l.value.width = T, l.value.height = E, l.value.style.width = T + "px", l.value.style.height = E + "px"));
    }
    function g() {
      if (!(v != null && v.width)) return;
      const T = v.getContext("2d");
      if (!T) return;
      const E = v.width, R = v.height, D = e[t.theme] ?? e.none;
      T.clearRect(0, 0, E, R), T.fillStyle = D.bg, T.fillRect(0, 0, E, R);
      const G = Date.now(), _ = (G / 500 | 0) % 2 === 0, L = (G / 400 | 0) % 4;
      T.font = `bold ${Math.max(14, Math.min(E, R) * 0.06)}px monospace`, T.textAlign = "center", T.textBaseline = "middle", T.fillStyle = D.text, t.glow && (T.shadowColor = D.text, T.shadowBlur = 14);
      const W = ".".repeat(L).padEnd(3, " "), N = `${t.label}${W}`;
      if (T.fillText(N, E / 2, R / 2), T.shadowBlur = 0, _) {
        const j = T.measureText(N), ee = T.measureText("M").width, ie = parseFloat(T.font), oe = E / 2 + j.width / 2 + 4, q = R / 2 - ie / 2 + 2;
        T.fillStyle = D.cursor, t.glow && (T.shadowColor = D.cursor, T.shadowBlur = 12), T.fillRect(oe, q, ee * 0.7, ie * 0.95), T.shadowBlur = 0;
      }
    }
    function z() {
      if (!v) return;
      if (g(), o) {
        if (!l.value) return;
        const E = l.value.getContext("2d");
        E && E.drawImage(v, 0, 0);
        return;
      }
      if (!a || !u || !m) return;
      const T = t.theme === "paper";
      u.uniforms.uStrength.value = st(t.curvature), u.uniforms.uScanlines.value = t.scanlines && !T ? 1 : 0, u.uniforms.uVignette.value = T ? 0 : 1, m.needsUpdate = !0, a.render(c, r);
    }
    function A() {
      if (!(!l.value || !n.value)) {
        v = document.createElement("canvas");
        try {
          a = new P.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          o = !0;
        }
        if (!o && !a.getContext() && (a.dispose(), a = null, o = !0), o) {
          d();
          return;
        }
        a.setPixelRatio(1), a.setClearColor(0, 0), c = new P.Scene(), r = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new P.CanvasTexture(v), m.minFilter = P.LinearFilter, m.magFilter = P.LinearFilter, u = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: jl,
          fragmentShader: ql,
          transparent: !0
        }), c.add(new P.Mesh(new P.PlaneGeometry(2, 2), u)), d();
      }
    }
    let k = null;
    Ye(() => {
      A(), z(), p = requestAnimationFrame(x), n.value && (k = new ResizeObserver(() => d()), k.observe(n.value));
    }), Ge(() => {
      p !== null && cancelAnimationFrame(p), k == null || k.disconnect(), s(), m == null || m.dispose(), u == null || u.dispose();
    }), ne(() => [t.theme, t.curvature, t.scanlines, t.glow, t.label], () => z());
    const I = se(() => ({
      background: (e[t.theme] ?? e.none).bg
    }));
    return (T, E) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-loader-wrap",
      style: $e(I.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), po = /* @__PURE__ */ Ke(Ql, [["__scopeId", "data-v-d00e5f47"]]), Wt = {
  none: { bg: "rgba(0,0,0,0)", text: "#f0f8ff", dim: "#a0b8d0", left: "#ff9a9a", right: "#a0e8c0", neutral: "#a0b8d0", warn: "#ffd890", surface: "rgba(255,255,255,0.05)", border: "#2a3a50" },
  paper: { bg: "rgba(0,0,0,0)", text: "#222222", dim: "#888888", left: "#c0392b", right: "#1a8038", neutral: "#888888", warn: "#a06000", surface: "rgba(0,0,0,0.035)", border: "#dee2e6" },
  phosphor: { bg: "#060d06", text: "#80ff80", dim: "#3fbf3f", left: "#ff8080", right: "#a0ffa0", neutral: "#3fbf3f", warn: "#ffe66d", surface: "rgba(51,255,51,0.05)", border: "#0a250a" },
  amber: { bg: "#0a0700", text: "#ffd060", dim: "#b08020", left: "#ff8a5a", right: "#ffe6a0", neutral: "#b08020", warn: "#ff9f40", surface: "rgba(255,176,0,0.06)", border: "#3a2a00" }
}, Sn = (i, t) => t === "left" ? i.left : t === "right" ? i.right : !t || t === "neutral" ? i.dim : t, ye = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ve = 12;
function qt(i, t, e) {
  const n = [];
  for (const l of t.split(`
`)) {
    let a = "";
    for (const o of l.split(" ")) {
      const s = a ? `${a} ${o}` : o;
      a && i.measureText(s).width > e ? (n.push(a), a = o) : a = s;
    }
    n.push(a);
  }
  return n;
}
function yt(i, t, e, n, l, a) {
  const o = Math.min(a, n / 2, l / 2);
  i.beginPath(), i.moveTo(t + o, e), i.lineTo(t + n - o, e), i.quadraticCurveTo(t + n, e, t + n, e + o), i.lineTo(t + n, e + l - o), i.quadraticCurveTo(t + n, e + l, t + n - o, e + l), i.lineTo(t + o, e + l), i.quadraticCurveTo(t, e + l, t, e + l - o), i.lineTo(t, e + o), i.quadraticCurveTo(t, e, t + o, e), i.closePath();
}
function qn(i, t) {
  var E, R;
  const e = i.getContext("2d");
  if (!e) return 0;
  const n = t.dpr || 1, l = i.width / n, a = i.height / n, o = { ...Wt[t.theme] ?? Wt.none, ...t.colors ?? {} };
  e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, i.width, i.height), e.setTransform(n, 0, 0, n, 0, 0), e.fillStyle = o.bg, e.fillRect(0, 0, l, a);
  const s = (D) => D > 0 ? o.right : D < 0 ? o.left : o.neutral, c = s(t.value), r = (D, G = 10) => {
    t.glow && (e.shadowColor = D, e.shadowBlur = G);
  }, u = () => {
    e.shadowBlur = 0, e.shadowColor = "transparent";
  }, m = Math.max(40, l - ve * 2);
  let v = ve;
  e.textBaseline = "alphabetic", e.textAlign = "left";
  const p = t.readout ?? `${t.value > 0 ? "+" : ""}${t.value}`;
  e.font = `800 34px ${ye}`;
  const b = e.measureText(p).width;
  e.fillStyle = c, r(c, 14), e.fillText(p, ve, v + 30), u();
  const x = ve + b + 14;
  t.stance && (e.font = `700 14px ${ye}`, e.fillStyle = c, r(c, 8), e.fillText(t.stance.toUpperCase(), x, v + 15), u()), t.sub && (e.font = `11px ${ye}`, e.fillStyle = o.dim, e.fillText(t.sub, x, v + 31)), v += 48, e.font = `700 9px ${ye}`;
  const d = t.leftLabel.toUpperCase(), g = t.rightLabel.toUpperCase(), z = e.measureText(d).width, A = e.measureText(g).width, k = ve + z + 8, I = l - ve - A - 8, T = v + 10;
  if (e.fillStyle = o.left, e.fillText(d, ve, T + 3), e.fillStyle = o.right, e.textAlign = "right", e.fillText(g, l - ve, T + 3), e.textAlign = "left", I - k > 24) {
    const D = e.createLinearGradient(k, 0, I, 0);
    D.addColorStop(0, o.left), D.addColorStop(0.45, o.surface), D.addColorStop(0.55, o.surface), D.addColorStop(1, o.right), yt(e, k, T - 4, I - k, 8, 4), e.save(), e.globalAlpha = 0.5, e.fillStyle = D, e.fill(), e.restore(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke();
    const G = (k + I) / 2;
    e.strokeStyle = o.border, e.beginPath(), e.moveTo(G, T - 8), e.lineTo(G, T + 8), e.stroke();
    for (const j of [0.25, 0.75]) {
      const ee = k + j * (I - k);
      e.beginPath(), e.moveTo(ee, T - 5), e.lineTo(ee, T + 5), e.stroke();
    }
    const _ = t.max - t.min || 1, L = Math.max(0, Math.min(1, (t.shown - t.min) / _)), W = k + L * (I - k), N = s(t.shown);
    e.beginPath(), e.moveTo(W, T - 10), e.lineTo(W - 4.5, T - 17), e.lineTo(W + 4.5, T - 17), e.closePath(), e.fillStyle = N, e.fill(), e.beginPath(), e.arc(W, T, 6.5, 0, Math.PI * 2), e.fillStyle = N, r(N, 12), e.fill(), u(), e.strokeStyle = o.bg === "rgba(0,0,0,0)" ? o.border : o.bg, e.lineWidth = 2, e.stroke();
    for (const j of t.marks ?? []) {
      const ee = (j.value - t.min) / _;
      if (ee < 0 || ee > 1) continue;
      const ie = k + ee * (I - k), oe = Sn(o, j.color);
      if (e.save(), e.setLineDash([2, 2]), e.strokeStyle = oe, e.lineWidth = 1, e.beginPath(), e.moveTo(ie, T - 9), e.lineTo(ie, T + 9), e.stroke(), e.restore(), j.label) {
        e.font = `700 8px ${ye}`, e.fillStyle = oe;
        const q = e.measureText(j.label).width;
        e.fillText(j.label, Math.max(k, Math.min(I - q, ie - q / 2)), T + 20);
      }
    }
  }
  if (v += (E = t.marks) != null && E.some((D) => D.label) ? 42 : 30, t.meter) {
    const D = t.meter, G = D.min ?? 0, _ = D.max ?? 1, L = _ - G || 1, W = D.tone === "up" ? o.right : D.tone === "down" ? o.left : D.tone === "warn" ? o.warn : o.neutral;
    D.label && (e.font = `700 9px ${ye}`, e.fillStyle = o.dim, e.fillText(D.label.toUpperCase(), ve, v + 9)), D.hint && (e.font = `9px ${ye}`, e.fillStyle = o.dim, e.textAlign = "right", e.fillText(D.hint, l - ve, v + 9), e.textAlign = "left"), (D.label || D.hint) && (v += 15), e.font = `700 12px ${ye}`;
    const N = D.valueText ?? (D.value == null ? "—" : String(D.value)), j = e.measureText(N).width, ee = ve, ie = l - ve - j - 10, oe = v + 6, q = !!((R = D.thresholds) != null && R.some((h) => h.label));
    if (ie - ee > 24) {
      if (yt(e, ee, oe - 5, ie - ee, 10, 5), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), D.value != null) {
        const h = Math.max(0, Math.min(1, (D.value - G) / L));
        h > 0 && (e.save(), yt(e, ee, oe - 5, ie - ee, 10, 5), e.clip(), e.globalAlpha = 0.7, e.fillStyle = W, r(W, 8), e.fillRect(ee, oe - 5, (ie - ee) * h, 10), e.restore());
      }
      for (const h of D.thresholds ?? []) {
        const w = (h.value - G) / L;
        if (w < 0 || w > 1) continue;
        const y = ee + w * (ie - ee), M = Sn(o, h.color);
        if (e.strokeStyle = M, e.lineWidth = 1, e.beginPath(), e.moveTo(y, oe - 7), e.lineTo(y, oe + 7), e.stroke(), h.label) {
          e.font = `700 7.5px ${ye}`, e.fillStyle = M;
          const O = e.measureText(h.label).width;
          e.fillText(h.label, Math.max(ee, Math.min(ie - O, y - O / 2)), oe + 17);
        }
      }
    }
    e.font = `700 12px ${ye}`, e.fillStyle = W, e.textAlign = "right", r(W, 8), e.fillText(N, l - ve, oe + 4), u(), e.textAlign = "left", v += q ? 32 : 22;
  }
  if (t.caption) {
    e.font = `600 11.5px ${ye}`;
    const D = qt(e, t.caption, m - 18), G = D.length * 15 + 12;
    yt(e, ve, v, m, G, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = t.value < 0 ? o.left : o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = t.value < 0 ? o.left : t.value > 0 ? o.text : o.dim, D.forEach((_, L) => e.fillText(_, ve + 9, v + 17 + L * 15)), v += G + 10;
  }
  if (t.note) {
    e.font = `10px ${ye}`, e.fillStyle = o.dim;
    const D = qt(e, t.note, m);
    D.forEach((G, _) => e.fillText(G, ve, v + 10 + _ * 14)), v += D.length * 14 + 10;
  }
  if (t.items.length) {
    let _ = ve;
    for (const L of t.items) {
      const W = L.side === "left" ? o.left : L.side === "right" ? o.right : o.neutral, N = L.side === "left" ? t.sideLetters[0] : L.side === "right" ? t.sideLetters[1] : "";
      e.font = `700 10px ${ye}`;
      const j = e.measureText(L.label).width;
      e.font = `700 8px ${ye}`;
      const ee = N ? e.measureText(N).width + 6 : 0;
      e.font = `10px ${ye}`;
      const ie = L.value ? e.measureText(L.value).width : 0, oe = 7 + j + (N ? 4 + ee : 0) + (L.value ? 4 + ie : 0) + 7;
      _ + oe > l - ve && _ > ve && (_ = ve, v += 23), yt(e, _, v, oe, 18, 4), e.fillStyle = o.surface, e.fill(), e.strokeStyle = o.border, e.lineWidth = 1, e.stroke(), e.fillStyle = W, e.fillRect(_, v + 1, 2, 16);
      let q = _ + 7;
      e.font = `700 10px ${ye}`, e.fillStyle = o.text, e.fillText(L.label, q, v + 12.5), q += j + 4, N && (e.font = `700 8px ${ye}`, e.fillStyle = W, e.fillText(N, q + 3, v + 12), q += ee + 4), L.value && (e.font = `10px ${ye}`, e.fillStyle = L.tone === "up" ? o.right : L.tone === "down" ? o.left : o.dim, e.fillText(L.value, q, v + 12.5)), _ += oe + 5;
    }
    v += 18;
  } else if (t.emptyText) {
    e.font = `10px ${ye}`, e.fillStyle = o.dim;
    const D = qt(e, t.emptyText, m);
    D.forEach((G, _) => e.fillText(G, ve, v + 10 + _ * 14)), v += D.length * 14;
  }
  return v + ve;
}
const Jl = /* @__PURE__ */ Ne({
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
  setup(i) {
    const t = i, e = X(null), n = X(null), l = () => (t.min + t.max) / 2, a = X(t.animate ? l() : t.value);
    let o = 0;
    function s() {
      if (cancelAnimationFrame(o), !t.animate) {
        a.value = t.value, d();
        return;
      }
      const _ = () => {
        const L = t.value - a.value;
        if (Math.abs(L) < 4e-3) {
          a.value = t.value, d();
          return;
        }
        a.value += L * 0.18, d(), o = requestAnimationFrame(_);
      };
      o = requestAnimationFrame(_);
    }
    ne(() => t.value, s);
    let c = null, r = !1;
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
    const p = new Je({
      paint: (_, { dpr: L, glow: W }) => qn(_, {
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
    function b() {
      if (!(!n.value || !e.value)) {
        try {
          c = new P.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          r = !0;
        }
        if (!r && !c.getContext() && (c.dispose(), c = null, r = !0), r) {
          x();
          return;
        }
        c.setPixelRatio(1), c.setClearColor(0, 0), m = new P.Scene(), v = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), m.add(new P.Mesh(new P.PlaneGeometry(2, 2), p.material)), x();
      }
    }
    function x() {
      if (!e.value || !c && !r) return;
      const _ = e.value.clientWidth, L = e.value.clientHeight;
      p.resize(_, L) && (c ? (c.setPixelRatio(p.dpr), c.setSize(_, L)) : n.value && (n.value.width = p.canvas.width, n.value.height = p.canvas.height, n.value.style.width = _ + "px", n.value.style.height = L + "px"), d());
    }
    function d() {
      if (!p.canvas.width) return;
      if (r) {
        if (!n.value) return;
        p.paintOnly(!1);
        const L = n.value.getContext("2d");
        L && (L.setTransform(1, 0, 0, 1, 0, 0), L.clearRect(0, 0, n.value.width, n.value.height), L.drawImage(p.canvas, 0, 0));
        return;
      }
      if (!c) return;
      const _ = t.theme === "paper";
      p.setLook({
        curvature: t.curvature,
        scanlines: t.scanlines && !_,
        vignette: !_,
        magnify: t.magnify
      }), p.syncUniforms(), p.paint(t.glow), c.render(m, v);
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
      () => d(),
      { deep: !0 }
    ), ne(() => t.magnify, (_) => {
      _ || p.setLens(null), d();
    });
    function g(_) {
      !t.magnify || !n.value || (p.setLens(Mt(_, n.value)), d());
    }
    function z() {
      p.setLens(null), d();
    }
    let A = null, k = null, I = 0;
    const T = bt("cathodeResetTick", X(0));
    ne(T, () => E());
    function E() {
      cancelAnimationFrame(I), I = requestAnimationFrame(x);
    }
    function R(_) {
      _.preventDefault();
    }
    function D() {
      c == null || c.dispose(), c = null, r = !1, b(), d();
    }
    Ye(() => {
      Ae(() => {
        var _;
        b(), n.value && (n.value.addEventListener("webglcontextlost", R), n.value.addEventListener("webglcontextrestored", D)), e.value && (A = new ResizeObserver(() => x()), A.observe(e.value), k = new IntersectionObserver((L) => {
          L.some((W) => W.isIntersecting) && E();
        }), k.observe(e.value)), window.addEventListener("resize", E), (_ = window.visualViewport) == null || _.addEventListener("resize", E), s();
      });
    }), Ge(() => {
      var _, L, W;
      cancelAnimationFrame(o), cancelAnimationFrame(I), (_ = n.value) == null || _.removeEventListener("webglcontextlost", R), (L = n.value) == null || L.removeEventListener("webglcontextrestored", D), A == null || A.disconnect(), k == null || k.disconnect(), window.removeEventListener("resize", E), (W = window.visualViewport) == null || W.removeEventListener("resize", E), u(), p.dispose();
    });
    const G = se(() => ({
      background: (Wt[t.theme] ?? Wt.none).bg
    }));
    return (_, L) => (xe(), be("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-gauge-wrap",
      style: $e(G.value)
    }, [
      he("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-gauge-canvas",
        onMousemove: g,
        onMouseleave: z
      }, null, 544)
    ], 4));
  }
}), go = /* @__PURE__ */ Ke(Jl, [["__scopeId", "data-v-6c2fc3b2"]]);
function wo(i, t = 1) {
  if (i.mode !== "world")
    throw new Error("createSurfaceMesh needs a CathodeSurface created with mode: 'world'");
  const e = i.logicalH > 0 ? i.logicalW / i.logicalH : 16 / 9, n = new P.Mesh(new P.PlaneGeometry(t * e, t), i.material);
  return n.userData.cathodeSurface = i, n;
}
function yo(i, t, e = 1) {
  const n = t.logicalH > 0 ? t.logicalW / t.logicalH : 1.7777777777777777;
  i.geometry.dispose(), i.geometry = new P.PlaneGeometry(e * n, e);
}
const eo = {
  bg: "#0d1520",
  border: "#2a3a50",
  text: "#c0d0e0",
  muted: "#6a7f96",
  accent: "#40a0f0",
  hover: "rgba(255,255,255,0.07)",
  divider: "#1e2a3a"
}, to = -40, no = 40, Et = 2, we = 188, Pe = 26, Ee = 24, We = 30, Zn = 24, Oe = Pe + Ee * 3 + We + Zn, Zt = "11px system-ui, -apple-system, sans-serif", ge = 22, ft = 10;
class dt {
  constructor(t, e = {}) {
    V(this, "mesh");
    V(this, "panel", null);
    V(this, "canvas", document.createElement("canvas"));
    V(this, "texture");
    V(this, "colors");
    V(this, "display", { curvature: 0, scanlines: !1, glow: !1, magnify: !1 });
    V(this, "hover", null);
    this.ppu = t, this.colors = { ...eo, ...e };
    const n = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(we * n), this.canvas.height = Math.round(Oe * n), this.texture = new P.CanvasTexture(this.canvas), this.texture.colorSpace = P.SRGBColorSpace, this.mesh = new P.Mesh(
      new P.PlaneGeometry(we / t, Oe / t),
      new P.MeshBasicMaterial({ map: this.texture, transparent: !0, depthTest: !1, depthWrite: !1, toneMapped: !1 })
    ), this.mesh.renderOrder = 1e6, this.mesh.visible = !1;
  }
  get isOpen() {
    return !!this.panel;
  }
  setColors(t) {
    this.colors = { ...this.colors, ...t }, this.panel && this.draw();
  }
  /** open on `panel`, with its top-left corner at (x, y) in the panel's BODY px (clamped to stay inside the body) */
  open(t, e, n, l) {
    this.close(), this.panel = t, this.display = { ...l }, this.hover = null;
    const a = t.content.width, o = t.content.height, s = Math.max(4, Math.min(e, a - we - 4)), c = Math.max(4, Math.min(n, o - Oe - 4));
    this.mesh.position.set((s + we / 2 - a / 2) / this.ppu, (o / 2 - (c + Oe / 2)) / this.ppu, 0.02), t.group.add(this.mesh), this.mesh.visible = !0, this.draw();
  }
  close() {
    this.panel && (this.panel.group.remove(this.mesh), this.mesh.visible = !1, this.panel = null, this.hover = null);
  }
  update(t) {
    this.display = { ...t }, this.draw();
  }
  setHover(t) {
    t !== this.hover && (this.hover = t, this.draw());
  }
  /** the row under a point of the menu's own UV (y up), or null (header, divider, hint) */
  rowAtUV(t, e) {
    const n = t * we, a = (1 - e) * Oe - Pe;
    if (a < 0) return null;
    if (a < Ee * 3) return ["scanlines", "glow", "magnify"][Math.floor(a / Ee)];
    if (a - Ee * 3 < We) {
      if (n >= we - ft - ge) return "curve+";
      if (n >= we - ft - ge - 54 - ge && n < we - ft - ge - 54) return "curve-";
    }
    return null;
  }
  /** the CENTRE of a row in the menu's own px (for tests / tours) */
  static rowCentre(t) {
    switch (t) {
      case "scanlines":
        return { x: 90, y: Pe + Ee * 0.5 };
      case "glow":
        return { x: 90, y: Pe + Ee * 1.5 };
      case "magnify":
        return { x: 90, y: Pe + Ee * 2.5 };
      case "curve-":
        return { x: we - ft - ge - 54 - ge / 2, y: Pe + Ee * 3 + We / 2 };
      case "curve+":
        return { x: we - ft - ge / 2, y: Pe + Ee * 3 + We / 2 };
    }
  }
  draw() {
    var r;
    const t = Math.min(window.devicePixelRatio || 1, 2), e = this.colors, n = this.canvas.getContext("2d");
    n.setTransform(t, 0, 0, t, 0, 0), n.clearRect(0, 0, we, Oe), n.fillStyle = e.bg, n.fillRect(0, 0, we, Oe), n.strokeStyle = e.border, n.lineWidth = 1, n.strokeRect(0.5, 0.5, we - 1, Oe - 1), n.textBaseline = "middle", n.fillStyle = e.muted, n.font = "bold 9px system-ui, -apple-system, sans-serif", n.letterSpacing = "1px", n.textAlign = "left", n.fillText("DISPLAY", 10, Pe / 2), n.letterSpacing = "0px", n.font = "9px system-ui, -apple-system, sans-serif", n.textAlign = "right", n.fillText(`curve: ${this.display.curvature}`, we - 10, Pe / 2), n.strokeStyle = e.divider, n.beginPath(), n.moveTo(0, Pe - 0.5), n.lineTo(we, Pe - 0.5), n.stroke(), [
      ["scanlines", "Scan lines", this.display.scanlines],
      ["glow", "Glow", this.display.glow],
      ["magnify", "Magnify (hover lens)", this.display.magnify]
    ].forEach(([u, m, v], p) => {
      const b = Pe + p * Ee;
      this.hover === u && (n.fillStyle = e.hover, n.fillRect(1, b, we - 2, Ee));
      const x = 10, d = b + (Ee - 12) / 2;
      n.strokeStyle = v ? e.accent : e.muted, n.lineWidth = 1.2, n.strokeRect(x + 0.5, d + 0.5, 11, 11), v && (n.lineWidth = 1.8, n.lineCap = "round", n.beginPath(), n.moveTo(x + 3, d + 6.5), n.lineTo(x + 5.5, d + 9), n.lineTo(x + 9.5, d + 3.5), n.stroke()), n.fillStyle = e.text, n.font = Zt, n.textAlign = "left", n.fillText(m, 30, b + Ee / 2);
    });
    const a = Pe + Ee * 3;
    n.strokeStyle = e.divider, n.lineWidth = 1, n.beginPath(), n.moveTo(0, a + 0.5), n.lineTo(we, a + 0.5), n.stroke(), n.fillStyle = e.text, n.font = Zt, n.textAlign = "left", n.fillText("Bend", 10, a + We / 2);
    const o = (u, m, v) => {
      const p = a + (We - ge) / 2;
      this.hover === u && (n.fillStyle = e.hover, n.fillRect(m, p, ge, ge)), n.strokeStyle = this.hover === u ? e.accent : e.border, n.lineWidth = 1, n.strokeRect(m + 0.5, p + 0.5, ge - 1, ge - 1), n.strokeStyle = e.text, n.lineWidth = 1.6, n.lineCap = "round", n.beginPath(), n.moveTo(m + 6, p + ge / 2), n.lineTo(m + ge - 6, p + ge / 2), v && (n.moveTo(m + ge / 2, p + 6), n.lineTo(m + ge / 2, p + ge - 6)), n.stroke();
    }, s = we - ft - ge, c = s - 54 - ge;
    o("curve-", c, !1), o("curve+", s, !0), n.fillStyle = e.text, n.font = Zt, n.textAlign = "center", n.fillText(String(this.display.curvature), c + ge + 27, a + We / 2), n.strokeStyle = e.divider, n.beginPath(), n.moveTo(0, a + We + 0.5), n.lineTo(we, a + We + 0.5), n.stroke(), n.fillStyle = e.muted, n.font = "9px system-ui, -apple-system, sans-serif", n.textAlign = "left", n.fillText("Cmd+Shift +/−  bends the hovered panel", 10, a + We + Zn / 2), this.texture.needsUpdate = !0, (r = this.panel) == null || r.invalidate();
  }
  dispose() {
    this.close(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.texture.dispose();
  }
}
V(dt, "width", we), V(dt, "height", Oe);
const lt = 26, Qt = 20, Tn = 18, Cn = 4, kn = 8, ot = 16, io = { w: 240, h: 160 }, lo = { w: 1600, h: 1e3 };
class oo {
  constructor(t, e) {
    V(this, "id");
    V(this, "content");
    V(this, "group", new P.Group());
    V(this, "body");
    V(this, "bar");
    V(this, "glow");
    V(this, "_display", { curvature: 0, scanlines: !0, glow: !0, magnify: !1 });
    V(this, "dirty", !0);
    V(this, "barDirty", !0);
    V(this, "_title");
    V(this, "controls");
    V(this, "resizable");
    V(this, "minSize");
    V(this, "maxSize");
    V(this, "_grip", null);
    V(this, "_minimized", !1);
    V(this, "_maximized", !1);
    V(this, "hoverControl", null);
    V(this, "barCanvas", document.createElement("canvas"));
    V(this, "barTexture");
    var c, r, u, m, v;
    this.stage = t, this.id = e.id, this._title = e.title ?? e.id, this.controls = e.controls ?? [], this.content = e.content, this.resizable = !!e.resizable && typeof e.content.resize == "function", this.minSize = e.minSize ?? io, this.maxSize = e.maxSize ?? lo, this.glow = e.glow ?? !0;
    const n = e.content.surface;
    if (n.mode !== "world") throw new Error("CathodeStage3D panels need a CathodeSurface created with mode: 'world'");
    const l = t.pxPerUnit, a = e.content.width / l, o = e.content.height / l, s = lt / l;
    if (this.body = new P.Mesh(new P.PlaneGeometry(a, o), n.material), this.barTexture = new P.CanvasTexture(this.barCanvas), this.barTexture.colorSpace = P.SRGBColorSpace, this.bar = new P.Mesh(
      new P.PlaneGeometry(a, s),
      new P.MeshBasicMaterial({ map: this.barTexture, toneMapped: !1 })
    ), this.bar.position.y = o / 2 + s / 2, this.group.add(this.body, this.bar), this.body.userData.panel = this, this.bar.userData.panel = this, this.resizable) {
      const p = ot / l, b = document.createElement("canvas");
      b.width = b.height = 32;
      const x = b.getContext("2d");
      x.strokeStyle = "#6ee7a7", x.lineWidth = 3, x.lineCap = "round", x.beginPath();
      for (const g of [10, 18, 26])
        x.moveTo(30, g), x.lineTo(g, 30);
      x.stroke();
      const d = new P.CanvasTexture(b);
      d.colorSpace = P.SRGBColorSpace, this._grip = new P.Mesh(
        new P.PlaneGeometry(p, p),
        new P.MeshBasicMaterial({ map: d, transparent: !0, opacity: 0.55, depthWrite: !1, toneMapped: !1 })
      ), this.group.add(this._grip), this.placeGrip();
    }
    e.visible === !1 && (this.group.visible = !1), e.minimized && (this._minimized = !0, this.body.visible = !1), e.position && this.group.position.set(...e.position), this.group.rotation.y = e.rotationY ?? 0, e.look && n.setLook(e.look), this._display = { curvature: ((c = e.look) == null ? void 0 : c.curvature) ?? 0, scanlines: ((r = e.look) == null ? void 0 : r.scanlines) ?? !0, glow: this.glow, magnify: ((u = e.look) == null ? void 0 : u.magnify) ?? !1 }, n.resize(e.content.width, e.content.height, window.devicePixelRatio || 1), (v = (m = e.content).attach) == null || v.call(m, () => this.invalidate());
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
    this.grip.position.set((this.content.width - ot) / 2 / t, -(this.content.height - ot) / 2 / t, 3e-3), this.grip.visible = !this._minimized;
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
    const n = this.stage.pxPerUnit, l = lt / n;
    return this.body.geometry.dispose(), this.body.geometry = new P.PlaneGeometry(t / n, e / n), this.bar.geometry.dispose(), this.bar.geometry = new P.PlaneGeometry(t / n, l), this.bar.position.y = e / n / 2 + l / 2, this.placeGrip(), this.dirty = !0, this.barDirty = !0, this.stage.invalidate(), !0;
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
    const n = this.controls.length;
    return { x: this.content.width - kn - (n - e) * Qt - (n - 1 - e) * Cn, y: (lt - Tn) / 2 - 1, w: Qt, h: Tn };
  }
  /** The control at a point in the title bar's px, or null. */
  controlAt(t, e) {
    for (const n of this.controls) {
      const l = this.controlRect(n);
      if (t >= l.x && t <= l.x + l.w && e >= l.y && e <= l.y + l.h) return n;
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
    this.content.surface.setLook(t);
    const e = this._display;
    t.curvature !== void 0 && (e.curvature = t.curvature), t.scanlines !== void 0 && (e.scanlines = t.scanlines), t.magnify !== void 0 && (e.magnify = t.magnify), this.invalidate();
  }
  /** the panel's display switches: bend, scan lines, glow, the hover magnifier */
  get display() {
    return { ...this._display };
  }
  /** change any of the display switches (what the Display menu does); a turned-off magnifier lets go of the lens */
  setDisplay(t) {
    this._display = { ...this._display, ...t };
    const e = this._display;
    this.content.surface.setLook({ curvature: e.curvature, scanlines: e.scanlines, magnify: e.magnify }), this.glow = e.glow, e.magnify || this.content.surface.setLens(null), this.invalidate();
  }
  setPosition(t, e, n) {
    this.group.position.set(t, e, n), this.stage.invalidate();
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
    const t = Math.min(window.devicePixelRatio || 1, 2), e = this.content.width, n = lt, l = this.barCanvas;
    (l.width !== Math.round(e * t) || l.height !== Math.round(n * t)) && (l.width = Math.round(e * t), l.height = Math.round(n * t), this.barTexture.dispose(), this.barTexture = new P.CanvasTexture(l), this.barTexture.colorSpace = P.SRGBColorSpace, this.bar.material.map = this.barTexture, this.bar.material.needsUpdate = !0);
    const a = l.getContext("2d");
    a.setTransform(t, 0, 0, t, 0, 0);
    const o = this.stage.focusedId === this.id;
    a.fillStyle = o ? "#0f2a1d" : "#08130e", a.fillRect(0, 0, e, n), a.fillStyle = o ? "#6ee7a7" : "#2f6b4c", a.fillRect(0, n - 2, e, 2), a.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", a.textBaseline = "middle", a.fillStyle = o ? "#b6f5d2" : "#6fae8f";
    const s = this.controls.length ? e - 10 - (kn + this.controls.length * (Qt + Cn)) : e - 20;
    a.fillText(this._title, 10, n / 2 - 1, Math.max(20, s)), this.drawControls(a, o), this.barTexture.needsUpdate = !0;
  }
  /** the title-bar controls: strokes, not font glyphs (a glyph can fall back to a font that does not have it) */
  drawControls(t, e) {
    for (const n of this.controls) {
      const l = this.controlRect(n);
      this.hoverControl === n && (t.fillStyle = "rgba(110,231,167,0.20)", t.fillRect(l.x, l.y, l.w, l.h)), t.strokeStyle = e ? "#b6f5d2" : "#6fae8f", t.lineWidth = 1.4;
      const a = l.x + l.w / 2, o = l.y + l.h / 2;
      t.beginPath(), n === "minimize" ? this._minimized ? (t.moveTo(a - 5, o), t.lineTo(a + 5, o), t.moveTo(a, o - 5), t.lineTo(a, o + 5)) : (t.moveTo(a - 5, o + 3), t.lineTo(a + 5, o + 3)) : this._maximized ? (t.rect(a - 5, o - 2, 7, 6), t.moveTo(a - 2, o - 2), t.lineTo(a - 2, o - 5), t.lineTo(a + 5, o - 5), t.lineTo(a + 5, o + 1), t.lineTo(a + 2, o + 1)) : t.rect(a - 5, o - 4, 10, 8), t.stroke();
    }
  }
  dispose() {
    var t, e, n;
    if (this.body.geometry.dispose(), this.bar.geometry.dispose(), this.bar.material.dispose(), this.barTexture.dispose(), this.grip) {
      this.grip.geometry.dispose();
      const l = this.grip.material;
      (t = l.map) == null || t.dispose(), l.dispose();
    }
    (n = (e = this.content).dispose) == null || n.call(e);
  }
}
class xo {
  constructor(t) {
    V(this, "renderer");
    V(this, "scene", new P.Scene());
    V(this, "camera");
    V(this, "canvas");
    V(this, "panels", /* @__PURE__ */ new Map());
    V(this, "pxPerUnit");
    V(this, "focusedId", null);
    V(this, "controls", null);
    V(this, "ray", new P.Raycaster());
    V(this, "ndc", new P.Vector2());
    V(this, "raf", 0);
    V(this, "rendering", !1);
    V(this, "raiseCounter", 0);
    V(this, "hovered", null);
    V(this, "pressed", null);
    // a content press in progress
    V(this, "dragging", null);
    V(this, "suppressClick", !1);
    /** the in-scene Display menu (when the `displayMenu` option is on) and the panel whose hover lens is following the pointer */
    V(this, "menu", null);
    V(this, "lensPanel", null);
    V(this, "resizeObserver");
    V(this, "disposers", []);
    V(this, "lastCursor", "");
    V(this, "passThrough");
    V(this, "swallowClick", !1);
    V(this, "pressedControl", null);
    V(this, "resizing", null);
    V(this, "hoverGrip", null);
    V(this, "hoverBar", null);
    V(this, "cancelFly", null);
    this.o = t, this.pxPerUnit = t.pxPerUnit ?? 360, this.passThrough = !!t.passThrough, this.renderer = new P.WebGLRenderer({ antialias: !0, alpha: !!t.transparent }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setClearColor(t.background ?? 329738, t.transparent ? 0 : 1), this.canvas = this.renderer.domElement, this.passThrough || (this.canvas.tabIndex = 0), this.canvas.style.cssText = "display:block;width:100%;height:100%;outline:none;touch-action:none" + (this.passThrough ? ";pointer-events:none" : ""), t.container.appendChild(this.canvas), this.camera = new P.PerspectiveCamera(t.fov ?? 45, 1, t.near ?? 0.05, t.far ?? 100);
    const e = t.cameraPosition ?? [0, 0.1, 3.4];
    this.camera.position.set(...e), this.camera.lookAt(0, 0, 0), t.controls && (this.controls = t.controls(this.camera, this.canvas), this.controls.addEventListener("change", () => this.invalidate()));
    const n = this.passThrough ? t.inputTarget ?? document : this.canvas;
    this.on(n, "pointerdown", (l) => this.onPointerDown(l), { capture: !0 }), this.on(n, "pointermove", (l) => this.onPointerMove(l)), this.passThrough || this.on(this.canvas, "pointerleave", () => this.setHover(null)), this.on(window, "pointerup", (l) => this.onPointerUp(l)), this.on(window, "pointercancel", (l) => this.onPointerUp(l)), this.on(n, "click", (l) => this.onClick(l), { capture: this.passThrough }), this.on(n, "wheel", (l) => this.onWheel(l), { capture: !0, passive: !1 }), this.on(this.passThrough ? window : this.canvas, "keydown", (l) => this.onKey(l)), t.displayMenu && (this.menu = new dt(this.pxPerUnit, typeof t.displayMenu == "object" ? t.displayMenu.colors : {}), this.on(n, "contextmenu", (l) => this.onContextMenu(l), { capture: !0 })), this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t.container), this.resize();
  }
  on(t, e, n, l) {
    t.addEventListener(e, n, l), this.disposers.push(() => t.removeEventListener(e, n, l));
  }
  // ── External camera ─────────────────────────────────────────────────────────
  /** Point the camera (the host drives it — e.g. following another scene's camera). */
  setCameraPose(t) {
    var e, n;
    this.camera.position.set(...t.position), this.camera.lookAt(...t.target), this.camera.updateMatrixWorld(!0), (n = (e = this.controls) == null ? void 0 : e.target) == null || n.set(...t.target), this.invalidate();
  }
  /**
   * The camera pose that looks straight at a panel (its title bar included), from the front, far
   * enough back that the whole panel fits the view with `margin` (default 12%) to spare. Pure — it
   * moves nothing: a host that owns the camera (overlay mode) applies it itself; otherwise flyTo().
   */
  facingPose(t, e = {}) {
    const n = this.panels.get(t);
    if (!n) return null;
    n.group.updateWorldMatrix(!0, !0);
    const l = this.pxPerUnit, a = n.content.height / l, o = lt / l, s = n.content.width / l, c = a / 2 + o, r = n.minimized ? a / 2 : -a / 2, u = c - r, m = n.body.localToWorld(new P.Vector3(0, (c + r) / 2, 0)), v = new P.Vector3(0, 0, 1).applyQuaternion(n.group.getWorldQuaternion(new P.Quaternion())), p = Math.tan(P.MathUtils.degToRad(this.camera.fov / 2)), b = Math.max(u / 2 / p, s / 2 / (p * this.camera.aspect)) * (1 + (e.margin ?? 0.12)), x = m.clone().addScaledVector(v, b);
    return { position: [x.x, x.y, x.z], target: [m.x, m.y, m.z] };
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
    const n = this.getCameraPose();
    return new Promise((a) => {
      const o = performance.now();
      let s = 0;
      this.cancelFly = () => {
        cancelAnimationFrame(s), this.cancelFly = null, a();
      };
      const c = (r) => {
        const u = Math.min(1, (r - o) / e), m = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, v = (p, b) => [p[0] + (b[0] - p[0]) * m, p[1] + (b[1] - p[1]) * m, p[2] + (b[2] - p[2]) * m];
        this.setCameraPose({ position: v(n.position, t.position), target: v(n.target, t.target) }), u < 1 ? s = requestAnimationFrame(c) : (this.cancelFly = null, a());
      };
      s = requestAnimationFrame(c);
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
    const e = new oo(this, t);
    return e.content.surface.setAnisotropy(this.renderer.capabilities.getMaxAnisotropy()), this.panels.set(t.id, e), this.scene.add(e.group), this.raise(e), this.invalidate(), e;
  }
  removePanel(t) {
    var n;
    const e = this.panels.get(t);
    e && (this.focusedId === t && this.setFocus(null), this.hovered === e && (this.hovered = null), this.pressed === e && (this.pressed = null), this.lensPanel === e && (this.lensPanel = null), ((n = this.menu) == null ? void 0 : n.panel) === e && this.menu.close(), this.scene.remove(e.group), e.dispose(), this.panels.delete(t), this.invalidate());
  }
  /** Show / hide a panel. Hiding releases its focus, hover, press and drag. */
  setPanelVisible(t, e) {
    var l;
    const n = this.panels.get(t);
    n && (n.setVisible(e), e || (this.focusedId === t && this.setFocus(null), this.hovered === n && (this.hovered = null), this.pressed === n && (this.pressed = null), ((l = this.dragging) == null ? void 0 : l.panel) === n && (this.dragging = null)), this.invalidate());
  }
  /** Collapse a panel to its title bar / expand it. Collapsing releases hover and press on its body. */
  setPanelMinimized(t, e) {
    const n = this.panels.get(t);
    n && (n.setMinimized(e), e && (this.hovered === n && (this.hovered = null), this.pressed === n && (this.pressed = null)), this.invalidate());
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
    const n = t ? this.panels.get(t) : null;
    n && (this.raise(n), n.invalidateBar()), (a = (l = this.o).onFocus) == null || a.call(l, t), this.invalidate();
  }
  raise(t) {
    t.body.renderOrder = t.bar.renderOrder = ++this.raiseCounter, t.grip && (t.grip.renderOrder = t.body.renderOrder + 0.5);
  }
  getLayout() {
    const t = {};
    for (const [e, n] of this.panels)
      t[e] = { x: n.group.position.x, y: n.group.position.y, z: n.group.position.z, rotY: n.group.rotation.y, visible: n.visible, minimized: n.minimized, ...n.resizable ? { size: { w: n.content.width, h: n.content.height } } : {} };
    return t;
  }
  applyLayout(t) {
    for (const [e, n] of Object.entries(t)) {
      const l = this.panels.get(e);
      l && (l.group.position.set(n.x ?? l.group.position.x, n.y ?? l.group.position.y, n.z ?? l.group.position.z), n.rotY !== void 0 && (l.group.rotation.y = n.rotY), n.visible !== void 0 && this.setPanelVisible(e, n.visible), n.minimized !== void 0 && this.setPanelMinimized(e, n.minimized), n.size && l.resize(n.size.w, n.size.h));
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
    const n = this.canvas.getBoundingClientRect();
    this.ndc.set((t - n.left) / n.width * 2 - 1, -((e - n.top) / n.height) * 2 + 1), this.ray.setFromCamera(this.ndc, this.camera);
  }
  /** Content px (the panel's logical px) under a client point, or null (miss / bezel). */
  contentAt(t, e, n) {
    this.setRay(e, n);
    const l = this.ray.intersectObject(t.body)[0];
    return l != null && l.uv ? t.content.surface.contentPoint(l.uv.x, l.uv.y) : null;
  }
  /** Local content-px per screen-px at a client point: two probes 8px apart, as the DOM grid does. */
  hitScaleAt(t, e, n) {
    const l = this.contentAt(t, e - 4, n), a = this.contentAt(t, e + 4, n);
    return !l || !a ? 1 : Math.max(1, Math.abs(a.x - l.x) / 8);
  }
  /** The nearest panel part under a client point (bodies and title bars; raised panels win ties). */
  pick(t, e) {
    this.setRay(t, e);
    const n = [];
    for (const v of this.panels.values()) v.visible && (v.minimized || n.push(v.body), n.push(v.bar));
    const l = this.ray.intersectObjects(n, !1);
    if (!l.length) return null;
    const a = l[0].distance;
    let o = l[0];
    for (const v of l)
      v.distance - a < 1e-3 && v.object.renderOrder > o.object.renderOrder && (o = v);
    const s = o.object.userData.panel, c = o.object === s.bar ? "bar" : "body", r = c === "body" && o.uv ? s.content.surface.contentPoint(o.uv.x, o.uv.y) : null, u = c === "bar" && o.uv ? s.controlAt(o.uv.x * s.content.width, (1 - o.uv.y) * lt) : null, m = c === "body" && s.resizable && !s.minimized && !!o.uv && o.uv.x * s.content.width > s.content.width - ot && (1 - o.uv.y) * s.content.height > s.content.height - ot;
    return { panel: s, part: c, content: r, control: u, handle: m, uv: o.uv ? { x: o.uv.x, y: o.uv.y } : null };
  }
  /**
   * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
   * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
   */
  clientPointForContent(t, e, n) {
    const l = this.panels.get(t);
    if (!l) return null;
    const a = l.content.surface, o = l.content.width, s = l.content.height;
    let c = e / o, r = 1 - n / s;
    const u = (b, x) => a.contentPoint(b, x);
    for (let b = 0; b < 12; b++) {
      const x = u(c, r);
      if (!x) {
        c = 0.5 + (c - 0.5) * 0.8, r = 0.5 + (r - 0.5) * 0.8;
        continue;
      }
      const d = x.x - e, g = x.y - n;
      if (Math.hypot(d, g) < 0.05) break;
      const z = 1e-4, A = u(c + z, r), k = u(c, r + z);
      if (!A || !k) break;
      const I = (A.x - x.x) / z, T = (k.x - x.x) / z, E = (A.y - x.y) / z, R = (k.y - x.y) / z, D = I * R - T * E;
      if (Math.abs(D) < 1e-9) break;
      c -= (R * d - T * g) / D, r -= (-E * d + I * g) / D;
    }
    const m = u(c, r);
    if (!m || Math.hypot(m.x - e, m.y - n) > 1.5) return null;
    l.group.updateWorldMatrix(!0, !0);
    const v = l.body.localToWorld(new P.Vector3((c - 0.5) * (o / this.pxPerUnit), (r - 0.5) * (s / this.pxPerUnit), 0));
    v.project(this.camera);
    const p = this.canvas.getBoundingClientRect();
    return { x: p.left + (v.x + 1) / 2 * p.width, y: p.top + (1 - v.y) / 2 * p.height };
  }
  /** Client point of a resizable panel's resize handle (for tests / tours), or null. */
  clientPointForHandle(t) {
    const e = this.panels.get(t);
    if (!e || !e.resizable) return null;
    e.group.updateWorldMatrix(!0, !0);
    const n = this.pxPerUnit, l = e.body.localToWorld(new P.Vector3((e.content.width / 2 - ot / 2) / n, -(e.content.height / 2 - ot / 2) / n, 0)).project(this.camera), a = this.canvas.getBoundingClientRect();
    return { x: a.left + (l.x + 1) / 2 * a.width, y: a.top + (1 - l.y) / 2 * a.height };
  }
  /** Client point of a title-bar control's centre (for tests / tours), or null. */
  clientPointForControl(t, e) {
    const n = this.panels.get(t), l = n == null ? void 0 : n.controlRect(e);
    if (!n || !l) return null;
    n.group.updateWorldMatrix(!0, !0);
    const a = this.pxPerUnit, o = new P.Vector3((l.x + l.w / 2 - n.content.width / 2) / a, 0, 0);
    o.y = (lt / 2 - (l.y + l.h / 2)) / a;
    const s = n.bar.localToWorld(o).project(this.camera), c = this.canvas.getBoundingClientRect();
    return { x: c.left + (s.x + 1) / 2 * c.width, y: c.top + (1 - s.y) / 2 * c.height };
  }
  /** Client point of a panel's title bar centre (for tests / tours). */
  clientPointForBar(t) {
    const e = this.panels.get(t);
    if (!e) return null;
    e.group.updateWorldMatrix(!0, !0);
    const n = e.bar.getWorldPosition(new P.Vector3()).project(this.camera), l = this.canvas.getBoundingClientRect();
    return { x: l.left + (n.x + 1) / 2 * l.width, y: l.top + (1 - n.y) / 2 * l.height };
  }
  // ── Pointer routing ─────────────────────────────────────────────────────────
  send(t, e, n, l = {}) {
    var s, c;
    const a = this.contentAt(t, n.clientX, n.clientY), o = {
      kind: e,
      x: a ? a.x : -1,
      y: a ? a.y : -1,
      hitScale: a ? this.hitScaleAt(t, n.clientX, n.clientY) : 1,
      clientX: n.clientX,
      clientY: n.clientY,
      deltaX: l.deltaX ?? 0,
      deltaY: l.deltaY ?? 0,
      detail: e === "click" ? n.detail ?? 0 : 0,
      shiftKey: !!n.shiftKey
    };
    return ((c = (s = t.content).pointer) == null ? void 0 : c.call(s, o)) ?? null;
  }
  setCursor(t) {
    t !== this.lastCursor && (this.lastCursor = t, this.o.onCursor ? this.o.onCursor(t) : this.canvas.style.cursor = t);
  }
  setHover(t, e) {
    this.hovered && this.hovered !== t && this.send(this.hovered, "leave", e ?? { clientX: -1, clientY: -1 }), this.hovered = t, t || (this.setCursor(""), this.setLens(null));
  }
  /** passThrough: did this event land on something the stage may take (not DOM stacked above it)? */
  accepts(t) {
    return !this.passThrough || !this.o.shouldHandle || this.o.shouldHandle(t.target);
  }
  onPointerDown(t) {
    var n;
    if (t.button !== 0 || !this.accepts(t)) return;
    if ((n = this.menu) != null && n.isOpen) {
      const l = this.pickMenu(t.clientX, t.clientY);
      if (l) {
        t.preventDefault(), t.stopPropagation(), this.suppressClick = !0, this.menuAct(l);
        return;
      }
      this.menu.close(), this.invalidate();
    }
    this.passThrough || this.canvas.focus({ preventScroll: !0 });
    const e = this.pick(t.clientX, t.clientY);
    if (!e) {
      this.passThrough && this.setFocus(null);
      return;
    }
    this.passThrough && (t.stopPropagation(), this.swallowClick = !0), this.controls && (this.controls.enabled = !1), this.setFocus(e.panel.id), this.suppressClick = !1, e.part === "bar" && e.control ? (this.pressedControl = { panel: e.panel, control: e.control }, this.setCursor("pointer")) : e.part === "bar" ? (this.startDrag(e.panel), this.setCursor("grabbing")) : e.handle ? (this.startResize(e.panel), this.setCursor("nwse-resize")) : (this.pressed = e.panel, this.send(e.panel, "down", t));
  }
  onPointerMove(t) {
    var l;
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
    if ((l = this.menu) != null && l.isOpen) {
      const a = this.pickMenu(t.clientX, t.clientY);
      if (this.menu.setHover(a), a) {
        this.setHover(null, t), this.setHoverBar(null, null), this.setHoverGrip(null), this.setLens(null), this.setCursor("pointer");
        return;
      }
    }
    const e = this.pick(t.clientX, t.clientY);
    if (this.setLens(e && e.part === "body" && !e.handle ? e : null), this.setHoverGrip(e != null && e.handle ? e.panel : null), this.setHover(e && e.part === "body" && !e.handle ? e.panel : null, t), this.setHoverBar(e && e.part === "bar" ? e.panel : null, (e == null ? void 0 : e.control) ?? null), !e) {
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
    const n = this.send(e.panel, "move", t);
    n && this.setCursor(n);
  }
  /** light the control under the pointer (and clear the previous panel's) */
  setHoverBar(t, e) {
    this.hoverBar && this.hoverBar !== t && this.hoverBar.setHoverControl(null), this.hoverBar = t, t == null || t.setHoverControl(e);
  }
  setHoverGrip(t) {
    this.hoverGrip && this.hoverGrip !== t && this.hoverGrip.setHoverGrip(!1), this.hoverGrip = t, t == null || t.setHoverGrip(!0);
  }
  onPointerUp(t) {
    var e, n, l, a;
    if (this.pressedControl = null, this.resizing) {
      const o = this.resizing;
      if (this.resizing = null, o.moved) {
        this.suppressClick = !0;
        const s = o.panel.group.position;
        (n = (e = this.o).onPanelResized) == null || n.call(e, o.panel.id, { w: o.panel.content.width, h: o.panel.content.height }, { x: s.x, y: s.y, z: s.z });
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
    var n, l, a, o;
    if (!this.accepts(t)) return;
    if (this.passThrough && this.swallowClick && (this.swallowClick = !1, t.stopPropagation()), this.suppressClick) {
      this.suppressClick = !1;
      return;
    }
    const e = this.pick(t.clientX, t.clientY);
    e && this.passThrough && t.stopPropagation(), e && e.part === "body" && this.send(e.panel, "click", t), e && e.part === "bar" && (e.control ? (l = (n = this.o).onPanelControl) == null || l.call(n, e.panel.id, e.control) : t.detail >= 2 && ((o = (a = this.o).onPanelActivate) == null || o.call(a, e.panel.id)));
  }
  onWheel(t) {
    if (!this.accepts(t)) return;
    const e = this.pick(t.clientX, t.clientY);
    !e || e.part !== "body" || (t.preventDefault(), t.stopImmediatePropagation(), this.send(e.panel, "wheel", t, { deltaX: t.deltaX, deltaY: t.deltaY }));
  }
  onKey(t) {
    if (this.passThrough) {
      const n = t.target;
      if (n && (n.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName))) return;
    }
    if (this.menu) {
      if (t.key === "Escape" && this.menu.isOpen) {
        this.menu.close(), this.invalidate();
        return;
      }
      if (t.metaKey && t.shiftKey && /^[=+\-_]$/.test(t.key)) {
        const n = this.menu.panel ?? this.hovered;
        if (n) {
          t.preventDefault(), this.stepBend(n, t.key === "=" || t.key === "+" ? Et : -Et);
          return;
        }
      }
    }
    const e = this.focusedId ? this.panels.get(this.focusedId) : null;
    e != null && e.content.key && (e.content.key(t), e.invalidate());
  }
  // ── The Display menu (in the scene) ─────────────────────────────────────────────────────────────────────
  /** right-click: open the menu on the panel under the pointer (the body or the title bar); anywhere else, close it and leave the click to the page */
  onContextMenu(t) {
    if (!this.menu) return;
    if (!this.accepts(t)) {
      this.menu.close(), this.invalidate();
      return;
    }
    if (this.dragging || this.resizing) return;
    const e = this.pick(t.clientX, t.clientY);
    if (!e) {
      this.menu.isOpen && (this.menu.close(), this.invalidate());
      return;
    }
    t.preventDefault(), t.stopPropagation(), this.setFocus(e.panel.id);
    const n = e.panel.content.width, l = e.panel.content.height, a = e.part === "body" && e.uv || e.uv ? e.uv.x * n : 0, o = e.part === "body" && e.uv ? (1 - e.uv.y) * l : 0;
    this.menu.open(e.panel, a, o, e.panel.display), this.invalidate();
  }
  /** open the menu on a panel programmatically (tests / tours); (x, y) is the menu's top-left in the body's px */
  openDisplayMenu(t, e = 8, n = 8) {
    const l = this.panels.get(t);
    !this.menu || !l || (this.menu.open(l, e, n, l.display), this.invalidate());
  }
  closeDisplayMenu() {
    var t;
    (t = this.menu) != null && t.isOpen && (this.menu.close(), this.invalidate());
  }
  /** the panel the Display menu is open on, or null */
  get displayMenuPanel() {
    var t;
    return ((t = this.menu) == null ? void 0 : t.panel) ?? null;
  }
  /** the menu row under a client point (the menu is a quad on its panel's plane — a plain ray hit), or null */
  pickMenu(t, e) {
    var l;
    if (!((l = this.menu) != null && l.isOpen)) return null;
    this.setRay(t, e);
    const n = this.ray.intersectObject(this.menu.mesh, !1)[0];
    return n != null && n.uv ? this.menu.rowAtUV(n.uv.x, n.uv.y) : null;
  }
  /** the client point of a menu row's centre (for tests / tours), or null when the menu is closed */
  clientPointForMenuRow(t) {
    var o;
    if (!((o = this.menu) != null && o.isOpen)) return null;
    const { x: e, y: n } = dt.rowCentre(t);
    this.menu.mesh.updateWorldMatrix(!0, !1);
    const l = this.menu.mesh.localToWorld(new P.Vector3((e - dt.width / 2) / this.pxPerUnit, (dt.height / 2 - n) / this.pxPerUnit, 0)).project(this.camera), a = this.canvas.getBoundingClientRect();
    return { x: a.left + (l.x + 1) / 2 * a.width, y: a.top + (1 - l.y) / 2 * a.height };
  }
  menuAct(t) {
    var l;
    const e = (l = this.menu) == null ? void 0 : l.panel;
    if (!e) return;
    const n = e.display;
    if (t === "curve-" || t === "curve+") {
      this.stepBend(e, t === "curve+" ? Et : -Et);
      return;
    }
    this.applyDisplay(e, { [t]: !n[t] });
  }
  stepBend(t, e) {
    this.applyDisplay(t, { curvature: Math.max(to, Math.min(no, t.display.curvature + e)) });
  }
  applyDisplay(t, e) {
    var n, l, a;
    t.setDisplay(e), ((n = this.menu) == null ? void 0 : n.panel) === t && this.menu.update(t.display), (a = (l = this.o).onPanelDisplay) == null || a.call(l, t.id, t.display), this.invalidate();
  }
  /** the hover magnifier: follow the pointer over a panel whose `magnify` is on; let go everywhere else */
  setLens(t) {
    const e = t && t.uv && t.panel.display.magnify ? t.panel : null;
    this.lensPanel && this.lensPanel !== e && (this.lensPanel.content.surface.setLens(null), this.lensPanel.invalidate()), this.lensPanel = e, e && t.uv && (e.content.surface.setLens({ x: t.uv.x, y: t.uv.y }), e.invalidate());
  }
  // ── Resize (ray–plane on the panel's own plane; the TOP-LEFT corner stays put) ──────────────────────────
  startResize(t) {
    var r;
    (r = this.menu) == null || r.close(), t.group.updateWorldMatrix(!0, !0);
    const e = t.group.getWorldQuaternion(new P.Quaternion()), n = new P.Vector3(1, 0, 0).applyQuaternion(e), l = new P.Vector3(0, 1, 0).applyQuaternion(e), a = new P.Vector3(0, 0, 1).applyQuaternion(e), o = this.pxPerUnit, s = t.body.localToWorld(new P.Vector3(-t.content.width / o / 2, t.content.height / o / 2, 0)), c = new P.Plane().setFromNormalAndCoplanarPoint(a, s);
    this.resizing = { panel: t, tl: s, right: n, up: l, plane: c, moved: !1 };
  }
  resizeTo(t) {
    const e = this.resizing;
    this.setRay(t.clientX, t.clientY);
    const n = new P.Vector3();
    if (!this.ray.ray.intersectPlane(e.plane, n)) return;
    const l = this.pxPerUnit, a = n.sub(e.tl), o = Math.round(a.dot(e.right) * l), s = Math.round(-a.dot(e.up) * l), c = e.panel, r = Math.round(Math.min(c.maxSize.w, Math.max(c.minSize.w, o))), u = Math.round(Math.min(c.maxSize.h, Math.max(c.minSize.h, s)));
    r === c.content.width && u === c.content.height || (c.group.position.copy(e.tl).addScaledVector(e.right, r / l / 2).addScaledVector(e.up, -u / l / 2), c.resize(r, u), e.moved = !0);
  }
  // ── Drag to move (ray–plane on the panel's own plane) ───────────────────────
  startDrag(t) {
    var o;
    (o = this.menu) == null || o.close(), t.group.updateWorldMatrix(!0, !0);
    const e = new P.Vector3(0, 0, 1).applyQuaternion(t.group.quaternion), n = new P.Plane().setFromNormalAndCoplanarPoint(e, t.group.position), l = new P.Vector3(), a = new P.Vector3();
    this.ray.ray.intersectPlane(n, l) && a.copy(t.group.position).sub(l), this.dragging = { panel: t, plane: n, offset: a, moved: !1 };
  }
  dragTo(t) {
    const e = this.dragging;
    this.setRay(t.clientX, t.clientY);
    const n = new P.Vector3();
    this.ray.ray.intersectPlane(e.plane, n) && (e.panel.group.position.copy(n.add(e.offset)), e.moved = !0, this.invalidate());
  }
  // ── Teardown ────────────────────────────────────────────────────────────────
  dispose() {
    var t, e, n;
    (t = this.cancelFly) == null || t.call(this), cancelAnimationFrame(this.raf), this.resizeObserver.disconnect();
    for (const l of this.disposers) l();
    for (const l of [...this.panels.values()]) this.removePanel(l.id);
    (e = this.menu) == null || e.dispose(), (n = this.controls) == null || n.dispose();
    try {
      this.renderer.forceContextLoss();
    } catch {
    }
    this.renderer.dispose(), this.canvas.remove();
  }
}
function bo(i, t, e, n = {}) {
  return { surface: i, width: t, height: e, ...n };
}
function Mo(i) {
  let t = () => {
  };
  const e = i.theme ?? "phosphor", n = Vn({
    columnDefs: () => i.columnDefs,
    defaultColDef: () => i.defaultColDef,
    rowData: () => i.rowData,
    pinnedBottomRowData: () => i.pinnedBottomRowData,
    rowHeight: () => i.rowHeight ?? 28,
    theme: () => e,
    emit: i.emit ?? (() => {
    }),
    host: { redraw: () => t() }
  });
  n.init(), n.setViewport(i.width, i.height, i.width, i.height);
  const l = new Je({
    mode: "world",
    paint: (c, r) => n.paint(c, r)
  }), a = (c) => {
    const r = { cx: c.x, cy: c.y, hitScale: c.hitScale };
    switch (c.kind) {
      case "move":
        return n.resizing ? null : n.hover(r);
      case "leave":
        return n.leave(), null;
      case "down":
        return n.pointerDown(r, c.clientX, c.clientY), null;
      case "drag":
        return n.globalMove(c.clientX, c.clientY), null;
      case "up":
        return n.globalUp(), null;
      case "click":
        return n.click(r, { shiftKey: c.shiftKey, detail: c.detail }), null;
      case "wheel":
        return n.wheel(c.deltaX, c.deltaY, c.shiftKey), null;
    }
  }, o = (c) => {
    if (n.activeFilter.value) {
      if (c.key === "Escape") {
        c.preventDefault(), n.clearFilter();
        return;
      }
      if (c.key === "Enter") {
        c.preventDefault(), n.closeFilter();
        return;
      }
      if (c.key === "Backspace") {
        c.preventDefault(), n.setFilterText(n.filterPopupValue.value.slice(0, -1)), t();
        return;
      }
      if (c.key.length === 1 && !c.ctrlKey && !c.metaKey) {
        c.preventDefault(), n.setFilterText(n.filterPopupValue.value + c.key), t();
        return;
      }
    }
    n.keyDown(c);
  }, s = {
    model: n,
    surface: l,
    width: i.width,
    height: i.height,
    attach: (c) => {
      t = c;
    },
    pointer: a,
    key: o,
    // more room → more columns / rows; the model re-clamps scroll and re-fits the columns to the new canvas
    resize(c, r) {
      s.width = c, s.height = r, n.setViewport(c, r, c, r), t();
    },
    dispose: () => {
      n.dispose(), l.dispose();
    }
  };
  return s;
}
function So(i) {
  let t = () => {
  };
  const e = Dn({
    entries: i.entries,
    theme: i.theme ?? "phosphor",
    showTimestamps: i.showTimestamps,
    formatTs: i.formatTs,
    wordWrap: i.wordWrap,
    maxLines: i.maxLines
  }), n = $n({
    entries: () => e.entries,
    theme: () => e.theme ?? "phosphor",
    showTimestamps: () => e.showTimestamps ?? !0,
    formatTs: () => e.formatTs,
    wordWrap: () => e.wordWrap ?? !0,
    maxLines: () => e.maxLines ?? 0,
    host: { redraw: () => t() }
  });
  n.setViewport(i.width, i.height), n.scrollToBottom();
  const l = new Je({ mode: "world", paint: (r, u) => n.paint(r, u) });
  let a = { x: 0, y: 0 }, o = !1;
  const s = (r) => {
    switch (r.kind) {
      case "move":
        return n.hover(r.x < 0 ? -1 : r.y), null;
      case "leave":
        return n.leave(), null;
      case "down":
        return a = { x: r.clientX, y: r.clientY }, o = !1, n.panStart(r.clientX * r.hitScale, r.clientY * r.hitScale), null;
      case "drag":
        return Math.hypot(r.clientX - a.x, r.clientY - a.y) > 4 && (o = !0), n.panMove(r.clientX * r.hitScale, r.clientY * r.hitScale), null;
      case "up":
        return n.panEnd(), null;
      case "click":
        return o || n.click(r.x < 0 ? -1 : r.y, r.shiftKey), o = !1, null;
      case "wheel":
        return n.wheel(r.deltaX, r.deltaY, r.shiftKey), null;
    }
  }, c = {
    model: n,
    surface: l,
    width: i.width,
    height: i.height,
    attach: (r) => {
      t = r;
    },
    pointer: s,
    key: (r) => n.keyDown(r),
    update(r) {
      Object.assign(e, r), t();
    },
    // more room → the lines re-wrap to the new width and more of them show
    resize(r, u) {
      c.width = r, c.height = u, n.setViewport(r, u), t();
    },
    dispose: () => {
      n.dispose(), l.dispose();
    }
  };
  return c;
}
function To(i) {
  let t = () => {
  };
  const e = Dn({
    candles: i.candles,
    theme: i.theme,
    slotW: i.slotW,
    showVolume: i.showVolume,
    volumeFraction: i.volumeFraction,
    overlays: i.overlays,
    markers: i.markers,
    compact: i.compact,
    colors: i.colors
  }), n = Gn({
    candles: () => e.candles,
    theme: () => e.theme ?? "phosphor",
    slotW: () => e.slotW ?? 8,
    showVolume: () => e.showVolume ?? !0,
    volumeFraction: () => e.volumeFraction ?? Un,
    overlays: () => e.overlays,
    markers: () => e.markers,
    compact: () => e.compact ?? !1,
    colors: () => e.colors,
    host: { redraw: () => t() }
  });
  n.setViewport(i.width, i.height);
  const l = new Je({ mode: "world", paint: (s, c) => n.paint(s, c) }), a = (s) => {
    switch (s.kind) {
      case "move":
        return n.hoverAt(s.x, s.y), null;
      case "leave":
        return n.leave(), null;
      case "down":
        return n.panStart(s.clientX * s.hitScale), null;
      case "drag":
        return n.panMove(s.clientX * s.hitScale), null;
      case "up":
        return n.panEnd(), null;
      case "wheel":
        return n.wheel(s.deltaX, s.deltaY, s.shiftKey, s.x), null;
    }
  }, o = {
    model: n,
    surface: l,
    width: i.width,
    height: i.height,
    attach: (s) => {
      t = s;
    },
    pointer: a,
    key: (s) => n.keyDown(s),
    update(s) {
      Object.assign(e, s), t();
    },
    // the chart fits whatever it is given: more room, more candles
    resize(s, c) {
      o.width = s, o.height = c, n.setViewport(s, c), t();
    },
    dispose: () => {
      n.dispose(), l.dispose();
    }
  };
  return o;
}
function Co(i) {
  let t = () => {
  }, e = { ...i };
  const n = () => ((e.min ?? -1) + (e.max ?? 1)) / 2;
  let l = e.animate === !1 ? e.value : n(), a = 0;
  const o = new Je({
    mode: "world",
    paint: (r, { dpr: u, glow: m }) => {
      qn(r, {
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
  }), s = () => {
    if (cancelAnimationFrame(a), e.animate === !1) {
      l = e.value, t();
      return;
    }
    const r = () => {
      const u = e.value - l;
      if (Math.abs(u) < 4e-3) {
        l = e.value, t();
        return;
      }
      l += u * 0.18, t(), a = requestAnimationFrame(r);
    };
    a = requestAnimationFrame(r);
  }, c = {
    surface: o,
    width: i.width,
    height: i.height,
    attach: (r) => {
      t = r, s();
    },
    // the mount sweep: centre → value
    resize(r, u) {
      c.width = r, c.height = u, t();
    },
    // the painter lays out for the canvas it is given
    update(r) {
      const u = r.value !== void 0 && r.value !== e.value;
      e = { ...e, ...r }, u || r.animate !== void 0 ? s() : t();
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
  mt as CANDLE_THEME_COLORS,
  uo as CathodeCandle,
  ho as CathodeCandleGrid,
  mo as CathodeContainer,
  go as CathodeGauge,
  ro as CathodeGrid,
  po as CathodeLoader,
  tl as CathodeLog,
  xo as CathodeStage3D,
  Je as CathodeSurface,
  co as CathodeTerminal,
  vo as CathodeWorkspace,
  Wt as GAUGE_THEME_COLORS,
  _t as LOG_THEME_COLORS,
  oo as Panel3D,
  Wi as barrelUV,
  fo as buildDefaultLayout,
  To as candleContent,
  wo as createSurfaceMesh,
  qn as drawGauge,
  Co as gaugeContent,
  Mo as gridContent,
  Hi as lensUV,
  So as logContent,
  yo as resizeSurfaceMesh,
  bo as surfaceContent,
  Gn as useCandleModel,
  jn as useCathodeLayout,
  Vn as useGridModel,
  $n as useLogModel
};
