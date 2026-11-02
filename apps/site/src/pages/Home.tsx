import { FloatingField } from '@usemote/react';
import { BASE_PACK } from '@usemote/core';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Layout } from '../shell/Layout.js';
import { PACKS, TOTAL_SHAPES } from '../lib/packs.js';
import { SITE_DARK, SITE_LIGHT } from '../lib/theme.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import { PackTile } from './Packs.js';

const TEASERS = ['esports', 'space', 'creative'];

/**
 * Early-access roster for the "in good company" band — twelve teams, nine
 * packs. Six sit on the board at a time; the rest wait offstage and rotate
 * in at random. Illustrative until launch: swap in real customers (with
 * wordmark permission) and drop the disclosure note under the band.
 */
const COMPANIES: Array<[string, string, string]> = [
  ['Fragnova', 'esports', 'tournament platform'],
  ['Apogee', 'space', 'space-news digest'],
  ['Pulsepad', 'health', 'habit tracking'],
  ['Chalkline', 'education', 'classroom tools'],
  ['Loomwork', 'devtools', 'release notes'],
  ['Fieldnote Studio', 'creative', 'brand studio'],
  ['Nightjar', 'cyber', 'security operations'],
  ['Meridian', 'fintech', 'personal finance'],
  ['Queryloop', 'ai', 'research assistant'],
  ['Restwell', 'health', 'sleep clinics'],
  ['Patchbay', 'devtools', 'CI dashboards'],
  ['Glasswing', 'creative', 'design studio'],
];

/**
 * The MCP demo's three requests. Each is a real field config — the preview
 * is the actual engine, only the "assistant" is simulated.
 */
const SCENES = {
  drift: {
    label: 'Gentle drift',
    prompt: 'Make it drift gently in Mote’s signature colors.',
    result: '14 shapes · gentle drift · Mote signature palette',
    config: { mode: 'drift', count: 14, speed: 0.65, avoid: 'none', seed: 41 },
  },
  clear: {
    label: 'Clear the center',
    prompt: 'Clear the center for my headline.',
    result: 'Center kept clear · the caption stays legible',
    config: { mode: 'bob', count: 14, speed: 0.65, avoid: 'center', seed: 41 },
  },
  quiet: {
    label: 'Make it quieter',
    prompt: 'Make it quieter — fewer shapes, slower.',
    result: '6 shapes · slow drift · a calmer field',
    config: { mode: 'drift', count: 6, speed: 0.3, avoid: 'none', seed: 41 },
  },
} as const;

type SceneId = keyof typeof SCENES;

type Company = [string, string, string];

/**
 * One roster cell as a split-flap (flip-clock) card.
 *
 * Four full-card layers clipped to halves. The two static halves never
 * move; the two flaps do. The whole turn is a single CSS timeline —
 * the landing flap is delayed in CSS rather than triggered by a second
 * React render, so there is no frame mid-flip where the card sits flat
 * and both faces show at once. Content, typography and grid are
 * untouched.
 */
const FLIP_MS = 530;

function SplitFlapCard({ company }: { company: Company }) {
  const [settled, setSettled] = useState<Company>(company);
  const [incoming, setIncoming] = useState<Company | null>(null);

  useEffect(() => {
    if (company[0] === settled[0]) return;
    // Reduced motion: swap instantly, no theatre.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettled(company);
      return;
    }
    setIncoming(company);
    const done = window.setTimeout(() => {
      setSettled(company);
      setIncoming(null);
    }, FLIP_MS);
    // A new company arriving mid-flip restarts the turn toward the
    // latest target — the keyed flaps remount, so the animation
    // begins again cleanly instead of resuming from a stale angle.
    return () => window.clearTimeout(done);
  }, [company, settled]);

  const face = (c: Company) => (
    <>
      <span className="company-name">{c[0]}</span>
      <span className="company-use">{c[1]} pack · {c[2]}</span>
    </>
  );

  const next = incoming ?? settled;

  return (
    <li className={`flap-card${incoming ? ' is-flipping' : ''}`}>
      {/* Static halves: transparent, so the drifting field still reads
          through the grid. Top already carries the incoming face — the
          falling flap is what hides it until the turn exposes it. */}
      <div className="flap-layer flap-static-top">{face(next)}</div>
      <div className="flap-layer flap-static-bottom">{face(settled)}</div>
      <div className="flap-hinge" aria-hidden="true" />
      {incoming ? (
        <Fragment key={incoming[0]}>
          <div className="flap-layer flap-top" aria-hidden="true">{face(settled)}</div>
          <div className="flap-layer flap-bottom" aria-hidden="true">{face(incoming)}</div>
        </Fragment>
      ) : null}
    </li>
  );
}

