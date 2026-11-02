import { FloatingField } from '@usemote/react';
import { randomSeed } from '@usemote/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../shell/Layout.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import {
  AVOIDS, DIRECTIONS, MODES, SETS, SIGNATURE,
  type Config, decode, encode, isConfigHash, packFor, packLabel, stageColors, toFieldProps,
} from '../lib/config.js';
import { ALL_PACKS } from '../lib/packs.js';
import { aiPrompt, generate, type Target } from '../lib/codegen.js';

const TARGETS: Array<[Target, string]> = [
  ['react', 'React'],
  ['html', 'HTML'],
  ['core', 'Core JS'],
];

export function Playground(): React.ReactElement {
  const [config, setConfig] = useState<Config>(() => decode(window.location.hash));
  const [target, setTarget] = useState<Target>('react');
  const [shareNote, setShareNote] = useState(
    'The preview settings travel with the link. No account needed.',
  );
  const [aiState, setAiState] = useState<'idle' | 'copied' | 'failed'>('idle');

  // The hash is claimed only after a real edit, so a link someone followed to
  // get here is not overwritten on mount.
  const touched = useRef(isConfigHash(window.location.hash));
  useEffect(() => {
    if (!touched.current) return;
    window.history.replaceState(null, '', `#${encode(config)}`);
  }, [config]);

  const set = <K extends keyof Config>(key: K, value: Config[K]): void => {
    touched.current = true;
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const pack = packFor(config.packId);
  const label = packLabel(config.packId, pack);
  const stage = stageColors(config.packId, config.theme);
  const fieldProps = useMemo(() => toFieldProps(config), [config]);
  const code = useMemo(() => generate(config, target), [config, target]);

  const reset = (): void => {
    touched.current = true;
    setConfig({ ...decode('') });
  };

  const copyLink = async (): Promise<void> => {
    const url = `${window.location.href.split('#')[0]}#${encode(config)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareNote('Link copied — it includes your current settings.');
    } catch {
      setShareNote('Copy blocked — the address bar already holds this configuration.');
    }
  };

  const copyAi = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(aiPrompt(config));
      setAiState('copied');
    } catch {
      setAiState('failed');
    }
    setTimeout(() => setAiState('idle'), 2400);
  };

  const toggleShape = (id: string): void => {
    touched.current = true;
    setConfig((c) => ({
      ...c,
      shapes: c.shapes.includes(id) ? c.shapes.filter((s) => s !== id) : [...c.shapes, id],
    }));
  };

  return (
    <Layout page="playground" title="Find your kind of motion">
      <section className="page-intro wrap">
        <div className="eyebrow">Playground</div>
        <h1>Find your kind<br />of motion.</h1>
        <p className="lead">
          Every control is live. Change anything and the code updates with it —
          the configuration lives in the address bar, so a link is the whole
          share mechanism.
        </p>
      </section>

      <div className="wrap">
        <div className="studio">
          <form className="settings settings-clean" aria-label="Field settings" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-heading">
              <h3>Your field</h3>
              <button type="button" className="reset-link" onClick={reset}>Reset</button>
            </div>

            <fieldset>
              <legend>01 / Pack</legend>
              <div className="control">
                <label htmlFor="pg-pack">Shape collection</label>
                <select
                  id="pg-pack" className="input" value={config.packId}
                  onChange={(e) => {
                    touched.current = true;
                    setConfig((c) => ({ ...c, packId: e.target.value as Config['packId'], shapes: [] }));
                  }}
                >
                  {Object.entries(ALL_PACKS).map(([id, p]) => (
                    <option key={id} value={id}>
                      {packLabel(id, p)} · {p.shapes.length}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            <fieldset id="appearance-settings">
              <legend>02 / Appearance</legend>
              <div className="control">
                <label htmlFor="pg-theme">Palette</label>
                <select
                  id="pg-theme" className="input" value={config.theme}
                  onChange={(e) => set('theme', e.target.value)}
                >
                  <option value={SIGNATURE}>Mote signature</option>
                  {Object.keys(pack.themes ?? {}).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="control">
                <label htmlFor="pg-set">
                  <span>Set</span>
                  {config.shapes.length > 0 && <span className="muted">overridden</span>}
                </label>
                <select
                  id="pg-set" className="input" value={config.set}
                  disabled={config.shapes.length > 0}
                  onChange={(e) => set('set', e.target.value as Config['set'])}
                >
                  {SETS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="control">
                <label htmlFor="pg-count"><span>Count</span><output>{config.count}</output></label>
                <input
                  id="pg-count" type="range" min={1} max={80} value={config.count}
                  onChange={(e) => set('count', Number(e.target.value))}
                />
              </div>
              <div className="control">
                <label htmlFor="pg-size"><span>Size</span><output>{config.size}px</output></label>
                <input
                  id="pg-size" type="range" min={16} max={200} value={config.size}
                  onChange={(e) => set('size', Number(e.target.value))}
                />
              </div>
            </fieldset>

            <fieldset id="motion-settings">
              <legend>03 / Motion</legend>
              <div className="control">
                <label htmlFor="pg-mode">Behaviour</label>
                <select
                  id="pg-mode" className="input" value={config.mode}
                  onChange={(e) => set('mode', e.target.value as Config['mode'])}
                >
                  {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {config.mode === 'across' && (
                <div className="control">
                  <label htmlFor="pg-dir">Direction</label>
                  <select
                    id="pg-dir" className="input" value={config.direction}
                    onChange={(e) => set('direction', e.target.value as Config['direction'])}
                  >
                    {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              <div className="control">
                <label htmlFor="pg-speed"><span>Speed</span><output>{config.speed.toFixed(1)}×</output></label>
                <input
                  id="pg-speed" type="range" min={0} max={3} step={0.1} value={config.speed}
                  onChange={(e) => set('speed', Number(e.target.value))}
                />
              </div>
            </fieldset>

            <details className="advanced-settings">
              <summary>Advanced</summary>
              <fieldset id="advanced-fields">
                <legend className="sr-only">Advanced settings</legend>
                <div className="control">
                  <label htmlFor="pg-avoid">Keep clear</label>
                  <select
                    id="pg-avoid" className="input" value={config.avoid}
                    onChange={(e) => set('avoid', e.target.value as Config['avoid'])}
                  >
                    {AVOIDS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="control">
                  <label htmlFor="pg-seed"><span>Seed</span><output>{config.seed}</output></label>
                  <input
                    id="pg-seed" className="input" type="number" min={0} value={config.seed}
                    onChange={(e) => set('seed', Number(e.target.value) || 0)}
                  />
                </div>
                <button
                  className="btn quiet small" type="button"
                  onClick={() => set('seed', randomSeed())}
                >
                  Shuffle the seed ↻
                </button>
                <div className="control check" style={{ marginTop: 20 }}>
                  <label>
                    <input
                      type="checkbox" checked={config.depth}
                      onChange={(e) => set('depth', e.target.checked)}
                    />
                    Depth variation
                  </label>
                </div>
                <div className="control check">
                  <label>
                    <input
                      type="checkbox" checked={config.interactive}
                      onChange={(e) => set('interactive', e.target.checked)}
                    />
                    Follow the cursor
                  </label>
                </div>
                <div className="control">
                  <label id="pg-shapes-label">Shape picks</label>
                  <div className="chip-wrap" id="pg-shapes" aria-labelledby="pg-shapes-label">
                    {pack.shapes.map((s) => (
                      <button
                        key={s.id} className="chip" type="button"
                        aria-pressed={config.shapes.includes(s.id)}
                        onClick={() => toggleShape(s.id)}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                  {config.shapes.length > 0 && (
                    <button
                      className="btn quiet small" type="button"
                      style={{ marginTop: 12 }}
                      onClick={() => set('shapes', [])}
                    >
                      Clear shape picks
                    </button>
                  )}
                </div>
              </fieldset>
            </details>
          </form>

          <div className="studio-main">
            <div className="preview-heading">
              <div>
                <span className="eyebrow">Live study</span>
                <h3>{label}</h3>
              </div>
              <span className="preview-badge">Live engine</span>
            </div>

            <div className="play-stage" style={{ background: stage.bg }}>
              <FloatingField className="field" key={config.packId} {...fieldProps} />
              {config.avoid === 'center' && (
                <div className="stage-caption">
                  <strong style={{ color: stage.ink }}>{label}</strong>
                  <span style={{ color: stage.ink, opacity: 0.7 }}>
                    {config.mode} · seed {config.seed}
                  </span>
                </div>
              )}
              <span className="play-label">
                {config.mode === 'gravity'
                  ? 'Click to throw'
                  : config.interactive ? 'Move your cursor' : 'Motion only'}
              </span>
            </div>

            <div className="studio-toolbar">
              <div className="actions">
                <button
                  className="btn quiet small" type="button"
                  onClick={() => set('seed', randomSeed())}
                >
                  Shuffle seed ↻
                </button>
                <button className="btn quiet small" type="button" onClick={copyLink}>
                  Copy preview link ↗
                </button>
              </div>
              <button className="btn dark small" type="button" onClick={copyAi}>
                {aiState === 'copied' ? 'Prompt copied' : aiState === 'failed' ? 'Copy blocked' : 'Copy AI prompt'}
              </button>
            </div>
            <p className="small muted" role="status">{shareNote}</p>

            <div className="tab-row" role="tablist" aria-label="Code target">
              {TARGETS.map(([id, tLabel]) => (
                <button
                  key={id} className="tab" role="tab" type="button"
                  aria-selected={target === id}
                  onClick={() => setTarget(id)}
                >
                  {tLabel}
                </button>
              ))}
            </div>

            <CodeBlock id="pg-code" label={`${target} · generated`} code={code} />
            <p className="inline-note">
              Pre-release: the packages in this snippet are not on npm yet.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
