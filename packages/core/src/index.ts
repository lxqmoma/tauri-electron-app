import type { IPlatformBridge } from '@uapp/bridge'
import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
/**
 * 核心包入口
 */
import { createApp } from 'vue'
import AppRoot from './App.vue'
import router from './router'

import './assets/styles/index.scss'

export function createUApp(bridge?: IPlatformBridge): App {
  const app = createApp(AppRoot)

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  app.use(router)

  // 如果没有传入 bridge，尝试自动创建（但这可能无法涵盖 Tauri）
  // 实际上，为了避免自动创建时的依赖问题，我们建议 Apps 必须传入 bridge
  // 或者我们在 @uapp/core 中不直接依赖 @uapp/bridge 的实现，只依赖类型
  // 但这里为了方便，我们只对 globalProperties 做注入

  if (bridge) {
    app.config.globalProperties.$bridge = bridge
    app.provide('bridge', bridge)
  }

  return app
}

export { default as AppRoot } from './App.vue'
export * from './router'
export * from './stores'
