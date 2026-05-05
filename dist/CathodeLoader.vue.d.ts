import './cathode.css';
type __VLS_Props = {
    /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** 0–45 barrel strength, same scale as the other cathode components. */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /** Centered text. Defaults to "BOOTING". A trailing ellipsis is animated separately. */
    label?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    label: string;
    glow: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
