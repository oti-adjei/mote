/**
 * Deterministic layout.
 *
 * Pure function of (seed, options, size). No time, no DOM, no randomness
 * beyond the seeded generator — so the server and the client agree on frame 0
 * and screenshots are stable.
 */
import { pick, range, rng, stratified } from './prng.js';
import { pickColors, resolveTheme } from './themes.js';
import { resolvePacks, resolvePool } from './pool.js';
import { BASE_PACK } from './shapes.js';
import type { AvoidId, FieldOptions, Particle, Rect, ShapeDef } from './types.js';

export const DEFAULTS = {
  mode: 'drift',
  set: 'mixed',
  count: 18,
  size: 64,
  seed: 1,
  theme: 'dark',
  depth: false,
  avoid: 'none',
  speed: 1,
  interactive: true,
  direction: 'right',
} as const;

const MIN_COUNT = 1;
const MAX_COUNT = 200;
/** Above this, the DOM renderer's node count starts to cost real frame time. */
export const COUNT_WARN_THRESHOLD = 60;

/** Depth mapping, per spec 06-motion-spec §04. */
const DEPTH = {
  scaleMin: 0.55,
  scaleMax: 1.15,
  blurMax: 2.5,
  opacityMin: 0.45,
} as const;

export function resolveAvoid(
  avoid: AvoidId | Rect | undefined,
  width: number,
  height: number,
): Rect | null {
  if (avoid === undefined || avoid === 'none') return null;
  if (typeof avoid === 'object') return avoid;
  if (avoid === 'center') {
    const w = width * 0.55;
    const h = height * 0.45;
    return { x: (width - w) / 2, y: (height - h) / 2, w, h };
  }
  if (avoid === 'top') return { x: 0, y: 0, w: width, h: height * 0.4 };
  if (avoid === 'bottom') return { x: 0, y: height * 0.6, w: width, h: height * 0.4 };
  return null;
}

function overlapsRect(
  x: number, y: number, w: number, h: number, r: Rect, pad: number,
): boolean {
  return (
    x - w / 2 < r.x + r.w + pad &&
    x + w / 2 > r.x - pad &&
    y - h / 2 < r.y + r.h + pad &&
    y + h / 2 > r.y - pad
  );
}

/** Dimensions for one shape at a given base size and depth scale. */
function sizeFor(shape: ShapeDef, size: number, zScale: number): { w: number; h: number } {
  const box = size * (shape.scale ?? 1) * zScale;
  return shape.ar >= 1
    ? { w: box, h: box / shape.ar }
    : { w: box * shape.ar, h: box };
}

export function clampCount(count: number | undefined): number {
  const n = Math.round(count ?? DEFAULTS.count);
  if (!Number.isFinite(n)) return DEFAULTS.count;
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, n));
}

/**
 * Builds the particle set.
 *
 * Placement uses best-candidate sampling: for each particle, draw a few
 * candidate positions and keep whichever sits furthest from already-placed
 * neighbours. That yields an even, designed-looking scatter without the
 * clumping of pure random placement, and unlike a relaxation pass it runs in
 * bounded time — which matters because this runs on the server too.
 */
export function layout(
  opts: FieldOptions,
  width: number,
  height: number,
  warn: (msg: string) => void = () => {},
): Particle[] {
  const packs = resolvePacks(opts.packs, BASE_PACK);
  const pool = resolvePool(packs, opts.shapes, opts.set ?? DEFAULTS.set, warn);
  const stops = resolveTheme(opts.theme, packs);
  const count = clampCount(opts.count);
  const size = opts.size ?? DEFAULTS.size;
  const depth = opts.depth ?? DEFAULTS.depth;
  const avoid = resolveAvoid(opts.avoid, width, height);

  if (count > COUNT_WARN_THRESHOLD) {
    warn(
      `mote: count=${count} exceeds the ${COUNT_WARN_THRESHOLD}-shape DOM budget; ` +
        `expect frame-time cost`,
    );
  }

  const r = rng(opts.seed ?? DEFAULTS.seed);
  const phases = stratified(r, count);
  const out: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const shape = pick(r, pool);
    const z = depth ? r() : 1;
    const zScale = depth ? DEPTH.scaleMin + z * (DEPTH.scaleMax - DEPTH.scaleMin) : 1;
    const { w, h } = sizeFor(shape, size, zScale);

    // Inset so shapes start fully visible; wrapping presets handle the edges.
    const minX = w / 2;
    const maxX = Math.max(minX, width - w / 2);
    const minY = h / 2;
    const maxY = Math.max(minY, height - h / 2);

    let bestX = 0;
    let bestY = 0;
    let bestScore = -Infinity;
    const candidates = out.length === 0 ? 1 : 6;

    for (let k = 0; k < candidates; k++) {
      const cx = range(r, minX, maxX);
      const cy = range(r, minY, maxY);

      // An avoid region is a hard constraint where possible: score it far
      // below any valid position rather than rejecting outright, so a field
      // whose avoid region covers everything still renders.
      let score = 0;
      if (avoid && overlapsRect(cx, cy, w, h, avoid, size * 0.15)) {
        score -= 1e6;
      }
      let nearest = Infinity;
      for (const p of out) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = dx * dx + dy * dy;
        if (d < nearest) nearest = d;
      }
      score += nearest === Infinity ? 0 : nearest;

      if (score > bestScore) {
        bestScore = score;
        bestX = cx;
        bestY = cy;
      }
    }

    out.push({
      shape,
      colors: pickColors(stops, r),
      x: bestX,
      y: bestY,
      homeX: bestX,
      homeY: bestY,
      w,
      h,
      rot: range(r, -12, 12),
      scale: 1,
      opacity: depth ? DEPTH.opacityMin + z * (1 - DEPTH.opacityMin) : 1,
      blur: depth ? (1 - z) * DEPTH.blurMax : 0,
      z,
      vx: 0,
      vy: 0,
      phase: phases[i] ?? 0,
      state: {},
    });
  }

  // Near shapes paint last so depth reads correctly in DOM order.
  if (depth) out.sort((a, b) => a.z - b.z);
  return out;
}

/** Depth also slows far shapes down. Presets apply this to their own speeds. */
export function depthSpeed(p: Particle): number {
  return 0.45 + p.z * 0.75;
}
