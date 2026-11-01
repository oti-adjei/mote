import { describe, expect, it } from 'vitest';
import {
  PACKS, checkPack, explainField, listPacks, listPresets, listShapes,
  previewSVG, snippet, validatePackObject,
} from '../src/tools.js';

describe('catalogue', () => {
  it('lists both packs with counts and themes', () => {
    const out = listPacks();
    expect(out).toContain('base');
    expect(out).toContain('esports');
    expect(out).toMatch(/13 shapes/);
    expect(out).toMatch(/16 shapes/);
  });

  it('lists shape ids usable in shapes=""', () => {
    const out = listShapes('esports');
    expect(out).toContain('controller');
    expect(out).toContain('bracket');
    expect(out).toContain('shapes always wins over set');
  });

  it('reports an unknown pack instead of returning nothing', () => {
    expect(listShapes('nope')).toContain('Unknown pack');
  });

  it('documents every preset the engine actually ships', () => {
    const out = listPresets();
    for (const id of ['static', 'bob', 'hop', 'drift', 'across', 'bounce', 'gravity']) {
      expect(out, id).toContain(id);
    }
  });
});

describe('snippet', () => {
  it('generates valid-looking React', () => {
    const out = snippet({ framework: 'react', mode: 'bob', avoid: 'center', depth: true });
    expect(out).toContain("import { FloatingField } from '@usemote/react'");
    expect(out).toContain('mode="bob"');
    expect(out).toContain('avoid="center"');
    expect(out).toContain('depth');
    // The layering trap the skill warns about must be pre-solved in output.
    expect(out).toContain("position: 'relative'");
  });

  it('imports a pack only when one is used', () => {
    expect(snippet({ pack: 'esports' })).toContain("@usemote/pack-esports");
    expect(snippet({ pack: 'base' })).not.toContain('pack-base');
  });

  it('generates HTML using the CDN build', () => {
    const out = snippet({ framework: 'html', pack: 'esports', mode: 'across', direction: 'left' });
    expect(out).toContain('cdn.jsdelivr.net/npm/@usemote/web-component');
    expect(out).toContain('<floating-field');
    expect(out).toContain('pack="esports"');
    expect(out).toContain('direction="left"');
  });

  it('generates vanilla core JS', () => {
    const out = snippet({ framework: 'core', mode: 'gravity' });
    expect(out).toContain("createField(");
    expect(out).toContain("mode: 'gravity'");
  });

  it('only emits direction for across', () => {
    expect(snippet({ mode: 'bob', direction: 'left' })).not.toContain('direction');
    expect(snippet({ mode: 'across', direction: 'left' })).toContain('direction');
  });
});

describe('explain_field', () => {
  it('describes what a config produces', () => {
    const out = explainField({ pack: 'esports', set: 'objects', count: 10, seed: 3 });
    expect(out).toContain('10 shapes');
    expect(out).toContain('Deterministic');
    expect(out).toContain('seed 3');
  });

  it('surfaces engine warnings rather than hiding them', () => {
    expect(explainField({ count: 120 })).toMatch(/Warnings:[\s\S]*DOM budget/);
    expect(explainField({ shapes: 'not-a-shape', count: 4 })).toMatch(/Warnings:[\s\S]*unknown shape/);
  });

  it('reports no warnings for a sane config', () => {
    expect(explainField({ count: 12 })).toContain('No warnings.');
  });
});

describe('preview_svg', () => {
  it('returns a self-contained SVG document', () => {
    const svg = previewSVG({ pack: 'esports', count: 5, width: 400, height: 200 });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('viewBox="0 0 400 200"');
    expect(svg).not.toContain('NaN');
  });

  it('is deterministic', () => {
    const a = previewSVG({ count: 8, seed: 'x' });
    const b = previewSVG({ count: 8, seed: 'x' });
    expect(a).toBe(b);
  });
});

describe('check_pack', () => {
  it('passes well-formed source', () => {
    const src = `{ id:'a', ar: 1, render: c => \`<svg viewBox="0 0 10 10"><rect fill="\${c.f}" stroke="\${c.d}"/></svg>\` }`;
    expect(checkPack(src)).toContain('No issues');
  });

  it('catches the rules that bite silently', () => {
    expect(checkPack('<svg><rect/></svg>')).toContain('no viewBox');
    expect(checkPack('<svg viewBox="0 0 1 1"><rect id="x"/></svg>')).toContain('ids collide');
    expect(checkPack('<svg viewBox="0 0 1 1"><style>a{}</style></svg>')).toContain('CSS leaks');
    expect(checkPack('<svg viewBox="0 0 1 1"><image href="https://x/y.png"/></svg>')).toContain('self-contained');
    expect(checkPack('<svg viewBox="0 0 1 1"><rect fill="#ff0000"/></svg>')).toContain('themes will not apply');
  });

  it('does not execute the source it is given', () => {
    // Static only: an agent handing over pack source is handing over
    // untrusted code.
    const malicious = 'process.exit(1); <svg viewBox="0 0 1 1"/>';
    expect(() => checkPack(malicious)).not.toThrow();
  });
});

describe('validatePackObject', () => {
  it('agrees with the engine validator on the shipped packs', () => {
    expect(validatePackObject(PACKS.base!)).toBe('Pack is valid.');
    expect(validatePackObject(PACKS.esports!)).toBe('Pack is valid.');
  });
});
