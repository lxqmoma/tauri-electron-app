import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'electron-vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      // 配置自动导入
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: true,
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true,
      }),
    ],
  },
})
