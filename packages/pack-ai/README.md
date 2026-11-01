# @usemote/pack-ai

AI & ML shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Neural nets, chips, sparkles, prompts and embeddings. Soft violet and pink on deep indigo.

```bash
pnpm add @usemote/core @usemote/pack-ai
```

```tsx
import { FloatingField } from '@usemote/react';
import { ai } from '@usemote/pack-ai';

<section style={{ position: 'relative', overflow: 'hidden', background: '#110d20' }}>
  <FloatingField packs={[ai]} mode="drift" count={24} size={68} seed={12} depth={true} avoid="center" />
  <h1 style={{ position: 'relative', color: '#f3efff' }}>Your headline</h1>
</section>
```

## Shapes

`neural` `chip` `sparkles` `chat` `robot` `vision` `wave` `tokens` `prompt` `embed` `loss` `attention` `wand` `graph` `gpu`

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#110d20` `#b69cff` `#ff9ed2` `#f3efff`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`circle` `ring` `spark` `dots` `half` `pill` `plus`

## Typeface

Text-bearing shapes use **Space Grotesk** at weight 700, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
