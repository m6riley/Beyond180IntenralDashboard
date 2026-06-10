import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../lib/supabase/types';
import { TableRepository } from '../table-repository';

export class UserRepository extends TableRepository<'User'> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'User');
  }
}
