import { isElectron } from '@renderer/utils/env'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@renderer/views/Home.vue'),
  },
]

// Electron 使用 hash 模式，Web 使用 history 模式
const router = createRouter({
  history: isElectron()
    ? createWebHashHistory()
    : createWebHistory('/uapp-web/'),
  routes,
})

export default router
