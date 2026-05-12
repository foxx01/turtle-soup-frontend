import type { RouteRecordRaw } from 'vue-router'

export const notFoundRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'not-found',
    component: () => import('./pages/NotFoundPage.vue'),
    meta: {
      title: 'Not Found | Turtle Front'
    }
  }
]
