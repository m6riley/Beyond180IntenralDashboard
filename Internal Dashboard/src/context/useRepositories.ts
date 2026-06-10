import { useMemo } from 'react';

import { createRepositories } from '../data/create-repositories';
import { useSupabase } from './DataProvider';

export function useRepositories() {
  const supabase = useSupabase();
  return useMemo(() => createRepositories(supabase), [supabase]);
}
