import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

declare global {
  interface DataResponse<T> extends Response<SuccessHttpResponse<T>> {}

  interface NoDataResponse extends Response<SuccessHttpResponse<NoData>> {}

  interface BodyRequest<T> extends Request {
    body: T;
  }

  interface QueryRequest<T> extends Request {
    query: T & ParsedQs;
  }

  type IdHeader = uuid | undefined;

  type RequestDataSource = 'body' | 'query' | 'params' | 'headers';
}

export {};
