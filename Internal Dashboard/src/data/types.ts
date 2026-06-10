import type { DataLayerError } from './errors';

export type DataResult<T> =
  | { data: T; error: null }
  | { data: null; error: DataLayerError };

export type QueryOptions = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
};
