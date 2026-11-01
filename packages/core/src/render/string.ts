/**
 * Static SVG/HTML string renderer.
 *
 * Used for SSR (frame 0), reduced motion, and any out-of-browser render. The
 * DOM renderer produces the same structure, so hydration can adopt this markup
 * instead of replacing it.
 */
import { layout } from '../layout.js';
import type { FieldOptions, Particle } from '../types.js';

export function transformOf(p: Particle): string {
  const sx = (p.state.scaleX ?? 1) * p.scale;
  const sy = (p.state.scaleY ?? 1) * p.scale;
  return (
    `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) ` +
    `translate(-50%, -50%) ` +
    `rotate(${p.rot.toFixed(2)}deg) ` +
    `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
  );
}

function styleOf(p: Particle): string {
  const parts = [
    'position:absolute',
    'left:0',
    'top:0',
    `width:${p.w.toFixed(2)}px`,
    `height:${p.h.toFixed(2)}px`,
    `transform:${transformOf(p)}`,
    'transform-origin:center',
    'will-change:transform',
  ];
  if (p.opacity !== 1) parts.push(`opacity:${p.opacity.toFixed(3)}`);
  if (p.blur > 0.05) parts.push(`filter:blur(${p.blur.toFixed(2)}px)`);
  return parts.join(';');
}

export function renderParticles(particles: readonly Particle[]): string {
  let out = '';
  for (const p of particles) {
    // Width is passed so size-aware shapes — window frames, which drop chrome
    // detail by rendered width — build at their real size rather than a
    // reference one. Drawn SVG shapes ignore it.
    out += `<div style="${styleOf(p)}">${p.shape.render(p.colors, undefined, p.w)}</div>`;
  }
  return out;
}

/**
 * Frame-0 markup for a field of the given size.
 *
 * The returned string is the *inner* HTML of the field container, so a
 * framework wrapper controls the container element and its classes.
 */
export function renderFieldHTML(
  opts: FieldOptions & { width: number; height: number },
): string {
  const particles = layout(opts, opts.width, opts.height);
  return renderParticles(particles);
}

/** A standalone, self-contained SVG document. For OG images and emails. */
export function renderFieldSVG(
  opts: FieldOptions & { width: number; height: number; background?: string },
): string {
  const { width, height } = opts;
  const particles = layout(opts, width, height);
  const bg = opts.background
    ? `<rect width="${width}" height="${height}" fill="${opts.background}"/>`
    : '';

  let body = '';
  for (const p of particles) {
    const sx = (p.state.scaleX ?? 1) * p.scale;
    const sy = (p.state.scaleY ?? 1) * p.scale;
    const inner = p.shape
      .render(p.colors)
      // The nested <svg> needs explicit extent inside a parent SVG.
      .replace(
        'style="display:block;width:100%;height:100%;overflow:visible"',
        `width="${p.w.toFixed(2)}" height="${p.h.toFixed(2)}" x="0" y="0"`,
      );
    const tx = p.x - p.w / 2;
    const ty = p.y - p.h / 2;
    const cx = p.w / 2;
    const cy = p.h / 2;
    const op = p.opacity !== 1 ? ` opacity="${p.opacity.toFixed(3)}"` : '';
    body +=
      `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) ` +
      `rotate(${p.rot.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}) ` +
      `scale(${sx.toFixed(4)} ${sy.toFixed(4)})"${op}>${inner}</g>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">${bg}${body}</svg>`
  );
}
