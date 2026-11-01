/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { activeCount } from '@usemote/core';
import { FloatingField } from '../src/FloatingField.js';

beforeEach(() => {
  window.matchMedia = ((q: string) => ({
    matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number);
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  // happy-dom reports zero-size boxes; give every element a real one.
  Element.prototype.getBoundingClientRect = function () {
    return { width: 800, height: 400, top: 0, left: 0, right: 800, bottom: 400, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('server rendering', () => {
  it('emits frame-0 markup with no browser APIs', () => {
    const html = renderToStaticMarkup(
      <FloatingField count={8} seed={11} ssrWidth={900} ssrHeight={400} />,
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html.match(/<div style=/g)?.length).toBeGreaterThanOrEqual(8);
    expect(html).not.toContain('NaN');
  });

  it('is byte-identical across renders, so hydration cannot mismatch', () => {
    const once = renderToStaticMarkup(<FloatingField count={10} seed="hero" depth />);
    const twice = renderToStaticMarkup(<FloatingField count={10} seed="hero" depth />);
    expect(once).toBe(twice);
  });

  it('keeps the layer out of the layout flow and non-interactive', () => {
    const html = renderToStaticMarkup(<FloatingField count={2} />);
    expect(html).toContain('position:absolute');
    expect(html).toContain('pointer-events:none');
  });
});

describe('client mounting', () => {
  it('mounts a live field', () => {
    const { container } = render(<FloatingField count={6} seed={1} />);
    const layer = container.firstElementChild as HTMLElement;
    expect(layer.children).toHaveLength(6);
    expect(activeCount()).toBe(1);
  });

  it('tears the field down on unmount', () => {
    const { unmount } = render(<FloatingField count={4} />);
    expect(activeCount()).toBe(1);
    unmount();
    expect(activeCount()).toBe(0);
  });

  it('applies className and style overrides', () => {
    const { container } = render(
      <FloatingField count={2} className="bg-layer" style={{ zIndex: 3 }} />,
    );
    const layer = container.firstElementChild as HTMLElement;
    expect(layer.className).toBe('bg-layer');
    expect(layer.style.zIndex).toBe('3');
    expect(layer.style.position).toBe('absolute');
  });

  it('rebuilds on a structural prop change', () => {
    const { container, rerender } = render(<FloatingField count={5} seed={1} />);
    const layer = container.firstElementChild as HTMLElement;
    expect(layer.children).toHaveLength(5);
    rerender(<FloatingField count={12} seed={1} />);
    expect(layer.children).toHaveLength(12);
  });

  it('does not rebuild for a live prop change', () => {
    const { container, rerender } = render(<FloatingField count={5} seed={1} speed={1} />);
    const layer = container.firstElementChild as HTMLElement;
    const first = layer.children[0];
    rerender(<FloatingField count={5} seed={1} speed={2} />);
    expect(layer.children[0]).toBe(first);
  });

  it('does not rebuild when an inline packs/shapes literal keeps the same content', () => {
    const { container, rerender } = render(
      <FloatingField count={4} seed={2} shapes={['circle', 'ring']} />,
    );
    const layer = container.firstElementChild as HTMLElement;
    const first = layer.children[0];
    rerender(<FloatingField count={4} seed={2} shapes={['circle', 'ring']} />);
    expect(layer.children[0]).toBe(first);
  });

  it('shares one scheduler entry per mounted field', () => {
    render(
      <>
        <FloatingField count={3} seed={1} />
        <FloatingField count={3} seed={2} />
      </>,
    );
    expect(activeCount()).toBe(2);
  });
});
