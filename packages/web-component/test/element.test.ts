/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BASE_PACK, activeCount } from '@usemote/core';
import { esports } from '@usemote/pack-esports';
import {
  FloatingFieldElement, define, registerPack, registeredPacks,
} from '../src/element.js';

function mount(html: string): FloatingFieldElement {
  const parent = document.createElement('div');
  parent.innerHTML = html;
  document.body.appendChild(parent);
  return parent.firstElementChild as FloatingFieldElement;
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
  registerPack(BASE_PACK, 'base');
  registerPack(esports, 'esports');
  define();
});

afterEach(() => {
  document.body.textContent = '';
  vi.unstubAllGlobals();
});

describe('define', () => {
  it('registers the element', () => {
    expect(customElements.get('floating-field')).toBe(FloatingFieldElement);
  });

  it('is idempotent — a page may load the script twice', () => {
    expect(() => { define(); define(); }).not.toThrow();
  });
});

describe('attributes', () => {
  it('renders a field from markup alone', () => {
    const el = mount('<floating-field count="7" seed="3"></floating-field>');
    expect(el.firstElementChild!.children).toHaveLength(7);
  });

  it('maps attributes onto field options', () => {
    const el = mount(
      '<floating-field pack="esports" set="objects" count="5" size="90" theme="lime" seed="2"></floating-field>',
    );
    expect(el.firstElementChild!.children).toHaveLength(5);
  });

  it('treats a bare attribute as true, the HTML idiom', () => {
    const el = mount('<floating-field count="12" depth seed="4"></floating-field>');
    const styles = Array.from(el.firstElementChild!.children).map((c) => (c as HTMLElement).style);
    expect(styles.some((s) => s.filter.includes('blur'))).toBe(true);
  });

  it('accepts explicit false', () => {
    const el = mount('<floating-field count="12" depth="false" seed="4"></floating-field>');
    const styles = Array.from(el.firstElementChild!.children).map((c) => (c as HTMLElement).style);
    expect(styles.every((s) => s.filter === '')).toBe(true);
  });

  it('accepts string seeds', () => {
    const a = mount('<floating-field count="6" seed="hero"></floating-field>');
    const b = mount('<floating-field count="6" seed="hero"></floating-field>');
    const t = (el: Element) => Array.from(el.firstElementChild!.children).map((c) => (c as HTMLElement).style.transform);
    expect(t(a)).toEqual(t(b));
  });

  it('falls back rather than throwing on nonsense values', () => {
    expect(() =>
      mount('<floating-field mode="banana" set="???" count="abc" avoid="sideways" speed="fast"></floating-field>'),
    ).not.toThrow();
    const el = mount('<floating-field mode="banana" count="xyz"></floating-field>');
    // 18 is the documented default count.
    expect(el.firstElementChild!.children).toHaveLength(18);
  });

  it('ignores an unknown pack name instead of rendering nothing', () => {
    const el = mount('<floating-field pack="does-not-exist" count="4"></floating-field>');
    expect(el.firstElementChild!.children).toHaveLength(4);
  });

  it('unions several packs', () => {
    const el = mount('<floating-field pack="base,esports" set="objects" count="6"></floating-field>');
    expect(el.firstElementChild!.children).toHaveLength(6);
  });

  it('rebuilds when an attribute changes', () => {
    const el = mount('<floating-field count="4" seed="1"></floating-field>');
    expect(el.firstElementChild!.children).toHaveLength(4);
    el.setAttribute('count', '9');
    expect(el.firstElementChild!.children).toHaveLength(9);
  });
});

describe('layout safety', () => {
  it('gives itself a positioning context when the author has not', () => {
    const el = mount('<floating-field count="2"></floating-field>');
    expect(el.style.position).toBe('absolute');
    expect(el.style.display).toBe('block');
  });

  it('does not override an author-supplied position', () => {
    const el = mount('<floating-field count="2" style="position:relative"></floating-field>');
    expect(el.style.position).toBe('relative');
  });
});

describe('lifecycle', () => {
  it('registers with the shared scheduler and cleans up on removal', () => {
    const el = mount('<floating-field count="3"></floating-field>');
    expect(activeCount()).toBe(1);
    el.remove();
    expect(activeCount()).toBe(0);
    expect(el.children).toHaveLength(0);
  });

  it('exposes the handle as an escape hatch', () => {
    const el = mount('<floating-field count="3"></floating-field>');
    expect(el.field).not.toBeNull();
    el.field!.pause();
    expect(activeCount()).toBe(0);
  });

  it('survives being moved in the DOM', () => {
    const el = mount('<floating-field count="4"></floating-field>');
    const other = document.createElement('div');
    document.body.appendChild(other);
    other.appendChild(el);
    expect(el.firstElementChild!.children).toHaveLength(4);
    expect(activeCount()).toBe(1);
  });
});

describe('pack registry', () => {
  it('lists what is registered', () => {
    expect(registeredPacks()).toEqual(expect.arrayContaining(['base', 'esports']));
  });
});
