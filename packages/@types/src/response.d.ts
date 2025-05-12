declare global {
  type SearchResponse<T> = SearchQuery & {
    results: T[];
    total: number;
  }

  type NoData = undefined;

  type TimeStampResponse = {
    createdAt: datetime;
    updatedAt: datetime;
  }

  type SoftDeleteTimeStampResponse = TimeStampResponse & {
    deletedAt: Nullable<datetime>;
  }
}

export {};
