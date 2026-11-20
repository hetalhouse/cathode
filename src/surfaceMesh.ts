/**
 * createSurfaceMesh — put a 'world'-mode CathodeSurface into a THREE.Scene.
 *
 * Builds a plane whose aspect matches the surface's logical size (height fixed at `height` world
 * units) wearing the surface's CRT material. Call resizeSurfaceMesh when the logical size
 * changes. For pointer input raycast the mesh and feed `hit.uv` to surface.contentPoint(u, v).
 */
import * as THREE from 'three'
import type { CathodeSurface } from './CathodeSurface'

export function createSurfaceMesh(surface: CathodeSurface, height = 1): THREE.Mesh {
  if (surface.mode !== 'world') {
    throw new Error("createSurfaceMesh needs a CathodeSurface created with mode: 'world'")
  }
  const aspect = surface.logicalH > 0 ? surface.logicalW / surface.logicalH : 16 / 9
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), surface.material)
  mesh.userData.cathodeSurface = surface
  return mesh
}

/** Re-fit the plane to the surface's current logical aspect (height unchanged). */
export function resizeSurfaceMesh(mesh: THREE.Mesh, surface: CathodeSurface, height = 1) {
  const aspect = surface.logicalH > 0 ? surface.logicalW / surface.logicalH : 16 / 9
  mesh.geometry.dispose()
  mesh.geometry = new THREE.PlaneGeometry(height * aspect, height)
}
