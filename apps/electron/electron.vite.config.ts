import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { createSharedViteConfig } from '../../packages/core/vite.shared'

// Core 包的根目录
const coreRoot = resolve(__dirname, '../../packages/core')
const sharedConfig = createSharedViteConfig(coreRoot) as any

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    ...sharedConfig,
    root: resolve(__dirname, 'src/renderer'),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
        },
      },
    },
  },
})
