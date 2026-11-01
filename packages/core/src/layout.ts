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
import type { Anchor, AvoidId, FieldOptions, Particle, Rect, ShapeDef } from './types.js';

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
    // The region has to be aspect-aware. A fixed 55% looked right on a square
    // stage but left shapes sitting on the ends of a headline in a wide, short
    // hero — which is the exact case `avoid` exists to serve. Content in a
    // wide box is wide, so the region widens with the box: 55% at 1:1, easing
    // to 78% by 3:1. Height tightens slightly as it widens, since a short box
    // holds fewer lines.
    const aspect = width / Math.max(1, height);
    const t = Math.min(1, Math.max(0, (aspect - 1) / 2));
    const w = width * (0.55 + 0.23 * t);
    const h = height * (0.45 + 0.1 * t);
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

/**
 * Pushes a point to the nearest position that clears an avoid region.
 *
 * Rejection sampling alone can never be a guarantee: when a wide region and
 * large shapes leave only a thin valid margin, some fraction of draws find
 * nothing however large the budget. Projection closes that tail — it moves the
 * point to the closest of the four escapes (left, right, above, below) that
 * still fits the field, deterministically. Returns null when the region
 * genuinely leaves nowhere to stand.
 */
function projectOut(
  cx: number, cy: number, w: number, h: number, r: Rect, pad: number,
  minX: number, maxX: number, minY: number, maxY: number,
): { x: number; y: number } | null {
  const left = r.x - pad - w / 2;
  const right = r.x + r.w + pad + w / 2;
  const above = r.y - pad - h / 2;
  const below = r.y + r.h + pad + h / 2;

  const options: Array<{ x: number; y: number; d: number }> = [];
  if (left >= minX) options.push({ x: left, y: cy, d: Math.abs(cx - left) });
  if (right <= maxX) options.push({ x: right, y: cy, d: Math.abs(right - cx) });
  if (above >= minY) options.push({ x: cx, y: above, d: Math.abs(cy - above) });
  if (below <= maxY) options.push({ x: cx, y: below, d: Math.abs(below - cy) });

  if (options.length === 0) return null;
  let best = options[0] as { x: number; y: number; d: number };
  for (const o of options) if (o.d < best.d) best = o;
  return { x: best.x, y: best.y };
}

/**
 * The region an anchored particle is placed within, as a fraction of the
 * field. Edges get a generous band so large media sits *in* the margin rather
 * than hugging the very edge; corners get a quadrant.
 */
const ANCHOR_RECTS: Record<Anchor, [number, number, number, number]> = {
  // x, y, w, h — all 0..1
  left: [0, 0.1, 0.34, 0.8],
  right: [0.66, 0.1, 0.34, 0.8],
  top: [0.1, 0, 0.8, 0.34],
  bottom: [0.1, 0.66, 0.8, 0.34],
  'top-left': [0, 0, 0.42, 0.42],
  'top-right': [0.58, 0, 0.42, 0.42],
  'bottom-left': [0, 0.58, 0.42, 0.42],
  'bottom-right': [0.58, 0.58, 0.42, 0.42],
  center: [0.25, 0.25, 0.5, 0.5],
};

/**
 * Breathing room kept between anchored media and the field edge.
 *
 * Clamping a large frame to exactly `width - w/2` is correct arithmetic and
 * looks wrong: flush against the boundary it reads as clipped rather than
 * placed, and its outline ring and drop shadow are cut off by the field's
 * own `overflow: hidden`. Anchored media is big enough that the gap has to
 * scale with the field rather than being a fixed few pixels.
 */
