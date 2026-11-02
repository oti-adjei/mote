/** Copy-out code generation, per spec 02-product-spec Phase 2. */
import { ALL_PACKS } from './packs.js';
import { SIGNATURE, packLabel, type Config } from './config.js';

export type Target = 'react' | 'html' | 'core';

/** Themed packs are real imports; the base pack comes from core. */
function packPieces(c: Config): { importName: string | null; importLine: string; propLine: string } {
  if (c.packId === 'base' || !ALL_PACKS[c.packId]) {
    return {
      importName: 'BASE_PACK',
      importLine: `import { BASE_PACK } from '@usemote/core';\n`,
      propLine: '    packs={[BASE_PACK]}\n',
    };
  }
  return {
    importName: c.packId,
    importLine: `import { ${c.packId} } from '@usemote/pack-${c.packId}';\n`,
    propLine: `    packs={[${c.packId}]}\n`,
  };
}

function attrs(c: Config): Array<[string, string | number | boolean]> {
  const out: Array<[string, string | number | boolean]> = [['mode', c.mode]];
  if (c.shapes.length > 0) out.push(['shapes', c.shapes.join(',')]);
  else out.push(['set', c.set]);
  out.push(['count', c.count], ['size', c.size], ['seed', c.seed]);
  // The signature palette is the site's own stops, not an engine theme —
  // generated code uses the pack's default theme instead.
  if (c.theme !== SIGNATURE) out.push(['theme', c.theme]);
  if (c.depth) out.push(['depth', true]);
  if (c.avoid !== 'none') out.push(['avoid', c.avoid]);
  if (c.speed !== 1) out.push(['speed', c.speed]);
  if (!c.interactive) out.push(['interactive', false]);
  if (c.mode === 'across') out.push(['direction', c.direction]);
  return out;
}

export function generate(c: Config, target: Target): string {
  const a = attrs(c);
  const { importName, importLine, propLine } = packPieces(c);

  if (target === 'react') {
    const props = a
      .map(([k, v]) => {
        if (v === true) return `${k}`;
        if (typeof v === 'string') return `${k}="${v}"`;
        return `${k}={${String(v)}}`;
      })
      .join('\n');
    return (
      `import { FloatingField } from '@usemote/react';\n${importLine}\n` +
      `<div style={{ position: 'relative' }}>\n` +
      `  <FloatingField\n${propLine}${props.replace(/^/gm, '  ')}\n  />\n` +
      `  {/* your content sits above the layer */}\n` +
      `</div>`
    );
  }

  if (target === 'html') {
    const attrStr = a
      .map(([k, v]) => (v === true ? `  ${k}` : `  ${k}="${String(v)}"`))
      .join('\n');
    const pack = importName ? (importName === 'BASE_PACK' ? '' : `\n  pack="${c.packId}"`) : '';
    return (
      `<!-- requires @usemote/web-component -->\n` +
      `<floating-field${pack}\n${attrStr}\n></floating-field>`
    );
  }

  const opts = a
    .map(([k, v]) => `  ${k}: ${typeof v === 'string' ? `'${v}'` : String(v)},`)
    .join('\n');
  return (
    `import { createField${importName === 'BASE_PACK' ? ', BASE_PACK' : ''} } from '@usemote/core';\n` +
    (importName === 'BASE_PACK' ? '' : importLine) +
    `createField(document.querySelector('#bg')!, {\n` +
    `  packs: [${importName}],\n${opts}\n});`
  );
}

/**
 * The "Copy AI prompt" output: a plain-English description of the current
 * field, phrased for an assistant that has the Mote MCP connected. Written
 * with the user's words, constrained by what the tools can actually do.
 */
export function aiPrompt(c: Config): string {
  const pack = ALL_PACKS[c.packId];
  const packLine = c.packId === 'base' || !pack
    ? 'the Mote default base shapes (from @usemote/core)'
    : `the ${pack.name} pack (@usemote/pack-${c.packId})`;
  const palette = c.theme === SIGNATURE
    ? 'the Mote signature palette — white, blush, plum and gum pink'
    : `the pack's ${c.theme} theme`;
  const shapesLine = c.shapes.length > 0
    ? `specific shapes: ${c.shapes.join(', ')}`
    : `the "${c.set}" shape set`;
  const clear = c.avoid === 'none' ? 'no area held clear' : `keep the ${c.avoid} clear for content`;
  return [
    'Use the connected Mote MCP to create a background for my project.',
    '',
    `Shapes: ${packLine}, ${shapesLine}.`,
    `Motion: ${c.mode} at ${c.speed}× speed.`,
    `Field: ${c.count} shapes · ${c.size}px · ${clear}${c.depth ? ' · depth variation on' : ''}.`,
    `Palette: ${palette}.`,
    `Seed: ${c.seed} — keep it, so the layout stays deterministic.`,
    '',
    'Use the tools and settings actually available through the server, and respect reduced-motion preferences.',
  ].join('\n');
}
