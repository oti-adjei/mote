/**
 * Mote FinTech pack — 15 shapes.
 *
 * Cards, coins, candlesticks, QR codes and currency glyphs. Mint and gold on forest green.
 *
 * Ported verbatim from the design source: render bodies are the designer's,
 * with only the key renames core's ShapeDef requires (s→scale, r→render).
 */
import {
  stroke,
  rng,
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
const FONT = "'Manrope',sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

/**
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
})();

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const FINTECH_SHAPES: ShapeDef[] = [
  {
    id: 'card',
    label: "Card",
    kind: 'obj',
    ar: 1.6,
    scale: 1.35,
    render: (c: ShapeColors) => S('0 0 160 100', `<rect x="2" y="2" width="156" height="96" rx="10" fill="${c.f}"/><rect x="16" y="28" width="26" height="20" rx="4" fill="${c.d}" opacity=".35"/><path d="M128 28a10 10 0 0 1 0 16M134 23a17 17 0 0 1 0 26" ${st(c.d, 3)} opacity=".5"/><text x="16" y="76" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${c.d}" opacity=".75">•••• 4821</text><circle cx="128" cy="78" r="9" fill="${c.d}" opacity=".35"/><circle cx="140" cy="78" r="9" fill="${c.d}" opacity=".2"/>`),
  },
  {
    id: 'coins',
    label: "Coin stack",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', [0, 1, 2, 3].map(k => { const t = 70 - k * 15; return `<rect x="20" y="${t}" width="60" height="12" fill="${c.f}"/><ellipse cx="50" cy="${t + 12}" rx="30" ry="8" fill="${c.f}"/><ellipse cx="50" cy="${t + 12}" rx="30" ry="8" fill="${c.d}" opacity=".12"/><ellipse cx="50" cy="${t}" rx="30" ry="8" fill="${c.f}"/>`; }).join('') + `<ellipse cx="50" cy="25" rx="19" ry="4.5" fill="none" stroke="${c.d}" stroke-width="2.5" opacity=".35"/>`),
  },
  {
    id: 'candles',
    label: "Candlesticks",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', [[14, 44, 30, 1], [32, 30, 26, 0], [50, 40, 22, 1], [68, 22, 30, 1], [86, 12, 24, 0]].map(([x, y, h, f]) => `<line x1="${x}" y1="${y - 9}" x2="${x}" y2="${y + h + 9}" stroke="${c.f}" stroke-width="3"/>` + (f ? `<rect x="${x - 6}" y="${y}" width="12" height="${h}" rx="1.5" fill="${c.f}"/>` : `<rect x="${x - 5}" y="${y}" width="10" height="${h}" rx="1.5" fill="none" stroke="${c.f}" stroke-width="3"/>`)).join('')),
  },
  {
    id: 'trend',
    label: "Trend up",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M6 82l28-30 18 14 36-40" ${st(c.f, 9)}/><path d="M68 22h24v24" ${st(c.f, 9)}/>`),
  },
  {
    id: 'pie',
    label: "Pie chart",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M52 52L52 10A42 42 0 1 1 10 52z" fill="${c.f}"/><path d="M46 46L4 46A42 42 0 0 1 46 4z" fill="${alt(c)}"/>`),
  },
  {
    id: 'wallet',
    label: "Wallet",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M14 24l48-16 8 16z" fill="${c.f}" opacity=".6"/><rect x="6" y="22" width="88" height="66" rx="10" fill="${c.f}"/><rect x="60" y="42" width="36" height="26" rx="8" fill="${c.d}" opacity=".22"/><circle cx="74" cy="55" r="5" fill="${c.d}"/>`),
  },
  {
    id: 'bank',
    label: "Bank",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="50,6 94,30 6,30" fill="${c.f}"/><circle cx="50" cy="21" r="4" fill="${c.d}"/>` + [18, 36, 54, 72].map(x => `<rect x="${x}" y="36" width="10" height="40" fill="${c.f}"/>`).join('') + `<rect x="8" y="80" width="84" height="12" rx="2" fill="${c.f}"/>`),
  },
  {
    id: 'percent',
    label: "Percent",
    kind: 'obj',
    ar: 1,
    scale: 0.85,
    render: (c: ShapeColors) => S('0 0 100 100', `<circle cx="28" cy="28" r="14" ${st(c.f, 9)}/><circle cx="72" cy="72" r="14" ${st(c.f, 9)}/><path d="M80 14L20 86" ${st(c.f, 9)}/>`),
  },
  {
    id: 'currency',
    label: "Currency",
    kind: 'obj',
    ar: 1,
    scale: 0.85,
    variants: ["$","€","£","₦","₵","¥"],
    render: (c: ShapeColors, v?: string) => S('0 0 100 100', `<rect x="4" y="4" width="92" height="92" rx="22" fill="${c.f}"/><text x="50" y="69" text-anchor="middle" font-family="'Manrope',${FONT}" font-weight="800" font-size="56" fill="${c.d}">${v || '$'}</text>`),
  },
  {
    id: 'receipt',
    label: "Receipt",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M16 4h68v88l-8.5-6-8.5 6-8.5-6-8.5 6-8.5-6-8.5 6-8.5-6-8.5 6z" fill="${c.f}"/><g fill="${c.d}" opacity=".35"><rect x="26" y="16" width="36" height="5" rx="2"/><rect x="26" y="28" width="48" height="5" rx="2"/><rect x="26" y="40" width="40" height="5" rx="2"/><rect x="26" y="56" width="48" height="2"/></g><rect x="50" y="64" width="24" height="8" rx="2" fill="${c.d}" opacity=".7"/>`),
  },
  {
    id: 'qr',
    label: "QR code",
    kind: 'obj',
    ar: 1,
    scale: 0.9,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="0" y="0" width="100" height="100" rx="10" fill="${c.f}"/>` + qr.map(([x, y]) => `<rect x="${8 + x * 4}" y="${8 + y * 4}" width="4.2" height="4.2" fill="${c.d}"/>`).join('')),
  },
  {
    id: 'contactless',
    label: "Contactless",
    kind: 'obj',
    ar: 1,
    scale: 0.85,
    render: (c: ShapeColors) => S('0 0 100 100', [16, 32, 48, 64].map(r => { const x = (20 + 0.707 * r).toFixed(1), dy = (0.707 * r).toFixed(1); return `<path d="M${x} ${(50 - +dy).toFixed(1)}A${r} ${r} 0 0 1 ${x} ${(50 + +dy).toFixed(1)}" ${st(c.f, 8)}/>`; }).join('')),
  },
  {
    id: 'ticker',
    label: "Ticker",
    kind: 'obj',
    ar: 2.6,
    scale: 1.3,
    variants: ["+2.4%","+0.8%","+12.6%"],
    render: (c: ShapeColors, v?: string) => S('0 0 130 50', `<rect x="2" y="2" width="126" height="46" rx="8" fill="${c.f}"/><polygon points="18,32 28,18 38,32" fill="${c.d}"/><text x="46" y="33" font-family="'Manrope',${FONT}" font-weight="800" font-size="20" fill="${c.d}">${v || '+2.4%'}</text>`),
  },
  {
    id: 'bars',
    label: "Bar chart",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', [30, 48, 40, 74].map((h, i) => `<rect x="${12 + i * 20}" y="${88 - h}" width="14" height="${h}" rx="2" fill="${i === 3 ? alt(c) : c.f}"/>`).join('') + `<rect x="6" y="88" width="88" height="4" rx="2" fill="${c.f}"/>`),
  },
  {
    id: 'calc',
    label: "Calculator",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => { let s = `<rect x="18" y="4" width="64" height="92" rx="10" fill="${c.f}"/><rect x="28" y="14" width="44" height="18" rx="3" fill="${c.d}" opacity=".3"/>`; for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) s += `<rect x="${29 + k * 15}" y="${42 + r * 13}" width="11" height="9" rx="2" fill="${c.d}" opacity="${r === 3 && k === 2 ? '.8' : '.3'}"/>`; return S('0 0 100 100', s); },
  }
];

export const fintech: ShapePack = {
  id: 'fintech',
  name: "FinTech",
  version: '0.1.0',
  description: "Cards, coins, candlesticks, QR codes and currency glyphs. Mint and gold on forest green.",
  shapes: FINTECH_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#43e8a6",
        "d": "#09201a",
        "w": 3
      },
      {
        "f": "#f2f0e6",
        "d": "#09201a",
        "w": 3
      },
      {
        "f": "#f5c451",
        "d": "#09201a",
        "w": 2
      },
      {
        "f": "#1d3b32",
        "d": "#f2f0e6",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#0b8f5d",
        "d": "#ffffff",
        "w": 3
      },
      {
        "f": "#09201a",
        "d": "#43e8a6",
        "w": 3
      },
      {
        "f": "#e2a92b",
        "d": "#09201a",
        "w": 2
      },
      {
        "f": "#d8d3c2",
        "d": "#09201a",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#09201a",
        "d": "#43e8a6",
        "w": 3
      },
      {
        "f": "#f2f0e6",
        "d": "#09201a",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#f2f0e6",
        "d": "#09201a",
        "w": 2
      },
      {
        "f": "#1d3b32",
        "d": "#f2f0e6",
        "w": 2
      }
    ]
  },
  swatches: ["#09201a","#43e8a6","#f5c451","#f2f0e6"],
  baseShapes: ["circle","ring","half","quarter","square","pill","triangle"],
  background: {"dark":"#09201a","light":"#f3f1e9","accent":"#43e8a6"},
  ink: {"dark":"#f2f0e6","light":"#09201a","accent":"#09201a"},
  font: { stack: "'Manrope',sans-serif", name: "Manrope", weight: 800 },
  demo: {
    "a": {
      "mode": "across",
      "count": 16,
      "size": 80,
      "seed": 9,
      "depth": true
    },
    "b": {
      "mode": "bounce",
      "count": 11,
      "size": 80,
      "seed": 14
    }
  },
};

export default fintech;
