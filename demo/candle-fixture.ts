/**
 * CathodeCandle on FIXED data (a deterministic series, indicator overlays, trade markers) so a test can pin its output.
 * Query: ?theme=phosphor|amber|paper|none · ?curv=<-45..45> · ?glow=1 · ?vol=0 hides the volume pane · ?compact=1 · ?flat=1 (the 2D fallback
 * pipeline) · ?slot=<px> candle slot width · ?over=0 drops the overlays and markers.
 */
import { createApp, h } from 'vue'
import CathodeCandle from '../src/CathodeCandle.vue'
import { candles, overlays, markers } from './candleData'

const q = new URLSearchParams(location.search)
createApp({
  render: () => h(CathodeCandle, {
    candles,
    theme: (q.get('theme') ?? 'phosphor') as 'phosphor',
    curvature: Number(q.get('curv') ?? 4),
    scanlines: false, glow: q.get('glow') === '1',
    showVolume: q.get('vol') !== '0',
    compact: q.get('compact') === '1',
    flat: q.get('flat') === '1',
    slotW: Number(q.get('slot') ?? 8),
    overlays: q.get('over') === '0' ? [] : overlays,
    markers: q.get('over') === '0' ? [] : markers,
  }),
}).mount('#host')
