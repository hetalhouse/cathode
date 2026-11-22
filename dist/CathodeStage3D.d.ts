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
 *
 * OVERLAY MODE — a stage laid over ANOTHER three.js scene (a dashboard's market scape) instead of
 * owning the whole view:
 *   • `transparent` — an alpha canvas, nothing painted where no panel is;
 *   • `setCameraPose()` — the host drives the camera, so panels sit in the same 3D space as the
 *     scene beneath (match `fov` / `near` / `far` to that scene's camera);
 *   • `passThrough` — the canvas takes no pointer events. The stage listens on `inputTarget`
 *     (capture phase, `document` by default) and picks panels by raycast: a press, click or wheel
 *     over a panel is handled here and stopped; anywhere else it falls through untouched to the
 *     scene below (its orbit, its plane clicks). `shouldHandle(target)` lets the host exclude
 *     events that landed on DOM stacked ABOVE the stage (a window over a panel). Keys go to the
 *     focused panel via `window`, except while typing in an input.
 */
import * as THREE from 'three';
import type { SurfaceLook } from './CathodeSurface';
import type { PanelContent } from './panelContent';
export interface StageControls {
    enabled: boolean;
    /** OrbitControls' pivot — kept in step with the camera when the host / flyTo moves it */
    target?: {
        set(x: number, y: number, z: number): unknown;
    };
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
    /** an alpha canvas — nothing is painted where there is no panel (a stage over another scene) */
    transparent?: boolean;
    /** world units are `pxPerUnit` logical px of a panel (default 360) */
    pxPerUnit?: number;
    cameraPosition?: [number, number, number];
    /** camera intrinsics — match them to the scene the stage is laid over (defaults 45 / 0.05 / 100) */
    fov?: number;
    near?: number;
    far?: number;
    /**
     * The canvas takes no pointer events; input is picked by raycast on `inputTarget` instead and
     * only what lands on a panel is consumed. See the overlay-mode note above.
     */
    passThrough?: boolean;
    /** where passThrough listens (capture phase). Default: `document`. */
    inputTarget?: Document | HTMLElement;
    /** passThrough: return false for events that landed on DOM stacked above the stage */
    shouldHandle?: (target: EventTarget | null) => boolean;
    /** cursor changes (default: set on the canvas, which passThrough makes invisible — route it to the host) */
    onCursor?: (cursor: string) => void;
    onFocus?: (id: string | null) => void;
    onPanelMoved?: (id: string, pos: {
        x: number;
        y: number;
        z: number;
    }) => void;
    /** a panel's title bar was double-clicked (typically: face / fly to it — see facingPose) */
    onPanelActivate?: (id: string) => void;
}
/** A camera pose in world space (what an external driver — another scene's camera — sets). */
export interface StageCameraPose {
    position: [number, number, number];
    target: [number, number, number];
}
export interface PanelOptions {
    id: string;
    title?: string;
    content: PanelContent;
    position?: [number, number, number];
    rotationY?: number;
    look?: Partial<SurfaceLook>;
    glow?: boolean;
    /** default true; a hidden panel isn't drawn, picked or painted */
    visible?: boolean;
}
export interface PanelLayout {
    x: number;
    y: number;
    z: number;
    rotY: number;
    visible?: boolean;
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
    readonly content: PanelContent;
    readonly group: THREE.Group<THREE.Object3DEventMap>;
    readonly body: THREE.Mesh;
    readonly bar: THREE.Mesh;
    glow: boolean;
    dirty: boolean;
    barDirty: boolean;
    private _title;
    private barCanvas;
    private barTexture;
    constructor(stage: CathodeStage3D, o: PanelOptions);
    /** the title bar's text */
    get title(): string;
    /** Change the title bar's text (e.g. a live count: "Open positions (6)"). Repaints only the bar, and only if it changed. */
    setTitle(title: string): void;
    get visible(): boolean;
    /** Show / hide. Prefer stage.setPanelVisible(), which also releases focus / hover / drag. */
    setVisible(v: boolean): void;
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
    private readonly passThrough;
    private swallowClick;
    private cancelFly;
    constructor(o: CathodeStage3DOptions);
    private on;
    /** Point the camera (the host drives it — e.g. following another scene's camera). */
    setCameraPose(pose: StageCameraPose): void;
    /**
     * The camera pose that looks straight at a panel (its title bar included), from the front, far
     * enough back that the whole panel fits the view with `margin` (default 12%) to spare. Pure — it
     * moves nothing: a host that owns the camera (overlay mode) applies it itself; otherwise flyTo().
     */
    facingPose(id: string, opts?: {
        margin?: number;
    }): StageCameraPose | null;
    /**
     * Tween the camera to a pose (ease in-out). For a stage that OWNS its camera — in overlay mode
     * the host drives the camera, so apply facingPose() there instead. Resolves when it lands; a new
     * flyTo replaces one in flight. `ms <= 0` snaps.
     */
    flyTo(pose: StageCameraPose, ms?: number): Promise<void>;
    /** The camera's current pose (target = the point it looks at, one unit ahead). */
    getCameraPose(): StageCameraPose;
    addPanel(o: PanelOptions): Panel3D;
    removePanel(id: string): void;
    /** Show / hide a panel. Hiding releases its focus, hover, press and drag. */
    setPanelVisible(id: string, visible: boolean): void;
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
    /** passThrough: did this event land on something the stage may take (not DOM stacked above it)? */
    private accepts;
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
