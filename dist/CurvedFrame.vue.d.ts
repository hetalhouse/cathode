import './cathode.css';
/**
 * CurvedFrame — CSS-based CRT-aesthetic shell for live HTML slot content.
 *
 * Unlike CathodeGrid / CathodeLog (which own a canvas and run a barrel
 * shader on it), CurvedFrame wraps arbitrary DOM children. Barrel
 * distortion of live HTML requires render-to-texture and kills
 * interactivity, so we approximate the look with CSS:
 *
 *   - bezel       — outer border + soft glow ring
 *   - scanlines   — `::after` repeating-linear-gradient overlay
 *   - vignette    — `::before` radial gradient
 *   - curvature   — subtle `perspective` + `rotateX` on the content layer
 *
 * All overlays use `pointer-events: none` so clicks pass through to the
 * slot content unimpeded. Drop a CathodeGrid, FleetPanel, or any DOM
 * widget inside and it stays fully interactive.
 */
type __VLS_Props = {
    /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** 0–45 curvature, applied as a small CSS perspective + rotateX. */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    glow: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
