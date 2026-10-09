import { copyFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /<repo>/, so the workflow sets VITE_BASE_PATH.
// Locally it stays at /.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    {
      name: 'github-pages-spa',
      apply: 'build',
      closeBundle() {
        // Project pages have no SPA fallback. Serving the app as 404.html keeps
        // routes like /about working on refresh.
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
})
