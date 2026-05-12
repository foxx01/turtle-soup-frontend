import { defineStore } from 'pinia'

import { ROOM_STATUS_LABELS } from '@/constants/labels'
import http from '@/services/http'
import { getSocket } from '@/services/socket'
import { useChatStore } from '@/stores/chat'
import { useGameStore } from '@/stores/game'

export type RoomStatus = 'waiting' | 'playing' | 'revealed' | 'finished'
export type RoomMode = 'casual' | 'ranked' | 'private'

export interface RoomMember {
  id: string
  nickname: string
  role: 'host' | 'moderator' | 'player' | 'observer'
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
      name: '午夜推理局',
      description: '适合随时开局的休闲房间，人数少也可以先开始。',
      mode: 'casual',
      status: 'waiting',
      memberCount: 4,
      capacity: 8,
      hostName: '小七'
    },
    {
      id: 'bravo',
      name: '竞技排位房',
      description: '正在进行中的多人对战房间。',
      mode: 'ranked',
      status: 'playing',
      memberCount: 6,
      capacity: 6,
      hostName: '米琪'
    },
    {
      id: 'charlie',
      name: '好友私密房',
      description: '预留给受邀玩家加入的私密房间。',
      mode: 'private',
      status: 'finished',
      memberCount: 2,
      capacity: 5,
      hostName: '阿澜'
    }
  ]
}

function createFallbackRoomSummary(roomId: string): RoomSummary {
  return {
    id: roomId,
    name: `房间 ${roomId.toUpperCase()}`,
    description: '这是一个等待后端房间详情同步的占位房间。',
    mode: 'casual',
    status: 'waiting',
    memberCount: 1,
    capacity: 8,
    hostName: '小七'
  }
}

function createMockRoomDetail(summary: RoomSummary): RoomDetail {
  return {
    ...summary,
    members: [
      { id: 'user-001', nickname: summary.hostName, role: 'host', online: true, ready: true },
      { id: 'user-002', nickname: '阿澜', role: 'moderator', online: true, ready: true },
      { id: 'user-003', nickname: '米琪', role: 'player', online: true, ready: false },
      { id: 'user-004', nickname: '诺拉', role: 'observer', online: true, ready: false }
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
    roomStatusLabel: (state) =>
      state.currentRoom ? ROOM_STATUS_LABELS[state.currentRoom.status] : '未知状态'
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
          hostName: '你'
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