function anchorInset(width: number, height: number): number {
  return Math.min(48, Math.max(12, Math.min(width, height) * 0.04));
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

    // Placement is two-stage, because `avoid` is a documented guarantee
    // rather than a preference. Stage one draws until it has a few candidates
    // that actually clear the avoid region; stage two picks whichever of those
    // sits furthest from its placed neighbours, giving the even, designed
    // scatter that pure random placement never produces.
    //
    // A single-stage "score violations very negative" pass is not enough: with
    // large shapes and a wide region every candidate in a small sample can be
    // a violation, and the solver then quietly ships one.
    const WANT_VALID = 6;
    const MAX_DRAWS = 40;

    let bestX = 0;
    let bestY = 0;
    let bestScore = -Infinity;
    let bestValidX = 0;
    let bestValidY = 0;
    let bestValidScore = -Infinity;
    let validFound = 0;
    const firstPlacement = out.length === 0;

    for (let k = 0; k < MAX_DRAWS; k++) {
      const cx = range(r, minX, maxX);
      const cy = range(r, minY, maxY);

      let nearest = Infinity;
      for (const p of out) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = dx * dx + dy * dy;
        if (d < nearest) nearest = d;
      }
      const score = nearest === Infinity ? 0 : nearest;

      if (score > bestScore) {
        bestScore = score;
        bestX = cx;
        bestY = cy;
      }

      const blocked = avoid !== null && overlapsRect(cx, cy, w, h, avoid, size * 0.15);
      if (!blocked) {
        validFound++;
        if (score > bestValidScore) {
          bestValidScore = score;
          bestValidX = cx;
          bestValidY = cy;
        }
        if (validFound >= WANT_VALID) break;
      }

      // With no avoid region the first particle has nothing to space against,
      // so one draw is already optimal.
      if (avoid === null && firstPlacement) break;
      if (avoid === null && validFound >= WANT_VALID) break;
    }

    let px = validFound > 0 ? bestValidX : bestX;
    let py = validFound > 0 ? bestValidY : bestY;

    // No draw cleared the region. Project rather than ship a violation; only
    // a region with no escape at all falls through to best-effort, where
    // rendering a shape inside it still beats rendering nothing.
    if (validFound === 0 && avoid !== null) {
      const pushed = projectOut(
        px, py, w, h, avoid, size * 0.15, minX, maxX, minY, maxY,
      );
      if (pushed) {
        px = pushed.x;
        py = pushed.y;
      }
    }

    out.push({
      shape,
      colors: pickColors(stops, r),
      x: px,
      y: py,
      homeX: px,
      homeY: py,
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

  // Media particles: one each, anchored rather than scattered, and appended
  // after the pool shapes so they paint in front by default.
  for (const m of opts.media ?? []) {
    const z = 1;
    const { w, h } = sizeFor(m, size, 1);
    const anchor = m.place ?? 'center';
    const [ax, ay, aw, ah] = ANCHOR_RECTS[anchor] ?? ANCHOR_RECTS.center;

    // Clamp into the field, then centre within the anchor band when the
    // media is wider than the band — a large portrait should overflow its
    // band symmetrically rather than be shoved against an edge.
    const inset = anchorInset(width, height);
    const bandX = ax * width + (ax > 0 ? inset : 0);
    const bandY = ay * height + (ay > 0 ? inset : 0);
    const bandW = aw * width - (ax > 0 ? inset : 0) - (ax + aw >= 1 ? inset : 0);
    const bandH = ah * height - (ay > 0 ? inset : 0) - (ay + ah >= 1 ? inset : 0);

    const cx = bandW >= w
      ? bandX + range(r, w / 2, bandW - w / 2)
      : bandX + bandW / 2;
    const cy = bandH >= h
      ? bandY + range(r, h / 2, bandH - h / 2)
      : bandY + bandH / 2;

    // Media larger than the field itself still has to go somewhere; centring
    // beats pinning it to one edge.
    const minX = Math.min(width / 2, w / 2 + inset);
    const maxX = Math.max(width / 2, width - w / 2 - inset);
    const minY = Math.min(height / 2, h / 2 + inset);
    const maxY = Math.max(height / 2, height - h / 2 - inset);

    const px = Math.min(maxX, Math.max(minX, cx));
    const py = Math.min(maxY, Math.max(minY, cy));

    out.push({
      shape: m,
      colors: pickColors(stops, r),
      x: px,
      y: py,
      homeX: px,
      homeY: py,
      w,
      h,
      rot: 0,
      scale: 1,
      opacity: 1,
      blur: 0,
      z,
      vx: 0,
      vy: 0,
      phase: r(),
      state: {},
    });
  }

  // Near shapes paint last so depth reads correctly in DOM order. Media sits
  // at z=1, so it lands at the end and paints in front.
  if (depth) out.sort((a, b) => a.z - b.z);
  return out;
}

/** Depth also slows far shapes down. Presets apply this to their own speeds. */
export function depthSpeed(p: Particle): number {
  return 0.45 + p.z * 0.75;
}
