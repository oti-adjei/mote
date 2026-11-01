import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Point at source, not dist, so the playground hot-reloads when the
    // engine changes. This is also the fastest way to see motion work.
    alias: {
      '@usemote/core': new URL('../../packages/core/src/index.ts', import.meta.url).pathname,
      '@usemote/react': new URL('../../packages/react/src/index.ts', import.meta.url).pathname,
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
