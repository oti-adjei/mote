/**
 * Mote DevTools pack — 15 shapes.
 *
 * Terminals, braces, branches, packages and diffs. Editor greens and blues on a dark IDE ground.
 *
 * Ported verbatim from the design source: render bodies are the designer's,
 * with only the key renames core's ShapeDef requires (s→scale, r→render).
 */
import {
  stroke,
  type ShapeColors,
  type ShapeDef,
  type ShapePack,
} from '@usemote/core';

const S = (viewBox: string, body: string): string =>
  `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ` +
  `style="display:block;width:100%;height:100%;overflow:visible">${body}</svg>`;
const st = stroke;
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

const gear = (cx: number, cy: number, ro: number, ri: number, n: number): string => {
  const w = (Math.PI / n) * 0.45;
  const pts: string[] = [];
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n;
    ([[a - 1.6 * w, ri], [a - w, ro], [a + w, ro], [a + 1.6 * w, ri]] as Array<[number, number]>)
      .forEach(([t, r]) => pts.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`));
  }
  return pts.join(' ');
};

/** APPEND-ONLY. Reordering or removing changes every existing seed. */
export const DEVTOOLS_SHAPES: ShapeDef[] = [
  {
    id: 'braces',
    label: "Braces",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M38 8c-11 0-15 6-15 15v13c0 7-4 11-13 14 9 3 13 7 13 14v13c0 9 4 15 15 15M62 8c11 0 15 6 15 15v13c0 7 4 11 13 14-9 3-13 7-13 14v13c0 9-4 15-15 15" ${st(c.f, 9)}/>`),
  },
  {
    id: 'tag',
    label: "Tag",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M32 24L8 50l24 26M68 24l24 26-24 26M57 14L43 86" ${st(c.f, 9)}/>`),
  },
  {
    id: 'terminal',
    label: "Terminal",
    kind: 'obj',
    ar: 1.3,
    scale: 1.2,
    render: (c: ShapeColors) => S('0 0 130 100', `<rect x="2" y="2" width="126" height="96" rx="10" fill="${c.f}"/><g fill="${c.d}" opacity=".45"><circle cx="16" cy="15" r="4.5"/><circle cx="30" cy="15" r="4.5"/><circle cx="44" cy="15" r="4.5"/></g><rect x="2" y="28" width="126" height="2" fill="${c.d}" opacity=".2"/><path d="M18 46l14 12-14 12" ${st(c.d, 7)}/><rect x="40" y="66" width="28" height="7" rx="2" fill="${c.d}"/>`),
  },
  {
    id: 'branch',
    label: "Git branch",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M30 14v72M30 72c0-26 40-18 40-44" ${st(c.f, 8)}/>` + [[30, 14], [30, 86], [70, 24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${c.f}"/><circle cx="${x}" cy="${y}" r="4.5" fill="${c.d}"/>`).join('')),
  },
  {
    id: 'bug',
    label: "Bug",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M28 46H12M26 62H8M30 78L16 90M72 46h16M74 62h18M70 78l14 12M44 18l-7-11M56 18l7-11" ${st(c.f, 6)}/><ellipse cx="50" cy="60" rx="24" ry="30" fill="${c.f}"/><circle cx="50" cy="28" r="13" fill="${c.f}"/><path d="M50 42v44" ${st(c.d, 4)} opacity=".5"/><circle cx="45" cy="27" r="2.6" fill="${c.d}"/><circle cx="55" cy="27" r="2.6" fill="${c.d}"/>`),
  },
  {
    id: 'gear',
    label: "Gear",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="${gear(50, 50, 47, 35, 9)}" fill="${c.f}"/><circle cx="50" cy="50" r="14" fill="${c.d}"/>`),
  },
  {
    id: 'package',
    label: "Package",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<polygon points="50,6 92,28 50,50 8,28" fill="${c.f}"/><polygon points="8,28 50,50 50,96 8,74" fill="${c.f}"/><polygon points="8,28 50,50 50,96 8,74" fill="${c.d}" opacity=".18"/><polygon points="92,28 50,50 50,96 92,74" fill="${c.f}"/><polygon points="92,28 50,50 50,96 92,74" fill="${c.d}" opacity=".38"/><path d="M29 17l42 22v16" ${st(c.d, 5)} opacity=".35"/>`),
  },
  {
    id: 'database',
    label: "Database",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M14 20v60c0 8 16 15 36 15s36-7 36-15V20z" fill="${c.f}"/><path d="M14 42c0 8 16 15 36 15s36-7 36-15M14 62c0 8 16 15 36 15s36-7 36-15" ${st(c.d, 3)} opacity=".35"/><ellipse cx="50" cy="20" rx="36" ry="14" fill="${c.f}"/><ellipse cx="50" cy="20" rx="36" ry="14" fill="${c.d}" opacity=".15"/>`),
  },
  {
    id: 'cloud',
    label: "Cloud deploy",
    kind: 'obj',
    ar: 1.1555555555555554,
    scale: 1.1,
    render: (c: ShapeColors) => S('0 0 104 90', `<path d="M28 80h48a20 20 0 0 0 2-40 28 28 0 0 0-54-4A22 22 0 0 0 28 80z" fill="${c.f}"/><path d="M52 70V48M42 57l10-10 10 10" ${st(c.d, 6)}/>`),
  },
  {
    id: 'cmdkey',
    label: "Mod key",
    kind: 'obj',
    ar: 1,
    scale: 0.85,
    variants: ["⌘","⌥","⇧","esc"],
    render: (c: ShapeColors, v?: string) => S('0 0 100 100', `<rect x="4" y="10" width="92" height="86" rx="16" fill="${c.f}"/><rect x="4" y="10" width="92" height="86" rx="16" fill="${c.d}" opacity=".25"/><rect x="12" y="4" width="76" height="74" rx="12" fill="${c.f}" stroke="${c.d}" stroke-opacity=".15" stroke-width="2"/><text x="50" y="${(v || '⌘').length > 1 ? 50 : 55}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="${(v || '⌘').length > 1 ? 24 : 38}" fill="${c.d}">${v || '⌘'}</text>`),
  },
  {
    id: 'diff',
    label: "Diff stat",
    kind: 'obj',
    ar: 2.6785714285714284,
    scale: 1.4,
    render: (c: ShapeColors) => S('0 0 150 56', `<rect x="2" y="2" width="146" height="52" rx="26" fill="${c.f}"/><text x="24" y="36" font-family="${MONO}" font-weight="500" font-size="20" fill="${c.d}">+128</text><text x="126" y="36" text-anchor="end" font-family="${MONO}" font-weight="500" font-size="20" fill="${c.d}" opacity=".55">−32</text>`),
  },
  {
    id: 'editor',
    label: "Editor",
    kind: 'obj',
    ar: 1.3,
    scale: 1.2,
    render: (c: ShapeColors) => S('0 0 130 100', `<rect x="2" y="2" width="126" height="96" rx="8" fill="${c.f}"/><rect x="2" y="2" width="30" height="96" rx="8" fill="${c.d}" opacity=".12"/>` + [[40, 16, 28], [40, 30, 56], [52, 44, 40], [52, 58, 62], [40, 72, 22], [40, 86, 44]].map(([x, y, w], i) => `<rect x="${x}" y="${y - 3}" width="${w}" height="6" rx="3" fill="${c.d}" opacity="${i % 3 === 1 ? '.6' : '.3'}"/><rect x="12" y="${y - 2}" width="10" height="4" rx="2" fill="${c.d}" opacity=".3"/>`).join('')),
  },
  {
    id: 'hash',
    label: "Hash",
    kind: 'obj',
    ar: 1,
    scale: 0.85,
    render: (c: ShapeColors) => S('0 0 100 100', `<path d="M38 10L30 90M70 10l-8 80M14 36h76M10 64h76" ${st(c.f, 9)}/>`),
  },
  {
    id: 'plug',
    label: "API plug",
    kind: 'obj',
    ar: 1,
    render: (c: ShapeColors) => S('0 0 100 100', `<rect x="24" y="30" width="52" height="38" rx="10" fill="${c.f}"/><rect x="35" y="8" width="9" height="24" rx="3" fill="${c.f}"/><rect x="56" y="8" width="9" height="24" rx="3" fill="${c.f}"/><path d="M50 68v12c0 8-6 12-16 12" ${st(c.f, 8)}/><circle cx="50" cy="49" r="5" fill="${c.d}"/>`),
  },
  {
    id: 'merged',
    label: "Merged",
    kind: 'obj',
    ar: 2.6785714285714284,
    scale: 1.4,
    render: (c: ShapeColors) => S('0 0 150 56', `<rect x="2" y="2" width="146" height="52" rx="26" fill="${c.f}"/><g ${st(c.d, 3.5)}><circle cx="26" cy="18" r="4.5"/><circle cx="26" cy="40" r="4.5"/><circle cx="44" cy="40" r="4.5"/><path d="M26 23v12M26 23c0 9 18 6 18 12"/></g><text x="58" y="34" font-family="${MONO}" font-weight="500" font-size="15" letter-spacing="1.5" fill="${c.d}">MERGED</text>`),
  }
];

