import { Layout } from '../shell/Layout.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import { TOTAL_SHAPES } from '../lib/packs.js';

const SECTIONS = [
  ['status', 'Where things stand'],
  ['start', 'Your first field'],
  ['props', 'The controls that matter'],
  ['packs', 'One engine. Your vocabulary.'],
  ['frames', 'Frames are content, too.'],
  ['motion', 'Motion should know when to stop.'],
  ['authoring', 'Writing your own pack'],
] as const;

const PROPS: Array<[string, string, string]> = [
  ['mode', 'static · bob · hop · drift · across · bounce · gravity', 'drift'],
  ['set', 'mixed · geo · objects', 'mixed'],
  ['shapes', 'Explicit ids. Always wins over set.', '—'],
  ['packs', 'The packs to draw from.', 'base'],
  ['count', '1–200. Warns above 60.', '18'],
  ['size', 'Base px for the larger axis.', '64'],
  ['seed', 'Number or string. Same seed, same layout, forever.', '1'],
  ['theme', 'A pack theme name, or your own stops.', 'dark'],
  ['depth', 'Far shapes smaller, slower, blurred.', 'false'],
  ['avoid', 'none · center · top · bottom, or a rect.', 'none'],
  ['speed', '0–3. Zero freezes without unmounting.', '1'],
  ['interactive', 'Respond to the cursor.', 'true'],
  ['media', 'Photos, GIFs or video, placed once each.', '—'],
];

