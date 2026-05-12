import { defineStore } from 'pinia'

import { APP_TITLE } from '@/constants/labels'
import http from '@/services/http'
import { getSocket } from '@/services/socket'
import { useAppStore } from '@/stores/app'
import { useChatStore } from '@/stores/chat'
import { useGameStore } from '@/stores/game'
import { useRoomStore } from '@/stores/room'
import { useUserStore } from '@/stores/user'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  accessToken: string
  refreshToken: string
  currentUserId: string | null
  currentUserName: string
  isAuthenticated: boolean
  authLoading: boolean
  initialized: boolean
  socketConnected: boolean
  lastLoginAt: string | null
}

function createMockTokens(): AuthTokens {
  const timestamp = Date.now()

  return {
    accessToken: `mock-access-token-${timestamp}`,
    refreshToken: `mock-refresh-token-${timestamp}`
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: '',
    refreshToken: '',
    currentUserId: null,
    currentUserName: '',
    isAuthenticated: false,
    authLoading: false,
    initialized: false,
    socketConnected: false,
    lastLoginAt: null
  }),

  getters: {
    hasSession: (state) => state.isAuthenticated && Boolean(state.accessToken),
    bearerToken: (state) => (state.accessToken ? `Bearer ${state.accessToken}` : ''),
    currentSessionUser: (state) =>
      state.currentUserId
        ? {
            id: state.currentUserId,
            name: state.currentUserName
          }
        : null
  },

  actions: {
    applySession(payload: {
      userId: string
      username: string
      tokens: AuthTokens
    }) {
      this.accessToken = payload.tokens.accessToken
      this.refreshToken = payload.tokens.refreshToken
      this.currentUserId = payload.userId
      this.currentUserName = payload.username
      this.isAuthenticated = true
      this.initialized = true
      this.lastLoginAt = new Date().toISOString()
    },

    clearSession() {
      this.accessToken = ''
      this.refreshToken = ''
      this.currentUserId = null
      this.currentUserName = ''
      this.isAuthenticated = false
      this.socketConnected = false
      this.lastLoginAt = null
    },

    async restoreSession() {
      this.authLoading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const tokens = createMockTokens()
        this.applySession({
          userId: 'user-001',
          username: '海龟玩家',
          tokens
        })

        useUserStore().hydrateCurrentUserMock('user-001', '海龟玩家')
      } finally {
        this.initialized = true
        this.authLoading = false
      }
    },

    async login(payload: { username: string; password: string }) {
      this.authLoading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const tokens = createMockTokens()
        this.applySession({
          userId: 'user-001',
          username: payload.username || '海龟玩家',
          tokens
        })

        useUserStore().hydrateCurrentUserMock('user-001', payload.username || '海龟玩家')
        useAppStore().pushNotification({
          type: 'success',
          title: '登录成功',
          description: `已进入 ${APP_TITLE}。当前仍是模拟登录流程，后续可替换为真实接口。`
        })
      } finally {
        this.authLoading = false
      }
    },

    async register(payload: { username: string; password: string }) {
      this.authLoading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        useAppStore().pushNotification({
          type: 'success',
          title: '注册成功',
          description: `账号 ${payload.username} 已创建，现在可以继续登录。`
        })
      } finally {
        this.authLoading = false
      }
    },

    connectRealtime() {
      const appStore = useAppStore()
      const socket = getSocket()

      appStore.setSocketStatus('connecting')

      socket.off('connect')
      socket.off('disconnect')

      socket.on('connect', () => {
        this.socketConnected = true
        appStore.setSocketStatus('connected')
      })

      socket.on('disconnect', () => {
        this.socketConnected = false
        appStore.setSocketStatus('disconnected')
      })

      if (!socket.connected) {
        socket.connect()
      }
    },

    disconnectRealtime() {
      const appStore = useAppStore()
      const socket = getSocket()

      socket.off('connect')
      socket.off('disconnect')

      if (socket.connected) {
        socket.disconnect()
      }

      this.socketConnected = false
      appStore.setSocketStatus('disconnected')
    },

    async logout() {
      this.authLoading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        this.disconnectRealtime()
        useRoomStore().resetState()
        useGameStore().resetState()
        useChatStore().resetState()
        useUserStore().clearProfile()
        this.clearSession()

        useAppStore().pushNotification({
          type: 'info',
          title: '已退出登录',
          description: '会话状态和房间相关数据已重置。'
        })
      } finally {
        this.authLoading = false
        this.initialized = true
      }
    }
  }
})
