/**
 * Public types for Mote.
 *
 * A field is described by `FieldOptions`, resolved deterministically into
 * `Particle[]` by the layout solver, then animated by a `MotionPreset`.
 * Layout is a pure function of (seed, options); motion is a function of time
 * applied on top. That split is what makes frame 0 SSR-safe and stable.
 */

/** Fill and detail colours handed to a shape's renderer. */
export interface ShapeColors {
  /** Primary mass of the shape. */
  f: string;
  /** Accents, strokes and text drawn over the fill. */
  d: string;
  /**
   * Every fill in the active theme, so a shape can reach for a third colour
   * without hardcoding one. Use `altColor(c)` rather than indexing this.
   * Absent when a caller builds colours by hand.
   */
  p?: readonly string[];
}

/** Where an anchored particle sits in the field. */
export type Anchor =
  | 'left' | 'right' | 'top' | 'bottom'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  | 'center';

export interface ShapeDef {
  /** Stable, unique within its pack. Used in `shapes="…"`. */
  id: string;
  /** Human-readable name, shown in the playground. */
  label: string;
  /** Geometric primitive, or recognisable domain object. */
  kind: 'geo' | 'obj';
  /** Aspect ratio, width / height. */
  ar: number;
  /** Relative size multiplier applied on top of `size`. Default 1. */
  scale?: number;
  /** Optional named variants, passed back to `render`. */
  variants?: string[];
  /**
   * Returns markup. Usually an SVG string, but any self-contained HTML works
   * — the renderer only ever assigns it as the particle's contents, so an
   * `<img>` or a framed `<video>` participates in the field exactly like a
   * drawn shape. Must not emit `id` attributes or `<style>` either way: a
   * shape is inlined many times over, so ids collide and CSS leaks.
   */
  render(c: ShapeColors, variant?: string, width?: number): string;

  /**
   * Anchor this particle to a region instead of scattering it.
   *
   * Only meaningful for `media` items. Large content cannot use `avoid`:
   * rejection sampling assumes shapes small enough to tuck around a region,
   * and a 280px portrait on a 700px hero has no valid position at all. Media
   * therefore needs placement rather than avoidance.
   */
  place?: Anchor;
}

/** One weighted entry in a theme. Higher `w` appears more often. */
export interface ThemeStop extends ShapeColors {
  w: number;
}

export interface ShapePack {
  id: string;
  name: string;
  version: string;
  /**
   * APPEND-ONLY across published versions. Reordering or removing a shape
   * changes every existing seed's layout — a major version bump.
   */
  shapes: ShapeDef[];
  themes?: Record<string, ThemeStop[]>;

  /** One line on what the pack is for. Shown in the playground and docs. */
  description?: string;
  /** Representative colours, darkest first. Presentation only. */
  swatches?: readonly string[];
  /**
   * Ids of base geometric primitives that pair well with this pack. When
   * present, core folds those base shapes into the pool automatically, so
   * `packs={[fintech]}` gives objects *and* a curated set of primitives
   * rather than objects alone. A pack that omits it behaves as before.
   */
  baseShapes?: readonly string[];
  /** Suggested stage background per theme name. Presentation only. */
  background?: Record<string, string>;
  /** Suggested foreground/text colour per theme name. Presentation only. */
  ink?: Record<string, string>;
  /** The pack's display typeface, for text-bearing shapes and demos. */
  font?: { stack: string; name: string; weight: number };
  /** Two configurations that show the pack at its best. */
  demo?: Record<string, Partial<FieldOptions>>;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Particle {
  shape: ShapeDef;
  colors: ShapeColors;
  /** Current position, px, relative to the field origin. */
  x: number;
  y: number;
  /** Deterministic home position. Presets that return to rest use this. */
  homeX: number;
  homeY: number;
  w: number;
  h: number;
  /** Degrees. */
  rot: number;
  scale: number;
  opacity: number;
  /** Blur radius in px, driven by `depth`. */
  blur: number;
  /** Depth, 0 = far, 1 = near. 1 when `depth` is off. */
  z: number;
  /** Velocity, px/s. */
  vx: number;
  vy: number;
  /** Seeded 0..1 offset. Presets MUST use this to de-synchronise neighbours. */
  phase: number;
  /** Per-preset scratch space, initialised by `init`. */
  state: Record<string, number>;
}

export interface Pointer {
  x: number;
  y: number;
  inside: boolean;
}

export interface FieldContext {
  width: number;
  height: number;
  /** Seconds since mount, already scaled by `speed`. */
  t: number;
  speed: number;
  pointer: Pointer;
  avoid: Rect | null;
  interactive: boolean;
  /** Exposed for presets needing neighbours, e.g. `bounce`. */
  particles: readonly Particle[];
}

export interface MotionPreset {
  id: string;
  /** Called once per particle after layout. Use `rand` for seeded values. */
  init?(p: Particle, ctx: FieldContext, rand: () => number): void;
  /** Called every frame, per particle. `dt` is seconds, already scaled by `speed`. */
  step(p: Particle, ctx: FieldContext, dt: number): void;
  /**
   * Called once per frame after every `step`, for behaviour that needs the
   * whole set — pairwise collision, for instance. Most presets omit it.
   */
  stepAll?(particles: Particle[], ctx: FieldContext, dt: number): void;
  /** Pointer press anywhere in the field, e.g. `gravity`'s click-to-throw. */
  onPointerDown?(ctx: FieldContext): void;
}

export type MotionId =
  | 'static'
  | 'bob'
  | 'hop'
  | 'drift'
  | 'across'
  | 'bounce'
  | 'gravity';

export type SetId = 'mixed' | 'geo' | 'objects';
export type AvoidId = 'none' | 'center' | 'top' | 'bottom';
export type Direction = 'right' | 'left' | 'up' | 'down';

export interface FieldOptions {
  mode?: MotionId | MotionPreset;
  set?: SetId;
  /** Explicit shape ids. Wins over `set`. Comma-separated string accepted. */
  shapes?: string | string[];
  /** Pool is the union of these packs. Defaults to the built-in base pack. */
  packs?: ShapePack[];
  count?: number;
  /** Base px for the larger axis, before `ShapeDef.scale` and depth. */
  size?: number;
  /** Strings are hashed. Same seed, same layout, forever. */
  seed?: number | string;
  theme?: string | ThemeStop[];
  depth?: boolean;
  avoid?: AvoidId | Rect;
  speed?: number;
  interactive?: boolean;
  /** `across` only. */
  direction?: Direction;
  paused?: boolean;

  /**
   * Media particles, each rendered exactly once in addition to the `count`
   * shapes drawn from the pool.
   *
   * Media is singular — you want *this* portrait, once, on the right — so it
   * cannot live in the shape pool, where a seed decides how often it appears
   * or whether it appears at all.
   */
  media?: ShapeDef[];
}

export interface FieldHandle {
  update(opts: Partial<FieldOptions>): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}
