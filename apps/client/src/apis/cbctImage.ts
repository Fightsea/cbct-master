import ApiService from '@/apis/apiService'

const cbctImageService = new ApiService({})

const cbctImageApi = {
  delete: (id: string) => cbctImageService.delete(`cbct/images/${id}`)
}

export default cbctImageApi
