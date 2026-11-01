/**
 * The media surface inside a frame: an image, a video, or a placeholder.
 */
import { MONO, R, clamp, hexA } from './util.js';
import type { FrameOptions } from './types.js';

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export const isVideo = (src: string): boolean => VIDEO_EXT.test(src);

/** Minimal escaping for values interpolated into an attribute. */
const attr = (v: string): string =>
  v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function mediaSurface(
  o: FrameOptions,
  mw: number,
  mh: number,
  rad: string,
): string {
  const c = o.c;
  let inner: string;

  if (o.src && isVideo(o.src)) {
    // No `autoplay` attribute, deliberately. Markup has to be identical on
    // the server and the client or hydration mismatches, so playback is
    // started at runtime by the renderer — which simply never starts it
    // under reduced motion or while the field is offscreen.
    //
    // `poster` matters more here than usual: a paused video with no poster
    // is a blank rectangle, which is exactly what a reduced-motion user
    // would be left looking at.
    inner =
      `<video data-mote-media src="${attr(o.src)}"` +
      (o.poster ? ` poster="${attr(o.poster)}"` : '') +
      ` muted loop playsinline preload="metadata" tabindex="-1" aria-hidden="true"` +
      ` style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"></video>`;
  } else if (o.src) {
    inner =
      `<img src="${attr(o.src)}" alt="${attr(o.alt ?? '')}" loading="lazy" decoding="async"` +
      ` style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">`;
  } else {
    // Placeholder: hatching plus, optionally, a shape from the pack. A frame
    // with nothing in it should still look intentional rather than broken.
    const s = R(Math.min(mw, mh) * 0.46);
    inner =
      `<div style="position:absolute;inset:0;background:${c.d};` +
      `background-image:repeating-linear-gradient(135deg,${hexA(c.f, 0.08)} 0 10px,transparent 10px 20px)"></div>` +
      (o.art
        ? `<div style="position:absolute;left:50%;top:50%;width:${s}px;height:${s}px;` +
          `margin:${-s / 2}px 0 0 ${-s / 2}px">${o.art}</div>`
        : '');
  }

  if (o.clip) {
    const bh = Math.max(4, R(mw * 0.014));
    const p = Math.max(8, R(mw * 0.045));
    inner +=
      `<div style="position:absolute;left:${p}px;right:${p}px;bottom:${p}px;height:${bh}px;` +
      `border-radius:${bh}px;background:${hexA(c.f, 0.35)}">` +
      `<div style="width:38%;height:100%;border-radius:${bh}px;background:${c.f}"></div></div>`;
    if (mw >= 300) {
      const fs = clamp(R(mw * 0.032), 10, 12);
      inner +=
        `<div style="position:absolute;left:${p}px;top:${p}px;display:flex;align-items:center;gap:6px;` +
        `background:${c.f};color:${c.d};border-radius:4px;padding:4px 7px;` +
        `font:500 ${fs}px/1 ${MONO};letter-spacing:.08em">` +
        `<span style="width:0;height:0;border-left:${R(fs * 0.7)}px solid ${c.d};` +
        `border-top:${R(fs * 0.42)}px solid transparent;border-bottom:${R(fs * 0.42)}px solid transparent"></span>` +
        `0:24</div>`;
    }
  }

  return (
    `<div style="position:relative;width:${mw}px;height:${mh}px;overflow:hidden;` +
    `border-radius:${rad};background:${c.d}">${inner}</div>`
  );
}
