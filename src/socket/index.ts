import { io } from 'socket.io-client'

import { createSocketEventHandlers } from './handlers'
import {
  CHAT_SOCKET_EVENTS,
  GAME_SOCKET_EVENTS,
  ROOM_SOCKET_EVENTS
} from './events'
import type {
  AppSocket,
  ChatMessagePayload,
  ClientToServerEvents,
  GameActionPayload,
  GameQuestionPayload,
  RoomJoinPayload,
  RoomLeavePayload,
  ServerToClientEvents,
  SocketEventHandlerMap,
  SocketEventName,
  SocketListener,
  SocketManagerOptions,
  SocketStoreBindings
} from './types'

class SocketManager {
  private socket: AppSocket | null = null
  private handlers: SocketEventHandlerMap = {}

  private createSocket(options: SocketManagerOptions = {}) {
    return io(import.meta.env.VITE_SOCKET_URL || '/', {
      autoConnect: false,
      reconnection: true,
      transports: ['websocket'],
      ...options
    }) as AppSocket
  }

  getSocket(options: SocketManagerOptions = {}) {
    if (!this.socket) {
      this.socket = this.createSocket(options)
    }

    return this.socket
  }

  connect(options: SocketManagerOptions = {}) {
    const socket = this.getSocket(options)

    if (!socket.connected) {
      socket.connect()
    }

    return socket
  }

  disconnect() {
    if (!this.socket) {
      return
    }

    this.unbindHandlers()
    this.socket.disconnect()
  }

  reconnect() {
    const socket = this.getSocket()

    this.unbindHandlers()

    if (socket.connected) {
      socket.disconnect()
    }

    socket.connect()

    return socket
  }

  emit<EventName extends keyof ClientToServerEvents>(
    event: EventName,
    ...args: Parameters<ClientToServerEvents[EventName]>
  ) {
    const socket = this.getSocket()
    ;(socket.emit as (...payload: any[]) => void)(event, ...args)
  }

  on(event: SocketEventName, handler: SocketListener) {
    const socket = this.getSocket()
    ;(socket.on as (eventName: string, listener: SocketListener) => AppSocket)(event, handler)

    return () => {
      this.off(event, handler)
    }
  }

  off(event: SocketEventName, handler?: SocketListener) {
    const socket = this.getSocket()

    if (handler) {
      ;(socket.off as (eventName: string, listener: SocketListener) => AppSocket)(event, handler)
      return
    }

    socket.removeAllListeners(event)
  }

  bindHandlers(bindings: SocketStoreBindings) {
    const socket = this.getSocket()
    const nextHandlers = createSocketEventHandlers(bindings)

    this.unbindHandlers()

    for (const [eventName, handler] of Object.entries(nextHandlers)) {
      if (!handler) {
        continue
      }

      const typedEvent = eventName as SocketEventName
      const typedHandler = handler as SocketListener

      ;(socket.on as (eventName: string, listener: SocketListener) => AppSocket)(
        typedEvent,
        typedHandler
      )
      this.handlers[typedEvent] = typedHandler
    }
  }

  unbindHandlers() {
    if (!this.socket) {
      this.handlers = {}
      return
    }

    for (const [eventName, handler] of Object.entries(this.handlers)) {
      if (!handler) {
        continue
      }

      ;(this.socket.off as (eventName: string, listener: SocketListener) => AppSocket)(
        eventName,
        handler as SocketListener
      )
    }

    this.handlers = {}
  }

  joinRoom(payload: RoomJoinPayload) {
    this.emit(ROOM_SOCKET_EVENTS.JOIN, payload)
  }

  leaveRoom(payload: RoomLeavePayload) {
    this.emit(ROOM_SOCKET_EVENTS.LEAVE, payload)
  }

  sendChatMessage(payload: ChatMessagePayload) {
    this.emit(CHAT_SOCKET_EVENTS.SEND_MESSAGE, payload)
  }

  sendQuestion(payload: GameQuestionPayload) {
    this.emit(GAME_SOCKET_EVENTS.SEND_QUESTION, payload)
  }

  sendGameAction(payload: GameActionPayload) {
    this.emit(GAME_SOCKET_EVENTS.ACTION, payload)
  }
}

export const socketManager = new SocketManager()

export function getSocket(options: SocketManagerOptions = {}) {
  return socketManager.getSocket(options)
}

export function connectSocket(options: SocketManagerOptions = {}) {
  return socketManager.connect(options)
}

export function disconnectSocket() {
  socketManager.disconnect()
}

export function reconnectSocket() {
  return socketManager.reconnect()
}

export function bindSocketStoreHandlers(bindings: SocketStoreBindings) {
  socketManager.bindHandlers(bindings)
}

export function unbindSocketStoreHandlers() {
  socketManager.unbindHandlers()
}

export * from './events'
export * from './handlers'
export * from './types'
