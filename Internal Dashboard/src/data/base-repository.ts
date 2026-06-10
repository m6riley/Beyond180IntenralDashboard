import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../lib/supabase/types';
import { DataLayerError, toDataLayerError } from './errors';
import type { DataResult } from './types';

export abstract class BaseRepository {
  protected readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  protected handleError<T>(error: PostgrestError | null, data: T | null): DataResult<T> {
    if (error) {
      return {
        data: null,
        error: new DataLayerError(error.message, {
          code: error.code,
          details: error.details,
          hint: error.hint,
        }),
      };
    }

    if (data === null) {
      return {
        data: null,
        error: new DataLayerError('No data returned'),
      };
    }

    return { data, error: null };
  }

  protected async wrapQuery<T>(query: () => PromiseLike<{ data: T | null; error: PostgrestError | null }>): Promise<DataResult<T>> {
    try {
      const { data, error } = await query();
      return this.handleError(error, data);
    } catch (error) {
      return { data: null, error: toDataLayerError(error) };
    }
  }
}
