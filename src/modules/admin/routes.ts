import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'admin',
    name: 'admin',
    component: () => import('./pages/AdminPage.vue'),
    meta: {
      title: 'Admin | Turtle Front',
      activeMenu: '/admin'
    }
  }
]
