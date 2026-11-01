/**
 * Mote esports pack — 16 recognisable objects from competitive gaming.
 *
 * Ported from the original design-canvas library, with two deliberate changes:
 *
 * 1. The keycap's shadow overlay used a hardcoded `#000`. It now derives from
 *    `c.d`, so the shape themes correctly instead of going muddy on a light
 *    or lime ground.
 * 2. Text-bearing shapes declare a full fallback stack rather than naming one
 *    font. A consumer who hasn't loaded Schibsted Grotesk still gets a
 *    readable glyph instead of whatever the browser picks for an unknown
 *    family.
 */
import type { ShapeColors, ShapeDef, ShapePack, ThemeStop } from '@usemote/core';

const S = (viewBox: string, body: string): string =>
  `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ` +
  `style="display:block;width:100%;height:100%;overflow:visible">${body}</svg>`;

/** Text in a background shape must survive the font not being loaded. */
const FONT = "'Schibsted Grotesk',system-ui,-apple-system,'Helvetica Neue',sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

const HEART_ROWS = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];

const heart = (f: string): string =>
  HEART_ROWS.map((row, y) =>
    [...row]
      .map((ch, x) =>
        ch === 'X'
          ? `<rect x="${x * 14}" y="${y * 14}" width="14.4" height="14.4" fill="${f}"/>`
          : '',
      )
      .join(''),
  ).join('');

