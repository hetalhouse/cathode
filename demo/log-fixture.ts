/**
 * CathodeLog on FIXED data (fixed timestamps, a TZ-independent formatter, no live feed) so a test can pin its output.
 * Query: ?theme=phosphor|amber|paper|none · ?curv=<-45..45> · ?wrap=0 turns word-wrap off · ?ts=0 hides the timestamp column.
 */
import { createApp, h } from 'vue'
import CathodeLog from '../src/CathodeLog.vue'
import type { LogEntry } from '../src/CanvasLog'

const q = new URLSearchParams(location.search)
const LEVELS: NonNullable<LogEntry['level']>[] = ['info', 'info', 'success', 'warn', 'error', 'debug']
const LONG = 'A deliberately long single-line entry to exercise word-wrap. The component should split this across several visual lines without breaking the theme, and continuation lines align under the text column rather than the timestamp prefix.'
const T0 = Date.UTC(2026, 10, 22, 14, 0, 0)
export const entries: LogEntry[] = Array.from({ length: 90 }, (_, i) => ({
  ts: T0 + i * 7_000,
  level: LEVELS[i % LEVELS.length],
  text: i % 13 === 5 ? `#${i} ${LONG}` : i % 17 === 3 ? `#${i} first line\nsecond line of the same entry` : `#${i} scanner cycle ${i * 3} complete — ${i % 5} candidates passed the filter`,
}))
const pad = (n: number) => String(n).padStart(2, '0')
export const formatTs = (ts: number | string) => { const d = new Date(ts as number); return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}` }

createApp({
  render: () => h(CathodeLog, {
    entries, formatTs,
    theme: (q.get('theme') ?? 'phosphor') as 'phosphor',
    curvature: Number(q.get('curv') ?? 4),
    scanlines: false, glow: q.get('glow') === '1',
    wordWrap: q.get('wrap') !== '0',
    showTimestamps: q.get('ts') !== '0',
  }),
}).mount('#host')
