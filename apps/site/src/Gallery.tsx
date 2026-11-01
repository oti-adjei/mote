/**
 * The eight behaviour demos from the original design doc, kept faithful to
 * its prop signatures so the design file and the built component stay
 * comparable — including #08, the layered composition that is the real hero.
 */
import { FloatingField } from '@usemote/react';
import { BASE_PACK, type FieldOptions } from '@usemote/core';
import { esports } from '@usemote/pack-esports';

interface Demo {
  num: string;
  name: string;
  desc: string;
  code: string;
  bg: string;
  caption?: string;
  hint?: string;
  layers: FieldOptions[];
}

const DEMOS: Demo[] = [
  {
    num: '01', name: 'Static scatter', bg: '#121212',
    desc: 'Shapes hold their position and lean away from the cursor, then settle back.',
    code: 'mode="static" set="mixed" count={18}',
    layers: [{ packs: [esports], mode: 'static', set: 'mixed', count: 18, size: 64, seed: 11 }],
  },
  {
    num: '02', name: 'Bob in place', bg: '#121212',
    desc: 'A slow float with a slight sway. Keeps the centre clear for a headline.',
    code: 'mode="bob" set="objects" avoid="center"',
    caption: 'The game\ngoes on.',
    layers: [{ packs: [esports], mode: 'bob', set: 'objects', count: 10, size: 86, seed: 4, avoid: 'center' }],
  },
  {
    num: '03', name: 'Hop in place', bg: '#efeee8',
    desc: 'Each piece bounces on its spot with a small squash on landing, out of step with its neighbours.',
    code: 'mode="hop" theme="light" shapes="circle,triangle,keycap,…"',
    layers: [{
      packs: [BASE_PACK, esports], mode: 'hop',
      shapes: 'circle,triangle,square,keycap,coin,gg,heart,trophy',
      count: 8, size: 84, seed: 21, theme: 'light',
    }],
  },
  {
    num: '04', name: 'Drift with depth', bg: '#121212',
    desc: 'Slow wandering in every direction. Far shapes are smaller, slower and softly blurred.',
    code: 'mode="drift" set="geo" depth',
    layers: [{ packs: [BASE_PACK], mode: 'drift', set: 'geo', count: 34, size: 70, seed: 5, depth: true }],
  },
  {
    num: '05', name: 'Across the screen', bg: '#d4ff1e',
    desc: 'A steady parade in one direction, re-entering on a new line each pass.',
    code: 'mode="across" direction="right" theme="lime"',
    layers: [{ packs: [esports], mode: 'across', set: 'objects', count: 14, size: 80, seed: 9, theme: 'lime', depth: true, direction: 'right' }],
  },
  {
    num: '06', name: 'Bounce', bg: '#121212',
    desc: 'Shapes ricochet off the walls and each other, like a screensaver with collisions.',
    code: 'mode="bounce" set="mixed"',
    layers: [{ packs: [BASE_PACK, esports], mode: 'bounce', set: 'mixed', count: 12, size: 76, seed: 14 }],
  },
  {
    num: '07', name: 'Gravity pile', bg: '#efeee8', hint: 'CLICK TO THROW',
    desc: 'Everything drops and piles at the bottom. Click to toss it back up; the cursor pushes pieces around.',
    code: 'mode="gravity" theme="light"',
    layers: [{ packs: [BASE_PACK, esports], mode: 'gravity', set: 'mixed', count: 22, size: 78, seed: 3, theme: 'light' }],
  },
  {
    num: '08', name: 'Layered', bg: '#121212',
    desc: 'Two fields stacked: a quiet grey drift behind, a few large objects bobbing in front. One shared animation loop.',
    code: 'drift · mono + bob · objects',
    layers: [
      { packs: [BASE_PACK], mode: 'drift', set: 'geo', theme: 'mono', count: 40, size: 40, seed: 2, depth: true },
      { packs: [esports], mode: 'bob', shapes: 'controller,trophy,headset,medal,crosshair', count: 5, size: 110, seed: 8, avoid: 'center' },
    ],
  },
];

export function Gallery(): React.ReactElement {
  return (
    <>
      <div className="section-head">
        <h2>Behaviours</h2>
        <span className="meta">MOVE YOUR CURSOR OVER ANY DEMO</span>
      </div>
      <div className="demo-grid">
        {DEMOS.map((d) => (
          <div key={d.num}>
            <div className="demo-stage" style={{ background: d.bg }}>
              {d.hint && <span className="hint">{d.hint}</span>}
              {d.layers.map((layer, i) => (
                <FloatingField key={i} {...layer} />
              ))}
              {d.caption && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                  pointerEvents: 'none', whiteSpace: 'pre-line', textAlign: 'center',
                  font: "900 clamp(28px,4vw,54px)/0.9 'Schibsted Grotesk',sans-serif",
                  letterSpacing: '-0.055em', color: '#f2f2ee',
                }}>
                  {d.caption}
                </div>
              )}
            </div>
            <div className="demo-meta">
              <span className="num">{d.num}</span>
              <span className="name">{d.name}</span>
              <span className="desc">{d.desc}</span>
              <code>{d.code}</code>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
