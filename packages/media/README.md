# @usemote/media

Window frames and media particles for [Mote](https://mote.hearvie.dev) — photos,
GIFs and video that float with the shapes. **5.1 kB** brotlied.

```bash
pnpm add @usemote/core @usemote/media
```

```tsx
import { FloatingField } from '@usemote/react';
import { windowShape } from '@usemote/media';
import { esports } from '@usemote/pack-esports';

<section style={{ position: 'relative', overflow: 'hidden' }}>
  <FloatingField
    packs={[esports]} mode="bob" count={9} avoid="center" depth
    media={[
      windowShape({ id: 'nova', kind: 'caption', src: '/nova.jpg', place: 'right' }),
      windowShape({ id: 'demo', kind: 'browser', src: '/demo.webm',
                    poster: '/demo.jpg', clip: true, place: 'left' }),
    ]}
  />
  <h1 style={{ position: 'relative' }}>Your headline</h1>
</section>
```

## A particle doesn't have to be a shape

Mote's renderer only ever assigns a shape's markup as the particle's contents,
so a framed photo participates in the field exactly like a drawn shape: same
layout, same depth, same motion presets, same scheduler.

## `media`, not `packs`

Media is **singular** — you want *this* portrait, once, on the right. Shapes in
a pack are drawn from a pool, where the seed decides how often each appears or
whether it appears at all. So media is passed as `media={[…]}`: each item is
rendered exactly once, in addition to the `count` shapes.

## `place`, not `avoid`

`avoid` is rejection-based and assumes shapes small enough to tuck around a
region. Media is large: a 280px portrait on a 700px hero has *no* valid
position, so avoidance simply fails. Media is anchored instead —
`left` `right` `top` `bottom` `top-left` `top-right` `bottom-left`
`bottom-right` `center` — with a margin kept from the field edge so a frame
reads as placed rather than clipped.

## 13 frame kinds

`browser` `app` `bare` `caption` `phone` `monitor` `polaroid` `stream`
`post` `circle` `message` `slide` `ticket`

Each takes two colours from the active pack theme, so frames inherit whatever
pack they sit in.

### Chrome drops detail, it doesn't shrink

A frame in a field can be any size, and chrome that merely scales turns to
mush. Each tier removes detail instead:

| Tier | Width | Behaviour |
|---|---|---|
| Small | `<270px` | Controls merge into one capsule. No text, no side rail. |
| Medium | `270–339` | Three tonal dots, title as a bar, empty URL pill. |
| Large | `340+` | Real URL and title text, play chip on clips. |

Frames build at the particle's **actual** width, so the tier is always right.

## Video, poster and reduced motion

A video is emitted **without an `autoplay` attribute**, deliberately. Markup
must be byte-identical on the server and the client or hydration mismatches,
so playback is a runtime decision made by the renderer:

- `prefers-reduced-motion: reduce` → never started. The poster frame is what
  the user sees, which is why **`poster` is strongly recommended** — a paused
  video without one is a blank rectangle.
- Offscreen (via `IntersectionObserver`) → paused.
- Field paused or destroyed → paused, and decoders released.
- A refused autoplay is swallowed; the poster is a fine outcome.

Video is `muted`, `loop`, `playsinline`, `preload="metadata"`, and kept out of
the tab order.

## Frames are scene objects, not UI

No hover states, no buttons, nothing focusable or clickable. The layer is
`aria-hidden` and `pointer-events: none`. Images are `loading="lazy"` and
decorative by default; pass `alt` if an image carries meaning.

## Placeholders

A frame with no `src` renders hatching, optionally with a shape from the pack
via `art`, so an empty frame still looks intentional rather than broken.

## Known limit

Frames are HTML, not SVG, so they render through the DOM renderer only.
`renderFieldSVG()` — the static export for OG images — cannot include them.

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)**. The frame designs are by
Mote's own designer.

## License

MIT
