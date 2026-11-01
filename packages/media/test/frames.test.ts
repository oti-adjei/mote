import { describe, expect, it } from 'vitest';
import { layout, renderFieldHTML } from '@usemote/core';
import { COPY, KINDS, frame, image, isVideo, tier, video, windowShape } from '../src/index.js';
import type { ShapeColors } from '@usemote/core';

const C: ShapeColors = { f: '#d4ff1e', d: '#121212', p: ['#d4ff1e', '#f2f2ee'] };

describe('tier', () => {
  it('drops detail by rendered width, not by breakpoint', () => {
    expect(tier(240)).toBe('S');
    expect(tier(269)).toBe('S');
    expect(tier(270)).toBe('M');
    expect(tier(339)).toBe('M');
    expect(tier(340)).toBe('L');
    expect(tier(900)).toBe('L');
  });
});

describe('every kind', () => {
  it('builds at every tier without producing NaN or undefined', () => {
    for (const kind of KINDS) {
      for (const w of [200, 300, 420]) {
        const r = frame({ kind, w, c: C, pack: 'esports' });
        expect(r.html, `${kind}@${w}`).not.toContain('NaN');
        expect(r.html, `${kind}@${w}`).not.toContain('undefined');
        expect(r.h, `${kind}@${w}`).toBeGreaterThan(0);
        expect(Number.isFinite(r.h)).toBe(true);
      }
    }
  });

  it('uses only the two theme colours, never a hardcoded palette', () => {
    for (const kind of KINDS) {
      const html = frame({ kind, w: 360, c: C, pack: 'esports' }).html;
      const hexes = (html.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [])
        .map((h) => h.toLowerCase())
        .filter((h) => !h.startsWith('#d4ff1e') && !h.startsWith('#121212'));
      // Only the neutral drop-shadow black and the ticket's mask stop remain.
      expect(hexes.every((h) => h === '#000'), `${kind}: ${hexes.join()}`).toBe(true);
    }
  });

  it('emits nothing focusable or clickable — frames are scene objects', () => {
    for (const kind of KINDS) {
      const html = frame({ kind, w: 360, c: C, src: '/a.webm', pack: 'esports' }).html;
      expect(html, kind).not.toMatch(/<(a|button|input|select|textarea)\b/);
      expect(html, kind).not.toContain('onclick');
      expect(html, kind).not.toContain(':hover');
    }
  });

  it('never emits an id attribute, which would collide when inlined twice', () => {
    for (const kind of KINDS) {
      const html = frame({ kind, w: 320, c: C, src: '/a.jpg' }).html;
      expect(html, kind).not.toMatch(/\sid\s*=\s*["']/);
    }
  });
});

describe('size tiers drop detail', () => {
  it('browser shows a URL only at large', () => {
    const url = COPY.esports!.url;
    expect(frame({ kind: 'browser', w: 420, c: C, pack: 'esports' }).html).toContain(url);
    expect(frame({ kind: 'browser', w: 300, c: C, pack: 'esports' }).html).not.toContain(url);
    expect(frame({ kind: 'browser', w: 240, c: C, pack: 'esports' }).html).not.toContain(url);
  });

  it('merges the three controls into one capsule when small', () => {
    const small = frame({ kind: 'browser', w: 240, c: C }).html;
    const large = frame({ kind: 'browser', w: 420, c: C }).html;
    expect((small.match(/border-radius:50%/g) ?? []).length).toBe(0);
    expect((large.match(/border-radius:50%/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it('app drops the side rail below medium', () => {
    const small = frame({ kind: 'app', w: 240, c: C, pack: 'esports' }).html;
    const large = frame({ kind: 'app', w: 420, c: C, pack: 'esports' }).html;
    expect(large).toContain(COPY.esports!.title);
    expect(small).not.toContain(COPY.esports!.title);
  });

  it('caption drops the secondary label when small', () => {
    const cap = COPY.esports!.caps[0]!;
    const large = frame({ kind: 'caption', w: 420, c: C, pack: 'esports', idx: 0 }).html;
    const small = frame({ kind: 'caption', w: 240, c: C, pack: 'esports', idx: 0 }).html;
    expect(large).toContain(cap[0]);
    expect(large).toContain(cap[1]);
    expect(small).toContain(cap[0]);
    expect(small).not.toContain(cap[1]);
  });
});

describe('pack copy', () => {
  it('reads as the domain it sits in', () => {
    expect(frame({ kind: 'browser', w: 420, c: C, pack: 'devtools' }).html).toContain('localhost:3000');
    expect(frame({ kind: 'browser', w: 420, c: C, pack: 'fintech' }).html).toContain('app.ledger.io');
  });

  it('falls back for an unknown pack rather than rendering blank chrome', () => {
    expect(frame({ kind: 'browser', w: 420, c: C, pack: 'nope' }).html).toContain(COPY.esports!.url);
  });

  it('covers all nine packs', () => {
    expect(Object.keys(COPY).sort()).toEqual(
      ['ai', 'creative', 'cyber', 'devtools', 'education', 'esports', 'fintech', 'health', 'space'],
    );
  });
});

describe('media surface', () => {
  it('detects video by extension', () => {
    expect(isVideo('/a.webm')).toBe(true);
    expect(isVideo('/a.mp4?v=2')).toBe(true);
    expect(isVideo('/a.MOV')).toBe(true);
    expect(isVideo('/a.jpg')).toBe(false);
    expect(isVideo('/movie-poster.png')).toBe(false);
  });

  it('NEVER emits autoplay — playback is a runtime decision', () => {
    // Markup must be byte-identical on server and client or hydration
    // mismatches; and reduced motion must be able to simply never start it.
    const html = frame({ kind: 'bare', w: 360, c: C, src: '/a.webm', poster: '/a.jpg' }).html;
    expect(html).not.toContain('autoplay');
    expect(html).toContain('data-mote-media');
    expect(html).toContain('poster="/a.jpg"');
    expect(html).toContain('muted');
    expect(html).toContain('playsinline');
  });

  it('keeps video out of the tab order', () => {
    const html = frame({ kind: 'bare', w: 360, c: C, src: '/a.webm' }).html;
    expect(html).toContain('tabindex="-1"');
  });

  it('lazy-loads images and marks them decorative by default', () => {
    const html = frame({ kind: 'bare', w: 360, c: C, src: '/a.jpg' }).html;
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('alt=""');
  });

  it('carries alt text when given', () => {
    const html = frame({ kind: 'bare', w: 360, c: C, src: '/a.jpg', alt: 'Nova, mid-round' }).html;
    expect(html).toContain('alt="Nova, mid-round"');
  });

  it('escapes attribute values', () => {
    const html = frame({ kind: 'bare', w: 360, c: C, src: '/a.jpg?a=1&b=2', alt: 'say "hi"' }).html;
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;');
    expect(html).not.toContain('alt="say "hi""');
  });

  it('renders an intentional placeholder when there is no source', () => {
    const html = frame({ kind: 'bare', w: 360, c: C }).html;
    expect(html).toContain('repeating-linear-gradient');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<video');
  });
});

describe('windowShape', () => {
  it('measures ar from the built frame rather than guessing', () => {
    // Chrome is not a fixed fraction — a caption strip is clamped 30..46px —
    // so bare and caption of the same ratio must differ.
    const bare = windowShape({ id: 'a', kind: 'bare' });
    const caption = windowShape({ id: 'b', kind: 'caption' });
    expect(bare.ar).toBeGreaterThan(caption.ar);
    expect(bare.ar).toBeCloseTo(16 / 9, 1);
  });

  it('carries place through when given, and omits it otherwise', () => {
    expect(windowShape({ id: 'a', place: 'right' }).place).toBe('right');
    expect(windowShape({ id: 'b' }).place).toBeUndefined();
  });

  it('defaults to a much larger scale than a drawn shape', () => {
    expect(windowShape({ id: 'a', kind: 'bare' }).scale).toBe(3);
    // Kinds with intrinsic proportions carry their own multiplier.
    expect(windowShape({ id: 'b', kind: 'phone' }).scale).toBeCloseTo(1.5);
  });

  it('image() and video() are chrome-free shorthands', () => {
    expect(image({ id: 'i', src: '/a.jpg' }).render(C)).toContain('<img');
    expect(video({ id: 'v', src: '/a.webm' }).render(C)).toContain('<video');
  });
});

describe('integration with a field', () => {
  const nova = windowShape({ id: 'nova', kind: 'caption', src: '/nova.jpg', place: 'right', pack: 'esports' });
  const demo = windowShape({ id: 'demo', kind: 'browser', src: '/demo.webm', poster: '/d.jpg', place: 'bottom-left' });

  it('places each media item exactly once, regardless of seed', () => {
    for (const seed of [1, 2, 99, 'hero']) {
      const out = layout({ count: 10, seed, media: [nova, demo] }, 1400, 700);
      expect(out.filter((p) => p.shape.id === 'nova'), String(seed)).toHaveLength(1);
      expect(out.filter((p) => p.shape.id === 'demo'), String(seed)).toHaveLength(1);
      expect(out).toHaveLength(12);
    }
  });

  it('anchors to the requested side', () => {
    const out = layout({ count: 4, seed: 3, media: [nova, demo] }, 1400, 700);
    const n = out.find((p) => p.shape.id === 'nova')!;
    const d = out.find((p) => p.shape.id === 'demo')!;
    expect(n.x).toBeGreaterThan(700);
    expect(d.x).toBeLessThan(700);
    expect(d.y).toBeGreaterThan(350);
  });

  it('stays deterministic end to end', () => {
    const opts = { count: 8, seed: 'hero', media: [nova, demo], width: 1400, height: 700 } as const;
    const a = renderFieldHTML({ ...opts });
    expect(a).toBe(renderFieldHTML({ ...opts }));
    expect(a).toContain('data-mote-media');
    expect(a).not.toContain('autoplay');
    expect(a).not.toContain('NaN');
  });
});

describe('frames build at the particle width, not a reference one', () => {
  // Regression: render() ignored the particle's size and always built at
  // 320px, so a frame both overflowed its box and froze its chrome at the
  // middle tier regardless of how large it actually appeared.
  const w = windowShape({ id: 'w', kind: 'browser', pack: 'esports' });

  it('picks the tier matching the width it is given', () => {
    const small = w.render(C, undefined, 240);
    const large = w.render(C, undefined, 420);
    expect(small).not.toContain(COPY.esports!.url);
    expect(large).toContain(COPY.esports!.url);
  });

  it('emits markup whose own width matches the particle box', () => {
    for (const px of [200, 320, 500]) {
      const html = w.render(C, undefined, px);
      expect(html.startsWith(`<div style="width:${px}px;`), String(px)).toBe(true);
    }
  });

  it('falls back to the probe width when none is passed', () => {
    expect(w.render(C)).toContain('width:320px');
  });

  it('keeps a frame inside its box through a real field render', () => {
    const field = layout(
      { count: 1, seed: 1, size: 80, media: [windowShape({ id: 'm', kind: 'caption', place: 'right' })] },
      1400, 700,
    );
    // count clamps to a minimum of 1, so media is never at index 0.
    const p = field.find((q) => q.shape.id === 'm')!;
    const html = p.shape.render(C, undefined, p.w);
    const declared = /width:(\d+)px/.exec(html);
    expect(declared).not.toBeNull();
    expect(Number(declared![1])).toBe(Math.round(p.w));
    // and the box is fully inside the field
    expect(p.x + p.w / 2).toBeLessThanOrEqual(1400.5);
  });
});

describe('anchored media keeps clear of the field edge', () => {
  // Regression: clamping to exactly `width - w/2` is correct arithmetic and
  // looks clipped — the outline ring and drop shadow fall outside the field's
  // own overflow:hidden.
  const anchors = ['left', 'right', 'top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

  it('leaves a margin on every anchor, at several sizes', () => {
    for (const place of anchors) {
      for (const scale of [2, 3.4, 5]) {
        const m = windowShape({ id: 'm', kind: 'caption', place, scale });
        const out = layout({ count: 1, seed: 4, size: 70, media: [m] }, 1400, 700);
        const p = out.find((q) => q.shape.id === 'm')!;
        const gap = Math.min(
          p.x - p.w / 2,
          1400 - (p.x + p.w / 2),
          p.y - p.h / 2,
          700 - (p.y + p.h / 2),
        );
        expect(gap, `${place}@${scale}`).toBeGreaterThan(5);
      }
    }
  });

  it('centres media too large for the field rather than pinning it to an edge', () => {
    const m = windowShape({ id: 'big', kind: 'bare', place: 'right', scale: 40 });
    const out = layout({ count: 1, seed: 1, size: 100, media: [m] }, 400, 300);
    const p = out.find((q) => q.shape.id === 'big')!;
    expect(p.x).toBeCloseTo(200, 0);
    expect(Number.isFinite(p.y)).toBe(true);
  });
});
