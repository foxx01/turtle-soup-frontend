import type { RouteRecordRaw } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { adminRoutes } from '@/modules/admin/routes'
import { authRoutes } from '@/modules/auth/routes'
import { homeRoutes } from '@/modules/home/routes'
import { lobbyRoutes } from '@/modules/lobby/routes'
import { notFoundRoutes } from '@/modules/not-found/routes'
import { profileRoutes } from '@/modules/profile/routes'
import { roomRoutes } from '@/modules/room/routes'
import { soupsRoutes } from '@/modules/soups/routes'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      ...homeRoutes,
      ...soupsRoutes,
      ...lobbyRoutes,
      ...roomRoutes,
      ...profileRoutes,
      ...adminRoutes
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    children: authRoutes
  },
  ...notFoundRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found-fallback',
    redirect: '/404'
  }
]
