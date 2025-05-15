import ApiService from '@/apis/apiService'
import {
  CreateRequest,
  SearchWithPagingRequest,
  SearchHistoryRequest,
  SwitchStatusRequest,
  UpdatePinnedRequest,
  UpdateRequest
} from '@cbct/api/request/patient'
import {
  CreateResponse,
  GetAvatarResponse,
  GetByIdResponse,
  GetHistoryResponse,
  GetNewSerialNumberResponse,
  GetOsaRiskResponse,
  SearchWithPagingResponse
} from '@cbct/api/response/patient'

const patientService = new ApiService({})

const patientApi = {
  search: (params: SearchWithPagingRequest) => {
    return patientService.get<SearchWithPagingRequest, SearchWithPagingResponse>('patients', params)
  },
  getNewSerialNumber: () => {
    return patientService.get<null, GetNewSerialNumberResponse>('patients/new-sn')
  },
  getById: (id: string) => {
    return patientService.get<null, GetByIdResponse>(`patients/${id}`)
  },
  getAvatar: (id: string) => {
    return patientService.get<null, GetAvatarResponse>(`patients/${id}/avatar`)
  },
  getHistory: (id: string, params: SearchHistoryRequest) => {
    return patientService.get<SearchHistoryRequest, GetHistoryResponse>(`patients/${id}/history`, params)
  },
  getOSARisk: (id: string) => {
    return patientService.get<null, GetOsaRiskResponse>(`patients/${id}/osa-risk`)
  },
  create: (data: CreateRequest) => {
    return patientService.post<CreateRequest, CreateResponse>('patients', data)
  },
  switchStatus: (id: string, data: SwitchStatusRequest) => {
    return patientService.put<SwitchStatusRequest, null>(`patients/${id}/status`, data)
  },
  update: (id: string, data: UpdateRequest) => {
    return patientService.put<UpdateRequest, null>(`patients/${id}`, data)
  },
  updatePinned: (id: string, data: UpdatePinnedRequest) => {
    return patientService.put<UpdatePinnedRequest, null>(`patients/${id}/pinned`, data)
  }
}

export default patientApi
