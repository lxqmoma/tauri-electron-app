import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { createSharedViteConfig } from '../../packages/core/vite.shared'

// Core 包的根目录
const coreRoot = resolve(__dirname, '../../packages/core')

export default defineConfig({
  ...createSharedViteConfig(coreRoot),
  root: __dirname,
  base: './', // 确保相对路径，方便部署
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
