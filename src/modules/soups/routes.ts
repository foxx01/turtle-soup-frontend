import type { RouteRecordRaw } from 'vue-router'

export const soupsRoutes: RouteRecordRaw[] = [
  {
    path: 'soups',
    name: 'soups',
    component: () => import('./pages/SoupsPage.vue'),
    meta: {
      title: '题库',
      activeMenu: '/soups'
    }
  }
]
