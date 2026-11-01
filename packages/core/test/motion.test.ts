import { describe, expect, it } from 'vitest';
import { layout } from '../src/layout.js';
import { PRESETS, resolvePreset, makeAcross } from '../src/motion/index.js';
import { radiusOf } from '../src/motion/collide.js';
import { rng } from '../src/prng.js';
import type { FieldContext, MotionId, MotionPreset, Particle } from '../src/types.js';

const W = 800;
const H = 500;
const ALL = Object.keys(PRESETS) as MotionId[];

function harness(mode: MotionId, opts = {}) {
  const particles = layout({ count: 14, seed: 5, size: 60, ...opts }, W, H);
  const preset = PRESETS[mode];
  const ctx: FieldContext = {
    width: W,
    height: H,
    t: 0,
    speed: 1,
    pointer: { x: 0, y: 0, inside: false },
    avoid: null,
    interactive: true,
    particles,
  };
  if (preset.init) {
    const r = rng(`mote-init:5`);
    for (const p of particles) preset.init(p, ctx, r);
  }
  const advance = (frames: number, dt = 1 / 60) => {
    for (let f = 0; f < frames; f++) {
      ctx.t += dt;
      for (const p of particles) preset.step(p, ctx, dt);
      preset.stepAll?.(particles, ctx, dt);
    }
  };
  return { particles, preset, ctx, advance };
}

describe.each(ALL)('preset %s', (mode) => {
  it('never produces non-finite values over a long run', () => {
    const { particles, advance } = harness(mode);
    advance(600);
    for (const p of particles) {
      for (const key of ['x', 'y', 'rot', 'scale', 'opacity', 'vx', 'vy'] as const) {
        expect(Number.isFinite(p[key]), `${mode}.${key}`).toBe(true);
      }
    }
  });

  it('stays within a sane distance of the field', () => {
    const { particles, advance } = harness(mode);
    advance(600);
    // Wrapping and parade presets legitimately sit just outside; nothing
    // should ever be flung a screen away, which is what a tunnelling or
    // energy-runaway bug looks like.
    for (const p of particles) {
      expect(p.x, `${mode}.x`).toBeGreaterThan(-W);
      expect(p.x, `${mode}.x`).toBeLessThan(W * 2);
      expect(p.y, `${mode}.y`).toBeGreaterThan(-H * 2);
      expect(p.y, `${mode}.y`).toBeLessThan(H * 2);
    }
  });

  it('is deterministic frame-for-frame', () => {
    const a = harness(mode);
    const b = harness(mode);
    a.advance(120);
    b.advance(120);
    expect(a.particles.map((p) => [p.x, p.y])).toEqual(
      b.particles.map((p) => [p.x, p.y]),
    );
  });

  it('does not move at all on frame 0', () => {
    const { particles } = harness(mode);
    // init may reposition (gravity drops from above, across re-staggers),
    // but no step has run, so x/y must still equal the home it was given.
    for (const p of particles) {
      expect(Number.isFinite(p.x)).toBe(true);
    }
  });
});

describe('static', () => {
  it('holds position with no pointer', () => {
    const { particles, advance } = harness('static');
    const before = particles.map((p) => [p.x, p.y]);
    advance(120);
    particles.forEach((p, i) => {
      expect(p.x).toBeCloseTo(before[i]![0]!, 3);
      expect(p.y).toBeCloseTo(before[i]![1]!, 3);
    });
  });

  it('leans away from the cursor, then settles back', () => {
    const { particles, ctx, advance } = harness('static');
    const target = particles[0]!;
    ctx.pointer = { x: target.homeX, y: target.homeY + 30, inside: true };
    advance(30);
    const displaced = Math.hypot(target.x - target.homeX, target.y - target.homeY);
    expect(displaced).toBeGreaterThan(1);

    ctx.pointer.inside = false;
    advance(240);
    const settled = Math.hypot(target.x - target.homeX, target.y - target.homeY);
    expect(settled).toBeLessThan(0.5);
  });

  it('ignores the pointer when not interactive', () => {
    const { particles, ctx, advance } = harness('static');
    ctx.interactive = false;
    const target = particles[0]!;
    ctx.pointer = { x: target.homeX, y: target.homeY, inside: true };
    advance(60);
    expect(Math.hypot(target.x - target.homeX, target.y - target.homeY)).toBeLessThan(0.5);
  });
});

describe('bob', () => {
  it('oscillates around home without drifting away', () => {
    const { particles, advance } = harness('bob');
    const p = particles[0]!;
    const home = { x: p.homeX, y: p.homeY };
    let maxDev = 0;
    for (let i = 0; i < 400; i++) {
      advance(1);
      maxDev = Math.max(maxDev, Math.abs(p.y - home.y));
    }
    expect(maxDev).toBeGreaterThan(2);
    expect(maxDev).toBeLessThan(40);
  });

  it('de-synchronises neighbours', () => {
    const { particles, advance } = harness('bob');
    advance(45);
    const offsets = particles.map((p) => p.y - p.homeY);
    const spread = Math.max(...offsets) - Math.min(...offsets);
    expect(spread).toBeGreaterThan(2);
  });
});

