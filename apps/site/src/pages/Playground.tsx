import { FloatingField } from '@usemote/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../shell/Layout.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import {
  AVOIDS, DIRECTIONS, MODES, SETS, THEMES,
  type Config, decode, encode, isConfigHash, packFor, stageColors, toFieldProps,
} from '../lib/config.js';
import { ALL_PACKS } from '../lib/packs.js';
import { generate, type Target } from '../lib/codegen.js';

const TARGETS: Array<[Target, string]> = [
  ['react', 'React'],
  ['html', 'HTML'],
  ['core', 'Core JS'],
];

export function Playground(): React.ReactElement {
  const [config, setConfig] = useState<Config>(() => decode(window.location.hash));
  const [target, setTarget] = useState<Target>('react');

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
  const stage = stageColors(config.packId, config.theme);
  const fieldProps = useMemo(() => toFieldProps(config), [config]);
  const code = useMemo(() => generate(config, target), [config, target]);

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
          <aside className="settings" aria-label="Field settings">
            <h3>Make it yours.</h3>

            <div className="control">
              <label htmlFor="pg-pack">Pack</label>
              <select
                id="pg-pack" className="input" value={config.packId}
                onChange={(e) => {
                  touched.current = true;
                  setConfig((c) => ({ ...c, packId: e.target.value as Config['packId'], shapes: [] }));
                }}
              >
                {Object.entries(ALL_PACKS).map(([id, p]) => (
                  <option key={id} value={id}>
                    {p.name} · {p.shapes.length}
                  </option>
                ))}
              </select>
            </div>

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
              <label htmlFor="pg-theme">Theme</label>
              <select
                id="pg-theme" className="input" value={config.theme}
                onChange={(e) => set('theme', e.target.value)}
              >
                {THEMES.filter((t) => pack.themes?.[t]).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="control">
              <label htmlFor="pg-count"><span>Count</span><span>{config.count}</span></label>
              <input
                id="pg-count" type="range" min={1} max={80} value={config.count}
                onChange={(e) => set('count', Number(e.target.value))}
              />
            </div>

            <div className="control">
              <label htmlFor="pg-size"><span>Size</span><span>{config.size}px</span></label>
              <input
                id="pg-size" type="range" min={16} max={200} value={config.size}
                onChange={(e) => set('size', Number(e.target.value))}
              />
            </div>

            <div className="control">
              <label htmlFor="pg-speed"><span>Speed</span><span>{config.speed.toFixed(1)}×</span></label>
              <input
                id="pg-speed" type="range" min={0} max={3} step={0.1} value={config.speed}
                onChange={(e) => set('speed', Number(e.target.value))}
              />
            </div>

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
              <label htmlFor="pg-seed"><span>Seed</span><span>{config.seed}</span></label>
              <input
                id="pg-seed" className="input" type="number" min={0} value={config.seed}
                onChange={(e) => set('seed', Number(e.target.value) || 0)}
              />
            </div>

            <button
              className="btn quiet small" type="button"
              onClick={() => set('seed', Math.floor(Math.random() * 100000))}
            >
              Shuffle the seed
            </button>

            <div className="control check" style={{ marginTop: 24 }}>
              <label>
                <input
                  type="checkbox" checked={config.depth}
                  onChange={(e) => set('depth', e.target.checked)}
                />
                Depth
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
              <label htmlFor="pg-shapes">Shapes</label>
              <div className="chip-wrap" id="pg-shapes">
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
          </aside>

          <div className="studio-main">
            <div className="play-stage" style={{ background: stage.bg }}>
              <FloatingField className="field" key={config.packId} {...fieldProps} />
              {config.avoid === 'center' && (
                <div className="stage-caption">
                  <strong style={{ color: stage.ink }}>{pack.name}</strong>
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
              <div className="tab-row" role="tablist" aria-label="Code target">
                {TARGETS.map(([id, label]) => (
                  <button
                    key={id} className="tab" role="tab" type="button"
                    aria-selected={target === id}
                    onClick={() => setTarget(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
