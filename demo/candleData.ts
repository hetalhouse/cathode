/** A deterministic candle series with indicator overlays and trade markers — shared by the golden fixture and the stage demo. */
import type { OHLCVCandle, PriceOverlay, TradeMarker } from '../src/CanvasCandle'

export const N = 300, STEP = 3_600_000, T0 = Date.UTC(2026, 9, 1, 0, 0, 0)

/** a deterministic random walk (an LCG, so every run draws the same chart) */
let seed = 20261122
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
export const candles: OHLCVCandle[] = []
let px = 100
for (let i = 0; i < N; i++) {
  const open = px
  const close = open * (1 + (rnd() - 0.48) * 0.02 + Math.sin(i / 17) * 0.002)
  const high = Math.max(open, close) * (1 + rnd() * 0.006)
  const low = Math.min(open, close) * (1 - rnd() * 0.006)
  candles.push({ start: T0 + i * STEP, open, high, low, close, volume: 800 + Math.round(rnd() * 2200) })
  px = close
}
const sma = (n: number) => candles.map((_, i) => i < n - 1 ? NaN : candles.slice(i - n + 1, i + 1).reduce((a, c) => a + c.close, 0) / n)
const ma = sma(20)
const sd = candles.map((_, i) => i < 19 ? NaN : Math.sqrt(candles.slice(i - 19, i + 1).reduce((a, c) => a + (c.close - ma[i]) ** 2, 0) / 20))
export const overlays: PriceOverlay[] = [
  { kind: 'band', upper: ma.map((m, i) => m + 2 * sd[i]), lower: ma.map((m, i) => m - 2 * sd[i]), middle: ma, color: '#6ee7a7' },
  { kind: 'line', data: sma(50), color: '#fbbf24', label: 'SMA50' },
  { kind: 'hline', price: candles[N - 1].close, color: '#60a5fa', label: 'last' },
]
export const markers: TradeMarker[] = [
  { timestamp: candles[N - 40].start, price: candles[N - 40].low, kind: 'entry' },
  { timestamp: candles[N - 12].start, price: candles[N - 12].high, kind: 'exit' },
  { timestamp: candles[N - 90].start, price: candles[N - 90].low, kind: 'entry', label: 'E' },
]
