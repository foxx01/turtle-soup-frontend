import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('./pages/RegisterPage.vue'),
    meta: {
      title: '注册'
    }
  }
]
