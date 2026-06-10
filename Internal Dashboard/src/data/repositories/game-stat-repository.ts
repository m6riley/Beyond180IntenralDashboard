import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../lib/supabase/types';
import type { GameStat } from '../entities';
import { TableRepository } from '../table-repository';
import type { DataResult } from '../types';

export class GameStatRepository extends TableRepository<'GameStat'> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'GameStat');
  }

  async getByEventId(eventId: string): Promise<DataResult<GameStat | null>> {
    return this.wrapQuery(() =>
      this.client
        .from('GameStat')
        .select('*')
        .eq('eventId', eventId)
        .maybeSingle(),
    );
  }

  async getByTeamId(teamId: string): Promise<DataResult<GameStat[]>> {
    return this.wrapListQuery(async () =>
      this.client
        .from('GameStat')
        .select('*')
        .eq('teamId', teamId)
        .order('createdAt', { ascending: false }),
    );
  }

  async getCreatedAtRecords(): Promise<DataResult<Pick<GameStat, 'createdAt'>[]>> {
    return this.wrapQuery(async () =>
      this.client
        .from('GameStat')
        .select('createdAt')
        .order('createdAt', { ascending: true }),
    );
  }
}
