/**
 * The site's own theme, as inline `ThemeStop`s.
 *
 * The base pack ships brand-neutral greys on purpose — a library should not
 * paint an adopter's site in someone else's colours. That neutrality reads as
 * muddy against this site's blush ground, so decorative fields here pass
 * their own stops, which is exactly what the `theme` prop is for.
 *
 * Weighted the way a pack is: the quiet pairing carries the most, so plum and
 * pink stay accents rather than filling the field.
 */
import type { ThemeStop } from '@usemote/core';

/** Shapes on blush or stone. */
export const SITE_LIGHT: ThemeStop[] = [
  { f: '#b7a5ab', d: '#faf0f2', w: 4 },   // frame — the quiet majority
  { f: '#3f172a', d: '#f9dce5', w: 2 },   // plum
  { f: '#f45a8b', d: '#3f172a', w: 1 },   // pink, sparing
];

/** Shapes on the plum closing panels and other dark grounds. */
export const SITE_DARK: ThemeStop[] = [
  { f: '#795165', d: '#3f172a', w: 4 },
  { f: '#f9dce5', d: '#3f172a', w: 2 },
  { f: '#f45a8b', d: '#3f172a', w: 1 },
];
