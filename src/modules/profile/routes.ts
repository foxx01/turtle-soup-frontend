import type { RouteRecordRaw } from 'vue-router'

export const profileRoutes: RouteRecordRaw[] = [
  {
    path: 'profile',
    name: 'profile',
    component: () => import('./pages/ProfilePage.vue'),
    meta: {
      title: '个人中心',
      activeMenu: '/profile'
    }
  }
]
