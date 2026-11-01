# @usemote/pack-devtools

DevTools shape pack for [Mote](https://mote.hearvie.dev) — 15 shapes
and four themes.

> Terminals, braces, branches, packages and diffs. Editor greens and blues on a dark IDE ground.

```bash
pnpm add @usemote/core @usemote/pack-devtools
```

```tsx
import { FloatingField } from '@usemote/react';
import { devtools } from '@usemote/pack-devtools';

<section style={{ position: 'relative', overflow: 'hidden', background: '#0c0f14' }}>
  <FloatingField packs={[devtools]} mode="drift" count={26} size={66} seed={6} depth={true} avoid="center" />
  <h1 style={{ position: 'relative', color: '#e6edf3' }}>Your headline</h1>
</section>
```

## Shapes

`braces` `tag` `terminal` `branch` `bug` `gear` `package` `database` `cloud` `cmdkey` `diff` `editor` `hash` `plug` `merged`

`cmdkey` takes variants: `⌘`, `⌥`, `⇧`, `esc`.

## Themes

`dark` `light` `accent` `mono` — each a *weighted* list of colour stops, not a
flat palette, so the quiet pairing dominates and accents stay sparse.

Palette: `#0c0f14` `#8ef59b` `#7cc4ff` `#e6edf3`

## Curated primitives

This pack declares `baseShapes`, so passing it alone gives you its objects
**and** the geometric primitives it was designed to sit with:

`square` `frame` `plus` `dots` `zigzag` `pill` `quarter`

## Typeface

Text-bearing shapes use **JetBrains Mono** at weight 800, with a real
fallback stack — an unloaded face degrades rather than breaks.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
