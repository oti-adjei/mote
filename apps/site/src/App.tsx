import { FloatingField } from '@usemote/react';
import { BASE_PACK } from '@usemote/core';
import { esports } from '@usemote/pack-esports';
import { Studio } from './Studio.js';
import { Packs } from './Packs.js';
import { Frames } from './Frames.js';
import { Gallery } from './Gallery.js';
import { Library } from './Library.js';

export function App(): React.ReactElement {
  return (
    <div className="wrap">
      <header style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#121212', color: '#f2f2ee', padding: '96px 40px', marginBottom: 8 }}>
        <FloatingField packs={[BASE_PACK]} mode="drift" set="geo" theme="mono" count={30} size={46} seed={31} depth />
        <FloatingField
          packs={[esports]} mode="bob"
          shapes="controller,trophy,keycap,gg,score,live,medal"
          count={7} size={92} seed={17} avoid="center"
        />
        <div style={{ position: 'relative', textAlign: 'center', pointerEvents: 'none' }}>
          <div className="eyebrow" style={{ color: '#8a8a85' }}>Mote · a background for every section</div>
          <h1 style={{ margin: '18px 0' }}>Floating shapes</h1>
          <p className="lede" style={{ color: '#c9c9c3', margin: '0 auto' }}>
            Nine shape packs, seven motion behaviours. Deterministic,
            accessible, and 7.9 kB — it fills its parent and sits behind
            your content.
          </p>
        </div>
      </header>

      <Studio />
      <Packs />
      <Frames />
      <Gallery />
      <Library />

      <footer>
        <p>
          <strong>Mote</strong> is open source. Its architecture is modelled on{' '}
          <a href="https://github.com/uxderrick/navii">Navii</a> by{' '}
          <a href="https://uxderrick.com">Derrick Tsorme</a> — a deterministic avatar
          engine, and the reason this project exists. If you need avatars, use Navii.
        </p>
      </footer>
    </div>
  );
}
