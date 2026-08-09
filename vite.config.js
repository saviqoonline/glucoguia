import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El sitio se sirve desde https://saviqoonline.github.io/glucoguia/,
// por lo que los assets deben resolverse contra esa subruta.
export default defineConfig({
  plugins: [react()],
  base: '/glucoguia/',
});
