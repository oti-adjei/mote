/** Environment probes, each safe to call during SSR. */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    // Some embedded webviews throw on unknown media features.
    return false;
  }
}

export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

export function devWarn(msg: string): void {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return;
  if (typeof console !== 'undefined') console.warn(msg);
}
