# @usemote/web-component

`<floating-field>` — [Mote](https://mote.hearvie.dev) with no build step.
Works in plain HTML, Astro, Webflow, Framer, or any framework that renders
HTML. **10.6 kB** brotlied, core and both built-in packs included.

```html
<script src="https://cdn.jsdelivr.net/npm/@usemote/web-component"></script>

<section style="position:relative;overflow:hidden">
  <floating-field pack="esports" mode="bob" set="objects"
                  count="10" size="86" theme="dark" avoid="center" depth>
  </floating-field>
  <h1 style="position:relative">Your headline</h1>
</section>
```

That is the whole install — the script registers the element and both packs.

## Attributes

Attributes map 1:1 onto `FieldOptions`: `mode` `set` `shapes` `pack` `count`
`size` `seed` `theme` `depth` `avoid` `speed` `interactive` `direction`
`paused`. Bare attributes mean true (`depth` = `depth="true"`). Invalid values
fall back to the default rather than throwing — a background should never be
why a page fails to render.

Changing an attribute updates the field live.

## Beyond attributes

```js
import { registerPack, define } from '@usemote/web-component';
registerPack(myPack, 'mine');   // then pack="mine"
define('my-field');             // custom tag name

document.querySelector('floating-field').field.pause();
```

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural, and it is a large one. If you need avatars, use Navii.

## License

MIT
