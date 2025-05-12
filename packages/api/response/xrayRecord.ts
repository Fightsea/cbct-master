export type GetRecordsResponse = {
  date: date;
  images: {
    id: uuid;
    name: string;
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
