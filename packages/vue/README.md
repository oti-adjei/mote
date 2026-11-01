# @usemote/vue

Vue 3 binding for [Mote](https://mote.hearvie.dev). **799 B** brotlied.

```bash
pnpm add @usemote/core @usemote/vue
```

```vue
<script setup>
import { FloatingField } from '@usemote/vue';
</script>

<template>
  <section style="position: relative; overflow: hidden">
    <FloatingField mode="bob" set="geo" :count="12" avoid="center" depth />
    <h1 style="position: relative">Your headline</h1>
  </section>
</template>
```

**The field is a layer.** It fills its nearest positioned ancestor, so that
parent needs `position: relative`, and content above it needs
`position: relative` too — otherwise the shapes cover it.

Props match `FieldOptions` exactly, and match `@usemote/react` name for name.
Unset props fall through to core's defaults.

Written as a render function, not an SFC, so the package needs no Vue compiler
and stays a plain dependency.

## SSR

Nuxt and `@vue/server-renderer` both work. The server renders frame 0 and the
client renders identical markup, so there is no hydration mismatch.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural. If you need avatars, use Navii.

## License

MIT
