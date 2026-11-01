/**
 * Mote Creative Studio pack — 15 shapes.
 *
 * Pen-tool curves, brushes, swatches, crop marks and blobs. Tomato, sun-yellow and cobalt on cream.
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

const star = (cx: number, cy: number, ro: number, ri: number, n: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? ri : ro;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
};

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const CREATIVE_SHAPES: ShapeDef[] = [
  {
    id: 'pencil',
    label: "Pencil",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-40 50 50)"><rect x="22" y="40" width="50" height="20" fill="${c.f}"/><rect x="22" y="48" width="50" height="4" fill="${c.d}" opacity=".12"/><polygon points="72,40 92,50 72,60" fill="${c.f}"/><polygon points="72,40 92,50 72,60" fill="${c.d}" opacity=".25"/><polygon points="85,46.5 92,50 85,53.5" fill="${c.d}"/><rect x="8" y="40" width="14" height="20" rx="4" fill="${alt(c)}"/><rect x="19" y="40" width="5" height="20" fill="${c.d}" opacity=".3"/></g>`),
  },
  {
    id: 'brush',
    label: "Brush",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-40 50 50)"><rect x="6" y="44" width="48" height="12" rx="6" fill="${c.f}"/><rect x="52" y="40" width="14" height="20" fill="${c.f}"/><rect x="52" y="40" width="14" height="20" fill="${c.d}" opacity=".3"/><path d="M66 40c14 0 26 4 28 10-2 6-14 10-28 10z" fill="${alt(c)}"/></g>`),
  },
  {
    id: 'bezier',
    label: "Pen tool",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M12 78L30 20M88 78L70 20" stroke="${c.f}" stroke-width="2.5" opacity=".7"/><path d="M12 78C30 20 70 20 88 78" ${st(c.f, 5)}/><circle cx="30" cy="20" r="5.5" fill="${c.f}"/><circle cx="70" cy="20" r="5.5" fill="${c.f}"/><rect x="5" y="71" width="14" height="14" fill="${c.d}" stroke="${c.f}" stroke-width="3.5"/><rect x="81" y="71" width="14" height="14" fill="${c.d}" stroke="${c.f}" stroke-width="3.5"/>`),
  },
  {
    id: 'palette',
    label: "Palette",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => { const dots = (c.p || []).filter(x => x !== c.f); const col = (i: number) => dots[i % (dots.length || 1)] || c.d; return S('0 0 100 100', `<path d="M50 6C24 6 6 26 6 50s18 44 42 44c8 0 10-6 8-12-2-7 2-12 9-12h12c12 0 19-8 19-20C96 26 76 6 50 6z" fill="${c.f}"/>` + [[30, 34], [50, 22], [70, 30], [26, 58]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="8" fill="${col(i)}"/><circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${c.d}" stroke-width="2" opacity=".25"/>`).join('')); },
  },
  {
    id: 'swatches',
    label: "Swatches",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => { const p = c.p && c.p.length ? c.p : [c.f]; return S('0 0 100 100', [-26, 0, 26].map((a, i) => `<g transform="rotate(${a} 50 92)"><rect x="36" y="16" width="28" height="74" rx="5" fill="${p[(p.indexOf(c.f) + i) % p.length]}"/><rect x="36" y="70" width="28" height="20" rx="5" fill="${c.d}" opacity=".18"/></g>`).join('')); },
  },
  {
    id: 'droplet',
    label: "Ink drop",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 4C50 4 16 44 16 64a34 34 0 0 0 68 0C84 44 50 4 50 4z" fill="${c.f}"/><path d="M32 62a18 18 0 0 0 12 18" ${st(c.d, 5)} opacity=".35"/>`),
  },
  {
    id: 'scissors',
    label: "Scissors",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M34 62L78 8M66 62L22 8" ${st(c.f, 9)}/><circle cx="26" cy="74" r="14" ${st(c.f, 8)}/><circle cx="74" cy="74" r="14" ${st(c.f, 8)}/><circle cx="50" cy="42" r="4" fill="${c.d}"/>`),
  },
  {
    id: 'crop',
    label: "Crop marks",
    kind: 'obj',
    ar: 1,
    scale: 0.9,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M24 6v18H6M76 6v18h18M24 94V76H6M76 94V76h18" ${st(c.f, 7)}/><path d="M50 40v20M40 50h20" ${st(c.f, 4)}/>`),
  },
  {
    id: 'squiggle',
    label: "Squiggle",
    kind: 'obj',
    ar: 2.4,
    scale: 1.2,
    render: (c: ShapeColors) => S('0 0 120 50', `<path d="M6 30c10-20 20-20 27 0s17 20 27 0 17-20 27 0 17 20 27 0" ${st(c.f, 9)}/>`),
  },
  {
    id: 'blob',
    label: "Smiley blob",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 6c22 0 42 14 42 38 0 26-18 50-44 50C24 94 6 76 8 52 10 26 28 6 50 6z" fill="${c.f}"/><circle cx="38" cy="42" r="5" fill="${c.d}"/><circle cx="62" cy="42" r="5" fill="${c.d}"/><path d="M36 60c8 10 20 10 28 0" ${st(c.d, 5)}/>`),
  },
  {
    id: 'burst',
    label: "Starburst",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="${star(50, 50, 48, 36, 14)}" fill="${c.f}"/>`),
  },
  {
    id: 'type',
    label: "Type specimen",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<text x="50" y="74" text-anchor="middle" font-family="'Instrument Serif',Georgia,serif" font-style="italic" font-size="80" fill="${c.f}">Aa</text>`),
  },
  {
    id: 'ruler',
    label: "Ruler",
    kind: 'obj',
    ar: 3.5,
    scale: 1.5,
    render: (c: ShapeColors) => S('0 0 140 40', `<rect x="2" y="4" width="136" height="32" rx="4" fill="${c.f}"/>` + Array.from({ length: 17 }, (_, i) => `<rect x="${(9 + i * 7.6).toFixed(1)}" y="4" width="2" height="${i % 4 === 0 ? 14 : i % 2 ? 6 : 9}" fill="${c.d}" opacity=".55"/>`).join('')),
  },
  {
    id: 'sticky',
    label: "Sticky note",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M6 6h88v66L72 94H6z" fill="${c.f}"/><path d="M94 72H72v22z" fill="${c.d}" opacity=".2"/><path d="M18 30h50M18 46h60M18 62h34" ${st(c.d, 4)} opacity=".4"/>`),
  },
  {
    id: 'layers',
    label: "Layers",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="50,58 94,76 50,94 6,76" fill="${c.f}" opacity=".4"/><polygon points="50,40 94,58 50,76 6,58" fill="${c.f}" opacity=".7"/><polygon points="50,22 94,40 50,58 6,40" fill="${c.f}"/>`),
  }
];

export const creative: ShapePack = {
  id: 'creative',
  name: "Creative Studio",
  version: '0.1.0',
  description: "Pen-tool curves, brushes, swatches, crop marks and blobs. Tomato, sun-yellow and cobalt on cream.",
  shapes: CREATIVE_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#ff5a36",
        "d": "#1b1714",
        "w": 3
      },
      {
        "f": "#ffc83d",
        "d": "#1b1714",
        "w": 3
      },
      {
        "f": "#5b82ff",
        "d": "#ffffff",
        "w": 2
      },
      {
        "f": "#f3eee6",
        "d": "#1b1714",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#ff5a36",
        "d": "#1b1714",
        "w": 3
      },
      {
        "f": "#ffc83d",
        "d": "#1b1714",
        "w": 2
      },
      {
        "f": "#2f54eb",
        "d": "#ffffff",
        "w": 2
      },
      {
        "f": "#1b1714",
        "d": "#ffc83d",
        "w": 3
      }
    ],
    "accent": [
      {
        "f": "#1b1714",
        "d": "#ff5a36",
        "w": 3
      },
      {
        "f": "#f3eee6",
        "d": "#1b1714",
        "w": 2
      },
      {
        "f": "#ffc83d",
        "d": "#1b1714",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#f3eee6",
        "d": "#1b1714",
        "w": 2
      },
      {
        "f": "#4a433c",
        "d": "#f3eee6",
        "w": 2
      }
    ]
  },
  swatches: ["#f3eee6","#ff5a36","#ffc83d","#2f54eb","#1b1714"],
  background: {"dark":"#1b1714","light":"#f3eee6","accent":"#ff5a36"},
  ink: {"dark":"#f3eee6","light":"#1b1714","accent":"#1b1714"},
  font: { stack: "'Instrument Serif',Georgia,serif", name: "Instrument Serif", weight: 400 },
  demo: {
    "a": {
      "mode": "hop",
      "count": 11,
      "size": 86,
      "seed": 2
    },
    "b": {
      "mode": "gravity",
      "count": 20,
      "size": 80,
      "seed": 8
    }
  },
};

export default creative;
