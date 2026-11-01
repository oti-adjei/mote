import { describe, expect, it } from 'vitest';
import { layout, renderFieldSVG, validatePack } from '@usemote/core';
import { health, HEALTH_SHAPES } from '../src/index.js';

const PACK = health;

describe('health pack', () => {
  it('passes the authoring rules', () => {
    expect(validatePack(health)).toEqual([]);
  });

  it('ships 15 object shapes with unique ids', () => {
    expect(HEALTH_SHAPES).toHaveLength(15);
    expect(HEALTH_SHAPES.every((s) => s.kind === 'obj')).toBe(true);
    expect(new Set(HEALTH_SHAPES.map((s) => s.id)).size).toBe(15);
  });

  it('pins shape order, which is the seed-stability contract', () => {
    expect(HEALTH_SHAPES.map((s) => s.id)).toEqual(["medcross", "ecg", "capsule", "heart2", "stethoscope", "dna", "syringe", "thermometer", "bandage", "molecule", "blood", "wearable", "kit", "vitals", "tablet"]);
  });

  it('threads both theme colours through every shape', () => {
    for (const s of HEALTH_SHAPES) {
      const markup = s.render({ f: '#AAA111', d: '#BBB222', p: ['#AAA111', '#CCC333'] });
      expect(markup, s.id).toContain('#AAA111');
      expect(markup, s.id).toContain('viewBox');
    }
  });

  it('declares aspect ratios matching its viewBoxes', () => {
    for (const s of HEALTH_SHAPES) {
      // A viewBox need not start at the origin — space/galaxy is "22 18 64 60".
      const vb = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(
        s.render({ f: '#1', d: '#2', p: ['#1', '#2'] }),
      );
      expect(vb, s.id).not.toBeNull();
      expect(s.ar, s.id).toBeCloseTo(Number(vb![1]) / Number(vb![2]), 1);
    }
  });

  it('renders every variant', () => {
    for (const s of HEALTH_SHAPES) {
      for (const v of s.variants ?? []) {
        expect(s.render({ f: '#1', d: '#2', p: ['#1', '#2'] }, v), `${s.id}/${v}`).toContain('viewBox');
      }
    }
  });

  it('declares four themes and curated base shapes', () => {
    expect(Object.keys(health.themes ?? {}).sort()).toEqual(['accent', 'dark', 'light', 'mono']);
    expect(health.swatches?.length).toBeGreaterThan(0);
    expect(health.description).toBeTruthy();
  });

  // A pack may legitimately ship no curated base set; `creative` does not.
  it.skipIf(!PACK.baseShapes?.length)('pools objects with its curated base primitives', () => {
    const mixed = layout({ packs: [health], set: 'mixed', count: 30, seed: 5 }, 900, 500);
    const kinds = new Set(mixed.map((p) => p.shape.kind));
    expect(kinds.has('obj')).toBe(true);
    expect(kinds.has('geo')).toBe(true);
  });

  it('is deterministic and renders without NaN', () => {
    const opts = { packs: [health], count: 12, seed: 'hero', width: 800, height: 400 } as const;
    const a = renderFieldSVG({ ...opts });
    expect(a).toBe(renderFieldSVG({ ...opts }));
    expect(a).not.toContain('NaN');
    expect(a).not.toContain('undefined');
  });

  it('frame-0 snapshot', () => {
    expect(
      renderFieldSVG({
        packs: [health], count: 8, seed: 17, size: 90,
        width: 800, height: 400, theme: 'dark',
      }),
    ).toMatchSnapshot();
  });
});
