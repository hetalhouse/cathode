import { defineComponent as Pe, ref as E, reactive as Je, computed as $, watch as K, inject as lt, nextTick as ye, onMounted as Ae, onUnmounted as Ke, openBlock as oe, createElementBlock as ae, normalizeStyle as he, createElementVNode as O, withModifiers as Le, withKeys as At, createCommentVNode as pe, toDisplayString as ge, normalizeClass as yt, renderSlot as Ve, provide as ft, createVNode as Pt, Transition as Ot, withCtx as Yt, Fragment as Vt, renderList as Xt, createTextVNode as Nt, withDirectives as Ut, vShow as Kt } from "vue";
import * as P from "three";
const He = {
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
    bg: "rgba(0,0,0,0)",
    headerBg: "rgba(255,255,255,0.65)",
    text: "#222222",
    textHeader: "#158cba",
    border: "#dee2e6",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)"
  }
}, ee = 30, mt = 12, Gt = 10;
function ht(o, n) {
  const e = o.getContext("2d");
  if (!e) return;
  const a = o.width, v = o.height, g = He[n.theme] ?? He.none, { cols: C, rows: p, pinnedRows: y, rowHeight: s, scrollY: h, scrollX: F, glow: z } = n;
  e.clearRect(0, 0, a, v), e.fillStyle = g.bg, e.fillRect(0, 0, a, v), e.save(), e.beginPath(), e.rect(0, 0, a, v), e.clip();
  const H = y.length * s, S = v - ee - H;
  e.fillStyle = g.headerBg, e.fillRect(0, 0, a, ee), e.textBaseline = "middle", e.textAlign = "left";
  let x = -F;
  for (let f = 0; f < C.length; f++) {
    const T = C[f];
    if (x + T.width <= 0) {
      x += T.width;
      continue;
    }
    if (x >= a) break;
    const W = !!n.colFilters[T.colId], k = n.sortColId === T.colId, M = (T.colDef.headerName ?? T.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(x, 0, T.width, ee), e.clip(), e.font = `bold ${Gt}px system-ui, -apple-system, sans-serif`, e.fillStyle = W ? g.accent : g.textHeader, z && (e.shadowBlur = 6, e.shadowColor = g.textHeader), e.fillText(M, x + 8, ee / 2), e.shadowBlur = 0, k) {
      const c = e.measureText(M).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = g.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", x + 8 + c + 4, ee / 2);
    }
    T.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = W ? g.accent : g.textHeader, e.globalAlpha = W ? 1 : 0.38, e.fillText("⌕", x + T.width - 20, ee / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(x + T.width - 0.5, 0), e.lineTo(x + T.width - 0.5, ee), e.stroke(), x += T.width;
  }
  e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, ee - 0.5), e.lineTo(a, ee - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ee, a, S), e.clip();
  const I = Math.max(0, Math.floor(h / s)), i = Math.min(p.length, Math.ceil((h + S) / s));
  for (let f = I; f < i; f++) {
    const T = p[f], W = ee + f * s - h;
    f % 2 === 1 && (e.fillStyle = g.rowAlt, e.fillRect(0, W, a, s)), f === n.hoveredRow && f !== n.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, W, a, s)), f === n.selectedRow && (e.fillStyle = qt(g.accent, 0.1), e.fillRect(0, W, a, s)), e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, W + s - 0.5), e.lineTo(a, W + s - 0.5), e.stroke();
    let k = -F;
    for (let M = 0; M < C.length; M++) {
      const c = C[M];
      if (k + c.width <= 0) {
        k += c.width;
        continue;
      }
      if (k >= a) break;
      const B = n.getCellStyle(c, T), N = B.color ?? g.text, A = B.textAlign ?? "left", le = n.formatCell(c, T);
      e.save(), e.beginPath(), e.rect(k + 1, W, c.width - 2, s), e.clip(), e.font = `${mt}px system-ui, -apple-system, sans-serif`, e.fillStyle = N, e.textBaseline = "middle", z && (e.shadowBlur = 4, e.shadowColor = N), A === "right" ? (e.textAlign = "right", e.fillText(le, k + c.width - 8, W + s / 2)) : (e.textAlign = "left", e.fillText(le, k + 8, W + s / 2)), e.shadowBlur = 0, e.restore(), f === n.selectedRow && M === n.selectedCol && (e.strokeStyle = g.accent, e.lineWidth = 2, e.strokeRect(k + 1.5, W + 1.5, c.width - 3, s - 3)), e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + c.width - 0.5, W), e.lineTo(k + c.width - 0.5, W + s), e.stroke(), k += c.width;
    }
  }
  if (e.restore(), y.length > 0) {
    const f = v - H;
    e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, f - 0.5), e.lineTo(a, f - 0.5), e.stroke();
    for (let T = 0; T < y.length; T++) {
      const W = y[T], k = f + T * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, k, a, s);
      let M = -F;
      for (let c = 0; c < C.length; c++) {
        const B = C[c];
        if (M + B.width <= 0) {
          M += B.width;
          continue;
        }
        if (M >= a) break;
        const N = n.getCellStyle(B, W), A = N.color ?? g.text, le = N.textAlign ?? "left", ne = n.formatCell(B, W);
        e.save(), e.beginPath(), e.rect(M + 1, k, B.width - 2, s), e.clip(), e.font = `bold ${mt}px system-ui, -apple-system, sans-serif`, e.fillStyle = A, e.textBaseline = "middle", le === "right" ? (e.textAlign = "right", e.fillText(ne, M + B.width - 8, k + s / 2)) : (e.textAlign = "left", e.fillText(ne, M + 8, k + s / 2)), e.restore(), e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(M + B.width - 0.5, k), e.lineTo(M + B.width - 0.5, k + s), e.stroke(), M += B.width;
      }
      e.strokeStyle = g.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, k + s - 0.5), e.lineTo(a, k + s - 0.5), e.stroke();
    }
  }
  e.restore();
}
function qt(o, n) {
  if (o.startsWith("rgba") || o.startsWith("rgb"))
    return o.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(o.slice(1, 3), 16), a = parseInt(o.slice(3, 5), 16), v = parseInt(o.slice(5, 7), 16);
  return `rgba(${e},${a},${v},${n})`;
}
function Qe(o, n) {
  let e = 0;
  for (let a = 0; a < o; a++) e += n[a].width;
  return e;
}
function jt(o, n, e) {
  return o >= n + e - 24 && o < n + e;
}
function gt(o, n, e) {
  const a = n + e;
  return o >= a - 6 && o <= a + 1;
}
function pt(o, n, e, a, v, g, C, p, y) {
  const s = o + y;
  let h = -1, F = 0;
  for (let x = 0; x < e.length; x++) {
    if (s >= F && s < F + e[x].width) {
      h = x;
      break;
    }
    F += e[x].width;
  }
  if (n < ee) return { area: "header", colIdx: h, rowIdx: -1 };
  const z = p * v;
  if (z > 0 && n >= C - z) {
    const x = Math.floor((n - (C - z)) / v);
    return { area: "pinned", colIdx: h, rowIdx: x };
  }
  const H = n - ee + g, S = Math.floor(H / v);
  return S >= 0 && S < a ? { area: "body", colIdx: h, rowIdx: S } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Zt = ["value"], Jt = ["disabled"], Qt = ["disabled"], el = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, tl = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour

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

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, ll = 28, nl = 600, ol = /* @__PURE__ */ Pe({
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
    glow: { type: Boolean, default: !0 }
  },
  emits: ["grid-ready", "row-clicked", "cell-selected", "column-resized", "sort-changed", "filter-changed"],
  setup(o, { emit: n }) {
    const e = o, a = n, v = E(e.rowData ?? []), g = E(e.pinnedBottomRowData ?? []), C = E(""), p = E(null), y = Je({}), s = Je({}), h = Je(/* @__PURE__ */ new Set()), F = E(0), z = E(0), H = E(0), S = E(0), x = E(0), I = E(-1), i = E(null), f = E(null), T = E({ x: 0, y: ee }), W = E("");
    function k(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const M = $(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !h.has(k(l))).map((l) => {
        const r = k(l), u = { ...t, ...l };
        return { colId: r, colDef: u, width: s[r] ?? u.width ?? 100 };
      });
    }), c = $(() => {
      const t = z.value;
      if (!t) return M.value;
      const l = M.value.reduce((d, m) => d + m.width, 0);
      if (!l || l >= t) return M.value;
      const r = t / l;
      let u = 0;
      return M.value.map((d, m) => {
        const _ = m === M.value.length - 1 ? t - u : Math.max(8, Math.round(d.width * r));
        return u += _, { ...d, width: _ };
      });
    }), B = $(() => {
      const t = c.value.reduce((l, r) => l + r.width, 0);
      return Math.max(0, t - z.value);
    }), N = $(() => {
      const t = g.value.length * e.rowHeight;
      return Math.max(0, H.value - ee - t);
    }), A = $(
      () => Math.max(0, Y.value.length * e.rowHeight - N.value)
    ), le = $(
      () => Math.max(1, Math.floor(N.value / e.rowHeight))
    ), ne = $(
      () => Y.value.length === 0 ? 0 : Math.min(Y.value.length - 1, Math.floor(S.value / e.rowHeight))
    ), ke = $(
      () => Math.min(Y.value.length - 1, ne.value + le.value - 1)
    );
    function j(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function ve(t, l) {
      const r = j(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: r, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: r, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : r == null ? "" : String(r);
    }
    function Ce(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: j(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const Y = $(() => {
      F.value;
      let t = v.value;
      const l = C.value.trim().toLowerCase();
      l && (t = t.filter(
        (r) => M.value.some(
          (u) => String(j(r, u) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [r, u] of Object.entries(y)) {
        if (!u) continue;
        const d = M.value.find((m) => m.colId === r);
        if (d)
          if (u.startsWith("__eq__")) {
            const m = u.slice(6).toLowerCase();
            t = t.filter((L) => String(j(L, d) ?? "").toLowerCase() === m);
          } else {
            const m = u.toLowerCase();
            t = t.filter((L) => String(j(L, d) ?? "").toLowerCase().includes(m));
          }
      }
      if (p.value) {
        const { colId: r, dir: u } = p.value, d = M.value.find((m) => m.colId === r);
        d && (t = [...t].sort((m, L) => {
          const _ = j(m, d), q = j(L, d);
          let Q = 0;
          return d.colDef.comparator ? Q = d.colDef.comparator(_, q) : typeof _ == "number" && typeof q == "number" ? Q = _ - q : Q = String(_ ?? "").localeCompare(String(q ?? ""), void 0, { numeric: !0 }), u === "asc" ? Q : -Q;
        }));
      }
      return t;
    });
    K(Y, () => {
      S.value = 0, i.value = null;
    }), K(B, () => {
      x.value = Math.min(x.value, B.value);
    }), K(A, () => {
      S.value = Math.min(S.value, A.value);
    });
    function Te(t) {
      const l = t * e.rowHeight, r = l + e.rowHeight;
      l < S.value ? S.value = l : r > S.value + N.value && (S.value = Math.min(A.value, r - N.value));
    }
    function Re() {
      S.value = Math.max(0, S.value - N.value), ie();
    }
    function b() {
      S.value = Math.min(A.value, S.value + N.value), ie();
    }
    let R = !1, V = "", Z = 0, se = 0, ce = !1, X = !1, xe = 0, Se = 0, De = 0, ze = 0, w = !1;
    function D(t, l) {
      var r;
      R = !0, V = t, Z = l, se = ((r = c.value.find((u) => u.colId === t)) == null ? void 0 : r.width) ?? 100, ce = !1;
    }
    function J(t) {
      if (X) {
        const m = xe - t.clientX, L = Se - t.clientY;
        (Math.abs(m) > 4 || Math.abs(L) > 4) && (w = !0), x.value = Math.max(0, Math.min(B.value, De + m)), S.value = Math.max(0, Math.min(A.value, ze + L)), ie();
        return;
      }
      if (!R) return;
      const l = z.value, r = Math.max(30, se + (t.clientX - Z)), u = M.value.filter((m) => m.colId !== V).reduce((m, L) => m + L.width, 0), d = l - r;
      d > 10 && (s[V] = Math.max(10, Math.round(r * u / d))), ie();
    }
    function be() {
      X && (w && (ce = !0), X = !1), R && (R = !1, ce = !0, a("column-resized"));
    }
    const fe = E(null), U = E(null), Lt = lt("cathodeResetTick", E(0));
    K(Lt, () => _e());
    let G = null, Me = !1, Ge, at, we, ue, re;
    function rt() {
      if (!(!U.value || !fe.value)) {
        re = document.createElement("canvas");
        try {
          G = new P.WebGLRenderer({ canvas: U.value, antialias: !1, alpha: !0 });
        } catch {
          Me = !0;
        }
        if (!Me && !G.getContext() && (G.dispose(), G = null, Me = !0), Me) {
          Ee();
          return;
        }
        G.setPixelRatio(1), G.setClearColor(0, 0), Ge = new P.Scene(), at = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), ue = new P.CanvasTexture(re), ue.minFilter = P.LinearFilter, ue.magFilter = P.LinearFilter, we = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: ue },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new P.Color(0) }
          },
          vertexShader: el,
          fragmentShader: tl,
          transparent: !0
        }), Ge.add(new P.Mesh(new P.PlaneGeometry(2, 2), we)), Ee();
      }
    }
    function Ee() {
      if (!fe.value || !G && !Me) return;
      const t = fe.value.clientWidth, l = fe.value.clientHeight - (e.pagination ? ll : 0);
      if (!t || !l) return;
      const r = re.width !== t || re.height !== l;
      re.width = t, re.height = l, z.value = t, H.value = l, x.value = Math.max(0, Math.min(B.value, x.value)), S.value = Math.max(0, Math.min(A.value, S.value)), G ? (r && ue && (ue.dispose(), ue = new P.CanvasTexture(re), ue.minFilter = P.LinearFilter, ue.magFilter = P.LinearFilter, we && (we.uniforms.uTex.value = ue)), G.setPixelRatio(window.devicePixelRatio || 1), G.setSize(t, l)) : U.value && (U.value.width = t, U.value.height = l, U.value.style.width = t + "px", U.value.style.height = l + "px"), ie();
    }
    function ie() {
      var r, u, d, m, L, _, q, Q;
      if (!(re != null && re.width)) return;
      if (Me) {
        if (!U.value) return;
        ht(re, {
          cols: c.value,
          rows: Y.value,
          pinnedRows: g.value,
          rowHeight: e.rowHeight,
          scrollY: S.value,
          scrollX: x.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((r = p.value) == null ? void 0 : r.colId) ?? null,
          sortDir: ((u = p.value) == null ? void 0 : u.dir) ?? null,
          colFilters: y,
          hoveredRow: I.value,
          selectedRow: ((d = i.value) == null ? void 0 : d.row) ?? -1,
          selectedCol: ((m = i.value) == null ? void 0 : m.col) ?? -1,
          formatCell: ve,
          getCellStyle: Ce
        });
        const vt = U.value.getContext("2d");
        vt && vt.drawImage(re, 0, 0);
        return;
      }
      if (!G || !we || !ue) return;
      const t = He[e.theme] ?? He.none, l = e.theme === "paper";
      we.uniforms.uStrength.value = e.curvature / 45 * 0.55, we.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, we.uniforms.uVignette.value = l ? 0 : 1, we.uniforms.uBezel.value.set(t.bg), ht(re, {
        cols: c.value,
        rows: Y.value,
        pinnedRows: g.value,
        rowHeight: e.rowHeight,
        scrollY: S.value,
        scrollX: x.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((L = p.value) == null ? void 0 : L.colId) ?? null,
        sortDir: ((_ = p.value) == null ? void 0 : _.dir) ?? null,
        colFilters: y,
        hoveredRow: I.value,
        selectedRow: ((q = i.value) == null ? void 0 : q.row) ?? -1,
        selectedCol: ((Q = i.value) == null ? void 0 : Q.col) ?? -1,
        formatCell: ve,
        getCellStyle: Ce
      }), ue.needsUpdate = !0, G.render(Ge, at);
    }
    function qe(t) {
      if (!U.value) return [-1, -1];
      const l = U.value.getBoundingClientRect();
      return [t.clientX - l.left, t.clientY - l.top];
    }
    let je = 0;
    function It(t) {
      f.value = null;
      const l = Date.now();
      if (t.deltaX !== 0) {
        je = l, x.value = Math.max(0, Math.min(B.value, x.value + t.deltaX)), ie();
        return;
      }
      if (t.shiftKey && t.deltaY !== 0) {
        je = l, x.value = Math.max(0, Math.min(B.value, x.value + t.deltaY)), ie();
        return;
      }
      l - je < nl || (S.value = Math.max(0, Math.min(A.value, S.value + t.deltaY)), ie());
    }
    function kt(t) {
      if (R) return;
      const [l, r] = qe(t);
      if (l < 0) {
        I.value = -1, ie();
        return;
      }
      const u = pt(
        l,
        r,
        c.value,
        Y.value.length,
        e.rowHeight,
        S.value,
        re.height,
        g.value.length,
        x.value
      );
      if (I.value = u.area === "body" ? u.rowIdx : -1, u.area === "header" && u.colIdx >= 0) {
        const d = c.value[u.colIdx], m = Qe(u.colIdx, c.value), L = l + x.value;
        U.value.style.cursor = d && gt(L, m, d.width) ? "col-resize" : "pointer";
      } else u.area === "body" ? U.value.style.cursor = "pointer" : U.value.style.cursor = "default";
      ie();
    }
    function Tt() {
      I.value = -1, ie();
    }
    function Rt(t) {
      const [l, r] = qe(t);
      if (l < 0) return;
      if (r >= ee) {
        X = !0, w = !1, xe = t.clientX, Se = t.clientY, De = x.value, ze = S.value;
        return;
      }
      const u = l + x.value;
      for (let d = 0; d < c.value.length; d++) {
        const m = c.value[d], L = Qe(d, c.value);
        if (m.colDef.resizable !== !1 && gt(u, L, m.width)) {
          D(m.colId, t.clientX);
          return;
        }
      }
    }
    function Dt(t) {
      var d, m, L;
      if (ce) {
        ce = !1;
        return;
      }
      if (R) return;
      const [l, r] = qe(t);
      if (l < 0) {
        f.value = null;
        return;
      }
      const u = pt(
        l,
        r,
        c.value,
        Y.value.length,
        e.rowHeight,
        S.value,
        re.height,
        g.value.length,
        x.value
      );
      if (u.area === "header" && u.colIdx >= 0) {
        const _ = c.value[u.colIdx], q = Qe(u.colIdx, c.value), Q = l + x.value;
        _.colDef.filter && jt(Q, q, _.width) ? (t.stopPropagation(), f.value === _.colId ? f.value = null : (f.value = _.colId, W.value = (d = y[_.colId]) != null && d.startsWith("__eq__") ? y[_.colId].slice(6) : y[_.colId] ?? "", T.value = { x: Math.max(0, q - x.value), y: ee })) : _.colDef.sortable !== !1 && (f.value = null, p.value = ((m = p.value) == null ? void 0 : m.colId) === _.colId ? p.value.dir === "asc" ? { colId: _.colId, dir: "desc" } : null : { colId: _.colId, dir: "asc" }, a("sort-changed"));
        return;
      }
      if (f.value = null, u.area === "body" && u.rowIdx >= 0 && u.colIdx >= 0) {
        const _ = u.rowIdx;
        i.value = { row: _, col: u.colIdx }, (L = U.value) == null || L.focus();
        const q = Y.value[_], Q = c.value[u.colIdx];
        q && Q && (a("row-clicked", { data: q, event: t }), a("cell-selected", { data: q, row: _, col: u.colIdx, colId: Q.colId }));
      }
    }
    function it(t) {
      var l, r;
      f.value && ((r = (l = t.target).closest) != null && r.call(l, ".cathode-filter-popup") || (f.value = null));
    }
    function zt(t) {
      var d;
      if (!z.value) return;
      let l = 0;
      for (let m = 0; m < t; m++) l += c.value[m].width;
      const r = ((d = c.value[t]) == null ? void 0 : d.width) ?? 0, u = l - x.value;
      u < 0 ? x.value = Math.max(0, l) : u + r > z.value && (x.value = Math.min(B.value, l + r - z.value));
    }
    function Et(t) {
      var _;
      const l = c.value, r = l.length - 1, u = Y.value.length - 1;
      if (!i.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), i.value = { row: ne.value, col: 0 });
        return;
      }
      let { row: d, col: m } = i.value;
      const L = (q, Q) => {
        d = Math.max(0, Math.min(u, q)), m = Math.max(0, Math.min(r, Q)), i.value = { row: d, col: m }, Te(d), zt(m);
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), L(d + 1, m);
          break;
        case "ArrowUp":
          t.preventDefault(), L(d - 1, m);
          break;
        case "ArrowRight":
          t.preventDefault(), m < r ? L(d, m + 1) : L(d + 1, 0);
          break;
        case "ArrowLeft":
          t.preventDefault(), m > 0 ? L(d, m - 1) : L(d - 1, r);
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? m > 0 ? L(d, m - 1) : L(d - 1, r) : m < r ? L(d, m + 1) : L(d + 1, 0);
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? L(d - 1, m) : L(d + 1, m);
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? L(0, 0) : L(d, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? L(u, r) : L(d, r);
          break;
        case "PageDown":
          t.preventDefault(), L(Math.min(u, d + le.value), m);
          break;
        case "PageUp":
          t.preventDefault(), L(Math.max(0, d - le.value), m);
          break;
        case "Escape":
          i.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const q = Y.value[d], Q = l[m];
            q && Q && ((_ = navigator.clipboard) == null || _.writeText(ve(Q, q)).catch(() => {
            }));
          }
          break;
      }
    }
    function _t(t) {
      const l = t.target.value;
      W.value = l, l ? y[f.value] = l : delete y[f.value], a("filter-changed");
    }
    function st() {
      f.value && delete y[f.value], W.value = "", f.value = null, a("filter-changed");
    }
    const Ft = {
      setGridOption(t, l) {
        t === "rowData" ? v.value = l : t === "pinnedBottomRowData" ? g.value = l : t === "quickFilterText" && (C.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var r, u;
          const l = k(t);
          return {
            colId: l,
            hide: h.has(l),
            sort: ((r = p.value) == null ? void 0 : r.colId) === l ? p.value.dir : null,
            sortIndex: ((u = p.value) == null ? void 0 : u.colId) === l ? 0 : null,
            width: s[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && h.add(l.colId), l.hide === !1 && h.delete(l.colId), l.sort && (p.value = { colId: l.colId, dir: l.sort }), l.width && (s[l.colId] = l.width);
      },
      setFilterModel(t) {
        for (const l of Object.keys(y)) delete y[l];
        if (t)
          for (const [l, r] of Object.entries(t))
            (r == null ? void 0 : r.type) === "equals" ? y[l] = `__eq__${r.filter}` : r != null && r.filter && (y[l] = r.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, r] of Object.entries(y))
          r && (t[l] = r.startsWith("__eq__") ? { type: "equals", filter: r.slice(6) } : { type: "contains", filter: r });
        return t;
      },
      async setColumnFilterModel(t, l) {
        l ? l.type === "equals" ? y[t] = `__eq__${l.filter}` : y[t] = l.filter ?? "" : delete y[t];
      },
      onFilterChanged() {
      },
      refreshCells() {
        F.value++;
      },
      exportDataAsCsv({ fileName: t = "export.csv" } = {}) {
        const l = M.value, r = l.map((L) => L.colDef.headerName ?? L.colId).join(","), u = Y.value.map(
          (L) => l.map((_) => `"${String(ve(_, L)).replace(/"/g, '""')}"`).join(",")
        ), d = new Blob([[r, ...u].join(`
`)], { type: "text/csv" }), m = URL.createObjectURL(d);
        Object.assign(document.createElement("a"), { href: m, download: t }).click(), URL.revokeObjectURL(m);
      },
      resize() {
        Ee();
      },
      resetColumnState() {
        h.clear();
        for (const l of e.columnDefs)
          l.hide && h.add(k(l));
        const t = e.columnDefs.find((l) => l.sort);
        p.value = t ? { colId: k(t), dir: t.sort } : null;
        for (const l of Object.keys(s)) delete s[l];
        for (const l of Object.keys(y)) delete y[l];
        C.value = "", S.value = 0, i.value = null, f.value = null;
      }
    };
    K(
      [Y, () => g.value, c, S, I, i],
      () => ye(ie)
    ), K(() => e.theme, () => ie()), K(() => e.curvature, () => ye(Ee)), K(() => e.scanlines, () => ie()), K(() => e.glow, () => ie()), K(i, (t) => {
      if (!t) return;
      const l = Y.value[t.row], r = c.value[t.col];
      l && r && a("cell-selected", { data: l, row: t.row, col: t.col, colId: r.colId });
    });
    let $e = null, Be = null, Ze = 0;
    function _e() {
      cancelAnimationFrame(Ze), Ze = requestAnimationFrame(Ee);
    }
    function ct(t) {
      t.preventDefault();
    }
    function ut() {
      G == null || G.dispose(), G = null, Me = !1, rt();
    }
    Ae(() => {
      for (const t of e.columnDefs)
        t.hide && h.add(k(t)), t.sort && !p.value && (p.value = { colId: k(t), dir: t.sort });
      v.value = e.rowData ?? [], g.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", it), document.addEventListener("mousemove", J), document.addEventListener("mouseup", be), ye(() => {
        var t;
        rt(), U.value && (U.value.addEventListener("webglcontextlost", ct), U.value.addEventListener("webglcontextrestored", ut)), fe.value && ($e = new ResizeObserver(() => Ee()), $e.observe(fe.value), Be = new IntersectionObserver((l) => {
          l.some((r) => r.isIntersecting) && _e();
        }), Be.observe(fe.value)), window.addEventListener("resize", _e), (t = window.visualViewport) == null || t.addEventListener("resize", _e), a("grid-ready", { api: Ft });
      });
    }), Ke(() => {
      var t, l, r;
      document.removeEventListener("click", it, !0), document.removeEventListener("mousemove", J), document.removeEventListener("mouseup", be), (t = U.value) == null || t.removeEventListener("webglcontextlost", ct), (l = U.value) == null || l.removeEventListener("webglcontextrestored", ut), $e == null || $e.disconnect(), Be == null || Be.disconnect(), window.removeEventListener("resize", _e), (r = window.visualViewport) == null || r.removeEventListener("resize", _e), cancelAnimationFrame(Ze), G == null || G.dispose();
    });
    const de = $(() => He[e.theme] ?? He.none), Ht = $(() => ({
      position: "absolute",
      left: `${T.value.x}px`,
      top: `${T.value.y}px`,
      zIndex: 100,
      background: de.value.headerBg,
      border: `1px solid ${de.value.accent}`,
      color: de.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Wt = $(() => ({
      background: de.value.bg,
      border: `1px solid ${de.value.border}`,
      color: de.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), $t = $(() => ({
      background: de.value.headerBg,
      borderTop: `1px solid ${de.value.border}`,
      color: de.value.text
    })), Bt = $(() => ({
      background: de.value.bg
    })), dt = $(() => de.value.accent);
    return (t, l) => {
      var r, u;
      return oe(), ae("div", {
        ref_key: "wrapEl",
        ref: fe,
        class: "cathode-wrap",
        style: he(Bt.value)
      }, [
        O("canvas", {
          ref_key: "canvasEl",
          ref: U,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Le(It, ["prevent"]),
          onMousemove: kt,
          onMouseleave: Tt,
          onMousedown: Rt,
          onClick: Dt,
          onKeydown: Et
        }, null, 544),
        f.value ? (oe(), ae("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: he(Ht.value),
          onClick: l[0] || (l[0] = Le(() => {
          }, ["stop"]))
        }, [
          O("input", {
            style: he(Wt.value),
            value: W.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: _t,
            onKeydown: At(st, ["escape"])
          }, null, 44, Zt),
          W.value ? (oe(), ae("button", {
            key: 0,
            style: he({
              background: "none",
              border: "none",
              color: de.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: st
          }, "✕", 4)) : pe("", !0)
        ], 4)) : pe("", !0),
        o.pagination ? (oe(), ae("div", {
          key: 1,
          class: "cathode-pagination",
          style: he($t.value)
        }, [
          O("button", {
            disabled: S.value <= 0,
            onClick: l[1] || (l[1] = (d) => Re())
          }, "◀", 8, Jt),
          O("span", null, ge((ne.value + 1).toLocaleString()) + "–" + ge(Math.min(Y.value.length, ke.value + 1).toLocaleString()) + " / " + ge(Y.value.length.toLocaleString()), 1),
          O("button", {
            disabled: S.value >= A.value,
            onClick: l[2] || (l[2] = (d) => b())
          }, "▶", 8, Qt),
          O("span", {
            class: "cathode-page-info",
            style: he({ color: dt.value })
          }, ge(Y.value.length.toLocaleString()) + " rows ", 5),
          i.value ? (oe(), ae("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: he({ color: dt.value })
          }, ge(((r = c.value[i.value.col]) == null ? void 0 : r.colDef.headerName) ?? ((u = c.value[i.value.col]) == null ? void 0 : u.colId)) + " : " + ge(ve(c.value[i.value.col], Y.value[i.value.row])), 5)) : pe("", !0)
        ], 4)) : pe("", !0)
      ], 4);
    };
  }
}), Oe = (o, n) => {
  const e = o.__vccOpts || o;
  for (const [a, v] of n)
    e[a] = v;
  return e;
}, Al = /* @__PURE__ */ Oe(ol, [["__scopeId", "data-v-07901c91"]]), Xe = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid's `none` theme.
    bg: "rgba(0,0,0,0)",
    text: "#e8f2ff",
    border: "#2a3a50",
    accent: "#40a0f0",
    rowAlt: "rgba(255,255,255,0.018)",
    levelInfo: "#c0d0e0",
    levelWarn: "#f0c878",
    levelError: "#f38080",
    levelDebug: "#7090a8",
    levelSuccess: "#80d0a0",
    timestamp: "#6a90b8"
  },
  paper: {
    // bg fully transparent for day-mode glass propagation.
    bg: "rgba(0,0,0,0)",
    text: "#222222",
    border: "#dee2e6",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)",
    levelInfo: "#444444",
    levelWarn: "#a06000",
    levelError: "#c0392b",
    levelDebug: "#888888",
    levelSuccess: "#1a8038",
    timestamp: "#888888"
  },
  phosphor: {
    bg: "#060d06",
    text: "#33ff33",
    border: "#0a250a",
    accent: "#80ff80",
    rowAlt: "rgba(51,255,51,0.025)",
    levelInfo: "#33ff33",
    levelWarn: "#bbff33",
    levelError: "#ff5050",
    levelDebug: "#22aa22",
    levelSuccess: "#00ff80",
    timestamp: "#00cc00"
  },
  amber: {
    bg: "#0a0700",
    text: "#ffb000",
    border: "#2a1500",
    accent: "#ffd060",
    rowAlt: "rgba(255,176,0,0.025)",
    levelInfo: "#ffb000",
    levelWarn: "#ffd000",
    levelError: "#ff5000",
    levelDebug: "#aa7000",
    levelSuccess: "#ffe040",
    timestamp: "#ffd000"
  }
};
function al(o, n) {
  switch (n) {
    case "warn":
      return o.levelWarn;
    case "error":
      return o.levelError;
    case "debug":
      return o.levelDebug;
    case "success":
      return o.levelSuccess;
    case "info":
    default:
      return o.levelInfo;
  }
}
const rl = 12, me = 18, Ye = 10, We = 6, nt = `${rl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function il(o, n, e) {
  if (e <= 0 || !n) return [n];
  const a = [];
  for (const v of n.split(`
