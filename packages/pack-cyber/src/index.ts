/**
 * Mote Cybersecurity pack — 15 shapes.
 *
 * Locks, shields, fingerprints, radar sweeps and access tags. Terminal neon and alert red on black.
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
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

const polar = (cx: number, cy: number, r: number, a: number): [string, string] =>
  [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)];

const fp = (c: ShapeColors): string => {
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
        return `<path d="M${x1} ${y1}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${x2} ${y2}" ${st(c.f, 5)}/>`;
      })
      .join('') + `<path d="M50 50v14" ${st(c.f, 5)}/>`
  );
};

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const CYBER_SHAPES: ShapeDef[] = [
  {
    id: 'lock',
    label: "Padlock",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M30 44V30a20 20 0 0 1 40 0v14" ${st(c.f, 9)}/><rect x="16" y="42" width="68" height="52" rx="10" fill="${c.f}"/><circle cx="50" cy="62" r="7" fill="${c.d}"/><rect x="47" y="64" width="6" height="16" rx="3" fill="${c.d}"/>`),
  },
  {
    id: 'unlock',
    label: "Unlocked",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M30 44V30a20 20 0 0 1 38-9" ${st(c.f, 9)}/><rect x="16" y="42" width="68" height="52" rx="10" fill="${c.f}"/><circle cx="50" cy="62" r="7" fill="${c.d}"/><rect x="47" y="64" width="6" height="16" rx="3" fill="${c.d}"/>`),
  },
  {
    id: 'shield',
    label: "Shield",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 4L88 18v28c0 24-16 40-38 50C28 86 12 70 12 46V18z" fill="${c.f}"/><path d="M32 50l12 12 24-26" ${st(c.d, 8)}/>`),
  },
  {
    id: 'key',
    label: "Key",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-40 50 50)"><circle cx="24" cy="50" r="18" ${st(c.f, 9)}/><path d="M42 50h50M80 50v14M68 50v10" ${st(c.f, 9)}/></g>`),
  },
  {
    id: 'fingerprint',
    label: "Fingerprint",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', fp(c)),
  },
  {
    id: 'scan',
    label: "Retina scan",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M8 28V8h20M72 8h20v20M92 72v20H72M28 92H8V72" ${st(c.f, 6)}/><path d="M20 50C30 34 70 34 80 50C70 66 30 66 20 50z" fill="${c.f}"/><circle cx="50" cy="50" r="10" fill="${c.d}"/><rect x="14" y="49" width="72" height="2.5" fill="${alt(c)}"/>`),
  },
  {
    id: 'warning',
    label: "Warning",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 10L92 86H8z" fill="${c.f}" stroke="${c.f}" stroke-width="8" stroke-linejoin="round"/><rect x="45" y="36" width="10" height="28" rx="4" fill="${c.d}"/><circle cx="50" cy="75" r="5.5" fill="${c.d}"/>`),
  },
  {
    id: 'binary',
    label: "Binary",
    kind: 'obj',
    ar: 2.4,
    scale: 1.2,
    variants: ["0110","1001","1101"],
    render: (c: ShapeColors, v?: string) => S('0 0 120 50', `<text x="60" y="38" text-anchor="middle" font-family="${MONO}" font-weight="500" font-size="38" letter-spacing="2" fill="${c.f}">${v || '0110'}</text>`),
  },
  {
    id: 'password',
    label: "Password",
    kind: 'obj',
    ar: 3,
    scale: 1.5,
    render: (c: ShapeColors) => S('0 0 150 50', `<rect x="2" y="2" width="146" height="46" rx="10" fill="${c.f}"/>` + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${22 + i * 16}" cy="25" r="5.5" fill="${c.d}"/>`).join('') + `<rect x="122" y="14" width="3" height="22" fill="${c.d}"/>`),
  },
  {
    id: 'firewall',
    label: "Firewall",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 2c8 10 14 14 14 22a14 14 0 0 1-28 0c0-5 3-8 6-11 0 5 2 7 5 7-2-8 0-12 3-18z" fill="${alt(c)}"/>` + [[6, 40, 28], [36, 40, 28], [66, 40, 28], [6, 58, 13], [21, 58, 28], [51, 58, 28], [81, 58, 13], [6, 76, 28], [36, 76, 28], [66, 76, 28]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="16" rx="2" fill="${c.f}"/>`).join('')),
  },
  {
    id: 'radar',
    label: "Radar",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g fill="none" stroke="${c.f}" stroke-width="3" opacity=".5"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="16"/></g><path d="M50 6v88M6 50h88" stroke="${c.f}" stroke-width="2" opacity=".3"/><path d="M50 50L50 6A44 44 0 0 1 88 28z" fill="${c.f}" opacity=".4"/><path d="M50 50L88 28" ${st(c.f, 3)}/><circle cx="70" cy="30" r="4" fill="${c.f}"/><circle cx="30" cy="64" r="3.5" fill="${alt(c)}"/><circle cx="62" cy="70" r="3" fill="${c.f}"/>`),
  },
  {
    id: 'otp',
    label: "2FA code",
    kind: 'obj',
    ar: 2.34375,
    scale: 1.45,
    render: (c: ShapeColors) => S('0 0 150 64', `<rect x="2" y="2" width="146" height="60" rx="10" fill="${c.f}"/><text x="16" y="22" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${c.d}" opacity=".6">2FA CODE</text><text x="16" y="50" font-family="${MONO}" font-weight="500" font-size="24" letter-spacing="3" fill="${c.d}">482 913</text>`),
  },
  {
    id: 'virus',
    label: "Virus",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, [x1, y1] = polar(50, 50, 22, a), [x2, y2] = polar(50, 50, 38, a), [x3, y3] = polar(50, 50, 41, a); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c.f}" stroke-width="5"/><circle cx="${x3}" cy="${y3}" r="6" fill="${c.f}"/>`; }).join('') + `<circle cx="50" cy="50" r="25" fill="${c.f}"/><g fill="${c.d}" opacity=".25"><circle cx="42" cy="44" r="5"/><circle cx="58" cy="56" r="6"/><circle cx="56" cy="40" r="3"/></g>`),
  },
  {
    id: 'access',
    label: "Access tag",
    kind: 'obj',
    ar: 4.318181818181818,
    scale: 1.7,
    variants: ["ACCESS GRANTED","ENCRYPTED","VERIFIED"],
    render: (c: ShapeColors, v?: string) => S('0 0 190 44', `<rect x="2" y="2" width="186" height="40" rx="6" fill="${c.f}"/><circle cx="20" cy="22" r="6" fill="${c.d}"/><text x="34" y="27" font-family="${MONO}" font-weight="500" font-size="14" letter-spacing="2" fill="${c.d}">${v || 'ACCESS GRANTED'}</text>`),
  },
  {
    id: 'captcha',
    label: "Checkbox",
    kind: 'obj',
    ar: 1,
    scale: 0.85,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="10" y="10" width="80" height="80" rx="14" fill="${c.f}"/><path d="M30 52l14 14 28-32" ${st(c.d, 9)}/>`),
  }
];

export const cyber: ShapePack = {
  id: 'cyber',
  name: "Cybersecurity",
  version: '0.1.0',
  description: "Locks, shields, fingerprints, radar sweeps and access tags. Terminal neon and alert red on black.",
  shapes: CYBER_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#00ff9c",
        "d": "#05090a",
        "w": 3
      },
      {
        "f": "#d9ffe9",
        "d": "#05090a",
        "w": 2
      },
      {
        "f": "#ff3b5c",
        "d": "#05090a",
        "w": 2
      },
      {
        "f": "#14302a",
        "d": "#00ff9c",
        "w": 3
      }
    ],
    "light": [
      {
        "f": "#05090a",
        "d": "#00ff9c",
        "w": 3
      },
      {
        "f": "#00a865",
        "d": "#ffffff",
        "w": 3
      },
      {
        "f": "#e2264b",
        "d": "#ffffff",
        "w": 2
      },
      {
        "f": "#c6d4cc",
        "d": "#05090a",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#05090a",
        "d": "#00ff9c",
        "w": 3
      },
      {
        "f": "#ffffff",
        "d": "#05090a",
        "w": 1
      }
    ],
    "mono": [
      {
        "f": "#d9ffe9",
        "d": "#05090a",
        "w": 2
      },
      {
        "f": "#14302a",
        "d": "#00ff9c",
        "w": 2
      }
    ]
  },
  swatches: ["#05090a","#00ff9c","#ff3b5c","#d9ffe9"],
  baseShapes: ["square","frame","triangle","plus","zigzag","dots"],
  background: {"dark":"#05090a","light":"#edf2ef","accent":"#00ff9c"},
  ink: {"dark":"#d9ffe9","light":"#05090a","accent":"#05090a"},
  font: { stack: "'Chakra Petch',sans-serif", name: "Chakra Petch", weight: 700 },
  demo: {
    "a": {
      "mode": "drift",
      "count": 24,
      "size": 64,
      "seed": 7,
      "depth": true
    },
    "b": {
      "mode": "bounce",
      "count": 12,
      "size": 78,
      "seed": 19
    }
  },
};

export default cyber;
