/** Copy-out code generation, per spec 02-product-spec Phase 2. */
import type { Config } from './config.js';

export type Target = 'react' | 'html' | 'core';

function attrs(c: Config): Array<[string, string | number | boolean]> {
  const out: Array<[string, string | number | boolean]> = [['mode', c.mode]];
  if (c.shapes.length > 0) out.push(['shapes', c.shapes.join(',')]);
  else out.push(['set', c.set]);
  out.push(['count', c.count], ['size', c.size], ['seed', c.seed], ['theme', c.theme]);
  if (c.depth) out.push(['depth', true]);
  if (c.avoid !== 'none') out.push(['avoid', c.avoid]);
  if (c.speed !== 1) out.push(['speed', c.speed]);
  if (!c.interactive) out.push(['interactive', false]);
  if (c.mode === 'across') out.push(['direction', c.direction]);
  return out;
}

export function generate(c: Config, target: Target): string {
  const a = attrs(c);
  const packImport = c.packId === 'esports'
    ? `import { esports } from '@usemote/pack-esports';\n`
    : '';
  const packProp = c.packId === 'esports' ? '    packs={[esports]}\n' : '';

  if (target === 'react') {
    const props = a
      .map(([k, v]) => {
        if (v === true) return `  ${k}`;
        if (typeof v === 'string') return `  ${k}="${v}"`;
        return `  ${k}={${String(v)}}`;
      })
      .join('\n');
    return (
      `import { FloatingField } from '@usemote/react';\n${packImport}\n` +
      `<div style={{ position: 'relative' }}>\n` +
      `  <FloatingField\n${packProp}${props.replace(/^/gm, '  ')}\n  />\n` +
      `  {/* your content sits above the layer */}\n` +
      `</div>`
    );
  }

  if (target === 'html') {
    const attrStr = a
      .map(([k, v]) => (v === true ? `  ${k}` : `  ${k}="${String(v)}"`))
      .join('\n');
    const pack = c.packId === 'esports' ? '\n  pack="esports"' : '';
    return (
      `<!-- requires @usemote/web-component (phase 4) -->\n` +
      `<floating-field${pack}\n${attrStr}\n></floating-field>`
    );
  }

  const opts = a
    .map(([k, v]) => `  ${k}: ${typeof v === 'string' ? `'${v}'` : String(v)},`)
    .join('\n');
  return (
    `import { createField } from '@usemote/core';\n${packImport}\n` +
    `createField(document.querySelector('#bg')!, {\n` +
    `${c.packId === 'esports' ? '  packs: [esports],\n' : ''}${opts}\n});`
  );
}
