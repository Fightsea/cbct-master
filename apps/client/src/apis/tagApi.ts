import ApiService from '@/apis/apiService'
import { CreateRequest, UpdateRequest } from '@cbct/api/request/tag'
import { GetByClinicResponse, CreateResponse } from '@cbct/api/response/tag'

const tagService = new ApiService({})

const tagApi = {
  getByClinic: () => {
    return tagService.get<null, GetByClinicResponse>('tags')
  },
  create: (data: CreateRequest) => {
    return tagService.post<CreateRequest, CreateResponse>('tags', data)
  },
  update: (id: string, data: UpdateRequest) => {
    return tagService.put<UpdateRequest, null>(`tags/${id}`, data)
  },
  delete: (id: string) => {
    return tagService.delete(`tags/${id}`)
  }
}

export default tagApi
