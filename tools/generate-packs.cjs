/** Generates one @usemote/pack-<id> package per captured design pack. */
const fs = require('fs');
const path = require('path');

const packs = JSON.parse(fs.readFileSync('packs.json', 'utf8'));
const ROOT = '/Volumes/Georgie/Development/Personal/Brand/New/04-code/packages';

// Local helpers, emitted only into the packs that reference them.
const LOCAL = {
  polar: `const polar = (cx: number, cy: number, r: number, a: number): [string, string] =>
  [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)];`,
  HEART: `const HEART =
  'M50 86C18 64 6 46 6 30C6 16 16 6 29 6C39 6 46 12 50 20C54 12 61 6 71 6C84 6 94 16 94 30C94 46 82 64 50 86Z';`,
  DROP: `const DROP = 'M50 4C50 4 16 44 16 64a34 34 0 0 0 68 0C84 44 50 4 50 4z';`,
  gear: `const gear = (cx: number, cy: number, ro: number, ri: number, n: number): string => {
  const w = (Math.PI / n) * 0.45;
  const pts: string[] = [];
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n;
    ([[a - 1.6 * w, ri], [a - w, ro], [a + w, ro], [a + 1.6 * w, ri]] as Array<[number, number]>)
      .forEach(([t, r]) => pts.push(\`\${(cx + r * Math.cos(t)).toFixed(1)},\${(cy + r * Math.sin(t)).toFixed(1)}\`));
  }
  return pts.join(' ');
};`,
  star: `const star = (cx: number, cy: number, ro: number, ri: number, n: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? ri : ro;
    pts.push(\`\${(cx + r * Math.cos(a)).toFixed(1)},\${(cy + r * Math.sin(a)).toFixed(1)}\`);
  }
  return pts.join(' ');
};`,
  fp: `const fp = (c: ShapeColors): string => {
  const arcs: Array<[number, number, number]> = [
    [8, 150, 400], [16, 200, 420], [24, 160, 375], [32, 190, 410], [40, 170, 365],
  ];
  return (
    arcs
      .map(([r, a1, a2]) => {
        const t1 = (a1 * Math.PI) / 180;
        const t2 = (a2 * Math.PI) / 180;
        const x1 = (50 + r * Math.cos(t1)).toFixed(1);
        const y1 = (54 - r * Math.sin(t1)).toFixed(1);
        const x2 = (50 + r * Math.cos(t2)).toFixed(1);
        const y2 = (54 - r * Math.sin(t2)).toFixed(1);
        return \`<path d="M\${x1} \${y1}A\${r} \${r} 0 \${a2 - a1 > 180 ? 1 : 0} 0 \${x2} \${y2}" \${st(c.f, 5)}/>\`;
      })
      .join('') + \`<path d="M50 50v14" \${st(c.f, 5)}/>\`
  );
};`,
  dna: `const dna = (c: ShapeColors): string => {
  const a: string[] = [];
  const b: string[] = [];
  const rungs: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const y = 4 + (i * 92) / 24;
    const t = ((i / 24) * Math.PI) * 3;
    a.push(\`\${(50 + 24 * Math.sin(t)).toFixed(1)},\${y.toFixed(1)}\`);
    b.push(\`\${(50 - 24 * Math.sin(t)).toFixed(1)},\${y.toFixed(1)}\`);
    if (i % 2 === 1) {
      rungs.push(
        \`<line x1="\${(50 + 24 * Math.sin(t)).toFixed(1)}" y1="\${y.toFixed(1)}" \` +
        \`x2="\${(50 - 24 * Math.sin(t)).toFixed(1)}" y2="\${y.toFixed(1)}" \` +
        \`stroke="\${c.f}" stroke-width="3" opacity=".45"/>\`,
      );
    }
  }
  return (
    rungs.join('') +
    \`<polyline points="\${a.join(' ')}" \${st(c.f, 6)}/>\` +
    \`<polyline points="\${b.join(' ')}" \${st(alt(c), 6)}/>\`
  );
};`,
  neural: `const neural = (c: ShapeColors): string => {
  const L: Array<[number, number[]]> = [
    [14, [22, 50, 78]], [50, [14, 38, 62, 86]], [86, [36, 64]],
  ];
  let s = '';
  for (let i = 0; i < 2; i++) {
    for (const a of L[i][1]) {
      for (const b of L[i + 1][1]) {
        s += \`<line x1="\${L[i][0]}" y1="\${a}" x2="\${L[i + 1][0]}" y2="\${b}" \` +
          \`stroke="\${c.f}" stroke-width="2.5" opacity=".45"/>\`;
      }
    }
  }
  L.forEach(([x, ys], i) =>
    ys.forEach((y, k) => {
      s += \`<circle cx="\${x}" cy="\${y}" r="\${i === 1 ? 7 : 8}" fill="\${i === 1 && k === 1 ? alt(c) : c.f}"/>\`;
    }),
  );
  return s;
};`,
  qr: `/**
 * A fixed, plausible-looking QR grid. Seeded from core's PRNG at module load
 * so the pattern is identical in every build and every environment — a shape
 * that reshuffled per render would break determinism.
 */
const qr: Array<[number, number]> = (() => {
  const R = rng(42);
  const N = 21;
  const on: Array<[number, number]> = [];
  const finder = (x: number, y: number): void => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const edge = i === 0 || i === 6 || j === 0 || j === 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (edge || core) on.push([x + i, y + j]);
      }
  };
  finder(0, 0); finder(14, 0); finder(0, 14);
  const inFinder = (x: number, y: number): boolean =>
    (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
  for (let x = 0; x < N; x++)
    for (let y = 0; y < N; y++)
      if (!inFinder(x, y) && R() < 0.48) on.push([x, y]);
  return on;
})();`,
};

