/**
 * DOM renderer.
 *
 * One wrapper div per particle holding an inline SVG. Per frame it writes
 * `transform` and, only when depth is on, `opacity`/`filter` — never anything
 * that triggers layout.
 *
 * Nodes are created once and reused. `transform` strings are cached and
 * compared before writing, because assigning an identical value still dirties
 * style on some engines, and a sleeping gravity pile would otherwise keep
 * paying for every settled shape.
 */
import { transformOf } from './string.js';
import type { Particle } from '../types.js';

export interface DomRenderer {
  mount(particles: readonly Particle[]): void;
  draw(particles: readonly Particle[]): void;
  /**
   * Start or stop any media the particles contain.
   *
   * Playback is a RUNTIME decision, never an attribute: markup must be
   * byte-identical on the server and the client or hydration mismatches, so a
   * video is emitted without `autoplay` and started here instead. Reduced
   * motion and offscreen fields therefore simply never call play().
   */
  setMediaPlayback(play: boolean): void;
  destroy(): void;
}

export function createDomRenderer(host: HTMLElement): DomRenderer {
  let nodes: HTMLElement[] = [];
  let lastTransform: string[] = [];

  function mount(particles: readonly Particle[]): void {
    host.textContent = '';
    nodes = [];
    lastTransform = [];

    const frag = host.ownerDocument.createDocumentFragment();
    for (const p of particles) {
      const el = host.ownerDocument.createElement('div');
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.width = `${p.w.toFixed(2)}px`;
      el.style.height = `${p.h.toFixed(2)}px`;
      el.style.transformOrigin = 'center';
      el.style.willChange = 'transform';
      el.innerHTML = p.shape.render(p.colors, undefined, p.w);

      if (p.opacity !== 1) el.style.opacity = String(p.opacity);
      if (p.blur > 0.05) el.style.filter = `blur(${p.blur.toFixed(2)}px)`;

      const t = transformOf(p);
      el.style.transform = t;
      lastTransform.push(t);
      nodes.push(el);
      frag.appendChild(el);
    }
    host.appendChild(frag);
  }

  /**
   * Adopts markup already in the host (from SSR) instead of rebuilding it.
   * Falls back to a full mount when the node count doesn't match, which is the
   * honest signal that the server and client disagreed about the field.
   */
  function adopt(particles: readonly Particle[]): boolean {
    const existing = Array.from(host.children) as HTMLElement[];
    if (existing.length !== particles.length) return false;
    nodes = existing;
    lastTransform = particles.map((p) => transformOf(p));
    return true;
  }

  function draw(particles: readonly Particle[]): void {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i] as Particle;
      const el = nodes[i];
      if (!el) continue;
      const t = transformOf(p);
      if (t !== lastTransform[i]) {
        el.style.transform = t;
        lastTransform[i] = t;
      }
    }
  }

  function setMediaPlayback(play: boolean): void {
    const videos = host.querySelectorAll<HTMLVideoElement>('video[data-mote-media]');
    for (const v of videos) {
      if (play) {
        // Autoplay can be refused (a non-muted video, a power-saving mode).
        // A background must never surface that as an unhandled rejection —
        // the poster frame is a perfectly good outcome.
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    }
  }

  function destroy(): void {
    // Release decoders explicitly. Dropping the nodes alone can leave a
    // detached video holding its buffer until GC runs.
    setMediaPlayback(false);
    host.textContent = '';
    nodes = [];
    lastTransform = [];
  }

  return Object.assign({ mount, draw, setMediaPlayback, destroy }, { adopt });
}
