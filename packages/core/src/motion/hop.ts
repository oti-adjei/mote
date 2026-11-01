/**
 * 03 · Hop in place — "Each piece bounces on its spot with a small squash on
 * landing, out of step with its neighbours."
 *
 * Per-particle ballistic cycle. The squash is volume-preserving (x stretches
 * as y compresses) so the shape reads as having weight rather than simply
 * getting shorter.
 */
import type { MotionPreset } from '../types.js';
import { clamp } from './util.js';

const SQUASH_WINDOW = 0.12;
const SQUASH_Y = 0.82;
const SQUASH_X = 1.12;

export const hop: MotionPreset = {
  id: 'hop',
  init(p, _ctx, rand) {
    p.state.cycle = 1.1 + rand() * 0.7;
    p.state.height = p.h * 0.35;
  },
  step(p, ctx) {
    const cycle = p.state.cycle ?? 1.4;
    const height = p.state.height ?? 20;

    // `phase` is stratified at layout time, which is what delivers the
    // "out of step with its neighbours" requirement at low counts.
    const local = ((ctx.t + p.phase * cycle) % cycle) / cycle;

    // Parabola peaking mid-cycle.
    const lift = 4 * height * local * (1 - local);
    p.y = p.homeY - lift;
    p.x = p.homeX;

    if (local < SQUASH_WINDOW) {
      const k = 1 - local / SQUASH_WINDOW;     // 1 at landing → 0
      p.state.scaleY = 1 - (1 - SQUASH_Y) * k;
      p.state.scaleX = 1 + (SQUASH_X - 1) * k;
    } else {
      p.state.scaleY = 1;
      p.state.scaleX = 1;
    }
    p.scale = clamp(p.state.scaleY ?? 1, 0.5, 1.5);
  },
};
