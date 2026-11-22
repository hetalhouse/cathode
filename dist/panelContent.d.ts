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
    dispose?(): void;
}
/** A painter-only widget (e.g. a gauge): a surface, a size, and no input. */
export declare function surfaceContent(surface: CathodeSurface, width: number, height: number, extra?: Partial<Pick<PanelContent, 'attach' | 'pointer' | 'key' | 'dispose'>>): PanelContent;
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
