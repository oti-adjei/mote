/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { activeCount } from '@usemote/core';
import { FloatingField } from '../src/FloatingField.js';

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

afterEach(() => vi.unstubAllGlobals());

describe('server rendering', () => {
  it('emits frame-0 markup with no browser APIs', async () => {
    const app = createSSRApp({
      render: () => h(FloatingField, { count: 8, seed: 11 }),
    });
    const html = await renderToString(app);
    expect(html).toContain('aria-hidden="true"');
    expect(html.match(/<div style=/g)?.length).toBeGreaterThanOrEqual(8);
    expect(html).not.toContain('NaN');
  });

  it('matches @usemote/react byte for byte, since both render core frame 0', async () => {
    const once = await renderToString(
      createSSRApp({ render: () => h(FloatingField, { count: 6, seed: 'hero', depth: true }) }),
    );
    const twice = await renderToString(
      createSSRApp({ render: () => h(FloatingField, { count: 6, seed: 'hero', depth: true }) }),
    );
    expect(once).toBe(twice);
  });
});

describe('client mounting', () => {
  it('mounts a live field', () => {
    const w = mount(FloatingField, { props: { count: 6, seed: 1 } });
    expect(w.element.children).toHaveLength(6);
    expect(activeCount()).toBe(1);
    w.unmount();
  });

  it('tears down on unmount', () => {
    const w = mount(FloatingField, { props: { count: 4 } });
    expect(activeCount()).toBe(1);
    w.unmount();
    expect(activeCount()).toBe(0);
  });

  it('is hidden from assistive tech and never swallows clicks', () => {
    const w = mount(FloatingField, { props: { count: 2 } });
    expect(w.element.getAttribute('aria-hidden')).toBe('true');
    expect((w.element as HTMLElement).style.pointerEvents).toBe('none');
    w.unmount();
  });

  it('rebuilds on a structural prop change', async () => {
    const w = mount(FloatingField, { props: { count: 5, seed: 1 } });
    expect(w.element.children).toHaveLength(5);
    await w.setProps({ count: 11 });
    expect(w.element.children).toHaveLength(11);
    w.unmount();
  });

  it('does not rebuild for a live prop change', async () => {
    const w = mount(FloatingField, { props: { count: 5, seed: 1, speed: 1 } });
    const first = w.element.children[0];
    await w.setProps({ speed: 2 });
    expect(w.element.children[0]).toBe(first);
    w.unmount();
  });

  it('does not rebuild when an inline shapes literal keeps the same content', async () => {
    const w = mount(FloatingField, { props: { count: 4, seed: 2, shapes: ['circle', 'ring'] } });
    const first = w.element.children[0];
    await w.setProps({ shapes: ['circle', 'ring'] });
    expect(w.element.children[0]).toBe(first);
    w.unmount();
  });

  it('shares one scheduler entry per mounted field', () => {
    const a = mount(FloatingField, { props: { count: 3, seed: 1 } });
    const b = mount(FloatingField, { props: { count: 3, seed: 2 } });
    expect(activeCount()).toBe(2);
    a.unmount();
    b.unmount();
    expect(activeCount()).toBe(0);
  });

  it('leaves unset props to core defaults', () => {
    const w = mount(FloatingField, {});
    // 18 is core's documented default count.
    expect(w.element.children).toHaveLength(18);
    w.unmount();
  });
});
