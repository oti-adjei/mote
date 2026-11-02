import { FloatingField } from '@usemote/react';
import { BASE_PACK } from '@usemote/core';
import { Layout } from '../shell/Layout.js';
import { PACKS, TOTAL_SHAPES, packSurface } from '../lib/packs.js';
import { SITE_LIGHT } from '../lib/theme.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import { StudyMark } from '../ui/StudyMark.js';

const TEASERS = ['esports', 'space', 'creative'];

export function Home(): React.ReactElement {
  return (
    <Layout page="index" title="A little motion. A lot of character.">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero wrap">
        <div className="hero-composition">
          <div className="hero-copy">
            <div className="eyebrow">Designed backgrounds, by Mote</div>
            <h1>
              Give your<br />background a little<br />
              <span className="hero-emphasis">character.</span>
            </h1>
            <p className="lead">
              Thoughtful shapes. Gentle motion. A small layer of personality
              that leaves your content in the spotlight.
            </p>
            <div className="actions">
              <a className="btn primary" href="/playground.html">
                Find your motion<span className="arrow" aria-hidden="true">↗</span>
              </a>
              <a className="btn quiet" href="/packs.html">
                Explore the packs<span className="arrow" aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="hero-note">
              A component library for the space behind your content.
            </p>
            <p className="hero-maker">
              An independent project.<br />
              <strong>Built by George Heavenson.</strong>
            </p>
          </div>

          <aside className="hero-study" aria-label="Mote geometric composition">
            <div className="study-top">
              <span>FIELD NOTES</span>
              <span>001</span>
            </div>
            <div className="study-art" aria-hidden="true">
              <StudyMark />
            </div>
            <div className="study-bottom">
              <span>A little structure.<br />A little spontaneity.</span>
              <span aria-hidden="true">↗</span>
            </div>
          </aside>
        </div>

        <div className="hero-stage">
          <FloatingField
            className="field"
            packs={[BASE_PACK]}
            /*
             * `bob` rather than `drift` here, deliberately. `avoid` is a
             * LAYOUT-time guarantee: free-moving presets wander back into the
             * region as they travel. Measured over ten seconds, drift puts 5
             * of 20 shapes back over the headline and across puts 4; static,
             * bob and hop put none. A hero caption has to stay legible.
             */
            mode="bob" set="geo" theme={SITE_LIGHT}
            count={20} size={52} seed={31} depth speed={0.8}
            avoid="center"
          />
          <div className="stage-caption">
            <strong>Room for your next idea.</strong>
            <span>Let the background do a little more.</span>
          </div>
          <div className="stage-meta">
            <span>STUDY 01 — GENTLE MOTION</span>
            <span>DRIFT · DEPTH · SEED 31</span>
          </div>
        </div>
      </section>

      {/* ── Facts ─────────────────────────────────────────────────── */}
      <div className="wrap facts">
        <div className="fact"><b>09</b><span>Themed shape packs</span></div>
        <div className="fact"><b>07</b><span>Motion behaviours</span></div>
        <div className="fact"><b>01</b><span>Shared animation loop</span></div>
      </div>

      {/* ── Personality ───────────────────────────────────────────── */}
      <section className="section wrap section-personality">
        <div className="section-heading">
          <div>
            <div className="eyebrow">01 / Made to belong</div>
            <h2>A background.<br />Not an interruption.</h2>
          </div>
          <p className="lead">
            A field that fills its container, keeps space for the important
            things, and feels like part of your design.
          </p>
        </div>

        <div className="grid three">
          <article className="sample">
            <div className="sample-art">
              <FloatingField
                className="field" packs={[BASE_PACK]}
                mode="bob" set="geo" theme={SITE_LIGHT} count={9} size={52} seed={4}
              />
            </div>
            <h3>Personality, at your pace.</h3>
            <p>
              Choose a gentle bob, an easy drift, or something more playful.
              Each behaviour has a different feel.
            </p>
          </article>

          <article className="sample">
            <div className="sample-art">
              <FloatingField
                className="field" packs={[BASE_PACK]}
                mode="drift" set="geo" theme={SITE_LIGHT}
                count={12} size={46} seed={12} avoid="center"
              />
            </div>
            <h3>Space for the main thing.</h3>
            <p>
              Keep the center clear for a headline or place the action around a
              section. Content always comes first.
            </p>
          </article>

          <article className="sample">
            <div className="sample-art">
              <FloatingField
                className="field" packs={[BASE_PACK]}
                mode="drift" set="geo" theme={SITE_LIGHT}
                count={20} size={34} seed={8} depth speed={0.6}
              />
              <FloatingField
                className="field" packs={[BASE_PACK]}
                mode="bob" shapes="circle,ring,arch" theme={SITE_LIGHT}
                count={3} size={78} seed={2}
              />
            </div>
            <h3>A little depth goes a long way.</h3>
            <p>
              Layer small, distant geometry behind a more expressive field.
              Compose with two fields, not a new API.
            </p>
          </article>
        </div>
      </section>

      {/* ── Vocabulary ────────────────────────────────────────────── */}
      <section className="section wrap section-vocabulary">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / Find your vocabulary</div>
            <h2>Different worlds.<br />The same small engine.</h2>
          </div>
          <div>
            <p className="lead">
              From game nights to new ideas, each pack brings its own visual
              language — {TOTAL_SHAPES} shapes in all.
            </p>
            <div className="actions" style={{ marginTop: 24 }}>
              <a className="btn quiet" href="/packs.html">
                Meet all nine packs<span className="arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid three">
          {TEASERS.map((id) => {
            const entry = PACKS.find((p) => p.id === id)!;
            const surface = packSurface(entry);
            return (
              <a key={id} className="pack-tile" href={`/packs.html?pack=${id}`}>
                <span className="pack-number">PACK / {entry.n}</span>
                <div className="pack-symbol" aria-hidden="true">{entry.symbol}</div>
                <div
                  className="pack-preview"
                  style={{ background: surface.bg }}
                  aria-hidden="true"
                >
                  <FloatingField
                    className="field" packs={[entry.pack]}
                    mode="bob" set="objects" theme="dark"
                    count={5} size={44} seed={9}
                  />
                </div>
                <h3>{entry.name}</h3>
                <p>{entry.audience}</p>
                <div className="bottom">
                  <span>Discover the pack</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── Code ──────────────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="feature-split">
          <div>
            <div className="eyebrow">03 / Small by design</div>
            <h2>A little code.<br />A whole new feeling.</h2>
            <p className="lead">
              Choose a pack, set the mood, and let Mote fill the space.
              Deterministic layout keeps your scene consistent from one render
              to the next.
            </p>
            <div className="actions">
              <a className="btn quiet" href="/docs.html">
                See how it works<span className="arrow" aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="inline-note">
              Pre-release: packages are not published yet.
            </p>
          </div>

          <CodeBlock
            label="React · source integration"
            code={`import { FloatingField } from '@usemote/react';
import { esports } from '@usemote/pack-esports';

<section style={{ position: 'relative' }}>
  <FloatingField
    packs={[esports]}
    mode="bob"
    count={10}
    avoid="center"
    depth
  />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>`}
          />
        </div>
      </section>

      {/* ── Close ─────────────────────────────────────────────────── */}
      <section className="section wrap section-close">
        <div className="callout">
          <div>
            <div className="eyebrow">Start somewhere</div>
            <h2>Find the motion that fits.</h2>
          </div>
          <a className="btn primary" href="/playground.html">
            Open the playground<span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}
