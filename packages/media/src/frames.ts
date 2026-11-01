/**
 * Window frames — chrome for media that floats with the shapes.
 *
 * Ported from the design source. Measurements are the designer's: every
 * dimension is a fraction of the rendered width, clamped, so a frame reads
 * correctly at any size in the field rather than only at one.
 *
 * Frames are scene objects, not UI. No hover states, no focusable controls,
 * nothing clickable.
 */
import { COPY, fallbackCopy } from './copy.js';
import { mediaSurface } from './media.js';
import { FONT, MONO, R, clamp, hexA, lights, lock, tier } from './util.js';
import type { FrameKind, FrameOptions, FrameResult, PackCopy } from './types.js';
import type { Tier } from './util.js';

/** Kinds whose aspect ratio is intrinsic and cannot be overridden. */
const FORCE: Partial<Record<FrameKind, [number, number]>> = {
  phone: [9, 19.5],
  circle: [1, 1],
  slide: [4, 3],
  polaroid: [1, 1],
};

/** Relative size, so one `size` value gives sane results across kinds. */
export const SCALE: Partial<Record<FrameKind, number>> = {
  phone: 0.5, circle: 0.62, slide: 0.72, polaroid: 0.78,
  message: 0.85, post: 0.82, ticket: 1.1, monitor: 1.05,
};

export const KINDS: FrameKind[] = [
  'browser', 'app', 'bare', 'caption', 'phone', 'monitor',
  'polaroid', 'stream', 'post', 'circle', 'message', 'slide', 'ticket',
];

interface Ctx {
  c: FrameOptions['c'];
  w: number;
  T: Tier;
  ratio: [number, number];
  copy: PackCopy;
  font: string;
  rr: number;
  shadow: string;
  ring: number;
}

type Builder = (o: FrameOptions, k: Ctx) => { html: string; h: number };

