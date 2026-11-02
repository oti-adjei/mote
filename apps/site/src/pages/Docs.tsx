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
  ['custom-motion', 'Writing your own motion'],
  ['determinism', 'Seeds and determinism'],
  ['recipes', 'Recipes'],
  ['sdk', 'Every way to install it'],
  ['troubleshooting', 'When it looks wrong'],
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

          <section className="doc-section" id="custom-motion">
            <h2>Writing your own motion.</h2>
            <p>
              <code className="inline-code">mode</code> accepts a preset object
              as well as a name. A preset is two functions: one that seeds a
              particle, and one that moves it.
            </p>
            <CodeBlock
              id="doc-motion" label="A custom preset"
              code={`import type { MotionPreset } from '@usemote/core';

const sink: MotionPreset = {
  id: 'sink',
  init: (p, _ctx, rand) => { p.state.rate = 10 + rand() * 20; },
  step: (p, ctx, dt) => {
    p.y += (p.state.rate ?? 10) * dt;
    if (p.y - p.h > ctx.height) p.y = -p.h;
  },
};

<FloatingField mode={sink} count={20} />`}
            />
            <h3>Three rules</h3>
            <p>
              Write <code className="inline-code">transform</code> and{' '}
              <code className="inline-code">opacity</code> only — anything that
              triggers layout will cost you the frame budget.
            </p>
            <p>
              Use <code className="inline-code">p.phase</code>. It is a seeded
              value between 0 and 1, spread evenly across the field, and it is
              what stops every shape moving in lockstep. A field without it
              reads as a chorus line.
            </p>
            <p>
              <strong>Frame 0 must be visible.</strong> It is what the server
              renders and what a reduced-motion visitor sees, and for them no
              step ever runs. A preset that parks its particles off-screen at
              init shows those people an empty background. The built-in{' '}
              <code className="inline-code">gravity</code> preset shipped with
              exactly that bug once.
            </p>
            <p>
              Memoise the object, or the field rebuilds on every render.
            </p>
          </section>

          <section className="doc-section" id="determinism">
            <h2>Seeds and determinism.</h2>
            <p>
              The same seed produces the same layout — the same shapes, in the
              same places, at the same sizes — byte for byte, forever. That is
              what lets a field render on the server and hydrate without a
              mismatch, and what makes a screenshot reproducible.
            </p>
            <h3>Use a stable seed</h3>
            <p>
              A user id, a slug, a page name. Anything that does not change
              between renders.
            </p>
            <CodeBlock
              id="doc-seed" label="Stable"
              code={`<FloatingField seed={post.slug} />        // same post, same field
<FloatingField seed="pricing-hero" />    // same page, same field`}
            />
            <p>
              Do <strong>not</strong> call{' '}
              <code className="inline-code">Math.random()</code> in render. The
              field would differ between the server and the client, and change
              on every re-render.
            </p>
            <h3>When you do want a new one</h3>
            <p>
              <code className="inline-code">randomSeed()</code> is for picking
              a different field, not for varying an existing one. Hold the
              result in state.
            </p>
            <CodeBlock
              id="doc-random" label="Shuffling"
              code={`import { randomSeed } from '@usemote/core';

const [seed, setSeed] = useState(1);

<FloatingField seed={seed} />
<button onClick={() => setSeed(randomSeed())}>Shuffle</button>`}
            />
            <h3>What a version bump can change</h3>
            <p>
              Adding a shape to a pack is a minor version and leaves existing
              seeds alone. Reordering or removing one changes every layout
              that has ever used that pack, so it is a major version. The
              frame-0 snapshots in the repository are that promise, and CI
              fails if they move.
            </p>
          </section>

          <section className="doc-section" id="recipes">
            <h2>Recipes.</h2>
            <h3>A hero that keeps its headline legible</h3>
            <p>
              <code className="inline-code">avoid</code> is a layout-time
              guarantee. <code className="inline-code">static</code>,{' '}
              <code className="inline-code">bob</code> and{' '}
              <code className="inline-code">hop</code> hold their positions, so
              the region stays clear. The travelling presets —{' '}
              <code className="inline-code">drift</code>,{' '}
              <code className="inline-code">across</code>,{' '}
              <code className="inline-code">bounce</code>,{' '}
              <code className="inline-code">gravity</code> — wander back into
              it as they move.
            </p>
            <CodeBlock
              id="doc-hero" label="Hero"
              code={`<FloatingField mode="bob" set="geo" count={18} avoid="center" depth />`}
            />
            <h3>A quiet background behind body text</h3>
            <CodeBlock
              id="doc-quiet" label="Quiet"
              code={`<FloatingField mode="drift" set="geo" count={14} size={40}
                speed={0.5} depth />`}
            />
            <h3>Depth, with a travelling layer</h3>
            <p>
              Two fields. The travelling one stays small and distant; the one
              carrying the large shapes uses a preset that respects{' '}
              <code className="inline-code">avoid</code>.
            </p>
            <CodeBlock
              id="doc-depth" label="Layered"
              code={`<FloatingField mode="drift" set="geo" theme="mono" count={34}
                size={38} depth speed={0.7} />
<FloatingField packs={[esports]} mode="bob" count={5} size={92}
                avoid="center" />`}
            />
            <h3>An empty state</h3>
            <CodeBlock
              id="doc-empty" label="Empty state"
              code={`<FloatingField mode="static" count={8} size={44} speed={0} />`}
            />
          </section>

          <section className="doc-section" id="sdk">
            <h2>Every way to install it.</h2>
            <p>
              One engine, five ways in. They all render the same field from the
              same seed.
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>If you use</th><th>Install</th><th>Import</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>React, Next</td>
                    <td><code>@usemote/core @usemote/react</code></td>
                    <td><code>{'{ FloatingField }'}</code></td>
                  </tr>
                  <tr>
                    <td>Vue, Nuxt</td>
                    <td><code>@usemote/core @usemote/vue</code></td>
                    <td><code>{'{ FloatingField }'}</code></td>
                  </tr>
                  <tr>
                    <td>Svelte, SvelteKit</td>
                    <td><code>@usemote/core @usemote/svelte</code></td>
                    <td><code>{'use:floatingField'}</code></td>
                  </tr>
                  <tr>
                    <td>Plain HTML, Astro, Webflow</td>
                    <td><code>script tag</code></td>
                    <td><code>{'<floating-field>'}</code></td>
                  </tr>
                  <tr>
                    <td>Anything else</td>
                    <td><code>@usemote/core</code></td>
                    <td><code>createField(el, opts)</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>No build step at all</h3>
            <CodeBlock
              id="doc-cdn" label="Web component"
              code={`<script src="https://cdn.jsdelivr.net/npm/@usemote/web-component"></script>

<section style="position:relative;overflow:hidden">
  <floating-field pack="esports" mode="bob" count="10" avoid="center" depth>
  </floating-field>
  <h1 style="position:relative">Your headline</h1>
</section>`}
            />
            <h3>Vendored source you own</h3>
            <p>
              The shadcn registry copies the component into your project
              instead of adding a dependency, so you can edit the motion.
            </p>
            <CodeBlock
              id="doc-shadcn" label="shadcn"
              code={`pnpm dlx shadcn@latest add oti-adjei/mote/floating-field`}
            />
            <h3>For coding agents</h3>
            <p>
              An MCP server exposes the pack catalogue, the presets and a
              snippet generator, so an agent writes a correct field instead of
              guessing at the API.
            </p>
            <CodeBlock
              id="doc-mcp" label="MCP"
              code={`{
  "mcpServers": {
    "mote": { "command": "npx", "args": ["-y", "@usemote/mcp"] }
  }
}`}
            />
          </section>

          <section className="doc-section" id="troubleshooting">
            <h2>When it looks wrong.</h2>
            <details>
              <summary>The shapes are covering my content</summary>
              <p>
                Give the content <code className="inline-code">position: relative</code>.
                The field is absolutely positioned, so anything in normal flow
                sits beneath it regardless of document order.
              </p>
            </details>
            <details>
              <summary>The field filled the whole page</summary>
              <p>
                Its parent has no <code className="inline-code">position</code>,
                so it escaped to the nearest ancestor that does. Add{' '}
                <code className="inline-code">position: relative</code> to the
                section it belongs to.
              </p>
            </details>
            <details>
              <summary>Shapes drift over my headline</summary>
              <p>
                <code className="inline-code">avoid</code> holds at layout time.
                A travelling preset wanders back in. Use{' '}
                <code className="inline-code">bob</code>,{' '}
                <code className="inline-code">static</code> or{' '}
                <code className="inline-code">hop</code> for the layer that has
                to keep clear, and put the travelling one behind it.
              </p>
            </details>
            <details>
              <summary>Nothing moves</summary>
              <p>
                Check <code className="inline-code">prefers-reduced-motion</code>.
                A still field is the correct behaviour there. Also check that{' '}
                <code className="inline-code">speed</code> is not 0 and the
                section is actually on screen — offscreen fields stop ticking.
              </p>
            </details>
            <details>
              <summary>It looks different on the server and the client</summary>
              <p>
                Something in the configuration is not stable. A{' '}
                <code className="inline-code">Math.random()</code> seed, a{' '}
                <code className="inline-code">Date.now()</code>, or a preset
                object built inline during render.
              </p>
            </details>
            <details>
              <summary>The page feels heavy</summary>
              <p>
                Lower <code className="inline-code">count</code> before anything
                else — the cost is node count, not coverage. To fill more space,
                raise <code className="inline-code">size</code> instead. Above
                60 shapes you are outside the budget the library is tested at.
              </p>
            </details>
          </section>
        </div>
      </div>
    </Layout>
  );
}
