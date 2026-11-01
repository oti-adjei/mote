# @usemote/react

React binding for [Mote](https://mote.hearvie.dev). **627 B** brotlied.

```bash
pnpm add @usemote/core @usemote/react
```

```tsx
import { FloatingField } from '@usemote/react';

<section style={{ position: 'relative', overflow: 'hidden' }}>
  <FloatingField mode="bob" set="geo" count={12} avoid="center" depth />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>
```

**The field is a layer.** It fills its nearest positioned ancestor, so that
parent needs `position: relative`, and content above it needs
`position: relative` too — otherwise the shapes cover it.

## SSR

Works in Next.js app router and anywhere else. The server renders frame 0, the
client renders the identical markup, so there is no hydration mismatch and no
flash of an empty section.

If you pass an inline `packs`, `shapes` or `theme` literal, it is compared by
content rather than identity, so it will not rebuild the field each render. A
custom `mode` preset object should be memoised.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural, and it is a large one. If you need avatars, use Navii.

## License

MIT
