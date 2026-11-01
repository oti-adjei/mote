# @usemote/pack-fintech

FinTech shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Cards, coins, candlesticks, QR codes and currency glyphs. Mint and gold on forest green.

```bash
pnpm add @usemote/core @usemote/pack-fintech
```

```tsx
import { FloatingField } from '@usemote/react';
import { fintech } from '@usemote/pack-fintech';

<section style={{ position: 'relative', overflow: 'hidden', background: '#09201a' }}>
  <FloatingField packs={[fintech]} mode="across" count={16} size={80} seed={9} depth={true} avoid="center" />
  <h1 style={{ position: 'relative', color: '#f2f0e6' }}>Your headline</h1>
</section>
```

## Shapes

`card` `coins` `candles` `trend` `pie` `wallet` `bank` `percent` `currency` `receipt` `qr` `contactless` `ticker` `bars` `calc`

`currency` takes variants: `$`, `€`, `£`, `₦`, `₵`, `¥`.
`ticker` takes variants: `+2.4%`, `+0.8%`, `+12.6%`.

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#09201a` `#43e8a6` `#f5c451` `#f2f0e6`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`circle` `ring` `half` `quarter` `square` `pill` `triangle`

## Typeface

Text-bearing shapes use **Manrope** at weight 800, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
