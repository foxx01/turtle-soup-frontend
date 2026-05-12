import { defineStore } from 'pinia'

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
          username: 'Turtle Player',
          tokens
        })

        useUserStore().hydrateCurrentUserMock('user-001', 'Turtle Player')
      } finally {
        this.initialized = true
        this.authLoading = false
      }
    },

    async login(payload: { account: string; password: string }) {
      this.authLoading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const tokens = createMockTokens()
        this.applySession({
          userId: 'user-001',
          username: payload.account || 'Turtle Player',
          tokens
        })

        useUserStore().hydrateCurrentUserMock('user-001', 'Turtle Player')
        useAppStore().pushNotification({
          type: 'success',
          title: 'Login Success',
          description: 'Mock login finished. Replace this action with a real API call later.'
        })
      } finally {
        this.authLoading = false
      }
    },

    async register(payload: { nickname: string; email: string; password: string }) {
      this.authLoading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        useAppStore().pushNotification({
          type: 'success',
          title: 'Register Success',
          description: `Mock account ${payload.nickname} is ready to continue with login flow.`
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
          title: 'Logged Out',
          description: 'Session state and room-related stores were reset.'
        })
      } finally {
        this.authLoading = false
        this.initialized = true
      }
    }
  }
})
