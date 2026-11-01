/**
 * 07 · Gravity pile — "Everything drops and piles at the bottom. Click to toss
 * it back up; the cursor pushes pieces around."
 *
 * The detail that makes or breaks this preset is sleeping. Without it a
 * settled pile jitters forever: contacts keep firing tiny impulses, nothing
 * ever reaches exact rest, and the result is a visibly buzzing heap that also
 * burns frame time for no visual gain. Particles that are slow, floor-
 * supported and stable for a few frames are therefore put to sleep and woken
 * only by a collision, the pointer, or a throw.
 */
import type { FieldContext, MotionPreset, Particle } from '../types.js';
import { resolvePairs, resolveWalls, radiusOf } from './collide.js';

const G = 900;
const WALL_RESTITUTION = 0.5;
const FLOOR_RESTITUTION = 0.35;
const FLOOR_FRICTION = 0.85;
const SLEEP_SPEED = 14;
const SLEEP_FRAMES = 12;
const POINTER_RADIUS = 80;
const POINTER_FORCE = 900;
const THROW_FORCE = 620;

function wake(p: Particle): void {
  p.state.asleep = 0;
  p.state.still = 0;
}

export const gravity: MotionPreset = {
  id: 'gravity',
  init(p, _ctx, rand) {
    // Particles start where layout put them — inside the field — and fall
    // from there. An earlier version lifted them above the top edge for a
    // nicer drop-in, but frame 0 is what SSR and reduced-motion users get,
    // and no loop ever runs for them: the field rendered permanently empty.
    // A visible scatter that settles is worth more than an entrance nobody
    // with reduced motion can see.
    p.vx = (rand() - 0.5) * 40;
    p.vy = 0;
    p.state.rotSpeed = (rand() - 0.5) * 60;
    p.state.asleep = 0;
    p.state.still = 0;
  },
  step(p, ctx, dt) {
    const pointerActive = ctx.interactive && ctx.pointer.inside;

    if (pointerActive) {
      const dx = p.x - ctx.pointer.x;
      const dy = p.y - ctx.pointer.y;
      const dist = Math.hypot(dx, dy);
      const reach = POINTER_RADIUS + radiusOf(p);
      if (dist < reach && dist > 0) {
        const push = (1 - dist / reach) * POINTER_FORCE * dt;
        p.vx += (dx / dist) * push;
        p.vy += (dy / dist) * push;
        wake(p);
      }
    }

    if (p.state.asleep === 1) {
      p.homeX = p.x;
      p.homeY = p.y;
      return;
    }

    p.vy += G * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    const onFloor = resolveWalls(
      p, ctx.width, ctx.height, WALL_RESTITUTION, FLOOR_RESTITUTION,
    );
    if (onFloor) p.vx *= FLOOR_FRICTION;

    p.rot += (p.state.rotSpeed ?? 0) * dt;

    // Sleep only when slow AND floor-supported AND stable for a few frames.
    // All three matter: a slow particle mid-air is still falling, and a single
    // slow frame happens at the top of every bounce.
    const speed = Math.hypot(p.vx, p.vy);
    const supported = onFloor || p.y + radiusOf(p) >= ctx.height - 1;
    if (speed < SLEEP_SPEED && supported) {
      const still = (p.state.still ?? 0) + 1;
      p.state.still = still;
      if (still > SLEEP_FRAMES) {
        p.state.asleep = 1;
        p.vx = 0;
        p.vy = 0;
      }
    } else {
      p.state.still = 0;
    }

    p.homeX = p.x;
    p.homeY = p.y;
  },
  stepAll(particles) {
    resolvePairs(particles, { restitution: FLOOR_RESTITUTION });
  },
  onPointerDown(ctx: FieldContext) {
    for (const p of ctx.particles as Particle[]) {
      const dx = p.x - ctx.pointer.x;
      const dy = p.y - ctx.pointer.y;
      const dist = Math.max(40, Math.hypot(dx, dy));
      const force = (THROW_FORCE * 140) / (dist * dist);
      p.vx += (dx / dist) * force * 40;
      p.vy += (dy / dist) * force * 40 - THROW_FORCE * 0.5;
      wake(p);
    }
  },
};
