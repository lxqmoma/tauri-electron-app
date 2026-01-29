import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' },
  },
  // 可以添加更多路由
]

const router = createRouter({
  history: createWebHashHistory(), // 使用 Hash 模式兼容 Electron
  routes,
})

export default router
