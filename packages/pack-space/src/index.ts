/**
 * Mote Space & Cosmos pack — 15 shapes.
 *
 * Planets, rockets, satellites, comets and constellations. Sun-orange and starlight on deep navy.
 *
 * Ported verbatim from the design source: render bodies are the designer's,
 * with only the key renames core's ShapeDef requires (s→scale, r→render).
 */
import {
  SPARK_PATH,
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
const SPARK = SPARK_PATH;

const polar = (cx: number, cy: number, r: number, a: number): [string, string] =>
  [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)];

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const SPACE_SHAPES: ShapeDef[] = [
  {
    id: 'saturn',
    label: "Ringed planet",
    kind: 'obj',
    ar: 1.2,
    scale: 1.25,
    render: (c: ShapeColors) => S('0 0 120 100', `<g transform="rotate(-18 60 50)"><path d="M4 50a56 15 0 0 1 112 0" ${st(c.f, 6)}/></g><circle cx="60" cy="50" r="28" fill="${c.f}"/><path d="M34 42h52M33 56h54" stroke="${c.d}" stroke-width="4" opacity=".15"/><g transform="rotate(-18 60 50)"><path d="M4 50a56 15 0 0 0 112 0" fill="none" stroke="${c.d}" stroke-width="12"/><path d="M4 50a56 15 0 0 0 112 0" ${st(c.f, 6)}/></g>`),
  },
  {
    id: 'rocket',
    label: "Rocket",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(35 50 50)"><path d="M38 74h24l-4 10-8 12-8-12z" fill="${alt(c)}"/><path d="M28 54L12 76v12l16-8zM72 54l16 22v12l-16-8z" fill="${c.f}"/><path d="M50 4c16 12 22 32 22 52v18H28V56c0-20 6-40 22-52z" fill="${c.f}"/><circle cx="50" cy="38" r="9" fill="${c.d}"/><circle cx="50" cy="38" r="9" fill="none" stroke="${c.f}" stroke-width="0"/></g>`),
  },
  {
    id: 'twinkle',
    label: "Twinkle",
    kind: 'obj',
    ar: 1,
    scale: 0.8,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 0C52 40 60 48 100 50C60 52 52 60 50 100C48 60 40 52 0 50C40 48 48 40 50 0z" fill="${c.f}"/><circle cx="84" cy="16" r="4" fill="${c.f}"/><circle cx="16" cy="84" r="3" fill="${c.f}"/>`),
  },
  {
    id: 'crescent',
    label: "Crescent",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) =>
      S(
        '0 0 100 100',
        `<path fill-rule="evenodd" fill="${c.f}" d="` +
          `M6 50a44 44 0 1 0 88 0a44 44 0 1 0-88 0z` +
          `M32 36a36 36 0 1 0 72 0a36 36 0 1 0-72 0z"/>`,
      ),
  },
  {
    id: 'helmet',
    label: "Astronaut",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="26" y="76" width="48" height="18" rx="6" fill="${c.f}"/><rect x="26" y="82" width="48" height="4" fill="${c.d}" opacity=".2"/><circle cx="50" cy="44" r="40" fill="${c.f}"/><path d="M22 44c0-14 12-22 28-22s28 8 28 22-12 22-28 22-28-8-28-22z" fill="${c.d}"/><path d="M33 36c4-6 10-8 17-8" ${st(c.f, 4)} opacity=".7"/><circle cx="66" cy="50" r="3" fill="${c.f}" opacity=".5"/>`),
  },
  {
    id: 'satellite',
    label: "Satellite",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<g transform="rotate(-30 50 50)"><rect x="4" y="40" width="30" height="20" fill="${c.f}"/><rect x="66" y="40" width="30" height="20" fill="${c.f}"/><path d="M14 40v20M24 40v20M4 50h30M76 40v20M86 40v20M66 50h30" stroke="${c.d}" stroke-width="2" opacity=".4"/><path d="M34 50h4M62 50h4" stroke="${c.f}" stroke-width="3"/><rect x="38" y="36" width="24" height="28" rx="3" fill="${c.f}"/><path d="M42 36a8 8 0 0 1 16 0z" fill="${c.f}"/><path d="M50 30V18" stroke="${c.f}" stroke-width="3"/><circle cx="50" cy="16" r="3.5" fill="${c.f}"/><rect x="44" y="44" width="12" height="12" rx="2" fill="${c.d}" opacity=".3"/></g>`),
  },
  {
    id: 'ufo',
    label: "UFO",
    kind: 'obj',
    ar: 1.2,
    scale: 1.2,
    render: (c: ShapeColors) => S('0 0 120 100', `<polygon points="42,62 78,62 100,98 20,98" fill="${c.f}" opacity=".22"/><path d="M36 44a24 24 0 0 1 48 0z" fill="${alt(c)}"/><ellipse cx="60" cy="50" rx="54" ry="14" fill="${c.f}"/>` + [24, 42, 60, 78, 96].map(x => `<circle cx="${x}" cy="52" r="4" fill="${c.d}"/>`).join('') + `<ellipse cx="60" cy="61" rx="22" ry="6" fill="${c.f}"/>`),
  },
  {
    id: 'comet',
    label: "Comet",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="60.7,16.7 83.3,39.3 6,94" fill="${c.f}" opacity=".3"/><polygon points="65,22 78,35 24,80" fill="${c.f}" opacity=".55"/><circle cx="72" cy="28" r="16" fill="${c.f}"/>`),
  },
  {
    id: 'constellation',
    label: "Constellation",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => { const P = [[12, 70], [30, 48], [52, 56], [70, 30], [90, 16], [80, 64]]; return S('0 0 100 100', `<path d="M12 70L30 48L52 56L70 30L90 16M52 56L80 64" fill="none" stroke="${c.f}" stroke-width="2.5" opacity=".55"/>` + P.map(([x, y], i) => { const s = i === 3 ? 0.24 : 0.14; return `<path d="${SPARK}" fill="${c.f}" transform="translate(${x - 50 * s} ${y - 50 * s}) scale(${s})"/>`; }).join('')); },
  },
  {
    id: 'orbit',
    label: "Orbit",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', `<ellipse cx="50" cy="50" rx="46" ry="20" fill="none" stroke="${c.f}" stroke-width="3" stroke-dasharray="6 6" transform="rotate(-20 50 50)"/><circle cx="50" cy="50" r="16" fill="${c.f}"/><circle cx="93" cy="34" r="7" fill="${alt(c)}"/>`),
  },
  {
    id: 'asteroid',
    label: "Asteroid",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="30,10 58,6 82,20 94,46 86,74 62,92 34,90 12,72 6,44 14,22" fill="${c.f}"/><g fill="${c.d}" opacity=".22"><circle cx="40" cy="36" r="9"/><circle cx="66" cy="58" r="12"/><circle cx="34" cy="70" r="5"/></g>`),
  },
  {
    id: 'sun',
    label: "Sun",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<circle cx="50" cy="50" r="24" fill="${c.f}"/>` + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, [x1, y1] = polar(50, 50, 33, a), [x2, y2] = polar(50, 50, 46, a); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${st(c.f, 6)}/>`; }).join('')),
  },
  {
    id: 'blackhole',
    label: "Black hole",
    kind: 'obj',
    ar: 1.5,
    scale: 1.25,
    render: (c: ShapeColors) => S('0 0 120 80', `<ellipse cx="60" cy="40" rx="56" ry="16" fill="none" stroke="${c.f}" stroke-width="8"/><ellipse cx="60" cy="40" rx="40" ry="10" fill="none" stroke="${c.f}" stroke-width="3" opacity=".55"/><circle cx="60" cy="40" r="20" fill="${c.d}"/><circle cx="60" cy="40" r="20" fill="none" stroke="${c.f}" stroke-width="3"/><path d="M4 40a56 16 0 0 0 112 0" ${st(c.f, 8)}/>`),
  },
  {
    id: 'telescope',
    label: "Telescope",
    kind: 'obj',
    ar: 1,
    scale: 1.05,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M48 50L28 94M48 50l20 44M48 50v44" ${st(c.f, 5)}/><g transform="rotate(-24 48 40)"><rect x="2" y="34" width="10" height="12" rx="2" fill="${c.f}"/><rect x="10" y="30" width="56" height="20" rx="3" fill="${c.f}"/><rect x="64" y="25" width="18" height="30" rx="3" fill="${c.f}"/><rect x="64" y="25" width="5" height="30" fill="${c.d}" opacity=".25"/></g><circle cx="48" cy="48" r="5" fill="${c.d}"/>`),
  },
  {
    id: 'galaxy',
    label: "Galaxy",
    kind: 'obj',
    ar: 1.0666666666666667,
    scale: 1.1,
    render: (c: ShapeColors) => S('22 18 64 60', `<path d="M50 50a4 4 0 0 1 8 0a8 8 0 0 1-16 0a12 12 0 0 1 24 0a16 16 0 0 1-32 0a20 20 0 0 1 40 0a24 24 0 0 1-48 0a28 28 0 0 1 56 0" ${st(c.f, 4.5)}/><circle cx="54" cy="50" r="3.5" fill="${alt(c)}"/>`),
  }
];

