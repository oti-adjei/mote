import { Layout } from '../shell/Layout.js';
import { CodeBlock } from '../ui/CodeBlock.js';

/**
 * Mote MCP — ported from the `moten` design export (mcp.html), with one
 * deliberate upgrade: the export's "setup details are on their way" section
 * was written without repo access. The server exists (`packages/mcp`), so
 * this page shows the real connection config and tool list instead, flagged
 * as pre-release until the package reaches npm.
 */

const PROMPTS: Array<[string, string]> = [
  [
    'A calm introduction',
    `Use Mote to create a gentle drifting background with 14 shapes. Keep the center clear for my headline and use the colors from my design system.`,
  ],
  [
    'A different world',
    `Show me the available Mote packs and help me choose one for a gaming community. Use only packs available through the connected server.`,
  ],
  [
    'A quieter finish',
    `Reduce the motion speed and number of shapes in my Mote background. Keep its existing palette and leave room for the content.`,
  ],
];

const TOOLS: Array<[string, string]> = [
  ['mote_list_packs', 'Packs with shape counts and themes'],
  ['mote_list_shapes', 'Every shape id, for shapes="a,b,c"'],
  ['mote_list_presets', 'Motion presets and when to use each'],
  ['mote_snippet', 'Ready-to-paste React / HTML / core JS'],
  ['mote_explain_field', 'What a config produces, plus engine warnings'],
  ['mote_preview_svg', 'Frame-0 SVG for inspection or an OG image'],
  ['mote_check_pack', 'Static check of pack source against the authoring rules'],
];

const CONNECT = `{
  "mcpServers": {
    "mote": { "command": "npx", "args": ["-y", "@usemote/mcp"] }
  }
}`;

export function Mcp(): React.ReactElement {
  return (
    <Layout page="mcp" title="Your words. A little motion.">
      <section className="page-intro wrap">
        <div className="eyebrow">Mote MCP</div>
        <h1>Your words.<br />A little motion.</h1>
        <p className="lead">
          Use Mote&rsquo;s built features through your AI assistant. Describe the
          background you want, then refine its shapes, appearance, and movement.
        </p>
        <div className="actions">
          <a className="btn primary" href="/playground.html">
            Shape your prompt<span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      {/* ── 01 · What it does ─────────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">01 / A different way in</div>
            <h2>The same Mote.<br />In your own words.</h2>
          </div>
          <p className="lead">
            Mote MCP gives your assistant access to the features already built
            into the library. Planned features remain on the roadmap.
          </p>
        </div>
        <div className="grid three">
          <article>
            <h3>Choose your shapes.</h3>
            <p>
              Ask for a themed pack or start with the default shapes. Tell your
              assistant what the background should feel like.
            </p>
          </article>
          <article>
            <h3>Find the movement.</h3>
            <p>
              Choose a motion behaviour, then refine the speed and density to
              suit your content.
            </p>
          </article>
          <article>
            <h3>Make it belong.</h3>
            <p>
              Describe the colors, size, depth, and space you want to leave
              clear. Keep refining the same idea.
            </p>
          </article>
        </div>
      </section>

      {/* ── 02 · Example prompts ──────────────────────────────────── */}
      <section className="section wrap mcp-examples">
        <div className="eyebrow">02 / Start a conversation</div>
        <h2>A few ways to ask.</h2>
        <p>Example requests for use after connecting Mote MCP.</p>
        {PROMPTS.map(([label, prompt]) => (
          <CodeBlock key={label} label={label} code={prompt} copyLabel="Copy prompt" />
        ))}
      </section>

      {/* ── 03 · Connection ───────────────────────────────────────── */}
      <section className="section wrap" id="setup">
        <div className="section-heading">
          <div>
            <div className="eyebrow">03 / Connection</div>
            <h2>Point your client<br />at the server.</h2>
          </div>
          <div>
            <p className="lead">
              One server, seven tools, no keys. Add this to your client&rsquo;s
              MCP configuration and Mote&rsquo;s packs, presets and snippets are
              a request away.
            </p>
            <p className="inline-note">
              Pre-release: <code className="inline-code">@usemote/mcp</code> is
              not on npm yet — the command above activates at first publish.
              An agent skill covering the same ground ships inside the package.
            </p>
          </div>
        </div>

        <CodeBlock label="MCP client configuration" code={CONNECT} />

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tool</th><th>Does</th></tr>
            </thead>
            <tbody>
              {TOOLS.map(([id, does]) => (
                <tr key={id}><td>{id}</td><td>{does}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="inline-note" style={{ marginTop: 24 }}>
          Until the package is published, explore a configuration in the{' '}
          <a href="/playground.html">playground</a> and copy its AI prompt for
          use once your MCP is connected.
        </p>
      </section>
    </Layout>
  );
}
