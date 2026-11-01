# Changelog

All packages ship in lockstep: same version, each depending on the matching
`@usemote/core` via `workspace:^<version>`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
See [CONTRIBUTING.md](./CONTRIBUTING.md) for which kinds of change force a
major bump — in short, anything that alters an existing seed's layout.

## [Unreleased]

Nothing published to npm yet. Everything below is pre-release work on `RapidQ`.

### Added

- **`@usemote/core`** — zero-dependency engine. Seeded PRNG (cyrb53 + sfc32),
  deterministic layout solver, 7 motion presets (`static` `bob` `hop` `drift`
  `across` `bounce` `gravity`), circle-collision solver behind a spatial hash,
  DOM and string renderers, one shared rAF scheduler for every field on the
  page, and `validatePack()`.
- **`@usemote/react`** — `<FloatingField />`, SSR-safe.
- **`@usemote/vue`** — Vue 3 `<FloatingField />`, SSR-safe, render-function
  based so no Vue compiler is needed.
- **`@usemote/svelte`** — `use:floatingField` action plus `fieldHTML()` for
  SvelteKit SSR. Compiler-free, so one build serves Svelte 4 and 5.
- **`@usemote/web-component`** — `<floating-field>` for plain HTML, Astro,
  Webflow and Framer. The CDN build bundles core and both packs.
- **Nine shape packs, 137 shapes.** `pack-esports` (16), plus eight industry
  packs from Oti's designer: `pack-space`, `pack-cyber`, `pack-health`,
  `pack-education`, `pack-devtools`, `pack-ai`, `pack-fintech`,
  `pack-creative` (15–16 each). Every pack ships four themes, swatches,
  per-theme background and ink, a display typeface, demo configurations, and
  a curated `baseShapes` set.
- **Pack metadata in core.** `ShapeColors` carries the theme palette as `p`
  (read it via `altColor()`), and `ShapePack` carries `description`,
  `swatches`, `baseShapes`, `background`, `ink`, `font` and `demo`. A pack
  declaring `baseShapes` has those primitives folded into the pool
  automatically. All additive; no existing seed moves.
- **`@usemote/mcp`** — MCP server (7 tools) and an agent `SKILL.md`.
- shadcn GitHub registry: `pnpm dlx shadcn@latest add oti-adjei/mote/floating-field`.
- CI enforces the determinism contract: a change to the frame-0 snapshots
  fails the build with an explicit "this is a major bump" message.

### Fixed — pre-release

Recorded because each is a trap worth not repeating, not because anyone was
affected.

- **`gravity` rendered a permanently empty field under reduced motion.** Its
  `init` lifted particles above the top edge for a drop-in, but frame 0 is
  what SSR and reduced-motion users get and no `step` ever runs for them.
  Every preset is now covered by a frame-0 visibility test.
- **`update()` rebuilt the field on unchanged pools.** `shapes`/`packs`/`theme`
  were treated as structural when merely present in the patch, so any caller
  passing a full options object reset the field on every update. They now
  compare by content; packs by id and version, since they carry functions.
- **`avoid` was not a guarantee.** Rejection sampling always has a tail — at
  size 140 only ~21% of a 1200×600 field clears a centre region. Placement is
  now two-stage with a deterministic projection fallback.
- **`avoid="center"` was a fixed 55% × 45%,** which left shapes resting on the
  ends of a headline in a wide, short hero. It is now aspect-aware.
- **`validatePack()` flagged the base pack it ships** — its fixed-size rule
  scanned the whole SVG string and caught `width` on inner `<rect>` elements,
  which is required geometry. It now reads the root `<svg>` tag only.
- **`pack-esports` keycap used a hardcoded `#000` shadow,** which went muddy on
  light and lime grounds; it now derives from `c.d`. `cursor` declared
  `ar: 0.8` against a 90×100 viewBox; corrected to `0.9`.
- **`space/crescent` minted an SVG mask id from a global counter.** Ids are
  forbidden because a shape is inlined many times and would collide, and a
  counter makes the server and client render differently — a hydration
  mismatch and an unstable snapshot. Reimplemented as two circles under
  `fill-rule="evenodd"`.
- **`devtools/cmdkey` repeated the esports keycap's hardcoded `#000` shadow.**
  Now derived from `c.d`.
- **`health/heart2` declared `ar: 1` against a 100×92 viewBox.** `ar` drives
  layout spacing and collision, so a wrong value makes a shape crowd its
  neighbours.
