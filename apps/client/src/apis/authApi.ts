import ApiService from '@/apis/apiService'
import { LoginRequest } from '@cbct/api/request/auth'
import { LoginResponse } from '@cbct/api/response/auth'

const authService = new ApiService({})

const authApi = {
  login: (params: LoginRequest) => {
    return authService.post<LoginRequest, LoginResponse>('auth/login', params, undefined, false)
  },
  logout: () => {
    return authService.post('auth/logout', undefined, undefined, false)
  }
}

export default authApi
