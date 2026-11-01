<h1>Mote</h1>

**A background for every section.** Deterministic, animated fields of designed
SVG shapes — pick a behaviour, a shape pack and a theme, and get a layer that
fills its parent and sits behind your content.

```
(seed, shapes, motion, theme) → an animated background layer
```

> Status: pre-release, `0.1.0`. Nothing is published to npm yet.

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

| Package | What |
|---|---|
| `@usemote/core` | Zero-dependency engine. Shapes, themes, layout, 7 motion presets, DOM + string renderers. |
| `@usemote/react` | `<FloatingField />`, SSR-safe. |
| `@usemote/pack-esports` | 16 esports objects and 4 themes. |

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
pnpm check      # typecheck + test + build
pnpm dev        # playground
```

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
