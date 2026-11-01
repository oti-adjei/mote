import { describe, expect, it } from 'vitest';
import { clampCount, layout, resolveAvoid, COUNT_WARN_THRESHOLD } from '../src/layout.js';
import { BASE_PACK } from '../src/shapes.js';
import type { FieldOptions } from '../src/types.js';

const W = 1200;
const H = 600;

function fields(opts: FieldOptions = {}) {
  return layout(opts, W, H);
}

describe('determinism', () => {
  it('produces an identical field for the same seed', () => {
    const a = fields({ seed: 11, count: 20, depth: true });
    const b = fields({ seed: 11, count: 20, depth: true });
    expect(a).toHaveLength(20);
    for (let i = 0; i < a.length; i++) {
      expect(a[i]!.shape.id).toBe(b[i]!.shape.id);
      expect(a[i]!.x).toBe(b[i]!.x);
      expect(a[i]!.y).toBe(b[i]!.y);
      expect(a[i]!.w).toBe(b[i]!.w);
      expect(a[i]!.rot).toBe(b[i]!.rot);
      expect(a[i]!.colors).toEqual(b[i]!.colors);
      expect(a[i]!.phase).toBe(b[i]!.phase);
    }
  });

  it('produces different fields for different seeds', () => {
    const a = fields({ seed: 1, count: 12 });
    const b = fields({ seed: 2, count: 12 });
    const same = a.every((p, i) => p.x === b[i]!.x && p.y === b[i]!.y);
    expect(same).toBe(false);
  });

  it('accepts string seeds deterministically', () => {
    const a = fields({ seed: 'hero', count: 8 });
    const b = fields({ seed: 'hero', count: 8 });
    expect(a.map((p) => p.x)).toEqual(b.map((p) => p.x));
  });
});

describe('count', () => {
  it('clamps to the documented bounds', () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(-5)).toBe(1);
    expect(clampCount(9999)).toBe(200);
    expect(clampCount(undefined)).toBe(18);
    expect(clampCount(Number.NaN)).toBe(18);
  });

  it('warns past the DOM budget', () => {
    const warnings: string[] = [];
    layout({ count: COUNT_WARN_THRESHOLD + 1 }, W, H, (m) => warnings.push(m));
    expect(warnings.some((w) => w.includes('DOM budget'))).toBe(true);
  });
});

describe('bounds', () => {
  it('places every shape fully inside the field', () => {
    for (const p of fields({ count: 40, size: 80, seed: 7 })) {
      expect(p.x - p.w / 2).toBeGreaterThanOrEqual(-0.001);
      expect(p.x + p.w / 2).toBeLessThanOrEqual(W + 0.001);
      expect(p.y - p.h / 2).toBeGreaterThanOrEqual(-0.001);
      expect(p.y + p.h / 2).toBeLessThanOrEqual(H + 0.001);
    }
  });

  it('survives a field smaller than one shape', () => {
    const out = layout({ count: 3, size: 400 }, 50, 50);
    expect(out).toHaveLength(3);
    for (const p of out) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
    }
  });
});

describe('avoid regions', () => {
  it('resolves named regions', () => {
    expect(resolveAvoid('none', W, H)).toBeNull();
    expect(resolveAvoid(undefined, W, H)).toBeNull();
    const c = resolveAvoid('center', W, H)!;
    expect(c.x).toBeCloseTo((W - c.w) / 2);
    expect(c.y).toBeCloseTo((H - c.h) / 2);
    const t = resolveAvoid('top', W, H)!;
    expect(t.y).toBe(0);
    const b = resolveAvoid('bottom', W, H)!;
    expect(b.y).toBeCloseTo(H * 0.6);
  });

  it('passes an explicit rect through', () => {
    const r = { x: 10, y: 20, w: 30, h: 40 };
    expect(resolveAvoid(r, W, H)).toEqual(r);
  });

  it('keeps the centre clear for a headline', () => {
    const avoid = resolveAvoid('center', W, H)!;
    const out = fields({ count: 24, avoid: 'center', size: 60, seed: 17 });
    const intruders = out.filter(
      (p) =>
        p.x > avoid.x && p.x < avoid.x + avoid.w &&
        p.y > avoid.y && p.y < avoid.y + avoid.h,
    );
    expect(intruders).toHaveLength(0);
  });
});

