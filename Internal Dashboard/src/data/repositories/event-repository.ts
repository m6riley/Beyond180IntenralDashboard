import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../lib/supabase/types';
import type { Event } from '../entities';
import { TableRepository } from '../table-repository';
import type { DataResult } from '../types';

export class EventRepository extends TableRepository<'Event'> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'Event');
  }

  async getByTeamId(teamId: string): Promise<DataResult<Event[]>> {
    return this.wrapListQuery(async () =>
      this.client
        .from('Event')
        .select('*')
        .eq('teamId', teamId)
        .order('startDateTime', { ascending: true }),
    );
  }

  async getUpcomingByTeamId(teamId: string): Promise<DataResult<Event[]>> {
    const now = new Date().toISOString();
    return this.wrapListQuery(async () =>
      this.client
        .from('Event')
        .select('*')
        .eq('teamId', teamId)
        .gte('startDateTime', now)
        .order('startDateTime', { ascending: true }),
    );
  }
}
