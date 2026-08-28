import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    outDir: mode === 'site' ? 'dist/site' : 'dist/app',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: { output: { manualChunks: undefined } },
  },
  define: {
    __SITE_BUILD__: JSON.stringify(mode === 'site'),
  },
}));
