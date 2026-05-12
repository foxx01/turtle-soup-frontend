import request, { type ApiResponse } from './request'

export interface UserStats {
  gamesPlayed: number
  wins: number
  rating: number
  badges: number
}

export interface UserPreferences {
  locale: string
  soundEnabled: boolean
  notificationsEnabled: boolean
  preferredRoomCapacity: number
}

export interface UserProfile {
  id: string
  username: string
  nickname: string
  email: string
  avatar: string
  bio: string
  roles: string[]
  stats: UserStats
  preferences: UserPreferences
}

export interface UpdateCurrentUserProfileParams {
  nickname?: string
  email?: string
  avatar?: string
  bio?: string
}

export interface UpdateCurrentUserPreferencesParams {
  locale?: string
  soundEnabled?: boolean
  notificationsEnabled?: boolean
  preferredRoomCapacity?: number
}

export interface ChangePasswordParams {
  currentPassword: string
  nextPassword: string
}

export function getCurrentUserProfile() {
  return request.get<ApiResponse<UserProfile>>('/users/me')
}

export function updateCurrentUserProfile(params: UpdateCurrentUserProfileParams) {
  return request.patch<ApiResponse<UserProfile>>('/users/me', params)
}

export function updateCurrentUserPreferences(params: UpdateCurrentUserPreferencesParams) {
  return request.patch<ApiResponse<UserPreferences>>('/users/me/preferences', params)
}

export function changeCurrentUserPassword(params: ChangePasswordParams) {
  return request.post<ApiResponse<null>>('/users/me/change-password', params)
}

export function getUserProfileById(userId: string) {
  return request.get<ApiResponse<UserProfile>>(`/users/${userId}`)
}
