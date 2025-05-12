export type Tag = {
  id: uuid;
  name: string;
  color: string;
};

export type GetByClinicResponse = Tag[];

export type CreateResponse = {
  id: uuid;
}
