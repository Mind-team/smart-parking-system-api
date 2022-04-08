export interface IQueryOptions {
  disableLean?: boolean;
}

export interface ICollection<T> {
  findOne: (
    filter: { [key: string]: any },
    options?: IQueryOptions,
  ) => Promise<T> | null;
  findById: (id: string, options?: IQueryOptions) => Promise<T> | null;
  findManyById: (ids: string[], options?: IQueryOptions) => Promise<T[]> | null;
  findMany: (filter: {
    [key: string]: any;
    options?: IQueryOptions;
  }) => Promise<T[]> | null;
  save: (content: T) => Promise<void>;
  updateOne: (filter: { [key: string]: any }, update: T) => Promise<void>;
  deleteOne: (filter: { [key: string]: any }) => Promise<void>;
  all: (options?: IQueryOptions) => Promise<T[]>;
}
