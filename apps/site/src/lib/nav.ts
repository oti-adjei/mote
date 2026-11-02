/** Routes. One HTML entry per screen, as the design handoff requires. */
export interface Route {
  href: string;
  label: string;
  page: string;
}

export const ROUTES: Route[] = [
  { href: '/playground.html', label: 'Playground', page: 'playground' },
  { href: '/packs.html', label: 'Packs', page: 'packs' },
  { href: '/examples.html', label: 'Examples', page: 'examples' },
  { href: '/docs.html', label: 'Docs', page: 'docs' },
  { href: '/pro.html', label: 'Pro', page: 'pro' },
];

export const REPO = 'https://github.com/oti-adjei/mote';
export const NAVII = 'https://github.com/uxderrick/navii';
