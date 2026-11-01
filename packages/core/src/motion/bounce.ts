/**
 * 06 · Bounce — "Shapes ricochet off the walls and each other, like a
 * screensaver with collisions."
 *
 * Speed is clamped to a band so energy neither dies out nor runs away through
 * accumulated float error — a long-lived screensaver drifts both ways without
 * it, and a background that slowly freezes or slowly explodes is worse than
 * one that never moved.
 */
import type { MotionPreset } from '../types.js';
import { TAU, clamp } from './util.js';
import { resolvePairs, resolveWalls, radiusOf } from './collide.js';

const MIN_SPEED = 20;
const MAX_SPEED = 90;
const RESTITUTION = 0.95;
const POINTER_RADIUS = 90;
const POINTER_FORCE = 260;

export const bounce: MotionPreset = {
  id: 'bounce',
  init(p, _ctx, rand) {
    const heading = rand() * TAU;
    const speed = MIN_SPEED + rand() * (MAX_SPEED - MIN_SPEED);
    p.vx = Math.cos(heading) * speed;
    p.vy = Math.sin(heading) * speed;
    p.state.rotSpeed = (rand() - 0.5) * 40;
  },
  step(p, ctx, dt) {
    if (ctx.interactive && ctx.pointer.inside) {
      const dx = p.x - ctx.pointer.x;
      const dy = p.y - ctx.pointer.y;
      const dist = Math.hypot(dx, dy);
      const reach = POINTER_RADIUS + radiusOf(p);
      if (dist < reach && dist > 0) {
        const push = (1 - dist / reach) * POINTER_FORCE * dt;
        p.vx += (dx / dist) * push;
        p.vy += (dy / dist) * push;
      }
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    resolveWalls(p, ctx.width, ctx.height, RESTITUTION);

    const speed = Math.hypot(p.vx, p.vy);
    if (speed > 0) {
      const target = clamp(speed, MIN_SPEED, MAX_SPEED);
      if (target !== speed) {
        p.vx = (p.vx / speed) * target;
        p.vy = (p.vy / speed) * target;
      }
    }

    p.rot += (p.state.rotSpeed ?? 0) * dt;
    p.homeX = p.x;
    p.homeY = p.y;
  },
  stepAll(particles) {
    resolvePairs(particles, { restitution: RESTITUTION });
  },
};
