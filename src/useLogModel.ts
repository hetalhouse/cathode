/**
 * useLogModel — the headless half of CathodeLog.
 *
 * Everything the log KNOWS and DOES that isn't presentation: the entries → wrapped visual lines,
 * vertical / horizontal scroll with follow-the-tail ("stuck to bottom"), hover, the Excel-style line
 * selection, keyboard navigation, copy, and the paint call that draws it into a canvas. No DOM
 * events, no renderer, no Three.js.
 *
 * Input arrives in CANVAS space — LOGICAL px on the content canvas, the space the painter draws in —
 * never as DOM events. A presenter maps its pointer to that space and calls in:
 *
 *   • CathodeLog.vue is the DOM presenter (a canvas + renderer);
 *   • a 3D stage maps a raycast hit's UV through CathodeSurface.contentPoint() (logContent()).
 *
 * `host` carries the one side-effect the model can't do itself (repaint). Reactivity is Vue's
 * (`ref` / `computed`) inside an effectScope, so a model that lives outside a component can be
 * torn down with dispose().
 */
import { ref, computed, watch, nextTick, effectScope } from 'vue'
import {
  drawLog, lineHitTest, buildVisualLines, measureTimestampWidth, defaultFormatTs, totalContentHeight,
  LINE_HEIGHT, PADDING_X, PADDING_Y, FONT,
  type LogEntry, type VisualLine,
} from './CanvasLog'

export interface LogHost {
  redraw(): void
}

export interface LogModelOptions {
  entries:         () => LogEntry[]
  theme:           () => string
  showTimestamps?: () => boolean
  formatTs?:       () => ((ts: number | string) => string) | undefined
  wordWrap?:       () => boolean
  /** ring-buffer cap on rendered entries — older ones scroll off. 0 = no cap */
  maxLines?:       () => number
  host:            LogHost
}

export interface LogPaintOpts { dpr: number; glow: boolean }