const obj = (
  id: string,
  label: string,
  ar: number,
  render: (c: ShapeColors, variant?: string) => string,
  extra: { scale?: number; variants?: string[] } = {},
): ShapeDef => {
  const base = { id, label, kind: 'obj' as const, ar, render };
  if (extra.scale !== undefined && extra.variants !== undefined) {
    return { ...base, scale: extra.scale, variants: extra.variants };
  }
  if (extra.scale !== undefined) return { ...base, scale: extra.scale };
  if (extra.variants !== undefined) return { ...base, variants: extra.variants };
  return base;
};

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const ESPORTS_SHAPES: ShapeDef[] = [
  obj('controller', 'Controller', 1.5, (c) =>
    S('0 0 120 80',
      `<path d="M34 8h52c13 0 21 7 24 20l7 30c3 12-4 20-14 20-7 0-11-4-15-10l-5-8H37l-5 8c-4 6-8 10-15 10C7 78 0 70 3 58l7-30C13 15 21 8 34 8z" fill="${c.f}"/>` +
      `<path d="M26 26h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="${c.d}"/>` +
      `<circle cx="90" cy="28" r="5" fill="${c.d}"/><circle cx="100" cy="38" r="5" fill="${c.d}"/>` +
      `<circle cx="90" cy="48" r="5" fill="${c.d}"/><circle cx="80" cy="38" r="5" fill="${c.d}"/>` +
      `<rect x="52" y="20" width="16" height="5" rx="2.5" fill="${c.d}" opacity=".45"/>`),
    { scale: 1.3 }),

  obj('trophy', 'Trophy', 1, (c) =>
    S('0 0 100 100',
      `<path d="M27 15H13v7c0 11 7 18 16 18" fill="none" stroke="${c.f}" stroke-width="7"/>` +
      `<path d="M73 15h14v7c0 11-7 18-16 18" fill="none" stroke="${c.f}" stroke-width="7"/>` +
      `<path d="M27 8h46v24c0 15-10 26-23 26S27 47 27 32z" fill="${c.f}"/>` +
      `<rect x="44" y="56" width="12" height="17" fill="${c.f}"/>` +
      `<rect x="32" y="72" width="36" height="9" fill="${c.f}"/>` +
      `<rect x="25" y="83" width="50" height="11" rx="2" fill="${c.f}"/>` +
      `<text x="50" y="39" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="26" fill="${c.d}">1</text>`),
    { scale: 1.1 }),

  obj('keycap', 'Keycap', 1, (c, v) =>
    S('0 0 100 100',
      `<rect x="4" y="10" width="92" height="86" rx="16" fill="${c.f}"/>` +
      // Shadow derived from the detail colour, not a hardcoded black.
      `<rect x="4" y="10" width="92" height="86" rx="16" fill="${c.d}" opacity=".25"/>` +
      `<rect x="12" y="4" width="76" height="74" rx="12" fill="${c.f}" stroke="${c.d}" stroke-opacity=".15" stroke-width="2"/>` +
      `<text x="50" y="54" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="36" fill="${c.d}">${v ?? 'W'}</text>`),
    { scale: 0.85, variants: ['W', 'A', 'S', 'D'] }),

  obj('crosshair', 'Crosshair', 1, (c) =>
    S('0 0 100 100',
      `<circle cx="50" cy="50" r="32" fill="none" stroke="${c.f}" stroke-width="8"/>` +
      `<path d="M50 2v26M50 72v26M2 50h26M72 50h26" stroke="${c.f}" stroke-width="8"/>` +
      `<circle cx="50" cy="50" r="6" fill="${c.f}"/>`)),

  obj('cursor', 'Cursor', 0.9, (c) =>
    S('0 0 90 100',
      `<path d="M14 4v78l20-18 14 32 15-7-14-31h28z" fill="${c.f}" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>`),
    { scale: 0.8 }),

  obj('medal', 'Medal', 1, (c) =>
    S('0 0 100 100',
      `<polygon points="28,4 46,4 58,38 40,38" fill="${c.f}" opacity=".55"/>` +
      `<polygon points="72,4 54,4 42,38 60,38" fill="${c.f}" opacity=".8"/>` +
      `<circle cx="50" cy="64" r="30" fill="${c.f}"/>` +
      `<circle cx="50" cy="64" r="21" fill="none" stroke="${c.d}" stroke-width="3" opacity=".45"/>` +
      `<polygon points="50,52 52.9,60 61.4,60.3 54.8,65.5 57.1,73.7 50,69 42.9,73.7 45.2,65.5 38.6,60.3 47.1,60" fill="${c.d}"/>`),
    { scale: 1.05 }),

  obj('headset', 'Headset', 1, (c) =>
    S('0 0 100 100',
      `<path d="M16 58V46a34 34 0 0 1 68 0v12" fill="none" stroke="${c.f}" stroke-width="9" stroke-linecap="round"/>` +
      `<rect x="8" y="50" width="22" height="34" rx="9" fill="${c.f}"/>` +
      `<rect x="70" y="50" width="22" height="34" rx="9" fill="${c.f}"/>` +
      `<path d="M19 82c0 10 10 12 22 12" fill="none" stroke="${c.f}" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="44" cy="94" r="5" fill="${c.f}"/>`),
    { scale: 1.1 }),

  obj('gg', 'GG sticker', 1.6, (c) =>
    S('0 0 120 75',
      `<rect x="3" y="3" width="114" height="69" rx="34" fill="${c.f}"/>` +
      `<text x="60" y="51" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" letter-spacing="-2" fill="${c.d}">GG</text>`),
    { scale: 1.1 }),

  obj('score', 'Score tag', 2.33, (c) =>
    S('0 0 140 60',
      `<rect x="2" y="2" width="136" height="56" rx="8" fill="${c.f}"/>` +
      `<text x="16" y="36" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${c.d}" opacity=".7">FINAL</text>` +
      `<text x="124" y="42" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="30" fill="${c.d}">3–1</text>`),
    { scale: 1.4 }),

  obj('live', 'Live tag', 2.4, (c) =>
    S('0 0 120 50',
      `<rect x="2" y="2" width="116" height="46" rx="6" fill="${c.f}"/>` +
      `<circle cx="24" cy="25" r="7" fill="${c.d}"/>` +
      `<text x="40" y="33" font-family="${MONO}" font-weight="500" font-size="20" letter-spacing="3" fill="${c.d}">LIVE</text>`),
    { scale: 1.2 }),

  obj('dpad', 'D-pad', 1, (c) =>
    S('0 0 100 100',
      `<path d="M36 4h28v32h32v28H64v32H36V64H4V36h32z" fill="${c.f}"/>` +
      `<g fill="${c.d}" opacity=".5">` +
      `<polygon points="50,12 58,24 42,24"/><polygon points="50,88 42,76 58,76"/>` +
      `<polygon points="12,50 24,42 24,58"/><polygon points="88,50 76,58 76,42"/></g>`)),

  obj('coin', 'Coin', 1, (c) =>
    S('0 0 100 100',
      `<circle cx="50" cy="50" r="46" fill="${c.f}"/>` +
      `<circle cx="50" cy="50" r="36" fill="none" stroke="${c.d}" stroke-width="3" opacity=".35"/>` +
      `<text x="50" y="63" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${c.d}">P</text>`),
    { scale: 0.85 }),

  obj('joystick', 'Joystick', 1, (c) =>
    S('0 0 100 100',
      `<rect x="46" y="30" width="8" height="44" fill="${c.f}"/>` +
      `<circle cx="50" cy="24" r="18" fill="${c.f}"/>` +
      `<rect x="14" y="70" width="72" height="24" rx="8" fill="${c.f}"/>` +
      `<circle cx="72" cy="82" r="5" fill="${c.d}"/>`)),

  obj('heart', 'Pixel heart', 98 / 84, (c) => S('0 0 98 84', heart(c.f)), { scale: 0.85 }),

  obj('ping', 'Ping bars', 1, (c) =>
    S('0 0 100 100',
      [25, 45, 65, 88]
        .map((h, k) =>
          `<rect x="${8 + k * 24}" y="${96 - h}" width="16" height="${h}" fill="${c.f}"` +
          `${k === 3 ? ' opacity=".35"' : ''}/>`)
        .join('')),
    { scale: 0.8 }),

  obj('bracket', 'Bracket', 1.25, (c) =>
    S('0 0 100 80',
      `<path d="M6 14h30v26h28M6 66h30V40M64 40h30" fill="none" stroke="${c.f}" stroke-width="8"/>` +
      `<circle cx="94" cy="40" r="6" fill="${c.f}"/>`),
    { scale: 1.1 }),
];

