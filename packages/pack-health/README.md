# @usemote/pack-health

Health & MedTech shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Crosses, ECG lines, capsules, DNA and wearables. Clinical teal and coral on mint-white.

```bash
pnpm add @usemote/core @usemote/pack-health
```

```tsx
import { FloatingField } from '@usemote/react';
import { health } from '@usemote/pack-health';

<section style={{ position: 'relative', overflow: 'hidden', background: '#0b2a2d' }}>
  <FloatingField packs={[health]} mode="bob" count={12} size={82} seed={10} avoid="center" />
  <h1 style={{ position: 'relative', color: '#f2f8f8' }}>Your headline</h1>
</section>
```

## Shapes

`medcross` `ecg` `capsule` `heart2` `stethoscope` `dna` `syringe` `thermometer` `bandage` `molecule` `blood` `wearable` `kit` `vitals` `tablet`

`vitals` takes variants: `72 BPM`, `98% SpO₂`, `120/80`.

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#f2f8f8` `#0d9e9e` `#ff6b6b` `#0b2a2d`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`plus` `circle` `ring` `pill` `half` `dots`

## Typeface

Text-bearing shapes use **Figtree** at weight 800, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
