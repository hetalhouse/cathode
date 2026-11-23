/**
 * CathodeCandleGrid (the wall of mini candle charts) on FIXED data — deterministic series, open-position frames, notes, a price line — so a test can pin its output.
 * Query: ?theme=phosphor|amber|paper|none · ?curv=<-45..45> · ?bendfield=0 · ?glow=1 · ?scan=1 · ?n=<cells> (default 14).
 */
import { createApp, h } from 'vue'
import CathodeCandleGrid from '../src/CathodeCandleGrid.vue'
import type { WallCell } from '../src/CathodeCandleGrid.vue'
import { wallCells } from './candleData'

const q = new URLSearchParams(location.search)
const N = Number(q.get('n') ?? 14)
const cells: WallCell[] = wallCells(N)
;(window as unknown as Record<string, unknown>).__wallClicks = [] as string[]

createApp({
  render: () => h(CathodeCandleGrid, {
    cells, theme: (q.get('theme') ?? 'phosphor') as 'phosphor', curvature: Number(q.get('curv') ?? 4),
    scanlines: q.get('scan') === '1', glow: q.get('glow') === '1', bendField: q.get('bendfield') !== '0',
    onCellClick: (id: string) => { ((window as unknown as Record<string, string[]>).__wallClicks).push(id) },
  }),
}).mount('#host')
