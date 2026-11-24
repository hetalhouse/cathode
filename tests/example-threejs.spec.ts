import { test, expect } from '@playwright/test';
import { readFileSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * examples/threejs-workspace.html — the standalone "three.js + cathode" example (an import map to CDN URLs, no build step). The CDN URLs are answered from the local checkout so the test
 * needs no network and runs the BUILT library — built into a temp folder here (the committed dist/ is not the current source): three / vue / OrbitControls from node_modules, cathode from that build.
 */
let LIB = '';
test.beforeAll(() => { const out = mkdtempSync(join(tmpdir(), 'cathode-example-lib-')); execSync(`npx vite build --config vite.lib.config.ts --outDir ${out} --emptyOutDir`, { stdio: 'ignore' }); LIB = join(out, 'cathode.js'); });
const MAP: [RegExp, string][] = [
  [/esm\.sh\/three@[^/]+\/examples\/jsm\/(.+)$/, 'node_modules/three/examples/jsm/$1'],
  [/esm\.sh\/three@[^/?]+(\?.*)?$/, 'node_modules/three/build/three.module.js'],
  [/esm\.sh\/vue@[^/?]+(\?.*)?$/, 'node_modules/vue/dist/vue.esm-browser.js'],
  [/esm\.sh\/@hetalhouse\/cathode@[^/?]+(\?.*)?$/, '@LIB'],
];

test('the example runs from its import map: four panels, Overview frames them all, a panel expands and restores', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.route(/esm\.sh\//, async (route) => {
    const url = route.request().url();
    for (const [re, to] of MAP) { const m = re.exec(url); if (m) return route.fulfill({ body: readFileSync(to === '@LIB' ? LIB : to.replace('$1', m[1] ?? '')), contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' } }); }
    return route.abort();
  });
  // the page is served as a plain static file from a made-up origin (the vite dev server would rewrite its bare imports itself and bypass the import map — which is the thing under test)
  await page.route('http://example.test/**', (route) => route.fulfill({ body: readFileSync('examples/threejs-workspace.html'), contentType: 'text/html' }));
  await page.setViewportSize({ width: 1400, height: 800 });
  await page.goto('http://example.test/threejs-workspace.html');
  await page.waitForFunction(() => !!(window as any).__example, null, { timeout: 15_000 });
  await page.waitForTimeout(1000);
  expect(await page.evaluate(() => [...(window as any).__example.stage.panels.keys()].sort())).toEqual(['candle', 'log', 'tilt', 'trades']);
  const inFrame = () => page.evaluate(() => { const st = (window as any).__example.stage; st.camera.updateMatrixWorld(true); st.camera.updateProjectionMatrix();
    return [...st.panels.values()].every((p: any) => { p.group.updateWorldMatrix(true, true); const ppu = st.pxPerUnit, w = p.content.width / ppu, bh = p.content.height / ppu, bar = 26 / ppu;
      return [[-w / 2, -bh / 2], [w / 2, -bh / 2], [-w / 2, bh / 2 + bar], [w / 2, bh / 2 + bar]].every(([cx, cy]) => { const v = p.body.localToWorld(new p.group.position.constructor(cx, cy, 0)); v.project(st.camera); return v.x >= -1.01 && v.x <= 1.01 && v.y >= -1.01 && v.y <= 1.01; }); }); });
  expect(await inFrame(), 'starts from the overview: every panel in frame').toBe(true);
  await page.getByRole('button', { name: 'Zoom in ▸' }).click();
  await page.waitForTimeout(1200);
  expect(await inFrame(), 'zoomed in on one panel: not everything is in frame').toBe(false);
  await page.getByRole('button', { name: 'Overview' }).click();
  await page.waitForTimeout(1200);
  expect(await inFrame(), 'Overview: everything again').toBe(true);
  // □ expands, □ again restores
  const z0 = await page.evaluate(() => (window as any).__example.stage.camera.position.z);
  const c = await page.evaluate(() => (window as any).__example.stage.clientPointForControl('candle', 'maximize'));
  await page.mouse.click(c.x, c.y); await page.waitForTimeout(1100);
  expect(await page.evaluate(() => (window as any).__example.stage.camera.position.z)).toBeLessThan(z0 * 0.7);
  const c2 = await page.evaluate(() => (window as any).__example.stage.clientPointForControl('candle', 'maximize'));
  await page.mouse.click(c2.x, c2.y); await page.waitForTimeout(1100);
  expect(Math.abs((await page.evaluate(() => (window as any).__example.stage.camera.position.z)) - z0) / z0).toBeLessThan(0.03);
  expect(errors, JSON.stringify(errors)).toEqual([]);
});