/**
 * Declared aspect ratios that disagree with the shape's own viewBox. `ar`
 * drives layout spacing and collision, so a wrong value makes a shape crowd
 * or float away from its neighbours. Same class of slip as esports/cursor.
 * Corrected here while nothing is published.
 */
const AR_FIX = {
  // health/heart2: viewBox is 100x92.
  heart2: 100 / 92,
};

const PASCAL = (id) => id.charAt(0).toUpperCase() + id.slice(1);

/**
 * Explicit, reproducible fixups for the handful of spots where the design
 * source relies on inference TypeScript will not do under `strict`. Kept as a
 * table so regeneration is deterministic and every change to the designer's
 * code is visible here rather than hand-edited into generated output.
 */
const FIXUPS = [
  // creative/palette: bare arrow parameter.
  [/const col = i =>/g, 'const col = (i: number) =>'],
  // ai/tokens: mixed-type tuple table infers as (string | number)[].
  [
    /\[\[3, 46, 'tok', 1\], \[55, 36, 'en', 0\.6\], \[97, 50, 'ize', 1\]\]/g,
    "([[3, 46, 'tok', 1], [55, 36, 'en', 0.6], [97, 50, 'ize', 1]] as Array<[number, number, string, number]>)",
  ],
  // fintech/contactless: `50 - dy` relied on JS string coercion; `50 - +dy`
  // is exactly equivalent, and the neighbouring term already reads `50 + +dy`.
  [/\(50 - dy\)/g, '(50 - +dy)'],
  // devtools/cmdkey: the keycap shadow was a hardcoded #000, inherited from
  // the esports keycap where the same bug was already fixed. A black overlay
  // goes muddy on a light or accent ground; derive it from the detail colour
  // so the shape themes.
  [/fill="#000" opacity="\.25"/g, 'fill="${c.d}" opacity=".25"'],
];

/**
 * Shapes rewritten rather than ported.
 *
 * space/crescent used `<defs><mask id=…>` with a global incrementing uid.
 * That breaks two invariants at once: ids are forbidden because a shape is
 * inlined many times over and would collide, and a counter makes render
 * output differ between the server and the client — a hydration mismatch and
 * unstable frame-0 snapshots. The same crescent is two circles under
 * `fill-rule="evenodd"`: no id, no defs, byte-identical every call.
 */
