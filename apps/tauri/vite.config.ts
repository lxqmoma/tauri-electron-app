import { resolve } from 'node:path'
import { defineConfig } from 'vite'
/* eslint-disable node/prefer-global/process */
import { createSharedViteConfig } from '../../packages/core/vite.shared'

const coreRoot = resolve(__dirname, '../../packages/core')

const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  ...createSharedViteConfig(coreRoot),
  root: __dirname,
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
