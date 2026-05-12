import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'admin',
    name: 'admin',
    component: () => import('./pages/AdminPage.vue'),
    meta: {
      title: '管理后台',
      activeMenu: '/admin'
    }
  }
]
