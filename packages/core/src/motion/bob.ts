/**
 * 02 · Bob in place — "A slow float with a slight sway. Keeps the centre clear
 * for a headline."
 *
 * Independent sine oscillation per particle. The x sway runs at roughly half
 * the amplitude on a different frequency, so the path is a lazy Lissajous
 * rather than a vertical bob — that asymmetry is what stops a field of these
 * from reading as a row of pistons.
 */
import type { MotionPreset } from '../types.js';
import { TAU, repulsion } from './util.js';

export const bob: MotionPreset = {
  id: 'bob',
  init(p, _ctx, rand) {
    p.state.ampY = 8 + rand() * 6;
    p.state.wY = 0.4 + rand() * 0.3;
    p.state.wX = 0.25 + rand() * 0.25;
    p.state.rotAmp = 3 + rand() * 2;
  },
  step(p, ctx) {
    const phase = p.phase * TAU;
    const ampY = p.state.ampY ?? 10;
    const wY = p.state.wY ?? 0.5;
    const wX = p.state.wX ?? 0.35;

    const { dx, dy } = ctx.interactive
      ? repulsion(p, ctx.pointer, 160, 24)
      : { dx: 0, dy: 0 };

    p.y = p.homeY + Math.sin(ctx.t * wY + phase) * ampY + dy;
    p.x = p.homeX + Math.sin(ctx.t * wX + phase * 1.7) * ampY * 0.5 + dx;
    p.rot = Math.sin(ctx.t * wY * 0.8 + phase) * (p.state.rotAmp ?? 4);
  },
};
