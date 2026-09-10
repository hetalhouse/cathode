import { type OHLCVCandle, type PriceOverlay, type CandleColors } from './CanvasCandle';
import './cathode.css';
export interface WallCell {
    id: string;
    title: string;
    /** tiny badge after the title (e.g. 'EQ', '₿', '🅟') */
    badge?: string;
    /** right-aligned note (e.g. '+2.4%'), in `noteColor` */
    note?: string;
    noteColor?: string;
    /** open-position state: accent frame + dot */
    open?: boolean;
    candles: OHLCVCandle[];
    overlays?: PriceOverlay[];
}
type __VLS_Props = {
    cells: WallCell[];
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** −45–45 signed bend, same scale as every cathode component. */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    magnify?: boolean;
    showVolume?: boolean;
    volumeFraction?: number;
    slotW?: number;
    colors?: Partial<CandleColors>;
    /** Bend buys field-of-view: more cells slide in as the wall bends (default true). */
    bendField?: boolean;
    /** Minimum cell width (px) — column count = floor(contentW / minCellW). */
    minCellW?: number;
    /** Chart height as a fraction of cell width. */
    cellAspect?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "cell-click": (id: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onCell-click"?: ((id: string) => any) | undefined;
}>, {
    glow: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    magnify: boolean;
    bendField: boolean;
    showVolume: boolean;
    volumeFraction: number;
    slotW: number;
    minCellW: number;
    cellAspect: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