function McpDemo(): React.ReactElement {
  const [scene, setScene] = useState<SceneId>('drift');
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = SCENES[scene];

  const copyPrompt = async (): Promise<void> => {
    const text =
      `Use the connected Mote MCP for this request: ${current.prompt} ` +
      'Use the tools and settings actually available through the server, and respect reduced-motion preferences.';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mcp-demo" aria-label="Interactive Mote MCP workflow preview">
      <div className="mcp-demo-bar">
        <span className="eyebrow">Interactive preview</span>
        <span className="small">01 / Prompt → background</span>
      </div>
      <div className="mcp-demo-stage">
        <FloatingField
          key={`${scene}-${replay}`}
          className="field" packs={[BASE_PACK]}
          set="geo" theme={SITE_LIGHT} depth size={64}
          {...current.config}
        />
        <div className="mcp-demo-caption">
          <span>A little room</span>
          <strong>for your next idea.</strong>
        </div>
      </div>
      <div className="mcp-demo-conversation">
        <span className="eyebrow">Your request</span>
        <p className="mcp-demo-request">{current.prompt}</p>
        <div className="mcp-demo-response">
          <span className="eyebrow">Preview settings</span>
          <p aria-live="polite">{current.result}</p>
        </div>
        <div className="mcp-demo-choices" role="group" aria-label="Choose an example request">
          {(Object.keys(SCENES) as SceneId[]).map((id) => (
            <button
              key={id} type="button"
              aria-pressed={scene === id}
              onClick={() => setScene(id)}
            >
              {SCENES[id].label}
            </button>
          ))}
        </div>
        <div className="mcp-demo-actions">
          <button className="btn quiet small" type="button" onClick={() => setReplay((r) => r + 1)}>
            Replay
          </button>
          <button className="btn dark small" type="button" onClick={copyPrompt}>
            {copied ? 'Prompt copied' : 'Copy prompt'}
          </button>
        </div>
        <p className="mcp-demo-disclaimer">
          The field is the real engine responding to each request. No AI is
          called on this page.
        </p>
      </div>
    </div>
  );
}

