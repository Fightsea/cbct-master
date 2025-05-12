declare global {
  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  type ResponseBase = {
    success: boolean;
    message?: string;
  }

  type SuccessHttpResponse<T> = ResponseBase & {
    data?: T;
  }

  type ErrorHttpResponse = ResponseBase & {
    code: string;
  }

  type SearchQuery = {
    search?: string;
    page: number;
    size: number;
    order: string;
    sort: 'asc' | 'desc';
  }

  type SearchResponse<T> = SearchQuery & {
    results: T[];
    total: number;
  }
}

export {};
