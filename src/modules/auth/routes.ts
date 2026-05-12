import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
    meta: {
      title: 'Login | Turtle Front'
    }
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('./pages/RegisterPage.vue'),
    meta: {
      title: 'Register | Turtle Front'
    }
  }
]
