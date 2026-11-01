/**
 * Mote Health & MedTech pack — 15 shapes.
 *
 * Crosses, ECG lines, capsules, DNA and wearables. Clinical teal and coral on mint-white.
 *
 * Ported verbatim from the design source: render bodies are the designer's,
 * with only the key renames core's ShapeDef requires (s→scale, r→render).
 */
import {
  stroke,
  altColor,
  type ShapeColors,
  type ShapeDef,
  type ShapePack,
} from '@usemote/core';

const S = (viewBox: string, body: string): string =>
  `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ` +
  `style="display:block;width:100%;height:100%;overflow:visible">${body}</svg>`;
const st = stroke;
const alt = altColor;
const FONT = "'Figtree',sans-serif";

const HEART =
  'M50 86C18 64 6 46 6 30C6 16 16 6 29 6C39 6 46 12 50 20C54 12 61 6 71 6C84 6 94 16 94 30C94 46 82 64 50 86Z';

const DROP = 'M50 4C50 4 16 44 16 64a34 34 0 0 0 68 0C84 44 50 4 50 4z';

const dna = (c: ShapeColors): string => {
  const a: string[] = [];
  const b: string[] = [];
  const rungs: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const y = 4 + (i * 92) / 24;
    const t = ((i / 24) * Math.PI) * 3;
    a.push(`${(50 + 24 * Math.sin(t)).toFixed(1)},${y.toFixed(1)}`);
    b.push(`${(50 - 24 * Math.sin(t)).toFixed(1)},${y.toFixed(1)}`);
    if (i % 2 === 1) {
      rungs.push(
        `<line x1="${(50 + 24 * Math.sin(t)).toFixed(1)}" y1="${y.toFixed(1)}" ` +
        `x2="${(50 - 24 * Math.sin(t)).toFixed(1)}" y2="${y.toFixed(1)}" ` +
        `stroke="${c.f}" stroke-width="3" opacity=".45"/>`,
      );
    }
  }
  return (
    rungs.join('') +
    `<polyline points="${a.join(' ')}" ${st(c.f, 6)}/>` +
    `<polyline points="${b.join(' ')}" ${st(alt(c), 6)}/>`
  );
};

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const HEALTH_SHAPES: ShapeDef[] = [
  {
    id: 'medcross',
    label: "Medical cross",
    kind: 'obj',
    ar: 1,
    scale: 0.9,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M36 6h28a4 4 0 0 1 4 4v22h22a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H68v22a4 4 0 0 1-4 4H36a4 4 0 0 1-4-4V68H10a4 4 0 0 1-4-4V36a4 4 0 0 1 4-4h22V10a4 4 0 0 1 4-4z" fill="${c.f}"/>`),
  },
  {
    id: 'ecg',
    label: "Heartbeat",
    kind: 'obj',
    ar: 2.3333333333333335,
    scale: 1.4,
    render: (c: ShapeColors) => S('0 0 140 60', `<path d="M4 34h30l8-14 8 28 10-44 10 40 6-10h60" ${st(c.f, 6)}/>`),
  },
  {
    id: 'capsule',
    label: "Capsule",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-35 50 50)"><path d="M50 32H32a18 18 0 0 0 0 36h18z" fill="${c.f}"/><path d="M50 32h18a18 18 0 0 1 0 36H50z" fill="${alt(c)}"/><path d="M28 42h14" ${st(c.d, 4)} opacity=".3"/></g>`),
  },
  {
    id: 'heart2',
    label: "Heart",
    kind: 'obj',
    ar: 1.0869565217391304,
    scale: 0.9,
    render: (c: ShapeColors) => S('0 0 100 92', `<path d="${HEART}" fill="${c.f}"/><path d="M24 22c-5 2-8 7-8 12" ${st(c.d, 5)} opacity=".25"/>`),
  },
  {
    id: 'stethoscope',
    label: "Stethoscope",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M24 8v26a20 20 0 0 0 40 0V8" ${st(c.f, 6)}/><path d="M44 54v14a18 18 0 0 0 36 0v-8" ${st(c.f, 6)}/><circle cx="80" cy="52" r="11" fill="${c.f}"/><circle cx="80" cy="52" r="4.5" fill="${c.d}"/><circle cx="24" cy="8" r="4.5" fill="${c.f}"/><circle cx="64" cy="8" r="4.5" fill="${c.f}"/>`),
  },
  {
    id: 'dna',
    label: "DNA",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', dna(c)),
  },
  {
    id: 'syringe',
    label: "Syringe",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-40 50 50)"><rect x="2" y="38" width="6" height="24" rx="2" fill="${c.f}"/><rect x="6" y="47" width="14" height="6" fill="${c.f}"/><rect x="18" y="34" width="4" height="32" rx="1" fill="${c.f}"/><rect x="20" y="40" width="48" height="20" rx="3" fill="${c.f}"/><rect x="40" y="44" width="24" height="12" fill="${alt(c)}"/><path d="M30 40v6M36 40v6M42 40v6M48 40v6" stroke="${c.d}" stroke-width="2" opacity=".45"/><polygon points="68,44 76,48 76,52 68,56" fill="${c.f}"/><path d="M76 50h20" stroke="${c.f}" stroke-width="2.5"/></g>`),
  },
  {
    id: 'thermometer',
    label: "Thermometer",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="40" y="6" width="20" height="62" rx="10" fill="${c.f}"/><circle cx="50" cy="78" r="16" fill="${c.f}"/><rect x="46" y="30" width="8" height="44" rx="4" fill="${alt(c)}"/><circle cx="50" cy="78" r="9" fill="${alt(c)}"/><path d="M64 18h8M64 30h5M64 42h8M64 54h5" ${st(c.f, 3)}/>`),
  },
  {
    id: 'bandage',
    label: "Bandage",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-30 50 50)"><rect x="4" y="32" width="92" height="36" rx="18" fill="${c.f}"/><rect x="34" y="32" width="32" height="36" fill="${c.d}" opacity=".18"/><g fill="${c.d}" opacity=".45"><circle cx="42" cy="43" r="2.5"/><circle cx="58" cy="43" r="2.5"/><circle cx="50" cy="50" r="2.5"/><circle cx="42" cy="57" r="2.5"/><circle cx="58" cy="57" r="2.5"/></g></g>`),
  },
  {
    id: 'molecule',
    label: "Molecule",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => { const A = [[20, 24, 9], [82, 26, 10], [22, 80, 8], [80, 78, 11]]; return S('0 0 100 100', A.map(([x, y]) => `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="${c.f}" stroke-width="6"/>`).join('') + `<circle cx="50" cy="50" r="14" fill="${c.f}"/>` + A.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? c.f : alt(c)}"/>`).join('')); },
  },
  {
    id: 'blood',
    label: "Drop",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="${DROP}" fill="${c.f}"/><path d="M50 50v24M38 62h24" ${st(c.d, 6)}/>`),
  },
  {
    id: 'wearable',
    label: "Wearable",
    kind: 'obj',
    ar: 0.8,
    scale: 1.05,
    render: (c: ShapeColors) => S('0 0 80 100', `<rect x="22" y="2" width="36" height="96" rx="10" fill="${c.f}"/><rect x="22" y="2" width="36" height="96" rx="10" fill="${c.d}" opacity=".25"/><rect x="10" y="22" width="60" height="56" rx="16" fill="${c.f}"/><rect x="16" y="28" width="48" height="44" rx="11" fill="${c.d}"/><path d="M20 52h10l4-8 5 16 5-20 5 14 3-2h12" ${st(c.f, 3)}/>`),
  },
  {
    id: 'kit',
    label: "First aid",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M38 22v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8" ${st(c.f, 6)}/><rect x="8" y="22" width="84" height="66" rx="10" fill="${c.f}"/><path d="M50 40v30M35 55h30" ${st(c.d, 10)}/>`),
  },
  {
    id: 'vitals',
    label: "Vitals tag",
    kind: 'obj',
    ar: 3,
    scale: 1.45,
    variants: ["72 BPM","98% SpO₂","120/80"],
    render: (c: ShapeColors, v?: string) => S('0 0 150 50', `<rect x="2" y="2" width="146" height="46" rx="23" fill="${c.f}"/><path d="${HEART}" fill="${c.d}" transform="translate(15 16) scale(.2)"/><text x="44" y="32" font-family="'Figtree',${FONT}" font-weight="800" font-size="18" fill="${c.d}">${v || '72 BPM'}</text>`),
  },
  {
    id: 'tablet',
    label: "Tablet",
    kind: 'obj',
    ar: 1,
    scale: 0.8,
    render: (c: ShapeColors) => S('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="${c.f}"/><circle cx="50" cy="50" r="36" fill="none" stroke="${c.d}" stroke-width="3" opacity=".15"/><path d="M24 50h52" ${st(c.d, 4)} opacity=".3"/>`),
  }
];

