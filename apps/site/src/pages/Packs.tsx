import { FloatingField } from '@usemote/react';
import { BASE_PACK } from '@usemote/core';
import { useMemo, useState } from 'react';
import { Layout } from '../shell/Layout.js';
import { PACKS, TOTAL_SHAPES, byId, packSurface } from '../lib/packs.js';
import { SITE_LIGHT } from '../lib/theme.js';
import { PackDetail } from './PackDetail.js';

function useQueryPack(): string | null {
  return useMemo(
    () => new URLSearchParams(window.location.search).get('pack'),
    [],
  );
}

export function Packs(): React.ReactElement {
  const requested = useQueryPack();
  const entry = byId(requested);
  const [q, setQ] = useState('');

  // A ?pack= that does not exist should say so rather than silently
  // showing the directory as though nothing was asked for.
  const unknown = requested !== null && entry === undefined;

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return PACKS;
    return PACKS.filter((p) =>
      [p.name, p.id, p.tagline, p.audience, p.pack.description ?? '']
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  if (entry) {
    return (
      <Layout page="packs" title={entry.name}>
        <div className="wrap">
          <PackDetail entry={entry} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout page="packs" title="A vocabulary for every world">
      <section className="page-intro wrap">
        <div className="eyebrow">Nine themed packs</div>
        <h1>A vocabulary<br />for every world.</h1>
        <p className="lead">
          Each pack is a domain language — its own objects, palette, typeface
          and curated geometry. {TOTAL_SHAPES} shapes in all. Install only the
          ones you use.
        </p>
      </section>

      <div className="wrap">
        {unknown && (
          <p className="notice" role="status">
            <strong>No pack called “{requested}”.</strong> Here are all nine.
          </p>
        )}

        <div className="toolbar">
          <label className="sr-only" htmlFor="pack-search">Search packs</label>
          <input
            id="pack-search"
            className="input"
            type="search"
            placeholder="Search packs — try “finance” or “learning”"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="btn quiet"
            type="button"
            onClick={() => setQ('')}
            disabled={q === ''}
          >
            Clear
          </button>
        </div>

        <p className="small muted" role="status">
          {matches.length === PACKS.length
            ? `Showing all ${PACKS.length} packs`
            : `${matches.length} of ${PACKS.length} packs match “${q}”`}
        </p>

        {matches.length === 0 ? (
          <div className="empty">
            <h3>No packs match that search.</h3>
            <p className="muted">
              Try a broader word, or clear the search to see all nine.
            </p>
          </div>
        ) : (
          <div className="grid three" style={{ marginTop: 32 }}>
            {matches.map((p) => {
              const surface = packSurface(p);
              return (
                <a key={p.id} className="pack-tile" href={`/packs.html?pack=${p.id}`}>
                  <span className="pack-number">{p.n} / THEMED PACK</span>
                  <div className="pack-symbol" aria-hidden="true">{p.symbol}</div>
                  <div
                    className="pack-preview"
                    style={{ background: surface.bg }}
                    aria-hidden="true"
                  >
                    <FloatingField
                      className="field" packs={[p.pack]}
                      mode="bob" set="objects" theme="dark"
                      count={6} size={46} seed={Number(p.n)}
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.tagline}</p>
                  <p className="small muted" style={{ marginTop: 12 }}>
                    {p.audience}
                  </p>
                  <div className="bottom">
                    <span>{p.pack.shapes.length} shapes</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Base pack ─────────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Included with the engine</div>
            <h2>Start with<br />the simple shapes.</h2>
          </div>
          <p className="lead">
            Thirteen geometric primitives ship inside{' '}
            <code className="inline-code">@usemote/core</code>. Every themed
            pack names a handful of them to sit alongside its own objects.
          </p>
        </div>
        <div className="sample-art" style={{ height: 300 }}>
          <FloatingField
            className="field" packs={[BASE_PACK]}
            mode="drift" set="geo" theme={SITE_LIGHT}
            count={26} size={48} seed={5} depth speed={0.7}
          />
        </div>
      </section>
    </Layout>
  );
}
