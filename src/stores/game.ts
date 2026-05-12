import { defineStore } from 'pinia'

import { ANSWER_TYPE_LABELS, GAME_PHASE_LABELS } from '@/constants/labels'
import http from '@/services/http'
import { getSocket } from '@/services/socket'

export type GamePhase = 'idle' | 'waiting' | 'countdown' | 'playing' | 'settlement' | 'finished'

export interface GameScoreItem {
  userId: string
  nickname: string
  score: number
}

export interface GameActionRecord {
  id: string
  roomId: string
  actorId: string
  actorName: string
  type: 'submit' | 'skip' | 'system'
  content: string
  createdAt: string
}

export interface FormalQuestion {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  status: 'pending' | 'answered' | 'skipped'
  createdAt: string
  answeredAt: string | null
}

export interface AnswerRecord {
  id: string
  roomId: string
  questionId: string
  responderName: string
  outcome: 'yes' | 'no' | 'irrelevant' | 'partial'
  content: string
  createdAt: string
}

interface GameState {
  currentRoomId: string | null
  phase: GamePhase
  currentRound: number
  totalRounds: number
  timerSeconds: number
  soupTitle: string
  prompt: string
  hostHint: string
  scoreboard: GameScoreItem[]
  questionList: FormalQuestion[]
  answerRecords: AnswerRecord[]
  actionHistory: GameActionRecord[]
  loading: boolean
  connected: boolean
  lastEventAt: string | null
}

function createMockScoreboard(): GameScoreItem[] {
  return [
    { userId: 'user-001', nickname: '主持人小七', score: 120 },
    { userId: 'user-002', nickname: '阿澜', score: 110 },
    { userId: 'user-003', nickname: '米琪', score: 95 }
  ]
}

function createMockQuestions(roomId: string): FormalQuestion[] {
  return [
    {
      id: `${roomId}-question-1`,
      roomId,
      senderId: 'user-002',
      senderName: '阿澜',
      content: '主角进入现场之前，关键事件是不是已经发生了？',
      status: 'answered',
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      answeredAt: new Date(Date.now() - 1000 * 60 * 6).toISOString()
    },
    {
      id: `${roomId}-question-2`,
      roomId,
      senderId: 'user-003',
      senderName: '米琪',
      content: '关键线索是不是和误会有关，而不是犯罪行为本身？',
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      answeredAt: null
    }
  ]
}

