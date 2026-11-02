import { FloatingField } from '@usemote/react';
import { Layout } from '../shell/Layout.js';
import { PACKS, TOTAL_SHAPES, packSurface } from '../lib/packs.js';
import { PRINCIPLES, QUESTIONS, TIERS } from '../lib/pro.js';

export function Pro(): React.ReactElement {
  return (
    <Layout page="pro" title="Pro">
      <section className="page-intro wrap">
        <div className="eyebrow">A proposal, not a product</div>
        <h1>The code is free.<br />The drawings might not be.</h1>
        <p className="lead">
          Mote's engine is MIT and always will be. The open question is whether
          the nine shape packs — the part that is illustration work rather than
          code — eventually sit behind a one-off payment.
        </p>
        <p className="notice" style={{ marginTop: 24 }}>
          <strong>Nothing here is live.</strong> No package is published, there
          is no checkout, and no price has been set. This page exists so the
          idea can be judged before it is built.
        </p>
      </section>

      {/* ── Tiers ─────────────────────────────────────────────────── */}
      <div className="wrap">
        <div className="tier-pair">
          {TIERS.map((tier) => (
            <article key={tier.name} className={`tier${tier.featured ? ' featured' : ''}`}>
              <header>
                <span className="pack-number">{tier.name.toUpperCase()}</span>
                <p className="tier-price">
                  {tier.price}
                  <span>{tier.priceNote}</span>
                </p>
                <p className="tier-summary">{tier.summary}</p>
              </header>
              <ul className="tier-list">
                {tier.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <a
                className={`btn ${tier.featured ? 'primary' : 'quiet'}`}
                href={tier.cta.href}
              >
                {tier.cta.label}
                <span className="arrow" aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* ── What Pro would contain ────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">What it would be</div>
            <h2>Eight worlds.<br />121 drawings.</h2>
          </div>
          <p className="lead">
            Esports stays open, so the free tier is a complete product rather
            than a teaser. These are the eight that would move — {TOTAL_SHAPES}{' '}
            shapes in total across the library.
          </p>
        </div>

        <div className="pro-pack-grid">
          {PACKS.filter((p) => p.id !== 'esports').map((p) => {
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

      {/* ── Principles ────────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">If it happens</div>
            <h2>The rules it<br />would follow.</h2>
          </div>
          <p className="lead">
            Written down first, so they are harder to quietly abandon later.
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
            <div className="eyebrow">Have a view?</div>
            <h2>Tell me before it ships.</h2>
          </div>
          <a className="btn primary" href="/roadmap.html">
            See the roadmap<span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}
