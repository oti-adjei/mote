import { describe, expect, it } from 'vitest';
import { renderFieldHTML, renderFieldSVG, transformOf } from '../src/render/string.js';
import { layout } from '../src/layout.js';
import { PRESETS } from '../src/motion/index.js';
import type { MotionId } from '../src/types.js';

const ALL = Object.keys(PRESETS) as MotionId[];

describe('frame-0 snapshots — the determinism contract', () => {
  // A diff in these snapshots means every existing seed's layout changed.
  // That is a MAJOR version bump, never a quiet update. Do not regenerate
  // them to make a build pass.
  for (const mode of ALL) {
    for (const seed of [1, 11]) {
      it(`${mode} @ seed ${seed}`, () => {
        const html = renderFieldHTML({
          mode, seed, count: 6, size: 60, width: 800, height: 400, depth: true,
        });
        expect(html).toMatchSnapshot();
      });
    }
  }

  it('base pack geometry is stable', () => {
    const svg = renderFieldSVG({
      set: 'geo', seed: 3, count: 13, size: 64, width: 600, height: 300,
      theme: 'mono', background: '#121212',
    });
    expect(svg).toMatchSnapshot();
  });
});

describe('renderFieldHTML', () => {
  it('emits one wrapper per particle', () => {
    const html = renderFieldHTML({ count: 7, width: 500, height: 300 });
    expect(html.match(/<div style=/g)).toHaveLength(7);
  });

  it('animates only transform and opacity', () => {
    const html = renderFieldHTML({ count: 10, width: 500, height: 300, depth: true });
    // No property that would trigger layout.
    expect(html).not.toMatch(/(?:^|;)\s*(?:margin|padding|right|bottom)\s*:/);
    expect(html).toContain('transform:');
    expect(html).toContain('position:absolute');
  });

  it('is byte-identical across calls', () => {
    const opts = { seed: 'hero', count: 12, width: 900, height: 450, depth: true } as const;
    expect(renderFieldHTML({ ...opts })).toBe(renderFieldHTML({ ...opts }));
  });

  it('never emits NaN', () => {
    for (const mode of ALL) {
      const html = renderFieldHTML({ mode, count: 8, width: 1, height: 1, size: 500 });
      expect(html, mode).not.toContain('NaN');
    }
  });
});

describe('renderFieldSVG', () => {
  it('is a self-contained document', () => {
    const svg = renderFieldSVG({ count: 5, width: 1200, height: 630 });
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('viewBox="0 0 1200 630"');
  });

  it('includes a background only when asked', () => {
    expect(renderFieldSVG({ count: 2, width: 10, height: 10 })).not.toContain('<rect width="10"');
    expect(
      renderFieldSVG({ count: 2, width: 10, height: 10, background: '#fff' }),
    ).toContain('<rect width="10" height="10" fill="#fff"/>');
  });

  it('gives nested shapes explicit extent', () => {
    const svg = renderFieldSVG({ count: 3, width: 400, height: 200, shapes: 'circle' });
    expect(svg).not.toContain('width:100%');
    expect(svg).toMatch(/<svg viewBox="0 0 100 100"[^>]*width="/);
  });
});

describe('transformOf', () => {
  it('centres via a -50% offset so x/y are the shape centre', () => {
    const p = layout({ count: 1, shapes: 'circle', size: 40, seed: 1 }, 200, 200)[0]!;
    const t = transformOf(p);
    expect(t).toContain('translate(-50%, -50%)');
    expect(t).toContain(`translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`);
  });
});
