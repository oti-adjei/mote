/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { activeCount } from '@usemote/core';
import { fieldHTML, floatingField } from '../src/index.js';

function host(): HTMLElement {
  const parent = document.createElement('div');
  const el = document.createElement('div');
  parent.appendChild(el);
  document.body.appendChild(parent);
  return el;
}

beforeEach(() => {
  window.matchMedia = ((q: string) => ({
    matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number);
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  Element.prototype.getBoundingClientRect = function () {
    return { width: 800, height: 400, top: 0, left: 0, right: 800, bottom: 400, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  };
});

afterEach(() => {
  document.body.textContent = '';
  vi.unstubAllGlobals();
});

describe('floatingField action', () => {
  it('mounts a field on the node', () => {
    const el = host();
    const action = floatingField(el, { count: 7, seed: 3 });
    expect(el.children).toHaveLength(7);
    expect(activeCount()).toBe(1);
    action.destroy();
  });

  it('cleans up on destroy, as Svelte calls it', () => {
    const el = host();
    const action = floatingField(el, { count: 4 });
    action.destroy();
    expect(activeCount()).toBe(0);
    expect(el.children).toHaveLength(0);
  });

  it('works with no options', () => {
    const el = host();
    const action = floatingField(el);
    expect(el.children).toHaveLength(18);
    action.destroy();
  });

  it('rebuilds on a structural update', () => {
    const el = host();
    const action = floatingField(el, { count: 5, seed: 1 });
    action.update({ count: 12, seed: 1 });
    expect(el.children).toHaveLength(12);
    action.destroy();
  });

  it('applies a live update without rebuilding', () => {
    const el = host();
    const action = floatingField(el, { count: 5, seed: 1, speed: 1 });
    const first = el.children[0];
    action.update({ count: 5, seed: 1, speed: 2 });
    expect(el.children[0]).toBe(first);
    action.destroy();
  });

  it('treats an inline shapes literal by content, not identity', () => {
    const el = host();
    const action = floatingField(el, { count: 4, seed: 2, shapes: ['circle', 'ring'] });
    const first = el.children[0];
    action.update({ count: 4, seed: 2, shapes: ['circle', 'ring'] });
    expect(el.children[0]).toBe(first);
    action.destroy();
  });

  it('rebuilds when the pool genuinely changes', () => {
    const el = host();
    const action = floatingField(el, { count: 4, seed: 2, shapes: ['circle'] });
    const first = el.children[0];
    action.update({ count: 4, seed: 2, shapes: ['triangle'] });
    expect(el.children[0]).not.toBe(first);
    action.destroy();
  });

  it('leaks nothing across repeated updates', () => {
    const el = host();
    const action = floatingField(el, { count: 3, seed: 1 });
    for (let i = 2; i < 8; i++) action.update({ count: 3, seed: i });
    expect(activeCount()).toBe(1);
    action.destroy();
    expect(activeCount()).toBe(0);
  });
});

describe('fieldHTML', () => {
  it('returns deterministic frame-0 markup for SvelteKit SSR', () => {
    const opts = { count: 9, seed: 'hero', width: 1200, height: 600 } as const;
    const a = fieldHTML({ ...opts });
    const b = fieldHTML({ ...opts });
    expect(a).toBe(b);
    expect(a.match(/<div style=/g)).toHaveLength(9);
    expect(a).not.toContain('NaN');
  });
});