export const health: ShapePack = {
  id: 'health',
  name: "Health & MedTech",
  version: '0.1.0',
  description: "Crosses, ECG lines, capsules, DNA and wearables. Clinical teal and coral on mint-white.",
  shapes: HEALTH_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#46d6c8",
        "d": "#0b2a2d",
        "w": 3
      },
      {
        "f": "#f2f8f8",
        "d": "#0b2a2d",
        "w": 3
      },
      {
        "f": "#ff7f7f",
        "d": "#0b2a2d",
        "w": 2
      },
      {
        "f": "#1b4a4e",
        "d": "#f2f8f8",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#0d9e9e",
        "d": "#ffffff",
        "w": 3
      },
      {
        "f": "#0b2a2d",
        "d": "#46d6c8",
        "w": 2
      },
      {
        "f": "#ff6b6b",
        "d": "#ffffff",
        "w": 3
      },
      {
        "f": "#cfe4e4",
        "d": "#0b2a2d",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#0b2a2d",
        "d": "#46d6c8",
        "w": 3
      },
      {
        "f": "#ffffff",
        "d": "#0b2a2d",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#f2f8f8",
        "d": "#0b2a2d",
        "w": 2
      },
      {
        "f": "#1b4a4e",
        "d": "#f2f8f8",
        "w": 2
      }
    ]
  },
  swatches: ["#f2f8f8","#0d9e9e","#ff6b6b","#0b2a2d"],
  baseShapes: ["plus","circle","ring","pill","half","dots"],
  background: {"dark":"#0b2a2d","light":"#f2f8f8","accent":"#46d6c8"},
  ink: {"dark":"#f2f8f8","light":"#0b2a2d","accent":"#0b2a2d"},
  font: { stack: "'Figtree',sans-serif", name: "Figtree", weight: 800 },
  demo: {
    "a": {
      "mode": "bob",
      "count": 12,
      "size": 82,
      "seed": 10
    },
    "b": {
      "mode": "hop",
      "count": 9,
      "size": 82,
      "seed": 23
    }
  },
};

export default health;
