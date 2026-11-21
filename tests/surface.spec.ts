import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeSurface — the headless painter/material that both the DOM widgets and the 3D stage
 * present. (1) the CPU hit-testing mirror of the barrel shader, (2) the 'world'-mode plane in a
 * perspective scene renders, and a raycast hit maps back to content pixels.
 */
test.describe('CathodeSurface', () => {
  test('CPU barrel mirror: flat is identity, centre is fixed, bends invert', async ({ page }) => {
    await page.goto('/surface3d.html');
    const r = await page.evaluate(async () => {
      const m = await import('/src/CathodeSurface.ts');
      const strength = (c: number) => (c / 45) * 0.55;
      return {
        flat:   m.barrelUV(0.2, 0.8, 0),
        centre: m.barrelUV(0.5, 0.5, strength(30)),
        convex: m.barrelUV(1.0, 0.5, strength(45)),   // edge midline overflows past the texture
        concave: m.barrelUV(1.0, 1.0, strength(-45)), // concave fit-to-content: corners land ON the texture corners
      };
    });
    expect(r.flat.x).toBeCloseTo(0.2, 6); expect(r.flat.y).toBeCloseTo(0.8, 6);
    expect(r.centre.x).toBeCloseTo(0.5, 6); expect(r.centre.y).toBeCloseTo(0.5, 6);
    expect(r.convex.x).toBeGreaterThan(1);
    expect(r.concave.x).toBeCloseTo(1, 2); expect(r.concave.y).toBeCloseTo(1, 2);
  });

  test('world-mode plane renders in a perspective scene and raycast hits map to content', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/surface3d.html?curv=0&rotY=0');
    await page.waitForFunction(() => !!(window as never as Record<string, unknown>).__surface3d);
    await page.waitForTimeout(900); // needle sweep settles
    const shot = await page.locator('canvas').first().screenshot();
    expect(shot.length, '3D canvas looks blank').toBeGreaterThan(3000);

    // centre of the screen hits the plane (rotY 0, camera on the axis) → UV ≈ (0.5, 0.5) → content centre
    const r = await page.evaluate(() => {
      const h = (window as never as { __surface3d: { hitAt(x: number, y: number): { x: number; y: number } | null;
        surface: { logicalW: number; logicalH: number }; probe(u: number, v: number): { x: number; y: number } | null } }).__surface3d;
      const uv = h.hitAt(window.innerWidth / 2, window.innerHeight / 2);
      return { uv, W: h.surface.logicalW, H: h.surface.logicalH, p: uv ? h.probe(uv.x, uv.y) : null };
    });
    expect(r.uv).not.toBeNull();
    expect(r.uv!.x).toBeCloseTo(0.5, 1);
    expect(r.p!.x).toBeCloseTo(r.W / 2, -1);
    expect(r.p!.y).toBeCloseTo(r.H / 2, -1);

    // a convex bend + an angled plane + the lens still render GL-clean
    await page.goto('/surface3d.html?curv=30&magnify=1&rotY=0.9');
    await page.mouse.move(640, 400);
    await page.waitForTimeout(500);
    expect(watch.entries, `console emitted GL/page errors:\n${JSON.stringify(watch.entries, null, 2)}`).toEqual([]);
  });

  test('barrelUV matches the grid\'s own applyBarrel on every bend (hit-test parity)', async ({ page }) => {
    await page.goto('/surface3d.html');
    const r = await page.evaluate(async () => {
      const a = await import('/src/CathodeSurface.ts');
      const b = await import('/src/CanvasGrid.ts');
      const worst = (curvs: number[], axes: ('x' | 'y')[]) => {
        let max = 0;
        for (const curv of curvs) {
          const strength = (curv / 45) * 0.55;
          for (let i = 0; i <= 10; i++) for (let j = 0; j <= 10; j++) {
            const u = i / 10, v = j / 10;
            const m = a.barrelUV(u, v, strength);
            const [gx, gy] = b.applyBarrel(u, v, strength);
            if (axes.includes('x')) max = Math.max(max, Math.abs(m.x - gx));
            if (axes.includes('y')) max = Math.max(max, Math.abs(m.y - gy));
          }
        }
        return max;
      };
      return { all: worst([-45, -20, 0, 15, 45], ['x', 'y']) };
    });
    // every bend, both axes — convex Y included (it was once scaled by 0.15 on the CPU side only)
    expect(r.all).toBeLessThan(1e-9);
  });
});
