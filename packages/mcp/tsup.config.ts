import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'es2022',
  banner: { js: '#!/usr/bin/env node' },
  external: ['@modelcontextprotocol/sdk'],
});
