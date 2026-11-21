import type { ColDef, GridApi, ResolvedCol } from './types';
export type SortKey = {
    colId: string;
    dir: 'asc' | 'desc';
};
/** A pointer position in canvas space. cx < 0 means "outside the drawn content" (the bezel). */
export interface GridPointer {
    cx: number;
    cy: number;
    /** local canvas-px per screen-px (≥ 1) — widens the fixed-size hit zones under distortion */
    hitScale: number;
}
export interface GridEmit {
    (e: 'row-clicked', p: {
        data: any;
        event: MouseEvent;
    }): void;
    (e: 'cell-selected', p: {
        data: any;
        row: number;
        col: number;
        colId: string;
    }): void;
    (e: 'column-resized' | 'sort-changed' | 'filter-changed'): void;
}
/** Side-effects the model asks of its presenter. All optional except redraw. */
export interface GridHost {
    redraw(): void;
    /** GridApi.resize() — re-measure the presentation */
    resize?(): void;
    focusCanvas?(): void;
    focusFilterInput?(): void;
    blurFilterInput?(): void;
}
export interface GridModelOptions {
    columnDefs: () => ColDef[];
    defaultColDef?: () => Partial<ColDef> | undefined;
    rowData?: () => any[] | undefined;
    pinnedBottomRowData?: () => any[] | undefined;
    rowHeight: () => number;
    theme: () => string;
    emit: GridEmit;
    host: GridHost;
}
export interface GridPaintOpts {
    dpr: number;
    glow: boolean;
}
export declare function useGridModel(opts: GridModelOptions): {
    scrollX: import("vue").Ref<number, number>;
    scrollY: import("vue").Ref<number, number>;
    maxScrollX: import("vue").ComputedRef<number>;
    maxScrollY: import("vue").ComputedRef<number>;
    filteredRows: import("vue").ComputedRef<any[]>;
    displayCols: import("vue").ComputedRef<ResolvedCol[]>;
    resolvedCols: import("vue").ComputedRef<ResolvedCol[]>;
    aggregateRow: import("vue").ComputedRef<Record<string, string> | null>;
    rowHeights: import("vue").ComputedRef<number[] | null>;
    firstVisibleRow: import("vue").ComputedRef<number>;
    lastVisibleRow: import("vue").ComputedRef<number>;
    visibleRowCount: import("vue").ComputedRef<number>;
    selectedCell: import("vue").Ref<{
        row: number;
        col: number;
    } | null, {
        row: number;
        col: number;
    } | {
        row: number;
        col: number;
    } | null>;
    selectionAnchor: import("vue").Ref<{
        row: number;
        col: number;
    } | null, {
        row: number;
        col: number;
    } | {
        row: number;
        col: number;
    } | null>;
    hoveredRow: import("vue").Ref<number, number>;
    activeFilter: import("vue").Ref<string | null, string | null>;
    filterPopupValue: import("vue").Ref<string, string>;
    caretOn: import("vue").Ref<boolean, boolean>;
    canvasW: import("vue").Ref<number, number>;
    canvasH: import("vue").Ref<number, number>;
    screenW: import("vue").Ref<number, number>;
    screenH: import("vue").Ref<number, number>;
    sortState: import("vue").Ref<{
        colId: string;
        dir: "asc" | "desc";
    }[], SortKey[] | {
        colId: string;
        dir: "asc" | "desc";
    }[]>;
    colFilters: Record<string, string>;
    formatCell: (col: ResolvedCol, row: any) => string;
    getCellValue: (row: any, col: ResolvedCol) => any;
    hit: (cx: number, cy: number) => {
        area: "header" | "body" | "pinned" | "agg" | "none";
        colIdx: number;
        rowIdx: number;
    };
    readonly resizing: boolean;
    readonly panning: boolean;
    setViewport: (contentW: number, contentH: number, sW: number, sH: number) => void;
    pageUp: () => void;
    pageDown: () => void;
    ensureRowVisible: (absRow: number) => void;
    ensureColVisible: (colIdx: number) => void;
    wheel: (deltaX: number, deltaY: number, shiftKey: boolean) => void;
    hover: (p: GridPointer) => string | null;
    leave: () => void;
    pointerDown: (p: GridPointer, clientX: number, clientY: number) => void;
    click: (p: GridPointer, e: MouseEvent) => {
        stopPropagation: boolean;
    };
    docClick: (p: GridPointer | null) => void;
    keyDown: (e: Pick<KeyboardEvent, "key" | "shiftKey" | "ctrlKey" | "metaKey" | "preventDefault">) => void;
    panStart: (clientX: number, clientY: number) => void;
    panMove: (clientX: number, clientY: number) => void;
    panEnd: () => void;
    globalMove: (clientX: number, clientY: number) => void;
    globalUp: () => void;
    setFilterText: (val: string) => void;
    clearFilter: () => void;
    closeFilter: () => void;
    paint: (canvas: HTMLCanvasElement, { dpr, glow }: GridPaintOpts) => void;
    api: GridApi;
    init: () => void;
    dispose: () => void;
};
export type GridModel = ReturnType<typeof useGridModel>;
