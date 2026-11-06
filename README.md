<h1>Mote</h1>

**A background for every section.** Deterministic, animated fields of designed
SVG shapes — pick a behaviour, a shape pack and a theme, and get a layer that
fills its parent and sits behind your content.

```
(seed, shapes, motion, theme) → an animated background layer
```

> Status: **published**, `0.1.1` on npm, MIT, with provenance.
> Do not use `0.1.0` — its manifests were malformed. See [CHANGELOG.md](./CHANGELOG.md).

Built by **[George Heavenson](https://hearvie.dev)** · [mote.hearvie.dev](https://mote.hearvie.dev)

## Why

Every animated-background library emits abstract gradients, shaders or generic
dots. Mote emits *recognisable objects from your domain* — a controller, a
trophy, a keycap — arranged with taste and configured in one line.

```tsx
<FloatingField mode="bob" set="objects" theme="lime" avoid="center" />
```

And it is **deterministic**: the same seed produces the same layout forever, so
fields are SSR-safe with no hydration mismatch, screenshots are stable, and
visual-regression tests are possible.

## Packages

| Package | What | Size |
|---|---|---|
| [`@usemote/core`](./packages/core) | Zero-dependency engine. Shapes, themes, layout, 7 motion presets, DOM + string renderers. | 7.7 kB |
| [`@usemote/react`](./packages/react) | `<FloatingField />`, SSR-safe. | 627 B |
| [`@usemote/vue`](./packages/vue) | Vue 3 `<FloatingField />`, SSR-safe. | 799 B |
| [`@usemote/svelte`](./packages/svelte) | `use:floatingField` action, SvelteKit-ready. | 396 B |
| [`@usemote/pack-*`](./packages) | **Nine shape packs, 137 shapes.** See below. | ~2 kB each |
| [`@usemote/web-component`](./packages/web-component) | `<floating-field>` for plain HTML, Astro, Webflow, Framer. | 10.6 kB |
| [`@usemote/media`](./packages/media) | Window frames and media particles — photos, GIFs, video. | 5.1 kB |
| [`@usemote/mcp`](./packages/mcp) | MCP server + agent skill. | — |

Sizes are brotlied and enforced in CI.

## Install

```bash
# React
pnpm add @usemote/core @usemote/react

# No build step at all
<script src="https://cdn.jsdelivr.net/npm/@usemote/web-component"></script>

# Vendored source you own, via the shadcn registry
pnpm dlx shadcn@latest add oti-adjei/mote/floating-field
```

## Quick start

```tsx
import { FloatingField } from '@usemote/react';

<section style={{ position: 'relative', overflow: 'hidden' }}>
  <FloatingField mode="bob" set="geo" count={12} avoid="center" depth />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>
```

The field is a layer: it fills its nearest positioned ancestor, so that parent
needs `position: relative` and content above it needs `position: relative` too.

## Shape packs

Each pack is a domain vocabulary with its own palette, typeface and curated set
of geometric primitives. Install only the ones you use.

| Pack | Shapes | What's in it |
|---|---|---|
| `esports` | 16 | Controllers, trophies, keycaps, score tags |
| `space` | 15 | Planets, rockets, satellites, comets, constellations |
| `cyber` | 15 | Locks, shields, fingerprints, radar sweeps, access tags |
| `health` | 15 | Crosses, ECG lines, capsules, DNA, wearables |
| `education` | 16 | Books, caps, apples, atoms, chalk formulas |
| `devtools` | 15 | Terminals, braces, branches, packages, diffs |
| `ai` | 15 | Neural nets, chips, sparkles, prompts, embeddings |
| `fintech` | 15 | Cards, coins, candlesticks, QR codes, currency glyphs |
| `creative` | 15 | Pens, swatches, bezier curves, type specimens |

A pack is one file of plain data and pure functions — no build step, no core
changes. See the [authoring rules](./CONTRIBUTING.md#authoring-a-shape-pack)
or start from the template:

```bash
pnpm dlx shadcn@latest add oti-adjei/mote/mote-pack-starter
```

## Design principles

- **One narrow primitive.** Floating background fields. Not a component builder, not a marketplace.
- **Two extension slots.** Shape packs and motion presets, both plain data and pure functions — no sandboxing, no backend.
- **Determinism is a contract.** Pack shape lists are append-only; reordering one changes every existing layout and is a major version bump.
- **Accessible by default.** `aria-hidden`, `pointer-events: none`, and `prefers-reduced-motion` renders a still frame with no animation loop at all.
- **Budgets, not intentions.** `core` under 12 kB gzipped, enforced in CI.

## Development

Requires [mise](https://mise.jdx.dev) (pins Node 26 and pnpm 12) and pnpm.

```bash
mise install
pnpm install
pnpm check      # typecheck → build → test, in that order
pnpm dev        # playground
```

Build precedes test deliberately: cross-package tests import `@usemote/core`
through its published entry points, so a stale `dist/` tests the wrong code.

See [CONTRIBUTING.md](./CONTRIBUTING.md) — especially the determinism contract,
which governs how versions are bumped.

## Credits

**Engine, bindings and site** — [George Heavenson](https://hearvie.dev).

**The shapes** — all 137 across nine packs were drawn by a designer, not
generated. Nine packs × four themes each, every shape hand-tuned for its
aspect ratio and its palette. It is the part of this project that could not be
made faster by writing code faster, and the part that most defines how a field
actually looks.

## Inspiration

Mote's architecture is modelled closely on **[Navii](https://github.com/uxderrick/navii)**
by **[Derrick Tsorme](https://github.com/uxderrick)** ([uxderrick.com](https://uxderrick.com) ·
[navii.uxderrick.com](https://navii.uxderrick.com)) — a deterministic avatar
engine that generates a unique, reproducible face from any seed. Navii is
genuinely excellent, and seeing how cleanly it solved its own problem is the
reason this project exists at all.

What Mote borrows from it:

- A zero-dependency core that returns SVG strings, with thin per-framework wrappers.
- Determinism as a headline feature rather than an implementation detail — seed in, same output out, forever.
- Packs as the community extension point, with part lists kept append-only so existing seeds never shift.
- Lockstep SemVer across packages, and the `@use…` npm scope convention.

No code is shared between the two projects, and they solve different problems —
Navii makes identities, Mote makes backgrounds. The debt is architectural, and
it is a large one. If you need avatars, use Navii.

## License

MIT
