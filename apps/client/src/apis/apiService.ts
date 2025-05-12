import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import retry from 'retry'
import { authStore } from '@/stores/authStore'
import { type RefreshTokenResponse } from '@cbct/api/response/auth'

// Default API root
export const API_SERVER = process.env.NEXT_PUBLIC_API_ORIGIN ? `${process.env.NEXT_PUBLIC_API_ORIGIN}/api` : '/api'
const TIMEOUT = 60000
const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

class ApiService {
  service: AxiosInstance

  static isTokenRefreshing = false

  constructor({ baseURL = API_SERVER, timeout = TIMEOUT, headers = HEADERS }) {
    const service = axios.create({
      withCredentials: true,
      baseURL,
      timeout,
      headers
    })

    const accessToken = authStore.getState().accessToken

    service.interceptors.request.use(
      config => {
        if (!config.url?.includes('login') && !config.url?.includes('refresh-token')) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
      },
      e => Promise.reject(e)
    )

    service.interceptors.response.use(this.handleSuccess, this.handleError)
    this.service = service
  }

  handleSuccess<T>(response: AxiosResponse<T>) {
    return response
  }

  async handleError(error: AxiosError<Error>) {
    if (error.response === undefined || error.response.status !== 401) return

    const notNeedAccessTokenApiRouteArray = ['login', 'logout', 'refresh-token']
    if (notNeedAccessTokenApiRouteArray.some(route => error.response!.config.url!.includes(route))) return

    const { refreshToken, email, login, logout } = authStore.getState()

    if (!ApiService.isTokenRefreshing) {
      ApiService.isTokenRefreshing = true

      return axios.get(`${API_SERVER}/auth/refresh-token`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
        .then(res => {
          const { user, accessToken, refreshToken } = res.data.data as RefreshTokenResponse

          // Update auth store
          login({ user, accessToken, refreshToken }, email)

          // Re-add access token in header
          error.config!.headers.Authorization = `Bearer ${accessToken}`

          // Re-request to target api
          return axios.request(error.config!)
        })
        .catch(() => {
          logout()
          window.location.href = '/login'
        })
        .finally(() => {
          ApiService.isTokenRefreshing = false
        })
    } else {
      return new Promise((resolve, reject) => {
        const retries = 5
        const operation = retry.operation({ retries })

        operation.attempt(attempt => {
          if (ApiService.isTokenRefreshing) {
            if (attempt - 1 === retries) {
              reject(Error('FETCH_TIMEOUT_ERROR'))
            }

            operation.retry(Error('WAITING'))
          } else {
            const accessToken = authStore.getState().accessToken

            // Re-add access token in header
            error.config!.headers.Authorization = `Bearer ${accessToken}`

            // Re-request to target api
            resolve(axios.request(error.config!))
          }
        })
      })
    }
  }

  async addClinicIdHeader(config: AxiosRequestConfig) {
    const currentClinicId = authStore.getState().clinicId
    if (!currentClinicId) return

    if (!config.headers) config.headers = {}
    config.headers['x-clinic-id'] = currentClinicId
    return config
  }

  async get<T, R>(
    path: string,
    params?: T,
    config: AxiosRequestConfig = {},
    isBlob = false,
    isNeedClinicId = true
  ): Promise<R> {
    if (isNeedClinicId) await this.addClinicIdHeader(config)

    return this.service.get(path, { params, ...config }).then(res => {
      if (isBlob) return res.data
      return res.data.data
    })
  }

  async post<T, R>(
    path: string,
    data?: T,
    config: AxiosRequestConfig = {},
    isNeedClinicId = true
  ): Promise<R & { message?: string }> {
    if (isNeedClinicId) await this.addClinicIdHeader(config)

    return this.service.post(path, data, config).then(res => {
      return {
        message: res?.data?.message,
        ...res?.data?.data
      }
    })
  }

  async put<T, R>(
    path: string,
    data?: T,
    config: AxiosRequestConfig = {},
    isNeedClinicId = true
  ): Promise<R> {
    if (isNeedClinicId) await this.addClinicIdHeader(config)

    return this.service.put(path, data, config).then(res => res?.data?.data)
  }

  async patch<T, R>(
    path: string,
    data?: T,
    config: AxiosRequestConfig = {},
    isNeedClinicId = true
  ): Promise<R> {
    if (isNeedClinicId) await this.addClinicIdHeader(config)

    return this.service.patch(path, data, config).then(res => res?.data?.data)
  }

  async delete<T, R>(
    path: string,
    data?: T,
    config: AxiosRequestConfig = {},
    isNeedClinicId = true
  ): Promise<R> {
    if (isNeedClinicId) await this.addClinicIdHeader(config)

    return this.service.delete(path, { data, ...config }).then(res => res?.data?.data)
  }
}

export default ApiService
