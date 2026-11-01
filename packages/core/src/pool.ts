/**
 * Shape-pool resolution: which shapes a field may draw from.
 *
 * Precedence, per spec 04-core-api: `shapes` wins over `set`. Unknown ids are
 * dropped with a dev warning; if nothing matches we fall back to `set` rather
 * than render an empty field.
 */
import { BASE_PACK } from './shapes.js';
import type { FieldOptions, ShapeDef, ShapePack, SetId } from './types.js';

export function resolvePacks(packs: FieldOptions['packs'], base: ShapePack): ShapePack[] {
  return packs && packs.length > 0 ? packs : [base];
}

/**
 * Flattened shape list across packs, in pack order.
 *
 * A pack may declare `baseShapes` — the base geometric primitives it was
 * designed to sit alongside. Those are folded in automatically, so
 * `packs={[fintech]}` yields objects *and* a curated set of primitives rather
 * than objects alone. Packs that omit it are unaffected, which keeps every
 * existing seed stable.
 *
 * Base shapes are prepended, and de-duplicated across packs, so pack order
 * decides the final list and a shape can never appear twice.
 */
export function allShapes(packs: readonly ShapePack[]): ShapeDef[] {
  const wanted = new Set<string>();
  for (const p of packs) for (const id of p.baseShapes ?? []) wanted.add(id);

  const out: ShapeDef[] = [];
  const seen = new Set<string>();

  if (wanted.size > 0) {
    for (const s of BASE_PACK.shapes) {
      if (wanted.has(s.id) && !seen.has(s.id)) {
        seen.add(s.id);
        out.push(s);
      }
    }
  }

  for (const p of packs) {
    for (const s of p.shapes) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
    }
  }
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
