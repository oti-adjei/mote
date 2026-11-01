---
name: mote
description: Add animated background fields of designed SVG shapes to a page with Mote (@usemote/core). Use when a hero, section or empty state needs a decorative moving background, when the user mentions floating shapes or animated backgrounds, or when authoring a Mote shape pack.
---

# Mote

Deterministic animated background fields. `(seed, shapes, motion, theme) → an
animated background layer` that fills its parent and sits behind content.

## Install

| Context | Install | Import |
|---|---|---|
| React / Next | `@usemote/core @usemote/react` | `import { FloatingField } from '@usemote/react'` |
| Vanilla JS | `@usemote/core` | `import { createField } from '@usemote/core'` |
| Plain HTML, Astro, Webflow | script tag | `<script src="https://cdn.jsdelivr.net/npm/@usemote/web-component"></script>` |
| shadcn users | `pnpm dlx shadcn@latest add oti-adjei/mote/floating-field` | vendored source you own |

Shape packs install separately: `@usemote/pack-esports`. The `base` pack (13
geometric primitives) ships inside core.

## The one thing to get right

**The field is a layer.** It fills its nearest positioned ancestor and is
`pointer-events: none` + `aria-hidden`. So:

1. The parent needs `position: relative` and usually `overflow: hidden`.
2. Content above it needs `position: relative` (or any stacking context), or
   the shapes will cover it.

```tsx
<section style={{ position: 'relative', overflow: 'hidden' }}>
  <FloatingField mode="bob" set="objects" count={10} avoid="center" />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>
```

## Props

| Prop | Values | Default | Notes |
|---|---|---|---|
| `mode` | `static` `bob` `hop` `drift` `across` `bounce` `gravity` | `drift` | See below |
| `set` | `mixed` `geo` `objects` | `mixed` | Ignored when `shapes` is given |
| `shapes` | `"circle,trophy"` or `string[]` | — | **Wins over `set`** |
| `packs` | `ShapePack[]` | `[BASE_PACK]` | Pool is their union |
| `count` | 1–200 | `18` | Warns above 60 |
| `size` | px | `64` | Base for the larger axis |
| `seed` | number or string | `1` | Same seed → same layout, forever |
| `theme` | name or `ThemeStop[]` | `dark` | |
| `depth` | boolean | `false` | Far shapes smaller, slower, blurred |
| `avoid` | `none` `center` `top` `bottom` or a Rect | `none` | Keeps a region clear for content |
| `speed` | 0–3 | `1` | `0` freezes |
| `interactive` | boolean | `true` | Cursor response |
| `direction` | `right` `left` `up` `down` | `right` | `across` only |

## Choosing a mode

- **Hero with a headline** → `bob` + `avoid="center"`. The default choice.
- **Quiet background behind text** → `drift` + `depth`, low `count`, `speed` ~0.5.
- **Text-heavy section** → `static`. No time dependence; calm.
- **Playful / interactive** → `gravity` (click throws) or `bounce`.
- **Banner or marquee feel** → `across` with a `direction`.
- **Rich hero** → layer two fields: a `drift` + `depth` + `mono` layer behind, a
  `bob` layer of a few large objects in front. They share one animation loop.

```tsx
<FloatingField mode="drift" set="geo" theme="mono" count={40} size={40} seed={2} depth />
<FloatingField packs={[esports]} mode="bob" shapes="controller,trophy,headset"
               count={5} size={110} seed={8} avoid="center" />
```

## Things that are easy to get wrong

- **`avoid` is sized relative to the container** and is aspect-aware: ~55% wide
  on a square box, widening toward 78% on a wide short one. For a very long
  headline pass an explicit Rect instead of `"center"`.
- **Don't raise `count` to fill a large area** — raise `size`. The DOM budget is
  about node count, not coverage.
- **Determinism is a contract.** Don't generate a random seed per render; that
  defeats SSR and makes screenshots unstable. Use a stable string.
- **Reduced motion is handled for you.** The field renders a still frame and
  starts no animation loop. Don't add your own media query on top.
- **Don't put the field after your content in the DOM and then fight z-index.**
  Put it first; give content `position: relative`.

## Authoring a shape pack

A pack is one file of plain data and pure functions.

```ts
import type { ShapePack } from '@usemote/core';

export const myPack: ShapePack = {
  id: 'my-pack', name: 'My Pack', version: '0.1.0',
  shapes: [{
    id: 'terminal', label: 'Terminal', kind: 'obj', ar: 1.4,
    render: (c) => `<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg"
      style="display:block;width:100%;height:100%">
      <rect width="140" height="100" rx="12" fill="${c.f}"/>
      <path d="M26 44l14 12-14 12" stroke="${c.d}" stroke-width="8" fill="none"/>
    </svg>`,
  }],
  themes: { dark: [{ f: '#7dd3fc', d: '#0c0a09', w: 3 }, { f: '#44403c', d: '#f5f5f4', w: 2 }] },
};
```

Rules, all checked by `validatePack(pack)`:

1. **Append only.** Reordering or removing a shape in a published pack changes
   every existing seed's layout. That is a major version bump.
2. Use `c.f` (fill) and `c.d` (detail). Hardcoded colours ignore themes.
3. One `viewBox`; no `width`/`height` on the **root** `<svg>`. Inner elements
   may carry geometry.
4. Declare `ar` honestly — layout uses it for spacing and collision.
5. No `id` attributes, no `<style>`, no external refs. Shapes are inlined many
   times: ids collide and CSS leaks.
6. Readable at 40px.

A theme is a **weighted** list, not a flat palette. Give the quiet pairing the
most weight so accents stay sparse — that is most of what makes a field read as
designed rather than random.

## Custom motion

`mode` accepts a preset object as well as a name.

```ts
const sink: MotionPreset = {
  id: 'sink',
  init: (p, _ctx, rand) => { p.state.rate = 10 + rand() * 20; },
  step: (p, ctx, dt) => {
    p.y += (p.state.rate ?? 10) * dt;
    if (p.y - p.h > ctx.height) p.y = -p.h;
  },
};
```

Use `p.phase` (seeded, 0–1, stratified across the field) to de-synchronise
neighbours — without it a field reads as a synchronised chorus line. Memoise the
object, or the field rebuilds every render.
