import { FloatingField } from '@usemote/react';
import { BASE_PACK, type MotionId } from '@usemote/core';
import { windowShape } from '@usemote/media';
import { useState } from 'react';
import { Layout } from '../shell/Layout.js';
import { PACKS, packSurface } from '../lib/packs.js';
import { SITE_DARK } from '../lib/theme.js';
import { MediaStudies } from './MediaStudies.js';

interface Study {
  mode: MotionId;
  title: string;
  body: string;
  pack?: string;
  props?: Record<string, unknown>;
}

/** The designer's seven studies, with the real preset behind each. */
const STUDIES: Study[] = [
  {
    mode: 'static', title: 'Still can have character.',
    body: 'Shapes hold position and lean away from the cursor, then settle back. No time dependence at all — the calm choice for a text-heavy section.',
    props: { count: 16, size: 56, seed: 11 },
  },
  {
    mode: 'bob', title: 'An easy, familiar rhythm.',
    body: 'A slow float with a slight sway, each piece out of step with its neighbours. The usual hero choice.',
    pack: 'esports', props: { set: 'objects', count: 9, size: 64, seed: 4, avoid: 'center' },
  },
  {
    mode: 'hop', title: 'A more playful beat.',
    body: 'Each piece bounces on its spot with a small squash on landing. Volume-preserving, so it reads as weight rather than scaling.',
    pack: 'education', props: { set: 'objects', count: 8, size: 62, seed: 21 },
  },
  {
    mode: 'drift', title: 'Let the composition breathe.',
    body: 'Slow wandering with wrap-around. With depth on, far shapes are smaller, slower and softly blurred.',
    props: { set: 'geo', count: 28, size: 50, seed: 5, depth: true },
  },
  {
    mode: 'across', title: 'A passing stream of shapes.',
    body: 'A steady parade in one direction, re-entering on a new line each pass — deterministically, so the same seed gives the same parade.',
    pack: 'fintech', props: { set: 'objects', count: 12, size: 58, seed: 9, depth: true, direction: 'right' },
  },
  {
    mode: 'bounce', title: 'A livelier kind of space.',
    body: 'Shapes ricochet off the walls and each other. Speed is clamped, so energy neither dies out nor runs away.',
    pack: 'space', props: { set: 'objects', count: 11, size: 58, seed: 14 },
  },
  {
    mode: 'gravity', title: 'Let things settle.',
    body: 'Everything drops and piles at the bottom. Settled pieces sleep, so the heap comes to rest instead of buzzing forever.',
    pack: 'devtools', props: { set: 'objects', count: 16, size: 56, seed: 3 },
  },
];

export function Examples(): React.ReactElement {
  const [filter, setFilter] = useState<MotionId | 'all'>('all');
  const shown = filter === 'all' ? STUDIES : STUDIES.filter((s) => s.mode === filter);

  return (
    <Layout page="examples" title="Small movements. Different moods.">
      <section className="page-intro wrap">
        <div className="eyebrow">Seven motion studies</div>
        <h1>Small movements.<br />Different moods.</h1>
        <p className="lead">
          One engine, seven behaviours. Every field below is live — the same
          code you would ship, running at the size you see.
        </p>
      </section>

      <div className="wrap">
        <div className="toolbar" role="group" aria-label="Filter by behaviour">
          <button
            className="chip" type="button"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STUDIES.map((s) => (
            <button
              key={s.mode} className="chip" type="button"
              aria-pressed={filter === s.mode}
              onClick={() => setFilter(s.mode)}
            >
              {s.mode}
            </button>
          ))}
        </div>

        <div className="grid two" style={{ marginTop: 24 }}>
          {shown.map((s) => {
            const entry = s.pack ? PACKS.find((p) => p.id === s.pack) : undefined;
            const pack = entry?.pack ?? BASE_PACK;
            const bg = entry ? packSurface(entry).bg : 'var(--blush)';
            return (
              <article key={s.mode} className="sample" data-example-mode={s.mode}>
                <div className="sample-art" style={{ background: bg }}>
                  <FloatingField
                    className="field" packs={[pack]}
                    mode={s.mode} theme="dark"
                    {...(s.props as Record<string, never>)}
                  />
                </div>
                <div className="eyebrow" style={{ marginTop: 20 }}>{s.mode}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <code className="inline-code">mode="{s.mode}"</code>
              </article>
            );
          })}
        </div>

        {shown.length === 0 && (
          <div className="empty"><h3>Nothing matches that filter.</h3></div>
        )}
      </div>

      <MediaStudies />

      {/* ── Layering ──────────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Composition</div>
            <h2>Two fields.<br />Not a new API.</h2>
          </div>
          <p className="lead">
            Depth comes from stacking: a quiet, distant layer behind a louder
            one in front. They share a single animation loop, so the layers
            stay in phase and the cost does not double.
          </p>
        </div>
        <div className="sample-art" style={{ height: 420, background: 'var(--plum)' }}>
          <FloatingField
            className="field" packs={[BASE_PACK]}
            mode="drift" set="geo" theme={SITE_DARK}
            count={34} size={38} seed={2} depth speed={0.7}
          />
          <FloatingField
            className="field" packs={[PACKS[0]!.pack]}
            mode="bob" shapes="controller,trophy,headset,medal,crosshair"
            theme="dark" count={5} size={92} seed={8} avoid="center"
          />
          <div className="stage-caption">
            <strong style={{ color: 'var(--paper)' }}>Quiet behind. Expressive in front.</strong>
            <span>drift · mono + bob · objects</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
