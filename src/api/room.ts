import request, {
  type ApiResponse,
  type PaginatedData,
  type PaginationParams
} from './request'

export type RoomMode = 'casual' | 'ranked' | 'private'
export type RoomStatus = 'waiting' | 'playing' | 'closed'

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

export interface RoomListParams extends PaginationParams {
  keyword?: string
  mode?: RoomMode | 'all'
  status?: RoomStatus | 'all'
}

export interface CreateRoomParams {
  name: string
  description: string
  mode: RoomMode
  capacity: number
  isPrivate?: boolean
  allowSpectators?: boolean
}

export interface UpdateRoomParams {
  name?: string
  description?: string
  mode?: RoomMode
  capacity?: number
  allowSpectators?: boolean
}

export interface JoinRoomParams {
  password?: string
}

export interface UpdateReadyStatusParams {
  ready: boolean
}

export function getRoomList(params?: RoomListParams) {
  return request.get<ApiResponse<PaginatedData<RoomSummary>>>('/rooms', {
    params
  })
}

export function getRoomDetail(roomId: string) {
  return request.get<ApiResponse<RoomDetail>>(`/rooms/${roomId}`)
}

export function createRoom(params: CreateRoomParams) {
  return request.post<ApiResponse<RoomDetail>>('/rooms', params)
}

export function updateRoom(roomId: string, params: UpdateRoomParams) {
  return request.patch<ApiResponse<RoomDetail>>(`/rooms/${roomId}`, params)
}

export function joinRoom(roomId: string, params?: JoinRoomParams) {
  return request.post<ApiResponse<RoomDetail>>(`/rooms/${roomId}/join`, params)
}

export function leaveRoom(roomId: string) {
  return request.post<ApiResponse<null>>(`/rooms/${roomId}/leave`)
}

export function updateRoomReadyStatus(roomId: string, params: UpdateReadyStatusParams) {
  return request.patch<ApiResponse<RoomMember>>(`/rooms/${roomId}/ready-status`, params)
}

export function removeRoomMember(roomId: string, memberId: string) {
  return request.delete<ApiResponse<null>>(`/rooms/${roomId}/members/${memberId}`)
}
