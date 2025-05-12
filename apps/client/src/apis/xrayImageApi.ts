import ApiService from '@/apis/apiService'

const xrayImageService = new ApiService({})

const xrayImageApi = {
  delete: (id: string) => xrayImageService.delete(`xray/images/${id}`)
}

export default xrayImageApi
