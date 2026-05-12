import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    skipAuth?: boolean
  }
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuth?: boolean
}

type AccessTokenGetter = () => string | null | undefined
type UnauthorizedHandler = (error: AxiosError<ApiResponse<unknown>>) => void | Promise<void>

let accessTokenGetter: AccessTokenGetter | null = null
let unauthorizedHandler: UnauthorizedHandler | null = null
let isHandlingUnauthorized = false

export function configureRequest(options: {
  getAccessToken?: AccessTokenGetter
  onUnauthorized?: UnauthorizedHandler
}) {
  accessTokenGetter = options.getAccessToken ?? null
  unauthorizedHandler = options.onUnauthorized ?? null
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000)
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = accessTokenGetter?.()

    if (!config.skipAuth && token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status

    if (status === 401 && unauthorizedHandler && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true

      try {
        await unauthorizedHandler(error)
      } finally {
        isHandlingUnauthorized = false
      }
    }

    return Promise.reject(error)
  }
)

export default request
