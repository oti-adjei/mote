/** Motion preset registry. */
import type { Direction, MotionId, MotionPreset } from '../types.js';
import { staticScatter } from './static.js';
import { bob } from './bob.js';
import { hop } from './hop.js';
import { drift } from './drift.js';
import { across, makeAcross } from './across.js';
import { bounce } from './bounce.js';
import { gravity } from './gravity.js';

export const PRESETS: Record<MotionId, MotionPreset> = {
  static: staticScatter,
  bob,
  hop,
  drift,
  across,
  bounce,
  gravity,
};

/**
 * Resolves `mode` to a preset. A preset object passed directly wins over any
 * built-in sharing its id, which is what makes custom motion possible without
 * registering anything globally.
 */
export function resolvePreset(
  mode: MotionId | MotionPreset | undefined,
  direction: Direction = 'right',
): MotionPreset {
  if (mode && typeof mode === 'object') return mode;
  if (mode === 'across') return makeAcross(direction);
  return PRESETS[(mode as MotionId) ?? 'drift'] ?? drift;
}

export { staticScatter, bob, hop, drift, across, makeAcross, bounce, gravity };
export { radiusOf, resolvePairs, resolveWalls } from './collide.js';
export * from './util.js';