export function Docs(): React.ReactElement {
  return (
    <Layout page="docs" title="A clear place to begin">
      <section className="page-intro wrap">
        <div className="eyebrow">Documentation</div>
        <h1>A clear place<br />to begin.</h1>
        <p className="lead">
          Mote fills the space behind your content with designed shapes and
          gentle motion. Everything below is the real API.
        </p>
      </section>

      <div className="wrap docs-layout">
        <nav className="docs-nav" aria-label="On this page">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>

        <div>
          <section className="doc-section" id="status">
            <h2>Built. Not published yet.</h2>
            <p className="notice">
              <strong>Pre-release.</strong> Everything described here is built
              and tested, but no package is on npm and the repository is not
              public. The install commands below are what they <em>will</em> be.
            </p>
          </section>

          <section className="doc-section" id="start">
            <h2>Your first field.</h2>
            <p>
              A field is a layer. It fills its nearest positioned ancestor and
              sits behind your content.
            </p>
            <CodeBlock
              id="doc-install" label="Install"
              code={`pnpm add @usemote/core @usemote/react`}
            />
            <CodeBlock
              id="doc-first" label="React"
              code={`import { FloatingField } from '@usemote/react';

<section style={{ position: 'relative', overflow: 'hidden' }}>
  <FloatingField mode="bob" set="geo" count={12} avoid="center" depth />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>`}
            />
            <h3>The one thing to get right</h3>
            <p>
              Two rules, and they are the only things people reliably get
              wrong. The parent needs{' '}
              <code className="inline-code">position: relative</code>, or the
              field escapes to the nearest ancestor that has one. And content
              above it needs <code className="inline-code">position: relative</code>{' '}
              too, or the shapes cover it.
            </p>
          </section>

          <section className="doc-section" id="props">
            <h2>The controls that matter.</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Prop</th><th>Values</th><th>Default</th></tr>
                </thead>
                <tbody>
                  {PROPS.map(([name, values, def]) => (
                    <tr key={name}>
                      <td><code>{name}</code></td>
                      <td>{values}</td>
                      <td><code>{def}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>Determinism is a promise</h3>
            <p>
              The same seed produces the same layout, byte for byte, forever.
              That is what makes a field safe to render on the server and
              stable in a screenshot. Do not generate a random seed per
              render — use a stable string.
            </p>
          </section>

          <section className="doc-section" id="packs">
            <h2>One engine. Your vocabulary.</h2>
            <p>
              Nine themed packs, {TOTAL_SHAPES} shapes. Each brings its own
              objects, palette, typeface and a curated set of geometric
              primitives that Mote folds in automatically.
            </p>
            <CodeBlock
              id="doc-pack" label="Using a pack"
              code={`import { fintech } from '@usemote/pack-fintech';

<FloatingField packs={[fintech]} set="objects" count={10} theme="dark" />`}
            />
            <h3>Layering stays simple</h3>
            <p>
              Depth comes from stacking two fields, not a new API. They share
              one animation loop, so the layers stay in phase.
            </p>
            <CodeBlock
              id="doc-layer" label="Two fields"
              code={`<FloatingField set="geo" theme="mono" count={34} size={38} depth />
<FloatingField packs={[esports]} mode="bob" count={5} size={92} avoid="center" />`}
            />
          </section>

          <section className="doc-section" id="frames">
            <h2>Frames are content, too.</h2>
            <p>
              A particle does not have to be a drawn shape. Photos, GIFs and
              video float in the field exactly like geometry. Media is passed
              separately from the shape pool, because it is singular — you want{' '}
              <em>this</em> portrait, once, on the right.
            </p>
            <CodeBlock
              id="doc-media" label="Media particles"
              code={`import { windowShape } from '@usemote/media';

<FloatingField
  packs={[esports]} mode="bob" count={9} avoid="center"
  media={[
    windowShape({ id: 'nova', kind: 'caption', src: '/nova.jpg', place: 'right' }),
    windowShape({ id: 'demo', kind: 'browser', src: '/demo.webm',
                  poster: '/demo.jpg', clip: true, place: 'left' }),
  ]}
/>`}
            />
            <p>
              Large media cannot use <code className="inline-code">avoid</code> —
              a 280px portrait on a 700px hero has no valid position at all.
              It is anchored with <code className="inline-code">place</code> instead.
            </p>
          </section>

          <section className="doc-section" id="motion">
            <h2>Motion should know when to stop.</h2>
            <p>
              You do not have to handle any of this. It is the default.
            </p>
            <details>
              <summary>Reduced motion</summary>
              <p>
                With <code className="inline-code">prefers-reduced-motion: reduce</code>,
                a field renders a still frame and starts no animation loop at
                all. Video never begins playing and stays on its poster.
              </p>
            </details>
            <details>
              <summary>Offscreen and hidden tabs</summary>
              <p>
                Fields stop ticking when scrolled out of view or when the tab
                is hidden, and media playback follows visibility.
              </p>
            </details>
            <details>
              <summary>Assistive technology</summary>
              <p>
                The layer is <code className="inline-code">aria-hidden</code> and{' '}
                <code className="inline-code">pointer-events: none</code>. It is
                decoration, and it never swallows a click or appears in the tab
                order.
              </p>
            </details>
            <h3>Let the content lead</h3>
            <p>
              Do not raise <code className="inline-code">count</code> to fill a
              large area — raise <code className="inline-code">size</code>. The
              budget is about node count, not coverage.
            </p>
          </section>

          <section className="doc-section" id="authoring">
            <h2>Writing your own pack.</h2>
            <p>
              A pack is one file of plain data and pure functions. No build
              step, no registration, no changes to Mote itself.
            </p>
            <CodeBlock
              id="doc-author" label="A minimal pack"
              code={`import type { ShapePack } from '@usemote/core';

export const myPack: ShapePack = {
  id: 'my-pack', name: 'My Pack', version: '0.1.0',
  shapes: [{
    id: 'terminal', label: 'Terminal', kind: 'obj', ar: 1.4,
    render: (c) => \`<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg"
      style="display:block;width:100%;height:100%">
      <rect width="140" height="100" rx="12" fill="\${c.f}"/>
      <path d="M26 44l14 12-14 12" stroke="\${c.d}" stroke-width="8" fill="none"/>
    </svg>\`,
  }],
  themes: { dark: [{ f: '#7dd3fc', d: '#0c0a09', w: 3 }] },
};`}
            />
            <h3>The rules</h3>
            <p>
              Use <code className="inline-code">c.f</code> and{' '}
              <code className="inline-code">c.d</code> — hardcoded colours ignore
              themes. One viewBox, no fixed size on the root{' '}
              <code className="inline-code">&lt;svg&gt;</code>. No ids, no{' '}
              <code className="inline-code">&lt;style&gt;</code>, no external
              references: a shape is inlined many times over. Declare the aspect
              ratio honestly. And never reorder a published pack — that changes
              every existing seed.
            </p>
            <p>
              <code className="inline-code">validatePack(pack)</code> checks all
              of it.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
