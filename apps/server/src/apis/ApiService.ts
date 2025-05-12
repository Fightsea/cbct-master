import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  service: AxiosInstance;

  constructor({
    baseURL = '',
    timeout = 60000,
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials = true
  }) {
    const service = axios.create({
      withCredentials,
      baseURL,
      timeout,
      headers
    });

    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess<T>(response: AxiosResponse<T>) {
    return response;
  }

  handleError(error: AxiosError<Error>) {
    return Promise.reject(error);
  }

  async get<TQuery, TResponse>(path: string, params?: TQuery, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.service.get(path, { ...config, params }).then(res => res.data);
  }

  async post<TData, TResponse>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.service.post(path, data, config).then(res => res.data);
  }

  async put<TData, TResponse>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.service.put(path, data, config).then(res => res.data);
  }

  async delete<TData, TResponse>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.service.delete(path, { ...config, data }).then(res => res.data);
  }
}

export default ApiService;
