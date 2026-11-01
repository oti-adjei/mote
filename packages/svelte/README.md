# @usemote/svelte

Svelte binding for [Mote](https://mote.hearvie.dev), as an action. **396 B**
brotlied.

```bash
pnpm add @usemote/core @usemote/svelte
```

```svelte
<script>
  import { floatingField } from '@usemote/svelte';
</script>

<section style="position:relative;overflow:hidden">
  <div use:floatingField={{ mode: 'bob', set: 'geo', count: 12, avoid: 'center', depth: true }}></div>
  <h1 style="position:relative">Your headline</h1>
</section>
```

## Why an action, not a component

`use:` is Svelte's own primitive for attaching imperative DOM behaviour to an
element, which is exactly what a field is. It also keeps this package
compiler-free — no `.svelte` file, no `svelte-package` step, no coupling to a
Svelte major — so the same build works on Svelte 4 and 5.

**The field is a layer.** Its element fills the nearest positioned ancestor, so
that parent needs `position: relative`, and content above it needs
`position: relative` too.

## SvelteKit SSR

`fieldHTML()` returns the same deterministic frame-0 markup the client will
render, so the first paint is not an empty section:

```svelte
<script>
  import { floatingField, fieldHTML } from '@usemote/svelte';
  const opts = { mode: 'bob', count: 12, seed: 'hero' };
</script>

<div use:floatingField={opts}>
  {@html fieldHTML({ ...opts, width: 1200, height: 600 })}
</div>
```

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
