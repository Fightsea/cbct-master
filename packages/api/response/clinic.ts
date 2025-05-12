export type GetAffiliatedResponse = {
  id: uuid;
  name: string;
  address: string;
  userCount: number;
}[];

export type GetPhotoResponse = Url;
