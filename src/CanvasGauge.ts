/**
 * CanvasGauge.ts — canvas2d bipolar gauge renderer for cathode
 *
 * A readout (big figure + stance + sub-line), a horizontal gauge — a needle on a left↔right
 * axis — then an optional caption, note and a wrapping row of item chips, drawn to an
 * HTMLCanvasElement that the Vue wrapper feeds to the same THREE.CanvasTexture + barrel
 * shader as the other surfaces. Pure render: sizing, animation and the pipeline live in
 * CathodeGauge.vue. Draws in LOGICAL px on a backing store scaled by `dpr` (crisp on retina).
 *
 * The shape is a long/short book's net-tilt read-out — "net −1 · NET SHORT", the needle left of
 * centre, a posture line, one chip per position — but nothing here knows about trading: the
 * poles, letters and copy all come in as props.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GaugeItem {
  /** chip text */
  label: string
  /** which pole the item sits on — colours the chip's edge + its letter (`sideLetters`) */
  side?: 'left' | 'right'
  /** short trailing figure (a P&L, a count) */
  value?: string
  /** colour of `value` */
  tone?: 'up' | 'down' | 'neutral'
}

export interface GaugeColors {
  bg:      string
  text:    string
  dim:     string
  /** the left pole (e.g. short / down) */
  left:    string
  /** the right pole (e.g. long / up) */
  right:   string
  neutral: string
  /** chip / caption-box fill */
  surface: string
  border:  string
}

// Palettes mirror CanvasLog's (none = transparent so the host's glass shows through; the
// pole colours are the log's error / success tints, which hosts override via `colors`).
export const GAUGE_THEME_COLORS: Record<string, GaugeColors> = {
  none:     { bg: 'rgba(0,0,0,0)', text: '#f0f8ff', dim: '#a0b8d0', left: '#ff9a9a', right: '#a0e8c0', neutral: '#a0b8d0', surface: 'rgba(255,255,255,0.05)', border: '#2a3a50' },
  paper:    { bg: 'rgba(0,0,0,0)', text: '#222222', dim: '#888888', left: '#c0392b', right: '#1a8038', neutral: '#888888', surface: 'rgba(0,0,0,0.035)',     border: '#dee2e6' },
  phosphor: { bg: '#060d06',       text: '#80ff80', dim: '#3fbf3f', left: '#ff8080', right: '#a0ffa0', neutral: '#3fbf3f', surface: 'rgba(51,255,51,0.05)',   border: '#0a250a' },
  amber:    { bg: '#0a0700',       text: '#ffd060', dim: '#b08020', left: '#ff8a5a', right: '#ffe6a0', neutral: '#b08020', surface: 'rgba(255,176,0,0.06)',   border: '#3a2a00' },
}

export interface GaugeDrawOpts {
  dpr:         number
  theme:       string
  colors?:     Partial<GaugeColors>
  glow:        boolean
  /** the needle's current (animated) position */
  shown:       number
  /** the target value — drives the readout / stance colour by sign */
  value:       number
  min:         number
  max:         number
  readout?:    string
  stance?:     string
  sub?:        string
  leftLabel:   string
  rightLabel:  string
  sideLetters: [string, string]
  caption?:    string
  note?:       string
  items:       GaugeItem[]
  emptyText?:  string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Monospace font for the terminal aesthetic (same stack as CanvasLog). */
export const GAUGE_FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const P = 12 // padding

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(' ')) {
      const next = line ? `${line} ${word}` : word
      if (line && ctx.measureText(next).width > maxW) { out.push(line); line = word }
      else line = next
    }
    out.push(line)
  }
  return out
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y);  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h);  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr);      ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

// ── Render ────────────────────────────────────────────────────────────────────

