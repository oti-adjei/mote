/** MCP server exposing Mote's shape, pack and preset catalogue to agents. */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  checkPack, explainField, listPacks, listPresets, listShapes, previewSVG, snippet,
} from './tools.js';

const text = (s: string) => ({ content: [{ type: 'text' as const, text: s }] });

const fieldShape = {
  mode: z.string().optional().describe('Motion preset: static, bob, hop, drift, across, bounce, gravity'),
  pack: z.string().optional().describe('Pack name: base or esports'),
  set: z.string().optional().describe('mixed | geo | objects'),
  shapes: z.string().optional().describe('Comma-separated shape ids. Wins over set.'),
  count: z.number().optional(),
  size: z.number().optional(),
  seed: z.union([z.number(), z.string()]).optional(),
  theme: z.string().optional(),
  depth: z.boolean().optional(),
  avoid: z.string().optional().describe('none | center | top | bottom'),
  speed: z.number().optional(),
  direction: z.string().optional().describe('across only: right | left | up | down'),
};

export function createServer(): McpServer {
  const server = new McpServer({ name: 'mote', version: '0.1.0' });

  server.tool(
    'mote_list_packs',
    'List available Mote shape packs with their shape counts and themes.',
    {},
    async () => text(listPacks()),
  );

  server.tool(
    'mote_list_shapes',
    'List every shape id in a pack. Use these ids in the shapes="a,b,c" prop.',
    { pack: z.string().optional().describe('Pack name; omit for all packs') },
    async ({ pack }) => text(listShapes(pack)),
  );

  server.tool(
    'mote_list_presets',
    'List Mote motion presets and when to use each.',
    {},
    async () => text(listPresets()),
  );

  server.tool(
    'mote_snippet',
    'Generate ready-to-paste Mote code for React, plain HTML or vanilla core JS.',
    {
      framework: z.enum(['react', 'html', 'core']).optional(),
      ...fieldShape,
    },
    async (args) => text(snippet(args)),
  );

  server.tool(
    'mote_explain_field',
    'Describe what a given configuration will actually produce — shape breakdown, determinism, and any warnings — without rendering it.',
    { ...fieldShape, width: z.number().optional(), height: z.number().optional() },
    async (args) => text(explainField(args)),
  );

  server.tool(
    'mote_preview_svg',
    'Render a configuration to a static frame-0 SVG string, for inspection or an OG image.',
    { ...fieldShape, width: z.number().optional(), height: z.number().optional() },
    async (args) => text(previewSVG(args)),
  );

  server.tool(
    'mote_check_pack',
    'Statically check shape-pack source against the authoring rules. Does not execute the source.',
    { source: z.string().describe('The pack source code') },
    async ({ source }) => text(checkPack(source)),
  );

  return server;
}

export * from './tools.js';
