import type { RouteRecordRaw } from 'vue-router'

export const lobbyRoutes: RouteRecordRaw[] = [
  {
    path: 'lobby',
    name: 'lobby',
    component: () => import('./pages/LobbyPage.vue'),
    meta: {
      title: '房间大厅',
      activeMenu: '/lobby'
    }
  },
  {
    path: 'lobby/create',
    name: 'create-room',
    component: () => import('./pages/CreateRoomPage.vue'),
    meta: {
      title: '创建房间',
      activeMenu: '/lobby'
    }
  }
]
