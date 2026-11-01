import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    treeshake: true,
    target: 'es2022',
    external: ['@usemote/core'],
  },
  {
    // Self-contained CDN build: core and the built-in packs are bundled in,
    // because a <script> tag user has no bundler to resolve imports for them.
    entry: { mote: 'src/global.ts' },
    format: ['iife'],
    globalName: 'Mote',
    minify: true,
    target: 'es2022',
    noExternal: [/.*/],
  },
]);
