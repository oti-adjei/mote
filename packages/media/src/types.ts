import type { ShapeColors } from '@usemote/core';
import type { Tier } from './util.js';

export type FrameKind =
  | 'browser' | 'app' | 'bare' | 'caption'
  | 'phone' | 'monitor' | 'polaroid' | 'stream'
  | 'post' | 'circle' | 'message' | 'slide' | 'ticket';

/** Realistic chrome text per pack, so a frame reads as that domain. */
export interface PackCopy {
  url: string;
  title: string;
  caps: Array<[string, string]>;
  stream?: [string, string];
}

export interface MediaSource {
  /** Image or video URL. Video is detected by extension. */
  src?: string;
  /**
   * Poster frame, shown until playback starts — and permanently under
   * reduced motion, where playback never starts at all. Strongly recommended
   * for video: without it a paused `<video>` is a blank rectangle.
   */
  poster?: string;
  /** Alternative text. Decorative by default, since the layer is aria-hidden. */
  alt?: string;
  /** SVG markup shown in the placeholder when there is no `src`. */
  art?: string;
  /** Adds a progress bar and timecode chip, for clip-style content. */
  clip?: boolean;
}

export interface FrameOptions extends MediaSource {
  kind?: FrameKind;
  /** Rendered width in px. Height follows from the kind and ratio. */
  w: number;
  /** Colours, normally handed in by the field from the active theme. */
  c: ShapeColors;
  ratio?: [number, number];
  /** Pack id, selecting the chrome copy. */
  pack?: string;
  font?: string;
  /** Index into the pack's caption list, so sibling frames differ. */
  idx?: number;
  /** `bare` only: drop the outline ring. */
  ring?: boolean;
}

export interface FrameResult {
  html: string;
  /** Rendered height in px, for the caller's aspect ratio. */
  h: number;
  tier: Tier;
}
