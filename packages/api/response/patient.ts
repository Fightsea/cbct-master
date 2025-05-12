import { TreatmentStatus } from '@cbct/enum/patient';
import { Gender } from '@cbct/enum/user';
import { DiagnosisAnalysisType } from '@cbct/enum/diagnosisAnalysis';
import { Tag } from './tag';

export type PatientList = {
  id: uuid;
  pinned: boolean;
  serialNumber: string;
  treatmentStatus: TreatmentStatus;
  name: string;
  osaRisk: Nullable<boolean>;
  note: string;
  createdAt: datetime;
  tags: Tag[];
};

export type SearchWithPagingResponse = SearchResponse<PatientList>;

export type GetNewSerialNumberResponse = string;

export type GetByIdResponse = Nullable<SoftDeleteTimeStampResponse & {
  id: uuid;
  pinned: boolean;
  serialNumber: string;
  email: string;
  idNumber: string;
  treatmentStatus: TreatmentStatus;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthday: date;
  phone: string;
  height: number;
  weight: number;
  note: string;
  clinicId: uuid;
  tags: Tag[];
  bmi: number;
}>;

export type GetAvatarResponse = Url;

export type GetHistoryResponse = {
  id: uuid;
  date: date;
  type: DiagnosisAnalysisType;
  subject: string;
  description: string;
  tags: Omit<Tag, 'id'>[];
}[];

export type GetOsaRiskResponse = Nullable<string>;

export type CreateResponse = {
  id: uuid;
  serialNumber: string;
};
