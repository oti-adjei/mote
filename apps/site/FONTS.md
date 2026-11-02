# Fonts

The site uses **Schibsted Grotesk** (display) and **Inter** (body). Both are
SIL Open Font Licence, free to use and self-host.

Schibsted is not an arbitrary pick: it is already the esports pack's own
display face, so the site and the product share a voice.

## Why not the fonts it was designed in

The design was drawn in **Noi Grotesk** and **Fusion Neue**. Both were pulled
from a Framer CDN by the tool that produced the mockup, whose font manifest
said:

> Commercial reuse rights for Noi Grotesk and Fusion Neue need confirmation.

That sentence is the whole reason this file exists, and it is the only part
of the manifest worth keeping — so this is now the record. Nothing under
`public/fonts/` is committed: not the `.woff2` files, and not the manifest,
which listed direct CDN download URLs for the same unlicensed faces.

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
