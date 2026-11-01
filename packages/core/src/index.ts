/**
 * Mote — deterministic floating-shape background fields.
 *
 * @example
 * ```ts
 * import { createField } from '@usemote/core';
 * createField(document.querySelector('#bg')!, {
 *   mode: 'bob', set: 'geo', count: 12, avoid: 'center',
 * });
 * ```
 */
export { createField } from './field.js';
export { renderFieldHTML, renderFieldSVG, renderParticles, transformOf } from './render/string.js';
export { createDomRenderer } from './render/dom.js';
export { layout, resolveAvoid, clampCount, depthSpeed, DEFAULTS, COUNT_WARN_THRESHOLD } from './layout.js';
export { BASE_PACK, BASE_SHAPES, svgWrap, stroke, SPARK_PATH } from './shapes.js';
export { resolveTheme, pickColors, altColor } from './themes.js';
export { allShapes, resolvePacks, resolvePool } from './pool.js';
export { PRESETS, resolvePreset, makeAcross } from './motion/index.js';
export { cyrb53, normaliseSeed, rng, range, rangeInt, pick, stratified } from './prng.js';
export { prefersReducedMotion, isBrowser } from './env.js';
export { register, activeCount, tickAllForTest } from './scheduler.js';
export { validatePack } from './validate.js';

export type {
  Anchor,
  AvoidId,
  Direction,
  FieldContext,
  FieldHandle,
  FieldOptions,
  MotionId,
  MotionPreset,
  Particle,
  Pointer,
  Rect,
  SetId,
  ShapeColors,
  ShapeDef,
  ShapePack,
  ThemeStop,
} from './types.js';
export type { Rng } from './prng.js';
export type { Tickable } from './scheduler.js';
export type { DomRenderer } from './render/dom.js';
export type { PackIssue } from './validate.js';
