import { useEffect } from 'react';
import { Footer } from './Footer.js';
import { Header } from './Header.js';

/**
 * Page shell. `data-page` on <body> is what the stylesheet's per-page rules
 * key off (`body[data-page=packs] .pack-tile` and friends), so it is set here
 * rather than written into each HTML entry by hand.
 */
export function Layout({
  page,
  title,
  children,
}: {
  page: string;
  title?: string;
  children: React.ReactNode;
}): React.ReactElement {
  useEffect(() => {
    document.body.dataset.page = page;
    if (title) document.title = `${title} — Mote`;
  }, [page, title]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header page={page} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
