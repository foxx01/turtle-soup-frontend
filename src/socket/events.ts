export const SOCKET_CONNECTION_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect'
} as const

export const ROOM_SOCKET_EVENTS = {
  JOIN: 'room:join',
  LEAVE: 'room:leave',
  JOINED: 'room:joined',
  LEFT: 'room:left',
  UPDATED: 'room:update',
  MEMBER_UPDATED: 'room:member:update'
} as const

export const CHAT_SOCKET_EVENTS = {
  SEND_MESSAGE: 'chat:send',
  MESSAGE: 'chat:message',
  HISTORY: 'chat:history'
} as const

export const GAME_SOCKET_EVENTS = {
  SEND_QUESTION: 'game:question:send',
  QUESTION: 'game:question',
  ACTION: 'game:action',
  EVENT: 'game:event',
  SNAPSHOT: 'game:snapshot'
} as const

export const SOCKET_EVENTS = {
  ...SOCKET_CONNECTION_EVENTS,
  ...ROOM_SOCKET_EVENTS,
  ...CHAT_SOCKET_EVENTS,
  ...GAME_SOCKET_EVENTS
} as const
