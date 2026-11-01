# tools

One-shot porting scripts for the eight industry packs, kept because they
record exactly how the designer's source became TypeScript.

- **`extract-design-packs.cjs`** — runs the design-canvas pack source under a
  stub of its `F` helper object and captures each pack, recovering exact
  render-function bodies via `Function.prototype.toString()`.
- **`generate-packs.cjs`** — emits one `@usemote/pack-<id>` package per
  captured pack.

They are not part of the build. Re-running them needs the unpacked design
bundle (`01-Planning/research/recovered/`), which is local-only.

Both carry their fixups and rewrites as explicit tables, so every deviation
from the designer's source is visible in one place rather than hand-edited
into generated output:

| Kind | Why |
|---|---|
| `FIXUPS` | Spots where the design source leans on JS coercion or inference that `strict` TypeScript rejects. Each is output-equivalent. |
| `REWRITES` | `space/crescent` used `<defs><mask id=…>` with a global counter — forbidden (ids collide when a shape is inlined many times) and non-deterministic (server and client would disagree). Reimplemented as two circles under `fill-rule="evenodd"`. |
| `AR_FIX` | Declared aspect ratios that disagreed with the shape's own viewBox. `ar` drives layout spacing and collision. |
