# Fonts

The site is designed in **Noi Grotesk** (display) and **Fusion Neue** (body).

## These are not licensed yet

Both were taken from a Framer CDN by the design tool that produced the
mockup. The export's own font manifest says so plainly:

> Commercial reuse rights for Noi Grotesk and Fusion Neue need confirmation.

and its README repeats it:

> Confirm commercial font rights before deployment.

**They are therefore gitignored and are not committed or deployed.** They sit
in `public/fonts/` on the machine that has them, so the site matches the
design locally. A clone without them falls through to the open stack in
`src/styles/tokens.css` and still reads correctly — different typography, same
layout and rhythm.

## Before deploying, pick one

**Licence them.** Noi Grotesk and Fusion Neue are commercial faces. Buy a web
licence, then remove the gitignore entry so they ship.

**Or substitute.** Change two lines in `src/styles/tokens.css`:

```css
--display: 'Schibsted Grotesk', system-ui, sans-serif;  /* SIL OFL */
--body: 'Inter', system-ui, sans-serif;                 /* SIL OFL */
```

Schibsted Grotesk is already the typeface of the esports pack, so it is
consistent with the product rather than an arbitrary pick. Both are open and
free to self-host.

## Pack typefaces are a separate question

Each shape pack names its own display face — Syne, Chakra Petch, Figtree,
Young Serif, JetBrains Mono, Space Grotesk, Manrope, Instrument Serif. Those
are all **open** and loaded from Google Fonts. They are not affected by this.
