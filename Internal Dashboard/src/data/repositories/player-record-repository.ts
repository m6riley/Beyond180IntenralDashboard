import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../lib/supabase/types';
import type { PlayerRecord } from '../entities';
import { TableRepository } from '../table-repository';
import type { DataResult } from '../types';

export class PlayerRecordRepository extends TableRepository<'PlayerRecord'> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'PlayerRecord');
  }

  async getByTeamId(teamId: string): Promise<DataResult<PlayerRecord[]>> {
    return this.wrapListQuery(async () =>
      this.client
        .from('PlayerRecord')
        .select('*')
        .eq('teamId', teamId)
        .order('lastName', { ascending: true })
        .order('firstName', { ascending: true }),
    );
  }

  async getCount(): Promise<DataResult<number>> {
    return this.wrapQuery(async () => {
      const { count, error } = await this.client
        .from('PlayerRecord')
        .select('*', { count: 'exact', head: true });

      return { data: count ?? 0, error };
    });
  }
}
