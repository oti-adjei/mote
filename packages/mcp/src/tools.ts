/**
 * The MCP tool implementations, kept free of any transport concern so they
 * can be unit-tested directly and reused by a CLI or the docs site.
 *
 * Design note: every tool returns compact, factual text rather than JSON
 * dumps. An agent pays for each token of a tool result, and a wall of shape
 * geometry it did not ask for crowds out the task it is actually doing.
 */
import {
  BASE_PACK, PRESETS, layout, renderFieldSVG, validatePack,
  type MotionId, type ShapePack,
} from '@usemote/core';
import { esports } from '@usemote/pack-esports';

export const PACKS: Record<string, ShapePack> = {
  base: BASE_PACK,
  esports,
};

const PRESET_NOTES: Record<MotionId, string> = {
  static: 'Holds position, leans away from the cursor, settles back. No time dependence, so it is also the right choice when motion should be minimal.',
  bob: 'Slow float with a slight sway. The usual hero choice; pair with avoid="center".',
  hop: 'Bounces on the spot with a squash on landing, out of step with neighbours.',
  drift: 'Slow wandering with wrap-around. Pair with depth for a quiet background layer.',
  across: 'A steady parade in one direction, re-entering on a new line each pass. Takes `direction`.',
  bounce: 'Ricochets off walls and other shapes. Collision-based.',
  gravity: 'Drops and piles at the bottom. Click throws pieces up; settled pieces sleep.',
};

export function listPacks(): string {
  const lines = Object.entries(PACKS).map(([name, p]) => {
    const geo = p.shapes.filter((s) => s.kind === 'geo').length;
    const obj = p.shapes.filter((s) => s.kind === 'obj').length;
    const themes = Object.keys(p.themes ?? {}).join(', ') || 'none';
    return `${name} (v${p.version}) — ${p.shapes.length} shapes (${geo} geo, ${obj} obj); themes: ${themes}`;
  });
  return `Mote packs:\n${lines.join('\n')}\n\n` +
    `base ships inside @usemote/core. Others install separately, e.g. @usemote/pack-esports.`;
}

export function listShapes(packName?: string): string {
  const entries = packName ? [[packName, PACKS[packName]] as const] : Object.entries(PACKS);
  const out: string[] = [];
  for (const [name, pack] of entries) {
    if (!pack) {
      return `Unknown pack "${packName}". Available: ${Object.keys(PACKS).join(', ')}.`;
    }
    out.push(`${name}:`);
    for (const s of pack.shapes) {
      out.push(`  ${s.id} — ${s.label} (${s.kind}, ar ${Number(s.ar.toFixed(2))})`);
    }
  }
  out.push('', 'Use these ids in shapes="a,b,c". shapes always wins over set.');
  return out.join('\n');
}

export function listPresets(): string {
  const lines = (Object.keys(PRESETS) as MotionId[]).map(
    (id) => `${id} — ${PRESET_NOTES[id]}`,
  );
  return `Mote motion presets (the \`mode\` prop):\n${lines.join('\n')}`;
}

/**
 * Tool arguments arrive over the wire, where a key may legitimately be present
 * and undefined — so these are `?: T | undefined` rather than plain optionals.
 * Under exactOptionalPropertyTypes those are different types, and a JSON
 * payload is exactly the case the looser one exists for.
 */
export interface SnippetArgs {
  framework?: 'react' | 'html' | 'core' | undefined;
  mode?: string | undefined;
  pack?: string | undefined;
  set?: string | undefined;
  shapes?: string | undefined;
  count?: number | undefined;
  size?: number | undefined;
  seed?: number | string | undefined;
  theme?: string | undefined;
  depth?: boolean | undefined;
  avoid?: string | undefined;
  speed?: number | undefined;
  direction?: string | undefined;
}

export function snippet(args: SnippetArgs): string {
  const {
    framework = 'react', mode = 'bob', pack = 'base',
    set, shapes, count = 14, size = 80, seed = 1,
    theme = 'dark', depth = false, avoid, speed, direction,
  } = args;

  const pairs: Array<[string, string | number | boolean]> = [['mode', mode]];
  if (shapes) pairs.push(['shapes', shapes]);
  else if (set) pairs.push(['set', set]);
  pairs.push(['count', count], ['size', size], ['seed', seed], ['theme', theme]);
  if (depth) pairs.push(['depth', true]);
  if (avoid && avoid !== 'none') pairs.push(['avoid', avoid]);
  if (speed !== undefined && speed !== 1) pairs.push(['speed', speed]);
  if (mode === 'across' && direction) pairs.push(['direction', direction]);

  const usesPack = pack !== 'base';
  const packImport = usesPack ? `import { ${pack} } from '@usemote/pack-${pack}';\n` : '';

  if (framework === 'html') {
    const attrs = pairs
      .map(([k, v]) => (v === true ? `  ${k}` : `  ${k}="${String(v)}"`))
      .join('\n');
    return [
      '<script src="https://cdn.jsdelivr.net/npm/@usemote/web-component"></script>',
      '',
      '<section style="position:relative;overflow:hidden">',
      `  <floating-field${usesPack ? `\n  pack="${pack}"` : ''}`,
      attrs,
      '  ></floating-field>',
      '  <h1 style="position:relative">Your content</h1>',
      '</section>',
    ].join('\n');
  }

  if (framework === 'core') {
    const body = pairs
      .map(([k, v]) => `  ${k}: ${typeof v === 'string' ? `'${v}'` : String(v)},`)
      .join('\n');
    return (
      `import { createField } from '@usemote/core';\n${packImport}\n` +
      `createField(document.querySelector('#bg')!, {\n` +
      `${usesPack ? `  packs: [${pack}],\n` : ''}${body}\n});`
    );
  }

  const props = pairs
    .map(([k, v]) => {
      if (v === true) return `    ${k}`;
      if (typeof v === 'string') return `    ${k}="${v}"`;
      return `    ${k}={${String(v)}}`;
    })
    .join('\n');
  return (
    `import { FloatingField } from '@usemote/react';\n${packImport}\n` +
    `<section style={{ position: 'relative', overflow: 'hidden' }}>\n` +
    `  <FloatingField\n${usesPack ? `    packs={[${pack}]}\n` : ''}${props}\n  />\n` +
    `  <h1 style={{ position: 'relative' }}>Your content</h1>\n` +
    `</section>`
  );
}

