import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '../lib/nav.js';

/**
 * Site header. The mobile menu is a real disclosure — `aria-expanded` on the
 * button, `aria-current` on the active link — because the design's
 * accessibility semantics are part of the contract, not decoration.
 */
export function Header({ page }: { page: string }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  // Escape closes it, and focus returns somewhere sensible.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="nav wrap">
        <a className="wordmark" href="/index.html" aria-label="Mote home">
          mote<span className="brand-dot" aria-hidden="true" />
        </a>

        <button
          ref={menuRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          className={`nav-links${open ? ' open' : ''}`}
          id="site-nav"
          aria-label="Main navigation"
        >
          {ROUTES.map((r, i) => (
            <a
              key={r.href}
              href={r.href}
              {...(page === r.page ? { 'aria-current': 'page' as const } : {})}
            >
              <span className="nav-num" aria-hidden="true">{i + 1}</span>
              {r.label}
            </a>
          ))}
          {/* Mobile-only: the header CTA lives outside the nav on desktop,
              so the open menu carries its own copy. */}
          <a className="btn mobile-cta" href="/docs.html">
            Get started
          </a>
        </nav>

        <a className="btn header-cta" href="/docs.html">
          Get started
        </a>
      </div>
    </header>
  );
}
