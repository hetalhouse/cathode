/**
 * DisplayMenu3D — the right-click "Display" menu, drawn IN the scene.
 *
 * A stage panel's CRT look (scan lines, glow, the hover magnifier, the screen bend) is a handful of switches; this is the menu that flips them,
 * as a small canvas-textured quad that sits on the panel's own plane, a hair in front of it, so it bends, tilts and orbits with the panel
 * instead of floating over the page as DOM. It owns the drawing, the layout and the hit-testing; the stage owns when it opens and what a row does.
 */
import * as THREE from 'three';
/** what the menu switches on a panel */
export interface PanelDisplay {
    curvature: number;
    scanlines: boolean;
    glow: boolean;
    magnify: boolean;
}
export type MenuRow = 'scanlines' | 'glow' | 'magnify' | 'curve-' | 'curve+';
export interface MenuColors {
    bg: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    hover: string;
    divider: string;
}
export declare const DEFAULT_MENU_COLORS: MenuColors;
/** the bend range and step (the 2D menu's: -40 concave … 40 convex, 2 per press) */
export declare const CURVE_MIN = -40, CURVE_MAX = 40, CURVE_STEP = 2;
export declare class DisplayMenu3D {
    private ppu;
    readonly mesh: THREE.Mesh;
    panel: import('./CathodeStage3D').Panel3D | null;
    private canvas;
    private texture;
    private colors;
    private display;
    private hover;
    constructor(ppu: number, colors?: Partial<MenuColors>);
    get isOpen(): boolean;
    static readonly width = 188;
    static readonly height: number;
    setColors(c: Partial<MenuColors>): void;
    /** open on `panel`, with its top-left corner at (x, y) in the panel's BODY px (clamped to stay inside the body) */
    open(panel: import('./CathodeStage3D').Panel3D, x: number, y: number, display: PanelDisplay): void;
    close(): void;
    update(display: PanelDisplay): void;
    setHover(row: MenuRow | null): void;
    /** the row under a point of the menu's own UV (y up), or null (header, divider, hint) */
    rowAtUV(u: number, v: number): MenuRow | null;
    /** the CENTRE of a row in the menu's own px (for tests / tours) */
    static rowCentre(row: MenuRow): {
        x: number;
        y: number;
    };
    private draw;
    dispose(): void;
}
