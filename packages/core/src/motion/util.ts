/** Shared helpers for motion presets. */
import type { Particle, Pointer } from '../types.js';

export const TAU = Math.PI * 2;

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Critically-damped spring step toward a target.
 *
 * Critically damped (not under-damped) on purpose: shapes return to rest
 * cleanly instead of wobbling, which is what "settle back" means in the spec
 * and what keeps a background from drawing attention to itself.
 */
export function spring(
  current: number,
  target: number,
  velocity: number,
  stiffness: number,
  dt: number,
): { value: number; velocity: number } {
  const damping = 2 * Math.sqrt(stiffness);
  const accel = (target - current) * stiffness - velocity * damping;
  const v = velocity + accel * dt;
  return { value: current + v * dt, velocity: v };
}

/**
 * Pointer repulsion offset, falling off quadratically to zero at `radius`.
 * Returns the offset to add, not a new position.
 */
export function repulsion(
  p: Particle,
  pointer: Pointer,
  radius: number,
  maxPush: number,
): { dx: number; dy: number } {
  if (!pointer.inside) return { dx: 0, dy: 0 };
  const dx = p.homeX - pointer.x;
  const dy = p.homeY - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius || dist === 0) return { dx: 0, dy: 0 };
  const falloff = 1 - dist / radius;
  const push = falloff * falloff * maxPush;
  return { dx: (dx / dist) * push, dy: (dy / dist) * push };
}

/** Wraps a position around the field with a margin of the shape's own size. */
export function wrap(v: number, extent: number, limit: number): number {
  const margin = extent / 2;
  if (v < -margin) return limit + margin;
  if (v > limit + margin) return -margin;
  return v;
}
