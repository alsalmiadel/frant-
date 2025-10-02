// © 2024 SmartStartAI. All rights reserved.
// SPDX-License-Identifier: LicenseRef-SmartStartAI-Proprietary

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(async () => {
  const plugins = [react()]
  if (process.env.ANALYZE === 'true') {
    try {
      const { visualizer } = await import('rollup-plugin-visualizer')
      plugins.push(visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }) as any)
    } catch (e) {
      // ignore if visualizer not installed in CI
    }
  }

  return {
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    plugins,
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['js-cookie', 'gray-matter', 'marked', 'yup', 'zod'],
            motion: ['framer-motion'],
            icons: ['lucide-react'],
          }
        }
      }
    }
  }
})