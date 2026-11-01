/**
 * The base shape pack — 13 geometric primitives.
 *
 * Ported from the original design-canvas library. Every domain needs these, so
 * they live in core rather than a pack. Domain objects (controllers, trophies,
 * charts) belong in packs.
 *
 * Renderers emit SVG strings with a single viewBox and no width/height, no
 * `id` attributes and no `<style>` — shapes are inlined many times over, so an
 * `id` would collide and CSS would leak.
 */
import type { ShapeColors, ShapeDef, ShapePack } from './types.js';

const svg = (viewBox: string, body: string): string =>
  `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ` +
  `style="display:block;width:100%;height:100%;overflow:visible">${body}</svg>`;

const geo = (
  id: string,
  label: string,
  ar: number,
  render: (c: ShapeColors) => string,
  scale?: number,
): ShapeDef => (scale === undefined
  ? { id, label, kind: 'geo', ar, render }
  : { id, label, kind: 'geo', ar, scale, render });

/** APPEND-ONLY. Order defines seed stability — never reorder or remove. */
export const BASE_SHAPES: ShapeDef[] = [
  geo('circle', 'Circle', 1, (c) =>
    svg('0 0 100 100', `<circle cx="50" cy="50" r="48" fill="${c.f}"/>`)),

  geo('ring', 'Ring', 1, (c) =>
    svg('0 0 100 100', `<circle cx="50" cy="50" r="41" fill="none" stroke="${c.f}" stroke-width="14"/>`)),

  geo('triangle', 'Triangle', 1, (c) =>
    svg('0 0 100 100', `<polygon points="50,6 96,92 4,92" fill="${c.f}"/>`)),

  geo('square', 'Square', 1, (c) =>
    svg('0 0 100 100', `<rect x="6" y="6" width="88" height="88" fill="${c.f}"/>`)),

  geo('frame', 'Frame', 1, (c) =>
    svg('0 0 100 100', `<rect x="10" y="10" width="80" height="80" fill="none" stroke="${c.f}" stroke-width="13"/>`)),

  geo('plus', 'Plus', 1, (c) =>
    svg('0 0 100 100', `<path d="M37 4h26v33h33v26H63v33H37V63H4V37h33z" fill="${c.f}"/>`), 0.8),

  geo('half', 'Half moon', 2, (c) =>
    svg('0 0 100 50', `<path d="M2 50a48 48 0 0 1 96 0z" fill="${c.f}"/>`)),

  geo('quarter', 'Quarter', 1, (c) =>
    svg('0 0 100 100', `<path d="M4 96V4a92 92 0 0 1 92 92z" fill="${c.f}"/>`)),

  geo('arch', 'Arch', 1, (c) =>
    svg('0 0 100 100', `<path d="M8 96V50a42 42 0 0 1 84 0v46H68V50a18 18 0 0 0-36 0v46z" fill="${c.f}"/>`)),

  geo('pill', 'Pill', 2.4, (c) =>
    svg('0 0 120 50', `<rect x="2" y="2" width="116" height="46" rx="23" fill="${c.f}"/>`)),

  geo('spark', 'Spark', 1, (c) =>
    svg('0 0 100 100', `<path d="M50 0C54 36 64 46 100 50C64 54 54 64 50 100C46 64 36 54 0 50C36 46 46 36 50 0z" fill="${c.f}"/>`)),

  geo('zigzag', 'Zigzag', 2, (c) =>
    svg('0 0 120 60', `<polyline points="6,50 28,12 50,50 72,12 94,50 114,14" fill="none" stroke="${c.f}" stroke-width="11" stroke-linejoin="miter" stroke-linecap="square"/>`)),

  geo('dots', 'Dot grid', 1, (c) =>
    svg('0 0 100 100', [18, 50, 82]
      .map((y) => [18, 50, 82].map((x) => `<circle cx="${x}" cy="${y}" r="11" fill="${c.f}"/>`).join(''))
      .join('')), 0.8),
];

/**
 * Core's default theme is deliberately brand-neutral grey. A library that
 * ships someone else's brand colours as the default paints every adopter's
 * site in them — see spec Q3.
 */
export const BASE_PACK: ShapePack = {
  id: 'base',
  name: 'Base',
  version: '0.1.0',
  shapes: BASE_SHAPES,
  themes: {
    dark: [
      { f: '#f2f2f2', d: '#121212', w: 3 },
      { f: '#8a8a8a', d: '#121212', w: 3 },
      { f: '#454545', d: '#f2f2f2', w: 2 },
    ],
    light: [
      { f: '#121212', d: '#f2f2f2', w: 3 },
      { f: '#6b6b6b', d: '#f2f2f2', w: 3 },
      { f: '#c9c9c9', d: '#121212', w: 2 },
    ],
    mono: [
      { f: '#f2f2f2', d: '#121212', w: 2 },
      { f: '#454545', d: '#f2f2f2', w: 2 },
    ],
  },
};

/** Wraps a body in the standard shape <svg>. Exported for pack authors. */
export const svgWrap = svg;

/** Stroke-only attribute block with round caps — the common pack idiom. */
export const stroke = (color: string, width: number): string =>
  `fill="none" stroke="${color}" stroke-width="${width}" ` +
  `stroke-linecap="round" stroke-linejoin="round"`;

/** The four-point sparkle path, reused across packs. */
export const SPARK_PATH =
  'M50 0C54 36 64 46 100 50C64 54 54 64 50 100C46 64 36 54 0 50C36 46 46 36 50 0z';
