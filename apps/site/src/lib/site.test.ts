/** Logic tests for the site's config encoding, code generation and AI prompt. */
import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '@usemote/core';
import { PACKS, packAccent } from './packs.js';
import {
  DEFAULT_CONFIG, SIGNATURE, decode, encode, isConfigHash, toFieldProps,
  type Config,
} from './config.js';
import { aiPrompt, generate } from './codegen.js';
import { SITE_LIGHT } from './theme.js';

describe('playground config', () => {
  it('defaults to Mote default on the signature palette', () => {
    expect(DEFAULT_CONFIG.packId).toBe('base');
    expect(DEFAULT_CONFIG.theme).toBe(SIGNATURE);
    expect(decode('')).toEqual(DEFAULT_CONFIG);
  });

  it('round-trips through the URL hash', () => {
    const config: Config = {
      ...DEFAULT_CONFIG,
      packId: 'esports',
      mode: 'across' as const,
      direction: 'left' as const,
    };
    expect(decode(`#${encode(config)}`)).toEqual(config);
  });

  it('recognises a config hash but not an anchor link', () => {
    expect(isConfigHash('#pack=esports')).toBe(true);
    expect(isConfigHash('#roadmap')).toBe(false);
  });

  it('resolves the signature palette to the site stops', () => {
    const props = toFieldProps({ ...DEFAULT_CONFIG, theme: SIGNATURE });
    expect(props.theme).toEqual(SITE_LIGHT);
  });

  it('keeps real pack themes as strings', () => {
    const props = toFieldProps({ ...DEFAULT_CONFIG, packId: 'esports', theme: 'lime' } satisfies Config);
    expect(props.theme).toBe('lime');
  });
});

describe('generated code', () => {
  it('imports BASE_PACK from core for the Mote default field', () => {
    const code = generate(DEFAULT_CONFIG, 'react');
    expect(code).toContain("import { BASE_PACK } from '@usemote/core'");
    expect(code).toContain('packs={[BASE_PACK]}');
  });

  it('omits the site signature palette — it is not an engine theme', () => {
    expect(generate(DEFAULT_CONFIG, 'react')).not.toContain('theme');
  });

  it('emits the pack import and theme for a themed pack', () => {
    const code = generate({ ...DEFAULT_CONFIG, packId: 'esports', theme: 'lime' } satisfies Config, 'core');
    expect(code).toContain("import { esports } from '@usemote/pack-esports'");
    expect(code).toContain("theme: 'lime'");
  });
});

describe('AI prompt', () => {
  it('describes the default field deterministically', () => {
    const text = aiPrompt(DEFAULT_CONFIG);
    expect(text).toContain('Mote default');
    expect(text).toContain('drift');
    expect(text).toContain(`Seed: ${DEFAULT_CONFIG.seed}`);
    expect(text).toContain('signature palette');
  });

  it('names the pack and picked shapes for a themed field', () => {
    const text = aiPrompt({
      ...DEFAULT_CONFIG,
      packId: 'space',
      theme: 'dark',
      shapes: ['rocket', 'comet'],
    } satisfies Config);
    expect(text).toContain('pack (@usemote/pack-space)');
    expect(text).toContain('rocket, comet');
    expect(text).toContain("dark theme");
  });
});

/** The base pack really is the default field's shape source. */
describe('base pack sanity', () => {
  it('has the geometric primitives the site fields draw', () => {
    const ids = BASE_PACK.shapes.map((s) => s.id);
    expect(ids).toContain('circle');
    expect(ids).toContain('ring');
    expect(ids.length).toBeGreaterThanOrEqual(13);
  });
});

describe('pack accent (card tint)', () => {
  it('picks a vivid mid-tone for every pack, never ink or paper', () => {
    for (const entry of PACKS) {
      const accent = packAccent(entry.pack);
      const hex = accent.replace('#', '');
      const n = parseInt(hex, 16);
      const r = ((n >> 16) & 255) / 255;
      const g = ((n >> 8) & 255) / 255;
      const b = (n & 255) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
      // Every accent is a colour, not a neutral: saturated, mid-lightness.
      expect(s, `${entry.id}: ${accent} is not vivid`).toBeGreaterThan(0.5);
      expect(l, `${entry.id}: ${accent} is ink or paper`).toBeGreaterThan(0.12);
      expect(l, `${entry.id}: ${accent} is ink or paper`).toBeLessThan(0.92);
    }
  });
});