const BUILDERS: Partial<Record<FrameKind, Builder>> = {
  browser(o, k) {
    const { c, w, T, ratio, copy, rr, shadow } = k;
    const rim = R(clamp(w * 0.012, 3, 5));
    const bar = R(clamp(w * 0.08, 20, 30));
    const dot = R(clamp(bar * 0.34, 7, 10));
    const gap = R(dot * 0.6);
    const pad = R(bar * 0.45);
    const mw = w - rim * 2;
    const mh = R((mw * ratio[1]) / ratio[0]);
    const h = bar + mh + rim;
    const lw = dot * 3 + gap * 2;
    const ph = R(bar * 0.52);
    const url =
      T === 'L'
        ? `${lock(R(ph * 0.42), c.d)}<span style="font:500 ${clamp(R(bar * 0.36), 9, 11)}px/1 ${MONO};` +
          `color:${c.d};opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${copy.url}</span>`
        : '';
    const html =
      `<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;border-radius:${rr}px;` +
      `background:${c.f};box-shadow:${shadow};overflow:hidden">` +
      `<div style="height:${bar}px;flex:none;display:grid;grid-template-columns:${lw}px minmax(0,1fr) ${lw}px;` +
      `align-items:center;gap:${pad}px;padding:0 ${pad}px">` +
      `<div style="display:flex;gap:${gap}px;align-items:center">${lights(T, dot, gap, c.d)}</div>` +
      `<div style="display:flex;justify-content:center;min-width:0">` +
      `<div style="height:${ph}px;width:${T === 'S' ? '70%' : '86%'};border-radius:${ph}px;` +
      `background:${hexA(c.d, 0.16)};display:flex;align-items:center;justify-content:center;gap:5px;` +
      `padding:0 8px;box-sizing:border-box;min-width:0">${url}</div></div><div></div></div>` +
      `<div style="padding:0 ${rim}px ${rim}px">` +
      `${mediaSurface(o, mw, mh, `0 0 ${Math.max(2, rr - rim)}px ${Math.max(2, rr - rim)}px`)}</div></div>`;
    return { html, h };
  },

  app(o, k) {
    const { c, w, T, ratio, copy, font, rr, shadow } = k;
    const rim = R(clamp(w * 0.012, 3, 5));
    const bar = R(clamp(w * 0.095, 22, 34));
    const dot = R(clamp(bar * 0.3, 7, 10));
    const gap = R(dot * 0.6);
    const pad = R(bar * 0.42);
    const rail = T === 'S' ? 0 : R(clamp(w * 0.075, 20, 30));
    const foot = R(clamp(w * 0.035, 8, 12));
    const mw = w - rim - (rail || rim);
    const mh = R((mw * ratio[1]) / ratio[0]);
    const h = bar + mh + foot;
    const lw = dot * 3 + gap * 2;
    const title =
      T === 'L'
        ? `<span style="font:700 ${clamp(R(bar * 0.38), 10, 13)}px/1 ${font};color:${c.d};` +
          `white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${copy.title}</span>`
        : T === 'M'
          ? `<span style="display:block;width:${R(w * 0.22)}px;height:${R(dot * 0.8)}px;` +
            `border-radius:${dot}px;background:${c.d};opacity:.35"></span>`
          : '';
    const right =
      T === 'S'
        ? ''
        : [0, 1]
            .map(
              () =>
                `<span style="display:block;width:${dot}px;height:${dot}px;border-radius:2px;` +
                `background:${c.d};opacity:.3"></span>`,
            )
            .join('');
    const ic = R(rail * 0.46);
    const railHtml = rail
      ? `<div style="width:${rail}px;flex:none;display:flex;flex-direction:column;align-items:center;` +
        `gap:${R(rail * 0.3)}px;padding-top:${R(rail * 0.15)}px">` +
        [0.6, 0.28, 0.28]
          .map(
            (op) =>
              `<span style="display:block;width:${ic}px;height:${ic}px;` +
              `border-radius:${R(ic * 0.28)}px;background:${c.d};opacity:${op}"></span>`,
          )
          .join('') +
        `</div>`
      : '';
    const html =
      `<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;border-radius:${rr}px;` +
      `background:${c.f};box-shadow:${shadow};overflow:hidden">` +
      `<div style="height:${bar}px;flex:none;display:grid;grid-template-columns:${lw}px minmax(0,1fr) ${lw}px;` +
      `align-items:center;gap:${pad}px;padding:0 ${pad}px">` +
      `<div style="display:flex;gap:${gap}px;align-items:center">${lights(T, dot, gap, c.d)}</div>` +
      `<div style="display:flex;justify-content:center;min-width:0">${title}</div>` +
      `<div style="display:flex;gap:${gap}px;justify-content:flex-end">${right}</div></div>` +
      `<div style="display:flex;padding:0 ${rim}px 0 ${rail ? 0 : rim}px">` +
      `${railHtml}${mediaSurface(o, mw, mh, '4px')}</div>` +
      `<div style="height:${foot}px;flex:none"></div></div>`;
    return { html, h };
  },

  caption(o, k) {
    const { c, w, T, ratio, copy, font, rr, shadow, ring } = k;
    const strip = R(clamp(w * 0.13, 30, 46));
    const mh = R((w * ratio[1]) / ratio[0]);
    const h = mh + strip;
    const cap = copy.caps[(o.idx ?? 0) % copy.caps.length] as [string, string];
    const html =
      `<div style="width:${w}px;height:${h}px;border-radius:${rr}px;` +
      `box-shadow:0 0 0 ${ring}px ${c.f},${shadow};overflow:hidden;display:flex;flex-direction:column;` +
      `background:${c.f}">${mediaSurface(o, w, mh, '0')}` +
      `<div style="height:${strip}px;flex:none;display:flex;align-items:center;justify-content:space-between;` +
      `gap:8px;padding:0 ${R(strip * 0.38)}px;color:${c.d}">` +
      `<span style="font:800 ${R(strip * 0.42)}px/1 ${font};letter-spacing:-0.01em;white-space:nowrap">${cap[0]}</span>` +
      (T !== 'S'
        ? `<span style="font:500 ${clamp(R(strip * 0.27), 9, 11)}px/1 ${MONO};letter-spacing:.12em;` +
          `opacity:.7;white-space:nowrap">${cap[1]}</span>`
        : '') +
      `</div></div>`;
    return { html, h };
  },

  phone(o, k) {
    const { c, w, shadow } = k;
    const b = R(clamp(w * 0.04, 5, 9));
    const rad = R(w * 0.17);
    const mw = w - b * 2;
    const mh = R((mw * 19.5) / 9);
    const h = mh + b * 2;
    const iw = R(w * 0.3);
    const ih = R(clamp(w * 0.07, 8, 16));
    const hb = R(w * 0.34);
    const btn = (side: string, top: number, hh: number): string =>
      `<span style="position:absolute;${side}:-3px;top:${R(h * top)}px;width:3px;` +
      `height:${R(h * hh)}px;border-radius:2px;background:${c.f}"></span>`;
    const html =
      `<div style="position:relative;width:${w}px;height:${h}px">` +
      `${btn('left', 0.18, 0.07)}${btn('left', 0.28, 0.11)}${btn('right', 0.24, 0.13)}` +
      `<div style="position:relative;width:${w}px;height:${h}px;border-radius:${rad}px;background:${c.f};` +
      `padding:${b}px;box-sizing:border-box;box-shadow:${shadow}">${mediaSurface(o, mw, mh, `${rad - b}px`)}` +
      `<span style="position:absolute;left:50%;top:${b + R(ih * 0.6)}px;width:${iw}px;height:${ih}px;` +
      `margin-left:${-iw / 2}px;border-radius:${ih}px;background:${c.f}"></span>` +
      `<span style="position:absolute;left:50%;bottom:${b + R(ih * 0.5)}px;width:${hb}px;` +
      `height:${Math.max(3, R(w * 0.02))}px;margin-left:${-hb / 2}px;border-radius:4px;` +
      `background:${c.f};opacity:.85"></span></div></div>`;
    return { html, h };
  },

  monitor(o, k) {
    const { c, w } = k;
    const ratio = k.ratio[1] > k.ratio[0] ? ([16, 10] as [number, number]) : k.ratio;
    const b = R(clamp(w * 0.025, 5, 10));
    const chin = R(clamp(w * 0.055, 12, 20));
    const mw = w - b * 2;
    const mh = R((mw * ratio[1]) / ratio[0]);
    const nw = R(w * 0.12);
    const nh = R(w * 0.09);
    const bw = R(w * 0.38);
    const bh = R(clamp(w * 0.022, 5, 9));
    const h = b + mh + chin + nh + bh;
    const html =
      `<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;` +
      `filter:drop-shadow(0 ${R(w * 0.03)}px ${R(w * 0.05)}px rgba(0,0,0,.3))">` +
      `<div style="width:${w}px;border-radius:${R(clamp(w * 0.03, 6, 12))}px;background:${c.f};` +
      `padding:${b}px ${b}px 0;box-sizing:border-box">${mediaSurface(o, mw, mh, '3px')}` +
      `<div style="height:${chin}px;display:flex;align-items:center;justify-content:center">` +
      `<span style="width:${R(chin * 0.32)}px;height:${R(chin * 0.32)}px;border-radius:50%;` +
      `background:${c.d};opacity:.35"></span></div></div>` +
      `<div style="width:${nw}px;height:${nh}px;flex:none;background:${c.f};` +
      `clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)"></div>` +
      `<div style="width:${bw}px;height:${bh}px;flex:none;border-radius:${bh}px;background:${c.f}"></div></div>`;
    return { html, h };
  },

  polaroid(o, k) {
    const { c, w, T, copy, shadow } = k;
    const p = R(w * 0.06);
    const bot = R(w * 0.24);
    const mw = w - p * 2;
    const mh = mw;
    const h = p + mh + bot;
    const cap = (copy.caps[(o.idx ?? 0) % copy.caps.length] as [string, string])[0];
    const tw = R(w * 0.36);
    const th = R(clamp(w * 0.1, 14, 30));
    const html =
      `<div style="position:relative;width:${w}px;height:${h}px">` +
      `<div style="width:${w}px;height:${h}px;background:${c.f};border-radius:3px;` +
      `padding:${p}px ${p}px 0;box-sizing:border-box;box-shadow:${shadow}">${mediaSurface(o, mw, mh, '1px')}` +
      `<div style="height:${bot}px;display:flex;align-items:center;justify-content:center">` +
      (T === 'S' && w < 180
        ? ''
        : `<span style="font:italic 400 ${R(bot * 0.44)}px/1 'Instrument Serif',Georgia,serif;` +
          `color:${c.d};opacity:.85">${cap}</span>`) +
      `</div></div>` +
      `<span style="position:absolute;left:50%;top:${-R(th * 0.45)}px;width:${tw}px;height:${th}px;` +
      `margin-left:${-tw / 2}px;transform:rotate(-4deg);background:${hexA(c.d, 0.22)}"></span></div>`;
    return { html, h };
  },

  stream(o, k) {
    const { c, w, T, copy, font, rr, ring, shadow } = k;
    const mh = R((w * k.ratio[1]) / k.ratio[0]);
    const h = mh;
    const p = Math.max(8, R(w * 0.04));
    const fs = clamp(R(w * 0.03), 9, 12);
    const st = copy.stream ?? [copy.title, (copy.caps[(o.idx ?? 0) % copy.caps.length] as [string, string])[1]];
    const live =
      `<div style="position:absolute;left:${p}px;top:${p}px;display:flex;align-items:center;` +
      `gap:${R(fs * 0.5)}px;background:${c.f};color:${c.d};border-radius:4px;` +
      `padding:${R(fs * 0.45)}px ${R(fs * 0.6)}px;font:500 ${fs}px/1 ${MONO};letter-spacing:.1em">` +
      `<span style="width:${R(fs * 0.65)}px;height:${R(fs * 0.65)}px;border-radius:50%;` +
      `background:${c.d}"></span>${T === 'S' ? '' : 'LIVE'}</div>`;
    const viewers =
      T === 'L'
        ? `<div style="position:absolute;right:${p}px;top:${p}px;background:${hexA(c.d, 0.75)};` +
          `color:${c.f};border-radius:4px;padding:${R(fs * 0.45)}px ${R(fs * 0.6)}px;` +
          `font:500 ${fs}px/1 ${MONO};letter-spacing:.06em">12.4K WATCHING</div>`
        : '';
    const lh = R(clamp(w * 0.085, 18, 32));
    const lower =
      T === 'S'
        ? ''
        : `<div style="position:absolute;left:${p}px;bottom:${p}px;right:${R(w * 0.22)}px;` +
          `height:${lh}px;display:flex">` +
          `<div style="flex:1;min-width:0;background:${c.f};color:${c.d};display:flex;align-items:center;` +
          `padding:0 ${R(lh * 0.4)}px;font:800 ${R(lh * 0.44)}px/1 ${font};white-space:nowrap;overflow:hidden">` +
          `${T === 'L' ? st[0] : ''}</div>` +
          `<div style="background:${c.d};color:${c.f};display:flex;align-items:center;` +
          `padding:0 ${R(lh * 0.35)}px;font:500 ${R(lh * 0.42)}px/1 ${MONO};white-space:nowrap">${st[1]}</div></div>`;
    const html =
      `<div style="position:relative;width:${w}px;height:${h}px;border-radius:${rr}px;` +
      `box-shadow:0 0 0 ${ring}px ${c.f},${shadow};overflow:hidden">` +
      `${mediaSurface({ ...o, clip: false }, w, mh, `${rr}px`)}${live}${viewers}${lower}</div>`;
    return { html, h };
  },

  post(o, k) {
    const { c, w, T, copy, font, rr, shadow } = k;
    const p = R(clamp(w * 0.045, 8, 14));
    const av = R(clamp(w * 0.1, 18, 32));
    const mw = w - p * 2;
    const mh = R((mw * k.ratio[1]) / k.ratio[0]);
    const cap = copy.caps[(o.idx ?? 0) % copy.caps.length] as [string, string];
    const who =
      T === 'L'
        ? `<div style="display:flex;flex-direction:column;gap:3px;min-width:0">` +
          `<span style="font:800 ${R(av * 0.42)}px/1 ${font};color:${c.d};white-space:nowrap">${cap[0]}</span>` +
          `<span style="font:500 ${R(av * 0.3)}px/1 ${MONO};color:${c.d};opacity:.6;white-space:nowrap">` +
          `@${cap[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}</span></div>`
        : `<div style="display:flex;flex-direction:column;gap:${R(av * 0.16)}px;flex:1">` +
          `<span style="display:block;width:${T === 'M' ? '46%' : '60%'};height:${R(av * 0.26)}px;` +
          `border-radius:4px;background:${c.d};opacity:.55"></span>` +
          (T === 'M'
            ? `<span style="display:block;width:30%;height:${R(av * 0.18)}px;border-radius:4px;` +
              `background:${c.d};opacity:.3"></span>`
            : '') +
          `</div>`;
    const head =
      `<div style="height:${av}px;display:flex;align-items:center;gap:${R(av * 0.35)}px;margin-bottom:${p}px">` +
      `<span style="width:${av}px;height:${av}px;border-radius:50%;background:${c.d};flex:none"></span>${who}</div>`;
    const ic = R(clamp(w * 0.055, 10, 18));
    const icons =
      `<div style="display:flex;gap:${R(ic * 0.9)}px;align-items:center;height:${ic}px;margin-top:${p}px">` +
      [
        'M12 21C5 16 2 12 2 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 10 2.5C22 12 19 16 12 21z',
        'M4 4h16v12H9l-5 4z',
        'M3 12l18-8-7 17-3-7z',
      ]
        .map(
          (d) =>
            `<svg width="${ic}" height="${ic}" viewBox="0 0 24 24" fill="none" stroke="${c.d}" ` +
            `stroke-width="2.6" stroke-linejoin="round" style="display:block"><path d="${d}"/></svg>`,
        )
        .join('') +
      `</div>`;
    const h = p + av + p + mh + p + ic + p;
    const html =
      `<div style="width:${w}px;height:${h}px;box-sizing:border-box;padding:${p}px;border-radius:${rr}px;` +
      `background:${c.f};box-shadow:${shadow}">${head}${mediaSurface(o, mw, mh, `${R(rr * 0.6)}px`)}${icons}</div>`;
    return { html, h };
  },

  circle(o, k) {
    const { c, w, shadow } = k;
    const rw = R(clamp(w * 0.035, 4, 8));
    const dot = R(w * 0.2);
    const mw = w - rw * 2;
    const html =
      `<div style="position:relative;width:${w}px;height:${w}px">` +
      (w >= 170
        ? `<div style="position:absolute;inset:${-R(w * 0.07)}px;border-radius:50%;` +
          `border:2px dashed ${c.f};opacity:.5"></div>`
        : '') +
      `<div style="width:${w}px;height:${w}px;border-radius:50%;background:${c.f};padding:${rw}px;` +
      `box-sizing:border-box;box-shadow:${shadow}">${mediaSurface({ ...o, clip: false }, mw, mw, '50%')}</div>` +
      `<span style="position:absolute;right:${R(w * 0.03)}px;bottom:${R(w * 0.03)}px;width:${dot}px;` +
      `height:${dot}px;border-radius:50%;background:${c.f};display:flex;align-items:center;justify-content:center">` +
      `<span style="width:${R(dot * 0.5)}px;height:${R(dot * 0.5)}px;border-radius:50%;background:${c.d}"></span>` +
      `</span></div>`;
    return { html, h: w };
  },

  message(o, k) {
    const { c, w, T } = k;
    const p = R(clamp(w * 0.03, 5, 9));
    const mw = w - p * 2;
    const mh = R((mw * k.ratio[1]) / k.ratio[0]);
    const rad = R(clamp(w * 0.07, 12, 22));
    const foot = T === 'S' && w < 220 ? 0 : R(clamp(w * 0.075, 16, 24));
    const h = p + mh + (foot || p);
    const tail = R(clamp(w * 0.06, 10, 18));
    const html =
      `<div style="position:relative;width:${w}px;height:${h}px;` +
      `filter:drop-shadow(0 ${R(w * 0.025)}px ${R(w * 0.04)}px rgba(0,0,0,.3))">` +
      `<div style="width:${w}px;height:${h}px;box-sizing:border-box;padding:${p}px ${p}px 0;` +
      `border-radius:${rad}px ${rad}px ${rad}px 4px;background:${c.f}">` +
      `${mediaSurface(o, mw, mh, `${rad - p}px`)}` +
      (foot
        ? `<div style="height:${foot}px;display:flex;align-items:center;justify-content:flex-end;gap:5px;` +
          `font:500 ${R(foot * 0.5)}px/1 ${MONO};color:${c.d};opacity:.65">21:04 ` +
          `<span style="letter-spacing:-0.25em">✓✓</span></div>`
        : '') +
      `</div>` +
      `<svg width="${tail}" height="${tail}" viewBox="0 0 10 10" ` +
      `style="position:absolute;left:${-R(tail * 0.55)}px;bottom:0;display:block">` +
      `<path d="M10 0v10H0c4-1 7-4 10-10z" fill="${c.f}"/></svg></div>`;
    return { html, h };
  },

  slide(o, k) {
    const { c, w, copy, shadow } = k;
    const rad = R(w * 0.05);
    const aw = R(w * 0.74);
    const ah = R(aw * 0.75);
    const top = R((w - ah) * 0.38);
    const sx = R((w - aw) / 2);
    const cap = (copy.caps[(o.idx ?? 0) % copy.caps.length] as [string, string])[0];
    const html =
      `<div style="position:relative;width:${w}px;height:${w}px;border-radius:${rad}px;` +
      `background:${c.f};box-shadow:${shadow}">` +
      `<div style="position:absolute;left:${sx}px;top:${top}px;border-radius:${R(aw * 0.06)}px;` +
      `overflow:hidden;box-shadow:0 0 0 2px ${hexA(c.d, 0.25)}">` +
      `${mediaSurface({ ...o, clip: false }, aw, ah, `${R(aw * 0.06)}px`)}</div>` +
      (w >= 180
        ? `<div style="position:absolute;left:${sx}px;right:${sx}px;bottom:${R(w * 0.065)}px;` +
          `display:flex;justify-content:space-between;font:500 ${clamp(R(w * 0.045), 9, 12)}px/1 ${MONO};` +
          `letter-spacing:.12em;color:${c.d};opacity:.7">` +
          `<span>${cap.toUpperCase()}</span><span>${String((o.idx ?? 0) + 1).padStart(2, '0')}</span></div>`
        : '') +
      `<span style="position:absolute;left:${R(w * 0.06)}px;top:${R(w * 0.06)}px;width:${R(w * 0.04)}px;` +
      `height:${R(w * 0.04)}px;border-radius:50%;background:${c.d};opacity:.3"></span></div>`;
    return { html, h: w };
  },

  ticket(o, k) {
    const { c, w, T, copy, font, rr } = k;
    const sw = R(w * 0.28);
    const mw = w - sw;
    const ratio = k.ratio[1] > k.ratio[0] ? ([4, 3] as [number, number]) : k.ratio;
    const mh = R((mw * ratio[1]) / ratio[0]);
    const h = mh;
    const nr = R(clamp(w * 0.03, 6, 12));
    const mask =
      `radial-gradient(circle at ${mw}px 0,transparent ${nr}px,#000 ${nr + 0.5}px) top/100% 51% no-repeat,` +
      `radial-gradient(circle at ${mw}px 100%,transparent ${nr}px,#000 ${nr + 0.5}px) bottom/100% 51% no-repeat`;
    const bars = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 2]
      .map((bw) => `<span style="display:block;width:${bw}px;height:100%;background:${c.d}"></span>`)
      .join('');
    const fs = clamp(R(sw * 0.08), 8, 10);
    const info =
      T === 'L'
        ? `<div style="display:flex;flex-direction:column;gap:5px">` +
          `<span style="font:500 ${fs}px/1 ${MONO};letter-spacing:.14em;color:${c.d};opacity:.65">ADMIT ONE</span>` +
          `<span style="font:800 ${R(sw * 0.13)}px/1.05 ${font};color:${c.d};letter-spacing:-0.01em">${copy.title}</span>` +
          `<span style="font:500 ${fs}px/1 ${MONO};letter-spacing:.12em;color:${c.d}">№ 00${(o.idx ?? 0) + 1}</span></div>`
        : '<div></div>';
    const stub =
      `<div style="width:${sw}px;height:${h}px;flex:none;background:${c.f};` +
      `border-left:2px dashed ${hexA(c.d, 0.35)};box-sizing:border-box;display:flex;flex-direction:column;` +
      `justify-content:space-between;padding:${R(sw * 0.12)}px">${info}` +
      (T === 'S' ? '' : `<div style="display:flex;gap:2px;height:${R(sw * 0.2)}px">${bars}</div>`) +
      `</div>`;
    const html =
      `<div style="width:${w}px;height:${h}px;` +
      `filter:drop-shadow(0 ${R(w * 0.025)}px ${R(w * 0.04)}px rgba(0,0,0,.3))">` +
      `<div style="display:flex;width:${w}px;height:${h}px;border-radius:${rr}px;overflow:hidden;` +
      `-webkit-mask:${mask};mask:${mask}">${mediaSurface({ ...o, clip: false }, mw, mh, '0')}${stub}</div></div>`;
    return { html, h };
  },
};

