# @usemote/core

The Mote engine. Zero runtime dependencies, SSR-safe, reduced-motion aware.
**7.7 kB** brotlied.

```bash
pnpm add @usemote/core
```

```ts
import { createField } from '@usemote/core';

const handle = createField(document.querySelector('#bg')!, {
  mode: 'bob', set: 'geo', count: 12, seed: 'hero', avoid: 'center', depth: true,
});

handle.update({ speed: 0.5 });
handle.destroy();
```

## Determinism

The same `(seed, options, packVersion)` produces byte-identical frame-0 output,
forever. Layout is a pure function of the seed; motion is time applied on top.
That split is what makes a field SSR-safe with no hydration mismatch, and
screenshots reproducible.

```ts
import { renderFieldSVG } from '@usemote/core';
const svg = renderFieldSVG({ seed: 'hero', count: 10, width: 1200, height: 630 });
```

## What you get

- **7 motion presets** — `static` `bob` `hop` `drift` `across` `bounce` `gravity`
- **13 geometric shapes** in the built-in `base` pack
- **One shared rAF loop** across every field on the page, so layered compositions stay in phase
- **Automatic pausing** when offscreen, when the tab is hidden, and under reduced motion
- **`validatePack()`** to check your own shape packs against the authoring rules

Full prop reference: see the `FieldOptions` type, or
[mote.hearvie.dev](https://mote.hearvie.dev).

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural, and it is a large one. If you need avatars, use Navii.

## License

MIT