function createMockAnswerRecords(roomId: string): AnswerRecord[] {
  return [
    {
      id: `${roomId}-answer-1`,
      roomId,
      questionId: `${roomId}-question-1`,
      responderName: '主持人小七',
      outcome: 'yes',
      content: '是。真正关键的事情在主角注意到之前就已经发生了。',
      createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString()
    }
  ]
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    currentRoomId: null,
    phase: 'idle',
    currentRound: 0,
    totalRounds: 5,
    timerSeconds: 0,
    soupTitle: '',
    prompt: '',
    hostHint: '',
    scoreboard: [],
    questionList: [],
    answerRecords: [],
    actionHistory: [],
    loading: false,
    connected: false,
    lastEventAt: null
  }),

  getters: {
    isGameActive: (state) => ['countdown', 'playing', 'settlement'].includes(state.phase),
    canSubmitAction: (state) => state.phase === 'playing',
    formattedTimer: (state) => {
      const minutes = Math.floor(state.timerSeconds / 60)
      const seconds = state.timerSeconds % 60

      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    },
    leaderBoard: (state) => [...state.scoreboard].sort((a, b) => b.score - a.score),
    phaseLabel: (state) => GAME_PHASE_LABELS[state.phase],
    pendingQuestions: (state) => state.questionList.filter((item) => item.status === 'pending'),
    answeredQuestions: (state) => state.questionList.filter((item) => item.status === 'answered'),
    latestAnswerRecord: (state) => state.answerRecords.at(-1) ?? null
  },

  actions: {
    async initializeForRoom(roomId: string) {
      this.currentRoomId = roomId
      await this.fetchGameSnapshot(roomId)
      this.attachGameSocketListeners(roomId)
    },

    async fetchGameSnapshot(roomId: string) {
      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        this.currentRoomId = roomId
        this.phase = 'waiting'
        this.currentRound = 1
        this.totalRounds = 5
        this.timerSeconds = 0
        this.soupTitle = '被打开的便当盒'
        this.prompt =
          '一个人在公司茶水间打开便当盒，说了句“又来了”，随后立刻辞职。为什么？'
        this.hostHint = '主持人只回答“是 / 否 / 无关 / 部分相关”，不要直接解释谜底。'
        this.scoreboard = createMockScoreboard()
        this.questionList = createMockQuestions(roomId)
        this.answerRecords = createMockAnswerRecords(roomId)
        this.actionHistory = [
          {
            id: `${roomId}-action-1`,
            roomId,
            actorId: 'system',
            actorName: '系统',
            type: 'system',
            content: '游戏快照已初始化。',
            createdAt: new Date().toISOString()
          }
        ]
        this.lastEventAt = new Date().toISOString()
      } finally {
        this.loading = false
      }
    },

    async submitAction(payload: {
      roomId: string
      actorId: string
      actorName: string
      content: string
      type?: 'submit' | 'skip'
    }) {
      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const action: GameActionRecord = {
          id: `${payload.roomId}-${Date.now()}`,
          roomId: payload.roomId,
          actorId: payload.actorId,
          actorName: payload.actorName,
          type: payload.type ?? 'submit',
          content: payload.content,
          createdAt: new Date().toISOString()
        }

        this.receiveGameEvent(action)

        const socket = getSocket()
        socket.emit('game:action', action)
      } finally {
        this.loading = false
      }
    },

    async submitQuestion(payload: {
      roomId: string
      senderId: string
      senderName: string
      content: string
    }) {
      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const question: FormalQuestion = {
          id: `${payload.roomId}-question-${Date.now()}`,
          roomId: payload.roomId,
          senderId: payload.senderId,
          senderName: payload.senderName,
          content: payload.content,
          status: 'pending',
          createdAt: new Date().toISOString(),
          answeredAt: null
        }

        this.questionList = [...this.questionList, question]

        const socket = getSocket()
        socket.emit('game:question:send', {
          roomId: payload.roomId,
          content: payload.content,
          questionId: question.id,
          createdAt: question.createdAt
        })
      } finally {
        this.loading = false
      }
    },

    async respondToQuestion(payload: {
      roomId: string
      questionId: string
      responderName: string
      outcome: AnswerRecord['outcome']
      content: string
    }) {
      this.loading = true

      try {
        await Promise.resolve(http.defaults.baseURL)

        const answeredAt = new Date().toISOString()
        this.questionList = this.questionList.map((question) =>
          question.id === payload.questionId
            ? {
                ...question,
                status: 'answered',
                answeredAt
              }
            : question
        )

        const answerRecord: AnswerRecord = {
          id: `${payload.roomId}-answer-${Date.now()}`,
          roomId: payload.roomId,
          questionId: payload.questionId,
          responderName: payload.responderName,
          outcome: payload.outcome,
          content: payload.content,
          createdAt: answeredAt
        }

        this.answerRecords = [...this.answerRecords, answerRecord]
        this.receiveGameEvent({
          id: `${payload.roomId}-host-${Date.now()}`,
          roomId: payload.roomId,
          actorId: 'host',
          actorName: payload.responderName,
          type: 'system',
          content: `主持人已用“${ANSWER_TYPE_LABELS[payload.outcome]}”回答问题。`,
          createdAt: answeredAt
        })
      } finally {
        this.loading = false
      }
    },

    startRoundCountdown(seconds = 90) {
      this.phase = 'countdown'
      this.timerSeconds = seconds
      this.lastEventAt = new Date().toISOString()
    },

    settleRound() {
      this.phase = 'settlement'
      this.lastEventAt = new Date().toISOString()
    },

    advanceRound() {
      if (this.currentRound < this.totalRounds) {
        this.currentRound += 1
        this.phase = 'countdown'
        this.timerSeconds = 90
      } else {
        this.phase = 'finished'
      }

      this.lastEventAt = new Date().toISOString()
    },

    receiveGameEvent(event: GameActionRecord) {
      this.actionHistory = [...this.actionHistory, event]

      if (event.type === 'submit') {
        this.phase = 'playing'
      }

      this.lastEventAt = event.createdAt
    },

    attachGameSocketListeners(roomId: string) {
      const socket = getSocket()

      socket.off('game:question')
      socket.off('game:event')
      socket.on('game:question', (question: { roomId: string; questionId?: string; content: string; createdAt: string }) => {
        if (question.roomId !== roomId) {
          return
        }

        this.questionList = [
          ...this.questionList,
          {
            id: question.questionId ?? `${roomId}-question-${Date.now()}`,
            roomId,
            senderId: 'remote-player',
            senderName: '其他玩家',
            content: question.content,
            status: 'pending',
            createdAt: question.createdAt,
            answeredAt: null
          }
        ]
      })
      socket.on('game:event', (event: GameActionRecord) => {
        if (event.roomId === roomId) {
          this.receiveGameEvent(event)
        }
      })

      this.connected = true
    },

    detachGameSocketListeners() {
      const socket = getSocket()
      socket.off('game:question')
      socket.off('game:event')
      this.connected = false
    },

    resetState() {
      this.detachGameSocketListeners()
      this.currentRoomId = null
      this.phase = 'idle'
      this.currentRound = 0
      this.totalRounds = 5
      this.timerSeconds = 0
      this.soupTitle = ''
      this.prompt = ''
      this.hostHint = ''
      this.scoreboard = []
      this.questionList = []
      this.answerRecords = []
      this.actionHistory = []
      this.loading = false
      this.lastEventAt = null
    }
  }
})
