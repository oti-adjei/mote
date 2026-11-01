/** Shape browser — every shape in both packs, at its real aspect ratio. */
import { BASE_PACK, type ShapeColors, type ShapeDef } from '@usemote/core';
import { esports } from '@usemote/pack-esports';

const GEO_COLORS: ShapeColors[] = [
  { f: '#d4ff1e', d: '#121212' },
  { f: '#f2f2ee', d: '#121212' },
];
const OBJ_COLORS: ShapeColors[] = [
  { f: '#121212', d: '#d4ff1e' },
  { f: '#d4ff1e', d: '#121212' },
];

function Tile({ shape, colors, dark }: { shape: ShapeDef; colors: ShapeColors; dark: boolean }) {
  const box = 84 * Math.min(1.15, shape.scale ?? 1);
  const w = shape.ar >= 1 ? box : box * shape.ar;
  const h = shape.ar >= 1 ? box / shape.ar : box;
  return (
    <div className={`shape-tile ${dark ? 'dark' : 'lightbg'}`}>
      <div className="art">
        <div
          style={{ width: `${Math.round(w)}px`, height: `${Math.round(h)}px` }}
          dangerouslySetInnerHTML={{ __html: shape.render(colors, shape.variants?.[0]) }}
        />
      </div>
      <div className="cap">
        <span className="id">{shape.label}</span>
        <span>{shape.id}</span>
      </div>
    </div>
  );
}

export function Library(): React.ReactElement {
  return (
    <>
      <div className="section-head">
        <h2>Library</h2>
        <span className="meta">
          {BASE_PACK.shapes.length} GEOMETRIC · {esports.shapes.length} ESPORTS · USE IDS IN shapes="…"
        </span>
      </div>

      <div className="eyebrow" style={{ marginBottom: 12 }}>Base pack — geometric</div>
      <div className="shape-grid">
        {BASE_PACK.shapes.map((s, i) => (
          <Tile key={s.id} shape={s} colors={GEO_COLORS[i % 2]!} dark />
        ))}
      </div>

      <div className="eyebrow" style={{ margin: '28px 0 12px' }}>Esports pack — objects</div>
      <div className="shape-grid">
        {esports.shapes.map((s, i) => (
          <Tile key={s.id} shape={s} colors={OBJ_COLORS[i % 2]!} dark={false} />
        ))}
      </div>
    </>
  );
}
