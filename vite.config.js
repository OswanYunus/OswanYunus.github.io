import { defineConfig } from 'vite';

// base './' lets the built site work from any sub-path (GitHub Pages, Netlify, etc.)
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 900 },
});
