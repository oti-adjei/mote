/**
 * The field controller — the public entry point.
 *
 * Owns the particle set, the preset, the renderer and the pointer, and
 * registers itself with the shared scheduler. Reduced motion short-circuits
 * everything: frame 0 is rendered and no loop is ever started.
 */
import { DEFAULTS, layout, resolveAvoid } from './layout.js';
import { rng } from './prng.js';
import { resolvePreset } from './motion/index.js';
import { createDomRenderer } from './render/dom.js';
import { register } from './scheduler.js';
import { devWarn, isBrowser, prefersReducedMotion } from './env.js';
import type {
  FieldContext,
  FieldHandle,
  FieldOptions,
  MotionPreset,
  Particle,
} from './types.js';

export function createField(host: HTMLElement, options: FieldOptions = {}): FieldHandle {
  let opts: FieldOptions = { ...options };
  let particles: Particle[] = [];
  let preset: MotionPreset = resolvePreset(opts.mode, opts.direction ?? DEFAULTS.direction);
  let unregister: (() => void) | null = null;
  let ro: ResizeObserver | null = null;
  let io: IntersectionObserver | null = null;
  let destroyed = false;
  let visible = true;
  let elapsed = 0;

  const reduced = prefersReducedMotion();
  const renderer = createDomRenderer(host);

  const ctx: FieldContext = {
    width: 0,
    height: 0,
    t: 0,
    speed: opts.speed ?? DEFAULTS.speed,
    pointer: { x: 0, y: 0, inside: false },
    avoid: null,
    interactive: (opts.interactive ?? DEFAULTS.interactive) && !reduced,
    particles,
  };

  // The layer must never affect its parent's layout or swallow clicks.
  host.style.position ||= 'absolute';
  host.style.inset ||= '0';
  host.style.overflow = 'hidden';
  host.setAttribute('aria-hidden', 'true');
  host.style.pointerEvents = 'none';

  function measure(): { width: number; height: number } {
    const rect = host.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
    };
  }

  function build(): void {
    const { width, height } = measure();
    ctx.width = width;
    ctx.height = height;
    ctx.avoid = resolveAvoid(opts.avoid, width, height);
    ctx.speed = opts.speed ?? DEFAULTS.speed;
    ctx.interactive = (opts.interactive ?? DEFAULTS.interactive) && !reduced;

    preset = resolvePreset(opts.mode, opts.direction ?? DEFAULTS.direction);
    particles = layout(opts, width, height, devWarn);
    ctx.particles = particles;

    if (preset.init) {
      // A dedicated stream keyed off the same seed, so preset randomness is
      // reproducible without perturbing the layout stream above it.
      const r = rng(`mote-init:${opts.seed ?? DEFAULTS.seed}`);
      for (const p of particles) preset.init(p, ctx, r);
    }

    elapsed = 0;
    ctx.t = 0;
    renderer.mount(particles);
  }

  function tick(dt: number): void {
    if (destroyed || !visible) return;
    const scaled = dt * (ctx.speed <= 0 ? 0 : ctx.speed);
    if (scaled === 0) return;

    elapsed += scaled;
    ctx.t = elapsed;

    for (const p of particles) preset.step(p, ctx, scaled);
    preset.stepAll?.(particles, ctx, scaled);
    renderer.draw(particles);
  }

  function startLoop(): void {
    if (reduced || opts.paused || unregister) return;
    unregister = register({ tick });
  }

  function stopLoop(): void {
    unregister?.();
    unregister = null;
  }

  function onPointerMove(e: PointerEvent): void {
    const rect = host.getBoundingClientRect();
    ctx.pointer.x = e.clientX - rect.left;
    ctx.pointer.y = e.clientY - rect.top;
    ctx.pointer.inside = true;
  }

  function onPointerLeave(): void {
    ctx.pointer.inside = false;
  }

  function onPointerDown(e: PointerEvent): void {
    onPointerMove(e);
    preset.onPointerDown?.(ctx);
  }

  function bindPointer(): void {
    if (!ctx.interactive || !isBrowser) return;
    // Listeners go on the parent, not the layer: the layer is
    // pointer-events:none so content above it stays clickable.
    const target = host.parentElement ?? host;
    target.addEventListener('pointermove', onPointerMove, { passive: true });
    target.addEventListener('pointerleave', onPointerLeave, { passive: true });
    target.addEventListener('pointerdown', onPointerDown, { passive: true });
    unbindPointer = () => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerleave', onPointerLeave);
      target.removeEventListener('pointerdown', onPointerDown);
    };
  }

  let unbindPointer: (() => void) | null = null;

  function observe(): void {
    if (typeof ResizeObserver !== 'undefined') {
      let lastW = ctx.width;
      let lastH = ctx.height;
      ro = new ResizeObserver(() => {
        const { width, height } = measure();
        // Sub-pixel scroll jitter fires this constantly; rebuilding the whole
        // layout on every such event would reshuffle the field while the user
        // scrolls. Only a meaningful change rebuilds.
        if (Math.abs(width - lastW) < 2 && Math.abs(height - lastH) < 2) return;
        lastW = width;
        lastH = height;
        build();
      });
      ro.observe(host);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting);
        },
        { rootMargin: '100px' },
      );
      io.observe(host);
    }
  }

  build();
  if (reduced) {
    devWarn('mote: prefers-reduced-motion is set — rendering a static field.');
  } else {
    bindPointer();
    observe();
    startLoop();
  }

  return {
    update(next: Partial<FieldOptions>) {
      if (destroyed) return;
      const prev = opts;
      opts = { ...opts, ...next };

      // A changed seed, count, pool or size means a different field; anything
      // else is applied live without disturbing positions mid-animation.
      const structural =
        next.seed !== undefined && next.seed !== prev.seed
        || next.count !== undefined && next.count !== prev.count
        || next.size !== undefined && next.size !== prev.size
        || next.shapes !== undefined
        || next.packs !== undefined
        || next.set !== undefined && next.set !== prev.set
        || next.theme !== undefined
        || next.depth !== undefined && next.depth !== prev.depth
        || next.mode !== undefined && next.mode !== prev.mode
        || next.direction !== undefined && next.direction !== prev.direction;

      if (structural) build();
      else {
        ctx.speed = opts.speed ?? DEFAULTS.speed;
        ctx.interactive = (opts.interactive ?? DEFAULTS.interactive) && !reduced;
        ctx.avoid = resolveAvoid(opts.avoid, ctx.width, ctx.height);
      }

      if (opts.paused) stopLoop();
      else startLoop();
    },
    pause() {
      opts.paused = true;
      stopLoop();
    },
    resume() {
      opts.paused = false;
      startLoop();
    },
    destroy() {
      destroyed = true;
      stopLoop();
      unbindPointer?.();
      ro?.disconnect();
      io?.disconnect();
      renderer.destroy();
    },
  };
}

