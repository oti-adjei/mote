# Contributing

Small project. These notes exist so that anyone consuming `@usemote/*` knows
what a version bump means, and so pack authors know the rules.

## Development

Requires [mise](https://mise.jdx.dev) (pins Node 26.12.1 and pnpm 12.4.1).

```bash
mise install
pnpm install
pnpm check      # typecheck → build → test, in that order
pnpm dev        # playground at localhost:5173
```

`pnpm check` builds before testing on purpose: cross-package tests import
`@usemote/core` through its published entry points, so a stale `dist/` makes
them test the wrong code.

## The determinism contract

This is the most important rule in the repo.

**A given `(seed, options, packVersion)` must produce byte-identical frame-0
output forever.** It is what makes fields SSR-safe, screenshots stable and
visual-regression testing possible, and it is the project's main
differentiator.

The frame-0 snapshots in `packages/core/test/__snapshots__` *are* that
contract. A diff there is a breaking change, not a snapshot to refresh. Do not
run `vitest -u` to make a build pass.

### What that implies for versioning

| Change | Bump |
|---|---|
| Appending a shape to a pack | minor |
| **Reordering or removing a shape** | **major** — every existing seed's layout changes |
| **Changing a theme's stops or weights** | **major** — same reason |
| Changing a preset's motion (frame 0 unchanged) | minor |
| **Changing layout maths** | **major** |
| New prop, backward compatible | minor |
| Bug fix with no public API change | patch |

All packages ship in **lockstep**: same version, each depending on the
matching `@usemote/core` via `workspace:^<version>`.

While on `0.x`, treat minor bumps as potentially breaking, per SemVer. Anything
that breaks is called out explicitly in `CHANGELOG.md`.

## Never republish a version

A published version is final. Any change after publish needs a new patch at
minimum. npm tarballs are immutable, and CI skips publishing a version that
already exists.

If a published version has a critical bug: land the fix, bump patch, publish,
then run the deprecate workflow against the bad version pointing at the fix.

## Branches

| Branch | Role |
|---|---|
| `main` | Production. Tagged releases only. |
| `Develop` | Integration. Features merge here first. |
| `RapidQ` | Active development. |

## Authoring a shape pack

A pack is one file of plain data and pure functions — no build step, no core
changes. See `registry/pack-starter/mote-pack.ts` for a commented template, or
install it with `pnpm dlx shadcn@latest add oti-adjei/mote/mote-pack-starter`.

Run `validatePack(pack)` before publishing; it checks all six rules:

1. **Append only.** Never reorder or remove a shape in a published pack.
2. Use `c.f` and `c.d`. Hardcoded colours ignore themes.
3. One `viewBox`; no `width`/`height` on the **root** `<svg>`.
4. Declare `ar` honestly — layout uses it for spacing and collision.
5. No `id` attributes, no `<style>`, no external references.
6. Readable at 40px.

A theme is a weighted list, not a flat palette. Give the quiet pairing the most
weight so accents stay sparse.

## Writing a motion preset

Implement `MotionPreset`. `step` runs per particle per frame with `dt` already
scaled by `speed`.

- Write only `transform` and `opacity`. Nothing that triggers layout.
- **Use `p.phase`** (seeded, 0–1, stratified across the field) to de-synchronise
  neighbours. Without it a field reads as a synchronised chorus line — the
  classic failure of this kind of component.
- **Frame 0 must be visible.** It is what SSR and reduced-motion users get, and
  for them no `step` ever runs. A preset that parks particles off-screen at
  init renders a permanently empty background for those users. There is a test
  enforcing this; `gravity` shipped this bug once.
- Implement `stepAll` only if you need the whole set, as collision does.

## Budgets

Enforced by `size-limit` in CI, not by good intentions.

| Package | Limit |
|---|---|
| `core` | 12 kB |
| `react` | 3 kB |
| `pack-esports` | 8 kB |
| `web-component` (CDN build) | 14 kB |

## Accessibility

Non-negotiable, and the basis of the "infrastructure, not decoration" pitch:

- `aria-hidden="true"` and `pointer-events: none` on the layer.
- `prefers-reduced-motion: reduce` renders a still frame and starts **no**
  animation loop. No user prop may override it.
- Never animate a property that triggers layout.
- The layer must never cause CLS.
