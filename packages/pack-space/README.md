# @usemote/pack-space

Space & Cosmos shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Planets, rockets, satellites, comets and constellations. Sun-orange and starlight on deep navy.

```bash
pnpm add @usemote/core @usemote/pack-space
```

```tsx
import { FloatingField } from '@usemote/react';
import { space } from '@usemote/pack-space';

<section style={{ position: 'relative', overflow: 'hidden', background: '#070a1a' }}>
  <FloatingField packs={[space]} mode="drift" count={30} size={62} seed={31} depth={true} avoid="center" />
  <h1 style={{ position: 'relative', color: '#ebe9ff' }}>Your headline</h1>
</section>
```

## Shapes

`saturn` `rocket` `twinkle` `crescent` `helmet` `satellite` `ufo` `comet` `constellation` `orbit` `asteroid` `sun` `blackhole` `telescope` `galaxy`

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#070a1a` `#ffb347` `#7d88ff` `#ebe9ff`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`circle` `ring` `spark` `dots` `half` `plus`

## Typeface

Text-bearing shapes use **Syne** at weight 800, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