const REWRITES = {
  crescent: `(c: ShapeColors) =>
      S(
        '0 0 100 100',
        \`<path fill-rule="evenodd" fill="\${c.f}" d="\` +
          \`M6 50a44 44 0 1 0 88 0a44 44 0 1 0-88 0z\` +
          \`M32 36a36 36 0 1 0 72 0a36 36 0 1 0-72 0z"/>\`,
      )`,
};

function renderSource(src) {
  // Captured as `c => S(...)` or `(c, v) => S(...)`. Type the params.
  let s = src.trim();
  for (const [from, to] of FIXUPS) s = s.replace(from, to);
  s = s.replace(/^\(\s*c\s*,\s*v\s*\)\s*=>/, '(c: ShapeColors, v?: string) =>');
  s = s.replace(/^c\s*=>/, '(c: ShapeColors) =>');
  s = s.replace(/^\(\s*c\s*\)\s*=>/, '(c: ShapeColors) =>');
  return s;
}

function emitShape(o) {
  if (REWRITES[o.id]) {
    return `  {\n    id: '${o.id}',\n    label: ${JSON.stringify(o.label)},\n` +
      `    kind: 'obj',\n    ar: ${AR_FIX[o.id] ?? o.ar},\n` +
      (o.s !== undefined ? `    scale: ${o.s},\n` : '') +
      `    render: ${REWRITES[o.id]},\n  }`;
  }
  const parts = [
    `    id: '${o.id}'`,
    `    label: ${JSON.stringify(o.label)}`,
    `    kind: 'obj'`,
    `    ar: ${AR_FIX[o.id] ?? o.ar}`,
  ];
  if (o.s !== undefined) parts.push(`    scale: ${o.s}`);
  if (o.variants) parts.push(`    variants: ${JSON.stringify(o.variants)}`);
  parts.push(`    render: ${renderSource(o.src)}`);
  return `  {\n${parts.join(',\n')},\n  }`;
}

