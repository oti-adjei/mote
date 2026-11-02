# Fonts

The site uses **Schibsted Grotesk** (display) and **Inter** (body). Both are
SIL Open Font Licence, free to use and self-host.

Schibsted is not an arbitrary pick: it is already the esports pack's own
display face, so the site and the product share a voice.

## Why not the fonts it was designed in

The design was drawn in **Noi Grotesk** and **Fusion Neue**. Both were pulled
from a Framer CDN by the tool that produced the mockup, and the export's own
manifest says:

> Commercial reuse rights for Noi Grotesk and Fusion Neue need confirmation.

They were never committed. `.woff2` files under `public/fonts/` are
gitignored, so nothing unlicensed can ship.

**If you licence them later**, swap two lines in `src/styles/tokens.css`:

```css
--display: Noi, 'Schibsted Grotesk', system-ui, sans-serif;
--body: Fusion, Inter, system-ui, sans-serif;
```

and add the `@font-face` blocks back. The layout, rhythm and scale are
unchanged either way — only the letterforms differ.

## Pack typefaces

Each shape pack names its own display face: Syne, Chakra Petch, Figtree,
Young Serif, JetBrains Mono, Space Grotesk, Manrope, Instrument Serif. All
open, all loaded in the same single request from `tokens.css`.
