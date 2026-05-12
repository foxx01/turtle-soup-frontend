import type { RouteRecordRaw } from 'vue-router'

export const lobbyRoutes: RouteRecordRaw[] = [
  {
    path: 'lobby',
    name: 'lobby',
    component: () => import('./pages/LobbyPage.vue'),
    meta: {
      title: 'Lobby | Turtle Front',
      activeMenu: '/lobby'
    }
  },
  {
    path: 'lobby/create',
    name: 'create-room',
    component: () => import('./pages/CreateRoomPage.vue'),
    meta: {
      title: 'Create Room | Turtle Front',
      activeMenu: '/lobby'
    }
  }
]
