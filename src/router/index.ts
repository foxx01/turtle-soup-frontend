import { createRouter, createWebHistory } from 'vue-router'

import { APP_TITLE } from '@/constants/labels'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : APP_TITLE
  document.title = title
})

export default router
