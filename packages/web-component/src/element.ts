/**
 * <floating-field> — the no-build channel.
 *
 * Attributes map 1:1 onto FieldOptions so the prop docs don't fork. Values
 * arrive as strings, so each is coerced and validated here; an invalid value
 * falls back to the default rather than throwing, because a background must
 * never be the reason a page fails to render.
 */
import {
  createField,
  type AvoidId,
  type Direction,
  type FieldHandle,
  type FieldOptions,
  type MotionId,
  type SetId,
  type ShapePack,
} from '@usemote/core';

/** Packs registered by name, so an attribute can reference one. */
const registry = new Map<string, ShapePack>();

export function registerPack(pack: ShapePack, name = pack.id): void {
  registry.set(name, pack);
}

export function registeredPacks(): string[] {
  return [...registry.keys()];
}

const MODES = new Set<string>([
  'static', 'bob', 'hop', 'drift', 'across', 'bounce', 'gravity',
]);
const SETS = new Set(['mixed', 'geo', 'objects']);
const AVOIDS = new Set(['none', 'center', 'top', 'bottom']);
const DIRECTIONS = new Set(['right', 'left', 'up', 'down']);

const OBSERVED = [
  'mode', 'set', 'shapes', 'pack', 'count', 'size', 'seed',
  'theme', 'depth', 'avoid', 'speed', 'interactive', 'direction', 'paused',
] as const;

function bool(v: string | null, fallback: boolean): boolean {
  if (v === null) return fallback;
  // Bare attributes (`depth`) are the HTML idiom for true.
  if (v === '' || v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return fallback;
}

function num(v: string | null, fallback: number | undefined): number | undefined {
  if (v === null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export class FloatingFieldElement extends HTMLElement {
  static get observedAttributes(): readonly string[] {
    return OBSERVED;
  }

  #handle: FieldHandle | null = null;
  #layer: HTMLDivElement | null = null;

  connectedCallback(): void {
    if (this.#handle) return;

    // The element itself is the positioning context the author styles; the
    // field renders into an inner layer so our inline styles never fight the
    // author's CSS on the element.
    if (!this.#layer) {
      const layer = document.createElement('div');
      layer.style.position = 'absolute';
      layer.style.inset = '0';
      this.appendChild(layer);
      this.#layer = layer;
    }

    // A custom element has no default layout: engines may report '' rather
    // than 'static'/'inline' for an element with no UA stylesheet entry, so
    // an empty value means "author has not set one" just as much as the
    // keyword does. Only an explicit author value is left alone.
    const computed = getComputedStyle(this);
    const position = this.style.position || computed.position;
    const display = this.style.display || computed.display;

    if (!position || position === 'static') this.style.position = 'absolute';
    if (!display || display === 'inline') this.style.display = 'block';
    if (!this.style.inset && this.style.position === 'absolute') this.style.inset = '0';

    this.#handle = createField(this.#layer, this.#options());
  }

  disconnectedCallback(): void {
    this.#handle?.destroy();
    this.#handle = null;
    if (this.#layer?.parentNode === this) this.removeChild(this.#layer);
    this.#layer = null;
  }

  attributeChangedCallback(): void {
    this.#handle?.update(this.#options());
  }

  /** Escape hatch for anything attributes cannot express. */
  get field(): FieldHandle | null {
    return this.#handle;
  }

  #options(): FieldOptions {
    const a = (n: string): string | null => this.getAttribute(n);
    const opts: FieldOptions = {};

    const mode = a('mode');
    if (mode !== null && MODES.has(mode)) opts.mode = mode as MotionId;

    const set = a('set');
    if (set !== null && SETS.has(set)) opts.set = set as SetId;

    const shapes = a('shapes');
    if (shapes !== null && shapes.trim() !== '') opts.shapes = shapes;

    const packNames = a('pack');
    if (packNames !== null) {
      const packs = packNames
        .split(',')
        .map((n) => registry.get(n.trim()))
        .filter((p): p is ShapePack => p !== undefined);
      if (packs.length > 0) opts.packs = packs;
    }

    const count = num(a('count'), undefined);
    if (count !== undefined) opts.count = count;

    const size = num(a('size'), undefined);
    if (size !== undefined) opts.size = size;

    const seed = a('seed');
    if (seed !== null) {
      const n = Number(seed);
      opts.seed = Number.isFinite(n) ? n : seed;
    }

    const theme = a('theme');
    if (theme !== null) opts.theme = theme;

    if (this.hasAttribute('depth')) opts.depth = bool(a('depth'), true);

    const avoid = a('avoid');
    if (avoid !== null && AVOIDS.has(avoid)) opts.avoid = avoid as AvoidId;

    const speed = num(a('speed'), undefined);
    if (speed !== undefined) opts.speed = speed;

    if (this.hasAttribute('interactive')) opts.interactive = bool(a('interactive'), true);
    if (this.hasAttribute('paused')) opts.paused = bool(a('paused'), true);

    const direction = a('direction');
    if (direction !== null && DIRECTIONS.has(direction)) {
      opts.direction = direction as Direction;
    }

    return opts;
  }
}

/** Idempotent: a page that loads the script twice must not throw. */
export function define(tag = 'floating-field'): void {
  if (typeof customElements === 'undefined') return;
  if (customElements.get(tag)) return;
  customElements.define(tag, FloatingFieldElement);
}
