/**
 * createSurfaceMesh — put a 'world'-mode CathodeSurface into a THREE.Scene.
 *
 * Builds a plane whose aspect matches the surface's logical size (height fixed at `height` world
 * units) wearing the surface's CRT material. Call resizeSurfaceMesh when the logical size
 * changes. For pointer input raycast the mesh and feed `hit.uv` to surface.contentPoint(u, v).
 */
import * as THREE from 'three';
import type { CathodeSurface } from './CathodeSurface';
export declare function createSurfaceMesh(surface: CathodeSurface, height?: number): THREE.Mesh;
/** Re-fit the plane to the surface's current logical aspect (height unchanged). */
export declare function resizeSurfaceMesh(mesh: THREE.Mesh, surface: CathodeSurface, height?: number): void;
