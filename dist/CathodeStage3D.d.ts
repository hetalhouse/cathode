/**
 * CathodeStage3D — many cathode panels in ONE three.js scene.
 *
 * Every DOM widget builds its own WebGLRenderer and sits in a CSS window; the stage replaces
 * that with a single renderer + perspective camera and a Panel3D per CathodeSurface:
 *
 *   • one renderer, so no ~16-context browser cap, and panels can overlap, tilt and recede;
 *   • input by raycast: a pointer hit's UV goes through CathodeSurface.contentPoint() (the CPU
 *     mirror of the CRT warp) into the panel's content, in the painter's own logical px;
 *   • drag-to-move by ray–plane intersection on the panel's own plane, via a title bar;
 *   • focus: the pressed panel takes keyboard focus and is raised (renderOrder).
 *
 * The stage owns no widget logic — a panel's PanelContent (see panelContent.ts) says what it
 * draws and what pointer/keys mean. Rendering is on demand: nothing draws until something
 * invalidates (a repaint, a camera move, a drag).
 *
 * Camera control is injected (`controls`) so the library doesn't bundle three/addons — pass
 * `(camera, el) => new OrbitControls(camera, el)`.
 */
import * as THREE from 'three';
import type { SurfaceLook } from './CathodeSurface';
import type { PanelContent } from './panelContent';
export interface StageControls {
    enabled: boolean;
    update(): void;
    dispose(): void;
    addEventListener(type: 'change', listener: () => void): void;
}
export interface CathodeStage3DOptions {
    /** the element the stage's canvas fills */
    container: HTMLElement;
    /** e.g. (camera, el) => new OrbitControls(camera, el) — omit for a fixed camera */
    controls?: (camera: THREE.PerspectiveCamera, el: HTMLElement) => StageControls;
    background?: number;
    /** world units are `pxPerUnit` logical px of a panel (default 360) */
    pxPerUnit?: number;
    cameraPosition?: [number, number, number];
    onFocus?: (id: string | null) => void;
    onPanelMoved?: (id: string, pos: {
        x: number;
        y: number;
        z: number;
    }) => void;
}
export interface PanelOptions {
    id: string;
    title?: string;
    content: PanelContent;
    position?: [number, number, number];
    rotationY?: number;
    look?: Partial<SurfaceLook>;
    glow?: boolean;
}
export interface PanelLayout {
    x: number;
    y: number;
    z: number;
    rotY: number;
}
export interface StagePick {
    panel: Panel3D;
    part: 'body' | 'bar';
    /** content px in the panel's logical px; null over the bezel / on the bar */
    content: {
        x: number;
        y: number;
    } | null;
}
/** One panel: a surface mesh + a title bar, in a group the stage moves around. */
export declare class Panel3D {
    readonly stage: CathodeStage3D;
    readonly id: string;
    readonly title: string;
    readonly content: PanelContent;
    readonly group: THREE.Group<THREE.Object3DEventMap>;
    readonly body: THREE.Mesh;
    readonly bar: THREE.Mesh;
    glow: boolean;
    dirty: boolean;
    barDirty: boolean;
    private barCanvas;
    private barTexture;
    constructor(stage: CathodeStage3D, o: PanelOptions);
    /** Repaint the surface on the next frame (and render it). */
    invalidate(): void;
    invalidateBar(): void;
    setLook(look: Partial<SurfaceLook>): void;
    setPosition(x: number, y: number, z: number): void;
    setRotationY(r: number): void;
    /** @internal called by the stage's frame */
    paintIfDirty(): void;
    private drawBar;
    dispose(): void;
}
export declare class CathodeStage3D {
    private o;
    readonly renderer: THREE.WebGLRenderer;
    readonly scene: THREE.Scene;
    readonly camera: THREE.PerspectiveCamera;
    readonly canvas: HTMLCanvasElement;
    readonly panels: Map<string, Panel3D>;
    readonly pxPerUnit: number;
    focusedId: string | null;
    private controls;
    private ray;
    private ndc;
    private raf;
    private rendering;
    private raiseCounter;
    private hovered;
    private pressed;
    private dragging;
    private suppressClick;
    private resizeObserver;
    private disposers;
    private lastCursor;
    constructor(o: CathodeStage3DOptions);
    private on;
    addPanel(o: PanelOptions): Panel3D;
    removePanel(id: string): void;
    /** Keyboard focus + raise. */
    setFocus(id: string | null): void;
    private raise;
    getLayout(): Record<string, PanelLayout>;
    applyLayout(layout: Record<string, Partial<PanelLayout>>): void;
    invalidate(): void;
    private frame;
    private resize;
    private setRay;
    /** Content px (the panel's logical px) under a client point, or null (miss / bezel). */
    contentAt(panel: Panel3D, clientX: number, clientY: number): {
        x: number;
        y: number;
    } | null;
    /** Local content-px per screen-px at a client point: two probes 8px apart, as the DOM grid does. */
    private hitScaleAt;
    /** The nearest panel part under a client point (bodies and title bars; raised panels win ties). */
    pick(clientX: number, clientY: number): StagePick | null;
    /**
     * The client point at which a panel's content point (cx, cy) is DRAWN — the inverse of the
     * pointer mapping, solved by Newton iteration over contentPoint(). For tests / guided tours.
     */
    clientPointForContent(id: string, cx: number, cy: number): {
        x: number;
        y: number;
    } | null;
    /** Client point of a panel's title bar centre (for tests / tours). */
    clientPointForBar(id: string): {
        x: number;
        y: number;
    } | null;
    private send;
    private setCursor;
    private setHover;
    private onPointerDown;
    private onPointerMove;
    private onPointerUp;
    private onClick;
    private onWheel;
    private onKey;
    private startDrag;
    private dragTo;
    dispose(): void;
}
