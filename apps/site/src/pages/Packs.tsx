import { FloatingField } from '@usemote/react';
import { BASE_PACK } from '@usemote/core';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Layout } from '../shell/Layout.js';
import { PACKS, TOTAL_SHAPES, byId, packAccent } from '../lib/packs.js';
import { SITE_LIGHT } from '../lib/theme.js';
import { PackDetail } from './PackDetail.js';

/**
 * One pack, on its own tinted card.
 *
 * The card surface is a light wash of the pack's signature accent (the first
 * stop of its light theme) so nine cards read as nine worlds without leaving
 * the site's light style — and the pack's own shapes float in the card
 * itself, still until hover, replacing the old boxed preview.
 */
export function PackTile({ entry, footer }: { entry: (typeof PACKS)[number]; footer?: ReactNode }) {
  const [live, setLive] = useState(false);
  const accent = packAccent(entry.pack);

  return (
    <a
      className="pack-tile pack-tile-live"
      href={`/packs.html?pack=${entry.id}`}
      style={{ '--tint': accent } as CSSProperties}
      onMouseEnter={() => setLive(true)}
      onMouseLeave={() => setLive(false)}
      onFocus={() => setLive(true)}
      onBlur={() => setLive(false)}
    >
      <FloatingField
        className="tile-field" packs={[entry.pack]}
        mode="drift" set="objects" theme="light"
        count={6} size={46} seed={Number(entry.n)}
        paused={!live}
      />
      <span className="pack-number">{entry.n} / THEMED PACK</span>
      <div className="pack-symbol" aria-hidden="true">{entry.symbol}</div>
      <h3>{entry.name}</h3>
      <p>{entry.tagline}</p>
      <p className="small muted" style={{ marginTop: 12 }}>{entry.audience}</p>
      <div className="bottom">
        {footer ?? (
          <>
            <span>{entry.pack.shapes.length} shapes</span>
            <span aria-hidden="true">↗</span>
          </>
        )}
      </div>
    </a>
  );
}

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
            {matches.map((p) => <PackTile key={p.id} entry={p} />)}
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
