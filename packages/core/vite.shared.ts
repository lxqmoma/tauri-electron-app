import type { UserConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export function createSharedViteConfig(rootDir: string): UserConfig {
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        resolvers: [ElementPlusResolver()],
        dts: resolve(rootDir, 'src/auto-imports.d.ts'),
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: resolve(rootDir, 'src/components.d.ts'),
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
        '@uapp/core': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 自定义 element-plus 主题或全局变量
          additionalData: `@use "@/assets/styles/variables.scss" as *;`,
          api: 'modern-compiler', // sass-loader v15+ requirement
        },
      },
    },
  }
}