/** Builds one frame. Returns markup plus the height it actually occupies. */
export function frame(o: FrameOptions): FrameResult {
  const kind: FrameKind = o.kind ?? 'browser';
  const c = o.c;
  const w = R(o.w);
  const T = tier(w);
  const ratio = FORCE[kind] ?? o.ratio ?? ([16, 9] as [number, number]);
  const copy = (o.pack ? COPY[o.pack] : undefined) ?? fallbackCopy;
  const font = o.font ?? FONT;
  const rr = R(clamp(w * 0.035, 8, 14));
  const shadow = `0 ${R(w * 0.03)}px ${R(w * 0.08)}px rgba(0,0,0,.32)`;
  const ring = R(clamp(w * 0.008, 2, 3));

  const ctx: Ctx = { c, w, T, ratio, copy, font, rr, shadow, ring };
  const build = BUILDERS[kind];

  if (build) {
    const { html, h } = build(o, ctx);
    return { html, h, tier: T };
  }

  // `bare`, and the fallback for an unknown kind: no chrome at all. The ring
  // is what stops a dark photo dissolving into a dark background.
  const mh = R((w * ratio[1]) / ratio[0]);
  const html =
    `<div style="width:${w}px;height:${mh}px;border-radius:${rr}px;` +
    `box-shadow:${o.ring === false ? '' : `0 0 0 ${ring}px ${c.f},`}${shadow};overflow:hidden">` +
    `${mediaSurface(o, w, mh, `${rr}px`)}</div>`;
  return { html, h: mh, tier: T };
}
