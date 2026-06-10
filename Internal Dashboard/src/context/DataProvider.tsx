import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from '../lib/supabase/client';
import type { Database } from '../lib/supabase/types';

type DataContextValue = {
  supabase: SupabaseClient<Database>;
};

const DataContext = createContext<DataContextValue | null>(null);

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const value = useMemo(
    () => ({
      supabase: getSupabaseClient(),
    }),
    [],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSupabase(): SupabaseClient<Database> {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useSupabase must be used within a DataProvider');
  }

  return context.supabase;
}
