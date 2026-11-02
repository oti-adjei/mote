import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const page = (name: string): string =>
  new URL(`./${name}.html`, import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // One entry per screen, as the design handoff requires: each page is a
      // real document, not a client-routed view. No SPA fallback needed, and
      // a visitor only downloads the page they asked for.
      input: {
        index: page('index'),
        playground: page('playground'),
        packs: page('packs'),
        examples: page('examples'),
        docs: page('docs'),
        pro: page('pro'),
        roadmap: page('roadmap'),
      },
    },
  },
  resolve: {
    // Point at source, not dist, so the playground hot-reloads when the
    // engine changes. This is also the fastest way to see motion work.
    alias: {
      '@usemote/core': new URL('../../packages/core/src/index.ts', import.meta.url).pathname,
      '@usemote/react': new URL('../../packages/react/src/index.ts', import.meta.url).pathname,
      '@usemote/media': new URL('../../packages/media/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-esports': new URL('../../packages/pack-esports/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-space': new URL('../../packages/pack-space/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-cyber': new URL('../../packages/pack-cyber/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-health': new URL('../../packages/pack-health/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-education': new URL('../../packages/pack-education/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-devtools': new URL('../../packages/pack-devtools/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-ai': new URL('../../packages/pack-ai/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-fintech': new URL('../../packages/pack-fintech/src/index.ts', import.meta.url).pathname,
      '@usemote/pack-creative': new URL('../../packages/pack-creative/src/index.ts', import.meta.url).pathname,
    },
  },
});
