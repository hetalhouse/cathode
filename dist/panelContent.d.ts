/**
 * PanelContent — what a CathodeStage3D panel shows and how it hears the pointer.
 *
 * A panel is a CathodeSurface (world mode) plus an input adapter. The stage turns a raycast into
 * a PanelPointerEvent in the surface's own LOGICAL px — the same canvas space the painter draws
 * in — and the content decides what it means. gridContent() binds a headless GridModel; any
 * painter-only widget is just surfaceContent(); gaugeContent() is a ready-made one for a gauge.
 */
import { CathodeSurface } from './CathodeSurface';
import type { GridModel, GridEmit } from './useGridModel';
import type { ColDef } from './types';
import type { LogModel } from './useLogModel';
import type { LogEntry } from './CanvasLog';
import type { CandleModel } from './useCandleModel';
import type { OHLCVCandle, PriceOverlay, TradeMarker, CandleColors } from './CanvasCandle';
import type { GaugeItem, GaugeColors, GaugeMark, GaugeMeter } from './CanvasGauge';
export type PanelPointerKind = 'move' | 'down' | 'up' | 'click' | 'leave' | 'wheel' | 'drag';
export interface PanelPointerEvent {
    kind: PanelPointerKind;
    /** content position in the surface's logical px; -1 when the pointer is over the bend's bezel */
    x: number;
    y: number;
    /** local content-px per screen-px (≥ 1): keeps fixed-size hit zones the same size ON SCREEN */
    hitScale: number;
    clientX: number;
    clientY: number;
    deltaX: number;
    deltaY: number;
    /** click count on 'click' events (1, then 2 for a double-click — as `MouseEvent.detail`); 0 for every other kind */
    detail: number;
    shiftKey: boolean;
}
export interface PanelContent {
    surface: CathodeSurface;
    /** logical px the surface is drawn at */
    width: number;
    height: number;
    /** The stage hands over a function that schedules a repaint + render. */
    attach?(invalidate: () => void): void;
    /**
     * Pointer input. 'drag' = the pointer moved while a press that began on this panel is held
     * (it may be anywhere on screen); 'up' ends it. Return a CSS cursor, or null/undefined to leave it.
     */
    pointer?(e: PanelPointerEvent): string | null | void;
    key?(e: KeyboardEvent): void;
    /**
     * The panel was resized: lay out for `width` x `height` logical px and update `this.width` / `this.height`. The stage
     * resizes the surface's backing store and repaints afterwards. A content WITHOUT this cannot be resized.
     */
    resize?(width: number, height: number): void;
    dispose?(): void;
}
/** A painter-only widget (e.g. a gauge): a surface, a size, and no input. */
export declare function surfaceContent(surface: CathodeSurface, width: number, height: number, extra?: Partial<Pick<PanelContent, 'attach' | 'pointer' | 'key' | 'resize' | 'dispose'>>): PanelContent;
export interface GridContentOptions {
    columnDefs: ColDef[];
    rowData?: any[];
    pinnedBottomRowData?: any[];
    defaultColDef?: Partial<ColDef>;
    rowHeight?: number;
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    width: number;
    height: number;
    /** grid events (row-clicked, cell-selected, sort-changed, …) */
    emit?: GridEmit;
}
/**
 * A grid for the stage: a headless GridModel + a world-mode surface, with pointer, wheel and key
 * input routed into the model. The filter popup is typed into directly (no DOM ghost input in 3D).
 * Unlike the DOM grid there is no bend-field gain here: the content canvas equals the panel.
 */
export declare function gridContent(o: GridContentOptions): PanelContent & {
    model: GridModel;
};
export interface LogContentProps {
    entries: LogEntry[];
    /** 'none' = transparent (glass); built-ins: phosphor | amber | paper */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    showTimestamps?: boolean;
    formatTs?: (ts: number | string) => string;
    /** wrap long lines to the panel width (default true) */
    wordWrap?: boolean;
    /** ring-buffer cap on rendered entries; 0 = no cap */
    maxLines?: number;
}
export interface LogContentOptions extends LogContentProps {
    width: number;
    height: number;
}
/**
 * A log for the stage: a headless LogModel + a world-mode surface, with the pointer, wheel and keys routed into the model —
 * scroll (wheel / drag-pan), follow-the-tail, hover, click / shift-click line selection, arrows / page / home / end, Cmd+A,
 * Cmd+C. `update()` swaps the entries (or any other prop): a log that was following the tail keeps following it.
 */
export declare function logContent(o: LogContentOptions): PanelContent & {
    model: LogModel;
    update(p: Partial<LogContentProps>): void;
};
export interface CandleContentProps {
    candles: OHLCVCandle[];
    /** 'none' = transparent (glass); built-ins: phosphor | amber | paper */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** px slot width per candle at zoom 1 (default 8) */
    slotW?: number;
    /** show the volume pane (default true) */
    showVolume?: boolean;
    /** 0..1, the fraction of the pane given to volume bars */
    volumeFraction?: number;
    /** indicator series drawn over the price pane (BB, EMA, SMA, hlines …) */
    overlays?: PriceOverlay[];
    /** trade entry / exit triangles */
    markers?: TradeMarker[];
    /** thumbnail mode: no time axis / interval badge, sparser price labels */
    compact?: boolean;
    /** per-instance palette overrides */
    colors?: Partial<CandleColors>;
}
export interface CandleContentOptions extends CandleContentProps {
    width: number;
    height: number;
}
/**
 * A candle chart for the stage: a headless CandleModel + a world-mode surface, with the pointer, wheel and keys routed into
 * the model — the hover crosshair + OHLCV readout, wheel zoom anchored on the candle under the cursor, shift-wheel / trackpad
 * scroll, drag-pan, ←/→ pan, ↑/↓ zoom, Home / End. `update()` swaps the data (or any other prop); a resize re-fits the chart.
 */
export declare function candleContent(o: CandleContentOptions): PanelContent & {
    model: CandleModel;
    update(p: Partial<CandleContentProps>): void;
};
export interface GaugeContentProps {
    /** 'none' = transparent (glass); built-ins: phosphor | amber | paper */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** where the needle sits, on the [min, max] axis */
    value: number;
    min?: number;
    max?: number;
    /** the big figure; defaults to the signed `value` */
    readout?: string;
    /** headline beside the readout (e.g. "net short") */
    stance?: string;
    /** small line under the headline */
    sub?: string;
    leftLabel?: string;
    rightLabel?: string;
    /** the letter a chip shows for each pole, e.g. ['S', 'L'] */
    sideLetters?: [string, string];
    /** labelled ticks on the axis */
    marks?: GaugeMark[];
    /** a secondary bar under the axis */
    meter?: GaugeMeter | null;
    caption?: string;
    note?: string;
    items?: GaugeItem[];
    emptyText?: string;
    /** per-instance palette overrides */
    colors?: Partial<GaugeColors>;
    /** ease the needle to each new value (and sweep in from centre on mount); default true */
    animate?: boolean;
}
export interface GaugeContentOptions extends GaugeContentProps {
    /** logical px the gauge is drawn at */
    width: number;
    height: number;
}
/**
 * A gauge for the stage — the same picture CathodeGauge.vue draws (a readout, a needle on a
 * left↔right axis, a caption, a note, a row of chips), as a PanelContent: the needle EASES to each new
 * value and sweeps in from centre on mount, exactly as the DOM component's does. Read-only (no input).
 * Push new data with `update()`; `shown` is the needle's current (animated) position.
 */
export declare function gaugeContent(o: GaugeContentOptions): PanelContent & {
    update(p: Partial<GaugeContentProps>): void;
    readonly shown: number;
};
