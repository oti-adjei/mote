/**
 * Pack registry — the designer's editorial copy married to the real packs.
 *
 * Copy (tagline, audience, two-letter symbol) comes from the design export
 * and is preserved verbatim, per the handoff's "preserve real copy" rule.
 * Everything measurable — shape counts, themes, palettes, typefaces, demo
 * configurations — is read off the actual `ShapePack`, so the site cannot
 * drift from the library.
 */
import { BASE_PACK, type ShapeColors, type ShapePack } from '@usemote/core';
import { esports } from '@usemote/pack-esports';
import { space } from '@usemote/pack-space';
import { cyber } from '@usemote/pack-cyber';
import { health } from '@usemote/pack-health';
import { education } from '@usemote/pack-education';
import { devtools } from '@usemote/pack-devtools';
import { ai } from '@usemote/pack-ai';
import { fintech } from '@usemote/pack-fintech';
import { creative } from '@usemote/pack-creative';

export interface PackEntry {
  id: string;
  /** Zero-padded index, as the design numbers them. */
  n: string;
  /** Two-letter display mark, e.g. "es." */
  symbol: string;
  name: string;
  tagline: string;
  audience: string;
  pack: ShapePack;
}

export const PACKS: PackEntry[] = [
  { id: 'esports', n: '01', symbol: 'es.', name: 'Esports', pack: esports,
    tagline: 'Play with a competitive edge.',
    audience: 'Gaming and competitive communities.' },
  { id: 'space', n: '02', symbol: 'sp.', name: 'Space', pack: space,
    tagline: 'For ideas beyond the familiar.',
    audience: 'Exploration and space-inspired projects.' },
  { id: 'cyber', n: '03', symbol: 'cy.', name: 'Cyber', pack: cyber,
    tagline: 'A more technical kind of character.',
    audience: 'Security and digital infrastructure.' },
  { id: 'health', n: '04', symbol: 'he.', name: 'Health', pack: health,
    tagline: 'Make space for human care.',
    audience: 'Health and wellbeing experiences.' },
  { id: 'education', n: '05', symbol: 'ed.', name: 'Education', pack: education,
    tagline: 'A little curiosity goes a long way.',
    audience: 'Learning tools and educational projects.' },
  { id: 'devtools', n: '06', symbol: 'de.', name: 'Devtools', pack: devtools,
    tagline: 'Personality for the tools you build.',
    audience: 'Developer tools and technical products.' },
  { id: 'ai', n: '07', symbol: 'ai.', name: 'AI', pack: ai,
    tagline: 'Give new ideas a visual language.',
    audience: 'AI tools and emerging applications.' },
  { id: 'fintech', n: '08', symbol: 'fi.', name: 'Fintech', pack: fintech,
    tagline: 'A considered layer for finance.',
    audience: 'Financial products and services.' },
  { id: 'creative', n: '09', symbol: 'cr.', name: 'Creative', pack: creative,
    tagline: 'Room for a different point of view.',
    audience: 'Creative tools and expressive work.' },
];

export const BASE = BASE_PACK;

export const byId = (id: string | null): PackEntry | undefined =>
  PACKS.find((p) => p.id === id);

/** Every pack keyed by id, plus `base`, for the playground's picker. */
export const ALL_PACKS: Record<string, ShapePack> = {
  base: BASE_PACK,
  ...Object.fromEntries(PACKS.map((p) => [p.id, p.pack])),
};

export const TOTAL_SHAPES =
  PACKS.reduce((n, p) => n + p.pack.shapes.length, 0) + BASE_PACK.shapes.length;

/**
 * Everything a page needs to render a pack on its own ground.
 *
 * Packs declare `background`, `ink` and `themes`; not every pack declares
 * every theme. One helper rather than a fallback repeated at each call site,
 * so a pack that omits something degrades the same way everywhere.
 */
export interface PackSurface {
  bg: string;
  ink: string;
  /** Representative fill/detail pairs, for shape tiles and frame chrome. */
  palette: ShapeColors[];
}

const FALLBACK_BG = '#121212';
const FALLBACK_INK = '#f2f2ee';

export function packSurface(entry: PackEntry, theme = 'dark'): PackSurface {
  const stops = entry.pack.themes?.[theme] ?? entry.pack.themes?.dark ?? [];
  const all = stops.map((s) => s.f);
  return {
    bg: entry.pack.background?.[theme] ?? FALLBACK_BG,
    ink: entry.pack.ink?.[theme] ?? FALLBACK_INK,
    palette: stops.length
      ? stops.slice(0, 2).map((s) => ({ f: s.f, d: s.d, p: all }))
      : [{ f: FALLBACK_INK, d: FALLBACK_BG }],
  };
}
