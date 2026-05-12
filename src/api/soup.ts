import request, {
  type ApiResponse,
  type PaginatedData,
  type PaginationParams
} from './request'

export type SoupDifficulty = 'easy' | 'medium' | 'hard'

export interface SoupSummary {
  id: string
  title: string
  subtitle: string
  description: string
  difficulty: SoupDifficulty
  questionCount: number
  createdAt: string
  updatedAt: string
}

export interface SoupDetail extends SoupSummary {
  content: string
  answer: string
  tags: string[]
}

export interface SoupListParams extends PaginationParams {
  keyword?: string
  difficulty?: SoupDifficulty
  tag?: string
}

export interface CreateSoupParams {
  title: string
  subtitle?: string
  description: string
  difficulty: SoupDifficulty
  content: string
  answer: string
  tags?: string[]
}

export interface UpdateSoupParams {
  title?: string
  subtitle?: string
  description?: string
  difficulty?: SoupDifficulty
  content?: string
  answer?: string
  tags?: string[]
}

export function getSoupList(params?: SoupListParams) {
  return request.get<ApiResponse<PaginatedData<SoupSummary>>>('/soups', {
    params
  })
}

export function getSoupDetail(soupId: string) {
  return request.get<ApiResponse<SoupDetail>>(`/soups/${soupId}`)
}

export function createSoup(params: CreateSoupParams) {
  return request.post<ApiResponse<SoupDetail>>('/soups', params)
}

export function updateSoup(soupId: string, params: UpdateSoupParams) {
  return request.patch<ApiResponse<SoupDetail>>(`/soups/${soupId}`, params)
}

export function deleteSoup(soupId: string) {
  return request.delete<ApiResponse<null>>(`/soups/${soupId}`)
}
