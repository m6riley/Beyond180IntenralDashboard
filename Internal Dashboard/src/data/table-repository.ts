import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

import type { Database, TablesInsert, TablesRow, TablesUpdate } from '../lib/supabase/types';
import { BaseRepository } from './base-repository';
import type { DataResult, QueryOptions } from './types';

type TableName = keyof Database['public']['Tables'];

type TableWithId = {
  [K in TableName]: TablesRow<K> extends { id: string } ? K : never;
}[TableName];

export class TableRepository<T extends TableName> extends BaseRepository {
  constructor(
    client: SupabaseClient<Database>,
    private readonly tableName: T,
  ) {
    super(client);
  }

  async getAll(options?: QueryOptions): Promise<DataResult<TablesRow<T>[]>> {
    return this.wrapListQuery(async () => {
      let query = this.client.from(this.tableName).select('*');

      if (options?.orderBy) {
        query = query.order(options.orderBy, {
          ascending: options.ascending ?? true,
        });
      }
      if (options?.limit !== undefined) {
        query = query.limit(options.limit);
      }
      if (options?.offset !== undefined) {
        const limit = options.limit ?? 50;
        query = query.range(options.offset, options.offset + limit - 1);
      }

      return (await query) as {
        data: TablesRow<T>[] | null;
        error: PostgrestError | null;
      };
    });
  }

  async getById(id: string): Promise<DataResult<TablesRow<TableWithId>>> {
    return this.wrapQuery(async () =>
      (await this.client
        .from(this.tableName as TableWithId)
        .select('*')
        .eq('id', id)
        .single()) as {
        data: TablesRow<TableWithId> | null;
        error: PostgrestError | null;
      },
    );
  }

  async create(row: TablesInsert<T>): Promise<DataResult<TablesRow<T>>> {
    return this.wrapQuery(async () =>
      (await this.client
        .from(this.tableName)
        .insert(row as never)
        .select()
        .single()) as {
        data: TablesRow<T> | null;
        error: PostgrestError | null;
      },
    );
  }

  async update(
    id: string,
    row: TablesUpdate<TableWithId>,
  ): Promise<DataResult<TablesRow<TableWithId>>> {
    return this.wrapQuery(async () =>
      (await this.client
        .from(this.tableName as TableWithId)
        .update(row)
        .eq('id', id)
        .select()
        .single()) as {
        data: TablesRow<TableWithId> | null;
        error: PostgrestError | null;
      },
    );
  }

  async delete(id: string): Promise<DataResult<null>> {
    return this.wrapQuery(async () => {
      const { error } = await this.client
        .from(this.tableName as TableWithId)
        .delete()
        .eq('id', id);
      return { data: null, error };
    });
  }

  protected async wrapListQuery(
    query: () => PromiseLike<{
      data: TablesRow<T>[] | null;
      error: PostgrestError | null;
    }>,
  ): Promise<DataResult<TablesRow<T>[]>> {
    return this.wrapQuery(query);
  }
}
