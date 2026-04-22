/** Increments each time reset() is called — watchers use this to force redraws. */
export declare const resetTick: import("vue").Ref<number, number>;
export interface ContainerState {
    x: number;
    y: number;
    w: number;
    h: number;
    visible: boolean;
    minimized: boolean;
    maximized: boolean;
    zIndex: number;
}
export declare const TITLEBAR_H = 28;
declare const M = 12;
declare function load(initial: Record<string, ContainerState>, storageKey?: string): void;
declare function save(): void;
declare function reset(initial: Record<string, ContainerState>): void;
declare function bringToFront(id: string): void;
declare function setVisible(id: string, v: boolean): void;
declare function setMinimized(id: string, v: boolean): void;
declare function setMaximized(id: string, v: boolean): void;
declare function updatePos(id: string, x: number, y: number): void;
declare function updateSize(id: string, w: number, h: number): void;
/** Compute a tiled default layout from workspace dimensions. */
export declare function buildDefaultLayout(wsW: number, wsH: number, ids: string[]): Record<string, ContainerState>;
export { M };
export declare function useCathodeLayout(): {
    containers: import("vue").Ref<Record<string, ContainerState>, Record<string, ContainerState>>;
    TITLEBAR_H: number;
    load: typeof load;
    save: typeof save;
    reset: typeof reset;
    bringToFront: typeof bringToFront;
    setVisible: typeof setVisible;
    setMinimized: typeof setMinimized;
    setMaximized: typeof setMaximized;
    updatePos: typeof updatePos;
    updateSize: typeof updateSize;
};
