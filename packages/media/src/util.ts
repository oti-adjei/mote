/** Shared measurement helpers. Ported from the design source. */

export const R = Math.round;

export const clamp = (v: number, a: number, b: number): number =>
  Math.max(a, Math.min(b, v));

/** Appends an alpha channel to a 6-digit hex, leaving anything else alone. */
export const hexA = (hex: string, a: number): string =>
  /^#[0-9a-f]{6}$/i.test(hex)
    ? hex + R(a * 255).toString(16).padStart(2, '0')
    : hex;

export const FONT = "'Schibsted Grotesk',system-ui,-apple-system,sans-serif";
export const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

export type Tier = 'S' | 'M' | 'L';

/**
 * Chrome detail is chosen by rendered width, not by a breakpoint.
 *
 * A frame floating in a field can be any size, and chrome that merely scales
 * turns to mush below ~270px — traffic lights become 5px smudges and a URL
 * becomes a grey streak. Each tier drops detail rather than shrinking it.
 */
export const tier = (w: number): Tier => (w >= 340 ? 'L' : w >= 270 ? 'M' : 'S');

/** Padlock glyph for the browser URL pill. */
export const lock = (s: number, col: string): string =>
  `<svg width="${s}" height="${R(s * 1.2)}" viewBox="0 0 10 12" style="flex:none;display:block">` +
  `<path d="M2.5 5.5V3.5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="${col}" stroke-width="1.6"/>` +
  `<rect x="1" y="5" width="8" height="6.5" rx="1.6" fill="${col}"/></svg>`;

/**
 * Window controls. At small sizes the three dots merge into one capsule —
 * three 5px smudges read as dirt, one pill reads as a deliberate mark.
 */
export const lights = (T: Tier, dot: number, gap: number, col: string): string =>
  T === 'S'
    ? `<span style="display:block;width:${dot * 3 + gap * 2}px;height:${dot}px;` +
      `border-radius:${dot}px;background:${col};opacity:.55"></span>`
    : [1, 0.6, 0.35]
        .map(
          (o) =>
            `<span style="display:block;flex:none;width:${dot}px;height:${dot}px;` +
            `border-radius:50%;background:${col};opacity:${o}"></span>`,
        )
        .join('');
