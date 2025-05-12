export type GetRecordsResponse = {
  date: date;
  files: {
    id: uuid;
    name: string;
    url: Url;
  }[];
}[];

export type GetByIdResponse = TimeStampResponse & {
  id: uuid;
  patientId: uuid;
  directory: string;
  files: {
    originalName: string;
    url: Url;
  }[];
};
