/**
 * Shared collision solver for `bounce` and `gravity`.
 *
 * Particles are approximated as circles. Shapes here are visually loose (a
 * zigzag, a pill), so exact polygon collision would cost a great deal to
 * resolve a difference nobody can see against a moving background.
 *
 * Broad phase is a uniform spatial hash. At count ≤ 40 naive O(n²) would be
 * fine, but the grid is ~30 lines and keeps headroom for the 200-particle
 * ceiling, where naive would be ~20k checks per frame.
 */
import type { Particle } from '../types.js';

/** Collision radius. 0.85 because declared bounds are generous for most art. */
export function radiusOf(p: Particle): number {
  return (Math.max(p.w, p.h) / 2) * 0.85;
}

export interface CollisionOpts {
  /** 0 = fully inelastic, 1 = perfectly elastic. */
  restitution: number;
}

export function resolvePairs(
  particles: Particle[],
  { restitution }: CollisionOpts,
): void {
  const n = particles.length;
  if (n < 2) return;

  let maxR = 0;
  for (const p of particles) {
    const r = radiusOf(p);
    if (r > maxR) maxR = r;
  }
  const cell = Math.max(1, maxR * 2);
  const grid = new Map<string, number[]>();

  for (let i = 0; i < n; i++) {
    const p = particles[i] as Particle;
    const key = `${Math.floor(p.x / cell)},${Math.floor(p.y / cell)}`;
    const bucket = grid.get(key);
    if (bucket) bucket.push(i);
    else grid.set(key, [i]);
  }

  const seen = new Set<number>();

  for (let i = 0; i < n; i++) {
    const a = particles[i] as Particle;
    const gx = Math.floor(a.x / cell);
    const gy = Math.floor(a.y / cell);

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const bucket = grid.get(`${gx + ox},${gy + oy}`);
        if (!bucket) continue;

        for (const j of bucket) {
          if (j <= i) continue;
          const pairKey = i * n + j;
          if (seen.has(pairKey)) continue;
          seen.add(pairKey);

          const b = particles[j] as Particle;
          const ra = radiusOf(a);
          const rb = radiusOf(b);
          const minDist = ra + rb;

          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.hypot(dx, dy);
          if (dist >= minDist) continue;

          // Perfectly coincident particles have no collision normal; nudge
          // them apart deterministically rather than dividing by zero.
          if (dist === 0) {
            dx = 1;
            dy = 0;
            dist = 1;
          }

          const nx = dx / dist;
          const ny = dy / dist;

          // Separate, splitting the overlap equally (equal mass).
          const overlap = (minDist - dist) / 2;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;

          // Elastic response along the normal.
          const rvx = b.vx - a.vx;
          const rvy = b.vy - a.vy;
          const along = rvx * nx + rvy * ny;
          if (along > 0) continue;        // already separating

          const impulse = -(1 + restitution) * along / 2;
          a.vx -= impulse * nx;
          a.vy -= impulse * ny;
          b.vx += impulse * nx;
          b.vy += impulse * ny;

          a.state.asleep = 0;
          b.state.asleep = 0;
        }
      }
    }
  }
}

/** Reflects a particle off the field walls. Returns true on floor contact. */
export function resolveWalls(
  p: Particle,
  width: number,
  height: number,
  restitution: number,
  floorRestitution = restitution,
): boolean {
  const r = radiusOf(p);
  let onFloor = false;

  if (p.x - r < 0) {
    p.x = r;
    p.vx = Math.abs(p.vx) * restitution;
  } else if (p.x + r > width) {
    p.x = width - r;
    p.vx = -Math.abs(p.vx) * restitution;
  }

  if (p.y - r < 0) {
    p.y = r;
    p.vy = Math.abs(p.vy) * restitution;
  } else if (p.y + r > height) {
    p.y = height - r;
    p.vy = -Math.abs(p.vy) * floorRestitution;
    onFloor = true;
  }

  return onFloor;
}
