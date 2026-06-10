import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../lib/supabase/types';
import type { Team } from '../entities';
import type { TeamLifecycleRecord } from '../team-count-time-series';
import { TableRepository } from '../table-repository';
import type { DataResult } from '../types';

export class TeamRepository extends TableRepository<'Team'> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'Team');
  }

  async getActive(): Promise<DataResult<Team[]>> {
    return this.wrapListQuery(async () =>
      this.client
        .from('Team')
        .select('*')
        .is('deletedAt', null)
        .order('name', { ascending: true }),
    );
  }

  async getByYear(year: number): Promise<DataResult<Team[]>> {
    return this.wrapListQuery(async () =>
      this.client
        .from('Team')
        .select('*')
        .eq('year', year)
        .is('deletedAt', null)
        .order('name', { ascending: true }),
    );
  }

  async getLifecycleRecords(): Promise<DataResult<TeamLifecycleRecord[]>> {
    return this.wrapQuery(async () =>
      this.client
        .from('Team')
        .select('createdAt, deletedAt')
        .order('createdAt', { ascending: true }),
    );
  }

  async getMemberLists(): Promise<
    DataResult<Pick<Team, 'staff' | 'fans'>[]>
  > {
    return this.wrapQuery(async () =>
      this.client
        .from('Team')
        .select('staff, fans')
        .is('deletedAt', null),
    );
  }
}