export function useLogModel(o: LogModelOptions) {
  const scope = effectScope()
  return scope.run(() => {
    const showTimestamps = () => o.showTimestamps?.() ?? true
    const wordWrap       = () => o.wordWrap?.() ?? true

    // ── Canvas dimensions (set by setViewport) ────────────────────────────────
    const canvasW = ref(0)
    const canvasH = ref(0)

    // ── Scroll / hover / selection ────────────────────────────────────────────
    const scrollY     = ref(0)
    const scrollX     = ref(0)
    const hoveredLine = ref(-1)
    /** True when the user has scrolled away from the bottom — following the tail pauses. */
    const stuckToBottom = ref(true)
    // Excel-style range: anchor = where the selection started, active = where it ends; both -1 = none.
    const selectionAnchor = ref(-1)
    const selectionActive = ref(-1)

    // ── Visual lines (wrapped) ────────────────────────────────────────────────
    // text is measured on a private canvas — measuring needs a 2D context, not the surface
    const measureCanvas: HTMLCanvasElement = document.createElement('canvas')

    const trimmedEntries = computed(() => {
      const entries = o.entries() ?? []
      const max = o.maxLines?.() ?? 0
      return max > 0 && entries.length > max ? entries.slice(entries.length - max) : entries
    })

    /** Sample timestamp that sizes the timestamp column: the longest formatted ts in the buffer. */
    const timestampSample = computed(() => {
      if (!showTimestamps()) return ''
      const fmt = o.formatTs?.() ?? defaultFormatTs
      let widest = '00:00:00'
      for (const e of trimmedEntries.value) {
        if (e.ts == null) continue
        const s = fmt(e.ts)
        if (s.length > widest.length) widest = s
      }
      return widest
    })

    const tsWidth = ref(0)
    const visualLines = ref<VisualLine[]>([])

    function recomputeVisualLines() {
      const ctx = measureCanvas.getContext('2d')
      if (!ctx) return
      ctx.font = FONT
      const wWidth = showTimestamps() ? measureTimestampWidth(ctx, timestampSample.value) : 0
      tsWidth.value = wWidth
      visualLines.value = buildVisualLines({
        entries:        trimmedEntries.value,
        ctx,
        textMaxWidth:   Math.max(1, canvasW.value - PADDING_X * 2 - wWidth),
        showTimestamps: showTimestamps(),
        formatTs:       o.formatTs?.(),
        wordWrap:       wordWrap(),
      })
    }

    const contentH   = computed(() => totalContentHeight(visualLines.value.length))
    const maxScrollY = computed(() => Math.max(0, contentH.value - canvasH.value))
    /** Widest visual line in px — clamps horizontal scroll (+ a gutter so the trailing edge isn't flush). */
    const contentW = computed(() => {
      let max = 0
      for (const l of visualLines.value) if (l.widthPx > max) max = l.widthPx
      return PADDING_X * 2 + tsWidth.value + max
    })
    const maxScrollX = computed(() => Math.max(0, contentW.value - canvasW.value))

    watch(maxScrollY, () => {
      if (stuckToBottom.value) scrollY.value = maxScrollY.value
      else scrollY.value = Math.min(scrollY.value, maxScrollY.value)
    })
    watch(maxScrollX, () => { scrollX.value = Math.min(scrollX.value, maxScrollX.value) })

    // entries / width / wrap options change → re-wrap, then repaint
    watch(
      [trimmedEntries, canvasW, showTimestamps, wordWrap, timestampSample],
      () => { recomputeVisualLines(); nextTick(() => o.host.redraw()) },
      { deep: false },
    )
    watch(scrollY,     () => o.host.redraw())
    watch(scrollX,     () => o.host.redraw())
    watch(hoveredLine, () => o.host.redraw())
    watch([selectionAnchor, selectionActive], () => o.host.redraw())

    // ── Viewport ──────────────────────────────────────────────────────────────
    /** The content canvas is `w` x `h` logical px (call again on every resize). */
    function setViewport(w: number, h: number) {
      canvasW.value = w
      canvasH.value = h
      recomputeVisualLines()
      // keep following the tail through a resize
      if (stuckToBottom.value) scrollY.value = Math.max(0, contentH.value - canvasH.value)
    }

    // ── Scrolling ─────────────────────────────────────────────────────────────
    function setScroll(y: number) {
      scrollY.value = Math.max(0, Math.min(maxScrollY.value, y))
      // within 4px of the bottom counts as stuck (handles fractional px)
      stuckToBottom.value = scrollY.value >= maxScrollY.value - 4
    }
    function setScrollX(x: number) { scrollX.value = Math.max(0, Math.min(maxScrollX.value, x)) }

    /** Shift+wheel = horizontal (matches the grid); a mostly-horizontal gesture (deltaX) too. */
    function wheel(deltaX: number, deltaY: number, shiftKey: boolean) {
      if (shiftKey) setScrollX(scrollX.value + deltaY)
      else if (Math.abs(deltaX) > Math.abs(deltaY)) setScrollX(scrollX.value + deltaX)
      else setScroll(scrollY.value + deltaY)
    }

    /** Force-scroll to the latest entry and resume following the tail. */
    function scrollToBottom() { stuckToBottom.value = true; scrollY.value = maxScrollY.value }
    /** Scroll a visual line (not an entry index) to the top. */
    function scrollToLine(li: number) { setScroll(PADDING_Y + li * LINE_HEIGHT) }

    // ── Pan-to-scroll (drag in either direction pans both axes) ───────────────
    let panActive = false, panMoved = false
    let panStartX = 0, panStartY = 0, panStartScrollX = 0, panStartScrollY = 0

    /** A press begins a pan; `clientX/Y` are any consistent screen coordinates (the pan is relative). */
    function panStart(clientX: number, clientY: number) {
      panActive = true; panMoved = false
      panStartX = clientX; panStartY = clientY
      panStartScrollX = scrollX.value; panStartScrollY = scrollY.value
    }
    /** The pointer moved while a pan is held; returns whether a pan is in progress. */
    function panMove(clientX: number, clientY: number): boolean {
      if (!panActive) return false
      const dx = panStartX - clientX, dy = panStartY - clientY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) panMoved = true
      setScrollX(panStartScrollX + dx)
      setScroll(panStartScrollY + dy)
      return true
    }
    function panEnd() {
      if (panActive) { panActive = false; if (panMoved) panMoved = false }
    }
    /** @internal true between a press and its release (a presenter that must not scroll the page under a touch asks) */
    const panning = () => panActive

    // ── Pointer ───────────────────────────────────────────────────────────────
    function hover(cy: number) {
      hoveredLine.value = cy < 0 ? -1 : lineHitTest(cy, scrollY.value, visualLines.value.length)
    }
    function leave() { hoveredLine.value = -1 }

    /** A click at `cy`: selects the line (shift extends); a click on blank space clears the selection. */
    function click(cy: number, shiftKey: boolean) {
      // a drag-pan ended at this position — not a selection click
      if (panMoved) { panMoved = false; return }
      const li = cy < 0 ? -1 : lineHitTest(cy, scrollY.value, visualLines.value.length)
      if (li < 0) { selectionAnchor.value = -1; selectionActive.value = -1; return }
      if (shiftKey && selectionAnchor.value >= 0) selectionActive.value = li
      else { selectionAnchor.value = li; selectionActive.value = li }
    }

    // ── Keyboard ──────────────────────────────────────────────────────────────
    /**
     * Move the selection by `delta` lines, scrolling the line into view. `extend` keeps the anchor
     * (shift-arrow range); otherwise anchor and active move together (a plain arrow collapses it).
     */
    function moveSelection(delta: number, extend: boolean) {
      const total = visualLines.value.length
      if (total === 0) return
      const startActive = selectionActive.value < 0 ? 0 : selectionActive.value
      const next = Math.max(0, Math.min(total - 1, startActive + delta))
      selectionActive.value = next
      if (!extend || selectionAnchor.value < 0) selectionAnchor.value = next
      // mirror to hovered so the hover highlight tracks keyboard focus too
      hoveredLine.value = next
      const lineTop = PADDING_Y + next * LINE_HEIGHT, lineBottom = lineTop + LINE_HEIGHT
      if (lineTop < scrollY.value) setScroll(lineTop)
      else if (lineBottom > scrollY.value + canvasH.value) setScroll(lineBottom - canvasH.value)
    }

    /**
     * The clipboard payload for the selection: each ENTRY's timestamp (when shown) + text, one per
     * line — wrapped fragments of one entry are joined back into a single line.
     */
    function selectionAsText(): string {
      const start = Math.min(selectionAnchor.value, selectionActive.value)
      const end   = Math.max(selectionAnchor.value, selectionActive.value)
      if (start < 0) return ''
      const lines = visualLines.value
      const seen = new Set<number>()
      const out: string[] = []
      for (let i = start; i <= end && i < lines.length; i++) {
        const l = lines[i]
        if (seen.has(l.entryIdx)) continue
        seen.add(l.entryIdx)
        let text = ''
        for (let j = 0; j < lines.length; j++) {
          if (lines[j].entryIdx === l.entryIdx) text += (text && !lines[j].isFirstFrag ? ' ' : '') + lines[j].text
        }
        out.push(l.timestamp ? `${l.timestamp}  ${text}` : text)
      }
      return out.join('\n')
    }

    async function copySelection() {
      const text = selectionAsText()
      if (!text) return
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // older browsers / non-secure contexts: a textarea + execCommand
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity  = '0'
        document.body.appendChild(ta)
        ta.select()
        try { document.execCommand('copy') } catch { /* give up silently */ }
        document.body.removeChild(ta)
      }
    }

    function keyDown(e: KeyboardEvent) {
      // Cmd/Ctrl+C — copy the selection
      if ((e.metaKey || e.ctrlKey) && (e.key === 'c' || e.key === 'C')) {
        if (selectionAnchor.value >= 0) { e.preventDefault(); void copySelection() }
        return
      }
      // Cmd/Ctrl+A — select every line
      if ((e.metaKey || e.ctrlKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        selectionAnchor.value = 0
        selectionActive.value = visualLines.value.length - 1
        return
      }
      switch (e.key) {
        case 'ArrowDown':  e.preventDefault(); moveSelection(1, e.shiftKey);  break
        case 'ArrowUp':    e.preventDefault(); moveSelection(-1, e.shiftKey); break
        case 'ArrowRight': e.preventDefault(); setScrollX(scrollX.value + LINE_HEIGHT * 2); break
        case 'ArrowLeft':  e.preventDefault(); setScrollX(scrollX.value - LINE_HEIGHT * 2); break
        case 'PageDown':   e.preventDefault(); setScroll(scrollY.value + canvasH.value); break
        case 'PageUp':     e.preventDefault(); setScroll(scrollY.value - canvasH.value); break
        case 'Home':       e.preventDefault(); setScroll(0); setScrollX(0); break
        case 'End':        e.preventDefault(); setScroll(maxScrollY.value); break
        case 'Escape':     selectionAnchor.value = -1; selectionActive.value = -1; break
      }
    }

    // ── Paint ─────────────────────────────────────────────────────────────────
    function paint(canvas: HTMLCanvasElement, { dpr, glow }: LogPaintOpts) {
      drawLog(canvas, {
        visualLines:    visualLines.value,
        scrollY:        scrollY.value,
        scrollX:        scrollX.value,
        theme:          o.theme(),
        glow,
        showTimestamps: showTimestamps(),
        timestampWidth: tsWidth.value,
        hoveredLine:    hoveredLine.value,
        selectionStart: Math.min(selectionAnchor.value, selectionActive.value),
        selectionEnd:   Math.max(selectionAnchor.value, selectionActive.value),
        dpr,
      })
    }

    function dispose() { scope.stop() }

    return {
      // state
      canvasW, canvasH, scrollY, scrollX, hoveredLine, stuckToBottom,
      selectionAnchor, selectionActive, visualLines, tsWidth, contentH, maxScrollY, maxScrollX,
      // actions
      setViewport, setScroll, setScrollX, wheel, scrollToBottom, scrollToLine,
      panStart, panMove, panEnd, panning,
      hover, leave, click, keyDown, moveSelection, selectionAsText, copySelection,
      paint, dispose,
    }
  })!
}

export type LogModel = ReturnType<typeof useLogModel>