export const devtools: ShapePack = {
  id: 'devtools',
  name: "DevTools",
  version: '0.1.0',
  description: "Terminals, braces, branches, packages and diffs. Editor greens and blues on a dark IDE ground.",
  shapes: DEVTOOLS_SHAPES,
  themes: {
    "dark": [
      {
        "f": "#8ef59b",
        "d": "#0c0f14",
        "w": 3
      },
      {
        "f": "#e6edf3",
        "d": "#0c0f14",
        "w": 3
      },
      {
        "f": "#7cc4ff",
        "d": "#0c0f14",
        "w": 2
      },
      {
        "f": "#2b323c",
        "d": "#e6edf3",
        "w": 2
      }
    ],
    "light": [
      {
        "f": "#1a8a3f",
        "d": "#ffffff",
        "w": 3
      },
      {
        "f": "#0c0f14",
        "d": "#8ef59b",
        "w": 3
      },
      {
        "f": "#1f6feb",
        "d": "#ffffff",
        "w": 2
      },
      {
        "f": "#cfd6de",
        "d": "#0c0f14",
        "w": 2
      }
    ],
    "accent": [
      {
        "f": "#0c0f14",
        "d": "#8ef59b",
        "w": 3
      },
      {
        "f": "#ffffff",
        "d": "#0c0f14",
        "w": 2
      }
    ],
    "mono": [
      {
        "f": "#e6edf3",
        "d": "#0c0f14",
        "w": 2
      },
      {
        "f": "#2b323c",
        "d": "#e6edf3",
        "w": 2
      }
    ]
  },
  swatches: ["#0c0f14","#8ef59b","#7cc4ff","#e6edf3"],
  baseShapes: ["square","frame","plus","dots","zigzag","pill","quarter"],
  background: {"dark":"#0c0f14","light":"#f4f6f8","accent":"#8ef59b"},
  ink: {"dark":"#e6edf3","light":"#0c0f14","accent":"#0c0f14"},
  font: { stack: "'JetBrains Mono',monospace", name: "JetBrains Mono", weight: 800 },
  demo: {
    "a": {
      "mode": "drift",
      "count": 26,
      "size": 66,
      "seed": 6,
      "depth": true
    },
    "b": {
      "mode": "gravity",
      "count": 20,
      "size": 76,
      "seed": 3
    }
  },
};

export default devtools;
