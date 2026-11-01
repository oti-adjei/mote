/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createField } from '../src/field.js';
import { activeCount } from '../src/scheduler.js';

function host(w = 800, h = 400): HTMLElement {
  const parent = document.createElement('div');
  const el = document.createElement('div');
  parent.appendChild(el);
  document.body.appendChild(parent);
  // happy-dom reports zero-size boxes; the field measures via getBoundingClientRect.
  el.getBoundingClientRect = () =>
    ({ width: w, height: h, top: 0, left: 0, right: w, bottom: h, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  return el;
}

function mockReducedMotion(reduce: boolean): void {
  window.matchMedia = ((q: string) => ({
    matches: reduce && q.includes('reduce'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  mockReducedMotion(false);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(performance.now()), 16) as unknown as number;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
});

afterEach(() => {
  document.body.textContent = '';
  vi.unstubAllGlobals();
});

describe('createField', () => {
  it('renders one node per particle', () => {
    const el = host();
    const field = createField(el, { count: 9, seed: 1 });
    expect(el.children).toHaveLength(9);
    field.destroy();
  });

  it('is hidden from assistive tech and never swallows clicks', () => {
    const el = host();
    const field = createField(el, { count: 3 });
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.style.pointerEvents).toBe('none');
    field.destroy();
  });

  it('positions itself out of the parent layout flow', () => {
    const el = host();
    const field = createField(el, { count: 3 });
    expect(el.style.position).toBe('absolute');
    expect(el.style.overflow).toBe('hidden');
    field.destroy();
  });

  it('cleans up completely on destroy', () => {
    const el = host();
    const before = activeCount();
    const field = createField(el, { count: 5 });
    field.destroy();
    expect(el.children).toHaveLength(0);
    expect(activeCount()).toBe(before);
  });

  it('starts no animation loop under reduced motion', () => {
    mockReducedMotion(true);
    const el = host();
    const before = activeCount();
    const field = createField(el, { count: 6, mode: 'bounce' });
    // Frame 0 is still rendered — a still field, not an empty one.
    expect(el.children).toHaveLength(6);
    expect(activeCount()).toBe(before);
    field.destroy();
  });

  it('forces interactivity off under reduced motion', () => {
    mockReducedMotion(true);
    const el = host();
    const field = createField(el, { count: 4, interactive: true });
    expect(activeCount()).toBe(0);
    field.destroy();
  });

  it('shares one scheduler entry per field', () => {
    const a = createField(host(), { count: 3 });
    const b = createField(host(), { count: 3 });
    expect(activeCount()).toBe(2);
    a.destroy();
    expect(activeCount()).toBe(1);
    b.destroy();
    expect(activeCount()).toBe(0);
  });

  it('pauses and resumes', () => {
    const el = host();
    const field = createField(el, { count: 4 });
    expect(activeCount()).toBe(1);
    field.pause();
    expect(activeCount()).toBe(0);
    field.resume();
    expect(activeCount()).toBe(1);
    field.destroy();
  });

  it('rebuilds on a structural change and keeps nodes on a live one', () => {
    const el = host();
    const field = createField(el, { count: 5, seed: 1 });
    const firstTransform = (el.children[0] as HTMLElement).style.transform;

    field.update({ speed: 2 });            // live — no rebuild
    expect(el.children).toHaveLength(5);

    field.update({ count: 11 });           // structural — rebuild
    expect(el.children).toHaveLength(11);

    field.update({ seed: 99 });            // structural — different layout
    expect((el.children[0] as HTMLElement).style.transform).not.toBe(firstTransform);
    field.destroy();
  });

  it('is idempotent on repeated destroy', () => {
    const field = createField(host(), { count: 2 });
    field.destroy();
    expect(() => field.destroy()).not.toThrow();
    expect(activeCount()).toBe(0);
  });

  it('ignores updates after destroy', () => {
    const el = host();
    const field = createField(el, { count: 2 });
    field.destroy();
    field.update({ count: 50 });
    expect(el.children).toHaveLength(0);
  });

  it('applies depth styling to the nodes', () => {
    const el = host();
    const field = createField(el, { count: 20, depth: true, seed: 2 });
    const styles = Array.from(el.children).map((c) => (c as HTMLElement).style);
    expect(styles.some((s) => s.filter.includes('blur'))).toBe(true);
    expect(styles.some((s) => s.opacity !== '')).toBe(true);
    field.destroy();
  });
});