/** Draw the gauge; returns the content height (logical px) so a host can size to it. */
export function drawGauge(canvas: HTMLCanvasElement, o: GaugeDrawOpts): number {
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  const dpr = o.dpr || 1
  const W = canvas.width / dpr
  const H = canvas.height / dpr
  const c: GaugeColors = { ...(GAUGE_THEME_COLORS[o.theme] ?? GAUGE_THEME_COLORS.none), ...(o.colors ?? {}) }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, W, H)

  const pole = (v: number) => (v > 0 ? c.right : v < 0 ? c.left : c.neutral)
  const tone = pole(o.value)
  const glowOn  = (col: string, blur = 10) => { if (o.glow) { ctx.shadowColor = col; ctx.shadowBlur = blur } }
  const glowOff = () => { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent' }
  const innerW = Math.max(40, W - P * 2)
  let y = P
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'

  // ── lead: the big figure, the stance beside it, the sub-line under the stance ──────────
  const readout = o.readout ?? `${o.value > 0 ? '+' : ''}${o.value}`
  ctx.font = `800 34px ${GAUGE_FONT}`
  const rw = ctx.measureText(readout).width
  ctx.fillStyle = tone
  glowOn(tone, 14)
  ctx.fillText(readout, P, y + 30)
  glowOff()
  const tx = P + rw + 14
  if (o.stance) {
    ctx.font = `700 14px ${GAUGE_FONT}`
    ctx.fillStyle = tone
    glowOn(tone, 8)
    ctx.fillText(o.stance.toUpperCase(), tx, y + 15)
    glowOff()
  }
  if (o.sub) {
    ctx.font = `11px ${GAUGE_FONT}`
    ctx.fillStyle = c.dim
    ctx.fillText(o.sub, tx, y + 31)
  }
  y += 48

  // ── the axis: pole labels, a graded track, the centre tick, the needle ───────────────
  ctx.font = `700 9px ${GAUGE_FONT}`
  const ll = o.leftLabel.toUpperCase(), rl = o.rightLabel.toUpperCase()
  const llw = ctx.measureText(ll).width, rlw = ctx.measureText(rl).width
  const x0 = P + llw + 8
  const x1 = W - P - rlw - 8
  const ty = y + 10 // track centre line
  ctx.fillStyle = c.left
  ctx.fillText(ll, P, ty + 3)
  ctx.fillStyle = c.right
  ctx.textAlign = 'right'
  ctx.fillText(rl, W - P, ty + 3)
  ctx.textAlign = 'left'
  if (x1 - x0 > 24) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0)
    g.addColorStop(0, c.left); g.addColorStop(0.45, c.surface); g.addColorStop(0.55, c.surface); g.addColorStop(1, c.right)
    roundRect(ctx, x0, ty - 4, x1 - x0, 8, 4)
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = g; ctx.fill(); ctx.restore()
    ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.stroke()
    // centre + quarter ticks
    const mid = (x0 + x1) / 2
    ctx.strokeStyle = c.border
    ctx.beginPath(); ctx.moveTo(mid, ty - 8); ctx.lineTo(mid, ty + 8); ctx.stroke()
    for (const q of [0.25, 0.75]) { const qx = x0 + q * (x1 - x0); ctx.beginPath(); ctx.moveTo(qx, ty - 5); ctx.lineTo(qx, ty + 5); ctx.stroke() }
    // the needle — a glowing bead on the track + a pointer above it; coloured by the side
    // it is on RIGHT NOW (the animated position), so it flips as it crosses centre
    const range = (o.max - o.min) || 1
    const t = Math.max(0, Math.min(1, (o.shown - o.min) / range))
    const nx = x0 + t * (x1 - x0)
    const ncol = pole(o.shown)
    ctx.beginPath(); ctx.moveTo(nx, ty - 10); ctx.lineTo(nx - 4.5, ty - 17); ctx.lineTo(nx + 4.5, ty - 17); ctx.closePath()
    ctx.fillStyle = ncol; ctx.fill()
    ctx.beginPath(); ctx.arc(nx, ty, 6.5, 0, Math.PI * 2)
    ctx.fillStyle = ncol
    glowOn(ncol, 12); ctx.fill(); glowOff()
    ctx.strokeStyle = c.bg === 'rgba(0,0,0,0)' ? c.border : c.bg; ctx.lineWidth = 2; ctx.stroke()
  }
  y += 30

  // ── caption (boxed; the left pole's colour when the value sits there) ─────────────────
  if (o.caption) {
    ctx.font = `600 11.5px ${GAUGE_FONT}`
    const lines = wrapLines(ctx, o.caption, innerW - 18)
    const bh = lines.length * 15 + 12
    roundRect(ctx, P, y, innerW, bh, 4)
    ctx.fillStyle = c.surface; ctx.fill()
    ctx.strokeStyle = o.value < 0 ? c.left : c.border; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = o.value < 0 ? c.left : o.value > 0 ? c.text : c.dim
    lines.forEach((l, i) => ctx.fillText(l, P + 9, y + 17 + i * 15))
    y += bh + 10
  }

  // ── note ─────────────────────────────────────────────────────────────────────────────
  if (o.note) {
    ctx.font = `10px ${GAUGE_FONT}`
    ctx.fillStyle = c.dim
    const lines = wrapLines(ctx, o.note, innerW)
    lines.forEach((l, i) => ctx.fillText(l, P, y + 10 + i * 14))
    y += lines.length * 14 + 10
  }

  // ── items as chips, wrapping ─────────────────────────────────────────────────────────
  if (!o.items.length) {
    if (o.emptyText) {
      ctx.font = `10px ${GAUGE_FONT}`
      ctx.fillStyle = c.dim
      const lines = wrapLines(ctx, o.emptyText, innerW)
      lines.forEach((l, i) => ctx.fillText(l, P, y + 10 + i * 14))
      y += lines.length * 14
    }
  } else {
    const chipH = 18, gap = 5
    let cx = P
    for (const it of o.items) {
      const edge = it.side === 'left' ? c.left : it.side === 'right' ? c.right : c.neutral
      const letter = it.side === 'left' ? o.sideLetters[0] : it.side === 'right' ? o.sideLetters[1] : ''
      ctx.font = `700 10px ${GAUGE_FONT}`; const lw = ctx.measureText(it.label).width
      ctx.font = `700 8px ${GAUGE_FONT}`;  const letw = letter ? ctx.measureText(letter).width + 6 : 0
      ctx.font = `10px ${GAUGE_FONT}`;     const vw = it.value ? ctx.measureText(it.value).width : 0
      const w = 7 + lw + (letter ? 4 + letw : 0) + (it.value ? 4 + vw : 0) + 7
      if (cx + w > W - P && cx > P) { cx = P; y += chipH + gap }
      roundRect(ctx, cx, y, w, chipH, 4)
      ctx.fillStyle = c.surface; ctx.fill()
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.stroke()
      ctx.fillStyle = edge; ctx.fillRect(cx, y + 1, 2, chipH - 2)
      let x = cx + 7
      ctx.font = `700 10px ${GAUGE_FONT}`; ctx.fillStyle = c.text; ctx.fillText(it.label, x, y + 12.5); x += lw + 4
      if (letter) { ctx.font = `700 8px ${GAUGE_FONT}`; ctx.fillStyle = edge; ctx.fillText(letter, x + 3, y + 12); x += letw + 4 }
      if (it.value) {
        ctx.font = `10px ${GAUGE_FONT}`
        ctx.fillStyle = it.tone === 'up' ? c.right : it.tone === 'down' ? c.left : c.dim
        ctx.fillText(it.value, x, y + 12.5)
      }
      cx += w + gap
    }
    y += chipH
  }

  return y + P
}
