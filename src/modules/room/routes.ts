import type { RouteRecordRaw } from 'vue-router'

export const roomRoutes: RouteRecordRaw[] = [
  {
    path: 'room/:roomId',
    name: 'room',
    component: () => import('./pages/RoomPage.vue'),
    meta: {
      title: '房间',
      activeMenu: '/lobby'
    }
  }
]
