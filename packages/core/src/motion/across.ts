/**
 * 05 · Across the screen — "A steady parade in one direction, re-entering on a
 * new line each pass."
 *
 * Re-entry has to stay deterministic, so the cross-axis position for pass N is
 * derived from (particle index, pass number) through the seeded generator
 * rather than a live random call. Same seed, same parade, every reload.
 */
import type { Direction, MotionPreset } from '../types.js';
import { cyrb53 } from '../prng.js';
import { depthSpeed } from '../layout.js';

const BASE_SPEED = 34;

function axisFor(direction: Direction): { ax: number; ay: number } {
  switch (direction) {
    case 'left': return { ax: -1, ay: 0 };
    case 'up': return { ax: 0, ay: -1 };
    case 'down': return { ax: 0, ay: 1 };
    default: return { ax: 1, ay: 0 };
  }
}

/** Stable pseudo-random in [0,1) for a given particle and pass. */
function passOffset(index: number, pass: number): number {
  return (cyrb53(`${index}:${pass}`) % 100000) / 100000;
}

export function makeAcross(direction: Direction = 'right'): MotionPreset {
  const { ax, ay } = axisFor(direction);
  const horizontal = ax !== 0;

  return {
    id: 'across',
    init(p, ctx, rand) {
      p.state.index = rand() * 1e6;
      p.state.pass = 0;
      p.state.speed = BASE_SPEED * (0.75 + rand() * 0.5);

      // Stagger along the axis of travel so the first pass doesn't arrive as
      // a wall. Layout's even scatter is 2D; this re-spreads along one axis.
      if (horizontal) p.homeX = rand() * ctx.width;
      else p.homeY = rand() * ctx.height;
    },
    step(p, ctx, dt) {
      const speed = (p.state.speed ?? BASE_SPEED) * depthSpeed(p);
      p.homeX += ax * speed * dt;
      p.homeY += ay * speed * dt;

      const marginX = p.w / 2;
      const marginY = p.h / 2;
      let exited = false;

      if (ax > 0 && p.homeX > ctx.width + marginX) { p.homeX = -marginX; exited = true; }
      else if (ax < 0 && p.homeX < -marginX) { p.homeX = ctx.width + marginX; exited = true; }
      else if (ay > 0 && p.homeY > ctx.height + marginY) { p.homeY = -marginY; exited = true; }
      else if (ay < 0 && p.homeY < -marginY) { p.homeY = ctx.height + marginY; exited = true; }

      if (exited) {
        const pass = (p.state.pass ?? 0) + 1;
        p.state.pass = pass;
        const t = passOffset(Math.floor(p.state.index ?? 0), pass);
        // "A new line each pass."
        if (horizontal) p.homeY = marginY + t * Math.max(0, ctx.height - p.h);
        else p.homeX = marginX + t * Math.max(0, ctx.width - p.w);
      }

      p.x = p.homeX;
      p.y = p.homeY;
    },
  };
}

export const across = makeAcross('right');
