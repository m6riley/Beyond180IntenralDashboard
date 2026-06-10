import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../lib/supabase/types';
import type { SubTeam } from '../entities';
import { TableRepository } from '../table-repository';
import type { DataResult } from '../types';

export class SubTeamRepository extends TableRepository<'SubTeam'> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'SubTeam');
  }

  async getByTeamId(teamId: string): Promise<DataResult<SubTeam[]>> {
    return this.wrapListQuery(async () =>
      this.client
        .from('SubTeam')
        .select('*')
        .eq('teamId', teamId)
        .order('name', { ascending: true }),
    );
  }
}
