/**
 * Mote AI & ML pack — 15 shapes.
 *
 * Neural nets, chips, sparkles, prompts and embeddings. Soft violet and pink on deep indigo.
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
const FONT = "'Space Grotesk',sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

const neural = (c: ShapeColors): string => {
  const L: Array<[number, number[]]> = [
    [14, [22, 50, 78]], [50, [14, 38, 62, 86]], [86, [36, 64]],
  ];
  let s = '';
  for (let i = 0; i < 2; i++) {
    for (const a of L[i][1]) {
      for (const b of L[i + 1][1]) {
        s += `<line x1="${L[i][0]}" y1="${a}" x2="${L[i + 1][0]}" y2="${b}" ` +
          `stroke="${c.f}" stroke-width="2.5" opacity=".45"/>`;
      }
    }
  }
  L.forEach(([x, ys], i) =>
    ys.forEach((y, k) => {
      s += `<circle cx="${x}" cy="${y}" r="${i === 1 ? 7 : 8}" fill="${i === 1 && k === 1 ? alt(c) : c.f}"/>`;
    }),
  );
  return s;
};

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const AI_SHAPES: ShapeDef[] = [
  {
    id: 'neural',
    label: "Neural net",
    kind: 'obj',
    ar: 1,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 100 100', neural(c)),
  },
  {
    id: 'chip',
    label: "Chip",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', [30, 43, 57, 70].map(p => `<rect x="${p - 3}" y="4" width="6" height="14" rx="2" fill="${c.f}"/><rect x="${p - 3}" y="82" width="6" height="14" rx="2" fill="${c.f}"/><rect x="4" y="${p - 3}" width="14" height="6" rx="2" fill="${c.f}"/><rect x="82" y="${p - 3}" width="14" height="6" rx="2" fill="${c.f}"/>`).join('') + `<rect x="16" y="16" width="68" height="68" rx="8" fill="${c.f}"/><rect x="28" y="28" width="44" height="44" rx="4" fill="${c.d}" opacity=".18"/><text x="50" y="59" text-anchor="middle" font-family="'Space Grotesk',${FONT}" font-weight="700" font-size="24" fill="${c.d}">AI</text>`),
  },
  {
    id: 'sparkles',
    label: "Sparkles",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="${SPARK}" fill="${c.f}" transform="translate(0 22) scale(.72)"/><path d="${SPARK}" fill="${c.f}" transform="translate(64 2) scale(.32)"/><path d="${SPARK}" fill="${alt(c)}" transform="translate(74 62) scale(.22)"/>`),
  },
  {
    id: 'chat',
    label: "Chat bubble",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M14 12h72a10 10 0 0 1 10 10v40a10 10 0 0 1-10 10H40L22 90V72h-8A10 10 0 0 1 4 62V22a10 10 0 0 1 10-10z" fill="${c.f}"/><circle cx="32" cy="42" r="6" fill="${c.d}"/><circle cx="50" cy="42" r="6" fill="${c.d}" opacity=".7"/><circle cx="68" cy="42" r="6" fill="${c.d}" opacity=".4"/>`),
  },
  {
    id: 'robot',
    label: "Robot",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M50 6v12" ${st(c.f, 5)}/><circle cx="50" cy="6" r="5" fill="${c.f}"/><rect x="14" y="18" width="72" height="62" rx="16" fill="${c.f}"/><rect x="4" y="38" width="10" height="22" rx="4" fill="${c.f}"/><rect x="86" y="38" width="10" height="22" rx="4" fill="${c.f}"/><rect x="26" y="34" width="48" height="26" rx="13" fill="${c.d}"/><circle cx="40" cy="47" r="5" fill="${c.f}"/><circle cx="60" cy="47" r="5" fill="${c.f}"/><rect x="38" y="68" width="24" height="4" rx="2" fill="${c.d}" opacity=".5"/><rect x="34" y="84" width="32" height="10" rx="4" fill="${c.f}"/>`),
  },
  {
    id: 'vision',
    label: "Vision",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M4 50C22 22 78 22 96 50C78 78 22 78 4 50z" fill="${c.f}"/><circle cx="50" cy="50" r="19" fill="${c.d}"/><circle cx="50" cy="50" r="8" fill="${c.f}"/><circle cx="57" cy="43" r="3.5" fill="${c.f}"/><path d="M8 14V6h8M92 14V6h-8M8 86v8h8M92 86v8h-8" ${st(c.f, 4)}/>`),
  },
  {
    id: 'wave',
    label: "Voice wave",
    kind: 'obj',
    ar: 1,
    scale: 0.9,
    render: (c: ShapeColors) => S('0 0 100 100', [14, 30, 52, 74, 46, 88, 60, 34, 70, 40, 22].map((h, i) => `<rect x="${(4 + i * 8.6).toFixed(1)}" y="${50 - h / 2}" width="5" height="${h}" rx="2.5" fill="${c.f}"/>`).join('')),
  },
  {
    id: 'tokens',
    label: "Tokens",
    kind: 'obj',
    ar: 3,
    scale: 1.4,
    render: (c: ShapeColors) => S('0 0 150 50', ([[3, 46, 'tok', 1], [55, 36, 'en', 0.6], [97, 50, 'ize', 1]] as Array<[number, number, string, number]>).map(([x, w, t, o]) => `<rect x="${x}" y="3" width="${w}" height="44" rx="8" fill="${c.f}" opacity="${o}"/><text x="${x + w / 2}" y="31" text-anchor="middle" font-family="${MONO}" font-size="17" fill="${c.d}">${t}</text>`).join('')),
  },
  {
    id: 'prompt',
    label: "Prompt bar",
    kind: 'obj',
    ar: 3.4,
    scale: 1.6,
    render: (c: ShapeColors) => S('0 0 170 50', `<rect x="2" y="2" width="166" height="46" rx="23" fill="${c.f}"/><text x="22" y="31" font-family="'Space Grotesk',${FONT}" font-weight="500" font-size="16" fill="${c.d}" opacity=".6">Ask anything</text><circle cx="145" cy="25" r="16" fill="${alt(c)}"/><circle cx="145" cy="25" r="16" fill="none" stroke="${c.d}" stroke-width="2" opacity=".25"/><path d="M145 33V18M139 24l6-6 6 6" ${st(c.d, 3.5)}/>`),
  },
  {
    id: 'embed',
    label: "Embeddings",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<circle cx="68" cy="66" r="21" fill="none" stroke="${c.f}" stroke-width="2.5" stroke-dasharray="4 5"/>` + [[22, 28], [34, 20], [30, 40], [42, 32], [18, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${c.f}"/>`).join('') + [[60, 60], [72, 55], [78, 70], [66, 76], [58, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${alt(c)}"/>`).join('') + `<circle cx="80" cy="22" r="4" fill="${c.f}" opacity=".5"/><circle cx="22" cy="80" r="4" fill="${c.f}" opacity=".5"/>`),
  },
  {
    id: 'loss',
    label: "Loss curve",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M10 8v82h84" ${st(c.f, 6)}/><path d="M18 16c8 34 18 48 32 54s26 5 40 5" ${st(c.f, 6)}/><circle cx="90" cy="75" r="6" fill="${alt(c)}"/>`),
  },
  {
    id: 'attention',
    label: "Attention map",
    kind: 'obj',
    ar: 1,
    scale: 0.9,
    render: (c: ShapeColors) => { let s = ''; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const o = i === j ? 1 : [0.15, 0.32, 0.55][(i * 3 + j * 7) % 3]; s += `<rect x="${4 + j * 19}" y="${4 + i * 19}" width="16" height="16" rx="3" fill="${c.f}" opacity="${o}"/>`; } return S('0 0 100 100', s); },
  },
  {
    id: 'wand',
    label: "Magic wand",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M16 86L58 44" ${st(c.f, 10)}/><path d="M16 86l10-10" ${st(alt(c), 10)}/><path d="${SPARK}" fill="${c.f}" transform="translate(52 6) scale(.42)"/><path d="${SPARK}" fill="${alt(c)}" transform="translate(84 44) scale(.15)"/><path d="${SPARK}" fill="${c.f}" transform="translate(32 8) scale(.14)"/>`),
  },
  {
    id: 'graph',
    label: "Knowledge graph",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => { const N = [[20, 24], [56, 14], [86, 40], [48, 50], [18, 74], [62, 86], [88, 78]], E = [[0, 1], [1, 2], [1, 3], [0, 3], [3, 4], [3, 5], [2, 6], [5, 6], [3, 2]]; return S('0 0 100 100', E.map(([a, b]) => `<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="${c.f}" stroke-width="3" opacity=".5"/>`).join('') + N.map(([x, y], i) => i === 3 ? `<circle cx="${x}" cy="${y}" r="12" fill="${alt(c)}"/><circle cx="${x}" cy="${y}" r="5" fill="${c.d}"/>` : `<circle cx="${x}" cy="${y}" r="${6 + (i % 3) * 1.5}" fill="${c.f}"/>`).join('')); },
  },
  {
    id: 'gpu',
    label: "GPU",
    kind: 'obj',
    ar: 1.875,
    scale: 1.4,
    render: (c: ShapeColors) => S('0 0 150 80', `<rect x="2" y="8" width="146" height="58" rx="8" fill="${c.f}"/><rect x="20" y="66" width="62" height="10" fill="${c.f}"/><rect x="20" y="70" width="62" height="2" fill="${c.d}" opacity=".3"/>` + [46, 104].map(x => `<circle cx="${x}" cy="37" r="21" fill="${c.d}" opacity=".2"/><circle cx="${x}" cy="37" r="21" fill="none" stroke="${c.d}" stroke-width="3" opacity=".5"/><path d="M${x} 37l0-16M${x} 37l14 8M${x} 37l-14 8" stroke="${c.d}" stroke-width="3" opacity=".5"/><circle cx="${x}" cy="37" r="5" fill="${c.d}"/>`).join('')),
  }
];

export const ai: ShapePack = {
  id: 'ai',
  name: "AI & ML",
  version: '0.1.0',
  description: "Neural nets, chips, sparkles, prompts and embeddings. Soft violet and pink on deep indigo.",
  shapes: AI_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#b69cff",
        "d": "#110d20",
        "w": 3
      },
      {
        "f": "#f3efff",
        "d": "#110d20",
        "w": 3
      },
      {
        "f": "#ff9ed2",
        "d": "#110d20",
        "w": 2
      },
      {
        "f": "#2d2550",
        "d": "#f3efff",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#6b45ff",
        "d": "#ffffff",
        "w": 3
      },
      {
        "f": "#110d20",
        "d": "#b69cff",
        "w": 3
      },
      {
        "f": "#f0569f",
        "d": "#ffffff",
        "w": 2
      },
      {
        "f": "#dcd3ff",
        "d": "#110d20",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#110d20",
        "d": "#b69cff",
        "w": 3
      },
      {
        "f": "#ffffff",
        "d": "#110d20",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#f3efff",
        "d": "#110d20",
        "w": 2
      },
      {
        "f": "#2d2550",
        "d": "#f3efff",
        "w": 2
      }
    ]
  },
  swatches: ["#110d20","#b69cff","#ff9ed2","#f3efff"],
  baseShapes: ["circle","ring","spark","dots","half","pill","plus"],
  background: {"dark":"#110d20","light":"#f3f0ff","accent":"#b69cff"},
  ink: {"dark":"#f3efff","light":"#110d20","accent":"#110d20"},
  font: { stack: "'Space Grotesk',sans-serif", name: "Space Grotesk", weight: 700 },
  demo: {
    "a": {
      "mode": "drift",
      "count": 24,
      "size": 68,
      "seed": 12,
      "depth": true
    },
    "b": {
      "mode": "bob",
      "count": 10,
      "size": 86,
      "seed": 5
    }
  },
};

export default ai;
