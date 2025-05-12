import ApiService from '@/apis/apiService'
import { type CreateRequest } from '@cbct/api/request/cbctAiOutput'
import { type GetInputImagesResponse } from '@cbct/api/response/cbctAiOutput'
import { GetAiOutputResponse } from '@cbct/api/response/cbctRecord'

const cbctAiOutputService = new ApiService({})

const cbctAiOutputApi = {
  getImages: async (id: uuid) => {
    return cbctAiOutputService.get<null, GetInputImagesResponse>(`/cbct/ai-outputs/${id}/images/input`)
  },
  create: async (params: CreateRequest) => {
    return cbctAiOutputService.post('/cbct/ai-outputs', params)
  },
  getAiOutput: async (id: uuid) => {
    return cbctAiOutputService.get<null, GetAiOutputResponse>(`/cbct/records/${id}/ai-output`)
  }
}

export default cbctAiOutputApi
