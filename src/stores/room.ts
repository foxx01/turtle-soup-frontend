import { defineStore } from 'pinia'

import http from '@/services/http'
import { getSocket } from '@/services/socket'
import { useChatStore } from '@/stores/chat'
import { useGameStore } from '@/stores/game'

export type RoomStatus = 'waiting' | 'playing' | 'closed'
export type RoomMode = 'casual' | 'ranked' | 'private'

export interface RoomMember {
  id: string
  nickname: string
  role: 'host' | 'player' | 'observer'
  online: boolean
  ready: boolean
}

export interface RoomSummary {
  id: string
  name: string
  description: string
  mode: RoomMode
  status: RoomStatus
  memberCount: number
  capacity: number
  hostName: string
}

export interface RoomDetail extends RoomSummary {
  members: RoomMember[]
}

interface LobbyFilters {
  keyword: string
  mode: RoomMode | 'all'
  status: RoomStatus | 'all'
}

interface RoomState {
  rooms: RoomSummary[]
  currentRoom: RoomDetail | null
  lobbyFilters: LobbyFilters
  loading: boolean
  joining: boolean
  connected: boolean
  lastSyncedAt: string | null
}

function createMockRooms(): RoomSummary[] {
  return [
    {
      id: 'alpha',
      name: 'Alpha Squad',
      description: 'A casual room waiting for the next set of players.',
      mode: 'casual',
      status: 'waiting',
      memberCount: 4,
      capacity: 8,
      hostName: 'Kira'
    },
    {
      id: 'bravo',
      name: 'Bravo Table',
      description: 'An active ranked room with a full team.',
      mode: 'ranked',
      status: 'playing',
      memberCount: 6,
      capacity: 6,
      hostName: 'Miki'
    },
    {
      id: 'charlie',
      name: 'Charlie Night',
      description: 'A private room prepared for invited players.',
      mode: 'private',
      status: 'waiting',
      memberCount: 2,
      capacity: 5,
      hostName: 'Allen'
    }
  ]
}

function createFallbackRoomSummary(roomId: string): RoomSummary {
  return {
    id: roomId,
    name: `Room ${roomId.toUpperCase()}`,
    description: 'A synchronized room shell waiting for backend room detail.',
    mode: 'casual',
    status: 'waiting',
    memberCount: 4,
    capacity: 8,
    hostName: 'Kira'
  }
}

function createMockRoomDetail(summary: RoomSummary): RoomDetail {
  return {
    ...summary,
    members: [
      { id: 'user-001', nickname: summary.hostName, role: 'host', online: true, ready: true },
      { id: 'user-002', nickname: 'Allen', role: 'player', online: true, ready: true },
      { id: 'user-003', nickname: 'Miki', role: 'player', online: true, ready: false },
      { id: 'user-004', nickname: 'Nora', role: 'observer', online: true, ready: false }
    ]
  }
}

export const useRoomStore = defineStore('room', {
  state: (): RoomState => ({
    rooms: createMockRooms(),
    currentRoom: null,
    lobbyFilters: {
      keyword: '',
      mode: 'all',
      status: 'all'
    },
    loading: false,
    joining: false,
    connected: false,
    lastSyncedAt: null
  }),

  getters: {
    currentRoomId: (state) => state.currentRoom?.id ?? null,
    isInRoom: (state) => Boolean(state.currentRoom),
    filteredRooms: (state) =>
      state.rooms.filter((room) => {
        const byKeyword =
          state.lobbyFilters.keyword === '' ||
          room.name.toLowerCase().includes(state.lobbyFilters.keyword.toLowerCase())
        const byMode =
          state.lobbyFilters.mode === 'all' || room.mode === state.lobbyFilters.mode
        const byStatus =
          state.lobbyFilters.status === 'all' || room.status === state.lobbyFilters.status

        return byKeyword && byMode && byStatus
      }),
    onlineMemberCount: (state) =>
      state.currentRoom?.members.filter((member) => member.online).length ?? 0,
    readyMemberCount: (state) =>
      state.currentRoom?.members.filter((member) => member.ready).length ?? 0,
    roomCode: (state) => state.currentRoom?.id.toUpperCase() ?? '--',
    roomStatusLabel: (state) => {
      switch (state.currentRoom?.status) {
        case 'playing':
          return 'Playing'
        case 'closed':
          return 'Closed'
        case 'waiting':
          return 'Waiting'
        default:
          return 'Unknown'
      }
    }
  },

  actions: {
    setLobbyFilters(filters: Partial<LobbyFilters>) {
      this.lobbyFilters = {
        ...this.lobbyFilters,
        ...filters
      }
    },

    async fetchRooms() {
      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)
        this.rooms = createMockRooms()
        this.lastSyncedAt = new Date().toISOString()
      } finally {
        this.loading = false
      }
    },

    async createRoom(payload: { name: string; description: string; mode: RoomMode; capacity: number }) {
      this.joining = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const newRoom: RoomSummary = {
          id: `room-${Date.now()}`,
          name: payload.name,
          description: payload.description,
          mode: payload.mode,
          status: 'waiting',
          memberCount: 1,
          capacity: payload.capacity,
          hostName: 'You'
        }

        this.rooms = [newRoom, ...this.rooms]
        await this.joinRoom(newRoom.id)
      } finally {
        this.joining = false
      }
    },

    async joinRoom(roomId: string) {
      this.joining = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const summary = this.rooms.find((room) => room.id === roomId) ?? createFallbackRoomSummary(roomId)
        this.currentRoom = createMockRoomDetail(summary)
        this.lastSyncedAt = new Date().toISOString()

        await useGameStore().initializeForRoom(this.currentRoom.id)
        await useChatStore().initializeRoomChannel(this.currentRoom.id)
        this.attachRoomSocketListeners(this.currentRoom.id)
      } finally {
        this.joining = false
      }
    },

    async leaveCurrentRoom() {
      if (!this.currentRoom) {
        return
      }

      const roomId = this.currentRoom.id

      await Promise.resolve(http.defaults.baseURL)
      useGameStore().resetState()
      useChatStore().closeRoomChannel(roomId)
      this.detachRoomSocketListeners()
      this.currentRoom = null
      this.lastSyncedAt = new Date().toISOString()
    },

    syncRoomSnapshot(snapshot: RoomDetail) {
      this.currentRoom = snapshot
      this.lastSyncedAt = new Date().toISOString()
    },

    attachRoomSocketListeners(roomId: string) {
      const socket = getSocket()

      socket.off('room:update')
      socket.on('room:update', (snapshot: RoomDetail) => {
        if (snapshot.id === roomId) {
          this.syncRoomSnapshot(snapshot)
        }
      })

      this.connected = true
    },

    detachRoomSocketListeners() {
      const socket = getSocket()
      socket.off('room:update')
      this.connected = false
    },

    resetState() {
      this.detachRoomSocketListeners()
      this.rooms = createMockRooms()
      this.currentRoom = null
      this.lobbyFilters = {
        keyword: '',
        mode: 'all',
        status: 'all'
      }
      this.loading = false
      this.joining = false
      this.lastSyncedAt = null
    }
  }
})
