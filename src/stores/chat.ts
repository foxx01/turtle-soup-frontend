import { defineStore } from 'pinia'

import http from '@/services/http'
import { getSocket } from '@/services/socket'

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  kind: 'system' | 'player'
  createdAt: string
}

interface ChatState {
  activeRoomId: string | null
  messageMap: Record<string, ChatMessage[]>
  draftMap: Record<string, string>
  unreadMap: Record<string, number>
  sending: boolean
  connected: boolean
  lastMessageAt: string | null
}

function createMockMessages(roomId: string): ChatMessage[] {
  return [
    {
      id: `${roomId}-msg-1`,
      roomId,
      senderId: 'system',
      senderName: '系统',
      content: '房间频道已初始化，聊天记录已准备就绪。',
      kind: 'system',
      createdAt: new Date().toISOString()
    },
    {
      id: `${roomId}-msg-2`,
      roomId,
      senderId: 'user-002',
      senderName: '阿澜',
      content: '等房主开始这一局。',
      kind: 'player',
      createdAt: new Date().toISOString()
    }
  ]
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    activeRoomId: null,
    messageMap: {},
    draftMap: {},
    unreadMap: {},
    sending: false,
    connected: false,
    lastMessageAt: null
  }),

  getters: {
    activeMessages: (state) =>
      state.activeRoomId ? state.messageMap[state.activeRoomId] ?? [] : [],
    activeDraft: (state) => (state.activeRoomId ? state.draftMap[state.activeRoomId] ?? '' : ''),
    activeUnread: (state) => (state.activeRoomId ? state.unreadMap[state.activeRoomId] ?? 0 : 0),
    hasActiveMessages: (state) =>
      state.activeRoomId ? (state.messageMap[state.activeRoomId] ?? []).length > 0 : false
  },

  actions: {
    setActiveRoom(roomId: string | null) {
      this.activeRoomId = roomId
    },

    async initializeRoomChannel(roomId: string) {
      this.setActiveRoom(roomId)
      await this.loadRoomMessages(roomId)
      this.attachChatSocketListeners(roomId)
      this.markRoomRead(roomId)
    },

    async loadRoomMessages(roomId: string) {
      await Promise.resolve(http.defaults.baseURL)

      this.messageMap = {
        ...this.messageMap,
        [roomId]: createMockMessages(roomId)
      }
      this.lastMessageAt = new Date().toISOString()
    },

    setDraft(roomId: string, draft: string) {
      this.draftMap = {
        ...this.draftMap,
        [roomId]: draft
      }
    },

    async sendMessage(payload: { roomId: string; senderId: string; senderName: string; content: string }) {
      this.sending = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const message: ChatMessage = {
          id: `${payload.roomId}-${Date.now()}`,
          roomId: payload.roomId,
          senderId: payload.senderId,
          senderName: payload.senderName,
          content: payload.content,
          kind: 'player',
          createdAt: new Date().toISOString()
        }

        this.receiveMessage(message)
        this.setDraft(payload.roomId, '')

        const socket = getSocket()
        socket.emit('chat:send', message)
      } finally {
        this.sending = false
      }
    },

    receiveMessage(message: ChatMessage) {
      const nextMessages = [...(this.messageMap[message.roomId] ?? []), message]

      this.messageMap = {
        ...this.messageMap,
        [message.roomId]: nextMessages
      }

      if (this.activeRoomId !== message.roomId) {
        this.unreadMap = {
          ...this.unreadMap,
          [message.roomId]: (this.unreadMap[message.roomId] ?? 0) + 1
        }
      }

      this.lastMessageAt = message.createdAt
    },

    markRoomRead(roomId: string) {
      this.unreadMap = {
        ...this.unreadMap,
        [roomId]: 0
      }
    },

    attachChatSocketListeners(roomId: string) {
      const socket = getSocket()

      socket.off('chat:message')
      socket.on('chat:message', (message: ChatMessage) => {
        if (message.roomId === roomId) {
          this.receiveMessage(message)
        }
      })

      this.connected = true
    },

    detachChatSocketListeners() {
      const socket = getSocket()
      socket.off('chat:message')
      this.connected = false
    },

    closeRoomChannel(roomId: string) {
      this.detachChatSocketListeners()

      if (this.activeRoomId === roomId) {
        this.activeRoomId = null
      }
    },

    resetState() {
      this.activeRoomId = null
      this.messageMap = {}
      this.draftMap = {}
      this.unreadMap = {}
      this.sending = false
      this.connected = false
      this.lastMessageAt = null
    }
  }
})
