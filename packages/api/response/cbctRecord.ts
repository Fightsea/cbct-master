import type { CbctAiModel, CbctAiOutputStatus } from '@cbct/enum/cbct';

export type GetRecordsResponse = {
  id: uuid;
  date: date;
  images: {
    id: uuid;
    name: string;
    url: Url;
  }[];
  views: {
    id: uuid;
    url: Url;
  }[];
}[];

export type GetByIdResponse = TimeStampResponse & {
  id: uuid;
  patientId: uuid;
  directory: string;
  images: {
    originalName: string;
    url: Url;
  }[];
};

export type GetAiOutputResponse = Nullable<{
  id: uuid;
  date: date;
  model: CbctAiModel;
  status: CbctAiOutputStatus;
  risk: Nullable<string>;
  phenotype: Nullable<string>;
  phenotypeImageUrl: Nullable<Url>;
  treatmentDescription: Nullable<string>;
  treatmentImageUrl: Nullable<Url>;
  prescription: Nullable<string>;
  fileUrl: Nullable<Url>;
}>;

export type CreateResponse = {
  id: uuid;
};