`)) {
    if (!v) {
      a.push("");
      continue;
    }
    if (o.measureText(v).width <= e) {
      a.push(v);
      continue;
    }
    const g = v.split(/(\s+)/);
    let C = "";
    for (const p of g) {
      const y = C + p;
      if (o.measureText(y).width <= e)
        C = y;
      else if (C && (a.push(C.replace(/\s+$/, "")), C = ""), o.measureText(p).width > e) {
        let s = "";
        for (const h of p)
          o.measureText(s + h).width > e ? (s && a.push(s), s = h) : s += h;
        C = s;
      } else
        C = p.replace(/^\s+/, "");
    }
    C && a.push(C.replace(/\s+$/, ""));
  }
  return a.length ? a : [""];
}
function Ct(o) {
  if (typeof o == "number") {
    const n = new Date(o), e = String(n.getHours()).padStart(2, "0"), a = String(n.getMinutes()).padStart(2, "0"), v = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${a}:${v}`;
  }
  return o;
}
function sl(o, n) {
  return Math.ceil(o.measureText(n).width) + 12;
}
function cl(o) {
  const { entries: n, ctx: e, textMaxWidth: a, showTimestamps: v, wordWrap: g } = o, C = o.formatTs ?? Ct;
  e.font = nt;
  const p = [];
  for (let y = 0; y < n.length; y++) {
    const s = n[y], h = s.level ?? "info", F = v && s.ts != null ? C(s.ts) : "", z = g ? il(e, s.text, a) : s.text.split(`
`);
    for (let H = 0; H < z.length; H++)
      p.push({
        entryIdx: y,
        text: z[H],
        level: h,
        timestamp: H === 0 ? F : "",
        isFirstFrag: H === 0
      });
  }
  return p;
}
function wt(o, n) {
  const e = o.getContext("2d");
  if (!e) return;
  const a = o.width, v = o.height, g = Xe[n.theme] ?? Xe.none;
  e.clearRect(0, 0, a, v), e.fillStyle = g.bg, e.fillRect(0, 0, a, v), e.save(), e.beginPath(), e.rect(0, 0, a, v), e.clip(), e.font = nt, e.textBaseline = "middle";
  const C = n.visualLines, p = Ye, y = n.showTimestamps ? Ye + n.timestampWidth : Ye, s = Math.max(0, Math.floor((n.scrollY - We) / me)), h = Math.min(C.length, Math.ceil((n.scrollY + v - We) / me) + 1);
  for (let F = s; F < h; F++) {
    const z = C[F], H = We + F * me - n.scrollY + me / 2;
    if (z.entryIdx % 2 === 1 && z.isFirstFrag) {
      e.fillStyle = g.rowAlt;
      let x = 1;
      for (; F + x < h && C[F + x].entryIdx === z.entryIdx; ) x++;
      e.fillRect(0, H - me / 2, a, me * x);
    }
    F === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, H - me / 2, a, me)), n.showTimestamps && z.timestamp && (e.fillStyle = g.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 3, e.shadowColor = g.timestamp), e.fillText(z.timestamp, p, H), e.shadowBlur = 0);
    const S = al(g, z.level);
    e.fillStyle = S, e.textAlign = "left", n.glow && (e.shadowBlur = 4, e.shadowColor = S), e.fillText(z.text, y, H), e.shadowBlur = 0;
  }
  e.restore();
}
function ul(o, n, e) {
  if (o < 0) return -1;
  const a = Math.floor((o + n - We) / me);
  return a < 0 || a >= e ? -1 : a;
}
function dl(o) {
  return We * 2 + o * me;
}
const vl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, fl = `
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

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, ml = /* @__PURE__ */ Pe({
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
    maxLines: { default: 0 }
  },
  setup(o, { expose: n }) {
    const e = o, a = E(null), v = E(null), g = E(0), C = E(0), p = E(0), y = E(-1), s = E(!0), h = $(() => {
      const w = e.entries ?? [];
      return e.maxLines > 0 && w.length > e.maxLines ? w.slice(w.length - e.maxLines) : w;
    }), F = $(() => {
      if (!e.showTimestamps) return "";
      const w = e.formatTs ?? Ct;
      let D = "00:00:00";
      for (const J of h.value) {
        if (J.ts == null) continue;
        const be = w(J.ts);
        be.length > D.length && (D = be);
      }
      return D;
    }), z = E(0), H = E([]);
    function S() {
      if (!c) return;
      const w = c.getContext("2d");
      if (!w) return;
      w.font = nt;
      const D = e.showTimestamps ? sl(w, F.value) : 0;
      z.value = D;
      const J = Math.max(
        1,
        g.value - Ye * 2 - D
      );
      H.value = cl({
        entries: h.value,
        ctx: w,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const x = $(() => dl(H.value.length)), I = $(() => Math.max(0, x.value - C.value));
    K(I, () => {
      s.value ? p.value = I.value : p.value = Math.min(p.value, I.value);
    }), K(
      [h, g, () => e.showTimestamps, () => e.wordWrap, F],
      () => {
        S(), ye(A);
      },
      { deep: !1 }
    );
    let i = null, f = !1, T, W, k, M, c;
    function B() {
      if (!(!v.value || !a.value)) {
        c = document.createElement("canvas");
        try {
          i = new P.WebGLRenderer({ canvas: v.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !i.getContext() && (i.dispose(), i = null, f = !0), f) {
          N();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), T = new P.Scene(), W = new P.OrthographicCamera(-1, 1, 1, -1, 0, 1), M = new P.CanvasTexture(c), M.minFilter = P.LinearFilter, M.magFilter = P.LinearFilter, k = new P.ShaderMaterial({
          uniforms: {
            uTex: { value: M },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: vl,
          fragmentShader: fl,
          transparent: !0
        }), T.add(new P.Mesh(new P.PlaneGeometry(2, 2), k)), N();
      }
    }
    function N() {
      if (!a.value || !i && !f) return;
      const w = a.value.clientWidth, D = a.value.clientHeight;
      if (!w || !D) return;
      const J = c.width !== w || c.height !== D;
      J && (c.width = w, c.height = D, g.value = w, C.value = D, S(), i ? (J && M && (M.dispose(), M = new P.CanvasTexture(c), M.minFilter = P.LinearFilter, M.magFilter = P.LinearFilter, k && (k.uniforms.uTex.value = M)), i.setPixelRatio(window.devicePixelRatio || 1), i.setSize(w, D)) : v.value && (v.value.width = w, v.value.height = D, v.value.style.width = w + "px", v.value.style.height = D + "px"), s.value && (p.value = Math.max(0, x.value - C.value)), A());
    }
    function A() {
      if (!(c != null && c.width)) return;
      if (f) {
        if (!v.value) return;
        wt(c, {
          visualLines: H.value,
          scrollY: p.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: z.value,
          hoveredLine: y.value
        });
        const D = v.value.getContext("2d");
        D && D.drawImage(c, 0, 0);
        return;
      }
      if (!i || !k || !M) return;
      const w = e.theme === "paper";
      k.uniforms.uStrength.value = e.curvature / 45 * 0.55, k.uniforms.uScanlines.value = e.scanlines && !w ? 1 : 0, k.uniforms.uVignette.value = w ? 0 : 1, wt(c, {
        visualLines: H.value,
        scrollY: p.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: z.value,
        hoveredLine: y.value
      }), M.needsUpdate = !0, i.render(T, W);
    }
    K(() => e.theme, () => A()), K(() => e.curvature, () => A()), K(() => e.scanlines, () => A()), K(() => e.glow, () => A()), K(p, () => A()), K(y, () => A());
    function le(w) {
      if (!v.value) return [-1, -1];
      const D = v.value.getBoundingClientRect();
      return [w.clientX - D.left, w.clientY - D.top];
    }
    function ne(w) {
      p.value = Math.max(0, Math.min(I.value, w)), s.value = p.value >= I.value - 4;
    }
    function ke(w) {
      ne(p.value + w.deltaY);
    }
    let j = !1, ve = 0, Ce = 0;
    function Y(w) {
      j = !0, ve = w.clientY, Ce = p.value;
    }
    function Te(w) {
      if (j) {
        const D = ve - w.clientY;
        ne(Ce + D);
      }
    }
    function Re() {
      j && (j = !1);
    }
    function b(w) {
      const [, D] = le(w);
      if (D < 0) {
        y.value = -1;
        return;
      }
      y.value = ul(D, p.value, H.value.length);
    }
    function R() {
      y.value = -1;
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, p.value = I.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(w) {
        ne(We + w * me);
      }
    });
    let V = null, Z = null, se = 0;
    const ce = lt("cathodeResetTick", E(0));
    K(ce, () => X());
    function X() {
      cancelAnimationFrame(se), se = requestAnimationFrame(N);
    }
    function xe(w) {
      w.preventDefault();
    }
    function Se() {
      i == null || i.dispose(), i = null, f = !1, B();
    }
    Ae(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", Re), ye(() => {
        var w;
        B(), v.value && (v.value.addEventListener("webglcontextlost", xe), v.value.addEventListener("webglcontextrestored", Se)), a.value && (V = new ResizeObserver(() => N()), V.observe(a.value), Z = new IntersectionObserver((D) => {
          D.some((J) => J.isIntersecting) && X();
        }), Z.observe(a.value)), window.addEventListener("resize", X), (w = window.visualViewport) == null || w.addEventListener("resize", X), p.value = I.value;
      });
    }), Ke(() => {
      var w, D, J;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", Re), (w = v.value) == null || w.removeEventListener("webglcontextlost", xe), (D = v.value) == null || D.removeEventListener("webglcontextrestored", Se), V == null || V.disconnect(), Z == null || Z.disconnect(), window.removeEventListener("resize", X), (J = window.visualViewport) == null || J.removeEventListener("resize", X), cancelAnimationFrame(se), i == null || i.dispose();
    });
    const De = $(() => Xe[e.theme] ?? Xe.none), ze = $(() => ({
      background: De.value.bg
    }));
    return (w, D) => (oe(), ae("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-log-wrap",
      style: he(ze.value)
    }, [
      O("canvas", {
        ref_key: "canvasEl",
        ref: v,
        class: "cathode-log-canvas",
        onWheel: Le(ke, ["prevent"]),
        onMousemove: b,
        onMouseleave: R,
        onMousedown: Y
      }, null, 544)
    ], 4));
  }
}), Pl = /* @__PURE__ */ Oe(ml, [["__scopeId", "data-v-d2d092f3"]]), hl = { class: "curved-frame-bezel" }, gl = /* @__PURE__ */ Pe({
  __name: "CurvedFrame",
  props: {
    theme: { default: "none" },
    curvature: { default: 0 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 }
  },
  setup(o) {
    const n = o, e = $(() => {
      switch (n.theme) {
        case "phosphor":
          return {
            "--cf-bg": "#060d06",
            "--cf-text": "#33ff33",
            "--cf-accent": "#80ff80",
            "--cf-vignette": "rgba(0, 30, 0, 0.55)",
            "--cf-scanline": "rgba(51, 255, 51, 0.06)"
          };
        case "amber":
          return {
            "--cf-bg": "#0a0700",
            "--cf-text": "#ffb000",
            "--cf-accent": "#ffd060",
            "--cf-vignette": "rgba(40, 20, 0, 0.55)",
            "--cf-scanline": "rgba(255, 176, 0, 0.05)"
          };
        case "paper":
          return {
            "--cf-bg": "#fafafa",
            "--cf-text": "#222222",
            "--cf-accent": "#158cba",
            "--cf-vignette": "rgba(0, 0, 0, 0.04)",
            "--cf-scanline": "rgba(0, 0, 0, 0.02)"
          };
        case "none":
        default:
          return {
            "--cf-bg": "transparent",
            "--cf-text": "inherit",
            "--cf-accent": "var(--accent-text, #40a0f0)",
            "--cf-vignette": "rgba(0, 0, 0, 0.35)",
            "--cf-scanline": "rgba(255, 255, 255, 0.03)"
          };
      }
    }), a = $(() => {
      if (n.curvature <= 0) return {};
      const g = n.curvature / 45 * 1.4;
      return {
        perspective: `${800 + n.curvature / 45 * 600}px`,
        transform: `rotateX(${g}deg)`
      };
    }), v = $(() => ({
      "curved-frame": !0,
      "curved-frame-scanlines": n.scanlines,
      "curved-frame-glow": n.glow,
      [`curved-frame-${n.theme}`]: !0
    }));
    return (g, C) => (oe(), ae("div", {
      class: yt(v.value),
      style: he(e.value)
    }, [
      O("div", hl, [
        O("div", {
          class: "curved-frame-content",
          style: he(a.value)
        }, [
          Ve(g.$slots, "default", {}, void 0, !0)
        ], 4)
      ])
    ], 6));
  }
}), Ol = /* @__PURE__ */ Oe(gl, [["__scopeId", "data-v-141d8eca"]]), ot = E(0), et = 28, Fe = 12;
let tt = 10, Ne = "cathode.layout", Ue = !1;
const te = E({});
function pl(o, n = "cathode.layout") {
  if (!Ue) {
    Ue = !0, Ne = n;
    try {
      const e = localStorage.getItem(Ne);
      if (e) {
        te.value = JSON.parse(e), xt();
        return;
      }
    } catch {
    }
    te.value = { ...o }, xt();
  }
}
function xt() {
  let o = 10;
  for (const n of Object.values(te.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > o && (o = n.zIndex);
  tt = o;
}
function Ie() {
  localStorage.setItem(Ne, JSON.stringify(te.value));
}
function wl(o) {
  Ue = !1, localStorage.removeItem(Ne), te.value = { ...o }, Ie(), Ue = !0, ot.value++;
}
function St(o) {
  tt++, te.value[o] && (te.value[o].zIndex = tt);
}
function xl(o, n) {
  te.value[o].visible = n, Ie();
}
function bl(o, n) {
  te.value[o].minimized = n, n && (te.value[o].maximized = !1), Ie();
}
function yl(o, n) {
  te.value[o].maximized = n, n && (te.value[o].minimized = !1, St(o)), Ie();
}
function Cl(o, n, e) {
  te.value[o].x = Math.round(n), te.value[o].y = Math.round(e), Ie();
}
function Sl(o, n, e) {
  te.value[o].w = Math.round(n), te.value[o].h = Math.round(e), Ie();
}
function Yl(o, n, e) {
  const a = Math.ceil(Math.sqrt(e.length)), v = Math.ceil(e.length / a), g = Math.floor((o - Fe * (a + 1)) / a), C = Math.floor((n - Fe * (v + 1)) / v), p = {};
  return e.forEach((y, s) => {
    const h = s % a, F = Math.floor(s / a);
    p[y] = {
      x: Fe + h * (g + Fe),
      y: Fe + F * (C + Fe),
      w: g,
      h: C,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), p;
}
function Mt() {
  return {
    containers: te,
    TITLEBAR_H: et,
    load: pl,
    save: Ie,
    reset: wl,
    bringToFront: St,
    setVisible: xl,
    setMinimized: bl,
    setMaximized: yl,
    updatePos: Cl,
    updateSize: Sl
  };
}
const Ml = { class: "ws-toolbar" }, Ll = {
  key: 0,
  class: "ws-restore-menu"
}, Il = {
  key: 0,
  class: "ws-restore-empty"
}, kl = ["onClick"], Tl = /* @__PURE__ */ Pe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(o) {
    const n = o, { containers: e, load: a, reset: v, setVisible: g } = Mt(), C = E(null);
    ft("cathodeWorkspace", C), ft("cathodeResetTick", ot), Ae(() => {
      if (!C.value) return;
      const { clientWidth: I, clientHeight: i } = C.value, f = n.initialLayout ?? {};
      a(f, n.storageKey ?? "cathode.layout");
      const T = Object.keys(e.value)[0];
      T && p(T);
    });
    function p(I) {
      var f;
      document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused"));
      const i = (f = C.value) == null ? void 0 : f.querySelector(`#cc-${I}`);
      i && i.classList.add("cc-focused");
    }
    function y() {
      !C.value || !n.initialLayout || v(n.initialLayout);
    }
    function s(I) {
      const i = I.target.closest(".cc");
      i && (document.querySelectorAll(".cc").forEach((f) => f.classList.remove("cc-focused")), i.classList.add("cc-focused"));
    }
    const h = E(!1), F = () => Object.entries(e.value).filter(([, I]) => !I.visible).map(([I]) => I);
    function z(I) {
      g(I, !0), h.value = !1;
    }
    function H(I) {
      if (!h.value) return;
      const i = I.target;
      !i.closest(".ws-restore-menu") && !i.closest(".ws-btn-restore") && (h.value = !1);
    }
    function S(I) {
      I.key === "Escape" && (h.value = !1);
    }
    Ae(() => {
      document.addEventListener("click", H), document.addEventListener("keydown", S);
    }), Ke(() => {
      document.removeEventListener("click", H), document.removeEventListener("keydown", S);
    });
    function x(I) {
      var i;
      return ((i = n.containerTitles) == null ? void 0 : i[I]) ?? I;
    }
    return (I, i) => (oe(), ae("div", {
      ref_key: "workspaceEl",
      ref: C,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      Ve(I.$slots, "default", {}, void 0, !0),
      Ve(I.$slots, "overlay", {}, void 0, !0),
      O("div", Ml, [
        o.initialLayout ? (oe(), ae("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: y
        }, " ↺ Reset Layout ")) : pe("", !0),
        i[1] || (i[1] = O("div", { class: "ws-sep" }, null, -1)),
        O("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: i[0] || (i[0] = (f) => h.value = !h.value)
        }, " ⊞ Restore Panel ")
      ]),
      Pt(Ot, { name: "menu" }, {
        default: Yt(() => [
          h.value ? (oe(), ae("div", Ll, [
            i[3] || (i[3] = O("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            F().length ? pe("", !0) : (oe(), ae("div", Il, " No closed panels ")),
            (oe(!0), ae(Vt, null, Xt(F(), (f) => (oe(), ae("div", {
              key: f,
              class: "ws-restore-item",
              onClick: (T) => z(f)
            }, [
              i[2] || (i[2] = O("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Nt(" " + ge(x(f)), 1)
            ], 8, kl))), 128))
          ])) : pe("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Vl = /* @__PURE__ */ Oe(Tl, [["__scopeId", "data-v-5838d04b"]]), Rl = ["id"], Dl = { class: "cc-title" }, zl = {
  key: 0,
  class: "cc-size-badge"
}, El = { class: "cc-controls" }, _l = ["title"], Fl = { class: "cc-body" }, Hl = 200, Wl = 80, bt = 60, $l = /* @__PURE__ */ Pe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(o) {
    const n = o, { containers: e, bringToFront: a, setVisible: v, setMinimized: g, setMaximized: C, updatePos: p, updateSize: y } = Mt(), s = lt("cathodeWorkspace", E(null)), h = $(() => e.value[n.id]), F = $(() => {
      const b = h.value, R = n.curvature ?? 0;
      if (!b) return {};
      const V = { "--curvature": R };
      return b.maximized ? { ...V, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: b.zIndex } : {
        ...V,
        left: b.x + "px",
        top: b.y + "px",
        width: b.w + "px",
        height: b.minimized ? et + "px" : b.h + "px",
        zIndex: b.zIndex,
        display: b.visible ? "flex" : "none"
      };
    });
    let z = !1, H = 0, S = 0;
    function x(b) {
      var Z;
      if (b.target.closest(".cc-btn") || h.value.maximized) return;
      a(n.id), z = !0;
      const R = (Z = s.value) == null ? void 0 : Z.querySelector(`#cc-${n.id}`);
      if (!R) return;
      const V = R.getBoundingClientRect();
      H = b.clientX - V.left, S = b.clientY - V.top, document.addEventListener("mousemove", I), document.addEventListener("mouseup", i), b.preventDefault();
    }
    function I(b) {
      var ce;
      if (!z || !s.value) return;
      const R = s.value.getBoundingClientRect(), V = ((ce = h.value) == null ? void 0 : ce.w) ?? 300;
      let Z = b.clientX - R.left - H, se = b.clientY - R.top - S;
      Z = Math.max(bt - V, Math.min(R.width - bt, Z)), se = Math.max(0, Math.min(R.height - et, se)), p(n.id, Z, se);
    }
    function i() {
      z = !1, document.removeEventListener("mousemove", I), document.removeEventListener("mouseup", i);
    }
    let f = !1, T = 0, W = 0, k = 0, M = 0;
    const c = E("");
    function B(b) {
      h.value.maximized || (a(n.id), f = !0, T = b.clientX, W = b.clientY, k = h.value.w, M = h.value.h, document.addEventListener("mousemove", N), document.addEventListener("mouseup", A), b.preventDefault(), b.stopPropagation());
    }
    function N(b) {
      if (!f) return;
      const R = Math.max(Hl, k + (b.clientX - T)), V = Math.max(Wl, M + (b.clientY - W));
      y(n.id, R, V), c.value = `${Math.round(R)}×${Math.round(V)}`;
    }
    function A() {
      f = !1, c.value = "", document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", A), le.value++;
    }
    const le = E(0);
    K(ot, () => {
      le.value++;
    }), Ke(() => {
      var b;
      document.removeEventListener("mousemove", I), document.removeEventListener("mouseup", i), document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", A), (b = ne.value) == null || b.removeEventListener("scroll", j), ve();
    });
    const ne = E(null);
    function ke(b) {
      if (n.canvas) return [];
      const R = b.children[0];
      return R ? Array.from(R.children) : [];
    }
    function j() {
      const b = ne.value, R = n.curvature ?? 0;
      if (!b) return;
      const V = ke(b);
      if (!V.length) return;
      const Z = b.clientHeight, se = Z / 2, ce = R * 38e-4;
      V.forEach((X) => {
        if (!X.dataset.origFs) {
          const fe = getComputedStyle(X);
          X.dataset.origFs = fe.fontSize, X.dataset.origLh = fe.lineHeight;
        }
        if (R === 0) {
          X.style.fontSize = "", X.style.lineHeight = "";
          return;
        }
        const xe = X.getBoundingClientRect(), Se = b.getBoundingClientRect(), De = xe.top - Se.top + xe.height / 2, ze = Math.min(1, Math.abs(De - se) / (Z / 2)), w = 1 + ce * Math.cos(ze * Math.PI / 2), D = parseFloat(X.dataset.origFs), J = X.dataset.origLh, be = J === "normal" ? D * 1.4 : parseFloat(J);
        isNaN(D) || (X.style.fontSize = `${(D * w).toFixed(2)}px`), isNaN(be) || (X.style.lineHeight = `${(be * w).toFixed(2)}px`);
      });
    }
    function ve() {
      const b = ne.value;
      b && ke(b).forEach((R) => {
        R.style.fontSize = "", R.style.lineHeight = "", delete R.dataset.origFs, delete R.dataset.origLh;
      });
    }
    K(() => n.curvature, (b) => {
      (b ?? 0) === 0 ? ve() : j();
    }), Ae(() => {
      var b;
      (b = ne.value) == null || b.addEventListener("scroll", j, { passive: !0 }), ye(j);
    });
    function Ce() {
      g(n.id, !h.value.minimized), ye(() => {
        le.value++;
      });
    }
    function Y() {
      C(n.id, !h.value.maximized), ye(() => {
        le.value++;
      });
    }
    function Te() {
      v(n.id, !1);
    }
    function Re() {
      a(n.id);
    }
    return (b, R) => h.value && h.value.visible ? (oe(), ae("div", {
      key: 0,
      id: `cc-${o.id}`,
      class: yt(["cc", { "cc-minimized": h.value.minimized, "cc-maximized": h.value.maximized, "cc-has-canvas": o.canvas }]),
      style: he(F.value),
      onMousedown: Re
    }, [
      O("div", {
        class: "cc-titlebar",
        onMousedown: x
      }, [
        R[0] || (R[0] = O("span", { class: "cc-status-dot" }, null, -1)),
        O("span", Dl, ge(o.title), 1),
        c.value ? (oe(), ae("span", zl, ge(c.value), 1)) : pe("", !0),
        O("div", El, [
          O("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Le(Ce, ["stop"])
          }, "─"),
          O("button", {
            class: "cc-btn cc-btn-max",
            title: h.value.maximized ? "Restore" : "Maximize",
            onClick: Le(Y, ["stop"])
          }, ge(h.value.maximized ? "⤡" : "⤢"), 9, _l),
          O("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Le(Te, ["stop"])
          }, "✕")
        ])
      ], 32),
      Ut(O("div", Fl, [
        O("div", {
          ref_key: "bodyEl",
          ref: ne,
          class: "cc-screen",
          onScroll: j
        }, [
          Ve(b.$slots, "default", { resizeKey: le.value }, void 0, !0),
          R[1] || (R[1] = O("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Kt, !h.value.minimized]
      ]),
      !h.value.minimized && !h.value.maximized ? (oe(), ae("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Le(B, ["stop"])
      }, null, 32)) : pe("", !0)
    ], 46, Rl)) : pe("", !0);
  }
}), Xl = /* @__PURE__ */ Oe($l, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Xl as CathodeContainer,
  Al as CathodeGrid,
  Pl as CathodeLog,
  Vl as CathodeWorkspace,
  Ol as CurvedFrame,
  Xe as LOG_THEME_COLORS,
  Yl as buildDefaultLayout,
  Mt as useCathodeLayout
};
