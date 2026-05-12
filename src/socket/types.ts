import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

import {
  CHAT_SOCKET_EVENTS,
  GAME_SOCKET_EVENTS,
  ROOM_SOCKET_EVENTS,
  SOCKET_CONNECTION_EVENTS
} from './events'

export type SocketConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'

export interface RoomJoinPayload {
  roomId: string
  userId?: string
}

export interface RoomLeavePayload {
  roomId: string
  userId?: string
}

export interface RoomMemberPayload {
  id: string
  nickname: string
  role: 'host' | 'moderator' | 'player' | 'observer'
  online: boolean
  ready: boolean
}

export interface RoomSnapshotPayload {
  id: string
  name: string
  description: string
  mode: 'casual' | 'ranked' | 'private'
  status: 'waiting' | 'playing' | 'revealed' | 'finished'
  memberCount: number
  capacity: number
  hostName: string
  members: RoomMemberPayload[]
}

export interface RoomJoinedPayload {
  roomId: string
  snapshot: RoomSnapshotPayload
}

export interface RoomLeftPayload {
  roomId: string
  userId?: string
}

export interface ChatMessagePayload {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  kind: 'system' | 'player'
  createdAt: string
}

export interface ChatHistoryPayload {
  roomId: string
  messages: ChatMessagePayload[]
}

export interface GameQuestionPayload {
  roomId: string
  questionId?: string
  content: string
  createdAt: string
}

export interface GameActionPayload {
  id: string
  roomId: string
  actorId: string
  actorName: string
  type: 'submit' | 'skip' | 'system'
  content: string
  createdAt: string
}

export interface GameScorePayload {
  userId: string
  nickname: string
  score: number
}

export interface GameSnapshotPayload {
  roomId: string
  phase: 'idle' | 'waiting' | 'countdown' | 'playing' | 'settlement' | 'finished'
  currentRound: number
  totalRounds: number
  timerSeconds: number
  prompt: string
  scoreboard: GameScorePayload[]
  actionHistory: GameActionPayload[]
}

export interface SocketErrorPayload {
  message: string
  code?: string
}

export interface ClientToServerEvents {
  [ROOM_SOCKET_EVENTS.JOIN]: (payload: RoomJoinPayload) => void
  [ROOM_SOCKET_EVENTS.LEAVE]: (payload: RoomLeavePayload) => void
  [CHAT_SOCKET_EVENTS.SEND_MESSAGE]: (payload: ChatMessagePayload) => void
  [GAME_SOCKET_EVENTS.SEND_QUESTION]: (payload: GameQuestionPayload) => void
  [GAME_SOCKET_EVENTS.ACTION]: (payload: GameActionPayload) => void
}

export interface ServerToClientEvents {
  [SOCKET_CONNECTION_EVENTS.CONNECT]: () => void
  [SOCKET_CONNECTION_EVENTS.DISCONNECT]: (reason: string) => void
  [SOCKET_CONNECTION_EVENTS.CONNECT_ERROR]: (error: Error) => void
  [SOCKET_CONNECTION_EVENTS.RECONNECT]: (attempt: number) => void
  [ROOM_SOCKET_EVENTS.JOINED]: (payload: RoomJoinedPayload) => void
  [ROOM_SOCKET_EVENTS.LEFT]: (payload: RoomLeftPayload) => void
  [ROOM_SOCKET_EVENTS.UPDATED]: (payload: RoomSnapshotPayload) => void
  [ROOM_SOCKET_EVENTS.MEMBER_UPDATED]: (payload: RoomMemberPayload & { roomId: string }) => void
  [CHAT_SOCKET_EVENTS.MESSAGE]: (payload: ChatMessagePayload) => void
  [CHAT_SOCKET_EVENTS.HISTORY]: (payload: ChatHistoryPayload) => void
  [GAME_SOCKET_EVENTS.QUESTION]: (payload: GameQuestionPayload) => void
  [GAME_SOCKET_EVENTS.EVENT]: (payload: GameActionPayload) => void
  [GAME_SOCKET_EVENTS.SNAPSHOT]: (payload: GameSnapshotPayload) => void
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type SocketManagerOptions = Partial<ManagerOptions & SocketOptions>

export interface SocketStoreBindings {
  app?: {
    onConnecting?: () => void
    onConnected?: () => void
    onDisconnected?: (reason: string) => void
    onReconnect?: (attempt: number) => void
    onError?: (error: Error) => void
  }
  room?: {
    onRoomJoined?: (payload: RoomJoinedPayload) => void
    onRoomLeft?: (payload: RoomLeftPayload) => void
    onRoomUpdated?: (payload: RoomSnapshotPayload) => void
    onRoomMemberUpdated?: (payload: RoomMemberPayload & { roomId: string }) => void
  }
  game?: {
    onGameSnapshot?: (payload: GameSnapshotPayload) => void
    onGameEvent?: (payload: GameActionPayload) => void
    onQuestionReceived?: (payload: GameQuestionPayload) => void
  }
  chat?: {
    onChatMessage?: (payload: ChatMessagePayload) => void
    onChatHistory?: (payload: ChatHistoryPayload) => void
  }
}

export type SocketEventName = keyof ServerToClientEvents
export type SocketListener = (...args: any[]) => void
export type SocketEventHandlerMap = Partial<Record<SocketEventName, SocketListener>>
