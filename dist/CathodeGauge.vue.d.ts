import type { GaugeItem, GaugeColors } from './CanvasGauge';
import './cathode.css';
type __VLS_Props = {
    /** 'none' = transparent, inherits the host (glass); built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** −45–45 bend (positive convex, negative concave), same scale as the other cathode surfaces. */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /** hover magnifier lens */
    magnify?: boolean;
    /** where the needle sits, on the [min, max] axis */
    value: number;
    min?: number;
    max?: number;
    /** the big figure; defaults to the signed `value` */
    readout?: string;
    /** headline beside the readout (e.g. "net short") */
    stance?: string;
    /** small line under the headline (e.g. "1 long · 2 short · 8 flat") */
    sub?: string;
    leftLabel?: string;
    rightLabel?: string;
    /** the letter a chip shows for each pole, e.g. ['S', 'L'] */
    sideLetters?: [string, string];
    /** boxed line under the axis (the posture) */
    caption?: string;
    /** dim paragraph under the caption */
    note?: string;
    /** one chip each, wrapping */
    items?: GaugeItem[];
    /** shown in place of the chips when `items` is empty */
    emptyText?: string;
    /** per-instance palette overrides (e.g. the host's P&L up/down colours for the poles) */
    colors?: Partial<GaugeColors>;
    /** ease the needle to each new value (and sweep in from centre on mount) */
    animate?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    min: number;
    max: number;
    glow: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    magnify: boolean;
    animate: boolean;
    leftLabel: string;
    rightLabel: string;
    sideLetters: [string, string];
    items: GaugeItem[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
