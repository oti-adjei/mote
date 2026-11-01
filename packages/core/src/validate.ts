/**
 * Pack validation, enforcing the authoring rules from spec 05-shape-library.
 *
 * Exists because the rules are easy to break invisibly: an `id` attribute in
 * an SVG only collides once the shape appears twice, and a hardcoded colour
 * only shows up when someone switches theme. Catching both at authoring time
 * is far cheaper than in a consumer's hero section.
 */
import type { ShapePack } from './types.js';

export interface PackIssue {
  shape: string | null;
  severity: 'error' | 'warning';
  message: string;
}

const HEX = /#[0-9a-fA-F]{3,8}\b/g;

export function validatePack(pack: ShapePack): PackIssue[] {
  const issues: PackIssue[] = [];
  const add = (
    shape: string | null,
    severity: PackIssue['severity'],
    message: string,
  ): void => {
    issues.push({ shape, severity, message });
  };

  if (!pack.id) add(null, 'error', 'pack.id is required');
  if (!pack.version) add(null, 'error', 'pack.version is required');
  if (!Array.isArray(pack.shapes) || pack.shapes.length === 0) {
    add(null, 'error', 'pack.shapes must be a non-empty array');
    return issues;
  }

  const seen = new Set<string>();

  for (const s of pack.shapes) {
    const where = s.id || '(missing id)';

    if (!s.id) add(where, 'error', 'shape.id is required');
    else if (seen.has(s.id)) add(where, 'error', `duplicate shape id "${s.id}"`);
    else seen.add(s.id);

    if (!s.label) add(where, 'warning', 'shape.label is empty; the playground will look broken');
    if (s.kind !== 'geo' && s.kind !== 'obj') add(where, 'error', 'shape.kind must be "geo" or "obj"');
    if (!Number.isFinite(s.ar) || s.ar <= 0) add(where, 'error', 'shape.ar must be a positive number');
    if (s.scale !== undefined && (!Number.isFinite(s.scale) || s.scale <= 0)) {
      add(where, 'error', 'shape.scale must be a positive number when present');
    }
    if (typeof s.render !== 'function') {
      add(where, 'error', 'shape.render must be a function');
      continue;
    }

    let markup = '';
    try {
      markup = s.render({ f: '#000001', d: '#000002' });
    } catch (err) {
      add(where, 'error', `render() threw: ${(err as Error).message}`);
      continue;
    }

    if (!markup.includes('viewBox')) add(where, 'error', 'render() output must declare a viewBox');
    if (/\sid\s*=\s*["']/.test(markup)) {
      add(where, 'error', 'render() output must not contain id attributes — shapes are inlined many times and ids collide');
    }
    if (/<style[\s>]/.test(markup)) {
      add(where, 'error', 'render() output must not contain <style> — CSS leaks across the page');
    }
    // Only the ROOT <svg> tag matters here. Inner elements legitimately carry
    // width/height as geometry (a <rect> must), so scanning the whole string
    // flags every correct shape.
    const rootTag = markup.slice(0, markup.indexOf('>') + 1);
    if (/\swidth\s*=\s*["']\d/.test(rootTag) || /\sheight\s*=\s*["']\d/.test(rootTag)) {
      add(where, 'warning', 'root <svg> sets a fixed width/height; size should come from the field');
    }
    if (/(?:href|xlink:href)\s*=\s*["'](?!#)/.test(markup)) {
      add(where, 'error', 'render() output references an external resource; shapes must be self-contained');
    }

    const colours = markup.match(HEX) ?? [];
    const injected = new Set(['#000001', '#000002']);
    const hardcoded = colours.filter((c) => !injected.has(c.toLowerCase()));
    if (hardcoded.length > 0) {
      add(
        where,
        'warning',
        `hardcoded colour(s) ${[...new Set(hardcoded)].join(', ')} — use c.f and c.d so themes apply`,
      );
    }
  }

  for (const [name, stops] of Object.entries(pack.themes ?? {})) {
    if (!Array.isArray(stops) || stops.length === 0) {
      add(null, 'error', `theme "${name}" must be a non-empty array of stops`);
      continue;
    }
    if (!stops.some((s) => s.w > 0)) {
      add(null, 'error', `theme "${name}" has no stop with a positive weight`);
    }
  }

  return issues;
}
