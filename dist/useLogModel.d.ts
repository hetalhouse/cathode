import { type LogEntry, type VisualLine } from './CanvasLog';
export interface LogHost {
    redraw(): void;
}
export interface LogModelOptions {
    entries: () => LogEntry[];
    theme: () => string;
    showTimestamps?: () => boolean;
    formatTs?: () => ((ts: number | string) => string) | undefined;
    wordWrap?: () => boolean;
    /** ring-buffer cap on rendered entries — older ones scroll off. 0 = no cap */
    maxLines?: () => number;
    host: LogHost;
}
export interface LogPaintOpts {
    dpr: number;
    glow: boolean;
}
export declare function useLogModel(o: LogModelOptions): {
    canvasW: import("vue").Ref<number, number>;
    canvasH: import("vue").Ref<number, number>;
    scrollY: import("vue").Ref<number, number>;
    scrollX: import("vue").Ref<number, number>;
    hoveredLine: import("vue").Ref<number, number>;
    stuckToBottom: import("vue").Ref<boolean, boolean>;
    selectionAnchor: import("vue").Ref<number, number>;
    selectionActive: import("vue").Ref<number, number>;
    visualLines: import("vue").Ref<{
        entryIdx: number;
        text: string;
        level: import("./CanvasLog").LogLevel;
        timestamp: string;
        isFirstFrag: boolean;
        widthPx: number;
    }[], VisualLine[] | {
        entryIdx: number;
        text: string;
        level: import("./CanvasLog").LogLevel;
        timestamp: string;
        isFirstFrag: boolean;
        widthPx: number;
    }[]>;
    tsWidth: import("vue").Ref<number, number>;
    contentH: import("vue").ComputedRef<number>;
    maxScrollY: import("vue").ComputedRef<number>;
    maxScrollX: import("vue").ComputedRef<number>;
    setViewport: (w: number, h: number) => void;
    setScroll: (y: number) => void;
    setScrollX: (x: number) => void;
    wheel: (deltaX: number, deltaY: number, shiftKey: boolean) => void;
    scrollToBottom: () => void;
    scrollToLine: (li: number) => void;
    panStart: (clientX: number, clientY: number) => void;
    panMove: (clientX: number, clientY: number) => boolean;
    panEnd: () => void;
    panning: () => boolean;
    hover: (cy: number) => void;
    leave: () => void;
    click: (cy: number, shiftKey: boolean) => void;
    keyDown: (e: KeyboardEvent) => void;
    moveSelection: (delta: number, extend: boolean) => void;
    selectionAsText: () => string;
    copySelection: () => Promise<void>;
    paint: (canvas: HTMLCanvasElement, { dpr, glow }: LogPaintOpts) => void;
    dispose: () => void;
};
export type LogModel = ReturnType<typeof useLogModel>;