export function Home(): React.ReactElement {
  const [heroPaused, setHeroPaused] = useState(false);
  const [studyPaused, setStudyPaused] = useState(false);

  // The company band: six cards on the board, the rest of the roster
  // waiting offstage. Every couple of seconds one card gives way to a
  // company that isn't visible yet. The band is decoration, so it stays
  // quiet while offscreen, on a hidden tab, or under reduced motion.
  const bandRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState<number[]>(() =>
    COMPANIES.map((_, i) => i).slice(0, 6),
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    let timer = 0;
    let alive = true;

    const schedule = (): void => {
      if (!alive || reduced.matches || document.hidden || !inView) return;
      timer = window.setTimeout(tick, 1200 + Math.random() * 600);
    };

    const tick = (): void => {
      setVisible((current) => {
        const hidden = COMPANIES.map((_, i) => i).filter((i) => !current.includes(i));
        const slot = Math.floor(Math.random() * current.length);
        const next = hidden[Math.floor(Math.random() * hidden.length)];
        if (next === undefined) return current;
        const out = [...current];
        out[slot] = next;
        return out;
      });
      schedule();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.2 },
    );
    if (bandRef.current) observer.observe(bandRef.current);
    const onVisibility = (): void => {
      if (!document.hidden) schedule();
    };
    document.addEventListener('visibilitychange', onVisibility);
    schedule();

    return () => {
      alive = false;
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <Layout page="index" title="A little motion. A lot of character.">
      {/* ── Hero — architectural, after 03-Design/orix.webp ───── */}
      {/* ── Hero — centered, on an ambient field ───────────────────── */}
      <section className="hero-ambient">
        <FloatingField
          className="field hero-field" packs={[BASE_PACK]}
          mode="drift" set="geo" theme={SITE_LIGHT}
          count={18} size={52} seed={11} depth speed={0.65}
          avoid="center" paused={heroPaused}
        />
        <div className="wrap hero-content">
          <div className="eyebrow">Designed backgrounds, by Mote</div>
          <h1>
            Give your background<br />
            <span className="hero-emphasis">a little character.</span>
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
            Built by <strong><a href="https://hearvie.dev">George Heavenson</a></strong>
          </p>
        </div>
        <div className="wrap ambient-meta">
          <span>MOTE DEFAULT / A LITTLE ROOM TO PLAY</span>
          <button
            className="btn quiet small" type="button"
            onClick={() => setHeroPaused((p) => !p)}
          >
            {heroPaused ? 'Play motion' : 'Pause motion'}
          </button>
        </div>
      </section>
      <p className="wrap inline-note hero-disclosure">
        Live field · @usemote/core · drift · 18 shapes · seed 11
      </p>

      {/* ── Facts ─────────────────────────────────────────────────── */}
      <div className="wrap facts">
        <div className="fact"><b>09</b><span>Themed shape packs</span></div>
        <div className="fact"><b>07</b><span>Motion behaviours</span></div>
        <div className="fact"><b>01</b><span>Shared animation loop</span></div>
      </div>

      {/* ── Motion study ──────────────────────────────────────────── */}
      <section className="wrap motion-study" aria-label="A study in gentle motion">
        <div className="hero-stage">
          <FloatingField
            className="field" packs={[BASE_PACK]}
            /*
             * `bob` rather than `drift`, deliberately. `avoid` is a
             * LAYOUT-time guarantee: free-moving presets wander back into the
             * region as they travel. A caption has to stay legible, so the
             * study uses a preset that stays put.
             */
            mode="bob" set="geo" theme={SITE_LIGHT}
            count={18} size={48} seed={11} depth speed={0.65}
            avoid="center" paused={studyPaused}
          />
          <div className="stage-caption">
            <h2>Room for your next idea.</h2>
            <p>Let the background do a little more.</p>
          </div>
          <div className="stage-meta">
            <span>01 / A STUDY IN GENTLE MOTION</span>
            <button
              className="btn quiet small" type="button"
              onClick={() => setStudyPaused((p) => !p)}
            >
              {studyPaused ? 'Play motion' : 'Pause motion'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Personality ───────────────────────────────────────────── */}
      <section className="section wrap section-personality" id="personality">
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
      <section className="section wrap section-vocabulary" id="vocabulary">
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
            return (
              <PackTile
                key={id} entry={entry}
                footer={(
                  <>
                    <span>Discover the pack</span>
                    <span aria-hidden="true">↗</span>
                  </>
                )}
              />
            );
          })}
        </div>
      </section>

      {/* ── MCP ───────────────────────────────────────────────────── */}
      <section className="section wrap mcp-feature" id="mcp">
        <div>
          <div className="eyebrow">Mote + your AI assistant</div>
          <h2>Describe it.<br />Make it Mote.</h2>
          <p className="lead">
            The shapes, motion, and configuration you know. Available through
            Mote&rsquo;s MCP, so you can work with your AI assistant in words.
          </p>
          <a className="btn dark" href="/mcp.html">
            Explore Mote MCP<span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <McpDemo />
      </section>

      {/* ── Code ──────────────────────────────────────────────────── */}
      <section className="section wrap" id="code">
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

      {/* ── Companies — wordmarks on a quiet field ───────────── */}
      <section className="section wrap section-companies" id="company">
        <div className="section-heading">
          <div>
            <div className="eyebrow">04 / In good company</div>
            <h2>A little motion,<br />in good company.</h2>
          </div>
          <p className="lead">
            Early teams are already shipping Mote fields behind their products
            — one small layer, every kind of world.
          </p>
        </div>
        <div className="companies">
          <FloatingField
            className="field" packs={[BASE_PACK]}
            mode="drift" set="geo" theme={SITE_LIGHT}
            count={12} size={34} seed={23} depth speed={0.45}
          />
          <ul className="company-grid" ref={bandRef}>
            {visible.map((idx, slot) => {
              const company = COMPANIES[idx];
              if (!company) return null;
              return <SplitFlapCard key={slot} company={company} />;
            })}
          </ul>
        </div>
        <p className="inline-note">
          Illustrative roster — real wordmarks arrive with the first public
          release.
        </p>
      </section>

      {/* ── Close — a gravity field settles into the plum panel ── */}
      <section className="section wrap section-close">
        <div className="callout">
          <FloatingField
            className="field" packs={[BASE_PACK]}
            mode="gravity" set="geo" theme={SITE_DARK}
            count={12} size={44} seed={7} depth
          />
          <div>
            <div className="eyebrow">Start somewhere</div>
            <h2>Find the motion that fits.</h2>
          </div>
          <a className="btn primary" href="/playground.html">
            Open the playground<span className="arrow" aria-hidden="true">↗</span>
          </a>
          <span className="callout-meta" aria-hidden="true">
            GRAVITY · CLICK ANYWHERE TO THROW
          </span>
        </div>
      </section>
    </Layout>
  );
}
