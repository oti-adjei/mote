/** Playground state, and the URL encoding that makes a config shareable. */

import { BASE_PACK, type MotionId, type SetId, type ShapePack } from '@usemote/core';
import { ALL_PACKS } from './packs.js';

export const PACKS = ALL_PACKS;
export type PackId = string;

/**
 * Pack lookup that always yields a pack.
 *
 * `PACKS` is keyed by string, so a bad id from a URL or a stale link resolves
 * to nothing. A background is never worth failing a page over — fall back to
 * the base pack, which every install has.
 */
export function packFor(id: PackId): ShapePack {
  return PACKS[id] ?? PACKS.base ?? BASE_PACK;
}

export const MODES: MotionId[] = ['static', 'bob', 'hop', 'drift', 'across', 'bounce', 'gravity'];
export const SETS: SetId[] = ['mixed', 'geo', 'objects'];
export const THEMES = ['dark', 'light', 'accent', 'mono'] as const;
export const AVOIDS = ['none', 'center', 'top', 'bottom'] as const;
export const DIRECTIONS = ['right', 'left', 'up', 'down'] as const;

/**
 * Stage background and ink come from the pack itself when it declares them,
 * so each pack's demo sits on the ground its designer chose rather than a
 * single hardcoded palette.
 */
export function stageColors(packId: PackId, theme: string): { bg: string; ink: string } {
  const pack = packFor(packId);
  return {
    bg: pack.background?.[theme] ?? (theme === 'light' ? '#efeee8' : '#121212'),
    ink: pack.ink?.[theme] ?? (theme === 'light' ? '#121212' : '#f2f2ee'),
  };
}

export interface Config {
  packId: PackId;
  mode: MotionId;
  set: SetId;
  shapes: string[];
  count: number;
  size: number;
  seed: number;
  theme: string;
  depth: boolean;
  avoid: (typeof AVOIDS)[number];
  speed: number;
  interactive: boolean;
  direction: (typeof DIRECTIONS)[number];
}

export const DEFAULT_CONFIG: Config = {
  packId: 'esports',
  mode: 'bob',
  set: 'mixed',
  shapes: [],
  count: 14,
  size: 86,
  seed: 11,
  theme: 'dark',
  depth: true,
  avoid: 'center',
  speed: 1,
  interactive: true,
  direction: 'right',
};

/**
 * Config lives in the URL hash so a link is the whole share mechanism — no
 * backend, no accounts, nothing to run. Unknown or malformed values fall back
 * to the default rather than throwing, since a half-typed URL is normal.
 */
export function encode(c: Config): string {
  const p = new URLSearchParams();
  p.set('pack', c.packId);
  p.set('mode', c.mode);
  p.set('set', c.set);
  if (c.shapes.length) p.set('shapes', c.shapes.join(','));
  p.set('count', String(c.count));
  p.set('size', String(c.size));
  p.set('seed', String(c.seed));
  p.set('theme', c.theme);
  p.set('depth', c.depth ? '1' : '0');
  p.set('avoid', c.avoid);
  p.set('speed', String(c.speed));
  p.set('ix', c.interactive ? '1' : '0');
  if (c.mode === 'across') p.set('dir', c.direction);
  return p.toString();
}

function oneOf<T extends string>(v: string | null, allowed: readonly T[], fallback: T): T {
  return v !== null && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function num(v: string | null, fallback: number, lo: number, hi: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Keys that mark a hash as a playground config rather than something else.
 *
 * The hash is shared with ordinary anchor links — `#roadmap` is a real
 * destination on this page. Parsed as a query string that yields the single
 * key "roadmap" with an empty value, and every numeric field then coerced
 * from `''` to 0 and clamped, which silently rewrote the field to
 * `count=1 size=8 seed=0 speed=0`. A config has to be recognised, not merely
 * non-empty.
 */
const CONFIG_KEYS = ['pack', 'mode', 'set', 'shapes', 'count', 'size', 'seed', 'theme'];

export function isConfigHash(hash: string): boolean {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  return CONFIG_KEYS.some((k) => p.has(k));
}

export function decode(hash: string): Config {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  if (!isConfigHash(hash)) return { ...DEFAULT_CONFIG };
  const d = DEFAULT_CONFIG;
  return {
    packId: oneOf(p.get('pack'), Object.keys(PACKS) as PackId[], d.packId),
    mode: oneOf(p.get('mode'), MODES, d.mode),
    set: oneOf(p.get('set'), SETS, d.set),
    shapes: (p.get('shapes') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    count: Math.round(num(p.get('count'), d.count, 1, 200)),
    size: Math.round(num(p.get('size'), d.size, 8, 300)),
    seed: Math.round(num(p.get('seed'), d.seed, 0, 1e9)),
    theme: oneOf(p.get('theme'), THEMES, d.theme as (typeof THEMES)[number]),
    depth: p.get('depth') !== '0',
    avoid: oneOf(p.get('avoid'), AVOIDS, d.avoid),
    speed: num(p.get('speed'), d.speed, 0, 3),
    interactive: p.get('ix') !== '0',
    direction: oneOf(p.get('dir'), DIRECTIONS, d.direction),
  };
}

/** The props actually handed to <FloatingField />. */
export function toFieldProps(c: Config) {
  const base = {
    packs: [packFor(c.packId)],
    mode: c.mode,
    count: c.count,
    size: c.size,
    seed: c.seed,
    theme: c.theme,
    depth: c.depth,
    avoid: c.avoid,
    speed: c.speed,
    interactive: c.interactive,
    ...(c.mode === 'across' ? { direction: c.direction } : {}),
  };
  return c.shapes.length > 0
    ? { ...base, shapes: c.shapes }
    : { ...base, set: c.set };
}
