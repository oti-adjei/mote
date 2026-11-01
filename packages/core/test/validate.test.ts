import { describe, expect, it } from 'vitest';
import { validatePack } from '../src/validate.js';
import { BASE_PACK } from '../src/shapes.js';
import type { ShapeDef, ShapePack } from '../src/types.js';

const ok: ShapeDef = {
  id: 'good', label: 'Good', kind: 'geo', ar: 1,
  render: (c) => `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="${c.f}" stroke="${c.d}"/></svg>`,
};

function pack(shapes: ShapeDef[], themes?: ShapePack['themes']): ShapePack {
  return themes === undefined
    ? { id: 'p', name: 'P', version: '1.0.0', shapes }
    : { id: 'p', name: 'P', version: '1.0.0', shapes, themes };
}

const errors = (p: ShapePack) => validatePack(p).filter((i) => i.severity === 'error');
const warnings = (p: ShapePack) => validatePack(p).filter((i) => i.severity === 'warning');

describe('validatePack', () => {
  it('passes the base pack it ships', () => {
    expect(validatePack(BASE_PACK)).toEqual([]);
  });

  it('accepts a well-formed pack', () => {
    expect(validatePack(pack([ok]))).toEqual([]);
  });

  it('rejects duplicate ids', () => {
    expect(errors(pack([ok, ok]))[0]!.message).toContain('duplicate');
  });

  it('rejects id attributes, which collide when a shape is inlined twice', () => {
    const bad: ShapeDef = { ...ok, id: 'bad', render: () => '<svg viewBox="0 0 1 1"><rect id="x"/></svg>' };
    expect(errors(pack([bad])).some((e) => e.message.includes('id attributes'))).toBe(true);
  });

  it('rejects <style>, which leaks across the page', () => {
    const bad: ShapeDef = { ...ok, id: 'bad', render: () => '<svg viewBox="0 0 1 1"><style>a{}</style></svg>' };
    expect(errors(pack([bad])).some((e) => e.message.includes('<style>'))).toBe(true);
  });

  it('rejects external references', () => {
    const bad: ShapeDef = { ...ok, id: 'bad', render: () => '<svg viewBox="0 0 1 1"><image href="https://x/y.png"/></svg>' };
    expect(errors(pack([bad])).some((e) => e.message.includes('external resource'))).toBe(true);
  });

  it('allows internal fragment references', () => {
    const fine: ShapeDef = { ...ok, id: 'frag', render: (c) => `<svg viewBox="0 0 1 1"><use href="#a" fill="${c.f}"/></svg>` };
    expect(errors(pack([fine]))).toEqual([]);
  });

  it('requires a viewBox', () => {
    const bad: ShapeDef = { ...ok, id: 'bad', render: () => '<svg><rect/></svg>' };
    expect(errors(pack([bad])).some((e) => e.message.includes('viewBox'))).toBe(true);
  });

  it('warns about hardcoded colours, which defeat theming', () => {
    const bad: ShapeDef = { ...ok, id: 'hard', render: () => '<svg viewBox="0 0 1 1"><rect fill="#ff0000"/></svg>' };
    expect(warnings(pack([bad])).some((w) => w.message.includes('#ff0000'))).toBe(true);
  });

  it('warns about a fixed size on the root svg', () => {
    const bad: ShapeDef = { ...ok, id: 'fixed', render: (c) => `<svg viewBox="0 0 1 1" width="40"><rect fill="${c.f}"/></svg>` };
    expect(warnings(pack([bad])).some((w) => w.message.includes('fixed width/height'))).toBe(true);
  });

  it('allows width/height on inner geometry, where it is required', () => {
    const fine: ShapeDef = {
      ...ok, id: 'inner',
      render: (c) => `<svg viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="${c.f}"/></svg>`,
    };
    expect(validatePack(pack([fine]))).toEqual([]);
  });

  it('reports a throwing renderer instead of crashing', () => {
    const bad: ShapeDef = { ...ok, id: 'boom', render: () => { throw new Error('kaboom'); } };
    expect(errors(pack([bad]))[0]!.message).toContain('kaboom');
  });

  it('validates geometry fields', () => {
    expect(errors(pack([{ ...ok, ar: 0 }])).some((e) => e.message.includes('ar'))).toBe(true);
    expect(errors(pack([{ ...ok, scale: -1 }])).some((e) => e.message.includes('scale'))).toBe(true);
    expect(errors(pack([{ ...ok, kind: 'nope' as 'geo' }])).some((e) => e.message.includes('kind'))).toBe(true);
  });

  it('rejects an empty pack', () => {
    expect(errors(pack([]))[0]!.message).toContain('non-empty');
  });

  it('rejects a theme with no positive weight', () => {
    const p = pack([ok], { dead: [{ f: '#a', d: '#b', w: 0 }] });
    expect(errors(p).some((e) => e.message.includes('positive weight'))).toBe(true);
  });
});