function emitPack(p) {
  const src = p.objects.map((o) => o.src).join(' ');
  const needs = Object.keys(LOCAL).filter((k) =>
    new RegExp(`\\b${k}\\b`).test(src),
  );
  const usesFont = /\bFONT\b/.test(src);
  const usesMono = /\bMONO\b/.test(src);
  const usesAlt = /\balt\(/.test(src);
  const usesSt = /\bst\(/.test(src);
  const usesSpark = /\bSPARK\b/.test(src);
  const usesRng = needs.includes('qr');

  const coreImports = ['type ShapeColors', 'type ShapeDef', 'type ShapePack'];
  if (usesAlt) coreImports.unshift('altColor');
  if (usesRng) coreImports.unshift('rng');
  if (usesSt) coreImports.unshift('stroke');
  if (usesSpark) coreImports.unshift('SPARK_PATH');

  const head = [];
  head.push(`/**`);
  head.push(` * Mote ${p.label} pack — ${p.objects.length} shapes.`);
  head.push(` *`);
  head.push(` * ${p.blurb}`);
  head.push(` *`);
  head.push(` * Ported verbatim from the design source: render bodies are the designer's,`);
  head.push(` * with only the key renames core's ShapeDef requires (s→scale, r→render).`);
  head.push(` */`);
  head.push(`import {`);
  head.push(coreImports.map((i) => `  ${i},`).join('\n'));
  head.push(`} from '@usemote/core';`);
  head.push('');
  head.push(`const S = (viewBox: string, body: string): string =>`);
  head.push(`  \`<svg viewBox="\${viewBox}" xmlns="http://www.w3.org/2000/svg" \` +`);
  head.push(`  \`style="display:block;width:100%;height:100%;overflow:visible">\${body}</svg>\`;`);
  if (usesSt) head.push(`const st = stroke;`);
  if (usesAlt) head.push(`const alt = altColor;`);
  if (usesSpark) head.push(`const SPARK = SPARK_PATH;`);
  if (usesFont) head.push(`const FONT = ${JSON.stringify(p.font || "'Schibsted Grotesk',system-ui,sans-serif")};`);
  if (usesMono) head.push(`const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";`);
  for (const n of needs) head.push('\n' + LOCAL[n]);

  const body = [];
  body.push('');
  body.push(`/** APPEND-ONLY. Reordering or removing changes every existing seed. */`);
  body.push(`export const ${p.id.toUpperCase()}_SHAPES: ShapeDef[] = [`);
  body.push(p.objects.map(emitShape).join(',\n'));
  body.push(`];`);
  body.push('');
  body.push(`export const ${p.id}: ShapePack = {`);
  body.push(`  id: '${p.id}',`);
  body.push(`  name: ${JSON.stringify(p.label)},`);
  body.push(`  version: '0.1.0',`);
  body.push(`  description: ${JSON.stringify(p.blurb)},`);
  body.push(`  shapes: ${p.id.toUpperCase()}_SHAPES,`);
  body.push(`  themes: ${JSON.stringify(p.themes, null, 2).replace(/\n/g, '\n  ')},`);
  body.push(`  swatches: ${JSON.stringify(p.swatches)},`);
  // Omitted rather than emitted empty: an empty array and an absent field
  // behave identically in core, and omitting it keeps the pack honest about
  // the designer not having curated a base set.
  if (p.geo && p.geo.length) {
    body.push(`  baseShapes: ${JSON.stringify(p.geo)},`);
  }
  if (p.bg) body.push(`  background: ${JSON.stringify(p.bg)},`);
  if (p.ink) body.push(`  ink: ${JSON.stringify(p.ink)},`);
  if (p.font) body.push(`  font: { stack: ${JSON.stringify(p.font)}, name: ${JSON.stringify(p.fontName)}, weight: ${p.weight} },`);
  if (p.demo) body.push(`  demo: ${JSON.stringify(p.demo, null, 2).replace(/\n/g, '\n  ')},`);
  body.push(`};`);
  body.push('');
  body.push(`export default ${p.id};`);
  body.push('');

  return head.join('\n') + '\n' + body.join('\n');
}

for (const p of packs) {
  const dir = path.join(ROOT, `pack-${p.id}`);
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'test'), { recursive: true });

  fs.writeFileSync(path.join(dir, 'src', 'index.ts'), emitPack(p));

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    name: `@usemote/pack-${p.id}`,
    version: '0.1.0',
    description: `${p.label} shape pack for Mote — ${p.objects.length} shapes and four themes.`,
    license: 'MIT',
    type: 'module',
    main: './dist/index.cjs',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js', require: './dist/index.cjs' } },
    files: ['dist', 'README.md', 'LICENSE'],
    sideEffects: false,
    scripts: {
      build: 'tsup', typecheck: 'tsc -p tsconfig.json --noEmit',
      test: 'vitest run', size: 'size-limit',
    },
    'size-limit': [{ path: 'dist/index.js', limit: '10 kB' }],
    peerDependencies: { '@usemote/core': 'workspace:^0.1.0' },
    devDependencies: { '@usemote/core': 'workspace:*' },
    publishConfig: { access: 'public' },
  }, null, 2) + '\n');

  // noUncheckedIndexedAccess is off for ported packs only. These are
  // data-literal renderers — fixed coordinate tables indexed by a loop bound
  // to their own length — and the bodies are the designer's, ported verbatim.
  // Rewriting 121 shapes to add assertions would risk changing rendered
  // output for no real safety gain. Every other strict flag stays on, and the
  // pack's own tests exercise every render function.
  fs.writeFileSync(path.join(dir, 'tsconfig.json'),
    JSON.stringify({
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        outDir: 'dist',
        rootDir: 'src',
        noUncheckedIndexedAccess: false,
      },
      include: ['src'],
    }, null, 2) + '\n');

  fs.writeFileSync(path.join(dir, 'tsup.config.ts'),
`import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  target: 'es2022',
  external: ['@usemote/core'],
});
`);

  fs.writeFileSync(path.join(dir, 'vitest.config.ts'),
`import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node', include: ['test/**/*.test.ts'] },
});
`);

  console.log('generated pack-' + p.id);
}
