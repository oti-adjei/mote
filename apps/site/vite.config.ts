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
    },
  },
});