/**
 * Brand palette for the esports publication this pack came from.
 * lime #d4ff1e · ink #121212 · bone #f2f2ee
 *
 * Weights, not a flat palette: the low-contrast stop is heaviest so most
 * shapes sit back and the lime stays an accent.
 */
export const ESPORTS_THEMES: Record<string, ThemeStop[]> = {
  dark: [
    { f: '#d4ff1e', d: '#121212', w: 3 },
    { f: '#f2f2ee', d: '#121212', w: 3 },
    { f: '#4a4a45', d: '#f2f2ee', w: 2 },
  ],
  light: [
    { f: '#d4ff1e', d: '#121212', w: 3 },
    { f: '#121212', d: '#d4ff1e', w: 3 },
    { f: '#bdbcb4', d: '#121212', w: 2 },
  ],
  lime: [
    { f: '#121212', d: '#d4ff1e', w: 3 },
    { f: '#f2f2ee', d: '#121212', w: 2 },
  ],
  // Alias of `lime`, so every pack answers to the same four theme names.
  // Added rather than renamed: `lime` is this pack's own vocabulary and
  // removing it would change layouts for anyone already using it.
  accent: [
    { f: '#121212', d: '#d4ff1e', w: 3 },
    { f: '#f2f2ee', d: '#121212', w: 2 },
  ],
  mono: [
    { f: '#f2f2ee', d: '#121212', w: 2 },
    { f: '#4a4a45', d: '#f2f2ee', w: 2 },
  ],
};

export const esports: ShapePack = {
  id: 'esports',
  name: 'Esports',
  version: '0.1.0',
  description:
    'Controllers, trophies, keycaps and score tags. Lime on near-black, the Publication palette.',
  shapes: ESPORTS_SHAPES,
  themes: ESPORTS_THEMES,
  swatches: ['#121212', '#d4ff1e', '#f2f2ee', '#4a4a45'],
  background: { dark: '#121212', light: '#efeee8', accent: '#d4ff1e', lime: '#d4ff1e', mono: '#121212' },
  ink: { dark: '#f2f2ee', light: '#121212', accent: '#121212', lime: '#121212', mono: '#f2f2ee' },
  font: { stack: "'Schibsted Grotesk',system-ui,sans-serif", name: 'Schibsted Grotesk', weight: 900 },
  demo: {
    a: { mode: 'bob', count: 10, size: 86, seed: 4, avoid: 'center' },
    b: { mode: 'drift', count: 30, size: 46, seed: 31, depth: true },
  },
};

export default esports;
