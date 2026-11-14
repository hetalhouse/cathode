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
export interface GaugeItem {
    /** chip text */
    label: string;
    /** which pole the item sits on — colours the chip's edge + its letter (`sideLetters`) */
    side?: 'left' | 'right';
    /** short trailing figure (a P&L, a count) */
    value?: string;
    /** colour of `value` */
    tone?: 'up' | 'down' | 'neutral';
}
export interface GaugeColors {
    bg: string;
    text: string;
    dim: string;
    /** the left pole (e.g. short / down) */
    left: string;
    /** the right pole (e.g. long / up) */
    right: string;
    neutral: string;
    /** chip / caption-box fill */
    surface: string;
    border: string;
}
export declare const GAUGE_THEME_COLORS: Record<string, GaugeColors>;
export interface GaugeDrawOpts {
    dpr: number;
    theme: string;
    colors?: Partial<GaugeColors>;
    glow: boolean;
    /** the needle's current (animated) position */
    shown: number;
    /** the target value — drives the readout / stance colour by sign */
    value: number;
    min: number;
    max: number;
    readout?: string;
    stance?: string;
    sub?: string;
    leftLabel: string;
    rightLabel: string;
    sideLetters: [string, string];
    caption?: string;
    note?: string;
    items: GaugeItem[];
    emptyText?: string;
}
/** Monospace font for the terminal aesthetic (same stack as CanvasLog). */
export declare const GAUGE_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
/** Draw the gauge; returns the content height (logical px) so a host can size to it. */
export declare function drawGauge(canvas: HTMLCanvasElement, o: GaugeDrawOpts): number;
