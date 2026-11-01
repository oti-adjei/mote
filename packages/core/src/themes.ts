/**
 * Theme resolution.
 *
 * A theme is a weighted list of colour stops, not a flat palette. Weights are
 * what make a field read as designed rather than random: the low-contrast stop
 * carries more weight so most shapes sit back, and accents stay sparse.
 */
import type { Rng } from './prng.js';
import type { ShapeColors, ShapePack, ThemeStop } from './types.js';

const FALLBACK: ThemeStop[] = [
  { f: '#8a8a8a', d: '#121212', w: 1 },
];

/**
 * Resolves a theme name against the packs in play, last pack winning, so a
 * user-supplied pack can override a built-in theme name.
 */
export function resolveTheme(
  theme: string | ThemeStop[] | undefined,
  packs: readonly ShapePack[],
): ThemeStop[] {
  if (Array.isArray(theme)) return theme.length > 0 ? theme : FALLBACK;

  const name = theme ?? 'dark';
  for (let i = packs.length - 1; i >= 0; i--) {
    const found = packs[i]?.themes?.[name];
    if (found && found.length > 0) return found;
  }

  // An unknown name falls back rather than throwing: a background must never
  // be the reason a page fails to render.
  for (let i = packs.length - 1; i >= 0; i--) {
    const themes = packs[i]?.themes;
    if (themes) {
      const first = Object.values(themes)[0];
      if (first && first.length > 0) return first;
    }
  }
  return FALLBACK;
}

/** Weighted pick from the resolved stops. */
export function pickColors(stops: readonly ThemeStop[], r: Rng): ShapeColors {
  let total = 0;
  for (const s of stops) total += s.w > 0 ? s.w : 0;
  if (total <= 0) return { f: stops[0]?.f ?? '#8a8a8a', d: stops[0]?.d ?? '#121212' };

  let x = r() * total;
  for (const s of stops) {
    x -= s.w > 0 ? s.w : 0;
    if (x < 0) return { f: s.f, d: s.d };
  }
  const last = stops[stops.length - 1] as ThemeStop;
  return { f: last.f, d: last.d };
}
