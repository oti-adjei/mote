# @usemote/pack-creative

Creative Studio shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Pen-tool curves, brushes, swatches, crop marks and blobs. Tomato, sun-yellow and cobalt on cream.

```bash
pnpm add @usemote/core @usemote/pack-creative
```

```tsx
import { FloatingField } from '@usemote/react';
import { creative } from '@usemote/pack-creative';

<section style={{ position: 'relative', overflow: 'hidden', background: '#1b1714' }}>
  <FloatingField packs={[creative]} mode="hop" count={11} size={86} seed={2} avoid="center" />
  <h1 style={{ position: 'relative', color: '#f3eee6' }}>Your headline</h1>
</section>
```

## Shapes

`pencil` `brush` `bezier` `palette` `swatches` `droplet` `scissors` `crop` `squiggle` `blob` `burst` `type` `ruler` `sticky` `layers`

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#f3eee6` `#ff5a36` `#ffc83d` `#2f54eb` `#1b1714`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

_none curated — pass `packs={[BASE_PACK, creative]}` to mix in primitives._

## Typeface

Text-bearing shapes use **Instrument Serif** at weight 400, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
