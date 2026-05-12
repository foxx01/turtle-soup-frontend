import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'
export type SocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected'

export interface NavigationItem {
  label: string
  key: string
}

export interface AppNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description: string
  createdAt: string
}

interface AppState {
  projectName: string
  themeMode: ThemeMode
  sidebarCollapsed: boolean
  pageLoading: boolean
  socketStatus: SocketStatus
  navigation: NavigationItem[]
  notifications: AppNotification[]
}

function createNotification(
  payload: Omit<AppNotification, 'id' | 'createdAt'>
): AppNotification {
  return {
    id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...payload
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    projectName: 'Turtle Front',
    themeMode: 'light',
    sidebarCollapsed: false,
    pageLoading: false,
    socketStatus: 'idle',
    navigation: [
      { label: 'Home', key: '/' },
      { label: 'Soups', key: '/soups' },
      { label: 'Lobby', key: '/lobby' },
      { label: 'Profile', key: '/profile' },
      { label: 'Admin', key: '/admin' }
    ],
    notifications: [
      createNotification({
        type: 'info',
        title: 'Scaffold Ready',
        description: 'Base layouts, routes and stores are ready for feature work.'
      })
    ]
  }),

  getters: {
    navigationCount: (state) => state.navigation.length,
    latestNotification: (state) => state.notifications[0] ?? null,
    isRealtimeConnected: (state) => state.socketStatus === 'connected'
  },

  actions: {
    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode
    },

    toggleSidebar(force?: boolean) {
      this.sidebarCollapsed = typeof force === 'boolean' ? force : !this.sidebarCollapsed
    },

    setPageLoading(loading: boolean) {
      this.pageLoading = loading
    },

    setSocketStatus(status: SocketStatus) {
      this.socketStatus = status
    },

    pushNotification(payload: Omit<AppNotification, 'id' | 'createdAt'>) {
      this.notifications.unshift(createNotification(payload))
      this.notifications = this.notifications.slice(0, 8)
    },

    removeNotification(notificationId: string) {
      this.notifications = this.notifications.filter((item) => item.id !== notificationId)
    },

    clearNotifications() {
      this.notifications = []
    },

    async bootstrapApp() {
      this.setPageLoading(true)

      try {
        await Promise.resolve()
      } finally {
        this.setPageLoading(false)
      }
    }
  }
})
