/** The playground: live prop editing, seed shuffle, permalink, copy-out. */
import { FloatingField } from '@usemote/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AVOIDS, DIRECTIONS, MODES, PACKS, SETS, THEMES,
  type Config, type PackId, decode, encode, isConfigHash, stageColors, toFieldProps,
} from './config.js';
import { generate, type Target } from './codegen.js';

const TARGETS: Array<[Target, string]> = [
  ['react', 'REACT'],
  ['html', 'HTML'],
  ['core', 'CORE JS'],
];

export function Studio(): React.ReactElement {
  const [config, setConfig] = useState<Config>(() => decode(window.location.hash));
  const [target, setTarget] = useState<Target>('react');
  const [copied, setCopied] = useState(false);

  // The hash is the share mechanism, so keep it current — replaceState, not
  // pushState, or every slider nudge becomes a back-button step.
  //
  // It is only claimed once the user actually changes something. Writing it on
  // mount would overwrite an anchor the visitor followed to get here, so
  // `/#roadmap` would bounce straight back to `/#pack=…` and lose their place.
  const touched = useRef(isConfigHash(window.location.hash));
  useEffect(() => {
    if (!touched.current) return;
    window.history.replaceState(null, '', `#${encode(config)}`);
  }, [config]);

  const set = <K extends keyof Config>(key: K, value: Config[K]): void => {
    touched.current = true;
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const pack = PACKS[config.packId];
  const stage = stageColors(config.packId, config.theme);
  const code = useMemo(() => generate(config, target), [config, target]);
  const fieldProps = useMemo(() => toFieldProps(config), [config]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const toggleShape = (id: string): void => {
    touched.current = true;
    setConfig((c) => ({
      ...c,
      shapes: c.shapes.includes(id) ? c.shapes.filter((s) => s !== id) : [...c.shapes, id],
    }));
  };

  return (
    <>
      <div className="section-head">
        <h2>Playground</h2>
        <span className="meta">CONFIG LIVES IN THE URL — COPY THE LINK TO SHARE</span>
      </div>

      <div className="studio">
        <div className="panel">
          <div className="field-row">
            <label htmlFor="pack">Pack</label>
            <select
              id="pack"
              value={config.packId}
              onChange={(e) => {
                touched.current = true;
                setConfig((c) => ({ ...c, packId: e.target.value as PackId, shapes: [] }));
              }}
            >
              {Object.entries(PACKS).map(([id, p]) => (
                <option key={id} value={id}>{p.name} · {p.shapes.length} shapes</option>
              ))}
            </select>
          </div>

          {pack.description && (
            <div style={{ font: '400 12px/1.45 var(--font)', color: 'var(--mute)', marginTop: -8 }}>
              {pack.description}
              {pack.swatches && (
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {pack.swatches.map((c) => (
                    <span key={c} title={c} style={{
                      width: 18, height: 18, borderRadius: 4, background: c,
                      border: '1px solid rgba(18,18,18,.15)',
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="field-row">
            <label htmlFor="mode">Behaviour</label>
            <select id="mode" value={config.mode} onChange={(e) => set('mode', e.target.value as Config['mode'])}>
              {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {config.mode === 'across' && (
            <div className="field-row">
              <label htmlFor="dir">Direction</label>
              <select id="dir" value={config.direction} onChange={(e) => set('direction', e.target.value as Config['direction'])}>
                {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          <div className="field-row">
            <label htmlFor="set">Set {config.shapes.length > 0 && <span>overridden</span>}</label>
            <select id="set" value={config.set} disabled={config.shapes.length > 0} onChange={(e) => set('set', e.target.value as Config['set'])}>
              {SETS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field-row">
            <label>
              Shapes
              {config.shapes.length > 0 && (
                <button className="chip" onClick={() => set('shapes', [])}>clear</button>
              )}
            </label>
            <div className="chips">
              {pack.shapes.map((s) => (
                <button
                  key={s.id}
                  className="chip"
                  aria-pressed={config.shapes.includes(s.id)}
                  onClick={() => toggleShape(s.id)}
                  title={s.label}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <label htmlFor="theme">Theme</label>
            <select id="theme" value={config.theme} onChange={(e) => set('theme', e.target.value)}>
              {THEMES.filter((t) => pack.themes?.[t]).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="field-row">
            <label htmlFor="count"><span>Count</span><span>{config.count}</span></label>
            <input id="count" type="range" min={1} max={80} value={config.count} onChange={(e) => set('count', Number(e.target.value))} />
          </div>

          <div className="field-row">
            <label htmlFor="size"><span>Size</span><span>{config.size}px</span></label>
            <input id="size" type="range" min={16} max={200} value={config.size} onChange={(e) => set('size', Number(e.target.value))} />
          </div>

          <div className="field-row">
            <label htmlFor="speed"><span>Speed</span><span>{config.speed.toFixed(1)}×</span></label>
            <input id="speed" type="range" min={0} max={3} step={0.1} value={config.speed} onChange={(e) => set('speed', Number(e.target.value))} />
          </div>

          <div className="field-row">
            <label htmlFor="avoid">Avoid region</label>
            <select id="avoid" value={config.avoid} onChange={(e) => set('avoid', e.target.value as Config['avoid'])}>
              {AVOIDS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="field-row">
            <label htmlFor="seed"><span>Seed</span><span>{config.seed}</span></label>
            <div className="row">
              <input id="seed" type="number" min={0} value={config.seed} onChange={(e) => set('seed', Number(e.target.value) || 0)} />
              <button className="btn ghost" onClick={() => set('seed', Math.floor(Math.random() * 100000))}>
                Shuffle
              </button>
            </div>
          </div>

          <label className="toggle">
            <input type="checkbox" checked={config.depth} onChange={(e) => set('depth', e.target.checked)} />
            Depth — far shapes smaller, slower, blurred
          </label>

          <label className="toggle">
            <input type="checkbox" checked={config.interactive} onChange={(e) => set('interactive', e.target.checked)} />
            Interactive — responds to the cursor
          </label>
        </div>

        <div>
          <div className="stage" style={{ background: stage.bg }}>
            {config.mode === 'gravity' && <span className="hint">CLICK TO THROW</span>}
            {config.mode !== 'gravity' && config.interactive && <span className="hint">MOVE YOUR CURSOR</span>}
            <FloatingField key={config.packId} {...fieldProps} />
            {config.avoid === 'center' && (
              <div className="stage-caption">
                <div className="big" style={{ color: stage.ink }}>
                  {pack.name}
                </div>
              </div>
            )}
          </div>

          <div className="tabs">
            {TARGETS.map(([id, label]) => (
              <button key={id} className="tab" aria-selected={target === id} onClick={() => setTarget(id)}>
                {label}
              </button>
            ))}
            <button className="btn ghost" style={{ marginLeft: 'auto' }} onClick={copy}>
              {copied ? 'Copied' : 'Copy code'}
            </button>
          </div>
          <pre className="code">{code}</pre>
        </div>
      </div>
    </>
  );
}
