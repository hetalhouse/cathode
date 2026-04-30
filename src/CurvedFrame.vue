<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import './cathode.css'

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

const props = withDefaults(defineProps<{
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:     'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 curvature, applied as a small CSS perspective + rotateX. */
  curvature?: number
  scanlines?: boolean
  glow?:      boolean
}>(), {
  theme:     'none',
  curvature: 0,
  scanlines: true,
  glow:      true,
})

// ── Theme palette (kept in sync with CanvasGrid's THEME_COLORS but
// expressed as plain CSS variables for the DOM overlay layers) ────────────────
const themeVars = computed<CSSProperties>(() => {
  switch (props.theme) {
    case 'phosphor':
      return {
        '--cf-bg':       '#060d06',
        '--cf-text':     '#33ff33',
        '--cf-accent':   '#80ff80',
        '--cf-vignette': 'rgba(0, 30, 0, 0.55)',
        '--cf-scanline': 'rgba(51, 255, 51, 0.06)',
      } as CSSProperties
    case 'amber':
      return {
        '--cf-bg':       '#0a0700',
        '--cf-text':     '#ffb000',
        '--cf-accent':   '#ffd060',
        '--cf-vignette': 'rgba(40, 20, 0, 0.55)',
        '--cf-scanline': 'rgba(255, 176, 0, 0.05)',
      } as CSSProperties
    case 'paper':
      return {
        '--cf-bg':       '#fafafa',
        '--cf-text':     '#222222',
        '--cf-accent':   '#158cba',
        '--cf-vignette': 'rgba(0, 0, 0, 0.04)',
        '--cf-scanline': 'rgba(0, 0, 0, 0.02)',
      } as CSSProperties
    case 'none':
    default:
      // Inherit from parent — let consumer's CSS variables drive the look.
      return {
        '--cf-bg':       'transparent',
        '--cf-text':     'inherit',
        '--cf-accent':   'var(--accent-text, #40a0f0)',
        '--cf-vignette': 'rgba(0, 0, 0, 0.35)',
        '--cf-scanline': 'rgba(255, 255, 255, 0.03)',
      } as CSSProperties
  }
})

// CSS curvature: stack of effects that together suggest a CRT bulge
// without actually distorting live HTML (which would kill hit-testing):
//   - rotateX  — top tilts backward (real CRT physics; subtle but
//                directional)
//   - perspective — drives the rotateX foreshortening
//   - border-radius — rounds the corners as curvature increases (real
//                CRTs have rounded glass corners)
//   - scale    — slight outward expansion at high curvature mimics the
//                bulge at the centre
// Capped values are chosen empirically — past these the slot content
// starts to feel disorienting, especially with text.
const contentTransform = computed<CSSProperties>(() => {
  if (props.curvature <= 0) return { transform: 'none' }
  const t = props.curvature / 45                 // 0..1
  const tilt   = t * 5                           // 0..5 deg rotateX
  const scale  = 1 + t * 0.025                   // 1..1.025
  const persp  = 1200 - t * 600                  // 1200..600 (smaller = more perspective)
  return {
    perspective: `${persp}px`,
    transform:   `scale(${scale}) rotateX(${tilt}deg)`,
  }
})

const bezelStyle = computed<CSSProperties>(() => {
  // Corner roundness scales with curvature — real CRT glass has rounded
  // corners that get more pronounced on more curved tubes.
  if (props.curvature <= 0) return {}
  const t = props.curvature / 45
  const radius = 6 + t * 22                      // 6..28px
  return { borderRadius: `${radius}px` }
})

// Composite class list — used by tests and consumer styling hooks.
const wrapClass = computed(() => ({
  'curved-frame':           true,
  'curved-frame-scanlines': props.scanlines,
  'curved-frame-glow':      props.glow,
  [`curved-frame-${props.theme}`]: true,
}))
</script>

<template>
  <div :class="wrapClass" :style="themeVars">
    <!-- Vignette (::before) and scanlines (::after) live on this layer -->
    <div class="curved-frame-bezel" :style="bezelStyle">
      <div class="curved-frame-content" :style="contentTransform">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.curved-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--cf-bg);
  color: var(--cf-text);
  border-radius: 6px;
  /* Reset any user-agent appearance for nested form controls so they pick
     up the theme cleanly. Consumers can override per-control. */
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.curved-frame-bezel {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--cf-accent) 20%, transparent);
  border-radius: inherit;
}

/* Glow halo — outer + inner soft accent ring. Only when `glow` is on. */
.curved-frame-glow .curved-frame-bezel {
  box-shadow:
    0 0 0   1px color-mix(in srgb, var(--cf-accent) 18%, transparent),
    0 0 24px    color-mix(in srgb, var(--cf-accent) 12%, transparent),
    inset 0 0 32px color-mix(in srgb, var(--cf-accent)  6%, transparent);
}

/* Vignette — radial darken at the corners. Below content via z-index. */
.curved-frame-bezel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%,
    transparent 60%,
    var(--cf-vignette) 100%);
  z-index: 1;
}

/* Scanlines — repeating overlay, fixed period regardless of curvature.
   `::after` so it sits over content but below interactive overlays
   (consumers use higher z-index for menus etc). */
.curved-frame-scanlines .curved-frame-bezel::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 2px,
    var(--cf-scanline) 2px,
    var(--cf-scanline) 3px
  );
  z-index: 2;
}

/* Paper theme softens scanlines + drops glow to white-on-light aesthetic */
.curved-frame-paper .curved-frame-bezel {
  box-shadow:
    0 0 0   1px color-mix(in srgb, var(--cf-accent) 25%, transparent),
    0 4px 18px rgba(0,0,0,0.06);
}
.curved-frame-paper.curved-frame-scanlines .curved-frame-bezel::after {
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    var(--cf-scanline) 3px,
    var(--cf-scanline) 4px
  );
}

/* Content layer — slot lives here. transform-origin centred so the tilt
   is balanced top-to-bottom. */
.curved-frame-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
  transform-origin: 50% 50%;
  /* Scrolling is the consumer's problem — we don't impose overflow rules. */
}
</style>
