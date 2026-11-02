import { FloatingField } from '@usemote/react';
import { KINDS, frame, windowShape, type FrameKind } from '@usemote/media';
import { type ShapeColors } from '@usemote/core';
import { useMemo, useState } from 'react';
import { PACKS } from '../lib/packs.js';

/**
 * Media and frames — the part the design export marked as a concept.
 *
 * Everything here is the real `@usemote/media` package: 13 frame kinds, the
 * size tiers, and anchored media particles floating in a live field.
 */

const SIZES = [240, 300, 420] as const;

function useColors(packId: string): { c: ShapeColors; bg: string; art: Record<string, string> } {
  return useMemo(() => {
    const entry = PACKS.find((p) => p.id === packId)!;
    const stops = entry.pack.themes?.dark ?? [];
    const first = stops[0];
    const c: ShapeColors = {
      f: first?.f ?? '#f2f2ee',
      d: first?.d ?? '#121212',
      p: stops.map((s) => s.f),
    };
    const art = Object.fromEntries(
      entry.pack.shapes.map((s) => [s.id, s.render({ f: c.f, d: c.d })]),
    );
    return { c, bg: entry.pack.background?.dark ?? '#121212', art };
  }, [packId]);
}

function Frame({
  kind, w, packId, idx, clip,
}: { kind: FrameKind; w: number; packId: string; idx: number; clip?: boolean }) {
  const { c, art } = useColors(packId);
  const ids = Object.keys(art);
  const html = frame({
    kind, w, c, pack: packId, idx,
    art: art[ids[idx % ids.length]!] ?? '',
    ...(clip ? { clip: true } : {}),
  }).html;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MediaStudies(): React.ReactElement {
  const [packId, setPackId] = useState('esports');
  const { bg } = useColors(packId);

  const media = useMemo(() => {
    const entry = PACKS.find((p) => p.id === packId)!;
    const first = entry.pack.shapes[0];
    const second = entry.pack.shapes[2] ?? first;
    const stops = entry.pack.themes?.dark ?? [];
    const col = { f: stops[0]?.f ?? '#fff', d: stops[0]?.d ?? '#000' };
    return [
      windowShape({
        id: 'portrait', kind: 'caption', place: 'right', pack: packId,
        idx: 1, scale: 3.1, art: second?.render(col) ?? '',
      }),
      windowShape({
        id: 'clip', kind: 'browser', place: 'left', pack: packId,
        clip: true, scale: 3.3, art: first?.render(col) ?? '',
      }),
    ];
  }, [packId]);

  return (
    <section className="section wrap section-media">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Media and frames</div>
          <h2>A frame for<br />your own content.</h2>
        </div>
        <p className="lead">
          A particle does not have to be a drawn shape. Photos, GIFs and video
          float in the field exactly like geometry — same layout, same depth,
          same motion.
        </p>
      </div>

      {/* Live field with anchored media */}
      <div className="sample-art" style={{ height: 440, background: bg }}>
        <FloatingField
          className="field"
          packs={[PACKS.find((p) => p.id === packId)!.pack]}
          mode="bob" set="objects" theme="dark"
          count={8} size={56} seed={17} avoid="center" depth
          media={media}
        />
      </div>

      <div className="toolbar" role="group" aria-label="Preview pack">
        {PACKS.map((p) => (
          <button
            key={p.id} className="chip" type="button"
            aria-pressed={packId === p.id}
            onClick={() => setPackId(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* ── Video behaviour ───────────────────────────────────────── */}
      <div className="media-notes">
        <article>
          <h3>Video never autoplays.</h3>
          <p>
            A video is emitted with no <code className="inline-code">autoplay</code>{' '}
            attribute, deliberately — markup has to be byte-identical on the
            server and the client or hydration mismatches. Playback is started
            at runtime instead.
          </p>
        </article>
        <article>
          <h3>So reduced motion simply never starts it.</h3>
          <p>
            Someone with <code className="inline-code">prefers-reduced-motion</code>{' '}
            sees the poster frame and nothing moves. That is also why a poster
            matters: a paused video without one is a blank rectangle.
          </p>
        </article>
        <article>
          <h3>Offscreen pauses. Destroy releases.</h3>
          <p>
            Playback follows visibility, and tearing a field down pauses its
            media first — a detached video should not hold its decoder until
            garbage collection catches up.
          </p>
        </article>
      </div>

      {/* ── Size tiers ────────────────────────────────────────────── */}
      <div className="section-heading" style={{ marginTop: 64 }}>
        <div>
          <div className="eyebrow">Size tiers</div>
          <h2>Chrome drops detail.<br />It doesn’t shrink.</h2>
        </div>
        <p className="lead">
          A frame in a field can be any size, and chrome that merely scales
          turns to mush. Below 270px the controls merge into a single capsule;
          a URL only appears at 340px and up.
        </p>
      </div>

      <div className="tier-grid" style={{ background: bg }}>
        {(['browser', 'app', 'caption'] as FrameKind[]).map((kind) => (
          <div key={kind} className="tier-row">
            <span className="tier-label">{kind}</span>
            {SIZES.map((w) => (
              <figure key={w}>
                <Frame kind={kind} w={w} packId={packId} idx={2} clip={kind === 'browser'} />
                <figcaption>{w}px</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      {/* ── All kinds ─────────────────────────────────────────────── */}
      <div className="section-heading" style={{ marginTop: 64 }}>
        <div>
          <div className="eyebrow">Thirteen kinds</div>
          <h2>Windows, cards,<br />and other containers.</h2>
        </div>
        <p className="lead">
          Each takes two colours from the active pack theme, so a frame
          inherits whatever world it sits in.
        </p>
      </div>

      <div className="kind-grid" style={{ background: bg }}>
        {KINDS.map((kind, i) => (
          <figure key={kind}>
            <Frame
              kind={kind} w={272} packId={packId} idx={i}
              clip={kind === 'browser' || kind === 'stream'}
            />
            <figcaption>{kind}</figcaption>
          </figure>
        ))}
      </div>

      <p className="inline-note">
        Frames are HTML, so they render in the browser only — the static SVG
        export cannot include them.
      </p>
    </section>
  );
}
