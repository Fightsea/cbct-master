export type GetPhotosResponse = {
  [key: date]: {
    id: uuid;
    url: Url;
    date: date;
  }[];
};

type TaggedPhoto = {
  id: uuid;
  url: Url;
};

export type GetTaggedResponse = {
  front: Nullable<TaggedPhoto>;
  profile: Nullable<TaggedPhoto>;
};
