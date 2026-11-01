# @usemote/mcp

MCP server for [Mote](https://mote.hearvie.dev), so coding agents can discover
shapes, packs and presets and generate correct code.

```json
{
  "mcpServers": {
    "mote": { "command": "npx", "args": ["-y", "@usemote/mcp"] }
  }
}
```

## Tools

| Tool | Does |
|---|---|
| `mote_list_packs` | Packs with shape counts and themes |
| `mote_list_shapes` | Every shape id, for `shapes="a,b,c"` |
| `mote_list_presets` | Motion presets and when to use each |
| `mote_snippet` | Ready-to-paste React / HTML / core JS |
| `mote_explain_field` | What a config produces, plus engine warnings |
| `mote_preview_svg` | Frame-0 SVG for inspection or an OG image |
| `mote_check_pack` | Static check of pack source against the authoring rules |

`mote_check_pack` does **not** execute the source it is given.

An agent skill covering the same ground is at [`SKILL.md`](./SKILL.md).

## Inspiration

Architecturally modelled on **[Navii](https://github.com/uxderrick/navii)** by
**[Derrick Tsorme](https://github.com/uxderrick)** — a deterministic avatar
engine, and the reason this project exists. No code is shared; the debt is
architectural, and it is a large one. If you need avatars, use Navii.

## License

MIT
