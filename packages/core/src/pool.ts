/**
 * Shape-pool resolution: which shapes a field may draw from.
 *
 * Precedence, per spec 04-core-api: `shapes` wins over `set`. Unknown ids are
 * dropped with a dev warning; if nothing matches we fall back to `set` rather
 * than render an empty field.
 */
import type { FieldOptions, ShapeDef, ShapePack, SetId } from './types.js';

export function resolvePacks(packs: FieldOptions['packs'], base: ShapePack): ShapePack[] {
  return packs && packs.length > 0 ? packs : [base];
}

/** Flattened shape list across packs, in pack order. */
export function allShapes(packs: readonly ShapePack[]): ShapeDef[] {
  const out: ShapeDef[] = [];
  for (const p of packs) out.push(...p.shapes);
  return out;
}

function bySet(shapes: readonly ShapeDef[], set: SetId): ShapeDef[] {
  if (set === 'geo') return shapes.filter((s) => s.kind === 'geo');
  if (set === 'objects') return shapes.filter((s) => s.kind === 'obj');
  return shapes.slice();
}

export function resolvePool(
  packs: readonly ShapePack[],
  shapes: FieldOptions['shapes'],
  set: SetId = 'mixed',
  warn: (msg: string) => void = () => {},
): ShapeDef[] {
  const available = allShapes(packs);

  if (shapes !== undefined) {
    const want = (Array.isArray(shapes) ? shapes : String(shapes).split(','))
      .map((s) => s.trim())
      .filter(Boolean);

    if (want.length > 0) {
      const byId = new Map(available.map((s) => [s.id, s]));
      const picked: ShapeDef[] = [];
      const missing: string[] = [];
      for (const id of want) {
        const found = byId.get(id);
        if (found) picked.push(found);
        else missing.push(id);
      }
      if (missing.length > 0) {
        warn(`mote: unknown shape id(s): ${missing.join(', ')}`);
      }
      if (picked.length > 0) return picked;
      warn('mote: no shapes matched `shapes`; falling back to `set`');
    }
  }

  const fromSet = bySet(available, set);
  if (fromSet.length > 0) return fromSet;

  // `set="objects"` against a geometry-only pack would otherwise render
  // nothing. Degrade to whatever exists.
  warn(`mote: no shapes of kind "${set}" in the active packs; using all shapes`);
  return available;
}
