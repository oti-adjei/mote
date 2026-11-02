import { NAVII, REPO, ROUTES } from '../lib/nav.js';

export function Footer(): React.ReactElement {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <a className="wordmark" href="/index.html" aria-label="Mote home">
              mote<span className="brand-dot" aria-hidden="true" />
            </a>
            <p>A component library for the space behind your content.</p>
            <p className="maker-credit">
              Built by <strong><a href="https://hearvie.dev">George Heavenson</a></strong>.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            {ROUTES.map((r) => (
              <a key={r.href} href={r.href}>{r.label}</a>
            ))}
            <a href="/roadmap.html">Roadmap</a>
            <a href={REPO}>GitHub</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Mote · Pre-release</span>
          <span>
            Architecturally inspired by <a href={NAVII}>Navii</a> by Derrick
            Tsorme — a deterministic avatar engine, and the reason this project
            exists. No code is shared between them.
          </span>
        </div>
      </div>
    </footer>
  );
}
