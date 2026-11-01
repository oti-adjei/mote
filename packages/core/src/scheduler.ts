/**
 * One requestAnimationFrame loop for every field on the page.
 *
 * Layered compositions (spec 06 §08) put two or more fields on one section.
 * Separate loops would double the per-frame overhead and let the layers drift
 * out of phase with each other. A single loop also gives one place to own the
 * global pause conditions.
 */
export interface Tickable {
  /** `dt` in seconds, already clamped. */
  tick(dt: number): void;
}

const tickables = new Set<Tickable>();
let frame: number | null = null;
let last = 0;

/**
 * Tab-switch and long-task stalls produce enormous dt values, which tunnel
 * particles through walls and make a gravity pile explode. Clamping to ~3
 * frames keeps a stall visually boring instead of destructive.
 */
const MAX_DT = 1 / 20;

function loop(now: number): void {
  const dt = last === 0 ? 1 / 60 : Math.min(MAX_DT, (now - last) / 1000);
  last = now;

  for (const t of tickables) t.tick(dt);

  frame = tickables.size > 0 ? requestAnimationFrame(loop) : null;
  if (frame === null) last = 0;
}

function start(): void {
  if (frame !== null || typeof requestAnimationFrame === 'undefined') return;
  if (typeof document !== 'undefined' && document.hidden) return;
  last = 0;
  frame = requestAnimationFrame(loop);
}

function stop(): void {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
  last = 0;
}

let visibilityBound = false;

function bindVisibility(): void {
  if (visibilityBound || typeof document === 'undefined') return;
  visibilityBound = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (tickables.size > 0) start();
  });
}

export function register(t: Tickable): () => void {
  bindVisibility();
  tickables.add(t);
  start();
  return () => {
    tickables.delete(t);
    if (tickables.size === 0) stop();
  };
}

/** Test seam — drives the loop deterministically without rAF. */
export function tickAllForTest(dt: number): void {
  for (const t of tickables) t.tick(dt);
}

export function activeCount(): number {
  return tickables.size;
}
