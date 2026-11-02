import { FloatingField } from '@usemote/react';
import { BASE_PACK, type ShapeColors, type ShapeDef } from '@usemote/core';
import { CodeBlock } from '../ui/CodeBlock.js';
import { packSurface, type PackEntry } from '../lib/packs.js';

/** Renders one shape at its real aspect ratio, on the pack's own ground. */
function ShapeTile({ shape, colors }: { shape: ShapeDef; colors: ShapeColors }) {
  const box = 72 * Math.min(1.15, shape.scale ?? 1);
  const w = shape.ar >= 1 ? box : box * shape.ar;
  const h = shape.ar >= 1 ? box / shape.ar : box;
  return (
    <li className="shape-cell">
      <div className="shape-art">
        <div
          style={{ width: `${Math.round(w)}px`, height: `${Math.round(h)}px` }}
          dangerouslySetInnerHTML={{
            __html: shape.render(colors, shape.variants?.[0]),
          }}
        />
      </div>
      <div className="shape-cap">
        <span>{shape.label}</span>
        <code>{shape.id}</code>
      </div>
    </li>
  );
}

export function PackDetail({ entry }: { entry: PackEntry }): React.ReactElement {
  const { pack } = entry;
  const themes = Object.keys(pack.themes ?? {});
  const stops = pack.themes?.dark ?? [];
  const demo = pack.demo?.a ?? { mode: 'bob', count: 10, size: 80, seed: 4 };
  // Alternating fill/detail so adjacent tiles do not read as one block.
  const { bg, ink, palette } = packSurface(entry);

  const base = (pack.baseShapes ?? [])
    .map((id) => BASE_PACK.shapes.find((s) => s.id === id))
    .filter((s): s is ShapeDef => s !== undefined);

  return (
    <article className="pack-detail-page">
      <a className="back-link" href="/packs.html">
        <span aria-hidden="true">←</span> All packs
      </a>

      <header className="pack-hero">
        <div className="pack-hero-copy">
          <span className="pack-number">{entry.n} / THEMED PACK</span>
          <h1>{entry.name}</h1>
          <p className="lead">{entry.tagline}</p>
          <p className="muted">{pack.description}</p>

          <dl className="pack-stats">
            <div><dt>Shapes</dt><dd>{pack.shapes.length}</dd></div>
            <div><dt>Themes</dt><dd>{themes.length}</dd></div>
            <div>
              <dt>Primitives</dt>
              <dd>{base.length > 0 ? base.length : '—'}</dd>
            </div>
            <div><dt>Package</dt><dd><code>@usemote/pack-{entry.id}</code></dd></div>
          </dl>
        </div>

        <div className="pack-hero-stage" style={{ background: bg }}>
          <FloatingField
            className="field" packs={[pack]}
            theme="dark" avoid="center" {...demo}
          />
          <div className="pack-hero-label" style={{ color: ink }}>
            <strong style={{
              fontFamily: pack.font?.stack ?? 'var(--display)',
              fontWeight: pack.font?.weight ?? 600,
            }}>
              {entry.name}
            </strong>
            <span>{String(demo.mode ?? 'bob')} · seed {String(demo.seed ?? 4)}</span>
          </div>
        </div>
      </header>

      {/* ── Palette ───────────────────────────────────────────────── */}
      <section className="pack-section">
        <div className="eyebrow">Palette</div>
        <h2>Weighted, not flat.</h2>
        <p className="lead">
          A theme is a list of fill-and-detail pairings, each with a weight.
          The quiet pairing carries the most, so accents stay sparse — that
          weighting is most of why a field reads as designed rather than random.
        </p>

        <div className="theme-rows">
          {themes.map((name) => (
            <div key={name} className="theme-row">
              <span className="theme-name">{name}</span>
              <ul className="stop-list">
                {(pack.themes?.[name] ?? []).map((s, i) => (
                  <li key={`${s.f}-${i}`}>
                    <span className="stop-swatch" style={{ background: s.f }}>
                      <span style={{ background: s.d }} />
                    </span>
                    <code>{s.f}</code>
                    <span className="stop-weight">×{s.w}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {pack.swatches && (
          <div className="swatch-strip" aria-label="Pack palette">
            {pack.swatches.map((c) => (
              <span key={c} title={c} style={{ background: c }} />
            ))}
          </div>
        )}
      </section>

      {/* ── Shapes ────────────────────────────────────────────────── */}
      <section className="pack-section">
        <div className="eyebrow">The shapes</div>
        <h2>All {pack.shapes.length}, at their real proportions.</h2>
        <ul className="shape-grid" style={{ background: bg }}>
          {pack.shapes.map((s, i) => (
            <ShapeTile key={s.id} shape={s} colors={palette[i % palette.length]!} />
          ))}
        </ul>
        <p className="inline-note">
          Use any of these ids in <code className="inline-code">shapes="…"</code>.
          That always wins over <code className="inline-code">set</code>.
        </p>
      </section>

      {/* ── Primitives ────────────────────────────────────────────── */}
      {base.length > 0 && (
        <section className="pack-section">
          <div className="eyebrow">Curated primitives</div>
          <h2>The geometry it was drawn to sit with.</h2>
          <p className="lead">
            This pack names {base.length} of the thirteen base primitives, and
            Mote folds them in automatically — so a field is never only literal
            icons.
          </p>
          <ul className="shape-grid" style={{ background: bg }}>
            {base.map((s, i) => (
              <ShapeTile key={s.id} shape={s} colors={palette[i % palette.length]!} />
            ))}
          </ul>
        </section>
      )}

      {/* ── Typeface ──────────────────────────────────────────────── */}
      {pack.font && (
        <section className="pack-section">
          <div className="eyebrow">Typeface</div>
          <h2>{pack.font.name}</h2>
          <p className="lead">
            Shapes that carry text — tags, scores, keycaps — set in{' '}
            {pack.font.name} at weight {pack.font.weight}, with a real fallback
            stack so an unloaded face degrades rather than breaks.
          </p>
          <p className="type-specimen" style={{
            fontFamily: pack.font.stack,
            fontWeight: pack.font.weight,
          }}>
            {entry.name} — ABCDEFGHIJKLM 0123456789
          </p>
        </section>
      )}

      {/* ── Use it ────────────────────────────────────────────────── */}
      <section className="pack-section">
        <div className="eyebrow">Use it</div>
        <h2>Two lines.</h2>
        <CodeBlock
          id={`code-${entry.id}`}
          label={`React · ${entry.name}`}
          code={`import { FloatingField } from '@usemote/react';
import { ${entry.id} } from '@usemote/pack-${entry.id}';

<section style={{ position: 'relative', overflow: 'hidden' }}>
  <FloatingField
    packs={[${entry.id}]}
    mode="${String(demo.mode ?? 'bob')}"
    count={${String(demo.count ?? 10)}}
    size={${String(demo.size ?? 80)}}
    avoid="center"
  />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>`}
        />
        <p className="inline-note">
          Pre-release — <code className="inline-code">@usemote/pack-{entry.id}</code> is
          not on npm yet.
        </p>
      </section>
    </article>
  );
}
