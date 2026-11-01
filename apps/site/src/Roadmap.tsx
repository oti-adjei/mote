/** Public roadmap — what is shipped, what is next, and what is ruled out. */
import { FloatingField } from '@usemote/react';
import { BASE_PACK } from '@usemote/core';
import { NOT_DOING, ROADMAP, STAGE_META, UPDATED } from './roadmap-data.js';

export function Roadmap(): React.ReactElement {
  const counts = ROADMAP.map((g) => `${g.items.length} ${g.label.toLowerCase()}`).join(' · ');

  return (
    <section id="roadmap">
      <div className="section-head">
        <h2>Roadmap</h2>
        <span className="meta">UPDATED {UPDATED.toUpperCase()} · {counts.toUpperCase()}</span>
      </div>

      <div className="rm-intro">
        <p className="lede">
          Mote is built in the open and this page is the honest version — including
          what is unfinished, what was deliberately dropped, and what is only being
          considered. There are no dates, because there is no team and no deadline.
        </p>
        <div className="rm-banner">
          <FloatingField
            packs={[BASE_PACK]} mode="drift" set="geo" theme="mono"
            count={16} size={38} seed={7} depth speed={0.6}
          />
          <span>Nothing here is on npm yet.</span>
        </div>
      </div>

      <div className="rm-stages">
        {ROADMAP.map((group) => {
          const meta = STAGE_META[group.stage];
          return (
            <section key={group.stage} className="rm-stage" aria-labelledby={`rm-${group.stage}`}>
              <header className="rm-stage-head">
                <h3 id={`rm-${group.stage}`}>
                  <span className="rm-dot" style={{ background: meta.dot }} aria-hidden="true" />
                  {group.label}
                </h3>
                <p>{group.note}</p>
              </header>

              <ol className="rm-items">
                {group.items.map((item) => (
                  <li key={item.title} className="rm-card">
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>

                    {item.facts && (
                      <ul className="rm-facts">
                        {item.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    )}

                    {item.caveat && (
                      <p className="rm-caveat">
                        <span aria-hidden="true">※</span> {item.caveat}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <div className="rm-no">
        <h3>Not doing</h3>
        <p className="lede" style={{ marginBottom: 18 }}>
          Saying no in public is part of a roadmap. Each of these was considered
          properly and ruled out.
        </p>
        <dl>
          {NOT_DOING.map((n) => (
            <div key={n.title}>
              <dt>{n.title}</dt>
              <dd>{n.why}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
