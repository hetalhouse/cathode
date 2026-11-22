import { type OHLCVCandle, type PriceOverlay, type TradeMarker, type CandleColors } from './CanvasCandle';
export interface CandleHost {
    redraw(): void;
}
export interface CandleModelOptions {
    candles: () => OHLCVCandle[];
    theme: () => string;
    /** px slot width per candle at zoom 1 */
    slotW: () => number;
    showVolume: () => boolean;
    volumeFraction: () => number;
    overlays?: () => PriceOverlay[] | undefined;
    markers?: () => TradeMarker[] | undefined;
    compact?: () => boolean;
    colors?: () => Partial<CandleColors> | undefined;
    host: CandleHost;
}
export interface CandlePaintOpts {
    dpr: number;
    glow: boolean;
}
export declare function useCandleModel(o: CandleModelOptions): {
    canvasW: import("vue").Ref<number, number>;
    canvasH: import("vue").Ref<number, number>;
    scrollX: import("vue").Ref<number, number>;
    zoomLevel: import("vue").Ref<number, number>;
    hover: import("vue").Ref<{
        x: number;
        y: number;
    } | null, {
        x: number;
        y: number;
    } | {
        x: number;
        y: number;
    } | null>;
    effectiveSlotW: import("vue").ComputedRef<number>;
    setViewport: (w: number, h: number) => void;
    clampScroll: (s: number) => number;
    wheel: (deltaX: number, deltaY: number, shiftKey: boolean, cx: number) => void;
    panStart: (clientX: number) => void;
    panMove: (clientX: number) => boolean;
    panEnd: () => void;
    panning: () => boolean;
    hoverAt: (cx: number, cy: number) => void;
    leave: () => void;
    keyDown: (e: KeyboardEvent) => void;
    applyZoom: (direction: 1 | -1) => void;
    paint: (canvas: HTMLCanvasElement, { dpr, glow }: CandlePaintOpts) => void;
    dispose: () => void;
};
export type CandleModel = ReturnType<typeof useCandleModel>;
