/**
 * 04 · Drift — "Slow wandering in every direction. Far shapes are smaller,
 * slower and softly blurred."
 *
 * Constant-velocity wander with a slowly rotating heading, so paths curve
 * instead of running dead straight, and wrap-around on all four edges.
 */
import type { MotionPreset } from '../types.js';
import { TAU, repulsion, wrap } from './util.js';
import { depthSpeed } from '../layout.js';

export const drift: MotionPreset = {
  id: 'drift',
  init(p, _ctx, rand) {
    p.state.heading = rand() * TAU;
    p.state.speed = 6 + rand() * 12;
    p.state.turn = (rand() - 0.5) * 0.1;       // rad/s, ≤ ~6°/s
    p.state.rotSpeed = (rand() - 0.5) * 12;    // deg/s
  },
  step(p, ctx, dt) {
    const heading = (p.state.heading ?? 0) + (p.state.turn ?? 0) * dt;
    p.state.heading = heading;

    const speed = (p.state.speed ?? 10) * depthSpeed(p);
    p.homeX += Math.cos(heading) * speed * dt;
    p.homeY += Math.sin(heading) * speed * dt;

    p.homeX = wrap(p.homeX, p.w, ctx.width);
    p.homeY = wrap(p.homeY, p.h, ctx.height);

    const { dx, dy } = ctx.interactive
      ? repulsion(p, ctx.pointer, 170, 30)
      : { dx: 0, dy: 0 };

    p.x = p.homeX + dx;
    p.y = p.homeY + dy;
    p.rot += (p.state.rotSpeed ?? 0) * dt;
  },
};
