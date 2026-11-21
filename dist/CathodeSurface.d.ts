/**
 * CathodeSurface — the headless half of a cathode widget.
 *
 * A surface owns what every widget used to build for itself: the offscreen 2D canvas the painter
 * draws into, the CanvasTexture over it, and the barrel + scanlines + vignette + magnify-lens
 * ShaderMaterial. It owns NO renderer, camera, DOM or Vue — a *presenter* supplies those:
 *
 *   • mode 'screen' — the vertex shader fills clip space (a full-screen quad under an
 *     orthographic camera). This is how the DOM widgets (CathodeGauge …) present it.
 *   • mode 'world'  — the vertex shader uses the model/view/projection matrices, so the SAME
 *     material drops onto any mesh in any THREE.Scene (see createSurfaceMesh). The texture also
 *     gets mipmaps + anisotropy, since a plane seen at an angle shimmers under plain LinearFilter.
 *
 * The painter is a callback — `(canvas, { dpr, glow }) => void` — drawing in LOGICAL px on a
 * backing store scaled by dpr (the existing Canvas*.ts functions already have this shape).
 */
import * as THREE from 'three';
import type { MouseLensUV } from './lensShader';
export type SurfaceMode = 'screen' | 'world';
export type SurfacePainter = (canvas: HTMLCanvasElement, ctx: {
    dpr: number;
    glow: boolean;
}) => void;
export interface CathodeSurfaceOptions {
    paint: SurfacePainter;
    /** 'screen' (default) = clip-space quad for a private renderer; 'world' = scene-graph mesh. */
    mode?: SurfaceMode;
    /** backing-store dpr cap (default 2) */
    maxDpr?: number;
}
export interface SurfaceLook {
    /** −45–45, same scale as every other cathode surface */
    curvature: number;
    scanlines: boolean;
    vignette: boolean;
    magnify: boolean;
}
/**
 * CPU mirror of the fragment shader's barrel(): surface UV → content UV. `strength` is
 * curvatureToStrength(curvature). Pointer routing uses this so the cursor lands on the pixel
 * actually drawn under it (the shader warps the sample position; the CPU must warp the same way).
 */
export declare function barrelUV(u: number, v: number, strength: number): {
    x: number;
    y: number;
};
/** CPU mirror of the shader's applyLens(). Returns the input UV when the lens is off. */
export declare function lensUV(u: number, v: number, mouse: MouseLensUV, magnify: boolean, canvasW: number, canvasH: number): {
    x: number;
    y: number;
};
export declare class CathodeSurface {
    readonly canvas: HTMLCanvasElement;
    readonly material: THREE.ShaderMaterial;
    readonly mode: SurfaceMode;
    /** logical (CSS px) size and backing-store dpr — set by resize() */
    dpr: number;
    logicalW: number;
    logicalH: number;
    /**
     * Visible panel size in px, when it differs from the content canvas (CathodeGrid's bend-field
     * gain draws a WIDER canvas than the screen it warps into). The lens is a fixed physical size
     * and circular in SCREEN px, so its radius/aspect come from this; 0 = same as the content.
     */
    screenW: number;
    screenH: number;
    private texture;
    private readonly painter;
    private readonly maxDpr;
    private look;
    private mouse;
    private anisotropy;
    constructor(opts: CathodeSurfaceOptions);
    /**
     * Max anisotropy for 'world' mode — pass renderer.capabilities.getMaxAnisotropy() once the
     * presenter has a renderer. Applies to the current and every future texture.
     */
    setAnisotropy(n: number): void;
    private makeTexture;
    /**
     * Size the backing store (logical W×H × dpr, capped). Returns false — and does nothing — when
     * nothing changed: assigning canvas.width clears it even at the same value, and ResizeObserver
     * fires spuriously. The caller redraws on true.
     */
    resize(W: number, H: number, devicePixelRatio?: number): boolean;
    /** Curvature / scanlines / vignette / lens enable. Takes effect on the next syncUniforms(). */
    setLook(look: Partial<SurfaceLook>): void;
    setScreenSize(w: number, h: number): void;
    /** Lens centre in surface UV (y up); null = lens off. */
    setLens(uv: MouseLensUV | null): void;
    /** Push look + lens state into the shader uniforms. */
    syncUniforms(): void;
    /** Run the painter into the offscreen canvas and flag the texture for upload. */
    paint(glow: boolean): void;
    /** paint() the picture WITHOUT the GL upload — for the 2D fallback presenter. */
    paintOnly(glow: boolean): void;
    /**
     * Surface UV (0..1, y up — what a raycast hit's `uv` gives) → CONTENT pixel position in the
     * painter's LOGICAL px (y down), through the same lens + barrel the shader applies. Null when
     * the point lands outside the drawn content (the barrel's transparent margin).
     */
    contentPoint(u: number, v: number): {
        x: number;
        y: number;
    } | null;
    dispose(): void;
}