describe('depth', () => {
  it('is off by default', () => {
    for (const p of fields({ count: 6 })) {
      expect(p.z).toBe(1);
      expect(p.blur).toBe(0);
      expect(p.opacity).toBe(1);
    }
  });

  it('sorts far shapes first so near ones paint last', () => {
    const out = fields({ count: 30, depth: true, seed: 4 });
    for (let i = 1; i < out.length; i++) {
      expect(out[i]!.z).toBeGreaterThanOrEqual(out[i - 1]!.z);
    }
  });

  it('maps z to scale, blur and opacity monotonically', () => {
    const out = fields({ count: 40, depth: true, seed: 8 });
    const far = out[0]!;
    const near = out[out.length - 1]!;
    expect(near.blur).toBeLessThanOrEqual(far.blur);
    expect(near.opacity).toBeGreaterThanOrEqual(far.opacity);
  });
});

describe('pools and themes', () => {
  it('honours set=geo', () => {
    for (const p of fields({ set: 'geo', count: 10 })) {
      expect(p.shape.kind).toBe('geo');
    }
  });

  it('lets shapes win over set', () => {
    const out = fields({ set: 'objects', shapes: 'circle,triangle', count: 10 });
    for (const p of out) expect(['circle', 'triangle']).toContain(p.shape.id);
  });

  it('only uses colours from the resolved theme', () => {
    const stops = BASE_PACK.themes!.mono!;
    const allowed = stops.map((s) => `${s.f}|${s.d}`);
    for (const p of fields({ theme: 'mono', count: 20 })) {
      expect(allowed).toContain(`${p.colors.f}|${p.colors.d}`);
    }
  });

  it('spreads phases across the full range', () => {
    const phases = fields({ count: 16, seed: 3 }).map((p) => p.phase);
    expect(Math.min(...phases)).toBeLessThan(0.2);
    expect(Math.max(...phases)).toBeGreaterThan(0.8);
  });
});

describe('avoid is a guarantee, not a preference', () => {
  // Regression: with few candidate draws, large shapes and a wide region,
  // every candidate could land inside the avoid rect and the solver shipped
  // one anyway. Exercised across sizes, counts and seeds.
  it('keeps the region clear across a wide parameter sweep', () => {
    const avoid = resolveAvoid('center', W, H)!;
    for (const size of [40, 96, 140]) {
      for (const count of [4, 9, 30]) {
        for (const seed of [1, 7, 31, 'hero']) {
          const out = layout({ count, size, seed, avoid: 'center' }, W, H);
          const intruders = out.filter(
            (p) =>
              p.x > avoid.x && p.x < avoid.x + avoid.w &&
              p.y > avoid.y && p.y < avoid.y + avoid.h,
          );
          expect(intruders, `size=${size} count=${count} seed=${seed}`).toHaveLength(0);
        }
      }
    }
  });

  it('still renders when the avoid region covers everything', () => {
    const out = layout({ count: 5, avoid: { x: 0, y: 0, w: W, h: H } }, W, H);
    expect(out).toHaveLength(5);
    for (const p of out) expect(Number.isFinite(p.x)).toBe(true);
  });

  it('honours top and bottom regions too', () => {
    for (const region of ['top', 'bottom'] as const) {
      const r = resolveAvoid(region, W, H)!;
      const out = layout({ count: 14, size: 70, seed: 5, avoid: region }, W, H);
      const intruders = out.filter(
        (p) => p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h,
      );
      expect(intruders, region).toHaveLength(0);
    }
  });
});

describe('center region is aspect-aware', () => {
  // Regression: a fixed 55% width left shapes resting on the ends of a
  // headline in a wide, short hero — the exact case avoid exists for.
  it('is 55% wide on a square stage', () => {
    const c = resolveAvoid('center', 600, 600)!;
    expect(c.w / 600).toBeCloseTo(0.55, 2);
  });

  it('widens toward 78% as the stage gets wider', () => {
    const square = resolveAvoid('center', 600, 600)!;
    const wide = resolveAvoid('center', 1400, 380)!;
    expect(wide.w / 1400).toBeGreaterThan(square.w / 600);
    expect(wide.w / 1400).toBeCloseTo(0.78, 2);
  });

  it('caps so it never swallows the whole stage', () => {
    for (const [w, h] of [[4000, 200], [1200, 600], [300, 900]] as const) {
      const c = resolveAvoid('center', w, h)!;
      expect(c.w).toBeLessThan(w);
      expect(c.h).toBeLessThan(h);
      expect(c.x).toBeGreaterThanOrEqual(0);
      expect(c.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('stays centred at every aspect', () => {
    for (const [w, h] of [[1400, 380], [600, 600], [400, 1000]] as const) {
      const c = resolveAvoid('center', w, h)!;
      expect(c.x + c.w / 2).toBeCloseTo(w / 2, 5);
      expect(c.y + c.h / 2).toBeCloseTo(h / 2, 5);
    }
  });
});
