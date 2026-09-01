/**
 * CanvasGrid.ts — canvas2d grid renderer for cathode
 *
 * Draws the full grid (header + rows + pinned) to an HTMLCanvasElement.
 * The canvas is used as a THREE.CanvasTexture fed to the barrel-distortion shader.
 */
import type { CSSProperties } from 'vue';
import type { ResolvedCol } from './types';
export interface GridColors {
    bg: string;
    headerBg: string;
    text: string;
    textHeader: string;
    border: string;
    accent: string;
    rowAlt: string;
}
export declare const THEME_COLORS: Record<string, GridColors>;
export declare const HEADER_H = 30;
export declare const FONT_SIZE = 12;
export declare const LINE_H = 14;
export declare const WRAP_VPAD = 5;
/** Grid data-cell font string — the SINGLE source of truth for measurement + draw. */
export declare function gridCellFont(): string;
/**
 * Word-wrap `text` to fit `maxWidth` px at the ctx's CURRENT font. Caller must
 * set `ctx.font = gridCellFont()` first. A single word wider than maxWidth is
 * left on its own (over-long) line rather than force-broken — the cell clip
 * handles the overflow.
 */
export declare function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[];
/** Height (px) of a row whose tallest wrapped cell has `lineCount` lines. */
export declare function rowHeightFor(lineCount: number, baseRowHeight: number): number;
/**
 * Prefix-sum of row tops. `offsets[i]` = y of row i's top; `offsets[rowCount]` =
 * total content height. Only built when a grid actually has variable heights.
 */
export declare function buildRowOffsets(rowHeights: number[], rowCount: number): number[];
/** Largest row index `i` with `offsets[i] <= y` (the row containing y). Clamped ≥ 0. */
export declare function rowAtOffset(offsets: number[], y: number): number;
export interface DrawGridOpts {
    cols: ResolvedCol[];
    rows: any[];
    pinnedRows: any[];
    rowHeight: number;
    /**
     * Optional per-row heights (parallel to `rows`) for variable-height rows —
     * supplied only when a column has `wrap: true`. When omitted, every data row
     * is `rowHeight` tall (the original uniform behaviour, byte-identical). Pinned
     * and aggregate rows always use the uniform `rowHeight`.
     */
    rowHeights?: number[];
    scrollY: number;
    scrollX: number;
    theme: string;
    glow: boolean;
    sortColId: string | null;
    sortDir: 'asc' | 'desc' | null;
    colFilters: Record<string, string>;
    hoveredRow: number;
    selectedRow: number;
    selectedCol: number;
    /**
     * Anchor of the selection range. The selection rectangle spans from
     * (selectionAnchorRow, selectionAnchorCol) to (selectedRow, selectedCol).
     * When the anchor equals the active cell (or is -1), selection is a
     * single cell. Excel-style: shift-arrow / shift-click moves only the
     * active cell, leaving the anchor in place.
     */
    selectionAnchorRow?: number;
    selectionAnchorCol?: number;
    formatCell: (col: ResolvedCol, row: any) => string;
    getCellStyle: (col: ResolvedCol, row: any) => CSSProperties;
    /**
     * Optional aggregate row drawn sticky to the bottom — one cell per column
     * with the value already computed (sum/avg/etc) by the consumer. Pass
     * `null` (or omit) to skip the aggregate row entirely.
     */
    aggregateRow?: Record<string, string> | null;
}
/** Height (px) of the aggregate row when present. */
export declare const AGG_ROW_H = 28;
export type AggFunc = 'sum' | 'avg' | 'min' | 'max' | 'count' | ((v: any[]) => any);
/**
 * Apply an aggregator to a column's values across the supplied rows. Skips
 * null / undefined / non-numeric values for sum/avg/min/max; count only
 * counts rows where the value is defined.
 */
export declare function aggregate(values: any[], fn: AggFunc): any;
export declare function drawGrid(canvas: HTMLCanvasElement, opts: DrawGridOpts): void;
/**
 * Forward barrel formula — same as the GLSL shader.
 * UV: x∈[0,1] left→right, y∈[0,1] bottom→top (Three.js convention).
 */
export declare function applyBarrel(uvX: number, uvY: number, strength: number): [number, number];
/**
 * Map a screen pixel (sx, sy — y=0 at top of canvas element) to the
 * offscreen canvas2d coordinate that is visually displayed there.
 * Returns [-1,-1] when the position is in the black bezel region.
 */
export declare function screenToCanvas(sx: number, sy: number, W: number, H: number, strength: number): [number, number];
/** Canvas-space left edge of column ci (scrollX removed — always 0) */
export declare function colLeft(ci: number, cols: ResolvedCol[]): number;
/** Is canvas x over the filter icon (right 24px) of a column? */
export declare function isOnFilterIcon(cx: number, colStartX: number, colWidth: number): boolean;
/** Is canvas x over the resize handle (right 6px) of a column? */
export declare function isOnResizeHandle(cx: number, colStartX: number, colWidth: number): boolean;
/** Hit-test a canvas-space coordinate → grid location */
export declare function hitTest(cx: number, cy: number, cols: ResolvedCol[], rowCount: number, rowHeight: number, scrollY: number, canvasH: number, pinnedCount: number, scrollX: number, hasAggRow?: boolean, rowHeights?: number[]): {
    area: 'header' | 'body' | 'pinned' | 'agg' | 'none';
    colIdx: number;
    rowIdx: number;
};
