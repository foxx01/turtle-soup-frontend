import request, { type ApiResponse } from './request'

export type GamePhase = 'idle' | 'waiting' | 'countdown' | 'playing' | 'settlement' | 'finished'
export type GameActionType = 'submit' | 'skip' | 'system'

export interface ScoreboardItem {
  userId: string
  nickname: string
  score: number
}

export interface GameActionRecord {
  id: string
  roomId: string
  actorId: string
  actorName: string
  type: GameActionType
  content: string
  createdAt: string
}

export interface GameSnapshot {
  roomId: string
  phase: GamePhase
  currentRound: number
  totalRounds: number
  timerSeconds: number
  prompt: string
  scoreboard: ScoreboardItem[]
  actionHistory: GameActionRecord[]
}

export interface StartGameParams {
  roomId: string
}

export interface SubmitGameActionParams {
  content: string
  type?: Extract<GameActionType, 'submit' | 'skip'>
}

export interface AdvanceGameRoundParams {
  nextRound?: number
}

export function getGameSnapshot(roomId: string) {
  return request.get<ApiResponse<GameSnapshot>>(`/rooms/${roomId}/game`)
}

export function startGame(params: StartGameParams) {
  return request.post<ApiResponse<GameSnapshot>>(`/rooms/${params.roomId}/game/start`)
}

export function submitGameAction(roomId: string, params: SubmitGameActionParams) {
  return request.post<ApiResponse<GameActionRecord>>(`/rooms/${roomId}/game/actions`, params)
}

export function advanceGameRound(roomId: string, params?: AdvanceGameRoundParams) {
  return request.post<ApiResponse<GameSnapshot>>(`/rooms/${roomId}/game/round/advance`, params)
}

export function endGame(roomId: string) {
  return request.post<ApiResponse<GameSnapshot>>(`/rooms/${roomId}/game/end`)
}
