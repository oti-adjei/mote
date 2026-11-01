/**
 * Mote — shape pack starter.
 *
 * A pack is one file: plain data and pure functions. No build step, no
 * registration, no changes to Mote itself. Pass it as `packs={[myPack]}`.
 *
 * The six authoring rules, each of which `validatePack()` checks:
 *
 *   1. APPEND ONLY. Never reorder or remove a shape in a published pack —
 *      it changes the layout of every seed anyone has already used.
 *   2. Use `c.f` (fill) and `c.d` (detail). Hardcoded colours ignore themes.
 *   3. One viewBox, no width/height on the root <svg>. Size comes from the
 *      field. Inner elements may of course carry geometry.
 *   4. Declare `ar` honestly — layout uses it for spacing and collision.
 *   5. No `id` attributes, no <style>, no external references. Shapes are
 *      inlined many times over: ids collide and CSS leaks.
 *   6. Readable at 40px. Default size is 64 and depth shrinks it further.
 */
import { validatePack, type ShapeColors, type ShapePack } from '@usemote/core';

const svg = (viewBox: string, body: string): string =>
  `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ` +
  `style="display:block;width:100%;height:100%;overflow:visible">${body}</svg>`;

export const myPack: ShapePack = {
  id: 'my-pack',
  name: 'My Pack',
  version: '0.1.0',

  shapes: [
    {
      id: 'terminal',
      label: 'Terminal',
      kind: 'obj',
      ar: 1.4,
      render: (c: ShapeColors) =>
        svg('0 0 140 100',
          `<rect width="140" height="100" rx="12" fill="${c.f}"/>` +
          `<path d="M26 44l14 12-14 12" stroke="${c.d}" stroke-width="8" fill="none" ` +
          `stroke-linecap="round" stroke-linejoin="round"/>` +
          `<rect x="62" y="64" width="40" height="8" rx="4" fill="${c.d}"/>`),
    },
    {
      id: 'branch',
      label: 'Branch',
      kind: 'obj',
      ar: 1,
      scale: 0.9,
      render: (c: ShapeColors) =>
        svg('0 0 100 100',
          `<circle cx="28" cy="22" r="12" fill="${c.f}"/>` +
          `<circle cx="28" cy="78" r="12" fill="${c.f}"/>` +
          `<circle cx="74" cy="50" r="12" fill="${c.f}"/>` +
          `<path d="M28 34v32M28 50h22a12 12 0 0 1 12-12v0" stroke="${c.f}" ` +
          `stroke-width="8" fill="none"/>`),
    },
  ],

  // Weights, not a flat palette. Give the quiet pairing the most weight so
  // most shapes sit back and accents stay sparse — that is most of what
  // makes a field read as designed rather than random.
  themes: {
    dark: [
      { f: '#7dd3fc', d: '#0c0a09', w: 3 },
      { f: '#f5f5f4', d: '#0c0a09', w: 3 },
      { f: '#44403c', d: '#f5f5f4', w: 2 },
    ],
  },
};

// Run this once while authoring — it catches the mistakes that are otherwise
// invisible until a shape appears twice or someone switches theme.
if (process.env.NODE_ENV !== 'production') {
  const issues = validatePack(myPack);
  if (issues.length > 0) console.warn('[my-pack]', issues);
}

export default myPack;
