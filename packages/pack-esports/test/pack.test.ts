import { describe, expect, it } from 'vitest';
import { layout, renderFieldSVG, validatePack } from '@usemote/core';
import { esports, ESPORTS_SHAPES, ESPORTS_THEMES } from '../src/index.js';

describe('pack integrity', () => {
  it('passes the authoring rules', () => {
    expect(validatePack(esports)).toEqual([]);
  });

  it('ships 16 object shapes', () => {
    expect(ESPORTS_SHAPES).toHaveLength(16);
    expect(ESPORTS_SHAPES.every((s) => s.kind === 'obj')).toBe(true);
  });

  it('has the expected ids, in order', () => {
    // Pinned: this ORDER is the seed-stability contract for the pack.
    expect(ESPORTS_SHAPES.map((s) => s.id)).toEqual([
      'controller', 'trophy', 'keycap', 'crosshair', 'cursor', 'medal',
      'headset', 'gg', 'score', 'live', 'dpad', 'coin', 'joystick',
      'heart', 'ping', 'bracket',
    ]);
  });

  it('declares the four brand themes', () => {
    expect(Object.keys(ESPORTS_THEMES).sort()).toEqual(['dark', 'light', 'lime', 'mono']);
  });

  it('uses only brand colours', () => {
    const brand = new Set(['#d4ff1e', '#121212', '#f2f2ee', '#4a4a45', '#bdbcb4']);
    for (const stops of Object.values(ESPORTS_THEMES)) {
      for (const s of stops) {
        expect(brand.has(s.f), s.f).toBe(true);
        expect(brand.has(s.d), s.d).toBe(true);
      }
    }
  });
});

describe('shape rendering', () => {
  it('threads both theme colours through every shape', () => {
    for (const s of ESPORTS_SHAPES) {
      const markup = s.render({ f: '#AAA111', d: '#BBB222' });
      expect(markup, s.id).toContain('#AAA111');
    }
  });

  it('leaves no hardcoded black in the keycap shadow', () => {
    const keycap = ESPORTS_SHAPES.find((s) => s.id === 'keycap')!;
    const markup = keycap.render({ f: '#AAA111', d: '#BBB222' });
    expect(markup).not.toMatch(/#000\b/);
    expect(markup).toContain('#BBB222');
  });

  it('honours keycap variants', () => {
    const keycap = ESPORTS_SHAPES.find((s) => s.id === 'keycap')!;
    expect(keycap.variants).toEqual(['W', 'A', 'S', 'D']);
    expect(keycap.render({ f: '#1', d: '#2' }, 'D')).toContain('>D<');
    expect(keycap.render({ f: '#1', d: '#2' })).toContain('>W<');
  });

  it('gives text shapes a real fallback stack', () => {
    for (const id of ['trophy', 'gg', 'score', 'live', 'coin', 'keycap']) {
      const s = ESPORTS_SHAPES.find((x) => x.id === id)!;
      const markup = s.render({ f: '#1', d: '#2' });
      expect(markup, id).toMatch(/font-family="[^"]*sans-serif|font-family="[^"]*monospace/);
    }
  });

  it('declares aspect ratios matching its viewBoxes', () => {
    for (const s of ESPORTS_SHAPES) {
      const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s.render({ f: '#1', d: '#2' }));
      expect(vb, s.id).not.toBeNull();
      const ratio = Number(vb![1]) / Number(vb![2]);
      expect(s.ar, s.id).toBeCloseTo(ratio, 2);
    }
  });
});

describe('integration with core', () => {
  it('lays out a field from the pack', () => {
    const out = layout(
      { packs: [esports], set: 'objects', count: 12, seed: 3, theme: 'lime' },
      800, 400,
    );
    expect(out).toHaveLength(12);
    expect(out.every((p) => p.shape.kind === 'obj')).toBe(true);
  });

  it('is deterministic through core', () => {
    const opts = { packs: [esports], count: 10, seed: 'hero', width: 900, height: 450 } as const;
    expect(renderFieldSVG({ ...opts })).toBe(renderFieldSVG({ ...opts }));
  });

  it('frame-0 snapshot', () => {
    expect(
      renderFieldSVG({
        packs: [esports], count: 8, seed: 17, size: 90,
        width: 800, height: 400, theme: 'dark', background: '#121212',
      }),
    ).toMatchSnapshot();
  });

  it('supports the layered hero composition from the spec', () => {
    const back = layout({ set: 'geo', theme: 'mono', count: 30, size: 46, seed: 31, depth: true }, 1400, 760);
    const front = layout(
      {
        packs: [esports],
        shapes: 'controller,trophy,keycap,gg,score,heart,medal',
        count: 9, size: 96, seed: 17, avoid: 'center',
      },
      1400, 760,
    );
    expect(back).toHaveLength(30);
    expect(front).toHaveLength(9);
    // The front layer must leave the headline area clear.
    const avoid = { x: 1400 * 0.225, y: 760 * 0.275, w: 1400 * 0.55, h: 760 * 0.45 };
    const intruders = front.filter(
      (p) => p.x > avoid.x && p.x < avoid.x + avoid.w && p.y > avoid.y && p.y < avoid.y + avoid.h,
    );
    expect(intruders).toHaveLength(0);
  });
});