export function previewSVG(
  args: SnippetArgs & { width?: number | undefined; height?: number | undefined },
): string {
  const pack = PACKS[args.pack ?? 'base'] ?? BASE_PACK;
  const width = args.width ?? 800;
  const height = args.height ?? 400;
  return renderFieldSVG({
    packs: [pack],
    ...(args.shapes ? { shapes: args.shapes } : {}),
    ...(args.set ? { set: args.set as 'mixed' | 'geo' | 'objects' } : {}),
    mode: (args.mode as MotionId) ?? 'drift',
    count: args.count ?? 12,
    size: args.size ?? 80,
    seed: args.seed ?? 1,
    theme: args.theme ?? 'dark',
    depth: args.depth ?? false,
    width,
    height,
  });
}

export function explainField(
  args: SnippetArgs & { width?: number | undefined; height?: number | undefined },
): string {
  const pack = PACKS[args.pack ?? 'base'] ?? BASE_PACK;
  const width = args.width ?? 1200;
  const height = args.height ?? 600;
  const warnings: string[] = [];
  const particles = layout(
    {
      packs: [pack],
      ...(args.shapes ? { shapes: args.shapes } : {}),
      ...(args.set ? { set: args.set as 'mixed' | 'geo' | 'objects' } : {}),
      count: args.count ?? 14,
      size: args.size ?? 80,
      seed: args.seed ?? 1,
      theme: args.theme ?? 'dark',
      depth: args.depth ?? false,
      ...(args.avoid ? { avoid: args.avoid as 'none' | 'center' | 'top' | 'bottom' } : {}),
    },
    width, height,
    (m) => warnings.push(m),
  );

  const used = new Map<string, number>();
  for (const p of particles) used.set(p.shape.id, (used.get(p.shape.id) ?? 0) + 1);
  const breakdown = [...used.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => `${id}×${n}`)
    .join(', ');

  return [
    `${particles.length} shapes on a ${width}×${height} field from pack "${args.pack ?? 'base'}".`,
    `Shapes used: ${breakdown}`,
    `Deterministic: seed ${String(args.seed ?? 1)} always produces this exact layout.`,
    warnings.length ? `Warnings:\n  ${warnings.join('\n  ')}` : 'No warnings.',
  ].join('\n');
}

export function checkPack(source: string): string {
  // Deliberately not eval'd. An agent handing over pack source is handing
  // over untrusted code; static checks catch the rules that matter without
  // executing anything.
  const issues: string[] = [];
  if (!/viewBox/.test(source)) issues.push('error: no viewBox found — every shape must declare one');
  if (/\sid\s*=\s*["']/.test(source)) issues.push('error: id attribute found — shapes are inlined many times and ids collide');
  if (/<style[\s>]/.test(source)) issues.push('error: <style> found — CSS leaks across the page');
  if (/(?:href|xlink:href)\s*=\s*["'](?!#)/.test(source)) issues.push('error: external reference found — shapes must be self-contained');

  const hex = source.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  const inTemplate = source.match(/\$\{c\.[fd]\}/g) ?? [];
  if (hex.length > 0 && inTemplate.length === 0) {
    issues.push(`warning: hardcoded colours (${[...new Set(hex)].slice(0, 5).join(', ')}) and no c.f/c.d — themes will not apply`);
  }
  if (!/\bar\s*:/.test(source)) issues.push('warning: no `ar` declared — layout uses it for spacing and collision');

  return issues.length === 0
    ? 'No issues found by static check. Run validatePack() at runtime for the full set, which also executes render() and inspects its output.'
    : `${issues.length} issue(s):\n  ${issues.join('\n  ')}`;
}

/** Shared by the real pack validator so agents and humans see one rule set. */
export function validatePackObject(pack: ShapePack): string {
  const issues = validatePack(pack);
  if (issues.length === 0) return 'Pack is valid.';
  return issues.map((i) => `${i.severity}: ${i.shape ?? 'pack'} — ${i.message}`).join('\n');
}
