import { FloatingField } from '@usemote/react';
import { Layout } from '../shell/Layout.js';
import { PACKS, TOTAL_SHAPES, packSurface } from '../lib/packs.js';
import { CONTACT, PRINCIPLES, PROCESS, QUESTIONS, SCOPE } from '../lib/pro.js';

export function Pro(): React.ReactElement {
  return (
    <Layout page="pro" title="Custom packs">
      <section className="page-intro wrap">
        <div className="eyebrow">Free, permanently</div>
        <h1>All of it is free.<br />Drawings are the<br />part that cost.</h1>
        <p className="lead">
          Everything in the repository is MIT and stays that way — the engine,
          all nine packs, {TOTAL_SHAPES} shapes, the render API. There is no
          tier above it. The one thing you can pay for is a pack that does not
          exist yet: yours, in your own brand.
        </p>
        <p className="notice" style={{ marginTop: 24 }}>
          <strong>No tiers, no licence keys, no checkout.</strong> Nothing on
          this page unlocks anything, because nothing is locked.
        </p>
      </section>

      {/* ── Free versus drawn ─────────────────────────────────────── */}
      <div className="wrap">
        <div className="tier-pair">
          {SCOPE.map((card) => (
            <article key={card.name} className={`tier${card.featured ? ' featured' : ''}`}>
              <header>
                <span className="pack-number">{card.name.toUpperCase()}</span>
                <p className="tier-price">
                  {card.heading}
                  <span>{card.note}</span>
                </p>
                <p className="tier-summary">{card.summary}</p>
              </header>
              <ul className="tier-list">
                {card.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <a
                className={`btn ${card.featured ? 'primary' : 'quiet'}`}
                href={card.cta.href}
              >
                {card.cta.label}
                <span className="arrow" aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* ── What a pack is ────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">The reference</div>
            <h2>Nine of these<br />already exist.</h2>
          </div>
          <p className="lead">
            Each one is around fifteen drawings, a palette as named themes, a
            display typeface and a curated set of primitives. A commissioned
            pack is this, for your product — and all nine of these stay free
            whether anyone commissions anything or not.
          </p>
        </div>

        <div className="pro-pack-grid">
          {PACKS.map((p) => {
            const surface = packSurface(p);
            return (
              <a key={p.id} className="pro-pack" href={`/packs.html?pack=${p.id}`}>
                <div className="pro-pack-art" style={{ background: surface.bg }}>
                  <FloatingField
                    className="field" packs={[p.pack]}
                    mode="bob" set="objects" theme="dark"
                    count={5} size={42} seed={Number(p.n)}
                  />
                </div>
                <div className="pro-pack-meta">
                  <h3>{p.name}</h3>
                  <span>{p.pack.shapes.length} shapes</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── How a commission works ────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">How it works</div>
            <h2>Four steps,<br />no funnel.</h2>
          </div>
          <p className="lead">
            A quote comes before any drawing, so the decision is made with a
            real number rather than a published guess.
          </p>
        </div>
        <ol className="process">
          {PROCESS.map((item) => (
            <li key={item.step} className="process-step">
              <span className="pack-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Principles ────────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">The rules</div>
            <h2>Written down,<br />so they stick.</h2>
          </div>
          <p className="lead">
            These are commitments about what will never be taken away, which
            is the only kind worth publishing.
          </p>
        </div>
        <div className="grid two">
          {PRINCIPLES.map((p) => (
            <article key={p.title} className="principle">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Questions ─────────────────────────────────────────────── */}
      <section className="section wrap section-close">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Fair questions</div>
            <h2>Including the<br />awkward ones.</h2>
          </div>
        </div>
        <div>
          {QUESTIONS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <div className="callout" style={{ marginTop: 48 }}>
          <div>
            <div className="eyebrow">Want a pack in your own brand?</div>
            <h2>Get in touch.</h2>
          </div>
          <a className="btn primary" href={CONTACT.href}>
            {CONTACT.label}<span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}
