# @usemote/pack-cyber

Cybersecurity shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Locks, shields, fingerprints, radar sweeps and access tags. Terminal neon and alert red on black.

```bash
pnpm add @usemote/core @usemote/pack-cyber
```

```tsx
import { FloatingField } from '@usemote/react';
import { cyber } from '@usemote/pack-cyber';

<section style={{ position: 'relative', overflow: 'hidden', background: '#05090a' }}>
  <FloatingField packs={[cyber]} mode="drift" count={24} size={64} seed={7} depth={true} avoid="center" />
  <h1 style={{ position: 'relative', color: '#d9ffe9' }}>Your headline</h1>
</section>
```

## Shapes

`lock` `unlock` `shield` `key` `fingerprint` `scan` `warning` `binary` `password` `firewall` `radar` `otp` `virus` `access` `captcha`

`binary` takes variants: `0110`, `1001`, `1101`.
`access` takes variants: `ACCESS GRANTED`, `ENCRYPTED`, `VERIFIED`.

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#05090a` `#00ff9c` `#ff3b5c` `#d9ffe9`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`square` `frame` `triangle` `plus` `zigzag` `dots`

## Typeface

Text-bearing shapes use **Chakra Petch** at weight 700, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
