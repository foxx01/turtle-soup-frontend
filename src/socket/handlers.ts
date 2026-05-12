import {
  CHAT_SOCKET_EVENTS,
  GAME_SOCKET_EVENTS,
  ROOM_SOCKET_EVENTS,
  SOCKET_CONNECTION_EVENTS
} from './events'
import type { SocketEventHandlerMap, SocketStoreBindings } from './types'

export function createSocketEventHandlers(bindings: SocketStoreBindings): SocketEventHandlerMap {
  return {
    [SOCKET_CONNECTION_EVENTS.CONNECT]: () => {
      bindings.app?.onConnected?.()
    },
    [SOCKET_CONNECTION_EVENTS.DISCONNECT]: (reason) => {
      bindings.app?.onDisconnected?.(reason)
    },
    [SOCKET_CONNECTION_EVENTS.CONNECT_ERROR]: (error) => {
      bindings.app?.onError?.(error)
    },
    [SOCKET_CONNECTION_EVENTS.RECONNECT]: (attempt) => {
      bindings.app?.onReconnect?.(attempt)
    },
    [ROOM_SOCKET_EVENTS.JOINED]: (payload) => {
      bindings.room?.onRoomJoined?.(payload)
    },
    [ROOM_SOCKET_EVENTS.LEFT]: (payload) => {
      bindings.room?.onRoomLeft?.(payload)
    },
    [ROOM_SOCKET_EVENTS.UPDATED]: (payload) => {
      bindings.room?.onRoomUpdated?.(payload)
    },
    [ROOM_SOCKET_EVENTS.MEMBER_UPDATED]: (payload) => {
      bindings.room?.onRoomMemberUpdated?.(payload)
    },
    [CHAT_SOCKET_EVENTS.MESSAGE]: (payload) => {
      bindings.chat?.onChatMessage?.(payload)
    },
    [CHAT_SOCKET_EVENTS.HISTORY]: (payload) => {
      bindings.chat?.onChatHistory?.(payload)
    },
    [GAME_SOCKET_EVENTS.QUESTION]: (payload) => {
      bindings.game?.onQuestionReceived?.(payload)
    },
    [GAME_SOCKET_EVENTS.EVENT]: (payload) => {
      bindings.game?.onGameEvent?.(payload)
    },
    [GAME_SOCKET_EVENTS.SNAPSHOT]: (payload) => {
      bindings.game?.onGameSnapshot?.(payload)
    }
  }
}

export function createSocketStoreBindings(bindings: SocketStoreBindings): SocketStoreBindings {
  return bindings
}
