import { CompleteRequest } from '@cbct/api/request/cbctAiOutput';

export type AnalyzeRequest = {
  user_id: string;
  age: number;
  sex: string;
  bmi: number;
  image: string;
};

export type AnalyzeResponse = CompleteRequest;

export type ConvertToNiiRequest = CompleteRequest;

export type GetDisplayImageUrlsRequest = {
  user_id: string;
  image: string;
};

export type GetDisplayImageUrlsResponse = {
  statusCode: number;
  user_id: string;
  views: Record<string, Url>;
};
