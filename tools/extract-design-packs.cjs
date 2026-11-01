/** Executes the design pack source with a stub F, capturing exact sources. */
const fs = require('fs');
const vm = require('vm');

const core = fs.readFileSync('06.js', 'utf8');
const captured = [];

// Minimal stand-ins matching the design's helper contract.
const S = (vb, body) =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%;overflow:visible">${body}</svg>`;
const st = (c, w) =>
  `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const alt = (c) => (c.p || []).find((x) => x !== c.f) || c.d;

function rng(seed) {
  let a = (seed * 2654435761) >>> 0 || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const F = {
  S, st, alt, rng,
  FONT: "'Schibsted Grotesk',system-ui,sans-serif",
  MONO: "'JetBrains Mono',ui-monospace,monospace",
  SPARK: 'M50 0C54 36 64 46 100 50C64 54 54 64 50 100C46 64 36 54 0 50C36 46 46 36 50 0z',
  addPack: (p) => captured.push(p),
};

const sandbox = { window: { FloatShapes: F, __fsPending: [] }, console, Math, String, Number, Array, Object, JSON };
vm.createContext(sandbox);

for (const file of ['04.js', '05.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

const out = captured.map((p) => ({
  id: p.id,
  label: p.label,
  font: p.font, fontName: p.fontName, weight: p.weight,
  blurb: p.blurb,
  swatches: p.swatches,
  geo: p.geo,
  themes: p.themes,
  bg: p.bg, ink: p.ink,
  demo: p.demo,
  objects: (p.objects || []).map((o) => ({
    id: o.id, label: o.label, ar: o.ar, s: o.s, variants: o.variants,
    src: o.r.toString(),
  })),
}));

fs.writeFileSync('packs.json', JSON.stringify(out, null, 2));
console.log('captured', out.length, 'packs');
for (const p of out) console.log(' ', p.id.padEnd(12), p.objects.length, 'objects |', p.label);
