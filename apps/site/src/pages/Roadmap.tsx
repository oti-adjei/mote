import { Layout } from '../shell/Layout.js';
import { NOT_DOING, ROADMAP, UPDATED } from '../lib/roadmap-data.js';

export function Roadmap(): React.ReactElement {
  return (
    <Layout page="roadmap" title="The honest roadmap">
      <section className="page-intro wrap">
        <div className="eyebrow">Updated {UPDATED}</div>
        <h1>The honest<br />roadmap.</h1>
        <p className="lead">
          Including what is unfinished, what was deliberately dropped, and what
          is only being considered. There are no dates, because there is no
          team and no deadline.
        </p>
        <p className="notice" style={{ marginTop: 24 }}>
          <strong>Nothing here is on npm yet.</strong> Built and tested is not
          the same as published.
        </p>
      </section>

      <div className="wrap">
        {ROADMAP.map((group) => (
          <section className="road-group" key={group.stage} aria-labelledby={`rg-${group.stage}`}>
            <header>
              <span className={`badge${group.stage === 'shipped' ? ' built' : ''}`}>
                {group.label}
              </span>
              <h2 id={`rg-${group.stage}`} style={{ fontSize: 32 }}>{group.label}</h2>
              <p>{group.note}</p>
            </header>

            <div>
              {group.items.map((item) => (
                <article className="road-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  {item.facts && (
                    <ul>
                      {item.facts.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  )}
                  {item.caveat && (
                    <p className="road-caveat">
                      <span aria-hidden="true">※</span> {item.caveat}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="section section-close" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="section-heading">
            <div>
              <div className="eyebrow">Ruled out</div>
              <h2>Also important:<br />what stays out.</h2>
            </div>
            <p className="lead">
              Saying no in public is part of a roadmap. Each of these was
              considered properly and set aside.
            </p>
          </div>
          <div className="grid two">
            {NOT_DOING.map((n) => (
              <details key={n.title}>
                <summary>{n.title}</summary>
                <p>{n.why}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
