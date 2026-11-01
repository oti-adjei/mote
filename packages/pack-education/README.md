# @usemote/pack-education

Education shape pack for [Mote](https://mote.hearvie.dev) — 16 shapes
and four themes.

> Books, caps, apples, atoms and chalk formulas. Chalk white and school-bus yellow on board green.

```bash
pnpm add @usemote/core @usemote/pack-education
```

```tsx
import { FloatingField } from '@usemote/react';
import { education } from '@usemote/pack-education';

<section style={{ position: 'relative', overflow: 'hidden', background: '#1e3b30' }}>
  <FloatingField packs={[education]} mode="gravity" count={20} size={78} seed={13} avoid="center" />
  <h1 style={{ position: 'relative', color: '#f6f1e3' }}>Your headline</h1>
</section>
```

## Shapes

`book` `gradcap` `apple` `bulb` `grade` `globe` `backpack` `atom` `plane` `notebook` `magnifier` `protractor` `bell` `block` `crayon` `formula`

`grade` takes variants: `A+`, `A`, `B+`.
`block` takes variants: `A`, `B`, `C`.
`formula` takes variants: `E=mc²`, `a²+b²=c²`, `πr²`.

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#1e3b30` `#f6f1e3` `#ffd23f` `#ff8a3d` `#1f3a5f`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`triangle` `square` `circle` `plus` `half` `zigzag` `arch`

## Typeface

Text-bearing shapes use **Young Serif** at weight 400, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
