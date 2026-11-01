/** Window frames: the 13 kinds, the size tiers, and media inside a field. */
import { FloatingField } from '@usemote/react';
import { KINDS, frame, windowShape, type FrameKind } from '@usemote/media';
import { esports } from '@usemote/pack-esports';
import type { ShapeColors } from '@usemote/core';

const C: ShapeColors = { f: '#d4ff1e', d: '#121212', p: ['#d4ff1e', '#f2f2ee'] };

const ART: Record<string, string> = Object.fromEntries(
  esports.shapes.map((s) => [s.id, s.render({ f: '#d4ff1e', d: '#121212' })]),
);
const art = (id: string): string => ART[id] ?? '';

function Frame({ kind, w, idx }: { kind: FrameKind; w: number; idx: number }) {
  const { html } = frame({
    kind, w, c: C, pack: 'esports', idx,
    art: art(esports.shapes[idx % esports.shapes.length]!.id),
    clip: kind === 'browser' || kind === 'stream',
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Media particles floating in a real field, which is the actual use case. */
const MEDIA = [
  windowShape({ id: 'nova', kind: 'caption', place: 'right', pack: 'esports', idx: 1, scale: 3.2, art: art('headset') }),
  windowShape({ id: 'clip', kind: 'browser', place: 'left', pack: 'esports', clip: true, scale: 3.4, art: art('controller') }),
];

export function Frames(): React.ReactElement {
  return (
    <>
      <div className="section-head">
        <h2>Window frames</h2>
        <span className="meta">{KINDS.length} KINDS · CHROME THAT DROPS DETAIL, NOT SIZE</span>
      </div>

      <p className="lede" style={{ marginBottom: 24 }}>
        Chrome for photos, GIFs and video that float with the shapes. Two colours per
        frame, taken from the pack theme. Frames are objects in the scene: no hover,
        no cursor, nothing clickable. Video carries a poster and never autoplays —
        playback starts at runtime, so reduced motion stays on the still frame.
      </p>

      <div className="demo-stage" style={{ background: '#121212', height: 460, marginBottom: 32 }}>
        <FloatingField
          packs={[esports]} mode="bob" set="objects" count={9} size={64}
          seed={17} avoid="center" theme="dark" depth media={MEDIA}
        />
      </div>

      <div className="eyebrow" style={{ margin: '28px 0 12px' }}>All kinds · 300px</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24, alignItems: 'start', background: '#121212', padding: 24, borderRadius: 14 }}>
        {KINDS.map((kind: FrameKind, i: number) => (
          <div key={kind}>
            <Frame kind={kind} w={300} idx={i} />
            <div style={{ font: '500 11px var(--mono)', letterSpacing: '.12em', color: '#8a8a85', marginTop: 10 }}>
              {kind.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div className="eyebrow" style={{ margin: '28px 0 12px' }}>Size tiers · 240 / 300 / 420</div>
      <div style={{ background: '#121212', padding: 24, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {(['browser', 'app', 'caption'] as FrameKind[]).map((kind) => (
          <div key={kind} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ font: '500 11px var(--mono)', letterSpacing: '.12em', color: '#8a8a85', width: 92, flex: 'none', paddingTop: 8 }}>
              {kind.toUpperCase()}
            </div>
            {[240, 300, 420].map((w) => (
              <div key={w}>
                <Frame kind={kind} w={w} idx={2} />
                <div style={{ font: '500 10px var(--mono)', color: '#6b6b66', marginTop: 8 }}>{w}PX</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
