import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getEnvConfig } from '../../config/env';
import type { Database } from './types';

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getEnvConfig();
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
}

export function resetSupabaseClient(): void {
  supabaseClient = null;
}