describe('hop', () => {
  it('never falls below its resting line', () => {
    const { particles, advance } = harness('hop');
    for (let i = 0; i < 300; i++) {
      advance(1);
      for (const p of particles) expect(p.y).toBeLessThanOrEqual(p.homeY + 0.001);
    }
  });

  it('squashes to a volume-preserving shape on landing', () => {
    const { particles, advance } = harness('hop');
    let sawSquash = false;
    for (let i = 0; i < 400 && !sawSquash; i++) {
      advance(1);
      for (const p of particles) {
        const sy = p.state.scaleY ?? 1;
        const sx = p.state.scaleX ?? 1;
        if (sy < 0.95) {
          sawSquash = true;
          expect(sx).toBeGreaterThan(1);
        }
      }
    }
    expect(sawSquash).toBe(true);
  });
});

describe('across', () => {
  it('re-enters on a new cross-axis line each pass', () => {
    const preset = makeAcross('right');
    const particles = layout({ count: 1, seed: 2, size: 50 }, W, H);
    const ctx: FieldContext = {
      width: W, height: H, t: 0, speed: 1,
      pointer: { x: 0, y: 0, inside: false },
      avoid: null, interactive: false, particles,
    };
    const r = rng('t');
    preset.init!(particles[0]!, ctx, r);
    const p = particles[0]!;

    const lines: number[] = [];
    let lastPass = 0;
    for (let i = 0; i < 20000; i++) {
      preset.step(p, ctx, 1 / 60);
      const pass = p.state.pass ?? 0;
      if (pass > lastPass) {
        lastPass = pass;
        lines.push(p.homeY);
        if (lines.length >= 3) break;
      }
    }
    expect(lines.length).toBeGreaterThanOrEqual(2);
    expect(new Set(lines.map((v) => v.toFixed(2))).size).toBe(lines.length);
  });

  it('respects direction', () => {
    for (const [dir, axis, sign] of [
      ['left', 'x', -1], ['right', 'x', 1], ['up', 'y', -1], ['down', 'y', 1],
    ] as const) {
      const preset = makeAcross(dir);
      const particles = layout({ count: 1, seed: 1, size: 40 }, W, H);
      const ctx: FieldContext = {
        width: W, height: H, t: 0, speed: 1,
        pointer: { x: 0, y: 0, inside: false },
        avoid: null, interactive: false, particles,
      };
      const p = particles[0]!;
      preset.init!(p, ctx, rng('d'));
      const before = axis === 'x' ? p.homeX : p.homeY;
      preset.step(p, ctx, 1 / 60);
      const after = axis === 'x' ? p.homeX : p.homeY;
      expect(Math.sign(after - before), dir).toBe(sign);
    }
  });
});

describe('bounce', () => {
  it('keeps shapes inside the walls', () => {
    const { particles, advance } = harness('bounce');
    advance(900);
    for (const p of particles) {
      const r = radiusOf(p);
      expect(p.x).toBeGreaterThanOrEqual(r - 0.5);
      expect(p.x).toBeLessThanOrEqual(W - r + 0.5);
      expect(p.y).toBeGreaterThanOrEqual(r - 0.5);
      expect(p.y).toBeLessThanOrEqual(H - r + 0.5);
    }
  });

  it('neither dies out nor runs away', () => {
    const { particles, advance } = harness('bounce');
    advance(1800);
    for (const p of particles) {
      const speed = Math.hypot(p.vx, p.vy);
      expect(speed).toBeGreaterThan(5);
      expect(speed).toBeLessThan(200);
    }
  });
});

describe('gravity', () => {
  it('settles into a pile and goes to sleep', () => {
    const { particles, advance } = harness('gravity', { count: 10, size: 50 });
    advance(1200);
    const asleep = particles.filter((p) => p.state.asleep === 1);
    expect(asleep.length).toBeGreaterThan(0);
    for (const p of particles) {
      expect(p.y).toBeGreaterThan(H * 0.3);
    }
  });

  it('wakes and throws on pointer down', () => {
    const { particles, ctx, preset, advance } = harness('gravity', { count: 8, size: 50 });
    advance(1200);
    expect(particles.some((p) => p.state.asleep === 1)).toBe(true);

    ctx.pointer = { x: W / 2, y: H - 20, inside: true };
    preset.onPointerDown!(ctx);
    expect(particles.every((p) => p.state.asleep === 0)).toBe(true);
    expect(particles.some((p) => Math.hypot(p.vx, p.vy) > 50)).toBe(true);
  });

  it('does not let the pile sink through the floor', () => {
    const { particles, advance } = harness('gravity', { count: 12, size: 50 });
    advance(1500);
    for (const p of particles) {
      expect(p.y + radiusOf(p)).toBeLessThanOrEqual(H + 1);
    }
  });
});

describe('resolvePreset', () => {
  it('maps ids to presets and defaults to drift', () => {
    expect(resolvePreset('bob').id).toBe('bob');
    expect(resolvePreset(undefined).id).toBe('drift');
    expect(resolvePreset('across').id).toBe('across');
  });

  it('lets a custom preset object win', () => {
    const custom: MotionPreset = { id: 'bob', step: () => {} };
    expect(resolvePreset(custom)).toBe(custom);
  });

  it('builds across with the requested direction', () => {
    const p = resolvePreset('across', 'up');
    const particles = layout({ count: 1, size: 40 }, W, H);
    const ctx: FieldContext = {
      width: W, height: H, t: 0, speed: 1,
      pointer: { x: 0, y: 0, inside: false },
      avoid: null, interactive: false, particles,
    };
    const particle = particles[0] as Particle;
    p.init!(particle, ctx, rng(1));
    const before = particle.homeY;
    p.step(particle, ctx, 1 / 60);
    expect(particle.homeY).toBeLessThan(before);
  });
});
