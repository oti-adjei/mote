/**
 * Svelte binding for Mote, shipped as an **action** rather than a component.
 *
 * `use:` is Svelte's own primitive for attaching imperative DOM behaviour to
 * an element, which is exactly what a field is. It also keeps this package
 * compiler-free — no `.svelte` file, no `svelte-package` step, no Svelte
 * version coupling — so it works unchanged on Svelte 4 and 5.
 *
 * ```svelte
 * <section style="position:relative;overflow:hidden">
 *   <div use:floatingField={{ mode: 'bob', set: 'geo', avoid: 'center' }}></div>
 *   <h1 style="position:relative">Your headline</h1>
 * </section>
 * ```
 */
import {
  createField,
  renderFieldHTML,
  type FieldHandle,
  type FieldOptions,
} from '@usemote/core';

export interface FloatingFieldAction {
  update(options: FieldOptions): void;
  destroy(): void;
}

/** Props that change the field's layout rather than just its playback. */
const STRUCTURAL = [
  'seed', 'count', 'size', 'set', 'depth', 'direction', 'mode',
] as const;

function poolKey(o: FieldOptions): string {
  return JSON.stringify([
    o.packs?.map((p) => `${p.id}@${p.version}`) ?? null,
    o.shapes ?? null,
    o.theme ?? null,
  ]);
}

function isStructuralChange(a: FieldOptions, b: FieldOptions): boolean {
  if (poolKey(a) !== poolKey(b)) return true;
  for (const k of STRUCTURAL) {
    if (typeof a[k] === 'object' || typeof b[k] === 'object') {
      // A custom preset object is identity-unstable; treat it as unchanged
      // and let the caller re-key the element if they really swapped it.
      continue;
    }
    if (a[k] !== b[k]) return true;
  }
  return false;
}

export function floatingField(
  node: HTMLElement,
  options: FieldOptions = {},
): FloatingFieldAction {
  let current = { ...options };
  let handle: FieldHandle = createField(node, current);

  return {
    update(next: FieldOptions) {
      if (isStructuralChange(current, next)) {
        handle.destroy();
        handle = createField(node, next);
      } else {
        handle.update(next);
      }
      current = { ...next };
    },
    destroy() {
      handle.destroy();
    },
  };
}

/**
 * Frame-0 markup for SvelteKit SSR, so the first paint is not an empty
 * section. Pair it with the action on the same element:
 *
 * ```svelte
 * <div use:floatingField={opts}>{@html fieldHTML({ ...opts, width: 1200, height: 600 })}</div>
 * ```
 */
export function fieldHTML(
  options: FieldOptions & { width: number; height: number },
): string {
  return renderFieldHTML(options);
}

export default floatingField;
