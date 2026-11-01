/**
 * 01 · Static scatter — "Shapes hold their position and lean away from the
 * cursor, then settle back."
 *
 * No time dependence at all, so it is a valid still background at speed 0 or
 * under reduced motion. The safest default for text-heavy sections.
 */
import type { MotionPreset } from '../types.js';
import { repulsion, spring } from './util.js';

const RADIUS = 180;
const MAX_PUSH = 36;
const STIFFNESS = 90;

export const staticScatter: MotionPreset = {
  id: 'static',
  init(p) {
    p.state.vx = 0;
    p.state.vy = 0;
  },
  step(p, ctx, dt) {
    const { dx, dy } = ctx.interactive
      ? repulsion(p, ctx.pointer, RADIUS, MAX_PUSH)
      : { dx: 0, dy: 0 };

    const sx = spring(p.x, p.homeX + dx, p.state.vx ?? 0, STIFFNESS, dt);
    const sy = spring(p.y, p.homeY + dy, p.state.vy ?? 0, STIFFNESS, dt);
    p.x = sx.value;
    p.state.vx = sx.velocity;
    p.y = sy.value;
    p.state.vy = sy.velocity;
  },
};
