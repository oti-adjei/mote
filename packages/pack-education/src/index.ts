/**
 * Mote Education pack — 16 shapes.
 *
 * Books, caps, apples, atoms and chalk formulas. Chalk white and school-bus yellow on board green.
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

const polar = (cx: number, cy: number, r: number, a: number): [string, string] =>
  [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)];

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const EDUCATION_SHAPES: ShapeDef[] = [
  {
    id: 'book',
    label: "Open book",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 24C38 14 22 12 6 14v66c16-2 32 0 44 10z" fill="${c.f}"/><path d="M50 24c12-10 28-12 44-10v66c-16-2-32 0-44 10z" fill="${c.f}"/><path d="M50 24c12-10 28-12 44-10v66c-16-2-32 0-44 10z" fill="${c.d}" opacity=".1"/><path d="M50 24v66" stroke="${c.d}" stroke-width="3" opacity=".35"/><path d="M14 30c10-1 20 0 28 4M14 44c10-1 20 0 28 4M14 58c10-1 20 0 28 4M58 34c8-4 18-5 28-4M58 48c8-4 18-5 28-4" ${st(c.d, 3)} opacity=".3"/>`),
  },
  {
    id: 'gradcap',
    label: "Grad cap",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M24 46v22c0 8 12 14 26 14s26-6 26-14V46L50 58z" fill="${c.f}"/><path d="M24 46v22c0 8 12 14 26 14s26-6 26-14V46L50 58z" fill="${c.d}" opacity=".2"/><polygon points="50,14 96,36 50,58 4,36" fill="${c.f}"/><path d="M50 36L86 44v24" ${st(alt(c), 3)}/><circle cx="86" cy="72" r="5" fill="${alt(c)}"/>`),
  },
  {
    id: 'apple',
    label: "Apple",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 30c0-10 2-16 8-22" ${st(c.f, 5)}/><path d="M54 20c4-10 14-14 24-12-2 10-12 16-24 12z" fill="${alt(c)}"/><path d="M50 30c-6-6-30-10-34 14-4 22 12 48 26 48 4 0 6-2 8-2s4 2 8 2c14 0 30-26 26-48-4-24-28-20-34-14z" fill="${c.f}"/><path d="M28 46c0-6 3-10 8-12" ${st(c.d, 4)} opacity=".25"/>`),
  },
  {
    id: 'bulb',
    label: "Idea",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 6a30 30 0 0 0-18 54c4 4 6 8 6 14h24c0-6 2-10 6-14A30 30 0 0 0 50 6z" fill="${c.f}"/><rect x="38" y="78" width="24" height="6" rx="2" fill="${c.f}"/><rect x="41" y="87" width="18" height="6" rx="3" fill="${c.f}"/><path d="M44 58l6-14 6 14" ${st(c.d, 3.5)} opacity=".55"/>`),
  },
  {
    id: 'grade',
    label: "Grade stamp",
    kind: 'obj',
    ar: 1,
    scale: 0.95,
    variants: ["A+","A","B+"],
    render: (c: ShapeColors, v?: string) => S('0 0 100 100', `<g transform="rotate(-12 50 50)"><circle cx="50" cy="50" r="45" fill="none" stroke="${c.f}" stroke-width="4"/><circle cx="50" cy="50" r="37" fill="${c.f}"/><text x="50" y="63" text-anchor="middle" font-family="'Young Serif',Georgia,serif" font-size="36" fill="${c.d}">${v || 'A+'}</text></g>`),
  },
  {
    id: 'globe',
    label: "Globe",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M14 44a36 36 0 0 0 64 24" ${st(c.f, 5)}/><path d="M50 80v10M36 92h28" ${st(c.f, 6)}/><circle cx="50" cy="44" r="32" fill="${c.f}"/><g fill="none" stroke="${c.d}" stroke-width="3" opacity=".35"><ellipse cx="50" cy="44" rx="14" ry="32"/><path d="M18 44h64M24 28h52M24 60h52"/></g>`),
  },
  {
    id: 'backpack',
    label: "Backpack",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M38 20a12 12 0 0 1 24 0" ${st(c.f, 6)}/><rect x="16" y="18" width="68" height="76" rx="22" fill="${c.f}"/><rect x="28" y="56" width="44" height="28" rx="8" fill="${c.d}" opacity=".2"/><rect x="28" y="56" width="44" height="9" rx="4" fill="${c.d}" opacity=".25"/><rect x="44" y="38" width="12" height="5" rx="2.5" fill="${c.d}" opacity=".4"/>`),
  },
  {
    id: 'atom',
    label: "Atom",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', [0, 60, -60].map(a => `<ellipse cx="50" cy="50" rx="44" ry="16" fill="none" stroke="${c.f}" stroke-width="5" transform="rotate(${a} 50 50)"/>`).join('') + `<circle cx="50" cy="50" r="9" fill="${alt(c)}"/><circle cx="94" cy="50" r="5" fill="${c.f}"/><circle cx="28" cy="88" r="5" fill="${c.f}"/>`),
  },
  {
    id: 'plane',
    label: "Paper plane",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="4,46 96,8 48,62" fill="${c.f}"/><polygon points="48,62 96,8 70,90" fill="${c.f}"/><polygon points="48,62 96,8 70,90" fill="${c.d}" opacity=".25"/><polygon points="48,62 40,92 58,72" fill="${c.f}"/><polygon points="48,62 40,92 58,72" fill="${c.d}" opacity=".4"/>`),
  },
  {
    id: 'notebook',
    label: "Notebook",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="18" y="6" width="70" height="88" rx="6" fill="${c.f}"/><path d="M32 6v88" stroke="${alt(c)}" stroke-width="2.5"/><path d="M38 30h40M38 44h40M38 58h40M38 72h26" ${st(c.d, 3)} opacity=".25"/>` + [16, 30, 44, 58, 72, 86].map(y => `<rect x="10" y="${y - 3}" width="16" height="6" rx="3" fill="${c.f}"/><circle cx="24" cy="${y}" r="2.5" fill="${c.d}" opacity=".5"/>`).join('')),
  },
  {
    id: 'magnifier',
    label: "Magnifier",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<circle cx="42" cy="42" r="28" ${st(c.f, 9)}/><path d="M62 62l28 28" ${st(c.f, 13)}/><path d="M28 36a16 16 0 0 1 12-10" ${st(c.f, 4)} opacity=".6"/>`),
  },
  {
    id: 'protractor',
    label: "Protractor",
    kind: 'obj',
    ar: 1.7857142857142858,
    scale: 1.2,
    render: (c: ShapeColors) => S('0 0 100 56', `<path d="M4 52a46 46 0 0 1 92 0H72a22 22 0 0 0-44 0z" fill="${c.f}"/>` + Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i + 0.5) * Math.PI / 9, [x1, y1] = polar(50, 52, 36, a), [x2, y2] = polar(50, 52, 44, a); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c.d}" stroke-width="2" opacity=".45"/>`; }).join('')),
  },
  {
    id: 'bell',
    label: "School bell",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="46" y="2" width="8" height="10" rx="3" fill="${c.f}"/><circle cx="50" cy="84" r="8" fill="${c.f}"/><path d="M50 10c-18 0-28 14-28 30v20l-10 14h76L78 60V40c0-16-10-30-28-30z" fill="${c.f}"/><path d="M32 40c0-10 6-18 14-20" ${st(c.d, 4)} opacity=".25"/>`),
  },
  {
    id: 'block',
    label: "Letter block",
    kind: 'obj',
    ar: 1,
    variants: ["A","B","C"],
    render: (c: ShapeColors, v?: string) => S('0 0 100 100', `<polygon points="8,26 28,8 92,8 72,26" fill="${c.f}"/><polygon points="8,26 28,8 92,8 72,26" fill="${c.d}" opacity=".12"/><polygon points="72,26 92,8 92,72 72,90" fill="${c.f}"/><polygon points="72,26 92,8 92,72 72,90" fill="${c.d}" opacity=".3"/><rect x="8" y="26" width="64" height="64" fill="${c.f}"/><text x="40" y="74" text-anchor="middle" font-family="'Young Serif',Georgia,serif" font-size="46" fill="${c.d}">${v || 'A'}</text>`),
  },
  {
    id: 'crayon',
    label: "Crayon",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-40 50 50)"><rect x="12" y="40" width="60" height="20" rx="3" fill="${c.f}"/><path d="M72 41l16 6v6l-16 6z" fill="${c.f}"/><rect x="22" y="40" width="4" height="20" fill="${c.d}" opacity=".3"/><rect x="60" y="40" width="4" height="20" fill="${c.d}" opacity=".3"/><rect x="32" y="45" width="22" height="10" rx="2" fill="${c.d}" opacity=".2"/></g>`),
  },
  {
    id: 'formula',
    label: "Chalk formula",
    kind: 'obj',
    ar: 2.8,
    scale: 1.5,
    variants: ["E=mc²","a²+b²=c²","πr²"],
    render: (c: ShapeColors, v?: string) => S('0 0 140 50', `<text x="70" y="36" text-anchor="middle" font-family="'Young Serif',Georgia,serif" font-size="${(v || '').length > 6 ? 24 : 32}" fill="${c.f}">${v || 'E=mc²'}</text>`),
  }
];

export const education: ShapePack = {
  id: 'education',
  name: "Education",
  version: '0.1.0',
  description: "Books, caps, apples, atoms and chalk formulas. Chalk white and school-bus yellow on board green.",
  shapes: EDUCATION_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#f6f1e3",
        "d": "#1e3b30",
        "w": 3
      },
      {
        "f": "#ffd23f",
        "d": "#1e3b30",
        "w": 3
      },
      {
        "f": "#ff8a3d",
        "d": "#1e3b30",
        "w": 2
      },
      {
        "f": "#36604f",
        "d": "#f6f1e3",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#1f3a5f",
        "d": "#ffd23f",
        "w": 3
      },
      {
        "f": "#ff8a3d",
        "d": "#1f3a5f",
        "w": 3
      },
      {
        "f": "#ffd23f",
        "d": "#1f3a5f",
        "w": 2
      },
      {
        "f": "#3fa06c",
        "d": "#ffffff",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#1f3a5f",
        "d": "#ffd23f",
        "w": 3
      },
      {
        "f": "#ffffff",
        "d": "#1f3a5f",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#f6f1e3",
        "d": "#1e3b30",
        "w": 2
      },
      {
        "f": "#36604f",
        "d": "#f6f1e3",
        "w": 2
      }
    ]
  },
  swatches: ["#1e3b30","#f6f1e3","#ffd23f","#ff8a3d","#1f3a5f"],
  baseShapes: ["triangle","square","circle","plus","half","zigzag","arch"],
  background: {"dark":"#1e3b30","light":"#fbf6ec","accent":"#ffd23f"},
  ink: {"dark":"#f6f1e3","light":"#1f3a5f","accent":"#1f3a5f"},
  font: { stack: "'Young Serif',Georgia,serif", name: "Young Serif", weight: 400 },
  demo: {
    "a": {
      "mode": "gravity",
      "count": 20,
      "size": 78,
      "seed": 13
    },
    "b": {
      "mode": "bob",
      "count": 10,
      "size": 86,
      "seed": 6
    }
  },
};

export default education;
