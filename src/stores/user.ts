import { defineStore } from 'pinia'

import http from '@/services/http'

export interface UserStats {
  gamesPlayed: number
  wins: number
  rating: number
  badges: number
}

export interface UserPreferences {
  locale: string
  soundEnabled: boolean
  notificationsEnabled: boolean
  preferredRoomCapacity: number
}

export interface UserProfile {
  id: string
  username: string
  nickname: string
  email: string
  avatar: string
  bio: string
  roles: string[]
  stats: UserStats
  preferences: UserPreferences
}

interface UserState {
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
  lastFetchedAt: string | null
}

function createMockProfile(userId = 'user-001', nickname = 'Turtle Player'): UserProfile {
  return {
    id: userId,
    username: 'turtle.player',
    nickname,
    email: 'player@example.com',
    avatar: '',
    bio: 'Ready to join rooms, solve rounds and sync profile settings later.',
    roles: ['player'],
    stats: {
      gamesPlayed: 128,
      wins: 42,
      rating: 1680,
      badges: 9
    },
    preferences: {
      locale: 'zh-CN',
      soundEnabled: true,
      notificationsEnabled: true,
      preferredRoomCapacity: 6
    }
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
    initialized: false,
    lastFetchedAt: null
  }),

  getters: {
    isProfileReady: (state) => Boolean(state.profile),
    displayName: (state) => state.profile?.nickname || state.profile?.username || 'Guest',
    userRoles: (state) => state.profile?.roles ?? [],
    preferredRoomCapacity: (state) => state.profile?.preferences.preferredRoomCapacity ?? 6
  },

  actions: {
    setProfile(profile: UserProfile | null) {
      this.profile = profile
      this.initialized = true
      this.lastFetchedAt = profile ? new Date().toISOString() : null
    },

    hydrateCurrentUserMock(userId: string, nickname?: string) {
      this.setProfile(createMockProfile(userId, nickname))
    },

    async fetchCurrentUser(userId: string) {
      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)
        this.setProfile(createMockProfile(userId))
      } finally {
        this.loading = false
      }
    },

    async updateProfile(payload: Partial<Pick<UserProfile, 'nickname' | 'bio' | 'avatar' | 'email'>>) {
      if (!this.profile) {
        return
      }

      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        this.profile = {
          ...this.profile,
          ...payload
        }
        this.lastFetchedAt = new Date().toISOString()
      } finally {
        this.loading = false
      }
    },

    async updatePreferences(payload: Partial<UserPreferences>) {
      if (!this.profile) {
        return
      }

      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        this.profile = {
          ...this.profile,
          preferences: {
            ...this.profile.preferences,
            ...payload
          }
        }
        this.lastFetchedAt = new Date().toISOString()
      } finally {
        this.loading = false
      }
    },

    clearProfile() {
      this.profile = null
      this.loading = false
      this.initialized = false
      this.lastFetchedAt = null
    }
  }
})