export const space: ShapePack = {
  id: 'space',
  name: "Space & Cosmos",
  version: '0.1.0',
  description: "Planets, rockets, satellites, comets and constellations. Sun-orange and starlight on deep navy.",
  shapes: SPACE_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#ffb347",
        "d": "#070a1a",
        "w": 3
      },
      {
        "f": "#ebe9ff",
        "d": "#070a1a",
        "w": 3
      },
      {
        "f": "#7d88ff",
        "d": "#070a1a",
        "w": 2
      },
      {
        "f": "#232a52",
        "d": "#ebe9ff",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#070a1a",
        "d": "#ffb347",
        "w": 3
      },
      {
        "f": "#f08a1c",
        "d": "#070a1a",
        "w": 3
      },
      {
        "f": "#4b57de",
        "d": "#ffffff",
        "w": 2
      },
      {
        "f": "#c8c5e6",
        "d": "#070a1a",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#070a1a",
        "d": "#ffb347",
        "w": 3
      },
      {
        "f": "#ebe9ff",
        "d": "#070a1a",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#ebe9ff",
        "d": "#070a1a",
        "w": 2
      },
      {
        "f": "#232a52",
        "d": "#ebe9ff",
        "w": 2
      }
    ]
  },
  swatches: ["#070a1a","#ffb347","#7d88ff","#ebe9ff"],
  baseShapes: ["circle","ring","spark","dots","half","plus"],
  background: {"dark":"#070a1a","light":"#eceaf7","accent":"#ffb347"},
  ink: {"dark":"#ebe9ff","light":"#070a1a","accent":"#070a1a"},
  font: { stack: "'Syne',sans-serif", name: "Syne", weight: 800 },
  demo: {
    "a": {
      "mode": "drift",
      "count": 30,
      "size": 62,
      "seed": 31,
      "depth": true
    },
    "b": {
      "mode": "across",
      "count": 12,
      "size": 84,
      "seed": 17,
      "depth": true
    }
  },
};

export default space;
