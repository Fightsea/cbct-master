import ApiService from '@/apis/ApiService';
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ConvertToNiiRequest,
  GetDisplayImageUrlsRequest,
  GetDisplayImageUrlsResponse
} from '@/apis/types/osaPhenotyping';

const osaPhenotypingService = new ApiService({ baseURL: process.env.OSA_PHENOTYPING_API_ORIGIN });

const osaPhenotypingApi = {
  analyze: (data: AnalyzeRequest) => {
    return osaPhenotypingService.post<undefined, AnalyzeResponse>(
      'v0.1.3/api/phenotype',
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        params: data,
        timeout: 600000
      }
    );
  },
  convertToNii: (data: ConvertToNiiRequest) => {
    const encoder = new TextEncoder();
    const binaryData = encoder.encode(JSON.stringify(data));
    const blob = new Blob([binaryData], { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', blob, 'data.json');

    return osaPhenotypingService.post<FormData, ArrayBuffer>(
      'v0.1.3/api/reconstruct_3d_from_json',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/gzip'
        },
        responseType: 'arraybuffer',
        timeout: 600000
      }
    );
  },
  getDisplayViewUrls: async (data: GetDisplayImageUrlsRequest): Promise<Url[]> => {
    return osaPhenotypingService.post<undefined, GetDisplayImageUrlsResponse>(
      'v0.1.3/api/get_three_views',
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        params: data,
        timeout: 600000
      }
    ).then(({ views }) => Object.values(views));
  }
};

export default osaPhenotypingApi;
