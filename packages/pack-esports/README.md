# @usemote/pack-esports

Esports shape pack for [Mote](https://mote.hearvie.dev) — 16 objects and four
themes. **1.8 kB** brotlied.

```bash
pnpm add @usemote/core @usemote/pack-esports
```

```tsx
import { esports } from '@usemote/pack-esports';

<FloatingField packs={[esports]} mode="bob" set="objects"
               shapes="controller,trophy,headset" count={6} theme="lime" />
```

## Shapes

`controller` `trophy` `keycap` `crosshair` `cursor` `medal` `headset` `gg`
`score` `live` `dpad` `coin` `joystick` `heart` `ping` `bracket`

`keycap` takes variants: `W` `A` `S` `D`.

## Themes

`dark` `light` `lime` `mono` — built on lime `#d4ff1e`, ink `#121212` and
bone `#f2f2ee`. Each is a *weighted* list of colour stops, not a flat palette:
the quiet pairing carries the most weight so accents stay sparse.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural, and it is a large one. If you need avatars, use Navii.

## License

MIT
