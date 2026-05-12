import type { RouteRecordRaw } from 'vue-router'

export const notFoundRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'not-found',
    component: () => import('./pages/NotFoundPage.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]
