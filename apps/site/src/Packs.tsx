/** Every pack, shown on its own designer-chosen ground with its own demo. */
import { FloatingField } from '@usemote/react';
import type { FieldOptions, ShapePack } from '@usemote/core';
import { PACKS, type PackId } from './config.js';

const ORDER: PackId[] = [
  'esports', 'space', 'cyber', 'health', 'education',
  'devtools', 'ai', 'fintech', 'creative',
];

function demoFor(pack: ShapePack): FieldOptions {
  const base = pack.demo?.a ?? { mode: 'bob', count: 10, size: 80, seed: 4 };
  return { packs: [pack], avoid: 'center', ...base };
}

export function Packs(): React.ReactElement {
  const total = ORDER.reduce((n, id) => n + PACKS[id].shapes.length, 0);

  return (
    <>
      <div className="section-head">
        <h2>Packs</h2>
        <span className="meta">{ORDER.length} PACKS · {total} SHAPES · ONE ENGINE</span>
      </div>

      <div className="demo-grid">
        {ORDER.map((id) => {
          const pack = PACKS[id];
          const bg = pack.background?.dark ?? '#121212';
          const ink = pack.ink?.dark ?? '#f2f2ee';
          return (
            <div key={id}>
              <div className="demo-stage" style={{ background: bg }}>
                <FloatingField {...demoFor(pack)} />
                <div style={{
                  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                  pointerEvents: 'none', textAlign: 'center', padding: 24,
                }}>
                  <div style={{
                    font: `${pack.font?.weight ?? 900} clamp(26px,3.4vw,46px)/0.95 ${pack.font?.stack ?? "'Schibsted Grotesk',sans-serif"}`,
                    letterSpacing: '-0.04em', color: ink,
                  }}>
                    {pack.name}
                  </div>
                </div>
              </div>

              <div className="demo-meta">
                <span className="num">{pack.shapes.length}</span>
                <span className="name">{pack.name}</span>
                <span className="desc">{pack.description}</span>
                <code>
                  packs={'{['}{id}{']}'} {String(pack.demo?.a?.mode ?? 'bob')}
                </code>
              </div>

              {pack.swatches && (
                <div style={{ display: 'flex', gap: 4, marginTop: 8, marginLeft: 44 }}>
                  {pack.swatches.map((c) => (
                    <span key={c} title={c} style={{
                      width: 22, height: 22, borderRadius: 5, background: c,
                      border: '1px solid rgba(18,18,18,.15)',
                    }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
