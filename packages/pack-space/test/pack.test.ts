import { describe, expect, it } from 'vitest';
import { layout, renderFieldSVG, validatePack } from '@usemote/core';
import { space, SPACE_SHAPES } from '../src/index.js';

const PACK = space;

describe('space pack', () => {
  it('passes the authoring rules', () => {
    expect(validatePack(space)).toEqual([]);
  });

  it('ships 15 object shapes with unique ids', () => {
    expect(SPACE_SHAPES).toHaveLength(15);
    expect(SPACE_SHAPES.every((s) => s.kind === 'obj')).toBe(true);
    expect(new Set(SPACE_SHAPES.map((s) => s.id)).size).toBe(15);
  });

  it('pins shape order, which is the seed-stability contract', () => {
    expect(SPACE_SHAPES.map((s) => s.id)).toEqual(["saturn", "rocket", "twinkle", "crescent", "helmet", "satellite", "ufo", "comet", "constellation", "orbit", "asteroid", "sun", "blackhole", "telescope", "galaxy"]);
  });

  it('threads both theme colours through every shape', () => {
    for (const s of SPACE_SHAPES) {
      const markup = s.render({ f: '#AAA111', d: '#BBB222', p: ['#AAA111', '#CCC333'] });
      expect(markup, s.id).toContain('#AAA111');
      expect(markup, s.id).toContain('viewBox');
    }
  });

  it('declares aspect ratios matching its viewBoxes', () => {
    for (const s of SPACE_SHAPES) {
      // A viewBox need not start at the origin — space/galaxy is "22 18 64 60".
      const vb = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(
        s.render({ f: '#1', d: '#2', p: ['#1', '#2'] }),
      );
      expect(vb, s.id).not.toBeNull();
      expect(s.ar, s.id).toBeCloseTo(Number(vb![1]) / Number(vb![2]), 1);
    }
  });

  it('renders every variant', () => {
    for (const s of SPACE_SHAPES) {
      for (const v of s.variants ?? []) {
        expect(s.render({ f: '#1', d: '#2', p: ['#1', '#2'] }, v), `${s.id}/${v}`).toContain('viewBox');
      }
    }
  });

  it('declares four themes and curated base shapes', () => {
    expect(Object.keys(space.themes ?? {}).sort()).toEqual(['accent', 'dark', 'light', 'mono']);
    expect(space.swatches?.length).toBeGreaterThan(0);
    expect(space.description).toBeTruthy();
  });

  // A pack may legitimately ship no curated base set; `creative` does not.
  it.skipIf(!PACK.baseShapes?.length)('pools objects with its curated base primitives', () => {
    const mixed = layout({ packs: [space], set: 'mixed', count: 30, seed: 5 }, 900, 500);
    const kinds = new Set(mixed.map((p) => p.shape.kind));
    expect(kinds.has('obj')).toBe(true);
    expect(kinds.has('geo')).toBe(true);
  });

  it('is deterministic and renders without NaN', () => {
    const opts = { packs: [space], count: 12, seed: 'hero', width: 800, height: 400 } as const;
    const a = renderFieldSVG({ ...opts });
    expect(a).toBe(renderFieldSVG({ ...opts }));
    expect(a).not.toContain('NaN');
    expect(a).not.toContain('undefined');
  });

  it('frame-0 snapshot', () => {
    expect(
      renderFieldSVG({
        packs: [space], count: 8, seed: 17, size: 90,
        width: 800, height: 400, theme: 'dark',
      }),
    ).toMatchSnapshot();
  });
});
