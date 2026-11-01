/**
 * @usemote/media — window frames and media particles for Mote.
 *
 * A particle does not have to be a drawn shape. The renderer only ever
 * assigns a shape's markup as the particle's contents, so a photo, a GIF or a
 * framed video participates in the field exactly like any geometric shape:
 * same layout, same depth, same motion presets, same scheduler.
 *
 * ```ts
 * import { windowShape } from '@usemote/media';
 *
 * <FloatingField
 *   packs={[esports]} mode="bob" count={10}
 *   media={[
 *     windowShape({ id: 'nova', kind: 'caption', src: '/nova.jpg', place: 'right', scale: 3.4 }),
 *     windowShape({ id: 'demo', kind: 'browser', src: '/demo.webm', poster: '/demo.jpg', clip: true, place: 'bottom-left' }),
 *   ]}
 * />
 * ```
 */
import { frame, KINDS, SCALE } from './frames.js';
import { isVideo } from './media.js';
import { tier } from './util.js';
import type { Anchor, ShapeColors, ShapeDef } from '@usemote/core';
import type { FrameKind, FrameOptions, MediaSource } from './types.js';

export interface WindowShapeOptions extends MediaSource {
  /** Unique id, as for any shape. */
  id: string;
  /** Human label, shown in pickers. Defaults to the id. */
  label?: string;
  kind?: FrameKind;
  /** Aspect ratio of the media area. Ignored by kinds with a fixed shape. */
  ratio?: [number, number];
  /** Where to anchor it. Media is too large for `avoid` to place. */
  place?: Anchor;
  /**
   * Size multiplier on the field's `size`. Frames want to be much larger than
   * shapes, so this defaults to 3 rather than 1.
   */
  scale?: number;
  /** Pack id, selecting the chrome copy (`localhost:3000` vs `app.ledger.io`). */
  pack?: string;
  font?: string;
  /** Index into the pack's caption list, so sibling frames read differently. */
  idx?: number;
  /** `bare` only: drop the outline ring. */
  ring?: boolean;
}

/**
 * Width used only to measure the frame's aspect ratio. Chosen mid-range, so
 * the clamped parts of the chrome (a caption strip is held between 30 and
 * 46px) are proportionally closest to typical use.
 */
const PROBE_W = 320;

/**
 * Wraps a frame as a `ShapeDef`, so it can be passed to `media` on a field.
 *
 * `ar` is measured by building the frame once at a reference width: chrome is
 * not a fixed fraction of the media area — a caption strip is clamped between
 * 30 and 46px — so the only honest aspect ratio is the one the builder
 * actually produces. Layout uses `ar` for spacing and collision, so guessing
 * it would make frames crowd their neighbours.
 */
export function windowShape(o: WindowShapeOptions): ShapeDef {
  const kind: FrameKind = o.kind ?? 'browser';
  const probeColors: ShapeColors = { f: '#000000', d: '#ffffff' };
  const probe = frame({
    ...o,
    kind,
    w: PROBE_W,
    c: probeColors,
  } as FrameOptions);
  const ar = PROBE_W / probe.h;

  const def: ShapeDef = {
    id: o.id,
    label: o.label ?? o.id,
    kind: 'obj',
    ar,
    scale: (o.scale ?? 3) * (SCALE[kind] ?? 1),
    /**
     * Builds at the particle's real width, not a reference one, so chrome
     * picks the right tier — a 240px frame merges its controls into a single
     * capsule, a 420px one shows a URL. Building at a fixed width and scaling
     * would both overflow the particle box and freeze the chrome at one tier.
     */
    render: (c: ShapeColors, _variant?: string, width?: number) =>
      frame({ ...o, kind, w: width ?? PROBE_W, c } as FrameOptions).html,
  };

  return o.place === undefined ? def : { ...def, place: o.place };
}

/** A photo or GIF with no chrome at all. Shorthand for `kind: 'bare'`. */
export function image(
  o: Omit<WindowShapeOptions, 'kind'> & { src: string },
): ShapeDef {
  return windowShape({ ...o, kind: 'bare' });
}

/**
 * A video with no chrome. Playback is started by the renderer, never by an
 * `autoplay` attribute, so reduced motion and offscreen fields stay on the
 * poster frame.
 */
export function video(
  o: Omit<WindowShapeOptions, 'kind'> & { src: string },
): ShapeDef {
  return windowShape({ ...o, kind: 'bare', clip: o.clip ?? true });
}

export { frame, KINDS, SCALE, isVideo, tier, COPY_EXPORT as COPY };
import { COPY as COPY_EXPORT } from './copy.js';
export { mediaSurface } from './media.js';
export type {
  FrameKind, FrameOptions, FrameResult, MediaSource, PackCopy,
} from './types.js';
export type { Tier } from './util.js';
