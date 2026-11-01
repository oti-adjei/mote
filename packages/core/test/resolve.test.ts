import { describe, expect, it } from 'vitest';
import { resolvePool, allShapes, resolvePacks } from '../src/pool.js';
import { pickColors, resolveTheme } from '../src/themes.js';
import { BASE_PACK } from '../src/shapes.js';
import { rng } from '../src/prng.js';
import type { ShapePack } from '../src/types.js';

const extra: ShapePack = {
  id: 'extra',
  name: 'Extra',
  version: '1.0.0',
  shapes: [
    { id: 'blob', label: 'Blob', kind: 'obj', ar: 1, render: (c) => `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="${c.f}"/></svg>` },
  ],
  themes: { dark: [{ f: '#ff0000', d: '#000000', w: 1 }] },
};

describe('resolvePacks', () => {
  it('falls back to the base pack', () => {
    expect(resolvePacks(undefined, BASE_PACK)).toEqual([BASE_PACK]);
    expect(resolvePacks([], BASE_PACK)).toEqual([BASE_PACK]);
    expect(resolvePacks([extra], BASE_PACK)).toEqual([extra]);
  });
});

describe('resolvePool', () => {
  it('unions packs in order', () => {
    expect(allShapes([BASE_PACK, extra])).toHaveLength(BASE_PACK.shapes.length + 1);
  });

  it('filters by set', () => {
    expect(resolvePool([BASE_PACK], undefined, 'geo').every((s) => s.kind === 'geo')).toBe(true);
    expect(resolvePool([BASE_PACK, extra], undefined, 'objects').map((s) => s.id)).toEqual(['blob']);
  });

  it('lets shapes win over set', () => {
    const out = resolvePool([BASE_PACK], 'circle,square', 'objects');
    expect(out.map((s) => s.id)).toEqual(['circle', 'square']);
  });

  it('accepts an array and trims whitespace', () => {
    expect(resolvePool([BASE_PACK], [' circle ', 'ring'], 'mixed').map((s) => s.id))
      .toEqual(['circle', 'ring']);
  });

  it('warns about unknown ids but keeps the known ones', () => {
    const warnings: string[] = [];
    const out = resolvePool([BASE_PACK], 'circle,nope', 'mixed', (m) => warnings.push(m));
    expect(out.map((s) => s.id)).toEqual(['circle']);
    expect(warnings[0]).toContain('nope');
  });

  it('falls back to set when nothing matches', () => {
    const warnings: string[] = [];
    const out = resolvePool([BASE_PACK], 'nope1,nope2', 'geo', (m) => warnings.push(m));
    expect(out.length).toBe(BASE_PACK.shapes.length);
    expect(warnings.some((w) => w.includes('falling back'))).toBe(true);
  });

  it('degrades rather than rendering nothing', () => {
    // set="objects" against a geometry-only pack must still draw something.
    const warnings: string[] = [];
    const out = resolvePool([BASE_PACK], undefined, 'objects', (m) => warnings.push(m));
    expect(out.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes('no shapes of kind'))).toBe(true);
  });
});

describe('resolveTheme', () => {
  it('defaults to dark', () => {
    expect(resolveTheme(undefined, [BASE_PACK])).toEqual(BASE_PACK.themes!.dark);
  });

  it('passes inline stops through', () => {
    const stops = [{ f: '#1', d: '#2', w: 1 }];
    expect(resolveTheme(stops, [BASE_PACK])).toEqual(stops);
  });

  it('ignores empty inline stops', () => {
    expect(resolveTheme([], [BASE_PACK])).not.toEqual([]);
  });

  it('lets a later pack override a theme name', () => {
    expect(resolveTheme('dark', [BASE_PACK, extra])).toEqual(extra.themes!.dark);
  });

  it('falls back instead of throwing on an unknown name', () => {
    const out = resolveTheme('does-not-exist', [BASE_PACK]);
    expect(out.length).toBeGreaterThan(0);
  });
});

describe('pickColors', () => {
  it('respects weights', () => {
    const stops = [
      { f: '#heavy', d: '#d', w: 9 },
      { f: '#light', d: '#d', w: 1 },
    ];
    const r = rng(1);
    let heavy = 0;
    for (let i = 0; i < 10_000; i++) if (pickColors(stops, r).f === '#heavy') heavy++;
    expect(heavy / 10_000).toBeGreaterThan(0.85);
    expect(heavy / 10_000).toBeLessThan(0.95);
  });

  it('survives zero and negative weights', () => {
    const out = pickColors([{ f: '#a', d: '#b', w: 0 }], rng(1));
    expect(out.f).toBe('#a');
    const neg = pickColors([{ f: '#a', d: '#b', w: -5 }], rng(1));
    expect(neg.f).toBe('#a');
  });
});
